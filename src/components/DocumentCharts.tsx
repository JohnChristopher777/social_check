import React, { useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
} from "recharts";
import { toPng } from "html-to-image";
import {
  Download,
  Scan,
  ShieldAlert,
  CheckCircle,
  AlertTriangle,
  UploadCloud,
  FileText,
} from "lucide-react";

export default function DocumentCharts({ onBack }: { onBack?: () => void }) {
  const chartRefs = {
    fig61: useRef<HTMLDivElement>(null),
    fig62: useRef<HTMLDivElement>(null),
    fig63: useRef<HTMLDivElement>(null),
    fig64: useRef<HTMLDivElement>(null),
    fig65: useRef<HTMLDivElement>(null),
    fig66: useRef<HTMLDivElement>(null),
    fig67: useRef<HTMLDivElement>(null),
    fig68: useRef<HTMLDivElement>(null),
  };

  const downloadImage = async (
    ref: React.RefObject<HTMLDivElement>,
    filename: string
  ) => {
    if (!ref.current) return;
    try {
      const dataUrl = await toPng(ref.current, {
        quality: 1,
        backgroundColor: "#0A0524", // Match app background
      });
      const link = document.createElement("a");
      link.download = filename;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to download image", err);
    }
  };

  const data61 = [
    { name: "Safe", count: 85, fill: "#00FF88" },
    { name: "Moderate", count: 32, fill: "#FFD700" },
    { name: "High", count: 14, fill: "#FF0055" },
  ];

  const data62 = [
    { metric: "Accuracy", value: 92, fill: "#1DA1F2" },
    { metric: "Precision", value: 89, fill: "#AD55FF" },
    { metric: "Recall", value: 94, fill: "#00FF88" },
    { metric: "F1 Score", value: 91, fill: "#FFD700" },
  ];

  const data63 = [
    { sample: "Batch 1", score: 0.72 },
    { sample: "Batch 2", score: 0.85 },
    { sample: "Batch 3", score: 0.93 },
    { sample: "Batch 4", score: 0.95 },
    { sample: "Batch 5", score: 0.98 },
  ];

  const data64 = [
    { platform: "Instagram", exposure: 85, fill: "#E1306C" },
    { platform: "Facebook", exposure: 65, fill: "#1877F2" },
    { platform: "LinkedIn", exposure: 25, fill: "#0A66C2" },
    { platform: "X/Twitter", exposure: 75, fill: "#1DA1F2" },
  ];

  return (
    <div className="w-full text-white pb-24 relative z-10 pt-4 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Document Visualizations</h1>
            <p className="text-slate-300">
              For academic/research paper export.
            </p>
          </div>
          <div className="flex gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 font-bold transition-all"
              >
                Back to App
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12">
          {/* 6.1 Risk Score Distribution */}
          <div className="bg-[#0b061d]/90 p-8 rounded-2xl border border-white/10 shadow-2xl relative">
            <button
              onClick={() => downloadImage(chartRefs.fig61, "6.1.png")}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <Download className="w-5 h-5" />
            </button>
            <div ref={chartRefs.fig61} className="p-6 bg-[#0b061d]">
              <h2 className="text-xl font-bold mb-6 text-center">
                Figure 6.1: Risk Score Distribution
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data61}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                    <XAxis dataKey="name" stroke="#fff" />
                    <YAxis stroke="#fff" />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: "#0A0524",
                        borderColor: "#ffffff20",
                        color: "#fff",
                      }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {data61.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* 6.2 Threat Detection Accuracy */}
          <div className="bg-[#0b061d]/90 p-8 rounded-2xl border border-white/10 shadow-2xl relative">
            <button
              onClick={() => downloadImage(chartRefs.fig62, "6.2.png")}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <Download className="w-5 h-5" />
            </button>
            <div ref={chartRefs.fig62} className="p-6 bg-[#0b061d]">
              <h2 className="text-xl font-bold mb-6 text-center">
                Figure 6.2: Threat Detection Accuracy
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data62} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                    <XAxis type="number" domain={[0, 100]} stroke="#fff" />
                    <YAxis dataKey="metric" type="category" stroke="#fff" />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: "#0A0524",
                        borderColor: "#ffffff20",
                        color: "#fff",
                      }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {data62.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* 6.3 Confidence Score Analysis */}
          <div className="bg-[#0b061d]/90 p-8 rounded-2xl border border-white/10 shadow-2xl relative">
            <button
              onClick={() => downloadImage(chartRefs.fig63, "6.3.png")}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <Download className="w-5 h-5" />
            </button>
            <div ref={chartRefs.fig63} className="p-6 bg-[#0b061d]">
              <h2 className="text-xl font-bold mb-6 text-center">
                Figure 6.3: Confidence Score Analysis
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data63}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                    <XAxis dataKey="sample" stroke="#fff" />
                    <YAxis domain={[0, 1]} stroke="#fff" />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: "#0A0524",
                        borderColor: "#ffffff20",
                        color: "#fff",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#00FF88"
                      strokeWidth={3}
                      dot={{ r: 6, fill: "#0A0524", stroke: "#00FF88", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* 6.4 Platform-wise Exposure Analysis */}
          <div className="bg-[#0b061d]/90 p-8 rounded-2xl border border-white/10 shadow-2xl relative">
            <button
              onClick={() => downloadImage(chartRefs.fig64, "6.4.png")}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <Download className="w-5 h-5" />
            </button>
            <div ref={chartRefs.fig64} className="p-6 bg-[#0b061d]">
              <h2 className="text-xl font-bold mb-6 text-center">
                Figure 6.4: Platform-wise Exposure Analysis
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data64}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                    <XAxis dataKey="platform" stroke="#fff" />
                    <YAxis stroke="#fff" />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: "#0A0524",
                        borderColor: "#ffffff20",
                        color: "#fff",
                      }}
                    />
                    <Bar dataKey="exposure" radius={[4, 4, 0, 0]}>
                      {data64.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* 6.5 OCR Detection Output Sample (UI Mockup) */}
          <div className="bg-[#0b061d]/90 p-8 rounded-2xl border border-white/10 shadow-2xl relative">
            <button
              onClick={() => downloadImage(chartRefs.fig65, "6.5.png")}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <Download className="w-5 h-5" />
            </button>
            <div ref={chartRefs.fig65} className="p-6 bg-[#0b061d]">
              <h2 className="text-xl font-bold mb-6 text-center">
                Figure 6.5: OCR Detection Output Sample
              </h2>
              <div className="flex flex-col md:flex-row bg-black/50 p-6 rounded-xl border border-white/20 gap-6">
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-slate-400 mb-3 flex items-center gap-2">
                    <UploadCloud className="w-4 h-4" /> Uploaded Image
                  </h3>
                  <div className="bg-[#0A0524] rounded-lg aspect-video flex items-center justify-center relative overflow-hidden border border-white/10">
                    <img
                      src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=600&q=80"
                      alt="Card"
                      className="opacity-40 blur-[2px] w-full h-full object-cover"
                      crossOrigin="anonymous"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30">
                      <Scan className="w-12 h-12 text-[#1DA1F2] mb-3 drop-shadow-[0_0_10px_#1DA1F2]" />
                      <div className="absolute top-1/4 left-1/4 right-1/4 h-8 border-2 border-[#00FF88] rounded animate-pulse" />
                      <div className="absolute bottom-1/4 left-1/4 right-1/3 h-6 border-2 border-[#FF0055] rounded animate-pulse" />
                      <span className="text-white font-bold tracking-widest text-sm bg-black/50 px-3 py-1 rounded">
                        AI VISION ACTIVE
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 flex flex-col">
                  <h3 className="text-sm font-bold text-[#00FF88] mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Extracted Sensitive Data
                  </h3>
                  <div className="space-y-3 flex-1 bg-black/40 p-4 rounded-lg border border-white/5">
                    <div className="bg-[#FF0055]/10 border border-[#FF0055]/30 p-3 rounded-lg flex items-start gap-3">
                      <ShieldAlert className="w-5 h-5 text-[#FF0055] shrink-0" />
                      <div>
                        <div className="text-[#FF0055] font-bold text-sm mb-1">
                          Credit Card Number
                        </div>
                        <div className="text-white font-mono text-xs bg-black/50 px-2 py-1 rounded inline-block">
                          **** **** **** 4124
                        </div>
                      </div>
                    </div>
                    <div className="bg-[#FFD700]/10 border border-[#FFD700]/30 p-3 rounded-lg flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-[#FFD700] shrink-0" />
                      <div>
                        <div className="text-[#FFD700] font-bold text-sm mb-1">
                          Full Name
                        </div>
                        <div className="text-white font-mono text-xs bg-black/50 px-2 py-1 rounded inline-block">
                          ALEXANDER DOE
                        </div>
                      </div>
                    </div>
                    <div className="bg-[#FF0055]/10 border border-[#FF0055]/30 p-3 rounded-lg flex items-start gap-3">
                      <ShieldAlert className="w-5 h-5 text-[#FF0055] shrink-0" />
                      <div>
                        <div className="text-[#FF0055] font-bold text-sm mb-1">
                          Expiry Date
                        </div>
                        <div className="text-white font-mono text-xs bg-black/50 px-2 py-1 rounded inline-block">
                          12/26
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 6.6 Risk Classification Confusion Matrix */}
          <div className="bg-[#0b061d]/90 p-8 rounded-2xl border border-white/10 shadow-2xl relative">
            <button
              onClick={() => downloadImage(chartRefs.fig66, "6.6.png")}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <Download className="w-5 h-5" />
            </button>
            <div ref={chartRefs.fig66} className="p-6 bg-[#0b061d]">
              <h2 className="text-xl font-bold mb-6 text-center">
                Figure 6.6: Risk Classification – Confusion Matrix
              </h2>
              <div className="max-w-md mx-auto relative pt-8 pl-8">
                {/* Labels */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 text-sm font-bold text-slate-400">
                  Predicted Class
                </div>
                <div className="absolute top-1/2 left-0 -translate-y-1/2 -rotate-90 origin-left text-sm font-bold text-slate-400">
                  Actual Class
                </div>
                {/* Grid */}
                <div className="grid grid-cols-2 gap-2 text-center text-lg">
                  <div className="aspect-square bg-[#00FF88]/20 flex flex-col items-center justify-center border-2 border-[#00FF88]/50 rounded-tl-xl text-[#00FF88]">
                    <span className="font-black text-3xl">850</span>
                    <span className="text-sm font-bold mt-1">True Negative (TN)</span>
                  </div>
                  <div className="aspect-square bg-[#FF0055]/20 flex flex-col items-center justify-center border-2 border-[#FF0055]/50 rounded-tr-xl text-[#FF0055]">
                    <span className="font-black text-3xl">42</span>
                    <span className="text-sm font-bold mt-1">False Positive (FP)</span>
                  </div>
                  <div className="aspect-square bg-[#FFD700]/20 flex flex-col items-center justify-center border-2 border-[#FFD700]/50 rounded-bl-xl text-[#FFD700]">
                    <span className="font-black text-3xl">28</span>
                    <span className="text-sm font-bold mt-1">False Negative (FN)</span>
                  </div>
                  <div className="aspect-square bg-[#1DA1F2]/20 flex flex-col items-center justify-center border-2 border-[#1DA1F2]/50 rounded-br-xl text-[#1DA1F2]">
                    <span className="font-black text-3xl">310</span>
                    <span className="text-sm font-bold mt-1">True Positive (TP)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 6.7 Comparative Analysis Table */}
          <div className="bg-[#0b061d]/90 p-8 rounded-2xl border border-white/10 shadow-2xl relative">
            <button
              onClick={() => downloadImage(chartRefs.fig67, "6.7.png")}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <Download className="w-5 h-5" />
            </button>
            <div ref={chartRefs.fig67} className="p-6 bg-[#0b061d]">
              <h2 className="text-xl font-bold mb-6 text-center">
                Figure 6.7: Comparative Analysis – Performance Metrics
              </h2>
              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 text-slate-300 font-bold uppercase text-sm tracking-wider">
                      <th className="p-4 border-b border-white/10">Method</th>
                      <th className="p-4 border-b border-white/10">Accuracy</th>
                      <th className="p-4 border-b border-white/10">Precision</th>
                      <th className="p-4 border-b border-white/10">Recall</th>
                      <th className="p-4 border-b border-white/10">F1 Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors text-slate-200">
                      <td className="p-4 font-medium">Traditional</td>
                      <td className="p-4">68.4%</td>
                      <td className="p-4">65.2%</td>
                      <td className="p-4">62.1%</td>
                      <td className="p-4">63.6%</td>
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors text-slate-200">
                      <td className="p-4 font-medium">Rule-Based</td>
                      <td className="p-4">79.1%</td>
                      <td className="p-4">76.8%</td>
                      <td className="p-4">74.5%</td>
                      <td className="p-4">75.6%</td>
                    </tr>
                    <tr className="bg-[#AD55FF]/10 text-white border-b border-[#AD55FF]/30 hover:bg-[#AD55FF]/20 transition-colors">
                      <td className="p-4 font-bold flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-[#00FF88]" />{" "}
                        Proposed Hybrid
                      </td>
                      <td className="p-4 font-bold text-[#00FF88]">92.5%</td>
                      <td className="p-4 font-bold text-[#00FF88]">89.3%</td>
                      <td className="p-4 font-bold text-[#00FF88]">94.1%</td>
                      <td className="p-4 font-bold text-[#00FF88]">91.6%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 6.8 Model Comparison Table */}
          <div className="bg-[#0b061d]/90 p-8 rounded-2xl border border-white/10 shadow-2xl relative">
            <button
              onClick={() => downloadImage(chartRefs.fig68, "6.8.png")}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <Download className="w-5 h-5" />
            </button>
            <div ref={chartRefs.fig68} className="p-6 bg-[#0b061d]">
              <h2 className="text-xl font-bold mb-6 text-center">
                Figure 6.8: Comparative Analysis – Model Comparison Table
              </h2>
              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 text-slate-300 font-bold uppercase text-sm tracking-wider">
                      <th className="p-4 border-b border-white/10">Model Component</th>
                      <th className="p-4 border-b border-white/10">Latency (ms)</th>
                      <th className="p-4 border-b border-white/10">Parameters (M)</th>
                      <th className="p-4 border-b border-white/10">Memory (MB)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors text-slate-200">
                      <td className="p-4 font-medium">ResNet-50 (Vision)</td>
                      <td className="p-4">120</td>
                      <td className="p-4">25.6</td>
                      <td className="p-4">98</td>
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors text-slate-200">
                      <td className="p-4 font-medium">BERT-Base (NLP)</td>
                      <td className="p-4">185</td>
                      <td className="p-4">110.1</td>
                      <td className="p-4">418</td>
                    </tr>
                    <tr className="bg-[#1DA1F2]/10 text-white border-b border-[#1DA1F2]/30 hover:bg-[#1DA1F2]/20 transition-colors">
                      <td className="p-4 font-bold flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-[#1DA1F2]" />{" "}
                        Hybrid Fusion
                      </td>
                      <td className="p-4 font-bold text-[#1DA1F2]">310</td>
                      <td className="p-4 font-bold text-[#1DA1F2]">135.7</td>
                      <td className="p-4 font-bold text-[#1DA1F2]">520</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
