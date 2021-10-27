<template>
  <el-container>
    <el-header height="20px">
      <el-form size="mini">
        <!--      配置数据源按钮，进行弹框-->
        <el-form-item>
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-circle-plus"
            @click="showConfig = true"
          >
            添加数据源
          </el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main>
      <el-table
        :data="DataBaseList"
        border
        height="650"
        style="width: 100%"
        size="mini"
        highlight-current-row
        :default-sort="{ prop: 'date', order: 'descending' }"
      >
        <el-table-column
          type="index"
          label="序号"
          align="center"
          width="50px"
        />
        <el-table-column prop="time" label="创建日期" align="center" sortable>
          <template slot-scope="{ row }">
            {{ row.time ? row.time.replace("T", " ") : "" }}
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          label="数据库类型"
          align="center"
          sortable
        />

        <el-table-column
          prop="sqlcon"
          label="数据库连接字符串"
          align="center"
        />
        <el-table-column prop="remarks" label="备注" align="center" />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="openEditDataSourceDia(scope.row)"
            >编辑
            </el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="deleteDataSourceDia(scope.row)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <!--      分页-->
      <div class="block">
        <el-pagination
          :page-sizes="pagination.pageSizes"
          :page-size="pagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.Total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-footer>
    <!--添加弹框-->
    <el-dialog :title="configDataTitle" :visible.sync="showConfig">
      <el-form
        ref="addDia"
        :model="dynamicValidateForm"
        :rules="rules"
        label-width="150px"
        status-icon
      >
        <el-form-item label="数据源类型">
          <el-select
            v-model="dynamicValidateForm.type"
            placeholder="请选择数据库"
            size="small"
            style="width: 30%"
            clearable
          >
            <el-option
              v-for="(item, index) in dataTypeList"
              :key="index"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="数据库连接字符串" prop="sqlcon">
          <el-input
            v-model="dynamicValidateForm.sqlcon"
            type="textarea"
            :rows="5"
            style="width: 60%"
            autosize
            size="small"
            clearable
          />
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input
            v-model="dynamicValidateForm.remarks"
            autosize
            style="width: 60%"
            size="small"
            clearable
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="showConfig = false">取消</el-button>
        <el-button
          v-if="addOrUpdate"
          type="primary"
          size="mini"
          :loading="DataSourceLoading"
          @click="addDataSource()"
        >确 定
        </el-button>
        <el-button
          v-else
          type="primary"
          size="mini"
          :loading="DataSourceLoading"
          @click="editDataSource()"
        >修改
        </el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import { DeleteConn, GetConn, InsertConn, SelectConn, UpdateConn } from '@/api/indicatorSet/I_Conn';

