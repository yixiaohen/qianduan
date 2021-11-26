<template>
  <el-container class="quarterTable">
    <el-card style="margin: 10px;width: 98%">
      <el-header>
        <el-form
          v-show="!isSubForm"
          :inline="true"
          :model="formInline"
          size="mini"
        >
          <el-form-item>
            <el-date-picker
              v-model="formInline.Year"
              type="year"
              placeholder="选择年"
              size="mini"
              format="yyyy 年"
              value-format="yyyy"
              @change="onClickDate"
            />
          </el-form-item>
          <el-form-item>
            <el-select
              v-model.trim="formInline.Quarterly"
              placeholder="请选择季度"
              size="mini"
              clearable
              @change="selectChange"
            >
              <el-option label="第一季度" value="第一季度" />
              <el-option label="第二季度" value="第二季度" />
              <el-option label="第三季度" value="第三季度" />
              <el-option label="第四季度" value="第四季度" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="RoleCode === 'R0001'">
            <defaultDept @getDefaultDeptsValue="getDefaultDeptsValueFormInline" />
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-search"
              type="info"
              @click="SelectQuarterlyFormAllocation"
            >搜索
            </el-button>
          </el-form-item>
        </el-form>
        <el-row
          v-show="isSubForm"
          type="flex"
          class="row-bg"
          justify="space-between"
        >
          <el-col :span="3">
            <el-button
              type="success"
              plain
              icon="el-icon-refresh-left"
              size="mini"
              style="margin: 7px auto"
              @click="isSubForm = false"
            >返回
            </el-button>
          </el-col>
          <el-col :span="7">
            <h3 style="font-weight: bold">
              科室：{{ subFormData.header.DeptName }}
            </h3>
          </el-col>
          <el-col :span="6">
            <h3 style="font-weight: bold">年度：{{ subFormData.header.Year }}</h3>
          </el-col>
          <el-col :span="6">
            <h3 style="font-weight: bold">
              季度：{{ subFormData.header.Quarterly }}
            </h3>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <transition name="el-zoom-in-center">
          <el-table
            v-show="!isSubForm"
            v-loading="listLoading"
            :data="tableData"
            border
            stripe
            highlight-current-row
            style="width: 100%"
            size="mini"
            height="calc(100vh - 260px)"
          >
            <el-table-column
              label="科室"

              align="center"
              prop="DeptName"
            />
            <el-table-column label="年度" width="250" align="center">
              <template slot-scope="{ row, $index }">
                <el-date-picker
                  v-show="currentEdit == $index"
                  v-model="row.Year"
                  type="year"
                  placeholder="选择年"
                  size="mini"
                  format="yyyy 年"
                  value-format="yyyy"
                />
                <span v-show="currentEdit != $index">{{ row.Year }}</span>
              </template>
            </el-table-column>
            <el-table-column label="季度"  align="center">
              <template slot-scope="{ row, $index }">
                <el-select
                  v-show="currentEdit == $index"
                  v-model.trim="row.Quarterly"
                  placeholder="请选择"
                  size="mini"
                >
                  <el-option label="第一季度" value="第一季度" />
                  <el-option label="第二季度" value="第二季度" />
                  <el-option label="第三季度" value="第三季度" />
                  <el-option label="第四季度" value="第四季度" />
                </el-select>
                <span v-show="currentEdit != $index">{{ row.Quarterly }}</span>
              </template>
            </el-table-column>
            <el-table-column label="填写表单"  align="center">
              <template slot-scope="{ row }">
                <el-button
                  v-show="row.QuarterlyFormID !== -1"
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  circle
                  @click="onSubmit(row)"
                />
              </template>
            </el-table-column>
          </el-table>
        </transition>
        <div v-if="isSubForm">
          <subForm
            ref="subForm"
            :header="subFormData.header"
            :table-datas="subFormData.tables"
            :table-index="subFormData.TableIndex"
            :reviewer="subFormData.Reviewer"
            :step="subFormData.Step"
            @handleSelectionChange="handleSelectionChange"
          />
        </div>
        <el-pagination
          v-show="!isSubForm"
          :current-page.sync="formInline.pageIndex"
          :page-size="20"
          layout="total, prev, pager, next,jumper"
          :total="formInline.Total"
          background
          @current-change="handleCurrentChange"
        />
      </el-main>
      <el-footer>
        <el-button
          v-show="isSubForm"
          type="success"
          size="small"
          @click="InsertQuarterlyFormDetail"
        >确认提交
        </el-button>

      </el-footer>
      <el-dialog
        :width="device === 'desktop' ? '40%' : '99%'"
        title="审核分配（选择审核人）"
        :close-on-click-modal="false"
        destroy-on-close
        :visible.sync="QuarterlyFormIDdialog"
      >
        <el-tree
          ref="Trees"
          :data="treeData"
          show-checkbox
          node-key="ID"
          :default-expanded-keys="[treeData[0].ID] || 0"
          :props="{ children: 'children', label: 'Name' }"
          style="height: 450px"
          @check-change="handleCheckChange"
        />
        <el-footer>
          <el-button
            type="primary"
            size="small"
            @click="InsertQuarterlyFormAllocation"
          >确认提交
          </el-button>
          <el-button
            type="info"
            size="small"
            @click="QuarterlyFormIDdialog = false"
          >关闭
          </el-button>
        </el-footer>
      </el-dialog>
    </el-card>
  </el-container>
