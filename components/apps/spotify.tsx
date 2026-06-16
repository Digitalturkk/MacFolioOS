"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Shuffle, Repeat } from "lucide-react"

interface SpotifyProps {
  isDarkMode?: boolean
}

export default function Spotify({ isDarkMode = true }: SpotifyProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [isAudioReady, setIsAudioReady] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)
  const [isRepeat, setIsRepeat] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const audioRef = useRef<HTMLAudioElement>(null)

  const playlist = [
    {
      title: "Dinle Beni Bi",
      artist: "Yüzyüzeyken Konuşuruz",
      cover: "/cozy-corner-beats.png",
      file: "/dinle.mp3",
      duration: "2:25",
    },
    {
      title: "ylang-ylang",
      artist: "FKJ",
      cover: "/cool-blue-jazz.jpg",
      file: "/ylang.mp3",
      duration: "3:33",
    },
    {
      title: "Golden Brown",
      artist: "The Stranglers",
      cover: "/grand-piano-keys.png",
      file: "/golden.mp3",
      duration: "3:27",
    },
  ]

  const currentTrack = playlist[currentTrackIndex]

  // Стили в каноничных тонах Spotify Premium
  const bgColor = isDarkMode ? "bg-[#121212]" : "bg-[#f8f9fa]"
  const cardBg = isDarkMode ? "bg-[#181818]" : "bg-white border border-neutral-200"
  const textColor = isDarkMode ? "text-white" : "text-neutral-900"
  const secondaryBg = isDarkMode ? "bg-[#040404]" : "bg-neutral-100 border-t border-neutral-200"

  // Эффект управления аудиопотоком и подписки на события
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    setIsAudioReady(false)
    setError(null)

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => {
      if (audio.duration) setDuration(audio.duration)
    }
    
    const handleCanPlay = () => {
      setIsAudioReady(true)
      // Если до переключения трек играл, запускаем следующий автоматически без таймаутов
      if (isPlaying) {
        audio.play().catch(() => setIsPlaying(false))
      }
    }

    const handleEnd = () => {
      if (isRepeat) {
        audio.currentTime = 0
        audio.play().catch(() => setIsPlaying(false))
      } else {
        handleNext()
      }
    }

    const handleError = () => {
      setError("Ошибка загрузки аудиофайла")
      setIsPlaying(false)
    }

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)
    audio.addEventListener("canplay", handleCanPlay)
    audio.addEventListener("ended", handleEnd)
    audio.addEventListener("error", handleError)

    audio.load()

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
      audio.removeEventListener("canplay", handleCanPlay)
      audio.removeEventListener("ended", handleEnd)
      audio.removeEventListener("error", handleError)
    }
  }, [currentTrackIndex])

  // Синхронизация состояния Play/Pause
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !isAudioReady) return

    if (isPlaying) {
      audio.play().catch((err) => {
        console.warn("Блокировка автоплея браузером:", err)
        setIsPlaying(false)
      })
    } else {
      audio.pause()
    }
  }, [isPlaying, isAudioReady])

  // Контроль громкости
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  const togglePlay = () => {
    if (!isAudioReady) return
    setIsPlaying(!isPlaying)
  }

  const handleNext = () => {
    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * playlist.length)
      setCurrentTrackIndex(randomIndex)
    } else {
      setCurrentTrackIndex((prev) => (prev === playlist.length - 1 ? 0 : prev + 1))
    }
  }

  const handlePrevious = () => {
    setCurrentTrackIndex((prev) => (prev === 0 ? playlist.length - 1 : prev - 1))
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return
    const newTime = Number.parseFloat(e.target.value)
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseFloat(e.target.value)
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const selectTrack = (index: number) => {
    if (index === currentTrackIndex) {
      togglePlay()
    } else {
      setCurrentTrackIndex(index)
      setIsPlaying(true) // Оставляем флаг true, useEffect сам подхватит старт при canplay
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  return (
    <div className={`h-full ${bgColor} ${textColor} flex flex-col select-none antialiased`} style={{ borderBottomLeftRadius: "inherit", borderBottomRightRadius: "inherit" }}>
      {/* Плеер и обложка */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-[340px]">
        <div className="w-44 h-44 mb-5 rounded-lg overflow-hidden shadow-[0_15px_30px_rgba(0,0,0,0.4)] transition-transform duration-500 group-hover:scale-[1.02]">
          <img src={currentTrack.cover || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
        </div>

        <div className="text-center w-full max-w-xs mb-4">
          <h3 className="text-lg font-bold tracking-tight truncate">{currentTrack.title}</h3>
          <p className="text-xs font-medium text-neutral-400 mt-0.5 truncate">{currentTrack.artist}</p>
          {error && <p className="text-red-400 text-[10px] mt-1 bg-red-500/10 py-0.5 rounded">{error}</p>}
        </div>

        {/* Прогресс-бар */}
        <div className="w-full max-w-sm mb-4 px-2">
          <div className="flex justify-between text-[10px] font-semibold text-neutral-400 mb-1.5 tracking-wider">
            <span>{formatTime(currentTime)}</span>
            <span>{isAudioReady ? formatTime(duration) : currentTrack.duration}</span>
          </div>
          <div className="relative group flex items-center">
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleTimeChange}
              disabled={!isAudioReady}
              className="w-full h-1 rounded-full appearance-none bg-neutral-700 cursor-pointer outline-none accent-transparent"
              style={{
                background: `linear-gradient(to right, #1db954 0%, #1db954 ${
                  (currentTime / (duration || 1)) * 100
                }%, #404040 ${(currentTime / (duration || 1)) * 100}%, #404040 100%)`,
              }}
            />
          </div>
        </div>

        {/* Управление треком */}
        <div className="flex items-center justify-center space-x-5">
          <button 
            className={`p-1 rounded-full transition-colors ${isShuffle ? "text-[#1db954]" : "text-neutral-400 hover:text-white"}`}
            onClick={() => setIsShuffle(!isShuffle)}
          >
            <Shuffle className="w-4 h-4" />
          </button>

          <button className="p-2 text-neutral-400 hover:text-white transition-colors" onClick={handlePrevious}>
            <SkipBack className="w-5 h-5 fill-current" />
          </button>

          <button
            className={`p-3 rounded-full transition-all ${isAudioReady ? "bg-white text-black hover:scale-105 active:scale-95" : "bg-neutral-600 text-neutral-400"}`}
            onClick={togglePlay}
            disabled={!isAudioReady}
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current translate-x-[1px]" />}
          </button>

          <button className="p-2 text-neutral-400 hover:text-white transition-colors" onClick={handleNext}>
            <SkipForward className="w-5 h-5 fill-current" />
          </button>

          <button 
            className={`p-1 rounded-full transition-colors ${isRepeat ? "text-[#1db954]" : "text-neutral-400 hover:text-white"}`}
            onClick={() => setIsRepeat(!isRepeat)}
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Список воспроизведения */}
      <div className={`${secondaryBg} p-4 max-h-[220px] overflow-y-auto`}>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Очередь воспроизведения</h3>
          <div className="flex items-center space-x-2">
            <button className="text-neutral-400 hover:text-white transition-colors" onClick={() => setIsMuted(!isMuted)}>
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-16 h-1 rounded-full appearance-none bg-neutral-700 cursor-pointer outline-none"
              style={{
                background: `linear-gradient(to right, #1db954 0%, #1db954 ${(isMuted ? 0 : volume) * 100}%, #404040 ${
                  (isMuted ? 0 : volume) * 100
                }%, #404040 100%)`,
              }}
            />
          </div>
        </div>

        <div className="space-y-1">
          {playlist.map((track, index) => {
            const isCurrent = currentTrackIndex === index
            return (
              <div
                key={index}
                className={`flex items-center p-2 rounded-md transition-colors cursor-pointer ${
                  isCurrent ? (isDarkMode ? "bg-neutral-800" : "bg-neutral-200/70") : "hover:bg-neutral-800/40"
                }`}
                onClick={() => selectTrack(index)}
              >
                <div className="w-9 h-9 mr-3 rounded overflow-hidden flex-shrink-0 relative">
                  <img src={track.cover || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                  {isCurrent && isPlaying && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="flex items-end space-x-0.5 h-3.5">
                        <div className="w-0.5 bg-[#1db954] animate-pulse h-full" />
                        <div className="w-0.5 bg-[#1db954] animate-pulse h-2 delay-75" />
                        <div className="w-0.5 bg-[#1db954] animate-pulse h-3 delay-150" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold truncate ${isCurrent ? "text-[#1db954]" : ""}`}>
                    {track.title}
                  </p>
                  <p className="text-[11px] text-neutral-400 truncate mt-0.5">{track.artist}</p>
                </div>
                <div className="text-[11px] text-neutral-400 pl-2 font-medium">{track.duration}</div>
              </div>
            )
          })}
        </div>
      </div>

      <audio ref={audioRef} src={currentTrack.file} preload="auto" />
    </div>
  )
}