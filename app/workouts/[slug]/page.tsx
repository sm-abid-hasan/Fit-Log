import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MuscleChip } from "@/components/MuscleChip";
import { PageShell } from "@/components/PageShell";
import { WorkoutActions } from "@/components/WorkoutActions";
import { WORKOUT_IMAGE, getWorkout, getWorkouts } from "@/lib/workouts"; 

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const workouts = await getWorkouts();
  return workouts.map((w) => ({ slug: String(w.slug || w.id) }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const workout = await getWorkout(slug);
  return workout ? { title: workout.name, description: workout.description } : {};
}

export default async function WorkoutPage({ params }: { params: Params }) {
  const { slug } = await params;
  const workout = await getWorkout(slug);
  
  if (!workout) notFound();

  const musclesList = workout.muscles || (workout as any).muscleGroups || [];
  const imageUrl = (workout as any).image || WORKOUT_IMAGE;
  const duration = workout.minutes || (workout as any).duration;
  const calories = workout.kcal || (workout as any).caloriesBurned;
  const instructionsList = workout.instructions || [];

  const specs: Array<[string, string]> = [
    ["Equipment", workout.equipment],
    ["Difficulty", workout.difficulty],
    ["Sets", String(workout.sets)],
    ["Reps", workout.reps],
    ["Duration", `${duration} min`], 
    ["Calories", `${calories} kcal`], 
    ["Rating", workout.rating ? workout.rating.toFixed(1) : "0.0"], 
  ];

  return (
    <PageShell>
      <div className="mx-auto w-full max-w-[1280px] px-4 pt-12 sm:px-6">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-panel-line bg-panel-media shadow-media lg:aspect-[588/735]">
            <Image
              src={imageUrl} 
              alt={`Illustration for ${workout.name}`}
              fill
              unoptimized 
              priority
              sizes="(min-width: 1024px) 588px, 100vw"
              className="object-cover"
            />
          </div>

          <div>
            <h1 className="font-display text-4xl font-bold uppercase leading-10 tracking-[-0.9px] text-white">
              {workout.name}
            </h1>
            <p className="mt-3 max-w-[576px] text-base leading-6 text-ink-muted">
              {workout.description}
            </p>

            <ul className="mt-5 flex flex-wrap gap-2.5" aria-label="Muscle groups">
             
              {musclesList.map((m: string) => (
                <li key={m}>
                  <MuscleChip size="detail">{m}</MuscleChip>
                </li>
              ))}
            </ul>

            <dl className="mt-7 overflow-hidden rounded-2xl border border-panel-line bg-panel">
              {specs.map(([label, value]) => (
                <div
                  key={label}
                  className="flex h-12 items-center justify-between border-t border-panel-line px-6 first:border-t-0"
                >
                  <dt className="text-xs font-bold uppercase leading-4 tracking-[0.6px] text-ink-muted">
                    {label}
                  </dt>
                  <dd className="text-sm font-medium leading-5 text-ink-soft2">{value}</dd>
                </div>
              ))}
            </dl>

            <section className="mt-8">
              <h2 className="text-base font-extrabold uppercase leading-6 tracking-[0.8px] text-white">
                Instructions
              </h2>
              <ol className="mt-4 space-y-3">
               
                {instructionsList.map((step: string, i: number) => (
                  <li key={step} className="flex gap-2 text-sm leading-[22.75px]">
                    <span className="text-ink-muted" aria-hidden="true">
                      {i + 1}.
                    </span>
                    <span className="text-ink-soft">{step}</span>
                  </li>
                ))}
              </ol>
            </section>

            <div className="mt-9">
              <WorkoutActions slug={workout.slug || String(workout.id)} />
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}