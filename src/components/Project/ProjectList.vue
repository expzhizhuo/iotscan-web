<script setup lang="ts">
import Loading from '@/components/Common/Loading'
import { computed } from 'vue'
import { DocumentCopy } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import useClipboard from 'vue-clipboard3'

// 加载动画
Loading.showLoading()

const { toClipboard } = useClipboard()

interface ResultListType {
  host: string
  port: number | null
  scan_type: string | null
  port_service: string | null
  url: string
  scheme: string | null
  cms: string | null
  title: string | null
  status_code: number | null
  redirect_num: number
  server: string | null
  is_cdn: boolean
  cdn_ip_list: string[]
  icon_hash: string | null
  icp: string | null
  cert: Record<string, unknown>
  headers: string | null
  country: string
  province: string
  city: string
  isp: string
}

interface PageType {
  currentPage: number
  pageSize: number
  total: number
  pageSizes: number[]
  disabled: boolean
  small: boolean
  background: boolean
}

interface TableProps {
  TableData: Array<ResultListType> // table的数据
  pageConfig: PageType // 总数据大小
  PageRenderingTime: number | string //页面渲染时间
}

const props = defineProps<TableProps>()
if (props.TableData) {
  setTimeout(() => {
    Loading.hideLoading()
  }, 500)
}

const _paginationConfig = computed(() => {
  const config = {
    total: 0,
    currentPage: 1,
    pageSize: 10,
    pageSizes: [10, 20, 30, 40, 50, 100],
    layout: 'total,prev, pager, next,sizes'
  }
  return Object.assign(config, props.pageConfig)
})

const emit = defineEmits([
  'selection-change', // 当选择项发生变化时会触发该事件
  'row-click', // 当某一行被点击时会触发该事件
  'cell-click', // 当某个单元格被点击时会触发该事件
  'command', // 按钮组事件
  'size-change', // pageSize事件
  'current-change', // currentPage按钮组事件
  'pagination-change', // currentPage或者pageSize改变触发
  'sort-change' // 列排序发生改变触发
])
const pageSizeChange = (pageSize: number) => {
  emit('size-change', pageSize)
  emit('pagination-change', 1, pageSize)
}
// 切换currentPage
const currentPageChange = (currentPage: number) => {
  emit('current-change', currentPage)
  emit('pagination-change', currentPage, _paginationConfig.value.pageSize)
}
// 复制事件
const ClickCopy = async (copyData: string) => {
  console.log('copyData', copyData)
  if (!copyData) {
    ElMessage.warning('请输入文本再复制')
    return
  }
  try {
    await toClipboard(copyData)
    ElMessage.success(`复制成功！`)
  } catch (error) {
    ElMessage.error(`复制失败: ${error}`)
    console.error(error)
  }
}
//json数据格式化
const FormatJSON = (val: object) => JSON.stringify(val, null, 2)
//url单击事件
const OnClickUrl = (val: string) => {
  console.log(val)
  if (val.startsWith('http')) {
    window.open(val)
  }
}
</script>

