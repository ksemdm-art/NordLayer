import type { Meta, StoryObj } from '@storybook/vue3';
import ExamplePage from './ExamplePage.vue';

const meta: Meta<typeof ExamplePage> = {
  title: 'Design System/Example Page',
  component: ExamplePage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Complete example page showcasing the design system in action for a 3D printing platform.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const FullPage: Story = {
  render: () => ({
    components: { ExamplePage },
    template: '<ExamplePage />',
  }),
};