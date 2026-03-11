"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function DroneAnimation({ className }: { className?: string }) {
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const [rotation, setRotation] = useState(0)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const interval = setInterval(() => {
      setPosition(prev => ({
        x: 50 + Math.sin(Date.now() / 2000) * 15,
        y: 50 + Math.cos(Date.now() / 1500) * 10
      }))
      setRotation(Math.sin(Date.now() / 3000) * 5)
    }, 50)

    return () => clearInterval(interval)
  }, [])

  if (!isMounted) {
    return <div className={cn("relative w-full h-full", className)} />;
  }

  return (
    <div className={cn("relative w-full h-full", className)}>
      {/* Scan lines effect */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-px bg-primary"
            style={{
              top: `${(i * 5) + (Date.now() / 100 % 5)}%`,
              opacity: 0.3 + Math.sin(i) * 0.2,
              animation: `scanLine ${2 + i * 0.1}s linear infinite`
            }}
          />
        ))}
      </div>

      {/* Drone SVG */}
      <div
        className="absolute transition-all duration-100 ease-out"
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
          transform: `translate(-50%, -50%) rotate(${rotation}deg)`
        }}
      >
        <svg
          width="120"
          height="80"
          viewBox="0 0 120 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-2xl"
        >
          {/* Drone body */}
          <ellipse cx="60" cy="40" rx="20" ry="10" className="fill-secondary stroke-primary" strokeWidth="2" />
          
          {/* Camera */}
          <circle cx="60" cy="50" r="6" className="fill-primary" />
          <circle cx="60" cy="50" r="3" className="fill-background" />
          
          {/* Arms */}
          <line x1="40" y1="35" x2="15" y2="20" className="stroke-muted-foreground" strokeWidth="3" />
          <line x1="80" y1="35" x2="105" y2="20" className="stroke-muted-foreground" strokeWidth="3" />
          <line x1="40" y1="45" x2="15" y2="60" className="stroke-muted-foreground" strokeWidth="3" />
          <line x1="80" y1="45" x2="105" y2="60" className="stroke-muted-foreground" strokeWidth="3" />
          
          {/* Propellers with animation */}
          <g className="animate-spin origin-center" style={{ transformOrigin: '15px 20px', animationDuration: '0.1s' }}>
            <ellipse cx="15" cy="20" rx="12" ry="3" className="fill-primary/50" />
          </g>
          <g className="animate-spin origin-center" style={{ transformOrigin: '105px 20px', animationDuration: '0.1s' }}>
            <ellipse cx="105" cy="20" rx="12" ry="3" className="fill-primary/50" />
          </g>
          <g className="animate-spin origin-center" style={{ transformOrigin: '15px 60px', animationDuration: '0.1s' }}>
            <ellipse cx="15" cy="60" rx="12" ry="3" className="fill-primary/50" />
          </g>
          <g className="animate-spin origin-center" style={{ transformOrigin: '105px 60px', animationDuration: '0.1s' }}>
            <ellipse cx="105" cy="60" rx="12" ry="3" className="fill-primary/50" />
          </g>
          
          {/* Motor hubs */}
          <circle cx="15" cy="20" r="4" className="fill-secondary stroke-primary" strokeWidth="1" />
          <circle cx="105" cy="20" r="4" className="fill-secondary stroke-primary" strokeWidth="1" />
          <circle cx="15" cy="60" r="4" className="fill-secondary stroke-primary" strokeWidth="1" />
          <circle cx="105" cy="60" r="4" className="fill-secondary stroke-primary" strokeWidth="1" />
        </svg>

        {/* Glow effect */}
        <div className="absolute inset-0 blur-xl bg-primary/20 -z-10" />
      </div>

      {/* Floating particles */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-primary rounded-full animate-pulse"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
            animationDelay: `${i * 0.2}s`,
            opacity: 0.4 + Math.random() * 0.4
          }}
        />
      ))}

      {/* Scan beam from drone */}
      <div
        className="absolute w-32 h-48 bg-gradient-to-b from-primary/30 via-primary/10 to-transparent blur-sm"
        style={{
          left: `${position.x}%`,
          top: `${position.y + 5}%`,
          transform: 'translateX(-50%)',
          clipPath: 'polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)'
        }}
      />
    </div>
  )
}

export function FloatingDrone({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-16 h-12",
    md: "w-24 h-16",
    lg: "w-32 h-24"
  }

  return (
    <div className={cn("relative animate-bounce", sizeClasses[size], className)} style={{ animationDuration: '3s' }}>
      <svg
        viewBox="0 0 120 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-lg"
      >
        <ellipse cx="60" cy="40" rx="20" ry="10" className="fill-secondary stroke-primary" strokeWidth="2" />
        <circle cx="60" cy="50" r="6" className="fill-primary" />
        <circle cx="60" cy="50" r="3" className="fill-background" />
        <line x1="40" y1="35" x2="15" y2="20" className="stroke-muted-foreground" strokeWidth="3" />
        <line x1="80" y1="35" x2="105" y2="20" className="stroke-muted-foreground" strokeWidth="3" />
        <line x1="40" y1="45" x2="15" y2="60" className="stroke-muted-foreground" strokeWidth="3" />
        <line x1="80" y1="45" x2="105" y2="60" className="stroke-muted-foreground" strokeWidth="3" />
        <ellipse cx="15" cy="20" rx="12" ry="3" className="fill-primary/50 animate-pulse" />
        <ellipse cx="105" cy="20" rx="12" ry="3" className="fill-primary/50 animate-pulse" />
        <ellipse cx="15" cy="60" rx="12" ry="3" className="fill-primary/50 animate-pulse" />
        <ellipse cx="105" cy="60" rx="12" ry="3" className="fill-primary/50 animate-pulse" />
        <circle cx="15" cy="20" r="4" className="fill-secondary stroke-primary" strokeWidth="1" />
        <circle cx="105" cy="20" r="4" className="fill-secondary stroke-primary" strokeWidth="1" />
        <circle cx="15" cy="60" r="4" className="fill-secondary stroke-primary" strokeWidth="1" />
        <circle cx="105" cy="60" r="4" className="fill-secondary stroke-primary" strokeWidth="1" />
      </svg>
    </div>
  )
}
