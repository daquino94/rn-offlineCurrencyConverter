import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  useColorScheme,
  Alert,
  Platform,
  NativeModules,
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { CurrencyConverter } from './src/screens/converter/CurrencyConverter';
import { Settings } from './src/screens/settings/Settings';
import { CurrencyService } from './src/services/CurrencyService';
import { Currency } from './src/types';
import { useTranslations } from './src/localization/i18n';

type Screen = 'converter' | 'settings';

const getDeviceLocale = (): string => {
  const locale =
    Platform.OS === 'ios'
      ? NativeModules.SettingsManager?.settings?.AppleLocale ||
        NativeModules.SettingsManager?.settings?.AppleLanguages?.[0]
      : NativeModules.I18nManager?.localeIdentifier;
  
  if (locale) {
    return locale.startsWith('it') ? 'it' : 'en';
  }
  return 'en';
};

export default function App() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [locale, setLocale] = useState(getDeviceLocale());
  const t = useTranslations(locale);

  const [currentScreen, setCurrentScreen] = useState<Screen>('converter');
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    setIsLoading(true);

    const [loadedCurrencies, loadedFavorites, savedLanguage] = await Promise.all([
      CurrencyService.loadCurrencies(),
      CurrencyService.loadFavorites(),
      CurrencyService.loadLanguage(),
    ]);

    // If there's a saved language, use it. Otherwise use device language
    if (savedLanguage) {
      setLocale(savedLanguage);
    }

    setCurrencies(loadedCurrencies);
    setFavorites(loadedFavorites);

    await checkUpdateRequired();

    setIsLoading(false);
  };

  const checkUpdateRequired = async () => {
    const lastUpdate = await CurrencyService.getLastUpdate();
    
    if (!lastUpdate) {
      showUpdateAlert();
      return;
    }

    const now = new Date();
    const hoursSinceUpdate = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);
    
    if (hoursSinceUpdate > 48) {
      showUpdateAlert();
    }
  };

  const showUpdateAlert = () => {
    Alert.alert(
      t.updateRequired,
      t.updateRequiredMessage,
      [
        {
          text: t.later,
          style: 'cancel',
        },
        {
          text: t.updateNow,
          onPress: () => {
            setCurrentScreen('settings');
          },
        },
      ]
    );
  };

  const handleToggleFavorite = async (code: string) => {
    const updatedFavorites = await CurrencyService.toggleFavorite(code);
    setFavorites(updatedFavorites);
  };

  const handleCurrenciesUpdate = async () => {
    const updatedCurrencies = await CurrencyService.loadCurrencies();
    setCurrencies(updatedCurrencies);
  };

  const handleLanguageChange = async (newLanguage: string) => {
    await CurrencyService.saveLanguage(newLanguage);
    setLocale(newLanguage);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={[styles.loadingText, isDark && styles.textDark]}>
            {t.appTitle}...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'} 
        backgroundColor={isDark ? '#1F2937' : '#6366F1'} 
      />
      
      <View style={[styles.header, isDark && styles.headerDark]}>
        <Text style={styles.headerTitle}>{t.appTitle}</Text>
      </View>

      <View style={styles.content}>
        {currentScreen === 'converter' ? (
          <CurrencyConverter
            currencies={currencies}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            translations={t}
          />
        ) : (
          <Settings
            onUpdate={handleCurrenciesUpdate}
            translations={t}
            currentLanguage={locale}
            onLanguageChange={handleLanguageChange}
          />
        )}
      </View>

      <View style={[styles.tabBar, isDark && styles.tabBarDark]}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => setCurrentScreen('converter')}
        >
          <View
            style={[
              styles.tabIconContainer,
              currentScreen === 'converter' && styles.tabIconContainerActive,
              isDark && currentScreen === 'converter' && styles.tabIconContainerActiveDark,
            ]}
          >
            <MaterialIcons 
              name="swap-vert" 
              size={26} 
              color={currentScreen === 'converter' ? '#6366F1' : (isDark ? '#6B7280' : '#9CA3AF')}
            />
          </View>
          <Text
            style={[
              styles.tabLabel,
              currentScreen === 'converter' && styles.tabLabelActive,
              isDark && styles.tabLabelDark,
            ]}
          >
            {t.converter}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tab}
          onPress={() => setCurrentScreen('settings')}
        >
          <View
            style={[
              styles.tabIconContainer,
              currentScreen === 'settings' && styles.tabIconContainerActive,
              isDark && currentScreen === 'settings' && styles.tabIconContainerActiveDark,
            ]}
          >
            <MaterialIcons 
              name="settings" 
              size={26} 
              color={currentScreen === 'settings' ? '#6366F1' : (isDark ? '#6B7280' : '#9CA3AF')}
            />
          </View>
          <Text
            style={[
              styles.tabLabel,
              currentScreen === 'settings' && styles.tabLabelActive,
              isDark && styles.tabLabelDark,
            ]}
          >
            {t.settings}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FE',
  },
  containerDark: {
    backgroundColor: '#111827',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 20,
    color: '#6B7280',
    fontWeight: '600',
    marginTop: 16,
  },
  textDark: {
    color: '#9CA3AF',
  },
  header: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerDark: {
    backgroundColor: '#1F2937',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingTop: 8,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  tabBarDark: {
    backgroundColor: '#1F2937',
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  tabIconContainerActive: {
    backgroundColor: '#EEF2FF',
    borderRadius: 26,
  },
  tabIconContainerActiveDark: {
    backgroundColor: '#312E81',
    borderRadius: 26,
  },
  tabLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  tabLabelDark: {
    color: '#6B7280',
  },
  tabLabelActive: {
    color: '#6366F1',
    fontWeight: '700',
  },
});