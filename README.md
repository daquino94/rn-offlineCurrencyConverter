# 💱 CurrencyOffline

**A Complete Offline Currency Converter**
A mobile app that allows real-time currency conversion with full offline support. Exchange rates are saved locally to be always accessible, even without an internet connection.

![React Native](https://img.shields.io/badge/React%20Native-0.82-61DAFB?style=flat&logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat&logo=typescript) ![AsyncStorage](https://img.shields.io/badge/AsyncStorage-1.21-orange?style=flat) ![iOS](https://img.shields.io/badge/iOS-Compatible-000000?style=flat&logo=apple) ![Android](https://img.shields.io/badge/Android-Compatible-3DDC84?style=flat&logo=android)

---

## ✨ Features

- 💱 **Real-Time Conversion**: Convert between 150+ international currencies
- 🔌 **Offline Functionality**: Exchange rates saved locally for offline use
- ⭐ **Favorites Management**: Save your favorite currencies for quick access
- 🌍 **Multi-language Support**: Interface available in Italian and English
- 🌙 **Dark Mode**: Automatic dark theme based on system settings
- 🔄 **Automatic Updates**: Notification when rates haven't been updated for over 48 hours
- 📱 **Modern Design**: Elegant and responsive UI with Material Icons
- 🚀 **Optimized Performance**: Fast loading and smooth navigation
- 💾 **Local Storage**: All data saved locally with AsyncStorage
- 🎯 **Zero Configuration**: Ready to use with predefined exchange rates

---

## 📋 Roadmap

Here are the upcoming features for CurrencyOffline:

| Feature | Status |
|---------|--------|
| **Offline Support** | ✅ |
| **Dark Mode** | ✅ |
| **Multi-language (IT/EN)** | ✅ |
| **Favorites System** | ✅ |
| **Historical Rate Charts** | 📋 |
| **Home Screen Widget** | 📋 |
| **More Languages (ES, FR, DE)** | 📋 |
| **Export/Import Favorites** | 📋 |
| **Exchange Rate Notifications** | 💡 |
| **Integrated Calculator** | 💡 |

**Legend:**
- ✅ Completed
- 🔄 In Development
- 📋 Planned
- 💡 Research Phase

---

## 🌍 Supported Languages

| Language | Status | Completion |
|--------|--------|---------------|
| 🇮🇹 Italian | ✅ Complete | 100% (Native) |
| 🇺🇸 English | ✅ Complete | 100% (Native) |
| 🇪🇸 Spanish | 📋 Planned | 0% |
| 🇫🇷 French | 📋 Planned | 0% |
| 🇩🇪 German | 📋 Planned | 0% |

---

## 🚀 Quick Start

### Prerequisites

Make sure you have installed:

- **Node.js**: 20.0+ and npm
- **React Native CLI**: `npm install -g @react-native-community/cli`
- **Android Studio** (for Android) or **Xcode** (for iOS)

> **Note**: Follow the [official React Native guide](https://reactnative.dev/docs/set-up-your-environment) to set up your development environment.

---

### Option 1: Local Development (Android)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/daquino94/rn-offlineCurrencyConverter.git
   cd rn-offlineCurrencyConverter
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start Metro bundler:**
   ```bash
   npm start
   ```

4. **Run the app on Android:**
   ```bash
   # In a new terminal
   npm run android
   ```

---

### Option 2: Local Development (iOS)

1. **Clone and install** (as above, steps 1-2)

2. **Install CocoaPods dependencies:**
   ```bash
   cd ios
   pod install
   cd ..
   ```

3. **Start Metro bundler:**
   ```bash
   npm start
   ```

4. **Run the app on iOS:**
   ```bash
   # In a new terminal
   npm run ios
   ```

---

### Option 3: Production Build

**Android:**
```bash
cd android
./gradlew assembleRelease
# APK will be in: android/app/build/outputs/apk/release/
```

**iOS:**
```bash
# Open the project in Xcode
open ios/AwesomeProject.xcworkspace
# Then: Product > Archive
```

---

## 🏗️ Architecture

### Project Structure

```
rn-offlineCurrencyConverter/
├── App.tsx                    # Main component with navigation
├── CurrencyConverter.tsx      # Currency converter screen
├── Settings.tsx               # Settings screen
├── CurrencyService.ts         # Service for API and storage
├── i18n.ts                    # Internationalization system
├── Types.ts                   # TypeScript type definitions
├── currencyFlags.ts           # Currency flags
├── android/                   # Android configuration
├── ios/                       # iOS configuration
└── __tests__/                 # Unit tests
```

### Main Components

- **App.tsx**: Manages navigation between screens and global state
- **CurrencyConverter**: Conversion interface with search and favorites
- **Settings**: Rate updates, language management, and information
- **CurrencyService**: Logic for API fetch, conversion, and local storage

---

## 🛠️ Technology Stack

| Technology | Description | Version |
|------------|-------------|----------|
| **React Native** | Cross-platform mobile framework | 0.82.1 |
| **TypeScript** | Type safety and better DX | 5.8+ |
| **AsyncStorage** | Persistent local storage | 1.21.0 |
| **Vector Icons** | Material Design icons | 10.3.0 |
| **ExchangeRate API** | Real-time exchange rate API | v4 |

### APIs Used

- **ExchangeRate-API**: [https://www.exchangerate-api.com](https://www.exchangerate-api.com)
  - Endpoint: `https://api.exchangerate-api.com/v4/latest/USD`
  - Free, no API key required
  - Supports 150+ currencies

---

## ⚙️ Configuration

### Environment Variables

The app doesn't require additional configuration to work. However, you can customize:

**Change the exchange rate API** in `CurrencyService.ts:12`:
```typescript
const API_URL = 'https://api.exchangerate-api.com/v4/latest/USD';
```

### Storage Keys

Data is saved in AsyncStorage with the following keys:

```typescript
{
  CURRENCIES: '@currencies_data',      // Currency database
  LAST_UPDATE: '@last_update',         // Last update timestamp
  FAVORITES: '@favorites',             // Favorite currency codes
  LANGUAGE: '@user_language',          // Preferred language (it/en)
}
```

---

## 🎨 Customization

### Modify Default Currencies

Edit the `getDefaultCurrencies()` method in `CurrencyService.ts:173`:

```typescript
private static getDefaultCurrencies(): Currency[] {
  return [
    { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1.0 },
    { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.92 },
    // Add more currencies...
  ];
}
```

### Add a New Language

1. Add translations in `i18n.ts`:
   ```typescript
   export const translations: Record<string, Translations> = {
     it: { /* Italian translations */ },
     en: { /* English translations */ },
     es: { /* Spanish translations */ },  // New language
   };
   ```

2. Update the `Settings.tsx` component to include the new option

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Ways to Contribute

- 🌍 **Translations**: Help translate the app into new languages
- 📝 **UI/UX Improvements**: Suggest or implement design improvements
- 🐛 **Bug Reports**: Report issues you encounter
- 💡 **Feature Requests**: Propose new features
- 🔧 **Code**: Submit pull requests with improvements

### Development Workflow

1. **Fork** the repository
2. **Create** a branch: `git checkout -b feature/amazing-feature`
3. **Commit** changes: `git commit -m 'Add amazing feature'`
4. **Test** thoroughly
5. **Push** to branch: `git push origin feature/amazing-feature`
6. **Open** a Pull Request

### Code Standards

- Use **TypeScript** for type safety
- Follow configured **ESLint** conventions
- Format code with **Prettier**
- Add tests for new features

---

## 🧪 Testing

Run tests with:

```bash
npm test
```

Run the linter:

```bash
npm run lint
```

---

## 📱 Screenshots

*Coming soon - Screenshots of the app in action*

---

## 📄 License

This project is distributed under the **MIT** license - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **[ExchangeRate-API](https://www.exchangerate-api.com)**: For free exchange rates
- **[React Native Community](https://github.com/react-native-community)**: For tools and libraries
- **[Material Icons](https://materialdesignicons.com)**: For the icons used in the app
- **All contributors**: Everyone who has contributed to improving this project

---

## 📞 Support

- 📖 **Documentation**: Read the code and inline comments
- 🐛 **Issues**: Report problems on [GitHub Issues](https://github.com/daquino94/rn-offlineCurrencyConverter/issues)
- 💬 **Discussions**: Participate in discussions in the GitHub Discussions section
- 📧 **Contact**: Contact maintainers for questions

---

## 🌟 If you like this project

If you find **CurrencyOffline** useful, consider:

- ⭐ Starring the repository
- 🍴 Forking for your projects
- 🐦 Sharing with other developers
- 🤝 Contributing with code or translations

---

**Made with ❤️ by the React Native Community**
