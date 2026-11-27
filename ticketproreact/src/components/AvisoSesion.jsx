import { useEffect } from 'react'

// Tarjeta que aparece cuando alguien intenta comprar sin haber iniciado sesión.
function AvisoSesion({ onCerrar }) {
  useEffect(() => {
    const cerrarEsc = (e) => e.key === 'Escape' && onCerrar()
    document.addEventListener('keydown', cerrarEsc)
    return () => document.removeEventListener('keydown', cerrarEsc)
  }, [onCerrar])

  return (
    <div className="aviso-fondo" onClick={onCerrar}>
      <div
        className="aviso-tarjeta"
        role="alertdialog"
        aria-labelledby="aviso-titulo"
        aria-describedby="aviso-texto"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="aviso-titulo">No puede comprar productos en TicketPro</h3>
        <p id="aviso-texto">
          Para poder utilizar nuestro servicio para reservar sus tickets, por favor inicie sesión con su cuenta.
        </p>
        <button type="button" className="btn-primario" onClick={onCerrar}>Entendido</button>
      </div>
    </div>
  )
}

export default AvisoSesion
