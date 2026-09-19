import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { Globe, Plus, Trash2, Edit2, CheckCircle2, AlertCircle, Copy } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import LiveBackground from "@/components/features/LiveBackground";
import BismillahHeader from "@/components/features/BismillahHeader";
import ComposeModal from "@/components/features/ComposeModal";
import { MOCK_WEBHOOKS } from "@/lib/mockData";
import Login from "@/pages/Login";
import type { EmailFolder, WebhookConfig } from "@/types/email";
import { toast } from "sonner";

const Webhooks = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>(MOCK_WEBHOOKS);
  const [activeFolder] = useState<EmailFolder>("inbox");

  if (!isAuthenticated) return <><LiveBackground variant="login" /><Login onLogin={login} /></>;

  const surfaceStyle = { background: `${theme.surface}`, backdropFilter: 'blur(20px)', border: `1px solid ${theme.border}` };

  const toggleWebhook = (id: string) => {
    setWebhooks(prev => prev.map(w => w.id === id ? { ...w, isActive: !w.isActive } : w));
    const wh = webhooks.find(w => w.id === id);
    toast.success(wh?.isActive ? "Webhook paused" : "Webhook activated");
  };

  const activeCount = webhooks.filter(w => w.isActive).length;
  const totalSuccess = webhooks.reduce((s, w) => s + w.successCount, 0);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: theme.bg }}>
      <LiveBackground />
      <BismillahHeader />
      <div className="relative z-10 flex flex-1 overflow-hidden">
        <Sidebar user={user!} activeFolder={activeFolder} onFolderChange={() => navigate("/")} onLogout={logout} onCompose={() => setIsComposing(true)} isMobileOpen={isSidebarOpen} onMobileClose={() => setIsSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
          <Header user={user!} title="Webhooks" onMenuToggle={() => setIsSidebarOpen(true)} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
          <main className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Active Webhooks', value: activeCount, color: '#10b981' },
                { label: 'Total Deliveries', value: totalSuccess.toLocaleString(), color: theme.accent },
                { label: 'Success Rate', value: '99.3%', color: '#f59e0b' },
              ].map(stat => (
                <div key={stat.label} className="rounded-2xl p-4" style={surfaceStyle}>
                  <p className="text-2xl font-black" style={{ color: stat.color }}>{stat.value}</p>
                  <p className="text-xs mt-0.5" style={{ color: theme.text, opacity: 0.55 }}>{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold" style={{ color: theme.text }}>Webhook Endpoints</h2>
              <button
                onClick={() => toast.info("Webhook builder coming soon")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
                style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.glow})` }}
              >
                <Plus size={14} />
                New Webhook
              </button>
            </div>

            <div className="space-y-3">
              {webhooks.map(webhook => (
                <div key={webhook.id} className="rounded-2xl p-4 transition-all" style={{ ...surfaceStyle, borderLeft: webhook.isActive ? `3px solid ${theme.accent}` : `3px solid ${theme.border}` }}>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${theme.accent}15` }}>
                      <Globe size={18} style={{ color: theme.accent }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-sm font-bold" style={{ color: theme.text }}>{webhook.name}</h3>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{
                          background: webhook.isActive ? '#10b98120' : `${theme.accent}15`,
                          color: webhook.isActive ? '#10b981' : theme.text,
                        }}>
                          {webhook.isActive ? 'Active' : 'Paused'}
                        </span>
                      </div>
                      <p className="text-xs font-mono truncate mb-2" style={{ color: theme.text, opacity: 0.5 }}>{webhook.url}</p>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {webhook.events.map(ev => (
                          <span key={ev} className="text-[10px] px-2 py-0.5 rounded-md font-medium" style={{ background: `${theme.accent}12`, color: theme.accent }}>
                            {ev}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 text-[11px]" style={{ color: theme.text, opacity: 0.5 }}>
                        <span className="flex items-center gap-1"><CheckCircle2 size={10} style={{ color: '#10b981' }} />{webhook.successCount}</span>
                        <span className="flex items-center gap-1"><AlertCircle size={10} style={{ color: '#ef4444' }} />{webhook.failureCount}</span>
                        <span>Last: {webhook.lastTriggered}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={() => { navigator.clipboard.writeText(webhook.url); toast.success("URL copied"); }} className="p-2 rounded-lg" style={{ color: theme.text, opacity: 0.5 }}>
                        <Copy size={13} />
                      </button>
                      <button onClick={() => toggleWebhook(webhook.id)} className="p-2 rounded-lg transition-all" style={{ background: webhook.isActive ? `${theme.accent}15` : 'transparent', color: theme.accent }}>
                        {webhook.isActive ? '⏸' : '▶'}
                      </button>
                      <button onClick={() => { setWebhooks(prev => prev.filter(w => w.id !== webhook.id)); toast.success("Webhook deleted"); }} className="p-2 rounded-lg" style={{ color: '#ef4444', opacity: 0.7 }}>
                        <Trash2 size={13} />
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

export default Webhooks;
