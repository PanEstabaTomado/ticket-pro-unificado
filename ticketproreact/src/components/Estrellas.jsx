import { useState } from 'react'

// Modo lectura: <Estrellas valor={4.3} /> (admite decimales)
// Modo entrada: <Estrellas valor={nota} onChange={setNota} />
function Estrellas({ valor = 0, onChange, etiqueta = 'Nota' }) {
  const [hover, setHover] = useState(0)

  if (!onChange) {
    const porcentaje = Math.max(0, Math.min(5, valor)) * 20
    return (
      <span
        className="estrellas"
        role="img"
        aria-label={`${valor.toFixed(1).replace('.', ',')} de 5 estrellas`}
      >
        <span className="estrellas-base" aria-hidden="true">★★★★★</span>
        <span className="estrellas-relleno" style={{ width: `${porcentaje}%` }} aria-hidden="true">★★★★★</span>
      </span>
    )
  }

  const activo = hover || valor
  return (
    <div className="estrellas-input" role="radiogroup" aria-label={etiqueta} onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={valor === n}
          aria-label={`${n} ${n === 1 ? 'estrella' : 'estrellas'}`}
          className={n <= activo ? 'estrella-boton activa' : 'estrella-boton'}
          onMouseEnter={() => setHover(n)}
          onClick={() => onChange(n)}
        >
          ★
        </button>
      ))}
    </div>
  )
}

export default Estrellas
