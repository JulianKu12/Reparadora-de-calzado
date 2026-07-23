/**
 * theme.ts — MUI Theme unificado con la paleta de Reparadora de Calzado
 * Todos los colores provienen de este único lugar.
 */
import { createTheme } from '@mui/material/styles';

// ── Tokens de color (fuente de verdad) ────────────────────────────────────
export const COLORS = {
  primary:       '#8C261F',
  primaryLight:  '#b03a2e',
  primaryDark:   '#6a1c17',
  primarySubtle: '#FFF0EE',
  primaryAlpha:  'rgba(140,38,31,0.12)',

  secondary:       '#C4973B',
  secondaryLight:  '#D4A373',
  secondarySubtle: '#FEF9F0',

  bg:        '#F0F4F8',
  surface:   '#FFFFFF',

  ink:         '#1A1210',
  inkSecondary:'#57423f',
  inkTertiary: '#8a7370',
  inkDisabled: '#bba9a7',

  talabarteriaBrown: '#7d562d',
  tiendaRed:         '#8C261F',
  tiendaVibrant:     '#FF4081',

  border:       'rgba(212,163,115,0.28)',
  borderStrong: 'rgba(212,163,115,0.55)',

  // Estados semánticos — todos en tono cálido/neutro
  success:   '#1e6e3c',
  successBg: '#EAF5EE',
  warning:   '#8B5E00',
  warningBg: '#FFF8EE',
  error:     '#ba1a1a',
  errorBg:   '#FFF0EE',

  // Colores de estado del ticket — paleta cálida unificada
  // En vez de azul/verde/morado, usamos variaciones del mismo sistema
  status: {
    recibido:   { color: '#7d562d', bg: '#FEF9F0', border: 'rgba(125,86,45,0.2)' },
    enProceso:  { color: '#8C261F', bg: '#FFF0EE', border: 'rgba(140,38,31,0.2)' },
    terminado:  { color: '#1e6e3c', bg: '#EAF5EE', border: 'rgba(30,110,60,0.2)' },
    entregado:  { color: '#57423f', bg: '#F5F0EE', border: 'rgba(87,66,63,0.2)' },
    abandonado: { color: '#8a7370', bg: '#F5F2F0', border: 'rgba(138,115,112,0.2)' },
  },
} as const;

