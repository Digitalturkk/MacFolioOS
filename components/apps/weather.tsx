"use client"

import { useState, useEffect, useRef } from "react"
import { Search, MapPin, Droplets, Wind, Sunrise, Sunset, Cloud, CloudRain, CloudSnow, Sun } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface WeatherProps {
  isDarkMode?: boolean
}

const weatherData = {
  "Baku": {
    current: { temp: 18, condition: "Partly Cloudy", humidity: 65, windSpeed: 12, sunrise: "6:15 AM", sunset: "7:45 PM", feelsLike: 17 },
    forecast: [
      { day: "Mon", temp: 19, condition: "sunny" },
      { day: "Tue", temp: 21, condition: "partly-cloudy" },
      { day: "Wed", temp: 17, condition: "rainy" },
      { day: "Thu", temp: 15, condition: "rainy" },
      { day: "Fri", temp: 14, condition: "snowy" },
    ],
  },
  "London": {
    current: { temp: 14, condition: "Rainy", humidity: 80, windSpeed: 18, sunrise: "5:45 AM", sunset: "8:30 PM", feelsLike: 12 },
    forecast: [
      { day: "Mon", temp: 13, condition: "rainy" },
      { day: "Tue", temp: 14, condition: "rainy" },
      { day: "Wed", temp: 15, condition: "partly-cloudy" },
      { day: "Thu", temp: 16, condition: "partly-cloudy" },
      { day: "Fri", temp: 14, condition: "rainy" },
    ],
  },
  "Tokyo": {
    current: { temp: 24, condition: "Sunny", humidity: 50, windSpeed: 8, sunrise: "4:30 AM", sunset: "6:45 PM", feelsLike: 25 },
    forecast: [
      { day: "Mon", temp: 25, condition: "sunny" },
      { day: "Tue", temp: 26, condition: "sunny" },
      { day: "Wed", temp: 24, condition: "partly-cloudy" },
      { day: "Thu", temp: 23, condition: "partly-cloudy" },
      { day: "Fri", temp: 25, condition: "sunny" },
    ],
  },
  "Sydney": {
    current: { temp: 22, condition: "Sunny", humidity: 55, windSpeed: 15, sunrise: "6:30 AM", sunset: "5:15 PM", feelsLike: 23 },
    forecast: [
      { day: "Mon", temp: 23, condition: "sunny" },
      { day: "Tue", temp: 25, condition: "sunny" },
      { day: "Wed", temp: 21, condition: "partly-cloudy" },
      { day: "Thu", temp: 19, condition: "rainy" },
      { day: "Fri", temp: 20, condition: "partly-cloudy" },
    ],
  },
  "Paris": {
    current: { temp: 16, condition: "Partly Cloudy", humidity: 60, windSpeed: 10, sunrise: "6:00 AM", sunset: "8:15 PM", feelsLike: 15 },
    forecast: [
      { day: "Mon", temp: 17, condition: "partly-cloudy" },
      { day: "Tue", temp: 18, condition: "partly-cloudy" },
      { day: "Wed", temp: 16, condition: "rainy" },
      { day: "Thu", temp: 15, condition: "rainy" },
      { day: "Fri", temp: 17, condition: "partly-cloudy" },
    ],
  },
}

type WeatherCondition = "sunny" | "partly-cloudy" | "cloudy" | "rainy" | "snowy"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  angle?: number // Для плавного покачивания снега
  targetOpacity?: number // Для красивого фейд-ина
}

