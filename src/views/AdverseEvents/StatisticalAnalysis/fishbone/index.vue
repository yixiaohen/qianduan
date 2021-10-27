<template>
  <el-container>
    <el-header style="height: 30px">
      <el-radio-group v-model="radio1" size="mini" @change="RadioGroup">
        <el-radio-button label="鱼骨图" />
        <el-radio-button label="数据配置" />
      </el-radio-group>
    </el-header>
    <el-main
      style="height: calc(100vh - 200px)"
    ><!-- <fish :fishboneData="fishboneData" v-if="radio1 === '鱼骨图'" /> -->
      <div v-show="radio1 === '数据配置'" class="custom-tree-container">
        <div class="block">
          <el-tree
            class="tree-line"
            :data="data"
            :props="defaultProps"
            node-key="id"
            accordion
            :expand-on-click-node="false"
          >
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <span>{{ data.name }}</span>
              <el-input
                v-if="data.name == beforeText"
                v-model="editorText"
                placeholder="请输入子级内容"
                size="mini"
                style="width: 300px"
                clearable
                @keyup.enter.native="updataNode(data)"
              />
              <el-button
                v-if="data.name == beforeText"
                type="primary"
                size="mini"
                @click="updataNode(data)"
              >确定</el-button>
              <el-button
                v-if="data.name == beforeText"
                type="primary"
                size="mini"
                @click="beforeText = ''"
              >放弃</el-button>
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
              <el-form ref="form">
                <el-input
                  v-if="data.name == inputText"
                  v-model="addText"
                  placeholder="请输入子级内容"
                  size="mini"
                  width="300px"
                  clearable
                  @keyup.enter.native="getNodeId(data)"
                />
                <el-button
                  v-if="data.name == inputText"
                  type="primary"
                  size="mini"
                  @click="getNodeId(data)"
                >确定</el-button>
                <el-button
                  v-if="data.name == inputText"
                  type="primary"
                  size="mini"
                  @click="inputText = ''"
                >放弃</el-button>
              </el-form>
            </span>
          </el-tree>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      /*       fishboneData: {
        children: [
          {
            children: [
              {
                children: [
                  {
                    id: 6,
                    children: [],
                    name: "办公区域不独立",
                    fontColor: "",
                    lineColor: "",
                    link: "",
                  },
                  {
                    id: 7,
                    children: [],
                    name: "事物繁忙",
                    fontColor: "",
                    lineColor: "",
                    link: "",
                  },
                  {
                    id: 8,
                    children: [],
                    name: "办公条件简陋",
                    fontColor: "",
                    lineColor: "",
                    link: "",
                  },
                ],
                id: 9,
                name: "环境",
                fontColor: "",
                lineColor: "",
                link: "",
              },
              {
                children: [
                  {
                    id: 10,
                    children: [],
                    name: "开展化疗业务的科室过多",
                    fontColor: "",
                    lineColor: "",
                    link: "",
                  },
                ],
                id: 11,
                name: "药品管理",
                fontColor: "",
                lineColor: "",
                link: "",
              },
              {
                children: [
                  {
                    id: 12,
                    children: [],
                    name: "临床实验用药未纳入管理",
                    fontColor: "",
                    lineColor: "",
                    link: "",
                  },
                ],
                id: 13,
                name: "工作量大",
                fontColor: "",
                lineColor: "",
                link: "",
              },
            ],
            id: 2,
            name: "其他",
            fontColor: "230,13,13",
            lineColor: "",
            link: "",
          },
          {
            children: [
              {
                children: [
                  {
                    id: 14,
                    children: [],
                    name: "网速慢",
                    fontColor: "",
                    lineColor: "",
                    link: "",
                  },
                  {
                    id: 15,
                    children: [],
                    name: "电脑少",
                    fontColor: "",
                    lineColor: "",
                    link: "",
                  },
                  {
                    id: 16,
                    children: [],
                    name: "机器老化",
                    fontColor: "",
                    lineColor: "",
                    link: "",
                  },
                ],
                id: 17,
                name: "硬件不足",
                fontColor: "",
                lineColor: "",
                link: "",
              },
              {
                children: [
                  {
                    id: 18,
                    children: [],
                    name: "患者信息不全",
                    fontColor: "",
                    lineColor: "",
                    link: "",
                  },
                  {
                    id: 19,
                    children: [],
                    name: "审方系统维护滞后",
                    fontColor: "",
                    lineColor: "",
                    link: "",
                  },
                  {
                    id: 20,
                    children: [],
                    name: "信息系统缺少提醒",
                    fontColor: "",
                    lineColor: "",
                    link: "",
                  },
                  {
                    id: 21,
                    children: [],
                    name: "药品词典设置不规范",
                    fontColor: "",
                    lineColor: "",
                    link: "",
                  },
                ],
                id: 22,
                name: "智能不足",
                fontColor: "",
                lineColor: "",
                link: "",
              },
            ],
            id: 3,
            name: "信息设备",
            fontColor: "",
            lineColor: "",
            link: "",
          },
          {
            children: [
              {
                id: 23,
                children: [],
                name: "粗心大意",
                fontColor: "",
                lineColor: "",
                link: "",
              },
              {
                children: [
                  {
                    id: 24,
                    children: [],
                    name: "对保护性约束",
                    fontColor: "",
                    lineColor: "",
                    link: "",
                  },
                  {
                    id: 25,
                    children: [],
                    name: "对自行拔管可能带来的危害不清",
                    fontColor: "",
                    lineColor: "",
                    link: "",
                  },
                ],
                id: 26,
                name: "家属随意终止约束",
                fontColor: "",
                lineColor: "",
                link: "",
              },
            ],
            id: 4,
            name: "人员",
            fontColor: "",
            lineColor: "",
            link: "",
          },
          {
            children: [
              {
                children: [
                  {
                    id: 27,
                    children: [],
                    name: "未沟通",
                    fontColor: "",
                    lineColor: "",
                    link: "",
                  },
                ],
                id: 28,
                name: "质量问题",
                fontColor: "",
                lineColor: "",
                link: "",
              },
              {
                id: 29,
                children: [],
                name: "培训不足",
                fontColor: "",
                lineColor: "",
                link: "",
              },
              {
                children: [
                  {
                    id: 30,
                    children: [],
                    name: "护士长",
                    fontColor: "",
                    lineColor: "",
                    link: "",
                  },
                ],
                id: 31,
                name: "监管不足",
                fontColor: "",
                lineColor: "",
                link: "",
              },
              {
                id: 32,
                children: [],
                name: "护士人力不足",
                fontColor: "",
                lineColor: "",
                link: "",
              },
            ],
            id: 5,
            fid: "1",
            name: "方法",
            fontColor: "",
            lineColor: "",
            link: "",
          },
        ],
        id: 1,
        name: "鱼骨图",
      }, */
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      data: [],
      adddialog: false,
      radio1: '鱼骨图',
      inputText: '',
      addText: '',
      editorText: '',
      beforeText: ''
    };
  },
  /*   name: "Fishbone",
  components: { fish }, */
  computed: {
    ...mapGetters(['device'])
  },
  created() {
    this.data = [this.fishboneData];
  },
  methods: {
    RadioGroup(val) {
      if (val === '鱼骨图') {
        this.data = [this.fishboneData];
      } else {
        this.fishboneData = this.data[0];
      }
    },
    editorJtopo() {
      this.data = [this.fishboneData];
    },
    append(data) {
      this.inputText = data.name;
      return;
    },
    getNodeId(data) {
      const newChild = { id: 100, name: this.addText, children: [] };
      if (!data.children) {
        this.$set(data, 'children', []);
      }
      data.children.push(newChild);
      this.inputText = '';
      this.addText = '';
    },
    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex((d) => d.id === data.id);
      children.splice(index, 1);
    },
    editorNode(data) {
      this.beforeText = data.name;
      this.editorText = data.name;
    },
    updataNode(data) {
      data.name = this.editorText;
      this.beforeText = '';
    }
  }
};
</script>
<style lang="scss">
.el-header,
.el-main,
.el-footer {
  padding: 0px;
  margin: 0px;
}
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
