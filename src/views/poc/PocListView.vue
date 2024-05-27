<script setup lang="ts">
import TablesView from '@/components/Common/Tables/TablesView.vue'
import { PocList_tableColumn } from './ts/PocList'
import { inject, reactive, ref, toRefs, watch } from 'vue'
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import PocApi from '@/api/poc'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
// 局部刷新方法
const reload: any = inject('reload')
// 绑定搜索内容
const input_search = ref()
const userinfo = useUserStore()
// 用户权限
const permiss = ref(false)
if (userinfo.getPermiss() == '1') {
  permiss.value = true
}
if (route.query.search) {
  input_search.value = route.query.search
}
const params = {
  page: Number(route.query.page) || 1,
  pageSize: Number(route.query.pageSize) || 10,
  search: String(route.query.search) || ''
}

interface State {
  tableDemoList: []
  options: Table.Options
}

const state = reactive<State>({
  tableDemoList: [],
  options: { showPagination: true }
})

const { options } = toRefs(state)

interface PocData {
  phone: number
  username: string
  permiss: number
  create_time: string
  address: string
  has_exp: boolean
}

// 基本表格数据
const tableData = ref([])
const handleAction = (command: Table.Command, row: PocData, index: number) => {
  switch (command) {
    case 'edit':
      alert('点击了编辑')
      break
    case 'delete':
      console.log('row', row)
      console.log('index', index)
      ElMessageBox.confirm('确认删除吗？', '提示')
        .then(() => {
          ElMessage(JSON.stringify(row))
        })
        .catch(() => null)
      break
    default:
      break
  }
}
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
// 初始化POC列表
const PocInitClick = () => {
  const loading = ElLoading.service({
    lock: true,
    text: '正在初始化POC信息，请忽刷新或关闭页面，请耐心等待。',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  get_poc_init().then((res) => {
    loading.close()
    if (res.data.code == 200) {
      ElMessage.success(res.data.data.info)
      reload()
    } else {
      ElMessage.error(res.data.msg || '服务器异常')
      router.push('/login')
    }
  })
}

// 删除事件
const handleDelete = (val: any) => {
  console.log(val)
  ElMessageBox.confirm(`是否删除此POC？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      PocApi.delete_poc({ poc_id: val.id }).then((res) => {
        if (res.data.code == 200) {
          ElMessage.success(`删除POC${val.poc_name}成功`)
          reload()
        } else {
          ElMessage.error(`删除POC${val.poc_name}失败`)
          reload()
        }
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
  console.log(val)
  ElMessage.success(`查看POC${val.id}内容`)
}

const get_poc_list = (page: number = 1, pageSize: number = 10, id: string = '') => {
  return PocApi.get_poc_list({ id: id, page: page, page_size: pageSize })
}
const get_poc_list_search = (page: number = 1, pageSize: number = 10, keyword: string = '') => {
  return PocApi.get_poc_list_search({ keyword: keyword, page: page, page_size: pageSize })
}
const get_poc_init = () => {
  return PocApi.get_poc_init()
}
watch(
  () => route.query,
  async (val: any) => {
    const { page, pageSize, search } = val
    params.page = Number(page) || params.page
    params.pageSize = Number(pageSize) || params.pageSize
    params.search = search || ''
    console.log('send requests', params.page, params.pageSize)
    if (params.search) {
      get_poc_list_search(params.page, params.pageSize, params.search).then((res) => {
        tableData.value = res.data.data.list
        state.options.paginationConfig = {
          total: res.data.data.total,
          currentPage: params.page,
          pageSize: params.pageSize,
          pageSizes: [10, 50, 100],
          layout: 'total,prev, pager, next,sizes'
        }
      })
    } else {
      get_poc_list(params.page, params.pageSize, params.search).then((res) => {
        tableData.value = res.data.data.list
        state.options.paginationConfig = {
          total: res.data.data.total,
          currentPage: params.page,
          pageSize: params.pageSize,
          pageSizes: [10, 50, 100],
          layout: 'total,prev, pager, next,sizes'
        }
      })
    }
  },
  { immediate: true }
)

const row_vul_leakLevel = (val: string) => {
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
          v-model="input_search"
          placeholder="请输入搜索内容"
          style="width: 300px; margin-left: 10px"
          clearable
        ></el-input>
        <el-button type="primary" @click="SearchClick" style="margin-left: 30px">搜索</el-button>
        <el-button type="primary" @click="ReloadClick">重置</el-button>
        <el-button v-if="permiss" type="primary" @click="PocInitClick">初始化poc</el-button>
      </div>
      <div>
        <TablesView
          :columns="PocList_tableColumn"
          :table-data="tableData"
          :options="options"
          @pagination-change="handlePaginationChange"
          @command="handleAction"
        >
          <template #vul_leakLevel="{ row }">
            <span>
              <el-tag
                :type="
                  (
                    {
                      '0': '',
                      '1': 'success',
                      '2': 'warning',
                      '3': 'danger',
                      '4': 'danger'
                    } as Record<string, any>
                  )[row.vul_leakLevel]
                "
                >{{ row_vul_leakLevel(row.vul_leakLevel) }}</el-tag
              >
            </span>
          </template>
          <template #has_exp="{ row }">
            <span>
              <el-tag
                :type="({ false: 'info', true: 'success' } as Record<string, any>)[row.has_exp]"
                >{{ row.has_exp ? '有' : '无' }}</el-tag
              >
            </span>
          </template>
          <!-- 如果不传入按钮组的数据就使用自定义插槽的方式， 自定义插槽需在配置项里配置slot -->
          <template #action="{ row }">
            <div>
              <el-button type="primary" @click="handleViewClick(row)">查看</el-button>
              <el-button v-if="permiss" type="danger" @click="handleDelete(row)">删除</el-button>
            </div>
          </template>
        </TablesView>
      </div>
    </div>
  </div>
</template>

<style scoped>
.poc_search {
  display: flex;
  margin-bottom: 20px;
  margin-top: 10px;
}
</style>
