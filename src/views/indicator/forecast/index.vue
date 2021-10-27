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
        <el-card>
          <div class="rightContent">
            <el-radio-group v-model="radio" size="mini" @change="Switch">
              <el-radio-button label="已超标" />
              <el-radio-button label="不合格" />
              <el-radio-button label="已逾期" />
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
              prop="AnticDeployName"
              label="指标名称"
              width="180"
              align="center"
            />
            <el-table-column
              prop="Granularity"
              label="粒度"
              width="180"
              align="center"
            />
            <el-table-column
              prop="LowerLimit"
              label="上限"
              align="center"
            />
            <el-table-column
              prop="UpperLimit"
              label="下限"
              align="center"
            />
            <el-table-column
              prop="AnticState"
              label="状态"
              align="center"
            >
              <template slot-scope="{ row }">
                <el-tag type="danger">
                  {{ row.AnticState }}
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
      /* 图表 */
      ChartWarShow: [], // 图表预警信息率
      overproof: 0, // 超标率
      qualified: 0, // 不合格率
      overdue: 0, // 已逾期率
      /* 列表 */
      radio: '已超标',
      forecastData: [
        {
          AnticDeployID: 33, // 指标id
          AnticDeployName: '实际开放床位', // 指标名称
          ParticleSizeID: null, // 粒度id
          Granularity: '', // 粒度名
          UpperLimit: 2, // 上限
          LowerLimit: 0, // 下限
          AnticState: '已超标' // 状态
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
.block{
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
      border: 1px solid #b3d3c2;
      border-top: none;
      .leftContentHeader {
        height: 40px;
        font-size: 16px;
        font-weight: bolder;
        padding-top: 8px;
        padding-left: 20px;
        border: 1px solid #b3d3c2;
        border-left: none;
        border-right: none;
        background-color: #e7faf0;
      }

      .leftContentTop {
        text-align: center;
        font-weight: bolder;
        font-size: 16px;
        border-bottom: 1px solid #b3d3c2;
      }
      .leftContentBottom {
        width: 200px;
        height: 204px;
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
    border-bottom: 1px solid #b3d3c2;
    border-right: 1px solid #b3d3c2;
    .rightTop {
      height: 40px;
      font-size: 16px;
      font-weight: bolder;
      padding-top: 8px;
      padding-left: 20px;
      background-color: #e7faf0;
      border: 1px solid #b3d3c2;
      border-left: none;
    }

    .el-card {
      .rightContent {
        border-bottom: 1px solid #b3d3c2;
        padding-bottom: 8px;
      }

    }


  }


}
</style>
