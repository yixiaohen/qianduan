<template>
  <div class="EvaluationUser">
    <el-card class="box-card">
      <div
        slot="header"
        ref="clearfix"

      >
        <div
          style="width: 100%;
          background-color:#f4f4f5;
          display: inline-block;
          height: 32px;
          line-height: 32px;"
        >
          <el-form
            label-position="right"
            :model="formData"
            :inline="true"
            size="mini"
            class="searchBox "
          >

            <el-form-item>
              <el-input
                v-model="listQuery.CatalogCode"
                placeholder="标准编号"
                style="width: 120px"
                size="mini"
                clearable
                @keyup.enter.native="clickSelectEvaluationUser()"
              />
            </el-form-item>
            <el-divider direction="vertical" />
            <el-form-item>
              <el-input
                v-model="listQuery.CatalogName"
                placeholder="评审标准内容"
                style="width: 120px"
                size="mini"
                clearable
                @keyup.enter.native="clickSelectEvaluationUser()"
              />
            </el-form-item>
            <el-divider direction="vertical" />
            <el-form-item>
              <el-select
                v-model="listQuery.Step"
                placeholder="请选择人员姓名"
                style="width: 130px"
                clearable
                @change="changeUsername"
                @keyup.enter.native="clickSelectEvaluationUser()"
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
              <el-select
                v-model="listQuery.Status"
                placeholder="条款是否已分配"
                style="width: 140px"
                clearable
                @keyup.enter.native="clickSelectEvaluationUser()"
              >
                <!--                  <el-option-->
                <!--                    label="是否分配"-->
                <!--                    value=""-->
                <!--                  />-->
                <el-option
                  label="已分配"
                  value="已分配"
                />
                <el-option
                  label="未分配"
                  value="未分配"
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
                @keyup.enter.native="clickSelectEvaluationUser()"
              />
            </el-form-item>
            <el-divider direction="vertical" />
            <el-form-item>
              <el-select
                v-model="GroupNameArr"
                placeholder="组别"
                style="width: 200px"
                size="mini"
                multiple
                clearable
                @change="selectGetGroupID"
              >
                <el-option
                  v-for="item in tableDataGroup"
                  :key="item.GroupID"
                  :label="item.GroupName"
                  :value="item.GroupID"
                />
              </el-select>
            </el-form-item>
            <el-divider direction="vertical" />
            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-search"
                :loading="listLoading"
                size="mini"
                @click="clickSelectEvaluationUser()"
              >搜索
              </el-button>
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
              >{{ menu_one }}
              </el-button>
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
              >{{ menu_two }}
              </el-button>
            </el-form-item>
            <el-form-item v-if="menu == false">
              <el-button
                v-if="EvaluationUserRoleCount == 3"
                :loading="listLoading"
                icon="el-icon-user-solid"
                size="mini"
                @click="distributionFunction"
              >{{ menu_three }}
              </el-button>
            </el-form-item>
            <el-form-item v-if="menu == true">
              <el-button
                v-if="EvaluationUserRoleCount == 3"
                :loading="listLoading"
                icon="el-icon-user-solid"
                size="mini"
                @click="distributionFunction"
              >{{ menu_one }}
              </el-button>
            </el-form-item>
            <el-form-item v-if="menu == true">
              <el-button
                v-if="EvaluationUserRoleCount == 3"
                :loading="listLoading"
                icon="el-icon-user-solid"
                size="mini"
                @click="distributionFunction"
              >{{ menu_two }}
              </el-button>
            </el-form-item>
            <el-form-item v-if="menu == true">
              <el-button
                v-if="EvaluationUserRoleCount == 3"
                :loading="listLoading"
                icon="el-icon-user-solid"
                size="mini"
                @click="distributionFunction"
              >{{ menu_three }}
              </el-button>
            </el-form-item>
            <el-divider direction="vertical" />
            <el-form-item>
              <el-button
                :loading="listLoading"
                :disabled="downloadLoading"
                type="success"
                icon="el-icon-document"
                size="mini"
                @click="distributionFunction('分配组别')"
              >分配组别
              </el-button>
            </el-form-item>
            <el-divider direction="vertical" />
            <el-form-item style="width: 150px">
              <el-select
                v-model="downloadValue"
                placeholder="请选择要导出数据"
              >
                <el-option
                  label="前一百条"
                  value="100"
                />
                <el-option
                  label="前三百条"
                  value="300"
                />
                <el-option
                  label="前五百条"
                  value="500"
                />
                <el-option
                  label="前一千条"
                  value="1000"
                />
                <el-option
                  label="全部"
                  :value="pagination.total"
                />
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
              >导出
              </el-button>
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

          </el-form>
        </div>
      </div>
      <div class="content">
        <el-table
          ref="multipleTable"
          v-loading="listLoading"
          :data="tableData"
          style="width: 100%"
          border
          stripe
          row-key="CatalogID"
          size="mini"
          tooltip-effect="light"
          height="calc(100vh - 260px)"
          highlight-current-row
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="40"
            align="center"
          />
          <el-table-column
            prop="CatalogCode"
            label="评审标准"
            width="69"
            :show-overflow-tooltip="cellOverflow"
          />
          <el-table-column
            prop="TypeName"
            label="章节"
            width="120"
            :show-overflow-tooltip="cellOverflow"
          />
          <!--              宁海妇幼保健院不需要核心条款-->
          <el-table-column
            v-if="CatalogVersion !== '宁海妇幼保健院'"
            prop="IsPoint"
            label="核心条款"
            width="69"
            align="center"
            :show-overflow-tooltip="cellOverflow"
          >
            <template slot-scope="{ row }">
              <el-tag
                size="mini"
                :type="row.IsPoint === 0 ? 'danger' : 'success'"
              >{{ row.IsPoint === 0 ? '否' : '是' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="CatalogName"
            label="标准内容"
            :show-overflow-tooltip="cellOverflow"
          >
            <template slot-scope="{ row }">
              <div v-html="row.CatalogName" />
            </template>
          </el-table-column>
          <el-table-column
            v-if="menu_one != undefined"
            prop="ReviewName"
            :label="menu_one"
            :show-overflow-tooltip="cellOverflow"
          >
            <template slot-scope="{ row }">
              <el-popover placement="top-start" :title="menu_one" width="90%" trigger="hover">
                <div>{{ row.ReviewName }}</div>
                <span slot="reference">{{ row.ReviewName }}</span>
              </el-popover>
            </template>

          </el-table-column>
          <el-table-column
            v-if="menu_two != undefined"
            prop="ManageName"
            :label="menu_two"
            :show-overflow-tooltip="cellOverflow"
          >
            <template slot-scope="{ row }">
              <el-popover placement="top-start" :title="menu_two" width="90%" trigger="hover">
                <div>{{ row.ManageName }}</div>
                <span slot="reference">{{ row.ManageName }}</span>
              </el-popover>
            </template>

          </el-table-column>
          <el-table-column
            v-if="menu_three != undefined"
            prop="VisitName"
            :label="menu_three"
            :show-overflow-tooltip="cellOverflow"
          >
            <template slot-scope="{ row }">
              <el-popover placement="top-start" :title="menu_three" width="90%" trigger="hover">
                <div>{{ row.VisitName }}</div>
                <span slot="reference">{{ row.VisitName }}</span>
              </el-popover>
            </template>

          </el-table-column>
          <el-table-column
            prop="GroupName"
            label="组别"
            width="100"
            :show-overflow-tooltip="cellOverflow"
          />
        </el-table>
        <el-row>
          <el-col :span="3">
            <el-switch
              v-model="cellOverflow"
              style="margin: 26px 0px"
              active-text="收起"
              inactive-text="展开"
            />
          </el-col>
          <el-col :span="20">
            <el-pagination
              background
              style="margin: 26px 0 0 0"
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
        <el-dialog
          :close-on-click-modal="false"
          title="人员选择"
          :visible.sync="dialogVisible"
          :width="device === 'desktop' ? '40%' : '90%'"
          @closed="closed"
        >
          <el-container>
            <el-main style="padding: 0px">
              <select-deptor-user
                ref="userTree"
                @getSelectDeptorUser="getSelectDeptorUser"
              />
            </el-main>
            <el-footer
              style="
                display: flex;
                justify-content: space-between;
                padding: 0px;
              "
            >
              <el-checkbox v-model="formData.IsDistribution">用户添加对应角色</el-checkbox>
              <el-tag>已勾选：<span style="color: #4a9de7">{{ manNum }}</span> /2000</el-tag>
              <div>
                <el-button
                  type="primary"
                  size="mini"
                  @click="UpdatetEvaluationUser"
                >增量保存
                </el-button>
                <el-button
                  v-show="isCover"
                  type="info"
                  size="mini"
                  @click="UpdatetEvaluationUser"
                >覆盖保存
                </el-button>
                <el-button
                  size="mini"
                  @click="dialogVisible = false"
                >取 消
                </el-button>
              </div>
            </el-footer>
          </el-container>
        </el-dialog>
        <el-dialog
          :close-on-click-modal="false"
          title="分配组别"
          :visible.sync="InsertGroupDialog"
          :width="device === 'desktop' ? '30%' : '90%'"
          @closed="InsertGroupDialog = false"
        >
          <el-select
            v-model="value"
            clearable
            placeholder="请选择"
            size="small"
            @change="getGroupID"
          >
            <el-option
              v-for="item in tableDataGroup"
              :key="item.GroupID"
              :label="item.GroupName"
              :value="item.GroupID"
            />
          </el-select>
          <div
            slot="footer"
            class="dialog-footer"
          >
            <el-button
              size="mini"
              @click="InsertGroupDialog = false"
            >取 消
            </el-button>
            <el-button
              type="primary"
              size="mini"
              @click="InsertGroupID"
            >确 定
            </el-button>
          </div>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>
<script>
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
import { SelectDeptsByName, SelectGroup } from '@/api/user';

export default {
  name: 'EvaluationUser',
  components: { SelectDeptorUser },
  mixins: [tableHeight],
  data() {
    return {
      megSave: '', // 增量保存和覆盖保存操作时的提示语
      CatalogVersion: window.CatalogVersion,
      manNum: 0,
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
        Visit: '',
        IsDistribution: false,
        UserID: window.userInfo[0].UserID
      },
      listQuery: {
        pageSize: 50,
        pageIndex: 1,
        CatalogName: '',
        CatalogCode: '',
        UserID: window.userInfo[0].UserID,
        ReviewName: '',
        ManageName: '',
        VisitName: '',
        Status: '',
        Step: '',
        GroupID: ''
      },
      GroupNameArr: [],
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
      clearfixHeight: 35,
      downloadValue: '',
      cellOverflow: true,
      tableDataGroup: [],
      isCover: true
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
    window.roleName.forEach(item => {
      this.roleNames.push(item.RoleName);
    });
    this.SelectEvaluationUserRoleCount();
    this.SelectGroup();
    this.SelectDeptsByName();
  },
  mounted() {
    document.addEventListener('click', e => {
      if (!this.$el.contains(e.target)) {
        if (this.clearfixHeight >= 65) {
          this.clearfixHeight = 28;
        }
      }
    });
  },
  methods: {
    async SelectDeptsByName() {
      const { data } = await SelectDeptsByName({ DeptName: '' });
      if (data[0].DeptName === '浙江省肿瘤医院' && window.userInfo[0].RoleCode !== 'R0001'
      ) {
        this.isCover = false;
      } else {
        this.isCover = true;
      }
    },
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
          value: 1,
          label: para.menu_one
        });
      }
      if (this.menu_two != undefined) {
        this.options.push({
          value: 2,
          label: para.menu_two
        });
      }
      if (this.menu_three != undefined) {
        this.options.push({
          value: 3,
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
        VisitName: this.listQuery.VisitName,
        IsExport: '是'
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
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    // 增量保存和覆盖保存
    async UpdatetEvaluationUser(e) {
      if (e.target.innerText === '增量保存') {
        this.megSave = '确认增量保存？将在原人员名单上增加新勾选的人员，即使您取消了原有人员的勾选项，也只会增加新勾选的人员，是否继续？';
      }
      if (e.target.innerText === '覆盖保存') {
        this.megSave = '确认覆盖保存？将保存当前已勾选的人员，如果一个人员也不勾选将会清除原来已分配的人员，是否继续？';
      }
      this.$confirm(this.megSave, '重要提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
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
        // 增量保存不能同时选超过2000人
        if (
          e.target.innerText === '增量保存' &&
          this.deptUsers.filter(Boolean).length >= 2000
        ) {
          this.$notify({
            title: '警告',
            type: 'warning',
            message: '已分配人数和正在选的人数一共不能超过2000人'
          });
          return;
        }

        // 覆盖保存不能同时选超过2000人
        if (
          e.target.innerText === '覆盖保存' &&
          this.deptUsers.filter(Boolean).length >= 2000
        ) {
          this.$notify({
            title: '警告',
            type: 'warning',
            message: '覆盖保存不能同时选超过2000人'
          });
          return;
        }
        if (this.deptUsers.length) {
          this.targetInnerText === this.menu_one
            ? (this.formData.Review = this.deptUsers.join(',') || '')
            : this.targetInnerText === this.menu_two
              ? (this.formData.Manage = this.deptUsers.join(',') || '')
              : (this.formData.Visit = this.deptUsers.join(',') || '');
        } else {
          this.targetInnerText === this.menu_one
            ? (this.formData.Review = 0)
            : this.targetInnerText === this.menu_two
              ? (this.formData.Manage = 0)
              : (this.formData.Visit = 0);
        }
        e.target.innerText === '增量保存'
          ? await IncrementSave(this.formData)
          : await UpdatetEvaluationUser(this.formData);
        this.$message.success('修改成功!');
        this.formData.Review = '';
        this.formData.Manage = '';
        this.formData.Visit = '';
        this.formData.IsDistribution = false;
        this.listLoading = true;
        this.SelectEvaluationUser();
        this.dialogVisible = false;
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
    },
    closed() {
      this.$nextTick(() => {
        this.$refs.userTree.setDeptorUser([]);
      });
    },
    distributionFunction(e) {
      this.manNum = this.deptUsers.filter(Boolean).length;
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
          this.tableSelecteds.map(item => {
            this.CatalogIDs.push(item.CatalogID);
            Review.push(item.Review);
            Manage.push(item.Manage);
            Visit.push(item.Visit);
          });
        } else {
          this.tableSelecteds.map(item => {
            this.CatalogIDs.push(item.CatalogID);
          });
        }
        this.dialogVisible = true;
        this.$nextTick(() => {
          this.targetInnerText === this.menu_one
            ? this.$refs.userTree.setDeptorUser([
              ...new Set(Review.join(',').split(','))
            ])
            : this.targetInnerText === this.menu_two
              ? this.$refs.userTree.setDeptorUser([
                ...new Set(Manage.join(',').split(','))
              ])
              : this.$refs.userTree.setDeptorUser([
                ...new Set(Visit.join(',').split(','))
              ]);
        });
        return;
      } else if (e === '分配组别' && this.tableSelecteds.length) {
        this.tableSelecteds.map(item => {
          this.CatalogIDs.push(item.CatalogID);
        });
        this.tableSelecteds.length === 1
          ? (this.value = this.tableSelecteds[0].GroupID)
          : (this.value = '');
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
      this.deptUsers = this.deleteNaN(value) || 0;
      this.manNum = this.deptUsers.length; // 已勾选人数
    },
    deleteNaN(arr) {
      var res = [];
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] === arr[i]) {
          res.push(arr[i]);
        }
      }
      return res;
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
        this.listQuery.Step =
          this.listQuery.Step == '' ? 0 : this.listQuery.Step;
        this.listQuery.Status =
          this.listQuery.Status == '全部' ? '' : this.listQuery.Status;
        const { data } = await SelectEvaluationUser(this.listQuery);
        this.tableData = data.DataList;
        console.log(this.tableData);

        this.pagination.total = data.Total;
        this.listQuery.Step =
          this.listQuery.Step === 0 ? '' : this.listQuery.Step;
      } catch (error) {
        console.log(error);
      }
      this.listLoading = false;
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
        const { code } = await InsertGroupID(val);
        code === 200
          ? this.$message.success('分配完成')
          : this.$message.error('分配失败');
        this.SelectEvaluationUser();
        this.InsertGroupDialog = false;
      } catch (error) {
      }
    },
    getGroupID(value) {
      this.GroupID = value;
    },
    unfold() {
      if (this.clearfixHeight == 28) {
        this.$nextTick(() => {
          if (this.device == 'desktop') {
            this.clearfixHeight = 65;
          } else {
            this.clearfixHeight = 180;
          }
        });
      } else {
        this.clearfixHeight = 28;
      }
    },
    async SelectGroup() {
      /* 查询组别 */
      try {
        const { data } = await SelectGroup({
          GroupName: ''
        });
        this.tableDataGroup = data;
      } catch (error) {
        console.log(error);
      }
    },
    async selectGetGroupID(val) {
      this.listQuery.GroupID = val.toString();
      this.clickSelectEvaluationUser();
    }
  }
};
</script>
<style lang="scss">
// 头部搜索栏
//.searchBox{
//  .el-row{
//    margin-top: 5px;
//    .el-col{
//      // 实现文字溢出隐藏加省略号
//      overflow: hidden;
//      text-overflow: ellipsis;
//      white-space: nowrap
//    }
//  }


