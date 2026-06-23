"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, ShieldCheck, Gauge } from "lucide-react";
import Container from "../ui/Container";
import Section from "../ui/Section";
import Card from "../ui/Card";
import BenefitsCard from "./BenefitsCard";
import ProcessTimeline from "./ProcessTimeline";
import { fadeUp, staggerContainer } from "@/lib/motion";

const PROCESS_STEPS = [
  {
    title: "Architecture Audit",
    description: "Evaluation of current loads and identification of bottlenecks.",
  },
  {
    title: "Infrastructure as Code",
    description: "Writing Terraform/CloudFormation scripts for repeatable environments.",
  },
  {
    title: "Stress Testing",
    description: "Simulating extreme traffic to ensure system resilience.",
  },
];

export default function CloudInfrastructureSection() {
  return (
    <Section id="cloud-service" variant="white" spacing="medium" className="py-16 md:py-24">
      <Container>
        {/* Section Badge above the 2-column grid to allow title-card alignment */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="mb-8"
        >
          <span className="font-label-mono text-label-mono text-secondary tracking-widest uppercase">
            Deep Dive
          </span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* Left Column - Sticky Details Panel */}
          <div className="lg:sticky lg:top-32">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="space-y-10"
            >
              {/* Title & Description */}
              <motion.div variants={fadeUp} className="space-y-4">
                <h2 className="text-[36px] md:text-[44px] lg:text-[48px] font-bold font-headline-xl tracking-tight leading-tight text-on-background">
                  Cloud Infrastructure &amp; API Systems
                </h2>
                <p className="text-on-surface-variant font-body-lg leading-relaxed">
                  Modern business requires more than just a server; it requires an intelligent, self-healing ecosystem. HexaKode specializes in migrating legacy systems to modern cloud environments and building high-performance APIs from the ground up.
                </p>
              </motion.div>

              {/* Expected Outcomes */}
              <motion.div variants={fadeUp} className="pt-8 border-t border-outline-variant/20 space-y-3">
                <h4 className="text-headline-sm font-headline-sm text-[20px] flex items-center gap-3 text-on-background">
                  <TrendingUp className="w-5 h-5 text-secondary shrink-0" />
                  Expected Outcomes
                </h4>
                <p className="text-on-surface-variant font-body-sm leading-relaxed">
                  Reduced operational costs by up to 40% through serverless optimization and improved deployment frequency via automated CI/CD pipelines.
                </p>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column - Overview, Benefits, Process Stack */}
          <div className="space-y-6">
            
            {/* 01. Overview */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
            >
              <Card variant="light" className="p-8 hover:border-secondary/30">
                <h3 className="text-headline-sm font-headline-sm mb-4 text-on-background">
                  01. Overview
                </h3>
                <p className="text-on-surface-variant text-body-md leading-relaxed">
                  We architect distributed systems that prioritize high availability and low latency. Whether you need a RESTful API for a mobile frontend or a complex microservice mesh, our solutions are built to be audited and scaled.
                </p>
              </Card>
            </motion.div>

            {/* 02. Benefits Container Card */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
            >
              <Card variant="light" className="p-8 hover:border-secondary/30">
                <h3 className="text-headline-sm font-headline-sm mb-6 text-on-background">
                  02. Benefits
                </h3>
                <div className="space-y-6">
                  <BenefitsCard
                    title="Military-Grade Security"
                    description="Encrypted data at rest and in transit with OAuth2 and JWT integration."
                    icon={ShieldCheck}
                    className="border-none p-0 hover:translate-y-0 hover:shadow-none shadow-none"
                  />
                  <BenefitsCard
                    title="Global Performance"
                    description="Edge computing integration to reduce latency for users worldwide."
                    icon={Gauge}
                    className="border-none p-0 hover:translate-y-0 hover:shadow-none shadow-none mt-2"
                  />
                </div>
              </Card>
            </motion.div>

            {/* 03. The Process Timeline Card */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
            >
              <Card variant="gradient" className="p-8 hover:shadow-glow-blue">
                <h3 className="text-headline-sm font-headline-sm mb-6 text-white">
                  03. The Process
                </h3>
                <ProcessTimeline steps={PROCESS_STEPS} />
              </Card>
            </motion.div>

          </div>

        </div>
      </Container>
    </Section>
  );
}
