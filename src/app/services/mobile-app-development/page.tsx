import React from "react";
import { Metadata } from "next";
import ServiceLandingPageTemplate from "@/components/services/ServiceLandingPageTemplate";
import Footer from "@/components/layout/Footer";
import { getPublishedProjects } from "@/modules/portfolio/services/portfolio.service";
import { mapDbCategoryToPublic } from "@/modules/portfolio/types/portfolio";
import { Project } from "@/types/home";

import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Mobile App Development Company in Kerala | App Developers | HexaKode",
  description:
    "Seeking a Mobile App Development Company in Kerala? HexaKode designs high-performance iOS and Android applications using Flutter and clean architecture.",
  path: "/services/mobile-app-development",
  image: "/og-mobile-development.png",
  imageAlt: "HexaKode Mobile App Development Services",
  keywords: [
    "Mobile App Development Company in Kerala",
    "App Developers Kerala",
    "Mobile App Development Company in Palakkad",
    "Mobile App Development Company near me",
    "Flutter App Development Company",
    "Android App Development",
    "iOS App Development",
    "Cross Platform App Development",
    "Flutter Developers Kerala",
    "Business Mobile Apps",
    "Startup App Development",
    "Mobile Application Development Services",
    "Custom Mobile App Development",
    "React Native Developers",
  ],
});

const CHALLENGES = [
  {
    title: "Double the Cost of Native Platform Coding",
    description: "Building separate native applications for Android (Kotlin/Java) and iOS (Swift) doubles your engineering overhead, complicates database syncs, and extends product release cycles significantly.",
    iconName: "smartphone",
  },
  {
    title: "Sluggish Performance & Frame Drops",
    description: "Mobile applications built on poorly optimized hybrid frameworks run slowly, cause device overheating, lag during user scrolls, and degrade user retention metrics on older smartphones.",
    iconName: "activity",
  },
  {
    title: "Complex Third-Party API Integrations",
    description: "Connecting maps, payment gateways, complex background syncs, real-time WebSockets, and Bluetooth devices often fail when app code is not engineered with robust structural parameters.",
    iconName: "layers",
  },
  {
    title: "Disjointed User Interface & Navigation",
    description: "If a mobile app fails to adapt to native iOS and Android gesture paradigms, users experience friction, leading to immediate app store uninstalls and lower ratings.",
    iconName: "users",
  },
];

const WHY_CHOOSE_POINTS = [
  {
    title: "Single-Codebase Efficiency",
    desc: "By developing mobile applications using Google's Flutter framework, we build for iOS and Android simultaneously from one source code repository, reducing timelines and maintenance costs by 50%.",
  },
  {
    title: "High-Performance Execution",
    desc: "We compile Flutter directly to native ARM machine code. This delivers 60fps animations, fast boot speeds, low memory footprint, and native performance even on low-end smartphones.",
  },
  {
    title: "Offline-First Architectures",
    desc: "We engineer apps with secure local SQLite databases and caching. This ensures your app operates smoothly in low-network regions, automatically syncing database records when connections are restored.",
  },
  {
    title: "Continuous CI/CD Delivery",
    desc: "We configure pipeline deployment tools like Codemagic and Fastlane to automate app store reviews and updates, releasing new features to your users smoothly and securely.",
  },
];

