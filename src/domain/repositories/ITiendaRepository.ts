import type { Producto, Venta, DetalleVenta } from '../entities/tienda';

export interface ITiendaRepository {
  getProductos(): Promise<Producto[]>;
  getProductoById(id: string): Promise<Producto | null>;
  createProducto(producto: Omit<Producto, 'id_producto'>): Promise<Producto>;
  saveVenta(venta: Omit<Venta, 'id_venta' | 'fecha_venta'>): Promise<Venta>;
  saveDetalleVenta(detalle: Omit<DetalleVenta, 'id_detalle'>): Promise<DetalleVenta>;
  getVentas(): Promise<Venta[]>;
  getVentasByDateRange(startDate: string, endDate: string): Promise<Venta[]>;
  getDetallesByVentaId(id_venta: number): Promise<DetalleVenta[]>;
  updateStock(id_producto: number, nuevoStock: number): Promise<void>;
  updateProducto(id_producto: number, producto: Partial<Omit<Producto, 'id_producto'>>): Promise<void>;
  deleteProducto(id_producto: number): Promise<void>;
}
