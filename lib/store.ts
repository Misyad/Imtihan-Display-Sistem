import { create } from "zustand";
import { persist } from "zustand/middleware";
import { io } from "socket.io-client";
import { imtihanQuestions as initialQuestions } from "@/data/mock";
import { logger } from "@/lib/logger";

// Connect to the socket server dynamically
const getSocketUrl = () => {
  if (typeof window !== "undefined") {
    return `http://${window.location.hostname}:3001`;
  }
  return "http://localhost:3001";
};

const socket = io(getSocketUrl());

export interface QuestionEntry {
  nomor: number;
  kategori: string;
  soal: string;
  jawaban: string;
}

export interface AppSettings {
  id: string;
  name: string; // Internal name for profile
  instituteName: string;
  eventName: string;
  academicYear: string;
  primaryColor: string;
  fontSize: "normal" | "large" | "extra-large";
  showFooter: boolean;
  layoutTheme: "classic";
}

interface ProfileData {
  settings: AppSettings;
  questions: QuestionEntry[];
  usedQuestions: number[];
}

interface QuestionStore {
  profiles: Record<string, ProfileData>;
  activeProfileId: string;
  activeQuestion: number | null;
  showAnswer: boolean;
  answerText: string;
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
  
  // Actions
  addProfile: (name: string) => void;
  switchProfile: (id: string, emit?: boolean) => void;
  deleteProfile: (id: string) => void;
  
  setActiveQuestion: (num: number, answer?: string, emit?: boolean) => void;
  markQuestionUsed: (num: number, emit?: boolean) => void;
  toggleAnswer: (emit?: boolean) => void;
  resetQuestion: (emit?: boolean) => void;
  resetUsedQuestions: (emit?: boolean) => void;
  setQuestions: (questions: QuestionEntry[], emit?: boolean) => void;
  updateSettings: (settings: Partial<AppSettings>, emit?: boolean) => void;
  updateFromRemote: (state: Partial<QuestionStore>) => void;
}

const defaultSettings = (id: string, name: string): AppSettings => ({
  id,
  name,
  instituteName: "PONDOK PESANTREN AL-ITQAN",
  eventName: "HAFLAH AT-TAKSHRIJ",
  academicYear: "2024/2025",
  primaryColor: "#10b981",
  fontSize: "normal",
  showFooter: true,
  layoutTheme: "classic",
});

