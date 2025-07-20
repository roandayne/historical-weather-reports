import { Autocomplete, TextField, InputAdornment, IconButton, Box, Typography } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

interface PlaceType {
  display_name: string;
  lat: string;
  lon: string;
}

interface LocationAutocompleteProps {
  location: string;
  inputValue: string;
  options: PlaceType[];
  loading: boolean;
  onLocationChange: (newValue: PlaceType | string | null) => void;
  onInputChange: (newValue: string) => void;
  onUseMyLocation: () => void;
}

export const LocationAutocomplete = ({
  location,
  inputValue,
  options,
  loading,
  onLocationChange,
  onInputChange,
  onUseMyLocation
}: LocationAutocompleteProps) => {
  const renderOption = (props: any, option: string | PlaceType) => (
    <li {...props}>
      <LocationOnIcon sx={{ mr: 2, color: 'text.secondary' }} />
      <Box>
        <Typography variant="body1">
          {typeof option === 'string' ? option : option.display_name}
        </Typography>
      </Box>
    </li>
  );

  return (
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
      onChange={(_event: any, newValue: PlaceType | string | null) => onLocationChange(newValue)}
      onInputChange={(_event, newValue) => onInputChange(newValue)}
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
                  <IconButton onClick={onUseMyLocation} color="secondary">
                    <LocationOnIcon />
                  </IconButton>
                </InputAdornment>
              </>
            ),
          }}
        />
      )}
      renderOption={renderOption}
    />
  );
}; 