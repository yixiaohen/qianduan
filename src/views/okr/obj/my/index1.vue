<template>
  <div>
    <el-container>
      <el-header height="35px">
        <el-form
          :inline="true"
          class="demo-form-inline"
        >
          <el-form-item>
            <span class="title">{{ title }}</span>
          </el-form-item>
          <el-form-item>
            <el-tag
              effect="plain"
              size="mini"
            >目标设立</el-tag>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              type="month"
              placeholder="选择月"
              size="mini"
              style="width: 100px"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="mini"
              @click="addObj"
            >添加目标</el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-close"
              plain
              size="mini"
              @click="endCycle"
            >终止周期</el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-more"
              plain
              size="mini"
              @click="editHis"
            >操作记录</el-button>
          </el-form-item>
        </el-form>
      </el-header>
      <el-main>
        <el-tabs v-model="activeName">
          <el-tab-pane
            label="目标"
            name="first"
          >
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item style="background-color: #f0f8ff">目标制定</el-breadcrumb-item>
              <el-breadcrumb-item style="background-color: #eee8aa">完成</el-breadcrumb-item>
            </el-breadcrumb>
            <el-card class="box-card">
              <el-row>
                <i class="el-icon-paperclip" />
                对齐:&nbsp;<el-button
                  type="primary"
                  icon="el-icon-edit"
                  circle
                  size="mini"
                  style="padding: 1px !important"
                  @click="kr"
                />
              </el-row>
              <el-row>
                <h2>目标1</h2>
                <targertTree
                  :tree-value="data"
                  @editor="editorTargert"
                  @delete="dfeleteTargert"
                />
              </el-row>
            </el-card>
            <el-card
              class="box-card"
              style="margin-top: 5px"
            >
              <el-row style="padding: 10px">
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  circle
                  size="mini"
                  @click="addObj"
                />
                <h3>添加目标（2~4个是最佳数量哦）</h3>
              </el-row>
            </el-card>
          </el-tab-pane>
          <el-tab-pane
            label="执行"
            name="second"
          >
            <el-card class="box-card">
              <el-row>
                <h2>关键任务</h2>
              </el-row>
              <el-row>
                <el-table
                  :data="exeKR"
                  :span-method="exeKRSpan"
                  border
                  style="width: 100%"
                  size="mini"
                >
                  <el-table-column label="成果">
                    <template slot-scope="scope">
                      {{ scope.row.kr }}
                      <el-button
                        icon="el-icon-s-opportunity"
                        style="padding: 3px !important"
                        @click="krDetail(scope.$index, scope.row)"
                      />
                      <el-button
                        icon="el-icon-chat-dot-round"
                        style="padding: 3px !important"
                        @click="krChat(scope.$index, scope.row)"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="task"
                    label="任务名称"
                  />
                  <el-table-column
                    prop="man"
                    label="负责人"
                  />
                  <el-table-column
                    prop=""
                    label="优先级"
                  />
                  <el-table-column
                    prop=""
                    label="状态"
                  />
                  <el-table-column
                    prop=""
                    label="进度"
                  />
                  <el-table-column
                    prop=""
                    label="截止时间"
                  />
                  <el-table-column
                    prop=""
                    label="计划工时"
                  />
                </el-table>
              </el-row>
            </el-card>
            <el-card
              class="box-card"
              style="margin-top: 5px"
            >
              <el-row>
                <h2>附件</h2>
              </el-row>
              <el-row>
                <el-table
                  style="width: 100%"
                  size="mini"
                >
                  <el-table-column
                    prop=""
                    label="类型"
                  />
                  <el-table-column
                    prop=""
                    label="附件名称"
                  />
                  <el-table-column
                    prop=""
                    label="来源"
                  />
                  <el-table-column
                    prop=""
                    label="上传时间"
                  />
                  <el-table-column
                    prop=""
                    label="上传人"
                  />
                  <el-table-column
                    prop=""
                    label="附件大小"
                  />
                  <el-table-column
                    prop=""
                    label="操作"
                  />
                </el-table>
              </el-row>
            </el-card>
          </el-tab-pane>
          <el-tab-pane
            label="辅导"
            name="third"
          >
            <el-row>
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="mini"
                @click="addCoach"
              >添加进度辅导</el-button>
            </el-row>
          </el-tab-pane>
          <el-tab-pane
            label="评价"
            name="fourth"
          >
            <el-radio-group
              v-model="evaluateStep"
              size="mini"
            >
              <el-radio-button label="自我评价" />
              <el-radio-button label="上级评价" />
              <el-radio-button label="评价结果" />
            </el-radio-group>
            <el-card class="box-card">
              <el-tree
                class="tree-line"
                icon-class="el-icon-circle-plus-outline"
                :indent="0"
                :data="data"
                default-expand-all
              />
            </el-card>
            <el-card
              class="box-card"
              style="margin-top: 5px"
            >
              <el-row style="padding: 10px">
                <h3>整体概括</h3>
                <el-input
                  v-model="textarea"
                  type="textarea"
                  :rows="2"
                  placeholder="请输入内容"
                />
              </el-row>
            </el-card>
          </el-tab-pane>
          <el-tab-pane
            label="复盘"
            name="five"
          >
            <el-card
              class="box-card"
              style="margin-top: 5px"
            >
              <el-row style="padding: 10px">
                <h3>面谈记录</h3>
                <el-input
                  type="textarea"
                  :rows="2"
                  placeholder="请输入内容"
                />
              </el-row>
              <el-row style="padding: 10px">
                <el-button type="primary">提交</el-button>
              </el-row>
            </el-card>
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
    <el-dialog
      title="关键成果关联选择"
      :visible.sync="dialogKR"
      :width="device === 'mobile' ? '90%' : '30%'"
    >
      <span>这是一段信息</span>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogKR = false">取 消</el-button>
        <el-button
          type="primary"
          @click="dialogKR = false"
        >确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="添加目标"
      :visible.sync="dialogObj"
      :width="device === 'mobile' ? '90%' : '30%'"
    >
      <el-row>
        <el-col :span="6">目标类型</el-col>
        <el-col :span="18">
          <el-radio-group
            v-model="dialogObjFm.type"
            size="mini"
            @change="radioGroupType"
          >
            <el-radio-button label="1">个人级</el-radio-button>
            <el-radio-button label="2">科室级</el-radio-button>
            <el-radio-button label="3">院级</el-radio-button>
          </el-radio-group>
        </el-col>
      </el-row>
      <el-divider />
      <el-row>
        <el-col :span="6">周期类型</el-col>
        <el-col :span="18">
          <el-radio-group
            v-model="dialogObjFm.cycleType"
            size="mini"
            @change="radioGroupType"
          >
            <el-radio-button label="月度" />
            <el-radio-button
              v-show="dialogObjFm.type=='2'||dialogObjFm.type=='3'"
              label="季度"
            />
            <el-radio-button
              v-show="dialogObjFm.type=='2'||dialogObjFm.type=='3'"
              label="半年度"
            />
            <el-radio-button
              v-show="dialogObjFm.type=='2'||dialogObjFm.type=='3'"
              label="年度"
            />
            <el-radio-button label="自定义" />
          </el-radio-group>
        </el-col>
      </el-row>
      <el-divider />
      <el-row>
        <el-col :span="6">周期时间</el-col>
        <el-col
          v-if="dialogObjFm.cycleType!='自定义'"
          :span="6"
        >
          <el-date-picker
            v-model="dialogObjFm.year"
            type="year"
            placeholder="选择年"
            size="mini"
            format="yyyy 年 MM"
            value-format="yyyy-MM"
            style="width: 100px"
          />
        </el-col>
        <el-col :span="12">
          <el-select
            v-show="dialogObjFm.cycleType=='月度'"
            v-model="dialogObjFm.cycle"
            placeholder="请选择月度"
            size="mini"
          >
            <el-option
              v-for="item in opt.month"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            >
              <span style="float: left">{{ item.label }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{
                item.status
              }}</span>
            </el-option>
          </el-select>
          <el-select
            v-show="dialogObjFm.cycleType=='季度'"
            v-model="dialogObjFm.cycle"
            placeholder="请选择季度"
            size="mini"
          >
            <el-option
              v-for="item in opt.quarter"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            >
              <span style="float: left">{{ item.label }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{
                item.status
              }}</span>
            </el-option>
          </el-select>
          <el-select
            v-show="dialogObjFm.cycleType=='半年度'"
            v-model="dialogObjFm.cycle"
            placeholder="请选择半年度"
            size="mini"
          >
            <el-option
              v-for="item in opt.semester"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            >
              <span style="float: left">{{ item.label }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{
                item.status
              }}</span>
            </el-option>
          </el-select>
          <el-date-picker
            v-show="dialogObjFm.cycleType=='自定义'"
            v-model="dialogObjFm.cycle"
            type="datetimerange"
            size="mini"
            format="yyyy 年 MM 月 dd 日 H 时"
            value-format="yyyy-MM-dd-H"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-col>
      </el-row>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          size="small"
          @click="dialogObj = false"
        >取 消</el-button>
        <el-button
          type="primary"
          size="small"
          @click="submit"
        >确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="填写进度辅导"
      :visible.sync="dialogCoach"
      :width="device === 'mobile' ? '90%' : '30%'"
    >
      <el-form size="mini">
        <el-form-item label="辅导总结:">
          <el-input
            v-model="dialogCoachFm.sum"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="值得鼓励的:">
          <el-input
            v-model="dialogCoachFm.sum"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="需要改进的:">
          <el-input
            v-model="dialogCoachFm.sum"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="附件:">
          <el-upload
            list-type="picture-card"
            size="mini"
          >
            <i class="el-icon-plus" />
          </el-upload>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogCoach = false">取 消</el-button>
        <el-button
          type="primary"
          @click="dialogCoach = false"
        >确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="终止周期"
      :visible.sync="dialogEndCycle"
      :show-fullscreen="false"
      :width="device === 'mobile' ? '90%' : '30%'"
    >
      <h3>确认终止周期【2月份 部门目标】吗？</h3>
      <el-radio-group v-model="dialogEndCycleFm.way">
        <el-radio :label="1">转为普通任务（无挂钩目标的任务）</el-radio>
        <el-radio :label="2">放入目标回收站（后续可以去回收站中进行重启）</el-radio>
      </el-radio-group>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogEndCycle = false">取 消</el-button>
        <el-button
          type="primary"
          @click="dialogEndCycle = false"
        >确 定</el-button>
      </span>
    </el-dialog>
    <el-drawer
      :with-header="false"
      :visible.sync="drawerHis"
      :size="drawerHisCtl.size"
      :direction="drawerHisCtl.direction"
    >
      <span style="font-size: 18px; margin: 5px">目标操作记录</span>
      <div :style="drawerHisCtl.style">
        <el-timeline
          :reverse="true"
          style="margin-top: 10px"
        >
          <el-timeline-item
            v-for="(activity, index) in drawerHisCtl.activities"
            :key="index"
            :timestamp="activity.timestamp"
          >
            {{ activity.content }}
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-drawer>
    <el-drawer
      :with-header="false"
      :visible.sync="drawerKrDetail"
      :size="drawerKrDetailCtl.size"
      :direction="drawerKrDetailCtl.direction"
    >
      <span style="font-size: 18px; margin: 5px">{{ drawerKrDetailCtl.title }}（成果详情）</span>
      <div :style="drawerKrDetailCtl.style">
        <h3>权重:50% 成果值:0%-100%</h3>
        <el-button size="mini">
          <svg-icon icon-class="flower" />1送花
        </el-button>
        <el-button size="mini">
          <svg-icon icon-class="like" />1点赞
        </el-button>
        <el-button
          icon="el-icon-view"
          size="mini"
        >2关注</el-button>
        <el-tabs v-model="drawerKrDetailCtl.tab">
          <el-tab-pane
            label="概览"
            name="first"
          >
            <el-progress
              :text-inside="true"
              :stroke-width="15"
              :percentage="70"
            />
            <div
              ref="chartRef"
              style="height: 200px"
            />
          </el-tab-pane>
          <el-tab-pane
            label="任务"
            name="second"
          />
          <el-tab-pane
            label="附件"
            name="third"
          />
          <el-tab-pane
            label="动态"
            name="fourth"
          />
        </el-tabs>
        信心值：
        <el-rate
          v-model="drawerKrDetailCtl.rate"
          allow-half
          :colors="drawerKrDetailCtl.rateColors"
        />
        <el-divider />
        可见范围: 全院
        <el-divider />
        对齐: 暂未对齐
      </div>
    </el-drawer>
    <el-drawer
      :with-header="false"
      :visible.sync="drawerKrChat"
      :size="drawerKrChatCtl.size"
      :direction="drawerKrChatCtl.direction"
    >
      <span style="font-size: 18px; margin: 5px">{{ drawerKrChatCtl.title }}（讨论）</span>
      <div :style="drawerKrChatCtl.style" />
    </el-drawer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import echarts from 'echarts';
