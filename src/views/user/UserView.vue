<script setup lang="ts">

import TablesView from "@/components/Common/Tables/TablesView.vue";
import {UserList_tableColumn} from "./ts/UserList"
import {inject, reactive, ref, toRefs, watch} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {useRoute, useRouter} from "vue-router";
import UserApi from "@/api/user"
import CreateUserWindows from "@/components/Users/CreateUserWindows.vue";

const route = useRoute()
const router = useRouter()
// 局部刷新方法
const reload: any = inject('reload')
// 绑定搜索内容
const input_search = ref()
const dialogCreateUserTable = ref(false)

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
  options: {showPagination: true}
})


const {options} = toRefs(state)

interface User {
  id: string,
  username: string,
  permissions: number,
  phone: string | boolean,
  last_login: string,
  last_login_ip: string
}

// 基本表格数据
const tableData = ref<User[]>([])

const handleAction = (command: Table.Command, row: User, index: number) => {
  switch (command) {
    case 'edit':
      alert('点击了编辑')
      break
    case 'delete':
      console.log('row', row)
      console.log('index', index)
      ElMessageBox.confirm(`确认用户${row.username}删除吗？`, '提示').then(() => {
        UserApi.delete_user({"user_id": row.id}).then(res => {
          if (res.data.code == 200) {
            ElMessage.success("删除成功")
            reload()
          } else {
            ElMessage.error("删除失败")
          }
        })
      }).catch(() => null)
      break
    default:
      break
  }
}
const handlePaginationChange = async (page: number, pageSize: number, search: string = params.search) => {
  console.log("翻页", page, pageSize, search)
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
  console.log("搜索内容", input_search.value)
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
    ElMessage.error('请输入搜索内容');
    reload()
    console.log("刷新")
  }
}

// 重置事件
const ReloadClick = async () => {
  input_search.value = ''
  await router.replace({
    path: route.path,
    query: {
      page: 1,
      pageSize: 10,
      search: ''
    }
  })
  reload()
}
//创建用户事件
const Create_User = () => {
  console.log("create user")
  dialogCreateUserTable.value = true
}
//dialog回掉事件
const handleAdd = (val: boolean) => {
  console.log("收到子组件传送参数", val)
  dialogCreateUserTable.value = val
  if (!val) {
    reload()
  }
}

// 获取用户列表
const get_user_list = (page: number = 1, page_size: number = 10, search: string = '') => {
  return UserApi.getUserList({"page": page, "page_size": page_size, "search": search})
}
watch(
    () => route.query,
    async (val: any) => {
      const {page, pageSize, search} = val
      params.page = Number(page) || params.page
      params.pageSize = Number(pageSize) || params.pageSize
      params.search = search || ''
      console.log('send requests')
      get_user_list(params.page, params.pageSize, params.search).then(res => {
        tableData.value = res.data.data.list
        state.options.paginationConfig = {
          total: res.data.data.total,
          currentPage: params.page,
          pageSize: params.pageSize,
          pageSizes: [10, 20, 50],
          layout: 'total,prev, pager, next,sizes'
        }
      })
    },
    {immediate: true}
)

</script>

<template>
  <div>
    <div class="users_search">
      <el-input v-model="input_search" placeholder="请输入搜索内容" style="width: 300px;margin-left: 10px"
                clearable></el-input>
      <el-button type="primary" @click="SearchClick" style="margin-left: 30px">搜索</el-button>
      <el-button type="primary" @click="ReloadClick">重置</el-button>
      <el-button type="primary" @click="Create_User">创建用户</el-button>
    </div>
    <div>
      <TablesView
          :columns="UserList_tableColumn"
          :table-data="tableData"
          :options="options"
          @pagination-change="handlePaginationChange"
          @command="handleAction"
      >
        <template #permissions="{ row }">
          <div v-if="row.permissions == 1">
            <span><el-tag type="danger">管理员</el-tag></span>
          </div>
          <div v-else>
            <span><el-tag type="success">普通用户</el-tag></span>
          </div>
        </template>
      </TablesView>
    </div>
    <div>
      <el-dialog v-model="dialogCreateUserTable" title="创建用户">
        <CreateUserWindows :dialog="dialogCreateUserTable" @add="handleAdd"></CreateUserWindows>
      </el-dialog>
    </div>
  </div>
</template>

<style scoped>
.users_search {
  display: flex;
  margin-bottom: 20px;
  margin-top: 10px;
}
</style>