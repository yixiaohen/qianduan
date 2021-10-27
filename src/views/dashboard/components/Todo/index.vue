<template>
  <div class="todo">
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span>
          <i class="el-icon-message-solid" />
          统计分析
        </span>
      </div>
      <div class="filter-container">
        <el-tabs type="card" @tab-click="handleClick">
          <el-tab-pane label="待办条款">
            <el-table
              v-loading="listLoading"
              border
              size="mini"
              :data="tableData"
              style="width: 100%; margin-bottom: 20px"
              height="calc((100vh - 239px))"
            >
              <el-table-column
                type="index"
                label="序号"
                width="60"
                align="center"
              />
              <el-table-column prop="ItemName" label="事项类型" width="180" />
              <el-table-column prop="Count" label="待办数量" align="center" />
              <el-table-column
                label="操作"
                fixed="right"
                width="100"
                align="center"
              >
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="info"
                    plain
                    @click="goRouter(scope.row, scope)"
                  >查看
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              style="margin: 6px 0 0 0"
              background
              :current-page="pagination.pageIndex"
              :page-size="pagination.pageSize"
              :page-sizes="pagination.pageSizes"
              :total="pagination.total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </el-tab-pane>
          <el-tab-pane label="PDCA循环">
            <svg ref="svg" height="510" width="580">
              <path
                d="M 400 318
           A 180 180 0 0 1 150 318 L 140 330 L 160 260 L 225 235 L 210 250 A 80 80 0 0 0 340 240 z"
                stroke="#f3c23d"
                fill="#fdcb24"
                stroke-width="1"
              />
              <path
                d="M 400 60
           A 180 180 0 0 1 400 318 L 410 330 L 340 315 L 320 235 L 335 250 A 80 80 0 0 0 335 140 z"
                stroke="#d33535"
                fill="#d33535"
                stroke-width="1"
              />
              <path
                d="M 150 60
           A 180 180 0 0 1 400 60 L 410 50 L 390 130 L 315 150 L 330 135 A 80 80 0 0 0 210 140 z"
                stroke="#2c7feb"
                fill="#2c7feb"
                stroke-width="1"
              />
              <path
                d="M 150 318
           A 180 180 0 0 1 150 60 L 142 48 L 205 78 L 220 155 L 210 140 A 80 80 0 0 0 210 250 z"
                stroke="green"
                fill="green"
                stroke-width="1"
                fill-opacity="0.5"
              />

              <!--               <path
                d="M 275 9
           A 180 180 0 0 1 275 369 z"
                stroke="green"
                fill="red"
                stroke-width="1"
                fill-opacity="0.5"
              />
              <path
                d="M 275 9
           A 180 180 0 0 0 275 369 z"
                stroke="green"
                fill="red"
                stroke-width="1"
                fill-opacity="0.5"
              /> -->
              <defs>
                <path id="path1" d="M 240 70 A 90 90 0 0 1 350 100" />
                <path id="path2" d="M 390 170 A 90 90 0 0 1 350 280" />
                <path id="path3" d="M 240 320 A 100 100 0 0 0 320 310" />
                <path id="path4" d="M 160 220 A 90 90 0 0 1 160 140" />
              </defs>

              <g font-size="18" fill="white" style="cursor: hand">
                <text @click="go('P')">
                  <textPath xlink:href="#path1">
                    P：({{ pdcaData[0].Count }})
                  </textPath>
                </text>
                <text @click="go('D')">
                  <textPath xlink:href="#path2">
                    D：({{ pdcaData[1].Count }})
                  </textPath>
                </text>
                <text @click="go('C')">
                  <textPath xlink:href="#path3">
                    C：({{ pdcaData[2].Count }})
                  </textPath>
                </text>
                <text @click="go('A')">
                  <textPath xlink:href="#path4">
                    A：({{ pdcaData[3].Count }})
                  </textPath>
                </text>
              </g>
              <g font-size="20" fill="#16c057">
                <text x="235" y="180">PDCA</text>
                <text x="225" y="210">管理循环</text>
              </g>
              <g font-size="20" fill="green">
                <text x="135" y="410">
                  Plan：（计划）{{ pdcaData[0].ItemName }}
                </text>
                <text x="135" y="440">
                  Do：（执行）{{ pdcaData[1].ItemName }}
                </text>
                <text x="135" y="470">
                  Check：（检查）{{ pdcaData[2].ItemName }}
                </text>
                <text x="135" y="500">
                  Action：（处理）{{ pdcaData[3].ItemName }}
                </text>
              </g>
            </svg>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>

<script>
import waves from '@/directive/waves';
import { SelectPDCACount, SelectWaitCount } from '@/api/notice';

