"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";
import FormInput from "../ui/FormInput";
import FormSelect from "../ui/FormSelect";
import FormTextarea from "../ui/FormTextarea";
import PrimaryButton from "../ui/PrimaryButton";
import LoadingOverlay from "../ui/LoadingOverlay";
import { PROJECT_TYPES, BUDGET_RANGES } from "../../constants/contact";
import { submitEnquiryAction } from "@/lib/enquiries/actions";
import { useReferralVerification } from "@/lib/hooks/useReferralVerification";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { trackGenerateLead } from "@/lib/analytics";

// ── Form schema ─────────────────────────────────────────────────────────
const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid work email" }),
  phone: z.string().optional(),
  company: z.string().optional(),
  projectType: z.string().min(1, { message: "Please select a project type" }),
  budget: z.string().min(1, { message: "Please select a budget range" }),
  couponCode: z.string().optional().refine((val) => !val || val.length >= 3, {
    message: "Referral code must have a minimum of 3 characters",
  }),
  message: z.string().min(10, { message: "Project details must be at least 10 characters" }),
  botField: z.string().optional(),
});

type ContactFormFields = z.infer<typeof contactSchema>;



// ── Component ───────────────────────────────────────────────────────────
export default function ContactForm({ isDark = false }: { isDark?: boolean }) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Overlay loading state — one continuous loading sequence for the entire
  // verify-then-submit flow. Title changes smoothly without hiding overlay.
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayTitle, setOverlayTitle] = useState("Processing...");
  const [overlayDescription, setOverlayDescription] = useState<
    string | undefined
  >(undefined);

  // Guard against double-click / Enter-spam / re-entrant submit calls.
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  // ── Referral verification hook ──────────────────────────────────────
  // All debounce, blur, caching, and race-condition logic is isolated here.
  const referral = useReferralVerification();

  // ── React Hook Form ─────────────────────────────────────────────────
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormFields>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      projectType: "",
      budget: "",
      couponCode: "",
      message: "",
      botField: "",
    },
  });

  // Whether the form is in a busy state (overlay visible or submitting).
  const isBusy = showOverlay || isSubmitting || isSubmittingForm;

  // Sync service preselection from query param on client mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const serviceParam = params.get("service");
      if (serviceParam) {
        const matched = PROJECT_TYPES.find((t) => t.value === serviceParam);
        if (matched) {
          setValue("projectType", matched.value);
        }
      }
    }
  }, [setValue]);

  // ── Referral input handlers ─────────────────────────────────────────
  // onChange: sanitize input, sync with react-hook-form, delegate to hook.
  // No API call happens here — the hook manages debounce internally.
  const handleReferralChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const sanitized = raw
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .trim();

      // Sync the sanitized value with react-hook-form.
      setValue("couponCode", sanitized, { shouldValidate: false });
      // Clear any previous form-level coupon errors when the user edits.
      clearErrors("couponCode");
      if (submitError) setSubmitError(null);
      // Delegate change to the verification hook (manages debounce + cache).
      referral.handleChange(sanitized);
    },
    [setValue, clearErrors, referral, submitError]
  );

  // onBlur: cancel debounce and verify immediately if needed.
  const handleReferralBlur = useCallback(() => {
    referral.handleBlur();
  }, [referral]);

  // ── Submit flow ─────────────────────────────────────────────────────
  // Step 1: react-hook-form validates required fields via Zod schema.
  // Step 2: If referral code is empty → skip verification, submit directly.
  // Step 3: If referral code is filled → check cache, or run verification
  //         behind a full-page overlay, then submit if valid.
  const onSubmit = useCallback(
    async (data: ContactFormFields) => {
      // Prevent duplicate submissions.
      if (isSubmittingForm) return;
      setIsSubmittingForm(true);
      setSubmitError(null);

      // Bot honeypot check
      if (data.botField && data.botField.trim().length > 0) {
        setIsSubmitted(true);
        setIsSubmittingForm(false);
        return;
      }

      const couponValue = data.couponCode?.trim() || "";
      const needsVerification = couponValue.length > 0;

      try {
        // ── Referral verification (if needed) ───────────────────────────
        if (needsVerification) {
          // Show overlay with verification message.
          setOverlayTitle("Verifying referral...");
          setOverlayDescription("Please wait while we check your code.");
          setShowOverlay(true);

          const isValid = await referral.verifyIfNeeded();

          if (!isValid) {
            // Verification failed — hide overlay, show inline error, stop.
            setShowOverlay(false);
            const errorMsg =
              referral.verificationError || "Invalid referral code.";
            setError("couponCode", { type: "custom", message: errorMsg });
            setIsSubmittingForm(false);
            return;
          }

          // Verification passed — keep overlay visible, transition the title
          // smoothly to the submission phase.
          setOverlayTitle("Sending your enquiry...");
          setOverlayDescription("Almost there...");
        } else {
          // No referral code — show overlay for the submission phase only.
          setOverlayTitle("Sending your enquiry...");
          setOverlayDescription(undefined);
          setShowOverlay(true);
        }

        // ── Form submission ────────────────────────────────────────────
        const result = await submitEnquiryAction({
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          company: data.company || null,
          service: data.projectType,
          budget: data.budget,
          couponCode: couponValue || null,
          message: data.message,
          botField: data.botField || null,
        });

        if (!result.success) {
          setShowOverlay(false);
          const errorMsg =
            result.error ||
            "We couldn't submit your enquiry right now. Your entered details have been preserved. Please try again.";
          setSubmitError(errorMsg);
          toast.error(errorMsg);
          return;
        }

        // Track successful submission.
        trackGenerateLead("contact");

        // ── Success ──────────────────────────────────────────────────
        setShowOverlay(false);
        setIsSubmitted(true);
        setSubmitError(null);
        toast.success(
          "Thank you for contacting HexaKode! Your enquiry has been submitted successfully."
        );
      } catch (err) {
        console.error("Enquiry submission error:", err);
        setShowOverlay(false);
        const errorMsg =
          "We couldn't submit your enquiry right now. Your entered details have been preserved. Please try again.";
        setSubmitError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setIsSubmittingForm(false);
      }
    },
    [referral, setError, isSubmittingForm]
  );

  // ── Form reset (after success state) ────────────────────────────────
  const handleReset = useCallback(() => {
    reset();
    referral.reset();
    setIsSubmitted(false);
    setShowOverlay(false);
    setSubmitError(null);
  }, [reset, referral]);

  // ── Derive referral field status for display ────────────────────────
  const showReferralSuccess = referral.verificationStatus === "valid";
  const showReferralSpinner = referral.isVerifying;
  // Show the hook's verification error only when there is no form-level
  // error (form errors take precedence for inline display).
  const referralInlineError =
    errors.couponCode?.message ||
    (referral.verificationStatus === "invalid"
      ? referral.verificationError
      : null);

  return (
    <>
      {/* Full-page loading overlay — one continuous loading sequence */}
      <LoadingOverlay
        open={showOverlay}
        title={overlayTitle}
        description={overlayDescription}
      />

      <div
        id="contact-form"
        className={cn(
          "lg:col-span-8 p-8 md:p-12 rounded-xl transition-all duration-300 ease-out scroll-mt-28 md:scroll-mt-36",
          isDark
            ? "glass-form-premium text-white"
            : "glass-card text-on-background border border-outline-variant/10 shadow-sm"
        )}
      >
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.form
              key="contact-form-element"
              initial={false}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-8"
              aria-busy={isBusy}
              noValidate
            >
              {/* Submission Error Alert */}
              {submitError && (
                <div
                  role="alert"
                  aria-live="polite"
                  className="p-4 rounded-xl bg-error/10 border border-error/25 text-error flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="text-body-sm leading-relaxed">
                    <p className="font-semibold mb-0.5">Submission failed</p>
                    <p>{submitError}</p>
                  </div>
                </div>
              )}

              {/* Bot Honeypot Field */}
              <div
                className="hidden"
                aria-hidden="true"
                style={{ display: "none" }}
              >
                <label htmlFor="botField">Leave this field blank</label>
                <input
                  id="botField"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  {...register("botField")}
                />
              </div>

              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Full Name"
                  id="name"
                  placeholder="John Doe"
                  required={true}
                  autoComplete="name"
                  error={errors.name?.message}
                  {...register("name")}
                  disabled={isBusy}
                  isDark={isDark}
                />
                <FormInput
                  label="Work Email"
                  id="email"
                  type="email"
                  placeholder="john@company.com"
                  required={true}
                  autoComplete="email"
                  error={errors.email?.message}
                  {...register("email")}
                  disabled={isBusy}
                  isDark={isDark}
                />
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Phone Number"
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  required={false}
                  autoComplete="tel"
                  error={errors.phone?.message}
                  {...register("phone")}
                  disabled={isBusy}
                  isDark={isDark}
                />
                <FormInput
                  label="Company Name"
                  id="company"
                  placeholder="HexaKode Engineering"
                  required={false}
                  autoComplete="organization"
                  error={errors.company?.message}
                  {...register("company")}
                  disabled={isBusy}
                  isDark={isDark}
                />
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormSelect
                  label="Project Type"
                  id="project_type"
                  placeholder="Select an option"
                  required={true}
                  options={PROJECT_TYPES}
                  error={errors.projectType?.message}
                  {...register("projectType")}
                  disabled={isBusy}
                  isDark={isDark}
                />
                <FormSelect
                  label="Estimated Budget"
                  id="budget"
                  placeholder="Select range"
                  required={true}
                  options={BUDGET_RANGES}
                  error={errors.budget?.message}
                  {...register("budget")}
                  disabled={isBusy}
                  isDark={isDark}
                />
              </div>

              {/* Referral Code — controlled input with debounce/blur verification */}
              <div className="flex flex-col w-full">
                <div className="relative">
                  <FormInput
                    label="Referral Code"
                    id="couponCode"
                    placeholder="Enter referral code (optional)"
                    required={false}
                    autoComplete="off"
                    error={referralInlineError ?? undefined}
                    value={referral.referralCode}
                    onChange={handleReferralChange}
                    onBlur={handleReferralBlur}
                    disabled={isBusy}
                    isDark={isDark}
                  />
                  {/* Spinner indicator while verification is in flight */}
                  {showReferralSpinner && (
                    <div className="absolute right-3 bottom-3 text-secondary">
                      <Loader2 className="w-4.5 h-4.5 animate-spin" />
                    </div>
                  )}
                </div>

                {/* Success / helper text below referral input */}
                {showReferralSuccess ? (
                  <p className="font-body-sm text-[12px] mt-1.5 text-emerald-500 font-semibold flex items-center gap-1">
                    ✓ Referral code applied successfully.
                  </p>
                ) : (
                  <p
                    className={cn(
                      "font-body-sm text-[12px] mt-1.5 transition-colors duration-500",
                      isDark ? "text-slate-400/80" : "text-on-surface-variant/70"
                    )}
                  >
                    Referred by a client or partner? Enter their referral code here.
                  </p>
                )}

                <p
                  className={cn(
                    "font-body-sm text-[11px] mt-1 opacity-70 italic transition-colors duration-500",
                    isDark ? "text-slate-500" : "text-on-surface-variant/50"
                  )}
                >
                  Referral codes may unlock special pricing and consultation benefits.
                </p>
              </div>

              {/* Textarea */}
              <FormTextarea
                label="Project Details"
                id="message"
                placeholder="Tell us about your technical requirements and objectives..."
                required={true}
                rows={5}
                autoComplete="off"
                error={errors.message?.message}
                {...register("message")}
                disabled={isBusy}
                isDark={isDark}
              />

              {/* Submit Bar */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                <PrimaryButton
                  type="submit"
                  size="lg"
                  variant={isDark ? undefined : "primary"}
                  shimmer={!isBusy}
                  magnetic={!isBusy}
                  disabled={isBusy}
                  className={cn(
                    "w-full sm:w-auto font-headline-sm px-10 py-4 shadow-md",
                    isDark
                      ? "glass-btn-primary text-white"
                      : "bg-primary text-white disabled:opacity-50"
                  )}
                >
                  {isBusy ? "Sending your enquiry..." : "Send Message"}
                </PrimaryButton>
                <p
                  className={cn(
                    "font-body-sm text-center sm:text-left mt-2 sm:mt-0 transition-colors duration-500",
                    isDark ? "text-slate-400" : "text-on-surface-variant"
                  )}
                >
                  We typically respond within 24 business hours.
                </p>
              </div>
            </motion.form>
          ) : (
            <motion.div
              key="success-message"
              role="status"
              aria-live="polite"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <div className="w-16 h-16 bg-secondary-container/20 rounded-full flex items-center justify-center mb-6 text-secondary">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3
                className={cn(
                  "font-headline-md text-headline-md mb-3 transition-colors duration-500",
                  isDark ? "text-white" : "text-primary"
                )}
              >
                Thank you for contacting HexaKode!
              </h3>
              <p
                className={cn(
                  "font-body-lg max-w-md mb-8 leading-relaxed transition-colors duration-500",
                  isDark ? "text-slate-400" : "text-on-surface-variant"
                )}
              >
                Your enquiry has been submitted successfully. Our team will review your message and get back to you.
              </p>
              <PrimaryButton
                onClick={handleReset}
                variant={isDark ? undefined : "white"}
                size="md"
                shimmer={false}
                magnetic={true}
                className={cn(
                  "font-label-mono uppercase transition-all duration-300 border",
                  isDark
                    ? "glass-social-btn text-white hover:bg-white/10"
                    : "text-primary border-outline-variant/30 hover:bg-surface-container"
                )}
              >
                Send another message
              </PrimaryButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
