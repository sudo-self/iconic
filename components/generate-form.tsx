"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Wand2, LoaderPinwheelIcon as Spinner } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

interface GenerateFormProps {
  setGeneratedImageUrl: (url: string | null) => void
  initialPrompt?: string
}

export default function GenerateForm({ setGeneratedImageUrl, initialPrompt = "" }: GenerateFormProps) {
  const [prompt, setPrompt] = useState(initialPrompt)
  const [isGenerating, setIsGenerating] = useState(false)
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

    try {
      const response = await fetch("https://text-to-image.jessejesse.workers.dev", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`)
      }

      const blob = await response.blob()
      const imageUrl = URL.createObjectURL(blob)
      setGeneratedImageUrl(imageUrl)

      toast({
        title: "Icon generated",
        description: "Your icon has been generated successfully!",
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
      <h3 className="font-semibold text-gray-800 mb-4">iconic.JesseJesse.xyz</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="promptInput" className="block text-sm font-medium text-gray-700 mb-1">
            Describe your icon
          </label>
          <Input
            id="promptInput"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. A cute cat face, minimal style"
            required
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">Be as descriptive as possible for best results</p>
        </div>

        <div className="flex gap-3">
          <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700" disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Spinner className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Icon
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

