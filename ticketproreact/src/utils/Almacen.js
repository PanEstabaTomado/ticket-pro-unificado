import { useMemo, useSyncExternalStore } from 'react'

// Pequeña capa sobre localStorage para que varios componentes (Header, Perfil,
// Historial, Reseñas...) se enteren de los cambios sin recargar la página.
const EVENTO = 'ticketpro:almacen'

export function avisarCambio() {
  window.dispatchEvent(new Event(EVENTO))
}

export function suscribir(callback) {
  window.addEventListener(EVENTO, callback)
  window.addEventListener('storage', callback) // cambios hechos desde otra pestaña
  return () => {
    window.removeEventListener(EVENTO, callback)
    window.removeEventListener('storage', callback)
  }
}

export function leerJSON(clave, porDefecto) {
  try {
    const texto = window.localStorage.getItem(clave)
    return texto ? JSON.parse(texto) : porDefecto
  } catch {
    return porDefecto
  }
}

export function escribirJSON(clave, valor) {
  window.localStorage.setItem(clave, JSON.stringify(valor))
  avisarCambio()
}

// Hook: devuelve el JSON guardado y se re-renderiza cuando cambia.
// `porDefecto` debe ser una constante definida fuera del componente.
export function useJSON(clave, porDefecto) {
  const texto = useSyncExternalStore(suscribir, () => window.localStorage.getItem(clave))
  return useMemo(() => {
    try {
      return texto ? JSON.parse(texto) : porDefecto
    } catch {
      return porDefecto
    }
  }, [texto, porDefecto])
}
