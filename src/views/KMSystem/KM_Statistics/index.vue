<template>
  <div class="KM_Statistics">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form :inline="true" size="mini">
          <el-form-item>
            <el-radio-group v-model="radio" size="mini" @change="radioGroup">
              <el-radio-button :label="1">查检单统计</el-radio-button>
              <el-radio-button :label="2">{{
                km_statistics_a + '统计'
              }}
              </el-radio-button>
              <el-radio-button :label="3">主管部门统计</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <defaultDepts
              :multiple="false"
              @getDefaultDeptValue="getDefaultDeptData"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="info"
              icon="el-icon-search"
              size="mini"
              @click="Select()"
            >查询
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="content">
        <div class="content_right">
          <el-collapse-transition>
            <div v-show="el_table1" class="el_table1">
              <el-table
                v-loading="deptPDCALoading"
                :data="tableData1"
                border
                size="mini"
              >
                <el-table-column
                  prop="CheckListName"
                  label="查检单名称"
                  align="center"
                />
                <el-table-column
                  prop="ExecuteCount"
                  label="执行数"
                  align="center"
                />
                <el-table-column
                  prop="UnExecuteCount"
                  label="未执行计数"
                  align="center"
                />
                <el-table-column
                  prop="ExecuteRate"
                  label="执行率"
                  widht="60"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-progress
                      :text-inside="true"
                      :stroke-width="18"
                      :percentage="scope.row.ExecuteRate"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="VerifyCount"
                  label="审核数"
                  align="center"
                />
                <el-table-column
                  prop="UnreviewedCount"
                  label="未审核数"
                  align="center"
                />
                <el-table-column
                  prop="VerifyRate"
                  label="审核率"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-progress
                      :text-inside="true"
                      status="warning"
                      :stroke-width="18"
                      :percentage="scope.row.VerifyRate"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="PassCount"
                  label="审核通过数量"
                  align="center"
                />
                <el-table-column prop="PassRate" label="通过率" align="center">
                  <template slot-scope="scope">
                    <el-progress
                      stroke-linecap="round"
                      status="success"
                      :text-inside="true"
                      :stroke-width="18"
                      :percentage="scope.row.PassRate"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="Returncount"
                  label="审核退回数量"
                  align="center"
                />
                <el-table-column
                  prop="ReturnRate"
                  label="退回率"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-progress
                      status="exception"
                      :text-inside="true"
                      :stroke-width="18"
                      :percentage="scope.row.ReturnRate"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="VerifyGrade"
                  label="平均分数"
                  align="center"
                />
              </el-table>
            </div>
          </el-collapse-transition>
          <el-collapse-transition>
            <div v-show="el_table2">
              <el-table
                v-loading="deptPDCALoading"
                :data="tableData2"
                border
                size="mini"
              >
                <el-table-column
                  prop="DeptName"
                  label="部门名称"
                  align="center"
                  show-overflow-tooltip
                />
                <el-table-column
                  prop="CheckListName"
                  label="查检单名称"
                  align="center"
                  show-overflow-tooltip
                />
                <el-table-column
                  prop="ExecuteCount"
                  label="执行数"
                  align="center"
                />
                <el-table-column
                  prop="UnExecuteCount"
                  label="未执行计数"
                  align="center"
                />
                <el-table-column
                  prop="ExecuteRate"
                  label="执行率"
                  widht="60"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-progress
                      :text-inside="true"
                      :stroke-width="18"
                      :percentage="scope.row.ExecuteRate"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="VerifyCount"
                  label="审核数"
                  align="center"
                />
                <el-table-column
                  prop="UnreviewedCount"
                  label="未审核数"
                  align="center"
                />
                <el-table-column
                  prop="VerifyRate"
                  label="审核率"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-progress
                      :text-inside="true"
                      status="warning"
                      :stroke-width="18"
                      :percentage="scope.row.VerifyRate"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="PassCount"
                  label="审核通过数量"
                  align="center"
                />
                <el-table-column prop="PassRate" label="通过率" align="center">
                  <template slot-scope="scope">
                    <el-progress
                      stroke-linecap="round"
                      status="success"
                      :text-inside="true"
                      :stroke-width="18"
                      :percentage="scope.row.PassRate"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="Returncount"
                  label="审核退回数量"
                  align="center"
                />
                <el-table-column
                  prop="ReturnRate"
                  label="退回率"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-progress
                      status="exception"
                      :text-inside="true"
                      :stroke-width="18"
                      :percentage="scope.row.ReturnRate"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="VerifyGrade"
                  label="平均分数"
                  align="center"
                />
              </el-table>
            </div>
          </el-collapse-transition>
          <el-collapse-transition name="el-zoom-in-center">
            <div v-show="el_table3">
              <el-table
                v-loading="deptPDCALoading"
                :data="tableData3"
                border
                size="mini"
              >
                <el-table-column
                  prop="DeptName"
                  label="部门名称"
                  align="center"
                />
                <el-table-column
                  prop="CheckListName"
                  label="查检单名称"
                  align="center"
                />
                <el-table-column
                  prop="VerifyGrade"
                  label="平均分数"
                  align="center"
                />
                <el-table-column
                  prop="PassCount"
                  label="审核通过数量"
                  align="center"
                />
                <el-table-column
                  prop="Returncount"
                  label="审核退回数量"
                  align="center"
                />
              </el-table>
            </div>
          </el-collapse-transition>
          <!-- 分页 -->
          <el-pagination
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="totals"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import { SelectExecuteStatistics, SelectStatistics, SelectVerifyStatistics } from '@/api/KM_Statistics';
import defaultDepts from '@/views/components/defaultDepts';

