import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AICoachChatModal from '../../components/AICoachChatModal';
import AppBackground from '../../components/AppBackground';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';

export default function InsightsScreen() {
  const { totalIncome, totalExpenses, leftThisMonth } = useApp();
  const { t } = useLanguage();

  const [timeTab, setTimeTab] = useState('month');
  const [categoryTab, setCategoryTab] = useState('expenses');
  const [isCoachModalOpen, setIsCoachModalOpen] = useState(false);

  // Live Savings Rate Calculation
  const savingsRate =
    totalIncome > 0
      ? Math.max(0, Math.min(100, Math.round(((totalIncome - totalExpenses) / totalIncome) * 100)))
      : 0;

  return (
    <AppBackground opacity={1.00} style={styles.gradientContainer}>
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Header: Prestigious "🤖 Talk to Coach" Button (Faktor Wow IV) */}
          <View style={styles.topHeader}>
            <View>
            </View>

            <TouchableOpacity
              style={styles.coachButton}
              activeOpacity={0.8}
              onPress={() => setIsCoachModalOpen(true)}
            >
              <LinearGradient
                colors={['#FFF0F5', '#FFFFFF']}
                style={styles.coachGradient}
              >
                <Text style={styles.coachButtonText}>{t('talk_to_coach')}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Segmented Tab: Month / Year / All */}
          <View style={styles.timeSegmentContainer}>
            <TouchableOpacity
              style={[
                styles.timeSegmentButton,
                timeTab === 'month' && styles.activeTimeSegment,
              ]}
              onPress={() => setTimeTab('month')}
            >
              <Text
                style={[
                  styles.timeSegmentText,
                  timeTab === 'month' && styles.activeTimeSegmentText,
                ]}
              >
                {t('tab_month')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.timeSegmentButton,
                timeTab === 'year' && styles.activeTimeSegment,
              ]}
              onPress={() => setTimeTab('year')}
            >
              <Text
                style={[
                  styles.timeSegmentText,
                  timeTab === 'year' && styles.activeTimeSegmentText,
                ]}
              >
                {t('tab_year')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.timeSegmentButton,
                timeTab === 'all' && styles.activeTimeSegment,
              ]}
              onPress={() => setTimeTab('all')}
            >
              <Text
                style={[
                  styles.timeSegmentText,
                  timeTab === 'all' && styles.activeTimeSegmentText,
                ]}
              >
                {t('tab_all')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Date Navigator */}
          <View style={styles.dateNavigator}>
            <Ionicons name="chevron-back" size={18} color="#666666" />
            <Text style={styles.dateNavigatorText}>October 2026</Text>
            <Ionicons name="chevron-forward" size={18} color="#666666" />
          </View>

          {/* Money Kept Card (Flat White per design.md) */}
          <View style={styles.card}>
            <Text style={styles.cardSubLabel}>{t('money_kept')}</Text>
            <Text style={styles.mainAmount}>RM{leftThisMonth}</Text>
            <View style={styles.savingsRateRow}>
              <Text style={styles.savingsRateLabel}>{t('savings_rate')}</Text>
              <Text style={styles.savingsRateValue}>{savingsRate}%</Text>
            </View>
            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${savingsRate}%` },
                ]}
              />
            </View>
          </View>

          {/* Goals Card */}
          <View style={styles.card}>
            <View style={styles.goalsHeaderRow}>
              <Text style={styles.cardTitle}>{t('goals_title')}</Text>
              <View style={styles.onTrackBadge}>
                <Text style={styles.onTrackText}>{t('on_track')}</Text>
              </View>
            </View>
            <View style={styles.goalItemRow}>
              <View style={styles.itemLeft}>
                <Text style={styles.emojiIcon}>✈️</Text>
                <View>
                  <Text style={styles.itemTitle}>{t('travel_fund')}</Text>
                  <Text style={styles.itemSubtitle}>RM100 a month</Text>
                </View>
              </View>
              <View style={styles.goalRight}>
                <View style={styles.onTrackBadgeSmall}>
                  <Text style={styles.onTrackText}>On track</Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color="#94A3B8"
                  style={{ marginLeft: 8 }}
                />
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
                <Text style={styles.summaryValue}>RM{totalIncome}</Text>
              </View>
              <View>
                <View style={styles.legendRow}>
                  <View style={[styles.dot, { backgroundColor: '#EF4444' }]} />
                  <Text style={styles.legendLabel}>Expenses</Text>
                </View>
                <Text style={styles.summaryValue}>RM{totalExpenses}</Text>
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
                  <View
                    style={[
                      styles.redBar,
                      {
                        height: Math.max(
                          20,
                          Math.min(90, Math.round((totalExpenses / 800) * 90))
                        ),
                      },
                    ]}
                  />
                  <Text
                    style={[
                      styles.barMonth,
                      { fontWeight: '700', color: '#0D0E15', marginTop: 4 },
                    ]}
                  >
                    Oct
                  </Text>
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
                  style={[
                    styles.miniSegmentBtn,
                    categoryTab === 'expenses' && styles.activeMiniSegment,
                  ]}
                  onPress={() => setCategoryTab('expenses')}
                >
                  <Text
                    style={[
                      styles.miniSegmentText,
                      categoryTab === 'expenses' && styles.activeMiniSegmentText,
                    ]}
                  >
                    Expenses
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.miniSegmentBtn,
                    categoryTab === 'income' && styles.activeMiniSegment,
                  ]}
                  onPress={() => setCategoryTab('income')}
                >
                  <Text
                    style={[
                      styles.miniSegmentText,
                      categoryTab === 'income' && styles.activeMiniSegmentText,
                    ]}
                  >
                    Income
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Donut Chart Indicator */}
            <View style={styles.donutContainer}>
              <View style={styles.donutRing}>
                <View style={styles.donutCenter}>
                  <Text style={styles.donutSubText}>Total spent</Text>
                  <Text style={styles.donutMainText}>RM{totalExpenses}</Text>
                  <Text style={styles.donutCatCount}>Commitments & Daily</Text>
                </View>
              </View>
            </View>

            {/* Category breakdown items */}
            <View style={styles.catItem}>
              <View style={styles.catInfoRow}>
                <View style={styles.itemLeft}>
                  <View style={[styles.dot, { backgroundColor: '#60A5FA' }]} />
                  <Text style={styles.catTitle}>Rent & Housing</Text>
                </View>
                <View style={styles.catRightRow}>
                  <Text style={styles.catPercent}>50%</Text>
                  <Text style={styles.catAmount}>RM150</Text>
                </View>
              </View>
              <View style={styles.catBarBg}>
                <View
                  style={[
                    styles.catBarFill,
                    { width: '50%', backgroundColor: '#60A5FA' },
                  ]}
                />
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
                <View
                  style={[
                    styles.catBarFill,
                    { width: '33%', backgroundColor: '#A855F7' },
                  ]}
                />
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
                <View
                  style={[
                    styles.catBarFill,
                    { width: '10%', backgroundColor: '#F97316' },
                  ]}
                />
              </View>
            </View>

            <View style={styles.catItem}>
              <View style={styles.catInfoRow}>
                <View style={styles.itemLeft}>
                  <View style={[styles.dot, { backgroundColor: '#fd5ca3' }]} />
                  <Text style={styles.catTitle}>Coffee & Food</Text>
                </View>
                <View style={styles.catRightRow}>
                  <Text style={styles.catPercent}>4%</Text>
                  <Text style={styles.catAmount}>RM12</Text>
                </View>
              </View>
              <View style={styles.catBarBg}>
                <View
                  style={[
                    styles.catBarFill,
                    { width: '4%', backgroundColor: '#fd5ca3' },
                  ]}
                />
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
                <View
                  style={[
                    styles.catBarFill,
                    { width: '3%', backgroundColor: '#EC4899' },
                  ]}
                />
              </View>
            </View>
          </View>

          {/* Highlights Section */}
          <Text style={styles.sectionHeaderTitle}>Highlights</Text>

          <View style={styles.highlightsGrid}>
            <View style={styles.highlightBox}>
              <Text style={styles.hlBoxLabel}>Spent per day</Text>
              <Text style={styles.hlBoxValue}>
                RM{(totalExpenses / 21).toFixed(2)}
              </Text>
            </View>
            <View style={styles.highlightBox}>
              <Text style={styles.hlBoxLabel}>Savings rate</Text>
              <Text style={[styles.hlBoxValue, { color: '#10B981' }]}>
                {savingsRate}%
              </Text>
            </View>
            <View style={styles.highlightBox}>
              <Text style={styles.hlBoxLabel}>Top category</Text>
              <Text style={styles.hlBoxTitle}>🏠 Rent</Text>
              <Text style={styles.hlBoxSub}>Commitment item</Text>
            </View>
            <View style={styles.highlightBox}>
              <Text style={styles.hlBoxLabel}>Biggest expense</Text>
              <Text style={styles.hlBoxValue}>RM150</Text>
              <Text style={styles.hlBoxSub}>Room Rent</Text>
            </View>
            <View style={styles.highlightBox}>
              <Text style={styles.hlBoxLabel}>48h Chill Rules Resisted</Text>
              <Text style={[styles.hlBoxValue, { color: '#fd5ca3' }]}>
                2 Saved
              </Text>
            </View>
            <View style={styles.highlightBox}>
              <Text style={styles.hlBoxLabel}>Month-end pace</Text>
              <Text style={styles.hlBoxValue}>RM440</Text>
              <Text style={styles.hlBoxSub}>Within safe zone</Text>
            </View>
          </View>

          {/* Fixed vs Variable Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Fixed vs Variable</Text>
            <View style={styles.fixedVariableBarBg}>
              <View style={styles.fixedBarFill} />
              <View style={styles.variableBarFill} />
            </View>
            <View style={styles.fixedVariableLegendRow}>
              <View style={styles.fvLegendItem}>
                <View style={styles.legendRow}>
                  <View style={[styles.dot, { backgroundColor: '#fd5ca3' }]} />
                  <Text style={styles.legendLabel}>Fixed Commitments 63%</Text>
                </View>
                <Text style={styles.fvAmount}>RM189</Text>
              </View>
              <View style={styles.fvLegendItem}>
                <View style={styles.legendRow}>
                  <View style={[styles.dot, { backgroundColor: '#efa5cb' }]} />
                  <Text style={styles.legendLabel}>Variable 37%</Text>
                </View>
                <Text style={styles.fvAmount}>RM112</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* AI Financial Coach Live Chat Modal (Faktor Wow IV) */}
        <AICoachChatModal
          visible={isCoachModalOpen}
          onClose={() => setIsCoachModalOpen(false)}
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          leftThisMonth={leftThisMonth}
        />
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
    paddingTop: 14,
    paddingBottom: 110, // 110px paddingBottom per design.md
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0D0E15',
  },
  screenSubtitle: {
    fontSize: 12,
    color: '#666666',
    marginTop: 1,
  },
  // Prestigious Pill Button for AI Coach
  coachButton: {
    borderRadius: 27, // Bulat penuh 27px
    overflow: 'hidden',
    borderWidth: 0,
    borderColor: '#fd5ca3',
    shadowColor: '#fd5ca3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  coachGradient: {
    paddingVertical: 9,
    paddingHorizontal: 16,
  },
  coachButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#fd5ca3',
  },
  timeSegmentContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 25,
    padding: 3,
    marginBottom: 14,
    borderWidth: 0,
    borderColor: 'rgba(0, 0, 0, 0.04)',
  },
  timeSegmentButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 22,
  },
  activeTimeSegment: {
    backgroundColor: '#FFFFFF',
    borderWidth: 0,
    borderColor: 'rgba(0, 0, 0, 0.04)',
  },
  timeSegmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666666',
  },
  activeTimeSegmentText: {
    color: '#0D0E15',
    fontWeight: '700',
  },
  dateNavigator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderRadius: 27,
    marginBottom: 16,
    borderWidth: 0,
    borderColor: 'rgba(0, 0, 0, 0.04)',
  },
  dateNavigatorText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0D0E15',
    marginHorizontal: 16,
  },
  // Flat White Card per design.md (no heavy shadow, borderWidth 1, borderColor rgba(0,0,0,0.04), borderRadius 18)
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 0,
    borderColor: 'rgba(0, 0, 0, 0.04)',
  },
  cardSubLabel: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 4,
  },
  mainAmount: {
    fontSize: 34,
    fontWeight: '800',
    color: '#0D0E15',
    marginBottom: 12,
  },
  savingsRateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  savingsRateLabel: {
    fontSize: 13,
    color: '#666666',
  },
  savingsRateValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0D0E15',
  },
  progressBarBackground: {
    height: 7,
    backgroundColor: '#F1F5F9',
    borderRadius: 3.5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 3.5,
  },
  goalsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0D0E15',
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
    borderRadius: 14,
    borderWidth: 0,
    borderColor: 'rgba(0, 0, 0, 0.04)',
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
    color: '#0D0E15',
  },
  itemSubtitle: {
    fontSize: 12,
    color: '#666666',
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
    fontSize: 12,
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
    color: '#666666',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0D0E15',
  },
  barChartContainer: {
    height: 130,
    justifyContent: 'flex-end',
    position: 'relative',
    marginTop: 8,
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
    height: 95,
    backgroundColor: '#10B981',
    borderRadius: 6,
    marginRight: 4,
  },
  redBar: {
    width: 14,
    backgroundColor: '#EF4444',
    borderRadius: 6,
  },
  miniSegmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    padding: 2,
  },
  miniSegmentBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 14,
  },
  activeMiniSegment: {
    backgroundColor: '#FFFFFF',
    borderWidth: 0,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  miniSegmentText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
  },
  activeMiniSegmentText: {
    color: '#0D0E15',
  },
  donutContainer: {
    alignItems: 'center',
    marginVertical: 14,
  },
  donutRing: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 18,
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
    fontSize: 11,
    color: '#94A3B8',
  },
  donutMainText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0D0E15',
  },
  donutCatCount: {
    fontSize: 10,
    color: '#666666',
  },
  catItem: {
    marginBottom: 10,
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
    color: '#0D0E15',
  },
  catRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  catPercent: {
    fontSize: 12,
    color: '#94A3B8',
    marginRight: 8,
  },
  catAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0D0E15',
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
    color: '#0D0E15',
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
    width: '48.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 0,
    borderColor: 'rgba(0, 0, 0, 0.04)',
  },
  hlBoxLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 6,
  },
  hlBoxValue: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0D0E15',
  },
  hlBoxTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0D0E15',
    marginBottom: 2,
  },
  hlBoxSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  fixedVariableBarBg: {
    height: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 5,
    flexDirection: 'row',
    overflow: 'hidden',
    marginVertical: 12,
  },
  fixedBarFill: {
    width: '63%',
    height: '100%',
    backgroundColor: '#fd5ca3',
  },
  variableBarFill: {
    width: '37%',
    height: '100%',
    backgroundColor: '#efa5cb',
  },
  fixedVariableLegendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fvLegendItem: {
    flex: 1,
  },
  fvAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0D0E15',
    marginTop: 2,
  },
});