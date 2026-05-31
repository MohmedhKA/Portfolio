export interface Skill {
  label: string;
  angle: number;    // degrees (0 = right, 90 = down)
  distance: number; // 0–1 fraction of container half-size
  depth: number;    // parallax depth 0.3–1.2
}

export const skills: Skill[] = [
  { label: "Network Security",   angle: -35,  distance: 0.72, depth: 0.80 },
  { label: "Penetration Testing",angle:  20,  distance: 0.78, depth: 1.10 },
  { label: "OSINT",              angle:  65,  distance: 0.62, depth: 0.50 },
  { label: "Cryptography",       angle: 105,  distance: 0.74, depth: 0.90 },
  { label: "Linux",              angle: 150,  distance: 0.60, depth: 0.40 },
  { label: "Python",             angle: -160, distance: 0.70, depth: 1.00 },
  { label: "Wireshark",          angle: -110, distance: 0.68, depth: 0.70 },
  { label: "Burp Suite",         angle:  -70, distance: 0.76, depth: 1.20 },
  { label: "SIEM / SOC",         angle: 180,  distance: 0.80, depth: 0.60 },
  { label: "Web App Security",   angle:  45,  distance: 0.82, depth: 0.95 },
  { label: "Incident Response",  angle: -140, distance: 0.71, depth: 0.80 },
  { label: "CTF",                angle: 130,  distance: 0.56, depth: 0.35 },
];
