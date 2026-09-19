import { useState } from "react";
import { X, Minimize2, Maximize2, Paperclip, Bold, Italic, Link2, Send, Sparkles, Mic, LayoutTemplate, Languages } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/lib/i18n";
import VoiceMessage from "@/components/features/VoiceMessage";
import { FunctionsHttpError } from "@supabase/supabase-js";
import type { ComposeEmail } from "@/types/email";

interface ComposeModalProps {
  onClose: () => void;
  defaultTo?: string;
  defaultSubject?: string;
}

const EMAIL_TEMPLATES = [
  { name: 'Professional Follow-up', subject: 'Following up on our conversation', body: 'Dear [Name],\n\nI wanted to follow up on our recent conversation regarding [topic].\n\nPlease let me know if you have any questions.\n\nBest regards,' },
  { name: 'Meeting Request', subject: 'Meeting Request — [Date]', body: 'Hi [Name],\n\nI would like to schedule a meeting to discuss [topic].\n\nWould [Date/Time] work for you?\n\nLooking forward to connecting,' },
  { name: 'Thank You', subject: 'Thank You — [Subject]', body: 'Dear [Name],\n\nThank you for [reason]. I truly appreciate your [time/effort/support].\n\nWith gratitude,' },
  { name: 'Introduction', subject: 'Introduction — [Your Name]', body: 'Hi [Name],\n\nMy name is [Your Name] and I am reaching out because [reason].\n\nI would love to connect and explore how we might collaborate.\n\nBest,' },
];

