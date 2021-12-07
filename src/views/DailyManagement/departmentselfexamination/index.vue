<template>
  <div class="DepartmentSelfExamination">
    <el-card style="margin: 10px;width: 98%;height: 87vh;overflow: auto">
      <div
        style="width: 100%;
          background-color:#f4f4f5;
          display: inline-block;
          height: 32px;
          line-height: 32px;"
      >
        <el-form :inline="true" :model="listQuery" size="mini">
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-circle-plus"
              size="mini"
              @click="userTemplateButton"
            >使用表单
            </el-button>
          </el-form-item>
          <el-divider direction="vertical" />
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
          <el-divider direction="vertical" />
          <el-form-item>
            <default-depts
              v-if="!addFormData.RC_InspectionDepartmentID"
              w="100%"
              :value="addFormData.RC_InspectionDepartmentID"
              @getDefaultDeptsValue="getDefaultDeptValues2"
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
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              :loading="listLoading"
              @click="clickSelectUseTemp"
            >搜索
            </el-button>
          </el-form-item>
          <el-divider direction="vertical" />
          <el-form-item>
            <el-checkbox
              v-model="checked"
              @change="checkbox"
            >只看草稿
            </el-checkbox>
          </el-form-item>
          <el-divider direction="vertical" />
          <el-form-item style="width: 150px">
            <el-select v-model="downloadValue" placeholder="请选择要导出数据">
              <el-option label="前一百条" :value="100"/>
              <el-option label="前三百条" :value="300"/>
              <el-option label="前五百条" :value="500"/>
              <el-option label="前一千条" :value="1000"/>
              <el-option label="全部" :value="pagination.total"/>
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
          style="width: 100%;margin-top: 10px"
          border
          size="mini"
          height="calc(100vh - 240px)"
          stripe
        >
          <el-table-column type="index" label="序号" width="60" align="center"/>
          <el-table-column
            prop="RC_ProjectName"
            label="项目名称"
            min-width="300"
            align="center"
            :show-overflow-tooltip="cellOverflow"
          >
            <template slot-scope="{ row }">
              {{ row.RC_ProjectName }}
              <el-tag
                v-if="row.Status===1"
                type="success"
                size="mini"
              >
                <span>新</span>
              </el-tag>

            </template>
          </el-table-column>
          <el-table-column
            prop="StatusName"
            label="状态"
            width="130"
            align="center"
          >
            <template slot-scope="scope">
              <p
                :style="{
                  color:
                    scope.row.StatusName == '已提交'
                      ? 'green'
                      : scope.row.StatusName == '质管审核退回'
                        ? 'red'
                        : scope.row.StatusName == '主管审核退回'
                          ? 'red'
                          : scope.row.StatusName == '未执行'
                          ? 'blue'
                          : 'black',
                  margin: '0px',
                }"
              >
                {{ scope.row.StatusName }}
              </p>
            </template>
          </el-table-column>
          <!--  抽查表单不应出现在科室自查，先隐藏-->
          <el-table-column
            v-if="tableData.RC_TemplateType!=='抽查表单'"
            prop="RC_TemplateType"
            label="表单类型"
            align="center"
            :show-overflow-tooltip="cellOverflow"
          />
          <el-table-column
            prop="RC_InspectionTimeStat"
            label="检查日期"
            width="145"
            align="center"
          >
            <!-- .split("T").join(" ") -->
            <template slot-scope="scope">
              {{
                typeof scope.row.RC_InspectionTimeStat !== 'string'
                  ? ''
                  : scope.row.RC_InspectionTimeStat.split('T').join(' ')
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
          <el-table-column
            prop="Score"
            label="自查得分"
            width="80"
            align="center"
          />
          <el-table-column
            prop="ZCScore"
            label="督查得分"
            width="80"
            align="center"
          />

          <!--        <el-table-column-->
          <!--          prop="ZgCScore"-->
          <!--          label="督导得分"-->
          <!--          width="80"-->
          <!--          align="center"-->
          <!--        />-->

          <el-table-column
            prop="RC_AllAuditOpinion"
            label="总审核意见"
            width="150"
            align="center"
          />

          <el-table-column
            prop="RC_DeductedPoints"
            label="自查存在的问题"
            width="300"
            align="center"
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
          <el-table-column
            prop="RC_Remarks"
            label="项目备注"
            :show-overflow-tooltip="cellOverflow"
          />
          <el-table-column
            prop="RC_StateType"
            label="提交"
            width="60"
            align="center"
            fixed="right"
          >
            <template slot-scope="{ row }">
              <el-button
                class="iconfont al-icon-tijiao4"
                size="mini"
                circle
                @click="submit(row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" align="center" width="180">
            <template slot-scope="{ row }">
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-view"
                @click="SelectUseTempDetail(row,1)"
              />
              <el-button
                type="info"
                size="mini"
                icon="el-icon-edit"
                @click="SelectUseTempDetail(row)"
              />
              <el-popconfirm
                style="margin-left: 3px"
                confirm-button-text="是"
                cancel-button-text="否"
                icon="el-icon-info"
                icon-color="green"
                title="确定拷贝当前分配的表单吗？适用于再次提交。"
                @confirm="moreUseTempDetail(row)"
              >
                <el-button
                  slot="reference"
                  type="success"
                  icon="el-icon-position"
                  size="mini"
                />
              </el-popconfirm>
              <el-popconfirm
                v-if="checked"
                style="margin-left: 3px"
                confirm-button-text="是"
                cancel-button-text="否"
                icon="el-icon-info"
                icon-color="red"
                title="确定删除吗？"
                @confirm="DeleteUseTemplateDraft(row)"
              >
                <el-button
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                />
              </el-popconfirm>
              <el-popconfirm
                style="margin-left: 3px"
                confirm-button-text="是"
                cancel-button-text="否"
                icon="el-icon-info"
                icon-color="red"
                title="确定删除吗？"
                @confirm="DeleteUseTemplate(row)"
              >
                <el-button
                  v-if="RoleCode == 'R0001' && !checked"
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-row>
          <el-col :span="1">
            <el-switch v-model="cellOverflow" style="margin: 6px 0"/>
          </el-col>
          <el-col :span="20">
            <el-pagination
              style="margin-top: 10px"
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
      <!--      查看详情-->
      <el-dialog
        :title="useTemplateDialogTitle"
        :visible.sync="dialogUseTemplateView"
        :width="device === 'desktop' ? '50%' : '90%'"
        :top="device === 'desktop' ? '0' : '1rem'"
        style="overflow: auto"
        @resize="resize"
      >
        <div style="height: 90vh; overflow: auto">
          <div>
            <el-form
              ref="addFormData"
              size="mini"
              :model="addFormData"
              :rules="rule"
              class="seeAddFormData"

              label-position="top"
              :inline="true"
              label-width="100px"
            >
              <el-row>
                <el-col :span="8"><span>项目名称：{{ addFormData.RC_ProjectName }}</span></el-col>
                <el-col :span="8"><span>主检查者：{{ addFormData.RC_Inspector }}</span></el-col>
                <el-col :span="8"><span>协同检查者：{{ addFormData.RC_InspectorOther }} </span></el-col>
              </el-row>


              <el-row>
                <el-col :span="8"><span>检查日期：{{
                    addFormData.RC_InspectionTimeStat
                      ? addFormData.RC_InspectionTimeStat.replace('T', ' ')
                      : ''
                                        }}</span></el-col>
                <el-col :span="8"><span>自查月份：{{ addFormData.CheckMonth }}</span></el-col>
                <el-col :span="8"><span>审核人：{{ auditorName }} </span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8"><span>自查科室：</span>
                  <span>{{ addFormData.RC_InspectionDepartmentName }}</span>
                </el-col>
                <el-col :span="8"><span>总满分：{{ addFormData.fullMark || 0 }}</span></el-col>
                <el-col :span="8"><span>总得分：{{ addFormData.totalPoints || 0 }} </span>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="12"><span>表单模板名称：{{ addFormData.RC_TemplateName }}</span></el-col>
                <el-col :span="12"><span>总审核意见：{{ addFormData.RC_AllAuditOpinion }}</span></el-col>
              </el-row>
              <el-row>
                <el-col :span="12"><span>项目备注：{{ addFormData.RC_Remarks }} </span></el-col>
                <el-col :span="12"><span>注意事项：{{ addFormData.Precautions }} </span></el-col>
              </el-row>
            </el-form>
          </div>
<!--          查看时的病例数据-->
          <div style="flex: 1">
            <h4    v-if="addFormData.CaseJudgment == 1">病例数据</h4>
            <el-table
              v-if="addFormData.CaseJudgment == 1"
              ref="multipleTable"
              stripe
              highlight-current-row
              border
              :data="addFormData.Rc_CaseDetail"
              size="mini"
              height="130"
            >
              <el-table-column type="index" align="center"/>
              <el-table-column label="住院号" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.HospitalNumber }}</span>

                </template>
              </el-table-column>
              <el-table-column label="档案号" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.HospitalNumber }}</span>

                </template>
              </el-table-column>
              <el-table-column label="床号" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.HospitalNumber }}</span>

                </template>
              </el-table-column>
              <el-table-column label="患者姓名" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.PatientName }}</span>
                </template>
              </el-table-column>
              <el-table-column label="性别" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.PatientName }}</span>
                </template>
              </el-table-column>
              <el-table-column label="医疗组名称" align="center" width="100">
                <template slot-scope="scope">
                  <span>{{ scope.row.MedicalGroupName }}</span>

                </template>
              </el-table-column>
              <el-table-column label="主管医生" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.MedicalGroupName }}</span>

                </template>
              </el-table-column>

            </el-table>

            <el-table
              v-loading="TemplateTableDataLoading"
              :data="TemplateTableData"
              style="width:96%;margin:0 auto"
              border
              size="mini"
              :span-method="objectSpanMethod"
            >
              <el-table-column
                type="index"
                label="序号"
                width="45"
                align="center"
              />
              <el-table-column
                label="类别"
                prop="Category"
                width="50px"
                align="center"
              />
              <el-table-column
                label="检查项目"
                prop="ProjectContent"
                width="100px"
                align="center"
              />
              <el-table-column label="检查内容" prop="Content" width="300px"/>
              <el-table-column
                label="满分"
                width="80"
                align="center"
                prop="ScoreCriteria"
              >
                <template slot-scope="scope">
                  {{ scope.row.RC_TotalScore }}
                  <!--                <el-input v-model.trim="scope.row.RC_TotalScore" size="mini" />-->
                </template>
              </el-table-column>
              <el-table-column
                label="自查得分"
                width="80"
                align="center"
                prop="RC_Score"
              >
                <template slot-scope="scope">
                  {{ scope.row.RC_Score }}
                  <!--                <el-input v-model.trim="scope.row.RC_Score" size="mini" />-->
                </template>
              </el-table-column>
              <el-table-column
                label="扣分选项"
                align="center"
                prop="RC_DeductedPoints"
                min-width="100"
              >
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.RC_DeductedPoints"
                    multiple
                    :disabled="true"
                    collapse-tags
                    size="mini"
                    placeholder="请选择扣分原因"
                    clearable
                    :style="{ width: '100%' }"
                    @change="
                      DeductedPoints(scope.row.RC_DeductedPoints, scope.row)
                    "
                  >
                    <el-option
                      v-for="(item, indexCheck) in scope.row.Check"
                      :key="indexCheck"
                      :label="item.ErrorContent"
                      :value="item.ErrorContent"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                label="科室整改措施"
                align="center"
                prop="RC_RectificationMeasures"
                min-width="150"
              />

              <el-table-column
                label="效果评价"
                align="center"
                prop="RC_Opinion"
                min-width="150"
              />

              <el-table-column
                label="自查备注"
                align="center"
                prop="RC_DeductedPointsRemarks"
                min-width="120"
              />

              <el-table-column
                label="预览资料"
                width="150"
                align="center"
                prop="FileList_dto"
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
              >
                <template slot-scope="{ row }">
                  <el-tag
                    v-for="itemHref in row.FileList_dto"
                    :key="itemHref.FileName"
                    style="margin: 10px"
                    :disable-transitions="false"
                  >
                    <a :href="itemHref.FileUrl" :download="itemHref.FileName">{{ itemHref.FileName }}</a>

                  </el-tag>
                </template>
              </el-table-column>


              <el-table-column
                label="督查得分"
                width="80"
                align="center"
                prop="ZCScore"
              />

              <el-table-column
                label="督查意见"
                prop="ZCErro"
                align="center"
              />

              <el-table-column
                label="主管部门整改措施"
                prop="ZgCErro"
                align="center"
              />


              <el-table-column
                label="审核意见"
                align="center"
                prop="RC_AuditOpinion"
                width="100"
              />
            </el-table>
          </div>
        </div>
        <el-footer slot="footer" style="height: 35px">

          <el-button
            type="info"
            size="small"
            @click="
              cancle(2)
              innerDisabled = false
            "
          >关闭
          </el-button>
        </el-footer>

      </el-dialog>
      <!--      编辑-->
      <el-dialog
        :title="useTemplateDialogTitle"
        :visible.sync="dialogUseTemplate"
        :width="device === 'desktop' ? '50%' : '90%'"
        :before-close="cancle"
        :top="device === 'desktop' ? '0' : '1rem'"
        style="overflow: auto"

        @resize="resize"
      >
        <div style="height: 90vh; overflow: auto">
          <div>
            <el-form
              ref="addFormData"
              size="mini"
              :model="addFormData"
              :rules="rule"
              label-position="top"
              :inline="true"
              class="demo-form-inline"
              label-width="100px"
            >
              <el-form-item label="项目名称" prop="RC_ProjectName">
                <el-input v-model="addFormData.RC_ProjectName" clearable/>
              </el-form-item>
              <el-form-item label="主检查者" prop="RC_Inspector">
                <el-input v-model="addFormData.RC_Inspector" clearable/>
              </el-form-item>
              <el-form-item label="协同检查者" prop="RC_InspectorOther">
                <el-input v-model="addFormData.RC_InspectorOther" clearable/>
              </el-form-item>
            </el-form>
            <el-form
              size="mini"
              label-position="top"
              :inline="true"
              class="demo-form-inline"
              label-width="100px"
            >
              <el-form-item label="检查日期" :required="true">
                <el-date-picker
                  v-model="addFormData.RC_InspectionTimeStat"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  style="width: 100%"
                  placeholder="选择日期"
                  clearable
                />
              </el-form-item>
              <el-form-item label="自查月份" :required="true">
                <el-date-picker
                  v-model="addFormData.CheckMonth"
                  type="month"
                  value-format="yyyy-MM"
                  placeholder="选择月"
                />
              </el-form-item>
              <el-form-item
                label="
            审核人"
              >
                <el-select
                  v-model="addFormData.CheckUserID"
                  filterable
                  placeholder="请选择"
                  clearable
                  @change="selectUserID"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.UserID"
                    :label="item.UserName"
                    :value="item.UserID"
                  >
                    <span style="float: left">{{ item.UserName }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">
                      {{ item.UserCode }}
                    </span>
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="自查科室" :required="true">
                <default-dept
                  w="100%"
                  :value="addFormData.RC_InspectionDepartmentID"
                  @getDefaultDeptsValue="getDefaultDeptValues"
                />

              </el-form-item>

              <el-form-item prop="RC_AllAuditOpinion">
                <span
                  style="font-weight: bold"
                >总满分:{{ addFormData.fullMark || 0 }}</span>
                <span style="font-weight: bold">
                  总得分:{{ addFormData.totalPoints || 0 }}</span>
              </el-form-item>
            </el-form>
            <el-form
              ref="addFormData"
              size="mini"
              :model="addFormData"
              :rules="rule"
              :inline="true"
              label-position="top"
            >
              <el-form-item label="表单模板名称" prop="RC_TemplateName">
                <el-input
                  v-model="addFormData.RC_TemplateName"
                  disabled
                  type="textarea"
                />
              </el-form-item>
              <el-form-item label="总审核意见" prop="RC_AllAuditOpinion">
                <el-input
                  v-model="addFormData.RC_AllAuditOpinion"
                  disabled
                  type="textarea"
                />
              </el-form-item>
              <el-form-item label="项目备注">
                <el-input
                  v-model="addFormData.RC_Remarks"
                  clearable
                  type="textarea"
                />
              </el-form-item>
              <el-form-item label="注意事项">
                <el-input
                  v-model="addFormData.Precautions"
                  :disabled="true"
                  type="textarea"
                />
              </el-form-item>
            </el-form>
          </div>
          <div style="flex: 1">
            <h3    v-if="addFormData.CaseJudgment == 1">病例数据</h3>
            <el-table
              v-if="addFormData.CaseJudgment == 1"
              ref="multipleTable"
              :data="addFormData.Rc_CaseDetail"
              size="mini"
              stripe
              highlight-current-row
              border
              height="130"
            >
              <el-table-column type="index" align="center"/>
              <el-table-column label="住院号" align="center">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.HospitalNumber"
                    size="mini"
                    placeholder="必填"
                  />
                </template>
              </el-table-column>
              <el-table-column label="档案号" align="center">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.HospitalNumber"
                    size="mini"
                    placeholder="必填"
                  />
                </template>
              </el-table-column>
              <el-table-column label="床号" align="center">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.HospitalNumber"
                    size="mini"
                    placeholder="必填"
                  />
                </template>
              </el-table-column>
              <el-table-column label="患者姓名" align="center">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.PatientName"
                    size="mini"
                    placeholder=""
                  />
                </template>
              </el-table-column>
              <el-table-column label="性别" align="center">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.PatientName"
                    size="mini"
                    placeholder=""
                  />
                </template>
              </el-table-column>
              <el-table-column label="医疗组名称" align="center" width="100">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.MedicalGroupName"
                    size="mini"
                    placeholder=""
                  />
                </template>
              </el-table-column>
              <el-table-column label="主管医生">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.MedicalGroupName"
                    size="mini"
                    placeholder=""
                  />
                </template>
              </el-table-column>
              <el-table-column label="操作" width="50px" align="center">
                <template slot-scope="{ $index }">
                  <span><i
                    style="cursor: pointer"
                    class="el-icon-delete"
                    @click="deleteCase($index)"
                  /></span>
                </template>
              </el-table-column>
            </el-table>
            <el-form    v-if="addFormData.CaseJudgment == 1">
              <el-form-item style="margin-bottom: 0">
                <el-button
                  icon="el-icon-plus"
                  size="mini"
                  type="primary"
                  plain
                  @click="addCase"
                >新增一条
                </el-button>
                <span>(在此增加添加病例信息)</span>
              </el-form-item>
            </el-form>
            <el-table
              v-loading="TemplateTableDataLoading"
              :data="TemplateTableData"
              style="width:96%;margin:0 auto"
              border
              size="mini"
              :span-method="objectSpanMethod"
            >
              <el-table-column
                type="index"
                label="序号"
                width="45"
                align="center"
              />
              <el-table-column
                label="类别"
                prop="Category"
                width="50px"
                align="center"
              />
              <el-table-column
                label="检查项目"
                prop="ProjectContent"
                width="100px"
                align="center"
              />
              <el-table-column label="检查内容" prop="Content" width="300px"/>
              <el-table-column
                label="满分"
                width="80"
                align="center"
                prop="ScoreCriteria"
              >
                <template slot-scope="scope">
                  {{ scope.row.RC_TotalScore }}
                  <!--                <el-input v-model.trim="scope.row.RC_TotalScore" size="mini" />-->
                </template>
              </el-table-column>
              <el-table-column
                label="自查得分"
                width="80"
                align="center"
                prop="RC_Score"
              >
                <template slot-scope="scope">
                  {{ scope.row.RC_Score }}
                  <!--                <el-input v-model.trim="scope.row.RC_Score" size="mini" />-->
                </template>
              </el-table-column>
              <el-table-column
                label="扣分选项"
                align="center"
                prop="RC_DeductedPoints"
                min-width="100"
              >
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.RC_DeductedPoints"
                    multiple
                    collapse-tags
                    size="mini"
                    placeholder="请选择扣分原因"
                    clearable
                    :style="{ width: '100%' }"
                    @change="
                      DeductedPoints(scope.row.RC_DeductedPoints, scope.row)
                    "
                  >
                    <el-option
                      v-for="(item, indexCheck) in scope.row.Check"
                      :key="indexCheck"
                      :label="item.ErrorContent"
                      :value="item.ErrorContent"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                label="科室整改措施"
                align="center"
                prop="RC_RectificationMeasures"
                min-width="150"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.RC_RectificationMeasures"
                    type="textarea"
                    size="mini"
                  />
                </template>
              </el-table-column>
              <el-table-column
                label="效果评价"
                align="center"
                prop="RC_Opinion"
                min-width="150"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.RC_Opinion"
                    type="textarea"
                    size="mini"
                  />
                </template>
              </el-table-column>
              <el-table-column
                label="自查备注"
                align="center"
                prop="RC_DeductedPointsRemarks"
                min-width="120"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.RC_DeductedPointsRemarks"
                    type="textarea"
                    size="mini"
                  />
                </template>
              </el-table-column>

              <el-table-column label="上传资料" width="70" align="center">
                <template slot-scope="scope">
                  <el-upload
                    :file-list="fileList"
                    :multiple="true"
                    :show-file-list="false"
                    :on-success="handleSuccess"
                    :on-change="handleChange"
                    class="editor-slide-upload"
                    action="/api/RC_File/UploadFile"
                  >
                    <el-button
                      size="mini"
                      circle
                      class="iconfont al-icon-tijiao1"
                      @click="handleSuccessIndex(scope)"
                    />
                  </el-upload>
                </template>


              </el-table-column>
              <el-table-column
                label="预览资料"
                width="150"
                align="center"
                prop="FileList_dto"
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
                label="督查得分"
                width="80"
                align="center"
                prop="ZCScore"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.ZCScore"
                    disabled
                    size="mini"
                    width="80"
                  />
                </template>
              </el-table-column>
              <el-table-column
                label="督查意见"
                prop="ZCErro"
                align="center"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.ZCErro"
                    disabled
                    size="mini"
                    type="textarea"
                    width="200"
                  />
                </template>
              </el-table-column>
              <el-table-column
                label="主管部门整改措施"
                prop="ZgCErro"
                align="center"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.ZgCErro"
                    disabled
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
                width="100"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.RC_AuditOpinion"
                    type="textarea"
                    size="mini"
                    :disabled="true"
                  />
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="100px">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="SelectContent(scope.row, scope)"
                  >选择扣分原因
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <el-footer v-if="!checked" style="height: 35px">
          <el-button
            v-if="useTemplateDialogTitle != '制作表单'"
            v-show="!checked"
            size="small"
            @click="ExportUseTemp"
          >导出
          </el-button>
          <el-button
            size="small"
            :disabled="innerDisabled"
            @click="innerDialog"
          >选择表单模板
          </el-button>
          <el-button
            :loading="tableBtnLoading"
            type="primary"
            size="small"
            :disabled="
              addFormData.Status == 1
                ? false
                : addFormData.Status == 2
                  ? false
                  : addFormData.Status == 5
                    ? false
                    : addFormData.Status == 7
                      ? false
                      : true
            "
            @click="submitTemplate"
          >确定保存
          </el-button>
          <el-button
            v-if="useTemplateDialogTitle == '制作表单'"
            size="small"
            @click="addDraft"
          >存为草稿
          </el-button>
          <el-button
            size="small"
            @click="
              cancle()
              innerDisabled = false
            "
          >关闭
          </el-button>
        </el-footer>
        <!-- 草稿 -->
        <el-footer v-if="checked" style="height: 35px">
          <el-button
            v-if="useTemplateDialogTitle === '制作表单'"
            size="small"
            @click="addDraft"
          >存为草稿
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="submitUseTemp"
          >确定保存
          </el-button>
          <el-button
            v-if="useTemplateDialogTitle === '编辑草稿:'"
            type="primary"
            size="small"
            @click="UpdateUseTempDraftDetail"
          >更新草稿
          </el-button>
          <el-button
            size="small"
            :disabled="innerDisabled"
            @click="innerDialog"
          >选择表单模板
          </el-button>
          <el-button
            size="small"
            @click="
              cancle()
              innerDisabled = false
            "
          >关闭
          </el-button>
        </el-footer>
      </el-dialog>
      <el-dialog
        title="选择扣分原因"
        :width="device === 'desktop' ? '50%' : '99%'"
        :close-on-click-modal="false"
        :visible.sync="dialogError"
      >
        <!--传入switch时 只能增加选项不能减少 -->
        <reasonfordeduction
          ref="reasonfordeduction"
          @handleSelectionChange="handleSelectionChange"
        />
        <div slot="footer" class="dialog-footer">
          <el-button
            size="mini"
            type="primary"
            @click="getErrorSelection()"
          >确 定
          </el-button>
        </div>
      </el-dialog>
      <template-list
        ref="templatelist"
        :visible="innerVisible"
        @getTemplateID="templateList"
      />
    </el-card>
  </div>
</template>
<script>
import defaultDept from '@/views/components/defaultDept';
import defaultDepts from '@/views/components/defaultDepts';
import templateList from '@/views/components/templateList';
import tableHeight from '@/views/mixin/tableHeight';
import reasonfordeduction from '@/views/components/reasonfordeduction';
import { mapGetters } from 'vuex';
import {
  ExportUseTemp,
  InsertUpdateReview,
  InsertUseTemp,
  SelectTemplateByID,
  SelectUseDept,
  SelectUseTemp,
  SelectUseTempDetail,
  UpdateUseTempDetail
} from '@/api/RC_Template';
import {
  DeleteUseTemplate,
  DeleteUseTemplateDraft,
  InsertUseTempDraft,
  ReuseTemplate,
  SelectUseTempDraft,
  SelectUseTempDraftDetail,
  UpdateUseTempDraftDetail
} from '@/api/RC_UseTemplate';
import { SelectZGUser } from '@/api/user';
import { PreviewFile } from '@/api/Article';

export default {
  name: 'DepartmentSelfExamination',
  components: {
    defaultDept,
    defaultDepts,
    templateList,
    reasonfordeduction
  },
  mixins: [tableHeight],
  data() {
    return {
      tableBtnLoading: false, // 新增和编辑表单对话框提交按钮等待
      auditorName: '', // 审核人名称
      dialogUseTemplateView: false, // 查看详情对话框开关
      TemplateTableDataLoading: false, // 表单内容加载等待
      test1: true,
      UserNameIf: true,
      useTemplateDialogTitle: '制作表单',
      listLoading: false,
      dialogUseTemplate: false,
      innerVisible: false,
      downloadLoading: false,
      tableData: [],
      TemplateTableData: [],
      InspectionDepartments: [],
      listQuery: {
        // RC_InspectionDepartment: window.userInfo[0].DeptID,
        RC_InspectionDepartment: '',
        // CreateUserID: '',
        RC_FunctionalDepartment: '',
        RC_ProjectName: '',
        pageIndex: 1,
        pageSize: 20,
        Step: 1,
        IsDraft: 0,
        CheckMonth: ''
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
        CheckUserID: '',
        Status: '',
        RC_InspectionDepartmentName: '',
        Rc_CaseDetail: [{ Category: '' }],
        fullMark: 0,
        totalPoints: 0,
        DraftID: '',
        CheckMonth: ''

      },
      RC_InspectionDepartmentID: 0,
      rule: {
        RC_ProjectName: [
          { required: true, message: '请输入项目名称', trigger: 'blur' }
        ],
        RC_Inspector: [
          { required: true, message: '请输入主检查者', trigger: 'blur' }
        ],
        RC_Filler: [
          { required: true, message: '请输入填写者', trigger: 'blur' }
        ],
        RC_InspectionDepartmentName: [
          { required: true, message: '请选择科室', trigger: 'blur' }
        ],
        // 协同检查者不需要强制填写
        // RC_InspectorOther: [
        //   { required: true, message: '请填写协同检查者', trigger: 'blur' }
        // ]
      },
      innerDisabled: false,
      spanOneArr: [],
      spanTwoArr: [],
      options: [],
      optionsVal: {
        pageIndex: 1,
        pageSize: 0,
        total: 0,
        UserName: ''
      },
      optionsUserName: '',
      fileList: [],
      FileList_dto: [],
      TemplateTableDataIndex: '',
      SelectRC_ErrorData: {
        RC_ErrorID: [],
        RC_ErrorIDs: [],
        num: '',
        indexs: 0
      },
      ErrorQuery: {
        pageSize: 50,
        pageIndex: 1,
        condition: '',
        total: 0,
        ErrorContent: '',
        TypeName: ''
      },
      ContentData_id: 0,
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
      RC_ErrorData: [],
      dialogError: false,
      currentEdit: -1,
      SelectionChangeValue: [],
      downloadValue: '',
      cellOverflow: false,
      isFullscreen: true,
      checked: false,
      RoleCode: window.userInfo[0].RoleCode
    };
  },
  computed: {
    ...mapGetters(['device', 'DeptName'])
  },
  created() {
    this.SelectUseTemp();
    this.SelectUseDept();
    this.SelectZGUser();
  },
  methods: {
    handleClose(index, FileList_dto) {
      FileList_dto.splice(index, 1);


      console.log('触发了事件');
    },
    async SelectContent(row, scope) {
      this.SelectRC_ErrorData.RC_ErrorID = [];
      this.SelectRC_ErrorData.RC_ErrorID = row.Check.map(item => {
        return item.ErrorID;
      });
      this.ErrorQuery.ErrorIDs = this.SelectRC_ErrorData.RC_ErrorID.toString();
      this.SelectRC_ErrorData.RC_ErrorIDs = row.Check.map(item => {
        return item.ErrorIDs;
      });
      this.SelectRC_ErrorData.indexs = scope.$index;
      this.ContentData_id = row.id;
      this.dialogError = true;
      this.$nextTick(() => {
        /* 传默认勾选的值给组件 */
        console.log(
          ' this.SelectRC_ErrorData.RC_ErrorIDs',
          this.SelectRC_ErrorData.RC_ErrorIDs
        );
        this.$refs.reasonfordeduction.getSelected(
          this.SelectRC_ErrorData.RC_ErrorIDs
            ? this.SelectRC_ErrorData.RC_ErrorIDs.join(',')
            : [],
          true
        );
      });
    },
    async DeleteUseTemplate(row) {
      const { code } = await DeleteUseTemplate({
        GUID: row.GUID,
        RC_ProjectName: row.RC_ProjectName,
        RC_InspectionDepartment: row.RC_InspectionDepartmentID
      });
      code === 200
        ? this.$message.success('删除成功!')
        : this.$message.error('删除失败');
      this.SelectUseTemp();
    },
    deteleObject(obj) {
      var uniques = [];
      var stringify = {};
      for (var i = 0; i < obj.length; i++) {
        var keys = Object.keys(obj[i]);
        keys.sort(function(a, b) {
          return Number(a) - Number(b);
        });
        var str = '';
        for (var j = 0; j < keys.length; j++) {
          str += JSON.stringify(keys[j]);
          str += JSON.stringify(obj[i][keys[j]]);
        }
        if (!stringify.hasOwnProperty(str)) {
          uniques.push(obj[i]);
          stringify[str] = true;
        }
      }
      return uniques;
    },
    handleSelectionChange(value) {
      let num = 0;
      this.TemplateTableData[this.SelectRC_ErrorData.indexs].ErrorIDArray = [];
      this.$nextTick(() => {
        value = value.map((item, index) => {
          this.TemplateTableData[
            this.SelectRC_ErrorData.indexs
            ].ErrorIDArray.push(item.ErrorID);
          return {
            ErrorContent: item.ErrorContent,
            Grade: item.Grade,
            ErrorID: item.ErrorID,
            ErrorIDs: item.ErrorID
          };
        });

        this.TemplateTableData[this.SelectRC_ErrorData.indexs].Check = value;
        this.TemplateTableData[this.SelectRC_ErrorData.indexs].Check.map(
          item => {
            num += item.Grade;
          }
        );

        this.TemplateTableData[
          this.SelectRC_ErrorData.indexs
          ].ScoreCriteria = num;
      });
      this.SelectionChangeValue = value;
    },
    getErrorSelection() {
      this.dialogError = false;
    },
    focus() {
      this.addFormData.RC_InspectionDepartmentID = 0;
    },
    // 点击编辑按钮
    async SelectUseTempDetail(row, num) {
      console.log('row', row);
      this.TemplateTableDataLoading = true; // 打开内容等待加载条
      this.UserNameIf = false;
      this.innerDisabled = true;
      row = JSON.parse(JSON.stringify(row));
      this.useTemplateDialogTitle = this.checked
        ? '编辑草稿:'
        : '编辑项目：' + row.RC_ProjectName;


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
        RC_InspectionDepartment: row.RC_InspectionDepartmentID,
        RC_InspectionTimeStat:
          row.RC_InspectionTimeStat == null ? '' : row.RC_InspectionTimeStat,
        RC_Inspector:
          row.RC_InspectorName == ''
            ? window.userInfo[0].UserName
            : row.RC_InspectorName,
        RC_InspectorOther: row.RC_InspectorOtherName,
        RC_Filler: window.userInfo[0].UserID,
        RC_Remarks: row.RC_Remarks,
        Rc_checkcontent: [],
        Status: row.Status,
        RC_AllAuditOpinion: row.RC_AllAuditOpinion,
        CheckUserID: row.CheckUserID,
        CaseJudgment: row.CaseJudgment,
        DistributionID: row.DistributionID,
        Rc_CaseDetail: [],
        DraftID: row.DraftID,
        Precautions: row.Precautions,
        CheckMonth: row.CheckMonth
      };
      this.optionsUserName = row.CheckUserID;
      if (row.DistributionID == 0) {
        this.UserNameIf = true;
        this.optionsUserName = row.CheckUserID;
      }
      try {
        if (this.checked) {
          this.innerDisabled = false;
          this.addFormData.Status = 1;
          this.UserNameIf = true;
        }
        const { data } = this.checked
          ? await SelectUseTempDraftDetail({
            TemplateID: row.RC_TemplateID,
            RC_ProjectName: row.RC_ProjectName,
            RC_InspectionDepartment: row.RC_InspectionDepartmentID,
            DraftID: row.DraftID,
            guId: row.GUID
          })
          : await SelectUseTempDetail({
            TemplateID: row.RC_TemplateID,
            RC_ProjectName: row.RC_ProjectName,
            RC_InspectionDepartment: row.RC_InspectionDepartmentID,
            guId: row.GUID
          });
        this.addFormData.Rc_CaseDetail = data.CaseDetail_dto_list;
        this.TemplateTableData = data.CheckContent_dto_list.map(item => {
          return {
            ZCScore: item.ZCScore,
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
              return {
                ErrorContent: item.ErrorContent,
                Grade: item.Grade,
                ErrorID: item.ErrorID,
                ErrorIDs: item.ErrorID
              };
            }),

            RC_RectificationMeasures: item.RC_RectificationMeasures,
            RC_Opinion: item.RC_Opinion,
            RC_AuditOpinion: item.RC_AuditOpinion,
            FileList_dto: item.FileList_dto,
            ErrorIDArray: [],
            RC_TotalScore:
              item.RC_TotalScore == 0 ? item.ScoreCriteria : item.RC_TotalScore
          };
        });
        this.addFormData.fullMark = 0;
        this.addFormData.totalPoints = 0;
        this.TemplateTableData.map(item => {
          this.addFormData.fullMark =
            parseFloat(this.addFormData.fullMark) +
            parseFloat(item.RC_TotalScore);
          this.addFormData.totalPoints =
            parseFloat(this.addFormData.totalPoints) +
            parseFloat(item.RC_Score);
        });
        this.getJBXXTableData();
        this.TemplateTableDataLoading = false; // 关闭打开内容等待加载条
        this.options.map((item) => {
          while (this.addFormData.CheckUserID === item.UserID) {
            this.auditorName = item.UserName;
            break;
          }
        });
        // 如果num=1代表是按查看详情进来的，否则就是点击编辑按钮进来的
        if (num === 1) {
          this.useTemplateDialogTitle = '查看项目';
          this.dialogUseTemplateView = true;
          // 先遍历出审核人，因为只知道审核人id,和所有审核人的数据，现在要取审核人名称
        } else {
          this.dialogUseTemplate = true;
        }
      } catch (error) {
        this.TemplateTableDataLoading = false; // 关闭打开内容等待加载条
        console.log(error);
      }
    },
    async moreUseTempDetail(row) {
      console.log(row);
      try {
        const { code } = await ReuseTemplate({
          guId: row.GUID
        });
        if (code === 200) {
          await this.SelectUseTemp(); // 刷新列表
          this.$message.success('生成复用表单成功');
        }
      } catch (e) {
        console.log(e);
      }
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
      value.map(item => {
        row.Check.map(item2 => {
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
          parseFloat(item.RC_TotalScore);
        this.addFormData.totalPoints =
          parseFloat(this.addFormData.totalPoints) + parseFloat(item.RC_Score);
      });
    },
    resetForm() {
      this.$refs.addFormData.resetFields();
    },
    cancle(cancleNum) {
      if (!this.addFormData.RC_ProjectName) {
        // 如果有参数2传进来，说明是查看详情的对话框点击关闭，否则是编辑框点击关闭
        if (cancleNum === 2) {
          this.dialogUseTemplateView = false;
        } else {
          this.dialogUseTemplate = false;
        }

        return;
      }
      if (this.useTemplateDialogTitle == '制作表单') {
        this.$confirm('是否存为草稿?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            // 如果有参数2传进来，说明是查看详情的对话框点击关闭，否则是编辑框点击关闭
            if (cancleNum === 2) {
              this.dialogUseTemplateView = false;
            } else {
              this.dialogUseTemplate = false;
            }
            this.addDraft();
          })
          .catch(() => {
          });
      }
      this.resetForm();
      this.innerDisabled = false;
      this.TemplateTableData = [];
      this.addFormData.RC_TemplateName = '';
      // 如果有参数2传进来，说明是查看详情的对话框点击关闭，否则是编辑框点击关闭
      if (cancleNum === 2) {
        this.dialogUseTemplateView = false;
      } else {
        this.dialogUseTemplate = false;
      }
    },
    async submitTemplate() {
      try {
        this.$refs.addFormData.validate(async v => {
          if (v) {
            this.addFormData.CheckUserID =
              this.addFormData.CheckUserID == ''
                ? 0
                : this.addFormData.CheckUserID;
            this.addFormData.Rc_checkcontent = this.TemplateTableData.map(
              item => {
                return {
                  RC_DeductedPoints:
                    item.RC_DeductedPoints == undefined ||
                    item.RC_DeductedPoints == ''
                      ? ''
                      : item.RC_DeductedPoints.join('$'),
                  RC_Score: item.RC_Score,
                  RC_DeductedPointsRemarks: item.RC_DeductedPointsRemarks,
                  CheckID: item.CheckID,
                  RC_RectificationMeasures: item.RC_RectificationMeasures,
                  RC_Opinion: item.RC_Opinion,
                  FileList_dto: item.FileList_dto,
                  ErrorIDArray: item.ErrorIDArray,
                  RC_TotalScore: item.RC_TotalScore
                };
              }
            );
            if (this.useTemplateDialogTitle !== '制作表单') {
              this.addFormData.RC_InspectionDepartment =
                this.addFormData.RC_InspectionDepartment ||
                this.RC_InspectionDepartmentID;
            }
            if (!this.addFormData.RC_InspectionDepartmentID) {
              this.$message.warning('请您选择科室部门!');
              return;
            }
            if (!this.addFormData.RC_InspectionTimeStat) {
              this.$message.warning('请您选择检查日期!');
              return;
            }
            if (this.addFormData.Rc_checkcontent.length == 0) {
              this.$message.warning('请您选择表单模版!');
              return;
            }
            if (!this.addFormData.CheckMonth) {
              this.$message.warning('请您选择月份!');
              return;
            }
            this.tableBtnLoading = true; // 开启提交按钮等待圈
            const { msg} =
              this.useTemplateDialogTitle === '制作表单'
                ? await InsertUseTemp(this.addFormData)
                : await UpdateUseTempDetail(this.addFormData);
            this.$message.success(msg);
            this.dialogUseTemplate = false;
            this.$nextTick(()=>{
              this.tableBtnLoading = false; // 关闭提交按钮等待圈
            });

          } else {
            this.$nextTick(()=>{
              this.tableBtnLoading = false; // 关闭提交按钮等待圈
            });
            return false;
          }
          this.SelectUseTemp();
        });
        this.tableBtnLoading = false; // 关闭提交按钮等待圈
      } catch (error) {
        this.tableBtnLoading = false; // 关闭提交按钮等待圈
        console.log(error);
      }
    },
    getDefaultDeptValues(v) {
      this.addFormData.RC_InspectionDepartmentID = v;
      this.addFormData.RC_InspectionDepartment = v;
    },
    getDefaultDeptValues2(v) {
      this.listQuery.RC_InspectionDepartment = v;
    },
    listQueryGet(v) {
      this.listQuery.RC_InspectionDepartment = v;
    },
    async templateList(row) {
      row = JSON.parse(JSON.stringify(row));
      this.addFormData.RC_TemplateName = row.RC_TemplateName;
      this.addFormData.RC_TemplateID = row.TemplateID;
      if (!this.addFormData.RC_ProjectName) {
        this.addFormData.RC_ProjectName = row.RC_TemplateName;
      }
      try {
        const { data } = await SelectTemplateByID({
          TemplateID: row.TemplateID
        });
        this.addFormData.Rc_CaseDetail = [];
        this.addFormData.CaseJudgment = data.DataList[0].CaseJudgment;
        this.addFormData.Precautions = data.DataList[0].Precautions;
        this.TemplateTableData = this.dataFiltter(data.DataList);
        this.getJBXXTableData();
        this.addFormData.fullMark = 0;
        this.addFormData.totalPoints = 0;
        this.TemplateTableData.map(item => {
          this.addFormData.fullMark =
            parseFloat(this.addFormData.fullMark) +
            parseFloat(item.RC_TotalScore);
          this.addFormData.totalPoints =
            parseFloat(this.addFormData.totalPoints) +
            parseFloat(item.RC_Score);
        });
      } catch {
      }
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
                Grade: item.Grade,
                ErrorID: item.ErrorID
              }
            ],
            CheckID: item.CheckID,
            RC_Score: item.ScoreCriteria,
            ScoreCriteria: item.ScoreCriteria,
            RC_TotalScore: item.ScoreCriteria,
            Type: item.Type,
            id: Number(
              Math.random()
                .toString()
                .substr(3, 3) + Date.now()
            ).toString(36),
            RC_DeductedPointsRemarks: item.ProjectContentRemark,
            Category: item.Category,
            ProjectContent: item.ProjectContent,
            FileList_dto: [],
            ErrorIDArray: []
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
                Grade: item.Grade,
                ErrorID: item.ErrorID
              });
              dj.RC_Score = item.ScoreCriteria;
              dj.RC_TotalScore = item.ScoreCriteria;
              dj.RC_DeductedPointsRemarks = item.ProjectContentRemark;
              dj.FileList_dto = [];
              dj.ErrorIDArray = [];
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
    userTemplateButton() {
      // this.moreUse = true;
      this.UserNameIf = true;
      this.dialogUseTemplate = true;
      this.innerDisabled = false;
      this.useTemplateDialogTitle = '制作表单';
      this.TemplateTableData = [];
      this.addFormData = {
        RC_ProjectName: '',
        RC_TemplateName: '',
        RC_TemplateID: 0,
        RC_InspectionDepartmentID: window.userInfo[0].DeptID,
        RC_ManagementLevel: '科室自查',
        RC_InspectionDepartment: window.userInfo[0].DeptID,
        RC_InspectionTimeStat: '',
        RC_Inspector: window.userInfo[0].UserName,
        RC_InspectorOther: '',
        RC_Filler: window.userInfo[0].UserID,
        RC_Remarks: '',
        Rc_checkcontent: [],
        CheckUserID: '',
        RC_InspectionDepartmentName: this.DeptName,
        Rc_CaseDetail: [],
        fullMark: 0,
        totalPoints: 0,
        userTemplateButton: '',
        CheckMonth: ''
      };
      this.addFormData.Status = 1;
    },
    async handleDownload() {
      this.downloadLoading = true;
      let total;
      if (!this.downloadValue) {
        total = this.pagination.total;
      } else {
        total = this.downloadValue;
      }
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
          '协同检查者',
          '项目备注',
          '总审核意见'
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
          'RC_Remarks',
          'AllAuditOpinion'
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
        this.listLoading = true;
        const { data } = await SelectUseTemp(this.listQuery);
        this.tableData = data.DataList;
        this.pagination.total = data.Total;
        this.tableData.map((item,index) => {
          item.RC_DeductedPoints = [
            ...new Set(item.RC_DeductedPoints.split('$'))
          ].join('\n');
          // 科室自查这一栏页面，不需要显示抽查表单，所以得到数据后，是抽查表单类型的就删除该条
          if (item.RC_TemplateType === '抽查表单') {
            delete this.tableData[index];
          }
        });
      } catch {
      } finally {
        this.listLoading = false;
      }
    },
    async clickSelectUseTemp() {
      this.listLoading = true;
      this.listQuery.pageIndex = 1;
      this.pagination.pageIndex = 1;
      this.checked ? this.SelectUseTempDraft() : this.SelectUseTemp();
      this.listLoading = false;
    },
    handleCurrentChange(index) {
      this.listLoading = true;
      this.listQuery.pageIndex = index;
      this.SelectUseTemp();
    },
    handleSizeChange(page) {
      this.listLoading = true;
      this.listQuery.pageSize = page;
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
      } catch (error) {
        console.log(error);
      }
    },
    submit(row) {
      if (
        row.Status == 2 ||
        row.Status == 8 ||
        row.Status == 5 ||
        row.Status == 7
      ) {
        this.$confirm('请确认提交', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            InsertUpdateReview({
              GUID: row.GUID,
              Status: 3,
              Step: 1
            })
              .then(res => {
                if (res.code === 200) {
                  this.$message.success('提交成功!');
                  this.SelectUseTemp();
                }
              })
              .catch(err => {
                console.log(err);
              });
          })
          .catch(() => {
          });
      } else {
        if (row.Status == 1) {
          this.$message.warning('请补充完整再提交');
        } else {
          this.$message.warning('已提交过');
        }
      }
    },
    handleSuccessIndex(scope) {
      this.TemplateTableDataIndex = scope.$index;
    },
    handleSuccess(response, file, scope) {
      console.log(file);
      if (response.code === 200) {
        const data = response.data[0];
        this.TemplateTableData[this.TemplateTableDataIndex].FileList_dto.push({
          FileID: 0,
          CheckID: 0,
          FileName: file.name,
          FileUrl: data.FileUrl,
          OpenFileUrl: data.OpenFileUrl
        });
      } else {
        this.fileList = [];
        this.$message.error(file.name + '上传失败');
      }
    },
    handleChange(file, fileList) {
      this.uploadEnd = true;
      fileList.forEach(item => {
        this.uploadEnd = !(item.response && item.response.code === 200);
      });
    },
    async SelectZGUser() {
      this.optionsVal.UserName = this.optionsUserName;
      const { data } = await SelectZGUser(this.optionsVal);
      this.options = data.DataList;
      this.optionsVal.total = data.Total;
    },
    remoteMethod(val) {
      this.optionsUserName = val;
      this.SelectZGUser();
    },
    selectUserID(val) {
      this.addFormData.CheckUserID = val;
    },
    optionsValSizeChange(val) {
      this.optionsVal.pageSize = val;
      this.SelectZGUser();
    },
    optionsValCurrentChange(val) {
      this.optionsVal.pageIndex = val;
      this.SelectZGUser();
    },
    async ExportUseTemp() {
      try {
        this.addFormData.Rc_checkcontent = this.TemplateTableData.map(item => {
          return {
            RC_DeductedPoints:
              item.RC_DeductedPoints == ''
                ? ''
                : item.RC_DeductedPoints.join('$'),
            RC_Score: item.RC_Score,
            RC_DeductedPointsRemarks: item.RC_DeductedPointsRemarks,
            CheckID: item.CheckID,
            RC_RectificationMeasures: item.RC_RectificationMeasures,
            RC_Opinion: item.RC_Opinion,
            FileList_dto: item.FileList_dto,
            ErrorIDArray: item.ErrorIDArray,
            RC_TotalScore: item.RC_TotalScore
          };
        });
        const { data } = await ExportUseTemp(this.addFormData);
        const url = data;
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        link.setAttribute('download', '自查表单');
        document.body.appendChild(link);
        link.click();
      } catch (error) {
      }
    },
    addCase() {
      this.addFormData.Rc_CaseDetail.push({
        HospitalNumber: '',
        PatientName: '',
        MedicalGroupName: ''
      });
    },
    deleteCase(index) {
      this.addFormData.Rc_CaseDetail.splice(index, 1);
    },
    resize(val) {
      this.isFullscreen = val;
    },
    async addDraft() {
      try {
        this.addFormData.Rc_checkcontent = this.TemplateTableData.map(item => {
          return {
            RC_DeductedPoints:
              item.RC_DeductedPoints == ''
                ? ''
                : item.RC_DeductedPoints.join('$'),
            RC_Score: item.RC_Score,
            RC_DeductedPointsRemarks: item.RC_DeductedPointsRemarks,
            CheckID: item.CheckID,
            RC_RectificationMeasures: item.RC_RectificationMeasures,
            RC_Opinion: item.RC_Opinion,
            FileList_dto: item.FileList_dto,
            ErrorIDArray: item.ErrorIDArray,
            RC_TotalScore: item.RC_TotalScore
          };
        });
        this.addFormData.CheckUserID =
          this.addFormData.CheckUserID == '' ? 0 : this.addFormData.CheckUserID;
        const { code } = await InsertUseTempDraft(this.addFormData);
        code === 200
          ? this.$message.success('存为草稿成功!')
          : this.$message.warning('存为草稿失败!');
        this.checked = true;
        this.SelectUseTempDraft();
      } catch (error) {
      }
      this.dialogUseTemplate = false;
    },
    async SelectUseTempDraft() {
      try {
        const { data } = await SelectUseTempDraft(this.listQuery);
        this.tableData = data.DataList;
      } catch (error) {
      }
    },
    async DeleteUseTemplateDraft(row) {
      const { code } = await DeleteUseTemplateDraft({
        DraftID: row.DraftID
      });
      code == 200
        ? this.$message.success('删除成功!')
        : this.$message.error('删除失败!');
      this.SelectUseTempDraft();
    },
    checkbox(val) {
      val ? this.SelectUseTempDraft() : this.clickSelectUseTemp();
    },
    /* 草稿提交为表单 */
    async submitUseTemp() {
      this.$refs.addFormData.validate(async v => {
        if (v) {
          this.addFormData.IsDraft = 1;
          if (!this.addFormData.RC_InspectionDepartmentID) {
            this.$message.warning('请您选择科室部门!');
            return;
          }
          if (!this.addFormData.RC_InspectionTimeStat) {
            this.$message.warning('请选择检查时间!');
            return;
          }
          if (this.TemplateTableData.length == 0) {
            this.$message.warning('请您选择表单模版!');
            return;
          }
          if (!this.addFormData.CheckMonth) {
            this.$message.warning('请您选择月份!');
            return;
          }
          this.addFormData.Rc_checkcontent = this.TemplateTableData.map(
            item => {
              return {
                RC_DeductedPoints:
                  item.RC_DeductedPoints == ''
                    ? ''
                    : item.RC_DeductedPoints.join('$'),
                RC_Score: item.RC_Score,
                RC_DeductedPointsRemarks: item.RC_DeductedPointsRemarks,
                CheckID: item.CheckID,
                RC_RectificationMeasures: item.RC_RectificationMeasures,
                RC_Opinion: item.RC_Opinion,
                FileList_dto: item.FileList_dto,
                ErrorIDArray: item.ErrorIDArray,
                RC_TotalScore: item.RC_TotalScore
              };
            }
          );
          const { msg } = await InsertUseTemp(this.addFormData);
          this.$message.success(msg);
          this.checked = false;
          await this.SelectUseTemp();
          this.dialogUseTemplate = false;
        } else {
          return false;
        }
      });
    },
    async UpdateUseTempDraftDetail() {
      /* 更新草稿 */
      try {
        this.addFormData.CheckUserID =
          this.addFormData.CheckUserID == '' ? 0 : this.addFormData.CheckUserID;
        this.addFormData.Rc_checkcontent = this.TemplateTableData.map(item => {
          return {
            RC_DeductedPoints:
              item.RC_DeductedPoints == undefined ||
              item.RC_DeductedPoints == ''
                ? ''
                : item.RC_DeductedPoints.join('$'),
            RC_Score: item.RC_Score,
            RC_DeductedPointsRemarks: item.RC_DeductedPointsRemarks,
            CheckID: item.CheckID,
            RC_RectificationMeasures: item.RC_RectificationMeasures,
            RC_Opinion: item.RC_Opinion,
            FileList_dto: item.FileList_dto,
            ErrorIDArray: item.ErrorIDArray,
            RC_TotalScore: item.RC_TotalScore
          };
        });
        if (this.useTemplateDialogTitle !== '制作表单') {
          this.addFormData.RC_InspectionDepartment =
            this.addFormData.RC_InspectionDepartment ||
            this.RC_InspectionDepartmentID;
          delete this.addFormData.RC_InspectionDepartmentID;
          delete this.addFormData.RC_InspectionDepartmentName;
        }
        const fromData = this.addFormData;
        const { msg } = await UpdateUseTempDraftDetail(fromData);
        this.$message.success(msg);
        this.dialogUseTemplate = false;
        this.SelectUseTempDraft();
        return;
      } catch (error) {
        console.log(error);
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
.seeAddFormData {
  font-weight: bolder;

  .el-row {
    margin-bottom: 25px;
  }
}

.DepartmentSelfExamination {
  margin: 4px;

  .el-header,
  .el-main,
  .el-footer {
    margin: 0;
    padding: 0;
  }

  .content .box-card {
    height: calc(100vh - 100px);
    overflow: hidden;
    overflow-y: auto;

    .content-form {
      .display-flex {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
  }

  .el-loading-spinner {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    -webkit-animation: typing 1s linear infinite alternate;
    -moz-animation: Typing 1s linear infinite alternate;
    animation: typing 1s linear infinite alternate;
    margin: 0 auto; /* Not necessary- its only for layouting*/
    position: relative;
    left: -40px;
  }

  @-webkit-keyframes typing {
    0% {
      background-color: rgba(247, 111, 73, 1);
      box-shadow: 40px 0 0 0 rgba(247, 111, 73, 0.2),
      80px 0 0 0 rgba(247, 111, 73, 0.2);
    }
    25% {
      background-color: rgba(247, 111, 73, 0.4);
      box-shadow: 40px 0 0 0 rgba(247, 111, 73, 2),
      80px 0 0 0 rgba(247, 111, 73, 0.2);
    }
    75% {
      background-color: rgba(247, 111, 73, 0.4);
      box-shadow: 40px 0 0 0 rgba(247, 111, 73, 0.2),
      80px 0 0 0 rgba(247, 111, 73, 1);
    }
  }

  @-moz-keyframes typing {
    0% {
      background-color: rgba(247, 111, 73, 1);
      box-shadow: 40px 0 0 0 rgba(247, 111, 73, 0.2),
      80px 0 0 0 rgba(247, 111, 73, 0.2);
    }
    25% {
      background-color: rgba(247, 111, 73, 0.4);
      box-shadow: 40px 0 0 0 rgba(247, 111, 73, 2),
      80px 0 0 0 rgba(247, 111, 73, 0.2);
    }
    75% {
      background-color: rgba(247, 111, 73, 0.4);
      box-shadow: 40px 0 0 0 rgba(247, 111, 73, 0.2),
      80px 0 0 0 rgba(247, 111, 73, 1);
    }
  }
  @keyframes typing {
    0% {
      background-color: rgba(247, 111, 73, 1);
      box-shadow: 40px 0 0 0 rgba(247, 111, 73, 0.2),
      80px 0 0 0 rgba(247, 111, 73, 0.2);
    }
    25% {
      background-color: rgba(247, 111, 73, 0.4);
      box-shadow: 40px 0 0 0 rgba(247, 111, 73, 2),
      80px 0 0 0 rgba(247, 111, 73, 0.2);
    }
    75% {
      background-color: rgba(0, 184, 220, 0.4);
      box-shadow: 40px 0 0 0 rgba(249, 54, 0, 0.2),
      80px 0 0 0 rgb(2, 243, 130);
    }
  }

  .el-loading-spinner .circular {
    display: none; //隐藏之前element-ui默认的loading动画
  }
}
</style>
