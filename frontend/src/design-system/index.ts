// Design System Main Export
export * from './tokens';
export * from './components';

// Design System Plugin for Vue
import type { App } from 'vue';
import Button from './components/Button/Button.vue';
import Card from './components/Card/Card.vue';
import Input from './components/Input/Input.vue';
import Badge from './components/Badge/Badge.vue';
import Modal from './components/Modal/Modal.vue';
import Grid from './components/Grid/Grid.vue';

const components = {
  Button,
  Card,
  Input,
  Badge,
  Modal,
  Grid,
};

export const DesignSystem = {
  install(app: App) {
    Object.entries(components).forEach(([name, component]) => {
      app.component(`Ds${name}`, component);
    });
  },
};

export default DesignSystem;