export default {
  name: 'KMStatistics',
  components: { defaultDepts },
  data() {
    return {
      km_statistics_a: '临床科室',
      /* 表格参数 */
      el_table1: true,
      el_table2: true,
      el_table3: true,
      tableData1: [],
      tableData2: [],
      tableData3: [],
      deptPDCALoading: false,
      tableIndex: 1,
      /* 分页参数 */
      currentPage: 1,
      totals: 10,
      total: 0,
      getDefaultDeptDatas: '',
      radio: 1
    };
  },
  created() {
    this.Select();
    this.getIni();
  },
  methods: {
    async getIni() {
      try {
        const para = this.$store.getters.iniPara;
        if (para.km_statistics_a) this.km_statistics_a = para.km_statistics_a;
      } catch {
      }
    },
    // 三个表格合并为一个方法
    async Select(value) {
      this.deptPDCALoading = true;
      if (value < 4) {
        this.tableIndex = value;
      }
      if (!this.getDefaultDeptDatas) {
        this.getDefaultDeptDatas = '';
      }
      const val = {
        pageIndex: this.currentPage,
        pageSize: this.totals,
        CheckListIDs: '',
        DeptIDs: `${this.getDefaultDeptDatas}`
      };
      let data;
      this.el_table1 = false;
      this.el_table2 = false;
      this.el_table3 = false;
      try {
        if (this.tableIndex === 1) {
          this.el_table1 = true;
          data = await SelectStatistics(val);
          this.tableData1 = data.data.DataList;
        } else if (this.tableIndex === 2) {
          this.el_table2 = true;
          data = await SelectExecuteStatistics(val);
          this.tableData2 = data.data.DataList;
        } else if (this.tableIndex === 3) {
          this.el_table3 = true;
          data = await SelectVerifyStatistics(val);
          this.tableData3 = data.data.DataList;
        }
        this.total = data.data.Total;
      } catch {
      } finally {
        this.deptPDCALoading = false;
      }
    },
    handleSizeChange(value) {
      this.totals = value;
      this.Select(5);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.Select(6);
    },
    getDefaultDeptData(val) {
      this.getDefaultDeptDatas = val;
    },
    radioGroup(val) {
      this.Select(val);
    }
  }
};
</script>
<style lang="scss">
.KM_Statistics {
  height: calc(100vh - 50px) !important;
  // 表头和数据border对齐
  .el-table th.gutter {
    display: table-cell !important;
  }

  // .el-table {
  //   height: calc(100vh - 20em) !important;
  //   margin-top: 10px;
  // }
  .el-card__body {
    padding: 5px 0px 0px 5px;
  }

  .el-table {
    overflow: auto;
    height: calc(100vh - 162px) !important;
  }
}
</style>
