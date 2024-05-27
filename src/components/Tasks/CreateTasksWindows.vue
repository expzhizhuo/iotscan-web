<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import TasksApi from '@/api/tasks'

// 组件间数据通信
const props = defineProps({
  dialog: Boolean
})
const scan_host = ref<string>()
const is_poc_scan = ref({
  value: -1,
  label: '不使用POC'
})
const is_poc_scan_list = ref<any>([
  {
    value: '-1',
    label: '不使用POC'
  },
  {
    value: '0',
    label: '全部'
  },
  {
    value: '1',
    label: '低危'
  },
  {
    value: '2',
    label: '中危'
  },
  {
    value: '3',
    label: '高危'
  },
  {
    value: '4',
    label: '严重'
  },
  {
    value: '5',
    label: '特定poc扫描'
  }
])

const create_data = ref({
  host: [],
  desc: '',
  scanning_speed: 1,
  is_use_port_scan: true,
  port_type: 'TOP100',
  is_use_proxy: false,
  is_use_domainscan: false,
  domain_type: 'SMALL',
  poc_type: is_poc_scan.value.value,
  poc_warehouse_ids: []
})
console.log('收到父组件参数', props.dialog)

const dialogs = ref(false)
dialogs.value = props.dialog

const ruleFormRef = ref<FormInstance>()
//表单验证
const rules = reactive<FormRules>({
  desc: [{ required: true, message: '请输入项目描述', trigger: 'blur' }]
})

const emits = defineEmits(['add'])
const onSubmit = (formEl: FormInstance | undefined) => {
  console.log('创建', create_data.value)
  if (!formEl) return
  formEl.validate((valid, fields) => {
    if (valid) {
      console.log('验证通过')
      const validata = validateTarget(scan_host.value)
      if (validata) {
        create_data.value.host = validata
        create_task(create_data.value).then((res) => {
          if (res.data.code == 200) {
            ElMessage.success('创建成功')
            dialogs.value = false
            emits('add', dialogs.value)
          } else {
            ElMessage.error('创建失败，请检查数据是否有误')
          }
        })
      }
    } else {
      console.log('error submit!', fields)
      return false
    }
  })
}
const onCancel = () => {
  console.log('取消')
  dialogs.value = false
  emits('add', dialogs.value)
}

// POC类型选择触发事件
const select_poc_emit = (val: number) => {
  console.log('select', val)
  create_data.value.poc_type = val
}

// 创建任务接口
const create_task = (data: any) => {
  return TasksApi.create_task(data)
}

// 扫描目标数据验证
const validateTarget = (val: any) => {
  if (!val) {
    ElMessage.error('扫描目标不能为空')
    return false
  }
  const ipv4Regex =
    /^(https?:\/\/)?(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\/(3[0-2]|[12]?[0-9]))?(-((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|([0-9]))(\.((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|([0-9]))){0,3})?$/
  const ipv6Regex =
    /^(https?:\/\/)?\[((?:[A-Fa-f0-9]{1,4}:){7}(?:[A-Fa-f0-9]{1,4}|:)|(?:[A-Fa-f0-9]{1,4}:){1,6}:(?:[A-Fa-f0-9]{1,4}|:)|(?:[A-Fa-f0-9]{1,4}:){1,5}:(?:[A-Fa-f0-9]{1,4}:){1,2}(?:[A-Fa-f0-9]{1,4}|:)|(?:[A-Fa-f0-9]{1,4}:){1,4}:(?:[A-Fa-f0-9]{1,4}:){1,3}(?:[A-Fa-f0-9]{1,4}|:)|(?:[A-Fa-f0-9]{1,4}:){1,3}:(?:[A-Fa-f0-9]{1,4}:){1,4}(?:[A-Fa-f0-9]{1,4}|:)|(?:[A-Fa-f0-9]{1,4}:){1,2}:(?:[A-Fa-f0-9]{1,4}:){1,5}(?:[A-Fa-f0-9]{1,4}|:)|[A-Fa-f0-9]{1,4}:(?:(?:[A-Fa-f0-9]{1,4}:){1,6}|:)|(?:[A-Fa-f0-9]{1,4}:){1,7}:|:(?::[A-Fa-f0-9]{1,4}){1,7}|:)\](\/\d{1,3})?$/
  const domainRegex =
    /^(https?:\/\/)?((\d{1,3}\.){3}\d{1,3}|[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*)(:\d+)?(\/.*)?$/
  const targets = val.split(/[\n;]/).filter(Boolean)
  console.log('host', targets)
  for (let target of targets) {
    if (!ipv4Regex.test(target) && !ipv6Regex.test(target) && !domainRegex.test(target)) {
      console.log('input error', target)
      ElMessage.error(`请输入有效的IPv4、IPv6地址或域名${target}`)
      return false
    }
  }
  return targets
}
</script>

<template>
  <div>
    <el-form :model="create_data" label-width="140px" :rules="rules" ref="ruleFormRef">
      <el-form-item label="任务描述" prop="desc">
        <el-input v-model="create_data.desc" placeholder="请输入任务描述" clearable />
      </el-form-item>
      <el-form-item label="端口扫描">
        <el-switch v-model="create_data.is_use_port_scan" />
      </el-form-item>
      <div v-if="create_data.is_use_port_scan == true">
        <el-form-item label="端口类型">
          <el-radio-group v-model="create_data.port_type">
            <el-radio label="ALL">全部端口</el-radio>
            <el-radio label="TOP1000">TOP1000端口</el-radio>
            <el-radio label="TOP100">TOP100端口</el-radio>
            <el-radio label="TOP10">TOP10端口</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
      <el-form-item label="子域名扫描">
        <el-switch v-model="create_data.is_use_domainscan" />
      </el-form-item>
      <div v-if="create_data.is_use_domainscan == true">
        <el-form-item label="子域名字典">
          <el-radio-group v-model="create_data.domain_type">
            <el-radio label="ALL">全量字典</el-radio>
            <el-radio label="SMALL">默认字典</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
      <el-form-item label="启用代理">
        <el-switch v-model="create_data.is_use_proxy" />
      </el-form-item>
      <el-form-item label="漏洞类型">
        <el-select placeholder="请选择类型" v-model="is_poc_scan.label">
          <el-option
            v-for="item in is_poc_scan_list"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            @click="select_poc_emit(item.value)"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="目标">
        <el-input
          v-model="scan_host"
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 4 }"
          placeholder="请输入IPv4、IPv6地址或域名，可使用换行或分号分隔"
        />
      </el-form-item>
      <el-form-item>
        <el-button size="large" round type="primary" @click="onSubmit(ruleFormRef)">创建</el-button>
        <el-button size="large" round @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped lang="less">
.el-button {
  margin-right: 60px;
  margin-top: 20px;
}
</style>
