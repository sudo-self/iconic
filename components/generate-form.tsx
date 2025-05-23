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
        headers: {
          "Content-Type": "application/json",
        },
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
    <div className="flex-1 bg-white rounded-lg p-5 shadow-sm">
      <h3 className="font-semibold text-gray-800 flex items-center">
  <img src="./MaterialSymbolsTextFields.svg" alt="Text Fields" className="w-5 h-5 mr-2" />
</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="promptInput" className="block text-sm font-medium text-gray-700 mb-1">
            describe your idea
          </label>
          <Input
            id="promptInput"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="a text description..."
            required
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">select a theme for different results (optional)</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant={theme === "metal" ? "default" : "outline"}
            onClick={() => setTheme("metal")}
          >
            <Shield className="w-4 h-4 mr-1" />
            Metal
          </Button>
          <Button
            type="button"
            variant={theme === "cartoon" ? "default" : "outline"}
            onClick={() => setTheme("cartoon")}
          >
            <Palette className="w-4 h-4 mr-1" />
            Cartoon
          </Button>
          <Button
            type="button"
            variant={theme === "realistic" ? "default" : "outline"}
            onClick={() => setTheme("realistic")}
          >
            <Camera className="w-4 h-4 mr-1" />
            Realistic
          </Button>
          <Button
            type="button"
            variant={theme === "anime" ? "default" : "outline"}
            onClick={() => setTheme("anime")}
          >
            <Image className="w-4 h-4 mr-1" />
            Anime
          </Button>
          <Button
            type="button"
            variant={theme === "bw" ? "default" : "outline"}
            onClick={() => setTheme("bw")}
          >
            <Contrast className="w-4 h-4 mr-1" />
            B&amp;W
          </Button>
          <Button
            type="button"
            variant={theme === "neon" ? "default" : "outline"}
            onClick={() => setTheme("neon")}
          >
            <Zap className="w-4 h-4 mr-1" />
            Neon
          </Button>
        </div>

        <div className="flex gap-3">
          <Button type="submit" className="flex-1 bg-indigo-600 hover:bg-pink-700" disabled={isGenerating}>
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




