<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSidebarStore } from '@/stores/sidebar'

interface MenuItem {
  icon?: string
  index: string
  title: string
  permiss: string
  subs?: MenuItem[]
}

const items: MenuItem[] = [
  {
    icon: 'Odometer',
    index: '/dashboard',
    title: '系统首页',
    permiss: '1'
  },
  {
    icon: 'Calendar',
    index: '1',
    title: '任务管理',
    permiss: '2',
    subs: [
      {
        index: '/Tasks',
        title: '任务列表',
        permiss: '2'
      },
      // {
      //   index: "/celery",
      //   title: "celery任务管理",
      //   permiss: "2"
      // },
      {
        index: '/report',
        title: '报告管理',
        permiss: '2'
      }
    ]
  },
  {
    icon: 'DocumentCopy',
    index: '2',
    title: 'POC管理',
    permiss: '2',
    subs: [
      {
        index: '/vul_list',
        title: 'POC列表',
        permiss: '2'
      }
    ]
  },
  {
    icon: 'Edit',
    index: '3',
    title: '用户管理',
    permiss: '4',
    subs: [
      {
        index: '/user/',
        title: '用户',
        permiss: '5'
      },
      {
        index: '/user_list',
        title: '用户列表',
        permiss: '5'
      },
      {
        index: '/upload',
        title: '用户日志',
        permiss: '6'
      }
    ]
  },
  {
    icon: 'Setting',
    index: '/icon',
    title: '系统管理',
    permiss: '10',
    subs: [
      {
        index: '/proxy',
        title: '代理列表',
        permiss: '10'
      },
      {
        index: '/update',
        title: '系统升级',
        permiss: '10'
      }
    ]
  }
]

const route = useRoute()
// const onRoutes = computed(() => {
//   return route.path
// })

// 递归函数来查找与当前路由匹配的最佳菜单项
const findMatchingIndex = (items: Array<any>, path: string): string | null => {
  for (const item of items) {
    if (path.startsWith(item.index)) {
      return item.index
    }
    if (item.subs) {
      let subMatch: any
      subMatch = findMatchingIndex(item.subs, path)
      if (subMatch) {
        return subMatch
      }
    }
  }
  // 如果没有找到匹配项，尝试去掉路径的最后一部分再次查找
  const pathSegments = path.split('/').filter(Boolean)
  if (pathSegments.length > 1) {
    pathSegments.pop()
    return findMatchingIndex(items, '/' + pathSegments.join('/'))
  }
  return null // 如果没有任何匹配，返回null
}

const activeIndex = computed(() => findMatchingIndex(items, route.path) || route.path)

const sidebar = useSidebarStore()
</script>

<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="activeIndex"
      :collapse="sidebar.collapse"
      text-color="#181818"
      active-text-color="#20a0ff"
      unique-opened
      router
    >
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-sub-menu :index="item.index" :key="item.index" v-permiss="item.permiss">
            <template #title>
              <el-icon v-if="item.icon">
                <component :is="item.icon"></component>
              </el-icon>
              <span>{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs" :key="subItem.index">
              <el-sub-menu
                v-if="subItem.subs"
                :index="subItem.index"
                :key="subItem.index"
                v-permiss="item.permiss"
              >
                <template #title>{{ subItem.title }}</template>
                <el-menu-item
                  v-for="(threeItem, i) in subItem.subs"
                  :key="i"
                  :index="threeItem.index"
                >
                  {{ threeItem.title }}
                </el-menu-item>
              </el-sub-menu>
              <el-menu-item v-permiss="item.permiss" :index="subItem.index">
                {{ subItem.title }}
              </el-menu-item>
            </template>
          </el-sub-menu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index" v-permiss="item.permiss">
            <el-icon v-if="item.icon">
              <component :is="item.icon"></component>
            </el-icon>
            <template #title>{{ item.title }}</template>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 20px;
  top: 70px;
  min-width: 180px;
  height: 95%;
  bottom: 0;
  overflow-y: scroll;
}

.sidebar::-webkit-scrollbar {
  width: 0;
}

.sidebar > ul {
  height: 100%;
}
</style>
