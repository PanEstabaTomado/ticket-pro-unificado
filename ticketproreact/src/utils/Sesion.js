import { useMemo, useSyncExternalStore } from 'react'
import { avisarCambio, suscribir } from './Almacen'

const CLAVE = 'sesion_activa'

// Login.jsx guarda la sesión en localStorage ("Recordarme") o sessionStorage.
function leerTexto() {
  return window.localStorage.getItem(CLAVE) || window.sessionStorage.getItem(CLAVE)
}

// Hook: usuario actual ({ nombre, correo }) o null si nadie ha iniciado sesión.
export function useSesion() {
  const texto = useSyncExternalStore(suscribir, leerTexto)
  return useMemo(() => {
    try {
      return texto ? JSON.parse(texto) : null
    } catch {
      return null
    }
  }, [texto])
}

// Login.jsx lo llama después de escribir/borrar la sesión para que el Header se actualice.
export function notificarCambioSesion() {
  avisarCambio()
}

export function cerrarSesion() {
  window.localStorage.removeItem(CLAVE)
  window.sessionStorage.removeItem(CLAVE)
  avisarCambio()
}
