<script setup lang="ts">
import UserApi from '@/api/user'
import { inject, onBeforeMount, ref } from 'vue'
import { ElMessage } from 'element-plus'

const reload: any = inject('reload')

interface UserInfoType {
  id: string
  username: string
  permissions: number | string
  email: string
  phone: string | number
  api_key: string
  last_login: string
  create_time: string
  last_login_ip: string | null
}

const UserInfo = ref<Partial<UserInfoType>>({})

const RefreshApiKey = () => {
  UserApi.rest_api_key().then((res) => {
    if (res.data.code == 200) {
      ElMessage.success('重置成功')
      reload()
    } else {
      ElMessage.success('重置失败')
      reload()
    }
  })
}

const get_userinfo = () => {
  return UserApi.getUserInfo()
}

onBeforeMount(() => {
  /*获取用户信息*/
  get_userinfo().then((res) => {
    if (res.data.code == 200) {
      UserInfo.value = res.data.data
    } else {
      ElMessage.error('服务器异常')
    }
  })
})
</script>

<template>
  <div class="userinfo-main">
    <div class="userinfo-title">
      <span>个人中心</span>
    </div>
    <div class="userinfo-body">
      <el-row :gutter="20">
        <el-card shadow="hover">
          <div class="userinfo-username">
            <span
              >用户名：<el-tag type="success" size="large">{{ UserInfo.username }}</el-tag></span
            >
          </div>
          <el-divider></el-divider>
          <div class="dashboard-info">
            <el-descriptions border :column="1">
              <el-descriptions-item label="用户邮箱">{{ UserInfo.email }}</el-descriptions-item>
              <el-descriptions-item label="用户手机号"
                >{{ UserInfo.phone == null ? '当前用户未绑定手机号' : UserInfo.phone }}
              </el-descriptions-item>
              <el-descriptions-item label="用户权限"
                >{{ UserInfo.permissions === 1 ? '管理员' : '普通用户' }}
              </el-descriptions-item>
              <el-descriptions-item label="用户注册时间"
                >{{ UserInfo.create_time }}
              </el-descriptions-item>
              <el-descriptions-item label="用户上次登陆时间"
                >{{ UserInfo.last_login }}
              </el-descriptions-item>
              <el-descriptions-item label="用户上次登陆ip"
                >{{ UserInfo.last_login_ip == null ? '来自火星的ip登陆' : UserInfo.last_login_ip }}
              </el-descriptions-item>
            </el-descriptions>
          </div>
          <el-divider></el-divider>
          <div class="dashboard-api-key">
            <span style="font-weight: bold"> API KEY： </span>
            <span style="width: 60%; margin-left: 10px">
              <el-input
                v-model="UserInfo.api_key"
                readonly
                suffix-icon="el-icon-key"
                placeholder="API KEY"
              ></el-input>
            </span>
            <span style="margin-left: 20px"
              ><el-button type="primary" @click="RefreshApiKey">重置</el-button></span
            >
          </div>
          <div class="dashboard-api-key-desc">
            <span>*此API KEY可以获取当前用户创建的所有项目资产也可以查询指定项目资产</span>
          </div>
        </el-card>
      </el-row>
    </div>
  </div>
</template>

<style scoped lang="less">
.userinfo-main {
  width: 100%;
}

.userinfo-title {
  margin-top: 10px;
  font-weight: bold;
  font-size: 36px;
}

.userinfo-body {
  width: 100%;
  margin-top: 30px;
}

.userinfo-body .el-card {
  width: 92%;
}

.userinfo-username {
  font-weight: bold;
  font-size: 22px;
}

.userinfo-body span .el-tag {
  font-size: 22px;
}

.userinfo-body,
.dashboard-info {
  width: 100%;
}

.dashboard-api-key {
  margin-left: 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.dashboard-api-key-desc {
  font-size: 12px;
  margin-left: 120px;
  margin-top: 8px;
  color: red;
}
</style>
