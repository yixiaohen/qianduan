<template>
  <el-table
    :data="tableData"
    style="width: 100%;"
    height="300"
    row-key="CatalogID"
    border
    size="mini"
    lazy
    :load="addChildrenCatalog"
    :tree-props="{ children: 'Children', hasChildren: 'hasChildren' }"
  >
    <el-table-column type="selection" width="40" align="center" />
    <el-table-column prop="CatalogCode" label="编号" width="160" />
    <el-table-column prop="CatalogName" label="内容" />
  </el-table>
</template>
<script>
import { SelectCatalog } from '@/api/catalog';

export default {
  name: 'ReviewstandardComponents',
  data() {
    return {
      tableData: [],
      formCatalog: {
        CatalogID: 0,
        SerialNo: '',
        CatalogCode: '',
        CatalogName: '',
        IsCriterion: false,
        IsPoint: false,
        CatalogID2: 0
      }
    };
  },
  created() {
    this.SelectCatalog();
  },
  methods: {
    async SelectCatalog(ParentID = 0) {
      try {
        const { data } = await SelectCatalog({ ParentID });
        if (data instanceof Array) {
          data.map(item => {
            item.hasChildren = true;
          });
          this.tableData = data;
        }
      } catch {
      } finally {
        this.loading = false;
      }
    },
    async addChildrenCatalog(tree, treeNode, resolve) {
      try {
        const { data } = await SelectCatalog({ CatalogID: tree.CatalogID });
        if (data instanceof Array) {
          data.map(item => {
            item.hasChildren = true;
          });
          resolve(data);
        }
      } catch {}
    }
  }
};
</script>
