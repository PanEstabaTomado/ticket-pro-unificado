import { escribirJSON, leerJSON, useJSON } from './Almacen'

const CLAVE = 'perfiles' // { [correo]: { apodo, foto } }  (foto = data URL)
const VACIO = {}

const clave = (correo) => String(correo ?? '').toLowerCase()

export function usePerfil(correo) {
  const perfiles = useJSON(CLAVE, VACIO)
  return perfiles[clave(correo)] ?? VACIO
}

export function guardarPerfil(correo, datos) {
  const perfiles = leerJSON(CLAVE, {})
  escribirJSON(CLAVE, { ...perfiles, [clave(correo)]: { ...perfiles[clave(correo)], ...datos } })
}

// Lo que se muestra como nombre del usuario en la página.
export function nombreVisible(sesion, perfil) {
  return perfil?.apodo?.trim() || sesion?.nombre || ''
}

// Reduce la foto a un cuadrado pequeño para que quepa cómodo en localStorage (~10-30 KB).
export function redimensionarImagen(archivo, lado = 192) {
  return new Promise((resolver, rechazar) => {
    if (!archivo?.type?.startsWith('image/')) return rechazar(new Error('El archivo no es una imagen.'))
    const url = URL.createObjectURL(archivo)
    const img = new Image()
    img.onload = () => {
      const lienzo = document.createElement('canvas')
      lienzo.width = lienzo.height = lado
      const corte = Math.min(img.width, img.height) // recorte cuadrado centrado
      lienzo
        .getContext('2d')
        .drawImage(img, (img.width - corte) / 2, (img.height - corte) / 2, corte, corte, 0, 0, lado, lado)
      URL.revokeObjectURL(url)
      resolver(lienzo.toDataURL('image/jpeg', 0.85))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      rechazar(new Error('No se pudo leer la imagen.'))
    }
    img.src = url
  })
}
