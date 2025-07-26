"use client";

import { useState, useRef, useEffect } from "react";
import { Download, Wand2, Type, X, Plus } from "lucide-react";
import JSZip from "jszip";
import GenerateForm from "@/components/generate-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import TopCarousel from "@/components/top-carousel";
import { cn } from "@/lib/utils";

export default function IconicApp() {
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(
    null,
  );
  const [prompt, setPrompt] = useState("");
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [text, setText] = useState("Your Text");
  const [textColor, setTextColor] = useState("#ffffff");
  const [fontSize, setFontSize] = useState(32);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [textPosition, setTextPosition] = useState({ x: 0.5, y: 0.8 });

  const bigPreviewCanvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const fontOptions = [
    "Arial",
    "Helvetica",
    "Times New Roman",
    "Courier New",
    "Georgia",
    "Verdana",
    "Impact",
  ];
  const colorOptions = [
    { name: "White", value: "#ffffff" },
    { name: "Black", value: "#000000" },
    { name: "Red", value: "#ff0000" },
    { name: "Blue", value: "#0000ff" },
    { name: "Green", value: "#008000" },
    { name: "Yellow", value: "#ffff00" },
    { name: "Pink", value: "#ffc0cb" },
  ];

  const handleSelectPrompt = (selectedPrompt: string) => {
    setPrompt(selectedPrompt);
    toast({
      title: "Prompt selected",
      description: "The prompt has been added to the generator",
    });
  };

  useEffect(() => {
    if (!generatedImageUrl) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = generatedImageUrl;
    img.onload = () =>
      drawPreviewCanvas(bigPreviewCanvasRef.current, img, 300, 300);
  }, [
    generatedImageUrl,
    text,
    textColor,
    fontSize,
    fontFamily,
    textPosition,
    showTextEditor,
  ]);

  const drawPreviewCanvas = (
    canvas: HTMLCanvasElement | null,
    img: HTMLImageElement,
    width: number,
    height: number,
  ) => {
    if (!canvas || !img.complete) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    try {
      canvas.width = width;
      canvas.height = height;
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      if (showTextEditor && text) {
        ctx.font = `${fontSize}px ${fontFamily}`;
        ctx.fillStyle = textColor;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, textPosition.x * width, textPosition.y * height);
      }
    } catch (error) {
      console.error("Error drawing canvas:", error);
    }
  };

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
      text: string;
      fontSize: number;
      fontFamily: string;
      textColor: string;
      showTextEditor: boolean;
      textPosition: { x: number; y: number };
    },
  ) => {
    const width = canvas.width;
    const height = canvas.height;
    const dataUrl = canvas.toDataURL("image/png");

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <image href="${dataUrl}" x="0" y="0" width="${width}" height="${height}" />
  ${
    showTextEditor
      ? `<text x="${textPosition.x * width}" y="${
          textPosition.y * height
        }" font-size="${fontSize}" font-family="${fontFamily}" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">${text}</text>`
      : ""
  }
</svg>`.trim();
  };

  const saveIconPack = async () => {
    const previewCanvas = bigPreviewCanvasRef.current;
    if (!previewCanvas || !generatedImageUrl) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = generatedImageUrl;
    img.onload = async () => {
      const zip = new JSZip();
      const sizes = [16, 32, 48, 64, 128, 256, 512];

      const originalCanvas = document.createElement("canvas");
      const oCtx = originalCanvas.getContext("2d");
      originalCanvas.width = img.naturalWidth;
      originalCanvas.height = img.naturalHeight;
      oCtx?.drawImage(img, 0, 0);
      originalCanvas.toBlob((blob) => {
        if (blob) zip.file("icon-original.png", blob);
      }, "image/png");

      const promises = sizes.map((size) => {
        return new Promise<void>((resolve) => {
          const tempCanvas = document.createElement("canvas");
          const tempCtx = tempCanvas.getContext("2d");
          if (!tempCtx) return resolve();
          tempCanvas.width = size;
          tempCanvas.height = size;
          tempCtx.imageSmoothingEnabled = false;
          tempCtx.clearRect(0, 0, size, size);
          tempCtx.drawImage(img, 0, 0, size, size);
          tempCanvas.toBlob((blob) => {
            if (blob) zip.file(`icon-${size}x${size}.png`, blob);
            resolve();
          }, "image/png");
        });
      });

      const icoCanvas = document.createElement("canvas");
      const icoCtx = icoCanvas.getContext("2d");
      icoCanvas.width = 32;
      icoCanvas.height = 32;
      icoCtx?.clearRect(0, 0, 32, 32);
      icoCtx?.drawImage(img, 0, 0, 32, 32);
      icoCanvas.toBlob((blob) => {
        if (blob) zip.file("favicon.ico", blob);

        const appleCanvas = document.createElement("canvas");
        const appleCtx = appleCanvas.getContext("2d");
        appleCanvas.width = 180;
        appleCanvas.height = 180;
        appleCtx?.clearRect(0, 0, 180, 180);
        appleCtx?.drawImage(img, 0, 0, 180, 180);
        appleCanvas.toBlob((appleBlob) => {
          if (appleBlob) zip.file("apple-touch-icon.png", appleBlob);

          const svg = createSVG(previewCanvas, {
            text,
            fontSize,
            fontFamily,
            textColor,
            showTextEditor,
            textPosition,
          });
          zip.file("icon.svg", svg);

          Promise.all(promises).then(() => {
            zip.file(
              "README.txt",
              `# iconic.JesseJesse.xyz

Add these tags in your <head>:

<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/icon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/icon-16x16.png">
<link rel="icon" type="image/svg+xml" href="/icon.svg">`,
            );

            zip.generateAsync({ type: "blob" }).then((content) => {
              saveFile(content, "iconic.JesseJesse.zip");
              toast({
                title: "Download complete",
                description: "Icon pack downloaded successfully!",
              });
            });
          });
        }, "image/png");
      }, "image/x-icon");
    };
  };

  const saveFile = (blob: Blob, filename: string) => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const toggleTextEditor = () => {
    if (generatedImageUrl) {
      setShowTextEditor(!showTextEditor);
    } else {
      toast({
        title: "No image generated",
        description: "Please generate an icon first before adding text",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-100 to-slate-200 min-h-screen px-4 py-12 flex flex-col items-center font-sans">
      <div className="max-w-6xl w-full space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-4 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 text-transparent bg-clip-text animate-gradient">
            iconic
          </h1>
          <p className="text-indigo-600 md:text-xl">
            Turn your ideas into beautiful, unique icons — instantly.
          </p>
          <TopCarousel onSelectPrompt={handleSelectPrompt} />
        </section>

        <main className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-7/12 space-y-6">
            <GenerateForm
              setGeneratedImageUrl={setGeneratedImageUrl}
              initialPrompt={prompt}
            />

            {generatedImageUrl && (
              <section className="bg-white rounded-lg shadow-lg p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800">
                    icon preview
                  </h2>
                  <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                   Pack includes 10+ HQ icons & SVG
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div className="flex flex-col items-center gap-2">
                      <div className="rounded-lg border bg-white p-3 flex items-center gap-2 shadow-inner w-full max-w-xs">
                        <img
                          src={generatedImageUrl}
                          width={16}
                          height={16}
                          alt="Favicon"
                          className="flex-shrink-0"
                        />
                        <span className="text-sm text-gray-600 truncate">
                          https://your.site
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">Web Browser</span>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                    <div className="w-40 h-40 bg-white shadow-lg rounded-2xl overflow-hidden flex items-center justify-center">
                        <img
                          src={generatedImageUrl}
                          width={180}
                          height={180}
                          className="object-contain p-4"
                          alt="App Icon"
                        />
                      </div>
                      <span className="text-xs text-gray-500">Mobile App</span>
                    </div>

                    <div className="flex justify-center gap-4">
                      {[32, 64, 128].map((size) => (
                        <div key={size} className="flex flex-col items-center">
                          <img
                            src={generatedImageUrl}
                            width={size}
                            height={size}
                            alt={`${size}px icon`}
                            className="border rounded-lg bg-white p-1"
                          />
                          <span className="text-xs text-gray-500 mt-1">
                            {size}px
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">
                        HTML Head Tag
                      </h3>
                      <pre className="text-xs font-mono bg-gray-100 p-3 rounded-lg overflow-x-auto">
                        {`<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/icon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/icon-16x16.png">
<link rel="icon" type="image/svg+xml" href="/icon.svg">`}
                      </pre>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="relative w-48 h-96 bg-black rounded-[2rem] p-2 shadow-xl">
                        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-1 bg-gray-700 rounded-full"></div>
                        <div className="h-full bg-white rounded-[1.5rem] overflow-hidden flex items-center justify-center">
                          <img
                            src={generatedImageUrl}
                            alt="Mobile App"
                            className="object-cover w-full h-full"
                          />
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 mt-2">
                        Scalable Vector Graphic (SVG)
                      </span>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>

          <div className="w-full lg:w-5/12 space-y-6">
            <section className="bg-white rounded-lg shadow-lg p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <img
                    src="./cloudflareworkers.svg"
                    alt="Cloudflare Workers"
                    className="w-5 h-5 mr-2"
                  />
                  iconic creator
                </h2>
                {generatedImageUrl && (
                  <Button
                    onClick={toggleTextEditor}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    disabled={!generatedImageUrl}
                  >
                    {showTextEditor ? (
                      <>
                        <X className="w-4 h-4" />
                        <span>Hide Text</span>
                      </>
                    ) : (
                      <>
                        <Type className="w-4 h-4" />
                        <span>Add Text</span>
                      </>
                    )}
                  </Button>
                )}
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 flex justify-center items-center min-h-[300px]">
                {generatedImageUrl ? (
                  <canvas
                    ref={bigPreviewCanvasRef}
                    width={300}
                    height={300}
                    className="shadow-md rounded-lg bg-white p-4"
                  />
                ) : (
                  <div className="text-center text-gray-400">
                    <p>Your icon preview will appear here</p>
                    <p className="text-xs mt-1">
                      stabilityai/stable-diffusion-xl-base-1.0
                    </p>
                  </div>
                )}
              </div>

              {showTextEditor && generatedImageUrl && (
                <div className="space-y-4 border-t pt-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Text
                      </label>
                      <Input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        maxLength={20}
                        placeholder="Add text to your icon"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Font Size: {fontSize}px
                      </label>
                      <Input
                        type="range"
                        min="12"
                        max="72"
                        value={fontSize}
                        onChange={(e) => setFontSize(+e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Font Family
                      </label>
                      <select
                        className="w-full border rounded-md p-2 text-sm"
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Text Color
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {colorOptions.map((color) => (
                          <button
                            key={color.value}
                            onClick={() => setTextColor(color.value)}
                            style={{ backgroundColor: color.value }}
                            className={`w-8 h-8 rounded-full border-2 ${
                              textColor === color.value
                                ? "border-blue-500"
                                : "border-transparent"
                            }`}
                            title={color.name}
                          />
                        ))}
                        <div className="relative">
                          <input
                            type="color"
                            value={textColor}
                            onChange={(e) => setTextColor(e.target.value)}
                            className="w-8 h-8 cursor-pointer opacity-0 absolute"
                          />
                          <div
                            className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center"
                            style={{ backgroundColor: textColor }}
                          >
                            <Plus className="w-3 h-3 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Text Position
                      </label>
                      <div className="flex gap-2">
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
                            onClick={() =>
                              setTextPosition({ x: 0.5, y: pos.y })
                            }
                            className="flex-1"
                          >
                            {pos.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {generatedImageUrl && (
                <Button
                  onClick={saveIconPack}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-2"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Icon Pack
                </Button>
              )}
            </section>
          </div>
        </main>

        <footer className="text-center pt-8 text-sm text-gray-500">
          <a
            href="https://iconic.jessejesse.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-600 transition-colors"
          >
            iconic.JesseJesse.xyz
          </a>
        </footer>
      </div>
    </div>
  );
}

