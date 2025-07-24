"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Shield,
  Palette,
  Camera,
  Image,
  Camera as CameraIcon,
  LoaderPinwheelIcon as Spinner,
  Contrast,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

interface GenerateFormProps {
  setGeneratedImageUrl: (url: string | null) => void
  initialPrompt?: string
}

export default function GenerateForm({
  setGeneratedImageUrl,
  initialPrompt = "",
}: GenerateFormProps) {
  const [prompt, setPrompt] = useState(initialPrompt)
  const [isGenerating, setIsGenerating] = useState(false)
  const [theme, setTheme] = useState<
    "metal" | "cartoon" | "realistic" | "anime" | "bw" | "neon" | null
  >(null)
  const { toast } = useToast()

  useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt)
    }
  }, [initialPrompt])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setIsGenerating(true)

    const themedPrompt =
      theme === "metal"
        ? `${prompt}, in a metal style`
        : theme === "cartoon"
        ? `${prompt}, in a cartoon style`
        : theme === "realistic"
        ? `${prompt}, in a realistic style`
        : theme === "anime"
        ? `${prompt}, in an anime style`
        : theme === "bw"
        ? `${prompt}, black and white, monochrome`
        : theme === "neon"
        ? `${prompt}, glowing neon colors, vivid lighting`
        : prompt

    try {
      const response = await fetch("https://text-to-image.jessejesse.workers.dev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: themedPrompt }),
      })

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`)
      }

      const blob = await response.blob()
      const imageUrl = URL.createObjectURL(blob)
      setGeneratedImageUrl(imageUrl)

      toast({
        title: "iconic.JesseJesse.xyz",
        description: "iconic has been generated!",
      })
    } catch (error) {
      console.error("Error generating image:", error)
      toast({
        title: "Generation failed",
        description: "Failed to generate icon. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="flex-1 bg-white/20 dark:bg-black/30 backdrop-blur-md rounded-xl shadow-xl p-6 border border-white/10">
      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
        <img
          src="./MaterialSymbolsTextFields.svg"
          alt="Text Fields"
          className="w-5 h-5 mr-2"
        />
        Enter text
      </h3>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="promptInput"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Describe your idea
          </label>
          <Input
            id="promptInput"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="futuristic robot head with glowing eyes"
            required
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-2">
            Add a theme to customize the style of the image (optional)
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {([
            { key: "metal", label: "Metal", icon: <Shield className="w-4 h-4" /> },
            { key: "cartoon", label: "Cartoon", icon: <Palette className="w-4 h-4" /> },
            { key: "realistic", label: "Realistic", icon: <Camera className="w-4 h-4" /> },
            { key: "anime", label: "Anime", icon: <Image className="w-4 h-4" /> },
            { key: "bw", label: "B&W", icon: <Contrast className="w-4 h-4" /> },
            { key: "neon", label: "Neon", icon: <Zap className="w-4 h-4" /> },
          ] as const).map(({ key, label, icon }) => (
            <Button
              key={key}
              type="button"
              onClick={() => setTheme(key)}
              variant={theme === key ? "default" : "outline"}
              className={`transition-all duration-200 hover:scale-105 ${
                theme === key
                  ? "ring-2 ring-offset-2 ring-indigo-500 dark:ring-pink-500"
                  : ""
              }`}
            >
              <span className="mr-1">{icon}</span>
              {label}
            </Button>
          ))}
        </div>

        <div className="flex gap-3">
          <Button
            type="submit"
            className="flex-1 bg-indigo-600 dark:bg-pink-600 hover:bg-indigo-700 dark:hover:bg-pink-700 text-white transition-all duration-200 shadow-md hover:shadow-lg"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Spinner className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <CameraIcon className="mr-2 h-4 w-4" />
                Generate Icon
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}




