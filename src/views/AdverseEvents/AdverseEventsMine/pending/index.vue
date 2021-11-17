<template>
  <el-card class="box-card-view">
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
                  label="就趁形式"
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
                  width="120"
                  align="center"
                />
                <el-table-column
                  prop="Status"
                  label="状态"
                  align="center"
                  width="80"
                />

                <el-table-column label="操作" align="center" width="100">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      circle
                      icon="el-icon-view"
                      @click="selectRow(scope.row)"
                    />
                    <!--     <el-button
                      size="mini"
                      circle
                      type="primary"
                      icon="el-icon-edit"
                      @click="edit(scope.row)"
                    /> -->

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
                :total="listQuery.total"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </div>
        </template>
        <template slot="paneR">
          <div>
            <div>
              <el-table :data="activities" border size="mini">
                <el-table-column label="序号" align="center" type="index"/>
                <!-- <el-table-column
                  prop="CreateUserName"
                  label="审核人"
                  width="150"
                  align="center"
                /> -->
                <el-table-column
                  prop="VictimName"
                  label="患者姓名"
                  align="center"
                  width="150"
                />
                <el-table-column
                  prop="ReviewDeptName"
                  label="负责审核的部门"
                  align="center"
                  width="150"
                />
                <el-table-column
                  prop="Step"
                  label="层级"
                  width="60"
                  align="center"
                />
                <el-table-column
                  prop="ReviewStatus"
                  label="审核状态"
                  width="80"
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
                <el-table-column label="操作" align="center">
                  <template slot-scope="{ row }">
                    <el-link
                      icon="el-icon-edit"
                      class="item"
                      @click="UpdateDeptID(row, 1)"
                    >事件改派
                    </el-link>
                    <el-link
                      icon="el-icon-edit"
                      class="item"
                      @click="UpdateDeptID(row, 2)"
                    >事件协助
                    </el-link>
                    <el-link
                      icon="el-icon-plus"
                      class="item"
                      @click="newProcess(row, 3)"
                    >新增流程
                    </el-link>
                    <el-link
                      icon="el-icon-user"
                      class="item"
                      @click="UpdateStatus(row)"
                    >审核
                    </el-link>

                    <el-link
                      icon="el-icon-edit"
                      class="item"
                      @click="Opinion(row)"
                    >审核意见
                    </el-link>
                    <el-link
                      icon="el-icon-view"
                      class="item"
                      @click="SelectOpinion(row)"
                    >查询审核意见
                    </el-link>
                  </template>
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
                <el-table-column
                  prop="Status"
                  label="审核状态"
                />
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
            <div>
              <el-table :data="activities" border size="mini">
                <el-table-column label="序号" align="center" type="index"/>
                <el-table-column
                  prop="VictimName"
                  label="患者姓名"
                  align="center"
                  width="150"
                />
                <el-table-column
                  prop="ReviewDeptName"
                  label="负责审核的部门"
                  align="center"
                  width="150"
                />
                <el-table-column
                  prop="Step"
                  label="层级"
                  width="60"
                  align="center"
                />
                <el-table-column
                  prop="ReviewStatus"
                  label="审核状态"
                  width="80"
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
                <el-table-column label="操作" align="center">
                  <template slot-scope="{ row }">
                    <el-link
                      icon="el-icon-edit"
                      class="item"
                      @click="UpdateDeptID(row, 1)"
                    >事件改派
                    </el-link>
                    <el-link
                      icon="el-icon-edit"
                      class="item"
                      @click="UpdateDeptID(row, 2)"
                    >事件协助
                    </el-link>
                    <el-link
                      icon="el-icon-plus"
                      class="item"
                      @click="newProcess(row, 3)"
                    >新增流程
                    </el-link>
                    <el-link
                      icon="el-icon-user"
                      class="item"
                      @click="UpdateStatus(row)"
                    >审核
                    </el-link>

                    <el-link
                      icon="el-icon-edit"
                      class="item"
                      @click="Opinion(row)"
                    >审核意见
                    </el-link>
                    <el-link
                      icon="el-icon-view"
                      class="item"
                      @click="SelectOpinion(row)"
                    >查询审核意见
                    </el-link>
                  </template>
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
                <el-table-column
                  prop="Status"
                  label="审核状态"
                />
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
            <div>
              <el-table :data="activities" border size="mini">
                <el-table-column label="序号" align="center" type="index"/>
                <el-table-column
                  prop="VictimName"
                  label="患者姓名"
                  align="center"
                  width="150"
                />
                <el-table-column
                  prop="ReviewDeptName"
                  label="负责审核的部门"
                  align="center"
                  width="150"
                />
                <el-table-column
                  prop="Step"
                  label="层级"
                  width="60"
                  align="center"
                />
                <el-table-column
                  prop="ReviewStatus"
                  label="审核状态"
                  width="80"
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
                <el-table-column label="操作" align="center">
                  <template slot-scope="{ row }">
                    <el-link
                      icon="el-icon-edit"
                      class="item"
                      @click="UpdateDeptID(row, 1)"
                    >事件改派
                    </el-link>
                    <el-link
                      icon="el-icon-edit"
                      class="item"
                      @click="UpdateDeptID(row, 2)"
                    >事件协助
                    </el-link>
                    <el-link
                      icon="el-icon-plus"
                      class="item"
                      @click="newProcess(row, 3)"
                    >新增流程
                    </el-link>
                    <el-link
                      icon="el-icon-user"
                      class="item"
                      @click="UpdateStatus(row)"
                    >审核
                    </el-link>

                    <el-link
                      icon="el-icon-edit"
                      class="item"
                      @click="Opinion(row)"
                    >审核意见
                    </el-link>
                    <el-link
                      icon="el-icon-view"
                      class="item"
                      @click="SelectOpinion(row)"
                    >查询审核意见
                    </el-link>
                  </template>
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
                <el-table-column
                  prop="Status"
                  label="审核状态"
                />
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
            <div>
              <el-table :data="activities" border size="mini">
                <el-table-column label="序号" align="center" type="index"/>
                <el-table-column
                  prop="VictimName"
                  label="患者姓名"
                  align="center"
                  width="150"
                />
                <el-table-column
                  prop="ReviewDeptName"
                  label="负责审核的部门"
                  align="center"
                  width="150"
                />
                <el-table-column
                  prop="Step"
                  label="层级"
                  width="60"
                  align="center"
                />
                <el-table-column
                  prop="ReviewStatus"
                  label="审核状态"
                  width="80"
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
                <el-table-column label="操作" align="center">
                  <template slot-scope="{ row }">
                    <el-link
                      icon="el-icon-edit"
                      class="item"
                      @click="UpdateDeptID(row, 1)"
                    >事件改派
                    </el-link>
                    <el-link
                      icon="el-icon-edit"
                      class="item"
                      @click="UpdateDeptID(row, 2)"
                    >事件协助
                    </el-link>
                    <el-link
                      icon="el-icon-plus"
                      class="item"
                      @click="newProcess(row, 3)"
                    >新增流程
                    </el-link>
                    <el-link
                      icon="el-icon-user"
                      class="item"
                      @click="UpdateStatus(row)"
                    >审核
                    </el-link>

                    <el-link
                      icon="el-icon-edit"
                      class="item"
                      @click="Opinion(row)"
                    >审核意见
                    </el-link>
                    <el-link
                      icon="el-icon-view"
                      class="item"
                      @click="SelectOpinion(row)"
                    >查询审核意见
                    </el-link>
                  </template>
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
                <el-table-column
                  prop="Status"
                  label="审核状态"
                />

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
            <div>
              <el-table :data="activities" border size="mini">
                <el-table-column label="序号" align="center" type="index"/>
                <el-table-column
                  prop="VictimName"
                  label="患者姓名"
                  align="center"
                  width="150"
                />
                <el-table-column
                  prop="ReviewDeptName"
                  label="负责审核的部门"
                  align="center"
                  width="150"
                />
                <el-table-column
                  prop="Step"
                  label="层级"
                  width="60"
                  align="center"
                />
                <el-table-column
                  prop="ReviewStatus"
                  label="审核状态"
                  width="80"
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
                <el-table-column label="操作" align="center">
                  <template slot-scope="{ row }">
                    <el-link
                      icon="el-icon-edit"
                      class="item"
                      @click="UpdateDeptID(row, 1)"
                    >事件改派
                    </el-link>
                    <el-link
                      icon="el-icon-edit"
                      class="item"
                      @click="UpdateDeptID(row, 2)"
                    >事件协助
                    </el-link>
                    <el-link
                      icon="el-icon-plus"
                      class="item"
                      @click="newProcess(row, 3)"
                    >新增流程
                    </el-link>
                    <el-link
                      icon="el-icon-user"
                      class="item"
                      @click="UpdateStatus(row)"
                    >审核
                    </el-link>

                    <el-link
                      icon="el-icon-edit"
                      class="item"
                      @click="Opinion(row)"
                    >审核意见
                    </el-link>
                    <el-link
                      icon="el-icon-view"
                      class="item"
                      @click="SelectOpinion(row)"
                    >查询审核意见
                    </el-link>
                  </template>
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
      :width="device === 'desktop' ? '40%' : '90%'"
      center
    >
      <table
        width="100%"
        border="1"
        cellspacing="0"
        cellpadding="20"
        align="center"
      >
        <tr>
          <td align="left" colspan="2" height="25">
            姓名：{{ formData.VictimName }}
          </td>
          <td align="left" colspan="2" height="25">性别：{{ formData.Sex }}</td>
          <td align="left" colspan="2" height="25">
            出生日期：{{
              formData.Birthday ? formData.Birthday.replace('T', ' ') : ''
            }}
          </td>
          <td align="left" colspan="2" height="25">
            体重：{{ formData.Weight }}KG
          </td>
        </tr>
        <tr>
          <td align="left" colspan="2" height="25">
            电话：{{ formData.Phone }}
          </td>
          <td align="left" colspan="4" height="25">
            就趁日期：{{
              formData.TreatmentDate
                ? formData.TreatmentDate.replace('T', ' ')
                : ''
            }}
          </td>
          <td align="left" colspan="4" height="25">
            严重度：{{ formData.Severity }}
          </td>
        </tr>
        <tr>
          <td align="left" colspan="2" height="25">
            门诊号：{{ formData.ClinicNumber }}
          </td>
          <td align="left" colspan="4" height="25">
            受损害者类型：{{ formData.VictimType }}
          </td>
          <td align="left" colspan="2" height="25">
            状态：{{ formData.Status }}
          </td>
        </tr>
      </table>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="small"
          @click="dialogTableVisible = false"
        >取 消</el-button>
        <el-button
          type="primary"
          size="small"
          @click="dialogTableVisible = false"
        >确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改负责审核的部门"
      :visible.sync="dialogUpdateDeptID"
      :width="device === 'desktop' ? '30%' : '90%'"
    >
      <defaultDepts
        v-model="EventReassignVal.ReviewDeptID"
        :multiple="false"
        @getDefaultDeptsValue="getDefaultDeptsValue"
      />

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogUpdateDeptID = false">取 消</el-button>
        <el-button type="primary" @click="ReassignAssist(1)">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="事件协助"
      :visible.sync="dialogUpdateDeptID2"
      :width="device === 'desktop' ? '30%' : '90%'"
    >
      <defaultDepts
        v-model="EventReassignVal.OpinionDeptID"
        :multiple="true"
        @getDefaultDeptsValue="getDefaultDeptsValue2"
      />

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogUpdateDeptID2 = false">取 消</el-button>
        <el-button type="primary" @click="ReassignAssist(2)">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="审核"
      :visible.sync="dialogReview"
      :width="device === 'desktop' ? '30%' : '90%'"
    >
      <el-select v-model="UpdateReviewData.ReviewStatus" placeholder="请选择">
        <el-option label="待审核" value="待审核"/>
        <el-option label="通过" value="已完成"/>
        <el-option label="回退" value="回退"/>
      </el-select>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogReview = false">取 消</el-button>
        <el-button type="primary" @click="UpdateReviewStatus">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="新增负责审核的部门流程"
      :visible.sync="dialogInsertReviewStep"
      :width="device === 'desktop' ? '30%' : '90%'"
    >
      <defaultDepts
        v-model="InsertReviewStepData.OpinionDeptID"
        :multiple="true"
        @getDefaultDeptsValue="getDefaultDeptsValue3"
      />

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogInsertReviewStep = false">取 消</el-button>
        <el-button type="primary" @click="InsertReviewStep">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="审核"
      :visible.sync="dialogOpinion"
      :width="device === 'desktop' ? '30%' : '90%'"
    >
      <div><span>审核意见：</span></div>
      <br>
      <el-input
        v-model="OpinionData.OpinionContent"
        type="textarea"
        :rows="2"
        placeholder="请输入内容(建议200字以内)"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogOpinion = false" size="mini">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="InsertOpinion" size="mini">提交</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="查询审核意见"
      :visible.sync="dialogSelectOpinion"
      :width="device === 'desktop' ? '50%' : '90%'"
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
import {
  DeleteReport,
  DeleteReport1,
  EventAssist,
  EventReassign,
  InsertOpinion,
  InsertOrUpdateReportHuli,
  InsertReviewStep,
  SelectHandleReport1,
  SelectOpinion,
  SelectReportByID1,
  SelectReportFile,
  SelectReview,
  UpdateReviewStatus
} from '@/api/AE_Event';
import splitPane from 'vue-splitpane';
import { mapGetters } from 'vuex';
import defaultDepts from '@/views/components/defaultDepts';

