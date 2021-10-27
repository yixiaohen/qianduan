<template>
  <div class="KM_TaskDivision">
    <el-card class="right-box-card">
      <div slot="header" class="clearfix">
        <el-form label-position="left" :inline="true" size="mini">
          <el-form-item>
            <el-button
              type="success"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="InsertDialog"
            >新增</el-button>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="pagination.CheckListName"
              placeholder="查检单名称"
              style="width: 200px"
              size="mini"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="pagination.TaskName"
              placeholder="任务名称"
              style="width: 200px"
              size="mini"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              :loading="listLoading"
              size="mini"
              @click="clickSelectCddetail"
            >搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="content">
        <div class="content_right">
          <el-table
            v-loading="listLoading"
            :data="tableData"
            height="calc(100vh - 221px)"
            border
            size="mini"
          >
            <el-table-column
              type="index"
              width="50"
              label="序号"
              align="center"
            />
            <el-table-column
              prop="TaskName"
              label="任务名称"
              show-overflow-tooltip
            />
            <el-table-column
              prop="CheckListName"
              label="查检单名称"
              show-overflow-tooltip
            />
            <el-table-column
              prop="UserName"
              label="主管科室"
              show-overflow-tooltip
            />
            <el-table-column
              prop="ClinicalUserName"
              :label="km_statistics_a"
              show-overflow-tooltip
            />
            <el-table-column
              prop="CreateUserName"
              label="创建人"
              show-overflow-tooltip
            />
            <el-table-column prop="DirectoryName" label="所属目录" />
            <el-table-column label="操作" align="center" width="95">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  circle
                  type="primary"
                  icon="el-icon-edit"
                  @click="edit(scope.row)"
                />
                <el-button
                  size="mini"
                  circle
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteRow(scope.row)"
                />
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            style="margin: 6px 0 0 0"
            background
            :current-page.sync="pagination.pageIndex"
            :page-size="pagination.pageSize"
            :page-sizes="[15, 20, 30, 40]"
            :total="pagination.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
      <el-dialog
        :title="dialogFormVisibleData.titleDialog"
        :close-on-click-modal="false"
        :visible.sync="dialogFormVisibleData.dialogFormVisible"
        :width="device === 'desktop' ? '760px' : '90%'"
        height="400px"
      >
        <el-tabs v-model="dialogFormVisibleData.activeName">
          <el-tab-pane label="基本资料" name="first" style="height: 450px">
            <el-form
              :model="dialogFormVisibleData"
              size="mini"
              :inline="true"
              label-width="80px"
            >
              <el-form-item label="目录">
                <select-directory
                  :multiple="false"
                  @getDefaultDeptValue="getDefaultDeptData"
                />
              </el-form-item>
              <el-form-item label="查检单">
                <el-select
                  v-model="dialogFormVisibleData.CheckListName"
                  clearable
                  filterable
                  allow-create
                  placeholder="查检单"
                  class="filter-item"
                  style="width: 160px"
                  @focus="SelectCheckListByDirectoryID"
                  @change="selectselectDCID"
                >
                  <el-option
                    v-for="(itemsType,
                            indexsType) in dialogFormVisibleData.DataList"
                    :key="indexsType"
                    :value="itemsType.DCID"
                    :label="itemsType.CheckListName"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="任务名称">
                <el-input
                  v-model="InsertCddetailData.TaskName"
                  placeholder="任务名称"
                  style="width: 180px"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="主管科室" name="second" style="height: 450px">
            <div class="dept-tree">
              <tree-filter
                ref="TreeID"
                :tree-data="TreeFilterData"
                @getSelect="getSelect"
              />
            </div>
          </el-tab-pane>
          <el-tab-pane
            :label="km_statistics_a"
            name="third"
            style="height: 450px"
          >
            <div class="dept-tree">
              <tree-filter
                ref="TreeID2"
                :tree-data="TreeFilterData2"
                @getSelect="getSelect2"
              />
            </div>
          </el-tab-pane>
        </el-tabs>
        <div slot="footer" class="dialog-footer">
          <el-button
            size="mini"
            @click="dialogFormVisibleData.dialogFormVisible = false"
          >取 消</el-button>
          <el-button
            type="primary"
            size="mini"
            @click="submitCddetail"
          >确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { DeleteCddetail, InsertCddetail, SelectCddetail, SelectCheckListByDirectoryID } from '@/api/KmApi';
import { SelectDeptorUser } from '@/api/EvaluationUser';
import SelectDirectory from '@/views/components/SelectDirectorys';
import treeFilter from '@/views/components/treeFilter';
import { mapGetters } from 'vuex';

