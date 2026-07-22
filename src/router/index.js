import { createRouter, createWebHistory } from 'vue-router'
import { isLoggedIn } from '@/store/auth'

import Home from '@/views/Home.vue'
import ScientificMaterials from '@/views/ScientificMaterials.vue'
import EducationalMaterials from '@/views/EducationalMaterials.vue'
import Visualisations from '@/views/Visualisations.vue'
import Contribute from '@/views/Contribute.vue'
import About from '@/views/About.vue'
import Login from '@/views/Login.vue'
import ScientificProject from '@/views/ScientificProject.vue'
import EducationalMaterial from '@/views/EducationalMaterial.vue'
import PiecesList from '@/views/PiecesList.vue'
import PieceView from '@/views/PieceView.vue'
import CollectionsList from '@/views/CollectionsList.vue'
import CollectionView from '@/views/CollectionView.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/scientific-materials', name: 'scientific-materials', component: ScientificMaterials },
  { path: '/educational-materials', name: 'educational-materials', component: EducationalMaterials },
  { path: '/visualisations', name: 'visualisations', component: Visualisations },
  { path: '/contribute', name: 'contribute', component: Contribute, meta: { requiresAuth: true } },
  { path: '/about', name: 'about', component: About },
  { path: '/login', name: 'login', component: Login },
  { path: '/scientific-materials/:id', name: 'scientific-project', component: ScientificProject },
  { path: '/educational-materials/:id', name: 'educational-material', component: EducationalMaterial },
  { path: '/pieces', name: 'pieces', component: PiecesList },
  { path: '/pieces/:id', name: 'piece', component: PieceView },
  { path: '/collections', name: 'collections', component: CollectionsList },
  { path: '/collections/:id', name: 'collection', component: CollectionView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !isLoggedIn.value) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }
})

export default router
