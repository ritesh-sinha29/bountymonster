import React from "react";

/**
 * Reusable decorative background layer with SVG filters and sketch-style elements.
 * Extracted from the Leaderboard page for app-wide consistency.
 */
export function BackgroundDecoration() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* SVG filter defs – sketch / hand-drawn distortion */}
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <filter id="sketch" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.035 0.055" numOctaves="4" seed="7" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="sketch-sm" x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04 0.07" numOctaves="3" seed="12" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* Ambient glow – warm orange, top-center */}
      <div 
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-70" 
        style={{ background: "radial-gradient(ellipse at center, rgba(243,85,32,0.1) 0%, transparent 68%)" }} 
      />

      {/* Ambient glow – cool indigo, bottom-right */}
      <div 
        className="absolute bottom-0 right-0 w-[600px] h-[600px] opacity-60" 
        style={{ background: "radial-gradient(ellipse at bottom right, rgba(101,124,255,0.08) 0%, transparent 65%)" }} 
      />

      {/* Trophy cup – top-left (sketch) */}
      <svg className="absolute top-[5%] left-[3%] opacity-[0.08] -rotate-6" width="80" height="96" viewBox="0 0 56 72" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: "url(#sketch)" }}>
        <path d="M11.5 4.5h33v22c0 11.046-7.163 20-16 20S11.5 37.546 11.5 27V4.5z" stroke="white" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round"/>
        <path d="M12.5 4h32v21c0 10.8-7 19.5-16 19.5S12.5 36.4 12.5 25V4z" stroke="white" strokeWidth="0.7" strokeLinejoin="round" strokeLinecap="round" strokeOpacity="0.5"/>
        <path d="M11.5 14H3.5C3.5 27 9 35 12 36.5M44.5 14h8C52.5 27 47 35 44 36.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <path d="M27.5 46.5v10M19.5 56.5h17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <rect x="12.5" y="62" width="31" height="6" rx="3" stroke="white" strokeWidth="1.8"/>
      </svg>

      {/* Medal circle – top-right (sketch) */}
      <svg className="absolute top-[10%] right-[5%] opacity-[0.07]" width="68" height="68" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: "url(#sketch)" }}>
        <circle cx="32" cy="32" r="27.5" stroke="white" strokeWidth="2"/>
        <circle cx="32" cy="32" r="27" stroke="white" strokeWidth="0.6" strokeOpacity="0.4"/>
        <circle cx="32" cy="32" r="19.5" stroke="white" strokeWidth="1.2"/>
        <path d="M32 17.5v5M32 41.5v5M17.5 32h5M41.5 32h5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M25.5 32a6.5 6.5 0 1 1 13 0" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M32 39v-7" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>

      {/* Trophy cup – center-right, faint (sketch) */}
      <svg className="absolute top-[40%] right-[2%] opacity-[0.05] rotate-[14deg]" width="56" height="68" viewBox="0 0 56 72" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: "url(#sketch)" }}>
        <path d="M12 4h32v22c0 11.046-7.163 20-16 20S12 37.046 12 26V4z" stroke="white" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round"/>
        <path d="M12.5 4.5h31v21c0 10.6-7 19-15.5 19S13 36.8 13 25.5V4.5z" stroke="white" strokeWidth="0.6" strokeLinejoin="round" strokeOpacity="0.4"/>
        <path d="M12 14H4C4 27 9.5 34 12 36M44 14h8C52 27 46.5 34 44 36" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <path d="M28 46v10M20 56h16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <rect x="13" y="62" width="30" height="6" rx="3" stroke="white" strokeWidth="1.8"/>
      </svg>

      {/* Flame – bottom-left (sketch) */}
      <svg className="absolute bottom-[18%] left-[4%] opacity-[0.07]" width="50" height="64" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: "url(#sketch-sm)" }}>
        <path d="M16 2C16 2 23.5 11 23.5 20c0 3.866-3.134 7-7.5 7s-7.5-3.134-7.5-7c0-2 1-4 1-4S5.5 18.5 5.5 24c0 9.941 4.7 18 10.5 18s10.5-8.059 10.5-18C26.5 12 16 2 16 2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16.5 2.5C16.5 2.5 23 11 23 19.5" stroke="white" strokeWidth="0.7" strokeLinecap="round" strokeOpacity="0.4"/>
        <path d="M16 30.5c0 2.4-1.5 4.2-3.5 4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>

      {/* Bounty shield – bottom-right (sketch) */}
      <svg className="absolute bottom-[22%] right-[6%] opacity-[0.06]" width="56" height="66" viewBox="0 0 48 58" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: "url(#sketch)" }}>
        <path d="M24 4L6 12v16c0 12.15 7.8 22.4 18 26 10.2-3.6 18-13.85 18-26V12L24 4z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M24.5 4.5L6.5 12.5v15.5c0 12 7.6 22 17.5 25.8" stroke="white" strokeWidth="0.6" strokeLinecap="round" strokeOpacity="0.35"/>
        <path d="M15.5 28l6.5 6.5 11-13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>

      {/* Small trophy – bottom center-left, faint (sketch) */}
      <svg className="absolute bottom-[6%] left-[30%] opacity-[0.04]" width="40" height="48" viewBox="0 0 56 72" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: "url(#sketch-sm)" }}>
        <path d="M12 4h32v22c0 11.046-7.163 20-16 20S12 37.046 12 26V4z" stroke="white" strokeWidth="2.2" strokeLinejoin="round"/>
        <path d="M12 14H4C4 27 9.5 34 12 36M44 14h8C52 27 46.5 34 44 36" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <path d="M28 46v10M20 56h16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <rect x="13" y="62" width="30" height="6" rx="3" stroke="white" strokeWidth="1.8"/>
      </svg>

      {/* Star/spark – mid-left (sketch) */}
      <svg className="absolute top-[28%] left-[7%] opacity-[0.06]" width="36" height="36" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: "url(#sketch-sm)" }}>
        <path d="M16 2l2.9 8.9H28l-7.4 5.4 2.8 8.7L16 19.8l-7.4 5.2 2.8-8.7L4 11h9.1L16 2z" stroke="white" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
        <path d="M16 3l2.6 8.6H27.5l-7 5.2 2.6 8.3L16 20.2" stroke="white" strokeWidth="0.6" strokeLinejoin="round" strokeOpacity="0.35"/>
      </svg>

      {/* Subtle horizontal accent line */}
      <div className="absolute top-[52%] left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.035) 25%, rgba(255,255,255,0.035) 75%, transparent 100%)" }} />
    </div>
  );
}
