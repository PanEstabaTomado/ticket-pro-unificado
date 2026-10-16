import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
    // La propiedad se llama "correo" (antes quedaba con otro nombre y el login no la encontraba).
    guardarUsuarios([...usuarios, { nombre: nombreFinal, correo: correo.trim(), contraseña, esMenorDeEdad }])

    if (esMenorDeEdad) return alert('Usuarios Menores de edad no pueden usar los servicios de esta página.')

    setMensaje({ texto: 'Cuenta creada correctamente. Redirigiendo...', tipo: 'ok' })
    setTimeout(() => navigate('/login'), 1200)
  }

  return (
    <div className="pagina-auth">
      <header>
        <h1 id="titulo_pagina">CREAR NUEVO USUARIO</h1>
        <p id="subtitulo">Complete los datos para registrar una cuenta</p>
      </header>

      <main>
        <section className="datos_sesion_nombre" id="form-registro">
          <h2>Ingrese nombre de usuario</h2>
          <label htmlFor="reg-nombre">Nombre</label>
          <input
            type="text"
            id="reg-nombre"
            placeholder="Escriba un nombre de usuario."
            autoComplete="username"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          <h2>Ingrese correo electrónico</h2>
          <label htmlFor="reg-correo">Correo electrónico</label>
          <input
            type="email"
            id="reg-correo"
            placeholder="Escriba un correo electrónico."
            autoComplete="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />

          <h2>Ingrese contraseña</h2>
          <label htmlFor="reg-contraseña">Contraseña</label>
          <input
            type={mostrar ? 'text' : 'password'}
            id="reg-contraseña"
            placeholder="Escriba una contraseña."
            autoComplete="new-password"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
          />

          <h2>Confirme contraseña</h2>
          <label htmlFor="reg-confirmar">Confirmar contraseña</label>
          <input
            type={mostrar ? 'text' : 'password'}
            id="reg-confirmar"
            placeholder="Repita la contraseña."
            autoComplete="new-password"
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
          />

          <div className="opciones">
            <label className="check-label">
              <input
                type="checkbox"
                id="reg-mostrar-contraseña"
                checked={mostrar}
                onChange={(e) => setMostrar(e.target.checked)}
              />
              Mostrar contraseña
            </label>
          </div>

          <h2>Ingrese fecha de nacimiento</h2>
          <label htmlFor="reg-fecha-nacimiento">Fecha de nacimiento</label>
          <input
            type="date"
            id="reg-fecha-nacimiento"
            autoComplete="bday"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />

          <button id="btn-registrar" onClick={registrar}>Crear cuenta</button>
          <p
            id="registro-mensaje"
            className={mensaje.tipo === 'ok' ? 'mensaje-ok' : 'mensaje-error'}
          >
            {mensaje.texto}
          </p>

          <p className="enlace-alternativo">
            <Link to="/login">¿Ya tiene una cuenta? Inicie sesión</Link>
          </p>
        </section>
      </main>
    </div>
  )
}

export default Registro
