import { useRouter } from 'expo-router';
import { useState } from 'react';
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
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AICoachChatModal from '../../components/AICoachChatModal';
import AppBackground from '../../components/AppBackground';
import EditProfileModal from '../../components/EditProfileModal';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  // App & Language Context
  const {
    totalIncome,
    totalExpenses,
    leftThisMonth,
    recurringExpenses,
    triggerAutoSpendingNotification,
    resetAllFinancialData,
    userProfile,
    setUserProfile,
  } = useApp();

  const { language, setLanguage, t } = useLanguage();

  // Modal States
  const [isAICoachVisible, setIsAICoachVisible] = useState(false);
  const [isLoanModalVisible, setIsLoanModalVisible] = useState(false);
  const [isEditProfileVisible, setIsEditProfileVisible] = useState(false);
  const [isLiveActivityActive, setIsLiveActivityActive] = useState(true);

  // Loan Calculator Form State
  const [loanAmount, setLoanAmount] = useState('25000');
  const [loanInterest, setLoanInterest] = useState('4.2');
  const [loanYears, setLoanYears] = useState('5');
  const [monthlyInstallment, setMonthlyInstallment] = useState(null);

  // 4-Column Responsive Grid Calculations
  const gridPadding = 40; // 20px padding on each side
  const gridGap = 10;
  const numColumns = 4;
  const gridItemWidth = Math.floor((width - gridPadding - (numColumns - 1) * gridGap) / numColumns);

  // Dynamic Menus localized with t(key)
  const everydayItems = [
    { id: 'coach', emoji: '🤖', label: t('menu_coach') },
    { id: 'loan_calc', emoji: '🧮', label: t('menu_loan_calc') },
    { id: 'categories', emoji: '🏷️', label: t('menu_categories') },
    { id: 'item_prices', emoji: '🛒', label: t('menu_item_prices') },
    { id: 'who_owes_who', emoji: '👥', label: t('menu_who_owes_who') },
    { id: 'trips', emoji: '✈️', label: t('menu_trips') },
    { id: 'reminders', emoji: '🔔', label: t('menu_reminders') },
    { id: 'chill_lock', emoji: '🔒', label: t('menu_chill_lock') },
  ];

  const advancedItems = [
    { id: 'recurring', emoji: '🔄', label: t('menu_recurring') },
    { id: 'smart_automation', emoji: '⚡', label: t('menu_smart_automation') },
    { id: 'live_activity', emoji: '📱', label: t('menu_live_activity') },
  ];

  // Handlers
  const handleOpenEditProfile = () => {
    setIsEditProfileVisible(true);
  };

  const handleSaveProfile = (updated) => {
    setUserProfile({
      name: updated.name,
      email: updated.email,
      avatar: updated.avatar,
      dailyBudget: updated.dailyBudget,
    });
    setLanguage(updated.language);
    Alert.alert(
      t('profile_updated'),
      t('profile_updated_desc')
    );
  };

  const handleClearAllData = () => {
    Alert.alert(
      t('alert_clear_data_title'),
      t('alert_clear_data_msg'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('alert_clear_data_confirm'),
          style: 'destructive',
          onPress: () => {
            resetAllFinancialData();
            Alert.alert(
              language === 'BM' ? 'Data Berjaya Dipadam' : 'Data Cleared',
              t('alert_clear_data_success')
            );
          },
        },
      ]
    );
  };

  const handleSignOut = () => {
    Alert.alert(
      t('alert_sign_out_title'),
      t('alert_sign_out_msg'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('menu_sign_out'),
          style: 'destructive',
          onPress: () => router.replace('/login'),
        },
      ]
    );
  };

  const handleCalculateLoan = () => {
    const P = parseFloat(loanAmount);
    const annualRate = parseFloat(loanInterest) / 100;
    const n = parseFloat(loanYears) * 12;

    if (isNaN(P) || isNaN(annualRate) || isNaN(n) || n <= 0) {
      Alert.alert('Invalid Input', 'Please enter valid numbers for loan calculation.');
      return;
    }

    const r = annualRate / 12;
    if (r === 0) {
      setMonthlyInstallment(P / n);
      return;
    }

    const payment = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    setMonthlyInstallment(Math.round(payment * 100) / 100);
  };

  const handleEverydayItemPress = (item) => {
    switch (item.id) {
      case 'coach':
        setIsAICoachVisible(true);
        break;
      case 'loan_calc':
        setMonthlyInstallment(null);
        setIsLoanModalVisible(true);
        break;
      case 'categories':
        Alert.alert(
          '🏷️ ' + t('menu_categories'),
          language === 'BM'
            ? 'Urus kategori perbelanjaan & pendapatan anda:\n• Kopi ☕\n• Pengangkutan 🚗\n• Sewa 🏠\n• Langganan 📱\n• Utiliti 💡\n• Barangan Dapur 🛒'
            : 'Manage your income & expense categories:\n• Coffee ☕\n• Transport 🚗\n• Rent 🏠\n• Subscriptions 📱\n• Utilities 💡\n• Groceries 🛒'
        );
        break;
      case 'item_prices':
        Alert.alert(
          '🛒 ' + t('menu_item_prices'),
          language === 'BM'
            ? 'Log penjejak harga barangan harian & inflasi runcit.'
            : 'Price tracker & inflation comparison log for regular groceries and retail essentials.'
        );
        break;
      case 'who_owes_who':
        router.push('/who-owes-who');
        break;
      case 'trips':
        Alert.alert(
          '✈️ ' + t('menu_trips'),
          language === 'BM'
            ? 'Sampul bajet percutian & log trip berkumpulan dengan tukaran mata wang.'
            : 'Travel envelopes & group holiday trip logs with multi-currency conversion.'
        );
        break;
      case 'reminders':
        Alert.alert(
          '🔔 ' + t('menu_reminders'),
          language === 'BM'
            ? 'Peringatan semakan kewangan harian ditetapkan pada jam 8:00 malam.'
            : 'Daily evening financial check-in alert configured for 8:00 PM.'
        );
        break;
      case 'chill_lock':
        router.push('/(tabs)/transactions?mode=chill-lock');
        break;
      default:
        break;
    }
  };

  const handleAdvancedItemPress = (item) => {
    switch (item.id) {
      case 'recurring':
        Alert.alert(
          '🔄 ' + t('menu_recurring'),
          language === 'BM'
            ? `Anda mempunyai ${recurringExpenses.length} komitmen berulang aktif berjumlah RM ${(
              recurringExpenses.reduce((sum, it) => sum + it.amount, 0)
            ).toFixed(2)}/bulan.`
            : `You have ${recurringExpenses.length} active recurring commitments totaling RM ${(
              recurringExpenses.reduce((sum, it) => sum + it.amount, 0)
            ).toFixed(2)}/month.`
        );
        break;
      case 'smart_automation':
        triggerAutoSpendingNotification(
          'Maybank MAE',
          'Starbucks Reserve',
          18.50,
          '☕',
          'Coffee'
        );
        Alert.alert(
          '⚡ ' + t('menu_smart_automation'),
          language === 'BM'
            ? 'Simulasi rekod perbelanjaan automatik dicetuskan melalui pengesan notifikasi SMS/MAE.'
            : 'Simulated automatic spending log triggered via background notification webhook.'
        );
        break;
      case 'live_activity': {
        const nextState = !isLiveActivityActive;
        setIsLiveActivityActive(nextState);
        Alert.alert(
          '📱 ' + t('menu_live_activity'),
          nextState
            ? (language === 'BM' ? 'Widget Dynamic Island & Skrin Kunci kini Aktif.' : 'Dynamic Island & Lock Screen budget widget is now Active.')
            : (language === 'BM' ? 'Widget Dynamic Island telah dijeda.' : 'Dynamic Island widget has been paused.')
        );
        break;
      }
      default:
        break;
    }
  };

  return (
    <AppBackground opacity={1.0} style={styles.gradientContainer}>
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Title per design.md (24px, Semi-Bold) */}
          <Text style={styles.headerTitle}>
            {t('profile_title')}
          </Text>

          {/* ==================================================== */}
          {/* 1. Clean User Profile Header (Top) */}
          {/* Displays Avatar / Initials, Display Name, and Email ONLY */}
          {/* ==================================================== */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>{userProfile.avatar}</Text>
            </View>
            <Text style={styles.userName}>{userProfile.name}</Text>
            <Text style={styles.userEmail}>{userProfile.email}</Text>
          </View>

          {/* ==================================================== */}
          {/* 2. EVERYDAY SECTION (8 Items - 2x4 Grid) */}
          {/* ==================================================== */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{t('everyday_section')}</Text>
            <View style={styles.gridContainer}>
              {everydayItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.7}
                  onPress={() => handleEverydayItemPress(item)}
                  style={[
                    styles.gridCard,
                    {
                      width: gridItemWidth,
                      height: gridItemWidth,
                    },
                  ]}
                >
                  <Text style={styles.gridEmoji}>{item.emoji}</Text>
                  <Text numberOfLines={2} style={styles.gridLabel}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ==================================================== */}
          {/* 3. ADVANCED SECTION (3 Items - 4-Column Grid) */}
          {/* ==================================================== */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{t('advanced_section')}</Text>
            <View style={styles.gridContainer}>
              {advancedItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.7}
                  onPress={() => handleAdvancedItemPress(item)}
                  style={[
                    styles.gridCard,
                    {
                      width: gridItemWidth,
                      height: gridItemWidth,
                    },
                  ]}
                >
                  <Text style={styles.gridEmoji}>{item.emoji}</Text>
                  <Text numberOfLines={2} style={styles.gridLabel}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ==================================================== */}
          {/* 4. ACCOUNT SECTION (List Container Layout) */}
          {/* ==================================================== */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{t('account_section')}</Text>
            <View style={styles.card}>
              {/* Item 1: Edit Profile */}
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.listItem}
                onPress={handleOpenEditProfile}
              >
                <View style={styles.listLeft}>
                  <View style={styles.listIconContainer}>
                    <Text style={styles.listEmoji}>✏️</Text>
                  </View>
                  <View>
                    <Text style={styles.listTitle}>{t('menu_edit_profile')}</Text>
                    <Text style={styles.listSubtitle}>{t('menu_edit_profile_desc')}</Text>
                  </View>
                </View>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              {/* Item 2: Clear all of my data */}
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.listItem}
                onPress={handleClearAllData}
              >
                <View style={styles.listLeft}>
                  <View style={styles.listIconContainer}>
                    <Text style={styles.listEmoji}>🗑️</Text>
                  </View>
                  <View>
                    <Text style={styles.listTitle}>{t('menu_clear_data')}</Text>
                    <Text style={styles.listSubtitle}>{t('menu_clear_data_desc')}</Text>
                  </View>
                </View>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              {/* Item 3: Sign Out (Red accent button) */}
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.listItem}
                onPress={handleSignOut}
              >
                <View style={styles.listLeft}>
                  <View style={styles.listIconContainer}>
                    <Text style={styles.listEmoji}>🚪</Text>
                  </View>
                  <View>
                    <Text style={[styles.listTitle, styles.dangerText]}>{t('menu_sign_out')}</Text>
                    <Text style={styles.listSubtitle}>{t('menu_sign_out_desc')}</Text>
                  </View>
                </View>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* App Version Info Footer */}
          <View style={styles.footerInfo}>
            <Text style={styles.versionText}>CashCompass v1.0.0</Text>
            <Text style={styles.taglineText}>{t('version_tagline')}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* ==================================================== */}
      {/* Modal 1: Edit Profile Screen / Modal Component */}
      {/* ==================================================== */}
      <EditProfileModal
        visible={isEditProfileVisible}
        onClose={() => setIsEditProfileVisible(false)}
        currentProfile={userProfile}
        currentLanguage={language}
        onSave={handleSaveProfile}
      />

      {/* ==================================================== */}
      {/* Modal 2: AI Coach Chat Modal */}
      {/* ==================================================== */}
      <AICoachChatModal
        visible={isAICoachVisible}
        onClose={() => setIsAICoachVisible(false)}
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        leftThisMonth={leftThisMonth}
      />

      {/* ==================================================== */}
      {/* Modal 3: Loan Calculator Modal */}
      {/* ==================================================== */}
      <Modal
        visible={isLoanModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsLoanModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
          style={styles.modalOverlay}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitleRow}>
                <Text style={styles.modalHeaderEmoji}>🧮</Text>
                <Text style={styles.modalHeaderTitle}>{t('menu_loan_calc')}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsLoanModalVisible(false)}
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
                <Text style={styles.modalLabel}>Loan Amount (RM)</Text>
                <TextInput
                  value={loanAmount}
                  onChangeText={setLoanAmount}
                  keyboardType="numeric"
                  placeholder="25000"
                  placeholderTextColor="#999999"
                  style={styles.modalInput}
                />
              </View>

              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>Annual Interest Rate (% p.a.)</Text>
                <TextInput
                  value={loanInterest}
                  onChangeText={setLoanInterest}
                  keyboardType="numeric"
                  placeholder="4.2"
                  placeholderTextColor="#999999"
                  style={styles.modalInput}
                />
              </View>

              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>Tenure Period (Years)</Text>
                <TextInput
                  value={loanYears}
                  onChangeText={setLoanYears}
                  keyboardType="numeric"
                  placeholder="5"
                  placeholderTextColor="#999999"
                  style={styles.modalInput}
                />
              </View>

              {monthlyInstallment !== null && (
                <View style={styles.loanResultCard}>
                  <Text style={styles.loanResultLabel}>Estimated Monthly Installment</Text>
                  <Text style={styles.loanResultValue}>
                    RM {monthlyInstallment.toFixed(2)}
                  </Text>
                </View>
              )}

              <TouchableOpacity
                onPress={handleCalculateLoan}
                activeOpacity={0.8}
                style={styles.modalCalculateButton}
              >
                <Text style={styles.modalCalculateText}>Calculate Installment</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </AppBackground>
  );
}

