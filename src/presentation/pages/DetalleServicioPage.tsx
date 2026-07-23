import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Button, CircularProgress, Divider, Tooltip,
} from '@mui/material';
// @ts-ignore
import EditIcon from '@mui/icons-material/Edit';
// @ts-ignore
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Header } from '../components/Header';
import { EmptyState } from '../components/FeedbackUI';
import { useToast } from '../context/ToastContext';
import { TallerRepository } from '../../infrastructure/repositories/TallerRepository';
import { TallerUseCases } from '../../useCases/taller/TallerUseCases';
import { TiendaRepository } from '../../infrastructure/repositories/TiendaRepository';
import { COLORS } from '../context/theme';
import type { TicketTaller, EstadoTicket } from '../../domain/entities/taller';

const tallerRepository = new TallerRepository();
const tallerUseCases   = new TallerUseCases(tallerRepository);
const tiendaRepository = new TiendaRepository();

// Flujo ordenado de estados (Abandonado es opcional/lateral)
const FLUJO_ESTADOS: EstadoTicket[] = ['Recibido', 'En Proceso', 'Terminado', 'Entregado'];
const ESTADO_ABANDONADO: EstadoTicket = 'Abandonado';

const STATUS_STYLE: Record<EstadoTicket, { bg: string; color: string; border: string; emoji: string }> = {
  'Recibido':   { bg: COLORS.status.recibido.bg,   color: COLORS.status.recibido.color,   border: COLORS.status.recibido.border,   emoji: '📥' },
  'En Proceso': { bg: COLORS.status.enProceso.bg,  color: COLORS.status.enProceso.color,  border: COLORS.status.enProceso.border,  emoji: '⚙️' },
  'Terminado':  { bg: COLORS.status.terminado.bg,  color: COLORS.status.terminado.color,  border: COLORS.status.terminado.border,  emoji: '✅' },
  'Entregado':  { bg: COLORS.status.entregado.bg,  color: COLORS.status.entregado.color,  border: COLORS.status.entregado.border,  emoji: '🎁' },
  'Abandonado': { bg: COLORS.status.abandonado.bg, color: COLORS.status.abandonado.color, border: COLORS.status.abandonado.border, emoji: '🚫' },
};

// Fila de información con label y valor
const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', py: 0.75 }}>
    <Typography sx={{ fontSize: 13, color: COLORS.inkSecondary, fontWeight: 600, minWidth: 120 }}>{label}</Typography>
    <Typography sx={{ fontSize: 14, color: COLORS.ink, textAlign: 'right', flex: 1 }}>{value}</Typography>
  </Box>
);

