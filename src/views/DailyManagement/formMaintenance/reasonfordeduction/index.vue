<template>

  <el-card style="margin: 10px;width: 98%;height: 87vh;overflow: auto">

    <div
      style="width: 100%;
          background-color:#f4f4f5;
          display: inline-block;
          height: 32px;
          line-height: 32px;"
    >
      <el-form
        :inline="true"
        :model="ErrorQuery"
        size="mini"
      >

        <el-form-item>
          <el-button
            type="primary"
            size="mini"
            @click="insetRC_ErrorData()"
          >新增
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="mini"
            @click="TypeError"
          >扣分原因类型
          </el-button>
        </el-form-item>
        <el-divider direction="vertical"/>
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
        <el-divider direction="vertical"/>
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
        <el-divider direction="vertical"/>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="clickSelectRC_Error()"
          >搜索
          </el-button>
        </el-form-item>

      </el-form>
    </div>

    <el-table
      ref="errorMultipleTable"
      v-loading="errorLoading"
      highlight-current-row
      :data="RC_ErrorData"
      style="width: 100%;margin-top: 10px"
      border
      :header-cell-style="{'text-align':'center'}"
      :cell-style="{'text-align':'center'}"
      size="small"
      height="calc(100vh - 240px)"
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
        prop="DeptName"
        label="所属科室"
        align="left"
        class="tableType"
        :show-overflow-tooltip="cellOverflow"
      >
        <template slot-scope="{ row ,$index}">
          <span v-if="currentEdit !== $index">{{ row.DeptName }}</span>
          <default-depts
            v-if="currentEdit === $index"
            ref="allSelect"
            w="100%"
            :multiple="false"
            :value="row.DeptID"
            @getDefaultDeptsValue="getDefaultDeptValues"
          />
        </template>
      </el-table-column>
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
        width="150"
      >
        <template slot-scope="scope">
          <el-button
            v-if="currentEdit === scope.$index"
            type="success"
            size="mini"
            @click="finishEditClick(scope)"
          >完成
          </el-button>
          <!--          编辑-->
          <el-button
            v-else
            type="info"
            size="mini"
            class="el-icon-edit"
            @click="EditClick(scope)"
          ></el-button>
          <el-button
            v-if="currentEdit === scope.$index"
            type="warning"
            size="mini"
            @click="cancelRC_Error(scope)"
          >放弃
          </el-button>
          <el-button
            v-else
            type="danger"
            size="mini"
            class="el-icon-delete"
            @click="DeleteRC_Error(scope)"
          ></el-button>
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
          background
          style="margin-top: 10px"
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
          >搜索
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="mini"
            @click="insetRC_ErrorTypeData()"
          >新增
          </el-button>
        </el-form-item>
      </el-form>
      <el-table
        ref="errorMultipleTable"
        v-loading="errorLoading"
        :header-cell-style="{'text-align':'center'}"
        :cell-style="{'text-align':'center'}"
        :data="RC_ErrorTypeData"
        style="width: 100%"
        border
        stripe
        highlight-current-row
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
          width="150"
        >
          <template slot-scope="scope">
            <el-button
              v-if="currentEditType === scope.$index"
              type="success"
              size="mini"
              @click="finishEditClickType(scope)"
            >完成
            </el-button>
            <el-button
              v-else
              class="el-icon-edit"
              type="info"
              size="mini"
              @click="EditClickType(scope)"
            ></el-button>
            <el-button
              v-if="currentEditType === scope.$index"
              type="warning"
              size="mini"
              @click="cancelRC_ErrorType(scope)"
            >放弃
            </el-button>
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
                class="el-icon-delete"
                type="danger"
                size="mini"
              ></el-button>
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
import defaultDepts from '@/views/components/defaultDepts';

