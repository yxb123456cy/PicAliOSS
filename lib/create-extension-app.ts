import type { Pinia } from "pinia";
import type { Component } from "vue";
import type { Router } from "vue-router";
import PrimeVue from "primevue/config";
import { createApp } from "vue";
import { definePreset } from "@primeuix/themes";
import Aura from "@primeuix/themes/aura";
import ToastService from "primevue/toastservice";
import pinia from "@/stores";

interface CreateExtensionAppOptions {
  router?: Router;
  beforeMount?: (context: ExtensionAppContext) => Promise<void> | void;
}

interface ExtensionAppContext {
  app: ReturnType<typeof createApp>;
  pinia: Pinia;
  mount: (selector?: string) => Promise<void>;
}
// 进行PrimeVue主题自定义
const PicAliOSSPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: "#fff2eb",
      100: "#ffe2d5",
      200: "#ffc4ad",
      300: "#ffa685",
      400: "#ff885c",
      500: "#ff5000",
      600: "#e64900",
      700: "#bf3d00",
      800: "#993100",
      900: "#732500",
      950: "#4d1800",
    },
  },
});
export function createExtensionApp(
  rootComponent: Component,
  options: CreateExtensionAppOptions = {},
): ExtensionAppContext {
  const app = createApp(rootComponent);

  app.use(pinia);
  app.use(PrimeVue, {
    theme: {
      preset: PicAliOSSPreset,
      options: {},
    },
  });
  // 引入PrimeVue的ToastService插件
  app.use(ToastService);
  if (options.router) app.use(options.router);

  const context: ExtensionAppContext = {
    app,
    pinia,
    mount: async (selector = "#app") => {
      if (options.beforeMount) {
        await options.beforeMount(context);
      }
      app.mount(selector);
    },
  };

  return context;
}
