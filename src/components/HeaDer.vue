<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { usePermissStore } from '@/stores/userpermiss'
import { ArrowDown } from '@element-plus/icons-vue'
import UserApi from '@/api/user'
import { ElMessage } from 'element-plus'

const userinfo = useUserStore()
const username: string | null = userinfo.getUserName()

const router = useRouter()
const permiss = usePermissStore()
const collapseChange = () => {
  // user.handleCollapse()
}

onMounted(() => {
  if (document.body.clientWidth < 1500) {
    collapseChange()
  }
})

const handleCommand = async (command: string) => {
  if (command == 'logout') {
    await UserApi.logout({ refresh: userinfo.getRefresh() })
    ElMessage.success('退出成功，即将跳转登陆')
    userinfo.logout()
    permiss.clear()
    localStorage.clear()
    sessionStorage.clear()
    setTimeout(() => {
      // 使用 replace 方法跳转到登录页面，避免在历史记录中留下当前页面
      router.replace('/login').then(() => {
        // 强制刷新页面，清空所有缓存信息
        window.location.reload()
      })
    }, 1000)
  } else if (command == 'resetpassword') {
    await router.push('/user/resetpassword')
  } else if (command == 'user') {
    await router.push('/user/info')
  }
}

/*根据名字提取颜色生成头像*/
const extractColorByName = (name: any) => {
  let temp = []
  temp.push('#')
  for (let index = 0; index < name.length; index++) {
    temp.push(parseInt(name[index].charCodeAt(0), 10).toString(16))
  }
  return temp.slice(0, 5).join('').slice(0, 4)
}
</script>

<template>
  <div class="header">
    <div class="logo">iotscan管理系统</div>
    <div class="header-right">
      <div class="header-user-con">
        {{ username }}
        <!--用户下拉菜单-->
        <el-dropdown class="user-name" trigger="click" @command="handleCommand">
          <!--用户头像-->
          <el-avatar
            class="user-avator"
            :size="40"
            :style="`background:${extractColorByName(username)}`"
            ><span style="font-size: 18px; font-weight: bold">{{ username[0].toUpperCase() }}</span>
          </el-avatar>
          <span class="el-dropdown-link">
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="resetpassword">重置密码</el-dropdown-item>
              <el-dropdown-item command="user">个人中心</el-dropdown-item>
              <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  color: #181818;
}

.header .logo {
  float: left;
  width: 200px;
  margin-left: 50px;
  line-height: 70px;
}

.header-right {
  float: right;
  padding-right: 50px;
}

.header-user-con {
  display: flex;
  height: 70px;
  align-items: center;
}

.user-name {
  margin-left: 10px;
}

.user-avator {
  margin-left: 20px;
}

.el-dropdown-link {
  color: #181818;
  cursor: pointer;
  display: flex;
  align-items: center;
}
</style>
