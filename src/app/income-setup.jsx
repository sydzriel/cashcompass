import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import AppBackground from '../components/AppBackground';
import { useApp } from '../context/AppContext';

export default function IncomeSetupScreen() {
  const router = useRouter();
  const { setupInitialIncome } = useApp();

  const [rawAmount, setRawAmount] = useState('');
  const [frequency, setFrequency] = useState('Monthly');
  const inputRef = useRef(null);

  const frequencies = [
    { id: 'Weekly', label: 'Weekly' },
    { id: 'Monthly', label: 'Monthly' },
    { id: 'Yearly', label: 'Yearly' },
  ];

  const handleAmountChange = (text) => {
    // Only allow numbers and one decimal dot
    const clean = text.replace(/[^0-9.]/g, '');
    const parts = clean.split('.');
    if (parts.length > 2) return;
    if (parts[1] && parts[1].length > 2) return; // Max 2 decimal places
    setRawAmount(clean);
  };

  const parsedAmount = parseFloat(rawAmount) || 0;
  const isContinueEnabled = parsedAmount > 0;

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/login');
    }
  };

  const handleSkip = () => {
    router.push('/rent-setup');
  };

  const handleContinue = () => {
    if (isContinueEnabled) {
      setupInitialIncome(rawAmount, frequency);
      router.push('/rent-setup');
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

                {/* Progress Bar Indicator */}
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

              {/* Title & Subtitle */}
              <View style={styles.headerSection}>
                <Text style={styles.title}>{"What's your income?"}</Text>
                <Text style={styles.subtitle}>
                  {"We'll log this as recurring income so you always know what's coming in."}
                </Text>
              </View>

              {/* Big Interactive Income Display / Input Card */}
              <TouchableOpacity
                style={styles.incomeCard}
                activeOpacity={0.9}
                onPress={() => inputRef.current?.focus()}
              >
                <View style={styles.amountRow}>
                  <Text style={styles.currencyLabel}>RM</Text>
                  <TextInput
                    ref={inputRef}
                    style={styles.amountInput}
                    placeholder="0"
                    placeholderTextColor="#CBD5E1"
                    keyboardType="numeric"
                    value={rawAmount}
                    onChangeText={handleAmountChange}
                    maxLength={9}
                    autoFocus={true}
                    returnKeyType="done"
                    onSubmitEditing={Keyboard.dismiss}
                  />
                </View>
              </TouchableOpacity>

              {/* Frequency Section */}
              <View style={styles.frequencySection}>
                <Text style={styles.frequencyTitle}>How often are you paid?</Text>

                <View style={styles.frequencyCard}>
                  {frequencies.map((item, index) => {
                    const isSelected = frequency === item.id;
                    return (
                      <View key={item.id}>
                        {index > 0 && <View style={styles.divider} />}
                        <TouchableOpacity
                          style={styles.frequencyRow}
                          activeOpacity={0.7}
                          onPress={() => setFrequency(item.id)}
                        >
                          <Text style={[styles.frequencyLabel, isSelected && styles.frequencyLabelActive]}>
                            {item.label}
                          </Text>
                          {isSelected && (
                            <Ionicons name="checkmark" size={20} color="#fd5ca3" />
                          )}
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              </View>

              <View style={styles.spacer} />

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
    width: '45%',
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
  // Header
  headerSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: '#0D0E15',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    fontWeight: '400',
  },
  // Big Input Card
  incomeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 0,
    borderColor: 'rgba(0, 0, 0, 0.04)',
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currencyLabel: {
    fontSize: 26,
    fontWeight: '700',
    color: '#94A3B8',
    marginRight: 8,
    marginTop: 2,
  },
  amountInput: {
    fontSize: 44,
    fontWeight: '800',
    color: '#0D0E15',
    minWidth: 80,
    textAlign: 'left',
    padding: 0,
    margin: 0,
  },
  // Frequency Section
  frequencySection: {
    marginBottom: 16,
  },
  frequencyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 10,
  },
  frequencyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 0,
    borderColor: 'rgba(0, 0, 0, 0.04)',
    overflow: 'hidden',
  },
  frequencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 56,
  },
  frequencyLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0D0E15',
  },
  frequencyLabelActive: {
    color: '#0D0E15',
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    marginHorizontal: 16,
  },
  spacer: {
    flex: 1,
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
