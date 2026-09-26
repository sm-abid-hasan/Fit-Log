"use client";

import { Check, ChevronDown, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import toast from "react-hot-toast"; 
import { cn } from "@/lib/cn";
import { WORKOUT_IMAGE, type Workout } from "@/lib/workouts";
import { usePlan } from "./PlanProvider";
import { WorkoutStats } from "./WorkoutStats";

export type PlanTab = "plan" | "saved";

type SortKey = "duration" | "calories" | "rating" | "name";

const SORTS: Record<SortKey, { label: string; compare: (a: Workout, b: Workout) => number }> = {
  duration: { 
    label: "Duration", 
    compare: (a, b) => (a.minutes || (a as any).duration || 0) - (b.minutes || (b as any).duration || 0) 
  },
  calories: { 
    label: "Calories", 
    compare: (a, b) => (a.kcal || (a as any).caloriesBurned || 0) - (b.kcal || (b as any).caloriesBurned || 0) 
  },
  rating: { 
    label: "Rating", 
    compare: (a, b) => (b.rating || 0) - (a.rating || 0) 
  },
  name: { 
    label: "Name", 
    compare: (a, b) => (a.name || "").localeCompare(b.name || "") 
  },
};

interface Row {
  workout: Workout;
  done: boolean;
}

export function PlanView({ tab }: { tab: PlanTab }) {
  const { hydrated, plan, saved, workoutsCache, removeFromPlan, removeSaved } = usePlan();
  const [sort, setSort] = useState<SortKey>("duration");

  const rows = useMemo<Row[]>(() => {
    const source: Array<{ slug: string; done: boolean }> =
      tab === "plan" ? plan : saved.map((slug) => ({ slug, done: false }));

    return source
      .flatMap((e) => {
        const workout = workoutsCache[e.slug];
        return workout ? [{ workout, done: e.done }] : [];
      })
      .sort((a, b) => SORTS[sort].compare(a.workout, b.workout));
  }, [tab, plan, saved, sort, workoutsCache]);

  const minutes = rows.reduce((sum, r) => sum + (r.workout.minutes || (r.workout as any).duration || 0), 0);
  const kcal = rows.reduce((sum, r) => sum + (r.workout.kcal || (r.workout as any).caloriesBurned || 0), 0);

  return (
    <>
      <section
        aria-label="Summary"
        className="mt-6 grid divide-y divide-plan-line rounded-2xl border border-plan-line bg-plan-metric sm:grid-cols-3 sm:divide-x sm:divide-y-0"
      >
        <Metric label="Exercises" value={rows.length} highlight />
        <Metric label="Minutes" value={minutes} />
        <Metric label="Calories" value={kcal} />
      </section>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <nav
          aria-label="My Plan sections"
          className="inline-flex items-center gap-1 rounded-xl border border-plan-line bg-plan-tabs p-1"
        >
          <TabLink href="/my-plan" active={tab === "plan"}>
            Today&rsquo;s Plan
          </TabLink>
          <TabLink href="/my-plan?tab=saved" active={tab === "saved"}>
            Saved
          </TabLink>
        </nav>

        <label className="flex items-center gap-3 text-xs text-ink-plan">
          Sort By
          <span className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="h-[34px] cursor-pointer appearance-none rounded-[9px] border border-plan-line bg-plan-metric pl-3 pr-8 text-xs font-medium text-white"
            >
              {(Object.keys(SORTS) as SortKey[]).map((key) => (
                <option key={key} value={key}>
                  {SORTS[key].label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-plan"
            />
          </span>
        </label>
      </div>

      <div className="mt-6">
        {!hydrated || Object.keys(workoutsCache).length === 0 ? (
          <div className="flex min-h-[300px] items-center justify-center text-sm text-ink-muted">Loading plan data...</div>
        ) : rows.length === 0 ? (
          <EmptyState tab={tab} />
        ) : (
          <ul className="space-y-4">
            {rows.map(({ workout }) => {
              const identifier = workout.slug || String((workout as any).id);
              const imageUrl = (workout as any).image || WORKOUT_IMAGE;
              
              return (
                <li
                  key={identifier}
                  className="flex flex-col gap-4 rounded-2xl border border-plan-line bg-plan-card p-4 transition-opacity sm:flex-row sm:items-center"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative h-20 w-36 shrink-0 overflow-hidden rounded-xl bg-[#1f2937]">
                      <Image
                        src={imageUrl}
                        alt=""
                        fill
                        unoptimized
                        sizes="144px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h2 className="font-display text-base font-bold uppercase leading-6 tracking-[0.4px] text-white">
                        {workout.name}
                      </h2>
                      <p className="mt-0.5 text-xs leading-4 text-ink-plan">{workout.equipment}</p>
                      
                      <WorkoutStats 
                        workout={{
                          ...workout,
                          minutes: workout.minutes || (workout as any).duration,
                          kcal: workout.kcal || (workout as any).caloriesBurned,
                        }} 
                        tone="accent" 
                        dense 
                        className="mt-2" 
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:ml-auto">
                    <Link
                      href={`/workouts/${identifier}`}
                      className="inline-flex h-[34px] items-center rounded-full border border-rule-btn px-[18px] text-xs font-semibold text-white transition-colors hover:bg-white/5"
                    >
                      View Details
                    </Link>

                    {tab === "plan" && (
                      <button
                        type="button"
                        // 🔴 আপডেট: Mark as Done এ ক্লিক করলেই এখন লিস্ট থেকে ডিলিট হয়ে যাবে
                        onClick={() => {
                          removeFromPlan(identifier); 
                          toast.success("Great job! Workout completed.");
                        }}
                        className="inline-flex h-8 items-center gap-1.5 rounded-full px-4 text-xs font-semibold transition-colors bg-accent text-black shadow-sm hover:opacity-90"
                      >
                        <Check size={14} aria-hidden="true" />
                        Mark as Done
                      </button>
                    )}

                    <button
                      type="button"
                      aria-label={
                        tab === "plan"
                          ? `Remove ${workout.name} from today\u2019s plan`
                          : `Remove ${workout.name} from saved`
                      }
                      onClick={() => {
                        if (tab === "plan") {
                          removeFromPlan(identifier);
                          toast("Removed from today's plan", { icon: "➖" });
                        } else {
                          removeSaved(identifier);
                          toast("Removed from saved list", { icon: "➖" });
                        }
                      }}
                      className="grid h-7 w-7 place-items-center rounded-full text-ink-subtle transition-colors hover:bg-white/10 hover:text-white"
                    >
                      <X size={16} aria-hidden="true" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}

function Metric({ label, value, highlight = false }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className="px-6 py-5 sm:py-[30px] sm:[&:not(:first-child)]:pl-8">
      <p className="text-xs leading-4 text-ink-plan">{label}</p>
      <p className={cn("mt-1 font-display text-4xl font-bold leading-10", highlight ? "text-accent" : "text-white")}>
        {value}
      </p>
    </div>
  );
}

function TabLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link href={href} replace scroll={false} aria-current={active ? "page" : undefined} className={cn("inline-flex h-7 items-center rounded-lg border px-4 text-xs font-bold transition-colors", active ? "border-plan-tab-line bg-plan-tab text-white shadow-sm" : "border-transparent text-ink-plan hover:text-white")}>
      {children}
    </Link>
  );
}

function EmptyState({ tab }: { tab: PlanTab }) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-white/10 bg-plan-empty/50 px-6 py-10 text-center">
      <h2 className="font-display text-xl font-bold uppercase leading-5 tracking-[0.7px] text-white">Nothing here yet</h2>
      <p className="mt-2 max-w-[299px] text-xs leading-4 text-ink-empty">
        {tab === "plan" ? "Browse the library and add a lift to get today moving." : "Browse the library and save a lift for later."}
      </p>
      <Link href="/" className="mt-6 inline-flex h-9 items-center rounded-full bg-accent px-6 text-xs font-semibold text-black shadow-glow transition-opacity hover:opacity-90">
        Go to workouts
      </Link>
    </div>
  );
}