export interface Project {
  title: string;
  description: string;
  tags: string[];
  year: string;
}

export const projects: Project[] = [
  {
    title: "Blockchain E-Voting System",
    description:
      "A Hyperledger Fabric-based e-voting system with Private Data Collections, batch processing, and end-to-end verifiability. Designed for high-throughput elections with cryptographic audit trails.",
    tags: ["Hyperledger Fabric", "Node.js", "Research"],
    year: "2025",
  },
  {
    title: "Network Intrusion Detection",
    description:
      "ML-driven IDS that classifies network traffic anomalies in real time. Trained on CICIDS2017 dataset with a custom feature pipeline and a REST API for SIEM integration.",
    tags: ["Python", "scikit-learn", "SIEM"],
    year: "2024",
  },
  {
    title: "CTF Toolkit",
    description:
      "Personal collection of automation scripts and writeups for Capture The Flag competitions — covering forensics, web exploitation, binary analysis, and OSINT.",
    tags: ["Python", "Bash", "CTF"],
    year: "2024",
  },
  {
    title: "Secure Chat Application",
    description:
      "End-to-end encrypted messaging app with Signal Protocol-inspired key exchange, forward secrecy, and a minimal React frontend. Built as a cryptography deep-dive.",
    tags: ["React", "Node.js", "Cryptography"],
    year: "2023",
  },
];