export default {
  data() {
    return {
      configDataTitle: '配置数据源', // 添加和编辑数据源的对话框的标题值
      rules: {
        DataBaseType: [
          { required: true, message: '请选择数据库类型', trigger: 'blur' }
        ],
        sqlcon: [
          {
            required: true,
            message: '请输入数据库连接字符串',
            trigger: 'blur'
          }
        ],
        Remark: [{ required: true, message: '请输入备注', trigger: 'blur' }]
      },
      dynamicValidateForm: {
        // 添加和编辑数据源的对话框数据
        conn_id: 0,
        type: '', // 数据库类型
        sqlcon: '', // 数据库连接字符串
        userid: '', // 创建人ID
        // time: '', // 创建时间
        remarks: '', // 备注
        DataBaseID: 0 // 数据源ID
      },
      dataTypeList: [
        'mysql',
        'sqlserver',
        'msssql',
        'sqlite',
        'oracle',
        'npgsq'
      ], // 数据库类型选择
      showConfig: false, // 默认添加配置数据源弹窗为隐藏
      DataSourceLoading: false, // 配置数据源确定按钮等待进度圈默认为关闭
      addOrUpdate: true, // 是显示添加的按钮还是修改的按钮，默认为添加按钮
      pickerOptions: {
        // 时间选择器的快捷选项
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      },
      value2: '',
      DataBaseList: [], // 数据源列表数据
      conn_id: '', // 修改单条数据源传的id
      listQuery: {
        // 分页数据
        pageIndex: 1,
        pageSize: 10
      },
      pagination: {
        // 分页数据
        pageIndex: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100, 150, 200],
        Total: null
      }
    };
  },
  created() {
    this.SelectDataBase();
  },
  methods: {
    // *添加数据源
    async addDataSource() {
      // 规则验证 addDia为表单标识
      await this.$refs.addDia.validate(async(valid) => {
        if (valid) {
          // 外层传给里层，拼接好传给后端
          try {
            this.DataSourceLoading = true; // 开启按钮提交的进度圈
            // 插入数据用InsertDataBase接口传
            const { code } = await InsertConn(this.dynamicValidateForm);
            // 如果返回码为200，则表示插入成功，其他则失败
            if (code === 200) {
              this.$message.success(
                '配置' + this.dynamicValidateForm.DataBaseType + '成功'
              );
              await this.SelectDataBase(); // 刷新数据源列表数据
              this.showConfig = false; // 成功则关闭对话框
              this.DataSourceLoading = false; // 关闭按钮提交的进度圈
            } else {
              this.$message.error('错误');
              this.DataSourceLoading = false; // 关闭按钮提交的进度圈
            }
          } catch (e) {
            console.log('因些原因配置失败!原因是' + e);
            this.DataSourceLoading = false; // 关闭按钮提交的进度圈
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // *查询数据源列表以及查询单条数据源
    async SelectDataBase() {
      try {
        // 编辑数据源时查询所点击的条目的数据
        // 当this.dataBaseID不为空，证明点了编辑按钮传有数据进来了，就进行单条查询，不然就查询全部
        if (this.conn_id !== '') {
          // 查询单条数据用SelectDataBase接口传
          const { code, data } = await GetConn({ conn_id: this.conn_id });
          // 更改数据源对话框标题
          this.configDataTitle = '修改数据源';
          // 如果返回码为200，则表示查询成功，其他则失败
          if (code === 200) {
            // 将获取的数据放在dynamicValidateForm中
            this.dynamicValidateForm = data;
            console.log(this.dynamicValidateForm);
            this.conn_id = ''; // 清空
          }
        } else {
          // 查询全部数据用SelectDataBase接口传
          const { code, data } = await SelectConn(this.listQuery);
          // 如果返回码为200，则表示查询成功，其他则失败
          if (code === 200) {
            // 将获取的数据放在DataBaseList中
            this.DataBaseList = data.DataList;
            // 分页总条数
            this.pagination.Total = data.Total;
          }
        }
      } catch (e) {
        console.log('因些原因加载失败!原因是' + e);
      }
    },
    // 打开数据源修改对话框进行操作
    openEditDataSourceDia(updata) {
      this.addOrUpdate = false; // 将添加按钮隐藏显示修改按钮
      this.showConfig = true; // 打开数据源修改对话框
      // 点击编辑按钮后，将所点击的条目的数据传过来先保存在updataItem
      this.conn_id = updata.conn_id;
      // 将该条目的数据显示在input中
      this.SelectDataBase();
    },
    // *编辑数据源列表，点击提交按钮进行更新条目
    async editDataSource() {
      // 规则验证 addDia为表单标识
      await this.$refs.addDia.validate(async(valid) => {
        if (valid) {
          this.DataSourceLoading = true; // 按钮等待进度圈开启
          try {
            // 使用UpdateDataBase接口更新
            const { code } = await UpdateConn(this.dynamicValidateForm);
            if (code === 200) {
              // 如果返回码为200代码更新成功，进行提示
              this.$message.success('更新成功');
              this.DataSourceLoading = false; // 按钮等待进度圈关闭
              // 关闭修改对话框
              this.showConfig = false;
              // 刷新页面
              await this.SelectDataBase();
            }
          } catch (e) {
            console.log('因某些原因更新失败，原因是' + e);
            this.DataSourceLoading = false; // 按钮等待进度圈关闭
          }
        } else {
          console.log('error submit!!');
          this.DataSourceLoading = false; // 按钮等待进度圈关闭
          return false;
        }
      });
    },
    // *删除单条数据源
    async deleteDataSourceDia(x) {
      this.$confirm(
        '此操作将永久删除数据库连接字符串为<' + x.sqlcon + '>的数据源',
        '是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(async() => {
          try {
            const { code } = await DeleteConn({ conn_id: x.conn_id });
            if (code === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.SelectDataBase(); // 刷新页面
            }
          } catch (e) {
            console.log(e);
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    // 数据源列表分页当前页
    handleCurrentChange(index) {
      this.listQuery.pageIndex = index;
      this.SelectDataBase();
    },
    // 数据源列表分页跳转页
    handleSizeChange(page) {
      this.listQuery.pageSize = page;
      this.SelectDataBase();
    }
  } // method方法尾部
};
</script>

<style lang="scss" scoped>
.el-container {
  .el-header {
    height: 20px;
    .el-form {
      margin-top: 5px;
      display: flex;
      align-content: center;
      justify-content: flex-start;
      .el-form-item {
      }

      .el-form-item:nth-child(2) {
        //margin-right: 2vh;
      }
    }
  }

  .el-main {
    //列表的格式
    .el-table {
      overflow: auto;
    }
  }
}

.el-icon-circle-plus-outline {
  // 添加按钮，字体颜色
  color: #1890ff;
}
</style>
