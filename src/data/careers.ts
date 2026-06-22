import { CultureCard, CareerBenefit, FAQ } from "@/types/careers";

// ─── Culture Cards ────────────────────────────────────────────────────────────

export const cultureCards: CultureCard[] = [
  {
    id: "engineering-excellence",
    title: "Engineering Excellence",
    description:
      "We prioritize clean architecture, scalable systems, and long-term maintainability over short-term shortcuts.",
    icon: "Cpu",
    accentBg: "bg-secondary/10",
    accentText: "text-secondary",
  },
  {
    id: "global-impact",
    title: "Global Impact",
    description:
      "Build products used by businesses and users across industries — engineering solutions that actually move the needle.",
    icon: "Globe2",
    accentBg: "bg-primary-fixed/60",
    accentText: "text-on-primary-fixed-variant",
  },
  {
    id: "continuous-growth",
    title: "Continuous Growth",
    description:
      "Learning budgets, mentorship programs, and regular knowledge-sharing sessions keep the team at the frontier.",
    icon: "TrendingUp",
    accentBg: "bg-tertiary-fixed/60",
    accentText: "text-on-tertiary-fixed-variant",
  },
  {
    id: "flexible-work",
    title: "Flexible Work",
    description:
      "Remote-first collaboration focused on outcomes rather than hours. Work where you do your best thinking.",
    icon: "Laptop2",
    accentBg: "bg-secondary/10",
    accentText: "text-secondary",
  },
];

// ─── Benefits ─────────────────────────────────────────────────────────────────

export const benefits: CareerBenefit[] = [
  {
    id: "health",
    title: "Health & Wellness",
    description:
      "Comprehensive health support and wellness initiatives to keep you at your best.",
    icon: "HeartPulse",
  },
  {
    id: "learning",
    title: "Learning Budget",
    description:
      "Annual budget for courses, certifications, books, and international conferences.",
    icon: "BookOpen",
  },
  {
    id: "equipment",
    title: "Latest Equipment",
    description:
      "Modern hardware and software tools to help you do your best and most productive work.",
    icon: "Monitor",
  },
  {
    id: "growth",
    title: "Career Growth",
    description:
      "Clear growth paths, structured mentorship, and leadership opportunities at every level.",
    icon: "BarChart3",
  },
];

// ─── FAQ ──────────────────────────────────────────────────────────────────────

export const faqs: FAQ[] = [
  {
    id: "remote",
    question: "Do you offer remote positions?",
    answer:
      "Yes. Most of our roles are remote or remote/hybrid. We are an async-first company and believe in hiring the best talent regardless of geography. Specific location requirements, if any, are listed on each job card.",
  },
  {
    id: "tech-stack",
    question: "What technologies does HexaKode use?",
    answer:
      "Our stack evolves with the industry. For web, we primarily use Next.js, TypeScript, Tailwind CSS, and Supabase. For mobile, React Native with Expo. For infrastructure, AWS and Terraform. For AI/ML, Python, FastAPI, and LLM integrations. The best tool for the job always wins.",
  },
  {
    id: "process",
    question: "What is the hiring process?",
    answer:
      "Our process is designed to be transparent and respectful of your time. It typically involves: (1) Application review, (2) Introductory call with our team, (3) Technical assessment relevant to your role, (4) Final interview with engineering and leadership, (5) Offer. Most processes complete within 2–3 weeks.",
  },
  {
    id: "freshers",
    question: "Do you hire freshers and interns?",
    answer:
      "We do run internship and junior hiring programs periodically. If you're an early-career engineer or designer, submit a general application with your portfolio and we will reach out when suitable opportunities arise. We value potential just as much as experience.",
  },
  {
    id: "general-application",
    question: "Can I submit a general application?",
    answer:
      "Absolutely. If you don't see a role that fits your profile today, submit a general application via the link at the bottom of this page. We review every submission and keep profiles on file for 12 months.",
  },
];
