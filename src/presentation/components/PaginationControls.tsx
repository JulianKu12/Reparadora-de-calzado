import React from 'react';
import { Box, IconButton } from '@mui/material';
import { COLORS } from '../context/theme';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // Eliminamos la condición que ocultaba el paginado si <= 1 página
  // if (totalPages <= 1) return null; 

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mt: 3, mb: 2 }}>
      {Array.from({ length: Math.max(totalPages, 1) }).map((_, index) => {
        const page = index + 1;
        const isActive = page === currentPage;
        
        return (
          <IconButton
            key={page}
            onClick={() => onPageChange(page)}
            sx={{
              width: 32, height: 32,
              borderRadius: '50%',
              bgcolor: isActive ? COLORS.primary : 'transparent',
              color: isActive ? '#fff' : COLORS.inkSecondary,
              border: isActive ? 'none' : `1px solid ${COLORS.border}`,
              fontSize: 13,
              fontWeight: 700,
              '&:hover': {
                bgcolor: isActive ? COLORS.primary : COLORS.primarySubtle,
              },
            }}
          >
            {page}
          </IconButton>
        );
      })}
    </Box>
  );
};
