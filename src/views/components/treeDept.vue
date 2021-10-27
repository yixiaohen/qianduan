<template>
  <div class="Dept">
    <el-tree
      ref="tree"
      :data="tableData"
      :props="props"
      show-checkbox
      default-expand-all
      node-key="DeptID"
      :check-strictly="true"
      @check="getSelectTreeDept"
    />
  </div>
</template>

<script>
import { SelectDepts } from '@/api/user';

export default {
  name: 'TreeDeptComponent',
  props: {
    value: {
      type: String,
      default: ''
    },
    multiple: {
      type: Boolean,
      default: true
    },
    defaultchecked: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      props: {
        value: 'DeptID',
        label: 'DeptName',
        children: 'Children',
        multiple: this.multiple
      },
      strictly: false,
      tableData: [],
      checked: this.defaultchecked.split(','),
      treeDeptValue: this.value
    };
  },
  created() {
    this.SelectTreeDept();
  },
  methods: {
    getSelectTreeDept(value) {
      const treeDeptValue = this.$refs.tree.getCheckedKeys();
      this.$emit('getSelectTreeDept', treeDeptValue);
    },
    async SelectTreeDept() {
      try {
        const { data } = await SelectDepts();
        this.tableData = data;
      } catch {}
    },
    setCheckedKeys(v) {
      this.treeDeptValue = v;
      this.$refs.tree.setCheckedKeys(this.treeDeptValue);
      this.$emit('getSelectTreeDept', v);
    },
    resetChecked() {
      this.$refs.tree.setCheckedKeys([]);
    }
  }
};
</script>

<style lang="scss">
.Dept {
  height: 280px;
  overflow-y: auto;
}
</style>
