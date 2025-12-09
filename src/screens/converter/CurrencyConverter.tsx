import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  useColorScheme,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Currency } from '../../types';
import { CurrencyService } from '../../services/CurrencyService';
import { Translations } from '../../localization/i18n';
import { getCurrencyFlag } from '../../utils/currencyFlags';

interface CurrencyConverterProps {
  currencies: Currency[];
  favorites: string[];
  onToggleFavorite: (code: string) => void;
  translations: Translations;
}

export const CurrencyConverter: React.FC<CurrencyConverterProps> = ({
  currencies,
  favorites,
  onToggleFavorite,
  translations: t,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [amount, setAmount] = useState<string>('1');
  const [fromCurrency, setFromCurrency] = useState<Currency | null>(null);
  const [toCurrency, setToCurrency] = useState<Currency | null>(null);
  const [result, setResult] = useState<number>(0);
  const [showFromModal, setShowFromModal] = useState(false);
  const [showToModal, setShowToModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    loadDefaultCurrencies();
  }, [currencies]);

  const loadDefaultCurrencies = async () => {
    if (currencies.length > 0) {
      setIsInitializing(true);
      
      // Prova a caricare l'ultima selezione
      try {
        const lastFromCode = await AsyncStorage.getItem('@last_from_currency');
        const lastToCode = await AsyncStorage.getItem('@last_to_currency');
        
        if (lastFromCode && lastToCode) {
          const lastFrom = currencies.find(c => c.code === lastFromCode);
          const lastTo = currencies.find(c => c.code === lastToCode);
          
          if (lastFrom && lastTo) {
            setFromCurrency(lastFrom);
            setToCurrency(lastTo);
            setIsInitializing(false);
            return;
          }
        }
      } catch (error) {
        console.log('Error loading last selection:', error);
      }

      // Fallback to USD/EUR if no saved selection
      const usd = currencies.find(c => c.code === 'USD');
      const eur = currencies.find(c => c.code === 'EUR');
      setFromCurrency(usd || currencies[0]);
      setToCurrency(eur || currencies[1]);
      setIsInitializing(false);
    }
  };

  // Save selection when currencies change
  useEffect(() => {
    if (fromCurrency && toCurrency) {
      AsyncStorage.setItem('@last_from_currency', fromCurrency.code);
      AsyncStorage.setItem('@last_to_currency', toCurrency.code);
    }
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    calculateConversion();
  }, [amount, fromCurrency, toCurrency]);

  const calculateConversion = () => {
    const numAmount = parseFloat(amount);
    if (!isNaN(numAmount) && fromCurrency && toCurrency) {
      const converted = CurrencyService.convert(
        numAmount,
        fromCurrency,
        toCurrency
      );
      setResult(converted);
    }
  };

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const filterCurrencies = (query: string) => {
    if (!query) return currencies;
    const lowerQuery = query.toLowerCase();
    return currencies.filter(
      c =>
        c.code.toLowerCase().includes(lowerQuery) ||
        c.name.toLowerCase().includes(lowerQuery)
    );
  };

  const filteredCurrencies = filterCurrencies(searchQuery);

  const sortedCurrencies = [...filteredCurrencies].sort((a, b) => {
    const aIsFav = favorites.includes(a.code);
    const bIsFav = favorites.includes(b.code);
    if (aIsFav && !bIsFav) return -1;
    if (!aIsFav && bIsFav) return 1;
    return a.code.localeCompare(b.code);
  });

  const renderCurrencyItem = (
    item: Currency,
    onSelect: (currency: Currency) => void
  ) => {
    const isFavorite = favorites.includes(item.code);
    
    return (
      <TouchableOpacity
        style={[styles.currencyItem, isDark && styles.currencyItemDark]}
        onPress={() => {
          onSelect(item);
          setShowFromModal(false);
          setShowToModal(false);
          setSearchQuery('');
        }}
      >
        <View style={styles.currencyItemLeft}>
          <Text style={styles.flagIcon}>{getCurrencyFlag(item.code)}</Text>
          <View style={styles.currencyInfo}>
            <Text style={[styles.currencyCodeItem, isDark && styles.textDark]}>{item.code}</Text>
            <Text style={[styles.currencyNameItem, isDark && styles.textSecondaryDark]} numberOfLines={1}>
              {item.name}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            onToggleFavorite(item.code);
          }}
          style={styles.favoriteButton}
        >
          <MaterialIcons 
            name={isFavorite ? "star" : "star-border"} 
            size={24} 
            color="#FBBF24" 
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderModal = (
    visible: boolean,
    onClose: () => void,
    onSelect: (currency: Currency) => void
  ) => (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={[styles.modalContainer, isDark && styles.modalContainerDark]}>
        <View style={[styles.modalHeader, isDark && styles.modalHeaderDark]}>
          <Text style={[styles.modalTitle, isDark && styles.textDark]}>{t.selectCurrency}</Text>
          <TouchableOpacity onPress={onClose} style={[styles.closeButton, isDark && styles.closeButtonDark]}>
            <MaterialIcons 
              name="close" 
              size={24} 
              color={isDark ? '#9CA3AF' : '#6B7280'} 
            />
          </TouchableOpacity>
        </View>

        <View style={[styles.searchContainer, isDark && styles.searchContainerDark]}>
          <MaterialIcons 
            name="search" 
            size={20} 
            color={isDark ? '#9CA3AF' : '#6B7280'} 
            style={styles.searchIcon}
          />
          <TextInput
            style={[styles.searchInput, isDark && styles.searchInputDark]}
            placeholder={t.searchCurrency}
            placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {favorites.length > 0 && !searchQuery && (
          <View style={styles.sectionTitleContainer}>
            <MaterialIcons name="star" size={16} color="#FBBF24" />
            <Text style={[styles.sectionTitle, isDark && styles.textSecondaryDark]}> {t.favorites}</Text>
          </View>
        )}

        <FlatList
          data={sortedCurrencies}
          keyExtractor={item => item.code}
          renderItem={({ item }) => renderCurrencyItem(item, onSelect)}
          style={styles.currencyList}
          contentContainerStyle={styles.currencyListContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </Modal>
  );

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      {isInitializing ? (
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, isDark && styles.textDark]}>
            {t.appTitle}
          </Text>
        </View>
      ) : (
        <>
          {/* FROM Currency - Inline Layout */}
      <View style={styles.section}>
        <View style={styles.labelRow}>
          <MaterialIcons name="north" size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
          <Text style={[styles.label, isDark && styles.labelDark]}> {t.from}</Text>
        </View>
        
        <View style={[styles.inlineCard, isDark && styles.inlineCardDark]}>
          <TouchableOpacity 
            style={styles.currencyButton}
            onPress={() => setShowFromModal(true)}
          >
            <Text style={styles.flagLarge}>{getCurrencyFlag(fromCurrency?.code || '')}</Text>
            <View style={styles.currencyButtonText}>
              <Text style={[styles.currencyCodeLarge, isDark && styles.textDark]}>
                {fromCurrency?.code || 'SEL'}
              </Text>
              <MaterialIcons 
                name="keyboard-arrow-down" 
                size={24} 
                color={isDark ? '#9CA3AF' : '#6B7280'} 
              />
            </View>
          </TouchableOpacity>
          
          <View style={[styles.divider, isDark && styles.dividerDark]} />
          
          <TextInput
            style={[styles.inlineInput, isDark && styles.inlineInputDark]}
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            placeholder="0"
            placeholderTextColor={isDark ? '#4B5563' : '#D1D5DB'}
          />
        </View>
      </View>

      {/* Swap Button */}
      <TouchableOpacity 
        style={[styles.swapButton, isDark && styles.swapButtonDark]} 
        onPress={swapCurrencies}
      >
        <MaterialIcons name="swap-vert" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      {/* TO Currency - Inline Layout */}
      <View style={styles.section}>
        <View style={styles.labelRow}>
          <MaterialIcons name="south" size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
          <Text style={[styles.label, isDark && styles.labelDark]}> {t.to}</Text>
        </View>
        
        <View style={[styles.inlineCard, isDark && styles.inlineCardDark]}>
          <TouchableOpacity 
            style={styles.currencyButton}
            onPress={() => setShowToModal(true)}
          >
            <Text style={styles.flagLarge}>{getCurrencyFlag(toCurrency?.code || '')}</Text>
            <View style={styles.currencyButtonText}>
              <Text style={[styles.currencyCodeLarge, isDark && styles.textDark]}>
                {toCurrency?.code || 'SEL'}
              </Text>
              <MaterialIcons 
                name="keyboard-arrow-down" 
                size={24} 
                color={isDark ? '#9CA3AF' : '#6B7280'} 
              />
            </View>
          </TouchableOpacity>
          
          <View style={[styles.divider, isDark && styles.dividerDark]} />
          
          <View style={styles.resultContainer}>
            <Text style={[styles.resultText, isDark && styles.textDark]}>
              {result.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      {/* Exchange Rate Info */}
      {fromCurrency && toCurrency && (
        <View style={[styles.rateCard, isDark && styles.rateCardDark]}>
          <MaterialIcons 
            name="info-outline" 
            size={16} 
            color={isDark ? '#818CF8' : '#6366F1'} 
          />
          <Text style={[styles.rateText, isDark && styles.rateTextDark]}>
            {' '}1 {fromCurrency.code} = {(toCurrency.rate / fromCurrency.rate).toFixed(4)} {toCurrency.code}
          </Text>
        </View>
      )}

      {renderModal(showFromModal, () => setShowFromModal(false), setFromCurrency)}
      {renderModal(showToModal, () => setShowToModal(false), setToCurrency)}
      </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
    fontWeight: '600',
    color: '#6B7280',
  },
  section: {
    marginBottom: 12,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  labelDark: {
    color: '#9CA3AF',
  },
  inlineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  inlineCardDark: {
    backgroundColor: '#1F2937',
  },
  currencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    minWidth: 140,
  },
  flagLarge: {
    fontSize: 32,
    marginRight: 12,
  },
  currencyButtonText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyCodeLarge: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginRight: 4,
  },
  divider: {
    width: 1,
    height: 48,
    backgroundColor: '#E5E7EB',
  },
  dividerDark: {
    backgroundColor: '#374151',
  },
  inlineInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    paddingHorizontal: 16,
    textAlign: 'right',
  },
  inlineInputDark: {
    color: '#F9FAFB',
  },
  resultContainer: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  resultText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
  },
  swapButton: {
    alignSelf: 'center',
    backgroundColor: '#6366F1',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  swapButtonDark: {
    backgroundColor: '#4F46E5',
  },
  rateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  rateCardDark: {
    backgroundColor: '#1E1B4B',
  },
  rateText: {
    fontSize: 13,
    color: '#6366F1',
    fontWeight: '600',
  },
  rateTextDark: {
    color: '#818CF8',
  },
  textDark: {
    color: '#F9FAFB',
  },
  textSecondaryDark: {
    color: '#9CA3AF',
  },
  
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
  },
  modalContainerDark: {
    backgroundColor: '#111827',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalHeaderDark: {
    borderBottomColor: '#374151',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  closeButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 18,
  },
  closeButtonDark: {
    backgroundColor: '#374151',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  searchContainerDark: {
    backgroundColor: '#1F2937',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  searchInputDark: {
    color: '#F9FAFB',
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  currencyList: {
    flex: 1,
  },
  currencyListContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 8,
  },
  currencyItemDark: {
    backgroundColor: '#1F2937',
  },
  currencyItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flagIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  currencyInfo: {
    flex: 1,
  },
  currencyCodeItem: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  currencyNameItem: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  favoriteButton: {
    padding: 8,
    marginLeft: 12,
  },
});
