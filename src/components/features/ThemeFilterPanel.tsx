import { useState } from "react";
import { Check, Palette } from "lucide-react";
import { useTheme, THEMES } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

interface ThemeFilterPanelProps {
  onClose?: () => void;
}

const ThemeFilterPanel = ({ onClose }: ThemeFilterPanelProps) => {
  const { theme, setTheme } = useTheme();
  const [search, setSearch] = useState("");

  const filtered = THEMES.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.nameUr.includes(search)
  );

  return (
    <div
      className="rounded-2xl overflow-hidden shadow-2xl"
      style={{
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${theme.border}`,
        width: 320,
        maxHeight: 480,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: `1px solid ${theme.border}` }}>
        <Palette size={16} style={{ color: theme.accent }} />
        <span className="text-sm font-bold" style={{ color: theme.text }}>Visual Themes ({THEMES.length})</span>
      </div>

      <div className="px-3 py-2" style={{ borderBottom: `1px solid ${theme.border}` }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search themes..."
          className="w-full text-xs px-3 py-2 rounded-lg outline-none"
          style={{
            background: `${theme.accent}15`,
            border: `1px solid ${theme.border}`,
            color: theme.text,
          }}
        />
      </div>

      <div className="overflow-y-auto p-3 grid grid-cols-3 gap-2 flex-1">
        {filtered.map(t => (
          <button
            key={t.id}
            onClick={() => { setTheme(t.id); onClose?.(); }}
            className="relative group flex flex-col items-center gap-1 p-2 rounded-xl transition-all hover:scale-105"
            style={{
              background: t.gradient,
              border: theme.id === t.id ? `2px solid ${t.accent}` : '2px solid transparent',
              boxShadow: theme.id === t.id ? `0 0 12px ${t.glow}60` : 'none',
            }}
          >
            {theme.id === t.id && (
              <div
                className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center"
                style={{ background: t.accent }}
              >
                <Check size={9} color="white" />
              </div>
            )}
            <div
              className="w-8 h-8 rounded-lg"
              style={{ background: t.surface, border: `1px solid ${t.border}` }}
            />
            <span className="text-[9px] font-medium text-center leading-tight" style={{ color: t.text }}>
              {t.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeFilterPanel;
