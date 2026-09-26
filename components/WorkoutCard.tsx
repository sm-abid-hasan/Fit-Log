import Image from "next/image";
import Link from "next/link";
import { WORKOUT_IMAGE, type Workout } from "@/lib/workouts";
import { MuscleChip } from "./MuscleChip";
import { WorkoutStats } from "./WorkoutStats";

export function WorkoutCard({ workout }: { workout: Workout }) {
  const musclesList = workout.muscles || (workout as any).muscleGroups || [];
  const slugId = workout.slug || String((workout as any).id);
  const imageUrl = (workout as any).image || WORKOUT_IMAGE;

  return (
    <Link
      href={`/workouts/${slugId}`}
      className="group block overflow-hidden rounded-2xl border border-card-line bg-card transition-colors hover:border-accent/60"
    >
      <div className="relative h-48 bg-card-image">
        <Image
          src={imageUrl}
          alt=""
          fill
          unoptimized 
          sizes="(min-width: 1280px) 393px, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      <div className="p-6">
        <div>
          <ul className="flex flex-wrap gap-1.5" aria-label="Muscle groups">
            {musclesList.map((m: string) => (
              <li key={m}>
                <MuscleChip>{m}</MuscleChip>
              </li>
            ))}
          </ul>
          <h3 className="mt-1 pt-2 font-display text-lg font-bold uppercase leading-7 tracking-[0.45px] text-white">
            {workout.name}
          </h3>
          <p className="mt-1 text-xs leading-4 text-ink-muted">{workout.equipment}</p>
        </div>

        <WorkoutStats
         
          workout={{
            ...workout,
            minutes: workout.minutes || (workout as any).duration,
            kcal: workout.kcal || (workout as any).caloriesBurned,
          }}
          className="mt-4 border-t border-card-line pt-3"
        />
      </div>
    </Link>
  );
}