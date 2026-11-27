// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import Footer from '../components/Footer'
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

describe('Footer', () => {
  it('muestra la marca y las categorías', () => {
    renderEn(<Footer />)
    expect(screen.getByText('Ticket Pro')).toBeInTheDocument()
    expect(screen.getByText('Categoría Conciertos')).toBeInTheDocument()
    expect(screen.getByText('Categoría Teatro')).toBeInTheDocument()
    expect(screen.getByText('Categoría Deportes')).toBeInTheDocument()
  })

  it('tiene el formulario de suscripción con email obligatorio', () => {
    renderEn(<Footer />)
    const input = screen.getByPlaceholderText('Ingresa Email')
    expect(input).toHaveAttribute('type', 'email')
    expect(input).toBeRequired()
    expect(screen.getByRole('button', { name: 'Subscribe' })).toBeInTheDocument()
  })
})