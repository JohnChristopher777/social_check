import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import {
  UploadCloud,
  ShieldCheck,
  FileImage,
  AlertTriangle,
  MapPin,
  Phone,
  Mail,
  Activity,
  Image as ImageIcon,
  Loader2,
  ListRestart,
  Link,
  StickyNote,
  TextSearch,
  Lock,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Check,
  LucideIcon,
  X,

} from "lucide-react";

import { cn } from "./lib/utils";
import {
  analyzeContent,
  AnalysisResult,
  Detection,
  sampleDataList,
} from "./services/ai";
import { Aura } from "./components/Aura";
import { Splash } from "./components/Splash";
import GuidelinesPage from "./components/GuidelinesPage";

ChartJS.register(ArcElement, Tooltip, Legend);

// Extracted GuidelinesPage to dedicated Component

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [view, setView] = useState<"analyzer" | "guidelines">("analyzer");

  // Form State
  const [postUrl, setPostUrl] = useState("");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  // Metadata State
  const [platform, setPlatform] = useState<string>("Instagram");
  const [isPublic, setIsPublic] = useState(true);
  const [hasLocationTag, setHasLocationTag] = useState(false);
  const [isFrequent, setIsFrequent] = useState(false);

  // UI State
  const [analyzing, setAnalyzing] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) {
      if (selectedFile.type.startsWith("image/")) {
        setFilePreview(URL.createObjectURL(selectedFile));
      } else {
        setFilePreview(null);
      }
    } else {
      setFilePreview(null);
    }
  };

  const loadSampleData = () => {
    const sample =
      sampleDataList[Math.floor(Math.random() * sampleDataList.length)];
    setPostUrl(sample.url || "");
    setText(sample.text);
    setIsPublic(sample.isPublic);
    setIsFrequent(sample.isFrequent);
    setPlatform(sample.platform || "Instagram");
    setHasLocationTag(sample.hasLocationTag || false);

    setFile(null);
    setFilePreview(sample.imageUrl || null);
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!text && !filePreview && !postUrl) return;
    setAnalyzing(true);
    setResult(null);

    const isImagePresent = !!file || !!filePreview;
    const finalResult = await analyzeContent({
      text: text || "No data provided",
      url: postUrl,
      hasImage: isImagePresent,
      isPublic,
      isFrequent,
      platform,
      hasLocationTag,
      imageFile: file,
    });

    setAnalyzing(false);
    setResult(finalResult);
  };

  const clearForm = () => {
    setPostUrl("");
    setText("");
    setFile(null);
    setFilePreview(null);
    setResult(null);
  };

  const handleScrapeFill = async () => {
    if (!postUrl) return;
    setIsScraping(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/scrape_post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: postUrl })
      });
      const data = await res.json();
      if (data.text) setText(data.text);
      if (data.image && data.image !== "null") {
          setFilePreview(data.image);
          setFile(null);
      }
      if (data.platform) setPlatform(data.platform);
    } catch{
    }
    setIsScraping(false);
  };

  if (showSplash) {
    return <Splash onComplete={() => setShowSplash(false)} />;
  }

  const platforms: { name: string; icon: LucideIcon }[] = [
    { name: "Instagram", icon: Instagram },
    { name: "Twitter", icon: Twitter },
    { name: "LinkedIn", icon: Linkedin },
    { name: "Facebook", icon: Facebook },
  ];

  return (
    <div className="relative w-full min-h-screen antialiased text-white overflow-x-hidden pt-4 pb-12 flex flex-col font-sans selection:bg-[#AD55FF]/40 bg-gradient-to-br from-[#4A00E0] via-[#0A0524] to-[#8E2DE2] bg-[length:300%_300%] animate-[floatBg_10s_ease-in-out_infinite]">
      <Aura level={result?.level} />

      {/* Main Title Bar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#07051A]/80 backdrop-blur-xl border-b border-white/10 shadow-lg">
        <div className="container max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex flex-col items-center justify-center overflow-hidden">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-[120%] h-[120%] object-contain"
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
              onClick={() => setView("guidelines")}
              className="text-sm font-bold px-3 py-1 rounded-full bg-[#AD55FF]/20 border border-[#AD55FF]/30 text-[#D9AAFF]  hover:bg-[#1DA1F2]/20 transition-all shadow-sm"
            >
              Profile Guidelines
            </button>
          </div>
        </div>
      </nav>

      <div className="h-24" />

      <div className="relative z-10 container mx-auto px-4 w-full max-w-7xl flex flex-col gap-6 lg:gap-8 flex-1">
        <main className="grid grid-cols-1 xl:grid-cols-12 gap-8 min-h-[600px]">
          {/* Input Section */}
          <section className="xl:col-span-5 flex flex-col gap-6 h-full">
            <div className="bg-[#0b061d]/90 backdrop-blur-xl rounded-2xl flex flex-col shadow-2xl h-full border border-white/10 overflow-hidden relative">
              <div className="p-6 md:p-8 flex flex-col h-full">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <StickyNote className="w-5 h-5 text-[#a9deff]" />
                    Post Data
                  </h2>
                  <button
                    onClick={loadSampleData}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-[#AD55FF]/10 text-white hover:bg-[#AD55FF]/30 transition-all border border-[#AD55FF]/20 shadow-sm"
                  >
                    <ListRestart className="w-3.5 h-3.5" />
                    Load Scenario
                  </button>
                </div>

                <div className="flex flex-col gap-5 flex-1">
                  {/* Platform Selector */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-white uppercase tracking-widest">
                      Platform
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {platforms.map((p) => (
                        <button
                          key={p.name}
                          onClick={() => setPlatform(p.name)}
                          className={cn(
                            "py-3 flex flex-col items-center gap-1.5 rounded-lg border transition-all duration-200",
                            platform === p.name
                              ? "bg-[#2E00A8]/80 border-[#AD55FF] text-white shadow-[0_0_15px_rgba(173,85,255,0.3)]"
                              : "bg-black/40 border-white/10 text-slate-300 hover:bg-white/5 hover:text-white",
                          )}
                        >
                          <p.icon className="w-5 h-5" />
                          <span className="text-[10px] font-bold">
                            {p.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* URL Input */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-1.5">
                      <Link className="w-3.5 h-3.5 text-[#1DA1F2]" /> Analyze
                      Existing Post
                    </label>
                    <div className="flex gap-2">
                      <input
                        value={postUrl}
                        onChange={(e) => setPostUrl(e.target.value)}
                        placeholder="https://instagram.com/p/..."
                        className="flex-1 bg-[#03010b] border border-white/20 rounded-lg p-3.5 text-sm text-white placeholder-slate-500 font-medium focus:outline-none focus:border-[#1DA1F2] focus:ring-1 focus:ring-[#1DA1F2]/50 transition-all shadow-inner"
                      />
                      <button 
                         onClick={handleScrapeFill}
                         disabled={isScraping || !postUrl}
                         className={cn(
                             "px-4 rounded-lg text-xs font-bold tracking-wide transition-all",
                             isScraping ? "bg-white/10 text-slate-400 cursor-not-allowed" : "bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/30 text-[#1DA1F2] border border-[#1DA1F2]/30"
                         )}>
                        {isScraping ? "Fetching..." : "Fetch post"}
                      </button>
                    </div>
                  </div>

                  {/* OR SEPARATOR */}
                  <div className="flex items-center gap-4 mt-1 opacity-60">
                    <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-1" />
                    <span className="text-[10px] font-bold text-white tracking-widest">OR Manual Input</span>
                    <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-1" />
                  </div>

                  {/* Text Input */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-white uppercase tracking-widest">
                      Post Content
                    </label>
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Paste the caption, bio, or tweet here..."
                      className="w-full h-28 bg-[#03010b] border border-white/20 rounded-lg p-3.5 text-sm text-white placeholder-slate-500 font-medium focus:outline-none focus:border-[#1DA1F2] focus:ring-1 focus:ring-[#1DA1F2]/50 transition-all resize-none shadow-inner custom-scrollbar"
                    />
                  </div>

                  {/* Media Upload & Preview */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-white uppercase tracking-widest">
                      Media Image
                    </label>
                      <div
                        onClick={() => !filePreview && fileInputRef.current?.click()}
                        className={cn(
                          "border border-dashed rounded-lg flex items-center justify-center transition-all overflow-hidden relative group duration-200 shadow-inner",
                          filePreview
                            ? "border-white/30 aspect-[21/9]"
                            : "border-white/20 h-24 bg-black/40 hover:border-[#AD55FF]/50 hover:bg-[#AD55FF]/5 cursor-pointer",
                        )}
                      >
                        <input
                          type="file"
                          className="hidden"
                          ref={fileInputRef}
                          accept="image/*"
                          onChange={handleFileChange}
                        />
  
                        {filePreview ? (
                          <>
                            <img
                              src={filePreview}
                              alt="Upload Preview"
                              className="w-full h-full object-cover"
                            />
                            {/* X Button Drop Image */}
                            <button 
                              onClick={(e) => { e.stopPropagation(); setFilePreview(null); setFile(null); }}
                              className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white p-1 rounded-full backdrop-blur transition-colors"
                            >
                              <X className="w-5 h-5" />
                            </button>
                            {file && (
                              <div className="absolute top-2 left-2 bg-black/80 px-2.5 py-1 rounded text-xs font-bold text-[#D9AAFF] max-w-[70%] truncate border border-white/10">
                                {file.name}
                              </div>
                            )}
                          </>
                        ) : (
                        <div className="flex flex-col items-center gap-1.5 p-4">
                          <UploadCloud className="w-6 h-6 text-[#1DA1F2] opacity-80" />
                          <span className="text-xs font-medium text-slate-300">
                            Click to upload image
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Context Switches */}
                  <div className="grid grid-cols-2 gap-3 mt-auto pt-2">
                    <label className="flex items-center gap-4 cursor-pointer group p-4 rounded-xl bg-[#080514] border border-white/5 hover:border-white/10 transition-all shadow-inner">
                      <input
                        type="checkbox"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                        className="peer hidden"
                      />
                      <div className="w-6 h-6 rounded-md border border-slate-700 bg-[#0A061C] peer-checked:bg-[#4800FF] peer-checked:border-[#4800FF] shadow-inner transition-all flex items-center justify-center">
                        {isPublic && <Check className="w-4 h-4 text-white" />}
                      </div>
                      <span className="text-sm font-bold text-slate-100 group-hover:text-white transition-colors">
                        Public post ? 
                      </span>
                    </label>
                    <label className="flex items-center gap-4 cursor-pointer group p-4 rounded-xl bg-[#080514] border border-white/5 hover:border-white/10 transition-all shadow-inner">
                      <input
                        type="checkbox"
                        checked={hasLocationTag}
                        onChange={(e) => setHasLocationTag(e.target.checked)}
                        className="peer hidden"
                      />
                      <div className="w-6 h-6 rounded-md border border-slate-700 bg-[#0A061C] peer-checked:bg-[#AD55FF] peer-checked:border-[#AD55FF] shadow-inner transition-all flex items-center justify-center">
                        {hasLocationTag && <Check className="w-4 h-4 text-white" />}
                      </div>
                      <span className="text-sm font-bold text-slate-100 group-hover:text-white transition-colors">
                        Location tag ?
                      </span>
                    </label>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-8 flex gap-3">
                  <button
                    onClick={clearForm}
                    disabled={analyzing || (!text && !filePreview && !postUrl)}
                    className="px-8 py-4 rounded-xl text-[12px] font-black text-red-300 hover:text-red-500 bg-[#390202] border border-transparent hover:border-white/10 transition-all disabled:opacity-30 disabled:pointer-events-none tracking-widest shadow-md"
                  >
                    Clear
                  </button>
                  <button
                    onClick={handleAnalyze}
                    disabled={analyzing || (!text && !filePreview && !postUrl)}
                    className="flex-1 px-6 py-4 rounded-xl text-[12px] font-black text-white/90 hover:text-white bg-gradient-to-r from-[#200075] via-[#2F119C] to-[#125B95] shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3 tracking-widest relative overflow-hidden group border border-[#1DA1F2]/20"
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] w-[200%] -translate-x-full group-hover:animate-shine" />
                    {analyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin text-[#1DA1F2]" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <TextSearch className="w-5 h-5 text-slate-300" /> Scan
                        Post
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Results Dashboard */}
          <section className="xl:col-span-7 h-full">
            <AnimatePresence mode="wait">
              {analyzing ? (
                <motion.div
                  key="analyzing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-[#0b061d]/90 backdrop-blur-xl rounded-2xl h-full flex flex-col items-center justify-center gap-6 min-h-[600px] border border-white/10 shadow-2xl relative overflow-hidden"
                >
                  <div className="relative flex flex-col items-center justify-center z-10 w-full px-6 text-center">
                    <Loader2 className="w-16 h-16 animate-spin text-[#1DA1F2] mb-6" />
                    <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
                      Processing Intelligence...
                    </h3>
                    <p className="text-slate-300 font-medium text-sm max-w-sm rounded-lg mb-6">
                      Evaluating threat vectors, running OPSEC validation mechanics...
                    </p>
                    
                    <div className="flex flex-col gap-3 text-left w-64 bg-black/40 p-4 rounded-xl border border-white/5">
                      {postUrl && (
                        <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-[#D9AAFF] ">
                          <Loader2 className="w-3 h-3 animate-spin text-[#AD55FF]" /> Linking URL parser...
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-[#1DA1F2] ">
                        <Loader2 className="w-3 h-3 animate-spin text-[#1DA1F2]" /> Executing NLP models...
                      </div>
                      {(filePreview || file || postUrl) && (
                        <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-[#00FF88]">
                          <Loader2 className="w-3 h-3 animate-spin text-[#00FF88]" /> Running OpenCV Heuristics...
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : result ? (
                <ResultDashboard key="result" result={result} />
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-[#0b061d]/50 border-2 border-[#1a1040] border-dashed rounded-2xl h-full flex flex-col items-center justify-center min-h-[500px] text-center p-8 relative shadow-2xl"
                >
                  <h3 className="text-3xl font-bold text-[#e2c3ff] mb-10">
                    System Ready !
                  </h3>
                  <p className="text-slate-300 font-medium text-lg max-w-md leading-relaxed relative z-10">
                    Input text, URL, or upload media on the left. The engine
                    will evaluate structural and physical security threats.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </main>
      </div>

      {view === "guidelines" && <GuidelinesPage onBack={() => setView("analyzer")} />}

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

// -----------------------------------------------------
// Result Component
// -----------------------------------------------------

function ResultDashboard({ result }: { result: AnalysisResult }) {
  // Use .includes to safely capture 'High' and 'Moderate' variants without strict equality mismatches.
  const isHighRisk = result.level.includes("High");
  const isModerate = result.level.includes("Moderate");
  const colorHex = isHighRisk ? "#FF0055" : isModerate ? "#FFD700" : "#00FF88";

  const chartData = {
    labels: ["Safe Buffer", "Exposed Attack Surface"],
    datasets: [
      {
        data: [result.score, 100 - result.score],
        backgroundColor: [colorHex, "rgba(255, 255, 255, 0.05)"],
        borderWidth: 0,
        hoverOffset: 0,
      },
    ],
  };

  const IconRenderer = ({ type }: { type: Detection["type"] }) => {
    switch (type) {
      case "phone":
        return <Phone className="w-5 h-5 text-white" />;
      case "email":
        return <Mail className="w-5 h-5 text-white" />;
      case "location":
        return <MapPin className="w-5 h-5 text-white" />;
      case "face":
        return <ImageIcon className="w-5 h-5 text-white" />;
      case "document":
        return <FileImage className="w-5 h-5 text-white" />;
      case "sensitive":
        return <Lock className="w-5 h-5 text-white" />;
      case "url":
        return <Link className="w-5 h-5 text-white" />;
      default:
        return <Activity className="w-5 h-5 text-white" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-[#0b061d]/90 backdrop-blur-xl p-6 sm:p-8 rounded-2xl h-full flex flex-col shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/10 relative overflow-hidden"
    >
      {/* Div-specific color fade matching the score */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen"
        style={{
          background: `radial-gradient(circle at 50% -20%, ${colorHex}50, transparent 70%)`,
        }}
      />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6 mb-6 shrink-0 relative z-10 w-full">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Threat Audit Result
          </h2>
          <p className="text-slate-300 text-sm mt-2 font-bold tracking-widest">
            Identified{" "}
            <strong className="text-white">{result.detections.length}</strong>{" "}
            Vulnerabilities
          </p>
        </div>

        <div
          className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 border bg-black/40 shadow-sm"
          style={{
            color: colorHex,
            borderColor: `${colorHex}50`,
          }}
        >
          {isHighRisk && <AlertTriangle className="w-4 h-4" />}
          {result.level === "Safe" && <ShieldCheck className="w-4 h-4" />}
          {result.level}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 flex-1 relative z-10 pb-2">
        {/* Meter Column (Stickyish layout on desktop) */}
        <div className="md:col-span-4 flex flex-col items-center p-6 bg-black/40 rounded-xl border border-white/5 shadow-inner">
          <div className="w-[160px] h-[160px] relative mt-2">
            <Doughnut
              data={chartData}
              options={{
                cutout: "88%",
                rotation: -90,
                circumference: 180,
                plugins: {
                  tooltip: { enabled: false },
                  legend: { display: false },
                },
                animation: {
                  animateRotate: true,
                  duration: 1500,
                  easing: "easeOutExpo",
                },
              }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-end -mt-8 pb-2">
              <span
                className="text-5xl font-black text-white"
                style={{ textShadow: `0 0 15px ${colorHex}50` }}
              >
                {result.score}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                Safety Score
              </span>
            </div>
          </div>
        </div>

        {/* Details Column */}
        <div className="md:col-span-8 flex flex-col flex-1 h-[400px] md:h-full relative z-10 w-full">
          {result.detections.length > 0 && (
            <h3 className="text-[11px] font-bold text-white uppercase tracking-widest mb-4 shrink-0 px-1 opacity-90 border-b border-white/10 pb-2">
              Vulnerability Log
            </h3>
          )}

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3 pb-2">
            {result.detections.length > 0 ? (
              result.detections.map((det: Detection, i: number) => (
                <div
                  key={i}
                  className="p-4 bg-black/50 rounded-xl border border-white/5 flex flex-col gap-3 shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-[#1DA1F2]/10 text-[#1DA1F2] border border-[#1DA1F2]/20 rounded-lg">
                      <IconRenderer type={det.type} />
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <p className="text-sm font-bold text-white">
                        {det.description}
                      </p>
                      <p className="text-xs text-slate-400 mt-1 font-mono truncate bg-white/5 px-2 py-0.5 rounded inline-block max-w-[80%]">
                        {det.match}
                      </p>
                    </div>
                    <div className="shrink-0">
                      <span className="text-[13px] font-bold text-white bg-[#FF0055]/80 px-2.5 py-1 rounded-md shadow-sm">
                        -{det.risk}
                      </span>
                    </div>
                  </div>

                  {/* Hacker Logic / Ill Effect Explanation */}
                  <div className="bg-[#AD55FF]/10 p-3.5 rounded-lg border border-[#AD55FF]/20 mt-1">
                    <p className="text-[13px] text-white leading-relaxed font-medium">
                      <span className="text-rose-400 font-bold uppercase tracking-widest text-[10px] block mb-1">
                        Impact:
                      </span>
                      {det.illEffect}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-6 bg-[#00FF88]/5 rounded-xl border border-dashed border-[#00FF88]/20 text-center">
                <ShieldCheck className="w-10 h-10 text-[#00FF88] mb-4 opacity-80" />
                <h3 className="text-lg font-bold text-white mb-2 tracking-tight">
                  Zero Threats Detected
                </h3>
                <p className="text-slate-300 text-sm max-w-sm leading-relaxed">
                  No obvious exploits or context leaks were found in this target
                  format. OPSEC intact.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SEPARATE ROW BELOW FOR SUMMARIES & ACTIONABLE REQUIREMENTS */}
      <div className="mt-8 pt-6 border-t border-white/10 shrink-0 relative z-10 w-full overflow-hidden space-y-6">
        
        {result.contentSummary && (
          <div className="bg-white/5 border border-white/10 p-4 rounded-xl shadow-inner">
            <h3 className="text-[14px] font-bold text-[#1DA1F2] tracking-wide mb-2 flex items-center gap-2">
              <FileImage className="w-4 h-4" /> Post Content Summary
            </h3>
            <p className="text-[14px] text-slate-300 font-medium leading-relaxed">
              {result.contentSummary}
            </p>
          </div>
        )}

        {result.recommendations.length > 0 && (
          <div>
            <h3 className="text-[14px] font-bold text-[#D9AAFF] tracking-wide mb-4 flex items-center gap-2 px-1">
              <Activity className="w-4 h-4" /> Actionable Requirements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.recommendations.map((rec: string, i: number) => (
                <div
                  key={i}
                  className="p-4 bg-black/40 border border-[#AD55FF]/30 rounded-xl flex items-start gap-4 shadow-inner"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-[#AD55FF] mt-[5px] shrink-0 shadow-[0_0_8px_#AD55FF]" />
                  <p className="text-[13px] font-medium text-slate-100 leading-relaxed">
                    {rec}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {result.actionableImprovements && result.actionableImprovements.length > 0 && (
          <div>
            <h3 className="text-[14px] font-bold text-[#07ba67] tracking-wide mb-4 flex items-center gap-2 px-1 mt-6">
              <Link className="w-4 h-4" /> Content Actionable Improvements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.actionableImprovements.map((imp: string, i: number) => (
                <div
                  key={i}
                  className="p-4 bg-[#00FF88]/5 border border-[#00FF88]/30 rounded-xl flex items-start gap-4 shadow-inner"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-[#00FF88] mt-[5px] shrink-0 shadow-[0_0_8px_#00FF88]" />
                  <p className="text-[13px] font-medium text-slate-100 leading-relaxed">
                    {imp}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
