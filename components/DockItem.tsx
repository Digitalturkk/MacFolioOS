"use client";

import React, { useMemo, useRef } from "react";

interface DockItemProps {
  app: any;
  isMobile: boolean;
  mouseX: number | null;
  isActive: boolean;
  onClick: () => void;
}

export const DockItem = ({ app, isMobile, mouseX, isActive, onClick }: DockItemProps) => {
  const elRef = useRef<HTMLDivElement>(null);

  const { scale, width, translateY } = useMemo(() => {
    if (mouseX === null || isMobile || !elRef.current) 
      return { scale: 1, width: 64, translateY: 0 };

    const rect = elRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const distance = Math.min(Math.abs(mouseX - centerX), 150);
    
    const maxScale = 1.65;
    const maxDistance = 150;

    const scale = 1 + (maxScale - 1) * Math.pow(1 - distance / maxDistance, 2);
    const translateY = (scale - 1) * -25;
    const width = 64 * (scale * 0.88 + 0.12);

    return { scale, width, translateY };
  }, [mouseX, isMobile]);

  return (
    <div
      ref={elRef}
      className="relative flex flex-col items-center justify-end h-full transition-[width] duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]"
      style={{ width: mouseX === null ? 64 : width }}
      onClick={onClick}
    >
      <div 
        className="relative origin-bottom transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] group"
        style={{ transform: `translateY(${isMobile ? 0 : translateY}px) scale(${isMobile ? 1 : scale})` }}
      >
        <img 
          src={app.icon} 
          alt={app.title} 
          className="w-16 h-16 object-contain select-none"
          draggable="false"
        />
        {/* Tooltip */}
        {!isMobile && (
          <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
            {app.title}
          </div>
        )}
      </div>

      {isActive && (
        <div className={`absolute -bottom-2 w-1 h-1 rounded-full bg-white/80 transition-all ${scale > 1.2 ? "w-2 h-1 bg-sky-400 shadow-[0_0_8px_#38bdf8]" : ""}`} />
      )}
    </div>
  );
};