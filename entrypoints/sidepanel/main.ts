import "primeicons/primeicons.css";
import "./style.css";
import App from "./App.vue";
import { sidepanelRouter } from "./router";
import { createExtensionApp } from "@/lib/create-extension-app";
import { useSettingsStore } from "@/stores/settings";

const { mount, pinia } = createExtensionApp(App, {
  router: sidepanelRouter,
  beforeMount: async () => {
    const settingsStore = useSettingsStore(pinia);
    await settingsStore.loadConfig();
  },
});

await mount();
