import React, { useState, useEffect } from 'react';
import { Timer, Square } from 'lucide-react';

export function Stopwatch() {
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setTime((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const toggle = () => setIsActive(!isActive);
  const reset = () => {
    setIsActive(false);
    setTime(0);
  };

  const formatTime = (s: number) => {
    const hrs = Math.floor(s / 3600).toString().padStart(2, '0');
    const mins = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
    const secs = (s % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  return (
    <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800 text-center">
      <div className="flex items-center justify-center gap-2 text-blue-400 font-bold text-sm mb-2">
        <Timer size={16} />
        <span>Stopwatch</span>
      </div>
      <div className="text-4xl font-mono font-black text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.4)] mb-4">
        {formatTime(time)}
      </div>
      <div className="flex justify-center gap-3">
        <button 
          onClick={toggle}
          className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
            isActive ? 'bg-amber-500/20 text-amber-500 border border-amber-500/50' : 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
          }`}
        >
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button 
          onClick={reset}
          className="px-4 py-2 rounded-lg font-bold text-sm bg-red-500/10 text-red-500 border border-red-500/30 flex items-center gap-1"
        >
          <Square size={14} /> Reset
        </button>
      </div>
    </div>
  );
}
