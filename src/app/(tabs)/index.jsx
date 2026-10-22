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

let idCounter = 100;
function generateId(prefix) {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

// Default Categories from Screenshot
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

export default function HomeScreen() {
  // Account & Month Filter States
  const [accountType, setAccountType] = useState('Personal');
  const [selectedMonth, setSelectedMonth] = useState('Oct');

  // Income State
  const [incomes, setIncomes] = useState([
    { id: 'inc-1', title: 'Salary', amount: 800, emoji: '💰', category: 'Salary' },
  ]);

  // Recurring Expenses State (Commitments)
  const [recurringExpenses, setRecurringExpenses] = useState([
    {
      id: 'rec-1',
      title: 'Subscriptions',
      amount: 9,
      emoji: '📱',
      category: 'Subscriptions',
      limit: 36,
    },
    {
      id: 'rec-2',
      title: 'Rent & Mortgage',
      amount: 150,
      emoji: '🏠',
      category: 'Rent & Mortgage',
    },
    {
      id: 'rec-3',
      title: 'Utilities & Bills',
      amount: 30,
      emoji: '💡',
      category: 'Utilities & Bills',
    },
  ]);

  // Regular / Variable Expenses State
  const [expenses, setExpenses] = useState([
    {
      id: 'exp-1',
      title: 'Coffee & Snacks',
      amount: 12,
      emoji: '☕',
      category: 'Coffee',
    },
  ]);

  // Log Transaction Modal State (Matching User Screenshot)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState('expense'); // 'expense' | 'income'
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(defaultExpenseCategories[0]);
  const [transactionName, setTransactionName] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState('');

  // Fixed Date & Time display matching the screenshot
  const displayDate = '15/10/26';
  const displayTime = '12:36 AM';

  // Expense Detail Modal State (Matching User Screenshots 1 & 2)
  const [selectedExpenseDetail, setSelectedExpenseDetail] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditLimitModalOpen, setIsEditLimitModalOpen] = useState(false);
  const [newLimitValue, setNewLimitValue] = useState('');

  // Calculated Totals
  const totalIncome = useMemo(
    () => incomes.reduce((sum, item) => sum + item.amount, 0),
    [incomes]
  );

  const totalRecurring = useMemo(
    () => recurringExpenses.reduce((sum, item) => sum + item.amount, 0),
    [recurringExpenses]
  );

  const totalRegularExpenses = useMemo(
    () => expenses.reduce((sum, item) => sum + item.amount, 0),
    [expenses]
  );

  const totalExpenses = totalRecurring + totalRegularExpenses;
  const leftThisMonth = totalIncome - totalExpenses;

  // Subscriptions Progress Calculation
  const subscriptionItem = recurringExpenses.find(
    (item) => item.category === 'Subscriptions' || item.title === 'Subscriptions'
  );
  const subscriptionAmount = subscriptionItem ? subscriptionItem.amount : 0;
  const subscriptionLimit = subscriptionItem?.limit || 36;
  const subscriptionProgressPercent = Math.min(
    100,
    Math.round((subscriptionAmount / subscriptionLimit) * 100)
  );

  // Group Expenses for Statistics & Pie Chart
  const categoryStats = useMemo(() => {
    const map = {};
    const allExpenses = [
      ...recurringExpenses.map((r) => ({ ...r, isRecurring: true })),
      ...expenses.map((e) => ({ ...e, isRecurring: false })),
    ];

    allExpenses.forEach((item) => {
      const cat = item.category || item.title;
      if (!map[cat]) {
        let color = '#60A5FA';
        const lower = cat.toLowerCase();
        if (lower.includes('rent') || lower.includes('mortg') || lower.includes('hous')) {
          color = '#60A5FA'; // Blue
        } else if (lower.includes('utilit') || lower.includes('bill')) {
          color = '#A855F7'; // Purple
        } else if (lower.includes('subscrip') || lower.includes('stream') || lower.includes('cloud')) {
          color = '#F97316'; // Orange
        } else if (lower.includes('coffee') || lower.includes('food') || lower.includes('snack')) {
          color = '#fd5ca3'; // Pink / Rose
        } else if (lower.includes('transp') || lower.includes('fuel') || lower.includes('car')) {
          color = '#10B981'; // Emerald
        } else if (lower.includes('grocer') || lower.includes('market')) {
          color = '#06B6D4'; // Cyan
        } else {
          color = '#F59E0B'; // Amber
        }

        map[cat] = {
          name: cat,
          amount: 0,
          color,
        };
      }
      map[cat].amount += item.amount;
    });

    const total = Object.values(map).reduce((sum, c) => sum + c.amount, 0);

    return Object.values(map)
      .map((c) => ({
        ...c,
        percentage: total > 0 ? Math.round((c.amount / total) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [recurringExpenses, expenses]);

  // Monthly Expenses History Data (Oct is live tied to totalExpenses)
  const monthlyExpensesData = useMemo(
    () => [
      { month: 'May', amount: 140 },
      { month: 'Jun', amount: 210 },
      { month: 'Jul', amount: 175 },
      { month: 'Aug', amount: 230 },
      { month: 'Sep', amount: 160 },
      { month: 'Oct', amount: totalExpenses },
    ],
    [totalExpenses]
  );

  const selectedMonthData =
    monthlyExpensesData.find((m) => m.month === selectedMonth) ||
    monthlyExpensesData[5];

  const maxExpenseInMonths = useMemo(() => {
    const maxVal = Math.max(...monthlyExpensesData.map((d) => d.amount));
    return maxVal > 0 ? maxVal : 250;
  }, [monthlyExpensesData]);

  // Open Log Transaction Modal
  const handleOpenModal = () => {
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

  // Close Modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Helper for Cross-Platform Alerts
  const alertMessage = (title, message) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  // Open Expense Detail Modal
  const handleOpenExpenseDetail = (item, type) => {
    setSelectedExpenseDetail({
      ...item,
      type,
      date: item.date || 'Oct 21, 2026',
      time: item.time || '11:52 PM',
    });
    setIsMenuOpen(false);
  };

  // Open Edit Limit Modal
  const handleOpenEditLimit = () => {
    setIsMenuOpen(false);
    setNewLimitValue(
      selectedExpenseDetail?.limit ? String(selectedExpenseDetail.limit) : ''
    );
    setIsEditLimitModalOpen(true);
  };

  // Save Limit
  const handleSaveLimit = () => {
    const parsedLimit = parseFloat(newLimitValue);
    if (isNaN(parsedLimit) || parsedLimit <= 0) {
      alertMessage('Invalid Limit', 'Please enter a valid limit amount greater than 0.');
      return;
    }

    if (selectedExpenseDetail?.type === 'recurring') {
      setRecurringExpenses((prev) =>
        prev.map((it) =>
          it.id === selectedExpenseDetail.id ? { ...it, limit: parsedLimit } : it
        )
      );
    } else {
      setExpenses((prev) =>
        prev.map((it) =>
          it.id === selectedExpenseDetail.id ? { ...it, limit: parsedLimit } : it
        )
      );
    }

    setSelectedExpenseDetail((prev) =>
      prev ? { ...prev, limit: parsedLimit } : null
    );
    setIsEditLimitModalOpen(false);
    alertMessage('Limit Updated', `Monthly limit set to RM${parsedLimit.toFixed(2)}.`);
  };

  // Remove Limit
  const handleRemoveLimit = () => {
    setIsMenuOpen(false);
    if (!selectedExpenseDetail) return;

    if (selectedExpenseDetail.type === 'recurring') {
      setRecurringExpenses((prev) =>
        prev.map((it) =>
          it.id === selectedExpenseDetail.id ? { ...it, limit: undefined } : it
        )
      );
    } else {
      setExpenses((prev) =>
        prev.map((it) =>
          it.id === selectedExpenseDetail.id ? { ...it, limit: undefined } : it
        )
      );
    }

    setSelectedExpenseDetail((prev) =>
      prev ? { ...prev, limit: undefined } : null
    );
    alertMessage('Limit Removed', `Limit for ${selectedExpenseDetail.title} has been removed.`);
  };

  // Delete from Detail Screen
  const handleDeleteFromDetail = () => {
    if (!selectedExpenseDetail) return;

    const doDelete = () => {
      if (selectedExpenseDetail.type === 'recurring') {
        setRecurringExpenses((prev) =>
          prev.filter((it) => it.id !== selectedExpenseDetail.id)
        );
      } else {
        setExpenses((prev) =>
          prev.filter((it) => it.id !== selectedExpenseDetail.id)
        );
      }
      setSelectedExpenseDetail(null);
    };

    if (Platform.OS === 'web') {
      if (
        window.confirm(
          `Delete "${selectedExpenseDetail.title}" (-RM${selectedExpenseDetail.amount})?`
        )
      ) {
        doDelete();
      }
    } else {
      Alert.alert(
        'Delete Expense',
        `Are you sure you want to delete "${selectedExpenseDetail.title}" (-RM${selectedExpenseDetail.amount})?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: doDelete },
        ]
      );
    }
  };

  // Add Transaction Handler (Called when "Add" button is pressed)
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

    if (transactionType === 'income') {
      const newIncome = {
        id: generateId('inc'),
        title: finalTitle,
        amount: parsedAmount,
        emoji: finalEmoji || '💰',
        category: finalCategory,
      };
      setIncomes((prev) => [newIncome, ...prev]);
    } else {
      // Expense
      if (isRecurring) {
        const newRecurring = {
          id: generateId('rec'),
          title: finalTitle,
          amount: parsedAmount,
          emoji: finalEmoji || '📱',
          category: finalCategory,
        };
        setRecurringExpenses((prev) => [...prev, newRecurring]);
      } else {
        const newExpense = {
          id: generateId('exp'),
          title: finalTitle,
          amount: parsedAmount,
          emoji: finalEmoji || '💸',
          category: finalCategory,
        };
        setExpenses((prev) => [newExpense, ...prev]);
      }
    }

    setIsModalOpen(false);
  };

  // Delete Item Confirmation
  const confirmDeleteItem = (id, type, title, itemAmount) => {
    const doDelete = () => {
      if (type === 'income') {
        setIncomes((prev) => prev.filter((item) => item.id !== id));
      } else if (type === 'recurring') {
        setRecurringExpenses((prev) => prev.filter((item) => item.id !== id));
      } else {
        setExpenses((prev) => prev.filter((item) => item.id !== id));
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm(`Delete "${title}" (RM${itemAmount})?`)) {
        doDelete();
      }
    } else {
      Alert.alert(
        'Delete Item',
        `Are you sure you want to remove "${title}" (RM${itemAmount})?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: doDelete },
        ]
      );
    }
  };

  // Filter Categories to Render
  const activeCategoryList =
    transactionType === 'income'
      ? defaultIncomeCategories
      : showMore
        ? [...defaultExpenseCategories, ...moreExpenseCategories]
        : defaultExpenseCategories;

  const nonSubscriptionRecurring = recurringExpenses.filter(
    (item) => item.category !== 'Subscriptions' && item.title !== 'Subscriptions'
  );

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
            {/* Top Header Controls */}
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

            {/* Left This Month Balance */}
            <View style={styles.balanceContainer}>
              <Text style={styles.balanceLabel}>Left this month</Text>
              <Text style={styles.balanceAmount}>
                {leftThisMonth < 0 ? `-RM${Math.abs(leftThisMonth)}` : `RM${leftThisMonth}`}
              </Text>
            </View>

            {/* Expenses Section (Variable Expenses) */}
            <Text style={styles.sectionTitle}>Expenses</Text>

            <View style={styles.card}>
              {expenses.length === 0 ? (
                <TouchableOpacity
                  style={styles.itemRow}
                  activeOpacity={0.7}
                  onPress={handleOpenModal}
                >
                  <View style={styles.itemLeft}>
                    <Text style={styles.emojiIcon}>🛒</Text>
                    <Text style={[styles.itemTitle, { color: '#94A3B8' }]}>
                      No daily expenses yet
                    </Text>
                  </View>
                  <Text style={{ color: '#fd5ca3', fontWeight: '600', fontSize: 14 }}>
                    + Add
                  </Text>
                </TouchableOpacity>
              ) : (
                expenses.map((item, index) => (
                  <View key={item.id}>
                    {index > 0 && <View style={styles.divider} />}
                    <TouchableOpacity
                      style={styles.itemRow}
                      activeOpacity={0.7}
                      onPress={() => handleOpenExpenseDetail(item, 'expense')}
                      onLongPress={() =>
                        confirmDeleteItem(item.id, 'expense', item.title, item.amount)
                      }
                    >
                      <View style={styles.itemLeft}>
                        <Text style={styles.emojiIcon}>{item.emoji || '💸'}</Text>
                        <Text style={styles.itemTitle}>{item.title}</Text>
                      </View>
                      <Text style={styles.itemAmount}>RM{item.amount}</Text>
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </View>

            {/* Recurring Expenses Section (Commitments) */}
            <Text style={styles.sectionTitle}>Recurring Expenses</Text>

            {/* Card 1: Subscriptions with Progress Bar */}
            {subscriptionItem && (
              <View style={styles.card}>
                <TouchableOpacity
                  style={styles.itemRow}
                  activeOpacity={0.7}
                  onPress={() => handleOpenExpenseDetail(subscriptionItem, 'recurring')}
                  onLongPress={() =>
                    confirmDeleteItem(
                      subscriptionItem.id,
                      'recurring',
                      subscriptionItem.title,
                      subscriptionItem.amount
                    )
                  }
                >
                  <View style={styles.itemLeft}>
                    <Text style={styles.emojiIcon}>{subscriptionItem.emoji || '📱'}</Text>
                    <Text style={styles.itemTitle}>{subscriptionItem.title}</Text>
                  </View>
                  <Text style={styles.itemAmount}>RM{subscriptionItem.amount}</Text>
                </TouchableOpacity>
                <View style={styles.progressBarBackground}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${subscriptionProgressPercent}%` },
                    ]}
                  />
                </View>
              </View>
            )}

            {/* Card 2: Other Recurring Expenses */}
            {nonSubscriptionRecurring.length > 0 && (
              <View style={styles.card}>
                {nonSubscriptionRecurring.map((item, index) => (
                  <View key={item.id}>
                    {index > 0 && <View style={styles.divider} />}
                    <TouchableOpacity
                      style={styles.itemRow}
                      activeOpacity={0.7}
                      onPress={() => handleOpenExpenseDetail(item, 'recurring')}
                      onLongPress={() =>
                        confirmDeleteItem(item.id, 'recurring', item.title, item.amount)
                      }
                    >
                      <View style={styles.itemLeft}>
                        <Text style={styles.emojiIcon}>{item.emoji || '🏠'}</Text>
                        <Text style={styles.itemTitle}>{item.title}</Text>
                      </View>
                      <Text style={styles.itemAmount}>RM{item.amount}</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {/* Income Section */}
            <Text style={styles.sectionTitle}>Income</Text>

            <View style={styles.card}>
              {incomes.map((item, index) => (
                <View key={item.id}>
                  {index > 0 && <View style={styles.divider} />}
                  <TouchableOpacity
                    style={styles.itemRow}
                    activeOpacity={0.7}
                    onPress={() =>
                      confirmDeleteItem(item.id, 'income', item.title, item.amount)
                    }
                  >
                    <View style={styles.itemLeft}>
                      <Text style={styles.emojiIcon}>{item.emoji || '💰'}</Text>
                      <Text style={styles.itemTitle}>{item.title}</Text>
                    </View>
                    <Text style={styles.itemAmount}>RM{item.amount}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Pie Chart Summary Card */}
            <View style={styles.card}>
              <View style={styles.chartContainer}>
                <View style={styles.pieCircle}>
                  <View
                    style={[
                      styles.pieSliceBlue,
                      categoryStats[0] && { backgroundColor: categoryStats[0].color },
                    ]}
                  />
                  {categoryStats[1] && (
                    <View
                      style={[
                        styles.pieSlicePurple,
                        {
                          backgroundColor: categoryStats[1].color,
                          width: `${Math.min(75, Math.max(30, categoryStats[1].percentage + 20))}%`,
                          height: `${Math.min(75, Math.max(30, categoryStats[1].percentage + 20))}%`,
                        },
                      ]}
                    />
                  )}
                  {categoryStats[2] && (
                    <View
                      style={[
                        styles.pieSliceOrange,
                        {
                          backgroundColor: categoryStats[2].color,
                          width: `${Math.min(50, Math.max(20, categoryStats[2].percentage + 15))}%`,
                          height: `${Math.min(50, Math.max(20, categoryStats[2].percentage + 15))}%`,
                        },
                      ]}
                    />
                  )}
                </View>

                <View style={styles.legendContainer}>
                  <Text style={styles.totalText}>Total: RM{totalExpenses}</Text>

                  {categoryStats.map((cat) => (
                    <View key={cat.name} style={styles.legendRow}>
                      <View style={[styles.dot, { backgroundColor: cat.color }]} />
                      <Text style={styles.legendText} numberOfLines={1}>
                        {cat.name} ({cat.percentage}%)
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {/* My Expenses Trend Chart Card */}
            <View style={styles.card}>
              <Text style={styles.chartCardTitle}>My Expenses</Text>

              <View style={styles.lineChartPlaceholder}>
                <View
                  style={[
                    styles.tooltip,
                    {
                      left: `${monthlyExpensesData.findIndex((m) => m.month === selectedMonth) * 15 + 4
                        }%`,
                    },
                  ]}
                >
                  <Text style={styles.tooltipText}>RM{selectedMonthData.amount}</Text>
                </View>

                <View style={styles.chartBarsRow}>
                  {monthlyExpensesData.map((item) => {
                    const isSelected = item.month === selectedMonth;
                    const calculatedHeight = Math.max(
                      14,
                      Math.min(65, Math.round((item.amount / maxExpenseInMonths) * 65))
                    );

                    return (
                      <TouchableOpacity
                        key={item.month}
                        style={styles.barColumn}
                        activeOpacity={0.7}
                        onPress={() => setSelectedMonth(item.month)}
                      >
                        <View
                          style={[
                            styles.barPill,
                            {
                              height: calculatedHeight,
                              backgroundColor: isSelected ? '#fd5ca3' : '#E2E8F0',
                            },
                          ]}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <View style={styles.chartBaseline} />
              </View>

              <View style={styles.monthsRow}>
                {monthlyExpensesData.map((item) => {
                  const isSelected = item.month === selectedMonth;
                  return (
                    <TouchableOpacity
                      key={item.month}
                      onPress={() => setSelectedMonth(item.month)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.monthText,
                          isSelected && { fontWeight: '700', color: '#0F172A' },
                        ]}
                      >
                        {item.month}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          {/* Floating Action Button (FAB) */}
          <TouchableOpacity
            style={styles.fab}
            activeOpacity={0.8}
            onPress={handleOpenModal}
          >
            <Ionicons name="add" size={32} color="#FFFFFF" />
          </TouchableOpacity>

          {/* LOG TRANSACTION MODAL (EXACTLY MATCHING USER'S SCREENSHOT) */}
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
                {/* 1. Header with Cancel Button & Title */}
                <View style={styles.logHeaderRow}>
                  <TouchableOpacity
                    style={styles.logCancelBtn}
                    onPress={handleCloseModal}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.logCancelText}>Cancel</Text>
                  </TouchableOpacity>

                  <Text style={styles.logHeaderTitle}>Log Transaction</Text>

                  {/* Spacer to balance the header title */}
                  <View style={{ width: 70 }} />
                </View>

                {/* 2. Expense / Income Switcher */}
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

                {/* 3. Centered Amount Input */}
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

                {/* 4. Category Section */}
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

                {/* 5. Form List: Name, Date, Recurring */}
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
                        <Text style={styles.logDateBadgeText}>{displayDate}</Text>
                      </View>
                      <View style={styles.logDateBadge}>
                        <Text style={styles.logDateBadgeText}>{displayTime}</Text>
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

                {/* 6. Big Pink Add Button */}
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

          {/* EXPENSE DETAIL MODAL (EXACTLY MATCHING SCREENSHOTS 1 & 2) */}
          <Modal
            visible={!!selectedExpenseDetail}
            animationType="slide"
            presentationStyle="fullScreen"
            onRequestClose={() => setSelectedExpenseDetail(null)}
          >
            <SafeAreaView style={styles.detailSafeArea}>
              <TouchableOpacity
                activeOpacity={1}
                style={{ flex: 1 }}
                onPress={() => {
                  if (isMenuOpen) setIsMenuOpen(false);
                }}
              >
                {/* 1. Header Row */}
                <View style={styles.detailHeaderRow}>
                  {/* Back Button (<) */}
                  <TouchableOpacity
                    style={styles.detailCircleBtn}
                    activeOpacity={0.8}
                    onPress={() => setSelectedExpenseDetail(null)}
                  >
                    <Ionicons name="chevron-back" size={20} color="#000000" />
                  </TouchableOpacity>

                  {/* Center Title */}
                  <Text style={styles.detailHeaderTitle}>
                    {selectedExpenseDetail?.title}
                  </Text>

                  {/* Options Button (...) */}
                  <TouchableOpacity
                    style={styles.detailCircleBtn}
                    activeOpacity={0.8}
                    onPress={() => setIsMenuOpen((prev) => !prev)}
                  >
                    <Ionicons name="ellipsis-horizontal" size={20} color="#000000" />
                  </TouchableOpacity>
                </View>

                {/* Floating Options Dropdown Menu (Screenshot 1) */}
                {isMenuOpen && (
                  <View style={styles.floatingMenuCard}>
                    <TouchableOpacity
                      style={styles.floatingMenuItem}
                      activeOpacity={0.7}
                      onPress={handleOpenEditLimit}
                    >
                      <Ionicons
                        name="pencil-outline"
                        size={18}
                        color="#000000"
                        style={{ marginRight: 12 }}
                      />
                      <Text style={styles.floatingMenuText}>Edit limit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.floatingMenuItem}
                      activeOpacity={0.7}
                      onPress={handleRemoveLimit}
                    >
                      <Ionicons
                        name="remove-circle-outline"
                        size={18}
                        color="#EF4444"
                        style={{ marginRight: 12 }}
                      />
                      <Text style={[styles.floatingMenuText, { color: '#EF4444' }]}>
                        Remove limit
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* 2. My Expenses Section */}
                <View style={styles.detailContentContainer}>
                  <Text style={styles.detailMyExpensesLabel}>My Expenses</Text>
                  <Text style={styles.detailBigAmount}>
                    -RM{selectedExpenseDetail?.amount}
                  </Text>

                  {/* Optional limit indicator if set */}
                  {selectedExpenseDetail?.limit ? (
                    <View style={styles.limitBadgeRow}>
                      <Text style={styles.limitBadgeText}>
                        Limit: RM{selectedExpenseDetail.limit} ({Math.min(100, Math.round((selectedExpenseDetail.amount / selectedExpenseDetail.limit) * 100))}% used)
                      </Text>
                    </View>
                  ) : null}

                  {/* 3. Date Header */}
                  <Text style={styles.detailDateHeader}>
                    {selectedExpenseDetail?.date || 'Oct 21, 2026'}
                  </Text>

                  {/* 4. Transaction Item Card */}
                  <TouchableOpacity
                    style={styles.detailTransactionCard}
                    activeOpacity={0.7}
                    onPress={handleDeleteFromDetail}
                  >
                    <View style={styles.detailTxLeft}>
                      <Text style={styles.detailTxEmoji}>
                        {selectedExpenseDetail?.emoji || '☕'}
                      </Text>
                      <View>
                        <Text style={styles.detailTxTitle}>
                          {selectedExpenseDetail?.title}
                        </Text>
                        <Text style={styles.detailTxSubtitle}>
                          {selectedExpenseDetail?.category || selectedExpenseDetail?.title} · {selectedExpenseDetail?.time || '11:52 PM'}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.detailTxAmount}>
                      -RM{selectedExpenseDetail?.amount}
                    </Text>
                  </TouchableOpacity>

                  <Text style={styles.detailTapHint}>
                    Tap transaction to delete or manage
                  </Text>
                </View>
              </TouchableOpacity>
            </SafeAreaView>
          </Modal>

          {/* EDIT LIMIT MODAL */}
          <Modal
            visible={isEditLimitModalOpen}
            transparent
            animationType="fade"
            onRequestClose={() => setIsEditLimitModalOpen(false)}
          >
            <View style={styles.editLimitBackdrop}>
              <View style={styles.editLimitCard}>
                <View style={styles.editLimitHeader}>
                  <Text style={styles.editLimitTitle}>Edit Limit</Text>
                  <TouchableOpacity onPress={() => setIsEditLimitModalOpen(false)}>
                    <Ionicons name="close" size={24} color="#64748B" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.editLimitDesc}>
                  Set monthly budget limit for {selectedExpenseDetail?.title}:
                </Text>

                <View style={styles.editLimitInputBox}>
                  <Text style={styles.editLimitCurrency}>RM</Text>
                  <TextInput
                    style={styles.editLimitInput}
                    placeholder="50"
                    placeholderTextColor="#CBD5E1"
                    keyboardType="numeric"
                    value={newLimitValue}
                    onChangeText={setNewLimitValue}
                    autoFocus
                  />
                </View>

                <TouchableOpacity
                  style={styles.editLimitSaveBtn}
                  activeOpacity={0.8}
                  onPress={handleSaveLimit}
                >
                  <Text style={styles.editLimitSaveText}>Save Limit</Text>
                </TouchableOpacity>
              </View>
            </View>
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
    paddingBottom: 115,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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
  balanceContainer: {
    marginBottom: 24,
  },
  balanceLabel: {
    fontSize: 15,
    color: '#64748B',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionTitle: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 10,
    marginTop: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  emojiIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  itemAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#fd5ca3',
    borderRadius: 3,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 12,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pieCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#60A5FA',
    position: 'relative',
    overflow: 'hidden',
    marginRight: 20,
  },
  pieSliceBlue: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#60A5FA',
  },
  pieSlicePurple: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '60%',
    height: '60%',
    backgroundColor: '#A855F7',
  },
  pieSliceOrange: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '30%',
    height: '30%',
    backgroundColor: '#F97316',
  },
  legendContainer: {
    flex: 1,
  },
  totalText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },
  chartCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 16,
  },
  lineChartPlaceholder: {
    height: 100,
    justifyContent: 'flex-end',
    marginBottom: 12,
    position: 'relative',
  },
  chartBarsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 65,
    paddingHorizontal: 4,
    width: '100%',
  },
  barColumn: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '16.6%',
    height: '100%',
  },
  barPill: {
    width: 16,
    borderRadius: 8,
  },
  tooltip: {
    position: 'absolute',
    top: 2,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 10,
  },
  tooltipText: {
    fontWeight: '700',
    fontSize: 13,
    color: '#0F172A',
  },
  chartBaseline: {
    height: 3,
    backgroundColor: '#fd5ca3',
    borderRadius: 2,
    marginTop: 2,
  },
  monthsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  monthText: {
    fontSize: 12,
    color: '#94A3B8',
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
  // LOG TRANSACTION MODAL STYLES (MATCHING SCREENSHOT)
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

  // ----------------------------------------------------
  // EXPENSE DETAIL MODAL STYLES (MATCHING SCREENSHOTS 1 & 2)
  // ----------------------------------------------------
  detailSafeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    maxWidth: 430,
    width: '100%',
    alignSelf: 'center',
  },
  detailHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 16 : 8,
    paddingBottom: 20,
    zIndex: 10,
  },
  detailCircleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  detailHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#000000',
  },
  floatingMenuCard: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 66 : 56,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    minWidth: 180,
    zIndex: 999,
  },
  floatingMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  floatingMenuText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
  },
  detailContentContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  detailMyExpensesLabel: {
    fontSize: 15,
    color: '#94A3B8',
    fontWeight: '500',
    marginBottom: 4,
  },
  detailBigAmount: {
    fontSize: 28,
    fontWeight: '800',
    color: '#000000',
    marginBottom: 24,
  },
  limitBadgeRow: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  limitBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  detailDateHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
  },
  detailTransactionCard: {
    backgroundColor: '#F1F5F9',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailTxLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailTxEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  detailTxTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  detailTxSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  detailTxAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#EF4444',
  },
  detailTapHint: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 16,
  },

  // Edit Limit Modal Styles
  editLimitBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  editLimitCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  editLimitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  editLimitTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  editLimitDesc: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
  },
  editLimitInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 20,
  },
  editLimitCurrency: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginRight: 8,
  },
  editLimitInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },
  editLimitSaveBtn: {
    backgroundColor: '#fd5ca3',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#fd5ca3',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  editLimitSaveText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});