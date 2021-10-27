<template>
  <div class="root">
    <div class="top-container">
      <div class="top-container-head">
        <el-form :label-position="labelPosition" :inline="true" size="mini">
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-circle-plus"
              size="mini"
              @click="addMenu()"
            >增加</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="top-container-body">
        <el-table
          size="mini"
          :data="tableData"
          style="width: 100%"
          height="calc(100vh - 180px)"
          row-key="MenuID"
          border
          default-expand-all
          :tree-props="{ children: 'Children', hasChildren: 'hasChildren' }"
        >
          <el-table-column type="index" />
          <el-table-column prop="MemuTitle" label="菜单标题" width="150" />
          <el-table-column prop="MenuID" label="MenuID" width="100" />
          <el-table-column prop="ParentID" label="ParentID" width="100" />
          <el-table-column prop="MenuName" label="MenuName" width="160" />
          <el-table-column prop="MenuIcon" label="MenuIcon" />
          <el-table-column prop="Component" label="Component" />
          <el-table-column prop="MenuPath" label="MenuPath" width="180" />
          <el-table-column label="操作" width="250" align="center">
            <template slot-scope="{ row }">
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-circle-plus"
                @click="addMenu(row)"
              />
              <el-button
                type="info"
                size="mini"
                icon="el-icon-edit"
                @click="updateMenus(row)"
              />
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="deleteMenus(row)"
              />
              <el-button
                v-if="row.ParentID != 0"
                size="mini"
                type="info"
                icon="el-icon-top"
                circle
                @click="upRow(row)"
              />
              <el-button
                v-if="row.ParentID != 0"
                size="mini"
                type="info"
                icon="el-icon-bottom"
                circle
                @click="downRow(row)"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :title="title"
      :visible.sync="dialogFormVisible"
      width="400px"
    >
      <el-form
        ref="formMenu"
        :model="formMenu"
        :rules="rules"
        size="mini"
        label-width="80px"
      >
        <el-form-item label="父级ID" prop="ParentID">
          <el-input v-model="formMenu.ParentID" />
        </el-form-item>
        <el-form-item label="菜单类型" prop="MenuTypeID">
          <el-select v-model="formMenu.MenuTypeID" placeholder="请选择菜单类型">
            <el-option
              v-for="(item, index) in MenuType"
              :key="index"
              :label="item.MenuTypeName"
              :value="item.MenuTypeID"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="菜单标题" prop="MemuTitle">
          <el-input v-model="formMenu.MemuTitle" />
        </el-form-item>
        <el-form-item label="菜单名称" prop="MenuName">
          <el-input v-model="formMenu.MenuName" />
        </el-form-item>
        <el-form-item label="菜单图标" prop="MenuIcon">
          <el-input v-model="formMenu.MenuIcon" />
        </el-form-item>
        <el-form-item label="路由地址" prop="Component">
          <el-input v-model="formMenu.Component" />
        </el-form-item>
        <el-form-item label="菜单路径" prop="MenuPath">
          <el-input v-model="formMenu.MenuPath" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          size="mini"
          @click="title === '添加菜单' ? InsertMenu() : UpdateMenu()"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { DeleteMenu, InsertMenu, MenuMove, SelectAllMenuType, SelectMenu, UpdateMenu } from '@/api/user';

export default {
  name: 'Menu',
  data() {
    return {
      labelPosition: 'top',
      title: '',
      dialogFormVisible: false,
      tableData: [],
      formMenu: {
        ParentID: 0,
        MenuName: '',
        MenuIcon: 'theme',
        Component: '',
        MemuTitle: '',
        MenuPath: '',
        MenuTypeID: ''
      },
      MenuType: [],
      rules: {
        ParentID: [{ required: true, message: '请输入父级ID', trigger: 'blur' }],
        MenuName: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
        MenuIcon: [{ required: true, message: '请输入菜单图表', trigger: 'blur' }],
        Component: [{ required: true, message: '请输入菜单页面', trigger: 'blur' }],
        MemuTitle: [{ required: true, message: '请输入菜单标题', trigger: 'blur' }],
        MenuPath: [{ required: true, message: '请输入菜单路径', trigger: 'blur' }]
      }
    };
  },
  created() {
    this.getMenus();
  },
  methods: {
    deleteMenus(row) {
      this.$confirm(`此操作将永久删除 ${row.MemuTitle} , 是否继续?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          try {
            const { code } = await DeleteMenu({ MenuID: row.MenuID });
            code === 200
              ? this.$message({
                type: 'success',
                message: '删除成功!'
              })
              : this.$message({
                type: 'error',
                message: '删除失败!'
              });
          } catch {}
          this.getMenus();
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    UpdateMenu() {
      this.$refs.formMenu.validate(async(v) => {
        if (v) {
          try {
            const { data } = await UpdateMenu(this.formMenu);
            data === 1
              ? this.$message({
                type: 'success',
                message: '修改成功!'
              })
              : this.$message({
                type: 'error',
                message: '修改失败!'
              });
          } catch {}
          this.dialogFormVisible = false;
          this.formMenu = {};
          this.getMenus();
        }
      });
    },
    updateMenus(row) {
      this.SelectAllMenuType();
      this.title = '修改菜单';
      this.formMenu = row;
      this.dialogFormVisible = true;
    },
    InsertMenu() {
      this.$refs.formMenu.validate(async(v) => {
        if (v) {
          try {
            const { msg } = await InsertMenu(this.formMenu);
            let type;
            if (msg.includes('成功')) {
              type = 'success';
              this.dialogFormVisible = false;
              this.formMenu = {};
              this.getMenus();
            } else type = 'error';
            this.$message({
              type: type,
              message: msg
            });
          } catch {}
        }
      });
    },
    addMenu(row = {}) {
      this.SelectAllMenuType();
      this.title = '添加菜单';
      this.formMenu = row;
      this.dialogFormVisible = true;
    },
    async getMenus() {
      try {
        const { data } = await SelectMenu();
        this.tableData = data.Menus;
      } catch {}
    },
    async SelectAllMenuType() {
      const data = await SelectAllMenuType({ UserID: window.userInfo[0].UserID });
      this.MenuType = data.data;
    },
    async upRow(row) {
      try {
        const val = {
          MenuID: row.MenuID,
          MoveType: 1
        };
        const data = await MenuMove(val);
        this.getMenus();
      } catch {}
    },
    async downRow(row) {
      try {
        const val = {
          MenuID: row.MenuID,
          MoveType: 2
        };
        const data = await MenuMove(val);
        this.getMenus();
      } catch {}
    }
  }
};
</script>
<style lang="scss">
.root {
  height: calc(100vh - 100px);
  .top-container {
    width: 100%;
    height: 100%;
    .top-container-head {
      height: 32px;
    }
    .top-container-body {
      height: 100%;
      overflow-y: hidden;
    }
  }
}
</style>
