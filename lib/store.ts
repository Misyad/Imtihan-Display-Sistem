import { create } from "zustand";
import { persist } from "zustand/middleware";
import { io, Socket } from "socket.io-client";
import { imtihanQuestions as initialQuestions } from "@/data/mock";
import { logger } from "@/lib/logger";

// Socket connection state management
let socket: Socket | null = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 10;

// Connect to the socket server with environment-aware URL
const getSocketUrl = () => {
  if (typeof window !== "undefined") {
    // Check for explicit env var first
    const envSocketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
    if (envSocketUrl) {
      logger.info(`[Socket] Using NEXT_PUBLIC_SOCKET_URL: ${envSocketUrl}`);
      return envSocketUrl;
    }
    
    // Auto-detect based on current hostname
    const hostname = window.location.hostname;
    const isDev = hostname === "localhost" || hostname === "127.0.0.1";
    
    // Cloudflare Tunnel dynamic routing fallback for projecthasan.com
    if (hostname.includes("projecthasan.com")) {
      const protocol = window.location.protocol;
      const socketUrl = `${protocol}//khotaman-socket.projecthasan.com`;
      logger.info(`[Socket] Public domain mapped to: ${socketUrl}`);
      return socketUrl;
    }
    const socketPort = isDev ? 3001 : 3011;
    const protocol = window.location.protocol;
    const socketUrl = `${protocol}//${hostname}:${socketPort}`;
    logger.info(`[Socket] Auto-detected URL: ${socketUrl}`);
    return socketUrl;
  }
  return "http://localhost:3001";
};

const initSocket = () => {
  if (socket) return socket;
  
  const socketUrl = getSocketUrl();
  logger.info(`[Socket] Initializing connection to: ${socketUrl}`);
  
  socket = io(socketUrl, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
    timeout: 20000,
    transports: ['websocket', 'polling']
  });

  socket.on('connect', () => {
    logger.info(`[Socket] Connected: ${socket?.id}`);
    reconnectAttempts = 0;
    useQuestionStore.getState().setConnectionStatus('connected');
    // Request latest state on connect
    socket?.emit('requestState');
  });

  socket.on('disconnect', (reason) => {
    logger.warn(`[Socket] Disconnected: ${reason}`);
    useQuestionStore.getState().setConnectionStatus('disconnected');
  });

  socket.on('connect_error', (error) => {
    logger.error("[Socket] Connection error", { message: error.message }, error);
    reconnectAttempts++;
    useQuestionStore.getState().setConnectionStatus('error');
    
    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      logger.error('[Socket] Max reconnection attempts reached');
      socket?.disconnect();
    }
  });

  socket.on('reconnect', (attemptNumber) => {
    logger.info(`[Socket] Reconnected after ${attemptNumber} attempts`);
    useQuestionStore.getState().setConnectionStatus('connected');
  });

  socket.on('reconnecting', (attemptNumber) => {
    logger.info(`[Socket] Reconnecting... attempt ${attemptNumber}`);
    useQuestionStore.getState().setConnectionStatus('reconnecting');
  });

  socket.on('clientCount', (count) => {
    logger.info(`[Socket] Connected clients count: ${count}`);
    useQuestionStore.getState().setClientCount(count);
  });

  socket.on('error', (err) => {
    logger.error("[Socket] Application-level error received", { error: err });
  });

  // Listen for state updates from server
  socket.on('stateUpdate', (newState) => {
    logger.info('[Socket] State update received', {
      activeQuestion: newState.activeQuestion,
      showAnswer: newState.showAnswer,
      activeProfileId: newState.activeProfileId,
      timestamp: new Date(newState.lastUpdated).toISOString()
    });
    useQuestionStore.getState().updateFromRemote(newState);
  });

  return socket;
};

// Helper function to broadcast state changes safely
const emitStateUpdate = (newState: any) => {
  if (socket && socket.connected) {
    socket.emit('updateState', newState);
  }
};

export interface QuestionEntry {
  nomor: number;
  kategori: string;
  soal: string;
  jawaban: string;
  soalImage?: string;      // Optional: path to question slide image
  jawabanImage?: string;   // Optional: path to answer slide image
}

