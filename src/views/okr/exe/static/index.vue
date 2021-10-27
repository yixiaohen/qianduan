<template>
  <el-container class="static">
    <el-header style="height: 35px">
      <el-form
        :inline="true"
        :model="formInline"
        class="demo-form-inline"
        size="mini"
      >
        <el-form-item>
          <el-radio-group v-model="isCollapse" size="mini">
            <el-radio-button :label="false">日报</el-radio-button>
            <el-radio-button :label="true">周报</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="formInline.Date"
            size="mini"
            range-separator="-"
            value-format="yyyy-MM"
            type="month"
            placeholder="选择年月"
          />
        </el-form-item>
        <el-form-item>
          <default-depts
            w="100%"
            @getDefaultDeptsValue="getDefaultDeptValues"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="formInline.usename"
            placeholder="请输入姓名"
            @keyup.enter.native="Select()"
          >
            <i slot="prefix" class="el-input__icon el-icon-search" />
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="formInline.checked">只看主管</el-checkbox>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main style="height: calc(100vh - 180px) !important;">
      <div style="display: flex;widht100%;height:100%;flex-flow: row wrap;">
        <div ref="echartsRef2" style="flex: 1" />
        <div ref="echartsRef" style="flex: 1" />
        <div ref="echartsRef3" style="flex: 1" />
      </div>
    </el-main>
    <el-footer style="height: 30px">
      <el-row>
        <el-col :span="1">
          <el-switch v-model="cellOverflow" style="margin: 6px 0px" />
        </el-col>
        <el-col :span="20">
          <el-pagination
            background
            :current-page.sync="formInline.pageIndex"
            :page-size="formInline.pageSize"
            :page-sizes="[10, 20, 30, 40, 50]"
            :total="formInline.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-col>
      </el-row>
    </el-footer>
  </el-container>
</template>
<script>
import defaultDepts from '@/views/components/defaultDepts';
import echarts from 'echarts';

export default {
  components: { defaultDepts },
  data() {
    return {
      isCollapse: false,
      formInline: {
        Date: '',
        Dept: '',
        checked: false,
        usename: '',
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      cellOverflow: false
    };
  },

  mounted() {
    window.addEventListener('resize', this.initEchart, 20);
    this.Select();
  },
  created() {
    this.getToday();
  },
  methods: {
    getToday() {
      const date = new Date();
      const year = date.getFullYear().toString();
      const month =
        date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1).toString()
          : (date.getMonth() + 1).toString(); // '04'
      const today = year + '-' + month;
      this.formInline.Date = today;
    },
    getDefaultDeptValues(val) {
      this.formInline.Dept = val;
    },
    initEchart() {
      this.echart = echarts.init(this.$refs.echartsRef);
      this.echart.resize();
    },
    async Select() {
      const myChart = echarts.init(this.$refs.echartsRef);
      const myChart2 = echarts.init(this.$refs.echartsRef2);
      const myChart3 = echarts.init(this.$refs.echartsRef3);
      this.option = {
        title: {
          text: '目标统计',
          subtext: '',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '50%',
            data: [
              { value: 1048, name: '个人' },
              { value: 735, name: '团队' },
              { value: 580, name: '院级' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      myChart.setOption(this.option);

      var base = +new Date(1968, 9, 3);
      var oneDay = 24 * 3600 * 1000;
      var date = [];

      var data = [Math.random() * 300];

      for (var i = 1; i < 20000; i++) {
        var now = new Date((base += oneDay));
        date.push(
          [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/')
        );
        data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
      }

      this.option2 = {
        tooltip: {
          trigger: 'axis',
          position: function(pt) {
            return [pt[0], '10%'];
          }
        },
        title: {
          left: 'center',
          text: '大数据量面积图'
        },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: date
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%']
        },
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 10
          },
          {
            start: 0,
            end: 10
          }
        ],
        series: [
          {
            name: '模拟数据',
            type: 'line',
            symbol: 'none',
            sampling: 'lttb',
            itemStyle: {
              color: 'rgb(255, 70, 131)'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgb(255, 158, 68)'
                },
                {
                  offset: 1,
                  color: 'rgb(255, 70, 131)'
                }
              ])
            },
            data: data
          }
        ]
      };
      this.option3 = {
        dataset: {
          source: [
            ['score', 'amount', 'product'],
            [89.3, 58212, 'Matcha Latte'],
            [57.1, 78254, 'Milk Tea'],
            [74.4, 41032, 'Cheese Cocoa'],
            [50.1, 12755, 'Cheese Brownie'],
            [89.7, 20145, 'Matcha Cocoa'],
            [68.1, 79146, 'Tea'],
            [19.6, 91852, 'Orange Juice'],
            [10.6, 101852, 'Lemon Juice'],
            [32.7, 20112, 'Walnut Brownie']
          ]
        },
        grid: { containLabel: true },
        xAxis: { name: 'amount' },
        yAxis: { type: 'category' },
        visualMap: {
          orient: 'horizontal',
          left: 'center',
          min: 10,
          max: 100,
          text: ['High Score', 'Low Score'],
          // Map the score column to color
          dimension: 0,
          inRange: {
            color: ['#65B581', '#FFCE34', '#FD665F']
          }
        },
        series: [
          {
            type: 'bar',
            encode: {
              // Map the "amount" column to X axis.
              x: 'amount',
              // Map the "product" column to Y axis
              y: 'product'
            }
          }
        ]
      };
      myChart2.setOption(this.option2);
      myChart3.setOption(this.option3);
    },
    handleSizeChange(val) {
    },
    handleCurrentChange(val) {
    }
  }
};
</script>
<style lang="scss">
.static {
  .el-header,
  .el-main,
  .el-footer {
    padding: 0;
    margin: 0;
  }
}
</style>
