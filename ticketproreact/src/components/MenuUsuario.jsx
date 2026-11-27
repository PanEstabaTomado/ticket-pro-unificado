import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Avatar from './Avatar'
import { cerrarSesion } from '../utils/Sesion'
import { nombreVisible, usePerfil } from '../utils/Perfil'

// Botón con contorno dorado arriba a la derecha: foto + nombre. Al pulsarlo abre el menú de la cuenta.
function MenuUsuario({ sesion }) {
  const navigate = useNavigate()
  const perfil = usePerfil(sesion.correo)
  const [abierto, setAbierto] = useState(false)
  const contenedor = useRef(null)
  const nombre = nombreVisible(sesion, perfil)

  useEffect(() => {
    if (!abierto) return
    const cerrarFuera = (e) => {
      if (contenedor.current && !contenedor.current.contains(e.target)) setAbierto(false)
    }
    const cerrarEsc = (e) => e.key === 'Escape' && setAbierto(false)
    document.addEventListener('mousedown', cerrarFuera)
    document.addEventListener('keydown', cerrarEsc)
    return () => {
      document.removeEventListener('mousedown', cerrarFuera)
      document.removeEventListener('keydown', cerrarEsc)
    }
  }, [abierto])

  const salir = () => {
    setAbierto(false)
    cerrarSesion()
    navigate('/')
  }

  return (
    <div className="menu-usuario" ref={contenedor}>
      <button
        type="button"
        className="chip-usuario"
        aria-haspopup="menu"
        aria-expanded={abierto}
        onClick={() => setAbierto(!abierto)}
      >
        <Avatar nombre={nombre} foto={perfil.foto} tamano="sm" />
        <span className="chip-nombre">{nombre}</span>
        <span className="chip-flecha" aria-hidden="true">▾</span>
      </button>

      {abierto && (
        <div className="menu-desplegable" role="menu">
          <div className="menu-cabecera">
            <Avatar nombre={nombre} foto={perfil.foto} tamano="lg" />
            <div>
              <strong>{nombre}</strong>
              <small>Usuario: {sesion.nombre}</small>
              <small>{sesion.correo}</small>
            </div>
          </div>
          <Link role="menuitem" to="/perfil" onClick={() => setAbierto(false)}>Mi perfil</Link>
          <Link role="menuitem" to="/historial" onClick={() => setAbierto(false)}>Historial de eventos</Link>
          <button role="menuitem" type="button" onClick={salir}>Cerrar sesión</button>
        </div>
      )}
    </div>
  )
}

export default MenuUsuario
