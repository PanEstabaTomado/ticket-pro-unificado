import { Routes, Route, Outlet } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Inicio from './pages/Inicio'
import Evento from './pages/Evento'
import Carrito from './pages/Carrito'
import Registro from './pages/Registro'
import Login from './pages/Login'


function Layout() {
  return (
    <>
      <Header />
      <Outlet />   {}
      <Footer />
    </>
  )
}

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Inicio />} />
        <Route path="/evento/:id" element={<Evento />} />
        <Route path="/carrito" element={<Carrito />} />
      </Route>
      <Route path="/registro" element={<Registro />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}

export default App