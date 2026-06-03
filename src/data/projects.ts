export interface Project {
  title: string;
  description: string;
  tags: string[];
  year: string;
  learned?: string;
  role?: string;
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
    role: "Lead Developer & Researcher",
    learned:
      "Hyperledger Fabric internals, Private Data Collections, Byzantine fault tolerance, and cryptographic audit design.",
    github: "https://github.com/MohmedhKA/blockchain-evoting",
    showImage: true,
    image: "https://raw.githubusercontent.com/MohmedhKA/blockchain-evoting/main/preview.png",
  },
  {
    title: "Network Intrusion Detection",
    description:
      "ML-driven IDS that classifies network traffic anomalies in real time. Trained on CICIDS2017 dataset with a custom feature pipeline and a REST API for SIEM integration.",
    tags: ["Python", "scikit-learn", "SIEM"],
    year: "2024",
    role: "ML Engineer",
    learned:
      "Feature engineering on CICIDS2017, scikit-learn pipelines, and real-time anomaly classification with REST integration.",
    github: "https://github.com/MohmedhKA/network-ids",
    showImage: true,
    image: "https://raw.githubusercontent.com/MohmedhKA/network-ids/main/preview.png",
  },
  {
    title: "CTF Toolkit",
    description:
      "Personal collection of automation scripts and writeups for Capture The Flag competitions — covering forensics, web exploitation, binary analysis, and OSINT.",
    tags: ["Python", "Bash", "CTF"],
    year: "2024",
    role: "Security Researcher",
    learned:
      "Binary exploitation, forensics automation, OSINT methodology, and rapid scripting under competition pressure.",
    github: "https://github.com/MohmedhKA/ctf-toolkit",
    showImage: false,
  },
  {
    title: "Secure Chat Application",
    description:
      "End-to-end encrypted messaging app with Signal Protocol-inspired key exchange, forward secrecy, and a minimal React frontend. Built as a cryptography deep-dive.",
    tags: ["React", "Node.js", "Cryptography"],
    year: "2023",
    role: "Full-Stack Developer",
    learned:
      "Signal Protocol key exchange, forward secrecy implementation, and the gap between cryptography theory and production code.",
    github: "https://github.com/MohmedhKA/secure-chat",
    showImage: false,
  },
];
