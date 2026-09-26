import Image from "next/image";
import { PageShell } from "@/components/PageShell";
import { WorkoutCard } from "@/components/WorkoutCard";
import { getWorkouts } from "@/lib/workouts"; 


export default async function HomePage() {
  const workouts = await getWorkouts(); 

  return (
    <PageShell tone="home">
      <div className="mx-auto w-full max-w-[1280px] px-4 pt-12 sm:px-6">
        {/* Hero */}
        <section className="flex flex-col items-start gap-10 rounded-2xl border border-card-line bg-card p-8 md:min-h-[448px] md:flex-row md:items-center md:justify-between md:px-14 md:py-0">
          <div className="max-w-[558px]">
            <p className="text-[11px] font-bold uppercase leading-4 tracking-[1.1px] text-accent">
              Workout Library
            </p>
            <h1 className="mt-5 font-display text-[40px] font-bold uppercase leading-none tracking-[-1px] text-white sm:text-5xl lg:text-[60px] lg:tracking-[-1.5px]">
              Train with intent. Log
              <br className="hidden lg:block" /> every set.
            </h1>
            <p className="mt-5 max-w-[512px] text-base leading-6 text-ink-muted">
              FitLog is a dark, no-nonsense gym companion: pick a lift, lock it into today&apos;s
              plan, and watch the week&apos;s work add up.
            </p>
            <a
              href="#library"
              className="mt-7 inline-flex h-10 items-center rounded-md bg-accent px-6 text-xs font-bold uppercase tracking-[0.3px] text-black shadow-sm transition-opacity hover:opacity-90"
            >
              Browse workouts
            </a>
          </div>

          <Image
            src="/images/banner.png"
            alt="Preacher curl machine with the working arm muscles highlighted"
            width={334}
            height={334}
            priority
            className="h-auto w-56 shrink-0 self-center md:w-[334px]"
          />
        </section>

        {/* Library */}
        <section id="library" className="mt-16 scroll-mt-28">
          <header>
            <h2 className="font-display text-3xl font-bold uppercase leading-9 tracking-[-0.75px] text-white">
              The Library
            </h2>
            <p className="mt-1 text-sm leading-5 text-ink-muted">
              {workouts.length} lifts covering every major muscle group.
            </p>
          </header>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {workouts.map((w) => (
              <WorkoutCard key={w.slug || w.id} workout={w} />
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  );
}