"use client";

import { BackgroundLines } from "@/components/ui/background-lines";

export default function LayoutBackground({ children }: { children: React.ReactNode }) {
  return (
    <BackgroundLines className="min-h-screen w-full flex flex-col" svgOptions={{ duration: 15 }}>
      {children}
    </BackgroundLines>
  );
}
