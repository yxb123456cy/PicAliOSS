<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import TabMenu from 'primevue/tabmenu';

const route = useRoute();
const router = useRouter();

const items = ref([
  { label: '上传', icon: 'pi pi-cloud-upload', route: '/' },
  { label: '管理', icon: 'pi pi-images', route: '/manage' },
  { label: '设置', icon: 'pi pi-cog', route: '/settings' },
  { label: '帮助', icon: 'pi pi-question-circle', route: '/help' }
]);

const activeIndex = ref(0);

watch(
  () => route.path,
  (newPath) => {
    const index = items.value.findIndex((item) => item.route === newPath);
    if (index !== -1) {
      activeIndex.value = index;
    }
  },
  { immediate: true }
);

const onTabChange = (event: any) => {
  const item = items.value[event.index];
  if (item && item.route) {
    router.push(item.route);
  }
};
</script>

<template>
  <div class="layout-container">
    <div class="header">
      <div class="title-bar">
        <span class="title">PicAliOSS</span>
      </div>
      <TabMenu :model="items" v-model:activeIndex="activeIndex" @tab-change="onTabChange">
        <template #item="{ item, props }">
          <a v-bind="props.action" class="flex items-center gap-2">
            <span :class="item.icon" />
            <span class="font-bold">{{ item.label }}</span>
          </a>
        </template>
      </TabMenu>
    </div>
    <div class="main-content">
      <Toast />
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </div>
  </div>
</template>

<style scoped lang="scss">
// use custom global scss styles variable
.layout-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: $cus-bg-color;
}

.header {
  flex-shrink: 0;
  background: white;
  border-bottom: 1px solid #e2e8f0;
}

.title-bar {
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .title {
    font-size: 16px;
    font-weight: 600;
    color: $cus-text-color;
  }
}

.main-content {
  flex: 1;
  overflow: hidden;
  position: relative;
}

:deep(.p-tabmenu-nav) {
  border-bottom: none;
}

:deep(.p-tabmenu-tablist) {
  justify-content: space-around;
}
</style>
