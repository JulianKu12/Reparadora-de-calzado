import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Box, Typography, IconButton, Paper, Checkbox, Tooltip, Collapse, Fab, InputBase } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { SkeletonCard, EmptyState } from './FeedbackUI';
import { PaginationControls } from './PaginationControls';
import { usePagination } from './usePagination';
import { useToast } from '../context/ToastContext';
import { playGlupSound } from '../utils/sound';
import { TallerRepository } from '../../infrastructure/repositories/TallerRepository';
import { TallerUseCases } from '../../useCases/taller/TallerUseCases';
import { COLORS } from '../context/theme';
import type { TicketTaller, EstadoTicket } from '../../domain/entities/taller';

const tallerRepository = new TallerRepository();
const tallerUseCases   = new TallerUseCases(tallerRepository);

const ESTADOS: EstadoTicket[] = ['Recibido', 'En Proceso', 'Terminado', 'Entregado', 'Abandonado'];
const STATUS_STYLE: Record<EstadoTicket, { bg: string; color: string }> = {
  'Recibido':   { bg: COLORS.status.recibido.bg,   color: COLORS.status.recibido.color },
  'En Proceso': { bg: COLORS.status.enProceso.bg,  color: COLORS.status.enProceso.color },
  'Terminado':  { bg: COLORS.status.terminado.bg,  color: COLORS.status.terminado.color },
  'Entregado':  { bg: COLORS.status.entregado.bg,  color: COLORS.status.entregado.color },
  'Abandonado': { bg: COLORS.status.abandonado.bg, color: COLORS.status.abandonado.color },
};

const Dot = ({ color, size = 7 }: { color: string; size?: number }) => (
  <Box component="span" sx={{ display: 'inline-block', width: size, height: size, borderRadius: '50%', background: color, flexShrink: 0 }} />
);

const EstadoChip = ({ estado }: { estado: EstadoTicket }) => {
  const s = STATUS_STYLE[estado];
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 1, py: 0.25, borderRadius: 9999, background: s.bg, border: `1px solid ${s.color}30` }}>
      <Dot color={s.color} />
      <Typography sx={{ fontSize: 10, fontWeight: 700, color: s.color, whiteSpace: 'nowrap' }}>{estado}</Typography>
    </Box>
  );
};

const FiltroSelector = ({ value, tickets, onChange }: { value: EstadoTicket | 'Todos', tickets: TicketTaller[], onChange: (v: EstadoTicket | 'Todos') => void }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const color = value === 'Todos' ? COLORS.primary : STATUS_STYLE[value].color;
  const count = value === 'Todos' ? tickets.length : tickets.filter(t => t.estado === value).length;

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const opciones: (EstadoTicket | 'Todos')[] = ['Todos', ...ESTADOS];

  return (
    <Box ref={ref} sx={{ position: 'relative' }}>
      <Box
        onClick={() => setOpen(o => !o)}
        sx={{
          display: 'inline-flex', alignItems: 'center', gap: 0.75, px: 1.25, py: 0.5, borderRadius: 9999, border: `1px solid ${color}40`,
          background: value === 'Todos' ? COLORS.primarySubtle : STATUS_STYLE[value as EstadoTicket].bg,
          cursor: 'pointer', userSelect: 'none', transition: 'all 0.15s ease', '&:hover': { borderColor: color },
        }}
      >
        <FilterListIcon sx={{ fontSize: 13, color, opacity: 0.8 }} />
        <Dot color={color} />
        <Typography sx={{ fontSize: 12, fontWeight: 700, color }}>{value === 'Todos' ? 'Todos' : value}</Typography>
        <Typography sx={{ fontSize: 11, color: `${color}99`, fontWeight: 500 }}>({count})</Typography>
      </Box>
      {open && (
        <Paper elevation={4} sx={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 1300, minWidth: 160, borderRadius: 2, overflow: 'hidden', border: `1px solid ${COLORS.border}`, py: 0.5 }}>
          {opciones.map(op => {
            const c = op === 'Todos' ? COLORS.primary : STATUS_STYLE[op].color;
            const bg = op === 'Todos' ? COLORS.primarySubtle : STATUS_STYLE[op].bg;
            const activo = value === op;
            return (
              <Box key={op} onClick={() => { onChange(op); setOpen(false); }} sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 0.625, cursor: 'pointer', background: activo ? bg : 'transparent', '&:hover': { background: bg } }}>
                <Dot color={c} />
                <Typography sx={{ fontSize: 12, fontWeight: activo ? 700 : 500, color: activo ? c : COLORS.inkSecondary, flex: 1 }}>{op}</Typography>
              </Box>
            );
          })}
        </Paper>
      )}
    </Box>
  );
};

