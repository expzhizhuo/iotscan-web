<script setup lang="ts">

import {computed, reactive, ref} from 'vue';
import router from '@/router';
import type {FormInstance, FormRules} from 'element-plus'
import {ElMessage} from 'element-plus';
import {useUserStore} from "@/stores/user";
import {usePermissStore} from "@/stores/userpermiss";
import UserApi from '@/api/user'

const userStore = useUserStore();
const permissStore = usePermissStore();

const dialogFormVisible = ref(true);
const formLabelWidth = '140px';

interface RuleForm {
  username: string;
  password: string;
  new_password: string;
  again_password: string;
}

const form = reactive<RuleForm>({
  username: userStore.getUserName() || '',
  password: '',
  new_password: '',
  again_password: ''
});

if (!form.username) {
  router.push('/401');
}

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,}$/;

const isPasswordValid = computed(() => passwordRegex.test(form.new_password));
const doPasswordsMatch = computed(() => form.new_password === form.again_password);

const ruleFormRef = ref<FormInstance>();
const rules = reactive<FormRules<RuleForm>>({
  password: [{required: true, message: '请输入原密码', trigger: 'blur'}],
  new_password: [
    {required: true, message: '请输入新密码', trigger: 'change'},
    {min: 8, message: '新密码长度大于等于8位', trigger: 'blur'}
  ],
  again_password: [
    {required: true, message: '请输入确认密码', trigger: 'change'},
    {min: 8, message: '确认密码长度大于等于8位', trigger: 'blur'}
  ]
});

const resetPassword = () => {
  if (!isPasswordValid.value) {
    ElMessage.error('密码强度不符合要求，必须包含大小写字母和数字，且长度大于8位');
    return;
  }
  if (!doPasswordsMatch.value) {
    ElMessage.error('确认密码与新密码不一致');
    return;
  }
  UserApi.rest_password({'old_password': form.password, 'new_password': form.new_password}).then(res => {
    if (res.data.code == 200) {
      ElMessage.success('重置成功')
      dialogFormVisible.value = false
      userStore.logout()
      permissStore.clear()
      localStorage.clear()
      sessionStorage.clear()
      router.push('/login')
    } else {
      ElMessage.error('重置密码失败，请稍后重试')
      dialogFormVisible.value = false
    }
  })
}

const closeDialog = () => {
  dialogFormVisible.value = false;
  router.push('/dashboard');
}

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid, fields) => {
    if (valid) {
      resetPassword();
    } else {
      console.log('error submit!', fields);
      return false
    }
  });
}
</script>

<template>
  <div>
    <el-dialog v-model="dialogFormVisible" title="重置密码">
      <el-form ref="ruleFormRef" :model="form" class="reset_password_form" :rules="rules">
        <el-form-item label="用户名：" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off" readonly/>
        </el-form-item>
        <el-form-item label="原密码：" :label-width="formLabelWidth" prop="password">
          <el-input v-model="form.password" autocomplete="off" minlength="8" clearable show-password/>
        </el-form-item>
        <el-form-item label="新密码：" :label-width="formLabelWidth" prop="new_password">
          <el-input v-model="form.new_password" autocomplete="off" :minlength="8" clearable show-password/>
        </el-form-item>
        <el-form-item label="确认密码：" :label-width="formLabelWidth" prop="again_password">
          <el-input v-model="form.again_password" autocomplete="off" :minlength="8" clearable show-password/>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" @click="submitForm(ruleFormRef)">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.reset_password_form {
  width: 500px;
  margin-left: 12%;
}

</style>