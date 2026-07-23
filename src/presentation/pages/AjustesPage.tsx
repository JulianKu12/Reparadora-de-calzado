import React, { useState, useEffect } from 'react';
import { Box, Typography, Switch, FormControlLabel, Paper, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { TiendaRepository } from '../../infrastructure/repositories/TiendaRepository';
import { COLORS } from '../context/theme';
// @ts-ignore
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

const tiendaRepository = new TiendaRepository();

export const AjustesPage: React.FC = () => {
  const navigate = useNavigate();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificacionesCount, setNotificacionesCount] = useState(0);

  useEffect(() => {
    tiendaRepository.getProductos().then(productos => {
      const lowStock = productos.filter(p => p.stock_actual < 5).length;
      setNotificacionesCount(lowStock);
    });
  }, []);

  useEffect(() => {
    const savedPreference = localStorage.getItem('notifications_enabled');
    if (savedPreference !== null) {
      setNotificationsEnabled(savedPreference === 'true');
    }
  }, []);

  const handleToggleNotifications = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    setNotificationsEnabled(newValue);
    localStorage.setItem('notifications_enabled', String(newValue));
  };

  return (
    <Box className="fade-in">
      <Header
        title="Ajustes"
        onBack={() => navigate(-1)}
        
        notificacionesHref="/notificaciones"
        notificacionesCount={notificacionesCount}
      />

      <Box sx={{ maxWidth: 640, mx: 'auto', p: 2, pb: 10 }}>

        {/* Sección: Notificaciones */}
        <Paper
          elevation={0}
          sx={{
            background: '#fff',
            border: '1px solid rgba(212,163,115,0.22)',
            borderRadius: '20px',
            boxShadow: '0 2px 10px rgba(36,25,23,0.07)',
            overflow: 'hidden',
            mt: 2,
          }}
        >
          {/* Encabezado de sección */}
          <Box sx={{ px: 3, pt: 3, pb: 2 }}>
            <Typography sx={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: COLORS.secondary,
              mb: 0.5,
            }}>
              Preferencias
            </Typography>
            <Typography sx={{
              fontSize: 18,
              fontWeight: 700,
              color: COLORS.ink,
              fontFamily: "'Quicksand', 'Inter', sans-serif",
              letterSpacing: '-0.2px',
            }}>
              Configuración del Sistema
            </Typography>
          </Box>

          <Divider sx={{ borderColor: 'rgba(212,163,115,0.18)' }} />

          {/* Ítem: Notificaciones de Stock */}
          <Box sx={{ px: 3, py: 2.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75 }}>
                {/* Ícono de sección */}
                <Box sx={{
                  width: 42, height: 42,
                  borderRadius: '12px',
                  background: notificationsEnabled
                    ? 'rgba(140,38,31,0.1)'
                    : 'rgba(212,163,115,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'background 0.22s ease',
                }}>
                  <NotificationsActiveIcon
                    sx={{
                      fontSize: 22,
                      color: notificationsEnabled ? COLORS.primary : COLORS.inkTertiary,
                      transition: 'color 0.22s ease',
                    }}
                  />
                </Box>
                <Box>
                  <Typography sx={{
                    fontWeight: 600,
                    fontSize: 15,
                    color: COLORS.ink,
                    lineHeight: 1.3,
                  }}>
                    Notificaciones de Stock
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: COLORS.inkTertiary, mt: 0.25, lineHeight: 1.4 }}>
                    Alertas cuando los productos tengan stock bajo
                  </Typography>
                </Box>
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={notificationsEnabled}
                    onChange={handleToggleNotifications}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: COLORS.primary },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: COLORS.primary,
                      },
                    }}
                  />
                }
                label=""
                sx={{ m: 0 }}
              />
            </Box>
          </Box>
        </Paper>

        {/* Info de versión */}
        <Box sx={{ textAlign: 'center', mt: 5, pb: 2 }}>
          <Typography sx={{ fontSize: 12, color: COLORS.inkDisabled, letterSpacing: '0.02em' }}>
            Reparadora de Calzado · Sistema de Gestión
          </Typography>
          <Typography sx={{ fontSize: 11, color: COLORS.inkDisabled, mt: 0.5 }}>
            v1.0 · Taller Artesanal &amp; Tendejón
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
