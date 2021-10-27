<template>
  <el-container>
    <el-header style="height: 40px">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-radio-group v-model="radio1" size="mini" @change="RadioGroup">
            <el-radio-button label="鱼骨图表格" />
            <el-radio-button label="鱼骨图" />
            <el-radio-button label="数据配置" />
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="radio1 === '鱼骨图表格'">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-plus"
            plain
            @click="add"
          >新增</el-button>
        </el-form-item>
        <el-form-item v-if="radio1 != '鱼骨图表格'">
          <span>当前鱼骨图名称：{{ FishBoneName }}</span>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main style="height: calc(100vh - 170px)">
      <fish v-if="radio1 === '鱼骨图'" :fishbone-data="fishboneData" />
      <div v-show="radio1 === '数据配置'" class="custom-tree-container">
        <div class="block">
          <el-tree
            class="tree-line"
            :data="treeData"
            :props="{
              children: 'children',
              label: 'name',
            }"
            node-key="id"
            accordion
            :expand-on-click-node="false"
            :default-expanded-keys="[defaultExpandedId]"
          >
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <span>{{ data.name }}</span>
              <el-input
                v-if="data.id == beforeId"
                v-model="editorText"
                placeholder="修改"
                size="mini"
                style="width: 300px"
                clearable
                @keyup.enter.native="UpdateFishBone(data)"
              />
              <el-button
                v-if="data.id == beforeId"
                type="primary"
                size="mini"
                @click="UpdateFishBone(data)"
              >确定</el-button>
              <el-button
                v-if="data.name == beforeId"
                type="primary"
                size="mini"
                @click="beforeId = ''"
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
                  v-if="data.id == inputText"
                  v-model="addText"
                  placeholder="请输入子级内容"
                  size="mini"
                  width="300px"
                  clearable
                  @keyup.enter.native="InsertFishBone(data)"
                />
                <el-button
                  v-if="data.id == inputText"
                  type="primary"
                  size="mini"
                  @click="InsertFishBone(data)"
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
      <el-table
        v-if="radio1 === '鱼骨图表格'"
        v-loading="tableloading"
        :data="tableData"
        border
        style="width: 100%"
        size="mini"
        height="calc(100vh - 200px)"
      >
        <el-table-column width="50" align="center" label="序号" type="index" />
        <el-table-column align="center" label="鱼骨图名称" width="300">
          <template slot-scope="{ row, $index }">
            <el-input
              v-if="currentEdit === $index"
              v-model="row.FishBoneName"
              size="small"
              @keyup.enter.native="finishEditClick(row)"
            />
            <span v-else>{{ row.FishBoneName }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="查看" width="50">
          <template slot-scope="{ row }">
            <el-button
              icon="el-icon-search"
              circle
              size="mini"
              @click="SelectFishBone(row, '鱼骨图')"
            />
          </template>
        </el-table-column>
        <el-table-column align="center" label="配置鱼骨图" width="90">
          <template slot-scope="{ row }">
            <el-button
              icon="el-icon-setting"
              circle
              size="mini"
              @click="SelectFishBone(row, '配置鱼骨图')"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="currentEdit === scope.$index"
              type="text"
              size="small"
              @click="finishEditClick(scope.row)"
            >完成</el-button>
            <el-button
              v-else
              type="text"
              size="small"
              @click="EditClick(scope)"
            >修改</el-button>
            <el-button
              v-if="currentEdit === scope.$index"
              type="text"
              size="small"
              @click="currentEdit = -1"
            >放弃</el-button>
            <el-popconfirm
              v-else
              onfirm-button-text="是"
              cancel-button-text="否"
              icon="el-icon-info"
              icon-color="red"
              title="确定删除吗？"
              @confirm="DeleteFishBoneName(scope)"
            >
              <el-button
                slot="reference"
                type="text"
                size="small"
              >删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-row v-if="radio1 === '鱼骨图表格'">
        <el-col :span="1">
          <el-switch v-model="cellOverflow" style="margin: 6px 0px" />
        </el-col>
        <el-col :span="20">
          <el-pagination
            :current-page="SelectFishBoneNameVal.pageIndex"
            :page-sizes="[10, 15, 20, 30, 50, 100]"
            :page-size="SelectFishBoneNameVal.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="SelectFishBoneNameVal.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import fish from '@/components/fish';
import { mapGetters } from 'vuex';
import {
  DeleteFishBone,
  DeleteFishBoneName,
  InsertFishBone,
  InsertFishBoneName,
  SelectFishBone,
  SelectFishBoneName,
  UpdateFishBone,
  UpdateFishBoneName
} from '@/api/FishBone';

export default {
  name: 'Fishbone',
  components: { fish },
  data() {
    return {
      fishboneData: [],
      treeData: [],
      adddialog: false,
      radio1: '鱼骨图表格',
      inputText: '',
      addText: '',
      editorText: '',
      beforeId: -1,
      SelectFishBoneNameVal: {
        pageIndex: 1,
        pageSize: 15,
        Total: 0,
        FishBoneName: ''
      },
      tableloading: false,
      tableData: [],
      cellOverflow: false,
      currentEdit: -1,
      state: '',
      FishBoneName: '',
      defaultExpandedId: 0
    };
  },
  computed: {
    ...mapGetters(['device'])
  },
  created() {
    this.SelectFishBoneName();
  },
  methods: {
    RadioGroup(val) {
      if (val === '鱼骨图') {
      } else {
      }
    },
    editorJtopo() {
      this.data = [this.fishboneData];
    },
    append(data) {
      this.inputText = data.id;
      return;
    },
    async remove(node, val) {
      if (node.level === 1) {
        this.$message.warning(
          '第一级不可删除，如不需要该图了，可前往鱼骨图表格里删除该鱼骨图'
        );
        return;
      }
      const { code, data } = await DeleteFishBone({
        id: val.id
      });
      code === 200
        ? this.$message.success('删除成功')
        : this.$message.error('删除失败');

      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === val.id);
      code === 200 ? children.splice(index, 1) : '';
    },
    editorNode(data) {
      this.beforeId = data.id;
      this.editorText = data.name;
    },
    /*  查询鱼图表 */
    async SelectFishBoneName() {
      try {
        this.tableloading = true;
        const { data } = await SelectFishBoneName(this.SelectFishBoneNameVal);
        this.tableData = data.DataList;
        this.SelectFishBoneNameVal.Total = data.Total;
      } catch (error) {
        console.log(error);
      }
      this.tableloading = false;
    },
    handleSizeChange(val) {
      this.SelectFishBoneNameVal.pageSize = val;
      this.SelectFishBoneNameVal.pageIndex = 1;
      this.SelectFishBoneName();
    },
    handleCurrentChange(val) {
      this.SelectFishBoneNameVal.pageIndex = val;
      this.SelectFishBoneName();
    },
    add() {
      this.tableData.unshift({
        FishBoneName: ''
      });
      // 编辑当前行
      this.currentEdit = 0;
      this.state = '新增';
    },
    EditClick(scope) {
      this.currentEdit = scope.$index;
      this.state = '修改';
    },
    async finishEditClick(row) {
      if (this.state === '修改') {
        const { code } = await UpdateFishBoneName({
          FishBoneID: row.FishBoneID,
          FishBoneName: row.FishBoneName
        });
        code === 200
          ? this.$message.success('修改成功')
          : this.$message.error('修改失败');
      } else if (this.state === '新增') {
        const { code } = await InsertFishBoneName({
          FishBoneID: 0,
          FishBoneName: row.FishBoneName
        });
        code === 200
          ? this.$message.success('新增成功')
          : this.$message.error('新增失败');
      }
      this.currentEdit = -1;
    },
    async DeleteFishBoneName(scope) {
      const { code } = await DeleteFishBoneName({
        FishBoneID: scope.row.FishBoneID
      });
      code === 200
        ? this.$message.success('删除成功')
        : this.$message.error('删除失败');
      this.currentEdit = -1;
      this.SelectFishBoneName();
    },
    async SelectFishBone(row, type) {
      try {
        const { data } = await SelectFishBone({
          FishBoneID: row.FishBoneID
        });
        this.fishboneData = data[0];
        this.treeData = data;
        this.defaultExpandedId = data[0].id;
        this.FishBoneName = row.FishBoneName;
        this.radio1 = type === '鱼骨图' ? '鱼骨图' : '数据配置';
      } catch (error) {}
    },
    async InsertFishBone(val) {
      const { data, code } = await InsertFishBone({
        name: this.addText,
        parentID: val.id,
        FishBoneID: val.FishBoneID
      });
      code === 200
        ? this.$message.success('新增成功')
        : this.$message.error('新增失败');
      const newChild = { id: data, name: this.addText, children: [] };
      val.children.push(newChild);
      this.inputText = '';
      this.addText = '';
      const { datas } = await SelectFishBone({
        FishBoneID: data.FishBoneID
      });
      this.fishboneData = datas[0];
      this.treeData = datas;
    },
    async UpdateFishBone(val) {
      const { code } = await UpdateFishBone({
        id: val.id,
        name: this.editorText
      });
      code === 200
        ? this.$message.success('修改成功')
        : this.$message.error('修改失败');
      code === 200 ? (val.name = this.editorText) : '';
      this.beforeId = -1;
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
  justify-content: start;
  font-size: 14px;
  padding-right: 8px;
}
</style>
