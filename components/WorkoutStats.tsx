import { Clock, Flame, Star } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Workout } from "@/lib/workouts";

interface WorkoutStatsProps {
  workout: Pick<Workout, "minutes" | "kcal" | "rating">;
  tone?: "muted" | "accent";
  dense?: boolean;
  className?: string;
}

export function WorkoutStats({ workout, tone = "muted", dense = false, className }: WorkoutStatsProps) {
  const icon = tone === "accent" ? "text-accent" : "text-ink-muted";
  const text = tone === "accent" ? "text-ink-soft" : "text-ink-muted";

  return (
    <ul className={cn("flex items-center text-xs leading-4", dense ? "gap-3" : "gap-4", text, className)}>
      <li className="flex items-center gap-1.5">
        <Clock size={14} className={icon} aria-hidden="true" />
        <span>{workout.minutes} min</span>
      </li>
      <li className="flex items-center gap-1.5">
        <Flame size={14} strokeWidth={0} fill="currentColor" className={icon} aria-hidden="true" />
        <span>{workout.kcal} kcal</span>
      </li>
      <li className="flex items-center gap-1.5">
        <Star size={14} className={icon} aria-hidden="true" />
        <span>
          <span className="sr-only">Rated </span>
          {workout.rating.toFixed(1)}
        </span>
      </li>
    </ul>
  );
}
