"use client";

import React, { useState, useEffect } from "react";
import { useQuestionStore, AppSettings } from "@/lib/store";
import { 
  Settings, 
  School, 
  Calendar, 
  Palette, 
  Type, 
  Save, 
  Trash2, 
  Download,
  CheckCircle2,
  AlertTriangle,
  Plus,
  ArrowRightLeft,
  LayoutGrid,
  ListTodo,
  Tag
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { 
    profiles, 
    activeProfileId, 
    updateSettings, 
    resetUsedQuestions, 
    addProfile, 
    switchProfile, 
    deleteProfile 
  } = useQuestionStore();

  const activeProfile = profiles[activeProfileId];
  const [formData, setFormData] = useState<AppSettings>(activeProfile?.settings);
  const [mounted, setMounted] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success">("idle");
  const [newProfileName, setNewProfileName] = useState("");
  const [newCategory, setNewCategory] = useState({ name: "", quota: 1 });

  useEffect(() => {
    setMounted(true);
    if (activeProfile) {
      setFormData(activeProfile.settings);
    }
  }, [activeProfileId, profiles]);

  const handleSave = () => {
    setSaveStatus("saving");
    updateSettings(formData);
    setTimeout(() => {
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }, 1000);
  };

  const handleAddCategory = () => {
    if (!newCategory.name) return;
    const updatedQuotas = [...(formData.categoryQuotas || []), newCategory];
    setFormData({ ...formData, categoryQuotas: updatedQuotas });
    setNewCategory({ name: "", quota: 1 });
  };

  const handleRemoveCategory = (index: number) => {
    const updatedQuotas = formData.categoryQuotas.filter((_, i) => i !== index);
    setFormData({ ...formData, categoryQuotas: updatedQuotas });
  };

  if (!mounted || !activeProfile) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 p-6 md:p-12 transition-colors duration-500">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-xl shadow-emerald-600/20">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-emerald-900 dark:text-emerald-400 uppercase">Pengaturan Lembaga</h1>
              <p className="text-slate-500 dark:text-zinc-400 font-medium">Manajemen Multi-Lembaga & Konfigurasi Soal</p>
            </div>
          </div>
          
          <button 
            onClick={handleSave}
            disabled={saveStatus === "saving"}
            className={cn(
              "flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all active:scale-95 shadow-xl",
              saveStatus === "success" ? "bg-emerald-500 text-white" : "bg-zinc-900 dark:bg-emerald-600 text-white"
            )}
          >
            {saveStatus === "saving" ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : saveStatus === "success" ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />}
            {saveStatus === "saving" ? "Menyimpan..." : saveStatus === "success" ? "Tersimpan" : "Simpan Perubahan"}
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-slate-200 dark:border-zinc-800 shadow-sm">
               <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                 <ArrowRightLeft className="w-4 h-4" /> Daftar Lembaga
               </h3>
               <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {Object.entries(profiles).map(([id, profile]) => (
                    <div 
                      key={id}
                      className={cn(
                        "group flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer border-2",
                        activeProfileId === id 
                          ? "bg-emerald-50 border-emerald-500/30 dark:bg-emerald-950/20" 
                          : "bg-slate-50 dark:bg-zinc-800 border-transparent hover:border-slate-200"
                      )}
                      onClick={() => switchProfile(id)}
                    >
                       <div className="flex flex-col">
                          <span className={cn("font-bold text-sm", activeProfileId === id ? "text-emerald-700 dark:text-emerald-400" : "text-slate-600 dark:text-zinc-300")}>
                             {profile.settings.name}
                          </span>
                          <span className="text-[10px] opacity-50 uppercase tracking-tighter">{profile.questions.length} Soal</span>
                       </div>
                    </div>
                  ))}
               </div>
               
               <div className="mt-6 pt-6 border-t border-slate-100 dark:border-zinc-800 space-y-3">
                  <input 
                    type="text" 
                    placeholder="Nama Lembaga Baru..."
                    value={newProfileName}
                    onChange={(e) => setNewProfileName(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-zinc-800 border-none text-xs font-bold"
                  />
                  <button 
                    onClick={() => { if(newProfileName) addProfile(newProfileName); setNewProfileName(""); }}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition-all"
                  >
                    <Plus className="w-4 h-4" /> Tambah Lembaga
                  </button>
               </div>
            </div>

            <div className="p-6 rounded-[2rem] bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30">
               <h3 className="text-xs font-black uppercase tracking-widest text-emerald-600 mb-4 flex items-center gap-2">
                 <ListTodo className="w-4 h-4" /> Kuota Kategori
               </h3>
               <div className="space-y-3">
                  {formData.categoryQuotas?.map((cat, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-zinc-900 shadow-sm">
                       <div className="flex flex-col">
                          <span className="text-[10px] font-bold uppercase">{cat.name}</span>
                          <span className="text-xs font-black text-emerald-600">{cat.quota} Soal</span>
                       </div>
                       <button onClick={() => handleRemoveCategory(idx)} className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  ))}
                  
                  <div className="pt-4 space-y-2">
                     <input 
                       type="text" 
                       placeholder="Nama Kategori..."
                       value={newCategory.name}
                       onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                       className="w-full p-2 rounded-lg bg-white dark:bg-zinc-900 border-none text-[10px] font-bold"
                     />
                     <div className="flex gap-2">
                        <input 
                          type="number" 
                          placeholder="Jumlah..."
                          value={newCategory.quota}
                          onChange={(e) => setNewCategory({ ...newCategory, quota: parseInt(e.target.value) || 1 })}
                          className="w-1/2 p-2 rounded-lg bg-white dark:bg-zinc-900 border-none text-[10px] font-bold"
                        />
                        <button 
                          onClick={handleAddCategory}
                          className="flex-1 bg-emerald-600 text-white rounded-lg text-[10px] font-black uppercase"
                        >
                           Tambah
                        </button>
                     </div>
                  </div>
               </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-zinc-800 shadow-sm space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Visual Section */}
                <div className="space-y-8">
                   <div className="flex items-center gap-3">
                      <Palette className="w-5 h-5 text-amber-500" />
                      <h2 className="text-lg font-bold uppercase tracking-tight">Tampilan & Visual</h2>
                   </div>
                   
                   <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tema Layout</label>
                        <div className="grid grid-cols-2 gap-3">
                           <button onClick={() => setFormData({ ...formData, layoutTheme: "classic" })} className={cn("p-4 rounded-2xl border-2 flex flex-col items-center gap-2", formData.layoutTheme === "classic" ? "bg-emerald-50 border-emerald-500 text-emerald-600" : "bg-slate-50 border-transparent")}>
                              <Settings className="w-6 h-6" />
                              <span className="text-[10px] font-bold">Classic</span>
                           </button>
                           <button onClick={() => setFormData({ ...formData, layoutTheme: "game" })} className={cn("p-4 rounded-2xl border-2 flex flex-col items-center gap-2", formData.layoutTheme === "game" ? "bg-amber-50 border-amber-500 text-amber-600" : "bg-slate-50 border-transparent")}>
                              <LayoutGrid className="w-6 h-6" />
                              <span className="text-[10px] font-bold">Game</span>
                           </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ukuran Font</label>
                        <div className="flex gap-2">
                           {["normal", "large", "extra-large"].map(s => (
                             <button key={s} onClick={() => setFormData({ ...formData, fontSize: s as any })} className={cn("flex-1 p-2 rounded-xl text-[10px] font-bold uppercase", formData.fontSize === s ? "bg-emerald-600 text-white" : "bg-slate-100")}>
                                {s}
                             </button>
                           ))}
                        </div>
                      </div>
                   </div>
                </div>

                {/* Info Section */}
                <div className="space-y-8">
                   <div className="flex items-center gap-3">
                      <School className="w-5 h-5 text-blue-500" />
                      <h2 className="text-lg font-bold uppercase tracking-tight">Identitas Layar</h2>
                   </div>
                   <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nama Ma'had</label>
                        <input type="text" value={formData.instituteName} onChange={e => setFormData({ ...formData, instituteName: e.target.value.toUpperCase() })} className="w-full p-4 rounded-2xl bg-slate-50 font-bold" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nama Acara</label>
                        <input type="text" value={formData.eventName} onChange={e => setFormData({ ...formData, eventName: e.target.value.toUpperCase() })} className="w-full p-4 rounded-2xl bg-slate-50 font-bold" />
                      </div>
                   </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100 dark:border-zinc-800">
                <div className="p-6 rounded-3xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 flex items-start gap-4">
                   <Tag className="w-6 h-6 text-blue-600 shrink-0" />
                   <div>
                      <h4 className="text-xs font-black uppercase text-blue-700 dark:text-blue-400 mb-1">Informasi Kuota</h4>
                      <p className="text-[10px] leading-relaxed text-blue-600 dark:text-blue-500 font-medium">
                         Pengaturan kuota kategori membantu Anda memantau apakah jumlah soal yang diimport sudah sesuai dengan target ujian per kategori.
                      </p>
                   </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
