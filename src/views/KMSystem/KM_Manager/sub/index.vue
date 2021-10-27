<template>
  <el-card class="box-card-view">
    <el-card shadow="never" class="right-box-card">
      <div slot="header" class="clearfix">
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
              placeholder="执行人"
              style="width: 150px"
              size="mini"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="listQuery.VerifyOpinion"
              placeholder="审核意见"
              style="width: 200px"
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
              @click="clickSelectVerifyList()"
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
          prop="UserName"
          align="center"
          label="执行人"
          width="220"
          show-overflow-tooltip
        />
        <el-table-column label="执行进度" width="100" align="center">
          <!-- <template slot-scope="{ row }">{{ row.Executeschedule ? row.Executeschedule + "%" : "" }}</template> -->
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
          width="90"
          align="center"
        />
        <!-- <el-table-column
          prop="ExecuteContent"
          label="执行内容"
          width="300"
        />-->
        <el-table-column prop="VerifyOpinion" label="审核意见" width="300" />
        <el-table-column
          prop="VerifyGrade"
          label="审核分数"
          align="center"
          width="90"
        />
        <el-table-column
          prop="VerifyState"
          align="center"
          label="审核状态"
          width="100"
        >
          <template slot-scope="{ row }">
            <span
              :style="{
                color:
                  row.VerifyState == 0
                    ? 'green'
                    : row.VerifyState == 1
                      ? 'red'
                      : 'black',
                'font-weight': 'bold',
              }"
            >
              {{
                row.VerifyState === '0'
                  ? '通过'
                  : row.VerifyState === '1'
                    ? '退回'
                    : '未审核'
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="DirectoryName" label="所属目录" />
        <el-table-column fixed="right" label="操作" width="80" align="center">
          <template slot-scope="{ row }">
            <el-button
              class="item"
              size="mini"
              @click="Verity(row)"
            >审核
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
      :title="templateDialogTitle"
      :close-on-click-modal="false"
      :visible.sync="templateDialog"
      :width="device === 'desktop' ? '50%' : '90%'"
      @close="cancel"
    >
      <el-form size="mini" label-width="80px" style="color: #606266">
        <el-form-item label="执行进度">
          <el-progress
            :text-inside="true"
            :stroke-width="18"
            :percentage="parseFloat(seeRowData.Executeschedule)"
          />
        </el-form-item>
        <el-form-item label="执行分数">
          <el-input v-model="seeRowData.ExecuteGrade" disabled />
        </el-form-item>
      </el-form>
      <el-table
        :data="seeRowData.File_List"
        stripe
        style="width: 100%; height: 200px"
        size="mini"
      >
        <el-table-column prop="FileName" label="文件名" align="center" />
        <el-table-column prop="FileUrl" label="下载" align="center">
          <template slot-scope="{ row }">
            <el-link :href="row.FileUrl" target="_blank">
              <el-button icon="el-icon-download" circle size="mini" />
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="OpenFileUrl" label="文件预览" align="center">
          <template slot-scope="{ row }">
            <el-button
              icon="el-icon-view"
              circle
              size="mini"
              @click="PreviewFile(row.FileUrl)"
            />
          </template>
        </el-table-column>
      </el-table>
      <el-card shadow="never">
        <!-- <div v-html="ExecuteContent" /> -->
        <tinymce ref="tinymceRef" />
      </el-card>
      <el-form ref="VerityForm" :rules="rules" size="mini" :model="VerityForm">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="分数" prop="VerifyGrade">
              <el-input v-model="VerityForm.VerifyGrade" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审核状态" prop="VerifyState">
              <el-select
                v-model="VerityForm.VerifyState"
                placeholder="请选择"
                style="width: 100%"
              >
                <el-option
                  v-for="item in VerifyState"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="审核意见">
              <el-input
                v-model="VerityForm.VerifyOpinion"
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
              />
            </el-form-item>
          </el-col>
        </el-row>
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
import { InsertVerity, SelectVerifyList, UpdateVerity } from '@/api/KmApi';
import { mapGetters } from 'vuex';
import defaultDepts from '@/views/components/defaultDepts';
import tinymce from '@/components/tinymce';
import { SelectFileByExecuteID } from '@/api/file/index';
import { PreviewFile } from '@/api/Article';

export default {
  name: 'KMManager',
  components: { defaultDepts, tinymce },
  data() {
    return {
      listLoading: false,
      templateDialog: false,
      templateDialogTitle: '',
      listQuery: {
        UserID: window.userInfo[0].UserID,
        pageIndex: 1,
        pageSize: 15,
        CheckListName: '',
        UserName: '',
        VerifyOpinion: '',
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
      VerityForm: {
        ExecuteID: 0,
        VerifyGrade: 0,
        VerifyOpinion: '',
        CreateUserID: window.userInfo[0].UserID,
        VerifyState: 0
      },
      ExecuteContent: '',
      VerifyState: [
        {
          label: '通过',
          value: '0'
        },
        {
          label: '退回',
          value: '1'
        }
      ],
      dialogType: '审核',
      rules: {
        VerifyState: [
          { required: true, message: '请选择审核状态', trigger: 'change' }
        ],
        VerifyGrade: [
          { required: true, message: '请输入分数', trigger: 'blur' }
        ]
      },
      editorConfig: {
        skin: 'moono-lisa',
        removePlugins: 'elementspath',
        removeButtons: 'About',
        format_tags: 'p;h1;h2;h3;pre',
        height: 400,
        removeDialogTabs: 'image:advanced;image:Link'
      },
      seeRowData: {
        Executeschedule: 0,
        ExecuteGrade: '',
        File_List: []
      },
      cellOverflow: true
    };
  },
  computed: {
    ...mapGetters(['device'])
  },
  created() {
    this.SelectVerifyList();
  },
  methods: {
    InsertCheckList() {
      this.$refs.VerityForm.validate(async v => {
        if (v) {
          try {
            const { msg } =
              this.dialogType === '审核'
                ? await InsertVerity(this.VerityForm)
                : await UpdateVerity(this.VerityForm);
            this.$message({
              type: 'info',
              message: msg
            });
            this.templateDialog = false;
          } catch {
          }
        }
      });
    },
    CheckListCancel() {
      this.templateDialog = false;
    },
    Verity(row) {
      this.seeRowData.Executeschedule = row.Executeschedule;
      this.seeRowData.ExecuteGrade = row.ExecuteGrade;
      this.templateDialogTitle = row.CheckListName;
      this.ExecuteContent = row.ExecuteContent;
      this.VerityForm.ExecuteID = row.ExecuteID;
      this.VerityForm.VerifyState = row.VerifyState;
      this.$nextTick(() => {
        this.$refs.tinymceRef.setContent(this.ExecuteContent);
      });
      this.SelectFileByExecuteID(row.ExecuteID);
      this.templateDialog = true;
    },
    async SelectVerifyList() {
      try {
        this.listLoading = true;
        const { data } = await SelectVerifyList(this.listQuery);
        this.tableData = data.DataList;
        this.pagination.total = data.Total;
      } catch {
      } finally {
        this.listLoading = false;
      }
    },
    async clickSelectVerifyList() {
      this.pagination.pageIndex = 1;
      this.listQuery.pageIndex = 1;
      this.SelectVerifyList();
    },
    handleCurrentChange(index) {
      this.listQuery.pageIndex = index;
      this.SelectVerifyList();
    },
    handleSizeChange(page) {
      this.listQuery.pageSize = page;
      this.clickSelectVerifyList();
    },
    selectDefaultDeptValues(val) {
      this.listQuery.DeptID = val;
      this.clickSelectVerifyList();
    },
    datePickerChange(val) {
      this.clickSelectVerifyList();
    },
    cancel() {
      this.$nextTick(() => {
        this.$refs.tinymceRef.deactivated(); /* 销毁编辑器 */
      });
    },
    async SelectFileByExecuteID(val) {
      /* 查询文件 */
      const { data } = await SelectFileByExecuteID({
        ExecuteID: val
      });
      this.seeRowData.File_List = data;
    },
    async PreviewFile(title) {
      title = title.replace(/\/Annex\/file\/|\/Annex\/file/g, '');
      /* 文件预览 */
      const { data } = await PreviewFile({
        Title: title
      });
      this.$nextTick(() => {
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = data;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
      });
    }
  }
};
</script>
<style lang="scss">
@import '../../KS_Styles/index.scss';
</style>
