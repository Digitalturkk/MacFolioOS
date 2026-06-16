"use client";

import React, { useState, useEffect, useRef } from "react";
import { MoreHorizontal } from "lucide-react";
import { DockItem } from "./DockItem";

const dockApps = [
  { id: "launchpad", title: "Launchpad", icon: "/launchpad.png", component: "Launchpad", breakBefore: false },
  { id: "safari", title: "Safari", icon: "/safari.png", component: "Safari", breakBefore: false },
  { id: "facetime", title: "Resume", icon: "/digisamu.png", component: "FaceTime", breakBefore: false },
  { id: "notes", title: "Notes (CV)", icon: "/notes.png", component: "Notes", breakBefore: false },
  { id: "mail", title: "Mail", icon: "/mail.png", component: "Mail", breakBefore: false },
  { id: "vscode", title: "VS Code", icon: "/vscode.png", component: "VSCode", breakBefore: false },
  { id: "terminal", title: "Terminal", icon: "/terminal.png", component: "Terminal", breakBefore: false },
  { id: "github", title: "GitHub", icon: "/github.png", component: "GitHub", breakBefore: true },
  { id: "youtube", title: "YouTube", icon: "/youtube.png", component: "YouTube", breakBefore: false },
  { id: "spotify", title: "Spotify", icon: "/spotify.png", component: "Spotify", breakBefore: false },
];

export default function Dock({ onAppClick, onLaunchpadClick, activeAppIds = [], isDarkMode = true }: any) {
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0 });

  useEffect(() => {
    const handleResize = () => setDimensions({ width: window.innerWidth });
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = dimensions.width < 768;

  return (
    <section className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div 
        className={`flex items-end px-4 py-2 rounded-[24px] backdrop-blur-[32px] gap-2.5 transition-all duration-200 ease-out
          ${isDarkMode 
            ? "bg-black/20 shadow-[0_20px_40px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05)_inset]" 
            : "bg-white/30 shadow-[0_20px_40px_rgba(0,0,0,0.2),0_0_0_1px_rgba(255,255,255,0.5)_inset]"
          }`}
        style={{ height: '88px' }}
        onMouseMove={(e) => setMouseX(e.clientX)}
        onMouseLeave={() => setMouseX(null)}
      >
        {dockApps.map((app) => (
          <React.Fragment key={app.id}>
            {app.breakBefore && !isMobile && (
              <div className="h-10 w-[1px] bg-black/10 dark:bg-white/10 mx-1.5 self-center" />
            )}
            <DockItem 
              app={app} 
              isMobile={isMobile}
              mouseX={mouseX} 
              isActive={activeAppIds.includes(app.id)} 
              onClick={() => app.id === "launchpad" ? onLaunchpadClick() : onAppClick(app)} 
            />
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}