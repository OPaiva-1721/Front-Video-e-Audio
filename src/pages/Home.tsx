import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  SelectChangeEvent,
  Alert,
  CircularProgress,
  Paper,
  Grid
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { styled } from '@mui/material/styles';
import { downloadVideo } from '../services/api';

const StyledForm = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  maxWidth: '600px',
  margin: '0 auto',
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
  }
}));

export const Home: React.FC = () => {
  const [url, setUrl] = useState('');
  const [format, setFormat] = useState('mp4');
  const [quality, setQuality] = useState('best');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFormatChange = (event: SelectChangeEvent) => {
    setFormat(event.target.value);
  };

  const handleQualityChange = (event: SelectChangeEvent) => {
    setQuality(event.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!url) {
      setError('Por favor, insira uma URL do YouTube');
      return;
    }
    
    if (!url.includes('youtube.com/watch') && !url.includes('youtu.be/')) {
      setError('Por favor, insira uma URL válida do YouTube');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const savePath = `output.${format}`;
      const response = await downloadVideo({ url, format, quality, savePath });
      
      setSuccess(`Download iniciado com sucesso! ID: ${response.id}`);
      setUrl('');
    } catch (err: any) {
      setError(`Erro ao processar o download: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          <YouTubeIcon sx={{ fontSize: 40, verticalAlign: 'middle', mr: 1 }} />
          YouTube Downloader
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
          Baixe vídeos e áudios do YouTube com facilidade
        </Typography>
      </Box>

      <Paper 
        elevation={4} 
        sx={{ 
          p: 4, 
          borderRadius: 3,
          background: 'linear-gradient(145deg, #1a1a1a 0%, #2a2a2a 100%)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
        }}
      >
        <StyledForm onSubmit={handleSubmit}>
          <TextField
            label="URL do YouTube"
            variant="outlined"
            fullWidth
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            InputProps={{
              startAdornment: <YouTubeIcon sx={{ mr: 1, color: 'red' }} />,
            }}
          />
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="format-label">Formato</InputLabel>
                <Select
                  labelId="format-label"
                  value={format}
                  label="Formato"
                  onChange={handleFormatChange}
                >
                  <MenuItem value="mp4">MP4 (Vídeo)</MenuItem>
                  <MenuItem value="mp3">MP3 (Áudio)</MenuItem>
                  <MenuItem value="webm">WebM (Vídeo)</MenuItem>
                  <MenuItem value="ogg">OGG (Áudio)</MenuItem>
                  <MenuItem value="flac">FLAC (Áudio)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={format === 'mp3' || format === 'ogg' || format === 'flac'}>
                <InputLabel id="quality-label">Qualidade</InputLabel>
                <Select
                  labelId="quality-label"
                  value={quality}
                  label="Qualidade"
                  onChange={handleQualityChange}
                >
                  <MenuItem value="best">Melhor disponível</MenuItem>
                  <MenuItem value="2160p">4K (2160p)</MenuItem>
                  <MenuItem value="1080p">Full HD (1080p)</MenuItem>
                  <MenuItem value="720p">HD (720p)</MenuItem>
                  <MenuItem value="480p">SD (480p)</MenuItem>
                  <MenuItem value="360p">360p</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          <GradientButton 
            type="submit" 
            variant="contained" 
            size="large"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
          >
            {loading ? 'Processando...' : 'Baixar'}
          </GradientButton>
          
          {error && (
            <Alert severity="error" variant="filled" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" variant="filled" sx={{ mt: 2 }}>
              {success}
            </Alert>
          )}
        </StyledForm>
      </Paper>
      
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Formatos suportados: MP4, MP3, WebM, OGG, FLAC
        </Typography>
      </Box>
    </Box>
  );
};

export default Home;
