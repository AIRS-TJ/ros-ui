import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import MapList from '@/views/MapList.vue'
import Home from '../views/Home'
import Main from '../views/Main.vue'
import Login from '../views/Login.vue'
import About from '@/views/About.vue'
import Test from '@/views/Test.vue'
import TaskList from '@/views/TaskList.vue'
import SysSetting from '@/views/SysSetting.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/dashboard/main',
        meta: {
            title: '',
            needAuth: true,
        },
    },
    {
        path: '/dashboard',
        name: 'Home',
        component: Home,
        meta: {
            title: '',
            needAuth: true,
        },
        children: [
            {
                path: 'main',
                name: 'Main',
                component: Main,
                meta: {
                    title: '',
                    needAuth: true,
                },
            },
            {
                path: 'maplist',
                name: 'MapList',
                component: MapList,
                meta: {
                    title: '',
                    needAuth: true,
                },
            },
            {
                path: 'taskList',
                name: 'TaskList',
                component: TaskList,
                meta: {
                    title: '',
                    needAuth: true,
                },
            },
            {
                path: 'taskTemplate',
                name: 'taskTemplate',
                component: TaskList,
                meta: {
                    title: '',
                    needAuth: true,
                },
            },

            {
                path: 'taskPlan',
                name: 'taskPlan',
                component: TaskList,
                meta: {
                    title: '',
                    needAuth: true,
                },
            },

            {
                path: 'sysSetting',
                name: 'SysSetting',
                component: SysSetting,
            },
            {
                path: 'debug',
                name: 'debug',
                component: SysSetting,
            },
            {
                path: 'about',
                name: 'About',
                component: About,
                meta: {
                    title: '',
                    needAuth: true,
                },
            },
            {
                path: 'test',
                name: 'Test',
                component: Test,
                meta: {
                    title: '',
                    needAuth: true,
                },
            },
        ]
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: {
            title: '',
            needAuth: true,
        },
    },


]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior: () => ({ left: 0, top: 0 }),
})

export default router
