import { useMemo } from 'react'
import { escribirJSON, leerJSON, useJSON } from './Almacen'

const CLAVE = 'resenas'
const VACIO = []

// true  = solo pueden opinar quienes compraron entrada para ese evento
// false = cualquier usuario con sesión iniciada puede opinar
export const REQUIERE_ASISTENCIA = true

export const MAX_COMENTARIO = 500

const mismoCorreo = (a, b) => String(a ?? '').toLowerCase() === String(b ?? '').toLowerCase()

export function useResenas() {
  return useJSON(CLAVE, VACIO)
}

// Una reseña por usuario y por evento: si ya existía, se actualiza.
export function guardarResena({ idEvento, organizador, correo, autor, nota, comentario }) {
  const lista = leerJSON(CLAVE, [])
  const resto = lista.filter((r) => !(r.idEvento === idEvento && mismoCorreo(r.correo, correo)))
  escribirJSON(CLAVE, [
    {
      idEvento,
      organizador,
      correo,
      autor,
      nota: Number(nota),
      comentario: comentario.trim().slice(0, MAX_COMENTARIO),
      fecha: new Date().toISOString(),
    },
    ...resto,
  ])
}

export function resenasDeEvento(lista, idEvento) {
  return lista.filter((r) => r.idEvento === idEvento)
}

export function resenaDe(lista, idEvento, correo) {
  return lista.find((r) => r.idEvento === idEvento && mismoCorreo(r.correo, correo))
}

// La nota pertenece a la empresa organizadora: promedio de TODAS sus reseñas, en cualquiera de sus eventos.
export function notaOrganizador(lista, organizador) {
  const propias = lista.filter((r) => r.organizador === organizador)
  if (propias.length === 0) return { promedio: 0, cantidad: 0, eventos: 0 }
  const suma = propias.reduce((s, r) => s + r.nota, 0)
  return {
    promedio: suma / propias.length,
    cantidad: propias.length,
    eventos: new Set(propias.map((r) => r.idEvento)).size,
  }
}

export function useNotaOrganizador(organizador) {
  const lista = useResenas()
  return useMemo(() => (organizador ? notaOrganizador(lista, organizador) : null), [lista, organizador])
}
