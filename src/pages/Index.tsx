import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/lib/i18n";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import EmailList from "@/components/features/EmailList";
import EmailDetail from "@/components/features/EmailDetail";
import ComposeModal from "@/components/features/ComposeModal";
import LiveBackground from "@/components/features/LiveBackground";
import BismillahHeader from "@/components/features/BismillahHeader";
import type { Email, EmailFolder } from "@/types/email";
import Login from "@/pages/Login";
import { Mail } from "lucide-react";

const Index = () => {
  const { user, isLoading, isAuthenticated, login, logout } = useAuth();
  const { theme } = useTheme();
  const { language } = useLanguage();
  const [activeFolder, setActiveFolder] = useState<EmailFolder>("inbox");
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [replyTo, setReplyTo] = useState<Email | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative" style={{ background: theme.bg }}>
        <LiveBackground />
        <div className="relative z-10 text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.glow})`, boxShadow: `0 0 32px ${theme.glow}60` }}
          >
            <span className="text-2xl font-black text-white">IQ</span>
          </div>
          <p className="text-sm" style={{ color: theme.text, opacity: 0.6 }}>{t(language, 'loading')}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <LiveBackground variant="login" />
        <Login onLogin={login} />
      </>
    );
  }

  const folderLabel: Record<EmailFolder, string> = {
    inbox: t(language, 'home'),
    sent: t(language, 'sent'),
    drafts: t(language, 'storeroom'),
    starred: t(language, 'starred'),
    spam: t(language, 'spam'),
    trash: t(language, 'trash'),
    archive: t(language, 'archive'),
  };

  const handleReply = (email: Email) => {
    setReplyTo(email);
    setIsComposing(true);
  };

  const surfaceStyle = {
    background: `${theme.surface}80`,
    backdropFilter: 'blur(16px)',
  };

  return (
    <div className="min-h-screen flex flex-col overflow-hidden" style={{ background: theme.bg }}>
      <LiveBackground />

      <div className="relative z-10 flex flex-col flex-1">
        <BismillahHeader />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            user={user!}
            activeFolder={activeFolder}
            onFolderChange={setActiveFolder}
            onLogout={logout}
            onCompose={() => { setIsComposing(true); setReplyTo(null); }}
            isMobileOpen={isSidebarOpen}
            onMobileClose={() => setIsSidebarOpen(false)}
          />

          <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
            <Header
              user={user!}
              title={folderLabel[activeFolder]}
              onMenuToggle={() => setIsSidebarOpen(true)}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />

            <main className="flex-1 flex overflow-hidden">
              {/* Email list */}
              <div
                className={`${selectedEmail ? "hidden md:flex" : "flex"} flex-col w-full md:w-80 lg:w-96 xl:w-[420px] overflow-y-auto`}
                style={{ ...surfaceStyle, borderRight: `1px solid ${theme.border}` }}
              >
                <EmailList
                  folder={activeFolder}
                  searchQuery={searchQuery}
                  selectedId={selectedEmail?.id || null}
                  onSelect={setSelectedEmail}
                />
              </div>

              {/* Email detail */}
              <div className={`${selectedEmail ? "flex" : "hidden md:flex"} flex-col flex-1 min-w-0 overflow-hidden`}
                style={surfaceStyle}
              >
                {selectedEmail ? (
                  <EmailDetail
                    email={selectedEmail}
                    onBack={() => setSelectedEmail(null)}
                    onReply={handleReply}
                  />
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
                    <div
                      className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5"
                      style={{ background: `${theme.accent}15`, border: `1px solid ${theme.border}` }}
                    >
                      <Mail size={36} style={{ color: theme.accent, opacity: 0.6 }} />
                    </div>
                    <h3 className="text-lg font-bold mb-2" style={{ color: theme.text }}>
                      {t(language, 'select_email')}
                    </h3>
                    <p className="text-sm max-w-xs" style={{ color: theme.text, opacity: 0.5 }}>
                      Choose a message from the list or compose a new one.
                    </p>
                    <button
                      onClick={() => { setIsComposing(true); setReplyTo(null); }}
                      className="mt-5 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                      style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.glow})` }}
                    >
                      ✏️ {t(language, 'compose')}
                    </button>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>

      {isComposing && (
        <ComposeModal
          onClose={() => { setIsComposing(false); setReplyTo(null); }}
          defaultTo={replyTo ? replyTo.fromEmail : ""}
          defaultSubject={replyTo ? `Re: ${replyTo.subject}` : ""}
        />
      )}
    </div>
  );
};

export default Index;
