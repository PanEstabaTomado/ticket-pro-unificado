import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { obtenerUsuarios, validarCredenciales } from '../utils/Usuarios'

function Login() {
  const navigate = useNavigate()

  // Estados: uno por cada dato que cambia en pantalla
  const [nombre, setNombre] = useState('')
  const [contraseña, setContraseña] = useState('')
  const [mostrar, setMostrar] = useState(false)
  const [recordarme, setRecordarme] = useState(false)
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' })
  const [sesion, setSesion] = useState(null)   // null = nadie ha iniciado sesión

  // Equivale a un DOMContentLoaded: Se ejecutara una sola vez al cargar la página
  useEffect(() => {
    obtenerUsuarios()   // Garantizara que MAGAQ exista para probar cualquier cosa.

    const nombreGuardado = localStorage.getItem('sesion_nombre_recordado')
    if (nombreGuardado) {
      setNombre(nombreGuardado)
      setRecordarme(true)
    }

    const guardada =
      localStorage.getItem('sesion_activa') || sessionStorage.getItem('sesion_activa')
    if (guardada) {
      try {
        setSesion(JSON.parse(guardada))
      } catch {
        localStorage.removeItem('sesion_activa')
        sessionStorage.removeItem('sesion_activa')
      }
    }
  }, [])

  const ingresar = () => {
    const nombreLimpio = nombre.trim()

    if (!nombreLimpio || !contraseña) {
      setMensaje({ texto: 'Por favor complete ambos campos.', tipo: 'error' })
      return
    }

    const usuario = validarCredenciales(nombreLimpio, contraseña)

    if (!usuario) {
      setMensaje({ texto: 'Usuario o contraseña incorrectos.', tipo: 'error' })
      return
    }

    if (usuario.esMenorDeEdad) {
      alert('Usuarios Menores de edad no pueden usar los servicios de esta página.')
      return
    }

    setMensaje({ texto: 'Inicio de sesión exitoso.', tipo: 'ok' })

    const datosSesion = { nombre: usuario.nombre, correo: usuario.correo }
    const datosTexto = JSON.stringify(datosSesion)

    // Con "Recordar" la sesión sobrevive al cerrar el navegador (localStorage);
    // sin él, solo dura mientras la pestaña esté abierta (sessionStorage).
    if (recordarme) {
      localStorage.setItem('sesion_activa', datosTexto)
      localStorage.setItem('sesion_nombre_recordado', nombreLimpio)
      sessionStorage.removeItem('sesion_activa')
    } else {
      sessionStorage.setItem('sesion_activa', datosTexto)
      localStorage.removeItem('sesion_activa')
      localStorage.removeItem('sesion_nombre_recordado')
    }

    setTimeout(() => setSesion(datosSesion), 600)
  }

  const cerrarSesion = () => {
    localStorage.removeItem('sesion_activa')
    sessionStorage.removeItem('sesion_activa')
    setSesion(null)
    setContraseña('')
    setMensaje({ texto: '', tipo: '' })
  }

  const volver = () => {
    alert('Redirigiendo a página principal, por favor espere un par de segundos...')
    setTimeout(() => navigate('/'), 3000)
  }

  return (
    <div className="pagina-auth">
      <header>
        <h1 id="titulo_pagina">INICIO DE SESIÓN</h1>
        <p id="subtitulo">Por favor, ingrese los datos que se le solicitan</p>
      </header>

      <main>
        {sesion ? (
          /* Panel de bienvenida: reemplaza a la clase "oculto" */
          <section className="datos_sesion_nombre" id="panel-bienvenida">
            <h2>¡Bienvenido/a!</h2>
            <p>Usuario: <strong>{sesion.nombre}</strong></p>
            <p>Correo electrónico: <strong>{sesion.correo}</strong></p>
            <button onClick={cerrarSesion}>Cerrar sesión</button>
            <button onClick={volver}>Volver al menu principal</button>
          </section>
        ) : (
          <section className="datos_sesion_nombre" id="form-login">
            <h2>Ingrese nombre</h2>
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              placeholder="Escriba su nombre de usuario."
              autoComplete="username"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />

            <h2>Ingrese su contraseña</h2>
            <label htmlFor="contraseña">Contraseña</label>
            <input
              type={mostrar ? 'text' : 'password'}
              id="contraseña"
              placeholder="Escriba su contraseña."
              autoComplete="current-password"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && ingresar()}
            />

            <div className="opciones">
              <label className="check-label">
                <input
                  type="checkbox"
                  id="mostrar-contraseña"
                  checked={mostrar}
                  onChange={(e) => setMostrar(e.target.checked)}
                />
                Mostrar contraseña
              </label>
              <label className="check-label">
                <input
                  type="checkbox"
                  id="recordarme"
                  checked={recordarme}
                  onChange={(e) => setRecordarme(e.target.checked)}
                />
                Recordar inicio de sesión
              </label>
            </div>

            <button id="btn-ingresar" onClick={ingresar}>Ingresar Datos</button>
            <p
              id="datos-registrados"
              className={mensaje.tipo === 'ok' ? 'mensaje-ok' : 'mensaje-error'}
            >
              {mensaje.texto}
            </p>

            <p className="enlace-alternativo">
              <Link to="/registro">Crear nuevo usuario</Link>
            </p>
          </section>
        )}
      </main>
    </div>
  )
}

export default Login