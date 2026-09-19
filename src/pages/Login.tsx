import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, Sparkles, Star, Shield, Globe } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/lib/i18n";
import BismillahHeader from "@/components/features/BismillahHeader";

interface LoginProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
}

const FEATURES = [
  { icon: Shield, label: 'Zero Trust Security', sub: 'End-to-end encrypted' },
  { icon: Sparkles, label: 'AI Smart Compose', sub: 'Powered by Gemini 3' },
  { icon: Globe, label: 'Cloudflare Routing', sub: 'Lightning fast delivery' },
  { icon: Star, label: 'Multi-Account', sub: 'All inboxes in one place' },
];

const Login = ({ onLogin }: LoginProps) => {
  const { theme, themes, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [time, setTime] = useState(new Date());
  const [showThemePicker, setShowThemePicker] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    const ok = await onLogin(email, password);
    if (!ok) {
      setError("Invalid credentials. Try any email with 6+ character password.");
      setIsLoading(false);
    }
  };

  const surfaceStyle = {
    background: `${theme.surface}`,
    backdropFilter: 'blur(24px)',
    border: `1px solid ${theme.border}`,
  };

  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{ background: theme.gradient }}
    >
      <BismillahHeader />

      {/* Ticker */}
      <div
        className="px-4 py-1.5 flex items-center gap-6 text-[11px] overflow-hidden"
        style={{ background: `${theme.accent}12`, borderBottom: `1px solid ${theme.border}` }}
      >
        <span style={{ color: theme.accent, fontWeight: 600 }}>IQMAIL v2.0</span>
        <span style={{ color: theme.text, opacity: 0.7 }}>
          {time.toLocaleTimeString()} ·
          Fri, 18 Sep 2026 ·
          AI Email Platform
        </span>
        <div className="ml-auto flex gap-3">
          {(['en', 'ur', 'ar'] as const).map(l => (
            <button
              key={l}
              onClick={() => setLanguage(l)}
              className="px-2 py-0.5 rounded font-medium transition-all"
              style={{
                background: language === l ? theme.accent : 'transparent',
                color: language === l ? 'white' : theme.text,
                opacity: language === l ? 1 : 0.5,
              }}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
          {/* Left: branding */}
          <div className="hidden lg:flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.glow})` }}
                >
                  <span className="text-2xl font-black text-white">IQ</span>
                </div>
                <div>
                  <h1 className="text-3xl font-black" style={{ color: theme.text }}>IQMAIL</h1>
                  <p className="text-sm" style={{ color: theme.text, opacity: 0.6 }}>Intelligent Email Platform</p>
                </div>
              </div>
              <p
                className="text-lg font-medium leading-relaxed"
                style={{ color: theme.text, opacity: 0.75 }}
              >
                The world's smartest email client — AI-powered, glass-beautiful, lightning fast.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {FEATURES.map(feat => {
                const Icon = feat.icon;
                return (
                  <div
                    key={feat.label}
                    className="p-4 rounded-2xl transition-all hover:scale-[1.02]"
                    style={surfaceStyle}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center mb-2"
                      style={{ background: `${theme.accent}20` }}
                    >
                      <Icon size={16} style={{ color: theme.accent }} />
                    </div>
                    <p className="text-sm font-semibold" style={{ color: theme.text }}>{feat.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: theme.text, opacity: 0.5 }}>{feat.sub}</p>
                  </div>
                );
              })}
            </div>

            {/* Theme picker mini */}
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: theme.text, opacity: 0.6 }}>CHOOSE THEME</p>
              <div className="flex gap-2 flex-wrap">
                {themes.slice(0, 10).map(th => (
                  <button
                    key={th.id}
                    onClick={() => setTheme(th.id)}
                    title={th.name}
                    className="w-7 h-7 rounded-full transition-all hover:scale-110"
                    style={{
                      background: th.gradient,
                      border: theme.id === th.id ? `2px solid ${th.accent}` : '2px solid transparent',
                      boxShadow: theme.id === th.id ? `0 0 8px ${th.glow}80` : 'none',
                    }}
                  />
                ))}
                <button
                  onClick={() => setShowThemePicker(!showThemePicker)}
                  className="w-7 h-7 rounded-full text-[10px] font-bold"
                  style={{ background: `${theme.accent}20`, color: theme.accent }}
                >
                  +{themes.length - 10}
                </button>
              </div>
            </div>
          </div>

          {/* Right: login form */}
          <div className="w-full max-w-sm mx-auto lg:mx-0">
            <div className="rounded-3xl p-7 shadow-2xl" style={surfaceStyle}>
              {/* Mobile logo */}
              <div className="lg:hidden flex items-center gap-3 mb-6">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.glow})` }}
                >
                  <span className="text-base font-black text-white">IQ</span>
                </div>
                <h1 className="text-xl font-black" style={{ color: theme.text }}>IQMAIL</h1>
              </div>

              <h2 className="text-xl font-bold mb-1" style={{ color: theme.text }}>Sign In</h2>
              <p className="text-sm mb-6" style={{ color: theme.text, opacity: 0.55 }}>
                Welcome back to your intelligent inbox
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold mb-1.5 block" style={{ color: theme.text }}>Email Address</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.accent }} />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full pl-9 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={{
                        background: `${theme.accent}12`,
                        border: `1px solid ${theme.border}`,
                        color: theme.text,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold mb-1.5 block" style={{ color: theme.text }}>Password</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.accent }} />
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-9 pr-10 py-3 rounded-xl text-sm outline-none transition-all"
                      style={{
                        background: `${theme.accent}12`,
                        border: `1px solid ${theme.border}`,
                        color: theme.text,
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      style={{ color: theme.text, opacity: 0.5 }}
                    >
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-xs text-center p-2 rounded-lg" style={{ background: '#ef444415', color: '#ef4444' }}>
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
                  style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.glow})` }}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </>
                  ) : '→ Sign In'}
                </button>
              </form>

              <div className="mt-4 p-3 rounded-xl text-xs" style={{ background: `${theme.accent}10`, border: `1px solid ${theme.border}` }}>
                <p className="font-semibold mb-1" style={{ color: theme.text }}>Demo Credentials</p>
                <p style={{ color: theme.text, opacity: 0.65 }}>👑 Any email + 6+ char password</p>
                <p style={{ color: theme.text, opacity: 0.65 }}>🔐 Admin Panel: @1122#</p>
              </div>

              <div className="mt-3 text-center">
                <button
                  onClick={() => navigate('/admin')}
                  className="text-xs underline"
                  style={{ color: theme.accent, opacity: 0.7 }}
                >
                  Access Admin Panel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
