/**
 * Mappa completa codici valuta → emoji bandiere
 * 150+ valute coperte
 */
export const currencyFlags: Record<string, string> = {
  // Americhe
  USD: '🇺🇸', CAD: '🇨🇦', MXN: '🇲🇽', BRL: '🇧🇷', ARS: '🇦🇷',
  CLP: '🇨🇱', COP: '🇨🇴', PEN: '🇵🇪', UYU: '🇺🇾', VES: '🇻🇪',
  VEF: '🇻🇪', BOB: '🇧🇴', PYG: '🇵🇾', CRC: '🇨🇷', GTQ: '🇬🇹',
  HNL: '🇭🇳', NIO: '🇳🇮', PAB: '🇵🇦', DOP: '🇩🇴', HTG: '🇭🇹',
  JMD: '🇯🇲', TTD: '🇹🇹', BBD: '🇧🇧', BSD: '🇧🇸', BZD: '🇧🇿',
  XCD: '🇦🇬',
  
  // Europa
  EUR: '🇪🇺', GBP: '🇬🇧', CHF: '🇨🇭', SEK: '🇸🇪', NOK: '🇳🇴',
  DKK: '🇩🇰', ISK: '🇮🇸', PLN: '🇵🇱', CZK: '🇨🇿', HUF: '🇭🇺',
  RON: '🇷🇴', BGN: '🇧🇬', HRK: '🇭🇷', RSD: '🇷🇸', BAM: '🇧🇦',
  MKD: '🇲🇰', ALL: '🇦🇱', RUB: '🇷🇺', UAH: '🇺🇦', BYN: '🇧🇾',
  MDL: '🇲🇩', GEL: '🇬🇪', AMD: '🇦🇲', AZN: '🇦🇿', TRY: '🇹🇷',
  
  // Asia
  JPY: '🇯🇵', CNY: '🇨🇳', INR: '🇮🇳', KRW: '🇰🇷', SGD: '🇸🇬',
  HKD: '🇭🇰', TWD: '🇹🇼', THB: '🇹🇭', MYR: '🇲🇾', IDR: '🇮🇩',
  PHP: '🇵🇭', VND: '🇻🇳', PKR: '🇵🇰', BDT: '🇧🇩', LKR: '🇱🇰',
  NPR: '🇳🇵', AFN: '🇦🇫', MMK: '🇲🇲', KHR: '🇰🇭', LAK: '🇱🇦',
  BND: '🇧🇳', MNT: '🇲🇳', KZT: '🇰🇿', UZS: '🇺🇿', KGS: '🇰🇬',
  TJS: '🇹🇯', TMT: '🇹🇲',
  
  // Medio Oriente
  SAR: '🇸🇦', AED: '🇦🇪', ILS: '🇮🇱', QAR: '🇶🇦', KWD: '🇰🇼',
  BHD: '🇧🇭', OMR: '🇴🇲', JOD: '🇯🇴', LBP: '🇱🇧', SYP: '🇸🇾',
  IQD: '🇮🇶', IRR: '🇮🇷', YER: '🇾🇪',
  
  // Africa
  ZAR: '🇿🇦', EGP: '🇪🇬', NGN: '🇳🇬', KES: '🇰🇪', GHS: '🇬🇭',
  MAD: '🇲🇦', TND: '🇹🇳', DZD: '🇩🇿', LYD: '🇱🇾', ETB: '🇪🇹',
  UGX: '🇺🇬', TZS: '🇹🇿', RWF: '🇷🇼', ZMW: '🇿🇲', BWP: '🇧🇼',
  MUR: '🇲🇺', SCR: '🇸🇨', MGA: '🇲🇬', XOF: '🇸🇳', XAF: '🇨🇲',
  AOA: '🇦🇴', MZN: '🇲🇿', NAD: '🇳🇦', SZL: '🇸🇿', LSL: '🇱🇸',
  GMD: '🇬🇲', GNF: '🇬🇳', SLL: '🇸🇱', LRD: '🇱🇷', CDF: '🇨🇩',
  BIF: '🇧🇮', SOS: '🇸🇴', DJF: '🇩🇯', ERN: '🇪🇷', SDG: '🇸🇩',
  SSP: '🇸🇸', MWK: '🇲🇼', CVE: '🇨🇻', STN: '🇸🇹', KMF: '🇰🇲',
  
  // Oceania
  AUD: '🇦🇺', NZD: '🇳🇿', FJD: '🇫🇯', PGK: '🇵🇬', WST: '🇼🇸',
  TOP: '🇹🇴', VUV: '🇻🇺', SBD: '🇸🇧',
  
  // Extra
  BTC: '₿', ETH: 'Ξ', XAU: '🥇', XAG: '⚪',
};

export const getCurrencyFlag = (currencyCode: string): string => {
  return currencyFlags[currencyCode?.toUpperCase()] || '💱';
};

export const hasCurrencyFlag = (currencyCode: string): boolean => {
  return currencyCode?.toUpperCase() in currencyFlags;
};

export const getCurrencyCountryCode = (currencyCode: string): string => {
  const code = currencyCode?.toUpperCase();
  return code?.substring(0, 2) || 'UN';
};