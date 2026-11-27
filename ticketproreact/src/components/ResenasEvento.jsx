import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Estrellas from './Estrellas'
import { useSesion } from '../utils/Sesion'
import { nombreVisible, usePerfil } from '../utils/Perfil'
import { asistioAlEvento, useCompras } from '../utils/Compras'
import {
  MAX_COMENTARIO,
  REQUIERE_ASISTENCIA,
  guardarResena,
  resenaDe,
  resenasDeEvento,
  useNotaOrganizador,
  useResenas,
} from '../utils/Resenas'

// Opiniones de un evento terminado. La nota que se muestra arriba es la de la EMPRESA organizadora.
function ResenasEvento({ evento, finalizado }) {
  const navigate = useNavigate()
  const sesion = useSesion()
  const perfil = usePerfil(sesion?.correo)
  const compras = useCompras(sesion?.correo)
  const todas = useResenas()
  const notaEmpresa = useNotaOrganizador(evento.organizador)

  const delEvento = resenasDeEvento(todas, evento.id)
  const propia = sesion ? resenaDe(todas, evento.id, sesion.correo) : null

  const [nota, setNota] = useState(propia?.nota ?? 0)
  const [comentario, setComentario] = useState(propia?.comentario ?? '')
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' })

  const puedeOpinar = finalizado && sesion && (!REQUIERE_ASISTENCIA || asistioAlEvento(compras, evento.id))

  const enviar = (e) => {
    e.preventDefault()
    if (nota < 1) return setMensaje({ texto: 'Elige una nota de 1 a 5 estrellas.', tipo: 'error' })
    if (comentario.trim() === '') return setMensaje({ texto: 'Escribe un comentario sobre el evento.', tipo: 'error' })
    guardarResena({
      idEvento: evento.id,
      organizador: evento.organizador,
      correo: sesion.correo,
      autor: nombreVisible(sesion, perfil),
      nota,
      comentario,
    })
    setMensaje({ texto: propia ? 'Tu opinión fue actualizada.' : '¡Gracias! Tu opinión fue publicada.', tipo: 'ok' })
  }

  return (
    <section className="seccion-evento opiniones" id="opiniones" aria-labelledby="titulo-opiniones">
      <h2 id="titulo-opiniones">Opiniones</h2>

      <div className="nota-empresa">
        <div className="nota-numero">
          {notaEmpresa?.cantidad > 0 ? notaEmpresa.promedio.toFixed(1).replace('.', ',') : '–'}
        </div>
        <div>
          <p className="nota-titulo">Nota de {evento.organizador}</p>
          <Estrellas valor={notaEmpresa?.promedio ?? 0} />
          <p className="nota-detalle">
            {notaEmpresa?.cantidad > 0
              ? `${notaEmpresa.cantidad} ${notaEmpresa.cantidad === 1 ? 'opinión' : 'opiniones'} en ${notaEmpresa.eventos} ${notaEmpresa.eventos === 1 ? 'evento' : 'eventos'}. La nota es de la empresa organizadora, no solo de este evento.`
              : 'Esta empresa aún no tiene opiniones.'}
          </p>
        </div>
      </div>

      {!finalizado && (
        <p className="aviso-opinion">Podrás calificar a {evento.organizador} cuando este evento termine.</p>
      )}

      {finalizado && !sesion && (
        <div className="aviso-opinion">
          <p>Inicia sesión para dejar tu opinión sobre este evento.</p>
          <button type="button" className="btn-primario" onClick={() => navigate('/login')}>Iniciar sesión</button>
        </div>
      )}

      {finalizado && sesion && !puedeOpinar && (
        <p className="aviso-opinion">Solo pueden opinar quienes compraron una entrada para este evento.</p>
      )}

      {puedeOpinar && (
        <form className="form-opinion" onSubmit={enviar}>
          <h3>{propia ? 'Editar tu opinión' : 'Deja tu opinión'}</h3>
          <Estrellas valor={nota} onChange={setNota} etiqueta="Nota para la empresa organizadora" />
          <label htmlFor="comentario-opinion">Comentario</label>
          <textarea
            id="comentario-opinion"
            rows="4"
            maxLength={MAX_COMENTARIO}
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="¿Cómo fue la organización, el lugar, el sonido, la atención?"
          />
          <small className="contador">{comentario.length}/{MAX_COMENTARIO}</small>
          <button type="submit" className="btn-primario">{propia ? 'Actualizar opinión' : 'Publicar opinión'}</button>
          {mensaje.texto && (
            <p role="status" className={mensaje.tipo === 'ok' ? 'mensaje-ok' : 'mensaje-error'}>{mensaje.texto}</p>
          )}
        </form>
      )}

      <h3 className="subtitulo-lista">Comentarios sobre este evento ({delEvento.length})</h3>
      {delEvento.length === 0 ? (
        <p className="vacio">Todavía no hay comentarios.</p>
      ) : (
        <ul className="lista-opiniones">
          {delEvento.map((r) => (
            <li key={`${r.correo}-${r.fecha}`} className="opinion">
              <div className="opinion-cabecera">
                <strong>{r.autor}</strong>
                <Estrellas valor={r.nota} />
                <time dateTime={r.fecha}>{new Date(r.fecha).toLocaleDateString('es-CL')}</time>
              </div>
              <p>{r.comentario}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default ResenasEvento
