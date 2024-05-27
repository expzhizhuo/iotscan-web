<script setup lang="ts">
import SideBar from "@/components/Project/SideBar.vue";
import {useTagsStore} from "@/stores/tags";
import {computed, reactive} from "vue";
import {useUserStore} from "@/stores/user";

const users = useUserStore();
const tags = useTagsStore();
const wartermarkText = computed(() => {
  return `iotscan开发版-${users.username}`;
});
let watermark = reactive({
  text: wartermarkText.value,
})
</script>

<template>
  <div v-watermark="watermark">
    <h1 style="margin-left: 2%;margin-top: 20px">资产信息</h1>
    <SideBar></SideBar>
    <div class="content-box" :class="{ 'content-collapse': SideBar.collapse }">
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

<style scoped>

</style>