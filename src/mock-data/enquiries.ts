import { AdminEnquiry } from "@/types/admin";

export const MOCK_ENQUIRIES: AdminEnquiry[] = [
  {
    id: "enq-1",
    name: "Thomas Wright",
    email: "t.wright@nexiscorp.com",
    company: "Nexis Corp",
    projectType: "Software",
    message: "We need an architectural redesign of our data warehouse pipeline to support higher throughput. Let's schedule a call.",
    date: "2026-06-15",
    status: "New"
  },
  {
    id: "enq-2",
    name: "Beatrix Kiddo",
    email: "b.kiddo@hanzo.io",
    company: "Hanzo Swordworks",
    projectType: "Web",
    message: "Looking to build a premium headless e-commerce store with high performance. Visual speed and animations are key.",
    date: "2026-06-14",
    status: "New"
  },
  {
    id: "enq-3",
    name: "William Mercer",
    email: "mercer@apexlogistics.com",
    company: "Apex Logistics",
    projectType: "UI/UX",
    message: "We need a dashboard UI design for operator telemetry terminals in our regional depots. Requires clean visual hierarchy.",
    date: "2026-06-13",
    status: "Reviewed"
  },
  {
    id: "enq-4",
    name: "Diana Prince",
    email: "diana@themyscira.org",
    company: "Themyscira Antiques",
    projectType: "Mobile",
    message: "We require a mobile application with advanced cataloging, high resolution media viewer and secure offline vault storage.",
    date: "2026-06-12",
    status: "Reviewed"
  },
  {
    id: "enq-5",
    name: "Victor Stone",
    email: "vstone@star-labs.co",
    company: "STAR Labs",
    projectType: "Software",
    message: "System health check and diagnostic app development. The interface should interact with high frequency local APIs.",
    date: "2026-06-11",
    status: "Archived"
  },
  {
    id: "enq-6",
    name: "Bruce Wayne",
    email: "bwayne@wayneenterprises.com",
    company: "Wayne Enterprises",
    projectType: "Software",
    message: "We require a secure, decentralized communications network using high performance encryptors.",
    date: "2026-06-10",
    status: "Reviewed"
  },
  {
    id: "enq-7",
    name: "Selina Kyle",
    email: "kyle@catclaw.net",
    company: "Gotham Security",
    projectType: "Mobile",
    message: "Development of a highly stealthy, biometrically locked application for asset management.",
    date: "2026-06-09",
    status: "New"
  },
  {
    id: "enq-8",
    name: "Barry Allen",
    email: "ballen@centralcitypd.gov",
    company: "CCPD Diagnostics",
    projectType: "Web",
    message: "Fast search engine dashboard to retrieve forensically tagged data in real-time.",
    date: "2026-06-08",
    status: "Reviewed"
  },
  {
    id: "enq-9",
    name: "Clark Kent",
    email: "ckent@dailyplanet.com",
    company: "Daily Planet LLC",
    projectType: "Web",
    message: "We want to construct a fast portal for publishing high volume editorial contents with micro-interactions.",
    date: "2026-06-07",
    status: "Archived"
  },
  {
    id: "enq-10",
    name: "Hal Jordan",
    email: "hjordan@ferrisair.com",
    company: "Ferris Aircraft",
    projectType: "UI/UX",
    message: "Cockpit simulation dashboard for telemetry monitoring. Heavy performance and zero-frame drop requirements.",
    date: "2026-06-06",
    status: "New"
  },
  {
    id: "enq-11",
    name: "Oliver Queen",
    email: "oqueen@queenindustries.com",
    company: "Queen Industries",
    projectType: "Software",
    message: "Looking for tracking dashboard integrations for our clean energy generation grids.",
    date: "2026-06-05",
    status: "Reviewed"
  },
  {
    id: "enq-12",
    name: "Arthur Curry",
    email: "acurry@atlantis-deep.net",
    company: "Atlantis Aquatech",
    projectType: "Web",
    message: "Public outreach portal containing high-fidelity animated charts showing marine ecology statistics.",
    date: "2026-06-04",
    status: "Archived"
  },
  {
    id: "enq-13",
    name: "Lois Lane",
    email: "llane@dailyplanet.com",
    company: "Daily Planet LLC",
    projectType: "Mobile",
    message: "Secure chat application implementation with end-to-end local storage database encrypted.",
    date: "2026-06-03",
    status: "Reviewed"
  },
  {
    id: "enq-14",
    name: "Lex Luthor",
    email: "lluthor@lexcorp.com",
    company: "LexCorp Industries",
    projectType: "Software",
    message: "Bespoke optimization solver for global resource allocation. Must handle sparse matrices and scale horizontally.",
    date: "2026-06-02",
    status: "New"
  },
  {
    id: "enq-15",
    name: "Peter Parker",
    email: "webhead@dailybugle.net",
    company: "Daily Bugle",
    projectType: "Web",
    message: "Photo hosting service with dynamic styling and high performance image compression pipeline.",
    date: "2026-06-01",
    status: "Reviewed"
  },
  {
    id: "enq-16",
    name: "Tony Stark",
    email: "tstark@starkindustries.com",
    company: "Stark Industries",
    projectType: "Software",
    message: "AI interface helper widgets layout. We are interested in Framer Motion micro-animations for voice waveforms.",
    date: "2026-05-30",
    status: "Reviewed"
  },
  {
    id: "enq-17",
    name: "Steve Rogers",
    email: "srogers@avengers.org",
    company: "The Avengers",
    projectType: "Mobile",
    message: "Operational status dashboard application for deployable teams, ensuring simple UI states for extreme operations.",
    date: "2026-05-29",
    status: "Archived"
  },
  {
    id: "enq-18",
    name: "Natasha Romanoff",
    email: "blackwidow@shield.gov",
    company: "SHIELD Security",
    projectType: "UI/UX",
    message: "Operator map interface audit. We need an expert evaluation on cognitive load and accessibility guidelines.",
    date: "2026-05-28",
    status: "Reviewed"
  },
  {
    id: "enq-19",
    name: "Bruce Banner",
    email: "bbanner@gamma-labs.edu",
    company: "Gamma Physics Lab",
    projectType: "Software",
    message: "Real-time chart visualizing radiation telemetry spikes. Speed is crucial.",
    date: "2026-05-27",
    status: "New"
  },
  {
    id: "enq-20",
    name: "Thor Odinson",
    email: "thor@asgard-power.net",
    company: "Asgard Power",
    projectType: "Web",
    message: "Heavy-duty electric load planning system console to control distribution assets.",
    date: "2026-05-26",
    status: "Reviewed"
  },
  {
    id: "enq-21",
    name: "Wanda Maximoff",
    email: "wmaximoff@westview.org",
    company: "Westview Creative",
    projectType: "UI/UX",
    message: "Interactive portal mockup with beautiful fluid animations and ambient styling.",
    date: "2026-05-25",
    status: "New"
  },
  {
    id: "enq-22",
    name: "Stephen Strange",
    email: "sstrange@sanctum.org",
    company: "Sanctum Diagnostics",
    projectType: "Software",
    message: "Multi-dimensional coordinates rendering widget using lightweight WebAssembly or Canvas.",
    date: "2026-05-24",
    status: "Reviewed"
  },
  {
    id: "enq-23",
    name: "Carol Danvers",
    email: "cdanvers@starforce.mil",
    company: "Starforce Corp",
    projectType: "Mobile",
    message: "Telemetry and global tracker UI. Needs clean offline cache synchronization.",
    date: "2026-05-23",
    status: "Archived"
  },
  {
    id: "enq-24",
    name: "T'Challa Udaku",
    email: "tchalla@wakanda-tech.org",
    company: "Wakanda Tech Foundation",
    projectType: "Software",
    message: "We want to hire a team to build an operating terminal UI matching HexaKode's Design System. High quality output expected.",
    date: "2026-05-22",
    status: "Reviewed"
  }
];
