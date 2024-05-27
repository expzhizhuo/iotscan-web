import request from '@/utils/request'

export default {
  get_project_list(data: { page: number; page_size: number; tasks_id: string }) {
    /**
     * 获取资产信息
     */
    return request({
      url: '/tasks/result',
      method: 'get',
      params: data
    })
  },
  get_tasks_search(data: { task_ids: any; query: string; page: number; page_size: number }) {
    /**
     * 搜索任务结果数据
     */
    return request({
      url: 'tasks/result/search',
      method: 'get',
      params: data
    })
  },
  export_result(data: { task_ids: any }) {
    /**
     * 导出资产，输出为xlsx文件的二进制数据流
     */
    return request({
      url: '/tools/report/export_xlsx',
      method: 'get',
      responseType: 'blob', // 设置响应的数据为二进制数据流
      params: data
    })
  },
  get_tasks_result(data: {
    page: number
    page_size: number
    task_id: string
    task_type: number
    search: string
  }) {
    /**
     * 获取任务的扫描结果，其中task_type=0为端口扫描结果，task_type=1为poc扫描结果，search为搜索内容
     */
    return request({
      url: '/tasks/get_task_result',
      method: 'get',
      params: data
    })
  },
  get_tasks_statistics(data: { task_ids: any; search: string }) {
    /**
     * 获取任务的扫描结果统计聚合信息
     */
    return request({
      url: '/tasks/get_task_result/get_statistics',
      method: 'get',
      params: data
    })
  },
  get_tasks_status_details(data: { task_id: any }) {
    /**
     * 获取任务的扫描状态
     */
    return request({
      url: '/tasks/tasklist/get_tasks_status_details',
      method: 'get',
      params: data
    })
  }
}
