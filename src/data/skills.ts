export interface Skill {
  label: string;
  angle: number;    // degrees (0 = right, 90 = down)
  distance: number; // 0–1 fraction of container half-size
  depth: number;    // parallax depth 0.3–1.2
}

export const skills: Skill[] = [
  { label: "Network Security",   angle: -25,  distance: 0.72, depth: 0.80 },
  { label: "Cryptography",       angle: 120,  distance: 0.64, depth: 0.90 },
  { label: "Linux",              angle: 150,  distance: 0.60, depth: 0.40 },
  { label: "Python",             angle: -160, distance: 0.70, depth: 1.00 },
  { label: "Wireshark",          angle: -130, distance: 0.68, depth: 0.70 },
  { label: "Burp Suite",         angle: -60, distance: 0.76, depth: 1.20 },
  { label: "Blockchain",         angle: 85,  distance: 0.65, depth: 1.00 },
  { label: "Assembly",           angle: 60,  distance: 0.67, depth: 0.82 },
  { label: "Metasploit",         angle: 30, distance: 0.67, depth: 0.82},
  { label: "Rest API",           angle: -90, distance: 0.67, depth: 0.82},

];
