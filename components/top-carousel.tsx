"use client"

import { useEffect, useState } from "react"

const examples = [
  "https://pub-c1de1cb456e74d6bbbee111ba9e6c757.r2.dev/cyberpunk.svg",
  "https://pub-c1de1cb456e74d6bbbee111ba9e6c757.r2.dev/image3.svg",
  "https://pub-c1de1cb456e74d6bbbee111ba9e6c757.r2.dev/image-11.svg",
  "https://pub-c1de1cb456e74d6bbbee111ba9e6c757.r2.dev/image-13.svg",
  "https://pub-c1de1cb456e74d6bbbee111ba9e6c757.r2.dev/image-10.svg",
  "https://pub-c1de1cb456e74d6bbbee111ba9e6c757.r2.dev/image%20(2).svg",
  "https://pub-c1de1cb456e74d6bbbee111ba9e6c757.r2.dev/image-12.svg"
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
            className="w-32 h-32 bg-white rounded-xl shadow-md overflow-hidden"
          >
            <img src={src} alt={`item-${i}`} className="w-full h-full object-cover" />
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




