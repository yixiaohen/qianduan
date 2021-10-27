<template>
  <el-container class="medicalAudit">
    <el-header>
      <el-form
        :inline="true"
        :model="fromData"
        class="demo-form-inline"
        size="mini"
      >
        <el-form-item>
          <el-input
            v-model="fromData.FormName"
            placeholder="表单名称"
            @keyup.enter.native="SelectExamineList('搜索')"
          />
        </el-form-item>
        <el-form-item>
          <defaultDeptSelect @getDefaultDeptsValue="getDefaultDeptValue2" />
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="fromData.ExamineState"
            placeholder="审核状态"
            clearable
            @change="selectChange"
          >
            <el-option label="通过" value="0" />
            <el-option label="退回" value="1" />
            <el-option label="未审核" value="2" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item>
          <el-button
            type="primary"
            @click="SelectExamineList('select')"
          >查询</el-button>
        </el-form-item> -->
      </el-form>
    </el-header>
    <el-main>
      <el-table
        :data="tableData"
        border
        size="mini"
        style="width: 100%"
        height="calc(100vh - 170px)"
        stripe
        @row-click="rowClick"
      >
        <el-table-column
          prop="FormName"
          label="表单名称"
          min-width="150"
          :show-overflow-tooltip="cellOverflow"
        />
        <el-table-column
          prop="DeptName"
          label="自查科室"
          min-width="150"
          :show-overflow-tooltip="cellOverflow"
        />
        <el-table-column
          prop="UserName"
          label="填写人"
          width="150"
          align="center"
          :show-overflow-tooltip="cellOverflow"
        />
        <el-table-column
          prop="Date"
          label="年月"
          width="100"
          align="center"
          :show-overflow-tooltip="cellOverflow"
        />
        <el-table-column
          label="审核意见"
          min-width="150"
          align="center"
          :show-overflow-tooltip="cellOverflow"
        >
          <template slot-scope="{ row }">
            <span v-if="FormID !== row.FormID">{{ row.ExamineOpinion }}</span>
            <el-input
              v-else
              v-model="row.ExamineOpinion"
              size="mini"
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              @blur="Review(row)"
              @keyup.enter.native="Review(row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="查看详情"
          min-width="30"
          align="center"
          :show-overflow-tooltip="cellOverflow"
        >
          <template slot-scope="{ row }">
            <el-button
              size="mini"
              circle
              icon="el-icon-view"
              @click="SelectFormDetailByID(row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="审核状态"
          width="250"
          align="center"
          :show-overflow-tooltip="cellOverflow"
        >
          <template slot-scope="{ row }">
            <el-radio-group
              v-model="row.ExamineState"
              size="mini"
              @change="Review(row)"
            >
              <el-radio-button label="0">通过</el-radio-button>
              <el-radio-button label="1">退回</el-radio-button>
              <el-radio-button
                v-if="row.ExamineState !== '2'"
                :label="null"
                :disabled="row.ExamineState === '1' || row.ExamineState === '0'"
              >未审核</el-radio-button>
              <el-radio-button
                v-else
                :label="'2'"
                :disabled="row.ExamineState === '1' || row.ExamineState === '0'"
              >未审核</el-radio-button>
            </el-radio-group>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        title="查看详情"
        :visible.sync="dialogFrom"
        :width="device === 'desktop' ? '60%' : '99%'"
        :top="device === 'desktop' ? '3%' : '1%'"
        @resize="resize"
      >
        <el-form
          ref="tableFromData"
          :model="tableFromData"
          label-width="80px"
          size="mini"
          label-position="top"
          style="margin-left: 5px"
          :inline="true"
        >
          <el-form-item label="表单名称" prop="FormName">
            <el-input v-model="tableFromData.FormName" />
          </el-form-item>
          <el-form-item label="表单模板">
            <el-select
              v-model="tableFromData.FormTemplateID"
              placeholder="选择模板"
              @change="selectTemplate"
            >
              <el-option
                v-for="item in TemplateData"
                :key="item.FormTemplateID"
                :label="item.TemplateName"
                :value="item.FormTemplateID"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="自查科室" prop="RC_InspectionDepartment">
            <defaultDept
              w="100%"
              :multiple="true"
              :value="tableFromData.DeptID"
            />
          </el-form-item>
          <el-form-item label="年月">
            <el-date-picker
              v-model="tableFromData.Date"
              range-separator="-"
              value-format="yyyy-MM"
              type="month"
              placeholder="选择年月"
            />
          </el-form-item>
        </el-form>
        <el-table
          :data="tableFromData.Form_File_List"
          border
          style="width: 100%"
          size="mini"
        >
          <el-table-column prop="FileName" label="文件名" align="center" />
          <el-table-column prop="FileUrl" label="下载" align="center">
            <template slot-scope="{ row }">
              <el-link :href="row.FileUrl" target="_blank">
                <el-button icon="el-icon-download" circle size="mini" />
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="OpenFileUrl" label="文件预览" align="center">
            <template slot-scope="{ row }">
              <el-button
                icon="el-icon-view"
                circle
                size="mini"
                @click="PreviewFile(row.FileUrl)"
              />
            </template>
          </el-table-column>
        </el-table>
        <span>
          <div v-if="!isFullscreen" style="height: 400px">
            <p>表单内容</p>
            <wangeditor ref="wangEdit" @change="getContent" />
          </div>
        </span>
        <span>
          <el-button size="small" @click="InsertExamine('0')">通过</el-button>
          <el-button
            type="primary"
            size="small"
            @click="InsertExamine('1')"
          >退回</el-button>
          <el-button
            type="primary"
            size="small"
            @click="dialogFrom = false"
          >关闭</el-button>
        </span>
      </el-dialog>
    </el-main>
    <el-footer>
      <el-row>
        <el-col :span="1">
          <el-switch v-model="cellOverflow" style="margin: 6px 0px" />
        </el-col>
        <el-col :span="20">
          <el-pagination
            background
            :current-page="fromData.pageIndex"
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size="fromData.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="fromData.Total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-col>
      </el-row>
    </el-footer>
  </el-container>
