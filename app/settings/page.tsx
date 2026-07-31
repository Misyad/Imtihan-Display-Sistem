"use client";

import React, { useState, useEffect } from "react";
import { useQuestionStore, AppSettings } from "@/lib/store";
import { useTheme } from "next-themes";
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
  Sun,
  Moon,
  Star,
  Rows3,
  Rows2,
  Wind
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const THEME_MODES = [
  { id: "light", label: "Light", desc: "Cream & emerald untuk penggunaan harian", icon: Sun, preview: "from-[#F6F1E5] to-[#EAF7F2]" },
  { id: "dark", label: "Dark", desc: "Emerald gelap untuk ruangan minim cahaya", icon: Moon, preview: "from-[#12291F] to-[#081511]" },
  { id: "ceremonial", label: "Ceremonial", desc: "Identitas Islamic dengan ornamen emas", icon: Star, preview: "from-[#0D2019] to-[#081511]" },
] as const;

export default function SettingsPage() {
  const { 
    profiles, 
    activeProfileId, 
    updateSettings, 
    resetUsedQuestions, 
    addProfile, 
    switchProfile, 
    deleteProfile,
    setQuestions
  } = useQuestionStore();
  const { setTheme } = useTheme();

  const activeProfile = profiles[activeProfileId];
  const [formData, setFormData] = useState<AppSettings>(activeProfile?.settings);
  const [mounted, setMounted] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success">("idle");
  const [newProfileName, setNewProfileName] = useState("");

  useEffect(() => {
    setMounted(true);
    if (activeProfile) {
      setFormData(activeProfile.settings);
      if (activeProfile.settings.themeMode) {
        setTheme(activeProfile.settings.themeMode);
      }
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

  if (!mounted || !activeProfile) return null;

  return (
    <div className="min-h-screen bg-background p-6 md:p-12 transition-colors duration-500">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-xl shadow-emerald-600/20">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-primary dark:text-emerald-400 uppercase">Pengaturan Lembaga</h1>
              <p className="text-muted-foreground font-medium">Manajemen Multi-Lembaga & Konfigurasi Soal</p>
            </div>
          </div>
          
          <button 
            onClick={handleSave}
            disabled={saveStatus === "saving"}
            className={cn(
              "flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all active:scale-95 shadow-xl",
              saveStatus === "success" ? "bg-emerald-500 text-white" : "bg-primary text-primary-foreground"
            )}
          >
            {saveStatus === "saving" ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : saveStatus === "success" ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />}
            {saveStatus === "saving" ? "Menyimpan..." : saveStatus === "success" ? "Tersimpan" : "Simpan Perubahan"}
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-card p-6 rounded-[2rem] border border-border shadow-sm">
               <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
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
                          : "bg-muted dark:bg-card border-transparent hover:border-border"
                      )}
                      onClick={() => switchProfile(id)}
                    >
                       <div className="flex flex-col">
                          <span className={cn("font-bold text-sm", activeProfileId === id ? "text-emerald-700 dark:text-emerald-400" : "text-muted-foreground")}>
                             {profile.settings.name}
                          </span>
                          <span className="text-[10px] sm:text-xs opacity-50 uppercase tracking-tighter">{profile.questions.length} Soal</span>
                       </div>
                    </div>
                  ))}
               </div>
               
               <div className="mt-6 pt-6 border-t border-border space-y-3">
                  <input
                    type="text"
                    placeholder="Nama Lembaga Baru..."
                    value={newProfileName}
                    onChange={(e) => setNewProfileName(e.target.value)}
                    className="w-full p-3 rounded-xl bg-muted border-none text-xs font-bold text-foreground"
                  />
                  <button 
                    onClick={() => { if(newProfileName) addProfile(newProfileName); setNewProfileName(""); }}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition-all"
                  >
                    <Plus className="w-4 h-4" /> Tambah Lembaga
                  </button>
               </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-2 space-y-8">
            <div className="bg-card p-8 rounded-[2.5rem] border border-border shadow-sm space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Visual Section */}
                <div className="space-y-8">
                   <div className="flex items-center gap-3">
                      <Palette className="w-5 h-5 text-amber-500" />
                      <h2 className="text-lg font-bold uppercase tracking-tight text-foreground">Tampilan & Visual</h2>
                   </div>

                   <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-muted-foreground">Mode Theme</label>
                        <div className="grid grid-cols-3 gap-2">
                          {THEME_MODES.map((m) => {
                            const Icon = m.icon;
                            const active = formData.themeMode === m.id;
                            return (
                              <button
                                key={m.id}
                                onClick={() => {
                                  setTheme(m.id);
                                  setFormData({ ...formData, themeMode: m.id as any });
                                }}
                                className={cn(
                                  "group p-2 rounded-2xl border-2 transition-all text-left",
                                  active
                                    ? "border-emerald-600 dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30"
                                    : "border-border bg-card hover:border-primary/40"
                                )}
                              >
                                <div className={cn("h-10 rounded-xl bg-gradient-to-br mb-2 relative overflow-hidden border border-black/10", m.preview)}>
                                  <Icon className={cn("w-4 h-4 absolute bottom-1 right-1", active ? "text-gold-600" : "text-muted-foreground")} />
                                  {active && <CheckCircle2 className="w-4 h-4 absolute top-1 left-1 text-emerald-600" />}
                                </div>
                                <span className={cn("block text-[10px] font-black uppercase tracking-wider", active ? "text-emerald-700 dark:text-emerald-400" : "text-muted-foreground")}>
                                  {m.label}
                                </span>
                                <span className="block text-[8px] leading-tight text-muted-foreground/80 mt-0.5 line-clamp-2">{m.desc}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-muted-foreground">Density</label>
                        <div className="flex gap-2">
                          {[
                            { id: "comfortable", label: "Comfortable", icon: Rows3 },
                            { id: "compact", label: "Compact", icon: Rows2 },
                          ].map((d) => {
                            const Icon = d.icon;
                            return (
                              <button key={d.id} onClick={() => setFormData({ ...formData, density: d.id as any })} className={cn("flex-1 flex items-center justify-center gap-1.5 p-2 rounded-xl text-[10px] sm:text-xs font-bold uppercase", formData.density === d.id ? "bg-emerald-600 text-white" : "bg-muted dark:bg-card text-muted-foreground")}>
                                <Icon className="w-3.5 h-3.5" /> {d.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-muted-foreground">Motion Animation</label>
                        <button onClick={() => setFormData({ ...formData, motionEnabled: !formData.motionEnabled })} className={cn("w-full flex items-center justify-between p-2 rounded-xl text-[10px] sm:text-xs font-bold uppercase transition-all", formData.motionEnabled ? "bg-emerald-600 text-white" : "bg-muted dark:bg-card text-muted-foreground")}>
                          <span className="flex items-center gap-1.5"><Wind className="w-3.5 h-3.5" /> {formData.motionEnabled ? "Enabled" : "Disabled"}</span>
                          <span className="text-[8px] opacity-70">{formData.motionEnabled ? "Animasi aktif" : "Animasi dimatikan"}</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-muted-foreground">Ukuran Font</label>
                        <div className="flex gap-2">
                           {["normal", "large", "extra-large"].map(s => (
                             <button key={s} onClick={() => setFormData({ ...formData, fontSize: s as any })} className={cn("flex-1 p-2 rounded-xl text-[10px] sm:text-xs font-bold uppercase", formData.fontSize === s ? "bg-emerald-600 text-white" : "bg-muted dark:bg-card text-muted-foreground")}>
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
                      <h2 className="text-lg font-bold uppercase tracking-tight text-foreground">Identitas Layar</h2>
                   </div>
                   <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-muted-foreground">Nama Ma'had</label>
                        <input type="text" value={formData.instituteName} onChange={e => setFormData({ ...formData, instituteName: e.target.value.toUpperCase() })} className="w-full p-4 rounded-2xl bg-muted font-bold text-foreground" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-muted-foreground">Nama Acara</label>
                        <input type="text" value={formData.eventName} onChange={e => setFormData({ ...formData, eventName: e.target.value.toUpperCase() })} className="w-full p-4 rounded-2xl bg-muted font-bold text-foreground" />
                      </div>
                   </div>
                </div>
              </div>
            </div>

            {/* Manajemen Soal & Progres */}
            <div className="bg-card p-8 rounded-[2.5rem] border border-border shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                <h2 className="text-lg font-bold uppercase tracking-tight text-foreground">Manajemen Soal & Progres</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Reset Progress */}
                <div className="p-5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/30 space-y-3">
                  <h4 className="font-bold text-sm text-rose-800 dark:text-rose-400">Reset Progres Ujian</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Menghapus status soal yang sudah dikerjakan (nomor berwarna kuning) agar kembali ke status belum dikerjakan.
                  </p>
                  <button
                    onClick={() => {
                      if (confirm("Apakah Anda yakin ingin mereset progres ujian untuk lembaga ini? Semua soal akan ditandai kembali sebagai belum dikerjakan.")) {
                        resetUsedQuestions();
                        alert("Progres ujian berhasil direset!");
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-500 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" /> Reset Progres
                  </button>
                </div>

                {/* Reset to Default Questions */}
                <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/30 space-y-3">
                  <h4 className="font-bold text-sm text-emerald-800 dark:text-emerald-400">Muat Bank Soal Bawaan</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Memulihkan bank soal ke data default (89 soal Tajwid & Qira'at) dari sistem. Soal aktif saat ini akan digantikan.
                  </p>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => {
                        if (confirm("Apakah Anda yakin ingin memulihkan bank soal bawaan? Ini akan menimpa seluruh soal saat ini.")) {
                          import("@/data/mock").then((mock) => {
                            setQuestions(mock.imtihanQuestions);
                            alert("Bank soal default (89 soal) berhasil dimuat!");
                          });
                        }
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-500 transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4" /> Muat Soal Default
                    </button>
                    <span className="text-xs font-bold text-muted-foreground/80">
                      {activeProfile.questions.length} Soal Terload
                    </span>
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
