<template>
  <el-container>
    <el-header>
      <div class="block">
        <span>选择日期：</span>
        <el-date-picker
          v-model="ShowLogTime"
          type="daterange"
          size="mini"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="changeSelectAllLog"
        />
      </div>
    </el-header>
    <el-main>
      <el-table
        :data="LogListData"
        border
        height="70vh"
        size="small"
        highlight-current-row
      >
        <el-table-column
          type="index"
          label="序号"
          width="50px"
          align="center"
          :show-overflow-tooltip="cellOverflow"
        />
        <el-table-column
          prop="Title"
          label="日志名称"
          width="220px"
          align="center"
          sortable
          :show-overflow-tooltip="cellOverflow"
        />
        <el-table-column
          prop="S"
          label="具体内容"
          align="center"
          :show-overflow-tooltip="cellOverflow"
        />
        <el-table-column
          prop="UserName"
          label="触发者"
          width="100px"
          align="center"
          :show-overflow-tooltip="cellOverflow"
        />
        <el-table-column
          label="产生时间"
          align="center"
          width="200px"
          :show-overflow-tooltip="cellOverflow"
        >
          <template slot-scope="{ row }">
            {{ row.CreateTime ? row.CreateTime.replace('T', ' ') : '' }}
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="操作"
          width="150px"
        >
          <template slot-scope="scope">
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="LogDelBtn(scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--折叠-->
      <span>展开 </span>
      <el-switch v-model="cellOverflow" style="margin: 6px 0"/>
      <span> 折叠</span>
      <!--                        分页-->
      <div class="block">
        <el-pagination
          :page-sizes="pagination.pageSizes"
          :page-size="pagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :current-page="listQuery.pageIndex"
          :total="pagination.Total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
        <!-- :current-page="listQuery.pageIndex"为当前页-->
      </div>
    </el-main>
    <el-footer/>
  </el-container>
</template>

<script>
import { ExecuteNonQuery, GetAll } from '@/api/indicatorSet/I_Log';

export default {
  data() {
    return {
      cellOverflow: false, // 折叠表格
      ShowLogTime: [
        new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(),
        new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()], // 选择查询执行日志的日期
      LogListData: [{
        Logid: 0, // 执行日志id
        Type: '', // 执行日志类型
        Log: '', // 执行日志内容
        Num: 0,
        Starway: 0
      }], // 执行日志表格数据
      listQuery: { // 分页数据
        pageIndex: 1,
        pageSize: 10
      },
      pagination: { // 分页数据
        pageIndex: 1,
        pageSize: 10,
        pageSizes: [5, 10, 20, 50, 100, 200],
        Total: null
      }
    };
  },
  created() {
    this.selectAllLog();
  },
  methods: {
    // 查询全部执行日志
    changeSelectAllLog() {
      this.listQuery.pageIndex = 1; // 只要查新的数据把重新设置页码
      this.selectAllLog();
    },
    async selectAllLog() {
      try {
        const { data, code } = await GetAll({
          pageIndex: this.listQuery.pageIndex,
          pageSize: this.listQuery.pageSize,
          StartTime: this.ShowLogTime[0],
          EndTime: this.ShowLogTime[1]
        });
        if (code === 200) {
          this.LogListData = data.DataList;
          this.pagination.Total = data.Total; // 获取总条数
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 删除单条执行日志
    async LogDelBtn(row) {
      console.log(row);
      this.$confirm('此操作将永久删除该执行日志<' + row.Title + '>是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(async() => {
        const { code } = await ExecuteNonQuery(
          {
            CmdType: 3, // 3为删除日志
            LogDto: {
              ID: row.ID
            }
          }
        );
        if (code === 200) {
          this.selectAllLog(); // 刷新列表
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
    },
    // 列表分页当前页
    // 全部信息列表分页当前页
    handleCurrentChange(index) {
      this.listQuery.pageIndex = index;
      this.selectAllLog(); // 跳转页面后刷新列表
    },
    // 全部信息列表分页一页多少显示条数据
    handleSizeChange(page) {
      this.listQuery.pageSize = page;
      this.selectAllLog(); // 跳转页面后刷新列表
    }
  }
};
</script>

<style lang="scss" scoped>
//分页栏距离表格
.block {
  margin-top: 10px;
}

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
