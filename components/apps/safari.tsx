"use client"

import React, { useState, useEffect } from "react"
import {
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Home,
  Search,
  Plus,
  Lock,
  Share,
  Layers,
  LayoutGrid
} from "lucide-react"

export default function SafariEmulator() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [wifiEnabled, setWifiEnabled] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Переключение адаптивности в рантайме
  useEffect(() => {
    const checkMobile = () => setIsMobile(globalThis.innerWidth < 768)
    checkMobile()
    globalThis.addEventListener("resize", checkMobile)
    return () => globalThis.removeEventListener("resize", checkMobile)
  }, [])

  // Стилизация по гайдлайнам Apple Human Interface Guidelines (2026)
  const bgColor = isDarkMode ? "bg-[#1e1e1e]" : "bg-[#f3f3f3]"
  const textColor = isDarkMode ? "text-[#f5f5f7]" : "text-[#1d1d1f]"
  const borderColor = isDarkMode ? "border-white/[0.08]" : "border-black/[0.08]"
  const toolbarBg = isDarkMode ? "bg-[#2d2d2d]/80" : "bg-[#efefef]/80"
  const activeTabBg = isDarkMode ? "bg-[#1e1e1e]" : "bg-[#f3f3f3]"
  const inputBg = isDarkMode ? "bg-black/[0.24]" : "bg-black/[0.04]"
  const startPageCardBg = isDarkMode ? "bg-white/[0.04] border-white/[0.06]" : "bg-black/[0.02] border-black/[0.04]"

  const [url, setUrl] = useState("Search or enter website URL")
  const [displayUrl, setDisplayUrl] = useState("Digital Samurai — Start Page")
  const [activeTab, setActiveTab] = useState("home") // "home" | "web"
  const [iframeUrl, setIframeUrl] = useState("")

  const socialLinks = [
    { title: "GitHub", url: "https://github.com/digitalturkk", icon: "/github.png", initial: "G" },
    { title: "LinkedIn", url: "https://linkedin.com/in/husfarid", icon: "/linkedin.png", initial: "L" },
    { title: "YouTube", url: "https://youtube.com/@digisamu", icon: "/youtube.png", initial: "Y" },
    { title: "Twitter", url: "https://twitter.com", icon: "", initial: "X" },
  ]

  const frequentlyVisited = [
    { title: "LeetCode", url: "https://leetcode.com", icon: "", initial: "L" },
    { title: "Habr", url: "https://habr.com", icon: "", initial: "H" },
    { title: "Vercel", url: "https://vercel.com", icon: "", initial: "V" },
  ]

  const handleRefresh = () => {
    setIsLoading(true)
    if (activeTab === "web") {
      const current = iframeUrl
      setIframeUrl("")
      setTimeout(() => setIframeUrl(current), 60)
    }
    setTimeout(() => setIsLoading(false), 700)
  }

  const handleGoHome = () => {
    setActiveTab("home")
    setUrl("Search or enter website URL")
    setDisplayUrl("Digital Samurai — Start Page")
  }

  const handleOpenWebsite = (targetUrl: string) => {
    if (!targetUrl.trim()) return
    let formattedUrl = targetUrl.trim()
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`
    }
    setUrl(formattedUrl)
    // Извлекаем чистый хостнейм для красивого отображения в панели как на macOS
    try {
      const host = new URL(formattedUrl).hostname
      setDisplayUrl(host)
    } catch {
      setDisplayUrl(targetUrl)
    }
    setIframeUrl(formattedUrl)
    setActiveTab("web")
  }

  return (
    <div className={`h-full w-full flex flex-col relative select-none font-sans overflow-hidden ${bgColor} ${textColor}`}>
      
      {/* Шапка Safari (Toolbar + Нативные Вкладки) */}
      <div className={`flex flex-col border-b ${borderColor} ${toolbarBg} backdrop-blur-[30px] z-20`}>
        
        {/* Верхний ярус: Кнопки управления и Вкладки (Интегрированный дизайн) */}
        <div className="h-11 px-3 flex items-center justify-between space-x-2 relative">
          
          {/* Левый блок: Нативный Светофор macOS (Скрывается на мобилках) */}
          <div className="hidden md:flex items-center space-x-2 w-16">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] cursor-pointer active:brightness-90" onClick={handleGoHome} />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]" />
          </div>

          {/* Центральный блок: Контейнер вкладок */}
          <div className="flex-1 flex items-center max-w-2xl h-8 space-x-1">
            {/* Вкладка 1: Главная */}
            <div
              onClick={handleGoHome}
              className={`flex-1 max-w-[180px] h-7 px-3 flex items-center justify-between text-[12px] font-normal rounded-md cursor-pointer transition-all ${
                activeTab === "home"
                  ? `${activeTabBg} shadow-[0_1px_3px_rgba(0,0,0,0.12)] text-current`
                  : "hover:bg-black/[0.04] dark:hover:bg-white/[0.04] text-current/60"
              }`}
            >
              <span className="truncate pr-2">Digital Samurai</span>
              <LayoutGrid className="w-3 h-3 opacity-40 flex-shrink-0" />
            </div>

            {/* Вкладка 2: Динамический iframe */}
            {activeTab === "web" && (
              <div
                className={`flex-1 max-w-[180px] h-7 px-3 flex items-center justify-between text-[12px] font-normal rounded-md cursor-pointer ${activeTabBg} shadow-[0_1px_3px_rgba(0,0,0,0.12)]`}
              >
                <span className="truncate pr-2 text-sky-400 font-medium">{displayUrl}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleGoHome()
                  }}
                  className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-current/50 hover:bg-black/10 dark:hover:bg-white/10 text-[10px]"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Кнопка "Новая вкладка" */}
            <button className="p-1 rounded-md hover:bg-black/[0.05] dark:hover:bg-white/[0.05] transition-colors focus:outline-none">
              <Plus className="w-3.5 h-3.5 opacity-70" />
            </button>
          </div>

          {/* Правый блок: Боковая панель/Слои (macOS 15+) */}
          <div className="hidden md:flex items-center space-x-1">
            <button className="p-1.5 rounded-md hover:bg-black/[0.05] dark:hover:bg-white/[0.05]">
              <Layers className="w-4 h-4 opacity-70" />
            </button>
          </div>
        </div>

        {/* Нижний ярус: Элементы навигации и Умное Поле Поиска */}
        <div className="h-10 px-3 pb-1.5 flex items-center justify-between space-x-3">
          
          {/* Навигационные стрелки */}
          <div className="flex items-center space-x-0.5">
            <button
              onClick={handleGoHome}
              disabled={activeTab === "home"}
              className="p-1.5 rounded-md transition-colors hover:bg-black/[0.05] dark:hover:bg-white/[0.05] disabled:opacity-20 disabled:pointer-events-none"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded-md opacity-20 cursor-not-allowed">
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Интеллектуальное Адресное Поле Safari (Smart Search Field) */}
          <div className={`flex-1 max-w-xl mx-auto h-7 flex items-center justify-between rounded-lg px-2.5 transition-all border border-transparent ${inputBg} focus-within:bg-white dark:focus-within:bg-[#151515] focus-within:border-sky-500/50 focus-within:ring-2 focus-within:ring-sky-500/10`}>
            
            <div className="flex items-center space-x-1.5 text-current/40 w-4">
              {activeTab === "web" && <Lock className="w-3 h-3 text-emerald-500 flex-shrink-0" />}
            </div>

            <input
              type="text"
              value={url === "Search or enter website URL" ? "" : url}
              placeholder="Search or enter website URL"
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleOpenWebsite(url)}
              className="w-full bg-transparent focus:outline-none text-[13px] text-center font-normal tracking-wide placeholder-current/30"
            />

            <button onClick={handleRefresh} className="p-0.5 rounded text-current/50 hover:text-current transition-colors">
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>

          {/* Системные действия */}
          <div className="flex items-center space-x-1">
            <button className="p-1.5 rounded-md hover:bg-black/[0.05] dark:hover:bg-white/[0.05]">
              <Share className="w-4 h-4 opacity-70" />
            </button>
          </div>
        </div>
      </div>

      {/* Контентный Слой */}
      <div className="flex-1 overflow-y-auto w-full h-full relative z-10">
        {!wifiEnabled ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <div className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mb-3">⚠️</div>
            <p className="text-[15px] font-medium">No Internet Connection</p>
            <p className="text-xs opacity-50 mt-0.5">Please check your Mac's Wi-Fi configurations.</p>
          </div>
        ) : activeTab === "web" ? (
          /* Контент сайта в iframe */
          <div className="w-full h-full bg-white">
            <iframe
              src={iframeUrl}
              title="Safari Viewport"
              className="w-full h-full border-none bg-white"
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          </div>
        ) : (
          /* Нативная Стартовая Страница (Safari Start Page Layout) */
          <div className="px-6 md:px-12 py-12 max-w-4xl mx-auto animate-in fade-in duration-300">
            
            {/* Изящный блок профиля в стиле Glassmorphism */}
            <div className={`p-6 md:p-8 rounded-2xl border mb-12 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-md ${startPageCardBg}`}>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center text-white text-lg font-semibold shadow-inner">
                  FH
                </div>
                <div>
                  <h3 className="text-[17px] font-semibold tracking-tight">Farid Huseynov</h3>
                  <p className="text-xs opacity-50">Backend Software Engineer</p>
                </div>
              </div>
              
              <div className="space-y-3 text-[13.5px] leading-relaxed opacity-85 font-normal tracking-wide">
                <p>
                  Salam! My name is Farid, also known across the digital scope as <strong>Digital Samurai (digisamu)</strong>.
                  I focus on building secure, performant, and scalable backend architectures. My expertise lies primarily within Java and the Spring Boot ecosystem, alongside working on cloud-native deployments.
                </p>
                <p>
                  Driven by system design and microservices, I am currently diving deeper into Kubernetes, advanced Cloud infrastructure architectures, and exploring native iOS development.
                </p>
              </div>

              <div className="flex justify-end mt-5">
                <a href="/resume.pdf" download="Farid_Huseynov_Resume.pdf" className="inline-block">
                  <button className="px-4 py-1.5 rounded-lg font-medium text-xs shadow-sm bg-blue-600 hover:bg-blue-500 text-white transition-all active:scale-98">
                    Download CV
                  </button>
                </a>
              </div>
            </div>

            {/* Сетка Фаворитов (Favorites Grid) */}
            <div className="mb-10">
              <h4 className="text-[14px] font-semibold opacity-40 mb-4 tracking-wider uppercase px-1">Favorites</h4>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
                {socialLinks.map((link, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center group cursor-pointer"
                    onClick={() => handleOpenWebsite(link.url)}
                  >
                    <div className="w-14 h-14 bg-white dark:bg-neutral-800 rounded-xl flex items-center justify-center mb-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-black/[0.04] dark:border-white/[0.04] group-hover:scale-105 group-hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-all">
                      {link.icon ? (
                        <img src={link.icon} alt={link.title} className="w-8 h-8 object-contain" />
                      ) : (
                        <span className="text-neutral-500 dark:text-neutral-400 font-bold text-base">{link.initial}</span>
                      )}
                    </div>
                    <span className="text-[11px] text-center font-normal opacity-70 truncate w-full px-0.5 group-hover:opacity-100 transition-opacity">
                      {link.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Сетка Часто посещаемых (Frequently Visited) */}
            <div>
              <h4 className="text-[14px] font-semibold opacity-40 mb-4 tracking-wider uppercase px-1">Frequently Visited</h4>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
                {frequentlyVisited.map((site, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center group cursor-pointer"
                    onClick={() => handleOpenWebsite(site.url)}
                  >
                    <div className="w-14 h-14 bg-white dark:bg-neutral-800 rounded-xl flex items-center justify-center mb-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-black/[0.04] dark:border-white/[0.04] group-hover:scale-105 group-hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-all">
                      {site.icon ? (
                        <img src={site.icon} alt={site.title} className="w-8 h-8 object-contain" />
                      ) : (
                        <span className="text-neutral-500 dark:text-neutral-400 font-bold text-base">{site.initial}</span>
                      )}
                    </div>
                    <span className="text-[11px] text-center font-normal opacity-70 truncate w-full px-0.5 group-hover:opacity-100 transition-opacity">
                      {site.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}