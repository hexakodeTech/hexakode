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

const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid work email" }),
  phone: z.string().optional(),
  company: z.string().optional(),
  projectType: z.string().min(1, { message: "Please select a project type" }),
  budget: z.string().min(1, { message: "Please select a budget range" }),
  message: z.string().min(10, { message: "Project details must be at least 10 characters" }),
});

type ContactFormFields = z.infer<typeof contactSchema>;

export default function ContactForm({ isDark = false }: { isDark?: boolean }) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
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
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormFields) => {
    setIsLoading(true);
    // Simulate API request latency
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsLoading(false);
    setIsSubmitted(true);
    toast.success("Thank you! Your message has been sent successfully.");
    console.log("Mock Contact Form Submission Successful:", data);
  };

  const handleReset = () => {
    reset();
    setIsSubmitted(false);
  };

  return (
    <div
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
