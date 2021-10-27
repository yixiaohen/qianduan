<template>
  <div class="SearchByCategory">
    <div class="display">
      <div class="left">
        <el-card>
          <treeDept ref="treeDepts" :m="false" :h="'826px'" />
        </el-card>
      </div>
      <div class="right">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <el-form :inline="true" size="mini">
              <el-form-item>
                <el-input
                  placeholder="评审条款"
                  style="width: 160px;"
                  size="mini"
                  clearable
                />
              </el-form-item>
              <el-form-item>
                <el-input
                  placeholder="标题"
                  style="width: 160px;"
                  size="mini"
                  clearable
                />
              </el-form-item>
              <el-form-item>
                <articlegroup style="width: 140px;" />
              </el-form-item>
              <el-form-item>
                <el-select
                  size="mini"
                  clearable
                  style="width: 120px;"
                  placeholder="评审状态"
                >
                  <el-option
                    v-for="item in ReviewStatus"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-select
                  size="mini"
                  style="width: 120px;"
                  clearable
                  placeholder="自评结果"
                >
                  <el-option
                    v-for="item in selfResult"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  size="mini"
                >搜索</el-button>
              </el-form-item>
            </el-form>
          </div>
          <el-table
            v-loading="listLoading"
            :data="tableData"
            style="width: 100%"
            border
            size="mini"
            height="743"
          >
            <el-table-column
              type="index"
              label="序号"
              width="60"
              align="center"
            />
            <el-table-column prop="date" label="状态" width="180" />
            <el-table-column prop="name" label="标题" width="180" />
            <el-table-column prop="address" label="条款" />
            <el-table-column prop="address" label="资料类别" />
            <el-table-column prop="address" label="录入用户" />
            <el-table-column prop="address" label="录入时间" />
            <el-table-column prop="address" label="评审状态" />
            <el-table-column prop="address" label="评审结果" />
          </el-table>
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
        </el-card>
      </div>
    </div>
  </div>
</template>
<script>
import treeDept from '@/views/components/treeDept';
import articlegroup from '@/views/components/articlegroup';

export default {
  name: 'SearchByCategory',
  components: { treeDept, articlegroup },
  data() {
    return {
      listLoading: false,
      tableData: [],
      selfResult: [
        {
          value: 'A',
          label: 'A'
        },
        {
          value: 'B',
          label: 'B'
        },
        {
          value: 'C',
          label: 'C'
        },
        {
          value: 'D',
          label: 'D'
        },
        {
          value: 'E',
          label: 'E'
        }
      ],
      ReviewStatus: [
        {
          value: 0,
          label: '全部'
        },
        {
          value: 1,
          label: '未审核'
        },
        {
          value: 2,
          label: '主管部门通过'
        },
        {
          value: 3,
          label: '主管部门退回'
        },
        {
          value: 4,
          label: '分管院领导通过'
        },
        {
          value: 5,
          label: '分管院领导退回'
        }
      ],
      pagination: {
        pageIndex: 1,
        total: 0,
        pageSize: 15,
        pageSizes: [15, 20, 50, 100, 150, 200]
      }
    };
  },
  methods: {
    handleCurrentChange(index) {
      this.listLoading = true;
      this.listQuery.pageIndex = index;
    },
    handleSizeChange(page) {
      this.listLoading = true;
      this.listQuery.pageSize = page;
    }
  }
};
</script>
<style lang="scss">
.SearchByCategory {
  margin: 4px;
  .el-card__body {
    padding: 6px;
  }
  .display {
    display: flex;
    justify-content: center;

    .left {
      width: 16%;
    }
    .right {
      width: 84%;
    }
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
