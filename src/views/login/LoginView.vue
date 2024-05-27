<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useTagsStore } from '@/stores/tags'
import { usePermissStore } from '@/stores/userpermiss'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { Lock, User } from '@element-plus/icons-vue'
import UserApi from '@/api/user'

interface LoginInfo {
  username: string
  password: string
}

const router = useRouter()
const param = reactive<LoginInfo>({
  username: '',
  password: ''
})

const rules: FormRules = {
  username: [
    {
      required: true,
      message: '请输入用户名',
      trigger: 'blur'
    }
  ],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}
const permiss = usePermissStore()
const userinfo = useUserStore()
const login = ref<FormInstance>()
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid: boolean) => {
    if (valid) {
      UserApi.login(param).then((res) => {
        if (res.data.code == 200) {
          ElMessage.success('登录成功')
          const keys = permiss.defaultList[res.data.data.permissions === 1 ? 'admin' : 'user']
          console.log('keys', res.data.data.permissions === 1 ? 'admin' : 'user')
          permiss.handleSet(keys)
          userinfo.setToken(res.data.data.token)
          userinfo.setPermiss(res.data.data.permissions)
          userinfo.setRefresh(res.data.data.refresh)
          if (res.data.data.permissions === 1) {
            userinfo.setRoles('超级管理员')
          } else {
            userinfo.setRoles('普通用户')
          }
          userinfo.setUserName(res.data.data.username)
          router.push('/')
        } else {
          ElMessage.error(res.data.username)
        }
      })
    } else {
      ElMessage.error('请输入账号或密码')
      return false
    }
  })
}

const tags = useTagsStore()
tags.clearTags()
</script>

<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">iotscan管理系统</div>
      <el-form :model="param" :rules="rules" ref="login" class="ms-content">
        <el-form-item prop="username">
          <el-input v-model="param.username" placeholder="用户名">
            <template #prepend>
              <el-icon>
                <User />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="密码"
            v-model="param.password"
            @keyup.enter="submitForm(login)"
          >
            <template #prepend>
              <el-icon>
                <Lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm(login)">登录</el-button>
        </div>
      </el-form>
    </div>
    <div class="copyright">
      <span>版权所有©️zhizhuo</span>
      <span>版本：v1.0.2</span>
    </div>
  </div>
</template>

<style scoped lang="less">
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-size: 100%;
  background-image: url('@/assets/login.png');
}

.ms-title {
  width: 100%;
  line-height: 80px;
  text-align: center;
  font-size: 30px;
  color: #181818;
  border-bottom: 1px solid #181818;
}

.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 400px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}

.ms-content {
  padding: 40px 40px;
}

.login-btn {
  text-align: center;
}

.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}

.copyright {
  width: 100%;
  position: absolute;
  bottom: 30px;
  text-align: center;
}

.copyright span {
  display: inline-block;
  margin-right: 10px;
  color: #f4f4f4;
}
</style>