const PROCESS_STEPS = [
  {
    title: "Discovery",
    iconName: "search",
    duration: "1–2 Days",
    summary: "Analyzing mobile application specifications and user journeys.",
    bullets: [
      "Map primary user journeys & screen layouts",
      "Identify Android & iOS OS compatibility needs",
      "Audit competitor app designs & structures",
      "Define native hardware sensor integrations"
    ],
    deliverables: [
      "Functional Requirements Document",
      "Mobile Feature Specifications List",
      "User Persona Audit Cards"
    ],
    businessValue: "Ensures the mobile app targets the right platform features and minimizes feature bloat."
  },
  {
    title: "Planning",
    iconName: "clipboard-list",
    duration: "3 Days",
    summary: "Setting up Flutter architecture and database layers.",
    bullets: [
      "Outline state management patterns (Bloc/Riverpod)",
      "Design local relational SQLite schemas",
      "Structure secure backend API endpoints",
      "Establish background push notification pipelines"
    ],
    deliverables: [
      "API Specification Roadmap",
      "State Management Architecture Diagram",
      "Database Entity Relation Map"
    ],
    businessValue: "Guarantees a clean, scalable mobile codebase that works offline and syncs in real-time."
  },
  {
    title: "UI/UX Design",
    iconName: "palette",
    duration: "1–2 Weeks",
    summary: "Creating modern, intuitive, and native-feeling interfaces.",
    bullets: [
      "Wireframe primary screen layouts & transitions",
      "Design high-fidelity Figma screens (iOS & Android)",
      "Configure dark & light mode style assets",
      "Create fluid screen transition animations"
    ],
    deliverables: [
      "Figma Mobile UI Design File",
      "Interactive Clickable Prototypes",
      "Exportable UI Assets & Visual Tokens"
    ],
    businessValue: "Ensures standard mobile tap targets and highly intuitive gestures for maximum user retention."
  },
  {
    title: "Development",
    iconName: "code",
    duration: "3–4 Weeks",
    summary: "Coding clean, fast, and structured cross-platform Flutter code.",
    bullets: [
      "Write modular Dart codes & widgets",
      "Integrate camera, GPS, and Bluetooth sensor APIs",
      "Configure local caching & offline state sync",
      "Connect push notifications & payment APIs"
    ],
    deliverables: [
      "Alpha/Beta APK and TestFlight builds",
      "Version-Controlled Git Repository",
      "Connected Backend Admin Workspace"
    ],
    businessValue: "Deploys a single shared codebase for both Android & iOS, cutting development costs in half."
  },
  {
    title: "Testing",
    iconName: "test-tube",
    duration: "4–5 Days",
    summary: "Validating cross-device compatibility and performance.",
    bullets: [
      "Test on multiple physical mobile screen sizes",
      "Check offline mode & database triggers",
      "Audit memory allocations & battery drain",
      "Validate secure login token authentication"
    ],
    deliverables: [
      "Performance and Framerate logs",
      "Security Pen-Testing Reports",
      "QA Device Testing Matrix Review"
    ],
    businessValue: "Eliminates crashes and performance lag before submit, protecting app store ratings."
  },
  {
    title: "Deployment",
    iconName: "rocket",
    duration: "2–3 Days",
    summary: "Submitting the apps to Apple App Store and Google Play.",
    bullets: [
      "Build production APK, AAB, and IPA files",
      "Configure App Store listings & visual metadata",
      "Link privacy policies & compliance docs",
      "Submit for Apple & Google App Store reviews"
    ],
    deliverables: [
      "Live App Store Publication URLs",
      "Play Store Developer Dashboard Setup",
      "Configured Analytics & Crash reports"
    ],
    businessValue: "Manages store submission policies and achieves publication with minimal delay."
  },
  {
    title: "Support",
    iconName: "wrench",
    duration: "Ongoing",
    summary: "Monitoring crash logs and shipping hotfixes.",
    bullets: [
      "Monitor Crashlytics logs & dashboards",
      "Implement OS compatibility updates (iOS & Android)",
      "Deploy new app store feature releases",
      "Configure regular backend database backups"
    ],
    deliverables: [
      "Monthly Usage & Crash Reports",
      "Priority App Store Hotfixes",
      "API Performance Auditing"
    ],
    businessValue: "Keeps your app stable and compatible across Android & iOS versions."
  }
];

const TECHNOLOGIES = [
  {
    name: "Flutter & Dart",
    reason: "Google's Flutter framework and Dart programming language allow us to construct cross-platform applications with native performance, fluid UI systems, and compile times that speed up launch cycles.",
  },
  {
    name: "React Native",
    reason: "Build high-performance cross-platform mobile applications for Android and iOS using React Native. We create scalable, maintainable apps with a native user experience while sharing a single codebase to reduce development time and cost.",
  },
  {
    name: "Firebase Suite",
    reason: "Firebase handles real-time authentication, serverless database sync, instant cloud messaging (push notifications), and analytics tracking, enabling rapid mobile development.",
  },
  {
    name: "REST APIs & WebSockets",
    reason: "We build secure data sync pipelines. For real-time updates (like tracking, notifications, or chat), we implement persistent WebSocket connections.",
  },
  {
    name: "SQLite & local storage",
    reason: "For offline capability, we integrate local database structures. This caches offline changes securely, maintaining seamless app usability during network dropouts.",
  },
  {
    name: "Google Maps API",
    reason: "For geo-location, custom map markers, routing, and address searches, we write high-performance wrappers linking maps natively inside Flutter widgets.",
  },
  {
    name: "Fastlane & CI/CD",
    reason: "Fastlane automates code signing, screenshots generation, beta test uploads (TestFlight), and store deployment pipelines, preventing human packaging errors.",
  },
  {
    name: "Bloc & Riverpod",
    reason: "These state management patterns decouple interface components from backend data flows. This yields modular, easily testable app logic and eliminates memory leaks.",
  },
  {
    name: "Node.js Backends",
    reason: "We engineer robust APIs using Node.js to act as the backend coordinator. This manages database storage, third-party systems, and pushes data to mobile devices.",
  },
];

const BENEFITS = [
  {
    title: "Launch Twice as Fast",
    desc: "Our unified cross-platform Flutter workflow creates Android and iOS versions together, cutting development time in half.",
  },
  {
    title: "Continuous Offline Usability",
    desc: "Your mobile application remains usable without internet access. Local actions are queued and synced once connection returns.",
  },
  {
    title: "Flawless Device Compatibility",
    desc: "We test code on a large grid of physical tablet and phone resolutions, ensuring visual consistency across all screen displays.",
  },
];

