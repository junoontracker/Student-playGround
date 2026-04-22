import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { FileText, Upload, Trash2, MessageSquare, X, BookOpen } from 'lucide-react';
import { set, get, del } from 'idb-keyval';
import { analyzePdf } from '../lib/ai';
import Markdown from 'react-markdown';

export function LibraryTab() {
  const { pdfs, addPdf, removePdf } = useStore();
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user'|'ai', text: string}[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      alert("Only PDF files are allowed.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target?.result as string;
      const pdfData = base64.split(',')[1]; // Remove data:application/pdf;base64,
      
      await set(`pdf_${file.name}`, pdfData);
      addPdf({ name: file.name, size: file.size, addedAt: Date.now() });
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = async (name: string) => {
    if (confirm(`Delete ${name}?`)) {
      await del(`pdf_${name}`);
      removePdf(name);
      if (selectedPdf === name) setSelectedPdf(null);
    }
  };

  const handleChat = async () => {
    if (!chatInput.trim() || !selectedPdf) return;
    
    const userMsg = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsChatLoading(true);

    try {
      const base64Data = await get(`pdf_${selectedPdf}`);
      if (!base64Data) throw new Error("PDF data not found");

      const reply = await analyzePdf(base64Data, userMsg);
      setChatHistory(prev => [...prev, { role: 'ai', text: reply }]);
    } catch (e) {
      setChatHistory(prev => [...prev, { role: 'ai', text: "Failed to analyze document. Ensure it's a valid PDF." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  if (selectedPdf) {
    return (
      <div className="p-4 flex flex-col h-[calc(100vh-140px)] animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="flex justify-between items-center mb-4 bg-zinc-900/80 p-3 rounded-xl border border-zinc-800">
          <div className="flex items-center gap-2 text-sm font-bold text-zinc-200 truncate">
            <FileText size={16} className="text-fuchsia-500" />
            <span className="truncate">{selectedPdf}</span>
          </div>
          <button onClick={() => { setSelectedPdf(null); setChatHistory([]); }} className="p-1 hover:bg-zinc-800 rounded-lg text-zinc-400">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
          {chatHistory.length === 0 && (
            <div className="text-center text-zinc-500 text-sm mt-10 italic">
              "Ask me anything about this text. I shall reveal its depths." - Dante
            </div>
          )}
          {chatHistory.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-sm' 
                  : 'bg-zinc-800 text-zinc-200 rounded-tl-sm border border-zinc-700 markdown-body'
              }`}>
                <Markdown>{msg.text}</Markdown>
              </div>
            </div>
          ))}
          {isChatLoading && (
            <div className="flex justify-start">
              <div className="bg-zinc-800 text-zinc-400 rounded-2xl rounded-tl-sm p-3 text-sm border border-zinc-700 animate-pulse">
                Dante is reading...
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <input 
            type="text" 
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleChat()}
            placeholder="Ask Dante about this PDF..." 
            className="flex-1 bg-black/40 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:border-fuchsia-500 outline-none"
          />
          <button 
            onClick={handleChat}
            disabled={isChatLoading || !chatInput.trim()}
            className="bg-fuchsia-600 text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-fuchsia-500 transition-colors disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 text-center shadow-lg">
        <div className="w-16 h-16 bg-fuchsia-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-fuchsia-500/30">
          <BookOpen size={28} className="text-fuchsia-400" />
        </div>
        <h2 className="text-lg font-bold text-white mb-2">Dante's Library</h2>
        <p className="text-xs text-zinc-400 mb-6">Upload your study materials (PDFs) and let Dante guide you through the chapters.</p>
        
        <label className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white px-6 py-3 rounded-xl font-bold text-sm cursor-pointer inline-flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(213,0,249,0.3)]">
          <Upload size={18} /> Upload PDF
          <input type="file" accept="application/pdf" className="hidden" onChange={handleFileUpload} />
        </label>
      </div>

      <div className="space-y-3">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-2">Your Documents</h3>
        {pdfs.length === 0 ? (
          <div className="text-center text-zinc-600 text-sm py-8 bg-black/20 rounded-xl border border-zinc-800/50 border-dashed">
            No documents uploaded yet.
          </div>
        ) : (
          pdfs.map(pdf => (
            <div key={pdf.name} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 flex items-center justify-between hover:bg-zinc-800/80 transition-colors">
              <div className="flex items-center gap-3 overflow-hidden cursor-pointer flex-1" onClick={() => setSelectedPdf(pdf.name)}>
                <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center border border-red-500/20 shrink-0">
                  <FileText size={20} className="text-red-400" />
                </div>
                <div className="truncate pr-4">
                  <div className="text-sm font-bold text-zinc-200 truncate">{pdf.name}</div>
                  <div className="text-[10px] text-zinc-500">{(pdf.size / 1024 / 1024).toFixed(2)} MB • {new Date(pdf.addedAt).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => setSelectedPdf(pdf.name)} className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20">
                  <MessageSquare size={16} />
                </button>
                <button onClick={() => handleDelete(pdf.name)} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
