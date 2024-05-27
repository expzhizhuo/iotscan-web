import type {App} from 'vue';
import watermark from './WaterMark';

export default function installDirective(app: App) {
    // 水印指令
    app.directive(watermark.name, watermark.directives);
}

