<template>
  <el-card class="box-card-view">
    <el-card shadow="never" class="right-box-card">
      <div slot="header" class="text flex">
        <el-form label-position="left" :inline="true" size="mini">
          <el-form-item>
            <el-input
              v-model="listQuery.TaskName"
              placeholder="任务名称"
              style="width: 150px"
              size="mini"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="listQuery.CheckListName"
              placeholder="查检单名称"
              style="width: 150px"
              size="mini"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="listQuery.ExecuteUserName"
              placeholder="执行人"
              style="width: 100px"
              size="mini"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="listQuery.UserName"
              placeholder="审核人"
              style="width: 100px"
              size="mini"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="listQuery.VerifyState"
              placeholder="审核状态"
              style="width: 100px"
            >
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
              @click="clickSelectQualitySupervisionList()"
            >搜索
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-view"
              size="mini"
              @click="execute()"
            >详情
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="mini"
              @click="archive()"
            >批量归档
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        v-loading="listLoading"
        :data="tableData"
        height="calc(100vh - 220px)"
        border
        highlight-current-row
        size="mini"
        @current-change="rowChange"
        @expand-change="expandChange"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="39" />
        <el-table-column type="expand" width="50" align="center">
          <template slot-scope="props">
            <label>审核历史</label>
            <div v-html="props.row.checkHistory" />
            <label>审核流程</label>
            <el-timeline>
              <el-timeline-item
                v-for="(item, index) in props.row.flowData"
                :key="index"
                :timestamp="item.timestamp"
                :icon="item.icon"
                :type="item.type"
                :color="item.color"
                :size="item.size"
              >
                {{ item.content }}
              </el-timeline-item>
            </el-timeline>
          </template>
        </el-table-column>
        <el-table-column type="index" width="50" label="序号" align="center" />
        <el-table-column
          prop="TaskName"
          label="任务名称"
          show-overflow-tooltip
        />
        <el-table-column prop="CheckListName" label="查检单名称" width="200" />
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
        <el-table-column prop="DirectoryName" label="所属目录" />
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
          prop="ExecuteUser"
          label="执行人"
          show-overflow-tooltip
        />
        <el-table-column label="操作" align="center" fixed="right" width="90">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.ExecuteID"
              size="mini"
              @click="archive(scope.row)"
            >归档
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
        </el-col>
      </el-row>
    </el-card>
    <el-dialog
      v-if="device === 'mobile'"
      :title="templateDialogTitle"
      :visible.sync="templateDialog"
      width="100%"
      @opened="opened"
    >
      <el-form
        ref="ExecuteListForm"
        size="mini"
        :model="ExecuteListForm"
        inline
      >
        <el-form-item label="执行进度" style="width: 300px">
          <div style="width: 150px">
            <el-progress
              :text-inside="true"
              :stroke-width="18"
              :percentage="parseFloat(ExecuteListForm.Executeschedule)"
            />
          </div>
        </el-form-item>
        <el-form-item label="执行分数" style="width: 300px">
          <el-input
            v-model="ExecuteListForm.ExecuteGrade"
            style="width: 150px"
            placeholder="分数"
            size="mini"
            clearable
          />
        </el-form-item>
        <div>
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
        <el-button size="mini" @click="CheckListCancel">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-if="device === 'desktop'"
      :title="templateDialogTitle"
      :visible.sync="templateDialog"
      width="50%"
    >
      <el-form
        ref="ExecuteListForm"
        size="mini"
        :model="ExecuteListForm"
        inline
      >
        <el-form-item label="执行进度" style="width: 300px">
          <div style="width: 150px">
            <el-progress
              :text-inside="true"
              :stroke-width="18"
              :percentage="parseFloat(ExecuteListForm.Executeschedule)"
            />
          </div>
        </el-form-item>
        <el-form-item label="执行分数" style="width: 300px">
          <el-input
            v-model="ExecuteListForm.ExecuteGrade"
            style="width: 150px"
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
        <el-button size="mini" @click="CheckListCancel">关 闭</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="600px"
    >
      <el-card shadow="never">
        <div style="display: flex">
          <div style="width: 60%">
            <kmCatalog :height="'330px'" @nodeClickCatalog="nodeClickCatalog" />
          </div>
          <div style="width: 40%">
            <kmArticlegroup
              style="width: 200px"
              @getSelectAllArticleGroupValue="getSelectAllArticleGroupValue"
            />
            <el-input
              v-model="catalogName"
              type="textarea"
              placeholder="条款要点"
              disabled
              :rows="12"
              style="margin-top: 5px"
            />
          </div>
        </div>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancel">取 消</el-button>
        <el-button
          type="primary"
          size="mini"
          @click="insertArticle"
        >确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>
