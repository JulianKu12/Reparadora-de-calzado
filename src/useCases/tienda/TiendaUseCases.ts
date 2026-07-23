import type { ITiendaRepository } from '../../domain/repositories/ITiendaRepository';
import type { Producto, Venta, DetalleVenta } from '../../domain/entities/tienda';

export class TiendaUseCases {
  constructor(private tiendaRepository: ITiendaRepository) {}

  async getProductos(): Promise<Producto[]> {
    return this.tiendaRepository.getProductos();
  }

  async getProductoById(id: string): Promise<Producto | null> {
    return this.tiendaRepository.getProductoById(id);
  }

  async agregarProducto(producto: Omit<Producto, 'id_producto'>): Promise<Producto> {
    return this.tiendaRepository.createProducto(producto);
  }

  async registrarVenta(venta: Omit<Venta, 'id_venta' | 'fecha_venta'>, items: {producto: Producto, cantidad: number}[]): Promise<Venta> {
    // 1. Validar stock de TODOS los productos antes de empezar cualquier operación
    for (const item of items) {
      if (item.producto.stock_actual < item.cantidad) {
        throw new Error(`Stock insuficiente para ${item.producto.nombre}. Disponible: ${item.producto.stock_actual}`);
      }
    }

    // 2. Guardar la cabecera de la venta
    const ventaCreada = await this.tiendaRepository.saveVenta(venta);

    // 3. Procesar cada producto: Restar stock y guardar detalle
    for (const item of items) {
      const nuevoStock = item.producto.stock_actual - item.cantidad;
      await this.tiendaRepository.updateStock(item.producto.id_producto, nuevoStock);
      
      await this.tiendaRepository.saveDetalleVenta({
        id_venta: ventaCreada.id_venta,
        id_producto: item.producto.id_producto,
        cantidad: item.cantidad,
        subtotal: item.producto.precio_venta * item.cantidad,
        nombre_producto: item.producto.nombre // Guardamos el nombre para el historial
      });
    }

    return ventaCreada;
  }

  async getHistorialVentas(): Promise<{venta: Venta, detalles: (DetalleVenta & {nombre_producto?: string})[]}[]> {
    const ventas = await this.tiendaRepository.getVentas();
    return this.fetchDetallesForVentas(ventas);
  }

  async getHistorialVentasByDateRange(startDate: string, endDate: string): Promise<{venta: Venta, detalles: (DetalleVenta & {nombre_producto?: string})[]}[]> {
    const ventas = await this.tiendaRepository.getVentasByDateRange(startDate, endDate);
    return this.fetchDetallesForVentas(ventas);
  }

  private async fetchDetallesForVentas(ventas: Venta[]): Promise<{venta: Venta, detalles: (DetalleVenta & {nombre_producto?: string})[]}[]> {
    const productos = await this.tiendaRepository.getProductos();
    const historial = await Promise.all(
      ventas.map(async (v) => {
        const detalles = await this.tiendaRepository.getDetallesByVentaId(v.id_venta);
        const detallesConNombre = detalles.map(d => {
          const producto = productos.find(p => p.id_producto === d.id_producto);
          return { ...d, nombre_producto: producto?.nombre };
        });
        return { venta: v, detalles: detallesConNombre };
      })
    );
    return historial;
  }

  async eliminarProducto(id_producto: number): Promise<void> {
    return this.tiendaRepository.deleteProducto(id_producto);
  }

  async actualizarProducto(id_producto: number, producto: Partial<Omit<Producto, 'id_producto'>>): Promise<void> {
    return this.tiendaRepository.updateProducto(id_producto, producto);
  }
}
