import { describe, expect, it } from 'vitest'
import { eventoFinalizado, eventosProximos, parsearFecha } from '../utils/Fechas'

describe('Fechas', () => {
  it('lee el formato de texto de Eventos.jsx', () => {
    const f = parsearFecha('25 Octubre de 2026', '20:00')
    expect([f.getFullYear(), f.getMonth(), f.getDate(), f.getHours()]).toEqual([2026, 9, 25, 20])
  })

  it('lee fechas ISO y devuelve null si no entiende el texto', () => {
    expect(parsearFecha('2026-11-20').getDate()).toBe(20)
    expect(parsearFecha('mañana')).toBeNull()
    expect(parsearFecha(undefined)).toBeNull()
  })

  it('un evento termina cuando pasa su hora de inicio + su duración', () => {
    const evento = { fecha: '10 Diciembre de 2026', hora: '20:00', duracion: '3 horas' }
    expect(eventoFinalizado(evento, new Date(2026, 11, 10, 22, 0))).toBe(false)
    expect(eventoFinalizado(evento, new Date(2026, 11, 10, 23, 30))).toBe(true)
  })

  it('si la fecha no se entiende, no se considera finalizado', () => {
    expect(eventoFinalizado({ fecha: 'pronto' })).toBe(false)
  })

  it('eventosProximos descarta los terminados y ordena por fecha', () => {
    const lista = [
      { id: 'c', fecha: '12 Diciembre de 2026', hora: '12:00' },
      { id: 'a', fecha: '01 Enero de 2020', hora: '12:00' },
      { id: 'b', fecha: '05 Diciembre de 2026', hora: '12:00' },
    ]
    expect(eventosProximos(lista, new Date(2026, 10, 26)).map((e) => e.id)).toEqual(['b', 'c'])
  })
})
