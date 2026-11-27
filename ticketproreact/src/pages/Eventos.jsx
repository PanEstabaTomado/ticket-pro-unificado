import TarjetaEvento from '../components/TarjetaEvento'
import { eventos } from '../data/Eventos'
import { eventoFinalizado, inicioDelEvento } from '../utils/Fechas'

const porFecha = (a, b) => (inicioDelEvento(a) ?? 0) - (inicioDelEvento(b) ?? 0)

function Eventos() {
  const disponibles = eventos.filter((e) => !eventoFinalizado(e)).sort(porFecha)
  const finalizados = eventos.filter((e) => eventoFinalizado(e)).sort((a, b) => porFecha(b, a))

  return (
    <main>
      <section className="seccion-evento">
        <h2>Eventos disponibles</h2>
        {disponibles.length === 0 ? (
          <p className="vacio">No hay eventos disponibles por ahora. Vuelve pronto.</p>
        ) : (
          <div className="grilla-eventos">
            {disponibles.map((evento) => (
              <TarjetaEvento key={evento.id} evento={evento} />
            ))}
          </div>
        )}
      </section>

      {finalizados.length > 0 && (
        <section className="seccion-evento">
          <h2>Eventos finalizados</h2>
          <p className="ayuda">Si asististe, puedes calificar a la empresa organizadora desde su evento.</p>
          <div className="grilla-eventos">
            {finalizados.map((evento) => (
              <TarjetaEvento key={evento.id} evento={evento} />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}

export default Eventos
