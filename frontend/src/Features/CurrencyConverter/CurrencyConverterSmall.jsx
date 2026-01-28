import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Grid,
  IconButton,
  Typography,
  Divider,
  Box,
  Alert,
  CircularProgress,
  Chip,
  Tooltip,
} from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

import CurrencySelector from './CurrencySelector';
import ExchangeRateInfo from './ExchangeRateInfo';
import { convertCurrency } from './CurrencyConverterService';
import { getCurrencyFavorites, updateCurrencyFavorites } from '../../services/userService';
import {
  DEFAULT_FROM_CURRENCY,
  DEFAULT_TO_CURRENCY,
  CURRENCY_INFO,
} from './constants';
import {
  converterCardStyles,
  amountFieldStyles,
  currencyGridStyles,
  swapButtonStyles,
  resultFieldStyles,
  dividerStyles,
  errorAlertStyles,
  loadingBoxStyles,
  favoritesBoxStyles,
  favoriteChipStyles,
  favoriteIconButtonStyles,
} from './styles';

/**
 * Hauptkomponente für den Currency Converter
 * Features: Währungsumrechnung, Swap-Funktion, Favoriten, Echtzeit-Konvertierung
 */
function CurrencyConverterSmall() {
  // ========== STATE MANAGEMENT ==========
  const [amount, setAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState(DEFAULT_FROM_CURRENCY);
  const [toCurrency, setToCurrency] = useState(DEFAULT_TO_CURRENCY);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // ========== FAVORITEN LADEN ==========
  useEffect(() => {
    async function loadFavorites() {
      try {
        const favoritesFromApi = await getCurrencyFavorites();
        setFavorites(favoritesFromApi || []);
      } catch (e) {
        console.error('Fehler beim Laden der Favoriten:', e);
      }
    }
    loadFavorites();
  }, []);

  // ========== FAVORITEN SPEICHERN ==========
  const saveFavorites = async (newFavorites) => {
    try {
      const saved = await updateCurrencyFavorites(newFavorites);
      setFavorites(saved || newFavorites);
    } catch (e) {
      console.error('Fehler beim Speichern der Favoriten:', e);
      setFavorites(newFavorites);
    }
  };

  // ========== FAVORIT HINZUFÜGEN/ENTFERNEN ==========
  const toggleFavorite = async () => {
    const favoriteKey = `${fromCurrency}-${toCurrency}`;
    const existingIndex = favorites.findIndex(
      (fav) => fav.from === fromCurrency && fav.to === toCurrency
    );

    if (existingIndex !== -1) {
      // Entfernen
      const newFavorites = favorites.filter((_, index) => index !== existingIndex);
      await saveFavorites(newFavorites);
    } else {
      // Hinzufügen
      const newFavorite = {
        from: fromCurrency,
        to: toCurrency,
        label: `${fromCurrency} → ${toCurrency}`,
      };
      await saveFavorites([...favorites, newFavorite]);
    }
  };

  // ========== PRÜFEN OB AKTUELLES PAAR EIN FAVORIT IST ==========
  const isFavorite = favorites.some(
    (fav) => fav.from === fromCurrency && fav.to === toCurrency
  );

  // ========== FAVORIT LADEN ==========
  const loadFavorite = (favorite) => {
    setFromCurrency(favorite.from);
    setToCurrency(favorite.to);
  };

  // ========== WÄHRUNGSKONVERTIERUNG ==========
  const performConversion = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      console.log('Ungültiger Betrag:', amount);
      setConvertedAmount(null);
      setExchangeRate(null);
      return;
    }

    console.log('Starte Konvertierung:', { amount, fromCurrency, toCurrency });
    setLoading(true);
    setError(null);

    try {
      const result = await convertCurrency(
        parseFloat(amount),
        fromCurrency,
        toCurrency
      );
      
      console.log('Konvertierungsergebnis:', result);
      
      setConvertedAmount(result.convertedAmount);
      setExchangeRate(result.rate);
      setLastUpdated(result.date || new Date().toISOString());
    } catch (err) {
      console.error('Konvertierungsfehler:', err);
      setError(err.message || 'Fehler bei der Währungsumrechnung');
      setConvertedAmount(null);
      setExchangeRate(null);
    } finally {
      setLoading(false);
    }
  };

  // ========== AUTO-CONVERSION BEI ÄNDERUNGEN ==========
  useEffect(() => {
    // Debounce für Auto-Conversion
    const timer = setTimeout(() => {
      performConversion();
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, fromCurrency, toCurrency]);

  // ========== SWAP-FUNKTION ==========
  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  // ========== INPUT VALIDATION ==========
  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Erlaube nur Zahlen und Dezimalpunkt
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  // ========== RENDER ==========
  return (
    <Card sx={converterCardStyles}>
      <CardContent>
        <Typography variant="h6" component="h2" gutterBottom align="center">
          Währungsrechner
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" gutterBottom sx={{ fontSize: '0.875rem' }}>
          Aktuelle Wechselkurse von der EZB
        </Typography>

        {/* Favoriten-Bereich */}
        {favorites.length > 0 && (
          <Box sx={favoritesBoxStyles}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>
              Favoriten:
            </Typography>
            {favorites.map((fav, index) => (
              <Chip
                key={index}
                label={fav.label}
                onClick={() => loadFavorite(fav)}
                sx={favoriteChipStyles}
                variant={
                  fav.from === fromCurrency && fav.to === toCurrency
                    ? 'filled'
                    : 'outlined'
                }
                color="primary"
              />
            ))}
          </Box>
        )}

        {/* Betragseingabe */}
        <TextField
          label="Betrag"
          value={amount}
          onChange={handleAmountChange}
          fullWidth
          variant="outlined"
          type="text"
          inputMode="decimal"
          sx={amountFieldStyles}
          disabled={loading}
          helperText="Geben Sie den zu konvertierenden Betrag ein"
        />

        {/* Währungsauswahl + Swap + Favorit */}
        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'flex-start', width: '100%', mb: 2, maxWidth: '100%' }}>
          <Box sx={{ flex: '1 1 0', minWidth: 0, maxWidth: '42%' }}>
            <CurrencySelector
              value={fromCurrency}
              onChange={setFromCurrency}
              label="Von"
              disabled={loading}
              excludeCurrency={null}
            />
          </Box>

          <Box sx={{ flexShrink: 0, px: 0.5, mt: 1 }}>
            <Tooltip title="Währungen tauschen">
              <IconButton
                onClick={handleSwap}
                sx={swapButtonStyles}
                disabled={loading}
                size="small"
              >
                <SwapHorizIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          <Box sx={{ flex: '1 1 0', minWidth: 0, maxWidth: '42%' }}>
            <CurrencySelector
              value={toCurrency}
              onChange={setToCurrency}
              label="Zu"
              disabled={loading}
              excludeCurrency={null}
            />
          </Box>

          <Box sx={{ flexShrink: 0, pl: 0.5, mt: 1 }}>
            <Tooltip title={isFavorite ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}>
              <IconButton
                onClick={toggleFavorite}
                sx={favoriteIconButtonStyles}
                disabled={loading}
                size="small"
              >
                {isFavorite ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Fehleranzeige */}
        {error && (
          <Alert severity="error" sx={errorAlertStyles}>
            {error}
          </Alert>
        )}

        {/* Loading-State */}
        {loading && (
          <Box sx={loadingBoxStyles}>
            <CircularProgress />
          </Box>
        )}

        {/* Ergebnis - ZUERST anzeigen */}
        <TextField
          label="Umgerechneter Betrag"
          value={
            convertedAmount !== null
              ? `${CURRENCY_INFO[toCurrency]?.symbol || ''} ${convertedAmount.toFixed(2)}`
              : ''
          }
          fullWidth
          variant="outlined"
          InputProps={{
            readOnly: true,
          }}
          sx={resultFieldStyles}
          disabled={loading}
          helperText={
            convertedAmount !== null
              ? `${amount} ${fromCurrency} entspricht ${convertedAmount.toFixed(2)} ${toCurrency}`
              : 'Das Ergebnis wird hier angezeigt'
          }
        />

        {/* Wechselkurs-Informationen - DANACH anzeigen */}
        {!loading && exchangeRate && (
          <>
            <Divider sx={dividerStyles} />
            <ExchangeRateInfo
              fromCurrency={fromCurrency}
              toCurrency={toCurrency}
              rate={exchangeRate}
              lastUpdated={lastUpdated}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default CurrencyConverterSmall;
