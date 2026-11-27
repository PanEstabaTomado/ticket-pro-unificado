import { Routes, Route, Outlet } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Inicio from './pages/Inicio'
import Evento from './pages/Evento'
import Carrito from './pages/Carrito'
import Registro from './pages/Registro'
import Login from './pages/Login'
import Eventos from './pages/Eventos'
import Perfil from './pages/Perfil'
import Historial from './pages/Historial'


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
        <Route path="/eventos" element={<Eventos />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/historial" element={<Historial />} />
      </Route>
      <Route path="/registro" element={<Registro />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}

export default App