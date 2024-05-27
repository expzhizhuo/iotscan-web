/// <reference types="vite/client" />
declare module "*.vue" {
  // 引入vue模块中ts的方法
  import type { DefineComponent } from "vue"
  // 定义vue组件以及类型注解
  const component: DefineComponent<{}, {}, any>
  export default component
}