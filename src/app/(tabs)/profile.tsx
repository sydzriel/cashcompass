import { useRouter } from 'expo-router';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ProfileScreen() {
  const router = useRouter();

  // Fungsi navigasi balik ke skrin Login
  const handleLogout = () => {
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Title */}
        <Text style={styles.headerTitle}>Profile</Text>

        {/* Avatar Section */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarPlaceholder} />
          <Text style={styles.userName}>Syed Zariel</Text>
          <Text style={styles.userEmail}>syedzariel@gmail.com</Text>
        </View>

        {/* CashCompass Management Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>CashCompass Management</Text>

          {/* Monthly Budget Limit Item */}
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <Text style={styles.menuLabel}>Monthly Budget Limit</Text>
            <Text style={styles.menuValue}>RM800.00</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Recurring Commitments Item */}
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <Text style={styles.menuLabel}>Recurring Commitments</Text>
            <View style={styles.pinkBadgeDot} />
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Goals Item */}
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <Text style={styles.menuLabel}>Goals</Text>
            <View style={styles.pinkBadgeDot} />
          </TouchableOpacity>
        </View>

        {/* Log Out Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 115,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 24,
    textAlign: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 28,
  },
  avatarPlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#E2E8F0',
    marginBottom: 16,
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#000000',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#334155',
  },
  card: {
    width: '100%',
    backgroundColor: '#F1F5F9',
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginBottom: 28,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#000000',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0F172A',
  },
  menuValue: {
    fontSize: 16,
    color: '#94A3B8',
  },
  pinkBadgeDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EC4899',
  },
  divider: {
    height: 1,
    backgroundColor: '#CBD5E1',
    opacity: 0.5,
  },
  logoutButton: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 24,
    alignItems: 'center',
    width: '50%',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
});