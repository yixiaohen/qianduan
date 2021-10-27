<template>
  <el-container class="desk">
    <el-main style="height: 85vh !important">
      <div class="left">
        <div class="calendar">
          <el-calendar
            v-model="calendarValue"
            data="yyyy-MM-dd"
          >
            <template
              slot="dateCell"
              slot-scope="{ data }"
            >
              <span :class="data.isSelected ? 'is-selected' : ''">
                {{ data.day.split('-').slice(2)[0] }}
                {{ data.isSelected ? '✔️' : '' }} </span><br>
            </template>
          </el-calendar>
        </div>
        <div
          ref="echartsRef"
          class="static"
        />
      </div>
      <div class="work">
        <div class="content_day">
          <el-card class="box-card">
            <div
              slot="header"
              class="clearfix"
            >
              <span>今日任务</span>
              <el-button
                style="float: right; padding: 3px 0"
                type="text"
                @click="selectTask('今日任务')"
              ><i class="el-icon-edit" />设置
              </el-button>
              <el-button
                style="float: right; padding: 3px 30px"
                type="text"
                @click="addTask('今日任务')"
              ><i class="el-icon-plus" />添加任务
              </el-button>
            </div>
            <div style="display: flex">
              <div style="flex: 1">
                <div
                  v-for="(Rowtask, oIndex) in todayTask.EmphasisDetailList"
                  :key="oIndex"
                  class="text item"
                >
                  <el-checkbox
                    v-model="Rowtask.CompleteState"
                    @change="(val) => checkboxGroup(Rowtask)"
                  />
                  <span
                    class=""
                    @click="editTask(Rowtask)"
                  >{{ Rowtask.Title }}</span>
                </div>
              </div>
              <div style="flex: 1; margin-top: 5px">
                <span style="font-weight: bold">其他事项</span>:{{
                  todayTask.Matter
                }}
              </div>
            </div>
          </el-card>
        </div>
        <div class="cardCentent">
          <el-card class="box-card">
            <div
              slot="header"
              class="clearfix"
            >
              <span>本周任务</span>
              <el-button
                style="float: right; padding: 3px 0"
                type="text"
              ><i class="el-icon-arrow-right" /></el-button>
            </div>
            <div
              v-for="(item, aindex) in weekData"
              :key="aindex"
              class="text item"
            >
              {{ aindex + 1 }} 、
              <span @click="editTask(item)">{{ item.Title }}</span>
            </div>
          </el-card>
          <el-card class="box-card">
            <div
              slot="header"
              class="clearfix"
            >
              <span>本月任务</span>
              <el-button
                style="float: right; padding: 3px 0"
                type="text"
              ><i class="el-icon-arrow-right" /></el-button>
            </div>
            <div
              v-for="(monthTask,monthIndex) in monthData"
              :key="monthIndex"
              class="text item"
            >
              {{ monthIndex + 1 }} 、
              <span @click="editTask(monthTask)">{{ monthTask.Title }}</span>
            </div>
          </el-card>
          <el-card class="box-card">
            <div
              slot="header"
              class="clearfix"
            >
              <span>进行中</span>
              <el-button
                style="float: right; padding: 3px 0"
                type="text"
              ><i class="el-icon-arrow-right" /></el-button>
            </div>
            <div
              v-for="(conductTask, conductIndex) in conductData"
              :key="conductIndex"
              class="text item"
            >
              {{ conductIndex + 1 }}
              <span @click="editTask(conductTask)">{{ conductTask.Title }}</span>
            </div>
          </el-card>
          <el-card class="box-card">
            <div
              slot="header"
              class="clearfix"
            >
              <span>即将到期</span>
              <el-button
                style="float: right; padding: 3px 0"
                type="text"
              ><i class="el-icon-arrow-right" /></el-button>
            </div>
            <div
              v-for="(expireTask, expireIndex) in expireData"
              :key="expireIndex"
              class="text item"
            >
              {{ expireIndex + 1 }} 、
              <span @click="editTask(expireTask)">{{ expireTask.Title }}</span>
            </div>
          </el-card>
          <el-card class="box-card">
            <div
              slot="header"
              class="clearfix"
            >
              <span>未开始</span>
              <el-button
                style="float: right; padding: 3px 0"
                type="text"
              ><i class="el-icon-arrow-right" /></el-button>
            </div>
            <div
              v-for="(noStartTask, noStartIndex) in noStartData"
              :key="noStartIndex"
              class="text item"
            >
              {{ noStartIndex + 1 }} 、
              <span @click="editTask(noStartTask)">{{ noStartTask.Title }}</span>
            </div>
          </el-card>
          <el-card class="box-card">
            <div
              slot="header"
              class="clearfix"
            >
              <span>时间待定</span>
              <el-button
                style="float: right; padding: 3px 0"
                type="text"
              ><i class="el-icon-arrow-right" /></el-button>
            </div>
            <div
              v-for="(uncertainTask, uncertainIndex) in uncertainData"
              :key="uncertainIndex"
              class="text item"
            >
              {{ uncertainIndex + 1 }} 、
              <span @click="editTask(uncertainTask)">{{ uncertainTask.Title }}</span>
            </div>
          </el-card>
        </div>
      </div>
      <el-drawer
        :visible.sync="drawerTask"
        direction="ltr"
        :with-header="false"
        :before-close="handleClose"
      >
        <div class="todayTask">
          <div class="drawer_header">{{ todayTaskUser.EmphasisTypeName }}</div>
          <div class="task">
            <el-collapse
              v-model="activeNames"
              @change="handleChange"
            >
              <el-collapse-item
                title="重点任务"
                name="1"
              >
                <el-table
                  :data="todayTask.EmphasisDetailList"
                  border
                  style="width: 100%"
                  size="mini"
                >
                  <el-table-column
                    prop="date"
                    label="任务名称"
                  >
                    <template slot-scope="{ row }">
                      {{ row.Title }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="name"
                    label="预计完成"
                    width="120"
                    align="center"
                  >
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.Expect"
                        type="number"
                        size="mini"
                        placeholder="请输入"
                      ><i
                        slot="suffix"
                        style="font-style: normal; margin-right: 10px"
                      >%</i></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="address"
                    label="计划内容"
                  >
                    <template slot-scope="{ row }">
                      <el-input
                        v-model="row.PlanContent"
                        size="mini"
                        placeholder="请输入内容"
                      />
                    </template>
                  </el-table-column>
                </el-table>
                <div style="display: flex; justify-content: flex-end; margin: 10px">
                  <el-button
                    border
                    size="mini"
                    type="text"
                    @click="SelectTaskView('')"
                  >选择任务
                  </el-button>
                </div>
              </el-collapse-item>
              <el-collapse-item
                title="其他事项"
                name="2"
              >
                <el-input
                  v-model="todayTask.Matter"
                  type="textarea"
                  :rows="2"
                  placeholder="请输入内容"
                />
              </el-collapse-item>
            </el-collapse>
          </div>
          <el-button
            type="success"
            round
            size="mini"
            @click="InsertEmphasis"
          >保存
          </el-button>
        </div>
      </el-drawer>
      <el-dialog
        title="选择任务"
        :visible.sync="dialogTask"
        :width="device === 'mobile' ? '90%' : '50%'"
        :before-close="beforeClose"
      >
        <el-form
          :inline="true"
          class="demo-form-inline"
          size="mini"
        >
          <el-form-item>
            <el-input
              size="mini"
              placeholder="搜索任务"
            >
              <i
                slot="prefix"
                class="el-input__icon el-icon-search"
              />
            </el-input>
          </el-form-item>
        </el-form>
        <el-tabs
          v-model="tabPaneName"
          type="border-card"
          @tab-click="tabClick"
        >
          <el-tab-pane
            v-for="(item, index) in tabsLabelArr"
            :key="index"
            :label="item"
            :name="item"
          />
          <task
            ref="task"
            :state-data="stateDataTable"
            @checkbox="checkbox"
          />
        </el-tabs>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            size="mini"
            @click="dialogTask = false"
          >取 消</el-button>
          <el-button
            type="primary"
            size="mini"
            @click="dialogTask = false"
          >确 定</el-button>
        </span>
      </el-dialog>
      <el-drawer
        :with-header="false"
        :visible.sync="drawerWork"
        :size="drawerWorkCtl.size"
        :direction="drawerWorkCtl.direction"
      >
        <div class="todayTask">
          <span style="font-size: 18px; margin: 5px">{{
            drawerWorkCtl.title
          }}</span>
          <div style="flex: 1">
            <el-collapse v-model="taskactiveNames">
              <el-collapse-item
                title="重点任务"
                name="1"
              >
                <el-card class="box-card">
                  <div
                    slot="header"
                    class="clearfix"
                  >
                    <span>产品研发</span>
                    <el-date-picker
                      v-model="startEnddate"
                      type="daterange"
                      align="right"
                      size="mini"
                      unlink-panels
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="截止日期"
                      :picker-options="pickerOptions"
                    />
                    <span class="text">优先级</span>
                    <el-input-number
                      v-model="wordDrawerFm.Priority"
                      :min="1"
                      :max="10"
                      size="mini"
                      style="width: 90px"
                    />
                  </div>
                  <el-tabs value="first">
                    <el-tab-pane
                      label="基本信息"
                      name="first"
                    >
                      <el-row>
                        任务标题：
                        <el-input
                          v-model="wordDrawerFm.Title"
                          :rows="2"
                          size="mini"
                          placeholder="请输入标题"
                        />
                      </el-row>
                      <el-row>
                        描述：
                        <el-input
                          v-model="wordDrawerFm.Describes"
                          type="textarea"
                          :rows="2"
                          placeholder="请输入任务描述"
                        />
                      </el-row>
                      <el-row>
                        完成进度：
                        <div class="block">
                          <el-slider
                            v-model="wordDrawerFm.CompletedProgress"
                            show-input
                            input-size="mini"
                            :marks="{50:'50%'}"
                          />
                        </div>
                      </el-row>
                    </el-tab-pane>
                    <el-tab-pane
                      label="附件"
                      name="second"
                    >
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
                        >选择文件
                        </el-button>
                      </el-upload>
                      <filePreview :preview-data="wordDrawerFm.File_list" />
                    </el-tab-pane>
                  </el-tabs>
                  <el-checkbox
                    v-model="wordDrawerFm.link"
                    style="margin-top: 15px"
                  >该任务关联成果
                  </el-checkbox>
                  <div>
                    <el-row>
                      <el-col :span="1" />
                      <el-col :span="23">
                        <el-tag
                          v-if="wordDrawerFm.ObjectTypeName"
                          effect="plain"
                          size="mini"
                        >{{
                          wordDrawerFm.ObjectTypeName === 0 ? '个人级' : wordDrawerFm.ObjectTypeName == 1 ? '科室/团队级' : '院级'
                        }}
                        </el-tag>
                        {{ wordDrawerFm.ResultName }}
                        <el-button
                          type="text"
                          icon="el-icon-edit"
                          size="mini"
                          style="padding: 1px !important"
                          @click="kr"
                        >选择成果
                        </el-button>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="1"><i class="el-icon-time" /></el-col>
                      <el-col :span="6">完成占比</el-col>
                      <el-col :span="17">
                        <el-input-number
                          v-model="wordDrawerFm.Proportion"
                          controls-position="right"
                          :min="1"
                          size="mini"
                        />
                        %
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="1"><i class="el-icon-time" /></el-col>
                      <el-col :span="6">计划工时</el-col>
                      <el-col :span="17">
                        <el-input-number
                          v-model="wordDrawerFm.PlanHours"
                          controls-position="right"
                          :min="1"
                          size="mini"
                        />
                        小时
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="1"><i class="el-icon-user" /></el-col>
                      <el-col :span="6">
                        参与人数：{{ wordDrawerFm.Participant ? wordDrawerFm.Participant.split(',').length : 0 }}
                      </el-col>
                      <el-col :span="17">
                        <el-button
                          type="primary"
                          icon="el-icon-plus"
                          circle
                          size="mini"
                          style="padding: 1px !important"
                          @click="people('参与人',wordDrawerFm.Participant)"
                        />
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="1"><i class="el-icon-s-check" /></el-col>
                      <el-col :span="6">审批人数：
                        {{ wordDrawerFm.AuditUser ? wordDrawerFm.AuditUser.split(',').length : 0 }}
                      </el-col>
                      <el-col :span="17">
                        <el-button
                          type="primary"
                          icon="el-icon-plus"
                          circle
                          size="mini"
                          style="padding: 1px !important"
                          @click="people('审核人',wordDrawerFm.AuditUser)"
                        />
                      </el-col>
                    </el-row>
                    <!-- <el-row>
                      <el-col :span="1"><i class="el-icon-view" /></el-col>
                      <el-col :span="6">可见范围</el-col>
                      <el-col :span="17">全公司</el-col>
                    </el-row> -->
                  </div>
                </el-card>
              </el-collapse-item>
              <el-collapse-item
                title="其他事项"
                name="2"
              >
                <el-input
                  v-model="wordDrawerFm.other"
                  type="textarea"
                  :rows="2"
                  placeholder="请输入"
                />
              </el-collapse-item>
            </el-collapse>
          </div>
          <el-button
            type="success"
            round
            size="mini"
            @click="InsertTask"
          >提交
          </el-button>
        </div>
      </el-drawer>
      <el-dialog
        title="关联成果"
        :visible.sync="dialogKR"
        :width="device === 'mobile' ? '90%' : '50%'"
      >
        <div style="height:60vh;overflow:auto">
          <taskAlign @handleSelectionChange="handleSelectionChange" />
        </div>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            size="mini"
            @click="dialogKR = false"
          >取 消</el-button>
          <el-button
            type="primary"
            size="mini"
            @click="dialogKR = false"
          >确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="人员选择"
        :close-on-click-modal="false"
        :visible.sync="dialogVisible"
        :width="device === 'desktop' ? '55%' : '90%'"
      >
        <select-deptor-user
          ref="userTree"
          :value="`资料录入员分配`"
          @getSelectDeptorUser="getSelectDeptorUser"
        />
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            size="mini"
            @click="dialogVisible = false"
          >取 消</el-button>
          <el-button
            type="primary"
            size="mini"
            @click="dialogVisible = false"
          >确 定</el-button>
        </span>
      </el-dialog>
    </el-main>
  </el-container>
</template>
<script>
import echarts from 'echarts';
import { mapGetters } from 'vuex';
import task from './components/task';
import taskAlign from '@/views/components/okr/taskAlign';
import { InsertTask, SelectTaskByID, SelectTaskView, UpdateTask } from '@/api/okr/task';
import { InsertEmphasis, SelectEmphasisDay, SelectEmphasisWeekAndMonth, UpdateEmphasisState } from '@/api/okr/emphasis';
import { parseTime } from '@/utils/index';
import SelectDeptorUser from '@/views/components/SelectDeptorUser';
import filePreview from '@/views/components/file/filePreview';

export default {
  components: {
    task,
    taskAlign,
    SelectDeptorUser,
    filePreview
  },
  data() {
    return {
      calendarValue: new Date(),
      taskType: [
        { name: '本周任务', EmphasisType: 1 },
        { name: '本月任务', EmphasisType: 1 },
        { name: '我的目标', EmphasisType: 3 },
        { name: '进行中', EmphasisType: 4 },
        { name: '审核中', EmphasisType: 5 },
        { name: '已逾期', EmphasisType: 6 }
      ],
      weekData: [],
      monthData: [],
      conductData: [],
      expireData: [],
      noStartData: [],
      uncertainData: [],
      todayTask: {
        Matter: '',
        EmphasisDetailList: [],
        EmphasisID: 0
      },
      todayTaskUser: {
        EmphasisTypeName: '今日任务',
        EmphasisType: 0,
        CreateUserID: window.userInfo[0].UserID,
        CreateDate: ''
      },
      dialogTask: false,
      drawerTask: false,
      activeNames: ['1', '2'],
      tabsLabelArr: ['全部', '进行中', '即将到期', '未开始', '时间待定'],
      stateDataTable: [],
      tabPaneName: '全部',
      drawerWork: false,
      drawerWorkCtl: { title: '', direction: 'ltr', size: '40%', style: '' },
      taskactiveNames: ['1', '2'],
      startEnddate: [],
      state: '新增',
      wordDrawerFm: {
        link: true,
        TaskID: 0,
        ResultID: 0,
        ResultName: '',
        ObjectTypeName: '',
        Title: '',
        TaskDescribe: '',
        CompletedProgress: 50,
        StartDate: '',
        EndDate: '',
        Proportion: 0,
        Describes: '',
        Priority: 0,
        PlanHours: 0,
        Participant: '',
        AuditUser: '',
        IsDraft: 0,
        Scope: 0,
        UserScope: '',
        CreateUserID: window.userInfo[0].UserID,
        File_list: []
      },
      dialogKR: false,
      fileList: [],
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      },
      dialogVisible: false,
      getSelectDeptorUsertype: ''
    };
  },
  computed: {
    ...mapGetters(['device'])
  },
  watch: {
    calendarValue(newVlaue) {
      this.calendarValue = parseTime(newVlaue, '{y}-{m}-{d}');
      this.SelectEmphasisDay();
      this.SelectEmphasisWeekAndMonth(1);
      this.SelectEmphasisWeekAndMonth(2);
    },
    startEnddate(newValue) {
      this.wordDrawerFm.StartDate = newValue === [] ? '' : parseTime(newValue[0], '{y}-{m}-{d}');
      this.wordDrawerFm.EndDate = newValue === [] ? '' : parseTime(newValue[1], '{y}-{m}-{d}');
    }
  },
  created() {
    this.SelectEmphasisDay();
    this.SelectEmphasisWeekAndMonth(1);
    this.SelectEmphasisWeekAndMonth(2);
    this.SelectTaskView('进行中');
    this.SelectTaskView('即将到期');
    this.SelectTaskView('未开始');
    this.SelectTaskView('时间待定');
  },
  mounted() {
    this.static();
  },
  methods: {
    async SelectEmphasisDay() {
      const { data } = await SelectEmphasisDay({
        CreateDate: parseTime(this.calendarValue, '{y}-{m}-{d}'),
        UserID: window.userInfo[0].UserID
      });
      this.todayTask = data;
    },
    async SelectEmphasisWeekAndMonth(type = 1) {
      const { data } = await SelectEmphasisWeekAndMonth({
        CreateDate: parseTime(this.calendarValue, '{y}-{m}-{d}'),
        UserID: window.userInfo[0].UserID,
        type: type
      });
      if (type === 1) {
        this.weekData = data;
      } else if (type === 2) {
        this.monthData = data;
      }
    },
    async static() {
      const { data } = await SelectTaskView({
        state: '进行中',
        priority: '',
        Type: 1,
        pageIndex: 1,
        pageSize: 100
      });
      const data2 = await SelectTaskView({
        state: '即将到期',
        priority: '',
        Type: 1,
        pageIndex: 1,
        pageSize: 100
      });
      const data3 = await SelectTaskView({
        state: '时间待定',
        priority: '',
        Type: 1,
        pageIndex: 1,
        pageSize: 100
      });
      const echartsRef = echarts.init(this.$refs.echartsRef);
      this.option = {
        legend: {},
        tooltip: {},
        dataset: {
          source: [
            ['product', '进行中', '即将到期', '时间待定'],
            ['任务统计', data.DataList.length, data2.data.DataList.length, data3.data.DataList.length]
          ]
        },
        xAxis: { type: 'category' },
        yAxis: {},
        series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }]
      };
      echartsRef.setOption(this.option);
    },
    selectTask(EmphasisTypeName, EmphasisType = 0) {
      this.todayTaskUser.EmphasisTypeName = EmphasisTypeName;
      this.drawerTask = true;
    },
    handleClose() {
      this.drawerTask = false;
    },
    beforeClose() {
      this.dialogTask = false;
    },
    handleChange() {
    },
    async SelectTaskView(state) {
      const { data } = await SelectTaskView({
        state: state || '',
        priority: '',
        Type: 1,
        pageIndex: 1,
        pageSize: 100
      });
      if (state === '进行中') {
        this.conductData = data.DataList;
      } else if (state === '即将到期') {
        this.expireData = data.DataList;
      } else if (state === '未开始') {
        this.noStartData === data.DataList;
      } else if (state === '时间待定') {
        this.uncertainData = data.DataList;
      } else {
        this.stateDataTable = data.DataList;
        this.stateDataTable.map((item, index) => {
          item.CheckState = !!item.CheckState;
          this.todayTask.EmphasisDetailList.map(item2 => {
            if (item2.TaskID === item.TaskID) {
              item.CheckState = true;
            }
          });
        });
        this.$nextTick(() => {
          this.$refs.task;
        });

        this.dialogTask = true;
      }
    },
    addTask() {
      if (this.state === '更新') {
        Object.assign(this.$data.wordDrawerFm, this.$options.data().wordDrawerFm);
      }
      this.fileList = [];
      this.state = '新增';
      this.drawerWork = true;
    },
    tabClick(val) {
      this.SelectTaskView(val.label === '全部' ? '' : val.label);
    },
    checkbox(row) {
      if (row.CheckState) {
        this.todayTask.EmphasisDetailList.push(row);
      } else {
        this.todayTask.EmphasisDetailList.splice(
          this.todayTask.EmphasisDetailList.findIndex(
            item => item.TaskID === row.TaskID
          ),
          1
        );
      }
    },
    async InsertEmphasis() {
      const { msg, code } = await InsertEmphasis({
        EmphasisID: this.todayTask.EmphasisID,
        EmphasisDetailList: this.todayTask.EmphasisDetailList,
        Matter: this.todayTask.Matter,
        EmphasisType: this.todayTaskUser.EmphasisType,
        CreateUserID: window.userInfo[0].UserID,
        CreateDate: parseTime(this.calendarValue, '{y}-{m}-{d}')
      });
      code === 200 ? this.$message.success(msg) : this.$message.error(msg);
      this.SelectEmphasisDay();
      this.drawerTask = false;
    },
    kr() {
      this.dialogKR = true;
    },
    handleSelectionChange(val) {
      this.wordDrawerFm.ObjectTypeName = val.ObjectType;
      this.wordDrawerFm.ResultName = val.row.ResultName;
      this.wordDrawerFm.ResultID = val.row.ResultID;
    },
    async InsertTask() {
      const { code, msg } = this.state === '新增' ? await InsertTask(this.wordDrawerFm)
        : await UpdateTask(this.wordDrawerFm);
      code === 200 ? this.$message.success(msg) : this.$message.error(msg);
      this.SelectEmphasisWeekAndMonth(1);
      this.SelectEmphasisWeekAndMonth(2);
      this.SelectTaskView('进行中');
      this.SelectTaskView('即将到期');
      this.SelectTaskView('未开始');
      this.SelectTaskView('时间待定');
      this.drawerWork = false;
    },
    async editTask(row) {
      const { data } = await SelectTaskByID({
        TaskID: row.TaskID
      });
      this.state = '更新';
      this.wordDrawerFm = data[0];
      this.startEnddate = [];
      this.fileList = [];
      data[0].StartDate ? this.startEnddate.push(data[0].StartDate) : this.startEnddate = [];
      data[0].EndDate ? this.startEnddate.push(data[0].EndDate) : this.startEnddate = [];
      this.drawerWork = true;
    },
    async checkboxGroup(val) {
      await UpdateEmphasisState({
        CompleteState: val.CompleteState,
        EmphasisID: val.EmphasisID,
        TaskID: val.TaskID
      });
      this.SelectEmphasisDay();
    },
    getSelectDeptorUser(value) {
      if (this.getSelectDeptorUsertype === '参与人') {
        value = Array.from(new Set(value));
        this.wordDrawerFm.Participant = value.join(',');
      } else {
        value = Array.from(new Set(value));
        this.wordDrawerFm.AuditUser = value.join(',');
      }
    },
    customColorMethod(percentage) {
      if (percentage < 30) {
        return '#909399';
      } else if (percentage < 70) {
        return '#e6a23c';
      } else {
        return '#67c23a';
      }
    },
    people(type, UserID = []) {
      this.getSelectDeptorUsertype = type;
      this.dialogVisible = true;
      if (type === '参与人') {
        this.$nextTick(() => {
          this.$refs.userTree.setDeptorUser([]);
          Array.from(new Set(UserID.split(',')));
          this.$refs.userTree.setDeptorUser(Array.from(new Set(UserID.split(','))));
        });
      } else if (type === '审核人') {
        this.$refs.userTree.setDeptorUser([]);
        Array.from(new Set(UserID.split(',')));
        this.$refs.userTree.setDeptorUser(Array.from(new Set(UserID.split(','))));
      }
    },
    handleSuccess(response, file) {
      if (response.code === 200) {
        const data = response.data[0];
        this.wordDrawerFm.File_list.push({
          FileID: 0,
          CheckID: 0,
          FileName: file.name,
          FileUrl: data.FileUrl.replace(/href=|'|"|Annex\/file/g, ''),
          OpenFileUrl: data.OpenFileUrl
        });
      } else {
        this.fileList = [];
        this.$message.error(file.name + '上传失败');
      }
    }
  }
};
</script>
<style lang="scss">
.desk {
  .el-main {
    padding: 0;
    margin: 10px 0;
    height: 95vh !important;
    display: flex;

    .work {
      flex: 1;
      display: flex;
      flex-flow: column; //垂直排列
      .content_day {
        margin: 0px 10px 0px 20px;

        .clearfix {
          text-align: center;
          font-size: 20px;
        }

        .text {
          font-size: 14px;
        }

        .item {
          margin-bottom: 18px;
          display: flex;
          align-items: center;

          span {
            padding: 0px 5px;
            cursor: pointer !important;
          }

          span:hover {
            color: #3e84e9;
          }
        }

        .clearfix {
          text-align: center;
          font-size: 20px;
        }

        .clearfix:before,
        .clearfix:after {
          display: table;
          content: '';
        }

        .clearfix:after {
          clear: both;
        }

        .box-card {
          height: 30vh;
          overflow: auto;
          margin: 0px 10px 0 0;
        }
      }
    }

    .left {
      display: flex;
      flex-flow: column; //垂直排列
      .calendar {
        width: 22vw;

        .el-calendar-day {
          padding: 2px !important;
          height: 3.5vh !important;
        }

        .el-calendar__body {
          padding: 5px 5px 10px !important;
          font-size: 0.6em;
        }
      }

      .static {
        flex: 1;
      }
    }
  }

  .drawer_header {
    text-align: center;
    /*font-weight: bold; */
    font-size: 20px;
    padding-top: 10px;
  }

  .el-tabs--border-card > .el-tabs__content {
    padding: 5px;
  }

  .todayTask {
    display: flex;
    flex-direction: column;
    margin: 0px 10px;
    height: 100vh;
    overflow: auto;

    .drawer_header {
      height: 50px;
    }

    .task {
      flex: 1;
    }

    .el-button {
      margin-bottom: 20px;
    }
  }

  .cardCentent {
    flex: 1;
    display: flex;
    flex-direction: column;
    flex-flow: wrap;
    margin: 0px 0px 0 20px;

    .text {
      font-size: 14px;
    }

    .item {
      margin-bottom: 18px;

      span {
        padding: 0px 5px;
        cursor: pointer !important;
      }

      span:hover {
        color: #3e84e9;
      }
    }

    .clearfix {
      text-align: center;
      font-size: 20px;
    }

    .clearfix:before,
    .clearfix:after {
      display: table;
      content: '';
    }

    .clearfix:after {
      clear: both;
    }

    .box-card {
      width: 20vw;
      margin: 20px 10px 0 0;
      flex: auto;
    }
  }
}

/* .el-main {
  padding: 0;
  margin: 0;
} */
</style>
