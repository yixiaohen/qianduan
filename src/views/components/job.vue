<template>
  <el-select
    v-model="job_value"
    placeholder="职称"
    size="mini"
    style="width: 120px;"
    filterable
    clearable
    @clear="job_value = 0"
    @change="getJobValue"
  >
    <el-option
      v-for="item in options"
      :key="item.JobID"
      :label="item.JobName"
      :value="item.JobID"
    />
  </el-select>
</template>

<script>
// 职称组件
import { SelectJob } from '@/api/job';

export default {
  props: {
    value: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      options: [],
      job_value: this.value,
      listQuery: {
        pageSize: 1000,
        pageIndex: 1,
        condition: ''
      }
    };
  },
  watch: {
    value(x) {
      this.job_value = x;
    }
  },
  created() {
    this.SelectJob();
  },
  methods: {
    getJobValue(value) {
      this.$emit('getJobValue', value);
    },
    async SelectJob() {
      try {
        const { data } = await SelectJob(this.listQuery);
        console.log('data', data);
        const zero = {
          JobID: 0,
          JobCode: '00',
          JobName: '请选择职称',
          JobDescription: ''
        };
        data.DataList.unshift(zero);
        this.options = data.DataList;
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>
