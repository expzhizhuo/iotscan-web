<script setup lang="ts">
import type {ComputedRef} from 'vue'
import {computed, ref} from 'vue'
import type {TableColumnCtx} from 'element-plus/es/components/table/src/table-column/defaults'
import TableColumn from './TableColumn.vue'
import {ElTable} from 'element-plus'

const loading = ref(true)

export type SortParams<T> = {
  column: TableColumnCtx<T | any>
  prop: string
  order: Table.Order
}

interface TableProps {
  tableData: Array<object> // table的数据
  columns: Table.Column[] // 每列的配置项
  options?: Table.Options
}

const props = defineProps<TableProps>()
if (props.tableData) {
  setTimeout(() => {
    loading.value = false
  }, 500)
}

const tableRef = ref<InstanceType<typeof ElTable>>()
// 设置option默认值，如果传入自定义的配置则合并option配置项
const _options: ComputedRef<Table.Options> = computed(() => {
  const option = {
    stripe: false,
    tooltipEffect: 'dark',
    showHeader: true,
    showPagination: false,
    // rowStyle: () => 'cursor:pointer' // 行样式
  }
  return Object.assign(option, props?.options)
})
// 合并分页配置
const _paginationConfig = computed(() => {
  const config = {
    total: 0,
    currentPage: 1,
    pageSize: 10,
    pageSizes: [10, 20, 30, 40, 50, 100],
    layout: 'total,prev, pager, next,sizes'
  }
  return Object.assign(config, _options.value.paginationConfig)
})
const emit = defineEmits([
  'selection-change', // 当选择项发生变化时会触发该事件
  'row-click', // 当某一行被点击时会触发该事件
  'cell-click', // 当某个单元格被点击时会触发该事件
  'command', // 按钮组事件
  'size-change', // pageSize事件
  'current-change', // currentPage按钮组事件
  'pagination-change', // currentPage或者pageSize改变触发
  'sort-change', // 列排序发生改变触发
])
// 自定义索引
const indexMethod = (index: number) => {
  return index + (_paginationConfig.value.currentPage - 1) * _paginationConfig.value.pageSize + 1
}
// 切换pageSize
const pageSizeChange = (pageSize: number) => {
  emit('size-change', pageSize)
  emit('pagination-change', 1, pageSize)
}
// 切换currentPage
const currentPageChange = (currentPage: number) => {
  emit('current-change', currentPage)
  emit('pagination-change', currentPage, _paginationConfig.value.pageSize)
}
// 按钮组事件
const handleAction = (command: Table.Command, row: any, index: number) => {
  emit('command', command, row, index)
}
// 多选事件
const handleSelectionChange = (val: any) => {
  emit('selection-change', val)
}
// 当某一行被点击时会触发该事件
const handleRowClick = (row: any, column: any, event: MouseEvent) => {
  emit('row-click', row, column, event)
}
// 当某个单元格被点击时会触发该事件
const handleCellClick = (row: any, column: any, cell: any, event: MouseEvent) => {
  emit('cell-click', row, column, cell, event)
}
/**
 *  当表格的排序条件发生变化的时候会触发该事件
 * 在列中设置 sortable 属性即可实现以该列为基准的排序， 接受一个 Boolean，默认为 false。
 * 可以通过 Table 的 default-sort 属性设置默认的排序列和排序顺序。
 * 如果需要后端排序，需将 sortable 设置为 custom，同时在 Table 上监听 sort-change 事件，
 * 在事件回调中可以获取当前排序的字段名和排序顺序，从而向接口请求排序后的表格数据。
 */
const handleSortChange = ({column, prop, order}: SortParams<any>) => {
  emit('sort-change', {column, prop, order})
}
// 暴露给父组件参数和方法，如果外部需要更多的参数或者方法，都可以从这里暴露出去。
defineExpose({element: tableRef})

</script>

<template>
  <div>
    <div>
      <el-table
          ref="tableRef"
          :data="tableData"
          v-loading="loading"
          element-loading-text="Loading..."
          v-bind="_options"
          @selection-change="handleSelectionChange"
          @row-click="handleRowClick"
          @cell-click="handleCellClick"
          @sort-change="handleSortChange">
        <template v-for="(col, index) in columns" :key="index">
          <!---复选框, 序号 (START)-->
          <el-table-column
              v-if="col.type === 'index' || col.type === 'selection' || col.type === 'expand'"
              :index="indexMethod"
              v-bind="col">
            <!-- 当type等于expand时， 配置通过h函数渲染、txs语法或者插槽自定义内容 -->
            <template #default="{ row, $index }">
              <!-- render函数 (START) : 使用内置的component组件可以支持h函数渲染和txs语法 -->
              <component v-if="col.render" :is="col.render" :row="row" :index="$index"/>
              <!-- render函数 (END) -->
              <!-- 自定义slot (START) -->
              <slot v-else-if="col.slot" name="expand" :row="row" :index="$index"></slot>
              <!-- 自定义slot (END) -->
            </template>
          </el-table-column>
          <!---复选框, 序号 (END)-->
          <!-- 渲染插槽 START -->
          <TableColumn :col="col" v-else @command="handleAction">
            <template v-for="slot in Object.keys($slots)" #[slot]="scope: Record<string, any>">
              <slot :name="slot" v-bind="scope"/>
            </template>
          </TableColumn>
          <!-- 渲染插槽 END -->
        </template>
      </el-table>
    </div>
    <!-- 分页器 -->
    <div v-if="_options.showPagination" class="page-choose">
      <el-pagination background
                     v-bind="_paginationConfig"
                     @size-change="pageSizeChange"
                     @current-change="currentPageChange"/>
    </div>
  </div>
</template>

<style scoped>

.page-choose {
  margin-top: 50px;
  display: flex;
  justify-content: flex-end;
}
</style>
