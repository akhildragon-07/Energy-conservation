"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { SolarGrid } from "@/components/solar-grid"
import { FloatingDrone } from "@/components/drone-animation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  Thermometer,
  Battery,
  Sun,
  Wind,
  Calendar,
  Download,
  RefreshCw,
  DollarSign,
  Clock,
  Sparkles,
  Layers
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from "recharts"

const performanceData = [
  { time: "6AM", efficiency: 45, expected: 50 },
  { time: "8AM", efficiency: 72, expected: 75 },
  { time: "10AM", efficiency: 88, expected: 90 },
  { time: "12PM", efficiency: 95, expected: 95 },
  { time: "2PM", efficiency: 92, expected: 93 },
  { time: "4PM", efficiency: 78, expected: 80 },
  { time: "6PM", efficiency: 52, expected: 55 },
]

const weeklyData = [
  { day: "Mon", output: 245 },
  { day: "Tue", output: 258 },
  { day: "Wed", output: 232 },
  { day: "Thu", output: 267 },
  { day: "Fri", output: 254 },
  { day: "Sat", output: 278 },
  { day: "Sun", output: 265 },
]

const issuesData = [
  { id: 1, panel: "A3-R2", issue: "Hotspot Detected", severity: "critical", temp: "78°C" },
  { id: 2, panel: "B5-R4", issue: "Micro-crack", severity: "warning", temp: "62°C" },
  { id: 3, panel: "C2-R1", issue: "Soiling", severity: "warning", temp: "45°C" },
  { id: 4, panel: "D7-R3", issue: "Cell Degradation", severity: "critical", temp: "71°C" },
]

interface PanelData {
  id: string
  status: "healthy" | "warning" | "critical"
  efficiency: number
  row: number
  col: number
  time_to_failure_days?: number
}

import { AiAssistant } from "@/components/ai-assistant"

