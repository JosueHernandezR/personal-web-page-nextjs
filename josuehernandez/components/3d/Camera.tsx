"use client";
import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const CameraWireframe = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // BASIC CONFIGURATION
    const currentMount = mountRef.current;
    const scene = new THREE.Scene();
    
    // AJUSTE: Fondo más claro para mejor visibilidad
    scene.background = new THREE.Color(0x0c2040);
    
    // Camera configuration
    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(7, 5, 10);
    camera.lookAt(0, 0, 0);

    // Renderer with antialiasing for cleaner lines
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);
    
    // MATERIALS FOR WIREFRAME
    const wireframeMaterial = new THREE.LineBasicMaterial({
      color: 0x4080ff,
      opacity: 0.9,
      transparent: true
    });
    
    const accentWireframeMaterial = new THREE.LineBasicMaterial({
      color: 0x80ff80, // Green for accents
      opacity: 0.9,
      transparent: true
    });
    
    // Function to create detailed mesh geometries
    const createDetailedCameraMesh = () => {
      const cameraGroup = new THREE.Group();
      
      // MAIN CAMERA BODY
      const createCameraBody = () => {
        const bodyGroup = new THREE.Group();
        
        // Body dimensions
        const bodyWidth = 4.0;
        const bodyHeight = 3.0;
        const bodyDepth = 2.0;
        
        // Segmentation for greater detail
        const widthSegments = 24;
        const heightSegments = 20;
        const depthSegments = 16;
        
        // Create body geometry
        const bodyGeometry = new THREE.BoxGeometry(
          bodyWidth, bodyHeight, bodyDepth,
          widthSegments, heightSegments, depthSegments
        );
        
        // Modify vertices to create rounded shape
        const cornerRadius = 0.4;
        const positions = bodyGeometry.attributes.position;
        
        // Function to round corners
        const roundCorners = () => {
          const halfWidth = bodyWidth / 2;
          const halfHeight = bodyHeight / 2;
          const halfDepth = bodyDepth / 2;
          
          for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i);
            const z = positions.getZ(i);
            
            // Distance from center in each dimension
            const xAbs = Math.abs(x);
            const yAbs = Math.abs(y);
            const zAbs = Math.abs(z);
            
            // Check if it's a corner (close to max dimensions)
            if (xAbs > halfWidth - cornerRadius && yAbs > halfHeight - cornerRadius && zAbs > halfDepth - cornerRadius) {
              // Vector from cube corner to current vertex
              const cornerX = Math.sign(x) * (halfWidth - cornerRadius);
              const cornerY = Math.sign(y) * (halfHeight - cornerRadius);
              const cornerZ = Math.sign(z) * (halfDepth - cornerRadius);
              
              // Distance from inner corner
              const deltaX = x - cornerX;
              const deltaY = y - cornerY;
              const deltaZ = z - cornerZ;
              
              // Normalize to get a sphere at the corner
              const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);
              if (distance > 0) {
                const scale = cornerRadius / distance;
                
                // Place on spherical surface
                positions.setX(i, cornerX + deltaX * scale);
                positions.setY(i, cornerY + deltaY * scale);
                positions.setZ(i, cornerZ + deltaZ * scale);
              }
            } 
            // Round edges
            else if (xAbs > halfWidth - cornerRadius && yAbs > halfHeight - cornerRadius) {
              // Edge corners
              const cornerX = Math.sign(x) * (halfWidth - cornerRadius);
              const cornerY = Math.sign(y) * (halfHeight - cornerRadius);
              
              const deltaX = x - cornerX;
              const deltaY = y - cornerY;
              
              const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
              if (distance > 0) {
                const scale = cornerRadius / distance;
                positions.setX(i, cornerX + deltaX * scale);
                positions.setY(i, cornerY + deltaY * scale);
              }
            }
            else if (xAbs > halfWidth - cornerRadius && zAbs > halfDepth - cornerRadius) {
              const cornerX = Math.sign(x) * (halfWidth - cornerRadius);
              const cornerZ = Math.sign(z) * (halfDepth - cornerRadius);
              
              const deltaX = x - cornerX;
              const deltaZ = z - cornerZ;
              
              const distance = Math.sqrt(deltaX * deltaX + deltaZ * deltaZ);
              if (distance > 0) {
                const scale = cornerRadius / distance;
                positions.setX(i, cornerX + deltaX * scale);
                positions.setZ(i, cornerZ + deltaZ * scale);
              }
            }
            else if (yAbs > halfHeight - cornerRadius && zAbs > halfDepth - cornerRadius) {
              const cornerY = Math.sign(y) * (halfHeight - cornerRadius);
              const cornerZ = Math.sign(z) * (halfDepth - cornerRadius);
              
              const deltaY = y - cornerY;
              const deltaZ = z - cornerZ;
              
              const distance = Math.sqrt(deltaY * deltaY + deltaZ * deltaZ);
              if (distance > 0) {
                const scale = cornerRadius / distance;
                positions.setY(i, cornerY + deltaY * scale);
                positions.setZ(i, cornerZ + deltaZ * scale);
              }
            }
          }
          
          bodyGeometry.attributes.position.needsUpdate = true;
          bodyGeometry.computeVertexNormals();
        };
        
        roundCorners();
        
        // Create body wireframe
        const wireframe = new THREE.WireframeGeometry(bodyGeometry);
        const bodyWireframe = new THREE.LineSegments(wireframe, wireframeMaterial);
        bodyGroup.add(bodyWireframe);
        
        // ELIMINADA: Empuñadura removida según lo solicitado
        const createGrip = () => {
          // Devolvemos un grupo vacío para no afectar el resto del código
          return new THREE.Group();
        };
        
        // Add viewfinder and pentaprism
        const createViewfinder = () => {
          const viewfinderWidth = 2.0;
          const viewfinderHeight = 0.8;
          const viewfinderDepth = 1.0;
          
          const viewfinderGeometry = new THREE.BoxGeometry(
            viewfinderWidth, viewfinderHeight, viewfinderDepth,
            20, 10, 12
          );
          
          // Apply smoothing to corners
          const viewfinderPositions = viewfinderGeometry.attributes.position;
          const cornerRadius = 0.15;
          const halfW = viewfinderWidth / 2;
          const halfH = viewfinderHeight / 2;
          const halfD = viewfinderDepth / 2;
          
          for (let i = 0; i < viewfinderPositions.count; i++) {
            const x = viewfinderPositions.getX(i);
            const y = viewfinderPositions.getY(i);
            const z = viewfinderPositions.getZ(i);
            
            // Smooth front top to create ramp
            if (z < 0 && y > 0) {
              const slopeHeight = y / halfH;
              const zOffset = slopeHeight * halfD * 0.3;
              viewfinderPositions.setZ(i, z - zOffset);
            }
            
            // Round corners
            if (Math.abs(x) > halfW - cornerRadius && 
                Math.abs(y) > halfH - cornerRadius && 
                Math.abs(z) > halfD - cornerRadius) {
              
              const cornerX = Math.sign(x) * (halfW - cornerRadius);
              const cornerY = Math.sign(y) * (halfH - cornerRadius);
              const cornerZ = Math.sign(z) * (halfD - cornerRadius);
              
              const deltaX = x - cornerX;
              const deltaY = y - cornerY;
              const deltaZ = z - cornerZ;
              
              const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);
              if (distance > 0) {
                const scale = cornerRadius / distance;
                
                viewfinderPositions.setX(i, cornerX + deltaX * scale);
                viewfinderPositions.setY(i, cornerY + deltaY * scale);
                viewfinderPositions.setZ(i, cornerZ + deltaZ * scale);
              }
            }
          }
          
          viewfinderGeometry.attributes.position.needsUpdate = true;
          viewfinderGeometry.computeVertexNormals();
          
          const viewfinderWireframe = new THREE.LineSegments(
            new THREE.WireframeGeometry(viewfinderGeometry),
            wireframeMaterial
          );
          
          // Correct position above main body
          viewfinderWireframe.position.set(0, bodyHeight/2 + viewfinderHeight/2, 0);
          
          return viewfinderWireframe;
        };
        
        // Add rear LCD screen
        const createLCD = () => {
          const lcdWidth = bodyWidth * 0.7;
          const lcdHeight = bodyHeight * 0.5;
          const lcdDepth = 0.05;
          
          const lcdGeometry = new THREE.BoxGeometry(
            lcdWidth, lcdHeight, lcdDepth,
            16, 14, 2
          );
          
          // Round corners
          const lcdPositions = lcdGeometry.attributes.position;
          const cornerRadius = 0.1;
          
          for (let i = 0; i < lcdPositions.count; i++) {
            const x = lcdPositions.getX(i);
            const y = lcdPositions.getY(i);
            
            const halfWidth = lcdWidth / 2;
            const halfHeight = lcdHeight / 2;
            
            // Only round corners in XY plane
            if (Math.abs(x) > halfWidth - cornerRadius && Math.abs(y) > halfHeight - cornerRadius) {
              const cornerX = Math.sign(x) * (halfWidth - cornerRadius);
              const cornerY = Math.sign(y) * (halfHeight - cornerRadius);
              
              const deltaX = x - cornerX;
              const deltaY = y - cornerY;
              
              const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
              if (distance > 0) {
                const scale = cornerRadius / distance;
                
                lcdPositions.setX(i, cornerX + deltaX * scale);
                lcdPositions.setY(i, cornerY + deltaY * scale);
              }
            }
          }
          
          lcdGeometry.attributes.position.needsUpdate = true;
          
          const lcdWireframe = new THREE.LineSegments(
            new THREE.WireframeGeometry(lcdGeometry),
            wireframeMaterial
          );
          
          lcdWireframe.position.set(0, 0, bodyDepth/2 + lcdDepth/2);
          
          return lcdWireframe;
        };
        
        // Create dials oriented upward, parallel to top face
        const createDials = () => {
          const dialsGroup = new THREE.Group();
          
          // Define main dials
          const dialDefs = [
            { 
              radius: 0.4, 
              height: 0.2, 
              position: new THREE.Vector3(bodyWidth/2 - 1.0, bodyHeight/2 + 0.1, -bodyDepth/2 + 0.6), 
              segments: 24 
            },
            { 
              radius: 0.3, 
              height: 0.15, 
              position: new THREE.Vector3(bodyWidth/2 - 2.0, bodyHeight/2 + 0.08, -bodyDepth/2 + 0.6), 
              segments: 20 
            },
            { 
              radius: 0.25, 
              height: 0.12, 
              position: new THREE.Vector3(-bodyWidth/2 + 1.0, bodyHeight/2 + 0.06, -bodyDepth/2 + 0.6), 
              segments: 18 
            }
          ];
          
          // Create each dial
          dialDefs.forEach(dial => {
            const dialGeometry = new THREE.CylinderGeometry(
              dial.radius, dial.radius, dial.height, dial.segments, 2
            );
            
            const dialWireframe = new THREE.LineSegments(
              new THREE.WireframeGeometry(dialGeometry),
              wireframeMaterial
            );
            
            // Correct orientation upward
            dialWireframe.position.copy(dial.position);
            dialsGroup.add(dialWireframe);
            
            // Add detail to dial (indicator lines)
            const detailGeometry = new THREE.CircleGeometry(dial.radius * 0.8, dial.segments);
            const detail = new THREE.LineSegments(
              new THREE.EdgesGeometry(detailGeometry),
              wireframeMaterial
            );
            
            detail.rotation.x = -Math.PI/2; // Rotate to be on top face
            detail.position.y = dial.height/2 + 0.001;
            dialWireframe.add(detail);
          });
          
          // Shutter button
          const shutterRadius = 0.2;
          const shutterHeight = 0.15;
          const shutterGeometry = new THREE.CylinderGeometry(
            shutterRadius, shutterRadius, shutterHeight, 16, 2
          );
          
          const shutterButton = new THREE.LineSegments(
            new THREE.WireframeGeometry(shutterGeometry),
            wireframeMaterial
          );
          
          // Place shutter button in correct position
          shutterButton.position.set(
            bodyWidth/2 - 0.5, 
            bodyHeight/2, 
            -bodyDepth/2 + 0.5
          );
          dialsGroup.add(shutterButton);
          
          return dialsGroup;
        };
        
        // FIXED: Create lens mount with properly centered ring
        const createLensMount = () => {
          const mountRadius = 1.0;
          const mountDepth = 0.2;
          
          // Cylinder for main mount
          const mountGeometry = new THREE.CylinderGeometry(
            mountRadius, mountRadius, mountDepth, 36, 4, true
          );
          
          const mountWireframe = new THREE.LineSegments(
            new THREE.WireframeGeometry(mountGeometry),
            wireframeMaterial
          );
          
          // Orientation with main axis toward Z
          mountWireframe.rotation.x = Math.PI / 2;
          mountWireframe.position.set(0, 0, -bodyDepth/2 - mountDepth/2);
          
          // CORREGIDO: Anillos de la montura orientados correctamente hacia el frente
          const mountRingGeometry = new THREE.TorusGeometry(
            mountRadius, 0.06, 8, 48
          );
          
          const mountRingWireframe = new THREE.LineSegments(
            new THREE.WireframeGeometry(mountRingGeometry),
            wireframeMaterial
          );
          
          // Orientación correcta - paralelo a la parte frontal/trasera de la cámara
          mountRingWireframe.rotation.x = Math.PI / 2; // Gira 90 grados en el eje X para que apunte hacia el frente
          mountRingWireframe.position.z = 0;
          mountWireframe.add(mountRingWireframe);
          
          // Anillos internos de la montura
          const innerRings = [
            { radius: 0.9, thickness: 0.05, depth: 0.05 },
            { radius: 0.8, thickness: 0.03, depth: 0.1 },
            { radius: 0.7, thickness: 0.02, depth: 0.15 }
          ];
          
          innerRings.forEach(ring => {
            const ringGeometry = new THREE.TorusGeometry(
              ring.radius, ring.thickness, 8, 36
            );
            
            const ringWireframe = new THREE.LineSegments(
              new THREE.WireframeGeometry(ringGeometry),
              wireframeMaterial
            );
            
            // Orientación correcta - paralelo a la parte frontal/trasera
            ringWireframe.rotation.x = Math.PI / 2; // Gira 90 grados en el eje X
            ringWireframe.position.z = -mountDepth - ring.depth;
            mountWireframe.add(ringWireframe);
          });
          
          // Add bayonet details (locking tabs)
          const bayonetCount = 3;
          for (let i = 0; i < bayonetCount; i++) {
            const angle = (i / bayonetCount) * Math.PI * 2;
            
            const tabGeometry = new THREE.BoxGeometry(0.2, 0.05, 0.12);
            const tab = new THREE.LineSegments(
              new THREE.WireframeGeometry(tabGeometry),
              wireframeMaterial
            );
            
            tab.position.set(
              Math.sin(angle) * mountRadius * 0.85,
              Math.cos(angle) * mountRadius * 0.85,
              -mountDepth - 0.06
            );
            tab.rotation.z = angle;
            
            mountWireframe.add(tab);
          }
          
          return mountWireframe;
        };
        
        // Create hotshoe correctly positioned
        const createHotShoe = () => {
          const hsGroup = new THREE.Group();
          
          // Main base of hotshoe
          const hsWidth = 0.7;
          const hsHeight = 0.1;
          const hsDepth = 0.6;
          
          const hsGeometry = new THREE.BoxGeometry(
            hsWidth, hsHeight, hsDepth, 10, 2, 8
          );
          
          const hsWireframe = new THREE.LineSegments(
            new THREE.WireframeGeometry(hsGeometry),
            wireframeMaterial
          );
          
          // Correct position above viewfinder
          hsWireframe.position.set(0, bodyHeight/2 + 0.8, 0);
          hsGroup.add(hsWireframe);
          
          // Side rails
          const railWidth = 0.1;
          const railHeight = 0.05;
          const railDepth = hsDepth;
          
          const railGeometry = new THREE.BoxGeometry(
            railWidth, railHeight, railDepth, 4, 2, 8
          );
          
          const leftRail = new THREE.LineSegments(
            new THREE.WireframeGeometry(railGeometry),
            wireframeMaterial
          );
          
          const rightRail = new THREE.LineSegments(
            new THREE.WireframeGeometry(railGeometry),
            wireframeMaterial
          );
          
          // Place side rails
          leftRail.position.set(-hsWidth/2 + railWidth/2, hsHeight/2 + railHeight/2, 0);
          rightRail.position.set(hsWidth/2 - railWidth/2, hsHeight/2 + railHeight/2, 0);
          
          hsWireframe.add(leftRail);
          hsWireframe.add(rightRail);
          
          return hsGroup;
        };
        
        // Add buttons and details
        const createButtons = () => {
          const buttonsGroup = new THREE.Group();
          
          // Circular buttons on back - positioned properly parallel to the back of the camera
          const backButtonPositions = [
            { x: bodyWidth/2 - 0.3, y: 0.6, z: bodyDepth/2 + 0.01, radius: 0.12 },
            { x: bodyWidth/2 - 0.3, y: 0.2, z: bodyDepth/2 + 0.01, radius: 0.12 },
            { x: bodyWidth/2 - 0.3, y: -0.2, z: bodyDepth/2 + 0.01, radius: 0.12 },
            { x: -bodyWidth/2 + 0.3, y: 0.6, z: bodyDepth/2 + 0.01, radius: 0.12 }
          ];
          
          backButtonPositions.forEach(button => {
            // Using a circle geometry for buttons on the rear panel
            // The CircleGeometry creates a flat circle in the XY plane
            const buttonGeometry = new THREE.CircleGeometry(button.radius, 16);
            const buttonWireframe = new THREE.LineSegments(
              new THREE.EdgesGeometry(buttonGeometry),
              wireframeMaterial
            );
            
            // Position the button on the back of the camera
            buttonWireframe.position.set(button.x, button.y, button.z);
            
            // Rotate to be parallel to the back of the camera (face in Z direction)
            buttonWireframe.rotation.y = 0;
            
            buttonsGroup.add(buttonWireframe);
          });
          
          // Buttons on left side
          const sideButtonPositions = [
            { x: -bodyWidth/2 - 0.01, y: 0.8, z: 0, width: 0.1, height: 0.2 },
            { x: -bodyWidth/2 - 0.01, y: 0.5, z: 0, width: 0.1, height: 0.2 },
            { x: -bodyWidth/2 - 0.01, y: 0.2, z: 0, width: 0.1, height: 0.2 }
          ];
          
          sideButtonPositions.forEach(button => {
            const buttonGeometry = new THREE.PlaneGeometry(button.width, button.height);
            const buttonWireframe = new THREE.LineSegments(
              new THREE.EdgesGeometry(buttonGeometry),
              wireframeMaterial
            );
            
            buttonWireframe.position.set(button.x, button.y, button.z);
            buttonWireframe.rotation.y = Math.PI/2;
            buttonsGroup.add(buttonWireframe);
          });
          
          return buttonsGroup;
        };
        
        // Assemble all body parts
        const gripMesh = createGrip();
        const viewfinderMesh = createViewfinder();
        const lcdMesh = createLCD();
        const dialsMesh = createDials();
        const lensMountMesh = createLensMount();
        const hotshoeMesh = createHotShoe();
        const buttonsMesh = createButtons();
        
        bodyGroup.add(gripMesh);
        bodyGroup.add(viewfinderMesh);
        bodyGroup.add(lcdMesh);
        bodyGroup.add(dialsMesh);
        bodyGroup.add(lensMountMesh);
        bodyGroup.add(hotshoeMesh);
        bodyGroup.add(buttonsMesh);
        
        return bodyGroup;
      };
      
      // CAMERA LENS
      const createLens = () => {
        const lensGroup = new THREE.Group();
        
        // Lens parameters
        const lensLength = 4.5;
        const maxRadius = 1.0;
        
        // COMPLETELY FIXED: Create lens sections with properly oriented rings
        const createLensSections = () => {
          const sectionsGroup = new THREE.Group();
          
          // Define lens sections
          const sections = [
            { position: 0, frontRadius: 0.96, backRadius: 0.98, length: 0.6 },
            { position: -0.7, frontRadius: 1.0, backRadius: 0.98, length: 0.7 },
            { position: -1.5, frontRadius: 0.98, backRadius: 0.96, length: 0.9 },
            { position: -2.5, frontRadius: 0.97, backRadius: 0.98, length: 1.0 },
            { position: -3.6, frontRadius: 0.95, backRadius: 0.90, length: 0.8 }
          ];
          
          sections.forEach((section, index) => {
            // Adjust radii to match adjacent sections
            const frontRadius = maxRadius * section.frontRadius;
            const backRadius = maxRadius * section.backRadius;
            
            // Create cylinder for each section
            const sectionGeometry = new THREE.CylinderGeometry(
              frontRadius,
              backRadius,
              section.length,
              36, // Circular segmentation
              6,  // Vertical segmentation
              true // Open
            );
            
            const sectionWireframe = new THREE.LineSegments(
              new THREE.WireframeGeometry(sectionGeometry),
              wireframeMaterial
            );
            
            // Proper orientation with main axis toward Z
            sectionWireframe.rotation.x = Math.PI / 2;
            sectionWireframe.position.z = section.position;
            
            sectionsGroup.add(sectionWireframe);
            
            // Add detail rings between sections with correct orientation
            if (index > 0) {
              const ringGeometry = new THREE.TorusGeometry(
                frontRadius + 0.02, 
                0.03, 
                8, 
                48
              );
              
              const ringWireframe = new THREE.LineSegments(
                new THREE.WireframeGeometry(ringGeometry),
                wireframeMaterial
              );
              
                  // CORRECTED: Rings should be perpendicular to the lens axis
              // This positions the rings at the lens sections without piercing through
              ringWireframe.position.z = section.position + section.length / 2;
              
              sectionsGroup.add(ringWireframe);
            }
          });
          
          return sectionsGroup;
        };
        
        // FIXED: Create control rings (zoom, focus) with correct orientation
        const createControlRings = () => {
          const ringsGroup = new THREE.Group();
          
          // Focus ring
          const focusRingGeometry = new THREE.CylinderGeometry(
            maxRadius + 0.05,
            maxRadius + 0.05,
            0.8,
            36,
            8,
            true
          );
          
          // Modify geometry to add grip texture to ring
          const focusRingPositions = focusRingGeometry.attributes.position;
          
          for (let i = 0; i < focusRingPositions.count; i++) {
            const x = focusRingPositions.getX(i);
            const y = focusRingPositions.getY(i);
            const z = focusRingPositions.getZ(i);
            
            // Calculate angle around Y axis
            const angle = Math.atan2(x, z);
            
            // Add ripple pattern (grip texture)
            const rippleFrequency = 36;
            const rippleAmplitude = 0.02;
            const ripple = Math.sin(angle * rippleFrequency) * rippleAmplitude;
            
            // Apply ripple to radius
            const radius = Math.sqrt(x * x + z * z);
            if (radius > 0) {
              const newRadius = radius + ripple;
              const scale = newRadius / radius;
              
              focusRingPositions.setX(i, x * scale);
              focusRingPositions.setZ(i, z * scale);
            }
          }
          
          focusRingGeometry.attributes.position.needsUpdate = true;
          
          const focusRingWireframe = new THREE.LineSegments(
            new THREE.WireframeGeometry(focusRingGeometry),
            wireframeMaterial
          );
          
          // Proper orientation with main axis toward Z
          focusRingWireframe.rotation.x = Math.PI / 2;
          focusRingWireframe.position.z = -1.0;
          
          ringsGroup.add(focusRingWireframe);
          
          // Zoom ring
          const zoomRingGeometry = new THREE.CylinderGeometry(
            maxRadius + 0.08,
            maxRadius + 0.08,
            1.0,
            36,
            10,
            true
          );
          
          // Add similar texture to focus ring
          const zoomRingPositions = zoomRingGeometry.attributes.position;
          
          for (let i = 0; i < zoomRingPositions.count; i++) {
            const x = zoomRingPositions.getX(i);
            const y = zoomRingPositions.getY(i);
            const z = zoomRingPositions.getZ(i);
            
            const angle = Math.atan2(x, z);
            
            // Different pattern for zoom
            const rippleFrequency = 24;
            const rippleAmplitude = 0.03;
            const ripple = Math.sin(angle * rippleFrequency) * rippleAmplitude;
            
            const radius = Math.sqrt(x * x + z * z);
            if (radius > 0) {
              const newRadius = radius + ripple;
              const scale = newRadius / radius;
              
              zoomRingPositions.setX(i, x * scale);
              zoomRingPositions.setZ(i, z * scale);
            }
          }
          
          zoomRingGeometry.attributes.position.needsUpdate = true;
          
          const zoomRingWireframe = new THREE.LineSegments(
            new THREE.WireframeGeometry(zoomRingGeometry),
            wireframeMaterial
          );
          
          // Proper orientation with main axis toward Z
          zoomRingWireframe.rotation.x = Math.PI / 2;
          zoomRingWireframe.position.z = -2.8;
          
          ringsGroup.add(zoomRingWireframe);
          
          return ringsGroup;
        };
        
        // CORREGIDO: Anillos verdes orientados correctamente y pegados al lente
        const createFrontElements = () => {
          const frontGroup = new THREE.Group();
          
          // Elemento de vidrio (lente frontal)
          const glassGeometry = new THREE.CylinderGeometry(
            maxRadius * 0.7,
            maxRadius * 0.7,
            0.05,
            36,
            2
          );
          
          const glassWireframe = new THREE.LineSegments(
            new THREE.WireframeGeometry(glassGeometry),
            wireframeMaterial
          );
          
          // Orientación adecuada con eje principal hacia Z
          glassWireframe.rotation.x = Math.PI / 2;
          glassWireframe.position.z = -4.45;
          
          frontGroup.add(glassWireframe);
          
          // CORREGIDO: Anillos verdes orientados correctamente y pegados al lente
          const greenRings = [
            { radius: maxRadius * 0.85, thickness: 0.04, position: -4.4 },
            { radius: maxRadius * 0.8, thickness: 0.03, position: -4.5 },
            { radius: maxRadius * 0.75, thickness: 0.03, position: -4.6 }
          ];
          
          greenRings.forEach(ring => {
            const ringGeometry = new THREE.TorusGeometry(
              ring.radius,
              ring.thickness,
              8,
              48
            );
            
            const ringWireframe = new THREE.LineSegments(
              new THREE.WireframeGeometry(ringGeometry),
              accentWireframeMaterial // Color verde para los anillos
            );
            
            // Orientación correcta - paralelo a la parte frontal/trasera de la cámara
            ringWireframe.rotation.z = Math.PI / 2; // Gira 90 grados en el eje X para que apunte hacia el frente
            ringWireframe.position.z = ring.position;
            
            frontGroup.add(ringWireframe);
          });
          
          // ELIMINADO: Quitar los círculos perpendiculares que no se alinean con los anillos verdes
          // El código para las líneas concéntricas y diametrales se ha eliminado
          
          return frontGroup;
        };
        
        // Add switches and buttons
        const createSwitches = () => {
          const switchesGroup = new THREE.Group();
          
          // AF/MF switch
          const afSwitchGeometry = new THREE.BoxGeometry(0.3, 0.15, 0.08);
          
          const afSwitchWireframe = new THREE.LineSegments(
            new THREE.WireframeGeometry(afSwitchGeometry),
            wireframeMaterial
          );
          
          afSwitchWireframe.position.set(maxRadius + 0.1, 0.3, -1.0);
          afSwitchWireframe.rotation.y = Math.PI / 6;
          
          switchesGroup.add(afSwitchWireframe);
          
          // IS (stabilizer) switch
          const isSwitchGeometry = new THREE.BoxGeometry(0.25, 0.15, 0.08);
          
          const isSwitchWireframe = new THREE.LineSegments(
            new THREE.WireframeGeometry(isSwitchGeometry),
            wireframeMaterial
          );
          
          isSwitchWireframe.position.set(maxRadius + 0.1, -0.3, -2.2);
          isSwitchWireframe.rotation.y = Math.PI / 6;
          
          switchesGroup.add(isSwitchWireframe);
          
          // Additional button
          const buttonGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.05, 12);
          
          const buttonWireframe = new THREE.LineSegments(
            new THREE.WireframeGeometry(buttonGeometry),
            wireframeMaterial
          );
          
          buttonWireframe.rotation.z = Math.PI / 2;
          buttonWireframe.position.set(maxRadius + 0.05, 0, -3.3);
          
          switchesGroup.add(buttonWireframe);
          
          return switchesGroup;
        };
        
        // Assemble all lens parts
        const lensSections = createLensSections();
        const controlRings = createControlRings();
        const frontElements = createFrontElements();
        const switches = createSwitches();
        
        lensGroup.add(lensSections);
        lensGroup.add(controlRings);
        lensGroup.add(frontElements);
        lensGroup.add(switches);
        
        return lensGroup;
      };
      
      // Assemble complete camera
      const cameraBody = createCameraBody();
      const cameraLens = createLens();
      
      // Position lens correctly in front of body
      cameraLens.position.z = -1.0;
      
      cameraGroup.add(cameraBody);
      cameraGroup.add(cameraLens);
      
      return cameraGroup;
    };
    
    // Create detailed model
    const cameraModel = createDetailedCameraMesh();
    scene.add(cameraModel);
    
    // ANIMATION AND MANUAL CONTROLS
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    const targetRotation = { x: 0.1, y: -0.7, z: 0 };
    const currentRotation = { x: 0.1, y: -0.7, z: 0 };
    const rotationSpeed = 2.5;
    const rotationDamping = 0.15;
    let autoRotate = true;
    const autoRotationSpeed = 0.001;

    // Mouse events
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
    
    // Add wheel event for zoom
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      
      // Camera position adjustment for zoom
      const zoomSpeed = 0.5;
      const zoomDirection = event.deltaY > 0 ? 1 : -1;
      
      // Get current distance to origin
      const distanceVector = new THREE.Vector3(0, 0, 0).sub(camera.position);
      const currentDistance = distanceVector.length();
      
      // Calculate new distance
      const newDistance = THREE.MathUtils.clamp(
        currentDistance + zoomDirection * zoomSpeed,
        5, // Minimum distance
        15  // Maximum distance
      );
      
      // Apply new distance maintaining direction
      distanceVector.normalize().multiplyScalar(-newDistance);
      camera.position.copy(distanceVector);
      camera.lookAt(0, 0, 0);
    };

    // Add event listeners
    currentMount.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    currentMount.addEventListener("click", handleClick);
    currentMount.addEventListener("contextmenu", handleContextMenu);
    currentMount.addEventListener("wheel", handleWheel);
    
    // ANIMATION AND RENDER LOOP
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

      // Apply rotations to model
      cameraModel.rotation.x = currentRotation.x;
      cameraModel.rotation.y = currentRotation.y;
      cameraModel.rotation.z = currentRotation.z;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle window resize
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
    
    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      currentMount.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      currentMount.removeEventListener("click", handleClick);
      currentMount.removeEventListener("contextmenu", handleContextMenu);
      currentMount.removeEventListener("wheel", handleWheel);
      
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      
      // Free memory
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
  }, []); // end of useEffect

  return <div className="w-full h-[500px]" ref={mountRef}></div>;
};

export default CameraWireframe;