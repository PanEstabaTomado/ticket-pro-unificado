import { useState } from 'react'

// Muestra la imagen del evento. Si no tiene o el archivo no existe en /public/img,
// muestra un bloque con el tipo de evento en vez de un ícono roto.
function ImagenEvento({ evento, className = '' }) {
  const [fallo, setFallo] = useState(false)

  if (!evento.imagen || fallo) {
    return (
      <div className={`imagen-respaldo ${className}`} role="img" aria-label={evento.titulo}>
        <span>{evento.tipo || evento.titulo}</span>
      </div>
    )
  }
  return <img className={className} src={evento.imagen} alt={evento.titulo} onError={() => setFallo(true)} />
}

export default ImagenEvento
