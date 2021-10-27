<template>
  <el-cascader
    v-model="dept_value"
    :props="props"
    clearable
    placeholder="科室"
    size="mini"
    change-on-select
    filterable
    :show-all-levels="false"
    :style="'width:' + width"
    @change="getDefaultDeptValue"
  />
</template>

<script>
// 单选科室
import { SelectDept } from '@/api/user';

export default {
  props: {
    multiple: {
      // 这个就是父组件中子标签自定义名字
      type: Boolean,
      default: false
    },
    value: {
      type: Number,
      default: 0
    },
    w: {
      type: String,
      default: '160px'
    }
  },
  data() {
    return {
      options: [],
      width: this.w,
      dept_value: this.value,
      props: {
        lazy: true,
        value: 'DeptID',
        label: 'DeptName',
        children: 'Children',
        checkStrictly: true,
        multiple: this.multiple,
        async lazyLoad(node, resolve) {
          try {
            const { data } = await SelectDept({ DeptID: node.value });
            data.map(item => {
              item.hasChildren = true;
            });
            resolve(data);
          } catch {}
        }
      },
      formDept: {
        ParentID: 0,
        DeptCode: '',
        DeptName: '',
        DeptDescription: '',
        DeptParentName: ''
      }
    };
  },
  watch: {
    value(x) {
      this.dept_value = x;
    }
  },
  created() {
    this.SelectDept();
  },
  methods: {
    async getDefaultDeptValue(value) {
      try {
        const { data } = await SelectDept(
          { DeptID: value[value.length - 2] } || this.formDept
        );
        data.forEach(item => {
          if (item.DeptID === value[value.length - 1]) {
            this.$emit('getDefaultDeptValue', item.DeptName);
          }
        });
      } catch {}
    },
    async SelectDept() {
      try {
        const { data } = await SelectDept(this.formDept);
        if (data instanceof Array) {
          data.map(item => {
            item.hasChildren = true;
          });
          this.options = data;
        }
      } catch {}
    }
  }
};
</script>
