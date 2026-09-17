#!/usr/bin/env node
/**
 * Dev server HTTPS para probar el giroscopio en iPhone/iPad antes de desplegar.
 *
 * La API DeviceOrientationEvent solo existe en contextos seguros (HTTPS), por lo
 * que `next dev` en HTTP no puede usarla. Este script:
 *   1. Detecta la IP local de la LAN.
 *   2. Arranca `next dev --experimental-https -H <ip>` para que mkcert genere el
 *      certificado incluyendo esa IP como SAN (sin `-H`, el cert solo cubre
 *      localhost y el iPhone lo rechazaría).
 *
 * iOS (una sola vez):
 *   1. Copia el CA a tu iPhone (AirDrop): ~/Library/Application Support/mkcert/rootCA.pem
 *   2. Ajustes > General > VPN y gestión de dispositivos > instalar perfil.
 *   3. Ajustes > General > Información > Ajustes de confianza de certificados >
 *      activar confianza total para el CA.
 *   4. Abre la URL impresa abajo en Safari y toca la pantalla para aceptar el
 *      permiso de movimiento y orientación.
 */
import { networkInterfaces } from "node:os";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const nextCli = require.resolve("next/dist/bin/next");

function getLanIPv4() {
  const nets = networkInterfaces();
  for (const addrs of Object.values(nets)) {
    for (const addr of addrs ?? []) {
      if (addr.family === "IPv4" && !addr.internal) return addr.address;
    }
  }
  return undefined;
}

const ip = getLanIPv4();
const args = ["dev", "--turbopack", "--experimental-https"];
if (ip) args.push("-H", ip);

console.log("==============================================");
console.log("  Dev HTTPS para probar en iPhone/iPad");
if (ip) {
  console.log(`  URL:  https://${ip}:3000`);
} else {
  console.log("  (No se detectó IP de LAN; usando localhost)");
}
console.log("==============================================");

const child = spawn(process.execPath, [nextCli, ...args], { stdio: "inherit" });
child.on("exit", (code) => process.exit(code ?? 0));
