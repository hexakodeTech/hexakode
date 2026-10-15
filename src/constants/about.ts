import { Frame, Users, Zap } from "lucide-react";
import { CoreValue, TeamMember, TrustMetric, TrustPoint } from "../types/about";
import { COMPANY_STATS } from "./stats";

export const CORE_VALUES: CoreValue[] = [
  {
    id: "v1",
    icon: Frame,
    title: "Architectural Integrity",
    description:
      "We don't just build features; we design systems. Every line of code is written with scalability and long-term maintenance in mind.",
  },
  {
    id: "v2",
    icon: Users,
    title: "Radical Transparency",
    description:
      "Engineering is built on trust. We provide our clients with clear, honest communication and deep technical visibility at every stage.",
  },
  {
    id: "v3",
    icon: Zap,
    title: "Persistent Innovation",
    description:
      "The status quo is our only competitor. we constantly explore emerging technologies to keep our clients ahead of the curve.",
  },
];

export const FOUNDERS: TeamMember[] = [
  {
    id: "f1",
    name: "Navaneeth P P",
    role: "Co-Founder & CEO, Full Stack Engineer",
    bio: "Co-founded HexaKode to deliver transparent, scalable software engineering. Leads full-stack application development, technical architecture, and client partnerships, specializing in modern web and mobile ecosystems.",
    socialUrl: "https://www.linkedin.com/in/navaneethpp/",
    isFounder: true,
  },
  {
    id: "f2",
    name: "Prajosh C",
    role: "Co-Founder & CTO, Backend Engineer",
    bio: "Co-founded HexaKode alongside Navaneeth with a focus on robust backend systems. Oversees core API development, database architecture, security standards, and infrastructure scalability across all client deployments.",
    socialUrl: "https://www.linkedin.com/in/prajosh-c-586404304/",
    isFounder: true,
  },
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "t1",
    name: "Prajith",
    role: "Team Member",
    isFounder: false,
  },
];

export const TRUST_POINTS: TrustPoint[] = [
  {
    id: "tp1",
    number: "01",
    title: "Successful Delivery",
    description:
      "We have successfully delivered production-ready systems including responsive web platforms and mobile applications.",
  },
  {
    id: "tp2",
    number: "02",
    title: "Security-First Mindset",
    description:
      "Security isn't a feature; it's a foundation. Every build undergoes rigorous automated and manual security audits.",
  },
  {
    id: "tp3",
    number: "03",
    title: "Dedicated Partnership",
    description:
      "We integrate deeply with your internal teams, operating as an extension of your company's core technical department.",
  },
];

export const TRUST_METRICS: TrustMetric[] = [
  {
    id: "tm1",
    value: COMPANY_STATS.completedProjects.formatted,
    label: COMPANY_STATS.completedProjects.label,
  },
  {
    id: "tm2",
    value: COMPANY_STATS.technologiesUsed.formatted,
    label: COMPANY_STATS.technologiesUsed.label,
  },
  {
    id: "tm3",
    value: COMPANY_STATS.industriesServed.formatted,
    label: COMPANY_STATS.industriesServed.label,
  },
  {
    id: "tm4",
    value: COMPANY_STATS.clientSatisfaction.formatted,
    label: COMPANY_STATS.clientSatisfaction.label,
  },
];
