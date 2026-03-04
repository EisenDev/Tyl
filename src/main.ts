import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: () => import('./App.vue') }
    ],
    scrollBehavior(to) {
        if (to.hash) {
            return { el: to.hash, behavior: 'smooth', top: 80 }
        }
        return { top: 0 }
    }
})

const app = createApp(App)
app.use(router)
app.mount('#app')
