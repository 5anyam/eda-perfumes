'use client';

import { useEffect, useState } from 'react';

// Dark, rich Holi colors — minimal and bold
const HOLI_COLORS = [
  '#9B1B7A', // deep magenta
  '#C2185B', // dark pink
  '#6A1B9A', // deep purple
  '#4A148C', // dark violet
  '#1565C0', // bold blue
  '#0D47A1', // deep navy blue
  '#D81B60', // rich rose
  '#AD1457', // dark fuchsia
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
