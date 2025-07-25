import {
  Autocomplete,
  TextField,
  InputAdornment,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { UI_CONFIG } from '../constants';
import type { ChangeEvent, FC } from 'react';
import {
  autocompleteStyles,
  optionIconStyles,
  iconButtonStyles,
} from '../styles/LocationAutocomplete.styles';

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

export const LocationAutocomplete: FC<LocationAutocompleteProps> = ({
  location,
  inputValue,
  options,
  loading,
  onLocationChange,
  onInputChange,
  onUseMyLocation,
}) => {
  const renderOption = (
    props: React.HTMLAttributes<HTMLLIElement>,
    option: string | PlaceType
  ) => (
    <li {...props}>
      <LocationOnIcon sx={optionIconStyles} />
      <Box>
        <Typography variant='body1'>
          {typeof option === 'string' ? option : option.display_name}
        </Typography>
      </Box>
    </li>
  );

  return (
    <Autocomplete
      id='location-autocomplete'
      sx={autocompleteStyles}
      getOptionLabel={(option: PlaceType | string) =>
        typeof option === 'string' ? option : option.display_name
      }
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      loading={loading}
      value={location}
      noOptionsText={
        loading
          ? 'Searching locations...'
          : inputValue.length < UI_CONFIG.MIN_SEARCH_LENGTH
          ? `Type at least ${UI_CONFIG.MIN_SEARCH_LENGTH} characters`
          : 'No locations found'
      }
      onChange={(
        _event: ChangeEvent<{}>,
        newValue: PlaceType | string | null
      ) => onLocationChange(newValue)}
      onInputChange={(_event, newValue) => onInputChange(newValue)}
      freeSolo
      renderInput={params => (
        <TextField
          {...params}
          label='Location'
          fullWidth
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {params.InputProps.endAdornment}
                <InputAdornment position='end'>
                  <IconButton
                    onClick={onUseMyLocation}
                    color='secondary'
                    sx={iconButtonStyles}
                  >
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
