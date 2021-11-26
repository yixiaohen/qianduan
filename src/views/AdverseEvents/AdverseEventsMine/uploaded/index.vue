<template>
  <el-card class="box-card-view">
    <div slot="header" class="clearfix">
      <el-form label-position="left" :inline="true" size="mini">
<!--        <el-form-item>-->
<!--          <el-input-->
<!--            v-model="listQuery.EventName"-->
<!--            placeholder="事件名称"-->
<!--            style="width: 150px"-->
<!--            size="mini"-->
<!--            clearable-->
<!--          />-->
<!--        </el-form-item>-->
<!--        <el-form-item>-->
<!--          <el-button-->
<!--            type="info"-->
<!--            icon="el-icon-search"-->
<!--            :loading="listLoading"-->
<!--            size="mini"-->
<!--          >搜索-->
<!--          </el-button>-->
<!--        </el-form-item>-->


        <el-form-item>

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






<!--          &lt;!&ndash;          通用事件按钮&ndash;&gt;-->
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="success"-->
<!--            @click="edChangeL(tongyong=0)"-->
<!--          >通用事件-->
<!--          </el-button>-->
<!--          &lt;!&ndash;          医疗器械(不良)事件按钮&ndash;&gt;-->
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="success"-->
<!--            @click="edChangeL(qixie=1)"-->
<!--          >医疗器械(不良)事件（特定）-->
<!--          </el-button>-->
<!--          &lt;!&ndash;          护理安全(不良)事件按钮&ndash;&gt;-->
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="success"-->
<!--            @click="edChangeL(huli=2)"-->
<!--          >护理安全(不良)事件（特定）-->
<!--          </el-button>-->
<!--          &lt;!&ndash;          医疗安全(不良)事件按钮&ndash;&gt;-->
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="success"-->
<!--            @click="edChangeL(yiliao=3)"-->
<!--          >医疗安全(不良)事件（特定）-->
<!--          </el-button>-->
<!--          &lt;!&ndash;          药品安全(不良)事件按钮&ndash;&gt;-->
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="success"-->
<!--            @click="edChangeL(yaopin=4)"-->
<!--          >药品安全(不良)事件（特定）-->
<!--          </el-button>-->

          <!--          <el-button-->
          <!--            icon="el-icon-download"-->
          <!--            :loading="loadingExport"-->
          <!--            size="mini"-->
          <!--            @click="Export"-->
          <!--          >导出报告-->
          <!--          </el-button>-->
        </el-form-item>
      </el-form>
    </div>

    <!--    通用模板-->
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
                  prop="EventName"
                  label="不良事件"
                />
                <el-table-column
                  prop="EventTypeName"
                  label="事件类别"
                />
                <el-table-column prop="Status" label="状态"/>
                <el-table-column label="最后修改时间">
                  <template slot-scope="{ row }">{{
                      row.LastEditDatetime
                        ? row.LastEditDatetime.replace('T', ' ')
                        : ''
                                                 }}
                  </template>
                </el-table-column>
                <el-table-column label="创建时间">
                  <template slot-scope="{ row }">{{
                      row.CreateDatetime
                        ? row.CreateDatetime.replace('T', ' ')
                        : ''
                                                 }}
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="120">
                  <template slot-scope="scope">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="修改"
                      placement="right"
                    />
                    <el-button
                      size="mini"
                      circle
                      icon="el-icon-view"
                      @click="selectRow(scope.row)"
                    />
                    <el-button
                      size="mini"
                      circle
                      type="primary"
                      icon="el-icon-edit"
                      :disabled="scope.row.Status ==='已完成'"
                      @click="edit(scope.row)"
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
                :current-page.sync="pagination.pageIndex"
                :page-size="pagination.pageSize"
                :page-sizes="pagination.pageSizes"
                :total="pagination.total"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </div>
        </template>
        <template slot="paneR">
          <div class="bottom">
            <div class="bottomBody">
              <div>
                <el-table :data="activities" border size="mini">
                  <el-table-column type="index" label="审核状态" width="150"   align="center"/>
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
                v-loading="listLoading"
                :data="reportData"
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
                  prop="eventqixie"
                  label="不良事件"
                />
                <el-table-column
                  prop="PatientName"
                  label="患者姓名"
                />
                <el-table-column prop="Status" label="状态" />
                <el-table-column label="报告时间">
                  <template slot-scope="{ row }">{{
                      row.ReportDate
                      ? row.ReportDate.replace('T', ' ')
                        : ''
                  }}
                  </template>
                </el-table-column>
                <el-table-column label="创建时间">
                  <template slot-scope="{ row }">{{
                      row.CreateDate
                        ? row.CreateDate.replace('T', ' ')
                        : ''
                                                 }}
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="120">
                  <template slot-scope="scope">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="修改"
                      placement="right"
                    />
                    <el-button
                      size="mini"
                      circle
                      icon="el-icon-view"
                      @click="selectRow(scope.row)"
                    />
                    <el-button
                      size="mini"
                      circle
                      type="primary"
                      icon="el-icon-edit"
                      :disabled="scope.row.Status ==='已完成'"
                      @click="edit(scope.row)"
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
          <div class="bottom">
            <div class="bottomBody">
              <div>
                <el-table :data="activities" border size="mini">
                  <el-table-column type="index" label="审核状态" width="150"   align="center"/>
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
                v-loading="listLoading"
                :data="reportData"
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
                  prop="eventhuli"
                  label="不良事件"
                />
                <el-table-column
                  prop="PatientName"
                  label="患者姓名"
                />
                <el-table-column prop="Status" label="状态"/>
                <el-table-column label="报告时间">
                  <template slot-scope="{ row }">{{
                      row.OccurDate
                        ? row.OccurDate.replace('T', ' ')
                        : ''
                                                 }}
                  </template>
                </el-table-column>
                <el-table-column label="创建时间">
                  <template slot-scope="{ row }">{{
                      row.CreateDate
                        ? row.CreateDate.replace('T', ' ')
                        : ''
                                                 }}
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="120">
                  <template slot-scope="scope">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="修改"
                      placement="right"
                    />
                    <el-button
                      size="mini"
                      circle
                      icon="el-icon-view"
                      @click="selectRow(scope.row)"
                    />
                    <el-button
                      size="mini"
                      circle
                      type="primary"
                      icon="el-icon-edit"
                      :disabled="scope.row.Status ==='已完成'"
                      @click="edit(scope.row)"
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
          <div class="bottom">
            <div class="bottomBody">
              <div>
                <el-table :data="activities" border size="mini">
                  <el-table-column type="index" label="审核状态" width="150"   align="center"/>
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
                v-loading="listLoading"
                :data="reportData"
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
                  prop="eventyiliaoanquan"
                  label="不良事件"
                />
                <el-table-column
                  prop="PatientName"
                  label="患者姓名"
                />
                <el-table-column prop="Status" label="状态"/>
                <el-table-column label="报告时间">
                  <template slot-scope="{ row }">{{
                      row.ReportDate
                        ? row.ReportDate.replace('T', ' ')
                        : ''
                                                 }}
                  </template>
                </el-table-column>
                <el-table-column label="创建时间">
                  <template slot-scope="{ row }">{{
                      row.CreateDate
                        ? row.CreateDate.replace('T', ' ')
                        : ''
                                                 }}
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="120">
                  <template slot-scope="scope">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="修改"
                      placement="right"
                    />
                    <el-button
                      size="mini"
                      circle
                      icon="el-icon-view"
                      @click="selectRow(scope.row)"
                    />
                    <el-button
                      size="mini"
                      circle
                      type="primary"
                      icon="el-icon-edit"
                      :disabled="scope.row.Status ==='已完成'"
                      @click="edit(scope.row)"
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
          <div class="bottom">
            <div class="bottomBody">
              <div>
                <el-table :data="activities" border size="mini">
                  <el-table-column type="index" label="审核状态" width="150"   align="center"/>
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
                v-loading="listLoading"
                :data="reportData"
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
                  prop="eventyaopinanquan"
                  label="不良事件"
                />
                <el-table-column
                  prop="PatientName"
                  label="患者姓名"
                />
                <el-table-column prop="Status" label="状态"/>
                <el-table-column label="报告时间">
                  <template slot-scope="{ row }">{{
                      row.ReportDate
                        ? row.ReportDate.replace('T', ' ')
                        : ''
                                                 }}
                  </template>
                </el-table-column>
                <el-table-column label="创建时间">
                  <template slot-scope="{ row }">{{
                      row.CreateDate
                        ? row.CreateDate.replace('T', ' ')
                        : ''
                                                 }}
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="120">
                  <template slot-scope="scope">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="修改"
                      placement="right"
                    />
                    <el-button
                      size="mini"
                      circle
                      icon="el-icon-view"
                      @click="selectRow(scope.row)"
                    />
                    <el-button
                      size="mini"
                      circle
                      type="primary"
                      icon="el-icon-edit"
                      :disabled="scope.row.Status ==='已完成'"
                      @click="edit(scope.row)"
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
          <div class="bottom">
            <div class="bottomBody">
              <div>
                <el-table :data="activities" border size="mini">
                  <el-table-column type="index" label="审核状态" width="150"   align="center"/>
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
          </div>
        </template>

      </split-pane>
    </div>
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
import {
  DeleteReport,
  DeleteReport1,
  SelectOpinion,
  SelectReport,
  SelectReportAnQuan,
  SelectReportHuli,
  SelectReportqixie,
  SelectReportYaoPin,
  SelectReview
} from '@/api/AE_Event';
import splitPane from 'vue-splitpane';

