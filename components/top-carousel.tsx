"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface TopCarouselProps {
  onSelectPrompt?: (prompt: string) => void
}

export default function TopCarousel({ onSelectPrompt }: TopCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const examples = [
    "Minimal mountain icon, flat design, blue and white",
    "Cartoon rocket ship, colorful, on transparent background",
    "Abstract geometric shape, modern, gradient colors",
    "Vintage camera icon, line art style, black and white",
    "Coffee cup with steam, flat design, brown and cream",
    "Heart with wings, minimal outline, pink color",
  ]

  // Simpler carousel logic
  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % examples.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [isPaused, examples.length])

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % examples.length)
  }

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + examples.length) % examples.length)
  }

  const handleSelectPrompt = () => {
    if (onSelectPrompt) {
      onSelectPrompt(examples[currentIndex])
    }
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

        <div className="flex justify-center h-20 relative">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-white rounded-lg shadow-sm flex items-center justify-center overflow-hidden">
              <img
                src={`/placeholder.svg?height=64&width=64`}
                alt={`Example icon ${currentIndex + 1}`}
                className="w-12 h-12 object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-700">{examples[currentIndex].split(",")[0]}</span>
              {onSelectPrompt && (
                <button
                  onClick={handleSelectPrompt}
                  className="text-xs text-blue-600 hover:text-blue-800 transition-colors mt-1"
                >
                  Use this prompt
                </button>
              )}
            </div>
          </div>
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
