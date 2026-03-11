"use client"

import { useState } from "react"
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
    healthy: "bg-chart-1/80 hover:bg-chart-1",
    warning: "bg-chart-5/80 hover:bg-chart-5",
    critical: "bg-destructive/80 hover:bg-destructive"
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative aspect-[2/1] rounded-sm transition-all duration-300",
        "hover:scale-105 hover:z-10 cursor-pointer",
        "border border-border/50",
        statusColors[status]
      )}
    >
      {/* Panel grid lines */}
      <div className="absolute inset-0 grid grid-cols-6 gap-px opacity-30">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-background/50" />
        ))}
      </div>
      
      {/* Efficiency indicator */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-mono text-foreground/80">{efficiency}%</span>
      </div>

      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
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

  // Generate sample panel data
  const generatePanels = (): PanelData[] => {
    const panels: PanelData[] = []
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 8; col++) {
        const random = Math.random()
        let status: "healthy" | "warning" | "critical"
        let efficiency: number

        if (random > 0.85) {
          status = "critical"
          efficiency = Math.floor(Math.random() * 30) + 20
        } else if (random > 0.7) {
          status = "warning"
          efficiency = Math.floor(Math.random() * 20) + 60
        } else {
          status = "healthy"
          efficiency = Math.floor(Math.random() * 15) + 85
        }

        panels.push({
          id: `panel-${row}-${col}`,
          status,
          efficiency,
          row,
          col
        })
      }
    }
    return panels
  }

  const [panels] = useState(generatePanels)

  const handlePanelClick = (panel: PanelData) => {
    setSelectedPanel(panel.id)
    onPanelClick?.(panel)
  }

  return (
    <div className="relative p-4 rounded-xl bg-card border border-border">
      {/* Grid container */}
      <div className="grid grid-cols-8 gap-1">
        {panels.map((panel) => (
          <div
            key={panel.id}
            className={cn(
              "transition-all duration-200",
              selectedPanel === panel.id && "ring-2 ring-primary ring-offset-2 ring-offset-background rounded-sm"
            )}
          >
            <SolarPanel
              {...panel}
              onClick={() => handlePanelClick(panel)}
            />
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-chart-1" />
          <span className="text-muted-foreground">Healthy</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-chart-5" />
          <span className="text-muted-foreground">Warning</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-destructive" />
          <span className="text-muted-foreground">Critical</span>
        </div>
      </div>
    </div>
  )
}
