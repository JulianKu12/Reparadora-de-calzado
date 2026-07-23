
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MenuPage } from './presentation/pages/MenuPage';
import { VentasPage } from './presentation/pages/VentasPage';
import { InventarioPage } from './presentation/pages/InventarioPage';
import { DetalleServicioPage } from './presentation/pages/DetalleServicioPage';
import { NuevoServicioPage } from './presentation/pages/NuevoServicioPage';
import { AgregarProductoPage } from './presentation/pages/AgregarProductoPage';
import { HistorialVentasPage } from './presentation/pages/HistorialVentasPage';
import { NotificacionesPage } from './presentation/pages/NotificacionesPage';
import { AjustesPage } from './presentation/pages/AjustesPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MenuPage />} />
        {/* Talabartería */}
        <Route path="/nuevo-servicio" element={<NuevoServicioPage />} />
        <Route path="/editar-servicio/:id" element={<NuevoServicioPage />} />
        <Route path="/talabarteria/editar/:id" element={<NuevoServicioPage />} />
        <Route path="/detalle-servicio/:id" element={<DetalleServicioPage />} />
        <Route path="/talabarteria/registro-servicios" element={<MenuPage />} />
        {/* Tienda */}
        <Route path="/agregar-producto" element={<AgregarProductoPage />} />
        <Route path="/editar-producto/:id" element={<AgregarProductoPage />} />
        <Route path="/tienda-abarrotes/editar/:id" element={<AgregarProductoPage />} />
        <Route path="/ventas" element={<VentasPage />} />
        <Route path="/inventario" element={<InventarioPage />} />
        <Route path="/tienda-abarrotes/inventario" element={<InventarioPage />} />
        <Route path="/historial-ventas" element={<HistorialVentasPage />} />
        {/* Otros */}
        <Route path="/notificaciones" element={<NotificacionesPage />} />
        <Route path="/ajustes" element={<AjustesPage />} />
      </Routes>
    </Router>
  );
}

export default App;
