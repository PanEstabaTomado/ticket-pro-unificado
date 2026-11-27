import { useNavigate } from 'react-router-dom'
import PortadaEventos from '../components/PortadaEventos'
import TarjetaEvento from '../components/TarjetaEvento'
import { eventos } from '../data/Eventos'
import { eventosProximos } from '../utils/Fechas'

const CANTIDAD_EN_PORTADA = 5

function Inicio() {
  const navigate = useNavigate()
  // Los próximos eventos más cercanos; si no queda ninguno, se muestran los del catálogo.
  const proximos = eventosProximos(eventos)
  const destacados = (proximos.length > 0 ? proximos : eventos).slice(0, CANTIDAD_EN_PORTADA)

  return (
    <main>
      {/* Sección Principal */}
      <PortadaEventos eventos={destacados}>
        <h1>TIENDA ONLINE DE TICKETS</h1>
        <p>
          Ticket Pro es un sitio web en donde puedes navegar de forma rápida para los eventos que estes buscando.
          Descubre y reserva tus entradas para los mejores eventos
          del año. ¡No te quedes fuera nunca más!
        </p>
        <button className="btn-primario" onClick={() => navigate('/eventos')}>Ver Eventos</button>
      </PortadaEventos>

      {/* Grilla de Eventos */}

      <section className="seccion-evento">
        <h2>Próximos Eventos</h2>
          <div className="grilla-eventos">
            {eventos.map((evento) => (
            <TarjetaEvento key={evento.id} evento={evento} />))}
          </div>
      </section>

    </main>
  )
}

export default Inicio
