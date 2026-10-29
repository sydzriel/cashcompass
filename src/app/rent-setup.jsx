import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
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

export default function RentSetupScreen() {
  const router = useRouter();
  const { setupInitialRent } = useApp();

  const [hasRent, setHasRent] = useState(null); // 'yes' | 'no' | null
  const [rentAmount, setRentAmount] = useState('');
  const rentInputRef = useRef(null);

  const handleAmountChange = (text) => {
    const clean = text.replace(/[^0-9.]/g, '');
    const parts = clean.split('.');
    if (parts.length > 2) return;
    if (parts[1] && parts[1].length > 2) return;
    setRentAmount(clean);
  };

  const parsedRent = parseFloat(rentAmount) || 0;
  const isContinueEnabled = hasRent === 'no' || (hasRent === 'yes' && parsedRent > 0);

  const handleSelectYes = () => {
    setHasRent('yes');
    setTimeout(() => {
      rentInputRef.current?.focus();
    }, 100);
  };

  const handleSelectNo = () => {
    setHasRent('no');
    setRentAmount('');
    Keyboard.dismiss();
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/income-setup');
    }
  };

  const handleSkip = () => {
    router.push('/subscription-setup');
  };

  const handleContinue = () => {
    if (isContinueEnabled) {
      setupInitialRent(hasRent === 'yes', rentAmount);
      router.push('/subscription-setup');
    }
  };

  return (
    <AppBackground opacity={1} style={styles.gradientContainer}>
      <SafeAreaView style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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

                {/* Progress Bar (Step 2 of 2: 100% Filled) */}
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
                  <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
              >
                {/* Title & Subtitle */}
                <View style={styles.headerSection}>
                  <Text style={styles.title}>{"Do you pay rent or\na mortgage?"}</Text>
                  <Text style={styles.subtitle}>
                    {"Housing is usually the largest monthly commitment, so it's worth tracking on its own."}
                  </Text>
                </View>

                {/* Option 1: Yes */}
                <TouchableOpacity
                  style={[
                    styles.optionCard,
                    hasRent === 'yes' && styles.optionCardSelected,
                  ]}
                  activeOpacity={0.8}
                  onPress={handleSelectYes}
                >
                  <View
                    style={[
                      styles.iconBadge,
                      hasRent === 'yes' && styles.iconBadgeActive,
                    ]}
                  >
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={hasRent === 'yes' ? '#fd5ca3' : '#64748B'}
                    />
                  </View>

                  <View style={styles.optionTextContainer}>
                    <Text style={styles.optionTitle}>Yes</Text>
                    <Text style={styles.optionSubtitle}>
                      I pay rent or a mortgage every month
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.radioOuter,
                      hasRent === 'yes' && styles.radioOuterSelected,
                    ]}
                  >
                    {hasRent === 'yes' && <View style={styles.radioInner} />}
                  </View>
                </TouchableOpacity>

                {/* Amount Input (Expands when Yes is selected) */}
                {hasRent === 'yes' && (
                  <TouchableOpacity
                    style={styles.rentAmountCard}
                    activeOpacity={0.9}
                    onPress={() => rentInputRef.current?.focus()}
                  >
                    <Text style={styles.rentAmountPrompt}>Monthly Rent Amount</Text>
                    <View style={styles.amountInputRow}>
                      <Text style={styles.currencyPrefix}>RM</Text>
                      <TextInput
                        ref={rentInputRef}
                        style={styles.amountInput}
                        placeholder="0"
                        placeholderTextColor="#CBD5E1"
                        keyboardType="numeric"
                        value={rentAmount}
                        onChangeText={handleAmountChange}
                        maxLength={8}
                        returnKeyType="done"
                        onSubmitEditing={Keyboard.dismiss}
                      />
                    </View>
                  </TouchableOpacity>
                )}

                {/* Option 2: No */}
                <TouchableOpacity
                  style={[
                    styles.optionCard,
                    hasRent === 'no' && styles.optionCardSelected,
                  ]}
                  activeOpacity={0.8}
                  onPress={handleSelectNo}
                >
                  <View
                    style={[
                      styles.iconBadge,
                      hasRent === 'no' && styles.iconBadgeActive,
                    ]}
                  >
                    <Ionicons
                      name="close"
                      size={20}
                      color={hasRent === 'no' ? '#fd5ca3' : '#64748B'}
                    />
                  </View>

                  <View style={styles.optionTextContainer}>
                    <Text style={styles.optionTitle}>No</Text>
                    <Text style={styles.optionSubtitle}>
                      {"Housing doesn't cost me anything monthly"}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.radioOuter,
                      hasRent === 'no' && styles.radioOuterSelected,
                    ]}
                  >
                    {hasRent === 'no' && <View style={styles.radioInner} />}
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
                      <Text style={styles.continueButtonText}>Continue</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ) : (
                  <View style={[styles.continueButton, styles.continueButtonDisabled]}>
                    <Text style={styles.continueButtonTextDisabled}>Continue</Text>
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
  // Top Nav Bar
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
    width: '66%',
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
    paddingBottom: 20,
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
    borderWidth: 0,
    borderColor: 'rgba(0, 0, 0, 0.04)',
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginBottom: 12,
  },
  optionCardSelected: {
    backgroundColor: '#FFFFFF',
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
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: '#fd5ca3',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fd5ca3',
  },
  // Rent Amount Input Card
  rentAmountCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 0,
    borderColor: 'rgba(0, 0, 0, 0.04)',
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 12,
    alignItems: 'center',
  },
  rentAmountPrompt: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 8,
  },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currencyPrefix: {
    fontSize: 24,
    fontWeight: '700',
    color: '#94A3B8',
    marginRight: 6,
  },
  amountInput: {
    fontSize: 34,
    fontWeight: '800',
    color: '#0D0E15',
    minWidth: 70,
    textAlign: 'left',
    padding: 0,
    margin: 0,
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
