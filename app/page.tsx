"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Download, Trash2, Upload, PaintbrushIcon as PaintBrush, Wand2 } from "lucide-react"
import JSZip from "jszip"
import DrawingCanvas, { type DrawingCanvasRef } from "@/components/drawing-canvas"
import ColorPicker from "@/components/color-picker"
import BrushSettings from "@/components/brush-settings"
import GenerateForm from "@/components/generate-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export default function IconicApp() {
  const [brushSize, setBrushSize] = useState(5)
  const [brushColor, setBrushColor] = useState("#000000")
  const [brushShape, setBrushShape] = useState<"round" | "square" | "eraser">("round")
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null)
  const canvasRef = useRef<DrawingCanvasRef>(null)
  const { toast } = useToast()

  // Add a new state for active tab
  const [activeTab, setActiveTab] = useState("draw")

  const clearCanvas = () => {
    if (window.confirm("Are you sure you want to clear the canvas?")) {
      canvasRef.current?.clearCanvas()
      toast({
        title: "Canvas cleared",
        description: "Your drawing has been cleared",
      })
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        const canvas = canvasRef.current?.getCanvas()
        if (canvas) {
          const ctx = canvas.getContext("2d")
          if (ctx) {
            // Clear canvas and draw the image centered
            ctx.fillStyle = "white"
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // Calculate dimensions to maintain aspect ratio
            const scale = Math.min(canvas.width / img.width, canvas.height / img.height)
            const width = img.width * scale
            const height = img.height * scale
            const x = (canvas.width - width) / 2
            const y = (canvas.height - height) / 2

            // Draw image
            ctx.drawImage(img, x, y, width, height)

            toast({
              title: "Image loaded",
              description: "Image loaded successfully to canvas",
            })
          }
        }
      }
      img.src = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}


  const saveIconPack = async () => {
    const canvas = canvasRef.current?.getCanvas()
    if (!canvas) return

    const zip = new JSZip()

    // Create different sizes
    const sizes = [16, 32, 48, 64, 128, 256, 512]
    const promises = sizes.map((size) => {
      return new Promise<void>((resolve) => {
        const tempCanvas = document.createElement("canvas")
        const tempCtx = tempCanvas.getContext("2d")
        if (!tempCtx) {
          resolve()
          return
        }

        tempCanvas.width = size
        tempCanvas.height = size

        // Draw original canvas content scaled to new size
        tempCtx.drawImage(canvas, 0, 0, size, size)

        // Convert to blob
        tempCanvas.toBlob((blob) => {
          if (blob) {
            zip.file(`icon-${size}x${size}.png`, blob)
          }
          resolve()
        }, "image/png")
      })
    })

    // Create favicon.ico (special handling)
    const icoCanvas = document.createElement("canvas")
    icoCanvas.width = 32
    icoCanvas.height = 32
    const icoCtx = icoCanvas.getContext("2d")
    if (icoCtx) {
      icoCtx.drawImage(canvas, 0, 0, 32, 32)

      icoCanvas.toBlob((blob) => {
        if (blob) {
          zip.file("favicon.ico", blob)
        }

        // Create apple-touch-icon.png (180x180)
        const appleCanvas = document.createElement("canvas")
        appleCanvas.width = 180
        appleCanvas.height = 180
        const appleCtx = appleCanvas.getContext("2d")
        if (appleCtx) {
          appleCtx.drawImage(canvas, 0, 0, 180, 180)

          appleCanvas.toBlob((appleBlob) => {
            if (appleBlob) {
              zip.file("apple-touch-icon.png", appleBlob)
            }

            // Wait for all size conversions to complete
            Promise.all(promises).then(() => {
              // Add README
              const readmeContent = `# Icon Pack Generated with Iconic
              
This zip contains your icon in multiple sizes for various use cases:

- favicon.ico - For website favicon (32x32)
- apple-touch-icon.png - For iOS home screen (180x180)
- icon-16x16.png to icon-512x512.png - Various sizes for different uses

## How to use

1. For websites, place these files in your root directory
2. Add this to your HTML <head> section:

\`\`\`html
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/icon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/icon-16x16.png">
\`\`\`

3. For apps, use the appropriate size for your platform requirements
`

              zip.file("README.txt", readmeContent)

              // Generate the zip file
              zip.generateAsync({ type: "blob" }).then((content) => {
                // Save the zip file
                saveFile(content, "iconic-pack.zip")

                // Show download complete notification
                toast({
                  title: "Download complete",
                  description: "Icon pack downloaded successfully!",
                })
              })
            })
          }, "image/png")
        }
      }, "image/x-icon")
    }
  }

  const useGeneratedImage = () => {
    if (!generatedImageUrl) return

    // First switch to the drawing tab
    setActiveTab("draw")

    // Load the image with a slight delay to ensure tab switch is complete
    setTimeout(() => {
      const img = new Image()
      img.crossOrigin = "anonymous"

      img.onload = () => {
        const canvas = canvasRef.current?.getCanvas()
        if (canvas) {
          const ctx = canvas.getContext("2d")
          if (ctx) {
            // Clear canvas and draw the image centered
            ctx.fillStyle = "white"
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // Calculate dimensions to maintain aspect ratio
            const scale = Math.min(canvas.width / img.width, canvas.height / img.height) * 0.9 // Scale to 90% of available space for better visibility

            const width = img.width * scale
            const height = img.height * scale
            const x = (canvas.width - width) / 2
            const y = (canvas.height - height) / 2

            ctx.drawImage(img, x, y, width, height)

            toast({
              title: "Image loaded",
              description: "Generated image loaded to canvas for editing",
            })
          }
        }
      }

      img.onerror = () => {
        toast({
          title: "Error loading image",
          description: "Failed to load the generated image to canvas",
          variant: "destructive",
        })
      }

      img.src = generatedImageUrl
    }, 100)
  }

  const saveFile = (blob: Blob, filename: string) => {
    // Create a temporary anchor element
    const link = document.createElement("a")
    // Create a URL for the blob
    const url = URL.createObjectURL(blob)

    // Set link properties
    link.href = url
    link.download = filename

    // Append to the document, click it, and remove it
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Clean up the URL
    URL.revokeObjectURL(url)
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center py-8 px-4 md:px-8">
      <div className="w-full max-w-6xl space-y-8">
        {/* Header */}
        <div className="flex flex-col items-center">
          <h1 className="font-bold text-4xl bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-2">
            iconic
          </h1>
          <p className="text-gray-600 text-center max-w-lg">
            Create beautiful icons with our intuitive drawing tools or generate unique designs with AI
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="draw" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-center">
            <TabsList className="bg-white shadow-sm">
              <TabsTrigger value="draw" className="flex items-center gap-2">
                <PaintBrush className="h-4 w-4" />
                Draw
              </TabsTrigger>
              <TabsTrigger value="generate" className="flex items-center gap-2">
                <Wand2 className="h-4 w-4" />
                Generate
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Drawing Tab Content */}
          <TabsContent value="draw" className="mt-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Canvas */}
              <div className="flex-1">
                <DrawingCanvas ref={canvasRef} brushSize={brushSize} brushColor={brushColor} brushShape={brushShape} />
              </div>

              {/* Tools Panel */}
              <div className="w-full lg:w-64 space-y-6">
                {/* Brush Settings */}
                <BrushSettings
                  brushSize={brushSize}
                  setBrushSize={setBrushSize}
                  brushShape={brushShape}
                  setBrushShape={setBrushShape}
                />

                {/* Color Selection */}
                <ColorPicker brushColor={brushColor} setBrushColor={setBrushColor} />

                {/* Actions */}
                <div className="bg-white rounded-lg p-5 shadow-sm">
                  <h3 className="font-semibold text-gray-800 mb-3">Actions</h3>
                  <div className="flex flex-col gap-3">
                    <Button onClick={saveIconPack} className="w-full bg-blue-600 hover:bg-blue-700">
                      <Download className="mr-2 h-4 w-4" />
                      Save Icon Pack
                    </Button>

                    <Button onClick={clearCanvas} variant="outline" className="w-full">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Clear Canvas
                    </Button>

                    <label className="w-full">
                      <div className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md px-4 py-2 cursor-pointer transition-colors">
                        <Upload className="h-4 w-4" />
                        Upload Image
                      </div>
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Generate Tab Content */}
          <TabsContent value="generate" className="mt-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* AI Generation Form */}
              <GenerateForm setGeneratedImageUrl={setGeneratedImageUrl} />

              {/* Generated Image Display */}
              <div className="w-full lg:w-96">
                <div className="bg-white rounded-lg p-5 shadow-sm h-full flex flex-col">
                  <h3 className="font-semibold text-gray-800 mb-3">Generated Icon</h3>
                  <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg">
                    {generatedImageUrl ? (
                      <div className="flex flex-col items-center">
                        <img
                          src={generatedImageUrl || "/placeholder.svg"}
                          alt="Generated icon"
                          className="max-w-full rounded-lg shadow-md hover:scale-[1.02] transition-transform"
                        />
                        <Button onClick={useGeneratedImage} className="mt-4" variant="outline">
                          <PaintBrush className="mr-2 h-4 w-4" />
                          Use for Drawing
                        </Button>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center p-6">
                        Your generated icon will appear here. <br />
                        Describe what you want and click "Generate Icon".
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 mt-12">
          <p>© 2023 Iconic - Create beautiful icons with ease</p>
        </div>
      </div>
    </div>
  )
}
