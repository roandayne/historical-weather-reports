import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import WbCloudyIcon from '@mui/icons-material/WbCloudy';
import ModeNightIcon from '@mui/icons-material/ModeNight';

const Navigation = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <AppBar position="fixed" sx={{ backgroundColor: 'white', boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)' }}>
        <Toolbar sx={{ 
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'space-between',
          minHeight: '64px',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <WbCloudyIcon sx={{ color: '#0095ff', marginRight: '24px', fontSize: '2rem' }}/>
            <Typography variant="h6" component="div" sx={{
              color: '#42526e', 
              fontWeight: 'bold',
              fontSize: '1.1rem'
            }}>
              Weather History
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </Box>
  );
};

export default Navigation;