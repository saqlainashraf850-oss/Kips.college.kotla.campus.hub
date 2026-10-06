import React, { useState, useRef } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glowColor?: string;
  onClick?: () => void;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  maxTilt = 8,
  glowColor = 'rgba(56, 189, 248, 0.25)',
  onClick
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [mouseCoord, setMouseCoord] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width;
    const yPct = (e.clientY - rect.top) / rect.height;

    const tiltX = (yPct - 0.5) * -maxTilt;
    const tiltY = (xPct - 0.5) * maxTilt;

    setTilt({ x: tiltX, y: tiltY });
    setMouseCoord({ x: xPct * 100, y: yPct * 100 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative preserve-3d transition-all duration-300 ease-out light-sweep ${className}`}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-8px) scale(1.02)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)',
        boxShadow: isHovered
          ? `0 25px 45px -15px ${glowColor}, 0 0 20px 0 ${glowColor}`
          : undefined
      }}
    >
      {/* Dynamic Cursor Light Glow Overlay */}
      {isHovered && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300 z-10"
          style={{
            background: `radial-gradient(circle 180px at ${mouseCoord.x}% ${mouseCoord.y}%, rgba(255, 255, 255, 0.2), transparent 70%)`
          }}
        />
      )}
      {children}
    </div>
  );
};
