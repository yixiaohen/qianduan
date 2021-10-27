<template>
  <div class="Article">
    <el-card>
      <div slot="header" class="clearfix">
        <el-form :inline="true" size="mini">
          <el-form-item>
            <el-input
              placeholder="扣分原因"
              style="width: 180px;"
              size="mini"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-button type="info" icon="el-icon-search" size="mini">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="content">
        <el-pagination
          style="margin:6px 0 0 0"
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
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'Article',
  data() {
    return {

    };
  }
};
</script>
<style lang="scss">
.Article {
  margin: 4px;
  .el-card__body {
    padding: 6px;
  }
  .el-card__header {
    padding: 2px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    .el-form-item {
      margin: 5px 0;
      margin-left: 10px;
    }
  }
}
</style>
