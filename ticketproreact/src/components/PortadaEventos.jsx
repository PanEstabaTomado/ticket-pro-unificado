import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ImagenEvento from './ImagenEvento'

const INTERVALO_MS = 6000

const prefiereMenosMovimiento = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// Portada del inicio: fondo difuminado que rota entre los eventos destacados.
// `children` es el texto de bienvenida (título, descripción y botón).
function PortadaEventos({ eventos, children }) {
  const [indice, setIndice] = useState(0)
  const [pausado, setPausado] = useState(false)
  const [rotas, setRotas] = useState([]) // imágenes que no existen: se usa un degradado en su lugar

  // Detecta de antemano qué imágenes no cargan, para no dejar el fondo en blanco.
  useEffect(() => {
    eventos.forEach((e) => {
      if (!e.imagen) return
      const prueba = new Image()
      prueba.onerror = () => setRotas((prev) => (prev.includes(e.id) ? prev : [...prev, e.id]))
      prueba.src = e.imagen
    })
  }, [eventos])

  // Cambio automático (se detiene al pasar el mouse/foco y si el usuario pidió menos movimiento).
  useEffect(() => {
    if (eventos.length < 2 || pausado || prefiereMenosMovimiento()) return
    const timer = setInterval(() => setIndice((i) => (i + 1) % eventos.length), INTERVALO_MS)
    return () => clearInterval(timer)
  }, [eventos.length, pausado])

  const actual = eventos[indice]

  return (
    <section
      className="portada"
      aria-roledescription="carrusel"
      aria-label="Eventos destacados"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocus={() => setPausado(true)}
      onBlur={() => setPausado(false)}
    >
      <div className="portada-fondos" aria-hidden="true">
        {eventos.map((e, i) => {
          const sinImagen = !e.imagen || rotas.includes(e.id)
          return (
            <div
              key={e.id}
              className={`portada-fondo${i === indice ? ' visible' : ''}${sinImagen ? ` respaldo respaldo-${i % 4}` : ''}`}
              style={sinImagen ? undefined : { backgroundImage: `url(${e.imagen})` }}
            />
          )
        })}
        <div className="portada-velo" />
      </div>

      <div className="portada-contenido">
        <div className="hero-content">{children}</div>

        {actual && (
          <div className="portada-ficha" aria-live="off">
            <div className="portada-ficha-imagen">
              <ImagenEvento evento={actual} />
            </div>
            <div className="portada-ficha-info">
              <h3>{actual.titulo}</h3>
              <p>{actual.fecha} | {actual.lugar}</p>
              <Link className="btn-primario btn-enlace" to={`/evento/${actual.id}`}>Ver evento</Link>
            </div>
          </div>
        )}
      </div>

      {eventos.length > 1 && (
        <div className="portada-puntos">
          {eventos.map((e, i) => (
            <button
              key={e.id}
              type="button"
              className={i === indice ? 'punto activo' : 'punto'}
              aria-label={`Mostrar ${e.titulo}`}
              aria-current={i === indice}
              onClick={() => setIndice(i)}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default PortadaEventos
