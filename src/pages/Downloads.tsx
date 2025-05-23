import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import { styled } from '@mui/material/styles';
import { getDownloads } from '../services/api';
import { Theme } from '@mui/material/styles';

const styledTableContainerStyles = {
  borderRadius: (theme: Theme) => theme.shape.borderRadius,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  '& .MuiTableCell-head': {
    backgroundColor: (theme: Theme) => theme.palette.background.paper,
    fontWeight: 'bold',
  },
  '& .MuiTableRow-root:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  }
};

const FormatChip = styled(Chip)<{ format: string }>(({ theme, format }) => {
  const colorMap: Record<string, string> = {
    mp4: theme.palette.primary.main,
    mp3: theme.palette.secondary.main,
    webm: '#4caf50',
    ogg: '#ff9800',
    flac: '#9c27b0'
  };
  
  return {
    backgroundColor: colorMap[format] || theme.palette.primary.main,
    color: '#fff',
    fontWeight: 'bold',
  };
});

interface Download {
  id: number;
  url: string;
  format: string;
  quality: string;
  filePath: string;
  status?: string;
}

const Downloads: React.FC = () => {
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const fetchDownloads = async () => {
    try {
      setLoading(true);
      const data = await getDownloads();
      setDownloads(data);
      setError('');
    } catch (err: any) {
      setError(`Erro ao carregar downloads: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchDownloads();
    
    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchDownloads, 30000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Seus Downloads
        </Typography>
        <Tooltip title="Atualizar lista">
          <IconButton onClick={fetchDownloads} color="primary">
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : downloads.length === 0 ? (
        <Paper 
          elevation={2} 
          sx={{ 
            p: 4, 
            textAlign: 'center',
            borderRadius: 2,
            backgroundColor: 'rgba(0, 0, 0, 0.2)'
          }}
        >
          <Typography variant="h6" color="text.secondary">
            Nenhum download encontrado
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Volte para a página inicial e baixe algum vídeo ou áudio
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={styledTableContainerStyles}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>URL</TableCell>
                <TableCell>Formato</TableCell>
                <TableCell>Qualidade</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {downloads.map((download) => (
                <TableRow key={download.id}>
                  <TableCell>{download.id}</TableCell>
                  <TableCell>
                    <Typography noWrap sx={{ maxWidth: 250 }}>
                      {download.url}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <FormatChip 
                      label={download.format.toUpperCase()} 
                      format={download.format} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>{download.quality || 'N/A'}</TableCell>
                  <TableCell>
                    <Chip 
                      label={download.status || 'Concluído'} 
                      color={download.status === 'Concluído' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Baixar arquivo">
                      <IconButton 
                        color="primary"
                        onClick={() => window.open(`/api/download-file?filePath=${download.filePath}`, '_blank')}
                      >
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Downloads;
