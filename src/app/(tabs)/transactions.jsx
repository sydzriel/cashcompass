import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function TransactionsScreen() {
  const [activeTab, setActiveTab] = useState('list');

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

        {/* List / Calendar Segmented Switcher */}
        <View style={styles.segmentedContainer}>
          <TouchableOpacity
            style={[
              styles.segmentButton,
              activeTab === 'list' && styles.activeSegment,
            ]}
            onPress={() => setActiveTab('list')}
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

        {/* Income & Expenses Summary */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>My Income</Text>
            <Text style={styles.incomeAmount}>RM800.00</Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>My Expenses</Text>
            <Text style={styles.expenseAmount}>-RM301.00</Text>
          </View>
        </View>

        {/* Today Section Header */}
        <Text style={styles.sectionTitle}>Today</Text>

        {/* Transaction Items */}
        <View style={styles.card}>
          <View style={styles.itemLeft}>
            <Text style={styles.emojiIcon}>☕</Text>
            <View>
              <Text style={styles.itemTitle}>Coffee</Text>
              <Text style={styles.itemTime}>8:10 PM</Text>
            </View>
          </View>
          <Text style={styles.negativeAmount}>-RM12.00</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.itemLeft}>
            <Text style={styles.emojiIcon}>💰</Text>
            <View>
              <Text style={styles.itemTitle}>Monthly Allowance</Text>
              <Text style={styles.itemSubtitle}>Salary   8:10 PM</Text>
            </View>
          </View>
          <Text style={styles.positiveAmount}>RM800.00</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.itemLeft}>
            <Text style={styles.emojiIcon}>🏠</Text>
            <View>
              <Text style={styles.itemTitle}>Rent</Text>
              <Text style={styles.itemSubtitle}>Rent & Mortgage   8:10 PM</Text>
            </View>
          </View>
          <Text style={styles.negativeAmount}>-RM150.00</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.itemLeft}>
            <Text style={styles.emojiIcon}>📱</Text>
            <View>
              <Text style={styles.itemTitle}>iCloud+</Text>
              <Text style={styles.itemSubtitle}>Subscriptions   8:10 PM</Text>
            </View>
          </View>
          <Text style={styles.negativeAmount}>-RM9.00</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.itemLeft}>
            <Text style={styles.emojiIcon}>💡</Text>
            <View>
              <Text style={styles.itemTitle}>Mobile Data</Text>
              <Text style={styles.itemSubtitle}>Utilities & Bills   8:10 PM</Text>
            </View>
          </View>
          <Text style={styles.negativeAmount}>-RM30.00</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.itemLeft}>
            <Text style={styles.emojiIcon}>🚗</Text>
            <View>
              <Text style={styles.itemTitle}>Transport</Text>
              <Text style={styles.itemSubtitle}>Transport   8:10 PM</Text>
            </View>
          </View>
          <Text style={styles.negativeAmount}>-RM100.00</Text>
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
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 25,
    padding: 4,
    marginBottom: 20,
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
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  summaryBox: {
    flex: 1,
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
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
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
  itemTime: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
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
  fab: {
    position: 'absolute',
    bottom: 95,
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
    zIndex: 101,
  },
});