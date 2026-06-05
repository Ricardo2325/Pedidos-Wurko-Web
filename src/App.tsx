import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Pedido from './pages/Pedido'
import Confirmacion from './pages/Confirmacion'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta principal: carta de pedidos con token de empresa */}
        <Route path="/pedido" element={<Pedido />} />

        {/* Pantalla tras confirmar pedido */}
        <Route path="/confirmacion" element={<Confirmacion />} />

        {/* Redirigir raíz a /pedido (sin token, la Tarea 2 manejará el error) */}
        <Route path="/" element={<Navigate to="/pedido" replace />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
