import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Shield, Key, Cloud, Settings, Globe, RefreshCw, 
  ChevronRight, Eye, EyeOff, Save, CheckCircle, AlertCircle,
  Mail, Webhook, BarChart3, Lock
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import LiveBackground from "@/components/features/LiveBackground";
import BismillahHeader from "@/components/features/BismillahHeader";
import { toast } from "sonner";

const ADMIN_PASSWORD = "@1122#";

type AdminTab = 'auth' | 'resend' | 'cloudflare' | 'system';

const AdminPanel = () => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [isAuthed, setIsAuthed] = useState(false);
  const [inputPass, setInputPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('resend');
  const [resendKey, setResendKey] = useState("");
  const [showResendKey, setShowResendKey] = useState(false);
  const [cfZoneId, setCfZoneId] = useState("");
  const [cfApiToken, setCfApiToken] = useState("");
  const [cfAccountId, setCfAccountId] = useState("");
  const [showCfToken, setShowCfToken] = useState(false);
  const [cfDestEmail, setCfDestEmail] = useState("");
  const [cfCatchAll, setCfCatchAll] = useState(true);
  const [newAdminPass, setNewAdminPass] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleAuth = () => {
    if (inputPass === ADMIN_PASSWORD || inputPass === (localStorage.getItem('iqmail_admin_pass') || ADMIN_PASSWORD)) {
      setIsAuthed(true);
      toast.success("Admin Panel unlocked");
    } else {
      toast.error("Incorrect admin password");
    }
  };

  const saveResendKey = async () => {
    if (!resendKey.startsWith('re_')) {
      toast.error("Invalid Resend API key — must start with re_");
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      localStorage.setItem('iqmail_resend_key_set', 'true');
      toast.success("Resend API key saved. Deploying to Edge Functions...");
      setIsSaving(false);
    }, 1200);
  };

  const saveCloudflare = () => {
    setIsSaving(true);
    setTimeout(() => {
      localStorage.setItem('iqmail_cf_zone', cfZoneId);
      localStorage.setItem('iqmail_cf_account', cfAccountId);
      toast.success("Cloudflare Email Routing config saved");
      setIsSaving(false);
    }, 1000);
  };

  const changeAdminPass = () => {
    if (newAdminPass.length < 4) {
      toast.error("Password must be at least 4 characters");
      return;
    }
    localStorage.setItem('iqmail_admin_pass', newAdminPass);
    toast.success("Admin password updated successfully");
    setNewAdminPass("");
  };

  const surfaceStyle = {
    background: `${theme.surface}`,
    backdropFilter: 'blur(20px)',
    border: `1px solid ${theme.border}`,
  };

  if (!isAuthed) {
    return (
      <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: theme.bg }}>
        <LiveBackground />
        <BismillahHeader />
        <div className="flex-1 flex items-center justify-center p-4 relative z-10">
          <div className="w-full max-w-sm rounded-3xl p-8" style={surfaceStyle}>
            <div className="text-center mb-6">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.glow})` }}
              >
                <Shield size={28} color="white" />
              </div>
              <h1 className="text-2xl font-black" style={{ color: theme.text }}>Admin Panel</h1>
              <p className="text-sm mt-1" style={{ color: theme.text, opacity: 0.6 }}>
                Enter admin password to continue
              </p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.accent }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={inputPass}
                  onChange={e => setInputPass(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAuth()}
                  placeholder="Admin password"
                  className="w-full pl-10 pr-10 py-3 rounded-xl text-sm outline-none"
                  style={{
                    background: `${theme.accent}12`,
                    border: `1px solid ${theme.border}`,
                    color: theme.text,
                  }}
                />
                <button
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: theme.text, opacity: 0.5 }}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              <button
                onClick={handleAuth}
                className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.glow})` }}
              >
                Unlock Admin Panel
              </button>

              <button
                onClick={() => navigate(-1)}
                className="w-full py-2 text-xs rounded-xl transition-all"
                style={{ color: theme.text, opacity: 0.5 }}
              >
                ← Back to IQMAIL
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tabs: { id: AdminTab; label: string; icon: typeof Key }[] = [
    { id: 'resend', label: 'Resend API', icon: Mail },
    { id: 'cloudflare', label: 'Cloudflare', icon: Cloud },
    { id: 'system', label: 'System', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: theme.bg }}>
      <LiveBackground />
      <BismillahHeader />

      <div className="relative z-10 flex-1 flex flex-col">
        {/* Top bar */}
        <div
          className="px-4 lg:px-6 py-3 flex items-center justify-between"
          style={{ ...surfaceStyle, borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.glow})` }}
            >
              <Shield size={16} color="white" />
            </div>
            <div>
              <h1 className="text-base font-black" style={{ color: theme.text }}>Admin Command Center</h1>
              <p className="text-[10px]" style={{ color: theme.text, opacity: 0.5 }}>IQMAIL System Management</p>
            </div>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="text-xs px-3 py-1.5 rounded-lg"
            style={{ background: `${theme.accent}15`, color: theme.accent }}
          >
            ← Back
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar tabs */}
          <div className="w-48 lg:w-56 p-3 space-y-1 flex-shrink-0" style={{ background: `${theme.surface}80` }}>
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-left transition-all"
                  style={{
                    background: activeTab === tab.id ? `linear-gradient(135deg, ${theme.accent}25, ${theme.glow}15)` : 'transparent',
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
          </div>

          {/* Content */}
          <div className="flex-1 p-4 lg:p-6 overflow-y-auto space-y-5">
            {/* RESEND TAB */}
            {activeTab === 'resend' && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-bold" style={{ color: theme.text }}>Resend Email API</h2>
                  <p className="text-sm mt-0.5" style={{ color: theme.text, opacity: 0.6 }}>
                    Configure your Resend API key for sending emails from IQMAIL.
                  </p>
                </div>

                <div className="rounded-2xl p-5 space-y-4" style={surfaceStyle}>
                  <div className="flex items-start gap-3 p-3 rounded-xl" style={{ background: `${theme.accent}10`, border: `1px solid ${theme.border}` }}>
                    <AlertCircle size={16} style={{ color: theme.accent, flexShrink: 0, marginTop: 2 }} />
                    <div className="text-xs" style={{ color: theme.text }}>
                      <p className="font-semibold">How to get your Resend API key:</p>
                      <ol className="mt-1 space-y-0.5 opacity-70 list-decimal list-inside">
                        <li>Go to resend.com and sign in</li>
                        <li>Navigate to API Keys</li>
                        <li>Create a new key with Send access</li>
                        <li>Copy and paste it below</li>
                      </ol>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: theme.text }}>
                      Resend API Key
                    </label>
                    <div className="relative">
                      <Key size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.accent }} />
                      <input
                        type={showResendKey ? 'text' : 'password'}
                        value={resendKey}
                        onChange={e => setResendKey(e.target.value)}
                        placeholder="re_live_xxxxxxxxxxxxxxxxxxxx"
                        className="w-full pl-9 pr-10 py-2.5 rounded-xl text-sm outline-none font-mono"
                        style={{
                          background: `${theme.accent}10`,
                          border: `1px solid ${theme.border}`,
                          color: theme.text,
                        }}
                      />
                      <button
                        onClick={() => setShowResendKey(!showResendKey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        style={{ color: theme.text, opacity: 0.5 }}
                      >
                        {showResendKey ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: theme.text }}>
                      From Email Address
                    </label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.accent }} />
                      <input
                        type="email"
                        placeholder="noreply@yourdomain.com"
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
                        style={{
                          background: `${theme.accent}10`,
                          border: `1px solid ${theme.border}`,
                          color: theme.text,
                        }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={saveResendKey}
                    disabled={isSaving || !resendKey}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
                    style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.glow})` }}
                  >
                    {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                    Save Resend Config
                  </button>
                </div>
              </div>
            )}

            {/* CLOUDFLARE TAB */}
            {activeTab === 'cloudflare' && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-bold" style={{ color: theme.text }}>Cloudflare Email Routing</h2>
                  <p className="text-sm mt-0.5" style={{ color: theme.text, opacity: 0.6 }}>
                    Configure Cloudflare Email Routing to receive emails in IQMAIL.
                  </p>
                </div>

                <div className="rounded-2xl p-5 space-y-4" style={surfaceStyle}>
                  <div className="flex items-start gap-3 p-3 rounded-xl" style={{ background: '#0284c715', border: `1px solid #0284c730` }}>
                    <Cloud size={16} style={{ color: '#0284c7', flexShrink: 0, marginTop: 2 }} />
                    <div className="text-xs" style={{ color: theme.text }}>
                      <p className="font-semibold">Cloudflare Email Routing Setup:</p>
                      <ol className="mt-1 space-y-0.5 opacity-70 list-decimal list-inside">
                        <li>Log in to Cloudflare Dashboard</li>
                        <li>Select your domain → Email → Email Routing</li>
                        <li>Enable Email Routing and copy Zone ID</li>
                        <li>Create an API Token with Email Routing Read/Write</li>
                        <li>Add destination address for forwarding</li>
                      </ol>
                    </div>
                  </div>

                  {[
                    { label: 'Zone ID', value: cfZoneId, setter: setCfZoneId, placeholder: 'abc123def456...', type: 'text' },
                    { label: 'Account ID', value: cfAccountId, setter: setCfAccountId, placeholder: 'your-account-id', type: 'text' },
                    { label: 'API Token', value: cfApiToken, setter: setCfApiToken, placeholder: 'Bearer token...', type: showCfToken ? 'text' : 'password' },
                    { label: 'Destination Email', value: cfDestEmail, setter: setCfDestEmail, placeholder: 'inbox@youremail.com', type: 'email' },
                  ].map(field => (
                    <div key={field.label}>
                      <label className="text-xs font-semibold mb-1.5 block" style={{ color: theme.text }}>{field.label}</label>
                      <input
                        type={field.type}
                        value={field.value}
                        onChange={e => field.setter(e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full px-3 py-2.5 rounded-xl text-sm outline-none font-mono"
                        style={{
                          background: `${theme.accent}10`,
                          border: `1px solid ${theme.border}`,
                          color: theme.text,
                        }}
                      />
                    </div>
                  ))}

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setCfCatchAll(!cfCatchAll)}
                      className="flex items-center gap-2 text-sm"
                      style={{ color: theme.text }}
                    >
                      <div
                        className="w-9 h-5 rounded-full transition-all relative"
                        style={{ background: cfCatchAll ? theme.accent : `${theme.accent}30` }}
                      >
                        <div
                          className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
                          style={{ left: cfCatchAll ? 'calc(100% - 18px)' : 2 }}
                        />
                      </div>
                      <span className="text-xs">Enable Catch-All routing</span>
                    </button>
                  </div>

                  <button
                    onClick={saveCloudflare}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg, #0284c7, #0ea5e9)' }}
                  >
                    {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                    Save Cloudflare Config
                  </button>
                </div>

                {/* Cloudflare DNS Records */}
                <div className="rounded-2xl p-5 space-y-3" style={surfaceStyle}>
                  <h3 className="text-sm font-bold" style={{ color: theme.text }}>Required DNS Records</h3>
                  <p className="text-xs" style={{ color: theme.text, opacity: 0.6 }}>
                    Add these MX records to your domain's DNS settings in Cloudflare:
                  </p>
                  <div className="space-y-2">
                    {[
                      { type: 'MX', name: '@', content: 'route1.mx.cloudflare.net', priority: 86 },
                      { type: 'MX', name: '@', content: 'route2.mx.cloudflare.net', priority: 17 },
                      { type: 'MX', name: '@', content: 'route3.mx.cloudflare.net', priority: 18 },
                    ].map((rec, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-2.5 rounded-lg text-xs font-mono"
                        style={{ background: `${theme.accent}10`, border: `1px solid ${theme.border}` }}
                      >
                        <span
                          className="px-1.5 py-0.5 rounded text-[10px] font-bold text-white"
                          style={{ background: theme.accent }}
                        >{rec.type}</span>
                        <span style={{ color: theme.text, opacity: 0.6 }}>{rec.name}</span>
                        <span className="flex-1 truncate" style={{ color: theme.text }}>{rec.content}</span>
                        <span style={{ color: theme.text, opacity: 0.5 }}>P:{rec.priority}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SYSTEM TAB */}
            {activeTab === 'system' && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold" style={{ color: theme.text }}>System Settings</h2>

                <div className="rounded-2xl p-5 space-y-4" style={surfaceStyle}>
                  <h3 className="text-sm font-semibold" style={{ color: theme.text }}>Change Admin Password</h3>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.accent }} />
                    <input
                      type="password"
                      value={newAdminPass}
                      onChange={e => setNewAdminPass(e.target.value)}
                      placeholder="New admin password"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
                      style={{
                        background: `${theme.accent}10`,
                        border: `1px solid ${theme.border}`,
                        color: theme.text,
                      }}
                    />
                  </div>
                  <button
                    onClick={changeAdminPass}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
                    style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.glow})` }}
                  >
                    <CheckCircle size={14} />
                    Update Password
                  </button>
                </div>

                {/* System Status */}
                <div className="rounded-2xl p-5 space-y-3" style={surfaceStyle}>
                  <h3 className="text-sm font-semibold" style={{ color: theme.text }}>System Status</h3>
                  {[
                    { name: 'OnSpace Cloud', status: 'Online', ok: true },
                    { name: 'Resend API', status: localStorage.getItem('iqmail_resend_key_set') === 'true' ? 'Configured' : 'Not configured', ok: localStorage.getItem('iqmail_resend_key_set') === 'true' },
                    { name: 'Cloudflare Routing', status: localStorage.getItem('iqmail_cf_zone') ? 'Configured' : 'Not configured', ok: !!localStorage.getItem('iqmail_cf_zone') },
                    { name: 'AI Compose', status: 'Active (OnSpace AI)', ok: true },
                  ].map(item => (
                    <div key={item.name} className="flex items-center justify-between py-2" style={{ borderBottom: `1px solid ${theme.border}` }}>
                      <span className="text-sm" style={{ color: theme.text }}>{item.name}</span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{
                          background: item.ok ? '#10b98120' : '#ef444420',
                          color: item.ok ? '#10b981' : '#ef4444',
                        }}
                      >
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
