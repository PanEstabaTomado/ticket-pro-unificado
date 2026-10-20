import { render, screen, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import Login from '../pages/Login'
import { obtenerUsuarios, validarCredenciales } from '../utils/Usuarios'

// 1. Mock de react-router-dom para Vitest
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// 2. Mock de las utilidades de usuario
vi.mock('../utils/Usuarios', () => ({
  obtenerUsuarios: vi.fn(),
  validarCredenciales: vi.fn(),
}))

// 3. Mock de localStorage y sessionStorage adaptado a Vitest
const mockStorage = () => {
  let store = {}
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = value.toString() }),
    removeItem: vi.fn((key) => { delete store[key] }),
    clear: vi.fn(() => { store = {} }),
  }
}

Object.defineProperty(window, 'localStorage', { value: mockStorage() })
Object.defineProperty(window, 'sessionStorage', { value: mockStorage() })

describe('Componente Login', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.localStorage.clear()
    window.sessionStorage.clear()
    window.alert = vi.fn() // Evita que los alert bloqueen los tests
    vi.useFakeTimers() // Controlamos el tiempo por los setTimeout
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  // Función auxiliar para renderizar con el Router
  const renderConRouter = () => render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  )

  it('renderiza correctamente el formulario inicial', () => {
    renderConRouter()
    expect(screen.getByPlaceholderText('Correo electrónico.')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Escriba su contraseña.')).toBeInTheDocument()
    expect(screen.getByText('Ingresar Datos')).toBeInTheDocument()
  })

  it('muestra error si los campos están vacíos', () => {
    renderConRouter()
    
    fireEvent.click(screen.getByText('Ingresar Datos'))
    
    expect(screen.getByText('Por favor complete ambos campos.')).toBeInTheDocument()
  })

  it('muestra error con credenciales incorrectas', () => {
    validarCredenciales.mockReturnValue(null) // Simulamos que no encuentra el usuario
    renderConRouter()

    fireEvent.change(screen.getByPlaceholderText('Correo electrónico.'), { target: { value: 'test@gmail.com' } })
    fireEvent.change(screen.getByPlaceholderText('Escriba su contraseña.'), { target: { value: '12345678' } })
    fireEvent.click(screen.getByText('Ingresar Datos'))

    expect(validarCredenciales).toHaveBeenCalledWith('test@gmail.com', '12345678')
    expect(screen.getByText('Usuario o contraseña incorrectos.')).toBeInTheDocument()
  })

  it('alerta si el usuario es menor de edad', () => {
    validarCredenciales.mockReturnValue({ correo: 'menor@gmail.com', esMenorDeEdad: true })
    renderConRouter()

    fireEvent.change(screen.getByPlaceholderText('Correo electrónico.'), { target: { value: 'menor@gmail.com' } })
    fireEvent.change(screen.getByPlaceholderText('Escriba su contraseña.'), { target: { value: '12345678' } })
    fireEvent.click(screen.getByText('Ingresar Datos'))

    expect(window.alert).toHaveBeenCalledWith('Usuarios Menores de edad no pueden usar los servicios de esta página.')
  })

  it('inicio de sesión exitoso sin "recordarme" (usa sessionStorage)', () => {
    validarCredenciales.mockReturnValue({ nombre: 'Juan', correo: 'juan@gmail.com', esMenorDeEdad: false })
    renderConRouter()

    fireEvent.change(screen.getByPlaceholderText('Correo electrónico.'), { target: { value: 'juan@gmail.com' } })
    fireEvent.change(screen.getByPlaceholderText('Escriba su contraseña.'), { target: { value: '12345678' } })
    
    fireEvent.click(screen.getByText('Ingresar Datos'))

    expect(screen.getByText('Inicio de sesión exitoso.')).toBeInTheDocument()
    expect(window.sessionStorage.setItem).toHaveBeenCalledWith(
      'sesion_activa',
      JSON.stringify({ nombre: 'Juan', correo: 'juan@gmail.com' })
    )

    // Avanzamos los 600ms del setTimeout
    act(() => {
      vi.advanceTimersByTime(600)
    })

    // Verificamos que aparece el panel de bienvenida
    expect(screen.getByText('¡Bienvenido/a!')).toBeInTheDocument()
    expect(screen.getByText('juan@gmail.com')).toBeInTheDocument()
  })

  it('permite mostrar y ocultar la contraseña', () => {
    renderConRouter()
    
    const inputContraseña = screen.getByPlaceholderText('Escriba su contraseña.')
    const checkboxMostrar = screen.getByLabelText('Mostrar contraseña')

    expect(inputContraseña).toHaveAttribute('type', 'password')

    fireEvent.click(checkboxMostrar)
    expect(inputContraseña).toHaveAttribute('type', 'text')
  })

  it('cerrar sesión limpia los storages y vuelve al formulario', () => {
    // Simulamos una sesión ya activa
    window.localStorage.getItem.mockImplementation((key) => {
      if (key === 'sesion_activa') return JSON.stringify({ nombre: 'Juan', correo: 'juan@gmail.com' })
      return null
    })

    renderConRouter()

    const btnCerrar = screen.getByText('Cerrar sesión')
    fireEvent.click(btnCerrar)

    expect(window.localStorage.removeItem).toHaveBeenCalledWith('sesion_activa')
    expect(window.sessionStorage.removeItem).toHaveBeenCalledWith('sesion_activa')
    expect(screen.getByPlaceholderText('Correo electrónico.')).toBeInTheDocument()
  })

  it('volver al menú principal dispara el timeout y redirige', () => {
    // Simulamos una sesión ya activa
    window.localStorage.getItem.mockImplementation((key) => {
      if (key === 'sesion_activa') return JSON.stringify({ nombre: 'Juan', correo: 'juan@gmail.com' })
      return null
    })

    renderConRouter()

    const btnVolver = screen.getByText('Volver al menu principal')
    fireEvent.click(btnVolver)

    expect(window.alert).toHaveBeenCalledWith('Redirigiendo a página principal, por favor espere un par de segundos...')
    
    // Avanzamos el setTimeout de 3000ms
    act(() => {
      vi.advanceTimersByTime(3000)
    })

    expect(mockNavigate).toHaveBeenCalledWith('/')
  })
})