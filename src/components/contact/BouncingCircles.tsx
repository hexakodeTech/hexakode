"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "../../lib/utils";

interface Circle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color1: string;
  color2: string;
}

export default function BouncingCircles({ isDark }: { isDark: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationFrameId: number;

    // 5 different sizes of circles (odd number)
    const radii = [100, 150, 200, 260, 320];
    
    // Premium soft glowing colors matching the HexaKode design system palette
    const colors = [
      { color1: "rgba(93, 202, 253, 0.12)", color2: "rgba(93, 202, 253, 0)" },   // Blue Glow
      { color1: "rgba(168, 85, 247, 0.10)", color2: "rgba(168, 85, 247, 0)" },   // Purple Glow
      { color1: "rgba(45, 212, 191, 0.08)", color2: "rgba(45, 212, 191, 0)" },   // Teal Glow
      { color1: "rgba(59, 130, 246, 0.09)", color2: "rgba(59, 130, 246, 0)" },   // Darker Blue
      { color1: "rgba(99, 102, 241, 0.07)", color2: "rgba(99, 102, 241, 0)" }    // Indigo Glow
    ];

    const circles: Circle[] = [];

    // Resize handler to adjust canvas dimensions and coordinate boundaries
    const handleResize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = width;
      canvas.height = height;

      // Adjust circle positions on resize to keep them within boundaries
      circles.forEach((circle) => {
        if (circle.x - circle.radius < 0) circle.x = circle.radius;
        if (circle.x + circle.radius > width) circle.x = width - circle.radius;
        if (circle.y - circle.radius < 0) circle.y = circle.radius;
        if (circle.y + circle.radius > height) circle.y = height - circle.radius;
      });
    };

    // Initialize circles with velocities and initial coords
    const initCircles = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = width;
      canvas.height = height;

      for (let i = 0; i < 5; i++) {
        const radius = radii[i];
        const color = colors[i];

        // Random velocities
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.5 + Math.random() * 0.7; // Calm drifting speed (0.5 to 1.2 px/frame)
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;

        // Position within bounds
        const x = radius + Math.random() * (width - radius * 2);
        const y = radius + Math.random() * (height - radius * 2);

        circles.push({ x, y, vx, vy, radius, ...color });
      }
    };

    initCircles();
    window.addEventListener("resize", handleResize);

    // Canvas drawing and physics loop
    const updateAndDraw = () => {
      ctx.clearRect(0, 0, width, height);

      circles.forEach((circle) => {
        // Move circle
        circle.x += circle.vx;
        circle.y += circle.vy;

        // Bounce off left/right edges
        if (circle.x - circle.radius <= 0) {
          circle.vx = Math.abs(circle.vx);
          circle.x = circle.radius;
        } else if (circle.x + circle.radius >= width) {
          circle.vx = -Math.abs(circle.vx);
          circle.x = width - circle.radius;
        }

        // Bounce off top/bottom edges
        if (circle.y - circle.radius <= 0) {
          circle.vy = Math.abs(circle.vy);
          circle.y = circle.radius;
        } else if (circle.y + circle.radius >= height) {
          circle.vy = -Math.abs(circle.vy);
          circle.y = height - circle.radius;
        }

        // Create beautiful radial glow gradient for the circle
        const gradient = ctx.createRadialGradient(
          circle.x,
          circle.y,
          0,
          circle.x,
          circle.y,
          circle.radius
        );
        gradient.addColorStop(0, circle.color1);
        gradient.addColorStop(1, circle.color2);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(updateAndDraw);
    };

    updateAndDraw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        "absolute inset-0 w-full h-full pointer-events-none z-0 transition-opacity duration-1000",
        isDark ? "opacity-100" : "opacity-0"
      )}
    />
  );
}
