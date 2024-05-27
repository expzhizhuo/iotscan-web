<script setup lang="ts">
import {ElMessage} from "element-plus";
import useClipboard from "vue-clipboard3";
import {DocumentCopy} from "@element-plus/icons-vue";

const {toClipboard} = useClipboard();

interface DataType {
  id: number,
  host: string,
  result: {
    VerifyInfo: {
      URL: string
    },
    request: [
      {
        request: string
        response: string
      }
    ]
  },
  create_time: string,
  poc_info: {
    poc_name: string,
    vul_name: string,
    vul_desc: string,
    vul_leakLevel: number,
    vul_range: string,
    has_exp: boolean,
    vul_vulDate: string
  },
  status: number,
  vul_id: string,
  iot_task_id: number,
  target_id: string
}

interface DataProps {
  data: DataType // data的数据
}


const props = defineProps<DataProps>()
if (props.data) {
  console.log(props.data)
}

const row_vul_leakLevel = (val: number) => {
  return ({
    '0': '提示',
    '1': '低危',
    '2': '中危',
    '3': '高危',
    '4': '严重',
  } as Record<string, any>)[val]
}
//复制事件
const ClickCopy = async (copyData: string) => {
  console.log('copyData', copyData)
  if (!copyData) {
    ElMessage.warning('请输入文本再复制');
    return;
  }
  try {
    await toClipboard(copyData);
    ElMessage.success(`复制成功！`);
  } catch (error) {
    ElMessage.error(`复制失败: ${error}`);
    console.error(error);
  }
};

</script>

<template>
  <div class="container">
    <div class="dialog-title">
      <el-row class="info-row" type="flex" align="middle">
        <el-col :span="6"><strong class="info-label">目标地址：</strong></el-col>
        <el-col :span="18" class="info-content">{{ data.result.VerifyInfo.URL }}</el-col>
      </el-row>
      <el-row class="info-row" type="flex" align="middle">
        <el-col :span="6"><strong class="info-label">漏洞名称：</strong></el-col>
        <el-col :span="18" class="info-content">{{ data.poc_info.poc_name }}</el-col>
      </el-row>
      <el-row class="info-row" type="flex" align="middle">
        <el-col :span="6"><strong class="info-label">漏洞描述：</strong></el-col>
        <el-col :span="18" class="info-content">{{ data.poc_info.vul_desc }}</el-col>
      </el-row>
      <el-row class="info-row" type="flex" align="middle">
        <el-col :span="6"><strong class="info-label">漏洞等级：</strong></el-col>
        <el-col :span="18" class="info-content">{{ row_vul_leakLevel(data.poc_info.vul_leakLevel) }}</el-col>
      </el-row>
      <el-row class="info-row" type="flex" align="middle">
        <el-col :span="6"><strong class="info-label">发现时间：</strong></el-col>
        <el-col :span="18" class="info-content">{{ data.create_time }}</el-col>
      </el-row>
    </div>
    <el-divider content-position="left">漏洞证明</el-divider>
    <div class="dialog-request">
      <el-collapse v-for="(item,index) in data.result.request" :key="index">
        <div v-if="data.result.request.length>1" class="step-indicator">
          <span>第{{ index + 1 }}步</span>
        </div>
        <el-collapse-item title="请求数据包">
          <el-input type="textarea" :autosize="{minRows: 12, maxRows: 12}" :model-value="item.request"
                    readonly class="data-package"></el-input>
          <el-icon @click="ClickCopy(item.request)" class="copy_icon_absolute">
            <DocumentCopy/>
          </el-icon>
        </el-collapse-item>
        <el-collapse-item title="响应数据包">
          <el-input type="textarea" :autosize="{minRows: 12, maxRows: 12}" :model-value="item.response"
                    readonly class="data-package"></el-input>
          <el-icon @click="ClickCopy(item.response)" class="copy_icon_absolute">
            <DocumentCopy/>
          </el-icon>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<style scoped lang="less">
.container {
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.dialog-title {
  margin-bottom: 20px;
  padding: 10px;
  border-radius: 5px;
}

.info-row {
  margin-bottom: 10px;
}

.info-label {
  color: #333;
  font-weight: bold;
}

.info-content {
  color: #666;
}

.dialog-request {
  margin-top: 20px;
}


.data-package {
  border: none;
  font-family: monospace;
}

.step-indicator {
  margin-top: 10px;
  font-size: 1.3em;
  color: #33b5e5;
  font-weight: bold;
}

.dialog-request .el-collapse-item {
  position: relative;
}

.dialog-request:hover .copy_icon_absolute {
  display: block;
}

.copy_icon_absolute {
  display: none;
  float: right;
  position: absolute;
  right: 25px;
  top: 70px;
}
</style>