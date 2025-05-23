import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  Typography, 
  Container, 
  Link,
  Paper
} from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar>
          <CloudDownloadIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            YouTube Downloader
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link component={RouterLink} to="/" color="inherit" underline="none">
              Home
            </Link>
            <Link component={RouterLink} to="/downloads" color="inherit" underline="none">
              Downloads
            </Link>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Container component="main" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            borderRadius: 2,
            background: 'linear-gradient(145deg, #1e1e1e 0%, #2d2d2d 100%)'
          }}
        >
          {children}
        </Paper>
      </Container>
      
      <Box 
        component="footer" 
        sx={{ 
          py: 3, 
          px: 2, 
          mt: 'auto',
          backgroundColor: (theme) => theme.palette.background.paper
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="body2" color="text.secondary" align="center">
            YouTube Downloader &copy; {new Date().getFullYear()}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
