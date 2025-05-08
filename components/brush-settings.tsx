"use client"

import { Circle, Square, Eraser } from "lucide-react"
import { cn } from "@/lib/utils"

interface BrushSettingsProps {
  brushSize: number
  setBrushSize: (size: number) => void
  brushShape: "round" | "square" | "eraser"
  setBrushShape: (shape: "round" | "square" | "eraser") => void
}

export default function BrushSettings({ brushSize, setBrushSize, brushShape, setBrushShape }: BrushSettingsProps) {
  return (
    <div className="bg-white rounded-lg p-5 shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-3">Brush Settings</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="brushSize" className="block text-sm font-medium text-gray-700 mb-1">
            Size
          </label>
          <input
            type="range"
            id="brushSize"
            min="1"
            max="50"
            value={brushSize}
            onChange={(e) => setBrushSize(Number.parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <p className="text-sm text-gray-600 mt-1">{brushSize}px</p>
        </div>

        {/* Brush Shapes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Shape</label>
          <div className="flex gap-3">
            <button
              onClick={() => setBrushShape("round")}
              className={cn(
                "flex items-center justify-center w-12 h-12 rounded-lg transition-all",
                "border-2 border-gray-200 bg-gray-50 hover:bg-gray-100",
                brushShape === "round" && "bg-blue-500 border-blue-600 text-white hover:bg-blue-600",
              )}
              title="Round Brush"
            >
              <Circle className="h-5 w-5" />
            </button>

            <button
              onClick={() => setBrushShape("square")}
              className={cn(
                "flex items-center justify-center w-12 h-12 rounded-lg transition-all",
                "border-2 border-gray-200 bg-gray-50 hover:bg-gray-100",
                brushShape === "square" && "bg-blue-500 border-blue-600 text-white hover:bg-blue-600",
              )}
              title="Square Brush"
            >
              <Square className="h-5 w-5" />
            </button>

            <button
              onClick={() => setBrushShape("eraser")}
              className={cn(
                "flex items-center justify-center w-12 h-12 rounded-lg transition-all",
                "border-2 border-gray-200 bg-gray-50 hover:bg-gray-100",
                brushShape === "eraser" && "bg-blue-500 border-blue-600 text-white hover:bg-blue-600",
              )}
              title="Eraser"
            >
              <Eraser className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
