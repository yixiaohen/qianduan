<template>
  <el-card style="margin: 10px;width: 98%;height: 87vh;overflow: auto">
    <div
      style="width: 100%;
          background-color:#f4f4f5;
          display: inline-block;
          height: 32px;
          line-height: 32px;"
    >
      <el-form :inline="true" size="mini" class="demo-form-inline">
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-circle-plus"
            @click="add1"
          >新增
          </el-button>
        </el-form-item>
        <el-divider direction="vertical"/>
        <el-form-item>
          <el-input
            v-model="form.Category"
            placeholder="类别"
            @keyup.enter.native="SelectNorm('搜索')"
          />
        </el-form-item>
        <el-divider direction="vertical"/>
        <el-form-item>
          <el-input
            v-model="form.ProjectContent"
            placeholder="检查项目"
            @keyup.enter.native="SelectNorm('搜索')"
          />
        </el-form-item>
        <el-divider direction="vertical"/>
        <el-form-item>
          <el-input
            v-model="form.Content"
            placeholder="检查内容"
            @keyup.enter.native="SelectNorm('搜索')"
          />
        </el-form-item>
        <el-divider direction="vertical"/>
        <el-form-item>
          <el-button
            icon="el-icon-search"
            type="primary"
            @click="SelectNorm('搜索')"
          >搜索
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      ref="errorMultipleTable"
      v-loading="Loading"
      class="main"
      :data="tableData"
      style="width: 100%;margin-top: 10px"
      border
      highlight-current-row
      :header-cell-style="{'text-align':'center'}"
      :cell-style="{'text-align':'center'}"
      height="calc(100vh - 240px)"
      size="small"
      stripe
    >
      <el-table-column
        type="index"
        label="序号"
        width="60"
        align="center"
        fixed="left"
      />
      <el-table-column
        v-for="(itemType, indexType) in tableTitle"
        :key="indexType"
        :prop="itemType.prop"
        :label="itemType.title"
        align="left"
        class="tableType"
        :show-overflow-tooltip="cellOverflow"
      >
        <template slot-scope="{ row, $index }">
          <el-input
            v-if="currentEdit === $index"
            v-model="row[itemType.prop]"
            :disabled="itemType.disabled"
            :type="itemType.types"
            @keyup.enter.native="InsertRC_Error(row)"
          />
          <span v-else>{{ row[itemType.prop] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="扣分原因"
        prop="ErrorContent"
        width="200"
        :show-overflow-tooltip="cellOverflow"
      >
        <template slot-scope="{ row }">
          <div v-html="row.ErrorContent"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-button
            v-if="currentEdit === scope.$index"
            type="success"
            size="mini"
            @click="InsertNorm(scope.row)"
          >完成
          </el-button>
          <el-button
            v-if="currentEdit === scope.$index"
            type="warning"
            size="mini"
            @click="giveUp"
          >放弃
          </el-button>

          <el-button
            v-else
            type="info"
            size="mini"
            class="el-icon-edit"
            @click="EditClick(scope)"
          ></el-button>
          <el-button
            v-if="currentEdit !== scope.$index"
            type="success"
            size="mini"
            class="el-icon-thumb"
            @click="SelectContent(scope)"
          ></el-button>
          <el-button
            v-if="currentEdit !== scope.$index"
            type="danger"
            size="mini"
            class="el-icon-delete"
            @click="DeleteNorm(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <el-col :span="1">
        <el-switch v-model="cellOverflow" style="margin: 6px 0px"/>
      </el-col>
      <el-col :span="20">
        <el-pagination
          background
          style="margin-top: 10px"
          :current-page="form.pageIndex"
          :page-sizes="[15, 20, 30, 40, 50, 100]"
          :page-size="form.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="form.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-col>
    </el-row>

    <!-- 扣分原因 -->
    <el-dialog
      :width="device === 'desktop' ? '60%' : '99%'"
      title="选择扣分原因"
      :close-on-click-modal="false"
      destroy-on-close
      :visible.sync="dialogRC_Error"
    >
      <reasonfordeduction
        ref="reasonfordeduction"
        @handleSelectionChange="handleSelectionChange"
      />
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogRC_Error = false">取 消</el-button>
        <el-button
          type="primary"
          size="mini"
          @click="getErrorSelection()"
        >确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>
<script>
import { DeleteNorm, InsertNorm, SelectNorm, UpdateNorm } from '@/api/norm';
import reasonfordeduction from '@/views/components/reasonfordeduction';
import { mapGetters } from 'vuex';

export default {
  name: 'Norm',
  components: {
    reasonfordeduction
  },
  data() {
    return {
      form: {
        Category: '',
        ProjectContent: '',
        Content: '',
        pageSize: 15,
        pageIndex: 1,
        total: 0
      },
      tableData: [],
      tableTitle: [
        {
          title: '类别',
          prop: 'Category',
          width: 50
        },
        {
          title: '检查项目',
          prop: 'ProjectContent',
          width: 70
        },
        {
          title: '检查内容',
          prop: 'Content',
          width: 100
        }
      ],
      currentEdit: -1,
      EditClickError: {
        EditClickIndex: 0,
        Category: '',
        ProjectContent: '',
        Content: '',
        ErrorIDArray: [],
        NormID: '',
        ErrorContent: ''
      },
      Loading: false,
      static: '',
      /* 扣分原因参数 */
      dialogRC_Error: false,
      ErrorQuery: {
        ErrorIDs: ''
      },
      cellOverflow: false
    };
  },
  created() {
    this.SelectNorm();
  },
  computed: {
    ...mapGetters(['device'])
  },
  methods: {
    async SelectNorm(value) {
      try {
        this.Loading = true;
        this.form.pageIndex = value == '搜索' ? 1 : this.form.pageIndex;
        const { data } = await SelectNorm(this.form);
        this.tableData = data.DataList;
        this.form.total = data.Total;
      } catch (error) {
      }
      this.Loading = false;
    },
    handleSizeChange(val) {
      this.form.pageSize = val;
      this.currentEdit = -1; // 换页要把input隐藏
      this.SelectNorm();
    },
    handleCurrentChange(val) {
      this.form.pageIndex = val;
      this.currentEdit = -1; // 换页要把input隐藏
      this.SelectNorm();
    },
    // 新增指标
    add1() {
      // 防止多次点击新增按钮
      if (this.currentEdit === 0 && this.static === '新增') {
        this.$message.warning('已处于编辑状态');
      } else {
        // 在第一条增加空的一条
        this.tableData.unshift({
          Category: '',
          ProjectContent: '',
          Content: '',
          ErrorIDs: [],
          NormID: ''
        });
        this.currentEdit = 0;
        console.log('我点击了');
        this.static = '新增';
      }

    },
    // 完成按钮
    async InsertNorm(row) {
      try {
        const val = {
          Category: row.Category,
          ProjectContent: row.ProjectContent,
          Content: row.Content,
          ErrorIDArray: this.EditClickError.ErrorIDArray,
          NormID: 0
        };
        if (this.static === '修改') {
          val.NormID = row.NormID;
          const { data, code } = await UpdateNorm(val);
          code === 200
            ? (this.currentEdit = -1)
            : this.$message.error('修改失败');
        } else {
          const { data, code } = await InsertNorm(val);
          if (code === 200) {
            this.currentEdit = -1;
          } else {
            this.$message.error('新增失败');
            this.currentEdit = -1;
          }
        }
      } catch (error) {
        this.currentEdit = -1;
      }
      await this.SelectNorm();
    },
    // 放弃按钮
    giveUp() {
      if (this.static === '新增') {
        this.tableData.shift();
      }
      this.currentEdit = -1;
    },
    DeleteNorm(row) {
      this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          DeleteNorm({
            NormID: row.NormID
          })
            .then(res => {
              this.SelectNorm();
              this.$message.success('删除成功');
            })
            .catch(error => {
              this.$message.error('删除失败');
            });
        })
        .catch(() => {
        });
    },
    EditClick(scope) {
      this.EditClickError.ErrorIDArray =
        scope.row.ErrorIDs == null ? [] : scope.row.ErrorIDs.split(',');
      this.currentEdit = scope.$index;
      this.static = '修改';
    },
    /* 扣分原因 */
    SelectContent(scope) {
      this.ErrorQuery.ErrorIDs =
        scope.row.ErrorIDs == null ? '' : scope.row.ErrorIDs;
      this.EditClickError.Category = scope.row.Category;
      this.EditClickError.ProjectContent = scope.row.ProjectContent;
      this.EditClickError.Content = scope.row.Content;
      this.EditClickError.EditClickIndex = scope.$index;
      this.EditClickError.ErrorIDArray =
        scope.row.ErrorIDs == null ? [] : scope.row.ErrorIDs.split(',');
      this.EditClickError.NormID =
        scope.row.NormID == '' ? '' : scope.row.NormID;
      this.dialogRC_Error = true;
      this.$nextTick(() => {
        /* 传默认勾选的值给组件 */
        this.$refs.reasonfordeduction.getSelected(this.ErrorQuery.ErrorIDs);
      });
    },
    handleSelectionChange(value) {
      this.$nextTick(() => {
        this.EditClickError.ErrorIDArray = value.map((item, index) => {
          return item.ErrorID;
        });
      });
    },
    async getErrorSelection() {
      try {
        if (this.currentEdit == -1) {
          const data = await UpdateNorm(this.EditClickError);
          if (data.code == 200) {
            this.currentEdit = -1;
            this.$message.success('修改成功');
          }
          this.SelectNorm();
          this.dialogRC_Error = false;
        } else {
          this.dialogRC_Error = false;
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>
<style lang="scss">
@import "src/styles/loading.scss";

.norm {
  .el-header {
    padding: 3px 0px;
    height: 40px !important;
  }

  .el-main {
    padding: 0px 0px;

    .main {
      height: calc(100vh - 180px) !important;
    }
  }

  .el-table__body-wrapper {
    overflow: auto !important;
    position: relative;
  }

  .el-loading-spinner {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    -webkit-animation: typing 1s linear infinite alternate;
    -moz-animation: Typing 1s linear infinite alternate;
    animation: typing 1s linear infinite alternate;
    margin: 0px auto; /* Not necessary- its only for layouting*/
    position: relative;
    left: -40px;
  }

  @-webkit-keyframes typing {
    0% {
      background-color: rgba(247, 111, 73, 1);
      box-shadow: 40px 0px 0px 0px rgba(247, 111, 73, 0.2),
      80px 0px 0px 0px rgba(247, 111, 73, 0.2);
    }
    25% {
      background-color: rgba(247, 111, 73, 0.4);
      box-shadow: 40px 0px 0px 0px rgba(247, 111, 73, 2),
      80px 0px 0px 0px rgba(247, 111, 73, 0.2);
    }
    75% {
      background-color: rgba(247, 111, 73, 0.4);
      box-shadow: 40px 0px 0px 0px rgba(247, 111, 73, 0.2),
      80px 0px 0px 0px rgba(247, 111, 73, 1);
    }
  }

  @-moz-keyframes typing {
    0% {
      background-color: rgba(247, 111, 73, 1);
      box-shadow: 40px 0px 0px 0px rgba(247, 111, 73, 0.2),
      80px 0px 0px 0px rgba(247, 111, 73, 0.2);
    }
    25% {
      background-color: rgba(247, 111, 73, 0.4);
      box-shadow: 40px 0px 0px 0px rgba(247, 111, 73, 2),
      80px 0px 0px 0px rgba(247, 111, 73, 0.2);
    }
    75% {
      background-color: rgba(247, 111, 73, 0.4);
      box-shadow: 40px 0px 0px 0px rgba(247, 111, 73, 0.2),
      80px 0px 0px 0px rgba(247, 111, 73, 1);
    }
  }
  @keyframes typing {
    0% {
      background-color: rgba(247, 111, 73, 1);
      box-shadow: 40px 0px 0px 0px rgba(247, 111, 73, 0.2),
      80px 0px 0px 0px rgba(247, 111, 73, 0.2);
    }
    25% {
      background-color: rgba(247, 111, 73, 0.4);
      box-shadow: 40px 0px 0px 0px rgba(247, 111, 73, 2),
      80px 0px 0px 0px rgba(247, 111, 73, 0.2);
    }
    75% {
      background-color: rgba(0, 184, 220, 0.4);
      box-shadow: 40px 0px 0px 0px rgba(249, 54, 0, 0.2),
      80px 0px 0px 0px rgb(2, 243, 130);
    }
  }

  .el-loading-spinner .circular {
    display: none; //隐藏之前element-ui默认的loading动画
  }
}
</style>
