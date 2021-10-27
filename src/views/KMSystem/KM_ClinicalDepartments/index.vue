<template>
  <el-card class="box-card-view">
    <el-card shadow="never" class="right-box-card">
      <div slot="header" class="text flex">
        <el-form label-position="left" :inline="true" size="mini">
          <el-form-item>
            <el-input
              v-model="listQuery.CheckListName"
              placeholder="查检单名称"
              style="width: 200px"
              size="mini"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="listQuery.TaskName"
              placeholder="任务名称"
              style="width: 200px"
              size="mini"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="listQuery.UserName"
              placeholder="审核人"
              style="width: 150px"
              size="mini"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-select v-model="listQuery.VerifyState" placeholder="审核状态">
              <el-option
                v-for="item in ['全部', '通过', '退回', '未审核']"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <default-depts
              w="100%"
              @getDefaultDeptsValue="selectDefaultDeptValues"
            />
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="listQuery.Date"
              range-separator="-"
              value-format="yyyy-MM"
              type="month"
              placeholder="选择年月"
              style="width: 120px"
              @change="datePickerChange"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="info"
              icon="el-icon-search"
              :loading="listLoading"
              size="mini"
              @click="clickSelectExecuteList()"
            >搜索
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        v-loading="listLoading"
        :data="tableData"
        height="calc(100vh - 220px)"
        border
        size="mini"
      >
        <!-- <el-table-column type="selection" width="55" align="center" /> -->
        <el-table-column type="index" width="50" label="序号" align="center" />
        <el-table-column prop="CheckListName" label="查检单名称" width="200" />
        <el-table-column
          prop="TaskName"
          label="任务名称"
          show-overflow-tooltip
        />
        <el-table-column
          prop="DeptName"
          label="自查科室"
          :show-overflow-tooltip="cellOverflow"
        />
        <el-table-column
          prop="Date"
          label="自查年月"
          width="80"
          align="center"
          :show-overflow-tooltip="cellOverflow"
        />
        <el-table-column
          prop="ExecuteDate"
          align="center"
          label="执行时间"
          width="180"
        >
          <template slot-scope="{ row }">{{
            row.ExecuteDate ? row.ExecuteDate.replace('T', ' ') : ''
          }}
          </template>
        </el-table-column>
        <el-table-column prop="Executeschedule" label="执行进度" width="80">
          <template slot-scope="scope">
            <el-progress
              :text-inside="true"
              :stroke-width="18"
              :percentage="parseFloat(scope.row.Executeschedule)"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="ExecuteGrade"
          label="执行分数"
          width="100"
          align="center"
        />
        <el-table-column
          prop="VerifyState"
          label="审核状态"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            <span
              :style="{
                color:
                  scope.row.VerifyState == '通过'
                    ? 'green'
                    : scope.row.VerifyState == '退回'
                      ? 'red'
                      : 'black',
                'font-weight': 'bold',
              }"
            >
              {{ scope.row.VerifyState }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="VerifyUser"
          label="审核人"
          show-overflow-tooltip
          width="150"
        />
        <el-table-column
          prop="VerifyOpinion"
          label="审核意见"
          show-overflow-tooltip
          width="150"
        />
        <el-table-column prop="DirectoryName" label="所属目录" />
        <el-table-column fixed="right" label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button
              class="item"
              size="mini"
              @click="execute(scope.row)"
            >执行
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <el-col :span="1">
          <el-switch v-model="cellOverflow" style="margin: 6px 0px" />
        </el-col>
        <el-col :span="20">
          <el-pagination
            background
            :current-page.sync="pagination.pageIndex"
            :page-size="pagination.pageSize"
            :page-sizes="pagination.pageSizes"
            :total="pagination.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-col>
      </el-row>
    </el-card>
    <el-dialog
      v-if="device === 'mobile'"
      :title="templateDialogTitle"
      :close-on-click-modal="false"
      :visible.sync="templateDialog"
      width="100%"
      height="400px"
      @opened="opened"
    >
      <el-form
        ref="ExecuteListForm"
        size="mini"
        :model="ExecuteListForm"
        inline
      >
        <el-form-item label="进度" style="width: 120px">
          <el-select
            v-model="ExecuteListForm.Executeschedule"
            size="mini"
            clearable
            style="width: 120px"
            placeholder="进度"
          >
            <el-option
              v-for="item in schedule"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="分数" style="width: 120px">
          <el-input
            v-model="ExecuteListForm.ExecuteGrade"
            placeholder="分数"
            size="mini"
            clearable
          />
        </el-form-item>
        <div>
          <!-- <ckeditor
              v-model="ExecuteListForm.ExecuteContent"
              :config="editorConfig"
            /> -->
          <wangeditor
            v-if="ExecuteListForm.ExecuteContent"
            ref="wangEdit"
            :value="ExecuteListForm.ExecuteContent"
            :clear="isClear"
            @change="getContent"
          />
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="CheckListCancel">取 消</el-button>
        <el-button
          type="primary"
          size="mini"
          @click="InsertCheckList"
        >确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-if="device === 'desktop'"
      :title="templateDialogTitle"
      :close-on-click-modal="false"
      :visible.sync="templateDialog"
      width="50%"
      height="400px"
    >
      <el-form
        ref="ExecuteListForm"
        size="mini"
        :model="ExecuteListForm"
        inline
      >
        <el-form-item label="进度" style="width: 120px">
          <el-select
            v-model="ExecuteListForm.Executeschedule"
            size="mini"
            clearable
            style="width: 120px"
            placeholder="进度"
          >
            <el-option
              v-for="item in schedule"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="分数" style="width: 120px">
          <el-input
            v-model="ExecuteListForm.ExecuteGrade"
            placeholder="分数"
            size="mini"
            clearable
          />
        </el-form-item>
        <div>
          <ckeditor
            v-model="ExecuteListForm.ExecuteContent"
            :config="editorConfig"
          />
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="CheckListCancel">取 消</el-button>
        <el-button
          type="primary"
          size="mini"
          @click="InsertCheckList"
        >确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>
<script>
import wangeditor from '@/components/Editor/index'; /* 富文本编辑器 */
import { InsertExecute, SelectExecuteList } from '@/api/KmApi';
import { mapGetters } from 'vuex';
import defaultDepts from '@/views/components/defaultDepts';

export default {
  name: 'KMClinicalDepartments',
  components: {
    wangeditor,
    defaultDepts
  },
  data() {
    return {
      curRow: null,
      listLoading: false,
      templateDialog: false,
      templateDialogTitle: '',
      listQuery: {
        // condition: '',
        UserID: window.userInfo[0].UserID,
        pageIndex: 1,
        pageSize: 15,
        CheckListName: '',
        UserName: '',
        VerifyState: '',
        TaskName: '',
        DeptID: '',
        Date: ''
      },
      tableData: [],
      pagination: {
        pageIndex: 1,
        total: 0,
        pageSize: 15,
        pageSizes: [15, 20, 50, 100, 150, 200]
      },
      schedule: [],
      ExecuteListForm: {
        ExecuteID: 0,
        DetailID: 0,
        Executeschedule: '',
        ExecuteContent: '',
        ExecuteUserID: window.userInfo[0].UserID,
        ExecuteGrade: ''
      },
      editorConfig: {
        skin: 'moono-lisa',
        removePlugins: 'elementspath',
        removeButtons: 'About',
        format_tags: 'p;h1;h2;h3;pre',
        height: 400,
        removeDialogTabs: 'image:advanced;image:Link'
      },
      isClear: false,
      cellOverflow: true
    };
  },
  computed: {
    ...mapGetters(['device'])
  },
  created() {
    this.SelectExecuteList();
    let x = 0;
    for (let i = 0; i < 10; i++) {
      this.schedule.push({
        value: `${(x += 10)}`,
        label: 10 * i + 10 + '%'
      });
    }
  },
  methods: {
    async InsertCheckList() {
      const formData = { ...this.ExecuteListForm };
      try {
        const { data, msg } = await InsertExecute(formData);
        this.curRow.ExecuteContent = this.ExecuteListForm.ExecuteContent; // 更新内容
        if (this.curRow.ExecuteID == 0) this.curRow.ExecuteID = data.ExecuteID; // 新增数据库行，分配了id
        this.curRow.ExecuteDate = data.ExecuteDate; // 从后台返回的 执行时间
        this.curRow.Executeschedule = data.Executeschedule;
        this.$message({
          type: 'info',
          message: msg
        });
        this.templateDialog = false;
      } catch {
      }
    },
    CheckListCancel() {
      this.templateDialog = false;
    },
    execute(row) {
      this.curRow = row;
      this.templateDialogTitle = row.CheckListName;
      this.ExecuteListForm.ExecuteID = row.ExecuteID || 0;
      if (this.ExecuteListForm.ExecuteID == 0) {
        this.ExecuteListForm.ExecuteContent = row.CheckListContent || '';
      } else {
        this.ExecuteListForm.ExecuteContent = row.ExecuteContent || '';
      }
      this.ExecuteListForm.Executeschedule = row.Executeschedule || '';
      this.ExecuteListForm.ExecuteGrade = row.ExecuteGrade;
      this.ExecuteListForm.DetailID = row.DetailID || 0;
      this.templateDialog = true;
      this.ExecuteListForm.ExecuteContent = row.ExecuteContent;
    },
    async SelectExecuteList() {
      this.listLoading = true;
      try {
        const { data } = await SelectExecuteList(this.listQuery);
        this.tableData = data.DataList;
        this.pagination.total = data.Total;
      } catch {
      } finally {
        this.listLoading = false;
      }
    },
    async clickSelectExecuteList() {
      this.pagination.pageIndex = 1;
      this.listQuery.pageIndex = 1;
      this.SelectExecuteList();
    },
    handleCurrentChange(index) {
      this.listQuery.pageIndex = index;
      this.SelectExecuteList();
    },
    handleSizeChange(page) {
      this.listQuery.pageSize = page;
      this.clickSelectExecuteList();
    },
    getContent(value) {
      this.ExecuteListForm.ExecuteContent = value;
    },
    opened() {
      this.$refs.wangEdit.setContent(this.ExecuteListForm.ExecuteContent);
    },
    selectDefaultDeptValues(val) {
      this.listQuery.DeptID = val;
      this.clickSelectExecuteList();
    },
    datePickerChange(val) {
      this.clickSelectExecuteList();
    }
  }
};
</script>
<style lang="scss">
@import '../KS_Styles/index.scss';
</style>
