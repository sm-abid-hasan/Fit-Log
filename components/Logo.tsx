import Link from "next/link";
import Image from "next/image"; // 

export function LogoMark({ size = 28 }: { size?: number }) {
  return (
   
    <Image
      src="/images/logo.png"
      alt="FitLog Logo"
      width={size}
      height={size}
      className="object-contain"
    />
  );
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
   
    <Link href="/" className="flex items-center gap-2.5" aria-label="FitLog home">
      <LogoMark size={compact ? 20 : 28} />
      <span
        className={
          compact
            ? "font-display text-sm font-bold leading-5 tracking-[0.7px] text-white"
            : "font-display text-xl font-bold leading-7 tracking-[1px] text-white"
        }
      >
        FITLOG
      </span>
    </Link>
  );
}