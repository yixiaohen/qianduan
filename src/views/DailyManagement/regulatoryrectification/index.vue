<template>
  <el-container class="RegulatoryRectification">
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
          :model="listQuery"
          size="mini"
        >
          <el-form-item>
            <el-input
              v-model="listQuery.RC_ProjectName"
              placeholder="项目名称"
              style="width: 180px"
              size="mini"
              clearable
              @keyup.enter.native="clickSelectOpinions()"
            />
          </el-form-item>
          <el-divider direction="vertical" />
          <el-form-item>
            <el-select
              v-model="listQuery.IsRequired"
              placeholder="是否为必填"
              clearable
              @change="selectChange"
            >
              <el-option
                label="是"
                value="1"
              />
              <el-option
                label="否"
                value="0"
              />
            </el-select>
          </el-form-item>
          <el-divider direction="vertical" />
          <el-form-item>
            <el-select
              v-model="listQuery.Status"
              placeholder="提交审核状态"
              clearable
            >
              <el-option
                label="待执行"
                value="1"
              />
              <el-option
                label="待提交"
                value="2"
              />
              <el-option
                label="已提交"
                value="3"
              />
              <el-option
                label="主管审核通过"
                value="4"
              />
              <el-option
                label="主管审核退回"
                value="5"
              />
              <el-option
                label="质管审核通过"
                value="6"
              />
              <el-option
                label="质管审核退回"
                value="7"
              />
            </el-select>
          </el-form-item>

          <el-divider direction="vertical" />
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
          <el-divider direction="vertical" />
          <el-form-item prop="CheckMonth">
            <el-date-picker
              v-model="listQuery.CheckMonth"
              type="month"
              value-format="yyyy-MM"
              placeholder="选择自查月份"
            />
          </el-form-item>
          <el-divider direction="vertical" />
          <el-form-item>
            <el-select
              v-model="listQuery.CommitStatus"
              placeholder="填写状态"
              clearable
            >
              <el-option
                label="已填写"
                value="已填写"
              />
              <el-option
                label="未填写"
                value="未填写"
              />
              <el-option
                label="超时未填写"
                value="超时未填写"
              />
            </el-select>
          </el-form-item>
          <el-divider direction="vertical" />
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              :loading="listLoading"
              @click="clickSelectOpinions"
            >搜索
            </el-button>
          </el-form-item>
          <el-divider direction="vertical" />
          <el-form-item style="width: 150px">
            <el-select
              v-model="downloadValue"
              placeholder="请选择要导出数据"
            >
              <el-option
                label="前一百条"
                :value="100"
              />
              <el-option
                label="前三百条"
                :value="300"
              />
              <el-option
                label="前五百条"
                :value="500"
              />
              <el-option
                label="前一千条"
                :value="1000"
              />
              <el-option
                label="全部"
                :value="listQuery.total"
              />
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

        <el-table
          v-loading="listLoading"
          :data="tableData"
          style="width: 100%;margin-top: 10px"
          border
          highlight-current-row
          size="mini"
          height="calc(100vh - 270px)"
          stripe
          @cell-click="cellClick"
        >
          <el-table-column
            label="序号"
            type="index"
            width="60"
            align="center"
          />
          <el-table-column
            label="项目名称"
            prop="RC_ProjectName"
            min-width="300"
            :show-overflow-tooltip="cellOverflow"
          />
          <el-table-column
            label="主管部门"
            width="160"
            align="center"
            prop="RC_FunctionalDepartmentName"
            :show-overflow-tooltip="cellOverflow"
          />
          <el-table-column
            label="被查科室"
            width="160"
            align="center"
            prop="RC_InspectionDepartmentName"
            :show-overflow-tooltip="cellOverflow"
          />
          <el-table-column
            label="必填表单"
            width="120"
            align="center"
            prop="IsRequired"
          >
            <template slot-scope="{ row }">
              {{ row.IsRequired == 0 ? '否' : '是' }}
            </template>
          </el-table-column>
          <el-table-column
            label="自查得分"
            prop="Score"
            width="80"
            align="center"
          />
          <el-table-column
            label="督查得分"
            prop="ZCScore"
            width="80"
            align="center"
          />
          <!--        <el-table-column-->
          <!--          label="督导得分"-->
          <!--          prop="ZgCScore"-->
          <!--          width="80"-->
          <!--          align="center"-->
          <!--        />-->
          <el-table-column
            v-if="CatalogVersion =='综合医院' ? true: false"
            prop="StatusName"
            label="状态"
            width="130"
            align="center"
            :show-overflow-tooltip="cellOverflow"
          >
            <template slot-scope="{ row }">
              {{ row.StatusName == '质管审核退回' ? '医务审核退回' : row.StatusName }}
            </template>
          </el-table-column>

          <el-table-column
            v-else
            prop="StatusName"
            label="状态"
            width="130"
            align="center"
            :show-overflow-tooltip="cellOverflow"
          />

          <el-table-column
            prop="RC_AllAuditOpinion"
            label="总审核意见"
            width="150"
            align="center"
            :show-overflow-tooltip="cellOverflow"
          />
          <el-table-column
            label="检查时间"
            width="135"
            align="center"
            prop="RC_InspectionTimeStat"
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
            label="自查存在的问题"
            prop="RC_DeductedPoints"
            width="200"
            :show-overflow-tooltip="cellOverflow"
          />
          <el-table-column
            label="查看"
            fixed="right"
            align="center"
            width="60"
          >
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                class="el-icon-view"
                @click="userTemplateButton(scope.row,1)"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="审核"
            fixed="right"
            align="center"
            width="60"
          >
            <template slot-scope="scope">
              <el-button
                :disabled="scope.row.Status < 3"
                size="mini"
                class="iconfont al-icon-shenhe3"
                @click="userTemplateButton(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="归档"
            align="center"
            fixed="right"
            width="60"
          >
            <template slot-scope="scope">
              <el-button
                :disabled="scope.row.Status < 3"
                size="mini"
                class="iconfont al-icon-guidang2"
                @click="Archive(scope.row)"
              />
            </template>
          </el-table-column>
        </el-table>
        <!-- 查看 弹窗 -->
        <el-dialog
          title="查看"
          :visible.sync="isShowSeeDia"
          :width="device === 'desktop' ? '50%' : '90%'"
          height="calc(100vh - 230px)"
          @resize="resize"
        >
          <el-header :style="{ height: isFullscreen ? '130px' : '230px' }">
            <el-form
              ref="addFormData"
              size="mini"
              label-width="96px"
              :model="addFormData"
              label-position="right"
              :inline="true"
              class="seeAddFormData"
            >
              <el-row>
                <el-col :span="8"><span>项目名称：{{ addFormData.RC_ProjectName }}</span></el-col>
                <el-col :span="8"><span>自查科室：{{ addFormData.RC_InspectionDepartmentName }}</span></el-col>
                <el-col :span="8"><span>检查日期：{{ addFormData.RC_InspectionTimeStat?addFormData.RC_InspectionTimeStat.replace('T',' '):'' }} </span></el-col>
              </el-row>
              <el-row>
                <el-col :span="8"><span>自查月份：{{ addFormData.CheckMonth }}</span></el-col>
                <el-col :span="8"><span>主检查者：{{ addFormData.RC_Inspector }}</span></el-col>
                <el-col :span="8"><span>协同检查者：{{ addFormData.RC_InspectorOther }} </span></el-col>
              </el-row>
              <el-row>
                <el-col :span="12"><span>项目备注：{{ addFormData.RC_Remarks }}</span></el-col>
                <el-col :span="12"><span>模板名称：{{ addFormData.RC_TemplateName }}</span></el-col>
              </el-row>
              <el-row>
                <el-col :span="12"><span>总审核意见：{{ addFormData.RC_AllAuditOpinion }}</span></el-col>
                <el-col :span="12"><span>注意事项：{{ addFormData.Precautions }}</span></el-col>
              </el-row>
            </el-form>
          </el-header>

          <div style="flex: 1">
            <el-table
              v-if="addFormData.CaseJudgment == 1"
              v-loading="ZGCheckLoading"
              ref="multipleTable"
              :data="addFormData.Rc_CaseDetail"
              border
              style="margin-top: 30px"
              size="mini"
              height="200"
            >
              <el-table-column
                type="index"
                align="center"
              />
              <el-table-column
                label="
              住院号"
                prop="HospitalNumber"
              />
              <el-table-column
                label="患者姓名"
                prop="PatientName"
              />
              <el-table-column
                label="医疗组名称"
                prop="MedicalGroupName"
              />
            </el-table>
            <el-table
              v-loading="ZGCheckLoading"
              :data="TemplateTableData"
              style="width:100%;margin-top: 30px"
              :height="
                addFormData.CaseJudgment == 1
                  ? 'calc(100vh - 400px)'
                  : 'calc(100vh - 250px)'
              "
              border
              size="mini"
              :span-method="objectSpanMethod"
              stripe
            >
              <el-table-column
                type="index"
                label="序号"
                width="60"
                align="center"
              />
              <el-table-column
                label="类别"
                prop="Category"
                width="80px"
                align="center"
                :show-overflow-tooltip="cellOverflow"
              />
              <el-table-column
                label="检查项目"
                prop="ProjectContent"
                width="80px"
                align="center"
                :show-overflow-tooltip="cellOverflow"
              />
              <el-table-column
                label="检查内容"
                prop="Content"
                min-width="180px"
                :show-overflow-tooltip="cellOverflow"
              />
              <el-table-column
                label="预览资料"
                width="150"
                align="center"
                prop="FileList_dto"
                :show-overflow-tooltip="cellOverflow"
              >
                <template slot-scope="{ row }">
                  <el-tag
                    v-for="(itemHref, indexHref) in row.FileList_dto"
                    :key="itemHref.FileName"
                    style="margin: 10px"
                    :disable-transitions="false"
                  >
                    <el-link
                      :key="indexHref"
                      target="_blank"
                      @click="PreviewFile(itemHref.FileUrl)"
                    >
                      {{ itemHref.FileName }}
                    </el-link>

                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column
                label="下载资料"
                width="150"
                align="center"
                prop="FileList_dto"
                :show-overflow-tooltip="cellOverflow"
              >
                <template slot-scope="{ row }">
                  <el-tag
                    v-for="(itemHref) in row.FileList_dto"
                    :key="itemHref.FileName"
                    style="margin: 10px"
                  >
                    <a :href="itemHref.FileUrl" :download="itemHref.FileName">{{ itemHref.FileName }}</a>

                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column
                label="总分"
                width="60"
                align="center"
                prop="ScoreCriteria"
                :show-overflow-tooltip="cellOverflow"
              />
              <el-table-column
                label="自查得分"
                width="60"
                align="center"
                prop="RC_Score"
                :show-overflow-tooltip="cellOverflow"
              />
              <el-table-column
                label="自查扣分选项"
                prop="RC_DeductedPoints"
                min-width="100"
                align="center"
                :show-overflow-tooltip="cellOverflow"
              >
                <template slot-scope="scope">
                  <el-tag v-for="item in scope.row.RC_DeductedPoints " style="margin: 4px">
                    {{ item || '无扣分选项' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column
                label="科室整改措施"
                align="center"
                prop="RC_RectificationMeasures"
                min-width="100"
                :show-overflow-tooltip="cellOverflow"
              >
                <template slot-scope="scope">
                  {{ scope.row.RC_RectificationMeasures }}
                </template>
              </el-table-column>
              <el-table-column
                label="效果评价"
                align="center"
                prop="RC_Opinion"
                min-width="100"
                :show-overflow-tooltip="cellOverflow"
              >
                <template slot-scope="scope">
                  {{ scope.row.RC_Opinion }}
                </template>
              </el-table-column>
              <el-table-column
                label="自查备注"
                align="center"
                prop="RC_DeductedPointsRemarks"
                min-width="120"
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
                  <span>{{scope.row.ZCScore}}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="督查意见"
                prop="ZCErro"
                width="100"
                align="center"
                :show-overflow-tooltip="cellOverflow"
              >
                <template slot-scope="scope">
                  <span>{{scope.row.ZCErro}}</span>
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
                  <span>{{scope.row.ZgCErro}}</span>
                </template>
              </el-table-column>


              <el-table-column
                label="审核意见"
                align="center"
                prop="RC_AuditOpinion"
                :show-overflow-tooltip="cellOverflow"
              >
                <template slot-scope="scope">
                  <span>{{scope.row.RC_AuditOpinion}}</span>

                </template>
              </el-table-column>
            </el-table>
            <el-switch
              v-model="cellOverflow"
              active-text="收起"
              inactive-text="展开"
              style="margin: 6px 0px"
            />
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button
              type="info"
              size="small"
              @click="isShowSeeDia=false"
            >
              关闭
            </el-button>

          </span>
        </el-dialog>
        <!-- 审核 弹窗 -->
        <el-dialog
          :title="useTemplateDialogTitle"
          :visible.sync="dialogUseTemplate"
          :width="device === 'desktop' ? '50%' : '90%'"
          :before-close="cancle"
          height="calc(100vh - 330px)"
          @resize="resize"
        >
          <el-header :style="{ height: isFullscreen ? '130px' : '230px' }">
            <el-form
              ref="addFormData"
              size="mini"
              label-width="96px"
              :model="addFormData"
              label-position="right"
              :inline="true"
            >
              <el-form-item
                label="项目名称"
                prop="RC_ProjectName"
              >
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
              <el-form-item
                label="检查日期"
                prop="RC_InspectionTimeStat"
              >
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
              <el-form-item
                label="主检查者"
                prop="RC_Inspector"
              >
                <el-input
                  v-model="addFormData.RC_Inspector"
                  :disabled="true"
                  clearable
                />
              </el-form-item>
              <el-form-item
                label="协同检查者"
                prop="RC_InspectorOther"
              >
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
              <el-form-item
                label="模板名称"
                prop="RC_TemplateName"
              >
                <el-input
                  v-model="addFormData.RC_TemplateName"
                  :disabled="true"
                />
              </el-form-item>
              <el-form-item label="注意事项">
                <el-input
                  v-model="addFormData.Precautions"
                  :disabled="true"
                />
              </el-form-item>
              <el-form-item
                label="总审核意见"
                prop="RC_AllAuditOpinion"
              >
                <el-input v-model="addFormData.RC_AllAuditOpinion" />
              </el-form-item>
            </el-form>
          </el-header>
          <el-main height="calc(100vh - 200px)">
            <el-table
              v-if="addFormData.CaseJudgment == 1"
              v-loading="ZGCheckLoading"
              ref="multipleTable"
              :data="addFormData.Rc_CaseDetail"
              border
              highlight-current-row
              style="margin-top: 30px"
              size="mini"
              height="200"
            >
              <el-table-column
                type="index"
                align="center"
              />
              <el-table-column
                label="
              住院号"
                prop="HospitalNumber"
              />
              <el-table-column
                label="患者姓名"
                prop="PatientName"
              />
              <el-table-column
                label="医疗组名称"
                prop="MedicalGroupName"
              />
            </el-table>
            <el-table
              :data="TemplateTableData"
              v-loading="ZGCheckLoading"
              highlight-current-row
              style="width:100%;margin-top: 30px"
              :height="
                addFormData.CaseJudgment == 1
                  ? 'calc(100vh - 400px)'
                  : 'calc(100vh - 250px)'
              "
              border
              size="mini"
              :span-method="objectSpanMethod"
              stripe
            >
              <el-table-column
                type="index"
                label="序号"
                width="60"
                align="center"
              />
              <el-table-column
                label="类别"
                prop="Category"
                width="80px"
                align="center"
                :show-overflow-tooltip="cellOverflow"
              />
              <el-table-column
                label="检查项目"
                prop="ProjectContent"
                width="80px"
                align="center"
                :show-overflow-tooltip="cellOverflow"
              />
              <el-table-column
                label="检查内容"
                prop="Content"
                min-width="180px"
                :show-overflow-tooltip="cellOverflow"
              />
              <el-table-column
                label="预览资料"
                width="150"
                align="center"
                prop="FileList_dto"
                :show-overflow-tooltip="cellOverflow"
              >
                <template slot-scope="{ row }">
                  <el-tag
                    v-for="(itemHref) in row.FileList_dto"
                    :key="itemHref.FileName"
                    style="margin: 10px"
                  >
                    <a :href="itemHref.FileUrl" :download="itemHref.FileName">{{ itemHref.FileName }}</a>

                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column
                label="下载资料"
                width="150"
                align="center"
                prop="FileList_dto"
                :show-overflow-tooltip="cellOverflow"
              >
                <template slot-scope="{ row }">
                  <el-tag
                    v-for="(itemHref) in row.FileList_dto"
                    :key="itemHref.FileName"
                    style="margin: 10px"
                  >
                    <a :href="itemHref.FileUrl" :download="itemHref.FileName">{{ itemHref.FileName }}</a>

                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column
                label="总分"
                width="60"
                align="center"
                prop="ScoreCriteria"
                :show-overflow-tooltip="cellOverflow"
              />
              <el-table-column
                label="自查得分"
                width="60"
                align="center"
                prop="RC_Score"
                :show-overflow-tooltip="cellOverflow"
              />
              <el-table-column
                label="自查扣分选项"
                prop="RC_DeductedPoints"
                min-width="100"
                align="center"
                :show-overflow-tooltip="cellOverflow"
              >
                <template slot-scope="scope">
                  <el-tag v-for="item in scope.row.RC_DeductedPoints " style="margin: 4px">
                    {{ item || '无扣分选项' }}
                  </el-tag>
                  <!--                <el-select-->
                  <!--                  v-model="scope.row.RC_DeductedPoints"-->
                  <!--                  multiple-->
                  <!--                  collapse-tags-->
                  <!--                  size="mini"-->
                  <!--                  placeholder="请选择扣分原因"-->
                  <!--                  clearable-->
                  <!--                  :style="{ width: '100%' }"-->
                  <!--                  @change="-->
                  <!--                    DeductedPoints(scope.row.RC_DeductedPoints, scope.row)-->
                  <!--                  "-->
                  <!--                >-->
                  <!--                  <el-option-->
                  <!--                    v-for="(item, indexCheck) in scope.row.Check"-->
                  <!--                    :key="indexCheck"-->
                  <!--                    :label="item.ErrorContent"-->
                  <!--                    :value="item.ErrorContent"-->
                  <!--                  />-->
                  <!--                </el-select>-->
                </template>
              </el-table-column>
              <el-table-column
                label="科室整改措施"
                align="center"
                prop="RC_RectificationMeasures"
                min-width="100"
                :show-overflow-tooltip="cellOverflow"
              >
                <template slot-scope="scope">
                  {{ scope.row.RC_RectificationMeasures }}
                </template>
              </el-table-column>
              <el-table-column
                label="效果评价"
                align="center"
                prop="RC_Opinion"
                min-width="100"
                :show-overflow-tooltip="cellOverflow"
              >
                <template slot-scope="scope">
                  {{ scope.row.RC_Opinion }}
                </template>
              </el-table-column>
              <el-table-column
                label="自查备注"
                align="center"
                prop="RC_DeductedPointsRemarks"
                min-width="120"
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
                  <el-input
                    v-model="scope.row.ZCScore"
                    size="mini"
                    width="50"
                  />
                </template>
              </el-table-column>
              <el-table-column
                label="督查意见"
                prop="ZCErro"
                width="100"
                align="center"
                :show-overflow-tooltip="cellOverflow"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.ZCErro"
                    size="mini"
                    type="textarea"
                    width="200"
                  />
                </template>
              </el-table-column>


              <!--            <el-table-column-->
              <!--              label="督导得分"-->
              <!--              width="60"-->
              <!--              align="center"-->
              <!--              prop="ZCScore"-->
              <!--            >-->
              <!--              <template slot-scope="scope">-->
              <!--                <el-input-->
              <!--                  v-model="scope.row.ZCScore"-->
              <!--                  size="mini"-->
              <!--                  width="50"-->
              <!--                />-->
              <!--              </template>-->
              <!--            </el-table-column>-->

              <el-table-column
                label="主管部门整改措施"
                prop="ZgCErro"
                width="150"
                align="center"
                :show-overflow-tooltip="cellOverflow"
              >
                <template slot-scope="scope">

                  <el-input
                    v-model="scope.row.ZgCErro"
                    size="mini"
                    type="textarea"
                    width="200"
                  />
                </template>
              </el-table-column>


              <el-table-column
                label="审核意见"
                align="center"
                prop="RC_AuditOpinion"
                :show-overflow-tooltip="cellOverflow"
              >
                <template slot-scope="scope">
                  <el-input
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
          <span
            slot="footer"
            class="dialog-footer"
          >
            <el-button
              size="small"
              @click="cancle()"
            >取 消</el-button>
            <el-button
              type="primary"
              size="small"
              @click="submitTemplate(6)"
            >通过</el-button>
            <el-button
              type="primary"
              size="small"
              @click="submitTemplate(7)"
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
            <el-col
              :span="7"
              :xs="12"
              :sm="12"
            >
              <standardCatalog
                maxheight="500px"
                @nodeClickCatalog="nodeClickCatalog"
              />
            </el-col>
            <!-- <div style="width: 290px"> -->
            <el-col
              :span="8"
              :xs="12"
              :sm="12"
            >
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
          <span
            slot="footer"
            class="dialog-footer"
          >
            <el-button
              size="mini"
              @click="cancel"
            >取 消</el-button>
            <el-button
              type="primary"
              size="mini"
              @click="InsertArticle"
            >确 定</el-button>
          </span>
        </el-dialog>

        <el-row>
          <el-col :span="1">
            <el-switch
              v-model="cellOverflow"
              style="margin: 10px 4px 0 0"
            />
          </el-col>
          <el-col :span="20">
            <el-pagination
              style="margin-top: 10px"
              background
              :current-page="listQuery.pageIndex"
              :page-sizes="[15, 20, 30, 40, 50]"
              :page-size="listQuery.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="listQuery.total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </el-col>
        </el-row>

    </el-card>
  </el-container>
</template>
<script>
import standardCatalog from '@/views/components/standardCatalog';
import articlegroup from '@/views/components/articlegroup';
import defaultDepts from '@/views/components/defaultDepts';
import defaultDept from '@/views/components/defaultDept';
import { InsertUpdateReview, SelectUseDept, SelectUseTemp, SelectUseTempDetail } from '@/api/RC_Template';
import { InsertArticle, PreviewFile } from '@/api/Article';
import tableHeight from '@/views/mixin/tableHeight';
import { mapGetters } from 'vuex';

export default {
  name: 'RegulatoryRectification',
  components: { standardCatalog, articlegroup, defaultDepts, defaultDept },
  mixins: [tableHeight],
  data() {
    return {
      ZGCheckLoading: false, // 审核对话框加载检查项目等待圈
      isShowSeeDia: false, // 是否打开查看对话框
      nowStatus: 1, // 用来判断该条的审核状态
      listLoading: true,
      dialogVisible: false,
      title: '',
      tableData: [],
      InspectionDepartments: [],
      FunctionalDepartments: [],
      catalogName: '',
      formData: {},
      ErrorList_dto: [],
      submitData: {
        Title: '',
        GroupID: 0,
        CatalogID: 0,
        Content: '',
        AuthorID: window.userInfo[0].UserID
      },
      listQuery: {
        RC_ManagementLevel: '日常监管',
        RC_InspectionDepartment: '',
        RC_FunctionalDepartment: '',
        RC_ProjectName: '',
        pageIndex: 1,
        total: 0,
        pageSize: 15,
        Status: '',
        Step: 3,
        IsRequired: '',
        CommitStatus: '已填写'
      },
      /* 审核弹窗data ----------*/
      useTemplateDialogTitle: '审核项目',
      dialogUseTemplate: false,
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
        Step: 3,
        CaseJudgment: 0,
        CheckMonth: ''
      },
      TemplateTableData: [],
      downloadValue: '',
      downloadLoading: false,
      cellOverflow: false,
      isFullscreen: true,
      CatalogVersion: window.CatalogVersion
    };
  },
  computed: {
    ...mapGetters(['device'])
  },
  created() {
    this.SelectUseTemp();
    this.SelectUseDept();
    this.SelectUseDept('主管部门', '日常监管');
  },
  methods: {
    async InsertArticle() {
      if (
        (this.formData.IsCriterion == 1 || this.formData.Count == 0) &&
        this.submitData.GroupID != 0
      ) {
        const formData = this.formData;
        let newContent = '';
        this.ErrorList_dto.forEach(item => {
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
    getSelectAllArticleGroupValue(v) {
      this.submitData.GroupID = v;
    },
    nodeClickCatalog(v) {
      this.catalogName = v.CatalogName;
      this.submitData.CatalogID = v.CatalogID;
      this.formData.IsCriterion = v.IsCriterion;
      this.formData.Count = v.Count;
    },
    async Archive(row) {
      row = JSON.parse(JSON.stringify(row));
      try {
        const { data } = await SelectUseTempDetail({
          TemplateID: row.RC_TemplateID,
          RC_ProjectName: row.RC_ProjectName,
          RC_InspectionDepartment: row.RC_InspectionDepartmentID,
          guId: row.GUID
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

    loseFcous(index, row) {
      row.edit = false;
    },
    loseFcous1(index, row) {
      row.edit1 = false;
    },
    cellClick(row, column, cell, event) {
      switch (column.label) {
        case '整改措施':
          row.edit = true;
          this.$nextTick(() => {
            document.querySelector('textarea').focus();
          });
          break;

        case '效果评价':
          row.edit1 = true;
          this.$nextTick(() => {
            document.querySelector('textarea').focus();
          });
          break;

        default:
          row.edit = false;
          row.edit1 = false;
          break;
      }
    },
    async SelectUseTemp() {
      try {
        const { data } = await SelectUseTemp(this.listQuery);
        data.DataList.map(item => {
          this.$set(item, 'edit', false);
          this.$set(item, 'edit1', false);
          item.RC_DeductedPoints = [
            ...new Set(item.RC_DeductedPoints.split('$'))
          ].join(' ');
        });
        this.tableData = data.DataList;
        this.listQuery.total = data.Total;
      } catch (error) {
        console.log(error);
      } finally {
        this.listLoading = false;
      }
    },
    async clickSelectOpinions() {
      this.listLoading = true;
      this.listQuery.pageIndex = 1;
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
      this.listQuery.pageIndex = 1;
      this.clickSelectOpinions();
    },
    async SelectUseDept(Type = '自查科室', RC_ManagementLevel = '日常监管') {
      try {
        const { data } = await SelectUseDept({
          Type,
          RC_ManagementLevel
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
        Type === '自查科室'
          ? (this.InspectionDepartments = [...new Set(newArr)])
          : (this.FunctionalDepartments = [...new Set(newArr)]);
      } catch {
      }
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
            item.RC_DeductedPoints == ''
              ? ''
              : item.RC_DeductedPoints.join('$'),
          RC_Score: item.RC_Score,
          RC_DeductedPointsRemarks: item.RC_DeductedPointsRemarks,
          CheckID: item.CheckID,
          RC_AuditOpinion: item.RC_AuditOpinion,
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
    async userTemplateButton(row, num) {
      this.nowStatus = row.Status; // 获取审核的该条状态，如果是3证明待提交，将自查得分作为督查得分的初始值，不然就是显示审核后督查得分的值
      if (num === 1) {
        this.isShowSeeDia = true; // 打开查看框
      } else {
        this.dialogUseTemplate = true; // 打开审核框
      }

      row = JSON.parse(JSON.stringify(row));
      this.useTemplateDialogTitle = '审核项目' + row.RC_ProjectName;
      this.RC_InspectionDepartmentID = parseInt(row.RC_InspectionDepartmentID);
      this.addFormData = {
        ID: row.ID,
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
        RC_AllAuditOpinion: row.RC_AllAuditOpinion,
        Step: 3,
        CaseJudgment: row.CaseJudgment,
        Rc_CaseDetail: [],
        Precautions: row.Precautions,
        CheckMonth: row.CheckMonth || ''
      };
      try {
        this.ZGCheckLoading = true; // 开启加载圈
        const { data } = await SelectUseTempDetail({
          TemplateID: row.RC_TemplateID,
          RC_ProjectName: row.RC_ProjectName,
          RC_InspectionDepartment: row.RC_InspectionDepartmentID,
          guId: row.GUID
        });
        this.addFormData.Rc_CaseDetail = data.CaseDetail_dto_list;
        this.TemplateTableData = data.CheckContent_dto_list.map(item => {
          return {
            ZCScore: this.nowStatus === 3 ? item.RC_Score : item.ZCScore, // 获取审核的该条状态，如果是3证明待提交，将自查得分作为督查得分的初始值，不然就是显示审核后督查得分的值
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
        this.ZGCheckLoading = false; // 关闭加载圈
      } catch {
        this.ZGCheckLoading = false; // 关闭加载圈
      }
    },
    focus() {
      this.addFormData.RC_InspectionDepartmentID = 0;
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
    },
    async handleDownload() {
      let total;
      if (!this.downloadValue) {
        total = this.listQuery.total;
      } else {
        total = this.downloadValue;
      }
      this.downloadLoading = true;
      try {
        const excel = await import('@/vendor/Export2Excel');
        const tHeader = [
          '项目名称',
          '被查科室',
          '总分',
          '状态',
          '总审核意见',
          '检查时间',
          '存在问题'
        ];
        const filterVal = [
          'RC_ProjectName',
          'RC_InspectionDepartmentName',
          'Score',
          'StatusName',
          'AllAuditOpinion',
          'RC_InspectionTimeStat',
          'RC_DeductedPoints'
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
    resize(val) {
      this.isFullscreen = val;
    },
    selectChange(val) {
      this.listLoading = true;
      this.listQuery.pageIndex = 1;
      this.SelectUseTemp();
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
// 查看对话框文字大小，距离
.seeAddFormData {
  font-weight: bolder;

  .el-row {
    margin-bottom: 25px;
  }
}
.RegulatoryRectification {
  margin: 4px;

  .el-header,
  .el-main,
  .el-footer {
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
