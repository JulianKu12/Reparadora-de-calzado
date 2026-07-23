import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Badge } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Link, useSearchParams } from 'react-router-dom';
import { useSplash } from '../context/SplashContext';
import { TiendaRepository } from '../../infrastructure/repositories/TiendaRepository';
import { COLORS } from '../context/theme';
import { TalabarteriaView } from '../components/TalabarteriaView';
import { TiendaView } from '../components/TiendaView';

const tiendaRepository = new TiendaRepository();

export const MenuPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeModule = (searchParams.get('module') as 'talabarteria' | 'tienda') || 'talabarteria';
  
  const setActiveModule = (module: 'talabarteria' | 'tienda') => {
    setSearchParams({ module });
  };

  const [notificacionesCount, setNotificacionesCount] = useState(0);
  const { hideSplash } = useSplash();

  useEffect(() => {
    tiendaRepository.getProductos().then(ps => setNotificacionesCount(ps.filter(p => p.stock_actual < 5).length));
    hideSplash();
  }, []);

  const barBgColor = activeModule === 'talabarteria' ? COLORS.talabarteriaBrown : COLORS.tiendaRed;
  const textColor = '#FFFFFF';

  return (
    <Box sx={{ pb: 12 }}>
      {/* Barra de navegación superior fija */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          bgcolor: barBgColor,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          width: '100%',
          py: 1.5,
          transition: 'background-color 0.3s ease',
        }}
      >
        <Box 
          className="fade-in-stagger" 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: 3, 
            px: 2,
            maxWidth: 768,
            mx: 'auto'
          }}
        >
          <Typography 
            onClick={() => setActiveModule('talabarteria')}
            sx={{ 
              fontSize: 18, fontWeight: 600, color: activeModule === 'talabarteria' ? textColor : 'rgba(255,255,255,0.7)', 
              cursor: 'pointer', transition: 'color 0.2s' 
            }}
          >
            Talabartería
          </Typography>
          <Typography sx={{ mx: 1, color: 'rgba(255,255,255,0.7)', fontWeight: 300 }}>|</Typography>
          <Typography 
            onClick={() => setActiveModule('tienda')}
            sx={{ 
              fontSize: 18, fontWeight: 600, color: activeModule === 'tienda' ? textColor : 'rgba(255,255,255,0.7)', 
              cursor: 'pointer', transition: 'color 0.2s' 
            }}
          >
            Tienda
          </Typography>
          <IconButton component={Link} to="/notificaciones" size="small" title="Notificaciones" sx={{ color: textColor, width: 36, height: 36, borderRadius: '10px', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>
            <Badge badgeContent={notificacionesCount} sx={{ '& .MuiBadge-badge': { background: '#FFC107', color: '#000', fontSize: 10, fontWeight: 700, minWidth: 18, height: 18, border: '2px solid white' } }}>
              <NotificationsIcon sx={{ fontSize: 21 }} />
            </Badge>
          </IconButton>
        </Box>
      </Box>

      {/* Contenido principal */}
      <Box className="fade-in" sx={{ maxWidth: 768, mx: 'auto', width: '100%', pt: 3, px: 2 }}>
        {activeModule === 'talabarteria' ? <TalabarteriaView /> : <TiendaView />}
      </Box>
    </Box>
  );
};
