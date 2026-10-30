
import TarjetaEvento from '../components/TarjetaEvento'
import { eventos } from '../data/Eventos'

function Inicio() {

  return (
    <main>
      {/* Sección Principal */}
      <section className="hero">
        <div className="hero-content">
          <h1>TIENDA ONLINE DE TICKETS</h1>
          <p>
            Ticket Pro es un sitio web en donde puedes navegar de forma rápida para los eventos que estes buscando.
            Descubre y reserva tus entradas para los mejores eventos
            del año. ¡No te quedes fuera nunca más!
          </p>
          <button className="btn-primario">Ver Eventos</button>
        </div>
        <div className="imagen-portada placeholder">
          <span>
            <img
              src="https://st2.depositphotos.com/1177973/8784/i/450/depositphotos_87846188-stock-photo-woman-buying-tickets.jpg"
              style={{ height: '400px' }}
              alt=""
            />
          </span>
        </div>
      </section>

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