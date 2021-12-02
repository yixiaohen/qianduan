<template>
  <div>
    <div class="pg">
      <el-form
        :inline="true"
        size="mini"
      />
      <!--      v-if="device === 'desktop'"-->
      <div
        class="main"
      >
        <split-pane
          :default-percent="20"
          :min-percent="10"
          split="vertical"
        >
          <template slot="paneL">
            <div class="content_left">
              <div>
                <el-alert
                  :closable="false"
                  title="指标"
                  type="info"
                  style="font-weight: bolder;"
                />
              </div>
              <IndexNavTree
                ref="standardCatalog"
                @nodeClickCatalog="nodeClickCatalog"
              />
            </div>
          </template>
          <template slot="paneR">
            <div class="content_right">
              <div class="middle">
                <div class="middleHead">
                  <el-alert
                    :closable="false"
                    :title="'指标名称：'+nodeValue.name"
                    type="info"
                    style="font-weight: bolder;"
                  />
                </div>
                <div class="TMContainer">

                  <div style="font-weight: bolder;margin-left: 20px;width: 80%">

                    <el-date-picker
                      v-model="selectYear"
                      type="year"
                      size="mini"
                      style="width: 120px"
                      placeholder="选择年"
                      value-format="yyyy"
                      format="yyyy"
                    />
                    <span class="demonstration">年</span>
                    <el-button type="primary" size="mini" @click="SelectYearClick">查找
                    </el-button>

                  </div>
                  <el-card
                    style="width: 98%;margin: 10px"
                  >
                    <div><span>图表展示</span></div>
                    <div ref="echatsRef" style="height:calc(100vh - 260px);overflow: auto"/>
                  </el-card>

                </div>
              </div>
            </div>
          </template>
        </split-pane>


      </div>
    </div>
  </div>
</template>
<script>
import splitPane from 'vue-splitpane';
import { mapGetters } from 'vuex';
import echarts from 'echarts';
import IndexNavTree from '@/views/indicator/components/IndexNavTree';
import { Get_i_data_ListByCycle } from '@/api/indicator/I_ObjValue';

