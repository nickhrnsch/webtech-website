// Material UI Styles für Currency Converter Komponenten

export const converterCardStyles = {
  width: '100%',
  maxWidth: '100%',
  margin: 0,
  padding: 0,
  boxShadow: 0,
  backgroundColor: 'transparent',
  overflow: 'visible',
  '& .MuiCardContent-root': {
    padding: '16px 8px',
    overflow: 'visible',
    '&:last-child': {
      paddingBottom: '16px',
    },
  },
};

export const amountFieldStyles = {
  marginTop: 1,
  marginBottom: 3,
  '& .MuiOutlinedInput-root': {
    fontSize: '1rem',
  },
};

export const currencyGridStyles = {
  marginBottom: 2,
  alignItems: 'center',
};

export const swapButtonStyles = {
  color: 'primary.main',
  '&:hover': {
    backgroundColor: 'primary.light',
    transform: 'rotate(180deg)',
    transition: 'transform 0.3s ease-in-out',
  },
};

export const resultFieldStyles = {
  marginTop: 1,
  '& .MuiOutlinedInput-root': {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    backgroundColor: 'action.hover',
  },
};

export const dividerStyles = {
  marginY: 2,
};

export const errorAlertStyles = {
  marginTop: 2,
  marginBottom: 2,
};

export const loadingBoxStyles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 3,
};

// ExchangeRateInfo Styles
export const rateInfoBoxStyles = {
  marginTop: 2,
  marginBottom: 2,
  padding: 2,
  backgroundColor: 'background.default',
  borderRadius: 1,
};

export const rateTextStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 1,
};

export const lastUpdatedStyles = {
  marginTop: 1,
  color: 'text.secondary',
  fontSize: '0.875rem',
};

// CurrencySelector Styles
export const selectorStyles = {
  width: '100%',
  minWidth: 0, // Erlaubt dem Autocomplete zu schrumpfen
  '& .MuiOutlinedInput-root': {
    fontSize: '1.1rem',
  },
  '& .MuiAutocomplete-root': {
    width: '100%',
  },
};

export const optionLabelStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
};

export const flagEmojiStyles = {
  fontSize: '1.5rem',
  marginRight: 1,
};

// Favoriten Styles
export const favoritesBoxStyles = {
  marginTop: 1,
  marginBottom: 2,
  display: 'flex',
  flexWrap: 'wrap',
  gap: 0.5,
  alignItems: 'center',
};

export const favoriteChipStyles = {
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: 'primary.light',
  },
};

export const favoriteIconButtonStyles = {
  color: 'warning.main',
  '&:hover': {
    color: 'warning.dark',
    backgroundColor: 'warning.light',
  },
};
