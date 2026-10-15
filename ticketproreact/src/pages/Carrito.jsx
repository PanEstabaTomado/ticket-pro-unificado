import { useCarrito } from '../context/CarritoContext'

function Carrito() {
  const { carrito, eliminar, vaciar, total } = useCarrito()

  const pagar = () => {
    if (carrito.length === 0) {
      alert('El carrito está vacío. Agrega entradas antes de pagar.')
      return
    }
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
          <button className="btn-primario" onClick={pagar}>Proceder al Pago</button>
        </div>
      </section>
    </main>
  )
}

export default Carrito