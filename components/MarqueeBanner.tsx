'use client';

import { Clock, Gem, ShieldCheck, Sparkles, Heart, Wind, Palette } from 'lucide-react';

const MarqueeBanner = () => {
  const bannerItems = [
    { text: "Long Lasting", icon: Clock },
    { text: "Premium Quality", icon: Gem },
    { text: "Skin Safe", icon: ShieldCheck },
    { text: "Luxury Blend", icon: Sparkles },
    { text: "Cruelty Free", icon: Heart },
    { text: "Intense Sillage", icon: Wind },
    { text: "Artisan Crafted", icon: Palette }
  ];

  const ItemSet = ({ keyPrefix }: { keyPrefix: string }) => (
    <>
      {bannerItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <span
            key={`${keyPrefix}-${index}`}
            className="inline-flex items-center gap-2 sm:gap-3 mx-3 sm:mx-6"
          >
            <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300/90" strokeWidth={1.5} />
            <span className="font-light text-[11px] sm:text-xs uppercase tracking-[0.2em] text-amber-100/90">
              {item.text}
            </span>
            <span className="text-amber-400/40 text-[8px] ml-2 sm:ml-4">◆</span>
          </span>
        );
      })}
    </>
  );

  return (
    <div className="relative overflow-hidden border-t border-b border-amber-400/20">
      {/* Dark frosted background */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950" />
      <div className="absolute inset-0 backdrop-blur-md bg-black/40" />

      {/* Animated gold shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200/[0.07] to-transparent animate-shimmer" />

      {/* Content */}
      <div className="relative z-10 py-3 sm:py-3.5 whitespace-nowrap">
        <div className="animate-marquee inline-block min-w-full">
          <ItemSet keyPrefix="first" />
          <ItemSet keyPrefix="second" />
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-shimmer {
          animation: shimmer 4s ease-in-out infinite;
        }
        @media (max-width: 640px) {
          .animate-marquee {
            animation: marquee 40s linear infinite;
          }
        }
        @media (min-width: 641px) {
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        }
      `}</style>
    </div>
  );
};

export default MarqueeBanner;
