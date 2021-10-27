<template>
  <el-container>
    <el-header>
      <div>
        <el-button class="el-icon-circle-plus" type="primary" size="mini" @click="openAddmonitorDia">添加监测组别
        </el-button>
      </div>
    </el-header>
    <el-main>
      <el-table
        :data="monitorListData"
        border
        height="700px"
        size="mini"
      >
        <el-table-column
          type="index"
          label="序号"
          align="center"
        />
        <el-table-column
          prop="Igroupname"
          label="数据监测组别名称"
          align="center"
        />
        <el-table-column
          prop="remarks"
          label="备注"
          align="center"
        />

        <el-table-column
          align="center"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="openEdimonitorDia(scope.row)">编辑
            </el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="monitorDelBtn(scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        :title="monitorRecord.configIndexTitle"
        :visible.sync="monitorRecord.visible"
        width="30%"
      >
        <el-form
          ref="monitorFormData"
          :model="monitorFormData"
          label-width="180px"
        >

          <el-form-item
            label="监测组别名称"
            prop="Igroupname"
          >
            <el-input
              v-model.number="monitorFormData.Igroupname"
              style="width:50%"
              size="small"
              clearable
            />
          </el-form-item>
          <el-form-item
            label="备注"
            prop="remarks"
          >
            <el-input
              v-model="monitorFormData.remarks"
              style="width:50%"
              size="small"
              clearable
            />
          </el-form-item>

        </el-form>
        <!--      添加监测组别确认按钮-->
        <div v-if="monitorRecord.configIndexTitle==='添加监测组别'" slot="footer" class="dialog-footer">
          <el-button
            @click="monitorRecord.visible = false"
          >
            取消
          </el-button>
          <el-button
            type="primary"
            :loading="monitorRecord.Loading"
            @click="InsertMonGroup"
          >新增
          </el-button>
        </div>

        <!--      更新监测组别确认按钮-->
        <div v-else slot="footer" class="dialog-footer">
          <el-button @click="monitorRecord.visible = false">
            取消
          </el-button>
          <el-button
            type="primary"
            :loading="monitorRecord.Loading"
            @click="monitorEdiBtn"
          >更新
          </el-button>
        </div>

      </el-dialog>
    </el-main>
    <el-footer></el-footer>
  </el-container>
</template>

<script>
import { DeleteMonGroup, InsertMonGroup, SelectMonGroup } from '@/api/indicatorSet/I_Monitor';

export default {
  data() {
    return {
      monitorListData: [{
        Igroupid: 0, // 监测组别id
        Igroupname: '', // 监测组别名称
        remarks: '' // 备注
      }], // 监测组别表格数据
      monitorFormData: {
        Igroupid: 0, // 监测组别id
        Igroupname: '', // 监测组别名称
        remarks: '' // 备注
      }, // 监测组别表单数据
      monitorRecord: { // 监测组别的记录
        visible: false, // 是否展示添加或者修改对话框
        configIndexTitle: '添加监测组别', // 对话框标题
        Loading: false // 确认按钮等待圈控制
      }
    };
  },
  created() {
    this.SelectMonGroup();
  },
  methods: {
    // 查询全部监测组别
    async SelectMonGroup() {
      try {
        const { data, code } = await SelectMonGroup();
        if (code === 200) {
          this.monitorListData = data;
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 打开添加监测组别对话框
    openAddmonitorDia() {
      this.monitorRecord.visible = true; // 打开对话框
      this.monitorRecord.configIndexTitle = '添加监测组别'; // 对话框标题
    },
    // 添加单个监测组别
    async InsertMonGroup() {
      this.monitorRecord.configIndexTitle = '添加监测组别'; // 对话框标题
      try {
        const { code } = await InsertMonGroup(this.monitorFormData);
        if (code === 200) {
          await this.SelectMonGroup();
          this.$message.success('添加成功');
          this.monitorRecord.visible = false; // 关闭对话框
        }
      } catch (e) {
        console.log(e);
      }
    },
    openEdimonitorDia(row) {
      this.monitorRecord.visible = true; // 打开对话框
      this.monitorFormData = row; // 传入该条监测组别数据
      this.monitorRecord.configIndexTitle = '修改监测组别'; // 对话框标题
    },
    // 编辑更新监测组别
    async monitorEdiBtn(row) {
      try {
        const { code } = await InsertMonGroup(this.monitorFormData);
        if (code === 200) {
          this.$message.success('更新成功');
          this.monitorRecord.visible = false; // 关闭对话框
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 删除单条监测组别
    async monitorDelBtn(row) {
      this.$confirm('此操作将永久删除该<' + row.Igroupname + '>监测组别,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(async() => {
        const { code } = await DeleteMonGroup({ Igroupid: row.Igroupid });
        if (code === 200) {
          await this.SelectMonGroup(); // 刷新列表
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.el-container {
  .el-header {
    height: auto !important;

    div {
      margin-top: 10px;
    }
  }

  .el-main {
    padding-top: 6px;
    padding-left: 20px;
    padding-right: 20px;

    .el-table {
    }
  }


}

</style>
