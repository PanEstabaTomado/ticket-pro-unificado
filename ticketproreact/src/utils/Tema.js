import { useState } from 'react'

const CLAVE = 'tema'

export function obtenerTema() {
  try {
    return window.localStorage.getItem(CLAVE) === 'claro' ? 'claro' : 'oscuro' // por defecto: oscuro
  } catch {
    return 'oscuro'
  }
}

export function aplicarTema(tema) {
  document.documentElement.dataset.tema = tema
  try {
    window.localStorage.setItem(CLAVE, tema)
  } catch {
    /* sin almacenamiento: el tema solo dura esta visita */
  }
}

// Se llama en main.jsx antes de renderizar para evitar el parpadeo del tema equivocado.
export function aplicarTemaInicial() {
  document.documentElement.dataset.tema = obtenerTema()
}

export function useTema() {
  const [tema, setTema] = useState(obtenerTema)
  const alternar = () => {
    const nuevo = tema === 'oscuro' ? 'claro' : 'oscuro'
    aplicarTema(nuevo)
    setTema(nuevo)
  }
  return { tema, alternar }
}
