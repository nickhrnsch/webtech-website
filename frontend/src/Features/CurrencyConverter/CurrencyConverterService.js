import { API_BASE_URL, CURRENCY_INFO } from './constants';

/**
 * Holt alle verfügbaren Währungen von der Frankfurter API
 * @returns {Promise<Object>} Object mit Währungscodes als Keys und Namen als Values
 */
export async function getAvailableCurrencies() {
  try {
    const response = await fetch(`${API_BASE_URL}/currencies`);
    
    if (!response.ok) {
      throw new Error('Fehler beim Abrufen der Währungen');
    }
    
    const currencies = await response.json();
    return currencies;
  } catch (error) {
    console.error('Fehler beim Laden der Währungen:', error);
    // Fallback auf lokale Währungsliste
    return Object.keys(CURRENCY_INFO).reduce((acc, code) => {
      acc[code] = CURRENCY_INFO[code].name;
      return acc;
    }, {});
  }
}

/**
 * Konvertiert einen Betrag von einer Währung in eine andere
 * @param {number} amount - Der zu konvertierende Betrag
 * @param {string} fromCurrency - Ausgangswährung (z.B. 'EUR')
 * @param {string} toCurrency - Zielwährung (z.B. 'USD')
 * @returns {Promise<Object>} Object mit convertedAmount und rate
 */
export async function convertCurrency(amount, fromCurrency, toCurrency) {
  console.log('convertCurrency aufgerufen mit:', { amount, fromCurrency, toCurrency });
  
  if (!amount || amount <= 0) {
    throw new Error('Ungültiger Betrag');
  }
  
  if (!fromCurrency || !toCurrency) {
    throw new Error('Währungen müssen angegeben werden');
  }
  
  if (fromCurrency === toCurrency) {
    console.log('Gleiche Währungen, gebe 1:1 zurück');
    return {
      amount: parseFloat(amount),
      base: fromCurrency,
      date: new Date().toISOString().split('T')[0],
      rates: { [toCurrency]: 1 },
      convertedAmount: parseFloat(amount),
      rate: 1
    };
  }
  
  try {
    const url = `${API_BASE_URL}/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`;
    console.log('API-Anfrage URL:', url);
    
    const response = await fetch(url);
    console.log('API-Response Status:', response.status);
    
    if (!response.ok) {
      throw new Error(`API-Fehler: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('API-Response Data:', data);
    
    const result = {
      ...data,
      convertedAmount: data.rates[toCurrency],
      rate: data.rates[toCurrency] / amount
    };
    console.log('Berechnetes Ergebnis:', result);
    
    return result;
  } catch (error) {
    console.error('Konvertierungs-Fehler:', error);
    throw error;
  }
}

/**
 * Holt die aktuellen Wechselkurse für eine Basiswährung
 * @param {string} baseCurrency - Basiswährung (z.B. 'EUR')
 * @param {string[]} targetCurrencies - Optional: Array von Zielwährungen
 * @returns {Promise<Object>} Object mit Wechselkursen
 */
export async function getExchangeRates(baseCurrency, targetCurrencies = null) {
  if (!baseCurrency) {
    throw new Error('Basiswährung muss angegeben werden');
  }
  
  try {
    let url = `${API_BASE_URL}/latest?from=${baseCurrency}`;
    
    if (targetCurrencies && targetCurrencies.length > 0) {
      url += `&to=${targetCurrencies.join(',')}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Fehler beim Abrufen der Wechselkurse');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fehler beim Abrufen der Wechselkurse:', error);
    throw error;
  }
}

/**
 * Holt historische Wechselkurse für einen bestimmten Zeitraum
 * @param {string} baseCurrency - Basiswährung
 * @param {string} startDate - Startdatum (YYYY-MM-DD)
 * @param {string} endDate - Enddatum (YYYY-MM-DD)
 * @param {string} targetCurrency - Zielwährung
 * @returns {Promise<Object>} Object mit historischen Kursen
 */
export async function getHistoricalRates(baseCurrency, startDate, endDate, targetCurrency) {
  if (!baseCurrency || !startDate || !endDate || !targetCurrency) {
    throw new Error('Alle Parameter müssen angegeben werden');
  }
  
  try {
    const url = `${API_BASE_URL}/${startDate}..${endDate}?from=${baseCurrency}&to=${targetCurrency}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Fehler beim Abrufen der historischen Daten');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fehler beim Abrufen historischer Daten:', error);
    throw error;
  }
}

/**
 * Validiert ob eine Währung gültig ist
 * @param {string} currency - Währungscode
 * @returns {boolean}
 */
export function isValidCurrency(currency) {
  return currency && CURRENCY_INFO.hasOwnProperty(currency);
}

/**
 * Formatiert einen Betrag als Währung
 * @param {number} amount - Betrag
 * @param {string} currency - Währungscode
 * @returns {string} Formatierter String
 */
export function formatCurrency(amount, currency) {
  if (!amount || !currency) return '';
  
  const currencyInfo = CURRENCY_INFO[currency];
  if (!currencyInfo) return `${amount} ${currency}`;
  
  return `${currencyInfo.symbol} ${parseFloat(amount).toFixed(2)}`;
}
