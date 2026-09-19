import { useState, useEffect, useRef } from "react";
import { Bell, X, CheckCheck, Mail, Zap, AlertTriangle } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

interface NotificationItem {
  id: string;
  type: 'email' | 'alert' | 'automation' | 'system';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  { id: '1', type: 'email', title: 'New Email', message: 'Sarah Johnson: Q4 Roadmap Review', time: '2m ago', isRead: false },
  { id: '2', type: 'email', title: 'New Email', message: 'GitHub PR #247 needs review', time: '15m ago', isRead: false },
  { id: '3', type: 'automation', title: 'Automation Ran', message: 'GitHub labels applied to 3 emails', time: '1h ago', isRead: false },
  { id: '4', type: 'alert', title: 'DataDog Alert', message: 'API latency spike resolved', time: '2h ago', isRead: true },
  { id: '5', type: 'system', title: 'IQMAIL', message: 'All systems operational', time: '3h ago', isRead: true },
];

interface NotificationCenterProps {
  onClose: () => void;
}

const iconMap = {
  email: Mail,
  alert: AlertTriangle,
  automation: Zap,
  system: Bell,
};

const NotificationCenter = ({ onClose }: NotificationCenterProps) => {
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const panelRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllRead = () => setNotifications(n => n.map(item => ({ ...item, isRead: true })));
  const dismiss = (id: string) => setNotifications(n => n.filter(item => item.id !== id));

  useEffect(() => {
    // Poll for new notifications every 30s
    const interval = setInterval(() => {
      console.log('Polling for new notifications...');
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-full mt-2 z-50 rounded-2xl overflow-hidden shadow-2xl"
      style={{
        width: 320,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${theme.border}`,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: `1px solid ${theme.border}` }}
      >
        <div className="flex items-center gap-2">
          <Bell size={15} style={{ color: theme.accent }} />
          <span className="text-sm font-bold" style={{ color: theme.text }}>Notifications</span>
          {unreadCount > 0 && (
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold text-white"
              style={{ background: theme.accent }}
            >
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={markAllRead}
            className="p-1.5 rounded-lg text-xs"
            style={{ color: theme.accent }}
          >
            <CheckCheck size={14} />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg"
            style={{ color: theme.text, opacity: 0.5 }}
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="overflow-y-auto max-h-80">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-sm" style={{ color: theme.text, opacity: 0.5 }}>
            No notifications
          </div>
        ) : (
          notifications.map(n => {
            const Icon = iconMap[n.type];
            return (
              <div
                key={n.id}
                className="flex items-start gap-3 px-4 py-3 transition-all hover:opacity-90 cursor-pointer"
                style={{
                  borderBottom: `1px solid ${theme.border}`,
                  background: n.isRead ? 'transparent' : `${theme.accent}08`,
                }}
                onClick={() => dismiss(n.id)}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: `${theme.accent}20` }}
                >
                  <Icon size={14} style={{ color: theme.accent }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold truncate" style={{ color: theme.text }}>{n.title}</p>
                    <span className="text-[10px] flex-shrink-0" style={{ color: theme.text, opacity: 0.45 }}>{n.time}</span>
                  </div>
                  <p className="text-xs mt-0.5 truncate" style={{ color: theme.text, opacity: 0.65 }}>{n.message}</p>
                </div>
                {!n.isRead && (
                  <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ background: theme.accent }} />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;
