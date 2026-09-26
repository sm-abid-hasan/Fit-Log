"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getWorkouts, type Workout } from "@/lib/workouts"; 

export const PLAN_CAP = 5;
const STORAGE_KEY = "fitlog:api-v2"; 

interface PlanEntry {
  slug: string;
  done: boolean;
}

interface StoredState {
  plan: PlanEntry[];
  saved: string[];
}

interface PlanContextValue {
  hydrated: boolean;
  plan: PlanEntry[];
  saved: string[];
  workoutsCache: Record<string, Workout>;
  isInPlan: (slug: string) => boolean;
  isSaved: (slug: string) => boolean;
  hasRoom: boolean;
  addToPlan: (slug: string) => boolean;
  removeFromPlan: (slug: string) => void;
  toggleDone: (slug: string) => void;
  toggleSaved: (slug: string) => void;
  removeSaved: (slug: string) => void;
}

const PlanContext = createContext<PlanContextValue | null>(null);

function readStorage(): StoredState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { plan: [], saved: [] };
    const parsed = JSON.parse(raw) as Partial<StoredState>;
    
    // 🔴 আল্ট্রা-সেফটি: ডেটা স্ট্রিং বা নাম্বার যাই হোক না কেন, এটি নিজে থেকেই ফিক্স করে নেবে
    const plan = (parsed.plan ?? [])
      .filter((e) => e && e.slug != null)
      .map((e) => ({ ...e, slug: String(e.slug) }));
      
    const saved = (parsed.saved ?? [])
      .filter((s) => s != null)
      .map((s) => String(s));
      
    return { plan, saved };
  } catch {
    return { plan: [], saved: [] };
  }
}

export function PlanProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [state, setState] = useState<StoredState>({ plan: [], saved: [] });
  const [workoutsCache, setWorkoutsCache] = useState<Record<string, Workout>>({});

  useEffect(() => {
    setState(readStorage());
    setHydrated(true);

    getWorkouts()
      .then((data: Workout[]) => {
        const cache = data.reduce((acc, w) => {
          const key = String(w.slug || (w as any).id); 
          acc[key] = w;
          return acc;
        }, {} as Record<string, Workout>);
        setWorkoutsCache(cache);
      })
      .catch((err) => console.error("Failed to load plan cache", err));
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // storage unavailable
    }
  }, [state, hydrated]);

  const pendingCount = state.plan.filter((e) => !e.done).length;
  const hasRoom = pendingCount < PLAN_CAP;

  const addToPlan = useCallback(
    (slug: string) => {
      const stringSlug = String(slug);
      if (state.plan.some((e) => e.slug === stringSlug)) return true;
      if (!hasRoom) return false;
      setState((s) => ({ ...s, plan: [...s.plan, { slug: stringSlug, done: false }] }));
      return true;
    },
    [state.plan, hasRoom],
  );

  const removeFromPlan = useCallback((slug: string) => {
    const stringSlug = String(slug);
    setState((s) => ({ ...s, plan: s.plan.filter((e) => e.slug !== stringSlug) }));
  }, []);

  const toggleDone = useCallback((slug: string) => {
    const stringSlug = String(slug);
    setState((s) => ({
      ...s,
      plan: s.plan.map((e) => (e.slug === stringSlug ? { ...e, done: !e.done } : e)),
    }));
  }, []);

  const toggleSaved = useCallback((slug: string) => {
    const stringSlug = String(slug);
    setState((s) => ({
      ...s,
      saved: s.saved.includes(stringSlug)
        ? s.saved.filter((x) => x !== stringSlug)
        : [...s.saved, stringSlug],
    }));
  }, []);

  const removeSaved = useCallback((slug: string) => {
    const stringSlug = String(slug);
    setState((s) => ({ ...s, saved: s.saved.filter((x) => x !== stringSlug) }));
  }, []);

  const value = useMemo<PlanContextValue>(
    () => ({
      hydrated,
      plan: state.plan,
      saved: state.saved,
      workoutsCache,
      isInPlan: (slug) => state.plan.some((e) => e.slug === String(slug)),
      isSaved: (slug) => state.saved.includes(String(slug)),
      hasRoom,
      addToPlan,
      removeFromPlan,
      toggleDone,
      toggleSaved,
      removeSaved,
    }),
    [hydrated, state, workoutsCache, hasRoom, addToPlan, removeFromPlan, toggleDone, toggleSaved, removeSaved],
  );

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}

export function usePlan(): PlanContextValue {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error("usePlan must be used inside <PlanProvider>");
  return ctx;
}