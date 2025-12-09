import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  useColorScheme,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { CurrencyService } from './CurrencyService';
import { Translations } from './i18n';

interface SettingsProps {
  onUpdate: () => void;
  translations: Translations;
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}

export const Settings: React.FC<SettingsProps> = ({ onUpdate, translations: t, currentLanguage, onLanguageChange }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadLastUpdate();
  }, []);

  const loadLastUpdate = async () => {
    const date = await CurrencyService.getLastUpdate();
    setLastUpdate(date);
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    
    try {
      const result = await CurrencyService.updateCurrencies();
      
      if (result.success) {
        await loadLastUpdate();
        onUpdate();
        Alert.alert(
          t.updateSuccess,
          t.updateSuccessMessage,
          [{ text: t.ok }]
        );
      } else {
        Alert.alert(
          t.updateError,
          result.error || t.updateErrorMessage,
          [{ text: t.ok }]
        );
      }
    } catch (error) {
      Alert.alert(
        t.updateError,
        t.updateErrorMessage,
        [{ text: t.ok }]
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return t.neverUpdated;
    
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return t.justNow;
    if (minutes < 60) return `${minutes} ${t.minutesAgo}`;
    if (hours < 24) return `${hours} ${t.hoursAgo}`;
    if (days === 1) return t.yesterday;
    if (days < 7) return `${days} ${t.daysAgo}`;
    
    return date.toLocaleDateString(undefined, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isOutdated = (): boolean => {
    if (!lastUpdate) return true;
    const now = new Date();
    const hoursSinceUpdate = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);
    return hoursSinceUpdate > 48;
  };

  const getLanguageName = (lang: string): string => {
    if (lang === 'it') return t.italian;
    if (lang === 'en') return t.english;
    return t.systemLanguage;
  };

  return (
    <ScrollView
      style={[styles.container, isDark && styles.containerDark]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.section}>
        <View style={styles.sectionTitleRow}>
          <MaterialIcons name="language" size={24} color={isDark ? '#F9FAFB' : '#111827'} />
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}> {t.language}</Text>
        </View>

        <View style={[styles.infoCard, isDark && styles.infoCardDark]}>
          <TouchableOpacity
            style={styles.languageOption}
            onPress={() => onLanguageChange('it')}
          >
            <View style={styles.infoLeft}>
              <Text style={styles.flagEmoji}>🇮🇹</Text>
              <Text style={[styles.languageLabel, isDark && styles.textDark]}>{t.italian}</Text>
            </View>
            {currentLanguage === 'it' && (
              <MaterialIcons name="check-circle" size={24} color="#6366F1" />
            )}
          </TouchableOpacity>

          <View style={styles.infoDivider} />

          <TouchableOpacity
            style={styles.languageOption}
            onPress={() => onLanguageChange('en')}
          >
            <View style={styles.infoLeft}>
              <Text style={styles.flagEmoji}>🇬🇧</Text>
              <Text style={[styles.languageLabel, isDark && styles.textDark]}>{t.english}</Text>
            </View>
            {currentLanguage === 'en' && (
              <MaterialIcons name="check-circle" size={24} color="#6366F1" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionTitleRow}>
          <MaterialIcons name="storage" size={24} color={isDark ? '#F9FAFB' : '#111827'} />
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}> {t.database}</Text>
        </View>
        
        <View style={[styles.infoCard, isDark && styles.infoCardDark]}>
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <MaterialIcons name="schedule" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
              <Text style={[styles.infoLabel, isDark && styles.textSecondaryDark]}> {t.lastUpdate}</Text>
            </View>
            <View style={styles.updateInfo}>
              {isOutdated() && (
                <View style={styles.warningDot} />
              )}
              <Text style={[
                styles.infoValue, 
                isDark && styles.textDark,
                isOutdated() && styles.warningText
              ]}>
                {formatDate(lastUpdate)}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.updateButton,
            isUpdating && styles.updateButtonDisabled,
            isDark && styles.updateButtonDark,
          ]}
          onPress={handleUpdate}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <MaterialIcons name="refresh" size={24} color="#FFFFFF" />
              <Text style={styles.updateButtonText}> {t.updateRates}</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.noteRow}>
          <MaterialIcons name="info-outline" size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
          <Text style={[styles.updateNote, isDark && styles.textSecondaryDark]}>
            {' '}{t.updateNote}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionTitleRow}>
          <MaterialIcons name="info" size={24} color={isDark ? '#F9FAFB' : '#111827'} />
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}> {t.information}</Text>
        </View>
        
        <View style={[styles.infoCard, isDark && styles.infoCardDark]}>
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <MaterialIcons name="code" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
              <Text style={[styles.infoLabel, isDark && styles.textSecondaryDark]}> {t.version}</Text>
            </View>
            <Text style={[styles.infoValue, isDark && styles.textDark]}>1.0.0</Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <MaterialIcons name="storage" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
              <Text style={[styles.infoLabel, isDark && styles.textSecondaryDark]}> Database</Text>
            </View>
            <Text style={[styles.infoValue, isDark && styles.textDark]}>Local</Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <MaterialIcons name="cloud-off" size={20} color="#34D399" />
              <Text style={[styles.infoLabel, isDark && styles.textSecondaryDark]}> {t.offlineMode}</Text>
            </View>
            <Text style={styles.infoValueHighlight}>{t.offlineActive}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FE',
  },
  containerDark: {
    backgroundColor: '#111827',
  },
  section: {
    padding: 20,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  textDark: {
    color: '#F9FAFB',
  },
  textSecondaryDark: {
    color: '#9CA3AF',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  infoCardDark: {
    backgroundColor: '#1F2937',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '500',
  },
  updateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  warningDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F59E0B',
    marginRight: 8,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  warningText: {
    color: '#F59E0B',
  },
  infoValueHighlight: {
    fontSize: 15,
    fontWeight: '600',
    color: '#34D399',
  },
  infoDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  updateButton: {
    backgroundColor: '#6366F1',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  updateButtonDark: {
    backgroundColor: '#4F46E5',
  },
  updateButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  updateNote: {
    flex: 1,
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 20,
    fontWeight: '500',
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  languageLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  flagEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
});