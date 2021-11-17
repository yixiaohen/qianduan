<template>
  <div class="TreeCatalog">
    <el-tree
      ref="TreeCatalog"
      :props="props"
      :load="loadNode"
      node-key="index_id"
      lazy
      highlight-current
      :show-checkbox="multiples"
      @node-click="nodeClickCatalog"
      @check="getSelectTreeCatalog"
    >
      <span slot-scope="{ node, data }" class="custom-tree-node">
        <span v-if="data.Count > 0" style="font-size: 14px;font-weight: bolder">

          <svg-icon
            v-if="data.imported===1"
            icon-class="importDir"
          />
          <svg-icon
            v-else
            icon-class="treeFileDir"
          />
          {{ node.label }}</span>

        <span v-else style="font-size: 12px">
          <svg-icon
            v-if="data.imported===1"
            icon-class="importFile"
          />
          <svg-icon
            v-else
            icon-class="treeFile"
          />
          {{ node.label }}
        </span>
      </span></el-tree>
  </div>
</template>

<script>
import { SelectDeptIndex } from '@/api/indicator/I_IndexAlloc';

export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    multiple: {
      type: Boolean,
      default: false
    }
    // maxheight: {
    //   type: String,
    //   default: '3000px'
    // }
    // uploadstate: {
    //   type: String,
    //   default: ''
    // }
  },
  data() {
    return {
      listLoading: false,
      props: {
        label: 'name',
        children: 'children',
        isLeaf: function(data, node) {
          return data.Count === 0;
        }
      },
      multiples: this.multiple
    };
  },

  methods: {
    nodeClickCatalog(v) {
      this.$emit('nodeClickCatalog', v);
    },
    getSelectTreeCatalog() {
      const TreeCatalog = this.$refs.TreeCatalog.getCheckedKeys();
      this.$emit('getSelectTreeCatalog', TreeCatalog);
    },
    async loadNode(node, resolve) {
      if (node && node.level === 0) {
        try {
          const { data } = await SelectDeptIndex({
            index_id: 0,
            UserID: window.userInfo[0].UserID
          });
          resolve && resolve(data);
        } catch (e) {
          console.log(e);
        }
      } else {
        try {
          const { data } = await SelectDeptIndex({
            index_id: node && node.data.index_id,
            UserID: window.userInfo[0].UserID
          });
          resolve && resolve(data);
        } catch (e) {
          console.log(e);
        }
      }
    }
  }
};
</script>
<style lang="scss" >
.TreeCatalog {
  height: 100%;
  font-size: 16px;
  overflow: auto;
}

/* 改变被点击节点背景颜色，字体颜色 */
.el-tree-node:focus > .el-tree-node__content {
  background-color: #1890ff !important;
  color: #fff !important;
}

/*节点失焦时的背景颜色*/
.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: #1890ff !important;
  color: #fff !important;
}
</style>
