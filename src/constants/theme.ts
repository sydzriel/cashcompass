/**
 * Design Tokens per design.md:
 * Tema Utama: Minimalis, Moden, Premium (Konsep "Hybrid Flat Design")
 * Sasaran Pengguna: Pelajar Universiti / Belia
 */

import '@/global.css';

import { Platform } from 'react-native';

export const BackgroundGradients = {
  light: ['#FFFFFF', '#F4E8F8', '#E5D9F2'] as const,
  dark: ['#1A102F', '#0D0E15', '#000000'] as const,
};

export const Colors = {
  light: {
    text: '#0D0E15',
    textSecondary: '#666666',
    background: '#FFFFFF',
    card: '#FFFFFF',
    accent: '#9264ff',
    accentSubtle: '#F4EDFF',
    accentBorder: 'rgba(146, 100, 255, 0.25)',
    border: 'rgba(0, 0, 0, 0.04)',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
  },
  dark: {
    text: '#ffffff',
    textSecondary: '#B0B4BA',
    background: '#0D0E15',
    card: '#18181B',
    accent: '#9264ff',
    accentSubtle: 'rgba(146, 100, 255, 0.18)',
    accentBorder: 'rgba(146, 100, 255, 0.35)',
    border: 'rgba(255, 255, 255, 0.06)',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Typography = {
  largeBalance: {
    fontSize: 48,
    fontWeight: '700' as const,
  },
  headerSecondary: {
    fontSize: 24,
    fontWeight: '600' as const,
  },
  regularText: {
    fontSize: 15,
    fontWeight: '500' as const,
  },
  subtitleText: {
    fontSize: 14,
    fontWeight: '400' as const,
  },
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
  cardMarginBottom: 16,
  scrollPaddingBottom: 110,
  cardRadius: 18,
  buttonRadius: 27,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