</template>
<script>
import { InsertExamine, SelectExamineList } from '@/api/dailymanagement/RC_Examine';
import defaultDept from '@/views/components/defaultDept';
import defaultDeptSelect from '@/views/components/defaultDept';
import { SelectFormDetailByID, SelectFormTemplate } from '@/api/RC_Form';
import { mapGetters } from 'vuex';
import wangeditor from '@/components/Editor/index'; /* 富文本编辑器 */
import { PreviewFile } from '@/api/Article';

export default {
  components: {
    defaultDept,
    wangeditor,
    defaultDeptSelect
  },
  data() {
    return {
      tableData: [],
      fromData: {
        Type: 1,
        DeptID: '',
        ExamineState: '',
        pageIndex: 1,
        pageSize: 20,
        Total: 0
      },
      isFullscreen: false,
      tableFromData: {},
      cellOverflow: false,
      TemplateData: [],
      dialogFrom: false,
      FormID: -1,
      selelctTemplateVal: {
        pageIndex: 1,
        pageSize: 50,
        Total: '',
        TemplateName: ''
      }
    };
  },
  computed: {
    ...mapGetters(['device'])
  },
  created() {
    this.SelectExamineList();
    this.SelectFormTemplate();
  },
  methods: {
    async SelectExamineList(Type) {
      this.fromData.pageIndex = Type === 'select' ? 1 : this.fromData.pageIndex;
      const { data } = await SelectExamineList(this.fromData);
      this.tableData = data.DataList;
      this.fromData.Total = data.Total;
    },
    getDefaultDeptValue2(val) {
      this.fromData.DeptID = val.toString();
      this.SelectExamineList();
    },
    async selectChange(val) {
      this.SelectExamineList();
    },
    async Review(row) {
      row.ExamineID = row.ExamineID || 0;
      const { code } = await InsertExamine({
        ExamineID: row.ExamineID,
        FormID: row.FormID,
        ExamineState: row.ExamineState,
        ExamineOpinion: row.ExamineOpinion || ''
      });
      code === 200
        ? this.$message.success('审核成功!')
        : this.$message.warning('审核失败');
      this.SelectExamineList();
      this.FormID = -1;
    },
    async InsertExamine(val) {
      const { code } = await InsertExamine({
        ExamineID: this.tableFromData.ExamineID,
        FormID: this.tableFromData.FormID,
        ExamineState: val,
        ExamineOpinion: this.tableFromData.ExamineOpinion || ''
      });
      code === 200
        ? this.$message.success('审核成功!')
        : this.$message.warning('审核失败');
      this.SelectExamineList();
      this.dialogFrom = false;
      this.FormID = -1;
    },
    handleSizeChange(val) {
      this.fromData.pageSize = val;
      this.fromData.pageIndex = 1;
      this.SelectExamineList();
    },
    handleCurrentChange(val) {
      this.fromData.pageIndex = val;
      this.SelectExamineList();
    },
    rowClick(row, column) {
      column.label === '审核意见'
        ? (this.FormID = row.FormID)
        : (this.FormID = -1);
    },
    async SelectFormDetailByID(row) {
      const { data } = await SelectFormDetailByID({ FormID: row.FormID });
      this.tableFromData = data;
      this.$nextTick(() => {
        this.$refs.wangEdit.setContent(data.FormContent);
      });
      this.tableFromData.ExamineID = row.ExamineID || 0;
      this.tableFromData.ExamineState = row.ExamineState;
      this.tableFromData.ExamineOpinion = row.ExamineOpinion;
      this.dialogFrom = true;
    },
    async SelectFormTemplate() {
      try {
        const { data } = await SelectFormTemplate(this.selelctTemplateVal);
        this.TemplateData = data.DataList;
        this.selelctTemplateVal.Total = data.Total;
      } catch (error) {
        console.log(error);
      }
    },
    resize(val) {
      this.isFullscreen = val;
    },
    selectTemplate() {},
    getContent(val) {
      this.tableFromData.FormContent = val;
    },
    getContent2(val) {
      this.TemplateRowData.TemplateContent = val;
    },
    async PreviewFile(title) {
      title = title.replace(/\/Annex\/file\/|\/Annex\/file/g, '');
      /* 文件预览 */
      const { data } = await PreviewFile({
        Title: title
      });
      this.$nextTick(() => {
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = data;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
      });
    }
  }
};
</script>

<style lang="scss">
.medicalAudit {
  .el-header,
  .el-main,
  .el-footer {
    margin: 0px 0;
    padding: 0px;
  }
  .el-header {
    display: flex;
    align-items: center;
    height: 40px !important;
  }
  .el-radio-button {
    margin: 0px 15px 3px 0px;
    box-shadow: 1px 1px 5px 1px #dfdfdf;
  }
}
</style>
