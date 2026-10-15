import { useNavigate } from 'react-router-dom'

function Inicio() {
  const navigate = useNavigate()

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

          {/* Tarjeta de evento 1 */}
          <article className="carta-evento">
            <div className="img-evento placeholder">
              <span>
                <img
                  src="https://www.rockandpop.cl/wp-content/uploads/2024/01/mxmf-Fest-768x432.webp"
                  style={{ height: '200px' }}
                  alt=""
                />
              </span>
            </div>
            <div className="evento-info">
              <h3>Concierto de Rock</h3>
              <p className="atributos">Fecha: 25 Oct | Estadio Nacional</p>
              <p className="precio">$50.000</p>
            </div>
            <div className="accion">
              <button className="btn-agregar" onClick={() => navigate('/evento/evento-1')}>
                Añadir al Carrito
              </button>
              <button className="btn-fav" aria-label="Añadir a favoritos">
                <i className="far fa-heart"></i>
              </button>
            </div>
          </article>

          {/* Tarjeta de evento 2 */}
          <article className="carta-evento">
            <div className="img-evento placeholder">
              <span>
                <img
                  src="https://static.nationalgeographicla.com/files/styles/image_3200/public/mm9901_220313_01614.jpg?w=1600"
                  style={{ height: '250px' }}
                  alt=""
                />
              </span>
            </div>
            <div className="evento-info">
              <h3>Obra de Teatro</h3>
              <p className="atributos">Fecha: 02 Nov | Teatro Municipal</p>
              <p className="precio">$15.000</p>
            </div>
            <div className="accion">
              <button className="btn-agregar" onClick={() => navigate('/evento/evento-2')}>
                Añadir al Carrito
              </button>
              <button className="btn-fav" aria-label="Añadir a favoritos">
                <i className="far fa-heart"></i>
              </button>
            </div>
          </article>

        </div>
      </section>
    </main>
  )
}

export default Inicio