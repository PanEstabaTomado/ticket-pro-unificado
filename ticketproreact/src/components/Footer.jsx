import { Link, useNavigate } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext'

function Footer() {
  const navigate = useNavigate()
  const { cantidadTotal } = useCarrito()

  return (
        <footer>
            <div className="footer-content">
                <div className="footer-logo">Ticket Pro</div>
                <div className="footer-categorias">
                    <span>Categoría Conciertos</span> |
                    <span>Categoría Teatro</span> |
                    <span>Categoría Deportes</span>
                </div>
                <div className="contacto">
                    <p>Mantente en contacto | Únete a nuestro equipo</p>
                    <form action="#" className="contacto-form">
                        <input type="email" placeholder="Ingresa Email" required/>
                        <button type="submit">Subscribe</button>
                    </form>
                </div>
            </div>
        </footer>
    )
}

export default Footer