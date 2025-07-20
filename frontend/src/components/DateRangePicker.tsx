import { Box, FormControl, InputLabel, MenuItem, Select, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useState } from 'react';

interface DateRangePickerProps {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  onStartDateChange: (date: Dayjs | null) => void;
  onEndDateChange: (date: Dayjs | null) => void;
}

type FilterType = 'custom' | 'year' | 'month';

export const DateRangePicker = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange
}: DateRangePickerProps) => {
  const [filterType, setFilterType] = useState<FilterType>('custom');
  const currentYear = dayjs().year();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = dayjs().month(i);
    return {
      value: i,
      label: date.format('MMMM')
    };
  });

  const handleFilterTypeChange = (_: React.MouseEvent<HTMLElement>, newFilterType: FilterType | null) => {
    if (newFilterType) {
      setFilterType(newFilterType);
      onStartDateChange(null);
      onEndDateChange(null);
    }
  };

  const handleYearChange = (year: number) => {
    const start = dayjs().year(year).startOf('year');
    const end = dayjs().year(year).endOf('year');
    onStartDateChange(start);
    onEndDateChange(end);
  };

  const handleMonthYearChange = (year: number, month: number) => {
    const start = dayjs().year(year).month(month).startOf('month');
    const end = dayjs().year(year).month(month).endOf('month');
    onStartDateChange(start);
    onEndDateChange(end);
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      width: '100%',
    }}>
      <ToggleButtonGroup
        value={filterType}
        exclusive
        onChange={handleFilterTypeChange}
        aria-label="filter type"
        fullWidth
      >
        <ToggleButton value="custom" aria-label="custom date range">
          Custom Range
        </ToggleButton>
        <ToggleButton value="year" aria-label="yearly filter">
          Yearly
        </ToggleButton>
        <ToggleButton value="month" aria-label="monthly filter">
          Monthly
        </ToggleButton>
      </ToggleButtonGroup>

      {filterType === 'custom' && (
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
      )}

      {filterType === 'year' && (
        <FormControl fullWidth>
          <InputLabel id="year-select-label">Select Year</InputLabel>
          <Select
            labelId="year-select-label"
            id="year-select"
            label="Select Year"
            value={startDate ? startDate.year() : ''}
            onChange={(e) => handleYearChange(Number(e.target.value))}
          >
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {filterType === 'month' && (
        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: '10px',
          width: '100%',
        }}>
          <FormControl sx={{ width: '50%' }}>
            <InputLabel id="month-year-select-label">Select Year</InputLabel>
            <Select
              labelId="month-year-select-label"
              id="month-year-select"
              label="Select Year"
              value={startDate ? startDate.year() : ''}
              onChange={(e) => handleMonthYearChange(Number(e.target.value), startDate?.month() || 0)}
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ width: '50%' }}>
            <InputLabel id="month-select-label">Select Month</InputLabel>
            <Select
              labelId="month-select-label"
              id="month-select"
              label="Select Month"
              value={startDate ? startDate.month() : ''}
              onChange={(e) => handleMonthYearChange(startDate?.year() || currentYear, Number(e.target.value))}
            >
              {months.map((month) => (
                <MenuItem key={month.value} value={month.value}>
                  {month.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}
    </Box>
  );
}; 