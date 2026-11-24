// Single source of truth for all portfolio content.
// Edit this file to update the site.

export const profile = {
  name: "Sajib Saha",
  firstName: "Sajib",
  lastName: "Saha",
  initials: "SS",
  title: "Software Engineer",
  tagline: ["Agentic AI & LLM Systems", "AI Training Data"],
  location: "Dhaka, Bangladesh",
  phone: "+880 130 322 9484",
  phoneHref: "tel:+8801303229484",
  email: "sajibsaha3464@gmail.com",
  links: {
    github: { label: "github.com/Sajibsahacsedu", href: "https://github.com/Sajibsahacsedu" },
    linkedin: {
      label: "linkedin.com/in/sajib-saha",
      href: "https://www.linkedin.com/in/sajib-saha-32159728a",
    },
    website: { label: "sajibsaha.lovable.app", href: "https://sajibsaha.lovable.app/" },
  },
  summary:
    "Software Engineer at Therap (BD) and Computer Science graduate of the University of Dhaka. I build production healthcare software in Java 21 and Oracle DB, and LLM-powered agents on open-weight models (Gemma 4). I work agent-first every day with Claude Code, Codex, and Antigravity: orchestrating multi-agent workflows, writing custom skills, connecting MCP servers, and reviewing and debugging AI-generated code. I have evaluated coding agents on SWE-Bench Pro and Terminal-Bench 2.0, annotated and curated datasets for computer-vision models, and published deep-learning research on arXiv.",
  heroLine:
    "I build production healthcare software and LLM-powered agents, and I evaluate coding agents on SWE-Bench Pro and Terminal-Bench 2.0.",
};

export const stats = [
  { value: "65%", label: "Terminal-Bench 2.0 resolve rate (Haiku 5.5)" },
  { value: "55%", label: "SWE-Bench Pro resolve rate (Haiku 5.5)" },
  { value: "45", label: "Failed agent trajectories classified" },
  { value: "1", label: "Deep-learning paper published on arXiv" },
];

export type Experience = {
  company: string;
  role: string;
  period: string;
  location: string;
  link: { label: string; href: string };
  stack: string[];
  bullets: string[];
};

export const experience: Experience[] = [
  {
    company: "Therap (BD) Ltd.",
    role: "Software Engineer",
    period: "Jun 2026 — Present",
    location: "Dhaka",
    link: { label: "therapbd.com", href: "https://therapbd.com/" },
    stack: ["Java 21", "Oracle DB", "Gemma 4", "Claude Code", "Codex", "Antigravity", "MCP"],
    bullets: [
      "Develop and maintain the ISP (Individual Support Plan) module of a healthcare documentation platform used by care providers, using Java 21 and Oracle DB.",
      "Build and fix features in the MAR (Medication Administration Record) module, where data correctness directly affects patient medication safety.",
      "Develop health-tracking features that record and surface patient health data for caregivers and clinicians.",
      "Build an LLM-powered data agent on Google's open-weight Gemma 4, connecting it to application data so users can query records in natural language.",
      "Run multi-agent orchestration with Claude Code, Codex, and Antigravity, splitting work across agents for planning, implementation, testing, and review.",
      "Author custom Claude Skills encoding team conventions, and connect MCP servers so agents can use internal tools and documentation.",
      "Review and debug human- and AI-written code to catch logic errors, regressions, and unsafe changes before merge.",
    ],
  },
  {
    company: "Fabingo",
    role: "Backend Developer, E-commerce Startup",
    period: "Jan 2026 — May 2026",
    location: "Remote",
    link: { label: "facebook.com/fabingo.bd", href: "https://www.facebook.com/fabingo.bd/" },
    stack: ["FastAPI", "Supabase", "PostgreSQL", "Prisma", "Next.js", "SSLCommerz", "VLM Run Orion"],
    bullets: [
      "Built backend services with FastAPI and Supabase (PostgreSQL), using Prisma for schema management and data access, serving a Next.js storefront.",
      "Designed relational data models and REST APIs for product, cart, order, and checkout flows.",
      "Integrated the SSLCommerz payment gateway, handling success, failure, and cancellation callbacks and keeping order status in sync.",
      "Integrated VLM Run Orion, a vision-language AI agent, to automate image understanding in product workflows.",
    ],
  },
];

