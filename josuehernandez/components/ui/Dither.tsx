"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { IUniform } from 'three';
import { useTheme } from 'next-themes';

// Shader code
const shaders = {
  waveVertex: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,
  waveFragment: `
    precision highp float;
    uniform vec2 resolution;
    uniform float time;
    uniform float waveSpeed;
    uniform float waveFrequency;
    uniform float waveAmplitude;
    uniform vec3 waveColor;
    uniform vec2 mousePos;
    uniform int enableMouseInteraction;
    uniform float mouseRadius;

    vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    vec2 fade(vec2 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

    float cnoise(vec2 P) {
      vec4 Pi = floor(P.xyxy) + vec4(0.0,0.0,1.0,1.0);
      vec4 Pf = fract(P.xyxy) - vec4(0.0,0.0,1.0,1.0);
      Pi = mod289(Pi);
      vec4 ix = Pi.xzxz;
      vec4 iy = Pi.yyww;
      vec4 fx = Pf.xzxz;
      vec4 fy = Pf.yyww;
      vec4 i = permute(permute(ix) + iy);
      vec4 gx = fract(i * (1.0/41.0)) * 2.0 - 1.0;
      vec4 gy = abs(gx) - 0.5;
      vec4 tx = floor(gx + 0.5);
      gx = gx - tx;
      vec2 g00 = vec2(gx.x, gy.x);
      vec2 g10 = vec2(gx.y, gy.y);
      vec2 g01 = vec2(gx.z, gy.z);
      vec2 g11 = vec2(gx.w, gy.w);
      vec4 norm = taylorInvSqrt(vec4(dot(g00,g00), dot(g01,g01), dot(g10,g10), dot(g11,g11)));
      g00 *= norm.x; g01 *= norm.y; g10 *= norm.z; g11 *= norm.w;
      float n00 = dot(g00, vec2(fx.x, fy.x));
      float n10 = dot(g10, vec2(fx.y, fy.y));
      float n01 = dot(g01, vec2(fx.z, fy.z));
      float n11 = dot(g11, vec2(fx.w, fy.w));
      vec2 fade_xy = fade(Pf.xy);
      vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
      return 2.3 * mix(n_x.x, n_x.y, fade_xy.y);
    }

    const int OCTAVES = 8;
    float fbm(vec2 p) {
      float value = 0.0;
      float amp = 1.0;
      float freq = waveFrequency;
      for (int i = 0; i < OCTAVES; i++) {
        value += amp * abs(cnoise(p));
        p *= freq;
        amp *= waveAmplitude;
      }
      return value;
    }

    float pattern(vec2 p) {
      vec2 p2 = p - time * waveSpeed;
      return fbm(p - fbm(p + fbm(p2)));
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / resolution.xy;
      uv -= 0.5;
      uv.x *= resolution.x / resolution.y;
      float f = pattern(uv);
      if (enableMouseInteraction == 1) {
        vec2 mouseNDC = (mousePos / resolution - 0.5) * vec2(1.0, -1.0);
        mouseNDC.x *= resolution.x / resolution.y;
        float dist = length(uv - mouseNDC);
        float effect = 1.0 - smoothstep(0.0, mouseRadius, dist);
        f -= 0.5 * effect;
      }
      vec3 col = mix(vec3(0.0), waveColor, f);
      gl_FragColor = vec4(col, 1.0);
    }`,
  ditherVertex: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,
  ditherFragment: `
    varying vec2 vUv;
    uniform sampler2D tDiffuse;
    uniform float colorNum;
    uniform float pixelSize;
    uniform vec2 resolution;

    void main() {
      vec2 dxy = pixelSize / resolution;
      vec2 coord = dxy * floor(vUv / dxy);
      vec4 color = texture2D(tDiffuse, coord);
      
      float gray = 0.299 * color.r + 0.587 * color.g + 0.114 * color.b;
      float posterized = floor(gray * colorNum) / colorNum;
      
      // Aplicar dithering con matriz de Bayer 4x4
      float threshold = 0.0;
      vec2 bayerCoord = mod(gl_FragCoord.xy, 4.0);
      int bayerIndex = int(bayerCoord.x) + int(bayerCoord.y) * 4;
      
      if (bayerIndex == 0) threshold = 0.0/16.0;
      else if (bayerIndex == 1) threshold = 8.0/16.0;
      else if (bayerIndex == 2) threshold = 2.0/16.0;
      else if (bayerIndex == 3) threshold = 10.0/16.0;
      else if (bayerIndex == 4) threshold = 12.0/16.0;
      else if (bayerIndex == 5) threshold = 4.0/16.0;
      else if (bayerIndex == 6) threshold = 14.0/16.0;
      else if (bayerIndex == 7) threshold = 6.0/16.0;
      else if (bayerIndex == 8) threshold = 3.0/16.0;
      else if (bayerIndex == 9) threshold = 11.0/16.0;
      else if (bayerIndex == 10) threshold = 1.0/16.0;
      else if (bayerIndex == 11) threshold = 9.0/16.0;
      else if (bayerIndex == 12) threshold = 15.0/16.0;
      else if (bayerIndex == 13) threshold = 7.0/16.0;
      else if (bayerIndex == 14) threshold = 13.0/16.0;
      else threshold = 5.0/16.0;
      
      float dither = 1.0 / colorNum * threshold;
      float finalColor = posterized + dither;
      
      gl_FragColor = vec4(finalColor, finalColor, finalColor, 1.0);
    }`
};

