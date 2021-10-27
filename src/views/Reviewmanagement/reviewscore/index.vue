<template>
  <div class="ReviewScore">
    <el-card>
      <div
        slot="header"
        class="clearfix"
      >
        <el-form
          :inline="true"
          size="mini"
        >
          <el-form-item>
            <el-radio-group
              v-model="radio1"
              @change="radioGroup"
            >
              <el-radio-button v-if="checkEvaluateStatus === 1" label="评审结果">评审结果（等级制）</el-radio-button>
              <el-radio-button v-else label="评审结果">评审结果（分数制）</el-radio-button>
              <el-radio-button label="科室通过率">科室通过率(条款)</el-radio-button>
              <el-radio-button label="科室上传率">科室上传率</el-radio-button>
              <el-radio-button label="科室材料通过率">科室通过率(材料)</el-radio-button>
              <el-radio-button label="达标统计">达标统计</el-radio-button>
              <!--              <el-radio-button label="指标分数">指标分数</el-radio-button>-->

            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="radio1 === '评审结果'">
            <el-button
              size="mini"
              icon="el-icon-document"
              type="primary"
              @click="dialogVisible = true"
            >列表显示
            </el-button>
            <el-button
              size="mini"
              icon="el-icon-document"
              type="primary"
              @click="dialogVisibleAvg = true"
            >条款平均分统计
            </el-button>
            <el-button
              size="mini"
              icon="el-icon-document"
              type="primary"
              @click="opendialogVisibleScore"
            >三类标准分数统计
            </el-button>
            <el-button
              size="mini"
              icon="el-icon-document"
              type="primary"
              @click="opendialogVisibleScore2"
            >三类标准章节统计
            </el-button>
          </el-form-item>
          <el-form-item v-if="radio1 === '科室上传率'">
            <default-dept
              :value="formInline.DeptID"
              :multiple="true"
              @getDefaultDeptsValue="getDeptsValueUploadrate"
            />
          </el-form-item>
          <!--          <el-form-item v-if="radio1 === '科室上传率'">-->
          <!--            <el-select placeholder="请选择主管部门">-->
          <!--              <el-option value="质量管理科"></el-option>-->
          <!--              <el-option value="党政办"></el-option>-->
          <!--            </el-select>-->
          <!--          </el-form-item>-->
          <el-form-item v-if="radio1 === '科室材料通过率'">
            <default-dept2
              :value="SelectDeptPassRateVal.DeptID"
              :multiple="true"
              @getDefaultDeptsValue="getDeptsValueUploadrate2"
            />
          </el-form-item>
          <el-form-item v-if="radio1 === '科室上传率'">
            <el-button
              :loading="downloadLoading"
              type="success"
              icon="el-icon-download"
              size="mini"
              @click="handleDownload"
            >导出
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <div
        v-if="
          radio1 === '科室上传率'
            ? false
            : radio1 === '科室材料通过率'
              ? false
              : true
        "
        class="content"
      >
        <el-collapse-transition>
          <div
            id="main"
            class="chart"
          />
        </el-collapse-transition>
      </div>
      <!--      科室上传率按钮点击后显示以下列表-->
      <el-collapse-transition>
        <el-table
          v-if="
            radio1 == '科室上传率'
              ? true
              : radio1 == '科室材料通过率'
                ? true
                : false
          "
          v-loading="loading"
          :data="tableData"
          border
          style="width: 100%; padding: 0; margin: 0"
          size="mini"
          height="calc(100vh - 192px)"
        >
          <el-table-column
            prop="DeptName"
            label="科室部门"
            :show-overflow-tooltip="cellOverflow"
            align="center"
          >
            <template slot-scope="{ row }">
              <span
                v-if="radio1 == '科室上传率'"
                style="cursor: pointer !important; color: #3e84e9"
                @click="SelectDeptCatalog(row)"
              >{{ row.DeptName }}</span>
              <span
                v-else
                style="cursor: pointer !important; color: #3e84e9"
                @click="SelectDeptCatalog(row)"
              >{{ row.DeptName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="radio1 == '科室上传率'"
            label="资料条款数"
            align="center"
            width="150"
            :show-overflow-tooltip="cellOverflow"
          >
            <el-table-column
              prop="ShouldCount"
              label="应上传"
              align="center"
              width="100"
              :show-overflow-tooltip="cellOverflow"
            >
              <template slot-scope="{ row }">
                <span>{{ row.ShouldCount }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="AlreadyCount"
              label="已上传"
              width="100"
              align="center"
              :show-overflow-tooltip="cellOverflow"
            >
              <template slot-scope="{ row }">
                <span>{{ row.AlreadyCount }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="上传率"
              align="center"
            >
              <template slot-scope="{ row }">
                <el-progress
                  :text-inside="true"
                  :stroke-width="18"
                  :percentage="row.UploadRate"
                  :status="row.UploadRate > 80 ? 'success' : 'warning'"
                />
              </template>
            </el-table-column>
            Î
          </el-table-column>
          <el-table-column
            v-if="radio1 == '科室材料通过率'"
            prop="ArticleCount"
            label="资料数量"
            width="120"
            align="center"
            :show-overflow-tooltip="cellOverflow"
          >
            <template slot-scope="{ row }">
              <span>{{ row.ArticleCount || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="radio1 === '科室材料通过率'"
            :label="menu_one"
            prop="Step1AuditCount"
            align="center"
            width="200px"
          >
            <el-table-column
              label="审核通过率"
              prop="Step1AuditCount"
              align="center"
            >
              <template slot-scope="{ row }">
                <el-progress
                  :text-inside="true"
                  :stroke-width="18"
                  :percentage="Auditrate(row.Step1Audit, row.Step1AuditCount)"
                  :status="
                    Auditrate(row.Step1Audit, row.Step1AuditCount) > 80
                      ? 'success'
                      : 'warning'
                  "
                />
              </template>
            </el-table-column>
            <el-table-column
              label="资料通过率"
              align="center"
            >
              <template slot-scope="{ row }">
                <el-progress
                  :text-inside="true"
                  :stroke-width="18"
                  :percentage="
                    Auditrate(row.Step1AllAuditCount, row.ArticleCount)
                  "
                  :status="
                    Auditrate(row.Step1AllAuditCount, row.ArticleCount) > 80
                      ? 'success'
                      : 'warning'
                  "
                />
              </template>
            </el-table-column>
            <el-table-column
              label="资料退回率"
              align="center"
            >
              <template slot-scope="{ row }">
                <el-progress
                  :text-inside="true"
                  :stroke-width="18"
                  :percentage="
                    Auditrate(row.Step1AllBackCount, row.ArticleCount)
                  "
                  :status="
                    Auditrate(row.Step1AllBackCount, row.ArticleCount) > 80
                      ? 'exception'
                      : 'warning'
                  "
                />
              </template>
            </el-table-column>
            <el-table-column
              label="资料未审核率"
              align="center"
            >
              <template slot-scope="{ row }">
                <el-progress
                  :text-inside="true"
                  :stroke-width="18"
                  :percentage="
                    notReviewedRate(
                      row.Step1AllAuditCount,
                      row.Step1AllBackCount,
                      row.ArticleCount
                    )
                  "
                  :status="
                    notReviewedRate(
                      row.Step1AllAuditCount,
                      row.Step1AllBackCount,
                      row.ArticleCount
                    ) > 80
                      ? 'warning'
                      : 'success'
                  "
                />
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column
            v-if="radio1 == '科室材料通过率'"
            :label="menu_two"
            prop="Step2AuditCount"
            align="center"
            width="200px"
          >
            <el-table-column
              label="审核通过率"
              prop="Step1AuditCount"
              align="center"
            >
              <template slot-scope="{ row }">
                <el-progress
                  :text-inside="true"
                  :stroke-width="18"
                  :percentage="Auditrate(row.Step2Audit, row.Step2AuditCount)"
                  :status="row.Step2AuditRate > 80 ? 'success' : 'warning'"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="资料通过率"
              align="center"
            >
              <template slot-scope="{ row }">
                <el-progress
                  :text-inside="true"
                  :stroke-width="18"
                  :percentage="
                    Auditrate(row.Step2AllAuditCount, row.ArticleCount)
                  "
                  :status="
                    Auditrate(row.Step2AllAuditCount, row.ArticleCount) > 80
                      ? 'success'
                      : 'warning'
                  "
                />
              </template>
            </el-table-column>
            <el-table-column
              label="资料退回率"
              align="center"
            >
              <template slot-scope="{ row }">
                <el-progress
                  :text-inside="true"
                  :stroke-width="18"
                  :percentage="
                    Auditrate(row.Step2AllBackCount, row.ArticleCount)
                  "
                  :status="
                    Auditrate(row.Step2AllBackCount, row.ArticleCount) > 80
                      ? 'exception'
                      : 'warning'
                  "
                />
              </template>
            </el-table-column>
            <el-table-column
              label="资料未审核率"
              align="center"
            >
              <template slot-scope="{ row }">
                <el-progress
                  :text-inside="true"
                  :stroke-width="18"
                  :percentage="
                    notReviewedRate(
                      row.Step2AllAuditCount,
                      row.Step2AllBackCount,
                      row.ArticleCount
                    )
                  "
                  :status="
                    notReviewedRate(
                      row.Step2AllAuditCount,
                      row.Step2AllBackCount,
                      row.ArticleCount
                    ) > 80
                      ? 'warning'
                      : 'success'
                  "
                />
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column
            v-if="radio1 == '科室材料通过率'"
            :label="menu_three"
            prop="Step3AuditCount"
            align="center"
            width="200px"
          >
            <el-table-column
              label="审核通过率"
              align="center"
            >
              <template slot-scope="{ row }">
                <el-progress
                  :text-inside="true"
                  :stroke-width="18"
                  :percentage="Auditrate(row.Step3Audit, row.Step3AuditCount)"
                  :status="row.Step3AuditRate > 80 ? 'success' : 'warning'"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="资料通过率"
              align="center"
            >
              <template slot-scope="{ row }">
                <el-progress
                  :text-inside="true"
                  :stroke-width="18"
                  :percentage="
                    Auditrate(row.Step3AllAuditCount, row.ArticleCount)
                  "
                  :status="
                    Auditrate(row.Step3AllAuditCount, row.ArticleCount) > 80
                      ? 'success'
                      : 'warning'
                  "
                />
              </template>
            </el-table-column>
            <el-table-column
              label="资料退回率"
              align="center"
            >
              <template slot-scope="{ row }">
                <el-progress
                  :text-inside="true"
                  :stroke-width="18"
                  :percentage="
                    Auditrate(row.Step3AllBackCount, row.ArticleCount)
                  "
                  :status="
                    Auditrate(row.Step3AllBackCount, row.ArticleCount) > 80
                      ? 'exception'
                      : 'warning'
                  "
                />
              </template>
            </el-table-column>
            <el-table-column
              label="资料未审核率"
              align="center"
            >
              <template slot-scope="{ row }">
                <el-progress
                  :text-inside="true"
                  :stroke-width="18"
                  :percentage="
                    notReviewedRate(
                      row.Step3AllAuditCount,
                      row.Step3AllBackCount,
                      row.ArticleCount
                    )
                  "
                  :status="
                    notReviewedRate(
                      row.Step3AllAuditCount,
                      row.Step3AllBackCount,
                      row.ArticleCount
                    ) > 80
                      ? 'warning'
                      : 'success'
                  "
                />
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </el-collapse-transition>
      <el-row>
        <el-col
          v-show="radio1 == '科室上传率' || radio1 == '科室材料通过率'"
          :span="1"
        >
          <el-switch
            v-model="cellOverflow"
            style="margin: 6px 0px"
          />
        </el-col>
        <el-col :span="20">
          <el-pagination
            v-if="radio1 === '科室上传率'"
            :current-page="formInline.pageIndex"
            :page-sizes="[10, 15, 20, 30, 40, 50, 100]"
            :page-size="formInline.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="formInline.Total"
            @size-change="handleSizeChange1"
            @current-change="handleCurrentChange1"
          />
          <el-pagination
            v-if="radio1 === '科室材料通过率'"
            :current-page="SelectDeptPassRateVal.pageIndex"
            :page-sizes="[10, 15, 20, 30, 40, 50, 100]"
            :page-size="SelectDeptPassRateVal.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="SelectDeptPassRateVal.Total"
            @size-change="handleSizeChange2"
            @current-change="handleCurrentChange2"
          />
        </el-col>
      </el-row>
    </el-card>
    <el-dialog
      title="列表显示"
      :visible.sync="dialogVisible"
      :width="device === 'desktop' ? '50%' : '99%'"
    >
      <el-table
        :data="tb1"
        border
        size="mini"
        style="width: 100%"
      >
        <el-table-column
          prop="ScoreName"
          label="项目类别"
          width="150"
        />
        <el-table-column
          label="第一章到第六章基本标准（%）"
          align="center"
        >
          <el-table-column
            prop="GeneralC"
            label="C"
          />
          <el-table-column
            label="B"
            prop="GeneralB"
          />
          <el-table-column
            label="A"
            prop="GeneralA"
          />
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog
      title="条款平均分统计"
      :visible.sync="dialogVisibleAvg"
      :width="device === 'desktop' ? '50%' : '99%'"
    >
      <el-table
        :data="tableData"
        border
        size="mini"
        style="width: 100%"
      >
        <el-table-column
          prop="CatalogCode"
          label="条款编码"
          width="150"
          align="center"
        />
        <el-table-column
          prop="CatalogName"
          label="条款名称"
          align="center"
        />
        <el-table-column
          prop="AvgGrade"
          label="平均分"
          align="center"
        />
      </el-table>
    </el-dialog>

    <el-dialog
      title="三类标准分数统计"
      :visible.sync="dialogVisibleScore"
      :width="device === 'desktop' ? '50%' : '99%'"
    >
      <el-tabs
        v-model="activeName"
        type="card"
      >
        <el-tab-pane
          label="图表"
          name="first"
        >
          <div
            id="scoreChart"
            :style="{ height: '300px', width: '100%' }"
          />
        </el-tab-pane>
        <el-tab-pane
          label="表格"
          name="second"
        >
          <el-table
            :data="ScoreTableData"
            border
            size="mini"
            style="width: 100%"
          >
            <el-table-column
              prop="ParentName"
              label="条款类别"
              width="150"
              align="center"
            />
            <el-table-column
              prop="CatalogName"
              label="条款名称"
              align="center"
            />
            <el-table-column
              prop="TotalGrade"
              label="标准分（总分）"
              width="120"
              align="center"
            />
            <el-table-column
              prop="Grade"
              label="最终分"
              width="100"
              align="center"
            />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <el-dialog
      title="三类标准章节统计"
      :visible.sync="dialogVisibleScore2"
      :width="device === 'desktop' ? '50%' : '99%'"
    >
      <el-select
        v-model="value"
        placeholder="请选择章节"
        size="mini"
        :style="{ width: '100%', margin: '0 0 10px 0' }"
        @change="changeScore"
      >
        <el-option
          v-for="item in options"
          :key="item.CatalogID"
          :label="item.CatalogName"
          :value="item.CatalogID"
        />
      </el-select>
      <el-tabs
        v-model="activeName"
        type="card"
      >
        <el-tab-pane
          label="图表"
          name="first"
        >
          <el-card>
            <div
              id="score2Chart"
              :style="{ height: '300px', width: '100%' }"
            />
          </el-card>
        </el-tab-pane>

        <el-tab-pane
          label="表格"
          name="second"
        >
          <el-table
            :data="Score2TableData"
            border
            size="mini"
            style="width: 100%"
          >
            <el-table-column
              prop="ParentName"
              label="条款类别"
              width="230"
            />
            <el-table-column
              prop="CatalogName"
              label="条款名称"
              align="center"
            />
            <el-table-column
              prop="TotalGrade"
              label="标准分（总分）"
              width="120"
              align="center"
            />
            <el-table-column
              prop="Grade"
              label="最终分"
              width="100"
              align="center"
            />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <el-dialog
      :title="'科室上传详情( ' + dialogVisibArticleTabletitle + ' )'"
      :visible.sync="dialogVisibArticleTable"
      :width="device === 'desktop' ? '50%' : '99%'"
    >
      <el-container class="article_Table">
        <el-header style="margin: 0; padding: 0; height: 35px">
          <el-form
            :inline="true"
            size="mini"
          >
            <el-form-item>
              <el-input
                v-model="SelectDeptCatalogVal.CatalogCode"
                placeholder="请输入评审标准"
                clearable
                @keyup.enter.native="SelectDeptCatalogAuthorizationUser('搜索')"
              />
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="SelectDeptCatalogVal.CatalogName"
                placeholder="请输入评审要点内容"
                clearable
                @keyup.enter.native="SelectDeptCatalogAuthorizationUser('搜索')"
              />
            </el-form-item>
            <el-form-item>
              <el-select
                v-model="SelectDeptCatalogVal.UploadState"
                placeholder="请选择"
                @keyup.enter.native="SelectDeptCatalogAuthorizationUser('搜索')"
                @change="elSelectUploadState2"
              >
                <el-option
                  label="全部"
                  value="全部"
                />
                <el-option
                  label="已上传"
                  value="已上传"
                />
                <el-option
                  label="未上传"
                  value="未上传"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button
                icon="el-icon-search"
                size="mini"
                @click="SelectDeptCatalogAuthorizationUser('搜索')"
              >搜索
              </el-button>
            </el-form-item>
            <el-form-item>
              <el-tooltip class="item" effect="dark" content="要想导出全部请选择更大页条数" placement="right">
                <el-button type="success" @click="exportUploadDetails">导出当前页</el-button>
              </el-tooltip>

            </el-form-item>
          </el-form>
        </el-header>
        <el-main style="margin: 0; padding: 0">
          <el-table
            v-loading="tableloading"
            :data="ArticleTableData"
            border
            style="width: 100%"
            size="mini"
            height="calc(100vh - 300px)"
            row-key="CatalogID"
            :span-method="objectSpanMethod"
          >
            <el-table-column
              width="50"
              align="center"
              label=""
              type="index"
            />
            <el-table-column
              prop="catalogCode"
              label="评审标准"
              align="center"
              width="80"
              :show-overflow-tooltip="cellOverflow"
            />
            <el-table-column
              prop="CatalogName"
              label="标准内容"
              :show-overflow-tooltip="cellOverflow"
            />
            <el-table-column
              prop="pointCode"
              label="评审等级"
              align="center"
              width="80"
            />
            <el-table-column
              prop="pointItem"
              label="评审项目"
              align="center"
              width="70"
            />
            <el-table-column
              prop="IsPoint"
              label="核心条款"
              align="center"
              width="80"
            >
              <template slot-scope="{ row }">
                <el-tag
                  size="mini"
                  :type="row.IsPoint === 0 ? 'danger' : 'success'"
                >
                  {{ row.IsPoint === 0 ? '否' : '是' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="pointName"
              label="评审要点内容"
              :show-overflow-tooltip="cellOverflow"
            />
            <el-table-column
              width="90"
              prop="ArticleCount"
              label="科室资料数"
              align="center"
            >
              <template slot-scope="{ row }">
                <span
                  style="cursor: pointer !important; color: #3e84e9"
                  @click="history(row)"
                >{{ row.ArticleCount }}</span>
              </template>
            </el-table-column>
          </el-table>
          <el-row>
            <el-col :span="3">
              <el-switch
                v-model="cellOverflow"
                style="margin: 6px 0px"
              />
            </el-col>
            <el-col :span="20">
              <el-pagination
                :current-page="SelectDeptCatalogVal.pageIndex"
                :page-sizes="[10, 15, 20, 30, 50, 100,500,1000,5000,10000]"
                :page-size="SelectDeptCatalogVal.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="SelectDeptCatalogVal.total"
                @size-change="handleSizeChangeDeptCatalog"
                @current-change="handleCurrentChangeDeptCatalog"
              />
            </el-col>
          </el-row>
        </el-main>
      </el-container>
    </el-dialog>

    <el-dialog
      :title="'科室审核详情(' + dialogVisibArticleTabletitle2 + ' )'"
      :visible.sync="dialogVisibArticleTable2"
      :width="device === 'desktop' ? '50%' : '99%'"
      fullscreen
    >
      <el-container class="article_Table">
        <el-header style="margin: 0; padding: 0; height: 35px">
          <el-form
            :inline="true"
            size="mini"
          >
            <el-form-item>
              <el-input
                v-model="SelectDeptCatalogVal.CatalogCode"
                placeholder="请输入评审标准"
                clearable
                @keyup.enter.native="
                  SelectDeptRateCatalogAuthorizationUser('搜索')
                "
              />
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="SelectDeptCatalogVal.CatalogName"
                placeholder="请输入评审要点内容"
                clearable
                @keyup.enter.native="
                  SelectDeptRateCatalogAuthorizationUser('搜索')
                "
              />
            </el-form-item>
            <el-form-item>
              <el-select
                v-model="SelectDeptCatalogVal.UploadState"
                placeholder="请选择"
                @change="elSelectUploadState"
              >
                <el-option
                  label="全部"
                  value="全部"
                />
                <el-option
                  label="已上传"
                  value="已上传"
                />
                <el-option
                  label="未上传"
                  value="未上传"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button
                icon="el-icon-search"
                size="mini"
                @click="SelectDeptRateCatalogAuthorizationUser('搜索')"
              >搜索
              </el-button>
            </el-form-item>
          </el-form>
        </el-header>
        <el-main style="margin: 0; padding: 0">
          <el-table
            v-loading="tableloading"
            :data="ArticleTableData"
            border
            style="width: 100%"
            size="mini"
            height="calc(100vh - 195px)"
            row-key="CatalogID"
            :span-method="objectSpanMethod"
          >
            <el-table-column
              width="50"
              align="center"
              label=""
              type="index"
            />
            <el-table-column
              prop="catalogCode"
              label="评审标准"
              align="center"
              width="80"
              :show-overflow-tooltip="cellOverflow"
            />
            <el-table-column
              prop="CatalogName"
              label="标准内容"
              :show-overflow-tooltip="cellOverflow"
            />
            <el-table-column
              prop="pointCode"
              label="评审等级"
              align="center"
              width="80"
            />
            <el-table-column
              prop="pointItem"
              label="评审项目"
              align="center"
              width="70"
            />
            <el-table-column
              width="90"
              prop="ArticleCount"
              label="科室资料数"
              align="center"
            >
              <template slot-scope="{ row }">
                <span
                  style="cursor: pointer !important; color: #3e84e9"
                  @click="history(row)"
                >{{ row.ArticleCount }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="menu_one"
              align="center"
            >
              <el-table-column
                label="通过数量"
                prop="Step1AuditCount"
                align="center"
              />
              <el-table-column
                label="退回数量"
                prop="Step1BackCount"
                align="center"
              />
              <el-table-column
                label="通过率"
                align="center"
              >
                <template slot-scope="{ row }">
                  <el-progress
                    :text-inside="true"
                    :stroke-width="18"
                    :percentage="row.Step1AuditRate || 0"
                    :status="row.Step1AuditRate > 80 ? 'success' : 'warning'"
                  />
                </template>
              </el-table-column>
              <el-table-column
                label="退回率"
                align="center"
              >
                <template slot-scope="{ row }">
                  <el-progress
                    :text-inside="true"
                    :stroke-width="18"
                    :percentage="row.Step1BackRate || 0"
                    :status="row.Step1BackRate > 80 ? 'exception' : 'warning'"
                  />
                </template>
              </el-table-column>
            </el-table-column>

            <el-table-column
              :label="menu_two"
              align="center"
            >
              <el-table-column
                label="通过数量"
                prop="Step2AuditCount"
                align="center"
              />
              <el-table-column
                label="退回数量"
                prop="Step2BackCount"
                align="center"
              />
              <el-table-column
                label="通过率"
                align="center"
              >
                <template slot-scope="{ row }">
                  <el-progress
                    :text-inside="true"
                    :stroke-width="18"
                    :percentage="row.Step2AuditRate || 0"
                    :status="row.Step2AuditRate > 80 ? 'success' : 'warning'"
                  />
                </template>
              </el-table-column>
              <el-table-column
                label="退回率"
                align="center"
              >
                <template slot-scope="{ row }">
                  <el-progress
                    :text-inside="true"
                    :stroke-width="18"
                    :percentage="row.Step2BackRate || 0"
                    :status="row.Step2BackRate > 80 ? 'exception' : 'warning'"
                  />
                </template>
              </el-table-column>
            </el-table-column>

            <el-table-column
              :label="menu_three"
              align="center"
            >
              <el-table-column
                label="通过数量"
                prop="Step3AuditCount"
                align="center"
              />
              <el-table-column
                label="退回数量"
                prop="Step3BackCount"
                align="center"
              />
              <el-table-column
                label="通过率"
                align="center"
              >
                <template slot-scope="{ row }">
                  <el-progress
                    :text-inside="true"
                    :stroke-width="18"
                    :percentage="row.Step3AuditRate || 0"
                    :status="row.Step3AuditRate > 80 ? 'success' : 'warning'"
                  />
                </template>
              </el-table-column>
              <el-table-column
                label="退回率"
                align="center"
              >
                <template slot-scope="{ row }">
                  <el-progress
                    :text-inside="true"
                    :stroke-width="18"
                    :percentage="row.Step3BackRate || 0"
                    :status="row.Step3BackRate > 80 ? 'exception' : 'warning'"
                  />
                </template>
              </el-table-column>
            </el-table-column>
          </el-table>
          <el-row>
            <el-col :span="3">
              <el-switch
                v-model="cellOverflow"
                style="margin: 6px 0px"
              />
            </el-col>
            <el-col :span="20">
              <el-pagination
                :current-page="SelectDeptCatalogVal.pageIndex"
                :page-sizes="[10, 15, 20, 30, 50, 100]"
                :page-size="SelectDeptCatalogVal.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="SelectDeptCatalogVal.total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </el-col>
          </el-row>
        </el-main>
      </el-container>
    </el-dialog>

    <el-dialog
      title="资料数量"
      :width="device === 'desktop' ? '20%' : '100%'"
      :close-on-click-modal="false"
      :visible.sync="dialogDetails"
    >
      <el-form
        ref="form"
        label-position="left"
        class="fromDetails"
        label-width="120px"
      >
        <el-form-item label="标准">
          <el-input
            v-model="historyData.catalogCode"
            size="mini"
          />
        </el-form-item>
        <el-form-item label="未审核资料数量:">
          <el-input
            v-model="historyData.UnReviewCount"
            size="mini"
          />
        </el-form-item>
        <el-form-item label="已审核资料数量:">
          <el-input
            v-model="historyData.ReviewCount"
            size="mini"
          />
        </el-form-item>
        <el-form-item label="已退回资料数量:">
          <el-input
            v-model="historyData.BackCount"
            size="mini"
          />
        </el-form-item>
        <el-form-item label="资料总数量:">
          <el-input
            v-model="historyData.ArticleCount"
            size="mini"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          size="mini"
          @click="dialogDetails = false"
        >关闭
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import echarts from 'echarts';
import resize from './mixins/resize';
import defaultDept from '@/views/components/defaultDept';
import defaultDept2 from '@/views/components/defaultDept';
import { mapGetters } from 'vuex';

import {
  GetStandardRate,
  SelectCatalogCode,
  SelectCatalogScore,
  SelectCatalogScore2,
  SelectDeptCatalogAuthorizationUser,
  SelectDeptRateCatalogAuthorizationUser,
  SelectDeptUploadRate,
  SelectGradeAvg,
  SelectScore,
  SelectScore2
} from '@/api/score';
import { DeptPassRate, SelectDeptPassRate } from '@/api/reviewstatic';
import { GetCatalogCfgInfo } from '@/api/SMS';

require('echarts/theme/macarons'); // echarts theme
export default {
  name: 'ReviewScore',
  components: { defaultDept, defaultDept2 },
  mixins: [resize],
  data() {
    return {
      checkEvaluateStatus: 1, // 考评配置状态，1为等级制，2为分数制
      chart: null,
      scoreChart: null,
      score2Chart: null,
      activeName: 'first',
      value: null,
      data: [],
      tb1: [],
      tableData: [],
      tableData2: [],
      tableData3: [], // 科室上传导出
      ScoreTableData: [],
      Score2TableData: [],
      options: [],
      dialogVisible: false,
      dialogVisibleAvg: false,
      dialogVisibleScore: false,
      dialogVisibleScore2: false,
      category: [],
      bar: [],
      radio1: '评审结果',
      DeptID: window.userInfo[0].DeptID,
      loading: false,
      cellOverflow: false,
      formInline: {
        DeptID: '',
        pageIndex: 1,
        pageSize: 20,
        Total: 0
      },
      dialogVisibArticleTable: false,
      dialogVisibArticleTabletitle: '',
      dialogVisibArticleTable2: false,
      dialogVisibArticleTabletitle2: '',
      SelectDeptCatalogVal: {
        pageIndex: 1,
        pageSize: 15,
        total: 0,
        DeptID: 0,
        CatalogCode: '',
        CatalogName: '',
        UploadState: ''
      },
      ArticleTableData: [],
      tableloading: false,
      dialogDetails: false,
      historyData: {},
      spanOneArr: [],
      spanTwoArr: [],
      downloadLoading: false,
      SelectDeptPassRateVal: {
        DeptID: '',
        pageIndex: 1,
        pageSize: 20,
        Total: 0
      },
      menu_one: '',
      menu_two: '',
      menu_three: ''
    };
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;

    if (!this.scoreChart) {
      return;
    }
    this.scoreChart.dispose();
    this.scoreChart = null;

    if (!this.score2Chart) {
      return;
    }
    this.score2Chart.dispose();
    this.score2Chart = null;
  },
  created() {
    this.chaKan();
  },
  mounted() {
    this.SelectGradeAvg();
    this.SelectCatalogScore();
    // this.SelectCatalogScore2();
    this.SelectCatalogCode();
    this.$nextTick(() => {
      this.initChart();
    });
  },
  computed: {
    ...mapGetters(['device'])
  },
  methods: {
    // 获取评审考评类型，等级还是分数制
    async chaKan() {
      const { data } = await GetCatalogCfgInfo({});
      this.checkEvaluateStatus = data[0].CurrentStatus;
    },
    async changeScore(v) {
      try {
        const { data } = await SelectCatalogScore2({ CatalogID: v });
        this.Score2TableData = data;
        this.initScore2Chart(this.Score2TableData);
      } catch (error) {
      }
    },
    async SelectCatalogCode() {
      try {
        const { data } = await SelectCatalogCode();
        this.options = data;
        console.log('this.options',this.options);
      } catch (error) {
      }
    },
    opendialogVisibleScore() {
      this.activeName = 'first';
      this.dialogVisibleScore = true;
      // console.log('打开了吗',this.ScoreTableData);
      this.$nextTick(() => {
        this.initScoreChart(this.ScoreTableData);
      });
    },
    opendialogVisibleScore2() {
      this.activeName = 'first';
      this.dialogVisibleScore2 = true;
      this.$nextTick(() => {
        this.initScore2Chart(this.Score2TableData);
      });
    },
    // async SelectCatalogScore2() {
    //   try {
    //     const { data } = await SelectCatalogScore2({CatalogID: 0});
    //     this.Score2TableData = data;
    //   } catch (error) {
    //   }
    // },
    async SelectCatalogScore() {
      try {
        const { data } = await SelectCatalogScore();
        this.ScoreTableData = data;
        console.log('这里有数据吗this.ScoreTableData',this.ScoreTableData);
      } catch (error) {
      }
    },
    async SelectGradeAvg() {
      try {
        const { data } = await SelectGradeAvg();
        this.tableData = data;
      } catch (error) {
      }
    },
    initScore2Chart(data = []) {
      this.score2Chart = echarts.init(
        document.querySelector('#score2Chart'),
        'light'
      );
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: function({ data: a }) {
            return `${a.CatalogName}的总分是(${a.TotalGrade}分),当前分是(${a.Grade}分)`;
          }
        },
        dataset: {
          dimensions: ['CatalogName', 'TotalGrade', 'Grade'],
          source: data.map(item => {
            return {
              CatalogName: item.CatalogName.substring(0, 3),
              TotalGrade: item.TotalGrade,
              Grade: item.Grade
            };
          })
        },
        xAxis: {
          type: 'category',
          name: '章节'
        },
        yAxis: {
          type: 'value',
          name: '分值'
        },
        series: [
          {
            type: 'bar'
          },
          {
            type: 'bar'
          }
        ],
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            restore: { show: true }, // 重置按钮
            saveAsImage: { show: true } // 下载
          }
        }
      };
      this.score2Chart.setOption(option);
    },
    initScoreChart(data = []) {
      this.scoreChart = echarts.init(
        document.querySelector('#scoreChart'),
        'dark'
      );
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: function({ data: a }) {
            return `${a.CatalogName}的总分是(${a.TotalGrade}分),当前分是(${a.Grade}分)`;
          }
        },
        dataset: {
          dimensions: ['CatalogName', 'TotalGrade', 'Grade'],
          source: data.map(item => {
            return {
              CatalogName: item.CatalogName.substring(0, 4),
              TotalGrade: item.TotalGrade,
              Grade: item.Grade
            };
          })
        },
        xAxis: {
          type: 'category',
          name: '条款类别'
        },
        yAxis: {
          type: 'value',
          name: '分值'
        },
        series: [
          {
            type: 'bar'
          },
          {
            type: 'bar'
          }
        ],
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            restore: { show: true }, // 重置按钮
            saveAsImage: { show: true } // 下载
          }
        }
      };
      this.scoreChart.setOption(option);
    },
    async initChart() {
      try {
        // 如果是等级制获取等级制的数据
        if (this.checkEvaluateStatus === 1) {
          const { data } = await SelectScore();
          this.data = data;
        } else { // 如果是分数制获取分数制的数据
          const { data } = await SelectScore2();
          this.data = data;
        }
        this.data.map(item => {
          item.GeneralA *= 100;
          item.GeneralB *= 100;
          item.GeneralC *= 100;
          item.KernelA *= 100;
          item.KernelB *= 100;
          item.KernelC *= 100;
        });
        this.tb1 = this.data;
        this.data.forEach(item => {
          this.tb1.push({
            ScoreName: '核心' + item.ScoreName,
            GeneralA: item.KernelA,
            GeneralB: item.KernelB,
            GeneralC: item.KernelC
          });
        });

        let x = '';
        this.chart = echarts.init(document.querySelector('#main'));
        const switchData = function(key) {
          switch (key) {
            case 'GeneralA':
              x = '等级A';
              break;
            case 'GeneralB':
              x = '等级B';
              break;
            case 'GeneralC':
              x = '等级C';
              break;
            case 'KernelA':
              x = '核心条款A';
              break;
            case 'KernelB':
              x = '核心条款B';
              break;
            case 'KernelC':
              x = '核心条款C';
              break;
          }
        };
        const options = {
          legend: {
            formatter: function(name) {
              switchData(name);
              return x;
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: function(a) {
              switchData(a.seriesName);
              return `${a.name}  (${x})  ${a.value[a.seriesName]}%`;
            }
          },
          dataset: {
            dimensions: ['ScoreName', 'GeneralC', 'GeneralB', 'GeneralA'],
            source: this.data
          },
          xAxis: { type: 'category', name: '\u7b49\u7ea7' },
          yAxis: {
            type: 'value',
            min: 0,
            max: 100,
            name: '\u8fbe\u5230\u7b49\u7ea7\u6240\u5360\u767e\u5206\u6bd4'
          },
          series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }],
          toolbox: {
            show: true,
            feature: {
              mark: { show: true },
              // dataView: { show: true, readOnly: false },
              restore: { show: true }, // 重置按钮
              saveAsImage: { show: true } // 下载
            }
          }
        };
        this.chart.off('click');
        this.chart.setOption(options);
        this.chart.on('click', params => {
          const seriesName = { GeneralA: 'A', GeneralB: 'B', GeneralC: 'C' };
          params.name === '当前'
            ? this.$router.push({
              name: 'EvaluationThree',
              params: { Grade: seriesName[params.seriesName] }
            })
            : false;
        });
      } catch (error) {
      }
    },
    async GetStandardRate() {
      const { data } = await GetStandardRate();
      this.chart = echarts.init(document.querySelector('#main'));
      const para = this.$store.getters.iniPara;
      const options = {
        legend: {},
        tooltip: {},
        dataset: {
          source: [
            ['product', '达标率', '未达标率', '未审核率'],
            [
              para.menu_one,
              data[0].StandardRate,
              data[0].UnCheckedRate,
              data[0].UnStandardRate
            ],
            [
              para.menu_two,
              data[1].StandardRate,
              data[1].UnCheckedRate,
              data[1].UnStandardRate
            ],
            [
              para.menu_three,
              data[2].StandardRate,
              data[2].UnCheckedRate,
              data[2].UnStandardRate
            ]
          ]
        },
        xAxis: [
          {
            type: 'category'
          }
        ],
        yAxis: { name: '百分比%' },
        series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }]
      };
      this.chart.setOption(options, true);
    },
    getDefaultDeptValues(val) {
      this.DeptID = val;
      this.DeptPassRate();
    },
    async radioGroup(val) {
      if (val === '科室通过率') {
        this.DeptPassRate();
      } else if (val === '评审结果') {
        this.initChart();
      } else if (val === '科室材料通过率') {
        this.formInline.pageIndex = 1;
        this.SelectDeptPassRate();
      } else if (val === '达标统计') {
        this.GetStandardRate();
      } else if (val === '指标分数') {
        this.GetStandardRate();
      } else {
        this.SelectDeptPassRateVal.pageIndex = 1;
        this.SelectDeptUploadRate();
      }
      this.formInline.DeptID = '';
      this.SelectDeptPassRateVal.DeptID = window.userInfo[0].DeptID;
    },
    async DeptPassRate() {
      this.chart = echarts.init(document.querySelector('#main'));
      const { data } = await DeptPassRate({ DeptID: this.DeptID });
      const para = this.$store.getters.iniPara;
      const options = {
        legend: {},
        tooltip: {},
        dataset: {
          source: [
            ['product', '退回率', '未审核率', '通过率'],
            [
              para.menu_one,
              data[0].BackRate,
              data[0].Unchecked,
              data[0].PassRate
            ],
            [
              para.menu_two,
              data[1].BackRate,
              data[1].Unchecked,
              data[1].PassRate
            ],
            [
              para.menu_three,
              data[2].BackRate,
              data[2].Unchecked,
              data[2].PassRate
            ]
          ]
        },
        xAxis: [
          {
            type: 'category'
          }
        ],
        yAxis: { name: '百分比%' },
        series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }]
      };
      this.chart.setOption(options, true);
    },
    getDeptsValueUploadrate(val) {
      this.formInline.pageIndex = 1;
      this.formInline.DeptID = val.toString();
      this.SelectDeptUploadRate();
    },
    getDeptsValueUploadrate2(val) {
      this.SelectDeptPassRateVal.pageIndex = 1;
      this.SelectDeptPassRateVal.DeptID = val.toString();
      this.SelectDeptPassRate();
    },
    async SelectDeptUploadRate() {
      try {
        this.loading = true;
        const { data } = await SelectDeptUploadRate(this.formInline);
        this.tableData = data.DataList;
        this.formInline.Total = data.Total;
      } catch (error) {
      }
      this.loading = false;
    },
    handleSizeChange(val) {
      this.SelectDeptCatalogVal.pageSize = val;
      this.SelectDeptRateCatalogAuthorizationUser();
    },
    handleCurrentChange(val) {
      this.SelectDeptCatalogVal.pageIndex = val;
      this.SelectDeptRateCatalogAuthorizationUser();
    },
    handleSizeChange2(val) {
      this.SelectDeptPassRateVal.pageSize = val;
      this.SelectDeptPassRate();
    },
    handleCurrentChange2(val) {
      this.SelectDeptPassRateVal.pageIndex = val;
      this.SelectDeptPassRate();
    },
    SelectDeptCatalog(row) {
      if (this.radio1 == '科室上传率') {
        this.dialogVisibArticleTable = true;
        this.dialogVisibArticleTabletitle = row.DeptName;
        this.SelectDeptCatalogVal.DeptID = row.DeptID;
        this.SelectDeptCatalogVal.pageIndex = 1;
        this.SelectDeptCatalogAuthorizationUser();
      } else if (this.radio1 == '科室材料通过率') {
        this.dialogVisibArticleTable2 = true;
        this.dialogVisibArticleTabletitle2 = row.DeptName;
        this.SelectDeptCatalogVal.DeptID = row.DeptID;
        this.SelectDeptCatalogVal.pageIndex = 1;
        this.SelectDeptRateCatalogAuthorizationUser();
      }
    },
    history(row) {
      this.dialogDetails = true;
      this.historyData = row;
    },
    async SelectDeptRateCatalogAuthorizationUser(value) {
      try {
        this.tableloading = true;
        this.SelectDeptCatalogVal.pageIndex =
          value == '搜索' ? 1 : this.SelectDeptCatalogVal.pageIndex;
        const { data } = await SelectDeptRateCatalogAuthorizationUser(
          this.SelectDeptCatalogVal
        );
        this.ArticleTableData = data.DataList;
        // console.log('现在的数据是'+this.ArticleTableData);
        this.SelectDeptCatalogVal.total = data.Total;
        this.getJBXXTableData();
      } catch (error) {
        console.log(error);
      }
      this.tableloading = false;
    },
    elSelectUploadState() {
      this.SelectDeptCatalogVal.pageIndex = 1;
      this.SelectDeptRateCatalogAuthorizationUser();
    },
    elSelectUploadState2() {
      this.SelectDeptCatalogVal.pageIndex = 1;
      this.SelectDeptCatalogAuthorizationUser();
    },
    async SelectDeptCatalogAuthorizationUser(value) {
      try {
        this.SelectDeptCatalogVal.pageIndex =
          value == '搜索' ? 1 : this.SelectDeptCatalogVal.pageIndex;
        this.tableloading = true;
        const { data } = await SelectDeptCatalogAuthorizationUser(
          this.SelectDeptCatalogVal
        );
        this.ArticleTableData = data.DataList;
        this.getJBXXTableData();
        this.SelectDeptCatalogVal.total = data.Total;
      } catch (error) {
        console.log(error);
      }
      this.tableloading = false;
    },
    handleSizeChangeDeptCatalog(val) {
      this.SelectDeptCatalogVal.pageSize = val;
      this.SelectDeptCatalogAuthorizationUser();
    },
    handleCurrentChangeDeptCatalog(val) {
      this.SelectDeptCatalogVal.pageIndex = val;
      this.SelectDeptCatalogAuthorizationUser();
    },
    getJBXXTableData() {
      this.spanOneArr = [];
      this.spanTwoArr = [];
      let concatOne = 0;
      let concatTwo = 0;
      this.ArticleTableData.map((item, index) => {
        if (index === 0) {
          this.spanOneArr.push(1);
          this.spanTwoArr.push(1);
        } else {
          if (
            item.catalogCode === this.ArticleTableData[index - 1].catalogCode
          ) {
            // 第一列需合并相同内容的判断条件
            this.spanOneArr[concatOne] += 1;
            this.spanOneArr.push(0);
          } else {
            this.spanOneArr.push(1);
            concatOne = index;
          }
          if (
            item.pointCode === this.ArticleTableData[index - 1].pointCode &&
            item.catalogCode === this.ArticleTableData[index - 1].catalogCode
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
      if (columnIndex === 1 || columnIndex === 2) {
        const _row = this.spanOneArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return [_row, _col];
      } else if (columnIndex === 3) {
        const _row = this.spanTwoArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return [_row, _col];
      }
    },
    handleSizeChange1(val) {
      this.formInline.pageSize = val;
      this.SelectDeptUploadRate();
    },
    handleCurrentChange1(val) {
      this.formInline.pageIndex = val;
      this.SelectDeptUploadRate();
    },
    async SelectDeptPassRate() {
      try {
        this.loading = true;
        const { data } = await SelectDeptPassRate(this.SelectDeptPassRateVal);
        const para = this.$store.getters.iniPara;
        this.menu_one = para.menu_one;
        this.menu_two = para.menu_two;
        this.menu_three = para.menu_three;
        this.SelectDeptPassRateVal.Total = data.Total;
        this.tableData = data.DataList;
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
    async handleDownload() {
      try {
        this.downloadLoading = true;
        const excel = await import('@/vendor/Export2Excel');
        const tHeader = [
          '科室部门',
          '上传率(%)',
          '应上传资料条款数',
          '已上传资料条款数'
        ];
        const filterVal = [
          'DeptName',
          'UploadRate',
          'ShouldCount',
          'AlreadyCount'
        ];
        const formData = this.formatJson(filterVal, this.tableData); /* this.ArticleTableData*/
        excel.export_json_to_excel({
          header: tHeader,
          data: formData,
          filename: '文件名'
        });
      } catch (error) {
        console.log(error);
      }
      this.downloadLoading = false;
    },
    async exportUploadDetails() {
      try {
        this.downloadLoading = true;
        const excel = await import('@/vendor/Export2Excel');
        const tHeader = [
          '评审标准',
          '评审内容',
          '评审等级',
          '评审项目',
          '核心条款',
          '评审要点内容',
          '科室资料数'
        ];
        // 标识
        const filterVal = [
          'catalogCode',
          'CatalogName',
          'pointCode',
          'pointItem',
          'IsPoint',
          'pointName',
          'ArticleCount'
        ];
        const formData = this.formatJson(filterVal, this.ArticleTableData);
        excel.export_json_to_excel({
          header: tHeader,
          data: formData,
          filename: '文件名'
        });
      } catch (error) {
        console.log(error);
      }
      this.downloadLoading = false;
      this.$message.success('已开始下载');
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    /* 审核通过率 */
    Auditrate(num, sum) {
      let rate = (num / sum) * 100;
      rate = Math.round(rate * 100) / 100;
      return rate || 0;
    },
    /* 资料未审核率计算 */
    notReviewedRate(AllAuditCount, AllBackCount, Count) {
      let rate = ((Count - AllAuditCount - AllBackCount) / Count) * 100;
      rate = Math.round(rate * 100) / 100;
      return rate || 0;
    }
  }
};
</script>
<style lang="scss">
.ReviewScore {
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
  /*   .el-loading-spinner {
    background-image: url('~@/assets/loading.gif'); //加载动图
    background-repeat: no-repeat; //设置背景图不重复
    height: 100%; //图片高度
    background-position: center; //设置背景定位为居中
    top: 0; //覆盖element-ui默认的50%，因为此处设置了height:100%,所以不设置的话，会只显示一半，因为被top顶下去了
  } */
  .el-loading-spinner .circular {
    display: none; //隐藏之前element-ui默认的loading动画
  }

  height: calc(100vh - 100px) !important;

  .el-card__body {
    margin: 0;
    padding: 0;

    .content {
      .chart {
        height: calc(100vh - 200px);
        width: 100%;
      }
    }
  }

  .el-card__header {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;

    .el-form-item {
      margin: 5px 0;
      margin-left: 10px;
    }
  }
}
</style>
