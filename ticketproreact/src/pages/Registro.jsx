import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { obtenerUsuarios, guardarUsuarios, capitalizarNombre, calcularEdad } from '../utils/Usuarios'

function Registro() {
  const navigate = useNavigate()
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [contraseña, setContraseña] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [fecha, setFecha] = useState('')
  const [mostrar, setMostrar] = useState(false)
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' })

  const registrar = () => {
    if (nombre.trim() === '') return setMensaje({ texto: 'El nombre no puede estar vacío.', tipo: 'error' })
    if (contraseña.trim() === '' || contraseña.length !== 8)
      return setMensaje({ texto: 'Contraseña incorrecta', tipo: 'error' })
    if (contraseña !== confirmar) return setMensaje({ texto: 'Las contraseñas no coinciden.', tipo: 'error' })
    if (!correo.trim().toLowerCase().endsWith('@gmail.com')) return alert('Correo electrónico invalido')
    if (fecha === '') return setMensaje({ texto: 'Debe ingresar una fecha de nacimiento.', tipo: 'error' })

    const nombreFinal = capitalizarNombre(nombre)
    const usuarios = obtenerUsuarios()
    if (usuarios.some((u) => u.nombre.toLowerCase() === nombreFinal.toLowerCase()))
      return setMensaje({ texto: 'Ese nombre de usuario ya está en uso.', tipo: 'error' })

    const esMenorDeEdad = calcularEdad(fecha) < 18
    // La propiedad se llama "correo", había un error cuando haciamos el registro antes, quedaba como correo_Nuevo en lugar de correo.
    guardarUsuarios([...usuarios, { nombre: nombreFinal, correo: correo.trim(), contraseña, esMenorDeEdad }])

    if (esMenorDeEdad) return alert('Usuarios Menores de edad no pueden usar los servicios de esta página.')

    setMensaje({ texto: 'Cuenta creada correctamente. Redirigiendo...', tipo: 'ok' })
    setTimeout(() => navigate('/login'), 1200)
  }

  return (
    <div className='pagina-auth'>
      <header>
        <h1 id="titulo_pagina">CREAR NUEVO USUARIO</h1>
      </header>
      <main>
        <section className="datos_sesion_nombre" id="form-registro">
          <label htmlFor="reg-nombre">Nombre</label>
          <input
            type="text"
            id="reg-nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          {/*Aquí nos falta colocar lo mismo con correo, contraseña, la confirmación y la fecha de Nacimiento.*/}
          {/* Lo hago después, estoy cansado por esta noche. */}
          <input
            type={mostrar ? 'text' : 'password'}
            id="reg-contraseña"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
          />
          <input
            type="checkbox"
            checked={mostrar}
            onChange={(e) => setMostrar(e.target.checked)}
          />
          <button onClick={registrar}>Crear cuenta</button>
          <p className={mensaje.tipo === 'ok' ? 'mensaje-ok' : 'mensaje-error'}>{mensaje.texto}</p>
        </section>
      </main>
    </div>
  )
}

export default Registro