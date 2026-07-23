import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  Box, Typography, Paper, IconButton,
  Checkbox, Tooltip, Collapse, Fab, InputBase,
} from '@mui/material';
import { COLORS } from '../../presentation/context/theme';
// @ts-ignore
import DeleteIcon from '@mui/icons-material/Delete';
// @ts-ignore
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
// @ts-ignore
import FilterListIcon from '@mui/icons-material/FilterList';
// @ts-ignore
import AddIcon from '@mui/icons-material/Add';
// @ts-ignore
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { SkeletonCard, EmptyState } from '../components/FeedbackUI';
import { usePagination } from '../components/usePagination';
import { PaginationControls } from '../components/PaginationControls';
import { useToast } from '../context/ToastContext';
import { TallerRepository } from '../../infrastructure/repositories/TallerRepository';
import { TiendaRepository } from '../../infrastructure/repositories/TiendaRepository';
import { TallerUseCases } from '../../useCases/taller/TallerUseCases';
import type { TicketTaller, EstadoTicket } from '../../domain/entities/taller';

const tallerRepository = new TallerRepository();
const tiendaRepository = new TiendaRepository();
const tallerUseCases   = new TallerUseCases(tallerRepository);

const ESTADOS: EstadoTicket[] = ['Recibido', 'En Proceso', 'Terminado', 'Entregado', 'Abandonado'];

const STATUS_STYLE: Record<EstadoTicket, { bg: string; color: string }> = {
  'Recibido':   { bg: COLORS.status.recibido.bg,   color: COLORS.status.recibido.color },
  'En Proceso': { bg: COLORS.status.enProceso.bg,  color: COLORS.status.enProceso.color },
  'Terminado':  { bg: COLORS.status.terminado.bg,  color: COLORS.status.terminado.color },
  'Entregado':  { bg: COLORS.status.entregado.bg,  color: COLORS.status.entregado.color },
  'Abandonado': { bg: COLORS.status.abandonado.bg, color: COLORS.status.abandonado.color },
};

// ── Dot de color ───────────────────────────────────────────────────────────
const Dot = ({ color, size = 7 }: { color: string; size?: number }) => (
  <Box component="span" sx={{
    display: 'inline-block', width: size, height: size,
    borderRadius: '50%', background: color, flexShrink: 0,
  }} />
);

// ── Chip de estado en tarjeta ──────────────────────────────────────────────
const EstadoChip = ({ estado }: { estado: EstadoTicket }) => {
  const s = STATUS_STYLE[estado];
  return (
    <Box sx={{
      display: 'inline-flex', alignItems: 'center', gap: 0.5,
      px: 1, py: 0.25,
      borderRadius: 9999,
      background: s.bg,
      border: `1px solid ${s.color}30`,
    }}>
      <Dot color={s.color} />
      <Typography sx={{ fontSize: 10, fontWeight: 700, color: s.color, whiteSpace: 'nowrap' }}>
        {estado}
      </Typography>
    </Box>
  );
};

// ── Selector de filtro tipo pill ──────────────────────────────────────────
const FiltroSelector = ({
  value, tickets, onChange,
}: {
  value: EstadoTicket | 'Todos';
  tickets: TicketTaller[];
  onChange: (v: EstadoTicket | 'Todos') => void;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const color = value === 'Todos' ? COLORS.primary : STATUS_STYLE[value].color;
  const count = value === 'Todos'
    ? tickets.length
    : tickets.filter(t => t.estado === value).length;

  // Cerrar al hacer click fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const opciones: (EstadoTicket | 'Todos')[] = ['Todos', ...ESTADOS];

  return (
    <Box ref={ref} sx={{ position: 'relative' }}>
      {/* Pill del filtro activo */}
      <Box
        onClick={() => setOpen(o => !o)}
        sx={{
          display: 'inline-flex', alignItems: 'center', gap: 0.75,
          px: 1.25, py: 0.5,
          borderRadius: 9999,
          border: `1px solid ${color}40`,
          background: value === 'Todos' ? COLORS.primarySubtle : STATUS_STYLE[value as EstadoTicket].bg,
          cursor: 'pointer',
          userSelect: 'none',
          transition: 'all 0.15s ease',
          '&:hover': { borderColor: color },
        }}
      >
        <FilterListIcon sx={{ fontSize: 13, color, opacity: 0.8 }} />
        <Dot color={color} />
        <Typography sx={{ fontSize: 12, fontWeight: 700, color }}>
          {value === 'Todos' ? 'Todos' : value}
        </Typography>
        <Typography sx={{ fontSize: 11, color: `${color}99`, fontWeight: 500 }}>
          ({count})
        </Typography>
        <Box component="span" sx={{
          fontSize: 10, color, ml: 0.25, lineHeight: 1,
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.18s ease',
          display: 'inline-block',
        }}>▾</Box>
      </Box>

      {/* Dropdown compacto */}
      {open && (
        <Paper
          elevation={4}
          sx={{
            position: 'absolute', top: 'calc(100% + 4px)', left: 0,
            zIndex: 1300, minWidth: 160,
            borderRadius: 2, overflow: 'hidden',
            border: `1px solid ${COLORS.border}`,
            py: 0.5,
          }}
        >
          {opciones.map(op => {
            const c = op === 'Todos' ? COLORS.primary : STATUS_STYLE[op].color;
            const bg = op === 'Todos' ? COLORS.primarySubtle : STATUS_STYLE[op].bg;
            const n = op === 'Todos'
              ? tickets.length
              : tickets.filter(t => t.estado === op).length;
            const activo = value === op;
            return (
              <Box
                key={op}
                onClick={() => { onChange(op); setOpen(false); }}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 1,
                  px: 1.5, py: 0.625,
                  cursor: 'pointer',
                  background: activo ? bg : 'transparent',
                  '&:hover': { background: bg },
                  transition: 'background 0.12s',
                }}
              >
                <Dot color={c} />
                <Typography sx={{ fontSize: 12, fontWeight: activo ? 700 : 500, color: activo ? c : COLORS.inkSecondary, flex: 1 }}>
                  {op}
                </Typography>
                <Typography sx={{ fontSize: 11, color: `${c}99`, fontWeight: 600 }}>
                  {n}
                </Typography>
              </Box>
            );
          })}
        </Paper>
      )}
    </Box>
  );
};

