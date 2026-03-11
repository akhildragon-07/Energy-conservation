"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { FloatingDrone } from "@/components/drone-animation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Upload, 
  Image as ImageIcon, 
  FileVideo,
  X, 
  CheckCircle2,
  Loader2,
  Sparkles,
  ArrowRight,
  Camera,
  Thermometer,
  Layers
} from "lucide-react"

interface UploadedFile {
  id: string
  name: string
  size: string
  type: "image" | "video"
  status: "uploading" | "processing" | "complete" | "error"
  progress: number
}

const analysisTypes = [
  {
    id: "thermal",
    title: "Thermal Analysis",
    description: "Detect hotspots and temperature anomalies",
    icon: Thermometer,
    color: "text-chart-5"
  },
  {
    id: "visual",
    title: "Visual Inspection",
    description: "Identify physical damage and defects",
    icon: Camera,
    color: "text-chart-2"
  },
  {
    id: "combined",
    title: "Combined Analysis",
    description: "Comprehensive multi-spectrum analysis",
    icon: Layers,
    color: "text-primary"
  }
]

export default function UploadPage() {
  const router = useRouter()
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [selectedAnalysis, setSelectedAnalysis] = useState("combined")
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const droppedFiles = Array.from(e.dataTransfer.files)
    processFiles(droppedFiles)
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      processFiles(selectedFiles)
    }
  }

  const processFiles = (fileList: File[]) => {
    const newFiles: UploadedFile[] = fileList.map((file, index) => ({
      id: `file-${Date.now()}-${index}`,
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type.startsWith('video/') ? 'video' : 'image',
      status: 'uploading',
      progress: 0
    }))

    setFiles(prev => [...prev, ...newFiles])

    // Simulate upload progress
    newFiles.forEach((file) => {
      simulateUpload(file.id)
    })
  }

  const simulateUpload = (fileId: string) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 15
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, status: 'processing', progress: 100 } : f
        ))
        
        // Simulate processing
        setTimeout(() => {
          setFiles(prev => prev.map(f => 
            f.id === fileId ? { ...f, status: 'complete' } : f
          ))
        }, 1500)
      } else {
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, progress } : f
        ))
      }
    }, 200)
  }

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const handleStartAnalysis = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      router.push('/dashboard')
    }, 2000)
  }

  const allFilesComplete = files.length > 0 && files.every(f => f.status === 'complete')

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-12 px-6">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <FloatingDrone size="md" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Upload Drone Footage</h1>
              <p className="text-muted-foreground">Upload thermal or visual images for AI-powered analysis</p>
            </div>
          </div>

          <div className="grid gap-6">
            {/* Upload Area */}
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`
                    relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300
                    ${isDragging 
                      ? 'border-primary bg-primary/5 scale-[1.02]' 
                      : 'border-border hover:border-primary/50 hover:bg-secondary/30'
                    }
                  `}
                >
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileInput}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  
                  <div className="space-y-4">
                    <div className={`
                      w-20 h-20 mx-auto rounded-2xl flex items-center justify-center transition-all
                      ${isDragging ? 'bg-primary/20 scale-110' : 'bg-secondary'}
                    `}>
                      <Upload className={`w-10 h-10 transition-colors ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    
                    <div>
                      <p className="text-lg font-medium text-foreground">
                        {isDragging ? 'Drop files here' : 'Drag and drop files here'}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        or click to browse your computer
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <ImageIcon className="w-4 h-4" />
                        <span>JPG, PNG, TIFF</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileVideo className="w-4 h-4" />
                        <span>MP4, MOV</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Uploaded Files */}
            {files.length > 0 && (
              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>Uploaded Files</span>
                    <Badge variant="outline">{files.length} files</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {files.map((file) => (
                      <div 
                        key={file.id} 
                        className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50"
                      >
                        <div className={`
                          w-10 h-10 rounded-lg flex items-center justify-center
                          ${file.type === 'video' ? 'bg-chart-2/20' : 'bg-chart-1/20'}
                        `}>
                          {file.type === 'video' 
                            ? <FileVideo className="w-5 h-5 text-chart-2" />
                            : <ImageIcon className="w-5 h-5 text-chart-1" />
                          }
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-sm text-foreground truncate">{file.name}</p>
                            <span className="text-xs text-muted-foreground ml-2">{file.size}</span>
                          </div>
                          
                          {file.status === 'uploading' && (
                            <div className="space-y-1">
                              <Progress value={file.progress} className="h-1" />
                              <p className="text-xs text-muted-foreground">Uploading... {Math.round(file.progress)}%</p>
                            </div>
                          )}
                          
                          {file.status === 'processing' && (
                            <div className="flex items-center gap-2 text-xs text-chart-2">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              <span>Processing...</span>
                            </div>
                          )}
                          
                          {file.status === 'complete' && (
                            <div className="flex items-center gap-2 text-xs text-chart-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Ready for analysis</span>
                            </div>
                          )}
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removeFile(file.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Analysis Type Selection */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Analysis Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {analysisTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedAnalysis(type.id)}
                      className={`
                        p-4 rounded-xl border-2 text-left transition-all
                        ${selectedAnalysis === type.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50 bg-secondary/30'
                        }
                      `}
                    >
                      <div className={`w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-3`}>
                        <type.icon className={`w-5 h-5 ${type.color}`} />
                      </div>
                      <p className="font-medium text-foreground">{type.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{type.description}</p>
                      {selectedAnalysis === type.id && (
                        <div className="mt-3">
                          <Badge className="bg-primary/20 text-primary border-0">Selected</Badge>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Start Analysis Button */}
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">AI-Powered Analysis</p>
                      <p className="text-sm text-muted-foreground">
                        {allFilesComplete 
                          ? `${files.length} files ready for analysis`
                          : 'Upload files to begin analysis'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <Button 
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 min-w-[200px]"
                    disabled={!allFilesComplete || isAnalyzing}
                    onClick={handleStartAnalysis}
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        Start Analysis
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tips Section */}
            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  title: "High Resolution",
                  description: "Use 4K images for best defect detection accuracy"
                },
                {
                  title: "Overlap Coverage",
                  description: "Ensure 60-70% overlap between adjacent images"
                },
                {
                  title: "Optimal Timing",
                  description: "Capture during peak sunlight for thermal analysis"
                }
              ].map((tip) => (
                <div key={tip.title} className="p-4 rounded-xl bg-secondary/30 border border-border">
                  <p className="font-medium text-sm text-foreground">{tip.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{tip.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
