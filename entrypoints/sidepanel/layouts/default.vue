<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

interface NavItem {
  label: string;
  icon: string;
  route: string;
  color: string;
}

const navItems = ref<NavItem[]>([
  { label: "上传", icon: "pi pi-cloud-upload", route: "/", color: "#ff5000" },
  { label: "管理", icon: "pi pi-images", route: "/manage", color: "#6366f1" },
  { label: "设置", icon: "pi pi-cog", route: "/settings", color: "#64748b" },
]);

const activeRoute = ref("/");

watch(
  () => route.path,
  (newPath) => {
    activeRoute.value = newPath;
  },
  { immediate: true },
);

const navigate = (item: NavItem) => {
  router.push(item.route);
};
</script>

<template>
  <div class="sidepanel-layout">
    <!-- 左侧垂直导航 -->
    <nav class="side-nav">
      <div class="nav-brand">
        <span class="brand-icon">☁️</span>
        <span class="brand-name">PicAliOSS</span>
      </div>

      <div class="nav-items">
        <button
          v-for="item in navItems"
          :key="item.route"
          class="nav-item"
          :class="{ active: activeRoute === item.route }"
          @click="navigate(item)"
          :title="item.label"
        >
          <span class="nav-icon" :class="item.icon"></span>
          <span class="nav-label">{{ item.label }}</span>
          <span
            v-if="activeRoute === item.route"
            class="active-indicator"
            :style="{ background: item.color }"
          ></span>
        </button>
      </div>

      <div class="nav-footer">
        <span class="version-badge">v0.1</span>
      </div>
    </nav>

    <!-- 右侧主内容区 -->
    <main class="main-area">
      <Toast />
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </main>
  </div>
</template>

<style scoped lang="scss">
.sidepanel-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: $cus-bg-color;
}

// 左侧导航
.side-nav {
  width: 72px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  padding: 12px 0;
  box-shadow: 2px 0 12px rgba(15, 23, 42, 0.04);
  z-index: 10;
}

.nav-brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding-bottom: 16px;
  margin-bottom: 8px;
  border-bottom: 1px solid #f1f5f9;
  width: 100%;

  .brand-icon {
    font-size: 22px;
  }

  .brand-name {
    font-size: 10px;
    font-weight: 700;
    color: #1e293b;
    letter-spacing: -0.2px;
  }
}

.nav-items {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 0 8px;
  width: 100%;
  box-sizing: border-box;
}

.nav-item {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 10px 4px 8px;
  border: none;
  border-radius: 12px;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #64748b;

  &:hover {
    background: #f1f5f9;
    color: #334155;
  }

  &.active {
    background: #fff7ed;
    color: #ff5000;

    .nav-icon {
      color: #ff5000;
    }

    .nav-label {
      color: #ff5000;
      font-weight: 600;
    }
  }

  .nav-icon {
    font-size: 20px;
    transition: color 0.2s;
  }

  .nav-label {
    font-size: 10px;
    font-weight: 500;
    white-space: nowrap;
    transition: color 0.2s;
  }

  .active-indicator {
    position: absolute;
    right: -8px;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 20px;
    border-radius: 3px 0 0 3px;
  }
}

.nav-footer {
  margin-top: auto;
  padding-top: 12px;

  .version-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 2px 8px;
    border-radius: 999px;
    font-size: 10px;
    font-weight: 600;
    color: #94a3b8;
    background: #f1f5f9;
  }
}

// 右侧主内容
.main-area {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  position: relative;
}
</style>
