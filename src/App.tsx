import { useState } from "react";
import { Aura } from "./components/Aura";
import { Splash } from "./components/Splash";
import GuidelinesPage from "./components/GuidelinesPage";
import DocumentCharts from "./components/DocumentCharts";
import { Home } from "./components/Home";
import { AuthModal } from "./components/AuthModal";
import { Profile } from "./components/Profile";
import { useAuth } from "./contexts/AuthContext";
import { User } from "lucide-react";

export default function App() {
  const { currentUser } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [view, setView] = useState<"analyzer" | "guidelines" | "charts" | "profile">("analyzer");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [auraLevel, setAuraLevel] = useState<'Safe' | 'Moderate Risk' | 'High Risk' | undefined>(undefined);

  if (showSplash) {
    return <Splash onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div className="relative w-full min-h-screen antialiased text-white overflow-x-hidden pt-4 pb-12 flex flex-col font-sans selection:bg-[#AD55FF]/40 bg-gradient-to-br from-[#4A00E0] via-[#0A0524] to-[#8E2DE2] bg-[length:300%_300%] animate-[floatBg_10s_ease-in-out_infinite]">
      <Aura level={auraLevel} />

      {/* Main Title Bar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#07051A]/80 backdrop-blur-xl border-b border-white/10 shadow-lg">
        <div className="container max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Social Check click routes to Home */}
          <div 
            onClick={() => setView("analyzer")}
            className="flex items-center gap-3 cursor-pointer group hover:opacity-90 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg flex flex-col items-center justify-center overflow-hidden">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-[120%] h-[120%] object-contain group-hover:scale-105 transition-transform"
              />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Social Check{" "}
              <span className="hidden sm:inline bg-clip-text text-transparent bg-gradient-to-r from-[#1DA1F2] to-[#AD55FF] font-medium text-lg">
                | Exposure Analysis
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setView("charts")}
              className="hidden sm:block text-sm font-bold px-3 py-1 rounded-full bg-[#1DA1F2]/20 border border-[#1DA1F2]/30 text-[#a9deff] hover:bg-[#1DA1F2]/40 transition-all shadow-sm"
            >
              Visualizations
            </button>
            <button 
              onClick={() => setView("guidelines")}
              className="text-sm font-bold px-3 py-1 rounded-full bg-[#AD55FF]/20 border border-[#AD55FF]/30 text-[#D9AAFF] hover:bg-[#AD55FF]/40 transition-all shadow-sm"
            >
              Guidelines
            </button>
            {currentUser ? (
              <button 
                onClick={() => setView("profile")}
                className="text-sm font-bold px-3 py-1 flex items-center gap-1.5 rounded-full bg-[#00FF88]/20 border border-[#00FF88]/30 text-[#00FF88] hover:bg-[#00FF88]/40 transition-all shadow-sm"
              >
                <User className="w-4 h-4" /> Profile
              </button>
            ) : (
              <button 
                onClick={() => setIsAuthModalOpen(true)}
               className="text-sm font-bold px-3 py-1 rounded-full bg-yellow-400/20 border border-yellow-400/30 text-yellow-200 backdrop-blur-md hover:bg-yellow-400/40 transition-all shadow-sm"
              >
                <User size={20} />
              </button>
            )}
          </div>
        </div>
      </nav>

      <div className="h-24" />

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {view === "analyzer" && <Home onScanComplete={setAuraLevel} />}
      {view === "guidelines" && <GuidelinesPage onBack={() => setView("analyzer")} />}
      {view === "charts" && <DocumentCharts onBack={() => setView("analyzer")} />}
      {view === "profile" && <div className="container mx-auto px-4"><Profile onBack={() => setView("analyzer")} /></div>}

      <style>{`
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #1DA1F2 0%, #AD55FF 100%); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: linear-gradient(180deg, #3FA8F2 0%, #BD65FF 100%); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        @keyframes shine { 100% { transform: translateX(100%); } }
        @keyframes floatBg { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
      `}</style>
    </div>
  );
}
