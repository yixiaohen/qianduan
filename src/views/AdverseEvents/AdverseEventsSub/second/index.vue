<template>
  <div class="second">
    <div slot="header" class="clearfix">
      <el-badge class="item">
        <el-input
          v-model="selectEventReportID"
          size="small"
          placeholder="请输入报告ID"
        >
          <el-button
            slot="append"
            size="small"
            icon="el-icon-search"
            @click="SelectReportByID"
          />
        </el-input>
      </el-badge>
    </div>
    <div class="content">
      <div class="content_right">
        <el-table v-loading="listLoading" :data="tableData" border size="mini">
          <el-table-column
            type="index"
            width="50"
            label="序号"
            align="center"
          />
          <el-table-column
            prop="VictimName"
            label="受害人姓名"
            align="center"
          />
          <el-table-column prop="Sex" label="性别" width="50" align="center" />
          <el-table-column prop="Age" label="年龄" width="50" />
          <el-table-column
            prop="Weight"
            label="体重"
            width="50"
            align="center"
          />
          <el-table-column prop="Phone" label="电话" width="80" />
          <el-table-column prop="EventTypeName" label="事件类别" />
          <el-table-column prop="VictimDepartment" label="当事科部门" />
          <el-table-column prop="FindDepartment" label="归口部门" />
          <el-table-column prop="Process" label="进度" />
          <el-table-column prop="Level" label="级别" />
          <el-table-column prop="Severity" label="严重程度" />
          <el-table-column prop="InvolvedStatus" label="参与状态" />
          <el-table-column label="操作" width="130">
            <template slot-scope="{ row }" class="handle">
              <el-link
                icon="el-icon-edit"
                class="item"
                @click="UpdateReport(row)"
              >抄送</el-link>
              <el-link
                icon="el-icon-edit"
                class="item"
                @click="dispose(row)"
              >处理</el-link>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page="pagination.currentPage4"
          :page-sizes="[10, 15, 20, 30, 40]"
          :page-size="pagination.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <el-dialog
      title="抄送"
      :visible.sync="DialogVisible"
      :close-on-click-modal="false"
      width="300px"
    >
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="多选" name="first">
          <el-form :inline="true" size="mini" style="height: 200px">
            <el-form-item>
              <defaultDepts
                :multiple="true"
                :value="dept_value"
                @getDefaultDeptsValue="getDefaultDeptValues"
              />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="单选" name="second">
          <el-form :inline="true" size="mini" style="height: 200px">
            <el-form-item>
              <defaultDepts
                ref="dept2"
                :multiple="false"
                :value="dept_value2"
                @getDefaultDeptsValue="getDefaultDeptValues2"
              />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>

      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="DialogVisible = false">取 消</el-button>
        <el-button
          v-loading="listLoading2"
          size="mini"
          type="primary"
          @click="UpdateCentralizeDepartmentID"
        >确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="处理和反馈"
      :visible.sync="DialogVisible2"
      :close-on-click-modal="false"
      width="300px"
    >
      <el-form label-position="right">
        <el-form-item label="状态">
          <el-select
            v-model="UpdateStatusData.Status"
            placeholder="请选择"
            :disabled="UpdateStatusData.IsProcess"
          >
            <el-option label="当事部门未核中" value="当事部门未审核" />
            <el-option label="当事部门审核中" value="当事部门审核中" />
            <el-option label="当事部门已审核" value="当事部门已审核" />
          </el-select>
        </el-form-item>
        <el-form-item label="反馈">
          <el-input
            v-model="UpdateStatusData.Feedback"
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            :disabled="false"
          />
        </el-form-item>
        <el-form-item label="历史反馈">
          <el-table
            :data="UpdateStatusData.FeedbackInput"
            border
            size="mini"
            height="300"
            style="overflow: auto"
          >
            <el-table-column
              type="index"
              label="序号"
              width="50"
              align="center"
            />
            <el-table-column prop="Feedback" label="反馈信息" />
            <el-table-column
              prop="UserName"
              label="反馈人"
              align="center"
            />
            <el-table-column
              prop="CreateDatetime"
              label="时间"
              align="center"
              width="100"
            >
              <template slot-scope="scope">
                <p>{{ parseTimes(scope.row.CreateDatetime) }}</p>
              </template></el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="DialogVisible2 = false">取 消</el-button>
        <el-button
          v-loading="listLoading2"
          size="mini"
          type="primary"
          @click="UpdateStatus"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  SelectFeedbackList,
  SelectHandleReport,
  SelectReportByID,
  UpdateFirstCentralizeDepartmentID,
  UpdateSecondCentralizeDepartmentID,
  UpdateStatus
} from '@/api/AdverseEventsSub';
import defaultDepts from '@/views/components/defaultDepts';
import { parseTime } from '@/utils/index';

