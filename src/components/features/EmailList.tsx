import { useState } from "react";
import { Star, Paperclip, AlertCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Email, EmailFolder } from "@/types/email";
import { MOCK_EMAILS } from "@/lib/mockData";
import { formatDistanceToNow } from "@/lib/dateUtils";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/lib/i18n";

interface EmailListProps {
  folder: EmailFolder;
  searchQuery: string;
  selectedId: string | null;
  onSelect: (email: Email) => void;
}

const EmailList = ({ folder, searchQuery, selectedId, onSelect }: EmailListProps) => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const [starred, setStarred] = useState<Record<string, boolean>>(
    Object.fromEntries(MOCK_EMAILS.filter(e => e.isStarred).map(e => [e.id, true]))
  );

  const filtered = MOCK_EMAILS.filter((email) => {
    if (folder === "starred") return starred[email.id];
    if (email.folder !== folder) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      email.subject.toLowerCase().includes(q) ||
      email.from.toLowerCase().includes(q) ||
      email.preview.toLowerCase().includes(q)
    );
  });

  const toggleStar = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setStarred((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-6">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: `${theme.accent}12` }}>
          <span className="text-3xl">📭</span>
        </div>
        <p className="font-semibold" style={{ color: theme.text }}>No emails found</p>
        <p className="text-sm mt-1" style={{ color: theme.text, opacity: 0.5 }}>
          {searchQuery ? `No results for "${searchQuery}"` : t(language, 'inbox_empty')}
        </p>
      </div>
    );
  }

  return (
    <div>
      {filtered.map((email, idx) => (
        <div
          key={email.id}
          onClick={() => onSelect(email)}
          className="flex items-start gap-3 px-4 py-3.5 cursor-pointer group transition-all"
          style={{
            background: selectedId === email.id ? `${theme.accent}12` : 'transparent',
            borderLeft: selectedId === email.id ? `3px solid ${theme.accent}` : '3px solid transparent',
            borderBottom: `1px solid ${theme.border}`,
            animationDelay: `${idx * 30}ms`,
          }}
        >
          {/* Avatar */}
          <div className="relative flex-shrink-0 mt-0.5">
            {email.fromAvatar ? (
              <img
                src={email.fromAvatar}
                alt={email.from}
                className="w-9 h-9 rounded-full object-cover"
                style={{ border: `1px solid ${theme.border}` }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(email.from)}&background=random&size=40`;
                }}
              />
            ) : (
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: `${theme.accent}25` }}
              >
                <span className="text-sm font-bold" style={{ color: theme.accent }}>{email.from[0]}</span>
              </div>
            )}
            {!email.isRead && (
              <span
                className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
                style={{ background: theme.accent, borderColor: theme.bg }}
              />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-0.5">
              <span className="text-sm truncate" style={{ color: theme.text, fontWeight: email.isRead ? 400 : 700 }}>
                {email.from}
              </span>
              <span className="text-[11px] whitespace-nowrap" style={{ color: theme.text, opacity: 0.45 }}>
                {formatDistanceToNow(email.timestamp)}
              </span>
            </div>
            <p className="text-xs truncate mb-1" style={{ color: theme.text, opacity: email.isRead ? 0.55 : 0.85, fontWeight: email.isRead ? 400 : 500 }}>
              {email.subject}
            </p>
            <div className="flex items-center gap-2">
              <p className="text-[11px] truncate flex-1" style={{ color: theme.text, opacity: 0.4 }}>
                {email.preview}
              </p>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {email.hasAttachments && <Paperclip size={11} style={{ color: theme.text, opacity: 0.4 }} />}
                {email.priority === 'high' && <AlertCircle size={11} style={{ color: '#ef4444' }} />}
                {email.labels.slice(0, 1).map(label => (
                  <span
                    key={label}
                    className="text-[10px] px-1.5 py-0.5 rounded-full"
                    style={{ background: `${theme.accent}15`, color: theme.accent }}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Star */}
          <button
            onClick={(e) => toggleStar(e, email.id)}
            className="flex-shrink-0 mt-1 p-0.5 rounded opacity-0 group-hover:opacity-100 transition-all"
            style={{ color: starred[email.id] ? '#f59e0b' : theme.text, opacity: starred[email.id] ? 1 : undefined }}
          >
            <Star size={14} fill={starred[email.id] ? "currentColor" : "none"} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default EmailList;
