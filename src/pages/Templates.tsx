import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  LayoutTemplate, Plus, Edit3, Copy, Trash2,
  Mail, Briefcase, Heart, Star, Send
} from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import LiveBackground from "@/components/features/LiveBackground";
import BismillahHeader from "@/components/features/BismillahHeader";
import ComposeModal from "@/components/features/ComposeModal";
import Login from "@/pages/Login";
import type { EmailFolder } from "@/types/email";
import { toast } from "sonner";

const TEMPLATE_CATEGORIES = ['All', 'Professional', 'Personal', 'Sales', 'Support', 'Islamic'];

const DEFAULT_TEMPLATES = [
  {
    id: '1', name: 'Professional Follow-up', category: 'Professional', icon: Briefcase,
    subject: 'Following up on our conversation',
    preview: 'Dear [Name], I wanted to follow up on our recent conversation...',
    body: 'Dear [Name],\n\nI wanted to follow up on our recent conversation regarding [topic].\n\nPlease let me know if you have any questions or need further clarification.\n\nBest regards,\n[Your Name]',
  },
  {
    id: '2', name: 'Meeting Request', category: 'Professional', icon: Mail,
    subject: 'Meeting Request — [Date]',
    preview: 'Hi [Name], I would like to schedule a meeting...',
    body: 'Hi [Name],\n\nI would like to schedule a meeting to discuss [topic].\n\nWould [Date/Time] work for you? If not, please suggest a time that is convenient.\n\nLooking forward to connecting,\n[Your Name]',
  },
  {
    id: '3', name: 'Thank You Note', category: 'Personal', icon: Heart,
    subject: 'Thank You — [Subject]',
    preview: 'Dear [Name], Thank you for [reason]...',
    body: 'Dear [Name],\n\nThank you for [reason]. I truly appreciate your [time/effort/support].\n\nYour [kindness/help/guidance] has made a significant difference.\n\nWith gratitude,\n[Your Name]',
  },
  {
    id: '4', name: 'Islamic Greeting', category: 'Islamic', icon: Star,
    subject: 'السلام علیکم ورحمۃ اللہ وبرکاتہ',
    preview: 'السلام علیکم ورحمۃ اللہ وبرکاتہ، بسم اللہ الرحمن الرحیم...',
    body: 'السلام علیکم ورحمۃ اللہ وبرکاتہ\n\nبسم اللہ الرحمن الرحیم\n\n[Your message here]\n\nجزاکم اللہ خیراً\nوالسلام علیکم ورحمۃ اللہ وبرکاتہ\n\n[Your Name]',
  },
  {
    id: '5', name: 'Sales Outreach', category: 'Sales', icon: Send,
    subject: 'Quick Question — [Company Name]',
    preview: 'Hi [Name], I noticed [observation] and thought...',
    body: 'Hi [Name],\n\nI noticed [observation about their company/work] and thought you might be interested in [solution].\n\nWe have helped companies like [example] achieve [result].\n\nWould you be open to a brief 15-minute call this week?\n\nBest,\n[Your Name]',
  },
  {
    id: '6', name: 'Support Response', category: 'Support', icon: Mail,
    subject: 'Re: [Issue] — Resolution',
    preview: 'Hello [Name], Thank you for reaching out...',
    body: 'Hello [Name],\n\nThank you for reaching out to us.\n\nWe understand that you are experiencing [issue]. Here is how we can resolve this:\n\n1. [Step 1]\n2. [Step 2]\n3. [Step 3]\n\nIf you need further assistance, please do not hesitate to contact us.\n\nBest regards,\n[Support Team]',
  },
];

