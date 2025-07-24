"use client"

import { useEffect, useState } from "react"

const examples = [
  // Neon
  "https://images.unsplash.com/photo-1604079628048-9439f16849d4", // neon Tokyo
  "https://images.unsplash.com/photo-1626096894003-7fa3bb1b5dd5", // neon alley

  // Black and White
  "https://firebasestorage.googleapis.com/v0/b/svetle-book.appspot.com/o/iconic%2FCover.jpg?alt=media&token=c20c92e1-3aea-414b-995c-4c40206dec80", // BW portrait
  "https://images.unsplash.com/photo-1483794344563-d27a8d18014e", // BW man

  // Cartoon / Anime
  "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/45.png",
  "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/female/44.png",

  // Bonus examples
  "https://firebasestorage.googleapis.com/v0/b/svetle-book.appspot.com/o/iconic%2Ficon-512x512.png?alt=media&token=3839cd7a-ff65-4d0a-80ab-7cf5ce7c3784", // surreal
  "https://images.unsplash.com/photo-1600852471121-98fe5b6ca1f8"  // neon portrait
]

export default function TopCarousel() {
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPaused(document.hidden)
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  return (
    <div
      className="w-full overflow-hidden py-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className={`flex gap-8 w-max animate-marquee whitespace-nowrap ${isPaused ? "pause" : ""}`}
      >
        {[...examples, ...examples].map((src, i) => (
          <div
            key={i}
            className="w-[200px] h-[200px] bg-white dark:bg-card rounded-xl shadow-md overflow-hidden"
          >
            <img
              src={`${src}?auto=format&fit=crop&w=400&h=400&q=80`}
              alt={`item-${i}`}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/apple-touch-icon.png" 
              }}
            />
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
          animation: marquee 30s linear infinite;
        }

        .pause {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}







