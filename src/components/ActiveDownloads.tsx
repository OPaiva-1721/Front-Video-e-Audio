import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper,
  List,
  ListItem,
  Divider,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DownloadProgress from './DownloadProgress';

const ActiveDownloadsContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 'rgba(0, 0, 0, 0.2)',
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

interface Download {
  id: number;
  url: string;
  format: string;
  quality?: string;
  status: string;
  progress: number;
  fileName: string;
}

// Este componente seria conectado ao WebSocket no backend
const ActiveDownloads: React.FC = () => {
  const [activeDownloads, setActiveDownloads] = useState<Download[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Simulação de conexão WebSocket para demonstração
  useEffect(() => {
    // Em uma implementação real, aqui seria estabelecida a conexão WebSocket
    setLoading(true);
    
    // Simulando dados para demonstração
    const mockData: Download[] = [
      {
        id: 1,
        url: 'https://www.youtube.com/watch?v=example1',
        format: 'mp4',
        quality: '1080p',
        status: 'Processando',
        progress: 45,
        fileName: 'Video de exemplo 1'
      },
      {
        id: 2,
        url: 'https://www.youtube.com/watch?v=example2',
        format: 'mp3',
        status: 'Concluído',
        progress: 100,
        fileName: 'Música de exemplo'
      }
    ];
    
    setTimeout(() => {
      setActiveDownloads(mockData);
      setLoading(false);
    }, 1000);
    
    // Simulação de atualização de progresso
    const interval = setInterval(() => {
      setActiveDownloads(prev => 
        prev.map(download => {
          if (download.status === 'Processando' && download.progress < 100) {
            const newProgress = download.progress + 5;
            return {
              ...download,
              progress: newProgress,
              status: newProgress >= 100 ? 'Concluído' : 'Processando'
            };
          }
          return download;
        })
      );
    }, 2000);
    
    return () => {
      clearInterval(interval);
      // Em uma implementação real, aqui seria fechada a conexão WebSocket
    };
  }, []);
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Typography color="error" sx={{ my: 2 }}>
        Erro ao carregar downloads ativos: {error}
      </Typography>
    );
  }
  
  if (activeDownloads.length === 0) {
    return null;
  }
  
  return (
    <ActiveDownloadsContainer>
      <Typography variant="h6" gutterBottom>
        Downloads Ativos
      </Typography>
      
      <List>
        {activeDownloads.map((download, index) => (
          <React.Fragment key={download.id}>
            <ListItem disablePadding sx={{ display: 'block' }}>
              <DownloadProgress 
                downloadId={download.id}
                status={download.status}
                progress={download.progress}
                fileName={download.fileName}
                format={download.format}
              />
            </ListItem>
            {index < activeDownloads.length - 1 && <Divider sx={{ my: 1 }} />}
          </React.Fragment>
        ))}
      </List>
    </ActiveDownloadsContainer>
  );
};
