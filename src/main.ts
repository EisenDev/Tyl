import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

import HomeView from './views/HomeView.vue'
import ProposalView from './views/ProposalView.vue'
import { isProposalUnlocked } from './store'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: HomeView },
        {
            path: '/my-proposal',
            component: ProposalView,
            beforeEnter: (to, _from, next) => {
                if (!isProposalUnlocked.value && to.path === '/my-proposal') next('/')
                else next()
            }
        }
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
