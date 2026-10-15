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