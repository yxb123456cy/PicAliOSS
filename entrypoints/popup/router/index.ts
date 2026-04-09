import { createWebHashHistory, createRouter, RouteRecordRaw } from 'vue-router'
import DefaultLayout from '../layouts/default.vue'
// 定义项目路由配置
const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: DefaultLayout,
        children: [
            {
                path: '',
                name: 'Upload',
                component: () => import('../views/upload.vue')
            },
            {
                path: 'manage',
                name: 'Manage',
                component: () => import('../views/manage.vue')
            },
            {
                path: 'settings',
                name: 'Settings',
                component: () => import('../views/settings.vue')
            },
            {
                path: 'help',
                name: 'Help',
                component: () => import('../views/help.vue')
            }
        ]
    }
]
// 创建路由实例
export const router = createRouter({
    // 创建哈希模式路由实例;
    history: createWebHashHistory(),
    routes,
})
