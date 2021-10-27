<template>
  <div class="reasonfordeduction">
    <el-card class="right-box-card">
      <div
        slot="header"
        class="clearfix"
      >
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
              @keyup.enter.native="clickSelectRC_Error()"
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
              @keyup.enter.native="clickSelectRC_Error()"
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
              @click="clickSelectRC_Error()"
            >搜索</el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="mini"
              @click="insetRC_ErrorData()"
            >新增</el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="mini"
              @click="TypeError"
            >扣分原因类型</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="content">
        <el-table
          ref="errorMultipleTable"
          v-loading="errorLoading"
          element-loading-text="拼命加载中"
          :data="RC_ErrorData"
          style="width: 100%"
          border
          size="mini"
          height="calc(100vh - 180px)"
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
            v-for="(itemType, indexType) in tableRC_ErrorTitle"
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
                size="small"
                @keyup.enter.native="finishEditClick()"
              />
              <span v-else>{{ row[itemType.prop] }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="TypeName"
            label="扣分类型"
            align="left"
            class="tableType"
            :show-overflow-tooltip="cellOverflow"
          >
            <template slot-scope="{row,$index}">
              <el-select
                v-if="currentEdit === $index"
                v-model="row.TypeID"
                clearable
                placeholder="请选择"
                size="mini"
              >
                <el-option
                  v-for="item in RC_ErrorTypeData"
                  :key="item.TypeID"
                  :label="item.TypeName"
                  :value="item.TypeID"
                />
              </el-select>
              <span v-else>{{ row.TypeName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="100"
          >
            <template slot-scope="scope">
              <el-button
                v-if="currentEdit === scope.$index"
                type="text"
                size="small"
                @click="finishEditClick(scope)"
              >完成</el-button>
              <el-button
                v-else
                type="text"
                size="small"
                @click="EditClick(scope)"
              >修改</el-button>
              <el-button
                v-if="currentEdit === scope.$index"
                type="text"
                size="small"
                @click="cancelRC_Error(scope)"
              >放弃</el-button>
              <el-button
                v-else
                type="text"
                size="small"
                @click="DeleteRC_Error(scope)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row>
          <el-col :span="1">
            <el-switch
              v-model="cellOverflow"
              style="margin: 6px 0px"
            />
          </el-col>
          <el-col :span="20">
            <el-pagination
              :current-page.sync="ErrorQuery.pageIndex"
              :page-sizes="[15, 20, 30, 40]"
              :page-size="ErrorQuery.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="ErrorQuery.total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </el-col>
        </el-row>

      </div>
      <el-dialog
        title="扣分原因类型"
        :visible.sync="DialogErrotType"
        :width="device === 'desktop' ? '60%' : '99%'"
        :top="device === 'desktop' ? '3%' : '0%'"
      >
        <el-form
          :inline="true"
          size="mini"
        >
          <el-form-item>
            <el-input
              v-model="selectRC_ErrorTypeVal.TypeName"
              placeholder="扣分原因类型"
              style="width: 200px"
              size="mini"
              clearable
              @keyup.enter.native="SelectRC_ErrorType()"
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
              @click="SelectRC_ErrorType()"
            >搜索</el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="mini"
              @click="insetRC_ErrorTypeData()"
            >新增</el-button>
          </el-form-item>
        </el-form>
        <el-table
          ref="errorMultipleTable"
          v-loading="errorLoading"
          element-loading-text="拼命加载中"
          :data="RC_ErrorTypeData"
          style="width: 100%"
          border
          size="mini"
          height="540"
        >
          <el-table-column
            type="index"
            label="序号"
            width="60"
            align="center"
            fixed="left"
          />
          <el-table-column
            prop="TypeName"
            label="扣分类型"
            align="left"
            class="tableType"
          >
            <template slot-scope="{row,$index}">
              <el-input
                v-if="currentEditType === $index"
                v-model="row.TypeName"
                size="small"
              />
              <span v-else>{{ row.TypeName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="100"
          >
            <template slot-scope="scope">
              <el-button
                v-if="currentEditType === scope.$index"
                type="text"
                size="small"
                @click="finishEditClickType(scope)"
              >完成</el-button>
              <el-button
                v-else
                type="text"
                size="small"
                @click="EditClickType(scope)"
              >修改</el-button>
              <el-button
                v-if="currentEditType === scope.$index"
                type="text"
                size="small"
                @click="cancelRC_ErrorType(scope)"
              >放弃</el-button>
              <el-popconfirm
                v-else
                confirm-button-text="是"
                cancel-button-text="否"
                icon="el-icon-info"
                icon-color="red"
                title="确定删除吗？"
                @confirm="DeleteRC_ErrorType(scope)"
              >
                <el-button
                  slot="reference"
                  type="text"
                  size="small"
                >删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page.sync="selectRC_ErrorTypeVal.pageIndex"
          :page-sizes="[15, 20, 30, 40]"
          :page-size="selectRC_ErrorTypeVal.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="selectRC_ErrorTypeVal.Total"
          @size-change="handleSizeChange2"
          @current-change="handleCurrentChange2"
        />
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {
  DeleteError,
  DeleteErrorType,
  InsertErrorType,
  InsertRC_Error,
  SelectRC_Error,
  SelectRC_ErrorType,
  UpdateErrorType,
  UpdateRC_Error
} from '@/api/RC_Error';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      errorLoading: '',
      RC_ErrorData: [],
      ErrorQuery: {
        total: 0,
        pageSize: 20,
        pageIndex: 1,
        ErrorContent: '',
        TypeName: ''
      },
      tableRC_ErrorTitle: [
        {
          title: '扣分内容',
          prop: 'ErrorContent'
        },
        {
          title: '扣分分数',
          prop: 'Grade',
          types: 'Number'
        },
        {
          title: '创建人',
          prop: 'CreateUser',
          disabled: true
        },

        {
          title: '创建时间',
          prop: 'CreateTime',
          disabled: true
        }
      ],
      currentEdit: -1,
      static: '',
      currentRow: '',
      /* 扣分原因类型 */
      DialogErrotType: false,
      RC_ErrorTypeData: [],
      selectRC_ErrorTypeVal: {
        pageIndex: 1,
        pageSize: 100,
        Total: 0,
        TypeName: ''
      },
      currentEditType: -1,
      statiType: '修改',
      cellOverflow: false


    };
  },
  computed: {
    ...mapGetters(['device', 'permission_routes'])
  },
  created() {
    this.SelectRC_Error();
    this.SelectRC_ErrorType();
  },
  methods: {
    async SelectRC_Error() {
      try {
        this.errorLoading = true;
        const { data } = await SelectRC_Error(this.ErrorQuery);
        this.ErrorQuery.total = data.Total;
        this.RC_ErrorData = data.DataList;
      } catch { }
      this.errorLoading = false;
    },
    async clickSelectRC_Error() {
      this.ErrorQuery.pageIndex = 1;
      this.SelectRC_Error();
    },

    Delete(row) {
      if (window.userInfo[0].UserName == '系统管理员') {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            DeleteTemplate({ TemplateID: row.TemplateID }).then((res) => {
              this.$message.success('删除成功!');
              this.SelectRC_Error();
            });
          })
          .catch(() => { });
      } else {
        this.$message.error('您不是管理员,没有权限删除');
      }
    },
    EditClick(scope) {
      this.currentEdit = scope.$index;
      this.currentRow = JSON.stringify(scope.row);
      this.static = '修改';
    },
    async finishEditClick(scope) {
      try {
        if (scope.row.Grade === '') {
          this.$message.warning('分数不能为空!');
          return;
        }
        if (this.static == '修改') {
          const val = {
            CreateUser: window.userInfo[0].UserName,
            ErrorContent: scope.row.ErrorContent,
            Grade: scope.row.Grade,
            ErrorID: scope.row.ErrorID,
            TypeID: scope.row.TypeID
          };
          const data = await UpdateRC_Error(val);
          if (data.code == 200) {
            this.currentEdit = -1;
            this.$message.success('修改成功');
          }
        } else {
          const val = {
            CreateUser: window.userInfo[0].UserName,
            ErrorContent: scope.row.ErrorContent,
            Grade: scope.row.Grade,
            TypeID: scope.row.TypeID
          };
          const data = await InsertRC_Error(val);
          this.currentEdit = -1;
          if (data.code == 200) {
            this.$message.success('新增成功');
            this.RC_ErrorData = [];
            this.ErrorQuery.pageIndex = 1;
            this.SelectRC_Error();
          }
        }
        this.SelectRC_Error();
      } catch (error) { }
    },
    insetRC_ErrorData() {
      if (this.RC_ErrorData.length > 0 && !this.RC_ErrorData[0].ErrorID) {
        return;
      }
      this.RC_ErrorData.unshift({
        CreateUser: window.userInfo[0].UserName,
        ErrorContent: '',
        Grade: 0,
        CreateTime: ''
      });
      // 编辑当前行
      // this.currentEdit = this.RC_ErrorData.length - 1;
      this.currentEdit = 0;
      this.static = '新增';
    },
    cancelRC_Error(scope) {
      this.currentEdit = -1;
      this.$nextTick(() => {
        if (scope.row.ErrorID) {
          const obj = JSON.parse(this.currentRow);
          scope.row.Grade = obj.Grade;
          scope.row.ErrorContent = obj.ErrorContent;
        } else this.RC_ErrorData.shift();
      });
    },
    DeleteRC_Error(scope) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          DeleteError({ ErrorID: scope.row.ErrorID })
            .then((res) => {
              this.$message.success('删除成功!');
              this.SelectRC_Error();
            })
            .catch(() => { });
        })
        .catch(() => { });
    },
    handleSizeChange(val) {
      this.ErrorQuery.pageSize = val;
      this.SelectRC_Error();
    },
    handleCurrentChange(val) {
      this.ErrorQuery.pageIndex = val;
      this.SelectRC_Error();
    },

    /* 扣分原因类型 */
    async TypeError() {
      this.DialogErrotType = true;
      this.SelectRC_ErrorType();
    },

    async SelectRC_ErrorType() {
      try {
        const { data } = await SelectRC_ErrorType(this.selectRC_ErrorTypeVal);
        this.RC_ErrorTypeData = data.DataList;
        this.selectRC_ErrorTypeVal.Total = data.Total;
      } catch (error) {

      }
    },
    handleSizeChange2(val) {
      this.selectRC_ErrorTypeVal.pageSize = val;
      this.SelectRC_ErrorType();
    },
    handleCurrentChange2(val) {
      this.selectRC_ErrorTypeVal.pageIndex = val;
      this.SelectRC_ErrorType();
    },
    async finishEditClickType(scope) {
      try {
        if (this.statiType === '修改') {
          const { code } = await UpdateErrorType({
            TypeID: scope.row.TypeID,
            TypeName: scope.row.TypeName
          });
          code === 200 ? this.$message.success('更新成功!') : this.$message.warning('更新失败');
        } else {
          const { code } = await InsertErrorType({ TypeName: scope.row.TypeName });
          code === 200 ? this.$message.success('新增成功!') : this.$message.warning('新增失败');
        }
        this.SelectRC_ErrorType();
        this.currentEditType = -1;
      } catch (error) {

      }
    },
    EditClickType(scope) {
      this.currentEditType = scope.$index;
      this.statiType = '修改';
    },
    cancelRC_ErrorType(scope) {
      if (this.statiType === '新增') {
        this.RC_ErrorTypeData.splice(scope.$index, 1);
      }
      this.currentEditType = -1;
    },
    async DeleteRC_ErrorType(scope) {
      try {
        const { code } = await DeleteErrorType({
          TypeID: scope.row.TypeID
        });
        code === 200 ? this.$message.success('删除成功!') : this.$message.warning('删除失败');
        this.SelectRC_ErrorType();
      } catch (error) {

      }
    },
    insetRC_ErrorTypeData() {
      this.statiType = '新增';
      if (this.RC_ErrorTypeData.length > 0 && !this.RC_ErrorTypeData[0].TypeID) {
        return;
      }
      this.RC_ErrorTypeData.unshift({
        TypeName: ''
      });
      this.currentEditType = 0;
    },
    async InsertErrorType() {

    }
  }
};
</script>
<style lang="scss">
.reasonfordeduction {
  .el-card__header {
    padding-bottom: 0px !important;
    border-bottom: 0px !important;
  }
  .el-card__body {
    padding: 5px 0px 0px 5px;
  }
  .el-table {
    height: calc(100vh - 180px) !important;
  }
}
</style>
