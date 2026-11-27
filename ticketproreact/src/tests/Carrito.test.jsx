import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest'
import Carrito from '../pages/Carrito';
import { useCarrito } from '../context/CarritoContext';

// 1. Mock de la ruta del contexto
vi.mock('../context/CarritoContext', () => ({
  useCarrito: vi.fn(),
}));

describe('Componente Carrito', () => {
  const mockEliminar = vi.fn();
  const mockVaciar = vi.fn();

  const iniciarSesion = () =>
    localStorage.setItem('sesion_activa', JSON.stringify({ nombre: 'Juan', correo: 'juan@gmail.com' }));

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
    window.alert = vi.fn(); // Mock para evitar que el alert detenga los tests
  });

  test('muestra el mensaje de carrito vacío', () => {
    // Simulamos estado inicial sin productos
    useCarrito.mockReturnValue({
      carrito: [],
      eliminar: mockEliminar,
      vaciar: mockVaciar,
      total: 0,
    });

    render(<Carrito />);

    expect(screen.getByText('Tu carrito está vacío.')).toBeInTheDocument();
    expect(screen.getByText(/Total a Pagar:/)).toHaveTextContent('$ 0');
  });

  test('renderiza las entradas correctamente', () => {
    // Simulamos un carrito con un item
    useCarrito.mockReturnValue({
      carrito: [
        {
          tituloEvento: 'Concierto Rock',
          nombreSeccion: 'VIP',
          cantidad: 2,
          precioUnitario: 50000,
          subtotal: 100000,
        },
      ],
      eliminar: mockEliminar,
      vaciar: mockVaciar,
      total: 100000,
    });

    render(<Carrito />);

    expect(screen.getByText('Concierto Rock')).toBeInTheDocument();
    expect(screen.getByText('Ubicación: VIP')).toBeInTheDocument();
    expect(screen.getByText('Cantidad: 2')).toBeInTheDocument();
    expect(screen.getByText('Precio Unitario: $50.000')).toBeInTheDocument();
    expect(screen.getByText('Subtotal: $100.000')).toBeInTheDocument();
    expect(screen.getByText(/Total a Pagar:/)).toHaveTextContent('$ 100.000');
  });

  test('llama a la función eliminar al hacer clic en el botón', () => {
    useCarrito.mockReturnValue({
      carrito: [{ tituloEvento: 'Concierto Rock', nombreSeccion: 'VIP', cantidad: 1, precioUnitario: 50000, subtotal: 50000 }],
      eliminar: mockEliminar,
      vaciar: mockVaciar,
      total: 50000,
    });

    render(<Carrito />);

    const btnEliminar = screen.getByText('Eliminar');
    fireEvent.click(btnEliminar);

    expect(mockEliminar).toHaveBeenCalledWith(0); // 0 es el índice (i) del map
  });

  test('muestra error en pantalla si se intenta pagar con carrito vacío', () => {
    iniciarSesion();
    useCarrito.mockReturnValue({
      carrito: [],
      eliminar: mockEliminar,
      vaciar: mockVaciar,
      total: 0,
    });

    render(<Carrito />);

    const btnPagar = screen.getByText('Proceder al Pago');
    fireEvent.click(btnPagar);

    expect(screen.getByText('El carrito está vacío. Agrega entradas antes de pagar.')).toBeInTheDocument();
    expect(window.alert).not.toHaveBeenCalled();
    expect(mockVaciar).not.toHaveBeenCalled();
  });

  test('sin sesión no permite pagar y muestra la tarjeta de aviso', () => {
    useCarrito.mockReturnValue({
      carrito: [{ tituloEvento: 'Concierto Rock', nombreSeccion: 'VIP', cantidad: 1, precioUnitario: 50000, subtotal: 50000 }],
      eliminar: mockEliminar,
      vaciar: mockVaciar,
      total: 50000,
    });

    render(<Carrito />);
    fireEvent.click(screen.getByText('Proceder al Pago'));

    expect(screen.getByText('No puede comprar productos en TicketPro')).toBeInTheDocument();
    expect(screen.getByText('Para poder utilizar nuestro servicio para reservar sus tickets, por favor inicie sesión con su cuenta.')).toBeInTheDocument();
    expect(mockVaciar).not.toHaveBeenCalled();
  });

  test('realiza el pago correctamente y vacía el carrito', () => {
    iniciarSesion();
    useCarrito.mockReturnValue({
      carrito: [{ tituloEvento: 'Concierto Rock', nombreSeccion: 'VIP', cantidad: 1, precioUnitario: 50000, subtotal: 50000 }],
      eliminar: mockEliminar,
      vaciar: mockVaciar,
      total: 50000,
    });

    render(<Carrito />);

    const btnPagar = screen.getByText('Proceder al Pago');
    fireEvent.click(btnPagar);

    expect(window.alert).toHaveBeenCalledWith('Compra realizada con éxito!');
    expect(mockVaciar).toHaveBeenCalledTimes(1);
  });
});