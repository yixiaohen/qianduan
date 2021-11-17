<template>
  <el-card class="send_back">
    <div slot="header" class="clearfix">
      <el-form label-position="left" :inline="true" size="mini">
<!--        <el-form-item>-->
<!--          <el-input-->
<!--            v-model="listQuery.EventName"-->
<!--            placeholder="姓名"-->
<!--            style="width: 150px"-->
<!--            size="mini"-->
<!--            clearable-->
<!--          />-->
<!--        </el-form-item>-->
        <el-form-item>
<!--          <el-button-->
<!--            type="info"-->
<!--            icon="el-icon-search"-->
<!--            :loading="listLoading"-->
<!--            size="mini"-->
<!--          >搜索-->
<!--          </el-button>-->
          <el-radio-group  v-model="eventTitle"    type="success" size="mini" @change="edChangeL(eventTitle)">
            <el-radio-button
              size="mini"
              :label="0"
            >通用事件
            </el-radio-button>

            <el-radio-button
              size="mini"
              :label="1"
            >医疗器械(不良)事件（特定）
            </el-radio-button>
            <el-radio-button
              :label="2"
            >护理安全(不良)事件（特定）
            </el-radio-button>

            <el-radio-button
              :label="3"
            >医疗安全(不良)事件（特定）
            </el-radio-button>

            <el-radio-button
              :label="4"
            >药品安全(不良)事件（特定）
            </el-radio-button>
          </el-radio-group>


        </el-form-item>
      </el-form>
    </div>
    <!--通用模板列表数据-->
    <div v-if="temNameL===0" class="main">
      <split-pane :min-percent="50" :default-percent="80" split="horizontal">
        <template slot="paneL">
          <div class="middle">
            <div class="middleBody">
              <el-table
                v-loading="listLoading"
                :data="tableData"
                height="100%"
                border
                highlight-current-row
                size="mini"
                class="middleBodyTb"
                @row-click="rowClick"
              >
                <el-table-column
                  type="index"
                  width="50"
                  label="序号"
                  align="center"
                />
                <el-table-column
                  prop="TreatmentDate"
                  label="就诊日期"
                  width="150"
                  align="center"
                >
                  <template slot-scope="{ row }">{{
                      row.TreatmentDate ? row.TreatmentDate.replace('T', ' ') : ''
                                                 }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="VictimName"
                  label="患者姓名"
                  width="95"
                  align="center"
                />
                <el-table-column
                  prop="Sex"
                  label="性别"
                  width="50"
                  align="center"
                />
                <el-table-column
                  prop="Age"
                  label="年龄"
                  width="50"
                  align="center"
                />
                <el-table-column
                  prop="Weight"
                  label="体重(KG)"
                  width="80"
                  align="center"
                />
                <el-table-column
                  prop="Phone"
                  label="联系电话"
                  width="100"
                  align="center"
                />
                <el-table-column
                  prop="TreatmentType"
                  label="就诊形式"
                  width="100"
                  align="center"
                />

                <el-table-column
                  prop="VictimType"
                  label="受损害者类型"
                  align="center"
                />
                <el-table-column
                  prop="Severity"
                  label="严重度"
                  width="70"
                  align="center"
                />
                <el-table-column
                  prop="ClinicNumber"
                  label="门诊号"
                  width="95"
                  align="center"
                />
                <!--                <el-table-column-->
                <!--                  prop="Status"-->
                <!--                  label="状态"-->
                <!--                  align="center"-->
                <!--                  width="80"-->
                <!--                />-->

                <el-table-column label="操作" align="center" width="150">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      circle
                      icon="el-icon-view"
                      @click="selectRow(scope.row)"
                    />
                    <el-button
                      size="mini"
                      circle
                      type="danger"
                      icon="el-icon-delete"
                      @click="deleteRow(scope.row)"
                    />
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                style="margin: 6px 0 0 0"
                background
                :current-page.sync="listQuery.pageIndex"
                :page-size="listQuery.pageSize"
                :page-sizes="listQuery.pageSizes"
                :total="listQuery.Total"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </div>
        </template>
        <template slot="paneR">
          <div>
            <el-alert type="info">温馨提示：回退的报告可以点击详情，保存为草稿后，重新编辑再提交。</el-alert>
            <div>
              <el-table :data="activities" border size="mini">
                <el-table-column type="index"/>
                <el-table-column
                  prop="CreateUserName"
                  label="审核人"
                  align="center"
                />
                <el-table-column
                  prop="ReviewDeptName"
                  label="所属部门"
                  align="center"
                />
                <el-table-column
                  prop="Step"
                  label="层级"
                  width="180"
                  align="center"
                />
                <el-table-column
                  prop="ReviewStatus"
                  label="审核状态"
                  width="100"
                  align="center"
                />
                <el-table-column
                  prop="CreateDate"
                  label="审核时间"
                  width="150"
                  align="center"
                >
                  <template slot-scope="{ row }">{{
                      row.CreateDate ? row.CreateDate.replace('T', ' ') : ''
                                                 }}
                  </template>
                </el-table-column>
                <el-table-column
                  label="部门审核意见"
                  width="150"
                  align="center"
                >
                  <el-button @click="dialogSelectOpinion=true" type="primary" size="mini">查看</el-button>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </template>
      </split-pane>
    </div>
    <!--医疗器械模板列表数据-->
    <div v-else-if="temNameL===1" class="main">
      <split-pane :min-percent="50" :default-percent="80" split="horizontal">
        <template slot="paneL">
          <div class="middle">
            <div class="middleBody">
              <el-table
                border
                highlight-current-row
                height="92%"
                size="mini"
                :data="reportData"
                style="width: 100%"
                stripe
                :header-cell-style="{'text-align':'center'}"
                :cell-style="{'text-align':'center'}"
                @row-click="rowClick"
              >
                <el-table-column
                  type="index"
                  width="50"
                  label="序号"
                  align="center"
                />
                <el-table-column
                  prop="ReportDate"
                  label="报告日期"
                  width="180"
                >
                  <template slot-scope="{ row }">{{
                      row.ReportDate
                        ? row.ReportDate.replace('T', ' ') : ''
                                                 }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="PatientName"
                  label="患者姓名"
                  width="180"
                />
                <el-table-column
                  prop="EventMain"
                  label="事件主要表现"
                />

                <el-table-column
                  prop="EventResult"
                  label="事件后果"
                />
                <el-table-column
                  prop="EventStatement"
                  label="事件陈述"
                />

                <el-table-column
                  prop="Operator"
                  label="操作人"
                />
                <el-table-column
                  prop="EventReason"
                  label="事件发生原因"
                />

                <el-table-column
                  prop="Treatment"
                  label="事件处理情况"
                />
                <el-table-column
                  prop="EventRSate"
                  label="事件报告状态"
                />


                <el-table-column
                  prop="ReportUser"
                  label="报告人"
                />
                <!--                <el-table-column-->
                <!--                  prop="Status"-->
                <!--                  label="状态"-->
                <!--                />-->
                <el-table-column label="操作" align="center" width="150px">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      circle
                      icon="el-icon-view"
                      @click="selectRow(scope.row)"
                    />
                    <!--                    <el-button-->
                    <!--                      size="mini"-->
                    <!--                      circle-->
                    <!--                      type="primary"-->
                    <!--                      icon="el-icon-edit"-->
                    <!--                      @click="edit(scope.row)"-->
                    <!--                    />-->

                    <el-button
                      size="mini"
                      circle
                      type="danger"
                      icon="el-icon-delete"
                      @click="deleteRow(scope.row)"
                    />
                  </template>
                </el-table-column>
              </el-table>

              <el-pagination
                style="margin: 6px 0 0 0"
                background
                :current-page.sync="listQueryYiLiao.pageIndex"
                :page-size="listQueryYiLiao.pageSize"
                :page-sizes="listQueryYiLiao.pageSizes"
                :total="listQueryYiLiao.Total"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </div>
        </template>
        <template slot="paneR">
          <div>
            <el-alert type="info">温馨提示：回退的报告可以点击详情，保存为草稿后，重新编辑再提交。</el-alert>
            <div>
              <el-table :data="activities" border size="mini">
                <el-table-column type="index"/>
                <el-table-column
                  prop="CreateUserName"
                  label="审核人"
                  align="center"
                />
                <el-table-column
                  prop="ReviewDeptName"
                  label="所属部门"
                  align="center"
                />
                <el-table-column
                  prop="Step"
                  label="层级"
                  width="180"
                  align="center"
                />
                <el-table-column
                  prop="ReviewStatus"
                  label="审核状态"
                  width="100"
                  align="center"
                />
                <el-table-column
                  prop="CreateDate"
                  label="审核时间"
                  width="150"
                  align="center"
                >
                  <template slot-scope="{ row }">{{
                      row.CreateDate ? row.CreateDate.replace('T', ' ') : ''
                                                 }}
                  </template>
                </el-table-column>
                <el-table-column
                  label="部门审核意见"
                  width="150"
                  align="center"
                >
                  <el-button @click="dialogSelectOpinion=true" type="primary" size="mini">查看</el-button>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </template>
      </split-pane>
    </div>
    <!--护理模板列表数据-->
    <div v-else-if="temNameL===2" class="main">
      <split-pane :min-percent="50" :default-percent="80" split="horizontal">
        <template slot="paneL">
          <div class="middle">
            <div class="middleBody">
              <el-table
                height="92%"
                border
                highlight-current-row
                size="mini"
                :data="reportData"
                style="width: 100%;"
                stripe
                :header-cell-style="{'text-align':'center'}"
                :cell-style="{'text-align':'center'}"
                @row-click="rowClick"
              >
                <el-table-column
                  type="index"
                  width="50"
                  label="序号"
                  align="center"
                />
                <el-table-column
                  prop="ReportDate"
                  label="报告日期"
                  width="180"
                >
                  <template slot-scope="{ row }">{{
                      row.ReportDate
                        ? row.ReportDate.replace('T', ' ')
                        : ''
                                                 }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="PatientName"
                  label="患者姓名"
                />

                <el-table-column
                  prop="Age"
                  width="50%"
                  label="年龄"
                />
                <el-table-column
                  prop="Sex"
                  width="50%"
                  label="性别"
                />
                <el-table-column
                  prop="Diagnosis"
                  label="诊断"
                />

                <el-table-column
                  prop="Process"
                  label="护理事件经过及处理后果"
                />

                <el-table-column
                  prop="CauseAnalysis"
                  label="原因分析"
                />

                <el-table-column
                  prop="Measures"
                  label="整改措施"
                />

                <el-table-column
                  prop="Opinions"
                  label="部门意见"
                />
                <el-table-column
                  prop="ReportUser"
                  label="报告护士"
                />
                <!--                <el-table-column-->
                <!--                  prop="Status"-->
                <!--                  label="状态"-->
                <!--                />-->
                <el-table-column label="操作" align="center" width="150px">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      circle
                      icon="el-icon-view"
                      @click="selectRow(scope.row)"
                    />
                    <!--                    <el-button-->
                    <!--                      size="mini"-->
                    <!--                      circle-->
                    <!--                      type="primary"-->
                    <!--                      icon="el-icon-edit"-->
                    <!--                      @click="edit(scope.row)"-->
                    <!--                    />-->

                    <el-button
                      size="mini"
                      circle
                      type="danger"
                      icon="el-icon-delete"
                      @click="deleteRow(scope.row)"
                    />
                  </template>
                </el-table-column>

              </el-table>
              <el-pagination
                style="margin: 6px 0 0 0"
                background
                :current-page.sync="listQueryHuLi.pageIndex"
                :page-size="listQueryHuLi.pageSize"
                :page-sizes="listQueryHuLi.pageSizes"
                :total="listQueryHuLi.Total"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </div>
        </template>
        <template slot="paneR">
          <div>
            <el-alert type="info">温馨提示：回退的报告可以点击详情，保存为草稿后，重新编辑再提交。</el-alert>
            <div>
              <el-table :data="activities" border size="mini">
                <el-table-column type="index"/>
                <el-table-column
                  prop="CreateUserName"
                  label="审核人"
                  align="center"
                />
                <el-table-column
                  prop="ReviewDeptName"
                  label="所属部门"
                  align="center"
                />
                <el-table-column
                  prop="Step"
                  label="层级"
                  width="180"
                  align="center"
                />
                <el-table-column
                  prop="ReviewStatus"
                  label="审核状态"
                  width="100"
                  align="center"
                />
                <el-table-column
                  prop="CreateDate"
                  label="审核时间"
                  width="150"
                  align="center"
                >
                  <template slot-scope="{ row }">{{
                      row.CreateDate ? row.CreateDate.replace('T', ' ') : ''
                                                 }}
                  </template>
                </el-table-column>
                <el-table-column
                  label="部门审核意见"
                  width="150"
                  align="center"
                >
                  <el-button @click="dialogSelectOpinion=true" type="primary" size="mini">查看</el-button>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </template>
      </split-pane>
    </div>
    <!--医疗安全模板列表数据-->
    <div v-else-if="temNameL===3" class="main">
      <split-pane :min-percent="50" :default-percent="80" split="horizontal">
        <template slot="paneL">
          <div class="middle">
            <div class="middleBody">
              <el-table
                border
                highlight-current-row
                height="92%"
                size="mini"
                :data="reportData"
                style="width: 100%"
                stripe
                :header-cell-style="{'text-align':'center'}"
                :cell-style="{'text-align':'center'}"
                @row-click="rowClick"
              >
                <el-table-column
                  type="index"
                  width="50"
                  label="序号"
                  align="center"
                />
                <el-table-column
                  prop="ReportDate"
                  label="报告日期"
                  width="180"
                >
                  <template slot-scope="{ row }">{{
                      row.ReportDate
                        ? row.ReportDate.replace('T', ' ')
                        : ''
                                                 }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="PatientName"
                  label="患者姓名"
                  width="180"
                />
                <el-table-column
                  prop="Place"
                  label="事情发生场所"
                />
                <el-table-column
                  prop="Process"
                  label="事情经过"
                />

                <el-table-column
                  prop="EventCategory"
                  label="不良事件类别"
                />
                <el-table-column
                  prop="EventDegree"
                  label="不良事件的等级"
                />

                <el-table-column
                  prop="Causes"
                  label="导致事件的原因"
                />
                <el-table-column
                  prop="Handle"
                  label="事件处理情况"
                />
                <el-table-column
                  prop="Evaluate"
                  label="不良事件评价"
                />

                <el-table-column
                  prop="ReportUser"
                  label="报告人"
                />
                <!--                <el-table-column-->
                <!--                  prop="Status"-->
                <!--                  label="状态"-->
                <!--                />-->
                <el-table-column label="操作" align="center" width="150px">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      circle
                      icon="el-icon-view"
                      @click="selectRow(scope.row)"
                    />
                    <!--                    <el-button-->
                    <!--                      size="mini"-->
                    <!--                      circle-->
                    <!--                      type="primary"-->
                    <!--                      icon="el-icon-edit"-->
                    <!--                      @click="edit(scope.row)"-->
                    <!--                    />-->

                    <el-button
                      size="mini"
                      circle
                      type="danger"
                      icon="el-icon-delete"
                      @click="deleteRow(scope.row)"
                    />
                  </template>
                </el-table-column>
              </el-table>

              <el-pagination
                style="margin: 6px 0 0 0"
                background
                :current-page.sync="listQueryYiLiaoAnQuan.pageIndex"
                :page-size="listQueryYiLiaoAnQuan.pageSize"
                :page-sizes="listQueryYiLiaoAnQuan.pageSizes"
                :total="listQueryYiLiaoAnQuan.Total"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </div>
        </template>
        <template slot="paneR">
          <div>
            <el-alert type="info">温馨提示：回退的报告可以点击详情，保存为草稿后，重新编辑再提交。</el-alert>
            <div>
              <el-table :data="activities" border size="mini">
                <el-table-column type="index"/>
                <el-table-column
                  prop="CreateUserName"
                  label="审核人"
                  align="center"
                />
                <el-table-column
                  prop="ReviewDeptName"
                  label="所属部门"
                  align="center"
                />
                <el-table-column
                  prop="Step"
                  label="层级"
                  width="180"
                  align="center"
                />
                <el-table-column
                  prop="ReviewStatus"
                  label="审核状态"
                  width="100"
                  align="center"
                />
                <el-table-column
                  prop="CreateDate"
                  label="审核时间"
                  width="150"
                  align="center"
                >
                  <template slot-scope="{ row }">{{
                      row.CreateDate ? row.CreateDate.replace('T', ' ') : ''
                                                 }}
                  </template>
                </el-table-column>
                <el-table-column
                  label="部门审核意见"
                  width="150"
                  align="center"
                >
                  <el-button @click="dialogSelectOpinion=true" type="primary" size="mini">查看</el-button>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </template>
      </split-pane>
    </div>
    <!--药品安全模板列表数据-->
    <div v-else-if="temNameL===4" class="main">
      <split-pane :min-percent="50" :default-percent="80" split="horizontal">
        <template slot="paneL">
          <div class="middle">
            <div class="middleBody">
              <el-table
                height="92%"
                border
                highlight-current-row
                size="mini"
                :data="reportData"
                style="width: 100%"
                stripe
                :header-cell-style="{'text-align':'center'}"
                :cell-style="{'text-align':'center'}"
                @row-click="rowClick"
              >
                <el-table-column
                  type="index"
                  width="50"
                  label="序号"
                  align="center"
                />
                <el-table-column
                  prop="ReportDate"
                  label="报告日期"
                >
                  <template slot-scope="{ row }">{{
                      row.ReportDate
                        ? row.ReportDate.replace('T', ' ')
                        : ''
                                                 }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="PatientName"
                  label="患者姓名"
                />

                <el-table-column
                  prop="Sex"
                  label="性别"
                  width="50%"
                />

                <el-table-column
                  prop="Age"
                  label="年龄"
                  width="50%"
                />

                <el-table-column
                  prop="Degree"
                  label="严重程度"
                />
                <el-table-column
                  prop="Sickness"
                  label="原患疾病"
                />
                <el-table-column
                  prop="Influence"
                  label="对原患疾病的影响"
                />
                <el-table-column
                  prop="ReactionName"
                  label="不良反应/事件名称"
                />

                <el-table-column
                  prop="ReactionResult"
                  label="不良反应/事件的结果"
                />


                <!--                <el-table-column-->
                <!--                  prop="Influence"-->
                <!--                  label="对原患疾病的影响"-->
                <!--                >-->
                <!--                </el-table-column>-->

                <el-table-column
                  prop="ReportUser"
                  label="报告人"
                />
                <!--                <el-table-column-->
                <!--                  prop="Status"-->
                <!--                  label="状态"-->
                <!--                />-->

                <el-table-column label="操作" align="center" width="150px">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      circle
                      icon="el-icon-view"
                      @click="selectRow(scope.row)"
                    />
                    <!--                    <el-button-->
                    <!--                      size="mini"-->
                    <!--                      circle-->
                    <!--                      type="primary"-->
                    <!--                      icon="el-icon-edit"-->
                    <!--                      @click="edit(scope.row)"-->
                    <!--                    />-->

                    <el-button
                      size="mini"
                      circle
                      type="danger"
                      icon="el-icon-delete"
                      @click="deleteRow(scope.row)"
                    />
                  </template>
                </el-table-column>


              </el-table>
              <el-pagination
                style="margin: 6px 0 0 0"
                background
                :current-page.sync="listQueryYaoPin.pageIndex"
                :page-size="listQueryYaoPin.pageSize"
                :page-sizes="listQueryYaoPin.pageSizes"
                :total="listQueryYaoPin.Total"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </div>
        </template>
        <template slot="paneR">
          <div>
            <el-alert type="info">温馨提示：回退的报告可以点击详情，保存为草稿后，重新编辑再提交。</el-alert>
            <div>
              <el-table :data="activities" border size="mini">
                <el-table-column type="index"/>
                <el-table-column
                  prop="CreateUserName"
                  label="审核人"
                  align="center"
                />
                <el-table-column
                  prop="ReviewDeptName"
                  label="所属部门"
                  align="center"
                />
                <el-table-column
                  prop="Step"
                  label="层级"
                  width="180"
                  align="center"
                />
                <el-table-column
                  prop="ReviewStatus"
                  label="审核状态"
                  width="100"
                  align="center"
                />
                <el-table-column
                  prop="CreateDate"
                  label="审核时间"
                  width="150"
                  align="center"
                >
                  <template slot-scope="{ row }">{{
                      row.CreateDate ? row.CreateDate.replace('T', ' ') : ''
                                                 }}
                  </template>
                </el-table-column>
                <el-table-column
                  label="部门审核意见"
                  width="150"
                  align="center"
                >
                  <el-button @click="dialogSelectOpinion=true" type="primary" size="mini">查看</el-button>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </template>

      </split-pane>
    </div>
    <el-dialog
      title="查看详情"
      :visible.sync="dialogTableVisible"
      width="30%"
      center
    >
      <el-form label-position="right" label-width="80px" :model="formData">
        <el-form-item label="姓名">
          <el-input v-model="formData.VictimName"/>
        </el-form-item>
        <el-form-item label="性别">
          <el-input v-model="formData.Sex"/>
        </el-form-item>
        <el-form-item label="出生日期">
          <el-input v-model="formData.Birthday"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="dialogTableVisible = false"
        >确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="查询反馈意见"
      :visible.sync="dialogSelectOpinion"
      width="60%"
    >
      <el-table :data="OpinionData.SelctOpinionContent" style="width: 100%">
        <el-table-column prop="CreateUserName" label="提出者"/>
        <el-table-column prop="CreateDate" label="提交时间" width="160"/>
        <el-table-column prop="OpinionContent" label="意见"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogSelectOpinion = false">取 消</el-button>
        <el-button
          type="primary"
          @click="dialogSelectOpinion = false"
        >确定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import { DeleteReport, SelectHandleReport1, SelectOpinion, SelectReview } from '@/api/AE_Event';
import splitPane from 'vue-splitpane';

export default {
  name: 'AdverseEventsMine',
  components: { splitPane },
  data() {
    return {
      eventTitle: 0,// 默认展示的报告页面，
      EventReportID: 0,
      dialogSelectOpinion: false, // 查询反馈意见对话框
      /* 反馈意见 */
      OpinionData: {
        ReviewID: '',
        OpinionContent: '',
        SelctOpinionContent: '',
        CreateUserID: window.userInfo[0].UserID
      },
      temNameL: 0,
      reportData: [], // 固定模板数据
      listQueryYiLiao: {
        pageIndex: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100, 150, 200],
        Total: 0,
        IsDraft: 0,
        DeptID: window.userInfo[0].DeptID,
        UserID: window.userInfo[0].UserID,
        ReviewStatus: '回退',
        type: 1 // 1表示查询医疗器械模板
      },
      listQueryHuLi: {
        pageIndex: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100, 150, 200],
        Total: 0,
        IsDraft: 0,
        DeptID: window.userInfo[0].DeptID,
        UserID: window.userInfo[0].UserID,
        ReviewStatus: '回退',
        type: 2 // 2表示查询护理不良模板 window.userInfo[0].DeptID
      },
      listQueryYiLiaoAnQuan: {
        pageIndex: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100, 150, 200],
        Total: 0,
        IsDraft: 0,
        EventReportID: 0,
        DeptID: window.userInfo[0].DeptID,
        UserID: window.userInfo[0].UserID,
        ReviewStatus: '回退',
        type: 3 // 3表示查询医疗安全模板
      },
      listQueryYaoPin: {
        pageIndex: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100, 150, 200],
        Total: 0,
        IsDraft: 0,
        DeptID: window.userInfo[0].DeptID,
        UserID: window.userInfo[0].UserID,
        ReviewStatus: '回退',
        type: 4 // 4表示查询药品安全模板
      },
      typeNum: 0,
      listLoading: false,
      listQuery: {
        UserID: window.userInfo[0].UserID,
        DeptID: window.userInfo[0].DeptID,
        ReviewStatus: '回退',
        pageIndex: 1,
        Total: 0,
        IsDraft: 0,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100, 150, 200],
        type: 0
      },
      tableData: [],
      activities: [],
      dialogTableVisible: false,
      formData: {}
    };
  },
  created() {
    if (this.$route.query.temNameSend_back) { // 从被退回报告查看详情点进去后，返回按钮回原来的事件类，传一个标识，判断要显示哪类表
      this.temNameL = this.$route.query.temNameSend_back;
      this.eventTitle = this.$route.query.temNameSend_back;
    }
    // 要显示哪类表，加获取哪类表的数据
    if (this.temNameL === 0) {
      this.SelectHandleReport();
    } else if (this.temNameL === 1) {
      this.SelectReportqixie();
    } else if (this.temNameL === 2) {
      this.SelectReportHuli();
    } else if (this.temNameL === 3) {
      this.SelectReportAnQuan();
    } else if (this.temNameL === 4) {
      this.SelectReportYaoPin();
    }
  },
  methods: {
    edChangeL(val) {
      if (val === 0) {
        this.activities = [];
        this.SelectHandleReport();
        this.temNameL = 0;
      } else if (val === 1) {
        this.activities = [];
        this.SelectReportqixie();
        this.temNameL = 1;
      } else if (val === 2) {
        this.activities = [];
        this.SelectReportHuli();
        this.temNameL = 2;
      } else if (val === 3) {
        this.activities = [];
        this.SelectReportAnQuan();
        this.temNameL = 3;
      } else if (val === 4) {
        this.activities = [];
        this.SelectReportYaoPin();
        this.temNameL = 4;
      }
    },
    async SelectHandleReport() {
      this.listLoading = true;
      try {
        this.typeNum = 0; // 此时可以用0表示当前显示的是通用全表
        const { data } = await SelectHandleReport1(this.listQuery);
        this.listQuery.Total = data.Total;
        this.tableData = data.DataList;
        console.log('现在', data);
        this.$nextTick(() => {
          this.rowClick(data.DataList[0]);
        });
      } catch (error) {
        this.$message({ type: 'error', message: error });
      } finally {
        this.listLoading = false;
      }
    },
    async SelectReportqixie() {
      this.listLoading = true;
      try {
        this.typeNum = 1; // 此时可以用1表示当前显示的是医疗器械安全表
        const { data, code } = await SelectHandleReport1(this.listQueryYiLiao);
        if (code === 200) {
          // 为了使得报告日期把T去掉，获取数据前进行筛选
          data.DataList.map(item => {
            if (item.ReportDate !== null) {
              item.ReportDate = item.ReportDate.replace('T', ' ');
            }
          });
          this.listQueryYiLiao.Total = data.Total;
          this.reportData = data.DataList;
          await this.rowClick(data.DataList[0]);
        }
      } catch (error) {
        this.$message({ type: 'error', message: error });
      } finally {
        this.listLoading = false;
      }
    },
    async SelectReportHuli() {
      this.listLoading = true;
      try {
        this.typeNum = 2; // 此时可以用2表示当前显示的是护理安全表
        const { data, code } = await SelectHandleReport1(this.listQueryHuLi);
        if (code === 200) {
          // 为了使得报告日期把T去掉，获取数据前进行筛选
          data.DataList.map(item => {
            if (item.ReportDate !== null) {
              item.ReportDate = item.ReportDate.replace('T', ' ');
            }
          });
          this.listQueryHuLi.Total = data.Total;
          this.reportData = data.DataList;
          await this.rowClick(data.DataList[0]);
        }
      } catch (error) {
        this.$message({ type: 'error', message: error });
      } finally {
        this.listLoading = false;
      }
    },
    async SelectReportAnQuan() {
      this.listLoading = true;
      try {
        this.typeNum = 3; // 此时可以用3表示当前显示的是医疗安全表
        const { data, code } = await SelectHandleReport1(this.listQueryYiLiaoAnQuan);
        if (code === 200) {
          // 为了使得报告日期把T去掉，获取数据前进行筛选
          data.DataList.map(item => {
            if (item.ReportDate !== null) {
              item.ReportDate = item.ReportDate.replace('T', ' ');
            }
          });
          this.listQueryYiLiaoAnQuan.Total = data.Total;
          this.reportData = data.DataList;
          await this.rowClick(data.DataList[0]);
        }
      } catch (error) {
        this.$message({ type: 'error', message: error });
      } finally {
        this.listLoading = false;
      }
    },
    async SelectReportYaoPin() {
      this.listLoading = true;
      try {
        this.typeNum = 4; // 此时可以用4表示当前显示的是药品安全表
        const { data, code } = await SelectHandleReport1(this.listQueryYaoPin);
        if (code === 200) {
          // 为了使得报告日期把T去掉，获取数据前进行筛选
          data.DataList.map(item => {
            if (item.ReportDate !== null) {
              item.ReportDate = item.ReportDate.replace('T', ' ');
            }
          });
          this.listQueryYaoPin.Total = data.Total;
          this.reportData = data.DataList;
          await this.rowClick(data.DataList[0]);
        }
      } catch (error) {
        this.$message({ type: 'error', message: error });
      } finally {
        this.listLoading = false;
      }
    },



    // 每页条数,加上通用事件一共五钟情况，0为通用事件分页
    handleSizeChange(page) {
      if (this.temNameL === 0) {
        this.listQuery.pageSize = page;
      } else if (this.temNameL === 1) {
        this.listQueryYiLiao.pageSize = page;
      } else if (this.temNameL === 2) {
        this.listQueryHuLi.pageSize = page;
      } else if (this.temNameL === 3) {
        this.listQueryYiLiaoAnQuan.pageSize = page;
      } else if (this.temNameL === 4) {
        this.listQueryYaoPin.pageSize = page;
      }
      this.clickSelectReport(this.temNameL);
    },

    // 当前页
    handleCurrentChange(index) {
      if (this.temNameL === 0) {
        this.listQuery.pageIndex = index;
        this.SelectReport();
      } else if (this.temNameL === 1) {
        this.listQueryYiLiao.index = index;
        this.SelectReportqixie();
      } else if (this.temNameL === 2) {
        this.listQueryHuLi.pageIndex = index;
        this.SelectReportHuli();
      } else if (this.temNameL === 3) {
        this.listQueryYiLiaoAnQuan.pageIndex = index;
        this.SelectReportAnQuan();
      } else if (this.temNameL === 4) {
        this.listQueryYaoPin.pageIndex = index;
        this.SelectReportYaoPin();
      }
    },

    // 改变分页视图
    clickSelectReport(temNameL) {
      this.pagination.pageIndex = 1;
      this.listQuery.pageIndex = 1;
      if (temNameL === 0) {
        this.SelectReport();
      } else if (temNameL === 1) {
        this.SelectReportqixie();
      } else if (temNameL === 2) {
        this.SelectReportHuli();
      } else if (temNameL === 3) {
        this.SelectReportAnQuan();
      } else if (temNameL === 4) {
        this.SelectReportYaoPin();
      }
    },

    async deleteRow(row) {
      this.$confirm('此操作将永久删除该不良事件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          DeleteReport({ EventReportID: row.EventReportID || 0 }).then((data) => {
            if (data.code === 200) {
              this.$message.success('删除成功!');
              this.SelectHandleReport();
            }
          });
        })
        .catch(() => {
        });
    },
    async rowClick(row) {
      const val = {
        EventReportID: row.EventReportID || 0,
        UserID: window.userInfo[0].UserID,
        DeptID: window.userInfo[0].DeptID,
        ReviewStatus: '回退',
        type: this.temNameL
      };
      const data = await SelectReview(val);
      this.activities = data.data;
      // 下面是新增的查询反馈意见
      // 先把当前选中条目的id获取到
      this.OpinionData.ReviewID = this.activities[0].ReviewID;
      // 查询反馈的意见
      const yiJian = await SelectOpinion(this.OpinionData);
      // 获取得到反馈意见的数据放进this.OpinionData.SelctOpinionContent里
      yiJian.data.map((item, index) => {
        item.CreateDate = item.CreateDate.replace('T', ' ');
      });
      this.OpinionData.SelctOpinionContent = yiJian.data;
    },
    edit(row) {
      this.formData = row;
      console.log(row);
      this.dialogTableVisible = true;
    },
    selectRow(row) {
      this.$router.push({
        name: 'AdverseEventsReport',
        params: { id: row.EventReportID || 0, sendBackType: this.temNameL, biaoshi: 4, x: 3 } // x 为点击返回按钮跳回的页面
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.send_back {
  margin: 4px;
  overflow: hidden;
  height: calc(100vh - 96px);

  .el-card__body {
    padding: 5px;
  }

  .main {
    widows: 100%;
    height: calc(100vh - 165px);

    overflow: auto;

    .middle {
      height: 100%;

      .middleBody {
        height: 100%;
        overflow-y: hidden;

        .middleBodyTb {
          // height: calc(100% - 37px);
          max-height: calc(100% - 37px);
        }
      }
    }
  }
}
</style>
