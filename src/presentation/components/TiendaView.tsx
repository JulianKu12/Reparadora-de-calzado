import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Box, Typography, Paper, IconButton, Checkbox, Tooltip, Collapse, InputBase, SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import FilterListIcon from '@mui/icons-material/FilterList';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HistoryIcon from '@mui/icons-material/History';
import { useNavigate } from 'react-router-dom';
import { SkeletonCard, EmptyState } from './FeedbackUI';
import { playGlupSound } from '../utils/sound';
import { usePagination } from './usePagination';
import { PaginationControls } from './PaginationControls';
import { useToast } from '../context/ToastContext';
import { TiendaRepository } from '../../infrastructure/repositories/TiendaRepository';
import { TiendaUseCases } from '../../useCases/tienda/TiendaUseCases';
import { COLORS } from '../context/theme';
import type { Producto } from '../../domain/entities/tienda';

const tiendaRepository = new TiendaRepository();
const tiendaUseCases = new TiendaUseCases(tiendaRepository);

type EstadoStock = 'Con Stock' | 'Bajo Stock' | 'Sin Stock';
const STATUS_STYLE: Record<EstadoStock, { bg: string; color: string; label: string }> = {
  'Con Stock':   { bg: COLORS.status.terminado.bg,  color: COLORS.status.terminado.color, label: '' },
  'Bajo Stock':  { bg: '#FFF3E0',   color: '#EF6C00', label: 'Bajo' },
  'Sin Stock':   { bg: '#F5F5F5',  color: '#757575', label: 'Agotado' },
};

const Dot = ({ color, size = 7 }: { color: string; size?: number }) => (
  <Box component="span" sx={{ display: 'inline-block', width: size, height: size, borderRadius: '50%', background: color, flexShrink: 0 }} />
);

