import { keyframes } from '@mui/system';

export const ripple = keyframes`
  0% { transform: scale(1); background-color: transparent; }
  50% { transform: scale(0.98); background-color: rgba(140,38,31,0.1); }
  100% { transform: scale(1); background-color: transparent; }
`;

export const vibrate = keyframes`
  0% { transform: translateX(0) scale(1); }
  20% { transform: translateX(-5px) scale(1.1); }
  40% { transform: translateX(5px) scale(1.1); }
  60% { transform: translateX(-5px) scale(1.1); }
  80% { transform: translateX(5px) scale(1.1); }
  100% { transform: translateX(0) scale(1); }
`;
