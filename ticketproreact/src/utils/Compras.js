import { useMemo } from 'react'
import { escribirJSON, leerJSON, useJSON } from './Almacen'

const CLAVE = 'compras' // lista plana: una fila por línea del carrito comprada
const VACIO = []

const mismoCorreo = (a, b) => String(a ?? '').toLowerCase() === String(b ?? '').toLowerCase()

// Guarda lo que había en el carrito como compra del usuario.
export function registrarCompra(correo, items) {
  const fechaCompra = new Date().toISOString()
  const nuevas = items.map((item) => ({
    correo,
    fechaCompra,
    idEvento: item.idEvento,
    tituloEvento: item.tituloEvento,
    nombreSeccion: item.nombreSeccion,
    cantidad: item.cantidad,
    precioUnitario: item.precioUnitario,
    subtotal: item.subtotal,
  }))
  escribirJSON(CLAVE, [...leerJSON(CLAVE, []), ...nuevas])
}

export function useCompras(correo) {
  const todas = useJSON(CLAVE, VACIO)
  return useMemo(() => (correo ? todas.filter((c) => mismoCorreo(c.correo, correo)) : VACIO), [todas, correo])
}

// Une varias compras del mismo evento en una sola fila para el historial.
export function agruparPorEvento(compras) {
  const mapa = new Map()
  for (const c of compras) {
    const previa = mapa.get(c.idEvento)
    if (previa) {
      previa.entradas += c.cantidad
      previa.total += c.subtotal
      previa.secciones.add(c.nombreSeccion)
      if (c.fechaCompra > previa.ultimaCompra) previa.ultimaCompra = c.fechaCompra
    } else {
      mapa.set(c.idEvento, {
        idEvento: c.idEvento,
        tituloEvento: c.tituloEvento,
        entradas: c.cantidad,
        total: c.subtotal,
        secciones: new Set([c.nombreSeccion]),
        ultimaCompra: c.fechaCompra,
      })
    }
  }
  return [...mapa.values()].map((g) => ({ ...g, secciones: [...g.secciones] }))
}

export function asistioAlEvento(compras, idEvento) {
  return compras.some((c) => c.idEvento === idEvento)
}
