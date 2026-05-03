/**
 * Parallax tipo ParallaxCard (viewport −1…1) y giro en táctiles
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

/** Táctil / sin hover fino ⇒ gyro; escritorio ⇒ ratón viewport. */
export function preferOrientationMotion(): boolean {
  if (typeof window === "undefined") return false;
  const coarse = window.matchMedia("(pointer: coarse)");
  const noHover = window.matchMedia("(hover: none)");
  const hasTouch =
    typeof navigator !== "undefined" && navigator.maxTouchPoints > 0;
  /*
   * No usar sólo max-width: en landscape (~844 CSS px) el tilt caía en “viewport de ratón”
   * y xy quedaba fijo en 0 sin moverse el teléfono.
   */
  return hasTouch && (coarse.matches || noHover.matches);
}

/** Parallax acumulado (orientación atenuada o ratón viewport). */
export function getParallaxDrive(): MotionVec {
  if (preferOrientationMotion()) return { ...orientSnap };
  return { ...viewportSnap };
}

export const MOBILE_TILT_FACTOR = 0.52;

/* --- Singleton listeners --- */

interface DeviceOrientationEventiOS extends DeviceOrientationEvent {
  requestPermission?: () => Promise<"granted" | "denied">;
}

let mouseBound = false;
let orientationListening = false;
/** iOS: varios handlers en window; primera interacción dispara permiso/listener una sola vez. */
let iosGestureBusy = false;
let iosGestureHandlersInstalled = false;

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

function onDeviceOrientation(ev: DeviceOrientationEvent) {
  const mapped = mapOrientation(ev);
  if (!mapped) return;
  orientSnap.x = mapped.x;
  orientSnap.y = mapped.y;
  notify();
}

function attachDeviceOrientationListening() {
  if (orientationListening || typeof window === "undefined") return;
  orientationListening = true;
  window.addEventListener("deviceorientation", onDeviceOrientation, {
    passive: true,
  });
}

function iosRequiresPermissionGesture(): boolean {
  return (
    typeof DeviceOrientationEvent !== "undefined" &&
    typeof (DeviceOrientationEvent as unknown as DeviceOrientationEventiOS)
      .requestPermission === "function"
  );
}

/** iOS 13+: requestPermission en el mismo gesto; evitar doble disparo pointerdown+touchend. */
function installIOSOrientationGestureGate() {
  if (
    iosGestureHandlersInstalled ||
    orientationListening ||
    typeof window === "undefined"
  )
    return;
  iosGestureHandlersInstalled = true;

  const onUserGesture = () => {
    if (orientationListening || iosGestureBusy) return;
    iosGestureBusy = true;

    const requestPermission = (
      DeviceOrientationEvent as unknown as DeviceOrientationEventiOS
    ).requestPermission;

    if (typeof requestPermission === "function") {
      void requestPermission()
        .then((r) => {
          if (r === "granted") attachDeviceOrientationListening();
        })
        .finally(() => {
          iosGestureBusy = false;
        });
    } else {
      attachDeviceOrientationListening();
      iosGestureBusy = false;
    }
  };

  window.addEventListener("pointerdown", onUserGesture, {
    capture: true,
    passive: true,
  });
  window.addEventListener("touchend", onUserGesture, {
    capture: true,
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

  if (iosRequiresPermissionGesture()) {
    installIOSOrientationGestureGate();
  } else {
    /* Android y demás Chromium: gyro sin esperar click ficticio en document.body */
    attachDeviceOrientationListening();
  }

  ensureMouseListening();

  return () => {
    ticks.delete(listener);
  };
}