export default {
  name: 'AdverseEventsMine',
  components: {
    splitPane,
    defaultDepts
  },
  data() {
    return {
      eventTitle: 0,// 默认展示的报告页面，
      // UpdateStatusRow: null, // 进行选中所要审核的条目的数据
      btnLoading: false, // 按钮等待圈
      yiJian: {},
      fuJian: [],
      DeptIDNew: 0,
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
        ReviewStatus: '待审核',
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
        ReviewStatus: '待审核',
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
        ReviewStatus: '待审核',
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
        ReviewStatus: '待审核',
        type: 4 // 4表示查询药品安全模板
      },
      typeNum: 0,
      listLoading: false,
      pagination: {
        pageIndex: 1,
        total: 0,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100, 150, 200]
      },
      listQuery: {
        UserID: window.userInfo[0].UserID,
        DeptID: window.userInfo[0].DeptID,
        ReviewStatus: '待审核',
        pageIndex: 1,
        total: 0,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100, 150, 200],
        type: 0 // 0表示查询通用模板
      },
      tableData: [],
      activities: [],
      dialogTableVisible: false,
      dialogUpdateDeptID: false,
      dialogUpdateDeptID2: false,
      dialogInsertReviewStep: false,
      dialogReview: false,
      dialogOpinion: false,
      dialogSelectOpinion: false,
      formData: {},
      EventReassignVal: {
        DeptID: 0,
        FollowID: 0,
        ReviewDeptID: 0,
        OpinionDeptID: 0,
        CreateUserID: window.userInfo[0].UserID
      },
      SelectReviewVal: '',
      multiple: false, // 是否多选
      /* 审核状态 */
      UpdateReviewData: {
        ReviewID: '',
        ReviewStatus: '',
        CreateUserID: window.userInfo[0].UserID,
        Type: 0
      },
      /* 增加流程 */
      InsertReviewStepData: {
        ReviewID: '',
        OpinionDeptID: '',
        CreateUserID: window.userInfo[0].UserID,
        Type: 0
      },
      /* 审核意见 */
      OpinionData: {
        ReviewID: '',
        OpinionContent: '',
        SelctOpinionContent: '',
        CreateUserID: window.userInfo[0].UserID
      },
      VictimNameS: ''

    };
  },
  created() {
    if (this.$route.query.temNamePending) { // 从待处理报告查看详情点进去后，返回按钮回原来的事件类，传一个标识，判断要显示哪类表
      this.temNameL = this.$route.query.temNamePending;
      this.eventTitle = this.$route.query.temNamePending;
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
    // this.num();
  },
  computed: {
    ...mapGetters(['device'])
  },
  methods: {
    num() {
      this.typeNum = 0;
      this.temNameL = 0;
    },
    edChangeL(val) {
      if (val === 0) {
        this.SelectHandleReport();
        this.activities = [];
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
        this.typeNum = 0; // 此时可以用0表示当前显示的是通用表
        const { data } = await SelectHandleReport1(this.listQuery);
        this.listQuery.total = data.Total;
        this.tableData = data.DataList;
        if (data.DataList[0] !== '') { // 为了使没有数据时，审核栏没有，不报错
          this.rowClick(data.DataList[0]);
        }

        // this.temNameL = 0;
      } catch (error) {
        this.$message({ type: 'error', message: error });
      } finally {
        this.listLoading = false;
      }
    },
    async SelectReportqixie() {
      this.listLoading = true;
      try {
        this.typeNum = 1; // 此时可以用4表示当前显示的是医疗器械安全表
        const { data, code } = await SelectHandleReport1(this.listQueryYiLiao);
        if (code === 200) {
          this.listQueryYiLiao.Total = data.Total;
          // 为了使得报告日期把T去掉，获取数据前进行筛选
          data.DataList.map(item => {
            if (item.ReportDate !== null) {
              item.ReportDate = item.ReportDate.replace('T', ' ');
            }
          });
          this.reportData = data.DataList;
          console.log('看下', this.reportData);
          if (data.DataList[0] !== '') {
            this.rowClick(data.DataList[0]);
          }
          // this.temNameL = 1;
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
          if (data.DataList[0] !== '') {
            this.rowClick(data.DataList[0]);
          }
          // this.temNameL = 2;
          this.activities=[];
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
          console.log('页数是' + this.listQueryYiLiaoAnQuan.Total);
          this.reportData = data.DataList;
          if (data.DataList[0] !== '') {
            this.rowClick(data.DataList[0]);
          }
          // this.temNameL = 3;
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
        this.typeNum = 4; // 此时可以用2表示当前显示的是药品安全表
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
          if (data.DataList[0] !== '') {
            this.rowClick(data.DataList[0]);
          }
          // this.temNameL = 4;
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
          // 删除通用事件条目
          if (this.temNameL === 0) {
            DeleteReport({ EventReportID: row.EventReportID }).then(data => {
              if (data.code === 200) {
                this.$message.success('删除成功!');
                this.SelectHandleReport();
              }
            });
          }
          // 删除医疗器械事件条目
          else if (this.temNameL === 1) {
            DeleteReport1({ EventReportID: row.EventReportID, type: this.temNamel }).then((data) => {
              if (data.code === 200) {
                this.$message.success('删除成功!');
                this.SelectReportqixie();
              }
            });
          }
          // 删除护理安全事件条目
          else if (this.temNameL === 2) {
            DeleteReport1({ EventReportID: row.EventReportID, type: this.temNamel }).then((data) => {
              if (data.code === 200) {
                this.$message.success('删除成功!');
                this.SelectReportHuli();
              }
            });
          }
          // 删除医疗安全事件条目
          else if (this.temNameL === 3) {
            DeleteReport1({ EventReportID: row.EventReportID, type: this.temNamel }).then((data) => {
              if (data.code === 200) {
                this.$message.success('删除成功!');
                this.SelectReportAnQuan();
              }
            });
          }
          // 删除药品安全事件条目
          else if (this.temNameL === 4) {
            DeleteReport1({ EventReportID: row.EventReportID, type: this.temNamel }).then((data) => {
              if (data.code === 200) {
                this.$message.success('删除成功!');
                this.SelectReportYaoPin();
              }
            });
          }
        })
        .catch(() => {
        });
    },
    // 点击条目，显示审核状态操作
    async rowClick(row = 0) {
      console.log(row.CreateUserID);
      if (row.CreateUserID === window.userInfo[0].UserID) {
        var val = {
          EventReportID: row.EventReportID,
          UserID: window.userInfo[0].UserID,
          ReviewStatus: '待审核',
          type: this.temNameL
        };
      } else {
        var val = {
          EventReportID: row.EventReportID,
          UserID: window.userInfo[0].UserID,
          DeptID: window.userInfo[0].DeptID,
          ReviewStatus: '待审核',
          type: this.temNameL
        };
      }
      this.SelectReviewVal = row;
      if (this.temNameL === 0) { // 如果是通用模板显示，字段为VictimName。其他特定模板为PatientName
        this.VictimNameS = row.VictimName;
      } else {
        this.VictimNameS = row.PatientName;
      }
      const { data } = await SelectReview(val);

      this.activities = data;
      this.activities[0]['VictimName'] = this.VictimNameS;
    },
    edit(row) {
      this.formData = row;
      this.dialogTableVisible = true;
    },
    selectRow(row) {
      // this.formData = row;
      // this.dialogTableVisible = true;
      this.$router.push({
        name: 'AdverseEventsReport',
        params: { id: row.EventReportID, pendingType: this.temNameL, biaoshi: 5, x: 4 } // x 为点击返回按钮跳回的页面
      });
    },
    /* 事件改派和协助 */
    UpdateDeptID(row, val) {
      if (val === 1) {
        this.multiple = false;
        this.EventReassignVal.ReviewDeptID = row.ReviewDeptID;
        this.dialogUpdateDeptID = true;
      } else if (val === 2) {
        this.EventReassignVal.OpinionDeptID = row.OpinionDeptID.split(',');
        this.dialogUpdateDeptID2 = true;
      }
      this.EventReassignVal.FollowID = row.FollowID;
    },
    async EventReassign() {
      try {
        const { msg } = await EventReassign(this.EventReassignVal);
        this.rowClick(this.SelectReviewVal);
        this.$message.success(msg);
      } catch (e) {
        console.log(e);
      }
      this.dialogUpdateDeptID = false;
    },
    async EventAssist() {
      try {
        const { msg } = await EventAssist(this.EventReassignVal);
        this.rowClick(this.SelectReviewVal);
        this.$message.success(msg);
      } catch (e) {
        console.log(e);
      }

      this.dialogUpdateDeptID2 = false;
    },
    ReassignAssist(val) {
      if (val === 1) {
        this.EventReassign();
      } else if (val === 2) {
        this.EventAssist();
      }
    },
    getDefaultDeptsValue(value) {
      this.EventReassignVal.ReviewDeptID = value || 0;
    },
    getDefaultDeptsValue2(value) {
      this.EventReassignVal.OpinionDeptID = value.toString() || 0;
    },
    getDefaultDeptsValue3(value) {
      this.InsertReviewStepData.OpinionDeptID = value.toString() || 0;
    },
    /* 审核 */
    UpdateStatus(row) {
      this.dialogReview = true;
      this.UpdateReviewData.ReviewID = row.ReviewID;
      this.UpdateReviewData.ReviewStatus = row.ReviewStatus;
      this.UpdateReviewData.Type = this.typeNum;
    },
    async UpdateReviewStatus() {
      this.$confirm('审核之后不能够填写审核意见，若还没填写审核意见，请先填写意见后再审核', '温馨提示', {
        confirmButtonText: '继续',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await UpdateReviewStatus(this.UpdateReviewData);
        this.$message.success('审核成功');
        this.rowClick(this.SelectReviewVal);
        this.dialogReview = false;
        // 刷新
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
      }).catch((e) => {
        console.log(e);
      });
    },
    /* 新增流程 */
    newProcess(row, val) {
      this.InsertReviewStepData.ReviewID = row.ReviewID;
      this.dialogInsertReviewStep = true;
    },
    async InsertReviewStep() {
      try {
        if (this.temNameL === 0) {
          this.InsertReviewStepData.Type = 0;
          await InsertReviewStep(this.InsertReviewStepData);
        } else if (this.temNameL === 1) {
          this.InsertReviewStepData.Type = 1;
          await InsertReviewStep(this.InsertReviewStepData);
        } else if (this.temNameL === 2) {
          this.InsertReviewStepData.Type = 2;
          await InsertReviewStep(this.InsertReviewStepData);
        } else if (this.temNameL === 3) {
          this.InsertReviewStepData.Type = 3;
          await InsertReviewStep(this.InsertReviewStepData);
        } else if (this.temNameL === 4) {
          this.InsertReviewStepData.Type = 4;
          await InsertReviewStep(this.InsertReviewStepData);
        }

        this.rowClick(this.SelectReviewVal);
        this.dialogInsertReviewStep = false;
        this.$message.success('新增流程');
      } catch (e) {
        console.log(e);
      }
    },
    Opinion(row, val) {
      // this.UpdateStatusRow = row; // 将点击审核后的row，存下来供审核时使用
      this.OpinionData.ReviewID = row.ReviewID;
      this.dialogOpinion = true;

    },
    async InsertOpinion() {
      this.OpinionData.ReviewID=this.OpinionData.ReviewID+1;
      const { code } = await InsertOpinion(this.OpinionData);
      if (code === 200) {
        await this.rowClick(this.SelectReviewVal);
        this.dialogOpinion = false; // 关闭对话框
      }
      if (this.temNameL === 2) {
        this.btnLoading = true; // 开启按钮等待圈
        // 要把审核的内容转为部门意见插入护理不良事件表中，先获取当前条的数据,以及附件
        const { data } = await SelectReportByID1({
          EventReportID: this.SelectReviewVal.EventReportID, type: this.temNameL
        });
        this.yiJian = data[0];
        // 将附件的内容获取过来等下一并更新
        const fuJian = await SelectReportFile({
          EventReportID: this.SelectReviewVal.EventReportID, type: this.temNameL
        });
        // 将获取过来的附件数据放在fuJian对象中
        this.fuJian = fuJian.data[0];
        // 将审核的意见插入护理不良事件表的部门意见字段中
        this.yiJian.Opinions = this.OpinionData.OpinionContent;
        // 原有的附件一开始this.yiJian是没有File_List字段的所以加上
        this.yiJian.File_List = [];
        // 将获取过来的附件数据放入this.yiJian.File_List数组中
        this.yiJian.File_List.push(this.fuJian);
        // 判断一下原来附件是否有数据，没有数据则将File_List变为数组为File_List[]，不然会成这样File_List[null]，后端报错
        if (fuJian.data.length === 0) {
          this.yiJian.File_List = [];
        }
        // 重新将这条数据更新
        try {
          const { code } = await InsertOrUpdateReportHuli(this.yiJian);// 护理不良模板更新数据
          if (code === 200) {
            this.$message.success('审核意见填写成功');
            this.btnLoading = false; // 关闭按钮等待圈
            this.dialogOpinion = false; // 关闭对话框
            // 最后刷新该护理列表数据
            this.SelectReportHuli();
          } else {
            this.$message.error('好像出现了一些问题');
            this.btnLoading = false; // 关闭按钮等待圈
          }
        } catch (e) {
          this.$message.error('好像出现了一些问题', e);
          this.btnLoading = false; // 关闭按钮等待圈
        }
      }
    },

    async SelectOpinion(row) {
      try {
        this.OpinionData.ReviewID = 0
        this.OpinionData.ReviewID = row.ReviewID;
        this.dialogSelectOpinion = true;
        const { data } = await SelectOpinion(this.OpinionData);
        data.map((item, index) => {
          item.CreateDate = item.CreateDate.replace('T', ' ');
        });
        this.OpinionData.SelctOpinionContent = data;
        console.log(this.OpinionData.SelctOpinionContent);
      } catch (e) {
        console.log(e);
      }
    }
  }
};
</script>

<style lang="scss"  scoped>
.box-card-view {
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