export const useQuestionStore = create<QuestionStore>()(
  persist(
    (set, get) => ({
      profiles: {
        "default": {
          settings: defaultSettings("default", "Lembaga Utama"),
          questions: initialQuestions,
          usedQuestions: [],
        }
      },
      activeProfileId: "default",
      activeQuestion: null,
      showAnswer: false,
      answerText: "",
      isConnected: false,
      setIsConnected: (connected) => set({ isConnected: connected }),

      addProfile: (name) => {
        const id = Math.random().toString(36).substring(7);
        const newProfiles = {
          ...get().profiles,
          [id]: {
            settings: defaultSettings(id, name),
            questions: [],
            usedQuestions: [],
          }
        };
        set({ profiles: newProfiles });
      },

      switchProfile: (id, emit = true) => {
        if (!get().profiles[id]) return;
        const newState = { activeProfileId: id, activeQuestion: null, showAnswer: false };
        set(newState);
        if (emit) socket.emit('updateState', newState);
      },

      deleteProfile: (id) => {
        if (id === "default") return;
        const newProfiles = { ...get().profiles };
        delete newProfiles[id];
        set({ 
          profiles: newProfiles, 
          activeProfileId: get().activeProfileId === id ? "default" : get().activeProfileId 
        });
      },

      setActiveQuestion: (num, answer, emit = true) => {
        const state = get();
        const activeProfile = state.profiles[state.activeProfileId];
        if (!activeProfile) return;

        const questionData = activeProfile.questions.find(q => q.nomor === num);
        const finalAnswer = answer || questionData?.jawaban || "MUMTAZ";

        const newUsed = state.activeQuestion !== null && !activeProfile.usedQuestions.includes(state.activeQuestion)
          ? [...activeProfile.usedQuestions, state.activeQuestion]
          : activeProfile.usedQuestions;

        const updatedProfiles = {
          ...state.profiles,
          [state.activeProfileId]: {
            ...activeProfile,
            usedQuestions: newUsed,
          }
        };

        const newState = {
          profiles: updatedProfiles,
          activeQuestion: num,
          showAnswer: false, 
          answerText: finalAnswer,
        };

        set(newState);
        if (emit) socket.emit('updateState', newState);
      },

      markQuestionUsed: (num, emit = true) => {
        const state = get();
        const activeProfile = state.profiles[state.activeProfileId];
        if (!activeProfile) return;

        const newUsed = activeProfile.usedQuestions.includes(num) 
          ? activeProfile.usedQuestions 
          : [...activeProfile.usedQuestions, num];

        const updatedProfiles = {
          ...state.profiles,
          [state.activeProfileId]: {
            ...activeProfile,
            usedQuestions: newUsed,
          }
        };

        const newState = {
          profiles: updatedProfiles,
          activeQuestion: state.activeQuestion === num ? null : state.activeQuestion,
        };
        set(newState);
        if (emit) socket.emit('updateState', newState);
      },

      toggleAnswer: (emit = true) => {
        const newState = { showAnswer: !get().showAnswer };
        set(newState);
        if (emit) socket.emit('updateState', newState);
      },

      resetQuestion: (emit = true) => {
        const newState = { activeQuestion: null, showAnswer: false };
        set(newState);
        if (emit) socket.emit('updateState', newState);
      },

      resetUsedQuestions: (emit = true) => {
        const state = get();
        const activeProfile = state.profiles[state.activeProfileId];
        const updatedProfiles = {
          ...state.profiles,
          [state.activeProfileId]: {
            ...activeProfile,
            usedQuestions: [],
          }
        };
        const newState = { profiles: updatedProfiles, activeQuestion: null, showAnswer: false };
        set(newState);
        if (emit) socket.emit('updateState', newState);
      },

      setQuestions: (newQuestions, emit = true) => {
        const state = get();
        const activeProfile = state.profiles[state.activeProfileId];
        const updatedProfiles = {
          ...state.profiles,
          [state.activeProfileId]: {
            ...activeProfile,
            questions: newQuestions,
          }
        };
        const newState = { profiles: updatedProfiles };
        set(newState);
        if (emit) socket.emit('updateState', newState);
      },

      updateSettings: (newSettings, emit = true) => {
        const state = get();
        const activeProfile = state.profiles[state.activeProfileId];
        const updatedProfiles = {
          ...state.profiles,
          [state.activeProfileId]: {
            ...activeProfile,
            settings: { ...activeProfile.settings, ...newSettings },
          }
        };
        const newState = { profiles: updatedProfiles };
        set(newState);
        if (emit) socket.emit('updateState', newState);
      },

      updateFromRemote: (newState) => {
        set(newState);
      }
    }),
    {
      name: "imtihan-multi-lembaga-storage",
    }
  )
);

// Listen for state updates
// Listen for state updates
socket.on('stateUpdate', (newState) => {
  useQuestionStore.getState().updateFromRemote(newState);
});

socket.on('connect', () => {
  logger.info("Socket.IO client connected to server");
  useQuestionStore.getState().setIsConnected(true);
});

socket.on('disconnect', (reason) => {
  logger.warn(`Socket.IO client disconnected: ${reason}`);
  useQuestionStore.getState().setIsConnected(false);
});

socket.on('connect_error', (error) => {
  logger.error("Socket.IO connection error", {}, error);
  useQuestionStore.getState().setIsConnected(false);
});

socket.on('error', (error) => {
  logger.error("Socket.IO application-level error received", { error });
});
