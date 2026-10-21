import { Ionicons } from '@expo/vector-icons';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header Controls */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.pillButton}>
            <Text style={styles.pillButtonText}>Personal</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.dateFilterButton}>
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
          <Text style={styles.balanceAmount}>RM611</Text>
        </View>

        {/* Expenses Section */}
        <Text style={styles.sectionTitle}>Expenses</Text>

        {/* Card 1: Subscriptions with Progress */}
        <View style={styles.card}>
          <View style={styles.itemRow}>
            <View style={styles.itemLeft}>
              <Text style={styles.emojiIcon}>📱</Text>
              <Text style={styles.itemTitle}>Subscriptions</Text>
            </View>
            <Text style={styles.itemAmount}>RM9</Text>
          </View>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: '25%' }]} />
          </View>
        </View>

        {/* Card 2: Rent & Utilities */}
        <View style={styles.card}>
          <View style={styles.itemRow}>
            <View style={styles.itemLeft}>
              <Text style={styles.emojiIcon}>🏠</Text>
              <Text style={styles.itemTitle}>Rent & Mortgage</Text>
            </View>
            <Text style={styles.itemAmount}>RM150</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.itemRow}>
            <View style={styles.itemLeft}>
              <Text style={styles.emojiIcon}>💡</Text>
              <Text style={styles.itemTitle}>Utilities & Bills</Text>
            </View>
            <Text style={styles.itemAmount}>RM30</Text>
          </View>
        </View>

        {/* Income Section */}
        <Text style={styles.sectionTitle}>Income</Text>

        <View style={styles.card}>
          <View style={styles.itemRow}>
            <View style={styles.itemLeft}>
              <Text style={styles.emojiIcon}>💰</Text>
              <Text style={styles.itemTitle}>Salary</Text>
            </View>
            <Text style={styles.itemAmount}>RM800</Text>
          </View>
        </View>

        {/* Pie Chart Summary Card */}
        <View style={styles.card}>
          <View style={styles.chartContainer}>
            <View style={styles.pieCircle}>
              <View style={styles.pieSliceBlue} />
              <View style={styles.pieSlicePurple} />
              <View style={styles.pieSliceOrange} />
            </View>

            <View style={styles.legendContainer}>
              <Text style={styles.totalText}>Total: RM189</Text>

              <View style={styles.legendRow}>
                <View style={[styles.dot, { backgroundColor: '#60A5FA' }]} />
                <Text style={styles.legendText}>Rent & Mortgage</Text>
              </View>

              <View style={styles.legendRow}>
                <View style={[styles.dot, { backgroundColor: '#A855F7' }]} />
                <Text style={styles.legendText}>Utilities & Bills</Text>
              </View>

              <View style={styles.legendRow}>
                <View style={[styles.dot, { backgroundColor: '#F97316' }]} />
                <Text style={styles.legendText}>Subscriptions</Text>
              </View>
            </View>
          </View>
        </View>

        {/* My Expenses Trend Chart Card */}
        <View style={styles.card}>
          <Text style={styles.chartCardTitle}>My Expenses</Text>

          <View style={styles.lineChartPlaceholder}>
            <View style={styles.tooltip}>
              <Text style={styles.tooltipText}>RM189</Text>
            </View>
            <View style={styles.chartBaseline} />
          </View>

          <View style={styles.monthsRow}>
            <Text style={styles.monthText}>May</Text>
            <Text style={styles.monthText}>Jun</Text>
            <Text style={styles.monthText}>Jul</Text>
            <Text style={styles.monthText}>Aug</Text>
            <Text style={styles.monthText}>Sep</Text>
            <Text style={[styles.monthText, { fontWeight: '700', color: '#0F172A' }]}>
              Oct
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
        <Ionicons name="add" size={32} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 115, // Dilaras supaya kandungan bawah tidak terlindung
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
    borderWidth: 1,
    borderColor: '#E2E8F0',
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
    borderWidth: 1,
    borderColor: '#E2E8F0',
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
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
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
    backgroundColor: '#EC4899',
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
  tooltip: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tooltipText: {
    fontWeight: '700',
    fontSize: 14,
    color: '#0F172A',
  },
  chartBaseline: {
    height: 3,
    backgroundColor: '#EC4899',
    borderRadius: 2,
  },
  monthsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  monthText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  fab: {
    position: 'absolute',
    bottom: 95, // Dinaikkan supaya sama kedudukan seperti di skrin transactions
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EC4899',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    zIndex: 101, // Pastikan sentiasa di atas navigation bar
  },
});