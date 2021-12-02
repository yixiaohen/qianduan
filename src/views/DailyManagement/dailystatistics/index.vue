<template>
  <el-card style="margin: 10px;width: 98%;height: 87vh;">

    <el-container class="desktop">

      <el-container>

        <el-header>

              <el-radio-group
                v-model="activeName"
                size="small"
                @change="radioGroup"
              >
                <el-radio-button label="first">任务统计</el-radio-button>
                <el-radio-button label="second">分数统计</el-radio-button>
              </el-radio-group>

          <div
            style="width: 100%;
          background-color:#f4f4f5;
          display: inline-block;
          height: 32px;
          line-height: 32px;"
          >
                <el-form
                  v-show="task"
                  size="small"
                  :inline="true"
                  class="demo-form-inline"
                >
                  <el-form-item>
                    <el-select
                      v-model="UseSituationVal.TemplateID"
                      filterable
                      clearable
                      placeholder="请选择模板"
                      @change="screenSelect"
                    >
                      <el-option
                        v-for="item in TemplateData"
                        :key="item.TemplateID"
                        :label="item.RC_TemplateName"
                        :value="item.TemplateID"
                      />
                    </el-select>
                  </el-form-item>
                  <el-divider direction="vertical" />
                  <el-form-item>
                    <defaultDept @getDefaultDeptsValue="getDefaultDeptValues" />
                  </el-form-item>
                  <el-divider direction="vertical" />
                  <el-form-item>
                    <el-date-picker
                      v-model="date_picker1"
                      type="daterange"
                      align="right"
                      unlink-panels
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      :picker-options="pickerOptions"
                      format="yyyy 年 MM 月 dd 日"
                      value-format="yyyy-MM-dd"
                      @change="datePicker1"
                    />
                  </el-form-item>
                  <el-divider direction="vertical" />
                  <el-form-item>
                    <el-button type="primary" @click="SelectButton">查询</el-button>
                  </el-form-item>
                </el-form>
                <el-form
                  v-show="task2"
                  size="small"
                  :inline="true"
                  class="demo-form-inline"
                >
                  <el-form-item>
                    <el-select
                      ref="el_select"
                      v-model="UseSituationVal.TemplateID"
                      filterable
                      clearable
                      placeholder="请选择模板"
                      @change="screenSelect2"
                    >
                      <el-option
                        v-for="item in TemplateData2"
                        :key="item.TemplateID"
                        :label="item.RC_TemplateName"
                        :value="item.TemplateID"
                      />
                    </el-select>
                  </el-form-item>
                  <el-divider direction="vertical" />
                  <el-form-item>
                    <defaultDepts
                      :value="SelectScoreVal.RC_InspectionDepartment"
                      @getDefaultDeptsValue="getDefaultDeptValues2"
                    />
                  </el-form-item>
                  <el-divider direction="vertical" />
                  <el-form-item>
                    <el-date-picker
                      v-model="date_picker2"
                      type="daterange"
                      align="right"
                      unlink-panels
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      :picker-options="pickerOptions"
                      format="yyyy 年 MM 月 dd 日"
                      value-format="yyyy-MM-dd"
                      @change="datePicker2"
                    />
                  </el-form-item>
                  <el-divider direction="vertical" />
                  <el-form-item>
                    <el-button type="primary" @click="SelectButton">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>

        </el-header>
        <el-main style="margin-top: 30px">
          <el-container>
            <el-container>
              <el-main>
                <transition name="el-zoom-in-center">
                  <el-table
                    v-show="task"
                    v-loading="tableDataLoading"
                    size="mini"
                    :data="tableData"
                    height="calc(100vh - 260px)"
                    border
                    :header-cell-style="{'text-align':'center'}"
                    :cell-style="{'text-align':'center'}"
                    style="width: 100%"
                    stripe
                  >
                    <el-table-column type="index" width="35" />
                    <el-table-column
                      prop="RC_ProjectName"
                      label="项目名称"
                      :show-overflow-tooltip="cellOverflow"
                    />
                    <el-table-column
                      prop="RC_TemplateName"
                      label="模板名称"
                      :show-overflow-tooltip="cellOverflow"
                    />
                    <el-table-column
                      prop="RC_InspectionDepartmentName"
                      label="科室"
                      :show-overflow-tooltip="cellOverflow"
                    />
                    <el-table-column prop="StatusName" label="状态" />
                    <el-table-column
                      prop="RC_InspectionTimeStat"
                      label="填写时间"
                      :show-overflow-tooltip="cellOverflow"
                    >
                      <template slot-scope="{ row }">
                        {{
                          row.RC_InspectionTimeStat
                            ? row.RC_InspectionTimeStat.split('T').join(' ')
                            : ''
                        }}
                      </template>
                    </el-table-column>
                    <el-table-column label="导出" width="80">
                      <template slot-scope="{ row }">
                        <el-button
                          type="success"
                          class="el-icon-download"
                          size="mini"
                          @click="SelectUseTempList(row)"
                        />
                      </template>
                    </el-table-column>
                  </el-table>
                </transition>
                <el-table
                  v-show="task2"
                  v-loading="tableDataLoading"
                  size="mini"
                  :header-cell-style="{'text-align':'center'}"
                  :cell-style="{'text-align':'center'}"
                  :data="tableData2"
                  height="calc(100vh - 260px)"
                  border
                  style="width: 100%"
                  stripe
                >
                  <el-table-column type="index" width="35" />
                  <el-table-column
                    prop="RC_TemplateName"
                    label="模板名称"
                    :show-overflow-tooltip="cellOverflow"
                  />
                  <el-table-column
                    prop="RC_InspectionDepartmentName"
                    label="科室"
                    :show-overflow-tooltip="cellOverflow"
                  />
                  <el-table-column prop="Score" label="平均分" />
                  <el-table-column label="查看统计" align="center" width="100">
                    <template slot-scope="{ row }">
                      <el-button
                        icon="el-icon-search"
                        circle
                        size="mini"
                        @click="score('查看统计', row)"
                      />
                    </template>
                  </el-table-column>
                </el-table>
                <el-row>
                  <el-col :span="2">
                    <el-switch v-model="cellOverflow" style="margin: 6px 0px" />
                  </el-col>
                  <el-col :span="20">
                    <el-pagination
                      v-show="task"
                      background
                      style="margin-top: 10px"
                      :current-page.sync="UseSituationVal.pageIndex"
                      :page-size="20"
                      layout="total, prev, pager, next,jumper"
                      :total="UseSituationVal.total"
                      @current-change="handleCurrentChange"
                    />
                    <el-pagination
                      v-show="task2"
                      background
                      style="margin-top: 10px"
                      :current-page.sync="SelectScoreVal.pageIndex"
                      :page-size="20"
                      layout="total, prev, pager, next,jumper"
                      :total="SelectScoreVal.total"
                      @current-change="handleCurrentChange2"
                    />
                  </el-col>
                </el-row>
                <el-dialog
                  title="导出"
                  :visible.sync="UseTempListDialog"
                  :width="device === 'desktop' ? '50%' : '90%'"
                >
                  <el-form
                    :inline="true"
                    :model="UseTempListVal"
                    class="demo-form-inline"
                    size="mini"
                  >
                    <el-form-item>
                      <el-select
                        v-model="UseTempListVal.RC_ProjectName1"
                        placeholder="请选择项目名称"
                      >
                        <el-option
                          v-for="item1 in UseTempListData"
                          :key="item1.ID"
                          :label="item1.RC_ProjectName"
                          :value="item1.RC_ProjectName"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-select
                        v-model="UseTempListVal.RC_ProjectName2"
                        placeholder="请选择项目名称"
                      >
                        <el-option
                          v-for="item2 in UseTempListData"
                          :key="item2.ID"
                          :label="item2.RC_ProjectName"
                          :value="item2.RC_ProjectName"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-button
                        type="primary"
                        @click="ExportUseTemp"
                      >导出</el-button>
                    </el-form-item>
                  </el-form>
                </el-dialog>
              </el-main>
            </el-container>
            <el-aside width="55%" style="height: calc(100vh -250px)">
              <transition name="el-zoom-in-center">
                <div v-show="task" ref="main_" class="main1_" />
              </transition>
              <div v-show="task3" ref="main2_" class="main_" />
            </el-aside>
          </el-container>
        </el-main>
      </el-container>

    </el-container>
  </el-card>
