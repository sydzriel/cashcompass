import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Custom Floating Pill Tab Bar (Universal & Rendah Sikit)
function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.tabBarContainer}>
      <View style={styles.floatingBar}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          let iconName = 'home';
          let label = 'Home';

          if (route.name === 'index') {
            iconName = isFocused ? 'home' : 'home-outline';
            label = 'Home';
          } else if (route.name === 'transactions') {
            iconName = isFocused ? 'swap-horizontal' : 'swap-horizontal-outline';
            label = 'Transactions';
          } else if (route.name === 'insights') {
            iconName = isFocused ? 'stats-chart' : 'stats-chart-outline';
            label = 'Insights';
          } else if (route.name === 'profile') {
            iconName = isFocused ? 'person' : 'person-outline';
            label = 'Profile';
          }

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              activeOpacity={0.8}
              style={[
                styles.tabItem,
                isFocused && styles.activeTabPill,
              ]}
            >
              <Ionicons
                name={iconName}
                size={22}
                color={isFocused ? '#fd5ca3' : '#64748B'}
              />
              <Text
                style={[
                  styles.tabLabel,
                  { color: isFocused ? '#fd5ca3' : '#64748B' },
                  isFocused && styles.activeTabLabel,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="transactions" options={{ title: 'Transactions' }} />
      <Tabs.Screen name="insights" options={{ title: 'Insights' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 16 : 10,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    alignItems: 'center',
    zIndex: 100,
  },
  floatingBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 36,
    paddingHorizontal: 8,
    paddingVertical: 6,
    width: '100%',
    maxWidth: 390,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 28,
    marginHorizontal: 2,
  },
  activeTabPill: {
    backgroundColor: '#F1F5F9',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 3,
  },
  activeTabLabel: {
    fontWeight: '700',
  },
});