const FiltroSelector = ({ value, productos, onChange }: { value: EstadoStock | 'Todos', productos: Producto[], onChange: (v: EstadoStock | 'Todos') => void }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const color = value === 'Todos' ? COLORS.primary : (value === 'Sin Stock' ? STATUS_STYLE['Sin Stock'].color : STATUS_STYLE['Bajo Stock'].color);
  const getCount = (val: EstadoStock | 'Todos') => {
    if (val === 'Todos') return productos.length;
    if (val === 'Con Stock') return productos.filter(p => p.stock_actual >= 5).length;
    if (val === 'Bajo Stock') return productos.filter(p => p.stock_actual > 0 && p.stock_actual < 5).length;
    return productos.filter(p => p.stock_actual === 0).length;
  };
  const count = getCount(value);
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  const opciones: (EstadoStock | 'Todos')[] = ['Todos', 'Con Stock', 'Bajo Stock', 'Sin Stock'];
  return (
    <Box ref={ref} sx={{ position: 'relative', ml: 1 }}>
      <Box onClick={() => setOpen(o => !o)} sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, px: 1.25, py: 0.5, borderRadius: 9999, border: `1px solid ${color}40`, background: value === 'Todos' ? COLORS.primarySubtle : (value === 'Sin Stock' ? STATUS_STYLE['Sin Stock'].bg : STATUS_STYLE['Bajo Stock'].bg), cursor: 'pointer', userSelect: 'none', transition: 'all 0.15s ease', '&:hover': { borderColor: color } }}>
        <FilterListIcon sx={{ fontSize: 13, color, opacity: 0.8 }} />
        <Dot color={color} />
        <Typography sx={{ fontSize: 12, fontWeight: 700, color }}>{value === 'Todos' ? 'Todos' : value}</Typography>
        <Typography sx={{ fontSize: 11, color: `${color}99`, fontWeight: 500 }}>({count})</Typography>
      </Box>
      {open && (
        <Paper elevation={4} sx={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 1300, minWidth: 160, borderRadius: 2, overflow: 'hidden', border: `1px solid ${COLORS.border}`, py: 0.5 }}>
          {opciones.map(op => {
            const c = op === 'Todos' ? COLORS.primary : (op === 'Sin Stock' ? STATUS_STYLE['Sin Stock'].color : STATUS_STYLE['Bajo Stock'].color);
            const bg = op === 'Todos' ? COLORS.primarySubtle : (op === 'Sin Stock' ? STATUS_STYLE['Sin Stock'].bg : STATUS_STYLE['Bajo Stock'].bg);
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

export const TiendaView: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<EstadoStock | 'Todos'>('Todos');
  const [modoSeleccion, setModoSeleccion] = useState(false);
  const [seleccionados, setSeleccionados] = useState<Set<number>>(new Set());
  const navigate = useNavigate();
  const { showToast } = useToast();

  const cargarProductos = () => {
    setLoading(true);
    tiendaUseCases.getProductos().then(data => { setProductos(data); setLoading(false); });
  };
  useEffect(() => { cargarProductos(); }, []);
  const getEstadoProducto = (p: Producto): EstadoStock => {
    if (p.stock_actual === 0) return 'Sin Stock';
    if (p.stock_actual < 5) return 'Bajo Stock';
    return 'Con Stock';
  };
  const productosFiltrados = useMemo(() => {
    let filtrados = filtroEstado === 'Todos' ? productos : productos.filter(p => getEstadoProducto(p) === filtroEstado);
    if (busqueda.trim() !== '') {
      const b = busqueda.toLowerCase();
      filtrados = filtrados.filter(p => p.nombre?.toLowerCase().includes(b));
    }
    return filtrados;
  }, [productos, filtroEstado, busqueda]);
  const { paginatedItems, totalPages, currentPage, goToPage } = usePagination(productosFiltrados, 4);
  const toggleSeleccion = (id: number) => { setSeleccionados(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; }); };
  const activarModoSeleccion = () => { setModoSeleccion(true); setSeleccionados(new Set()); };
  const cancelarSeleccion = () => { setModoSeleccion(false); setSeleccionados(new Set()); };
  const eliminarSeleccionados = async () => {
    if (seleccionados.size === 0) return;
    if (!window.confirm(`¿Eliminar ${seleccionados.size} producto(s)?`)) return;
    try {
      await Promise.all([...seleccionados].map(id => tiendaUseCases.eliminarProducto(id)));
      setProductos(prev => prev.filter(p => !seleccionados.has(p.id_producto)));
      showToast(`${seleccionados.size} producto(s) eliminado(s).`, 'success');
      cancelarSeleccion();
    } catch { showToast('Error al eliminar.', 'error'); }
  };

  const actions = [
    { icon: <HistoryIcon sx={{ color: '#FFFFFF' }} />, name: 'Historial', action: () => { playGlupSound(); navigate('/historial-ventas'); } },
    { icon: <ShoppingCartIcon sx={{ color: '#FFFFFF' }} />, name: 'Ventas', action: () => { playGlupSound(); navigate('/ventas'); } },
    { icon: <AddIcon sx={{ color: '#FFFFFF' }} />, name: 'Añadir', action: () => { playGlupSound(); navigate('/agregar-producto'); } },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, mx: -1 }}>
        <FiltroSelector value={filtroEstado} productos={productos} onChange={setFiltroEstado} />
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 0.75, px: 1.25, height: 36, borderRadius: 9999, bgcolor: '#FEF9F0', border: '1.5px solid', borderColor: busqueda ? COLORS.primary : 'rgba(212,163,115,0.38)', mr: 1 }}>
          <SearchIcon sx={{ fontSize: 16, color: busqueda ? COLORS.primary : COLORS.inkTertiary }} />
          <InputBase placeholder="Buscar..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} sx={{ flex: 1, fontSize: 13, color: COLORS.ink }} />
          {busqueda && (
            <IconButton size="small" onClick={() => setBusqueda('')} sx={{ p: 0.25, color: COLORS.inkTertiary }}><span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span></IconButton>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mr: 1 }}>
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
      {loading ? <SkeletonCard /> : productosFiltrados.length === 0 ? <EmptyState icon="📦" title="Sin productos" /> : (
        <Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {paginatedItems.map(p => {
              const seleccionado = seleccionados.has(p.id_producto);
              const est = getEstadoProducto(p);
              const s = STATUS_STYLE[est];
              return (
                <Paper key={p.id_producto} elevation={0} sx={{ p: 0, outline: seleccionado ? `2px solid ${COLORS.primary}` : 'none', opacity: est === 'Sin Stock' ? 0.7 : 1 }}>
                  <Box onClick={() => modoSeleccion ? toggleSeleccion(p.id_producto) : navigate(`/editar-producto/${p.id_producto}`) } sx={{ px: 1.5, py: 1.25, display: 'flex', alignItems: 'center', gap: 1.25, cursor: 'pointer' }}>
                    {modoSeleccion && <Checkbox checked={seleccionado} size="small" onClick={e => { e.stopPropagation(); toggleSeleccion(p.id_producto); }} />}
                    <Box sx={{ width: 3, alignSelf: 'stretch', borderRadius: 9999, background: s.color, flexShrink: 0, minHeight: 32 }} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: 14.5, color: COLORS.ink, textTransform: 'capitalize' }} noWrap>{p.nombre}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ fontSize: 13, color: COLORS.inkTertiary }}>Precio: ${p.precio_venta.toFixed(2)}</Typography>
                        <Box component="span" sx={{ fontSize: 13, color: p.stock_actual < 5 ? COLORS.error : COLORS.ink, fontWeight: 600 }}>
                          {est === 'Sin Stock' ? '[Agotado]' : `Stock: ${p.stock_actual} pzas.`}
                        </Box>
                      </Box>
                    </Box>
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
      <SpeedDial
        ariaLabel="Acciones tienda"
        sx={{ position: 'fixed', bottom: 24, right: 24, '& .MuiFab-root': { background: COLORS.primary } }}
        icon={<SpeedDialIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.action}
          />
        ))}
      </SpeedDial>
    </Box>
  );
};
