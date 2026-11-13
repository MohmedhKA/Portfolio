export interface Project {
  title: string;
  description: string;
  tags: string[];
  year: string;
  learned?: string;
  techStack?: string;
  github?: string;
  showImage?: boolean;
  image?: string;
  status?: "active" | "discontinued";
}

export const projects: Project[] = [
  {
    title: "Blockchain E-Voting System",
    description:
      "A Hyperledger Fabric-based e-voting system with Private Data Collections, batch processing, and end-to-end verifiability. Designed for high-throughput elections with cryptographic audit trails.",
    tags: ["Hyperledger Fabric", "Node.js", "Research"],
    year: "2025",
    techStack: "Hyperledger Fabric, Node.js, React, Docker, GO",
    learned:
      "Hyperledger Fabric internals, Private Data Collections, Byzantine fault tolerance, and cryptographic audit design.",
    github: "https://github.com/MohmedhKA/E-Voting-V2",
    showImage: true,
    image: "/images/Evoting-app.png",
  },
  {
    title: "ECDAT",
    description:
      "A security tool that inspects repositories to detect cryptographic implementations vulnerable to post-quantum attacks and recommends quantum-safe alternative algorithms.",
    tags: ["Post-Quantum", "Cryptography", "Security Audit"],
    year: "2025",
    techStack: "Python, Cryptography, AST Analysis, NIST PQC Standards",
    learned:
      "Post-quantum vulnerability surfaces, Shor's algorithm threat models against asymmetric primitives, and NIST quantum-resistant algorithm migration.",
    github: "https://github.com/MohmedhKA/ECDAT",
    showImage: true,
    image: "https://raw.githubusercontent.com/MohmedhKA/ECDAT/main/docs/APP.png",
  },
  {
    title: "SenBye",
    description:
      "A campus marketplace and online auction platform empowering college students to buy and sell pre-owned items from seniors, featuring an AI agent for conversational product search and automated smart bidding.",
    tags: ["AI Agent", "Auctions", "Full Stack"],
    year: "2025",
    techStack: "Next.js, TypeScript, Python, AI Bidding Agent, WebSockets",
    learned:
      "Real-time auction synchronization, autonomous bidding engine logic, conversational search matching, and campus marketplace design.",
    github: "https://github.com/MohmedhKA/SenBye",
    showImage: true,
    image: "https://raw.githubusercontent.com/MohmedhKA/SenBye/main/docs/APP.png",
  },
  {
    title: "AutoVulnScan",
    description:
      "Automates vulnerability scanning, penetration testing, and security assessment using AI-driven vulnerability detection. Integrates with multiple security tools and provides comprehensive reports.",
    tags: ["Python", "AI Security"],
    year: "2025",
    techStack: "Python, Flask, REST API, NVD, CWE, Socket.io",
    learned:
      "NVD API integration, CWE database mapping, real-time vulnerability analysis, and REST API design for security tools.",
    github: "https://github.com/MohmedhKA/AutoVulnScan",
    showImage: true,
    image: "https://github.com/MohmedhKA/AutoVulnScan/blob/main/assets/Main_Screen.png?raw=true",
  },
  {
    title: "Phishing Mail Detection",
    description:
      "LSTM-based phishing email detection system which uses the collection of datasets to equalise the \"HAM\" and \"Spam\" datasets. Which uses the pre-processing and feature engineering to classify the emails as phishing or legitimate.",
    tags: ["Python", "Deep Learning", "Spam Detection"],
    year: "2024",
    techStack: "Python, LSTM, scikit-learn, Pandas",
    learned:
      "How the spam detection works, feature engineering, scikit-learn pipelines",
    github: "https://github.com/MohmedhKA/PhishingMailDetection",
    showImage: false,
  },
  {
    title: "Productivity Launcher",
    description:
      "A lightweight Android productivity app built around quick actions, task nudges, and workflow automation for daily mobile use.",
    tags: ["Android", "Kotlin", "Background Tasks"],
    year: "2023",
    techStack: "Android, Kotlin, WorkManager, Jetpack Compose",
    learned:
      "Discovered hard limits on background process execution in modern OEM Android builds — WorkManager jobs were silently killed. Scrapped after testing across multiple devices.",
    github: "https://github.com/MohmedhKA/ProductivityApp",
    showImage: false,
    status: "discontinued",
  },
];
