import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/lib/i18n";
import {
  User, Bell, Palette, Globe, Mail, Edit3, Shield,
  PlusCircle, Trash2, Check, ChevronRight, Signature,
  CalendarDays, Zap, LogOut, KeyRound
} from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import LiveBackground from "@/components/features/LiveBackground";
import BismillahHeader from "@/components/features/BismillahHeader";
import ThemeFilterPanel from "@/components/features/ThemeFilterPanel";
import ComposeModal from "@/components/features/ComposeModal";
import { THEMES } from "@/contexts/ThemeContext";
import Login from "@/pages/Login";
import type { EmailFolder } from "@/types/email";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type SettingTab = 'profile' | 'accounts' | 'appearance' | 'notifications' | 'signature' | 'automation' | 'calendar' | 'security';

const Settings = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  const { theme, setTheme, themes } = useTheme();
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<SettingTab>('profile');
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [showThemePanel, setShowThemePanel] = useState(false);
  const [signature, setSignature] = useState("Best regards,\nYour Name\nIQMAIL User");
  const [sendingAs, setSendingAs] = useState("");
  const [sendingTo, setSendingTo] = useState("");
  const [displayName, setDisplayName] = useState(user?.name || "");
  const [activeFolder] = useState<EmailFolder>("inbox");
  const [notifications, setNotifications] = useState({ email: true, push: true, sound: false, digest: true });

  if (!isAuthenticated) return <><LiveBackground variant="login" /><Login onLogin={login} /></>;

  const surfaceStyle = {
    background: `${theme.surface}`,
    backdropFilter: 'blur(20px)',
    border: `1px solid ${theme.border}`,
  };

  const tabs: { id: SettingTab; label: string; icon: typeof User }[] = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'accounts', label: 'Accounts', icon: Mail },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'signature', label: 'Signature', icon: Signature },
    { id: 'automation', label: 'Automation', icon: Zap },
    { id: 'calendar', label: 'Calendar', icon: CalendarDays },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: theme.bg }}>
      <LiveBackground />
      <BismillahHeader />

      <div className="flex flex-1 overflow-hidden relative z-10">
        <Sidebar
          user={user!}
          activeFolder={activeFolder}
          onFolderChange={() => navigate("/")}
          onLogout={logout}
          onCompose={() => setIsComposing(true)}
          isMobileOpen={isSidebarOpen}
          onMobileClose={() => setIsSidebarOpen(false)}
        />

        <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
          <Header
            user={user!}
            title="Settings"
            onMenuToggle={() => setIsSidebarOpen(true)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <div className="flex flex-1 overflow-hidden">
            {/* Settings Nav */}
            <div
              className="hidden md:flex flex-col w-48 lg:w-56 p-3 gap-1 flex-shrink-0"
              style={{ background: `${theme.surface}80` }}
            >
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-left transition-all"
                    style={{
                      background: activeTab === tab.id ? `${theme.accent}22` : 'transparent',
                      color: activeTab === tab.id ? theme.accent : theme.text,
                      fontWeight: activeTab === tab.id ? 600 : 400,
                      border: activeTab === tab.id ? `1px solid ${theme.border}` : '1px solid transparent',
                    }}
                  >
                    <Icon size={14} />
                    {tab.label}
                  </button>
                );
              })}

              <div className="mt-auto pt-4" style={{ borderTop: `1px solid ${theme.border}` }}>
                <button
                  onClick={() => navigate('/admin')}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-left transition-all"
                  style={{ color: theme.accent, background: `${theme.accent}10` }}
                >
                  <Shield size={14} />
                  Admin Panel
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
              {activeTab === 'profile' && (
                <div className="space-y-5 max-w-xl">
                  <h2 className="text-xl font-bold" style={{ color: theme.text }}>Profile Settings</h2>
                  <div className="rounded-2xl p-5 space-y-4" style={surfaceStyle}>
                    <div className="flex items-center gap-4">
                      <img src={user?.avatar} alt="avatar" className="w-16 h-16 rounded-2xl object-cover" style={{ border: `2px solid ${theme.border}` }} />
                      <div>
                        <p className="font-bold text-base" style={{ color: theme.text }}>{user?.name}</p>
                        <p className="text-sm" style={{ color: theme.text, opacity: 0.6 }}>{user?.email}</p>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold mt-1 inline-block" style={{ background: `${theme.accent}20`, color: theme.accent }}>
                          {user?.plan?.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold mb-1 block" style={{ color: theme.text }}>Display Name</label>
                      <input
                        value={displayName}
                        onChange={e => setDisplayName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                        style={{ background: `${theme.accent}12`, border: `1px solid ${theme.border}`, color: theme.text }}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold mb-1 block" style={{ color: theme.text }}>Sending Mail As</label>
                      <input
                        value={sendingAs}
                        onChange={e => setSendingAs(e.target.value)}
                        placeholder={user?.email}
                        className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                        style={{ background: `${theme.accent}12`, border: `1px solid ${theme.border}`, color: theme.text }}
                      />
                      <p className="text-[10px] mt-1" style={{ color: theme.text, opacity: 0.5 }}>Emails will be sent from this address via Resend.</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold mb-1 block" style={{ color: theme.text }}>Sending Mail To (Default Reply-To)</label>
                      <input
                        value={sendingTo}
                        onChange={e => setSendingTo(e.target.value)}
                        placeholder="reply-to@example.com"
                        className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                        style={{ background: `${theme.accent}12`, border: `1px solid ${theme.border}`, color: theme.text }}
                      />
                    </div>
                    <button
                      onClick={() => toast.success("Profile saved")}
                      className="px-5 py-2 rounded-xl text-sm font-semibold text-white"
                      style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.glow})` }}
                    >
                      Save Profile
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="space-y-5">
                  <h2 className="text-xl font-bold" style={{ color: theme.text }}>Appearance & Themes</h2>
                  <div className="rounded-2xl p-5" style={surfaceStyle}>
                    <h3 className="text-sm font-semibold mb-3" style={{ color: theme.text }}>Language</h3>
                    <div className="flex gap-2 flex-wrap">
                      {([['en', 'English 🇬🇧'], ['ur', 'اردو 🇵🇰'], ['ar', 'العربية 🇸🇦']] as const).map(([code, label]) => (
                        <button
                          key={code}
                          onClick={() => setLanguage(code)}
                          className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
                          style={{
                            background: language === code ? `linear-gradient(135deg, ${theme.accent}, ${theme.glow})` : `${theme.accent}15`,
                            color: language === code ? 'white' : theme.text,
                            border: `1px solid ${language === code ? theme.accent : theme.border}`,
                          }}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl p-5" style={surfaceStyle}>
                    <h3 className="text-sm font-semibold mb-3" style={{ color: theme.text }}>Visual Theme (30+ variations)</h3>
                    <ThemeFilterPanel />
                  </div>
                </div>
              )}

              {activeTab === 'signature' && (
                <div className="space-y-5 max-w-xl">
                  <h2 className="text-xl font-bold" style={{ color: theme.text }}>Email Signature</h2>
                  <div className="rounded-2xl p-5 space-y-3" style={surfaceStyle}>
                    <label className="text-xs font-semibold block" style={{ color: theme.text }}>Signature Text</label>
                    <textarea
                      value={signature}
                      onChange={e => setSignature(e.target.value)}
                      rows={6}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
                      style={{ background: `${theme.accent}10`, border: `1px solid ${theme.border}`, color: theme.text }}
                    />
                    <div
                      className="p-3 rounded-xl text-sm"
                      style={{ background: `${theme.accent}08`, border: `1px dashed ${theme.border}` }}
                    >
                      <p className="text-xs font-semibold mb-1" style={{ color: theme.text, opacity: 0.6 }}>Preview:</p>
                      <pre className="text-xs whitespace-pre-wrap" style={{ color: theme.text, opacity: 0.8 }}>{signature}</pre>
                    </div>
                    <button
                      onClick={() => toast.success("Signature saved")}
                      className="px-5 py-2 rounded-xl text-sm font-semibold text-white"
                      style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.glow})` }}
                    >
                      Save Signature
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-5 max-w-xl">
                  <h2 className="text-xl font-bold" style={{ color: theme.text }}>Notification Settings</h2>
                  <div className="rounded-2xl p-5 space-y-4" style={surfaceStyle}>
                    {Object.entries(notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between py-2" style={{ borderBottom: `1px solid ${theme.border}` }}>
                        <div>
                          <p className="text-sm font-medium capitalize" style={{ color: theme.text }}>{key} Notifications</p>
                          <p className="text-xs" style={{ color: theme.text, opacity: 0.5 }}>
                            {key === 'email' ? 'Get notified for new emails' :
                             key === 'push' ? 'Browser push notifications' :
                             key === 'sound' ? 'Play sound on new email' :
                             'Daily email digest'}
                          </p>
                        </div>
                        <button
                          onClick={() => setNotifications(n => ({ ...n, [key]: !n[key as keyof typeof n] }))}
                          className="w-11 h-6 rounded-full transition-all relative"
                          style={{ background: value ? theme.accent : `${theme.accent}30` }}
                        >
                          <div
                            className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all"
                            style={{ left: value ? 'calc(100% - 22px)' : 2 }}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'calendar' && (
                <div className="space-y-5 max-w-xl">
                  <h2 className="text-xl font-bold" style={{ color: theme.text }}>Calendar & Events</h2>
                  <div className="rounded-2xl p-5 space-y-4" style={surfaceStyle}>
                    <div className="grid grid-cols-2 gap-3">
                      {['Sync with Google Calendar', 'Email Event Invites', 'Auto-create Events from Email', 'Meeting Reminders'].map(item => (
                        <div
                          key={item}
                          className="p-3 rounded-xl flex items-center gap-2 cursor-pointer transition-all hover:opacity-90"
                          style={{ background: `${theme.accent}12`, border: `1px solid ${theme.border}` }}
                          onClick={() => toast.info(`${item} — Coming soon`)}
                        >
                          <CalendarDays size={14} style={{ color: theme.accent }} />
                          <span className="text-xs font-medium" style={{ color: theme.text }}>{item}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs" style={{ color: theme.text, opacity: 0.5 }}>Calendar integrations coming in the next version.</p>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-5 max-w-xl">
                  <h2 className="text-xl font-bold" style={{ color: theme.text }}>Security & Privacy</h2>
                  <div className="rounded-2xl p-5 space-y-4" style={surfaceStyle}>
                    {[
                      { label: 'Two-Factor Authentication', sub: 'Add extra security to your account', action: 'Enable 2FA' },
                      { label: 'Email Encryption', sub: 'End-to-end encrypt sensitive emails', action: 'Configure' },
                      { label: 'Privacy Mode', sub: 'Hide email previews in notifications', action: 'Enable' },
                      { label: 'Active Sessions', sub: 'View and manage logged-in devices', action: 'View Sessions' },
                    ].map(item => (
                      <div key={item.label} className="flex items-center justify-between py-2.5" style={{ borderBottom: `1px solid ${theme.border}` }}>
                        <div>
                          <p className="text-sm font-medium" style={{ color: theme.text }}>{item.label}</p>
                          <p className="text-xs" style={{ color: theme.text, opacity: 0.5 }}>{item.sub}</p>
                        </div>
                        <button
                          onClick={() => toast.info(`${item.action} — Coming soon`)}
                          className="text-xs px-3 py-1.5 rounded-lg transition-all"
                          style={{ background: `${theme.accent}15`, color: theme.accent }}
                        >
                          {item.action}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'accounts' && (
                <div className="space-y-5 max-w-xl">
                  <h2 className="text-xl font-bold" style={{ color: theme.text }}>Email Accounts</h2>
                  <div className="rounded-2xl p-5 space-y-3" style={surfaceStyle}>
                    {[
                      { email: user?.email || '', label: 'Primary Account', active: true },
                      { email: 'work@company.com', label: 'Work Account', active: false },
                    ].map(acc => (
                      <div
                        key={acc.email}
                        className="flex items-center gap-3 p-3 rounded-xl"
                        style={{ background: `${theme.accent}10`, border: `1px solid ${theme.border}` }}
                      >
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-sm"
                          style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.glow})` }}
                        >
                          {acc.email[0].toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium" style={{ color: theme.text }}>{acc.email}</p>
                          <p className="text-xs" style={{ color: theme.text, opacity: 0.5 }}>{acc.label}</p>
                        </div>
                        {acc.active && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: '#10b98120', color: '#10b981' }}>Active</span>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => toast.info("Add account — Connect via OAuth or IMAP")}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all"
                      style={{ background: `${theme.accent}12`, border: `1px dashed ${theme.border}`, color: theme.accent }}
                    >
                      <PlusCircle size={14} />
                      Add Email Account
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'automation' && (
                <div className="space-y-5 max-w-xl">
                  <h2 className="text-xl font-bold" style={{ color: theme.text }}>Automation Rules</h2>
                  <button
                    onClick={() => navigate('/automations')}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
                    style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.glow})` }}
                  >
                    <Zap size={14} />
                    Manage Automations
                    <ChevronRight size={14} />
                  </button>
                  <p className="text-sm" style={{ color: theme.text, opacity: 0.6 }}>
                    Create rules to automatically label, archive, forward, or reply to emails based on conditions.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isComposing && <ComposeModal onClose={() => setIsComposing(false)} />}
    </div>
  );
};

export default Settings;
