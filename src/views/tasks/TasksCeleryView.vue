<script setup lang="ts">
import TablesView from "@/components/Common/Tables/TablesView.vue";
import {TaskCelery_tableColumn} from "./ts/TaskCelery"
import {inject, reactive, ref, toRefs, watch} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {useRoute, useRouter} from "vue-router";

const route = useRoute()
const router = useRouter()
// 局部刷新方法
const reload: any = inject('reload')
// 绑定搜索内容
const input_search = ref()

interface State {
  tableDemoList: []
  options: Table.Options
}

const params = {
  page: 1,
  pageSize: 10
}
const state = reactive<State>({
  tableDemoList: [],
  options: {showPagination: true}
})

watch(
    () => route.query,
    async (val: any) => {
      const {page, pageSize} = val
      params.page = Number(page) || params.page
      params.pageSize = Number(pageSize) || params.pageSize
      console.log('send requests')
      // const {items, pageInfo} = await getDemoList(params)
      // state.tableDemoList = items
      state.options.paginationConfig = {
        total: 100,
        currentPage: params.page,
        pageSize: params.pageSize,
        pageSizes: [10, 20, 30, 40, 50, 100],
        layout: 'total,prev, pager, next,sizes'
      }
    },
    {immediate: true}
)

const {options} = toRefs(state)

interface PocData {
  phone: number
  username: string
  permiss: number
  create_time: string
  address: string
  has_exp: boolean
}

// 基本表格数据
const tableData = [
  {
    "id": "183f77a7-a553-460d-bd27-c038dbf91975",
    "poc_name": "大华 智慧园区综合管理平台 信息泄漏",
    "vul_author": "zhizhuo",
    "vul_name": "智慧园区综合管理平台",
    "vul_range": "",
    "vul_type": "Information Disclosure",
    "vul_desc": "大华 智慧园区综合管理平台 /user_getUserInfoByUserName.action中存在API接口，导致管理园账号密码泄漏",
    "vul_leakLevel": 2,
    "has_exp": false,
    "vul_device_name": "dahua-智慧园区综合管理平台",
    "vul_vulDate": "2023-08-14",
    "vul_createDate": "2023-10-16",
    "vul_updateDate": "2023-10-16",
    "create_time": "2023-10-26 16:12:21",
    "create_user": {
      "id": "e6333cd5-3b19-4c10-8e8f-b1893cea163d",
      "create_username": "zhizhuo"
    }
  },
  {
    "id": "951c3b96-02fc-4a2d-af9d-6b80b8bad0dd",
    "poc_name": "泛微 E-Cology XXE (QVD-2023-16177)",
    "vul_author": "zhizhuo",
    "vul_name": "E-Cology",
    "vul_range": "<10.58.2",
    "vul_type": "XML Injection",
    "vul_desc": "/rest/ofs/ReceiveCCRequestByXml接口存在XML Injection",
    "vul_leakLevel": 2,
    "has_exp": true,
    "vul_device_name": "E-Cology",
    "vul_vulDate": "2023-07-13",
    "vul_createDate": "2023-10-16",
    "vul_updateDate": "2023-10-16",
    "create_time": "2023-10-26 16:12:21",
    "create_user": {
      "id": "e6333cd5-3b19-4c10-8e8f-b1893cea163d",
      "create_username": "zhizhuo"
    }
  },
  {
    "id": "bde8bb70-976c-4232-898e-03ae08bd6e2b",
    "poc_name": "腾讯 企业微信（私有化版本）敏感信息泄露漏洞",
    "vul_author": "zhizhuo",
    "vul_name": "Tencent-企业微信",
    "vul_range": "<2.7",
    "vul_type": "Information Disclosure",
    "vul_desc": "企业微信 /cgi-bin/gateway/agentinfo接口未授权情况下可直接获取企业微信secret等敏感信息",
    "vul_leakLevel": 3,
    "has_exp": true,
    "vul_device_name": "Tencent-企业微信",
    "vul_vulDate": "2023-08-12",
    "vul_createDate": "2023-10-16",
    "vul_updateDate": "2023-10-16",
    "create_time": "2023-10-26 16:12:21",
    "create_user": {
      "id": "e6333cd5-3b19-4c10-8e8f-b1893cea163d",
      "create_username": "zhizhuo"
    }
  }
]
const handleAction = (command: Table.Command, row: PocData, index: number) => {
  switch (command) {
    case 'edit':
      alert('点击了编辑')
      break
    case 'delete':
      console.log('row', row)
      console.log('index', index)
      ElMessageBox.confirm('确认删除吗？', '提示').then(() => {
        ElMessage(JSON.stringify(row))
      }).catch(() => null)
      break
    default:
      break
  }
}
const handlePaginationChange = (page: number, pageSize: number) => {
  router.push({
    path: route.path,
    query: {
      page,
      pageSize
    }
  })
}
// 搜索事件
const SearchClick = () => {
  console.log("搜索内容", input_search.value)
  if (input_search.value) {
    ElMessage.success(`搜索内容${input_search.value}`)
  } else {
    ElMessage.error('请输入搜索内容');
    reload()
    console.log("刷新")
  }
}

// 重置事件
const ReloadClick = () => {
  reload()
}

// 删除事件
const handleDelete = (val: any) => {
  console.log(val)
  ElMessageBox.confirm(
      `是否删除此POC？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(() => {
        ElMessage.success(`删除POC${val.id}成功`)
        reload()
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消删除',
        })
        reload()
      })
}

// 查看事件
const handleViewClick = (val: any) => {
  console.log(val)
  ElMessage.success(`查看POC${val.id}内容`)
}
</script>

<template>
  <div>
    <div>
      <div class="poc_search">
        <el-input v-model="input_search" placeholder="请输入搜索内容" style="width: 300px;margin-left: 10px"
                  clearable></el-input>
        <el-button type="primary" @click="SearchClick" style="margin-left: 30px">搜索</el-button>
        <el-button type="primary" @click="ReloadClick">重置</el-button>
      </div>
      <div>
        <TablesView
            :columns="TaskCelery_tableColumn"
            :table-data="tableData"
            :options="options"
            @pagination-change="handlePaginationChange"
            @command="handleAction"
        >
          <!-- 如果不传入按钮组的数据就使用自定义插槽的方式， 自定义插槽需在配置项里配置slot -->
          <template #action=" {row}">
            <div>
              <el-button type="primary" @click="handleViewClick(row)">查看</el-button>
              <el-button type="danger" @click="handleDelete(row)">删除</el-button>
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