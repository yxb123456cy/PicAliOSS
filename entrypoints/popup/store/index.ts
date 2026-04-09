import { createPinia } from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia();
// 开启状态持久化 使用Pinia持久化插件;
pinia.use(piniaPluginPersistedstate)
// 导出Pinia实例
export default pinia;