import targertTree from '@/views/components/okr/targetTree';

export default {
  components: { targertTree },
  data() {
    return {
      activeName: 'first',
      dialogKR: false,
      dialogObj: false,
      dialogObjFm: {
        type: '1',
        cycleType: '月度',
        year: new Date().getFullYear().toString(),
        cycle: ''

      },
      opt: {
        month: [
          { value: '1', label: '一月份目标', status: '进行中', disabled: true },
          { value: '2', label: '二月份目标', status: '已设立' },
          { value: '3', label: '三月份目标', status: '未开始' },
          { value: '4', label: '四月份目标', status: '未开始' },
          { value: '5', label: '五月份目标', status: '未开始' },
          { value: '6', label: '六月份目标', status: '未开始' },
          { value: '7', label: '七月份目标', status: '未开始' },
          { value: '8', label: '八月份目标', status: '未开始' },
          { value: '9', label: '九月份目标', status: '未开始' },
          { value: '10', label: '十月份目标', status: '未开始' },
          { value: '11', label: '十一月份目标', status: '未开始' },
          { value: '12', label: '十二月份目标', status: '未开始' }
        ],
        quarter: [
          { value: '第一季度', label: '第一季度', status: '进行中', disabled: true },
          { value: '第二季度', label: '第二季度', status: '未开始', disabled: false },
          { value: '第三季度', label: '第三季度', status: '未开始', disabled: false },
          { value: '第四季度', label: '第四季度', status: '未开始', disabled: false }
        ],
        semester: [
          { value: '上半年', label: '上半年', status: '进行中', disabled: true },
          { value: '下半年', label: '下半年', status: '未开始', disabled: false }
        ]
      },
      dialogCoach: false,
      dialogCoachFm: { sum: '' },
      data: [
        {
          label: '目标 1',
          children: [
            {
              label: '成果 1'
            },
            {
              label: '成果 2'
            }
          ]
        },
        {
          label: '目标 2',
          children: [
            {
              label: '成果 1'
            }
          ]
        }
      ],
      evaluateStep: '',
      dialogEndCycle: false,
      dialogEndCycleFm: { way: 1 },
      drawerHis: false,
      drawerHisCtl: {
        direction: 'rtl',
        size: '30%',
        style: '',
        activities: [
          {
            content: '编辑了成果 (张三)',
            timestamp: '2021-01-15 10:20:28'
          },
          {
            content: '通过审核',
            timestamp: '2021-01-18 09:18:22'
          },
          {
            content: '新增辅导记录 (李四)',
            timestamp: '2021-01-21 15:30:12'
          }
        ]
      },
      exeKR: [
        {
          kr: '关键成果1',
          task: '前端开发',
          man: '张三'
        },
        {
          kr: '关键成果1',
          task: '后端端开发',
          man: '李四'
        },
        {
          kr: '关键成果1',
          task: '产品实施',
          man: '李四'
        },
        {
          kr: '关键成果2',
          task: '产品销售',
          man: '李四'
        }
      ],
      spanOneArr: [],
      drawerKrDetail: false,
      drawerKrDetailCtl: {
        direction: 'rtl',
        size: '30%',
        style: '',
        title: '',
        tab: 'first',
        chartData: {},
        rate: 3,
        rateColors: ['#99A9BF', '#F7BA2A', '#FF9900']
      },
      drawerKrChat: false,
      drawerKrChatCtl: {
        direction: 'rtl',
        size: '30%',
        style: '',
        title: ''
      },
      textarea: '',
      title: '第一季度'
    };
  },
  computed: {
    ...mapGetters(['device'])
  },
  created() {
    this.getJBXXTableData();
  },
  methods: {
    kr() {
      this.dialogKR = true;
    },
    addObj() {
      this.dialogObj = true;
    },
    addCoach() {
      this.dialogCoach = true;
    },
    endCycle() {
      this.dialogEndCycle = true;
    },
    editHis() {
      if (this.device === 'mobile') {
        this.drawerHisCtl.direction = 'btt';
        this.drawerHisCtl.size = '70%';
        this.drawerHisCtl.style = 'height: 60vh; overflow-y: auto';
      } else {
        this.drawerHisCtl.direction = 'rtl';
        this.drawerHisCtl.size = '30%';
        this.drawerHisCtl.style = '';
      }
      this.drawerHis = true;
    },
    getJBXXTableData() {
      this.spanOneArr = [];
      let concatOne = 0;
      this.exeKR.map((item, index) => {
        if (index === 0) {
          this.spanOneArr.push(1);
        } else {
          if (item.kr === this.exeKR[index - 1].kr) {
            // 第一列需合并相同内容的判断条件
            this.spanOneArr[concatOne] += 1;
            this.spanOneArr.push(0);
          } else {
            this.spanOneArr.push(1);
            concatOne = index;
          }
        }
      });
    },
    exeKRSpan({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const _row = this.spanOneArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return [_row, _col];
      }
    },
    krDetail(index, row) {
      if (this.device === 'mobile') {
        this.drawerKrDetailCtl.direction = 'btt';
        this.drawerKrDetailCtl.size = '70%';
        this.drawerKrDetailCtl.style = 'height: 60vh; overflow-y: auto';
      } else {
        this.drawerKrDetailCtl.direction = 'rtl';
        this.drawerKrDetailCtl.size = '30%';
        this.drawerKrDetailCtl.style = '';
      }
      this.drawerKrDetailCtl.title = row['kr'];
      this.drawerKrDetail = true;
      this.$nextTick(() => {
        this.showChart();
      });
    },
    krChat(index, row) {
      if (this.device === 'mobile') {
        this.drawerKrChatCtl.direction = 'btt';
        this.drawerKrChatCtl.size = '70%';
        this.drawerKrChatCtl.style = 'height: 60vh; overflow-y: auto';
      } else {
        this.drawerKrChatCtl.direction = 'rtl';
        this.drawerKrChatCtl.size = '30%';
        this.drawerKrChatCtl.style = '';
      }
      this.drawerKrChatCtl.title = row['kr'];
      this.drawerKrChat = true;
    },
    showChart() {
      const chart = echarts.init(this.$refs.chartRef, 'light');
      this.drawerKrDetailCtl.chartData = {
        title: {
          // text: "当前进度",
          subtext: '当前进度'
        },
        //        color: ["#546570", "#91c7ae", "#c4ccd3", "#6e7074"],
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['实际值', '期望值']
        },
        toolbox: {
          show: true,
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            data: [
              '1月',
              '2月',
              '3月',
              '4月',
              '5月',
              '6月',
              '7月',
              '8月',
              '9月',
              '10月',
              '11月',
              '12月'
            ]
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '实际值',
            type: 'line',
            data: [0, 0, 10, 10, 20, 30, 40, 50, 0, 0, 0, 0]
          },
          {
            name: '期望值',
            type: 'line',
            data: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 0]
          }
        ]
      };

      chart.setOption(this.drawerKrDetailCtl.chartData, true);
    },
    editorTargert(data) {
      console.log('data', data);
    },
    dfeleteTargert(data) {
      console.log(data);
    },
    submit() {
      console.log(this.dialogObjFm);
    },
    radioGroupType(val) {
      this.dialogObjFm.year = new Date().getFullYear().toString();
      this.dialogObjFm.cycle = '';
    }
  }
};
</script>

