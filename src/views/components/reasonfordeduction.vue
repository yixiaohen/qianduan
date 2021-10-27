<template>
  <!-- 扣分原因组件 -->
  <el-container class="reasonfordeduction">
    <el-header>
      <el-form
        :inline="true"
        :model="ErrorQuery"
        size="mini"
      >
        <el-form-item>
          <el-input
            v-model="ErrorQuery.ErrorContent"
            placeholder="扣分内容"
            style="width: 200px"
            size="mini"
            clearable
            @keyup.enter.native="SelectRC_Error()"
          ><i
            slot="prefix"
            class="el-input__icon el-icon-search"
          /></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="ErrorQuery.TypeName"
            placeholder="扣分原因类型"
            style="width: 200px"
            size="mini"
            clearable
            @keyup.enter.native="SelectRC_Error()"
          ><i
            slot="prefix"
            class="el-input__icon el-icon-search"
          /></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="SelectRC_Error()"
          >搜索
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="mini"
            @click="insetRC_ErrorData()"
          >新增
          </el-button>
        </el-form-item>
        <el-form-item> 总条数{{ ErrorQuery.Total }}</el-form-item>
      </el-form>
    </el-header>
    <el-main>
      <el-table
        ref="RC_ErrorMultipleTable"
        v-loading="errorLoading"
        v-el-table-infinite-scroll="load"
        element-loading-spinner="el-icon-loading"
        :row-key="getRowKey"
        :data="tableData"
        border
        height="calc(100vh - 360px)"
        size="mini"
        class="infinite-list"
        @selection-change="handleSelectionChange"
        @select-all="handleSelectionChangeAll"
        @select="selectRow"
      >
        <el-table-column
          type="selection"
          width="40"
          align="center"
        />
        <el-table-column
          type="index"
          label="序号"
          width="50"
          align="center"
        />
        <el-table-column
          prop="ErrorContent"
          label="扣分内容"
          width="300"
        >
          <template slot-scope="{ row, $index }">
            <el-input
              v-if="currentEdit === $index"
              v-model="row.ErrorContent"
              size="small"
            />
            <span v-else>{{ row.ErrorContent }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="Grade"
          label="分数"
          width="100"
          align="center"
        >
          <template slot-scope="{ row, $index }">
            <el-input
              v-if="currentEdit === $index"
              v-model="row.Grade"
              size="small"
              type="Number"
            />
            <span v-else>{{ row.Grade }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="TypeName"
          label="扣分类型"
          width="130"
          align="center"
        >
          <template slot-scope="{ row, $index }">
            <el-select
              v-model="row.TypeID"
              clearable
              placeholder="请选择"
              size="mini"
              :disabled="currentEdit != $index"
            >
              <el-option
                v-for="item in RC_ErrorTypeData"
                :key="item.TypeID"
                :label="item.TypeName"
                :value="item.TypeID"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          prop="CreateUser"
          label="创建人"
          width="100"
        />
        <el-table-column
          prop="CreateTime"
          label="创建时间"
          width="150"
        />
        <el-table-column
          label="操作"
          width="100"
          align="center"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              v-if="currentEdit === scope.$index"
              type="text"
              size="small"
              @click="finishEditClick(scope)"
            >完成
            </el-button>
            <el-button
              v-else
              type="text"
              size="small"
              @click="EditClick(scope)"
            >修改
            </el-button>
            <el-button
              v-if="currentEdit === scope.$index"
              type="text"
              size="small"
              @click="cancelRC_Error(scope)"
            >放弃
            </el-button>
            <el-popconfirm
              v-else
              onfirm-button-text="是"
              cancel-button-text="否"
              icon="el-icon-info"
              icon-color="red"
              title="确定删除吗？"
              @confirm="DeleteRC_Error(scope)"
            >
              <el-button
                slot="reference"
                type="text"
                size="small"
              >删除
              </el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>
<script>
import { DeleteError, InsertRC_Error, SelectRC_Error, SelectRC_ErrorType, UpdateRC_Error } from '@/api/RC_Error';
import elTableInfiniteScroll from 'el-table-infinite-scroll';

export default {
  directives: {
    'el-table-infinite-scroll': elTableInfiniteScroll
  },
  props: {
    /* 只能增不能减 */
    switchs: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tableData: [],
      RC_ErrorTypeData: [],
      ErrorQuery: {
        ErrorContent: '',
        TypeName: '',
        ErrorIDs: [],
        pageIndex: 1,
        pageSize: 50,
        Total: 0
      },
      selectRC_ErrorTypeVal: {
        pageIndex: 1,
        pageSize: 200,
        Total: 0,
        TypeName: ''
      },
      currentEdit: -1,
      errorLoading: false,
      static: '',
      selectd: []
    };
  },
  created() {
    this.SelectRC_ErrorType();
  },
  methods: {
    async insetRC_ErrorData() {
      this.tableData.unshift({
        CreateUser: window.userInfo[0].UserName,
        ErrorContent: '',
        Grade: '',
        CreateTime: '',
        TypeName: ''
      });
      // 编辑当前行
      this.currentEdit = 0;
      this.static = '新增';
    },
    async DeleteRC_Error(scope) {
      const { code } = await DeleteError({ ErrorID: scope.row.ErrorID });
      code === 200
        ? this.$message.success('删除成功')
        : this.$message.error('删除失败');
      this.ErrorQuery.pageIndex = 1;
      this.tableData = [];
      this.SelectRC_Error();
    },
    async EditClick(scope) {
      this.static = '修改';
      this.currentEdit = scope.$index;
    },
    async finishEditClick(scope) {
      const row = scope.row;
      if (!row.ErrorContent || !row.Grade === '') {
        this.$message.warning('内容，分数，不能为空！');
        return;
      }
      if (this.static === '新增') {
        const { code } = await InsertRC_Error(scope.row);
        code === 200
          ? this.$message.success('新增成功')
          : this.$message.error('新增失败');
        this.currentEdit = -1;
        this.SelectRC_Error();
      } else {
        const { code } = await UpdateRC_Error(scope.row);
        code === 200
          ? this.$message.success('修改成功')
          : this.$message.error('修改失败');
        this.currentEdit = -1;
        this.SelectRC_Error();
      }
    },
    cancelRC_Error() {
      this.currentEdit = -1;
    },
    async SelectRC_Error() {
      try {
        this.errorLoading = true;
        if (this.ErrorQuery.ErrorContent || this.ErrorQuery.TypeName) {
          this.ErrorQuery.pageIndex = 1;
          this.tableData = [];
        }
        /* 默认选中的 */
        this.selectd =
          Object.prototype.toString.call(this.ErrorQuery.ErrorIDs) ==
          '[object Array]'
            ? this.ErrorQuery.ErrorIDs
            : typeof this.ErrorQuery.ErrorIDs === 'string'
              ? this.ErrorQuery.ErrorIDs.split(',')
              : typeof this.ErrorQuery.ErrorIDs === 'number'
                ? [this.ErrorQuery.ErrorIDs]
                : this.ErrorQuery.ErrorIDs;
        /* 类型判断 */
        this.ErrorQuery.ErrorIDs =
          Object.prototype.toString.call(this.ErrorQuery.ErrorIDs) ==
          '[object Array]'
            ? this.ErrorQuery.ErrorIDs.join(',')
            : this.ErrorQuery.ErrorIDs;

        const { data } = await SelectRC_Error(this.ErrorQuery);
        this.tableData = this.tableData.concat(data.DataList);
        this.ErrorQuery.Total = data.Total;
        this.$nextTick(() => {
          this.$refs.RC_ErrorMultipleTable.clearSelection();
          if (this.selectd.length > 0) {
            this.tableData.map(item => {
              this.selectd.map(item2 => {
                if (item.ErrorID == item2) {
                  this.$refs.RC_ErrorMultipleTable.toggleRowSelection(
                    item,
                    true
                  );
                }
              });
            });
          }
        });
      } catch (error) {
        console.log(error);
      }
      this.errorLoading = false;
    },
    async SelectRC_ErrorType() {
      try {
        const { data } = await SelectRC_ErrorType(this.selectRC_ErrorTypeVal);
        this.RC_ErrorTypeData = data.DataList;
        this.selectRC_ErrorTypeVal.Total = data.Total;
      } catch (error) {
        console.log(error);
      }
    },
    handleSelectionChange(row) {
      this.$emit('handleSelectionChange', row);
    },
    handleSelectionChangeAll(selection) {
      /* 默认选中的 */
      if (this.switchs) {
        this.selectd =
          Object.prototype.toString.call(this.ErrorQuery.ErrorIDs) ==
          '[object Array]'
            ? this.ErrorQuery.ErrorIDs
            : typeof this.ErrorQuery.ErrorIDs === 'string'
              ? this.ErrorQuery.ErrorIDs.split(',')
              : typeof this.ErrorQuery.ErrorIDs === 'number'
                ? [this.ErrorQuery.ErrorIDs]
                : this.ErrorQuery.ErrorIDs;
        this.tableData.map(item => {
          this.selectd.map(item2 => {
            if (item.ErrorID == item2) {
              this.$refs.RC_ErrorMultipleTable.toggleRowSelection(item, true);
            }
          });
        });
      }
    },
    selectRow(selection, row) {
      if (this.switchs) {
        this.selectd.map(item => {
          if (item == row.ErrorID) {
            this.$message.warning('只能增加不能取消原来的选项哦！');
            this.$refs.RC_ErrorMultipleTable.toggleRowSelection(row, true);
          }
        });
      }
    },
    load() {
      if (
        this.ErrorQuery.pageIndex <=
        this.ErrorQuery.Total / this.ErrorQuery.pageSize
      ) {
        this.ErrorQuery.pageIndex++;
        this.SelectRC_Error();
      }
    },
    getRowKey({ ErrorID }) {
      return ErrorID;
    },
    async getSelected(Selected, PermissionSwitch = false) {
      this.switchs = PermissionSwitch;
      /* Selected 默认选中的 */
      this.ErrorQuery.pageIndex = 1;
      this.ErrorQuery.ErrorIDs = Selected;
      this.tableData = [];
      this.SelectRC_Error();
    }
  }
};
</script>
<style lang="scss">
.reasonfordeduction {
  .el-header {
    padding: 0;
    height: 40px !important;
  }

  .el-main {
    padding: 0px 0px;
    height: calc(100vh - 350px) !important;
  }
}
</style>
