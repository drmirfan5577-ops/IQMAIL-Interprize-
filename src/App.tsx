import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "@/pages/Index";
import Analytics from "@/pages/Analytics";
import Automations from "@/pages/Automations";
import Webhooks from "@/pages/Webhooks";
import Vault from "@/pages/Vault";
import Settings from "@/pages/Settings";
import Templates from "@/pages/Templates";
import AdminPanel from "@/pages/AdminPanel";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/automations" element={<Automations />} />
            <Route path="/webhooks" element={<Webhooks />} />
            <Route path="/vault" element={<Vault />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster
            position="top-right"
            toastOptions={{
              style: { borderRadius: 12, fontSize: 13 },
            }}
          />
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
