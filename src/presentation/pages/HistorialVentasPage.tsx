import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Button, IconButton, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { Header } from '../components/Header';
import { TiendaRepository } from '../../infrastructure/repositories/TiendaRepository';
import { TiendaUseCases } from '../../useCases/tienda/TiendaUseCases';
import { COLORS } from '../context/theme';
import type { Venta, DetalleVenta } from '../../domain/entities/tienda';
import PrintIcon from '@mui/icons-material/Print';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

dayjs.locale('es');

const tiendaRepository = new TiendaRepository();
const tiendaUseCases = new TiendaUseCases(tiendaRepository);

export const HistorialVentasPage: React.FC = () => {
  const [historial, setHistorial] = useState<{venta: Venta, detalles: DetalleVenta[]}[]>([]);
  const [loading, setLoading] = useState(true);
  const [notificacionesCount, setNotificacionesCount] = useState(0);
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());

  const fetchHistorial = async (start: dayjs.Dayjs, end: dayjs.Dayjs) => {
    setLoading(true);
    // Convertir a formato esperado por el backend (YYYY-MM-DD)
    const data = await tiendaUseCases.getHistorialVentasByDateRange(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
    setHistorial(data);
    setLoading(false);
  };

  useEffect(() => {
    tiendaRepository.getProductos().then(productos => {
      const lowStock = productos.filter(p => p.stock_actual < 5).length;
      setNotificacionesCount(lowStock);
    });

    fetchHistorial(startDate, endDate);
  }, []);

  const handleFilter = () => {
    fetchHistorial(startDate, endDate);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <Box className="fade-in">
        <style media="print">
          {`
            @media print {
              .no-print { display: none !important; }
              .card { border: 1px solid #ccc !important; box-shadow: none !important; }
              body { padding: 20px; }
            }
          `}
        </style>
        <Box className="no-print">
          <Header 
            title="Historial de Ventas" 
            backHref="/?module=tienda" 

            notificacionesHref="/notificaciones" 
            notificacionesCount={notificacionesCount}
          />
        </Box>
        <Box sx={{ maxWidth: 768, mx: 'auto', p: 2, pb: 10 }}>
          <Box className="no-print" sx={{ display: 'flex', gap: 1, mb: 3, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: COLORS.inkTertiary, ml: 1 }}>Desde</Typography>
              <DatePicker 
                value={startDate} 
                onChange={(newValue) => {
                  if (newValue) {
                    setStartDate(newValue);
                    if (newValue.isAfter(endDate)) {
                      setEndDate(newValue);
                    }
                  }
                }}
                format="DD/MM/YY"
                slotProps={{
                  textField: {
                    size: 'small',
                    inputProps: { 'aria-label': 'Desde' },
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 9999,
                        height: 36,
                        bgcolor: '#FEF9F0',
                        '& fieldset': { borderColor: 'rgba(212,163,115,0.38)' },
                        '&:hover fieldset': { borderColor: COLORS.primary },
                        '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 2 },
                      },
                    }
                  }
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: COLORS.inkTertiary, ml: 1 }}>Hasta</Typography>
              <DatePicker 
                value={endDate} 
                onChange={(newValue) => {
                  if (newValue) {
                    if (newValue.isBefore(startDate)) {
                      setStartDate(newValue);
                    }
                    setEndDate(newValue);
                  }
                }}
                format="DD/MM/YY"
                slotProps={{
                  textField: {
                    size: 'small',
                    inputProps: { 'aria-label': 'Hasta' },
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 9999,
                        height: 36,
                        bgcolor: '#FEF9F0',
                        '& fieldset': { borderColor: 'rgba(212,163,115,0.38)' },
                        '&:hover fieldset': { borderColor: COLORS.primary },
                        '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 2 },
                      },
                    }
                  }
                }}
              />
            </Box>
            <Button variant="contained" onClick={handleFilter} sx={{ mt: 2.5 }}>Filtrar</Button>
            <IconButton onClick={handlePrint} color="primary" title="Imprimir / Guardar PDF" sx={{ mt: 2 }}>
              <PrintIcon />
            </IconButton>
          </Box>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>
          ) : historial.length === 0 ? (
            <Typography sx={{ textAlign: 'center', mt: 5, color: COLORS.inkSecondary }}>No hay ventas registradas en este rango.</Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {historial.map(({ venta, detalles }) => {
                const fecha = dayjs(venta.fecha_venta);
                return (
                  <Accordion key={venta.id_venta} elevation={0} sx={{ border: `1px solid ${COLORS.border}`, borderRadius: '12px !important', '&:before': { display: 'none' } }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 2 }}>
                        <Typography sx={{ fontWeight: 'bold', color: COLORS.primary }}>Venta #{venta.id_venta}</Typography>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="body2">{fecha.format('DD/MM/YY')} · {fecha.format('HH:mm')}</Typography>
                          <Typography sx={{ fontWeight: 'bold' }}>${venta.total.toFixed(2)}</Typography>
                        </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box sx={{ pt: 1, borderTop: `1px solid ${COLORS.border}` }}>
                        {detalles.map(d => (
                          <Box key={d.id_detalle} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, fontSize: '14px' }}>
                            <Typography>{d.nombre_producto || `Producto #${d.id_producto}`} x {d.cantidad}</Typography>
                            <Typography>${d.subtotal.toFixed(2)}</Typography>
                          </Box>
                        ))}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', borderTop: `1px solid ${COLORS.border}`, pt: 1, mt: 1 }}>
                          <Typography sx={{ fontWeight: 'bold', color: COLORS.ink }}>Total: ${venta.total.toFixed(2)}</Typography>
                        </Box>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </Box>
          )}
        </Box>
      </Box>
    </LocalizationProvider>
  );
};
