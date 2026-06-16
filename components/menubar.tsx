"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Search, Wifi, WifiOff } from "lucide-react"
import { AppleIcon } from "@/components/icons"
import Spotlight from "./spotlight"

interface MenubarProps {
  time: Date
  onLogout: () => void
  onSleep: () => void
  onShutdown: () => void
  onRestart: () => void
  onSpotlightClick: () => void
  onControlCenterClick: () => void
  isDarkMode: boolean
  activeWindow: { id: string; title: string } | null
}

export default function Menubar({
  time,
  onLogout,
  onSleep,
  onShutdown,
  onRestart,
  onSpotlightClick,
  onControlCenterClick,
  isDarkMode,
  activeWindow,
}: MenubarProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [showWifiToggle, setShowWifiToggle] = useState(false)
  const [wifiEnabled, setWifiEnabled] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  
  const menuRef = useRef<HTMLDivElement>(null)
  const wifiRef = useRef<HTMLDivElement>(null)

  // Адаптивное форматирование времени
  const formattedTime = time.toLocaleString("en-US", {
    weekday: isMobile ? undefined : "short", // Прячем день недели на смартфонах
    month: isMobile ? undefined : "short",   // Прячем месяц на смартфонах
    day: isMobile ? undefined : "numeric",   // Прячем число
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })

  useEffect(() => {
    // Отслеживание ширины экрана для скрытия элементов статус-бара
    const checkMobile = () => {
      setIsMobile(globalThis.innerWidth < 768)
    }
    checkMobile()
    globalThis.addEventListener("resize", checkMobile)

    const savedWifi = localStorage.getItem("wifiEnabled")
    if (savedWifi !== null) {
      setWifiEnabled(savedWifi === "true")
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null)
      }
      if (
        wifiRef.current &&
        !wifiRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest(".wifi-icon-btn")
      ) {
        setShowWifiToggle(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      globalThis.removeEventListener("resize", checkMobile)
    }
  }, [])

  const toggleMenu = (menuName: string) => {
    setActiveMenu(activeMenu === menuName ? null : menuName)
  }

  const toggleWifiPopup = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowWifiToggle(!showWifiToggle)
    setActiveMenu(null)
  }

  const toggleWifi = () => {
    const newState = !wifiEnabled
    setWifiEnabled(newState)
    localStorage.setItem("wifiEnabled", newState.toString())
  }

  const menuBgClass = isDarkMode 
    ? "bg-black/[0.15] border-white/[0.04] shadow-[0_0_1px_rgba(255,255,255,0.15)_inset,0_1px_4px_rgba(0,0,0,0.2)]" 
    : "bg-white/[0.3] border-white/[0.4] shadow-[0_0_1px_rgba(255,255,255,0.5)_inset,0_1px_4px_rgba(0,0,0,0.08)]"

  const dropdownBgClass = isDarkMode
    ? "bg-gray-950/[0.7] border-white/[0.08] shadow-[0_0_1px_rgba(255,255,255,0.2)_inset,0_12px_30px_rgba(0,0,0,0.4)]"
    : "bg-white/[0.65] border-white/[0.6] shadow-[0_0_1px_rgba(255,255,255,0.6)_inset,0_12px_30px_rgba(0,0,0,0.1)]"

  const textClass = isDarkMode ? "text-slate-100" : "text-slate-900"
  const hoverItemClass = isDarkMode ? "hover:bg-sky-500/80 hover:text-white" : "hover:bg-sky-500/90 hover:text-white"
  const dividerClass = isDarkMode ? "border-white/[0.06]" : "border-black/[0.06]"

 // Увеличьте базовые размеры в классах:
return (
  <div
    ref={menuRef}
    className={`fixed top-0 left-0 right-0 h-8 max-h-8 ${menuBgClass} backdrop-blur-[24px] border-b z-50 flex items-center justify-between px-4 md:px-5 ${textClass} text-[14px] font-medium select-none transition-all duration-300 box-border`}
  >
    {/* Левая сторона: Увеличенные кнопки меню */}
    <div className="flex items-center space-x-1 md:space-x-2 h-full">
      <button
        className={`flex items-center justify-center h-6 w-9 rounded-md transition-colors ${activeMenu === "apple" ? "bg-white/[0.12]" : "hover:bg-white/[0.08]"}`}
        onClick={() => toggleMenu("apple")}
      >
        <AppleIcon className="w-4 h-4 fill-current" />
      </button>

      {activeWindow && (
        <button
          className={`px-3 h-6 font-semibold rounded-md transition-colors truncate max-w-[120px] sm:max-w-[200px] ${activeMenu === "app" ? "bg-white/[0.12]" : "hover:bg-white/[0.08]"}`}
          onClick={() => toggleMenu("app")}
        >
          {activeWindow.title}
        </button>
      )}
    </div>

    {/* Правая сторона: Статус-бар */}
    <div className="flex items-center space-x-3 md:space-x-5 h-full text-[13px]">

      <button className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white/[0.08]" onClick={onSpotlightClick}>
        <Search className="w-4 h-4" />
      </button>

      {/* Wi-Fi & Control Center — увеличено */}
      <button className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white/[0.08]" onClick={toggleWifiPopup}>
        {wifiEnabled ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4 text-rose-400" />}
      </button>

      <button className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white/[0.08]" onClick={onControlCenterClick}>
        <img src="/control-center-icon.webp" alt="CC" className="w-4 h-4" style={{ filter: isDarkMode ? "invert(1)" : "none" }} />
      </button>

      {/* Время — основной элемент */}
      <span className="px-2 py-0.5 rounded-md hover:bg-white/[0.08] cursor-default h-6 flex items-center font-semibold text-[13px]">
        {formattedTime}
      </span>
    </div>
  </div>
)
}