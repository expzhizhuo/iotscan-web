import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/project',
      redirect: '/project/info'
    },
    {
      path: '/',
      name: 'Home',
      component: Home,
      children: [
        {
          path: '/dashboard',
          name: 'dashboard',
          meta: {
            title: '系统首页',
            permiss: 1
          },
          component: () => import('@/views/home/DashBoard.vue')
        },
        {
          path: '/Tasks',
          name: 'Tasks',
          meta: {
            title: '任务列表',
            permiss: '2'
          },
          component: () => import('@/views/tasks/TasksView.vue')
        },
        // {
        //     path: "/celery",
        //     name: "celery",
        //     meta: {
        //         title: "celery任务列表",
        //         permiss: "2"
        //     },
        //     component: () => import("@/views/tasks/TasksCeleryView.vue")
        // },
        {
          path: '/report',
          name: 'report',
          meta: {
            title: '报告列表',
            permiss: '2'
          },
          component: () => import('@/views/tasks/TasksReportView.vue')
        },
        {
          path: '/vul_list',
          name: 'vul_list',
          meta: {
            title: 'POC列表',
            permiss: '2'
          },
          component: () => import('@/views/poc/PocListView.vue')
        },
        {
          path: '/user_list',
          name: 'user_list',
          meta: {
            title: '用户列表',
            permiss: '2'
          },
          component: () => import('@/views/user/UserView.vue')
        },
        {
          path: '/user',
          name: 'user_list',
          meta: {
            title: '用户列表',
            permiss: '2'
          },
          component: () => import('@/views/user/UserView.vue')
        },
        {
          path: '/user/resetpassword',
          name: 'resetpassword',
          meta: {
            title: '重置密码',
            permiss: '1'
          },
          component: () => import('@/views/user/ResetPassword.vue')
        },
        {
          path: '/user/info',
          name: 'userinfo',
          meta: {
            title: '个人中心',
            permiss: '1'
          },
          component: () => import('@/views/user/UserInfo.vue')
        }
      ]
    },
    {
      path: '/project',
      name: '任务详情',
      meta: {
        title: '任务详情',
        permiss: '2'
      },
      component: () => import('@/views/project/ProJectView.vue'),
      children: [
        {
          path: '/project/info',
          name: '项目信息',
          meta: {
            title: '项目信息',
            permiss: 2
          },
          component: () => import('@/views/project/View/ProJectInfo.vue')
        },
        {
          path: '/project/list',
          name: '任务详情',
          meta: {
            title: '任务详情',
            permiss: 2
          },
          component: () => import('@/views/project/View/ProJectList.vue')
        },
        {
          path: '/project/vul_list',
          name: '漏洞信息',
          meta: {
            title: '漏洞信息',
            permiss: 2
          },
          component: () => import('@/views/project/View/ProJectVulList.vue')
        }
      ]
    },
    {
      path: '/login',
      name: '登陆',
      meta: {
        title: '登陆'
      },
      component: () => import('@/views/login/LoginView.vue')
    },
    {
      path: '/404',
      name: '404',
      meta: {
        title: '404'
      },
      component: () => import('@/views/error/404View.vue')
    },
    {
      path: '/401',
      name: '401',
      meta: {
        title: '401'
      },
      component: () => import('@/views/error/401View.vue')
    },
    {
      path: '/echarts',
      name: 'echarts',
      component: () => import('@/views/echarts/NetworkEcharts.vue')
    },
    {
      path: '/test',
      name: 'test',
      meta: {
        title: '测试页面'
      },
      component: () => import('@/components/Common/TestVIew.vue')
    }
  ]
})

export default router
