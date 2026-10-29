import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Language = 'EN' | 'BM';

const STORAGE_KEY = '@cashcompass_language';

export const translations = {
  EN: {
    // Navigation Tabs
    tab_home: 'Home',
    tab_transactions: 'Transactions',
    tab_goals: 'Goals',
    tab_profile: 'Profile',

    // Dashboard / Home Screen
    left_today: 'Left for Today',
    daily_budget: 'Daily Budget',
    recent_transactions: 'Recent Transactions',
    see_all: 'See All',
    talk_to_coach: 'Talk to Coach',
    safe_to_spend: 'Safe to spend',
    total_income: 'Total Income',
    total_expenses: 'Total Expenses',
    monthly_balance: 'Monthly Balance',
    personal_wallet: 'Personal',
    student_wallet: 'STUDENT WALLET',
    details: 'Details',
    income_label: 'INCOME',
    spending_label: 'SPENDING',
    quick_bills: 'Bills',
    quick_receipts: 'Receipts',
    section_expenses: 'Expenses',
    no_daily_expenses: 'No daily expenses yet',
    add_btn: '+ Add',
    section_recurring: 'Recurring Expenses',
    section_income: 'Income',
    no_income_logged: 'No income logged yet',
    metric_left: 'Left',
    metric_left_desc: 'Income minus spending',
    metric_spent: 'Spent',
    metric_spent_desc: 'What went out',
    metric_income: 'Income',
    metric_income_desc: 'What came in',
    metric_bills: 'Bills',
    metric_bills_desc: 'Rent, bills, and repeats',
    metric_everyday: 'Everyday',
    metric_everyday_desc: 'Spending besides bills',
    metric_per_day: 'Per day',
    metric_per_day_desc: 'Spending split across the days so far',
    metric_daily_room: 'Daily room',
    metric_daily_room_desc: "What's left, split across the days ahead",

    // Transactions Screen
    transactions_title: 'Transactions',
    search_placeholder: 'Search transactions...',
    filter_all: 'All',
    filter_income: 'Income',
    filter_expense: 'Expenses',
    tab_daily_expenses: 'Daily',
    tab_commitments: 'Commitments',
    tab_list: 'List',
    tab_calendar: 'Calendar',
    tab_chill_lock: 'Chill Lock',
    my_income: 'My Income',
    my_expenses: 'My Expenses',
    today_label: 'Today',
    no_transactions_today: 'No transactions for this day',
    empty_transactions: 'No transactions found',

    // Goals / Insights Screen
    goals_title: 'Goals',
    savings_progress: 'Savings Progress',
    target_amount: 'Target Amount',
    add_goal: '+ Add Goal',
    target_date: 'Target Date',
    current_saved: 'Saved so far',
    money_kept: 'Money kept',
    savings_rate: 'Savings rate',
    on_track: 'On track',
    travel_fund: 'Travel fund',
    tab_month: 'Month',
    tab_year: 'Year',
    tab_all: 'All',
    breakdown_by_category: 'Breakdown by category',

    // Profile Screen & Sections
    profile_title: 'Profile',
    everyday_section: 'EVERYDAY',
    advanced_section: 'ADVANCED',
    account_section: 'ACCOUNT',
    version_tagline: "Malaysia's cleanest finance app",

    // Profile Everyday Menu
    menu_coach: 'Coach',
    menu_loan_calc: 'Loan Calculator',
    menu_categories: 'Categories',
    menu_item_prices: 'Item Prices',
    menu_who_owes_who: 'Who Owes Who',
    menu_trips: 'Trips',
    menu_reminders: 'Reminders',
    menu_chill_lock: 'Chill Lock',

    // Profile Advanced Menu
    menu_recurring: 'Recurring',
    menu_smart_automation: 'Smart Automation',
    menu_live_activity: 'Live Activity',

    // Profile Account Section
    menu_edit_profile: 'Edit Profile',
    menu_edit_profile_desc: 'Name, picture & language',
    menu_clear_data: 'Clear all of my data',
    menu_clear_data_desc: 'Wipe transactions & local storage',
    menu_sign_out: 'Sign Out',
    menu_sign_out_desc: 'Log out of your account',

    // Edit Profile Modal / Screen
    edit_profile_title: 'Edit Profile',
    edit_profile_subtitle: 'Manage identity & language',
    choose_avatar: 'PROFILE PICTURE / AVATAR',
    choose_avatar_hint: 'Choose an icon or type custom initials',
    custom_initials: '✍️ Custom Initials (e.g. SZ)',
    apply: 'Apply',
    language_selection: 'LANGUAGE SELECTION',
    display_name: 'DISPLAY NAME',
    email_address: 'EMAIL ADDRESS',
    daily_budget_target: 'DAILY BUDGET TARGET (RM)',
    daily_budget_hint: 'Used for 48-Hour Chill impulse limiter and real-time widget alerts.',
    cancel: 'Cancel',
    save_changes: 'Save Changes',
    profile_updated: 'Profile Updated',
    profile_updated_desc: 'Your profile details and language preferences have been saved.',

    // Who Owes Who Screen
    who_owes_who_title: 'Who Owes Who',
    who_owes_who_subtitle: 'Money you owe and money others owe you',
    split_bill: 'Split bill',
    others_owe_you: 'OTHERS OWE YOU',
    you_owe_others: 'YOU OWE OTHERS',
    people_count: '0 people',
    tab_owed_to_you: 'Owed to you',
    tab_you_owe: 'You owe',
    tab_settled: 'Settled',
    empty_title: 'Nobody owes you yet',
    empty_subtitle: 'Add money you lent or paid on someone’s behalf.',
    add_money_owed: '+ Add money owed to you',

    // Alerts & Dialogs
    alert_sign_out_title: 'Sign Out',
    alert_sign_out_msg: 'Are you sure you want to log out of CashCompass?',
    alert_clear_data_title: 'Clear all of my data?',
    alert_clear_data_msg: 'Are you sure you want to permanently erase all recorded transactions, incomes, recurring expenses, and local preferences? This action cannot be reversed.',
    alert_clear_data_confirm: 'Clear All Data',
    alert_clear_data_success: 'All financial records and local data have been completely reset.',

    // Subscription Setup Onboarding
    subs_setup_title: 'Do you pay for any subscriptions?',
    subs_setup_desc: 'Tap the ones you recognize, then tell us how much. You can add any other service too.',
    subs_yes_title: 'Yes',
    subs_yes_subtitle: 'Netflix, Spotify, apps, that kind of thing',
    subs_no_title: 'No',
    subs_no_subtitle: 'Nothing like that right now',
    select_subs_hint: 'SELECT YOUR SUBSCRIPTIONS',
    monthly_price_placeholder: 'Monthly price (RM)',
    total_subscriptions: 'Total Monthly Subscriptions',
    per_month: '/month',
    custom_service_name: 'Service Name (e.g. Disney+)',
    custom_add_btn: '+ Add Custom Service',
    continue_btn: 'Continue',
    skip_btn: 'Skip',
  },
  BM: {
    // Navigation Tabs
    tab_home: 'Utama',
    tab_transactions: 'Transaksi',
    tab_goals: 'Matlamat',
    tab_profile: 'Profil',

    // Dashboard / Home Screen
    left_today: 'Baki Hari Ini',
    daily_budget: 'Bajet Harian',
    recent_transactions: 'Transaksi Terkini',
    see_all: 'Lihat Semua',
    talk_to_coach: 'Bercakap dengan Jurulatih',
    safe_to_spend: 'Selamat dibelanjakan',
    total_income: 'Jumlah Pendapatan',
    total_expenses: 'Jumlah Perbelanjaan',
    monthly_balance: 'Baki Bulanan',
    personal_wallet: 'Peribadi',
    student_wallet: 'DOMPET PELAJAR',
    details: 'Butiran',
    income_label: 'PENDAPATAN',
    spending_label: 'PERBELANJAAN',
    quick_bills: 'Komitmen',
    quick_receipts: 'Resit',
    section_expenses: 'Perbelanjaan',
    no_daily_expenses: 'Tiada perbelanjaan harian lagi',
    add_btn: '+ Tambah',
    section_recurring: 'Perbelanjaan Berkala',
    section_income: 'Pendapatan',
    no_income_logged: 'Tiada pendapatan direkodkan lagi',
    metric_left: 'Baki',
    metric_left_desc: 'Pendapatan tolak perbelanjaan',
    metric_spent: 'Dibelanjakan',
    metric_spent_desc: 'Wang yang keluar',
    metric_income: 'Pendapatan',
    metric_income_desc: 'Wang yang masuk',
    metric_bills: 'Komitmen',
    metric_bills_desc: 'Sewa, bil dan langganan',
    metric_everyday: 'Harian',
    metric_everyday_desc: 'Belanja selain komitmen',
    metric_per_day: 'Setiap hari',
    metric_per_day_desc: 'Belanja dibahagi hari berlalu',
    metric_daily_room: 'Ruang harian',
    metric_daily_room_desc: 'Baki dibahagi baki hari hadapan',

    // Transactions Screen
    transactions_title: 'Transaksi',
    search_placeholder: 'Cari transaksi...',
    filter_all: 'Semua',
    filter_income: 'Pendapatan',
    filter_expense: 'Perbelanjaan',
    tab_daily_expenses: 'Harian',
    tab_commitments: 'Komitmen',
    tab_list: 'Senarai',
    tab_calendar: 'Kalendar',
    tab_chill_lock: 'Kunci Chill',
    my_income: 'Pendapatan Saya',
    my_expenses: 'Perbelanjaan Saya',
    today_label: 'Hari Ini',
    no_transactions_today: 'Tiada transaksi untuk hari ini',
    empty_transactions: 'Tiada transaksi dijumpai',

    // Goals / Insights Screen
    goals_title: 'Matlamat',
    savings_progress: 'Kemajuan Simpanan',
    target_amount: 'Jumlah Sasaran',
    add_goal: '+ Tambah Matlamat',
    target_date: 'Tarikh Sasaran',
    current_saved: 'Terkumpul setakat ini',
    money_kept: 'Wang disimpan',
    savings_rate: 'Kadar simpanan',
    on_track: 'Mengikut sasaran',
    travel_fund: 'Tabung Percutian',
    tab_month: 'Bulan',
    tab_year: 'Tahun',
    tab_all: 'All',
    breakdown_by_category: 'Pecahan mengikut kategori',

    // Profile Screen & Sections
    profile_title: 'Profil',
    everyday_section: 'HARIAN',
    advanced_section: 'LANJUTAN',
    account_section: 'AKAUN',
    version_tagline: 'Aplikasi kewangan paling bersih di Malaysia',

    // Profile Everyday Menu
    menu_coach: 'Jurulatih AI',
    menu_loan_calc: 'Kalkulator Pinjaman',
    menu_categories: 'Kategori',
    menu_item_prices: 'Harga Barang',
    menu_who_owes_who: 'Siapa Hutang Siapa',
    menu_trips: 'Trip & Percutian',
    menu_reminders: 'Peringatan',
    menu_chill_lock: 'Kunci Chill',

    // Profile Advanced Menu
    menu_recurring: 'Komitmen Berkala',
    menu_smart_automation: 'Auto Pintar',
    menu_live_activity: 'Aktiviti Live',

    // Profile Account Section
    menu_edit_profile: 'Kemaskini Profil',
    menu_edit_profile_desc: 'Nama, gambar & bahasa',
    menu_clear_data: 'Padam semua data saya',
    menu_clear_data_desc: 'Padam rekod transaksi & data setempat',
    menu_sign_out: 'Log Keluar',
    menu_sign_out_desc: 'Log keluar dari akaun anda',

    // Edit Profile Modal / Screen
    edit_profile_title: 'Kemaskini Profil',
    edit_profile_subtitle: 'Urus identiti & pilihan bahasa',
    choose_avatar: 'GAMBAR PROFIL / AVATAR',
    choose_avatar_hint: 'Pilih ikon atau taip parap sendiri',
    custom_initials: '✍️ Parap Huruf Sendiri (cth: SZ)',
    apply: 'Guna',
    language_selection: 'PILIHAN BAHASA',
    display_name: 'NAMA PAPARAN',
    email_address: 'ALAMAT EMEL',
    daily_budget_target: 'SASARAN BAJET HARIAN (RM)',
    daily_budget_hint: 'Digunakan untuk had 48-Hour Chill dan amaran widget.',
    cancel: 'Batal',
    save_changes: 'Simpan Perubahan',
    profile_updated: 'Profil Dikemaskini',
    profile_updated_desc: 'Maklumat profil dan pilihan bahasa anda telah disimpan.',

    // Who Owes Who Screen
    who_owes_who_title: 'Siapa Hutang Siapa',
    who_owes_who_subtitle: 'Wang anda hutang dan wang orang hutang anda',
    split_bill: 'Kongsi bil',
    others_owe_you: 'ORANG HUTANG ANDA',
    you_owe_others: 'ANDA HUTANG ORANG',
    people_count: '0 orang',
    tab_owed_to_you: 'Orang hutang anda',
    tab_you_owe: 'Anda berhutang',
    tab_settled: 'Selesai',
    empty_title: 'Tiada siapa berhutang dengan anda lagi',
    empty_subtitle: 'Tambah wang yang anda pinjamkan atau bayarkan bagi pihak seseorang.',
    add_money_owed: '+ Tambah wang dihutang kepada anda',

    // Alerts & Dialogs
    alert_sign_out_title: 'Log Keluar',
    alert_sign_out_msg: 'Adakah anda pasti mahu log keluar dari CashCompass?',
    alert_clear_data_title: 'Padam semua data saya?',
    alert_clear_data_msg: 'Adakah anda pasti mahu memadam semua rekod transaksi, pendapatan, komitmen dan tetapan setempat? Tindakan ini tidak boleh diundur.',
    alert_clear_data_confirm: 'Padam Semua Data',
    alert_clear_data_success: 'Semua rekod kewangan dan data setempat telah berjaya dipadamkan.',

    // Subscription Setup Onboarding
    subs_setup_title: 'Adakah anda membayar sebarang langganan?',
    subs_setup_desc: 'Ketik mana yang anda tahu, kemudian beritahu kami berapa banyak. Anda juga boleh menambah perkhidmatan lain.',
    subs_yes_title: 'Ya',
    subs_yes_subtitle: 'Netflix, Spotify, aplikasi, dan sebagainya',
    subs_no_title: 'Tidak',
    subs_no_subtitle: 'Tiada langganan buat masa ini',
    select_subs_hint: 'PILIH LANGGANAN ANDA',
    monthly_price_placeholder: 'Harga bulanan (RM)',
    total_subscriptions: 'Jumlah Langganan Bulanan',
    per_month: '/bulan',
    custom_service_name: 'Nama Perkhidmatan (cth: Disney+)',
    custom_add_btn: '+ Tambah Perkhidmatan Sendiri',
    continue_btn: 'Teruskan',
    skip_btn: 'Langkau',
  },
};

export type TranslationKey = keyof typeof translations.EN;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'EN',
  setLanguage: async () => {},
  t: (key: TranslationKey) => translations.EN[key] || key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('EN');

  // Load language from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved === 'EN' || saved === 'BM') {
          setLanguageState(saved);
        }
      } catch (e) {
        console.warn('Failed to load language from storage', e);
      }
    })();
  }, []);

  const setLanguage = async (newLang: Language) => {
    setLanguageState(newLang);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, newLang);
    } catch (e) {
      console.warn('Failed to save language to storage', e);
    }
  };

  const t = (key: TranslationKey): string => {
    const dict = translations[language] || translations.EN;
    return dict[key] || translations.EN[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
