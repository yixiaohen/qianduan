<template>
  <div class="Penalties">
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
          <el-form-item>
            <el-input
              v-model="listQuery.condition"
              placeholder="扣分原因"
              style="width: 180px"
              size="mini"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="info"
              :loading="listLoading"
              icon="el-icon-search"
              size="mini"
              @click="clickSelectPenalties()"
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
          height="calc(100vh - 186px)"
        >
          <el-table-column
            type="index"
            label="序号"
            width="60"
            align="center"
          />
          <el-table-column prop="PenaltiesContent" label="扣分内容" />
          <el-table-column prop="PenaltiesFraction" label="扣分分数" />
          <el-table-column
            label="操作"
            fixed="right"
            align="center"
            width="100"
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
      :title="dialogTitle"
      :close-on-click-modal="false"
      width="500px"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="PenaltiesContent"
        :rules="rules"
        size="mini"
        :model="formData"
        label-width="80px"
      >
        <el-form-item label="扣分内容" prop="PenaltiesContent">
          <el-input v-model="formData.PenaltiesContent" type="textarea" />
        </el-form-item>
        <el-form-item label="扣分分数" prop="PenaltiesFraction">
          <el-input v-model="formData.PenaltiesFraction" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancel">取 消</el-button>
        <el-button
          size="mini"
          type="primary"
          @click="
            dialogTitle === '录制扣分原因'
              ? InsertPenalties()
              : UpdatePenalties()
          "
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { DeletePenalties, InsertPenalties, SelectPenalties, UpdatePenalties } from '@/api/Penalties';
import tableHeight from '@/views/mixin/tableHeight';

export default {
  name: 'Penalties',
  mixins: [tableHeight],
  data() {
    return {
      dialogTitle: '',
      listLoading: false,
      dialogFormVisible: false,
      pagination: {
        pageIndex: 1,
        total: 0,
        pageSize: 50,
        pageSizes: [15, 20, 50, 100]
      },
      listQuery: {
        pageSize: 50,
        pageIndex: 1,
        condition: ''
      },
      formData: {
        PenaltiesFraction: 0,
        PenaltiesContent: ''
      },
      rules: {
        PenaltiesFraction: [
          { required: true, message: '请输入分数', trigger: 'blur' }
        ],
        PenaltiesContent: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ]
      },
      tableData: []
    };
  },
  created() {
    this.SelectPenalties();
  },
  methods: {
    deleteRow(row) {
      this.$confirm(
        `此操作将永久删除 ${row.PenaltiesContent} , 是否继续?`,
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(async() => {
          try {
            const { code, msg } = await DeletePenalties({
              PenaltiesID: row.PenaltiesID
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
            this.SelectPenalties();
          } catch (error) {
          } finally {
            this.listLoading = true;
          }
        })
        .catch((e) => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    UpdatePenalties() {
      this.$refs.PenaltiesContent.validate(async(v) => {
        if (v) {
          this.formData.PenaltiesFraction = parseFloat(
            this.formData.PenaltiesFraction
          );
          try {
            const { code, msg } = await UpdatePenalties(this.formData);
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
            this.SelectPenalties();
          } catch (error) {
          } finally {
            this.dialogFormVisible = false;
          }
        }
      });
    },
    editRow(row) {
      row = JSON.parse(JSON.stringify(row));
      this.dialogTitle = '编辑扣分原因';
      this.formData = row;
      this.dialogFormVisible = true;
    },
    InsertPenalties() {
      this.$refs.PenaltiesContent.validate(async(v) => {
        if (v) {
          this.formData.PenaltiesFraction = parseFloat(
            this.formData.PenaltiesFraction
          );
          try {
            const { code, msg } = await InsertPenalties(this.formData);
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
            this.SelectPenalties();
          } catch (error) {
          } finally {
            this.dialogFormVisible = false;
          }
        }
      });
    },
    addRow() {
      this.dialogTitle = '录制扣分原因';
      this.formData.PenaltiesFraction = 0;
      this.formData.PenaltiesContent = '';
      this.dialogFormVisible = true;
    },
    cancel() {
      this.dialogTitle = '';
      this.formData = {
        PenaltiesFraction: 0,
        PenaltiesContent: ''
      };
      this.dialogFormVisible = false;
    },
    async SelectPenalties() {
      try {
        const { data } = await SelectPenalties(this.listQuery);
        this.tableData = data.DataList;
        this.pagination.total = data.Total;
      } catch (error) {
      } finally {
        this.listLoading = false;
      }
    },
    async clickSelectPenalties() {
      this.listLoading = true;
      this.listQuery.pageIndex = 1;
      this.pagination.pageIndex = 1;
      this.SelectPenalties();
    },
    handleCurrentChange(index) {
      this.listLoading = true;
      this.listQuery.pageIndex = index;
      this.SelectPenalties();
    },
    handleSizeChange(page) {
      this.listLoading = true;
      this.listQuery.pageSize = page;
      this.clickSelectPenalties();
    }
  }
};
</script>

<style lang="scss">
.Penalties {
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
