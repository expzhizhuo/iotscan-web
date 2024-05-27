<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import UserApi from '@/api/user'

interface RuleForm {
  username: string
  password: string
  password_again: string
  phone: string
  email: string
  permissions: number | string
}

const create_data = reactive<RuleForm>({
  username: '',
  password: '',
  password_again: '',
  email: '',
  phone: '',
  permissions: '0'
})

const ruleFormRef = ref<FormInstance>()
//表单验证规则
const rules = reactive<FormRules<RuleForm>>({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 8, message: '密码长度大于等于8位', trigger: 'blur' }
  ],
  password_again: [
    { required: true, message: '请输入确认密码', trigger: 'change' },
    { min: 8, message: '确认密码长度大于等于8位', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== create_data.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ],
  permissions: [{ required: true, message: '请选择用户权限', trigger: 'blur' }]
})

// 组件间数据通信
const props = defineProps({
  dialog: Boolean
})
console.log('收到父组件参数', props.dialog)
const dialogs = ref(false)
dialogs.value = props.dialog

const emits = defineEmits(['add'])

//接口请求函数

const create_user = (data: any) => {
  return UserApi.create_user(data)
}
const onSubmit = (formEl: FormInstance | undefined) => {
  console.log('创建', create_data)
  if (!formEl) return
  formEl.validate((valid, fields) => {
    if (valid) {
      create_user(create_data).then((res) => {
        if (res.data.code == 200) {
          ElMessage.success(res.data.data)
          dialogs.value = false
          emits('add', dialogs.value)
        }
      })
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
</script>

<template>
  <div>
    <el-form ref="ruleFormRef" :model="create_data" label-width="140px" :rules="rules">
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="create_data.username"
          type="text"
          placeholder="请输入用户名"
          autocomplete="off"
          minlength="8"
          clearable
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="create_data.password"
          type="password"
          placeholder="请输入密码"
          autocomplete="off"
          clearable
          style="width: 200px"
          show-password
        />
      </el-form-item>
      <el-form-item label="确认密码" prop="password_again">
        <el-input
          v-model="create_data.password_again"
          type="password"
          placeholder="请再次输入密码"
          clearable
          style="width: 200px"
          show-password
        />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="create_data.phone"
          type="text"
          placeholder="请输入手机号"
          clearable
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input
          v-model="create_data.email"
          type="text"
          placeholder="请输入邮箱"
          clearable
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item label="用户身份" prop="permissions">
        <el-radio-group v-model="create_data.permissions">
          <el-radio label="1">管理员</el-radio>
          <el-radio label="0">普通用户</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit(ruleFormRef)">创建</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped></style>
