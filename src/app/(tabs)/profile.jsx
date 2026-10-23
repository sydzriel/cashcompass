import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AppBackground from '../../components/AppBackground';

export default function ProfileScreen() {
  const router = useRouter();

  const handleLogout = () => {
    router.replace('/login');
  };

  return (
    <AppBackground opacity={1.00} style={styles.gradientContainer}>
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Title */}
          <Text style={styles.headerTitle}>Profile</Text>

          {/* Avatar Section */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>SZ</Text>
            </View>
            <Text style={styles.userName}>Syed Zariel</Text>
            <Text style={styles.userEmail}>syedzariel@gmail.com</Text>
            <View style={styles.studentBadge}>
              <Text style={styles.studentBadgeText}>🎓 University Student Plan</Text>
            </View>
          </View>

          {/* CashCompass Management Section (Flat White Card per design.md) */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>CashCompass Management</Text>

            {/* Monthly Budget Limit Item */}
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <View style={styles.menuLeft}>
                <Ionicons name="wallet-outline" size={20} color="#0D0E15" style={{ marginRight: 12 }} />
                <Text style={styles.menuLabel}>Monthly Budget Limit</Text>
              </View>
              <Text style={styles.menuValue}>RM800.00</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Recurring Commitments Item */}
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <View style={styles.menuLeft}>
                <Ionicons name="repeat-outline" size={20} color="#0D0E15" style={{ marginRight: 12 }} />
                <Text style={styles.menuLabel}>Recurring Commitments</Text>
              </View>
              <View style={styles.badgePill}>
                <Text style={styles.badgePillText}>3 Active</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Goals Item */}
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <View style={styles.menuLeft}>
                <Ionicons name="flag-outline" size={20} color="#0D0E15" style={{ marginRight: 12 }} />
                <Text style={styles.menuLabel}>Financial Goals</Text>
              </View>
              <View style={styles.badgePill}>
                <Text style={styles.badgePillText}>Travel Fund</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* 48h Chill Mode Preferences */}
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <View style={styles.menuLeft}>
                <Ionicons name="timer-outline" size={20} color="#0D0E15" style={{ marginRight: 12 }} />
                <Text style={styles.menuLabel}>48-Hour Chill Mode</Text>
              </View>
              <Text style={styles.menuValue}>Active ⏳</Text>
            </TouchableOpacity>
          </View>

          {/* App Info Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>App Information</Text>
            <View style={styles.menuItem}>
              <Text style={styles.menuLabel}>Version</Text>
              <Text style={styles.menuValue}>1.0.0 (FYP Build)</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.menuItem}>
              <Text style={styles.menuLabel}>Theme</Text>
              <Text style={styles.menuValue}>Hybrid Flat Gradient</Text>
            </View>
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
    width: '100%',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 110,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0D0E15',
    marginBottom: 20,
    textAlign: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#FFF0F5',
    borderWidth: 2,
    borderColor: '#E91E63',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarInitial: {
    fontSize: 32,
    fontWeight: '800',
    color: '#E91E63',
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0D0E15',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  studentBadge: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  studentBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0D0E15',
  },
  // Flat White Card per design.md
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.04)',
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0D0E15',
    marginBottom: 14,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#0D0E15',
  },
  menuValue: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '600',
  },
  badgePill: {
    backgroundColor: '#FFF0F5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgePillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#E91E63',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    marginVertical: 4,
  },
  logoutButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 27, // 27px bulat penuh
    alignItems: 'center',
    width: '60%',
    marginTop: 8,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#EF4444',
  },
});