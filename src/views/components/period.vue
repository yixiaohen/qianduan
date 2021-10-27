<template>
  <el-select
    v-model="period_value"
    placeholder="批次"
    collapse-tags
    size="mini"
    style="width: 120px;"
    clearable
    @change="getPeriodValue"
  >
    <el-option
      v-for="item in options"
      :key="item.PeriodID"
      :label="item.PeriodName"
      :value="item.PeriodID"
    />
  </el-select>
</template>

<script>
import { SelectPeriod } from '@/api/period';

export default {
  name: 'PeriodComponent',
  data() {
    return {
      listQuery: {
        pageSize: 100,
        pageIndex: 1
      },
      period_value: '',
      options: []
    };
  },
  created() {
    this.SelectPeriod();
  },
  methods: {
    getPeriodValue(value) {
      this.menus_value = value;
      this.$emit('getPeriodValue', this.menus_value);
    },
    async SelectPeriod() {
      try {
        const { data } = await SelectPeriod(this.listQuery);
        this.options = data.DataList;
      } catch {}
    }
  }
};
</script>

<style></style>
