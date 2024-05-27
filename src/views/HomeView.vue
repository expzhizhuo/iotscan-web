<script setup lang="ts">
import Header from "@/components/HeaDer.vue";
import SideBar from "@/components/SideBar.vue";
import TagsView from "@/components/TagsView.vue";

import {useTagsStore} from "@/stores/tags";
import {useUserStore} from "@/stores/user";

import {computed, reactive, watch} from 'vue'
import {useRoute} from 'vue-router';

const tags = useTagsStore();
const users = useUserStore();
const route = useRoute();

const wartermarkText = computed(() => {
  return `iotscan开发版-${users.username}`;
});
let watermark = reactive({
  text: wartermarkText.value,
  show: true, // 控制水印的显示
});
// 监听路由变化
watch(route, (newRoute) => {
  // 设置不需要水印的白名单路由
  watermark.show = newRoute.path !== '/login';
});
</script>
<template>
  <div v-if="watermark.show" v-watermark="watermark">
    <Header></Header>
    <SideBar></SideBar>
    <div class="content-box" :class="{ 'content-collapse': SideBar.collapse }">
      <TagsView></TagsView>
      <div class="content">
        <router-view v-slot="{ Component }">
          <transition name="move" mode="out-in">
            <keep-alive :include="tags.nameList">
              <component :is="Component"></component>
            </keep-alive>
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<style>

</style>
