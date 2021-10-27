<template>
  <div class="TreeCatalog">
    <el-tree
      ref="TreeCatalog"
      :props="props"
      :load="loadNode"
      node-key="CatalogID"
      lazy
      :show-checkbox="multiples"
      @node-click="nodeClickCatalog"
      @check="getSelectTreeCatalog"
    />
  </div>
</template>

<script>
import { SelectCatalogByParentID } from '@/api/KmApi'; // 这里和standardCatalog.vue中的SelectCatalogAuthorizationUser区别在于这里没有权限控制
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    multiple: {
      type: Boolean,
      default: false
    },
    height: {
      type: String,
      default: '742px'
    },
    uploadstate: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      props: {
        label: 'CatalogCode',
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
          const { data } = await SelectCatalogByParentID({
            condition: ''
          });
          data.forEach(element => {
            element.CatalogCode = element.CatalogName;
          });
          // data.CatalogCode+= data.CatalogName;
          resolve && resolve(data);
        } catch {}
      } else {
        try {
          const { data } = await SelectCatalogByParentID({
            condition: node && node.data.CatalogID
          });
          resolve && resolve(data);
        } catch {}
      }
    }
  }
};
</script>
<style lang="scss">
.TreeCatalog {
  height: 100%;
  max-height: 500px;
  overflow: auto;
}
</style>
