import { Box, Button, Paper } from '@mui/material';
import { Dayjs } from 'dayjs';
import type { PlaceType } from '../types/weather';
import { LocationAutocomplete } from './LocationAutocomplete';
import { DateRangePicker } from './DateRangePicker';
import { formPaperStyles, formContainerStyles } from '../styles/GenerateReports.styles';
import { formatDateForBackend } from '../utils/fileUtils';
import type { FC } from 'react';

interface ReportFormProps {
  location: string;
  inputValue: string;
  options: PlaceType[];
  loading: boolean;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  isGenerating: boolean;
  onLocationChange: (newValue: PlaceType | string | null) => void;
  onInputChange: (value: string) => void;
  onUseMyLocation: () => void;
  onStartDateChange: (date: Dayjs | null) => void;
  onEndDateChange: (date: Dayjs | null) => void;
  onGenerateReport: (data: { location: string; startDate: string; endDate: string; }) => void;
  onShowAlert: (type: 'error' | 'success', message: string) => void;
}

export const ReportForm: FC<ReportFormProps> = ({
  location,
  inputValue,
  options,
  loading,
  startDate,
  endDate,
  isGenerating,
  onLocationChange,
  onInputChange,
  onUseMyLocation,
  onStartDateChange,
  onEndDateChange,
  onGenerateReport,
  onShowAlert,
}) => {
  const handleGenerateReport = () => {
    if (location && startDate && endDate) {
      onGenerateReport({
        location,
        startDate: formatDateForBackend(startDate),
        endDate: formatDateForBackend(endDate)
      });
    } else {
      onShowAlert('error', 'Please select a location and date range');
    }
  };

  return (
    <Paper elevation={3} sx={formPaperStyles}>
      <Box sx={formContainerStyles}>
        <LocationAutocomplete
          location={location}
          inputValue={inputValue}
          options={options}
          loading={loading}
          onLocationChange={onLocationChange}
          onInputChange={onInputChange}
          onUseMyLocation={onUseMyLocation}
        />

        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={onStartDateChange}
          onEndDateChange={onEndDateChange}
        />
          
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleGenerateReport}
          disabled={isGenerating || !location || !startDate || !endDate}
        >
          {isGenerating ? 'Generating...' : 'Generate Report'}
        </Button>
      </Box>
    </Paper>
  );
}; 