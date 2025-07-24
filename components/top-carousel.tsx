"use client"

import { useEffect, useState } from "react"

const examples = [
  // Neon
  "https://cdn.midjourney.com/e1b6c38e-7cbe-4f55-8a7b-bf7e92f10ac2/0_0.png", 
  "https://cdn.openart.ai/uploads/image_1683943345467.png",

  // Black and White
  "https://cdn.openart.ai/uploads/image_1683943857157.png",
  "https://cdn.openart.ai/uploads/image_1683943482356.png",

  // Cartoon / Anime
  "https://cdn.openart.ai/uploads/image_1683943294224.png", 
  "https://cdn.openart.ai/uploads/image_1683943381942.png",

  // Bonus examples
  "https://cdn.openart.ai/uploads/image_1683943573136.png",
  "https://cdn.openart.ai/uploads/image_1683943627869.png" 
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
              src={src}
              alt={`item-${i}`}
              className="w-full h-full object-cover"
              loading="lazy"
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