const Templates = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  const { theme } = useTheme();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedTemplate, setSelectedTemplate] = useState<typeof DEFAULT_TEMPLATES[0] | null>(null);
  const [activeFolder] = useState<EmailFolder>("inbox");

  if (!isAuthenticated) return <><LiveBackground variant="login" /><Login onLogin={login} /></>;

  const filtered = DEFAULT_TEMPLATES.filter(t =>
    (activeCategory === 'All' || t.category === activeCategory) &&
    (t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.subject.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const surfaceStyle = {
    background: `${theme.surface}`,
    backdropFilter: 'blur(20px)',
    border: `1px solid ${theme.border}`,
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: theme.bg }}>
      <LiveBackground />
      <BismillahHeader />

      <div className="relative z-10 flex flex-col flex-1">
        <div className="flex flex-1 overflow-hidden">
          <Sidebar user={user!} activeFolder={activeFolder} onFolderChange={() => navigate("/")} onLogout={logout} onCompose={() => setIsComposing(true)} isMobileOpen={isSidebarOpen} onMobileClose={() => setIsSidebarOpen(false)} />

          <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
            <Header user={user!} title="Email Templates" onMenuToggle={() => setIsSidebarOpen(true)} searchQuery={searchQuery} onSearchChange={setSearchQuery} />

            <main className="flex-1 overflow-y-auto p-4 lg:p-6">
              {/* Category tabs */}
              <div className="flex gap-2 flex-wrap mb-5">
                {TEMPLATE_CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
                    style={{
                      background: activeCategory === cat ? `linear-gradient(135deg, ${theme.accent}, ${theme.glow})` : `${theme.accent}15`,
                      color: activeCategory === cat ? 'white' : theme.text,
                      border: `1px solid ${activeCategory === cat ? theme.accent : theme.border}`,
                    }}
                  >
                    {cat}
                  </button>
                ))}
                <button
                  onClick={() => toast.info("Template builder coming soon")}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ml-auto"
                  style={{ background: `${theme.accent}20`, color: theme.accent, border: `1px dashed ${theme.border}` }}
                >
                  <Plus size={12} />
                  New Template
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map(tpl => {
                  const Icon = tpl.icon;
                  return (
                    <div
                      key={tpl.id}
                      className="rounded-2xl p-5 cursor-pointer transition-all hover:scale-[1.02]"
                      style={{
                        ...surfaceStyle,
                        boxShadow: selectedTemplate?.id === tpl.id ? `0 0 20px ${theme.glow}40` : 'none',
                        border: selectedTemplate?.id === tpl.id ? `2px solid ${theme.accent}` : `1px solid ${theme.border}`,
                      }}
                      onClick={() => setSelectedTemplate(selectedTemplate?.id === tpl.id ? null : tpl)}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${theme.accent}20` }}>
                          <Icon size={18} style={{ color: theme.accent }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold truncate" style={{ color: theme.text }}>{tpl.name}</p>
                          <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: `${theme.accent}15`, color: theme.accent }}>{tpl.category}</span>
                        </div>
                      </div>

                      <p className="text-xs font-medium mb-1 truncate" style={{ color: theme.text, opacity: 0.6 }}>{tpl.subject}</p>
                      <p className="text-xs truncate" style={{ color: theme.text, opacity: 0.45 }}>{tpl.preview}</p>

                      {selectedTemplate?.id === tpl.id && (
                        <div className="mt-3 pt-3 flex gap-2" style={{ borderTop: `1px solid ${theme.border}` }}>
                          <button
                            onClick={(e) => { e.stopPropagation(); setIsComposing(true); toast.info(`Template "${tpl.name}" loaded`); }}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-white"
                            style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.glow})` }}
                          >
                            <Send size={11} />
                            Use Template
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(tpl.body); toast.success("Copied!"); }}
                            className="p-2 rounded-xl"
                            style={{ background: `${theme.accent}15`, color: theme.accent }}
                          >
                            <Copy size={13} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </main>
          </div>
        </div>
      </div>

      {isComposing && <ComposeModal onClose={() => setIsComposing(false)} defaultSubject={selectedTemplate?.subject} />}
    </div>
  );
};

export default Templates;
