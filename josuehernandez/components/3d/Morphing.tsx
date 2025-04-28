"use client"
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface PresetParams {
  m1: number;
  n11: number;
  n12: number;
  n13: number;
  m2: number;
  n21: number;
  n22: number;
  n23: number;
}

interface ThemeColors {
  colors: string[];
  burstColor: string;
}

interface ThemeMap {
  [key: string]: ThemeColors;
}

interface AnimationState {
  presets: PresetParams[];
  themes: ThemeMap;
  themeNames: string[];
  params: {
    preset: number;
    morphDuration: number;
    pulseSpeed: number;
    pulseIntensity: number;
    microAnimationIntensity: number;
    colorTheme: string;
    burstSpeed: number;
    burstDuration: number;
    multiWave: boolean;
  };
  resolutionTheta: number;
  resolutionPhi: number;
  currentPresetParams: PresetParams | null;
  targetPresetParams: PresetParams | null;
  isMorphing: boolean;
  morphStartTime: number;
  burstActive: number;
  burstStartTime: number;
  lastBurstTime: number;
}

const SuperformulaWireframe: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef<boolean>(false);
  
  // Referencias para ThreeJS
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const clockRef = useRef<THREE.Clock | null>(null);
  const wireframeMeshRef = useRef<THREE.LineSegments | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  // Referencias para controles de mouse
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number, y: number }>({ x: 0, y: 0 });
  const targetRotationRef = useRef<{ x: number, y: number, z: number }>({ x: 0, y: 0, z: 0 });
  const currentRotationRef = useRef<{ x: number, y: number, z: number }>({ x: 0, y: 0, z: 0 });
  const autoRotateRef = useRef<boolean>(true);
  const rotationSpeed = 2.5;
  const rotationDamping = 0.15;
  const autoRotationSpeed = 0.001;

  // Estado de animación y configuración
  const stateRef = useRef<AnimationState>({
    presets: [
      { m1: 5, n11: 10, n12: 2, n13: 7, m2: 5, n21: 10, n22: 10, n23: 10 },
      { m1: 2, n11: 1, n12: 4, n13: 8, m2: 8, n21: 1, n22: 1, n23: 4 },
      { m1: 6, n11: 1, n12: 1, n13: 1, m2: 3, n21: 1, n22: 5, n23: 1 },
      { m1: 12, n11: 15, n12: 8, n13: 8, m2: 12, n21: 8, n22: 4, n23: 15 }
    ],
    themes: {
      "Synthwave": { 
        colors: ["#ff1f5a", "#ff758a", "#1e3799", "#0984e3"], 
        burstColor: "#ffffff"
      },
      "Forest": { 
        colors: ["#38ef7d", "#11998e", "#ffe259", "#ffa751"],
        burstColor: "#ffff99"
      },
      "Ocean": { 
        colors: ["#2193b0", "#38ef7d", "#00b4db", "#0083B0"],
        burstColor: "#8cffff"
      },
      "Sunset": { 
        colors: ["#FF416C", "#FF4B2B", "#f5af19", "#f12711"],
        burstColor: "#ffffa8"
      }
    },
    themeNames: ["Synthwave", "Forest", "Ocean", "Sunset"],
    params: {
      preset: 0,
      morphDuration: 2.0,
      pulseSpeed: 1.0,
      pulseIntensity: 0.2,
      microAnimationIntensity: 0.15,
      colorTheme: "Sunset", 
      burstSpeed: 0.8,
      burstDuration: 6.0,
      multiWave: true,
    },
    resolutionTheta: 100,
    resolutionPhi: 100,
    currentPresetParams: null,
    targetPresetParams: null,
    isMorphing: false,
    morphStartTime: 0,
    burstActive: 0.0,
    burstStartTime: -1.0,
    lastBurstTime: 0
  });

  // Superformula function
  const superformula = (angle: number, m: number, n1: number, n2: number, n3: number, a = 1, b = 1): number => {
    const term1 = Math.pow(Math.abs(Math.cos(m * angle / 4) / a), n2);
    const term2 = Math.pow(Math.abs(Math.sin(m * angle / 4) / b), n3);
    const sum = term1 + term2;
    if (sum === 0) return 0;
    return Math.pow(sum, -1 / n1);
  };

  // Triggerear un burst de energía
  const triggerBurst = (): void => {
    if (!clockRef.current) return;
    
    const currentTime = clockRef.current.getElapsedTime();
    const state = stateRef.current;
    
    if (currentTime - state.lastBurstTime > 0.3) {
      state.burstActive = 1.0;
      state.burstStartTime = currentTime;
      state.lastBurstTime = currentTime;
      
      if (wireframeMeshRef.current && wireframeMeshRef.current.material instanceof THREE.ShaderMaterial) {
        const theme = state.themes[state.params.colorTheme];
        const burstColor = theme.burstColor || "#ffffff";
        
        wireframeMeshRef.current.material.uniforms.burstActive.value = state.burstActive;
        wireframeMeshRef.current.material.uniforms.burstStartTime.value = state.burstStartTime;
        wireframeMeshRef.current.material.uniforms.burstColor.value.set(burstColor);
      }
    }
  };

  // Crear la geometría wireframe
  const createWireframe = (): void => {
    if (!sceneRef.current) return;
    
    const state = stateRef.current;
    const geometry = new THREE.BufferGeometry();
    const resTheta = state.resolutionTheta;
    const resPhi = state.resolutionPhi;
    const vertexCount = (resTheta + 1) * (resPhi + 1);

    const positions = new Float32Array(vertexCount * 3);
    const colors = new Float32Array(vertexCount * 3);
    const indices: number[] = [];

    for (let i = 0; i < resTheta; i++) {
        for (let j = 0; j < resPhi; j++) {
            const current = i * (resPhi + 1) + j;
            const nextTheta = (i + 1) * (resPhi + 1) + j;
            const nextPhi = current + 1;
            indices.push(current, nextTheta);
            indices.push(current, nextPhi);
        }
        indices.push(i * (resPhi + 1) + resPhi, (i + 1) * (resPhi + 1) + resPhi);
    }
    const lastRowStart = resTheta * (resPhi + 1);
    for (let j = 0; j < resPhi; j++) {
        indices.push(lastRowStart + j, lastRowStart + j + 1);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setIndex(new THREE.Uint32BufferAttribute(new Uint32Array(indices), 1));

    const material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0.0 },
            pulseSpeed: { value: state.params.pulseSpeed },
            pulseIntensity: { value: state.params.pulseIntensity },
            microAnimationIntensity: { value: state.params.microAnimationIntensity },
            dashSize: { value: 0.1 },
            dashRatio: { value: 0.5 },
            burstActive: { value: state.burstActive },
            burstStartTime: { value: state.burstStartTime },
            burstSpeed: { value: state.params.burstSpeed },
            burstDuration: { value: state.params.burstDuration },
            burstColor: { value: new THREE.Color(state.themes[state.params.colorTheme].burstColor) },
            multiWave: { value: state.params.multiWave ? 1.0 : 0.0 },
            morphProgress: { value: 0.0 }
        },
        vertexShader: `
            uniform float time;
            uniform float pulseSpeed;
            uniform float pulseIntensity;
            uniform float microAnimationIntensity;
            uniform float morphProgress;

            varying vec3 vColor;
            varying vec3 vPos;
            varying float vLineDistance;

            void main() {
                vColor = color;
                vPos = position;
                
                vLineDistance = length(position);
                
                float pulse = sin(length(position) * 2.0 - time * pulseSpeed) * pulseIntensity;
                
                float microAnim1 = sin(position.x * 8.0 + time * 3.0) * microAnimationIntensity;
                float microAnim2 = cos(position.y * 9.0 + time * 2.7) * microAnimationIntensity;
                float microAnim3 = sin(position.z * 7.0 + time * 3.3) * microAnimationIntensity;
                
                vec3 microOffset = vec3(microAnim1, microAnim2, microAnim3);
                vec3 pulseOffset = normalize(position) * pulse;
                
                microOffset *= (1.0 + morphProgress * 3.0);
                
                vec3 animatedPos = position + pulseOffset + microOffset;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(animatedPos, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform float dashSize;
            uniform float dashRatio;
            uniform float burstActive;
            uniform float burstStartTime;
            uniform float burstSpeed;
            uniform float burstDuration;
            uniform vec3 burstColor;
            uniform float multiWave;

            varying vec3 vColor;
            varying vec3 vPos;
            varying float vLineDistance;

            void main() {
                vec3 finalColor = vColor;
                float finalIntensity = 1.0;
                
                float totalSize = dashSize * (1.0 + dashRatio);
                float patternPos = mod(vLineDistance + time * 0.2, totalSize);
                float dashPart = step(patternPos, dashSize);
                
                if (dashPart < 0.1) {
                    discard;
                }
                
                finalIntensity *= (1.0 + dashPart * 0.5);
                
                if (burstActive > 0.5) {
                    float burstElapsed = max(0.0, time - burstStartTime);
                    if (burstElapsed < burstDuration) {
                        float distOrigin = length(vPos);
                        float progress = burstElapsed / burstDuration;
                        
                        float baseSpeed = burstSpeed;
                        float mainRadius = burstElapsed * baseSpeed;
                        float mainThickness = 0.4 * (1.0 - 0.5 * progress);
                        
                        float mainDist = abs(distOrigin - mainRadius);
                        float mainWave = 1.0 - smoothstep(0.0, mainThickness, mainDist);
                        
                        float trailFactor = smoothstep(0.0, mainRadius, distOrigin) * (1.0 - smoothstep(mainRadius * 0.5, mainRadius, distOrigin));
                        
                        float secondaryWave = 0.0;
                        float tertiaryWave = 0.0;
                        
                        if (multiWave > 0.5) {
                            float secondaryRadius = burstElapsed * (baseSpeed * 1.5);
                            float secondaryThickness = 0.3 * (1.0 - 0.6 * progress);
                            float secondaryDist = abs(distOrigin - secondaryRadius);
                            secondaryWave = 1.0 - smoothstep(0.0, secondaryThickness, secondaryDist);
                            secondaryWave *= 0.7 * (1.0 - progress * 0.7); 
                            
                            float tertiaryRadius = burstElapsed * (baseSpeed * 0.7);
                            float tertiaryThickness = 0.25 * (1.0 - 0.4 * progress);
                            float tertiaryDist = abs(distOrigin - tertiaryRadius);
                            tertiaryWave = 1.0 - smoothstep(0.0, tertiaryThickness, tertiaryDist);
                            tertiaryWave *= 0.5 * (1.0 - progress * 0.5); 
                        }
                        
                        vec3 waveColorShift = burstColor;
                        if (secondaryWave > 0.01) {
                            waveColorShift = mix(burstColor, vec3(0.5, 0.8, 1.0), 0.3);
                        }
                        if (tertiaryWave > 0.01) {
                            waveColorShift = mix(burstColor, vec3(0.8, 0.5, 1.0), 0.3);
                        }
                        
                        float combinedWave = max(max(mainWave, secondaryWave * 0.8), tertiaryWave * 0.6);
                        combinedWave = max(combinedWave, trailFactor * 0.4);
                        
                        float timeFade = 1.0 - smoothstep(burstDuration * 0.6, burstDuration, burstElapsed);
                        combinedWave *= timeFade;
                        
                        finalColor = mix(finalColor, waveColorShift, combinedWave * 0.8);
                        finalIntensity += combinedWave * 3.0;
                        
                        float rippleFactor = sin(distOrigin * 10.0 - burstElapsed * 5.0) * 0.5 + 0.5;
                        rippleFactor *= smoothstep(0.0, mainRadius * 0.8, distOrigin) * (1.0 - smoothstep(mainRadius * 0.8, mainRadius, distOrigin));
                        rippleFactor *= 0.15 * timeFade; 
                        
                        finalIntensity += rippleFactor;
                    }
                }

                gl_FragColor = vec4(finalColor * finalIntensity, 1.0);
            }
        `,
        vertexColors: true
    });

    wireframeMeshRef.current = new THREE.LineSegments(geometry, material);
    sceneRef.current.add(wireframeMeshRef.current);

    // Initialize preset parameters
    state.currentPresetParams = { ...state.presets[state.params.preset] };
    state.targetPresetParams = { ...state.presets[state.params.preset] };
    
    // Update the geometry initially
    updateWireframeGeometry();
    
    // Iniciar un morph automático cada 5 segundos
    setInterval(() => {
      const nextPreset = (state.params.preset + 1) % state.presets.length;
      startMorphing(nextPreset);
    }, 5000);
    
    // Iniciar un burst automático cada 8 segundos
    setInterval(() => {
      triggerBurst();
    }, 8000);
  };

  // Función para mapear valores linealmente
  const mapLinear = (x: number, a1: number, a2: number, b1: number, b2: number): number => {
    return b1 + (x - a1) * (b2 - b1) / (a2 - a1);
  };
  
  // Función para suavizar transiciones
  const smoothstep = (x: number, min: number, max: number): number => {
    if (x <= min) return 0;
    if (x >= max) return 1;
    x = (x - min) / (max - min);
    return x * x * (3 - 2 * x);
  };
  
  // Actualizar la geometría wireframe
  const updateWireframeGeometry = (): void => {
    if (!wireframeMeshRef.current) return;
    
    const state = stateRef.current;
    const geometry = wireframeMeshRef.current.geometry;
    const positions = geometry.attributes.position.array as Float32Array;
    const colors = geometry.attributes.color.array as Float32Array;
    
    const sfParams = state.isMorphing ? getInterpolatedParams() : (state.currentPresetParams as PresetParams);
    const resTheta = state.resolutionTheta;
    const resPhi = state.resolutionPhi;
    
    const theme = state.themes[state.params.colorTheme];
    const themeColors = theme.colors.map(color => new THREE.Color(color));
    
    let vertexIndex = 0;
    for (let i = 0; i <= resTheta; i++) {
        const theta = mapLinear(i, 0, resTheta, -Math.PI / 2, Math.PI / 2);
        const r1 = superformula(theta, sfParams.m1, sfParams.n11, sfParams.n12, sfParams.n13);
        
        for (let j = 0; j <= resPhi; j++) {
            const phi = mapLinear(j, 0, resPhi, -Math.PI, Math.PI);
            const r2 = superformula(phi, sfParams.m2, sfParams.n21, sfParams.n22, sfParams.n23);
            
            const x = r1 * Math.cos(theta) * r2 * Math.cos(phi);
            const y = r1 * Math.sin(theta);
            const z = r1 * Math.cos(theta) * r2 * Math.sin(phi);
            
            positions[vertexIndex * 3 + 0] = x;
            positions[vertexIndex * 3 + 1] = y;
            positions[vertexIndex * 3 + 2] = z;
            
            const colorMix = smoothstep(y, -1.5, 1.5);
            
            const colorIndex1 = Math.floor(colorMix * (themeColors.length - 1));
            const colorIndex2 = Math.min(colorIndex1 + 1, themeColors.length - 1);
            const colorFraction = (colorMix * (themeColors.length - 1)) - colorIndex1;
            
            const vertexColor = themeColors[colorIndex1].clone().lerp(
                themeColors[colorIndex2], colorFraction
            );
            
            colors[vertexIndex * 3 + 0] = vertexColor.r;
            colors[vertexIndex * 3 + 1] = vertexColor.g;
            colors[vertexIndex * 3 + 2] = vertexColor.b;
            
            vertexIndex++;
        }
    }
    
    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;
    geometry.computeBoundingSphere();
  };

  // Interpolación lineal personalizada
  const lerp = (x: number, y: number, t: number): number => {
    return (1 - t) * x + t * y;
  };

  // Interpolación de parámetros para la animación de morfing
  const getInterpolatedParams = (): PresetParams => {
    if (!clockRef.current) return stateRef.current.currentPresetParams as PresetParams;
    
    const state = stateRef.current;
    const duration = Math.max(0.001, state.params.morphDuration);
    const elapsedTime = clockRef.current.getElapsedTime() - state.morphStartTime;
    const totalProgress = Math.min(1.0, elapsedTime / duration);
    
    if (wireframeMeshRef.current && wireframeMeshRef.current.material instanceof THREE.ShaderMaterial) {
        const morphEffect = Math.sin(totalProgress * Math.PI);
        wireframeMeshRef.current.material.uniforms.morphProgress.value = morphEffect;
    }
    
    const interpolated: PresetParams = {} as PresetParams;
    for (const key in state.currentPresetParams) {
        const factor = Math.sin(totalProgress * Math.PI / 2);
        interpolated[key as keyof PresetParams] = lerp(
            state.currentPresetParams![key as keyof PresetParams], 
            state.targetPresetParams![key as keyof PresetParams], 
            factor
        );
    }
    return interpolated;
  };

  // Comenzar animación de morfing
  const startMorphing = (targetPresetIndex: number): void => {
    if (!clockRef.current) return;
    
    const state = stateRef.current;
    if (isNaN(targetPresetIndex) || targetPresetIndex < 0 || targetPresetIndex >= state.presets.length) {
        console.error("Invalid target preset index:", targetPresetIndex);
        return;
    }

    if (!state.isMorphing) {
        state.currentPresetParams = { ...state.presets[state.params.preset] };
    } else {
        state.currentPresetParams = getInterpolatedParams();
    }

    state.params.preset = targetPresetIndex; 
    state.targetPresetParams = { ...state.presets[targetPresetIndex] };
    
    state.isMorphing = true;
    state.morphStartTime = clockRef.current.getElapsedTime();
  };

  // Redimensionamiento
  const onResize = (): void => {
    if (!cameraRef.current || !rendererRef.current || !containerRef.current) return;
    
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    cameraRef.current.aspect = width / height;
    cameraRef.current.updateProjectionMatrix();
    rendererRef.current.setSize(width, height);
  };

  // Bucle de animación
  const animate = (): void => {
    if (!isInitializedRef.current || !clockRef.current || !wireframeMeshRef.current || !rendererRef.current || 
        !sceneRef.current || !cameraRef.current) {
      console.log("Animación detenida - faltan referencias", {
        isInitialized: isInitializedRef.current,
        hasClock: !!clockRef.current,
        hasWireframe: !!wireframeMeshRef.current,
        hasRenderer: !!rendererRef.current,
        hasScene: !!sceneRef.current,
        hasCamera: !!cameraRef.current,
      });
      
      // Intentar nuevamente la animación en el siguiente frame si la inicialización está en proceso
      if (containerRef.current) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
      return;
    }

    const state = stateRef.current;
    const elapsedTime = clockRef.current.getElapsedTime();

    if (state.isMorphing) {
        const morphProgress = (elapsedTime - state.morphStartTime) / Math.max(0.001, state.params.morphDuration);
        if (morphProgress >= 1.0) {
            state.isMorphing = false;
            state.currentPresetParams = { ...state.targetPresetParams! };
            updateWireframeGeometry();
        } else {
            updateWireframeGeometry();
        }
    }

    if (wireframeMeshRef.current && wireframeMeshRef.current.material instanceof THREE.ShaderMaterial) {
      wireframeMeshRef.current.material.uniforms.time.value = elapsedTime;
      wireframeMeshRef.current.material.uniforms.burstActive.value = state.burstActive;
      wireframeMeshRef.current.material.uniforms.burstStartTime.value = state.burstStartTime;

      if (state.burstActive > 0.5 && (elapsedTime - state.burstStartTime >= state.params.burstDuration)) {
          state.burstActive = 0.0;
          state.burstStartTime = -1.0;
      }
    }
    
    // Actualizar rotación con controles de mouse
    if (wireframeMeshRef.current) {
      if (autoRotateRef.current) {
        targetRotationRef.current.y += autoRotationSpeed;
      }
      
      // Aplicar suavizado a la rotación
      currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * rotationDamping;
      currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * rotationDamping;
      currentRotationRef.current.z += (targetRotationRef.current.z - currentRotationRef.current.z) * rotationDamping;
      
      // Aplicar rotación al modelo
      wireframeMeshRef.current.rotation.x = currentRotationRef.current.x;
      wireframeMeshRef.current.rotation.y = currentRotationRef.current.y;
      wireframeMeshRef.current.rotation.z = currentRotationRef.current.z;
    }

    // Renderizado básico
    try {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    } catch (error) {
      console.error("Error al renderizar:", error);
    }
    
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  // Inicialización
  useEffect(() => {
    if (!containerRef.current || isInitializedRef.current) return;
    
    console.log("Inicializando Three.js en el contenedor", containerRef.current);
    
    // Escena Three.js
    sceneRef.current = new THREE.Scene();
    // Fondo negro
    sceneRef.current.background = new THREE.Color("#050508");
    
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    console.log("Dimensiones del contenedor:", width, "x", height);
    
    cameraRef.current = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    cameraRef.current.position.set(0, 0, 3.5);
    cameraRef.current.lookAt(0, 0, 0);

    rendererRef.current = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true
    });
    rendererRef.current.setSize(width, height);
    rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Configuración básica del renderer
    rendererRef.current.setClearColor(0x050508, 1);
    
    // Asegurarse de limpiar el contenedor antes de añadir el canvas
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }
    
    containerRef.current.appendChild(rendererRef.current.domElement);
    console.log("Canvas Three.js añadido al DOM");

    // Añadir iluminación
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    sceneRef.current.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    sceneRef.current.add(directionalLight);

    clockRef.current = new THREE.Clock();
    
    createWireframe();
    
    window.addEventListener("resize", onResize);
    
    // Manejadores de eventos para controles de mouse
    const handleMouseDown = (event: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = {
        x: event.clientX,
        y: event.clientY,
      };
      autoRotateRef.current = false;
      event.preventDefault();
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDraggingRef.current) return;

      const deltaMove = {
        x: event.clientX - previousMousePositionRef.current.x,
        y: event.clientY - previousMousePositionRef.current.y,
      };

      targetRotationRef.current.x -= (deltaMove.y / 100) * rotationSpeed;
      targetRotationRef.current.y += (deltaMove.x / 100) * rotationSpeed;

      // Limitar la rotación vertical
      targetRotationRef.current.x = THREE.MathUtils.clamp(
        targetRotationRef.current.x,
        -Math.PI / 3,
        Math.PI / 3
      );

      previousMousePositionRef.current = {
        x: event.clientX,
        y: event.clientY,
      };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleClick = () => {
      if (!isDraggingRef.current) {
        // Si no estamos arrastrando, es un clic simple
        // Alternar autorotación
        autoRotateRef.current = !autoRotateRef.current;
        
        // También mantener el comportamiento del burst
        triggerBurst();
      }
    };

    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();

      if (!cameraRef.current) return;

      // Ajuste de posición de cámara para zoom
      const zoomSpeed = 0.5;
      const zoomDirection = event.deltaY > 0 ? 1 : -1;

      // Obtener distancia actual al origen
      const distanceVector = new THREE.Vector3(0, 0, 0).sub(cameraRef.current.position);
      const currentDistance = distanceVector.length();

      // Calcular nueva distancia
      const newDistance = THREE.MathUtils.clamp(
        currentDistance + zoomDirection * zoomSpeed,
        2, // Distancia mínima
        10 // Distancia máxima
      );

      // Aplicar nueva distancia manteniendo la dirección
      distanceVector.normalize().multiplyScalar(-newDistance);
      cameraRef.current.position.copy(distanceVector);
      cameraRef.current.lookAt(0, 0, 0);
    };
    
    // Añadir event listeners
    containerRef.current.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    containerRef.current.addEventListener("click", handleClick);
    containerRef.current.addEventListener("contextmenu", handleContextMenu);
    containerRef.current.addEventListener("wheel", handleWheel);
    
    // Importante: primero establecer la inicialización, luego iniciar el bucle de animación
    isInitializedRef.current = true;
    console.log("Inicialización completada, isInitializedRef =", isInitializedRef.current);
    
    animationFrameRef.current = requestAnimationFrame(animate);
    
    // Limpieza
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      window.removeEventListener("resize", onResize);
      
      // Eliminar event listeners de controles de mouse
      if (containerRef.current) {
        containerRef.current.removeEventListener("mousedown", handleMouseDown);
        containerRef.current.removeEventListener("click", handleClick);
        containerRef.current.removeEventListener("contextmenu", handleContextMenu);
        containerRef.current.removeEventListener("wheel", handleWheel);
      }
      
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      
      if (containerRef.current) {
        const canvas = containerRef.current.querySelector('canvas');
        if (canvas) {
          containerRef.current.removeChild(canvas);
        }
      }
      
      if (sceneRef.current && wireframeMeshRef.current) {
        sceneRef.current.remove(wireframeMeshRef.current);
      }
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  // Efecto para cambiar tema cada 7 segundos
  useEffect(() => {
    if (!isInitializedRef.current) return;
    
    const themeInterval = setInterval(() => {
      const state = stateRef.current;
      const currentThemeIndex = state.themeNames.indexOf(state.params.colorTheme);
      const nextThemeIndex = (currentThemeIndex + 1) % state.themeNames.length;
      state.params.colorTheme = state.themeNames[nextThemeIndex];
      
      updateWireframeGeometry();
      
      if (wireframeMeshRef.current && wireframeMeshRef.current.material instanceof THREE.ShaderMaterial) {
        const themeColor = state.themes[state.params.colorTheme].burstColor || "#ffffff";
        wireframeMeshRef.current.material.uniforms.burstColor.value.set(themeColor);
      }
    }, 7000);
    
    return () => {
      clearInterval(themeInterval);
    };
  }, []);

  return (
    <div className="w-full h-full relative bg-[#050508] overflow-hidden">
      <div 
        ref={containerRef} 
        className="absolute top-0 left-0 w-full h-full" 
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  );
};

// Importación de estilos globales
// Basado en el ejemplo de @techartist_ X: Puneet | Techartist
const SuperformulaWithGlobalStyles: React.FC = () => {
  return <SuperformulaWireframe />;
};

export default SuperformulaWithGlobalStyles;