export default {
  components: {
    defaultDepts
  },
  data() {
    return {
      RoleCode: window.userInfo[0].RoleCode, // 管理员
      nowDeptId: '',// 当前编辑的部门id
      errorLoading: '',
      RC_ErrorData: [],
      ErrorQuery: {
        userId: window.userInfo[0].UserID,
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
    getDefaultDeptValues(v) {
      this.nowDeptId = v;
    },

    async SelectRC_Error() {
      try {
        this.errorLoading = true;
        const { data } = await SelectRC_Error(this.ErrorQuery);
        this.ErrorQuery.total = data.Total;
        this.RC_ErrorData = data.DataList;
      } catch {
      }
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
          .catch(() => {
          });
      } else {
        this.$message.error('您不是管理员,没有权限删除');
      }
    },
    EditClick(scope) {
      // 如果点击了新增按钮，进入了编辑状态，然后又再次点击另外一条，就把刚刚正在编辑新增的条目删除
      // if (this.static==='新增'){
      //   this.RC_ErrorData.shift();
      // }
      this.nowDeptId = scope.row.DeptID; // 点了编辑，就把当前条的部门id存起来新增和修改要用
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
          scope.row.DeptID = this.nowDeptId;
          const val = {
            CreateUser: window.userInfo[0].UserName,
            ErrorContent: scope.row.ErrorContent,
            Grade: scope.row.Grade,
            ErrorID: scope.row.ErrorID,
            TypeID: scope.row.TypeID,
            deptId: scope.row.DeptID
          };
          const data = await UpdateRC_Error(val);
          if (data.code == 200) {
            if (scope.row.DeptID * 1 !== window.userInfo[0].DeptID && this.RoleCode !== 'R0001') {
              this.currentEdit = -1;
              this.$message.success('修改成功,但修改后不属于本科室，所以扣分原因无法显示');
              await this.SelectRC_Error();
            } else {
              this.currentEdit = -1;
              this.$message.success('修改成功');
              await this.SelectRC_Error();
            }

          }
        } else {
          scope.row.DeptID = this.nowDeptId;
          const val = {
            CreateUser: window.userInfo[0].UserName,
            ErrorContent: scope.row.ErrorContent,
            Grade: scope.row.Grade,
            TypeID: scope.row.TypeID,
            deptId: scope.row.DeptID
          };
          const data = await InsertRC_Error(val);
          this.currentEdit = -1;
          if (data.code == 200) {
            if (scope.row.DeptID * 1 !== window.userInfo[0].DeptID && this.RoleCode !== 'R0001') {
              this.RC_ErrorData = [];
              this.ErrorQuery.pageIndex = 1;
              this.$message.success('新增成功，但新增的不属于本科室，所以扣分原因无法显示');
              this.static = ''; // 改变编辑状态为空
              this.$nextTick(async() => {
                await this.SelectRC_Error();
              });

            } else {
              this.RC_ErrorData = [];
              this.ErrorQuery.pageIndex = 1;
              this.$message.success('新增成功');
              this.static = ''; // 改变编辑状态为空
              this.$nextTick(async() => {
                await this.SelectRC_Error();
              });

            }
          }
        }
        this.SelectRC_Error();
      } catch (error) {
      }
    },
    insetRC_ErrorData() {
      // if (this.RC_ErrorData.length > 0 && !this.RC_ErrorData[0].ErrorID) {
      //   return;
      // }
      if (this.static === '新增') {
        this.$message.warning('已处于编辑状态');
      } else {
        this.RC_ErrorData.unshift({
          CreateUser: window.userInfo[0].UserName,
          ErrorContent: '',
          Grade: 0,
          CreateTime: ''
        });
        this.currentEdit = 0;
        this.static = '新增';
      }

      // 编辑当前行
      // this.currentEdit = this.RC_ErrorData.length - 1;

    },
    cancelRC_Error(scope) {
      this.currentEdit = -1;
      this.$nextTick(() => {
        if (scope.row.ErrorID) {
          const obj = JSON.parse(this.currentRow);
          scope.row.Grade = obj.Grade;
          scope.row.ErrorContent = obj.ErrorContent;
        } else {
          this.RC_ErrorData.shift();
        }
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
            .catch(() => {
            });
        })
        .catch(() => {
        });
    },
    handleSizeChange(val) {
      this.ErrorQuery.pageSize = val;
      this.currentEdit = -1;
      this.SelectRC_Error();
    },
    handleCurrentChange(val) {
      this.ErrorQuery.pageIndex = val;
      this.currentEdit = -1;
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

</style>
