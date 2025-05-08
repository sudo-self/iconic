"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface TextEditorProps {
  onSaveImage: (canvas: HTMLCanvasElement) => void
}

export default function TextEditor({ onSaveImage }: TextEditorProps) {
  const [text, setText] = useState("Your Icon Text")
  const [textColor, setTextColor] = useState("#000000")
  const [fontSize, setFontSize] = useState(48)
  const [fontFamily, setFontFamily] = useState("Arial")
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const fontOptions = ["Arial", "Helvetica", "Times New Roman", "Courier New", "Georgia", "Verdana", "Impact"]

  const colorOptions = [
    { name: "Black", value: "#000000" },
    { name: "Red", value: "#ff0000" },
    { name: "Blue", value: "#0000ff" },
    { name: "Green", value: "#008000" },
    { name: "Purple", value: "#800080" },
    { name: "Orange", value: "#ffa500" },
    { name: "Pink", value: "#ffc0cb" },
  ]

  const renderPreview = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Set text properties
    ctx.font = `${fontSize}px ${fontFamily}`
    ctx.fillStyle = textColor
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    // Draw text in the center
    ctx.fillText(text, canvas.width / 2, canvas.height / 2)
  }

  // Render the preview whenever any property changes
  useState(() => {
    renderPreview()
  })

  const handleSave = () => {
    if (canvasRef.current) {
      renderPreview() // Ensure the canvas is up to date
      onSaveImage(canvasRef.current)
    }
  }

  return (
    <div className="bg-white rounded-lg p-5 shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-4">Text Icon Creator</h3>

      <div className="space-y-4 mb-4">
        <div>
          <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 mb-1">
            Text
          </label>
          <Input
            id="text-input"
            value={text}
            onChange={(e) => {
              setText(e.target.value)
              renderPreview()
            }}
            className="w-full"
            maxLength={20}
          />
        </div>

        <div>
          <label htmlFor="font-size" className="block text-sm font-medium text-gray-700 mb-1">
            Font Size
          </label>
          <div className="flex items-center gap-2">
            <Input
              id="font-size"
              type="range"
              min="12"
              max="120"
              value={fontSize}
              onChange={(e) => {
                setFontSize(Number.parseInt(e.target.value))
                renderPreview()
              }}
              className="w-full"
            />
            <span className="text-sm text-gray-600 w-12">{fontSize}px</span>
          </div>
        </div>

        <div>
          <label htmlFor="font-family" className="block text-sm font-medium text-gray-700 mb-1">
            Font
          </label>
          <select
            id="font-family"
            value={fontFamily}
            onChange={(e) => {
              setFontFamily(e.target.value)
              renderPreview()
            }}
            className="w-full rounded-md border border-gray-300 p-2"
          >
            {fontOptions.map((font) => (
              <option key={font} value={font} style={{ fontFamily: font }}>
                {font}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
          <div className="grid grid-cols-4 gap-2">
            {colorOptions.map((color) => (
              <button
                key={color.value}
                onClick={() => {
                  setTextColor(color.value)
                  renderPreview()
                }}
                className={cn(
                  "h-8 rounded-md border-2",
                  textColor === color.value ? "border-blue-500" : "border-gray-200",
                )}
                style={{ backgroundColor: color.value }}
                title={color.name}
                aria-label={`Set text color to ${color.name}`}
              />
            ))}
            <div className="flex items-center">
              <input
                type="color"
                value={textColor}
                onChange={(e) => {
                  setTextColor(e.target.value)
                  renderPreview()
                }}
                className="w-8 h-8 cursor-pointer"
                title="Custom color"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-4 mb-4 bg-gray-50">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Preview</h4>
        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            width={300}
            height={300}
            className="border border-gray-200 bg-white"
            onLoad={renderPreview}
          />
        </div>
      </div>

      <Button onClick={handleSave} className="w-full bg-blue-600 hover:bg-blue-700">
        Save Icon
      </Button>
    </div>
  )
}
