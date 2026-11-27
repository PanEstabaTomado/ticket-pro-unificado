import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest'
import Evento from '../pages/Evento';
import { useParams, useNavigate } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import { vi } from 'vitest';

// 1. Mock de react-router-dom
vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
  useNavigate: vi.fn(),
}));

// 2. Mock del Contexto
vi.mock('../context/CarritoContext', () => ({
  useCarrito: vi.fn(),
}));

// 3. Mock de la data estática para controlar exactamente qué renderiza
vi.mock('../data/Eventos', () => ({
  eventos: [
    {
      id: '1',
      titulo: 'Festival de Prueba',
      tipo: 'Música',
      fecha: '2026-11-20',
      hora: '18:00',
      lugar: 'Parque O\'Higgins',
      direccion: 'Santiago',
      precio: 'Desde $20.000',
      categoria: 'Festival',
      duracion: '5 horas',
      edadMinima: 'Todas las edades',
      estado: 'Disponible',
      organizador: 'Productora Test',
      descripcion: 'Un evento increíble',
      secciones: [
        { id: 'sec-1', nombre: 'General', precioSeccion: 20000, capacidad: 500 },
        { id: 'sec-2', nombre: 'VIP', precioSeccion: 50000, capacidad: 100 }
      ]
    }
  ]
}));

describe('Componente Evento', () => {
  const mockNavigate = vi.fn();
  const mockAgregar = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
    window.alert = vi.fn(); // Evita que los alert bloqueen los tests
    useNavigate.mockReturnValue(mockNavigate);
    useCarrito.mockReturnValue({ agregar: mockAgregar });
  });

  test('muestra "Evento no encontrado" si el id no coincide', () => {
    useParams.mockReturnValue({ id: '999' }); // ID inexistente

    render(<Evento />);
    
    expect(screen.getByText('Evento no encontrado')).toBeInTheDocument();
  });

  test('renderiza la información del evento correctamente', () => {
    useParams.mockReturnValue({ id: '1' }); // ID existente en el mock

    render(<Evento />);

    expect(screen.getByText('Festival de Prueba')).toBeInTheDocument();
    expect(screen.getByText('Parque O\'Higgins')).toBeInTheDocument();
  });

  test('sin sesión, al intentar comprar muestra la tarjeta de aviso y no agrega al carrito', () => {
    useParams.mockReturnValue({ id: '1' });
    render(<Evento />);

    fireEvent.click(screen.getByText('+'));
    fireEvent.click(screen.getByText('Añadir al Carrito'));

    expect(screen.getByText('No puede comprar productos en TicketPro')).toBeInTheDocument();
    expect(mockAgregar).not.toHaveBeenCalled();
  });

  test('con sesión y 0 entradas muestra error en pantalla (sin alert)', () => {
    localStorage.setItem('sesion_activa', JSON.stringify({ nombre: 'Juan', correo: 'juan@gmail.com' }));
    useParams.mockReturnValue({ id: '1' });
    render(<Evento />);

    fireEvent.click(screen.getByText('Añadir al Carrito'));

    expect(screen.getByText('Debes seleccionar al menos 1 entrada.')).toBeInTheDocument();
    expect(window.alert).not.toHaveBeenCalled();
    expect(mockAgregar).not.toHaveBeenCalled();
  });

  test('con sesión agrega las entradas al carrito', () => {
    localStorage.setItem('sesion_activa', JSON.stringify({ nombre: 'Juan', correo: 'juan@gmail.com' }));
    useParams.mockReturnValue({ id: '1' });
    render(<Evento />);

    fireEvent.click(screen.getByText('+'));
    fireEvent.click(screen.getByText('Añadir al Carrito'));

    expect(mockAgregar).toHaveBeenCalledTimes(1);
  });
})
