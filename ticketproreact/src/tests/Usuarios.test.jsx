import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  USUARIO_BASE,
  obtenerUsuarios,
  guardarUsuarios,
  validarCredenciales,
  capitalizarNombre,
  calcularEdad
} from '../utils/Usuarios'

// Mock de localStorage nativo
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = value.toString() }),
    clear: vi.fn(() => { store = {} })
  }
})()
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

describe('Utilidades de Usuarios', () => {
  
  beforeEach(() => {
    window.localStorage.clear()
    vi.clearAllMocks()
  })

  describe('obtenerUsuarios', () => {
    it('retorna la lista con el usuario base si localStorage está vacío', () => {
      const usuarios = obtenerUsuarios()
      expect(usuarios).toHaveLength(1)
      expect(usuarios[0]).toEqual(USUARIO_BASE)
      expect(window.localStorage.setItem).toHaveBeenCalledWith('usuarios', JSON.stringify([USUARIO_BASE]))
    })

    it('retorna los usuarios guardados si existen en localStorage', () => {
      const mockUsuarios = [{ nombre: 'Juan', correo: 'juan@test.com' }]
      window.localStorage.setItem('usuarios', JSON.stringify(mockUsuarios))
      
      const usuarios = obtenerUsuarios()
      expect(usuarios).toEqual(mockUsuarios)
    })

    it('reinicia la lista si los datos en localStorage están corruptos', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      window.localStorage.setItem('usuarios', 'esto-no-es-json-valido')
      
      const usuarios = obtenerUsuarios()
      expect(usuarios).toEqual([USUARIO_BASE])
      expect(consoleSpy).toHaveBeenCalled()
      
      consoleSpy.mockRestore()
    })
  })

  describe('guardarUsuarios', () => {
    it('guarda correctamente la lista en formato JSON en localStorage', () => {
      const nuevaLista = [{ nombre: 'Ana', correo: 'ana@test.com' }]
      guardarUsuarios(nuevaLista)
      expect(window.localStorage.setItem).toHaveBeenCalledWith('usuarios', JSON.stringify(nuevaLista))
    })
  })

  describe('validarCredenciales', () => {
    beforeEach(() => {
      window.localStorage.setItem('usuarios', JSON.stringify([
        USUARIO_BASE,
        { correo: 'juan@gmail.com', contraseña: 'password123' }
      ]))
    })

    it('retorna el usuario si el correo y la contraseña coinciden', () => {
      const usuario = validarCredenciales('juan@gmail.com', 'password123')
      expect(usuario).toBeDefined()
      expect(usuario.correo).toBe('juan@gmail.com')
    })

    it('ignora las mayúsculas en el correo al validar', () => {
      const usuario = validarCredenciales('JUAN@GMAIL.COM', 'password123')
      expect(usuario).toBeDefined()
    })

    it('retorna undefined si la contraseña es incorrecta', () => {
      const usuario = validarCredenciales('juan@gmail.com', 'mala-pass')
      expect(usuario).toBeUndefined()
    })

    it('retorna undefined si el correo no existe', () => {
      const usuario = validarCredenciales('no-existo@gmail.com', 'password123')
      expect(usuario).toBeUndefined()
    })
  })

  describe('capitalizarNombre', () => {
    it('capitaliza correctamente un nombre simple', () => {
      expect(capitalizarNombre('juan')).toBe('Juan')
    })

    it('capitaliza nombres compuestos ignorando espacios extra', () => {
      expect(capitalizarNombre('  juan   pablo  ')).toBe('Juan Pablo')
    })

    it('corrige las mayúsculas y minúsculas desordenadas', () => {
      expect(capitalizarNombre('jUaN pAbLo')).toBe('Juan Pablo')
    })
  })

  describe('calcularEdad', () => {
    beforeEach(() => {
      // Congelamos el tiempo en una fecha específica (ej: 2026-10-19)
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2026-10-19T12:00:00Z'))
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('calcula la edad correctamente si ya cumplió años este año', () => {
      // Nació en mayo de 2000, estamos en octubre de 2026 -> 26 años
      expect(calcularEdad('2000-05-10')).toBe(26)
    })

    it('resta un año si aún no cumple años este año', () => {
      // Nació en noviembre de 2000, estamos en octubre de 2026 -> 25 años
      expect(calcularEdad('2000-11-25')).toBe(25)
    })

    it('calcula la edad correctamente si hoy es su cumpleaños exacto', () => {
      // Nació el 19 de octubre de 2000, hoy es 19 de octubre de 2026 -> 26 años
      expect(calcularEdad('2000-10-19')).toBe(26)
    })
  })
})