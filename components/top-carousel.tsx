"use client"

import { useEffect, useState } from "react"

const examples = [

  "https://firebasestorage.googleapis.com/v0/b/svetle-book.appspot.com/o/iconic%2F1.png?alt=media&token=fd7f62de-40c9-4ea5-a63b-2ff917cf6e65",
  "https://firebasestorage.googleapis.com/v0/b/svetle-book.appspot.com/o/iconic%2Fsksksksksks.png?alt=media&token=c88f8c26-bafe-438e-a2ba-75434c422a3f",
  "https://firebasestorage.googleapis.com/v0/b/svetle-book.appspot.com/o/iconic%2Fgolden.png?alt=media&token=70b26b84-dab8-45f9-8439-e90987539392",
  "https://firebasestorage.googleapis.com/v0/b/svetle-book.appspot.com/o/iconic%2Fdddddddd.png?alt=media&token=464dc513-2631-42a8-8a8b-674ce8442fdf",
  "https://firebasestorage.googleapis.com/v0/b/svetle-book.appspot.com/o/iconic%2F5555555.png?alt=media&token=1fe2c5f0-dbd2-4199-806a-90f25ce20e16",
  "https://firebasestorage.googleapis.com/v0/b/svetle-book.appspot.com/o/iconic%2F789.png?alt=media&token=8fd40bed-2d82-4ed4-b02b-21993f0a05e3",
  "https://firebasestorage.googleapis.com/v0/b/svetle-book.appspot.com/o/iconic%2Ficon-512x512.png?alt=media&token=6e1cb487-342e-4d47-8df3-a168e3963f94",
  "https://firebasestorage.googleapis.com/v0/b/svetle-book.appspot.com/o/iconic%2F4.png?alt=media&token=341633d1-447e-4517-acb1-e8969089d79f"
]

export default function TopCarousel() {
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const handleVisibilityChange = () => setIsPaused(document.hidden)
    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [])

  return (
    <div
      className="w-full overflow-hidden py-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className={`flex gap-8 w-max animate-marquee whitespace-nowrap transition-transform duration-700 ease-out ${isPaused ? "pause" : ""}`}
      >
        {[...examples, ...examples].map((src, i) => (
          <div
            key={i}
            className="w-[200px] h-[200px] relative group rounded-2xl overflow-hidden shadow-xl bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20"
          >
            <img
              src={`${src}`}
              alt={`item-${i}`}
              className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110 group-hover:rotate-1"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/apple-touch-icon.png"
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          animation: marquee 40s linear infinite;
        }

        .pause {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}








