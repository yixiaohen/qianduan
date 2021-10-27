<template>
  <div class="EvaluationTwo">
    <el-card class="box-card">
      <div
        slot="header"
        :style="{ height: clearfixHeight + 'px' }"
        class="clearfix"
      >
        <el-form
          :inline="true"
          :model="EvaluationForm"
          size="mini"
        >
          <el-form-item>
            <el-button
              :class="
                clearfixHeight == 30
                  ? 'el-icon-arrow-right'
                  : 'el-icon-arrow-down'
              "
              @click="unfold"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="EvaluationForm.CatalogCode"
              placeholder="评审标准"
              style="width: 120px"
              size="mini"
              clearable
              @keyup.enter.native="clickSelectEvaluation()"
            />
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="EvaluationForm.CurrentStatus"
              size="mini"
              :placeholder="menu_two+'评审状态'"
              clearable
              @change="elSelectStatus"
            >
              <el-option
                :label="'全部('+menu_two+')'"
                value=""
              />
              <el-option
                :label="'未审核'+'('+menu_two+')'"
                value="0"
              />
              <el-option
                :label="'通过'+menu_two+')'"
                value="1"
              />
              <el-option
                :label="'退回'+menu_two+')'"
                value="2"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <cascaderFilter @getDeptorUser="getDeptorUser" />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="EvaluationForm.CurrentGrade"
              placeholder="当前层级评审结果"
              style="width: 150px"
              size="mini"
              clearable
              @keyup.enter.native="clickSelectEvaluation()"
            />
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="EvaluationForm.UploadStatus"
              clearable
              size="mini"
              style="width: 140px"
              placeholder="资料状态"
              @clear="EvaluationForm.UploadStatus = 0"
              @keyup.enter.native="clickSelectEvaluation()"
              @change="elSelectUploadStatus"
            >
              <el-option
                v-for="item in DataStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="status"
              size="mini"
              clearable
              style="width: 140px"
              placeholder="评审状态"
              @clear="status = '0,0'"
              @keyup.enter.native="clickSelectEvaluation()"
              @change="elSelectStatus"
            >
              <el-option
                v-for="item in ReviewStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <period @getPeriodValue="getPeriodValue" />
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="EvaluationForm.Progress"
              size="mini"
              clearable
              style="width: 120px"
              placeholder="进度"
              @keyup.enter.native="clickSelectEvaluation()"
            >
              <el-option
                v-for="item in schedule"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="EvaluationForm.StepValue"
              clearable
              size="mini"
              style="width: 140px"
              placeholder="选择层级"
              @keyup.enter.native="clickSelectEvaluation()"
            >
              <el-option
                :label="selectData.menu_one"
                :value="1"
              />
              <el-option
                :label="selectData.menu_two"
                :value="2"
              />
              <el-option
                :label="selectData.menu_three"
                :value="3"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="EvaluationForm.Grade"
              placeholder="最终评审结果"
              style="width: 120px"
              size="mini"
              clearable
              @keyup.enter.native="clickSelectEvaluation()"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              :loading="listLoading"
              size="mini"
              @click="clickSelectEvaluation"
            >搜索
            </el-button>
            <!-- <el-button type="info" icon="el-icon-search" size="mini" @click="dialogTableVisible = true">个人工作进度</el-button>-->
            <!-- <el-button type="info" icon="el-icon-search" size="mini" @click="dow">导出评审条款</el-button> -->
          </el-form-item>
          <el-form-item style="width: 150px">
            <el-select
              v-model="downloadValue"
              placeholder="请选择要导出数据"
            >
              <el-option
                label="前一百条"
                value="100"
              />
              <el-option
                label="前三百条"
                value="300"
              />
              <el-option
                label="前五百条"
                value="500"
              />
              <el-option
                label="前一千条"
                value="1000"
              />
              <el-option
                label="全部"
                :value="pagination.total"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              :loading="listLoading"
              :disabled="downloadLoading"
              type="success"
              icon="el-icon-document"
              size="mini"
              @click="handleDownload"
            >导出
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-checkbox
              v-model="EvaluationForm.UnReview"
              @change="UnReviewChange"
            >未审资料
            </el-checkbox>
          </el-form-item>
        </el-form>
      </div>
      <div class="content">
        <el-table
          ref="elTable"
          v-loading="listLoading"
          :data="tableData"
          style="width: 100%"
          border
          highlight-current-row
          size="mini"
          :row-class-name="tableRowClassName"
          height="calc(100vh - 210px)"
          stripe
        >
          <el-table-column
            type="expand"
            label="详情"
          >
            <template slot-scope="{ row }">
              <el-form
                label-position="left"
                class="demo-table-expand"
              >
                <el-form-item label="评审状态">
                  <span>{{ row.isAudit }}</span>
                </el-form-item>
                <el-form-item label="评审结果">
                  <!--                   <p v-if="gradeType">
                    {{
                      row.Matter_Solution[row.Matter_Solution.length - 1] &&
                      row.Matter_Solution[row.Matter_Solution.length - 1].Grade
                    }}
                  </p> -->
                  <p
                    v-for="(item, index) in row.Matter_Solution"
                    :key="index"
                  >
                    {{ item.Grade }}
                  </p>
                </el-form-item>
                <el-form-item label="存在问题">
                  <span>
                    <p
                      v-for="(item, index) in row.Matter_Solution"
                      :key="index"
                    >
                      {{ item.Matter }}
                    </p>
                  </span>
                </el-form-item>
                <el-form-item label="改进措施">
                  <span>
                    <p
                      v-for="(item, index) in row.Matter_Solution"
                      :key="index"
                    >
                      {{ item.Solution }}
                    </p>
                  </span>
                </el-form-item>
                <el-form-item label="最终结果">
                  <span>{{ row.Grade }}</span>
                </el-form-item>
                <el-form-item label="评审人">
                  <span>{{ row.CreateUserName }}</span>
                </el-form-item>
                <el-form-item label="评审日期">
                  <span>{{ row.CreateDate }}</span>
                </el-form-item>
                <el-form-item label="整改时间">
                  <span>{{ row.RectifyEndTime.replace('T', ' ') }}</span>
                </el-form-item>
                <!--<el-form-item label="是否达标">
                  <span>{{ row.Standard === 0 ? "否" : "是" }}</span>
                </el-form-item>-->
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            prop="CatalogCode"
            label="标准"
            width="69"
          >
            <template slot-scope="{ row }">
              <span
                class="CatalogName"
                @click="history(row)"
              >{{
                row.CatalogCode
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="TypeName"
            label="章节"
            align="center"
            width="120"
            :show-overflow-tooltip="cellOverflow"
          />
          <!--        宁海妇幼保健院不显示核心条款-->
          <el-table-column
            v-if="CatalogVersion !== '宁海妇幼保健院'"
            prop="IsPoint"
            label="核心条款"
            align="center"
            width="69"
          >
            <template slot-scope="{ row }">
              <el-tag
                size="mini"
                :type="row.IsPoint === 0 ? 'danger' : 'success'"
              >{{ row.IsPoint === 0 ? '否' : '是' }}
              </el-tag>
            </template>
          </el-table-column>
          <!-- <el-table-column label="执行人员自评" align="center">
            <el-table-column
              v-if="gradeType"
              label="评审结果"
              width="150"
              prop="Grade"
            >
              <template slot-scope="{ row }">
                {{ row.StepGrade }}
              </template>
            </el-table-column>
            <el-table-column v-else label="评审结果" width="150" prop="Grade">
              <template slot-scope="scope">
                <p
                  v-for="(item, index) in scope.row.Review_Matter_Solution"
                  :key="index"
                >
                  {{ item.Grade }}
                </p>
              </template>
            </el-table-column>
            <el-table-column label="存在问题" width="150">
              <template slot-scope="scope">
                <p
                  v-for="(item, index) in scope.row.Review_Matter_Solution"
                  :key="index"
                >
                  {{ item.StepMatter }}
                </p>
              </template>
            </el-table-column>
            <el-table-column label="改进措施" width="150">
              <template slot-scope="scope">
                <p
                  v-for="(item, index) in scope.row.Review_Matter_Solution"
                  :key="index"
                >
                  {{ item.StepSolution }}
                </p>
              </template>
            </el-table-column>
          </el-table-column> -->

          <el-table-column
            label="评审状态"
            prop="isAudit"
            width="100"
            align="center"
          />
          <!--        宁海妇幼保健院不显示当前级评审状态-->
          <el-table-column
            v-if="CatalogVersion !== '宁海妇幼保健院'"
            label="当前级评审状态"
            prop="CurrentAudit"
            width="110"
            align="center"
          />
          <el-table-column
            :label="para.menu_two+'评审结果'"
            width="145"
            prop="Grade"
            align="center"
          >
            <template slot-scope="scope">
              <p v-if="gradeType">
                {{
                  scope.row.Matter_Solution[
                    scope.row.Matter_Solution.length - 1
                  ] &&
                    scope.row.Matter_Solution[
                      scope.row.Matter_Solution.length - 1
                    ].Grade
                }}
              </p>
              <p
                v-for="(item, index) in scope.row.Matter_Solution"
                v-else
                :key="index"
              >
                {{ item.Grade }}
              </p>
            </template>
          </el-table-column>
          <!--        宁海妇幼保健院不显示当前自评人员评审结果-->
          <el-table-column
            v-if="CatalogVersion !== '宁海妇幼保健院'"
            :label="para.menu_one+'评审结果'"
            width="145"
            prop="Step1Grade"
            align="center"
          />
          <el-table-column
            :label="para.menu_three+'评审结果'"
            width="145"
            prop="Step3Grade"
            align="center"
          />
          <el-table-column
            label="存在问题"
            width="150"
            :show-overflow-tooltip="cellOverflow"
          >
            <template slot-scope="scope">
              <p
                v-for="(item, index) in scope.row.Matter_Solution"
                :key="index"
              >
                {{ item.Matter }}
              </p>
            </template>
          </el-table-column>
          <el-table-column
            label="改进措施"
            width="150"
            :show-overflow-tooltip="cellOverflow"
          >
            <template slot-scope="scope">
              <p
                v-for="(item, index) in scope.row.Matter_Solution"
                :key="index"
                style="margin: 0; padding: 0"
              >
                {{ item.Solution }}
              </p>
            </template>
          </el-table-column>
          <el-table-column
            label="最终结果"
            width="100"
            prop="Grade"
          />

          <el-table-column
            label="评审人"
            width="150"
            prop="CreateUserName"
            :show-overflow-tooltip="cellOverflow"
          />
          <el-table-column
            label="评审日期"
            width="135"
            align="center"
            prop="CreateDate"
          >
            <template slot-scope="{ row }">
              {{ row.CreateDate }}
            </template>
          </el-table-column>
          <el-table-column
            label="评审"
            align="center"
            fixed="right"
            width="60"
          >
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-s-check"
                :style="{backgroundColor:( ReviewIndex1===scope.$index?'#42b983':'#1890ff')}"
                :disabled="scope.row.Lock === 1 ? true : false"
                @click.native.prevent="Review(scope.row,scope.$index)"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="整改时间"
            width="135"
            align="center"
            prop="RectifyEndTime"
          >
            <template slot-scope="{ row }">
              {{ row.RectifyEndTime }}
            </template>
          </el-table-column>
          <el-table-column
            :label="CatalogVersion==='广东标准'?'是否达标':'是否达标'"
            prop="Standard"
            width="69"
            align="center"
          >
            <template slot-scope="{ row }">
              {{ row.Standard == 0 ? '否' : '是' }}
            </template>
          </el-table-column>
          <!--<el-table-column
            label="是否达标"
            prop="Standard"
            width="100"
            align="center"
          >
            <template slot-scope="{ row }">
              {{ row.Standard === 0 ? "否" : "是" }}
            </template>
          </el-table-column>-->
          <el-table-column
            label="操作"
            fixed="right"
            align="center"
            width="130"
          >
            <template slot-scope="scope">
              <el-button
                :type="scope.row.Lock === 1 ? 'info' : 'warning'"
                size="mini"
                :disabled="scope.row.isAudit == '未审核' ? true : false"
                :icon="scope.row.Lock === 1 ? 'el-icon-lock' : 'el-icon-unlock'"
                @click.native.prevent="UpdateLock(scope.row)"
              />
              <el-button
                v-if="userCode === 'admin'"
                type="danger"
                size="mini"
                icon="el-icon-delete"
                :disabled="scope.row.Lock === 1 ? true : false"
                @click.native.prevent="UpdateRevoke(scope.row)"
              />
            </template>
          </el-table-column>
        </el-table>
        <el-row>
          <el-col :span="3">
            <el-switch
              v-model="cellOverflow"
              style="margin: 6px 0px"
              active-text="收起"
              inactive-text="展开"
            />
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
    </el-card>
    <!-- <el-dialog
      title="个人工作进度"
      :visible.sync="dialogTableVisible"
    >
      <el-table
        :data="gridData"
        style="width: 100%"
        border
        size="mini"
        height="440"
      >
        <el-table-column property="address" label="已审核" />
        <el-table-column property="address" label="未审核" />
        <el-table-column property="address" label="已退回" />
        <el-table-column property="address" label="未上传资料" />
      </el-table>
    </el-dialog> -->

    <el-dialog
      :close-on-click-modal="false"
      title="评审标准审核"
      append-to-body
      :width="device === 'desktop' ? '50%' : '100%'"
      :visible.sync="dialogTableVisibleCatalog"
      @close="clearFormData"
      @resize="resize"
    >
      <el-tabs
        v-model="activeName"
        type="card"
      >
        <el-tab-pane
          label="考评办法"
          name="three"
        >
          <el-table
            :data="ResortName"
            border
            size="mini"
            highlight-current-row
            :height="isFullscreen ? isFullscreenHeight - 150 : 420"
            style="width: 100%"
          >
            <el-table-column
              prop="ResortID"
              label="序号"
              width="60"
            />
            <el-table-column
              prop="CatalogCodePath"
              label="条款"
              width="120"
            />
            <el-table-column
              prop="ResortName"
              label="内容"
            />
          </el-table>
        </el-tab-pane>
        <el-tab-pane
          label="材料审核"
          name="first"
        >
          <el-form
            :inline="true"
            class="demo-form-inline"
            size="mini"
          >
            <el-form-item>
              <el-input
                v-model="MaterialForm.AuthorName"
                placeholder="请输入上传人"
                clearable
                @keyup.enter.native="SelectArticle('搜索')"
              />
            </el-form-item>
            <!--            <el-form-item>-->
            <!--              <el-select-->
            <!--                v-model="MaterialForm.UploadState"-->
            <!--                placeholder="资料上传状态"-->
            <!--                clearable-->
            <!--                @change="elSelectSelectArticle"-->
            <!--              >-->
            <!--                <el-option-->
            <!--                  v-for="item in FileStatus"-->
            <!--                  :key="item.value"-->
            <!--                  :label="item.label"-->
            <!--                  :value="item.value"-->
            <!--                />-->
            <!--              </el-select>-->
            <!--            </el-form-item>-->
            <el-form-item>
              <el-select
                v-model="MaterialForm.AuditStatus"
                clearable
                size="mini"
                style="width: 140px"
                placeholder="审核状态"
                @change="elSelectSelectArticle"
              >
                <el-option
                  label="全部"
                  value=""
                />
                <el-option
                  label="未审核"
                  value="0"
                />
                <el-option
                  label="通过"
                  value="1"
                />
                <el-option
                  label="退回"
                  value="2"
                />
                <el-option
                  label="退回已修改"
                  value="3"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="SelectArticle('搜索')"
              >搜索
              </el-button>
            </el-form-item>
            <el-form-item>
              <el-select
                v-model="MaterialForm.SortField"
                clearable
                size="mini"
                style="width: 140px"
                placeholder="按照字段排序"
                @change="sortOrderField"
              >
                <el-option
                  v-for="(itemTH, indexTH) in materialDataTh"
                  :key="indexTH"
                  :label="itemTH.vcName"
                  :value="itemTH.vcItemID"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-tooltip
                class="item"
                effect="dark"
                content="升序"
                placement="top"
              >
                <el-button
                  icon="el-icon-arrow-up"
                  circle
                  @click="sortOrder('asc')"
                />
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="降序"
                placement="bottom"
              >
                <el-button
                  icon="el-icon-arrow-down"
                  circle
                  @click="sortOrder('desc')"
                />
              </el-tooltip>
            </el-form-item>
          </el-form>
          <el-table
            :data="materialData"
            :height="isFullscreen ? isFullscreenHeight - 210 : 400"
            border
            highlight-current-row
            size="mini"
            style="width: 100%"
          >
            <el-table-column
              type="index"
              label="序号"
              width="50"
              align="center"
            />
            <el-table-column
              prop="CatalogCode"
              label="条款"
              :show-overflow-tooltip="cellOverflow"
            />
            <el-table-column
              prop="CatalogName"
              label="评审要点"
              width="300"
              :show-overflow-tooltip="cellOverflow"
            />
            <el-table-column
              prop="Title"
              label="材料标题"
              width="200"
              :show-overflow-tooltip="cellOverflow"
            />
            <el-table-column
              label="资料上传"
              fixed="right"
              align="center"
              :show-overflow-tooltip="cellOverflow"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  icon="el-icon-upload"
                  round
                  :style="{backgroundColor:( editRowIndex1===scope.$index?'#42b983':'#1890ff')}"
                  type="primary"
                  :disabled="
                    scope.row.IsUpload == 1 &&
                      seeStatusViewForm.RoleName !== '系统管理员'
                  "
                  @click="uploadViews(scope.row,scope.$index)"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="上传编辑"
              fixed="right"
              align="center"
              :show-overflow-tooltip="cellOverflow"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  icon="el-icon-upload"
                  round
                  :style="{backgroundColor:( editRowIndex2===scope.$index?'#42b983':'#ffc833')}"
                  type="warning"
                  :disabled="
                    scope.row.IsUpload == 1 &&
                      seeStatusViewForm.RoleName !== '系统管理员'
                  "
                  @click="editRow(scope.row,scope.$index)"
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="address"
              label="审核"
              fixed="right"
              align="center"
              :show-overflow-tooltip="cellOverflow"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  icon="el-icon-s-check"
                  round
                  type="info"
                  :style="{backgroundColor:( ReviewIndex2===scope.$index?'#42b983':'#1890ff')}"
                  @click="statusViews(scope.row,scope.$index)"
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="address"
              label="状态"
              align="center"
              width="100"
              :show-overflow-tooltip="cellOverflow"
            >
              <template slot-scope="scope">
                <el-tag
                  round
                  size="small"
                  :type="
                    scope.row.AuditStatus === 0
                      ? 'info'
                      : scope.row.AuditStatus === 1
                        ? 'success'
                        : scope.row.AuditStatus === 2
                          ? 'danger'
                          : 'warning'
                  "
                >
                  {{
                    scope.row.AuditStatus === 0
                      ? '未审核'
                      : scope.row.AuditStatus === 1
                        ? '通过'
                        : scope.row.AuditStatus === 2
                          ? '退回'
                          : scope.row.AuditStatus === 4 ? '通过后修改' : '退回已修改'
                  }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="AuditContent"
              label="评审意见"
              width="300"
              :show-overflow-tooltip="cellOverflow"
            />
            <el-table-column
              v-if="ReviewRow.CatalogType != 1"
              prop="CataLogdescription"
              label="结果描述"
              width="300"
              :show-overflow-tooltip="cellOverflow"
            />
            <el-table-column
              align="center"
              prop="CreatDate"
              label="上传时间"
              width="200"
            >
              <template slot-scope="{ row }">
                {{ row.CreatDate.replace('T', ' ') }}
              </template>
            </el-table-column>
            <el-table-column
              prop="AuthorName"
              label="上传人"
              width="300"
              align="center"
              :show-overflow-tooltip="cellOverflow"
            />
          </el-table>
          <el-row>
            <el-col :span="3">
              <el-switch
                v-model="cellOverflow"
                style="margin: 6px 0px"
              />
            </el-col>
            <el-pagination
              :current-page="MaterialForm.pageIndex"
              :page-sizes="[10, 20, 30, 40, 50, 80]"
              :page-size="MaterialForm.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="MaterialForm.total"
              @size-change="handleSizeMaterialChange"
              @current-change="handleCurrentMaterialChange"
            />
          </el-row>
        </el-tab-pane>
        <el-tab-pane
          label="评审结果"
          name="second"
        >
          <div shadow="never">
            <el-form size="mini">
              <el-form-item :label="menu_one + '人'">
                <el-input
                  v-model="ReviewRow.LastCreateUserName"
                  disabled
                />
              </el-form-item>
              <el-form-item :label="menu_one + '时间'">
                <el-input
                  v-model="ReviewRow.LastCreateDate"
                  disabled
                />
              </el-form-item>
            </el-form>
          </div>
          <el-card
            shadow="never"
            :style="{
              height: isFullscreen ? 'calc(100vh - 260px)' : '350px',
              'overflow-y': 'auto',
            }"
          >
            <el-form
              ref="form2"
              :rules="rules"
              :model="MaterialReaultForm"
              label-width="80px"
              size="mini"
            >
              <el-form-item label="标准">
                <el-input
                  v-model="MaterialReaultForm.CatalogName"
                  disabled
                >
                  <template slot="prepend">{{
                    MaterialReaultForm.CatalogCode
                  }}
                  </template>
                </el-input>
              </el-form-item>
              <div style="display: flex">
                <el-form-item label="评审人">
                  <el-input
                    v-model="MaterialReaultForm.CreateUserName"
                    disabled
                  />
                </el-form-item>
                <el-form-item label="评审日期">
                  <el-input
                    v-model="MaterialReaultForm.RectifyStartTime"
                    disabled
                  />
                </el-form-item>
              </div>
              <div style="display: flex">
                <el-form-item
                  v-if="CurrentStatusL === 2"
                  label="分数"
                >
                  <el-select
                    v-model="MaterialReaultForm.Grade"
                    size="mini"
                    style="width: 400px"
                    multiple
                    clearable
                    placeholder="如无总分值和扣分原因，请在评审标准中的具体条款设置"
                    allow-create
                    default-first-option
                    filterable
                    @clear="Grades = otherGrades"
                    @change="grades"
                  >
                    <el-option
                      v-for="item in DeductionData"
                      :key="item.PenaltiesID"
                      :label="item.PenaltiesContent"
                      :value="`${item.PenaltiesContent}@@${item.PenaltiesFraction}`"
                    />
                  </el-select>
                  <el-input
                    v-model="Grades"
                    disabled
                    style="width: 400px"
                  />
                </el-form-item>
                <el-form-item
                  v-else
                  label="自评等级"
                >
                  <el-select
                    v-model="MaterialReaultForm.Grade"
                    size="mini"
                    style="width: 120px"
                    clearable
                    placeholder="自评等级"
                  >
                    <el-option
                      v-for="item in selfResult"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item
                  label="是否达标"
                >
                  <el-radio-group v-model="MaterialReaultForm.Standard">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>

                <el-form-item
                  label="进度"
                  prop="Progress"
                >
                  <el-select
                    v-model="MaterialReaultForm.Progress"
                    size="mini"
                    clearable
                    style="width: 120px"
                    placeholder="进度"
                  >
                    <el-option
                      v-for="item in schedule"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </div>
              <el-form-item label="历史问题">
                <el-input
                  v-model="Matters"
                  autosize
                  type="textarea"
                  disabled
                />
              </el-form-item>
              <el-form-item
                label="存在问题"
                prop="Matter"
              >
                <el-input
                  v-model="MaterialReaultForm.Matter"
                  autosize
                  type="textarea"
                />
              </el-form-item>
              <el-form-item label="历史措施">
                <el-input
                  v-model="Solutions"
                  autosize
                  type="textarea"
                  disabled
                />
              </el-form-item>
              <el-form-item
                label="采取措施"
                prop="Solution"
              >
                <el-input
                  v-model="MaterialReaultForm.Solution"
                  autosize
                  type="textarea"
                />
              </el-form-item>
              <el-form-item
                v-if="MaterialReaultForm.SMSStatus == 1"
                label="短信提醒"
              >
                <el-checkbox-group
                  v-model="MaterialReaultForm.SendSmS"
                  size="mini"
                >
                  <el-checkbox
                    :label="1"
                    border
                  >是
                  </el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-form>
          </el-card>
        </el-tab-pane>
        <el-tab-pane
          v-if="CatalogVersion != '中医院'"
          label="评审要点"
          name="third"
        >
          <el-table
            highlight-current-row
            :data="CatalogTable"
            :height="isFullscreen ? isFullscreenHeight - 150 : 400"
            border
            style="width: 100%"
          >
            <el-table-column
              prop="catalogCode"
              label="评审标准"
              width="180"
            />
            <el-table-column
              prop="pointCode"
              label="评审等级"
              width="180"
            >
              <template slot-scope="{ row }">{{
                row.pointCode + row.pointItem
              }}
              </template>
            </el-table-column>
            <el-table-column
              prop="pointName"
              label="评审要点内容"
            />
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          size="small"
          @click="dialogTableVisibleCatalog = false"
        >取 消
        </el-button>
        <el-button
          size="small"
          type="primary"
          @click="InsertUpdateEvaluationProblem"
        >通过审批
        </el-button>
        <el-button
          size="small"
          type="primary"
          @click="innerVisibleFunction"
        >退回整改
        </el-button>
      </div>
      <el-dialog
        :close-on-click-modal="false"
        :width="device === 'desktop' ? '50%' : '99%'"
        title="整改时间"
        :visible.sync="innerVisible"
        append-to-body
      >
        <el-form
          ref="formRectifyEndTime"
          :rules="rules"
          :model="MaterialReaultForm"
          label-width="80px"
          size="mini"
        >
          <el-form-item
            label="整改时间"
            prop="RectifyEndTime"
          >
            <el-date-picker
              v-model="MaterialReaultForm.RectifyEndTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm"
              format="yyyy-MM-dd HH:mm"
              size="mini"
              placeholder="选择日期"
            />
            {{ MaterialReaultForm.RectifyEndTime }}
          </el-form-item>
        </el-form>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            size="mini"
            type="primary"
            @click="InsertUpdateEvaluationProblem"
          >确定退回整改
          </el-button>
        </div>
      </el-dialog>
    </el-dialog>

    <el-dialog
      :close-on-click-modal="false"
      title="查看审核"
      :visible.sync="dialogFormVisibleStatusView"
      :width="device === 'desktop' ? '50%' : '99%'"
    >
      <el-form
        size="mini"
        label-width="80px"
      >
        <el-form-item label="条款">
          <el-input
            v-model="seeStatusViewForm.CatalogName"
            placeholder="条款"
            disabled
          >
            <template slot="prepend">{{
              seeStatusViewForm.CatalogCode
            }}
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="材料标题">
          <el-input
            v-model="seeStatusViewForm.Title"
            disabled
          />
        </el-form-item>
        <div style="display: flex; flex-wrap: wrap; justify-content: space-between">
          <el-form-item label="上传日期">
            <el-input v-model="seeStatusViewForm.CreatDate" />
          </el-form-item>
          <el-form-item label="上传人">
            <el-input v-model="seeStatusViewForm.AuthorName" />
          </el-form-item>
          <el-form-item
            v-if="ReviewRow.CatalogType === 1"
            label="审核结果"
          >
            <el-select
              v-model="seeStatusViewForm.AuditStatus"
              size="mini"
              clearable
              style="width: 120px"
            >
              <el-option
                v-for="item in ReviewStatusSelect"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="ReviewRow.CatalogType === 2"
            label="资料有无"
          >
            <el-select
              v-model="seeStatusViewForm.AuditMaterial"
              size="mini"
              clearable
              style="width: 120px"
            >
              <el-option
                v-for="item in dataFlag"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="达标条件">
            <el-input v-model="seeStatusViewForm.CreatDate" />
          </el-form-item> -->
          <el-form-item
            v-if="ReviewRow.CatalogType !== 1"
            :label="CatalogVersion === '广东标准'?'是否达标':'是否达标'"
          >
            <el-radio-group v-model="seeStatusViewForm.AuditCondition">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>

          <!-- <el-form-item label="审核结果">
            <el-select v-model="seeStatusViewForm.AuditStatus" size="mini" clearable style="width: 120px;">
              <el-option
                v-for="item in ReviewStatusSelect"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item> -->

          <el-form-item>
            <el-button
              size="mini"
              icon="el-icon-search"
              type="info"
              @click="dialogFormVisibleView = true"
            >查看详情
            </el-button>
          </el-form-item>
        </div>
        <el-form-item
          v-if="ReviewRow.CatalogType != 1"
          label="结果描述"
        >
          <el-input
            v-model="seeStatusViewForm.CataLogdescription"
            type="textarea"
            autosize
            clearable
            placeholder="请输入内容"
            maxlength="2000"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="审核意见">
          <!-- <el-input
            v-model="seeStatusViewForm.AuditContent"
            :disabled="
              seeStatusViewForm.AuditStatusDisabled == 1 &&
              seeStatusViewForm.RoleName !== '系统管理员'
            "
            type="textarea"
          /> -->
          <el-input
            v-model="seeStatusViewForm.AuditContent"
            type="textarea"
            maxlength="2000"
            show-word-limit
          />
        </el-form-item>
        <el-form-item
          label="当前级资料审核状态"
          label-width="140px"
        >
          <el-input
            v-model="seeStatusViewForm.LastAuditStatus"
            disabled
          />
        </el-form-item>

        <el-form-item
          label="当前级审核人 "
          label-width="140px"
        >
          <el-input
            v-model="seeStatusViewForm.LastAuditUserName"
            type="textarea"
            disabled
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          size="mini"
          @click="dialogFormVisibleStatusView = false"
        >取 消
        </el-button>
        <!-- <el-button
          :disabled="
            seeStatusViewForm.AuditStatusDisabled == 1 &&
            seeStatusViewForm.RoleName !== '系统管理员'
          "
          size="mini"
          @click="GetReviewArticleAudit(2)"
          >退回</el-button
        > -->
        <el-button
          size="mini"
          @click="GetReviewArticleAudit(2)"
        >退回
        </el-button>
        <!-- <el-button
          :disabled="
            seeStatusViewForm.AuditStatusDisabled == 1 &&
            seeStatusViewForm.RoleName != '系统管理员'
          "
          size="mini"
          type="primary"
          @click="GetReviewArticleAudit(1)"
        >通过</el-button> -->
        <el-button
          size="mini"
          type="primary"
          @click="GetReviewArticleAudit(1)"
        >通过
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="'查看详情:' + seeStatusViewForm.Title"
      :close-on-click-modal="false"
      :visible.sync="dialogFormVisibleView"
      width="50%"
    >
      <filePreview :preview-data="previewData" />
      <div
        class="htmlPane"
        v-html="seeStatusViewForm.Content"
      />
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          size="mini"
          @click="dialogFormVisibleView = false"
        >知道了
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      v-adaptive
      :title="dialogTitle + ' : ' + CatalogCode"
      :close-on-click-modal="false"
      :visible.sync="uploadDialog"
      :width="device === 'desktop' ? '50%' : '99%'"
      @opened="uploadOpened"
      @close="uploadCancel"
    >
      <el-form
        ref="uploadForm"
        :rules="rules"
        size="mini"
        :model="uploadForm"
        :inline="true"
        label-width="80px"
      >
        <div style="display: flex; flex-wrap: wrap">
          <el-form-item
            label="资料标题"
            prop="Title"
          >
            <el-input
              v-model="uploadForm.Title"
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item
            label="资料分类"
            prop="GroupID"
          >
            <articlegroup
              style="width: 140px"
              :value="uploadForm.GroupID"
              @getSelectAllArticleGroupValue="getSelectAllArticleGroupValue"
            />
          </el-form-item>
        </div>
        <el-form-item label="版本号">
          <el-input
            v-model="uploadForm.VersionNumber"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="附件上传">
          <el-upload
            :multiple="true"
            :show-file-list="true"
            :on-success="handleSuccess"
            :on-change="handleChange"
            class="editor-slide-upload"
            :file-list="fileList"
            :action="IP"
          >
            <el-button
              size="mini"
              type="primary"
            > 选择文件
            </el-button>
          </el-upload>
        </el-form-item>
        <filePreview
          ref="filePreview"
          :preview-data="uploadForm.File_list"
          :delete-show-file="true"
        />
        <tinymce ref="tinymceRef" />
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          size="small"
          @click="uploadCancel()"
        >关闭
        </el-button>
        <el-button
          type="primary"
          size="small"
          :loading="uploadEnd"
          @click="
            dialogTitle === '添加资料'
              ? InsertArticle('uploadForm')
              : UpdateArticle('uploadForm')
          "
        >提交
        </el-button>
      </div>
    </el-dialog>
    <el-drawer
      title="历史记录"
      :visible.sync="drawer"
      :direction="device === 'mobile' ? 'btt' : 'rtl'"
      size="50%"
      :with-header="false"
    >
      <el-form
        :inline="true"
        size="mini"
        class="drawerFrom"
      >
        <div>
          <el-form-item label="标准:">
            {{ RecordData.CatalogCode }}
          </el-form-item>
          <el-form-item label="层级">
            <el-select
              v-model="RecordData.textStep"
              placeholder="请选择"
              @change="changeStep"
            >
              <el-option
                label="全部"
                value="0"
              />
              <el-option
                :label="selectData.menu_one"
                value="1"
              />
              <el-option
                :label="selectData.menu_two"
                value="2"
              />
              <el-option
                :label="selectData.menu_three"
                value="3"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              :loading="downloadLoading2"
              type="success"
              :disabled="listLoading2"
              size="mini"
              @click="handleDownload2"
            >导出
            </el-button>
          </el-form-item>
          <el-form-item label="">
            <el-pagination
              layout="prev, pager, next"
              :total="RecordData.total"
              @current-change="handleCurrentChange2"
            />
          </el-form-item>
        </div>
        <div>
          <el-form-item>
            <i
              class="el-icon-close"
              @click="handleClose"
            />
          </el-form-item>
        </div>
      </el-form>
      <el-table
        v-loading="drawerDataLoding"
        :data="drawerData"
        :height="'70vh'"
        size="mini"
        border
        highlight-current-row
      >
        <el-table-column
          type="index"
          width="40"
          align="center"
        />
        <el-table-column
          label="审核人"
          prop="UserName"
        />
        <el-table-column
          label="评审批次"
          prop="StepName"
          align="center"
          width="80"
        />
        <el-table-column
          label="自评等级"
          prop="Grade"
          align="center"
          width="80"
        />
        <el-table-column
          label="存在问题"
          prop="Matter"
        />
        <el-table-column
          label="改进措施"
          prop="Solution"
        />
        <el-table-column
          label="审核状态"
          prop="isAudit"
          align="center"
          width="120"
        />
        <el-table-column
          :label="CatalogVersion==='广东标准'?'是否达标':'是否达标'"
          prop="Standard"
          align="center"
        >
          <template slot-scope="{ row }">
            {{ row.Standard == 0 ? '否' : '是' }}
          </template>
        </el-table-column>
        <el-table-column
          label="时间"
          prop="CreateDate"
          align="center"
        >
          <template slot-scope="{ row }">
            {{ row.CreateDate.replace('T', ' ') }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="50"
        >
          <template slot-scope="{ row }">
            <el-button
              size="mini"
              circle
              type="danger"
              icon="el-icon-delete"
              @click="DeleteEvaluationRecord(row)"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>
  </div>
</template>
<script>
import { parseTime } from '@/utils';
import {
  GetReviewArticleAudit,
  InsertArticle,
  SelectArticle,
  SelectArticleAudit,
  SelectArticleDetail,
  UpdateArticle
} from '@/api/Article';

import {
  DeleteEvaluationRecord,
  InsertUpdateEvaluationProblem,
  SelectCatalogByCatalogID,
  SelectEvaluation,
  SelectEvaluationRecord,
  UpdateLock,
  UpdateRevoke
} from '@/api/Evaluation';

import { SelectAllPenaltiesByCatalogID } from '@/api/Penalties';

import { SelectResort } from '@/api/Resort';

import { GetSumscore } from '@/api/catalog';

import period from '@/views/components/period';

import { SelectGroupList } from '@/api/EvaluationUser';

// import defaultDept from '@/views/components/defaultDept'
import { gradeType } from '@/settings';

import tableHeight from '@/views/mixin/tableHeight';

import articlegroup from '@/views/components/articlegroup';
import cascaderFilter from '@/views/components/cascaderFilter';
import { mapGetters } from 'vuex';
import { Preview } from '@/views/mixin/relace';
import tinymce from '@/components/tinymce';
import filePreview from '@/views/components/file/filePreview';
import { GetCatalogCfgInfo } from '@/api/SMS';

export default {
  name: 'EvaluationTwo',
  components: { period, articlegroup, cascaderFilter, tinymce, filePreview },
  mixins: [tableHeight],
  data() {
    return {
      FileStatus: [ // 资料上传状态
        {
          label: '全部',
          value: ''
        },
        {
          label: '已上传资料',
          value: '1'
        },
        {
          label: '未上传资料',
          value: '2'
        }
      ],
      CurrentStatusL: 1, // 默认评审考评类型为等级制
      gradeType,
      menu_one: '',
      menu_two: '',
      userCode: window.userInfo[0].UserCode,
      dialogTableVisible: false,
      dialogTableVisibleCatalog: false,
      dialogFormVisibleStatusView: false,
      dialogFormVisibleView: false,
      downloadLoading: false,
      downloadLoading2: false,
      innerVisible: false,
      activeName: 'second',
      listLoading: true,
      listLoading2: false,
      Matters: '',
      Solutions: '',
      status: '0,0',

      isClear: false,
      IP: '/api/Article/UploadFile',
      dialogTitle: '',
      CatalogCode: '',
      uploadDialog: false,
      fileList: [],
      uploadForm: {
        Title: '',
        GroupID: 0,
        CatalogID: '',
        Content: '1',
        AuthorID: window.userInfo[0].UserID,
        VersionNumber: '',
        File_list: []
      },
      uploadEnd: false,
      EvaluationForm: {
        UserID: window.userInfo[0].UserID,
        Step: '2',
        CatalogCode: '',
        UploadStatus: 0,
        Grade: '',
        Status: '0',
        StepType: '0',
        PeriodID: 0,
        Progress: '',
        pageIndex: 1,
        pageSize: 50,
        GroupID: '',
        UserIDs: '',
        StepValue: 2,
        CurrentGrade: this.$route.params.Grade || '',
        CurrentStatus: this.$route.params.CurrentStatus || '',
        UnReview: this.$route.params.UnReview || false
      },
      form: {},

      listQuery: {
        Title: '',
        GroupID: '',
        CatalogID: '',
        Content: '',
        AuthorID: window.userInfo[0].UserID
      },
      rules: {
        Matter: [
          { required: true, message: '请输入存在问题', trigger: 'blur' }
        ],
        Solution: [
          { required: true, message: '请输入采取措施', trigger: 'blur' }
        ],
        Grade: [
          { required: true, message: '该项必填', trigger: ['blur', 'change'] }
        ],
        Progress: [{ required: true, message: '请选择进度', trigger: 'blur' }],
        RectifyEndTime: [
          { required: true, message: '请选择整改时间', trigger: 'change' }
        ]
      },
      MaterialForm: {
        CatalogID: '',
        AuthorName: '',
        UploadState: '',
        AuditStatus: '',
        pageIndex: 1,
        pageSize: 50,
        UserID: window.userInfo[0].UserID,
        SortField: 'CatalogCode',
        Sort: 'desc',
        total: 0
      },
      MaterialReaultForm: {
        Matter: '',
        CatalogID: '',
        Grade: '',
        CreateUserID: window.userInfo[0].UserID,
        CreateUserName: window.userInfo[0].UserName,
        RectifyStartTime: parseTime(new Date()),
        AuditCondition: 0,
        Progress: '',
        Solution: '',
        RectifyEndTime: '',
        Lock: '',
        Step: '2',
        Status: '',
        Standard: 0,
        SMSStatus: [window.SMSStatus],
        SendSmS: 0
      },
      pagination: {
        pageIndex: 1,
        total: 0,
        pageSize: 50,
        pageSizes: [15, 20, 50, 100]
      },
      paginationMaterial: {
        pageIndex: 1,
        total: 0,
        pageSize: 50,
        pageSizes: [15, 20, 50, 100]
      },
      tableData: [],
      materialData: [],
      materialDataTh: [],
      gridData: [],
      selfResult: [
        {
          value: 'A',
          label: 'A'
        },
        {
          value: 'B',
          label: 'B'
        },
        {
          value: 'C',
          label: 'C'
        },
        {
          value: 'D',
          label: 'D'
        },
        {
          value: 'E',
          label: 'E'
        }
      ],
      MateralStatus: [
        {
          value: 0,
          label: '不达标'
        },
        {
          value: 1,
          label: '达标'
        }
      ],
      DataStatus: [
        {
          value: 0,
          label: '资料状态（全部）'
        },
        {
          value: 1,
          label: '未上传资料'
        },
        {
          value: 2,
          label: '已上传资料'
        }
      ],
      ReviewStatus: [
        {
          value: '0,0',
          label: '评审状态（全部）'
        },
        {
          value: '3,3',
          label: '未审核'
        },
        {
          value: '1,1',
          label: ''
        },
        {
          value: '2,1',
          label: ''
        },
        {
          value: '2,2',
          label: ''
        },
        {
          value: '3,1',
          label: ''
        },
        {
          value: '3,2',
          label: ''
        }
      ],
      schedule: [],
      seeStatusViewForm: {
        AuditID: 0,
        ArticleID: 0,
        AuditUserId: window.userInfo[0].UserID,
        RoleName: window.userInfo[0].RoleName,
        AuditStatus: 0,
        AuditContent: '',
        AuditRemark: '',
        AuditMaterial: '',
        AuditCondition: 0,
        CataLogdescription: '',
        AuditStatusDisabled: '', // 控制禁选
        Title: ''
      },
      ReviewStatusSelect: [
        {
          value: 0,
          label: '未审核'
        },
        {
          value: 1,
          label: '通过'
        },
        {
          value: 2,
          label: '退回'
        },
        {
          value: 3,
          label: '退回后修改'
        },
        {
          value: 4,
          label: '通过后修改'
        }
      ],
      dataFlag: [
        {
          value: 0,
          label: '无'
        },
        {
          value: 1,
          label: '有'
        }
      ],
      ReviewRow: {},
      ReviewRow1: {},
      DeductionData: [],
      Grades: 0,
      otherGrades: 0,
      ResortName: [],
      SelectGroupListData: [],
      drawer: false,
      drawerData: [],
      RecordData: {
        pageIndex: 1,
        pageSize: 50,
        CatalogID: 0,
        Step: 0,
        CatalogCode: '',
        textStep: '',
        total: 0
      },
      drawerDataLoding: true,
      selectData: {},
      clearfixHeight: 70,
      CatalogTable: [],
      CatalogVersion: window.CatalogVersion,
      isFullscreen: false,
      isFullscreenHeight: document.body.clientHeight,
      cellOverflow: false,
      previewData: [],
      downloadValue: '',
      para: {},
      ReviewIndex1: '', // 用来表示外层评审按钮颜色改变
      ReviewIndex2: '', // 用来表示内层评审按钮颜色改变
      editRowIndex1: '', // 用来表示内层资料上传按钮颜色改变
      editRowIndex2: ''// 用来表示内层上传编辑按钮颜色改变

    };
  },
  created() {
    this.chaKan();
    this.getIni();
    this.SelectEvaluation();
    this.SelectGroupList();
    let x = 0;
    for (let i = 0; i < 10; i++) {
      this.schedule.push({
        value: `${(x += 10)}`,
        label: 10 * i + 10 + '%'
      });
    }
    const para = this.$store.getters.iniPara;
    this.para = para;
    this.selectData = para;
  },
  computed: {
    ...mapGetters(['device'])
  },
  mounted() {
    document.addEventListener('click', e => {
      if (!this.$el.contains(e.target)) {
        if (this.clearfixHeight >= 70) {
          this.clearfixHeight = 30;
        }
      }
    });
  },
  methods: {
    // 获取评审考评类型，等级还是分数制
    async chaKan() {
      const { data } = await GetCatalogCfgInfo({});
      this.CurrentStatusL = data[0].CurrentStatus;
      console.log(this.CurrentStatusL);
    },
    async getIni() {
      const para = this.$store.getters.iniPara;
      this.menu_one = para.menu_one;
      this.menu_two = para.menu_two;
      this.ReviewStatus[2].label = para.menu_one + '通过';
      this.ReviewStatus[3].label = para.menu_two + '通过';
      this.ReviewStatus[4].label = para.menu_two + '退回';
      this.ReviewStatus[5].label = para.menu_three + '通过';
      this.ReviewStatus[6].label = para.menu_three + '退回';
    },
    async handleDownload() {
      this.downloadLoading = true;
      try {
        const excel = await import('@/vendor/Export2Excel');
        const multiHeader = [
          [
            '标准',
            '章节',
            '执行人员自评',
            '',
            '',
            '评审状态',
            '评审结果',
            '存在问题',
            '改进措施',
            '评审人',
            '评审日期',
            '整改时间',
            '是否达标'
          ]
        ];
        const tHeader = [
          '',
          '',
          '自评结果',
          '存在问题',
          '改进措施',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          ''
        ];
        const filterVal = [
          'CatalogCode',
          'TypeName',
          'StepGrade',
          'Review_Matter_Solution',
          'Review_Matter_Solution1',
          'isAudit',
          'Grade',
          'Matter_Solution',
          'Matter_Solution1',
          'CreateUserName',
          'CreateDate',
          'RectifyEndTime',
          'Standard'
        ];
        let Total;
        if (!this.downloadValue) {
          Total = this.EvaluationForm.total;
        } else {
          Total = this.downloadValue;
        }
        const { data } = await SelectEvaluation({
          UserID: window.userInfo[0].UserID,
          Step: '2',
          CatalogCode: this.EvaluationForm.CatalogCode,
          Status: this.EvaluationForm.Status,
          StepType: this.EvaluationForm.StepType,
          UploadStatus: this.EvaluationForm.UploadStatus,
          Grade: this.EvaluationForm.Grade,
          PeriodID: this.EvaluationForm.PeriodID,
          Progress: this.EvaluationForm.Progress,
          pageIndex: 1,
          pageSize: Total,
          GroupID: this.EvaluationForm.GroupID,
          UserIDs: this.EvaluationForm.UserIDs,
          StepValue: this.EvaluationForm.StepValue,
          CurrentGrade: this.EvaluationForm.CurrentGrade,
          CurrentStatus: this.EvaluationForm.CurrentStatus,
          UnReview: this.EvaluationForm.UnReview
        });
        const formData = this.formatJson(filterVal, data.DataList);

        const merges = [
          'A1:A2',
          'B1:B2',
          'C1:E1',
          'F1:F2',
          'G1:G2',
          'H1:H2',
          'I1:I2',
          'J1:J2',
          'K1:K2',
          'L1:L2',
          'M1:M2'
        ];
        excel.export_json_to_excel({
          multiHeader,
          header: tHeader,
          data: formData,
          merges,
          filename: '文件名'
        });
        this.downloadLoading = false;
      } catch (error) {
        console.error(error);
      }
    },
    async handleDownload2() {
      this.downloadLoading2 = true;
      this.listLoading2 = true;
      try {
        this.drawerData.map((item, index) => {
          this.drawerData[index].CreateDate = item.CreateDate.replace('T', ' ');
        });
        const excel = await import('@/vendor/Export2Excel');
        const tHeader = [
          '审核人',
          '评审批次',
          '存在问题',
          '改进措施',
          '审核状态',
          '时间'
        ];
        const filterVal = [
          'UserName',
          'StepName',
          'Matter',
          'Solution',
          'isAudit',
          'CreateDate'
        ];
        const formData = this.formatJson(filterVal, this.drawerData);
        excel.export_json_to_excel({
          header: tHeader,
          data: formData,
          filename: '文件名'
        });
      } catch (error) {
        console.error(error);
      }
      this.downloadLoading2 = false;
      this.listLoading2 = false;
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === 'Matter_Solution') {
            return v[j].map(item => item.Matter);
          } else if (j === 'Matter_Solution1') {
            return v['Matter_Solution'].map(item => item.Solution);
          } else if (j === 'Review_Matter_Solution') {
            return v['Review_Matter_Solution'].map(item => item.StepMatter);
          } else if (j === 'Review_Matter_Solution1') {
            return v['Review_Matter_Solution'].map(item => item.StepSolution);
          } else if (j === 'Standard') {
            return v[j] === 0 ? '否' : '是';
          } else {
            return v[j];
          }
        })
      );
    },
    handleChange(file, fileList) {
      this.uploadEnd = true;
      fileList.forEach(item => {
        if (item.response && item.response.code === 200) {
          this.uploadEnd = false;
        } else {
          this.uploadEnd = false;
        }
      });
    },
    handleSuccess(response, file) {
      if (response.hasOwnProperty('data')) {
        this.uploadForm.File_list.push({
          FileName: file.name,
          FileUrl: response.data[0].Content
        });
      } else {
        this.fileList = [];
        this.$message.error(file.name + '   上传失败');
      }
    },
    uploadCancel() {
      this.fileList = [];
      this.$nextTick(() => {
        this.$refs.tinymceRef.deactivated(); /* 销毁编辑器 */
      });
      this.uploadDialog = false;
      this.$refs.filePreview.currentEdit = -1;// 将修改input框隐藏
    },
    uploadOpened() {
      this.fileList = [];
    },
    async UpdateArticle(uploadForm) {
      this.$refs[uploadForm].validate(async v => {
        if (v) {
          this.uploadEnd = true;
          if (this.uploadForm.GroupID === 0) {
            this.$message({
              type: 'success',
              message: '请填写资料分类'
            });
            return;
          }
          this.uploadForm.Content = this.$refs.tinymceRef.Submit();

          try {
            const { msg } = await UpdateArticle(this.uploadForm);
            this.$message.success(msg);

            this.tableData = [];
          } catch (error) {
            console.log(error);
          } finally {
            await this.SelectArticle();
            this.uploadDialog = false;
            this.uploadEnd = false;
            this.$refs.filePreview.currentEdit = -1;// 将修改input框隐藏
          }
        }
      });
    },
    async InsertArticle(uploadForm) {
      this.$refs[uploadForm].validate(async v => {
        if (v) {
          this.uploadEnd = true;
          if (this.uploadForm.GroupID === 0) {
            this.$message({
              type: 'success',
              message: '请填写资料分类'
            });
            return;
          }

          this.uploadForm.Content = this.$refs.tinymceRef.Submit();

          this.uploadForm.AllowUserID = '';
          try {
            const { msg } = await InsertArticle(this.uploadForm);
            this.$message.success(msg);
            this.tableData = [];
          } catch (error) {
            console.log(error);
          } finally {
            this.SelectArticle();
            this.uploadDialog = false;
            this.uploadEnd = false;
            this.$refs.filePreview.currentEdit = -1;// 将修改input框隐藏
          }
        }
      });
    },
    getSelectAllArticleGroupValue(value) {
      this.uploadForm.GroupID = value;
    },
    async editRow(row, index) {
      row = JSON.parse(JSON.stringify(row));
      this.uploadForm = row;
      this.CatalogCode = row.CatalogCode;
      this.dialogTitle = '修改资料';
      this.previewData = [];
      const { data } = await SelectArticleDetail({ ArticleID: row.ArticleID });
      this.previewData = [...Preview(row.Content), ...data];
      this.uploadForm.File_list = data;
      this.editRowIndex2 = index;
      this.editRowIndex1 = -1;
      this.ReviewIndex2 = -1;
      this.$nextTick(() => {
        this.$refs.tinymceRef.setContent(row.Content);
      });
      this.uploadDialog = true;
    },

    uploadViews(row, index) {
      row = JSON.parse(JSON.stringify(row));
      this.uploadForm = row;
      this.uploadForm.CatalogID = row.CatalogID;
      this.uploadForm.Content = ' ';
      this.uploadForm.Title = '';
      this.uploadForm.GroupID = '';
      this.uploadForm.VersionNumber = '';
      this.CatalogCode = row.CatalogCode;
      this.dialogTitle = '添加资料';
      this.previewData = [];
      this.uploadForm.File_list = [];
      this.fileList = [];
      this.editRowIndex1 = index;
      this.editRowIndex2 = -1;
      this.ReviewIndex2 = -1;
      this.$nextTick(() => {
        this.$refs.tinymceRef.setContent(this.uploadForm.Content);
      });
      this.uploadDialog = true;
    },

    grades(arr) {
      const arrs = arr.map(item => item.split('@@')[1] || 0);
      this.Grades =
        this.otherGrades -
        arrs.reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
      this.Grades = this.Grades <= 0 ? 0 : this.Grades;
    },
    async SelectAllPenaltiesByCatalogID(CatalogID = 0) {
      try {
        const { data } = await SelectAllPenaltiesByCatalogID({ CatalogID });
        this.DeductionData = data.DataList;
      } catch (error) {
        console.log(error);
      }
    },
    clearFormData() {
      this.ReviewIndex2 = -1; // 取消对话框之后清楚颜色按钮
      this.MaterialReaultForm = {
        Matter: '',
        CatalogID: '',
        Grade: '',
        CreateUserID: window.userInfo[0].UserID,
        CreateUserName: window.userInfo[0].UserName,
        RectifyStartTime: parseTime(new Date()),
        AuditCondition: 0,
        EvaluationID: 0,
        Progress: '',
        Solution: '',
        RectifyEndTime: '',
        Lock: '',
        Step: '2',
        Status: '',
        Standard: 0,
        SMSStatus: [window.SMSStatus]
      };
      // this.$refs['form2'].resetFields()
    },
    async GetReviewArticleAudit(AuditStatus) {
      const fromData = {
        ArticleID: this.seeStatusViewForm.ArticleID,
        AuditID: this.seeStatusViewForm.AuditID,
        AuditCondition: this.seeStatusViewForm.AuditCondition,
        AuditContent: this.seeStatusViewForm.AuditContent,
        AuditMaterial: this.seeStatusViewForm.AuditMaterial,
        AuditRemark: this.seeStatusViewForm.AuditRemark,
        AuditStatus: AuditStatus,
        AuditUserId: this.seeStatusViewForm.AuditUserId,
        CataLogdescription: this.seeStatusViewForm.CataLogdescription,
        Step: 2
      };
      try {
        const { code, msg } = await GetReviewArticleAudit(fromData);
        code === 200
          ? this.$message({
            type: 'success',
            message: msg
          })
          : this.$message({
            type: 'error',
            message: msg
          });
        this.SelectArticle();
      } catch (error) {
        console.log(error);
      } finally {
        this.dialogFormVisibleStatusView = false;
      }
    },
    async statusViews(row, index) {
      this.seeStatusViewForm.AuditStatus = row.AuditStatus;
      const { data } = await SelectArticleDetail({ ArticleID: row.ArticleID });
      this.previewData = [...Preview(row.Content), ...data];
      row = JSON.parse(JSON.stringify(row));
      try {
        const { data } = await SelectArticleAudit({
          ArticleID: row.ArticleID,
          Step: 2
        });
        this.ReviewIndex2 = index;
        this.editRowIndex1 = -1;
        this.editRowIndex2 = -1;
        this.seeStatusViewForm.CatalogCode = row.CatalogCode;
        this.seeStatusViewForm.CatalogName = row.CatalogName;
        this.seeStatusViewForm.CatalogID = row.CatalogID;
        this.seeStatusViewForm.GroupName = row.GroupName;
        this.seeStatusViewForm.Title = row.Title;
        this.seeStatusViewForm.CreatDate = row.CreatDate;
        this.seeStatusViewForm.AuthorName = row.AuthorName;
        this.seeStatusViewForm.ArticleID = row.ArticleID;
        this.seeStatusViewForm.Content = row.Content;

        if (data.length > 0) {
          this.seeStatusViewForm.AuditMaterial = parseInt(
            data[0].AuditMaterial
          );
          this.seeStatusViewForm.AuditCondition = parseInt(
            data[0].AuditCondition
          );

          this.seeStatusViewForm.AuditID = data[0].AuditID;
          this.seeStatusViewForm.CataLogdescription =
            data[0].CataLogdescription;
          this.seeStatusViewForm.AuditContent = data[0].AuditContent;
          this.seeStatusViewForm.AuditStatusDisabled = data[0].LastAuditStatus;
          this.seeStatusViewForm.LastAuditStatus =
            data[0].LastAuditStatus === 1
              ? '通过'
              : data[0].LastAuditStatus === 2
                ? '退回'
                : '未审核';
          this.seeStatusViewForm.LastAuditUserName = data[0].LastAuditUserName;
        } else {
          this.seeStatusViewForm.AuditMaterial = 0;
          this.seeStatusViewForm.AuditCondition = 0;
          this.seeStatusViewForm.AuditID = 0;
          this.seeStatusViewForm.LastAuditStatus = '未审核';
          this.seeStatusViewForm.CataLogdescription = '';
          this.seeStatusViewForm.AuditContent = '';
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.dialogFormVisibleStatusView = true;
      }
    },
    innerVisibleFunction() {
      this.$refs.form2.validate(async v => {
        if (v) {
          this.innerVisible = true;
        } else {
          this.activeName = 'second';
        }
      });
    },
    InsertUpdateEvaluationProblem(e) {
      const innerText = e.target.innerText;
      this.MaterialReaultForm.SendSmS =
        this.MaterialReaultForm.SendSmS === 0 ? 0 : 1;
      this.$refs.form2.validate(async v => {
        if (v) {
          this.MaterialReaultForm.Status = innerText === '通过审批' ? 1 : 2;
          this.MaterialReaultForm.RectifyEndTime =
            innerText === '通过审批'
              ? ''
              : this.MaterialReaultForm.RectifyEndTime;
          this.MaterialReaultForm.Grade = Array.isArray(
            this.MaterialReaultForm.Grade
          )
            ? (this.MaterialReaultForm.Grade =
              this.Grades)
            : this.MaterialReaultForm.Grade;
          // 如果没选中等级，数值直接为空
          // ? (this.MaterialReaultForm.Grade =
          //   this.Grades <= 0 ? null : this.Grades)
          // : this.MaterialReaultForm.Grade;
          // 如果没选中等级，数值直接为0

          // 当不是第一层级的就可以修改是否达标项，
          // this.MaterialReaultForm.Standard =
          //   this.ReviewRow.CatalogType !== 1
          //     ? this.MaterialReaultForm.Standard
          //     : 0;
          this.MaterialReaultForm.SMSStatus = this.MaterialReaultForm.SMSStatus;
          try {
            const { msg } = await InsertUpdateEvaluationProblem(
              this.MaterialReaultForm
            );
            this.$message({
              type: 'success',
              message: msg
            });
            this.SelectEvaluation();
          } catch (error) {
            console.log(error);
          } finally {
            this.innerVisible = false;
            this.dialogTableVisibleCatalog = false;
          }
        } else {
          this.activeName = 'second';
        }
      });
    },
    async Review(row, index) {
      row = JSON.parse(JSON.stringify(row));
      this.MaterialReaultForm.Standard = row.Standard;
      this.SelectAllPenaltiesByCatalogID(row.CatalogID);
      const val = {
        CatalogID: row.CatalogID,
        pageIndex: this.pagination.pageIndex,
        pageSize: this.pagination.pageSize
      };
      try {
        const { data } = await SelectResort(val);
        const CatalogData = await SelectCatalogByCatalogID({
          CatalogID: row.CatalogID
        });
        this.ReviewIndex1 = index;
        this.CatalogTable = CatalogData.data;
        this.ResortName = data.DataList;
        this.dialogTableVisibleCatalog = true;
        this.MaterialForm.CatalogID = row.CatalogID;
        this.MaterialReaultForm.CatalogID = row.CatalogID;
        this.MaterialReaultForm.CatalogCode = row.CatalogCode;
        this.MaterialReaultForm.CatalogName = row.CatalogName;
        this.MaterialReaultForm.Lock = row.Lock;
        if (row.CatalogType === 1) {
          this.MaterialReaultForm.Grade = [];
        } else {
          this.MaterialReaultForm.Grade = row.Grade;
        }
        this.MaterialReaultForm.Progress = row.Progress;
        this.ReviewRow = row;
        const Matter = [];
        const Solution = [];
        row.Matter_Solution.forEach(r => {
          Matter.push(r.Matter);
          Solution.push(r.Solution);
        });
        this.Matters = Matter.join('\n');
        this.Solutions = Solution.join('\n');
        this.SelectArticle();
        if (row.CatalogType === 1) {
          const { data } = await GetSumscore({ CatalogID: row.CatalogID });
          this.Grades = data[0].Fraction;
          this.otherGrades = data[0].Fraction;
        }
      } catch (error) {
        console.log(error);
      }
    },
    getPeriodValue(value) {
      this.EvaluationForm.PeriodID = value;
    },
    async UpdateLock(row) {
      this.$confirm(`此操作将操作 ${row.CatalogCode} 标准, 是否继续?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          try {
            const { code, msg } = await UpdateLock({
              condition1: row.CatalogID,
              condition: row.Lock === 0 ? 1 : 0
            });
            code === 200
              ? this.$message({
                type: 'success',
                message: msg
              })
              : this.$message({
                type: 'error',
                message: msg
              });
            const Status = this.status;
            this.EvaluationForm = {
              UserID: window.userInfo[0].UserID,
              Step: '2',
              CatalogCode: '',
              Status: Status.split(',')[1],
              StepType: Status.split(',')[0],
              PeriodID: 0,
              Progress: '',
              pageIndex: 1,
              pageSize: 15
            };
            this.SelectEvaluation();
          } catch (error) {
            console.log(error);
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消锁定'
          });
        });
    },
    async UpdateRevoke(row) {
      const isAuditType = row.isAudit.includes(
        this.menu_two.replace('审核', '')
      );
      if (!isAuditType) {
        this.$message({
          type: 'warning',
          message: '未到当前级不可撤销！'
        });
        return;
      }
      this.$confirm(`此操作将撤销 ${row.CatalogCode} 标准, 是否继续?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          try {
            const { code, msg } = await UpdateRevoke({
              condition1: '2',
              condition: row.CatalogID
            });
            code === 200
              ? this.$message({
                type: 'success',
                message: msg
              })
              : this.$message({
                type: 'error',
                message: msg
              });
            const Status = this.status;
            this.EvaluationForm = {
              UserID: window.userInfo[0].UserID,
              Step: '2',
              CatalogCode: '',
              Status: Status.split(',')[1],
              StepType: Status.split(',')[0],
              PeriodID: 0,
              Progress: '',
              pageIndex: 1,
              pageSize: 15
            };
            this.SelectEvaluation();
          } catch (error) {
            console.log(error);
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '撤销取消'
          });
        });
    },
    async SelectArticle(value) {
      try {
        this.MaterialForm.pageIndex =
          value === '搜索' ? 1 : this.MaterialForm.pageIndex;
        const { data } = await SelectArticle(this.MaterialForm);
        this.materialData = data.DataList;
        this.materialDataTh = data.th;
        this.MaterialForm.total = data.Total;
      } catch (error) {
        console.log(error);
      }
    },

    sortOrder(value) {
      this.MaterialForm.pageIndex = 1;
      this.MaterialForm.Sort = value;
      this.SelectArticle();
    },
    sortOrderField() {
      this.MaterialForm.pageIndex = 1;
      this.SelectArticle();
    },
    elSelectSelectArticle() {
      this.MaterialForm.pageIndex = 1;
      this.SelectArticle();
    },
    handleSizeMaterialChange(page) {
      this.MaterialForm.pageIndex = 1;
      this.MaterialForm.pageSize = page;
      this.SelectArticle();
    },
    handleCurrentMaterialChange(index) {
      this.MaterialForm.pageIndex = index;
      this.SelectArticle();
    },
    async SelectEvaluation() {
      const Status = this.status;
      this.EvaluationForm.StepType = this.status.split(',')[0];
      this.EvaluationForm.Status = this.status.split(',')[1];
      this.EvaluationForm.GroupID =
        this.EvaluationForm.GroupID === '' ? 0 : this.EvaluationForm.GroupID;
      try {
        const { data, msg } = await SelectEvaluation(this.EvaluationForm);
        this.EvaluationForm.GroupID =
          this.EvaluationForm.GroupID === 0 ? '' : this.EvaluationForm.GroupID;
        this.status = Status;
        if (msg !== '成功') {
          this.$message({
            type: 'info',
            message: 'msg'
          });
        }
        this.tableData = data.DataList;
        this.pagination.total = data.Total;
      } catch (error) {
        console.log(error);
      } finally {
        this.listLoading = false;
      }
    },
    elSelectUploadStatus(val) {
      this.clickSelectEvaluation();
    },
    elSelectStatus(val) {
      this.clickSelectEvaluation();
    },
    async clickSelectEvaluation() {
      this.listLoading = true;
      this.EvaluationForm.pageIndex = 1;
      this.pagination.pageIndex = 1;
      this.SelectEvaluation();
    },
    handleCurrentChange(index) {
      this.listLoading = true;
      this.EvaluationForm.pageIndex = index;
      this.SelectEvaluation();
    },
    handleSizeChange(page) {
      this.listLoading = true;
      this.EvaluationForm.pageSize = page;
      this.clickSelectEvaluation();
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.Lock === 1) {
        return 'warning-row';
      }
      return '';
    },
    async SelectGroupList() {
      /* 按钮权限 */
      try {
        const { data } = await SelectGroupList();
        this.SelectGroupListData = data;
      } catch (error) {
        console.log(error);
      }
    },
    history(row) {
      this.drawer = true;
      this.RecordData.CatalogCode = row.CatalogCode;
      this.RecordData.CatalogID = row.CatalogID;
      this.SelectEvaluationRecord();
    },
    handleClose() {
      this.drawer = false;
    },
    async SelectEvaluationRecord() {
      try {
        this.drawerDataLoding = true;
        const { data } = await SelectEvaluationRecord(this.RecordData);
        this.RecordData.total = data.Total;
        this.drawerData = data.DataList;
      } catch (error) {
        console.log(error);
      }
      this.drawerDataLoding = false;
    },
    changeStep(value) {
      this.RecordData.Step = parseInt(value);
      this.SelectEvaluationRecord();
    },
    handleCurrentChange2(value) {
      this.RecordData.pageIndex = value;
      this.SelectEvaluationRecord();
    },
    unfold() {
      if (this.clearfixHeight === 30) {
        this.$nextTick(() => {
          if (this.device === 'desktop') {
            this.clearfixHeight = 70;
          } else {
            this.clearfixHeight = 180;
          }
        });
      } else {
        this.clearfixHeight = 30;
      }
    },
    async DeleteEvaluationRecord(row) {
      if (
        window.userInfo[0].RoleName !== '系统管理员' &&
        row.UserName !== window.userInfo[0].UserName
      ) {
        this.$message.info('只有该条记录的审核人和管理员才能删除哦！');
        return;
      }
      this.$confirm('此操作将永久删除该条记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          DeleteEvaluationRecord({ ProblemID: row.ProblemID })
            .then(res => {
              if (res.code === 200) {
                this.SelectEvaluationRecord();
                this.SelectEvaluation();
                this.$message.success('删除成功!');
              }
            })
            .catch(error => {
              console.log(error);
              this.$message.info('删除失败');
            });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getDeptorUser(val) {
      this.EvaluationForm.UserIDs = val.toString();
    },
    resize(val) {
      this.isFullscreen = val;
    },
    UnReviewChange(val) {
      this.clickSelectEvaluation();
    }
  }
};
</script>
<style lang="scss">
.EvaluationTwo {
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

  .el-card__body {
    padding: 6px;
  }

  .el-table .warning-row {
    background: #c4c4c4;
  }

  .htmlPane {
    height: 400px;
    border: 2px solid whitesmoke;
    border-radius: 5px;
    padding: 5px;
    overflow-y: auto;
  }

  .el-card__header {
    padding: 1px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;

    .el-form-item {
      margin: 0;
      margin-left: 5px;
    }
  }

  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    // width: 40%;
    border-bottom: 1px solid #eeeeee;
  }

  .CatalogName {
    cursor: pointer !important;
    color: #3e84e9;
  }

  .CatalogName:hover {
    color: #597fb5;
  }

  .drawerFrom {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #ebeef5;
    margin-top: 25px;
    margin-left: 10px;
    // .el-form-item--mini .el-form-item__content {
    //    line-height: 0px !important;
    // }
    p {
      font-size: 30px;
      // margin-bottom: 0 !important;
    }

    i {
      cursor: pointer !important;
      font-size: 30px;
    }
  }

  .el-checkbox__input {
    z-index: 0 !important;
  }
}
</style>
