import './bootstrap';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import AppComponent from './components/AppComponent.vue';

const app = createApp({});
const pinia = createPinia();

app.component('app-component', AppComponent);
app.use(pinia);
app.mount('#app');