import { cn } from "@/lib/cn";


export function MuscleChip({
  children,
  size = "card",
}: {
  children: React.ReactNode;
  size?: "card" | "detail";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-accent text-black",
        size === "card"
          ? "px-2.5 py-0.5 text-[11px] font-bold uppercase leading-4 tracking-[0.55px]"
          : "px-3.5 py-1 text-xs font-semibold leading-4",
      )}
    >
      {children}
    </span>
  );
}
