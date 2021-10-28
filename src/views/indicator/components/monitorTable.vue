<template>
  <el-container>
    <el-header>
      <!--      <el-form :inline="true" class="demo-form-inline" size="mini">-->
      <!--        <el-form-item label="年月" >-->
      <!--          <el-date-picker v-model="month" type="month" placeholder="选择月"/>-->
      <!--        </el-form-item>-->
      <!--      </el-form>-->
    </el-header>
    <el-container>
      <el-aside width="400px" height="calc(100vh - 200px)">
        <el-table
          stripe
          :data="MonitorData"
          row-key="id"
          border
          size="small"
          height="calc(100vh - 330px)"
          style="width:100%; margin-top: 20px;margin-bottom: 20px"
        >
          <el-table-column align="center" :label="igroupname">
            <el-table-column prop="指标名称" label="指标名称" align="center"/>
            <el-table-column prop="本月" label="数量" width="60" align="center"/>

          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
            :page-sizes="pagination.pageSizes"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :current-page="pageIndex"
            :total="total"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"

          />
          <!-- :current-page="listQuery.pageIndex"为当前页-->
        </div>
      </el-aside>
      <el-main>
        <div ref="echatsRef" style="width:calc(100vw - 700px);height:calc(100vh - 200px)"/>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import echarts from 'echarts';
// import { BaseMonitor } from '@/api/indicatorSet/I_Monitor';

export default {
  props: ['igroupid', 'igroupname', 'MonitorData', 'igroupnameData', 'igroupCountData', 'igroupLCountData', 'total', 'pageIndex', 'pageSize'],
  data() {
    return {
      year: '2021', month: '4',
      // MonitorData: [], // 列表数据
      // igroupnameData: [] // 指标名称数组，用来显示图标x轴
      listQuery: { // 分页数据
        pageIndex: 1,
        pageSize: 10
      },
      pagination: { // 分页数据
        pageIndex: 1,
        pageSize: 10,
        pageSizes: [5, 10, 20, 50, 100, 200]
      }
    };
  },

  updated() {
    this.createEcharts();
  },
  methods: {

    // 列表分页当前页
    // 全部信息列表分页当前页
    handleCurrentChange(index) {
      this.pageIndex = index; // 子组件改变页码传给父组件进行重新查找数据
      this.$emit('handleCurrentChange', index, this.pageSize);
    },
    // 全部信息列表分页一页多少显示条数据
    handleSizeChange(page) {
      this.pageSize = page;
      this.$emit('handleSizeChange', this.pageIndex, page);

    },


    createEcharts() {
      console.log('1', this.pageIndex);
      console.log('2', this.pageSize);

      const main_ = echarts.init(this.$refs.echatsRef);
      this.option = {
        title: {
          text: this.igroupname,
          subtext: ''
        },
        legend: {
          data: ['上个月', '本月']
        },
        toolbox: {
          show: true,
          feature: {
            dataView: { show: true, readOnly: false },
            // magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        xAxis: [
          {
            show: true, // 是否显示 x 轴
            type: 'category',
            data: this.igroupnameData,
            axisLabel: { interval: ''}
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '上个月',
            type: 'bar',
            itemStyle: { // 上方显示数值
              normal: {
                label: {
                  show: true, // 开启显示
                  position: 'top', // 在上方显示
                  textStyle: { // 数值样式
                    color: 'black',
                    fontSize: 12
                  }
                }
              }
            },
            data: this.igroupLCountData,
            barWidth: 20 // 柱形图宽度
          },
          {
            name: '本月',
            type: 'bar',
            itemStyle: { // 上方显示数值
              normal: {
                // color: '#13ce66',
                label: {
                  show: true, // 开启显示
                  position: 'top', // 在上方显示
                  textStyle: { // 数值样式
                    color: 'black',
                    fontSize: 12
                  }
                }
              }
            },
            data: this.igroupCountData,
            barWidth: 20 // 柱形图宽度
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

.el-main {
  padding-left: 50px;
}

.el-table {
  margin: 0 !important;
  padding: 0 !important;
}

//分页栏距离表格
.block {
  margin-top: 10px;
}
</style>
