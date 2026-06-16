"use client"

import { useState, useEffect, useRef } from "react"
import type { AppWindow } from "@/types"

const spotlightApps = [
  { id: "safari", title: "Safari", icon: "/safari.png", component: "Safari" },
  { id: "mail", title: "Mail", icon: "/mail.png", component: "Mail" },
  { id: "vscode", title: "VS Code", icon: "/vscode.png", component: "VSCode" },
  { id: "notes", title: "Notes", icon: "/notes.png", component: "Notes" },
  { id: "facetime", title: "FaceTime", icon: "/facetime.png", component: "FaceTime" },
  { id: "terminal", title: "Terminal", icon: "/terminal.png", component: "Terminal" },
  { id: "github", title: "GitHub", icon: "/github.png", component: "GitHub" },
  { id: "youtube", title: "YouTube", icon: "/youtube.png", component: "YouTube" },
  { id: "spotify", title: "Spotify", icon: "/spotify.png", component: "Spotify" },
  { id: "snake", title: "Snake", icon: "/snake.png", component: "Snake" },
  { id: "weather", title: "Weather", icon: "/weather.png", component: "Weather" },
]

interface SpotlightProps {
  onClose: () => void
  onAppClick: (app: AppWindow) => void
}

export default function Spotlight({ onClose, onAppClick }: SpotlightProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredApps, setFilteredApps] = useState(spotlightApps)
  const [selectedIndex, setSelectedIndex] = useState(0)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsContainerRef = useRef<HTMLDivElement>(null)

  // Стабильный фокус при монтировании
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Фильтрация элементов
  useEffect(() => {
    const filtered = spotlightApps.filter((app) =>
      app.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredApps(filtered)
    setSelectedIndex(0) 
  }, [searchTerm])

  // Обработка клавиатуры (Один стабильный listener)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
        return
      }

      if (filteredApps.length === 0) return

      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev < filteredApps.length - 1 ? prev + 1 : 0)) // Циклический скролл вниз
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredApps.length - 1)) // Циклический скролл вверх
      } else if (e.key === "Enter") {
        e.preventDefault()
        handleAppClick(filteredApps[selectedIndex])
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [filteredApps, selectedIndex])

  // Автоматический скролл к выбранному элементу стрелочками
  useEffect(() => {
    if (resultsContainerRef.current) {
      const activeElement = resultsContainerRef.current.children[selectedIndex] as HTMLElement
      if (activeElement) {
        activeElement.scrollIntoView({
          block: "nearest",
        })
      }
    }
  }, [selectedIndex])

  const handleAppClick = (app: typeof spotlightApps[0]) => {
    onAppClick({
      id: app.id,
      title: app.title,
      component: app.component,
      position: { x: Math.random() * 150 + 150, y: Math.random() * 80 + 60 },
      size: { width: 900, height: 650 },
    })
    onClose()
  }

  return (
    <div 
      className="fixed inset-0 bg-black/10 dark:bg-transparent z-50 flex items-start justify-center pt-[15vh] select-none" 
      onClick={onClose}
    >
      {/* Главный контейнер в стиле macOS Glassmorphism */}
      <div
        className="w-full max-w-[680px] bg-[#1e1e1e]/75 dark:bg-[#2d2d2d]/70 backdrop-blur-3xl rounded-2xl overflow-hidden shadow-[0_25px_70px_-15px_rgba(0,0,0,0.7)] border border-white/10 dark:border-white/[0.06]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Поле ввода */}
        <div className="relative flex items-center h-14">
          <svg
            className="absolute left-4 text-white/40 w-[22px] h-[22px]"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Spotlight Search"
            className="w-full bg-transparent text-white border-0 pl-13 pr-4 focus:outline-none text-[20px] font-light tracking-wide placeholder:text-white/25"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Результаты поиска */}
        {filteredApps.length > 0 && (
          <div 
            ref={resultsContainerRef}
            className="max-h-[360px] overflow-y-auto border-t border-white/[0.08] p-2 space-y-[2px] custom-scrollbar"
          >
            {filteredApps.map((app, index) => {
              const isSelected = index === selectedIndex
              return (
                <div
                  key={app.id}
                  className={`flex items-center h-10 px-3 rounded-lg cursor-pointer transition-colors duration-700 ${
                    isSelected 
                      ? "bg-blue-600 text-white font-medium shadow-sm shadow-blue-600/20" 
                      : "text-white/90 hover:bg-white/[0.05]"
                  }`}
                  onClick={() => handleAppClick(app)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="w-6 h-6 flex items-center justify-center mr-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]">
                    <img 
                      src={app.icon || "/placeholder.svg"} 
                      alt={app.title} 
                      className="w-full h-full object-contain" 
                    />
                  </div>
                  <span className="text-[13.5px] tracking-wide">{app.title}</span>
                  
                  {isSelected && (
                    <span className="ml-auto text-[10px] text-white/50 bg-white/10 px-1.5 py-0.5 rounded uppercase font-sans tracking-wider">
                      Return
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 9999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        .pl-13 {
          padding-left: 52px;
        }
      `}</style>
    </div>
  )
}