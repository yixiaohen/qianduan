<template>
  <div class="EvaluationUser">
    <el-card class="box-card">
      <div
        slot="header"
        ref="clearfix"
        :style="{ height: clearfixHeight + 'px' }"
        class="clearfix"
      >
        <el-form label-position="right" :model="formData" :inline="true" size="mini">
          <el-form-item>
            <el-button
              :class="clearfixHeight == 30 ? 'el-icon-arrow-right' : 'el-icon-arrow-down'"
              @click="unfold"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="listQuery.CatalogCode"
              placeholder="标准编号"
              style="width: 150px"
              size="mini"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="listQuery.CatalogName"
              placeholder="评审标准内容"
              style="width: 150px"
              size="mini"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="value"
              placeholder="请选择人员姓名"
              style="width: 130px"
              @change="changeUsername"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="userName"
              placeholder="人员姓名"
              style="width: 100px"
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
              @click="clickSelectEvaluationUser()"
            >搜索</el-button>
          </el-form-item>
          <!-- ReviewName:执行人员姓名
          ManageName:主管人员姓名
          VisitName:分管院领导姓名 -->
          <el-form-item v-if="menu == false">
            <el-button
              v-if="EvaluationUserRoleCount === 0 ? false : true"
              :loading="listLoading"
              icon="el-icon-user-solid"
              size="mini"
              @click="distributionFunction"
            >{{ menu_one }}</el-button>
          </el-form-item>
          <el-form-item v-if="menu == false">
            <el-button
              v-if="
                EvaluationUserRoleCount === 0
                  ? false
                  : EvaluationUserRoleCount === 1
                    ? false
                    : true
              "
              :loading="listLoading"
              icon="el-icon-user-solid"
              size="mini"
              @click="distributionFunction"
            >{{ menu_two }}</el-button>
          </el-form-item>
          <el-form-item v-if="menu == false">
            <el-button
              v-if="EvaluationUserRoleCount == 3"
              :loading="listLoading"
              icon="el-icon-user-solid"
              size="mini"
              @click="distributionFunction"
            >{{ menu_three }}</el-button>
          </el-form-item>
          <el-form-item v-if="menu == true">
            <el-button
              v-if="EvaluationUserRoleCount == 3"
              :loading="listLoading"
              icon="el-icon-user-solid"
              size="mini"
              @click="distributionFunction"
            >{{ menu_one }}</el-button>
          </el-form-item>
          <el-form-item v-if="menu == true">
            <el-button
              v-if="EvaluationUserRoleCount == 3"
              :loading="listLoading"
              icon="el-icon-user-solid"
              size="mini"
              @click="distributionFunction"
            >{{ menu_two }}</el-button>
          </el-form-item>
          <el-form-item v-if="menu == true">
            <el-button
              v-if="EvaluationUserRoleCount == 3"
              :loading="listLoading"
              icon="el-icon-user-solid"
              size="mini"
              @click="distributionFunction"
            >{{ menu_three }}</el-button>
          </el-form-item>

          <!-- <el-form-item>
            <el-button
              v-if="
                menu_one != undefined &&
                (showRoleNameButton('系统管理员') ||
                  showRoleNameButton(menu_one.replace('审核', '负责人')) ||
                  showRoleNameButton(menu_two.replace('审核', '负责人')) ||
                  showRoleNameButton(menu_three.replace('审核', '负责人')))
              "
              tag="1"
              :loading="listLoading"
              icon="el-icon-user-solid"
              size="mini"
              @click="distributionFunction"
              >{{ menu_one }}</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button
              v-if="
                menu_two != undefined &&
                (showRoleNameButton('系统管理员') ||
                  showRoleNameButton(menu_two.replace('审核', '负责人')) ||
                  showRoleNameButton(menu_three.replace('审核', '负责人')))
              "
              tag="2"
              :loading="listLoading"
              icon="el-icon-user-solid"
              size="mini"
              @click="distributionFunction"
              >{{ menu_two }}</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button
              v-if="
                menu_three != undefined &&
                (showRoleNameButton('系统管理员') ||
                  showRoleNameButton(menu_three.replace('审核', '负责人')))
              "
              tag="3"
              :loading="listLoading"
              icon="el-icon-user-solid"
              size="mini"
              @click="distributionFunction"
              >{{ menu_three }}</el-button
            >
          </el-form-item> -->
          <!-- <el-form-item>
            <el-button
              :loading="listLoading"
              :disabled="downloadLoading"
              type="success"
              icon="el-icon-document"
              size="mini"
              @click="distributionFunction('分配组别')"
              >分配组别</el-button
            >
          </el-form-item> -->
          <el-form-item style="width: 150px">
            <el-select v-model="downloadValue" placeholder="请选择要导出数据">
              <el-option label="前一百条" value="100" />
              <el-option label="前三百条" value="300" />
              <el-option label="前五百条" value="500" />
              <el-option label="前一千条" value="1000" />
              <el-option label="全部" :value="pagination.total" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              :loading="downloadLoading"
              type="success"
              icon="el-icon-download"
              :disabled="listLoading"
              size="mini"
              @click="handleDownload"
            >导出</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="content">
        <el-table
          ref="multipleTable"
          v-loading="listLoading"
          :data="tableData"
          style="width: 100%"
          border
          row-key="CatalogID"
          size="mini"
          height="calc(100vh - 186px)"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="40" align="center" fixed="left" />
          <el-table-column prop="CatalogCode" label="评审标准" width="120" />
          <el-table-column prop="TypeName" label="章节" width="120" />
          <el-table-column prop="IsPoint" label="核心条款" width="80" align="center">
            <template slot-scope="{ row }">
              <el-tag size="mini" :type="row.IsPoint === 0 ? 'danger' : 'success'">{{
                row.IsPoint === 0 ? "否" : "是"
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="CatalogName" label="标准内容" min-width="400" />
          <!-- <el-table-column prop="ReviewName" label="主管部门审核" width="320" />
          <el-table-column prop="ManageName" label="分管领导审核" width="320" />
          <el-table-column prop="VisitName" label="等级办审核" width="320" /> -->

          <el-table-column
            v-if="menu_one != undefined"
            prop="ReviewName"
            :label="menu_one"
            width="320"
          />
          <el-table-column
            v-if="menu_two != undefined"
            prop="ManageName"
            :label="menu_two"
            width="320"
          />
          <el-table-column
            v-if="menu_three != undefined"
            prop="VisitName"
            :label="menu_three"
            width="320"
          />
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
          :close-on-click-modal="false"
          title="人员选择"
          :visible.sync="dialogVisible"
          :width="device === 'desktop' ? '40%' : '90%'"
          @closed="closed"
        >
          <select-deptor-user ref="userTree" @getSelectDeptorUser="getSelectDeptorUser" />
          <span slot="footer" class="dialog-footer">
            <el-button
              type="primary"
              size="mini"
              @click="UpdatetEvaluationUser"
            >增量保存</el-button>
            <el-button
              type="info"
              size="mini"
              @click="UpdatetEvaluationUser"
            >覆盖保存</el-button>
            <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
          </span>
        </el-dialog>
        <el-dialog
          :close-on-click-modal="false"
          title="分配组别"
          :visible.sync="InsertGroupDialog"
          :width="device === 'desktop' ? '50%' : '90%'"
          @closed="closed"
        >
          <defaultDepts :multiple="false" @getDefaultDeptsValue="getDefaultDeptValues" />
          <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click="InsertGroupDialog = false">取 消</el-button>
            <el-button type="primary" size="mini" @click="InsertGroupID">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>
<script>
import defaultDepts from '@/views/components/defaultDepts';
import {
  IncrementSave,
  InsertGroupID,
  SelectEvaluationUser,
  SelectEvaluationUserRoleCount,
  UpdatetEvaluationUser
} from '@/api/EvaluationUser';
import SelectDeptorUser from '@/views/components/SelectDeptorUser';
import tableHeight from '@/views/mixin/tableHeight';
import { mapGetters } from 'vuex';

export default {
  name: 'EvaluationUser',
  components: { SelectDeptorUser, defaultDepts },
  mixins: [tableHeight],
  data() {
    return {
      listLoading: true,
      dialogVisible: false,
      downloadLoading: false,
      menu_one: '',
      menu_two: '',
      menu_three: '',
      menu: '' /* 是否是管理员才可以看到 */,
      role_one: '',
      role_two: '',
      role_three: '',
      tableData: [],
      deptUsers: [],
      roleNames: [],
      formData: {
        CatalogID: 0,
        Review: '',
        Manage: '',
        Visit: ''
      },
      listQuery: {
        pageSize: 50,
        pageIndex: 1,
        CatalogName: '',
        CatalogCode: '',
        UserID: window.userInfo[0].UserID,
        ReviewName: '',
        ManageName: '',
        VisitName: ''
      },
      options: [],
      options2: [],
      value: '',
      tableSelecteds: [],
      CatalogIDs: [],
      targetInnerText: '',
      pagination: {
        pageIndex: 1,
        total: 0,
        pageSize: 50,
        pageSizes: [15, 20, 50, 100, 150, 200]
      },
      InsertGroupDialog: false,
      InsertGroupIdData: '',
      GroupID: '',
      EvaluationUserRoleCount: 0,
      clearfixHeight: 30,
      downloadValue: ''
    };
  },
  computed: {
    ...mapGetters(['device']),
    userName: {
      cache: false,
      get() {
        return this.value == ''
          ? this.listQuery.ReviewName
          : this.value === 1
            ? this.listQuery.ManageName
            : this.listQuery.VisitName;
      },
      set(val) {
        this.value == ''
          ? (this.listQuery.ReviewName = val)
          : this.value === 1
            ? (this.listQuery.ManageName = val)
            : (this.listQuery.VisitName = val);
      }
    }
  },
  created() {
    this.getIni();
    this.SelectEvaluationUser();
    window.roleName.forEach((item) => {
      this.roleNames.push(item.RoleName);
    });
    this.SelectEvaluationUserRoleCount();
  },
  mounted() {
    document.addEventListener('click', (e) => {
      if (!this.$el.contains(e.target)) {
        if (this.clearfixHeight >= 65) {
          this.clearfixHeight = 30;
        }
      }
    });
  },
  methods: {
    async SelectEvaluationUserRoleCount() {
      const { data } = await SelectEvaluationUserRoleCount({
        UserID: window.userInfo[0].UserID
      });
      this.EvaluationUserRoleCount = data;
    },
    async getIni() {
      const para = this.$store.getters.iniPara;
      this.menu_one = para.menu_one;
      this.menu_two = para.menu_two;
      this.menu_three = para.menu_three;
      this.menu = para.menu;
      this.role_one = para.menu_one.replace('审核', '负责人');
      this.role_two = para.menu_two.replace('审核', '负责人');
      this.role_three = para.menu_three.replace('审核', '负责人');
      this.options = [];
      if (this.menu_one != undefined) {
        this.options.push({
          value: 0,
          label: para.menu_one
        });
      }
      if (this.menu_two != undefined) {
        this.options.push({
          value: 1,
          label: para.menu_two
        });
      }
      if (this.menu_three != undefined) {
        this.options.push({
          value: 2,
          label: para.menu_three
        });
      }
    },
    showRoleNameButton(roleName) {
      return this.roleNames.includes(roleName);
    },
    changeUsername(v) {
      this.listQuery.ReviewName = '';
      this.listQuery.ManageName = '';
      this.listQuery.VisitName = '';
    },
    async handleDownload() {
      let total;
      if (!this.downloadValue) {
        total = this.pagination.total;
      } else {
        total = this.downloadValue;
      }
      this.downloadLoading = true;
      const listQuery = {
        pageSize: total,
        pageIndex: 1,
        CatalogName: this.listQuery.CatalogName,
        CatalogCode: this.listQuery.CatalogCode,
        UserID: window.userInfo[0].UserID,
        ReviewName: this.listQuery.ReviewName,
        ManageName: this.listQuery.ManageName,
        VisitName: this.listQuery.VisitName
      };
      try {
        const excel = await import('@/vendor/Export2Excel');
        const tHeader = [
          '评审标准',
          '评审内容',
          this.menu_one,
          this.menu_two,
          this.menu_three
        ];
        const filterVal = [
          'CatalogCode',
          'CatalogName',
          'ReviewName',
          'ManageName',
          'VisitName'
        ];
        const { data } = await SelectEvaluationUser(listQuery);
        const formData = this.formatJson(filterVal, data.DataList);
        excel.export_json_to_excel({
          header: tHeader,
          data: formData,
          filename: '文件名'
        });
        this.downloadLoading = false;
      } catch (error) {
        console.error(error);
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },
    async UpdatetEvaluationUser(e) {
      this.formData.CatalogID = this.CatalogIDs.join(',');
      if (
        e.target.innerText === '增量保存' &&
        this.deptUsers.filter(Boolean).length === 0
      ) {
        this.$notify({
          title: '警告',
          type: 'warning',
          message: '至少选择一位人员'
        });
        return;
      }
      if (this.deptUsers.length) {
        this.targetInnerText === this.menu_one
          ? (this.formData.Review = this.deptUsers.join(',') || 0)
          : this.targetInnerText === this.menu_two
            ? (this.formData.Manage = this.deptUsers.join(',') || 0)
            : (this.formData.Visit = this.deptUsers.join(',') || 0);
      } else {
        this.targetInnerText === this.menu_one
          ? (this.formData.Review = 0)
          : this.targetInnerText === this.menu_two
            ? (this.formData.Manage = 0)
            : (this.formData.Visit = 0);
      }
      try {
        e.target.innerText === '增量保存'
          ? await IncrementSave(this.formData)
          : await UpdatetEvaluationUser(this.formData);
        this.$message({
          type: 'success',
          message: '修改成功!'
        });
        this.formData.Review = '';
        this.formData.Manage = '';
        this.formData.Visit = '';
        this.listLoading = true;
        this.SelectEvaluationUser();
      } catch (error) {
      } finally {
        this.dialogVisible = false;
      }

      // this.$notify({
      //   title: '警告',
      //   type: 'warning',
      //   message: '至少选择一位人员'
      // })
    },
    closed() {
      this.$refs.userTree.setDeptorUser([]);
    },
    distributionFunction(e) {
      if (e !== '分配组别') {
        this.targetInnerText = e.target.innerText;
      }
      this.CatalogIDs = [];
      if (this.tableSelecteds.length && e != '分配组别') {
        const Review = [];
        const Manage = [];
        const Visit = [];
        /* 单选才传默认已选中的 */
        if (this.tableSelecteds.length === 1) {
          this.tableSelecteds.map((item) => {
            this.CatalogIDs.push(item.CatalogID);
            Review.push(item.Review);
            Manage.push(item.Manage);
            Visit.push(item.Visit);
          });
        } else {
          this.tableSelecteds.map((item) => {
            this.CatalogIDs.push(item.CatalogID);
          });
        }
        this.dialogVisible = true;
        this.$nextTick(() => {
          this.targetInnerText === this.menu_one
            ? this.$refs.userTree.setDeptorUser([...new Set(Review.join(',').split(','))])
            : this.targetInnerText === this.menu_two
              ? this.$refs.userTree.setDeptorUser([...new Set(Manage.join(',').split(','))])
              : this.$refs.userTree.setDeptorUser([...new Set(Visit.join(',').split(','))]);
        });
        return;
      } else if (e === '分配组别' && this.tableSelecteds.length) {
        this.tableSelecteds.map((item) => {
          this.CatalogIDs.push(item.CatalogID);
        });
        this.InsertGroupDialog = true;
        return;
      }
      this.$notify({
        title: '警告',
        type: 'warning',
        message: '至少选择一条评审标准进行分配'
      });
    },
    handleSelectionChange(value) {
      this.tableSelecteds = value;
    },
    getSelectDeptorUser(value) {
      this.deptUsers = value;
    },
    handleCurrentChange(index) {
      this.listLoading = true;
      this.listQuery.pageIndex = index;
      this.SelectEvaluationUser();
    },
    handleSizeChange(page) {
      this.listLoading = true;
      this.listQuery.pageSize = page;
      this.clickSelectEvaluationUser();
    },
    async SelectEvaluationUser() {
      try {
        const { data } = await SelectEvaluationUser(this.listQuery);
        this.tableData = data.DataList;
        this.pagination.total = data.Total;
      } catch (error) {
      } finally {
        this.listLoading = false;
      }
    },
    async clickSelectEvaluationUser() {
      this.listLoading = true;
      this.listQuery.pageIndex = 1;
      this.pagination.pageIndex = 1;
      this.SelectEvaluationUser();
    },
    async InsertGroupID() {
      try {
        const val = {
          CatalogID: this.CatalogIDs.join(','),
          GroupID: this.GroupID
        };
        const data = await InsertGroupID(val);
        if (data.code === 200) {
          this.$message.success('分配完成');
        } else {
          this.$message.error('分配失败');
        }
        this.InsertGroupDialog = false;
      } catch (error) {}
    },
    getDefaultDeptValues(value) {
      this.GroupID = value;
    },
    unfold() {
      if (this.clearfixHeight == 30) {
        this.$nextTick(() => {
          if (this.device == 'desktop') {
            this.clearfixHeight = 65;
          } else {
            this.clearfixHeight = 180;
          }
        });
      } else {
        this.clearfixHeight = 30;
      }
    }
  }
};
</script>
<style lang="scss">
.EvaluationUser {
  margin: 4px;
  .el-table__row td {
    vertical-align: top;
  }
  // .el-table .my-cell {
  // }
  .el-card__body {
    padding: 6px;
  }
  .el-card__header {
    padding: 2px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    .el-form-item {
      margin: 5px 0;
      margin-left: 10px;
    }
  }
}
</style>
