import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AppBackground from '../components/AppBackground';

export default function LoginScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleNavigateHome = () => {
    router.push('/income-setup');
  };

  return (
    <AppBackground opacity={1} style={styles.gradientContainer}>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {/* Header Logo & Title */}
          <View style={styles.headerContainer}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoBadgeText}>🧭</Text>
            </View>
            <Text style={styles.logoText}>
              <Text style={styles.logoC}>C</Text>ash <Text style={styles.logoC}>C</Text>ompass
            </Text>

            <Text style={styles.greetingHello}>Hello!</Text>
            <Text style={styles.greetingWelcome}>
              Welcome to <Text style={styles.brandInline}>CashCompass</Text>
            </Text>
            <Text style={styles.subtitleTag}>
              Finance Tracker
            </Text>
          </View>

          {/* Form Inputs (Flat White Cards per design.md) */}
          <View style={styles.form}>
            {/* Name Input */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="person-outline"
                size={20}
                color="#666666"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Name"
                placeholderTextColor="#94A3B8"
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={20}
                color="#666666"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#94A3B8"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#666666"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#94A3B8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#666666"
                />
              </TouchableOpacity>
            </View>

            {/* Sign Up / Submit Button (Accent #E91E63 & 27px rounded) */}
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleNavigateHome}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#000000ff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.primaryGradient}
              >
                <Text style={styles.primaryButtonText}>Get Started</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Divider: Or Continue With */}
          <View style={styles.dividerRow}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>Or Continue With</Text>
            <View style={styles.line} />
          </View>

          {/* Social Buttons (Flat White per design.md) */}
          <View style={styles.socialContainer}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={handleNavigateHome}
              activeOpacity={0.8}
            >
              <Ionicons
                name="logo-google"
                size={20}
                color="#EA4335"
                style={styles.socialIcon}
              />
              <Text style={styles.socialButtonText}>Sign In with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialButton}
              onPress={handleNavigateHome}
              activeOpacity={0.8}
            >
              <Ionicons
                name="logo-apple"
                size={22}
                color="#0D0E15"
                style={styles.socialIcon}
              />
              <Text style={styles.socialButtonText}>Sign In with Apple</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 26,
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    borderWidth: 0,
    borderColor: 'rgba(0,0,0,0.04)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoBadgeText: {
    fontSize: 28,
  },
  logoText: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0D0E15',
    marginBottom: 8,
  },
  logoC: {
    color: '#fd5ca3',
  },
  greetingHello: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0D0E15',
    marginBottom: 2,
  },
  greetingWelcome: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0D0E15',
  },
  brandInline: {
    fontWeight: '900',
    color: '#fd5ca3',
  },
  subtitleTag: {
    fontSize: 12,
    color: '#666666',
    marginTop: 6,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 0,
    borderColor: 'rgba(0, 0, 0, 0.04)',
    borderRadius: 24,
    paddingHorizontal: 18,
    height: 54,
    marginBottom: 12,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#0D0E15',
  },
  primaryButton: {
    height: 54,
    borderRadius: 27, // 27px bulat penuh
    overflow: 'hidden',
    marginTop: 6,
    marginBottom: 18,
  },
  primaryGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
  },
  dividerText: {
    fontSize: 12,
    color: '#666666',
    marginHorizontal: 12,
    fontWeight: '500',
  },
  socialContainer: {
    width: '100%',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    height: 52,
    borderRadius: 26,
    marginBottom: 10,
    borderWidth: 0,
    borderColor: 'rgba(0, 0, 0, 0.04)',
  },
  socialIcon: {
    marginRight: 10,
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0D0E15',
  },
});