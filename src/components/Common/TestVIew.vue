<script setup lang="ts">
import {reactive, watch, toRefs} from 'vue'
import {tableDemoColumn} from '@/components/Common/Tables/Config/config'
import {ElMessageBox, ElMessage} from 'element-plus'
// import type {SortParams} from '@/components/Common/Tables/TablesView.vue'
import Table from '@/components/Common/Tables/TablesView.vue'
import {useRoute, useRouter} from "vue-router";

const route = useRoute()
const router = useRouter()


const params = {
  page: 2,
  pageSize: 50
}


interface State {
  tableDemoList: []
  options: Table.Options
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

// pageSize或者currentPage改变触发
const handlePaginationChange = (page: number, pageSize: number) => {
  console.log(page, pageSize)
  params.pageSize = pageSize
  params.page = page
  router.push({
    path: route.path,
    query: {
      page,
      pageSize
    }
  })
}
const {options} = toRefs(state)

// 本项目Table组件自动引入，如复制此代码，需根据路径引入Table组件后使用
interface User {
  date: number
  name: string
  test: string
  address: string
}

// 基本表格数据
const tableData: User[] = [
  {
    date: 1660737564000,
    name: '佘太君',
    test: '123',
    address: '上海市普陀区金沙江路 1516 弄'
  },
  {
    date: 1462291200000,
    name: '王小虎',
    test: '123',
    address: '上海市普陀区金沙江路 1517 弄'
  },
  {
    date: 1462032000000,
    name: '王小帅',
    test: '123',
    address: '上海市普陀区金沙江路 1519 弄'
  },
  {
    date: 1462204800000,
    name: '王小呆',
    test: '123',
    address: '上海市普陀区金沙江路 1516 弄'
  }
]
/**
 * 排序
 * 在列中设置 sortable 属性即可实现以该列为基准的排序， 接受一个 Boolean，默认为 false。
 * 可以通过 Table 的 default-sort 属性设置默认的排序列和排序顺序。
 * 如果需要后端排序，需将 sortable 设置为 custom，同时在 Table 上监听 sort-change 事件，
 * 在事件回调中可以获取当前排序的字段名和排序顺序，从而向接口请求排序后的表格数据。
 */
// const handleSortChange = ({column, prop, order}: SortParams<User>) => {
//   console.log(column, order)
//   if (prop) {
//     ElMessage.success(`点击了【${prop}】排序`)
//   }
// }
// const handleSelection = (val: User[]) => {
//   console.log('父组件接收的多选数据', val)
// }
const handleAction = (command: Table.Command, row: User, index: number) => {
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
// const handleDelete = (row: any, index: any) => {
//   console.log(row, index)
//
// }
</script>

<template>
  <div>
    <div>
      <h1>基本表格</h1>
    </div>
    <Table
        :columns="tableDemoColumn"
        :table-data="tableData"
        :options="options"
        @pagination-change="handlePaginationChange"
        @command="handleAction">
      <template #address="{ row }">
        <span>演示slot使用--->{{ row.address }}</span>
      </template>
      <!--        :columns="tableDemoColumn"-->
      <!--        :table-data="tableData"-->
      <!--        :options="{ defaultSort: { prop: 'name', order: 'ascending' } }"-->
      <!--        @selection-change="handleSelection"-->
      <!--        @command="handleAction"-->
      <!--        @sort-change="handleSortChange">-->
      <!-- 如果不传入按钮组的数据就使用自定义插槽的方式， 自定义插槽需在配置项里配置slot -->
      <!--        <template #action="{ row, index }">-->
      <!--          <div>-->
      <!--            <el-button type="success">添加</el-button>-->
      <!--            <el-button type="warning" @click="handleDelete(row, index)">删除</el-button>-->
      <!--          </div>-->
      <!--        </template>-->
    </Table>
  </div>
</template>

<style scoped>

</style>