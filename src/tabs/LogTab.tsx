import React, { useState } from 'react';
import { useStore } from '../store';
import { breakdownTopic, enhanceTodo } from '../lib/ai';
import { Sparkles, CheckCircle2, Circle } from 'lucide-react';
import Markdown from 'react-markdown';

const SUBJECTS = ['Maths', 'Science', 'English', 'Hindi', 'SST', 'Computer'];

export function LogTab() {
  const { todos, updateTodo, addLog, user, updateUser } = useStore();
  
  // Topic Planner
  const [topicInput, setTopicInput] = useState('');
  const [topicOutput, setTopicOutput] = useState<string | null>(null);
  const [isTopicLoading, setIsTopicLoading] = useState(false);

  // Log Form
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [mood, setMood] = useState('🙂');
  const [isRest, setIsRest] = useState(false);
  const [selectedSubs, setSelectedSubs] = useState<string[]>([]);
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [bahana, setBahana] = useState('');
  const [isRev, setIsRev] = useState(false);

  const handleBreakdown = async () => {
    if (!topicInput.trim()) return;
    setIsTopicLoading(true);
    try {
      const reply = await breakdownTopic(topicInput);
      setTopicOutput(reply);
    } catch (e) {
      setTopicOutput("Failed to generate plan.");
    } finally {
      setIsTopicLoading(false);
    }
  };

  const handleEnhanceTodo = async (id: number, text: string) => {
    if (!text.trim()) return;
    try {
      const enhanced = await enhanceTodo(text);
      updateTodo(id, enhanced, false);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleSub = (sub: string) => {
    if (isRest) return;
    if (selectedSubs.includes(sub)) {
      setSelectedSubs(selectedSubs.filter(s => s !== sub));
    } else {
      setSelectedSubs([...selectedSubs, sub]);
    }
  };

  const handleSave = () => {
    if (!date) return alert("Select a date!");

    let gainedXp = 0;
    let grade = 'F';
    const durNum = parseFloat(duration) || 0;

    if (isRest) {
      grade = 'R';
      gainedXp = 5;
    } else {
      if (!durNum || selectedSubs.length === 0) return alert("Time and Subject required!");
      
      if (durNum >= 8) { grade = 'A+'; gainedXp = 50; }
      else if (durNum >= 5) { grade = 'B'; gainedXp = 30; }
      else { grade = 'F'; gainedXp = 10; }

      if (bahana === 'Phone') gainedXp -= 20;
      if (bahana === 'Aalas') gainedXp -= 10;
    }

    addLog({
      id: Date.now(),
      date,
      mood,
      isRest,
      duration: isRest ? 0 : durNum,
      subjects: isRest ? [] : selectedSubs,
      notes: isRest ? "Rest Day" : notes,
      bahana: isRest ? "" : bahana,
      isRev: isRest ? false : isRev,
      grade
    });

    updateUser({ xp: Math.max(0, user.xp + gainedXp) });
    alert(`Saved! +${gainedXp} XP`);
    
    // Reset form
    setDuration('');
    setNotes('');
    setBahana('');
    setIsRev(false);
    setIsRest(false);
    setSelectedSubs([]);
  };

  return (
    <div className="p-4 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* AI Study Planner */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 shadow-lg">
        <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 flex items-center gap-2">
          <Sparkles size={14} className="text-fuchsia-400" /> AI Study Planner
        </div>
        <div className="flex gap-2 mb-2">
          <input 
            type="text" 
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            placeholder="Enter large topic (e.g. World War 2)" 
            className="flex-1 bg-black/40 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white focus:border-fuchsia-500 outline-none"
          />
          <button 
            onClick={handleBreakdown}
            disabled={isTopicLoading}
            className="bg-fuchsia-600 text-white px-3 py-2 rounded-xl text-sm font-bold hover:bg-fuchsia-500 transition-colors disabled:opacity-50"
          >
            {isTopicLoading ? '...' : 'Plan'}
          </button>
        </div>
        {topicOutput && (
          <div className="mt-3 p-3 bg-fuchsia-900/20 border border-fuchsia-500/30 rounded-xl text-sm text-zinc-200 markdown-body">
            <Markdown>{topicOutput}</Markdown>
          </div>
        )}
      </div>

      {/* Smart Daily Targets */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 shadow-lg">
        <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">📝 Smart Daily Targets</div>
        <div className="space-y-3">
          {todos.map(todo => (
            <div key={todo.id} className="flex gap-2 items-center">
              <button onClick={() => updateTodo(todo.id, todo.text, !todo.done)} className="text-zinc-400 hover:text-emerald-400">
                {todo.done ? <CheckCircle2 className="text-emerald-400" /> : <Circle />}
              </button>
              <input 
                type="text" 
                value={todo.text}
                onChange={(e) => updateTodo(todo.id, e.target.value, todo.done)}
                placeholder={`Target ${todo.id}...`}
                className={`flex-1 bg-black/40 border border-zinc-700 rounded-xl px-3 py-2 text-sm outline-none transition-colors ${todo.done ? 'text-zinc-500 line-through border-emerald-900/50' : 'text-white focus:border-emerald-500'}`}
              />
              <button 
                onClick={() => handleEnhanceTodo(todo.id, todo.text)}
                className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/30 hover:bg-emerald-500/20"
              >
                <Sparkles size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Log Entry */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 shadow-lg">
        <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">🚀 Daily Log</div>
        
        <div className="flex justify-center gap-6 mb-4 bg-black/30 p-3 rounded-xl">
          {['🔥', '🙂', '😴'].map(m => (
            <button 
              key={m} 
              onClick={() => setMood(m)}
              className={`text-3xl transition-transform ${mood === m ? 'scale-125 opacity-100' : 'opacity-30 hover:opacity-60'}`}
            >
              {m}
            </button>
          ))}
        </div>

        <input 
          type="date" 
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full bg-black/40 border border-zinc-700 rounded-xl px-4 py-3 text-white mb-4 outline-none focus:border-emerald-500"
        />

        <div className={`grid grid-cols-3 gap-2 mb-4 transition-opacity ${isRest ? 'opacity-30 pointer-events-none' : ''}`}>
          {SUBJECTS.map(sub => (
            <button
              key={sub}
              onClick={() => toggleSub(sub)}
              className={`py-2 rounded-lg text-sm font-semibold border transition-all ${
                selectedSubs.includes(sub) 
                  ? 'bg-blue-600 text-white border-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.3)]' 
                  : 'bg-black/40 text-zinc-400 border-zinc-700 hover:border-zinc-500'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        <div className="flex gap-3 mb-4">
          <label className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border font-bold text-sm cursor-pointer transition-colors ${isRev ? 'bg-fuchsia-500/20 border-fuchsia-500 text-fuchsia-400' : 'bg-black/40 border-zinc-700 text-zinc-400'}`}>
            <input type="checkbox" checked={isRev} onChange={(e) => setIsRev(e.target.checked)} className="hidden" />
            🔄 Revision
          </label>
          <label className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border font-bold text-sm cursor-pointer transition-colors ${isRest ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-black/40 border-zinc-700 text-zinc-400'}`}>
            <input type="checkbox" checked={isRest} onChange={(e) => setIsRest(e.target.checked)} className="hidden" />
            🛌 Rest Day
          </label>
        </div>

        <div className={`space-y-3 transition-opacity ${isRest ? 'opacity-30 pointer-events-none' : ''}`}>
          <input 
            type="number" 
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="⏱️ Study Hours (Target: 8h)" 
            step="0.1"
            className="w-full bg-black/40 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500"
          />
          <textarea 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="📝 What did you study? Any notes?" 
            rows={2}
            className="w-full bg-black/40 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 resize-none"
          />
          
          {(parseFloat(duration) > 0 && parseFloat(duration) < 8) && (
            <select 
              value={bahana}
              onChange={(e) => setBahana(e.target.value)}
              className="w-full bg-red-900/20 border border-red-500/50 rounded-xl px-4 py-3 text-red-400 outline-none font-semibold"
            >
              <option value="">⚠️ Reason for less study?</option>
              <option value="Aalas">Laziness [-10 XP]</option>
              <option value="Phone">Phone Distraction [-20 XP]</option>
              <option value="Bimar">Sick [No Penalty]</option>
              <option value="Emergency">Emergency [No Penalty]</option>
            </select>
          )}
        </div>

        <button 
          onClick={handleSave}
          className={`w-full mt-4 py-4 rounded-xl font-black text-lg uppercase tracking-wider transition-all ${
            isRest ? 'bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]' : 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)]'
          }`}
        >
          {isRest ? 'Mark Rest Day 🛌' : 'Save Data ✅'}
        </button>

      </div>
    </div>
  );
}
