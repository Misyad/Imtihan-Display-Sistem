"use client";

import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { useQuestionStore } from "@/lib/store";
import { 
  Play, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Upload, 
  Monitor, 
  Smartphone,
  Trash2,
  Settings as SettingsIcon,
  ChevronRight,
  Plus,
  BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import * as XLSX from "xlsx";
import { ConnectionStatus } from "@/components/ui/connection-status";
import { QuestionText } from "@/components/ui/question-text";

export default function OperatorPage() {
  const { 
    activeProfileId,
    profiles,
    activeQuestion, 
    showAnswer,
    showQuranRef,
    setActiveQuestion, 
    toggleAnswer,
    toggleQuranRef,
    resetQuestion, 
    resetUsedQuestions,
    setQuestions,
    switchProfile
  } = useQuestionStore();

  const [mounted, setMounted] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [remoteUrl, setRemoteUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeProfile = profiles[activeProfileId];
  const questions = activeProfile?.questions || [];
  const usedQuestions = activeProfile?.usedQuestions || [];
  const settings = activeProfile?.settings;
  const currentQuestionData = questions.find(q => q.nomor === activeQuestion);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setRemoteUrl(`${window.location.origin}/remote`);
    }
  }, []);

  const handleExcelImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws) as any[];

      const validatedData = data.map((item: any) => ({
        nomor: parseInt(item.nomor || item.No || 0),
        kategori: item.kategori || item.Category || "Umum",
        soal: item.soal || item.Question || "",
        jawaban: item.jawaban || item.Answer || ""
      })).filter(q => q.nomor > 0 && q.soal !== "");

      if (validatedData.length > 0) {
        setQuestions(validatedData);
        alert(`Berhasil mengimpor ${validatedData.length} soal ke profile ${settings?.name}`);
      } else {
        alert("Format Excel tidak valid atau tidak ada data.");
      }
    };
    reader.readAsBinaryString(file);
  };

  const gridCount = Math.max(100, questions.length);

  if (!mounted || !activeProfile) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans transition-colors duration-500">
      
      {/* Top Navbar */}
      <nav className="bg-card border-b border-border p-4 sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black shadow-lg shadow-emerald-600/20">
                IM
             </div>
             <div>
                <h1 className="text-lg font-black tracking-tighter uppercase text-foreground">Operator Dashboard</h1>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                   <p className="text-[10px] sm:text-xs font-bold text-emerald-600 uppercase tracking-widest">{settings?.name} Mode</p>
                </div>
             </div>
          </div>

          <div className="flex items-center gap-3">
             <ConnectionStatus />
             <select 
               value={activeProfileId}
               onChange={(e) => switchProfile(e.target.value)}
               className="p-2 rounded-xl bg-muted border-none text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
             >
                {Object.entries(profiles).map(([id, p]) => (
                   <option key={id} value={id}>{p.settings.name}</option>
                ))}
             </select>
             <button 
               onClick={() => setShowQR(true)}
               className="flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-emerald-600 text-white rounded-xl text-xs font-bold hover:scale-105 transition-all shadow-lg shadow-emerald-600/10"
             >
                <Smartphone className="w-4 h-4" /> Connect Remote
             </button>
             <a href="/settings" className="p-2 rounded-xl bg-muted hover:bg-muted/60 transition-all">
                <SettingsIcon className="w-5 h-5 text-muted-foreground" />
             </a>
          </div>
           </div>
        </nav>

      <div className="flex-1 max-w-[1600px] mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Grid Control - second on mobile, first on desktop */}
        <div className="lg:col-span-8 space-y-6 order-2 lg:order-1">
           <div className="bg-card p-4 sm:p-6 md:p-8 rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] border border-border shadow-sm overflow-hidden">
              <div className="flex justify-between items-center mb-8">
                 <div>
                    <h2 className="text-xl font-black uppercase tracking-tight text-foreground">Papan Soal</h2>
                    <p className="text-xs text-muted-foreground font-medium">Klik nomor untuk memilih soal aktif</p>
                 </div>
                 <div className="flex items-center gap-2">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-600 rounded-xl text-xs font-bold hover:bg-emerald-500/20 transition-all"
                    >
                       <Upload className="w-4 h-4" /> Import Excel
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleExcelImport} className="hidden" accept=".xlsx, .xls, .csv" />
                    <button 
                      onClick={() => { if(confirm("Reset progres?")) resetUsedQuestions(); }}
                      className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                    >
                       <Trash2 className="w-5 h-5" />
                    </button>
                 </div>
              </div>

              <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 xl:grid-cols-12 gap-3">
                 {Array.from({ length: gridCount }, (_, i) => i + 1).map((num) => {
                    const isUsed = usedQuestions.includes(num);
                    const isActive = activeQuestion === num;
                    const hasData = questions.some(q => q.nomor === num);

                    return (
                       <button
                          key={num}
                          onClick={() => hasData && !isUsed && !isActive && setActiveQuestion(num)}
                          disabled={!hasData || isUsed || isActive}
                          className={cn(
                             "aspect-square rounded-xl flex items-center justify-center text-sm font-black transition-all border-2",
                             !isUsed && !isActive && hasData && "bg-muted dark:bg-card border-transparent text-muted-foreground hover:border-emerald-500/30 cursor-pointer",
                             isUsed && !isActive && "bg-rose-500/10 border-rose-500/20 text-rose-500 cursor-not-allowed",
                             isActive && "bg-emerald-600 border-emerald-400 text-white shadow-xl shadow-emerald-600/30 scale-110 z-10 cursor-not-allowed",
                             !hasData && "opacity-20 grayscale cursor-not-allowed"
                          )}
                       >
                          {num}
                       </button>
                    );
                 })}
              </div>
           </div>
        </div>

        {/* Control Panel - first on mobile, second on desktop */}
        <div className="lg:col-span-4 space-y-6 order-1 lg:order-2">
           
            {/* Active Control Card */}
            <div className="bg-display-bg-elevated p-5 sm:p-6 md:p-8 rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] text-display-text shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-[80px] group-hover:bg-emerald-500/40 transition-all duration-700" />
              
              <div className="relative z-10 space-y-8">
                 <div className="flex justify-between items-start">
                    <div>
                       <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.4em] text-emerald-400 mb-1">Status Soal</p>
                       <h3 className="text-3xl font-black italic">No. {activeQuestion?.toString().padStart(2, '0') || "--"}</h3>
                    </div>
                    <div className={cn(
                       "px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest border",
                       activeQuestion ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-display-bg-elevated border-display-border text-display-muted"
                    )}>
                       {activeQuestion ? "Active" : "Standby"}
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div className="p-5 rounded-3xl bg-display-text/5 border border-display-border space-y-2">
                       <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-muted-foreground">Pertanyaan</p>
                       <p dir="auto" className="text-lg font-bold leading-snug whitespace-pre-line">
                          <QuestionText text={currentQuestionData?.soal || "Pilih nomor soal pada papan untuk memulai."} />
                       </p>
                    </div>

                    <AnimatePresence>
                      {showAnswer && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-5 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 space-y-2"
                        >
                           <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-emerald-500">Jawaban</p>
                           <p dir="auto" className="text-xl font-black text-emerald-400 uppercase tracking-tight whitespace-pre-line">
                              <QuestionText text={currentQuestionData?.jawaban || "MUMTAZ"} />
                           </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                 </div>

                 <div className="grid grid-cols-2 gap-4 pt-4">
                    <button 
                      onClick={() => toggleAnswer()}
                      disabled={!activeQuestion}
                      className={cn(
                        "flex items-center justify-center gap-3 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs transition-all active:scale-95",
                        showAnswer ? "bg-amber-500 text-amber-950" : "bg-display-text text-display-bg hover:bg-emerald-100"
                      )}
                    >
                       {showAnswer ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                       {showAnswer ? "Hide" : "Show"}
                    </button>
                    <button 
                      onClick={() => resetQuestion()}
                      className="flex items-center justify-center gap-3 py-5 rounded-[2rem] bg-display-bg-elevated text-display-muted font-black uppercase tracking-widest text-xs hover:bg-display-bg-elevated/80 transition-all"
                    >
                       <RotateCcw className="w-5 h-5" /> Reset
                    </button>
                 </div>

                 {currentQuestionData?.quranRef && showAnswer && (
                   <div className="pt-2">
                     <button
                       onClick={() => toggleQuranRef()}
                       className={cn(
                         "w-full flex items-center justify-center gap-3 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs transition-all active:scale-95",
                         showQuranRef 
                           ? "bg-purple-500 text-white" 
                           : "bg-display-bg-elevated text-display-muted hover:bg-display-bg-elevated/80"
                       )}
                     >
                       <BookOpen className="w-5 h-5" />
                       {showQuranRef ? "Sembunyikan" : "Tampilkan"} Al-Quran
                     </button>
                   </div>
                 )}
              </div>
            </div>

           {/* Quick Actions */}
            <div className="bg-card p-6 rounded-[2.5rem] border border-border space-y-4">
               <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground px-2">Quick Links</h4>
              <div className="grid grid-cols-1 gap-2">
                 <a href="/display" target="_blank" className="flex items-center justify-between p-4 rounded-2xl bg-muted hover:bg-emerald-500 hover:text-white transition-all group">
                    <div className="flex items-center gap-3">
                       <Monitor className="w-4 h-4" />
                       <span className="text-sm font-bold">Buka Display Layar</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100" />
                 </a>
                 <a href="/interactive" target="_blank" className="flex items-center justify-between p-4 rounded-2xl bg-muted hover:bg-emerald-500 hover:text-white transition-all group">
                    <div className="flex items-center gap-3">
                       <Play className="w-4 h-4" />
                       <span className="text-sm font-bold">Papan Interaktif</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100" />
                 </a>
              </div>
           </div>
        </div>
      </div>

      {/* QR MODAL */}
      <AnimatePresence>
         {showQR && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md"
               onClick={() => setShowQR(false)}
            >
               <motion.div 
                 initial={{ scale: 0.9, y: 20 }}
                 animate={{ scale: 1, y: 0 }}
                 className="bg-card p-10 rounded-[3rem] shadow-2xl max-w-sm w-full flex flex-col items-center text-center space-y-8"
                 onClick={e => e.stopPropagation()}
               >
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black uppercase tracking-tight text-foreground">Smart Remote</h3>
                    <p className="text-sm text-muted-foreground">Scan QR untuk kendali via HP</p>
                  </div>
                  
                  <div className="p-6 bg-white rounded-3xl shadow-inner border-8 border-emerald-500/10">
                      <QRCodeSVG value={remoteUrl} size={200} className="w-[160px] h-[160px] sm:w-[200px] sm:h-[200px]" />
                  </div>

                  <div className="w-full p-4 rounded-2xl bg-muted border border-border">
                     <p className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Direct Link</p>
                     <p className="text-xs font-mono truncate text-emerald-600">{remoteUrl}</p>
                  </div>

                  {typeof window !== "undefined" && window.location.hostname === "localhost" && (
                     <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] sm:text-xs font-bold uppercase leading-relaxed text-center">
                        ⚠️ PERINGATAN: Anda mengakses via 'localhost'. <br/>
                        Agar HP bisa terhubung, buka halaman ini menggunakan Alamat IP Laptop Anda di jaringan Wi-Fi.
                     </div>
                  )}

                  <button 
                    onClick={() => setShowQR(false)}
                    className="w-full py-4 rounded-2xl bg-muted font-bold hover:bg-muted/60 transition-all text-foreground"
                  >
                     Tutup
                  </button>
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
}
