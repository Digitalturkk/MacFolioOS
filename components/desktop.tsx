"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"

import Wallpaper from "@/components/wallpaper"
import type { AppWindow } from "@/types"

const Menubar = dynamic(() => import("@/components/menubar"), { ssr: false })
const Window = dynamic(() => import("@/components/window"), { ssr: false })
const Dock = dynamic(() => import("@/components/dock"), { ssr: false })
const Launchpad = dynamic(() => import("@/components/launchpad"), { ssr: false })
const ControlCenter = dynamic(() => import("@/components/control-center"), { ssr: false })
const Spotlight = dynamic(() => import("@/components/spotlight"), { ssr: false })

interface DesktopProps {
  onLogout: () => void
  onSleep: () => void
  onShutdown: () => void
  onRestart: () => void
  initialDarkMode: boolean
  onToggleDarkMode: () => void
  initialBrightness: number
  onBrightnessChange: (value: number) => void
}

export default function Desktop({
  onLogout,
  onSleep,
  onShutdown,
  onRestart,
  initialDarkMode,
  onToggleDarkMode,
  initialBrightness,
  onBrightnessChange,
}: DesktopProps) {
  const [time, setTime] = useState<Date | null>(null)
  const [openWindows, setOpenWindows] = useState<AppWindow[]>([])
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null)
  const [showLaunchpad, setShowLaunchpad] = useState(false)
  const [showControlCenter, setShowControlCenter] = useState(false)
  const [showSpotlight, setShowSpotlight] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(initialDarkMode)
  const [screenBrightness, setScreenBrightness] = useState(initialBrightness)
  
  // Стейт для отслеживания мобильных устройств в рантайме
  const [isMobile, setIsMobile] = useState(false)
  const desktopRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setTime(new Date())
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    // Проверка брейкпоинта (md = 768px по сетке Tailwind)
    const handleResize = () => {
      setIsMobile(globalThis.innerWidth < 768)
    }

    handleResize() // Первичный запуск на клиенте
    globalThis.addEventListener("resize", handleResize)

    return () => {
      clearInterval(timer)
      globalThis.removeEventListener("resize", handleResize)
    }
  }, [])

  useEffect(() => {
    setIsDarkMode(initialDarkMode)
  }, [initialDarkMode])

  useEffect(() => {
    setScreenBrightness(initialBrightness)
  }, [initialBrightness])

  const openApp = (app: AppWindow) => {
    const isOpen = openWindows.some((window) => window.id === app.id)

    if (!isOpen) {
      // Адаптивные дефолтные размеры: на мобилках растягиваем во весь экран, на десктопе — классический размер
      const defaultWindow: AppWindow = {
        ...app,
        position: isMobile ? { x: 0, y: 26 } : (app.position || { x: 120, y: 80 }),
        size: isMobile 
          ? { width: globalThis.innerWidth, height: globalThis.innerHeight - 26 - 75 } 
          : (app.size || { width: 850, height: 600 }),
        isMaximized: isMobile,
      }
      setOpenWindows((prev) => [...prev, defaultWindow])
    }

    setActiveWindowId(app.id)
    if (showLaunchpad) setShowLaunchpad(false)
  }

  const closeWindow = (id: string) => {
    setOpenWindows((prev) => prev.filter((window) => window.id !== id))

    if (activeWindowId === id && openWindows.length > 1) {
      const remainingWindows = openWindows.filter((window) => window.id !== id)
      setActiveWindowId(remainingWindows[remainingWindows.length - 1].id)
    } else if (openWindows.length <= 1) {
      setActiveWindowId(null)
    }
  }

  const setActiveWindow = (id: string) => {
    setActiveWindowId(id)
    setOpenWindows((prev) => {
      const target = prev.find((w) => w.id === id)
      if (!target) return prev
      return [...prev.filter((w) => w.id !== id), target]
    })
  }

  const updateWindow = (id: string, updates: Partial<AppWindow>) => {
    setOpenWindows((prev) =>
      prev.map((window) => (window.id === id ? { ...window, ...updates } : window))
    )
  }

  const toggleLaunchpad = () => {
    setShowLaunchpad(!showLaunchpad)
    if (showControlCenter) setShowControlCenter(false)
    if (showSpotlight) setShowSpotlight(false)
  }

  const toggleControlCenter = () => {
    setShowControlCenter(!showControlCenter)
    if (showSpotlight) setShowSpotlight(false)
  }

  const toggleSpotlight = () => {
    setShowSpotlight(!showSpotlight)
    if (showControlCenter) setShowControlCenter(false)
  }

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    onToggleDarkMode()
  }

  const updateBrightness = (value: number) => {
    setScreenBrightness(value)
    onBrightnessChange(value)
  }

  const handleDesktopClick = (e: React.MouseEvent) => {
    if (e.target === desktopRef.current) {
      setActiveWindowId(null)
      if (showControlCenter) setShowControlCenter(false)
      if (showSpotlight) setShowSpotlight(false)
    }
  }

  return (
    <div className="relative select-none h-screen w-screen overflow-hidden">
      <div
        ref={desktopRef}
        className={`relative h-full w-full overflow-hidden ${isDarkMode ? "dark" : ""}`}
        onClick={handleDesktopClick}
      >
        {/* Задний фон */}
        <Wallpaper isDarkMode={isDarkMode} />

        {/* Верхняя панель меню (Menubar умеет скрывать лишние элементы на мобилках через медиа-запросы) */}
        <Menubar
          time={time || new Date()}
          onLogout={onLogout}
          onSleep={onSleep}
          onShutdown={onShutdown}
          onRestart={onRestart}
          onSpotlightClick={toggleSpotlight}
          onControlCenterClick={toggleControlCenter}
          isDarkMode={isDarkMode}
          activeWindow={activeWindowId ? openWindows.find((w) => w.id === activeWindowId) || null : null}
        />

        {/* Рабочая область окон */}
        {/* На мобильных уменьшаем padding-bottom, чтобы максимизировать контент над уменьшенным Доком */}
        <div className={`absolute inset-0 pt-6 ${isMobile ? "pb-16" : "pb-20"} pointer-events-none`}>
          <div className="relative w-full h-full pointer-events-auto">
            {openWindows.map((window) => (
              <Window
                key={window.id}
                window={window}
                isActive={activeWindowId === window.id}
                onClose={() => closeWindow(window.id)}
                onFocus={() => setActiveWindow(window.id)}
                onUpdate={updateWindow}
                isDarkMode={isDarkMode}
              >
                <div className="w-full h-full text-sm">
                  {window.title} Content Area
                </div>
              </Window>
            ))}
          </div>
        </div>

        {/* Утилиты и Лаунчпад */}
        {showLaunchpad && <Launchpad onAppClick={openApp} onClose={() => setShowLaunchpad(false)} />}

        {showControlCenter && (
          <div className="fixed md:absolute inset-x-0 md:inset-x-auto top-10 md:right-2 flex justify-center md:block px-4 md:px-0 z-50 pointer-events-none">
            <div className="pointer-events-auto w-full max-w-[340px] md:w-auto">
              <ControlCenter
                onClose={() => setShowControlCenter(false)}
                isDarkMode={isDarkMode}
                onToggleDarkMode={toggleDarkMode}
                brightness={screenBrightness}
                onBrightnessChange={updateBrightness}
              />
            </div>
          </div>
        )}

        {showSpotlight && (
          <div className="fixed md:absolute inset-x-0 top-16 flex justify-center px-4 md:px-0 z-50 pointer-events-none">
            <div className="pointer-events-auto w-full max-w-[500px]">
              <Spotlight onClose={() => setShowSpotlight(false)} onAppClick={openApp} />
            </div>
          </div>
        )}

        {/* Нижний Док */}
        <Dock
          onAppClick={openApp}
          onLaunchpadClick={toggleLaunchpad}
          activeAppIds={openWindows.map((w) => w.id)}
          isDarkMode={isDarkMode}
        />
      </div>

      {/* Оверлей яркости */}
      <div
        className="absolute inset-0 bg-black pointer-events-none z-[9999] transition-opacity duration-200"
        style={{ opacity: Math.max(0, (100 - screenBrightness) / 130) }}
      />
    </div>
  )
}