import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { eventos } from '../data/Eventos'
import { useCarrito } from '../context/CarritoContext'

function Evento() {
  // 1. Todos los hooks van primero, siempre
  const { id } = useParams()
  const navigate = useNavigate()
  const { agregar } = useCarrito()
  const [cantidad, setCantidad] = useState(0)

  // 2. Buscar el evento cuyo id coincida con el de la dirección
  const evento = eventos.find((e) => e.id === id)

  // 3. Si no existe, se muestra un mensaje y se detiene aquí
  if (!evento) {
    return <p>Evento no encontrado</p>
  }

  // 4. Valores calculados (no necesitan su propio estado)
  const seccion = evento.secciones[0]
  const total = cantidad * seccion.precioSeccion

  // 5. Funciones de los botones
  const sumar = () => setCantidad(cantidad + 1)

  const restar = () => {
    if (cantidad > 0) {
      setCantidad(cantidad - 1)
    }
  }

  const comprar = () => {
    if (cantidad === 0) {
      alert('Debes seleccionar al menos 1 entrada.')
      return
    }

    agregar({
      idEvento: evento.id,
      tituloEvento: evento.titulo,
      nombreSeccion: seccion.nombre,
      precioUnitario: seccion.precioSeccion,
      cantidad: cantidad,
      subtotal: total
    })

    alert('Se agregaron exitosamente las entradas al carrito.')
    navigate('/carrito')
  }

  // 6. Lo que se muestra en pantalla
  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <h1>Evento</h1>
        </div>
        <div className="imagen-portada placeholder">
          <span id="imagen-evento"></span>
        </div>
      </section>

      <section className="seccion-evento">
        <div id="evento-datos">
          <p className="titulo">{evento.titulo}</p>
          <p className="tipo">{evento.tipo}</p>
          <p className="fecha">{evento.fecha}</p>
          <p className="hora">{evento.hora}</p>
          <p className="lugar">{evento.lugar}</p>
          <p className="direccion">{evento.direccion}</p>
          <p className="precio">{evento.precio}</p>
          <p className="categoria">{evento.categoria}</p>
          <p className="duracion">{evento.duracion}</p>
          <p className="edadMinima">{evento.edadMinima}</p>
          <p className="estado">{evento.estado}</p>
          <p className="organizador">{evento.organizador}</p>
          <p className="descripcion">{evento.descripcion}</p>
        </div>
      </section>

      <section className="secciones-evento">
        <div className="opciones-compra">
          <label>Selecciona tu ubicación:</label>
          <ul className="lista-secciones">
            {evento.secciones.map((s) => (
              <li key={s.id} className="seccion">
                <h3>{s.nombre}</h3>
                <p>Precio: ${s.precioSeccion.toLocaleString('es-CL')}</p>
                <p>Capacidad: {s.capacidad}</p>
              </li>
            ))}
          </ul>

          <div className="selector-cantidad">
            <button onClick={restar}>-</button>
            <span>{cantidad}</span>
            <button onClick={sumar}>+</button>
          </div>

          <div>
            <p>Total: <strong>$ {total.toLocaleString('es-CL')}</strong></p>
            <button className="btn-primario" onClick={comprar}>Añadir al Carrito</button>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Evento