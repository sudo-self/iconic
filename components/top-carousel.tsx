"use client"

import { useState, useEffect } from "react"

const examples = [
  "https://pub-c1de1cb456e74d6bbbee111ba9e6c757.r2.dev/cyberpunk.svg",
  "https://pub-c1de1cb456e74d6bbbee111ba9e6c757.r2.dev/prompt1.svg",
  "https://pub-c1de1cb456e74d6bbbee111ba9e6c757.r2.dev/image3.svg",
  "https://pub-c1de1cb456e74d6bbbee111ba9e6c757.r2.dev/cyberpunk.svg",
  "https://pub-c1de1cb456e74d6bbbee111ba9e6c757.r2.dev/prompt1.svg",
]

export default function TopCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Pause carousel on tab switch
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPaused(document.hidden)
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  // Auto-play carousel
  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % examples.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [isPaused])

  return (
    <div
      className="w-full flex justify-center items-center mt-6 mb-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="w-40 h-40 rounded-2xl bg-white shadow-lg flex items-center justify-center overflow-hidden transition-all">
        <img
          src={examples[currentIndex]}
          alt={`Carousel item ${currentIndex + 1}`}
          className="w-36 h-36 object-contain transition-opacity duration-500"
        />
      </div>
    </div>
  )
}


