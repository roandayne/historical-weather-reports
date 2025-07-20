import { Box, Alert, Snackbar } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import { useState, useEffect } from 'react';
import { Dayjs } from 'dayjs';
import { useLocation } from '../hooks/useLocation';
import { useAlert } from '../hooks/useAlert';
import { useReportGeneration } from '../hooks/useReportGeneration';
import { useWeatherBackground } from '../hooks/useWeatherBackground';
import { ReportHeader } from './ReportHeader';
import { ReportForm } from './ReportForm';
import { CurrentWeather } from './CurrentWeather';
import { containerStyles, getBackgroundStyle } from '../styles/GenerateReports.styles';
import type { PlaceType } from '../types/weather';

const GenerateReports = () => {
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const { location, setLocation, inputValue, setInputValue, options, loading, handleUseMyLocation, coordinates } = useLocation();
  const { alert, showAlert, clearAlert } = useAlert();
  const { weather } = useWeatherBackground(coordinates);
  const { generateReport, isGenerating } = useReportGeneration();

  useEffect(() => {
    handleUseMyLocation();
  }, []);

  const handleLocationChange = (newValue: PlaceType | string | null) => {
    if (typeof newValue === 'string') {
      setLocation(newValue);
    } else if (newValue) {
      setLocation(newValue.display_name);
    } else {
      setLocation('');
    }
  };

  return (
    <Box sx={Object.assign({}, 
      containerStyles, 
      getBackgroundStyle(coordinates, weather ?? null, location)
    )}>
      <Snackbar
        open={!!alert}
        autoHideDuration={2000}
        onClose={clearAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={alert?.type}>{alert?.message}</Alert>
      </Snackbar>
          
      <ReportHeader />

      <ReportForm
        location={location}
        inputValue={inputValue}
        options={options}
        loading={loading}
        startDate={startDate}
        endDate={endDate}
        isGenerating={isGenerating}
        onLocationChange={handleLocationChange}
        onInputChange={setInputValue}
        onUseMyLocation={handleUseMyLocation}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onGenerateReport={generateReport}
      />

      <Box sx={{ height: coordinates && location ? 'auto' : '120px' }}>
        {coordinates && location && (
          <CurrentWeather 
            lat={coordinates.lat.toString()} 
            lon={coordinates.lon.toString()} 
            location={location} 
          />
        )}
      </Box>
    </Box>
  );
};

export default GenerateReports;