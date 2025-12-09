# 💱 CurrencyOffline

**Un Convertitore di Valute Offline Completo**
Un'app mobile che permette di convertire valute in tempo reale con supporto offline completo. I tassi di cambio vengono salvati localmente per essere sempre accessibili, anche senza connessione internet.

![React Native](https://img.shields.io/badge/React%20Native-0.82-61DAFB?style=flat&logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat&logo=typescript) ![AsyncStorage](https://img.shields.io/badge/AsyncStorage-1.21-orange?style=flat) ![iOS](https://img.shields.io/badge/iOS-Compatible-000000?style=flat&logo=apple) ![Android](https://img.shields.io/badge/Android-Compatible-3DDC84?style=flat&logo=android)

---

## ✨ Features

- 💱 **Conversione in Tempo Reale**: Converti tra oltre 150+ valute internazionali
- 🔌 **Funzionamento Offline**: I tassi di cambio vengono salvati localmente per l'uso offline
- ⭐ **Gestione Preferiti**: Salva le tue valute preferite per un accesso rapido
- 🌍 **Supporto Multi-lingua**: Interfaccia disponibile in Italiano e Inglese
- 🌙 **Dark Mode**: Tema scuro automatico basato sulle impostazioni di sistema
- 🔄 **Aggiornamento Automatico**: Notifica quando i tassi non sono stati aggiornati da più di 48 ore
- 📱 **Design Moderno**: UI elegante e responsive con Material Icons
- 🚀 **Performance Ottimizzate**: Caricamento veloce e navigazione fluida
- 💾 **Storage Locale**: Tutti i dati salvati localmente con AsyncStorage
- 🎯 **Zero Configurazione**: Pronta all'uso con tassi di cambio predefiniti

---

## 📋 Roadmap

Ecco le funzionalità in arrivo per CurrencyOffline:

| Feature | Status |
|---------|--------|
| **Supporto Offline** | ✅ |
| **Dark Mode** | ✅ |
| **Multi-lingua (IT/EN)** | ✅ |
| **Sistema Preferiti** | ✅ |
| **Grafici Storici Tassi** | 📋 |
| **Widget Home Screen** | 📋 |
| **Più Lingue (ES, FR, DE)** | 📋 |
| **Export/Import Preferiti** | 📋 |
| **Notifiche Tassi Cambio** | 💡 |
| **Calcolatrice Integrata** | 💡 |

**Legenda:**
- ✅ Completato
- 🔄 In Sviluppo
- 📋 Pianificato
- 💡 Fase di Ricerca

---

## 🌍 Lingue Supportate

| Lingua | Status | Completamento |
|--------|--------|---------------|
| 🇮🇹 Italiano | ✅ Completo | 100% (Nativo) |
| 🇺🇸 Inglese | ✅ Completo | 100% (Nativo) |
| 🇪🇸 Spagnolo | 📋 Pianificato | 0% |
| 🇫🇷 Francese | 📋 Pianificato | 0% |
| 🇩🇪 Tedesco | 📋 Pianificato | 0% |

---

## 🚀 Quick Start

### Prerequisiti

Assicurati di avere installato:

- **Node.js**: 20.0+ e npm
- **React Native CLI**: `npm install -g @react-native-community/cli`
- **Android Studio** (per Android) o **Xcode** (per iOS)

> **Nota**: Segui la [guida ufficiale React Native](https://reactnative.dev/docs/set-up-your-environment) per configurare il tuo ambiente di sviluppo.

---

### Opzione 1: Sviluppo Locale (Android)

1. **Clona la repository:**
   ```bash
   git clone https://github.com/daquino94/rn-offlineCurrencyConverter.git
   cd rn-offlineCurrencyConverter
   ```

2. **Installa le dipendenze:**
   ```bash
   npm install
   ```

3. **Avvia Metro bundler:**
   ```bash
   npm start
   ```

4. **Avvia l'app su Android:**
   ```bash
   # In un nuovo terminale
   npm run android
   ```

---

### Opzione 2: Sviluppo Locale (iOS)

1. **Clona e installa** (come sopra, step 1-2)

2. **Installa i Pod di CocoaPods:**
   ```bash
   cd ios
   pod install
   cd ..
   ```

3. **Avvia Metro bundler:**
   ```bash
   npm start
   ```

4. **Avvia l'app su iOS:**
   ```bash
   # In un nuovo terminale
   npm run ios
   ```

---

### Opzione 3: Build di Produzione

**Android:**
```bash
cd android
./gradlew assembleRelease
# L'APK sarà in: android/app/build/outputs/apk/release/
```

**iOS:**
```bash
# Apri il progetto in Xcode
open ios/AwesomeProject.xcworkspace
# Poi: Product > Archive
```

---

## 🏗️ Architettura

### Struttura del Progetto

```
rn-offlineCurrencyConverter/
├── App.tsx                    # Componente principale con navigazione
├── CurrencyConverter.tsx      # Schermata convertitore valute
├── Settings.tsx               # Schermata impostazioni
├── CurrencyService.ts         # Service per API e storage
├── i18n.ts                    # Sistema internazionalizzazione
├── Types.ts                   # TypeScript type definitions
├── currencyFlags.ts           # Bandiere valute
├── android/                   # Configurazione Android
├── ios/                       # Configurazione iOS
└── __tests__/                 # Test unitari
```

### Componenti Principali

- **App.tsx**: Gestisce la navigazione tra le schermate e lo stato globale
- **CurrencyConverter**: Interfaccia di conversione con ricerca e preferiti
- **Settings**: Aggiornamento tassi, gestione lingua e informazioni
- **CurrencyService**: Logica per fetch API, conversione e storage locale

---

## 🛠️ Stack Tecnologico

| Tecnologia | Descrizione | Versione |
|------------|-------------|----------|
| **React Native** | Framework mobile cross-platform | 0.82.1 |
| **TypeScript** | Type safety e migliore DX | 5.8+ |
| **AsyncStorage** | Storage locale persistente | 1.21.0 |
| **Vector Icons** | Icone Material Design | 10.3.0 |
| **ExchangeRate API** | API per tassi di cambio in tempo reale | v4 |

### API Utilizzate

- **ExchangeRate-API**: [https://www.exchangerate-api.com](https://www.exchangerate-api.com)
  - Endpoint: `https://api.exchangerate-api.com/v4/latest/USD`
  - Gratuito, nessuna API key richiesta
  - Supporta 150+ valute

---

## ⚙️ Configurazione

### Variabili d'Ambiente

L'app non richiede configurazione aggiuntiva per funzionare. Tuttavia, puoi personalizzare:

**Modifica l'API dei tassi di cambio** in `CurrencyService.ts:12`:
```typescript
const API_URL = 'https://api.exchangerate-api.com/v4/latest/USD';
```

### Storage Keys

I dati vengono salvati in AsyncStorage con le seguenti chiavi:

```typescript
{
  CURRENCIES: '@currencies_data',      // Database valute
  LAST_UPDATE: '@last_update',         // Timestamp ultimo aggiornamento
  FAVORITES: '@favorites',             // Codici valute preferite
  LANGUAGE: '@user_language',          // Lingua preferita (it/en)
}
```

---

## 🎨 Personalizzazione

### Modificare le Valute Predefinite

Modifica il metodo `getDefaultCurrencies()` in `CurrencyService.ts:173`:

```typescript
private static getDefaultCurrencies(): Currency[] {
  return [
    { code: 'USD', name: 'Dollaro Americano', symbol: '$', rate: 1.0 },
    { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.92 },
    // Aggiungi altre valute...
  ];
}
```

### Aggiungere una Nuova Lingua

1. Aggiungi le traduzioni in `i18n.ts`:
   ```typescript
   export const translations: Record<string, Translations> = {
     it: { /* traduzioni italiane */ },
     en: { /* traduzioni inglesi */ },
     es: { /* traduzioni spagnole */ },  // Nuova lingua
   };
   ```

2. Aggiorna il componente `Settings.tsx` per includere la nuova opzione

---

## 🤝 Come Contribuire

Contributi sono benvenuti! Ecco come puoi aiutare:

### Modi per Contribuire

- 🌍 **Traduzioni**: Aiuta a tradurre l'app in nuove lingue
- 📝 **Miglioramenti UI/UX**: Suggerisci o implementa miglioramenti al design
- 🐛 **Bug Reports**: Segnala problemi che riscontri
- 💡 **Feature Requests**: Proponi nuove funzionalità
- 🔧 **Codice**: Invia pull request con miglioramenti

### Workflow di Sviluppo

1. **Fork** la repository
2. **Crea** un branch: `git checkout -b feature/amazing-feature`
3. **Committa** le modifiche: `git commit -m 'Add amazing feature'`
4. **Testa** accuratamente le modifiche
5. **Push** al branch: `git push origin feature/amazing-feature`
6. **Apri** una Pull Request

### Standard di Codice

- Usa **TypeScript** per type safety
- Segui le convenzioni **ESLint** configurate
- Formatta il codice con **Prettier**
- Aggiungi test per nuove funzionalità

---

## 🧪 Testing

Esegui i test con:

```bash
npm test
```

Esegui il linter:

```bash
npm run lint
```

---

## 📱 Screenshot

*Coming soon - Screenshots dell'app in azione*

---

## 📄 Licenza

Questo progetto è distribuito sotto licenza **MIT** - vedi il file [LICENSE](LICENSE) per i dettagli.

---

## 🙏 Riconoscimenti

- **[ExchangeRate-API](https://www.exchangerate-api.com)**: Per i tassi di cambio gratuiti
- **[React Native Community](https://github.com/react-native-community)**: Per gli strumenti e le librerie
- **[Material Icons](https://materialdesignicons.com)**: Per le icone utilizzate nell'app
- **Tutti i contributori**: Chiunque abbia contribuito a migliorare questo progetto

---

## 📞 Supporto

- 📖 **Documentazione**: Leggi il codice e i commenti inline
- 🐛 **Issues**: Segnala problemi su [GitHub Issues](https://github.com/daquino94/rn-offlineCurrencyConverter/issues)
- 💬 **Discussioni**: Partecipa alle discussioni nella sezione GitHub Discussions
- 📧 **Contatti**: Contatta i maintainer per domande

---

## 🌟 Se ti piace questo progetto

Se trovi utile **CurrencyOffline**, considera di:

- ⭐ Dare una stella alla repository
- 🍴 Fare fork per i tuoi progetti
- 🐦 Condividere con altri sviluppatori
- 🤝 Contribuire con codice o traduzioni

---

**Made with ❤️ by the React Native Community**
