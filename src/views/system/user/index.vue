<template>
  <el-container class="user">
    <el-header>
      <el-form :label-position="labelPosition" :inline="true" size="mini" style="margin-top: 6px">
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-circle-plus"
            size="mini"
            @click="addRow"
          >增加
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="mini"
            @click="Group"
          >组别管理
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="listQuery.UserName"
            placeholder="姓名"
            style="width: 120px"
            size="mini"
            clearable
            @keyup.enter.native="clickSelectUser()"
          />
        </el-form-item>
        <el-form-item>
          <div   style="margin-top: 0px;margin-bottom: 5px">

            <!-- 科室 -->
            <defaultDept
              :multiple="true"
              @getDefaultDeptsValue="getDefaultDeptValues"
            />
          </div>

        </el-form-item>
        <el-form-item>
          <!-- 职位 -->
          <position @getPositionValue="getPositionValues"/>
        </el-form-item>
        <el-form-item>
          <!-- 职称 -->
          <job @getJobValue="getJobValues"/>
        </el-form-item>
        <el-form-item>
          <!-- 角色 -->
          <el-select v-model="listQuery.RoleID" placeholder="请选择角色">
            <el-option
              v-for="item in roleTableData"
              :key="item.value"
              :label="item.RoleName"
              :value="item.RoleID"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="listLoading"
            type="info"
            icon="el-icon-search"
            size="mini"
            @click="clickSelectUser"
          >搜索
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="downloadLoading"
            type="success"
            icon="el-icon-document"
            size="mini"
            :disabled="listLoading"
            @click="handleDownload"
          >人员信息导出
          </el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main>
      <el-table
        v-loading="listLoading"
        :data="tableData"
        style="width: 100%;margin-top: 10px"
        height="calc(100vh - 180px)"
        border
        size="mini"
      >
        <el-table-column type="index" label="序号" width="60" align="center"/>
        <el-table-column
          prop="UserName"
          label="用户名"
          width="100"
          align="center"
          :show-overflow-tooltip="cellOverflow"
        />
        <el-table-column
          prop="Phone"
          label="联系电话"
          width="100"
          align="center"
          :show-overflow-tooltip="cellOverflow"
        />
        <el-table-column
          prop="UserCode"
          label="账号"
          width="100"
          :show-overflow-tooltip="cellOverflow"
        />
        <el-table-column
          prop="DeptName"
          label="科室"
          width="120"
          :show-overflow-tooltip="cellOverflow"
        />
        <el-table-column
          prop="RoleName"
          label="角色"
          :show-overflow-tooltip="cellOverflow"
        />
        <el-table-column
          prop="PositionName"
          label="职位"
          width="120"
          :show-overflow-tooltip="cellOverflow"
        />
        <el-table-column
          prop="JobName"
          label="职称"
          width="120"
          :show-overflow-tooltip="cellOverflow"
        />
        <el-table-column
          prop="GroupName"
          label="组别"
          width="120"
          :show-overflow-tooltip="cellOverflow"
        />
        <el-table-column label="操作" fixed="right" align="center" width="160">
          <template slot-scope="scope">
            <el-button
              size="mini"
              icon="el-icon-edit"
              @click.native.prevent="editRow(scope.row)"
            />
            <el-button
              v-if="editUserName == '系统管理员'"
              type="info"
              size="mini"
              icon="el-icon-key"
              @click.native.prevent="editPass(scope.row)"
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
      <el-dialog
        :title="dialogTitle"
        :width="device === 'desktop' ? '40%' : '90%'"
        :close-on-click-modal="false"
        :visible.sync="dialogFormVisible"
        @close="cancel()"
        @opened="opened"
      >
        <el-form
          ref="fromDataUser"
          :rules="rules"
          size="mini"
          :model="fromData"
          label-width="80px"
        >
          <el-tabs v-model="activeName">

            <el-tab-pane label="用户管理" name="first">
              <el-form-item label="用户名" prop="UserName">
                <el-input v-model="fromData.UserName"/>
              </el-form-item>
              <el-form-item label="用户账号" prop="UserCode">
                <el-input v-model="fromData.UserCode"/>
              </el-form-item>
              <el-form-item v-if="dialogTitle === '增加用户'" label="初始密码">
                <el-input
                  v-model="fromData.UserPwd"
                  placeholder="密码中必须包含字母、数字、特殊字符"
                  :disabled="true"
                />
              </el-form-item>
              <el-form-item label="分配角色" prop="RoleID">
                <!-- <role
                :multiple="true"
                :w="'100%'"
                :value="fromData.RoleID"
                @getRoleValue="getRoleValue"
              /> -->
                <el-select
                  v-model="fromData.RoleID"
                  placeholder="角色"
                  :multiple="true"
                  collapse-tags
                  size="mini"
                  clearable
                  :style="{ width: '100%' }"
                  @change="getRoleValue"
                >
                  <el-option
                    v-for="item in roleOptions"
                    :key="item.RoleID"
                    :label="item.RoleName"
                    :value="item.RoleID"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="职位" prop="PositionID">
                <el-select
                  v-model="fromData.PositionID"
                  placeholder="职位"
                  size="mini"
                  filterable
                  clearable
                  style="width: 120px"
                  @change="getPositionValue"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.PositionID"
                    :label="item.PositionName"
                    :value="item.PositionID"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="职称" prop="JobID">
                <job :value="fromData.JobID" @getJobValue="getJobValue"/>
              </el-form-item>
              <el-form-item label="组别" prop="GroupID">
                <el-select
                  v-model="fromData.GroupID"
                  clearable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in tableDataGroup"
                    :key="item.GroupID"
                    :label="item.GroupName"
                    :value="item.GroupID"
                  />
                </el-select>
              </el-form-item>
              <el-form-item prop="Phone" label="联系方式">
                <el-input
                  v-model="fromData.Phone"
                  placeholder="请输入联系人电话"
                  oninput="value=value.replace(/[^0-9.]/g,'')"
                />
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="分配科室" name="second">
              <el-form-item label-width="0">
                <div class="Dept">
                  <el-tree
                    ref="treeDepts"
                    :data="DeptsData"
                    :props="{
                      value: 'DeptID',
                      label: 'DeptName',
                      children: 'Children',
                      multiple: true,
                    }"
                    show-checkbox
                    node-key="DeptID"
                    :check-strictly="true"
                    @check="getSelectTreeDept"
                  />
                </div>
              </el-form-item>
            </el-tab-pane>

            <el-tab-pane label="自评资料可见范围" name="third">
              <el-form-item label-width="0">
                <div class="Dept">
                  <select-deptor-user
                    ref="userTree"
                    :value="`自评资料可见范围`"
                    @getSelectDeptorUser="getSelectDeptorUser"
                  />
                </div>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="季度表单可见范围" name="five">
              <!--              <el-tooltip-->
              <!--                class="item"-->
              <!--                effect="light"-->
              <!--                content="  温馨提示:默认为空只能看到该用户以及对应科室的创建季度表单。如果要使当前账号可以看到其他科室的季度表单,-->
              <!--                  请在勾选相关科室，一旦勾选了相关科室，必须勾选本账号人员所在的科室，不然会看不到该用户以及对应科室创建的季度表单！"-->
              <!--                placement="top"-->
              <!--              >-->
              <!--                <icon class="el-icon-s-opportunity" style="color:red" >点击查看说明</icon>-->
              <!--              </el-tooltip>-->
              <el-form-item label-width="0">
                <div class="Dept">
                  <el-tree
                    ref="treeDepts2"
                    :data="DeptsData"
                    :props="{
                      value: 'DeptID',
                      label: 'DeptName',
                      children: 'Children',
                    }"
                    show-checkbox
                    node-key="DeptID"
                    :check-strictly="true"
                    @check="getSelectTreeDept2"
                  />
                </div>
                <div
                  style="max-width:100%;
                  width: fit-content;
                  width: -webkit-fit-content;
                  width: -moz-fit-content;
                  word-wrap: break-word;
                  background-color: #eeeeee;
                  font-size: 12px;
                  color: #8a8f97"
                >
                  温馨提示:默认为空只能看到该用户以及对应科室创建的季度表单。如果要使该用户可以看到其他科室的季度表单
                  请在勾选相关科室，一旦勾选了相关科室，必须勾选该用户所在的科室，否则看不到该用户以及对应科室创建的季度表单！
                </div>
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="cancel()">取 消</el-button>
          <el-button
            size="small"
            type="primary"
            @click="dialogTitle === '增加用户' ? InsertUser() : UpdateUser()"
          >提交
          </el-button>
        </div>
      </el-dialog>
      <el-dialog
        title="修改密码"
        :close-on-click-modal="false"
        :visible.sync="editPassDialog"
        height="60vh"
        :width="device === 'desktop' ? '30%' : '90%'"
        @close="editPassDialog = false"
      >
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          status-icon
          :rules="rules"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="密码" prop="pass">
            <el-input
              v-model="ruleForm.pass"
              size="small"
              type="password"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input
              v-model="ruleForm.checkPass"
              size="small"
              type="password"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="small"
              @click="submitForm('ruleForm')"
            >提交
            </el-button>
            <el-button
              size="small"
              @click="resetForm('ruleForm')"
            >重置
            </el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 组别管理 -->
      <el-dialog
        :width="device === 'desktop' ? '60%' : '90%'"
        title="组别管理"
        :close-on-click-modal="false"
        destroy-on-close
        :visible.sync="dialogGroup"
        @closed="!dialogGroup"
        @resize="handleResize"
      >
        <el-form :inline="true" size="mini">
          <el-form-item>
            <el-input
              v-model="selectGroup.GroupName"
              placeholder="组别名称"
              size="mini"
              clearable
              @keyup.enter.native="SelectGroup()"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="SelectGroup()"
            >搜索
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="mini"
              @click="insetGroupData()"
            >新增
            </el-button>
          </el-form-item>
        </el-form>
        <el-table
          v-loading="GroupLoading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          :data="tableDataGroup"
          style="width: 100%"
          border
          size="mini"
          height="60vh"
        >
          <el-table-column
            type="index"
            label="序号"
            width="50"
            align="center"
            fixed="left"
          />
          <el-table-column
            prop="GroupName"
            label="组别名称"
            align="left"
            class="tableType"
          >
            <template slot-scope="{ row, $index }">
              <el-input
                v-if="currentEdit === $index"
                v-model="row.GroupName"
                placeholder="组别名称"
                size="small"
                clearable
              />
              <span v-else>{{ row.GroupName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button
                v-if="currentEdit === scope.$index"
                type="text"
                size="small"
                @click="finishEditClick(scope)"
              >完成
              </el-button>
              <el-button
                v-else
                type="text"
                size="small"
                @click="EditClick(scope)"
              >修改
              </el-button>
              <el-button
                v-if="currentEdit === scope.$index"
                type="text"
                size="small"
                @click="currentEdit = -1"
              >放弃
              </el-button>
              <el-popconfirm
                v-else
                confirm-button-text="是"
                cancel-button-text="否"
                icon="el-icon-info"
                icon-color="red"
                title="这是一段内容确定删除吗？"
                @confirm="DeleteGroup(scope)"
              >
                <el-button
                  slot="reference"
                  type="text"
                  size="small"
                >删除
                </el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="dialogGroup = false">关闭</el-button>
        </span>
      </el-dialog>
    </el-main>
    <el-footer>
      <el-row>
        <el-col :span="1">
          <el-switch v-model="cellOverflow" style="margin: 6px 0px"/>
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
    </el-footer>
  </el-container>
</template>
<script>
import position from '@/views/components/position';
import { SelectPosition } from '@/api/position';
import job from '@/views/components/job';
import defaultDept from '@/views/components/defaultDept';
import SelectDeptorUser from '@/views/components/SelectDeptorUser';
import SelectDeptorUser2 from '@/views/components/SelectDeptorUser2';
import {
  DeleteGroup,
  DeleteUser,
  InsertGroup,
  InsertUser,
  SelectDepts,
  SelectGroup,
  SelectRole,
  SelectUser,
  UpdateGroup,
  UpdatePwd,
  UpdateUser
} from '@/api/user';
import tableHeight from '@/views/mixin/tableHeight';
import { mapGetters } from 'vuex';

export default {
  name: 'User',
  components: { position, job, defaultDept, SelectDeptorUser, SelectDeptorUser2 },
  mixins: [tableHeight],
  data() {
    var validatePass = (rule, value, callback) => {
      const pwdRegex = new RegExp(
        '(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,30}'
      );
      if (!pwdRegex.test(value)) {
        callback(
          new Error('您的密码复杂度过低!(密码中必须包含字母、数字、特殊字符)')
        );
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    var validatePass3 = (rule, value, callback) => {
      const pwdRegex = new RegExp(
        '(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,30}'
      );
      if (!pwdRegex.test(value)) {
        this.$message.error(
          '您的密码复杂度过低!(密码中必须包含字母、数字、特殊字符)'
        );
        callback(new Error());
      } else {
        callback();
      }
    };
    return {
      title: '人员信息导入',
      dialogTitle: '',
      labelPosition: 'right',
      listLoading: true,
      dialogFormVisible: false,
      downloadLoading: false,
      activeName: 'first',
      tableData: [],
      defaultchecked: '',
      role_value: 0,
      roleOptions: [],
      DeptsData: [],
      TreeDepts: [],
      defaultProps: null,
      selectOrg: {
        orgsid: []
      },
      pagination: {
        pageIndex: 1,
        total: 0,
        pageSize: 20,
        pageSizes: [15, 20, 50, 100, 150, 200]
      },
      rowObject: {},
      disabled: false,
      listQuery: {
        pageIndex: 1,
        pageSize: 20,
        UserName: '',
        JobID: 0,
        PositionID: 0,
        DeptID: 0,
        RoleID:0
      },
      fromData: {
        UserName: '',
        JobID: 1,
        PositionID: 1,
        UserCode: '',
        UserPwd: '',
        DeptID: [],
        PositionName: '',
        JobName: '',
        RoleID: [],
        Phone: '',
        GroupID: '',
        ReviewUserID: '',
        DeptIDs: []
      },
      RoleID: [],
      ruleForm: {
        pass: '',
        checkPass: ''
      },

      editPassDialog: false,
      editUserID: '',
      editUserName: window.userInfo[0].UserName,
      roleTableData: [],
      rules: {
        UserName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        UserCode: [
          { required: true, message: '请输入用户账号', trigger: 'blur' }
        ],
        UserPwd: [{ validator: validatePass3, trigger: 'blur' }],
        pass: [{ validator: validatePass, trigger: 'blur' }],
        checkPass: [{ validator: validatePass2, trigger: 'blur' }],
        other: []
        // Phone: [{ required: true, trigger: "blur", validator: validPhone }],
      },
      dialogGroup: false,
      tableDataGroup: [],
      selectGroup: {
        GroupName: ''
      },
      GroupLoading: false,
      currentEdit: -1,
      cellOverflow: false,
      options: []
    };
  },
  computed: {
    ...mapGetters(['device'])
  },
  created() {
    this.SelectUser();
    this.SelectTreeDept();
    this.roleSetData();
  },
  methods: {
    editPass(row) {
      this.ruleForm.pass = '';
      this.ruleForm.checkPass = '';
      this.editUserID = row.UserID;
      this.editPassDialog = true;
    },
    async submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const form = {
            UserID: this.editUserID,
            UserPwd: this.ruleForm.checkPass
          };
          UpdatePwd(form).then(data => {
            if (data.code == 200) {
              this.$message.success('密码修改' + data.msg);
              this.editPassDialog = false;
              return;
            }
            this.$message.error(data.msg);
          });
        } else {
          this.$message.error('请您输入正确的密码!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    async handleDownload() {
      this.downloadLoading = true;
      const listQuery = {
        pageIndex: 1,
        pageSize: this.pagination.total,
        UserName: '',
        JobID: 0,
        PositionID: 0,
        DeptID: 0
      };
      try {
        const excel = await import('@/vendor/Export2Excel');
        const tHeader = [
          '序号',
          '用户名',
          '账号',
          '科室',
          '角色',
          '职位',
          '职称'
        ];
        const filterVal = [
          'UserID',
          'UserName',
          'UserCode',
          'DeptName',
          'RoleName',
          'JobName',
          'PositionName'
        ];
        const { data } = await SelectUser(listQuery);
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
    deleteRow(row) {
      this.$confirm(`此操作将永久删除 ${row.UserName} , 是否继续?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          try {
            const { msg } = await DeleteUser({ UserID: row.UserID });
            this.$message({
              type: 'success',
              message: msg
            });
          } catch {
          }
          this.SelectUser();
        })
        .catch(e => e);
    },
    UpdateUser() {
      this.$refs.fromDataUser.validate(async v => {
        if (v) {
          const formData = {
            UserCode: this.fromData.UserCode,
            UserName: this.fromData.UserName,
            UserID: this.fromData.UserID,
            JobID: this.fromData.JobID,
            PositionID: this.fromData.PositionID,
            DeptID: this.fromData.DeptID || [],
            RoleID:
              this.fromData.RoleID || this.fromData.RoleID.length > 0
                ? this.fromData.RoleID
                : this.RoleID,
            Type: 0,
            Phone: this.fromData.Phone,
            GroupID: this.fromData.GroupID || 0,
            ReviewUserID: this.fromData.ReviewUserID || '',
            DeptIDs: this.fromData.DeptIDs.toString() || null
          };
          try {
            const { msg } = await UpdateUser(formData);
            this.$message.success(msg);
          } catch {
          }
          this.dialogFormVisible = false;
          this.SelectUser();
        } else {
          return false;
        }
      });
    },
    cancel() {
      this.fromData = this.dialogTitle === '修改用户' ? this.rowObject : {};
      this.defaultchecked = '';
      this.fromData = {
        UserName: '',
        JobID: 1,
        PositionID: 1,
        UserCode: '',
        UserPwd: '',
        DeptID: [],
        PositionName: '',
        JobName: '',
        RoleID: [],
        UserID: window.userInfo[0].UserID,
        GroupID: '',
        ReviewUserID: '',
        DeptIDs: []
      };
      this.resetChecked();
      this.dialogFormVisible = false;
    },
    opened() { // 打开编辑框的时候，将分配科室和季度表单可见范围，先前已经勾选的勾上
      this.resetChecked();
      if (this.dialogTitle === '修改用户' && this.rowObject.DeptID) {
        this.$refs.treeDepts.setCheckedKeys(this.fromData.DeptID);
        this.$refs.treeDepts2.setCheckedKeys(this.fromData.DeptIDs);
      }

      this.SelectRole();
      // this.getSelectTreeDept()
    },
    editRow(row) {
      this.SelectPosition();
      this.selectOrg.orgsid = [];
      this.dialogTitle = '修改用户';
      row = JSON.parse(JSON.stringify(row));
      this.fromData = row;
      this.defaultchecked = row.DeptID;
      this.fromData.RoleID = row.RoleID
        ? row.RoleID.split(',').map(item => parseInt(item))
        : [];
      this.fromData.RoleID = [...new Set(this.fromData.RoleID)];
      this.fromData.DeptID = row.DeptID
        ? row.DeptID.split(',').map(item => parseInt(item))
        : [];
      this.fromData.DeptIDs = row.DeptIDs
        ? row.DeptIDs.split(',').map(item => parseInt(item))
        : [];
      this.fromData.DeptID = [...new Set(this.fromData.DeptID)];
      this.fromData.DeptIDs = [...new Set(this.fromData.DeptIDs)];
      this.fromData.GroupID = row.GroupID;
      this.selectOrg.orgsid.push(row.DeptID);
      this.rowObject = row;
      this.SelectGroup();
      this.$nextTick(() => {
        const userID = this.fromData.ReviewUserID
          ? this.fromData.ReviewUserID.split(',').map(Number)
          : [];
        this.$refs.userTree.setDeptorUser([]);
        this.$refs.userTree.setDeptorUser(userID);
      });

      this.activeName = 'first';
      this.dialogFormVisible = true;
    },
    // handleClick(targetName, action) {
    //   if (targetName.paneName === 'five') {
    //     this.$nextTick(() => {
    //       const userID2 = this.fromData.DeptIDs
    //         ? this.fromData.DeptIDs.split(',').map(Number)
    //         : [];
    //       this.$refs.userTree2.setDeptorUser([]);
    //       this.$refs.userTree2.setDeptorUser(userID2);
    //     });
    //
    //     console.log('已执行');
    //   }
    // },
    InsertUser() {
      this.$refs.fromDataUser.validate(v => {
        if (v) {
          const data = {
            UserID: this.fromData.UserID,
            DeptID: this.fromData.DeptID
          };
          this.fromData.DeptIDs = this.fromData.DeptIDs.toString() || null;
          this.fromData.RoleID = this.RoleID || [];
          this.fromData.GroupID = this.fromData.GroupID || 0;
          try {
            InsertUser(this.fromData)
              .then(res => {
                if (res.code == 200) {
                  this.$message.success('新增成功');
                }
              })
              .catch(err => {
              });
          } catch {
          }
          this.SelectUser();
        } else {
          return false;
        }
        this.dialogFormVisible = false;
      });
    },
    addRow(row) {
      this.fromData = {
        UserName: '',
        JobID: 1,
        PositionID: 1,
        UserCode: '',
        UserPwd: '12345678',
        DeptID: [],
        PositionName: '',
        JobName: '',
        RoleID: [],
        UserID: window.userInfo[0].UserID,
        GroupID: '',
        ReviewUserID: '',
        DeptIDs: []
      };
      console.log('这个里面', row);
      this.dialogTitle = '增加用户';
      this.TreeDepts = [];
      this.defaultchecked = '';
      this.SelectGroup();
      this.SelectPosition();
      this.dialogFormVisible = true;
    },
    getRoleValue(value) {
      this.RoleID = value;
    },
    async SelectRole() {
      try {
        const { data } = await SelectRole({
          pageSize: 1000,
          pageIndex: 1,
          condition: ''
        });
        this.roleOptions = data.DataList;
      } catch {
      }
    },

    async SelectTreeDept() {
      try {
        const { data } = await SelectDepts();
        this.DeptsData = data;
        console.log('脚步', this.DeptsData);
      } catch {
      }
    },

    getSelectTreeDept(value) {
      this.selectOrg.orgsid = [];
      this.fromData.DeptID = [];
      this.$refs.treeDepts.setCheckedKeys([value.DeptID]);
      this.selectOrg.orgsid.push(value.DeptID);
      console.log('value是', value);
      this.fromData.DeptID.push(value.DeptID);
      console.log('选中的是', this.fromData.DeptID);
    },
    getSelectTreeDept2(value) {
      this.fromData.DeptIDs = this.$refs.treeDepts2.getCheckedKeys();
      this.$refs.treeDepts2.setCheckedKeys(this.fromData.DeptIDs);
      console.log('观测2', this.$refs.treeDepts2.getCheckedKeys());
    },

    getSelectDeptorUser(value) {
      this.fromData.ReviewUserID = value.join(',');
    },
    resetChecked() {
      this.$refs.treeDepts.setCheckedKeys([]);
      this.$refs.treeDepts2.setCheckedKeys([]);
    },

    getDefaultDeptValue(value) {
      this.fromData.DeptID = value;
    },
    getPositionValue(value) {
      this.fromData.PositionID = value;
    },
    getJobValue(value) {
      this.fromData.JobID = value;
    },
    getDefaultDeptValues(value) {
      this.listQuery.DeptID = value || 0;
      this.listQuery.DeptID = this.listQuery.DeptID.toString(); // 可以多选部门搜索，数组转为字符串
    },
    getPositionValues(value) {
      this.listQuery.PositionID = value || 0;
    },
    getJobValues(value) {
      this.listQuery.JobID = value || 0;
    },
    Debounce() {
      this.disabled = true;
      this.tableData = [];
      this.SelectUser();
      setTimeout(() => {
        this.disabled = false;
      }, 2000);
    },
    async SelectUser() {
      this.listLoading = true;
      this.listQuery.RoleID =
        this.listQuery.RoleID == '' ? 0 : this.listQuery.RoleID;
      try {
        const { data } = await SelectUser(this.listQuery);
        this.tableData = data.DataList;
        this.pagination.total = data.Total;
      } catch {
      }
      this.listLoading = false;
      this.listQuery.RoleID =
        this.listQuery.RoleID == 0 ? '' : this.listQuery.RoleID;
    },
    async clickSelectUser() {
      this.listQuery.pageIndex = 1;
      this.pagination.pageIndex = 1;
      this.SelectUser();
    },
    handleCurrentChange(index) {
      this.listQuery.pageIndex = index;
      this.SelectUser();
    },
    handleSizeChange(page) {
      this.listQuery.pageSize = page;
      this.clickSelectUser();
    },
    async roleSetData() {
      try {
        const { data } = await SelectRole({ pageSize: 2000, pageIndex: 1 });
        this.roleTableData = data.DataList;
      } catch {
      }
    },

    /* 组别管理 */
    Group() {
      this.dialogGroup = true;
      this.SelectGroup();
    },
    handleResize() {
    },
    async SelectGroup() {
      try {
        this.GroupLoading = true;
        const { data } = await SelectGroup(this.selectGroup);
        this.tableDataGroup = data;
      } catch (error) {
      }
      this.GroupLoading = false;
    },
    insetGroupData() {
      this.tableDataGroup.unshift({
        GroupID: 0,
        GroupName: ''
      });
      this.currentEdit = 0;
    },
    async finishEditClick(scope) {
      if (!scope.row.GroupName) {
        this.$message.warning('组别名称不能为空!');
        return;
      }
      try {
        scope.row.GroupID === 0
          ? await InsertGroup({
            GroupName: scope.row.GroupName
          })
          : await UpdateGroup({
            GroupID: scope.row.GroupID,
            GroupName: scope.row.GroupName
          });
        scope.row.GroupID === 0
          ? this.$message.success('新增成功')
          : this.$message.success('更新成功');
        this.SelectGroup();
        this.currentEdit = -1;
      } catch (error) {
      }
    },
    EditClick(scope) {
      this.currentEdit = scope.$index;
    },
    async DeleteGroup(scope) {
      console.log('scope', scope);
      try {
        await DeleteGroup({
          GroupID: scope.row.GroupID
        });
        this.SelectGroup();
        this.$message.success('删除成功!');
        this.currentEdit = -1;
      } catch (error) {
      }
    },
    async SelectPosition() {
      try {
        const { data } = await SelectPosition({
          pageIndex: 1,
          pageSize: 2000,
          UserName: '',
          JobID: 0,
          PositionID: 0,
          DeptID: 0,
          RoleID: 0
        });
        const zero = {
          PositionID: 0,
          PositionCode: '0',
          PositionName: '请选择职位',
          PositionDescription: ''
        };
        data.DataList.unshift(zero);
        this.options = data.DataList;
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>
<style lang="scss">
.user {
  .el-header {
    padding: 0px;
    margin: 2px;
    height: 30px !important;
  }

  .el-main {
    padding: 0px;
    margin: 2px;
    overflow-y: auto;
    height: calc(100vh - 170px);
  }

  .el-footer {
    padding: 0px;
    margin: 2px;
  }

  .Dept {
    height: 380px;
    overflow-y: auto;
  }
}
</style>

