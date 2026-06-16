"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Wifi, Bluetooth, Moon, Sun, Volume2, VolumeX, Maximize, Airplay } from "lucide-react"

interface ControlCenterProps {
  onClose: () => void
  isDarkMode: boolean
  onToggleDarkMode: () => void
  brightness: number
  onBrightnessChange: (value: number) => void
}

export default function ControlCenter({
  onClose,
  isDarkMode,
  onToggleDarkMode,
  brightness,
  onBrightnessChange,
}: ControlCenterProps) {
  const [wifiEnabled, setWifiEnabled] = useState(true)
  const [bluetoothEnabled, setBluetoothEnabled] = useState(true)
  const [volume, setVolume] = useState(75)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const savedWifi = localStorage.getItem("wifiEnabled")
    if (savedWifi !== null) {
      setWifiEnabled(savedWifi === "true")
    }

    setIsFullscreen(!!document.fullscreenElement)

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  const toggleWifi = () => {
    const newState = !wifiEnabled
    setWifiEnabled(newState)
    localStorage.setItem("wifiEnabled", newState.toString())
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  // Динамические стили тем в зависимости от состояния десктопа
  const panelBg = isDarkMode 
    ? "bg-[#1d1d1f]/70 border-[#333333]/80 text-white" 
    : "bg-[#f5f5f7]/70 border-[#d2d2d7]/80 text-neutral-900"
  
  const cardBg = isDarkMode ? "bg-[#2d2d2f]/60" : "bg-white/80 shadow-sm"
  const textMuted = isDarkMode ? "text-neutral-400" : "text-neutral-500"
  const iconActiveColor = "text-white"
  const iconInactiveColor = isDarkMode ? "text-neutral-400" : "text-neutral-500"

  return (
    <div
      className={`fixed top-10 right-2 w-[320px] ${panelBg} backdrop-blur-2xl rounded-2xl p-3.5 border shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-50 select-none animate-in fade-in zoom-in-95 duration-150`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Верхний блок: Сеть + Спец. режимы */}
      <div className="grid grid-cols-2 gap-2.5 mb-2.5">
        
        {/* Левая большая плитка (Wi-Fi + Bluetooth) */}
        <div className={`p-3 rounded-2xl ${cardBg} flex flex-col justify-between h-[120px]`}>
          <div className="flex items-center space-x-3 cursor-pointer" onClick={toggleWifi}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${wifiEnabled ? "bg-[#0071e3]" : "bg-neutral-500/20"}`}>
              <Wifi className={`w-4 h-4 ${wifiEnabled ? iconActiveColor : iconInactiveColor}`} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold leading-tight">Wi-Fi</span>
              <span className={`text-[10px] ${textMuted} truncate`}>{wifiEnabled ? "Home_Network" : "Off"}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setBluetoothEnabled(!bluetoothEnabled)}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${bluetoothEnabled ? "bg-[#0071e3]" : "bg-neutral-500/20"}`}>
              <Bluetooth className={`w-4 h-4 ${bluetoothEnabled ? iconActiveColor : iconInactiveColor}`} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold leading-tight">Bluetooth</span>
              <span className={`text-[10px] ${textMuted} truncate`}>{bluetoothEnabled ? "On" : "Off"}</span>
            </div>
          </div>
        </div>

        {/* Правая колонка из двух квадратных плиток */}
        <div className="grid grid-rows-2 gap-2.5 h-[120px]">
          {/* Переключатель темы */}
          <div 
            onClick={onToggleDarkMode}
            className={`p-2.5 rounded-2xl ${cardBg} flex items-center space-x-2.5 cursor-pointer hover:bg-opacity-80 transition-all`}
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center ${isDarkMode ? "bg-[#5e5ce6]" : "bg-amber-100"}`}>
              {isDarkMode ? <Moon className="w-4 h-4 text-white" /> : <Sun className="w-4 h-4 text-amber-600" />}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold">{isDarkMode ? "Dark" : "Light"}</span>
              <span className={`text-[9px] ${textMuted}`}>Mode</span>
            </div>
          </div>

          {/* Фуллскрин */}
          <div 
            onClick={toggleFullscreen}
            className={`p-2.5 rounded-2xl ${cardBg} flex items-center space-x-2.5 cursor-pointer hover:bg-opacity-80 transition-all`}
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center ${isFullscreen ? "bg-[#34c759]" : "bg-neutral-500/20"}`}>
              <Maximize className={`w-4 h-4 ${isFullscreen ? "text-white" : iconInactiveColor}`} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold">Screen</span>
              <span className={`text-[9px] ${textMuted}`}>{isFullscreen ? "Windowed" : "Fullscreen"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Модуль Яркости (Display) */}
      <div className={`rounded-2xl p-3 mb-2.5 ${cardBg}`}>
        <span className="text-xs font-bold block mb-2 tracking-wide">Display</span>
        <div className="relative flex items-center">
          <input
            type="range"
            min="10"
            max="100"
            value={brightness}
            onChange={(e) => onBrightnessChange(Number.parseInt(e.target.value))}
            className="w-full h-5 rounded-lg appearance-none bg-neutral-500/20 cursor-pointer outline-none accent-transparent overflow-hidden"
            style={{
              background: `linear-gradient(to right, ${isDarkMode ? "#ffffff" : "#0071e3"} 0%, ${isDarkMode ? "#ffffff" : "#0071e3"} ${brightness}%, ${isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"} ${brightness}%, ${isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"} 100%)`,
            }}
          />
          {/* Декоративная иконка внутри ползунка для нативности */}
          <Sun className="w-3.5 h-3.5 absolute left-2 pointer-events-none text-neutral-400 mix-blend-difference" />
        </div>
      </div>

      {/* Модуль Звука (Volume) */}
      <div className={`rounded-2xl p-3 ${cardBg}`}>
        <span className="text-xs font-bold block mb-2 tracking-wide">Sound</span>
        <div className="relative flex items-center">
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number.parseInt(e.target.value))}
            className="w-full h-5 rounded-lg appearance-none bg-neutral-500/20 cursor-pointer outline-none accent-transparent overflow-hidden"
            style={{
              background: `linear-gradient(to right, ${isDarkMode ? "#ffffff" : "#0071e3"} 0%, ${isDarkMode ? "#ffffff" : "#0071e3"} ${volume}%, ${isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"} ${volume}%, ${isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"} 100%)`,
            }}
          />
          <div className="absolute left-2 pointer-events-none text-neutral-400 mix-blend-difference">
            {volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </div>
        </div>
      </div>
    </div>
  )
}