<template>
  <div class="JobSet">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form :label-position="labelPosition" :inline="true">
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
              placeholder="请根据职位名称查询"
              prefix-icon="el-icon-search"
              style="width: 180px;"
              size="mini"
              class="filter-item inline-input"
              clearable
              @keyup.enter.native="jobSetData"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="info"
              icon="el-icon-search"
              :loading="listLoading"
              size="mini"
              @click="clickJobSetData"
            >搜索</el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              :loading="downloadLoading"
              :disabled="listLoading"
              type="success"
              icon="el-icon-document"
              size="mini"
              @click="handleDownload"
            >导出</el-button>
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
          <el-table-column prop="PositionCode" label="职位编码" width="180" />
          <el-table-column prop="PositionName" label="职位名称" width="200" />
          <el-table-column prop="PositionDescription" label="职位描述" />
          <el-table-column
            label="操作"
            align="center"
            width="150"
          >
            <template slot-scope="scope">
              <el-button
                type="info"
                size="mini"
                icon="el-icon-edit"
                @click.native.prevent="editRow(scope.$index, scope.row)"
              />
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click.native.prevent="deleteRow(scope.$index, scope.row)"
              />
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="margin:6px 0 0 0"
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
      :close-on-click-modal="false"
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="400px"
    >
      <el-form
        ref="formData"
        v-model="labelPosition"
        :rules="rules"
        :model="formData"
        size="small"
      >
        <el-form-item label="职位编码" prop="PositionCode">
          <el-input v-model="formData.PositionCode" />
        </el-form-item>
        <el-form-item label="职位名称" prop="PositionName">
          <el-input v-model="formData.PositionName" />
        </el-form-item>
        <el-form-item label="职位描述">
          <el-input
            v-model="formData.PositionDescription"
            type="textarea"
            :rows="4"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button
          size="mini"
          type="primary"
          @click="
            dialogTitle === '添加职位' ? InsertPosition() : UpdatePosition()
          "
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { DeletePosition, InsertPosition, SelectPosition, UpdatePosition } from '@/api/position';
import tableHeight from '@/views/mixin/tableHeight';

export default {
  name: 'Position',
  mixins: [tableHeight],
  data() {
    return {
      labelPosition: 'right',
      listLoading: true,
      downloadLoading: false,
      dialogTitle: '',
      formData: {
        PositionCode: '',
        PositionName: '',
        PositionDescription: ''
      },
      rules: {
        PositionCode: [
          { required: true, message: '请输入职位编码', trigger: 'blur' }
        ],
        PositionName: [
          { required: true, message: '请输入职位名称', trigger: 'blur' }
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
        pageSizes: [15, 50, 100, 150, 200]
      }
    };
  },
  created() {
    this.jobSetData();
  },
  methods: {
    async handleDownload() {
      this.downloadLoading = true;
      const listQuery = {
        pageIndex: 1,
        pageSize: this.pagination.total,
        condition: ''
      };
      try {
        const excel = await import('@/vendor/Export2Excel');
        const tHeader = ['序号', '职位编码', '职位名称', '职位描述'];
        const filterVal = [
          'PositionID',
          'PositionCode',
          'PositionName',
          'PositionDescription'
        ];
        const { data } = await SelectPosition(listQuery);
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
    deleteRow(index, row) {
      this.$confirm(
        `此操作将永久删除 ${row.PositionName} , 是否继续?`,
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(async() => {
          try {
            const { code } = await DeletePosition({
              PositionID: row.PositionID
            });
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
          this.jobSetData();
        })
        .catch(e => e);
    },
    UpdatePosition() {
      this.$refs.formData.validate(async v => {
        if (v) {
          try {
            const { code } = await UpdatePosition(this.formData);
            this.jobSetData();
            code === 200
              ? this.$message({
                type: 'success',
                message: '修改成功!'
              })
              : this.$message({
                type: 'error',
                message: '修改失败!'
              });
          } catch {}
          this.dialogVisible = false;
          this.formData = {};
        } else {
          return false;
        }
      });
    },
    editRow(index, row) {
      this.formData = JSON.parse(JSON.stringify(row));
      this.dialogTitle = '修改职位';
      this.dialogVisible = true;
    },
    InsertPosition() {
      this.$refs.formData.validate(async v => {
        if (v) {
          try {
            const { code } = await InsertPosition(this.formData);
            this.formData = {};
            this.jobSetData();
            code === 200
              ? this.$message({
                type: 'success',
                message: '添加成功!'
              })
              : this.$message({
                type: 'error',
                message: '添加失败!'
              });
          } catch {}
          this.dialogVisible = false;
        } else {
          return false;
        }
      });
    },
    addRow() {
      this.formData = {
        PositionCode: '',
        PositionName: '',
        PositionDescription: ''
      };
      this.dialogTitle = '添加职位';
      this.dialogVisible = true;
    },
    handleCurrentChange(index) {
      this.listQuery.pageIndex = index;
      this.jobSetData();
    },
    handleSizeChange(page) {
      this.listQuery.pageSize = page;
      this.clickJobSetData();
    },
    async jobSetData() {
      this.listLoading = true;
      try {
        const { data } = await SelectPosition(this.listQuery);
        this.tableData = data.DataList;
        this.pagination.total = data.Total;
      } catch {}
      this.listLoading = false;
    },
    async clickJobSetData() {
      this.listQuery.pageIndex = 1;
      this.pagination.pageIndex = 1;
      this.jobSetData();
    }
  }
};
</script>
<style lang="scss">
.JobSet {
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
