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
import {
  createMainContainerStyle,
  snackbarStyles,
  alertStyles,
  createWeatherContainerStyles,
} from '../styles/GenerateReports.styles';
import type { PlaceType } from '../types/weather';
import { UI_CONFIG } from '../constants';

const GenerateReports = () => {
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const { alert, showAlert, clearAlert } = useAlert();
  const {
    location,
    setLocation,
    inputValue,
    setInputValue,
    options,
    loading,
    handleUseMyLocation,
    handleAutoLocationRequest,
    coordinates,
    isCheckingPermission,
    setLocationAndCoordinates,
  } = useLocation(showAlert);
  const { weather } = useWeatherBackground(coordinates);
  const { generateReport, isGenerating } = useReportGeneration(showAlert);

  useEffect(() => {
    handleAutoLocationRequest();
  }, []);

  const handleLocationChange = (newValue: PlaceType | string | null) => {
    if (typeof newValue === 'string') {
      setLocation(newValue);
    } else if (newValue) {
      setLocationAndCoordinates(newValue.display_name, {
        lat: newValue.lat,
        lon: newValue.lon,
      });
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
          sx={snackbarStyles}
        >
          <Alert
            severity={alert.type}
            onClose={clearAlert}
            variant='filled'
            sx={alertStyles}
          >
            {alert.message}
          </Alert>
        </Snackbar>
      )}

      <Box
        sx={createMainContainerStyle(coordinates, weather ?? null, location)}
      >
        <ReportHeader />

        <ReportForm
          location={location}
          inputValue={inputValue}
          options={options}
          loading={loading || isCheckingPermission}
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

        <Box sx={createWeatherContainerStyles(coordinates, location)}>
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