<template>
  <div>
    <div class="project-title">
      <span>共计{{ props.pageConfig.total }}条资产信息</span>
      <span>页面渲染用时{{ props.PageRenderingTime }}ms</span>
    </div>
    <el-row class="list_content">
      <el-empty v-if="!TableData.length" description="暂无数据"></el-empty>
      <el-col v-for="(item, index) in TableData" :key="index">
        <el-card class="list_title">
          <div class="card_list">
            <!-- 左列盒子 -->
            <el-col :span="10">
              <div class="project-main">
                <div>
                  <!-- 标题 -->
                  <div class="status_title">
                    <span class="title" :title="item.title || ''">{{ item.title }}</span>
                  </div>
                  <!-- port service -->
                  <div class="port_service">
                    <span v-if="item.status_code">
                      <el-tag type="success">
                        {{ item.status_code }}
                      </el-tag>
                    </span>
                    <span>
                      <el-tag>
                        {{ item.port }}/{{ item.port_service }}/{{ item.scan_type }}
                      </el-tag>
                    </span>
                  </div>
                  <div class="ip_position">
                    <span v-if="item.country && item.country != '0'">{{ item.country }}</span>
                    <span
                      v-if="
                        item.country && item.country != '0' && item.province && item.province != '0'
                      "
                      >/</span
                    >
                    <span v-if="item.province && item.province != '0'">{{ item.province }}</span>
                    <span
                      v-if="
                        item.city &&
                        item.city != '0' &&
                        ((item.province && item.province != '0') ||
                          (item.country && item.country != '0'))
                      "
                      >/</span
                    >
                    <span v-if="item.city && item.city != '0'">{{ item.city }}</span>
                  </div>
                  <!-- url -->
                  <div class="url_section">
                    <el-tooltip class="item" effect="dark" :content="item.url" placement="top">
                      <el-link :underline="false" target="_blank" @click="OnClickUrl(item.url)"
                        >{{ item.url }}
                      </el-link>
                    </el-tooltip>
                    <el-icon @click="ClickCopy(item.url)" class="copy_icon">
                      <DocumentCopy />
                    </el-icon>
                  </div>
                  <!-- cms -->
                  <div class="icon_hash_section">
                    <span v-if="item.icon_hash">icon_hash：{{ item.icon_hash }}</span>
                    <div v-if="item.cms">
                      <span>指纹：{{ item.cms }}</span>
                    </div>
                  </div>
                  <!-- server & 重定向次数 -->
                  <div class="server_section">
                    <span>Server：{{ item.server || '未知' }}</span>
                    <span class="redirect_count">重定向次数：{{ item.redirect_num }}</span>
                  </div>
                </div>
                <!-- cdn -->
                <div class="list_bottom">
                  <span v-if="item.is_cdn">
                    <el-tag>CDN</el-tag>
                  </span>
                  <span v-if="item.icp">
                    <el-tag>{{ item.icp }}</el-tag>
                  </span>
                  <span v-if="item.isp && item.isp != '0'">
                    <el-tag>{{ item.isp }}</el-tag>
                  </span>
                </div>
              </div>
            </el-col>
            <!-- 右列盒子 -->
            <el-col :span="14">
              <el-tabs>
                <el-tab-pane label="端口响应">
                  <div class="tab_content">
                    <el-input
                      v-model="item.headers"
                      :autosize="{ minRows: 9, maxRows: 9 }"
                      type="textarea"
                      readonly
                    ></el-input>
                    <el-icon @click="ClickCopy(item.headers || '')" class="copy_icon_absolute">
                      <DocumentCopy />
                    </el-icon>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="证书">
                  <div class="tab_content">
                    <el-input
                      :model-value="
                        item.cert && Object.keys(item.cert).length > 0 ? FormatJSON(item.cert) : ''
                      "
                      :autosize="{ minRows: 9, maxRows: 9 }"
                      type="textarea"
                      readonly
                    ></el-input>
                    <el-icon @click="ClickCopy(FormatJSON(item.cert))" class="copy_icon_absolute">
                      <DocumentCopy />
                    </el-icon>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="JSON数据">
                  <div class="tab_content">
                    <el-input
                      :model-value="FormatJSON(item)"
                      :autosize="{ minRows: 9, maxRows: 9 }"
                      type="textarea"
                      readonly
                    ></el-input>
                    <el-icon @click="ClickCopy(FormatJSON(item))" class="copy_icon_absolute">
                      <DocumentCopy />
                    </el-icon>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </el-col>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <div class="form-page">
      <el-pagination
        v-bind="_paginationConfig"
        @size-change="pageSizeChange"
        @current-change="currentPageChange"
      />
    </div>
  </div>
</template>

<style scoped lang="less">
.project-title {
  margin-left: 5px;
}

.project-title span {
  margin-right: 10px;
}

.list_content {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  margin: auto;
  font-size: 14px;
  line-height: 22px;
  width: 100%;
}

.list_title {
  width: 100%;
  height: 290px;
  margin-top: 1rem;
}

.port_service {
  margin-top: 1rem;
}

.port_service span {
  margin-right: 6px;
}

.card_list {
  display: flex;
  justify-content: space-between;
}

.status_title {
  display: flex;
}

.status_title .title {
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 90%;
  margin-left: 5px;
  font-size: 18px;
  font-weight: bold;
}

.status_title .title:hover {
  overflow: visible;
  white-space: normal;
  max-width: none;
}

.ip_position {
  margin-top: 6px;
  font-size: 14px;
  font-weight: bold;
}

.url_section {
  margin-top: 1px;
  width: 100%;
}

.url_section:hover .copy_icon {
  display: inline-block;
  cursor: pointer;
}

.copy_icon {
  display: none;
}

.copy_icon {
  margin-left: 5px;
  top: 3px;
}

.icon_hash_section {
  margin-top: 4px;
}

.server_section {
  white-space: normal;
}

.redirect_count {
  margin-left: 20px;
}

.tab_content {
  width: 100%;
}

.tab_content .copy_icon_absolute {
  display: none;
}

.tab_content:hover .copy_icon_absolute {
  display: block;
}

.copy_icon_absolute {
  float: right;
  position: absolute;
  right: 25px;
  top: 10px;
}

.form-page {
  margin-top: 30px;
  margin-bottom: 16px;
  display: flex;
  justify-content: flex-end;
}

.project-main {
  position: relative;
  height: 100%;
}

.list_bottom {
  position: absolute;
  bottom: 3px;
}

.list_bottom span {
  margin-right: 5px;
}

:deep(.el-link__inner) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  display: inline-block;
}

.el-link {
  max-width: 90%;
  justify-content: flex-start;
}
</style>
