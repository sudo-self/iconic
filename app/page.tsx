"use client"

import { useState, useRef, useEffect } from "react"
import { Download, Wand2, Type, X } from "lucide-react"
import JSZip from "jszip"
import GenerateForm from "@/components/generate-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import TopCarousel from "@/components/top-carousel"
import { cn } from "@/lib/utils"

export default function IconicApp() {
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null)
  const [prompt, setPrompt] = useState("")
  const [activeTab, setActiveTab] = useState("generate")
  const [showTextEditor, setShowTextEditor] = useState(false)
  const [text, setText] = useState("Your Text")
  const [textColor, setTextColor] = useState("#ffffff")
  const [fontSize, setFontSize] = useState(32)
  const [fontFamily, setFontFamily] = useState("Arial")
  const [textPosition, setTextPosition] = useState({ x: 0.5, y: 0.8 })
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const { toast } = useToast()

  const fontOptions = [
    "Arial",
    "Helvetica",
    "Times New Roman",
    "Courier New",
    "Georgia",
    "Verdana",
    "Impact",
  ]

  const colorOptions = [
    { name: "White", value: "#ffffff" },
    { name: "Black", value: "#000000" },
    { name: "Red", value: "#ff0000" },
    { name: "Blue", value: "#0000ff" },
    { name: "Green", value: "#008000" },
    { name: "Yellow", value: "#ffff00" },
    { name: "Pink", value: "#ffc0cb" },
  ]

  useEffect(() => {
    updatePreviewCanvas()
  }, [text, textColor, fontSize, fontFamily, textPosition, generatedImageUrl, showTextEditor])

  const updatePreviewCanvas = () => {
    const canvas = previewCanvasRef.current
    if (!canvas || !generatedImageUrl) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      if (showTextEditor) {
        ctx.font = `${fontSize}px ${fontFamily}`
        ctx.fillStyle = textColor
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"

        const x = textPosition.x * canvas.width
        const y = textPosition.y * canvas.height

        ctx.fillText(text, x, y)
      }
    }
    img.src = generatedImageUrl
  }

  const saveIconPack = async () => {
    const canvas = previewCanvasRef.current
    if (!canvas) return

    const zip = new JSZip()
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

        tempCtx.drawImage(canvas, 0, 0, size, size)

        tempCanvas.toBlob((blob) => {
          if (blob) {
            zip.file(`icon-${size}x${size}.png`, blob)
          }
          resolve()
        }, "image/png")
      })
    })

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

            Promise.all(promises).then(() => {
              const readmeContent = `# iconic.JesseJesse.xyz

- favicon.ico
- apple-touch-icon.png
- icon-16x16.png thru icon-512x512.png

## How to use them in project

1. Place the icon files in the project root directory
2. Add the links to the HTML <head> section

<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/icon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/icon-16x16.png">

iconic.JesseJesse.xyz
`

              zip.file("README.txt", readmeContent)

              zip.generateAsync({ type: "blob" }).then((content) => {
                saveFile(content, "iconic.JesseJesse.zip")
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

  const saveFile = (blob: Blob, filename: string) => {
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const toggleTextEditor = () => {
    setShowTextEditor(!showTextEditor)
  }

  return (
    <div className="bg-gradient-to-b from-gray-100 to-gray-300 min-h-screen flex flex-col items-center py-8 px-4 md:px-8">
      <div className="w-full max-w-6xl space-y-8">
        <div className="flex flex-col items-center">
          <h1 className="font-bold text-4xl bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-2">
            iconic
          </h1>
          <p className="text-gray-600 text-center max-w-lg mb-4">
            turn your ideas into beautiful unique icons
          </p>
          <TopCarousel onSelectPrompt={handleSelectPrompt} />
        </div>

        <Tabs defaultValue="generate" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-center">
            <TabsList className="bg-gray-400 shadow-sm">
              <TabsTrigger value="generate" className="flex items-center gap-2">
                <Wand2 className="h-4 w-4" />
                stable-diffusion-xl-base
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="generate" className="mt-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left panel */}
              <div className="flex flex-col flex-1 max-w-xl">
                <GenerateForm setGeneratedImageUrl={setGeneratedImageUrl} initialPrompt={prompt} />

                {/* Below the generate button: Web Browser Tab Preview and Mobile App Preview */}
                {generatedImageUrl && (
                  <div className="mt-6 space-y-6">

                    {/* Web Browser Tab Preview */}
                    <div className="w-full max-w-md mx-auto border rounded-lg shadow-md bg-white">
                      {/* Tab header */}
                      <div className="flex items-center space-x-2 px-3 py-1 border-b bg-gray-100 rounded-t-lg">
                        {/* Circles to mimic macOS window buttons */}
                        <div className="flex space-x-1">
                          <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                          <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
                          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                        </div>
                        {/* Tab title with icon */}
                        <div className="flex items-center space-x-1 ml-4">
                          <img
                            src={generatedImageUrl}
                            alt="Icon in tab"
                            className="w-5 h-5 rounded-sm"
                          />
                          <span className="text-sm font-medium text-gray-700 truncate max-w-xs">
                            iconic.jessejesse.xyz
                          </span>
                        </div>
                      </div>
                      {/* Tab content area */}
                      <div className="p-6 flex justify-center items-center bg-white" style={{ height: 120 }}>
                        <img
                          src={generatedImageUrl}
                          alt="Icon preview in browser content"
                          className="w-20 h-20 rounded-lg shadow-md"
                        />
                      </div>
                    </div>

                    {/* Mobile App Icon Preview */}
                    <div className="w-full max-w-xs mx-auto bg-white border rounded-xl shadow-lg p-6 flex flex-col items-center">
                      {/* Phone top bar */}
                      <div className="w-40 h-6 bg-gray-300 rounded-t-xl mb-3"></div>
                      {/* Screen with icon */}
                      <div className="w-40 h-80 bg-gray-100 rounded-xl flex flex-col items-center justify-center shadow-inner relative">
                        <img
                          src={generatedImageUrl}
                          alt="Mobile app icon preview"
                          className="w-24 h-24 rounded-lg shadow-lg"
                        />
                        <div className="mt-4 text-gray-700 font-semibold text-center">iconic</div>
                      </div>
                      {/* Phone bottom bar */}
                      <div className="w-28 h-4 bg-gray-300 rounded-b-xl mt-4"></div>
                    </div>

                  </div>
                )}
              </div>

              {/* Right panel: leave as is */}
              <div className="w-full lg:w-96">
                <div className="bg-white rounded-lg p-5 shadow-sm flex flex-col">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-gray-800 flex items-center">
                      <img
                        src="./cloudflareworkers.svg"
                        alt="Cloudflare Workers"
                        className="w-5 h-5 mr-2"
                      />
                      Generated Icon
                    </h3>

                    {generatedImageUrl && (
                      <Button
                        onClick={toggleTextEditor}
                        variant="outline"
                        size="sm"
                        className={showTextEditor ? "bg-blue-100" : ""}
                      >
                        {showTextEditor ? (
                          <X className="h-4 w-4 mr-1" />
                        ) : (
                          <Type className="h-4 w-4 mr-1" />
                        )}
                        {showTextEditor ? "Hide Text" : "Add Text"}
                      </Button>
                    )}
                  </div>

                  <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg mb-4 relative">
                    {generatedImageUrl ? (
                      <canvas
                        ref={previewCanvasRef}
                        width={300}
                        height={300}
                        className="rounded-lg shadow-md"
                      />
                    ) : (
                      <p className="text-gray-500 text-center p-6">
                        Generated icon will arrive here.
                        <br />
                        powered by Cloudflared Workers
                      </p>
                    )}
                  </div>

                  {showTextEditor && generatedImageUrl && (
                    <div className="mb-4 space-y-3 border-t border-gray-200 pt-3">
                      {/* Text editor controls... */}
                      {/* (existing code for text editing UI omitted for brevity) */}
                    </div>
                  )}

                  {generatedImageUrl && (
                    <>
                      <Button
                        onClick={saveIconPack}
                        className="w-full bg-blue-600 hover:bg-blue-700 mb-4"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download Icon Pack
                      </Button>

                      <div className="bg-black text-pink-400 font-mono text-sm p-4 rounded-lg shadow-inner relative">
                        <pre className="whitespace-pre-wrap">
                          {`<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/icon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/icon-16x16.png">`}
                        </pre>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(`<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/icon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/icon-16x16.png">`)
                            toast({
                              title: "icons to clipboard",
                              description: "icon html tags copied!",
                            })
                          }}
                          className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded hover:bg-gray-700"
                        >
                          Copy
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="text-center text-sm text-gray-500 mt-12">
          <a
            href="https://iconic.jessejesse.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-500 hover:text-pink-500 transition-colors"
          >
            iconic.JesseJesse.xyz
          </a>
        </div>
      </div>
    </div>
  )
}


 
