import React, { useEffect, useRef, useCallback } from 'react';

interface FlamometerProps {
  streak: number;
  maxStreak: number; // Used for scaling, maybe defining levels
}

// --- Particle Class ---
class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  initialSize: number;
  life: number;
  initialLife: number;
  color: { r: number; g: number; b: number };

  constructor(x: number, y: number, canvasWidth: number) {
    this.x = x + (Math.random() - 0.5) * 20; // Start near center with spread
    this.y = y;
    // Upward velocity, higher near center, slower near edges
    const baseX = Math.abs(x - canvasWidth / 2) / (canvasWidth / 2); // 0 (center) to 1 (edge)
    this.vx = (Math.random() - 0.5) * (2 + baseX * 3); // More horizontal movement near edges
    this.vy = -(Math.random() * 2 + 2 + (1 - baseX) * 3); // Faster upward near center
    this.initialSize = Math.random() * 5 + 3; // Base size
    this.size = this.initialSize;
    this.initialLife = Math.random() * 60 + 40; // Frames to live
    this.life = this.initialLife;

    // Start hot (white/yellow), transition to red/orange
    const startColorRand = Math.random();
    if (startColorRand > 0.7) {
      this.color = { r: 255, g: 255, b: 200 }; // White-ish Yellow
    } else if (startColorRand > 0.3) {
      this.color = { r: 255, g: 200, b: 50 }; // Yellow-Orange
    } else {
      this.color = { r: 255, g: 130, b: 0 }; // Orange
    }
  }

  update(canvasHeight: number) {
    this.x += this.vx;
    this.y += this.vy;
    this.vy *= 0.99; // Slow down vertical speed slightly
    this.life--;

    // Shrink particle as it dies
    this.size = this.initialSize * (this.life / this.initialLife);

    // Fade color towards red/dark as it dies
    const lifeRatio = this.life / this.initialLife;
    if (lifeRatio < 0.5) {
        this.color.g = Math.max(0, this.color.g * 0.98);
        this.color.b = Math.max(0, this.color.b * 0.95);
    }

    // Add slight drift/turbulence
    this.vx += (Math.random() - 0.5) * 0.2;
    this.vy += (Math.random() - 0.5) * 0.1;

    // Bounce off invisible ceiling slightly below top? Or just die
    // if (this.y < canvasHeight * 0.1) {
    //   this.vy *= -0.5;
    // }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.life <= 0 || this.size <= 0.1) return;

    const alpha = Math.min(1, this.life / (this.initialLife * 0.5)) * 0.8; // Fade out
    ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha})`;

    // Simple circle particle - could use blurred images or more complex shapes
    ctx.beginPath();
    ctx.arc(this.x, this.y, Math.max(0, this.size / 2), 0, Math.PI * 2);
    ctx.fill();
  }
}


// --- Flamometer Component ---
function RealisticFlamometer({ streak, maxStreak }: FlamometerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const particles = useRef<Particle[]>([]);
  const lastStreak = useRef<number>(streak);

  // Ensure maxStreak is at least 1 to avoid division by zero
  const safeMaxStreak = Math.max(1, maxStreak);

  const flameHeightRatio = Math.min(Math.max(streak / safeMaxStreak, 0), 1);
  // Intensity affects particle count, color brightness, glow
  const intensity = Math.min(Math.max(streak / (safeMaxStreak * 0.5), 0), 1); // Intensity peaks faster

  const draw = useCallback((ctx: CanvasRenderingContext2D, frameCount: number) => {
    const canvas = ctx.canvas;
    const { width, height } = canvas;

    // 0. Clear canvas with transparency
    ctx.clearRect(0, 0, width, height);

    // --- 1. Draw Base Flame Shape (using gradients and paths) ---
    const baseHeight = height * flameHeightRatio * 0.95; // Max height slightly less than full
    const flameTopY = height - baseHeight;
    const flameWidth = width * 0.6; // Adjust width as needed

    if (baseHeight > 0) {
      // Create a dynamic gradient based on height/intensity
      const gradient = ctx.createLinearGradient(width / 2, height, width / 2, flameTopY);
      const coreBrightness = Math.min(1, intensity * 1.5); // Brighter core
      gradient.addColorStop(0, `rgba(255, 100, 0, ${intensity * 0.8})`); // Orange base
      gradient.addColorStop(0.3, `rgba(255, 180, 0, ${intensity * 0.9})`); // Yellow-Orange middle
      gradient.addColorStop(0.7, `rgba(255, 230, 150, ${coreBrightness})`); // Brighter Yellow top
      gradient.addColorStop(1, `rgba(255, 255, 240, ${coreBrightness * 0.8})`); // White-ish peak

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(width / 2 - flameWidth / 2, height); // Bottom left

      // Wobbly sides using quadratic curves - vary control points with time/noise
      const wobbleFactor = Math.sin(frameCount * 0.05) * (flameWidth * 0.05) * intensity;
      const wobbleFactor2 = Math.cos(frameCount * 0.07) * (flameWidth * 0.04) * intensity;

      // Left side curve
      ctx.quadraticCurveTo(
        width / 2 - flameWidth * 0.3 + wobbleFactor, height * 0.6 + flameTopY * 0.4, // Control point
        width / 2 + wobbleFactor2, flameTopY // Peak (slightly off center)
      );

      // Right side curve
      ctx.quadraticCurveTo(
        width / 2 + flameWidth * 0.3 - wobbleFactor, height * 0.6 + flameTopY * 0.4, // Control point
        width / 2 + flameWidth / 2, height // Bottom right
      );

      ctx.closePath();

      // Add glow to the base flame shape
      ctx.shadowColor = `rgba(255, 100, 0, ${intensity * 0.7})`;
      ctx.shadowBlur = 30 * intensity; // More intense glow with higher streak
      ctx.fill();
      ctx.shadowColor = 'transparent'; // Reset shadow for particles
      ctx.shadowBlur = 0;
    }

    // --- 2. Update and Draw Particles ---
    // Use 'lighter' blend mode for additive color mixing (looks fiery)
    ctx.globalCompositeOperation = 'lighter';

    particles.current.forEach((p, index) => {
      p.update(height);
      p.draw(ctx);
      if (p.life <= 0 || p.size <= 0.1) {
        particles.current.splice(index, 1); // Remove dead particles
      }
    });

    // Reset blend mode
    ctx.globalCompositeOperation = 'source-over';

    // --- 3. Emit New Particles ---
    const maxParticles = 150; // Max number of particles
    // Emit more particles when intensity is high or streak just increased
    const emitRate = (intensity * 1.5) + (streak > lastStreak.current ? 5 : 0);
    if (particles.current.length < maxParticles) {
        for (let i = 0; i < emitRate; i++) {
             // Emit mostly from the base, but some higher up for bursts
            const emitY = height - Math.random() * (baseHeight * 0.3);
            // Concentrate emission towards the center
            const emitX = width / 2 + (Math.random() - 0.5) * (flameWidth * 0.6);
            if (baseHeight > 5) { // Only emit if flame exists
                 particles.current.push(new Particle(emitX, emitY, width));
            }
        }
    }
    lastStreak.current = streak; // Update last streak


  }, [flameHeightRatio, intensity, streak]); // Dependencies for the draw function


  // --- Animation Loop ---
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameCount = 0;

    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            const { width, height } = entry.contentRect;
            // Adjust canvas resolution for clarity
            const dpr = window.devicePixelRatio || 1;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.scale(dpr, dpr); // Scale drawing context
        }
         // Optional: Redraw immediately after resize
         // draw(ctx, frameCount);
    });
    resizeObserver.observe(container);


    const renderLoop = () => {
      frameCount++;
      draw(ctx, frameCount);
      animationFrameId.current = requestAnimationFrame(renderLoop);
    };

    renderLoop(); // Start animation

    // --- Cleanup ---
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      resizeObserver.disconnect();
      particles.current = []; // Clear particles on unmount
    };
  }, [draw]); // Re-run setup if draw function identity changes (due to dependencies)


  // --- Render JSX ---
  return (
    <div ref={containerRef} className="relative h-96 w-full max-w-[200px] mx-auto">
       {/* Canvas sits behind the glass UI */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Optional: Add back a subtle CSS glow BEHIND the canvas if needed */}
      <div
        className="absolute inset-0 blur-2xl rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% ${100 - flameHeightRatio * 100}%,
            rgba(255,100,0,${intensity * 0.4}) 0%,
            rgba(255,100,0,0) 70%)`,
           transition: 'all 0.5s ease-out' // Smooth transition for glow
        }}
      />

      {/* Glass Container - On top of Canvas */}
      <div className="absolute inset-0 backdrop-blur-sm rounded-3xl border-2 border-white/20 overflow-hidden pointer-events-none">
        {/* Content inside the glass container (like text) should have higher z-index if needed, but pointer-events-none helps */}
      </div>


      {/* Streak Counter - On top */}
      <div
        className="absolute bottom-4 left-0 right-0 text-center z-10 pointer-events-none" // Ensure it's above canvas
        style={{ textShadow: '0 0 10px rgba(255,255,255,0.7)' }}
      >
        <span className="text-3xl font-bold text-white glow">
          {streak}
        </span>
        <span className="text-sm text-white/80 block">
          days
        </span>
      </div>

       {/* Level Markers - On top */}
      {/* Calculate marker positions based on canvas height / maxStreak */}
      <div className="absolute inset-y-4 -right-10 w-auto flex flex-col justify-between z-10 pointer-events-none">
        {[...Array(5)].map((_, i) => {
          const levelStreak = Math.round(safeMaxStreak * (1 - (i * 0.2))); // Levels from top to bottom
          const levelActive = streak >= levelStreak;
           const markerYPercent = (i * 20); // Position from top
          return (
             <div key={i} className="flex items-center gap-2" style={{ position: 'absolute', top: `${markerYPercent}%`, right: 0, transform: 'translateY(-50%)' }}>
              <div
                className="h-0.5 w-3 transition-all duration-300"
                style={{
                  background: levelActive
                    ? 'linear-gradient(90deg, rgba(255,255,255,0.2), rgba(255,255,255,0.8))'
                    : 'rgba(255,255,255,0.2)',
                  boxShadow: levelActive
                    ? '0 0 10px rgba(255,255,255,0.5)' : 'none'
                }}
              />
              <span className={`text-xs transition-colors duration-300 ${levelActive ? 'text-white/60' : 'text-white/30'}`}>
                {levelStreak}d
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RealisticFlamometer;