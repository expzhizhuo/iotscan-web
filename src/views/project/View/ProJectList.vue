<script setup lang="ts">
import ProjectList from '@/components/Project/ProjectList.vue'
import { inject, nextTick, onBeforeMount, onMounted, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'
import router from '@/router'
import Loading from '@/components/Common/Loading'
import { useTaskStore } from '@/stores/taskinfo'
import ProjectApi from '@/api/project'
import { Base64 } from 'js-base64'
import { Check, Close } from '@element-plus/icons-vue'

const TaskStore = useTaskStore()
const route = useRoute()
const dialogHelpView = ref(false)

//数据类型定义

interface StatisticsType {
  cms: [
    {
      cms: string
      count: number
    }
  ]
  status: [
    {
      status_code: string
      count: number
    }
  ]
  scheme: [
    {
      scheme: string
      count: number
    }
  ]
  title: [
    {
      title: string
      count: number
    }
  ]
  port: [
    {
      port: number
      count: number
    }
  ]
  port_service: [
    {
      port_service: number
      count: number
    }
  ]
}

// 局部刷新方法引用
const reload: any = inject('reload')
const input_search = ref()
//获取url中的tasks_id
const task_ids = route.query.task_ids || TaskStore.getTaskIds() || ''
const TableData = ref([])
const HelpData = reactive([
  {
    query: 'ip',
    example: 'ip="1.1.1.1"',
    desc: '通过单一IPv4/IPV6地址进行查询',
    is_like: false,
    is_and: true,
    is_not: true
  },
  {
    query: 'host',
    example: 'host="baidu.com"',
    desc: '通过主机IP地址/域名地址进行查询',
    is_like: false,
    is_and: true,
    is_not: true
  },
  {
    query: 'port',
    example: 'port="6379"',
    desc: '通过端口号进行查询',
    is_like: true,
    is_and: true,
    is_not: true
  },
  {
    query: 'server',
    example: 'server="Microsoft-IIS/10"',
    desc: '通过服务器进行查询',
    is_like: true,
    is_and: true,
    is_not: true
  },
  {
    query: 'title',
    example: 'title="beijing"',
    desc: '通过网站标题进行查询',
    is_like: true,
    is_and: true,
    is_not: true
  },
  {
    query: 'header',
    example: 'header="zhizhuo"',
    desc: '通过响应标头进行查询',
    is_like: true,
    is_and: false,
    is_not: true
  },
  {
    query: 'icon_hash',
    example: 'icon_hash="-247388890"',
    desc: '通过网站图标的hash值进行查询',
    is_like: true,
    is_and: true,
    is_not: true
  },
  {
    query: 'status_code',
    example: 'status_code="200"',
    desc: '筛选服务状态为200的服务（网站）资产',
    is_like: true,
    is_and: true,
    is_not: true
  },
  {
    query: 'country',
    example: 'country="中国"',
    desc: '通过国家中文名称进行查询',
    is_like: true,
    is_and: true,
    is_not: true
  },
  {
    query: 'region',
    example: 'region="浙江"',
    desc: '通过省份/地区中文名称进行查询（仅支持中国地区）',
    is_like: true,
    is_and: true,
    is_not: true
  },
  {
    query: 'city',
    example: 'city="杭州"',
    desc: '通过城市中文名称进行查询',
    is_like: true,
    is_and: true,
    is_not: true
  },
  {
    query: 'cert',
    example: 'cert="baidu"',
    desc: '通过证书/持有者/颁发者/组织/持有者的通用名进行查询',
    is_like: true,
    is_and: false,
    is_not: true
  },
  {
    query: 'icp',
    example: 'icp="京ICP证030173号"',
    desc: 'icp="通过ICP备案号进行查询"',
    is_like: true,
    is_and: true,
    is_not: true
  },
  {
    query: 'scan_type',
    example: 'scan_type="tcp"',
    desc: '通过扫描类型进行查询仅支持（tcp/udp）',
    is_like: true,
    is_and: true,
    is_not: true
  },
  {
    query: 'redirect_num',
    example: 'redirect_num="2"',
    desc: '通过站点重定向次数进行查询',
    is_like: true,
    is_and: true,
    is_not: true
  },
  {
    query: 'port_service',
    example: 'port_service="ssh"',
    desc: '通过端口服务协议进行查询',
    is_like: true,
    is_and: true,
    is_not: true
  },
  {
    query: 'scheme',
    example: 'scheme="http"',
    desc: '通过通信协议进行查询',
    is_like: true,
    is_and: true,
    is_not: true
  },
  {
    query: 'cms',
    example: 'cms="spring boot"',
    desc: '通过指纹类型进行查询',
    is_like: true,
    is_and: true,
    is_not: true
  },
  {
    query: 'is_cdn',
    example: 'is_cdn=true',
    desc: '通过是否是cdn资产进行查询',
    is_like: true,
    is_and: true,
    is_not: true
  }
])
const Top_Data = ref<StatisticsType | any>({})
const PageRenderingTime = ref<number | string>(0)
if (route.query.search) {
  input_search.value = Base64.decode(String(route.query.search))
}
const params = {
  page: Number(route.query.page) || 1,
  pageSize: Number(route.query.pageSize) || 10,
  search: String(route.query.search) || ''
}
// 分页配置
const pageConfig = reactive({
  currentPage: params.page,
  pageSize: params.pageSize,
  total: 0,
  pageSizes: [10, 50, 100, 1000],
  disabled: false,
  small: false,
  background: true
})
onBeforeMount(() => {
  if (!task_ids) {
    Loading.hideLoading()
    router.replace('/404')
  }
  TaskStore.setTaskIds(String(task_ids))
})

const SearchClick = async () => {
  if (input_search.value) {
    console.log('搜索内容', input_search.value)
    await router.push({
      path: route.path,
      query: {
        page: 1,
        pageSize: 10,
        search: Base64.encode(String(input_search.value))
      }
    })
    reload()
  } else {
    await router.push({
      path: route.path,
      query: {
        page: 1,
        pageSize: 10
      }
    })
    ElMessage.error('请输入搜索内容')
    reload()
    console.log('刷新')
  }
}
const ExportClick = () => {
  console.log('导出资产', task_ids)
  if (task_ids) {
    ProjectApi.export_result({ task_ids: task_ids })
      .then((res) => {
        if (res.status == 200) {
          ElMessage.success('导出成功')
          const contentDisposition = res.headers['content-disposition'] || ''
          const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition)
          let fileName =
            matches && matches.length > 1
              ? decodeURIComponent(matches[1].replace(/['"]/g, ''))
              : 'exported_file'
          let blob = new Blob([res.data], { type: res.headers['content-type'] })
          let downloadElement = document.createElement('a')
          let href = window.URL.createObjectURL(blob) // Create download link
          downloadElement.href = href
          downloadElement.download = fileName // Set the download file name
          document.body.appendChild(downloadElement)
          downloadElement.click() // Trigger download
          document.body.removeChild(downloadElement) // Remove element after download
          window.URL.revokeObjectURL(href) // Release blob object
        } else {
          ElMessage.error('导出失败，请稍后重试')
        }
      })
      .catch((error) => {
        console.error('导出过程中发生错误', error)
        ElMessage.error('导出异常，请联系管理员')
      })
  } else {
    ElMessage.error('异常路由信息')
  }
}

const ReloadClick = async () => {
  await router.push({
    path: route.path,
    query: {
      page: 1,
      pageSize: 10
    }
  })
  reload()
}

const ShowHelp = () => {
  dialogHelpView.value = true
}

const get_project_list = (page: number = 1, page_size: number = 10, tasks_id: any = task_ids) => {
  /**
   * 获取项目资产扫描结果
   */
  return ProjectApi.get_project_list({ page: page, page_size: page_size, tasks_id: tasks_id })
}
const get_project_statistics = (task_id: any = task_ids, search: string = params.search) => {
  /**
   * 获取项目资产统计聚合数据
   */
  return ProjectApi.get_tasks_statistics({ task_ids: task_id, search: search })
}
const get_tasks_search = (
  task_id: any = task_ids,
  query: string,
  page: number = 1,
  pageSize: number = 10
) => {
  /**
   * 获取项目资产搜索数据
   */
  return ProjectApi.get_tasks_search({
    task_ids: task_id,
    query: query,
    page: page,
    page_size: pageSize
  })
}
const handlePaginationChange = async (
  page: number,
  pageSize: number,
  search: string = params.search
) => {
  console.log('翻页', page, pageSize)
  startTime = performance.now()
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
//用于计算页面渲染时间
let startTime: any
let endTime: any

onBeforeMount(() => {
  // 组件挂载前记录时间
  startTime = performance.now()
})

onMounted(() => {
  nextTick(() => {
    // 组件更新后记录时间,等待DOM更新完成后执行函数
    endTime = performance.now()
    PageRenderingTime.value = (endTime - startTime).toFixed(2)
  })
})

watch(
  () => route.query,
  async (val: any) => {
    const { task_ids, search, page, pageSize } = val
    params.page = Number(page) || params.page
    params.pageSize = Number(pageSize) || params.pageSize
    params.search = search || ''
    //判断是否有search扫做
    if (params.search) {
      console.log('search', params.search)
      get_tasks_search(task_ids, params.search, params.page, params.pageSize).then((res) => {
        if (res.data.code == 200) {
          TableData.value = res.data.data.list
          pageConfig.total = res.data.data.total
        } else {
          ElMessage.error(res.data.data || res.data.msg || '服务器异常')
          router.push('/login')
        }
      })
    } else {
      console.log('---->默认')
      console.log('页面', page, params)
      get_project_list(params.page, params.pageSize, task_ids).then((res) => {
        if (res.data.code == 200) {
          TableData.value = res.data.data.list
          pageConfig.total = res.data.data.total
        } else {
          ElMessage.error(res.data.data || '服务器异常')
          router.push('/login')
        }
      })
    }
    //获取统计信息
    get_project_statistics(task_ids, params.search).then((res) => {
      if (res.data.code == 200) {
        Top_Data.value = res.data.data
      }
    })
  },
  { immediate: true }
)
</script>

<template>
  <div>
    <div class="project_search">
      <el-input
        size="large"
        v-model="input_search"
        placeholder="请输入搜索内容"
        class="input_search"
        clearable
      ></el-input>
      <el-button size="large" round type="primary" @click="SearchClick" class="button_search"
        >搜索
      </el-button>
      <el-button size="large" round type="primary" @click="ExportClick" class="button_export"
        >导出资产
      </el-button>
      <el-button size="large" round type="primary" @click="ReloadClick" class="button_reload"
        >刷新页面
      </el-button>
      <el-button size="large" round @click="ShowHelp">查询语法</el-button>
    </div>
    <div class="project-main">
      <div class="project-list-container">
        <ProjectList
          :TableData="TableData"
          :pageConfig="pageConfig"
          :PageRenderingTime="PageRenderingTime"
          @pagination-change="handlePaginationChange"
        ></ProjectList>
      </div>
      <div class="form-box-card">
        <el-row>
          <el-col>
            <el-card class="card">
              <template #header>
                <span class="card-title">端口</span>
              </template>
              <div v-for="item in Top_Data.port" :key="item.status" class="card-content">
                <span class="status">{{ item.port }}</span>
                <span class="number">{{ item.count }}</span>
              </div>
            </el-card>
            <el-card class="card card-margin-top">
              <template #header>
                <span class="card-title">网站标题</span>
              </template>
              <div v-for="item in Top_Data.title" :key="item.title" class="card-content">
                <span class="status">{{ item.title }}</span>
                <span class="number">{{ item.count }}</span>
              </div>
            </el-card>
            <el-card class="card card-margin-top">
              <template #header>
                <span class="card-title">网站指纹</span>
              </template>
              <div v-for="item in Top_Data.cms" :key="item.cms" class="card-content">
                <span class="status">{{ item.cms }}</span>
                <span class="number">{{ item.count }}</span>
              </div>
            </el-card>
            <el-card class="card card-margin-top">
              <template #header>
                <span class="card-title">端口服务协议</span>
              </template>
              <div
                v-for="item in Top_Data.port_service"
                :key="item.port_service"
                class="card-content"
              >
                <span class="status">{{ item.port_service }}</span>
                <span class="number">{{ item.count }}</span>
              </div>
            </el-card>
            <el-card class="card card-margin-top">
              <template #header>
                <span class="card-title">网站状态码</span>
              </template>
              <div v-for="item in Top_Data.status" :key="item.status_code" class="card-content">
                <span class="status">{{ item.status_code }}</span>
                <span class="number">{{ item.count }}</span>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
    <div>
      <el-dialog v-model="dialogHelpView" title="查询语法参考" width="800">
        <div class="help-description">
          <p>= : 匹配，=""时，可查询不存在字段或者值为空的情况，相当于模糊搜索。</p>
          <p>== : 完全匹配，==""时，可查询存在且值为空的情况，相当于精准搜索。</p>
          <p>!= : 不匹配，!=""时，可查询值不为空的情况，相当于模糊条件不等于搜索。</p>
          <p>&& : 逻辑条件与。</p>
          <p>|| : 逻辑条件或。</p>
        </div>
        <el-table :data="HelpData">
          <el-table-column property="query" label="语法" width="80" />
          <el-table-column property="example" label="例句" width="210" />
          <el-table-column property="desc" label="用途说明" />
          <el-table-column label="=" width="60">
            <template #default="scope">
              <span v-if="scope.row.is_like">
                <el-icon><Check /></el-icon>
              </span>
              <span v-else>
                <el-icon><Close /></el-icon
              ></span>
            </template>
          </el-table-column>
          <el-table-column label="==" width="60">
            <template #default="scope">
              <span v-if="scope.row.is_and">
                <el-icon><Check /></el-icon>
              </span>
              <span v-else>
                <el-icon><Close /></el-icon
              ></span>
            </template>
          </el-table-column>
          <el-table-column label="!=" width="60">
            <template #default="scope">
              <span v-if="scope.row.is_not">
                <el-icon><Check /></el-icon>
              </span>
              <span v-else>
                <el-icon><Close /></el-icon
              ></span>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </div>
  </div>
</template>

<style scoped lang="less">
.project_search {
  margin-top: 10px;
}

.input_search {
  width: 500px;
  margin-right: 15px;
  margin-left: 5px;
}

.button_search,
.button_export,
.button_reload {
  margin-left: 10px;
}

.project-main {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

.project-list-container {
  width: 76%;
}

.form-box-card {
  margin-top: 38px;
  margin-right: 25px;
  width: 20%;
}

.card {
  text-align: center;
}

.card-title {
  font-size: 18px;
  font-weight: bold;
}

.card-margin-top {
  margin-top: 1rem;
}

.card-content {
  display: flex;
  justify-content: space-between;
}

.status {
  margin-left: 0.8rem;
}

.number {
  font-weight: bold;
  margin-right: 0.8rem;
}

.help-description {
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: bold;
  margin-left: 15px;
}
</style>
