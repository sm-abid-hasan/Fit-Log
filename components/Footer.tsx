import { cn } from "@/lib/cn";
import { LogoMark } from "./Logo";

interface FooterProps {
  tone?: "home" | "default";
  narrow?: boolean;
}

export function Footer({ tone = "default", narrow = false }: FooterProps) {
  return (
    <footer
      className={cn(
        "border-t border-rule-footer",
        tone === "home" ? "bg-page-footer" : "bg-page",
      )}
    >
      <div
        className={cn(
          "mx-auto flex w-full max-w-[1280px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
          narrow ? "px-4 py-6 sm:px-12" : "px-4 py-8 sm:px-6",
          tone === "home" && "sm:py-10",
        )}
      >
        <div className="flex items-center gap-2">
          <LogoMark size={20} />
          <span className="font-display text-sm font-bold leading-5 tracking-[0.7px] text-white">
            FITLOG
          </span>
        </div>
        <p className="text-xs leading-4 text-ink-subtle">
          © 2026 FitLog — Workout Library. Train hard, log honest.
        </p>
      </div>
    </footer>
  );
}
