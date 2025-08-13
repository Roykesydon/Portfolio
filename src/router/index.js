import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import Introduction from '../views/Introduction.vue'
import Projects from '../views/Projects.vue'
import Illustrations from '../views/Illustrations.vue'
import Home from '../views/Home.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/introduction',
        name: 'Introduction',
        component: Introduction
    },
    {
        path: '/projects',
        name: 'Projects',
        component: Projects
    },
    {
        path: '/illustrations',
        name: 'Illustrations',
        component: Illustrations
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router