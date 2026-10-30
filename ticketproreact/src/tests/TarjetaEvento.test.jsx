// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import TarjetaEvento from '../components/TarjetaEvento'

afterEach(() => {
  cleanup()
})

const evento = {
  id: 'evento-1',
  titulo: 'Rock Legends Festival',
  fecha: '25 Octubre de 2026',
  lugar: 'Estadio Nacional',
  precio: 50000,
  imagen: '/public/img/RockLegends.jpg',
}

function renderTarjeta() {
  return render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<TarjetaEvento evento={evento} />} />
        <Route path="/evento/:id" element={<p>Pantalla del evento</p>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('TarjetaEvento', () => {
  it('Muestra los datos basicos del evento', () => {
    renderTarjeta()
    expect(screen.getByText('Rock Legends Festival')).toBeInTheDocument()
    expect(screen.getByText('25 Octubre de 2026 | Estadio Nacional')).toBeInTheDocument()
  })

  it('Se muestra el precio del evento con el formato de pesos', () => {
    renderTarjeta()
    expect(screen.getByText('$50.000')).toBeInTheDocument()
  })

  it('Se carga la imagen respectiva del evento', () => {
    renderTarjeta()
    expect(screen.getByAltText('Rock Legends Festival')).toHaveAttribute('src', '/public/img/RockLegends.jpg')
  })

  it('Al hacer clic Añadir al Carrito redirige a la respectiva pagina del evento', async () => {
    const user = userEvent.setup()
    renderTarjeta()
    await user.click(screen.getByRole('button', { name: 'Añadir al Carrito' }))
    expect(screen.getByText('Pantalla del evento')).toBeInTheDocument()
  })

  it('El corazon de fav cambia al presionarlo', async () => {
    const user = userEvent.setup()
    renderTarjeta()
    const corazon = screen.getByRole('button', { name: 'Añadir a favoritos' })
    expect(corazon).toHaveTextContent('♡')
    await user.click(corazon)
    expect(corazon).toHaveTextContent('♥')
    await user.click(corazon)
    expect(corazon).toHaveTextContent('♡')
  })
})
