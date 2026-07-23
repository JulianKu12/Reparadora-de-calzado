import React, { useEffect, useState, useMemo } from 'react';
import { Box, Typography, CircularProgress, Button, Grid, InputBase, IconButton } from '@mui/material';
// @ts-ignore
import SearchIcon from '@mui/icons-material/Search';
import { Header } from '../components/Header';
import { TiendaRepository } from '../../infrastructure/repositories/TiendaRepository';
import { TiendaUseCases } from '../../useCases/tienda/TiendaUseCases';
import { COLORS } from '../context/theme';
import { useToast } from '../context/ToastContext';
import type { Producto } from '../../domain/entities/tienda';

const tiendaRepository = new TiendaRepository();
const tiendaUseCases = new TiendaUseCases(tiendaRepository);

export const VentasPage: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [carrito, setCarrito] = useState<{producto: Producto, cantidad: number}[]>([]);
  const [loading, setLoading] = useState(true);
  const [notificacionesCount, setNotificacionesCount] = useState(0);
  const [busqueda, setBusqueda] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      const data = await tiendaUseCases.getProductos();
      setProductos(data);
      const bajos = data.filter((p: Producto) => p.stock_actual < 5);
      setNotificacionesCount(bajos.length);
      setLoading(false);
    };
    fetchData();
  }, []);

  const addToCart = (producto: Producto) => {
    if (producto.stock_actual <= 0) {
      showToast('No hay existencias disponibles de este producto.', 'error');
      return;
    }

    // Haptic feedback inmediato
    if (navigator.vibrate) navigator.vibrate(50); 

    setCarrito(prev => {
      const existing = prev.find(item => item.producto.id_producto === producto.id_producto);

      // Si ya existe en el carrito
      if (existing) {
        if (existing.cantidad < producto.stock_actual) {
          return prev.map(item => item.producto.id_producto === producto.id_producto 
            ? { ...item, cantidad: item.cantidad + 1 } 
            : item
          );
        }
        // Si ya alcanzó el stock, avisamos
        showToast('Se alcanzó el límite de existencias.', 'warning');
        return prev;
      }

      // Si no existe, agregamos
      return [...prev, { producto, cantidad: 1 }];
    });
  };


  const removeFromCart = (producto: Producto) => {
    setCarrito(prev => {
      const existing = prev.find(item => item.producto.id_producto === producto.id_producto);
      if (existing) {
        // Si la cantidad es mayor a 1, restamos
        if (existing.cantidad > 1) {
          return prev.map(item => item.producto.id_producto === producto.id_producto 
            ? { ...item, cantidad: item.cantidad - 1 } 
            : item
          );
        }
        // Si es 1, eliminamos el item
        return prev.filter(item => item.producto.id_producto !== producto.id_producto);
      }
      return prev;
    });
  };

  const totalVenta = carrito.reduce((acc, item) => acc + (item.producto.precio_venta * item.cantidad), 0);

  const productosFiltrados = useMemo(() => {
    if (busqueda.trim() === '') return productos;
    const b = busqueda.toLowerCase();
    return productos.filter(p => p.nombre?.toLowerCase().includes(b));
  }, [productos, busqueda]);

  const registrarVenta = async () => {
    try {
      await tiendaUseCases.registrarVenta({ total: totalVenta }, carrito);
      showToast('Venta registrada con éxito ✓', 'success');
      setCarrito([]);
      // Recargar productos para actualizar stock
      const nuevosProductos = await tiendaUseCases.getProductos();
      setProductos(nuevosProductos);
    } catch (error) {
      showToast('Error al registrar la venta. Intenta de nuevo.', 'error');
      console.error('[VentasPage] Error al registrar venta:', error);
    }
  };

  return (
    <Box className="fade-in">
      <Header 
        title="Nueva Venta" 
        backHref="/?module=tienda" 

        notificacionesHref="/notificaciones" 
        notificacionesCount={notificacionesCount}
      />
      <Box sx={{ maxWidth: 768, mx: 'auto', p: 2, pb: 10 }}>
        {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>
        ) : (
          <Grid container spacing={2}>
            {/* ── Buscador premium ───────────────────────── */}
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  px: 1.25,
                  height: 40,
                  borderRadius: 9999,
                  bgcolor: '#FEF9F0',
                  border: '1.5px solid',
                  borderColor: busqueda ? COLORS.primary : 'rgba(212,163,115,0.38)',
                  boxShadow: busqueda
                    ? '0 0 0 3px rgba(140,38,31,0.10), 0 1px 4px rgba(36,25,23,0.06)'
                    : '0 1px 4px rgba(36,25,23,0.06)',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                  '&:focus-within': {
                    borderColor: COLORS.primary,
                    boxShadow: '0 0 0 3px rgba(140,38,31,0.12), 0 1px 6px rgba(36,25,23,0.08)',
                  },
                }}
              >
                <SearchIcon
                  sx={{
                    fontSize: 17,
                    color: busqueda ? COLORS.primary : COLORS.inkTertiary,
                    flexShrink: 0,
                    transition: 'color 0.2s ease',
                  }}
                />
                <InputBase
                  placeholder="Buscar producto..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  sx={{
                    flex: 1,
                    fontSize: 14,
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 500,
                    color: COLORS.ink,
                    '& input': {
                      p: 0,
                      '&::placeholder': {
                        color: COLORS.inkTertiary,
                        opacity: 1,
                        fontSize: 14,
                      },
                    },
                  }}
                />
                {busqueda && (
                  <IconButton
                    size="small"
                    onClick={() => setBusqueda('')}
                    sx={{
                      p: 0.25,
                      color: COLORS.inkTertiary,
                      flexShrink: 0,
                      '&:hover': { color: COLORS.primary, bgcolor: 'transparent' },
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 15, lineHeight: 1 }}>close</span>
                  </IconButton>
                )}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" sx={{ color: COLORS.inkSecondary }}>Seleccionar Productos</Typography>
            </Grid>
            {productosFiltrados.map(p => (
              <Grid item xs={12} sm={6} key={p.id_producto}>
                <Box 
                  onClick={() => addToCart(p)}
                  sx={{ 
                    p: 2, 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    cursor: 'pointer',
                    bgcolor: 'white',
                    border: '1px solid',
                    borderColor: 'rgba(212,163,115,0.22)',
                    borderRadius: '4px', // Cuadrado moderno (anteriormente era numérico 4, equivalente a 32px)
                    transition: 'all 0.1s ease',
                    '&:hover': { borderColor: COLORS.primary, boxShadow: '0 4px 12px rgba(36,25,23,0.08)' },
                    '&:active': { 
                      transform: 'scale(0.98)',
                      backgroundColor: 'rgba(0,0,0,0.05)',
                    },
                  }}
                >
                  <Box>
                    <Typography sx={{ fontWeight: 600 }}>{p.nombre}</Typography>
                    <Typography sx={{ fontSize: '14px' }}>Stock: {p.stock_actual}</Typography>
                  </Box>
                  <Typography sx={{ fontWeight: 600 }}>${p.precio_venta.toFixed(2)}</Typography>
                </Box>
              </Grid>
            ))}
            <Grid item xs={12} sx={{ mt: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, height: 32 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: COLORS.inkSecondary,
                    display: 'inline-block',
                    minWidth: 60
                  }}
                >
                  Venta
                </Typography>
                <span 
                  className="material-symbols-outlined" 
                  style={{ 
                    fontSize: 24, 
                    color: COLORS.primary,
                  }}
                >
                  shopping_cart
                </span>
              </Box>
              {carrito.map(item => (
                <Box key={item.producto.id_producto} className="card" sx={{ p: 2, mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                  <Typography sx={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.producto.nombre} x {item.cantidad}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      onClick={() => removeFromCart(item.producto)}
                      sx={{ minWidth: 32, p: 0.5, borderColor: COLORS.inkTertiary, color: COLORS.inkTertiary }}
                    >-</Button>
                    <Button 
                      variant="contained" 
                      size="small" 
                      onClick={() => addToCart(item.producto)}
                      sx={{ minWidth: 32, p: 0.5, background: COLORS.primary, color: '#fff' }}
                    >+</Button>
                  </Box>
                  <Typography sx={{ width: 60, textAlign: 'right', flexShrink: 0 }}>
                    ${(item.producto.precio_venta * item.cantidad).toFixed(2)}
                  </Typography>
                </Box>
              ))}
              <Box sx={{ mt: 2, textAlign: 'right' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: COLORS.primary, mb: 2 }}>Total: ${totalVenta.toFixed(2)}</Typography>
                <Button 
                  variant="contained" 
                  sx={{ 
                    px: 4, 
                    py: 1.5, 
                    color: '#fff',
                    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
                    borderRadius: 9999,
                    transition: 'transform 0.15s ease', // Eliminamos transiciones de sombra y fondo
                    boxShadow: 'none', // Sin sombra por defecto para evitar superposición
                    '&:hover': {
                      filter: 'brightness(1.08)',
                      boxShadow: '0 2px 8px rgba(140,38,31,0.2)', // Sombra muy sutil solo en hover
                    },
                    '&:disabled': {
                      background: '#D4C4C1',
                      color: '#fff',
                      boxShadow: 'none',
                    },
                  }} 
                  onClick={registrarVenta} 
                  disabled={carrito.length === 0}
                >
                  Confirmar Venta
                </Button>
              </Box>
            </Grid>
          </Grid>
        )}
      </Box>
    </Box>
  );
};
