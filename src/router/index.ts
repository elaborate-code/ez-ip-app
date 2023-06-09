import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/app',
            name: 'app',
            // route level code-splitting
            // this generates a separate chunk (App.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('@/views/AppView.vue'),
            children: [
                {
                    path: '/app/ipv4/address-classful-analyses',
                    name: 'ipv4-address-classful-analyses',
                    component: () => import('@/views/app/NetworkIpv4Classful.vue')
                },
                {
                    path: '/app/ipv4/address-analyses',
                    name: 'ipv4-address-analyses',
                    component: () => import('@/views/app/NetworkIpv4.vue')
                },
                {
                    path: '/app/ipv4/subnet-calculator',
                    name: 'ipv4-subnet-calculator',
                    component: () => import('@/views/app/SubnetCalculatorIpv4.vue')
                }
            ]
        }
    ]
})

export default router
