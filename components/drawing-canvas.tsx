"use client"

import { forwardRef, useEffect, useRef, useImperativeHandle } from "react"

// Define the interface for the ref that will be exposed
export interface DrawingCanvasRef {
  getCanvas: () => HTMLCanvasElement | null
  clearCanvas: () => void
}

interface DrawingCanvasProps {
  brushSize: number
  brushColor: string
  brushShape: "round" | "square" | "eraser"
}

const DrawingCanvas = forwardRef<DrawingCanvasRef, DrawingCanvasProps>(({ brushSize, brushColor, brushShape }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const isDrawingRef = useRef(false)

  // Expose methods through the ref
  useImperativeHandle(ref, () => ({
    getCanvas: () => canvasRef.current,
    clearCanvas: () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = "white"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    },
  }))

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Resize the canvas
    const resizeCanvas = () => {
      if (!canvas) return

      const ratio = window.devicePixelRatio || 1
      const width = canvas.offsetWidth
      const height = canvas.offsetHeight

      // Set the canvas dimensions to match the display size
      canvas.width = width * ratio
      canvas.height = height * ratio

      // Scale the context to account for the device pixel ratio
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(ratio, ratio)

      // Fill with white background
      ctx.fillStyle = "white"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    // Initial resize
    resizeCanvas()

    // Handle window resize
    window.addEventListener("resize", resizeCanvas)

    // Drawing functions
    const startDrawing = (e: MouseEvent | TouchEvent) => {
      isDrawingRef.current = true
      draw(e)
    }

    const endDrawing = () => {
      isDrawingRef.current = false
      ctx.beginPath()
    }

    const draw = (e: MouseEvent | TouchEvent) => {
      if (!isDrawingRef.current || !canvas) return

      // Get correct position
      let clientX: number, clientY: number

      if ("touches" in e) {
        // Touch event
        clientX = e.touches[0].clientX
        clientY = e.touches[0].clientY
      } else {
        // Mouse event
        clientX = e.clientX
        clientY = e.clientY
      }

      const rect = canvas.getBoundingClientRect()
      const x = clientX - rect.left
      const y = clientY - rect.top

      ctx.lineWidth = brushSize
      ctx.lineCap = brushShape === "round" ? "round" : "square"
      ctx.lineJoin = "round"
      ctx.strokeStyle = brushShape === "eraser" ? "#ffffff" : brushColor

      ctx.lineTo(x, y)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(x, y)
    }

    // Add event listeners
    canvas.addEventListener("mousedown", startDrawing)
    canvas.addEventListener("mouseup", endDrawing)
    canvas.addEventListener("mousemove", draw)
    canvas.addEventListener("mouseleave", endDrawing)

    // Touch support
    canvas.addEventListener("touchstart", (e) => {
      e.preventDefault()
      startDrawing(e)
    })

    canvas.addEventListener("touchend", (e) => {
      e.preventDefault()
      endDrawing()
    })

    canvas.addEventListener("touchmove", (e) => {
      e.preventDefault()
      draw(e)
    })

    // Cleanup
    return () => {
      if (!canvas) return

      canvas.removeEventListener("mousedown", startDrawing)
      canvas.removeEventListener("mouseup", endDrawing)
      canvas.removeEventListener("mousemove", draw)
      canvas.removeEventListener("mouseleave", endDrawing)

      canvas.removeEventListener("touchstart", startDrawing as any)
      canvas.removeEventListener("touchend", endDrawing as any)
      canvas.removeEventListener("touchmove", draw as any)

      window.removeEventListener("resize", resizeCanvas)
    }
  }, [brushSize, brushColor, brushShape])

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      className="w-full h-[600px] bg-white rounded-xl shadow-md cursor-crosshair"
    />
  )
})

DrawingCanvas.displayName = "DrawingCanvas"

export default DrawingCanvas
