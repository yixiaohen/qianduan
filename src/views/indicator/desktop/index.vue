<template>
  <div class="desktopContainer">
    <el-row :gutter="10">
      <el-col :span="12">
        <el-card>
          <el-tag style="width: 100%;height: 30px;" type="success">
            <span>数据统计1</span>
          </el-tag>

          <div ref="main1_" class="main1_"/>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-row>
          <el-col>
            <el-card>
              <el-tag style="width: 100%;height: 30px;" type="success">
                <span>数据统计2</span></el-tag>
              <div ref="main2_" class="main2_"/>
            </el-card>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-card>
              <el-tag style="width: 100%;height: 30px;" type="success">
                <span>数据统计3</span></el-tag>
              <div ref="main3_" class="main3_"/>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-card>
          <el-tag style="width: 100%;height: 30px;" type="success">
            <span>数据统计4</span></el-tag>
          <div ref="main4_" class="main4_"/>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>

import echarts from 'echarts';

export default {
  data() {
    return {};
  },
  created() {

  },
  mounted() {
    this.contat1();
    this.contat2();
    this.contat3();
    this.contat4();
  },
  methods: {
    /** ************************************************************
     *字符串解密
     *   str：需要解密的字符串
     ****************************************************************/

    contat1() {
      var chartDom = this.$refs.main1_;
      var myChart = echarts.init(chartDom);
      var option;
      const colors = ['#5470C6', '#91CC75', '#EE6666'];
      option = {
        color: colors,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        grid: {
          right: '20%'
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        legend: {
          data: ['Evaporation', 'Precipitation', 'Temperature']
        },
        xAxis: [
          {
            type: 'category',
            axisTick: {
              alignWithLabel: true
            },
            // prettier-ignore
            data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: 'Evaporation',
            min: 0,
            max: 250,
            position: 'right',
            axisLine: {
              show: true,
              lineStyle: {
                color: colors[0]
              }
            },
            axisLabel: {
              formatter: '{value} ml'
            }
          },
          {
            type: 'value',
            name: 'Precipitation',
            min: 0,
            max: 250,
            position: 'right',
            offset: 80,
            axisLine: {
              show: true,
              lineStyle: {
                color: colors[1]
              }
            },
            axisLabel: {
              formatter: '{value} ml'
            }
          },
          {
            type: 'value',
            name: '温度',
            min: 0,
            max: 25,
            position: 'left',
            axisLine: {
              show: true,
              lineStyle: {
                color: colors[2]
              }
            },
            axisLabel: {
              formatter: '{value} °C'
            }
          }
        ],
        series: [
          {
            name: 'Evaporation',
            type: 'bar',
            data: [
              2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3
            ]
          },
          {
            name: 'Precipitation',
            type: 'bar',
            yAxisIndex: 1,
            data: [
              2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
            ]
          },
          {
            name: 'Temperature',
            type: 'line',
            yAxisIndex: 2,
            data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
          }
        ]
      };
      option && myChart.setOption(option);
    },
    contat2() {
      var chartDom = this.$refs.main2_;
      var myChart = echarts.init(chartDom);
      var option;
      option = {
        title: {
          text: 'Stacked Line'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'Email',
            type: 'line',
            stack: 'Total',
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: 'Union Ads',
            type: 'line',
            stack: 'Total',
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: 'Video Ads',
            type: 'line',
            stack: 'Total',
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            name: 'Direct',
            type: 'line',
            stack: 'Total',
            data: [320, 332, 301, 334, 390, 330, 320]
          },
          {
            name: 'Search Engine',
            type: 'line',
            stack: 'Total',
            data: [820, 932, 901, 934, 1290, 1330, 1320]
          }
        ]
      };
      option && myChart.setOption(option);
    },
    contat3() {
      var chartDom = this.$refs.main3_;
      var myChart = echarts.init(chartDom);
      var option;
      option = {
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [
              120,
              {
                value: 200,
                itemStyle: {
                  color: '#a90000'
                }
              },
              150,
              80,
              70,
              110,
              130
            ],
            type: 'bar'
          }
        ]
      };
      option && myChart.setOption(option);
    },
    contat4() {
      var chartDom = this.$refs.main4_;
      var myChart = echarts.init(chartDom);
      var option;
      option = {
        title: {
          text: 'Stacked Area Chart'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
        },
        toolbox: {
          feature: {
            saveAsImage: {}
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
            boundaryGap: false,
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: 'Email',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
              focus: 'series'
            },
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: 'Union Ads',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
              focus: 'series'
            },
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: 'Video Ads',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
              focus: 'series'
            },
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            name: 'Direct',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
              focus: 'series'
            },
            data: [320, 332, 301, 334, 390, 330, 320]
          },
          {
            name: 'Search Engine',
            type: 'line',
            stack: 'Total',
            label: {
              show: true,
              position: 'top'
            },
            areaStyle: {},
            emphasis: {
              focus: 'series'
            },
            data: [820, 932, 901, 934, 1290, 1330, 1320]
          }
        ]
      };
      option && myChart.setOption(option);
    }
  }
};
</script>
<style lang="scss">
.desktopContainer {
  font-weight: bolder;
  margin: 0;
  width: 96%;
  height: 750px;
  overflow-y: auto;
  background-color: #FFFFFF;

  .el-row:nth-child(1) {
    .el-col:nth-child(1) {
      .el-card {
        height: 500px;
      }

      .el-card__body {
        padding: 0;
      }
    }

    .el-col:nth-child(2) {
      .el-row {
        .el-col:nth-child(1) {
          margin-bottom: 10px;

          .el-card {
            height: 245px;
          }
        }
      }
    }
  }


}

.main1_ {
  height: 500px;
}

.main2_ {
  height: 200px;
}

.main3_ {
  height: 220px;
}

.main4_ {
  height: 200px;
}
</style>
