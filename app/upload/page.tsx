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
  fileObj?: File
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
      progress: 0,
      fileObj: file
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

  const handleStartAnalysis = async () => {
    if (files.length === 0) return
    setIsAnalyzing(true)
    
    try {
      const formData = new FormData();
      files.forEach(f => {
        if (f.fileObj) {
          formData.append("files", f.fileObj);
        }
      });

      // Actual API call
      const response = await fetch("http://127.0.0.1:8000/api/batch-analysis", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      await response.json();
      
      // Success delay for "Wow" factor
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)
    } catch (error) {
      console.error("Error during analysis:", error);
      setIsAnalyzing(false);
      // Fallback for demo if backend is still being finicky, but we want real integration
    }
  }

  const allFilesComplete = files.length > 0 && files.every(f => f.status === 'complete')

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30">
      <Navigation />

      <main className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[100px] -z-10" />

        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/5">
                <FloatingDrone size="md" />
              </div>
              <div>
                <h1 className="text-4xl font-black tracking-tight text-foreground">Data Ingestion</h1>
                <p className="text-muted-foreground text-lg italic">Upload multi-spectral payload for AI-driven synthesis</p>
              </div>
            </div>
            <div className="hidden md:block">
              <Badge variant="outline" className="px-4 py-1.5 rounded-full border-primary/20 bg-primary/5 text-primary text-sm font-semibold">
                Priority Processing Active
              </Badge>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Upload Area */}
              <Card className="glass-card border-white/5 overflow-hidden animate-in fade-in slide-in-from-left-6 duration-700 delay-100">
                <CardContent className="p-8">
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`
                      relative border-2 border-dashed rounded-[32px] p-16 text-center transition-all duration-500
                      ${isDragging
                        ? 'border-primary bg-primary/10 scale-[1.01]'
                        : 'border-white/10 hover:border-primary/40 hover:bg-white/5'
                      }
                    `}
                  >
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileInput}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    />

                    <div className="space-y-6 relative z-10">
                      <div className={`
                        w-24 h-24 mx-auto rounded-[28px] flex items-center justify-center transition-all duration-500
                        ${isDragging ? 'bg-primary shadow-2xl shadow-primary/40 scale-110' : 'bg-secondary/50 group-hover:bg-secondary'}
                      `}>
                        <Upload className={`w-12 h-12 transition-colors duration-500 ${isDragging ? 'text-primary-foreground' : 'text-primary'}`} />
                      </div>

                      <div className="space-y-2">
                        <p className="text-2xl font-black text-foreground tracking-tight">
                          {isDragging ? 'Release to Scan' : 'Drop Footage Here'}
                        </p>
                        <p className="text-muted-foreground italic">
                          Support for RAW, Thermal, and Visual streams
                        </p>
                      </div>

                      <div className="flex items-center justify-center gap-6 pt-4">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                          <ImageIcon className="w-4 h-4 text-primary" />
                          <span>Images</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-white/10" />
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                          <FileVideo className="w-4 h-4 text-accent" />
                          <span>Video</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Uploaded Files - Premium List */}
              {files.length > 0 && (
                <Card className="glass-card border-white/5 animate-in fade-in slide-in-from-left-8 duration-700 delay-200">
                  <CardHeader className="p-6 pb-2">
                    <CardTitle className="text-xl font-bold flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Layers className="w-5 h-5 text-primary" />
                        <span>Payload Queue</span>
                      </div>
                      <Badge className="bg-primary/10 text-primary border-primary/20">{files.length} Units</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid gap-3">
                      {files.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group"
                        >
                          <div className={`
                            w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:rotate-3
                            ${file.type === 'video' ? 'bg-accent/10 border border-accent/20' : 'bg-primary/10 border border-primary/20'}
                          `}>
                            {file.type === 'video'
                              ? <FileVideo className="w-6 h-6 text-accent" />
                              : <ImageIcon className="w-6 h-6 text-primary" />
                            }
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1.5">
                              <p className="font-bold text-sm text-foreground truncate">{file.name}</p>
                              <span className="text-[10px] font-black uppercase text-muted-foreground bg-white/5 px-2 py-0.5 rounded">{file.size}</span>
                            </div>

                            {file.status === 'uploading' && (
                              <div className="space-y-2">
                                <Progress value={file.progress} className="h-1.5 bg-white/5" />
                                <p className="text-[10px] font-black uppercase text-primary animate-pulse tracking-widest">Encrypting... {Math.round(file.progress)}%</p>
                              </div>
                            )}

                            {file.status === 'processing' && (
                              <div className="flex items-center gap-2 text-[10px] font-black uppercase text-accent tracking-widest">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                <span>AI Synthesizing...</span>
                              </div>
                            )}

                            {file.status === 'complete' && (
                              <div className="flex items-center gap-2 text-[10px] font-black uppercase text-primary tracking-widest">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Ready for Analysis</span>
                              </div>
                            )}
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                            onClick={() => removeFile(file.id)}
                          >
                            <X className="w-5 h-5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar Controls */}
            <div className="space-y-8 animate-in fade-in slide-in-from-right-6 duration-700 delay-300">
              {/* Analysis Type */}
              <Card className="glass-card border-white/5 overflow-hidden">
                <CardHeader className="p-6 pb-2">
                  <CardTitle className="text-xl font-bold">Analysis Mode</CardTitle>
                </CardHeader>
                <CardContent className="p-4 grid gap-3">
                  {analysisTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedAnalysis(type.id)}
                      className={`
                        p-5 rounded-2xl border transition-all duration-300 text-left group
                        ${selectedAnalysis === type.id
                          ? 'border-primary/50 bg-primary/10 shadow-lg shadow-primary/5'
                          : 'border-white/5 hover:border-white/20 bg-white/5'
                        }
                      `}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 ${
                          selectedAnalysis === type.id ? 'bg-primary/20' : 'bg-background/50'
                        }`}>
                          <type.icon className={`w-6 h-6 ${type.color} ${selectedAnalysis === type.id ? 'animate-pulse' : ''}`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-foreground text-sm tracking-tight">{type.title}</p>
                          <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest leading-none mt-1.5 opacity-60">{type.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>

              {/* Action Center */}
              <Card className="glass-card border-primary/20 bg-primary/5 overflow-hidden">
                <CardContent className="p-8 space-y-8 text-center">
                  <div className="space-y-4">
                    <div className="w-20 h-20 mx-auto rounded-[32px] bg-primary/10 flex items-center justify-center border border-primary/20">
                      <Sparkles className="w-10 h-10 text-primary animate-pulse" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-black text-xl tracking-tight">AI Synthesis</p>
                      <p className="text-sm text-muted-foreground italic">
                        {allFilesComplete
                          ? `Ready to process ${files.length} streams`
                          : 'Awaiting data streams...'
                        }
                      </p>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className="w-full h-16 rounded-[24px] bg-primary text-primary-foreground hover:bg-primary/90 text-lg font-black shadow-2xl shadow-primary/20 transition-all hover:scale-[1.03] active:scale-[0.98] disabled:opacity-40"
                    disabled={!allFilesComplete || isAnalyzing}
                    onClick={handleStartAnalysis}
                  >
                    {isAnalyzing ? (
                      <div className="flex items-center gap-3">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span>PROCESSING...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <span>INITIATE SCAN</span>
                        <ArrowRight className="w-6 h-6" />
                      </div>
                    )}
                  </Button>

                  <div className="pt-4 grid grid-cols-3 gap-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-1 rounded-full bg-primary/10 overflow-hidden">
                        {isAnalyzing && (
                          <div 
                            className="h-full bg-primary animate-progress-fast" 
                            style={{ animationDelay: `${i * 0.2}s` }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Best Practices Tips */}
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-[3px] text-muted-foreground ml-2">Operation Protocol</p>
                <div className="grid gap-3">
                  {[
                    { label: "RESOLUTION", value: "4K Min Rec.", icon: Camera },
                    { label: "OVERLAP", value: "70% Lateral", icon: Layers },
                    { label: "TIMING", value: "Peak Noon", icon: Thermometer }
                  ].map((tip) => (
                    <div key={tip.label} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-white/10 transition-all">
                      <div className="flex items-center gap-3">
                        <tip.icon className="w-4 h-4 text-primary opacity-50" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{tip.label}</span>
                      </div>
                      <span className="text-[10px] font-black text-foreground italic">{tip.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