export default {
  name: 'AdverseEventsMineUploaded',
  components: { splitPane },
  data() {
    return {
      eventTitle: 0,// 默认展示的报告页面，
      dialogSelectOpinion: false, // 查询反馈意见对话框
      /* 反馈意见 */
      OpinionData: {
        ReviewID: '',
        OpinionContent: '',
        SelctOpinionContent: '',
        CreateUserID: window.userInfo[0].UserID
      },
      disabled: false,
      temNameL: 0,
      reportData: [], // 固定模板数据
      listQueryYiLiao: {
        pageIndex: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100, 150, 200],
        Total: 0,
        IsDraft: 0,
        CreateUserID: window.userInfo[0].UserID,
        Status: ''
        // type: 1 // 1表示查询医疗器械模板
      },
      listQueryHuLi: {
        pageIndex: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100, 150, 200],
        Total: 0,
        IsDraft: 0,
        CreateUserID: window.userInfo[0].UserID,
        Status: ''
        // type: 2 // 2表示查询护理不良模板
      },
      listQueryYiLiaoAnQuan: {
        pageIndex: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100, 150, 200],
        Total: 0,
        IsDraft: 0,
        EventReportID: 0,
        CreateUserID: window.userInfo[0].UserID,
        Status: ''
        // type: 3 // 3表示查询医疗安全模板
      },
      listQueryYaoPin: {
        pageIndex: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100, 150, 200],
        Total: 0,
        IsDraft: 0,
        CreateUserID: window.userInfo[0].UserID,
        Status: ''
        // type: 4 // 3表示查询医疗安全模板
      },
      typeNum: 0,
      listLoading: false,
      loadingExport: false,
      listQuery: {
        // condition: '',
        CreateUserID: window.userInfo[0].UserID,
        pageIndex: 1,
        pageSize: 10,
        EventName: '',
        IsDraft: 0
      },
      tableData: [],
      pagination: {
        pageIndex: 1,
        total: 0,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100, 150, 200]
      },
      activities: [],
      shijian: 'dada',
      valS: -1
    };
  },

  created() {
    if (this.$route.query.temNameUpload) { // 从已报事件查看详情点进去后，返回按钮回原来的事件类，传一个标识，判断要显示哪类表
      this.temNameL = this.$route.query.temNameUpload;
      this.eventTitle = this.$route.query.temNameUpload;
    }
    // 要显示哪类表，加获取哪类表的数据
    if (this.temNameL === 0) {
      this.SelectReport();
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
        // 以下是为了防止连续多次点击造成的错
        if (this.valS === val) {
          this.valS = val;
          this.temNameL = 0;
        } else {
          this.activities = [];
          this.SelectReport();
          this.temNameL = 0;
          this.valS = val;
        }
      } else if (val === 1) {
        // 以下是为了防止连续多次点击造成的错
        if (this.valS === val) {
          this.temNameL = 1;
        } else {
          this.activities = [];
          this.SelectReportqixie();
          this.temNameL = 1;
          this.valS = val;
        }
      } else if (val === 2) {
        // 以下是为了防止连续多次点击造成的错
        if (this.valS === val) {
          this.temNameL = 2;
        } else {
          this.activities = [];
          this.SelectReportHuli();
          this.temNameL = 2;
          this.valS = val;
        }
      } else if (val === 3) {
        // 以下是为了防止连续多次点击造成的错
        if (this.valS === val) {
          this.temNameL = 3;
        } else {
          this.activities = [];
          this.SelectReportAnQuan();
          this.temNameL = 3;
          this.valS = val;
        }
      } else if (val === 4) {
        // 以下是为了防止连续多次点击造成的错
        if (this.valS === val) {
          this.temNameL = 4;
        } else {
          this.activities = [];
          this.SelectReportYaoPin();
          this.temNameL = 4;
          this.valS = val;
        }
      }
    },

    async SelectReport() {
      this.listLoading = true;
      try {
        const { data } = await SelectReport(this.listQuery);
        this.pagination.total = data.Total;
        this.tableData = data.DataList;
        this.typeNum = 0; // 此时可以用0表示当前显示的是通用表
        // this.temNamel = 0;
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
        const { data } = await SelectReportqixie(this.listQueryYiLiao);
        this.listQueryYiLiao.Total = data.Total;
        this.reportData = data.DataList;
        this.rowClick(data.DataList[0]);
        // this.temNamel = 1;
        // 新加一个类别事件
        this.reportData.forEach((value, index) => {
          value['eventqixie'] = '医疗器械(不良)事件(特定)';
        });
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
        const { data } = await SelectReportHuli(this.listQueryHuLi);
        this.listQueryHuLi.Total = data.Total;
        this.reportData = data.DataList;
        this.rowClick(data.DataList[0]);
        // this.temNamel = 2;
        // 新加一个类别事件
        this.reportData.forEach((value, index) => {
          value['eventhuli'] = '护理安全(不良)事件(特定)';
        });
      } catch (error) {
        this.$message({ type: 'error', message: error });
      } finally {
        this.listLoading = false;
      }
    },
    async SelectReportAnQuan() {
      this.listLoading = true;
      try {
        this.typeNum = 3;
        const { data } = await SelectReportAnQuan(this.listQueryYiLiaoAnQuan);
        this.listQueryYiLiaoAnQuan.Total = data.Total;
        this.reportData = data.DataList;
        this.rowClick(data.DataList[0]);
        // this.temNamel = 3;
        // 新加一个类别事件
        this.reportData.forEach((value, index) => {
          value['eventyiliaoanquan'] = '医疗安全(不良)事件(特定)';
        });
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
        const { data } = await SelectReportYaoPin(this.listQueryYaoPin);
        this.listQueryYaoPin.Total = data.Total;
        this.reportData = data.DataList;
        this.rowClick(data.DataList[0]);
        // this.temNamel = 4;
        // 新加一个类别事件
        this.reportData.forEach((value, index) => {
          value['eventyaopinanquan'] = '药品安全(不良)事件(特定)';
        });
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
      const id = row.EventReportID;
      this.$confirm('此操作将永久删除该不良事件, 是否继续?--', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 删除通用事件条目
          if (this.temNameL === 0) {
            DeleteReport({ EventReportID: id }).then((data) => {
              if (data.code === 200) {
                this.$message.success('删除成功!');
                this.SelectReport();
              }
            });
          }
          // 删除医疗器械事件条目
          else if (this.temNameL === 1) {
            DeleteReport1({ EventReportID: id, type: 1 }).then((data) => {
              if (data.code === 200) {
                this.$message.success('删除成功!');
                this.SelectReportqixie();
              }
            });
          }
          // 删除护理安全事件条目
          else if (this.temNameL === 2) {
            DeleteReport1({ EventReportID: id, type: 2 }).then((data) => {
              if (data.code === 200) {
                this.$message.success('删除成功!');
                this.SelectReportHuli();
              }
            });
          }
          // 删除医疗安全事件条目
          else if (this.temNameL === 3) {
            DeleteReport1({ EventReportID: id, type: 3 }).then((data) => {
              if (data.code === 200) {
                this.$message.success('删除成功!');
                this.SelectReportAnQuan();
              }
            });
          }
          // 删除药品安全事件条目
          else if (this.temNameL === 4) {
            DeleteReport1({ EventReportID: id, type: 4 }).then((data) => {
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

    selectRow(row) {
      this.$router.push({
        name: 'AdverseEventsReport',
        params: { id: row.EventReportID, uploadedType: this.temNameL, biaoshi: 6, x: 1 } // x 为点击返回按钮跳回的页面
      });
    },
    edit(row) {
      this.$router.push({
        name: 'AdverseEventsReport',
        params: { id: row.EventReportID, temName: this.temNameL, biaoshi: 1 }
      });
    },
    async rowClick(row) {
      const val = {
        EventReportID: row.EventReportID,
        UserID: window.userInfo[0].UserID,
        DeptID: window.userInfo[0].DeptID,
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
    async Export() {
      try {
        const excel = await import('@/vendor/Export2Excel');
        const tHeader = [
          '条款代码',
          '首次自评结果',
          '存在的问题',
          '末次自评结果',
          '采取的改进措施'
        ];
        const filterVal = [
          'CatalogCode',
          'Grade',
          'Matter',
          'Grade1',
          'solution'
        ];
        const formData = this.formatJson(filterVal, data);
        excel.export_json_to_excel({
          header: tHeader,
          data: formData,
          filename: '自评报告'
        });
        this.downloadLoading = false;
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
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
        height: calc(100% - 37px);
        overflow-y: hidden;

        .middleBodyTb {
          max-height: calc(100% - 37px);
        }
      }
    }

    .bottom {
      height: 100%;
      font-size: 14px;

      .bottomBody {
        height: calc(100%);
        overflow-y: hidden;

        .bottomBodyTb {
          max-height: calc(100%);
        }
      }
    }
  }
}
</style>
