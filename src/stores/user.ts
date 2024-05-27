// 用户信息pinia配置信息

import {defineStore} from 'pinia'
import router from '@/router/index'

export const useUserStore = defineStore('user', {
    state: () => ({
        token: '',
        roles: '',
        username: '',
        permiss: '',
        refresh: ''
    }),
    actions: {
        // 登录成功后将返回的 token 存起来
        setToken(val: string) {
            this.token = val
        },
        getToken() {
            return this.token
        },
        setRoles(val: string) {
            this.roles = val
        },
        getRoles() {
            return this.roles
        },
        setPermiss(val: string) {
            this.permiss = val
        },
        getPermiss() {
            return this.permiss
        },
        setUserName(val: string) {
            this.username = val
        },
        getUserName() {
            return this.username
        },
        setRefresh(val: string) {
            this.refresh = val
        },
        getRefresh() {
            return this.refresh
        },
        // 清空 token 和角色并跳转到登录页
        logout() {
            this.token = ''
            this.roles = ''
            this.username = ''
            this.permiss = ''
            this.refresh = ''
            router.push('/login')
        }
    },
    persist: {
        key: 'token',
        storage: localStorage,
        paths: ['token', 'roles', 'username', 'permiss', 'refresh']
    }
})