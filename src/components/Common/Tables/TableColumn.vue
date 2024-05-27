<script setup lang="ts">

defineProps<{ col: Table.Column }>()
const emit = defineEmits(['command'])
// 按钮组事件
const handleAction = (command: Table.Command, {row, $index}: { row: any; $index: number }) => {
  emit('command', command, row, $index)
}

</script>

<template>
  <!-- 如果有配置多级表头的数据，则递归该组件 -->
  <template v-if="col.children?.length">
    <el-table-column :label="col.label" :width="col.width" :align="col.align">
      <TableColumn v-for="item in col.children" :col="item" :key="item.prop">
        <template v-for="slot in Object.keys($slots)" #[slot]="scope: Record<string, any>">
          <slot :name="slot" v-bind="scope"/>
        </template>
      </TableColumn>
      <template #header="{ column, $index }">
        <component v-if="col.headerRender" :is="col.headerRender" :column="column" :index="$index"/>
        <slot v-else-if="col.headerSlot" :name="col.headerSlot" :column="column" :index="$index"></slot>
        <span v-else>{{ column.label }}</span>
      </template>
    </el-table-column>
  </template>
  <!-- 其他正常列 -->
  <el-table-column v-else v-bind="col">
    <!-- 自定义表头 -->
    <template #header="{ column, $index }">
      <component v-if="col.headerRender" :is="col.headerRender" :column="column" :index="$index"/>
      <slot v-else-if="col.headerSlot" :name="col.headerSlot" :column="column" :index="$index"></slot>
      <span v-else>{{ column.label }}</span>
    </template>
    <template #default="{ row, $index }">
      <!---图片 (START)-->
      <!-- 如需更改图片size，可自行配置参数 -->
      <el-image
          v-if="col.type === 'image'"
          preview-teleported
          :hide-on-click-modal="true"
          :preview-src-list="[row[col.prop!]]"
          :src="row[col.prop!]"
          fit="cover"
          class="w-9 h-9 rounded-lg"/>
      <!---图片 (END)-->
      <!--- 格式化日期 (本项目日期是时间戳，这里日期格式化可根据你的项目来更改) (START)-->
      <template v-else-if="col.type === 'date'">
        <!---时间格式化-->
        <span v-if="row[col.prop!]">
                    {{ row[col.prop!] }}
                </span>
        <span v-else>{{ }}</span>
      </template>
      <!--- 格式化日期 (本项目日期是时间戳，这里日期格式化可根据你的项目来更改) (END)-->
      <!-- 如果传递按钮数组，就展示按钮组 START-->
      <el-button-group v-else-if="col.buttons?.length">
        <div>
          <el-button
              v-for="(btn, index) in col.buttons"
              :key="index"
              :size="btn.size"
              :type="btn.type"
              :icon="btn.icon"
              @click="handleAction(btn.command, { row, $index })">
            {{ btn.name }}
          </el-button>
        </div>
      </el-button-group>
      <!-- 如果传递按钮数组，就展示按钮组 END-->
      <!-- render函数 (START) 使用内置的component组件可以支持h函数渲染和txs语法-->
      <component v-else-if="col.render" :is="col.render" :row="row" :index="$index"/>
      <!-- render函数 (END) -->
      <!-- 自定义slot (START) -->
      <slot v-else-if="col.slot" :name="col.slot" :row="row" :index="$index"></slot>
      <!-- 自定义slot (END) -->
      <!-- 默认渲染 (START) -->
      <span v-else>{{ row[col.prop!] }}</span>
      <!-- 默认渲染 (END) -->
    </template>
  </el-table-column>
</template>

<style scoped>

</style>