<template>
  <div class="DepartmentSelfExamination">
    <div slot="header" class="clearfix">
      <el-form :inline="true" :model="listQuery" size="mini">
        <el-form-item>
          <el-input
            v-model="listQuery.RC_ProjectName"
            placeholder="项目名称"
            style="width: 220px"
            size="mini"
            clearable
            @keyup.enter.native="clickSelectUseTemp()"
          />
        </el-form-item>
        <el-form-item>
          <default-depts
            v-if="!addFormData.RC_InspectionDepartmentID"
            w="100%"
            :value="addFormData.RC_InspectionDepartmentID"
            @getDefaultDeptsValue="getDefaultDeptValues"
          />
          <el-input
            v-else
            v-model="listQuery.RC_InspectionDepartment"
            @focus="focus"
          />
        </el-form-item>
        <el-form-item prop="CheckMonth">
          <el-date-picker
            v-model="listQuery.CheckMonth"
            type="month"
            value-format="yyyy-MM"
            placeholder="选择自查月份"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="info"
            icon="el-icon-search"
            size="mini"
            :loading="listLoading"
            @click="clickSelectUseTemp"
          >搜索
          </el-button>
        </el-form-item>
        <el-form-item style="width: 150px">
          <el-select v-model="downloadValue" placeholder="请选择要导出数据">
            <el-option label="前一百条" :value="100" />
            <el-option label="前三百条" :value="300" />
            <el-option label="前五百条" :value="500" />
            <el-option label="前一千条" :value="1000" />
            <el-option label="全部" :value="pagination.total" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="downloadLoading"
            :disabled="listLoading"
            type="success"
            icon="el-icon-document"
            size="mini"
            @click="handleDownload"
          >导出
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content">
      <el-table
        v-loading="listLoading"
        :data="tableData"
        style="width: 100%"
        border
        size="mini"
        height="calc(100vh - 260px)"
        stripe
      >
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column
          prop="RC_ProjectName"
          label="项目名称"
          min-width="300"
          :show-overflow-tooltip="cellOverflow"
        />
        <el-table-column
          prop="RC_InspectionTimeStat"
          label="检查日期"
          width="135"
          align="center"
        >
          <template slot-scope="scope">
            {{
              scope.row.RC_InspectionTimeStat
                ? scope.row.RC_InspectionTimeStat.replace('T', ' ')
                : ''
            }}
          </template>
        </el-table-column>
        <el-table-column
          prop="RC_InspectionDepartmentName"
          label="自查科室"
          width="120"
          align="center"
          :show-overflow-tooltip="cellOverflow"
        />
        <el-table-column prop="Score" label="自查得分" width="80" align="center" />
        <el-table-column prop="ZCScore" label="督查得分" width="80" align="center" />
        <!--        <el-table-column prop="ZgCScore" label="督导得分" width="80" align="center" />-->

        <el-table-column
          prop="StatusName"
          label="状态"
          width="130"
          align="center"
        />

        <el-table-column
          prop="RC_AllAuditOpinion"
          label="总审核意见"
          width="150"
          align="center"
          :show-overflow-tooltip="cellOverflow"
        />
        <el-table-column
          prop="RC_DeductedPoints"
          label="自查存在的问题"
          width="300"
          :show-overflow-tooltip="cellOverflow"
        />
        <el-table-column
          prop="RC_InspectorName"
          label="检查者"
          width="100"
          align="center"
          :show-overflow-tooltip="cellOverflow"
        />
        <el-table-column
          prop="RC_InspectorOtherName"
          label="协同检查者"
          width="140"
          align="center"
          :show-overflow-tooltip="cellOverflow"
        />
        <el-table-column
          prop="RC_FillerName"
          label="填写者"
          width="100"
          align="center"
          :show-overflow-tooltip="cellOverflow"
        />
        <el-table-column prop="RC_Remarks" label="项目备注" />
        <el-table-column label="审核" fixed="right" align="center" width="60">
          <template slot-scope="scope">
            <el-button
              size="mini"
              class="iconfont al-icon-shenhe3"
              @click="userTemplateButton(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="归档" fixed="right" align="center" width="60">
          <template slot-scope="scope">
            <el-button
              size="mini"
              class="iconfont al-icon-guidang2"
              @click="Archive(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <el-col :span="1">
          <el-switch v-model="cellOverflow" style="margin: 6px 0" />
        </el-col>
        <el-col :span="20">
          <el-pagination
            background
            :current-page.sync="pagination.pageIndex"
            :page-size="pagination.pageSize"
            :page-sizes="pagination.pageSizes"
            :total="pagination.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-col>
      </el-row>
    </div>
    <!-- 审核 弹窗 -->
    <el-dialog
      :title="useTemplateDialogTitle"
      :visible.sync="dialogUseTemplate"
      fullscreen
      :width="device === 'desktop' ? '50%' : '90%'"
      :top="device === 'desktop' ? '0' : '1rem'"
      :before-close="cancle"
      height="calc(100vh - 230px)"
      @resize="resize"
    >
      <el-header :style="{ height: isFullscreen ? '130px' : '170px' }">
        <el-form
          ref="addFormData"
          size="mini"
          :model="addFormData"
          label-position="left"
          :inline="true"
        >
          <el-form-item label="项目名称" prop="RC_ProjectName">
            <el-input
              v-model="addFormData.RC_ProjectName"
              :disabled="true"
              clearable
            />
          </el-form-item>
          <el-form-item label="自查科室">
            <el-input
              v-model="addFormData.RC_InspectionDepartmentName"
              :disabled="true"
              @focus="focus"
            />
          </el-form-item>
          <el-form-item label="检查日期" prop="RC_InspectionTimeStat">
            <el-date-picker
              v-model="addFormData.RC_InspectionTimeStat"
              :disabled="true"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 100%"
              placeholder="选择日期"
              clearable
            />
          </el-form-item>
          <el-form-item label="自查月份">
            <el-date-picker
              v-model="addFormData.CheckMonth"
              :disabled="true"
              type="month"
              value-format="yyyy-MM"
              placeholder="选择月"
            />
          </el-form-item>
          <el-form-item label="主检查者" prop="RC_Inspector">
            <el-input
              v-model="addFormData.RC_Inspector"
              :disabled="true"
              clearable
            />
          </el-form-item>
          <el-form-item label="协同检查者" prop="RC_InspectorOther">
            <el-input
              v-model="addFormData.RC_InspectorOther"
              :disabled="true"
              clearable
            />
          </el-form-item>
          <el-form-item label="项目备注">
            <el-input
              v-model="addFormData.RC_Remarks"
              :disabled="true"
              clearable
            />
          </el-form-item>
          <el-form-item label="模板名称" prop="RC_TemplateName">
            <el-input v-model="addFormData.RC_TemplateName" :disabled="true" />
          </el-form-item>
        </el-form>
        <el-form size="mini" :inline="true">
          <el-form-item label="总审核意见">
            <el-input
              v-model="addFormData.RC_AllAuditOpinion"
              type="textarea"
            />
          </el-form-item>
          <el-form-item label="注意事项">
            <el-input v-model="addFormData.Precautions" :disabled="true" />
          </el-form-item>
        </el-form>
      </el-header>
      <el-main height="calc(100vh - 300px)">
        <el-table
          v-if="addFormData.CaseJudgment == 1"
          ref="multipleTable"
          :data="addFormData.Rc_CaseDetail"
          border
          size="mini"
          height="200"
        >
          <el-table-column type="index" align="center" />
          <el-table-column label="住院号" prop="HospitalNumber" />
          <el-table-column label="患者姓名" prop="PatientName" />
          <el-table-column label="医疗组名称" prop="MedicalGroupName" />
        </el-table>
        <el-table
          v-loading="loadingTemplate"
          :data="TemplateTableData"
          style="width:96%;margin:0 auto"
          :height="
            addFormData.CaseJudgment == 1
              ? 'calc(100vh - 400px)'
              : 'calc(100vh - 250px)'
          "
          border
          size="mini"
          :span-method="objectSpanMethod"
        >
          <el-table-columnx
            type="index"
            label="序号"
            width="60"
            align="center"
          />
          <el-table-column
            label="类别"
            prop="Category"
            min-width="50px"
            align="center"
            :show-overflow-tooltip="cellOverflow"
          />
          <el-table-column
            label="检查项目"
            prop="ProjectContent"
            min-width="60px"
            align="center"
            :show-overflow-tooltip="cellOverflow"
          />
          <el-table-column label="检查内容" prop="Content" min-width="100px" />
          <el-table-column
            label="预览资料"
            width="80"
            align="center"
            prop="FileList_dto"
            :show-overflow-tooltip="cellOverflow"
          >
            <template slot-scope="{ row }">
              <el-link
                v-for="(itemHref, indexHref) in row.FileList_dto"
                :key="indexHref"
                target="_blank"
                @click="PreviewFile(itemHref.FileUrl)"
              >{{ itemHref.FileName }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column
            label="下载资料"
            width="80"
            align="center"
            prop="FileList_dto"
            :show-overflow-tooltip="cellOverflow"
          >
            <template slot-scope="{ row }">
              <el-link
                v-for="(itemHref, indexHref) in row.FileList_dto"
                :key="indexHref"
                :href="itemHref.FileUrl"
                target="_blank"
              >{{ itemHref.FileName }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column
            label="总分"
            width="60"
            align="center"
            prop="ScoreCriteria"
            :show-overflow-tooltip="cellOverflow"
          >
            <!-- <template slot-scope="scope">
                  <span>{{ scope.row.Grade.reduce((a, b) => a + b, 0) }}</span>
                </template>-->
          </el-table-column>
          <el-table-column
            label="自查得分"
            width="60"
            align="center"
            prop="RC_Score"
          />
          <el-table-column
            label="自查扣分选项"
            prop="RC_DeductedPoints"
            minwidth="80"
            align="center"
            :show-overflow-tooltip="cellOverflow"
          >
            <template slot-scope="scope">
              <el-tag v-for="item in scope.row.RC_DeductedPoints " style="margin: 4px">
                {{ item || '无扣分选项' }}
              </el-tag>
              <!--              <el-select-->
              <!--                v-model="scope.row.RC_DeductedPoints"-->
              <!--                multiple-->

              <!--                collapse-tags-->
              <!--                size="mini"-->
              <!--                placeholder="请选择扣分选项"-->
              <!--                clearable-->
              <!--                :style="{ width: '100%' }"-->
              <!--                @change="DeductedPoints(scope.row.RC_DeductedPoints, scope.row)"-->
              <!--              >-->
              <!--                <el-option-->
              <!--                  v-for="(item, indexCheck) in scope.row.Check"-->
              <!--                  :key="indexCheck"-->
              <!--                  :label="item.ErrorContent"-->
              <!--                  :value="item.ErrorContent"-->
              <!--                />-->
              <!--              </el-select>-->
            </template>
          </el-table-column>

          <el-table-column
            label="科室整改措施"
            align="center"
            prop="RC_RectificationMeasures"
            min-width="80px"
            :show-overflow-tooltip="cellOverflow"
          >
            <template slot-scope="scope">
              {{ scope.row.RC_RectificationMeasures }}
              <!--              <el-input-->

              <!--                v-model="scope.row.RC_RectificationMeasures"-->
              <!--                type="textarea"-->
              <!--                size="mini"-->
              <!--              />-->
            </template>
          </el-table-column>
          <el-table-column
            min-width="80px"
            label="效果评价"
            align="center"
            prop="RC_Opinion"
            :show-overflow-tooltip="cellOverflow"
          >
            <template slot-scope="scope">
              {{ scope.row.RC_Opinion }}
              <!--              <el-input-->
              <!--                v-model="scope.row.RC_Opinion"-->
              <!--                type="textarea"-->
              <!--                size="mini"-->
              <!--              />-->
            </template>
          </el-table-column>
          <el-table-column
            label="自查备注"
            prop="RC_DeductedPointsRemarks"
            minwidth="80"
            align="center"
            :show-overflow-tooltip="cellOverflow"
          >
            <template slot-scope="scope">
              {{ scope.row.RC_DeductedPointsRemarks }}
            </template>
          </el-table-column>
          <el-table-column
            label="督查得分"
            width="100"
            align="center"
            prop="ZCScore"
            :show-overflow-tooltip="cellOverflow"
          >
            <template slot-scope="scope">
              <span v-if="addFormData.Status == 6">
                {{ scope.row.ZCScore }}
              </span>
              <el-input
                v-else
                v-model="scope.row.ZCScore"
                size="mini"
                width="150px"
                type="number"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="督查意见"
            prop="ZCErro"
            minwidth="80"
            align="center"
            :show-overflow-tooltip="cellOverflow"
          >
            <template slot-scope="scope">
              <span v-if="addFormData.Status == 6">
                {{ scope.row.ZCErro }}
              </span>
              <el-input
                v-else
                v-model="scope.row.ZCErro"
                size="mini"
                type="textarea"
                width="200"
              />
            </template>
          </el-table-column>

          <el-table-column
            label="主管部门整改措施"
            prop="ZgCErro"
            width="150"
            align="center"
            :show-overflow-tooltip="cellOverflow"
          >
            <template slot-scope="scope">
              <span v-if="addFormData.Status == 6">
                {{ scope.row.ZgCErro }}
              </span>
              <el-input
                v-else
                v-model="scope.row.ZgCErro"
                size="mini"
                type="textarea"
                width="100"
              />
            </template>
          </el-table-column>


          <el-table-column
            label="审核意见"
            align="center"
            prop="RC_AuditOpinion"
            min-width="80px"
            :show-overflow-tooltip="cellOverflow"
          >
            <template slot-scope="scope">
              <span v-if="addFormData.Status == 6">
                {{ scope.row.RC_AuditOpinion }}
              </span>
              <el-input
                v-else
                v-model="scope.row.RC_AuditOpinion"
                type="textarea"
                size="mini"
                clearable
              />
            </template>
          </el-table-column>
        </el-table>
        <el-switch
          v-model="cellOverflow"
          active-text="收起"
          inactive-text="展开"
          style="margin: 6px 0px"
        />

      </el-main>
      <span slot="footer" class="dialog-footer">
        <el-tag v-if="addFormData.Status == 6" type="info">
          温馨提示：督导层级已审核，不可再审核
        </el-tag>
        <el-button size="small" @click="cancle()">取 消</el-button>
        <el-button
          :disabled="addFormData.Status == 6 ? true : false"
          type="primary"
          size="small"
          @click="submitTemplate(4)"
        >
          通过</el-button>
        <el-button
          :disabled="addFormData.Status == 6 ? true : false"
          type="primary"
          size="small"
          @click="submitTemplate(5)"
        >退回</el-button>
      </span>
    </el-dialog>
    <!-- 归档 -->
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :width="device === 'desktop' ? '40%' : '95%'"
      height="400px"
    >
      <el-row>
        <el-col :span="7" :xs="12" :sm="12">
          <standardCatalog
            maxheight="500px"
            @nodeClickCatalog="nodeClickCatalog"
          />
        </el-col>
        <!-- <div style="width: 290px"> -->
        <el-col :span="8" :xs="12" :sm="12">
          <articlegroup
            style="width: 140px"
            @getSelectAllArticleGroupValue="getSelectAllArticleGroupValue"
          />
          <el-input
            v-model="catalogName"
            type="textarea"
            placeholder="条款要点"
            disabled
            :rows="12"
            style="margin-top: 5px"
          />
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancel">取 消</el-button>
        <el-button
          type="primary"
          size="mini"
          @click="InsertArticle"
        >确 定</el-button>
      </span>
    </el-dialog>
    <template-list
      ref="templatelist"
      :visible="innerVisible"
      @getTemplateID="templateList"
    />
  </div>
</template>
<script>
import standardCatalog from '@/views/components/standardCatalog';
import defaultDept from '@/views/components/defaultDept';
import defaultDepts from '@/views/components/defaultDepts';
import articlegroup from '@/views/components/articlegroup';
import templateList from '@/views/components/templateList';
import tableHeight from '@/views/mixin/tableHeight';
import { mapGetters } from 'vuex';
import { InsertArticle, PreviewFile } from '@/api/Article';
import {
  InsertUpdateReview,
  SelectTemplateByID,
  SelectUseDept,
  SelectUseTemp,
  SelectUseTempDetail
} from '@/api/RC_Template';

export default {
  name: 'DepartmentSelfExamination',
  components: {
    articlegroup,
    defaultDept,
    defaultDepts,
    templateList,
    standardCatalog
  },
  mixins: [tableHeight],
  data() {
    return {
      useTemplateDialogTitle: '审核项目',
      listLoading: true,
      dialogUseTemplate: false,
      innerVisible: false,
      downloadLoading: false,
      tableData: [],
      TemplateTableData: [],
      InspectionDepartments: [],
      listQuery: {
        RC_ManagementLevel: '科室自查',
        RC_InspectionDepartment: '',
        RC_FunctionalDepartment: '',
        RC_ProjectName: '',
        pageIndex: 1,
        pageSize: 20,
        Status: '',
        Step: 2
      },
      pagination: {
        pageIndex: 1,
        total: 0,
        pageSize: 20,
        pageSizes: [20, 50, 100, 150, 200]
      },
      addFormData: {
        RC_ProjectName: '',
        RC_TemplateName: '',
        RC_TemplateID: 0,
        RC_InspectionDepartmentID: 0,
        RC_ManagementLevel: '科室自查',
        RC_InspectionDepartment: 0,
        RC_InspectionTimeStat: '',
        RC_Inspector: '',
        RC_InspectorOther: '',
        RC_Filler: window.userInfo[0].UserID,
        RC_Remarks: '',
        Rc_checkcontent: [],
        RC_AllAuditOpinion: '',
        Status: 0,
        Step: 2,
        CaseJudgment: 0
      },
      RC_InspectionDepartmentID: 0,
      innerDisabled: false,
      spanOneArr: [],
      spanTwoArr: [],
      loadingTemplate: false,
      ErrorList_dto: [],

      /* 归档 */
      dialogVisible: false,
      title: '',
      catalogName: '',
      submitData: {
        Title: '',
        GroupID: 0,
        CatalogID: 0,
        Content: '',
        AuthorID: window.userInfo[0].UserID
      },
      downloadValue: '',
      cellOverflow: false,
      isFullscreen: true
    };
  },
  computed: {
    ...mapGetters(['device'])
  },
  created() {
    this.SelectUseTemp();
    this.SelectUseDept();
  },
  methods: {
    focus() {
      this.addFormData.RC_InspectionDepartmentID = 0;
    },
    getJBXXTableData() {
      this.spanOneArr = [];
      this.spanTwoArr = [];
      let concatOne = 0;
      let concatTwo = 0;
      this.TemplateTableData.map((item, index) => {
        if (index === 0) {
          this.spanOneArr.push(1);
          this.spanTwoArr.push(1);
        } else {
          if (item.Category === this.TemplateTableData[index - 1].Category) {
            // 第一列需合并相同内容的判断条件
            this.spanOneArr[concatOne] += 1;
            this.spanOneArr.push(0);
          } else {
            this.spanOneArr.push(1);
            concatOne = index;
          }
          if (
            item.ProjectContent ===
            this.TemplateTableData[index - 1].ProjectContent
          ) {
            // 第二列和第1列需合并相同内容的判断条件
            this.spanTwoArr[concatTwo] += 1;
            this.spanTwoArr.push(0);
          } else {
            this.spanTwoArr.push(1);
            concatTwo = index;
          }
        }
      });
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        const _row = this.spanOneArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return [_row, _col];
      } else if (columnIndex === 2) {
        const _row = this.spanTwoArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return [_row, _col];
      }
    },
    filtterTrim(value) {
      return value.filter(function(s) {
        return s && s.trim();
      });
    },
    DeductedPoints(value, row) {
      /* 计算得分 */
      let sum = 0;
      value.map((item, index) => {
        row.Check.map((item2, index2) => {
          if (item == item2.ErrorContent) {
            sum += item2.Grade;
          }
        });
      });
      row.RC_Score = row.ScoreCriteria - sum;
      this.addFormData.fullMark = 0;
      this.addFormData.totalPoints = 0;
      this.TemplateTableData.map(item => {
        this.addFormData.fullMark =
          parseFloat(this.addFormData.fullMark) +
          parseFloat(item.ScoreCriteria);
        this.addFormData.totalPoints =
          parseFloat(this.addFormData.totalPoints) + parseFloat(item.RC_Score);
      });
    },
    resetForm() {
      this.$refs.addFormData.resetFields();
    },
    cancle() {
      this.resetForm();
      this.innerDisabled = false;
      this.TemplateTableData = [];
      this.addFormData.RC_TemplateName = '';
      this.dialogUseTemplate = false;
    },
    async submitTemplate(val) {
      this.addFormData.Status = val;
      this.addFormData.Rc_checkcontent = this.TemplateTableData.map(item => {
        return {
          RC_DeductedPoints:
            item.RC_DeductedPoints == undefined ||
            item.RC_DeductedPoints == ''
              ? ''
              : item.RC_DeductedPoints.join('$'),
          RC_Score: item.RC_Score,
          RC_TotalScore: item.ScoreCriteria,
          RC_DeductedPointsRemarks: item.RC_DeductedPointsRemarks,
          CheckID: item.CheckID,
          RC_AuditOpinion: item.RC_AuditOpinion,
          RC_RectificationMeasures: item.RC_RectificationMeasures,
          RC_Opinion: item.RC_Opinion,
          FileList_dto: item.FileList_dto,
          ZCScore: item.ZCScore,
          ZCErro: item.ZCErro,
          ZgCScore: item.ZgCScore,
          ZgCErro: item.ZgCErro
        };
      });
      const fromData = this.addFormData;
      delete fromData.RC_TemplateName;
      const { msg } = await InsertUpdateReview(fromData);
      this.$message({
        type: 'success',
        message: msg
      });
      this.cancle();
      this.SelectUseTemp();
      this.cancle();
    },
    getDefaultDeptValues(v) {
      this.addFormData.RC_InspectionDepartment = v;
      this.listQuery.RC_InspectionDepartment = v;
    },
    listQueryGet(v) {
      this.listQuery.RC_InspectionDepartment = v;
    },
    async templateList(row) {
      this.loadingTemplate = true;
      row = JSON.parse(JSON.stringify(row));
      this.addFormData.RC_TemplateName = row.RC_TemplateName;
      this.addFormData.RC_TemplateID = row.TemplateID;
      try {
        const { data } = await SelectTemplateByID({
          TemplateID: row.TemplateID
        });
        this.TemplateTableData = this.dataFiltter(data.DataList);
        console.log('主要看下', this.TemplateTableData);
        this.getJBXXTableData();
      } catch {
      }
      this.loadingTemplate = false;
    },
    dataFiltter(arr) {
      const map = {};
      const result = [];
      for (var i = 0; i < arr.length; i++) {
        var item = arr[i];
        if (!map[item.Content]) {
          result.push({
            Content: item.Content,
            RC_ErrorID: [item.ErrorID],
            ErrorContent: [item.ErrorContent],
            Grade: [item.Grade],
            Check: [
              {
                ErrorContent: item.ErrorContent,
                Grade: item.Grade
              }
            ],
            CheckID: item.CheckID,
            RC_Score: item.ScoreCriteria,
            ScoreCriteria: item.ScoreCriteria,
            Type: item.Type,
            id: Number(
              Math.random()
                .toString()
                .substr(3, 3) + Date.now()
            ).toString(36),
            RC_DeductedPointsRemarks: item.ProjectContentRemark,
            Category: item.Category,
            ProjectContent: item.ProjectContent,
            RC_RectificationMeasures: item.RC_RectificationMeasures,
            RC_Opinion: item.RC_Opinion
          });
          map[item.Content] = item;
        } else {
          for (var j = 0; j < result.length; j++) {
            var dj = result[j];
            if (dj.Content === item.Content) {
              dj.RC_ErrorID.push(item.ErrorID);
              dj.ErrorContent.push(item.ErrorContent);
              dj.Grade.push(item.Grade);
              dj.Check.push({
                ErrorContent: item.ErrorContent,
                Grade: item.Grade
              });
              dj.RC_Score = item.ScoreCriteria;
              dj.RC_DeductedPointsRemarks = item.ProjectContentRemark;
              break;
            }
          }
        }
      }
      return result;
    },
    innerDialog() {
      this.$refs.templatelist.open();
    },
    async userTemplateButton(row) {
      this.dialogUseTemplate = true;
      row = JSON.parse(JSON.stringify(row));
      this.useTemplateDialogTitle = '审核项目' + row.RC_ProjectName;
      this.RC_InspectionDepartmentID = parseInt(row.RC_InspectionDepartmentID);
      this.addFormData = {
        // ID: row.ID,
        GUID: row.GUID,
        RC_ProjectName: row.RC_ProjectName,
        RC_TemplateName: row.RC_TemplateName,
        RC_TemplateID: row.RC_TemplateID,
        RC_InspectionDepartmentID: parseInt(row.RC_InspectionDepartmentID),
        RC_InspectionDepartmentName: row.RC_InspectionDepartmentName,
        RC_ManagementLevel: '科室自查',
        RC_InspectionDepartment: 0,
        RC_InspectionTimeStat: row.RC_InspectionTimeStat,
        RC_Inspector: row.RC_InspectorName,
        RC_InspectorOther: row.RC_InspectorOtherName,
        RC_Filler: window.userInfo[0].UserID,
        RC_Remarks: row.RC_Remarks,
        Rc_checkcontent: [],
        Step: 2,
        Status: row.Status,
        RC_AllAuditOpinion: row.RC_AllAuditOpinion,
        CaseJudgment: row.CaseJudgment,
        Rc_CaseDetail: [],
        Precautions: row.Precautions,
        CheckMonth: row.CheckMonth || ''
      };
      try {
        const { data } = await SelectUseTempDetail({
          TemplateID: row.RC_TemplateID,
          RC_ProjectName: row.RC_ProjectName,
          RC_InspectionDepartment: row.RC_InspectionDepartmentID
        });
        this.addFormData.Rc_CaseDetail = data.CaseDetail_dto_list;
        this.TemplateTableData = data.CheckContent_dto_list.map(item => {
          return {
            ZCScore: this.addFormData.Status === 3 ? item.RC_Score : item.ZCScore,
            ZCErro: item.ZCErro,
            ZgCScore: item.ZgCScore,
            ZgCErro: item.ZgCErro,
            CheckID: item.CheckID,
            Content: item.Content,
            ProjectContent: item.ProjectContent,
            ProjectContentRemark: item.ProjectContentRemark,
            Category: item.Category,
            RC_ProjectName: item.RC_ProjectName,
            RC_Score: item.RC_Score,
            ScoreCriteria: item.ScoreCriteria,
            RC_DeductedPoints: item.RC_DeductedPoints.split('$'),
            RC_DeductedPointsRemarks: item.RC_DeductedPointsRemarks,
            Grade: item.ErrorList_dto.map(item => {
              return item.Grade;
            }),
            Check: item.ErrorList_dto.map(item => {
              return { ErrorContent: item.ErrorContent, Grade: item.Grade };
            }),
            RC_RectificationMeasures: item.RC_RectificationMeasures,
            RC_Opinion: item.RC_Opinion,
            RC_AuditOpinion: item.RC_AuditOpinion,
            FileList_dto: item.FileList_dto
          };
        });
        this.getJBXXTableData();
      } catch (error) {
        console.log(error);
      }
    },
    async handleDownload() {
      let total;
      if (!this.downloadValue) {
        total = this.pagination.total;
      } else {
        total = this.downloadValue;
      }
      this.downloadLoading = true;
      try {
        const excel = await import('@/vendor/Export2Excel');
        const tHeader = [
          '项目名称',
          '检查日期',
          '自查科室',
          '总分',
          '状态',
          '存在问题',
          '检查者',
          '填写者',
          '填写人',
          '项目备注'
        ];
        const filterVal = [
          'RC_ProjectName',
          'RC_InspectionTimeStat',
          'RC_InspectionDepartmentName',
          'Score',
          'StatusName',
          'RC_DeductedPoints',
          'RC_InspectorName',
          'RC_InspectorOtherName',
          'RC_FillerName',
          'RC_Remarks'
        ];
        const { data } = await SelectUseTemp({
          RC_InspectionDepartment: this.listQuery.RC_InspectionDepartment,
          RC_FunctionalDepartment: this.listQuery.RC_FunctionalDepartment,
          RC_ProjectName: this.listQuery.RC_ProjectName,
          pageIndex: 1,
          pageSize: total,
          Step: 1
        });
        data.DataList.map(item => {
          item.RC_DeductedPoints = [
            ...new Set(item.RC_DeductedPoints.split('$'))
          ].join('\n');
        });
        const formData = this.formatJson(filterVal, data.DataList);
        excel.export_json_to_excel({
          header: tHeader,
          data: formData,
          filename: '文件名'
        });
        this.downloadLoading = false;
      } catch (error) {
        console.error(error);
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    getSelectTreeDept(value) {
      this.TreeDepts = value;
    },
    getDefaultDeptValue(value) {
      this.fromData.DeptID = value;
    },
    async SelectUseTemp() {
      try {
        const { data } = await SelectUseTemp(this.listQuery);
        this.tableData = data.DataList;
        this.tableData.map(item => {
          item.RC_DeductedPoints = [
            ...new Set(item.RC_DeductedPoints.split('$'))
          ].join('\n');
        });
        this.pagination.total = data.Total;
      } catch {
      } finally {
        this.listLoading = false;
      }
    },
    async clickSelectUseTemp() {
      this.listLoading = true;
      this.listQuery.pageIndex = 1;
      this.pagination.pageIndex = 1;
      this.SelectUseTemp();
    },
    handleCurrentChange(index) {
      this.listLoading = true;
      this.listQuery.pageIndex = index;
      this.SelectUseTemp();
    },
    handleSizeChange(page) {
      this.listLoading = true;
      this.listQuery.pageSize = page;
      this.clickSelectUseTemp();
    },
    async SelectUseDept() {
      try {
        const { data } = await SelectUseDept({
          Type: '自查科室',
          RC_ManagementLevel: '科室自查'
        });
        data.map(v => {
          for (const key in v) {
            if (v[key] === null) {
              delete v[key];
            }
          }
        });
        const newArr = [];
        for (const j in data) {
          for (const prop in data[j]) {
            if (prop !== '' || data[j][prop] !== '') {
              newArr.push(data[j]);
            }
          }
        }
        this.InspectionDepartments = [...new Set(newArr)];
      } catch {
      }
    },

    /* 归档 */
    async Archive(row) {
      row = JSON.parse(JSON.stringify(row));
      try {
        const { data } = await SelectUseTempDetail({
          TemplateID: row.RC_TemplateID,
          RC_ProjectName: row.RC_ProjectName,
          RC_InspectionDepartment: row.RC_InspectionDepartmentID
        });
        this.ErrorList_dto = data.CheckContent_dto_list;
      } catch {
      }
      this.title = row.RC_ProjectName;
      this.submitData.Title = row.RC_ProjectName;
      this.dialogVisible = true;
      this.formData = row;
    },
    cancel() {
      this.dialogVisible = false;
      this.title = '';
      this.catalogName = '';
    },
    nodeClickCatalog(v) {
      this.catalogName = v.CatalogName;
      this.submitData.CatalogID = v.CatalogID;
      this.formData.IsCriterion = v.IsCriterion;
      this.formData.Count = v.Count;
    },
    getSelectAllArticleGroupValue(v) {
      this.submitData.GroupID = v;
    },
    resize(val) {
      this.isFullscreen = val;
    },
    async InsertArticle() {
      if (
        (this.formData.IsCriterion == 1 || this.formData.Count == 0) &&
        this.submitData.GroupID != 0
      ) {
        const formData = this.formData;
        let newContent = '';
        this.ErrorList_dto.map(item => {
          newContent += `<tr align="left">
                <td>${item.Category}</td>
                <td>${item.ProjectContent}</td>
                <td>${item.Content}</td>
                <td>${item.ScoreCriteria}</td>
                <td>${item.RC_Score}</td>
                <td>${item.RC_RectificationMeasures}</td>
                <td>${item.RC_Opinion}</td>
                <td>${item.RC_DeductedPoints.split('$').join('\n')}</td>
                <td>${item.RC_DeductedPointsRemarks}</td>
            </tr>`;
        });
        this.submitData.Content = `<table border="1px solid #666666" style="border-collapse: collapse; " width="100%" align="center">
            <tr align = "center" >
                <th>项目名称</th>
                <th>自查科室</th>
                <th>总分</th>
                <th>检查时间</th>
                <th>存在问题</th>
                <th>归档人</th>
			      </tr>
            <tr align="left">
                <td>${formData.RC_ProjectName}</td>
                <td>${formData.RC_InspectionDepartmentName}</td>
                <td>${formData.Score}</td>
                <td>${formData.RC_InspectionTimeStat}</td>
                <td>${formData.RC_DeductedPoints}</td>
                <td>${window.userInfo[0].UserName}</td>
            </tr>
          </table>
          <br>
          <table border="1px solid #666666" style="border-collapse: collapse; " width="100%" align="center">
            <tr align = "center" >
                 <th>类别</th>
                <th>检查项目</th>
                <th>检查内容</th>
                <th>默认分值（分）</th>
                <th>最终得分（分）</th>
                <th>整改措施</th>
                <th>效果评价</th>
                <th>扣分原因</th>
                <th>扣分原因备注</th>
            </tr>
            ${newContent}
          </table>`;
        try {
          const { msg } = await InsertArticle(this.submitData);
          this.$message({
            type: 'success',
            message: msg
          });
        } catch {
        }
        this.cancel();
      } else {
        this.$notify({
          title: '警告',
          type: 'warning',
          message: '请选择 资料类别和子集评审标准！'
        });
      }
    },
    async PreviewFile(val) {
      /* 资料预览 */
      val = val.replace(/Annex\/file\/|\//g, '');
      const { data } = await PreviewFile({ Title: val });
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
.DepartmentSelfExamination {
  margin: 4px;

  .el-header,
  .el-main {
    padding: 0px;
    margin: 0px;
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
