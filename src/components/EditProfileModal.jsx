import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLanguage } from '../context/LanguageContext';

const PRESET_AVATARS = ['SZ', '🧑‍💻', '🚀', '🦊', '💼', '🎓', '💎', '⚡'];

export default function EditProfileModal({
  visible,
  onClose,
  currentProfile,
  currentLanguage,
  onSave,
}) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      {visible ? (
        <EditProfileModalContent
          onClose={onClose}
          currentProfile={currentProfile}
          currentLanguage={currentLanguage}
          onSave={onSave}
        />
      ) : null}
    </Modal>
  );
}

function EditProfileModalContent({
  onClose,
  currentProfile = {
    name: 'Syed Zariel',
    email: 'syedzariel@gmail.com',
    avatar: 'SZ',
    dailyBudget: '30.00',
  },
  currentLanguage,
  onSave,
}) {
  const { language: globalLanguage, setLanguage: setGlobalLanguage, t } = useLanguage();
  const [name, setName] = useState(currentProfile?.name || 'Syed Zariel');
  const [email, setEmail] = useState(currentProfile?.email || 'syedzariel@gmail.com');
  const [avatar, setAvatar] = useState(currentProfile?.avatar || 'SZ');
  const [dailyBudget, setDailyBudget] = useState(currentProfile?.dailyBudget || '30.00');
  const [language, setLanguageLocal] = useState(currentLanguage || globalLanguage);

  // Custom initials input state
  const [customInitials, setCustomInitials] = useState('');
  const [isEditingCustomInitials, setIsEditingCustomInitials] = useState(false);

  const handleSelectLanguage = (lang) => {
    setLanguageLocal(lang);
    setGlobalLanguage(lang); // dynamically updates entire app interface immediately
  };

  const handleApplyCustomInitials = () => {
    const trimmed = customInitials.trim().toUpperCase().slice(0, 3);
    if (trimmed) {
      setAvatar(trimmed);
      setIsEditingCustomInitials(false);
      setCustomInitials('');
    }
  };

  const handleSave = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      Alert.alert(
        language === 'BM' ? 'Ralat Pengesahan' : 'Validation Error',
        language === 'BM' ? 'Sila masukkan nama paparan anda.' : 'Please enter your display name.'
      );
      return;
    }

    const trimmedBudget = dailyBudget.trim();
    if (trimmedBudget && isNaN(parseFloat(trimmedBudget))) {
      Alert.alert(
        language === 'BM' ? 'Ralat Bajet' : 'Budget Error',
        language === 'BM'
          ? 'Sila masukkan nombor bajet harian yang sah.'
          : 'Please enter a valid daily budget target number.'
      );
      return;
    }

    if (onSave) {
      onSave({
        name: trimmedName,
        email: email.trim() || currentProfile.email,
        avatar: avatar || 'SZ',
        dailyBudget: trimmedBudget || '30.00',
        language,
      });
    }

    if (onClose) {
      onClose();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      style={styles.modalOverlay}
    >
      <View style={styles.sheetContainer}>
        {/* Header Bar */}
        <View style={styles.headerBar}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIconContainer}>
              <Text style={styles.headerEmoji}>✏️</Text>
            </View>
            <View>
              <Text style={styles.headerTitle}>{t('edit_profile_title')}</Text>
              <Text style={styles.headerSubtitle}>{t('edit_profile_subtitle')}</Text>
            </View>
          </View>

          {/* Close / Cancel Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onClose}
            style={styles.closeButton}
            accessibilityLabel="Close"
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Scrollable Form Body */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[styles.scrollContent, { flexGrow: 1 }]}
        >
          {/* 1. Avatar & Profile Picture Card per design.md */}
          <View style={styles.sectionCard}>
            <Text style={styles.fieldLabel}>{t('choose_avatar')}</Text>

            {/* Current Avatar Active Preview */}
            <View style={styles.avatarPreviewRow}>
              <View style={styles.avatarPreviewCircle}>
                <Text style={styles.avatarPreviewText}>{avatar}</Text>
                <View style={styles.activeDot} />
              </View>
              <View style={styles.avatarPreviewInfo}>
                <Text style={styles.avatarCurrentName}>{name || 'Syed Zariel'}</Text>
                <Text style={styles.avatarHint}>{t('choose_avatar_hint')}</Text>
              </View>
            </View>

            {/* Preset Avatar Selection Grid */}
            <View style={styles.avatarOptionsGrid}>
              {PRESET_AVATARS.map((opt) => {
                const isSelected = avatar === opt;
                return (
                  <TouchableOpacity
                    key={opt}
                    activeOpacity={0.7}
                    onPress={() => {
                      setAvatar(opt);
                      setIsEditingCustomInitials(false);
                    }}
                    style={[
                      styles.avatarOptionButton,
                      isSelected && styles.avatarOptionButtonActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.avatarOptionText,
                        isSelected && styles.avatarOptionTextActive,
                      ]}
                    >
                      {opt}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Custom Initials Toggle / Field */}
            {!isEditingCustomInitials ? (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setIsEditingCustomInitials(true)}
                style={styles.customInitialsToggle}
              >
                <Text style={styles.customInitialsToggleText}>
                  {t('custom_initials')}
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.customInitialsInputRow}>
                <TextInput
                  value={customInitials}
                  onChangeText={setCustomInitials}
                  maxLength={3}
                  placeholder="SZ"
                  placeholderTextColor="#999999"
                  autoCapitalize="characters"
                  style={styles.customInitialsInput}
                />
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleApplyCustomInitials}
                  style={styles.customInitialsApplyBtn}
                >
                  <Text style={styles.customInitialsApplyText}>{t('apply')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setIsEditingCustomInitials(false)}
                  style={styles.customInitialsCancelBtn}
                >
                  <Text style={styles.customInitialsCancelText}>✕</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* 2. Language Selection Segmented Control per design.md */}
          <View style={styles.sectionCard}>
            <Text style={styles.fieldLabel}>{t('language_selection')}</Text>
            <View style={styles.languageSegmentedContainer}>
              {/* Option 1: English (EN) */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleSelectLanguage('EN')}
                style={[
                  styles.languageSegmentButton,
                  language === 'EN' && styles.languageSegmentButtonActive,
                ]}
              >
                <Text style={styles.flagEmoji}>🇬🇧</Text>
                <Text
                  style={[
                    styles.languageSegmentText,
                    language === 'EN' && styles.languageSegmentTextActive,
                  ]}
                >
                  English (EN)
                </Text>
              </TouchableOpacity>

              {/* Option 2: Bahasa Melayu (BM) */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleSelectLanguage('BM')}
                style={[
                  styles.languageSegmentButton,
                  language === 'BM' && styles.languageSegmentButtonActive,
                ]}
              >
                <Text style={styles.flagEmoji}>🇲🇾</Text>
                <Text
                  style={[
                    styles.languageSegmentText,
                    language === 'BM' && styles.languageSegmentTextActive,
                  ]}
                >
                  Bahasa Melayu (BM)
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 3. Display Name & Email Inputs per design.md */}
          <View style={styles.sectionCard}>
            <Text style={styles.fieldLabel}>{t('display_name')}</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Syed Zariel"
              placeholderTextColor="#999999"
              style={styles.inputField}
            />

            <Text style={[styles.fieldLabel, { marginTop: 14 }]}>
              {t('email_address')}
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="syedzariel@gmail.com"
              placeholderTextColor="#999999"
              style={styles.inputField}
            />
          </View>

          {/* 4. Daily Budget Target per design.md */}
          <View style={styles.sectionCard}>
            <Text style={styles.fieldLabel}>{t('daily_budget_target')}</Text>
            <View style={styles.budgetInputWrapper}>
              <Text style={styles.budgetCurrencyPrefix}>RM</Text>
              <TextInput
                value={dailyBudget}
                onChangeText={setDailyBudget}
                keyboardType="numeric"
                placeholder="30.00"
                placeholderTextColor="#999999"
                style={styles.budgetInputField}
              />
            </View>
            <Text style={styles.fieldHelper}>{t('daily_budget_hint')}</Text>
          </View>
        </ScrollView>

        {/* Action Buttons: Cancel and Save Changes per design.md */}
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onClose}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelButtonText}>{t('cancel')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleSave}
            style={styles.saveButton}
          >
            <Text style={styles.saveButtonText}>{t('save_changes')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

// ==========================================
// Design Tokens & Styles from design.md
// Flat White Card (#FFFFFF), Subtle Border rgba(0,0,0,0.04),
// Pink Accent #fd5ca3, Bulat Penuh Butang 27px
// ==========================================

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF', // Pure White surface per design.md
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.06)',
    maxHeight: '90%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FFF0F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerEmoji: {
    fontSize: 18,
  },
  headerTitle: {
    fontSize: 18, // per design.md: Semi-Bold Header
    fontWeight: '700',
    color: '#0D0E15', // Teks Utama per design.md: #0D0E15
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666666', // Teks Sekunder per design.md: #666666
    marginTop: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  // Kad Maklumat per design.md: #FFFFFF, borderRadius: 18, borderWidth: 1, rgba(0,0,0,0.04)
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.04)',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#666666', // Teks Sekunder per design.md
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  fieldHelper: {
    fontSize: 11,
    color: '#888888',
    marginTop: 6,
    lineHeight: 15,
  },
  // Avatar preview row
  avatarPreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatarPreviewCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF0F5',
    borderWidth: 1.5,
    borderColor: 'rgba(253, 92, 163, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginRight: 14,
  },
  avatarPreviewText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fd5ca3', // Pink Accent per design.md: #fd5ca3 / #E91E63
  },
  activeDot: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  avatarPreviewInfo: {
    flex: 1,
  },
  avatarCurrentName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0D0E15',
  },
  avatarHint: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  // Preset Avatars Grid
  avatarOptionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  avatarOptionButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarOptionButtonActive: {
    backgroundColor: '#FFF0F5',
    borderColor: '#fd5ca3',
  },
  avatarOptionText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0D0E15',
  },
  avatarOptionTextActive: {
    color: '#fd5ca3',
  },
  customInitialsToggle: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  customInitialsToggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fd5ca3',
  },
  customInitialsInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  customInitialsInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: 'rgba(253, 92, 163, 0.4)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    fontWeight: '700',
    color: '#0D0E15',
    textAlign: 'center',
  },
  customInitialsApplyBtn: {
    backgroundColor: '#fd5ca3',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  customInitialsApplyText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  customInitialsCancelBtn: {
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  customInitialsCancelText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#666666',
  },
  // Language Segmented Control per design.md
  languageSegmentedContainer: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    gap: 6,
  },
  languageSegmentButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 14,
  },
  languageSegmentButtonActive: {
    backgroundColor: '#fd5ca3', // Pink primary accent from design.md!
    shadowColor: '#fd5ca3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  flagEmoji: {
    fontSize: 18,
    marginRight: 6,
  },
  languageSegmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666666',
  },
  languageSegmentTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  // General text input fields per design.md
  inputField: {
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
  // Budget input wrapper with RM prefix
  budgetInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    borderRadius: 14,
    paddingHorizontal: 14,
  },
  budgetCurrencyPrefix: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fd5ca3',
    marginRight: 8,
  },
  budgetInputField: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: '700',
    color: '#0D0E15',
  },
  // Action buttons: Cancel and Save per design.md
  actionButtonsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    borderRadius: 27, // bulat penuh untuk butang 27px per design.md
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666666',
  },
  saveButton: {
    flex: 2,
    backgroundColor: '#fd5ca3', // Pink primary accent per design.md
    borderRadius: 27, // bulat penuh untuk butang 27px per design.md
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#fd5ca3',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
