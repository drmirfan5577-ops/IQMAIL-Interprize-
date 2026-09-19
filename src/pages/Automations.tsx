import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { Zap, Plus, Play, Pause, Trash2, Edit2, CheckCircle2 } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import LiveBackground from "@/components/features/LiveBackground";
import BismillahHeader from "@/components/features/BismillahHeader";
import ComposeModal from "@/components/features/ComposeModal";
import { MOCK_AUTOMATIONS } from "@/lib/mockData";
import Login from "@/pages/Login";
import type { EmailFolder, AutomationRule } from "@/types/email";
import { toast } from "sonner";

const Automations = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [rules, setRules] = useState<AutomationRule[]>(MOCK_AUTOMATIONS);
  const [activeFolder] = useState<EmailFolder>("inbox");

  if (!isAuthenticated) return <><LiveBackground variant="login" /><Login onLogin={login} /></>;

  const surfaceStyle = { background: `${theme.surface}`, backdropFilter: 'blur(20px)', border: `1px solid ${theme.border}` };

  const toggleRule = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r));
    const rule = rules.find(r => r.id === id);
    toast.success(rule?.isActive ? "Automation paused" : "Automation activated");
  };

  const activeCount = rules.filter(r => r.isActive).length;
  const totalRuns = rules.reduce((s, r) => s + r.runCount, 0);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: theme.bg }}>
      <LiveBackground />
      <BismillahHeader />
      <div className="relative z-10 flex flex-1 overflow-hidden">
        <Sidebar user={user!} activeFolder={activeFolder} onFolderChange={() => navigate("/")} onLogout={logout} onCompose={() => setIsComposing(true)} isMobileOpen={isSidebarOpen} onMobileClose={() => setIsSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
          <Header user={user!} title="Automations" onMenuToggle={() => setIsSidebarOpen(true)} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
          <main className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Active Rules', value: activeCount, color: '#10b981' },
                { label: 'Total Runs', value: totalRuns.toLocaleString(), color: theme.accent },
                { label: 'Time Saved', value: '14.2h', color: '#f59e0b' },
              ].map(stat => (
                <div key={stat.label} className="rounded-2xl p-4" style={surfaceStyle}>
                  <p className="text-2xl font-black" style={{ color: stat.color }}>{stat.value}</p>
                  <p className="text-xs mt-0.5" style={{ color: theme.text, opacity: 0.55 }}>{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold" style={{ color: theme.text }}>Automation Rules</h2>
                <p className="text-xs" style={{ color: theme.text, opacity: 0.5 }}>Rules run automatically when conditions are met</p>
              </div>
              <button
                onClick={() => toast.info("Rule builder coming soon")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
                style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.glow})` }}
              >
                <Plus size={14} />
                New Rule
              </button>
            </div>

            <div className="space-y-3">
              {rules.map(rule => (
                <div
                  key={rule.id}
                  className="rounded-2xl p-4 transition-all"
                  style={{ ...surfaceStyle, borderLeft: rule.isActive ? `3px solid ${theme.accent}` : `3px solid ${theme.border}`, opacity: rule.isActive ? 1 : 0.75 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: rule.isActive ? `${theme.accent}20` : `${theme.border}40` }}>
                      <Zap size={16} style={{ color: rule.isActive ? theme.accent : theme.text }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <h3 className="text-sm font-bold" style={{ color: theme.text }}>{rule.name}</h3>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium flex items-center gap-1"
                          style={{ background: rule.isActive ? '#10b98120' : `${theme.border}40`, color: rule.isActive ? '#10b981' : theme.text }}
                        >
                          {rule.isActive && <CheckCircle2 size={9} />}
                          {rule.isActive ? 'Active' : 'Paused'}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] px-2 py-0.5 rounded font-bold" style={{ background: '#f59e0b20', color: '#f59e0b' }}>WHEN</span>
                          <span className="text-xs" style={{ color: theme.text, opacity: 0.65 }}>{rule.trigger}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] px-2 py-0.5 rounded font-bold" style={{ background: `${theme.accent}20`, color: theme.accent }}>THEN</span>
                          <span className="text-xs" style={{ color: theme.text, opacity: 0.65 }}>{rule.action}</span>
                        </div>
                      </div>
                      <p className="text-[11px]" style={{ color: theme.text, opacity: 0.4 }}>
                        Ran {rule.runCount.toLocaleString()}× · Last: {rule.lastRun}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={() => toggleRule(rule.id)} className="p-2 rounded-lg transition-all" style={{ color: rule.isActive ? theme.accent : theme.text, opacity: 0.7 }}>
                        {rule.isActive ? <Pause size={14} /> : <Play size={14} />}
                      </button>
                      <button onClick={() => toast.info("Edit rule coming soon")} className="p-2 rounded-lg" style={{ color: theme.text, opacity: 0.5 }}>
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => { setRules(prev => prev.filter(r => r.id !== rule.id)); toast.success("Deleted"); }} className="p-2 rounded-lg" style={{ color: '#ef4444', opacity: 0.6 }}>
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

export default Automations;
