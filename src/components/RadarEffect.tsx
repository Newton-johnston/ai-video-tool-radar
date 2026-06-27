"use client";

import { useRef, useEffect, useState, useCallback } from "react";

// ---- Tool data interface (subset needed for radar) ----
export interface RadarTool {
  id: number;
  name: string;
  category: string;
  quality_score: number | null;
  speed_score: number | null;
  ease_score: number | null;
}

interface RadarPoint {
  angle: number;
  radius: number;
  size: number;
  speed: number;
  color: string;
  opacity: number;
  label: string;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  speed: number;
}

// Category color map
const CATEGORY_COLORS: Record<string, string> = {
  "Text-to-Video":     "rgba(99, 102, 241, 0.85)",   // indigo
  "Image-to-Video":    "rgba(139, 92, 246, 0.8)",    // purple
  "Video-to-Video":    "rgba(6, 182, 212, 0.8)",     // cyan
  "3D Generation":     "rgba(34, 211, 238, 0.8)",    // sky
  "Avatar & Talking Head": "rgba(236, 72, 153, 0.8)", // pink
  "Video Editing":     "rgba(59, 130, 246, 0.8)",    // blue
  "Long Video":        "rgba(168, 85, 247, 0.8)",    // violet
  "Character Animation": "rgba(245, 158, 11, 0.8)",  // amber
};

const FALLBACK_COLOR = "rgba(148, 163, 184, 0.7)"; // slate-400

function getToolColor(category: string): string {
  return CATEGORY_COLORS[category] ?? FALLBACK_COLOR;
}

// Arrange tools around the radar based on quality_score vs speed_score
function toolsToPoints(tools: RadarTool[]): RadarPoint[] {
  const maxTools = 30; // cap visible points
  const picked = tools.slice(0, maxTools);

  return picked.map((tool, i) => {
    // Distribute tools evenly, but add slight randomness
    const baseAngle = (Math.PI * 2 / picked.length) * i;
    const jitter = (Math.random() - 0.5) * 0.25;
    const angle = baseAngle + jitter;

    // radius based on quality_score (0-5) -> 0.25-0.85
    const quality = tool.quality_score ?? 2.5;
    const radius = 0.25 + (quality / 5) * 0.6;

    const size = 3 + (tool.ease_score ?? 2.5) * 0.8;

    return {
      angle,
      radius,
      size: Math.max(2.5, size),
      speed: 0.0015 + Math.random() * 0.004,
      color: getToolColor(tool.category),
      opacity: 0.55 + Math.random() * 0.35,
      label: tool.name,
    };
  });
}

interface RadarEffectProps {
  tools?: RadarTool[];
}

