import { Statistics, ActivityLog } from "@/types";
import questionsData from "./questions.json";

export interface QuestionEntry {
  nomor: number;
  kategori: string;
  soal: string;
  jawaban: string;
  soalImage?: string;      // Optional: path to question slide image
  jawabanImage?: string;   // Optional: path to answer slide image
}

export const imtihanQuestions: QuestionEntry[] = questionsData;

export const mockStats: Statistics = {
  totalUsers: 1250,
  activeSessions: 42,
  uptime: "99.99%",
  lastUpdated: new Date().toISOString(),
};

export const mockActivity: ActivityLog[] = [
  {
    id: "1",
    timestamp: "2024-05-06T10:00:00Z",
    user: "Admin",
    action: "System Update",
    status: "success",
  },
  {
    id: "2",
    timestamp: "2024-05-06T10:15:00Z",
    user: "Hasan",
    action: "User Created",
    status: "success",
  },
  {
    id: "3",
    timestamp: "2024-05-06T11:30:00Z",
    user: "System",
    action: "Failed Login Attempt",
    status: "warning",
  },
];
