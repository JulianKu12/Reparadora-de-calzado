import React from 'react';
import { Box, Typography, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';

interface CardProps {
  to: string;
  icon: string; // Material Icon name
  iconBgColor: string;
  iconColor: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaColor: string;
}

export const Card: React.FC<CardProps> = ({
  to,
  icon,
  iconBgColor,
  iconColor,
  title,
  subtitle,
  ctaText,
  ctaColor,
}) => {
  return (
    <MuiLink
      component={Link}
      to={to}
      sx={{
        textDecoration: 'none',
        color: 'inherit',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        p: 3.5,
        borderRadius: '20px',
        background: '#fff',
        border: '1px solid rgba(212,163,115,0.22)',
        boxShadow: '0 2px 10px rgba(36,25,23,0.07), 0 1px 4px rgba(36,25,23,0.04)',
        transition: 'all 0.22s cubic-bezier(0.4,0,0.2,1)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${iconBgColor}80, ${iconBgColor})`,
          opacity: 0,
          transition: 'opacity 0.22s ease',
        },
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 32px rgba(36,25,23,0.13), 0 4px 12px rgba(36,25,23,0.07)',
          borderColor: 'rgba(212,163,115,0.5)',
          '&::before': { opacity: 1 },
        },
        '&:active': {
          transform: 'translateY(-1px) scale(0.98)',
        },
      }}
    >
      {/* Ícono circular con gradiente */}
      <Box
        sx={{
          width: 76,
          height: 76,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${iconBgColor}dd 0%, ${iconBgColor} 100%)`,
          color: iconColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2.5,
          boxShadow: `0 4px 16px ${iconBgColor}55`,
          transition: 'all 0.22s ease',
          flexShrink: 0,
        }}
      >
        <span className="material-symbols-outlined fill" style={{ fontSize: 36 }}>
          {icon}
        </span>
      </Box>

      {/* Título */}
      <Typography
        variant="h5"
        component="h3"
        sx={{
          fontWeight: 700,
          fontSize: 18,
          color: '#1A1210',
          mb: 0.5,
          letterSpacing: '-0.15px',
          fontFamily: "'Quicksand', 'Inter', sans-serif",
        }}
      >
        {title}
      </Typography>

      {/* Subtítulo */}
      <Typography
        variant="body2"
        sx={{
          fontSize: 11,
          textTransform: 'uppercase',
          letterSpacing: '0.07em',
          color: '#8a7370',
          fontWeight: 600,
          mb: 2,
        }}
      >
        {subtitle}
      </Typography>

      {/* CTA */}
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.5,
          px: 2,
          py: 0.75,
          borderRadius: '999px',
          background: `${ctaColor}12`,
          border: `1px solid ${ctaColor}25`,
          color: ctaColor,
          fontWeight: 700,
          fontSize: 13,
          transition: 'all 0.18s ease',
          letterSpacing: '0.01em',
        }}
      >
        {ctaText}
        <span className="material-symbols-outlined" style={{ fontSize: 15 }}>arrow_forward</span>
      </Box>
    </MuiLink>
  );
};
