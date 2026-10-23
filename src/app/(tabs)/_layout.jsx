import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Custom Floating Pill Tab Bar with Liquid Glass Effect
function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.tabBarContainer}>
      <BlurView
        intensity={30}
        tint="light"
        style={styles.floatingBar}
      >
        <View style={styles.floatingBarInner}>
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
                  color={isFocused ? '#fd5ca3' : '#666666'}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    { color: isFocused ? '#fd5ca3' : '#666666' },
                    isFocused && styles.activeTabLabel,
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </BlurView>
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
    borderRadius: 36,
    overflow: 'hidden',
    width: '100%',
    maxWidth: 390,
    borderWidth: 0.5,
    borderColor: 'rgb(203, 203, 203)',
  },
  floatingBarInner: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 6,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
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
    backgroundColor: 'rgba(255, 240, 245, 0.75)',
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