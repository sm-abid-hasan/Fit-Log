import Link from "next/link";
import { PageShell } from "@/components/PageShell";

export default function NotFound() {
 return (
    <PageShell>
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
     
        <h1 className="font-display text-7xl font-bold text-accent">404</h1>
        <h2 className="mt-4 text-2xl font-bold text-white uppercase tracking-wide">
          Page Not Found
        </h2>
        
        
        <p className="mt-3 text-sm text-ink-muted">
          The page you are looking for doesn't exist or has been moved.
        </p>
        
       
        <Link 
          href="/" 
          className="mt-8 inline-flex h-11 items-center rounded-xl bg-accent px-6 text-sm font-semibold text-black shadow-sm transition-opacity hover:opacity-90"
        >
          Go back home
        </Link>
      </div>
    </PageShell>
  );
}