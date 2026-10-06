import React, { useEffect, useRef } from 'react';

export const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle types: small dots and subtle math/academic glyphs
    const symbols = ['•', '+', '∫', 'π', '∑', '∆', '•', '•'];
    const particleCount = Math.min(Math.floor(width / 35), 45); // Responsive count

    interface Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      symbol: string;
      color: string;
    }

    const particles: Particle[] = [];
    const colors = ['rgba(56, 189, 248, ', 'rgba(14, 165, 233, ', 'rgba(99, 102, 241, '];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 12 + 8,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: -Math.random() * 0.4 - 0.1, // Gently drift upwards
        opacity: Math.random() * 0.35 + 0.1,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around
        if (p.y < -20) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;

        ctx.font = `${p.size}px 'Plus Jakarta Sans', monospace`;
        ctx.fillStyle = `${p.color}${p.opacity})`;
        ctx.fillText(p.symbol, p.x, p.y);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-60"
      style={{ mixBlendMode: 'multiply' }}
    />
  );
};
