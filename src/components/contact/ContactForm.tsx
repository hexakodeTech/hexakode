"use client";

import React, { useState } from "react";
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
import { PROJECT_TYPES, BUDGET_RANGES } from "../../constants/contact";
import { submitEnquiryAction } from "@/lib/enquiries/actions";
import { validateCouponAction } from "@/lib/coupons/actions";
import { Loader2 } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid work email" }),
  phone: z.string().optional(),
  company: z.string().optional(),
  projectType: z.string().min(1, { message: "Please select a project type" }),
  budget: z.string().min(1, { message: "Please select a budget range" }),
  couponCode: z.string().optional().refine((val) => !val || val.length >= 3, {
    message: "Coupon code must have a minimum of 3 characters",
  }),
  message: z.string().min(10, { message: "Project details must be at least 10 characters" }),
});

type ContactFormFields = z.infer<typeof contactSchema>;

export default function ContactForm({ isDark = false }: { isDark?: boolean }) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [couponStatus, setCouponStatus] = useState<{
    isValid: boolean;
    message?: string;
    error?: boolean;
  } | null>(null);
  const [isLoadingCoupon, setIsLoadingCoupon] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
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
    },
  });

  const handleCouponChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    val = val.trim();
    setValue("couponCode", val, { shouldValidate: true });

    if (val.length === 0) {
      setCouponStatus(null);
      clearErrors("couponCode");
      return;
    }

    if (val.length < 3) {
      setCouponStatus(null);
      return;
    }

    setIsLoadingCoupon(true);
    try {
      const res = await validateCouponAction(val);
      if (!res.success) {
        setCouponStatus({ isValid: false, message: res.error, error: true });
        setError("couponCode", { type: "custom", message: res.error });
        toast.error(res.error);
      } else {
        setCouponStatus({ isValid: true, message: "✓ Coupon Applied" });
        clearErrors("couponCode");
        toast.success("✓ Coupon Applied");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingCoupon(false);
    }
  };

  const onSubmit = async (data: ContactFormFields) => {
    if (data.couponCode && data.couponCode.trim().length > 0) {
      if (!couponStatus || !couponStatus.isValid) {
        toast.error(couponStatus?.message || "Invalid coupon code entered.");
        setError("couponCode", { type: "custom", message: couponStatus?.message || "Invalid coupon code entered." });
        return;
      }
    }

    setIsLoading(true);
    try {
      const result = await submitEnquiryAction({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        service: data.projectType,
        budget: data.budget,
        couponCode: data.couponCode || null,
        message: data.message,
      });

      if (!result.success) {
        toast.error(result.error || "Failed to submit enquiry. Please try again.");
        return;
      }

      setIsSubmitted(true);
      toast.success("Thank you for contacting HexaKode. Your enquiry has been received successfully. Our team will respond within 24 business hours.");
    } catch (err) {
      console.error("Enquiry submission error:", err);
      toast.error("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    reset();
    setCouponStatus(null);
    setIsSubmitted(false);
  };

  return (
    <div
      id="contact-form"
      className={cn(
        "lg:col-span-8 p-8 md:p-12 rounded-xl transition-all duration-300 ease-out",
        isDark
          ? "glass-form-premium text-white"
          : "glass-card text-on-background border border-outline-variant/10 shadow-sm"
      )}
    >
      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.form
            key="contact-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8"
            noValidate
          >
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Full Name"
                id="name"
                placeholder="John Doe"
                error={errors.name?.message}
                {...register("name")}
                disabled={isLoading}
                isDark={isDark}
              />
              <FormInput
                label="Work Email"
                id="email"
                type="email"
                placeholder="john@company.com"
                error={errors.email?.message}
                {...register("email")}
                disabled={isLoading}
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
                error={errors.phone?.message}
                {...register("phone")}
                disabled={isLoading}
                isDark={isDark}
              />
              <FormInput
                label="Company Name"
                id="company"
                placeholder="HexaKode Engineering"
                error={errors.company?.message}
                {...register("company")}
                disabled={isLoading}
                isDark={isDark}
              />
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormSelect
                label="Project Type"
                id="project_type"
                placeholder="Select an option"
                options={PROJECT_TYPES}
                error={errors.projectType?.message}
                {...register("projectType")}
                disabled={isLoading}
                isDark={isDark}
              />
              <FormSelect
                label="Estimated Budget"
                id="budget"
                placeholder="Select range"
                options={BUDGET_RANGES}
                error={errors.budget?.message}
                {...register("budget")}
                disabled={isLoading}
                isDark={isDark}
              />
            </div>

            {/* Coupon Code */}
            <div className="flex flex-col w-full">
              <div className="relative">
                <FormInput
                  label="Coupon Code"
                  id="couponCode"
                  placeholder="Enter coupon code (optional)"
                  error={errors.couponCode?.message}
                  {...register("couponCode", {
                    onChange: handleCouponChange
                  })}
                  disabled={isLoading}
                  isDark={isDark}
                />
                {isLoadingCoupon && (
                  <div className="absolute right-3 bottom-3 text-secondary">
                    <Loader2 className="w-4.5 h-4.5 animate-spin" />
                  </div>
                )}
              </div>
              
              {couponStatus?.isValid ? (
                <p className="font-body-sm text-[12px] mt-1.5 text-emerald-500 font-semibold flex items-center gap-1">
                  ✓ Coupon Applied
                </p>
              ) : (
                <p
                  className={cn(
                    "font-body-sm text-[12px] mt-1.5 transition-colors duration-500",
                    isDark ? "text-slate-400/80" : "text-on-surface-variant/70"
                  )}
                >
                  Have a promo code? Enter it here.
                </p>
              )}
            </div>

            {/* Textarea */}
            <FormTextarea
              label="Project Details"
              id="message"
              placeholder="Tell us about your technical requirements and objectives..."
              rows={5}
              error={errors.message?.message}
              {...register("message")}
              disabled={isLoading}
              isDark={isDark}
            />

            {/* Submit Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <PrimaryButton
                type="submit"
                size="lg"
                variant={isDark ? undefined : "primary"}
                shimmer={true}
                magnetic={true}
                disabled={isLoading}
                className={cn(
                  "w-full sm:w-auto font-headline-sm px-10 py-4 shadow-md",
                  isDark
                    ? "glass-btn-primary text-white"
                    : "bg-primary text-white disabled:opacity-50"
                )}
              >
                {isLoading ? "Sending..." : "Send Message"}
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="w-16 h-16 bg-secondary-container/20 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-secondary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3
              className={cn(
                "font-headline-md text-headline-md mb-3 transition-colors duration-500",
                isDark ? "text-white" : "text-primary"
              )}
            >
              Message Sent!
            </h3>
            <p
              className={cn(
                "font-body-lg max-w-md mb-8 leading-relaxed transition-colors duration-500",
                isDark ? "text-slate-400" : "text-on-surface-variant"
              )}
            >
              Thank you for reaching out. An engineering expert from HexaKode will review your project details and get in touch with you shortly.
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
  );
}
