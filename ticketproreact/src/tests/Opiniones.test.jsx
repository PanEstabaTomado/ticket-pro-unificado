import '@testing-library/jest-dom/vitest'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import ResenasEvento from '../components/ResenasEvento'
import Historial from '../pages/Historial'
import Eventos from '../pages/Eventos'
import { eventos } from '../data/Eventos'

afterEach(() => {
  cleanup()
  localStorage.clear()
  sessionStorage.clear()
})

const evento = { id: 'evento-1', organizador: 'Rock Nation Chile', titulo: 'Rock Legends Festival' }
const entrar = () => localStorage.setItem('sesion_activa', JSON.stringify({ nombre: 'Ana', correo: 'ana@gmail.com' }))
const comprar = () =>
  localStorage.setItem('compras', JSON.stringify([
    { correo: 'ana@gmail.com', idEvento: 'evento-1', tituloEvento: 'Rock Legends Festival', nombreSeccion: 'Cancha General', cantidad: 2, precioUnitario: 50000, subtotal: 100000, fechaCompra: '2026-10-01T10:00:00.000Z' },
  ]))
const ui = (nodo) => render(<MemoryRouter>{nodo}</MemoryRouter>)

describe('Opiniones del evento', () => {
  it('si el evento no ha terminado, avisa que se podrá calificar después', () => {
    ui(<ResenasEvento evento={evento} finalizado={false} />)
    expect(screen.getByText(/Podrás calificar a Rock Nation Chile/)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Publicar opinión' })).not.toBeInTheDocument()
  })

  it('sin sesión pide iniciar sesión', () => {
    ui(<ResenasEvento evento={evento} finalizado />)
    expect(screen.getByRole('button', { name: 'Iniciar sesión' })).toBeInTheDocument()
  })

  it('con sesión pero sin entrada comprada no deja opinar', () => {
    entrar()
    ui(<ResenasEvento evento={evento} finalizado />)
    expect(screen.getByText(/Solo pueden opinar quienes compraron/)).toBeInTheDocument()
  })

  it('quien asistió publica una opinión y la nota queda asociada a la empresa', async () => {
    const user = userEvent.setup()
    entrar()
    comprar()
    ui(<ResenasEvento evento={evento} finalizado />)

    await user.click(screen.getByRole('button', { name: 'Publicar opinión' }))
    expect(screen.getByText('Elige una nota de 1 a 5 estrellas.')).toBeInTheDocument()

    await user.click(screen.getByRole('radio', { name: '4 estrellas' }))
    await user.type(screen.getByLabelText('Comentario'), 'Excelente sonido')
    await user.click(screen.getByRole('button', { name: 'Publicar opinión' }))

    expect(screen.getByText('Excelente sonido', { selector: 'p' })).toBeInTheDocument()
    expect(screen.getByText('Nota de Rock Nation Chile')).toBeInTheDocument()
    expect(screen.getByText('4,0')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Actualizar opinión' })).toBeInTheDocument()
  })
})

describe('Historial de eventos', () => {
  it('sin sesión pide iniciar sesión', () => {
    ui(<Historial />)
    expect(screen.getByText(/Inicia sesión para ver los eventos/)).toBeInTheDocument()
  })

  it('sin compras muestra el estado vacío', () => {
    entrar()
    ui(<Historial />)
    expect(screen.getByText(/Aún no tienes compras/)).toBeInTheDocument()
  })

  it('lista los eventos comprados y marca como "Asististe" los que ya terminaron', () => {
    entrar()
    comprar()
    ui(<Historial />)
    expect(screen.getByRole('heading', { name: 'Rock Legends Festival' })).toBeInTheDocument()
    expect(screen.getByText('Asististe')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Calificar' })).toHaveAttribute('href', '/evento/evento-1')
  })
})

describe('Página de eventos', () => {
  it('muestra una tarjeta por cada evento del catálogo', () => {
    ui(<Eventos />)
    expect(screen.getAllByRole('article')).toHaveLength(eventos.length)
  })
})
