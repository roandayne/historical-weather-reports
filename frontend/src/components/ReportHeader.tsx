import { Box, Typography } from '@mui/material';
import {
  containerStyles,
  titleStyles,
  subtitleStyles,
} from '../styles/ReportHeader.styles';

export const ReportHeader = () => {
  return (
    <Box sx={containerStyles}>
      <Typography variant='h4' sx={titleStyles}>
        Generate Historical Weather Reports
      </Typography>
      <Typography variant='subtitle1' sx={subtitleStyles}>
        Get comprehensive 10-year weather data for any location worldwide
      </Typography>
    </Box>
  );
};
