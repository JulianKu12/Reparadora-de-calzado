import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, CircularProgress } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { TallerRepository } from '../../infrastructure/repositories/TallerRepository';
import { TallerUseCases } from '../../useCases/taller/TallerUseCases';
import { TiendaRepository } from '../../infrastructure/repositories/TiendaRepository';
import { useToast } from '../context/ToastContext';
import type { EstadoTicket } from '../../domain/entities/taller';

const tallerRepository = new TallerRepository();
const tallerUseCases = new TallerUseCases(tallerRepository);
const tiendaRepository = new TiendaRepository();

interface FormErrors {
  nombre_cliente?: string;
  telefono?: string;
  producto?: string;
  servicio_solicitado?: string;
}

// Estado con campos numéricos como string para permitir borrar el 0
interface FormData {
  nombre_cliente: string;
  telefono: string;
  producto: string;
  servicio_solicitado: string;
  costo_mano_obra: string;
  costo_materiales: string;
  anticipo: string;
}

const initialForm: FormData = {
  nombre_cliente: '',
  telefono: '',
  producto: '',
  servicio_solicitado: '',
  costo_mano_obra: '',
  costo_materiales: '',
  anticipo: '',
};

export const NuevoServicioPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [notificacionesCount, setNotificacionesCount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>(initialForm);

  useEffect(() => {
    tiendaRepository.getProductos().then(productos => {
      const lowStock = productos.filter(p => p.stock_actual < 5).length;
      setNotificacionesCount(lowStock);
    });

    if (id) {
      tallerUseCases.getTicketById(id).then(ticket => {
        if (ticket) {
          setFormData({
            nombre_cliente:      ticket.nombre_cliente,
            telefono:            ticket.telefono ?? '',
            producto:            ticket.producto,
            servicio_solicitado: ticket.servicio_solicitado,
            costo_mano_obra:     String(ticket.costo_mano_obra),
            costo_materiales:    String(ticket.costo_materiales),
            anticipo:            String(ticket.anticipo),
          });
        }
      });
    }
  }, [id]);

  const validate = (name: string, value: string): string => {
    switch (name) {
      case 'nombre_cliente':
        return value.trim().length < 2 ? 'El nombre debe tener al menos 2 caracteres.' : '';
      case 'telefono':
        return value.length > 0 && value.length < 10 ? 'El teléfono debe tener 10 dígitos.' : '';
      case 'producto':
        return value.trim() === '' ? 'El producto es obligatorio.' : '';
      case 'servicio_solicitado':
        return value.trim() === '' ? 'Describe el servicio solicitado.' : '';
      default:
        return '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    let newValue = value;

    if (name === 'telefono') {
      // Solo dígitos, máximo 10
      newValue = value.replace(/\D/g, '').slice(0, 10);
    } else if (name === 'costo_mano_obra' || name === 'costo_materiales' || name === 'anticipo') {
      // Permitir cadena vacía (para poder borrar el 0) y números >= 0
      // Rechazar negativos y letras, pero permitir "" o dígitos con hasta un punto decimal
      if (value !== '' && !/^\d*\.?\d*$/.test(value)) return;
    }

    setFormData(prev => ({ ...prev, [name]: newValue }));

    // Validación en tiempo real solo para campos de texto
    const textFields = ['nombre_cliente', 'telefono', 'producto', 'servicio_solicitado'];
    if (textFields.includes(name)) {
      const errorMsg = validate(name, newValue);
      setErrors(prev => ({ ...prev, [name]: errorMsg }));
    }
  };

  const handleSubmit = async () => {
    const newErrors: FormErrors = {
      nombre_cliente:      validate('nombre_cliente',      formData.nombre_cliente),
      telefono:            validate('telefono',            formData.telefono),
      producto:            validate('producto',            formData.producto),
      servicio_solicitado: validate('servicio_solicitado', formData.servicio_solicitado),
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some(e => e !== '')) {
      showToast('Corrige los campos marcados antes de continuar.', 'error');
      return;
    }

    setSaving(true);
    try {
      const manoObra   = parseFloat(formData.costo_mano_obra)   || 0;
      const materiales = parseFloat(formData.costo_materiales)  || 0;
      const anticipo   = parseFloat(formData.anticipo)           || 0;
      const total      = manoObra + materiales;

      if (manoObra <= 0 || materiales <= 0) {
        showToast('El costo de mano de obra y materiales debe ser mayor a cero.', 'error');
        return;
      }
      if (anticipo < 0) {
        showToast('El anticipo no puede ser negativo.', 'error');
        return;
      }
      if (anticipo > total) {
        showToast('El anticipo no puede ser mayor al costo total (mano de obra + materiales).', 'error');
        return;
      }

      if (id) {
        await tallerUseCases.actualizarTicket(id, {
          nombre_cliente:      formData.nombre_cliente,
          telefono:            formData.telefono,
          producto:            formData.producto,
          servicio_solicitado: formData.servicio_solicitado,
          costo_mano_obra:     manoObra,
          costo_materiales:    materiales,
          costo_total:         total,
          anticipo,
        });
        showToast('Ticket actualizado con éxito', 'success');
        navigate('/talabarteria/registro-servicios');
      } else {
        await tallerUseCases.crearTicket({
          nombre_cliente:      formData.nombre_cliente,
          telefono:            formData.telefono,
          producto:            formData.producto,
          servicio_solicitado: formData.servicio_solicitado,
          estado:              'Recibido' as EstadoTicket,
          costo_mano_obra:     manoObra,
          costo_materiales:    materiales,
          anticipo,
        });
        showToast('Ticket registrado con éxito ✓', 'success');
        setFormData(initialForm);
        setErrors({});
      }
    } catch (error) {
      showToast('Error al guardar. Intenta de nuevo.', 'error');
      console.error('[NuevoServicioPage] Error al guardar ticket:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box className="fade-in">
      <Header
        title={id ? 'Editar Servicio' : 'Nuevo Servicio'}
        onBack={() => navigate(-1)}
        
        notificacionesHref="/notificaciones"
        notificacionesCount={notificacionesCount}
      />
      <Box sx={{ maxWidth: 768, mx: 'auto', p: 2 }}>
        <Box className="card" sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>

          <TextField
            name="nombre_cliente"
            label="Nombre del cliente"
            variant="outlined"
            fullWidth
            value={formData.nombre_cliente}
            onChange={handleInputChange}
            error={!!errors.nombre_cliente}
            helperText={errors.nombre_cliente}
            inputProps={{ 'aria-label': 'Nombre del cliente' }}
          />

          <TextField
            name="telefono"
            label="Teléfono"
            variant="outlined"
            fullWidth
            value={formData.telefono}
            onChange={handleInputChange}
            error={!!errors.telefono}
            helperText={errors.telefono || 'Ej. 3310001234 (10 dígitos)'}
            inputProps={{ inputMode: 'numeric', 'aria-label': 'Teléfono de contacto' }}
          />

          <TextField
            name="producto"
            label="Producto"
            variant="outlined"
            fullWidth
            value={formData.producto}
            onChange={handleInputChange}
            error={!!errors.producto}
            helperText={errors.producto}
            inputProps={{ 'aria-label': 'Tipo de producto a reparar' }}
          />

          <TextField
            name="servicio_solicitado"
            label="Servicio solicitado"
            variant="outlined"
            fullWidth
            multiline
            rows={2}
            value={formData.servicio_solicitado}
            onChange={handleInputChange}
            error={!!errors.servicio_solicitado}
            helperText={errors.servicio_solicitado || 'Cuéntanos qué necesita reparación...'}
            inputProps={{ 'aria-label': 'Descripción del servicio solicitado' }}
          />

          <TextField
            name="costo_mano_obra"
            label="Costo mano de obra"
            variant="outlined"
            fullWidth
            value={formData.costo_mano_obra}
            onChange={handleInputChange}
            placeholder="0"
            inputProps={{ inputMode: 'decimal', 'aria-label': 'Costo de mano de obra' }}
          />

          <TextField
            name="costo_materiales"
            label="Costo materiales"
            variant="outlined"
            fullWidth
            value={formData.costo_materiales}
            onChange={handleInputChange}
            placeholder="0"
            inputProps={{ inputMode: 'decimal', 'aria-label': 'Costo de materiales' }}
          />

          <TextField
            name="anticipo"
            label="Anticipo"
            variant="outlined"
            fullWidth
            value={formData.anticipo}
            onChange={handleInputChange}
            placeholder="0"
            inputProps={{ inputMode: 'decimal', 'aria-label': 'Anticipo del cliente' }}
          />

          <Button
            className="btn-primary"
            sx={{ mt: 2, py: 1.5, minHeight: 44, color: '#fff' }}
            onClick={handleSubmit}
            disabled={saving}
            aria-label={id ? 'Actualizar orden de servicio' : 'Registrar nueva orden de servicio'}
            startIcon={saving ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : null}
          >
            {saving ? 'Guardando...' : id ? 'Actualizar Orden' : 'Registrar Orden'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
