import { Frame, Users, Zap } from "lucide-react";
import { CoreValue, TeamMember, TrustMetric, TrustPoint } from "../types/about";

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

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "t1",
    name: "Alex Thorne",
    role: "Chief Systems Architect",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCW-JJic6xUltXY-J-yuhXJWoNN-85F6p2KAsHeaCg-BVBDDJnApuCMskEIwxlqmmQGJ8X76s1OhxXlgk0YQvEB2sMZT1g34rj3kU1coKE_JqqGhhS29H3OTgS9AtYZOaBgZrdkDK21O3vvZsckMaACnwgB4TuvNOOZ3FdLDlSnAVk4o0GIKSNWgoOtp1pdAQr-1otug7CeOi6bRURU-iopjx43yBcMibRBXD2MsjcT-7Z_5rvJZ7YSXfehz5fScHuCXFGVpuqSH1fL",
    imageAlt: "Alex Thorne, Chief Systems Architect",
    socialUrl: "#",
  },
  {
    id: "t2",
    name: "Sarah Chen",
    role: "Head of Product Design",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCcba4KzUn2cGI6dpLD_2qj2lssfk0TGqUMjN0DhX6uYPrAVKsO8pmEuTQ18QVlb6aiXnZ3GmDqHU96dieumcasLjp9jvaJTpzxCOkEVTmzp2_AOBaS0c9Zy9utNfq7jcIaQ77xA4GYubGaCVScEdkDnykuwhDsv9-qj6z3bUtP3D0wVIwFWIGxd5hYuZPZS-aU_NhJ1Fc7nHiD-pk3uCJrIt_sSid8dHuFskOpkzihe-Nl6ksgpX8VvX0w_5pT73LcOfTxA_v_pLd8",
    imageAlt: "Sarah Chen, Head of Product Design",
    socialUrl: "#",
  },
  {
    id: "t3",
    name: "Marcus Vane",
    role: "Director of Engineering",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDtdK-Mbfzl9eXWQQflB4DSd_KdBMfPeu234Oqber_2pMGyi7sVHj1eJN9ULHOgPaWvo-69y49NeFhcBg0HUaWbbnNS3ToRlXhpkVHZ6THlzEasvjFq35HiWqSSqMsgVJemFrhJlhJCtk9P7FNEY1kFLQzRphG1_3mD2SjYXdj24gwZeBrXQtISQIadtt58VTivnRa7zThlZDqV95Cx5aTlSAxjav1BRWDozPFxuA2jYaa27R3ARBTLqOkuqnEVN8G00H2IqhKUVWg3",
    imageAlt: "Marcus Vane, Director of Engineering",
    socialUrl: "#",
  },
];

export const TRUST_POINTS: TrustPoint[] = [
  {
    id: "tp1",
    number: "01",
    title: "Proven Track Record",
    description:
      "We've successfully delivered over 200+ enterprise-grade projects across fintech, healthtech, and logistics.",
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
    value: "98%",
    label: "Client Retention",
  },
  {
    id: "tm2",
    value: "24/7",
    label: "Global Support",
  },
  {
    id: "tm3",
    value: "500k+",
    label: "Daily Users",
  },
  {
    id: "tm4",
    value: "Zero",
    label: "Critical Failures",
  },
];
