import { Job } from "@/types/careers";

/**
 * Mock job data — replace with Supabase query when ready:
 *
 *   const { data: jobs } = await supabase
 *     .from("jobs")
 *     .select("*")
 *     .eq("is_active", true)
 *     .order("posted_at", { ascending: false });
 */
export const jobs: Job[] = [
  {
    id: "1",
    slug: "senior-full-stack-developer",
    title: "Senior Full Stack Developer",
    location: "Remote / Hybrid",
    type: "Full-Time",
    category: "Engineering",
    excerpt:
      "Lead the architecture and delivery of high-performance web applications using modern JavaScript/TypeScript stacks.",
    tags: ["Next.js", "TypeScript", "Node.js", "PostgreSQL"],
    postedAt: "2026-06-10",
  },
  {
    id: "2",
    slug: "react-native-developer",
    title: "React Native Developer",
    location: "Remote",
    type: "Full-Time",
    category: "Engineering",
    excerpt:
      "Build cross-platform mobile applications with a focus on performance, reliability, and delightful user experiences.",
    tags: ["React Native", "TypeScript", "Expo", "Redux"],
    postedAt: "2026-06-12",
  },
  {
    id: "3",
    slug: "ui-ux-designer",
    title: "UI/UX Designer",
    location: "Remote",
    type: "Full-Time",
    category: "Design",
    excerpt:
      "Craft intuitive, beautiful interfaces that translate complex technical capabilities into seamless user experiences.",
    tags: ["Figma", "Design Systems", "Prototyping", "User Research"],
    postedAt: "2026-06-14",
  },
  {
    id: "4",
    slug: "ai-engineer",
    title: "AI Engineer",
    location: "Remote",
    type: "Full-Time",
    category: "Engineering",
    excerpt:
      "Design and deploy AI-powered features and infrastructure, integrating LLMs and ML pipelines into production applications.",
    tags: ["Python", "LLMs", "TensorFlow", "MLOps"],
    postedAt: "2026-06-15",
  },
  {
    id: "5",
    slug: "product-manager",
    title: "Product Manager",
    location: "Remote / Hybrid",
    type: "Full-Time",
    category: "Product",
    excerpt:
      "Define and drive the product roadmap, working closely with engineering and design to deliver measurable business outcomes.",
    tags: ["Roadmapping", "Agile", "Data Analysis", "Stakeholder Management"],
    postedAt: "2026-06-16",
  },
  {
    id: "6",
    slug: "devops-engineer",
    title: "DevOps / Cloud Engineer",
    location: "Remote",
    type: "Full-Time",
    category: "Engineering",
    excerpt:
      "Design resilient cloud infrastructure, CI/CD pipelines, and observability systems that scale with our engineering teams.",
    tags: ["AWS", "Terraform", "Docker", "Kubernetes"],
    postedAt: "2026-06-17",
  },
];
