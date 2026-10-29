import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const quickItemPresets = [
  { name: 'Sony Wireless Headphones', price: '249', emoji: '🎧' },
  { name: 'Trendy Sneakers', price: '320', emoji: '👟' },
  { name: 'Mechanical Keyboard RGB', price: '189', emoji: '⌨️' },
  { name: 'Designer Jacket', price: '159', emoji: '🧥' },
  { name: 'Smart Fitness Band', price: '129', emoji: '⌚' },
];

export default function ImpulseCalculatorModal({ visible, onClose, onStartChillLock }) {
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🛍️');
  const [reason, setReason] = useState('');

  // Daily student discretionary budget (RM25/day default)
  const dailyDiscretionaryBudget = 25;

  const parsedPrice = parseFloat(itemPrice) || 0;

  const daysOfAllowance = useMemo(() => {
    if (parsedPrice <= 0) return 0;
    return (parsedPrice / dailyDiscretionaryBudget).toFixed(1);
  }, [parsedPrice]);

  const riskLevel = useMemo(() => {
    if (parsedPrice >= 200 || parseFloat(daysOfAllowance) >= 8) {
      return {
        level: 'HIGH IMPULSE RISK',
        color: '#EF4444',
        bgColor: '#FEF2F2',
        desc: 'This item consumes more than a week of your discretionary budget! A 48-hour cool-down is strongly advised.',
      };
    } else if (parsedPrice >= 70 || parseFloat(daysOfAllowance) >= 3) {
      return {
        level: 'MODERATE IMPULSE RISK',
        color: '#F59E0B',
        bgColor: '#FFFBEB',
        desc: 'Consider if this is a genuine need or a momentary craving. 48-hour pause recommended.',
      };
    } else if (parsedPrice > 0) {
      return {
        level: 'LOW IMPULSE RISK',
        color: '#10B981',
        bgColor: '#ECFDF5',
        desc: 'Manageable, but taking 48 hours guarantees mindful spending.',
      };
    }
    return null;
  }, [parsedPrice, daysOfAllowance]);

  const handleApplyPreset = (preset) => {
    setItemName(preset.name);
    setItemPrice(preset.price);
    setSelectedEmoji(preset.emoji);
  };

  const handleStartLock = () => {
    if (!itemName.trim() || parsedPrice <= 0) {
      if (Platform.OS === 'web') {
        window.alert('Please enter a valid item name and price.');
      }
      return;
    }

    onStartChillLock({
      title: itemName.trim(),
      price: parsedPrice,
      emoji: selectedEmoji,
      reason: reason.trim() || 'Impulse check',
      dailyBudgetRatio: parseFloat(daysOfAllowance),
    });

    // Reset and close
    setItemName('');
    setItemPrice('');
    setReason('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
          style={{ flex: 1 }}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.circleBtn}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Ionicons name="close" size={22} color="#0D0E15" />
            </TouchableOpacity>

            <View style={styles.headerTitleBox}>
              <Text style={styles.headerTitle}>48-Hour Chill Calculator</Text>
              <Text style={styles.headerSubtitle}>Beat Impulse Buying • Save Money</Text>
            </View>

            <View style={{ width: 44 }} />
          </View>

          <ScrollView
            contentContainerStyle={[styles.scrollContent, { flexGrow: 1 }]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Concept Banner */}
            <View style={styles.conceptBanner}>
              <Text style={styles.conceptEmoji}>⏳</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.conceptTitle}>The 48-Hour Chill Rule</Text>
                <Text style={styles.conceptText}>
                  Psychology proves that 70% of impulse buying urges disappear after 48 hours. Put your urge on ice before spending.
                </Text>
              </View>
            </View>

            {/* Quick Presets */}
            <Text style={styles.sectionLabel}>QUICK POPULAR IMPULSE ITEMS:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.presetsRow}
            >
              {quickItemPresets.map((pr, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.presetChip}
                  onPress={() => handleApplyPreset(pr)}
                  activeOpacity={0.7}
                >
                  <Text style={{ fontSize: 16, marginRight: 6 }}>{pr.emoji}</Text>
                  <Text style={styles.presetChipText}>{pr.name} (RM{pr.price})</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Input Card (Flat White per design.md) */}
            <View style={styles.card}>
              <Text style={styles.inputLabel}>What do you want to buy?</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Wireless Noise-Cancelling Headphones"
                  placeholderTextColor="#94A3B8"
                  value={itemName}
                  onChangeText={setItemName}
                />
              </View>

              <Text style={styles.inputLabel}>Price (RM)</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.currencyPrefix}>RM</Text>
                <TextInput
                  style={[styles.input, { fontSize: 20, fontWeight: '700' }]}
                  placeholder="0.00"
                  placeholderTextColor="#94A3B8"
                  keyboardType="decimal-pad"
                  value={itemPrice}
                  onChangeText={setItemPrice}
                />
              </View>

              <Text style={styles.inputLabel}>Why do you want it right now? (Optional)</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Saw discount on TikTok / Felt bored"
                  placeholderTextColor="#94A3B8"
                  value={reason}
                  onChangeText={setReason}
                />
              </View>
            </View>

            {/* Live Calculation & Risk Card */}
            {parsedPrice > 0 && riskLevel && (
              <View style={styles.card}>
                <Text style={styles.cardHeaderTitle}>Impulse Reality Check</Text>

                <View style={styles.statsGrid}>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Days of Daily Budget</Text>
                    <Text style={styles.statBigValue}>{daysOfAllowance} days</Text>
                    <Text style={styles.statSub}>Based on RM{dailyDiscretionaryBudget}/day student budget</Text>
                  </View>

                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>48-Hour Lock Time</Text>
                    <Text style={styles.statBigValue}>48h 00m</Text>
                    <Text style={styles.statSub}>Cool-down timer</Text>
                  </View>
                </View>

                {/* Risk Indicator */}
                <View style={[styles.riskBox, { backgroundColor: riskLevel.bgColor }]}>
                  <View style={styles.riskHeader}>
                    <Ionicons name="warning" size={18} color={riskLevel.color} />
                    <Text style={[styles.riskTitle, { color: riskLevel.color }]}>
                      {riskLevel.level}
                    </Text>
                  </View>
                  <Text style={styles.riskDesc}>{riskLevel.desc}</Text>
                </View>
              </View>
            )}

            {/* Action Button */}
            <TouchableOpacity
              style={styles.startBtn}
              onPress={handleStartLock}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#fd5ca3', '#fd5ca3']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.btnGradient}
              >
                <Text style={styles.btnText}>Start 48-Hour Chill Lock ⏳</Text>
              </LinearGradient>
            </TouchableOpacity>

            <Text style={styles.lockHint}>
              You can track & unlock this item anytime under Transactions.
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 16 : 8,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.04)',
    backgroundColor: '#FFFFFF',
  },
  circleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleBox: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0D0E15',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  conceptBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F5',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(253, 92, 163, 0.2)',
  },
  conceptEmoji: {
    fontSize: 32,
    marginRight: 14,
  },
  conceptTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#fd5ca3',
    marginBottom: 4,
  },
  conceptText: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 17,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#666666',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  presetsRow: {
    paddingBottom: 14,
    gap: 8,
  },
  presetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  presetChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0D0E15',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.04)',
    padding: 18,
    marginBottom: 16,
  },
  cardHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0D0E15',
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0D0E15',
    marginBottom: 6,
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 12,
  },
  currencyPrefix: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0D0E15',
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#0D0E15',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 14,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
  },
  statLabel: {
    fontSize: 11,
    color: '#666666',
    marginBottom: 4,
  },
  statBigValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0D0E15',
    marginBottom: 2,
  },
  statSub: {
    fontSize: 10,
    color: '#94A3B8',
  },
  riskBox: {
    borderRadius: 14,
    padding: 14,
  },
  riskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  riskTitle: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  riskDesc: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 16,
  },
  startBtn: {
    height: 54,
    borderRadius: 27,
    overflow: 'hidden',
    marginTop: 6,
    marginBottom: 10,
  },
  btnGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  lockHint: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
});
