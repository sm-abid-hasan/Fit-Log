export type Muscle = "Chest" | "Back" | "Legs" | "Shoulders" | "Arms" | "Core";
export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export interface Workout {
  id:number;
  slug: string;
  name: string;
  equipment: string;
  muscles: Muscle[];
  minutes: number;
  kcal: number;
  rating: number;
  difficulty: Difficulty;
  sets: number;
  reps: string;
  description: string;
  instructions: string[];
}

export const WORKOUT_IMAGE = "/images/workout.webp";


export async function getWorkouts(): Promise<Workout[]> {
  try {
    const res = await fetch("https://api.api-store.workers.dev/api/fitlog", {
      next: { revalidate: 3600 }, 
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch workouts:", error);
    return [];
  }
}


export async function getWorkout(idOrSlug: string): Promise<Workout | undefined> {
  try {
    const res = await fetch(`https://api.api-store.workers.dev/api/fitlog/${idOrSlug}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return undefined;
    return res.json();
  } catch (error) {
    console.error(`Failed to fetch workout ${idOrSlug}:`, error);
    return undefined;
  }
}