export default function Weather({ isDarkMode = true }: WeatherProps) {
  const [city, setCity] = useState("Baku")
  const [searchQuery, setSearchQuery] = useState("")
  const [weather, setWeather] = useState(weatherData["Baku"])
  const [condition, setCondition] = useState<WeatherCondition>("partly-cloudy")
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particles = useRef<Particle[]>([])
  const animationRef = useRef<number | null>(null)
  const conditionRef = useRef<WeatherCondition>("partly-cloudy")

  // Синхронизируем реф, чтобы избежать лишних перезапусков интревала анимации
  useEffect(() => {
    conditionRef.current = condition
  }, [condition])

  const bgColor = isDarkMode ? "bg-[#0b0f19]" : "bg-[#f4f7fa]"
  const textColor = isDarkMode ? "text-slate-100" : "text-slate-800"
  const cardBg = isDarkMode ? "bg-slate-900/60 backdrop-blur-md border-white/[0.05]" : "bg-white/80 backdrop-blur-md border-slate-200/80"
  const borderColor = isDarkMode ? "border-slate-800" : "border-slate-200"

  // Инициализация пула частиц без жесткого сброса
  const initParticles = (width: number, height: number) => {
    const currentCondition = conditionRef.current
    particles.current = []

    let count = 40
    if (currentCondition === "rainy") count = 120
    if (currentCondition === "snowy") count = 90
    if (currentCondition === "sunny") count = 15

    for (let i = 0; i < count; i++) {
      particles.current.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: currentCondition === "rainy" ? Math.random() * 1.5 + 1 
            : currentCondition === "snowy" ? Math.random() * 3 + 1.5 
            : Math.random() * 60 + 40, // Для солнца — это мягкие блики
        speedX: currentCondition === "snowy" ? Math.random() * 1 - 0.5 : currentCondition === "rainy" ? -0.5 : (Math.random() - 0.5) * 0.2,
        speedY: currentCondition === "rainy" ? Math.random() * 6 + 8 : currentCondition === "snowy" ? Math.random() * 0.8 + 0.6 : (Math.random() - 0.5) * 0.2,
        opacity: 0, 
        targetOpacity: currentCondition === "sunny" ? Math.random() * 0.15 + 0.05 : Math.random() * 0.5 + 0.3,
        angle: Math.random() * Math.PI * 2
      })
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.parentElement?.getBoundingClientRect()
      if (rect) {
        canvas.width = rect.width * dpr
        canvas.height = rect.height * dpr
        canvas.style.width = `${rect.width}px`
        canvas.style.height = `${rect.height}px`
        ctx.scale(dpr, dpr)
        initParticles(rect.width, rect.height)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    const animate = () => {
      const currentWidth = canvas.width / (window.devicePixelRatio || 1)
      const currentHeight = canvas.height / (window.devicePixelRatio || 1)
      
      ctx.clearRect(0, 0, currentWidth, currentHeight)
      const activeCond = conditionRef.current

      particles.current.forEach(p => {
        // Плавно проявляем частицы при инициализации/смене погоды
        if (p.opacity < (p.targetOpacity ?? 0.5)) p.opacity += 0.02

        ctx.save()
        ctx.globalAlpha = p.opacity

        if (activeCond === "rainy") {
          // Нативный кинематографичный дождь со шлейфом
          ctx.strokeStyle = isDarkMode ? 'rgba(156, 193, 255, 0.6)' : 'rgba(47, 112, 193, 0.4)'
          ctx.lineWidth = p.size
          ctx.lineCap = 'round'
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(p.x + p.speedX * 1.5, p.y + p.size * 5)
          ctx.stroke()
        } else if (activeCond === "snowy") {
          // Реалистичный падающий снег с покачиванием из стороны в сторону
          p.angle! += 0.01
          const waveX = p.x + Math.sin(p.angle!) * 8

          ctx.fillStyle = isDarkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(180, 200, 220, 0.9)'
          ctx.beginPath()
          ctx.arc(waveX, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
        } else if (activeCond === "sunny") {
          // Эффект объемных солнечных линз / бликов в воздухе
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size)
          gradient.addColorStop(0, isDarkMode ? 'rgba(255, 210, 100, 0.2)' : 'rgba(255, 220, 120, 0.3)')
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
        } else {
          // Мягкие объемные облака на фоне
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size)
          grad.addColorStop(0, isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)')
          grad.addColorStop(1, 'rgba(255, 255, 255, 0)')
          ctx.fillStyle = grad
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.restore()

        // Движение
        if (activeCond === "snowy") {
          p.y += p.speedY
          p.x += p.speedX
        } else {
          p.x += p.speedX
          p.y += p.speedY
        }

        // Зацикливание границ (с учетом волнового эффекта снега)
        if (p.y > currentHeight + 20) {
          p.y = -10
          p.x = Math.random() * currentWidth
        }
        if (p.x > currentWidth + 50) p.x = -40
        if (p.x < -50) p.x = currentWidth + 40
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [])

  // Обновление состояния при смене города
  useEffect(() => {
    if (weatherData[city]) {
      setWeather(weatherData[city])
      const cond = weatherData[city].current.condition.toLowerCase()
      
      let nextCond: WeatherCondition = "partly-cloudy"
      if (cond.includes("rain")) nextCond = "rainy"
      else if (cond.includes("snow")) nextCond = "snowy"
      else if (cond.includes("sun")) nextCond = "sunny"
      
      setCondition(nextCond)

      // Плавное переинициализирование пула частиц без мерцания холста
      const canvas = canvasRef.current
      if (canvas) {
        const width = canvas.width / (window.devicePixelRatio || 1)
        const height = canvas.height / (window.devicePixelRatio || 1)
        initParticles(width, height)
      }
    }
  }, [city])

  const handleSearch = () => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return

    const foundCity = Object.keys(weatherData).find(c => c.toLowerCase().includes(query))
    if (foundCity) setCity(foundCity)
    setSearchQuery("")
  }

  return (
    <div className={`h-full w-full ${bgColor} ${textColor} flex flex-col relative overflow-hidden transition-colors duration-500 font-sans`}>
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0 mix-blend-screen" />
      
      <div className="relative z-10 flex flex-col h-full max-w-5xl w-full mx-auto p-4 md:p-6 space-y-6">
        
        {/* Шапка поисковой строки */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search city (e.g. Baku, Tokyo...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className={`pl-10 h-10 border rounded-xl shadow-inner transition-all ${
                isDarkMode 
                  ? 'bg-slate-900/40 border-slate-800 text-slate-100 focus:border-blue-500' 
                  : 'bg-white/50 border-slate-200 text-slate-800 focus:border-blue-500'
              }`}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          </div>
          <Button 
            onClick={handleSearch}
            className="rounded-xl h-10 px-5 font-medium bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md active:scale-95"
          >
            Search
          </Button>
        </div>
        
        {/* Главный дашборд погоды */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch justify-between">
          <div className="flex flex-col justify-between p-4 flex-1">
            <div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-blue-500 animate-pulse" />
                <h2 className="text-3xl font-bold tracking-tight">{city}</h2>
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider opacity-40 mt-1.5">Today</p>
            </div>
            
            <div className="flex items-baseline mt-6 md:mt-0">
              <span className="text-7xl md:text-8xl font-thin tracking-tighter">{weather.current.temp}</span>
              <span className="text-3xl md:text-4xl font-light opacity-60 relative -top-8">°C</span>
              <div className="ml-6">
                <p className="text-xl font-medium tracking-wide">{weather.current.condition}</p>
                <p className="text-xs opacity-50 mt-0.5">Feels like {weather.current.feelsLike}°C</p>
              </div>
            </div>
          </div>
          
          {/* Сетка метрик */}
          <div className={`p-5 rounded-2xl border ${cardBg} grid grid-cols-2 gap-6 min-w-[280px] md:min-w-[340px] shadow-xl shadow-black/[0.02]`}>
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500"><Droplets className="w-5 h-5" /></div>
              <div>
                <p className="text-[11px] font-medium opacity-40 uppercase tracking-wider">Humidity</p>
                <p className="text-base font-semibold">{weather.current.humidity}%</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-500"><Wind className="w-5 h-5" /></div>
              <div>
                <p className="text-[11px] font-medium opacity-40 uppercase tracking-wider">Wind Speed</p>
                <p className="text-base font-semibold">{weather.current.windSpeed} km/h</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-500"><Sunrise className="w-5 h-5" /></div>
              <div>
                <p className="text-[11px] font-medium opacity-40 uppercase tracking-wider">Sunrise</p>
                <p className="text-base font-semibold">{weather.current.sunrise}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500"><Sunset className="w-5 h-5" /></div>
              <div>
                <p className="text-[11px] font-medium opacity-40 uppercase tracking-wider">Sunset</p>
                <p className="text-base font-semibold">{weather.current.sunset}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Карточки прогноза */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider opacity-40 px-1">5-Day Forecast</h3>
          <div className={`grid grid-cols-5 gap-3 p-4 rounded-2xl border ${cardBg} shadow-xl shadow-black/[0.02]`}>
            {weather.forecast.map((day, index) => (
              <div key={index} className="flex flex-col items-center py-2 rounded-xl hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                <p className="text-xs font-semibold opacity-60">{day.day}</p>
                <div className="my-3 text-blue-500 dark:text-blue-400">
                  {day.condition === "sunny" && <Sun className="w-5 h-5 text-amber-500" />}
                  {day.condition === "partly-cloudy" && <Cloud className="w-5 h-5 text-slate-400" />}
                  {day.condition === "rainy" && <CloudRain className="w-5 h-5 text-sky-500" />}
                  {day.condition === "snowy" && <CloudSnow className="w-5 h-5 text-blue-300" />}
                </div>
                <p className="text-base font-bold tracking-tight">{day.temp}°</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Популярные локации */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider opacity-40 px-1">Quick Switch</h3>
          <div className="flex flex-wrap gap-2">
            {Object.keys(weatherData).map((cityName) => (
              <Button
                key={cityName}
                variant={city === cityName ? "default" : "outline"}
                className={`rounded-xl px-4 text-xs font-medium transition-all ${
                  city === cityName 
                    ? "bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/10" 
                    : isDarkMode ? "border-slate-800 hover:bg-slate-800/50" : "border-slate-200 hover:bg-slate-100"
                }`}
                onClick={() => setCity(cityName)}
              >
                {cityName}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}