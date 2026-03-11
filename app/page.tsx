"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { DroneAnimation, FloatingDrone } from "@/components/drone-animation"
import { SolarGrid } from "@/components/solar-grid"
import { Zap, Eye, BarChart3, Shield, ArrowRight, Play } from "lucide-react"

const features = [
  {
    icon: Eye,
    title: "AI Vision Analysis",
    description: "Advanced computer vision detects microcracks, hotspots, and degradation invisible to the naked eye."
  },
  {
    icon: Zap,
    title: "Real-time Monitoring",
    description: "Instant data processing and live streaming during drone flights for immediate insights."
  },
  {
    icon: BarChart3,
    title: "Predictive Analytics",
    description: "Machine learning models predict maintenance needs before failures occur."
  },
  {
    icon: Shield,
    title: "Automated Reports",
    description: "Generate comprehensive reports with actionable recommendations automatically."
  }
]

const stats = [
  { value: "99.7%", label: "Detection Accuracy" },
  { value: "10x", label: "Faster Inspection" },
  { value: "50%", label: "Cost Reduction" },
  { value: "24/7", label: "Monitoring" }
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background blobs for premium feel */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse" />
        
        {/* Background grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.05)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
        
        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--background)_80%)]" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left content */}
            <div className="space-y-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md animate-in fade-in slide-in-from-left-4 duration-1000">
                <span className="w-2 h-2 bg-primary rounded-full animate-ping" />
                <span className="text-sm text-primary font-semibold tracking-wide uppercase">AI-Powered Solar Intelligence</span>
              </div>

              <div className="space-y-4 animate-in fade-in slide-in-from-left-6 duration-1000 delay-200">
                <h1 className="text-7xl lg:text-[140px] font-black leading-[0.85] tracking-tighter">
                  <span className="text-foreground">NEURAL</span>
                  <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-gradient italic">SOLAR</span>
                  <br />
                  <span className="text-foreground">GENESIS</span>
                </h1>
              </div>

              <p className="text-xl text-muted-foreground max-w-lg leading-relaxed animate-in fade-in slide-in-from-left-8 duration-1000 delay-400">
                Revolutionize your solar maintenance with autonomous drones and deep-learning diagnostics. 
                Identify defects with <span className="text-foreground font-semibold">sub-millimeter precision</span>.
              </p>

              <div className="flex flex-wrap gap-6 animate-in fade-in slide-in-from-left-10 duration-1000 delay-500">
                <Link href="/upload">
                  <Button size="lg" className="h-14 px-8 bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl shadow-lg shadow-primary/20 transition-all hover:scale-105 gap-3 text-lg font-bold">
                    Start Analysis
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="h-14 px-8 rounded-2xl border-border bg-background/50 backdrop-blur-md hover:bg-secondary transition-all hover:scale-105 gap-3 text-lg font-bold">
                  <Play className="w-5 h-5 fill-current" />
                  Live Demo
                </Button>
              </div>

              {/* Stats with glassmorphism */}
              <div className="grid grid-cols-4 gap-4 p-6 rounded-3xl bg-card/30 border border-white/5 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-700">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center group">
                    <div className="text-2xl font-black text-primary group-hover:scale-110 transition-transform">{stat.value}</div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Drone Animation with Glow */}
            <div className="relative h-[500px] lg:h-[700px] animate-in fade-in zoom-in duration-1000 delay-300">
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
              <DroneAnimation className="w-full h-full relative z-10" />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/50 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-primary rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
        
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-black mb-6 tracking-tight">
              Surgical Precision.
              <span className="text-primary italic"> Industrial Scale.</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Our autonomous drone ecosystem delivers deep-tech insights that traditional inspections miss.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <Card 
                key={feature.title} 
                className="glass-card border-white/5 hover:border-primary/50 transition-all duration-500 group cursor-pointer hover:-translate-y-2 rounded-3xl"
              >
                <CardContent className="p-8 space-y-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:rotate-6 transition-all duration-300">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-bold text-xl text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section - Enhanced */}
      <section className="py-32 bg-secondary/20 backdrop-blur-3xl border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                Real-Time Panel
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Health Intelligence</span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                No more manual spreadsheets. Our AI analyzes multi-spectral data and generates a 
                digital twin of your entire solar farm instantly.
              </p>
              <ul className="grid grid-cols-2 gap-4">
                {[
                  "Millisecond Latency",
                  "Cell-Level Diagnostics",
                  "Predictive ROI Analysis",
                  "Automated Reporting"
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 p-4 rounded-2xl bg-card/40 border border-white/5">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-foreground font-medium text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/dashboard">
                <Button size="lg" className="rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-14 font-bold transition-all hover:scale-105">
                  Explore Ecosystem
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-primary/20 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="glass-card p-4 rounded-[40px] transform group-hover:scale-[1.02] transition-transform duration-700">
                <SolarGrid />
              </div>
              <FloatingDrone className="absolute -top-12 -right-8 animate-bounce transition-all duration-1000" size="lg" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Premium Layout */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
        
        <div className="container mx-auto px-6 text-center">
          <Card className="max-w-4xl mx-auto p-12 lg:p-20 rounded-[48px] bg-gradient-to-b from-primary/10 to-transparent border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.1),transparent_70%)]" />
            
            <div className="relative z-10 space-y-8">
              <h2 className="text-5xl lg:text-7xl font-black tracking-tighter leading-tight">
                Ready to <span className="text-primary italic animate-pulse">Optimize</span>?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
                Join the industrial-scale automation revolution. Maximize yield with precision drone diagnostics.
              </p>
              <div className="flex flex-wrap justify-center gap-6 pt-4">
                <Link href="/upload">
                  <Button size="lg" className="h-16 px-10 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 text-xl font-black shadow-xl shadow-primary/25 transition-all hover:scale-110">
                    Get Started Now
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="lg" variant="outline" className="h-16 px-10 rounded-2xl border-white/10 bg-white/5 backdrop-blur-md text-xl font-bold transition-all hover:scale-105">
                    View Enterprise Demo
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FloatingDrone size="sm" />
              <span className="font-semibold">
                <span className="text-primary">Solar</span>
                <span className="text-foreground">Scan</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Advanced drone-based solar panel analysis powered by AI
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
