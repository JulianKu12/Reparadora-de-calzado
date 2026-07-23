import React, { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
}

const icons: Record<ToastType, string> = {
  success: 'check_circle',
  error:   'cancel',
  warning: 'warning',
  info:    'info',
};

const colors: Record<ToastType, { bg: string; border: string; text: string; iconColor: string }> = {
  success: { bg: '#F0FDF4', border: 'rgba(34,197,94,0.3)',   text: '#14532d', iconColor: '#16a34a' },
  error:   { bg: '#FFF1F2', border: 'rgba(239,68,68,0.3)',   text: '#7f1d1d', iconColor: '#dc2626' },
  warning: { bg: '#FFFBEB', border: 'rgba(245,158,11,0.3)',  text: '#78350f', iconColor: '#d97706' },
  info:    { bg: '#EFF6FF', border: 'rgba(59,130,246,0.3)',  text: '#1e3a5f', iconColor: '#2563eb' },
};

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  onClose,
  duration = 2000,
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const c = colors[type];

  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        position: 'fixed',
        bottom: 28,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: c.bg,
        border: `1.5px solid ${c.border}`,
        color: c.text,
        borderRadius: 14,
        padding: '13px 18px 13px 14px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.07)',
        fontFamily: "'Inter', 'Quicksand', system-ui, sans-serif",
        fontWeight: 600,
        fontSize: 14,
        minWidth: 240,
        maxWidth: '90vw',
        animation: 'toastIn 0.3s cubic-bezier(0.22, 0.68, 0, 1.2)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Ícono Material */}
      <span
        className="material-symbols-outlined fill"
        style={{ fontSize: 22, color: c.iconColor, flexShrink: 0, lineHeight: 1 }}
      >
        {icons[type]}
      </span>

      {/* Mensaje */}
      <span style={{ flex: 1, whiteSpace: 'normal', lineHeight: 1.4 }}>
        {message}
      </span>

      {/* Botón cerrar */}
      <button
        onClick={onClose}
        aria-label="Cerrar notificación"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: c.text,
          opacity: 0.6,
          fontSize: 20,
          lineHeight: 1,
          padding: 0,
          marginLeft: 6,
          minWidth: 24,
          minHeight: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 6,
          transition: 'opacity 0.15s ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '0.6')}
      >
        ×
      </button>
    </div>
  );
};
