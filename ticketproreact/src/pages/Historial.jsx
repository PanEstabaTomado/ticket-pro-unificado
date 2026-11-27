import { Link, useNavigate } from 'react-router-dom'
import Avatar from '../components/Avatar'
import Estrellas from '../components/Estrellas'
import ImagenEvento from '../components/ImagenEvento'
import { eventos } from '../data/Eventos'
import { useSesion } from '../utils/Sesion'
import { agruparPorEvento, useCompras } from '../utils/Compras'
import { eventoFinalizado, inicioDelEvento } from '../utils/Fechas'
import { resenaDe, useResenas } from '../utils/Resenas'

function Historial() {
  const navigate = useNavigate()
  const sesion = useSesion()
  const compras = useCompras(sesion?.correo)
  const resenas = useResenas()

  if (!sesion) {
    return (
      <main>
        <section className="seccion-evento">
          <h2>Historial de eventos</h2>
          <p className="vacio">Inicia sesión para ver los eventos a los que has asistido.</p>
          <button type="button" className="btn-primario" onClick={() => navigate('/login')}>Iniciar sesión</button>
        </section>
      </main>
    )
  }

  const filas = agruparPorEvento(compras)
    .map((fila) => ({ ...fila, evento: eventos.find((e) => e.id === fila.idEvento) }))
    .sort((a, b) => (inicioDelEvento(b.evento) ?? 0) - (inicioDelEvento(a.evento) ?? 0))

  const asistidos = filas.filter((f) => f.evento && eventoFinalizado(f.evento)).length
  const proximos = filas.length - asistidos

  return (
    <main>
      <section className="seccion-evento">
        <h2>Historial de eventos</h2>
        {filas.length > 0 && (
          <p className="ayuda">
            {asistidos} {asistidos === 1 ? 'evento asistido' : 'eventos asistidos'} · {proximos} {proximos === 1 ? 'próximo' : 'próximos'}
          </p>
        )}

        {filas.length === 0 ? (
          <div>
            <p className="vacio">Aún no tienes compras. Cuando pagues tus entradas, tus eventos aparecerán aquí.</p>
            <Link className="btn-primario btn-enlace" to="/eventos">Ver eventos</Link>
          </div>
        ) : (
          <ul className="lista-historial">
            {filas.map((f) => {
              const terminado = f.evento ? eventoFinalizado(f.evento) : false
              const opinion = resenaDe(resenas, f.idEvento, sesion.correo)
              return (
                <li key={f.idEvento} className="item-historial">
                  <div className="historial-imagen">
                    {f.evento ? <ImagenEvento evento={f.evento} /> : <Avatar nombre={f.tituloEvento} />}
                  </div>
                  <div className="historial-info">
                    <h3>{f.tituloEvento}</h3>
                    {f.evento && <p className="atributos">{f.evento.fecha} | {f.evento.lugar}</p>}
                    <p className="atributos">
                      {f.entradas} {f.entradas === 1 ? 'entrada' : 'entradas'} · {f.secciones.join(', ')} · ${f.total.toLocaleString('es-CL')}
                    </p>
                  </div>
                  <div className="historial-estado">
                    <span className={terminado ? 'insignia asistido' : 'insignia proximo'}>
                      {terminado ? 'Asististe' : 'Próximo'}
                    </span>
                    {terminado && opinion && (
                      <p className="tu-nota">Tu nota: <Estrellas valor={opinion.nota} /></p>
                    )}
                    <Link className="enlace-evento" to={`/evento/${f.idEvento}`}>
                      {terminado && !opinion ? 'Calificar' : 'Ver evento'}
                    </Link>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </main>
  )
}

export default Historial
