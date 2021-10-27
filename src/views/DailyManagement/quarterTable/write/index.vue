<template>
  <el-container class="quarterTable">
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
        <el-form-item>
          <el-select
            v-model.trim="formInline.IsSubmit"
            placeholder="提交状态"
            size="mini"
            @change="selectChangeIsSubmit"
          >
            <el-option label="已提交" :value="1" />
            <el-option label="待提交" :value="0" />
            <el-option label="全部" :value="-1" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="RoleCode === 'R0001'">
          <defaultDept @getDefaultDeptsValue="getDefaultDeptsValueFormInline" />
        </el-form-item>
        <el-form-item>
          <el-button
            icon="el-icon-search"
            type="info"
            @click="SelectQuarterlyForm('搜索')"
          >搜索
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            icon="el-icon-plus"
            type="primary"
            @click="addFormData"
          >新增季度表单
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
        <el-col :span="3">
          <el-button
            type="success"
            plain
            icon="el-icon-user"
            size="mini"
            style="margin: 7px auto"
            @click="SelectDeptorUser(subFormData.header.QuarterlyFormID)"
          >审核分配（科主任）
          </el-button>
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
          style="width: 100%"
          size="mini"
          height="calc(100vh - 200px)"
        >
          <el-table-column label="科室" width="210" align="center">
            <template slot-scope="{ row, $index }">
              <div v-if="currentEdit == $index && RoleCode == 'R0001'">
                <default-dept
                  :value="row.DeptID"
                  @getDefaultDeptsValue="getDefaultDeptValues"
                />
              </div>
              <span v-else>{{ row.DeptName }}</span>
            </template>
          </el-table-column>
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
          <el-table-column label="季度" width="150" align="center">
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
          <!-- 1已提交，0未提交 -->
          <el-table-column label="提交状态" width="70" align="center">
            <template slot-scope="{ row }">
              <span
                :style="{ color: row.IsSubmit === 0 ? 'black' : 'green' }"
              >{{
                row.IsSubmit === 0
                  ? '待提交'
                  : row.IsSubmit === 1
                    ? '已提交'
                    : ''
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="提交表单" width="70" align="center">
            <template slot-scope="{ row }">
              <el-button
                v-show="row.IsSubmit == 1"
                type="success"
                round
                plain
                icon="el-icon-check"
                circle
                size="mini"
              />
              <el-popconfirm
                confirm-button-text="是的"
                cancel-button-text="取消"
                icon="el-icon-info"
                icon-color="red"
                title="确定提交吗？"
                @confirm="SubmitForm(row)"
              >
                <el-button
                  v-show="row.IsSubmit == 0"
                  slot="reference"
                  type="info"
                  round
                  plain
                  icon="el-icon-upload2"
                  circle
                  size="mini"
                />
              </el-popconfirm>
            </template>
          </el-table-column>
          <el-table-column label="填写表单" width="70" align="center">
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
          <el-table-column label="操作" width="100" align="center">
            <template slot-scope="{ row, $index }">
              <el-button
                v-show="currentEdit != $index"
                type="text"
                size="small"
                @click="edit(row, $index)"
              >修改
              </el-button>
              <el-button
                v-show="currentEdit == $index"
                type="text"
                size="small"
                @click="submit(row)"
              >完成
              </el-button>
              <el-button
                v-show="currentEdit == $index"
                type="text"
                size="small"
                @click="giveUp(row, $index)"
              >放弃
              </el-button>
              <el-popconfirm
                v-show="currentEdit != $index"
                v-if="row.IsSubmit === 0"
                confirm-button-text="好的"
                cancel-button-text="不用了"
                icon="el-icon-info"
                icon-color="red"
                title="这是一段内容确定删除吗？"
                style="margin-left: 5px"
                @confirm="DeleteQuarterlyForm(row, $index)"
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
      </transition>
      <div v-if="isSubForm">
        <subForm
          ref="subForm"
          :header="subFormData.header"
          :table-datas="subFormData.tables"
          @handleSelectionChange="handleSelectionChange"
        />
      </div>
    </el-main>
    <el-footer>
      <el-button
        v-show="isSubForm"
        type="success"
        size="small"
        @click="InsertQuarterlyFormDetail"
      >确认提交
      </el-button>
      <el-pagination
        v-show="!isSubForm"
        :current-page.sync="formInline.pageIndex"
        :page-size="20"
        layout="total, prev, pager, next"
        :total="formInline.Total"
        background
        @current-change="handleCurrentChange"
      />
    </el-footer>
    <el-dialog
      :width="device === 'desktop' ? '40%' : '99%'"
      title="审核分配（选择审核人）"
      :close-on-click-modal="false"
      :visible.sync="QuarterlyFormIDdialog"
    >
      <el-tree
        ref="Trees"
        :data="treeData"
        show-checkbox
        node-key="ID"
        :default-expanded-keys="[treeData[0].ID] || 0"
        :props="{ children: 'children', label: 'Name' }"
        style="height: 50vh; overflow: auto"
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
  </el-container>
</template>
<script>
import { mapGetters } from 'vuex';
import defaultDept from '@/views/components/defaultDept';
import subForm from '@/views/DailyManagement/quarterTable/components/subTable';
import {
  DeleteQuarterlyForm,
  InsertQuarterlyForm,
  InsertQuarterlyFormAllocation,
  SelectDeptorUser,
  SelectQuarterlyForm,
  SelectQuarterlyFormDetail,
  UpdateQuarterlyForm
} from '@/api/RC_QuarterlyForm';
import { SelectMyDeptInfo } from '@/api/RC_DeptTemplate';

export default {
  components: { defaultDept, subForm },
  data() {
    return {
      formInline: {
        name: '',
        pageIndex: 1,
        pageSize: 20,
        Total: 0,
        IsAdmin: window.userInfo[0].RoleCode === 'R0001',
        DeptID: window.userInfo[0].DeptID,
        Year: '',
        IsSubmit: -1 /* （-1全部 0待提交 1已提交） */,
        Quarterly: '',
        userid: window.userInfo[0].UserID
      },
      tableData: [],
      RoleCode: window.userInfo[0].RoleCode,
      dialogAllot: false,
      subFormData: {
        header: '',
        tables: []
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
    this.SelectMyDeptInfo();
  },
  methods: {
    async SelectMyDeptInfo() {
      const data1 = await SelectMyDeptInfo({
        DeptID: window.userInfo[0].DeptID,
        DeptName: window.userInfo[0].DeptName
      });
      this.formInline.DeptID =
        window.userInfo[0].RoleCode === 'R0001' ? '' : data1.data.DeptID;
      try {
        this.listLoading = true;
        const { data } = await SelectQuarterlyForm(this.formInline);
        this.tableData = data.DataList;
        this.formInline.Total = data.Total;
      } catch (error) {
        console.log(error);
      }
      this.listLoading = false;
    },
    async SelectQuarterlyForm(value) {
      try {
        this.listLoading = true;
        console.log('this.formInline.DeptID', this.formInline.DeptID);
        this.formInline.pageIndex =
          value === '搜索' ? 1 : this.formInline.pageIndex;
        const { data } = await SelectQuarterlyForm(this.formInline);
        this.tableData = data.DataList;
        this.formInline.Total = data.Total;
      } catch (error) {
        console.log(error);
      }
      this.listLoading = false;
    },
    async handleCurrentChange(val) {
      this.formInline.pageIndex = val;
      this.SelectQuarterlyForm();
    },
    async onSubmit(row) {
      const { data } = await SelectQuarterlyFormDetail({
        QuarterlyFormID: row.QuarterlyFormID
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
      this.$nextTick(() => {
        this.$refs.subForm.SelectQuarterlyFormAllocationDetail(
          row.QuarterlyFormID
        );
      });
    },

    getDefaultDeptValues(val) {
    },
    async addFormData() {
      const timestamp = Date.parse(new Date());
      const date = new Date(timestamp);
      const thieYear = date.getFullYear().toString();
      const { data } = await SelectMyDeptInfo({
        DeptID: window.userInfo[0].DeptID,
        DeptName: window.userInfo[0].DeptName
      });

      this.tableData.unshift({
        Year: thieYear,
        Quarterly: '第一季度',
        DeptName: data.DeptName,
        DeptID: data.DeptID,
        QuarterlyFormID: -1
      });
      this.currentEdit = 0;
      this.static = '新增';
    },
    async DeleteQuarterlyForm(row, index) {
      const { code } = await DeleteQuarterlyForm({
        QuarterlyFormID: row.QuarterlyFormID
      });
      code === 200
        ? this.tableData.splice(index, 1)
        : this.$message.error('删除失败！');
    },
    edit(row, $index) {
      this.currentEdit = $index;
      this.static = '修改';
    },
    giveUp(row, $index) {
      this.currentEdit = -1;
      if (this.static === '新增') {
        this.tableData.splice($index, 1);
      }
    },
    async SubmitForm(row) {
      this.static = '修改';
      row.IsSubmit = 1;
      this.submit(row);
    },
    async submit(row) {
      try {
        if (this.static === '新增') {
          const { code } = await InsertQuarterlyForm({
            DeptID: row.DeptID,
            Year: row.Year,
            Quarterly: row.Quarterly
          });
          code === 200
            ? this.$message.success('新增成功')
            : this.$message.error('新增失败');
        } else if (this.static === '修改') {
          const { code } = await UpdateQuarterlyForm({
            QuarterlyFormID: row.QuarterlyFormID,
            DeptID: row.DeptID,
            Quarterly: row.Quarterly,
            IsSubmit: row.IsSubmit,
            Year: row.Year
          });
          code === 200
            ? this.$message.success('修改成功')
            : this.$message.error('修改失败');
        }
        this.SelectQuarterlyForm();
        this.currentEdit = -1;
      } catch (error) {
        console.log(error);
      }
    },
    handleCurrentChange(val) {
    },
    InsertQuarterlyFormDetail() {
      this.$refs.subForm.InsertQuarterlyFormDetail();
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
      const { data, code } = await InsertQuarterlyFormAllocation({
        QuarterlyFormID: this.subFormData.header.QuarterlyFormID,
        IDArray: this.selection,
        CheckUserID: this.CheckUserID.toString(),
        UserID: window.userInfo[0].UserID,
        Step: 1 /* 1科主任，2主管ƒ */
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
    InsertQuarterlyFormDetail() {
      this.$refs.subForm.InsertQuarterlyFormDetail();
    },
    async getDefaultDeptsValue() {
    },
    getDefaultDeptsValueFormInline(val) {
      this.formInline.DeptID = val;
      this.SelectQuarterlyForm('搜索');
    },
    async onClickDate() {
      this.SelectQuarterlyForm('搜索');
    },
    async selectChange() {
      this.SelectQuarterlyForm('搜索');
    },
    async selectChangeIsSubmit() {
      this.SelectQuarterlyForm('搜索');
    }
  }
};
</script>
<style lang="scss">
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
