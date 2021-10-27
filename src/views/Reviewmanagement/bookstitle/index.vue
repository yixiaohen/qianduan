<template>
  <div class="BooksTitle">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form :inline="true" size="mini">
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-circle-plus"
              size="mini"
              @click="openAddTitleDialog"
            >增加</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="content">
        <el-table
          v-loading="listLoading"
          border
          size="mini"
          row-key="ExpertID"
          :data="tableData"
          :tree-props="{ children: 'Children', hasChildren: 'hasChildren' }"
          height="780"
        >
          <el-table-column label="专家手册标题" prop="ExpertTitle" />
          <el-table-column label="专家手册标题描述" prop="ExpertDescription" />
          <el-table-column
            label="操作"
            fixed="right"
            align="center"
            width="200"
          >
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-circle-plus"
                size="mini"
                @click="openAddTitleDialog(scope.row)"
              />
              <el-button
                type="info"
                size="mini"
                icon="el-icon-edit"
                @click="openUpdateTitleDialog(scope.row)"
              />
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="DeleteExpert(scope.row)"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!-- 增加修改标题的dialog -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible">
      <div class="content">
        <el-form ref="formData" :rules="rules" :model="formData" size="mini">
          <el-form-item label="专家手册标题" prop="ExpertTitle">
            <el-input
              v-model="formData.ExpertTitle"
              placeholder="请输入专家手册标题"
            />
          </el-form-item>
          <el-form-item label="专家手册标题描述" prop="ExpertDescription">
            <el-input
              v-model="formData.ExpertDescription"
              type="textarea"
              placeholder="请输入专家手册标题描述"
              show-word-limit
            />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="resetForm">取 消</el-button>
        <el-button
          size="mini"
          type="primary"
          @click="submitFormData({})"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { DeleteExpert, InsertExpert, SelectExpert, UpdateExpert } from '@/api/Expert';

export default {
  name: 'BooksTitle',
  data() {
    return {
      dialogVisible: false,
      dialogTitle: '增加专家手册标题',
      listLoading: false,
      downloadLoading: false,
      tableData: [],
      formData: {
        ExpertID: 0,
        ExpertTitle: '',
        ExpertDescription: '',
        ParentID: 0
      },
      listQuery: {
        ExpertID: 0,
        ExpertTitle: '',
        ExpertDescription: '',
        ParentID: 0,
        Type: 0
      },
      rules: {
        ExpertTitle: [
          { required: true, message: '请输入专家手册标题', trigger: 'blur' }
        ],
        ExpertDescription: [
          {
            required: true,
            message: '请输入专家手册标题描述',
            trigger: 'blur'
          }
        ]
      }
    };
  },
  created() {
    this.SelectExpert();
  },
  methods: {
    DeleteExpert(row) {
      this.$confirm(`此操作将永久删除 ${row.ExpertTitle} , 是否继续?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          const { data } = await DeleteExpert({ ExpertID: row.ExpertID });
          this.$message({
            type: 'warning',
            message: data
          });
          this.SelectExpert();
        } catch (error) {}
      });
    },
    submitFormData() {
      this.$refs.formData.validate(async(v) => {
        if (v) {
          const formData = this.formData;
          try {
            if (this.dialogTitle === '增加专家手册标题') {
              delete formData.ExpertID;
              const { data } = await InsertExpert(formData);
              this.$message({
                type: 'success',
                message: data
              });
            } else {
              const { data } = await UpdateExpert(formData);
              this.$message({
                type: 'success',
                message: data
              });
            }
          } catch (error) {
          } finally {
            this.resetForm();
            this.SelectExpert();
          }
        }
      });
    },
    openUpdateTitleDialog(row) {
      this.formData.ExpertID = row.ExpertID;
      this.formData.ExpertTitle = row.ExpertTitle;
      this.formData.ExpertDescription = row.ExpertDescription;
      this.formData.ParentID = row.ParentID;
      this.dialogTitle = '修改专家手册标题';
      this.dialogVisible = true;
    },
    resetForm() {
      this.$refs.formData.resetFields();
      this.dialogVisible = false;
    },
    openAddTitleDialog(row = {}) {
      this.formData.ParentID = row.ExpertID || 0;
      this.dialogTitle = '增加专家手册标题';
      this.dialogVisible = true;
    },
    async SelectExpert() {
      try {
        const { data } = await SelectExpert(this.listQuery);
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
.BooksTitle {
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
