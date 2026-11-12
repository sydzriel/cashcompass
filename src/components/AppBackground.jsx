import { ImageBackground, StyleSheet } from 'react-native';

/**
 * AppBackground
 * Menggunakan imej background app-bg.png seperti yang diminta pengguna
 * dengan sokongan opacity supaya kad maklumat menyerlah (design.md).
 */
export default function AppBackground({ opacity = 1.0, children, style }) {
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
