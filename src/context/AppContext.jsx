import React, { createContext, useContext, useMemo, useState } from 'react';

const AppContext = createContext(null);

export const defaultExpenseCategories = [
  { id: 'coffee', name: 'Coffee', emoji: '☕' },
  { id: 'transport', name: 'Transport', emoji: '🚗' },
  { id: 'rent', name: 'Rent', emoji: '🏠' },
  { id: 'subscriptions', name: 'Subscriptions', emoji: '📱' },
  { id: 'utilities', name: 'Utilities', emoji: '💡' },
  { id: 'groceries', name: 'Groceries', emoji: '🛒' },
];

export const moreExpenseCategories = [
  { id: 'food', name: 'Food & Dining', emoji: '🍔' },
  { id: 'shopping', name: 'Shopping', emoji: '🛍️' },
  { id: 'health', name: 'Healthcare', emoji: '💊' },
  { id: 'entertainment', name: 'Entertainment', emoji: '🎬' },
];

export const defaultIncomeCategories = [
  { id: 'salary', name: 'Salary', emoji: '💰' },
  { id: 'allowance', name: 'Allowance', emoji: '💵' },
  { id: 'freelance', name: 'Freelance', emoji: '💼' },
  { id: 'investment', name: 'Investment', emoji: '📈' },
  { id: 'bonus', name: 'Bonus', emoji: '🎁' },
  { id: 'other', name: 'Other', emoji: '🪙' },
];

let idCounter = 500;
export function generateUniqueId(prefix = 'item') {
  idCounter += 1;
  return `${prefix}-${Date.now()}-${idCounter}`;
}