export default {
  components: { defaultDepts },
  data() {
    return {
      activeName: 'first',
      listLoading: false,
      listLoading2: false,
      disabled: false,
      tableData: [],
      pagination: {
        currentPage4: 1,
        size: 15,
        total: 0
      },
      DialogVisible: false,
      DialogVisible2: false,
      dialoTtitleName: '',
      selectEventReportID: '',
      UpdateFirstCentralizeDepartmentData: {
        EventReportID: '',
        FirstCentralizeDepartmentID: '',
        SecondCentralizeDepartmentID: ''
      },
      dept_value: '',
      UpdateStatusData: {
        EventReportID: '',
        Status: '',
        Feedback: '',
        FeedbackInput: [],
        IsProcess: '',
        Type: 2,
        CreateUserID: window.userInfo[0].UserID
      },
      dept_value2: '',
      handleClickStatus: 'first',
      SelectFeedbackData: {
        Type: 2,
        EventReportID: 0
      }
    };
  },
  mounted() {
    this.SelectHandleReport();
  },
  methods: {
    async SelectHandleReport() {
      const val = {
        pageIndex: this.pagination.currentPage4,
        pageSize: this.pagination.size,
        CreateUserID: window.userInfo[0].UserID,
        Type: 2
      };
      this.listLoading = true;
      try {
        const data = await SelectHandleReport(val);
        this.tableData = data.data.DataList;
        this.pagination.total = data.data.Total;
      } catch (error) {
      } finally {
        this.listLoading = false;
      }
    },
    async SelectReportByID() {
      const val = {
        EventReportID: this.selectEventReportID
      };
      if (!val.EventReportID) {
        this.SelectHandleReport();
        return;
      }
      this.listLoading = true;
      try {
        const data = await SelectReportByID(val);
        this.tableData = [data.data];
      } catch (error) {
      } finally {
        this.listLoading = false;
      }
    },
    UpdateReport(row) {
      this.UpdateFirstCentralizeDepartmentData.EventReportID =
        row.EventReportID;
      const EventReportID = row.SecondCentralizeDepartmentID;
      this.dept_value = EventReportID.split(',');
      this.dept_value2 = row.ProcessDepartmentID;
      this.DialogVisible = true;
    },
    handleSizeChange(val) {
      this.pagination.size = val;
      this.SelectHandleReport();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage4 = val;
      this.SelectHandleReport();
    },
    getDefaultDeptValues(value) {
      this.UpdateFirstCentralizeDepartmentData.FirstCentralizeDepartmentID = value.join(
        ','
      );
    },
    getDefaultDeptValues2(value) {
      this.UpdateFirstCentralizeDepartmentData.SecondCentralizeDepartmentID = value;
    },
    async UpdateCentralizeDepartmentID() {
      this.listLoading2 = true;
      let data;
      try {
        if (this.handleClickStatus == 'first') {
          data = await UpdateFirstCentralizeDepartmentID(
            this.UpdateFirstCentralizeDepartmentData
          );
        } else if (this.handleClickStatus == 'second') {
          data = await UpdateSecondCentralizeDepartmentID(
            this.UpdateFirstCentralizeDepartmentData
          );
        }
        this.$message.success(data.msg);
        this.SelectHandleReport();
      } catch (error) {
      } finally {
        this.listLoading2 = false;
        this.DialogVisible = false;
      }
    },
    dispose(row) {
      this.SelectFeedbackData.EventReportID = row.EventReportID;
      this.SelectFeedbackList();
      this.UpdateStatusData.EventReportID = row.EventReportID;
      this.UpdateStatusData.Status = row.Status;
      this.UpdateStatusData.IsProcess = row.IsProcess != 'True';
      this.DialogVisible2 = true;
    },
    async UpdateStatus() {
      this.listLoading2 = true;
      try {
        const data = await UpdateStatus(this.UpdateStatusData);
        this.$message.success(data.msg);
        this.SelectHandleReport();
      } catch (error) {
      } finally {
        this.listLoading2 = false;
        this.DialogVisible2 = false;
      }
    },
    handleClick(value) {
      if (value.name == 'second') {
        this.$refs.dept2.SelectDepts();
      }
      this.handleClickStatus = value.name;
    },
    /* 查询反馈记录历史 */
    async SelectFeedbackList() {
      try {
        const data = await SelectFeedbackList(this.SelectFeedbackData);
        this.UpdateStatusData.FeedbackInput = data.data;
      } catch (error) {}
    },
    // 格式化时间
    parseTimes(val) {
      return parseTime(val, '{y}-{m}-{d}');
    }
  }
};
</script>
<style lang="scss">
.second {
  .content_right {
    .el-table {
      overflow: auto;
      height: calc(100vh - 162px) !important;
      .el-table_1_column_14 .cell {
        padding-left: 1px !important;
      }
    }
  }
}
</style>
