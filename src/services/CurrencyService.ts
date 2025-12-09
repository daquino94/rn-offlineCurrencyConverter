import AsyncStorage from '@react-native-async-storage/async-storage';
import { Currency } from '../types';

const STORAGE_KEYS = {
  CURRENCIES: '@currencies_data',
  LAST_UPDATE: '@last_update',
  FAVORITES: '@favorites',
  LANGUAGE: '@user_language',
};

// API to get exchange rates (example: exchangerate-api.com)
const API_URL = 'https://api.exchangerate-api.com/v4/latest/USD';

export class CurrencyService {
  /**
   * Downloads and updates the currency database from the API
   */
  static async updateCurrencies(): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error('Error downloading data');
      }

      const data = await response.json();

      // Transform data to Currency[] format
      const currencies: Currency[] = Object.entries(data.rates).map(
        ([code, rate]) => ({
          code,
          name: this.getCurrencyName(code),
          symbol: this.getCurrencySymbol(code),
          rate: rate as number,
        })
      );

      // Save to local database
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
      console.error('Error updating currencies:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Loads currencies from local database
   */
  static async loadCurrencies(): Promise<Currency[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CURRENCIES);
      if (data) {
        return JSON.parse(data);
      }

      // If no data, return default currencies
      return this.getDefaultCurrencies();
    } catch (error) {
      console.error('Error loading currencies:', error);
      return this.getDefaultCurrencies();
    }
  }

  /**
   * Gets the last update date
   */
  static async getLastUpdate(): Promise<Date | null> {
    try {
      const dateString = await AsyncStorage.getItem(STORAGE_KEYS.LAST_UPDATE);
      return dateString ? new Date(dateString) : null;
    } catch (error) {
      console.error('Error getting last update date:', error);
      return null;
    }
  }

  /**
   * Converts an amount from one currency to another
   */
  static convert(
    amount: number,
    fromCurrency: Currency,
    toCurrency: Currency
  ): number {
    // Convert to USD as base
    const amountInUSD = amount / fromCurrency.rate;
    // Convert from USD to target currency
    return amountInUSD * toCurrency.rate;
  }

  /**
   * Loads favorite currencies
   */
  static async loadFavorites(): Promise<string[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading favorites:', error);
      return [];
    }
  }

  /**
   * Saves favorite currencies
   */
  static async saveFavorites(favorites: string[]): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.FAVORITES,
        JSON.stringify(favorites)
      );
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }

  /**
   * Adds or removes a currency from favorites
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
   * Loads user's preferred language
   */
  static async loadLanguage(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE);
    } catch (error) {
      console.error('Error loading language:', error);
      return null;
    }
  }

  /**
   * Saves user's preferred language
   */
  static async saveLanguage(language: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  }

  /**
   * Default currencies to use if no data is available
   */
  private static getDefaultCurrencies(): Currency[] {
    return [
      { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1.0 },
      { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.92 },
      { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.79 },
      { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 149.5 },
      { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', rate: 0.88 },
      { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 1.36 },
      { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.53 },
      { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate: 7.24 },
      { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 83.2 },
      { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', rate: 4.97 },
    ];
  }

  /**
   * Gets the full currency name
   */
  private static getCurrencyName(code: string): string {
    const names: { [key: string]: string } = {
      USD: 'US Dollar',
      EUR: 'Euro',
      GBP: 'British Pound',
      JPY: 'Japanese Yen',
      CHF: 'Swiss Franc',
      CAD: 'Canadian Dollar',
      AUD: 'Australian Dollar',
      CNY: 'Chinese Yuan',
      INR: 'Indian Rupee',
      BRL: 'Brazilian Real',
      RUB: 'Russian Ruble',
      KRW: 'South Korean Won',
      MXN: 'Mexican Peso',
      ZAR: 'South African Rand',
      SGD: 'Singapore Dollar',
      HKD: 'Hong Kong Dollar',
      NOK: 'Norwegian Krone',
      SEK: 'Swedish Krona',
      DKK: 'Danish Krone',
      PLN: 'Polish Zloty',
      THB: 'Thai Baht',
      IDR: 'Indonesian Rupiah',
      HUF: 'Hungarian Forint',
      CZK: 'Czech Koruna',
      ILS: 'Israeli Shekel',
      CLP: 'Chilean Peso',
      PHP: 'Philippine Peso',
      AED: 'UAE Dirham',
      SAR: 'Saudi Riyal',
      MYR: 'Malaysian Ringgit',
      TRY: 'Turkish Lira',
      ARS: 'Argentine Peso',
      NZD: 'New Zealand Dollar',
    };
    return names[code] || code;
  }

  /**
   * Gets the currency symbol
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