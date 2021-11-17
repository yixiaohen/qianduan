@
<template>
  <el-card>
    <div class="container">

      <div class="left">
        <div class="leftContent">
          <div class="leftContentHeader">
            <span>图表</span>
          </div>
          <div class="leftContentTop">超标率</div>
          <div class="leftContentBottom">
            <progress-bar
              :completed-steps="overproof"
              start-color="#FF5D60"
              stop-color="#f190e5"
              class="progress"
            >
              <p class="progress-title">超标率</p>
              <p class="progress-value">{{ overproof }}<span>%</span></p>
            </progress-bar>
          </div>
        </div>
        <div class="leftContent">
          <div class="leftContentTop">不合格率</div>
          <div class="leftContentBottom">
            <progress-bar
              :completed-steps="qualified"
              start-color="#FF5D60"
              stop-color="#f190e5"
              class="progress"
            >
              <p class="progress-title">不合格率</p>
              <p class="progress-value">{{ qualified }}<span>%</span></p>
            </progress-bar>
          </div>
        </div>
        <div class="leftContent">
          <div class="leftContentTop">逾期率</div>
          <div class="leftContentBottom">
            <progress-bar
              :completed-steps="overdue"
              start-color="#FF5D60"
              stop-color="#f190e5"
              class="progress"
            >
              <p class="progress-title">逾期率</p>
              <p class="progress-value">{{ overdue }}<span>%</span></p>
            </progress-bar>
          </div>
        </div>


      </div>
      <div class="right">
        <div class="rightTop">
          <span>列表</span>
        </div>
        <div class="serach" style="font-weight: bolder;">
          <span class="demonstration">查找:</span>
          <el-radio-group v-model="isYearOrMonth" size="mini" @change="isYearOrMonthc">
            <el-radio-button :label="1">按年份</el-radio-button>
            <el-radio-button :label="2">按年月</el-radio-button>
          </el-radio-group>
          <el-date-picker
            v-if="isYearOrMonth===1"
            v-model="selectYear"
            :clearable="false"
            type="year"
            size="mini"
            style="width: 120px"
            placeholder="选择年"
            value-format="yyyy"
            format="yyyy"
          />
          <span v-if="isYearOrMonth===1" class="demonstration">年</span>
          <el-button v-if="isYearOrMonth===1" type="primary" size="mini" @click="SelectYearClick">搜索</el-button>
          <el-date-picker
            v-if="isYearOrMonth===2"
            v-model="selectYear"
            :clearable="false"
            type="year"
            size="mini"
            style="width: 120px"
            placeholder="选择年"
            value-format="yyyy"
            format="yyyy"
          />
          <span v-if="isYearOrMonth===2" class="demonstration">年</span>
          <el-date-picker
            v-if="isYearOrMonth===2"
            v-model="selectMonth"
            :clearable="false"
            type="month"
            size="mini"
            format="MM"
            style="width: 120px"
            value-format="MM"
            placeholder="选择月"
          />
          <span v-if="isYearOrMonth===2" class="demonstration">月</span>
          <el-button v-if="isYearOrMonth===2" type="primary" size="mini" @click="SelectMonthClick()">搜索</el-button>
        </div>
        <el-card>
          <div class="rightContent">
            <el-radio-group v-model="radio" size="mini" @change="Switch">
              <el-radio-button label="A">已超标</el-radio-button>
              <el-radio-button label="B">合格</el-radio-button>
              <el-radio-button label="C">已逾期</el-radio-button>
            </el-radio-group>
          </div>
          <el-table
            :data="forecastData"
            style="width: 100%"
            border
            size="medium"
            height="550"
            highlight-current-row
          >
            <el-table-column
              prop="name"
              label="指标名称"
              width="180"
              align="center"
            />

            <el-table-column
              prop="Number1"
              label="指标预警值1"
              align="center"
            />
            <el-table-column
              prop="Number2"
              label="指标预警值2"
              align="center"
            />
            <el-table-column
              prop="state"
              label="状态"
              align="center"
            >
              <template slot-scope="{ row }">
                <el-tag type="danger">
                  {{ row.state }}
                </el-tag>
              </template>


            </el-table-column>

          </el-table>
          <div class="block">
            <el-pagination
              :page-sizes="pagination.pageSizes"
              :page-size="pagination.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :current-page="listQuery.pageIndex"
              :total="pagination.Total"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
            />
            <!-- :current-page="listQuery.pageIndex"为当前页-->
          </div>
        </el-card>


      </div>

    </div>
  </el-card>
</template>

<script>
import progressBar from '@/views/components/progress';
import { AnticStateRadio, SelectAnticState } from '@/api/indicatorSet/I_AnticDeploy';