export default {
  components: {
    splitPane,
    IndexNavTree
  },
  data() {
    return {
      targetDataLoading: false, // 表格加载等待
      isYearOrMonth: 2, // 按照年份还是年月查找数据，这里默认展示按年月
      selectYear: null, // 选中的年份
      echartData: [], // 图表数据
      echartXNameData: [], // X轴名称数据
      echartYNumData: [], // Y轴Number数据
      echartYTargetData: [], // Y轴Number_Target数据
      treeLoading: false, // 指标导航树等待圈
      treeData: [], // 指标导航树数据
      defaultProps: {
        children: 'children',
        label: 'name'
      }, // 指标导航树叶子标识
      isExpandAll: true, // 是否展开指标导航树
      defaultKey: 0, // 指标导航树选中节点id
      treeCurrentEdit: -1, // 当前选择指标导航树所在节点
      nowNode: '', // 现在所点击的指标导航树节点
      GuidelinesData: [], // 指标描述数据
      parameterData: [], // 指标中的参数数据
      targetData: [], // 对应指标的目标值数据

      indexYear: '2021', // 指标年份

      nodeValue: {
        name: ''
      }
    };
  },
  created() {
    let h = window.innerHeight;
    if (h < 750) h = 750;
    this.middlePercent = ((h - 629) / (h - 183)) * 100;
  },
  computed: {
    ...mapGetters(['device'])
  },
  methods: {
    // 搜索年
    async SelectYearClick() {

      if (this.selectYear === null) {
        const times = new Date();
        this.selectYear = times.getFullYear() + ''; // 初始获取年份
      }

      await this.Get_i_data_ListByCycle(); // 获取图表数据
      console.log('数据', this.echartData);

      this.createEcharts();

    },

    // 获取图表数据
    async Get_i_data_ListByCycle() {
      try {
        this.echartData = []; // 清空数据
        this.echartXNameData = []; // 清空数据
        this.echartYNumData = []; // 清空数据
        this.echartYTargetData = []; // 清空数据
        if (this.selectYear === null) {
          const times = new Date();
          this.selectYear = times.getFullYear() + ''; // 初始获取年份
        }
        const { data, code } = await Get_i_data_ListByCycle({
          index_Id: this.nodeValue.index_id,
          year: this.selectYear
        });
        if (code === 200) {
          this.echartData = data;

          this.echartData.map((item) => {
            this.echartXNameData.push(item.Month + '月');
            this.echartYNumData.push(item.Number);
            this.echartYTargetData.push(item.Number_Target);
          });

        }
      } catch (e) {
        console.log(e);
      }
    },
    // 查询指标，获取指标导航树数据,// 单击指标导航树
    async nodeClickCatalog(value) {
      this.isShowTH = false; // 只要点击节点，先隐藏表头
      console.log(value);
      this.nodeValue = value;

      await this.Get_i_data_ListByCycle();

      this.createEcharts();
    },
    createEcharts() {
      const colors = ['#5470C6', '#91CC75'];

      const main_ = echarts.init(this.$refs.echatsRef);
      this.option = {
        color: colors,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        grid: {
          left: '5%',
          right: '10%',
          bottom: '1%',
          containLabel: true
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        legend: {
          data: ['月份', '目标值']
        },
        xAxis: [
          {
            type: 'category',
            axisTick: {
              alignWithLabel: true
            },
            data: this.echartXNameData
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '数量',
            position: 'left',
            axisLine: {
              show: true,
              lineStyle: {
                color: colors[0]
              }
            },
            axisLabel: {
              formatter: '{value} '
            }
          }
        ],
        series: [
          {
            name: '月份',
            type: 'bar',
            data: this.echartYNumData,
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
            barWidth: 40 // 柱形图宽度
          },
          {
            name: '目标值',
            type: 'line',
            data: this.echartYTargetData,
            itemStyle: { // 上方显示数值
              normal: {
                // color: '#13ce66',
                label: {
                  show: true, // 开启显示
                  position: 'top', // 在上方显示
                  textStyle: { // 数值样式
                    color: '#91CC75'
                  }
                }
              }
            },
            barWidth: 40 // 柱形图宽度
          }
        ]
      };
      main_.setOption(this.option, true);
      this.$nextTick(() => {
        this.echartData = []; // 清空数据
        this.echartXNameData = []; // 清空数据
        this.echartYNumData = []; // 清空数据
        this.echartYTargetData = []; // 清空数据
      });
    }

  }
};
</script>
<style lang="scss">
@import "src/styles/loading.scss";


.lineTree {
  height: 76vh;
  overflow: auto;
  margin-top: 2px;
  border-top: 1px solid #c0bebe;
  border-bottom: 1px dotted #c0bebe;

  .el-tree-node__content {
    border-bottom: 1px solid rgb(235, 235, 235);
  }
}

.TMContainer {
  font-size: 1vh;
  font-weight: bolder;

  .el-row:nth-child(1), .el-row:nth-child(4) {

    margin-top: 20px;
    margin-left: 20px;
    margin-right: 20px;

    .el-col {
      height: 40px;
      //border: 1px solid #13ce66;
      background-color: #f4f4f5;
      line-height: 40px;
      text-align: center;
      padding-left: 5%;


      .td {
        padding-right: 0;
      }

      .el-input {
      }
    }
  }

  .el-row:nth-child(2), .el-row:nth-child(3) {

    margin-left: 20px;
    margin-right: 20px;

    .el-col {
      height: 40px;
      line-height: 40px;
      border: 1px solid #eee;

    }
  }

  .el-row:nth-child(2) {
    margin-top: 10px;
  }

  .el-row:nth-child(2), .el-row:nth-child(4) {
    margin-left: 20px;
    margin-right: 20px;
  }

  .el-row:nth-child(5) {
    margin-top: 20px;
    margin-left: 20px;
    margin-right: 20px;

    .zhuXingTu {
      margin-left: 10px;
      height: 420px;
    }
  }
}

.pg {
  margin: 4px;

  .main {
    height: calc(100vh - 96px);

    .content_left {
      display: flex;
      display: -webkit-flex;
      flex-direction: column;
      min-width: 170px;
      height: 100%;
      border: 1px solid whitesmoke;
    }

    .content_right {
      display: flex;
      display: -webkit-flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
      border: 1px solid whitesmoke;

      .top {
        font-size: 14px;
        min-height: 20px;
      }

      .middle {
        height: 100%;

        .middleHead {
          flex-basis: 20px;
        }

        .middleBody {
          height: calc(100% - 34px);
          overflow-y: hidden;

          .middleBodyTb {
            max-height: calc(100% - 37px);
          }
        }
      }

      .bottom {
        height: 100%;
        font-size: 14px;

        .bottomBody {
          height: calc(100% - 45px);
          overflow-y: hidden;

          .bottomBodyTb {
            max-height: calc(100% - 48px);
          }
        }
      }
    }
  }

  .htmlPane {
    height: calc(100vh - 390px);
    border: 2px solid whitesmoke;
    border-radius: 5px;
    padding: 5px;
    overflow-y: auto;
  }

  .el-card__header {
    padding: 2px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;

    .el-form-item {
      margin: 5px 0;
      margin-left: 10px;
    }
  }

}
</style>