</template>
<script>
import { mapGetters } from 'vuex';
import subForm from '@/views/DailyManagement/quarterTable/components/subTable';
import defaultDept from '@/views/components/defaultDept';
import {
  InsertQuarterlyFormAllocation,
  SelectDeptorUser,
  SelectQuarterlyFormAllocation,
  SelectQuarterlyFormDetailByCheck
} from '@/api/RC_QuarterlyForm';
import { SelectMyDeptInfo } from '@/api/RC_DeptTemplate';

export default {
  components: { subForm, defaultDept },
  data() {
    return {
      formInline: {
        name: '',
        pageIndex: 1,
        pageSize: 20,
        Total: 0,
        CheckUserID: window.userInfo[0].UserID,
        IsAdmin: window.userInfo[0].RoleCode === 'R0001',
        DeptID: '',
        Step: 2, // 层级（1：科主任 2：主管
        Step: 1, // 层级（1：科主任 2：主管
        Year: '',
        Quarterly: ''
      },
      tableData: [],
      RoleCode: window.userInfo[0].RoleCode,
      dialogAllot: false,
      subFormData: {
        header: '',
        tables: [],
        TableIndex: [] /* 那些表可见 */,
        Reviewer: true /* 审核 按钮是否可见 */,
        Step: 2
      },
      currentEdit: -1,
      static: '新增',
      isSubForm: false,
      listLoading: false,
      QuarterlyFormIDdialog: false,
      checkedCities: [],
      treeData: [{ ID: 0 }],
      selection: [],
      CheckUserID: []
    };
  },
  computed: {
    ...mapGetters(['device', 'permission_routes'])
  },
  created() {
    this.SelectQuarterlyFormAllocation();
  },
  methods: {
    async SelectQuarterlyFormAllocation(value) {
      try {
        this.listLoading = true;
        this.formInline.pageIndex =
          value === '搜索' ? 1 : this.formInline.pageIndex;
        const { data } = await SelectQuarterlyFormAllocation(this.formInline);
        this.tableData = data.DataList;
        this.formInline.Total = data.Total;
      } catch (error) {
        console.log(error);
      }
      this.listLoading = false;
    },
    async handleCurrentChange(val) {
      this.formInline.pageIndex = val;
      this.SelectQuarterlyFormAllocation();
    },
    async onSubmit(row) {
      const { data } = await SelectQuarterlyFormDetailByCheck({
        QuarterlyFormID: row.QuarterlyFormID,
        UserID: window.userInfo[0].UserID,
        Step: 2
      });
      this.isSubForm = true;
      this.subFormData.header = row;

      data.list.table10.map((item, index) => {
        /* 判断根本原因返回的变量是否为数组，不是就转为数组，因为多选存储的值必须是数组 */
        item.CauseAnalysis = item.CauseAnalysis
          ? Object.prototype.toString.call(item.CauseAnalysis) ===
          '[object Array]'
            ? item.CauseAnalysis
            : typeof item.CauseAnalysis === 'string'
              ? (item.CauseAnalysis = item.CauseAnalysis.match(
                /[0-9]([\s\S]*?),/g
              ))
              : []
          : [];
      });
      data.list.table11.map((item, index) => {
        item.CauseAnalysis = item.CauseAnalysis
          ? Object.prototype.toString.call(item.CauseAnalysis) ===
          '[object Array]'
            ? item.CauseAnalysis
            : typeof item.CauseAnalysis === 'string'
              ? (item.CauseAnalysis = item.CauseAnalysis.match(
                /[0-9]([\s\S]*?),/g
              ))
              : []
          : [];
      });
      data.list.table12.map((item, index) => {
        item.ProblemClassification = item.ProblemClassification
          ? Object.prototype.toString.call(item.ProblemClassification) ===
          '[object Array]'
            ? item.ProblemClassification
            : typeof item.ProblemClassification === 'string'
              ? (item.ProblemClassification = item.ProblemClassification.match(
                /[0-9]([\s\S]*?),/g
              ))
              : []
          : [];

        item.CauseAnalysis = item.CauseAnalysis
          ? Object.prototype.toString.call(item.CauseAnalysis) ===
          '[object Array]'
            ? item.CauseAnalysis
            : typeof item.CauseAnalysis === 'string'
              ? (item.CauseAnalysis = item.CauseAnalysis.match(
                /[0-9]([\s\S]*?),/g
              ))
              : []
          : [];
      });
      data.list.table13.table13two.map((item, index) => {
        item.Infusion = item.Infusion
          ? Object.prototype.toString.call(item.Infusion) === '[object Array]'
            ? item.Infusion
            : typeof item.Infusion === 'string'
              ? (item.Infusion = item.Infusion.match(/[0-9]([\s\S]*?),/g))
              : []
          : [];

        item.CheckItem = item.CheckItem
          ? Object.prototype.toString.call(item.CheckItem) === '[object Array]'
            ? item.CheckItem
            : typeof item.CheckItem === 'string'
              ? (item.CheckItem = item.CheckItem.match(/[0-9]([\s\S]*?),/g))
              : []
          : [];
      });

      /* 判断根本原因返回的变量是否为数组，不是就转为数组，因为多选存储的值必须是数组 */
      data.list.table16.CauseAnalysis = data.list.table16.CauseAnalysis
        ? Object.prototype.toString.call(data.list.table16.CauseAnalysis) ===
        '[object Array]'
          ? data.list.table16.CauseAnalysis
          : typeof data.list.table16.CauseAnalysis === 'string'
            ? (data.list.table16.CauseAnalysis = data.list.table16.CauseAnalysis.match(
              /[0-9]([\s\S]*?),/g
            ))
            : []
        : [];

      data.list.table17.CheckItem = data.list.table17.CheckItem
        ? Object.prototype.toString.call(data.list.table17.CheckItem) ===
        '[object Array]'
          ? data.list.table17.CheckItem
          : typeof data.list.table17.CheckItem === 'string'
            ? (data.list.table17.CheckItem = data.list.table17.CheckItem.match(
              /[0-9]([\s\S]*?),/g
            ))
            : []
        : [];
      data.list.table18.Formalities = data.list.table18.Formalities
        ? Object.prototype.toString.call(data.list.table18.Formalities) ===
        '[object Array]'
          ? data.list.table18.Formalities
          : typeof data.list.table18.Formalities === 'string'
            ? (data.list.table18.Formalities = data.list.table18.Formalities.match(
              /[0-9]([\s\S]*?),/g
            ))
            : []
        : [];

      this.subFormData.tables = data.list;
      this.subFormData.TableIndex = data.TableIndex;
      this.$nextTick(() => {
        this.$refs.subForm.SelectQuarterlyFormAllocationDetail(
          row.QuarterlyFormID
        );
      });
    },
    InsertQuarterlyFormDetail() {
      this.$nextTick(() => {
        this.$refs.subForm.InsertQuarterlyFormDetail();
      });
    },
    async SelectDeptorUser() {
      if (this.selection.length < 1) {
        this.$message.warning('请至少选择一行');
        return;
      }
      const { data } = await SelectMyDeptInfo({
        DeptID: window.userInfo[0].DeptID,
        DeptName: window.userInfo[0].DeptName
      });

      const data2 = await SelectDeptorUser({
        DeptID: data.DeptID,
        Name: data.DeptName
      });
      this.QuarterlyFormIDdialog = true;
      this.treeData = data2.data;
    },
    handleSelectionChange(selection) {
      this.selection = [];
      selection.map(item => {
        this.selection.push(item.index);
      });
    },
    handleCheckChange() {
      const checkData = this.$refs.Trees.getCheckedNodes();
      this.CheckUserID = [];
      checkData.map(item => {
        this.CheckUserID.push(item.ID);
      });
    },
    async InsertQuarterlyFormAllocation() {
      const { code } = await InsertQuarterlyFormAllocation({
        QuarterlyFormID: this.subFormData.header.QuarterlyFormID,
        IDArray: this.selection,
        CheckUserID: this.CheckUserID.toString(),
        UserID: window.userInfo[0].UserID,
        Step: 2 /* 1科主任，2主管ƒ */
      });
      code === 200
        ? this.$message.success('分配成功！')
        : this.$message.error('分配失败！');
      this.selection = [];
      this.CheckUserID = [];
      this.$refs.subForm.toggleSelection();
      this.$refs.subForm.SelectQuarterlyFormAllocationDetail(
        this.subFormData.header.QuarterlyFormID
      );
      this.QuarterlyFormIDdialog = false;
    },
    getDefaultDeptsValueFormInline(val) {
      this.formInline.SelectDeptID = val;
      this.SelectQuarterlyFormAllocation();
    },
    async onClickDate() {
      this.SelectQuarterlyFormAllocation();
    },
    async selectChange() {
      this.SelectQuarterlyFormAllocation();
    }
  }
};
</script>
<style lang="scss" >
.quarterTable {
  .el-header,
  .el-footer {
    padding: 3px 0px;
    height: 40px !important;
  }

  .el-main {
    padding: 0px 0px;
    height: calc(100vh - 180px) !important;
  }
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
</style>
