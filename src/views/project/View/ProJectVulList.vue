<script setup lang="ts">
import TablesView from '@/components/Common/Tables/TablesView.vue'
import { inject, onBeforeMount, reactive, ref, toRefs, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { VulReport_tableColumn } from './ts/ProJectVul'
import { useRoute, useRouter } from 'vue-router'
import ProjectApi from '@/api/project'
import Loading from '@/components/Common/Loading'
import { useTaskStore } from '@/stores/taskinfo'
import ProjectVulInfoWinodws from '@/components/Project/ProjectVulInfoWinodws.vue'

const route = useRoute()
const router = useRouter()
const TaskStore = useTaskStore()
const dialogCreateTaskTable = ref(false)
const dialog_data = ref()
// 局部刷新方法
const reload: any = inject('reload')
// 绑定搜索内容
const input_search = ref()
//获取url中的tasks_id
const task_ids = route.query.task_ids || TaskStore.getTaskIds() || ''
onBeforeMount(() => {
  if (!task_ids) {
    Loading.hideLoading()
    router.replace('/404')
  }
  TaskStore.setTaskIds(String(task_ids))
})

interface State {
  options: Table.Options
}

interface VulDataType {
  id: number
  host: string
  result: {
    VerifyInfo: {
      URL: string
    }
    request: [
      {
        request: string
        response: string
      }
    ]
  }
  create_time: string
  poc_info: {
    poc_name: string
    vul_name: string
    vul_desc: string
    vul_leakLevel: number
    vul_range: string
    has_exp: boolean
    vul_vulDate: string
  }
  status: number
  vul_id: string
  iot_task_id: number
  target_id: string
}

if (route.query.search) {
  input_search.value = route.query.search
}

const params = {
  page: Number(route.query.page) || 1,
  pageSize: Number(route.query.pageSize) || 10,
  search: String(route.query.search) || ''
}
const state = reactive<State>({
  options: { showPagination: true }
})
// 基本表格数据
const tableData = ref<VulDataType[]>([])
const { options } = toRefs(state)

const handlePaginationChange = async (
  page: number,
  pageSize: number,
  search: string = params.search
) => {
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
const SearchClick = async () => {
  console.log('搜索内容', input_search.value)
  if (input_search.value) {
    await router.push({
      path: route.path,
      query: {
        page: 1,
        pageSize: 10,
        search: input_search.value
      }
    })
    reload()
  } else {
    ElMessage.error('请输入搜索内容')
    await router.push({
      path: route.path,
      query: {
        page: 1,
        pageSize: 10,
        search: ''
      }
    })
    reload()
    console.log('刷新')
  }
}

// 重置事件
const ReloadClick = async () => {
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
  console.log(val)
  ElMessageBox.confirm(`是否使用EXP进行漏洞利用？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      ElMessage.success(`EXP${val.id}利用成功`)
      reload()
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消EXP利用'
      })
      reload()
    })
}

// 查看事件
const handleViewClick = (val: any) => {
  console.log(val)
  dialog_data.value = val
  dialogCreateTaskTable.value = true
}
//接口请求函数
const get_poc_result = (
  page: number = 1,
  page_size: number = 10,
  task_id: any = '',
  task_type: number = 1,
  search: string = ''
) => {
  return ProjectApi.get_tasks_result({
    page: page,
    page_size: page_size,
    task_id: task_id,
    task_type: task_type,
    search: search
  })
}

// 初始化配置
watch(
  () => route.query,
  async (val: any) => {
    const { page, pageSize, search } = val
    params.page = Number(page) || params.page
    params.pageSize = Number(pageSize) || params.pageSize
    params.search = search || ''
    console.log('send requests', params.page, params.pageSize, params.search)
    get_poc_result(params.page, params.pageSize, task_ids, 1, params.search).then((res) => {
      tableData.value = res.data.data.list
      state.options.paginationConfig = {
        total: res.data.data.total,
        currentPage: params.page,
        pageSize: params.pageSize,
        pageSizes: [10, 20, 30, 40, 50, 100],
        layout: 'total,prev, pager, next,sizes'
      }
    })
  },
  { immediate: true }
)

const row_vul_leakLevel = (val: number) => {
  return (
    {
      '0': '提示',
      '1': '低危',
      '2': '中危',
      '3': '高危',
      '4': '严重'
    } as Record<string, any>
  )[val]
}
</script>

<template>
  <div>
    <div>
      <div class="poc_search">
        <el-input
          size="large"
          v-model="input_search"
          placeholder="请输入搜索内容"
          style="width: 300px; margin-left: 10px"
          clearable
        ></el-input>
        <el-button type="primary" size="large" round @click="SearchClick" style="margin-left: 30px"
          >搜索
        </el-button>
        <el-button type="primary" size="large" round @click="ReloadClick">重置</el-button>
      </div>
      <div>
        <TablesView
          :columns="VulReport_tableColumn"
          :table-data="tableData"
          :options="options"
          @pagination-change="handlePaginationChange"
        >
          <template #poc_info="{ row }">
            <span>{{ row.poc_info.poc_name }}</span>
          </template>
          <template #vul_desc="{ row }">
            <span>{{ row.poc_info.vul_desc }}</span>
          </template>
          <template #vul_leakLevel="{ row }">
            <span
              ><el-tag
                :type="
                  (
                    {
                      '0': '',
                      '1': 'success',
                      '2': 'warning',
                      '3': 'danger',
                      '4': 'danger'
                    } as Record<string, any>
                  )[row.poc_info.vul_leakLevel]
                "
                >{{ row_vul_leakLevel(row.poc_info.vul_leakLevel) }}</el-tag
              ></span
            >
          </template>
          <template #vul_name="{ row }">
            <span>{{ row.poc_info.vul_name }}</span>
          </template>
          <template #vul_range="{ row }">
            <span>{{ row.poc_info.vul_range }}</span>
          </template>
          <template #has_exp="{ row }">
            <span>
              <el-tag
                :type="
                  ({ false: 'info', true: 'success' } as Record<string, any>)[row.poc_info.has_exp]
                "
                >{{ row.poc_info.has_exp ? '有' : '无' }}</el-tag
              >
            </span>
          </template>
          <template #vul_vulDate="{ row }">
            <span>{{ row.poc_info.vul_vulDate }}</span>
          </template>
          <!-- 如果不传入按钮组的数据就使用自定义插槽的方式， 自定义插槽需在配置项里配置slot -->
          <template #action="{ row }">
            <div>
              <el-button type="primary" @click="handleViewClick(row)">查看</el-button>
              <el-button v-if="row.poc_info.has_exp" type="danger" @click="handleDelete(row)"
                >利用
              </el-button>
            </div>
          </template>
        </TablesView>
      </div>
    </div>
    <div>
      <el-dialog v-model="dialogCreateTaskTable" draggable overflow width="60%">
        <template #header>
          <span class="dialog-header">漏洞详情</span>
        </template>
        <ProjectVulInfoWinodws
          :dialog="dialogCreateTaskTable"
          :data="dialog_data"
        ></ProjectVulInfoWinodws>
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

.dialog-header {
  margin-left: 30px;
  font-weight: bold;
  font-size: 28px;
}
</style>
