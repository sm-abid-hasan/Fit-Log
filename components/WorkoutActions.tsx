"use client";

import { Bookmark, CalendarCheck, CalendarPlus } from "lucide-react";
import toast from "react-hot-toast"; 
import { cn } from "@/lib/cn";
import { PLAN_CAP, usePlan } from "./PlanProvider";

export function WorkoutActions({ slug }: { slug: string }) {
  const { hydrated, isInPlan, isSaved, hasRoom, addToPlan, removeFromPlan, toggleSaved } =
    usePlan();

  const inPlan = hydrated && isInPlan(slug);
  const saved = hydrated && isSaved(slug);
  const full = hydrated && !inPlan && !hasRoom;

  const handlePlanClick = () => {
    if (inPlan) {
      removeFromPlan(slug);
      toast("Removed from today's plan", { icon: "➖" });
    } else {
      const added = addToPlan(slug);
      if (added) {
        toast.success("Added to today's plan!");
      } else {
        toast.error(`Plan is full! (Max ${PLAN_CAP})`);
      }
    }
  };


  const handleSaveClick = () => {
    toggleSaved(slug);
    if (saved) {
      toast("Removed from saved", { icon: "➖" });
    } else {
      toast.success("Saved for later!");
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          aria-pressed={inPlan}
          disabled={full}
          onClick={handlePlanClick} 
          className={cn(
            "inline-flex h-11 items-center gap-2 rounded-xl px-6 text-sm font-semibold transition-colors",
            inPlan
              ? "border border-accent text-accent hover:bg-accent/10"
              : "bg-accent text-page shadow-sm hover:opacity-90",
            full && "cursor-not-allowed opacity-40 hover:opacity-40",
          )}
        >
          {inPlan ? (
            <CalendarCheck size={16} aria-hidden="true" />
          ) : (
            <CalendarPlus size={16} aria-hidden="true" />
          )}
          {inPlan ? "In today\u2019s plan" : full ? "Today\u2019s plan is full" : "Add to today\u2019s plan"}
        </button>

     
        <button
          type="button"
          aria-pressed={saved}
          onClick={handleSaveClick} 
          className="inline-flex h-[46px] items-center gap-2 rounded-xl border border-rule-btn px-6 text-sm font-semibold text-ink-soft2 transition-colors hover:bg-white/5"
        >
          <Bookmark size={16} aria-hidden="true" fill={saved ? "currentColor" : "none"} />
          {saved ? "Saved" : "Save for later"}
        </button>
      </div>

      <p className="mt-3 min-h-4 text-xs leading-4 text-ink-muted" role="status">
        {full
          ? `You have ${PLAN_CAP} lifts waiting. Finish one in My Plan to make room.`
          : ""}
      </p>
    </div>
  );
}