"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface IconCarouselProps {
  items: string[]
  onSelect: (item: string) => void
}

export default function IconCarousel({ items, onSelect }: IconCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Start the carousel
  useEffect(() => {
    startCarousel()
    return () => stopCarousel()
  }, [currentIndex, isPaused])

  const startCarousel = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)

    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length)
      }, 3000)
    }
  }

  const stopCarousel = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length)
  }

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length)
  }

  const handleSelect = (item: string) => {
    onSelect(item)
  }

  return (
    <div
      className="relative w-full rounded-lg bg-gray-100 p-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center justify-between">
        <button
          onClick={goToPrev}
          className="p-1 rounded-full bg-white shadow-sm hover:bg-gray-200 transition-colors"
          aria-label="Previous icon"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex-1 flex justify-center">
          {items.map((item, index) => (
            <div
              key={index}
              className={cn(
                "transition-all duration-300 transform",
                index === currentIndex ? "scale-100 opacity-100" : "scale-0 opacity-0 absolute",
              )}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 bg-white rounded-lg shadow-sm flex items-center justify-center overflow-hidden">
                  <img
                    src={`/prompt1.svg?height=64&width=64`}
                    alt={`Example icon ${index + 1}`}
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <button
                  onClick={() => handleSelect(item)}
                  className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Use this prompt
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={goToNext}
          className="p-1 rounded-full bg-white shadow-sm hover:bg-gray-200 transition-colors"
          aria-label="Next icon"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="flex justify-center mt-4 gap-1">
        {items.map((_, index) => (
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
