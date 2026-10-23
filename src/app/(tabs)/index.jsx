import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useRef, useState } from 'react';
import {
  Alert,
  Image,
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
import AIReceiptScannerModal from '../../components/AIReceiptScannerModal';
import AppBackground from '../../components/AppBackground';
import AutoSpendingBanner from '../../components/AutoSpendingBanner';
import ImpulseCalculatorModal from '../../components/ImpulseCalculatorModal';
import {
  defaultExpenseCategories,
  defaultIncomeCategories,
  generateUniqueId,
  moreExpenseCategories,
  useApp,
} from '../../context/AppContext';

export default function HomeScreen() {
  const {
    accountType,
    setAccountType,
    selectedMonth,
    setSelectedMonth,
    incomes,
    setIncomes,
    recurringExpenses,
    setRecurringExpenses,
    expenses,
    setExpenses,
    totalIncome,
    totalRecurring,
    totalRegularExpenses,
    totalExpenses,
    leftThisMonth,
    // Wow 1: Auto-Spending
    autoSpendingBanner,
    triggerAutoSpendingNotification,
    dismissAutoSpendingBanner,
    // Wow 3: Impulse 48h
    addImpulseItem,
  } = useApp();

  // Modals visibility
  const [isFabMenuOpen, setIsFabMenuOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isReceiptScannerOpen, setIsReceiptScannerOpen] = useState(false);
  const [isImpulseModalOpen, setIsImpulseModalOpen] = useState(false);
  const [isSimulatePickerOpen, setIsSimulatePickerOpen] = useState(false);
  const [scanFromLogModal, setScanFromLogModal] = useState(false);
  const [isBalanceSheetOpen, setIsBalanceSheetOpen] = useState(false);
  const [selectedBalanceMetric, setSelectedBalanceMetric] = useState('left');
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);
  const scrollViewRef = useRef(null);

  // Manual Log Transaction Form State
  const [transactionType, setTransactionType] = useState('expense'); // 'expense' | 'income'
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(defaultExpenseCategories[0]);
  const [transactionName, setTransactionName] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState('');


  // Expense Detail Modal State
  const [selectedExpenseDetail, setSelectedExpenseDetail] = useState(null);
  const [selectedItemTransaction, setSelectedItemTransaction] = useState(null);
  const [attachedPhotos, setAttachedPhotos] = useState([]);
  const [isEditingTx, setIsEditingTx] = useState(false);
  const [editTxAmount, setEditTxAmount] = useState('');
  const [editTxTitle, setEditTxTitle] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditLimitModalOpen, setIsEditLimitModalOpen] = useState(false);
  const [newLimitValue, setNewLimitValue] = useState('');

  // Subscriptions Progress Calculation
  const subscriptionItem = recurringExpenses.find(
    (item) => item.category === 'Subscriptions' || item.title?.includes('Subscriptions') || item.title?.includes('Spotify')
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
        if (lower.includes('rent') || lower.includes('sewa') || lower.includes('hous')) {
          color = '#60A5FA';
        } else if (lower.includes('utilit') || lower.includes('bil') || lower.includes('wifi')) {
          color = '#A855F7';
        } else if (lower.includes('subscrip') || lower.includes('stream') || lower.includes('cloud') || lower.includes('spotify')) {
          color = '#F97316';
        } else if (lower.includes('coffee') || lower.includes('food') || lower.includes('makan')) {
          color = '#fd5ca3';
        } else if (lower.includes('transp') || lower.includes('lrt') || lower.includes('car')) {
          color = '#10B981';
        } else if (lower.includes('grocer') || lower.includes('market')) {
          color = '#06B6D4';
        } else {
          color = '#F59E0B';
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

  // Balance Metrics Breakdown Options (Matches User Screenshot)
  const balanceMetrics = useMemo(() => {
    const daysSoFar = 15; // October 15th
    const daysRemaining = 16; // 31 - 15 = 16 days ahead
    const perDayAmount = daysSoFar > 0 ? (totalExpenses / daysSoFar).toFixed(2) : '0.00';
    const dailyRoomAmount =
      daysRemaining > 0 ? Math.max(0, leftThisMonth / daysRemaining).toFixed(2) : '0.00';

    return [
      {
        id: 'left',
        title: 'Left',
        subtitle: 'Income minus spending',
        symbol: '±',
        valueText: leftThisMonth < 0 ? `-RM${Math.abs(leftThisMonth)}` : `RM${leftThisMonth}`,
      },
      {
        id: 'spent',
        title: 'Spent',
        subtitle: 'What went out',
        iconName: 'card-outline',
        valueText: `RM${totalExpenses}`,
      },
      {
        id: 'income',
        title: 'Income',
        subtitle: 'What came in',
        iconName: 'arrow-down',
        valueText: `RM${totalIncome}`,
      },
      {
        id: 'bills',
        title: 'Bills',
        subtitle: 'Rent, bills, and repeats',
        iconName: 'home-outline',
        valueText: `RM${totalRecurring}`,
      },
      {
        id: 'everyday',
        title: 'Everyday',
        subtitle: 'Spending besides bills',
        iconName: 'cart-outline',
        valueText: `RM${totalRegularExpenses}`,
      },
      {
        id: 'per_day',
        title: 'Per day',
        subtitle: 'Spending split across the days so far',
        iconName: 'calendar-outline',
        valueText: `RM${perDayAmount}`,
      },
      {
        id: 'daily_room',
        title: 'Daily room',
        subtitle: "What's left, split across the days ahead",
        iconName: 'hourglass-outline',
        valueText: `RM${dailyRoomAmount}`,
      },
    ];
  }, [leftThisMonth, totalExpenses, totalIncome, totalRecurring, totalRegularExpenses]);

  const activeMetric = useMemo(() => {
    return (
      balanceMetrics.find((m) => m.id === selectedBalanceMetric) || balanceMetrics[0]
    );
  }, [balanceMetrics, selectedBalanceMetric]);

  // Alert Helper
  const alertMessage = (title, message) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  // Open Manual Log Modal
  const handleOpenManualLog = () => {
    const wasMenuOpen = isFabMenuOpen;
    setIsFabMenuOpen(false);
    setTransactionType('expense');
    setAmount('');
    setSelectedCategory(defaultExpenseCategories[0]);
    setTransactionName('');
    setIsRecurring(false);
    setShowMore(false);
    setIsCustomCategory(false);
    setCustomCategoryName('');
    if (wasMenuOpen) {
      setTimeout(() => setIsLogModalOpen(true), 250);
    } else {
      setIsLogModalOpen(true);
    }
  };

  // Open AI Receipt Scanner
  const handleOpenReceiptScanner = () => {
    setIsFabMenuOpen(false);
    setTimeout(() => setIsReceiptScannerOpen(true), 350);
  };

  // Open Impulse Calculator
  const handleOpenImpulseCalculator = () => {
    setIsFabMenuOpen(false);
    setTimeout(() => setIsImpulseModalOpen(true), 350);
  };

  // Save Scanned Receipt -> Auto-fills the Log Transaction form per user screenshot
  const handleSaveScannedReceipt = (receiptData) => {
    setAmount(String(receiptData.amount));
    setTransactionName(receiptData.title);
    const allCats = [...defaultExpenseCategories, ...moreExpenseCategories];
    const matched =
      allCats.find(
        (c) => c.name.toLowerCase() === receiptData.category.toLowerCase()
      ) || defaultExpenseCategories[0];
    setSelectedCategory(matched);
    setIsReceiptScannerOpen(false);
    setScanFromLogModal(false);
    setTimeout(() => setIsLogModalOpen(true), 350);
  };

  // Open scanner from inside Log Transaction modal (close Log first to avoid iOS nested-modal bug)
  const handleScanFromInsideLog = () => {
    setIsLogModalOpen(false);
    setScanFromLogModal(true);
    setTimeout(() => setIsReceiptScannerOpen(true), 350);
  };

  // Save Impulse Item Lock
  const handleStartImpulseLock = (impulseData) => {
    addImpulseItem(impulseData);
    alertMessage(
      '48-Hour Chill Lock Activated! ⏳',
      `"${impulseData.title}" (RM${impulseData.price}) is locked for 48 hours. Monitor it under Transactions.`
    );
  };

  // Save Manual Transaction
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
        id: generateUniqueId('inc'),
        title: finalTitle,
        amount: parsedAmount,
        emoji: finalEmoji || '💰',
        category: finalCategory,
        date: '15/10/26',
        day: 15,
        time: '8:10 PM',
      };
      setIncomes((prev) => [newIncome, ...prev]);
    } else {
      if (isRecurring) {
        const newRecurring = {
          id: generateUniqueId('rec'),
          title: finalTitle,
          amount: parsedAmount,
          emoji: finalEmoji || '📱',
          category: finalCategory,
          date: '15/10/26',
          day: 15,
          time: '8:10 PM',
        };
        setRecurringExpenses((prev) => [...prev, newRecurring]);
      } else {
        const newExpense = {
          id: generateUniqueId('exp'),
          title: finalTitle,
          amount: parsedAmount,
          emoji: finalEmoji || '💸',
          category: finalCategory,
          date: '15/10/26',
          day: 15,
          time: '8:10 PM',
        };
        setExpenses((prev) => [newExpense, ...prev]);
      }
    }

    setIsLogModalOpen(false);
  };

  // Open Expense Detail Modal
  const handleOpenExpenseDetail = (item, type) => {
    setSelectedExpenseDetail({
      ...item,
      type,
      date: item.date || 'Oct 21, 2026',
      time: item.time || '11:52 PM',
      fullDate: 'Wednesday, October 21, 2026',
    });
    setSelectedItemTransaction(null);
    setIsMenuOpen(false);
  };

  // Add Photo to Transaction (Photos Section)
  const handleAddPhoto = () => {
    setAttachedPhotos((prev) => [
      ...prev,
      'https://images.unsplash.com/photo-1554415707-9e4c09d48d53?w=300&q=80',
    ]);
    alertMessage('Receipt Photo Attached 📸', 'Receipt photo successfully linked to this expense.');
  };

  // Save Edit Transaction from Detail Page
  const handleSaveEditTx = () => {
    const parsed = parseFloat(editTxAmount);
    if (isNaN(parsed) || parsed <= 0) {
      alertMessage('Invalid Amount', 'Please enter a valid amount.');
      return;
    }
    const newTitle = editTxTitle.trim() || selectedItemTransaction?.title;
    const targetId = selectedItemTransaction?.id;

    if (selectedItemTransaction?.type === 'income') {
      setIncomes((prev) =>
        prev.map((it) => (it.id === targetId ? { ...it, amount: parsed, title: newTitle } : it))
      );
    } else if (selectedItemTransaction?.type === 'recurring') {
      setRecurringExpenses((prev) =>
        prev.map((it) => (it.id === targetId ? { ...it, amount: parsed, title: newTitle } : it))
      );
    } else {
      setExpenses((prev) =>
        prev.map((it) => (it.id === targetId ? { ...it, amount: parsed, title: newTitle } : it))
      );
    }

    setSelectedItemTransaction((prev) => (prev ? { ...prev, amount: parsed, title: newTitle } : null));
    setSelectedExpenseDetail((prev) => (prev ? { ...prev, amount: parsed, title: newTitle } : null));
    setIsEditingTx(false);
    alertMessage('Expense Updated', `Saved as RM${parsed.toFixed(2)}.`);
  };

  // Direct Delete from Transaction Detail View (User Screenshot)
  const handleDeleteTransactionDirectly = () => {
    if (!selectedItemTransaction) return;

    const doDelete = () => {
      const id = selectedItemTransaction.id;
      if (selectedItemTransaction.type === 'income') {
        setIncomes((prev) => prev.filter((item) => item.id !== id));
      } else if (selectedItemTransaction.type === 'recurring') {
        setRecurringExpenses((prev) => prev.filter((item) => item.id !== id));
      } else {
        setExpenses((prev) => prev.filter((item) => item.id !== id));
      }
      setSelectedItemTransaction(null);
      setSelectedExpenseDetail(null);
    };

    if (Platform.OS === 'web') {
      if (
        window.confirm(
          `Delete "${selectedItemTransaction.title}" (-RM${selectedItemTransaction.amount})?`
        )
      ) {
        doDelete();
      }
    } else {
      Alert.alert(
        'Delete Transaction',
        `Are you sure you want to delete "${selectedItemTransaction.title}" (-RM${selectedItemTransaction.amount})?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: doDelete },
        ]
      );
    }
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

  const activeCategoryList =
    transactionType === 'income'
      ? defaultIncomeCategories
      : showMore
        ? [...defaultExpenseCategories, ...moreExpenseCategories]
        : defaultExpenseCategories;

  const nonSubscriptionRecurring = recurringExpenses.filter(
    (item) => item.category !== 'Subscriptions' && !item.title?.includes('Subscriptions') && !item.title?.includes('Spotify')
  );

  return (
    <AppBackground opacity={1.00} style={styles.gradientContainer}>
      <SafeAreaView style={styles.container}>
        {/* FAKTOR WOW I: Auto-Spending Notification Listener Banner */}
        <AutoSpendingBanner
          banner={autoSpendingBanner}
          onDismiss={dismissAutoSpendingBanner}
        />

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Header Row Controls (Restored) */}
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

            <View style={styles.headerRightActions}>
              <TouchableOpacity style={styles.dateFilterButton} activeOpacity={0.8}>
                <Text style={styles.dateFilterText}>Oct 2026</Text>
                <Ionicons
                  name="options-outline"
                  size={16}
                  color="#0D0E15"
                  style={{ marginLeft: 6 }}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Big Hero Card (Liquid Glass Gradient) */}
          <TouchableOpacity
            style={styles.heroCardContainer}
            activeOpacity={0.92}
            onPress={() => setIsBalanceSheetOpen(true)}
          >
            <BlurView intensity={30} tint="light" style={styles.heroGlassBlur}>
              <LinearGradient
                colors={[
                  'rgba(255, 255, 255, 0.85)',
                  'rgba(255, 255, 255, 0.50)',
                  'rgba(244, 232, 248, 0.65)',
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroGlassGradient}
              >
                {/* Card Top Row: Personal Account Header */}
                <View style={styles.heroTopRow}>
                  <View>
                    <Text style={styles.heroBankName}>Personal</Text>
                    <Text style={styles.heroAccountType}>STUDENT WALLET</Text>
                  </View>
                  <View style={styles.heroTagPill}>
                    <Ionicons name="swap-vertical" size={13} color="#fd5ca3" />
                    <Text style={styles.heroTagText}>Details</Text>
                  </View>
                </View>

                {/* Card Middle: Balance Label & Big Amount */}
                <View style={styles.heroBalanceSection}>
                  <View style={styles.heroBalanceLabelRow}>
                    <Text style={styles.heroBalanceLabel}>
                      {activeMetric.title.toUpperCase()}
                    </Text>
                    <TouchableOpacity
                      onPress={() => setIsBalanceHidden(!isBalanceHidden)}
                      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                      style={styles.heroEyeBtn}
                    >
                      <Ionicons
                        name={isBalanceHidden ? 'eye-off-outline' : 'eye-outline'}
                        size={16}
                        color="#666666"
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.heroBalanceRow}>
                    <Text style={styles.heroCurrencyPrefix}>RM</Text>
                    <Text style={styles.heroBalanceNumber}>
                      {isBalanceHidden
                        ? '••••••'
                        : activeMetric.id === 'left'
                          ? (leftThisMonth < 0
                            ? `-${Math.abs(leftThisMonth).toFixed(2)}`
                            : leftThisMonth.toFixed(2))
                          : activeMetric.valueText.replace('RM', '')}
                    </Text>
                  </View>
                </View>

                {/* Card Bottom: Income & Spending */}
                <View style={styles.heroBottomRow}>
                  <View style={styles.heroStatCol}>
                    <Text style={styles.heroStatLabel}>INCOME</Text>
                    <Text style={styles.heroStatValue}>
                      {isBalanceHidden ? '••••' : `RM ${Number(totalIncome).toFixed(2)}`}
                    </Text>
                  </View>

                  <View style={styles.heroStatCol}>
                    <Text style={styles.heroStatLabel}>SPENDING</Text>
                    <Text style={styles.heroStatValue}>
                      {isBalanceHidden ? '••••' : `RM ${Number(totalExpenses).toFixed(2)}`}
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </BlurView>
          </TouchableOpacity>

          {/* Action Row: Bills & Receipts (Clean Flat White Cards) */}
          <View style={styles.quickActionRow}>
            <TouchableOpacity
              style={styles.quickActionCard}
              activeOpacity={0.8}
              onPress={() => scrollViewRef.current?.scrollTo({ y: 540, animated: true })}
            >
              <Ionicons name="document-text-outline" size={18} color="#0D0E15" />
              <Text style={styles.quickActionTitle}>Bills</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              activeOpacity={0.8}
              onPress={handleOpenReceiptScanner}
            >
              <Ionicons name="images-outline" size={18} color="#0D0E15" />
              <Text style={styles.quickActionTitle}>Receipts</Text>
            </TouchableOpacity>
          </View>

          {/* Expenses Section */}
          <Text style={styles.sectionTitle}>Expenses</Text>

          <View style={styles.card}>
            {expenses.length === 0 ? (
              <TouchableOpacity
                style={styles.itemRow}
                activeOpacity={0.7}
                onPress={handleOpenManualLog}
              >
                <View style={styles.itemLeft}>
                  <Text style={styles.emojiIcon}>🛒</Text>
                  <Text style={[styles.itemTitle, { color: '#666666' }]}>
                    No daily expenses yet
                  </Text>
                </View>
                <Text style={{ color: '#fd5ca3', fontWeight: '700', fontSize: 14 }}>
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
                      <View>
                        <Text style={styles.itemTitle}>{item.title}</Text>
                        {item.isAutoLogged && (
                          <Text style={styles.autoLoggedBadge}>
                            ⚡ Auto via {item.bankSource || 'Bank'}
                          </Text>
                        )}
                      </View>
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
                  <Text style={[styles.itemAmount, { color: '#10B981' }]}>
                    RM{item.amount}
                  </Text>
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
                        isSelected && { fontWeight: '700', color: '#0D0E15' },
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

        {/* Floating Action Button (FAB) -> Opens Log Transaction directly */}
        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.85}
          onPress={handleOpenManualLog}
        >
          <Ionicons name="add" size={32} color="#FFFFFF" />
        </TouchableOpacity>

        {/* FAB Action Picker — Liquid Glass overlay (avoids iOS modal-on-modal bug) */}
        {isFabMenuOpen && (
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setIsFabMenuOpen(false)}
          >
            <View style={styles.fabMenuSheet}>
              <View style={styles.sheetHandle} />
              <Text style={styles.sheetTitle}>Choose Action</Text>
              <Text style={styles.sheetSubtitle}>
                Add transactions manually or use AI FYP tools
              </Text>

              {/* Action 1: Manual Input */}
              <TouchableOpacity
                style={styles.actionItem}
                onPress={handleOpenManualLog}
                activeOpacity={0.7}
              >
                <View style={[styles.actionIconBox, { backgroundColor: '#F1F5F9' }]}>
                  <Ionicons name="create-outline" size={24} color="#0D0E15" />
                </View>
                <View style={styles.actionTextBox}>
                  <Text style={styles.actionTitle}>Input Manual</Text>
                  <Text style={styles.actionDesc}>Type amount, category & note</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
              </TouchableOpacity>

              {/* Action 2: AI Receipt Scanner (Camera OCR) — Liquid Glass */}
              <BlurView
                intensity={50}
                tint="light"
                style={styles.actionItemGlassWrapper}
              >
                <TouchableOpacity
                  style={styles.actionItemGlass}
                  onPress={handleOpenReceiptScanner}
                  activeOpacity={0.7}
                >
                  <View style={[styles.actionIconBox, { backgroundColor: 'rgba(255, 240, 245, 0.7)' }]}>
                    <Text style={{ fontSize: 22 }}>📸</Text>
                  </View>
                  <View style={styles.actionTextBox}>
                    <View style={styles.wowBadgeRow}>
                      <Text style={styles.actionTitle}>Imbas Resit (AI OCR)</Text>
                      <View style={styles.wowBadge}>
                        <Text style={styles.wowBadgeText}>AI VISION</Text>
                      </View>
                    </View>
                    <Text style={styles.actionDesc}>
                      Scan physical receipt with camera to auto-fill
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
                </TouchableOpacity>
              </BlurView>

              {/* Action 3: Impulse Buy 48-Hour Chill Calculator — Liquid Glass */}
              <BlurView
                intensity={50}
                tint="light"
                style={styles.actionItemGlassWrapper}
              >
                <TouchableOpacity
                  style={styles.actionItemGlass}
                  onPress={handleOpenImpulseCalculator}
                  activeOpacity={0.7}
                >
                  <View style={[styles.actionIconBox, { backgroundColor: 'rgba(254, 243, 199, 0.7)' }]}>
                    <Text style={{ fontSize: 22 }}>⏳</Text>
                  </View>
                  <View style={styles.actionTextBox}>
                    <View style={styles.wowBadgeRow}>
                      <Text style={styles.actionTitle}>48-Hour Chill Calculator</Text>
                      <View style={[styles.wowBadge, { backgroundColor: 'rgba(254, 243, 199, 0.75)' }]}>
                        <Text style={[styles.wowBadgeText, { color: '#D97706' }]}>IMPULSE RULE</Text>
                      </View>
                    </View>
                    <Text style={styles.actionDesc}>
                      Cool down impulse urges & save money
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
                </TouchableOpacity>
              </BlurView>

              <TouchableOpacity
                style={styles.cancelSheetBtn}
                onPress={() => setIsFabMenuOpen(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelSheetText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}

        {/* Bank Auto-Spending Simulator — inline View overlay */}
        {isSimulatePickerOpen && (
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setIsSimulatePickerOpen(false)}
          >
            <View style={styles.fabMenuSheet}>
              <View style={styles.sheetHandle} />
              <View style={styles.simHeaderRow}>
                <Text style={{ fontSize: 22 }}>⚡</Text>
                <Text style={styles.sheetTitle}>Auto-Spending Simulator</Text>
              </View>
              <Text style={styles.sheetSubtitle}>
                Test real-time push notification detection from Malaysian banks & eWallets
              </Text>

              {/* Preset 1: Maybank MAE Starbucks */}
              <TouchableOpacity
                style={styles.actionItem}
                onPress={() => {
                  setIsSimulatePickerOpen(false);
                  triggerAutoSpendingNotification('Maybank MAE', 'Starbucks Coffee', 15.00, '☕', 'Coffee');
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.actionIconBox, { backgroundColor: '#FEF08A' }]}>
                  <Text style={{ fontSize: 14, fontWeight: '900', color: '#854D0E' }}>MAE</Text>
                </View>
                <View style={styles.actionTextBox}>
                  <Text style={styles.actionTitle}>Maybank MAE • Starbucks Coffee</Text>
                  <Text style={styles.actionDesc}>RM15.00 • Auto-insert into Coffee</Text>
                </View>
                <Text style={{ color: '#fd5ca3', fontWeight: '700' }}>Trigger ⚡</Text>
              </TouchableOpacity>

              {/* Preset 2: Touch 'n Go eWallet */}
              <TouchableOpacity
                style={styles.actionItem}
                onPress={() => {
                  setIsSimulatePickerOpen(false);
                  triggerAutoSpendingNotification('TNG eWallet', 'FamilyMart Oden', 9.80, '🍢', 'Food & Dining');
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.actionIconBox, { backgroundColor: '#DBEAFE' }]}>
                  <Text style={{ fontSize: 13, fontWeight: '900', color: '#1D4ED8' }}>TNG</Text>
                </View>
                <View style={styles.actionTextBox}>
                  <Text style={styles.actionTitle}>{"Touch 'n Go \u2022 FamilyMart Oden"}</Text>
                  <Text style={styles.actionDesc}>RM9.80 • Auto-insert into Food</Text>
                </View>
                <Text style={{ color: '#fd5ca3', fontWeight: '700' }}>Trigger ⚡</Text>
              </TouchableOpacity>

              {/* Preset 3: GrabPay */}
              <TouchableOpacity
                style={styles.actionItem}
                onPress={() => {
                  setIsSimulatePickerOpen(false);
                  triggerAutoSpendingNotification('GrabPay', 'Subway Sandwich', 16.50, '🥪', 'Food & Dining');
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.actionIconBox, { backgroundColor: '#DCFCE7' }]}>
                  <Text style={{ fontSize: 13, fontWeight: '900', color: '#15803D' }}>GRAB</Text>
                </View>
                <View style={styles.actionTextBox}>
                  <Text style={styles.actionTitle}>GrabPay • Subway Lunch</Text>
                  <Text style={styles.actionDesc}>RM16.50 • Auto-insert into Food</Text>
                </View>
                <Text style={{ color: '#fd5ca3', fontWeight: '700' }}>Trigger ⚡</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelSheetBtn}
                onPress={() => setIsSimulatePickerOpen(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelSheetText}>Close</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}

        {/* Metric Selector Move-In Bottom Sheet (Matches User Screenshot) */}
        {isBalanceSheetOpen && (
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setIsBalanceSheetOpen(false)}
          >
            <View style={styles.metricSheetContainer}>
              <View style={styles.metricSheetHandle} />

              {balanceMetrics.map((item, index) => {
                const isSelected = selectedBalanceMetric === item.id;
                return (
                  <View key={item.id}>
                    {index > 0 && <View style={styles.metricDivider} />}
                    <TouchableOpacity
                      style={styles.metricItemRow}
                      activeOpacity={0.7}
                      onPress={() => {
                        setSelectedBalanceMetric(item.id);
                        setIsBalanceSheetOpen(false);
                      }}
                    >
                      <View style={styles.metricItemIconBox}>
                        {item.symbol ? (
                          <Text style={styles.metricSymbolText}>{item.symbol}</Text>
                        ) : (
                          <Ionicons name={item.iconName} size={20} color="#64748B" />
                        )}
                      </View>

                      <View style={styles.metricItemTextCol}>
                        <Text style={styles.metricItemTitle}>{item.title}</Text>
                        <Text style={styles.metricItemSubtitle}>{item.subtitle}</Text>
                      </View>

                      {isSelected && (
                        <Ionicons name="checkmark" size={20} color="#fd5ca3" />
                      )}
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </TouchableOpacity>
        )}

        {/* AI Receipt Scanner Modal (Faktor Wow II) */}
        <AIReceiptScannerModal
          visible={isReceiptScannerOpen}
          onClose={() => {
            setIsReceiptScannerOpen(false);
            if (scanFromLogModal) {
              setScanFromLogModal(false);
              setTimeout(() => setIsLogModalOpen(true), 350);
            }
          }}
          onSaveReceipt={handleSaveScannedReceipt}
        />

        {/* Impulse Buy 48-Hour Chill Calculator Modal (Faktor Wow III) */}
        <ImpulseCalculatorModal
          visible={isImpulseModalOpen}
          onClose={() => setIsImpulseModalOpen(false)}
          onStartChillLock={handleStartImpulseLock}
        />

        {/* MANUAL LOG TRANSACTION MODAL */}
        <Modal
          visible={isLogModalOpen}
          animationType="slide"
          presentationStyle="fullScreen"
          onRequestClose={() => setIsLogModalOpen(false)}
        >
          <SafeAreaView style={styles.logModalSafeArea}>
            <ScrollView
              contentContainerStyle={styles.logModalScroll}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Header with Cancel Button, Title & Scanner Icon Button */}
              <View style={styles.logHeaderRow}>
                <TouchableOpacity
                  style={styles.logCancelBtn}
                  onPress={() => setIsLogModalOpen(false)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.logCancelText}>Cancel</Text>
                </TouchableOpacity>

                <Text style={styles.logHeaderTitle}>Log Transaction</Text>

                {/* Top-Right Scanner Icon Button — closes Log Modal first (iOS nested modal fix) */}
                <TouchableOpacity
                  style={styles.logScanHeaderBtn}
                  onPress={handleScanFromInsideLog}
                  activeOpacity={0.8}
                >
                  <Ionicons name="scan-outline" size={20} color="#fd5ca3" />
                </TouchableOpacity>
              </View>

              {/* Expense / Income Segmented Switcher */}
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

              {/* Amount Section with RM Label & Centered "Scan receipt" Pill Button */}
              <View style={styles.logAmountSection}>
                <Text style={styles.logAmountCurrencyLabel}>RM</Text>
                <TextInput
                  style={styles.logAmountInput}
                  placeholder="0.00"
                  placeholderTextColor="#CBD5E1"
                  keyboardType="decimal-pad"
                  value={amount}
                  onChangeText={setAmount}
                  autoFocus={Platform.OS !== 'web'}
                />

                {/* Centered Scan Receipt Button — closes Log Modal first (iOS nested modal fix) */}
                <TouchableOpacity
                  style={styles.scanReceiptPillBtn}
                  onPress={handleScanFromInsideLog}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="scan-outline"
                    size={16}
                    color="#fd5ca3"
                    style={{ marginRight: 6 }}
                  />
                  <Text style={styles.scanReceiptPillText}>Scan receipt</Text>
                </TouchableOpacity>
              </View>

              {/* Category Header */}
              <Text style={styles.logCategoryHeader}>Category</Text>

              {/* Category Grid */}
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
                        {cat.name} {isSelected ? '✓' : ''}
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
                  <Ionicons
                    name="grid-outline"
                    size={16}
                    color={showMore ? '#FFFFFF' : '#0D0E15'}
                    style={{ marginRight: 6 }}
                  />
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

                {/* + Custom Button (Dashed Border per screenshot) */}
                <TouchableOpacity
                  style={[
                    styles.logCategoryPill,
                    styles.logCategoryPillCustom,
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
                    + Custom
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Custom Category Input if selected */}
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

                <View style={styles.logFormRow}>
                  <Text style={styles.logFormLabel}>Date</Text>
                  <View style={styles.logDatePillsRow}>
                    <View style={styles.logDateBadge}>
                      <Text style={styles.logDateBadgeText}>10/23/26</Text>
                    </View>
                    <View style={styles.logDateBadge}>
                      <Text style={styles.logDateBadgeText}>4:23 PM</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.logFormDivider} />

                {transactionType === 'expense' && (
                  <View style={styles.logFormRow}>
                    <Text style={styles.logFormLabel}>Recurring</Text>
                    <Switch
                      value={isRecurring}
                      onValueChange={setIsRecurring}
                      trackColor={{ false: '#E2E8F0', true: '#fd5ca3' }}
                      thumbColor="#FFFFFF"
                    />
                  </View>
                )}
              </View>

              {/* Add Button */}
              <TouchableOpacity
                style={[
                  styles.logAddButton,
                  parseFloat(amount) > 0
                    ? styles.logAddButtonActive
                    : styles.logAddButtonDisabled,
                ]}
                onPress={handleSaveTransaction}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.logAddButtonText,
                    parseFloat(amount) > 0
                      ? styles.logAddButtonTextActive
                      : styles.logAddButtonTextDisabled,
                  ]}
                >
                  Add
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        </Modal>

        {/* EXPENSE DETAIL MODAL */}
        <Modal
          visible={!!selectedExpenseDetail}
          animationType="slide"
          presentationStyle="fullScreen"
          onRequestClose={() => {
            if (isEditingTx) {
              setIsEditingTx(false);
            } else if (selectedItemTransaction) {
              setSelectedItemTransaction(null);
            } else {
              setSelectedExpenseDetail(null);
            }
          }}
        >
          <SafeAreaView style={styles.detailSafeArea}>
            {selectedItemTransaction ? (
              /* ========================================================================= */
              /* TRANSACTION SINGLE ITEM DETAIL SCREEN (Matches User Screenshot Exactly) */
              /* ========================================================================= */
              <View style={{ flex: 1, width: '100%' }}>
                {/* Header: Back Button, Title, and Edit Pill Button */}
                <View style={styles.txDetailHeader}>
                  <TouchableOpacity
                    style={styles.detailCircleBtn}
                    onPress={() => setSelectedItemTransaction(null)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="chevron-back" size={22} color="#0D0E15" />
                  </TouchableOpacity>

                  <Text style={styles.txDetailHeaderTitle}>
                    {selectedItemTransaction.type === 'income' ? 'Income' : 'Expense'}
                  </Text>

                  <TouchableOpacity
                    style={styles.txDetailEditPill}
                    onPress={() => {
                      setEditTxAmount(String(selectedItemTransaction.amount));
                      setEditTxTitle(selectedItemTransaction.title);
                      setIsEditingTx(true);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.txDetailEditText}>Edit</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView
                  style={styles.txDetailScroll}
                  contentContainerStyle={styles.txDetailScrollContent}
                  showsVerticalScrollIndicator={false}
                >
                  {/* Hero Avatar Emoji */}
                  <View style={styles.txDetailAvatarBox}>
                    <Text style={styles.txDetailAvatarEmoji}>
                      {selectedItemTransaction.emoji || '☕'}
                    </Text>
                  </View>

                  {/* Hero Amount (-RM12) */}
                  <Text
                    style={[
                      styles.txDetailHeroAmount,
                      {
                        color:
                          selectedItemTransaction.type === 'income'
                            ? '#10B981'
                            : '#EF4444',
                      },
                    ]}
                  >
                    {selectedItemTransaction.type === 'income' ? '+' : '-'}RM
                    {selectedItemTransaction.amount}
                  </Text>

                  {/* Hero Category Title (Coffee) */}
                  <Text style={styles.txDetailHeroCategory}>
                    {selectedItemTransaction.category || selectedItemTransaction.title}
                  </Text>

                  {/* Section: Details Header */}
                  <Text style={styles.txDetailSectionHeading}>Details</Text>

                  {/* Details Card */}
                  <View style={styles.txDetailCard}>
                    {/* Category Row */}
                    <View style={styles.txDetailRow}>
                      <Text style={styles.txDetailRowLabel}>Category</Text>
                      <View style={styles.txDetailRowRight}>
                        <Text style={{ fontSize: 16, marginRight: 6 }}>
                          {selectedItemTransaction.emoji || '☕'}
                        </Text>
                        <Text style={styles.txDetailRowValue}>
                          {selectedItemTransaction.category || selectedItemTransaction.title}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.txDetailRowDivider} />

                    {/* Date Row */}
                    <View style={styles.txDetailRow}>
                      <Text style={styles.txDetailRowLabel}>Date</Text>
                      <Text style={styles.txDetailRowValue}>
                        {selectedItemTransaction.fullDate || 'Wednesday, October 21, 2026'}
                      </Text>
                    </View>
                    <View style={styles.txDetailRowDivider} />

                    {/* Time Row */}
                    <View style={styles.txDetailRow}>
                      <Text style={styles.txDetailRowLabel}>Time</Text>
                      <Text style={styles.txDetailRowValue}>
                        {selectedItemTransaction.time || '11:52 PM'}
                      </Text>
                    </View>
                    <View style={styles.txDetailRowDivider} />

                    {/* Type Row */}
                    <View style={styles.txDetailRow}>
                      <Text style={styles.txDetailRowLabel}>Type</Text>
                      <Text style={styles.txDetailRowValue}>
                        {selectedItemTransaction.type === 'income' ? 'Income' : 'Expense'}
                      </Text>
                    </View>
                    <View style={styles.txDetailRowDivider} />

                    {/* Logged by Row */}
                    <View style={styles.txDetailRow}>
                      <Text style={styles.txDetailRowLabel}>Logged by</Text>
                      <Text style={styles.txDetailRowValue}>
                        {selectedItemTransaction.bankSource
                          ? `${selectedItemTransaction.bankSource} (Auto)`
                          : 'CashCompass'}
                      </Text>
                    </View>
                  </View>

                  {/* Section: Photos Header */}
                  <Text style={styles.txDetailSectionHeading}>Photos</Text>

                  {/* Photos Card */}
                  <View style={styles.txDetailCard}>
                    <View style={styles.txPhotosGrid}>
                      {attachedPhotos.map((photoUri, pIdx) => (
                        <View key={pIdx} style={styles.txPhotoThumb}>
                          <Image
                            source={{ uri: photoUri }}
                            style={{ width: '100%', height: '100%', borderRadius: 16 }}
                          />
                        </View>
                      ))}
                      <TouchableOpacity
                        style={styles.txAddPhotoBtn}
                        activeOpacity={0.7}
                        onPress={handleAddPhoto}
                      >
                        <Ionicons name="add" size={24} color="#94A3B8" />
                        <Text style={styles.txAddPhotoText}>Add</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Delete Button */}
                  <TouchableOpacity
                    style={styles.txDeleteBtn}
                    activeOpacity={0.8}
                    onPress={handleDeleteTransactionDirectly}
                  >
                    <Text style={styles.txDeleteBtnText}>Delete</Text>
                  </TouchableOpacity>
                </ScrollView>

                {/* Edit Transaction Overlay */}
                {isEditingTx && (
                  <View style={styles.editTxOverlay}>
                    <View style={styles.editTxCard}>
                      <View style={styles.editTxHeader}>
                        <Text style={styles.editTxTitle}>Edit Transaction</Text>
                        <TouchableOpacity
                          onPress={() => setIsEditingTx(false)}
                          activeOpacity={0.7}
                        >
                          <Ionicons name="close" size={22} color="#64748B" />
                        </TouchableOpacity>
                      </View>

                      <Text style={styles.editLimitDesc}>
                        Update the title and amount for this transaction.
                      </Text>

                      <View style={[styles.editLimitInputBox, { marginBottom: 12 }]}>
                        <Ionicons
                          name="pricetag-outline"
                          size={18}
                          color="#94A3B8"
                          style={{ marginRight: 8 }}
                        />
                        <TextInput
                          style={styles.editLimitInput}
                          placeholder="Title"
                          placeholderTextColor="#94A3B8"
                          value={editTxTitle}
                          onChangeText={setEditTxTitle}
                        />
                      </View>

                      <View style={styles.editLimitInputBox}>
                        <Text style={styles.editLimitCurrency}>RM</Text>
                        <TextInput
                          style={styles.editLimitInput}
                          placeholder="0.00"
                          placeholderTextColor="#94A3B8"
                          keyboardType="decimal-pad"
                          value={editTxAmount}
                          onChangeText={setEditTxAmount}
                          autoFocus
                        />
                      </View>

                      <TouchableOpacity
                        style={styles.editLimitSaveBtn}
                        onPress={handleSaveEditTx}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.editLimitSaveText}>Save Changes</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            ) : (
              /* ========================================================================= */
              /* CATEGORY OVERVIEW SCREEN (Initial Screen when tapping category)          */
              /* ========================================================================= */
              <>
                <View style={styles.detailHeaderRow}>
                  <TouchableOpacity
                    style={styles.detailCircleBtn}
                    onPress={() => setSelectedExpenseDetail(null)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="close" size={22} color="#0D0E15" />
                  </TouchableOpacity>

                  <Text style={styles.detailHeaderTitle}>
                    {selectedExpenseDetail?.title}
                  </Text>

                  <TouchableOpacity
                    style={styles.detailCircleBtn}
                    onPress={() => setIsMenuOpen((prev) => !prev)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="ellipsis-horizontal" size={22} color="#0D0E15" />
                  </TouchableOpacity>
                </View>

                {isMenuOpen && (
                  <View style={styles.floatingMenuCard}>
                    <TouchableOpacity
                      style={styles.floatingMenuItem}
                      onPress={handleOpenEditLimit}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name="speedometer-outline"
                        size={20}
                        color="#0D0E15"
                        style={{ marginRight: 10 }}
                      />
                      <Text style={styles.floatingMenuText}>
                        {selectedExpenseDetail?.limit ? 'Edit Limit' : 'Set Limit'}
                      </Text>
                    </TouchableOpacity>

                    {selectedExpenseDetail?.limit && (
                      <TouchableOpacity
                        style={styles.floatingMenuItem}
                        onPress={handleRemoveLimit}
                        activeOpacity={0.7}
                      >
                        <Ionicons
                          name="close-circle-outline"
                          size={20}
                          color="#EF4444"
                          style={{ marginRight: 10 }}
                        />
                        <Text style={[styles.floatingMenuText, { color: '#EF4444' }]}>
                          Remove Limit
                        </Text>
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      style={styles.floatingMenuItem}
                      onPress={() => {
                        setIsMenuOpen(false);
                        handleDeleteFromDetail();
                      }}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color="#EF4444"
                        style={{ marginRight: 10 }}
                      />
                      <Text style={[styles.floatingMenuText, { color: '#EF4444' }]}>
                        Delete
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                <View style={styles.detailContentContainer}>
                  <Text style={styles.detailMyExpensesLabel}>Total Spent</Text>
                  <Text style={styles.detailBigAmount}>
                    RM{selectedExpenseDetail?.amount}
                  </Text>

                  {selectedExpenseDetail?.limit && (
                    <View style={styles.limitBadgeRow}>
                      <Text style={styles.limitBadgeText}>
                        Monthly Limit: RM{selectedExpenseDetail.limit} (
                        {Math.round(
                          (selectedExpenseDetail.amount / selectedExpenseDetail.limit) * 100
                        )}
                        %)
                      </Text>
                    </View>
                  )}

                  <Text style={styles.detailDateHeader}>
                    {selectedExpenseDetail?.date}
                  </Text>

                  {/* Clickable Transaction Card -> Opens Transaction Detail View (User Screenshot) */}
                  <TouchableOpacity
                    style={styles.detailTransactionCard}
                    activeOpacity={0.7}
                    onPress={() => setSelectedItemTransaction(selectedExpenseDetail)}
                  >
                    <View style={styles.detailTxLeft}>
                      <Text style={styles.detailTxEmoji}>
                        {selectedExpenseDetail?.emoji || '💸'}
                      </Text>
                      <View>
                        <Text style={styles.detailTxTitle}>
                          {selectedExpenseDetail?.title}
                        </Text>
                        <Text style={styles.detailTxSubtitle}>
                          {selectedExpenseDetail?.time}
                        </Text>
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={styles.detailTxAmount}>
                        -RM{selectedExpenseDetail?.amount}
                      </Text>
                      <Ionicons
                        name="chevron-forward"
                        size={16}
                        color="#94A3B8"
                        style={{ marginLeft: 6 }}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* EDIT LIMIT OVERLAY (Rendered directly inside Detail Modal to eliminate iOS nested modal conflicts) */}
            {isEditLimitModalOpen && (
              <View style={styles.editLimitBackdrop}>
                <View style={styles.editLimitCard}>
                  <View style={styles.editLimitHeader}>
                    <Text style={styles.editLimitTitle}>Set Monthly Limit</Text>
                    <TouchableOpacity
                      onPress={() => setIsEditLimitModalOpen(false)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="close" size={22} color="#64748B" />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.editLimitDesc}>
                    Set a budget limit for {selectedExpenseDetail?.title} to track your spending.
                  </Text>

                  <View style={styles.editLimitInputBox}>
                    <Text style={styles.editLimitCurrency}>RM</Text>
                    <TextInput
                      style={styles.editLimitInput}
                      placeholder="0.00"
                      placeholderTextColor="#94A3B8"
                      keyboardType="decimal-pad"
                      value={newLimitValue}
                      onChangeText={setNewLimitValue}
                      autoFocus
                    />
                  </View>

                  <TouchableOpacity
                    style={styles.editLimitSaveBtn}
                    onPress={handleSaveLimit}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.editLimitSaveText}>Save Limit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </SafeAreaView>
        </Modal>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 110, // 110px per design.md
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pillButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 27,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.04)',
  },
  pillButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0D0E15',
  },
  autoDetectPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F5',
    borderWidth: 1,
    borderColor: 'rgba(253, 92, 163, 0.25)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 27,
  },
  autoDetectDot: {
    fontSize: 12,
    marginRight: 4,
  },
  autoDetectText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fd5ca3',
  },
  dateFilterButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 27,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.04)',
  },
  dateFilterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0D0E15',
  },

  // Big Hero Card (Liquid Glass Gradient Style)
  heroCardContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 0,
    borderColor: 'rgba(255, 255, 255, 0.65)',
    shadowColor: '#fd5ca3',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },
  heroGlassBlur: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  heroGlassGradient: {
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 22,
    borderRadius: 24,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  heroBankName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0D0E15',
    letterSpacing: 0.2,
  },
  heroAccountType: {
    fontSize: 10,
    fontWeight: '600',
    color: '#666666',
    letterSpacing: 1.2,
    marginTop: 2,
  },
  heroTagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderWidth: 0,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  heroTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fd5ca3',
    marginLeft: 3,
  },
  heroBalanceSection: {
    marginBottom: 20,
  },
  heroBalanceLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  heroBalanceLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666666',
    letterSpacing: 1.2,
  },
  heroEyeBtn: {
    marginLeft: 8,
    padding: 2,
  },
  heroBalanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  heroCurrencyPrefix: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0D0E15',
    marginRight: 6,
  },
  heroBalanceNumber: {
    fontSize: 36,
    fontWeight: '800',
    color: '#0D0E15',
    letterSpacing: -1,
  },
  heroBottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    gap: 40,
  },
  heroStatCol: {
    minWidth: 90,
  },
  heroStatLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#666666',
    letterSpacing: 1,
    marginBottom: 3,
  },
  heroStatValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0D0E15',
  },

  // Quick Action Buttons (Bills & Receipts)
  quickActionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    borderColor: 'rgba(0, 0, 0, 0.04)',
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0D0E15',
    marginLeft: 8,
  },
  // Metric Selector Bottom Sheet (User Screenshot)
  metricSheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 38 : 24,
    borderWidth: 0,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  metricSheetHandle: {
    width: 44,
    height: 5,
    backgroundColor: '#CBD5E1',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 14,
  },
  metricItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 4,
  },
  metricItemIconBox: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  metricSymbolText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#64748B',
  },
  metricItemTextCol: {
    flex: 1,
  },
  metricItemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0D0E15',
  },
  metricItemSubtitle: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  metricDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 46,
  },
  sectionTitle: {
    fontSize: 20, // Clean secondary header per design.md
    fontWeight: '700',
    color: '#0D0E15',
    marginBottom: 12,
    marginTop: 6,
  },
  // Kad Maklumat: Putih flat tanpa bayang tebal (borderWidth: 1, borderColor: 'rgba(0,0,0,0.04)', borderRadius: 18)
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 0,
    borderColor: 'rgba(0, 0, 0, 0.04)',
    padding: 16,
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  emojiIcon: {
    fontSize: 22,
    marginRight: 12,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0D0E15',
  },
  autoLoggedBadge: {
    fontSize: 11,
    color: '#fd5ca3',
    fontWeight: '600',
    marginTop: 1,
  },
  itemAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0D0E15',
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#fd5ca3', // Aksen Utama per design.md
    borderRadius: 3,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    marginVertical: 12,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pieCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
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
    color: '#0D0E15',
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
    color: '#666666',
    fontWeight: '500',
  },
  chartCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0D0E15',
    marginBottom: 16,
  },
  lineChartPlaceholder: {
    height: 95,
    justifyContent: 'flex-end',
    marginBottom: 10,
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
    width: 14,
    borderRadius: 7,
  },
  tooltip: {
    position: 'absolute',
    top: 2,
    backgroundColor: '#FFFFFF',
    borderWidth: 0,
    borderColor: 'rgba(0,0,0,0.06)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 10,
  },
  tooltipText: {
    fontWeight: '700',
    fontSize: 12,
    color: '#0D0E15',
  },
  chartBaseline: {
    height: 2,
    backgroundColor: '#fd5ca3',
    borderRadius: 1,
    marginTop: 2,
  },
  monthsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  monthText: {
    fontSize: 12,
    color: '#666666',
  },
  // FAB (27px radius style, 60x60, #fd5ca3)
  fab: {
    position: 'absolute',
    bottom: 95,
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#fd5ca3',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 101,
    shadowColor: '#fd5ca3',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 4,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
    zIndex: 999,
  },
  fabMenuSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0D0E15',
    marginBottom: 4,
  },
  sheetSubtitle: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 18,
  },
  simHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 0,
    borderColor: 'rgba(0, 0, 0, 0.04)',
  },
  actionItemGlassWrapper: {
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 0,
    borderColor: 'rgba(255, 255, 255, 0.45)',
  },
  actionItemGlass: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  actionIconBox: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  actionTextBox: {
    flex: 1,
  },
  wowBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  wowBadge: {
    backgroundColor: '#FFF0F5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  wowBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#fd5ca3',
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0D0E15',
  },
  actionDesc: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  cancelSheetBtn: {
    backgroundColor: '#F1F5F9',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  cancelSheetText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0D0E15',
  },

  // Log Transaction Modal Styles
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
    borderWidth: 0.5,
    borderColor: '#E2E8F0',
  },
  logCancelText: {
    color: '#fd5ca3',
    fontSize: 15,
    fontWeight: '600',
  },
  logHeaderTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0D0E15',
  },
  logScanHeaderBtn: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 0.5,
    borderColor: '#FCE7F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logSegmentedBox: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
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
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.04)',
  },
  logSegmentText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  logSegmentTextActive: {
    color: '#0D0E15',
    fontWeight: '700',
  },
  logAmountSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  logAmountCurrencyLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 2,
  },
  logAmountInput: {
    fontSize: 40,
    fontWeight: '800',
    color: '#0D0E15',
    minWidth: 90,
    textAlign: 'center',
    height: 52,
  },
  scanReceiptPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 0.5,
    borderColor: '#FCE7F3',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 8,
  },
  scanReceiptPillText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fd5ca3',
  },
  logCategoryHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0D0E15',
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
    backgroundColor: '#F8FAFC',
    borderWidth: 0,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  logCategoryPillActive: {
    backgroundColor: '#fd5ca3',
    borderColor: '#fd5ca3',
  },
  logCategoryPillCustom: {
    backgroundColor: '#F8FAFC',
    borderWidth: 0,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
  },
  logCategoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0D0E15',
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
    borderWidth: 0,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 44,
    fontSize: 14,
    color: '#0D0E15',
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
    fontSize: 15,
    fontWeight: '600',
    color: '#0D0E15',
  },
  logNameInput: {
    fontSize: 15,
    color: '#0D0E15',
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 8,
  },
  logDateBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0D0E15',
  },
  logFormDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  logAddButton: {
    height: 54,
    borderRadius: 27, // Bulat penuh 27px per design.md
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 20,
  },
  logAddButtonActive: {
    backgroundColor: '#fd5ca3',
  },
  logAddButtonDisabled: {
    backgroundColor: '#FCE4EC',
  },
  logAddButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  logAddButtonTextActive: {
    color: '#FFFFFF',
  },
  logAddButtonTextDisabled: {
    color: '#F48FB1',
  },

  // Detail Modal Styles
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
    borderWidth: 0.5,
    borderColor: '#F1F5F9',
  },
  detailHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0D0E15',
  },
  floatingMenuCard: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 66 : 56,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 0,
    borderColor: 'rgba(0, 0, 0, 0.08)',
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
    color: '#0D0E15',
  },
  detailContentContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  detailMyExpensesLabel: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
    marginBottom: 4,
  },
  detailBigAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0D0E15',
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
    color: '#666666',
  },
  detailDateHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0D0E15',
    marginBottom: 12,
  },
  detailTransactionCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.04)',
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
    color: '#0D0E15',
  },
  detailTxSubtitle: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  detailTxAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#EF4444',
  },

  // Edit Limit Modal Styles
  editLimitBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  editLimitCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.04)',
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
    color: '#0D0E15',
  },
  editLimitDesc: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  editLimitInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 0.5,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 20,
  },
  editLimitCurrency: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0D0E15',
    marginRight: 8,
  },
  editLimitInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: '#0D0E15',
  },
  editLimitSaveBtn: {
    backgroundColor: '#fd5ca3',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editLimitSaveText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  // Transaction Single Item Detail Styles (User Screenshot)
  txDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  txDetailHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0D0E15',
  },
  txDetailEditPill: {
    paddingVertical: 7,
    paddingHorizontal: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(253, 92, 163, 0.25)',
    backgroundColor: '#FFFFFF',
  },
  txDetailEditText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fd5ca3',
  },
  txDetailScroll: {
    flex: 1,
    width: '100%',
  },
  txDetailScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    alignItems: 'center',
  },
  txDetailAvatarBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  txDetailAvatarEmoji: {
    fontSize: 38,
  },
  txDetailHeroAmount: {
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: -1,
    marginBottom: 4,
  },
  txDetailHeroCategory: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0D0E15',
    marginBottom: 24,
  },
  txDetailSectionHeading: {
    alignSelf: 'flex-start',
    fontSize: 16,
    fontWeight: '700',
    color: '#0D0E15',
    marginBottom: 10,
    marginTop: 10,
  },
  txDetailCard: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 22,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.04)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 16,
  },
  txDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 13,
  },
  txDetailRowLabel: {
    fontSize: 15,
    color: '#8E8E93',
    fontWeight: '500',
  },
  txDetailRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txDetailRowValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0D0E15',
  },
  txDetailRowDivider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  txPhotosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 10,
    gap: 12,
  },
  txAddPhotoBtn: {
    width: 80,
    height: 80,
    borderRadius: 18,
    borderWidth: 0.5,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  txAddPhotoText: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '600',
    marginTop: 2,
  },
  txPhotoThumb: {
    width: 80,
    height: 80,
    borderRadius: 18,
    overflow: 'hidden',
  },
  txDeleteBtn: {
    width: '100%',
    backgroundColor: '#FFF0F5',
    borderRadius: 24,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  txDeleteBtnText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '700',
  },
  // Edit Transaction Overlay
  editTxOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 9999,
  },
  editTxCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 0,
    borderColor: 'rgba(0, 0, 0, 0.04)',
  },
  editTxHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  editTxTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0D0E15',
  },
});