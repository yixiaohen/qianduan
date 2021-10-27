<template>
  <el-container>
    <el-header>
      <div class="header">
        <div class="left">
          <el-form
            :inline="true"
            class="demo-form-inline"
          >
            <el-form-item>
              <span class="left_CycleName">{{ CycleName }}</span>
            </el-form-item>
            <el-form-item>
              <el-tag
                size="mini"
                type="info"
              >周期目标</el-tag>
            </el-form-item>
          </el-form>
        </div>
        <div class="right">
          <el-form
            :inline="true"
            class="demo-form-inline"
          >
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
            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="mini"
                class="pan-btn blue-btn"
                @click="addObj"
              >
                添加周期
              </el-button>
            </el-form-item>
            <el-form-item>
              <el-popconfirm
                style="margin-left: 3px"
                confirm-button-text="是"
                cancel-button-text="否"
                icon="el-icon-info"
                icon-color="red"
                title="确定终止吗？"
                @confirm="DeleteCycle()"
              >
                <el-button
                  slot="reference"
                  type="danger"
                  size="mini"
                  class="pan-btn pink-btn"
                >
                  删除当前周期
                </el-button>
              </el-popconfirm>
              <!-- <router-link
                class="pan-btn pink-btn"
                to="/excel/export-excel"
              >
                Excel
              </router-link> -->
              <!--   <el-popconfirm
                style="margin-left: 3px"
                confirm-button-text="是"
                cancel-button-text="否"
                icon="el-icon-info"
                icon-color="red"
                title="确定终止吗？"
                @confirm="DeleteCycle()"
              >
                <el-button
                  slot="reference"
                  type="danger"
                  size="mini"
                >
                  删除当前周期
                </el-button>
              </el-popconfirm> -->
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-header>
    <el-main>
      <targertTree
        :targert-tree-data="targertTreeData"
        :row-object-i-d="rowObjectID"
        :cyclerow="CycleRow"
      />
    </el-main>
    <el-dialog
      title="添加周期"
      :visible.sync="dialogObj"
      :width="device === 'mobile' ? '90%' : '30%'"
    >
      <addCycle
        ref="addCycleRef"
        :level="2"
      />
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          size="small"
          @click="dialogObj = false"
        >取 消</el-button>
        <el-button
          type="primary"
          size="small"
          @click="InsertCycle"
        >确 定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import { DeleteCycle, InsertCycle, SelectInCycle } from '@/api/okr/cycle';
import { SelectObject } from '@/api/okr/object';
import addCycle from '../components/addCycle';
import targertTree from '../components/targetTree';
import { mapGetters } from 'vuex';

export default {
  components: { addCycle, targertTree },
  data() {
    return {
      CycleTableData: [],
      CycleRow: {} /* 当前周期 */,
      CycleID: '' /* 当前季度id */,
      CycleName: '' /* 当前季度名称 */,
      rowObjectID: {},
      SelectCycle: {
        ObjectType: 2,
        CycleType: '',
        Year: '',
        ObjectName: '',
        pageIndex: 1,
        pageSize: 100,
        Total: 110,
        IsAlign: false
      },
      dialogObj: false,
      targertTreeData: []
    };
  },
  computed: {
    ...mapGetters(['device'])
  },
  created() {
    this.SelectInCycle();
  },

  methods: {
    async DeleteCycle() {
      const { code, msg } = await DeleteCycle({
        CycleID: this.CycleTableData[0].CycleID
      });
      code === 200 ? this.$message.success(msg) : this.$message.error(msg);
      this.SelectInCycle();
    },
    async SelectInCycle(val) {
      this.SelectCycle.pageIndex =
        val === '搜索' ? 1 : this.SelectCycle.pageIndex;
      const { data } = await SelectInCycle(this.SelectCycle);
      this.CycleTableData = data.DataList;
      this.SelectCycle.Total = data.Total;
      this.CycleName =
        data.DataList.length > 0 ? data.DataList[0].CycleName : '';
      this.CycleRow = data.DataList.length > 0 ? data.DataList[0] : {};
      this.rowObjectID = data.DataList[0] || {};
      this.CycleID = data.DataList.length > 0 ? data.DataList[0].CycleID : '';

      data.DataList.length > 0
        ? this.SelectObject(data.DataList[0].CycleID)
        : '';
    },
    selectChang(val) {
      this.CycleRow = this.CycleTableData.find(item => item.CycleID === val);
      this.CycleName = this.CycleRow.CycleName;
      this.SelectObject(val);
    },
    addObj() {
      this.dialogObj = true;
    },
    async InsertCycle() {
      const { code, msg } = await InsertCycle(
        this.$refs.addCycleRef.getDialogObjFm()
      );
      code === 200 ? this.$message.success(msg) : this.$message.error(msg);
      this.SelectInCycle();
      this.dialogObj = false;
    },
    async SelectObject(val) {
      const { data } = await SelectObject({ CycleID: val });
      this.targertTreeData = data;
    }
  }
};
</script>
<style lang="scss">
.el-header,
.el-main {
  padding: 0px;
  margin: 0px;
}
.el-main {
  height: calc(100vh - 130px) !important;
}
.el-header {
  height: 40px !important;
  .header {
    display: flex;
    justify-content: space-between;
    .left_CycleName {
      font-size: 20px;
      margin-right: 0px;
    }
  }
}
</style>
