import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/Home.vue';
import Profile from '@/views/Profile.vue';
import Test from '@/views/Test.vue';
import VizEdit from '@/views/VizEdit.vue';
import VizView from '@/views/VizView.vue';

import { authGuard } from "@/auth/authGuard";

Vue.use(VueRouter);

export default new VueRouter({
  mode: 'history',
  base: '/',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/new/:id?',
      name: 'new',
      component: VizEdit,
    },
    {
      path: '/view/:id?',
      name: 'view',
      component: VizView
    },
    {
      path: '/edit/:id?',
      name: 'edit',
      component: VizEdit,
      beforeEnter: authGuard
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile
    },
    {
      path: '/test',
      name: 'test',
      component: Test
    }
  ]
});
