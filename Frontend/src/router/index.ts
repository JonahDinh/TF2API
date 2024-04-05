import Vue from 'vue';
import VueRouter, { NavigationGuard, RouteConfig } from 'vue-router';
import HomeView from '../views/HomeView.vue';

Vue.use(VueRouter);

const isLoggedIn: NavigationGuard = (to, from, next) => {
  const steamId = localStorage.getItem('steamID');
  const isAuthenticated = steamId !== null;

  if (isAuthenticated) {
    // User is logged in
    next();
  } else {
    // User is not logged in
    window.alert('Please log in to continue.');
    next('/login');
  }
};

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,

  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
  },
  {
    path: '/maps',
    name: 'Maps',
    component: () => import('../views/MapsView.vue'),
    beforeEnter: isLoggedIn,
  },
  {
    path: '/weapons',
    name: 'Weapons',
    component: () => import('../views/WeaponsView.vue'),
    beforeEnter: isLoggedIn,
  },
  {
    path: '/classes',
    name: 'Classes',
    component: () => import('../views/ClassesView.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginPage.vue'),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