const FAQS = [
  {
    question: "Why choose Flutter for mobile app development?",
    answer: "Flutter is Google's UI software development kit. It compiles directly to native ARM machine code. This delivers 60fps animations, near-instant load times, and native-level execution while allowing our engineers to build both Android and iOS apps from a single source code folder, cutting dev costs by half.",
  },
  {
    question: "How much does it cost to develop a mobile app in Kerala?",
    answer: "Costs depend on complexity, backend architecture, third-party integrations, and user authentication schemas. Cross-platform apps using Flutter are much more cost-effective than building native Android and iOS apps separately, since they require half the developer resource hours to build and maintain.",
  },
  {
    question: "How long does it take to develop a cross-platform mobile application?",
    answer: "A standard MVP app project takes around 6 to 8 weeks. Larger platforms involving real-time GPS tracking, complex payment configurations, chat engines, or custom business dashboards may require 10 to 16 weeks to ensure quality execution and thorough multi-device testing.",
  },
  {
    question: "What is the advantage of cross-platform apps over native apps?",
    answer: "Cross-platform development (using Flutter) is faster, cost-efficient, and easier to maintain. When you update a feature or fix a bug, you deploy it once for both iOS and Android. This guarantees feature parity across platforms, whereas native requires maintaining two separate engineering teams.",
  },
  {
    question: "Do you handle app store submission (Google Play Store & Apple App Store)?",
    answer: "Yes, absolutely. We manage the entire packaging, code signing, and deployment process. We compile production bundles, generate app store assets, configure developer accounts, set privacy policies, and guide the app through Google's and Apple's review teams.",
  },
  {
    question: "How do you secure data in mobile applications?",
    answer: "We employ multi-layer security. This includes secure local encryption for offline storage, secure HTTPS/TLS data transport layers, certificate pinning, JWT authentication headers, dynamic API keys protection, and strict Firestore security rules checks.",
  },
  {
    question: "Can you integrate third-party APIs (like payment gateways, maps, push notifications)?",
    answer: "Yes. We specialize in complex integrations. We hook up Google Maps, Razorpay, Stripe, Firebase Cloud Messaging, biometric logins, external hardware APIs, and custom enterprise databases, ensuring reliable data synchronization.",
  },
  {
    question: "Will you provide the source code of the mobile app?",
    answer: "Yes. Upon project completion, we hand over full ownership of the Git repository, including clean source codes, configuration scripts, asset files, and detailed documentation required for future updates.",
  },
  {
    question: "Do you offer post-launch maintenance, updates, and support?",
    answer: "Yes. We offer monthly maintenance retainers. This covers resolving crashes, updating code to support new Android and iOS versions, security updates, library upgrades, and adding new features as your user base grows.",
  },
  {
    question: "How do we get started with mobile app development at HexaKode?",
    answer: "Simply book a free consultation or contact us. We'll set up a discovery call to discuss your ideas, map user requirements, select the ideal technology stack, and provide an implementation roadmap and quotation.",
  },
];

export default async function MobileAppDevelopmentPage() {
  let mappedProjects: Project[] = [];
  try {
    const dbProjects = await getPublishedProjects();
    const mobileProjects = dbProjects.filter((p) => mapDbCategoryToPublic(p.category) === "Mobile").slice(0, 6);
    
    mappedProjects = mobileProjects.map((p) => {
      const publicCategory = mapDbCategoryToPublic(p.category);
      return {
        id: p.id,
        title: p.title,
        category: publicCategory,
        imageUrl: p.coverImage || "https://lh3.googleusercontent.com/aida-public/AB6AXuB2YxLvd3x5jPAxgZFL6XMO5u3FKnZOqm3Sw5jiYFwt6C_1rbby046caqliXpWGTpjLpPwnIvaeaOmdE4lDZVyZ_sdZvktvMtR48G9PDwq9PdT4z5dmEyDZmvTGdtk0tGLYG3aND_F-CKnXlxCnvDioVyszWJ-5hrLBoAQmefvVnmK51ys89hcKnm770jq6SVjM3Pg-onRL9YM_DO5PLioIGZ3Onw3JrHAYxnPC4ePN8pVa9SN1k4ErAvN0hneQVUTOK8JkgL9fql8e",
        tags: p.technologies.map((t) => t.name),
        href: `/portfolio/${p.slug}`,
        description: p.shortDescription,
        featured: p.featured,
      };
    });
  } catch (error) {
    console.error("Error loading projects for Mobile Development page:", error);
  }

  return (
    <ServiceLandingPageTemplate
      badge="MOBILE APP DEVELOPMENT KERALA"
      h1="Mobile App Development"
      heroDescription="High-performance, cross-platform Android and iOS applications built with Flutter and React Native. We develop feature-rich mobile apps that stream live data, operate offline, and deliver native-like user experiences for startups and enterprises."
      serviceName="Mobile App Development"
      serviceUrl="/services/mobile-app-development"
      metaDescription="Seeking a Mobile App Development Company in Kerala? HexaKode designs high-performance iOS and Android applications using Flutter and clean architecture."
      challenges={CHALLENGES}
      whyChooseDesc="We do not compromise on mobile performance. We compile Flutter apps directly to native machine code using clean, testable architectural patterns."
      whyChoosePoints={WHY_CHOOSE_POINTS}
      processSteps={PROCESS_STEPS}
      technologies={TECHNOLOGIES}
      benefits={BENEFITS}
      faqs={FAQS}
      projects={mappedProjects}
      footer={<Footer />}
    />
  );
}