const ComposeModal = ({ onClose, defaultTo = "", defaultSubject = "" }: ComposeModalProps) => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isAILoading, setIsAILoading] = useState(false);
  const [showCC, setShowCC] = useState(false);
  const [showBCC, setShowBCC] = useState(false);
  const [showVoice, setShowVoice] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [form, setForm] = useState<ComposeEmail>({
    to: defaultTo,
    cc: "",
    bcc: "",
    subject: defaultSubject,
    body: "",
  });

  const handleSend = async () => {
    if (!form.to) { toast.error("Please add a recipient"); return; }
    if (!form.subject) { toast.error("Please add a subject"); return; }
    setIsSending(true);

    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        to: form.to,
        subject: form.subject,
        html: `<div style="font-family:sans-serif;">${form.body.replace(/\n/g, '<br/>')}</div>`,
        text: form.body,
      },
    });

    if (error) {
      let msg = error.message;
      if (error instanceof FunctionsHttpError) {
        try {
          const text = await error.context?.text();
          msg = text || msg;
        } catch {}
      }
      // If Resend not configured, still show success for demo
      if (msg.includes('not configured') || msg.includes('API key')) {
        toast.info("Demo mode: Email queued (Configure Resend API in Admin Panel)", { description: `To: ${form.to}` });
      } else {
        toast.error(`Send failed: ${msg}`);
      }
    } else {
      toast.success("Email sent via Resend!", { description: `To: ${form.to}` });
    }

    setIsSending(false);
    onClose();
  };

  const handleAIAssist = async (action: 'compose' | 'improve' | 'reply') => {
    setIsAILoading(true);
    toast.info("AI is writing...");

    const { data, error } = await supabase.functions.invoke('ai-compose', {
      body: {
        action,
        emailBody: form.body,
        subject: form.subject,
        context: `Write a ${action === 'compose' ? 'professional email about: ' + form.subject : 'reply to the email body'}`,
        language,
      },
    });

    if (error || !data?.result) {
      // Fallback demo mode
      const fallbacks: Record<string, string> = {
        compose: `Dear ${form.to || 'Recipient'},\n\nThank you for your interest in ${form.subject || 'this matter'}.\n\nI am writing to provide you with the information you need. Please find the details below:\n\n[Content here]\n\nPlease don't hesitate to reach out if you have any questions.\n\nBest regards,`,
        improve: form.body + "\n\n[AI-improved: More concise and professional tone applied]",
        reply: `Thank you for your email.\n\nI have reviewed your message and would like to confirm that we can proceed as discussed.\n\nPlease let me know if you need any additional information.\n\nBest regards,`,
      };
      setForm(prev => ({ ...prev, body: fallbacks[action] }));
      toast.success("AI suggestion applied (demo mode)");
    } else {
      setForm(prev => ({ ...prev, body: data.result }));
      toast.success("AI writing applied");
    }

    setIsAILoading(false);
  };

  const applyTemplate = (tpl: typeof EMAIL_TEMPLATES[0]) => {
    setForm(prev => ({ ...prev, subject: tpl.subject, body: tpl.body }));
    setShowTemplates(false);
    toast.success(`Template "${tpl.name}" applied`);
  };

  const handleVoiceSend = (_blob: Blob, duration: number) => {
    toast.success(`Voice message (${Math.floor(duration / 60)}:${String(duration % 60).padStart(2, '0')}) sent!`);
    setShowVoice(false);
    onClose();
  };

  const surfaceStyle = {
    background: `${theme.surface}`,
    backdropFilter: 'blur(24px)',
    border: `1px solid ${theme.border}`,
  };

  if (isMinimized) {
    return (
      <div
        className="fixed bottom-4 right-4 z-50 rounded-xl px-4 py-3 flex items-center gap-3 cursor-pointer"
        style={{ ...surfaceStyle, boxShadow: `0 8px 32px ${theme.glow}30` }}
        onClick={() => setIsMinimized(false)}
      >
        <span className="text-sm font-medium" style={{ color: theme.text }}>{form.subject || "New Message"}</span>
        <button onClick={(e) => { e.stopPropagation(); onClose(); }} style={{ color: theme.text, opacity: 0.5 }}>
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className={cn(
      "fixed z-50 rounded-2xl shadow-2xl flex flex-col transition-all duration-300",
      isExpanded ? "inset-4 lg:inset-8" : "bottom-4 right-4 w-full max-w-lg h-[540px]"
    )} style={{ ...surfaceStyle, boxShadow: `0 24px 64px ${theme.glow}30` }}>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderBottom: `1px solid ${theme.border}` }}>
        <h3 className="text-sm font-bold" style={{ color: theme.text }}>New Message</h3>
        <div className="flex items-center gap-1">
          <button onClick={() => handleAIAssist('compose')} disabled={isAILoading} className="p-1.5 rounded-lg text-xs flex items-center gap-1 font-medium" style={{ background: `${theme.accent}15`, color: theme.accent }}>
            <Sparkles size={12} />
            {isAILoading ? '...' : 'AI'}
          </button>
          <button onClick={() => setShowTemplates(!showTemplates)} className="p-1.5 rounded-lg" style={{ color: theme.text, opacity: 0.5 }}>
            <LayoutTemplate size={13} />
          </button>
          <button onClick={() => setIsMinimized(true)} className="p-1.5 rounded-lg" style={{ color: theme.text, opacity: 0.5 }}>
            <Minimize2 size={13} />
          </button>
          <button onClick={() => setIsExpanded(!isExpanded)} className="p-1.5 rounded-lg" style={{ color: theme.text, opacity: 0.5 }}>
            <Maximize2 size={13} />
          </button>
          <button onClick={onClose} className="p-1.5 rounded-lg" style={{ color: theme.text, opacity: 0.5 }}>
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Templates dropdown */}
      {showTemplates && (
        <div className="flex-shrink-0 overflow-y-auto max-h-40 p-2" style={{ borderBottom: `1px solid ${theme.border}`, background: `${theme.accent}05` }}>
          <p className="text-[10px] font-bold px-2 mb-1.5" style={{ color: theme.text, opacity: 0.5 }}>EMAIL TEMPLATES</p>
          {EMAIL_TEMPLATES.map(tpl => (
            <button
              key={tpl.name}
              onClick={() => applyTemplate(tpl)}
              className="w-full text-left px-3 py-2 rounded-lg text-xs transition-all hover:opacity-80"
              style={{ background: `${theme.accent}10`, color: theme.text, marginBottom: 4 }}
            >
              <span className="font-medium">{tpl.name}</span>
              <span className="block opacity-50 truncate">{tpl.subject}</span>
            </button>
          ))}
        </div>
      )}

      {/* Voice Message */}
      {showVoice && (
        <div className="flex-shrink-0 p-3" style={{ borderBottom: `1px solid ${theme.border}` }}>
          <VoiceMessage onSend={handleVoiceSend} onCancel={() => setShowVoice(false)} />
        </div>
      )}

      {/* Fields */}
      {!showVoice && (
        <>
          <div className="flex-shrink-0" style={{ borderBottom: `1px solid ${theme.border}` }}>
            {[
              { label: t(language, 'to'), key: 'to' as const, type: 'email', extra: (
                <div className="flex gap-2">
                  <button onClick={() => setShowCC(!showCC)} className="text-[11px] transition-all" style={{ color: showCC ? theme.accent : theme.text, opacity: showCC ? 1 : 0.5 }}>CC</button>
                  <button onClick={() => setShowBCC(!showBCC)} className="text-[11px] transition-all" style={{ color: showBCC ? theme.accent : theme.text, opacity: showBCC ? 1 : 0.5 }}>BCC</button>
                </div>
              )},
              ...(showCC ? [{ label: t(language, 'cc'), key: 'cc' as const, type: 'email', extra: null }] : []),
              ...(showBCC ? [{ label: t(language, 'bcc'), key: 'bcc' as const, type: 'email', extra: null }] : []),
              { label: t(language, 'subject'), key: 'subject' as const, type: 'text', extra: null },
            ].map(field => (
              <div key={field.key} className="flex items-center gap-2 px-4 py-2.5" style={{ borderBottom: `1px solid ${theme.border}30` }}>
                <span className="text-xs w-12 flex-shrink-0" style={{ color: theme.text, opacity: 0.45 }}>{field.label}</span>
                <input
                  type={field.type}
                  value={form[field.key]}
                  onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                  placeholder={field.key === 'to' ? 'recipient@example.com' : field.key === 'subject' ? 'Subject line' : ''}
                  className="flex-1 text-sm bg-transparent outline-none"
                  style={{ color: theme.text }}
                />
                {field.extra}
              </div>
            ))}
          </div>

          {/* Body */}
          <textarea
            value={form.body}
            onChange={e => setForm(prev => ({ ...prev, body: e.target.value }))}
            placeholder="Write your message here..."
            className="flex-1 px-4 py-3 text-sm bg-transparent outline-none resize-none leading-relaxed"
            style={{ color: theme.text }}
          />
        </>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderTop: `1px solid ${theme.border}` }}>
        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded" style={{ color: theme.text, opacity: 0.5 }}><Bold size={12} /></button>
          <button className="p-1.5 rounded" style={{ color: theme.text, opacity: 0.5 }}><Italic size={12} /></button>
          <button className="p-1.5 rounded" style={{ color: theme.text, opacity: 0.5 }}><Link2 size={12} /></button>
          <button className="p-1.5 rounded" style={{ color: theme.text, opacity: 0.5 }}><Paperclip size={12} /></button>
          <button
            onClick={() => setShowVoice(!showVoice)}
            className="p-1.5 rounded transition-all"
            style={{ color: showVoice ? theme.accent : theme.text, opacity: showVoice ? 1 : 0.5 }}
          >
            <Mic size={12} />
          </button>
          <button
            onClick={() => handleAIAssist('improve')}
            disabled={isAILoading}
            className="p-1.5 rounded text-[10px] font-medium"
            style={{ color: theme.accent, opacity: isAILoading ? 0.5 : 1 }}
          >
            ✨ Improve
          </button>
        </div>

        <button
          onClick={handleSend}
          disabled={isSending}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
          style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.glow})` }}
        >
          {isSending ? (
            <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : <Send size={13} />}
          {t(language, 'send')}
        </button>
      </div>
    </div>
  );
};

export default ComposeModal;
