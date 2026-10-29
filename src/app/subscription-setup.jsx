import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import AppBackground from '../components/AppBackground';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';

const PRESET_SUBSCRIPTIONS = [
  { id: 'netflix', name: 'Netflix', emoji: '🎬', defaultAmount: '39.90' },
  { id: 'spotify', name: 'Spotify', emoji: '🎵', defaultAmount: '15.90' },
  { id: 'youtube', name: 'YouTube Premium', emoji: '📺', defaultAmount: '17.90' },
  { id: 'cloud', name: 'iCloud / Google One', emoji: '☁️', defaultAmount: '11.90' },
  { id: 'chatgpt', name: 'ChatGPT / AI Tools', emoji: '🤖', defaultAmount: '89.00' },
  { id: 'gym', name: 'Gym Membership', emoji: '🏋️', defaultAmount: '120.00' },
  { id: 'custom', name: 'Custom / Others', emoji: '➕', defaultAmount: '' },
];

export default function SubscriptionSetupScreen() {
  const router = useRouter();
  const { setupInitialSubscriptions } = useApp();
  const { language, t } = useLanguage();

  const [hasSubs, setHasSubs] = useState(null); // 'yes' | 'no' | null
  // Map of selected subscription id -> { amount: string, customName?: string }
  const [selectedSubs, setSelectedSubs] = useState({});
  const [customName, setCustomName] = useState('');

  const isBM = language === 'BM';

  const handleSelectYes = () => {
    setHasSubs('yes');
    // If none selected yet, pre-select Netflix and Spotify as friendly defaults
    if (Object.keys(selectedSubs).length === 0) {
      setSelectedSubs({
        netflix: { amount: '39.90' },
        spotify: { amount: '15.90' },
      });
    }
  };

  const handleSelectNo = () => {
    setHasSubs('no');
    setSelectedSubs({});
    setCustomName('');
    Keyboard.dismiss();
  };

  const toggleSubscription = (preset) => {
    setSelectedSubs((prev) => {
      const next = { ...prev };
      if (next[preset.id]) {
        delete next[preset.id];
      } else {
        next[preset.id] = { amount: preset.defaultAmount || '' };
      }
      return next;
    });
  };

  const handleAmountChange = (subId, text) => {
    const clean = text.replace(/[^0-9.]/g, '');
    const parts = clean.split('.');
    if (parts.length > 2) return;
    if (parts[1] && parts[1].length > 2) return;

    setSelectedSubs((prev) => ({
      ...prev,
      [subId]: {
        ...(prev[subId] || {}),
        amount: clean,
      },
    }));
  };

  // Calculate aggregated monthly subscription total
  const totalMonthlyExpense = useMemo(() => {
    if (hasSubs !== 'yes') return 0;
    return Object.entries(selectedSubs).reduce((sum, [, item]) => {
      const amt = parseFloat(item.amount) || 0;
      return sum + amt;
    }, 0);
  }, [hasSubs, selectedSubs]);

  // Active items array formatted for context
  const activeSubscriptionsList = useMemo(() => {
    if (hasSubs !== 'yes') return [];
    return Object.entries(selectedSubs)
      .map(([id, item]) => {
        const preset = PRESET_SUBSCRIPTIONS.find((p) => p.id === id);
        const name = id === 'custom' ? (customName.trim() || 'Custom Subscription') : (preset?.name || id);
        const emoji = preset?.emoji || '📱';
        const amount = parseFloat(item.amount) || 0;
        return {
          id,
          name,
          amount,
          emoji,
        };
      })
      .filter((s) => s.amount > 0);
  }, [hasSubs, selectedSubs, customName]);

  const isContinueEnabled =
    hasSubs === 'no' || (hasSubs === 'yes' && totalMonthlyExpense > 0);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/rent-setup');
    }
  };

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  const handleContinue = () => {
    if (isContinueEnabled) {
      setupInitialSubscriptions(hasSubs === 'yes', activeSubscriptionsList);
      router.replace('/(tabs)');
    }
  };

  return (
    <AppBackground opacity={1} style={styles.gradientContainer}>
      <SafeAreaView style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
            style={styles.keyboardAvoid}
          >
            <View style={styles.innerContent}>
              {/* Top Navigation Bar: Back, Progress, Skip */}
              <View style={styles.navBar}>
                <TouchableOpacity
                  style={styles.backCircleBtn}
                  onPress={handleBack}
                  activeOpacity={0.7}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="chevron-back" size={22} color="#0D0E15" />
                </TouchableOpacity>

                {/* Progress Bar (Step 3 of 3: 100% Filled) */}
                <View style={styles.progressTrack}>
                  <View style={styles.progressFill} />
                </View>

                {/* Skip Button */}
                <TouchableOpacity
                  style={styles.skipBtn}
                  onPress={handleSkip}
                  activeOpacity={0.7}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={styles.skipText}>{t('skip_btn')}</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
              >
                {/* Title & Subtitle */}
                <View style={styles.headerSection}>
                  <Text style={styles.title}>{t('subs_setup_title')}</Text>
                  <Text style={styles.subtitle}>{t('subs_setup_desc')}</Text>
                </View>

                {/* Option 1: Yes */}
                <TouchableOpacity
                  style={[
                    styles.optionCard,
                    hasSubs === 'yes' && styles.optionCardSelected,
                  ]}
                  activeOpacity={0.85}
                  onPress={handleSelectYes}
                >
                  <View
                    style={[
                      styles.iconBadge,
                      hasSubs === 'yes' && styles.iconBadgeActive,
                    ]}
                  >
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={hasSubs === 'yes' ? '#fd5ca3' : '#64748B'}
                    />
                  </View>

                  <View style={styles.optionTextContainer}>
                    <Text style={styles.optionTitle}>{t('subs_yes_title')}</Text>
                    <Text style={styles.optionSubtitle}>{t('subs_yes_subtitle')}</Text>
                  </View>

                  <View
                    style={[
                      styles.radioOuter,
                      hasSubs === 'yes' && styles.radioOuterSelected,
                    ]}
                  >
                    {hasSubs === 'yes' && (
                      <Ionicons name="checkmark" size={13} color="#FFFFFF" />
                    )}
                  </View>
                </TouchableOpacity>

                {/* Expandable Subscriptions Multi-Select Panel (When Yes is active) */}
                {hasSubs === 'yes' && (
                  <View style={styles.subsPanel}>
                    <Text style={styles.subsPanelLabel}>{t('select_subs_hint')}</Text>

                    <View style={styles.subsListContainer}>
                      {PRESET_SUBSCRIPTIONS.map((preset) => {
                        const isSelected = !!selectedSubs[preset.id];
                        const itemData = selectedSubs[preset.id] || {};

                        return (
                          <View
                            key={preset.id}
                            style={[
                              styles.subItemCard,
                              isSelected && styles.subItemCardActive,
                            ]}
                          >
                            <TouchableOpacity
                              activeOpacity={0.8}
                              onPress={() => toggleSubscription(preset)}
                              style={styles.subItemRow}
                            >
                              <View style={styles.subItemLeft}>
                                <Text style={styles.subEmoji}>{preset.emoji}</Text>
                                <Text style={styles.subName}>{preset.name}</Text>
                              </View>

                              <View
                                style={[
                                  styles.subCheckbox,
                                  isSelected && styles.subCheckboxActive,
                                ]}
                              >
                                {isSelected && (
                                  <Ionicons name="checkmark" size={13} color="#FFFFFF" />
                                )}
                              </View>
                            </TouchableOpacity>

                            {/* Inline Price Input (shown when item is checked) */}
                            {isSelected && (
                              <View style={styles.subInputWrapper}>
                                {preset.id === 'custom' && (
                                  <TextInput
                                    value={customName}
                                    onChangeText={setCustomName}
                                    placeholder={t('custom_service_name')}
                                    placeholderTextColor="#94A3B8"
                                    style={styles.customNameInput}
                                  />
                                )}

                                <View style={styles.inlineAmountRow}>
                                  <Text style={styles.inlineCurrency}>RM</Text>
                                  <TextInput
                                    value={itemData.amount || ''}
                                    onChangeText={(val) => handleAmountChange(preset.id, val)}
                                    keyboardType="numeric"
                                    placeholder="0.00"
                                    placeholderTextColor="#CBD5E1"
                                    style={styles.inlineAmountInput}
                                  />
                                  <Text style={styles.inlinePerMonth}>{t('per_month')}</Text>
                                </View>
                              </View>
                            )}
                          </View>
                        );
                      })}
                    </View>

                    {/* Total Aggregated Summary Banner */}
                    <View style={styles.totalSummaryCard}>
                      <View>
                        <Text style={styles.totalSummaryLabel}>{t('total_subscriptions')}</Text>
                        <Text style={styles.totalSummaryItemsCount}>
                          {activeSubscriptionsList.length} {isBM ? 'perkhidmatan aktif' : 'active services'}
                        </Text>
                      </View>
                      <View style={styles.totalAmountBox}>
                        <Text style={styles.totalCurrency}>RM</Text>
                        <Text style={styles.totalAmountNumber}>
                          {totalMonthlyExpense.toFixed(2)}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}

                {/* Option 2: No */}
                <TouchableOpacity
                  style={[
                    styles.optionCard,
                    hasSubs === 'no' && styles.optionCardSelected,
                  ]}
                  activeOpacity={0.85}
                  onPress={handleSelectNo}
                >
                  <View
                    style={[
                      styles.iconBadge,
                      hasSubs === 'no' && styles.iconBadgeActive,
                    ]}
                  >
                    <Ionicons
                      name="close"
                      size={20}
                      color={hasSubs === 'no' ? '#fd5ca3' : '#64748B'}
                    />
                  </View>

                  <View style={styles.optionTextContainer}>
                    <Text style={styles.optionTitle}>{t('subs_no_title')}</Text>
                    <Text style={styles.optionSubtitle}>{t('subs_no_subtitle')}</Text>
                  </View>

                  <View
                    style={[
                      styles.radioOuter,
                      hasSubs === 'no' && styles.radioOuterSelected,
                    ]}
                  >
                    {hasSubs === 'no' && (
                      <Ionicons name="checkmark" size={13} color="#FFFFFF" />
                    )}
                  </View>
                </TouchableOpacity>
              </ScrollView>

              {/* Bottom Action Button: Continue */}
              <View style={styles.bottomBar}>
                {isContinueEnabled ? (
                  <TouchableOpacity
                    style={styles.continueButton}
                    onPress={handleContinue}
                    activeOpacity={0.85}
                  >
                    <LinearGradient
                      colors={['#fd5ca3', '#fd5ca3']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.continueGradient}
                    >
                      <Text style={styles.continueButtonText}>{t('continue_btn')}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ) : (
                  <View style={[styles.continueButton, styles.continueButtonDisabled]}>
                    <Text style={styles.continueButtonTextDisabled}>{t('continue_btn')}</Text>
                  </View>
                )}
              </View>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  innerContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 24 : 12,
    paddingBottom: 20,
  },
  // Top Navigation Bar
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backCircleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 0,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressTrack: {
    width: 120,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    overflow: 'hidden',
  },
  progressFill: {
    width: '100%',
    height: '100%',
    borderRadius: 3,
    backgroundColor: '#fd5ca3',
  },
  skipBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 0,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  // Header
  headerSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: '#0D0E15',
    letterSpacing: -0.5,
    lineHeight: 36,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    fontWeight: '400',
  },
  // Options
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginBottom: 12,
    shadowColor: 'rgba(0, 0, 0, 0.03)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 1,
  },
  optionCardSelected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#fd5ca3',
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  iconBadgeActive: {
    backgroundColor: '#FFF0F5',
  },
  optionTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  optionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0D0E15',
  },
  optionSubtitle: {
    fontSize: 13,
    color: '#666666',
    marginTop: 2,
    lineHeight: 18,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: '#fd5ca3',
    backgroundColor: '#fd5ca3',
  },
  // Subscriptions Expandable Panel
  subsPanel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.04)',
    padding: 16,
    marginBottom: 16,
    marginTop: 2,
  },
  subsPanelLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#666666',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  subsListContainer: {
    gap: 8,
  },
  subItemCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    padding: 12,
  },
  subItemCardActive: {
    backgroundColor: '#FFF8FA',
    borderColor: 'rgba(253, 92, 163, 0.45)',
  },
  subItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  subEmoji: {
    fontSize: 20,
    marginRight: 10,
  },
  subName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0D0E15',
  },
  subCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  subCheckboxActive: {
    backgroundColor: '#fd5ca3',
    borderColor: '#fd5ca3',
  },
  subInputWrapper: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.04)',
  },
  customNameInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#0D0E15',
    marginBottom: 8,
  },
  inlineAmountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  inlineCurrency: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fd5ca3',
    marginRight: 6,
  },
  inlineAmountInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#0D0E15',
    paddingVertical: 4,
  },
  inlinePerMonth: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '600',
    marginLeft: 6,
  },
  // Total Aggregated Summary Card
  totalSummaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0D0E15',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: 14,
  },
  totalSummaryLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  totalSummaryItemsCount: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  totalAmountBox: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  totalCurrency: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fd5ca3',
    marginRight: 4,
  },
  totalAmountNumber: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  // Bottom Button
  bottomBar: {
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 8 : 16,
  },
  continueButton: {
    height: 54,
    borderRadius: 27,
    overflow: 'hidden',
  },
  continueGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  continueButtonDisabled: {
    backgroundColor: 'rgba(253, 92, 163, 0.22)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonTextDisabled: {
    fontSize: 16,
    fontWeight: '700',
    color: 'rgba(233, 30, 99, 0.45)',
  },
});
