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
    expect(screen.getByRole('link', { name: 'Iniciar sesión' })).toHaveAttribute('href', '/login')
    expect(screen.getByRole('link', { name: 'Registrar usuario' })).toHaveAttribute('href', '/registro')
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

  it('al hacer clic en Iniciar sesión redirige a /login', async () => {
    const user = userEvent.setup()
    renderEn(
      <Routes>
        <Route path="/" element={<Header />} />
        <Route path="/login" element={<p>Pantalla de login</p>} />
      </Routes>
    )
    await user.click(screen.getByRole('link', { name: 'Iniciar sesión' }))
    expect(screen.getByText('Pantalla de login')).toBeInTheDocument()
  })
})