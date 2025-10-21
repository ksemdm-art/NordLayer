/**
 * Color contrast utility for NordLayer brand colors
 * Tests WCAG 2.1 AA compliance for accessibility
 */

// Convert hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Calculate relative luminance
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Calculate contrast ratio
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return 0;
  
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
}

// Check WCAG compliance
export function isWCAGCompliant(color1: string, color2: string, level: 'AA' | 'AAA' = 'AA'): boolean {
  const ratio = getContrastRatio(color1, color2);
  return level === 'AA' ? ratio >= 4.5 : ratio >= 7;
}

// NordLayer brand colors for testing
export const nordColors = {
  primary: '#1B2A41',      // Северный синий
  ice: '#F4F7FA',          // Ледяной белый
  gray: '#8E9BAE',         // Холодный серый
  copper: '#C68642',       // Медный акцент
  white: '#FFFFFF',
  black: '#000000',
};

// Test all color combinations
export function testNordLayerAccessibility() {
  const results = [];
  
  // Primary text combinations
  results.push({
    name: 'Primary text on ice background',
    foreground: nordColors.primary,
    background: nordColors.ice,
    ratio: getContrastRatio(nordColors.primary, nordColors.ice),
    compliant: isWCAGCompliant(nordColors.primary, nordColors.ice)
  });
  
  results.push({
    name: 'Primary text on white background',
    foreground: nordColors.primary,
    background: nordColors.white,
    ratio: getContrastRatio(nordColors.primary, nordColors.white),
    compliant: isWCAGCompliant(nordColors.primary, nordColors.white)
  });
  
  results.push({
    name: 'Gray text on ice background',
    foreground: nordColors.gray,
    background: nordColors.ice,
    ratio: getContrastRatio(nordColors.gray, nordColors.ice),
    compliant: isWCAGCompliant(nordColors.gray, nordColors.ice)
  });
  
  results.push({
    name: 'Copper accent on ice background',
    foreground: nordColors.copper,
    background: nordColors.ice,
    ratio: getContrastRatio(nordColors.copper, nordColors.ice),
    compliant: isWCAGCompliant(nordColors.copper, nordColors.ice)
  });
  
  results.push({
    name: 'White text on primary background',
    foreground: nordColors.white,
    background: nordColors.primary,
    ratio: getContrastRatio(nordColors.white, nordColors.primary),
    compliant: isWCAGCompliant(nordColors.white, nordColors.primary)
  });
  
  results.push({
    name: 'White text on copper background',
    foreground: nordColors.white,
    background: nordColors.copper,
    ratio: getContrastRatio(nordColors.white, nordColors.copper),
    compliant: isWCAGCompliant(nordColors.white, nordColors.copper)
  });
  
  return results;
}