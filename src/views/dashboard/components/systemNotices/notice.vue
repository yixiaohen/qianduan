<template>
  <div class="JobSet">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form :label-position="labelPosition" :inline="true">
          <el-form-item>
            <el-button
              type="success"
              size="mini"
              @click="backFirst"
            >返回</el-button>
            <el-button
              type="primary"
              icon="el-icon-circle-plus"
              size="mini"
              @click="addRow"
            >发布公告</el-button>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="listQuery.condition"
              placeholder="公告标题"
              style="width: 180px"
              size="mini"
              class="filter-item inline-input"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="listQuery.condition1"
              placeholder="接收科室"
              style="width: 180px"
              size="mini"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="info"
              icon="el-icon-search"
              :loading="listLoading"
              size="mini"
              @click="clickSelectNotice()"
            >搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="content">
        <el-table
          v-loading="listLoading"
          :data="tableData"
          style="width: 100%"
          border
          size="mini"
          height="calc(100vh - 220px)"
        >
          <el-table-column
            type="index"
            label="序号"
            width="60"
            align="center"
          />
          <el-table-column prop="NoticeTitle" label="公告标题" />
          <!-- <el-table-column prop="NoticeContent" label="公告内容" width="550">
            <template slot-scope="scope">
              <div v-html="scope.row.NoticeContent" />
            </template>
          </el-table-column> -->
          <el-table-column
            prop="DeptName"
            label="接收科室"
            align="center"
            width="200"
          />
          <el-table-column
            prop="NoticeUserName"
            label="接收人"
            align="center"
            width="200"
          />
          <el-table-column
            prop="UserName"
            label="发布者"
            align="center"
            width="130"
          />
          <el-table-column
            prop="NoticeType"
            label="公告类别"
            align="center"
            width="130"
          />
          <el-table-column
            prop="CreateTime"
            label="发布时间"
            align="center"
            width="200"
          >
            <template slot-scope="scope">
              {{ scope.row.CreateTime.split("T").join(" ") }}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="150"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button
                type="info"
                size="mini"
                icon="el-icon-edit"
                @click.native.prevent="editRow(scope.row)"
              />
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click.native.prevent="deleteRow(scope.row)"
              />
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="margin:  0 0 6px 0"
          background
          :current-page.sync="pagination.pageIndex"
          :page-size="pagination.pageSize"
          :page-sizes="pagination.pageSizes"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <el-dialog
      :title="dialogTitle"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      :width="device === 'desktop' ? '50%' : '90%'"
      @opened="open"
    >
      <el-tabs v-model="activeName">
        <el-tab-pane
          label="公告信息"
          name="first"
        ><el-form
          ref="formData"
          :label-position="labelPosition"
          :inline="true"
          :rules="rules"
          :model="formData"
          size="mini"
        >
          <el-form-item label="公告标题" prop="NoticeTitle">
            <el-input v-model="formData.NoticeTitle" />
          </el-form-item>
          <el-form-item label="接收科室" prop="selectedId" size="mini">
            <default-depts
              w="100%"
              :multiple="true"
              :value="formData.DeptID"
              @getDefaultDeptsValue="getDefaultDeptsValue"
            />
          </el-form-item>
          <el-form-item label="公告类别" prop="NoticeType">
            <el-input v-model="formData.NoticeType" />
          </el-form-item>
          <el-form-item label="附件上传">
            <el-upload
              :multiple="true"
              :show-file-list="true"
              :on-success="handleSuccess"
              :on-change="handleChange"
              class="editor-slide-upload"
              :file-list="fileList"
              :action="IP"
            >
              <el-button size="mini"> 选择文件 </el-button>
            </el-upload>
          </el-form-item>
          <wangeditor
            ref="wangEdit"
            :value="formData.NoticeContent"
            :clear="isClear"
            @change="getContent"
          /> </el-form></el-tab-pane>
        <el-tab-pane label="分配到人" name="second">
          <select-deptor-user
            ref="userTree"
            @getSelectDeptorUser="getSelectDeptorUser"
          />
        </el-tab-pane>
      </el-tabs>

      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancel">取 消</el-button>
        <el-button
          size="mini"
          type="primary"
          @click="dialogTitle === '发布公告' ? InsertNotice() : UpdateNotice()"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import wangeditor from '@/components/Editor'; /* 富文本编辑器 */
