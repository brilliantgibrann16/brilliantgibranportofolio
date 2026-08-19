/**
 * /data/projects.js — Master Project & Constellation Data
 * Decoupled data layer serving both the 3D Procedural Constellation and the Spatial Project Explorer UI.
 * Every claim, link, and artifact is strictly grounded in real coursework and verified accomplishments.
 */

export const PROJECTS_DATA = {
  suaraku: {
    id: 'suaraku',
    title: 'Suaraku: Civic Platform & Interactive Design System',
    category: 'uiux',
    categoryLabel: 'UI/UX · Civic Tech',
    status: 'Completed',
    statusColor: '#28C840',
    color: '#A259FF',
    folderColor: '#B26BFF',
    accentHex: 0xA259FF,
    year: '2025',
    desc: 'Comprehensive UI/UX design system and civic engagement prototype designed in Figma. Features accessible voting workflows, transparent petition tracking, and rigorous component tokenization for high-contrast accessibility.',
    tags: ['Figma', 'UI/UX', 'Design Systems', 'Civic Tech', 'WCAG 2.2', 'Prototyping'],
    role: 'Lead UX Designer · Cakrawala University Capstone',
    artifacts: [
      'Interactive Figma component library & token spec',
      'User journey maps & heuristic evaluation scorecard',
      'High-fidelity interactive prototype (mobile & desktop)'
    ],
    // 3D Procedural Artifact Spec
    geometry: {
      type: 'octahedron',
      detail: 2,
      scale: 1.3,
      rotationSpeed: [0.3, 0.5, 0.2],
      position: [-6.5, 2.5, -4.0]
    }
  },
  kastanews: {
    id: 'kastanews',
    title: 'KastaNews: High-Throughput Database Architecture',
    category: 'backend',
    categoryLabel: 'Backend · Database',
    status: 'Completed',
    statusColor: '#28C840',
    color: '#1ABCFE',
    folderColor: '#2ECCFF',
    accentHex: 0x1ABCFE,
    year: '2025',
    desc: 'Engineered a resilient relational database schema for a high-concurrency news aggregation engine using PostgreSQL. Implemented 3NF normalization, optimized B-Tree/Hash indexes, and designed ACID-compliant transaction pipelines.',
    tags: ['PostgreSQL', 'Database Architecture', '3NF Normalization', 'SQL Tuning', 'ACID Transactions', 'ERD'],
    role: 'Database Architect · Advanced Databases Coursework',
    artifacts: [
      'Complete SQL DDL schema & versioned migration scripts',
      'EXPLAIN ANALYZE query performance benchmarking report',
      'Entity-Relationship Diagram (ERD) & normalization proof'
    ],
    geometry: {
      type: 'torusKnot',
      detail: [64, 16, 2, 3],
      scale: 1.0,
      rotationSpeed: [-0.4, 0.3, 0.1],
      position: [-2.2, 4.2, -6.5]
    }
  },
  pentest: {
    id: 'pentest',
    title: 'Penetration Testing & Vulnerability Assessment Report',
    category: 'security',
    categoryLabel: 'Security · Pen Testing',
    status: 'Completed',
    statusColor: '#28C840',
    color: '#F24E1E',
    folderColor: '#FF6030',
    accentHex: 0xF24E1E,
    year: '2026',
    desc: 'Executed systematic vulnerability assessments inside sandboxed lab targets using Kali Linux, Nmap, Wireshark, and Burp Suite. Identified SQL injection, XSS, and broken authentication vectors, producing OWASP Top 10 remediation blueprints.',
    tags: ['Kali Linux', 'Burp Suite', 'Nmap', 'Wireshark', 'OWASP Top 10', 'Vulnerability Assessment'],
    role: 'Security Analyst · Network Security Lab',
    artifacts: [
      'Exec-ready vulnerability severity matrix & CVSS scoring',
      'Packet capture (PCAP) forensic analysis logs',
      'Step-by-step remediation & hardening runbook'
    ],
    geometry: {
      type: 'spikyIcosahedron',
      detail: 1,
      scale: 1.25,
      rotationSpeed: [0.5, -0.4, 0.4],
      position: [2.5, 3.8, -5.0]
    }
  },
  distributed: {
    id: 'distributed',
    title: 'Distributed Systems & Cloud Computing Infrastructure',
    category: 'backend',
    categoryLabel: 'Backend · Cloud',
    status: 'Completed',
    statusColor: '#28C840',
    color: '#0ACF83',
    folderColor: '#1ADF93',
    accentHex: 0x0ACF83,
    year: '2025',
    desc: 'Architected and simulated containerized microservices deployments using Docker and Hadoop ecosystem concepts. Focused on fault-tolerant replication, horizontal load balancing, and inter-service communication over gRPC/REST.',
    tags: ['Docker', 'Distributed Systems', 'Hadoop Concepts', 'Microservices', 'Load Balancing', 'Linux'],
    role: 'Cloud Engineer · Distributed Systems Coursework',
    artifacts: [
      'Multi-stage Dockerfiles & docker-compose orchestration specs',
      'System fault-tolerance & partition recovery simulation logs',
      'Architecture C4 container diagrams'
    ],
    geometry: {
      type: 'latticeBox',
      detail: [2, 2, 2],
      scale: 1.2,
      rotationSpeed: [0.2, 0.6, -0.3],
      position: [6.8, 1.8, -4.5]
    }
  },
  oop: {
    id: 'oop',
    title: 'OOP Ticketing System & Event Automation Platform',
    category: 'backend',
    categoryLabel: 'Backend · Python',
    status: 'Completed',
    statusColor: '#28C840',
    color: '#7EA4BE',
    folderColor: '#8EB4CE',
    accentHex: 0x7EA4BE,
    year: '2024',
    desc: 'Developed a robust object-oriented event ticketing and seat reservation backend in Python. Leveraged encapsulation, inheritance, polymorphism, and strict design patterns to handle concurrent booking and payment simulation.',
    tags: ['Python', 'Object-Oriented Programming', 'Design Patterns', 'Concurrency', 'Unit Testing', 'UML'],
    role: 'Backend Developer · OOP & Software Engineering Lab',
    artifacts: [
      'Clean Python source hierarchy with full UML class diagrams',
      'Pytest unit test suite with 100% core logic coverage',
      'Concurrency simulation & booking transaction flow logs'
    ],
    geometry: {
      type: 'crystalCylinder',
      detail: [6, 1],
      scale: 1.3,
      rotationSpeed: [-0.3, -0.5, 0.2],
      position: [6.0, -2.5, -5.5]
    }
  },
  algo: {
    id: 'algo',
    title: 'Algorithmic Data Structures: Playlist & Print Queue',
    category: 'backend',
    categoryLabel: 'Data Structures · Algorithms',
    status: 'Completed',
    statusColor: '#28C840',
    color: '#CEAB7E',
    folderColor: '#DEBB8E',
    accentHex: 0xCEAB7E,
    year: '2024',
    desc: 'Implemented high-performance custom data structures from scratch in Python, including a Singly Linked List for music playlist management and LIFO Stack / FIFO Queue engines for operating system task scheduling, with formal Big-O proofs.',
    tags: ['Python', 'Linked List', 'Stack (LIFO)', 'Queue (FIFO)', 'Algorithms', 'Big-O Analysis'],
    role: 'Solo Build · Data Structures & Algorithms Lab',
    artifacts: [
      'Raw Python data structure implementations without external libs',
      'Big-O time/space complexity mathematical proofs & benchmarks',
      'Automated stress-testing & memory profiling scripts'
    ],
    geometry: {
      type: 'nestedRings',
      detail: [24, 4],
      scale: 1.2,
      rotationSpeed: [0.6, 0.2, 0.5],
      position: [1.5, -4.0, -6.0]
    }
  },
  mikrotik: {
    id: 'mikrotik',
    title: 'Mikrotik Network Routing & Tunneling Infrastructure',
    category: 'security',
    categoryLabel: 'Networking · Infrastructure',
    status: 'Completed',
    statusColor: '#28C840',
    color: '#7DB49B',
    folderColor: '#8DC4AB',
    accentHex: 0x7DB49B,
    year: '2025',
    desc: 'Configured end-to-end network routing, WAN topologies, PPTP VPN tunneling, static/dynamic routing tables, DHCP server provisioning, and secure Hotspot login portals using Mikrotik RouterOS within GNS3 lab simulations.',
    tags: ['Mikrotik RouterOS', 'GNS3', 'PPTP Tunneling', 'Static Routing', 'DHCP Server', 'Network Security'],
    role: 'Network Engineer · Computer Networks Coursework',
    artifacts: [
      'GNS3 network simulation topology manifests',
      'Exported RouterOS configuration scripts (.rsc)',
      'Subnetting table & Hotspot authentication security runbook'
    ],
    geometry: {
      type: 'torusPrism',
      detail: [32, 5],
      scale: 1.25,
      rotationSpeed: [-0.5, 0.4, -0.3],
      position: [-5.0, -3.2, -4.8]
    }
  }
};

export const PROJECT_KEYS = Object.keys(PROJECTS_DATA);
