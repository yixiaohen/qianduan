<template>
  <div class="TreeCatalog" :style="{ maxHeight: maxheight }">
    <el-tree
      ref="TreeCatalog"
      :props="props"
      :load="loadNode"
      node-key="CatalogID"
      lazy
      :show-checkbox="multiples"
      @node-click="nodeClickCatalog"
      @check="getSelectTreeCatalog"
    >
      <span slot-scope="{ node, data }" class="custom-tree-node">
        <span>
          <svg-icon v-if="data.Count > 0" icon-class="file" />
          <svg-icon v-else icon-class="file_two" />
          {{ node.label }}
          <span v-if="data.Count == 0">{{
            uploadstate == 1
              ? '----已上传'
              : uploadstate == 2
                ? '----未上传'
                : ''
          }}</span>
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { SelectCatalogAuthorizationUserByRules } from '@/api/catalog'; // 这里和kmCatalog.vue中的SelectCatalogByParentID区别在于这里有根据用户权限控制
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
    maxheight: {
      type: String,
      default: '3000px'
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
  computed: {
    ...mapGetters(['device'])
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
          const { data } = await SelectCatalogAuthorizationUserByRules({
            dev: this.device,
            CatalogID: 0,
            UserID: window.userInfo[0].UserID,
            UploadState: this.uploadstate
          });
          data.forEach(element => {
            element.CatalogCode = element.CatalogName;
          });
          // data.CatalogCode+= data.CatalogName;
          resolve && resolve(data);
        } catch {
        }
      } else {
        try {
          const { data } = await SelectCatalogAuthorizationUserByRules({
            CatalogID: node && node.data.CatalogID,
            UserID: window.userInfo[0].UserID,
            UploadState: this.uploadstate
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
<style lang="scss">
.TreeCatalog {
  height: 100%;
  overflow: auto;
}

/* 改变被点击节点背景颜色，字体颜色 */
.el-tree-node:focus > .el-tree-node__content {
  background-color: #84C1FF !important;
  color: #fff !important;
}

/*节点失焦时的背景颜色*/
.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: #84C1FF !important;
  color: #fff !important;
}
</style>