import { DeleteNotice, InsertNotice, SelectNotice, UpdateNotice } from '@/api/notice';
import defaultDepts from '@/views/components/defaultDepts';
import SelectDeptorUser from '@/views/components/SelectDeptorUser';
import tableHeight from '@/views/mixin/tableHeight';
import { mapGetters } from 'vuex';

export default {
  name: 'Job',
  components: { defaultDepts, wangeditor, SelectDeptorUser },
  mixins: [tableHeight],
  data() {
    return {
      labelPosition: 'top',
      IP: '/api/Article/UploadFile',
      fileList: [],
      url: {
        Content: [],
        Title: []
      },
      uploadEnd: false,
      listLoading: true,
      isClear: false,
      dialogTitle: '',
      formData: {
        NoticeTitle: '',
        NoticeContent: '',
        DeptName: 0,
        UserName: '',
        NoticeType: '',
        NoticeID: 0,
        UserID: window.userInfo[0].UserID,
        DeptID: 0,
        Type: 0,
        NoticeUserID: []
      },
      activeName: 'first',
      rules: {
        NoticeTitle: [
          { required: true, message: '请输入公告标题', trigger: 'blur' }
        ],
        NoticeContent: [
          { required: true, message: '请输入公告内容', trigger: 'blur' }
        ],
        NoticeType: [
          { required: true, message: '请输入公告类别', trigger: 'blur' }
        ]
      },
      listQuery: {
        pageSize: 15,
        pageIndex: 1,
        NoticeTitle: '', // 公告标题
        DeptName: '', // 发布科室
        SelectLocation: 0
      },
      dialogVisible: false,
      tableData: [],
      pagination: {
        pageIndex: 1,
        total: 0,
        pageSize: 15,
        pageSizes: [15, 20, 50, 100, 150, 200]
      }
    };
  },
  created() {
    this.SelectNotice();
  },
  computed: {
    ...mapGetters(['device'])
  },
  methods: {
    // 发布公告之后返回首页
    backFirst(){
      this.$emit('backFirst');
    },
    handleChange(file, fileList) {
      this.uploadEnd = true;
      fileList.forEach((item) => {
        if (item.response && item.response.code === 200) {
          this.uploadEnd = false;
        } else {
          this.uploadEnd = true;
        }
      });
    },
    handleSuccess(response, file) {
      if (response.hasOwnProperty('data')) {
        this.url.Content.push(response.data[0].Content);
        this.url.Title.push(response.data[0].Title);
      } else {
        this.fileList = [];
        this.$message({
          type: 'error',
          message: file.name + '   上传失败'
        });
      }
    },
    getContent(value) {
      this.formData.NoticeContent = value;
    },
    deleteRow(row) {
      this.$confirm(`此操作将永久删除 ${row.NoticeTitle} , 是否继续?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        row.type = 1;
        try {
          const { code, msg } = await DeleteNotice({
            NoticeID: row.NoticeID,
            Type: 1
          });
          code === 200
            ? this.$message({
              type: 'success',
              message: msg
            })
            : this.$message({
              type: 'error',
              message: msg
            });
        } catch {}
        this.SelectNotice();
      });
    },
    UpdateNotice() {
      this.$refs.formData.validate(async(v) => {
        if (v) {
          delete this.formData.DeptName;
          delete this.formData.UserName;
          delete this.formData.Type;
          if (
            this.formData.NoticeContent === '' &&
            this.formData.NoticeID === '' &&
            this.formData.NoticeType === ''
          ) {
            this.$message({
              type: 'error',
              message: '请填写所有数据'
            });
            return;
          }
          const hrefs = [];
          this.url.Content.forEach((e, i) => {
            const url = e.split('\\');
            url.splice(0, 1);
            url.splice(0, 1);
            hrefs.push(
              `<div>修改后新增的附件${
                i + 1
              }: <a style="color:blue;font-size:12px;" href='/Annex/file/${
                this.url.Title[i]
              }' target="_blank">${this.url.Title[i]}</a></div>`
            );
          });
          this.formData.NoticeContent =
            `${hrefs.join('')} ` + `${this.formData.NoticeContent}`;
          try {
            const { msg } = await UpdateNotice(this.formData);
            this.$message.success(msg);
            /* url重置到初始化 */
            Object.assign(this.$data.url, this.$options.data().url);
          } catch {}
          this.dialogVisible = false;
          this.listLoading = true;
          this.isClear = true;
          await this.SelectNotice();
        } else {
          return false;
        }
      });
    },
    open() {
      this.$refs.wangEdit.setContent(this.formData.NoticeContent);
      this.fileList = [];
    },
    cancel() {
      this.fileList = [];
      this.dialogVisible = false;
    },
    editRow(row) {
      row = JSON.parse(JSON.stringify(row));
      this.formData.Type = row.Type;
      this.formData.DeptID = row.DeptID;
      this.formData.DeptName = row.DeptID == '' ? '' : [...row.DeptID];
      this.formData.NoticeID = row.NoticeID;
      this.formData.NoticeTitle = row.NoticeTitle;
      this.formData.NoticeContent = row.NoticeContent;
      this.formData.NoticeType = row.NoticeType;
      this.formData.NoticeUserID =
        row.NoticeUserID == null ? '' : row.NoticeUserID;
      this.$nextTick(() => {
        this.$refs.userTree.setDeptorUser(
          row.NoticeUserID == null ? [] : row.NoticeUserID.split(',')
        );
      });
      this.dialogTitle = '编辑公告';
      this.dialogVisible = true;
    },
    InsertNotice() {
      this.$refs.formData.validate(async(v) => {
        if (v) {
          if (this.formData.NoticeContent === '') {
            this.$message.warning('请填写公告信息');
            return;
          }
          if (!this.formData.DeptID && !this.formData.NoticeUserID) {
            this.$message.warning('至少选择分配到人和接受科室其中的一个！');
            return;
          }
          const hrefs = [];
          this.url.Content.forEach((e, i) => {
            const url = e.split('\\');
            url.splice(0, 1);
            url.splice(0, 1);
            hrefs.push(
              `<div>附件${
                i + 1
              }: <a style="color:blue;font-size:12px;" href='/Annex/file/${
                this.url.Title[i]
              }' target="_blank">${this.url.Title[i]}</a></div>`
            );
          });
          this.formData.NoticeContent =
            `${hrefs.join('')} ` + `${this.formData.NoticeContent}`;
          try {
            const { msg } = await InsertNotice(this.formData);
            this.$message.success(msg);
            /* url重置到初始化 */
            Object.assign(this.$data.url, this.$options.data().url);
          } catch {}
          this.dialogVisible = false;
          this.listLoading = true;
          this.isClear = true;
          this.SelectNotice();
        } else {
          return false;
        }
      });
    },
    addRow() {
      this.formData = {
        NoticeTitle: '',
        NoticeContent: '',
        DeptName: 0,
        UserName: '',
        NoticeID: 0,
        NoticeType: '',
        UserID: window.userInfo[0].UserID,
        DeptID: 0,
        Type: 0
      };
      this.url = {
        Content: [],
        Title: []
      };
      this.fileList = [];
      this.isClear = true;
      this.dialogTitle = '发布公告';
      this.dialogVisible = true;
    },
    getDefaultDeptsValue(value) {
      this.formData.DeptID = value.toString();
    },
    async SelectNotice() {
      try {
        const { data } = await SelectNotice(this.listQuery);
        this.tableData = data.DataList;
        this.pagination.total = data.Total;
      } catch {}
      this.listLoading = false;
    },
    async clickSelectNotice() {
      this.listLoading = true;
      this.listQuery.pageIndex = 1;
      this.pagination.pageIndex = 1;
      this.SelectNotice();
    },
    handleCurrentChange(index) {
      this.listLoading = true;
      this.listQuery.pageIndex = index;
      this.SelectNotice();
    },
    handleSizeChange(page) {
      this.listLoading = true;
      this.listQuery.pageSize = page;
      this.clickSelectNotice();
    },
    getSelectDeptorUser(val) {
      this.formData.NoticeUserID = val.join(',');
    }
  }
};
</script>

<style lang="scss">
.JobSet {
  margin: 4px;
  .el-card__body {
    padding: 6px;
  }
  .el-card__header {
    padding: 2px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;

    .el-form-item {
      margin: 0;
      margin-left: 10px;
    }
  }
}
</style>