export default {
  components: {
    progressBar
  },
  data() {
    return {
      /* 搜索 */
      isYearOrMonth: 2, // 按照年份还是年月查找数据，这里默认展示按年月
      selectYear: '', // 选中的年份
      selectMonth: '', // 选中的月份
      /* 图表 */
      ChartWarShow: [], // 图表预警信息率
      overproof: 0, // 超标率
      qualified: 0, // 不合格率
      overdue: 0, // 已逾期率
      /* 列表 */
      radio: 'A',
      forecastData: [
        {
          AnticDeployID: 33, // 指标id
          AnticDeployName: '', // 指标名称
          // ParticleSizeID: null, // 粒度id
          // Granularity: '', // 粒度名
          // UpperLimit: 2, // 上限
          // LowerLimit: 0, // 下限
          year: '',
          month: '',
          AnticState: '' // 状态
        }
      ], // 列表数据
      listQuery: { // 分页数据
        pageIndex: 1,
        pageSize: 10
      },
      pagination: { // 分页数据
        pageIndex: 1,
        pageSize: 10,
        pageSizes: [5, 10, 20, 50, 100, 200],
        Total: null
      }
    };
  },
  created() {
    this.AnticStateRadio();


  },
  methods: {
    /* 搜索 */
    // 切换查找条件，年份还是月份切换之后的处理事件
    isYearOrMonthc() {
      const times = new Date();
      this.selectYear = times.getFullYear() + ''; // 初始获取年份
      this.selectMonth = times.getMonth() + ''; // 初始获取年份
      // this.selectMonth = ''; // 搜索月份框置为空
    },
    SelectYearClick() {
      console.log('点击了1');
      console.log( this.selectYear);
      console.log( this.selectMonth);
      if (this.selectYear === null || this.selectMonth === null) {
        const times = new Date();
        this.selectYear = times.getFullYear() + ''; // 初始获取年份
        this.selectMonth = null;
      }
      this.$nextTick(() => {
        this.SelectAnticState();
      });

    },
    SelectMonthClick() {
      console.log('点击了2');
      console.log( this.selectYear);
      console.log( this.selectMonth);
      if (this.selectYear === null || this.selectMonth === null) {
        const times = new Date();
        this.selectYear = times.getFullYear() + ''; // 初始获取年份
        this.selectMonth = times.getMonth() + ''; // 初始获取年份
      }
      this.$nextTick(() => {
        this.SelectAnticState();
      });
    },
    /* 图表开始 */
    // 查询图表数据
    async AnticStateRadio() {
      try {
        const { data, code } = await AnticStateRadio();

        if (code === 200) {
          this.ChartWarShow = data;
          console.log(this.ChartWarShow[0]);
          this.ChartWarShow = this.ChartWarShow[0]; // 图表预警信息率

          this.overproof = this.ChartWarShow['已超标率'] * 100;
          this.overproof = this.overproof.toFixed(2) * 1; // 取两位小数点

          this.qualified = this.ChartWarShow['不合格率'] * 100;
          this.qualified = this.qualified.toFixed(2) * 1;

          this.overdue = this.ChartWarShow['已逾期率'] * 100;
          this.overdue = this.overdue.toFixed(2) * 1;
          this.$nextTick(() => {
            /* 加载数据时就初始化年月*/
            const times = new Date();
            /* 一定要注意，日期组件不能用数值，一定要转为字符串！！ */
            this.selectYear = times.getFullYear() + ''; // 初始获取年份
            this.selectMonth = times.getMonth() + ''; // 默认展示上个月的数据所以不需要加1

            this.SelectAnticState();
          });
        }
      } catch (e) {
        console.log(e);
      }
    },
    /* 图表结束 */
    /* 列表开始 */
    // 获取不同列表数据
    async SelectAnticState() {
      try {
        const { data, code } = await SelectAnticState(
          {
            AnticState: this.radio,
            year: this.selectYear,
            month: this.selectMonth,
            pageIndex: this.listQuery.pageIndex,
            pageSize: this.listQuery.pageSize
          }
        );

        if (code === 200) {
          this.forecastData = data.DataList;
          this.pagination.Total = data.Total; // 获取总条数
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 点击切换不同列表数据
    Switch() {
      this.listQuery.pageIndex = 1; // 重置页码为1
      this.SelectAnticState();
    },
    // 列表分页
    // 列表分页当前页
    // 全部信息列表分页当前页
    handleCurrentChange(index) {
      this.listQuery.pageIndex = index;
      this.SelectAnticState(); // 跳转页面后刷新列表
    },
    // 全部信息列表分页一页多少显示条数据
    handleSizeChange(page) {
      this.listQuery.pageSize = page;
      this.SelectAnticState(); // 跳转页面后刷新列表
    }

    /* 列表结束 */
  }
};
</script>

<style lang="scss" scoped>
//分页栏距离表格
.block {
  margin-top: 10px;
}

.container {
  border: 1px solid #eee;
  margin: 10px;
  display: flex;
  justify-content: center;

  .left {
    width: 30%;
    display: flex;
    flex-direction: column;

    .leftContent {
      border: 0.5px solid #d0d0d0;
      border-top: none;

      .leftContentHeader {
        height: 40px;
        font-size: 16px;
        font-weight: bolder;
        padding-top: 8px;
        padding-left: 20px;
        border: 0.5px solid #d0d0d0;
        //border-left: none;
        //border-right: none;
        background-color: #f4f4f5;
      }

      .leftContentTop {
        text-align: center;
        font-weight: bolder;
        font-size: 16px;
        border-bottom: 0.5px solid #d0d0d0;
      }

      .leftContentBottom {
        width: 200px;
        height: 214px;
        margin: 0 auto;
        padding-top: 30px;
        text-align: center;

        .progress {
          height: 200px;
          margin: 0 auto;
        }
      }
    }
  }

  .right {
    width: 70%;
    border-bottom: 0.5px solid #d0d0d0;
    border-right: 0.5px solid #d0d0d0;

    .rightTop {
      height: 40px;
      font-size: 16px;
      font-weight: bolder;
      padding-top: 8px;
      padding-left: 20px;
      background-color: #f4f4f5;
      border: 0.5px solid #d0d0d0;
      border-left: none;
    }

    .serach {
      margin-left: 20px;

      .demonstration {
        margin-right: 4px;
      }
    }

    .el-card {
      .rightContent {
        border-bottom: 0.5px solid #f4f4f5;
        padding-bottom: 8px;
      }

    }


  }


}
</style>
