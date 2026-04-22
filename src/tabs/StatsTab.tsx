import React, { useState } from 'react';
import { useStore } from '../store';
import { analyzeStats } from '../lib/ai';
import { Sparkles, TrendingUp, Calendar, Clock } from 'lucide-react';
import Markdown from 'react-markdown';

export function StatsTab() {
  const { logs } = useStore();
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAnalyze = async () => {
    if (logs.length === 0) return alert("Koi data hi nahi hai analyze karne ko!");
    setIsAnalyzing(true);
    try {
      const recent = logs.slice(0, 7);
      const summary = recent.map(d => `Date: ${d.date}, Hours: ${d.duration}, Subjects: ${d.subjects.join(',')}, Rest: ${d.isRest}`).join(" | ");
      const reply = await analyzeStats(summary);
      setAiAnalysis(reply);
    } catch (e) {
      setAiAnalysis("Analyze nahi hua, thodi der baad dekh.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const filteredLogs = logs.filter(l => 
    JSON.stringify(l).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      
      {/* AI Progress Report */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 shadow-lg">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <Sparkles size={14} className="text-emerald-400" /> Padhai Ki Progress
          </span>
          <button 
            onClick={handleAnalyze} 
            disabled={isAnalyzing}
            className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 hover:bg-emerald-600/30 transition-colors disabled:opacity-50"
          >
            {isAnalyzing ? 'Chal raha hai...' : 'Bata Kaisa Chal Raha'}
          </button>
        </div>
        {aiAnalysis ? (
          <div className="text-sm text-zinc-300 markdown-body bg-black/30 p-3 rounded-xl border border-zinc-800">
            <Markdown>{aiAnalysis}</Markdown>
          </div>
        ) : (
          <div className="text-sm text-zinc-500 italic text-center py-4">
            Analyze click kar aur apni study patterns ke baare mein deep gyaan le.
          </div>
        )}
      </div>

      {/* History List */}
      <div className="flex justify-between items-center mt-6 mb-2">
        <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">📜 Puraana Hisaab</span>
      </div>
      
      <input 
        type="text" 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="🔍 Search kar apni notes ya subjects ko..." 
        className="w-full bg-black/40 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500 outline-none mb-4"
      />

      <div className="space-y-3">
        {filteredLogs.length === 0 ? (
          <div className="text-center text-zinc-600 text-sm py-8">Kuch na mila.</div>
        ) : (
          filteredLogs.map(log => {
            const gradeColor = log.grade === 'A+' ? 'text-emerald-400' : log.grade === 'F' ? 'text-red-400' : 'text-amber-400';
            const gradeBorder = log.grade === 'A+' ? 'border-emerald-500/50' : log.grade === 'F' ? 'border-red-500/50' : 'border-amber-500/50';
            
            return (
              <div key={log.id} className={`bg-zinc-900/60 border-l-4 ${gradeBorder} border-y border-r border-zinc-800 rounded-xl p-4`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-zinc-400">
                    <Calendar size={12} /> {log.date} <span className="text-lg">{log.mood}</span>
                  </div>
                  <div className={`font-black text-lg ${gradeColor} drop-shadow-[0_0_10px_currentColor]`}>
                    {log.grade}
                  </div>
                </div>
                
                {log.isRest ? (
                  <div className="text-blue-400 font-bold text-sm flex items-center gap-2">
                    🛌 Rest Day Recharged
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 font-black text-xl text-white mb-1">
                      <Clock size={16} className="text-zinc-500" /> {log.duration}h
                      {log.isRev && <span className="text-[9px] bg-fuchsia-500/20 text-fuchsia-400 px-2 py-0.5 rounded-full border border-fuchsia-500/30 uppercase tracking-wider">Revision</span>}
                    </div>
                    <div className="text-sm font-bold text-blue-400 mb-2">
                      {log.subjects.join(' • ')}
                    </div>
                    {log.notes && (
                      <div className="text-xs text-zinc-400 bg-black/40 p-2 rounded-lg italic border border-zinc-800">
                        "{log.notes}"
                      </div>
                    )}
                    {log.bahana && (
                      <div className="text-xs font-bold text-red-400 mt-2 flex items-center gap-1">
                        ⚠️ {log.bahana}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
