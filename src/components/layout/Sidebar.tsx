import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home, Send, Archive, Star, AlertTriangle, Trash2,
  Settings, BarChart2, Zap, ChevronDown,
  Plus, LogOut, Shield, Tag, Globe, X, Mic,
  Webhook, Package, LayoutTemplate
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { User } from "@/types/email";
import { FOLDER_COUNTS } from "@/lib/mockData";
import type { EmailFolder } from "@/types/email";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/lib/i18n";

interface SidebarProps {
  user: User;
  activeFolder: EmailFolder;
  onFolderChange: (folder: EmailFolder) => void;
  onLogout: () => void;
  onCompose: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

const Sidebar = ({ user, activeFolder, onFolderChange, onLogout, onCompose, isMobileOpen, onMobileClose }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const { language } = useLanguage();
  const [labelsOpen, setLabelsOpen] = useState(false);

  const navFolders = [
    { id: "inbox" as EmailFolder, icon: Home, label: t(language, 'home') },
    { id: "sent" as EmailFolder, icon: Send, label: t(language, 'sent') },
    { id: "drafts" as EmailFolder, icon: Package, label: t(language, 'storeroom') },
    { id: "starred" as EmailFolder, icon: Star, label: t(language, 'starred') },
    { id: "spam" as EmailFolder, icon: AlertTriangle, label: t(language, 'spam') },
    { id: "trash" as EmailFolder, icon: Trash2, label: t(language, 'trash') },
    { id: "archive" as EmailFolder, icon: Archive, label: t(language, 'archive') },
  ];

  const navPages = [
    { path: "/analytics", icon: BarChart2, label: "Analytics" },
    { path: "/automations", icon: Zap, label: "Automations" },
    { path: "/webhooks", icon: Globe, label: "Webhooks" },
    { path: "/templates", icon: LayoutTemplate, label: "Templates" },
    { path: "/vault", icon: Shield, label: "Vault" },
    { path: "/settings", icon: Settings, label: t(language, 'settings') },
  ];

  const storagePercent = (user.storageUsed / user.storageTotal) * 100;

  const handleNav = (path: string) => { navigate(path); onMobileClose(); };
  const handleFolderClick = (folder: EmailFolder) => { onFolderChange(folder); navigate("/"); onMobileClose(); };

  const surfaceStyle = {
    background: `${theme.surface}`,
    backdropFilter: 'blur(24px)',
    borderRight: `1px solid ${theme.border}`,
  };

  return (
    <>
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden bg-black/20 backdrop-blur-sm" onClick={onMobileClose} />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-64 z-50 flex flex-col transition-transform duration-300",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
        style={surfaceStyle}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-5 pb-3">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md"
              style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.glow})` }}
            >
              <span className="text-sm font-black text-white">IQ</span>
            </div>
            <div>
              <span className="font-black text-base tracking-tight" style={{ color: theme.text }}>IQMAIL</span>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[9px] px-1.5 py-0.5 rounded font-bold" style={{ background: `${theme.accent}20`, color: theme.accent }}>PRO</span>
                <span className="text-[9px]" style={{ color: theme.text, opacity: 0.4 }}>v2.0</span>
              </div>
            </div>
          </div>
          <button onClick={onMobileClose} className="lg:hidden p-1.5 rounded-lg" style={{ color: theme.text, opacity: 0.5 }}>
            <X size={18} />
          </button>
        </div>

        {/* Compose */}
        <div className="px-4 mb-3">
          <button
            onClick={onCompose}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.glow})`, boxShadow: `0 4px 16px ${theme.glow}40` }}
          >
            <Plus size={16} />
            {t(language, 'compose')}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 space-y-0.5">
          <p className="text-[10px] font-bold uppercase tracking-widest px-2 py-1.5" style={{ color: theme.text, opacity: 0.4 }}>
            Mailboxes
          </p>
          {navFolders.map(({ id, icon: Icon, label }) => {
            const isActive = location.pathname === "/" && activeFolder === id;
            const count = FOLDER_COUNTS[id];
            return (
              <button
                key={id}
                onClick={() => handleFolderClick(id)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all"
                style={{
                  background: isActive ? `${theme.accent}20` : 'transparent',
                  color: isActive ? theme.accent : theme.text,
                  fontWeight: isActive ? 600 : 400,
                  opacity: isActive ? 1 : 0.7,
                }}
              >
                <Icon size={15} />
                <span className="flex-1 text-left">{label}</span>
                {count > 0 && (
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center"
                    style={{ background: isActive ? `${theme.accent}30` : `${theme.accent}15`, color: theme.accent }}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}

          {/* Labels */}
          <button
            onClick={() => setLabelsOpen(!labelsOpen)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all mt-1"
            style={{ color: theme.text, opacity: 0.6 }}
          >
            <Tag size={15} />
            <span className="flex-1 text-left">Labels</span>
            <ChevronDown size={13} className={cn("transition-transform duration-200", labelsOpen ? "rotate-180" : "")} />
          </button>
          {labelsOpen && (
            <div className="ml-4 space-y-0.5">
              {['Work', 'Dev', 'Billing', 'Newsletter', 'Alerts'].map((label, i) => {
                const colors = [theme.accent, theme.glow, '#f59e0b', '#10b981', '#ef4444'];
                return (
                  <button key={label} className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all" style={{ color: theme.text, opacity: 0.65 }}>
                    <span className="w-2 h-2 rounded-full" style={{ background: colors[i] }} />
                    {label}
                  </button>
                );
              })}
            </div>
          )}

          <div className="my-2" style={{ borderTop: `1px solid ${theme.border}` }} />

          <p className="text-[10px] font-bold uppercase tracking-widest px-2 py-1.5" style={{ color: theme.text, opacity: 0.4 }}>
            Features
          </p>
          {navPages.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path;
            return (
              <button
                key={path}
                onClick={() => handleNav(path)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all"
                style={{
                  background: isActive ? `${theme.glow}20` : 'transparent',
                  color: isActive ? theme.accent : theme.text,
                  fontWeight: isActive ? 600 : 400,
                  opacity: isActive ? 1 : 0.7,
                }}
              >
                <Icon size={15} />
                <span>{label}</span>
              </button>
            );
          })}

          {/* Admin */}
          <button
            onClick={() => handleNav('/admin')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all mt-1"
            style={{ background: `${theme.accent}12`, color: theme.accent, opacity: 0.85 }}
          >
            <Shield size={15} />
            Admin Panel
          </button>
        </nav>

        {/* Storage */}
        <div className="px-4 py-3 mx-3 mb-2 rounded-xl" style={{ background: `${theme.accent}10`, border: `1px solid ${theme.border}` }}>
          <div className="flex justify-between text-xs mb-1.5">
            <span style={{ color: theme.text, opacity: 0.6 }}>Storage</span>
            <span className="font-medium" style={{ color: theme.text }}>{user.storageUsed} / {user.storageTotal} GB</span>
          </div>
          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: `${theme.accent}20` }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${storagePercent}%`, background: `linear-gradient(90deg, ${theme.accent}, ${theme.glow})` }}
            />
          </div>
        </div>

        {/* User */}
        <div className="p-4" style={{ borderTop: `1px solid ${theme.border}` }}>
          <div className="flex items-center gap-3">
            <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full" style={{ border: `2px solid ${theme.border}` }} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate" style={{ color: theme.text }}>{user.name}</p>
              <p className="text-[11px] truncate" style={{ color: theme.text, opacity: 0.5 }}>{user.email}</p>
            </div>
            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg transition-all"
              style={{ color: theme.text, opacity: 0.5 }}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
