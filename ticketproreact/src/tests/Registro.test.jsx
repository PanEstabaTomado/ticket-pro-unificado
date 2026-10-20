import { render, screen, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import Registro from '../pages/Registro'
import { obtenerUsuarios, guardarUsuarios, capitalizarNombre, calcularEdad } from '../utils/Usuarios'

// 1. Mock de react-router-dom usando Vitest
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// 2. Mock de utilidades usando Vitest
vi.mock('../utils/Usuarios', () => ({
  obtenerUsuarios: vi.fn(),
  guardarUsuarios: vi.fn(),
  capitalizarNombre: vi.fn((nombre) => nombre), // Retorna el mismo valor para simplificar
  calcularEdad: vi.fn(),
}))

describe('Componente Registro', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.alert = vi.fn()
    vi.useFakeTimers()
    obtenerUsuarios.mockReturnValue([]) // Por defecto, no hay usuarios registrados
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const renderConRouter = () => render(
    <BrowserRouter>
      <Registro />
    </BrowserRouter>
  )

  it('muestra error si el nombre está vacío', () => {
    renderConRouter()
    
    fireEvent.click(screen.getByText('Crear cuenta'))
    
    expect(screen.getByText('El nombre no puede estar vacío.')).toBeInTheDocument()
  })

  it('muestra error si la contraseña no tiene 8 caracteres', () => {
    renderConRouter()
    
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Juan' } })
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: '123' } })
    fireEvent.click(screen.getByText('Crear cuenta'))
    
    expect(screen.getByText('La contraseña debe tener exactamente 8 caracteres.')).toBeInTheDocument()
  })

  it('muestra error si las contraseñas no coinciden', () => {
    renderConRouter()
    
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Juan' } })
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: '12345678' } })
    fireEvent.change(screen.getByLabelText('Confirmar Contraseña'), { target: { value: '87654321' } })
    fireEvent.click(screen.getByText('Crear cuenta'))
    
    expect(screen.getByText('Las contraseñas no coinciden.')).toBeInTheDocument()
  })

  it('muestra alerta si el correo no es @gmail.com', () => {
    renderConRouter()
    
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Juan' } })
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: '12345678' } })
    fireEvent.change(screen.getByLabelText('Confirmar Contraseña'), { target: { value: '12345678' } })
    fireEvent.change(screen.getByLabelText(/Correo Electrónico/i), { target: { value: 'juan@hotmail.com' } })
    fireEvent.click(screen.getByText('Crear cuenta'))
    
    expect(window.alert).toHaveBeenCalledWith('Correo electrónico invalido')
  })

  it('muestra error si la fecha está vacía', () => {
    renderConRouter()
    
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Juan' } })
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: '12345678' } })
    fireEvent.change(screen.getByLabelText('Confirmar Contraseña'), { target: { value: '12345678' } })
    fireEvent.change(screen.getByLabelText(/Correo Electrónico/i), { target: { value: 'juan@gmail.com' } })
    // No llenamos la fecha
    fireEvent.click(screen.getByText('Crear cuenta'))
    
    expect(screen.getByText('Debe ingresar una fecha de nacimiento.')).toBeInTheDocument()
  })

  it('muestra error si el nombre de usuario ya está en uso', () => {
    obtenerUsuarios.mockReturnValue([{ nombre: 'Juan', correo: 'otro@gmail.com' }])
    capitalizarNombre.mockReturnValue('Juan')
    renderConRouter()
    
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Juan' } })
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: '12345678' } })
    fireEvent.change(screen.getByLabelText('Confirmar Contraseña'), { target: { value: '12345678' } })
    fireEvent.change(screen.getByLabelText(/Correo Electrónico/i), { target: { value: 'juan@gmail.com' } })
    fireEvent.change(screen.getByLabelText(/Fecha de Nacimiento/i), { target: { value: '2000-01-01' } })
    
    fireEvent.click(screen.getByText('Crear cuenta'))
    
    expect(screen.getByText('Ese nombre de usuario ya está en uso.')).toBeInTheDocument()
  })

  it('bloquea el registro con alerta si es menor de edad', () => {
    capitalizarNombre.mockReturnValue('Pedro')
    calcularEdad.mockReturnValue(15) // Simulamos que tiene 15 años
    renderConRouter()
    
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Pedro' } })
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: '12345678' } })
    fireEvent.change(screen.getByLabelText('Confirmar Contraseña'), { target: { value: '12345678' } })
    fireEvent.change(screen.getByLabelText(/Correo Electrónico/i), { target: { value: 'pedro@gmail.com' } })
    fireEvent.change(screen.getByLabelText(/Fecha de Nacimiento/i), { target: { value: '2010-01-01' } })
    
    fireEvent.click(screen.getByText('Crear cuenta'))
    
    expect(window.alert).toHaveBeenCalledWith('Usuarios Menores de edad no pueden usar los servicios de esta página.')
    expect(guardarUsuarios).not.toHaveBeenCalled()
  })

  it('registra al usuario exitosamente y redirige', () => {
    capitalizarNombre.mockReturnValue('Maria')
    calcularEdad.mockReturnValue(25) // Mayor de edad
    renderConRouter()
    
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Maria' } })
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: '12345678' } })
    fireEvent.change(screen.getByLabelText('Confirmar Contraseña'), { target: { value: '12345678' } })
    fireEvent.change(screen.getByLabelText(/Correo Electrónico/i), { target: { value: 'maria@gmail.com' } })
    fireEvent.change(screen.getByLabelText(/Fecha de Nacimiento/i), { target: { value: '1998-01-01' } })
    
    fireEvent.click(screen.getByText('Crear cuenta'))
    
    // Verificamos que se guarda en "base de datos"
    expect(guardarUsuarios).toHaveBeenCalledWith([
      { nombre: 'Maria', correo: 'maria@gmail.com', contraseña: '12345678', esMenorDeEdad: false }
    ])
    
    // Verificamos mensaje de éxito
    expect(screen.getByText('Cuenta creada correctamente. Redirigiendo...')).toBeInTheDocument()
    
    // Avanzamos el tiempo para disparar el setTimeout de 1200ms
    act(() => {
      vi.advanceTimersByTime(1200)
    })
    
    // Verificamos navegación
    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })

  it('permite alternar la visibilidad de las contraseñas', () => {
    renderConRouter()
    
    const inputPass = screen.getByLabelText('Contraseña')
    const inputConf = screen.getByLabelText('Confirmar Contraseña')
    const checkboxMostrar = screen.getByLabelText('Mostrar contraseñas')

    // Estado inicial: oculto
    expect(inputPass).toHaveAttribute('type', 'password')
    expect(inputConf).toHaveAttribute('type', 'password')

    // Hacemos click en el checkbox
    fireEvent.click(checkboxMostrar)

    // Estado final: visible
    expect(inputPass).toHaveAttribute('type', 'text')
    expect(inputConf).toHaveAttribute('type', 'text')
  })
})