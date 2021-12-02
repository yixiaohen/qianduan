<template>
  <el-card style="width: 98%;margin: 10px;height: 87vh;overflow: auto">


    <div
      style="width: 100%;
          background-color:#f4f4f5;
          display: inline-block;
          height: 32px;
          line-height: 32px;"
    >
      <el-form
        :inline="true"
        size="mini"
      >

        <el-form-item>
          <el-input
            v-model="CatalogCodes"
            placeholder="评审标准"
            style="width: 180px"
            size="mini"
            clearable
            @keyup.enter.native="clickSelectCatalogAuthorization()"
          />
        </el-form-item>
        <el-divider direction="vertical" />
        <el-form-item>
          <el-input
            v-model="UserNames"
            placeholder="资料录入员姓名"
            style="width: 180px"
            size="mini"
            clearable
            @keyup.enter.native="clickSelectCatalogAuthorization()"
          />
        </el-form-item>
        <el-divider direction="vertical" />
        <el-form-item>
          <el-input
            v-model="formData.CatalogName"
            placeholder="评审要点内容"
            style="width: 180px"
            size="mini"
            clearable
            @keyup.enter.native="clickSelectCatalogAuthorization()"
          />
        </el-form-item>
        <!--        <el-form-item>-->
        <!--          <el-select-->
        <!--            v-model="formData.DeptStatus"-->
        <!--            placeholder="本科室人员是否已分配"-->
        <!--            clearable-->
        <!--            @keyup.enter.native="clickSelectCatalogAuthorization()"-->
        <!--          >-->
        <!--            <el-option-->
        <!--              label="已分配"-->
        <!--              value="1"-->
        <!--            />-->
        <!--            <el-option-->
        <!--              label="未分配"-->
        <!--              value="0"-->
        <!--            />-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <el-divider direction="vertical" />
        <el-form-item>
          <el-select
            v-model="formData.Status"
            placeholder="资料是否已分配"
            clearable
            @keyup.enter.native="clickSelectCatalogAuthorization()"
          >
            <el-option
              label="已分配"
              value="已分配"
            />
            <el-option
              label="未分配"
              value="未分配"
            />
          </el-select>
        </el-form-item>
        <el-divider direction="vertical" />
        <el-form-item>
          <el-button
            :loading="listLoading"
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="clickSelectCatalogAuthorization()"
          >搜索
          </el-button>
        </el-form-item>
        <el-divider direction="vertical" />
        <el-form-item>
          <el-button
            icon="el-icon-thumb"
            :disabled="listLoading"
            size="mini"
            @click="Authorization({}, '批量')"
          >授权
          </el-button>
        </el-form-item>
        <el-divider direction="vertical" />
        <el-form-item style="width: 150px">
          <el-select
            v-model="downloadValue"
            placeholder="请选择要导出数据"
          >
            <el-option
              label="前一百条"
              value="100"
            />
            <el-option
              label="前三百条"
              value="300"
            />
            <el-option
              label="前五百条"
              value="500"
            />
            <el-option
              label="前一千条"
              value="1000"
            />
            <el-option
              label="全部"
              :value="pagination.total"
            />
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
          >导出
          </el-button>
        </el-form-item>

      </el-form>
    </div>

    <el-table
      ref="multipleTable"
      v-loading="listLoading"
      :data="tableData"
      size="mini"
      border
      stripe
      style="margin-top: 10px"
      tooltip-effect="light"
      select-on-indeterminate
      row-key="CatalogID"
      height="calc(100vh - 260px)"
      :span-method="objectSpanMethod"
      highlight-current-row
      @selection-change="selectionChange"
    >
      <!--        评审标准-->
      <el-table-column
        type="selection"
        width="40"
        align="center"
      />
      <el-table-column
        prop="catalogCode"
        label="评审标准"
        align="center"
        width="80"
        :show-overflow-tooltip="cellOverflow"
      >
        <template slot-scope="{ row }">
          <span
            class="CatalogName"
            @click="selectAllot(row)"
          >
            {{ row.catalogCode }}
          </span>
        </template>
      </el-table-column>
      <!--        评审等级-->
      <el-table-column
        v-if="CatalogVersion == '中医院' ? false : true"
        prop="pointCode"
        label="评审等级"
        align="center"
        width="80"
        :show-overflow-tooltip="cellOverflow"
      />
      <!--        <el-table-column-->
      <!--          v-if="CatalogVersion == '中医院' ? false : true"-->
      <!--          prop="pointItem"-->
      <!--          label="细则编码"-->
      <!--          align="center"-->
      <!--          width="70"-->
      <!--          :show-overflow-tooltip="cellOverflow"-->
      <!--        />-->
      <!--评审项目-->
      <el-table-column
        v-if="CatalogVersion == '中医院'|| CatalogVersion == '宁海妇幼保健院' ?false : true"
        prop="pointItem"
        label="评审项目"
        align="center"
        width="70"
        :show-overflow-tooltip="cellOverflow"
      />
      <!--        核心条款-->
      <el-table-column
        v-if=" CatalogVersion == '宁海妇幼保健院' ?false : true"
        prop="IsPoint"
        label="核心条款"
        align="center"
        width="80"
        :show-overflow-tooltip="cellOverflow"
      >
        <template slot-scope="{ row }">
          <el-tag
            size="mini"
            :type="row.IsPoint === 0 ? 'danger' : 'success'"
          >
            {{ row.IsPoint === 0 ? '否' : '是' }}
          </el-tag>
        </template>
      </el-table-column>

      <!--        评审要点内容-->
      <el-table-column
        prop="pointName"
        label="评审要点内容"
        :show-overflow-tooltip="cellOverflow"
      >
        <template slot-scope="{ row }">
          <div v-html="row.pointName" />
        </template>
      </el-table-column>


      <!--        <el-table-column-->
      <!--          prop="DeptStatus"-->
      <!--          label="本科室人员是否分配"-->
      <!--          :show-overflow-tooltip="cellOverflow"-->
      <!--          width="130px"-->
      <!--        >-->
      <!--          <template slot-scope="{ row }">-->
      <!--            <div v-html="row.DeptStatus===1 ?'已分配':'未分配'"/>-->
      <!--          </template>-->
      <!--        </el-table-column>-->

      <el-table-column
        prop="UserName"
        label="资料录入人员"
        :show-overflow-tooltip="cellOverflow"
      >
        <template slot-scope="{ row }">
          <el-popover placement="top-start" title="资料录入人员" width="90%" trigger="hover">
            <div>{{ row.UserName }}</div>
            <span slot="reference">{{ row.UserName }}</span>
          </el-popover>
        </template>

      </el-table-column>
      <!--        授权-->
      <el-table-column
        prop="CatalogName"
        label="授权"
        width="60"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-thumb"
            size="mini"
            circle
            @click.native.prevent="Authorization(scope.row, '单选')"
          />
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="人员选择"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      :width="device === 'desktop' ? '40%' : '90%'"
    >
      <el-container>
        <el-main style="padding: 0px">
          <select-deptor-user
            ref="userTree"
            :value="`资料录入员分配`"
            @getSelectDeptorUser="getSelectDeptorUser"
          />
        </el-main>
        <el-footer style="display: flex; justify-content: space-between; padding: 0px">
          <el-checkbox v-model="formDatas.IsDistribution">用户添加对应角色
                                                          <!--              <span>已选数量:</span>-->
                                                          <!--              <template v-if="$refs.userTree">-->
                                                          <!--                //因为在js里写不能达到效果，不是响应式的可能，所以直接写在页面上-->
                                                          <!--                {{filterCheckedLeaf()}}-->
                                                          <!--              </template>-->
                                                          <!--              <span>{{ selectedNodesNum }}</span>-->

          </el-checkbox>
          <el-tag>已勾选：<span style="color: #4a9de7">{{ manNum }}</span> /2000</el-tag>
          <div>
            <el-button
              type="primary"
              size="mini"
              @click="UpdatetCatalogAuthorization"
            >增量保存
            </el-button>
            <el-button
              v-show="isCover"
              type="info"
              size="mini"
              @click="UpdatetCatalogAuthorization"
            >覆盖保存
            </el-button>
            <el-button
              size="mini"
              @click="dialogVisible = false"
            >取 消
            </el-button>
          </div>
        </el-footer>
      </el-container>
    </el-dialog>
    <el-drawer
      title="历史记录"
      :visible.sync="drawer"
      :direction="device === 'mobile' ? 'btt' : 'rtl'"
      size="50%"
      :with-header="false"
    >
      <el-table
        :data="allotData"
        border
        style="width: 100%"
      >
        <el-table-column
          prop="ReviewName"
          :label="para.menu_one"
        />
        <el-table-column
          prop="ManageName"
          :label="para.menu_two"
        />
        <el-table-column
          prop="VisitName"
          :label="para.menu_three"
        />
      </el-table>
    </el-drawer>


    <el-row>
      <el-col :span="3">
        <el-switch
          v-model="cellOverflow"
          style="margin: 26px 0px"
          active-text="收起"
          inactive-text="展开"
        />
      </el-col>
      <el-col :span="20">
        <el-pagination
          background
          style="margin: 26px 0 0 0"
          :current-page.sync="pagination.pageIndex"
          :page-size="pagination.pageSize"
          :page-sizes="pagination.pageSizes"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-col>
    </el-row>

  </el-card>
