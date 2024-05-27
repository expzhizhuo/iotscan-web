<script setup lang="ts">
import TablesView from '@/components/Common/Tables/TablesView.vue'
import { Tasks_tableColumn } from './ts/Tasks'
import { inject, onUnmounted, reactive, ref, toRefs, watch } from 'vue'
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import TasksApi from '@/api/tasks'
import CreateTasksWindows from '@/components/Tasks/CreateTasksWindows.vue'
import { Message } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
//自动刷新事件
const auto_reload = ref(false)
// 局部刷新方法
const reload: any = inject('reload')
// 绑定搜索内容
const input_search = ref()
const timerList = ref<any>([]) // 存储定时器ID的列表
const dialogCreateTaskTable = ref(false)
if (route.query.search) {
  input_search.value = route.query.search
}
const params = {
  page: Number(route.query.page) || 1,
  pageSize: Number(route.query.pageSize) || 10,
  search: String(route.query.search) || ''
}

interface State {
  options: Table.Options
}

interface TableDataType {
  id: string
  desc: string
  status: number
  poc_type: number
  scanning_speed: number
  task_count: number
  finish_task_count: number
  progress: number
  create_time: string
  create_user: {
    id: string
    username: string
  }
}

const state = reactive<State>({
  options: { showPagination: true }
})
// 基本表格数据
const tableData = ref<TableDataType[]>([])
const { options } = toRefs(state)

const handlePaginationChange = async (
  page: number,
  pageSize: number,
  search: string = params.search
) => {
  console.log('翻页', page, pageSize, search)
  await router.push({
    path: route.path,
    query: {
      page,
      pageSize,
      search
    }
  })
  reload()
}
// 搜索事件
const SearchClick = () => {
  console.log('搜索内容', input_search.value)
  if (input_search.value) {
    router.push({
      path: route.path,
      query: {
        page: 1,
        pageSize: 10,
        search: input_search.value
      }
    })
  } else {
    ElMessage.error('请输入搜索内容')
    reload()
    console.log('刷新')
  }
}
// 停止事件
const handleStop = (val: any) => {
  console.log('delete 任务', val.id)
  ElMessageBox.confirm(`是否停止此任务？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      const loading = ElLoading.service({
        lock: true,
        text: `正在停止${val.desc}任务，请忽刷新或关闭页面，请耐心等待。`,
        background: 'rgba(0, 0, 0, 0.7)'
      })
      TasksApi.setting_tasks({ task_ids: val.id, task_status: 2 }).then((res) => {
        if (res.data.code == 200) {
          ElMessage.success(`停止任务${val.id}成功`)
        } else {
          ElMessage.error(`停止任务${val.id}失败`)
        }
        loading.close()
        reload()
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消操作'
      })
      reload()
    })
}

// 重置事件
const ReloadClick = async () => {
  input_search.value = ''
  await router.push({
    path: route.path,
    query: {
      page: 1,
      pageSize: 10,
      search: ''
    }
  })
  reload()
}

// 删除事件
const handleDelete = (val: any) => {
  console.log('delete 任务', val.id)
  ElMessageBox.confirm(`是否删除此任务？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      if (val.status == 1 || val.status == 0) {
        ElMessage.error('请停止任务后在删除此任务')
        return
      }
      const loading = ElLoading.service({
        lock: true,
        text: `正在删除${val.desc}任务，请忽刷新或关闭页面，请耐心等待。`,
        background: 'rgba(0, 0, 0, 0.7)'
      })
      TasksApi.delete_tasks({ tasks_id: val.id }).then((res) => {
        if (res.data.code == 200) {
          ElMessage.success(`删除任务${val.id}成功`)
        } else {
          ElMessage.error(`删除任务${val.id}失败`)
        }
        loading.close()
        reload()
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除'
      })
      reload()
    })
}

// 查看事件
const handleViewClick = (val: any) => {
  router.push({
    path: '/project/info',
    query: {
      task_ids: val.id
    }
  })
}
// 创建任务
const CreateTaskClick = () => {
  console.log('打开创建任务页面')
  dialogCreateTaskTable.value = true
}
//dialog回掉事件
const handleAdd = (val: boolean) => {
  console.log('收到子组件传送参数', val)
  dialogCreateTaskTable.value = val
  if (!val) {
    reload()
  }
}
const get_tasks_list = (page: number = 1, pageSize: number = 10, search: string = '') => {
  /**
   * 获取任务列表数据
   */
  return TasksApi.get_tasks_list({ page: page, page_size: pageSize, search: search })
}

watch(
  () => route.query,
  async (val: any) => {
    const { page, pageSize, search } = val
    params.page = Number(page) || params.page
    params.pageSize = Number(pageSize) || params.pageSize
    params.search = search || ''
    console.log('send requests', params.page, params.pageSize)
    get_tasks_list(params.page, params.pageSize, params.search).then((res) => {
      tableData.value = res.data.data.list
      state.options.paginationConfig = {
        total: res.data.data.total,
        currentPage: params.page,
        pageSize: params.pageSize,
        pageSizes: [10, 50, 100, 1000],
        layout: 'total,prev, pager, next,sizes'
      }
    })
  },
  { immediate: true }
)

