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
      <el-aside width="450px" height="calc(100vh - 330px)">
        <el-table
          stripe
          :data="monitorTableData"
          row-key="id"
          border
          size="small"
          height="calc(100vh - 330px)"
          style="width:100%;margin-bottom: 20px"
        >
          <el-table-column align="center" :label="igroupname">
            <el-table-column prop="name" label="指标名称" align="center">
              <template slot-scope="{ row }">
                <el-link v-if="row.para===1||row.type===1" type="primary" @click="indexClick(row)">
                  {{ row.name }}
                </el-link>
                <span v-else >{{ row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="number" label="数量" width="60" align="center"/>

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
        <div ref="echatsRef" style="width:calc(100vw - 300px);height:calc(100vh - 300px);overflow: auto"/>
      </el-main>
      <el-dialog
        :title="groupRecord.configIndexTitle"
        :visible.sync="groupRecord.visible"
        width="60%"
      >
        <el-card style="width: 100%;text-align: center">

          <el-table
            :data="monitorDataDetail"
            v-loading="groupRecord.tableLoading"
            border
            style="width: 90%;margin: 20px"
            size="mini"
            highlight-current-row
          >
            <el-table-column
              type="index"
              label="序号"
              align="center"
              width="50"
            />

            <el-table-column
              prop="name"
              label="参数名称"
              align="center"
            />
            <el-table-column
              prop="DeptName"
              label="科室"
              align="center"
            />
            <el-table-column
              prop="number"
              label="数量"
              width="120"
              align="center"
            />

          </el-table>
          <!--                        分页-->
          <div class="block">
            <el-pagination
              :page-sizes="pagination2.pageSizes"
              :page-size="pagination2.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :current-page="listQuery2.pageIndex"
              :total="pagination2.Total"
              @current-change="handleCurrentChange2"
              @size-change="handleSizeChange2"
            />
            <!-- :current-page="listQuery.pageIndex"为当前页-->
          </div>
        </el-card>
        <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="groupRecord.visible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="groupRecord.visible = false">确 定</el-button>
      </span>
      </el-dialog>
    </el-container>

  </el-container>
</template>
<script>
import echarts from 'echarts';
import { GetDataDetail } from '@/api/indicatorSet/I_Monitor';

export default {
  props: [
    'igroupid',
    'monitorTableData',
    'igroupname',
    'monitorData',
    'igroupnameData',
    'igroupCountData',
    'igroupLCountData',
    'total',
    'pageIndex',
    'pageSize'],
  data() {
    return {

      rowData: [], // 暂存点击的单条监测数据
      monitorDataDetail: [], // 单条监测数据明细数据
      groupRecord: {
        visible: false, // 是否展示添加或者修改对话框
        tableLoading: false, // 加载全部监测数据参数等待圈控制
        configIndexTitle: '监测数据' // 对话框标题
      }, // 单条监测数据

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
      },
      listQuery2: { // 单条监测数据分页数据
        pageIndex: 1,
        pageSize: 10
      },
      pagination2: { // 分页数据
        pageIndex: 1,
        pageSize: 10,
        pageSizes: [5, 10, 20, 50, 100, 200],
        Total: null
      }
    };
  },

  updated() {
    this.createEcharts();
  },
  methods: {
    // 点击单条监测数据查看明细
    indexClick(row) {
      this.rowData = row; // 保存此时点击的数据，作为传参
      this.groupRecord.visible = true;
      this.groupRecord.configIndexTitle = row.name;
      console.log(row);
      this.GetDataDetail(row);
    },
    // 获取单条监测数据
    async GetDataDetail(row) {
      this.groupRecord.tableLoading = true; // 打开表格数据加载条
      try {
        const { data, code } = await GetDataDetail({
          indexId: row.Index_ID,
          para: row.para || 0,
          type: row.type || 0,
          pageIndex: this.listQuery2.pageIndex,
          pageSize: this.listQuery2.pageSize
        });
        if (code === 200) {
          this.monitorDataDetail = data.DataList;
          this.pagination2.Total = data.Total;
          this.groupRecord.tableLoading = false; // 关闭表格数据加载条
        }
      } catch (e) {
        console.log(e);
        this.groupRecord.tableLoading = false; // 关闭表格数据加载条
      }
    },
    // 单条监测数据分页当前页
    handleCurrentChange2(index) {
      this.listQuery2.pageIndex = index;
      this.indexClick(this.rowData); // 跳转页面后刷新列表
    },
    // 单条监测数据分页一页多少显示条数据
    handleSizeChange2(page) {
      this.listQuery2.pageSize = page;
      this.indexClick(this.rowData); // 跳转页面后刷新列表
    },
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
        grid: {
          left: '0%',
          right: '0',
          bottom: '1%',
          containLabel: true
        },
        // title: {
        //   text: this.igroupname,
        //   subtext: ''
        // }, // 表标题
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
            axisLabel: {
              interval: 0,
              rotate: 4, // 倾斜度
              align: 'center',
              fontSize: 10,
              fontWeight: 'bolder',

              margin: 20 // 刻度标签与轴线之间的距离,
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
            name: '上个月',
            type: 'bar',
            itemStyle: { // 上方显示数值
              normal: {
                label: {
                  show: true, // 开启显示
                  position: 'top', // 在上方显示
                  textStyle: { // 数值样式
                    color: 'black'
                  }
                }
              }
            },
            data: this.igroupLCountData,
            barWidth: 40 // 柱形图宽度
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
                    color: 'black'
                  }
                }
              }
            },
            data: this.igroupCountData,
            barWidth: 40 // 柱形图宽度
          }
        ]
      };
      main_.setOption(this.option, true);
    }

  }
};
</script>

<style lang="scss" >
// 导出等待条样式
@import "src/styles/loading.scss";
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
