// ─────────────────────────────────────────────────────────────────────────────
// Portfolio CMS Module — Mock Data
// 5 realistic sample portfolio projects with rich metadata.
// Replace this module with API/DB calls when backend is ready.
// ─────────────────────────────────────────────────────────────────────────────

import { PortfolioProject } from "../types";

export const PORTFOLIO_MOCK_DATA: PortfolioProject[] = [
  {
    id: "pf-001",
    title: "Fintech Analytics Dashboard",
    slug: "fintech-analytics-dashboard",
    category: "Finance",
    clientName: "NovaPay Financial Ltd.",
    projectUrl: "https://novapay-dashboard.example.com",
    githubUrl: "https://github.com/example/novapay-dashboard",
    shortDescription:
      "A real-time financial analytics platform for tracking investment portfolios, transaction flows, and risk exposure across multiple asset classes.",
    longDescription:
      "NovaPay Financial required a comprehensive analytics platform that could handle real-time market data streams, portfolio rebalancing signals, and regulatory compliance reporting. We built a full-stack solution with streaming WebSocket data feeds, interactive chart components, and a role-based access control system for their multi-desk trading operation. The dashboard processes over 2 million data points per hour and surfaces actionable insights through a sleek, information-dense interface designed for power users.",
    coverImage:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80",
    gallery: [
      {
        id: "g-001-1",
        url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80",
        alt: "Dashboard overview",
        isCover: true,
      },
      {
        id: "g-001-2",
        url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
        alt: "Portfolio analytics view",
      },
      {
        id: "g-001-3",
        url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
        alt: "Transaction flow chart",
      },
    ],
    technologies: ["React", "Next.js", "TypeScript", "Supabase", "TailwindCSS", "Recharts", "WebSockets"],
    features: [
      {
        id: "f-001-1",
        title: "Real-Time Market Data",
        description:
          "WebSocket-powered live data feeds update charts and KPIs with sub-100ms latency from multiple exchange APIs.",
      },
      {
        id: "f-001-2",
        title: "Portfolio Rebalancing Engine",
        description:
          "Automated rebalancing signals based on user-defined risk thresholds, with one-click execution flows.",
      },
      {
        id: "f-001-3",
        title: "Regulatory Compliance Reports",
        description:
          "Automated PDF generation for MiFID II and SOX compliance documentation, scheduled or on-demand.",
      },
      {
        id: "f-001-4",
        title: "Role-Based Access Control",
        description:
          "Granular permission layers for traders, analysts, compliance officers, and executive stakeholders.",
      },
    ],
    seo: {
      metaTitle: "Fintech Analytics Dashboard — NovaPay Financial | HexaKode",
      metaDescription:
        "Real-time financial analytics platform with live market data, portfolio tracking, and regulatory compliance reporting built for NovaPay Financial.",
      ogImage:
        "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&auto=format&fit=crop&q=80",
    },
    settings: {
      featured: true,
      showOnHomepage: true,
      allowPreview: true,
    },
    status: "Published",
    publishedAt: "2026-02-10T09:00:00Z",
    createdAt: "2026-01-20T14:30:00Z",
    updatedAt: "2026-02-10T09:00:00Z",
  },

  {
    id: "pf-002",
    title: "Health & Wellness Tracker",
    slug: "health-wellness-tracker",
    category: "Healthcare",
    clientName: "VitaSync Health",
    projectUrl: "https://vitasync.example.com",
    githubUrl: "",
    shortDescription:
      "A cross-platform mobile application helping users monitor fitness goals, nutrition intake, sleep patterns, and chronic condition management.",
    longDescription:
      "VitaSync Health needed a HIPAA-compliant mobile application that could unify health data from wearables, manual entries, and healthcare provider portals. We developed a React Native application with end-to-end encrypted data storage, AI-powered health insight generation, and seamless integration with Apple Health and Google Fit. The app features a beautiful activity timeline, personalized coaching prompts, and medication reminders — all with offline-first architecture.",
    coverImage:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80",
    gallery: [
      {
        id: "g-002-1",
        url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80",
        alt: "App home screen",
        isCover: true,
      },
      {
        id: "g-002-2",
        url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=80",
        alt: "Activity tracking view",
      },
      {
        id: "g-002-3",
        url: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&auto=format&fit=crop&q=80",
        alt: "Nutrition log screen",
      },
    ],
    technologies: ["React Native", "Firebase", "TypeScript", "Expo", "Redux Toolkit", "HealthKit", "Google Fit API"],
    features: [
      {
        id: "f-002-1",
        title: "Wearable Integration",
        description:
          "Native sync with Apple Watch, Fitbit, Garmin, and Android Wear devices for automatic activity capture.",
      },
      {
        id: "f-002-2",
        title: "AI Health Insights",
        description:
          "Personalized weekly health reports generated by on-device ML models analyzing patterns in sleep, activity, and nutrition data.",
      },
      {
        id: "f-002-3",
        title: "Medication Reminders",
        description:
          "Smart notification system with dosage tracking and pharmacy refill alerts for chronic condition management.",
      },
    ],
    seo: {
      metaTitle: "Health & Wellness Tracker — VitaSync Health | HexaKode",
      metaDescription:
        "HIPAA-compliant cross-platform health app with wearable sync, AI insights, and medication management for VitaSync Health.",
      ogImage:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&auto=format&fit=crop&q=80",
    },
    settings: {
      featured: true,
      showOnHomepage: true,
      allowPreview: true,
    },
    status: "Published",
    publishedAt: "2026-03-15T10:00:00Z",
    createdAt: "2026-02-01T11:00:00Z",
    updatedAt: "2026-03-15T10:00:00Z",
  },

  {
    id: "pf-003",
    title: "Furniture Manufacturing Website",
    slug: "furniture-manufacturing-website",
    category: "E-Commerce",
    clientName: "Timberlane Craft Co.",
    projectUrl: "https://timberlane.example.com",
    githubUrl: "https://github.com/example/timberlane",
    shortDescription:
      "A high-conversion e-commerce platform with 3D product configurator, AR room preview, and seamless B2B wholesale ordering for a premium furniture manufacturer.",
    longDescription:
      "Timberlane Craft Co. needed a premium digital storefront that could showcase their handcrafted furniture with the same level of craftsmanship as their physical products. We delivered a Next.js commerce platform featuring a real-time 3D product configurator, WebAR room placement preview, and a separate B2B portal with tiered pricing, bulk order management, and net-30 invoicing workflows. The site achieved a 340% improvement in online conversion rate within the first quarter of launch.",
    coverImage:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80",
    gallery: [
      {
        id: "g-003-1",
        url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80",
        alt: "Homepage hero",
        isCover: true,
      },
      {
        id: "g-003-2",
        url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80",
        alt: "Product configurator",
      },
      {
        id: "g-003-3",
        url: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&auto=format&fit=crop&q=80",
        alt: "B2B portal dashboard",
      },
    ],
    technologies: ["Next.js", "Prisma", "PostgreSQL", "Stripe", "Three.js", "WebXR", "TailwindCSS"],
    features: [
      {
        id: "f-003-1",
        title: "3D Product Configurator",
        description:
          "Interactive Three.js configurator allowing customers to customize wood finish, fabric, dimensions, and hardware with real-time 3D preview.",
      },
      {
        id: "f-003-2",
        title: "AR Room Preview",
        description:
          "WebXR-powered augmented reality mode lets shoppers place furniture in their room using their smartphone camera before purchasing.",
      },
      {
        id: "f-003-3",
        title: "B2B Wholesale Portal",
        description:
          "Dedicated trade portal with MOQ pricing, bulk order management, net-30 credit terms, and automated invoicing.",
      },
      {
        id: "f-003-4",
        title: "Stripe Payment Integration",
        description:
          "Full Stripe Commerce integration with split payment, deposit-on-order, and installment plan options for high-ticket items.",
      },
    ],
    seo: {
      metaTitle: "Furniture Manufacturing Website — Timberlane Craft Co. | HexaKode",
      metaDescription:
        "Premium e-commerce platform with 3D product configurator, AR preview, and B2B wholesale portal for Timberlane Craft Co.",
      ogImage:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&auto=format&fit=crop&q=80",
    },
    settings: {
      featured: false,
      showOnHomepage: true,
      allowPreview: true,
    },
    status: "Published",
    publishedAt: "2026-04-01T08:00:00Z",
    createdAt: "2026-02-15T09:30:00Z",
    updatedAt: "2026-04-01T08:00:00Z",
  },

  {
    id: "pf-004",
    title: "Educational LMS Platform",
    slug: "educational-lms-platform",
    category: "Education",
    clientName: "LearnPath Academy",
    projectUrl: "https://learnpath.example.com",
    githubUrl: "",
    shortDescription:
      "A full-featured Learning Management System with live sessions, AI-generated quizzes, progress tracking, and certificate issuance for 50,000+ students.",
    longDescription:
      "LearnPath Academy required a scalable LMS that could replace their aging platform while supporting live classroom sessions, asynchronous coursework, and automated assessment generation. We built a comprehensive platform using Next.js for the student-facing app, with a separate instructor dashboard, a real-time video classroom built on Agora, and an AI-powered quiz generator. The system handles 50,000+ concurrent learners with Redis-backed session management and Cloudflare CDN for global asset delivery.",
    coverImage:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80",
    gallery: [
      {
        id: "g-004-1",
        url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80",
        alt: "Student learning dashboard",
        isCover: true,
      },
      {
        id: "g-004-2",
        url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80",
        alt: "Live classroom interface",
      },
      {
        id: "g-004-3",
        url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80",
        alt: "Course catalog browse",
      },
    ],
    technologies: ["Next.js", "Supabase", "TypeScript", "TailwindCSS", "Agora SDK", "Redis", "Node.js"],
    features: [
      {
        id: "f-004-1",
        title: "Live Video Classrooms",
        description:
          "Agora-powered real-time classrooms with whiteboard, screen share, breakout rooms, and recording with auto-transcript.",
      },
      {
        id: "f-004-2",
        title: "AI Quiz Generator",
        description:
          "Automated assessment creation from course content using LLM-powered question generation, with configurable difficulty and format.",
      },
      {
        id: "f-004-3",
        title: "Adaptive Learning Paths",
        description:
          "Personalized curriculum recommendations based on learner performance data and declared learning objectives.",
      },
      {
        id: "f-004-4",
        title: "Blockchain Certificates",
        description:
          "Tamper-proof course completion certificates minted on Polygon with verifiable on-chain credential proofs.",
      },
    ],
    seo: {
      metaTitle: "Educational LMS Platform — LearnPath Academy | HexaKode",
      metaDescription:
        "Scalable learning management system with live sessions, AI quizzes, adaptive paths, and blockchain certificates for 50,000+ learners.",
      ogImage:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop&q=80",
    },
    settings: {
      featured: false,
      showOnHomepage: false,
      allowPreview: true,
    },
    status: "Draft",
    publishedAt: null,
    createdAt: "2026-05-01T13:00:00Z",
    updatedAt: "2026-06-10T16:45:00Z",
  },

  {
    id: "pf-005",
    title: "Restaurant Ordering System",
    slug: "restaurant-ordering-system",
    category: "Food & Beverage",
    clientName: "Ember & Oak Restaurants",
    projectUrl: "https://emberoak.example.com",
    githubUrl: "https://github.com/example/ember-oak",
    shortDescription:
      "A multi-venue restaurant platform with QR-based tableside ordering, kitchen display integration, loyalty program, and real-time analytics for a restaurant group.",
    longDescription:
      "Ember & Oak operates 12 restaurant venues and needed a unified digital ordering platform to replace fragmented POS systems and paper menus. We delivered a multi-tenant Next.js platform featuring QR-code tableside ordering, real-time kitchen display integration with WebSocket push updates, a stamped loyalty rewards program, and an executive analytics dashboard showing revenue, top dishes, and table turn times across all venues. Integration with Square POS and Deliverect for delivery aggregator management completed the ecosystem.",
    coverImage:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80",
    gallery: [
      {
        id: "g-005-1",
        url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80",
        alt: "Restaurant dining experience",
        isCover: true,
      },
      {
        id: "g-005-2",
        url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop&q=80",
        alt: "Menu ordering interface",
      },
      {
        id: "g-005-3",
        url: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&auto=format&fit=crop&q=80",
        alt: "Kitchen display system",
      },
    ],
    technologies: ["React", "Node.js", "MongoDB", "Socket.io", "Redis", "Square API", "Stripe"],
    features: [
      {
        id: "f-005-1",
        title: "QR Tableside Ordering",
        description:
          "Guests scan a unique QR code to access the digital menu, customize orders, and pay — no app download required.",
      },
      {
        id: "f-005-2",
        title: "Kitchen Display System",
        description:
          "Real-time WebSocket-powered order routing to kitchen stations with countdown timers, modifications highlighted, and audio alerts.",
      },
      {
        id: "f-005-3",
        title: "Loyalty Rewards Program",
        description:
          "Digital stamp card system with tiered rewards, birthday perks, and referral bonuses tracked across all venues.",
      },
      {
        id: "f-005-4",
        title: "Multi-Venue Analytics",
        description:
          "Executive dashboard with cross-venue revenue tracking, top dish performance, table turn optimization, and hourly heatmaps.",
      },
    ],
    seo: {
      metaTitle: "Restaurant Ordering System — Ember & Oak | HexaKode",
      metaDescription:
        "Multi-venue restaurant platform with QR ordering, kitchen display integration, loyalty program, and real-time analytics for Ember & Oak Restaurants.",
      ogImage:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80",
    },
    settings: {
      featured: false,
      showOnHomepage: true,
      allowPreview: false,
    },
    status: "Draft",
    publishedAt: null,
    createdAt: "2026-06-01T10:00:00Z",
    updatedAt: "2026-06-20T14:20:00Z",
  },
];
