"use client";

import React, { useState } from "react";
import { Lock, Mail, Eye, EyeOff, AlertTriangle, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { validateLogin } from "@/lib/validation/schemas";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGlobalError("");

    const validationErrors = validateLogin({ email, password });
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      // In production, when next-auth is configured:
      // const res = await signIn("credentials", { redirect: false, email, password });
      // if (res?.error) { setGlobalError("Email atau password salah."); } else { window.location.href = "/operator"; }
      
      // Temporary simulated check for offline/mock development:
      if (email === "admin@imtihan.com" && password === "admin123") {
        localStorage.setItem("isAuthMock", "true");
        window.location.href = "/operator";
      } else {
        setGlobalError("Email atau password tidak terdaftar / salah.");
      }
    } catch (err) {
      setGlobalError("Terjadi kesalahan sistem saat mencoba masuk.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-6 relative overflow-hidden bg-slate-50 dark:bg-zinc-950 transition-colors duration-500">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-30 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl opacity-35 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="rounded-2xl border border-border/40 bg-card p-8 shadow-xl backdrop-blur-md">
          {/* Header Branding */}
          <div className="text-center space-y-3 mb-8">
            <div className="mx-auto w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <ShieldCheck className="text-primary-foreground h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Akses Operator
            </h1>
            <p className="text-sm text-muted-foreground">
              Masuk untuk mengelola display & papan soal imtihan.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {globalError && (
              <div className="flex items-center gap-3 rounded-lg bg-destructive/10 border border-destructive/20 p-3.5 text-xs text-destructive">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{globalError}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Alamat Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground h-4.5 w-4.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@institute.com"
                  className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive mt-1">{errors.email[0]}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground h-4.5 w-4.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="????????"
                  className="w-full pl-11 pr-11 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive mt-1">{errors.password[0]}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm transition-all hover:bg-primary/95 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 cursor-pointer shadow-lg shadow-primary/10 flex items-center justify-center gap-2"
            >
              {isLoading ? "Memproses..." : "Masuk Sistem"}
            </button>
          </form>

          {/* Hint for Dev */}
          <div className="mt-8 pt-6 border-t border-border/40 text-center">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-mono">
              Dev Mode: admin@imtihan.com / admin123
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
