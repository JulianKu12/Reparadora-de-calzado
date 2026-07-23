import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, CircularProgress } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { TiendaRepository } from '../../infrastructure/repositories/TiendaRepository';
import { TiendaUseCases } from '../../useCases/tienda/TiendaUseCases';
import { COLORS } from '../context/theme';
import { useToast } from '../context/ToastContext';

const tiendaRepository = new TiendaRepository();
const tiendaUseCases = new TiendaUseCases(tiendaRepository);

// Campos numéricos como string para permitir borrar el 0 libremente
interface FormData {
  nombre: string;
  precio_venta: string;
  stock_actual: string;
}

const initialForm: FormData = {
  nombre: '',
  precio_venta: '',
  stock_actual: '',
};

export const AgregarProductoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [notificacionesCount, setNotificacionesCount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialForm);

  useEffect(() => {
    tiendaRepository.getProductos().then(productos => {
      const lowStock = productos.filter(p => p.stock_actual < 5).length;
      setNotificacionesCount(lowStock);
    });
  }, []);

  useEffect(() => {
    if (id) {
      tiendaUseCases.getProductoById(id).then(producto => {
        if (producto) {
          setFormData({
            nombre:       producto.nombre,
            precio_venta: String(producto.precio_venta),
            stock_actual: String(producto.stock_actual),
          });
        }
      });
    }
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'precio_venta' || name === 'stock_actual') {
      // Permitir cadena vacía o número decimal no negativo
      if (value !== '' && !/^\d*\.?\d*$/.test(value)) return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (formData.nombre.trim() === '') {
      showToast('El nombre del producto es obligatorio.', 'error');
      return;
    }

    const precio = parseFloat(formData.precio_venta) || 0;
    const stock  = parseFloat(formData.stock_actual)  || 0;

    if (precio <= 0 || stock <= 0) {
      showToast('El precio y el stock deben ser mayores a cero.', 'error');
      return;
    }

    setSaving(true);
    try {
      if (id) {
        await tiendaUseCases.actualizarProducto(Number(id), {
          nombre:       formData.nombre,
          precio_venta: precio,
          stock_actual: stock,
        });
        showToast('Producto actualizado con éxito ✓', 'success');
        navigate('/?module=tienda');
      } else {
        await tiendaUseCases.agregarProducto({
          nombre:       formData.nombre,
          precio_venta: precio,
          stock_actual: stock,
        });
        showToast('Producto agregado con éxito ✓', 'success');
        setFormData(initialForm);
      }
    } catch (error) {
      showToast('Error al guardar. Intenta de nuevo.', 'error');
      console.error('[AgregarProductoPage] Error:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box className="fade-in">
      <Header
        title={id ? 'Editar Producto' : 'Agregar Producto'}
        onBack={() => navigate(-1)}
        
        notificacionesHref="/notificaciones"
        notificacionesCount={notificacionesCount}
      />
      <Box sx={{ maxWidth: 768, mx: 'auto', p: 2 }}>
        <Box className="card" sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <Typography variant="h6" sx={{ color: COLORS.primary, mb: 1 }}>
            Detalles del Producto
          </Typography>

          <TextField
            name="nombre"
            label="Nombre del producto"
            variant="outlined"
            fullWidth
            value={formData.nombre}
            onChange={handleInputChange}
            inputProps={{ 'aria-label': 'Nombre del producto' }}
          />

          <TextField
            name="precio_venta"
            label="Precio de venta"
            variant="outlined"
            fullWidth
            value={formData.precio_venta}
            onChange={handleInputChange}
            placeholder="0"
            inputProps={{ inputMode: 'decimal', 'aria-label': 'Precio de venta' }}
          />

          <TextField
            name="stock_actual"
            label="Stock inicial"
            variant="outlined"
            fullWidth
            value={formData.stock_actual}
            onChange={handleInputChange}
            placeholder="0"
            inputProps={{ inputMode: 'decimal', 'aria-label': 'Stock inicial del producto' }}
          />

          <Button
            className="btn-primary"
            sx={{
              mt: 2, py: 1.5, minHeight: 44,
              backgroundColor: COLORS.primary,
              color: '#FFFFFF',
              '&:hover': { backgroundColor: COLORS.primaryDark },
            }}
            onClick={handleSubmit}
            disabled={saving}
            startIcon={saving ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : null}
            aria-label={id ? 'Actualizar producto' : 'Guardar nuevo producto'}
          >
            {saving ? 'Guardando...' : id ? 'Actualizar Producto' : 'Guardar Producto'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
