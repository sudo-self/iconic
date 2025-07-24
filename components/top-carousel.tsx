"use client"

import { useEffect, useState } from "react"

const examples = [
  "https://picsum.photos/id/1015/200/200",
  "https://picsum.photos/id/1016/200/200",
  "https://picsum.photos/id/1018/200/200",
  "https://picsum.photos/id/1020/200/200",
  "https://picsum.photos/id/1024/200/200",
  "https://picsum.photos/id/1027/200/200",
  "https://picsum.photos/id/1035/200/200",
  "https://picsum.photos/id/1038/200/200"
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





