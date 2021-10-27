<template>
  <el-dialog
    title="表单列表"
    :close-on-click-modal="false"
    :visible.sync="innerVisible"
    :width="device === 'desktop' ? '60%' : '99%'"
    height="calc(100vh - 400px)"
    top="1rem"
  >
    <el-form :inline="true" size="mini">
      <el-form-item>
        <el-input
          v-model="listQuery.RC_TemplateName"
          placeholder="表单名称"
          size="mini"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="listQuery.RC_TemplateType"
          clearable
          placeholder="表单类型"
        >
          <el-option label="通用表单" value="通用表单" />
          <el-option label="科室表单" value="科室表单" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="listQuery.TemplateTypeName"
          clearable
          placeholder="表单类别"
        >
          <el-option
            v-for="(item, index) in tableTypeData"
            :key="index"
            :label="item.TemplateTypeName"
            :value="item.TemplateTypeName"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="listQuery.TemplateSource" placeholder="表单来源">
          <el-option label="全部" value="全部" />
          <el-option label="系统表单" value="系统表单" />
          <el-option label="自建表单" value="自建表单" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="clickSelectTemplate()"
        >搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      style="width: 100%"
      border
      size="mini"
      height="calc(100vh - 200px)"
    >
      <el-table-column prop="RC_TemplateName" label="表单名称" />
      <el-table-column label="表单类型" prop="RC_TemplateType" align="center" />
      <el-table-column
        label="表单类别"
        prop="TemplateTypeName"
        align="center"
      />
      <el-table-column label="表单来源" prop="TemplateSource" align="center" />
      <el-table-column
        label="操作"
        prop="RC_TemplateName"
        align="center"
        width="90"
      >
        <template slot-scope="scope">
          <el-button
            type="info"
            size="mini"
            @click="Select(scope.row)"
          >选择</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin: 6px 0 0 0"
      background
      :current-page.sync="listQuery.pageIndex"
      :page-size="listQuery.pageSize"
      :page-sizes="listQuery.pageSizes"
      :total="listQuery.total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-dialog>
</template>
<script>
import { SelectTemplate, SelectTemplateType } from '@/api/RC_Template';
import { mapGetters } from 'vuex';

export default {
  name: 'TemplateList',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    templatetype: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      innerVisible: false,
      tableData: [],
      pagination: {
        pageIndex: 1,
        total: 0,
        pageSize: 20,
        pageSizes: [20, 50, 100, 150, 200]
      },
      listQuery: {
        pageIndex: 1,
        pageSize: 20,
        total: 0,
        pageSizes: [20, 50, 100, 150, 200],
        TemplateTypeName: '',
        RC_TemplateName: '',
        RC_TemplateType: '',
        UserID: window.userInfo[0].UserID,
        condition1: this.templatetype,
        StateType: 0 /* 0代表已启用的表单 */,
        TemplateSource: '全部'
      },
      tableTypeData: []
    };
  },
  watch: {
    templateType: {
      handler: function(v) {
        this.listQuery.condition1 = v;
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters(['device'])
  },
  created() {
    this.SelectTemplate();
    this.SelectTemplateType();
  },
  methods: {
    Select(row) {
      this.$emit('getTemplateID', row);
      this.innerVisible = false;
    },
    open() {
      this.SelectTemplate();
      this.innerVisible = true;
    },
    async SelectTemplate() {
      try {
        const { data } = await SelectTemplate(this.listQuery);
        this.tableData = data.DataList;
        this.listQuery.total = data.Total;
      } catch {}
    },
    async clickSelectTemplate() {
      this.listQuery.pageIndex = 1;
      this.SelectTemplate();
    },
    handleCurrentChange(index) {
      this.listQuery.pageIndex = index;
      this.SelectTemplate();
    },
    handleSizeChange(page) {
      this.listQuery.pageSize = page;
      this.SelectTemplate();
    },
    async SelectTemplateType() {
      try {
        const { data } = await SelectTemplateType({
          TemplateTypeName: ''
        });
        this.tableTypeData = data;
      } catch (error) {}
    }
  }
};
</script>
<style lang="scss" scoped></style>
