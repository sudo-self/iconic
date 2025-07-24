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

  const bigPreviewCanvasRef = useRef<HTMLCanvasElement>(null) 

  const { toast } = useToast()

  const fontOptions = ["Arial", "Helvetica", "Times New Roman", "Courier New", "Georgia", "Verdana", "Impact"]

  const colorOptions = [
    { name: "White", value: "#ffffff" },
    { name: "Black", value: "#000000" },
    { name: "Red", value: "#ff0000" },
    { name: "Blue", value: "#0000ff" },
    { name: "Green", value: "#008000" },
    { name: "Yellow", value: "#ffff00" },
    { name: "Pink", value: "#ffc0cb" },
  ]

  const handleSelectPrompt = (selectedPrompt: string) => {
    setPrompt(selectedPrompt)
    setActiveTab("generate")

    toast({
      title: "Prompt selected",
      description: "The prompt has been added to the generator",
    })
  }

  useEffect(() => {
    if (!generatedImageUrl) return

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = generatedImageUrl
    img.onload = () => {
      drawOnCanvas(bigPreviewCanvasRef.current, img, 300, 300)
    }
  }, [generatedImageUrl, text, textColor, fontSize, fontFamily, textPosition, showTextEditor])


  const drawOnCanvas = (
    canvas: HTMLCanvasElement | null,
    img: HTMLImageElement,
    width: number,
    height: number
  ) => {
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = width
    canvas.height = height

    ctx.clearRect(0, 0, width, height)
    ctx.drawImage(img, 0, 0, width, height)

    if (showTextEditor) {
      ctx.font = `${fontSize}px ${fontFamily}`
      ctx.fillStyle = textColor
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      const x = textPosition.x * width
      const y = textPosition.y * height
      ctx.fillText(text, x, y)
    }
  }

  const saveIconPack = async () => {
    const canvas = bigPreviewCanvasRef.current
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
              
1. Add the icons to your project
                          
favicon.ico  <-- place this file in the project root

apple-touch-icon.png  

icon-16x16.png thru icon-512x512.png

2. Map them by adding the html tags inside the <head> section


<head>

< -- icon tags -->

<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/icon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/icon-16x16.png">

</head>

Thank you for visiting iconic.JesseJesse.xyz!
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

        {/* Header */}
        <div className="flex flex-col items-center">
          <h1 className="font-bold text-4xl bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-2">
            iconic
          </h1>
          <p className="text-gray-600 text-center max-w-lg mb-4">
            turn your ideas into beautiful unique icons
          </p>
          <TopCarousel onSelectPrompt={handleSelectPrompt} />
        </div>

     
        <div className="flex flex-col lg:flex-row gap-8 justify-center">

        
          <div className="w-full max-w-lg flex flex-col space-y-6">

      
            <GenerateForm setGeneratedImageUrl={setGeneratedImageUrl} initialPrompt={prompt} />

      
            {generatedImageUrl && (
              <div className="flex gap-6 mt-6 items-start">

{/* Web Tab Preview */}
<div className="flex flex-col items-center text-gray-700">
  <div className="mb-2 font-mono text-xs select-all bg-gray-100 rounded px-2 py-1 border border-gray-300">
    &lt;html&gt;icon tags&lt;/html&gt;
  </div>
  <div
    className="w-60 h-14 border border-gray-300 rounded-t-[10px] flex items-center px-3 bg-white shadow-sm"
    style={{
      imageRendering: "pixelated",
      borderBottom: "none",
      borderTopLeftRadius: "8px",
      borderTopRightRadius: "8px",
    }}
  >
    <img
      src={generatedImageUrl}
      alt="16x16 Icon Preview"
      width={16}
      height={16}
      className="mr-2"
    />
    <div className="text-xs text-gray-600 truncate">iconic.jessejesse.xyz</div>
  </div>
  <div className="w-60 h-2 bg-gray-100 border border-gray-300 border-t-0 rounded-b-md"></div>
  <div className="mt-1 text-xs text-gray-500">Web Browser Preview</div>
</div>
                
  {/* Mobile App Preview */}
  <div className="mt-6 flex flex-col items-center">
    <div
      className="w-24 h-24 rounded-2xl shadow-lg border border-gray-300 bg-white overflow-hidden flex items-center justify-center"
      style={{ imageRendering: "pixelated" }}
    >
      <img
        src={generatedImageUrl}
        alt="180x180 Mobile Icon Preview"
        width={180}
        height={180}
        className="object-contain"
      />
    </div>
    <div className="mt-1 text-xs text-gray-500">Mobile App Preview</div>
  </div>

                <div
                  className="w-[200px] h-[400px] rounded-3xl bg-black shadow-lg relative flex items-center justify-center"
                  aria-label="Mobile App Preview"
                >
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-800 rounded-full" />
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-14 h-14 bg-gray-800 rounded-full" />

            
                  <img
                    src={generatedImageUrl}
                    alt="Mobile App Icon Preview"
                    className="object-cover w-full h-full rounded-3xl"
                    width={200}
                    height={400}
                    loading="lazy"
                  />
                </div>

              </div>
            )}

          </div>

       
          <div className="w-full max-w-md bg-white rounded-lg p-5 shadow-sm flex flex-col">

            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-800 flex items-center">
                <img src="./cloudflareworkers.svg" alt="Cloudflare Workers" className="w-5 h-5 mr-2" />
                Generated Icon
              </h3>

              {generatedImageUrl && (
                <Button
                  onClick={toggleTextEditor}
                  variant="outline"
                  size="sm"
                  className={showTextEditor ? "bg-blue-100" : ""}
                >
                  {showTextEditor ? <X className="h-4 w-4 mr-1" /> : <Type className="h-4 w-4 mr-1" />}
                  {showTextEditor ? "Hide Text" : "Add Text"}
                </Button>
              )}
            </div>

            <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg mb-4 relative min-h-[320px]">
              {generatedImageUrl ? (
                <canvas
                  ref={bigPreviewCanvasRef}
                  width={300}
                  height={300}
                  className="rounded-lg shadow-md"
                />
              ) : (
               <p className="text-gray-500 text-center p-6">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="mx-auto mb-2"
    height="64"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <path d="M3 9h18" />
    <path d="M9 21V9" />
  </svg>
  icon will arrive here
  <br />
  powered by JesseJesse.com
</p>

              )}
            </div>

            {showTextEditor && generatedImageUrl && (
              <div className="mb-4 space-y-3 border-t border-gray-200 pt-3">
                <div>
                  <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 mb-1">
                    Text
                  </label>
                  <Input
                    id="text-input"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
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
                      max="72"
                      value={fontSize}
                      onChange={(e) => setFontSize(Number.parseInt(e.target.value))}
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
                    onChange={(e) => setFontFamily(e.target.value)}
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
                        onClick={() => setTextColor(color.value)}
                        className={cn(
                          "h-8 rounded-md border-2",
                          textColor === color.value ? "border-blue-500" : "border-gray-200"
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
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-8 h-8 cursor-pointer"
                        title="Custom color"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Text Position</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setTextPosition({ x: 0.5, y: 0.2 })}
                      className={cn(
                        "p-1 border rounded-md",
                        textPosition.y === 0.2 ? "bg-blue-100 border-blue-500" : "border-gray-200"
                      )}
                    >
                      Top
                    </button>
                    <button
                      onClick={() => setTextPosition({ x: 0.5, y: 0.5 })}
                      className={cn(
                        "p-1 border rounded-md",
                        textPosition.y === 0.5 ? "bg-blue-100 border-blue-500" : "border-gray-200"
                      )}
                    >
                      Middle
                    </button>
                    <button
                      onClick={() => setTextPosition({ x: 0.5, y: 0.8 })}
                      className={cn(
                        "p-1 border rounded-md",
                        textPosition.y === 0.8 ? "bg-blue-100 border-blue-500" : "border-gray-200"
                      )}
                    >
                      Bottom
                    </button>
                  </div>
                </div>
              </div>
            )}

            {generatedImageUrl && (
              <>
                <Button onClick={saveIconPack} className="w-full bg-blue-600 hover:bg-blue-700 mb-4">
                  <Download className="mr-2 h-4 w-4" />
                  Download Icon Pack
                </Button>

                <div className="bg-black text-pink-400 font-mono text-sm p-4 rounded-lg shadow-inner relative">
                  <pre className="whitespace-pre-wrap select-all">
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






 
