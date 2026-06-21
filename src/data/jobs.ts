import { Job } from "@/types/careers";

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
    experience: "5+ Years",
    description:
      "Join our engineering team to build scalable web applications and modern SaaS platforms. We build custom software solutions using cutting-edge stacks like Next.js, Node.js, and PostgreSQL.",
    responsibilities: [
      "Build scalable web applications and design responsive interfaces",
      "Design, implement, and optimize PostgreSQL database schemas and API routes",
      "Review code contributions, establish coding guidelines, and mentor junior developers",
      "Collaborate closely with UI/UX designers and product managers to define implementation plans",
      "Optimize application performance, build caching strategies, and minimize bundle sizes"
    ],
    requirements: [
      "5+ years of production experience with JavaScript/TypeScript and modern frameworks",
      "Strong React/Next.js experience (App Router, Server Components, SSR)",
      "TypeScript expertise including complex generic typing and advanced utilities",
      "Solid Node.js backend development experience and API design",
      "Experience with relational databases (PostgreSQL/Supabase) and writing efficient SQL queries"
    ],
    technologies: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS"],
    niceToHave: ["AWS (S3, EC2, Lambda)", "Docker & containerized hosting setups", "CI/CD setup with GitHub Actions", "Microservices architecture design"]
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
    experience: "3+ Years",
    description:
      "We are seeking a talented React Native Developer to lead our mobile development efforts. You will be responsible for building high-performance, beautiful mobile apps for iOS and Android, focusing on premium user interactions.",
    responsibilities: [
      "Develop and maintain cross-platform mobile apps using React Native and Expo",
      "Optimize app startup times, memory footprint, and deliver fluid 60fps animations",
      "Integrate native SDKs, third-party libraries, and write custom native modules when needed",
      "Collaborate closely with UI/UX designers to implement pixel-perfect user screens",
      "Publish and manage applications on Apple App Store & Google Play Store platforms"
    ],
    requirements: [
      "3+ years of professional mobile app development experience",
      "Deep expertise in React Native, Expo, and the mobile JS ecosystem",
      "Strong TypeScript skills and state management frameworks (Zustand, Redux Toolkit)",
      "Familiarity with native build pipelines (Xcode, Gradle, Android Studio, fastlane)",
      "Experience calling, caching, and syncing REST/GraphQL APIs offline"
    ],
    technologies: ["React Native", "Expo", "TypeScript", "Redux", "Zustand", "Tailwind CSS"],
    niceToHave: ["Native iOS (Swift) or Android (Kotlin) development", "Supabase authentication & real-time sync", "Automated app store deployment systems"]
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
    experience: "2+ Years",
    description:
      "We are looking for a UI/UX Designer who is passionate about creating clean, modern, and highly intuitive interfaces. You will translate complex requirements into seamless, interactive user journeys that delight visitors.",
    responsibilities: [
      "Design beautiful user interfaces and logical user flows for web and mobile platforms",
      "Maintain, document, and grow our shared design system library in Figma",
      "Create interactive high-fidelity prototypes to validate layout and flow before code",
      "Conduct user research, feedback loops, and usability testing sessions",
      "Collaborate with development teams to ensure production output matches specifications"
    ],
    requirements: [
      "2+ years of professional UI/UX design experience, preferably in SaaS or digital agencies",
      "Stunning portfolio demonstrating mastery of modern layout, typography, grids, and color systems",
      "Expert proficiency in Figma, including variables, design systems, and auto-layout v4",
      "Experience designing for both responsive desktop screens and mobile viewports",
      "Deep understanding of web usability principles and WCAG accessibility standards"
    ],
    technologies: ["Figma", "Design Systems", "Prototyping", "User Research", "Adobe Suite"],
    niceToHave: ["Basic HTML/CSS/Tailwind structure familiarity", "Motion design, micro-animations, or Lottie exports", "Experience managing design tokens"]
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
    experience: "3+ Years",
    description:
      "Join us as an AI Engineer to integrate state-of-the-art Large Language Models, vector embeddings, and machine learning pipelines into production web applications. You will shape the AI features of HexaKode.",
    responsibilities: [
      "Design and deploy generative AI features using modern LLMs (Gemini, OpenAI, Anthropic APIs)",
      "Build robust vector search pipelines and RAG systems using pgvector and langchain-js",
      "Optimize model inference latencies, context window caching, and token usage costs",
      "Collaborate with product and web teams to design and implement smart AI agent workflows",
      "Set up model evaluation pipelines to monitor accuracy, drift, and security safeguards"
    ],
    requirements: [
      "3+ years of software engineering experience, with 1.5+ years focused on AI/ML applications",
      "Strong proficiency in Python as well as JavaScript/TypeScript backend services",
      "Deep understanding of vector spaces, semantic embeddings, and retriever strategies",
      "Experience hosting models on Hugging Face, RunPod, or serverless GPU setups",
      "Familiarity with LangChain, LlamaIndex, or official Google Generative AI SDKs"
    ],
    technologies: ["Python", "Gemini API", "Vector Databases", "LangChain", "TensorFlow", "Node.js"],
    niceToHave: ["PyTorch models training & optimization", "Supabase Vector databases", "Experience deploying serverless GPU functions"]
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
    experience: "4+ Years",
    description:
      "We are seeking a Product Manager who can own client and internal product lifecycles. You will define the product vision, prioritize requirements, and coordinate engineering and design sprints to deliver outstanding value.",
    responsibilities: [
      "Own the end-to-end product lifecycle, write detailed PRDs, and manage backlog priorities",
      "Coordinate weekly development sprints and syncs with engineering and design leads",
      "Analyze user feedback, support tickets, and telemetry data to inform feature directions",
      "Define key performance indicators (KPIs) and monitor product metrics post-launch",
      "Communicate with clients and internal stakeholders to manage project delivery expectations"
    ],
    requirements: [
      "4+ years of product management experience, preferably in B2B SaaS or custom software agencies",
      "Strong analytical skills with tools like Mixpanel, Amplitude, Google Analytics, or SQL",
      "Technical literacy — ability to discuss database schemas, system architectures, and APIs",
      "Exceptional written, visual, and verbal communication skills",
      "Proven history of launching digital products successfully from concept to deployment"
    ],
    technologies: ["Agile/Scrum", "Linear", "Mixpanel", "SQL", "Product Roadmaps"],
    niceToHave: ["Computer Science background or direct development experience", "Experience in high-growth startup environments", "Basic Figma mockups familiarity"]
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
    experience: "4+ Years",
    description:
      "HexaKode is looking for a DevOps/Cloud Engineer to automate, scale, and secure our cloud infrastructure. You will be responsible for deployment workflows, staging systems, and keeping our staging and production servers running efficiently.",
    responsibilities: [
      "Provision, scale, and secure AWS/GCP cloud resources using Terraform (Infrastructure-as-Code)",
      "Design and automate high-availability CI/CD pipelines for web and mobile applications",
      "Configure and tune containerized environments with Docker and Kubernetes cluster nodes",
      "Set up comprehensive monitoring, centralized logging, and alerting using Grafana/Prometheus",
      "Conduct regular infrastructure security audits, backup restorations, and disaster recovery dry-runs"
    ],
    requirements: [
      "4+ years of experience in cloud infrastructure, site reliability, or automation roles",
      "Hands-on expertise with AWS services (IAM, VPC, EKS, RDS, CloudFront, Route53)",
      "Strong proficiency with Terraform and automated script triggers",
      "Solid knowledge of Linux systems administration and container orchestration (Docker/K8s)",
      "Scripting proficiency in Bash, Python, or Go for cron jobs and operational automation"
    ],
    technologies: ["AWS", "Terraform", "Docker", "Kubernetes", "GitHub Actions", "Linux", "Grafana"],
    niceToHave: ["Supabase self-hosted deployments", "PostgreSQL query tuning and replication", "AWS Certified Solutions Architect designation"]
  }
];
