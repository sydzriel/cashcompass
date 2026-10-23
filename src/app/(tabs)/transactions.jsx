import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  Alert,
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
import ImpulseCalculatorModal from '../../components/ImpulseCalculatorModal';
import {
  defaultExpenseCategories,
  defaultIncomeCategories,
  generateUniqueId,
  moreExpenseCategories,
  useApp,
} from '../../context/AppContext';

export default function TransactionsScreen() {
  const {
    accountType,
    setAccountType,
    allTransactions,
    setExpenses,
    totalIncome,
    totalExpenses,
    // Wow 3: Impulse items
    impulseItems,
    addImpulseItem,
    markImpulseResisted,
    convertImpulseToExpense,
    totalResistedSavings,
  } = useApp();

  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'calendar' | 'chill'
  const [selectedDay, setSelectedDay] = useState(15);
  const [calendarMonth, setCalendarMonth] = useState('October 2026');

  // Modals visibility
  const [isFabMenuOpen, setIsFabMenuOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isReceiptScannerOpen, setIsReceiptScannerOpen] = useState(false);
  const [isImpulseModalOpen, setIsImpulseModalOpen] = useState(false);
  // Track if scanner was opened from inside Log Modal (so we reopen it after)
  const [scanFromLogModal, setScanFromLogModal] = useState(false);

  // Manual Log Form State
  const [transactionType, setTransactionType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(defaultExpenseCategories[0]);
  const [transactionName, setTransactionName] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState('');

  // Group transactions for List View
  const groupedTransactions = useMemo(() => {
    const map = {};
    allTransactions.forEach((tx) => {
      const dateKey = tx.date === '15/10/26' ? 'Today' : tx.date || 'Earlier';
      if (!map[dateKey]) {
        map[dateKey] = [];
      }
      map[dateKey].push(tx);
    });
    return map;
  }, [allTransactions]);

  // Days with transactions
  const daysWithTransactions = useMemo(() => {
    const set = new Set();
    allTransactions.forEach((tx) => {
      if (tx.day) set.add(tx.day);
    });
    return set;
  }, [allTransactions]);

  // Selected Day Transactions
  const selectedDayTransactions = useMemo(() => {
    return allTransactions.filter((tx) => tx.day === selectedDay);
  }, [allTransactions, selectedDay]);

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

  const alertMessage = (title, message) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  // Open Log Modal
  const handleOpenManualLog = (presetDay = null) => {
    const wasMenuOpen = isFabMenuOpen;
    setIsFabMenuOpen(false);
    if (presetDay) setSelectedDay(presetDay);
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

  // Save Scanned Receipt -> Auto-fills Log form & reopens it
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
    // Reopen Log Modal after scanner fully dismisses
    setTimeout(() => setIsLogModalOpen(true), 350);
  };

  // Open scanner from inside Log Transaction modal (close Log first to avoid iOS nested-modal bug)
  const handleScanFromInsideLog = () => {
    setIsLogModalOpen(false);
    setScanFromLogModal(true);
    setTimeout(() => setIsReceiptScannerOpen(true), 350);
  };

  // Save Impulse Item
  const handleStartImpulseLock = (impulseData) => {
    addImpulseItem(impulseData);
    setActiveTab('chill');
    alertMessage(
      '48-Hour Chill Lock Activated! ⏳',
      `"${impulseData.title}" (RM${impulseData.price}) is now chilling for 48 hours.`
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
    const targetDay = activeTab === 'calendar' ? selectedDay : 15;
    const formattedDate = `${String(targetDay).padStart(2, '0')}/10/26`;

    const newTx = {
      id: generateUniqueId('tx'),
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

    setExpenses((prev) => [newTx, ...prev]);
    setIsLogModalOpen(false);
  };

  // Delete Transaction
  const confirmDeleteTx = (id, title, txAmount) => {
    const doDelete = () => {
      setExpenses((prev) => prev.filter((item) => item.id !== id));
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

  const activeCategoryList =
    transactionType === 'income'
      ? defaultIncomeCategories
      : showMore
        ? [...defaultExpenseCategories, ...moreExpenseCategories]
        : defaultExpenseCategories;

  const paddingDays = [null, null, null, null];
  const daysInOctober = Array.from({ length: 31 }, (_, i) => i + 1);

  // Active chilling items count
  const activeChillCount = impulseItems.filter((it) => it.status === 'active').length;

  return (
    <AppBackground opacity={1.00} style={styles.gradientContainer}>
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
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
                size={16}
                color="#0D0E15"
                style={{ marginLeft: 6 }}
              />
            </TouchableOpacity>
          </View>

          {/* Segmented Switcher: List | Calendar | Chill Lock */}
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

            <TouchableOpacity
              style={[
                styles.segmentButton,
                activeTab === 'chill' && styles.activeSegment,
              ]}
              onPress={() => setActiveTab('chill')}
              activeOpacity={0.8}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text
                  style={[
                    styles.segmentText,
                    activeTab === 'chill' && styles.activeSegmentText,
                  ]}
                >
                  Chill Lock
                </Text>
                {activeChillCount > 0 && (
                  <View style={styles.tabBadge}>
                    <Text style={styles.tabBadgeText}>{activeChillCount}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>

          {/* Income & Expenses Summary Cards (Flat White per design.md) */}
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

          {/* ----------------- TAB 1: LIST VIEW ----------------- */}
          {activeTab === 'list' && (
            <View>
              {Object.keys(groupedTransactions).length === 0 ? (
                <View style={styles.emptyCard}>
                  <Text style={styles.emptyCardText}>No transactions recorded yet.</Text>
                  <TouchableOpacity
                    style={styles.addEmptyBtn}
                    onPress={() => handleOpenManualLog()}
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
                                {tx.time || '8:10 PM'}
                                {tx.isAutoLogged ? ' • ⚡ Auto' : ''}
                              </Text>
                            </View>
                          </View>
                          <Text
                            style={
                              isIncome ? styles.positiveAmount : styles.negativeAmount
                            }
                          >
                            {isIncome
                              ? `+RM${tx.amount.toFixed(2)}`
                              : `-RM${tx.amount.toFixed(2)}`}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ))
              )}
            </View>
          )}

          {/* ----------------- TAB 2: CALENDAR VIEW ----------------- */}
          {activeTab === 'calendar' && (
            <View>
              <View style={styles.calendarCard}>
                <View style={styles.calendarHeader}>
                  <TouchableOpacity
                    onPress={() => setCalendarMonth('September 2026')}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="chevron-back" size={20} color="#0D0E15" />
                  </TouchableOpacity>
                  <Text style={styles.calendarTitle}>{calendarMonth}</Text>
                  <TouchableOpacity
                    onPress={() => setCalendarMonth('November 2026')}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="chevron-forward" size={20} color="#0D0E15" />
                  </TouchableOpacity>
                </View>

                <View style={styles.weekdaysRow}>
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                    <Text key={idx} style={styles.weekdayText}>
                      {day}
                    </Text>
                  ))}
                </View>

                <View style={styles.daysGrid}>
                  {paddingDays.map((_, i) => (
                    <View key={`pad-${i}`} style={styles.dayCell} />
                  ))}

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

              <View style={styles.dayHeaderRow}>
                <Text style={styles.sectionTitle}>{selectedDay} Oct 2026</Text>
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

              {selectedDayTransactions.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Text style={styles.emptyCardText}>
                    No transactions on {selectedDay} Oct.
                  </Text>
                  <TouchableOpacity
                    style={styles.addEmptyBtn}
                    onPress={() => handleOpenManualLog(selectedDay)}
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
                            {tx.time || '8:10 PM'}
                          </Text>
                        </View>
                      </View>
                      <Text
                        style={
                          isIncome ? styles.positiveAmount : styles.negativeAmount
                        }
                      >
                        {isIncome
                          ? `+RM${tx.amount.toFixed(2)}`
                          : `-RM${tx.amount.toFixed(2)}`}
                      </Text>
                    </TouchableOpacity>
                  );
                })
              )}
            </View>
          )}

          {/* ----------------- TAB 3: 48-HOUR CHILL LOCK (FAKTOR WOW III) ----------------- */}
          {activeTab === 'chill' && (
            <View>
              {/* Savings Shield Card */}
              <View style={styles.shieldCard}>
                <View style={styles.shieldIconBox}>
                  <Text style={{ fontSize: 26 }}>🛡️</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.shieldTitle}>Impulse Savings Shield</Text>
                  <Text style={styles.shieldBigAmount}>
                    +RM{totalResistedSavings.toFixed(2)} Saved
                  </Text>
                  <Text style={styles.shieldDesc}>
                    Money saved by letting impulse urges cool down for 48 hours.
                  </Text>
                </View>
              </View>

              <View style={styles.chillHeaderRow}>
                <Text style={styles.sectionTitle}>Chilling Items ({impulseItems.length})</Text>
                <TouchableOpacity
                  style={styles.addChillSmallBtn}
                  onPress={() => setIsImpulseModalOpen(true)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.addChillSmallText}>+ New 48h Lock</Text>
                </TouchableOpacity>
              </View>

              {impulseItems.map((item) => {
                const isChilling = item.status === 'active';
                const isResisted = item.status === 'resisted';
                const isBought = item.status === 'bought';

                const progressPercent = Math.min(
                  100,
                  Math.round(((item.totalHours - item.hoursRemaining) / item.totalHours) * 100)
                );

                return (
                  <View key={item.id} style={styles.chillCard}>
                    <View style={styles.chillCardTop}>
                      <View style={styles.chillLeftRow}>
                        <Text style={styles.chillEmoji}>{item.emoji || '🛍️'}</Text>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.chillTitle}>{item.title}</Text>
                          <Text style={styles.chillReason}>&ldquo;{item.reason}&rdquo;</Text>
                        </View>
                      </View>
                      <Text style={styles.chillPrice}>RM{item.price.toFixed(2)}</Text>
                    </View>

                    {/* Ratio & Status Row */}
                    <View style={styles.ratioRow}>
                      <View style={styles.budgetRatioBadge}>
                        <Text style={styles.budgetRatioText}>
                          = {item.dailyBudgetRatio} Days of Daily Budget
                        </Text>
                      </View>

                      {isChilling && (
                        <View style={styles.statusBadgeChilling}>
                          <Text style={styles.statusBadgeTextChilling}>
                            ⏳ {item.hoursRemaining}h remaining
                          </Text>
                        </View>
                      )}

                      {isResisted && (
                        <View style={styles.statusBadgeResisted}>
                          <Text style={styles.statusBadgeTextResisted}>
                            🛡️ Resisted & Saved!
                          </Text>
                        </View>
                      )}

                      {isBought && (
                        <View style={styles.statusBadgeBought}>
                          <Text style={styles.statusBadgeTextBought}>
                            🛍️ Bought
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Countdown Progress Bar */}
                    {isChilling && (
                      <View style={styles.chillProgressContainer}>
                        <View style={styles.chillProgressBg}>
                          <View
                            style={[
                              styles.chillProgressFill,
                              { width: `${progressPercent}%` },
                            ]}
                          />
                        </View>
                        <Text style={styles.chillProgressLabel}>
                          {progressPercent}% cool-down elapsed ({item.hoursRemaining} hours left)
                        </Text>
                      </View>
                    )}

                    {/* Action Decision Buttons */}
                    {isChilling && (
                      <View style={styles.chillActionsRow}>
                        <TouchableOpacity
                          style={styles.resistActionBtn}
                          onPress={() => markImpulseResisted(item.id)}
                          activeOpacity={0.8}
                        >
                          <Ionicons
                            name="shield-checkmark"
                            size={16}
                            color="#16A34A"
                            style={{ marginRight: 6 }}
                          />
                          <Text style={styles.resistActionText}>
                            I Resisted! (+RM{item.price})
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.buyActionBtn}
                          onPress={() => convertImpulseToExpense(item.id)}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.buyActionText}>Still Want It</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>

        {/* Floating Action Button (FAB) -> Opens Log Transaction directly (Matches Home Page) */}
        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.85}
          onPress={() => handleOpenManualLog()}
        >
          <Ionicons name="add" size={32} color="#FFFFFF" />
        </TouchableOpacity>

        {/* FAB Action Picker — inline View overlay (avoids iOS modal-on-modal bug) */}
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
                onPress={() => {
                  setIsFabMenuOpen(false);
                  handleOpenManualLog();
                }}
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

              {/* Action 2: AI Receipt Scanner */}
              <TouchableOpacity
                style={styles.actionItem}
                onPress={() => {
                  setIsFabMenuOpen(false);
                  setIsReceiptScannerOpen(true);
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.actionIconBox, { backgroundColor: '#FFF0F5' }]}>
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

              {/* Action 3: Impulse Buy 48h Lock */}
              <TouchableOpacity
                style={styles.actionItem}
                onPress={() => {
                  setIsFabMenuOpen(false);
                  setIsImpulseModalOpen(true);
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.actionIconBox, { backgroundColor: '#FEF3C7' }]}>
                  <Text style={{ fontSize: 22 }}>⏳</Text>
                </View>
                <View style={styles.actionTextBox}>
                  <View style={styles.wowBadgeRow}>
                    <Text style={styles.actionTitle}>48-Hour Chill Calculator</Text>
                    <View style={[styles.wowBadge, { backgroundColor: '#FEF3C7' }]}>
                      <Text style={[styles.wowBadgeText, { color: '#D97706' }]}>IMPULSE RULE</Text>
                    </View>
                  </View>
                  <Text style={styles.actionDesc}>
                    Cool down impulse urges & save money
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
              </TouchableOpacity>

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

        {/* AI Receipt Scanner Modal (Faktor Wow II) */}
        <AIReceiptScannerModal
          visible={isReceiptScannerOpen}
          onClose={() => {
            setIsReceiptScannerOpen(false);
            // Reopen Log Modal if scanner was launched from inside it
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

              <Text style={styles.logCategoryHeader}>Category</Text>

              <View style={styles.logCategoryGrid}>
                {activeCategoryList.map((cat) => {
                 const isSelected = !isCustomCategory && selectedCategory?.name === cat.name;

  return (
    <TouchableOpacity
      key={cat.id || cat.name}
      style={[
        styles.logCategoryPill,
        isSelected && styles.logCategoryPillActive, // Style ni akan aktif bila isSelected === true
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
                      <Text style={styles.logDateBadgeText}>15/10/26</Text>
                    </View>
                    <View style={styles.logDateBadge}>
                      <Text style={styles.logDateBadgeText}>12:36 AM</Text>
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

              {/* Add Button: active (pink) when amount > 0, disabled (light pink) otherwise */}
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
    paddingBottom: 110, // 110px paddingBottom per design.md
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  pillButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 27,
    borderWidth: 0,
    borderColor: 'rgba(0, 0, 0, 0.04)',
  },
  pillButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0D0E15',
  },
  dateFilterButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 27,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0,
    borderColor: 'rgba(0, 0, 0, 0.04)',
  },
  dateFilterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0D0E15',
  },
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 24,
    padding: 3,
    marginBottom: 16,
    borderWidth: 0,
    borderColor: 'rgba(0, 0, 0, 0.04)',
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 21,
  },
  activeSegment: {
    backgroundColor: '#FFFFFF',
    borderWidth: 0,
    borderColor: 'rgba(0, 0, 0, 0.04)',
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666666',
  },
  activeSegmentText: {
    color: '#0D0E15',
    fontWeight: '700',
  },
  tabBadge: {
    backgroundColor: '#fd5ca3',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
    marginLeft: 4,
  },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 0,
    borderColor: 'rgba(0, 0, 0, 0.04)',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  incomeAmount: {
    fontSize: 20,
    fontWeight: '800',
    color: '#10B981',
  },
  expenseAmount: {
    fontSize: 20,
    fontWeight: '800',
    color: '#EF4444',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0D0E15',
    marginBottom: 10,
    marginTop: 6,
  },
  // Flat White Card per design.md
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 0,
    borderColor: 'rgba(0, 0, 0, 0.04)',
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  itemSubtitle: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  positiveAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#10B981',
  },
  negativeAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0D0E15',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 0,
    borderColor: 'rgba(0,0,0,0.04)',
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyCardText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
  },
  addEmptyBtn: {
    backgroundColor: '#FFF0F5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addEmptyBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fd5ca3',
  },

  // Calendar Card
  calendarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 0,
    borderColor: 'rgba(0, 0, 0, 0.04)',
    padding: 18,
    marginBottom: 16,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0D0E15',
  },
  weekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  weekdayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    width: 32,
    textAlign: 'center',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    alignItems: 'center',
    paddingVertical: 4,
    minHeight: 40,
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
    fontSize: 13,
    fontWeight: '600',
    color: '#0D0E15',
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
    marginBottom: 10,
  },
  dayTotalText: {
    fontSize: 13,
    fontWeight: '700',
  },

  // 48-Hour Chill Tab Styles
  shieldCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 0,
    borderColor: 'rgba(0, 0, 0, 0.04)',
    padding: 18,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  shieldIconBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  shieldTitle: {
    fontSize: 13,
    color: '#666666',
    fontWeight: '500',
  },
  shieldBigAmount: {
    fontSize: 22,
    fontWeight: '800',
    color: '#10B981',
    marginVertical: 2,
  },
  shieldDesc: {
    fontSize: 11,
    color: '#94A3B8',
    lineHeight: 15,
  },
  chillHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addChillSmallBtn: {
    backgroundColor: '#FFF0F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addChillSmallText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fd5ca3',
  },
  chillCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 0,
    borderColor: 'rgba(0, 0, 0, 0.04)',
    padding: 16,
    marginBottom: 14,
  },
  chillCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  chillLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  chillEmoji: {
    fontSize: 26,
    marginRight: 12,
  },
  chillTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0D0E15',
  },
  chillReason: {
    fontSize: 12,
    color: '#666666',
    fontStyle: 'italic',
    marginTop: 2,
  },
  chillPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0D0E15',
  },
  ratioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    flexWrap: 'wrap',
    gap: 6,
  },
  budgetRatioBadge: {
    backgroundColor: '#F8FAFC',
    borderWidth: 0,
    borderColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  budgetRatioText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D0E15',
  },
  statusBadgeChilling: {
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusBadgeTextChilling: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D97706',
  },
  statusBadgeResisted: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusBadgeTextResisted: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16A34A',
  },
  statusBadgeBought: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusBadgeTextBought: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  chillProgressContainer: {
    marginVertical: 6,
  },
  chillProgressBg: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  chillProgressFill: {
    height: '100%',
    backgroundColor: '#D97706',
    borderRadius: 3,
  },
  chillProgressLabel: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 4,
  },
  chillActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  resistActionBtn: {
    flex: 1.3,
    backgroundColor: '#DCFCE7',
    height: 44,
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resistActionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#16A34A',
  },
  buyActionBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0D0E15',
  },

  // FAB button
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

  // Log Modal
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
    borderWidth: 0,
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
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
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
    borderRadius: 27,
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
});