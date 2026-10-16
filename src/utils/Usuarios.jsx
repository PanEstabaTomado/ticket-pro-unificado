export const USUARIO_BASE = {
  nombre: 'magaq',
  contraseña: 'pruebasdefullstack2',
  correo: 'magaqfullstack@gmail.com',
  esMenorDeEdad: false
}

export function obtenerUsuarios() {
  try {
    const guardados = localStorage.getItem('usuarios')
    if (guardados) return JSON.parse(guardados)
  } catch (error) {
    console.error('Datos corruptos, se reinicia la lista.', error)
  }
  const listaInicial = [USUARIO_BASE]
  localStorage.setItem('usuarios', JSON.stringify(listaInicial))
  return listaInicial
}

export function guardarUsuarios(lista) {
  localStorage.setItem('usuarios', JSON.stringify(lista))
}

export function validarCredenciales(nombre, contraseña) {
  const usuarios = obtenerUsuarios()
  return usuarios.find(
    (usuario) =>
      usuario.nombre.toLowerCase() === nombre.toLowerCase() &&
      usuario.contraseña === contraseña
  )
}
// Deja cada palabra del nombre con la primera letra en mayúscula
export function capitalizarNombre(nombre) {
  const nombreLimpio = nombre.trim().replace(/\s+/g, ' ')
  return nombreLimpio
    .split(' ')
    .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase())
    .join(' ')
}

// Calcula la edad a partir de una fecha "YYYY-MM-DD" (la que entrega un input type="date")
export function calcularEdad(fechaNacimientoTexto) {
  const hoy = new Date()
  const nacimiento = new Date(fechaNacimientoTexto)

  let edad = hoy.getFullYear() - nacimiento.getFullYear()
  const todaviaNoCumpleEsteAño =
    hoy.getMonth() < nacimiento.getMonth() ||
    (hoy.getMonth() === nacimiento.getMonth() && hoy.getDate() < nacimiento.getDate())

  if (todaviaNoCumpleEsteAño) {
    edad--
  }

  return edad
}
