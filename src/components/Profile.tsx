import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { getUserHistory, deleteAnalysis, SavedAnalysis } from '../lib/db';
import { Trash2, Loader2, Calendar, ShieldCheck, AlertTriangle, ArrowLeft } from 'lucide-react';
import { cn } from '../lib/utils';

export const Profile: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const { currentUser, logout } = useAuth();
  const [history, setHistory] = useState<SavedAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      try {
        const data = await getUserHistory(currentUser.uid);
        setHistory(data);
      } catch (error) {
        console.error("Failed to fetch history", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [currentUser]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteAnalysis(id);
      setHistory(history.filter(item => item.id !== id));
    } catch (error) {
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="w-full max-w-5xl mx-auto mt-8 space-y-6 relative z-10">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md flex justify-between items-center">
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-slate-300" />
            </button>
          )}
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">User Profile</h2>
            <p className="text-slate-400 mt-1">{currentUser.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="px-6 py-2 bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 rounded-xl font-medium transition-colors"
        >
          Sign Out
        </button>
      </div>

      <div className="bg-[#0a0514]/80 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-2xl min-h-[500px]">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <ShieldCheck className="text-[#00FF88]" /> Analysis History Logs
        </h3>

        {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
          <Loader2 className="w-8 h-8 text-[#AD55FF] animate-spin mb-4" />
          <p className="text-slate-400">Decrypting user history...</p>
        </div>
      ) : history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
          <ShieldCheck className="w-12 h-12 text-slate-500 mb-4 opacity-50" />
          <p className="text-slate-300 font-medium text-lg">No analysis history found.</p>
          <p className="text-slate-500 text-sm mt-1">Run an analysis from the dashboard to save your results here.</p>
        </div>
      ) : (
          <div className="space-y-4">
            {history.map((record) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "p-5 rounded-xl border flex flex-col md:flex-row gap-4 items-start md:items-center justify-between group transition-all",
                  record.finalScore >= 70 ? "bg-[#00FF88]/5 border-[#00FF88]/20" :
                  record.finalScore >= 40 ? "bg-[#FFD700]/5 border-[#FFD700]/20" :
                  "bg-[#FF0055]/5 border-[#FF0055]/20"
                )}
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full",
                      record.finalScore >= 70 ? "bg-[#00FF88]/20 text-[#00FF88]" :
                      record.finalScore >= 40 ? "bg-[#FFD700]/20 text-[#FFD700]" :
                      "bg-[#FF0055]/20 text-[#FF0055]"
                    )}>
                      Score: {record.finalScore}
                    </span>
                    <span className="text-slate-400 text-sm flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> 
                      {record.timestamp.toLocaleDateString()} at {record.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <p className="text-slate-200 line-clamp-2 text-sm">
                    "{record.text || "No text provided (Image only)"}"
                  </p>
                  
                  <div className="flex flex-wrap gap-2 pt-2">
                    {record.result.detections.map((det, i) => (
                      <span key={i} className="px-2 py-1 bg-black/40 border border-white/5 rounded text-[10px] text-slate-300 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-[#FFD700]" />
                        {det.description}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(record.id)}
                  disabled={deletingId === record.id}
                  className="p-3 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-colors border border-red-500/20 shrink-0"
                  title="Delete Record"
                >
                  {deletingId === record.id ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Trash2 className="w-5 h-5" />
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
