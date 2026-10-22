import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  Alert,
  ImageBackground,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

let idCounter = 200;
function generateId(prefix) {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

// Category lists matching app standard
const defaultExpenseCategories = [
  { id: 'coffee', name: 'Coffee', emoji: '☕' },
  { id: 'transport', name: 'Transport', emoji: '🚗' },
  { id: 'rent', name: 'Rent', emoji: '🏠' },
  { id: 'subscriptions', name: 'Subscriptions', emoji: '📱' },
  { id: 'utilities', name: 'Utilities', emoji: '💡' },
  { id: 'groceries', name: 'Groceries', emoji: '🛒' },
];

const moreExpenseCategories = [
  { id: 'food', name: 'Food & Dining', emoji: '🍔' },
  { id: 'shopping', name: 'Shopping', emoji: '🛍️' },
  { id: 'health', name: 'Healthcare', emoji: '💊' },
  { id: 'entertainment', name: 'Entertainment', emoji: '🎬' },
];

const defaultIncomeCategories = [
  { id: 'salary', name: 'Salary', emoji: '💰' },
  { id: 'allowance', name: 'Allowance', emoji: '💵' },
  { id: 'freelance', name: 'Freelance', emoji: '💼' },
  { id: 'investment', name: 'Investment', emoji: '📈' },
  { id: 'bonus', name: 'Bonus', emoji: '🎁' },
  { id: 'other', name: 'Other', emoji: '🪙' },
];

const initialTransactions = [
  {
    id: 'tx-1',
    title: 'Coffee',
    subtitle: 'Food & Dining',
    amount: 12,
    emoji: '☕',
    type: 'expense',
    category: 'Coffee',
    date: '15/10/26',
    day: 15,
    time: '8:10 PM',
  },
  {
    id: 'tx-2',
    title: 'Monthly Allowance',
    subtitle: 'Salary',
    amount: 800,
    emoji: '💰',
    type: 'income',
    category: 'Salary',
    date: '15/10/26',
    day: 15,
    time: '8:10 PM',
  },
  {
    id: 'tx-3',
    title: 'Rent',
    subtitle: 'Rent & Mortgage',
    amount: 150,
    emoji: '🏠',
    type: 'expense',
    category: 'Rent',
    isRecurring: true,
    date: '15/10/26',
    day: 15,
    time: '8:10 PM',
  },
  {
    id: 'tx-4',
    title: 'iCloud+',
    subtitle: 'Subscriptions',
    amount: 9,
    emoji: '📱',
    type: 'expense',
    category: 'Subscriptions',
    isRecurring: true,
    date: '15/10/26',
    day: 15,
    time: '8:10 PM',
  },
  {
    id: 'tx-5',
    title: 'Mobile Data',
    subtitle: 'Utilities & Bills',
    amount: 30,
    emoji: '💡',
    type: 'expense',
    category: 'Utilities',
    isRecurring: true,
    date: '15/10/26',
    day: 15,
    time: '8:10 PM',
  },
  {
    id: 'tx-6',
    title: 'Transport',
    subtitle: 'Transport',
    amount: 100,
    emoji: '🚗',
    type: 'expense',
    category: 'Transport',
    date: '15/10/26',
    day: 15,
    time: '8:10 PM',
  },
];

export default function TransactionsScreen() {
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'calendar'
  const [accountType, setAccountType] = useState('Personal');
  const [transactions, setTransactions] = useState(initialTransactions);

  // Calendar State (October 2026 by default)
  const [selectedDay, setSelectedDay] = useState(15);
  const [calendarMonth, setCalendarMonth] = useState('October 2026');

  // Modal State for Adding Transactions
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(defaultExpenseCategories[0]);
  const [transactionName, setTransactionName] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState('');

  // Dynamically calculate income and expense totals
  const totalIncome = useMemo(
    () =>
      transactions
        .filter((t) => t.type === 'income')
        .reduce((sum, item) => sum + item.amount, 0),
    [transactions]
  );

  const totalExpenses = useMemo(
    () =>
      transactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, item) => sum + item.amount, 0),
    [transactions]
  );

  // Group transactions for List View
  const groupedTransactions = useMemo(() => {
    const map = {};
    transactions.forEach((tx) => {
      const dateKey = tx.date === '15/10/26' ? 'Today' : tx.date;
      if (!map[dateKey]) {
        map[dateKey] = [];
      }
      map[dateKey].push(tx);
    });
    return map;
  }, [transactions]);

  // Days with transactions in current month
  const daysWithTransactions = useMemo(() => {
    const set = new Set();
    transactions.forEach((tx) => {
      if (tx.day) set.add(tx.day);
    });
    return set;
  }, [transactions]);

  // Transactions for selected calendar day
  const selectedDayTransactions = useMemo(() => {
    return transactions.filter((tx) => tx.day === selectedDay);
  }, [transactions, selectedDay]);

  const selectedDayIncome = useMemo(
    () =>
      selectedDayTransactions
        .filter((t) => t.type === 'income')
        .reduce((sum, item) => sum + item.amount, 0),
    [selectedDayTransactions]
  );

  const selectedDayExpense = useMemo(
    () =>
      selectedDayTransactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, item) => sum + item.amount, 0),
    [selectedDayTransactions]
  );

  // Open Log Modal (optionally preset day)
  const handleOpenModal = (presetDay = null) => {
    if (presetDay) {
      setSelectedDay(presetDay);
    }
    setTransactionType('expense');
    setAmount('');
    setSelectedCategory(defaultExpenseCategories[0]);
    setTransactionName('');
    setIsRecurring(false);
    setShowMore(false);
    setIsCustomCategory(false);
    setCustomCategoryName('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const alertMessage = (title, message) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  // Add Transaction
  const handleSaveTransaction = () => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alertMessage('Amount Required', 'Please enter a valid amount.');
      return;
    }

    let finalCategory = selectedCategory.name;
    let finalEmoji = selectedCategory.emoji;

    if (isCustomCategory && customCategoryName.trim()) {
      finalCategory = customCategoryName.trim();
      finalEmoji = transactionType === 'income' ? '💰' : '✨';
    }

    const finalTitle = transactionName.trim() || finalCategory;
    const targetDay = activeTab === 'calendar' ? selectedDay : 15;
    const formattedDate = `${String(targetDay).padStart(2, '0')}/10/26`;

    const newTx = {
      id: generateId('tx'),
      title: finalTitle,
      subtitle: finalCategory,
      amount: parsedAmount,
      emoji: finalEmoji,
      type: transactionType,
      category: finalCategory,
      isRecurring: transactionType === 'expense' && isRecurring,
      date: formattedDate,
      day: targetDay,
      time: '8:10 PM',
    };

    setTransactions((prev) => [newTx, ...prev]);
    setIsModalOpen(false);
  };

  // Delete Transaction
  const confirmDeleteTx = (id, title, txAmount) => {
    const doDelete = () => {
      setTransactions((prev) => prev.filter((item) => item.id !== id));
    };

    if (Platform.OS === 'web') {
      if (window.confirm(`Delete "${title}" (RM${txAmount})?`)) {
        doDelete();
      }
    } else {
      Alert.alert(
        'Delete Transaction',
        `Are you sure you want to remove "${title}" (RM${txAmount})?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: doDelete },
        ]
      );
    }
  };

  // Category list based on type
  const activeCategoryList =
    transactionType === 'income'
      ? defaultIncomeCategories
      : showMore
      ? [...defaultExpenseCategories, ...moreExpenseCategories]
      : defaultExpenseCategories;

  // Calendar calculations (October 2026 starts on Thursday -> 4 empty padding days)
  const paddingDays = [null, null, null, null]; // Sun, Mon, Tue, Wed empty
  const daysInOctober = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <ImageBackground
      source={require('../../../assets/images/login-bg.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Top Header Controls (Borderless) */}
            <View style={styles.headerRow}>
              <TouchableOpacity
                style={styles.pillButton}
                activeOpacity={0.8}
                onPress={() =>
                  setAccountType((prev) => (prev === 'Personal' ? 'Business' : 'Personal'))
                }
              >
                <Text style={styles.pillButtonText}>{accountType}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.dateFilterButton} activeOpacity={0.8}>
                <Text style={styles.dateFilterText}>Oct 2026</Text>
                <Ionicons
                  name="options-outline"
                  size={18}
                  color="#1E293B"
                  style={{ marginLeft: 6 }}
                />
              </TouchableOpacity>
            </View>

            {/* List / Calendar Segmented Switcher */}
            <View style={styles.segmentedContainer}>
              <TouchableOpacity
                style={[
                  styles.segmentButton,
                  activeTab === 'list' && styles.activeSegment,
                ]}
                onPress={() => setActiveTab('list')}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.segmentText,
                    activeTab === 'list' && styles.activeSegmentText,
                  ]}
                >
                  List
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.segmentButton,
                  activeTab === 'calendar' && styles.activeSegment,
                ]}
                onPress={() => setActiveTab('calendar')}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.segmentText,
                    activeTab === 'calendar' && styles.activeSegmentText,
                  ]}
                >
                  Calendar
                </Text>
              </TouchableOpacity>
            </View>

            {/* Income & Expenses Summary (Borderless Cards with Soft Shadow) */}
            <View style={styles.summaryRow}>
              <View style={styles.summaryBox}>
                <Text style={styles.summaryLabel}>My Income</Text>
                <Text style={styles.incomeAmount}>RM{totalIncome.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryBox}>
                <Text style={styles.summaryLabel}>My Expenses</Text>
                <Text style={styles.expenseAmount}>-RM{totalExpenses.toFixed(2)}</Text>
              </View>
            </View>

            {/* ----------------- TAB CONTENT ----------------- */}
            {activeTab === 'list' ? (
              /* ================== LIST VIEW ================== */
              <View>
                {Object.keys(groupedTransactions).length === 0 ? (
                  <View style={styles.emptyCard}>
                    <Text style={styles.emptyCardText}>No transactions recorded yet.</Text>
                    <TouchableOpacity
                      style={styles.addEmptyBtn}
                      onPress={() => handleOpenModal()}
                    >
                      <Text style={styles.addEmptyBtnText}>+ Add Transaction</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  Object.keys(groupedTransactions).map((dateKey) => (
                    <View key={dateKey}>
                      <Text style={styles.sectionTitle}>{dateKey}</Text>

                      {groupedTransactions[dateKey].map((tx) => {
                        const isIncome = tx.type === 'income';

                        return (
                          <TouchableOpacity
                            key={tx.id}
                            style={styles.card}
                            activeOpacity={0.7}
                            onPress={() => confirmDeleteTx(tx.id, tx.title, tx.amount)}
                          >
                            <View style={styles.itemLeft}>
                              <Text style={styles.emojiIcon}>{tx.emoji}</Text>
                              <View>
                                <Text style={styles.itemTitle}>{tx.title}</Text>
                                <Text style={styles.itemSubtitle}>
                                  {tx.subtitle ? `${tx.subtitle}   ` : ''}
                                  {tx.time}
                                </Text>
                              </View>
                            </View>
                            <Text
                              style={
                                isIncome ? styles.positiveAmount : styles.negativeAmount
                              }
                            >
                              {isIncome
                                ? `RM${tx.amount.toFixed(2)}`
                                : `-RM${tx.amount.toFixed(2)}`}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  ))
                )}
              </View>
            ) : (
              /* ================== CALENDAR VIEW ================== */
              <View>
                {/* Interactive Month Calendar Card (Borderless) */}
                <View style={styles.calendarCard}>
                  {/* Calendar Header with Navigation */}
                  <View style={styles.calendarHeader}>
                    <TouchableOpacity
                      onPress={() => setCalendarMonth('September 2026')}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="chevron-back" size={20} color="#0F172A" />
                    </TouchableOpacity>
                    <Text style={styles.calendarTitle}>{calendarMonth}</Text>
                    <TouchableOpacity
                      onPress={() => setCalendarMonth('November 2026')}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="chevron-forward" size={20} color="#0F172A" />
                    </TouchableOpacity>
                  </View>

                  {/* Weekday Names Row */}
                  <View style={styles.weekdaysRow}>
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                      <Text key={idx} style={styles.weekdayText}>
                        {day}
                      </Text>
                    ))}
                  </View>

                  {/* Days Grid for October 2026 */}
                  <View style={styles.daysGrid}>
                    {/* Empty cells before 1st of month */}
                    {paddingDays.map((_, i) => (
                      <View key={`pad-${i}`} style={styles.dayCell} />
                    ))}

                    {/* Day numbers */}
                    {daysInOctober.map((day) => {
                      const isSelected = day === selectedDay;
                      const hasTx = daysWithTransactions.has(day);

                      return (
                        <TouchableOpacity
                          key={`day-${day}`}
                          style={styles.dayCell}
                          onPress={() => setSelectedDay(day)}
                          activeOpacity={0.7}
                        >
                          <View
                            style={[
                              styles.dayPill,
                              isSelected && styles.dayPillSelected,
                            ]}
                          >
                            <Text
                              style={[
                                styles.dayText,
                                isSelected && styles.dayTextSelected,
                              ]}
                            >
                              {day}
                            </Text>
                          </View>
                          {/* Dot indicator if day has transactions */}
                          {hasTx && (
                            <View
                              style={[
                                styles.txDot,
                                isSelected && { backgroundColor: '#FFFFFF' },
                              ]}
                            />
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Day's Transactions Header */}
                <View style={styles.dayHeaderRow}>
                  <Text style={styles.sectionTitle}>
                    {selectedDay} Oct 2026
                  </Text>
                  <Text style={styles.dayTotalText}>
                    {selectedDayExpense > 0 && (
                      <Text style={{ color: '#EF4444' }}>
                        -RM{selectedDayExpense.toFixed(2)}{' '}
                      </Text>
                    )}
                    {selectedDayIncome > 0 && (
                      <Text style={{ color: '#10B981' }}>
                        +RM{selectedDayIncome.toFixed(2)}
                      </Text>
                    )}
                  </Text>
                </View>

                {/* Selected Day Transaction Items */}
                {selectedDayTransactions.length === 0 ? (
                  <View style={styles.emptyCard}>
                    <Text style={styles.emptyCardText}>
                      No transactions on {selectedDay} Oct.
                    </Text>
                    <TouchableOpacity
                      style={styles.addEmptyBtn}
                      onPress={() => handleOpenModal(selectedDay)}
                    >
                      <Text style={styles.addEmptyBtnText}>
                        + Log transaction for this day
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  selectedDayTransactions.map((tx) => {
                    const isIncome = tx.type === 'income';

                    return (
                      <TouchableOpacity
                        key={tx.id}
                        style={styles.card}
                        activeOpacity={0.7}
                        onPress={() => confirmDeleteTx(tx.id, tx.title, tx.amount)}
                      >
                        <View style={styles.itemLeft}>
                          <Text style={styles.emojiIcon}>{tx.emoji}</Text>
                          <View>
                            <Text style={styles.itemTitle}>{tx.title}</Text>
                            <Text style={styles.itemSubtitle}>
                              {tx.subtitle ? `${tx.subtitle}   ` : ''}
                              {tx.time}
                            </Text>
                          </View>
                        </View>
                        <Text
                          style={
                            isIncome ? styles.positiveAmount : styles.negativeAmount
                          }
                        >
                          {isIncome
                            ? `RM${tx.amount.toFixed(2)}`
                            : `-RM${tx.amount.toFixed(2)}`}
                        </Text>
                      </TouchableOpacity>
                    );
                  })
                )}
              </View>
            )}
          </ScrollView>

          {/* Floating Action Button (FAB) with color #fd5ca3 */}
          <TouchableOpacity
            style={styles.fab}
            activeOpacity={0.8}
            onPress={() => handleOpenModal()}
          >
            <Ionicons name="add" size={32} color="#FFFFFF" />
          </TouchableOpacity>

          {/* LOG TRANSACTION MODAL (MATCHING APP COLOR #fd5ca3 & SCREENSHOT) */}
          <Modal
            visible={isModalOpen}
            animationType="slide"
            presentationStyle="fullScreen"
            onRequestClose={handleCloseModal}
          >
            <SafeAreaView style={styles.logModalSafeArea}>
              <ScrollView
                contentContainerStyle={styles.logModalScroll}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {/* Header with Cancel Button & Title */}
                <View style={styles.logHeaderRow}>
                  <TouchableOpacity
                    style={styles.logCancelBtn}
                    onPress={handleCloseModal}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.logCancelText}>Cancel</Text>
                  </TouchableOpacity>

                  <Text style={styles.logHeaderTitle}>Log Transaction</Text>
                  <View style={{ width: 70 }} />
                </View>

                {/* Expense / Income Switcher */}
                <View style={styles.logSegmentedBox}>
                  <TouchableOpacity
                    style={[
                      styles.logSegmentTab,
                      transactionType === 'expense' && styles.logSegmentTabActive,
                    ]}
                    onPress={() => {
                      setTransactionType('expense');
                      setSelectedCategory(defaultExpenseCategories[0]);
                      setIsCustomCategory(false);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.logSegmentText,
                        transactionType === 'expense' && styles.logSegmentTextActive,
                      ]}
                    >
                      Expense
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.logSegmentTab,
                      transactionType === 'income' && styles.logSegmentTabActive,
                    ]}
                    onPress={() => {
                      setTransactionType('income');
                      setSelectedCategory(defaultIncomeCategories[0]);
                      setIsCustomCategory(false);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.logSegmentText,
                        transactionType === 'income' && styles.logSegmentTextActive,
                      ]}
                    >
                      Income
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Centered Amount Input */}
                <View style={styles.logAmountSection}>
                  <Text style={styles.logAmountCurrency}>RM</Text>
                  <TextInput
                    style={styles.logAmountInput}
                    placeholder="0.00"
                    placeholderTextColor="#CBD5E1"
                    keyboardType="decimal-pad"
                    value={amount}
                    onChangeText={setAmount}
                    autoFocus={Platform.OS !== 'web'}
                  />
                </View>

                {/* Category Section */}
                <Text style={styles.logCategoryHeader}>Category</Text>

                <View style={styles.logCategoryGrid}>
                  {activeCategoryList.map((cat) => {
                    const isSelected = !isCustomCategory && selectedCategory.id === cat.id;

                    return (
                      <TouchableOpacity
                        key={cat.id}
                        style={[
                          styles.logCategoryPill,
                          isSelected && styles.logCategoryPillActive,
                        ]}
                        onPress={() => {
                          setSelectedCategory(cat);
                          setIsCustomCategory(false);
                        }}
                        activeOpacity={0.7}
                      >
                        <Text style={{ fontSize: 16 }}>{cat.emoji}</Text>
                        <Text
                          style={[
                            styles.logCategoryText,
                            isSelected && styles.logCategoryTextActive,
                          ]}
                        >
                          {cat.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}

                  {/* More Button */}
                  <TouchableOpacity
                    style={[
                      styles.logCategoryPill,
                      showMore && styles.logCategoryPillActive,
                    ]}
                    onPress={() => setShowMore((prev) => !prev)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.logCategoryText,
                        showMore && styles.logCategoryTextActive,
                        { marginLeft: 0 },
                      ]}
                    >
                      {showMore ? 'Less' : 'More'}
                    </Text>
                  </TouchableOpacity>

                  {/* Custom Button */}
                  <TouchableOpacity
                    style={[
                      styles.logCategoryPill,
                      isCustomCategory && styles.logCategoryPillActive,
                    ]}
                    onPress={() => setIsCustomCategory(true)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.logCategoryText,
                        isCustomCategory && styles.logCategoryTextActive,
                        { marginLeft: 0 },
                      ]}
                    >
                      Custom
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Custom Category Input if Custom Selected */}
                {isCustomCategory && (
                  <View style={styles.customCategoryRow}>
                    <TextInput
                      style={styles.customCategoryInput}
                      placeholder="Type custom category name..."
                      placeholderTextColor="#94A3B8"
                      value={customCategoryName}
                      onChangeText={setCustomCategoryName}
                    />
                  </View>
                )}

                {/* Form List: Name, Date, Recurring */}
                <View style={styles.logFormContainer}>
                  {/* Name Row */}
                  <View style={styles.logFormRow}>
                    <Text style={styles.logFormLabel}>Name</Text>
                    <TextInput
                      style={styles.logNameInput}
                      placeholder="Optional"
                      placeholderTextColor="#94A3B8"
                      value={transactionName}
                      onChangeText={setTransactionName}
                    />
                  </View>
                  <View style={styles.logFormDivider} />

                  {/* Date Row */}
                  <View style={styles.logFormRow}>
                    <Text style={styles.logFormLabel}>Date</Text>
                    <View style={styles.logDatePillsRow}>
                      <View style={styles.logDateBadge}>
                        <Text style={styles.logDateBadgeText}>
                          {`${String(activeTab === 'calendar' ? selectedDay : 15).padStart(2, '0')}/10/26`}
                        </Text>
                      </View>
                      <View style={styles.logDateBadge}>
                        <Text style={styles.logDateBadgeText}>8:10 PM</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.logFormDivider} />

                  {/* Recurring Row */}
                  <View style={styles.logFormRow}>
                    <Text style={styles.logFormLabel}>Recurring</Text>
                    <Switch
                      value={isRecurring}
                      onValueChange={setIsRecurring}
                      trackColor={{ false: '#CBD5E1', true: '#fd5ca3' }}
                      thumbColor="#FFFFFF"
                      ios_backgroundColor="#CBD5E1"
                    />
                  </View>
                </View>

                {/* Big Pink Add Button */}
                <TouchableOpacity
                  style={styles.logAddButton}
                  activeOpacity={0.8}
                  onPress={handleSaveTransaction}
                >
                  <Text style={styles.logAddButtonText}>Add</Text>
                </TouchableOpacity>
              </ScrollView>
            </SafeAreaView>
          </Modal>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  container: {
    flex: 1,
    maxWidth: 430,
    width: '100%',
    alignSelf: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 110,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  pillButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  pillButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  dateFilterButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  dateFilterText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 25,
    padding: 4,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 22,
  },
  activeSegment: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  segmentText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
  },
  activeSegmentText: {
    color: '#0F172A',
    fontWeight: '700',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  incomeAmount: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  expenseAmount: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  emojiIcon: {
    fontSize: 24,
    marginRight: 14,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  itemSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  negativeAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#EF4444',
  },
  positiveAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10B981',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  emptyCardText: {
    fontSize: 15,
    color: '#94A3B8',
    marginBottom: 12,
  },
  addEmptyBtn: {
    backgroundColor: '#FCE7F3',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 16,
  },
  addEmptyBtnText: {
    color: '#fd5ca3',
    fontWeight: '700',
    fontSize: 14,
  },
  // Calendar View Styles
  calendarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  calendarTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  weekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  weekdayText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94A3B8',
    width: 36,
    textAlign: 'center',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayPill: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayPillSelected: {
    backgroundColor: '#fd5ca3',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  dayTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  txDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#fd5ca3',
    marginTop: 2,
  },
  dayHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dayTotalText: {
    fontSize: 14,
    fontWeight: '700',
  },
  fab: {
    position: 'absolute',
    bottom: 95,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fd5ca3',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#fd5ca3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    zIndex: 101,
  },

  // ----------------------------------------------------
  // LOG TRANSACTION MODAL STYLES (#fd5ca3)
  // ----------------------------------------------------
  logModalSafeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    maxWidth: 430,
    width: '100%',
    alignSelf: 'center',
  },
  logModalScroll: {
    paddingBottom: 40,
  },
  logHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 16 : 8,
    paddingBottom: 10,
  },
  logCancelBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  logCancelText: {
    color: '#fd5ca3',
    fontSize: 15,
    fontWeight: '600',
  },
  logHeaderTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000000',
  },
  logSegmentedBox: {
    flexDirection: 'row',
    backgroundColor: '#EBECEF',
    borderRadius: 24,
    padding: 3,
    marginHorizontal: 20,
    marginTop: 14,
    marginBottom: 10,
  },
  logSegmentTab: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 21,
  },
  logSegmentTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  logSegmentText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  logSegmentTextActive: {
    color: '#000000',
    fontWeight: '700',
  },
  logAmountSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
  },
  logAmountCurrency: {
    fontSize: 22,
    fontWeight: '800',
    color: '#000000',
    marginRight: 6,
  },
  logAmountInput: {
    fontSize: 36,
    fontWeight: '800',
    color: '#000000',
    minWidth: 70,
    textAlign: 'left',
  },
  logCategoryHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  logCategoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  logCategoryPill: {
    width: '48.5%',
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  logCategoryPillActive: {
    backgroundColor: '#fd5ca3',
  },
  logCategoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginLeft: 6,
  },
  logCategoryTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  customCategoryRow: {
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  customCategoryInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 44,
    fontSize: 14,
    color: '#0F172A',
  },
  logFormContainer: {
    paddingHorizontal: 20,
    marginTop: 6,
  },
  logFormRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  logFormLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  logNameInput: {
    fontSize: 15,
    color: '#000000',
    textAlign: 'right',
    flex: 1,
    marginLeft: 20,
  },
  logDatePillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logDateBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    marginLeft: 8,
  },
  logDateBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  logFormDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  logAddButton: {
    backgroundColor: '#fd5ca3',
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 28,
    marginBottom: 20,
    shadowColor: '#fd5ca3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  logAddButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});