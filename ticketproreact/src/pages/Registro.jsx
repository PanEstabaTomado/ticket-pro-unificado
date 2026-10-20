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
    // Regla de espacios en la contraseña
    const passLimpia = contraseña.trim()

    if (nombre.trim() === '') return setMensaje({ texto: 'El nombre no puede estar vacío.', tipo: 'error' })
    
    // Nuevo mensaje de error por longitud de contraseña
    if (passLimpia === '' || passLimpia.length !== 8)
      return setMensaje({ texto: 'La contraseña debe tener exactamente 8 caracteres.', tipo: 'error' })
    
    if (passLimpia !== confirmar.trim()) return setMensaje({ texto: 'Las contraseñas no coinciden.', tipo: 'error' })
    
    if (!correo.trim().toLowerCase().endsWith('@gmail.com')) return alert('Correo electrónico invalido')
    
    if (fecha === '') return setMensaje({ texto: 'Debe ingresar una fecha de nacimiento.', tipo: 'error' })

    const nombreFinal = capitalizarNombre(nombre)
    const usuarios = obtenerUsuarios()
    
    if (usuarios.some((u) => u.nombre.toLowerCase() === nombreFinal.toLowerCase()))
      return setMensaje({ texto: 'Ese nombre de usuario ya está en uso.', tipo: 'error' })

    const esMenorDeEdad = calcularEdad(fecha) < 18
    
    // COMPROBACIÓN ANTES DE GUARDAR
    if (esMenorDeEdad) {
      return alert('Usuarios Menores de edad no pueden usar los servicios de esta página.')
    }

    guardarUsuarios([...usuarios, { nombre: nombreFinal, correo: correo.trim(), contraseña: passLimpia, esMenorDeEdad }])

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

          <label htmlFor="reg-correo">Correo Electrónico (@gmail.com)</label>
          <input
            type="email"
            id="reg-correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />

          <label htmlFor="reg-contraseña">Contraseña</label>
          <input
            type={mostrar ? 'text' : 'password'}
            id="reg-contraseña"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
          />

          <label htmlFor="reg-confirmar">Confirmar Contraseña</label>
          <input
            type={mostrar ? 'text' : 'password'}
            id="reg-confirmar"
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
          />

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <input
              type="checkbox"
              checked={mostrar}
              onChange={(e) => setMostrar(e.target.checked)}
            />
            Mostrar contraseñas
          </label>

          <label htmlFor="reg-fecha" style={{ marginTop: '1rem' }}>Fecha de Nacimiento</label>
          <input
            type="date"
            id="reg-fecha"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />

          <button onClick={registrar} style={{ marginTop: '1.5rem' }}>Crear cuenta</button>
          
          {mensaje.texto && (
            <p className={mensaje.tipo === 'ok' ? 'mensaje-ok' : 'mensaje-error'}>
              {mensaje.texto}
            </p>
          )}
          
        </section>
      </main>
    </div>
  )
}

export default Registro