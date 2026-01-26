import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { CURRENCY_INFO } from './constants';
import {
  rateInfoBoxStyles,
  rateTextStyles,
  lastUpdatedStyles,
} from './styles';

/**
 * Komponente zur Anzeige von Wechselkurs-Informationen
 * Zeigt den aktuellen Kurs, umgekehrten Kurs und letzte Aktualisierung
 */
function ExchangeRateInfo({ fromCurrency, toCurrency, rate, lastUpdated }) {
  if (!rate || !fromCurrency || !toCurrency) {
    return null;
  }

  const fromInfo = CURRENCY_INFO[fromCurrency];
  const toInfo = CURRENCY_INFO[toCurrency];
  
  // Berechne den umgekehrten Kurs
  const reverseRate = (1 / rate).toFixed(4);
  const formattedRate = rate.toFixed(4);

  return (
    <Box sx={rateInfoBoxStyles}>
      {/* Hauptkurs */}
      <Box sx={rateTextStyles}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendingUpIcon color="primary" />
          <Typography variant="body1">
            <strong>1 {fromCurrency}</strong> = <strong>{formattedRate} {toCurrency}</strong>
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {fromInfo?.symbol} → {toInfo?.symbol}
        </Typography>
      </Box>

      <Divider sx={{ my: 1 }} />

      {/* Umgekehrter Kurs */}
      <Box sx={rateTextStyles}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendingUpIcon color="secondary" sx={{ transform: 'rotate(180deg)' }} />
          <Typography variant="body1">
            <strong>1 {toCurrency}</strong> = <strong>{reverseRate} {fromCurrency}</strong>
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {toInfo?.symbol} → {fromInfo?.symbol}
        </Typography>
      </Box>

      {/* Letzte Aktualisierung */}
      {lastUpdated && (
        <Typography sx={lastUpdatedStyles}>
          Letzte Aktualisierung: {new Date(lastUpdated).toLocaleString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Typography>
      )}
    </Box>
  );
}

export default ExchangeRateInfo;
