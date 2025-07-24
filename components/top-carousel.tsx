"use client"

import { useEffect, useState } from "react"

const examples = [

  "https://firebasestorage.googleapis.com/v0/b/svetle-book.appspot.com/o/iconic%2F1.png?alt=media&token=fd7f62de-40c9-4ea5-a63b-2ff917cf6e65",
  "https://firebasestorage.googleapis.com/v0/b/svetle-book.appspot.com/o/iconic%2Ficon-256x256.png?alt=media&token=be5f2f80-802f-4be3-bc44-f31f02a75435",
  "https://firebasestorage.googleapis.com/v0/b/svetle-book.appspot.com/o/iconic%2F2.png?alt=media&token=5c1dca2d-6a24-4781-a3b1-d7e471252aac",
  "https://firebasestorage.googleapis.com/v0/b/svetle-book.appspot.com/o/iconic%2Fimage-3.webp?alt=media&token=855cd0c3-8d22-4814-8251-1ca2e1822a6e",
  "https://firebasestorage.googleapis.com/v0/b/svetle-book.appspot.com/o/iconic%2FCover.jpg?alt=media&token=c20c92e1-3aea-414b-995c-4c40206dec80",
  "https://firebasestorage.googleapis.com/v0/b/svetle-book.appspot.com/o/iconic%2F2d.png?alt=media&token=7c74fc88-de9c-444c-90d1-2bd42cae358a",
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








