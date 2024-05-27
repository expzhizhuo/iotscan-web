import {createApp} from "vue"
import ElementPlus from "element-plus"
import {createPinia} from "pinia"
import * as ElementPlusIconsVue from "@element-plus/icons-vue"
import App from "./App.vue"
import router from "./router"
import {usePermissStore} from "@/stores/userpermiss"
import {useUserStore} from "@/stores/user"
import piniaPluginPersistedstate from "pinia-plugin-persistedstate"
import "element-plus/dist/index.css"
import "./assets/main.css"

import plugins from '@/plugins'

import directives from "@/components/Common/WaterMark";


// 执行方法得到实例
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.use(pinia)
app.use(ElementPlus)
app.use(directives)
plugins(app)

// 自定义权限指令
const permiss = usePermissStore()
app.directive("permiss", {
    mounted(el, binding) {
        if (!permiss.key.includes(String(binding.value))) {
            el["hidden"] = true
        }
    }
})

router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | iotscan管理系统`
    const users = useUserStore()
    const permiss = usePermissStore()
    if (!router.hasRoute(to.name ?? '')) {
        next('/404')
    } else if (!users.username && to.path !== "/login") {
        next("/login")
    } else if (to.meta.permiss && !permiss.key.includes(String(to.meta.permiss))) {
        // 如果没有权限，则进入401
        next("/401")
    } else {
        next()
    }
})
// 导入element plus的icon库
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(router)

app.mount("#app")
