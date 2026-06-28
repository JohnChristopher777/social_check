import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  Loader2,
  ListRestart,
  Link,
  StickyNote,
  TextSearch,
  Check,
  X,
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
  LucideIcon,
} from "lucide-react";
import { cn } from "../lib/utils";
import {
  analyzeContent,
  AnalysisResult,
  sampleDataList,
  getApiUrl,
} from "../services/ai";
import { useAuth } from "../contexts/AuthContext";
import { saveAnalysisToHistory } from "../lib/db";
import { ResultDashboard } from "./ResultDashboard";

interface HomeProps {
  onScanComplete: (level: 'Safe' | 'Moderate Risk' | 'High Risk' | undefined) => void;
}

export function Home({ onScanComplete }: HomeProps) {
  const { currentUser } = useAuth();

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

  const detectPlatformFromUrl = (url: string) => {
    const domain = url.toLowerCase();
    if (domain.includes("instagram")) return "Instagram";
    if (domain.includes("twitter") || domain.includes("x.com")) return "Twitter";
    if (domain.includes("linkedin")) return "LinkedIn";
    if (domain.includes("facebook") || domain.includes("fb.com")) return "Facebook";
    return null;
  };

  const handleUrlChange = (val: string) => {
    setPostUrl(val);
    const detected = detectPlatformFromUrl(val);
    if (detected) {
      setPlatform(detected);
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
    onScanComplete(undefined);
  };

  const handleAnalyze = async () => {
    if (!text && !filePreview && !postUrl) return;
    setAnalyzing(true);
    setResult(null);
    onScanComplete(undefined);

    let uploadFile = file;
    // Convert preview URL to a File object if needed
    if (!uploadFile && filePreview && filePreview.startsWith("http")) {
      try {
        const response = await fetch(filePreview);
        const blob = await response.blob();
        uploadFile = new File([blob], "auto_filled_image.jpg", { type: blob.type || "image/jpeg" });
      } catch (err) {
        console.warn("Could not fetch remote image for AI analysis:", err);
      }
    }

    const isImagePresent = !!uploadFile || !!filePreview;

    try {
      const finalResult = await analyzeContent({
        text: text || "No data provided",
        url: postUrl,
        hasImage: isImagePresent,
        isPublic,
        isFrequent,
        platform,
        hasLocationTag,
        imageFile: uploadFile,
      });

      setResult(finalResult);
      onScanComplete(finalResult.level);

      // Save to Firestore
      if (currentUser) {
        saveAnalysisToHistory(
           currentUser.uid,
           text || "No text provided",
           platform,
           finalScoreCalculation(finalResult),
           finalResult
        ).catch(dbError => {
           console.error("Failed to save to Firestore (Check Firebase Rules):", dbError);
        });
      }
    } catch (error) {
      console.error("Analysis engine failed:", error);
    } finally {
      setAnalyzing(false);
    }
  };

  const finalScoreCalculation = (res: AnalysisResult) => {
      let score = 100;
      res.detections.forEach(d => score -= d.risk);
      return score;
  };

  const clearForm = () => {
    setPostUrl("");
    setText("");
    setFile(null);
    setFilePreview(null);
    setResult(null);
    onScanComplete(undefined);
  };

  const handleScrapeFill = async () => {
    if (!postUrl) return;
    setIsScraping(true);
    try {
      const apiUrl = await getApiUrl();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(`${apiUrl}/api/scrape_post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: postUrl }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      const data = await res.json();
      if (data.text) setText(data.text);
      if (data.image && data.image !== "null") {
          setFilePreview(data.image);
          setFile(null);
      }
      if (data.platform) setPlatform(data.platform);
    } catch {
    }
    setIsScraping(false);
  };

  const platforms: { name: string; icon: LucideIcon }[] = [
    { name: "Instagram", icon: Instagram },
    { name: "Twitter", icon: Twitter },
    { name: "LinkedIn", icon: Linkedin },
    { name: "Facebook", icon: Facebook },
  ];

  return (
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
                      onChange={(e) => handleUrlChange(e.target.value)}
                      placeholder="https://instagram.com/p/..."
                      className="flex-1 bg-[#03010b] border border-white/20 rounded-lg p-3.5 text-sm text-white placeholder-slate-500 font-medium focus:outline-none focus:border-[#1DA1F2] focus:ring-1 focus:ring-[#1DA1F2]/50 transition-all shadow-inner"
                    />
                    <button
                      onClick={handleScrapeFill}
                      disabled={isScraping || !postUrl}
                      className={cn(
                        "px-4 rounded-lg text-xs font-bold tracking-wide transition-all",
                        isScraping ? "bg-white/10 text-slate-400 cursor-not-allowed" : "bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/30 text-[#1DA1F2] border border-[#1DA1F2]/30"
                      )}
                    >
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
                  className="px-8 py-4 rounded-xl text-[12px] font-black text-red-300 hover:text-red-500 bg-[#390202] border border-transparent hover:border-white/10 transition-all disabled:opacity-30 disabled:pointer-events-none tracking-wide shadow-md"
                >
                  Clear
                </button>
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing || (!text && !filePreview && !postUrl)}
                  className="flex-1 px-6 py-4 rounded-xl text-[12px] font-black text-white/90 hover:text-white bg-gradient-to-r from-[#200075] via-[#2F119C] to-[#125B95] shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3 tracking-wide relative overflow-hidden group border border-[#1DA1F2]/20"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] w-[200%] -translate-x-full group-hover:animate-shine" />
                  {analyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-[#1DA1F2]" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <TextSearch className="w-5 h-5 text-slate-50" /> Scan Post
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
  );
}
