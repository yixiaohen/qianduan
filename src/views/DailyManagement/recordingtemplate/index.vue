<template>
  <div class="RecordingTemplate">
    <el-card style="margin: 10px;width: 98%;height: 87vh;overflow: auto">

      <div
        style="width: 100%;
          background-color:#f4f4f5;
          display: inline-block;
          height: 32px;
          line-height: 32px;"
      >
        <el-form :inline="true" size="mini">
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-circle-plus"
              size="mini"
              @click="addRow"
            >表单制作
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="mini"
              @click="categoryAdmin"
            >类别管理
            </el-button>
          </el-form-item>

          <el-divider direction="vertical"/>
          <el-form-item>
            <el-input
              v-model="listQuery.RC_TemplateName"
              placeholder="表单名称或内容"
              style="width: 180px"
              size="mini"
              clearable
              @keyup.enter.native="clickSelectTemplate()"
            />
          </el-form-item>
          <el-divider direction="vertical"/>
          <el-form-item>
            <el-select
              v-model="listQuery.RC_TemplateType"
              filterable
              clearable
              placeholder="表单类型"
            >
              <el-option label="通用表单" value="通用表单"/>
              <el-option label="科室表单" value="科室表单"/>
              <!--              <el-option label="抽查表单" value="抽查表单"/>-->
              <!--              暂时先停止抽表单开发20211203-->
            </el-select>
          </el-form-item>
          <el-divider direction="vertical"/>
          <el-form-item>
            <el-select
              v-model="listQuery.TemplateTypeName"
              filterable
              clearable
              placeholder="表单类别"
            >
              <el-option
                v-for="(item, index) in tableTypeData"
                :key="index"
                :label="item.TemplateTypeName"
                :value="item.TemplateTypeName"
              />
            </el-select>
          </el-form-item>
          <el-divider direction="vertical"/>
          <el-form-item>
            <el-select
              v-model="listQuery.TemplateSource"
              filterable
              clearable
              placeholder="表单来源"
            >
              <el-option label="全部" value="全部"/>
              <el-option label="系统表单" value="系统表单"/>
              <el-option label="自建表单" value="自建表单"/>
            </el-select>
          </el-form-item>
          <el-divider direction="vertical"/>
          <el-form-item>
            <el-select v-model="listQuery.StateType" placeholder="表单状态">
              <el-option label="全部" :value="-1"/>
              <el-option label="已启用" :value="0"/>
              <el-option label="已禁用" :value="1"/>
            </el-select>
          </el-form-item>
          <el-divider direction="vertical"/>
          <el-form-item>
            <el-button
              :loading="listLoading"
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="clickSelectTemplate()"
            >搜索
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
          highlight-current-row
          size="mini"
          height="calc(100vh - 220px)"
          stripe
        >
          <el-table-column
            type="index"
            label="序号"
            width="60"
            align="center"
          />
          <el-table-column
            prop="RC_TemplateName"
            label="表单名称"
            align="center"
            width="300"
            :show-overflow-tooltip="cellOverflow"
          >
            <template slot-scope="{ row }">
              <span>{{ row.RC_TemplateName }}</span>
              &#12288;&#12288;
              <el-tag v-if="row.RC_CreatUser===UserID" type="success" size="mini">自建</el-tag>
            </template>

          </el-table-column>
          <el-table-column
            prop="TemplateTypeName"
            align="center"
            label="表单类别"
            :show-overflow-tooltip="cellOverflow"
          >
            <template slot-scope="{ row }">
              {{ row.TemplateTypeName }}
            </template>
          </el-table-column>
          <el-table-column
            prop="RC_TemplateType"
            label="表单类型"
            :show-overflow-tooltip="cellOverflow"
          />
          <el-table-column
            prop="TemplateSource"
            label="表单来源"
            align="center"
            :show-overflow-tooltip="cellOverflow"
          />
          <el-table-column
            prop="CaseJudgment"
            label="病例判断"
            width="100"
            align="center"
          >
            <template slot-scope="{ row }">
              {{ row.CaseJudgment == 0 ? '否' : '是' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="RC_StateType"
            label="表单状态"
            width="80"
            align="center"
          >
            <template slot-scope="scope">
              <el-tag :type="scope.row.RC_StateType === 0 ? '' : 'danger'">
                {{ scope.row.RC_StateType === 0 ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column
            label="周期"
            width="60"
            align="center"
            prop="Cycle"
          />
          <el-table-column label="必填表单" width="120" align="center">
            <template slot-scope="{ row }">{{
                row.IsRequired === 0 ? '否' : '是'
                                           }}
            </template>
          </el-table-column>
          <el-table-column
            prop="num"
            label="使用次数"
            width="80"
            align="center"
          />
          <el-table-column
            prop="RC_CreateTime"
            label="创建时间"
            align="center"
            width="140"
          >
            <template slot-scope="{ row }">
              {{ row.RC_CreateTime.split('T').join(' ') }}
            </template>
          </el-table-column>
          <el-table-column
            prop="RC_StateType"
            label="表单分配"
            width="80"
            fixed="right"
            align="center"
          >
            <template slot-scope="{ row }">
              <el-button
                type="primary"
                class="iconfont al-icon-fenpei"
                size="mini"
                circle
                :disabled="row.RC_StateType === 1"
                @click="clickInsertDistri(row)"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            prop="RC_TemplateName"
            align="center"
            fixed="right"
            width="200"
          >
            <template slot-scope="scope">
              <!--              查看-->
              <el-button
                v-if="scope.row.RC_CreatUser!==UserID||RoleCode==='R0001'"
                type="primary"
                size="mini"
                class="el-icon-view"
                :disabled="scope.row.RC_StateType === 1"
                @click="UpdateRow(scope.row)"
              >
              </el-button>
              <!--              编辑-->
              <el-button
                v-if="scope.row.RC_CreatUser===UserID||RoleCode==='R0001'"
                type="info"
                size="mini"
                class="el-icon-edit"
                :disabled="scope.row.RC_StateType === 1"
                @click="UpdateRow(scope.row)"
              >
              </el-button>

              <!--              另存为-->
              <el-popconfirm
                v-if="scope.row.RC_CreatUser!==UserID||RoleCode==='R0001'"
                icon-color="green"
                :title="'确定另存为新的表单？'"
                @confirm="CopyTemplate(scope.row)"
              >
                <el-button
                  slot="reference"
                  type="success"
                  size="mini"
                  class="el-icon-s-promotion"
                  :disabled="scope.row.RC_StateType === 1"
                >
                </el-button>
              </el-popconfirm>
              <!--              启用-->
              <el-button
                v-if="scope.row.RC_StateType === 1"
                type="success"
                size="mini"
                class="el-icon-success"
                @click="UpdateTemplateStatus(scope.row, 0, '启用')"
              >
              </el-button>
              <!--              禁用-->
              <el-button
                v-else
                type="warning"
                size="mini"
                class="el-icon-error"
                @click="UpdateTemplateStatus(scope.row, 1, '禁用')"
              >
              </el-button>
              <!--              删除-->
              <el-button
                :disabled="scope.row.RC_CreatUser!==UserID&&RoleCode!=='R0001'"
                size="mini"
                type="danger"
                class="el-icon-delete"
                @click="Delete(scope.row)"
              >
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row>
          <el-col :span="1">
            <el-switch v-model="cellOverflow" style="margin: 6px 0px"/>
          </el-col>
          <el-col :span="20">
            <el-pagination
              background
              style="margin: 10px 0 0 0"
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
    </el-card>
    <el-dialog
      title="选择扣分原因"
      :width="device === 'desktop' ? '50%' : '99%'"
      :close-on-click-modal="false"
      destroy-on-close
      :visible.sync="dialogError"
    >
      <!--switch 只能增加选项不能减少 -->
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
    <el-dialog
      :width="device === 'desktop' ? '60%' : '90%'"
      :title="dialogTitle"
      :close-on-click-modal="false"
      :visible.sync="dialogFormVisible"
      :destroy-on-close="true"
      top="1vh"
      @close="cancel()"
    >
      <el-form
        ref="formData"
        :rules="rules"
        size="mini"
        :model="formData"
        :inline="true"
      >
        <!--        <el-row>-->
        <!--          <el-col ></el-col>-->
        <!--        </el-row>-->

        <el-form-item
          label="表单名称"
          label-width="80px"
          prop="RC_TemplateName"
        >
          <el-input
            v-model="formData.RC_TemplateName"
            :disabled="(RC_CreatUser!==UserID&&dialogTitle === '编辑表单')&&RoleCode!=='R0001'"
            style="margin-top: -5px"
            clearable
          />
        </el-form-item>
        <el-form-item label="表单类别" label-width="80px" prop="TemplateTypeID">
          <el-select
            v-model="formData.TemplateTypeID"
            :disabled="(RC_CreatUser!==UserID&&dialogTitle === '编辑表单')&&RoleCode!=='R0001'"
            placeholder="请选择"
            style="margin-top:-5px"
          >
            <el-option
              v-for="item in tableTypeData"
              :key="item.TemplateTypeID"
              :label="item.TemplateTypeName"
              :value="item.TemplateTypeID"
            />
          </el-select>
        </el-form-item>

        <el-form ref="formData" size="mini" :model="formData" :inline="true">
          <el-form-item label="病例判断" :required="true">
            <el-radio
              v-model="formData.CaseJudgment"
              border
              :disabled="(RC_CreatUser!==UserID&&dialogTitle === '编辑表单')&&RoleCode!=='R0001'"
              :label="1"
              size="mini"
            >是
            </el-radio>
            <el-radio
              v-model="formData.CaseJudgment"
              :label="0"
              :disabled="(RC_CreatUser!==UserID&&dialogTitle === '编辑表单')&&RoleCode!=='R0001'"
              border
              size="mini"
            >否
            </el-radio>
          </el-form-item>
          <el-form-item label="是否必填" :required="true">
            <el-radio
              v-model="formData.IsRequired"
              border
              :disabled="(RC_CreatUser!==UserID&&dialogTitle === '编辑表单')&&RoleCode!=='R0001'"
              :label="1"
              size="mini"
            >是
            </el-radio>
            <el-radio
              :disabled="(RC_CreatUser!==UserID&&dialogTitle === '编辑表单')&&RoleCode!=='R0001'"
              v-model="formData.IsRequired"
              border
              :label="0"
              size="mini"
            >否
            </el-radio>
          </el-form-item>
          <el-form-item label="表单类型" :required="true">
            <el-radio
              :disabled="(RC_CreatUser!==UserID&&dialogTitle === '编辑表单')&&RoleCode!=='R0001'"
              v-model="formData.RC_TemplateType"
              border
              label="通用表单"
              size="mini"
            >通用表单
            </el-radio>
            <el-radio
              :disabled="(RC_CreatUser!==UserID&&dialogTitle === '编辑表单')&&RoleCode!=='R0001'"
              v-model="formData.RC_TemplateType"
              border
              label="科室表单"
              size="mini"
            >科室表单
            </el-radio>
            <!--            <el-radio-->
            <!--              :disabled="(RC_CreatUser!==UserID&&dialogTitle === '编辑表单')"-->
            <!--              v-model="formData.RC_TemplateType"-->
            <!--              border-->
            <!--              label="抽查表单"-->
            <!--              size="mini"-->
            <!--            >抽查表单-->
            <!--            </el-radio>-->
          </el-form-item>
          <el-form-item
            v-show="formData.IsRequired == 1"
            label="周期/天"
            :disabled="(RC_CreatUser!==UserID&&dialogTitle === '编辑表单')&&RoleCode!=='R0001'"
            prop="Cycle"
            class="period"
          >
            <el-input
              v-model="formData.Cycle"
              style="margin-top: -5px"
              type="Number"
              :disabled="(RC_CreatUser!==UserID&&dialogTitle === '编辑表单')&&RoleCode!=='R0001'"
              clearable
              placeholder="请输入天数(正整数)"
              @input="changeInput"
            />
          </el-form-item>
        </el-form>
      </el-form>
      <el-form :inline="true" size="mini">
        <el-form-item label="注意事项" label-width="77px">
          <el-input
            v-model="formData.Precautions"
            :disabled="(RC_CreatUser!==UserID&&dialogTitle === '编辑表单')&&RoleCode!=='R0001'"
            clearable
            style="margin-top: -5px"
          />
        </el-form-item>
      </el-form>
      <el-table
        ref="multipleTable"
        v-loading="ContentDataLoading"
        :data="ContentData"
        border
        size="mini"
        style="margin-top: 10px"
        :header-cell-style="{'text-align':'center'}"
        :cell-style="{'text-align':'center'}"
        height="calc(100vh - 260px)"
      >
        <el-table-column
          type="index"
          label="序号"
          label-width="80px"
        />
        <el-table-column
          label="类别"
          prop="Category"
          min-width="100px"
        >
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.Category"
              size="mini"
              :disabled="(RC_CreatUser!==UserID&&dialogTitle === '编辑表单')&&RoleCode!=='R0001'"

              placeholder="类别"
              type="textarea"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="检查项目"
          prop="ProjectContent"
          min-width="100px"
        >
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.ProjectContent"
              size="mini"
              :disabled="(RC_CreatUser!==UserID&&dialogTitle === '编辑表单')&&RoleCode!=='R0001'"

              placeholder="检查项目"
              type="textarea"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="Content"
          label="检查内容"
          min-width="100px"
        >
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.Content"
              :disabled="(RC_CreatUser!==UserID&&dialogTitle === '编辑表单')&&RoleCode!=='R0001'"

              size="mini"
              placeholder="检查内容"
              type="textarea"
            />
          </template>
        </el-table-column>

        <el-table-column
          prop="ScoreCriteria"
          label="分数"
          width="80px"
          align="center"
        >
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.ScoreCriteria"
              size="mini"
              :disabled="(RC_CreatUser!==UserID&&dialogTitle === '编辑表单')&&RoleCode!=='R0001'"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="ProjectContentRemark"
          label="备注"
          align="center"
          min-width="120px"
        >
          <template slot-scope="scope">
            <el-input
              :disabled="(RC_CreatUser!==UserID&&dialogTitle === '编辑表单')&&RoleCode!=='R0001'"
              v-model="scope.row.ProjectContentRemark"
              size="mini"
              type="textarea"
            />
          </template>
        </el-table-column>
        <el-table-column prop="ErrorContent" label="扣分原因" min-width="100px">
          <template slot-scope="{ row }">
            <div v-html="row.ErrorContent">
              {{ row.ErrorContent }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200px">
          <template slot-scope="scope">
            <el-button
              :disabled="(RC_CreatUser!==UserID&&dialogTitle === '编辑表单')&&RoleCode!=='R0001'"
              size="mini"
              @click="SelectContent(scope.row, scope)"
            >选择扣分原因
            </el-button>
            <el-button
              :disabled="(RC_CreatUser!==UserID&&dialogTitle === '编辑表单')&&RoleCode!=='R0001'"
              type="danger"
              size="mini"
              @click="deleteContent(scope.row.id)"
            >移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button v-show="!(RC_CreatUser!==UserID&&dialogTitle === '编辑表单')||RoleCode==='R0001'" size="small" @click="addNormdialog">指标库
        </el-button>
        <el-button v-show="!(RC_CreatUser!==UserID&&dialogTitle === '编辑表单')||RoleCode==='R0001'" size="small" @click="addContent()">添加检查内容
        </el-button>
        <el-button
          v-show="!(RC_CreatUser!==UserID&&dialogTitle === '编辑表单')||RoleCode==='R0001'"
          size="small"
          type="primary"
          @click="submitTemplate"
        >确定
        </el-button>
        <el-button size="small" @click="cancel()">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :width="device === 'desktop' ? '50%' : '90%'"
      title="表单分配"
      :close-on-click-modal="false"
      :visible.sync="dialogAllot"
    >
      <el-tabs v-model="activeName">
        <el-tab-pane label="基本信息" name="first">
          <div class="content">
            <el-card shadow="never" class="box-card">
              <div class="content-form">
                <el-form
                  ref="addFormData"
                  size="mini"
                  label-width="96px"
                  :model="addFormData"
                  :rules="rule"
                  label-position="right"
                >
                  <el-form-item label="任务名称" prop="DistributionName">
                    <el-input
                      v-model="addFormData.DistributionName"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="自查科室" prop="RC_InspectionDepartment">
                    <default-depts
                      ref="allSelect"
                      w="100%"
                      :multiple="true"
                      :value="addFormData.RC_InspectionDepartment"
                      @getDefaultDeptsValue="getDefaultDeptValues"
                    />
                  </el-form-item>

                  <el-form-item
                    v-if="radioShow"
                    label="跳过主管审核"
                    prop="IsJump"
                    label-width="110px"
                  >
                    <el-radio
                      v-model="addFormData.IsJump"
                      :label="1"
                    >是
                    </el-radio>
                    <el-radio
                      v-model="addFormData.IsJump"
                      style="margin-left: 10px"
                      :label="0"
                    >否
                    </el-radio>
                  </el-form-item>
                  <el-form-item
                    v-if="addFormData.IsJump == 0"
                    label="审核人"
                    prop="CheckUserID"
                  >
                    <el-select
                      v-if="addFormData.IsJump == 0"
                      v-model="optionsVal.UserName"
                      filterable
                      placeholder="请选择"
                      @change="selectUserID"
                    >
                      <el-option
                        v-for="item in options"
                        :key="item.UserID"
                        :label="item.UserName"
                        :value="item.UserID"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="表单名称" prop="RC_TemplateName">
                    <el-input v-model="addFormData.RC_TemplateName" disabled/>
                  </el-form-item>
                </el-form>
              </div>
              <div class="content-table">
                <el-table
                  :data="TemplateTableData"
                  style="width: 100%"
                  border
                  size="mini"
                  height="calc(100vh - 380px)"
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
                    min-width="100px"
                  />
                  <el-table-column
                    label="检查项目"
                    prop="ProjectContent"
                    min-width="100px"
                  />
                  <el-table-column label="检查内容" prop="Content"/>
                  <el-table-column
                    label="满分"
                    width="80"
                    align="center"
                    prop="ScoreCriteria"
                  />
                  <el-table-column
                    label="得分"
                    width="100"
                    align="center"
                    prop="RC_Score"
                  />
                  <el-table-column label="扣分原因" prop="RC_DeductedPoints">
                    <template slot-scope="scope">
                      <p
                        v-for="(item, indexCheck) in scope.row.Check"
                        :key="indexCheck"
                      >
                        {{ item.ErrorContent }}
                      </p>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="整改措施"
                    align="center"
                    prop="RC_RectificationMeasures"
                  />
                  <el-table-column
                    label="效果评价"
                    align="center"
                    prop="RC_Opinion"
                  />
                  <el-table-column
                    label="备注"
                    align="center"
                    prop="RC_DeductedPointsRemarks"
                  />
                </el-table>
              </div>
            </el-card>
          </div>
        </el-tab-pane>
        <el-tab-pane label="自查人" name="second">
          <tree-filter
            ref="TreeID"
            :tree-data="TreeFilterData"
            @getSelect="getSelect"
          />
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogAllot = false">取 消</el-button>
        <el-button
          type="primary"
          size="mini"
          @click="InsertDistribution"
        >确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="指标库"
      :width="device === 'desktop' ? '70%' : '99%'"
      :close-on-click-modal="false"
      :visible.sync="addNormDialog"
    >
      <el-form :inline="true" size="mini" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="form.Category" placeholder="类别"/>
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.ProjectContent" placeholder="检查项目"/>
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.Content" placeholder="检查内容"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="SelectNorm">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-table
        ref="normRef"
        :data="tableDataNorm"
        border
        style="width: 100%"
        height="500"
        @selection-change="handleSelectionChangeNorm"
      >
        <el-table-column
          type="selection"
          width="40"
          :reserve-selection="true"
          align="center"
        />
        <el-table-column prop="Category" label="类别" width="180"/>
        <el-table-column prop="ProjectContent" label="项目" width="180"/>
        <el-table-column prop="Content" label="检查内容"/>
        <el-table-column prop="ErrorContent" label="扣分原因">
          <template slot-scope="{ row }">
            <div v-html="row.ErrorContent"/>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="addNormDialog = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="类别管理"
      :visible.sync="typeDialog"
      :width="device === 'desktop' ? '50%' : '99%'"
    >
      <el-table
        v-loading="TypeDataLoading"
        :data="tableTypeData"
        style="height: 500px; overflow-y: auto; overflow-x: hidden"
        border
        size="mini"
      >
        <el-table-column
          type="index"
          label="序号"
          width="60"
          align="center"
          fixed="left"
        />
        <el-table-column
          v-for="(itemType, indexType) in tableTypeTitle"
          :key="indexType"
          :prop="itemType.prop"
          :label="itemType.title"
          align="left"
          class="tableType"
        >
          <template slot-scope="{ row, $index }">
            <el-input
              v-if="typeEdit === $index"
              v-model="row[itemType.prop]"
              :disabled="itemType.disabled"
              size="mini"
              mini="size"
            />
            <span v-else>{{ row[itemType.prop] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="typeEdit === scope.$index"
              type="text"
              size="mini"
              @click="finished(scope)"
            >完成
            </el-button>
            <el-button
              v-else
              type="text"
              size="mini"
              @click="TypeEdit(scope)"
            >修改
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="DeleteType(scope)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="flexBox">
        <el-button
          size="small"
          type="success"
          icon="el-icon-circle-plus"
          @click="insetTypeData"
        >新 增
        </el-button>
        <el-button
          size="small"
          type="primary"
          @click="typeDialog = false"
        >关闭
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import defaultDept from '@/views/components/defaultDept';
import defaultDepts from '@/views/components/defaultDepts';
import { SelectNorm } from '@/api/norm';
import tableHeight from '@/views/mixin/tableHeight';
import treeFilter from '@/views/components/treeFilter';
import { mapGetters } from 'vuex';
import {
  CopyTemplate,
  DeleteTemplate,
  InsertDistribution,
  InsertTemplate,
  InsertTemplateType,
  SelectTemplate,
  SelectTemplateByID,
  SelectTemplateType,
  UpdateTemplate,
  UpdateTemplateStatus,
  UpdateTemplateType
} from '@/api/RC_Template';
import { SelectDeptorUser } from '@/api/institution';
import { SelectZGUser } from '@/api/user';
import reasonfordeduction from '@/views/components/reasonfordeduction';

export default {
  name: 'RecordingTemplate',
  components: { defaultDepts, treeFilter, defaultDepts, reasonfordeduction },
  mixins: [tableHeight],
  data() {
    return {
      RoleCode: window.userInfo[0].RoleCode, // 管理员
      ContentDataLoading: false, // 表单内容加载等待
      // useTNum: 1, // 可复用表单次数
      // isMoreUse: '否', // 分配到科室的表单是否可以复用，默认否不可复用
      RC_CreatUser: '', // 创建人id
      UserID: window.userInfo[0].UserID.toString(),
      listLoading: true,
      dialogFormVisible: false,
      dialogError: false,
      errorLoading: true,
      dialogTitle: '添加表单',
      tableData: [],
      spanArr: [],
      RC_ErrorData: [],
      ContentData_id: 0,
      ContentDataIndex: 0,
      ContentData: [
        {
          Category: '',
          ProjectContent: '',
          ProjectMethod: '',
          ProjectContentRemark: '',
          Content: '',
          ScoreCriteria: 0,
          RC_ErrorID: '',
          CheckID: 0,
          Type: 0,
          NormID: 0,
          id: Number(
            Math.random()
              .toString()
              .substr(3, 3) + Date.now()
          ).toString(36)
        }
      ],
      ContentData_temp: {},
      pagination: {
        pageIndex: 1,
        total: 0,
        pageSize: 20,
        pageSizes: [20, 50, 100]
      },
      listQuery: {
        pageIndex: 1,
        pageSize: 20,
        TemplateTypeName: '',
        RC_TemplateType: '',
        RC_TemplateName: '',
        RC_InspectionDepartment: '',
        StateType: -1,
        TemplateSource: '',
        UserID: window.userInfo[0].UserID
      },
      ErrorQuery: {
        pageSize: 50,
        pageIndex: 1,
        condition: '',
        total: 0,
        ErrorContent: '',
        TypeName: ''
      },
      selectRC_ErrorTypeVal: {
        pageIndex: 1,
        pageSize: 100,
        Total: 0,
        TypeName: ''
      },
      formData: {
        RC_TemplateName: '',
        RC_TemplateType: '通用表单',
        RC_CreatUser: window.userInfo[0].UserID,
        RC_CreateTime: '',
        Type: 0,
        Rc_checkcontent: [],
        TemplateTypeID: '',
        CaseJudgment: 0,
        IsRequired: 0,
        Cycle: '',
        Precautions: ''
      },
      RC_TemplateTypeData: [
        {
          lable: '科室自查',
          value: '科室自查'
        },
        {
          lable: '日常监管',
          value: '日常监管'
        },
        {
          lable: '通用表单',
          value: '通用表单'
        }
      ],
      UpdateContent: null,
      rules: {
        TemplateTypeID: [
          { required: true, message: '请选择表单类别', trigger: 'blur' }
        ],
        RC_TemplateName: [
          { required: true, message: '请输入表单名称', trigger: 'blur' }
        ],
        RC_TemplateType: [
          { required: true, message: '请输入表单类型', trigger: 'change' }
        ],
        ScoreCriteria: [
          { required: true, message: '分数必填', trigger: 'blur' }
        ],
        Content: [{ required: true, message: '检查内容必填', trigger: 'blur' }]
      },
      rowContentData: new Map(),
      dialogAllot: false,
      TemplateTableData: [],
      addFormData: {
        DistributionName: '',
        RC_TemplateName: '',
        RC_TemplateID: 0,
        RC_InspectionDepartmentID: 0,
        RC_ManagementLevel: '科室自查',
        RC_InspectionDepartment: 0,
        RC_InspectionTimeStat: null,
        RC_Inspector: '',
        RC_InspectorOther: '',
        RC_Filler: window.userInfo[0].UserID,
        RC_Remarks: '',
        Rc_checkcontent: [],
        DistributionUserID: '',
        RC_AllAuditOpinion: '',
        CheckUserID: 0,
        IsJump: 0,
        CaseJudgment: 0
      },

      TreeFilterData: {
        label: 'Name',
        children: 'children',
        key: 'UserID' /* 要获取的值 */,
        treeData: [],
        defaultKeys: ''
      },
      activeName: 'first',
      radioShow: false /* 是否隐藏单选 */,
      rule: {
        RC_InspectionDepartment: [
          { required: true, message: '请选择科室', trigger: 'blur' }
        ],
        CheckUserID: [
          { required: true, message: '请选择审核人', trigger: 'blur' }
        ],
        IsJump: [
          {
            required: true,
            message: '请选择是否跳过主管审核',
            trigger: 'blur'
          }
        ],
        DistributionName: [
          { required: true, message: '请输入项目名称', trigger: 'blur' }
        ]
      },
      addNormDialog: false,
      form: {
        Category: '',
        ProjectContent: '',
        Content: '',
        pageSize: 0,
        pageIndex: 1,
        total: 0,
        ErrorIDs: ''
      },
      tableDataNorm: [],
      SelectRC_ErrorData: {
        RC_ErrorID: [],
        RC_ErrorIDs: [],
        num: ''
      },
      optionsVal: {
        pageIndex: 1,
        pageSize: 0,
        total: 0,
        UserName: ''
      },
      options: [],
      insetRC_ErrorLoading: false,
      typeDialog: false,
      tableTypeData: [],
      tableTypeTitle: [
        {
          title: '类别名称',
          prop: 'TemplateTypeName'
        }
      ],
      typeEdit: -1,
      TypeDataLoading: false,
      cellOverflow: false
    };
  },
  created() {
    this.SelectTemplate();
    this.getTreeData();
    this.SelectZGUser();
    this.SelectTemplateType();
    this.SelectNorm();
  },
  computed: {
    ...mapGetters(['device', 'permission_routes'])
  },
  methods: {
    // 表单另存为功能
    async CopyTemplate(row) {
      try {
        const { code } = await CopyTemplate(
          {
            templateId: row.TemplateID,
            userId: window.userInfo[0].UserID
          }
        );
        if (code === 200) {
          this.$message.success('保存成功');
          await this.SelectTemplate(); // 刷新表单
        }
      } catch (e) {
        console.log(e);
      }
    },
    async UpdateTemplateStatus(row, type, text) {
      this.$confirm(
        `此操作将${text} ${row.RC_TemplateName} , 是否继续?`,
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(async() => {
          try {
            const { msg } = await UpdateTemplateStatus({
              TemplateID: row.TemplateID,
              RC_StateType: type
            });
            this.$message({
              type: 'success',
              message: msg
            });
          } catch (error) {
            console.log(error);
          } finally {
            this.listLoading = true;
            this.SelectTemplate();
          }
        })
        .catch(e => e);
    },
    getRowKey({ ErrorID }) {
      return ErrorID;
    },
    isNull(value) {
      if (value === null) {
        return true;
      } else {
        return false;
      }
    },
    async UpdateRow(row) {
      this.ContentDataLoading = true; // 打开内容等待加载条
      this.RC_CreatUser = row.RC_CreatUser; // 用来比较当前所选的条目是否是本账号创建
      this.SelectTemplateType();
      this.SelectRC_ErrorData.num = row.num;
      row = JSON.parse(JSON.stringify(row));
      this.dialogTitle = '编辑表单';
      this.dialogFormVisible = true;
      this.formData.RC_TemplateName = row.RC_TemplateName;
      this.formData.RC_TemplateType = row.RC_TemplateType;
      this.formData.TemplateID = row.TemplateID;
      this.formData.TemplateTypeID = row.TemplateTypeID;
      this.formData.CaseJudgment = row.CaseJudgment || 0;
      this.formData.IsRequired = row.IsRequired || 0;
      this.formData.Cycle = row.Cycle;
      this.formData.RC_TemplateType = row.RC_TemplateType;
      this.formData.Precautions = row.Precautions;
      try {
        const { data } = await SelectTemplateByID({
          TemplateID: row.TemplateID
        });
        this.ContentData = this.dataFiltter2(data.DataList);
        this.ContentData.map(item => {
          item.ErrorContent = [...new Set(item.ErrorContent)].join('<br />');
          item.RC_ErrorID = this.isNull(item.CheckID) ? '' : item.RC_ErrorID;
          item.RC_ErrorIDs = this.isNull(item.CheckID) ? '' : item.RC_ErrorID;
          item.CheckID = this.isNull(item.CheckID) ? 0 : item.CheckID;
          item.Content = this.isNull(item.Content) ? '' : item.Content;
          item.ScoreCriteria = this.isNull(item.ScoreCriteria)
            ? 0
            : item.ScoreCriteria;
          item.Type = this.isNull(item.Type) ? 0 : item.Type;
          item.ProjectContent = item.ProjectContent;
          item.ProjectContentRemark = item.ProjectContentRemark;
          item.Category = item.Category;
        });
        this.ContentDataLoading = false; // 关闭打开内容等待加载条
      } catch (error) {
        this.ContentDataLoading = false; // 关闭打开内容等待加载条
        console.log(error);
      }
    },
    dataFiltter2(arr) {
      const map = {};
      const result = [];
      for (var i = 0; i < arr.length; i++) {
        var item = arr[i];

        result.push({
          Content: item.Content,
          RC_ErrorID: [item.ErrorID],
          ErrorContent: [item.ErrorContent],
          CheckID: item.CheckID,
          ScoreCriteria: item.ScoreCriteria,
          Type: item.Type,
          id: Number(
            Math.random()
              .toString()
              .substr(3, 3) + Date.now()
          ).toString(36),
          ProjectContent: item.ProjectContent,
          ProjectContentRemark: item.ProjectContentRemark,
          Category: item.Category
        });
        map[item.Content] = item;
      }
      return result;
    },
    submitTemplate() {
      if (!this.formData.Cycle && this.formData.IsRequired == 1) {
        this.$message.warning('请填写周期/天');
        return;
      }
      this.formData.Cycle = this.formData.Cycle == '' ? 0 : this.formData.Cycle;
      this.$refs.formData.validate(async v => {
        if (v) {
          let Error = false;
          this.ContentData.map((item, index) => {
            if (item.RC_ErrorID == '') {
              Error = true;
            }
          });
          if (Error && (this.formData.RC_TemplateType === '通用表单' || this.formData.RC_TemplateType === '科室表单')) {
            this.$message.error('请选择扣分原因！');
            return;
          } else {
            const formData = this.formData;
            const ContentData = this.ContentData;
            ContentData.forEach(e => {
              delete e.ErrorContent;
              delete e.id;
            });
            formData.Rc_checkcontent = this.ContentData;
            try {
              const { code, msg } =
                this.dialogTitle === '添加表单'
                  ? await InsertTemplate(formData)
                  : await UpdateTemplate(formData);
              code === 200
                ? this.$message({
                  type: 'success',
                  message: msg
                })
                : this.$message({
                  type: 'error',
                  message: msg
                });
              this.cancel();
              this.SelectTemplate();
            } catch (error) {
            }
          }
        }
      });
    },
    getErrorSelection() {
      this.insetRC_ErrorLoading = true;
      this.ContentData = JSON.parse(JSON.stringify(this.ContentData));
      const data = this.ContentData[this.ContentData.length - 1];
      this.rowContentData.set(data.id, data);
      this.dialogError = false;
    },

    handleSelectionChange(value) {
      this.$nextTick(() => {
        this.ContentData[this.ContentDataIndex].ScoreCriteria = 0;
        this.ContentData[this.ContentDataIndex].ErrorContent = [];
        this.ContentData[this.ContentDataIndex].RC_ErrorID = [];
        value.map(item => {
          this.ContentData[this.ContentDataIndex].ErrorContent.push(
            item.ErrorContent
          );
          this.ContentData[this.ContentDataIndex].RC_ErrorID.push(item.ErrorID);
          this.ContentData[this.ContentDataIndex].ScoreCriteria += parseFloat(
            item.Grade
          );
        });
        this.ContentData[this.ContentDataIndex].ErrorContent = this.ContentData[
          this.ContentDataIndex
          ].ErrorContent.join('<br />');
      });
    },
    handleSelectionChangeRow(selection, row) {
      if (this.SelectRC_ErrorData.num != 0) {
        this.$nextTick(() => {
          this.SelectRC_ErrorData.RC_ErrorIDs.map((item, index) => {
            if (item == row.ErrorID) {
              this.$message.warning(
                '抱歉，修改表单里扣分原因只能增加，不能减少！'
              );
              this.$refs.RC_ErrorMultipleTable.toggleRowSelection(row, true);
              return;
            }
          });
        });
      }
    },
    handleSelectionChangeAll(selection) {
      if (this.SelectRC_ErrorData.num != 0 && selection.length == 0) {
        this.$nextTick(() => {
          this.RC_ErrorData.map((item, index) => {
            this.SelectRC_ErrorData.RC_ErrorIDs.map((item2, index2) => {
              if (item.ErrorID == item2) {
                this.$refs.RC_ErrorMultipleTable.toggleRowSelection(item, true);
              }
            });
          });
        });
      }
    },
    addNormdialog() {
      this.addNormDialog = true;
      this.$nextTick(() => {
        this.$refs.normRef.clearSelection();
      });
    },
    handleSelectionChangeNorm(value) {
      this.$nextTick(() => {
        value.map((item, index) => {
          const result = this.ContentData.findIndex(v => {
            return v.NormID == item.NormID;
          });
          if (result == -1) {
            this.ContentData.push({
              Category: item.Category,
              Content: item.Content,
              ProjectContent: item.ProjectContent,
              ScoreCriteria: item.ScoreCriteria,
              ErrorContent: item.ErrorContent,
              RC_ErrorID: item.ErrorIDs == '' ? [] : item.ErrorIDs.split(','),
              CheckID: 0,
              Type: 0,
              NormID: item.NormID,
              id: Number(
                Math.random()
                  .toString()
                  .substr(3, 3) + Date.now()
              ).toString(36)
            });
          }
        });
      });
    },
    async SelectContent(row, scope) {
      this.SelectRC_ErrorData.RC_ErrorID = [];
      this.SelectRC_ErrorData.RC_ErrorID = row.RC_ErrorID;
      this.SelectRC_ErrorData.RC_ErrorIDs = row.RC_ErrorIDs;
      this.ErrorQuery.ErrorIDs = row.RC_ErrorID.toString();
      this.ContentData_id = row.id;
      this.ContentDataIndex = scope.$index;
      this.dialogError = true;
      this.$nextTick(() => {
        /* 传默认勾选的值给组件 */
        this.$refs.reasonfordeduction.getSelected(
          row.RC_ErrorIDs ? row.RC_ErrorIDs.join(',') : [],
          true
        );
      });
    },
    deleteContent(v) {
      this.ContentData.forEach((e, i) => {
        if (e.id === v) {
          this.ContentData.splice(i, 1);
        }
      });
    },
    cancel() {
      this.ContentData = [
        {
          Content: '',
          ScoreCriteria: 0,
          RC_ErrorID: '',
          RC_ErrorIDs: '',
          CheckID: 0,
          Type: 0,
          id: Number(
            Math.random()
              .toString()
              .substr(3, 3) + Date.now()
          ).toString(36)
        }
      ];
      this.dialogFormVisible = false;
    },
    addContent() {
      let a = '';
      let b = '';
      if (this.ContentData.length) {
        a = this.ContentData[this.ContentData.length - 1].Category;
        b = this.ContentData[this.ContentData.length - 1].ProjectContent;
      }
      this.ContentData.push({
        Category: a,
        Content: '',
        ProjectContent: b,
        ScoreCriteria: 0,
        ErrorContent: '',
        RC_ErrorID: '',
        RC_ErrorIDs: '',
        CheckID: 0,
        Type: 0,
        id: Number(
          Math.random()
            .toString()
            .substr(3, 3) + Date.now()
        ).toString(36)
      });
    },
    addNorm() {
      this.addNormDialog = true;
    },
    async SelectNorm() {
      try {
        const arrs = [];
        this.ContentData.map((item, index) => {
          if (item.NormID != 0) {
            arrs.push(item.NormID);
          }
        });
        this.form.ErrorIDs = arrs.toString();
        const { data } = await SelectNorm(this.form);
        this.tableDataNorm = data.DataList;
        this.form.total = data.Total;
        this.$refs.normRef.clearSelection();
        console.log('oo', this.$refs.normRef);
        this.$nextTick(() => {
          this.ContentData.map((item, index) => {
            this.tableDataNorm.map((item2, index2) => {
              if (item.NormID == item2.NormID) {
                this.$refs.normRef.toggleRowSelection(item2, true);
              }
            });
          });
        });
      } catch (error) {
      }
    },
    addRow() {
      // this.RC_CreatUser = ''; // 只要点击的表单制作按钮就把判断是否是本账号创建的标识去掉
      this.SelectTemplateType();
      this.dialogTitle = '添加表单';
      this.dialogFormVisible = true;
      this.formData.RC_TemplateType = '通用表单';
      this.formData.CaseJudgment = 0;
      this.formData.IsRequired = 0;
    },
    handleCurrentChange(index) {
      this.listLoading = true;
      this.listQuery.pageIndex = index;
      this.SelectTemplate();
    },
    handleSizeChange(page) {
      this.listLoading = true;
      this.listQuery.pageSize = page;
      this.clickSelectTemplate();
    },
    async SelectTemplate() {
      try {
        const { data } = await SelectTemplate(this.listQuery);
        this.tableData = data.DataList;
        this.pagination.total = data.Total;
      } catch {
      } finally {
        this.listLoading = false;
      }
    },
    async clickSelectTemplate() {
      this.listLoading = true;
      this.listQuery.pageIndex = 1;
      this.pagination.pageIndex = 1;
      this.SelectTemplate();
    },
    Delete(row) {
      if (window.userInfo[0].UserName == '系统管理员') {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            DeleteTemplate({ TemplateID: row.TemplateID }).then(res => {
              this.$message.success('删除成功!');
              this.SelectTemplate();
            });
          })
          .catch(() => {
          });
      } else {
        this.$message.error('您不是管理员,没有权限删除');
      }
    },

    async clickInsertDistri(row) {
      console.log(this.$refs.allSelect);
      console.log('this.$refs.allSelect');
      this.permission_routes.map((item, index) => {
        /* 判断是否拥着regulatoryrectification菜单 */
        if (item.path == '/dailymanagement') {
          item.children.map((item2, index2) => {
            if (item2.path == 'regulatoryrectification') {
              this.radioShow = true;
            }
          });
        }
        this.addFormData.RC_InspectionTimeStat = null;
      });
      this.dialogAllot = true;

      this.addFormData.RC_TemplateID = row.TemplateID;
      this.addFormData.RC_TemplateName = row.RC_TemplateName;
      this.addFormData.DistributionName = row.RC_TemplateName;
      try {
        const { data } = await SelectTemplateByID({
          TemplateID: row.TemplateID
        });
        this.TemplateTableData = this.dataFiltter(data.DataList);
      } catch (error) {
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
            FileList_dto: [],
            ErrorIDArray: [],
            RC_DeductedPoints: [item.ErrorContent]
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
              dj.FileList_dto = [];
              dj.ErrorIDArray = [];
              dj.RC_DeductedPoints.push(item.ErrorContent);
              break;
            }
          }
        }
      }
      return result;
    },
    async InsertDistribution() {
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
          RC_Opinion: item.RC_Opinion
        };
      });
      if (!this.addFormData.DistributionUserID) {
        this.$message.warning('请您至少选择一位自查人员');
        return;
      }
      if (!this.addFormData.RC_InspectionDepartment) {
        this.$message.warning('请您选择科室！');
        return;
      }
      if (!this.addFormData.CheckUserID && this.addFormData.IsJump != 1) {
        this.$message.warning('请您选择审核人！');
        return;
      }

      try {
        const { data, code } = await InsertDistribution(this.addFormData);
        if (code === 200) {
          this.$message.success('分配成功');
          this.dialogAllot = false;
        }
      } catch (error) {
      }
    },
    getDefaultDeptValues(v) {
      this.addFormData.RC_InspectionDepartment = v.join();
    },
    focus() {
      this.addFormData.RC_InspectionDepartmentID = 0;
    },
    async getTreeData(val = 0) {
      try {
        const data = await SelectDeptorUser({});
        this.TreeFilterData.treeData = data.data;
      } catch (error) {
      }
    },
    getSelect(val) {
      this.addFormData.DistributionUserID = val;
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
    async SelectZGUser() {
      const { data } = await SelectZGUser(this.optionsVal);
      this.options = [];
      this.options = data.DataList;
      // this.optionsVal.total = data.Total;
    },
    remoteMethod(val) {
      this.optionsVal.UserName = val;
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
    categoryAdmin() {
      this.typeDialog = true;
      this.SelectTemplateType();
    },
    async SelectTemplateType() {
      this.TypeDataLoading = true;
      try {
        const { data } = await SelectTemplateType({
          TemplateTypeName: ''
        });
        this.tableTypeData = data;
      } catch (error) {
      }
      this.TypeDataLoading = false;
    },
    TypeEdit(scope) {
      this.typeEdit = scope.$index;
    },
    DeleteType() {
    },
    insetTypeData() {
      this.tableTypeData.unshift({
        TemplateTypeName: '',
        TemplateTypeID: -1
      });
      // 编辑当前行
      this.typeEdit = 0;
    },
    async finished(scope) {
      try {
        if (scope.row.TemplateTypeID == -1) {
          const { code } = await InsertTemplateType({
            TemplateTypeName: scope.row.TemplateTypeName
          });
          if (code == 200) {
            this.$message.success('成功');
          }
          this.typeEdit = -1;
        } else {
          const { code } = await UpdateTemplateType({
            TemplateTypeName: scope.row.TemplateTypeName,
            TemplateTypeID: scope.row.TemplateTypeID
          });
          if (code == 200) {
            this.$message.success('成功');
          }
          this.typeEdit = -1;
        }
        this.SelectTemplateType();
      } catch (error) {
      }
    },
    changeInput() {
      var pattern = /^[1-9][0-9]*$/; // 正整数的正则表达式
      // 不符合正整数时
      if (!pattern.test(this.formData.Cycle)) {
        // input 框绑定的内容为空
        this.formData.Cycle = '';
      }
    }
  }
};
</script>
<style lang="scss">
// 导出等待条样式
@import "src/styles/loading.scss";

.RecordingTemplate {
  margin: 4px;

  .el-radio,
  .el-radio--mini {
    margin-right: 0px !important;
  }

  .el-card__body {
    padding: 6px;
  }

  .display {
    display: flex;
  }

  .flexBox {
    display: flex;
    justify-content: flex-end;
  }

  .Content {
    width: 100%;
    height: calc(100vh - 380px);
    overflow-y: scroll;

    .Content_item {
      display: flex;
      align-items: center;
    }
  }

  .dialogError-content {
    display: flex;
    justify-content: space-around;
    align-items: center;

    .left {
      width: 100%;
    }

    .right {
      width: 0%;
      height: 540px;
      border: 1px solid gainsboro;
      overflow-y: auto;
    }
  }

  .el-card__header {
    padding: 2px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;

    .el-form-item {
      margin: 0;
      margin-left: 3px;
    }
  }
}
</style>
