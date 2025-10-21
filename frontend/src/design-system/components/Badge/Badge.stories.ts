import type { Meta, StoryObj } from '@storybook/vue3';
import Badge from './Badge.vue';

const meta: Meta<typeof Badge> = {
  title: 'Design System/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile badge component for displaying status, categories, or labels.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'success', 'warning', 'error', 'neutral'],
      description: 'Color variant of the badge',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
      description: 'Size of the badge',
    },
    rounded: {
      control: 'boolean',
      description: 'Whether the badge should be fully rounded',
    },
    outline: {
      control: 'boolean',
      description: 'Whether the badge should have outline style',
    },
    dot: {
      control: 'boolean',
      description: 'Whether to display as a dot indicator',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'default',
    size: 'sm',
  },
  render: (args) => ({
    components: { Badge },
    setup() {
      return { args };
    },
    template: '<Badge v-bind="args">Default</Badge>',
  }),
};

export const Variants: Story = {
  render: () => ({
    components: { Badge },
    template: `
      <div class="flex flex-wrap gap-2">
        <Badge variant="default">Default</Badge>
        <Badge variant="primary">Primary</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="error">Error</Badge>
        <Badge variant="neutral">Neutral</Badge>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    components: { Badge },
    template: `
      <div class="flex items-center gap-2">
        <Badge size="xs" variant="primary">Extra Small</Badge>
        <Badge size="sm" variant="primary">Small</Badge>
        <Badge size="md" variant="primary">Medium</Badge>
        <Badge size="lg" variant="primary">Large</Badge>
      </div>
    `,
  }),
};

export const Outline: Story = {
  render: () => ({
    components: { Badge },
    template: `
      <div class="flex flex-wrap gap-2">
        <Badge variant="default" outline>Default</Badge>
        <Badge variant="primary" outline>Primary</Badge>
        <Badge variant="secondary" outline>Secondary</Badge>
        <Badge variant="success" outline>Success</Badge>
        <Badge variant="warning" outline>Warning</Badge>
        <Badge variant="error" outline>Error</Badge>
        <Badge variant="neutral" outline>Neutral</Badge>
      </div>
    `,
  }),
};

export const Rounded: Story = {
  render: () => ({
    components: { Badge },
    template: `
      <div class="flex flex-wrap gap-2">
        <Badge variant="primary" rounded>Rounded</Badge>
        <Badge variant="success" rounded>Success</Badge>
        <Badge variant="warning" rounded>Warning</Badge>
        <Badge variant="error" rounded>Error</Badge>
      </div>
    `,
  }),
};

export const Dots: Story = {
  render: () => ({
    components: { Badge },
    template: `
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2">
          <Badge variant="success" dot />
          <span class="text-sm">Online</span>
        </div>
        <div class="flex items-center gap-2">
          <Badge variant="warning" dot />
          <span class="text-sm">Away</span>
        </div>
        <div class="flex items-center gap-2">
          <Badge variant="error" dot />
          <span class="text-sm">Offline</span>
        </div>
        <div class="flex items-center gap-2">
          <Badge variant="neutral" dot />
          <span class="text-sm">Unknown</span>
        </div>
      </div>
    `,
  }),
};

export const WithIcons: Story = {
  render: () => ({
    components: { Badge },
    template: `
      <div class="flex flex-wrap gap-2">
        <Badge variant="success">
          <template #icon-left>
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </template>
          Completed
        </Badge>
        
        <Badge variant="warning">
          <template #icon-left>
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </template>
          Warning
        </Badge>
        
        <Badge variant="primary">
          3D Model
          <template #icon-right>
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
            </svg>
          </template>
        </Badge>
      </div>
    `,
  }),
};

export const StatusBadges: Story = {
  render: () => ({
    components: { Badge },
    template: `
      <div class="space-y-4">
        <div>
          <h4 class="text-sm font-medium text-neutral-700 mb-2">Order Status</h4>
          <div class="flex flex-wrap gap-2">
            <Badge variant="neutral">Draft</Badge>
            <Badge variant="warning">Pending</Badge>
            <Badge variant="primary">In Progress</Badge>
            <Badge variant="success">Completed</Badge>
            <Badge variant="error">Cancelled</Badge>
          </div>
        </div>
        
        <div>
          <h4 class="text-sm font-medium text-neutral-700 mb-2">3D Print Categories</h4>
          <div class="flex flex-wrap gap-2">
            <Badge variant="primary" outline>Miniatures</Badge>
            <Badge variant="secondary" outline>Prototypes</Badge>
            <Badge variant="success" outline>Functional Parts</Badge>
            <Badge variant="warning" outline>Art & Decor</Badge>
          </div>
        </div>
      </div>
    `,
  }),
};