</template>
<script>
import echarts from 'echarts';
import { SelectUseSituation, SelectUseTemplate } from '@/api/RC_Template';
import {
  ExportUseTemp,
  SelectDeptTemplateDetail,
  SelectScore,
  SelectStatusCount,
  SelectUseTempList
} from '@/api/RC_Statistics';
import defaultDepts from '@/views/components/defaultDepts';
import defaultDept from '@/views/components/defaultDept';
import { mapGetters } from 'vuex';

export default {
  name: 'DailyStatistics',
  components: { defaultDepts, defaultDept },
  data() {
    return {
      tableData: [],
      tableData2: [],
      tableDataLoading: false,
      task: true,
      task2: false,
      task3: true,
      cellOverflow: false,
      TemplateData: [],
      options: '',
      UseSituationVal: {
        pageIndex: 1,
        pageSize: 50,
        total: 0,
        TemplateID: '',
        RC_InspectionDepartmentID: '',
        RC_InspectionDepartment: '',
        StartDate: '',
        EndDate: ''
      },
      ScoreVal: {
        pageSize: 20,
        pageIndex: 1,
        total: 0,
        TemplateID: 0,
        RC_InspectionDepartment: '',
        StartDate: '',
        EndDate: ''
      },
      SelectScoreVal: {
        pageSize: 20,
        pageIndex: 1,
        total: 0,
        TemplateID: 0,
        RC_InspectionDepartment: '',
        StartDate: '',
        EndDate: ''
      },
      TemplateData2: [],
      activeName: 'first',
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
      date_picker1: '',
      date_picker2: '',
      UseTempListData: [],
      UseTempListDialog: false,
      UseTempListVal: {
        RC_ProjectName1: '',
        RC_ProjectName2: ''
      }
    };
  },
  mounted() {
    this.SelectUseTemplate();
    this.SelectUseSituation();
    this.SelectStatusCount();
    this.score();
  },
  computed: {
    ...mapGetters(['device', 'DeptName'])
  },
  methods: {
    radioGroup(val) {
      if (val == 'first') {
        this.task = true;
        this.task2 = false;
        this.task3 = false;
      } else if (val == 'second') {
        this.SelectScoreVal.TemplateID = this.TemplateData2[0].TemplateID;
        this.SelectScoreVal.RC_InspectionDepartment = '';
        this.SelectScore();
        this.task = false;
        this.task2 = true;
        this.task3 = true;
      }
    },
    SelectButton() {
      if (this.activeName == 'first') {
        this.SelectUseSituation();
      } else {
        if (
          !this.UseSituationVal.TemplateID &&
          !this.SelectScoreVal.RC_InspectionDepartment
        ) {
          this.$message.warning('请至少选择科室部门和模板中的一个条件!');
          return;
        }
        this.SelectScore();
      }
    },
    async SelectUseTemplate() {
      const { data } = await SelectUseTemplate({ RC_TemplateName: '' });
      this.TemplateData = data;
      this.TemplateData2 = data;
    },
    async SelectUseSituation() {
      try {
        if (this.activeName == 'first') {
          this.tableDataLoading = true;
          if (!this.UseSituationVal.TemplateID) {
            this.UseSituationVal.TemplateID = 0;
          }
          const { data } = await SelectUseSituation(this.UseSituationVal);
          this.SelectStatusCount();
          this.tableData = data.DataList;
          this.UseSituationVal.total = data.Total;
          if (this.UseSituationVal.TemplateID == 0) {
            this.UseSituationVal.TemplateID = '';
          }
        } else {
          this.SelectScore();
        }
      } catch (error) {}
      this.tableDataLoading = false;
    },
    async SelectScore() {
      try {
        const { data } = await SelectScore(this.SelectScoreVal);
        this.tableData2 = data.DataList;
        this.SelectScoreVal.total = data.Total;
      } catch (error) {}
    },
    getDefaultDeptValues(v) {
      if (this.activeName == 'first') {
        this.UseSituationVal.RC_InspectionDepartment = v;
      } else {
      }
    },
    getDefaultDeptValues2(v) {
      this.SelectScoreVal.TemplateID = '';
      if (this.SelectScoreVal.TemplateID) {
        this.$message.warning(
          '请清空模板,统计只能单独选择模板或者科室进行统计哦!'
        );
      }
      this.SelectScoreVal.TemplateID = 0;
      this.SelectScoreVal.RC_InspectionDepartment = v;
    },
    async score(category, row) {
      let val;
      if (category == '查看统计') {
        val = {
          RC_InspectionDepartment: row.RC_InspectionDepartmentID,
          templateID: row.RC_TemplateID ? row.RC_TemplateID : '0',
          EndDate: row.EndDate,
          StartDate: row.StartDate
        };
      } else {
        val = {
          TemplateID: 1,
          RC_InspectionDepartment: ''
        };
      }

      const main2_ = echarts.init(this.$refs.main2_);
      const { data } = await SelectDeptTemplateDetail(val);
      this.option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            label: {
              show: true
            }
          }
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        legend: {
          data: ['Growth', 'Budget 2011', 'Budget 2012'],
          itemGap: 5
        },
        grid: {
          top: '5%',
          left: '5%',
          right: '10%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: data.ProjectName
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '分数统计(总分)'
          }
        ],
        dataZoom: [
          {
            show: true,
            start: 200,
            end: 300
          },
          {
            type: 'inside',
            start: 94,
            end: 100
          },
          {
            show: true,
            yAxisIndex: 0,
            filterMode: 'empty',
            width: 30,
            height: '80%',
            showDataShadow: false,
            left: '93%'
          }
        ],
        series: [
          {
            name: '分数(总分)',
            type: 'bar',
            data: data.Score
          }
        ]
      };
      main2_.setOption(this.option, true);
    },
    async SelectStatusCount() {
      const main_ = echarts.init(this.$refs.main_);
      const val = await SelectStatusCount({
        TemplateID: this.UseSituationVal.TemplateID,
        RC_InspectionDepartment: this.UseSituationVal.RC_InspectionDepartment
      });
      const vals = val.data[0];
      this.option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: 10,
          data: [
            '未执行',
            '待提交',
            '已提交',
            '主管审核通过',
            '主管审核退回',
            '质管审核通过',
            '质管审核退回',
            '已重新提交'
          ]
        },
        series: [
          {
            name: '任务统计',
            type: 'pie',
            selectedMode: 'single',
            radius: [0, '30%'],
            label: {
              position: 'inner'
            },
            labelLine: {
              show: false
            },
            data: [
              { value: vals.PassCount, name: '已通过', selected: true },
              { value: vals.UnPassCount, name: '未通过' }
            ]
          },
          {
            name: '任务统计',
            type: 'pie',
            radius: ['40%', '55%'],
            label: {
              formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
              backgroundColor: '#eee',
              borderColor: '#aaa',
              borderWidth: 1,
              borderRadius: 4,
              shadowBlur: 3,
              rich: {
                a: {
                  color: '#999',
                  lineHeight: 22,
                  align: 'center'
                },
                hr: {
                  borderColor: '#aaa',
                  width: '100%',
                  borderWidth: 0.5,
                  height: 0
                },
                b: {
                  fontSize: 16,
                  lineHeight: 33
                },
                per: {
                  color: '#eee',
                  backgroundColor: '#334455',
                  padding: [2, 4],
                  borderRadius: 2
                }
              }
            },
            data: [
              { value: vals.UnExecuteCount, name: '未执行' },
              { value: vals.WaitSubmitCount, name: '待提交' },
              { value: vals.SubmitCount, name: '已提交' },
              { value: vals.DirectorPassCount, name: '主管审核通过' },
              { value: vals.DirectorBackCount, name: '主管审核退回' },
              { value: vals.ManagePassCount, name: '质管审核通过' },
              { value: vals.ManageBackCount, name: '质管审核退回' },
              { value: vals.AgainSubmitCOunt, name: '已重新提交' }
            ]
          }
        ]
      };

      main_.setOption(this.option, true);
    },
    handleCurrentChange(val) {
      this.UseSituationVal.pageIndex = val;
      this.SelectUseSituation();
    },
    handleCurrentChange2(val) {
      this.ScoreVal.pageIndex = val;
      this.SelectScore();
    },
    screenSelect(val) {
      this.ScoreVal.TemplateID = val;
    },
    screenSelect2(val) {
      if (this.SelectScoreVal.RC_InspectionDepartment) {
        this.$message.warning('科室和模板只能选一个进行统计哦!');
        this.SelectScoreVal.RC_InspectionDepartment = '';
      }
      this.SelectScoreVal.TemplateID = val;
    },
    datePicker1(val) {
      this.UseSituationVal.StartDate = val[0];
      this.UseSituationVal.EndDate = val[1];
    },
    datePicker2(val) {
      this.SelectScoreVal.StartDate = val[0];
      this.SelectScoreVal.EndDate = val[1];
    },
    async SelectUseTempList(row) {
      try {
        this.UseTempListVal.RC_ProjectName1 = '';
        this.UseTempListVal.RC_ProjectName2 = '';
        const { data } = await SelectUseTempList({
          RC_TemplateID: row.RC_TemplateID,
          RC_InspectionDepartment: row.RC_InspectionDepartmentID
        });
        this.UseTempListData = data;
        this.UseTempListDialog = true;
      } catch (error) {}
    },
    async ExportUseTemp() {
      if (
        !this.UseTempListVal.RC_ProjectName1 ||
        !this.UseTempListVal.RC_ProjectName2
      ) {
        this.$message.warning('请选择要对比的模板');
        return;
      }
      const { data } = await ExportUseTemp({
        RC_TemplateName: this.UseTempListData[0].RC_TemplateName,
        RC_TemplateID: this.UseTempListData[0].RC_TemplateID,
        RC_InspectionDepartment: this.UseTempListData[0]
          .RC_InspectionDepartmentID,
        RC_InspectionDepartmentName: this.UseTempListData[0]
          .RC_InspectionDepartmentName,
        RC_ProjectName1: this.UseTempListVal.RC_ProjectName1,
        RC_ProjectName2: this.UseTempListVal.RC_ProjectName2
      });
      const url = data;
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.setAttribute('download', '自查对比');
      document.body.appendChild(link);
      link.click();
    }
  }
};
</script>
<style lang="scss">
.desktop {
  .main_ {
    height: calc(100vh - 240px);
  }
  .main1_ {
    height: calc(100vh - 180px);
  }
  .el-header {
    height: 42px !important;
    padding: 3px 0 0 0px;
  }

  .el-main {
    padding: 0;
    margin: 0;
  }
  .el-footer {
    height: 35px !important;
  }
  .CatalogName {
    cursor: pointer !important;
    color: #3e84e9;
  }
  .el-dialog {
    height: calc(100vh - 400px);
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
