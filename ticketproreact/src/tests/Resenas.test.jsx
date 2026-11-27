import { afterEach, describe, expect, it } from 'vitest'
import { guardarResena, notaOrganizador, resenaDe, resenasDeEvento } from '../utils/Resenas'
import { leerJSON } from '../utils/Almacen'
import { agruparPorEvento, asistioAlEvento, registrarCompra } from '../utils/Compras'

afterEach(() => localStorage.clear())

const base = { organizador: 'Rock Nation Chile', correo: 'a@gmail.com', autor: 'Ana', comentario: 'Muy buena organización' }

describe('Reseñas', () => {
  it('la nota es de la empresa: promedia reseñas de distintos eventos', () => {
    guardarResena({ ...base, idEvento: 'evento-1', nota: 5 })
    guardarResena({ ...base, idEvento: 'evento-9', correo: 'b@gmail.com', nota: 3 })
    guardarResena({ ...base, idEvento: 'evento-2', organizador: 'Otra Productora', nota: 1 })
    const lista = leerJSON('resenas', [])
    expect(notaOrganizador(lista, 'Rock Nation Chile')).toEqual({ promedio: 4, cantidad: 2, eventos: 2 })
    expect(notaOrganizador(lista, 'Sin reseñas')).toEqual({ promedio: 0, cantidad: 0, eventos: 0 })
  })

  it('un usuario tiene una sola reseña por evento: la segunda actualiza la primera', () => {
    guardarResena({ ...base, idEvento: 'evento-1', nota: 2 })
    guardarResena({ ...base, idEvento: 'evento-1', nota: 4, comentario: 'Cambié de opinión' })
    const lista = leerJSON('resenas', [])
    expect(resenasDeEvento(lista, 'evento-1')).toHaveLength(1)
    expect(resenaDe(lista, 'evento-1', 'A@gmail.com').nota).toBe(4)
  })

  it('recorta comentarios demasiado largos', () => {
    guardarResena({ ...base, idEvento: 'evento-1', nota: 5, comentario: 'x'.repeat(900) })
    expect(leerJSON('resenas', [])[0].comentario).toHaveLength(500)
  })
})

describe('Compras / historial', () => {
  it('registra la compra y agrupa por evento', () => {
    registrarCompra('a@gmail.com', [
      { idEvento: 'evento-1', tituloEvento: 'Rock', nombreSeccion: 'General', cantidad: 2, precioUnitario: 100, subtotal: 200 },
      { idEvento: 'evento-1', tituloEvento: 'Rock', nombreSeccion: 'VIP', cantidad: 1, precioUnitario: 300, subtotal: 300 },
    ])
    const compras = leerJSON('compras', [])
    const [grupo] = agruparPorEvento(compras)
    expect(grupo).toMatchObject({ idEvento: 'evento-1', entradas: 3, total: 500, secciones: ['General', 'VIP'] })
    expect(asistioAlEvento(compras, 'evento-1')).toBe(true)
    expect(asistioAlEvento(compras, 'evento-2')).toBe(false)
  })
})
