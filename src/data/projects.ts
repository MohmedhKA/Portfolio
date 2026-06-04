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
    image: "https://github.com/MohmedhKA/E-Voting-V2/blob/main/docs/images/app-screenshot.png?raw=true",
  },
  {
    title: "AutoVulnScan",
    description:
      "Automates vulnerability scanning, penetration testing, and security assessment using AI-driven vulnerability detection. Integrates with multiple security tools and provides comprehensive reports.",
    tags: ["Python", "AI Security"],
    year: "2025",
    techStack : "Python, Flask, REST API, NVD, CWE, Socket.io",
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
    year: "2025",
    techStack: "Python, LSTM, scikit-learn, Pandas",
    learned:
      "How the spam detection works, feature engineering, scikit-learn pipelines",
    github: "https://github.com/MohmedhKA/PhishingMailDetection",
    showImage: false,
  },
  {
    title: "Secure Chat Application",
    description:
      "End-to-end encrypted messaging app with Signal Protocol-inspired key exchange, forward secrecy, and a minimal React frontend. Built as a cryptography deep-dive.",
    tags: ["React", "Node.js", "Cryptography"],
    year: "2023",
    techStack: "React, Node.js, WebSockets, Crypto",
    learned:
      "Signal Protocol key exchange, forward secrecy implementation, and the gap between cryptography theory and production code.",
    github: "https://github.com/MohmedhKA/secure-chat",
    showImage: false
  },
];
