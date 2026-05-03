/**
 * Parallax tipo ParallaxCard (viewport −1…1) y giro amplificado en táctiles
 * mediante DeviceOrientationEvent (atenuado en móvil).
 */

export type MotionVec = { x: number; y: number };

const viewportSnap: MotionVec = { x: 0, y: 0 };
const orientSnap: MotionVec = { x: 0, y: 0 };
const ticks = new Set<() => void>();

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function notify() {
  ticks.forEach((fn) => fn());
}

/** Normaliza al viewport como ParallaxCard. */
export function updateViewportNorm(clientX: number, clientY: number) {
  if (typeof window === "undefined") return;
  viewportSnap.x = (clientX / window.innerWidth) * 2 - 1;
  viewportSnap.y = (clientY / window.innerHeight) * 2 - 1;
  notify();
}

/** Móvil: priorizar gyro; escritorio/trackpad fine: ratón viewport. */
export function preferOrientationMotion(): boolean {
  if (typeof window === "undefined") return false;
  const narrow = window.matchMedia("(max-width: 767px)");
  const coarse = window.matchMedia("(pointer: coarse)");
  const noHover = window.matchMedia("(hover: none)");
  return narrow.matches && (coarse.matches || noHover.matches);
}

/** Parallax acumulado (orientación atenuada o ratón viewport). */
export function getParallaxDrive(): MotionVec {
  if (preferOrientationMotion()) return { ...orientSnap };
  return { ...viewportSnap };
}

export const MOBILE_TILT_FACTOR = 0.38;

/* --- Singleton listeners --- */

interface DeviceOrientationEventiOS extends DeviceOrientationEvent {
  requestPermission?: () => Promise<"granted" | "denied">;
}

let mouseBound = false;
let orientationAttached = false;
let gestureInitQueued = false;

function mapOrientation(ev: DeviceOrientationEvent): MotionVec | null {
  const { beta, gamma } = ev;
  if (beta === null || gamma === null) return null;
  const landscape =
    typeof window !== "undefined" &&
    window.matchMedia("(orientation: landscape)").matches;

  const rawX = landscape
    ? clamp(beta / 45, -1, 1)
    : clamp(gamma / 45, -1, 1);
  const rawY = landscape
    ? clamp(((Math.abs(gamma) - 45) / 25) * -1, -1, 1)
    : clamp(((beta - 45) / 25) * -1, -1, 1);

  return {
    x: rawX * MOBILE_TILT_FACTOR,
    y: rawY * MOBILE_TILT_FACTOR,
  };
}

function attachDeviceOrientationListening() {
  if (orientationAttached || typeof window === "undefined") return;

  function onOrient(ev: DeviceOrientationEvent) {
    const mapped = mapOrientation(ev);
    if (!mapped) return;
    orientSnap.x = mapped.x;
    orientSnap.y = mapped.y;
    notify();
  }

  orientationAttached = true;
  window.addEventListener("deviceorientation", onOrient, { passive: true });
}

/** Primera pulsación igual que ParallaxCard (permiso iOS). */
function queueOrientationGestureGate() {
  if (gestureInitQueued || typeof window === "undefined") return;
  gestureInitQueued = true;

  const initiate = () => {
    const requestPermission = (
      DeviceOrientationEvent as unknown as DeviceOrientationEventiOS
    ).requestPermission;
    const ios = typeof requestPermission === "function";

    if (ios) {
      void requestPermission().then((r) => {
        if (r === "granted") attachDeviceOrientationListening();
      });
    } else {
      attachDeviceOrientationListening();
    }
  };

  window.document.body?.addEventListener("click", initiate, { once: true });
  window.document.body?.addEventListener("touchend", initiate, {
    once: true,
    passive: true,
  });
}

function ensureMouseListening() {
  if (mouseBound || typeof window === "undefined") return;
  mouseBound = true;

  window.addEventListener(
    "mousemove",
    (e: MouseEvent) => {
      if (preferOrientationMotion()) return;
      updateViewportNorm(e.clientX, e.clientY);
    },
    { passive: true },
  );
}

/** Suscripción efectos parallax; refetch con getParallaxDrive() dentro del listener. */
export function subscribeThumbnailParallax(listener: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  ticks.add(listener);
  queueOrientationGestureGate();
  ensureMouseListening();

  return () => {
    ticks.delete(listener);
  };
}
