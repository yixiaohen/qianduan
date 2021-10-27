<template>
  <!-- 目标和成果树形图 -->
  <el-row class="tragetTree">
    <div class="custom-tree-container">
      <div class="block">
        <el-tree
          class="tree-line"
          :props="props"
          :load="loadNode"
          :indent="0"
          lazy
          accordion
          :expand-on-click-node="false"
        >
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <span>{{ node.label }}</span>
            <span>
              <el-button
                v-if="data.label.indexOf('目标') != -1"
                type="text"
                size="mini"
                @click="() => editorTree(data)"
              >
                <i class="el-icon-edit" />
              </el-button>
              <el-popconfirm
                v-if="RoleCode === 'R0001' && data.label.indexOf('目标') != -1"
                confirm-button-text="是"
                cancel-button-text="否"
                icon="el-icon-info"
                icon-color="red"
                title="确定删除吗？"
                @confirm="() => deleteTree(node, data)"
              >
                <el-button slot="reference" type="text" size="mini">
                  <i class="el-icon-delete" />
                </el-button>
              </el-popconfirm>
            </span>
          </span>
        </el-tree>
      </div>
    </div>
    <el-dialog
      title="关键成果关联选择"
      :visible.sync="dialogVisible"
      :width="device === 'mobile' ? '90%' : '30%'"
    >
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">关闭</el-button>
        <el-button
          type="primary"
          size="mini"
          @click="dialogVisible = false"
        >确 定</el-button>
      </span>
    </el-dialog>
  </el-row>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    treeValue: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      props: {
        label: 'label',
        children: 'children',
        isLeaf: 'leaf'
      },
      RoleCode: window.userInfo[0].RoleCode,
      dialogVisible: false
    };
  },
  computed: {
    ...mapGetters(['device'])
  },
  created() {},
  methods: {
    editorTree(data) {
      this.dialogVisible = true;
      this.$emit('editor', data);
    },
    deleteTree(node, data) {
      console.log(node);
      /* 如果父组件不传数据则默认使用子组件的弹窗删除功能 */

      const parent = node.node;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
      this.$emit('delete', data);
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve([
          { label: '目标 1', children: [1], id: 1 },
          { label: '目标 2', children: [2], id: 2 }
        ]);
      }
      if (node.level > 0) {
        return resolve([
          { label: '成果0 ' + node.level },
          { label: '成果1' + node.level }
        ]);
      }
    }
  }
};
</script>

<style lang="scss">
.targertTree {
  height: calc(100vh - 200px);
  .tree-line {
    .el-tree-node {
      position: relative;
      padding-left: 16px; // 缩进量
    }
    .el-tree-node__children {
      padding-left: 16px; // 缩进量
    }

    // 竖线
    .el-tree-node::before {
      content: '';
      height: 100%;
      width: 1px;
      position: absolute;
      left: -3px;
      top: -26px;
      border-width: 1px;
      border-left: 1px dashed #52627c;
    }
    // 当前层最后一个节点的竖线高度固定
    .el-tree-node:last-child::before {
      height: 38px; // 可以自己调节到合适数值
    }

    // 横线
    .el-tree-node::after {
      content: '';
      width: 24px;
      height: 20px;
      position: absolute;
      left: -3px;
      top: 12px;
      border-width: 1px;
      border-top: 1px dashed #52627c;
    }

    // 去掉最顶层的虚线，放最下面样式才不会被上面的覆盖了
    & > .el-tree-node::after {
      border-top: none;
    }
    & > .el-tree-node::before {
      border-left: none;
    }

    // 展开关闭的icon
    .el-tree-node__expand-icon {
      font-size: 16px;
      // 叶子节点（无子节点）
      &.is-leaf {
        color: transparent;
        // display: none; // 也可以去掉
      }
    }
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
}
</style>
