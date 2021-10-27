<template>
  <div style="height:calc(35vh);overflow:auto">
    <el-tree
      ref="Trees"
      :data="dataAlignObject"
      show-checkbox
      node-key="ObjectID"
      check-strictly
      default-expand-all
      :default-checked-keys="defaultCheckedKeys"
      :props="{
        children: 'Children',
        label: 'ObjectName',
        disabled: 'CheckState',
      }"
      @check-change="handleCheckChange"
    />
  </div>
</template>
<script>
export default {
  props: {
    dataAlignObject: {
      type: Array,
      default: []
    },
    defaultCheckedKeys: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      radio10: 1,
      CycleDataTree: []
    };
  },
  methods: {
    handleCheckChange(data, checked) {
      this.$emit('CheckChange', {
        data,
        checked
      });
    }
  }
};
</script>
<style lang="scss">
el-tree {
  height: calc(100vh - 600px);
}
</style>
