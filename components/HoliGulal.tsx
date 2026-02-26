'use client';

import { useEffect, useState } from 'react';

// Realistic gulaal (Holi powder) colors — soft, matte, powdery shades
const HOLI_COLORS = [
  '#D94F6B', // gulaal pink (kumkum)
  '#E87590', // soft rose pink
  '#C2185B', // deep magenta (abeer)
  '#E8A631', // turmeric yellow (haldi)
  '#F0C04A', // marigold yellow
  '#D45B2A', // vermillion orange (sindoor)
  '#E07840', // saffron orange (kesari)
  '#5B8C3E', // muted leaf green
  '#7CAA55', // soft herbal green
  '#4A7FB5', // indigo blue (neel)
  '#7B6BAA', // soft purple (jamuni)
  '#B84C65', // dusty rose red
];

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
  moveX: number;
  moveY: number;
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 100 + Math.random() * 220,
    color: HOLI_COLORS[Math.floor(Math.random() * HOLI_COLORS.length)],
    delay: Math.random() * 1.5,
    duration: 2.5 + Math.random() * 2,
    moveX: -120 + Math.random() * 240,
    moveY: -120 + Math.random() * 240,
  }));
}

export default function HoliGulal() {
  const [visible, setVisible] = useState(true);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    setParticles(generateParticles(isMobile ? 18 : 32));

    const timer = setTimeout(() => setVisible(false), 5500);
    return () => clearTimeout(timer);
  }, []);

  if (!visible || particles.length === 0) return null;

  return (
    <div className="holi-overlay" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="holi-cloud"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            ['--holi-mx' as string]: `${p.moveX}px`,
            ['--holi-my' as string]: `${p.moveY}px`,
          }}
        />
      ))}
    </div>
  );
}
