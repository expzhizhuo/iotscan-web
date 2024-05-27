<script setup lang="ts">
import {ElConfigProvider} from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import {ref, nextTick, provide,} from "vue";//要引入方法
// 局部组件刷新
const isRouterAlive = ref(true);
const reload = () => {
  isRouterAlive.value = false;
  nextTick(() => {
    isRouterAlive.value = true;
  });
};
provide("reload", reload);
</script>

<template>
  <el-config-provider :locale="zhCn">
    <RouterView v-if="isRouterAlive"/>
  </el-config-provider>

</template>

<style scoped>
</style>