<style lang="scss">
.el-header {
  padding: 0 5px;
  .title {
    font-size: 18px;
  }
}
.el-main {
  padding: 5px;
}
.box-card {
  .el-card__body {
    padding: 5px;
  }
}
.el-date-editor--datetimerange.el-input,
.el-date-editor--datetimerange.el-input__inner {
  width: 325px !important;
}
.tree-line {
  .el-tree-node {
    position: relative;
    padding-left: 16px; // 缩进量
  }
  .el-tree-node__children {
    padding-left: 16px; // 缩进量
  }

  // 竖线
  .el-tree-node::before {
    content: '';
    height: 100%;
    width: 1px;
    position: absolute;
    left: -3px;
    top: -26px;
    border-width: 1px;
    border-left: 1px dashed #52627c;
  }
  // 当前层最后一个节点的竖线高度固定
  .el-tree-node:last-child::before {
    height: 38px; // 可以自己调节到合适数值
  }

  // 横线
  .el-tree-node::after {
    content: '';
    width: 24px;
    height: 20px;
    position: absolute;
    left: -3px;
    top: 12px;
    border-width: 1px;
    border-top: 1px dashed #52627c;
  }

  // 去掉最顶层的虚线，放最下面样式才不会被上面的覆盖了
  & > .el-tree-node::after {
    border-top: none;
  }
  & > .el-tree-node::before {
    border-left: none;
  }

  // 展开关闭的icon
  .el-tree-node__expand-icon {
    font-size: 16px;
    // 叶子节点（无子节点）
    &.is-leaf {
      color: transparent;
      // display: none; // 也可以去掉
    }
  }
}

.el-radio__input {
  line-height: 2;
}
.el-table th {
  background-color: #ccdac673;
}
</style>
