<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts';
import resize from '../mixins/resize';

require('echarts/theme/macarons'); // echarts theme

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '320px'
    },
    data: {
      type: Object,
      default() {
        return {
          title: '',
          data: [],
          dataTitle: []
        };
      }
    }
  },
  data() {
    return {
      chart: null,
      dataset: this.data
    };
  },
  watch: {
    data: {
      handler(value) {
        this.setOptions(value);
      },
      deep: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart(this.dataset);
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart(dataset) {
      this.chart = echarts.init(this.$el, 'macarons');
      this.setOptions(dataset);
    },
    setOptions(dataset) {
      this.chart.setOption({
        title: {
          text: dataset.title
        },
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: dataset.dataTitle,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '平均分',
            type: 'bar',
            barWidth: '60%',
            data: dataset.data
          }
        ]
      });
    }
  }
};
</script>
