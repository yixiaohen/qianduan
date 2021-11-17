<template>


  <div class="notices">
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span>
          <i class="el-icon-message-solid"/>
          公告信息
        </span>
      </div>
      <div class="filter-container">
        <el-form :inline="true" :model="listQuery" size="mini">
          <el-form-item>
            <el-input
              v-model="listQuery.condition"
              placeholder="请根据标题查询"
              prefix-icon="el-icon-search"
              size="small"
              style="width: 300px"
              class="filter-item inline-input"
              clearable
            />
            <el-button
              v-waves
              class="filter-item"
              type="primary"
              size="small"
              @click="clickSelectNotice"
            >搜索
            </el-button>
            <el-button v-if="isHave" type="success" size="small" @click="changIsShow">发布公告</el-button>
          </el-form-item>

        </el-form>

        <el-table
          v-loading="listLoading"
          border
          size="mini"
          :data="tableData"
          style="width: 100%"
          height="calc((100vh - 200px))"
        >
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="50"
          />
          <el-table-column
            prop="NoticeTitle"
            label="公告标题"
            :show-overflow-tooltip="cellOverflow"
          />
          <el-table-column
            prop="UserName"
            label="发布者"
            align="center"
            :show-overflow-tooltip="cellOverflow"
          />
          <el-table-column
            prop="CreateTime"
            label="发布时间"
            align="center"
            width="150"
            :show-overflow-tooltip="cellOverflow"
          >
            <template slot-scope="{ row }">
              {{ row.CreateTime.replace('T', ' ') }}
            </template>
          </el-table-column>
          <el-table-column
            prop="DeptName"
            label="接收科室"
            align="center"
            width="200"
            :show-overflow-tooltip="cellOverflow"
          />
          <el-table-column
            prop="NoticeUserName"
            label="接收人"
            align="center"
            :show-overflow-tooltip="cellOverflow"
          />
          <el-table-column
            label="查看"
            fixed="right"
            width="65"
            align="center"
            :show-overflow-tooltip="cellOverflow"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="info"
                icon="el-icon-view"
                plain
                @click="seeNotices(scope.row)"
              />
            </template>
          </el-table-column>
        </el-table>
        <el-row>
          <el-col
            :span="5"
          >
            <el-switch
              v-model="cellOverflow"
              style="margin: 6px 0px"
              active-text="收起"
              inactive-text="展开"
            />
          </el-col>
          <el-col :span="19">
            <el-pagination
              background
              :current-page="pagination.pageIndex"
              :page-size="pagination.pageSize"
              :page-sizes="pagination.pageSizes"
              :total="pagination.total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </el-col>
        </el-row>
      </div>
    </el-card>
    <el-dialog
      :title="'公告标题：' + seeData.NoticeTitle"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      width="60%"
    >
      <el-form
        v-model="labelPosition"
        :model="seeData"
        size="mini"
        label-width="70px"
      >
        <el-form-item label="发布者">
          <el-input disabled :value="seeData.UserName"/>
        </el-form-item>
        <el-form-item label="发布时间">
          <el-input disabled :value="seeData.CreateTime"/>
        </el-form-item>
        <!-- <el-form-item label="发布内容">
          <el-input disabled type="textarea" :value="seeData.NoticeContent" :rows="12" />
        </el-form-item> -->
        <div class="NoticeContent" v-html="seeData.NoticeContent"/>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="mini"
          type="primary"
          @click="dialogVisible = false"
        >知道了</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
import waves from '@/directive/waves';
import { SelectNotice } from '@/api/notice';

export default {
  directives: { waves },
  props: ['isHave'],
  data() {
    return {

      listLoading: false,
      dialogVisible: false,
      labelPosition: 'top',
      tableData: [],
      seeData: {},
      listQuery: {
        pageSize: 15,
        pageIndex: 1,
        NoticeTitle: '', // 公告标题
        DeptName: '', // 发布科室
        SelectLocation: 1
      },
      pagination: {
        pageIndex: 1,
        total: 0,
        pageSize: 15,
        pageSizes: [15, 20, 50, 100, 150, 200]
      },
      cellOverflow: true,

    };
  },
  created() {
    this.SelectNotice();

  },
  methods: {
    changIsShow(){
      this.$emit('changIsShow');
    },
    seeNotices(row) {
      this.seeData = row;
      this.dialogVisible = true;
    },
    async SelectNotice() {
      try {
        const { data } = await SelectNotice(this.listQuery);
        this.tableData = data.DataList;
        this.pagination.total = data.Total;
      } catch {
      } finally {
        this.listLoading = false;
      }
    },
    async clickSelectNotice() {
      this.listQuery.pageIndex = 1;
      this.pagination.pageIndex = 1;
      this.SelectNotice();
    },
    handleCurrentChange(index) {
      this.listLoading = true;
      this.listQuery.pageIndex = index;
      this.SelectNotice();
    },
    handleSizeChange(page) {
      this.listLoading = true;
      this.listQuery.pageSize = page;
      this.clickSelectNotice();
      this.SelectNotice();
    }
  }
};
</script>

<style lang="scss">
.notices {

  margin-bottom: 6px;

  .el-card__body {

    padding: 6px;

    .el-form-item {
      margin: 0;
      margin-bottom: 6px;
    }
  }

  .NoticeContent {
    width: 100%;
    height: 300px;
    overflow-y: auto;
    border: 1px solid gainsboro;
    padding: 5px 10px;
    border-radius: 8px;

    table,
    th,
    td {
      border: 1px solid #eee;
    }
  }

  .el-card__header {
    padding: 6px;
    border-bottom: 1px solid #e6ebf5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    background-color: gainsboro;

    .filter-container {
      padding-bottom: 0px;
    }
  }
}
</style>
