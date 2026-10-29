import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AppBackground from '../components/AppBackground';
import { useLanguage } from '../context/LanguageContext';

type TabType = 'owed_to_you' | 'you_owe' | 'settled';

interface DebtRecord {
  id: string;
  name: string;
  amount: number;
  note: string;
  type: 'owed_to_you' | 'you_owe';
  isSettled: boolean;
  date: string;
}

export default function WhoOwesWhoScreen() {
  const router = useRouter();
  const { language, t } = useLanguage();

  const [activeTab, setActiveTab] = useState<TabType>('owed_to_you');
  const [debts, setDebts] = useState<DebtRecord[]>([]);

  // Add Debt Modal State
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newPersonName, setNewPersonName] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newNote, setNewNote] = useState('');

  // Split Bill Modal State
  const [isSplitModalVisible, setIsSplitModalVisible] = useState(false);
  const [splitTotal, setSplitTotal] = useState('');
  const [splitPeopleCount, setSplitPeopleCount] = useState('3');
  const [splitPerPerson, setSplitPerPerson] = useState<number | null>(null);

  // Derived summaries
  const othersOweYouRecords = debts.filter((d) => d.type === 'owed_to_you' && !d.isSettled);
  const youOweOthersRecords = debts.filter((d) => d.type === 'you_owe' && !d.isSettled);
  const settledRecords = debts.filter((d) => d.isSettled);

  const othersOweTotal = othersOweYouRecords.reduce((sum, d) => sum + d.amount, 0);
  const youOweTotal = youOweOthersRecords.reduce((sum, d) => sum + d.amount, 0);

  const isBM = language === 'BM';

  // Handler: Add Debt
  const handleAddDebt = () => {
    const trimmedName = newPersonName.trim();
    const parsedAmount = parseFloat(newAmount);

    if (!trimmedName || isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert(
        isBM ? 'Ralat Pengesahan' : 'Validation Error',
        isBM ? 'Sila masukkan nama dan jumlah yang sah.' : 'Please enter a valid person name and amount.'
      );
      return;
    }

    const newRecord: DebtRecord = {
      id: `debt-${Date.now()}`,
      name: trimmedName,
      amount: parsedAmount,
      note: newNote.trim() || (isBM ? 'Perbelanjaan berkongsi' : 'Shared expense'),
      type: activeTab === 'you_owe' ? 'you_owe' : 'owed_to_you',
      isSettled: false,
      date: 'Today',
    };

    setDebts((prev) => [newRecord, ...prev]);
    setIsAddModalVisible(false);
    setNewPersonName('');
    setNewAmount('');
    setNewNote('');
    Alert.alert(
      isBM ? 'Rekod Ditambah' : 'Record Added',
      isBM
        ? `RM ${parsedAmount.toFixed(2)} untuk ${trimmedName} telah disimpan.`
        : `RM ${parsedAmount.toFixed(2)} for ${trimmedName} recorded successfully.`
    );
  };

  // Handler: Split Bill
  const handleCalculateSplit = () => {
    const total = parseFloat(splitTotal);
    const people = parseInt(splitPeopleCount, 10);

    if (isNaN(total) || total <= 0 || isNaN(people) || people <= 0) {
      Alert.alert(
        isBM ? 'Ralat Kiraan' : 'Calculation Error',
        isBM ? 'Sila masukkan jumlah bil dan bilangan orang yang sah.' : 'Please enter valid total bill and number of people.'
      );
      return;
    }

    const perPerson = total / people;
    setSplitPerPerson(Math.round(perPerson * 100) / 100);
  };

  // Filtered List based on active tab
  const displayedRecords =
    activeTab === 'owed_to_you'
      ? othersOweYouRecords
      : activeTab === 'you_owe'
      ? youOweOthersRecords
      : settledRecords;

  return (
    <AppBackground opacity={1.0} style={styles.gradientContainer}>
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

        {/* Top Header Bar */}
        <View style={styles.headerBar}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.back()}
            style={styles.backButton}
            accessibilityLabel="Back"
          >
            <Text style={styles.backButtonText}>‹</Text>
          </TouchableOpacity>

          {/* Split Bill Action Pill Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setSplitPerPerson(null);
              setIsSplitModalVisible(true);
            }}
            style={styles.splitBillButton}
          >
            <Text style={styles.splitBillEmoji}>🧾</Text>
            <Text style={styles.splitBillText}>{t('split_bill')}</Text>
          </TouchableOpacity>
        </View>

        {/* Title & Subtitle */}
        <View style={styles.titleSection}>
          <Text style={styles.screenTitle}>{t('who_owes_who_title')}</Text>
          <Text style={styles.screenSubtitle}>{t('who_owes_who_subtitle')}</Text>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Summary Cards Row (2 Columns side by side) */}
          <View style={styles.summaryCardsRow}>
            {/* Card 1: OTHERS OWE YOU (Green Dot) */}
            <View style={styles.summaryCard}>
              <View style={styles.dotRow}>
                <View style={[styles.indicatorDot, styles.dotGreen]} />
              </View>
              <Text style={styles.cardHeaderLabel}>{t('others_owe_you')}</Text>
              <Text style={styles.cardAmount}>RM {othersOweTotal.toFixed(2)}</Text>
              <Text style={styles.cardPeopleCount}>
                {othersOweYouRecords.length} {isBM ? 'orang' : 'people'}
              </Text>
            </View>

            {/* Card 2: YOU OWE OTHERS (Amber Dot) */}
            <View style={styles.summaryCard}>
              <View style={styles.dotRow}>
                <View style={[styles.indicatorDot, styles.dotAmber]} />
              </View>
              <Text style={styles.cardHeaderLabel}>{t('you_owe_others')}</Text>
              <Text style={styles.cardAmount}>RM {youOweTotal.toFixed(2)}</Text>
              <Text style={styles.cardPeopleCount}>
                {youOweOthersRecords.length} {isBM ? 'orang' : 'people'}
              </Text>
            </View>
          </View>

          {/* Filter Tabs (Horizontal Pills) */}
          <View style={styles.filterTabsRow}>
            {/* Tab 1: Owed to you */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setActiveTab('owed_to_you')}
              style={[
                styles.filterPill,
                activeTab === 'owed_to_you' && styles.filterPillActive,
              ]}
            >
              <Text
                style={[
                  styles.filterPillText,
                  activeTab === 'owed_to_you' && styles.filterPillTextActive,
                ]}
              >
                {t('tab_owed_to_you')} · {othersOweYouRecords.length}
              </Text>
            </TouchableOpacity>

            {/* Tab 2: You owe */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setActiveTab('you_owe')}
              style={[
                styles.filterPill,
                activeTab === 'you_owe' && styles.filterPillActive,
              ]}
            >
              <Text
                style={[
                  styles.filterPillText,
                  activeTab === 'you_owe' && styles.filterPillTextActive,
                ]}
              >
                {t('tab_you_owe')} · {youOweOthersRecords.length}
              </Text>
            </TouchableOpacity>

            {/* Tab 3: Settled */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setActiveTab('settled')}
              style={[
                styles.filterPill,
                activeTab === 'settled' && styles.filterPillActive,
              ]}
            >
              <Text
                style={[
                  styles.filterPillText,
                  activeTab === 'settled' && styles.filterPillTextActive,
                ]}
              >
                {t('tab_settled')} · {settledRecords.length}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Records List or Empty State Card */}
          {displayedRecords.length === 0 ? (
            <View style={styles.emptyCardContainer}>
              <View style={styles.emptyIconCircle}>
                <Text style={styles.emptyEmoji}>⬇️</Text>
              </View>
              <Text style={styles.emptyTitle}>{t('empty_title')}</Text>
              <Text style={styles.emptySubtitle}>{t('empty_subtitle')}</Text>
            </View>
          ) : (
            <View style={styles.recordsListCard}>
              {displayedRecords.map((record, index) => (
                <View
                  key={record.id}
                  style={[
                    styles.recordItemRow,
                    index !== displayedRecords.length - 1 && styles.recordItemBorder,
                  ]}
                >
                  <View style={styles.recordLeft}>
                    <View style={styles.recordAvatar}>
                      <Text style={styles.recordAvatarText}>
                        {record.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.recordName}>{record.name}</Text>
                      <Text style={styles.recordNote}>{record.note}</Text>
                    </View>
                  </View>
                  <View style={styles.recordRight}>
                    <Text
                      style={[
                        styles.recordAmount,
                        record.type === 'owed_to_you' ? styles.amountGreen : styles.amountAmber,
                      ]}
                    >
                      {record.type === 'owed_to_you' ? '+' : '-'} RM{' '}
                      {record.amount.toFixed(2)}
                    </Text>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => {
                        setDebts((prev) =>
                          prev.map((it) =>
                            it.id === record.id ? { ...it, isSettled: !it.isSettled } : it
                          )
                        );
                      }}
                      style={styles.settleButton}
                    >
                      <Text style={styles.settleButtonText}>
                        {record.isSettled ? (isBM ? 'Selesai ✓' : 'Settled ✓') : (isBM ? 'Tanda Selesai' : 'Mark Settled')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Bottom Primary Button */}
        <View style={styles.bottomBarContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setIsAddModalVisible(true)}
            style={styles.bottomPrimaryButton}
          >
            <Text style={styles.bottomPrimaryButtonText}>{t('add_money_owed')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* ==================================================== */}
      {/* Modal 1: Add Money Owed / Debt Form */}
      {/* ==================================================== */}
      <Modal
        visible={isAddModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsAddModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
          style={styles.modalOverlay}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitleRow}>
                <Text style={styles.modalHeaderEmoji}>👥</Text>
                <Text style={styles.modalHeaderTitle}>
                  {activeTab === 'you_owe'
                    ? (isBM ? 'Tambah Wang Anda Hutang' : 'Add Money You Owe')
                    : (isBM ? 'Tambah Wang Dihutang' : 'Add Money Owed To You')}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsAddModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>
                  {isBM ? 'Nama Individu' : 'Person Name'}
                </Text>
                <TextInput
                  value={newPersonName}
                  onChangeText={setNewPersonName}
                  placeholder={isBM ? 'Cth: Adam, Sarah' : 'e.g. Sarah, Alex'}
                  placeholderTextColor="#999999"
                  style={styles.modalInput}
                />
              </View>

              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>
                  {isBM ? 'Jumlah (RM)' : 'Amount (RM)'}
                </Text>
                <TextInput
                  value={newAmount}
                  onChangeText={setNewAmount}
                  keyboardType="numeric"
                  placeholder="25.00"
                  placeholderTextColor="#999999"
                  style={styles.modalInput}
                />
              </View>

              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>
                  {isBM ? 'Nota / Tujuan' : 'Note / Reason'}
                </Text>
                <TextInput
                  value={newNote}
                  onChangeText={setNewNote}
                  placeholder={isBM ? 'Makan tengah hari, Grab' : 'Lunch, Grab split'}
                  placeholderTextColor="#999999"
                  style={styles.modalInput}
                />
              </View>

              <TouchableOpacity
                onPress={handleAddDebt}
                activeOpacity={0.8}
                style={styles.modalSubmitButton}
              >
                <Text style={styles.modalSubmitText}>
                  {isBM ? 'Simpan Rekod' : 'Save Record'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ==================================================== */}
      {/* Modal 2: Quick Split Bill Calculator */}
      {/* ==================================================== */}
      <Modal
        visible={isSplitModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsSplitModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
          style={styles.modalOverlay}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitleRow}>
                <Text style={styles.modalHeaderEmoji}>🧾</Text>
                <Text style={styles.modalHeaderTitle}>
                  {isBM ? 'Kira Kongsi Bil' : 'Split Bill Calculator'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsSplitModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>
                  {isBM ? 'Jumlah Bil (RM)' : 'Total Bill Amount (RM)'}
                </Text>
                <TextInput
                  value={splitTotal}
                  onChangeText={setSplitTotal}
                  keyboardType="numeric"
                  placeholder="120.00"
                  placeholderTextColor="#999999"
                  style={styles.modalInput}
                />
              </View>

              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>
                  {isBM ? 'Bilangan Orang' : 'Number of People'}
                </Text>
                <TextInput
                  value={splitPeopleCount}
                  onChangeText={setSplitPeopleCount}
                  keyboardType="numeric"
                  placeholder="4"
                  placeholderTextColor="#999999"
                  style={styles.modalInput}
                />
              </View>

              {splitPerPerson !== null && (
                <View style={styles.splitResultCard}>
                  <Text style={styles.splitResultLabel}>
                    {isBM ? 'Bahagian Setiap Orang' : 'Per Person Share'}
                  </Text>
                  <Text style={styles.splitResultAmount}>
                    RM {splitPerPerson.toFixed(2)}
                  </Text>
                </View>
              )}

              <TouchableOpacity
                onPress={handleCalculateSplit}
                activeOpacity={0.8}
                style={styles.modalSubmitButton}
              >
                <Text style={styles.modalSubmitText}>
                  {isBM ? 'Kira Bahagian' : 'Calculate Share'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </AppBackground>
  );
}

// ==========================================
// Styles matching design.md and screenshot layout
// ==========================================

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 12 : 6,
    paddingBottom: 4,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 34,
    fontWeight: '300',
    color: '#0D0E15',
    lineHeight: 36,
  },
  splitBillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  splitBillEmoji: {
    fontSize: 14,
    marginRight: 6,
  },
  splitBillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0D0E15',
  },
  titleSection: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0D0E15',
    letterSpacing: -0.5,
  },
  screenSubtitle: {
    fontSize: 13,
    color: '#666666',
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, // space for bottom fixed button
  },
  summaryCardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#000000', // Pitch Black cards per screenshot
    borderRadius: 22,
    padding: 16,
    justifyContent: 'space-between',
    minHeight: 120,
  },
  dotRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicatorDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },
  dotGreen: {
    backgroundColor: '#10B981', // Green indicator
  },
  dotAmber: {
    backgroundColor: '#F59E0B', // Amber indicator
  },
  cardHeaderLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#888888',
    letterSpacing: 0.5,
    marginTop: 8,
    textTransform: 'uppercase',
  },
  cardAmount: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 4,
  },
  cardPeopleCount: {
    fontSize: 12,
    color: '#777777',
    marginTop: 2,
  },
  filterTabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterPill: {
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  filterPillActive: {
    backgroundColor: '#0D0E15', // Active black pill per screenshot
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0D0E15',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  emptyCardContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.04)',
    paddingVertical: 52,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyEmoji: {
    fontSize: 26,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0D0E15',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 18,
  },
  recordsListCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.04)',
    overflow: 'hidden',
  },
  recordItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  recordItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.04)',
  },
  recordLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  recordAvatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFF0F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  recordAvatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fd5ca3',
  },
  recordName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0D0E15',
  },
  recordNote: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  recordRight: {
    alignItems: 'flex-end',
  },
  recordAmount: {
    fontSize: 15,
    fontWeight: '700',
  },
  amountGreen: {
    color: '#10B981',
  },
  amountAmber: {
    color: '#F59E0B',
  },
  settleButton: {
    marginTop: 4,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  settleButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666666',
  },
  bottomBarContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: 20,
    right: 20,
  },
  bottomPrimaryButton: {
    backgroundColor: '#0D0E15', // Black full width button per screenshot
    borderRadius: 27, // per design.md: bulat penuh untuk butang (27px)
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  bottomPrimaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.06)',
  },
  modalHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalHeaderEmoji: {
    fontSize: 22,
    marginRight: 8,
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0D0E15',
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  modalInputGroup: {
    marginTop: 12,
  },
  modalLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 6,
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontWeight: '600',
    color: '#0D0E15',
  },
  modalSubmitButton: {
    backgroundColor: '#0D0E15',
    borderRadius: 27,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  modalSubmitText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  splitResultCard: {
    marginTop: 16,
    padding: 14,
    backgroundColor: '#FFF0F5',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(253, 92, 163, 0.25)',
    alignItems: 'center',
  },
  splitResultLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fd5ca3',
    textTransform: 'uppercase',
  },
  splitResultAmount: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0D0E15',
    marginTop: 4,
  },
});
