<template>
  <div class="cascader">
    <el-cascader
      v-model="agc_value"
      :options="options"
      :props="props"
      clearable
      placeholder="资料类别"
      size="mini"
      :show-all-levels="false"
      @change="getSelectAllArticleGroupValue"
    />
  </div>
</template>

<script>
import { SelectAllArticleGroup } from '@/api/KmApi';

export default {
  name: 'Cascader',
  props: {
    multiple: {
      // 这个就是父组件中子标签自定义名字
      type: Boolean,
      default: false
    },
    value: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      agc_value: this.value,
      options: [],
      props: {
        value: 'GroupID',
        label: 'GroupName',
        children: 'Children',
        checkStrictly: true,
        multiple: this.multiple
      }
    };
  },
  watch: {
    value(x) {
      this.agc_value = x;
    }
  },
  created() {
    this.SelectAllArticleGroup();
  },
  methods: {
    getSelectAllArticleGroupValue(value) {
      this.$emit('getSelectAllArticleGroupValue', value[value.length - 1]);
    },
    async SelectAllArticleGroup() {
      try {
        const { data } = await SelectAllArticleGroup({
          condition: ''
        });
        this.options = data;
      } catch {}
    }
  }
};
</script>

<style lang="scss">
.el-scrollbar__wrap {
  overflow-x: hidden;
  margin-bottom: 0px !important;
}
</style>
