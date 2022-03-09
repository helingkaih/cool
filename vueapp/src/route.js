import { createRouter, createWebHistory } from "vue-router";
import layout from '@/layout/index'
import pagea from './pages/pagea';
import pageb from './pages/pageb';

const routes = [
    {
        path: '/',
        redirect: '/home/dashboard'
    },
    {
        path: '/home',
        component: layout,
        children: [
            { path: 'dashboard', component: () => import('@/pages/home/Home') },
            { path: 'workbench', component: () => import('@/pages/home/Workbench') }
        ]
    },

    {
        path: '/assembly',
        component: layout,
        children: [
            { path: 'elicon', component: () => import('@/pages/assembly/icon/Icon') },
            {
                path: 'eliconplus',
                component: () => import('@/pages/assembly/icon/IconPlus'),
            },
            {
                path: 'baseForm',
                component: () => import('@/pages/assembly/form/BaseForm'),
            }
        ]
    },
    {
        path: '/note',
        component: layout,
        children: [
            {
                path: 'vue2',
                component: () => import('@/pages/note/Vue2'),
            },
            {
                path: 'computed',
                component: () => import('@/pages/note/vue3/computed/Computed'),
            },
            {
                path: 'reactivity',
                component: () => import('@/pages/note/vue3/reactivity/Reactivity'),
            },
            {
                path: 'jsprinciple',
                component: () => import('@/pages/note/js/jsprinciple/Jsprinciple'),
            },
            {
                path: 'jsmodel',
                component: () => import('@/pages/note/js/jsmodel/Jsmodel'),
            }
        ]
    },
    {
        path: '/feature',
        component: layout,
        children: [
            {
                path: 'promise',
                component: () => import('@/pages/feature/promise/Promise'),
            },
            {
                path: 'virtual',
                component: () => import('@/pages/feature/diff/Diff'),
            },
            {
                path: 'eventloop',
                component: () => import('@/pages/feature/eventloop/EventLoop'),
            }
        ]
    },
    { path: '/pagea', component: pagea },
    { path: '/pageb', component: pageb },
];
const router = createRouter({
    // hash模式：createWebHashHistory，
    // history模式：createWebHistory
    history: createWebHistory(window.__POWERED_BY_QIANKUN__ ? '/vue/' : (process.env.NODE_ENV === "development" ? '/' : 'vueapp')), // 处理主应用的基础路由
    // history:createWebHashHistory(),
    routes,
});
export default router