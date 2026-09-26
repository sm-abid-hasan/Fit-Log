import type { ReactNode } from "react";
import { Toaster } from "react-hot-toast"; 
import { cn } from "@/lib/cn";
import { Footer } from "./Footer";
import { Header } from "./Header";

interface PageShellProps {
  children: ReactNode;
  tone?: "home" | "default";
  narrow?: boolean;
  footerGap?: boolean;
}

export function PageShell({
  children,
  tone = "default",
  narrow = false,
  footerGap = true,
}: PageShellProps) {
  return (
    <div className={cn("flex min-h-screen flex-col", tone === "home" ? "bg-page-home" : "bg-page")}>
      <Header tone={tone} narrow={narrow} />
      
      <main className={cn("flex-1", footerGap && "pb-16")}>{children}</main>
      
      <Footer tone={tone} narrow={narrow} />
      
      <Toaster 
        position="top-right" 
        reverseOrder={false}
        toastOptions={{
          style: { 
            background: "#1f2937", 
            color: "#ffffff", 
            fontSize: "14px",
            border: "1px solid #374151",
            marginTop: "60px",
            zIndex: 999999 
          },
        }} 
      />
    </div>
  );
}