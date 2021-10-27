<template>
  <div class="RoleSet">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form :label-role="labelRole" :inline="true">
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
            <el-input
              v-model="listQuery.condition"
              placeholder="请根据角色查询"
              prefix-icon="el-icon-search"
              style="width: 180px"
              size="mini"
              class="filter-item inline-input"
              clearable
              @keyup.enter.native="clickRoleSetData"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              :loading="listLoading"
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="clickRoleSetData"
            >搜索
            </el-button>
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
          height="calc(100vh - 180px)"
        >
          <el-table-column
            type="index"
            label="序号"
            width="60"
            align="center"
          />
          <el-table-column prop="RoleCode" label="角色编码" sortable width="180"/>
          <el-table-column prop="RoleName" label="角色名称" width="200"/>
          <el-table-column
            prop="RoleName"
            label="角色状态"
            align="center"
            width="100"
          >
            <template slot-scope="scope">
              <el-tag :type="scope.row.Type === 1 ? 'danger' : 'success'">
                {{ scope.row.Type === 1 ? '已禁用' : '已启用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="RoleDescription" label="角色描述"/>
          <el-table-column
            label="操作"
            align="center"
            width="250"
          >
            <template slot-scope="scope">
              <el-button
                :type="scope.row.Type === 1 ? 'danger' : 'success'"
                size="mini"
                :icon="scope.row.Type === 1 ? ' el-icon-turn-off' : 'el-icon-open'"
                @click.native.prevent="deleteRow(scope.$index, scope.row)"
              >状态
              </el-button>
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-edit"
                @click.native.prevent="editRow(scope.$index, scope.row)"
              >分配权限
              </el-button>

              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click.native.prevent="delRow(scope.$index, scope.row)"
              >删除
              </el-button>
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
      </div>
    </el-card>
    <el-dialog
      v-if="dialogVisible"
      :close-on-click-modal="false"
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :close="close"
      width="40%"
    >
      <el-tabs v-model="activeName">
        <el-tab-pane label="角色信息" name="first">
          <el-form
            ref="formData"
            v-model="labelRole"
            :rules="rules"
            :model="formData"
            size="mini"
          >
            <el-form-item label="角色编码" prop="RoleCode">
              <el-input
                v-model="formData.RoleCode"
                :disabled="RoleCodedisabled"
              />
            </el-form-item>
            <el-form-item label="角色名称" prop="RoleName">
              <el-input v-model="formData.RoleName"/>
            </el-form-item>
            <el-form-item label="角色描述">
              <el-input
                v-model="formData.RoleDescription"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane
          v-if="dialogTitle !== '添加角色'"
          label="菜单信息"
          name="second"
        >
          <menus ref="menus" @getMenusValue="getMenusValue"/>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="mini"
          @click="
            dialogVisible = false;
            RoleCodedisabled = false;
          "
        >取 消</el-button>
        <el-button
          size="mini"
          type="primary"
          @click="dialogTitle === '添加角色' ? InsertRole() : UpdateRole()"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { DeleteRole, DisableRole, InsertMenuOnRole, InsertRole, SelectRole, UpdateRole } from '@/api/user';
import menus from '@/views/components/menus';
import tableHeight from '@/views/mixin/tableHeight';

export default {
  name: 'Role',
  components: { menus },
  mixins: [tableHeight],
  data() {
    return {
      roleType: 0, // 默认启用角色
      labelRole: 'right',
      listLoading: true,
      dialogTitle: '',
      activeName: 'first',
      formData: {
        RoleID: 0,
        RoleCode: '',
        RoleName: '',
        RoleDescription: ''
      },
      menus: null,
      rules: {
        RoleCode: [
          { required: true, message: '请输入角色编码', trigger: 'blur' }
        ],
        RoleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      listQuery: {
        pageSize: 15,
        pageIndex: 1,
        condition: ''
      },
      dialogVisible: false,
      tableData: [],
      pagination: {
        pageIndex: 1,
        total: 0,
        pageSize: 15,
        pageSizes: [15, 20, 50, 100, 150, 200]
      },
      RoleCodedisabled: false
    };
  },
  created() {
    this.roleSetData();
  },
  methods: {
    deleteRow(index, row) {
      this.$confirm(`正在改变${row.RoleName}状态, 是否继续?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          // RoleID:角色ID
          // Type:0 启用 1 禁用
          // 如果一开始是启用该角色0，点击按钮后就改变状态为1，为禁用
          if (row.Type === 0) {
            this.roleType = 1;
          } else { // 如果一开始是禁用该角色1，点击按钮后就改变状态为2，为启用
            this.roleType = 0;
          }
          const form = {
            RoleID: row.RoleID,
            Type: this.roleType
          };
          try {
            const { msg } = await DisableRole(form);
            this.$message({
              type: 'success',
              message: msg
            });
          } catch {
          }
          this.roleSetData();
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
    },
    async UpdateRole() {
      this.$refs.formData.validate(async(v) => {
        if (v) {
          const Menus = {
            RoleID: this.formData.RoleID,
            MenuIDs: (this.menus && this.menus.join(',')) || ''
          };
          try {
            await InsertMenuOnRole(Menus);
            const { msg } = await UpdateRole(this.formData);
            this.RoleCodedisabled = false;
            this.$message({
              type: 'success',
              message: msg
            });
          } catch {
          }
          this.roleSetData();
          this.dialogVisible = false;
          this.formData = {};
        } else {
          return false;
        }
      });
    },
    open() {
      this.$refs.menus.setCheckedKeys([]);
      if (this.dialogTitle === '修改角色') {
        const { MenuID: MenuIDs } = this.formData;
        this.$refs.menus.setCheckedKeys(MenuIDs.split(','));
      }
    },
    close() {
      this.$refs.menus.setCheckedKeys([]);
    },
    // 编辑角色权限
    editRow(index, row) {
      this.RoleCodedisabled = true;
      row = JSON.parse(JSON.stringify(row));
      this.formData = row;
      const { MenuID: MenuIDs } = row;
      this.menus = (MenuIDs && MenuIDs.split(',')) || [];
      this.dialogTitle = '修改角色';
      this.dialogVisible = true;
      this.$nextTick(() => {
        // 必须在dialogVisible = true渲染之后才存在setCheckedKeys
        this.$refs.menus.setCheckedKeys(this.menus);
      });
    },
    // 删除角色
    delRow(index, row) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(async() => {
        const { code } = await DeleteRole({ RoleID: row.RoleID });
        if (code === 200) {
          this.roleSetData(); // 刷新列表
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    async InsertRole() {
      this.$refs.formData.validate(async(v) => {
        if (v) {
          try {
            const { msg } = await InsertRole(this.formData);
            this.formData = {};
            this.roleSetData();
            this.$message({
              type: 'success',
              message: msg
            });
          } catch {
          }
          this.dialogVisible = false;
        } else {
          return false;
        }
      });
    },
    getMenusValue(value) {
      this.menus = value;
    },
    addRow() {
      this.formData = {
        RoleID: 0,
        RoleCode: '',
        RoleName: '',
        RoleDescription: ''
      };
      this.dialogTitle = '添加角色';
      this.dialogVisible = true;
    },
    handleCurrentChange(index) {
      this.listQuery.pageIndex = index;
      this.roleSetData();
    },
    handleSizeChange(page) {
      this.listQuery.pageSize = page;
      this.clickRoleSetData();
    },
    async roleSetData() {
      this.listLoading = true;
      try {
        const { data } = await SelectRole(this.listQuery);
        this.tableData = data.DataList;
        this.pagination.total = data.Total;
      } catch {
      }
      this.listLoading = false;
    },
    async clickRoleSetData() {
      this.listQuery.pageIndex = 1;
      this.pagination.pageIndex = 1;
      this.roleSetData();
    }
  }
};
</script>

<style lang="scss">
.RoleSet {
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
