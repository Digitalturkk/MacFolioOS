"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import type { AppWindow } from "@/types"

const launchpadApps = [
  { id: "safari", title: "Safari", icon: "/safari.png", component: "Safari" },
  { id: "mail", title: "Mail", icon: "/mail.png", component: "Mail" },
  { id: "vscode", title: "VS Code", icon: "/vscode.png", component: "VSCode" },
  { id: "notes", title: "Notes", icon: "/notes.png", component: "Notes" },
  { id: "facetime", title: "Resume", icon: "/digisamu.png", component: "FaceTime" },
  { id: "terminal", title: "Terminal", icon: "/terminal.png", component: "Terminal" },
  { id: "github", title: "GitHub", icon: "/github.png", component: "GitHub" },
  { id: "youtube", title: "YouTube", icon: "/youtube.png", component: "YouTube" },
  { id: "spotify", title: "Spotify", icon: "/spotify.png", component: "Spotify" },
  { id: "snake", title: "Snake", icon: "/snake.png", component: "Snake" },
  { id: "weather", title: "Weather", icon: "/weather.png", component: "Weather" },
]

interface LaunchpadProps {
  onAppClick: (app: AppWindow) => void
  onClose: () => void
}

export default function Launchpad({ onAppClick, onClose }: LaunchpadProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredApps, setFilteredApps] = useState(launchpadApps)
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Отслеживаем ширину экрана для адаптивного рендеринга размеров окон
  useEffect(() => {
    setIsVisible(true)

    const checkMobile = () => {
      setIsMobile(globalThis.innerWidth < 768)
    }
    
    checkMobile()
    globalThis.addEventListener("resize", checkMobile)
    
    return () => globalThis.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    if (searchTerm) {
      setFilteredApps(
        launchpadApps.filter((app) =>
          app.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    } else {
      setFilteredApps(launchpadApps)
    }
  }, [searchTerm])

  const handleAppClick = (app: (typeof launchpadApps)[0]) => {
    // Интеллектуальный расчет геометрии окна в зависимости от устройства
    const windowWidth = isMobile ? globalThis.innerWidth : 850
    const windowHeight = isMobile ? globalThis.innerHeight - 26 - 75 : 600
    const positionX = isMobile ? 0 : Math.random() * 140 + 80
    const positionY = isMobile ? 26 : Math.random() * 80 + 40

    onAppClick({
      id: app.id,
      title: app.title,
      component: app.component,
      position: { x: positionX, y: positionY },
      size: { width: windowWidth, height: windowHeight },
      isMaximized: isMobile, // Принудительный фуллскрин на мобилках
    })
    handleClose()
  }

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 250)
  }

  return (
    <div
      className={`fixed inset-0 z-40 flex flex-col items-center justify-start pt-16 md:pt-24 select-none
        bg-black/[0.3] backdrop-blur-[35px] transition-all duration-300 ease-out pb-8 overflow-y-auto
        before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/[0.03] before:to-transparent before:pointer-events-none
        ${isVisible ? "opacity-100" : "opacity-0 backdrop-blur-none"}`}
      onClick={handleClose}
    >
      <div
        className={`w-full max-w-5xl px-6 md:px-12 transition-all duration-300 ease-out transform
          ${isVisible ? "scale-100 translate-y-0" : "scale-[0.97] translate-y-4"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Liquid Glass Search Input */}
        <div className="relative w-full max-w-[260px] mx-auto mb-10 md:mb-16 group px-2">
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-white/[0.07] border border-white/[0.08] backdrop-blur-xl text-white placeholder-white/40 rounded-full py-1.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400/30 focus:bg-white/[0.12] transition-all duration-200 shadow-[0_0_1px_rgba(255,255,255,0.2)_inset,0_4px_12px_rgba(0,0,0,0.2)]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus={!isMobile} // Отключаем автофокус на мобилках, чтобы не вылетала клавиатура сразу при открытии лаунчпада
          />
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4 transition-colors group-focus-within:text-sky-400" />
        </div>

        {/* Apps Grid */}
        {/* Оптимизировали сетку: grid-cols-3 на самых маленьких экранах, чтобы иконки не сжимались, grid-cols-4 на sm */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-y-8 sm:gap-y-10 gap-x-4 md:gap-x-6">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className="flex flex-col items-center justify-center cursor-pointer group active:scale-95 md:active:scale-100 transition-transform"
              onClick={() => handleAppClick(app)}
            >
              {/* Icon Container with Fluid Adaptive Frame */}
              {/* На мобилках контейнер уменьшен до w-16 h-16, на md: возвращается к w-20 h-20 */}
              <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mb-2 rounded-xl md:rounded-2xl relative border border-transparent transition-all duration-200 ease-out md:group-hover:scale-105 md:group-hover:bg-white/[0.06] md:group-hover:border-white/[0.08] md:group-hover:shadow-[0_0_1px_rgba(255,255,255,0.3)_inset,0_8px_20px_rgba(0,0,0,0.2)]">
                <img
                  src={app.icon || "/placeholder.svg"}
                  alt={app.title}
                  className="w-11 h-11 md:w-14 md:h-14 object-contain filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)] md:group-hover:drop-shadow-[0_8px_16px_rgba(0,0,0,0.3)]"
                  draggable="false"
                />
              </div>

              {/* Text */}
              <span className="text-white/90 text-[11px] md:text-xs font-medium text-center tracking-wide filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] transition-colors md:group-hover:text-white max-w-full truncate px-1">
                {app.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}