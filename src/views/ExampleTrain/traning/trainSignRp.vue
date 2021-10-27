<template>
  <div style="padding: 5px">
    <el-form
      :inline="true"
      size="mini"
    >
      <el-form-item>
        <el-select
          v-model="listQuery.planID"
          size="mini"
          style="padding-top: 10px"
          @change="selectSignStatusList"
        >
          <el-option
            v-for="item in options"
            :key="item.planId"
            :label="item.planName"
            :value="item.planId"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-tabs
          v-model="activeName"
          @tab-click="handleClick"
        >
          <el-tab-pane
            label="已签到名单"
            name="first"
          />
          <el-tab-pane
            label="未签到名单"
            name="second"
          />
          <el-tab-pane
            label="全部"
            name="third"
          />
        </el-tabs>
      </el-form-item>
      <el-form-item style="width: 150px">
        <el-select
          v-model="listQuery.downloadValue"
          placeholder="请选择要导出数据"
        >
          <el-option
            label="前一百条"
            :value="100"
          />
          <el-option
            label="前三百条"
            :value="300"
          />
          <el-option
            label="前五百条"
            :value="500"
          />
          <el-option
            label="前一千条"
            :value="1000"
          />
          <el-option
            label="全部"
            :value="pagination.total"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          :disabled="downloadLoading"
          type="success"
          icon="el-icon-document"
          size="mini"
          @click="handleDownload"
        >导出
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="tableData"
      height="calc(100vh - 196px)"
      border
      size="mini"
    >
      <el-table-column
        type="index"
        fixed="left"
        width="50"
        label="序号"
        align="center"
      />
      <el-table-column
        prop="planName"
        label="培训名称"
      />
      <el-table-column
        prop="DeptName"
        label="部门"
      />
      <el-table-column
        prop="UserName"
        label="用户"
      />
      <el-table-column
        prop="signDate"
        label="签到时间"
      >
        <template slot-scope="{ row }">
          {{ row.signDate ? row.signDate.replace('T', ' ') : '' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="signState"
        label="出勤状态"
      />
    </el-table>
    <el-pagination
      style="margin: 6px 0 0 0"
      background
      :current-page.sync="pagination.pageIndex"
      :page-size="pagination.pageSize"
      :page-sizes="pagination.pageSizes"
      :total="pagination.total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { SelectSignStatusList } from '@/api/PX_Apply';
import { SelectPlan } from '@/api/PX_Plan';

export default {
  data() {
    return {
      options: [],
      activeName: 'first',
      listLoading: false,
      listQuery: {
        pageIndex: 1,
        pageSize: 15,
        planID: 1,
        signState: '',
        Uid: window.userInfo[0].UserID,
        downloadValue: 100
      },
      pagination: {
        pageIndex: 1,
        total: 0,
        pageSize: 15,
        pageSizes: [15, 20, 50, 100, 150, 200]
      },
      tableData: [],
      downloadValue: 100,
      downloadLoading: false
    };
  },
  created() {
    this.selectPlan();
    this.selectSignStatusList();
  },
  methods: {
    async selectPlan() {
      try {
        const { data } = await SelectPlan({
          pageIndex: 1,
          pageSize: 1000
        });
        this.options = data.DataList;
        if (this.options.length) {
          this.listQuery.planID = this.options[0].planId;
          this.selectSignStatusList();
        }
      } catch (error) {
      }
    },
    handleClick() {
      this.selectSignStatusList();
    },
    async selectSignStatusList() {
      this.listLoading = true;
      if (this.activeName == 'first') {
        this.listQuery.signState = '已签到';
      } else if (this.activeName == 'second') {
        this.listQuery.signState = '未签到';
      } else if (this.activeName == 'third') this.listQuery.signState = '';
      try {
        const { data } = await SelectSignStatusList(this.listQuery);
        this.tableData = data.DataList;
        this.pagination.total = data.Total;
      } catch (error) {
        console.log(error);
      } finally {
        this.listLoading = false;
      }
    },
    handleCurrentChange(val) {
      this.listQuery.pageIndex = val;
      this.selectSignStatusList();
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.selectSignStatusList();
    },
    async handleDownload() {
      this.downloadLoading = true;
      const excel = await import('@/vendor/Export2Excel');
      const tHeader = [
        '培训名称',
        '部门',
        '用户',
        '签到时间'

      ];
      const filterVal = [
        'planName',
        'DeptName',
        'UserName',
        'signDate'
      ];
      const listQuery = this.listQuery;
      listQuery.pageSize = listQuery.downloadValue;
      const { data } = await SelectSignStatusList(this.listQuery);
      const formData = this.formatJson(filterVal, data.DataList);
      excel.export_json_to_excel({
        header: tHeader,
        data: formData,
        filename: '文件名'
      });
      this.downloadLoading = false;
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === 'Matter_Solution') {
            return v[j].map(item => item.Matter);
          } else if (j === 'Matter_Solution1') {
            return v['Matter_Solution'].map(item => item.Solution);
          } else if (j === 'Standard') {
            return v[j] === 0 ? '否' : '是';
          } else {
            return v[j];
          }
        })
      );
    }
  }
};
</script>
