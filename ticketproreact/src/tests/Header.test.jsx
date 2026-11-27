import '@testing-library/jest-dom/vitest'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import Header from '../components/Header'
import { CarritoProvider } from '../context/CarritoContext'

afterEach(() => {
  cleanup()
  localStorage.clear()
  sessionStorage.clear()
  delete document.documentElement.dataset.tema
})

function renderEn(ui) {
  return render(
    <MemoryRouter>
      <CarritoProvider>{ui}</CarritoProvider>
    </MemoryRouter>
  )
}

describe('Header', () => {
  it('muestra el logo y los enlaces principales', () => {
    renderEn(<Header />)
    expect(screen.getByText('Ticket Pro')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('button', { name: 'Inicio de sesión' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Registrarse' })).toBeInTheDocument()
  })

  it('al hacer clic en Registrarse redirige a /registro', async () => {
    const user = userEvent.setup()
    renderEn(
      <Routes>
        <Route path="/" element={<Header />} />
        <Route path="/registro" element={<p>Pantalla de registro</p>} />
      </Routes>
    )
    await user.click(screen.getByRole('button', { name: 'Registrarse' }))
    expect(screen.getByText('Pantalla de registro')).toBeInTheDocument()
  })

  it('el carrito parte en 0', () => {
    renderEn(<Header />)
    expect(screen.getByText(/Carrito \(0\)/)).toBeInTheDocument()
  })

  it('el contador suma las entradas guardadas en el carrito', () => {
    localStorage.setItem('carrito', JSON.stringify([
      { cantidad: 2, subtotal: 100000 },
      { cantidad: 1, subtotal: 15000 },
    ]))
    renderEn(<Header />)
    expect(screen.getByText(/Carrito \(3\)/)).toBeInTheDocument()
  })

  it('al hacer clic en Carrito redirige a /carrito', async () => {
    const user = userEvent.setup()
    renderEn(
      <Routes>
        <Route path="/" element={<Header />} />
        <Route path="/carrito" element={<p>Pantalla del carrito</p>} />
      </Routes>
    )
    await user.click(screen.getByText(/Carrito \(0\)/))
    expect(screen.getByText('Pantalla del carrito')).toBeInTheDocument()
  })

  it('al hacer clic en Inicio de sesión redirige a /login', async () => {
    const user = userEvent.setup()
    renderEn(
      <Routes>
        <Route path="/" element={<Header />} />
        <Route path="/login" element={<p>Pantalla de login</p>} />
      </Routes>
    )
    await user.click(screen.getByRole('button', { name: 'Inicio de sesión' }))
    expect(screen.getByText('Pantalla de login')).toBeInTheDocument()
  })

  it('sin sesión no se ve ningún usuario', () => {
    renderEn(<Header />)
    expect(screen.queryByRole('button', { name: /Magaq/ })).not.toBeInTheDocument()
  })

  it('con sesión muestra el nombre de usuario arriba a la derecha en lugar de los enlaces de login', () => {
    localStorage.setItem('sesion_activa', JSON.stringify({ nombre: 'Magaq', correo: 'magaq@gmail.com' }))
    renderEn(<Header />)
    expect(screen.getByRole('button', { name: /Magaq/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Inicio de sesión' })).not.toBeInTheDocument()
  })

  it('el apodo del perfil reemplaza al nombre de usuario', () => {
    localStorage.setItem('sesion_activa', JSON.stringify({ nombre: 'Magaq', correo: 'magaq@gmail.com' }))
    localStorage.setItem('perfiles', JSON.stringify({ 'magaq@gmail.com': { apodo: 'El Mago' } }))
    renderEn(<Header />)
    expect(screen.getByRole('button', { name: /El Mago/ })).toBeInTheDocument()
  })

  it('el menú de usuario ofrece perfil, historial y cerrar sesión; cerrar sesión limpia la sesión', async () => {
    const user = userEvent.setup()
    sessionStorage.setItem('sesion_activa', JSON.stringify({ nombre: 'Magaq', correo: 'magaq@gmail.com' }))
    renderEn(<Header />)
    await user.click(screen.getByRole('button', { name: /Magaq/ }))
    expect(screen.getByRole('menuitem', { name: 'Mi perfil' })).toHaveAttribute('href', '/perfil')
    expect(screen.getByRole('menuitem', { name: 'Historial de eventos' })).toHaveAttribute('href', '/historial')
    await user.click(screen.getByRole('menuitem', { name: 'Cerrar sesión' }))
    expect(sessionStorage.getItem('sesion_activa')).toBeNull()
    expect(screen.getByRole('button', { name: 'Inicio de sesión' })).toBeInTheDocument()
  })

  it('el botón de tema alterna entre oscuro y claro y lo recuerda', async () => {
    const user = userEvent.setup()
    renderEn(<Header />)
    await user.click(screen.getByRole('button', { name: 'Cambiar a modo claro' }))
    expect(document.documentElement.dataset.tema).toBe('claro')
    expect(localStorage.getItem('tema')).toBe('claro')
    await user.click(screen.getByRole('button', { name: 'Cambiar a modo oscuro' }))
    expect(document.documentElement.dataset.tema).toBe('oscuro')
  })
})
