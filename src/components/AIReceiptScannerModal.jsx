import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const sampleReceipts = [
  {
    id: 'rc-1',
    merchant: 'Starbucks Coffee',
    branch: 'Mid Valley Megamall',
    date: '23 Oct 2026',
    time: '2:15 PM',
    items: [
      { name: 'Iced Caramel Macchiato (Grande)', price: 18.50 },
    ],
    total: 18.50,
    category: 'Coffee',
    emoji: '☕',
    confidence: '99.4%',
  },
  {
    id: 'rc-2',
    merchant: 'Watsons Pharmacy',
    branch: 'KL Gateway Mall',
    date: '22 Oct 2026',
    time: '6:30 PM',
    items: [
      { name: 'Panadol ActiFast 20s', price: 16.50 },
      { name: 'Facial Cleanser Foam', price: 17.70 },
    ],
    total: 34.20,
    category: 'Healthcare',
    emoji: '💊',
    confidence: '98.8%',
  },
  {
    id: 'rc-3',
    merchant: 'FamilyMart',
    branch: 'Universiti LRT Station',
    date: '23 Oct 2026',
    time: '12:45 PM',
    items: [
      { name: 'Tom Yum Oden Bowl', price: 8.90 },
      { name: 'Matcha Sofuto Cone', price: 3.90 },
    ],
    total: 12.80,
    category: 'Food & Dining',
    emoji: '🍔',
    confidence: '99.1%',
  },
  {
    id: 'rc-4',
    merchant: 'MR D.I.Y.',
    branch: 'Bangsar South',
    date: '20 Oct 2026',
    time: '4:10 PM',
    items: [
      { name: 'Notebook Spiral A5 (2x)', price: 9.80 },
      { name: 'Highlighter Set 4-Color', price: 6.20 },
      { name: 'Type-C Fast Charge Cable', price: 8.00 },
    ],
    total: 24.00,
    category: 'Shopping',
    emoji: '🛍️',
    confidence: '97.9%',
  },
];

