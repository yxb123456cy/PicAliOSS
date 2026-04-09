import { createApp } from 'vue';
import './style.css';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import App from './App.vue';

const app = createApp(App)
// 引入PrimeVue组件库
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {

        }
    }
})
app.mount('#app');
