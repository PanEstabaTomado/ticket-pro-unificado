import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Avatar from '../components/Avatar'
import { useSesion } from '../utils/Sesion'
import { guardarPerfil, nombreVisible, redimensionarImagen, usePerfil } from '../utils/Perfil'

const MAX_APODO = 24

function Perfil() {
  const navigate = useNavigate()
  const sesion = useSesion()
  const perfil = usePerfil(sesion?.correo)
  const [apodo, setApodo] = useState(perfil.apodo ?? '')
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' })
  const inputArchivo = useRef(null)

  if (!sesion) {
    return (
      <main>
        <section className="seccion-evento">
          <h2>Mi perfil</h2>
          <p className="vacio">Inicia sesión para configurar tu perfil.</p>
          <button type="button" className="btn-primario" onClick={() => navigate('/login')}>Iniciar sesión</button>
        </section>
      </main>
    )
  }

  const guardarApodo = (e) => {
    e.preventDefault()
    guardarPerfil(sesion.correo, { apodo: apodo.trim() })
    setMensaje({ texto: 'Perfil guardado.', tipo: 'ok' })
  }

  const cambiarFoto = async (e) => {
    const archivo = e.target.files?.[0]
    e.target.value = '' // permite volver a elegir el mismo archivo
    if (!archivo) return
    try {
      const foto = await redimensionarImagen(archivo)
      guardarPerfil(sesion.correo, { foto })
      setMensaje({ texto: 'Foto actualizada.', tipo: 'ok' })
    } catch (err) {
      setMensaje({ texto: err.message, tipo: 'error' })
    }
  }

  const quitarFoto = () => {
    guardarPerfil(sesion.correo, { foto: '' })
    setMensaje({ texto: 'Foto eliminada.', tipo: 'ok' })
  }

  return (
    <main>
      <section className="seccion-evento perfil">
        <h2>Mi perfil</h2>

        <div className="perfil-foto">
          <Avatar nombre={nombreVisible(sesion, perfil)} foto={perfil.foto} tamano="xl" />
          <div className="perfil-foto-botones">
            <input
              ref={inputArchivo}
              type="file"
              accept="image/*"
              hidden
              onChange={cambiarFoto}
              aria-label="Elegir foto de perfil"
            />
            <button type="button" className="btn-secundario" onClick={() => inputArchivo.current.click()}>
              {perfil.foto ? 'Cambiar foto' : 'Subir foto'}
            </button>
            {perfil.foto && (
              <button type="button" className="btn-eliminar" onClick={quitarFoto}>Quitar foto</button>
            )}
          </div>
        </div>

        <form className="form-perfil" onSubmit={guardarApodo}>
          <label htmlFor="perfil-apodo">Apodo</label>
          <input
            id="perfil-apodo"
            type="text"
            maxLength={MAX_APODO}
            value={apodo}
            onChange={(e) => setApodo(e.target.value)}
            placeholder={sesion.nombre}
          />
          <small>Es el nombre que verás arriba a la derecha y en tus opiniones. Si lo dejas vacío se usa tu nombre de usuario.</small>

          <label htmlFor="perfil-usuario">Nombre de usuario</label>
          <input id="perfil-usuario" type="text" value={sesion.nombre} readOnly />

          <label htmlFor="perfil-correo">Correo electrónico</label>
          <input id="perfil-correo" type="text" value={sesion.correo} readOnly />

          <button type="submit" className="btn-primario">Guardar cambios</button>
          {mensaje.texto && (
            <p role="status" className={mensaje.tipo === 'ok' ? 'mensaje-ok' : 'mensaje-error'}>{mensaje.texto}</p>
          )}
        </form>
      </section>
    </main>
  )
}

export default Perfil
