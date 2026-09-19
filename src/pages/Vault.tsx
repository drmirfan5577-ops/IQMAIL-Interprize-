import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { Shield, Eye, EyeOff, Copy, Plus, Trash2, Lock } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import LiveBackground from "@/components/features/LiveBackground";
import BismillahHeader from "@/components/features/BismillahHeader";
import ComposeModal from "@/components/features/ComposeModal";
import { MOCK_PASSWORDS } from "@/lib/mockData";
import Login from "@/pages/Login";
import type { EmailFolder } from "@/types/email";
import { toast } from "sonner";

const Vault = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [activeFolder] = useState<EmailFolder>("inbox");

  if (!isAuthenticated) return <><LiveBackground variant="login" /><Login onLogin={login} /></>;

  const surfaceStyle = { background: `${theme.surface}`, backdropFilter: 'blur(20px)', border: `1px solid ${theme.border}` };

  const strengthColor = (s: string) => s === 'strong' ? '#10b981' : s === 'medium' ? '#f59e0b' : '#ef4444';

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: theme.bg }}>
      <LiveBackground />
      <BismillahHeader />
      <div className="relative z-10 flex flex-1 overflow-hidden">
        <Sidebar user={user!} activeFolder={activeFolder} onFolderChange={() => navigate("/")} onLogout={logout} onCompose={() => setIsComposing(true)} isMobileOpen={isSidebarOpen} onMobileClose={() => setIsSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
          <Header user={user!} title="Password Vault" onMenuToggle={() => setIsSidebarOpen(true)} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
          <main className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-5">
            {/* Security banner */}
            <div className="rounded-2xl p-4 flex items-center gap-3" style={{ background: `${theme.accent}10`, border: `1px solid ${theme.border}` }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${theme.accent}20` }}>
                <Shield size={20} style={{ color: theme.accent }} />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: theme.text }}>End-to-End Encrypted Vault</p>
                <p className="text-xs" style={{ color: theme.text, opacity: 0.55 }}>Your passwords are encrypted with AES-256. Only you can access them.</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold" style={{ color: theme.text }}>Saved Passwords</h2>
              <button
                onClick={() => toast.info("Add password — Coming soon")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
                style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.glow})` }}
              >
                <Plus size={14} />
                Add Password
              </button>
            </div>

            <div className="space-y-3">
              {MOCK_PASSWORDS.map(pw => (
                <div key={pw.id} className="rounded-2xl p-4" style={surfaceStyle}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0" style={{ background: `${theme.accent}12`, border: `1px solid ${theme.border}` }}>
                      <img src={pw.icon} alt={pw.site} className="w-full h-full object-contain p-1"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-bold truncate" style={{ color: theme.text }}>{pw.site}</p>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ background: `${strengthColor(pw.strength)}20`, color: strengthColor(pw.strength) }}>
                          {pw.strength}
                        </span>
                      </div>
                      <p className="text-xs truncate" style={{ color: theme.text, opacity: 0.5 }}>{pw.username}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Lock size={11} style={{ color: theme.text, opacity: 0.4 }} />
                        <span className="text-xs font-mono" style={{ color: theme.text, opacity: 0.6 }}>
                          {revealed[pw.id] ? '••••••••' : pw.password}
                        </span>
                        <span className="text-[10px]" style={{ color: theme.text, opacity: 0.35 }}>Last used: {pw.lastUsed}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => setRevealed(prev => ({ ...prev, [pw.id]: !prev[pw.id] }))}
                        className="p-2 rounded-lg transition-all"
                        style={{ color: theme.text, opacity: 0.5 }}
                      >
                        {revealed[pw.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button
                        onClick={() => { navigator.clipboard.writeText('password123'); toast.success("Password copied"); }}
                        className="p-2 rounded-lg"
                        style={{ color: theme.accent }}
                      >
                        <Copy size={14} />
                      </button>
                      <button className="p-2 rounded-lg" style={{ color: '#ef4444', opacity: 0.6 }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
      {isComposing && <ComposeModal onClose={() => setIsComposing(false)} />}
    </div>
  );
};

export default Vault;
