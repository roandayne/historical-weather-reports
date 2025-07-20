import { Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Dayjs } from 'dayjs';

interface DateRangePickerProps {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  onStartDateChange: (date: Dayjs | null) => void;
  onEndDateChange: (date: Dayjs | null) => void;
}

export const DateRangePicker = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange
}: DateRangePickerProps) => {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'row',
      gap: '10px',
      width: '100%',
    }}>
      <DatePicker
        sx={{ width: '100%' }}
        label="Start Date"
        value={startDate}
        onChange={onStartDateChange}
      />
      <DatePicker
        sx={{ width: '100%' }}
        label="End Date"
        value={endDate}
        onChange={onEndDateChange}
      />
    </Box>
  );
}; 