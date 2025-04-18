"use client"

import { useEffect, useRef } from "react"

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      audio.volume = 0.5
      audio.loop = true

      const playAudio = () => {
        audio.play().catch((err) => {
          console.warn("Lecture automatique bloquée :", err)
        })
      }

      // Attend une action utilisateur si nécessaire
      if (document.readyState === "complete") {
        playAudio()
      } else {
        window.addEventListener("click", playAudio, { once: true })
      }
    }

    return () => {
      if (audio) {
        audio.pause()
        audio.currentTime = 0
      }
    }
  }, [])

  return <audio ref={audioRef} src="/risk.mp3" />
}
