import type {App} from 'vue'
import Loading from '@/components/Common/Loading'

export default (app: App) => {
    app.use(Loading)
}
