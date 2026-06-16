"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"

interface TerminalProps {
  isDarkMode?: boolean
}

export default function Terminal({ isDarkMode = true }: TerminalProps) {
  const [input, setInput] = useState("")
  // Сразу инициализируем стартовое состояние, чтобы избежать дублирования в useEffect
  const [history, setHistory] = useState<string[]>(() => [
    `Last login: ${new Date().toLocaleString("en-US", { hour12: false })} on ttys001`,
    "Welcome to macOS Terminal (zsh)",
    "Type 'help' to see available commands.",
    "",
  ])
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  // Цветовая палитра нативного терминала ("Homebrew" профиль)
  const bgColor = "bg-[#0c0c0c]"
  const textColor = "text-[#33ff33]"

  useEffect(() => {
    // Автофокус при первом монтировании
    inputRef.current?.focus()

    const handleClick = () => {
      inputRef.current?.focus()
    }

    const terminal = terminalRef.current
    if (terminal) {
      terminal.addEventListener("click", handleClick)
    }

    return () => {
      if (terminal) {
        terminal.removeEventListener("click", handleClick)
      }
    }
  }, [])

  useEffect(() => {
    // Автоскролл к нижней границе при выводе логов
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const trimmedInput = input.trim()
      if (!trimmedInput) {
        // Если нажат просто Enter — выводим пустую строку промпта
        setHistory((prev) => [...prev, "farid@macbook-air ~ % "])
        return
      }
      
      executeCommand(trimmedInput)
      setCommandHistory((prev) => [...prev, trimmedInput])
      setHistoryIndex(-1)
      setInput("")
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (commandHistory.length === 0) return
      
      const nextIndex = historyIndex + 1
      if (nextIndex < commandHistory.length) {
        setHistoryIndex(nextIndex)
        setInput(commandHistory[commandHistory.length - 1 - nextIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      const nextIndex = historyIndex - 1
      if (nextIndex >= 0) {
        setHistoryIndex(nextIndex)
        setInput(commandHistory[commandHistory.length - 1 - nextIndex])
      } else {
        setHistoryIndex(-1)
        setInput("")
      }
    }
  }

  const executeCommand = (cmd: string) => {
    const args = cmd.split(" ")
    const mainCommand = args[0].toLowerCase()

    // Сначала пушим саму команду в лог
    setHistory((prev) => [...prev, `farid@macbook-air ~ % ${cmd}`])

    switch (mainCommand) {
      case "help":
        setHistory((prev) => [
          ...prev,
          "Available commands:",
          "  help     - Show this help message",
          "  clear    - Clear the terminal screen",
          "  echo     - Display a line of text",
          "  date     - Display current date and time",
          "  ls       - List directory contents",
          "  whoami   - Print effective user name",
          "  about    - About Farid Huseynov",
          "  skills   - Technical skill stack",
          "  contact  - Social & contact links",
          "",
        ])
        break

      case "clear":
        setHistory([])
        break

      case "echo":
        const echoText = args.slice(1).join(" ")
        setHistory((prev) => [...prev, echoText || "", ""])
        break

      case "date":
        setHistory((prev) => [...prev, new Date().toString(), ""])
        break

      case "ls":
        setHistory((prev) => [
          ...prev,
          "Applications   Desktop   Documents   Downloads   Movies   Music   Pictures",
          "",
        ])
        break

      case "whoami":
        setHistory((prev) => [...prev, "farid", ""])
        break

      case "about":
        setHistory((prev) => [
          ...prev,
          "┌────────────────────────────────────────────────────────┐",
          "│ Farid Huseynov                                         │",
          "│ Software Engineer (Backend / Cloud / iOS)              │",
          "└────────────────────────────────────────────────────────┘",
          "Highly adaptive engineer specializing in robust internal backend services",
          "and clean software architecture. Core expertise lies in Java 21 & Spring Boot",
          "ecosystems, alongside financial and native mobile platform engineering.",
          "Passionate about scalable design, automated pipelines, and clean code.",
          "",
        ])
        break

      case "skills":
        setHistory((prev) => [
          ...prev,
          "Backend:        Java (Expert), Spring Boot, Spring Security, JPA / Hibernate",
          "Databases:      PostgreSQL, SQLite, MongoDB, Redis, TypeORM",
          "Frontend/iOS:   Swift, SwiftUI, JavaScript, React, Tailwind CSS",
          "DevOps/Tools:   Docker, Node.js, Git, CI/CD, AWS Cloud Infrastructure",
          "",
        ])
        break

      case "contact":
        setHistory((prev) => [
          ...prev,
          "Email:    huseynovfarid1111@gmail.com",
          "GitHub:   github.com/digitalturkk",
          "LinkedIn: linkedin.com/in/husfarid/",
          "",
        ])
        break

      default:
        setHistory((prev) => [
          ...prev,
          `zsh: command not found: ${mainCommand}`,
          "",
        ])
    }
  }

  return (
    <div 
      ref={terminalRef} 
      className={`h-full ${bgColor} ${textColor} p-3 font-mono text-[13px] leading-relaxed overflow-y-auto selection:bg-green-800 selection:text-white custom-terminal-smooth`}
    >
      {/* Вывод логов команд */}
      <div className="space-y-[2px]">
        {history.map((line, index) => (
          <div key={index} className="whitespace-pre-wrap tracking-wide antialiased opacity-95">
            {line}
          </div>
        ))}
      </div>

      {/* Инпут строка с промптом */}
      <div className="flex items-center mt-1">
        <span className="mr-2 tracking-wide antialiased shrink-0 font-semibold text-sky-400">
          farid@macbook-air <span className="text-white">~</span> %
        </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none border-0 p-0 m-0 text-[#33ff33] font-mono text-[13px] focus:ring-0 focus:outline-none custom-caret"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
      </div>

      <style jsx global>{`
        .custom-terminal-smooth {
          font-family: "SF Mono", "Menlo", "Monaco", "Courier New", monospace;
        }
        /* Кастомная стилизация каретки под классический терминальный блок */
        .custom-caret {
          caret-shape: block;
          caret-color: #33ff33;
        }
      `}</style>
    </div>
  )
}