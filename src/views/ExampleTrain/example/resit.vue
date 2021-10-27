<template>
  <div style="padding: 5px">
    <el-form :inline="true" size="mini">
      <el-form-item prop="password">
        <el-select
          v-model="listQuery.taskID"
          size="mini"
          style="width:300px"
          @change="selectResit"
        ><el-option
          v-for="item in options"
          :key="item.taskID"
          :label="item.taskName"
          :value="item.taskID"
        /></el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="insertRetakeTask()"
        >发布补考任务</el-button>
      </el-form-item>
      <el-form-item>
        <el-upload
          :data="{ taskID: listQuery.taskID }"
          action="/api/KS_Resit/ReadExcel"
          :on-success="uploadSuccess"
        >
          <el-button type="primary">追加导入补考名单</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button
          :disabled="listLoading"
          @click="deleteResit()"
        >删除选中人员</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="tableData"
      height="calc(100vh - 226px)"
      border
      size="mini"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="39" />
      <el-table-column
        type="index"
        fixed="left"
        width="45"
        label="序号"
        align="center"
      />
      <el-table-column prop="DeptName" label="部门" />
      <el-table-column prop="UserName" label="姓名" />
      <el-table-column prop="ReplyGrade" label="曾考分数" />
      <el-table-column prop="ReplyTime" label="曾考时间">
        <template slot-scope="{ row }">
          {{ row.ReplyTime ? row.ReplyTime.replace("T", " ") : "" }}
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
    <el-dialog
      :title="taskName"
      :width="device === 'desktop' ? '40%' : '99%'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
    >
      <span>发布补考任务</span>
      <el-form ref="taskFormData" :model="taskFormData" :rules="ruleValidate">
        <el-form-item label="开始时间" prop="starDate">
          <el-date-picker
            v-model="taskFormData.starDate"
            type="datetime"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
            placeholder="选择开始时间"
          />
        </el-form-item>
        <el-form-item label="结束时间" prop="endDate">
          <el-date-picker
            v-model="taskFormData.endDate"
            type="datetime"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
            placeholder="选择结束时间"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button
          size="mini"
          type="primary"
          @click="doInsertRetakeTask"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { DeleteResit, InsertRetakeTask, SelectResit, SelectTask } from '@/api/KS_Paper';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      options: [],
      dialogVisible: false,
      listLoading: false,
      listQuery: {
        pageIndex: 1,
        pageSize: 15,
        taskID: 1,
        Uid: window.userInfo[0].UserID
      },
      taskName: '',
      taskFormData: {
        taskID: 0,
        starDate: '',
        endDate: '',
        UidArray: []
      },
      pagination: {
        pageIndex: 1,
        total: 0,
        pageSize: 15,
        pageSizes: [15, 20, 50, 100, 150, 200]
      },
      ruleValidate: {
        starDate: [{ required: true, message: '请选择开始时间' }],
        endDate: [{ required: true, message: '请选择结束时间' }]
      },
      tableData: [],
      multipleSelection: []
    };
  },
  computed: {
    ...mapGetters(['device'])
  },
  created() {
    this.SelectTask();
  },
  methods: {
    async SelectTask() {
      this.listLoading = true;
      try {
        const { data } = await SelectTask({
          pageIndex: 1,
          pageSize: 1000,
          Uid: window.userInfo[0].UserID
        });
        this.options = data.DataList;
        if (this.options.length) {
          this.listQuery.taskID = this.options[0].taskID;
        }
        this.selectResit();
      } catch {
      } finally {
        this.listLoading = false;
      }
    },
    async selectResit() {
      this.listLoading = true;
      try {
        const { data } = await SelectResit(this.listQuery);
        this.pagination.total = data.Total;
        this.tableData = data.DataList;
      } catch {
      } finally {
        this.listLoading = false;
      }
    },
    handleCurrentChange(val) {
      this.listQuery.pageIndex = val;
      this.selectResit();
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.selectResit();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    insertRetakeTask() {
      if (!this.multipleSelection.length) {
        this.$notify.info({
          title: '提示',
          message: '请勾选需要补考人员名单'
        });
        return;
      }
      this.taskFormData.taskID = this.listQuery.taskID;
      this.options.forEach(item => {
        if (item.taskID == this.listQuery.taskID) this.taskName = item.taskName;
      });
      this.dialogVisible = true;
    },
    doInsertRetakeTask() {
      this.$refs['taskFormData'].validate(async v => {
        if (v) {
          try {
            const starDate = Date.parse(new Date(this.taskFormData.starDate));
            const endDate = Date.parse(new Date(this.taskFormData.endDate));
            if (endDate < starDate) {
              this.$Message.info(
                '请设置考试结束时间大于等于开始时间'
              );
              return;
            }
            this.taskFormData.UidArray = [];
            this.multipleSelection.forEach(item => this.taskFormData.UidArray.push(item.ResitUserID));
            const { msg } = await InsertRetakeTask(this.taskFormData);
            this.$message({
              type: 'info',
              message: msg
            });
            this.dialogVisible = false;
          } catch (error) {
            this.$message({
              type: 'error',
              message: error
            });
          } finally {
            this.SelectTask();
          }
        } else {
          this.$message({
            type: 'info',
            message: '你有必填项没填写'
          });
        }
      });
    },
    uploadSuccess(response) {
      this.$notify({
        title: '提示',
        message: response.data,
        type: 'success'
      });
      this.selectResit();
    },
    async deleteResit() {
      if (!this.multipleSelection.length) {
        this.$notify.info({
          title: '提示',
          message: '请勾选需要删除的补考名单'
        });
        return;
      }
      this.listLoading = true;
      const arr = [];
      this.multipleSelection.forEach(item => arr.push(item.ResitID));
      try {
        const re = await DeleteResit({ ResitIDArray: arr });
        if (re.code == 200) {
          this.$notify({
            title: '提示',
            message: '删除成功',
            type: 'success'
          });
          this.selectResit();
        } else {
          this.$notify.error({
            title: '错误',
            message: re.msg
          });
        }
      } catch (err) {
        this.$notify.error({
          title: '错误',
          message: err.message
        });
      }
      this.listLoading = false;
    }
  }
};
</script>