export default function RadarEffect({ tools }: RadarEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);

  // Init points from tools if provided, else fallback to empty
  const initialPoints = tools && tools.length > 0
    ? toolsToPoints(tools)
    : toolsToPoints([]);
  const pointsRef = useRef<RadarPoint[]>(initialPoints);
  const ripplesRef = useRef<Ripple[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const tiltRef = useRef({ x: 0, y: 0 });
  const centerRef = useRef({ x: 0, y: 0 });

  // Hover tooltip state
  const [hoveredTool, setHoveredTool] = useState<{ label: string; x: number; y: number } | null>(null);
  const hoveredRef = useRef<{ label: string; x: number; y: number } | null>(null);

  const [dimensions, setDimensions] = useState({ width: 480, height: 380 });

  // Re-generate points when tools change
  useEffect(() => {
    if (tools && tools.length > 0) {
      pointsRef.current = toolsToPoints(tools);
    }
  }, [tools]);

  // Periodically sync hovered tool from ref to state for tooltip rendering
  useEffect(() => {
    const interval = setInterval(() => {
      const current = hoveredRef.current;
      setHoveredTool((prev) => {
        if (prev?.label === current?.label) return prev;
        return current;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width: Math.floor(width), height: Math.floor(height) });
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;

      mouseRef.current.tx = x;
      mouseRef.current.ty = y;
      tiltRef.current.x = (x - cx) / cx;
      tiltRef.current.y = (y - cy) / cy;

      // Spawn ripples occasionally
      if (Math.random() < 0.15) {
        ripplesRef.current.push({
          x,
          y,
          radius: 0,
          maxRadius: 30 + Math.random() * 50,
          opacity: 0.5,
          speed: 1.5 + Math.random() * 2,
        });
      }
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    mouseRef.current.tx = centerRef.current.x;
    mouseRef.current.ty = centerRef.current.y;
    tiltRef.current.x = 0;
    tiltRef.current.y = 0;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = dimensions;
    canvas.width = width;
    canvas.height = height;

    const cx = width / 2;
    const cy = height / 2;
    centerRef.current = { x: cx, y: cy };
    const maxR = Math.min(width, height) * 0.42;

    let lastTime = performance.now();
    let scanAngle = 0;

    const draw = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      // Smooth mouse follow
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      mouseRef.current.x += (mouseRef.current.tx - mx) * 0.08;
      mouseRef.current.y += (mouseRef.current.ty - my) * 0.08;

      const tiltX = tiltRef.current.x;
      const tiltY = tiltRef.current.y;

      // Apply 3D tilt transform via canvas skew
      ctx.save();
      const skewX = tiltX * 0.1;
      const skewY = tiltY * 0.08;
      ctx.translate(cx, cy);
      ctx.transform(1, skewY, skewX, 1, 0, 0);
      ctx.translate(-cx, -cy);

      // --- Concentric rings ---
      for (let i = 1; i <= 5; i++) {
        const r = (maxR / 5) * i;
        const alpha = 0.06 + tiltX * tiltX * 0.04 + tiltY * tiltY * 0.04;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // --- Grid / cross lines ---
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI * 2 / 6) * i + tiltX * 0.15;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(
          cx + Math.cos(angle) * maxR,
          cy + Math.sin(angle) * maxR
        );
        ctx.strokeStyle = `rgba(99, 102, 241, ${0.04 + tiltX * tiltX * 0.03})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // --- Spiral / inner rings ---
      ctx.beginPath();
      ctx.arc(cx, cy, maxR * 0.2, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(139, 92, 246, ${0.08 + tiltY * tiltY * 0.05})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, maxR * 0.55, 0, Math.PI * 2);
      ctx.setLineDash([4, 8]);
      ctx.strokeStyle = `rgba(6, 182, 212, ${0.06 + tiltX * tiltX * 0.03})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
      ctx.setLineDash([]);

      // --- Scanning beam ---
      scanAngle += dt * 1.2;
      const scanAlpha = 0.12 + Math.sin(scanAngle * 2) * 0.04;

      // Draw scan wedge
      const beamWidth = 0.15;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, maxR, scanAngle - beamWidth / 2, scanAngle + beamWidth / 2);
      ctx.closePath();
      ctx.fillStyle = `rgba(99, 102, 241, ${scanAlpha})`;
      ctx.fill();
      ctx.restore();

      // --- Rotating dots (tool points) ---
      let closestDist = Infinity;
      let closestLabel = "";
      let closestX = 0;
      let closestY = 0;

      pointsRef.current.forEach((p) => {
        p.angle += p.speed * dt * 60;
        const x = cx + Math.cos(p.angle) * maxR * p.radius;
        const y = cy + Math.sin(p.angle) * maxR * p.radius;

        // Check proximity to mouse (for tooltip)
        const dx = x - mx;
        const dy = y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 30 && dist < closestDist) {
          closestDist = dist;
          closestLabel = p.label;
          closestX = x;
          closestY = y;
        }

        // Glow
        const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, p.size * 3);
        glowGradient.addColorStop(0, p.color.replace(/[\d.]+\)$/, "0.7)"));
        glowGradient.addColorStop(0.5, p.color.replace(/[\d.]+\)$/, "0.18)"));
        glowGradient.addColorStop(1, "transparent");

        ctx.beginPath();
        ctx.arc(x, y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = glowGradient;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace(/[\d.]+\)$/, `${p.opacity})`);
        ctx.fill();

        // Small label near the dot
        ctx.font = `${Math.max(8, p.size * 1.2)}px "Inter", system-ui, sans-serif`;
        ctx.fillStyle = p.color.replace(/[\d.]+\)$/, "0.65)");
        ctx.textAlign = "center";
        ctx.fillText(p.label, x, y - p.size - 6);
      });

      // Update hovered tool ref
      if (closestDist < 30) {
        hoveredRef.current = { label: closestLabel, x: closestX, y: closestY };
      } else {
        hoveredRef.current = null;
      }

      // --- Mouse-tracking glow ---
      const distToCenter = Math.sqrt(
        (mx - cx) ** 2 + (my - cy) ** 2
      );
      if (distToCenter < maxR * 1.1) {
        const glowGradient = ctx.createRadialGradient(mx, my, 0, mx, my, 60);
        glowGradient.addColorStop(0, "rgba(139, 92, 246, 0.15)");
        glowGradient.addColorStop(0.5, "rgba(99, 102, 241, 0.06)");
        glowGradient.addColorStop(1, "transparent");

        ctx.beginPath();
        ctx.arc(mx, my, 60, 0, Math.PI * 2);
        ctx.fillStyle = glowGradient;
        ctx.fill();
      }

      // --- Ripples ---
      ripplesRef.current = ripplesRef.current.filter((r) => {
        r.radius += r.speed * dt * 60;
        r.opacity -= dt * 0.8;
        if (r.opacity <= 0) return false;

        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(99, 102, 241, ${r.opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        return true;
      });

      ctx.restore(); // restore tilt transform

      // --- Center logo / icon ---
      const centerGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 45);
      centerGlow.addColorStop(0, "rgba(99, 102, 241, 0.3)");
      centerGlow.addColorStop(0.5, "rgba(139, 92, 246, 0.1)");
      centerGlow.addColorStop(1, "transparent");

      ctx.beginPath();
      ctx.arc(cx, cy, 45, 0, Math.PI * 2);
      ctx.fillStyle = centerGlow;
      ctx.fill();

      // Center circle
      ctx.beginPath();
      ctx.arc(cx, cy, 18, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(99, 102, 241, 0.25)";
      ctx.fill();
      ctx.strokeStyle = "rgba(139, 92, 246, 0.5)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Center dot
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(168, 85, 247, 0.9)";
      ctx.fill();

      // Pulse ring
      const pulseR = 18 + Math.sin(now / 1000) * 8;
      ctx.beginPath();
      ctx.arc(cx, cy, pulseR, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(99, 102, 241, ${0.15 + Math.sin(now / 1000) * 0.05})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();

      animationRef.current = requestAnimationFrame(draw);
    };

    animationRef.current = requestAnimationFrame(draw);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [dimensions]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[320px] cursor-crosshair"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ width: "100%", height: "100%" }}
      />
      {/* Tooltip overlay */}
      {hoveredTool && (
        <div
          className="absolute pointer-events-none z-10 px-3 py-1.5 rounded-lg bg-dark-900/90 border border-dark-600 text-white text-xs font-medium shadow-lg backdrop-blur-sm whitespace-nowrap transition-opacity duration-150"
          style={{
            left: hoveredTool.x + 12,
            top: hoveredTool.y - 10,
            transform: "translate(-50%, -100%)",
          }}
        >
          {hoveredTool.label}
        </div>
      )}
      {/* Legend */}
      {tools && tools.length > 0 && (
        <div className="absolute bottom-2 right-2 flex flex-wrap gap-2 text-[10px] opacity-60 pointer-events-none">
          {Object.entries(CATEGORY_COLORS).slice(0, 5).map(([cat, color]) => (
            <span key={cat} className="flex items-center gap-1">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ backgroundColor: color }}
              />
              {cat}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
