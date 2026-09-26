"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { Logo } from "./Logo";
import { usePlan } from "./PlanProvider";

interface HeaderProps {
  tone?: "home" | "default";
  narrow?: boolean;
}

export function Header({ tone = "default", narrow = false }: HeaderProps) {
  const pathname = usePathname();
  const { plan, saved } = usePlan();

  const onHome = pathname === "/";
  const onPlan = pathname.startsWith("/my-plan");

  const navLink = (active: boolean) =>
    cn(
      "rounded-full px-4 py-1.5 text-xs transition-colors",
      active
        ? "bg-accent-tint font-semibold text-accent"
        : "font-medium text-ink-muted hover:text-white",
    );

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-rule-header backdrop-blur-md",
        tone === "home" ? "bg-page-home/95" : "bg-page/90",
      )}
    >
      <div
        className={cn(
          "mx-auto flex w-full max-w-[1280px] items-center justify-between gap-3",
          narrow ? "h-[66px] px-4 sm:px-12" : "h-20 px-4 sm:px-6",
        )}
      >
        <Logo />

        <nav aria-label="Primary" className="flex items-center">
          <Link href="/" aria-current={onHome ? "page" : undefined} className={navLink(onHome)}>
            Workouts
          </Link>
          <Link
            href="/my-plan"
            aria-current={onPlan ? "page" : undefined}
            className={navLink(onPlan)}
          >
            My Plan
          </Link>
        </nav>

        <div className="flex items-center gap-4 text-xs font-medium sm:gap-6">
          <Link
            href="/my-plan"
            className="flex items-center gap-2 text-ink-soft transition-colors hover:text-white"
          >
            <span className="hidden sm:inline">Plan</span>
            <span className="sr-only sm:hidden">Plan</span>
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1.5 text-[11px] font-bold text-black">
              {plan.length}
            </span>
          </Link>
          <Link
            href="/my-plan?tab=saved"
            className="flex items-center gap-2 text-ink-muted transition-colors hover:text-white"
          >
            <span className="hidden sm:inline">Saved</span>
            <span className="sr-only sm:hidden">Saved</span>
            <span className="grid h-5 min-w-5 place-items-center rounded-full border border-rule-chip px-1.5 text-[11px] font-medium text-ink-soft">
              {saved.length}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
