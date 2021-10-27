<template>
  <el-container class="Penalties">
    <el-header>
      <el-form
        :inline="true"
        :model="listQuery"
        size="mini"
      >
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
          >搜索
          </el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main>
      <el-table
        v-loading="listLoading"
        :data="tableData"
        style="width: 100%"
        border
        stripe
        size="mini"
        height="calc(100vh - 180px)"
      >
        <el-table-column
          type="index"
          label="序号"
          width="60"
          align="center"
        />
        <el-table-column
          prop="PenaltiesContent"
          label="扣分内容"
          :show-overflow-tooltip="cellOverflow"
        />
        <el-table-column
          prop="PenaltiesFraction"
          label="扣分分数"
        />
        <el-table-column
          label="操作"
          fixed="right"
          align="center"
          width="150"
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
      <el-dialog
        :title="dialogTitle"
        :close-on-click-modal="false"
        :visible.sync="dialogFormVisible"
        :width="device === 'desktop' ? '50%' : '90%'"
      >
        <el-form
          ref="PenaltiesContent"
          :rules="rules"
          size="mini"
          :model="formData"
          label-width="80px"
        >
          <el-form-item
            label="扣分内容"
            prop="PenaltiesContent"
          >
            <el-input
              v-model="formData.PenaltiesContent"
              type="textarea"
            />
          </el-form-item>
          <el-form-item
            label="扣分分数"
            prop="PenaltiesFraction"
          >
            <el-input v-model="formData.PenaltiesFraction" />
          </el-form-item>
        </el-form>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            size="mini"
            @click="cancel"
          >取 消
          </el-button>
          <el-button
            size="mini"
            type="primary"
            @click="
              dialogTitle === '录制扣分原因'
                ? InsertPenalties()
                : UpdatePenalties()
            "
          >确 定
          </el-button>
        </div>
      </el-dialog>
    </el-main>
    <el-footer>
      <el-row>
        <el-col :span="1">
          <el-switch
            v-model="cellOverflow"
            style="margin: 6px 0px"
          />
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
import { DeletePenalties, InsertPenalties, SelectPenalties, UpdatePenalties } from '@/api/Penalties';
import tableHeight from '@/views/mixin/tableHeight';
import { mapGetters } from 'vuex';

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
      tableData: [],
      cellOverflow: false
    };
  },
  computed: {
    ...mapGetters(['device'])
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
              ? this.$message.success(msg)
              : this.$message.error(msg);
            this.SelectPenalties();
          } catch (error) {
          } finally {
            this.listLoading = false;
          }
        })
        .catch((e) => {
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
              ? this.$message.success(msg)
              : this.$message.error(msg);
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
              ? this.$message.success(msg)
              : this.$message.error(msg);
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
  .el-header,
  .el-main,
  .el-footer {
    padding: 0;
    margin: 0;
  }

  .el-header {
    height: 30px !important;
  }
}
</style>
