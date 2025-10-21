import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import Input from './Input.vue';

const meta: Meta<typeof Input> = {
  title: 'Design System/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible input component with various styles, sizes, and states.',
      },
    },
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
      description: 'Input type',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the input',
    },
    variant: {
      control: 'select',
      options: ['default', 'filled', 'outlined'],
      description: 'Visual style variant',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
    readonly: {
      control: 'boolean',
      description: 'Whether the input is readonly',
    },
    required: {
      control: 'boolean',
      description: 'Whether the input is required',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'Enter your email',
    type: 'email',
  },
  render: (args) => ({
    components: { Input },
    setup() {
      const value = ref('');
      return { args, value };
    },
    template: '<div class="w-80"><Input v-bind="args" v-model="value" /></div>',
  }),
};

export const WithError: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'Enter your email',
    type: 'email',
    error: 'Please enter a valid email address',
    required: true,
  },
  render: (args) => ({
    components: { Input },
    setup() {
      const value = ref('invalid-email');
      return { args, value };
    },
    template: '<div class="w-80"><Input v-bind="args" v-model="value" /></div>',
  }),
};

export const WithHint: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
    type: 'password',
    hint: 'Password must be at least 8 characters long',
  },
  render: (args) => ({
    components: { Input },
    setup() {
      const value = ref('');
      return { args, value };
    },
    template: '<div class="w-80"><Input v-bind="args" v-model="value" /></div>',
  }),
};

export const Sizes: Story = {
  render: () => ({
    components: { Input },
    setup() {
      const smallValue = ref('');
      const mediumValue = ref('');
      const largeValue = ref('');
      return { smallValue, mediumValue, largeValue };
    },
    template: `
      <div class="w-80 space-y-4">
        <Input v-model="smallValue" size="sm" label="Small Input" placeholder="Small size" />
        <Input v-model="mediumValue" size="md" label="Medium Input" placeholder="Medium size" />
        <Input v-model="largeValue" size="lg" label="Large Input" placeholder="Large size" />
      </div>
    `,
  }),
};

export const Variants: Story = {
  render: () => ({
    components: { Input },
    setup() {
      const defaultValue = ref('');
      const filledValue = ref('');
      const outlinedValue = ref('');
      return { defaultValue, filledValue, outlinedValue };
    },
    template: `
      <div class="w-80 space-y-4">
        <Input v-model="defaultValue" variant="default" label="Default Variant" placeholder="Default style" />
        <Input v-model="filledValue" variant="filled" label="Filled Variant" placeholder="Filled style" />
        <Input v-model="outlinedValue" variant="outlined" label="Outlined Variant" placeholder="Outlined style" />
      </div>
    `,
  }),
};

export const WithIcons: Story = {
  render: () => ({
    components: { Input },
    setup() {
      const searchValue = ref('');
      const emailValue = ref('');
      return { searchValue, emailValue };
    },
    template: `
      <div class="w-80 space-y-4">
        <Input v-model="searchValue" label="Search" placeholder="Search projects...">
          <template #icon-left>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </template>
        </Input>
        
        <Input v-model="emailValue" type="email" label="Email" placeholder="your@email.com">
          <template #icon-left>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
            </svg>
          </template>
          <template #icon-right>
            <svg class="w-4 h-4 text-success-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </template>
        </Input>
      </div>
    `,
  }),
};

export const States: Story = {
  render: () => ({
    components: { Input },
    setup() {
      const normalValue = ref('Normal input');
      const disabledValue = ref('Disabled input');
      const readonlyValue = ref('Readonly input');
      return { normalValue, disabledValue, readonlyValue };
    },
    template: `
      <div class="w-80 space-y-4">
        <Input v-model="normalValue" label="Normal State" />
        <Input v-model="disabledValue" label="Disabled State" disabled />
        <Input v-model="readonlyValue" label="Readonly State" readonly />
      </div>
    `,
  }),
};