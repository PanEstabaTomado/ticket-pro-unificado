import '@testing-library/jest-dom/vitest'
import { MemoryRouter } from 'react-router-dom'
import Inicio from '../pages/Inicio'
import { cleanup, render, screen } from '@testing-library/react'
import { eventos } from '../data/Eventos'

afterEach(() => {
  cleanup()
})

function renderInicio() {
    return render(
        <MemoryRouter>  
            <Inicio />
        </MemoryRouter>
    )
}

describe('Inicio', () => {
  it('Muestra el titulo de la pagina', () => {
    renderInicio()
    expect(screen.getByRole('heading', { name: 'TIENDA ONLINE DE TICKETS' })).toBeInTheDocument(),
    expect(screen.getByRole('button', { name: 'Ver Eventos' })).toBeInTheDocument()
})

    it('Muestra la grilla de eventos', () => {
        renderInicio()
        expect(screen.getAllByRole('article')).toHaveLength(eventos.length)
    })

    
})

