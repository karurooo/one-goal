import { useEffect, useRef } from 'react'

export type FrameCallback = (ctx: CanvasRenderingContext2D, dt: number) => void

/**
 * Owns the canvas's DPR sizing, resize handling, and the rAF + delta-time
 * loop. `onFrame` runs once per frame with the clamped delta (seconds) and
 * a context already cleared and scaled to CSS pixels. The loop is
 * cancelled and the resize observer disconnected on unmount.
 */
export function useGameLoop(onFrame: FrameCallback) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const onFrameRef = useRef(onFrame)

  useEffect(() => {
    onFrameRef.current = onFrame
  }, [onFrame])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    function resize() {
      const dpr = window.devicePixelRatio || 1
      const { width, height } = canvas!.getBoundingClientRect()
      canvas!.width = Math.round(width * dpr)
      canvas!.height = Math.round(height * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)

    let frameId = 0
    let lastTime = performance.now()

    function frame(time: number) {
      const dt = Math.min((time - lastTime) / 1000, 1 / 30)
      lastTime = time

      const { width, height } = canvas!.getBoundingClientRect()
      ctx!.clearRect(0, 0, width, height)
      onFrameRef.current(ctx!, dt)

      frameId = requestAnimationFrame(frame)
    }
    frameId = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
    }
  }, [])

  return canvasRef
}
