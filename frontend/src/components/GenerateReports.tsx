import { Box, Button, Paper, TextField, Typography, InputAdornment, IconButton, Autocomplete } from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';
import { DatePicker } from '@mui/x-date-pickers';
import { Dayjs } from 'dayjs';
import type { ChangeEvent } from 'react';

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

interface WeatherResponse {
  data: {
    message: string;
    excel_report: string;
    pdf_report: string;
  };
}

const GenerateReports = () => {
  const [location, setLocation] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<PlaceType[]>([]);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [loading, setLoading] = useState(false);

  const downloadFile = async (filename: string) => {
    const response = await axios.get(`/api/download/${filename}`, {
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const mutation = useMutation<WeatherResponse, AxiosError, WeatherData>({
    mutationFn: (data: WeatherData) => {
      return axios.post('/api/weather-data', data);
    },
    onSuccess: async (response) => {
      try {
        await downloadFile(response.data.pdf_report);
        await downloadFile(response.data.excel_report);
      } catch (error) {
        console.error('Error downloading files:', error);
      }
    },
    onError: (error: AxiosError) => {
      console.error('Error generating report:', error);
    },
  });

  useEffect(() => {
    let active = true;

    const fetchPlaces = async () => {
      try {
        if (inputValue.length < 3) {
          setOptions([]);
          return;
        }

        setLoading(true);
        const response = await axios.get('/api/geocode', {
          params: {
            q: inputValue
          }
        });

        if (active) {
          setOptions(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch places:', error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchPlaces();
    }, 300);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [inputValue]);

  const formatDateForBackend = (date: Dayjs) => {
    return date.format('DD-MM-YYYY');
  };

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await axios.get('/api/reverse-geocode', {
              params: {
                lat: latitude,
                lon: longitude,
              }
            });
            const data = response.data;
            if (data.location) {
              setLocation(data.location);
            } else {
              setLocation('Could not find location');
            }
          } catch (error: unknown) {
            console.error('Error fetching location name:', error);
            if (error instanceof AxiosError) {
              setLocation(`Error: ${error.message}`);
            } else {
              setLocation('Error fetching location name');
            }
          }
        },
        (error) => {
          console.error('Error getting geolocation:', error);
          setLocation(`Error: ${error.message}`);
        },
        {
          timeout: 10000,
          enableHighAccuracy: true,
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setLocation('Geolocation not supported');
    }
  };

  const handleGenerateReport = () => {
    if (location && startDate && endDate) {
      mutation.mutate({
        location,
        startDate: formatDateForBackend(startDate),
        endDate: formatDateForBackend(endDate)
      });
    }
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: '40px',
      alignItems: 'center',
      justifyContent: 'center',
      width: {xs:'100%', sm:'65%'},
    }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
            <Typography variant="h4">Generate Historical Weather Reports</Typography>
            <Typography variant="subtitle1">Get comprehensive 10-year weather data for any location worldwide</Typography>
        </Box>
        <Paper elevation={3} sx={{
          width: '100%',
        }}>
          <Box sx={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}>
            <Autocomplete
              id="location-autocomplete"
              sx={{ width: '100%' }}
              getOptionLabel={(option: PlaceType | string) => 
                typeof option === 'string' ? option : option.display_name
              }
              options={options}
              autoComplete
              includeInputInList
              filterSelectedOptions
              loading={loading}
              value={location}
              noOptionsText={inputValue.length < 3 ? "Type at least 3 characters" : "No locations found"}
              onChange={(event: any, newValue: PlaceType | string | null) => {
                if (typeof newValue === 'string') {
                  setLocation(newValue);
                } else if (newValue) {
                  setLocation(newValue.display_name);
                } else {
                  setLocation('');
                }
              }}
              onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
              }}
              freeSolo
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Location"
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {params.InputProps.endAdornment}
                        <InputAdornment position="end">
                          <IconButton onClick={handleUseMyLocation} color="secondary">
                            <LocationOnIcon />
                          </IconButton>
                        </InputAdornment>
                      </>
                    ),
                  }}
                />
              )}
              renderOption={(props, option: string | PlaceType) => {
                if (typeof option === 'string') {
                  return (
                    <li {...props}>
                      <LocationOnIcon sx={{ mr: 2, color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="body1">
                          {option}
                        </Typography>
                      </Box>
                    </li>
                  );
                }
                return (
                  <li {...props}>
                    <LocationOnIcon sx={{ mr: 2, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body1">
                        {option.display_name}
                      </Typography>
                    </Box>
                  </li>
                );
              }}
            />
            <Box sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: '10px',
              width: '100%',
            }}>
              <DatePicker
                sx={{
                  width: '100%',
                }}
                label="Start Date"
                value={startDate}
                onChange={(newValue: Dayjs | null) => setStartDate(newValue)}
              />
              <DatePicker
                sx={{
                  width: '100%',
                }}
                label="End Date"
                value={endDate}
                onChange={(newValue: Dayjs | null) => setEndDate(newValue)}
              />
            </Box>
            
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
  )
}

export default GenerateReports