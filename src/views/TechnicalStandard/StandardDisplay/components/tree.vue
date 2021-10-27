<template>
  <div class="block">
    <el-form :inline="true" class="demo-form-inline" size="mini">
      <el-form-item v-if="treeData.length < 1">
        <el-button
          icon="el-icon-plus"
          type="text"
          size="mini"
          @click="addOne"
        >添加</el-button>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="filterText"
          placeholder="回车搜索"
          maxlength="200"
          clearable
          @keyup.enter.native="filterName"
        ><i slot="prefix" class="el-input__icon el-icon-search" /></el-input>
      </el-form-item>
    </el-form>
    <el-button
      v-if="treeData.length < 1"
      icon="el-icon-plus"
      type="text"
      size="mini"
      @click="addOne"
    >添加</el-button>
    <el-tree
      ref="trees"
      class="tree-line"
      :data="treeData"
      :props="{
        children: 'Children',
        label: 'DirectoryName',
        id: 'DirectoryID',
        ParentID: 'ParentID',
        Type: 'Type',
      }"
      node-key="DirectoryID"
      accordion
      :expand-on-click-node="false"
      :default-expanded-keys="[1]"
      :filter-node-method="filterNode"
      check-on-click-node
      show-word-limit
      @node-click="nodeClick"
    >
      <span slot-scope="{ node, data }" class="custom-tree-node">
        <span>{{ data.DirectoryName }}</span>
        <span>
          <el-button
            type="text"
            size="mini"
            icon="el-icon-plus"
            @click="() => append(data)"
          />
          <el-popconfirm
            confirm-button-text="是"
            cancel-button-text="否"
            icon="el-icon-info"
            icon-color="red"
            title="确定删除吗？"
            @confirm="() => remove(node, data)"
          >
            <el-button
              slot="reference"
              icon="el-icon-delete"
              type="text"
              size="mini"
            />
          </el-popconfirm>
          <el-button
            type="text"
            size="mini"
            icon="el-icon-edit"
            @click="() => editorNode(data)"
          />
        </span>
      </span>
    </el-tree>

    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :width="device === 'desktop' ? '30%' : '95%'"
    >
      <el-form
        ref="ruleForm"
        label-position="right"
        label-width="80px"
        :model="form"
        size="small"
      >
        <el-form-item label="名称:">
          <el-input
            v-model.trim="form.DirectoryName"
            clearable
            type="text"
            show-word-limit
            maxlength="200"
          />
        </el-form-item>
        <el-form-item label="类型:">
          <el-select v-model="form.type" placeholder="请选择" clearable>
            <el-option label="疑难重症" value="1" />
            <el-option label="关键技术" value="2" />
            <el-option label="麻醉项目" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item size="small">
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="dialogVisible = false">关闭</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { SelectDirectorys } from '@/api/TechnicalStandard/StandardDisplay';

export default {
  data() {
    return {
      treeData: [
        {
          id: 1,
          name: '123',
          children: [
            {
              id: 2,
              name: '123',
              children: []
            }
          ]
        }
      ],
      title: 'title',
      dialogVisible: false,
      form: {
        DirectoryName: '',
        type: ''
      },
      defaultExpandedId: 1,
      selectVal: '',
      filterText: ''
    };
  },
  computed: {
    ...mapGetters(['device'])
  },
  created() {
    this.SelectDirectorys();
  },
  methods: {
    async SelectDirectorys() {
      try {
        const { data } = await SelectDirectorys();
        this.treeData = data;
      } catch (error) {
        console.log(error);
      }
    },
    append(data, node) {
      this.dialogVisible = true;
    },
    remove(node, data) {
      if (node.level === 1) {
        this.$message.warning('第一级不可删除，如需要删除请联系管理员');
        return;
      }
      const parent = node.parent;
      const children = parent.data.Children || parent.data;
      const index = children.findIndex((d) => d.id === data.id);
      children.splice(index, 1);
    },
    editorNode(data) {
      this.dialogVisible = true;
      this.form = data;
    },
    addOne() {
      this.dialogVisible = true;
    },
    filterName() {
      this.$refs.trees.filter(this.filterText);
    },
    submitForm() {},
    nodeClick(data, node) {
      this.$emit('nodeClick', data);
    },
    filterNode(value, data, node) {
      if (!value) return true;
      if (this.filterText) {
        const one = data.DirectoryName.indexOf(value) !== -1;
        const two =
          node.parent &&
          node.parent.data &&
          node.parent.data.DirectoryName &&
          node.parent.data.DirectoryName.indexOf(value) !== -1;
        const three =
          node.parent &&
          node.parent.parent &&
          node.parent.parent.data &&
          node.parent.parent.data.DirectoryName &&
          node.parent.parent.data.DirectoryName.indexOf(value) !== -1;
        const four =
          node.parent &&
          node.parent.parent &&
          node.parent.parent.parent &&
          node.parent.parent.parent.data &&
          node.parent.parent.parent.data.DirectoryName &&
          node.parent.parent.parent.data.DirectoryName.indexOf(value) !== -1;
        const five =
          node.parent &&
          node.parent.parent &&
          node.parent.parent.parent &&
          node.parent.parent.parent.parent &&
          node.parent.parent.parent.parent.data &&
          node.parent.parent.parent.parent.data.DirectoryName &&
          node.parent.parent.parent.parent.data.DirectoryName.indexOf(value) !==
            -1;
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
    }
  }
};
</script>

<style lang="scss">
.tree-line {
  .el-tree-node {
    position: relative;
    padding-left: 5px; // 缩进量
  }
  .el-tree-node__children {
    padding-left: 16px; // 缩进量
  }

  // 竖线
  .el-tree-node::before {
    content: "";
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
    content: "";
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
  justify-content: start;
  font-size: 14px;
  padding-right: 8px;
}
</style>
