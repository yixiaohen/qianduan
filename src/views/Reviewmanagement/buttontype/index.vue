<template>
  <div class="ButtonType">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form :inline="true" :model="listQuery" size="mini">
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-circle-plus"
              size="mini"
              @click="addRow"
            >增加</el-button>
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
          height="780"
        >
          <el-table-column
            type="index"
            label="序号"
            width="60"
            align="center"
          />
          <el-table-column prop="ButtonName" label="按钮名称" />
          <el-table-column prop="ButtonType" label="按钮类型" />
          <el-table-column
            label="操作"
            fixed="right"
            align="center"
            width="190"
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
      </div>
    </el-card>
    <el-dialog
      :title="dialogTitle"
      :close-on-click-modal="false"
      width="500px"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="ButtonTypeContent"
        :rules="rules"
        size="mini"
        :model="formData"
        label-width="80px"
      >
        <el-form-item label="按钮名称" prop="ButtonName">
          <el-input v-model="formData.ButtonName" clearable />
        </el-form-item>
        <el-form-item label="按钮类型" prop="ButtonType">
          <el-input v-model="formData.ButtonType" clearable />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancel">取 消</el-button>
        <el-button
          size="mini"
          type="primary"
          @click="
            dialogTitle === '添加类型' ? InsertButtonType() : UpdateButtonType()
          "
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { DeleteExpert, InsertButtonType, SelectExpert, UpdateButtonType } from '@/api/ButtonType';

export default {
  name: 'ButtonType',
  data() {
    return {
      dialogTitle: '',
      listLoading: false,
      dialogFormVisible: false,
      pagination: {
        pageIndex: 1,
        total: 0,
        pageSize: 15,
        pageSizes: [15, 20, 50, 100]
      },
      listQuery: {
        pageSize: 15,
        pageIndex: 1,
        condition: ''
      },
      formData: {
        ButtonName: '',
        ButtonType: ''
      },
      rules: {
        ButtonName: [
          { required: true, message: '请输入名字', trigger: 'blur' }
        ],
        ButtonType: [
          { required: true, message: '请输入类型', trigger: 'blur' }
        ]
      },
      tableData: []
    };
  },
  created() {
    this.SelectExpert();
  },
  methods: {
    deleteRow(row) {
      this.$confirm(`此操作将永久删除 ${row.ButtonName} , 是否继续?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          try {
            const { code, msg } = await DeleteExpert({
              ButtonID: row.ButtonID
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
            this.SelectExpert();
          } catch (error) {
          } finally {
            this.listLoading = true;
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    UpdateButtonType() {
      this.$refs.ButtonTypeContent.validate(async(v) => {
        if (v) {
          try {
            const { code, msg } = await UpdateButtonType(this.formData);
            code === 200
              ? this.$message({
                type: 'success',
                message: msg
              })
              : this.$message({
                type: 'error',
                message: msg
              });
            this.listLoading = true;
            this.SelectExpert();
          } catch (error) {
          } finally {
            this.dialogFormVisible = false;
          }
        }
      });
    },
    editRow(row) {
      this.dialogTitle = '编辑类型';
      this.formData = row;
      this.dialogFormVisible = true;
    },
    InsertButtonType() {
      this.$refs.ButtonTypeContent.validate(async(v) => {
        if (v) {
          try {
            const { code, msg } = await InsertButtonType(this.formData);
            code === 200
              ? this.$message({
                type: 'success',
                message: msg
              })
              : this.$message({
                type: 'error',
                message: msg
              });
            this.listLoading = true;
            this.SelectExpert();
          } catch (error) {
          } finally {
            this.dialogFormVisible = false;
          }
        }
      });
    },
    addRow() {
      this.dialogTitle = '添加类型';
      this.formData.ButtonName = '';
      this.formData.ButtonType = '';
      this.dialogFormVisible = true;
    },
    cancel() {
      this.dialogTitle = '';
      this.formData = {
        ButtonName: '',
        ButtonType: ''
      };
      this.dialogFormVisible = false;
    },
    async SelectExpert() {
      try {
        const { data } = await SelectExpert();
        this.tableData = data;
      } catch (error) {
      } finally {
        this.listLoading = false;
      }
    }
  }
};
</script>

<style lang="scss">
.ButtonType {
  margin: 4px;
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
