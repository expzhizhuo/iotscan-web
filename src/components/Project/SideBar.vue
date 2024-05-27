<script setup lang="ts">
import {computed} from "vue"
import {useRoute} from "vue-router"
import {useSidebarStore} from "@/stores/sidebar"
import {useTaskStore} from "@/stores/taskinfo";

const TaskStore = useTaskStore()
const sidebar = useSidebarStore()


const items = [
  {
    icon: "Odometer",
    index: '/project/info',
    title: "项目信息",
    permiss: "2"
  },
  {
    icon: "Odometer",
    index: '/project/list',
    title: "资产信息",
    permiss: "2"
  },
  {
    icon: "Odometer",
    index: '/project/vul_list',
    title: "漏洞信息",
    permiss: "2"
  },
  {
    icon: "Odometer",
    index: '/Tasks',
    title: "返回首页",
    permiss: "2"
  },

]

const route = useRoute()
const onRoutes = computed(() => {
  if (route.path == '/Tasks') {
    TaskStore.clear()
  }
  return route.path
})
</script>

<template>
  <div class="sidebar">
    <el-menu
        class="sidebar-el-menu"
        :default-active="onRoutes"
        :collapse="sidebar.collapse"
        text-color="#181818"
        active-text-color="#20a0ff"
        unique-opened
        router
    >
      <template v-for="(item) in items" :key="item.index">
        <el-menu-item :index="item.index" v-permiss="item.permiss">
          <el-icon>
            <component :is="item.icon"></component>
          </el-icon>
          <template #title>{{ item.title }}</template>
        </el-menu-item>
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
