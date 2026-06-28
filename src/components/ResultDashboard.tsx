import { motion } from "framer-motion";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import {
  Phone,
  Mail,
  MapPin,
  FileImage,
  AlertTriangle,
  Activity,
  Image as ImageIcon,
  Lock,
  Link,
  ShieldCheck,
} from "lucide-react";
import { AnalysisResult, Detection } from "../services/ai";

ChartJS.register(ArcElement, Tooltip, Legend);

export function ResultDashboard({ result }: { result: AnalysisResult }) {
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
