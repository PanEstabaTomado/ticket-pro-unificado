import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ImagenEvento from './ImagenEvento'
import { eventoFinalizado } from '../utils/Fechas'
import { useNotaOrganizador } from '../utils/Resenas'

function TarjetaEvento({ evento }) {
  const navigate = useNavigate()
  const [favorito, setFavorito] = useState(false)
  const finalizado = eventoFinalizado(evento)
  const nota = useNotaOrganizador(evento.organizador)

  return (
    <article className={finalizado ? 'carta-evento finalizado' : 'carta-evento'}>
      <div className="img-evento placeholder">
        <span>
          <ImagenEvento evento={evento} />
        </span>
        {finalizado && <span className="etiqueta-finalizado">Finalizado</span>}
      </div>

      <div className="evento-info">
        <h3>{evento.titulo}</h3>
        <p className="atributos">{evento.fecha} | {evento.lugar}</p>
        {evento.organizador && (
          <p className="organizador-nota">
            {evento.organizador} ·{' '}
            {nota?.cantidad > 0
              ? `★ ${nota.promedio.toFixed(1).replace('.', ',')} (${nota.cantidad})`
              : 'Sin reseñas'}
          </p>
        )}
        <p className="precio">${evento.precio.toLocaleString('es-CL')}</p>
      </div>

      <div className="accion">
        <button className="btn-agregar" onClick={() => navigate(`/evento/${evento.id}`)}>
          {finalizado ? 'Ver reseñas' : 'Añadir al Carrito'}
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
