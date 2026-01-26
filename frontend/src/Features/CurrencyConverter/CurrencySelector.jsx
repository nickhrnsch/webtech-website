import React from 'react';
import {
  Autocomplete,
  TextField,
  Box,
  Typography,
} from '@mui/material';
import { CURRENCY_INFO } from './constants';
import { selectorStyles, optionLabelStyles, flagEmojiStyles } from './styles';

/**
 * Wiederverwendbare Komponente für die Währungsauswahl
 * Nutzt Material UI Autocomplete mit Such-Funktion
 */
function CurrencySelector({ value, onChange, label, disabled, excludeCurrency }) {
  // Liste aller verfügbaren Währungen
  const currencies = Object.keys(CURRENCY_INFO);
  
  // Filtere die ausgeschlossene Währung aus (verhindert gleiche Von/Zu-Währung)
  const availableCurrencies = excludeCurrency
    ? currencies.filter(curr => curr !== excludeCurrency)
    : currencies;

  return (
    <Box sx={{ width: '100%' }}>
      <Autocomplete
        value={value}
        onChange={(event, newValue) => {
          if (newValue) {
            onChange(newValue);
          }
        }}
        options={availableCurrencies}
        disabled={disabled}
        getOptionLabel={(option) => {
          const info = CURRENCY_INFO[option];
          return `${option} - ${info.name}`;
        }}
        renderOption={(props, option) => {
          const info = CURRENCY_INFO[option];
          return (
            <Box component="li" {...props} key={option}>
              <Box sx={optionLabelStyles}>
                <span style={flagEmojiStyles}>{info.flag}</span>
                <Typography variant="body1">
                  <strong>{option}</strong> - {info.name}
                </Typography>
              </Box>
            </Box>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            variant="outlined"
            fullWidth
            InputProps={{
              ...params.InputProps,
              startAdornment: value && (
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                  <span style={flagEmojiStyles}>{CURRENCY_INFO[value]?.flag}</span>
                </Box>
              ),
            }}
          />
        )}
        sx={{ 
          width: '100%',
          '& .MuiOutlinedInput-root': {
            fontSize: '1.1rem',
          },
        }}
        disableClearable
        fullWidth
      />
    </Box>
  );
}

export default CurrencySelector;