export default function AIReceiptScannerModal({ visible, onClose, onSaveReceipt }) {
  const [selectedReceipt, setSelectedReceipt] = useState(sampleReceipts[0]);
  const [scanState, setScanState] = useState('viewfinder'); // 'viewfinder' | 'scanning' | 'result'
  const [flashOn, setFlashOn] = useState(false);

  // Laser scanning animation
  const [laserAnim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (visible && scanState === 'viewfinder') {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(laserAnim, {
            toValue: 1,
            duration: 1800,
            useNativeDriver: Platform.OS !== 'web',
          }),
          Animated.timing(laserAnim, {
            toValue: 0,
            duration: 1800,
            useNativeDriver: Platform.OS !== 'web',
          }),
        ])
      );
      loop.start();
      return () => loop.stop();
    }
  }, [visible, scanState, laserAnim]);

  const handleCapture = (receipt = selectedReceipt) => {
    setSelectedReceipt(receipt);
    setScanState('scanning');

    setTimeout(() => {
      setScanState('result');
    }, 1400);
  };

  const handleConfirmAdd = () => {
    onSaveReceipt({
      title: selectedReceipt.merchant,
      amount: selectedReceipt.total,
      emoji: selectedReceipt.emoji,
      category: selectedReceipt.category,
      date: '15/10/26',
      day: 15,
      time: selectedReceipt.time,
    });
    setScanState('viewfinder');
    onClose();
  };

  const handleRetake = () => {
    setScanState('viewfinder');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <LinearGradient
        colors={['#FFFFFF', '#FFF0F5', '#FCE7F3']}
        locations={[0, 0.45, 1]}
        style={styles.modalGradient}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Top Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.circleButton}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Ionicons name="close" size={22} color="#0D0E15" />
            </TouchableOpacity>

            <View style={styles.headerTitleBox}>
              <Text style={styles.headerTitle}>Receipt Scanner</Text>
              <Text style={styles.headerSubtitle}>Camera OCR with Auto-Fill</Text>
            </View>

            <TouchableOpacity
              style={[styles.circleButton, flashOn && styles.circleButtonActive]}
              onPress={() => setFlashOn((prev) => !prev)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={flashOn ? 'flash' : 'flash-outline'}
                size={20}
                color={flashOn ? '#fd5ca3' : '#0d0e15'}
              />
            </TouchableOpacity>
          </View>

          {scanState === 'viewfinder' && (
            <View style={styles.viewfinderContainer}>
              {/* Camera Viewfinder Frame */}
              <View style={styles.viewfinderFrame}>
                {/* Corner Targets */}
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />

                {/* Animated Laser Line */}
                <Animated.View
                  style={[
                    styles.laserLine,
                    {
                      transform: [
                        {
                          translateY: laserAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [10, 270],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <LinearGradient
                    colors={['rgba(253, 92, 163, 0)', '#fd5ca3', 'rgba(253, 92, 163, 0)']}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.laserGradient}
                  />
                </Animated.View>

                {/* Viewfinder Center Content */}
                <View style={styles.viewfinderCenter}>
                  <View style={styles.hudBadge}>
                    <Text style={styles.hudBadgeText}>ALIGN RECEIPT WITHIN FRAME</Text>
                  </View>

                  {/* Simulated receipt paper silhouette */}
                  <View style={styles.receiptSilhouette}>
                    <Text style={styles.silhouetteText}>{selectedReceipt.merchant}</Text>
                    <Text style={styles.silhouetteSub}>Total: RM{selectedReceipt.total.toFixed(2)}</Text>
                    <View style={styles.barcodeLines}>
                      <View style={styles.barcodeLine} />
                      <View style={[styles.barcodeLine, { width: 40 }]} />
                      <View style={[styles.barcodeLine, { width: 70 }]} />
                    </View>
                  </View>
                </View>
              </View>

              {/* Instruction Banner */}
              <View style={styles.instructionCard}>
                <Ionicons name="sparkles" size={18} color="#fd5ca3" style={{ marginRight: 8 }} />
                <Text style={styles.instructionText}>
                  Select a sample receipt below or tap capture to auto-detect merchant & amount.
                </Text>
              </View>

              {/* Sample Receipts Selector */}
              <Text style={styles.selectorLabel}>DEMO SAMPLE RECEIPTS:</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.sampleChipsRow}
              >
                {sampleReceipts.map((rc) => {
                  const isSelected = selectedReceipt.id === rc.id;
                  return (
                    <TouchableOpacity
                      key={rc.id}
                      style={[
                        styles.sampleChip,
                        isSelected && styles.sampleChipActive,
                      ]}
                      onPress={() => setSelectedReceipt(rc)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.sampleChipEmoji}>{rc.emoji}</Text>
                      <View>
                        <Text
                          style={[
                            styles.sampleChipTitle,
                            isSelected && styles.sampleChipTitleActive,
                          ]}
                        >
                          {rc.merchant}
                        </Text>
                        <Text style={styles.sampleChipPrice}>RM{rc.total.toFixed(2)}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* Shutter Button */}
              <View style={styles.bottomBar}>
                <TouchableOpacity
                  style={styles.shutterOuter}
                  onPress={() => handleCapture()}
                  activeOpacity={0.85}
                >
                  <View style={styles.shutterInner}>
                    <Ionicons name="camera" size={28} color="#FFFFFF" />
                  </View>
                </TouchableOpacity>
                <Text style={styles.shutterHint}>Tap to Scan & Auto-Fill</Text>
              </View>
            </View>
          )}

          {scanState === 'scanning' && (
            <View style={styles.scanningContainer}>
              <View style={styles.scanAnimationCard}>
                <ActivityIndicator size="large" color="#fd5ca3" style={{ marginBottom: 16 }} />
                <Text style={styles.scanStatusTitle}>AI Vision OCR Scanning...</Text>
                <Text style={styles.scanStatusDesc}>
                  Reading receipt from {selectedReceipt.merchant}
                </Text>
                <View style={styles.scanningPills}>
                  <View style={styles.scanPillItem}>
                    <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                    <Text style={styles.scanPillText}>Detecting Merchant</Text>
                  </View>
                  <View style={styles.scanPillItem}>
                    <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                    <Text style={styles.scanPillText}>Extracting Line Items</Text>
                  </View>
                  <View style={styles.scanPillItem}>
                    <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                    <Text style={styles.scanPillText}>Predicting Category</Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {scanState === 'result' && (
            <ScrollView
              contentContainerStyle={styles.resultScroll}
              showsVerticalScrollIndicator={false}
            >
              {/* Success Pill */}
              <View style={styles.successPill}>
                <Ionicons name="checkmark-circle" size={18} color="#10B981" style={{ marginRight: 6 }} />
                <Text style={styles.successPillText}>
                  Receipt Extracted with {selectedReceipt.confidence} Accuracy
                </Text>
              </View>

              {/* Extracted Receipt Card (Flat White per design.md) */}
              <View style={styles.receiptCard}>
                <View style={styles.receiptTop}>
                  <Text style={styles.receiptEmoji}>{selectedReceipt.emoji}</Text>
                  <Text style={styles.receiptMerchant}>{selectedReceipt.merchant}</Text>
                  <Text style={styles.receiptBranch}>{selectedReceipt.branch}</Text>
                  <Text style={styles.receiptMeta}>
                    {selectedReceipt.date} • {selectedReceipt.time}
                  </Text>
                </View>

                <View style={styles.dashedDivider} />

                <View style={styles.itemsSection}>
                  <Text style={styles.itemsHeader}>ITEMIZED BREAKDOWN</Text>
                  {selectedReceipt.items.map((item, idx) => (
                    <View key={idx} style={styles.itemRow}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemPrice}>RM{item.price.toFixed(2)}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.dashedDivider} />

                {/* Total Row */}
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>TOTAL AMOUNT</Text>
                  <Text style={styles.totalAmount}>RM{selectedReceipt.total.toFixed(2)}</Text>
                </View>

                {/* AI Auto-Categorized Badge */}
                <View style={styles.categoryBadgeRow}>
                  <Text style={styles.categoryBadgeLabel}>AI Auto-Categorized:</Text>
                  <View style={styles.categoryPill}>
                    <Text style={styles.categoryPillText}>
                      {selectedReceipt.emoji} {selectedReceipt.category}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.resultActionsRow}>
                <TouchableOpacity
                  style={styles.retakeBtn}
                  onPress={handleRetake}
                  activeOpacity={0.8}
                >
                  <Text style={styles.retakeBtnText}>Retake / Choose Another</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.confirmBtn}
                  onPress={handleConfirmAdd}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#fd5ca3', '#fd5ca3']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.confirmGradient}
                  >
                    <Text style={styles.confirmBtnText}>Confirm & Auto-Fill ✨</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </SafeAreaView>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalGradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 16 : 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(253, 92, 163, 0.08)',
  },
  circleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    borderColor: 'rgba(253, 92, 163, 0.15)',
    shadowColor: '#fd5ca3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  circleButtonActive: {
    backgroundColor: '#FFF0F5',
    borderWidth: 0,
    borderColor: '#fd5ca3',
  },
  headerTitleBox: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0D0E15',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#fd5ca3',
    fontWeight: '600',
    marginTop: 2,
  },
  viewfinderContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  viewfinderFrame: {
    height: 310,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 22,
    marginTop: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(253, 92, 163, 0.25)',
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#fd5ca3',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 4,
  },
  corner: {
    position: 'absolute',
    width: 26,
    height: 26,
    borderColor: '#fd5ca3',
  },
  topLeft: {
    top: 14,
    left: 14,
    borderTopWidth: 3.5,
    borderLeftWidth: 3.5,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: 14,
    right: 14,
    borderTopWidth: 3.5,
    borderRightWidth: 3.5,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: 14,
    left: 14,
    borderBottomWidth: 3.5,
    borderLeftWidth: 3.5,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: 14,
    right: 14,
    borderBottomWidth: 3.5,
    borderRightWidth: 3.5,
    borderBottomRightRadius: 8,
  },
  laserLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    zIndex: 10,
  },
  laserGradient: {
    width: '100%',
    height: '100%',
  },
  viewfinderCenter: {
    alignItems: 'center',
  },
  hudBadge: {
    backgroundColor: '#FFF0F5',
    borderWidth: 0,
    borderColor: 'rgba(253, 92, 163, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    marginBottom: 16,
  },
  hudBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fd5ca3',
    letterSpacing: 0.5,
  },
  receiptSilhouette: {
    width: 200,
    padding: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 0,
    borderColor: 'rgba(253, 92, 163, 0.2)',
    shadowColor: '#fd5ca3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  silhouetteText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0D0E15',
    marginBottom: 4,
  },
  silhouetteSub: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fd5ca3',
    marginBottom: 10,
  },
  barcodeLines: {
    alignItems: 'center',
    gap: 3,
  },
  barcodeLine: {
    height: 2,
    width: 60,
    backgroundColor: 'rgba(253, 92, 163, 0.35)',
    borderRadius: 1,
  },
  instructionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F5',
    borderWidth: 0,
    borderColor: 'rgba(253, 92, 163, 0.2)',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 10,
  },
  instructionText: {
    flex: 1,
    fontSize: 12,
    color: '#0D0E15',
    lineHeight: 17,
    fontWeight: '500',
  },
  selectorLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#fd5ca3',
    letterSpacing: 0.5,
    marginTop: 12,
    marginBottom: 8,
  },
  sampleChipsRow: {
    paddingVertical: 4,
  },
  sampleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 0,
    borderColor: 'rgba(253, 92, 163, 0.15)',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 10,
    shadowColor: '#fd5ca3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sampleChipActive: {
    backgroundColor: '#FFF0F5',
    borderColor: '#fd5ca3',
    borderWidth: 1.5,
  },
  sampleChipEmoji: {
    fontSize: 20,
    marginRight: 10,
  },
  sampleChipTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0D0E15',
  },
  sampleChipTitleActive: {
    color: '#fd5ca3',
  },
  sampleChipPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fd5ca3',
  },
  bottomBar: {
    alignItems: 'center',
    paddingTop: 10,
  },
  shutterOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: '#fd5ca3',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginBottom: 6,
    shadowColor: '#fd5ca3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  shutterInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fd5ca3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterHint: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
  },
  scanningContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  scanAnimationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    borderWidth: 1.5,
    borderColor: 'rgba(253, 92, 163, 0.2)',
    shadowColor: '#fd5ca3',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
  },
  scanStatusTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0D0E15',
    marginBottom: 6,
  },
  scanStatusDesc: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
  },
  scanningPills: {
    width: '100%',
    gap: 10,
  },
  scanPillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F5',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    gap: 8,
    borderWidth: 0,
    borderColor: 'rgba(253, 92, 163, 0.15)',
  },
  scanPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0D0E15',
  },
  resultScroll: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  successPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF0F5',
    borderWidth: 0,
    borderColor: 'rgba(253, 92, 163, 0.25)',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginBottom: 16,
  },
  successPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fd5ca3',
  },
  receiptCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 0,
    borderColor: 'rgba(253, 92, 163, 0.15)',
    padding: 20,
    marginBottom: 20,
    shadowColor: '#fd5ca3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  receiptTop: {
    alignItems: 'center',
    marginBottom: 16,
  },
  receiptEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  receiptMerchant: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0D0E15',
    marginBottom: 4,
  },
  receiptBranch: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 4,
  },
  receiptMeta: {
    fontSize: 12,
    color: '#94A3B8',
  },
  dashedDivider: {
    height: 1,
    borderWidth: 0,
    borderColor: '#FCE7F3',
    borderStyle: 'dashed',
    marginVertical: 14,
  },
  itemsSection: {
    marginBottom: 6,
  },
  itemsHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#fd5ca3',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0D0E15',
    flex: 1,
    marginRight: 10,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0D0E15',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0D0E15',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fd5ca3',
  },
  categoryBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF0F5',
    padding: 12,
    borderRadius: 14,
    borderWidth: 0,
    borderColor: 'rgba(253, 92, 163, 0.12)',
  },
  categoryBadgeLabel: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  categoryPill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 0,
    borderColor: 'rgba(253, 92, 163, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fd5ca3',
  },
  resultActionsRow: {
    gap: 12,
  },
  confirmBtn: {
    height: 54,
    borderRadius: 27,
    overflow: 'hidden',
  },
  confirmGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  retakeBtn: {
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#fd5ca3',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  retakeBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fd5ca3',
  },
});
