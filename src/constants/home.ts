import { NavLink, Technology, Service, Project, ProcessStep, FooterSection } from "../types/home";

export const COMPANY_NAME = "HexaKode";
export const COMPANY_TAGLINE = "Code that powers growth";

export const NAV_LINKS: NavLink[] = [
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "About Us", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export const TECHNOLOGIES: Technology[] = [
  { name: "React", category: "Frontend", iconName: "ReactIcon" },
  { name: "Next.js", category: "Frontend", iconName: "NextjsIcon" },
  { name: "TypeScript", category: "Languages", iconName: "TypeScriptIcon" },
  { name: "Node.js", category: "Backend", iconName: "NodejsIcon" },
  { name: "Firebase", category: "Cloud/Database", iconName: "FirebaseIcon" },
  { name: "MongoDB", category: "Cloud/Database", iconName: "MongodbIcon" },
  { name: "PostgreSQL", category: "Cloud/Database", iconName: "PostgresIcon" },
  { name: "Tailwind CSS", category: "Frontend", iconName: "TailwindIcon" },
];

export const SERVICES: Service[] = [
  {
    id: "web-dev",
    title: "Web Dev",
    description: "High-performance, accessible, and scalable web applications built with modern frameworks.",
    tags: ["SaaS Platforms", "E-commerce Engines"],
    highlighted: false,
    href: "#services",
    iconName: "Monitor",
  },
  {
    id: "mobile-dev",
    title: "Mobile Dev",
    description: "Native and cross-platform mobile experiences that engage users and drive retention.",
    tags: ["iOS & Android", "React Native"],
    highlighted: false,
    href: "#services",
    iconName: "Smartphone",
  },
  {
    id: "ui-ux",
    title: "UI/UX Design",
    description: "User-centric design focused on conversion and intuitive information architecture.",
    tags: ["Visual Systems", "Prototyping"],
    highlighted: false,
    href: "#services",
    iconName: "Palette",
  },
  {
    id: "custom-software",
    title: "Custom Software",
    description: "Tailored enterprise solutions that automate workflows and solve complex business challenges.",
    tags: ["SaaS Platforms", "Cloud Integrations"],
    highlighted: true,
    href: "#services",
    iconName: "Code2",
  },
  {
    id: "api-cloud",
    title: "API & Cloud",
    description: "Scalable infrastructure and seamless integrations for the modern web.",
    tags: ["AWS & Firebase", "REST / GraphQL"],
    highlighted: false,
    href: "#services",
    iconName: "Cloud",
  },
];

export const PROJECTS: Project[] = [
  {
    id: "fintech-dashboard",
    title: "Fintech Analytics Dashboard",
    category: "SaaS Platform",
    imageUrl: "/project-fintech.png",
    tags: ["Next.js", "Tailwind CSS", "Recharts"],
    href: "#portfolio",
  },
  {
    id: "health-tracker",
    title: "Health & Wellness Tracker",
    category: "Mobile App",
    imageUrl: "/project-health.png",
    tags: ["React Native", "Expo", "HealthKit"],
    href: "#portfolio",
  },
  {
    id: "ecommerce-platform",
    title: "E-Commerce Platform",
    category: "Web App",
    imageUrl: "/project-ecommerce.png",
    tags: ["Next.js 15", "Stripe", "PostgreSQL"],
    href: "#portfolio",
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    stepNumber: "01",
    title: "Discovery",
    description: "Deep dive into your business objectives, target audience, and technical requirements.",
  },
  {
    stepNumber: "02",
    title: "Architecture",
    description: "Planning the tech stack, data models, and UI blueprints for a robust foundation.",
  },
  {
    stepNumber: "03",
    title: "Engineering",
    description: "Agile development cycles with continuous integration and quality assurance testing.",
  },
  {
    stepNumber: "04",
    title: "Launch",
    description: "Deployment, monitoring, and ongoing support to ensure long-term success.",
  },
];

export const FOOTER_SECTIONS: FooterSection[] = [
  {
    title: "COMPANY",
    links: [
      { label: "About Us", href: "#about" },
      { label: "Our Process", href: "#process" },
      { label: "Case Studies", href: "#portfolio" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    title: "LEGAL",
    links: [
      { label: "Privacy Policy", href: "#privacy" },
      { label: "Terms of Service", href: "#terms" },
      { label: "Cookie Policy", href: "#cookies" },
    ],
  },
  {
    title: "RESOURCES",
    links: [
      { label: "Blog", href: "#blog" },
      { label: "Documentation", href: "#docs" },
      { label: "Help Center", href: "#help" },
    ],
  },
];
