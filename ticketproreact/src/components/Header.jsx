import { Link, useNavigate } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext'
import { useSesion } from '../utils/Sesion'
import BotonTema from './BotonTema'
import MenuUsuario from './MenuUsuario'

function Header() {
  const navigate = useNavigate()
  const { cantidadTotal } = useCarrito()
  const sesion = useSesion()

  return (
    <header>
      <nav className="navbar">
        <div className="navbar-izquierda">
          <div className="logo">Ticket Pro</div>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/eventos">Eventos</Link></li>
          </ul>
        </div>

        <div className="navbar-derecha">
          <button type="button" className="carrito" onClick={() => navigate('/carrito')}>
            <i className="fas fa-shopping-cart"></i> Carrito ({cantidadTotal})
          </button>
          <BotonTema />
          {sesion ? (
            <MenuUsuario sesion={sesion} />
          ) : (
            <div className="auth-links">
              <button type="button" className="btn-auth" onClick={() => navigate('/login')}>Inicio de sesión</button>
              <button type="button" className="btn-auth destacado" onClick={() => navigate('/registro')}>Registrarse</button>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Header
