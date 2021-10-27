<template>
  <div>
    <el-tree
      :props="props"
      :load="loadNode"
      lazy
      @node-click="dianji"
      @check-change="handleCheckChange"
    >

    </el-tree>
  </div>
</template>
<script>
import { SelectDeptIndex } from '@/api/indicator/I_IndexAlloc';

export default {
  data() {
    return {
      indexID: 0,
      treeData: [],
      props: {
        label: 'name',
        children: 'children'
      },
      count: 1
    };
  },
  created() {
    this.SelectDeptIndex();
  },
  methods: {
    dianji(data) {
      console.log('是你吗', data);
      this.indexID = data.index_id;
    },

    handleCheckChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate);
    },
    handleNodeClick(data) {

    },
    async loadNode(node, resolve) {

      if (node && node.level === 0) {
        const { data, code } = await SelectDeptIndex({
          index_id: 0,
          userID: window.userInfo[0].UserID
        });
        this.treeData = data;
        return resolve && resolve(this.treeData);
      } else {
        const { data, code } = await SelectDeptIndex({
          index_id: this.indexID,
          userID: window.userInfo[0].UserID
        });
        this.treeData = data;
        return resolve && resolve(this.treeData);
      }

    }
  }
};
</script>