export const TalabarteriaView: React.FC = () => {
  const [tickets, setTickets] = useState<TicketTaller[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState<EstadoTicket | 'Todos'>('Todos');
  const [busqueda, setBusqueda] = useState('');
  const [modoSeleccion, setModoSeleccion] = useState(false);
  const [seleccionados, setSeleccionados] = useState<Set<number>>(new Set());
  const navigate = useNavigate();
  const { showToast } = useToast();

  const cargarTickets = () => {
    setLoading(true);
    tallerUseCases.getTickets().then(data => {
      const ordenados = [...data].sort((a, b) => b.id_servicio - a.id_servicio);
      setTickets(ordenados);
      setLoading(false);
    }).catch(e => { console.error(e); setLoading(false); });
  };

  useEffect(() => { cargarTickets(); }, []);

  const ticketsFiltrados = useMemo(() => {
    let filtrados = tickets;
    if (filtroEstado !== 'Todos') filtrados = filtrados.filter(t => t?.estado === filtroEstado);
    if (busqueda.trim() !== '') {
      const b = busqueda.toLowerCase();
      filtrados = filtrados.filter(t => t?.nombre_cliente?.toLowerCase().includes(b) || t?.servicio_solicitado?.toLowerCase().includes(b) || t?.producto?.toLowerCase().includes(b));
    }
    return filtrados;
  }, [tickets, filtroEstado, busqueda]);

  const { paginatedItems, totalPages, currentPage, goToPage } = usePagination(ticketsFiltrados, 4);

  const toggleSeleccion = (id: number) => {
    setSeleccionados(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  };

  const activarModoSeleccion = () => { setModoSeleccion(true); setSeleccionados(new Set()); };
  const cancelarSeleccion = () => { setModoSeleccion(false); setSeleccionados(new Set()); };

  const eliminarSeleccionados = async () => {
    if (seleccionados.size === 0) return;
    if (!window.confirm(`¿Eliminar ${seleccionados.size} servicio(s)?`)) return;
    try {
      await Promise.all([...seleccionados].map(id => tallerUseCases.eliminarTicket(String(id))));
      setTickets(prev => prev.filter(t => !seleccionados.has(t.id_servicio)));
      showToast(`${seleccionados.size} servicio(s) eliminado(s).`, 'success');
      cancelarSeleccion();
    } catch { showToast('Error al eliminar.', 'error'); }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        <FiltroSelector value={filtroEstado} tickets={tickets} onChange={setFiltroEstado} />
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 0.75, px: 1.25, height: 36, borderRadius: 9999, bgcolor: '#FEF9F0', border: '1.5px solid', borderColor: busqueda ? COLORS.primary : 'rgba(212,163,115,0.38)' }}>
          <SearchIcon sx={{ fontSize: 16, color: busqueda ? COLORS.primary : COLORS.inkTertiary }} />
          <InputBase placeholder="Buscar..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} sx={{ flex: 1, fontSize: 13, color: COLORS.ink }} />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Collapse in={modoSeleccion} orientation="horizontal">
            <IconButton size="small" onClick={cancelarSeleccion} sx={{ color: COLORS.inkTertiary }}><span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span></IconButton>
          </Collapse>
          <Tooltip title={modoSeleccion ? 'Eliminar' : 'Seleccionar'}>
            <IconButton size="small" onClick={modoSeleccion ? (seleccionados.size > 0 ? eliminarSeleccionados : undefined) : activarModoSeleccion} sx={{ color: modoSeleccion && seleccionados.size > 0 ? COLORS.error : COLORS.inkSecondary, border: '1px solid', borderColor: COLORS.border, borderRadius: 1.5, p: 0.5 }}>
              {modoSeleccion ? <DeleteIcon sx={{ fontSize: 18 }} /> : <DeleteSweepIcon sx={{ fontSize: 18 }} />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {loading ? <SkeletonCard /> : ticketsFiltrados.length === 0 ? <EmptyState icon="🔧" title="Sin servicios" /> : (
        <Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {paginatedItems.map(t => {
              const seleccionado = seleccionados.has(t.id_servicio);
              return (
                <Paper key={t.id_servicio} elevation={0} sx={{ p: 0, outline: seleccionado ? `2px solid ${COLORS.primary}` : 'none' }}>
                  <Box onClick={() => modoSeleccion ? toggleSeleccion(t.id_servicio) : navigate(`/detalle-servicio/${t.id_servicio}`)} sx={{ px: 1.5, py: 1.25, display: 'flex', alignItems: 'center', gap: 1.25, cursor: 'pointer' }}>
                    {modoSeleccion && <Checkbox checked={seleccionado} size="small" onClick={e => { e.stopPropagation(); toggleSeleccion(t.id_servicio); }} />}
                    <Box sx={{ width: 3, alignSelf: 'stretch', borderRadius: 9999, background: STATUS_STYLE[t.estado].color, flexShrink: 0, minHeight: 32 }} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: 13.5, color: COLORS.ink }} noWrap>{t.producto}</Typography>
                      <Typography sx={{ fontSize: 12, color: COLORS.inkTertiary }} noWrap>{t.nombre_cliente} · {t.servicio_solicitado}</Typography>
                    </Box>
                    <EstadoChip estado={t.estado} />
                  </Box>
                </Paper>
              );
            })}
          </Box>
          <Box sx={{ mt: 4 }}>
            <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
          </Box>
        </Box>
      )}

      <Fab 
        color="primary" 
        aria-label="nuevo servicio"
        onClick={() => { playGlupSound(); navigate('/nuevo-servicio'); }}
        sx={{ 
          position: 'fixed', 
          bottom: 24, 
          right: 24, 
          background: '#C4973B',
          '&:hover': { background: '#A37D30' }
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};