// ── Página principal ───────────────────────────────────────────────────────
export const RegistroServiciosPage: React.FC = () => {
  const [tickets, setTickets]               = useState<TicketTaller[]>([]);
  const [loading, setLoading]               = useState(true);
  const [filtroEstado, setFiltroEstado]     = useState<EstadoTicket | 'Todos'>('Todos');
  const [busqueda, setBusqueda]             = useState('');
  const [modoSeleccion, setModoSeleccion]   = useState(false);
  const [seleccionados, setSeleccionados]   = useState<Set<number>>(new Set());
  const [notificacionesCount, setNotificacionesCount] = useState(0);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const cargarTickets = () => {
    setLoading(true);
    tallerUseCases.getTickets().then(data => {
      const ordenados = [...data].sort((a, b) => b.id_servicio - a.id_servicio);
      setTickets(ordenados);
      setLoading(false);
    }).catch(e => {
      console.error(e);
      setLoading(false);
    });
  };

  useEffect(() => {
    cargarTickets();
    tiendaRepository.getProductos().then(ps =>
      setNotificacionesCount(ps.filter(p => p.stock_actual < 5).length)
    );
  }, []);

  const ticketsFiltrados = useMemo(() => {
    let filtrados = tickets;
    if (filtroEstado !== 'Todos') {
      filtrados = filtrados.filter(t => t?.estado === filtroEstado);
    }
    if (busqueda.trim() !== '') {
      const b = busqueda.toLowerCase();
      filtrados = filtrados.filter(t => 
        t?.nombre_cliente?.toLowerCase().includes(b) || 
        t?.servicio_solicitado?.toLowerCase().includes(b) ||
        t?.producto?.toLowerCase().includes(b)
      );
    }
    return filtrados;
  }, [tickets, filtroEstado, busqueda]);

  const {
    paginatedItems,
    totalPages,
    currentPage,
    goToPage
  } = usePagination(ticketsFiltrados, 4);

  const toggleSeleccion = (id: number) => {
    setSeleccionados(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const activarModoSeleccion = () => { setModoSeleccion(true); setSeleccionados(new Set()); };
  const cancelarSeleccion    = () => { setModoSeleccion(false); setSeleccionados(new Set()); };

  const eliminarSeleccionados = async () => {
    if (seleccionados.size === 0) return;
    const plural = seleccionados.size > 1 ? 'los servicios seleccionados' : 'el servicio seleccionado';
    if (!window.confirm(`¿Eliminar ${plural}? Esta acción no se puede deshacer.`)) return;
    try {
      await Promise.all([...seleccionados].map(id => tallerUseCases.eliminarTicket(String(id))));
      setTickets(prev => prev.filter(t => !seleccionados.has(t.id_servicio)));
      showToast(`${seleccionados.size} servicio(s) eliminado(s).`, 'success');
      cancelarSeleccion();
    } catch {
      showToast('Error al eliminar. Intenta de nuevo.', 'error');
    }
  };

  return (
    <Box className="fade-in">
      <Header
        title="Talabarteria"
        backHref="/"
        
        notificacionesHref="/notificaciones"
        notificacionesCount={notificacionesCount}
      />

      <Box sx={{ maxWidth: 768, mx: 'auto', px: 2, pt: 1.5, pb: 12 }}>

        {/* ── Barra compacta: filtro + buscador + acciones ── */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <FiltroSelector
            value={filtroEstado}
            tickets={tickets}
            onChange={setFiltroEstado}
          />
          
          {/* ── Buscador premium ───────────────────────────── */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              px: 1.25,
              height: 36,
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
                fontSize: 16,
                color: busqueda ? COLORS.primary : COLORS.inkTertiary,
                flexShrink: 0,
                transition: 'color 0.2s ease',
              }}
            />
            <InputBase
              placeholder="Buscar cliente, servicio o producto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              sx={{
                flex: 1,
                fontSize: 13,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                color: COLORS.ink,
                '& input': {
                  p: 0,
                  '&::placeholder': {
                    color: COLORS.inkTertiary,
                    opacity: 1,
                    fontSize: 13,
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
                <span className="material-symbols-outlined" style={{ fontSize: 14, lineHeight: 1 }}>close</span>
              </IconButton>
            )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {/* Acciones de selección */}
            <Collapse in={modoSeleccion} orientation="horizontal">
              <Tooltip title="Cancelar">
                <IconButton size="small" onClick={cancelarSeleccion} sx={{ color: COLORS.inkTertiary }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
                </IconButton>
              </Tooltip>
            </Collapse>

            {/* Botón de papelera */}
            <Tooltip title={modoSeleccion
              ? seleccionados.size > 0 ? `Eliminar ${seleccionados.size}` : 'Selecciona elementos'
              : 'Seleccionar para eliminar'
            }>
              <span>
                <IconButton
                  size="small"
                  onClick={modoSeleccion ? (seleccionados.size > 0 ? eliminarSeleccionados : undefined) : activarModoSeleccion}
                  sx={{
                    color: modoSeleccion && seleccionados.size > 0 ? COLORS.error : COLORS.inkSecondary,
                    opacity: modoSeleccion && seleccionados.size === 0 ? 0.4 : 1,
                    border: '1px solid',
                    borderColor: modoSeleccion && seleccionados.size > 0 ? `${COLORS.error}33` : COLORS.border,
                    borderRadius: 1.5,
                    p: 0.5,
                    transition: 'all 0.18s ease',
                  }}
                >
                  {modoSeleccion
                    ? <DeleteIcon sx={{ fontSize: 18 }} />
                    : <DeleteSweepIcon sx={{ fontSize: 18 }} />}
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Box>

        {/* ── Lista ── */}
        {loading ? (
          <SkeletonCard />
        ) : ticketsFiltrados.length === 0 ? (
          <EmptyState
            icon="🔧"
            title={filtroEstado === 'Todos' ? 'No hay servicios registrados' : `Sin servicios "${filtroEstado}"`}
            subtitle={filtroEstado === 'Todos' ? 'Registra el primer servicio desde Nuevo Servicio.' : 'Prueba otro filtro.'}
            actionLabel={filtroEstado !== 'Todos' ? 'Ver todos' : undefined}
            onAction={filtroEstado !== 'Todos' ? () => setFiltroEstado('Todos') : undefined}
          />
        ) : (
          <Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {paginatedItems.map(t => {
                const seleccionado = seleccionados.has(t.id_servicio);
                return (
                  <Paper
                    key={t.id_servicio}
                    className="card"
                    elevation={0}
                    sx={{
                      p: 0,
                      outline: seleccionado ? `2px solid ${COLORS.primary}` : 'none',
                      transition: 'outline 0.12s ease, box-shadow 0.12s ease',
                    }}
                  >
                    <Box
                      onClick={() =>
                        modoSeleccion
                          ? toggleSeleccion(t.id_servicio)
                          : navigate(`/talabarteria/servicio/${t.id_servicio}`)
                      }
                      sx={{
                        px: 1.5, py: 1.25,
                        display: 'flex', alignItems: 'center', gap: 1.25,
                        cursor: 'pointer', userSelect: 'none',
                      }}
                    >
                      {modoSeleccion && (
                        <Checkbox
                          checked={seleccionado}
                          size="small"
                          sx={{ p: 0, color: COLORS.primary, '&.Mui-checked': { color: COLORS.primary } }}
                          onClick={e => { e.stopPropagation(); toggleSeleccion(t.id_servicio); }}
                        />
                      )}

                      {/* Indicador de estado lateral */}
                      <Box sx={{
                        width: 3, alignSelf: 'stretch', borderRadius: 9999,
                        background: STATUS_STYLE[t.estado].color, flexShrink: 0, minHeight: 32,
                      }} />

                      {/* Contenido */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: 13.5, color: COLORS.ink, lineHeight: 1.3 }} noWrap>
                          {t.producto}
                        </Typography>
                        <Typography sx={{ fontSize: 12, color: COLORS.inkTertiary, lineHeight: 1.3 }} noWrap>
                          {t.nombre_cliente}
                          <Box component="span" sx={{ mx: 0.5, opacity: 0.4 }}>·</Box>
                          {t.servicio_solicitado}
                        </Typography>
                      </Box>

                      {/* Estado */}
                      <EstadoChip estado={t.estado} />
                    </Box>
                  </Paper>
                );
              })}
            </Box>
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
            />
          </Box>
        )}
      </Box>

      {/* FAB para Nuevo Servicio */}
      <Fab
        color="primary"
        aria-label="nuevo servicio"
        onClick={() => navigate('/talabarteria/nuevo')}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: COLORS.primary,
          boxShadow: '0 4px 12px rgba(140, 38, 31, 0.3)',
          '&:hover': { background: COLORS.primaryDark },
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};
