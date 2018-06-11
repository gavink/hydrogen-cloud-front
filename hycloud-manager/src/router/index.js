import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Login from '@/components/Login'
import Users from '@/components/auth/Users'
import Roles from '@/components/auth/Roles'
import Auths from '@/components/auth/Auths'
import Home from '@/components/home/Home'
import PersonalProfile from '@/components/personal/Profile'
import PersonalSecurity from '@/components/personal/Security'
import Clients from '@/components/client/Clients'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index,
      children: [
        {
          path: 'home',
          name: 'home',
          component: Home
        },
        {
          path: 'profile',
          name: 'profile',
          component: PersonalProfile
        },
        {
          path: 'security',
          name: 'security',
          component: PersonalSecurity
        },
        {
          path: 'users',
          name: 'users',
          component: Users
        },
        {
          path: 'roles',
          name: 'roles',
          component: Roles
        },
        {
          path: 'auths',
          name: 'auths',
          component: Auths
        },
        {
          path: 'clients',
          name: 'clients',
          component: Clients
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})

router.beforeEach((to, from, next) => {
  // 可以使用正则表达式对需要拦截的path进行过滤
  // if (/\*/.test(to.path)) {...} else {...}
  if (localStorage.getItem('refresh_token') || to.path === '/login') {
    next()
  } else {
    next({name: 'login'})
  }
})

export default router
