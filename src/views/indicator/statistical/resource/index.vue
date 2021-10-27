<template>
  <el-container>
    <el-header>
      <el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini">
        <el-form-item label="年月">
          <el-date-picker v-model="month" type="month" placeholder="选择月" />
        </el-form-item>
      </el-form>
    </el-header>
    <el-container>
      <el-aside width="400px" height="calc(100vh - 100px)">
        <el-table
          stripe
          :data="tableData"
          row-key="id"
          border
          size="mini"
          height="calc(100vh - 160px)"
          style="width: 100%; margin-top: 20px"
        >
          <el-table-column align="center" label="单病种（术种）质量控制指标">
            <el-table-column prop="amount1" label="名称" />
            <el-table-column prop="amount2" label="数量" width="60" align="center" />
          </el-table-column>
        </el-table>
      </el-aside>
      <el-main>
        <div ref="echatsRef" style="width:calc(100vw - 700px);height:calc(100vh - 200px)" />
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import echarts from 'echarts';

export default {
  data() {
    return {
      year: '2021', month: '4',
      tableData: [{
        id: 1,
        name: '资源配置',
        amount1: '急性心肌梗死',
        amount2: 600,
        amount3: 10
      }, {
        id: 2,
        name: '心力衰竭',
        amount1: '住院术种数量',
        amount2: 10,
        amount3: 12
      }, {
        id: 3,
        name: '冠状动脉旁路移植术',
        amount1: 'DRG-DRGs 组数',
        amount2: 0,
        amount3: 9
      }, {
        id: 4,
        name: '房颤',
        amount1: 'DRG-CMI',
        amount2: 1263,
        amount3: 17
      }, {
        id: 5,
        name: '主动脉瓣置换术',
        amount1: 'DRG 时间指数',
        amount2: 1088,
        amount3: 15
      }, {
        id: 4,
        name: '二尖瓣置换术',
        amount1: 'DRG 费用指数',
        amount2: 1211,
        amount3: 17
      }
      ],
      spanOneArr: [],
      spanTwoArr: [],
      tableName: [
        '收治病种数量',
        '住院术种数量',
        'DRG-DRGs 组数',
        'DRG-CMI',
        'DRG 时间指数',
        'DRG 费用指数',
        '健康体检人次'
      ],
      tableLint1: [
        1111, 140, 1500, 1203, 321, 544, 6000
      ],
      tableLint2: [
        1211, 120, 1300, 1201, 312, 5640, 700
      ]

    };
  },
  created() {
    this.getJBXXTableData();
  },
  mounted() {
    this.createEcharts();
  },
  methods: {
    getJBXXTableData() {
      this.spanOneArr = [];
      this.spanTwoArr = [];
      let concatOne = 0;
      let concatTwo = 0;
      this.tableData.map((item, index) => {
        if (index === 0) {
          this.spanOneArr.push(1);
          this.spanTwoArr.push(1);
        } else {
          if (item.name === this.tableData[index - 1].name) {
            // 第一列需合并相同内容的判断条件
            this.spanOneArr[concatOne] += 1;
            this.spanOneArr.push(0);
          } else {
            this.spanOneArr.push(1);
            concatOne = index;
          }
          if (
            item.name === this.tableData[index - 1].name &&
            item.amount1 === this.tableData[index - 1].amount1
          ) {
            // 第二列和第1列需合并相同内容的判断条件
            this.spanTwoArr[concatTwo] += 1;
            this.spanTwoArr.push(0);
          } else {
            this.spanTwoArr.push(1);
            concatTwo = index;
          }
        }
      });
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const _row = this.spanOneArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return [_row, _col];
      } else if (columnIndex === 1) {
        const _row = this.spanTwoArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return [_row, _col];
      }
    },
    createEcharts() {
      const main_ = echarts.init(this.$refs.echatsRef);
      this.option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            label: {
              show: true
            }
          }
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        legend: {
          data: ['Growth', 'Budget 2011', 'Budget 2012'],
          itemGap: 5
        },
        grid: {
          top: '12%',
          left: '1%',
          right: '10%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: this.tableName
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '',
            axisLabel: {
              formatter: function(a) {
                a = +a;
                return isFinite(a)
                  ? echarts.format.addCommas(+a)
                  : '';
              }
            }
          }
        ],
        dataZoom: [
          {
            show: true,
            start: 0,
            end: 100
          },
          {
            type: 'inside',
            start: 94,
            end: 100
          },
          {
            show: true,
            yAxisIndex: 0,
            filterMode: 'empty',
            width: 30,
            height: '80%',
            showDataShadow: false,
            left: '93%'
          }
        ],
        series: [
          {
            name: '上个月',
            type: 'bar',
            data: this.tableLint1
          },
          {
            name: '本月',
            type: 'bar',
            data: this.tableLint2
          }
        ]
      };
      main_.setOption(this.option, true);
    }

  }
};
</script>

<style lang="scss">
.el-header {
  height: 35px !important;
}

.el-header,
.el-main,
.el-aside {
  margin: 0;
  padding: 0;
}

.el-table {
  margin: 0 !important;
  padding: 0 !important;
}
</style>
