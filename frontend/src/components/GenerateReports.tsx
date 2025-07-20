import { Box, Button, Paper, Alert, Snackbar } from '@mui/material';
import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';
import { Dayjs } from 'dayjs';
import { useLocation } from '../hooks/useLocation';
import { useAlert } from '../hooks/useAlert';
import { downloadFile, formatDateForBackend } from '../utils/fileUtils';
import { LocationAutocomplete } from './LocationAutocomplete';
import { DateRangePicker } from './DateRangePicker';
import { ReportHeader } from './ReportHeader';

interface PlaceType {
  display_name: string;
  lat: string;
  lon: string;
}

interface WeatherData {
  location: string;
  startDate: string;
  endDate: string;
}

interface ErrorResponse {
  message: string;
}

interface WeatherResponse {
  data: {
    message: string;
    excel_report: string;
    pdf_report: string;
  };
}

const GenerateReports = () => {
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const { location, setLocation, inputValue, setInputValue, options, loading, handleUseMyLocation } = useLocation();
  const { alert, showAlert, clearAlert } = useAlert();

  const handleLocationChange = (newValue: PlaceType | string | null) => {
    if (typeof newValue === 'string') {
      setLocation(newValue);
    } else if (newValue) {
      setLocation(newValue.display_name);
    } else {
      setLocation('');
    }
  };

  const mutation = useMutation<WeatherResponse, AxiosError<ErrorResponse>, WeatherData>({
    mutationFn: (data: WeatherData) => axios.post('/api/weather-data', data),
    onSuccess: async (response) => {
      try {
        await downloadFile(response.data.pdf_report);
        await downloadFile(response.data.excel_report);
        showAlert('success', 'Reports generated and downloaded successfully!');
      } catch (error) {
        console.error('Error downloading files:', error);
        showAlert('error', 'Error downloading files. Please try again.');
      }
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error('Error generating report:', error);
      showAlert('error', error.response?.data?.message || 'Error generating report. Please try again.');
    },
  });

  const handleGenerateReport = () => {
    if (location && startDate && endDate) {
      mutation.mutate({
        location,
        startDate: formatDateForBackend(startDate),
        endDate: formatDateForBackend(endDate)
      });
    }
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: '40px',
      alignItems: 'center',
      justifyContent: 'center',
      width: {xs:'100%', sm:'65%'},
    }}>
      <Snackbar
        open={!!alert}
        autoHideDuration={2000}
        onClose={clearAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={alert?.type}>{alert?.message}</Alert>
      </Snackbar>
          
      <ReportHeader />

      <Paper elevation={3} sx={{ width: '100%' }}>
        <Box sx={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}>
          <LocationAutocomplete
            location={location}
            inputValue={inputValue}
            options={options}
            loading={loading}
            onLocationChange={handleLocationChange}
            onInputChange={setInputValue}
            onUseMyLocation={handleUseMyLocation}
          />

          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
            
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleGenerateReport}
            disabled={mutation.isPending || !location || !startDate || !endDate}
          >
            {mutation.isPending ? 'Generating...' : 'Generate Report'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default GenerateReports;