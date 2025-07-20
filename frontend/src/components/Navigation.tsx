import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import WbCloudyIcon from '@mui/icons-material/WbCloudy';
import ModeNightIcon from '@mui/icons-material/ModeNight';

const Navigation = () => {
  return (
    <Box sx={{ flexGrow: 1, width: '100%', padding: "10px 80px" }}>
      <AppBar position="static" sx={{ backgroundColor: 'white', boxShadow: 'none' }}>
        <Toolbar>
          <WbCloudyIcon sx={{ color: '#0095ff', marginRight: '10px', fontSize: '2rem' }}/>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#42526e', fontWeight: 'bold' }}>
            Historical Weather Reporter
          </Typography>
          <IconButton color="inherit" sx={{ color: '#42526e' }}>
            <ModeNightIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navigation;