// ==========================================
// Design Tokens & Styles from design.md
// ==========================================

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 110, // per design.md: 110px paddingBottom to clear floating tab bar
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24, // per design.md: 24px, Semi-Bold
    fontWeight: '700',
    color: '#0D0E15', // per design.md: Teks Utama #0D0E15
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarPlaceholder: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#FFF0F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(233, 30, 99, 0.15)',
  },
  avatarInitial: {
    fontSize: 30,
    fontWeight: '800',
    color: '#fd5ca3', // per design.md: pink accent #fd5ca3 / #E91E63
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0D0E15', // per design.md: #0D0E15
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666666', // per design.md: Teks Sekunder #666666
  },
  sectionContainer: {
    width: '100%',
    marginBottom: 20, // per design.md: marginBottom 16-20
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#666666', // per design.md: #666666
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  // 4-Column Grid per user specification
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  // Square rounded card (aspect-square) with centered emoji and text label below
  gridCard: {
    backgroundColor: '#FFFFFF', // per design.md: #FFFFFF
    borderRadius: 18, // per design.md: 18px untuk kad
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.04)', // per design.md: borderWidth 1, rgba(0, 0, 0, 0.04)
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    aspectRatio: 1,
  },
  gridEmoji: {
    fontSize: 26,
    marginBottom: 5,
    textAlign: 'center',
  },
  gridLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#0D0E15',
    textAlign: 'center',
    lineHeight: 13,
  },
  // Full-width Flat White Card per design.md
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.04)',
    overflow: 'hidden',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  listLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  listIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  listEmoji: {
    fontSize: 18,
  },
  listTitle: {
    fontSize: 15, // per design.md: 15px, Medium/Semi-Bold
    fontWeight: '600',
    color: '#0D0E15',
  },
  listSubtitle: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  chevron: {
    fontSize: 18,
    fontWeight: '700',
    color: '#999999',
    marginLeft: 8,
  },
  dangerText: {
    color: '#EF4444',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.04)', // per design.md: subtle divider
    marginLeft: 66, // aligned with text start
  },
  footerInfo: {
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 20,
  },
  versionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888888',
    marginBottom: 2,
  },
  taglineText: {
    fontSize: 11,
    color: '#AAAAAA',
  },
  // Modal styles
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
  loanResultCard: {
    marginTop: 16,
    padding: 14,
    backgroundColor: '#FFF0F5',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(253, 92, 163, 0.25)',
    alignItems: 'center',
  },
  loanResultLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fd5ca3',
    textTransform: 'uppercase',
  },
  loanResultValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0D0E15',
    marginTop: 4,
  },
  modalCalculateButton: {
    backgroundColor: '#fd5ca3', // per design.md: #fd5ca3 / #E91E63
    borderRadius: 27, // per design.md: bulat penuh untuk butang (27px)
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  modalCalculateText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});