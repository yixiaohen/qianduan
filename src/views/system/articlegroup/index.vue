<template>
  <div class="ArticleGroup">
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
              @click="addDepts({})"
            >增加
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              type="success"
              icon="el-icon-refresh"
              size="mini"
              :disabled="disabled"
              @click="Debounce"
            />
          </el-form-item>
        </el-form>
      </div>
      <el-table
        ref="tableData"
        :data="tableData"
        style="width: 100%"
        size="mini"
        row-key="GroupID"
        border
        lazy
        :load="addChildrenDept"
        :tree-props="{ children: 'Children', hasChildren: 'hasChildren' }"
      >
        <el-table-column
          prop="GroupName"
          label="类别名称"
        />
        <el-table-column
          prop="GroupDescription"
          label="类别描述"
        />
        <el-table-column
          label="操作"
          width="170"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-circle-plus"
              @click="addDept(scope.row)"
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
              @click="DeleteArticleGroup(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      :close-on-click-modal="false"
      :title="title"
      :visible.sync="dialogFormVisible"
      width="400px"
      @closed="closed"
    >
      <el-form
        ref="formDept"
        :model="formDept"
        :rules="rules"
        size="mini"
        label-width="80px"
      >
        <el-form-item label="上级分类">
          <el-input
            v-model="formDept.ArticleGroupParentName"
            disabled
          />
        </el-form-item>
        <el-form-item
          label="分类编码"
          prop="GroupCode"
        >
          <el-input
            v-model="formDept.GroupCode"
            :disabled="GroupCodeDisabled"
          />
        </el-form-item>
        <el-form-item
          label="分类名称"
          prop="GroupName"
        >
          <el-input v-model="formDept.GroupName" />
        </el-form-item>
        <el-form-item label="分类描述">
          <el-input
            v-model="formDept.GroupDescription"
            type="textarea"
            autosize
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          size="mini"
          @click="cancelClick"
        >取 消
        </el-button>
        <el-button
          type="primary"
          size="mini"
          @click="
            title === '添加资料' ? InsertArticleGroup() : UpdateArticleGroup()
          "
        >确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { DeleteArticleGroup, InsertArticleGroup, SelectArticleGroup, UpdateArticleGroup } from '@/api/Article';

