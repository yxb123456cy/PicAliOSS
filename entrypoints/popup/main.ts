// 引入PrimeVue ICON图标
import "primeicons/primeicons.css";
import "./style.css";
import App from "./App.vue";
import { router } from "./router";
import { createExtensionApp } from "@/lib/create-extension-app";
import { useSettingsStore } from "@/stores/settings";

const { mount, pinia } = createExtensionApp(App, {
  router,
  beforeMount: async () => {
    const settingsStore = useSettingsStore(pinia);
    await settingsStore.loadConfig();
  },
});

await mount();