export const evaluation = {
  title: "Coding-Agent Evaluation on SWE-Bench Pro & Terminal-Bench 2.0",
  period: "2026",
  kind: "Independent project",
  link: { label: "GitHub", href: "https://github.com/Sajibsahacsedu" },
  benchmarks: [
    {
      name: "SWE-Bench Pro",
      detail: "20-task sample of the 731-task public set · Python, JS, TS, Go",
      results: [
        { model: "Claude Haiku 4.5", value: 25 },
        { model: "Claude Haiku 5.5", value: 55 },
      ],
    },
    {
      name: "Terminal-Bench 2.0",
      detail: "20-task sample of 89 human-verified tasks · Harbor framework",
      results: [
        { model: "Claude Haiku 4.5", value: 30 },
        { model: "Claude Haiku 5.5", value: 65 },
      ],
    },
  ],
  failureModes: [
    "Wrong file localization",
    "Incomplete multi-file patch",
    "Broken tests",
    "Environment & tool-use errors",
  ],
  bullets: [
    "Classified 45 failed trajectories by failure mode and documented recurring patterns.",
    "Authored 3 tasks in Terminal-Bench format, each with an instruction, Docker environment, verification tests, and an oracle solution.",
    "Compared Claude Code against Codex (GPT-5-mini / GPT-6 Luna) on identical tasks by resolve rate, cost per task, and steps per task.",
  ],
};

export const skills: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["Java (21)", "Python", "SQL", "JavaScript", "C/C++"] },
  {
    group: "Backend & Web",
    items: ["FastAPI", "Next.js", "Prisma ORM", "Supabase", "REST API design", "SSLCommerz"],
  },
  { group: "Databases", items: ["Oracle Database", "PostgreSQL", "MySQL"] },
  {
    group: "Agentic Coding",
    items: [
      "Claude Code",
      "OpenAI Codex",
      "Google Antigravity",
      "Multi-agent orchestration",
      "MCP servers",
      "Claude Skills",
    ],
  },
  {
    group: "LLMs & Models",
    items: ["Gemma 4", "OpenAI API", "VLM Run Orion", "Tool-using agents", "Prompt design"],
  },
  {
    group: "Agent Evaluation",
    items: [
      "SWE-Bench Pro",
      "Terminal-Bench 2.0",
      "Harbor",
      "Docker harnesses",
      "Failure-mode analysis",
      "LLM code review",
    ],
  },
  {
    group: "ML & Data Science",
    items: ["Pandas", "Scikit-learn", "CNN", "Vision Transformer", "YOLO", "MAPPO", "EDA", "Ablation studies"],
  },
  {
    group: "Data Annotation",
    items: ["Polygon labeling", "Bounding boxes", "Dataset curation", "Label QA", "Roboflow"],
  },
  {
    group: "Tools & Testing",
    items: ["Git/GitHub", "Linux", "Docker", "Postman", "Playwright", "Appium", "Jupyter"],
  },
];

export type Research = {
  title: string;
  period: string;
  supervisor: string;
  links: { label: string; href: string }[];
  bullets: string[];
  tags: string[];
};

export const research: Research[] = [
  {
    title: "Road Damage & Manhole Detection via Deep Learning",
    period: "2025",
    supervisor: "Supervisor: Dr. Muhammad Ibrahim",
    links: [
      { label: "arXiv", href: "https://arxiv.org/abs/2510.03797" },
      { label: "GitHub", href: "https://github.com/Sajibsahacsedu/RoadClassification" },
    ],
    tags: ["CNN", "Vision Transformer", "YOLO", "Roboflow"],
    bullets: [
      "Annotated a custom road-defect dataset with polygon labels in Roboflow, then cleaned, profiled, and quality-checked the labels before training.",
      "Designed a hybrid CNN + Vision Transformer + YOLO pipeline for high-precision defect classification and detection.",
      "Ran performance evaluation and error analysis to find where the model failed and validate its outputs.",
    ],
  },
  {
    title: "Fair Task Offloading for Decentralized MEC via Multi-Agent Deep RL",
    period: "Ongoing",
    supervisor: "Supervisors: Dr. Md. Abdur Razzaque, Palash Roy",
    links: [
      {
        label: "Results",
        href: "https://drive.google.com/drive/folders/1mS_sG0YgJd-gbWPjor6uBzbkp8j_25J5?usp=drive_link",
      },
    ],
    tags: ["MAPPO", "Multi-agent RL", "Edge computing"],
    bullets: [
      "Designed and tuned a MAPPO-based multi-agent reinforcement learning model for decentralized edge task scheduling.",
      "Formulated a joint latency–energy–fairness objective; validated robustness through ablation studies and hyperparameter tuning.",
    ],
  },
];

