<template>
  <el-card class="box-card-view">
    <div slot="header" class="clearfix">
      <el-form label-position="left" :inline="true" size="mini">
        <el-form-item>
          <el-input
            v-model="listQuery.EventName"
            placeholder="事件名称"
            style="width: 150px"
            size="mini"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="info"
            icon="el-icon-search"
            :loading="listLoading"
            size="mini"
          >搜索</el-button>
        </el-form-item>
        <!--         <el-form-item>
          <el-button size="mini" type="primary">修改</el-button>
        </el-form-item>
 -->
      </el-form>
    </div>
    <div class="main">
      <split-pane :min-percent="20" :default-percent="60" split="horizontal">
        <template slot="paneL">
          <div class="middle">
            <div class="middleBody">
              <el-table
                v-loading="listLoading"
                :data="tableData"
                height="100%"
                border
                size="mini"
                class="middleBodyTb"
              >
                <el-table-column
                  type="index"
                  width="50"
                  label="序号"
                  align="center"
                />
                <el-table-column
                  prop="EventName"
                  label="不良事件"
                />
                <el-table-column
                  prop="EventTypeName"
                  label="事件类别"
                />
                <el-table-column prop="Status" label="状态" />
                <el-table-column label="最后修改时间">
                  <template slot-scope="{ row }">{{
                    row.LastEditDatetime
                      ? row.LastEditDatetime.replace("T", " ")
                      : ""
                  }}</template>
                </el-table-column>
                <el-table-column label="创建时间">
                  <template slot-scope="{ row }">{{
                    row.CreateDatetime
                      ? row.CreateDatetime.replace("T", " ")
                      : ""
                  }}</template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="95">
                  <template slot-scope="scope">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="修改"
                      placement="right"
                    >
                      <el-button
                        size="mini"
                        circle
                        type="primary"
                        icon="el-icon-edit"
                        @click="edit(scope.row)"
                      />
                    </el-tooltip>
                    <el-button
                      size="mini"
                      circle
                      type="danger"
                      icon="el-icon-delete"
                      @click="deleteRow(scope.row)"
                    />
                  </template>
                </el-table-column>
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
          </div>
        </template>
        <!--  <template slot="paneR">
          <div class="bottom">
            <div>
              <el-table :data="activities" border style="width: 100%">
                <el-table-column prop="timestamp" label="日期" width="180" />
                <el-table-column prop="content" label="姓名" width="180" />
                <el-table-column prop="timestamp" label="地址" />
              </el-table>
            </div>
          </div>
        </template> -->
      </split-pane>
    </div>
  </el-card>
</template>

<script>
import { DeleteReport, SelectReport } from '@/api/AE_Event';
import splitPane from 'vue-splitpane';

export default {
  name: 'AdverseEventsMine',
  components: { splitPane },
  data() {
    return {
      listLoading: false,
      activities: [
        {
          content: '支持使用图标',
          timestamp: '2018-04-12 20:46',
          size: 'large',
          type: 'primary',
          icon: 'el-icon-more'
        },
        {
          content: '支持自定义颜色',
          timestamp: '2018-04-03 20:46',
          color: '#0bbd87'
        },
        {
          content: '支持自定义尺寸',
          timestamp: '2018-04-03 20:46',
          size: 'large'
        },
        {
          content: '默认样式的节点',
          timestamp: '2018-04-03 20:46'
        }
      ],
      listQuery: {
        // condition: '',
        CreateUserID: window.userInfo[0].UserID,
        pageIndex: 1,
        pageSize: 15,
        EventName: ''
      },
      tableData: [],
      pagination: {
        pageIndex: 1,
        total: 0,
        pageSize: 15,
        pageSizes: [15, 20, 50, 100, 150, 200]
      }
    };
  },
  created() {
    this.SelectReport();
  },
  methods: {
    async SelectReport() {
      this.listLoading = true;
      try {
        const { data } = await SelectReport(this.listQuery);
        this.pagination.total = data.Total;
        this.tableData = data.DataList;
      } catch (error) {
        this.$message({ type: 'error', message: error });
      } finally {
        this.listLoading = false;
      }
    },
    handleCurrentChange(index) {
      this.listQuery.pageIndex = index;
      this.SelectReport();
    },
    handleSizeChange(page) {
      this.listQuery.pageSize = page;
      this.clickSelectReport();
    },
    clickSelectReport() {
      this.pagination.pageIndex = 1;
      this.listQuery.pageIndex = 1;
      this.SelectReport();
    },
    async deleteRow(row) {
      const id = row.EventReportID;
      this.$confirm('此操作将永久删除该不良事件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          DeleteReport({ EventReportID: id }).then((data) => {
            if (data.code === 200) {
              this.$message.success('删除成功!');
              this.SelectReport();
            }
          });
        })
        .catch(() => {
          this.$message.success('已取消删除');
        });
    },
    edit(row) {
      this.$router.push({
        name: 'AdverseEventsReport',
        params: { id: row.EventReportID }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.box-card-view {
  margin: 4px;
  overflow: hidden;
  height: calc(100vh - 96px);

  .el-card__body {
    padding: 5px;
  }
  .main {
    widows: 100%;
    height: calc(100vh - 165px);

    overflow: auto;
    .middle {
      height: 100%;
      .middleBody {
        height: calc(100% - 37px);
        overflow-y: hidden;
        .middleBodyTb {
          // height: calc(100% - 37px);
          max-height: calc(100% - 37px);
        }
      }
    }
  }
}
</style>