export function AppProvider({ children }) {
  // Account & Filter States
  const [accountType, setAccountType] = useState('Personal');
  const [selectedMonth, setSelectedMonth] = useState('Oct');

  // Incomes State
  const [incomes, setIncomes] = useState([
    { id: 'inc-1', title: 'Monthly Allowance', amount: 800, emoji: '💰', category: 'Salary', date: '15/10/26', day: 15, time: '8:10 PM' },
  ]);

  // Recurring Expenses (Commitments)
  const [recurringExpenses, setRecurringExpenses] = useState([
    {
      id: 'rec-1',
      title: 'iCloud+ & Spotify',
      amount: 9,
      emoji: '📱',
      category: 'Subscriptions',
      limit: 36,
      date: '15/10/26',
      day: 15,
      time: '8:10 PM',
    },
    {
      id: 'rec-2',
      title: 'Room Rental',
      amount: 150,
      emoji: '🏠',
      category: 'Rent & Mortgage',
      date: '15/10/26',
      day: 15,
      time: '8:10 PM',
    },
    {
      id: 'rec-3',
      title: 'Mobile Data & WiFi',
      amount: 30,
      emoji: '💡',
      category: 'Utilities & Bills',
      date: '15/10/26',
      day: 15,
      time: '8:10 PM',
    },
  ]);

  // Variable / Daily Expenses
  const [expenses, setExpenses] = useState([
    {
      id: 'exp-1',
      title: 'Coffee & Snacks',
      amount: 12,
      emoji: '☕',
      category: 'Coffee',
      date: '15/10/26',
      day: 15,
      time: '8:10 PM',
    },
    {
      id: 'exp-2',
      title: 'RapidKL LRT Card',
      amount: 100,
      emoji: '🚗',
      category: 'Transport',
      date: '15/10/26',
      day: 15,
      time: '8:10 PM',
    },
  ]);

  // ----------------------------------------------------
  // FAKTOR WOW 1: Auto-Spending Tracker Notification
  // ----------------------------------------------------
  const [autoSpendingBanner, setAutoSpendingBanner] = useState(null);

  const triggerAutoSpendingNotification = (bankName = 'Maybank MAE', title = 'Starbucks Coffee', amount = 15.00, emoji = '☕', category = 'Coffee') => {
    const newTx = {
      id: generateUniqueId('auto'),
      title,
      amount,
      emoji,
      category,
      isAutoLogged: true,
      bankSource: bankName,
      date: '15/10/26',
      day: 15,
      time: 'Just now',
    };

    setExpenses((prev) => [newTx, ...prev]);

    setAutoSpendingBanner({
      id: Date.now(),
      bankName,
      title,
      amount,
      category,
      time: 'Just now',
    });
  };

  const dismissAutoSpendingBanner = () => {
    setAutoSpendingBanner(null);
  };

  // ----------------------------------------------------
  // FAKTOR WOW 3: Impulse 48-Hour Chill Items
  // ----------------------------------------------------
  const [impulseItems, setImpulseItems] = useState([
    {
      id: 'imp-1',
      title: 'Wireless ANC Headphones',
      price: 249,
      emoji: '🎧',
      reason: 'Wanted for studying in cafe',
      dailyBudgetRatio: 10, // 10 days of daily budget
      hoursRemaining: 34,
      totalHours: 48,
      status: 'active', // 'active' | 'resisted' | 'bought'
      dateAdded: '22/10/26',
    },
    {
      id: 'imp-2',
      title: 'Limited Edition Sneakers',
      price: 320,
      emoji: '👟',
      reason: 'Seen on TikTok trending',
      dailyBudgetRatio: 13,
      hoursRemaining: 18,
      totalHours: 48,
      status: 'active',
      dateAdded: '21/10/26',
    },
  ]);

  const addImpulseItem = (item) => {
    const newItem = {
      id: generateUniqueId('imp'),
      hoursRemaining: 48,
      totalHours: 48,
      status: 'active',
      dateAdded: 'Today',
      ...item,
    };
    setImpulseItems((prev) => [newItem, ...prev]);
  };

  const markImpulseResisted = (id) => {
    setImpulseItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, status: 'resisted', hoursRemaining: 0 } : it))
    );
  };

  const convertImpulseToExpense = (id) => {
    const target = impulseItems.find((it) => it.id === id);
    if (target) {
      const newExp = {
        id: generateUniqueId('exp'),
        title: target.title,
        amount: target.price,
        emoji: target.emoji || '🛍️',
        category: 'Shopping',
        date: '15/10/26',
        day: 15,
        time: '8:10 PM',
      };
      setExpenses((prev) => [newExp, ...prev]);
      setImpulseItems((prev) =>
        prev.map((it) => (it.id === id ? { ...it, status: 'bought', hoursRemaining: 0 } : it))
      );
    }
  };

  // ----------------------------------------------------
  // Calculations
  // ----------------------------------------------------
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

  // Unified Transactions List for TransactionsScreen
  const allTransactions = useMemo(() => {
    const incomeItems = incomes.map((it) => ({
      ...it,
      type: 'income',
      subtitle: it.category || 'Income',
    }));

    const recurringItems = recurringExpenses.map((it) => ({
      ...it,
      type: 'expense',
      isRecurring: true,
      subtitle: it.category || 'Recurring Commitment',
    }));

    const regularItems = expenses.map((it) => ({
      ...it,
      type: 'expense',
      isRecurring: false,
      subtitle: it.category || 'Daily Expense',
    }));

    return [...incomeItems, ...regularItems, ...recurringItems];
  }, [incomes, recurringExpenses, expenses]);

  // Total Resisted Savings from Impulse 48h
  const totalResistedSavings = useMemo(() => {
    return impulseItems
      .filter((it) => it.status === 'resisted')
      .reduce((sum, it) => sum + it.price, 0);
  }, [impulseItems]);

  return (
    <AppContext.Provider
      value={{
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
        allTransactions,
        // WOW 1: Auto-Spending
        autoSpendingBanner,
        triggerAutoSpendingNotification,
        dismissAutoSpendingBanner,
        // WOW 3: Impulse 48h Chill
        impulseItems,
        addImpulseItem,
        markImpulseResisted,
        convertImpulseToExpense,
        totalResistedSavings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
