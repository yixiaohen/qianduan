<template>
  <el-cascader
    v-model="dept_value"
    :options="options"
    placeholder="请选择人员"
    :props="props"
    collapse-tags
    clearable
    size="mini"
    :style="'width:' + width"
    @change="getDeptorUser"
    @clear="dept_value = 0"
  />
</template>

<script>
// 多选人
import { SelectDeptorUser } from '@/api/institution';

export default {
  props: {
    multiple: {
      type: Boolean,
      default: true
    },
    value: {
      default: 0
    },
    w: {
      type: String,
      default: '180px'
    }
  },
  data() {
    return {
      options: [],
      width: this.w,
      num: '',
      dept_value: this.value,
      props: {
        value: 'UserID',
        label: 'Name',
        children: 'children',
        multiple: this.multiple
      }
    };
  },
  created() {
    this.SelectDeptorUser();
  },
  methods: {
    getDeptorUser(value, title) {
      const val = [];
      value.map((item, index) => {
        item.map((item2, index2) => {
          if (item2 != 0) {
            val.push(item2);
          }
        });
      });
      this.$emit('getDeptorUser', val);
    },
    async SelectDeptorUser() {
      try {
        const { data } = await SelectDeptorUser();
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