export default function DashboardPage() {
  const [selectedPanel, setSelectedPanel] = useState<PanelData | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [systemStats, setSystemStats] = useState({
    total_panels: 48,
    critical_panels: 2,
    avg_health: 87,
    estimated_energy_loss: "5%",
    total_financial_loss: 1420.50
  })

  const fetchStats = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/system-analytics");
      if (response.ok) {
        const data = await response.json();
        if (data.total_panels > 0) {
          setSystemStats(data);
        }
      }
    } catch (error) {
      console.error("Failed to fetch system stats:", error)
    }
  }

  useEffect(() => {
    fetchStats();
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchStats();
    setTimeout(() => setIsRefreshing(false), 800)
  }

  const handleExport = () => {
    window.open("http://127.0.0.1:8000/api/export-report", "_blank");
  }

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30">
      <Navigation />

      <main className="pt-28 pb-12 px-6 relative">
        <div className="absolute top-0 left-0 w-full h-96 bg-[radial-gradient(ellipse_at_top,rgba(34,197,94,0.05),transparent_70%)] -z-10" />

        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-card border border-white/5 flex items-center justify-center shadow-2xl">
                <FloatingDrone size="md" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
                  Autonomous Fleet Control
                  <Badge className="bg-primary/10 text-primary border-primary/20 animate-pulse">Live</Badge>
                </h1>
                <p className="text-muted-foreground italic text-sm">Real-time telemetry and AI-driven predictive synthesis</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>Sync: {new Date().toLocaleTimeString()}</span>
              </div>
              <Button variant="outline" size="sm" className="h-10 px-4 rounded-xl border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all gap-2 group" onClick={handleRefresh}>
                <RefreshCw className={`w-4 h-4 text-primary transition-transform group-hover:rotate-180 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="font-bold">Neural Sync</span>
              </Button>
              <Button 
                size="sm" 
                className="h-10 px-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 gap-2 font-black tracking-tight transition-transform hover:scale-105 active:scale-95"
                onClick={handleExport}
              >
                <Download className="w-4 h-4" />
                Intelligence Export
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            <Card className="glass-card border-destructive/20 bg-destructive/5 col-span-2 md:col-span-1 group hover:scale-[1.02] transition-transform duration-500">
              <CardContent className="p-5 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-destructive/80">Revenue At Risk</p>
                  <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center group-hover:rotate-12 transition-transform">
                    <DollarSign className="w-5 h-5 text-destructive" />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-black text-destructive tracking-tighter">
                    ${systemStats.total_financial_loss.toLocaleString('en-US', {minimumFractionDigits: 2})}
                  </p>
                  <p className="text-[10px] text-destructive/60 font-bold mt-1">Monthly Yield Deficit</p>
                </div>
              </CardContent>
            </Card>

            {[
              { label: "Active Yield", value: "1.85 MWh", change: "+12.5%", icon: Zap, color: "text-chart-1", bg: "bg-chart-1/10" },
              { label: "Fleet Health", value: `${systemStats.avg_health}%`, change: "Stable", icon: Battery, color: "text-chart-2", bg: "bg-chart-2/10" },
              { label: "Unit Status", value: `${systemStats.total_panels - systemStats.critical_panels}/${systemStats.total_panels}`, change: "Operational", icon: CheckCircle2, color: "text-primary", bg: "bg-primary/10" },
              { label: "Alert Latency", value: systemStats.critical_panels, change: "Critical", icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10" },
            ].map((stat, i) => (
              <Card key={stat.label} className="glass-card border-white/5 group hover:scale-[1.02] transition-all duration-500" style={{ transitionDelay: `${i * 100}ms` }}>
                <CardContent className="p-5 flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                    <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center group-hover:rotate-12 transition-transform`}>
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-foreground tracking-tight">{stat.value}</p>
                    <p className={`text-[10px] font-bold mt-1 ${stat.color} opacity-80`}>{stat.change}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 space-y-8">
              <Card className="glass-card border-white/5 overflow-hidden shadow-2xl">
                <CardHeader className="p-6 border-b border-white/5 bg-white/2">
                  <CardTitle className="text-lg font-bold flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <span>Spatial Asset Intelligence</span>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="border-white/10 bg-white/5 text-[10px] uppercase font-black tracking-[2px]">Heatmap</Badge>
                      <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary text-[10px] uppercase font-black tracking-[2px]">Multi-Spectral</Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-primary/5 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <SolarGrid onPanelClick={(panel) => setSelectedPanel(panel)} />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-white/5 shadow-xl">
                <CardHeader className="p-6 border-b border-white/5">
                  <CardTitle className="text-lg font-bold flex items-center gap-3">
                    <Sun className="w-5 h-5 text-chart-3" />
                    Spectral Yield Curve
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-10">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={performanceData}>
                        <defs>
                          <linearGradient id="yieldGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey="time" stroke="#666" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                        <YAxis stroke="#666" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(10, 10, 10, 0.9)', 
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '16px',
                            backdropFilter: 'blur(12px)',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                          }}
                          itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="efficiency" 
                          stroke="var(--primary)" 
                          fillOpacity={1} 
                          fill="url(#yieldGradient)" 
                          strokeWidth={4}
                          animationDuration={2000}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="expected" 
                          stroke="#444" 
                          strokeDasharray="8 8" 
                          strokeWidth={1.5}
                          dot={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <Card className="glass-card border-primary/20 bg-primary/5 overflow-hidden shadow-2xl border-2">
                <CardHeader className="p-6 pb-2">
                  <CardTitle className="text-xl font-black italic tracking-tighter flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                    AI Diagnostics
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {selectedPanel ? (
                    <div className="space-y-6">
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Component ID</span>
                          <Badge className="bg-primary/10 text-primary border-primary/20 font-mono tracking-tighter">{selectedPanel.id}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</span>
                          <Badge 
                            className={
                              selectedPanel.status === 'healthy' ? 'bg-chart-1/20 text-chart-1' :
                              selectedPanel.status === 'warning' ? 'bg-chart-5/20 text-chart-5' :
                              'bg-destructive/20 text-destructive'
                            }
                          >
                            {selectedPanel.status.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Efficiency</span>
                          <span className="text-xl font-black text-foreground">{selectedPanel.efficiency}%</span>
                        </div>
                      </div>

                      {selectedPanel.status !== 'healthy' && (
                        <div className="p-5 rounded-3xl bg-destructive/5 border border-destructive/10 animate-in zoom-in duration-500 relative overflow-hidden group">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-destructive/10 blur-3xl -z-10 group-hover:bg-destructive/20 transition-colors" />
                          <p className="text-[10px] font-black uppercase tracking-[2px] flex items-center gap-2 mb-4 text-destructive">
                            <AlertTriangle className="w-4 h-4 animate-pulse" />
                            AI Failure Prediction
                          </p>
                          <div className="space-y-4">
                             <div className="flex justify-between items-end">
                                <span className="text-sm font-black text-foreground">Structural Integrity Risk</span>
                                <Badge className="bg-destructive text-white border-0 text-[10px] font-black italic shadow-lg shadow-destructive/20">ETA: 14 DAYS</Badge>
                             </div>
                             <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden p-1 border border-white/5">
                                <div className="h-full bg-gradient-to-r from-destructive/50 to-destructive rounded-full animate-progress-fast shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                             </div>
                             <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                               <p className="text-[10px] text-muted-foreground italic font-medium leading-relaxed">
                                 Neural Engine detected micro-cracking propagation across 14% of surface area. Elevated thermal signature confirms resistance build-up.
                               </p>
                             </div>
                          </div>
                        </div>
                      )}

                      <Button className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-black tracking-widest uppercase text-xs transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/20">
                        Initiate Repair Payload
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-12 space-y-4">
                      <div className="w-16 h-16 rounded-full bg-white/5 border border-dashed border-white/20 mx-auto flex items-center justify-center">
                        <Layers className="w-6 h-6 text-muted-foreground opacity-20" />
                      </div>
                      <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Awaiting Selective Input</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="glass-card border-white/5">
                <CardHeader className="p-6 pb-2">
                  <CardTitle className="text-sm font-black uppercase tracking-[3px] text-muted-foreground">Telemetry</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  {[
                    { label: "Surface Temp", value: "32°C", icon: Thermometer, color: "text-chart-5" },
                    { label: "Irradiance", value: "845 W/m²", icon: Sun, color: "text-chart-3" },
                    { label: "Wind Velocity", value: "12 km/h", icon: Wind, color: "text-chart-2" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-4 rounded-xl bg-white/2 border border-white/5 group hover:bg-white/5 transition-all">
                      <div className="flex items-center gap-3">
                        <item.icon className={`w-4 h-4 ${item.color} group-hover:scale-110 transition-transform`} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{item.label}</span>
                      </div>
                      <span className="text-xs font-black text-foreground italic">{item.value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="glass-card border-white/5">
                <CardHeader className="p-6 pb-2">
                  <CardTitle className="text-sm font-black uppercase tracking-[3px] text-muted-foreground">Anomaly Feed</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {issuesData.map((issue) => (
                      <div 
                        key={issue.id} 
                        className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-destructive/30 transition-all cursor-pointer group"
                      >
                         <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black text-foreground tracking-tighter">{issue.panel}</span>
                            <Badge className={issue.severity === 'critical' ? 'bg-destructive/20 text-destructive border-0 text-[8px] h-4' : 'bg-chart-5/20 text-chart-5 border-0 text-[8px] h-4'}>
                               {issue.severity.toUpperCase()}
                            </Badge>
                         </div>
                         <p className="text-[10px] font-bold text-muted-foreground group-hover:text-foreground transition-colors">{issue.issue}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <AiAssistant />
    </div>
  )
}
