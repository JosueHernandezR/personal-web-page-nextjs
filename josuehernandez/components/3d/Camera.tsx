"use client";
import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const CameraBlueprint = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Verificar que el componente esté montado
    if (!mountRef.current) return;

    // CONFIGURACIÓN BÁSICA
    const currentMount = mountRef.current;
    const scene = new THREE.Scene();

    // Color de fondo blueprint profesional
    scene.background = new THREE.Color(0x0a305c);

    // Configuración de cámara para vista óptima
    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(6, 3, 9); // Posición ajustada para mejor vista de detalles
    camera.lookAt(0, 0, 0);

    // Configuración del renderer optimizada para líneas finas
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // FUNCIONES PARA CREAR LOS COMPONENTES DE LA CÁMARA
    
    // Función para crear el cuerpo con bordes CURVOS (no esferas en esquinas)
    const createCameraBody = () => {
      const bodyGroup = new THREE.Group();

      // 1. Cuerpo principal con BORDES CURVOS (no esferas en esquinas)
      const createMainBody = () => {
        const mainBodyGroup = new THREE.Group();
        
        // Dimensiones del cuerpo
        const width = 4.4;
        const height = 2.4;
        const depth = 1.5;
        
        // Crear las caras principales
        const frontMaterial = new THREE.MeshBasicMaterial({ 
          color: 0xff0000, wireframe: true, transparent: true, opacity: 0.4, side: THREE.DoubleSide 
        });
        const backMaterial = new THREE.MeshBasicMaterial({ 
          color: 0x00ff00, wireframe: true, transparent: true, opacity: 0.4, side: THREE.DoubleSide 
        });
        const topMaterial = new THREE.MeshBasicMaterial({ 
          color: 0x0000ff, wireframe: true, transparent: true, opacity: 0.4, side: THREE.DoubleSide 
        });
        const bottomMaterial = new THREE.MeshBasicMaterial({ 
          color: 0xffff00, wireframe: true, transparent: true, opacity: 0.4, side: THREE.DoubleSide 
        });
        const leftMaterial = new THREE.MeshBasicMaterial({ 
          color: 0xff00ff, wireframe: true, transparent: true, opacity: 0.4, side: THREE.DoubleSide 
        });
        const rightMaterial = new THREE.MeshBasicMaterial({ 
          color: 0x00ffff, wireframe: true, transparent: true, opacity: 0.4, side: THREE.DoubleSide 
        });
        
        // Crear las caras como planos
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        const halfDepth = depth / 2;
        
        // Cara frontal (roja)
        const frontGeometry = new THREE.PlaneGeometry(width, height);
        const frontFace = new THREE.Mesh(frontGeometry, frontMaterial);
        frontFace.position.set(0, 0, -halfDepth);
        
        // Cara trasera (verde)
        const backGeometry = new THREE.PlaneGeometry(width, height);
        const backFace = new THREE.Mesh(backGeometry, backMaterial);
        backFace.position.set(0, 0, halfDepth);
        backFace.rotation.y = Math.PI;
        
        // Cara superior (azul)
        const topGeometry = new THREE.PlaneGeometry(width, depth);
        const topFace = new THREE.Mesh(topGeometry, topMaterial);
        topFace.position.set(0, halfHeight, 0);
        topFace.rotation.x = -Math.PI / 2;
        
        // Cara inferior (amarilla)
        const bottomGeometry = new THREE.PlaneGeometry(width, depth);
        const bottomFace = new THREE.Mesh(bottomGeometry, bottomMaterial);
        bottomFace.position.set(0, -halfHeight, 0);
        bottomFace.rotation.x = Math.PI / 2;
        
        // Cara izquierda (magenta)
        const leftGeometry = new THREE.PlaneGeometry(depth, height);
        const leftFace = new THREE.Mesh(leftGeometry, leftMaterial);
        leftFace.position.set(-halfWidth, 0, 0);
        leftFace.rotation.y = Math.PI / 2;
        
        // Cara derecha (cian)
        const rightGeometry = new THREE.PlaneGeometry(depth, height);
        const rightFace = new THREE.Mesh(rightGeometry, rightMaterial);
        rightFace.position.set(halfWidth, 0, 0);
        rightFace.rotation.y = -Math.PI / 2;
        
        // Añadir caras al grupo
        mainBodyGroup.add(frontFace);
        mainBodyGroup.add(backFace);
        mainBodyGroup.add(topFace);
        mainBodyGroup.add(bottomFace);
        mainBodyGroup.add(leftFace);
        mainBodyGroup.add(rightFace);
        
        // CREAR BORDES CURVOS - Esta es la parte crucial
        const createCurvedEdge = (
          startPos: number[],
          endPos: number[],
          controlPoint: number[],
          color: number
        ) => {
          // Crear una curva Bezier cuadrática
          const curve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(...startPos),
            new THREE.Vector3(...controlPoint),
            new THREE.Vector3(...endPos)
          );
          
          // Obtener puntos de la curva
          const points = curve.getPoints(10);
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          const material = new THREE.LineBasicMaterial({ 
            color, transparent: true, opacity: 0.7 
          });
          
          return new THREE.Line(geometry, material);
        };
        
        // Definir los bordes curvos - 12 bordes en total
        const edgeData = [
          // Bordes frontales (cara roja)
          {
            start: [-halfWidth, -halfHeight, -halfDepth],
            end: [halfWidth, -halfHeight, -halfDepth],
            control: [0, -halfHeight - 0.1, -halfDepth - 0.1],
            color: 0xff6666
          },
          {
            start: [halfWidth, -halfHeight, -halfDepth],
            end: [halfWidth, halfHeight, -halfDepth],
            control: [halfWidth + 0.1, 0, -halfDepth - 0.1],
            color: 0xff6666
          },
          {
            start: [halfWidth, halfHeight, -halfDepth],
            end: [-halfWidth, halfHeight, -halfDepth],
            control: [0, halfHeight + 0.1, -halfDepth - 0.1],
            color: 0xff6666
          },
          {
            start: [-halfWidth, halfHeight, -halfDepth],
            end: [-halfWidth, -halfHeight, -halfDepth],
            control: [-halfWidth - 0.1, 0, -halfDepth - 0.1],
            color: 0xff6666
          },
          
          // Bordes traseros (cara verde)
          {
            start: [-halfWidth, -halfHeight, halfDepth],
            end: [halfWidth, -halfHeight, halfDepth],
            control: [0, -halfHeight - 0.1, halfDepth + 0.1],
            color: 0x66ff66
          },
          {
            start: [halfWidth, -halfHeight, halfDepth],
            end: [halfWidth, halfHeight, halfDepth],
            control: [halfWidth + 0.1, 0, halfDepth + 0.1],
            color: 0x66ff66
          },
          {
            start: [halfWidth, halfHeight, halfDepth],
            end: [-halfWidth, halfHeight, halfDepth],
            control: [0, halfHeight + 0.1, halfDepth + 0.1],
            color: 0x66ff66
          },
          {
            start: [-halfWidth, halfHeight, halfDepth],
            end: [-halfWidth, -halfHeight, halfDepth],
            control: [-halfWidth - 0.1, 0, halfDepth + 0.1],
            color: 0x66ff66
          },
          
          // Conectores frontales a traseros
          {
            start: [-halfWidth, -halfHeight, -halfDepth],
            end: [-halfWidth, -halfHeight, halfDepth],
            control: [-halfWidth - 0.1, -halfHeight - 0.1, 0],
            color: 0xaaaaff
          },
          {
            start: [halfWidth, -halfHeight, -halfDepth],
            end: [halfWidth, -halfHeight, halfDepth],
            control: [halfWidth + 0.1, -halfHeight - 0.1, 0],
            color: 0xaaaaff
          },
          {
            start: [halfWidth, halfHeight, -halfDepth],
            end: [halfWidth, halfHeight, halfDepth],
            control: [halfWidth + 0.1, halfHeight + 0.1, 0],
            color: 0xaaaaff
          },
          {
            start: [-halfWidth, halfHeight, -halfDepth],
            end: [-halfWidth, halfHeight, halfDepth],
            control: [-halfWidth - 0.1, halfHeight + 0.1, 0],
            color: 0xaaaaff
          }
        ];
        
        // Crear y añadir todos los bordes curvos
        edgeData.forEach(edge => {
          mainBodyGroup.add(createCurvedEdge(edge.start, edge.end, edge.control, edge.color));
        });
        
        return mainBodyGroup;
      };

      // 2. Pantalla LCD en la parte TRASERA
      const createBackLCD = () => {
        const lcdGroup = new THREE.Group();
        
        // Dimensiones
        const lcdWidth = 1.8;
        const lcdHeight = 1.2;
        const lcdDepth = 0.1;
        
        // Crear una pantalla con bordes redondeados usando curvas
        const shape = new THREE.Shape();
        const radius = 0.2; // Radio de curva para las esquinas
        
        // Dibujar un rectángulo con esquinas curvas
        shape.moveTo(-lcdWidth/2 + radius, -lcdHeight/2);
        shape.lineTo(lcdWidth/2 - radius, -lcdHeight/2);
        shape.quadraticCurveTo(lcdWidth/2, -lcdHeight/2, lcdWidth/2, -lcdHeight/2 + radius);
        shape.lineTo(lcdWidth/2, lcdHeight/2 - radius);
        shape.quadraticCurveTo(lcdWidth/2, lcdHeight/2, lcdWidth/2 - radius, lcdHeight/2);
        shape.lineTo(-lcdWidth/2 + radius, lcdHeight/2);
        shape.quadraticCurveTo(-lcdWidth/2, lcdHeight/2, -lcdWidth/2, lcdHeight/2 - radius);
        shape.lineTo(-lcdWidth/2, -lcdHeight/2 + radius);
        shape.quadraticCurveTo(-lcdWidth/2, -lcdHeight/2, -lcdWidth/2 + radius, -lcdHeight/2);
        
        const extrudeSettings = {
          depth: lcdDepth,
          bevelEnabled: false
        };
        
        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const material = new THREE.MeshBasicMaterial({
          color: 0x88ccff,
          wireframe: true,
          transparent: true,
          opacity: 0.6
        });
        
        const lcdMesh = new THREE.Mesh(geometry, material);
        lcdMesh.position.set(0, 0, 0.75 - lcdDepth/2);
        
        // Líneas para simular texto en la pantalla
        for (let i = 0; i < 3; i++) {
          const lineGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(-lcdWidth/2 + 0.2, lcdHeight/2 - 0.2 - i * 0.3, lcdDepth + 0.01),
            new THREE.Vector3(lcdWidth/2 - 0.2, lcdHeight/2 - 0.2 - i * 0.3, lcdDepth + 0.01)
          ]);
          
          const line = new THREE.Line(
            lineGeometry,
            new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.8, transparent: true })
          );
          
          lcdGroup.add(line);
        }
        
        lcdGroup.add(lcdMesh);
        return lcdGroup;
      };

      // 3. Crear diales correctamente posicionados
      const createDials = () => {
        const dialGroup = new THREE.Group();
        
        // Posiciones correctas de los diales en la parte superior
        const dialPositions = [
          { x: -1.5, y: 1.21, z: 0, radius: 0.3, height: 0.1, color: 0xff55aa }, // Dial izquierdo
          { x: -0.6, y: 1.21, z: -0.2, radius: 0.25, height: 0.08, color: 0x55aaff }, // Dial central
          { x: 0.4, y: 1.21, z: -0.3, radius: 0.2, height: 0.05, color: 0xaaff55 }, // Dial pequeño
          { x: 1.0, y: 1.21, z: 0.2, radius: 0.28, height: 0.12, color: 0xffaa55 }, // Dial derecho
        ];
        
        dialPositions.forEach(pos => {
          // Crear un cilindro para el dial
          const geometry = new THREE.CylinderGeometry(pos.radius, pos.radius, pos.height, 24);
          const material = new THREE.MeshBasicMaterial({
            color: pos.color,
            wireframe: true,
            transparent: true,
            opacity: 0.7
          });
          
          const dial = new THREE.Mesh(geometry, material);
          dial.position.set(pos.x, pos.y, pos.z);
          
          // Los cilindros están alineados con el eje Y por defecto, que es lo que queremos
          
          // Añadir detalles al dial
          const topGeometry = new THREE.CircleGeometry(pos.radius * 0.8, 16);
          const topMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true,
            transparent: true,
            opacity: 0.5
          });
          
          const topCircle = new THREE.Mesh(topGeometry, topMaterial);
          topCircle.position.set(0, pos.height/2 + 0.001, 0);
          topCircle.rotation.x = -Math.PI/2;
          
          dial.add(topCircle);
          dialGroup.add(dial);
        });
        
        // Añadir la zapata para flash (hotshoe)
        const hotshoeGeometry = new THREE.BoxGeometry(0.7, 0.05, 0.6);
        const hotshoeMaterial = new THREE.MeshBasicMaterial({
          color: 0x66ccff,
          wireframe: true,
          transparent: true,
          opacity: 0.6
        });
        
        const hotshoe = new THREE.Mesh(hotshoeGeometry, hotshoeMaterial);
        hotshoe.position.set(0, 1.25, 0);
        dialGroup.add(hotshoe);
        
        // Añadir el visor
        const viewfinderGeometry = new THREE.BoxGeometry(0.8, 0.5, 0.8);
        const viewfinderMaterial = new THREE.MeshBasicMaterial({
          color: 0xcc66ff,
          wireframe: true,
          transparent: true,
          opacity: 0.7
        });
        
        const viewfinder = new THREE.Mesh(viewfinderGeometry, viewfinderMaterial);
        viewfinder.position.set(0, 1.5, 0.3);
        dialGroup.add(viewfinder);
        
        return dialGroup;
      };

      // Ensamblar todas las partes
      const mainBody = createMainBody();
      const backLCD = createBackLCD();
      const dials = createDials();
      
      bodyGroup.add(mainBody);
      bodyGroup.add(backLCD);
      bodyGroup.add(dials);
      
      return bodyGroup;
    };
    
    // Función para crear el lente con anillos correctamente orientados
    const createCameraLens = () => {
      const lensGroup = new THREE.Group();

      // Crear el cuerpo principal del lente (3 secciones)
      const createLensBody = () => {
        const lensBodyGroup = new THREE.Group();
        
        // Dimensiones del lente
        const lensRadius = 0.95;
        const sectionLength = 0.65;
        
        // Sección 1 (frontal) - Celeste
        const section1Geometry = new THREE.CylinderGeometry(
          lensRadius,
          lensRadius,
          sectionLength,
          32,
          1,
          true // Abierto para ver el interior
        );
        const section1Material = new THREE.MeshBasicMaterial({
          color: 0x00e5ff, // Celeste
          wireframe: true,
          transparent: true,
          opacity: 0.5
        });
        const section1Mesh = new THREE.Mesh(section1Geometry, section1Material);
        section1Mesh.rotation.x = Math.PI / 2; // Rotación para que el eje apunte hacia Z
        section1Mesh.position.set(0, 0, -2.4);
        
        // Sección 2 (media) - Morado
        const section2Geometry = new THREE.CylinderGeometry(
          lensRadius,
          lensRadius,
          sectionLength,
          32,
          1,
          true
        );
        const section2Material = new THREE.MeshBasicMaterial({
          color: 0x9c27b0, // Morado
          wireframe: true,
          transparent: true,
          opacity: 0.5
        });
        const section2Mesh = new THREE.Mesh(section2Geometry, section2Material);
        section2Mesh.rotation.x = Math.PI / 2;
        section2Mesh.position.set(0, 0, -1.75);
        
        // Sección 3 (trasera) - Naranja
        const section3Geometry = new THREE.CylinderGeometry(
          lensRadius,
          lensRadius * 1.05,
          sectionLength,
          32,
          1,
          true
        );
        const section3Material = new THREE.MeshBasicMaterial({
          color: 0xff9800, // Naranja
          wireframe: true,
          transparent: true,
          opacity: 0.5
        });
        const section3Mesh = new THREE.Mesh(section3Geometry, section3Material);
        section3Mesh.rotation.x = Math.PI / 2;
        section3Mesh.position.set(0, 0, -1.1);
        
        // Añadir las secciones al grupo
        lensBodyGroup.add(section1Mesh);
        lensBodyGroup.add(section2Mesh);
        lensBodyGroup.add(section3Mesh);
        
        // Añadir bordes para las secciones
        const createEdges = (
          geometry: THREE.CylinderGeometry,
          position: THREE.Vector3
        ) => {
          const edges = new THREE.EdgesGeometry(geometry);
          const line = new THREE.LineSegments(
            edges,
            new THREE.LineBasicMaterial({ color: 0xffffff })
          );
          line.rotation.x = Math.PI / 2;
          line.position.copy(position);
          return line;
        };
        
        lensBodyGroup.add(createEdges(section1Geometry, section1Mesh.position));
        lensBodyGroup.add(createEdges(section2Geometry, section2Mesh.position));
        lensBodyGroup.add(createEdges(section3Geometry, section3Mesh.position));
        
        return lensBodyGroup;
      };
      
      // CRUCIAL: Crear los anillos verdes con la ORIENTACIÓN CORRECTA
      const createFocusRings = () => {
        const ringsGroup = new THREE.Group();
        
        // Definimos las posiciones para los anillos verdes
        // Los anillos deben estar delante del cilindro celeste
        const ringPositions = [
          { z: -2.7, radius: 0.8, width: 0.05 }, // Más alejado
          { z: -2.6, radius: 0.8, width: 0.05 }, // En medio
          { z: -2.5, radius: 0.8, width: 0.05 }, // Más cercano
        ];
        
        // Colores para los anillos (verde claro a verde oscuro)
        const ringColors = [0x76ff03, 0x64dd17, 0x33691e];
        
        // Creamos cada anillo
        ringPositions.forEach((pos, index) => {
          // IMPORTANTE: Usamos CylinderGeometry con altura muy pequeña y sin tapas
          // Esto crea un anillo (tubo fino) con la orientación correcta
          const ringGeometry = new THREE.CylinderGeometry(
            pos.radius,        // Radio superior
            pos.radius,        // Radio inferior
            pos.width,         // Altura muy pequeña
            32,                // Segmentos
            1,                 // Segmentos de altura
            true               // Abierto (sin tapas)
          );
          
          const ringMaterial = new THREE.MeshBasicMaterial({
            color: ringColors[index],
            wireframe: true,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide
          });
          
          const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
          
          // CRUCIAL: Orientación correcta - X = 90° para que el anillo mire en dirección -Z
          ringMesh.rotation.x = Math.PI / 2;
          ringMesh.position.set(0, 0, pos.z);
          
          ringsGroup.add(ringMesh);
        });
        
        return ringsGroup;
      };
      
      // Ensamblar el lente completo
      lensGroup.add(createLensBody());
      lensGroup.add(createFocusRings());
      
      return lensGroup;
    };

    // ENSAMBLAR LA CÁMARA COMPLETA
    const assembleCamera = () => {
      const cameraBody = createCameraBody();
      const cameraLens = createCameraLens();
      
      const mainGroup = new THREE.Group();
      
      // Posicionar componentes
      cameraBody.position.set(0, 0, 0);
      cameraLens.position.set(0, 0, 0);
      
      // Añadir al grupo principal
      mainGroup.add(cameraBody);
      mainGroup.add(cameraLens);
      
      // Rotación inicial
      mainGroup.rotation.x = 0.1;
      mainGroup.rotation.y = -0.7;
      
      scene.add(mainGroup);
      
      return mainGroup;
    };

    // Crear la cámara
    const blueprintModel = assembleCamera();

    // ANIMACIÓN Y CONTROLES
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    const targetRotation = { x: 0.1, y: -0.7, z: 0 };
    const currentRotation = { x: 0.1, y: -0.7, z: 0 };
    const rotationSpeed = 2.5;
    const rotationDamping = 0.15;
    let autoRotate = true;
    const autoRotationSpeed = 0.001;

    // Eventos del mouse
    const handleMouseDown = (event: MouseEvent) => {
      isDragging = true;
      previousMousePosition = {
        x: event.clientX,
        y: event.clientY,
      };
      autoRotate = false;
      event.preventDefault();
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging) return;

      const deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y,
      };

      targetRotation.x -= (deltaMove.y / 100) * rotationSpeed;
      targetRotation.y += (deltaMove.x / 100) * rotationSpeed;

      targetRotation.x = THREE.MathUtils.clamp(
        targetRotation.x,
        -Math.PI / 3,
        Math.PI / 3
      );

      previousMousePosition = {
        x: event.clientX,
        y: event.clientY,
      };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleClick = () => {
      if (!isDragging) {
        autoRotate = !autoRotate;
      }
    };

    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };

    // Añadir event listeners
    currentMount.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    currentMount.addEventListener("click", handleClick);
    currentMount.addEventListener("contextmenu", handleContextMenu);

    // Loop de animación
    const animate = () => {
      requestAnimationFrame(animate);

      if (autoRotate) {
        targetRotation.y += autoRotationSpeed;
      }

      currentRotation.x +=
        (targetRotation.x - currentRotation.x) * rotationDamping;
      currentRotation.y +=
        (targetRotation.y - currentRotation.y) * rotationDamping;
      currentRotation.z +=
        (targetRotation.z - currentRotation.z) * rotationDamping;

      // Aplicar rotaciones
      blueprintModel.rotation.x = currentRotation.x;
      blueprintModel.rotation.y = currentRotation.y;
      blueprintModel.rotation.z = currentRotation.z;

      renderer.render(scene, camera);
    };

    // Iniciar animación
    animate();

    // Manejar cambio de tamaño de la ventana
    const handleResize = () => {
      if (!currentMount) return;

      const width = currentMount.clientWidth;
      const height = currentMount.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener("resize", handleResize);

    // Limpieza al desmontar
    return () => {
      window.removeEventListener("resize", handleResize);
      currentMount.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      currentMount.removeEventListener("click", handleClick);
      currentMount.removeEventListener("contextmenu", handleContextMenu);
      
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }

      scene.traverse((object) => {
        if ("geometry" in object && object.geometry) {
          (object.geometry as THREE.BufferGeometry).dispose?.();
        }
        if ("material" in object && object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => {
              (material as THREE.Material).dispose?.();
            });
          } else {
            (object.material as THREE.Material).dispose?.();
          }
        }
      });

      renderer.dispose();
    };
  }, []); // fin del useEffect

  return <div className="w-full h-[500px]" ref={mountRef}></div>;
};

export default CameraBlueprint;