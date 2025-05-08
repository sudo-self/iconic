"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface TopCarouselProps {
  onSelectPrompt?: (prompt: string) => void
}

const examples = [
  "https://pub-c1de1cb456e74d6bbbee111ba9e6c757.r2.dev/cyberpunk.svg",
  "https://pub-c1de1cb456e74d6bbbee111ba9e6c757.r2.dev/cyberpunk.svg",
  "https://pub-c1de1cb456e74d6bbbee111ba9e6c757.r2.dev/cyberpunk.svg",
]

export default function TopCarousel({ onSelectPrompt }: TopCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % examples.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [isPaused])

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % examples.length)
  }

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + examples.length) % examples.length)
  }

  return (
    <div
      className="relative w-full max-w-lg mx-auto mb-8 mt-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={goToPrev}
          className="p-1 rounded-full bg-white shadow-sm hover:bg-gray-200 transition-colors"
          aria-label="Previous icon"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="w-16 h-16 bg-white rounded-lg shadow-sm flex items-center justify-center overflow-hidden">
          <img
            src={examples[currentIndex]}
            alt={`Example icon ${currentIndex + 1}`}
            className="w-12 h-12 object-contain"
          />
        </div>

        <button
          onClick={goToNext}
          className="p-1 rounded-full bg-white shadow-sm hover:bg-gray-200 transition-colors"
          aria-label="Next icon"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="flex justify-center mt-2 gap-1">
        {examples.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-colors",
              index === currentIndex ? "bg-blue-600" : "bg-gray-300",
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

