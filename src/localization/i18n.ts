export interface Translations {
  // Header
  appTitle: string;
  offlineMode: string;

  // Converter
  amount: string;
  from: string;
  to: string;
  result: string;
  selectCurrency: string;
  searchCurrency: string;
  favorites: string;

  // Settings
  settings: string;
  database: string;
  lastUpdate: string;
  updateRates: string;
  updateSuccess: string;
  updateSuccessMessage: string;
  updateError: string;
  updateErrorMessage: string;
  updateNote: string;
  information: string;
  version: string;
  offlineActive: string;
  neverUpdated: string;
  justNow: string;
  minutesAgo: string;
  hoursAgo: string;
  yesterday: string;
  daysAgo: string;
  language: string;
  languageTitle: string;
  italian: string;
  english: string;
  systemLanguage: string;

  // Tab Bar
  converter: string;

  // Alert
  updateRequired: string;
  updateRequiredMessage: string;
  updateNow: string;
  later: string;

  // Common
  ok: string;
  cancel: string;
  close: string;
}

export const translations: Record<string, Translations> = {
  it: {
    appTitle: 'Valute',
    offlineMode: 'Offline',
    amount: 'IMPORTO',
    from: 'DA',
    to: 'A',
    result: 'RISULTATO',
    selectCurrency: 'Seleziona Valuta',
    searchCurrency: 'Cerca...',
    favorites: '★ Preferite',
    settings: 'Impostazioni',
    database: 'Database Valute',
    lastUpdate: 'Ultimo aggiornamento',
    updateRates: 'Aggiorna Tassi',
    updateSuccess: 'Completato',
    updateSuccessMessage: 'Tassi di cambio aggiornati!',
    updateError: 'Errore',
    updateErrorMessage: 'Impossibile aggiornare. Riprova più tardi.',
    updateNote: 'I tassi vengono salvati localmente per uso offline.',
    information: 'Informazioni',
    version: 'Versione',
    offlineActive: '✓ Attiva',
    neverUpdated: 'Mai aggiornato',
    justNow: 'Proprio ora',
    minutesAgo: 'minuti fa',
    hoursAgo: 'ore fa',
    yesterday: 'Ieri',
    daysAgo: 'giorni fa',
    language: 'Lingua',
    languageTitle: 'Lingua App',
    italian: 'Italiano',
    english: 'Inglese',
    systemLanguage: 'Sistema',
    converter: 'Convertitore',
    updateRequired: 'Aggiornamento Richiesto',
    updateRequiredMessage: 'I tassi non vengono aggiornati da più di 48 ore. Aggiorna per conversioni accurate.',
    updateNow: 'Aggiorna Ora',
    later: 'Più Tardi',
    ok: 'OK',
    cancel: 'Annulla',
    close: 'Chiudi',
  },
  en: {
    appTitle: 'Currency',
    offlineMode: 'Offline',
    amount: 'AMOUNT',
    from: 'FROM',
    to: 'TO',
    result: 'RESULT',
    selectCurrency: 'Select Currency',
    searchCurrency: 'Search...',
    favorites: '★ Favorites',
    settings: 'Settings',
    database: 'Currency Database',
    lastUpdate: 'Last update',
    updateRates: 'Update Rates',
    updateSuccess: 'Success',
    updateSuccessMessage: 'Exchange rates updated!',
    updateError: 'Error',
    updateErrorMessage: 'Unable to update. Try again later.',
    updateNote: 'Rates are saved locally for offline use.',
    information: 'Information',
    version: 'Version',
    offlineActive: '✓ Active',
    neverUpdated: 'Never updated',
    justNow: 'Just now',
    minutesAgo: 'minutes ago',
    hoursAgo: 'hours ago',
    yesterday: 'Yesterday',
    daysAgo: 'days ago',
    language: 'Language',
    languageTitle: 'App Language',
    italian: 'Italian',
    english: 'English',
    systemLanguage: 'System',
    converter: 'Converter',
    updateRequired: 'Update Required',
    updateRequiredMessage: 'Rates haven\'t been updated for over 48 hours. Update for accurate conversions.',
    updateNow: 'Update Now',
    later: 'Later',
    ok: 'OK',
    cancel: 'Cancel',
    close: 'Close',
  },
};

// Hook per ottenere le traduzioni
export const useTranslations = (locale: string = 'it'): Translations => {
  return translations[locale] || translations.it;
};