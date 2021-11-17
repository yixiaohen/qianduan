<template>
  <el-container class="homemadeForm">
    <el-header>
      <div style="display: flex">
        <div>
          <el-radio-group
            v-model="TemplateShow"
            size="mini"
            @change="radioGroup"
          >
            <el-radio-button :label="false">表单</el-radio-button>
            <el-radio-button
              v-if="RoleCode === 'R0001'"
              :label="true"
            >模板</el-radio-button>
          </el-radio-group>
        </div>
        <div style="flex: 1; margin-left: 1rem">
          <el-form
            :inline="true"
            :model="formInline"
            size="mini"
          >
            <el-form-item v-if="!TemplateShow">
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="mini"
                @click="addTable()"
              >
                填写表单</el-button>
            </el-form-item>
            <el-form-item v-if="TemplateShow">
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="mini"
                @click="insetTypeData()"
              >新增模板</el-button>
            </el-form-item>
            <el-form-item v-if="!TemplateShow">
              <el-input
                v-model="formInline.FormName"
                placeholder="表单名称"
                clearable
                @keyup.enter.native="SelectForm('搜索')"
              ><i
                slot="prefix"
                class="el-input__icon el-icon-search"
              /></el-input>
            </el-form-item>
            <el-form-item v-if="!TemplateShow">
              <el-date-picker
                v-model="formInline.Date"
                range-separator="-"
                value-format="yyyy-MM"
                type="month"
                placeholder="选择年月"
              />
            </el-form-item>
            <el-form-item v-if="!TemplateShow">
              <default-depts
                w="100%"
                @getDefaultDeptsValue="getDefaultDeptValues"
              />
            </el-form-item>
            <el-form-item v-if="!TemplateShow">
              <el-select
                v-model="formInline.TemplateName"
                placeholder="选择模板"
                clearable
                filterable
                @change="elSelect"
              >
                <el-option
                  v-for="item in TemplateData"
                  :key="item.FormTemplateID"
                  :label="item.TemplateName"
                  :value="item.TemplateName"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select
                v-model="formInline.ExamineState"
                placeholder="审核状态"
                clearable
                @change="selectChange"
              >
                <el-option label="通过" value="0" />
                <el-option label="退回" value="1" />
                <el-option label="未审核" value="2" />
              </el-select>
            </el-form-item>
            <el-form-item v-if="TemplateShow">
              <el-input
                v-model="selelctTemplateVal.TemplateName"
                placeholder="表单模板名称"
                clearable
                @keyup.enter.native="SelectFormTemplate('搜索')"
              ><i
                slot="prefix"
                class="el-input__icon el-icon-search"
              /></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="info"
                icon="el-icon-search"
                @click="
                  TemplateShow ? SelectFormTemplate('搜索') : SelectForm('搜索')
                "
              >查询</el-button>
            </el-form-item>
            <el-form-item v-if="!TemplateShow">
              <el-checkbox
                v-model="checked"
                @change="checkbox"
              >只看草稿</el-checkbox>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-header>
    <el-main>
      <transition name="el-zoom-in-center">
        <el-table
          v-show="!TemplateShow"
          :data="tableData"
          border
          size="mini"
          style="width: 100%;margin-top: 6px"
          height="calc(100vh - 170px)"
          stripe
        >
          <el-table-column
            v-if="CatalogVersion =='综合医院' ? true: false"
            prop="FormName"
            label="科室质量与安全管理小组月度监管记录"
            class="tableData1"
            :show-overflow-tooltip="cellOverflow"
          />
          <el-table-column
            v-else
            prop="FormName"
            label="表单名称"
            class="tableData1"
            :show-overflow-tooltip="cellOverflow"
          />

          <el-table-column
            prop="DeptName"
            label="自查科室"
            class="tableData1"
            :show-overflow-tooltip="cellOverflow"
          />
          <el-table-column
            prop="Date"
            label="年月"
            class="tableData1"
            align="center"
            width="100"
            :show-overflow-tooltip="cellOverflow"
          />
          <el-table-column
            prop="ExamineState"
            label="审核状态"
            class="tableData1"
            width="120"
            align="center"
            :show-overflow-tooltip="cellOverflow"
          >
            <template slot-scope="{ row }">
              {{
                row.ExamineState === '0'
                  ? '通过'
                  : row.ExamineState === '1'
                    ? '退回'
                    : '未审核'
              }}
            </template>
          </el-table-column>
          <el-table-column
            prop="ExamineOpinion"
            label="审核意见"
            :show-overflow-tooltip="cellOverflow"
            align="center"
          />
          <el-table-column
            label="操作"
            width="200"
            align="center"
            :show-overflow-tooltip="cellOverflow"
          >
            <template slot-scope="{ row }">
              <el-button
                size="mini"
                circle
                icon="el-icon-view"
                @click="EditForm(row, '查看')"
              />
              <el-button
                size="mini"
                circle
                type="info"
                icon="el-icon-edit"
                style="margin-right: 3px"
                :disabled="row.ExamineState === '0'"
                @click="EditForm(row, '修改')"
              />
              <el-popconfirm
                confirm-button-text="是"
                cancel-button-text="否"
                icon="el-icon-info"
                icon-color="red"
                title="确定删除吗？"
                @confirm="DeleteForm(row)"
              >
                <el-button
                  slot="reference"
                  size="mini"
                  circle
                  :disabled="row.ExamineState === '0' && RoleCode !== 'R0001'"
                  type="danger"
                  icon="el-icon-delete"
                />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </transition>
      <el-dialog
        :title="FormTitle"
        :visible.sync="dialogFrom"
        :width="device === 'desktop' ? '60%' : '99%'"
        :top="device === 'desktop' ? '3%' : '1%'"
        :before-close="handleClose"
        @resize="resize"
      >
        <el-form
          ref="tableFromData"
          :model="tableFromData"
          label-width="80px"
          size="mini"
          label-position="top"
          style="margin-left: 5px"
          :rules="rules"
          :inline="true"
        >
          <el-form-item
            label="表单名称"
            prop="FormName"
          >
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
          <el-form-item
            label="自查科室"
            prop="RC_InspectionDepartment"
          >
            <defaultDept
              w="100%"
              :multiple="true"
              :value="tableFromData.DeptID"
              @getDefaultDeptsValue="getDefaultDeptValue"
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
          <el-form-item label="文件上传">
            <el-upload
              :multiple="true"
              :show-file-list="true"
              :on-success="handleSuccess"
              class="editor-slide-upload"
              :file-list="fileList"
              action="/api/RC_File/UploadFile"
            >
              <el-button
                size="mini"
                type="primary"
              >选择文件</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
        <el-table
          :data="tableFromData.Form_File_List"
          border
          style="width: 100%"
          size="mini"
        >
          <el-table-column
            prop="FileName"
            label="文件名"
            align="center"
          />
          <el-table-column
            prop="FileUrl"
            label="下载"
            align="center"
          >
            <template slot-scope="{ row }">
              <el-link
                :href="row.FileUrl"
                target="_blank"
              >
                <el-button
                  icon="el-icon-download"
                  circle
                  size="mini"
                />
              </el-link>
            </template>
          </el-table-column>
          <el-table-column
            prop="OpenFileUrl"
            label="文件预览"
            align="center"
          >
            <template slot-scope="{ row }">
              <el-button
                icon="el-icon-view"
                circle
                size="mini"
                @click="PreviewFile(row.FileUrl)"
              />
            </template>
          </el-table-column>
          <el-table-column
            v-show="formButtonShow"
            prop="OpenFileUrl"
            label="删除"
            width="50px"
            align="center"
          >
            <template slot-scope="{ $index }">
              <el-popconfirm
                v-show="formButtonShow"
                confirm-button-text="是"
                cancel-button-text="否"
                icon="el-icon-info"
                icon-color="red"
                title="确定删除吗？"
                @confirm="deleteFile($index)"
              >
                <i
                  v-show="formButtonShow"
                  slot="reference"
                  style="cursor: pointer"
                  class="el-icon-delete"
                />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <span>
          <div
            v-if="!isFullscreen"
            style="height: 400px"
          >
            <p>表单内容</p>
            <wangeditor
              ref="wangEdit"
              @change="getContent"
            />
          </div>
          <div
            v-else
            style="height: 500px"
          >
            <p>表单内容</p>
            <wangeditor
              ref="wangEdit"
              @change="getContent"
            />
          </div>
        </span>
        <span>
          <el-button
            size="small"
            @click="handleClose"
          >关 闭</el-button>
          <el-button
            v-show="FormTitle == '新增表单'"
            size="small"
            @click="addDraft"
          >存为草稿</el-button>
          <el-button
            v-show="formButtonShow"
            type="primary"
            size="small"
            @click="FormTitle == '新增表单' ? InsertForm() : UpdateForm()"
          >提交表单</el-button>
          <el-button
            v-show="formButtonShow"
            v-if="FormTitle == '修改草稿'"
            type="primary"
            size="small"
            @click="
              tableFromData.IsDraft = 1
              UpdateForm()
            "
          >存为草稿</el-button>
        </span>
      </el-dialog>
      <!-- 表单模板begin -->
      <el-table
        style="margin-top: 6px"
        v-show="TemplateShow"
        :data="TemplateData"
        height="calc(100vh - 180px)"
        border
        size="mini"
        stripe
      >
        <el-table-column
          label="模板名称"
          prop="TemplateName"
          :show-overflow-tooltip="cellOverflow"
        />
        <el-table-column
          label="操作"
          width="200"
          align="center"
        >
          <template slot-scope="{ row }">
            <el-button
              size="mini"
              circle
              icon="el-icon-view"
              @click="EditTemplate(row, '查看')"
            />
            <el-button
              size="mini"
              circle
              type="info"
              icon="el-icon-edit"
              style="margin-right: 3px"
              @click="EditTemplate(row, '修改')"
            />
            <el-popconfirm
              confirm-button-text="是"
              cancel-button-text="否"
              icon="el-icon-info"
              icon-color="red"
              title="确定删除吗？"
              @confirm="DeleteFormTemplate(row)"
            >
              <el-button
                slot="reference"
                size="mini"
                circle
                type="danger"
                icon="el-icon-delete"
              />
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        :title="TemplateTitle"
        :visible.sync="dialogTemplate"
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
          <el-form-item label="模板名称">
            <el-input v-model="TemplateRowData.TemplateName" />
          </el-form-item>
        </el-form>
        <el-form
          size="mini"
          label-position="top"
        >
          <el-form-item label="模板内容">
            <div
              v-if="!isFullscreen"
              style="height: 350px"
            >
              <wangeditor
                ref="wangEdit2"
                @change="getContent2"
              />
            </div>
            <div
              v-else
              style="height: 550px"
            >
              <wangeditor
                ref="wangEdit2"
                @change="getContent2"
              />
            </div>
          </el-form-item>
        </el-form>
        <span>
          <el-button
            size="small"
            @click="dialogTemplate = false"
          >关 闭</el-button>
          <el-button
            v-show="TemplateButtonShow"
            type="primary"
            size="small"
            @click="
              TemplateTitle == '修改模板'
                ? UpdateFormTemplate()
                : InsertFormTemplate()
            "
          >提交</el-button>
        </span>
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
            v-if="!TemplateShow"
            :current-page="formInline.pageIndex"
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size="formInline.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="formInline.Total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
          <el-pagination
            v-if="TemplateShow"
            :current-page="selelctTemplateVal.pageIndex"
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size="selelctTemplateVal.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="selelctTemplateVal.Total"
            @size-change="handleSizeChange2"
            @current-change="handleCurrentChange2"
          />
        </el-col>
      </el-row>
    </el-footer>
  </el-container>
