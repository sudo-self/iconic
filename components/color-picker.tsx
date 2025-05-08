"use client"

import type React from "react"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface ColorPickerProps {
  brushColor: string
  setBrushColor: (color: string) => void
}

export default function ColorPicker({ brushColor, setBrushColor }: ColorPickerProps) {
  const [activeColor, setActiveColor] = useState<string | null>(null)

  const presetColors = [
    { color: "#ef4444", bg: "bg-red-500" },
    { color: "#10b981", bg: "bg-green-500" },
    { color: "#3b82f6", bg: "bg-blue-500" },
    { color: "#facc15", bg: "bg-yellow-500" },
    { color: "#8b5cf6", bg: "bg-purple-500" },
    { color: "#ec4899", bg: "bg-pink-500" },
    { color: "#6366f1", bg: "bg-indigo-500" },
    { color: "#1e293b", bg: "bg-gray-800" },
  ]

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBrushColor(e.target.value)
    setActiveColor(null)
  }

  const selectPresetColor = (color: string) => {
    setBrushColor(color)
    setActiveColor(color)
  }

  return (
    <div className="bg-white rounded-lg p-5 shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-3">Color</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="colorPicker" className="block text-sm font-medium text-gray-700 mb-1">
            Custom Color
          </label>
          <input
            type="color"
            id="colorPicker"
            value={brushColor}
            onChange={handleColorChange}
            className="w-12 h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
          />
          <p className="text-sm text-gray-600 mt-1">Selected: {brushColor}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Preset Colors</label>
          <div className="flex flex-wrap gap-2">
            {presetColors.map((preset) => (
              <button
                key={preset.color}
                onClick={() => selectPresetColor(preset.color)}
                className={cn(
                  preset.bg,
                  "w-8 h-8 rounded-full transition-transform hover:scale-110",
                  activeColor === preset.color && "scale-125 ring-2 ring-offset-2 ring-gray-800",
                )}
                aria-label={`Select color ${preset.color}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
