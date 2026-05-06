"use client";

import React, { useEffect, useState } from "react";
import { useQuestionStore } from "@/lib/store";
import { 
  Monitor, 
  Smartphone, 
  Settings, 
  LayoutGrid, 
  Layers, 
  BookOpen, 
  CheckCircle2,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { profiles, activeProfileId } = useQuestionStore();
  const [mounted, setMounted] = useState(false);

  const activeProfile = profiles[activeProfileId];
  const totalLembaga = Object.keys(profiles).length;
  const totalSoal = Object.values(profiles).reduce((acc, p) => acc + p.questions.length, 0);
  const totalTerjawab = Object.values(profiles).reduce((acc, p) => acc + p.usedQuestions.length, 0);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const NavCard = ({ href, icon: Icon, title, desc, color }: any) => (
    <motion.a 
      href={href}
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group relative bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-zinc-800 shadow-sm transition-all hover:shadow-2xl hover:shadow-emerald-500/10 overflow-hidden"
    >
      <div className={cn("absolute top-0 right-0 w-32 h-32 opacity-[0.05] -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700", color)}>
        <Icon className="w-full h-full" />
      </div>
      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg transition-transform group-hover:rotate-6", color.replace("text-", "bg-").replace("500", "500/10"), color)}>
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-black mb-2 dark:text-white uppercase tracking-tight">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium mb-6 leading-relaxed">{desc}</p>
      <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
         Buka Halaman <ArrowUpRight className="w-4 h-4" />
      </div>
    </motion.a>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 p-6 md:p-12 transition-colors duration-500">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Top Header & Status */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
               <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                  System Active
               </div>
               <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <ShieldCheck className="w-3 h-3 text-blue-500" /> Secure Local Link
               </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">
               Imtihan <span className="text-emerald-600">Command Center</span>
            </h1>
          </div>

          <div className="flex gap-4 p-2 bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm">
             <div className="px-6 py-3 text-center border-r border-slate-100 dark:border-zinc-800">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Total Lembaga</p>
                <p className="text-2xl font-black dark:text-white">{totalLembaga}</p>
             </div>
             <div className="px-6 py-3 text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Total Soal</p>
                <p className="text-2xl font-black dark:text-white">{totalSoal}</p>
             </div>
          </div>
        </header>

        {/* Live Status Banner */}
        <section className="relative overflow-hidden p-8 md:p-12 rounded-[3rem] bg-zinc-900 text-white shadow-2xl">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent" />
           <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="space-y-4 text-center md:text-left">
                 <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em]">
                    <Zap className="w-3 h-3 fill-emerald-400" /> Active Session
                 </div>
                 <h2 className="text-3xl md:text-5xl font-black italic tracking-tight">
                    {activeProfile?.settings.instituteName}
                 </h2>
                 <p className="text-zinc-400 font-medium max-w-xl">
                    Sesi aktif sedang berjalan untuk acara <span className="text-white font-bold">{activeProfile?.settings.eventName}</span>. 
                    Seluruh display dan remote tersinkronisasi ke profil ini.
                 </p>
              </div>
              <div className="flex flex-col items-center gap-3">
                 <div className="text-center">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Progres Ujian</p>
                    <div className="text-5xl font-black text-emerald-500">{totalTerjawab} <span className="text-xl text-zinc-700">/ {totalSoal}</span></div>
                 </div>
                 <div className="w-48 h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(totalTerjawab / (totalSoal || 1)) * 100}%` }}
                      className="h-full bg-emerald-500" 
                    />
                 </div>
              </div>
           </div>
        </section>

        {/* Navigation Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <NavCard 
             href="/operator" 
             icon={Activity} 
             title="Operator" 
             desc="Pusat kendali utama untuk memilih soal dan mengelola jawaban secara live."
             color="text-emerald-500"
           />
           <NavCard 
             href="/display" 
             icon={Monitor} 
             title="Display" 
             desc="Tampilan sinematik untuk audiens. Hubungkan laptop ke proyektor LCD."
             color="text-blue-500"
           />
           <NavCard 
             href="/interactive" 
             icon={LayoutGrid} 
             title="Interactive" 
             desc="Mode All-in-One untuk skenario satu layar. Cocok untuk papan interaktif."
             color="text-amber-500"
           />
           <NavCard 
             href="/settings" 
             icon={Settings} 
             title="Settings" 
             desc="Kelola multi-lembaga, identitas sekolah, tema warna, dan manajemen data."
             color="text-rose-500"
           />
        </section>

        {/* Footer Statistics */}
        <footer className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-slate-200 dark:border-zinc-800">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
                 <Layers className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase">Version</p>
                 <p className="text-sm font-bold dark:text-white">v2.1 Build Production</p>
              </div>
           </div>
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
                 <CheckCircle2 className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase">Server Status</p>
                 <p className="text-sm font-bold text-emerald-600">WebSocket Connected</p>
              </div>
           </div>
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
                 <Smartphone className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase">Remote Support</p>
                 <p className="text-sm font-bold dark:text-white">Enabled (Local IP)</p>
              </div>
           </div>
        </footer>
      </div>
    </div>
  );
}
