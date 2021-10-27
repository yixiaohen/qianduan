<template>
  <el-card class="box-card-view">
    <el-card shadow="never" class="box-card-center">
      <div slot="header">
        <div class="search-view">
          <el-form
            ref="listQuery"
            :inline="true"
            :model="listQuery"
            size="mini"
          >
            <el-form-item>
              <el-input placeholder="任务名称" />
            </el-form-item>
            <!-- <el-form-item>
              <el-input v-model="listQuery.Unwinder" placeholder="出卷人" />
            </el-form-item> -->
            <el-form-item>
              <el-button
                type="primary"
                @click="clickSelectAnswerPaper('listQuery')"
              >搜索
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <el-table
        v-loading="listLoading"
        :data="tableData"
        height="calc(100vh - 216px)"
        border
        size="mini"
      >
        <el-table-column
          type="index"
          fixed="left"
          width="50"
          label="序号"
          align="center"
        />
        <el-table-column prop="taskName" label="任务名称" />
        <el-table-column
          label="个人成绩明细"
          align="center"
          fixed="right"
          width="51"
        >
          <template slot-scope="{ row }">
            <el-button
              size="mini"
              circle
              type="primary"
              icon="el-icon-view"
              @click="TaskExamDetail(row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="部门任务单次平均分"
          align="center"
          fixed="right"
          width="51"
        >
          <template slot-scope="{ row }">
            <el-button
              size="mini"
              circle
              type="primary"
              icon="el-icon-view"
              @click="TaskAveScoreModal(row, '部门任务单次平均分')"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="部门任务最终平均分"
          align="center"
          fixed="right"
          width="51"
        >
          <template slot-scope="{ row }">
            <el-button
              size="mini"
              circle
              type="primary"
              icon="el-icon-view"
              :disabled="!!row.taskType"
              @click="AllTaskAveScoreModal(row, '部门任务最终平均分')"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="单次任务的统计"
          align="center"
          fixed="right"
          width="51"
        >
          <template slot-scope="{ row }">
            <el-button
              size="mini"
              circle
              type="primary"
              icon="el-icon-view"
              @click="AllTaskExamStatisticsModal(row, '单次任务的统计')"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="部门任务最终统计"
          align="center"
          fixed="right"
          width="51"
        >
          <template slot-scope="{ row }">
            <el-button
              size="mini"
              circle
              type="primary"
              icon="el-icon-view"
              :disabled="!!row.taskType"
              @click="TaskExamStatistics(row, '部门任务最终统计')"
            />
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin: 6px 0 0 0"
        background
        :current-page.sync="pagination.pageIndex"
        :page-size="pagination.pageSize"
        :page-sizes="pagination.pageSizes"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
    <el-dialog
      :title="modalTitle"
      width="900px"
      custom-class="modalShow"
      :visible.sync="examDetail.visible"
      :close-on-click-modal="false"
    >
      <el-table
        border
        size="mini"
        :data="examDetail.table"
        style="width: 100%; margin-bottom: 20px"
        height="calc((100vh - 439px))"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="UserName" label="考试人员" width="150" />
        <el-table-column prop="ReplyGrade" label="考试成绩" width="150" />
        <el-table-column prop="ReplyTime" label="考试时间" width="150">
          <template slot-scope="{ row }">{{
            row.ReplyTime ? row.ReplyTime.replace('T', ' ') : ''
          }}
          </template>
        </el-table-column>
        <el-table-column prop="DeptName" label="部门" />
      </el-table>
      <el-form :inline="true" size="mini">
        <el-form-item>
          <el-pagination
            style="margin: 6px 0 0 0"
            background
            :current-page.sync="examDetail.pagination.pageIndex"
            :page-size="examDetail.pagination.pageSize"
            :page-sizes="examDetail.pagination.pageSizes"
            :total="examDetail.pagination.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="examDetailSizeChange"
            @current-change="examDetailCurrentChange"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="downloadLoading"
            type="success"
            icon="el-icon-download"
            size="mini"
            style="margin-top: 8px"
            @click="handleDownload"
          >导出
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      :title="modalTitle"
      width="900px"
      custom-class="modalShow"
      :visible.sync="modalShow"
      :close-on-click-modal="false"
    >
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="表格" name="table">
          <el-table
            border
            size="mini"
            :data="TaskAveScoreTableData"
            style="width: 100%; margin-bottom: 20px"
            height="calc((100vh - 439px))"
          >
            <el-table-column
              type="index"
              label="序号"
              width="60"
              align="center"
            />
            <!-- <el-table-column prop="taskName" label="任务名称" /> -->
            <el-table-column prop="DeptName" label="部门名称" />
            <el-table-column prop="AvgGrade" label="平均分" align="center" />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="统计图" name="chart">
          <line-charts
            ref="lineCharts"
            :data="lineData"
            :style="{ height: 'calc((100vh - 420px))' }"
          />
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <el-dialog
      :title="modalTitle"
      width="900px"
      custom-class="modalShow"
      :visible.sync="modalShow2"
      :close-on-click-modal="false"
    >
      <el-table
        border
        size="mini"
        :data="TaskAveScoreTableData"
        style="width: 100%; margin-bottom: 20px"
        height="calc((100vh - 439px))"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />
        <!-- <el-table-column prop="taskName" label="任务名称" width="190" /> -->
        <el-table-column prop="DeptName" label="部门名称" width="200" />
        <el-table-column prop="PassRate" label="合格率(%)" />
        <el-table-column prop="GoodRate" label="优秀率(%)" />
        <el-table-column prop="PassCount" label="合格人数" />
        <el-table-column prop="GoodCount" label="优秀人数" />
        <el-table-column prop="ExamRate" label="考试率(%)" />
      </el-table>
    </el-dialog>
  </el-card>
