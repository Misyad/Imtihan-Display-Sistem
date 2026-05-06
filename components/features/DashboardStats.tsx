import { mockStats } from "@/data/mock";
import { Users, Activity, Clock, ShieldCheck } from "lucide-react";

const stats = [
  { label: "Total Users", value: mockStats.totalUsers, icon: Users, color: "text-blue-500" },
  { label: "Active Sessions", value: mockStats.activeSessions, icon: Activity, color: "text-green-500" },
  { label: "System Uptime", value: mockStats.uptime, icon: Clock, color: "text-amber-500" },
  { label: "Security Status", value: "Active", icon: ShieldCheck, color: "text-purple-500" },
];

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/20 transition-all group">
          <div className="flex items-center justify-between">
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Live
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold tracking-tight">{stat.value}</h3>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