export interface AppSettings {
  id: string;
  name: string;
  instituteName: string;
  eventName: string;
  academicYear: string;
  primaryColor: string;
  fontSize: "normal" | "large" | "extra-large";
  showFooter: boolean;
  layoutTheme: "classic" | "game";
  categoryQuotas: { name: string; quota: number }[];
}

interface ProfileData {
  settings: AppSettings;
  questions: QuestionEntry[];
  usedQuestions: number[];
}

type ConnectionStatus = 'connected' | 'disconnected' | 'reconnecting' | 'error';

interface QuestionStore {
  profiles: Record<string, ProfileData>;
  activeProfileId: string;
  activeQuestion: number | null;
  showAnswer: boolean;
  answerText: string;
  connectionStatus: ConnectionStatus;
  clientCount: number;
  
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
  setConnectionStatus: (status: ConnectionStatus) => void;
  setClientCount: (count: number) => void;
  reconnectSocket: () => void;
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
  categoryQuotas: [],
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
      connectionStatus: 'disconnected',
      clientCount: 0,

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
        const newState = { profiles: newProfiles };
        set(newState);
        emitStateUpdate(newState);
      },

      switchProfile: (id, emit = true) => {
        if (!get().profiles[id]) return;
        const newState = { 
          activeProfileId: id, 
          activeQuestion: null, 
          showAnswer: false,
          profiles: get().profiles 
        };
        set(newState);
        if (emit) emitStateUpdate(newState);
      },

      deleteProfile: (id) => {
        if (id === "default") return;
        const newProfiles = { ...get().profiles };
        delete newProfiles[id];
        const newState = { 
          profiles: newProfiles, 
          activeProfileId: get().activeProfileId === id ? "default" : get().activeProfileId 
        };
        set(newState);
        emitStateUpdate(newState);
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
          activeProfileId: state.activeProfileId
        };

        set(newState);
        if (emit) emitStateUpdate(newState);
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
          activeProfileId: state.activeProfileId
        };
        set(newState);
        if (emit) emitStateUpdate(newState);
      },

      toggleAnswer: (emit = true) => {
        const newState = { 
          showAnswer: !get().showAnswer,
          activeQuestion: get().activeQuestion,
          activeProfileId: get().activeProfileId,
          profiles: get().profiles
        };
        set(newState);
        if (emit) emitStateUpdate(newState);
      },

      resetQuestion: (emit = true) => {
        const newState = { 
          activeQuestion: null, 
          showAnswer: false,
          activeProfileId: get().activeProfileId,
          profiles: get().profiles
        };
        set(newState);
        if (emit) emitStateUpdate(newState);
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
        const newState = { 
          profiles: updatedProfiles, 
          activeQuestion: null, 
          showAnswer: false,
          activeProfileId: state.activeProfileId
        };
        set(newState);
        if (emit) emitStateUpdate(newState);
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
        const newState = { 
          profiles: updatedProfiles,
          activeProfileId: state.activeProfileId
        };
        set(newState);
        if (emit) emitStateUpdate(newState);
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
        const newState = { 
          profiles: updatedProfiles,
          activeProfileId: state.activeProfileId
        };
        set(newState);
        if (emit) emitStateUpdate(newState);
      },

      updateFromRemote: (newState) => {
        // Only update if data is different to avoid loops
        const currentState = get();
        if (JSON.stringify(currentState.activeQuestion) !== JSON.stringify(newState.activeQuestion) ||
            JSON.stringify(currentState.showAnswer) !== JSON.stringify(newState.showAnswer) ||
            JSON.stringify(currentState.activeProfileId) !== JSON.stringify(newState.activeProfileId)) {
          logger.info('[Store] Applying remote state update');
          set(newState);
        }
      },

      setConnectionStatus: (status) => {
        set({ connectionStatus: status });
      },

      setClientCount: (count) => {
        set({ clientCount: count });
      },

      reconnectSocket: () => {
        logger.info('[Socket] Manual reconnection triggered');
        socket?.disconnect();
        socket = null;
        reconnectAttempts = 0;
        initSocket();
      }
    }),
    {
      // Bump storage key so the corrected slide transcription replaces stale placeholder data.
      name: "imtihan-multi-lembaga-storage-v2",
      partialize: (state) => ({
        profiles: state.profiles,
        activeProfileId: state.activeProfileId,
        // Don't persist connection state or active question
      })
    }
  )
);

// Initialize socket on client side only
if (typeof window !== "undefined") {
  initSocket();
}