export default {
  directives: { waves },
  data() {
    return {
      listLoading: false,
      tableData: [],
      pdcaData: [
        {
          ItemName: '',
          Count: 0
        },
        {
          ItemName: '',
          Count: 0
        },
        {
          ItemName: '',
          Count: 0
        },
        {
          ItemName: '',
          Count: 0
        }
      ],
      listQuery: {
        pageSize: 150,
        pageIndex: 1,
        condition1: window.userInfo[0].UserID
      },
      pagination: {
        pageIndex: 1,
        total: 0,
        pageSize: 15,
        pageSizes: [15, 20, 50, 100, 150, 200]
      },
      routerMeta: [
        {
          name: '资料未上传',
          path: 'Article',
          value: '2'
        },
        {
          name: '资料已上传',
          path: 'Article',
          value: '1'
        },
        {
          name: '',
          path: 'EvaluationOne',
          value: '3,3'
        },
        {
          name: '',
          path: 'EvaluationTwo',
          value: '3,3'
        },
        {
          name: '',
          path: 'EvaluationThree',
          value: '3,3'
        },
        {
          name: '',
          path: 'EvaluationOne',
          value: '2,2'
        },
        {
          name: '',
          path: 'EvaluationTwo',
          value: '1,1'
        },
        {
          name: '',
          path: 'EvaluationTwo',
          value: '2,1'
        },

        {
          name: '',
          path: 'EvaluationThree',
          value: '3,1'
        },
        {
          name: '',
          path: 'EvaluationThree',
          value: '3,2'
        }
      ]
    };
  },
  created() {
    this.getIni();
    this.SelectWaitCount();
  },
  methods: {
    async getIni() {
      try {
        const para = this.$store.getters.iniPara;
        this.routerMeta[2].name = para.menu_one.replace('审核', '未审核');
        this.routerMeta[3].name = para.menu_two.replace('审核', '未审核');
        this.routerMeta[4].name = para.menu_three.replace('审核', '未审核');
        this.routerMeta[5].name = para.menu_one.replace('审核', '通过');
        this.routerMeta[6].name = para.menu_two.replace('审核', '通过');
        this.routerMeta[7].name = para.menu_two.replace('审核', '退回');
        this.routerMeta[8].name = para.menu_three.replace('审核', '通过');
        this.routerMeta[9].name = para.menu_three.replace('审核', '退回');
      } catch (error) {
        console.log(error);
      }
    },
    goRouter(row, { $index: index }) {
      if (row.ItemName === '新分配任务') {
        this.$router.push({
          name: 'ArticleTable',
          params: { Type: '1' }
        });
      } else if (row.ItemName === '被退回资料') {
        this.$router.push({
          name: 'Article',
          params: { Type: '2' }
        });
      } else if (
        row.ItemName.indexOf('未审资料') != -1 &&
        row.CurrentStatus === '0'
      ) {
        this.$router.push({
          name: 'EvaluationOne',
          params: { UnReview: true }
        });
      } else if (
        row.ItemName.indexOf('未审资料') != -1 &&
        row.CurrentStatus === '1'
      ) {
        this.$router.push({
          name: 'EvaluationTwo',
          params: { UnReview: true }
        });
      } else if (
        row.ItemName.indexOf('未审资料') != -1 &&
        row.CurrentStatus === '2'
      ) {
        this.$router.push({
          name: 'briefingCompletion',
          params: { UnReview: true }
        });
      } else if (row.ItemName === '质量月度简报医务审核退回') {
        this.$router.push({
          name: 'briefingCompletion',
          params: { ExamineState: '1', State: '0' }
        });
      } else if (row.ItemName === '质量月度简报质管审核退回') {
        console.log('ok');
        this.$router.push({
          name: 'briefingCompletion',
          params: { ExamineState: '1', State: 1 }
        });
      } else {
        const routeInfo = this.routerMeta.filter(item => {
          if (item.name === row.ItemName) {
            return item;
          }
        })[0];
        this.$router.push({
          name: routeInfo.path,
          params: { value: routeInfo.value, CurrentStatus: row.CurrentStatus }
        });
      }
    },
    go(val) {
      if (val === 'P') {
        this.$router.push({
          name: 'EvaluationOne',
          params: { CurrentStatus: '0' }
        });
      } else if (val === 'D') {
        this.$router.push({
          name: 'EvaluationOne',
          params: { CurrentStatus: '1' }
        });
      } else if (val === 'C') {
        this.$router.push({
          name: 'EvaluationTwo',
          params: { CurrentStatus: '1' }
        });
      } else if (val === 'A') {
        this.$router.push({
          name: 'EvaluationTwo',
          params: { CurrentStatus: '2' }
        });
      }
    },
    handleClick(tab, event) {
      if (tab.label === '待办条款') this.handleCurrentChange(0);
      if (tab.label === 'PDCA循环') this.SelectPDCACount();
    },
    async SelectPDCACount() {
      try {
        const { data } = await SelectPDCACount();
        this.pdcaData = data;
      } catch (error) {
        console.log(error);
      }
      const x = window.innerHeight / 969;
      const m = (window.innerHeight * (x - 1)) / 3;
      this.$refs['svg'].setAttribute(
        'transform',
        `translate(${m},${m})scale(${x},${x})`
      );
    },
    async SelectWaitCount() {
      try {
        const { data } = await SelectWaitCount(this.listQuery);
        this.pagination.total = data.length;
        this.tableData = data.filter(item => item.Count !== 0);
      } catch (error) {
        console.log(error);
      }
      this.listLoading = false;
    },
    async clickSelectWaitCount() {
      this.listQuery.pageIndex = 1;
      this.pagination.pageIndex = 1;
      this.SelectWaitCount();
    },
    handleCurrentChange(index) {
      this.listLoading = true;
      this.listQuery.pageIndex = index;
      this.SelectWaitCount();
    },
    handleSizeChange(page) {
      this.listLoading = true;
      this.listQuery.pageSize = page;
      this.clickSelectWaitCount();
    }
  }
};
</script>

<style lang="scss">
.todo {
  margin-bottom: 6px;
  .el-card__body {
    padding: 6px;
    .el-form-item {
      margin: 0;
      margin-bottom: 6px;
    }
  }
  .NoticeContent {
    width: 100%;
    height: 300px;
    overflow-y: auto;
    border: 1px solid gainsboro;
    padding: 5px 10px;
    border-radius: 8px;
  }
  .el-card__header {
    padding: 6px;
    border-bottom: 1px solid #e6ebf5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    background-color: gainsboro;

    .filter-container {
      padding-bottom: 0px;
    }
  }
}
</style>
