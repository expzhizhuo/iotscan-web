import type {App} from 'vue'

export default (app: App) => {
    register(app, import.meta.glob('./**/index.ts', {eager: true}))
}

function register(app: App, modules: Record<string, any>) {
    Object.entries(modules).map(([, module]) => {
        module.default(app)
    })
}

type IEasyLoading = {
    showLoading: (msg?: string) => void
    hideLoading: () => void
}

// export interface I$EasyMessage extends IEasyMessage {
//     config: (options: EasyMessageOption) => EasyMessageResult
//     closeMessage: () => void
//     isShow: boolean
// }

// 编写ts 插件声明文件防止报错 和 智能提示
declare module '@vue/runtime-core' {
    export interface ComponentCustomProperties {
        $easyLoading: IEasyLoading
        // $easyMessage: I$EasyMessage
    }
}
