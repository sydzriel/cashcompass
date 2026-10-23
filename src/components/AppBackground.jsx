import { ImageBackground, StyleSheet } from 'react-native';

/**
 * AppBackground
 * Official React Native ImageBackground wrapper for ambient aura background.
 * Uses assets/images/app-bg.png with configurable opacity.
 */
export default function AppBackground({ opacity = 1.00, children, style }) {
  return (
    <ImageBackground
      source={require('../../assets/images/app-bg.png')}
      style={[styles.container, style]}
      imageStyle={{ opacity }}
      resizeMode="cover"
    >
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
