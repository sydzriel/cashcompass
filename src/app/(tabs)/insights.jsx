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

export default function InsightsScreen() {
  const [timeTab, setTimeTab] = useState('month');
  const [categoryTab, setCategoryTab] = useState('expenses');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header: Talk to Coach Button */}
        <View style={styles.topHeader}>
          <View style={{ flex: 1 }} />
          <TouchableOpacity style={styles.coachButton} activeOpacity={0.8}>
            <Text style={styles.coachButtonText}>✨ Talk to Coach</Text>
          </TouchableOpacity>
        </View>

        {/* Segmented Tab: Month / Year / All */}
        <View style={styles.timeSegmentContainer}>
          <TouchableOpacity
            style={[styles.timeSegmentButton, timeTab === 'month' && styles.activeTimeSegment]}
            onPress={() => setTimeTab('month')}
          >
            <Text style={[styles.timeSegmentText, timeTab === 'month' && styles.activeTimeSegmentText]}>
              Month
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.timeSegmentButton, timeTab === 'year' && styles.activeTimeSegment]}
            onPress={() => setTimeTab('year')}
          >
            <Text style={[styles.timeSegmentText, timeTab === 'year' && styles.activeTimeSegmentText]}>
              Year
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.timeSegmentButton, timeTab === 'all' && styles.activeTimeSegment]}
            onPress={() => setTimeTab('all')}
          >
            <Text style={[styles.timeSegmentText, timeTab === 'all' && styles.activeTimeSegmentText]}>
              All
            </Text>
          </TouchableOpacity>
        </View>

        {/* Date Navigator */}
        <View style={styles.dateNavigator}>
          <Ionicons name="chevron-back" size={18} color="#94A3B8" />
          <Text style={styles.dateNavigatorText}>October 2026</Text>
          <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
        </View>

        {/* Money Kept Card */}
        <View style={styles.card}>
          <Text style={styles.cardSubLabel}>Money kept</Text>
          <Text style={styles.mainAmount}>RM499</Text>
          <View style={styles.savingsRateRow}>
            <Text style={styles.savingsRateLabel}>Savings rate</Text>
            <Text style={styles.savingsRateValue}>62%</Text>
          </View>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: '62%' }]} />
          </View>
        </View>

        {/* Goals Card */}
        <View style={styles.card}>
          <View style={styles.goalsHeaderRow}>
            <Text style={styles.cardTitle}>Goals</Text>
            <View style={styles.onTrackBadge}>
              <Text style={styles.onTrackText}>On track</Text>
            </View>
          </View>
          <View style={styles.goalItemRow}>
            <View style={styles.itemLeft}>
              <Text style={styles.emojiIcon}>✈️</Text>
              <View>
                <Text style={styles.itemTitle}>Travel fund</Text>
                <Text style={styles.itemSubtitle}>RM100 a month</Text>
              </View>
            </View>
            <View style={styles.goalRight}>
              <View style={styles.onTrackBadgeSmall}>
                <Text style={styles.onTrackText}>On track</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#94A3B8" style={{ marginLeft: 8 }} />
            </View>
          </View>
        </View>

        {/* Income vs Expenses Chart Card */}
        <View style={styles.card}>
          <View style={styles.chartHeaderRow}>
            <Text style={styles.cardTitle}>Income vs Expenses</Text>
            <Text style={styles.chartSubText}>Last 6 months</Text>
          </View>

          <View style={styles.incomeExpenseSummary}>
            <View>
              <View style={styles.legendRow}>
                <View style={[styles.dot, { backgroundColor: '#10B981' }]} />
                <Text style={styles.legendLabel}>Income</Text>
              </View>
              <Text style={styles.summaryValue}>RM800</Text>
            </View>
            <View>
              <View style={styles.legendRow}>
                <View style={[styles.dot, { backgroundColor: '#EF4444' }]} />
                <Text style={styles.legendLabel}>Expenses</Text>
              </View>
              <Text style={styles.summaryValue}>RM301</Text>
            </View>
          </View>

          {/* Bar Chart Mockup */}
          <View style={styles.barChartContainer}>
            <View style={styles.chartBaseline} />
            <View style={styles.barsRow}>
              <Text style={styles.barMonth}>May</Text>
              <Text style={styles.barMonth}>Jun</Text>
              <Text style={styles.barMonth}>Jul</Text>
              <Text style={styles.barMonth}>Aug</Text>
              <Text style={styles.barMonth}>Sep</Text>
              <View style={styles.activeBarColumn}>
                <View style={styles.greenBar} />
                <View style={styles.redBar} />
                <Text style={[styles.barMonth, { fontWeight: '700', color: '#0F172A', marginTop: 4 }]}>Oct</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Where it goes Card */}
        <View style={styles.card}>
          <View style={styles.goalsHeaderRow}>
            <Text style={styles.cardTitle}>Where it goes</Text>
            <View style={styles.miniSegmentContainer}>
              <TouchableOpacity
                style={[styles.miniSegmentBtn, categoryTab === 'expenses' && styles.activeMiniSegment]}
                onPress={() => setCategoryTab('expenses')}
              >
                <Text style={[styles.miniSegmentText, categoryTab === 'expenses' && styles.activeMiniSegmentText]}>Expenses</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.miniSegmentBtn, categoryTab === 'income' && styles.activeMiniSegment]}
                onPress={() => setCategoryTab('income')}
              >
                <Text style={[styles.miniSegmentText, categoryTab === 'income' && styles.activeMiniSegmentText]}>Income</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Donut Chart Placeholder */}
          <View style={styles.donutContainer}>
            <View style={styles.donutRing}>
              <View style={styles.donutCenter}>
                <Text style={styles.donutSubText}>Total spent</Text>
                <Text style={styles.donutMainText}>RM301</Text>
                <Text style={styles.donutCatCount}>5 categories</Text>
              </View>
            </View>
          </View>

          {/* Category breakdown items */}
          <View style={styles.catItem}>
            <View style={styles.catInfoRow}>
              <View style={styles.itemLeft}>
                <View style={[styles.dot, { backgroundColor: '#60A5FA' }]} />
                <Text style={styles.catTitle}>Rent & Mortgage</Text>
              </View>
              <View style={styles.catRightRow}>
                <Text style={styles.catPercent}>50%</Text>
                <Text style={styles.catAmount}>RM150</Text>
              </View>
            </View>
            <View style={styles.catBarBg}>
              <View style={[styles.catBarFill, { width: '50%', backgroundColor: '#60A5FA' }]} />
            </View>
          </View>

          <View style={styles.catItem}>
            <View style={styles.catInfoRow}>
              <View style={styles.itemLeft}>
                <View style={[styles.dot, { backgroundColor: '#A855F7' }]} />
                <Text style={styles.catTitle}>Transport</Text>
              </View>
              <View style={styles.catRightRow}>
                <Text style={styles.catPercent}>33%</Text>
                <Text style={styles.catAmount}>RM100</Text>
              </View>
            </View>
            <View style={styles.catBarBg}>
              <View style={[styles.catBarFill, { width: '33%', backgroundColor: '#A855F7' }]} />
            </View>
          </View>

          <View style={styles.catItem}>
            <View style={styles.catInfoRow}>
              <View style={styles.itemLeft}>
                <View style={[styles.dot, { backgroundColor: '#F97316' }]} />
                <Text style={styles.catTitle}>Utilities & Bills</Text>
              </View>
              <View style={styles.catRightRow}>
                <Text style={styles.catPercent}>10%</Text>
                <Text style={styles.catAmount}>RM30</Text>
              </View>
            </View>
            <View style={styles.catBarBg}>
              <View style={[styles.catBarFill, { width: '10%', backgroundColor: '#F97316' }]} />
            </View>
          </View>

          <View style={styles.catItem}>
            <View style={styles.catInfoRow}>
              <View style={styles.itemLeft}>
                <View style={[styles.dot, { backgroundColor: '#2DD4BF' }]} />
                <Text style={styles.catTitle}>Coffee</Text>
              </View>
              <View style={styles.catRightRow}>
                <Text style={styles.catPercent}>4%</Text>
                <Text style={styles.catAmount}>RM12</Text>
              </View>
            </View>
            <View style={styles.catBarBg}>
              <View style={[styles.catBarFill, { width: '4%', backgroundColor: '#2DD4BF' }]} />
            </View>
          </View>

          <View style={styles.catItem}>
            <View style={styles.catInfoRow}>
              <View style={styles.itemLeft}>
                <View style={[styles.dot, { backgroundColor: '#EC4899' }]} />
                <Text style={styles.catTitle}>Subscriptions</Text>
              </View>
              <View style={styles.catRightRow}>
                <Text style={styles.catPercent}>3%</Text>
                <Text style={styles.catAmount}>RM9</Text>
              </View>
            </View>
            <View style={styles.catBarBg}>
              <View style={[styles.catBarFill, { width: '3%', backgroundColor: '#EC4899' }]} />
            </View>
          </View>
        </View>

        {/* Highlights Section */}
        <Text style={styles.sectionHeaderTitle}>Highlights</Text>

        <View style={styles.highlightsGrid}>
          <View style={styles.highlightBox}>
            <Text style={styles.hlBoxLabel}>Spent per day</Text>
            <Text style={styles.hlBoxValue}>RM14.33</Text>
          </View>
          <View style={styles.highlightBox}>
            <Text style={styles.hlBoxLabel}>Per transaction</Text>
            <Text style={styles.hlBoxValue}>RM60.2</Text>
          </View>
          <View style={styles.highlightBox}>
            <Text style={styles.hlBoxLabel}>Top category</Text>
            <Text style={styles.hlBoxTitle}>🏠 Rent & Mortgage</Text>
            <Text style={styles.hlBoxSub}>50% of spending</Text>
          </View>
          <View style={styles.highlightBox}>
            <Text style={styles.hlBoxLabel}>Biggest expense</Text>
            <Text style={styles.hlBoxValue}>RM150</Text>
            <Text style={styles.hlBoxSub}>Rent</Text>
          </View>
          <View style={styles.highlightBox}>
            <Text style={styles.hlBoxLabel}>Expenses logged</Text>
            <Text style={styles.hlBoxValue}>5</Text>
          </View>
          <View style={styles.highlightBox}>
            <Text style={styles.hlBoxLabel}>Month-end pace</Text>
            <Text style={styles.hlBoxValue}>RM444</Text>
            <Text style={styles.hlBoxSub}>At your current rate</Text>
          </View>
        </View>

        {/* Fixed vs Variable Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Fixed vs variable</Text>
          <View style={styles.fixedVariableBarBg}>
            <View style={styles.fixedBarFill} />
            <View style={styles.variableBarFill} />
          </View>
          <View style={styles.fixedVariableLegendRow}>
            <View style={styles.fvLegendItem}>
              <View style={styles.legendRow}>
                <View style={[styles.dot, { backgroundColor: '#EC4899' }]} />
                <Text style={styles.legendLabel}>Fixed 93%</Text>
              </View>
              <Text style={styles.fvAmount}>RM280</Text>
            </View>
            <View style={styles.fvLegendItem}>
              <View style={styles.legendRow}>
                <View style={[styles.dot, { backgroundColor: '#F472B6' }]} />
                <Text style={styles.legendLabel}>Variable 7%</Text>
              </View>
              <Text style={styles.fvAmount}>RM21</Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
    paddingTop: 12,
    paddingBottom: 115,
  },
  topHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  coachButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FCE7F3',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  coachButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#EC4899',
  },
  timeSegmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 25,
    padding: 4,
    marginBottom: 16,
  },
  timeSegmentButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 22,
  },
  activeTimeSegment: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  timeSegmentText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  activeTimeSegmentText: {
    color: '#0F172A',
  },
  dateNavigator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dateNavigatorText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginHorizontal: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardSubLabel: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  mainAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  savingsRateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  savingsRateLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  savingsRateValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  goalsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  onTrackBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  onTrackBadgeSmall: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  onTrackText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16A34A',
  },
  goalItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 16,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emojiIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  itemSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  goalRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chartHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  chartSubText: {
    fontSize: 13,
    color: '#94A3B8',
  },
  incomeExpenseSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  barChartContainer: {
    height: 140,
    justifyContent: 'flex-end',
    position: 'relative',
    marginTop: 10,
  },
  chartBaseline: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  barsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: '100%',
    paddingHorizontal: 8,
  },
  barMonth: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    width: 30,
  },
  activeBarColumn: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: '100%',
    paddingBottom: 20,
  },
  greenBar: {
    width: 14,
    height: 110,
    backgroundColor: '#10B981',
    borderRadius: 6,
    marginRight: 4,
  },
  redBar: {
    width: 14,
    height: 45,
    backgroundColor: '#EF4444',
    borderRadius: 6,
  },
  miniSegmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    padding: 3,
  },
  miniSegmentBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 13,
  },
  activeMiniSegment: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  miniSegmentText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  activeMiniSegmentText: {
    color: '#0F172A',
  },
  donutContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  donutRing: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 20,
    borderColor: '#60A5FA',
    borderTopColor: '#A855F7',
    borderRightColor: '#F97316',
    justifyContent: 'center',
    alignItems: 'center',
  },
  donutCenter: {
    alignItems: 'center',
  },
  donutSubText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  donutMainText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  donutCatCount: {
    fontSize: 11,
    color: '#64748B',
  },
  catItem: {
    marginBottom: 12,
  },
  catInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  catTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  catRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  catPercent: {
    fontSize: 13,
    color: '#94A3B8',
    marginRight: 8,
  },
  catAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  catBarBg: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  catBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  sectionHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
    marginTop: 4,
  },
  highlightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  highlightBox: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  hlBoxLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 6,
  },
  hlBoxValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  hlBoxTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  hlBoxSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  fixedVariableBarBg: {
    height: 12,
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    flexDirection: 'row',
    overflow: 'hidden',
    marginVertical: 12,
  },
  fixedBarFill: {
    width: '93%',
    height: '100%',
    backgroundColor: '#EC4899',
  },
  variableBarFill: {
    width: '7%',
    height: '100%',
    backgroundColor: '#F472B6',
  },
  fixedVariableLegendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fvLegendItem: {
    flex: 1,
  },
  fvAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 2,
  },
});