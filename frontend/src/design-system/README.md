# 3D Printing Platform Design System

A comprehensive design system built for the 3D Printing Platform, featuring modern components, consistent tokens, and responsive layouts.

## Overview

This design system provides:
- **Design Tokens**: Colors, typography, spacing, shadows, and animations
- **UI Components**: Reusable Vue.js components with consistent styling
- **Responsive Grid**: Flexible layout system for all screen sizes
- **Storybook Documentation**: Interactive component documentation
- **TypeScript Support**: Full type safety and IntelliSense

## Quick Start

### Installation

```bash
# Install the design system in your Vue.js project
npm install
```

### Usage

```vue
<template>
  <div>
    <!-- Use individual components -->
    <Button variant="primary" size="lg" @click="handleClick">
      Get Started
    </Button>
    
    <Card variant="elevated" padding="lg">
      <template #header>
        <h2>3D Project</h2>
      </template>
      
      <p>Your 3D printing project details...</p>
      
      <template #footer>
        <Button variant="outline">View Details</Button>
      </template>
    </Card>
    
    <!-- Use responsive grid -->
    <Grid :cols="1" :gap="6" :responsive="{ md: 2, lg: 3 }">
      <Card v-for="project in projects" :key="project.id">
        <!-- Project content -->
      </Card>
    </Grid>
  </div>
</template>

<script setup lang="ts">
import { Button, Card, Grid } from '@/design-system';

// Your component logic
</script>
```

### Plugin Installation

```typescript
// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import DesignSystem from './design-system';

const app = createApp(App);
app.use(DesignSystem);
app.mount('#app');
```

After installing the plugin, components are available with `Ds` prefix:

```vue
<template>
  <DsButton variant="primary">Click me</DsButton>
  <DsCard title="My Card">Content here</DsCard>
</template>
```

## Design Tokens

### Colors

The design system uses a modern color palette optimized for 3D printing themes:

- **Primary**: Blue tones for main actions and branding
- **Secondary**: Purple tones for secondary actions
- **Accent**: Orange tones for highlights and CTAs
- **Neutral**: Gray scale for text and backgrounds
- **Semantic**: Success (green), Warning (yellow), Error (red)

Each color has 11 shades (50-950) for maximum flexibility.

### Typography

- **Font Family**: Inter (primary), JetBrains Mono (monospace)
- **Font Sizes**: 9 sizes from xs (12px) to 9xl (128px)
- **Font Weights**: 9 weights from thin (100) to black (900)
- **Line Heights**: Optimized for readability

### Spacing

Consistent spacing system based on 0.25rem (4px) increments:
- Base unit: 4px
- Scale: 1, 2, 3, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96

### Shadows

Three shadow systems:
- **Standard**: sm, default, md, lg, xl, 2xl
- **Custom**: soft, medium, hard
- **Colored**: glow (primary), glow-accent (orange)

### Animations

Smooth micro-interactions:
- **Entrance**: fade-in, slide-up, slide-down, scale-in
- **Continuous**: bounce-soft, pulse-soft, spin
- **Interactive**: hover effects, active states

## Components

### Button

Versatile button component with multiple variants and sizes.

```vue
<Button variant="primary" size="lg" :loading="isLoading">
  Submit Order
</Button>
```

**Props:**
- `variant`: primary, secondary, outline, ghost, danger
- `size`: xs, sm, md, lg, xl
- `loading`: boolean
- `disabled`: boolean
- `fullWidth`: boolean
- `rounded`: boolean

### Card

Flexible card component for content containers.

```vue
<Card variant="elevated" padding="lg" hover>
  <template #header>Card Title</template>
  Card content goes here
  <template #footer>
    <Button size="sm">Action</Button>
  </template>
</Card>
```

**Props:**
- `variant`: default, elevated, outlined, ghost
- `padding`: none, sm, md, lg, xl
- `rounded`: none, sm, md, lg, xl, 2xl
- `hover`: boolean
- `interactive`: boolean

### Input

Form input component with validation states.

```vue
<Input
  v-model="email"
  type="email"
  label="Email Address"
  placeholder="your@email.com"
  :error="emailError"
  required
>
  <template #icon-left>
    <EmailIcon />
  </template>
</Input>
```

**Props:**
- `type`: text, email, password, number, tel, url, search
- `size`: sm, md, lg
- `variant`: default, filled, outlined
- `label`: string
- `error`: string
- `hint`: string

### Badge

Status and category indicators.

```vue
<Badge variant="success" size="sm">
  Completed
</Badge>
```

**Props:**
- `variant`: default, primary, secondary, success, warning, error, neutral
- `size`: xs, sm, md, lg
- `outline`: boolean
- `rounded`: boolean
- `dot`: boolean

### Modal

Overlay dialogs with customizable content.

```vue
<Modal v-model="isOpen" title="Confirm Action" size="md">
  Are you sure you want to delete this project?
  
  <template #footer>
    <Button variant="ghost" @click="isOpen = false">Cancel</Button>
    <Button variant="danger" @click="confirmDelete">Delete</Button>
  </template>
</Modal>
```

**Props:**
- `size`: xs, sm, md, lg, xl, 2xl, full
- `closable`: boolean
- `closeOnBackdrop`: boolean
- `persistent`: boolean

### Grid

Responsive grid layout system.

```vue
<Grid :cols="1" :gap="4" :responsive="{ sm: 2, md: 3, lg: 4 }">
  <Card v-for="item in items" :key="item.id">
    {{ item.content }}
  </Card>
</Grid>
```

**Props:**
- `cols`: 1-12, auto, none
- `gap`: 0-24
- `responsive`: object with breakpoint overrides

## Responsive Design

The design system includes 7 breakpoints:

- `xs`: 475px
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px
- `3xl`: 1600px

All components are designed to work seamlessly across all screen sizes.

## Storybook Documentation

Run Storybook to explore all components interactively:

```bash
npm run storybook
```

This will start Storybook at `http://localhost:6006` with:
- Component documentation
- Interactive controls
- Usage examples
- Design token reference

## Development

### Adding New Components

1. Create component directory: `src/design-system/components/NewComponent/`
2. Add `NewComponent.vue` with TypeScript props interface
3. Create `NewComponent.stories.ts` for Storybook documentation
4. Export from `components/index.ts`
5. Add to plugin in `index.ts`

### Design Token Updates

1. Update token files in `src/design-system/tokens/`
2. Update Tailwind config to match
3. Update Storybook stories to showcase changes
4. Test across all components

### Testing

```bash
# Run component tests
npm run test:unit

# Run Storybook tests
npm run test:storybook
```

## Best Practices

### Component Usage

- Use semantic HTML elements
- Provide proper ARIA labels
- Support keyboard navigation
- Follow color contrast guidelines
- Test with screen readers

### Performance

- Components are tree-shakeable
- Minimal runtime overhead
- Optimized animations
- Efficient re-renders

### Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader friendly
- High contrast support
- Focus management

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Follow the existing code style
2. Add Storybook stories for new components
3. Include TypeScript types
4. Test across all supported browsers
5. Update documentation

## License

MIT License - see LICENSE file for details.