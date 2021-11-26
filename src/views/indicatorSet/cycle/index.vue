<template>
  <el-container>
    <el-header>
      <div>
        <el-button
          class="el-icon-circle-plus"
          type="primary"
          size="mini"
          @click="openAddCycleDia"
        >添加周期
        </el-button>
      </div>
    </el-header>
    <el-main>
      <el-table :data="cycleListData" border height="700px" size="mini">
        <el-table-column type="index" label="序号" align="center" />
        <el-table-column prop="Type" label="类型" align="center" />
        <el-table-column prop="Cycle" label="周期" align="center" />
        <el-table-column prop="Num" label="单位数" align="center" />
        <el-table-column prop="Starway" label="开始方式" align="center">
          <template slot-scope="{ row }">
            {{ row.Starway === 0 ? '结束日期往前' : row.Starway === 10 ? '当年' : row.Starway === 11 ? '当季' : row.Starway === 12 ? '当月' : row.Starway }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="openEdiCycleDia(scope.row)"
            >编辑
            </el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="cycleDelBtn(scope.row)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        :title="cycleRecord.configIndexTitle"
        :visible.sync="cycleRecord.visible"
        width="30%"
      >
        <el-form ref="cycleFormData" :model="cycleFormData" label-width="80px">
          <el-form-item label="类型" prop="Type" size="small">
            <el-select
              v-model="cycleFormData.Type"
              clearable
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in [{ value: '固定' }, { value: '浮动' }]"
                :key="index"
                :label="item.value"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="周期" prop="Cycle" size="small">
            <el-select
              v-model.number="cycleFormData.Cycle"
              clearable
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in [
                  { value: '日' },
                  { value: '月' },
                  { value: '周' },
                  { value: '年' },
                ]"
                :key="index"
                :label="item.value"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="单位数" prop="cycle">
            <el-input
              v-model.number="cycleFormData.Num"
              style="width: 50%"
              size="small"
              clearable
            />
          </el-form-item>
          <el-form-item label="开始方式" prop="cycle">
            <el-select
              v-model.number="cycleFormData.Starway"
              clearable
              filterable
              placeholder="开始方式"
            >
              <el-option
                v-for="(item, index) in [
                  { label: '结束日期往前', value: 0 },
                  { label: '当年', value: 10 },
                  { label: '当季', value: 11 },
                  { label: '当月', value: 12 },
                ]"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <!--      添加周期确认按钮-->
        <div
          v-if="cycleRecord.configIndexTitle === '添加周期'"
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="cycleRecord.visible = false"> 取消 </el-button>
          <el-button
            type="primary"
            :loading="cycleRecord.Loading"
            @click="InsertiCycle"
          >新增
          </el-button>
        </div>

        <!--      更新周期确认按钮-->
        <div v-else slot="footer" class="dialog-footer">
          <el-button @click="cycleRecord.visible = false"> 取消 </el-button>
          <el-button
            type="primary"
            :loading="cycleRecord.Loading"
            @click="cycleEdiBtn"
          >更新
          </el-button>
        </div>
      </el-dialog>
    </el-main>
    <el-footer />
  </el-container>
</template>

<script>
import {
  DeleteiCycle,
  InsertiCycle,
  SelectiCycle, UpdateiCycle
} from '@/api/indicatorSet/I_Cycle';

export default {
  data() {
    return {
      cycleListData: [
        {
          Cycleid: 0, // 周期id
          Type: '', // 周期类型
          Cycle: '', // 周期内容
          Num: 0,
          Starway: 0
        }
      ], // 周期表格数据
      cycleFormData: {
        Cycleid: 0, // 周期id
        Type: '', // 周期类型
        Cycle: '', // 周期内容
        Num: 0,
        Starway: 0
      }, // 周期表单数据
      cycleRecord: {
        // 周期的记录
        visible: false, // 是否展示添加或者修改对话框
        configIndexTitle: '添加周期', // 对话框标题
        Loading: false // 确认按钮等待圈控制
      }
    };
  },
  created() {
    this.SelectiCycle();
  },
  methods: {
    // 查询全部周期
    async SelectiCycle() {
      try {
        const { data, code } = await SelectiCycle();
        if (code === 200) {
          this.cycleListData = data;
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 打开添加周期对话框
    openAddCycleDia() {
      this.cycleRecord.visible = true; // 打开对话框
      this.cycleRecord.configIndexTitle = '添加周期'; // 对话框标题
    },
    // 添加单个周期
    async InsertiCycle() {
      this.cycleRecord.configIndexTitle = '添加周期'; // 对话框标题
      try {
        const { code } = await InsertiCycle(this.cycleFormData);
        if (code === 200) {
          await this.SelectiCycle();
          this.$message.success('添加成功');
          this.cycleRecord.visible = false; // 关闭对话框
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 打开编辑修改对话框
    openEdiCycleDia(row) {
      console.log(row);
      this.cycleRecord.visible = true; // 打开对话框
      this.cycleFormData = row; // 传入该条周期数据
      this.cycleRecord.configIndexTitle = '修改周期'; // 对话框标题
    },
    // 编辑更新周期
    async cycleEdiBtn() {
      try {
        const { code } = await UpdateiCycle(this.cycleFormData);
        if (code === 200) {
          this.$message.success('更新成功');
          this.cycleRecord.visible = false; // 关闭对话框
          await this.SelectiCycle(); // 刷新界面
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 删除单条周期
    async cycleDelBtn(row) {
      this.$confirm('此操作将永久删除该周期, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      })
        .then(async() => {
          const { code } = await DeleteiCycle({ Cycleid: row.Cycleid });
          if (code === 200) {
            await this.SelectiCycle(); // 刷新列表
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }
        })
        .catch(() => {
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
