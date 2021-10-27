<template>
  <el-container class="meetingMy">
    <el-header>
      <el-form ref="listQuery" :inline="true" :model="listQuery" size="mini">
        <el-form-item>
          <el-input
            v-model="listQuery.MeetingName"
            clearable
            placeholder="会议名称"
            @keyup.enter.native="GetJoinMeList('搜索')"
          />
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="dataArr"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00']"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="datePickerChange"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="GetJoinMeList('搜索')"
          >搜索</el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main>
      <el-table
        v-loading="listLoading"
        :data="tableData"
        height="calc(100vh - 216px)"
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
        <el-table-column prop="MeetingName" label="会议名称" />
        <el-table-column prop="DeptName" label="会议科室" />
        <el-table-column prop="MeetingSite" label="会议室地点" />
        <el-table-column prop="MeetingHost" label="主持人" />
        <el-table-column
          prop="IsJoin"
          label="我的参与状态"
          align="center"
          width="250"
        >
          <template slot-scope="{ row }">
            <el-radio-group
              v-model="row.IsJoin"
              size="mini"
              @change="(val) => radioChange(val, row)"
            >
              <el-radio-button :label="1">已参与</el-radio-button>
              <el-radio-button :label="0">不参与</el-radio-button>
              <el-radio-button
                :label="2"
                :disabled="true"
              >待处理</el-radio-button>
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column
          prop="MeetingStartDate"
          label="会议开始时间"
          width="160"
          align="center"
        />
        <el-table-column
          prop="MeetingEndDate"
          label="会议结束时间"
          width="160"
          align="center"
        />
      </el-table>
    </el-main>
    <el-footer>
      <el-pagination
        style="margin: 6px 0 0 0"
        background
        :current-page.sync="listQuery.pageIndex"
        :page-size="listQuery.pageSize"
        :page-sizes="[15, 20, 30, 40, 50]"
        :total="listQuery.Total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-footer>
  </el-container>
</template>
<script>
import { GetJoinMeList, InsertMeetingDetail, UpdateMeetingJoin } from '@/api/managementMeetings/MeetingDetail';

export default {
  data() {
    return {
      listQuery: {
        /*  MeetingName: '', */
        pageIndex: 1,
        pageSize: 20,
        IsJoin: '',
        UserID: 4200,
        Total: 0,
        StartDate: '',
        EndDate: ''
      },
      dataArr: [],
      tableData: [],
      listLoading: false
    };
  },
  created() {
    this.GetJoinMeList();
  },
  methods: {
    async GetJoinMeList(type) {
      this.listQuery.pageIndex = type === '搜索' ? 1 : this.listQuery.pageIndex;
      const { data } = await GetJoinMeList(this.listQuery);
      this.tableData = data.DataList;
      this.listQuery.Total = data.Total;
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.GetJoinMeList('搜索');
    },
    handleCurrentChange(val) {
      this.listQuery.pageIndex = val;
      this.GetJoinMeList();
    },
    async InsertMeetingDetail(IsJoin) {
      const { msg, code } = await InsertMeetingDetail({
        MeetingID: parseInt(this.$route.query.id),
        IsJoin: IsJoin
      });
      code === 200 ? this.$message.success(msg) : this.$message.error(msg);
      code === 200 ? (this.modalShow = false) : '';
      this.$router.push('/managementMeetings/meetingMy');
    },
    radioChange(val, row) {
      const { msg, code } = row.IsJoin ? UpdateMeetingJoin({
        MeetingID: row.MeetingID,
        IsJoin: val
      }) : InsertMeetingDetail({
        MeetingID: row.MeetingID,
        IsJoin: val
      });
      code === 200 ? this.$message.success(msg) : this.$message.error(msg);
      this.GetJoinMeList();
    },
    datePickerChange(val) {
      this.listQuery.StartDate = val ? val[0] : '';
      this.listQuery.EndDate = val ? val[1] : '';
      this.GetJoinMeList('搜索');
    }
  }
};
</script>
<style lang="scss">
.meetingMy {
  .el-header,
  .el-main,
  .el-footer {
    margin: 0;
    padding: 0;
  }
  .el-header {
    height: 40px !important;
    display: flex;
    align-items: center;
  }
}
</style>
