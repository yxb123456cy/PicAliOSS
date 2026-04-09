import { createApp } from 'vue';
// 引入PrimeVue ICON图标
 import 'primeicons/primeicons.css';
import './style.css';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
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
// 引入PrimeVue的ToastService插件
app.use(ToastService)
app.use(pinia)
app.use(router)
app.mount('#app');