export default {
  name: 'ArticleGroup',
  data() {
    return {
      tableData: [],
      dialogFormVisible: false,
      disabled: false,
      GroupCodeDisabled: false,
      maps: new Map(),
      uploadData: {},
      rowObject: {},
      title: '',
      rules: {
        GroupCode: [
          { required: true, message: '请输入资料代码', trigger: 'blur' }
        ],
        GroupName: [
          { required: true, message: '请输入资料名称', trigger: 'blur' }
        ]
      },
      formDept: {
        GroupID: 0,
        GroupCode: null,
        GroupName: null,
        ParentID: 0,
        GroupDescription: null,
        ArticleGroupParentName: null
      }
    };
  },
  created() {
    this.SelectArticleGroup();
  },
  methods: {
    async DeleteArticleGroup(row) {
      this.$confirm(`此操作将永久删除 ${row.GroupName} , 是否继续?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          try {
            const { data, msg } = await DeleteArticleGroup({
              GroupID: row.GroupID
            });
            data === 1
              ? this.$message({
                type: 'success',
                message: msg
              })
              : this.$message({
                type: 'error',
                message: msg
              });
          } catch {
          }
          const { ParentID } = row;
          const { tree, treeNode, resolve } = this.uploadData;
          this.addChildrenDept(tree, treeNode, resolve);
          this.$set(
            this.$refs.tableData.store.states.lazyTreeNodeMap,
            ParentID,
            []
          );
          this.Debounce();
        })
        .catch(e => e);
    },
    UpdateArticleGroup() {
      this.$refs.formDept.validate(async v => {
        if (v) {
          delete this.formDept.ArticleGroupParentName;
          delete this.formDept.Type;
          delete this.formDept.hasChildren;
          try {
            const UpdateArticleGroupData = await UpdateArticleGroup(
              this.formDept
            );
            UpdateArticleGroupData.data === 1
              ? this.$message({
                type: 'success',
                message: UpdateArticleGroupData.msg
              })
              : this.$message({
                type: 'error',
                message: UpdateArticleGroupData.msg
              });
          } catch {
          }
          const { tree, treeNode, resolve } = this.uploadData;
          this.addChildrenDept(tree, treeNode, resolve);
          this.Debounce();
          this.dialogFormVisible = false;
        } else {
          return false;
        }
      });
    },
    closed() {
      this.formDept.GroupName = this.rowObject.GroupName;
      this.formDept.GroupDescription = this.rowObject.GroupDescription;
    },
    cancelClick() {
      this.formDept.GroupName = this.rowObject.GroupName;
      this.formDept.GroupDescription = this.rowObject.GroupDescription;

      this.dialogFormVisible = false;
    },
    updateDept(row) {
      // row = JSON.parse(JSON.stringify(row))
      this.title = '修改资料';
      this.rowObject = JSON.parse(JSON.stringify(row));
      this.formDept = row;
      this.GroupCodeDisabled = true;
      this.formDept.ArticleGroupParentName = row.GroupName;
      this.dialogFormVisible = true;
      this.formDept.ParentID = row.ParentID;
    },
    InsertArticleGroup() {
      this.$refs.formDept.validate(async v => {
        if (v) {
          delete this.formDept.ArticleGroupParentName;
          try {
            const { data, msg } = await InsertArticleGroup(this.formDept);

            if (this.rowObject.ParentID !== undefined) {
              const { GroupID } = this.rowObject;
              const { tree, treeNode, resolve } = this.maps.get(GroupID);
              this.addChildrenDept(tree, treeNode, resolve);
            } else {
              this.Debounce();
            }
            data === 1
              ? this.$message({
                type: 'success',
                message: msg
              })
              : this.$message({
                type: 'error',
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
    addDept(row = {}) {
      row = JSON.parse(JSON.stringify(row));
      this.formDept = {
        GroupCode: null,
        GroupName: null,
        ParentID: row.GroupID,
        GroupDescription: null,
        ArticleGroupParentName: row.GroupName
      };
      this.rowObject = row;
      this.GroupCodeDisabled = false;
      this.title = '添加资料';
      if (this.maps.size === 0) {
        this.$alert('你必须展开当前行才可以添加子项目', '警告!', {
          confirmButtonText: '确定'
        });
        return;
      }
      const keys = [];
      this.maps.forEach(function(value, key, map) {
        keys.push(key);
      });
      if (keys.includes(row.GroupID)) {
        this.dialogFormVisible = true;
      } else {
        this.$alert('你必须展开当前行才可以添加子项目', '警告!', {
          confirmButtonText: '确定'
        });
      }
    },
    addDepts(row = {}) {
      row = JSON.parse(JSON.stringify(row));
      this.formDept = {
        GroupCode: null,
        GroupName: null,
        ParentID: row.GroupID,
        GroupDescription: null,
        ArticleGroupParentName: row.GroupName
      };
      this.rowObject = row;
      this.GroupCodeDisabled = false;
      this.title = '添加资料';
      this.dialogFormVisible = true;
    },

    Debounce() {
      this.disabled = true;
      // this.tableData = []
      this.SelectArticleGroup();
      setTimeout(() => {
        this.disabled = false;
      }, 2000);
    },
    async SelectArticleGroup(GroupID = 0) {
      try {
        const { data } = await SelectArticleGroup({ GroupID: GroupID });
        if (data instanceof Array) {
          data.map(item => {
            item.hasChildren = true;
          });
          this.tableData = data;
        }
      } catch {
      }
    },
    async addChildrenDept(tree, treeNode, resolve) {
      const { GroupID, ParentID } = tree;
      this.maps.set(GroupID, { tree, treeNode, resolve });
      this.maps.set(ParentID, { tree, treeNode, resolve });
      this.uploadData = { tree, treeNode, resolve };
      try {
        const { data } = await SelectArticleGroup({ GroupID: tree.GroupID });
        data.map(item => {
          item.hasChildren = true;
        });
        resolve(data);
      } catch {
      }
    }
  }
};
</script>

<style lang="scss">
.ArticleGroup {
  margin: 4px;

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
}
</style>
