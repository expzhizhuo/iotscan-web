<script setup lang="ts">
import NetworkEcharts from '@/views/echarts/NetworkEcharts.vue'
import CpuEcharts from '@/views/echarts/CpuEcharts.vue'
import { useUserStore } from '@/stores/user'
import { ChatDotRound, Goods, User } from '@element-plus/icons-vue'
import HomeApi from '@/api/home'
import UserApi from '@/api/user'
import { onBeforeMount, ref } from 'vue'
import { ElMessage } from 'element-plus'
import router from '@/router'

const userinfo = useUserStore()
const username = userinfo.getUserName()
const role: string = userinfo.getRoles()
const UserInfoData = ref({
  username: '',
  permissions: 0,
  phone: null,
  last_login: '',
  last_login_ip: ''
})
const DataList = ref({
  count: {
    task_count: {
      task_count_total: 0,
      task_count_running: 0,
      task_count_finish: 0,
      task_count_error: 0
    },
    poc_count: {
      poc_total: 0,
      poc_critical: 0,
      poc_high: 0,
      poc_middle: 0,
      poc_low: 0
    }
  },
  poc_attack_success: 0
})

onBeforeMount(() => {
  HomeApi.get_home_info().then((res) => {
    if (res.data.code == 200) {
      DataList.value = res.data.data
    } else {
      ElMessage.error(res.data.msg || '服务器异常')
      router.push('/login')
    }
  })

  UserApi.getUserInfo().then((res) => {
    if (res.data.code == 200) {
      UserInfoData.value = res.data.data
    } else {
      ElMessage.error(res.data.msg || '服务器异常')
      router.push('/login')
    }
  })
})

const round = (num: number) => {
  return Math.round(num * 10000) / 100
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
  <div>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover" class="mgb20" style="height: 252px">
          <div class="user-info">
            <el-avatar :size="120" :style="`background:${extractColorByName(username)}`"
              ><span style="font-size: 70px; font-weight: bold">{{
                username[0].toUpperCase()
              }}</span>
            </el-avatar>
            <div class="user-info-cont">
              <div class="user-info-name">{{ username || UserInfoData.username }}</div>
              <div>{{ role }}</div>
            </div>
          </div>
          <div class="user-info-list">
            当前登录时间：
            <span>{{ UserInfoData.last_login }}</span>
          </div>
          <div class="user-info-list">
            当前登录ip地址：
            <span>{{ UserInfoData.last_login_ip }}</span>
          </div>
        </el-card>
        <el-card shadow="hover" style="height: 252px">
          <template #header>
            <div class="clearfix">
              <span>POC详情</span>
            </div>
          </template>
          严重
          <el-progress
            :percentage="
              round(DataList.count.poc_count.poc_critical / DataList.count.poc_count.poc_total) || 0
            "
            color="#42b983"
            :striped="true"
          ></el-progress>
          高危
          <el-progress
            :percentage="
              round(DataList.count.poc_count.poc_high / DataList.count.poc_count.poc_total) || 0
            "
            color="#f1e05a"
            :striped="true"
          ></el-progress>
          中危
          <el-progress
            :percentage="
              round(DataList.count.poc_count.poc_middle / DataList.count.poc_count.poc_total) || 0
            "
            :striped="true"
          ></el-progress>
          低危
          <el-progress
            :percentage="
              round(DataList.count.poc_count.poc_low / DataList.count.poc_count.poc_total) || 0
            "
            color="#f56c6c"
            :striped="true"
          ></el-progress>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-row :gutter="20" class="mgb20">
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-1">
                <el-icon class="grid-con-icon">
                  <User />
                </el-icon>
                <div class="grid-cont-right">
                  <div class="grid-num">{{ DataList.count.task_count.task_count_total }}</div>
                  <div>任务数量</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-2">
                <el-icon class="grid-con-icon">
                  <ChatDotRound />
                </el-icon>
                <div class="grid-cont-right">
                  <div class="grid-num">{{ DataList.count.poc_count.poc_total }}</div>
                  <div>POC数量</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-3">
                <el-icon class="grid-con-icon">
                  <Goods />
                </el-icon>
                <div class="grid-cont-right">
                  <div class="grid-num">{{ DataList.poc_attack_success }}</div>
                  <div>漏洞数量</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <!--仪表盘子组件-->
          <el-col style="margin-top: 20px">
            <el-card shadow="hover" :body-style="{ padding: '0,20px' }">
              <NetworkEcharts></NetworkEcharts>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col>
        <el-card shadow="hover">
          <div>
            <h1>系统信息</h1>
            <div>
              <CpuEcharts></CpuEcharts>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.grid-content {
  display: flex;
  align-items: center;
  height: 100px;
}

.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #999;
}

.grid-num {
  font-size: 30px;
  font-weight: bold;
}

.grid-con-icon {
  font-size: 50px;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #fff;
}

.grid-con-1 .grid-con-icon {
  background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
  background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
  color: rgb(100, 213, 114);
}

.grid-con-3 .grid-con-icon {
  background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
  color: rgb(242, 94, 67);
}

.user-info {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;
}

.user-info-cont {
  padding-left: 50px;
  flex: 1;
  font-size: 14px;
  color: #999;
}

.user-info-cont div:first-child {
  font-size: 30px;
  color: #222;
}

.user-info-list {
  font-size: 14px;
  color: #999;
  line-height: 25px;
  margin-left: 15px;
}

.user-info-list span {
  margin-left: 10px;
}

.mgb20 {
  margin-bottom: 20px;
}
</style>
