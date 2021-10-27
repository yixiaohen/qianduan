<template>
  <div class="Depts">
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <el-form
          label-position="left"
          :inline="true"
        >
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-circle-plus"
              size="mini"
              @click="addDepts()"
            >增加
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="DeptsByNameVal.DeptName"
              size="mini"
              placeholder="科室部门名称"
              @keyup.enter.native="SelectDeptsByName"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="mini"
              @click="SelectDeptsByName"
            >查询
            </el-button>
          </el-form-item>
          <!-- <el-form-item>
            <el-button type="primary" icon="el-icon-circle-plus" size="mini">部门导入</el-button>
          </el-form-item> -->
          <el-form-item>
            <el-button
              type="success"
              icon="el-icon-refresh"
              size="mini"
              :disabled="disabled"
              @click="refreshRoot"
            />
          </el-form-item>
        </el-form>
      </div>
      <el-table
        ref="tableData"
        v-loading="tableDataLoading"
        :data="tableData"
        element-loading-text="拼命加载中"
        style="width: 100%"
        height="calc(100vh - 162px)"
        size="mini"
        row-key="DeptID"
        :expand-row-keys="rowKeys"
        border
        lazy
        default-expand-all
        :load="addChildrenDept"
        :tree-props="{ children: 'Children', hasChildren: 'hasChildren' }"
      >
        <el-table-column
          prop="DeptName"
          label="部门"
        />
        <el-table-column
          prop="Type"
          label="部门状态"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <el-tag
              size="mini"
              :type="scope.row.Type === 0 ? '' : 'danger'"
            >
              {{ scope.row.Type === 0 ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="RoleName"
          label="角色权限"
        />
        <el-table-column
          label="操作"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-circle-plus"
              @click="insertDept(scope.row)"
            />
            <el-button
              type="info"
              size="mini"
              icon="el-icon-edit"
              @click="updateDept(scope.row)"
            />
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="deleteDept(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      :title="title"
      :visible.sync="dialogFormVisible"
      :width="device === 'desktop' ? '35%' : '90%'"
    >
      <el-form
        ref="formDept"
        :model="formDept"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="上级科室">
          <el-input
            v-model="formDept.DeptParentName"
            disabled
          />
        </el-form-item>
        <el-form-item
          label="科室代码"
          prop="DeptCode"
        >
          <el-input v-model="formDept.DeptCode" />
        </el-form-item>
        <el-form-item
          label="科室名称"
          prop="DeptName"
        >
          <el-input v-model="formDept.DeptName" />
        </el-form-item>
        <el-form-item label="科室描述">
          <el-input
            v-model="formDept.DeptDescription"
            type="textarea"
            autosize
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item
          v-if="title !== '添加科室'"
          label="分配角色"
        >
          <el-select
            v-model="roleID"
            placeholder="角色"
            :multiple="true"
            collapse-tags
            size="mini"
            clearable
            :style="{ width: '100%' }"
          >
            <el-option
              v-for="item in roleOptions"
              :key="item.RoleID"
              :label="item.RoleName"
              :value="item.RoleID"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="其它科室基本概况"
          class="IsSelectOtherDept"
        >
          <el-radio-group
            v-model="formDept.IsSelectOtherDept"
            size="mini"
          >
            <el-radio
              :label="1"
              border
            >查看
            </el-radio>
            <el-radio
              :label="0"
              border
            >不查看
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          size="mini"
          @click="cancle"
        >取 消
        </el-button>
        <el-button
          type="primary"
          size="mini"
          @click="title === '添加科室' ? doInsertDept() : doUpdateDept()"
        >确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  DeleteDept,
  InsertDept,
  InsertRoleOnDept,
  SelectDept,
  SelectDeptsByName,
  SelectRole,
  UpdateDept
} from '@/api/user';
import { mapGetters } from 'vuex';

export default {
  name: 'Dept',
  data() {
    return {
      tableData: [],
      dialogFormVisible: false,
      disabled: false,
      title: '',
      rules: {
        DeptCode: [{ required: true, message: '请输入科室代码', trigger: 'blur' }],
        DeptName: [{ required: true, message: '请输入科室名称', trigger: 'blur' }]
      },
      roleID: [],
      roleOptions: [],
      DeptIDs: [],
      maps: new Map(),
      formDept: {
        ParentID: 0,
        DeptCode: '',
        DeptName: '',
        DeptID: 0,
        DeptDescription: '',
        DeptParentName: '',
        IsSelectOtherDept: 0
      },
      rowObject: {},
      DeptsByNameVal: {
        DeptName: ''
      },
      rowKeys: [],
      tableDataLoading: false
    };
  },
  created() {
    // this.SelectDept();
    this.SelectDeptsByName();
    this.SelectRole();
  },
  computed: {
    ...mapGetters(['device'])
  },
  methods: {
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
    cancle() {
      this.dialogFormVisible = false;
      this.formDept.DeptName = this.rowObject.DeptName;
    },
    addDepts(row = {}) {
      row = JSON.parse(JSON.stringify(row));
      this.formDept = {
        ParentID: row.DeptID || 0,
        DeptCode: '',
        DeptName: '',
        DeptID: 0,
        DeptDescription: '',
        DeptParentName: row.DeptName,
        IsSelectOtherDept: 0
      };
      this.title = '添加科室';
      this.rowObject = row;
      this.dialogFormVisible = true;
    },
    insertDept(row = {}) {
      row = JSON.parse(JSON.stringify(row));
      this.formDept = {
        ParentID: row.DeptID || 0,
        DeptCode: '',
        DeptName: '',
        DeptID: 0,
        DeptDescription: '',
        DeptParentName: row.DeptName
      };
      this.title = '添加科室';
      this.rowObject = row;
      this.dialogFormVisible = true;
    },
    doInsertDept() {
      this.$refs.formDept.validate(async(v) => {
        if (v) {
          delete this.formDept.DeptParentName;
          try {
            const { msg } = await InsertDept(this.formDept);
            this.refreshRow(this.rowObject.DeptID);
            this.$message({
              type: 'success',
              message: msg
            });
          } catch {
          }
          this.dialogFormVisible = false;
        } else {
          return false;
        }
      });
    },
    updateDept(row) {
      this.title = '修改科室';
      this.formDept = JSON.parse(JSON.stringify(row));
      this.rowObject = JSON.parse(JSON.stringify(row));
      this.dialogFormVisible = true;
      this.formDept.DeptParentName = row.DeptName;
      this.formDept.ParentID = row.DeptID;
      this.formDept.IsSelectOtherDept = row.IsSelectOtherDept;
      row.RoleID = row.RoleID == null ? '' : row.RoleID;
      this.roleID = row.RoleID.split(',').map((item) => parseInt(item));
    },
    doUpdateDept() {
      this.$refs.formDept.validate(async(v) => {
        if (v) {
          delete this.formDept.DeptParentName;
          try {
            const UpdateDeptData = await UpdateDept(this.formDept);
            const InsertRoleOnDeptData = InsertRoleOnDept({
              RoleID: this.roleID,
              DeptID: this.formDept.DeptID
            });
            UpdateDeptData.data === 1 || InsertRoleOnDeptData.data === 1
              ? this.$message({
                type: 'success',
                message: '修改成功!'
              })
              : this.$message({
                type: 'error',
                message: '修改失败!'
              });
          } catch {
          }
          if (this.rowObject.ParentID) {
            this.refreshRow(this.rowObject.ParentID);
          } else {
            this.refreshRoot();
          }
          this.dialogFormVisible = false;
        } else {
          return false;
        }
      });
    },
    deleteDept(row) {
      this.$confirm(`此操作将永久删除 <br>  ${row.DeptName}`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        type: 'warning'
      }).then(async() => {
        try {
          const { code, msg } = await DeleteDept({ DeptID: row.DeptID });
          code === 200
            ? this.$message({
              type: 'success',
              message: msg
            })
            : this.$message({
              type: 'error',
              message: msg
            });
          if (code == 200) {
            this.maps.delete(row.DeptID);
            this.SelectDeptsByName();
            if (row.ParentID) {
              // 当存在父节点, 在父节点的子数组array中找到当前删除的节点
              const arr = this.$refs.tableData.store.states.lazyTreeNodeMap[row.ParentID];
              arr.splice(
                arr.findIndex((item) => item.DeptID === row.DeptID),
                1
              );
            } else {
              this.refreshRoot();
            } // 根节点
          }
        } catch {
        }
      });
    },
    refreshRow(id) {
      if (this.rowObject.ParentID !== undefined) {
        const cur = this.maps.get(id);
        if (cur) {
          // 假如当前部门节点已经展开
          const { tree, treeNode, resolve } = cur;
          setTimeout(() => {
            this.addChildrenDept(tree, treeNode, resolve);
          }, 500);
        }
      } else {
        this.refreshRoot();
      }
    },
    refreshRoot() {
      // 最顶层根节点的更新
      this.disabled = true;
      setTimeout(() => {
        this.SelectDept();
        this.disabled = false;
      }, 500);
    },
    async SelectDept(ParentID = 0) {
      try {
        const { data } = await SelectDept({ DeptID: ParentID });
        if (data instanceof Array) {
          data.map((item) => {
            item.hasChildren = true;
          });
          this.tableData = data;
        }
      } catch {
      }
    },
    async addChildrenDept(tree, treeNode, resolve) {
      // 当前部门节点已经展开，之下插入子节点，自动显示新插入节点
      this.maps.set(tree.DeptID, { tree, treeNode, resolve });
      try {
        const { data } = await SelectDept({ DeptID: tree.DeptID });
        if (data instanceof Array) {
          data.map((item) => {
            item.hasChildren = true;
          });
          resolve(data);
        }
      } catch {
      }
    },
    async SelectDeptsByName() {
      try {
        this.tableDataLoading = true;
        const { data } = await SelectDeptsByName({
          DeptName: this.DeptsByNameVal.DeptName
        });
        this.tableDataLoading = false;
        this.rowKeys = [];
        if (data instanceof Array) {
          data.map((item) => {
            this.rowKeys.push(item.DeptID.toString());
          });
          this.tableData = data;
          this.tableDataLoading = false;
        }
      } catch (error) {
        // console.log("error" + error);
      }
      this.tableDataLoading = false;
    }
  }
};
</script>
<style lang="scss">
.Depts {
  .el-card__body {
    padding: 6px;
  }

  .el-card__header {
    padding: 2px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;

    .el-form-item {
      margin-bottom: 0;
    }

    .el-form-item:nth-child(1) {
      margin-left: 10px;
      margin-right: 20px;
    }
  }

  .IsSelectOtherDept {
    .el-form-item__label {
      width: 135px !important;
    }
  }
}
</style>
