"use client"

import { useEffect, useState } from "react"

const examples = [
  // Neon
  "https://firebasestorage.googleapis.com/v0/b/svetle-book.appspot.com/o/iconic%2Ficon-512x512.png?alt=media&token=1eccfbcc-d2f7-4a51-b3ad-c4d443b7e245", // neon Tokyo
  "https://firebasestorage.googleapis.com/v0/b/svetle-book.appspot.com/o/iconic%2FTablerBrandThreejs.svg?alt=media&token=f1573d23-e521-4c21-bab5-184fe2cf4b74", // neon alley

  // Black and White
  "https://firebasestorage.googleapis.com/v0/b/svetle-book.appspot.com/o/iconic%2FCover.jpg?alt=media&token=c20c92e1-3aea-414b-995c-4c40206dec80", // BW portrait
  "https://firebasestorage.googleapis.com/v0/b/svetle-book.appspot.com/o/iconic%2F2d.png?alt=media&token=7c74fc88-de9c-444c-90d1-2bd42cae358a", // BW man

  // Cartoon / Anime
  "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/45.png",
  "https://firebasestorage.googleapis.com/v0/b/svetle-book.appspot.com/o/iconic%2FLogosGithubOctocat.svg?alt=media&token=8a359564-5b2f-4173-a83b-8f1c45d27e37",

  // Bonus examples
  "https://firebasestorage.googleapis.com/v0/b/svetle-book.appspot.com/o/iconic%2Ficon-512x512.png?alt=media&token=3839cd7a-ff65-4d0a-80ab-7cf5ce7c3784", // surreal
  "https://firebasestorage.googleapis.com/v0/b/svetle-book.appspot.com/o/iconic%2FIMG_0494.png?alt=media&token=e8a3b3dd-b240-46ee-b63c-2d1f58ac23d8"  // neon portrait
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







