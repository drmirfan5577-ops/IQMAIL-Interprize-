import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft } from "lucide-react";
import LiveBackground from "@/components/features/LiveBackground";
import BismillahHeader from "@/components/features/BismillahHeader";
import { useTheme } from "@/contexts/ThemeContext";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    console.error("404 Error:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: theme.bg }}>
      <LiveBackground />
      <BismillahHeader />
      <div className="flex-1 flex items-center justify-center relative z-10 px-6">
        <div className="text-center">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6"
            style={{ background: `${theme.accent}15`, border: `1px solid ${theme.border}` }}
          >
            <span className="text-4xl font-black" style={{ color: theme.accent }}>404</span>
          </div>
          <h1 className="text-3xl font-black mb-2" style={{ color: theme.text }}>Page Not Found</h1>
          <p className="mb-8 max-w-sm" style={{ color: theme.text, opacity: 0.55 }}>
            This page doesn't exist in your IQMAIL workspace.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
              style={{ background: `${theme.accent}15`, color: theme.text, border: `1px solid ${theme.border}` }}
            >
              <ArrowLeft size={15} />
              Go Back
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.glow})` }}
            >
              <Home size={15} />
              Go Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
