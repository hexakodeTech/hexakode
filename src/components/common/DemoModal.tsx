"use client";

import React, { createContext, useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar } from "lucide-react";
import { cn } from "../../lib/utils";
import FormInput from "../ui/FormInput";
import PrimaryButton from "../ui/PrimaryButton";
import { submitDemoRequestAction } from "@/lib/demos/actions";

const demoSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  company: z.string().min(1, { message: "Company name is required" }),
  phone: z.string().min(6, { message: "Please enter a valid phone number" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type DemoFormFields = z.infer<typeof demoSchema>;

interface DemoModalOptions {
  source?: string;
  inquiryType?: string;
}

interface DemoModalContextType {
  openDemoModal: (options?: DemoModalOptions) => void;
  closeDemoModal: () => void;
}

const DemoModalContext = createContext<DemoModalContextType | undefined>(undefined);

export function useDemoModal() {
  const context = useContext(DemoModalContext);
  if (!context) {
    throw new Error("useDemoModal must be used within a DemoModalProvider");
  }
  return context;
}

export function DemoModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [modalOptions, setModalOptions] = useState<DemoModalOptions>({});

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DemoFormFields>({
    resolver: zodResolver(demoSchema),
    defaultValues: {
      name: "",
      company: "",
      phone: "",
      email: "",
    },
  });

  const openDemoModal = (options?: DemoModalOptions) => {
    setModalOptions(options || {});
    setIsOpen(true);
    setIsSubmitted(false);
    reset();
  };

  const closeDemoModal = () => {
    setIsOpen(false);
  };

  const onSubmit = async (data: DemoFormFields) => {
    setIsLoading(true);
    try {
      const result = await submitDemoRequestAction({
        name: data.name,
        company: data.company,
        phone: data.phone,
        email: data.email,
        source: modalOptions.source || "Direct Website",
        inquiryType: modalOptions.inquiryType || "General Demo",
      });

      if (!result.success) {
        toast.error(result.error || "Failed to submit demo request.");
        return;
      }

      setIsSubmitted(true);
      toast.success("Demo request submitted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DemoModalContext.Provider value={{ openDemoModal, closeDemoModal }}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDemoModal}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-[#0b1329] border border-white/10 p-8 md:p-10 shadow-premium z-10 text-white"
            >
              {/* Close Button */}
              <button
                onClick={closeDemoModal}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors duration-200 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>

              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.div
                    key="demo-form-content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="mb-8 text-left">
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-4 bg-white/5 text-secondary border border-white/10">
                        <Calendar className="w-3.5 h-3.5 text-secondary" />
                        {modalOptions.inquiryType || "Schedule a Demo"}
                      </span>
                      <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                        {modalOptions.inquiryType ? "Book a Session" : "Experience HexaKode"}
                      </h3>
                      <p className="text-slate-400 text-sm md:text-base mt-2">
                        {modalOptions.inquiryType 
                          ? "Fill out the details below, and our team will get in touch to schedule your technical discovery call."
                          : "Fill out the details below, and our team will get in touch to schedule a personalized walkthrough."}
                      </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                      <FormInput
                        label="Full Name"
                        id="demo-name"
                        placeholder="John Doe"
                        error={errors.name?.message}
                        {...register("name")}
                        disabled={isLoading}
                        isDark={true}
                      />
                      <FormInput
                        label="Company Name"
                        id="demo-company"
                        placeholder="HexaKode Engineering"
                        error={errors.company?.message}
                        {...register("company")}
                        disabled={isLoading}
                        isDark={true}
                      />
                      <FormInput
                        label="Phone Number"
                        id="demo-phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        error={errors.phone?.message}
                        {...register("phone")}
                        disabled={isLoading}
                        isDark={true}
                      />
                      <FormInput
                        label="Work Email"
                        id="demo-email"
                        type="email"
                        placeholder="john@company.com"
                        error={errors.email?.message}
                        {...register("email")}
                        disabled={isLoading}
                        isDark={true}
                      />

                      <div className="pt-4">
                        <PrimaryButton
                          type="submit"
                          size="lg"
                          shimmer={true}
                          magnetic={true}
                          disabled={isLoading}
                          className="w-full font-headline-sm py-4 shadow-md bg-secondary text-white hover:brightness-110"
                        >
                          {isLoading ? "Submitting..." : modalOptions.inquiryType ? "Confirm Call" : "Schedule My Demo"}
                        </PrimaryButton>
                      </div>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="demo-success-content"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-8 text-center"
                  >
                    <div className="w-16 h-16 bg-secondary/15 rounded-full flex items-center justify-center mb-6">
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
                    <h3 className="font-headline-md text-2xl md:text-3xl font-extrabold text-white mb-3">
                      Request Received!
                    </h3>
                    <p className="font-body-lg text-slate-400 max-w-sm mb-8 leading-relaxed">
                      {modalOptions.inquiryType === "Technical Discovery Call"
                        ? "Thank you for booking a session. An engineering representative from HexaKode will reach out to confirm your technical discovery call shortly."
                        : "Thank you for scheduling a demo. An engineering representative from HexaKode will reach out to confirm your scheduled walkthrough shortly."}
                    </p>
                    <PrimaryButton
                      onClick={closeDemoModal}
                      variant="white"
                      size="md"
                      className="font-label-mono uppercase border border-white/10 hover:bg-white/10 hover:text-white bg-transparent text-white"
                    >
                      Close Window
                    </PrimaryButton>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DemoModalContext.Provider>
  );
}
