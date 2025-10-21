// Design System Tokens Export
export * from './colors';
export * from './typography';
export * from './spacing';
export * from './shadows';
export * from './animations';

// Breakpoints for responsive design
export const breakpoints = {
  xs: '475px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  '3xl': '1600px',
} as const;

export type Breakpoint = keyof typeof breakpoints;