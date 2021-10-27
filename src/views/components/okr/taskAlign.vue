<template>
  <el-container class="taskAlign">
    <el-header>
      <el-form
        :inline="true"
        class="demo-form-inline"
      >
        <el-form-item>
          <el-radio-group
            v-model="SelectCycle.ObjectType"
            size="mini"
            @change="radioGroup"
          >
            <el-radio-button :label="0">个人级</el-radio-button>
            <el-radio-button :label="1">部门级</el-radio-button>
            <el-radio-button :label="2">公司级</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="CycleID"
            placeholder="周期"
            size="mini"
            @change="selectChang"
          >
            <el-option
              v-for="item in CycleTableData"
              :key="item.item"
              :label="item.CycleName"
              :value="item.CycleID"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main>
      <el-container class="content">
        <div class="content">
          <el-divider>目标</el-divider>
          <div class="aside">
            <el-tree
              ref="elTree"
              :data="taskTreeData.data"
              show-checkbox
              node-key="ObjectID"
              :props="defaultProps"
              default-expand-all
              :check-strictly="true"
              @check="getSelectTreeDept"
            />
          </div>
          <el-divider> 成果</el-divider>
          <div class="main">
            <el-table
              ref="multipleTable"
              :data="resultTreeData"
              style="width: 100%"
              @select="handleSelectionChange"
            >
              <el-table-column
                type="selection"
                width="55"
              />
              <el-table-column
                prop="ResultName"
                label="成果名称"
              />
              <el-table-column
                prop="Schedule"
                label="进度"
                width="50"
                align="center"
              />
              <el-table-column
                prop="Remark"
                label="内容备注"
              />
            </el-table>
          </div>
        </div>
      </el-container>
    </el-main>
  </el-container>
</template>
<script>
import { SelectInCycle } from '@/api/okr/cycle';
import { SelectObject } from '@/api/okr/object';
import { SelectResult } from '@/api/okr/Result';

export default {
  data() {
    return {
      SelectCycle: {
        ObjectType: 2,
        CycleType: '',
        Year: '',
        ObjectName: '',
        pageIndex: 1,
        pageSize: 100,
        Total: 110,
        IsAlign: true
      },
      CycleTableData: [],
      CycleID: 0,
      taskTreeData: [],
      resultTreeData: [],
      defaultProps: {
        label: 'ObjectName',
        children: 'Children',
        disabled: 'CheckState'
      }
    };
  },
  created() {
    this.SelectInCycle();
  },
  methods: {
    async SelectInCycle() {
      const { data } = await SelectInCycle(this.SelectCycle);
      this.CycleTableData = data.DataList;
      this.CycleID =
        this.CycleTableData.length > 0 ? this.CycleTableData[0].CycleID : '';
      this.taskTreeData = await SelectObject({
        CycleID: this.CycleID || 0,
        ObjectName: '',
        ObjectContent: '',
        Scope: 0,
        UserScope: '',
        ParentID: 0,
        ObjectID: 0
      });
      this.SelectResult(this.taskTreeData.data[0].ObjectID);
    },
    radioGroup(val) {
      this.$refs.elTree.setCheckedKeys([]);
      this.$refs.multipleTable.clearSelection();
      this.SelectInCycle();
    },
    selectChang() {
    },
    getSelectTreeDept(value) {
      this.$refs.elTree.setCheckedKeys([value.ObjectID]);
      this.SelectResult(value.ObjectID);
    },
    async SelectResult(ObjectID) {
      const { data } = await SelectResult({
        ObjectID: ObjectID
      });
      this.resultTreeData = data;
    },
    handleSelectionChange(select, row) {
      this.$refs.multipleTable.clearSelection();
      this.$refs.multipleTable.toggleRowSelection(row);
      this.$emit('handleSelectionChange', {
        ObjectType: this.SelectCycle.ObjectType,
        row
      });
    }
  }
};
</script>
<style lang="scss">
.taskAlign {
  .el-header {
    height: 40px !important;
    margin: 0px;
    padding: 0px;
  }

  .el-main {
    height: 40vh !important;
    margin: 0px;
    padding: 0px;
    overflow: auto;

    .content {
      display: flex;
      flex-direction: column; /* 垂直显示 */
      width: 100%;
      height: 100%;

      .aside {
        height: 20vh;
      }

      .main {
        flex: 1;
      }
    }
  }
}
</style>
