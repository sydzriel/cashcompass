import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { Animated, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AutoSpendingBanner({ banner, onDismiss }) {
  const [slideAnim] = useState(() => new Animated.Value(-120));

  const handleDismiss = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: -120,
      duration: 250,
      useNativeDriver: Platform.OS !== 'web',
    }).start(() => {
      onDismiss();
    });
  }, [slideAnim, onDismiss]);

  useEffect(() => {
    if (banner) {
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 80,
        friction: 9,
        useNativeDriver: Platform.OS !== 'web',
      }).start();

      const timer = setTimeout(() => {
        handleDismiss();
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [banner, slideAnim, handleDismiss]);

  if (!banner) return null;

  return (
    <Animated.View
      style={[
        styles.bannerContainer,
        {
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.bannerCard}>
        <View style={styles.iconContainer}>
          <Text style={styles.boltIcon}>⚡</Text>
        </View>

        <View style={styles.textContainer}>
          <View style={styles.sourceRow}>
            <View style={styles.bankBadge}>
              <Text style={styles.bankBadgeText}>{banner.bankSource || banner.bankName || 'Bank Push'}</Text>
            </View>
            <Text style={styles.timeText}>Just now • Auto-Detected</Text>
          </View>

          <Text style={styles.titleText} numberOfLines={1}>
            RM{parseFloat(banner.amount).toFixed(2)} ({banner.title})
          </Text>
          <Text style={styles.descText}>
            Automatically added to your expenses.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.closeBtn}
          onPress={handleDismiss}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={18} color="#64748B" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 16,
    right: 16,
    zIndex: 9999,
  },
  bannerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(253, 92, 163, 0.25)',
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#fd5ca3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF0F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  boltIcon: {
    fontSize: 20,
  },
  textContainer: {
    flex: 1,
  },
  sourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  bankBadge: {
    backgroundColor: '#FCE4EC',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 6,
  },
  bankBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#fd5ca3',
    textTransform: 'uppercase',
  },
  timeText: {
    fontSize: 11,
    color: '#64748B',
  },
  titleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0D0E15',
  },
  descText: {
    fontSize: 12,
    color: '#666666',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    marginLeft: 6,
  },
});
