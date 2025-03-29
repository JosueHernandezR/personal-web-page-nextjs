"use client";

/* eslint-disable react/no-unknown-property */
import React, { useRef, useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';

interface DitherSettings {
  r: number;
  g: number;
  b: number;
  colorIntensity: number;
  waveAmplitude: number;
  waveFrequency: number;
  isAnimationEnabled: boolean;
  waveSpeed: number;
  isMouseEnabled: boolean;
  mouseRadius: number;
}

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

function DitherComponent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  
  const [settings] = useState<DitherSettings>({
    r: 0.5,
    g: 0.5,
    b: 0.5,
    colorIntensity: 9.4,
    waveAmplitude: 0.36,
    waveFrequency: 2.2,
    isAnimationEnabled: true,
    waveSpeed: 0.06,
    isMouseEnabled: true,
    mouseRadius: 0.5
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let isActive = true;
    let frameId: number | null = null;
    let startTime = Date.now();
    
    try {
      const ctx = canvas.getContext('2d', {
        alpha: true,
        desynchronized: true,
        willReadFrequently: true
      });
      
      if (!ctx) {
        throw new Error('No se pudo obtener el contexto 2D');
      }

      const initPoints = () => {
        pointsRef.current = [];
        const numPoints = 100;
        for (let i = 0; i < numPoints; i++) {
          pointsRef.current.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * settings.waveSpeed * 10,
            vy: (Math.random() - 0.5) * settings.waveSpeed * 10
          });
        }
      };

      const resize = () => {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        initPoints();
      };

      const draw = () => {
        if (!isActive || !ctx || !settings.isAnimationEnabled) return;

        const currentTime = (Date.now() - startTime) / 1000;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Configurar estilo basado en el tema
        const isDark = theme === 'dark';
        ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)';
        ctx.lineWidth = 1.5;

        for (let point of pointsRef.current) {
          point.x += point.vx + Math.sin(currentTime * settings.waveSpeed) * 0.5;
          point.y += point.vy + Math.cos(currentTime * settings.waveSpeed) * 0.5;

          if (point.x < 0 || point.x > canvas.width) {
            point.vx *= -1;
            point.x = Math.max(0, Math.min(point.x, canvas.width));
          }
          if (point.y < 0 || point.y > canvas.height) {
            point.vy *= -1;
            point.y = Math.max(0, Math.min(point.y, canvas.height));
          }

          ctx.beginPath();
          
          for (let other of pointsRef.current) {
            const dx = other.x - point.x;
            const dy = other.y - point.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < settings.waveFrequency * 150) {
              const intensity = 1 - distance / (settings.waveFrequency * 150);
              ctx.globalAlpha = intensity * 0.5;
              
              ctx.beginPath();
              ctx.moveTo(point.x, point.y);
              
              const midX = (point.x + other.x) / 2 + 
                Math.sin(currentTime * settings.waveSpeed + distance * 0.01) * settings.waveAmplitude * 20;
              const midY = (point.y + other.y) / 2 + 
                Math.cos(currentTime * settings.waveSpeed + distance * 0.01) * settings.waveAmplitude * 20;
              
              ctx.quadraticCurveTo(midX, midY, other.x, other.y);
              ctx.stroke();
            }
          }
        }

        frameId = requestAnimationFrame(draw);
      };

      const handleMouseMove = (e: MouseEvent) => {
        if (!settings.isMouseEnabled) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (canvas.height / rect.height);
        
        mouseRef.current = { x, y };

        for (let point of pointsRef.current) {
          const dx = x - point.x;
          const dy = y - point.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < settings.mouseRadius * canvas.width) {
            const force = (1 - distance / (settings.mouseRadius * canvas.width)) * 2;
            point.vx += dx * force * 0.002;
            point.vy += dy * force * 0.002;
          }
        }
      };

      canvas.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('resize', resize);
      resize();
      draw();

      return () => {
        isActive = false;
        if (frameId !== null) {
          cancelAnimationFrame(frameId);
        }
        canvas.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', resize);
      };
    } catch (err) {
      console.error('Error en la inicialización:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  }, [settings, theme]);

  if (error) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          background: theme === 'dark' ? 'rgb(18, 18, 18)' : 'rgb(255, 255, 255)',
          opacity: 0.5
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        opacity: 1,
        pointerEvents: settings.isMouseEnabled ? 'auto' : 'none',
        mixBlendMode: 'difference'
      }}
    />
  );
}

export default dynamic(() => Promise.resolve(DitherComponent), {
  ssr: false,
  loading: () => (
    <div 
      style={{ 
        backgroundColor: 'rgba(128, 128, 128, 0.1)',
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0
      }}
    />
  )
}); 