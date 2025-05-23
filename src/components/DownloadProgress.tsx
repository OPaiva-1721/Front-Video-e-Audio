import React from 'react';
import { 
  Box, 
  Typography, 
  LinearProgress, 
  Paper,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';

const ProgressContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 'rgba(0, 0, 0, 0.2)',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1)
}));

const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  '& .MuiLinearProgress-bar': {
    borderRadius: 5,
    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  }
}));

interface DownloadProgressProps {
  downloadId: number;
  status: string;
  progress: number;
  fileName: string;
  format: string;
}

const DownloadProgress: React.FC<DownloadProgressProps> = ({ 
  downloadId, 
  status, 
  progress, 
  fileName,
  format
}) => {
  return (
    <ProgressContainer>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle1" fontWeight="medium">
          {fileName || `Download #${downloadId}`}
        </Typography>
        <Chip 
          label={status} 
          color={
            status === 'Concluído' ? 'success' : 
            status === 'Erro' ? 'error' : 
            status === 'Processando' ? 'warning' : 
            'default'
          }
          size="small"
        />
      </Box>
      
      <StyledLinearProgress variant="determinate" value={progress} />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {format.toUpperCase()}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {progress}%
        </Typography>
      </Box>
    </ProgressContainer>
  );
};

export default DownloadProgress;