</template>
<script>
import { mapGetters } from 'vuex';
import defaultDepts from '@/views/components/defaultDepts';
import defaultDept from '@/views/components/defaultDept';
import wangeditor from '@/components/Editor/index'; /* 富文本编辑器 */
import { PreviewFile } from '@/api/Article';
import {
  DeleteForm,
  DeleteFormTemplate,
  InsertForm,
  InsertFormTemplate,
  SelectForm,
  SelectFormDetailByID,
  SelectFormTemplate,
  SelectFormTemplateDetailByID,
  UpdateForm,
  UpdateFormTemplate
} from '@/api/RC_Form';

export default {
  components: {
    defaultDepts,
    defaultDept,
    wangeditor
  },
  data() {
    return {
      CatalogVersion: window.CatalogVersion, // 医院版本
      formInline: {
        FormName: '',
        TemplateName: '',
        DeptID: '',
        Date: '',
        pageIndex: 1,
        pageSize: 10,
        Total: 100,
        IsDraft: 0,
        CreateUserID: window.userInfo[0].UserID,
        State: this.$route.params.State || '',
        ExamineState: this.$route.params.ExamineState || ''
      },
      tableData: [],
      RoleCode: window.userInfo[0].RoleCode /* 当前用户角色 */,
      FormTitle: '新增表单',
      tableFromData: {
        FormName: '',
        FormTemplateID: '',
        FormContent: '',
        CreateUserID: window.userInfo[0].UserID,
        DeptName: window.userInfo[0].DeptName,
        DeptID: window.userInfo[0].DeptID,
        Date: '',
        Form_File_List: [],
        IsDraft: 0
      },
      TemplateShow: false,
      TemplateData: [],
      TemplateRowData: {},
      dialogTemplate: false,
      selelctTemplateVal: {
        pageIndex: 1,
        pageSize: 50,
        Total: '',
        TemplateName: ''
      },
      currentEdit: -1,
      TemplateTitle: '新增模板',
      rules: {
        FormName: [
          { required: true, message: '请填写表单名称', trigger: 'blur' }
        ]
      },
      formtableShow: true,
      dialogFrom: false,
      formButtonShow: true,
      TemplateButtonShow: true,
      cellOverflow: false,
      fileList: [],
      isFullscreen: false,
      checked: false
    };
  },
  computed: {
    ...mapGetters(['device'])
  },
  created() {
    this.SelectForm();
    this.SelectFormTemplate();
  },
  methods: {
    elSelect() {
      this.SelectForm('搜索');
    },
    async SelectForm(value) {
      try {
        this.formInline.pageIndex =
          value === '搜索' ? 1 : this.formInline.pageIndex;
        const { data } = await SelectForm(this.formInline);
        this.tableData = data.DataList;
        this.formInline.Total = data.Total;
      } catch (error) {
        console.log(error);
      }
    },

    InsertForm() {
      this.$refs.tableFromData.validate(async valid => {
        if (valid) {
          try {
            this.tableFromData.FormTemplateID =
              this.tableFromData.FormTemplateID == ''
                ? 0
                : this.tableFromData.FormTemplateID;
            const { code } = await InsertForm(this.tableFromData);
            code === 200
              ? this.$message.success('新增成功!')
              : this.$message.warning('新增失败');
            this.fileList = [];
            this.SelectForm();
            this.tableFromData.FormTemplateID =
              this.tableFromData.FormTemplateID == 0
                ? ''
                : this.tableFromData.FormTemplateID;
            this.tableFromData.Form_File_List = [];
            this.dialogFrom = false;
            this.formInline.IsDraft = this.formInline.IsDraft;
            this.tableFromData.IsDraft == 0
              ? (this.checked = false)
              : (this.checked = true);
          } catch (error) {
            console.log(error);
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    UpdateForm() {
      this.$refs.tableFromData.validate(async valid => {
        if (valid) {
          try {
            this.tableFromData.DeptID =
              typeof this.tableFromData.DeptID === 'string'
                ? this.tableFromData.DeptID
                : this.tableFromData.DeptID.join(',');
            this.tableFromData.FormTemplateID =
              this.tableFromData.FormTemplateID == ''
                ? 0
                : this.tableFromData.FormTemplateID;
            const { code } = await UpdateForm(this.tableFromData);
            this.tableFromData.FormTemplateID =
              this.tableFromData.FormTemplateID == 0
                ? ''
                : this.tableFromData.FormTemplateID;
            code === 200
              ? this.$message.success('更新成功!')
              : this.$message.warning('更新失败');
            this.SelectForm();
            this.dialogFrom = false;
          } catch (error) {
            console.log(error);
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    async DeleteForm(row) {
      try {
        if (
          row.CreateUserID != window.userInfo[0].UserID &&
          window.userInfo[0].RoleCode != 'R0001'
        ) {
          this.$message.warning('您没有权限删除修改权限');
          return;
        }
        const { code } = await DeleteForm({ FormID: row.FormID });
        code === 200
          ? this.$message.success('删除成功!')
          : this.$message.warning('删除失败');
        this.SelectForm();
      } catch (error) {
        console.log(error);
      }
    },
    async selectTemplate(val) {
      const { data } = await SelectFormTemplateDetailByID({
        FormTemplateID: val
      });
      this.tableFromData.FormContent = data[0].TemplateContent;
      this.$nextTick(() => {
        this.$refs.wangEdit.setContent(this.tableFromData.FormContent);
      });
    },
    async EditForm(row, str) {
      this.formInline.IsDraft == 1
        ? (this.FormTitle = '修改草稿')
        : (this.FormTitle = '修改表单');
      const { data } = await SelectFormDetailByID({ FormID: row.FormID });
      this.formButtonShow = str !== '查看';
      this.dialogFrom = true;
      const date = new Date();
      const year = date.getFullYear().toString();
      const month =
        date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1).toString()
          : (date.getMonth() + 1).toString(); // '04'
      const today = year + '-' + month;
      this.tableFromData = {
        FormName: row.FormName,
        FormID: row.FormID,
        FormTemplateID: row.FormTemplateID == 0 ? '' : row.FormTemplateID,
        FormContent: data.FormContent,
        CreateUserID: window.userInfo[0].UserID,
        DeptName: window.userInfo[0].DeptName,
        DeptID: row.DeptID ? row.DeptID.split(',') : [],
        Date: row.Date || today,
        Form_File_List: data.Form_File_List
      };
      this.$nextTick(() => {
        this.$refs.wangEdit.setContent(data.FormContent);
      });
    },
    handleSizeChange(val) {
      this.formInline.pageSize = val;
      this.SelectForm();
    },
    handleCurrentChange(val) {
      this.formInline.pageIndex = val;
      this.SelectForm();
    },
    handleSizeChange2(val) {
      this.selelctTemplateVal.pageSize = val;
      this.SelectFormTemplate();
    },
    handleCurrentChange2(val) {
      this.selelctTemplateVal.pageIndex = val;
      this.SelectFormTemplate();
    },
    addTable() {
      this.FormTitle = '新增表单';
      this.dialogFrom = true;
      this.formButtonShow = true;
      const date = new Date();
      const year = date.getFullYear().toString();
      const month =
        date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1).toString()
          : (date.getMonth() + 1).toString(); // '04'

      const today = year + '-' + month;

      this.tableFromData = {
        FormName: '',
        FormTemplateID: '',
        FormContent: '',
        CreateUserID: window.userInfo[0].UserID,
        DeptName: window.userInfo[0].DeptName,
        DeptID: window.userInfo[0].DeptID,
        Date: today,
        Form_File_List: []
      };
      this.$nextTick(() => {
        this.$refs.wangEdit.setContent(' ');
      });
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
    async UpdateFormTemplate() {
      try {
        if (!this.TemplateRowData.TemplateName) {
          this.$message.warning('请输入模板名称');
          return;
        }
        const { code } = await UpdateFormTemplate({
          FormTemplateID: this.TemplateRowData.FormTemplateID,
          TemplateContent: this.TemplateRowData.TemplateContent,
          TemplateName: this.TemplateRowData.TemplateName
        });
        code === 200
          ? this.$message.success('更新成功!')
          : this.$message.warning('更新失败');
        this.SelectFormTemplate();
        this.dialogTemplate = false;
      } catch (error) {
        console.log(error);
      }
    },
    async DeleteFormTemplate(row) {
      try {
        const { code } = await DeleteFormTemplate({
          FormTemplateID: row.FormTemplateID
        });
        code === 200
          ? this.$message.success('删除成功!')
          : this.$message.warning('删除失败');
        this.SelectFormTemplate();
      } catch (error) {
        console.log(error);
      }
    },
    getContent(val) {
      this.tableFromData.FormContent = val;
    },
    getContent2(val) {
      this.TemplateRowData.TemplateContent = val;
    },
    insetTypeData() {
      this.TemplateTitle = '新增模板';
      this.dialogTemplate = true;
      this.TemplateButtonShow = true;
      this.TemplateRowData = {
        TemplateName: '',
        TemplateContent: ''
      };
      this.$nextTick(() => {
        this.$refs.wangEdit2.setContent(' ');
      });
    },
    async InsertFormTemplate() {
      try {
        if (!this.TemplateRowData.TemplateName) {
          this.$message.warning('请输入模板名称');
          return;
        }
        const { code } = await InsertFormTemplate(this.TemplateRowData);
        code === 200
          ? this.$message.success('新增成功!')
          : this.$message.warning('新增失败');
        this.SelectFormTemplate();
        this.dialogTemplate = false;
      } catch (error) {
        console.log(error);
      }
    },
    async EditTemplate(row, str) {
      const { data } = await SelectFormTemplateDetailByID({
        FormTemplateID: row.FormTemplateID
      });
      this.TemplateButtonShow = str !== '查看';
      this.TemplateTitle = '修改模板';
      this.TemplateRowData = data[0];
      this.dialogTemplate = true;
      this.$nextTick(() => {
        this.$refs.wangEdit2.setContent(this.TemplateRowData.TemplateContent);
      });
    },
    radioGroup() {
      this.FormTitle = '新增表单';
      this.TemplateTitle = '新增模板';
      this.tableFromData = {
        FormName: '',
        FormTemplateID: '',
        FormContent: '',
        CreateUserID: window.userInfo[0].UserID,
        DeptID: window.userInfo[0].DeptID,
        Date: this.tableFromData.Date
      };
      this.TemplateRowData = {};
    },
    handleClose() {
      if (this.FormTitle != '新增表单' || !this.tableFromData.FormName) {
        this.dialogFrom = false;
        return;
      }
      this.$confirm('是否存为草稿?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          this.tableFromData.IsDraft = 1;
          this.FormTitle == '新增表单' ? this.InsertForm() : this.UpdateForm();
          this.$message.success('存为草稿成功!');
          this.dialogFrom = false;
        })
        .catch(error => {
          console.log(error);
          this.dialogFrom = false;
        });
    },
    addDraft() {
      this.tableFromData.IsDraft = 1;
      this.formInline.IsDraft = 1;
      this.FormTitle == '新增表单' ? this.InsertForm() : this.UpdateForm();
    },
    getDefaultDeptValues(val) {
      this.formInline.DeptID = val;
      this.SelectForm('搜索');
    },
    getDefaultDeptValue(val) {
      this.tableFromData.DeptID = val.join(',');
    },
    handleSuccess(response, file) {
      if (response.code === 200) {
        const data = response.data[0];
        this.tableFromData.Form_File_List.push({
          FileName: data.FileName,
          FileUrl: data.FileUrl,
          OpenFileUrl: data.OpenFileUrl
        });
      } else {
        this.tableFromData.Form_File_List = [];
        this.$message.error(file.name + '上传失败');
      }
    },
    deleteFile(index) {
      this.tableFromData.Form_File_List.splice(index, 1);
    },
    resize(val) {
      this.isFullscreen = val;
    },
    checkbox(val) {
      val ? (this.formInline.IsDraft = 1) : (this.formInline.IsDraft = 0);
      this.SelectForm();
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
    },
    selectChange(val) {
      if (!val) {
        this.formInline.State = '';
      }
      this.SelectForm('搜索');
    }
  }
};
</script>
<style lang="scss">
.homemadeForm {
  .el-header {
    padding: 0px;
    margin: 2px;
    height: 30px !important;
  }
  .el-main {
    padding: 0px;
    margin: 2px;
    overflow-y: auto;
    height: calc(100vh - 170px);
  }
  .el-footer {
    padding: 0px;
    margin: 2px;
  }
  .el-select-dropdown,
  .w-e-text-container,
  .w-e-menu {
    z-index: 999 !important;
  }
  .w-e-text-container {
    height: 85% !important;
    z-index: 100 !important;
  }
}
</style>
