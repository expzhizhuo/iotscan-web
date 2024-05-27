<script setup lang="ts">
import * as echarts from "echarts"
import {nextTick, onBeforeMount, onMounted, onUnmounted, ref} from "vue"
import HomeApi from "@/api/home"

const timerList = ref<any>([]) // 存储定时器ID的列表
const chartInstance = ref(null)
const date = ref<any>([])
const network = ref<any>([])
const network2 = ref<any>([])


onMounted(() => {
  nextTick().then(() => {
    if (chartInstance.value) {
      initChart()
    }
  })
})

onBeforeMount(() => {
  /**
   * 定时器每秒请求一次网络流量接口获取设备流量
   */
  const get_networks = setInterval(() => {
    const currentTime = new Date().toLocaleTimeString();
    HomeApi.get_network_info().then(res => {
      const {received, send} = res.data.data;
      network.value.push(received)
      network2.value.push(send)
      date.value.push(currentTime)
      if (network.value.length > 8) network.value.shift(); // Keep only the last 20 entries
      if (network2.value.length > 8) network2.value.shift(); // Keep only the last 20 entries for the second dataset
      if (date.value.length > 8) date.value.shift();
      updateChart() // Update the chart with new data
    })
  }, 1000)
  timerList.value.push(get_networks)
})

function initChart() {
  let chartDom = chartInstance.value
  if (chartDom) {
    let chart = echarts.init(chartDom, null, {renderer: 'canvas', useDirtyRect: true})
    chart.setOption(getChartOption(date.value, network.value, network2.value))
    window.onresize = () => chart.resize()
  } else {
    console.error("Can't get DOM width or height. Please check dom.clientWidth and dom.clientHeight. They should not be 0.")
  }
}

function updateChart() {
  let chartDom = chartInstance.value
  if (chartDom) {
    let chart = echarts.getInstanceByDom(chartDom) || echarts.init(chartDom, null, {
      renderer: 'canvas',
      useDirtyRect: true
    })
    chart.setOption(getChartOption(date.value, network.value, network2.value), {notMerge: true, lazyUpdate: true})
  }
}

function getChartOption(dates: any[], networkData: any[], networkData2: any[]) {
  const formatter = (value: number) => {
    return value >= 1024 ? (value / 1024).toFixed(2) + 'Mb/s' : value.toFixed(2) + 'Kb/s';
  };
  return {
    title: {
      text: "网络流量实时显示"
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross"
      },
      formatter: function (params: any) {
        let result = params[0].axisValueLabel + '<br/>';
        params.forEach(function (item: any) {
          result += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:' + item.color + ';"></span>';
          if (item.seriesIndex !== 0) {
            result += '发送: ' + formatter(item.data) + '<br/>';
          } else {
            result += '接收: ' + formatter(item.data) + '<br/>';
          }
        });
        return result;
      }
    },
    grid: {
      left: '80px',
      right: '30px'
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      splitLine: {
        show: false
      },
      data: dates
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: formatter
      }
    },
    series: [
      {
        data: networkData,
        type: "line",
        smooth: true,
        itemStyle: {
          color: '#add8e6'
        },
        areaStyle: {}
      },
      {
        data: networkData2,
        type: "line",
        smooth: true,
        itemStyle: {
          color: '#90ee90'
        },
        areaStyle: {}
      }
    ]
  }
}

// 当离开页面时清除定时器
onUnmounted(() => {
  for (const id of timerList.value) {
    clearInterval(id);
  }
})
</script>

<template>
  <div>
    <div ref="chartInstance" id="NetworkEcharts" style="width: 100%;height: 360px;"></div>
  </div>
</template>

<style scoped>

</style>
