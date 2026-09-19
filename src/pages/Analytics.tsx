import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { BarChart3, TrendingUp, Mail, Send, Clock } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import LiveBackground from "@/components/features/LiveBackground";
import BismillahHeader from "@/components/features/BismillahHeader";
import ComposeModal from "@/components/features/ComposeModal";
import { MOCK_ANALYTICS } from "@/lib/mockData";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import Login from "@/pages/Login";
import type { EmailFolder } from "@/types/email";

const Analytics = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [activeFolder] = useState<EmailFolder>("inbox");

  if (!isAuthenticated) return <><LiveBackground variant="login" /><Login onLogin={login} /></>;

  const data = MOCK_ANALYTICS;
  const surfaceStyle = { background: `${theme.surface}`, backdropFilter: 'blur(20px)', border: `1px solid ${theme.border}` };

  const statCards = [
    { label: 'Emails Received', value: data.emailsReceived.toLocaleString(), icon: Mail, color: theme.accent },
    { label: 'Emails Sent', value: data.emailsSent.toLocaleString(), icon: Send, color: '#10b981' },
    { label: 'Response Rate', value: `${data.responseRate}%`, icon: TrendingUp, color: '#f59e0b' },
    { label: 'Avg Response Time', value: data.avgResponseTime, icon: Clock, color: '#8b5cf6' },
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: theme.bg }}>
      <LiveBackground />
      <BismillahHeader />
      <div className="relative z-10 flex flex-1 overflow-hidden">
        <Sidebar user={user!} activeFolder={activeFolder} onFolderChange={() => navigate("/")} onLogout={logout} onCompose={() => setIsComposing(true)} isMobileOpen={isSidebarOpen} onMobileClose={() => setIsSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
          <Header user={user!} title="Analytics" onMenuToggle={() => setIsSidebarOpen(true)} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
          <main className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {statCards.map(card => {
                const Icon = card.icon;
                return (
                  <div key={card.label} className="rounded-2xl p-4 transition-all hover:scale-[1.02]" style={surfaceStyle}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: `${card.color}20` }}>
                      <Icon size={16} style={{ color: card.color }} />
                    </div>
                    <p className="text-2xl font-black" style={{ color: card.color }}>{card.value}</p>
                    <p className="text-xs mt-0.5" style={{ color: theme.text, opacity: 0.55 }}>{card.label}</p>
                  </div>
                );
              })}
            </div>

            <div className="grid lg:grid-cols-2 gap-5">
              <div className="rounded-2xl p-5" style={surfaceStyle}>
                <h3 className="text-sm font-bold mb-4" style={{ color: theme.text }}>Weekly Trend</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={data.weeklyTrend}>
                    <defs>
                      <linearGradient id="colRec" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={theme.accent} stopOpacity={0.4} />
                        <stop offset="95%" stopColor={theme.accent} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colSnt" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={theme.glow} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={theme.glow} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={`${theme.accent}18`} />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: theme.text }} />
                    <YAxis tick={{ fontSize: 11, fill: theme.text }} />
                    <Tooltip contentStyle={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 12 }} />
                    <Area type="monotone" dataKey="received" stroke={theme.accent} fill="url(#colRec)" name="Received" strokeWidth={2} />
                    <Area type="monotone" dataKey="sent" stroke={theme.glow} fill="url(#colSnt)" name="Sent" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-2xl p-5" style={surfaceStyle}>
                <h3 className="text-sm font-bold mb-4" style={{ color: theme.text }}>Category Breakdown</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={data.categoryBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                      {data.categoryBreakdown.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-2 justify-center">
                  {data.categoryBreakdown.map(cat => (
                    <span key={cat.name} className="flex items-center gap-1.5 text-xs" style={{ color: theme.text }}>
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: cat.color }} />
                      {cat.name} ({cat.value}%)
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl p-5" style={surfaceStyle}>
              <h3 className="text-sm font-bold mb-4" style={{ color: theme.text }}>Daily Activity</h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={data.dailyActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke={`${theme.accent}15`} />
                  <XAxis dataKey="hour" tick={{ fontSize: 10, fill: theme.text }} />
                  <YAxis tick={{ fontSize: 10, fill: theme.text }} />
                  <Tooltip contentStyle={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 12 }} />
                  <Bar dataKey="received" fill={theme.accent} opacity={0.8} radius={[4,4,0,0]} name="Received" />
                  <Bar dataKey="sent" fill={theme.glow} opacity={0.7} radius={[4,4,0,0]} name="Sent" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-2xl p-5" style={surfaceStyle}>
              <h3 className="text-sm font-bold mb-4" style={{ color: theme.text }}>Top Senders</h3>
              <div className="space-y-3">
                {data.topSenders.map(sender => (
                  <div key={sender.email} className="flex items-center gap-3">
                    <img src={sender.avatar} alt={sender.name} className="w-8 h-8 rounded-full" style={{ border: `1px solid ${theme.border}` }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate" style={{ color: theme.text }}>{sender.name}</p>
                      <div className="w-full h-1.5 rounded-full mt-1" style={{ background: `${theme.accent}15` }}>
                        <div className="h-full rounded-full" style={{ width: `${(sender.count / 130) * 100}%`, background: `linear-gradient(90deg, ${theme.accent}, ${theme.glow})` }} />
                      </div>
                    </div>
                    <span className="text-xs font-bold" style={{ color: theme.accent }}>{sender.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
      {isComposing && <ComposeModal onClose={() => setIsComposing(false)} />}
    </div>
  );
};

export default Analytics;
