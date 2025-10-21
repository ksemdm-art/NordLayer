import type { Meta, StoryObj } from '@storybook/vue3';
import Grid from './Grid.vue';
import Card from '../Card/Card.vue';

const meta: Meta<typeof Grid> = {
  title: 'Design System/Grid',
  component: Grid,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A responsive grid system component for creating flexible layouts.',
      },
    },
  },
  argTypes: {
    cols: {
      control: 'select',
      options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 'auto', 'none'],
      description: 'Number of columns in the grid',
    },
    gap: {
      control: 'select',
      options: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 20, 24],
      description: 'Gap between grid items',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    cols: 3,
    gap: 4,
  },
  render: (args) => ({
    components: { Grid, Card },
    setup() {
      return { args };
    },
    template: `
      <Grid v-bind="args">
        <Card v-for="i in 6" :key="i" padding="md">
          <h3 class="font-semibold text-neutral-900">Card {{ i }}</h3>
          <p class="text-sm text-neutral-600 mt-2">This is card content for item {{ i }}.</p>
        </Card>
      </Grid>
    `,
  }),
};

export const ResponsiveGrid: Story = {
  args: {
    cols: 1,
    gap: 4,
    responsive: {
      sm: 2,
      md: 3,
      lg: 4,
      xl: 6,
    },
  },
  render: (args) => ({
    components: { Grid, Card },
    setup() {
      return { args };
    },
    template: `
      <div>
        <div class="mb-4">
          <h3 class="text-lg font-semibold text-neutral-900">Responsive Grid</h3>
          <p class="text-sm text-neutral-600">1 col on mobile, 2 on sm, 3 on md, 4 on lg, 6 on xl</p>
        </div>
        <Grid v-bind="args">
          <Card v-for="i in 12" :key="i" padding="md" variant="elevated">
            <h4 class="font-medium text-neutral-900">Item {{ i }}</h4>
            <p class="text-xs text-neutral-600 mt-1">Responsive grid item</p>
          </Card>
        </Grid>
      </div>
    `,
  }),
};

export const ProjectGallery: Story = {
  render: () => ({
    components: { Grid, Card },
    template: `
      <div>
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-neutral-900">3D Project Gallery</h2>
          <p class="text-neutral-600">Responsive grid layout for 3D printing projects</p>
        </div>
        
        <Grid :cols="1" :gap="6" :responsive="{ sm: 2, lg: 3, xl: 4 }">
          <Card 
            v-for="project in projects" 
            :key="project.id" 
            variant="elevated" 
            hover
            padding="none"
          >
            <div class="aspect-square bg-gradient-to-br from-primary-100 to-secondary-100 rounded-t-lg"></div>
            <div class="p-4">
              <h3 class="font-semibold text-neutral-900">{{ project.title }}</h3>
              <p class="text-sm text-neutral-600 mt-1">{{ project.category }}</p>
              <div class="flex items-center justify-between mt-3">
                <span class="text-xs text-neutral-500">{{ project.printTime }}</span>
                <div class="flex gap-1">
                  <div class="w-2 h-2 bg-success-500 rounded-full"></div>
                  <span class="text-xs text-neutral-600">Available</span>
                </div>
              </div>
            </div>
          </Card>
        </Grid>
      </div>
    `,
    setup() {
      const projects = [
        { id: 1, title: 'Dragon Miniature', category: 'Fantasy', printTime: '2h 30m' },
        { id: 2, title: 'Phone Stand', category: 'Functional', printTime: '1h 15m' },
        { id: 3, title: 'Vase Design', category: 'Decorative', printTime: '3h 45m' },
        { id: 4, title: 'Gear Assembly', category: 'Mechanical', printTime: '4h 20m' },
        { id: 5, title: 'Keychain', category: 'Accessories', printTime: '30m' },
        { id: 6, title: 'Lamp Shade', category: 'Lighting', printTime: '2h 10m' },
        { id: 7, title: 'Puzzle Box', category: 'Games', printTime: '5h 30m' },
        { id: 8, title: 'Plant Pot', category: 'Garden', printTime: '1h 45m' },
      ];
      
      return { projects };
    },
  }),
};

export const DifferentGaps: Story = {
  render: () => ({
    components: { Grid, Card },
    template: `
      <div class="space-y-8">
        <div>
          <h3 class="text-lg font-semibold text-neutral-900 mb-4">Gap 2 (0.5rem)</h3>
          <Grid :cols="4" :gap="2">
            <Card v-for="i in 4" :key="i" padding="sm">
              <div class="text-center text-sm">Item {{ i }}</div>
            </Card>
          </Grid>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold text-neutral-900 mb-4">Gap 4 (1rem)</h3>
          <Grid :cols="4" :gap="4">
            <Card v-for="i in 4" :key="i" padding="sm">
              <div class="text-center text-sm">Item {{ i }}</div>
            </Card>
          </Grid>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold text-neutral-900 mb-4">Gap 8 (2rem)</h3>
          <Grid :cols="4" :gap="8">
            <Card v-for="i in 4" :key="i" padding="sm">
              <div class="text-center text-sm">Item {{ i }}</div>
            </Card>
          </Grid>
        </div>
      </div>
    `,
  }),
};

export const VariousColumns: Story = {
  render: () => ({
    components: { Grid, Card },
    template: `
      <div class="space-y-8">
        <div>
          <h3 class="text-lg font-semibold text-neutral-900 mb-4">2 Columns</h3>
          <Grid :cols="2" :gap="4">
            <Card v-for="i in 4" :key="i" padding="md">
              <div class="text-center">Column {{ i }}</div>
            </Card>
          </Grid>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold text-neutral-900 mb-4">3 Columns</h3>
          <Grid :cols="3" :gap="4">
            <Card v-for="i in 6" :key="i" padding="md">
              <div class="text-center">Column {{ i }}</div>
            </Card>
          </Grid>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold text-neutral-900 mb-4">4 Columns</h3>
          <Grid :cols="4" :gap="4">
            <Card v-for="i in 8" :key="i" padding="md">
              <div class="text-center">Column {{ i }}</div>
            </Card>
          </Grid>
        </div>
      </div>
    `,
  }),
};