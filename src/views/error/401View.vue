<script setup lang="ts">
import {useRouter} from "vue-router";

const router = useRouter();
</script>

<template>
  <div class="error-page">
    <div class="error-code">4<span>0</span>1</div>
    <div class="error-desc">啊哦~ 你无权限访问</div>
    <div class="error-handle">
      <router-link to="/login">
        <el-button type="primary" size="large">返回登陆</el-button>
      </router-link>
      <el-button class="error-btn" type="primary" size="large" @click="router.push('/')">返回上一页</el-button>
    </div>
  </div>
</template>

<style scoped>
.error-page {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.error-code {
  line-height: 1;
  font-size: 250px;
  font-weight: bolder;
  color: #2d8cf0;
}

.error-code span {
  color: #00a854;
}

.error-desc {
  font-size: 30px;
  color: #777;
}

.error-handle {
  margin-top: 30px;
  padding-bottom: 200px;
}

.error-btn {
  margin-left: 100px;
}
</style>