//}
//.content{
//  margin-top: 24px;
//}
.box-card{
  width: 98%;
  margin: 10px;

}
.EvaluationUser {
  margin-top: 4px;

  .el-table__row td {
    vertical-align: top;
  }

  .el-card__body {
    padding: 5px;
  }

  .el-card__header {
    padding: 2px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;

    .el-form-item {
      margin: 0;
      margin-right: 5px;
    }
  }

  .el-loading-spinner {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    -webkit-animation: typing 1s linear infinite alternate;
    -moz-animation: Typing 1s linear infinite alternate;
    animation: typing 1s linear infinite alternate;
    margin: 0px auto; /* Not necessary- its only for layouting*/
    position: relative;
    left: -40px;
  }

  @-webkit-keyframes typing {
    0% {
      background-color: rgba(247, 111, 73, 1);
      box-shadow: 40px 0px 0px 0px rgba(247, 111, 73, 0.2),
      80px 0px 0px 0px rgba(247, 111, 73, 0.2);
    }
    25% {
      background-color: rgba(247, 111, 73, 0.4);
      box-shadow: 40px 0px 0px 0px rgba(247, 111, 73, 2),
      80px 0px 0px 0px rgba(247, 111, 73, 0.2);
    }
    75% {
      background-color: rgba(247, 111, 73, 0.4);
      box-shadow: 40px 0px 0px 0px rgba(247, 111, 73, 0.2),
      80px 0px 0px 0px rgba(247, 111, 73, 1);
    }
  }

  @-moz-keyframes typing {
    0% {
      background-color: rgba(247, 111, 73, 1);
      box-shadow: 40px 0px 0px 0px rgba(247, 111, 73, 0.2),
      80px 0px 0px 0px rgba(247, 111, 73, 0.2);
    }
    25% {
      background-color: rgba(247, 111, 73, 0.4);
      box-shadow: 40px 0px 0px 0px rgba(247, 111, 73, 2),
      80px 0px 0px 0px rgba(247, 111, 73, 0.2);
    }
    75% {
      background-color: rgba(247, 111, 73, 0.4);
      box-shadow: 40px 0px 0px 0px rgba(247, 111, 73, 0.2),
      80px 0px 0px 0px rgba(247, 111, 73, 1);
    }
  }
  @keyframes typing {
    0% {
      background-color: rgba(247, 111, 73, 1);
      box-shadow: 40px 0px 0px 0px rgba(247, 111, 73, 0.2),
      80px 0px 0px 0px rgba(247, 111, 73, 0.2);
    }
    25% {
      background-color: rgba(247, 111, 73, 0.4);
      box-shadow: 40px 0px 0px 0px rgba(247, 111, 73, 2),
      80px 0px 0px 0px rgba(247, 111, 73, 0.2);
    }
    75% {
      background-color: rgba(0, 184, 220, 0.4);
      box-shadow: 40px 0px 0px 0px rgba(249, 54, 0, 0.2),
      80px 0px 0px 0px rgb(2, 243, 130);
    }
  }

  .el-loading-spinner .circular {
    display: none; //隐藏之前element-ui默认的loading动画
  }
}
</style>
