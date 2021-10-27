<template>
  <el-container class="points">
    <el-header>
      <el-form
        :inline="true"
        :model="ErrorQuery"
        size="mini"
      >
        <el-form-item>
          <el-input
            v-model="ErrorQuery.ErrorContent"
            placeholder="扣分内容"
            style="width: 200px"
            size="mini"
            clearable
            @keyup.enter.native="SelectRC_Error('select')"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="ErrorQuery.TypeName"
            placeholder="扣分原因类型"
            style="width: 200px"
            size="mini"
            clearable
            @keyup.enter.native="SelectRC_Error('select')"
          ><i
            slot="prefix"
            class="el-input__icon el-icon-search"
          /></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="SelectRC_Error('select')"
          >搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="mini"
            @click="insetRC_ErrorData()"
          >新增</el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main>
      <el-table
        ref="RC_ErrorMultipleTable"
        v-loading="errorLoading"
        v-el-table-infinite-scroll="load"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        :data="RC_ErrorData"
        :row-key="getRowKey"
        border
        height="calc(100vh - 300px)"
        size="mini"
        class="infinite-list"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="40"
          :reserve-selection="true"
          align="center"
        />
        <el-table-column
          type="index"
          label="序号"
          width="60"
          align="center"
          fixed="left"
        />
        <el-table-column
          prop="ErrorContent"
          label="扣分内容"
          align="left"
        />
        <el-table-column
          prop="Grade"
          label="扣分分数"
          align="left"
        />
        <el-table-column
          prop="TypeName"
          label="扣分类型"
          align="left"
        />
        <el-table-column
          prop="CreateUser"
          label="创建人"
          align="left"
        />
        <el-table-column
          prop="CreateTime"
          label="创建时间"
          align="left"
          class="infinite-list-item"
        />
      </el-table>
    </el-main>
  </el-container>
</template>
<script>
import elTableInfiniteScroll from 'el-table-infinite-scroll';
import { SelectRC_Error, SelectRC_ErrorType } from '@/api/RC_Error';

export default {
  directives: {
    'el-table-infinite-scroll': elTableInfiniteScroll
  },
  data() {
    return {
      RC_ErrorData: [],
      RC_ErrorTypeData: [],
      selectRC_ErrorTypeVal: {
        pageIndex: 1,
        pageSize: 30,
        Total: 0,
        TypeName: ''

      },
      ErrorQuery: {
        total: 0,
        pageSize: 30,
        pageIndex: 1,
        ErrorContent: '',
        TypeName: '',
        pageIndexSize: 0
      },
      tableRC_ErrorTitle: [
        {
          title: '扣分内容',
          prop: 'ErrorContent'
        },
        {
          title: '扣分分数',
          prop: 'Grade',
          types: 'Number'
        },
        {
          title: '创建人',
          prop: 'CreateUser',
          disabled: true
        },
        {
          title: '创建时间',
          prop: 'CreateTime',
          disabled: true
        }
      ],
      errorLoading: false,
      currentEdit: -1

    };
  },
  created() {
    this.SelectRC_Error();
    this.SelectRC_ErrorType();
  },
  methods: {
    async insetRC_ErrorData() {

    },
    async SelectRC_Error() {
      try {
        this.errorLoading = true;
        this.ErrorQuery.pageIndex = 1;
        const { data } = await SelectRC_Error(this.ErrorQuery);
        this.RC_ErrorData = data.DataList;
        this.ErrorQuery.pageIndexSize = data.Total / this.ErrorQuery.pageSize;
      } catch (error) {

      }
      this.errorLoading = false;
    },
    async SelectRC_ErrorType() {
      try {
        const { data } = await SelectRC_ErrorType(this.selectRC_ErrorTypeVal);
        this.RC_ErrorTypeData = data.DataList;
      } catch (error) { }
    },
    handleSelectionChange() {

    },
    getRowKey({ ErrorID }) {
      return ErrorID;
    },
    async load(val) {
      try {
        console.log(this.ErrorQuery.pageIndexSize, this.ErrorQuery.pageIndex);
        if (this.ErrorQuery.pageIndexSize < this.ErrorQuery.pageIndex) {
          return;
        }
        this.ErrorQuery.pageIndex++;
        const { data } = await SelectRC_Error(this.ErrorQuery);
        this.RC_ErrorData = this.RC_ErrorData.concat(data.DataList);
        this.ErrorQuery.total = data.Total;
        // this.$nextTick(() => {
        //   this.$refs.RC_ErrorMultipleTable.clearSelection();
        //   if (this.SelectRC_ErrorData.RC_ErrorID.length > 0) {
        //     this.RC_ErrorData.map((item, index) => {
        //       this.SelectRC_ErrorData.RC_ErrorID.map((item2, index2) => {
        //         if (item.ErrorID == item2) {
        //           this.$refs.RC_ErrorMultipleTable.toggleRowSelection(
        //             item,
        //             true
        //           );
        //         }
        //       });
        //     });
        //   }
        // });
      } catch {
      } finally {
        this.errorLoading = false;
      }
    }

  }
};
</script>
<style lang="scss">
.points {
  //   .el-table {
  //     height: calc(100vh - 300px);
  //     overflow: auto;
  //   }
}
</style>
