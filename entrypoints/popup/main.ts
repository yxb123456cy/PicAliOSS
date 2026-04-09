import { createApp } from 'vue';
import './style.css';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import App from './App.vue';
import pinia from './store';
import { router } from './router';

const app = createApp(App)
// 引入PrimeVue组件库
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {

        }
    }
})
app.use(pinia)
app.use(router)
app.mount('#app');
