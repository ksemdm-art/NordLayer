import type { Meta, StoryObj } from '@storybook/vue3';
import { colors } from './tokens/colors';

const meta: Meta = {
  title: 'Design System/Overview',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Complete design system for the 3D Printing Platform with modern colors, typography, and components.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ColorPalette: Story = {
  render: () => ({
    setup() {
      return { colors };
    },
    template: `
      <div class="p-8 space-y-8">
        <div>
          <h1 class="text-3xl font-bold text-neutral-900 mb-2">3D Printing Platform Design System</h1>
          <p class="text-lg text-neutral-600">Modern, accessible, and consistent design tokens and components</p>
        </div>
        
        <div class="space-y-6">
          <div v-for="(colorScale, scaleName) in colors" :key="scaleName" class="space-y-3">
            <h3 class="text-lg font-semibold text-neutral-800 capitalize">{{ scaleName }}</h3>
            <div class="grid grid-cols-11 gap-2">
              <div 
                v-for="(colorValue, shade) in colorScale" 
                :key="shade"
                class="space-y-2"
              >
                <div 
                  :style="{ backgroundColor: colorValue }"
                  class="h-16 rounded-lg shadow-sm border border-neutral-200"
                  :title="colorValue"
                />
                <div class="text-center">
                  <div class="text-xs font-medium text-neutral-700">{{ shade }}</div>
                  <div class="text-xs text-neutral-500 font-mono">{{ colorValue }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};

export const Typography: Story = {
  render: () => ({
    template: `
      <div class="p-8 space-y-8 max-w-4xl">
        <div>
          <h1 class="text-3xl font-bold text-neutral-900 mb-2">Typography Scale</h1>
          <p class="text-lg text-neutral-600">Consistent typography hierarchy for all content</p>
        </div>
        
        <div class="space-y-6">
          <div class="space-y-4">
            <h2 class="text-xl font-semibold text-neutral-800">Headings</h2>
            <div class="space-y-3">
              <div class="flex items-baseline gap-4">
                <span class="text-sm text-neutral-500 w-16">9xl</span>
                <h1 class="text-9xl font-bold text-neutral-900">Heading</h1>
              </div>
              <div class="flex items-baseline gap-4">
                <span class="text-sm text-neutral-500 w-16">8xl</span>
                <h1 class="text-8xl font-bold text-neutral-900">Heading</h1>
              </div>
              <div class="flex items-baseline gap-4">
                <span class="text-sm text-neutral-500 w-16">7xl</span>
                <h1 class="text-7xl font-bold text-neutral-900">Heading</h1>
              </div>
              <div class="flex items-baseline gap-4">
                <span class="text-sm text-neutral-500 w-16">6xl</span>
                <h1 class="text-6xl font-bold text-neutral-900">Heading</h1>
              </div>
              <div class="flex items-baseline gap-4">
                <span class="text-sm text-neutral-500 w-16">5xl</span>
                <h1 class="text-5xl font-bold text-neutral-900">Heading</h1>
              </div>
              <div class="flex items-baseline gap-4">
                <span class="text-sm text-neutral-500 w-16">4xl</span>
                <h1 class="text-4xl font-bold text-neutral-900">Heading</h1>
              </div>
              <div class="flex items-baseline gap-4">
                <span class="text-sm text-neutral-500 w-16">3xl</span>
                <h1 class="text-3xl font-bold text-neutral-900">Heading</h1>
              </div>
              <div class="flex items-baseline gap-4">
                <span class="text-sm text-neutral-500 w-16">2xl</span>
                <h1 class="text-2xl font-bold text-neutral-900">Heading</h1>
              </div>
              <div class="flex items-baseline gap-4">
                <span class="text-sm text-neutral-500 w-16">xl</span>
                <h1 class="text-xl font-bold text-neutral-900">Heading</h1>
              </div>
              <div class="flex items-baseline gap-4">
                <span class="text-sm text-neutral-500 w-16">lg</span>
                <h1 class="text-lg font-bold text-neutral-900">Heading</h1>
              </div>
            </div>
          </div>
          
          <div class="space-y-4">
            <h2 class="text-xl font-semibold text-neutral-800">Body Text</h2>
            <div class="space-y-3">
              <div class="flex items-baseline gap-4">
                <span class="text-sm text-neutral-500 w-16">base</span>
                <p class="text-base text-neutral-700">The quick brown fox jumps over the lazy dog. This is base text size.</p>
              </div>
              <div class="flex items-baseline gap-4">
                <span class="text-sm text-neutral-500 w-16">lg</span>
                <p class="text-lg text-neutral-700">The quick brown fox jumps over the lazy dog. This is large text size.</p>
              </div>
              <div class="flex items-baseline gap-4">
                <span class="text-sm text-neutral-500 w-16">sm</span>
                <p class="text-sm text-neutral-700">The quick brown fox jumps over the lazy dog. This is small text size.</p>
              </div>
              <div class="flex items-baseline gap-4">
                <span class="text-sm text-neutral-500 w-16">xs</span>
                <p class="text-xs text-neutral-700">The quick brown fox jumps over the lazy dog. This is extra small text size.</p>
              </div>
            </div>
          </div>
          
          <div class="space-y-4">
            <h2 class="text-xl font-semibold text-neutral-800">Font Weights</h2>
            <div class="space-y-2">
              <p class="text-base font-thin text-neutral-700">Thin (100) - The quick brown fox jumps over the lazy dog</p>
              <p class="text-base font-extralight text-neutral-700">Extra Light (200) - The quick brown fox jumps over the lazy dog</p>
              <p class="text-base font-light text-neutral-700">Light (300) - The quick brown fox jumps over the lazy dog</p>
              <p class="text-base font-normal text-neutral-700">Normal (400) - The quick brown fox jumps over the lazy dog</p>
              <p class="text-base font-medium text-neutral-700">Medium (500) - The quick brown fox jumps over the lazy dog</p>
              <p class="text-base font-semibold text-neutral-700">Semibold (600) - The quick brown fox jumps over the lazy dog</p>
              <p class="text-base font-bold text-neutral-700">Bold (700) - The quick brown fox jumps over the lazy dog</p>
              <p class="text-base font-extrabold text-neutral-700">Extra Bold (800) - The quick brown fox jumps over the lazy dog</p>
              <p class="text-base font-black text-neutral-700">Black (900) - The quick brown fox jumps over the lazy dog</p>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};

export const Spacing: Story = {
  render: () => ({
    template: `
      <div class="p-8 space-y-8">
        <div>
          <h1 class="text-3xl font-bold text-neutral-900 mb-2">Spacing Scale</h1>
          <p class="text-lg text-neutral-600">Consistent spacing system based on 0.25rem (4px) increments</p>
        </div>
        
        <div class="space-y-4">
          <div class="grid grid-cols-1 gap-4">
            <div class="flex items-center gap-4">
              <span class="text-sm text-neutral-500 w-12">1</span>
              <div class="w-1 h-8 bg-primary-500"></div>
              <span class="text-sm text-neutral-600">0.25rem (4px)</span>
            </div>
            <div class="flex items-center gap-4">
              <span class="text-sm text-neutral-500 w-12">2</span>
              <div class="w-2 h-8 bg-primary-500"></div>
              <span class="text-sm text-neutral-600">0.5rem (8px)</span>
            </div>
            <div class="flex items-center gap-4">
              <span class="text-sm text-neutral-500 w-12">3</span>
              <div class="w-3 h-8 bg-primary-500"></div>
              <span class="text-sm text-neutral-600">0.75rem (12px)</span>
            </div>
            <div class="flex items-center gap-4">
              <span class="text-sm text-neutral-500 w-12">4</span>
              <div class="w-4 h-8 bg-primary-500"></div>
              <span class="text-sm text-neutral-600">1rem (16px)</span>
            </div>
            <div class="flex items-center gap-4">
              <span class="text-sm text-neutral-500 w-12">6</span>
              <div class="w-6 h-8 bg-primary-500"></div>
              <span class="text-sm text-neutral-600">1.5rem (24px)</span>
            </div>
            <div class="flex items-center gap-4">
              <span class="text-sm text-neutral-500 w-12">8</span>
              <div class="w-8 h-8 bg-primary-500"></div>
              <span class="text-sm text-neutral-600">2rem (32px)</span>
            </div>
            <div class="flex items-center gap-4">
              <span class="text-sm text-neutral-500 w-12">12</span>
              <div class="w-12 h-8 bg-primary-500"></div>
              <span class="text-sm text-neutral-600">3rem (48px)</span>
            </div>
            <div class="flex items-center gap-4">
              <span class="text-sm text-neutral-500 w-12">16</span>
              <div class="w-16 h-8 bg-primary-500"></div>
              <span class="text-sm text-neutral-600">4rem (64px)</span>
            </div>
            <div class="flex items-center gap-4">
              <span class="text-sm text-neutral-500 w-12">20</span>
              <div class="w-20 h-8 bg-primary-500"></div>
              <span class="text-sm text-neutral-600">5rem (80px)</span>
            </div>
            <div class="flex items-center gap-4">
              <span class="text-sm text-neutral-500 w-12">24</span>
              <div class="w-24 h-8 bg-primary-500"></div>
              <span class="text-sm text-neutral-600">6rem (96px)</span>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};

export const Shadows: Story = {
  render: () => ({
    template: `
      <div class="p-8 space-y-8">
        <div>
          <h1 class="text-3xl font-bold text-neutral-900 mb-2">Shadow System</h1>
          <p class="text-lg text-neutral-600">Elevation system using consistent shadow styles</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-neutral-800">Standard Shadows</h3>
            <div class="space-y-4">
              <div class="p-6 bg-white rounded-lg shadow-sm">
                <h4 class="font-medium text-neutral-900">Small</h4>
                <p class="text-sm text-neutral-600">shadow-sm</p>
              </div>
              <div class="p-6 bg-white rounded-lg shadow">
                <h4 class="font-medium text-neutral-900">Default</h4>
                <p class="text-sm text-neutral-600">shadow</p>
              </div>
              <div class="p-6 bg-white rounded-lg shadow-md">
                <h4 class="font-medium text-neutral-900">Medium</h4>
                <p class="text-sm text-neutral-600">shadow-md</p>
              </div>
              <div class="p-6 bg-white rounded-lg shadow-lg">
                <h4 class="font-medium text-neutral-900">Large</h4>
                <p class="text-sm text-neutral-600">shadow-lg</p>
              </div>
              <div class="p-6 bg-white rounded-lg shadow-xl">
                <h4 class="font-medium text-neutral-900">Extra Large</h4>
                <p class="text-sm text-neutral-600">shadow-xl</p>
              </div>
            </div>
          </div>
          
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-neutral-800">Custom Shadows</h3>
            <div class="space-y-4">
              <div class="p-6 bg-white rounded-lg shadow-soft">
                <h4 class="font-medium text-neutral-900">Soft</h4>
                <p class="text-sm text-neutral-600">shadow-soft</p>
              </div>
              <div class="p-6 bg-white rounded-lg shadow-medium">
                <h4 class="font-medium text-neutral-900">Medium</h4>
                <p class="text-sm text-neutral-600">shadow-medium</p>
              </div>
              <div class="p-6 bg-white rounded-lg shadow-hard">
                <h4 class="font-medium text-neutral-900">Hard</h4>
                <p class="text-sm text-neutral-600">shadow-hard</p>
              </div>
            </div>
          </div>
          
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-neutral-800">Colored Shadows</h3>
            <div class="space-y-4">
              <div class="p-6 bg-white rounded-lg shadow-glow">
                <h4 class="font-medium text-neutral-900">Primary Glow</h4>
                <p class="text-sm text-neutral-600">shadow-glow</p>
              </div>
              <div class="p-6 bg-white rounded-lg shadow-glow-accent">
                <h4 class="font-medium text-neutral-900">Accent Glow</h4>
                <p class="text-sm text-neutral-600">shadow-glow-accent</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};

export const Animations: Story = {
  render: () => ({
    template: `
      <div class="p-8 space-y-8">
        <div>
          <h1 class="text-3xl font-bold text-neutral-900 mb-2">Animation System</h1>
          <p class="text-lg text-neutral-600">Smooth micro-interactions and transitions</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-neutral-800">Entrance Animations</h3>
            <div class="space-y-4">
              <div class="p-4 bg-white rounded-lg shadow-sm border animate-fade-in">
                <h4 class="font-medium text-neutral-900">Fade In</h4>
                <p class="text-sm text-neutral-600">animate-fade-in</p>
              </div>
              <div class="p-4 bg-white rounded-lg shadow-sm border animate-slide-up">
                <h4 class="font-medium text-neutral-900">Slide Up</h4>
                <p class="text-sm text-neutral-600">animate-slide-up</p>
              </div>
              <div class="p-4 bg-white rounded-lg shadow-sm border animate-scale-in">
                <h4 class="font-medium text-neutral-900">Scale In</h4>
                <p class="text-sm text-neutral-600">animate-scale-in</p>
              </div>
            </div>
          </div>
          
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-neutral-800">Continuous Animations</h3>
            <div class="space-y-4">
              <div class="p-4 bg-white rounded-lg shadow-sm border animate-bounce-soft">
                <h4 class="font-medium text-neutral-900">Soft Bounce</h4>
                <p class="text-sm text-neutral-600">animate-bounce-soft</p>
              </div>
              <div class="p-4 bg-white rounded-lg shadow-sm border animate-pulse-soft">
                <h4 class="font-medium text-neutral-900">Soft Pulse</h4>
                <p class="text-sm text-neutral-600">animate-pulse-soft</p>
              </div>
              <div class="p-4 bg-white rounded-lg shadow-sm border">
                <div class="flex items-center gap-2">
                  <div class="w-4 h-4 bg-primary-500 rounded-full animate-spin"></div>
                  <div>
                    <h4 class="font-medium text-neutral-900">Spin</h4>
                    <p class="text-sm text-neutral-600">animate-spin</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-neutral-800">Interactive States</h3>
            <div class="space-y-4">
              <div class="p-4 bg-white rounded-lg shadow-sm border hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer">
                <h4 class="font-medium text-neutral-900">Hover Lift</h4>
                <p class="text-sm text-neutral-600">Hover to see effect</p>
              </div>
              <div class="p-4 bg-white rounded-lg shadow-sm border hover:scale-105 transition-transform duration-200 cursor-pointer">
                <h4 class="font-medium text-neutral-900">Hover Scale</h4>
                <p class="text-sm text-neutral-600">Hover to see effect</p>
              </div>
              <div class="p-4 bg-white rounded-lg shadow-sm border active:scale-95 transition-transform duration-150 cursor-pointer">
                <h4 class="font-medium text-neutral-900">Active Scale</h4>
                <p class="text-sm text-neutral-600">Click to see effect</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};