<script>
import wangeditor from '@/components/Editor/index'; /* 富文本编辑器 */
import kmCatalog from '@/views/components/kmCatalog';
import kmArticlegroup from '@/views/components/kmArticlegroup';
import { mapGetters } from 'vuex';
import defaultDepts from '@/views/components/defaultDepts';
import { InsertArticle, SelectKMProcess, SelectQualitySupervisionList, SelectVerifyDetail } from '@/api/KmApi';

export default {
  name: 'KMQualitySupervision',
  components: {
    kmCatalog,
    kmArticlegroup,
    wangeditor,
    mapGetters,
    defaultDepts
  },
  data() {
    return {
      curRow: null,
      multipleSelection: '',
      listLoading: false,
      templateDialog: false,
      templateDialogTitle: '',
      dialogVisible: false,
      title: '',
      catalogName: '',
      formData: {},
      submitData: {
        GroupID: 0,
        CatalogID: 0,
        ExecuteIDArray: [],
        UserCode: window.userInfo[0].UserCode
      },
      listQuery: {
        // condition: '',
        UserID: window.userInfo[0].UserID,
        pageIndex: 1,
        pageSize: 15,
        CheckListName: '',
        ExecuteUserName: '',
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
      formCurInfo: {
        VerifyGrade: '', // 分数
        VerifyOpinion: '', // 审核意见
        CreateDate: '', // 审核时间
        VerifyUser: '', // 审核人
        VerifyState: '', // 审核状态
        VerifyGradeRecord: '', // 历史分数
        VerifyOpinionRecord: '', // 历史审核意见
        CreateDateRecord: '', // 历史审核时间
        VerifyUserRecord: '', // 历史审核人
        VerifyStateRecord: '' // 历史审核状态
      },
      isClear: false,
      cellOverflow: true
    };
  },
  computed: {
    ...mapGetters(['device'])
  },
  created() {
    this.SelectQualitySupervisionList();
    let x = 0;
    for (let i = 0; i < 10; i++) {
      this.schedule.push({
        value: `${(x += 10)}`,
        label: 10 * i + 10 + '%'
      });
    }
  },
  methods: {
    rowChange(row) {
      this.curRow = row;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    CheckListCancel() {
      this.templateDialog = false;
    },
    execute() {
      if (this.curRow == null) {
        this.$message('请选中下表需要查看的行');
        return;
      }
      this.templateDialogTitle = this.curRow.CheckListName;
      this.ExecuteListForm.ExecuteID = this.curRow.ExecuteID || 0;
      if (this.ExecuteListForm.ExecuteID == 0) {
        this.ExecuteListForm.ExecuteContent =
          this.curRow.CheckListContent || '';
      } else {
        this.ExecuteListForm.ExecuteContent = this.curRow.ExecuteContent || '';
      }
      this.ExecuteListForm.Executeschedule = this.curRow.Executeschedule || '';
      this.ExecuteListForm.ExecuteGrade = this.curRow.ExecuteGrade;
      this.ExecuteListForm.DetailID = this.curRow.DetailID || 0;
      this.templateDialog = true;
    },
    expandChange(row, expandedRows) {
      if (row.ExecuteID) {
        this.SelectVerifyDetail(row);
        this.SelectKMProcess(row);
      }
    },
    async SelectVerifyDetail(row) {
      try {
        const { data } = await SelectVerifyDetail({
          ExecuteID: row.ExecuteID
        });
        if (data.length) {
          let s = '';
          data.forEach(element => {
            s += `<tr><td>${element.VerifyState}</td>
            <td>${element.CreateDate.replace('T', ' ')}</td>
            <td>${element.VerifyGrade}</td>
            <td>${element.VerifyOpinion}</td>
            <td>${element.VerifyUser}</td></tr>`;
          });
          row.checkHistory = `<table width="100%" class="data"><tr><th>审核状态</th><th>审核时间</th><th>分数</th><th>审核意见</th><th>审核人</th></tr>
            ${s}</table>`;
        } else {
          row.checkHistory = '';
        }
      } catch {
      }
    },
    async SelectKMProcess(row) {
      try {
        const { data } = await SelectKMProcess({
          ExecuteID: row.ExecuteID
        });
        if (data.length) {
          const flowData = [];
          data.forEach(element => {
            if (element.VerifyState == null) {
              element.VerifyState = '';
            } else {
              element.VerifyState = `(${element.VerifyState})`;
            }
            if (element.Type == '执行') {
              element.Type = 'el-icon-star-on';
              element.color = '#2c7feb';
            } else if (element.Type == '审核') {
              element.Type = 'el-icon-more';
              if (element.VerifyState == '(通过)') {
                element.color = 'green';
              } else if (element.VerifyState == '(退回)') {
                element.color = '#d33535';
              }
            }
            flowData.push({
              content: `${element.UserName}${element.VerifyState}`,
              timestamp: element.CreateDate.replace('T', ' '),
              size: 'large',
              type: 'primary',
              icon: element.Type,
              color: element.color
            });
          });
          row.flowData = flowData;
        } else {
          row.flowData = '';
        }
      } catch {
      } finally {
      }
    },
    async SelectQualitySupervisionList() {
      this.listLoading = true;
      try {
        const { data } = await SelectQualitySupervisionList(this.listQuery);
        this.tableData = [];
        data.DataList.forEach(item => {
          item.checkHistory = '';
          item.flowData = '';
          this.tableData.push(item);
        });
        this.pagination.total = data.Total;
      } catch {
      } finally {
        this.listLoading = false;
      }
    },
    async clickSelectQualitySupervisionList() {
      this.pagination.pageIndex = 1;
      this.listQuery.pageIndex = 1;
      this.SelectQualitySupervisionList();
    },
    handleCurrentChange(index) {
      this.listQuery.pageIndex = index;
      this.SelectQualitySupervisionList();
    },
    handleSizeChange(page) {
      this.listQuery.pageSize = page;
      this.clickSelectQualitySupervisionList();
    },
    async insertArticle() {
      /* IsCriterion 是标准（第3级 1.2.3）或要点ChildCount == 0（最下一级） */
      if (
        (this.formData.IsCriterion == true || this.formData.ChildCount == 0) &&
        this.submitData.GroupID
      ) {
        this.submitData.ExecuteIDArray = [];
        if (this.formData.ExecuteID == undefined) {
          if (this.multipleSelection != '' && this.multipleSelection.length) {
            this.multipleSelection.forEach(item => {
              if (item.ExecuteID) {
                this.submitData.ExecuteIDArray.push(item.ExecuteID);
              }
            });
          }
        } else {
          this.submitData.ExecuteIDArray.push(this.formData.ExecuteID);
        }
        try {
          const { msg } = await InsertArticle(this.submitData);
          this.$message({
            type: 'success',
            message: msg
          });
          this.cancel();
        } catch {
        }
      } else {
        this.$notify({
          title: '警告',
          type: 'warning',
          message: '请选择 资料类别和子集评审标准！'
        });
      }
    },
    getSelectAllArticleGroupValue(v) {
      this.submitData.GroupID = v;
    },
    nodeClickCatalog(v) {
      this.catalogName = v.CatalogName;
      this.submitData.CatalogID = v.CatalogID;
      this.formData.IsCriterion = v.IsCriterion;
      this.formData.ChildCount = v.ChildCount;
    },
    async archive(row) {
      if (row == undefined) {
        if (
          this.multipleSelection == '' ||
          this.multipleSelection.length == 0
        ) {
          this.$message({ type: 'error', message: '请选择需要归档的任务' });
          return;
        }
      } else {
        this.title = row.TaskName;
        this.formData = row;
      }
      this.dialogVisible = true;
    },
    cancel() {
      this.dialogVisible = false;
      this.title = '';
      this.catalogName = '';
      if (this.formData.ExecuteID) this.formData = {};
    },
    getContent(value) {
      this.ExecuteListForm.ExecuteContent = value;
    },
    opened() {
      this.$refs.wangEdit.setContent(this.ExecuteListForm.ExecuteContent);
    },
    selectDefaultDeptValues(val) {
      this.listQuery.DeptID = val;
      this.clickSelectQualitySupervisionList();
    },
    datePickerChange(val) {
      this.clickSelectQualitySupervisionList();
    }
  }
};
</script>
<style lang="scss">
@import '../KS_Styles/index.scss';

.data {
  border: 1px solid rgb(206, 205, 205);
  color: #000;
}
</style>
