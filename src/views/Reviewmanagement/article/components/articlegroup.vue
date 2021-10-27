<template>
  <div>
    <el-cascader
      v-model="agc_value"
      :options="options"
      :props="props"
      clearable
      @change="getSelectAllArticleGroupValue"
    >
      <template slot-scope="{ node, data }">
        <span>{{ data.GroupName }}</span>
        <span v-if="!node.isLeaf"> ({{ data.Children.length }}) </span>
      </template>
    </el-cascader>
  </div>
</template>
<script>
import { SelectAllArticleGroup } from '@/api/Article';

export default {
  props: {
    value: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      props: {
        value: 'GroupID',
        label: 'GroupName',
        children: 'Children',
        checkStrictly: true,
        multiple: this.multiple
      },
      options: [],
      agc_value: this.value
    };
  },
  created() {
    this.SelectAllArticleGroup();
  },
  methods: {
    clear() {
      this.agc_value = 0;
    },
    select(val) {
      this.agc_value = val;
    },
    async SelectAllArticleGroup() {
      try {
        const { data } = await SelectAllArticleGroup();
        this.options = data;
      } catch (error) {
        console.log(error);
      }
    },
    getSelectAllArticleGroupValue(value) {
      this.options.map(item => {
        this.$emit('getSelectAllArticleGroupValue', value[value.length - 1]);
      });
    }
  }
};
</script>
