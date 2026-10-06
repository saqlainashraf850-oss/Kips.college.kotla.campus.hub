import React, { useState } from 'react';
import { GraduationCap, Award, Sparkles, BookOpen, Star, ShieldCheck } from 'lucide-react';

interface Hero3DLogoProps {
  customLogoUrl?: string;
  campusName?: string;
}

export const Hero3DLogo: React.FC<Hero3DLogoProps> = ({ customLogoUrl, campusName = "KIPS College Kotla" }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20; // -10 to +10 deg
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <div
      className="relative flex items-center justify-center p-6 perspective-1000 select-none"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Outer ambient glow and particle rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-sky-500/20 via-cyan-400/20 to-blue-600/10 blur-3xl animate-pulse"></div>
        {/* Pulsing Orbit Rings */}
        <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full border border-sky-400/30 animate-[spin_30s_linear_infinite] pointer-events-none border-dashed"></div>
        <div className="w-72 h-72 sm:w-96 sm:h-96 rounded-full border border-cyan-300/20 animate-[spin_45s_linear_infinite_reverse] pointer-events-none"></div>
      </div>

      {/* Floating Micro-Badges / Orbiting Academic Icons */}
      <div className="absolute -top-3 -right-2 sm:right-4 z-20 animate-floating bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-sky-400/40 shadow-xl flex items-center space-x-1.5 text-sky-300 text-xs font-bold">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>Top Board Merits</span>
      </div>

      <div className="absolute -bottom-2 -left-2 sm:left-4 z-20 animate-floating [animation-delay:2s] bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-cyan-400/40 shadow-xl flex items-center space-x-1.5 text-cyan-300 text-xs font-bold">
        <Award className="w-3.5 h-3.5 text-cyan-400" />
        <span>Sections CB1 & CB2</span>
      </div>

      {/* 3D ROTATING 360-DEGREE CONTAINER */}
      <div
        className="relative w-56 h-56 sm:w-72 sm:h-72 transition-transform duration-500 ease-out preserve-3d"
        style={{
          transform: isHovered
            ? `perspective(1200px) rotateX(${mousePos.y}deg) rotateY(${mousePos.x}deg) scale(1.05)`
            : undefined
        }}
      >
        <div className={`w-full h-full preserve-3d ${!isHovered ? 'animate-3d-rotate' : ''}`}>
          
          {/* FRONT FACE: Cinematic Emblem */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-sky-900 via-slate-900 to-sky-950 p-1 border-2 border-sky-300/60 shadow-[0_25px_60px_-15px_rgba(2,132,199,0.5)] preserve-3d flex flex-col items-center justify-center text-center overflow-hidden light-sweep">
            
            {/* Background Radial Light Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(56,189,248,0.35),transparent_70%)]"></div>

            {/* Custom Logo or Stylized Emblem */}
            <div className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-sky-500 via-sky-600 to-cyan-500 flex items-center justify-center text-white shadow-2xl border-2 border-white/40 mb-3 overflow-hidden group">
              {customLogoUrl ? (
                <img src={customLogoUrl} alt="KIPS Logo" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <GraduationCap className="w-12 h-12 text-white drop-shadow-md" />
                  <span className="text-[10px] font-black tracking-widest uppercase text-sky-100 mt-0.5">KIPS</span>
                </div>
              )}

              {/* Reflection Sweep */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </div>

            {/* Title & Badge */}
            <div className="relative z-10 space-y-1">
              <h3 className="text-sm sm:text-base font-black text-white tracking-wide uppercase drop-shadow">
                {campusName}
              </h3>
              <p className="text-[10px] sm:text-[11px] font-extrabold text-cyan-300 tracking-widest uppercase">
                Bhimber Road • Kotla
              </p>
            </div>

            {/* Bottom 5 Stars */}
            <div className="relative z-10 flex items-center space-x-1 mt-2.5 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-amber-400" />
              ))}
            </div>

            {/* Inner border sheen */}
            <div className="absolute inset-2 rounded-2xl border border-sky-400/20 pointer-events-none"></div>
          </div>

          {/* BACK FACE: Motto & Credentials in 3D Space */}
          <div
            className="absolute inset-0 rounded-3xl bg-gradient-to-bl from-slate-950 via-sky-950 to-slate-900 p-6 border-2 border-cyan-400/60 shadow-[0_25px_60px_-15px_rgba(2,132,199,0.5)] preserve-3d flex flex-col items-center justify-center text-center text-white"
            style={{ transform: 'rotateY(180deg) translateZ(1px)' }}
          >
            <ShieldCheck className="w-12 h-12 text-cyan-400 mb-2 drop-shadow" />
            <span className="text-xs font-black tracking-widest text-sky-300 uppercase">
              Academic Excellence
            </span>
            <p className="text-[11px] text-slate-300 leading-relaxed mt-2 font-medium">
              Mathematics Specialists, Science Laboratories & Continuous Card-Based Tracking.
            </p>
            <div className="mt-3 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-bold border border-sky-400/30">
              Session 2026–2027
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
