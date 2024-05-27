import {createVNode, render} from 'vue'
import type {VNode, App} from 'vue';

import Loading from './LoadingView.vue'

const showLoading = (message?: string) => {
    const vNode: VNode = createVNode(Loading, {message: message})
    render(vNode, document.body)
}
const hideLoading = () => {
    render(null, document.body)
}

export default {
    install(app: App) {
        // Vue 提供的全局配置 可以自定义
        app.config.globalProperties.$easyLoading = {
            showLoading,
            hideLoading
        }
    },
    showLoading,
    hideLoading
}
