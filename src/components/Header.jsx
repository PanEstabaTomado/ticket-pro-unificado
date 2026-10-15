import { Link, useNavigate } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext'

function Header() {
  const navigate = useNavigate()
  const { cantidadTotal } = useCarrito()

  return (
    <header>
      <nav className="navbar">
        <div className="logo">Ticket Pro</div>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          {/* Las demás páginas aún no existen; déjelas para después */}
        </ul>
        <div className="carrito" onClick={() => navigate('/carrito')}>
          <i className="fas fa-shopping-cart"></i> Carrito ({cantidadTotal})
        </div>
      </nav>
      <div className="auth-links">
        <Link to="/login">Iniciar sesión</Link> | <Link to="/registro">Registrar usuario</Link>
      </div>
    </header>
  )
}

export default Header