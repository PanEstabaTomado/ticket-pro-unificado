import { useState } from 'react'
import { useCarrito } from '../context/CarritoContext'
import { useSesion } from '../utils/Sesion'
import { registrarCompra } from '../utils/Compras'
import AvisoSesion from '../components/AvisoSesion'

function Carrito() {
  const { carrito, eliminar, vaciar, total } = useCarrito()
  const sesion = useSesion()
  const [mostrarAviso, setMostrarAviso] = useState(false)
  const [error, setError] = useState('')

  const pagar = () => {
    // Sin sesión no se puede comprar: se muestra la tarjeta de aviso.
    if (!sesion) {
      setMostrarAviso(true)
      return
    }
    if (carrito.length === 0) {
      setError('El carrito está vacío. Agrega entradas antes de pagar.')
      return
    }
    setError('')
    // La compra queda en el "Historial de eventos" del usuario.
    registrarCompra(sesion.correo, carrito)
    alert('Compra realizada con éxito!')
    vaciar()
  }

  return (
    <main>
      <section className="seccion-evento">
        <h2>Entradas Seleccionadas</h2>
        <ul className="lista-carrito">
          {carrito.length === 0 ? (
            <li className="item-carrito"><p>Tu carrito está vacío.</p></li>
          ) : (
            carrito.map((item, i) => (
              <li className="item-carrito" key={i}>
                <div>
                  <strong>{item.tituloEvento}</strong>
                  <p>Ubicación: {item.nombreSeccion}</p>
                  <p>Cantidad: {item.cantidad}</p>
                  <p>Precio Unitario: ${item.precioUnitario.toLocaleString('es-CL')}</p>
                </div>
                <div>
                  <p><strong>Subtotal: ${item.subtotal.toLocaleString('es-CL')}</strong></p>
                  <button className="btn-eliminar" onClick={() => eliminar(i)}>Eliminar</button>
                </div>
              </li>
            ))
          )}
        </ul>
        <div className="resumen-compra">
          <p>Total a Pagar: <strong>$ {total.toLocaleString('es-CL')}</strong></p>
          {!sesion && carrito.length > 0 && (
            <p className="ayuda">Debes iniciar sesión para poder pagar tus entradas.</p>
          )}
          <button className="btn-primario" onClick={pagar}>Proceder al Pago</button>
          {error && <p role="alert" className="mensaje-error">{error}</p>}
        </div>
      </section>
      {mostrarAviso && <AvisoSesion onCerrar={() => setMostrarAviso(false)} />}
    </main>
  )
}

export default Carrito