import { useEffect, useRef } from "react";
import { useTheme } from "@/contexts/ThemeContext";

interface LiveBackgroundProps {
  variant?: "default" | "login" | "compose";
}

const LiveBackground = ({ variant = "default" }: LiveBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const colors = theme.bubbleColors;

    // Bubbles
    const bubbles: Array<{
      x: number; y: number; r: number; speed: number;
      wobble: number; wobbleSpeed: number; opacity: number;
      color: string; pulse: number; pulseSpeed: number;
    }> = [];
    for (let i = 0; i < 55; i++) {
      bubbles.push({
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + Math.random() * window.innerHeight,
        r: Math.random() * 40 + 6,
        speed: Math.random() * 0.7 + 0.2,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.02 + 0.005,
        opacity: Math.random() * 0.5 + 0.15,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulse: 0,
        pulseSpeed: Math.random() * 0.04 + 0.01,
      });
    }

    // Sparkles
    const sparkles: Array<{
      x: number; y: number; size: number; opacity: number;
      opacityDir: number; color: string; twinkleSpeed: number;
    }> = [];
    for (let i = 0; i < 90; i++) {
      sparkles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 3 + 1,
        opacity: Math.random(),
        opacityDir: Math.random() > 0.5 ? 1 : -1,
        color: colors[Math.floor(Math.random() * colors.length)],
        twinkleSpeed: Math.random() * 0.03 + 0.005,
      });
    }

    // Rain drops
    const rainDrops: Array<{
      x: number; y: number; length: number; speed: number; opacity: number; color: string;
    }> = [];
    for (let i = 0; i < 30; i++) {
      rainDrops.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        length: Math.random() * 15 + 5,
        speed: Math.random() * 2 + 1,
        opacity: Math.random() * 0.25 + 0.05,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // Waves
    const waveConfig = [
      { amp: 28, freq: 0.008, speed: 0.012, y: 0.2, opacity: 0.18, color: colors[0] },
      { amp: 22, freq: 0.010, speed: 0.009, y: 0.45, opacity: 0.14, color: colors[1 % colors.length] },
      { amp: 18, freq: 0.013, speed: 0.015, y: 0.70, opacity: 0.12, color: colors[2 % colors.length] },
      { amp: 14, freq: 0.007, speed: 0.007, y: 0.88, opacity: 0.10, color: colors[3 % colors.length] },
    ];

    // Clouds
    const cloudPositions: Array<{ x: number; y: number; w: number; h: number; speed: number; opacity: number; color: string }> = [];
    for (let i = 0; i < 6; i++) {
      cloudPositions.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight * 0.5,
        w: Math.random() * 160 + 60,
        h: Math.random() * 60 + 30,
        speed: Math.random() * 0.2 + 0.05,
        opacity: Math.random() * 0.2 + 0.05,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const drawCloud = (x: number, y: number, w: number, h: number, color: string, opacity: number) => {
      const grad = ctx.createRadialGradient(x, y, 0, x, y, w * 0.6);
      grad.addColorStop(0, color + Math.round(opacity * 255).toString(16).padStart(2, '0'));
      grad.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.ellipse(x, y, w * 0.6, h * 0.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(x - w * 0.2, y + h * 0.1, w * 0.35, h * 0.35, 0, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(x + w * 0.2, y + h * 0.05, w * 0.3, h * 0.3, 0, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    };

    const drawSparkle = (x: number, y: number, size: number, color: string, opacity: number) => {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        const inner = size * 0.3;
        ctx.moveTo(x + Math.cos(angle) * size, y + Math.sin(angle) * size);
        ctx.lineTo(x + Math.cos(angle + Math.PI / 4) * inner, y + Math.sin(angle + Math.PI / 4) * inner);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.008;

      // Gradient blobs (animated)
      const blobs = [
        { x: canvas.width * 0.15 + Math.sin(time * 0.5) * 100, y: canvas.height * 0.25 + Math.cos(time * 0.3) * 60, r: 380 },
        { x: canvas.width * 0.85 + Math.sin(time * 0.4 + 1) * 90, y: canvas.height * 0.15 + Math.cos(time * 0.6) * 50, r: 340 },
        { x: canvas.width * 0.5 + Math.sin(time * 0.3 + 2) * 120, y: canvas.height * 0.6 + Math.cos(time * 0.5) * 80, r: 360 },
        { x: canvas.width * 0.1 + Math.sin(time * 0.25) * 70, y: canvas.height * 0.8 + Math.cos(time * 0.35 + 3) * 50, r: 280 },
      ];

      blobs.forEach((blob, i) => {
        const color = colors[i % colors.length];
        const grad = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.r);
        grad.addColorStop(0, color + '30');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Waves
      waveConfig.forEach(wave => {
        const baseY = canvas.height * wave.y;
        ctx.beginPath();
        ctx.moveTo(0, baseY);
        for (let x = 0; x <= canvas.width; x += 3) {
          const y = baseY + Math.sin(x * wave.freq + time * wave.speed * 80) * wave.amp
            + Math.sin(x * wave.freq * 1.5 + time * wave.speed * 60) * (wave.amp * 0.5);
          ctx.lineTo(x, y);
        }
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fillStyle = wave.color + Math.round(wave.opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();
      });

      // Clouds
      cloudPositions.forEach(cloud => {
        cloud.x += cloud.speed;
        if (cloud.x > canvas.width + cloud.w) cloud.x = -cloud.w;
        drawCloud(cloud.x, cloud.y, cloud.w, cloud.h, cloud.color, cloud.opacity);
      });

      // Rain
      rainDrops.forEach(drop => {
        drop.y += drop.speed;
        if (drop.y > canvas.height) {
          drop.y = -drop.length;
          drop.x = Math.random() * canvas.width;
        }
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x + 1, drop.y + drop.length);
        ctx.strokeStyle = drop.color + Math.round(drop.opacity * 255).toString(16).padStart(2, '0');
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Bubbles (floating up)
      bubbles.forEach(bubble => {
        bubble.y -= bubble.speed;
        bubble.wobble += bubble.wobbleSpeed;
        bubble.pulse += bubble.pulseSpeed;
        const wx = bubble.x + Math.sin(bubble.wobble) * 15;

        if (bubble.y < -bubble.r * 2) {
          bubble.y = canvas.height + bubble.r;
          bubble.x = Math.random() * canvas.width;
        }

        const pulsedR = bubble.r + Math.sin(bubble.pulse) * 2;
        const grad = ctx.createRadialGradient(wx - pulsedR * 0.3, bubble.y - pulsedR * 0.3, pulsedR * 0.1, wx, bubble.y, pulsedR);
        grad.addColorStop(0, 'rgba(255,255,255,0.7)');
        grad.addColorStop(0.4, bubble.color + Math.round(bubble.opacity * 0.6 * 255).toString(16).padStart(2, '0'));
        grad.addColorStop(1, bubble.color + Math.round(bubble.opacity * 0.2 * 255).toString(16).padStart(2, '0'));

        ctx.beginPath();
        ctx.arc(wx, bubble.y, pulsedR, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Bubble rim
        ctx.beginPath();
        ctx.arc(wx, bubble.y, pulsedR, 0, Math.PI * 2);
        ctx.strokeStyle = bubble.color + '60';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Shine
        ctx.beginPath();
        ctx.arc(wx - pulsedR * 0.3, bubble.y - pulsedR * 0.3, pulsedR * 0.2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.fill();
      });

      // Sparkles
      sparkles.forEach(s => {
        s.opacity += s.opacityDir * s.twinkleSpeed;
        if (s.opacity >= 1) { s.opacity = 1; s.opacityDir = -1; }
        if (s.opacity <= 0) { s.opacity = 0; s.opacityDir = 1; }
        drawSparkle(s.x, s.y, s.size, s.color, s.opacity);
      });

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [variant, theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

export default LiveBackground;
