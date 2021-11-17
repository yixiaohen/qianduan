<template>
  <el-select
    v-model="DeptName"
    style="margin-top: -7px"
    placeholder="请选择部门"
    clearable
    size="mini"
    @change="selectText"
    @clear="clear"
  >
    <!--至少写一个el-option，否则无法显示tree  -->
    <el-option
      label="0"
      value="0"
    />
    <div style="widht: 600px; height: 235px; margin-top: -34px">
      <el-input
        v-model="filterText"
        size="mini"
        clearable
        placeholder="关键字查询(回车查询)"
        @keyup.enter.native="filterName"
      />
      <el-tree
        ref="treeDepts"
        :data="DeptsData"
        :props="{
          value: 'DeptID',
          label: 'DeptName',
          children: 'Children',
        }"
        show-checkbox
        node-key="DeptID"
        check-on-click-node
        :check-strictly="true"
        :default-checked-keys="dept_value"
        :default-expanded-keys="[1]"
        :filter-node-method="filterNode"
        @clear="clear1"
        @check="getSelectTreeDept"
        @check-change="handleCheckChange"
      />
    </div>
  </el-select>
</template>

<script>
// 单选科室
import { SelectDepts } from '@/api/user';

export default {
  props: {
    emitPath: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    value: {
      default: 0
    },
    w: {
      type: String,
      default: '180px'
    },
    placeholder: {
      type: String,
      default: '请选择部门'
    }
  },
  data() {
    return {
      width: this.w,
      num: '',
      dept_value:
        Object.prototype.toString.call(this.value) == '[object Array]'
          ? this.value
          : typeof this.value === 'string'
            ? this.value.split(',')
            : typeof this.value === 'number'
              ? [this.value]
              : this.value,
      place: this.placeholder,
      DeptsData: [],
      DeptName: '',
      filterText: '',
      controller: true
    };
  },
  watch: {
    value(x) {
      this.dept_value =
        Object.prototype.toString.call(x) == '[object Array]'
          ? x
          : typeof x === 'string'
            ? x.split(',')
            : typeof x === 'number'
              ? [x]
              : x;
      this.$refs.treeDepts.setCheckedKeys([]);
      this.$refs.treeDepts.setCheckedKeys(this.dept_value);
    }
  },
  created() {
    this.SelectDepts();
  },
  updated() {
    this.$nextTick(() => {
      if (
        this.dept_value &&
        !this.multiple &&
        this.$refs.treeDepts.getCheckedNodes().length > 0
      ) {
        /* 默认单选选中的节点展示出来 */
        this.DeptName = this.$refs.treeDepts.getCheckedNodes()[0].DeptName;
      } else if (this.$refs.treeDepts.getCheckedNodes().length > 0) {
        this.DeptName = this.$refs.treeDepts.getCheckedNodes()[0].DeptName;
      }
    });
  },
  methods: {
    async SelectDepts() {
      try {
        const { data } = await SelectDepts({ data: 'data2' });
        this.DeptsData = data;
      } catch {
      }
    },
    clear1() {
      var auto = '清空了';
      this.$emit('clear', auto);
    },
    getSelectTreeDept(value) {
      if (!this.multiple) {
        /* 单选 */
        this.$refs.treeDepts.setCheckedKeys([value.DeptID]);
        this.DeptName = value.DeptName;
        this.$emit('getDefaultDeptsValue', value.DeptID.toString());

      }
    },
    handleCheckChange(data, checked, indeterminate, getHalfCheckedKeys) {
      /* 多选 */
      const arrs = [];
      if (this.multiple) {
        const checkData = this.$refs.treeDepts.getCheckedNodes();
        checkData.map((item) => {
          arrs.push(item.DeptID);
        });
        this.$emit('getDefaultDeptsValue', arrs);
      }
    },
    filterName() {
      this.$refs.treeDepts.filter(this.filterText);
    },
    filterNode(value, data, node) {
      if (!value) return true;
      if (this.filterText) {
        const one = data.DeptName.indexOf(value) !== -1;
        const two =
          node.parent &&
          node.parent.data &&
          node.parent.data.DeptName &&
          node.parent.data.DeptName.indexOf(value) !== -1;
        const three =
          node.parent &&
          node.parent.parent &&
          node.parent.parent.data &&
          node.parent.parent.data.DeptName &&
          node.parent.parent.data.DeptName.indexOf(value) !== -1;
        const four =
          node.parent &&
          node.parent.parent &&
          node.parent.parent.parent &&
          node.parent.parent.parent.data &&
          node.parent.parent.parent.data.DeptName &&
          node.parent.parent.parent.data.DeptName.indexOf(value) !== -1;
        const five =
          node.parent &&
          node.parent.parent &&
          node.parent.parent.parent &&
          node.parent.parent.parent.parent &&
          node.parent.parent.parent.parent.data &&
          node.parent.parent.parent.parent.data.DeptName &&
          node.parent.parent.parent.parent.data.DeptName.indexOf(value) !== -1;
        let result_one = false;
        let result_two = false;
        let result_three = false;
        let result_four = false;
        let result_five = false;
        if (node.level === 1) {
          result_one = one;
        } else if (node.level === 2) {
          result_two = one || two;
        } else if (node.level === 3) {
          result_three = one || two || three;
        } else if (node.level === 4) {
          result_four = one || two || three || four;
        } else if (node.level === 5) {
          result_five = one || two || three || four || five;
        }
        return (
          result_one || result_two || result_three || result_four || result_five
        );
      }
    },
    selectText(val) {
      if (!val) {
        this.$emit('getDefaultDeptsValue', '');
      }
    },
    clear() {
      this.DeptName = '';
      this.$refs.treeDepts.setCheckedKeys([]);
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
