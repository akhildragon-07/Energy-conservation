"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { SolarGrid } from "@/components/solar-grid"
import { FloatingDrone } from "@/components/drone-animation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Zap, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Thermometer,
  Battery,
  Sun,
  Wind,
  Calendar,
  Download,
  RefreshCw
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
}

export default function DashboardPage() {
  const [selectedPanel, setSelectedPanel] = useState<PanelData | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1500)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-12 px-6">
        <div className="container mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <FloatingDrone size="md" />
              <div>
                <h1 className="text-3xl font-bold text-foreground">Solar Array Dashboard</h1>
                <p className="text-muted-foreground">Real-time monitoring and analysis</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Last scan: 5 min ago</span>
              </div>
              <Button variant="outline" size="sm" className="gap-2" onClick={handleRefresh}>
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button size="sm" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Download className="w-4 h-4" />
                Export Report
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Output</p>
                    <p className="text-2xl font-bold text-foreground">1,847 kWh</p>
                    <p className="text-xs text-chart-1 flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3" /> +12.5% from yesterday
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-chart-1/10 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-chart-1" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Efficiency</p>
                    <p className="text-2xl font-bold text-foreground">87.3%</p>
                    <p className="text-xs text-chart-2 flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3" /> +2.1% improvement
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-chart-2/10 flex items-center justify-center">
                    <Battery className="w-6 h-6 text-chart-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Healthy Panels</p>
                    <p className="text-2xl font-bold text-foreground">42/48</p>
                    <p className="text-xs text-muted-foreground mt-1">87.5% operational</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-chart-1/10 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-chart-1" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Issues Found</p>
                    <p className="text-2xl font-bold text-foreground">6</p>
                    <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                      <AlertTriangle className="w-3 h-3" /> 2 critical
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-destructive" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Solar Grid */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-card border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>Panel Health Map</span>
                    <Badge variant="outline" className="font-normal">
                      Interactive
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SolarGrid onPanelClick={(panel) => setSelectedPanel(panel)} />
                </CardContent>
              </Card>

              {/* Performance Chart */}
              <Card className="bg-card border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sun className="w-5 h-5 text-chart-3" />
                    Today's Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={performanceData}>
                        <defs>
                          <linearGradient id="efficiencyGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis dataKey="time" stroke="var(--muted-foreground)" fontSize={12} />
                        <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'var(--card)', 
                            border: '1px solid var(--border)',
                            borderRadius: '8px'
                          }}
                          labelStyle={{ color: 'var(--foreground)' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="efficiency" 
                          stroke="var(--chart-1)" 
                          fillOpacity={1} 
                          fill="url(#efficiencyGradient)" 
                          strokeWidth={2}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="expected" 
                          stroke="var(--muted-foreground)" 
                          strokeDasharray="5 5" 
                          strokeWidth={1.5}
                          dot={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Selected Panel Info */}
              <Card className="bg-card border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Panel Details</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedPanel ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Panel ID</span>
                        <Badge variant="outline">{selectedPanel.id}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <Badge 
                          className={
                            selectedPanel.status === 'healthy' ? 'bg-chart-1/20 text-chart-1' :
                            selectedPanel.status === 'warning' ? 'bg-chart-5/20 text-chart-5' :
                            'bg-destructive/20 text-destructive'
                          }
                        >
                          {selectedPanel.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Efficiency</span>
                        <span className="font-semibold text-foreground">{selectedPanel.efficiency}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Position</span>
                        <span className="font-mono text-sm text-foreground">R{selectedPanel.row + 1}C{selectedPanel.col + 1}</span>
                      </div>
                      <Button className="w-full mt-2 bg-primary text-primary-foreground hover:bg-primary/90">
                        View Full Report
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Click on a panel to view details</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Environment */}
              <Card className="bg-card border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Environment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Thermometer className="w-4 h-4 text-chart-5" />
                      <span className="text-muted-foreground">Temperature</span>
                    </div>
                    <span className="font-semibold text-foreground">32°C</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4 text-chart-3" />
                      <span className="text-muted-foreground">Solar Irradiance</span>
                    </div>
                    <span className="font-semibold text-foreground">845 W/m²</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wind className="w-4 h-4 text-chart-2" />
                      <span className="text-muted-foreground">Wind Speed</span>
                    </div>
                    <span className="font-semibold text-foreground">12 km/h</span>
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Output */}
              <Card className="bg-card border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Weekly Output</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                        <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} />
                        <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'var(--card)', 
                            border: '1px solid var(--border)',
                            borderRadius: '8px'
                          }}
                        />
                        <Bar dataKey="output" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Issues List */}
              <Card className="bg-card border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-chart-5" />
                    Active Issues
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {issuesData.map((issue) => (
                      <div 
                        key={issue.id} 
                        className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
                      >
                        <div>
                          <p className="font-medium text-sm text-foreground">{issue.panel}</p>
                          <p className="text-xs text-muted-foreground">{issue.issue}</p>
                        </div>
                        <div className="text-right">
                          <Badge 
                            className={
                              issue.severity === 'critical' 
                                ? 'bg-destructive/20 text-destructive' 
                                : 'bg-chart-5/20 text-chart-5'
                            }
                          >
                            {issue.temp}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
