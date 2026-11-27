// Las fechas de Eventos.jsx vienen como texto ("25 Octubre de 2026"), así que
// aquí se convierten a Date para saber si un evento ya terminó.
const MESES = {
  enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5,
  julio: 6, agosto: 7, septiembre: 8, setiembre: 8, octubre: 9, noviembre: 10, diciembre: 11,
}

const DURACION_POR_DEFECTO_HORAS = 3

// Acepta "25 Octubre de 2026" o "2026-10-25". Devuelve Date o null si no se entiende.
export function parsearFecha(texto, hora = '00:00') {
  if (!texto) return null
  const [h = 0, m = 0] = String(hora).split(':').map(Number)

  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(texto.trim())
  if (iso) return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]), h, m)

  const largo = /^(\d{1,2})\s+([a-záéíóú]+)\s+de\s+(\d{4})$/i.exec(texto.trim())
  if (largo) {
    const mes = MESES[largo[2].toLowerCase()]
    if (mes !== undefined) return new Date(Number(largo[3]), mes, Number(largo[1]), h, m)
  }
  return null
}

export function inicioDelEvento(evento) {
  return parsearFecha(evento?.fecha, evento?.hora)
}

// "3 horas" -> 3, "1.5 horas" -> 1.5
function duracionEnHoras(evento) {
  const n = parseFloat(String(evento?.duracion ?? '').replace(',', '.'))
  return Number.isFinite(n) && n > 0 ? n : DURACION_POR_DEFECTO_HORAS
}

// Un evento está finalizado cuando pasó su hora de inicio + su duración.
// Si la fecha no se puede leer, se considera NO finalizado (no se bloquea nada por error).
export function eventoFinalizado(evento, ahora = new Date()) {
  const inicio = inicioDelEvento(evento)
  if (!inicio) return false
  const fin = new Date(inicio.getTime() + duracionEnHoras(evento) * 3600 * 1000)
  return ahora > fin
}

// Los próximos eventos primero (por fecha más cercana). Se usa para el carrusel del inicio.
export function eventosProximos(eventos, ahora = new Date()) {
  return eventos
    .filter((e) => !eventoFinalizado(e, ahora))
    .sort((a, b) => (inicioDelEvento(a) ?? 0) - (inicioDelEvento(b) ?? 0))
}
