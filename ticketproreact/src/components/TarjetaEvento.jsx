import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function TarjetaEvento({ evento }) {
  const navigate = useNavigate()
  const [favorito, setFavorito] = useState(false)

  return (
    <article className="carta-evento">
      <div className="img-evento placeholder">
        <span>
          <img src={evento.imagen} alt={evento.titulo} />
        </span>
      </div>

      <div className="evento-info">
        <h3>{evento.titulo}</h3>
        <p className="atributos">{evento.fecha} | {evento.lugar}</p>
        <p className="precio">${evento.precio.toLocaleString('es-CL')}</p>
      </div>

      <div className="accion">
        <button className="btn-agregar" onClick={() => navigate(`/evento/${evento.id}`)}>
          Añadir al Carrito
        </button>
        <button
          className="btn-fav"
          aria-label="Añadir a favoritos"
          onClick={() => setFavorito(!favorito)}
        >
          {favorito ? '♥' : '♡'}
        </button>
      </div>
    </article>
  )
}

export default TarjetaEvento