"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Play, RotateCcw, Pause, Sparkles, Trophy, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SnakeProps {
  isDarkMode?: boolean
}

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT"
type Position = { x: number; y: number }
type FoodType = "NORMAL" | "GOLDEN" | "SUPER"

interface FoodItem {
  x: number
  y: number
  type: FoodType
  pulse: number
}

// Кастомный хук для React-интервалов (решает проблему "засыпания" стейта)
function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void>()

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    function tick() {
      if (savedCallback.current) savedCallback.current()
    }
    if (delay !== null) {
      const id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}

export default function Snake({ isDarkMode = true }: SnakeProps) {
  const GRID_SIZE = 20
  const CELL_SIZE = 20
  const INITIAL_SPEED = 120
  
  const INITIAL_SNAKE = [
    { x: 10, y: 10 },
    { x: 10, y: 11 },
    { x: 10, y: 12 },
  ]

  // Game state
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE)
  const [food, setFood] = useState<FoodItem>({ x: 5, y: 5, type: "NORMAL", pulse: 0 })
  const [direction, setDirection] = useState<Direction>("UP")
  const [nextDirection, setNextDirection] = useState<Direction>("UP")
  const [gameOver, setGameOver] = useState(false)
  const [isPaused, setIsPaused] = useState(true)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [lastEatTime, setLastEatTime] = useState<number>(0)
  const [currentSpeed, setCurrentSpeed] = useState(INITIAL_SPEED)
  const [isTurbo, setIsTurbo] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)

  const bgColor = isDarkMode ? "#0d1117" : "#f8fafc"
  const gridColor1 = isDarkMode ? "#161b22" : "#f1f5f9"
  const gridColor2 = isDarkMode ? "#0f141c" : "#e2e8f0"

  // Генерируем еду
  const generateFood = useCallback((): FoodItem => {
    const x = Math.floor(Math.random() * GRID_SIZE)
    const y = Math.floor(Math.random() * GRID_SIZE)

    if (snake.some((segment) => segment.x === x && segment.y === y)) {
      return generateFood()
    }

    const rand = Math.random()
    let type: FoodType = "NORMAL"
    if (rand > 0.85) type = "SUPER"
    else if (rand > 0.65) type = "GOLDEN"

    return { x, y, type, pulse: 0 }
  }, [snake])

  // Анимация пульсации еды
  useEffect(() => {
    let animationId: number
    const updatePulse = () => {
      setFood((prev) => ({ ...prev, pulse: (prev.pulse + 0.1) % (Math.PI * 2) }))
      animationId = requestAnimationFrame(updatePulse)
    }
    animationId = requestAnimationFrame(updatePulse)
    return () => cancelAnimationFrame(animationId)
  }, [])

  // Отрисовка графики
  const drawGame = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Очистка и сетка
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        ctx.fillStyle = (i + j) % 2 === 0 ? gridColor1 : gridColor2
        ctx.fillRect(i * CELL_SIZE, j * CELL_SIZE, CELL_SIZE, CELL_SIZE)
      }
    }

    // Рендеринг еды со свечением
    const foodRadius = CELL_SIZE / 2 - 1 + Math.sin(food.pulse) * 1.5
    const fx = food.x * CELL_SIZE + CELL_SIZE / 2
    const fy = food.y * CELL_SIZE + CELL_SIZE / 2

    ctx.save()
    ctx.shadowBlur = 15
    if (food.type === "GOLDEN") {
      ctx.fillStyle = "#fbbf24"; ctx.shadowColor = "#fbbf24"
    } else if (food.type === "SUPER") {
      ctx.fillStyle = "#a855f7"; ctx.shadowColor = "#a855f7"
    } else {
      ctx.fillStyle = "#f43f5e"; ctx.shadowColor = "#f43f5e"
    }
    ctx.beginPath()
    ctx.arc(fx, fy, Math.max(4, foodRadius), 0, 2 * Math.PI)
    ctx.fill()
    ctx.restore()

    // Рендеринг змейки
    snake.forEach((segment, index) => {
      const isHead = index === 0
      ctx.save()
      
      if (isHead) {
        ctx.fillStyle = isTurbo ? "#38bdf8" : "#4ade80"
        ctx.shadowBlur = 10
        ctx.shadowColor = ctx.fillStyle
        
        ctx.beginPath()
        ctx.arc(segment.x * CELL_SIZE + CELL_SIZE/2, segment.y * CELL_SIZE + CELL_SIZE/2, CELL_SIZE/2, 0, 2 * Math.PI)
        ctx.fill()

        // Глаза
        ctx.fillStyle = "#000"
        const eyeOffset = 4
        let eye1 = { x: 0, y: 0 }, eye2 = { x: 0, y: 0 }
        
        if (direction === "UP" || direction === "DOWN") {
          eye1 = { x: -eyeOffset, y: 0 }; eye2 = { x: eyeOffset, y: 0 }
        } else {
          eye1 = { x: 0, y: -eyeOffset }; eye2 = { x: 0, y: eyeOffset }
        }
        
        const cx = segment.x * CELL_SIZE + CELL_SIZE/2
        const cy = segment.y * CELL_SIZE + CELL_SIZE/2
        ctx.beginPath()
        ctx.arc(cx + eye1.x, cy + eye1.y, 2, 0, 2*Math.PI)
        ctx.arc(cx + eye2.x, cy + eye2.y, 2, 0, 2*Math.PI)
        ctx.fill()
      } else {
        const alpha = Math.max(0.3, 1 - index / snake.length)
        ctx.fillStyle = isTurbo 
          ? `rgba(56, 189, 248, ${alpha})` 
          : `rgba(34, 197, 94, ${alpha})`
        ctx.fillRect(segment.x * CELL_SIZE + 1, segment.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2)
      }
      ctx.restore()
    })

    if (gameOver) {
      ctx.fillStyle = "rgba(13, 17, 23, 0.9)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      ctx.fillStyle = "#f43f5e"
      ctx.font = "bold 26px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("SYSTEM CRASHED", canvas.width / 2, canvas.height / 2 - 30)
      
      ctx.fillStyle = "#94a3b8"
      ctx.font = "14px monospace"
      let rank = "Noob 😭"
      if (score > 300) rank = "Code God ⚡"
      else if (score > 150) rank = "Spring Senior ☕"
      else if (score > 60) rank = "Junior Dev 🧑‍💻"

      ctx.fillText(`Rank: ${rank}`, canvas.width / 2, canvas.height / 2)
      ctx.fillStyle = "#fff"
      ctx.font = "bold 20px sans-serif"
      ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 35)
    }
  }, [snake, food, gameOver, score, direction, isTurbo, gridColor1, gridColor2])

  // Движение змейки (основной шаг)
  const gameStep = () => {
    if (isPaused || gameOver) return

    setDirection(nextDirection)
    const head = { ...snake[0] }
    switch (nextDirection) {
      case "UP": head.y -= 1; break
      case "DOWN": head.y += 1; break
      case "LEFT": head.x -= 1; break
      case "RIGHT": head.x += 1; break
    }

    // Проход сквозь стены
    if (head.x < 0) head.x = GRID_SIZE - 1
    if (head.x >= GRID_SIZE) head.x = 0
    if (head.y < 0) head.y = GRID_SIZE - 1
    if (head.y >= GRID_SIZE) head.y = 0

    // Проверка столкновения с собой
    if (snake.some((segment) => segment.x === head.x && segment.y === head.y)) {
      setGameOver(true)
      return
    }

    const newSnake = [head, ...snake]
    
    if (head.x === food.x && head.y === food.y) {
      const now = Date.now()
      const isComboActive = now - lastEatTime < 3000
      const currentCombo = isComboActive ? combo + 1 : 1
      
      setCombo(currentCombo)
      setLastEatTime(now)

      let basePoints = 10
      if (food.type === "GOLDEN") {
        basePoints = 30
        setIsTurbo(true)
        setTimeout(() => setIsTurbo(false), 4000)
      } else if (food.type === "SUPER") {
        basePoints = 50
      }

      const pointsGained = basePoints * currentCombo
      setScore((prev) => {
        const nextScore = prev + pointsGained
        setHighScore((prevHigh) => Math.max(prevHigh, nextScore))
        return nextScore
      })

      setCurrentSpeed((prevSpeed) => Math.max(50, INITIAL_SPEED - Math.floor(newSnake.length / 2) * 3))
      setFood(generateFood())
    } else {
      newSnake.pop()
    }

    setSnake(newSnake)
  }

  useInterval(
    gameStep,
    !isPaused && !gameOver ? (isTurbo ? currentSpeed * 0.6 : currentSpeed) : null
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return
      
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault()
      }

      switch (e.key) {
        case "ArrowUp": if (direction !== "DOWN") setNextDirection("UP"); break
        case "ArrowDown": if (direction !== "UP") setNextDirection("DOWN"); break
        case "ArrowLeft": if (direction !== "RIGHT") setNextDirection("LEFT"); break
        case "ArrowRight": if (direction !== "LEFT") setNextDirection("RIGHT"); break
        case " ": setIsPaused((prev) => !prev); break
      }
    }
    
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [direction, gameOver])

  useEffect(() => {
    drawGame()
  }, [snake, food, gameOver, drawGame])

  const resetGame = () => {
    setSnake(INITIAL_SNAKE)
    setDirection("UP")
    setNextDirection("UP")
    setGameOver(false)
    setScore(0)
    setCombo(0)
    setCurrentSpeed(INITIAL_SPEED)
    setIsTurbo(false)
    setIsPaused(false) 
    setFood({ x: 5, y: 5, type: "NORMAL", pulse: 0 })
  }

  return (
    <div className={`h-full flex flex-col ${isDarkMode ? "bg-[#0d1117] text-white" : "bg-white text-gray-900"} p-4 font-sans select-none`}>
      
      {/* Score Header */}
      <div className="flex justify-between items-center bg-slate-900/40 p-3 rounded-xl border border-slate-800/80 mb-4 backdrop-blur-sm">
        <div className="flex items-center space-x-6">
          <div>
            <div className="text-xs text-slate-400 font-mono flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" /> SCORE
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-400">
              {score}
              {combo > 1 && (
                <span className="text-xs bg-rose-500 text-white ml-2 px-1.5 py-0.5 rounded-md animate-bounce inline-block">
                  x{combo} Combo!
                </span>
              )}
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-400 font-mono flex items-center gap-1">
              <Trophy className="w-3 h-3 text-yellow-400" /> HIGH
            </div>
            <div className="text-2xl font-bold font-mono text-slate-300">{highScore}</div>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPaused(!isPaused)}
            disabled={gameOver}
            className="border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-200"
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetGame} 
            className="border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-200"
          >
            <RotateCcw className="w-4 h-4 mr-1" /> Restart
          </Button>
        </div>
      </div>

      {/* Canvas Wrapper */}
      <div className="flex-1 flex items-center justify-center relative">
        <canvas
          ref={canvasRef}
          width={GRID_SIZE * CELL_SIZE}
          height={GRID_SIZE * CELL_SIZE}
          className="border border-slate-800 rounded-xl shadow-2xl overflow-hidden"
        />

        {isTurbo && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-sky-500 text-white font-mono font-bold px-3 py-1 text-xs rounded-full shadow-lg border border-sky-400 flex items-center gap-1 animate-pulse">
            <Zap className="w-3 h-3 fill-current" /> NITRO TURBO MODE ACTIVE
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-center gap-4 text-xs font-mono text-slate-400 bg-slate-900/20 py-2 rounded-lg border border-slate-900">
        <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span> Normal (+10)</div>
        <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span> Lightning (+30)</div>
        <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block"></span> Super (+50)</div>
      </div>
    </div>
  )
}