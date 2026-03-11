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
        {/* Background grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        
        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,var(--background)_70%)]" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-sm text-primary font-medium">AI-Powered Solar Analysis</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-balance">
                <span className="text-foreground">Intelligent</span>
                <br />
                <span className="text-primary">Solar Panel</span>
                <br />
                <span className="text-foreground">Inspection</span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
                Deploy autonomous drones equipped with thermal imaging and AI to detect defects, 
                optimize performance, and extend the lifespan of your solar installations.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/upload">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                    Start Free Analysis
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="gap-2 border-border hover:bg-secondary">
                  <Play className="w-4 h-4" />
                  Watch Demo
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 pt-8 border-t border-border">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-2xl font-bold text-primary">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Drone Animation */}
            <div className="relative h-[500px] lg:h-[600px]">
              <DroneAnimation className="w-full h-full" />
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
      <section className="py-24 bg-card/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-balance">
              Advanced Technology for
              <span className="text-primary"> Solar Excellence</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our drone-based system combines cutting-edge hardware with intelligent software 
              to deliver unparalleled inspection accuracy and efficiency.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card 
                key={feature.title} 
                className="bg-card border-border hover:border-primary/50 transition-all duration-300 group cursor-pointer"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-balance">
                Real-Time Panel
                <span className="text-primary"> Health Monitoring</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Our interactive dashboard provides a bird's eye view of your entire solar installation. 
                Click on any panel to view detailed diagnostics, thermal imaging data, and maintenance history.
              </p>
              <ul className="space-y-3">
                {[
                  "Instant hotspot detection",
                  "Cell-level performance analysis",
                  "Historical trend visualization",
                  "Automated alert system"
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/dashboard">
                <Button className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                  View Full Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="relative">
              <SolarGrid />
              <FloatingDrone className="absolute -top-8 -right-4" size="md" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-card/50">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-balance">
              Ready to Optimize Your
              <span className="text-primary"> Solar Investment?</span>
            </h2>
            <p className="text-muted-foreground">
              Upload your drone footage or schedule an autonomous inspection flight. 
              Get comprehensive analysis results within minutes.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link href="/upload">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                  Upload Images
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="border-border hover:bg-secondary">
                  View Demo Dashboard
                </Button>
              </Link>
            </div>
          </div>
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
