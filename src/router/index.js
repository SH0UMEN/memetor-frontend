import Vue from 'vue'
import Router from 'vue-router'
import AllMemes from '@/components/AllMemes'
import CreateMem from '@/components/CreateMem'

Vue.use(Router);

const siteName = 'Memetor';
const router = new Router({
  routes: [
    {
      path: '/',
      name: 'AllMemes',
      meta: {
        title: `Список мемов | ${siteName}`
      },
      component: AllMemes
    },
    {
      path: '/create-mem',
      name: 'CreateMem',
      meta: {
        title: `Создать мем | ${siteName}`
      },
      component: CreateMem
    }
  ]
});
router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  next();
});
export default router;
