<template>
  <el-select
    v-model="position_value"
    placeholder="职位"
    size="mini"
    filterable
    clearable
    style="width: 120px;"
    @change="getPositionValue"
    @clear="position_value = 0"
  >
    <el-option
      v-for="item in options"
      :key="item.PositionID"
      :label="item.PositionName"
      :value="item.PositionID"
    />
  </el-select>
</template>

<script>
// 职位组件
import { SelectPosition } from '@/api/position';

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
      position_value: this.value,
      listQuery: {
        pageSize: 1000,
        pageIndex: 1,
        condition: ''
      }
    };
  },
  watch: {
    value(x) {
      this.position_value = x;
    }
  },
  mounted() {
    this.SelectPosition();
  },
  methods: {
    getPositionValue(value) {
      this.$emit('getPositionValue', value);
    },
    async SelectPosition() {
      try {
        const { data } = await SelectPosition(this.listQuery);
        const zero = {
          PositionID: 0,
          PositionCode: '0',
          PositionName: '请选择职位',
          PositionDescription: ''
        };
        data.DataList.unshift(zero);
        this.options = data.DataList;
      } catch {}
    }
  }
};
</script>