// ── Stepper visual de estados ──────────────────────────────────────────────
const EstadoStepper = ({
  estadoActual,
  saving,
  onCambiar,
}: {
  estadoActual: EstadoTicket;
  saving: boolean;
  onCambiar: (e: EstadoTicket) => void;
}) => {
  const idxActual = FLUJO_ESTADOS.indexOf(estadoActual);
  const esAbandonado = estadoActual === ESTADO_ABANDONADO;

  return (
    <Box>
      {/* Flujo principal: Recibido → En Proceso → Terminado → Entregado */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0,
          overflowX: 'auto',
          pb: 0.5,
        }}
      >
        {FLUJO_ESTADOS.map((e, idx) => {
          const s = STATUS_STYLE[e];
          const activo   = estadoActual === e;
          const completado = !esAbandonado && idxActual > idx;

          return (
            <React.Fragment key={e}>
              {/* Nodo del estado */}
              <Tooltip title={activo ? 'Estado actual' : `Cambiar a "${e}"`} arrow>
                <Box
                  component="span"
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  <Box
                    component="button"
                    onClick={() => !saving && !activo && onCambiar(e)}
                    disabled={saving || activo}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 0.5,
                      border: 'none',
                      background: 'none',
                      cursor: activo ? 'default' : saving ? 'not-allowed' : 'pointer',
                      p: 0,
                      flexShrink: 0,
                      transition: 'opacity 0.18s',
                      opacity: saving && !activo ? 0.5 : 1,
                      '&:focus-visible': { outline: `2px solid ${s.color}`, borderRadius: 2 },
                    }}
                  >
                    {/* Círculo del paso */}
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: activo ? s.color : completado ? s.bg : COLORS.bg,
                        border: `2.5px solid ${activo ? s.color : completado ? s.color : COLORS.border}`,      
                        transition: 'all 0.22s ease',
                        boxShadow: activo ? `0 0 0 4px ${s.color}22` : 'none',
                        position: 'relative',
                      }}
                    >
                      {saving && activo ? (
                        <CircularProgress size={18} sx={{ color: '#fff' }} />
                      ) : completado ? (
                        <CheckCircleIcon sx={{ fontSize: 22, color: s.color }} />
                      ) : (
                        <Typography sx={{ fontSize: 18, lineHeight: 1 }}>{s.emoji}</Typography>
                      )}
                    </Box>

                    {/* Etiqueta */}
                    <Typography
                      sx={{
                        fontSize: 10,
                        fontWeight: activo ? 800 : 500,
                        color: activo ? s.color : completado ? s.color : COLORS.inkDisabled,
                        textAlign: 'center',
                        whiteSpace: 'nowrap',
                        letterSpacing: activo ? '0.02em' : 0,
                        maxWidth: 64,
                        lineHeight: 1.2,
                      }}
                    >
                      {e}
                    </Typography>
                  </Box>
                </Box>
              </Tooltip>

              {/* Conector entre pasos */}
              {idx < FLUJO_ESTADOS.length - 1 && (
                <Box
                  sx={{
                    flex: 1,
                    height: 3,
                    minWidth: 16,
                    borderRadius: 9999,
                    background: completado || (activo && idx < FLUJO_ESTADOS.length - 1)
                      ? STATUS_STYLE[FLUJO_ESTADOS[idx]].color
                      : COLORS.border,
                    mx: 0.5,
                    transition: 'background 0.3s ease',
                    alignSelf: 'flex-start',
                    mt: '20px',   // centrar respecto al círculo de 44px
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </Box>

      {/* ── Estado Abandonado ── separado abajo */}
      <Box sx={{ mt: 2 }}>
        <Tooltip
          title={esAbandonado ? 'Estado actual' : 'Marcar como Abandonado'}
          arrow
        >
          <Box
            component="button"
            onClick={() => !saving && !esAbandonado && onCambiar(ESTADO_ABANDONADO)}
            disabled={saving || esAbandonado}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              border: `1.5px dashed ${esAbandonado ? STATUS_STYLE.Abandonado.color : '#BDBDBD'}`,
              borderRadius: 9999,
              px: 2,
              py: 0.75,
              background: esAbandonado ? STATUS_STYLE.Abandonado.bg : 'transparent',
              color: esAbandonado ? STATUS_STYLE.Abandonado.color : '#9E9E9E',
              fontWeight: 700,
              fontSize: 13,
              cursor: esAbandonado ? 'default' : saving ? 'not-allowed' : 'pointer',
              transition: 'all 0.18s ease',
              opacity: saving && !esAbandonado ? 0.5 : 1,
              '&:hover:not(:disabled)': {
                background: STATUS_STYLE.Abandonado.bg,
                color: STATUS_STYLE.Abandonado.color,
                borderColor: STATUS_STYLE.Abandonado.color,
              },
              '&:focus-visible': { outline: `2px solid ${COLORS.inkTertiary}`, borderRadius: 9999 },
            }}
          >
            {saving && esAbandonado
              ? <CircularProgress size={14} sx={{ color: '#616161' }} />
              : <Typography sx={{ fontSize: 16 }}>🚫</Typography>
            }
            Abandonado
          </Box>
        </Tooltip>
      </Box>

      <Typography sx={{ fontSize: 12, color: COLORS.inkDisabled, mt: 1.5, lineHeight: 1.5 }}>
        Toca un estado para actualizar sin salir de esta pantalla.
      </Typography>
    </Box>
  );
};

// ── Página principal ──────────────────────────────────────────────────────
export const DetalleServicioPage: React.FC = () => {
  const { id }   = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [ticket, setTicket]               = useState<TicketTaller | null>(null);
  const [loading, setLoading]             = useState(true);
  const [savingEstado, setSavingEstado]   = useState(false);
  const [notificacionesCount, setNotificacionesCount] = useState(0);

  useEffect(() => {
    tiendaRepository.getProductos().then(productos => {
      setNotificacionesCount(productos.filter(p => p.stock_actual < 5).length);
    });
    if (id) {
      tallerUseCases.getTicketById(id).then(data => {
        setTicket(data);
        setLoading(false);
      });
    }
  }, [id]);

  const handleCambiarEstado = async (nuevoEstado: EstadoTicket) => {
    if (!id || !ticket || ticket.estado === nuevoEstado) return;
    setSavingEstado(true);
    try {
      await tallerUseCases.actualizarEstadoTicket(id, nuevoEstado);
      setTicket(prev => prev ? { ...prev, estado: nuevoEstado } : prev);
      showToast(`Estado actualizado: ${nuevoEstado}`, 'success');
    } catch (error) {
      showToast('Error al actualizar el estado.', 'error');
      console.error('[DetalleServicioPage] handleCambiarEstado:', error);
    } finally {
      setSavingEstado(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress sx={{ color: COLORS.primary }} />
      </Box>
    );
  }

  if (!ticket) {
    return (
      <EmptyState
        icon="🔍"
        title="Servicio no encontrado"
        subtitle="El ticket que buscas no existe o fue eliminado."
        actionLabel="Volver al registro"
        onAction={() => navigate('/talabarteria/registro-servicios')}
      />
    );
  }

  const estadoStyle = STATUS_STYLE[ticket.estado];
  const restante    = ticket.costo_total - ticket.anticipo;
  const fechaTexto  = ticket.fecha_recepcion
    ? new Date(ticket.fecha_recepcion).toLocaleDateString('es-MX', {
        day: '2-digit', month: 'long', year: 'numeric',
      })
    : '—';

  return (
    <Box className="fade-in">
      <Header
        title="Detalle del Servicio"
        onBack={() => navigate(-1)}
        
        notificacionesHref="/notificaciones"
        notificacionesCount={notificacionesCount}
      />

      <Box sx={{ maxWidth: 640, mx: 'auto', p: 2, pb: 12 }}>

        {/* ── Encabezado del ticket ── */}
        <Paper className="card" elevation={0} sx={{ p: 3, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 800, fontSize: 20, color: COLORS.ink, lineHeight: 1.2 }}>
                {ticket.producto}
              </Typography>
              <Typography sx={{ fontSize: 13, color: COLORS.inkSecondary, mt: 0.5 }}>
                Ticket #{ticket.id_servicio} · {fechaTexto}
              </Typography>
            </Box>
            {/* Badge de estado actual */}
            <Box sx={{
              background: estadoStyle.bg,
              color: estadoStyle.color,
              border: `1.5px solid ${estadoStyle.border}`,
              borderRadius: 9999,
              px: 1.5, py: 0.5,
              fontSize: 12,
              fontWeight: 700,
              whiteSpace: 'nowrap',
              ml: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}>
              <span style={{ fontSize: 14 }}>{estadoStyle.emoji}</span>
              {ticket.estado}
            </Box>
          </Box>

          <Divider sx={{ my: 1.5, borderColor: COLORS.border }} />

          {/* ── Datos del cliente ── */}
          <Typography sx={{ fontSize: 11, fontWeight: 700, color: COLORS.secondary, textTransform: 'uppercase', letterSpacing: '0.06em', mb: 1 }}>
            Cliente
          </Typography>
          <InfoRow label="Nombre"   value={ticket.nombre_cliente} />
          <InfoRow label="Teléfono" value={ticket.telefono || 'No proporcionado'} />

          <Divider sx={{ my: 1.5, borderColor: COLORS.border }} />

          {/* ── Descripción del servicio ── */}
          <Typography sx={{ fontSize: 11, fontWeight: 700, color: COLORS.secondary, textTransform: 'uppercase', letterSpacing: '0.06em', mb: 1 }}>
            Servicio
          </Typography>
          <Typography sx={{ fontSize: 14, color: COLORS.ink, lineHeight: 1.6 }}>
            {ticket.servicio_solicitado}
          </Typography>

          <Divider sx={{ my: 1.5, borderColor: COLORS.border }} />

          {/* ── Costos ── */}
          <Typography sx={{ fontSize: 11, fontWeight: 700, color: COLORS.secondary, textTransform: 'uppercase', letterSpacing: '0.06em', mb: 1 }}>
            Costos
          </Typography>
          <Box sx={{ background: COLORS.secondarySubtle, borderRadius: 2, p: 2 }}>
            <InfoRow label="Mano de obra"  value={`$${ticket.costo_mano_obra.toFixed(2)}`} />
            <InfoRow label="Materiales"    value={`$${ticket.costo_materiales.toFixed(2)}`} />
            <Divider sx={{ my: 0.75, borderColor: COLORS.borderStrong }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
              <Typography sx={{ fontWeight: 800, fontSize: 15, color: COLORS.ink }}>Total</Typography>
              <Typography sx={{ fontWeight: 800, fontSize: 15, color: COLORS.primary }}>
                ${ticket.costo_total.toFixed(2)}
              </Typography>
            </Box>
            <InfoRow label="Anticipo"  value={`$${ticket.anticipo.toFixed(2)}`} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 14, color: restante > 0 ? COLORS.error : COLORS.success }}>
                Restante
              </Typography>
              <Typography sx={{ fontWeight: 700, fontSize: 14, color: restante > 0 ? COLORS.error : COLORS.success }}>
                ${restante.toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* ── Stepper dinámico de estado ── */}
        <Paper className="card" elevation={0} sx={{ p: 3, mb: 2 }}>
          <Typography sx={{ fontSize: 11, fontWeight: 700, color: COLORS.secondary, textTransform: 'uppercase', letterSpacing: '0.06em', mb: 2 }}>
            Actualizar Estado
          </Typography>
          <EstadoStepper
            estadoActual={ticket.estado}
            saving={savingEstado}
            onCambiar={handleCambiarEstado}
          />
        </Paper>

        {/* ── Botón editar datos ── */}
        <Button
          onClick={() => navigate(`/editar-servicio/${ticket.id_servicio}`)}
          startIcon={<EditIcon />}
          fullWidth
          sx={{
            borderRadius: 9999,
            py: 1.5,
            fontWeight: 700,
            fontSize: 14,
            border: `1.5px solid ${COLORS.borderStrong}`,
            color: COLORS.inkSecondary,
            background: 'transparent',
            '&:hover': { background: COLORS.secondarySubtle, borderColor: COLORS.secondary },
            minHeight: 48,
          }}
          aria-label="Editar todos los datos del servicio"
        >
          Editar datos del servicio
        </Button>

      </Box>
    </Box>
  );
};
