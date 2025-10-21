import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import Modal from './Modal.vue';
import Button from '../Button/Button.vue';
import Input from '../Input/Input.vue';

const meta: Meta<typeof Modal> = {
  title: 'Design System/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible modal component with customizable size, header, body, and footer.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      description: 'Size of the modal',
    },
    showClose: {
      control: 'boolean',
      description: 'Whether the modal can be closed with X button',
    },
    closeOnOverlay: {
      control: 'boolean',
      description: 'Whether clicking backdrop closes the modal',
    },
    closeOnEscape: {
      control: 'boolean',
      description: 'Whether the modal can be closed with Escape key',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => ({
    components: { Modal, Button },
    setup() {
      const isOpen = ref(false);
      return { isOpen };
    },
    template: `
      <div>
        <Button @click="isOpen = true">Open Modal</Button>
        
        <Modal v-model="isOpen" title="Default Modal">
          <p class="text-neutral-600">
            This is a default modal with a title and some content. You can close it by clicking the X button or clicking outside.
          </p>
        </Modal>
      </div>
    `,
  }),
};

export const WithFooter: Story = {
  render: () => ({
    components: { Modal, Button },
    setup() {
      const isOpen = ref(false);
      return { isOpen };
    },
    template: `
      <div>
        <Button @click="isOpen = true">Open Modal with Footer</Button>
        
        <Modal v-model="isOpen" title="Confirm Action">
          <p class="text-neutral-600">
            Are you sure you want to delete this 3D model? This action cannot be undone.
          </p>
          
          <template #footer>
            <div class="flex gap-3 justify-end">
              <Button variant="ghost" @click="isOpen = false">Cancel</Button>
              <Button variant="danger" @click="isOpen = false">Delete</Button>
            </div>
          </template>
        </Modal>
      </div>
    `,
  }),
};

export const FormModal: Story = {
  render: () => ({
    components: { Modal, Button, Input },
    setup() {
      const isOpen = ref(false);
      const projectName = ref('');
      const description = ref('');
      
      const handleSubmit = () => {
        console.log('Submitting:', { projectName: projectName.value, description: description.value });
        isOpen.value = false;
      };
      
      return { isOpen, projectName, description, handleSubmit };
    },
    template: `
      <div>
        <Button @click="isOpen = true">Add New Project</Button>
        
        <Modal v-model="isOpen" title="Add New 3D Project" size="lg">
          <div class="space-y-4">
            <Input 
              v-model="projectName" 
              label="Project Name" 
              placeholder="Enter project name"
              required
            />
            <Input 
              v-model="description" 
              label="Description" 
              placeholder="Describe your 3D model"
            />
            <div class="bg-neutral-50 rounded-lg p-4">
              <h4 class="text-sm font-medium text-neutral-700 mb-2">Upload STL File</h4>
              <div class="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center">
                <svg class="mx-auto h-12 w-12 text-neutral-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <p class="mt-2 text-sm text-neutral-600">Click to upload or drag and drop</p>
                <p class="text-xs text-neutral-500">STL files up to 10MB</p>
              </div>
            </div>
          </div>
          
          <template #footer>
            <div class="flex gap-3 justify-end">
              <Button variant="ghost" @click="isOpen = false">Cancel</Button>
              <Button variant="primary" @click="handleSubmit">Add Project</Button>
            </div>
          </template>
        </Modal>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    components: { Modal, Button },
    setup() {
      const modals = ref({
        xs: false,
        sm: false,
        md: false,
        lg: false,
        xl: false,
        '2xl': false,
      });
      
      return { modals };
    },
    template: `
      <div class="flex flex-wrap gap-2">
        <Button size="sm" @click="modals.xs = true">XS Modal</Button>
        <Button size="sm" @click="modals.sm = true">SM Modal</Button>
        <Button size="sm" @click="modals.md = true">MD Modal</Button>
        <Button size="sm" @click="modals.lg = true">LG Modal</Button>
        <Button size="sm" @click="modals.xl = true">XL Modal</Button>
        <Button size="sm" @click="modals['2xl'] = true">2XL Modal</Button>
        
        <Modal v-model="modals.xs" title="Extra Small Modal" size="xs">
          <p class="text-sm text-neutral-600">This is an extra small modal.</p>
        </Modal>
        
        <Modal v-model="modals.sm" title="Small Modal" size="sm">
          <p class="text-neutral-600">This is a small modal with more content space.</p>
        </Modal>
        
        <Modal v-model="modals.md" title="Medium Modal" size="md">
          <p class="text-neutral-600">This is a medium modal, which is the default size.</p>
        </Modal>
        
        <Modal v-model="modals.lg" title="Large Modal" size="lg">
          <p class="text-neutral-600">This is a large modal with even more space for content.</p>
        </Modal>
        
        <Modal v-model="modals.xl" title="Extra Large Modal" size="xl">
          <p class="text-neutral-600">This is an extra large modal suitable for complex forms or detailed content.</p>
        </Modal>
        
        <Modal v-model="modals['2xl']" title="2XL Modal" size="2xl">
          <p class="text-neutral-600">This is a 2XL modal with maximum content space for complex interfaces.</p>
        </Modal>
      </div>
    `,
  }),
};

export const Persistent: Story = {
  render: () => ({
    components: { Modal, Button },
    setup() {
      const isOpen = ref(false);
      return { isOpen };
    },
    template: `
      <div>
        <Button @click="isOpen = true">Open Persistent Modal</Button>
        
        <Modal v-model="isOpen" title="Persistent Modal" persistent>
          <p class="text-neutral-600">
            This modal is persistent and cannot be closed by clicking outside or pressing Escape. 
            You must use the Close button.
          </p>
          
          <template #footer>
            <div class="flex justify-end">
              <Button variant="primary" @click="isOpen = false">Close</Button>
            </div>
          </template>
        </Modal>
      </div>
    `,
  }),
};