export const annotation = [
  "Annotated image data with polygon and bounding-box labels for object detection and segmentation models.",
  "Built training datasets from raw data: collection, cleaning, labeling, class balancing, and train/validation/test splits.",
  "Reviewed label quality and fixed inconsistent or incorrect annotations before model training.",
  "Evaluate and correct AI-generated code daily for correctness, edge cases, and quality — the core skill in coding-model evaluation and RLHF work.",
];

export type Project = {
  title: string;
  subtitle: string;
  period: string;
  description: string[];
  tags: string[];
  links: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    title: "Skill Bridge",
    subtitle: "AI-Powered Career Development Platform",
    period: "2025",
    description: [
      "Built a recommendation engine that generates personalized career roadmaps and skill-gap analysis from user data.",
      "Integrated OpenAI models to parse CVs and extract skills from unstructured text.",
    ],
    tags: ["LLM integration", "OpenAI API", "Recommendation engine"],
    links: [{ label: "GitHub", href: "https://github.com/Sajibsahacsedu/Skill_Bridge.git" }],
  },
  {
    title: "ZeroBin",
    subtitle: "Smart Waste Management Ecosystem",
    period: "2025",
    description: [
      "Architected PostgreSQL schemas and role-based analytics dashboards tracking collection efficiency, resolution time, and operational KPIs.",
      "Reached the 2nd round of Therap JavaFest 2025.",
    ],
    tags: ["PostgreSQL", "Analytics dashboards", "RBAC", "Therap JavaFest 2025"],
    links: [
      { label: "GitHub", href: "https://github.com/Javafest-2025" },
      { label: "Demo", href: "https://youtu.be/mh8ZIMyFH3w" },
    ],
  },
];

export const education = [
  {
    school: "University of Dhaka",
    degree: "B.Sc. in Computer Science and Engineering",
    period: "Jan 2022 — May 2026",
    location: "Dhaka, Bangladesh",
    note: "Coursework: Data Structures, Algorithms, Databases, Software Engineering, Machine Learning, Statistics",
  },
  {
    school: "Government Rajendra College",
    degree: "Higher Secondary Certificate (HSC), Science",
    period: "Jul 2018 — Apr 2020",
    location: "Faridpur, Bangladesh",
    note: "",
  },
];

export const achievements = [
  { title: "10th Place", detail: "IIUC AI Hackathon, out of 100+ teams (computer vision and AI challenges)" },
  { title: "Finalist", detail: "UAP Hackathon" },
  { title: "2nd Round Selection", detail: "Therap JavaFest 2025" },
  { title: "Published Author", detail: "Deep-learning paper on road damage and manhole detection (arXiv, 2025)" },
];

// Each section of the page is a "station" in the 3D scene.
export const stations = [
  { id: "home", label: "Home", body: "Gargantua" },
  { id: "about", label: "About", body: "Nebula" },
  { id: "experience", label: "Experience", body: "Ringed Planet" },
  { id: "evaluation", label: "Agent Eval", body: "Pulsar" },
  { id: "skills", label: "Skills", body: "Galaxy" },
  { id: "research", label: "Research", body: "Constellation" },
  { id: "projects", label: "Projects", body: "Asteroid Field" },
  { id: "education", label: "Education", body: "Orbital System" },
  { id: "contact", label: "Contact", body: "Wormhole" },
] as const;

export type StationId = (typeof stations)[number]["id"];
