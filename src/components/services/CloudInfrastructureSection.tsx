"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Terminal, ShieldCheck, Gauge, LucideIcon } from "lucide-react";
import Container from "../ui/Container";
import Section from "../ui/Section";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import BenefitsCard from "./BenefitsCard";
import ProcessTimeline from "./ProcessTimeline";
import { fadeUp, staggerContainer } from "@/lib/motion";

interface TechBadge {
  name: string;
}

const TECHS: TechBadge[] = [
  { name: "Kubernetes" },
  { name: "Terraform" },
  { name: "GoLang" },
  { name: "GraphQL" },
];

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
    <Section id="cloud-service" variant="white" className="py-32">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          
          {/* Left Column - Sticky Details Panel */}
          <div className="sticky top-32">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="space-y-8"
            >
              {/* Badge & Title */}
              <motion.div variants={fadeUp} className="flex flex-col items-start">
                <span className="font-label-mono text-label-mono text-secondary mb-4 tracking-widest uppercase">
                  Deep Dive
                </span>
                <h2 className="text-headline-xl font-headline-xl mb-8 text-on-background">
                  Cloud Infrastructure &amp; API Systems
                </h2>
                <p className="text-on-surface-variant font-body-lg mb-2">
                  Modern business requires more than just a server; it requires an intelligent, self-healing ecosystem. HexaKode specializes in migrating legacy systems to modern cloud environments and building high-performance APIs from the ground up.
                </p>
              </motion.div>

              {/* Expected Outcomes */}
              <motion.div variants={fadeUp}>
                <h4 className="text-headline-sm font-headline-sm text-[20px] mb-3 flex items-center gap-3 text-on-background">
                  <TrendingUp className="w-5 h-5 text-secondary shrink-0" />
                  Expected Outcomes
                </h4>
                <p className="text-on-surface-variant font-body-sm leading-relaxed">
                  Reduced operational costs by up to 40% through serverless optimization and improved deployment frequency via automated CI/CD pipelines.
                </p>
              </motion.div>

              {/* Technologies list */}
              <motion.div variants={fadeUp}>
                <h4 className="text-headline-sm font-headline-sm text-[20px] mb-3 flex items-center gap-3 text-on-background">
                  <Terminal className="w-5 h-5 text-secondary shrink-0" />
                  Technologies
                </h4>
                <div className="flex flex-wrap gap-3 mt-4">
                  {TECHS.map((tech) => (
                    <span
                      key={tech.name}
                      className="bg-surface-container text-on-surface-variant px-4 py-2 rounded-lg font-label-mono text-label-mono hover:bg-secondary-container/20 transition-all duration-300 cursor-default select-none border border-outline-variant/10"
                    >
                      {tech.name}
                    </span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column - Overview, Benefits, Process Stack */}
          <div className="space-y-12">
            
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
              <Card variant="gradient" className="p-8">
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
