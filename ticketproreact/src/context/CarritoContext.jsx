import { createContext, useContext, useEffect, useState } from 'react'

const CarritoContext = createContext()

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('carrito')) || []
    } catch {
      return []
    }
  })

  // Cada vez que el carrito cambia, se guarda en localStorage
  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito))
  }, [carrito])

  const agregar = (item) => setCarrito([...carrito, item])
  const eliminar = (indice) => setCarrito(carrito.filter((_, i) => i !== indice))
  const vaciar = () => setCarrito([])

  const total = carrito.reduce((suma, item) => suma + item.subtotal, 0)
  const cantidadTotal = carrito.reduce((suma, item) => suma + item.cantidad, 0)

  return (
    <CarritoContext.Provider value={{ carrito, agregar, eliminar, vaciar, total, cantidadTotal }}>
      {children}
    </CarritoContext.Provider>
  )
}

export const useCarrito = () => useContext(CarritoContext)