// Definir interfaces para los uniforms
interface WaveUniforms {
  time: { value: number };
  resolution: { value: THREE.Vector2 };
  waveSpeed: { value: number };
  waveFrequency: { value: number };
  waveAmplitude: { value: number };
  waveColor: { value: THREE.Color };
  mousePos: { value: THREE.Vector2 };
  enableMouseInteraction: { value: number };
  mouseRadius: { value: number };
  [uniform: string]: IUniform<unknown>;
}

interface DitherUniforms {
  tDiffuse: { value: THREE.Texture | null };
  colorNum: { value: number };
  pixelSize: { value: number };
  resolution: { value: THREE.Vector2 };
  [uniform: string]: IUniform<unknown>;
}

interface Props {
  waveSpeed?: number;
  waveFrequency?: number;
  waveAmplitude?: number;
  colorNum?: number;
  pixelSize?: number;
  enableMouseInteraction?: boolean;
  mouseRadius?: number;
}

const DitheredWaves: React.FC<Props> = ({ 
  waveSpeed = 0.05,
  waveFrequency = 3,
  waveAmplitude = 0.3,
  colorNum = 4,
  pixelSize = 4,
  enableMouseInteraction = true,
  mouseRadius = 1
}) => {
  // Usa el hook de tema para adaptarse al modo claro/oscuro
  const { resolvedTheme } = useTheme();
  
  // Colores optimizados para cada tema
  const getThemeColor = () => {
    if (resolvedTheme === "dark") {
      return new THREE.Color(0x4a9eff); // Azul brillante para tema oscuro
    } else {
      return new THREE.Color(0xaed6f1); // Azul muy suave para tema claro que se ve bien con fondo blanco
    }
  };
  
  // Obtener el color basado en el tema actual
  const themeColor = getThemeColor();
  
  // Referencia para el color actual
  const currentColorRef = useRef(themeColor);
  
  // Actualizar el color de referencia cuando cambia el tema
  useEffect(() => {
    currentColorRef.current = themeColor;
  }, [themeColor, resolvedTheme]);
  
  // Para el dithering, en el código original se usa el valor colorNum directamente
  // como valor de cuantización, no como intensidad de color
  const actualColorNum = Math.max(Math.min(colorNum, 24), 2);
  
  // Para pixelSize, debemos asegurarnos de que sea un valor razonable
  const actualPixelSize = Math.max(Math.min(pixelSize, 10), 1);
  
  // Create refs
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const clockRef = useRef(new THREE.Clock());
  const mousePosRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | null>(null);
  
  // Wave uniforms and render target refs
  const waveUniformsRef = useRef<WaveUniforms | null>(null);
  const ditherUniformsRef = useRef<DitherUniforms | null>(null);
  const renderTargetRef = useRef<THREE.WebGLRenderTarget | null>(null);
  const postSceneRef = useRef<THREE.Scene | null>(null);
  const postCameraRef = useRef<THREE.OrthographicCamera | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Handle mouse movement
    const handleMouseMove = (event: MouseEvent) => {
      if (!enableMouseInteraction || !rendererRef.current) return;
      
      const rect = rendererRef.current.domElement.getBoundingClientRect();
      const dpr = window.devicePixelRatio;
      
      mousePosRef.current = {
        x: (event.clientX - rect.left) * dpr,
        y: (event.clientY - rect.top) * dpr
      };
    };
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current) return;
      
      const width = Math.max(containerRef.current.clientWidth, 1);
      const height = Math.max(containerRef.current.clientHeight, 1);
      const dpr = window.devicePixelRatio;
      
      rendererRef.current.setSize(width, height);
      
      if (waveUniformsRef.current && waveUniformsRef.current.resolution) {
        waveUniformsRef.current.resolution.value.set(width * dpr, height * dpr);
      }
      
      if (ditherUniformsRef.current && ditherUniformsRef.current.resolution) {
        ditherUniformsRef.current.resolution.value.set(width * dpr, height * dpr);
      }
      
      if (renderTargetRef.current) {
        renderTargetRef.current.setSize(Math.max(width * dpr, 1), Math.max(height * dpr, 1));
      }
    };
    
    // Use a timeout to ensure the container has proper dimensions
    const timeoutId = setTimeout(() => {
      // Initialize
      const init = () => {
        const container = containerRef.current;
        if (!container) return;
        
        const width = Math.max(container.clientWidth, 1);
        const height = Math.max(container.clientHeight, 1);
        const dpr = Math.min(window.devicePixelRatio, 2); // Limitar DPR para mejorar rendimiento
        
        // Create renderer
        const renderer = new THREE.WebGLRenderer({ 
          antialias: true,
          alpha: true // Usar alpha para mejor integración con el fondo
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(dpr);
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;
        
        // Create scenes and cameras
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
        camera.position.z = 1;
        sceneRef.current = scene;
        cameraRef.current = camera;
        
        // Wave uniforms
        const waveUniforms: WaveUniforms = {
          time: { value: 0 },
          resolution: { value: new THREE.Vector2(width * dpr, height * dpr) },
          waveSpeed: { value: waveSpeed },
          waveFrequency: { value: waveFrequency },
          waveAmplitude: { value: waveAmplitude },
          waveColor: { value: new THREE.Color(themeColor.r, themeColor.g, themeColor.b) },
          mousePos: { value: new THREE.Vector2(0, 0) },
          enableMouseInteraction: { value: enableMouseInteraction ? 1 : 0 },
          mouseRadius: { value: mouseRadius }
        };
        waveUniformsRef.current = waveUniforms;
        
        // Create wave mesh
        const geometry = new THREE.PlaneGeometry(2, 2);
        const material = new THREE.ShaderMaterial({
          vertexShader: shaders.waveVertex,
          fragmentShader: shaders.waveFragment,
          uniforms: waveUniforms
        });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        
        // Setup render target
        const renderTarget = new THREE.WebGLRenderTarget(
          Math.max(width * dpr, 1),
          Math.max(height * dpr, 1),
          {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat,
            stencilBuffer: false,
            depthBuffer: false
          }
        );
        renderTargetRef.current = renderTarget;
        
        // Setup dithering pass
        const ditherUniforms: DitherUniforms = {
          tDiffuse: { value: null },
          colorNum: { value: actualColorNum },
          pixelSize: { value: actualPixelSize },
          resolution: { value: new THREE.Vector2(width * dpr, height * dpr) }
        };
        ditherUniformsRef.current = ditherUniforms;
        
        // Post-processing scene setup
        const postScene = new THREE.Scene();
        const postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const postMaterial = new THREE.ShaderMaterial({
          vertexShader: shaders.ditherVertex,
          fragmentShader: shaders.ditherFragment,
          uniforms: ditherUniforms
        });
        const postQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), postMaterial);
        postScene.add(postQuad);
        postSceneRef.current = postScene;
        postCameraRef.current = postCamera;
        
        // Event listeners
        renderer.domElement.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', handleResize);
      };
      
      // Animation loop
      const animate = () => {
        if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;
        
        // Update uniforms
        if (waveUniformsRef.current) {
          waveUniformsRef.current.time.value = clockRef.current.getElapsedTime();
          waveUniformsRef.current.waveSpeed.value = waveSpeed;
          waveUniformsRef.current.waveFrequency.value = waveFrequency;
          waveUniformsRef.current.waveAmplitude.value = waveAmplitude;
          
          // Suavizar la transición del color cuando cambia el tema
          const currentColor = currentColorRef.current;
          if (waveUniformsRef.current.waveColor.value) {
            const currentR = waveUniformsRef.current.waveColor.value.r;
            const currentG = waveUniformsRef.current.waveColor.value.g;
            const currentB = waveUniformsRef.current.waveColor.value.b;
            
            // Interpolar suavemente hacia el nuevo color (0.05 es la velocidad de transición)
            const newR = currentR + (currentColor.r - currentR) * 0.05;
            const newG = currentG + (currentColor.g - currentG) * 0.05;
            const newB = currentB + (currentColor.b - currentB) * 0.05;
            
            waveUniformsRef.current.waveColor.value.set(newR, newG, newB);
          }
          
          waveUniformsRef.current.enableMouseInteraction.value = enableMouseInteraction ? 1 : 0;
          waveUniformsRef.current.mouseRadius.value = mouseRadius;
          
          if (enableMouseInteraction) {
            waveUniformsRef.current.mousePos.value.set(
              mousePosRef.current.x,
              mousePosRef.current.y
            );
          }
        }
        
        if (ditherUniformsRef.current) {
          ditherUniformsRef.current.colorNum.value = actualColorNum;
          ditherUniformsRef.current.pixelSize.value = actualPixelSize;
        }
        
        // Render wave scene to render target
        rendererRef.current.setRenderTarget(renderTargetRef.current);
        rendererRef.current.render(sceneRef.current, cameraRef.current);
        
        // Apply dithering effect
        if (ditherUniformsRef.current && renderTargetRef.current) {
          ditherUniformsRef.current.tDiffuse.value = renderTargetRef.current.texture;
        }
        
        rendererRef.current.setRenderTarget(null);
        if (postSceneRef.current && postCameraRef.current) {
          rendererRef.current.render(postSceneRef.current, postCameraRef.current);
        }
        
        // Request next frame
        animationFrameRef.current = requestAnimationFrame(animate);
      };
      
      // Initialize scene
      init();
      
      // Start animation loop
      animate();
    }, 100); // Short delay to ensure DOM is fully initialized
    
    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (rendererRef.current) {
        rendererRef.current.domElement.removeEventListener('mousemove', handleMouseMove);
        rendererRef.current.dispose();
        if (containerRef.current && containerRef.current.contains(rendererRef.current.domElement)) {
          containerRef.current.removeChild(rendererRef.current.domElement);
        }
      }
      
      window.removeEventListener('resize', handleResize);
      
      if (renderTargetRef.current) {
        renderTargetRef.current.dispose();
      }
    };
  }, [waveSpeed, waveFrequency, waveAmplitude, themeColor, actualColorNum, actualPixelSize, enableMouseInteraction, mouseRadius, resolvedTheme]);
  
  return (
    <div ref={containerRef} className="w-full h-full" style={{ minHeight: '100px', minWidth: '100px' }} />
  );
};

export default DitheredWaves;
