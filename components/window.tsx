"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { X, Minus, Maximize2, Minimize2 } from "lucide-react"
import type { AppWindow } from "@/types"
import Notes from "@/components/apps/notes"
import GitHub from "@/components/apps/github"
import Safari from "@/components/apps/safari"
import VSCodeJava from "@/components/apps/vscode" 
import FaceTime from "@/components/apps/facetime"
import Terminal from "@/components/apps/terminal"
import Mail from "@/components/apps/mail"
import YouTube from "@/components/apps/youtube"
import Spotify from "@/components/apps/spotify"
import Snake from "@/components/apps/snake"
import Weather from "@/components/apps/weather"

const componentMap: Record<string, React.ComponentType<{ isDarkMode?: boolean }>> = {
  Notes,
  GitHub,
  Safari,
  VSCode: VSCodeJava,
  FaceTime,
  Terminal,
  Mail,
  YouTube,
  Spotify,
  Snake,
  Weather,
}

interface WindowProps {
  window: AppWindow
  isActive: boolean
  onClose: () => void
  onFocus: () => void
  isDarkMode: boolean
}

export default function Window({ window: appWindow, isActive, onClose, onFocus, isDarkMode }: WindowProps) {
  const [position, setPosition] = useState(appWindow.position)
  const [size, setSize] = useState(appWindow.size)
  const [isMaximized, setIsMaximized] = useState(false)
  const [isMobile, setIsMobile] = useState(false) // Стейт для определения мобильной версии
  const [preMaximizeState, setPreMaximizeState] = useState({ position, size })

  const positionRef = useRef(position)
  const sizeRef = useRef(size)
  
  useEffect(() => {
    positionRef.current = position
  }, [position])

  useEffect(() => {
    sizeRef.current = size
  }, [size])

  // Хук для отслеживания ресайза самого браузера (адаптивность)
  useEffect(() => {
    const checkResponsiveMode = () => {
      const width = globalThis.innerWidth
      if (width < 768) {
        setIsMobile(true)
      } else {
        setIsMobile(false)
      }
    }

    checkResponsiveMode()
    globalThis.addEventListener("resize", checkResponsiveMode)
    return () => globalThis.removeEventListener("resize", checkResponsiveMode)
  }, [])

  const dragArgs = useRef({ isDragging: false, startX: 0, startY: 0, initialX: 0, initialY: 0 })
  const resizeArgs = useRef({ 
    isResizing: false, 
    direction: null as string | null, 
    startX: 0, 
    startY: 0, 
    initialWidth: 0, 
    initialHeight: 0,
    initialX: 0,
    initialY: 0
  })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isMobile) return // Полностью блокируем расчеты на мобилках

      if (dragArgs.current.isDragging && !isMaximized) {
        const dx = e.clientX - dragArgs.current.startX
        const dy = e.clientY - dragArgs.current.startY
        
        setPosition({
          x: dragArgs.current.initialX + dx,
          y: dragArgs.current.initialY + dy
        })
      } 
      else if (resizeArgs.current.isResizing && resizeArgs.current.direction && !isMaximized) {
        e.preventDefault()
        const dx = e.clientX - resizeArgs.current.startX
        const dy = e.clientY - resizeArgs.current.startY

        let newWidth = resizeArgs.current.initialWidth
        let newHeight = resizeArgs.current.initialHeight
        let newX = resizeArgs.current.initialX
        let newY = resizeArgs.current.initialY

        const minWidth = 350
        const minHeight = 250

        if (resizeArgs.current.direction.includes("e")) {
          newWidth = Math.max(minWidth, resizeArgs.current.initialWidth + dx)
        }
        if (resizeArgs.current.direction.includes("s")) {
          newHeight = Math.max(minHeight, resizeArgs.current.initialHeight + dy)
        }
        if (resizeArgs.current.direction.includes("w")) {
          const proposedWidth = resizeArgs.current.initialWidth - dx
          if (proposedWidth >= minWidth) {
            newWidth = proposedWidth
            newX = resizeArgs.current.initialX + dx
          }
        }
        if (resizeArgs.current.direction.includes("n")) {
          const proposedHeight = resizeArgs.current.initialHeight - dy
          if (proposedHeight >= minHeight) {
            newHeight = proposedHeight
            newY = resizeArgs.current.initialY + dy
          }
        }

        setSize({ width: newWidth, height: newHeight })
        if (resizeArgs.current.direction.includes("w") || resizeArgs.current.direction.includes("n")) {
          setPosition({ x: newX, y: newY })
        }
      }
    }

    const handleMouseUp = () => {
      dragArgs.current.isDragging = false
      resizeArgs.current.isResizing = false
      resizeArgs.current.direction = null
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isMaximized, isMobile])

  const handleTitleBarMouseDown = (e: React.MouseEvent) => {
    if (isMaximized || isMobile) return
    if ((e.target as HTMLElement).closest(".window-controls")) return

    dragArgs.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      initialX: positionRef.current.x,
      initialY: positionRef.current.y
    }
    onFocus()
  }

  const handleResizeMouseDown = (e: React.MouseEvent, direction: string) => {
    if (isMaximized || isMobile) return
    e.preventDefault()
    e.stopPropagation()

    resizeArgs.current = {
      isResizing: true,
      direction,
      startX: e.clientX,
      startY: e.clientY,
      initialWidth: sizeRef.current.width,
      initialHeight: sizeRef.current.height,
      initialX: positionRef.current.x,
      initialY: positionRef.current.y
    }
    onFocus()
  }

  const toggleMaximize = () => {
    if (isMobile) return // На смартфонах окна всегда максимизированы

    if (isMaximized) {
      setPosition(preMaximizeState.position)
      setSize(preMaximizeState.size)
    } else {
      setPreMaximizeState({ position: positionRef.current, size: sizeRef.current })

      const browserWidth = globalThis.innerWidth
      const browserHeight = globalThis.innerHeight
      const availableHeight = browserHeight - 26 

      setPosition({ x: 0, y: 26 })
      setSize({
        width: browserWidth,
        height: availableHeight - 68, 
      })
    }
    setIsMaximized(!isMaximized)
  }

  const AppComponent = componentMap[appWindow.component]

  const titleBarClass = isDarkMode
    ? isActive ? "bg-[#2d2d2d]" : "bg-[#242424]"
    : isActive ? "bg-[#ebebeb]" : "bg-[#f6f6f6]"

  const contentBgClass = isDarkMode ? "bg-[#1e1e1e]" : "bg-white"
  const textClass = isDarkMode ? "text-[#d4d4d4]" : "text-gray-800"
  const borderClass = isDarkMode ? "border-[#3c3c3c]" : "border-gray-300"

  // Динамический расчет инлайн стилей для поддержки адаптивности
  const responsiveStyles: React.CSSProperties = isMobile 
    ? {
        left: 0,
        top: "26px", // Фиксация под верхним статус-баром ОС
        width: "100%",
        height: "calc(100vh - 26px - 75px)", // Вычитаем статус бар и нижний Док приложений
        transform: "none",
        transition: "all 0.25s ease-in-out"
      }
    : {
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        transition: dragArgs.current.isDragging || resizeArgs.current.isResizing ? "none" : "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), width 0.15s ease, height 0.15s ease, left 0.15s ease, top 0.15s ease",
      }

  return (
    <div
      className={`${isMobile ? "fixed" : "absolute"} flex flex-col overflow-hidden shadow-2xl ${
        isMaximized || isMobile ? "rounded-none" : "rounded-lg border"
      } ${borderClass} ${isActive ? "z-10 ring-1 ring-black/10" : "z-0 opacity-95"}`}
      style={responsiveStyles}
      onClick={onFocus}
    >
      {/* Шапка окна */}
      <div 
        className={`h-9 flex items-center px-3 select-none justify-between border-b ${borderClass} ${titleBarClass}`} 
        onMouseDown={handleTitleBarMouseDown}
        onDoubleClick={toggleMaximize}
      >
        {/* Контроллеры */}
        <div className="window-controls flex items-center space-x-2.5 w-16">
          <button
            className="w-3.5 h-3.5 md:w-3 md:h-3 rounded-full bg-[#ff5f56] flex items-center justify-center transition-colors group relative"
            onClick={onClose}
          >
            <X className="w-2 h-2 md:w-1.5 md:h-1.5 text-[#4c0002] opacity-100 md:opacity-0 group-hover:opacity-100 absolute" />
          </button>
          <button
            className="w-3.5 h-3.5 md:w-3 md:h-3 rounded-full bg-[#ffbd2e] flex items-center justify-center transition-colors group relative disabled:opacity-40"
            onClick={onClose}
            disabled={isMobile} // На мобильных нельзя сворачивать в дробный размер
          >
            <Minus className="w-2 h-2 md:w-1.5 md:h-1.5 text-[#5c3e00] opacity-0 group-hover:opacity-100 absolute" />
          </button>
          <button
            className="w-3.5 h-3.5 md:w-3 md:h-3 rounded-full bg-[#27c93f] flex items-center justify-center transition-colors group relative disabled:opacity-40"
            onClick={toggleMaximize}
            disabled={isMobile}
          >
            {isMaximized ? (
              <Minimize2 className="w-2 h-2 md:w-1.5 md:h-1.5 text-[#024d06] opacity-0 group-hover:opacity-100 absolute" />
            ) : (
              <Maximize2 className="w-2 h-2 md:w-1.5 md:h-1.5 text-[#024d06] opacity-0 group-hover:opacity-100 absolute" />
            )}
          </button>
        </div>

        <div className={`text-xs font-semibold tracking-wide truncate max-w-[55%] ${textClass}`}>
          {appWindow.title}
        </div>

        <div className="w-16"></div>
      </div>

      {/* Контент приложения */}
      <div className={`${contentBgClass} flex-1 overflow-hidden relative`} style={{ borderBottomLeftRadius: "inherit", borderBottomRightRadius: "inherit" }}>
        {AppComponent ? <AppComponent isDarkMode={isDarkMode} /> : <div className="p-4">App core missing</div>}
      </div>

      {/* Зоны интерактивного ресайза (прячутся на мобильных и в фуллскрине) */}
      {!isMaximized && !isMobile && (
        <>
          <div className="absolute top-0 left-0 w-2.5 h-2.5 cursor-nw-resize z-30" onMouseDown={(e) => handleResizeMouseDown(e, "nw")} />
          <div className="absolute top-0 right-0 w-2.5 h-2.5 cursor-ne-resize z-30" onMouseDown={(e) => handleResizeMouseDown(e, "ne")} />
          <div className="absolute bottom-0 left-0 w-2.5 h-2.5 cursor-sw-resize z-30" onMouseDown={(e) => handleResizeMouseDown(e, "sw")} />
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 cursor-se-resize z-30" onMouseDown={(e) => handleResizeMouseDown(e, "se")} />

          <div className="absolute top-0 left-2.5 right-2.5 h-1 cursor-n-resize z-20" onMouseDown={(e) => handleResizeMouseDown(e, "n")} />
          <div className="absolute bottom-0 left-2.5 right-2.5 h-1 cursor-s-resize z-20" onMouseDown={(e) => handleResizeMouseDown(e, "s")} />
          <div className="absolute left-0 top-2.5 bottom-2.5 w-1 cursor-w-resize z-20" onMouseDown={(e) => handleResizeMouseDown(e, "w")} />
          <div className="absolute right-0 top-2.5 bottom-2.5 w-1 cursor-e-resize z-20" onMouseDown={(e) => handleResizeMouseDown(e, "e")} />
        </>
      )}
    </div>
  )
}