export default {
  name: 'KMTaskDivision',
  components: { SelectDirectory, treeFilter },
  data() {
    return {
      km_statistics_a: '临床科室',
      listLoading: false,
      tableData: [],
      pagination: {
        pageIndex: 1,
        pageSize: 15,
        total: 0,
        CheckListName: '',
        TaskName: '',
        UserID: window.userInfo[0].UserID
      },
      InsertCddetailData: {
        DetailID: 0, // 详情ID（0：新增 其他：修改）
        TaskName: '', // 任务名称
        DCID: '', // 目录详情ID
        UserID: '', // 主管科室用户ID（逗号隔开）
        ClinicalUserID: '', // 临床科室用户ID（逗号隔开）
        CreateUserID: window.userInfo[0].UserID // 当前登录用户ID
      },
      dialogFormVisibleData: {
        dialogFormVisible: false,
        titleDialog: '',
        activeName: 'first',
        DataList: '',
        DirectoryID: '',
        CheckListName: ''
      },
      TreeFilterData: {
        label: 'Name',
        children: 'children',
        key: 'UserID' /* 要获取的值 */,
        treeData: []
      },
      TreeFilterData2: {
        label: 'Name',
        children: 'children',
        key: 'UserID' /* 要获取的值 */,
        treeData: []
      }
    };
  },
  computed: {
    ...mapGetters(['device'])
  },
  created() {
    this.getIni();
    this.SelectCddetail();
    this.getTreeData();
  },
  methods: {
    async getIni() {
      try {
        const para = this.$store.getters.iniPara;
        if (para.km_statistics_a) this.km_statistics_a = para.km_statistics_a;
      } catch {}
    },
    async SelectCddetail() {
      this.listLoading = true;
      try {
        const { data } = await SelectCddetail(this.pagination);
        this.tableData = data.DataList;
        this.pagination.total = data.Total;
      } catch {
      } finally {
        this.listLoading = false;
      }
    },
    clickSelectCddetail() {
      /* 搜索 */
      this.SelectCddetail();
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.SelectCddetail();
    },
    handleCurrentChange(val) {
      this.pagination.pageIndex = val;
      this.SelectCddetail();
    },
    /* 弹窗部分 */
    InsertDialog() {
      this.InsertCddetailData.TaskName = '';
      this.InsertCddetailData.DCID = '';
      this.dialogFormVisibleData.CheckListName = '';
      this.InsertCddetailData.UserID = '';
      this.InsertCddetailData.ClinicalUserID = '';
      this.dialogFormVisibleData.titleDialog = '新增';
      this.dialogFormVisibleData.dialogFormVisible = true;
      setTimeout(() => {
        this.$refs.TreeID.setDeptorUser([]);
      }, 0);
      setTimeout(() => {
        this.$refs.TreeID2.setDeptorUser([]);
      }, 0);
    },
    async getDefaultDeptData(val) {
      this.dialogFormVisibleData.DirectoryID = val;
      this.SelectCheckListByDirectoryID();
    },
    async SelectCheckListByDirectoryID() {
      this.dialogFormVisibleData.CheckListName = '';
      this.listLoading = true;
      if (!this.dialogFormVisibleData.DirectoryID) {
        this.$message.warning('请您先选择目录!');
        this.listLoading = false;
        return;
      }
      const val = {
        DirectoryID: this.dialogFormVisibleData.DirectoryID,
        CreateUserID: window.userInfo[0].UserID
      };
      try {
        const data1 = await SelectCheckListByDirectoryID(val);
        this.dialogFormVisibleData.DataList = data1.data.DataList;
      } catch {
      } finally {
        this.listLoading = false;
      }
    },
    selectselectDCID(val) {
      this.InsertCddetailData.DCID = val;
    },
    async getTreeData() {
      try {
        const data = await SelectDeptorUser();
        this.TreeFilterData.treeData = data.data;
        this.TreeFilterData2.treeData = data.data;
      } catch {}
    },
    getSelect(val) {
      this.InsertCddetailData.UserID = val;
    },
    getSelect2(val) {
      this.InsertCddetailData.ClinicalUserID = val;
    },
    async submitCddetail() {
      const val = this.InsertCddetailData;
      if (!val.DCID) {
        this.$message.warning('请您先选择目录和查检单!');
        return;
      }
      if (!val.UserID) {
        this.$message.warning('主管科室未填写!');
        return;
      }
      if (!val.ClinicalUserID) {
        this.$message.warning('临床科未填写!');
        return;
      }
      if (!val.TaskName) {
        this.$message.warning('请填写任务名称!');
        return;
      }
      try {
        const data = await InsertCddetail(val);
        if (data.code === 200) {
          this.$message.success(data.msg);
          this.dialogFormVisibleData.dialogFormVisible = false;
          this.SelectCddetail();
        }
      } catch {}
    },
    edit(row) {
      this.dialogFormVisibleData.titleDialog = row.TaskName;
      this.InsertCddetailData.DetailID = row.DetailID;
      this.InsertCddetailData.TaskName = row.TaskName;
      this.InsertCddetailData.DCID = row.DCID;
      setTimeout(() => {
        this.$refs.TreeID.setDeptorUser(row.UserID);
      }, 0);
      setTimeout(() => {
        this.$refs.TreeID2.setDeptorUser(row.ClinicalUserID);
      }, 0);
      this.dialogFormVisibleData.dialogFormVisible = true;
    },
    async deleteRow(row) {
      const DetailID = row.DetailID;
      this.$confirm('此操作将永久删除该任务, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          DeleteCddetail({ DetailID }).then(data => {
            if (data.code === 200) {
              this.$message.success('删除成功!');
              this.SelectCddetail();
            }
          });
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang="scss">
.KM_TaskDivision {
  .el-card__header {
    padding-bottom: 0px !important;
    border-bottom: 0px !important;
  }
  .Dept {
    height: 500px;
    .dept-tree {
      height: 480px;
      overflow-y: auto;
    }
  }
  .el-tab-pane .el-form-item--mini {
    margin: 5px 0px;
  }
  .el-card__body {
    padding: 5px 0px 0px 5px;
  }
  .el-table {
    height: calc(100vh - 162px) !important;
  }
}
</style>
<style lang="scss">
@import "../KS_Styles/index.scss";
</style>
