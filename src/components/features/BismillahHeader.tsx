import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/lib/i18n";

const BismillahHeader = () => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const [glow, setGlow] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    let frame = 0;
    const animate = () => {
      frame += 0.03;
      setGlow(Math.sin(frame) * 0.5 + 0.5);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const glowIntensity = 8 + glow * 18;
  const opacity = 0.75 + glow * 0.25;

  return (
    <div
      className="w-full text-center py-2 px-4 relative overflow-hidden select-none"
      style={{
        background: `linear-gradient(90deg, transparent, ${theme.accent}22, transparent)`,
        borderBottom: `1px solid ${theme.border}`,
      }}
    >
      {/* Ornamental stars */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <span
            key={i}
            className="absolute text-xs"
            style={{
              left: `${5 + i * 8.5}%`,
              top: `${20 + Math.sin(i * 1.2) * 40}%`,
              color: theme.accent,
              opacity: 0.2 + Math.sin(i * 0.8 + glow * Math.PI) * 0.15,
              fontSize: `${6 + Math.sin(i) * 3}px`,
              transition: 'opacity 0.1s',
            }}
          >
            ✦
          </span>
        ))}
      </div>

      <div className="relative z-10">
        <p
          className="font-bold leading-tight"
          style={{
            fontFamily: '"Amiri", "Scheherazade New", "Noto Naskh Arabic", serif',
            fontSize: 'clamp(14px, 2.5vw, 22px)',
            color: theme.accent,
            opacity,
            textShadow: `0 0 ${glowIntensity}px ${theme.glow}, 0 0 ${glowIntensity * 2}px ${theme.glow}40`,
            letterSpacing: '0.05em',
            direction: 'rtl',
          }}
        >
          {t(language, 'bismillah')}
        </p>
        <p
          className="text-xs mt-0.5"
          style={{
            color: theme.text,
            opacity: 0.55,
            fontSize: 'clamp(9px, 1.2vw, 11px)',
            fontStyle: 'italic',
          }}
        >
          {t(language, 'bismillah_translation')}
        </p>
      </div>
    </div>
  );
};

export default BismillahHeader;
