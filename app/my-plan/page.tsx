import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { PlanView, type PlanTab } from "@/components/PlanView";

export const metadata: Metadata = {
  title: "My Plan | FitLog",
  description: "Manage your daily workout plan and saved lifts.",
};

type Params = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function MyPlanPage({ searchParams }: { searchParams: Params }) {
  const resolvedParams = await searchParams;
  const tab = (resolvedParams.tab === "saved" ? "saved" : "plan") as PlanTab;

  return (
    <PageShell narrow>
      <div className="mx-auto w-full max-w-[1280px] px-4 pt-10 sm:px-12 sm:pt-14">
        {/* Page Header */}
        <header>
          <h1 className="font-display text-4xl font-bold uppercase leading-10 tracking-[-0.9px] text-white sm:text-5xl">
            My Plan
          </h1>
          <p className="mt-2 text-sm leading-5 text-ink-muted">
            Cap of five lifts for today. Finish them, then load more.
          </p>
        </header>

   
        <PlanView tab={tab} />
      </div>
    </PageShell>
  );
}