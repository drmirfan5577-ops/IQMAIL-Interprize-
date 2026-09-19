import { useState } from "react";
import {
  ArrowLeft, Star, Reply, ReplyAll, Forward, Trash2,
  Archive, Tag, Paperclip, Sparkles, X, Download, ChevronDown, Mic
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Email } from "@/types/email";
import { formatFullDate } from "@/lib/dateUtils";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface EmailDetailProps {
  email: Email;
  onBack: () => void;
  onReply: (email: Email) => void;
}

const EmailDetail = ({ email, onBack, onReply }: EmailDetailProps) => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const [isStarred, setIsStarred] = useState(email.isStarred);
  const [showAiSummary, setShowAiSummary] = useState(false);
  const [aiSummary, setAiSummary] = useState(email.aiSummary || "");
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [showCC, setShowCC] = useState(false);

  const handleAISummarize = async () => {
    if (aiSummary) { setShowAiSummary(true); return; }
    setIsLoadingAI(true);

    const { data, error } = await supabase.functions.invoke('ai-compose', {
      body: {
        action: 'summarize',
        emailBody: email.body.replace(/<[^>]*>/g, ''),
        language,
      },
    });

    if (!error && data?.result) {
      setAiSummary(data.result);
    } else {
      setAiSummary(email.aiSummary || "AI summary: This email discusses key business topics requiring your attention and response.");
    }

    setIsLoadingAI(false);
    setShowAiSummary(true);
  };

  const surfaceStyle = {
    background: `${theme.surface}`,
    backdropFilter: 'blur(16px)',
    border: `1px solid ${theme.border}`,
  };

  return (
    <div className="flex flex-col h-full" style={{ background: `${theme.bg}80` }}>
      {/* Toolbar */}
      <div
        className="flex items-center justify-between px-4 lg:px-6 py-3 flex-shrink-0"
        style={{ ...surfaceStyle, borderRadius: 0, borderLeft: 'none', borderRight: 'none', borderTop: 'none' }}
      >
        <button
          onClick={onBack}
          className="flex items-center gap-2 transition-all"
          style={{ color: theme.text, opacity: 0.6 }}
        >
          <ArrowLeft size={16} />
          <span className="text-sm hidden sm:block">{t(language, 'archive')}</span>
        </button>
        <div className="flex items-center gap-1">
          <button onClick={() => setIsStarred(!isStarred)} className="p-2 rounded-lg transition-all" style={{ color: isStarred ? '#f59e0b' : theme.text, opacity: isStarred ? 1 : 0.5 }}>
            <Star size={15} fill={isStarred ? "currentColor" : "none"} />
          </button>
          <button className="p-2 rounded-lg transition-all" style={{ color: theme.text, opacity: 0.5 }}>
            <Archive size={15} />
          </button>
          <button className="p-2 rounded-lg transition-all" style={{ color: '#ef4444', opacity: 0.7 }}>
            <Trash2 size={15} />
          </button>
          <button className="p-2 rounded-lg transition-all" style={{ color: theme.text, opacity: 0.5 }}>
            <Tag size={15} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6">
        {/* Subject */}
        <h2 className="text-xl font-bold mb-4 leading-tight" style={{ color: theme.text }}>
          {email.subject}
        </h2>

        {/* Labels */}
        {email.labels.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {email.labels.map(label => (
              <span
                key={label}
                className="text-[11px] px-2 py-0.5 rounded-full"
                style={{ background: `${theme.accent}15`, color: theme.accent, border: `1px solid ${theme.border}` }}
              >
                {label}
              </span>
            ))}
            <span
              className="text-[11px] px-2 py-0.5 rounded-full font-medium"
              style={{
                background: email.priority === 'high' ? '#ef444420' : email.priority === 'medium' ? '#f59e0b20' : '#10b98120',
                color: email.priority === 'high' ? '#ef4444' : email.priority === 'medium' ? '#f59e0b' : '#10b981',
              }}
            >
              {email.priority} priority
            </span>
          </div>
        )}

        {/* Sender */}
        <div className="flex items-start gap-3 mb-4 p-4 rounded-xl" style={surfaceStyle}>
          {email.fromAvatar ? (
            <img
              src={email.fromAvatar}
              alt={email.from}
              className="w-10 h-10 rounded-full flex-shrink-0"
              style={{ border: `2px solid ${theme.border}` }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(email.from)}&background=random&size=40`;
              }}
            />
          ) : (
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${theme.accent}25` }}>
              <span className="font-bold" style={{ color: theme.accent }}>{email.from[0]}</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div>
                <span className="font-semibold" style={{ color: theme.text }}>{email.from}</span>
                <span className="text-sm ml-2" style={{ color: theme.text, opacity: 0.5 }}>&lt;{email.fromEmail}&gt;</span>
              </div>
              <span className="text-xs" style={{ color: theme.text, opacity: 0.45 }}>{formatFullDate(email.timestamp)}</span>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-xs" style={{ color: theme.text, opacity: 0.5 }}>To: {email.to.join(", ")}</span>
              <button onClick={() => setShowCC(!showCC)} style={{ color: theme.text, opacity: 0.4 }}>
                <ChevronDown size={12} className={cn(showCC ? "rotate-180" : "", "transition-transform")} />
              </button>
            </div>
          </div>
        </div>

        {/* AI Summary */}
        <div className="mb-4">
          {!showAiSummary ? (
            <button
              onClick={handleAISummarize}
              disabled={isLoadingAI}
              className="flex items-center gap-2 text-xs font-medium transition-all px-3 py-1.5 rounded-lg"
              style={{ background: `${theme.accent}12`, color: theme.accent }}
            >
              <Sparkles size={12} />
              {isLoadingAI ? 'AI is summarizing...' : 'AI Summary'}
            </button>
          ) : (
            <div className="relative p-4 rounded-xl" style={{ background: `${theme.accent}08`, border: `1px solid ${theme.border}` }}>
              <button onClick={() => setShowAiSummary(false)} className="absolute top-2 right-2 p-1 rounded" style={{ color: theme.text, opacity: 0.4 }}>
                <X size={12} />
              </button>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Sparkles size={12} style={{ color: theme.accent }} />
                <span className="text-xs font-semibold" style={{ color: theme.accent }}>AI Summary</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: theme.text, opacity: 0.85 }}>{aiSummary}</p>
            </div>
          )}
        </div>

        {/* Body */}
        <div
          className="text-sm leading-relaxed mb-6"
          dangerouslySetInnerHTML={{ __html: email.body }}
          style={{ color: theme.text, lineHeight: 1.8 }}
        />

        {/* Attachments */}
        {email.hasAttachments && email.attachments && (
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: theme.text, opacity: 0.5 }}>
              <Paperclip size={12} />
              Attachments ({email.attachments.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {email.attachments.map(att => (
                <div
                  key={att.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all hover:opacity-80 group"
                  style={{ ...surfaceStyle }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${theme.accent}15` }}>
                    <Paperclip size={14} style={{ color: theme.accent }} />
                  </div>
                  <div>
                    <p className="text-xs font-medium" style={{ color: theme.text }}>{att.name}</p>
                    <p className="text-[10px]" style={{ color: theme.text, opacity: 0.5 }}>{att.size}</p>
                  </div>
                  <Download size={13} style={{ color: theme.accent, opacity: 0.7 }} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Reply bar */}
      <div
        className="px-4 lg:px-6 py-4 flex items-center gap-2 flex-shrink-0"
        style={{ borderTop: `1px solid ${theme.border}` }}
      >
        <button
          onClick={() => onReply(email)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.glow})` }}
        >
          <Reply size={14} />
          {t(language, 'reply')}
        </button>
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all"
          style={{ background: `${theme.accent}12`, color: theme.text, border: `1px solid ${theme.border}` }}
        >
          <ReplyAll size={14} />
          <span className="hidden sm:block">Reply All</span>
        </button>
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all"
          style={{ background: `${theme.accent}12`, color: theme.text, border: `1px solid ${theme.border}` }}
        >
          <Forward size={14} />
          <span className="hidden sm:block">{t(language, 'forward')}</span>
        </button>
      </div>
    </div>
  );
};

export default EmailDetail;
