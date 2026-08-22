"use client"

import React, { useEffect, useRef } from "react"

export interface PixelCanvasProps extends React.HTMLAttributes<HTMLCanvasElement> {
  gap?: number
  speed?: number
  colors?: string[]
  variant?: "default" | "icon" | "dense"
  interactive?: boolean
}

interface Pixel {
  x: number
  y: number
  color: string
  speed: number
  size: number
  maxSize: number
  minSize: number
  sizeStep: number
  isReverse: boolean
  delay: number
  counter: number
}

export function PixelCanvas({
  gap = 8,
  speed = 30,
  colors = ["#f59e0b", "#d97706", "#fbbf24", "#78350f"],
  variant = "default",
  interactive = true,
  className = "",
  style,
  ...props
}: PixelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let pixels: Pixel[] = []
    const parent = canvas.parentElement

    let mouseX = -1000
    let mouseY = -1000
    let isMouseActive = false

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Active if cursor is within 300px of canvas boundaries
      if (x >= -300 && x <= rect.width + 300 && y >= -300 && y <= rect.height + 300) {
        mouseX = x
        mouseY = y
        isMouseActive = true
      } else {
        isMouseActive = false
      }
    }

    const handleMouseLeave = () => {
      isMouseActive = false
    }

    if (interactive) {
      window.addEventListener("mousemove", handleMouseMove, { passive: true })
      window.addEventListener("mouseleave", handleMouseLeave)
    }

    const resizeCanvas = () => {
      const rect = parent?.getBoundingClientRect() || canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = (rect.width || 300) * dpr
      canvas.height = (rect.height || 300) * dpr
      canvas.style.width = `${rect.width || 300}px`
      canvas.style.height = `${rect.height || 300}px`

      ctx.scale(dpr, dpr)
      initPixels(rect.width || 300, rect.height || 300)
    }

    const initPixels = (w: number, h: number) => {
      pixels = []
      const step = gap

      for (let x = 0; x < w; x += step) {
        for (let y = 0; y < h; y += step) {
          if (Math.random() > 0.45) continue // Aesthetic density

          const color = colors[Math.floor(Math.random() * colors.length)]
          const distToCenter = Math.hypot(x - w / 2, y - h / 2)

          pixels.push({
            x,
            y,
            color,
            speed: (Math.random() * 0.5 + 0.2) * (speed * 0.01),
            size: Math.random() * 1.5,
            maxSize: Math.random() * 2.5 + 1.2,
            minSize: 0.2,
            sizeStep: Math.random() * 0.05 + 0.02,
            isReverse: Math.random() > 0.5,
            delay: variant === "icon" ? distToCenter * 0.5 : Math.random() * 100,
            counter: 0,
          })
        }
      }
    }

    let timePrevious = performance.now()
    const timeInterval = 1000 / 60

    const render = (timeNow: number) => {
      animationFrameId = requestAnimationFrame(render)

      const timePassed = timeNow - timePrevious
      if (timePassed < timeInterval) return
      timePrevious = timeNow - (timePassed % timeInterval)

      const rect = parent?.getBoundingClientRect() || canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)

      const hoverRadius = 180 // Interactive radius around cursor

      for (let i = 0; i < pixels.length; i++) {
        const p = pixels[i]

        // Animate natural shimmer
        if (p.isReverse) {
          p.size -= p.speed
          if (p.size <= p.minSize) p.isReverse = false
        } else {
          p.size += p.speed
          if (p.size >= p.maxSize) p.isReverse = true
        }

        // Distance-based cursor interaction
        const distToMouse = isMouseActive ? Math.hypot(p.x - mouseX, p.y - mouseY) : 9999
        let activeSize = p.size * 0.75
        let activeAlpha = 0.35

        if (distToMouse < hoverRadius) {
          const factor = 1 - distToMouse / hoverRadius
          activeSize = p.size + factor * 3.0 // Grow near cursor
          activeAlpha = Math.min(0.95, 0.4 + factor * 0.55) // Brighten near cursor
        }

        ctx.fillStyle = p.color
        ctx.globalAlpha = activeAlpha
        ctx.fillRect(p.x, p.y, activeSize, activeSize)
      }
    }

    resizeCanvas()
    animationFrameId = requestAnimationFrame(render)

    const handleResize = () => resizeCanvas()
    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", handleResize)
      if (interactive) {
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [gap, speed, colors, variant, interactive])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ width: "100%", height: "100%", ...style }}
      {...props}
    />
  )
}

