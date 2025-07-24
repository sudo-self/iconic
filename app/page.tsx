"use client"

import { useState, useRef, useEffect } from "react"
import { Download, Wand2, Type, X } from "lucide-react"
import JSZip from "jszip"
import GenerateForm from "@/components/generate-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import TopCarousel from "@/components/top-carousel"
import { cn } from "@/lib/utils"

export default function IconicApp() {
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null)
  const [prompt, setPrompt] = useState("")
  const [showTextEditor, setShowTextEditor] = useState(false)
  const [text, setText] = useState("Your Text")
  const [textColor, setTextColor] = useState("#ffffff")
  const [fontSize, setFontSize] = useState(32)
  const [fontFamily, setFontFamily] = useState("Arial")
  const [textPosition, setTextPosition] = useState({ x: 0.5, y: 0.8 })

  const bigPreviewCanvasRef = useRef<HTMLCanvasElement>(null)
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

  const handleSelectPrompt = (selectedPrompt: string) => {
    setPrompt(selectedPrompt)
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
    img.onload = () => drawPreviewCanvas(bigPreviewCanvasRef.current, img, 300, 300)
  }, [
    generatedImageUrl,
    text,
    textColor,
    fontSize,
    fontFamily,
    textPosition,
    showTextEditor,
  ])

  const drawPreviewCanvas = (
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
      ctx.fillText(text, textPosition.x * width, textPosition.y * height)
    }
  }

  const drawCleanCanvas = (canvas: HTMLCanvasElement, img: HTMLImageElement) => {
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  }

  const createSVG = (
    canvas: HTMLCanvasElement,
    {
      text,
      fontSize,
      fontFamily,
      textColor,
      showTextEditor,
      textPosition,
    }: {
      text: string
      fontSize: number
      fontFamily: string
      textColor: string
      showTextEditor: boolean
      textPosition: { x: number; y: number }
    }
  ) => {
    const width = canvas.width
    const height = canvas.height
    const dataUrl = canvas.toDataURL("image/png")

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <image href="${dataUrl}" x="0" y="0" width="${width}" height="${height}" />
  ${
    showTextEditor
      ? `<text x="${textPosition.x * width}" y="${
          textPosition.y * height
        }" font-size="${fontSize}" font-family="${fontFamily}" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">${text}</text>`
      : ""
  }
</svg>`.trim()
  }

  const saveIconPack = async () => {
    const previewCanvas = bigPreviewCanvasRef.current
    if (!previewCanvas || !generatedImageUrl) return

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = generatedImageUrl
    img.onload = async () => {
      const zip = new JSZip()
      const sizes = [16, 32, 48, 64, 128, 256, 512]

      const originalCanvas = document.createElement("canvas")
      const oCtx = originalCanvas.getContext("2d")
      originalCanvas.width = img.naturalWidth
      originalCanvas.height = img.naturalHeight
      oCtx?.drawImage(img, 0, 0)
      originalCanvas.toBlob((blob) => {
        if (blob) zip.file("icon-original.png", blob)
      }, "image/png")

      const promises = sizes.map((size) => {
        return new Promise<void>((resolve) => {
          const tempCanvas = document.createElement("canvas")
          const tempCtx = tempCanvas.getContext("2d")
          if (!tempCtx) return resolve()
          tempCanvas.width = size
          tempCanvas.height = size
          tempCtx.imageSmoothingEnabled = false
          tempCtx.clearRect(0, 0, size, size)
          tempCtx.drawImage(img, 0, 0, size, size)
          tempCanvas.toBlob((blob) => {
            if (blob) zip.file(`icon-${size}x${size}.png`, blob)
            resolve()
          }, "image/png")
        })
      })

      const icoCanvas = document.createElement("canvas")
      const icoCtx = icoCanvas.getContext("2d")
      icoCanvas.width = 32
      icoCanvas.height = 32
      icoCtx?.clearRect(0, 0, 32, 32)
      icoCtx?.drawImage(img, 0, 0, 32, 32)
      icoCanvas.toBlob((blob) => {
        if (blob) zip.file("favicon.ico", blob)

        const appleCanvas = document.createElement("canvas")
        const appleCtx = appleCanvas.getContext("2d")
        appleCanvas.width = 180
        appleCanvas.height = 180
        appleCtx?.clearRect(0, 0, 180, 180)
        appleCtx?.drawImage(img, 0, 0, 180, 180)
        appleCanvas.toBlob((appleBlob) => {
          if (appleBlob) zip.file("apple-touch-icon.png", appleBlob)

          const svg = createSVG(previewCanvas, {
            text,
            fontSize,
            fontFamily,
            textColor,
            showTextEditor,
            textPosition,
          })
          zip.file("icon.svg", svg)

          Promise.all(promises).then(() => {
            zip.file(
              "README.txt",
              `# iconic.JesseJesse.xyz

Add these tags in your <head>:

<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/icon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/icon-16x16.png">
<link rel="icon" type="image/svg+xml" href="/icon.svg">`
            )

            zip.generateAsync({ type: "blob" }).then((content) => {
              saveFile(content, "iconic.JesseJesse.zip")
              toast({
                title: "Download complete",
                description: "Icon pack downloaded successfully!",
              })
            })
          })
        }, "image/png")
      }, "image/x-icon")
    }
  }

  const saveFile = (blob: Blob, filename: string) => {
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)
  }

  const toggleTextEditor = () => setShowTextEditor(!showTextEditor)

return (
  <div className="bg-gradient-to-br from-slate-100 to-slate-200 min-h-screen px-4 py-12 flex flex-col items-center font-sans">
    <div className="max-w-6xl w-full space-y-14">
      {/* Hero */}
      <div className="text-center space-y-3 animate-fade-in">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 text-transparent bg-clip-text animate-gradient">
          iconic
        </h1>
        <p className="text-indigo-600 md:text-xl">
          Turn your ideas into beautiful, unique icons — instantly.
        </p>
        <TopCarousel onSelectPrompt={handleSelectPrompt} />
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="w-full lg:w-1/2 space-y-6">
          <GenerateForm
            setGeneratedImageUrl={setGeneratedImageUrl}
            initialPrompt={prompt}
          />
          {generatedImageUrl && (
            <div className="grid sm:grid-cols-2 gap-6 mt-6 items-start">
              <div className="space-y-3">
                <div className="text-xs font-mono bg-gray-200 p-1 rounded w-fit">
                  Download 10+ HQ icons and SVG
                </div>
{/* Wrap previews side-by-side */}
<div className="flex items-start gap-8 mt-4">
  {/* Left block: Browser tab + App icon + sizes */}
  <div className="flex flex-col items-center gap-6">
    {/* Browser tab preview */}
    <div className="flex flex-col items-center gap-1">
      <div className="rounded-lg border bg-white p-4 flex items-center gap-2 shadow-inner">
        <img
          src={generatedImageUrl}
          width={16}
          height={16}
          alt="Favicon"
        />
        <span className="text-sm text-gray-600">https://your.site</span>
      </div>
      <div className="text-center text-xs text-gray-500">browser tab</div>
    </div>

    {/* App icon preview + sizes */}
    <div className="flex flex-col items-center space-y-2">
      <div className="w-24 h-24 bg-white border shadow-lg rounded-2xl overflow-hidden flex items-center justify-center">
        <img
          src={generatedImageUrl}
          width={180}
          height={180}
          className="object-contain"
          alt="App Icon"
        />
      </div>
      <div className="text-xs text-gray-500">mobile app</div>

      <div className="flex justify-center gap-4 mt-2">
        <div className="flex flex-col items-center space-y-1">
          <img
            src={generatedImageUrl}
            width={48}
            height={48}
            alt="48px Icon"
            className="object-contain border rounded"
          />
          <div className="text-[10px] text-gray-400">48px</div>
        </div>
        <div className="flex flex-col items-center space-y-1">
          <img
            src={generatedImageUrl}
            width={64}
            height={64}
            alt="64px Icon"
            className="object-contain border rounded"
          />
          <div className="text-[10px] text-gray-400">64px</div>
        </div>
      </div>
    </div>
  </div>

  {/* Right block: Phone preview */}
  <div className="w-[200px] h-[400px] bg-black rounded-[2.5rem] shadow-xl relative overflow-hidden flex-shrink-0">
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-12 h-1.5 bg-gray-800 rounded-full" />
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-14 h-14 bg-gray-800 rounded-full border-2 border-white" />
    <img
      src={generatedImageUrl}
      alt="Mobile App"
      className="w-full h-full object-cover"
    />
  </div>
</div>

<div className="text-center text-[10px] text-gray-400 mt-1">
  Scalable Vector Graphic
</div>

            </div>
          )}
        </div>


          <div className="w-full lg:w-1/2 bg-white rounded-lg shadow p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                <img
                  src="./cloudflareworkers.svg"
                  alt="Text Fields"
                  className="w-5 h-5 mr-2"
                />
                Generated iconic
              </h3>
              {generatedImageUrl && (
                <Button onClick={toggleTextEditor} variant="outline" size="sm">
                  {showTextEditor ? (
                    <>
                      <X className="w-4 h-4 mr-1" />
                      Hide Text
                    </>
                  ) : (
                    <>
                      <Type className="w-4 h-4 mr-1" />
                      Add Text
                    </>
                  )}
                </Button>
              )}
            </div>

            <div className="bg-white/20 dark:bg-black/30 backdrop-blur-md rounded-xl shadow-xl p-6 border border-white/10 flex justify-center items-center min-h-[300px]">
              {generatedImageUrl ? (
                <canvas
                  ref={bigPreviewCanvasRef}
                  width={300}
                  height={300}
                  className="shadow-md rounded-lg"
                />
              ) : (
                <div className="text-gray-400 text-center">
                  <p>icon preview will arrive here</p>
                  <p className="text-xs mt-1">stabilityai/stable-diffusion-xl-base-1.0</p>
                </div>
              )}
            </div>

            {showTextEditor && generatedImageUrl && (
              <div className="space-y-3 border-t pt-4">
                <div>
                  <label className="text-sm font-medium">Text</label>
                  <Input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    maxLength={20}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Font Size</label>
                  <div className="flex gap-3 items-center">
                    <Input
                      type="range"
                      min="12"
                      max="72"
                      value={fontSize}
                      onChange={(e) => setFontSize(+e.target.value)}
                    />
                    <span className="text-sm text-gray-600">{fontSize}px</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Font</label>
                  <select
                    className="w-full border rounded p-2"
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                  >
                    {fontOptions.map((font) => (
                      <option
                        key={font}
                        value={font}
                        style={{ fontFamily: font }}
                      >
                        {font}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Text Color</label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setTextColor(color.value)}
                        style={{ backgroundColor: color.value }}
                        className={cn(
                          "w-8 h-8 rounded border",
                          textColor === color.value
                            ? "border-blue-600"
                            : "border-gray-300"
                        )}
                      />
                    ))}
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-8 h-8 cursor-pointer"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Text Position</label>
                  <div className="flex gap-3 mt-2">
                    {[
                      { label: "Top", y: 0.2 },
                      { label: "Middle", y: 0.5 },
                      { label: "Bottom", y: 0.8 },
                    ].map((pos) => (
                      <Button
                        key={pos.label}
                        size="sm"
                        variant={
                          textPosition.y === pos.y ? "default" : "outline"
                        }
                        onClick={() => setTextPosition({ x: 0.5, y: pos.y })}
                      >
                        {pos.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {generatedImageUrl && (
              <>
                <Button
                  onClick={saveIconPack}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download icon pack
                </Button>

                <div className="bg-black text-pink-400 font-mono text-xs p-4 rounded-lg shadow-inner relative mt-4">
                  <pre className="whitespace-pre-wrap select-all">{`<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/icon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/icon-16x16.png">
<link rel="icon" type="image/svg+xml" href="/icon.svg">`}</pre>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/icon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/icon-16x16.png">
<link rel="icon" type="image/svg+xml" href="/icon.svg">`)
                      toast({
                        title: "Copied!",
                        description: "HTML tags copied to clipboard",
                      })
                    }}
                    className="absolute top-2 right-2 bg-gray-800 hover:bg-gray-700 text-white px-2 py-1 rounded text-xs"
                  >
                    Copy
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <footer className="text-center pt-12 text-sm text-gray-500">
          <a
            href="https://iconic.jessejesse.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-500"
          >
            iconic.JesseJesse.xyz
          </a>
        </footer>
      </div>
    </div>
  )
}
