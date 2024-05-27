import {defineStore} from 'pinia';
import router from '@/router/index'

export const useTaskStore = defineStore('tasks', {
    state: () => ({
        task_ids: '',
    }),
    actions: {
        //储存任务id
        setTaskIds(val: string) {
            this.task_ids = val
        },
        getTaskIds() {
            return this.task_ids
        },
        clear() {
            this.task_ids = ''
            router.push('/Tasks')
        }
    },
    persist: {
        key: "task_info",
        storage: sessionStorage,
        paths: ["task_ids"]
    },
})