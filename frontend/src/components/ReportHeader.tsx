import { Box, Typography } from '@mui/material';

export const ReportHeader = () => {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Typography variant="h4" textAlign="center">Generate Historical Weather Reports</Typography>
      <Typography variant="subtitle1" textAlign="center">Get comprehensive 10-year weather data for any location worldwide</Typography>
    </Box>
  );
}; 