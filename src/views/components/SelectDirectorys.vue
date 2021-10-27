<template>
  <el-cascader
    v-model="dept_value"
    :props="props"
    clearable
    :placeholder="place"
    size="mini"
    change-on-select
    filterable
    :show-all-levels="false"
    :style="'width:' + width"
    @change="getDefaultDeptValue"
    @clear="dept_value = 0"
  />
</template>

<script>
// 单选科室
import { SelectDirectorys } from '@/api/KmApi';

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
      default: '180px'
    },
    placeholder: {
      type: String,
      default: '请选择目录'
    }
  },
  data() {
    return {
      options: [],
      width: this.w,
      num: '',
      dept_value: this.value,
      place: this.placeholder,
      props: {
        lazy: true,
        value: 'DirectoryID',
        label: 'DirectoryName',
        children: 'Children',
        checkStrictly: true,
        multiple: this.multiple,
        async lazyLoad(node, resolve) {
          if (node.children) {
            if (node.children[0] != undefined) {
              try {
                const { data } = await SelectDirectorys();
                data.map(item => {
                  item.hasChildren = true;
                });
                resolve(data);
              } catch {}
            }
            resolve();
            return;
          }
          try {
            const { data } = await SelectDirectorys();
            data.map(item => {
              item.hasChildren = true;
            });
            resolve(data);
          } catch {}
        }
      }
    };
  },
  watch: {
    value(x) {
      this.dept_value = x;
    }
  },
  mounted() {},
  methods: {
    getDefaultDeptValue(value, title) {
      this.$emit('getDefaultDeptValue', value[value.length - 1]);
    },
    async SelectDept() {
      try {
        const { data } = await SelectDirectorys(this.formDept);
        this.options = data;
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
