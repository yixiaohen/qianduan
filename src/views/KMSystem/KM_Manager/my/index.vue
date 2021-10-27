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
          :show-overflow-tooltip="cellOverflow"
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
          <template slot-scope="{ row }">
            {{ row.ExecuteDate ? row.ExecuteDate.replace('T', ' ') : '' }}
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
            >{{ scope.row.VerifyState }}</span>
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
        <el-form-item label="自查科室" style="width: 150px">
          <default-depts
            w="100%"
            :multiple="true"
            :value="ExecuteListForm.DeptIDArr"
            @getDefaultDeptsValue="getDefaultDeptValues"
          />
        </el-form-item>
        <el-form-item label="年月" style="width: 120px">
          <el-date-picker
            v-model="ExecuteListForm.Date"
            range-separator="-"
            value-format="yyyy-MM"
            type="month"
            placeholder="选择年月"
          />
        </el-form-item>
        <el-form-item label="文件上传">
          <el-upload
            :multiple="true"
            :show-file-list="true"
            :on-success="handleSuccess"
            class="editor-slide-upload"
            :file-list="fileList"
            action="/api/RC_File/UploadFile"
          >
            <el-button size="mini" type="primary">选择文件</el-button>
          </el-upload>
        </el-form-item>
        <el-table
          :data="ExecuteListForm.File_List"
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
          <el-table-column
            prop="OpenFileUrl"
            label="删除"
            width="50px"
            align="center"
          >
            <template slot-scope="{ $index }">
              <el-popconfirm
                confirm-button-text="是"
                cancel-button-text="否"
                icon="el-icon-info"
                icon-color="red"
                title="确定删除吗？"
                @confirm="deleteFile($index)"
              >
                <i
                  slot="reference"
                  style="cursor: pointer"
                  class="el-icon-delete"
                />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
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
      top="2vh"
    >
      <el-form
        ref="ExecuteListForm"
        size="mini"
        :model="ExecuteListForm"
        inline
        label-position="top"
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
        <el-form-item label="自查科室" style="width: 150px">
          <default-depts
            :multiple="true"
            w="100%"
            :value="ExecuteListForm.DeptIDArr"
            @getDefaultDeptsValue="getDefaultDeptValues"
          />
        </el-form-item>

        <el-form-item label="年月" style="width: 120px">
          <el-date-picker
            v-model="ExecuteListForm.Date"
            range-separator="-"
            value-format="yyyy-MM"
            type="month"
            placeholder="选择年月"
            style="width: 120px"
          />
        </el-form-item>
        <el-form-item label="文件上传" style="width: 120px">
          <el-upload
            :multiple="true"
            :show-file-list="true"
            :on-success="handleSuccess"
            class="editor-slide-upload"
            :file-list="fileList"
            action="/api/RC_File/UploadFile"
          >
            <el-button size="mini" type="primary">选择文件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <el-table
        :data="ExecuteListForm.File_List"
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
        <el-table-column
          prop="OpenFileUrl"
          label="删除"
          width="50px"
          align="center"
        >
          <template slot-scope="{ $index }">
            <el-popconfirm
              confirm-button-text="是"
              cancel-button-text="否"
              icon="el-icon-info"
              icon-color="red"
              title="确定删除吗？"
              @confirm="deleteFile($index)"
            >
              <i
                slot="reference"
                style="cursor: pointer"
                class="el-icon-delete"
              />
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <div>
        <ckeditor
          v-model="ExecuteListForm.ExecuteContent"
          :config="editorConfig"
        />
      </div>

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
import { PreviewFile } from '@/api/Article';
import { SelectFileByExecuteID } from '@/api/file/index';

export default {
  name: 'KMManagerMy',
  components: { wangeditor, defaultDepts },
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
        ExecuteGrade: '',
        RC_InspectionDepartment: '',
        File_List: [],
        DeptID: [],
        DeptIDArr: [],
        Date: ''
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
      fileList: [],
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
      this.ExecuteListForm.DeptID = this.ExecuteListForm.DeptIDArr.toString();
      const formData = { ...this.ExecuteListForm };
      try {
        const { data, msg } = await InsertExecute(formData);
        this.curRow.ExecuteContent = this.ExecuteListForm.ExecuteContent; // 更新内容
        if (this.curRow.ExecuteID == 0) this.curRow.ExecuteID = data.ExecuteID; // 新增数据库行，分配了id
        this.curRow.ExecuteDate = data.ExecuteDate; // 从后台返回的 执行时间
        this.curRow.Executeschedule = data.Executeschedule;
        this.$message.success(msg);
        this.templateDialog = false;
      } catch {
      }
    },
    CheckListCancel() {
      this.templateDialog = false;
    },
    execute(row) {
      const date = new Date();
      const year = date.getFullYear().toString();
      const month =
        date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1).toString()
          : (date.getMonth() + 1).toString(); // '04'
      const today = year + '-' + month;
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
      this.ExecuteListForm.DeptIDArr = row.DeptID ? row.DeptID.split(',') : [];
      this.ExecuteListForm.Date = row.Date || today;
      this.SelectFileByExecuteID(row.ExecuteID);
      this.templateDialog = true;
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
    getDefaultDeptValues(val) {
      this.ExecuteListForm.DeptIDArr = val;
    },
    handleSuccess(response, file) {
      if (response.code === 200) {
        const data = response.data[0];
        this.ExecuteListForm.File_List.push({
          FileName: data.FileName,
          FileUrl: data.FileUrl,
          OpenFileUrl: data.OpenFileUrl
        });
      } else {
        this.ExecuteListForm.File_List = [];
        this.$message.error(file.name + '上传失败');
      }
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
    },
    async SelectFileByExecuteID(val) {
      /* 查询文件 */
      const { data } = await SelectFileByExecuteID({
        ExecuteID: val
      });
      this.ExecuteListForm.File_List = data;
    },
    deleteFile(index) {
      this.ExecuteListForm.File_List.splice(index, 1);
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
@import '../../KS_Styles/index.scss';
</style>
