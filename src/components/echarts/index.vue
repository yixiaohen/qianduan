<template>
  <div
    :class="className"
    :style="{height:height,width:width}"
  />
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
      type: Array,
      default: null
    }
  },
  data() {
    return {
      chart: null,
      chartData: this.data
    };
  },
  watch: {
    data(a, b) {
      this.chartData = a;
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
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
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons');
      const options = {
        legend: {},
        tooltip: {},
        dataset: {
          source: this.chartData
        },
        xAxis: { type: 'category' },
        yAxis: {},
        series: [
          { type: 'bar' },
          { type: 'bar' },
          { type: 'bar' }
        ]
      };
      this.chart.setOption(options);
    }
  }
};
</script>
