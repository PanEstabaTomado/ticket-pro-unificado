

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

export function validarCredenciales(correo, contraseña) {
  const usuarios = obtenerUsuarios()
  return usuarios.find(
    (usuario) =>
      usuario.correo.toLowerCase() === correo.toLowerCase() &&
      usuario.contraseña === contraseña
  )
}

export function capitalizarNombre(nombre) {
  return nombre
    .trim()
    .toLowerCase()
    .split(' ')
    .filter((palabra) => palabra !== '')
    .map((palabra) => palabra[0].toUpperCase() + palabra.slice(1))
    .join(' ')
}


export function calcularEdad(fechaNacimiento) {
  const hoy = new Date()
  const nacimiento = new Date(fechaNacimiento)
  let edad = hoy.getFullYear() - nacimiento.getFullYear()
  const yaCumplio =
    hoy.getMonth() > nacimiento.getMonth() ||
    (hoy.getMonth() === nacimiento.getMonth() && hoy.getDate() >= nacimiento.getDate())
  if (!yaCumplio) {
    edad--
  }
  return edad
}