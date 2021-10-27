<template>
  <el-row>
    <el-row>
      <el-col :span="6">目标类型</el-col>
      <el-col :span="18">
        <el-radio-group
          v-model="dialogObjFm.ObjectType"
          size="mini"
        >
          <el-radio-button
            v-if="level === 0"
            :label="0"
          >个人级</el-radio-button>
          <el-radio-button
            v-if="level === 1"
            :label="1"
          >科室级</el-radio-button>
          <el-radio-button
            v-if="level === 2"
            :label="2"
          >院级</el-radio-button>
        </el-radio-group>
      </el-col>
    </el-row>
    <el-divider />
    <el-row>
      <el-col :span="6">周期类型</el-col>
      <el-col :span="18">
        <el-radio-group
          v-model="dialogObjFm.CycleType"
          size="mini"
          @change="radioGroupType"
        >
          <el-radio-button label="月度" />
          <el-radio-button label="季度" />
          <el-radio-button label="半年度" />
          <el-radio-button label="年度" />
          <el-radio-button label="自定义" />
        </el-radio-group>
      </el-col>
    </el-row>
    <el-divider />
    <el-row>
      <el-col :span="6">周期时间</el-col>
      <el-col
        v-if="dialogObjFm.CycleType != '自定义'"
        :span="6"
      >
        <el-date-picker
          v-model="dialogObjFm.Year"
          type="year"
          placeholder="选择年"
          size="mini"
          format="yyyy 年"
          value-format="yyyy"
          style="width: 120px"
          @change="SelectCycle"
        />
      </el-col>
      <el-col :span="12">
        <el-select
          v-show="dialogObjFm.CycleType == '月度'"
          v-model="dialogObjFm.ObjectName"
          placeholder="请选择月度"
          size="mini"
        >
          <el-option
            v-for="item in opt.month"
            :key="item.value"
            :label="item.ObjectName"
            :value="item.ObjectName"
            :disabled="item.State !== '未设立'"
          >
            <span style="float: left">{{ item.ObjectName }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{
              item.State
            }}</span>
          </el-option>
        </el-select>
        <el-select
          v-show="dialogObjFm.CycleType == '季度'"
          v-model="dialogObjFm.ObjectName"
          placeholder="请选择季度"
          size="mini"
        >
          <el-option
            v-for="item in opt.quarter"
            :key="item.ObjectName"
            :label="item.ObjectName"
            :value="item.ObjectName"
            :disabled="item.State != '未设立'"
          >
            <span style="float: left">{{ item.ObjectName }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{
              item.State
            }}</span>
          </el-option>
        </el-select>
        <el-select
          v-show="dialogObjFm.CycleType == '半年度'"
          v-model="dialogObjFm.ObjectName"
          placeholder="请选择半年度"
          size="mini"
        >
          <el-option
            v-for="item in opt.semester"
            :key="item.ObjectName"
            :label="item.ObjectName"
            :value="item.ObjectName"
            :disabled="item.State != '未设立'"
          >
            <span style="float: left">{{ item.ObjectName }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{
              item.State
            }}</span>
          </el-option>

        </el-select>
        <el-date-picker
          v-show="dialogObjFm.CycleType == '自定义'"
          v-model="dialogObjFm.CycleName"
          type="datetimerange"
          size="mini"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-col>
    </el-row>
  </el-row>
</template>
<script>
import { SelectCycle } from '@/api/okr/cycle';

export default {
  props: {
    level: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      dialogObjFm: {
        ObjectType: this.level || 0,
        type: 0,
        CycleType: '月度',
        Year: '',
        cycle: '2',
        StartDate: '',
        EndDate: '',
        CycleName: '',
        ObjectName: '',
        CreateUserID: window.userInfo[0].UserID
      },

      opt: {
        month: [
          { value: '1', label: '一月份目标', status: '未设立' },
          { value: '2', label: '二月份目标', status: '未设立' },
          { value: '3', label: '三月份目标', status: '未设立' },
          { value: '4', label: '四月份目标', status: '未设立' },
          { value: '5', label: '五月份目标', status: '未设立' },
          { value: '6', label: '六月份目标', status: '未设立' },
          { value: '7', label: '七月份目标', status: '未设立' },
          { value: '8', label: '八月份目标', status: '未设立' },
          { value: '9', label: '九月份目标', status: '未设立' },
          { value: '10', label: '十月份目标', status: '未设立' },
          { value: '11', label: '十一月份目标', status: '未设立' },
          { value: '12', label: '十二月份目标', status: '未设立' }
        ],
        quarter: [
          {
            value: '第一季度',
            label: '第一季度',
            status: '进行中',
            disabled: true
          },
          {
            value: '第二季度',
            label: '第二季度',
            status: '未开始',
            disabled: false
          },
          {
            value: '第三季度',
            label: '第三季度',
            status: '未开始',
            disabled: false
          },
          {
            value: '第四季度',
            label: '第四季度',
            status: '未开始',
            disabled: false
          }
        ],
        semester: [
          {
            ObjectName: '上半年',
            State: '进行中'
          },
          {
            ObjectName: '下半年',
            State: '未开始'
          }
        ]
      }
    };
  },
  created() {
    this.dialogObjFm.Year = new Date().getFullYear().toString();
    this.SelectCycle();
  },
  methods: {
    radioGroupType(val) {
      this.dialogObjFm.Year = new Date().getFullYear().toString();
      this.dialogObjFm.cycle = '';
      this.dialogObjFm.CycleType = val;
      this.SelectCycle();
    },
    getDialogObjFm() {
      if (this.dialogObjFm.CycleType === '自定义') {
        this.dialogObjFm.StartDate = this.dialogObjFm.cycle[0];
        this.dialogObjFm.EndDate = this.dialogObjFm.cycle[1];
        this.dialogObjFm.cycle = [];
      }

      return this.dialogObjFm;
    },
    async SelectCycle() {
      const { data } = await SelectCycle({
        CycleType: this.dialogObjFm.CycleType,
        ObjectType: this.dialogObjFm.ObjectType,
        Year: this.dialogObjFm.Year
      });
      if (this.dialogObjFm.CycleType === '月度') {
        this.opt.month = data;
      } else if (this.dialogObjFm.CycleType === '季度') {
        this.opt.quarter = data;
      } else if (this.dialogObjFm.CycleType === '半年度') {
        this.opt.semester = data;
      } else if (this.dialogObjFm.CycleType === '年度') {
      }
    }
  }
};
</script>
