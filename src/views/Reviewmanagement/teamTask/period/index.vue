<template>
  <el-card
    style="margin: 10px;"
  >
  <el-container class="Period">



    <el-header>
      <el-form
        label-position="left"
        :inline="true"
        size="mini"
      >
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-circle-plus"
            size="mini"
            @click="addCurrent"
          >添加批次</el-button>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="listQuery.condition"
            placeholder="批次名"
            style="width: 200px"
            size="mini"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="info"
            icon="el-icon-search"
            :loading="listLoading"
            size="mini"
            @click="clickSelectPeriod()"
          >搜索</el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main>
      <el-table
        v-loading="listLoading"
        :data="tableData"
        border
        style="width: 100%"
        size="mini"
        height="calc(100vh - 200px)"
      >
        <el-table-column
          type="index"
          label="序号"
          width="60"
          align="center"
        />
        <el-table-column
          prop="PeriodName"
          label="批次名"
        />
        <el-table-column
          prop="StartTime"
          label="开始时间"

        >
          <template slot-scope="scope">
            {{ scope.row.StartTime.split("T").join(" ") }}
          </template>
        </el-table-column>
        <el-table-column
          prop="EndTime"
          label="结束时间"

        >
          <template slot-scope="scope">
            {{ scope.row.EndTime.split("T").join(" ") }}
          </template>
        </el-table-column>
        <el-table-column
          prop="Status"
          label="状态"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag
              size="mini"
              :type="
                scope.row.Status === 0
                  ? 'warning'
                  : scope.row.Status === 1
                    ? 'success'
                    : 'danger'
              "
            >
              {{
                scope.row.Status === 0
                  ? "未开启"
                  : scope.row.Status === 1
                    ? "已开启"
                    : "已结束"
              }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="150"
          align="center"
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
        :close-on-click-modal="false"
        :title="title"
        :visible.sync="dialogVisible"
        :width="device === 'desktop' ? '50%' : '90%'"
        @closed="$refs.FormData.resetFields()"
      >
        <el-form
          ref="FormData"
          label-position="left"
          :model="FormData"
          :rules="rules"
          size="mini"
          label-width="80px"
        >
          <el-form-item
            label="批次名"
            prop="PeriodName"
          >
            <el-input v-model="FormData.PeriodName" />
          </el-form-item>
          <el-form-item
            label="开始时间"
            prop="StartTime"
          >
            <el-date-picker
              v-model="FormData.StartTime"
              type="datetime"
              clearable
              value-format="yyyy-MM-ddThh:mm:ss"
              placeholder="选择开始时间"
            />
          </el-form-item>
          <el-form-item
            label="结束时间"
            prop="EndTime"
          >
            <el-date-picker
              v-model="FormData.EndTime"
              type="datetime"
              value-format="yyyy-MM-ddThh:mm:ss"
              clearable
              placeholder="选择结束时间"
            />
          </el-form-item>
          <el-form-item
            label="状态"
            prop="Status"
          >
            <el-select
              v-model="FormData.Status"
              placeholder="请选择"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            size="mini"
            @click="dialogVisible = false"
          >取 消</el-button>
          <el-button
            type="primary"
            size="mini"
            @click="title === '添加批次' ? InsertPeriod() : UpdatePeriod()"
          >确 定</el-button>
        </span>
      </el-dialog>
    </el-main>
    <el-footer>
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
    </el-footer>

  </el-container>
  </el-card>
</template>

<script>
import { DeletePeriod, InsertPeriod, SelectPeriod, UpdatePeriod } from '@/api/period';
import tableHeight from '@/views/mixin/tableHeight';
import { mapGetters } from 'vuex';

export default {
  name: 'Period',
  mixins: [tableHeight],
  data() {
    return {
      title: '',
      listLoading: true,
      tableData: [],
      dialogVisible: false,
      FormData: {
        PeriodName: '',
        StartTime: '',
        EndTime: '',
        Status: 0,
        PeriodID: 0
      },
      listQuery: {
        pageIndex: 1,
        pageSize: 15,
        condition: ''
      },
      options: [
        {
          value: 0,
          label: '未开启'
        },
        {
          value: 1,
          label: '已开启'
        },
        {
          value: 2,
          label: '已结束'
        }
      ],
      pagination: {
        pageIndex: 1,
        total: 0,
        pageSize: 50,
        pageSizes: [15, 20, 50, 100, 150, 200]
      },
      rules: {
        PeriodName: [
          { required: true, message: '请输入批次名称', trigger: 'blur' }
        ],
        valueTime: [{ required: true, message: '请选择时间', trigger: 'blur' }],
        StartTime: [
          { required: true, message: '请选择开始日期', trigger: 'change' }
        ],
        EndTime: [
          { required: true, message: '请选择结束日期', trigger: 'change' }
        ],
        Status: [{ required: true, message: '请选择状态', trigger: 'blur' }]
      }
    };
  },
  computed: {
    ...mapGetters(['device'])
  },
  created() {
    this.SelectPeriod();
  },
  methods: {
    deleteRow(row) {
      this.$confirm(`此操作将永久删除 ${row.PeriodName} , 是否继续?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          try {
            const { code } = await DeletePeriod({ PeriodID: row.PeriodID });
            code === 200
              ? this.$message({
                type: 'success',
                message: '删除成功!'
              })
              : this.$message({
                type: 'error',
                message: '删除失败!'
              });
            this.SelectPeriod();
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
    UpdatePeriod() {
      this.$refs.FormData.validate(async(v) => {
        if (v) {
          const fromData = this.FormData;
          try {
            const { msg } = await UpdatePeriod(fromData);
            this.$message({
              type: 'success',
              message: msg
            });
            this.SelectPeriod();
          } catch (error) {
          } finally {
            this.dialogVisible = false;
          }
        }
      });
    },
    editRow(row) {
      row = JSON.parse(JSON.stringify(row));
      this.title = '编辑批次';
      this.FormData = {
        PeriodName: row.PeriodName,
        StartTime: row.StartTime,
        EndTime: row.EndTime,
        Status: row.Status,
        PeriodID: row.PeriodID
      };
      this.dialogVisible = true;
    },
    async SelectPeriod() {
      try {
        const { data } = await SelectPeriod(this.listQuery);
        this.tableData = data.DataList;
        this.pagination.total = data.Total;
      } catch (error) {
      } finally {
        this.listLoading = false;
      }
    },
    async clickSelectPeriod() {
      this.listLoading = true;
      this.listQuery.pageIndex = 1;
      this.pagination.pageIndex = 1;
      this.SelectPeriod();
    },
    handleCurrentChange(index) {
      this.listLoading = true;
      this.listQuery.pageIndex = index;
      this.SelectPeriod();
    },
    handleSizeChange(page) {
      this.listLoading = true;
      this.listQuery.pageSize = page;
      this.clickSelectPeriod();
    },
    InsertPeriod() {
      this.$refs.FormData.validate(async(v) => {
        if (v) {
          const fromData = this.FormData;
          try {
            const { msg } = await InsertPeriod(fromData);
            this.$message({
              type: 'success',
              message: msg
            });
            this.SelectPeriod();
          } catch (error) {
          } finally {
            this.dialogVisible = false;
          }
        }
      });
    },
    addCurrent() {
      this.title = '添加批次';
      this.FormData = {
        PeriodName: '',
        StartTime: '',
        EndTime: '',
        Status: 0,
        PeriodID: 0
      };
      this.dialogVisible = true;
    }
  }
};
</script>

<style lang="scss">
.Period {
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

