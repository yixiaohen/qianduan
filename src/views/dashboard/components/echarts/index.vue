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
          text: dataset.title,
          x: 'center'
        },
        tooltip: {},
        legend: {
          // 左边视图
          orient: 'vertical',
          x: 'left',
          // 类别标题
          data: dataset.dataTitle
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: {
              show: true,
              type: ['pie', 'funnel'],
              option: {
                funnel: {
                  x: '25%',
                  width: '50%',
                  funnelAlign: 'left',
                  max: 1548
                }
              }
            },
            restore: { show: true }, // 重置按钮
            saveAsImage: { show: true }// 下载
          }
        },
        calculable: true,
        series: [
          {
            name: dataset.title,
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: dataset.data
          }
        ]
      });
    }
  }
};
</script>
