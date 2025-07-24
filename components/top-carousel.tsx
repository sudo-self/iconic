"use client"

import { useEffect, useState } from "react"

const examples = [
  "https://picsum.photos/id/1015/1024/1024",
  "https://picsum.photos/id/1016/1024/1024",
  "https://picsum.photos/id/1018/1024/1024",
  "https://picsum.photos/id/1020/1024/1024",
  "https://picsum.photos/id/1024/1024/1024",
  "https://picsum.photos/id/1027/1024/1024",
  "https://picsum.photos/id/1035/1024/1024",
  "https://picsum.photos/id/1038/1024/1024"
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







