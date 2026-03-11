"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface SolarPanelProps {
  status: "healthy" | "warning" | "critical"
  efficiency: number
  row: number
  col: number
  onClick?: () => void
}

function SolarPanel({ status, efficiency, onClick }: SolarPanelProps) {
  const statusColors = {
    healthy: "bg-primary/40 hover:bg-primary shadow-lg shadow-primary/5",
    warning: "bg-chart-5/40 hover:bg-chart-5 shadow-lg shadow-chart-5/5",
    critical: "bg-destructive/40 hover:bg-destructive shadow-lg shadow-destructive/5"
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative aspect-[3/2] rounded-md transition-all duration-500 overflow-hidden group/panel",
        "hover:scale-[1.15] hover:z-20 cursor-pointer border border-white/5",
        statusColors[status]
      )}
    >
      {/* Silicon Texture Effect */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[length:4px_4px]" />
      
      {/* Panel grid lines - More precise */}
      <div className="absolute inset-0 grid grid-cols-4 grid-rows-2 gap-px opacity-20 group-hover/panel:opacity-40 transition-opacity">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white/20" />
        ))}
      </div>
      
      {/* Data Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center translate-y-2 group-hover/panel:translate-y-0 opacity-0 group-hover/panel:opacity-100 transition-all duration-300">
        <span className="text-[10px] font-black text-white drop-shadow-md">{efficiency}%</span>
      </div>

      {/* Shine effect - Dynamic Sweep */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-white/20 to-transparent -translate-x-full group-hover/panel:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
    </button>
  )
}

interface PanelData {
  id: string
  status: "healthy" | "warning" | "critical"
  efficiency: number
  row: number
  col: number
}

interface SolarGridProps {
  panels?: PanelData[]
  onPanelClick?: (panel: PanelData) => void
}

export function SolarGrid({ onPanelClick }: SolarGridProps) {
  const [selectedPanel, setSelectedPanel] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [panels, setPanels] = useState<PanelData[]>([])

  const generatePanels = (): PanelData[] => {
    const panels: PanelData[] = []
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 8; col++) {
        const random = Math.random()
        let status: "healthy" | "warning" | "critical"
        let efficiency: number

        if (random > 0.92) {
          status = "critical"
          efficiency = Math.floor(Math.random() * 20) + 15
        } else if (random > 0.75) {
          status = "warning"
          efficiency = Math.floor(Math.random() * 15) + 65
        } else {
          status = "healthy"
          efficiency = Math.floor(Math.random() * 10) + 90
        }

        panels.push({
          id: `PV-${row}${col}`,
          status,
          efficiency,
          row,
          col
        })
      }
    }
    return panels
  }

  useEffect(() => {
    setIsMounted(true)
    setPanels(generatePanels())
  }, [])

  const handlePanelClick = (panel: PanelData) => {
    setSelectedPanel(panel.id)
    onPanelClick?.(panel)
  }

  if (!isMounted) return null

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 p-6 rounded-3xl bg-black/20 border border-white/5 backdrop-blur-sm relative overflow-hidden group">
        {/* Animated scanning line effect */}
        <div className="absolute left-0 right-0 h-px bg-primary/20 top-0 animate-scan pointer-events-none" />
        
        {panels.map((panel) => (
          <div
            key={panel.id}
            className={cn(
              "transition-all duration-500",
              selectedPanel === panel.id && "scale-110 z-30"
            )}
          >
            <SolarPanel
              {...panel}
              onClick={() => handlePanelClick(panel)}
            />
            {selectedPanel === panel.id && (
              <div className="absolute -inset-1 border-2 border-primary/50 rounded-lg animate-pulse pointer-events-none" />
            )}
          </div>
        ))}
      </div>

      {/* Legend - Premium Minimalist */}
      <div className="flex flex-wrap items-center justify-center gap-8 py-4 border-t border-white/5">
        {[
          { color: "bg-primary", label: "Optimal Synthesis", status: "Healthy" },
          { color: "bg-chart-5", label: "Degradation Risk", status: "Warning" },
          { color: "bg-destructive", label: "Hardware Failure", status: "Critical" }
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-3 group/item">
            <div className={cn("w-2 h-2 rounded-full ring-4 ring-white/5 transition-transform group-hover/item:scale-125", item.color)} />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none mb-1">{item.label}</span>
              <span className="text-xs font-bold text-foreground leading-none">{item.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
