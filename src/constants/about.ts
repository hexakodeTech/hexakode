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
    name: "Navaneeth P P",
    role: "CEO, Full Stack Engineer",
    imageUrl:
      "https://media.licdn.com/dms/image/v2/D5603AQGI7qc0KWHh-A/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1711121694916?e=1782950400&v=beta&t=KcselM7swgrb65AWGv9Mi_mS-yzw0s0pYoR1XvkTtSY",
    imageAlt: "Navaneeth, CEO and Full Stack Engineer",
    socialUrl: "https://www.linkedin.com/in/navaneethpp/",
  },
  {
    id: "t3",
    name: "Prajosh C",
    role: "CTO, Backend Engineer",
    imageUrl:
      "https://media.licdn.com/dms/image/v2/D4E03AQGAqvvY2DcSMw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1713256342366?e=1782950400&v=beta&t=_SwYB3uEWqEVQoaVioy3_zC-mMvaBbf5zqlxsDsZeGQ",
    imageAlt: "Prajosh C, CTO and Backend Engineer",
    socialUrl: "https://www.linkedin.com/in/prajosh-c-586404304/",
  },
  {
    id: "t2",
    name: "Sindhu P",
    role: "Frontend Engineer",
    imageUrl:
      "https://media.licdn.com/dms/image/v2/D4D03AQGqtPFc0XIVEQ/profile-displayphoto-crop_800_800/B4DZkvWa7DJgAM-/0/1757436041864?e=1782950400&v=beta&t=qHnPIRJP_VuGHA62LwmXNPA7GRzRk05_MDV1rvM556E",
    imageAlt: "Sindu P, Frontend Engineer",
    socialUrl: "https://www.linkedin.com/in/sindhu-p-330baa362/",
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
    value: "2",
    label: "Projects Delivered",
  },
  {
    id: "tm2",
    value: "1",
    label: "Trusted Client",
  },
  {
    id: "tm3",
    value: "2026",
    label: "Founded",
  },
  {
    id: "tm4",
    value: "100%",
    label: "Commitment to Quality",
  },
];
