import { useState } from "react";
import { Search, Bell, Menu, RefreshCw, Filter, Palette, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import type { User } from "@/types/email";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/lib/i18n";
import ThemeFilterPanel from "@/components/features/ThemeFilterPanel";
import NotificationCenter from "@/components/features/NotificationCenter";

interface HeaderProps {
  user: User;
  title: string;
  onMenuToggle: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const Header = ({ user, title, onMenuToggle, searchQuery, onSearchChange }: HeaderProps) => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const [showNotif, setShowNotif] = useState(false);
  const [showTheme, setShowTheme] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1200);
  };

  const headerStyle = {
    background: `${theme.surface}`,
    backdropFilter: 'blur(20px)',
    borderBottom: `1px solid ${theme.border}`,
  };

  return (
    <header className="sticky top-0 z-30 px-4 lg:px-6 py-3 flex items-center gap-3" style={headerStyle}>
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 rounded-lg transition-all"
        style={{ color: theme.text, opacity: 0.6 }}
      >
        <Menu size={20} />
      </button>

      <h1 className="text-base font-bold hidden sm:block" style={{ color: theme.text, minWidth: 100 }}>
        {title}
      </h1>

      {/* Search */}
      <div className="flex-1 max-w-xl relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.accent }} />
        <input
          type="text"
          placeholder={t(language, 'search')}
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-xl text-sm outline-none transition-all"
          style={{
            background: `${theme.accent}12`,
            border: `1px solid ${theme.border}`,
            color: theme.text,
          }}
        />
      </div>

      <div className="flex items-center gap-1">
        {/* Refresh */}
        <button onClick={handleRefresh} className="p-2 rounded-lg transition-all" style={{ color: theme.text, opacity: 0.6 }}>
          <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
        </button>

        {/* Theme */}
        <div className="relative">
          <button
            onClick={() => { setShowTheme(!showTheme); setShowNotif(false); }}
            className="p-2 rounded-lg transition-all"
            style={{ color: theme.accent, background: showTheme ? `${theme.accent}15` : 'transparent' }}
          >
            <Palette size={16} />
          </button>
          {showTheme && (
            <div className="absolute right-0 top-full mt-2">
              <ThemeFilterPanel onClose={() => setShowTheme(false)} />
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotif(!showNotif); setShowTheme(false); }}
            className="relative p-2 rounded-lg transition-all"
            style={{ color: showNotif ? theme.accent : theme.text, opacity: showNotif ? 1 : 0.7, background: showNotif ? `${theme.accent}15` : 'transparent' }}
          >
            <Bell size={16} />
            <span
              className="absolute top-1 right-1 w-2 h-2 rounded-full"
              style={{ background: theme.accent }}
            />
          </button>
          {showNotif && (
            <NotificationCenter onClose={() => setShowNotif(false)} />
          )}
        </div>

        {/* User avatar */}
        <img
          src={user.avatar}
          alt={user.name}
          className="w-8 h-8 rounded-full ml-1"
          style={{ border: `2px solid ${theme.border}` }}
        />
      </div>
    </header>
  );
};

export default Header;
