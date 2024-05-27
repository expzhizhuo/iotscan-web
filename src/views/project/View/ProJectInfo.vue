<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import ProjectApi from '@/api/project'
import { useTaskStore } from '@/stores/taskinfo'
import { useRoute, useRouter } from 'vue-router'
import Loading from '@/components/Common/Loading'
import { DocumentCopy } from '@element-plus/icons-vue'
import { ElLoading, ElMessage } from 'element-plus'
import useClipboard from 'vue-clipboard3'

const route = useRoute()
const router = useRouter()
const TaskStore = useTaskStore()
const { toClipboard } = useClipboard()
//获取url中的tasks_id
const task_ids = route.query.task_ids || TaskStore.getTaskIds() || ''

interface ProJectType {
  id: string
  desc: string
  host: string[]
  scanning_speed: number
  task_count: number
  finish_task_count: number
  status: number
  is_domain: boolean
  proxy_type: number
  poc_type: number
  create_time: string
  update_time: string
  create_user: {
    username: string
  }
  progress: number
  poc_count: number
}

// 数据定义
const ProJectInfo = ref<ProJectType>({
  id: '',
  desc: '',
  host: [],
  scanning_speed: 0,
  task_count: 0,
  finish_task_count: 0,
  status: 0,
  is_domain: false,
  proxy_type: 0,
  poc_type: 0,
  create_time: '',
  update_time: '',
  create_user: { username: '' },
  progress: 0,
  poc_count: 0
})

// 局部刷新方法
// const reload: any = inject('reload')

onBeforeMount(() => {
  //loading加载动画
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading...',
    background: 'rgba(0, 0, 0, 0.7)'
  })

  if (!task_ids) {
    Loading.hideLoading()
    router.replace('/404')
  }
  TaskStore.setTaskIds(String(task_ids))
  // 接口请求
  ProjectApi.get_tasks_status_details({ task_id: task_ids }).then((res) => {
    if (res.data.code == 200) {
      ProJectInfo.value = res.data.data
      loading.close()
      console.log(ProJectInfo.value)
    }
  })
})

const row_poc_type = (val: number) => {
  return (
    {
      '0': '全部',
      '1': '低危',
      '2': '中危',
      '3': '高危',
      '4': '严重',
      '5': '特定poc扫描',
      '-1': '不使用poc'
    } as Record<string, any>
  )[val]
}
const row_scanning_speed = (val: number) => {
  return (
    {
      '0': '低速',
      '1': '默认',
      '2': '高速'
    } as Record<string, any>
  )[val]
}

//扫描目标格式化
const scan_host = (val: string[]): string => val.join('\n')

// 复制事件
const ClickCopy = async (copyData: string) => {
  console.log('copyData', copyData)
  if (!copyData) {
    ElMessage.warning('请输入文本再复制')
    return
  }
  try {
    await toClipboard(copyData)
    ElMessage.success(`复制成功！`)
  } catch (error) {
    ElMessage.error(`复制失败: ${error}`)
    console.error(error)
  }
}
</script>

<template>
  <div class="project-container">
    <el-card class="project-card" shadow="hover">
      <h2 class="card-header">项目信息</h2>
      <el-descriptions border :column="1">
        <el-descriptions-item label="项目描述">{{ ProJectInfo.desc }}</el-descriptions-item>
        <el-descriptions-item label="项目创建者"
          >{{ ProJectInfo.create_user.username }}
        </el-descriptions-item>
        <el-descriptions-item label="项目创建时间"
          >{{ ProJectInfo.create_time }}
        </el-descriptions-item>
        <el-descriptions-item label="项目更新时间"
          >{{ ProJectInfo.update_time }}
        </el-descriptions-item>
        <el-descriptions-item label="总任务数量">{{ ProJectInfo.task_count }}</el-descriptions-item>
        <el-descriptions-item label="已完成任务数量"
          >{{ ProJectInfo.finish_task_count }}
        </el-descriptions-item>
        <el-descriptions-item label="任务进度">
          <el-tag type="success">{{ ProJectInfo.progress }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="项目id">{{ ProJectInfo.id }}</el-descriptions-item>
      </el-descriptions>
    </el-card>
    <el-card class="project-card" shadow="hover">
      <h2 class="card-header">项目配置</h2>
      <el-descriptions border :column="1">
        <el-descriptions-item label="是否收集子域名"
          >{{ ProJectInfo.is_domain ? '是' : '否' }}
        </el-descriptions-item>
        <el-descriptions-item label="是否使用代理"
          >{{ ProJectInfo.proxy_type ? '否' : '是' }}
        </el-descriptions-item>
        <el-descriptions-item label="是否使用POC"
          >{{ row_poc_type(ProJectInfo.poc_type) }}
        </el-descriptions-item>
        <el-descriptions-item label="使用POC数量">{{ ProJectInfo.poc_count }}</el-descriptions-item>
        <el-descriptions-item label="项目扫描速度"
          >{{ row_scanning_speed(ProJectInfo.scanning_speed) }}
        </el-descriptions-item>
        <el-descriptions-item label="扫描目标">
          <div class="scan_host">
            <el-input
              type="textarea"
              :model-value="scan_host(ProJectInfo.host)"
              :autosize="{ minRows: 6, maxRows: 10 }"
            ></el-input>
            <el-icon @click="ClickCopy(scan_host(ProJectInfo.host))" class="copy_icon_absolute">
              <DocumentCopy />
            </el-icon>
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<style scoped lang="less">
.project-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.project-card {
  border-radius: 10px;
}

.card-header {
  font-size: 20px;
  color: #333;
  margin-bottom: 10px;
}

.scan_host {
  width: 100%;
}

.scan_host {
  position: relative;
}

.scan_host:hover .copy_icon_absolute {
  display: block;
}

.copy_icon_absolute {
  display: none;
  float: right;
  position: absolute;
  right: 25px;
  top: 20px;
}
</style>
