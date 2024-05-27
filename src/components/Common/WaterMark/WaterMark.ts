// 全局保存 canvas 和 div ，避免重复创建（单例模式）
const globalCanvas = document.createElement('canvas');
const globalWaterMark = document.createElement('div');

// 返回一个包含图片展示的 数据URL
const getDataUrl = (binding: any) => {
    const rotate = -20;
    const canvas = globalCanvas || document.createElement('canvas');
    const ctx = <CanvasRenderingContext2D>canvas.getContext('2d'); // 获取canvas画布的绘图环境
    canvas.width = 360; // 单个水印大小
    canvas.height = 180;
    ctx?.rotate((rotate * Math.PI) / 180); // 水印旋转角度
    ctx.font = binding.font || '16px Vedana';
    ctx.fillStyle = binding.fillStyle || 'rgba(200, 200, 200, 0.30)';
    ctx.textBaseline = 'middle';
    ctx?.fillText(binding.text || '默认水印文字', canvas.width / 10, canvas.height / 2);
    return canvas.toDataURL('image/png');
};

// watermark 样式
let style = `
width: 100%;
height: 100%;
display: block;
overflow: hidden;
position: absolute;
left: 0px;
top: 0px;
z-index: 100000;
font-size: 12px;
background-repeat: repeat;
background-position: center;
pointer-events: none;`;

// 定义指令配置项
const directives: any = {
    mounted(el: HTMLElement, binding: any) {
        // 注意img有onload的方法，如果自定义指令注册在html标签的话，只需要init(el, binding.value)
        // el.onload = init.bind(null, el, binding);
        init(el, binding.value);
    },
};

// 初始化
const init = (el: HTMLElement, binding: any = {}) => {
    // 设置水印
    setWaterMark(el, binding);
    // 启动监控
    createObserver(el, binding);
};

// 设置水印
const setWaterMark = (el: HTMLElement, binding: any) => {
    const {parentElement} = el;
    // const {width, height} = parentElement!.getBoundingClientRect();
    // 获取对应的 canvas 画布相关的 base64 url
    const url = getDataUrl(binding);

    // 创建 waterMark 父元素
    const waterMark = globalWaterMark || document.createElement('div');
    waterMark.className = `pdp-water-mark`; // 方便自定义展示结果
    // style = `${style}background-image: url(${url});width:${width}px; height:${height}px`;
    style = `${style}background-image: url(${url});`;
    waterMark.setAttribute('style', style);
    // 如果父元素有自己的stayle 则获取后和自定义的拼接，并避免重复添加
    let currStyle = parentElement?.getAttribute('style') ? parentElement?.getAttribute('style') : '';
    currStyle = currStyle?.includes('position: relative')
        ? currStyle
        : currStyle + 'position: relative;';
    // 将对应图片的父容器作为定位元素
    parentElement?.setAttribute('style', currStyle);

    // 将图片元素移动到 waterMark 中
    parentElement?.appendChild(waterMark);
};

/**
 * 监听 DOM 变化
 * 用 MutationObserver 对水印元素进行监听，删除时，我们再立即生成一个水印元素就可以了
 * @param el
 * @param binding
 */
const createObserver = (el: any, binding: any) => {
    const waterMarkEl = el.parentElement?.querySelector('.pdp-water-mark');
    const observer = new MutationObserver((mutationsList) => {
        // console.log('mutationsList', mutationsList);
        if (mutationsList.length) {
            const {removedNodes, type, target} = mutationsList[0];
            const currStyle = waterMarkEl?.getAttribute('style');

            // 证明被删除了
            if (removedNodes[0] === waterMarkEl) {
                // 停止观察。调用该方法后，DOM 再发生变动，也不会触发观察器
                observer.disconnect();
                // 初始化（设置水印，启动监控）
                init(el, binding);
            } else if (type === 'attributes' && target === waterMarkEl && currStyle !== style) {
                waterMarkEl.setAttribute('style', style);
            }
        }
    });

    observer.observe(el.parentElement, {
        childList: true,
        attributes: true,
        subtree: true,
    });
};

export default {
    name: 'watermark',
    directives,
};