// ── MUI Theme ──────────────────────────────────────────────────────────────
export const theme = createTheme({
  palette: {
    primary: {
      main:  COLORS.primary,
      light: COLORS.primaryLight,
      dark:  COLORS.primaryDark,
      contrastText: '#fff',
    },
    secondary: {
      main:  COLORS.secondary,
      light: COLORS.secondaryLight,
      dark:  '#9c7020',
      contrastText: '#1A1210',
    },
    error: {
      main: COLORS.error,
    },
    success: {
      main: COLORS.success,
    },
    warning: {
      main: COLORS.warning,
    },
    background: {
      default: COLORS.bg,
      paper:   COLORS.surface,
    },
    text: {
      primary:   COLORS.ink,
      secondary: COLORS.inkSecondary,
      disabled:  COLORS.inkDisabled,
    },
  },

  typography: {
    fontFamily: "'Inter', 'Quicksand', system-ui, sans-serif",
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: { fontFamily: "'Quicksand', 'Inter', sans-serif", fontWeight: 800 },
    h2: { fontFamily: "'Quicksand', 'Inter', sans-serif", fontWeight: 700 },
    h3: { fontFamily: "'Quicksand', 'Inter', sans-serif", fontWeight: 700 },
    h4: { fontFamily: "'Quicksand', 'Inter', sans-serif", fontWeight: 700 },
    h5: { fontFamily: "'Quicksand', 'Inter', sans-serif", fontWeight: 700 },
    h6: { fontFamily: "'Quicksand', 'Inter', sans-serif", fontWeight: 700 },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.01em',
    },
  },

  shape: {
    borderRadius: 12,
  },

  components: {
    // ── AppBar ──────────────────────────────────────────────────────
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(254,249,240,0.88)',
          color: COLORS.ink,
          boxShadow: 'none',
        },
      },
    },

    // ── Paper / Card ────────────────────────────────────────────────
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 16,
        },
        elevation0: {
          border: `1px solid ${COLORS.border}`,
          boxShadow: '0 2px 10px rgba(36,25,23,0.07)',
        },
      },
    },

    // ── Button ──────────────────────────────────────────────────────
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 9999,
          minHeight: 44,
          fontWeight: 600,
          fontFamily: "'Inter', 'Quicksand', sans-serif",
          textTransform: 'none',
          letterSpacing: '0.01em',
          transition: 'all 0.2s ease',
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
          boxShadow: '0 4px 18px rgba(140,38,31,0.28)',
          '&:hover': {
            boxShadow: '0 6px 22px rgba(140,38,31,0.36)',
            filter: 'brightness(1.08)',
          },
          '&:disabled': {
            background: '#D4C4C1',
            color: '#fff',
            boxShadow: 'none',
          },
        },
        outlinedPrimary: {
          borderColor: COLORS.borderStrong,
          color: COLORS.inkSecondary,
          '&:hover': {
            borderColor: COLORS.primary,
            backgroundColor: COLORS.primarySubtle,
            color: COLORS.primary,
          },
        },
      },
    },

    // ── IconButton ──────────────────────────────────────────────────
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          transition: 'all 0.18s ease',
        },
      },
    },

    // ── TextField / Input ────────────────────────────────────────────
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontFamily: "'Inter', sans-serif",
          fontSize: 15,
          backgroundColor: COLORS.surface,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: COLORS.border,
            transition: 'border-color 0.2s ease, border-width 0.2s ease',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: COLORS.borderStrong,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: COLORS.primary,
            borderWidth: 2,
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontFamily: "'Inter', sans-serif",
          fontSize: 14,
          color: COLORS.inkTertiary,
          padding: '0 2px',
          '&.Mui-focused': {
            color: COLORS.primary,
          },
          // Asegurar que el fondo del label cubra la línea si el notch falla
          // y darle un poco más de aire
          '&.MuiInputLabel-shrink': {
            backgroundColor: COLORS.surface,
            padding: '0 6px',
            marginLeft: '-2px',
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: 12,
          fontWeight: 500,
          marginTop: 4,
          marginLeft: 4,
        },
      },
    },

    // ── Checkbox ─────────────────────────────────────────────────────
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: COLORS.borderStrong,
          '&.Mui-checked': { color: COLORS.primary },
          '&:hover': { backgroundColor: COLORS.primaryAlpha },
        },
      },
    },

    // ── Switch ───────────────────────────────────────────────────────
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          '&.Mui-checked': {
            color: COLORS.primary,
            '& + .MuiSwitch-track': {
              backgroundColor: COLORS.primary,
            },
          },
        },
      },
    },

    // ── CircularProgress ────────────────────────────────────────────
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: COLORS.primary,
        },
      },
    },

    // ── Chip ──────────────────────────────────────────────────────────
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: "'Inter', sans-serif",
          fontWeight: 600,
          fontSize: 12,
          borderRadius: 999,
        },
      },
    },

    // ── Divider ──────────────────────────────────────────────────────
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: COLORS.border,
        },
      },
    },

    // ── Tooltip ──────────────────────────────────────────────────────
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontFamily: "'Inter', sans-serif",
          fontSize: 12,
          fontWeight: 500,
          backgroundColor: COLORS.ink,
          borderRadius: 8,
          padding: '6px 12px',
        },
        arrow: {
          color: COLORS.ink,
        },
      },
    },

    // ── Badge ────────────────────────────────────────────────────────
    MuiBadge: {
      styleOverrides: {
        badge: {
          fontFamily: "'Inter', sans-serif",
          fontSize: 10,
          fontWeight: 700,
          minWidth: 18,
          height: 18,
        },
      },
    },
  },
});
