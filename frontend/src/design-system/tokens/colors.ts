// NordLayer Design System Color Tokens - High Contrast
export const colors = {
  // Nordic Blue - Primary brand color (Северный синий) - High contrast
  primary: {
    50: '#f8fafc',   // Ледяной белый (lightest)
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',  // Северный синий (main) - darker
    950: '#020617',  // Deepest dark
  },
  // Cold Gray - Secondary colors (Холодный серый)
  secondary: {
    50: '#f4f7fa',   // Ледяной белый
    100: '#e8eef5',
    200: '#d1dde9',
    300: '#afc2d6',
    400: '#8e9bae',  // Холодный серый (main)
    500: '#6b7a8f',
    600: '#556275',
    700: '#465060',
    800: '#3d4451',
    900: '#1b2a41',
    950: '#0f1a2a',
  },
  // Copper Accent - Saturated warm accent color (Медный акцент)
  accent: {
    50: '#fef7ed',
    100: '#fdedd3',
    200: '#fbd7a5',
    300: '#f8bc6d',
    400: '#f59e42',
    500: '#C68642',   // Медный акцент (main) - более насыщенный
    600: '#B8722A',   // Более насыщенный
    700: '#A05A1F',   // Более насыщенный
    800: '#8B4A1C',
    900: '#73391A',
    950: '#3E1C0B',
  },
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a',
  },
} as const;

export type ColorScale = keyof typeof colors;
export type ColorShade = keyof typeof colors.primary;