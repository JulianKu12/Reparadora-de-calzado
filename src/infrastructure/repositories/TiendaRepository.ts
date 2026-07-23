import { supabase } from './supabaseClient';
import type { ITiendaRepository } from '../../domain/repositories/ITiendaRepository';
import type { Producto, Venta, DetalleVenta } from '../../domain/entities/tienda';

export class TiendaRepository implements ITiendaRepository {
  async getProductos(): Promise<Producto[]> {
    const { data, error } = await supabase.from('tienda_productos').select('*');
    if (error) throw error;
    return data as Producto[];
  }

  async getProductoById(id: string): Promise<Producto | null> {
    const { data, error } = await supabase.from('tienda_productos').select('*').eq('id_producto', id).single();
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data as Producto;
  }

  async createProducto(producto: Omit<Producto, 'id_producto'>): Promise<Producto> {
    const { data, error } = await supabase.from('tienda_productos').insert(producto).select().single();
    if (error) throw error;
    return data as Producto;
  }

  async saveVenta(venta: Omit<Venta, 'id_venta' | 'fecha_venta'>): Promise<Venta> {
    const { data, error } = await supabase.from('tienda_ventas').insert({
      total: venta.total,
    }).select().single();
    if (error) throw error;
    return data as Venta;
  }

  async saveDetalleVenta(detalle: Omit<DetalleVenta, 'id_detalle'>): Promise<DetalleVenta> {
    const { nombre_producto, ...dataToInsert } = detalle;
    const { data, error } = await supabase.from('tienda_detalle_ventas').insert(dataToInsert).select().single();
    if (error) throw error;
    return { ...data, nombre_producto } as DetalleVenta;
  }

  async getVentas(): Promise<Venta[]> {
    const { data, error } = await supabase.from('tienda_ventas').select('*').order('fecha_venta', { ascending: false });
    if (error) throw error;
    return data as Venta[];
  }

  async getVentasByDateRange(startDate: string, endDate: string): Promise<Venta[]> {
    // By passing 'YYYY-MM-DD' directly, Postgres treats it as 00:00:00 of that day
    // This avoids timezone issues entirely.
    const { data, error } = await supabase
      .from('tienda_ventas')
      .select('*')
      .gte('fecha_venta', startDate)
      .lte('fecha_venta', `${endDate} 23:59:59`)
      .order('fecha_venta', { ascending: false });
    if (error) throw error;
    return data as Venta[];
  }

  async getDetallesByVentaId(id_venta: number): Promise<DetalleVenta[]> {
    const { data, error } = await supabase.from('tienda_detalle_ventas').select('*').eq('id_venta', id_venta);
    if (error) throw error;
    return data as DetalleVenta[];
  }

  async updateStock(id_producto: number, nuevoStock: number): Promise<void> {
    const { error } = await supabase.from('tienda_productos').update({ stock_actual: nuevoStock }).eq('id_producto', id_producto);
    if (error) throw error;
  }

  async updateProducto(id_producto: number, producto: Partial<Omit<Producto, 'id_producto'>>): Promise<void> {
    const { error } = await supabase.from('tienda_productos').update(producto).eq('id_producto', id_producto);
    if (error) throw error;
  }

  async deleteProducto(id_producto: number): Promise<void> {
    const { error } = await supabase.from('tienda_productos').delete().eq('id_producto', id_producto);
    if (error) throw error;
  }
}
