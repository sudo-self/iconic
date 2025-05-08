return (
  <div className="bg-gray-100 min-h-screen flex flex-col items-center py-8 px-4 md:px-8">
    <div className="w-full max-w-6xl space-y-8">
      {/* Header */}
      <div className="flex flex-col items-center">
        <h1 className="font-bold text-4xl bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-2">
          iconic
        </h1>
        <p className="text-gray-600 text-center max-w-lg mb-4">
          turn your ideas into beautiful icons
        </p>
        <TopCarousel onSelectPrompt={handleSelectPrompt} />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="generate" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-center">
          <TabsList className="bg-gray-400 shadow-sm">
            <TabsTrigger value="generate" className="flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              stable-diffusion-xl-base
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Generate Tab Content */}
        <TabsContent value="generate" className="mt-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* AI Generation Form */}
            <GenerateForm setGeneratedImageUrl={setGeneratedImageUrl} initialPrompt={prompt} />

            {/* Preview Canvas with Prompt */}
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 rounded-lg mb-4 relative p-4">
              {generatedImageUrl ? (
                <>
                  <canvas
                    ref={previewCanvasRef}
                    width={300}
                    height={300}
                    className="rounded-lg shadow-md mb-2"
                  />
                  {prompt && (
                    <p className="text-xs text-gray-400 text-center italic max-w-xs break-words">
                      “{prompt}”
                    </p>
                  )}
                </>
              ) : (
                <p className="text-gray-500 text-center p-6">
                  icon will arrive here. <br />
                  add optional custom font
                </p>
              )}
            </div>

            {/* Text Editor Controls */}
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
                        textPosition.y === 0.2 ? "bg-blue-100 border-blue-500" : "border-gray-200",
                      )}
                    >
                      Top
                    </button>
                    <button
                      onClick={() => setTextPosition({ x: 0.5, y: 0.5 })}
                      className={cn(
                        "p-1 border rounded-md",
                        textPosition.y === 0.5 ? "bg-blue-100 border-blue-500" : "border-gray-200",
                      )}
                    >
                      Middle
                    </button>
                    <button
                      onClick={() => setTextPosition({ x: 0.5, y: 0.8 })}
                      className={cn(
                        "p-1 border rounded-md",
                        textPosition.y === 0.8 ? "bg-blue-100 border-blue-500" : "border-gray-200",
                      )}
                    >
                      Bottom
                    </button>
                  </div>
                </div>
              </div>
            )}

            {generatedImageUrl && (
              <Button onClick={saveIconPack} className="w-full bg-blue-600 hover:bg-blue-700">
                <Download className="mr-2 h-4 w-4" />
                Download Icon Pack
              </Button>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 mt-12">
        <a
          href="https://iconic.jessejesse.xyz"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-indigo-500 transition-colors"
        >
          iconic.JesseJesse.xyz
        </a>
      </div>
    </div>
  </div>
);

