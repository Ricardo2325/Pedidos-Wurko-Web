import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Pedido from './pages/Pedido'
import Carrito from './pages/Carrito'
import DatosCliente from './pages/DatosCliente'
import Confirmacion from './pages/Confirmacion'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/pedido" element={<Pedido />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/datos-cliente" element={<DatosCliente />} />
          <Route path="/confirmacion" element={<Confirmacion />} />
          <Route path="/" element={<Navigate to="/pedido" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  )
}
