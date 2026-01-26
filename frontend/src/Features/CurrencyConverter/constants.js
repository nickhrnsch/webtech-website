// Währungsinformationen mit Namen, Symbolen und Emoji-Flags
export const CURRENCY_INFO = {
  'EUR': { name: 'Euro', symbol: '€', flag: '🇪🇺' },
  'USD': { name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  'GBP': { name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  'JPY': { name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  'CHF': { name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭' },
  'CAD': { name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
  'AUD': { name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  'CNY': { name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
  'INR': { name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  'SEK': { name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪' },
  'NOK': { name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴' },
  'DKK': { name: 'Danish Krone', symbol: 'kr', flag: '🇩🇰' },
  'PLN': { name: 'Polish Złoty', symbol: 'zł', flag: '🇵🇱' },
  'CZK': { name: 'Czech Koruna', symbol: 'Kč', flag: '🇨🇿' },
  'HUF': { name: 'Hungarian Forint', symbol: 'Ft', flag: '🇭🇺' },
  'RON': { name: 'Romanian Leu', symbol: 'lei', flag: '🇷🇴' },
  'BGN': { name: 'Bulgarian Lev', symbol: 'лв', flag: '🇧🇬' },
  'HRK': { name: 'Croatian Kuna', symbol: 'kn', flag: '🇭🇷' },
  'TRY': { name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷' },
  'ILS': { name: 'Israeli Shekel', symbol: '₪', flag: '🇮🇱' },
  'ZAR': { name: 'South African Rand', symbol: 'R', flag: '🇿🇦' },
  'MXN': { name: 'Mexican Peso', symbol: '$', flag: '🇲🇽' },
  'BRL': { name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
  'SGD': { name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
  'HKD': { name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰' },
  'KRW': { name: 'South Korean Won', symbol: '₩', flag: '🇰🇷' },
  'NZD': { name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿' },
  'THB': { name: 'Thai Baht', symbol: '฿', flag: '🇹🇭' },
  'MYR': { name: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾' },
  'IDR': { name: 'Indonesian Rupiah', symbol: 'Rp', flag: '🇮🇩' },
  'PHP': { name: 'Philippine Peso', symbol: '₱', flag: '🇵🇭' },
};

// Beliebte Währungen für Quick-Access
export const POPULAR_CURRENCIES = ['EUR', 'USD', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD'];

// Default-Währungen
export const DEFAULT_FROM_CURRENCY = 'EUR';
export const DEFAULT_TO_CURRENCY = 'USD';

// API Base URL
export const API_BASE_URL = 'https://api.frankfurter.app';
