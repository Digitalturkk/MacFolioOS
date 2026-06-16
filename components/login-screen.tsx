"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Moon, Sun, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";

interface LoginScreenProps {
  onLogin: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function LoginScreen({
  onLogin,
  isDarkMode,
  onToggleDarkMode,
}: LoginScreenProps) {
  const [password, setPassword] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const [time, setTime] = useState(new Date());

  // Обновление времени каждую секунду
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Нативная проверка: если пароль пустой — включаем фирменную тряску macOS
    if (password.trim().length === 0) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500); // Длина анимации тряски
      return;
    }

    // Если что-то введено, пускаем в систему
    onLogin();
  };

  const formattedTime = time.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: false, // На Mac по умолчанию чаще стоит 24-часовой формат
  });

  const formattedDate = time.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const wallpaper = isDarkMode ? "/wallpaper-night.jpg" : "/wallpaper-day.jpg";

  return (
    <div
      className="h-screen w-screen bg-cover bg-center flex flex-col items-center justify-between py-12 px-6 select-none relative transition-all duration-700"
      style={{ backgroundImage: `url('${wallpaper}')` }}
    >
      {/* Слой размытия заднего фона для более глубокого погружения в стиле Glassmorphism */}
      <div className="absolute inset-0 bg-black/[0.05] dark:bg-black/[0.15] pointer-events-none" />

      {/* Верхний блок: Время и Дата */}
      <div className="flex flex-col items-center mt-8 z-10 text-center text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.3)]">
        <h1 className="text-[76px] font-thin tracking-tight leading-none mb-3 selection:bg-transparent">
          {formattedTime}
        </h1>
        <p className="text-[17px] font-medium tracking-wide opacity-90 selection:bg-transparent">
          {formattedDate}
        </p>
      </div>

      {/* Центральный блок: Пользователь и Форма ввода */}
      <div 
        className={`flex flex-col items-center z-10 transition-transform duration-500 ${
          isShaking ? "animate-[shake_0.5s_ease-in-out]" : ""
        }`}
      >
        {/* Аватар в стиле macOS */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-slate-700 to-slate-900 dark:from-slate-800 dark:to-slate-950 flex items-center justify-center mb-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.25)] border border-white/10">
          <span className="text-white text-3xl font-light tracking-wide">FH</span>
        </div>
        
        <h2 className="text-white text-[17px] font-medium tracking-wide mb-5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
          Farid Huseynov
        </h2>

        {/* Форма аутентификации */}
        <form onSubmit={handleSubmit} className="relative flex items-center group">
          <Input
            type="password"
            autoFocus
            placeholder="Enter ANY Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-52 h-[26px] bg-white/15 dark:bg-black/20 backdrop-blur-md border border-white/10 dark:border-white/[0.05] rounded-full text-center text-white text-xs placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:border-transparent transition-all pr-7 shadow-[0_2px_8px_rgba(0,0,0,0.1)] font-sans"
          />
          
          {/* Нативная круглая кнопка со стрелкой внутри инпута, которая появляется при вводе текста */}
          {password.length > 0 && (
            <button
              type="submit"
              className="absolute right-1 w-[20px] h-[20px] bg-white/20 hover:bg-white/30 active:scale-95 text-white rounded-full flex items-center justify-center transition-all border border-white/10"
            >
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </form>
        
        <p className="text-[11px] text-white/40 mt-3 tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
          {password.length === 0 ? "Click to enter password" : "Press Enter to Unlock"}
        </p>
      </div>

      {/* Нижний блок: Смена темы */}
      <div className="z-10 mt-auto">
        <button
          className="text-white/60 hover:text-white p-2.5 rounded-full hover:bg-white/10 transition-all active:scale-95 drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
          onClick={onToggleDarkMode}
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      {/* Инъекция ключевых кадров для анимации тряски (встроенный стиль Tailwind) */}
      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          12.5% { transform: translateX(-6px); }
          37.5% { transform: translateX(5px); }
          62.5% { transform: translateX(-4px); }
          87.5% { transform: translateX(3px); }
        }
      `}</style>
    </div>
  );
}