import { Box, Alert, Snackbar } from '@mui/material';
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
import { UI_CONFIG } from '../constants';

const GenerateReports = () => {
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const { alert, showAlert, clearAlert } = useAlert();
  const { location, setLocation, inputValue, setInputValue, options, loading, handleUseMyLocation, coordinates } = useLocation(showAlert);
  const { weather } = useWeatherBackground(coordinates);
  const { generateReport, isGenerating } = useReportGeneration(showAlert);

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
    <>
      {alert && (
        <Snackbar
          open={true}
          autoHideDuration={UI_CONFIG.ALERT_AUTO_HIDE_DURATION}
          onClose={clearAlert}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          sx={{ 
            position: 'fixed',
            zIndex: 9999,
            top: '24px !important',
            left: '50% !important',
            transform: 'translateX(-50%)',
            width: 'auto',
            maxWidth: '90%',
            minWidth: '300px',
            '& .MuiSnackbarContent-root': {
              borderRadius: '12px'
            }
          }}
        >
          <Alert 
            severity={alert.type} 
            onClose={clearAlert}
            variant="filled"
            sx={{ 
              width: '100%',
              borderRadius: '12px',
              boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)'
            }}
          >
            {alert.message}
          </Alert>
        </Snackbar>
      )}

      <Box sx={Object.assign({}, 
        containerStyles, 
        getBackgroundStyle(coordinates, weather ?? null, location)
      )}>
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
          onShowAlert={showAlert}
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
    </>
  );
};

export default GenerateReports;