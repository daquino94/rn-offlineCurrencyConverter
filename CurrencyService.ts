import AsyncStorage from '@react-native-async-storage/async-storage';
import { Currency } from './types';

const STORAGE_KEYS = {
  CURRENCIES: '@currencies_data',
  LAST_UPDATE: '@last_update',
  FAVORITES: '@favorites',
  LANGUAGE: '@user_language',
};

// API per ottenere i tassi di cambio (esempio: exchangerate-api.com)
const API_URL = 'https://api.exchangerate-api.com/v4/latest/USD';

export class CurrencyService {
  /**
   * Scarica e aggiorna il database delle valute dall'API
   */
  static async updateCurrencies(): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error('Errore nel download dei dati');
      }

      const data = await response.json();
      
      // Trasforma i dati in formato Currency[]
      const currencies: Currency[] = Object.entries(data.rates).map(
        ([code, rate]) => ({
          code,
          name: this.getCurrencyName(code),
          symbol: this.getCurrencySymbol(code),
          rate: rate as number,
        })
      );

      // Salva nel database locale
      await AsyncStorage.setItem(
        STORAGE_KEYS.CURRENCIES,
        JSON.stringify(currencies)
      );
      await AsyncStorage.setItem(
        STORAGE_KEYS.LAST_UPDATE,
        new Date().toISOString()
      );

      return { success: true };
    } catch (error) {
      console.error('Errore aggiornamento valute:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Errore sconosciuto' 
      };
    }
  }

  /**
   * Carica le valute dal database locale
   */
  static async loadCurrencies(): Promise<Currency[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CURRENCIES);
      if (data) {
        return JSON.parse(data);
      }
      
      // Se non ci sono dati, restituisce valute di default
      return this.getDefaultCurrencies();
    } catch (error) {
      console.error('Errore caricamento valute:', error);
      return this.getDefaultCurrencies();
    }
  }

  /**
   * Ottiene la data dell'ultimo aggiornamento
   */
  static async getLastUpdate(): Promise<Date | null> {
    try {
      const dateString = await AsyncStorage.getItem(STORAGE_KEYS.LAST_UPDATE);
      return dateString ? new Date(dateString) : null;
    } catch (error) {
      console.error('Errore recupero ultima data:', error);
      return null;
    }
  }

  /**
   * Converte un importo da una valuta a un'altra
   */
  static convert(
    amount: number,
    fromCurrency: Currency,
    toCurrency: Currency
  ): number {
    // Converti in USD come base
    const amountInUSD = amount / fromCurrency.rate;
    // Converti da USD alla valuta di destinazione
    return amountInUSD * toCurrency.rate;
  }

  /**
   * Carica le valute preferite
   */
  static async loadFavorites(): Promise<string[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Errore caricamento preferiti:', error);
      return [];
    }
  }

  /**
   * Salva le valute preferite
   */
  static async saveFavorites(favorites: string[]): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.FAVORITES,
        JSON.stringify(favorites)
      );
    } catch (error) {
      console.error('Errore salvataggio preferiti:', error);
    }
  }

  /**
   * Aggiunge o rimuove una valuta dai preferiti
   */
  static async toggleFavorite(code: string): Promise<string[]> {
    const favorites = await this.loadFavorites();
    const index = favorites.indexOf(code);

    if (index > -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push(code);
    }

    await this.saveFavorites(favorites);
    return favorites;
  }

  /**
   * Carica la lingua preferita dell'utente
   */
  static async loadLanguage(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE);
    } catch (error) {
      console.error('Errore caricamento lingua:', error);
      return null;
    }
  }

  /**
   * Salva la lingua preferita dell'utente
   */
  static async saveLanguage(language: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
    } catch (error) {
      console.error('Errore salvataggio lingua:', error);
    }
  }

  /**
   * Valute di default da usare se non ci sono dati
   */
  private static getDefaultCurrencies(): Currency[] {
    return [
      { code: 'USD', name: 'Dollaro Americano', symbol: '$', rate: 1.0 },
      { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.92 },
      { code: 'GBP', name: 'Sterlina Britannica', symbol: '£', rate: 0.79 },
      { code: 'JPY', name: 'Yen Giapponese', symbol: '¥', rate: 149.5 },
      { code: 'CHF', name: 'Franco Svizzero', symbol: 'CHF', rate: 0.88 },
      { code: 'CAD', name: 'Dollaro Canadese', symbol: 'C$', rate: 1.36 },
      { code: 'AUD', name: 'Dollaro Australiano', symbol: 'A$', rate: 1.53 },
      { code: 'CNY', name: 'Yuan Cinese', symbol: '¥', rate: 7.24 },
      { code: 'INR', name: 'Rupia Indiana', symbol: '₹', rate: 83.2 },
      { code: 'BRL', name: 'Real Brasiliano', symbol: 'R$', rate: 4.97 },
    ];
  }

  /**
   * Ottiene il nome completo della valuta
   */
  private static getCurrencyName(code: string): string {
    const names: { [key: string]: string } = {
      USD: 'Dollaro Americano',
      EUR: 'Euro',
      GBP: 'Sterlina Britannica',
      JPY: 'Yen Giapponese',
      CHF: 'Franco Svizzero',
      CAD: 'Dollaro Canadese',
      AUD: 'Dollaro Australiano',
      CNY: 'Yuan Cinese',
      INR: 'Rupia Indiana',
      BRL: 'Real Brasiliano',
      RUB: 'Rublo Russo',
      KRW: 'Won Sud Coreano',
      MXN: 'Peso Messicano',
      ZAR: 'Rand Sudafricano',
      SGD: 'Dollaro di Singapore',
      HKD: 'Dollaro di Hong Kong',
      NOK: 'Corona Norvegese',
      SEK: 'Corona Svedese',
      DKK: 'Corona Danese',
      PLN: 'Zloty Polacco',
      THB: 'Baht Thailandese',
      IDR: 'Rupia Indonesiana',
      HUF: 'Fiorino Ungherese',
      CZK: 'Corona Ceca',
      ILS: 'Shekel Israeliano',
      CLP: 'Peso Cileno',
      PHP: 'Peso Filippino',
      AED: 'Dirham degli Emirati',
      SAR: 'Riyal Saudita',
      MYR: 'Ringgit Malese',
      TRY: 'Lira Turca',
      ARS: 'Peso Argentino',
      NZD: 'Dollaro Neozelandese',
    };
    return names[code] || code;
  }

  /**
   * Ottiene il simbolo della valuta
   */
  private static getCurrencySymbol(code: string): string {
    const symbols: { [key: string]: string } = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥',
      CHF: 'CHF',
      CAD: 'C$',
      AUD: 'A$',
      CNY: '¥',
      INR: '₹',
      BRL: 'R$',
      RUB: '₽',
      KRW: '₩',
      MXN: '$',
      ZAR: 'R',
      SGD: 'S$',
      HKD: 'HK$',
      NOK: 'kr',
      SEK: 'kr',
      DKK: 'kr',
      PLN: 'zł',
      THB: '฿',
      IDR: 'Rp',
      ILS: '₪',
      PHP: '₱',
      AED: 'د.إ',
      SAR: '﷼',
      TRY: '₺',
      NZD: 'NZ$',
    };
    return symbols[code] || code;
  }
}