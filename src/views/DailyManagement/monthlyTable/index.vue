<template>
  <el-container class="monthly">
    <el-header>
      <el-form :inline="true" :model="formInline" size="mini">
        <el-form-item>
          <el-button
            icon="el-icon-plus"
            type="primary"
            @click="onSubmit"
          >新增月度表单</el-button>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="formInline.name"
            placeholder="表单名称"
            @keyup.enter.native="onSubmit('搜索')"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            icon="el-icon-search"
            type="primary"
            @click="onSubmit"
          >查询</el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        size="mini"
        height="calc(100vh - 200px)"
      >
        <el-table-column prop="date" label="日期" width="180" />
        <el-table-column prop="name" label="姓名" width="180" />
        <el-table-column prop="address" label="地址" />
      </el-table>
    </el-main>
    <el-footer>el-footer</el-footer>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      formInline: {
        name: ''
      },
      tableData: []
    };
  },
  methods: {
    async onSubmit() {}
  }
};
</script>
<style lang="scss">
.monthly {
  .el-header,
  .el-footer {
    padding: 3px 0px;
    height: 40px !important;
  }
  .el-main {
    padding: 0px 0px;
    height: calc(100vh - 180px) !important;
  }
}
</style>
