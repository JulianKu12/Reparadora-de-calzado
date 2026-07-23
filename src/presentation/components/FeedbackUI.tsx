import React from 'react';

interface SkeletonCardProps {
  lines?: number;
}

// ── Keyframes de animación ─────────────────────────────────────────────────
const LOADER_STYLE_ID = 'sk-loader-kf';
if (typeof document !== 'undefined' && !document.getElementById(LOADER_STYLE_ID)) {
  const s = document.createElement('style');
  s.id = LOADER_STYLE_ID;
  s.textContent = `
    @keyframes sk-fade-in {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0);   }
    }
    @keyframes sk-pulse-ring {
      0%   { transform: scale(0.90); box-shadow: 0 0 0 0   rgba(140,38,31,0.35); }
      60%  { transform: scale(1.02); box-shadow: 0 0 0 18px rgba(140,38,31,0); }
      100% { transform: scale(0.90); box-shadow: 0 0 0 0   rgba(140,38,31,0); }
    }
    @keyframes sk-dot-blink {
      0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
      40%            { opacity: 1;   transform: scale(1); }
    }
  `;
  document.head.appendChild(s);
}

/** Vista de carga: ícono pulsante centrado con puntos de espera */
export const SkeletonCard: React.FC<SkeletonCardProps> = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 18,
      padding: '72px 24px',
      animation: 'sk-fade-in 0.3s ease both',
    }}
  >
    {/* Ícono con animación de pulso */}
    <div
      style={{
        width: 64, height: 64,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #8C261F 0%, #C0522A 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'sk-pulse-ring 1.8s cubic-bezier(0.4,0,0.6,1) infinite',
        boxShadow: '0 4px 20px rgba(140,38,31,0.25)',
      }}
    >
      <span
        className="material-symbols-outlined fill"
        style={{ fontSize: 30, color: '#fff', userSelect: 'none' }}
      >
        handyman
      </span>
    </div>

    {/* Texto de carga */}
    <p
      style={{
        margin: 0,
        fontFamily: "'Inter', 'Quicksand', system-ui, sans-serif",
        fontSize: 14,
        fontWeight: 600,
        color: '#8a7370',
        letterSpacing: '0.03em',
        animation: 'sk-fade-in 0.4s ease 0.12s both',
      }}
    >
      Cargando…
    </p>

    {/* Puntos animados */}
    <div style={{ display: 'flex', gap: 6, animation: 'sk-fade-in 0.4s ease 0.22s both' }}>
      {[0, 1, 2].map(i => (
        <div
          key={i}
          style={{
            width: 7, height: 7,
            borderRadius: '50%',
            background: '#D4A373',
            animation: `sk-dot-blink 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
  </div>
);

/** Empty state amigable cuando no hay datos */
interface EmptyStateProps {
  icon?: string;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '📭',
  title,
  subtitle,
  actionLabel,
  onAction,
}) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '56px 24px',
      textAlign: 'center',
      gap: 10,
      animation: 'sk-fade-in .28s ease both',
    }}
  >
    {/* Ícono con fondo suave */}
    <div
      style={{
        width: 80, height: 80,
        borderRadius: '50%',
        background: 'rgba(212,163,115,0.12)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 4,
        border: '1px solid rgba(212,163,115,0.2)',
      }}
    >
      <span style={{ fontSize: 40, lineHeight: 1 }}>{icon}</span>
    </div>

    <p
      style={{
        fontFamily: "'Quicksand', 'Inter', sans-serif",
        fontWeight: 700,
        fontSize: 19,
        color: '#1A1210',
        margin: 0,
        letterSpacing: '-0.2px',
      }}
    >
      {title}
    </p>

    {subtitle && (
      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 14,
          color: '#8a7370',
          margin: 0,
          maxWidth: 300,
          lineHeight: 1.55,
        }}
      >
        {subtitle}
      </p>
    )}

    {actionLabel && onAction && (
      <button
        onClick={onAction}
        className="btn-primary"
        style={{ marginTop: 12 }}
      >
        {actionLabel}
      </button>
    )}
  </div>
);
