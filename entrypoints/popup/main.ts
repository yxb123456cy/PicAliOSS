import { createApp } from 'vue';
// 引入PrimeVue ICON图标
import 'primeicons/primeicons.css';
import './style.css';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import App from './App.vue';
import pinia from './store';
import { useSettingsStore } from './store/settings';
import { router } from './router';

const PicAliOSSPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '#fff2eb',
            100: '#ffe2d5',
            200: '#ffc4ad',
            300: '#ffa685',
            400: '#ff885c',
            500: '#ff5000',
            600: '#e64900',
            700: '#bf3d00',
            800: '#993100',
            900: '#732500',
            950: '#4d1800'
        }
    }
});

const app = createApp(App);
// 引入PrimeVue组件库
app.use(PrimeVue, {
    theme: {
        preset: PicAliOSSPreset,
        options: {}
    }
});
// 引入PrimeVue的ToastService插件
app.use(ToastService);
app.use(pinia);
const settingsStore = useSettingsStore(pinia);
await settingsStore.loadConfig();
app.use(router);
app.mount('#app');