</template>
<script>
import {
  IncrementSave,
  SelectCatalogAuthorization,
  SelectLengthUserid,
  UpdatetCatalogAuthorization
} from '@/api/CatalogAuthorization';
import { SelectDeptsByName } from '@/api/user';

import SelectDeptorUser from '@/views/components/SelectDeptorUser';
import tableHeight from '@/views/mixin/tableHeight';
import { mapGetters } from 'vuex';

export default {
  name: 'CatalogAuthorization',
  components: { SelectDeptorUser },
  mixins: [tableHeight],
  data() {
    return {
      megSave: '', // 增量保存和覆盖保存操作时的提示语
      manNum: 0,
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
        pageIndex: 1,
        Status: '',
        DeptStatus: '',
        pointName: '',
        CatalogName: '',
        IsExport: '',
        AllotUserID: window.userInfo[0].UserID
      },

      formDatas: {
        AllotUserID: window.userInfo[0].UserID /* 当前用户 */,
        CatalogPath: '' /* 父节点ID */,
        CatalogID: '',
        UserID: window.userInfo[0].UserID,
        IsDistribution: false,
        AddDeptUser: ''
      },
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
      CatalogVersion: window.CatalogVersion,
      drawer: false,
      allotData: [],
      para: '',
      cellOverflow: true,
      clearfixHeight: 30,
      isCover: true,
      selectedNodesNum: 0,
      nowNum1: 0,
      nowNum2: [],
      totalS: 0
    };
  },
  created() {
    this.SelectCatalogAuthorization();
    this.para = this.$store.getters.iniPara;
    this.SelectDeptsByName();
  },
  computed: {
    ...mapGetters(['device'])
  },
  methods: {
    infoS() {
      this.$message.info('正在加载，请勿离开此界面！');
    },
    infoE() {
      this.$message.success('已加载完成');
    },
    unfold() {
      if (this.clearfixHeight == 30) {
        this.$nextTick(() => {
          if (this.device == 'desktop') {
            this.clearfixHeight = 65;
          } else {
            this.clearfixHeight = 180;
          }
        });
      } else {
        this.clearfixHeight = 30;
      }
    },
    async SelectDeptsByName() {
      const { data } = await SelectDeptsByName({ DeptName: '' });
      if (data[0].DeptName === '浙江省肿瘤医院' && window.userInfo[0].RoleCode !== 'R0001'
      ) {
        this.isCover = false;
      } else {
        this.isCover = true;
      }
    },
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
      this.downloadLoading = true;
      if (!this.downloadValue) {
        this.formData.pageSize = this.pagination.total;
      } else {
        this.formData.pageSize = this.downloadValue;
      }
      this.formData.IsExport = '是';
      const { data } = await SelectCatalogAuthorization(this.formData);
      const tableData = data.td;
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
        this.downloadLoading = false;
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === 'IsPoint') {
            return v[j] === 0 ? '否' : '是';
          } else {
            return v[j];
          }
        })
      );
    },
    // 增量保存和覆盖保存
    async UpdatetCatalogAuthorization(e) {
      if (e.target.innerText === '增量保存') {
        this.megSave = '确认增量保存？将在原人员名单上增加新勾选的人员，即使您取消了原有人员的勾选项，也只会增加新勾选的人员，是否继续？';
      }
      if (e.target.innerText === '覆盖保存') {
        this.megSave = '确认覆盖保存？将保存当前已勾选的人员，如果一个人员也不勾选将会清除原来已分配的人员，是否继续？';
      }
      this.$confirm(this.megSave, '重要提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        this.totalS = this.deptUsers.filter(Boolean).length + this.nowNum1;
        // 至少选择一位人员
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

        // 增量保存不能同时选超过2000人
        if (
          e.target.innerText === '增量保存' &&
          this.deptUsers.filter(Boolean).length >= 2000
        ) {
          this.$notify({
            title: '警告',
            type: 'warning',
            message: '已分配人数和正在选的人数一共不能超过2000人'
          });
          return;
        }
        // 覆盖保存不能同时选超过2000人
        if (
          e.target.innerText === '覆盖保存' &&
          this.deptUsers.filter(Boolean).length >= 2000
        ) {
          this.$notify({
            title: '警告',
            type: 'warning',
            message: '覆盖保存不能同时选超过2000人'
          });
          return;
        }

        this.formDatas.UserID = this.deptUsers.filter(Boolean).join(',') || 0;
        this.formDatas.AddDeptUser =
          this.deptUsers.filter(Boolean).join(',') || 0;
        e.target.innerText === '增量保存'
          ? await IncrementSave(this.formDatas)
          : await UpdatetCatalogAuthorization(this.formDatas);
        this.$message.success('修改成功!');
        this.formDatas = {
          AllotUserID: window.userInfo[0].UserID /* 当前用户 */,
          CatalogPath: '' /* 父节点ID */,
          CatalogID: '',
          UserID: window.userInfo[0].UserID,
          IsDistribution: false
        };
        this.SelectCatalogAuthorization();
        this.dialogVisible = false;
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
    },
    show(row) {
      this.formData.CatalogCodes = '';
      this.formData.UserNames = '';
      return !row.Children.length;
    },
    async Authorization(row, val) {
      this.manNum = this.deptUsers.filter(Boolean).length;
      if (!Object.keys(row).length) {
        if (this.tableSelecteds.length) {
          const ParentIDarr = this.tableSelecteds.map((item, index) => {
            return item.ParentID;
          });
          const CatalogIDarr = this.tableSelecteds.map((item, index) => {
            return item.CatalogID;
          });
          this.selectedNodesNum = CatalogIDarr;
          // 获取已分配数量
          for (let i; i++; i <= CatalogIDarr.length - 1) {
            const { data } = await SelectLengthUserid({
              catalogID: CatalogIDarr[i]
            });
            this.nowNum1 = data;
            this.totalS = 0;
            this.totalS = this.deptUsers.filter(Boolean).length + this.nowNum1;
            if (this.totalS >= 2000) {
              i = CatalogIDarr.length;
              this.$notify({
                title: '警告',
                type: 'warning',
                message: '所选的其中一条条款，已分配的人员和已勾选的人员加起来已超过2000人'
              });
            }
          }
          const compact = arr => arr.filter(Boolean); // 过滤
          this.formDatas.CatalogPath = compact(ParentIDarr).join(',');
          this.formDatas.CatalogID = compact(CatalogIDarr).join(',');
          this.dialogVisible = true;
          const UserID = [];
          /* 单选才传默认已选中的 */
          if (this.tableSelecteds.length === 1) {
            this.tableSelecteds.map(item => {
              UserID.push(item.UserID);
            });
          } else if (val == '单选') {
            UserID.push(row.UserID);
          }
          this.$nextTick(() => {
            this.$refs.userTree.setDeptorUser([]);
            this.$refs.userTree.setDeptorUser(
              [...new Set(UserID ? UserID.join(',').split(',') : [])] || [
                ...new Set(UserID ? UserID.split(',') : [])
              ]
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
        this.formDatas.CatalogID = row.CatalogID;
        // 获取已分配数量
        const { data } = await SelectLengthUserid({
          catalogID: this.formDatas.CatalogID
        });
        this.nowNum1 = data;
        // console.log( this.selectedNodesNum.length);
        this.$nextTick(() => {
          this.$refs.userTree.setDeptorUser([]);
          this.$refs.userTree.setDeptorUser([
            ...new Set(UserID ? UserID.split(',') : [])
          ]); // new set 去重
        });
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
      this.tableSelecteds = select;
    },
    getSelectDeptorUser(value) {
      this.deptUsers = value;
      this.manNum = this.deptUsers.length; // 已勾选人数
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
    // 获取表格数据
    async SelectCatalogAuthorization() {
      this.listLoading = true; // 开启等待圈
      this.formData.CatalogCode = this.CatalogCodes;
      this.formData.UserName = this.UserNames;
      this.formData.Status = this.formData.Status == '全部' ? '' : this.formData.Status;
      this.formData.IsExport = '';
      try {
        const { data } = await SelectCatalogAuthorization(this.formData);
        this.tableDataTitle = data.th;
        this.tableData = data.td;
        // 对CatalogName进行名称排序
        // console.log(this.tableData);
        // this.tableData.sort();
        // this.tableData.sort((a, b) => {
        //   var s = a.pointItem.toLowerCase();
        //   var t = b.pointItem.toLowerCase();
        //   if (s < t) return -1;
        //   if (s > t) return 1;
        // });
        this.getJBXXTableData();
        this.pagination.total = data.Count;
        this.listLoading = false; // 关闭等待圈
      } catch (error) {
        console.log(error);
      }
    },
    async clickSelectCatalogAuthorization() {
      this.formData.pageIndex = 1;
      this.pagination.pageIndex = 1;
      await this.SelectCatalogAuthorization();
    },
    selectAllot(row) {
      this.drawer = true;
      this.allotData = [];
      this.allotData = [];
      this.allotData.push(row);
    }
  }
};
</script>
<style lang="scss" >

</style>
