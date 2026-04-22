import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { getDanteReply, solveDoubt } from '../lib/ai';
import { Sparkles, Shield, Flame, Activity, Settings } from 'lucide-react';
import { MusicPlayer } from '../components/MusicPlayer';
import { Stopwatch } from '../components/Stopwatch';
import Markdown from 'react-markdown';

export function HomeTab() {
  const { user, logs, examDate, setExamDate, updateUser } = useStore();
  const [danteQuote, setDanteQuote] = useState<string | null>(null);
  const [isDanteLoading, setIsDanteLoading] = useState(false);
  
  const [doubtInput, setDoubtInput] = useState('');
  const [doubtOutput, setDoubtOutput] = useState<string | null>(null);
  const [isDoubtLoading, setIsDoubtLoading] = useState(false);

  // Calculate streak
  const getStreak = () => {
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      const entry = logs.find(x => x.date === dStr);
      
      if (entry) streak++;
      else if (i === 0) continue;
      else break;
    }
    return streak;
  };

  const streak = getStreak();

  const handleDante = async () => {
    setIsDanteLoading(true);
    try {
      const reply = await getDanteReply(streak, user.xp);
      setDanteQuote(reply);
    } catch (e) {
      setDanteQuote("The path to greatness is forged in silence. Keep moving.");
    } finally {
      setIsDanteLoading(false);
    }
  };

  const handleDoubt = async () => {
    if (!doubtInput.trim()) return;
    setIsDoubtLoading(true);
    try {
      const reply = await solveDoubt(doubtInput);
      setDoubtOutput(reply);
    } catch (e) {
      setDoubtOutput("My mind is clouded. Try again later.");
    } finally {
      setIsDoubtLoading(false);
    }
  };

  const handleExamDate = () => {
    const d = prompt("Enter Exam Date (YYYY-MM-DD):", examDate || '');
    if (d) setExamDate(d);
  };

  const buyShield = () => {
    if (user.xp >= 200) {
      updateUser({ xp: user.xp - 200, shields: user.shields + 1 });
      alert("Shield Purchased! 🛡️");
    } else {
      alert(`Need ${200 - user.xp} more XP!`);
    }
  };

  // Exam timer
  const [timeLeft, setTimeLeft] = useState('');
  useEffect(() => {
    if (!examDate) {
      setTimeLeft('Set a date!');
      return;
    }
    const interval = setInterval(() => {
      const diff = new Date(examDate).getTime() - Date.now();
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hrs = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${days}d ${hrs.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m`);
      } else {
        setTimeLeft('EXAM OVER');
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [examDate]);

  // Avg hours
  const activeDays = logs.filter(d => !d.isRest).length;
  const totalHrs = logs.reduce((acc, curr) => acc + (curr.isRest ? 0 : curr.duration), 0);
  const avgHrs = activeDays > 0 ? (totalHrs / activeDays).toFixed(1) : '0';

  return (
    <div className="p-4 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Dante's Wisdom */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 shadow-lg border-l-4 border-l-red-600 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none"></div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-bold text-red-500 uppercase tracking-widest flex items-center gap-2">
            <Flame size={14} /> Dante's Wisdom
          </span>
          <button 
            onClick={handleDante} 
            disabled={isDanteLoading}
            className="bg-gradient-to-r from-red-900 to-red-700 text-white text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 hover:scale-95 transition-transform disabled:opacity-50"
          >
            <Sparkles size={12} /> {isDanteLoading ? 'Summoning...' : 'Seek Wisdom'}
          </button>
        </div>
        <div className="italic text-zinc-200 text-sm font-medium leading-relaxed">
          {danteQuote ? (
            <div className="markdown-body text-sm"><Markdown>{danteQuote}</Markdown></div>
          ) : (
            '"Abandon all hope of mediocrity, ye who enter here. Seek wisdom, and let us begin."'
          )}
        </div>
      </div>

      {/* Quick Doubt Solver */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 shadow-lg">
        <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 flex items-center gap-2">
          <Sparkles size={14} className="text-blue-400" /> Quick Doubt Solver
        </div>
        <div className="flex gap-2 mb-2">
          <input 
            type="text" 
            value={doubtInput}
            onChange={(e) => setDoubtInput(e.target.value)}
            placeholder="E.g. What is Quantum Entanglement?" 
            className="flex-1 bg-black/40 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white focus:border-blue-500 outline-none"
          />
          <button 
            onClick={handleDoubt}
            disabled={isDoubtLoading}
            className="bg-blue-600 text-white px-3 py-2 rounded-xl text-sm font-bold hover:bg-blue-500 transition-colors disabled:opacity-50"
          >
            {isDoubtLoading ? '...' : 'Ask'}
          </button>
        </div>
        {doubtOutput && (
          <div className="mt-3 p-3 bg-blue-900/20 border border-blue-500/30 rounded-xl text-sm text-zinc-200 markdown-body">
            <Markdown>{doubtOutput}</Markdown>
          </div>
        )}
      </div>

      {/* Exam Countdown */}
      <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-2xl p-5 text-center shadow-lg">
        <div className="flex justify-center items-center gap-2 text-zinc-400 text-xs font-bold uppercase tracking-widest mb-2">
          ⏳ Exam Countdown
          <button onClick={handleExamDate} className="p-1 hover:bg-zinc-800 rounded-md"><Settings size={14} /></button>
        </div>
        <div className="text-4xl font-black text-white font-mono tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
          {timeLeft}
        </div>
        {examDate && <div className="text-xs text-zinc-500 mt-2 font-bold">Target: {examDate}</div>}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 text-center">
          <div className="text-2xl font-black text-emerald-400">{streak}</div>
          <div className="text-[10px] text-zinc-400 font-bold uppercase mt-1 flex items-center justify-center gap-1"><Flame size={12}/> Streak</div>
        </div>
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 text-center">
          <div className="text-2xl font-black text-amber-400">{user.shields}</div>
          <div className="text-[10px] text-zinc-400 font-bold uppercase mt-1 flex items-center justify-center gap-1"><Shield size={12}/> Shields</div>
        </div>
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 text-center">
          <div className="text-2xl font-black text-blue-400">{avgHrs}h</div>
          <div className="text-[10px] text-zinc-400 font-bold uppercase mt-1 flex items-center justify-center gap-1"><Activity size={12}/> Avg/Day</div>
        </div>
      </div>

      {/* Focus Tools */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">⚡ Focus Tools</span>
          <button onClick={buyShield} className="bg-gradient-to-r from-amber-500 to-orange-500 text-black text-[10px] px-3 py-1 rounded-full font-black shadow-[0_2px_10px_rgba(245,158,11,0.3)] hover:scale-95 transition-transform">
            BUY SHIELD (200 XP)
          </button>
        </div>
        <div className="space-y-3">
          <MusicPlayer />
          <Stopwatch />
        </div>
      </div>

    </div>
  );
}
