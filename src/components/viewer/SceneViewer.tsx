'use client';
import * as React from 'react';
import { Box, Typography } from '@mui/material';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';

export type CameraPose = {
  x?: number; y?: number; z?: number;
  theta?: number; // reserved for future spherical mapping
  phi?: number;   // reserved for future spherical mapping
  fov?: number;   // vertical FOV in degrees
};

type SceneViewerProps = {
  /** URL to .ply or .splat (if absent → empty scene) */
  src?: string | null;
  /** Optional initial camera pose */
  initialCamera?: CameraPose;
};

// ---- Type guards to keep code strictly typed ----
function hasGeometry(o: THREE.Object3D): o is THREE.Object3D & { geometry: THREE.BufferGeometry } {
  return 'geometry' in o && (o as { geometry: unknown }).geometry instanceof THREE.BufferGeometry;
}
function hasMaterial(o: THREE.Object3D): o is THREE.Object3D & { material: THREE.Material | THREE.Material[] } {
  return 'material' in o;
}
function hasTextures(o: unknown): o is { texture?: { dispose?: () => void } } {
  return typeof o === 'object' && o !== null && 'texture' in (o as Record<string, unknown>);
}
function setRendererSRGB(renderer: THREE.WebGLRenderer) {
  // r150+ introduced outputColorSpace; prior versions use outputEncoding
  if ('outputColorSpace' in renderer) {
    renderer.outputColorSpace = THREE.SRGBColorSpace as unknown as THREE.ColorSpace;
  } else {
    // @ts-expect-error older three versions expose outputEncoding
    renderer.outputEncoding = THREE.sRGBEncoding;
  }
}

export default function SceneViewer({ src, initialCamera }: SceneViewerProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const rendererRef = React.useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = React.useRef<THREE.Scene | null>(null);
  const cameraRef = React.useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = React.useRef<OrbitControls | null>(null);
  const currentMeshRef = React.useRef<THREE.Object3D | null>(null);
  const rafRef = React.useRef<number | null>(null);

  // setup renderer + scene + camera once
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const width = el.clientWidth;
    const height = el.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    setRendererSRGB(renderer);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    el.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x121212);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(initialCamera?.fov ?? 45, width / height, 0.01, 10_000);
    camera.position.set(initialCamera?.x ?? 2.5, initialCamera?.y ?? 1.6, initialCamera?.z ?? 3.0);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.zoomSpeed = 0.8;
    controls.rotateSpeed = 0.8;
    controls.panSpeed = 0.6;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // Scene helpers
    const grid = new THREE.GridHelper(10, 10, 0x444444, 0x222222);
    grid.position.y = -0.001;
    scene.add(grid);

    const axes = new THREE.AxesHelper(1.0);
    axes.position.set(0, 0.001, 0);
    scene.add(axes);

    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);

    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(3, 5, 2);
    scene.add(dir);

    // Render loop
    const tick = () => {
      controls.update();
      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(tick);
    };
    tick();

    // resize
    const resize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      controls.dispose();
      renderer.dispose();
      // remove canvas
      if (renderer.domElement.parentElement === el) el.removeChild(renderer.domElement);
      // dispose mesh if present
      const mesh = currentMeshRef.current;
      if (mesh) {
        disposeObject(mesh);
        currentMeshRef.current = null;
      }
      // dispose scene resources
      scene.traverse((obj) => {
        if (hasGeometry(obj)) obj.geometry.dispose?.();
        if (hasMaterial(obj)) {
          const m = obj.material;
          if (Array.isArray(m)) m.forEach((mm) => mm.dispose?.());
          else m.dispose?.();
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // (Re)load asset whenever src changes
  React.useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Clear previous mesh
    if (currentMeshRef.current) {
      scene.remove(currentMeshRef.current);
      disposeObject(currentMeshRef.current);
      currentMeshRef.current = null;
    }

    if (!src) {
      // No asset → leave empty helpers only
      return;
    }

    // Determine loader based on extension
    const lower = src.toLowerCase();
    if (lower.endsWith('.ply')) {
      const loader = new PLYLoader();
      loader.load(
        src,
        (geometry: THREE.BufferGeometry) => {
          geometry.computeBoundingSphere();
          const hasColor = geometry.getAttribute('color') !== undefined;

          const mat = new THREE.PointsMaterial({
            size: 0.01,
            vertexColors: hasColor,
            color: hasColor ? undefined : 0xdddddd,
          });

          const points = new THREE.Points(geometry, mat);
          points.frustumCulled = false;

          // Center & scale to reasonable size
          geometry.computeBoundingBox();
          const bb = geometry.boundingBox!;
          const size = new THREE.Vector3().subVectors(bb.max, bb.min);
          const center = new THREE.Vector3().addVectors(bb.min, bb.max).multiplyScalar(0.5);
          points.position.sub(center); // center at origin

          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = maxDim > 0 ? 2.0 / maxDim : 1.0; // normalize into ~2 units
          points.scale.setScalar(scale);

          scene.add(points);
          currentMeshRef.current = points;

          // Frame content if no explicit pose
          if (!initialCamera) {
            const cam = cameraRef.current!;
            const dist = 3.0;
            cam.position.set(dist, dist * 0.6, dist);
            cam.lookAt(0, 0, 0);
            const controls = controlsRef.current!;
            controls.target.set(0, 0, 0);
            controls.update();
          }
        },
        undefined,
        () => {
          // Failed to load .ply → leave scene empty
        },
      );
    } else if (lower.endsWith('.splat')) {
      // TODO: integrate Gaussian splat renderer later
    } else {
      // Unknown extension → ignore
    }
  }, [src, initialCamera]);

  return (
    <Box ref={containerRef} sx={{ width: '100%', height: '100%', position: 'relative' }}>
      {!src && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            pointerEvents: 'none',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            No asset for this scene. (Empty viewer)
          </Typography>
        </Box>
      )}
    </Box>
  );
}

// --- helpers ---
function disposeObject(obj: THREE.Object3D) {
  obj.traverse((o) => {
    if (hasGeometry(o)) o.geometry.dispose?.();
    if (hasMaterial(o)) {
      const m = o.material;
      if (Array.isArray(m)) m.forEach((mm) => mm.dispose?.());
      else m.dispose?.();
    }
    // Some helper objects might hold textures on custom props
    if (hasTextures(o)) o.texture?.dispose?.();
  });
}
