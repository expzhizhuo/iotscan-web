<script setup lang="ts">
import {onBeforeMount, onUnmounted, ref} from "vue"
import HomeApi from "@/api/home";
import {ElMessage} from "element-plus";
import router from "@/router";

const Device_Info = ref({
  "count": 0,
  "list": [{name: '', ipv4: '', ipv6: [], mac: ''}]
})
const Device_Status = ref({
  "cpu_usage": 0,
  "memory_size": 0,
  "memory_free_size": 0,
  "memory_usage": 0,
  "disk_size": 0,
  "disk_free_size": 0,
  "disk_usage": 0,
  "network_count": 0,
  "process_count": 0
})
const timerList = ref<any>([]); // 存储定时器ID的列表

onBeforeMount(() => {
  HomeApi.get_device_network().then(res => {
    if (res.data.code == 200) {
      Device_Info.value = res.data.data
    } else {
      ElMessage.error(res.data.msg || "服务器异常")
      router.push("/login")
    }
  });

  /**
   * 设备状态信息接口定时器每秒获取一次
   */
  const get_status = setInterval(() => {
    HomeApi.get_device_status().then(res => {
      if (res.data.code == 200) {
        Device_Status.value = res.data.data
      } else {
        ElMessage.error(res.data.msg || "服务器异常")
        router.push("/login")
      }
    })
  }, 1000)
  timerList.value.push(get_status)
})

// 当离开页面时清除定时器
onUnmounted(() => {
  for (const id of timerList.value) {
    clearInterval(id);
  }
})

const colors = [
  {color: "#1989fa", percentage: 20},
  {color: "#5cb87a", percentage: 40},
  {color: "#fcc000", percentage: 60},
  {color: "#fa7e19", percentage: 80},
  {color: "#ff0000", percentage: 100}
]
</script>

<template>
  <div class="status-info">
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="cpu-echarts">
          <el-progress type="dashboard" :percentage="Device_Status.cpu_usage" :color="colors" :stroke-width="12"
                       :width="150"/>
          <p class="cpu-usage-label">当前cpu使用率</p>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="memory-main">
          <h4 class="info-header">内存信息</h4>
          <p>当前使用：{{ Device_Status.memory_usage }} G</p>
          <p>空闲：{{ Device_Status.memory_free_size }} G</p>
          <p>总共：{{ Device_Status.memory_size }} G</p>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="disk-main">
          <h4 class="info-header">磁盘信息</h4>
          <p>当前使用：{{ Device_Status.disk_usage }} G</p>
          <p>空闲：{{ Device_Status.disk_free_size }} G</p>
          <p>总共：{{ Device_Status.disk_size }} G</p>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="process-main">
          <h4 class="info-header">进程信息</h4>
          <p>正在运行进程：{{ Device_Status.process_count }} 个</p>
        </div>
      </el-col>
    </el-row>
    <div class="network-main">
      <h4 class="info-header">设备网卡信息</h4>
      <div class="network-info-container">
        <div v-for="item in Device_Info.list" :key="item.name" class="network-info">
          <span>网卡：{{ item.name }}</span>
          <span v-if="item.ipv4">ipv4地址：{{ item.ipv4 }}</span>
          <span v-if="item.ipv6.length>0">
            <span v-for="(ip,index) in item.ipv6" :key="index">ipv6地址：{{ ip }}</span>
          </span>
          <span>mac地址：{{ item.mac }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.status-info {
  width: 100%;
  margin-top: 40px;
}

.cpu-echarts, .memory-main, .disk-main, .process-main {
  text-align: center;
}

.info-header {
  margin-bottom: 10px;
  font-weight: bold;
}

.network-main {
  margin-top: 40px;
}

.network-info-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.network-info {
  margin: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.network-info span {
  display: block;
  margin-bottom: 5px;
}
</style>