</template>
<script>
import {
  GetTaskExamDetail,
  SelectAllTaskAveScore,
  SelectAllTaskExamStatistics,
  SelectTaskAveScore,
  SelectTaskExamStatistics
} from '@/api/KS_ExamStatistics';
import { SelectAnswerPaper } from '@/api/KS_AnswerPaper';
import lineCharts from '@/components/LineCharts/lineCharts';

export default {
  name: 'ExampleStatistics',
  components: { lineCharts },
  data() {
    return {
      listLoading: false,
      downloadLoading: false,
      tableData: [],
      TaskAveScoreTableData: [],
      deptsData: [],
      examDetail: {
        row: {},
        visible: false,
        table: [],
        listQuery: {
          pageIndex: 1,
          pageSize: 15,
          userName: '',
          deptName: '',
          taskName: '',
          State: '',
          ReviewState: 1
        },
        pagination: {
          pageIndex: 1,
          total: 0,
          pageSize: 15,
          pageSizes: [15, 20, 50, 100, 150, 200]
        }
      },
      modalTitle: '',
      modalShow: false,
      modalShow2: false,
      activeName: 'table',
      lineData: {},
      listQuery: {
        pageIndex: 1,
        pageSize: 15,
        userName: '',
        deptName: '',
        taskName: '',
        State: '',
        ReviewState: 1
      },
      pagination: {
        pageIndex: 1,
        total: 0,
        pageSize: 15,
        pageSizes: [15, 20, 50, 100, 150, 200]
      }
    };
  },
  watch: {
    activeName(val) {
      this.$nextTick(() => {
        this.$refs.lineCharts.resize();
      });
    }
  },
  created() {
    this.SelectAnswerPaper();
  },
  methods: {
    async selectTaskExamDetail() {
      try {
        const { data } = await GetTaskExamDetail({
          TaskID: this.examDetail.row.taskID,
          pageIndex: this.examDetail.pagination.pageIndex,
          pageSize: this.examDetail.pagination.pageSize
        });
        this.examDetail.table = data.DataList;
        this.examDetail.pagination.total = data.Total;
      } catch (error) {
        console.log(error);
      } finally {
      }
    },
    TaskExamDetail(row) {
      this.modalTitle = '个人成绩明细:' + row.taskName;
      try {
        this.examDetail.row = row;
        this.selectTaskExamDetail();
      } catch {
      } finally {
        this.examDetail.visible = true;
      }
    },
    examDetailCurrentChange(val) {
      this.examDetail.listQuery.pageIndex = val;
      this.selectTaskExamDetail();
    },
    examDetailSizeChange(val) {
      this.examDetail.listQuery.pageSize = val;
      this.selectTaskExamDetail();
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },
    async handleDownload() {
      try {
        this.downloadLoading = true;
        const excel = await import('@/vendor/Export2Excel');
        const tHeader = [
          '考试任务',
          '考试人员',
          '考试成绩',
          '考试时间',
          '部门'
        ];
        const filterVal = [
          'taskName',
          'UserName',
          'ReplyGrade',
          'ReplyTime',
          'DeptName'
        ];
        const { data } = await GetTaskExamDetail({
          TaskID: this.examDetail.row.taskID,
          pageIndex: 1,
          pageSize: 1000000
        });
        const formData = this.formatJson(filterVal, data.DataList);
        excel.export_json_to_excel({
          header: tHeader,
          data: formData,
          filename: '文件名'
        });
      } catch (error) {
        console.log(error);
      }
      this.downloadLoading = false;
    },
    async AllTaskExamStatisticsModal(row, title) {
      this.modalTitle = title + ':' + row.taskName;
      try {
        const { data } = await SelectAllTaskExamStatistics({
          TaskID: row.taskID
        });
        this.TaskAveScoreTableData = data;
      } catch {
      } finally {
        this.modalShow2 = true;
      }
    },
    async AllTaskAveScoreModal(row, title) {
      this.modalTitle = title + ':' + row.taskName;
      try {
        const { data } = await SelectAllTaskAveScore({ TaskID: row.taskID });
        this.TaskAveScoreTableData = data;
        const AvgGrade = [];
        const DeptName = [];
        data.map((item) => {
          AvgGrade.push(item.AvgGrade);
          DeptName.push(item.DeptName);
        });
        this.lineData = {
          title: row.taskName,
          data: AvgGrade,
          dataTitle: DeptName
        };
      } catch (error) {
      } finally {
        this.modalShow = true;
      }
    },
    async TaskExamStatistics(row, title) {
      this.modalTitle = title + ':' + row.taskName;
      try {
        const { data } = await SelectTaskExamStatistics({ TaskID: row.taskID });
        this.TaskAveScoreTableData = data;
      } catch (error) {
      } finally {
        this.modalShow2 = true;
      }
    },
    async TaskAveScoreModal(row, title) {
      this.modalTitle = title + ':' + row.taskName;
      try {
        const { data } = await SelectTaskAveScore({ TaskID: row.taskID });
        this.TaskAveScoreTableData = data;
        const AvgGrade = [];
        const DeptName = [];
        data.map((item) => {
          AvgGrade.push(item.AvgGrade);
          DeptName.push(item.DeptName);
        });
        this.lineData = {
          title: row.taskName,
          data: AvgGrade,
          dataTitle: DeptName
        };
      } catch (error) {
      } finally {
        this.modalShow = true;
      }
    },
    async SelectAnswerPaper() {
      this.listLoading = true;
      try {
        const { data } = await SelectAnswerPaper(this.listQuery);
        this.pagination.total = data.Total;
        this.tableData = data.DataList;
      } catch (error) {
        console.log(error);
      } finally {
        this.listLoading = false;
      }
    },
    async clickSelectAnswerPaper() {
      this.listQuery.pageIndex = 1;
      this.SelectAnswerPaper();
    },
    handleCurrentChange(val) {
      this.listQuery.pageIndex = val;
      this.SelectAnswerPaper();
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.clickSelectAnswerPaper();
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../ExampleTrainStyles/index.scss";
</style>
