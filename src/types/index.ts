/**
 * Rappresenta una valuta con i suoi dati
 */
export interface Currency {
  /** Codice ISO della valuta (es. USD, EUR) */
  code: string;
  
  /** Nome completo della valuta */
  name: string;
  
  /** Simbolo della valuta (es. $, €) */
  symbol: string;
  
  /** Tasso di cambio rispetto a USD */
  rate: number;
}

/**
 * Risultato di un'operazione di aggiornamento
 */
export interface UpdateResult {
  success: boolean;
  error?: string;
}