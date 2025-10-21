import type { Meta, StoryObj } from '@storybook/vue3';
import Card from './Card.vue';
import Button from '../Button/Button.vue';

const meta: Meta<typeof Card> = {
  title: 'Design System/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible card component for displaying content with optional header and footer.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'outlined', 'ghost'],
      description: 'Visual style variant of the card',
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl'],
      description: 'Internal padding of the card',
    },
    rounded: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: 'Border radius of the card',
    },
    hover: {
      control: 'boolean',
      description: 'Whether the card has hover effects',
    },
    interactive: {
      control: 'boolean',
      description: 'Whether the card is interactive (clickable)',
    },
    title: {
      control: 'text',
      description: 'Title text for the card header',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'default',
    padding: 'md',
    rounded: 'lg',
    title: 'Card Title',
  },
  render: (args) => ({
    components: { Card },
    setup() {
      return { args };
    },
    template: `
      <div class="w-80">
        <Card v-bind="args">
          <p class="text-neutral-600">This is the card content. It can contain any type of content including text, images, buttons, and more.</p>
        </Card>
      </div>
    `,
  }),
};

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    padding: 'md',
    rounded: 'lg',
    title: 'Elevated Card',
  },
  render: (args) => ({
    components: { Card },
    setup() {
      return { args };
    },
    template: `
      <div class="w-80">
        <Card v-bind="args">
          <p class="text-neutral-600">This card has a subtle shadow for elevation.</p>
        </Card>
      </div>
    `,
  }),
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    padding: 'md',
    rounded: 'lg',
    title: 'Outlined Card',
  },
  render: (args) => ({
    components: { Card },
    setup() {
      return { args };
    },
    template: `
      <div class="w-80">
        <Card v-bind="args">
          <p class="text-neutral-600">This card has a prominent border outline.</p>
        </Card>
      </div>
    `,
  }),
};

export const WithHeaderAndFooter: Story = {
  render: () => ({
    components: { Card, Button },
    template: `
      <div class="w-80">
        <Card variant="elevated" padding="md" rounded="lg">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-neutral-900">Project Card</h3>
              <span class="text-sm text-neutral-500">3D Model</span>
            </div>
          </template>
          
          <div class="space-y-3">
            <p class="text-neutral-600">This is a 3D printing project card with custom header and footer slots.</p>
            <div class="bg-neutral-100 rounded-md p-3">
              <p class="text-sm text-neutral-500">Material: PLA</p>
              <p class="text-sm text-neutral-500">Print Time: 2h 30m</p>
            </div>
          </div>
          
          <template #footer>
            <div class="flex gap-2">
              <Button size="sm" variant="outline">View Details</Button>
              <Button size="sm" variant="primary">Download STL</Button>
            </div>
          </template>
        </Card>
      </div>
    `,
  }),
};

export const Interactive: Story = {
  args: {
    variant: 'elevated',
    padding: 'md',
    rounded: 'lg',
    interactive: true,
    title: 'Interactive Card',
  },
  render: (args) => ({
    components: { Card },
    setup() {
      return { args };
    },
    template: `
      <div class="w-80">
        <Card v-bind="args">
          <p class="text-neutral-600">This card is interactive and responds to clicks with scaling animation.</p>
        </Card>
      </div>
    `,
  }),
};

export const WithHover: Story = {
  args: {
    variant: 'elevated',
    padding: 'md',
    rounded: 'lg',
    hover: true,
    title: 'Hover Card',
  },
  render: (args) => ({
    components: { Card },
    setup() {
      return { args };
    },
    template: `
      <div class="w-80">
        <Card v-bind="args">
          <p class="text-neutral-600">This card has hover effects with shadow and translation.</p>
        </Card>
      </div>
    `,
  }),
};

export const Variants: Story = {
  render: () => ({
    components: { Card },
    template: `
      <div class="grid grid-cols-2 gap-4 w-96">
        <Card variant="default" padding="md" title="Default">
          <p class="text-sm text-neutral-600">Default variant</p>
        </Card>
        <Card variant="elevated" padding="md" title="Elevated">
          <p class="text-sm text-neutral-600">Elevated variant</p>
        </Card>
        <Card variant="outlined" padding="md" title="Outlined">
          <p class="text-sm text-neutral-600">Outlined variant</p>
        </Card>
        <Card variant="ghost" padding="md" title="Ghost">
          <p class="text-sm text-neutral-600">Ghost variant</p>
        </Card>
      </div>
    `,
  }),
};