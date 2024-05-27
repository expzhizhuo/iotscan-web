import request from '@/utils/request'

export default {
  get_tasks_list(data: { page: number; page_size: number; search: string }) {
    return request({
      url: '/tasks/tasklist',
      method: 'get',
      params: data
    })
  },
  create_task(data: {
    host: string[]
    desc: string
    scanning_speed: number
    is_use_port_scan: boolean
    port_type: string
    is_use_proxy: boolean
    poc_type: number
    poc_warehouse_ids: string[]
  }) {
    return request({
      url: '/tasks/tasklist/create_task',
      method: 'post',
      data: data
    })
  },
  delete_tasks(data: { tasks_id: string }) {
    return request({
      url: '/tasks/tasklist/task_delete',
      method: 'post',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: data
    })
  },
  setting_tasks(data: { task_ids: string; task_status: number }) {
    return request({
      url: '/tasks/tasklist/task_setting',
      method: 'post',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: data
    })
  }
}
