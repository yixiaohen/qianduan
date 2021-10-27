<template>
  <div id="plato" style="widht:600px;height:600px" />
</template>
<script>
import echarts from 'echarts';

export default {
  created() {},
  mounted() {
    this.$nextTick(() => {
      this.barResourceLine();
    });
  },
  methods: {
    // Top 15 资源类别
    barResourceLine() {
      this.chartResource = echarts.init(document.getElementById('plato'));
      this.chartResource.setOption({
        color: [
          '#008B8B',
          '#D2691E',
          '#FFA07A',
          '#DAA520',
          '#708090',
          '#FFB6C1',
          '#800080',
          '#6A5ACD',
          '#00BFFF',
          '#808000'
        ],
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c}'
        },
        calculable: false,
        series: [
          {
            name: '矩形图',
            type: 'treemap',
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: '{b}'
                },
                borderWidth: 1
              },
              emphasis: {
                label: {
                  show: true
                }
              }
            },
            data: [
              {
                name: 'AWS Support',
                value: 203012.57364371105
              },
              {
                name: 'EC2',
                value: 112693.87480828712
              },
              {
                name: 'RDS',
                value: 59012.87134224459
              },
              {
                name: 'EBSIOPS',
                value: 39120.39509683108
              },
              {
                name: 'EBSStorage',
                value: 37062.41383935032
              },
              {
                name: 'Snapshot',
                value: 16404.942635577423
              },
              {
                name: 'DataTransfer',
                value: 5183.006147636791
              },
              {
                name: 'RDSStorageIOPS',
                value: 5040.482974901292
              },
              {
                name: 'RDSStorage',
                value: 4898.374263534597
              },
              {
                name: 'ELB',
                value: 3600.0120000000625
              },
              {
                name: 'NAT',
                value: 3160.565892840107
              },
              {
                name: 'DX',
                value: 2162.939999999996
              },
              {
                name: 'CloudWatch',
                value: 2111.511157597098
              },
              {
                name: 'ElasticSearch Instance',
                value: 1575.0739999999996
              },
              {
                name: 'ElastiCache',
                value: 1375.0159999999992
              }
            ]
          }
        ]
      });
    }
  }
};
</script>
