import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box, Badge } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Link } from 'react-router-dom';

interface HeaderProps {
  title: string;
  backHref?: string;
  onBack?: () => void;
  homeHref?: string;
  notificacionesHref?: string;
  notificacionesCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  backHref,
  onBack,
  homeHref,
  notificacionesHref,
  notificacionesCount = 0,
}) => {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        top: 0,
        zIndex: 40,
        bgcolor: 'rgba(254, 249, 240, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(212, 163, 115, 0.22)',
        boxShadow: '0 1px 12px rgba(36, 25, 23, 0.06)',
      }}
    >
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          minHeight: { xs: 60, sm: 64 },
          px: { xs: 1.5, sm: 2 },
        }}
      >
        {/* Izquierda: botón atrás + título */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flex: 1, minWidth: 0 }}>
          {backHref || onBack ? (
            <IconButton
              component={backHref ? Link : 'button'}
              to={backHref!}
              onClick={onBack}
              size="small"
              sx={{
                color: '#8C261F',
                bgcolor: 'rgba(140,38,31,0.07)',
                borderRadius: '10px',
                width: 36,
                height: 36,
                flexShrink: 0,
                transition: 'all 0.18s ease',
                '&:hover': {
                  bgcolor: 'rgba(140,38,31,0.14)',
                  transform: 'translateX(-1px)',
                },
              }}
            >
              <ArrowBackIcon sx={{ fontSize: 20 }} />
            </IconButton>
          ) : null}

          {title && (
            <Typography
              variant="h6"
              component="h1"
              sx={{
                fontWeight: 700,
                fontSize: { xs: 17, sm: 19 },
                color: '#1A1210',
                letterSpacing: '-0.2px',
                fontFamily: "'Quicksand', 'Inter', sans-serif",
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {title}
            </Typography>
          )}
        </Box>

        {/* Derecha: acciones */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {homeHref && (
            <IconButton
              component={Link}
              to={homeHref}
              size="small"
              title="Inicio"
              sx={{
                color: '#57423f',
                width: 36, height: 36,
                borderRadius: '10px',
                transition: 'all 0.18s ease',
                '&:hover': { bgcolor: 'rgba(140,38,31,0.08)', color: '#8C261F' },
              }}
            >
              <HomeIcon sx={{ fontSize: 21 }} />
            </IconButton>
          )}
          {notificacionesHref && (
            <IconButton
              component={Link}
              to={notificacionesHref}
              size="small"
              title="Notificaciones"
              sx={{
                color: '#57423f',
                width: 36, height: 36,
                borderRadius: '10px',
                transition: 'all 0.18s ease',
                '&:hover': { bgcolor: 'rgba(140,38,31,0.08)', color: '#8C261F' },
              }}
            >
              <Badge
                badgeContent={notificacionesCount}
                sx={{
                  '& .MuiBadge-badge': {
                    background: '#FFC107',
                    color: '#000',
                    fontSize: 10,
                    fontWeight: 700,
                    minWidth: 18,
                    height: 18,
                  },
                }}
              >
                <NotificationsIcon sx={{ fontSize: 21 }} />
              </Badge>
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