// 自动刷新页面
const Auto_Reload = () => {
  if (auto_reload.value) {
    console.log('开启自动刷新')
    // 接口数据请求定时器
    const get_status = setInterval(() => {
      get_tasks_list().then((res) => {
        if (res.data.code == 200) {
          tableData.value = res.data.data.list
          state.options.paginationConfig = {
            total: res.data.data.total,
            currentPage: (params.page = 1),
            pageSize: (params.pageSize = 10),
            pageSizes: [10, 50, 100, 1000],
            layout: 'total,prev, pager, next,sizes'
          }
        } else {
          ElMessage.error(res.data.msg || '服务器异常')
          router.push('/login')
        }
      })
    }, 3000)
    timerList.value.push(get_status)
  } else {
    for (const id of timerList.value) {
      clearInterval(id)
    }
  }
}

// 当离开页面时清除定时器
onUnmounted(() => {
  for (const id of timerList.value) {
    clearInterval(id)
  }
})
const row_status = (val: number) => {
  return (
    {
      '-1': '停止',
      '0': '初始化',
      '1': '运行中',
      '2': '完成',
      '3': '删除',
      '4': '失败',
      '5': '未知错误'
    } as Record<string, any>
  )[val]
}
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
</script>

<template>
  <div>
    <div>
      <div class="poc_search">
        <el-input
          v-model="input_search"
          placeholder="请输入搜索内容"
          style="width: 300px; margin-left: 10px"
          clearable
        ></el-input>
        <el-button size="large" round type="primary" @click="SearchClick" style="margin-left: 30px"
          >搜索
        </el-button>
        <el-button size="large" round type="primary" @click="ReloadClick">重置</el-button>
        <el-button size="large" round type="primary" @click="CreateTaskClick">创建任务</el-button>
        <div style="margin-left: auto; margin-right: 30px">
          <span>
            开启自动刷新
            <el-switch v-model="auto_reload" size="large" @click="Auto_Reload"></el-switch>
          </span>
          <span style="font-size: 10px; margin-top: 12px; margin-left: 10px"> 每3秒刷新一次 </span>
        </div>
      </div>
      <div>
        <TablesView
          :columns="Tasks_tableColumn"
          :table-data="tableData"
          :options="options"
          @pagination-change="handlePaginationChange"
        >
          <template #status="{ row }">
            <span>
              <el-tag
                :type="
                  (
                    {
                      '-1': 'danger',
                      '0': 'info',
                      '1': '',
                      '2': 'success',
                      '3': 'danger',
                      '4': 'danger',
                      '5': 'warning'
                    } as Record<string, any>
                  )[row.status]
                "
                >{{ row_status(row.status) }}</el-tag
              >
            </span>
          </template>
          <template #poc_type="{ row }">
            <span>
              <el-tag
                :type="
                  (
                    {
                      '0': '',
                      '1': 'success',
                      '2': 'warning',
                      '3': 'danger',
                      '4': 'danger',
                      '5': 'info',
                      '-1': 'danger'
                    } as Record<string, any>
                  )[row.poc_type]
                "
                >{{ row_poc_type(row.poc_type) }}</el-tag
              >
            </span>
          </template>
          <template #scanning_speed="{ row }">
            <span>
              <el-tag
                :type="
                  ({ '0': '', '1': 'info', '2': 'danger' } as Record<string, any>)[
                    row.scanning_speed
                  ]
                "
                >{{ row_scanning_speed(row.scanning_speed) }}</el-tag
              >
            </span>
          </template>
          <template #progress="{ row }">
            <span>
              <el-progress type="circle" :percentage="row.progress" :width="40" :stroke-width="2">
                <span class="percentage-value">{{ row.progress }}%</span>
              </el-progress>
            </span>
          </template>
          <template #create_user="{ row }">
            <span>{{ row.create_user.username }}</span>
          </template>

          <!-- 如果不传入按钮组的数据就使用自定义插槽的方式， 自定义插槽需在配置项里配置slot -->
          <template #action="{ row }">
            <div>
              <el-button @click="handleStop(row)">停止</el-button>
              <el-button type="danger" @click="handleDelete(row)">删除</el-button>
              <el-button type="primary" @click="handleViewClick(row)">查看</el-button>
            </div>
          </template>
        </TablesView>
      </div>
    </div>
    <div>
      <el-dialog v-model="dialogCreateTaskTable" title="创建扫描任务">
        <CreateTasksWindows :dialog="dialogCreateTaskTable" @add="handleAdd"></CreateTasksWindows>
      </el-dialog>
    </div>
  </div>
</template>

<style scoped>
.poc_search {
  display: flex;
  margin-bottom: 20px;
  margin-top: 10px;
}

.percentage-value {
  display: block;
  margin-right: 6px;
  font-size: 10px;
}
</style>
