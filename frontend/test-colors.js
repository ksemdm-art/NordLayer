// Quick test for NordLayer color accessibility
import { testNordLayerAccessibility } from './src/utils/color-contrast.ts';

console.log('NordLayer Color Accessibility Test Results:');
console.log('==========================================');

const results = testNordLayerAccessibility();
results.forEach(result => {
  const status = result.compliant ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} ${result.name}`);
  console.log(`   Contrast Ratio: ${result.ratio.toFixed(2)}:1`);
  console.log(`   Required: 4.5:1 (WCAG AA)`);
  console.log('');
});

const passCount = results.filter(r => r.compliant).length;
console.log(`Summary: ${passCount}/${results.length} combinations pass WCAG AA standards`);