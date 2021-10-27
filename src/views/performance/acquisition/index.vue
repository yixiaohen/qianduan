<template>
  <div class="CatalogAuthorization">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form label-position="right" :inline="true" size="mini">
          <el-form-item>
            <el-input
              v-model="CatalogCodes"
              placeholder="评审标准"
              style="width: 180px"
              size="mini"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="UserNames"
              placeholder="资料录入员姓名"
              style="width: 180px"
              size="mini"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-button
              :loading="listLoading"
              type="info"
              icon="el-icon-search"
              size="mini"
              @click="clickSelectCatalogAuthorization()"
            >搜索</el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-thumb"
              :disabled="listLoading"
              size="mini"
              @click="Authorization({}, '批量')"
            >授权</el-button>
          </el-form-item>
          <el-form-item style="width: 150px">
            <el-select v-model="downloadValue" placeholder="请选择要导出数据">
              <el-option label="前一百条" value="100" />
              <el-option label="前三百条" value="300" />
              <el-option label="前五百条" value="500" />
              <el-option label="前一千条" value="1000" />
              <el-option label="全部" :value="pagination.total" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              :loading="downloadLoading"
              type="success"
              icon="el-icon-document"
              size="mini"
              :disabled="listLoading"
              @click="handleDownload"
            >导出</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="content">
        <el-table
          ref="multipleTable"
          v-loading="listLoading"
          :data="tableData"
          size="mini"
          style="width: 100%"
          border
          select-on-indeterminate
          row-key="CatalogID"
          height="calc(100vh - 216px)"
          :span-method="objectSpanMethod"
          @selection-change="selectionChange"
        >
          <el-table-column type="selection" width="40" align="center" />
          <el-table-column
            prop="catalogCode"
            :label="tableDataTitle[0].vcName"
            align="center"
            width="80"
          />
          <el-table-column
            v-if="CatalogVersion == '中医院' ? false : true"
            prop="pointCode"
            :label="tableDataTitle[1].vcName"
            align="center"
            width="80"
          />
          <el-table-column
            v-if="CatalogVersion == '中医院' ? false : true"
            prop="pointItem"
            :label="tableDataTitle[2].vcName"
            align="center"
            width="70"
          />
          <el-table-column
            prop="IsPoint"
            :label="tableDataTitle[3].vcName"
            align="center"
            width="80"
          >
            <template slot-scope="{ row }">
              <el-tag size="mini" :type="row.IsPoint === 0 ? 'danger' : 'success'">
                {{ row.IsPoint === 0 ? "否" : "是" }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="CatalogName"
            :label="tableDataTitle[4].vcName"
            width="80"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                type="info"
                icon="el-icon-thumb"
                size="mini"
                circle
                @click.native.prevent="Authorization(scope.row, '单选')"
              />
            </template>
          </el-table-column>
          <el-table-column prop="pointName" :label="tableDataTitle[5].vcName" />
          <el-table-column prop="UserName" :label="tableDataTitle[6].vcName" />
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
        <el-dialog
          title="人员选择"
          :close-on-click-modal="false"
          :visible.sync="dialogVisible"
          width="600px"
        >
          <select-deptor-user ref="userTree" @getSelectDeptorUser="getSelectDeptorUser" />
          <span slot="footer" class="dialog-footer">
            <el-button
              type="primary"
              size="mini"
              @click="UpdatetCatalogAuthorization"
            >增量保存</el-button>
            <el-button
              type="info"
              size="mini"
              @click="UpdatetCatalogAuthorization"
            >覆盖保存</el-button>
            <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
          </span>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>
<script>
import { IncrementSave, SelectCatalogAuthorization, UpdatetCatalogAuthorization } from '@/api/CatalogAuthorization';
import SelectDeptorUser from '@/views/components/SelectDeptorUser';
import tableHeight from '@/views/mixin/tableHeight';

export default {
  name: 'CatalogAuthorization',
  components: { SelectDeptorUser },
  mixins: [tableHeight],
  data() {
    return {
      listLoading: true,
      dialogVisible: false,
      downloadLoading: false,
      tableData: [],
      tableDataTitle: [],
      spanOneArr: [],
      spanTwoArr: [],
      deptUsers: [],
      CatalogCodes: '',
      UserNames: '',
      formData: {
        AuthorizationID: 0,
        CatalogCode: '',
        UserName: '',
        UsersID: window.userInfo[0].UserID,
        pageSize: 50,
        pageIndex: 1
      },

      formDatas: {
        AllotUserID: window.userInfo[0].UserID /* 当前用户 */,
        CatalogPath: '' /* 父节点ID */,
        CatalogID: '',
        UserID: window.userInfo[0].UserID
      },
      options: [
        {
          value: 0,
          label: '执行部门负责人'
        },
        {
          value: 1,
          label: '主管部门负责人'
        },
        {
          value: 2,
          label: '分管院领导'
        }
      ],
      value: 0,
      tableSelecteds: [],
      CatalogIDs: [],
      pagination: {
        pageIndex: 1,
        total: 0,
        pageSize: 50,
        pageSizes: [10, 20, 30, 40, 50, 100]
      },
      onOff: 0,
      selectArr: [],
      downloadValue: '',
      CatalogVersion: window.CatalogVersion
    };
  },
  created() {
    this.SelectCatalogAuthorization();
  },
  methods: {
    getJBXXTableData() {
      this.spanOneArr = [];
      this.spanTwoArr = [];
      let concatOne = 0;
      let concatTwo = 0;
      this.tableData.forEach((item, index) => {
        if (index === 0) {
          this.spanOneArr.push(1);
          this.spanTwoArr.push(1);
        } else {
          if (item.catalogCode === this.tableData[index - 1].catalogCode) {
            // 第一列需合并相同内容的判断条件
            this.spanOneArr[concatOne] += 1;
            this.spanOneArr.push(0);
          } else {
            this.spanOneArr.push(1);
            concatOne = index;
          }
          if (
            item.pointCode === this.tableData[index - 1].pointCode &&
            item.catalogCode === this.tableData[index - 1].catalogCode
          ) {
            // 第二列和第1列需合并相同内容的判断条件
            this.spanTwoArr[concatTwo] += 1;
            this.spanTwoArr.push(0);
          } else {
            this.spanTwoArr.push(1);
            concatTwo = index;
          }
        }
      });
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // if (columnIndex === 0 || columnIndex === 1) {
      if (columnIndex === 1) {
        const _row = this.spanOneArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return [_row, _col];
      } else if (columnIndex === 2) {
        const _row = this.spanTwoArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return [_row, _col];
      }
    },
    async handleDownload() {
      if (!this.downloadValue) {
        this.formData.pageSize = this.pagination.total;
      } else {
        this.formData.pageSize = this.downloadValue;
      }
      const { data } = await SelectCatalogAuthorization(this.formData);
      console.log('data', data);
      const tableData = data.td;
      this.downloadLoading = true;
      try {
        const excel = await import('@/vendor/Export2Excel');
        const tHeader = [
          '评审标准',
          '评审等级',
          '评审项目',
          '核心条款',
          '评审内容',
          '资料录入员姓名'
        ];
        const filterVal = [
          'catalogCode',
          'pointCode',
          'pointItem',
          'IsPoint',
          'pointName',
          'UserName'
        ];
        const formData = this.formatJson(filterVal, tableData);
        excel.export_json_to_excel({
          header: tHeader,
          data: formData,
          filename: '文件名'
        });
        this.downloadLoading = false;
      } catch (error) {
        console.error(error);
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          if (j === 'IsPoint') {
            return v[j] === 0 ? '否' : '是';
          } else {
            return v[j];
          }
        })
      );
    },
    async UpdatetCatalogAuthorization(e) {
      if (
        e.target.innerText === '增量保存' &&
        this.deptUsers.filter(Boolean).length === 0
      ) {
        this.$notify({
          title: '警告',
          type: 'warning',
          message: '至少选择一位人员'
        });
        return;
      }
      this.formDatas.UserID = this.deptUsers.filter(Boolean).join(',') || 0;
      try {
        e.target.innerText === '增量保存'
          ? await IncrementSave(this.formDatas)
          : await UpdatetCatalogAuthorization(this.formDatas);
        this.$message({
          type: 'success',
          message: '修改成功!'
        });

        this.formDatas = {
          AllotUserID: window.userInfo[0].UserID /* 当前用户 */,
          CatalogPath: '' /* 父节点ID */,
          CatalogID: '',
          UserID: window.userInfo[0].UserID
        };
        this.SelectCatalogAuthorization();
      } catch (error) {
      } finally {
        this.dialogVisible = false;
      }
    },
    show(row) {
      this.formData.CatalogCodes = '';
      this.formData.UserNames = '';
      return !row.Children.length;
    },
    Authorization(row, val) {
      this.$nextTick(() => {
        this.$refs.userTree.setDeptorUser([]);
      });
      if (!Object.keys(row).length) {
        this.CatalogIDs = [];
        if (this.tableSelecteds.length) {
          const ParentIDarr = this.tableSelecteds.map((item, index) => {
            return item.ParentID;
          });
          const CatalogIDarr = this.tableSelecteds.map((item, index) => {
            return item.catalogId;
          });

          const compact = (arr) => arr.filter(Boolean); // 过滤
          this.formDatas.CatalogPath = compact(ParentIDarr).join(',');
          this.formDatas.CatalogID = compact(CatalogIDarr).join(',');
          this.dialogVisible = true;
          const UserID = [];
          /* 单选才传默认已选中的 */
          if (this.tableSelecteds.length === 1) {
            this.tableSelecteds.map((item) => {
              UserID.push(item.UserID);
            });
          } else if (val == '单选') {
            UserID.push(row.UserID);
          }
          this.$nextTick(() => {
            this.$refs.userTree.setDeptorUser(
              [...new Set(UserID.join(',').split(','))] || [...new Set(UserID.split(','))]
            );
          });
          return;
        }
        this.$notify({
          title: '警告',
          type: 'warning',
          message: '至少选择一条评审标准进行分配'
        });
      } else {
        this.dialogVisible = true;
        const UserID = row.UserID;
        this.formDatas.CatalogPath = row.ParentID;
        this.$nextTick(() => {
          this.$refs.userTree.setDeptorUser([...new Set(UserID.split(','))]); // new set 去重
        });
        this.formDatas.CatalogID = row.catalogId;
      }
    },
    isDisabled(row) {
      return row.IsCriterion;
    },
    toggleSelection() {
      this.$refs.multipleTable.toggleAllSelection();
    },
    selectionChange(select) {
      // this.tableSelecteds = [];
      const tableArr = [];
      this.tableSelecteds = select;
    },
    getSelectDeptorUser(value) {
      this.deptUsers = value;
    },
    handleCurrentChange(index) {
      this.listLoading = true;
      this.formData.pageIndex = index;
      this.SelectCatalogAuthorization();
    },
    handleSizeChange(page) {
      this.listLoading = true;
      this.formData.pageSize = page;
      this.clickSelectCatalogAuthorization();
    },
    async SelectCatalogAuthorization() {
      this.listLoading = true;
      this.formData.CatalogCode = this.CatalogCodes;
      this.formData.UserName = this.UserNames;
      try {
        const { data } = await SelectCatalogAuthorization(this.formData);
        this.tableDataTitle = data.th;
        this.tableData = data.td;
        this.getJBXXTableData();
        this.pagination.total = data.Count;
      } catch (error) {}
      this.listLoading = false;
    },
    async clickSelectCatalogAuthorization() {
      this.listLoading = true;
      this.formData.pageIndex = 1;
      this.pagination.pageIndex = 1;
      this.SelectCatalogAuthorization();
    }
  }
};
</script>
<style lang="scss">
.CatalogAuthorization {
  /*   .el-table__header-wrapper .el-checkbox {
    //找到表头那一行，然后把里面的复选框隐藏掉
    display: none;
  } */

  margin: 4px;
  .content {
    .el-table--mini {
      height: calc(100vh - 185px) !important;
    }
  }
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
