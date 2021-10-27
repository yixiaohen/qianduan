<template>
  <el-container class="article_Table">
    <el-header>
      <el-form
        :inline="true"
        size="mini"
      >
        <el-form-item>
          <el-input
            v-model="val.CatalogCode"
            placeholder="请输入评审标准"
            clearable
            @keyup.enter.native="SelectMyCatalogAuthorizationUser('搜索')"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="val.CatalogName"
            placeholder="请输入评审要点内容"
            clearable
            @keyup.enter.native="SelectMyCatalogAuthorizationUser('搜索')"
          />
        </el-form-item>
        <el-form-item>
          <el-checkbox
            v-model="checked"
            @change="elCheckbox"
          >新分配任务
          </el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button
            icon="el-icon-search"
            size="mini"
            @click="SelectMyCatalogAuthorizationUser('搜索')"
          >搜索
          </el-button>
        </el-form-item>


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
              :value="val.total"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-tooltip content="温馨提示：如果选择导出的条数较大，请耐心等待" placement="right">
            <el-button
              :loading="downloadLoading"
              type="success"
              icon="el-icon-document"
              size="mini"

              @click="handleDownload"
            >导出
            </el-button>
          </el-tooltip>

          <!--          <el-tag type="info">-->
          <!--    -->
          <!--          </el-tag>-->
        </el-form-item>
      </el-form>
    </el-header>
    <el-main>
      <el-table
        v-loading="tableloading"
        :data="tableData"
        border
        style="width: 100%"
        size="mini"
        height="calc(100vh - 150px)"
        row-key="CatalogID"
        highlight-current-row
        :span-method="objectSpanMethod"
      >
        <el-table-column
          width="50"
          align="center"
          label=""
          type="index"
        />
        <el-table-column
          prop="catalogCode"
          label="评审标准"
          align="center"
          width="80"
        />
        <el-table-column
          prop="CatalogName"
          label="标题"
          width="160"
          align="center"
          :show-overflow-tooltip="cellOverflow"
        />
        <el-table-column
          v-if="CatalogVersion == '中医院' ? false : true"
          prop="pointCode"
          label="标题编号"
          align="center"
          width="80"
        />
        <el-table-column
          v-if="CatalogVersion == '中医院' ? false : true"
          prop="pointItem"
          label="评审项目"
          align="center"
          width="70"
        />
        <el-table-column
          prop="IsPoint"
          label="核心条款"
          align="center"
          width="80"
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

        <el-table-column
          width="80"
          label="考评办法"
          align="center"
        >
          <template slot-scope="{ row }">
            <el-button
              size="mini"
              icon="el-icon-view"
              @click="seeCheck(row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="上传资料"
          width="80"
          align="center"
        >
          <template slot-scope="{ row }">
            <el-button
              icon="el-icon-upload"
              size="mini"
              circle
              @click="addArtical(row, '上传资料')"
            />
          </template>
        </el-table-column>
        <el-table-column
          v-if="ArticleCount"
          width="60"
          prop="ArticleCount"
          label="资料数"
          align="center"
        >
          <template slot-scope="{ row }">
            <span
              style="cursor: pointer !important; color: #3e84e9"
              @click="history(row)"
            >{{ row.ArticleCount }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="CatalogVersion == '中医院' ? false : true"
          prop="pointName"
          label="评审要点内容"
          align="center"
          :show-overflow-tooltip="cellOverflow"
        />

      </el-table>
      <el-row>
        <el-col :span="1">
          <el-switch
            v-model="cellOverflow"
            style="margin: 6px 0px"
          />
        </el-col>
        <el-col :span="20">
          <el-pagination
            :current-page="val.pageIndex"
            :page-sizes="[10, 15, 20, 30, 50, 100]"
            :page-size="val.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="val.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-col>
      </el-row>

      <el-dialog
        :title="dialogTitle + ' : ' + CatalogCode"
        :width="device === 'desktop' ? '50%' : '100%'"
        :close-on-click-modal="false"
        :visible.sync="dialogVisible"
        @opened="opened"
        @close="cancel"
      >
        <el-tabs v-model="activeName">
          <el-tab-pane
            label="基本信息"
            name="first"
          >
            <el-form
              ref="listQuery"
              :rules="rules"
              size="mini"
              :model="listQuery"
              :inline="true"
              label-width="80px"
            >
              <div style="display: flex; flex-wrap: wrap">
                <el-form-item
                  label="资料标题"
                  prop="Title"
                >
                  <el-input
                    v-model="listQuery.Title"
                    style="width: 300px"
                  />
                </el-form-item>
                <el-form-item
                  label="资料分类"
                  prop="GroupID"
                >
                  <articlegroup
                    style="width: 140px"
                    :value="listQuery.GroupID"
                    @getSelectAllArticleGroupValue="
                      getSelectAllArticleGroupValue
                    "
                  />
                </el-form-item>
                <el-form-item
                  label="版本号"
                  prop="VersionNumber"
                >
                  <el-input v-model="listQuery.VersionNumber" />
                </el-form-item>
              </div>
              <el-form-item label="附件上传">
                <el-upload
                  :multiple="true"
                  :show-file-list="true"
                  :on-success="handleSuccess"
                  :on-change="handleChange"
                  :on-remove="handleRemove"
                  class="editor-slide-upload"
                  :file-list="fileList"
                  :disabled="uploadEnd"
                  action="/api/Article/UploadFile"
                >
                  <el-button
                    size="mini"
                    type="primary"
                    :disabled="uploadEnd"
                  >选择本地文件
                  </el-button>
                </el-upload>
              </el-form-item>
              <!-- <el-form-item>
                <el-button
                  type="primary"
                  @click="openNetworkDisk"
                >
                  选择个人云盘文件
                  <i class="el-icon-upload el-icon--right" />
                </el-button>
              </el-form-item> -->
              <filePreview :preview-data="listQuery.File_list" />
              <tinymce ref="tinymceRef" />
            </el-form>
          </el-tab-pane>
          <el-tab-pane
            label="指定可见人"
            name="second"
          >
            <h3 style="padding: 0px; margin: 0px; color: red">
              注意：不选则所有人可见
            </h3>
            <select-deptor-user
              ref="userTree"
              @getSelectDeptorUser="getSelectDeptorUser"
            />
          </el-tab-pane>
        </el-tabs>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            size="small"
            @click="dialogVisible = false"
          >关闭
          </el-button>
          <el-button
            type="primary"
            size="small"
            :loading="uploadEnd"
            @click="InsertArticle('listQuery')"
          >提交
          </el-button>
        </div>
      </el-dialog>
      <el-dialog
        title="资料数量"
        :width="device === 'desktop' ? '20%' : '100%'"
        :close-on-click-modal="false"
        :visible.sync="dialogDetails"
      >
        <el-form
          ref="form"
          label-position="left"
          class="fromDetails"
          :model="historyData"
          label-width="80px"
        >
          <el-form-item label="标准">
            <el-input
              v-model="historyData.catalogCode"
              size="mini"
            />
          </el-form-item>
          <el-form-item label="未审核资料数量:">
            <el-input
              v-model="historyData.UnReviewCount"
              size="mini"
            />
          </el-form-item>
          <el-form-item label="已审核资料数量:">
            <el-input
              v-model="historyData.ReviewCount"
              size="mini"
            />
          </el-form-item>
          <el-form-item label="已退回资料数量:">
            <el-input
              v-model="historyData.BackCount"
              size="mini"
            />
          </el-form-item>
          <el-form-item label="资料总数量:">
            <el-input
              v-model="historyData.ArticleCount"
              size="mini"
            />
          </el-form-item>
        </el-form>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            type="primary"
            size="mini"
            @click="dialogDetails = false"
          >关闭
          </el-button>
        </div>
      </el-dialog>
      <el-dialog
        title="我的云盘"
        :width="device === 'desktop' ? '70%' : '100%'"
        :close-on-click-modal="false"
        :visible.sync="dialogNetworkDisk"
      >
        <networkDisk @select="select" />
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            type="primary"
            size="mini"
            @click="SelectMeanFile"
          >确定
          </el-button>
        </div>
      </el-dialog>
      <el-dialog
        title="考评办法"
        :visible.sync="dialogVisibleKaoPing"
        width="50%"
      >
        <el-table
          v-loading="midLoading"
          class="middleBodyTb"
          :data="ResortName"
          border
          size="mini"
          style="width: 100%"
          highlight-current-row
          min-height="50px"
        >
          <el-table-column
            prop="ResortID"
            label="编码"
            width="60"
          />
          <el-table-column
            prop="ResortName"
            label="内容"
          />
          <el-table-column
            label="查看附件"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                circle
                type="primary"
                icon="el-icon-view"
                @click="seeUpload(scope.row)"
              />
            </template>
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleKaoPing = false">取 消</el-button>

        </span>

        <!--      考评办法对话框里面的分页-->
        <!--        <el-pagination-->
        <!--          style="margin: 6px 0 0 0"-->
        <!--          background-->
        <!--          :current-page="midpagination.pageIndex"-->
        <!--          :page-size="midpagination.pageSize"-->
        <!--          :page-sizes="midpagination.pageSizes"-->
        <!--          :total="midpagination.total"-->
        <!--          layout="total, sizes, prev, pager, next, jumper"-->
        <!--          @size-change="midPgSizeChange"-->
        <!--          @current-change="midPgChange"-->
        <!--        />-->

      </el-dialog>
      <!--        考评办法附件查看框-->
      <el-dialog
        title="提示"
        :visible.sync="kaoPinBanFaKaoPinFuJian"
        width="50%"
      >
        <file-preview3
          ref="filePreview3"
          :preview-data="fileListKaoPinFuJian"
          :delete-show-file="true"
        />
        <span slot="footer" class="dialog-footer">
          <el-button @click="kaoPinBanFaKaoPinFuJian = false">取 消</el-button>
        </span>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
import { InsertArticle, SelectMyCatalogAuthorizationUser } from '@/api/Article';
import { mapGetters } from 'vuex';
import articlegroup from '@/views/components/articlegroup';
import SelectDeptorUser from '@/views/components/SelectDeptorUser';
import tinymce from '@/components/tinymce';
import networkDisk from '@/views/Reviewmanagement/networkDisk';
import { SelectMeanFile } from '@/api/reviewmanagement/networkDisk/Mean';
import filePreview from '@/views/components/file/filePreview';
import { SelectResort, SelectResortFile } from '@/api/Resort';
import filePreview3 from '@/views/components/file/filePreview3';

export default {
  name: 'ArticleTable',
  components: { filePreview, articlegroup, SelectDeptorUser, tinymce, networkDisk, filePreview3 },
  data() {
    return {
      kaoPinBanFaID: 0, // 当前点击的考评办法ID
      kaoPinBanFaKaoPinFuJian: false, // 考评办法附件查看框控制显隐
      fileListKaoPinFuJian: [], // 考评办法附件数据
      midLoading: true, // 考评办法列表加载显示条打开
      ResortName: [], // 考评办法里面的数据
      midpagination: { // 考评办法对话框里面的分页设置
        pageIndex: 1,
        total: 0,
        pageSize: 50,
        pageSizes: [2, 20, 50, 100, 150, 200]
      },
      dialogVisibleKaoPing: false, // 考评办法对话框显示隐藏
      downloadLoading: false,
      listLoading: true,
      downloadValue: '',
      FileStatus: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '已上传资料',
          value: '1'
        },
        {
          label: '未上传资料',
          value: '2'
        }
      ],
      UploadState: '',
      tableData: [],
      input: '',
      val: {
        UsersID: window.userInfo[0].UserID,
        pageIndex: 1,
        pageSize: 50,
        total: 0,
        CatalogName: '',
        CatalogCode: '',
        IsExport: '', // 判断是否导出
        Type: this.$route.params.Type || ''
      },
      checked: !!this.$route.params.Type,
      dialogVisible: false,
      dialogTitle: '上传资料',
      CatalogCode: '',
      rules: {
        Title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        GroupID: [{ required: true, message: '请选择资料', trigger: 'blur' }]
      },
      listQuery: {
        Title: '',
        GroupID: 0,
        CatalogID: '',
        Content: '1',
        VersionNumber: '',
        AuthorID: window.userInfo[0].UserID,
        AllowUserID: '',
        File_list: []
      },
      fileList: [],
      uploadEnd: false,

      tableloading: false,
      isClear: false,
      dialogDetails: false,
      historyData: {},
      ArticleCount: false,
      CatalogVersion: window.CatalogVersion,
      cellOverflow: false,
      activeName: 'first',
      dialogNetworkDisk: false,
      MeanID: ''
    };
  },
  created() {
    this.SelectMyCatalogAuthorizationUser();
    this.getInt();
  },
  computed: {
    ...mapGetters(['device'])
  },
  methods: {
    // 查看考评办法
    async seeCheck(row) {
      this.dialogVisibleKaoPing = true; // 打开对话框
      console.log('看下' + row.CatalogID);
      this.kaoPinBanFaID = row.CatalogID; // 考评办法ID
      const val = { // 接口传值
        CatalogID: this.kaoPinBanFaID,
        pageIndex: this.midpagination.pageIndex,
        pageSize: this.midpagination.pageSize
      };
      try {
        const { data } = await SelectResort(val);
        !data.DataList.length
          ? (this.ResortName = [])
          : (this.ResortName = data.DataList);
        this.midpagination.total = data.Total;
      } catch (error) {
        console.log(error);
      } finally {
        this.midLoading = false;
      }
    },
    // 查看考评办法里面的附件查看
    async seeUpload(x) {
      this.kaoPinBanFaKaoPinFuJian = true; // 打卡考评办法附件对话框
      const { data } = await SelectResortFile({
        ResortID: x.ResortID
      });
      console.log(x);
      this.fileListKaoPinFuJian = data;
    },
    // 查看考评办法分页
    midPgChange(index) {
      this.midLoading = true;
      this.midpagination.pageIndex = index;
      this.seeCheck();
      this.midLoading = false;
    },
    midPgSizeChange(page) {
      this.midLoading = true;
      this.midpagination.pageSize = page;
      this.seeCheck();
      this.midLoading = false;
    },
    // 导出功能
    async handleDownload() {
      this.downloadLoading = true;
      if (!this.downloadValue) {
        this.val.pageSize = this.val.total;
      } else {
        this.val.pageSize = this.downloadValue;
      }
      this.val.IsExport = '是';
      const { data } = await SelectMyCatalogAuthorizationUser(this.val);
      this.tableData = data.DataList;

      try {
        const excel = await import('@/vendor/Export2Excel');
        const tHeader = [
          '评审标准',
          '标准内容',
          '评审等级',
          '评审项目',
          '核心条款',
          '评审要点内容',
          '资料数'
        ];
        const filterVal = [
          'catalogCode',
          'CatalogName',
          'pointCode',
          'pointItem',
          'IsPoint',
          'pointName',
          'ArticleCount'
        ];
        const formData = this.formatJson(filterVal, this.tableData);
        excel.export_json_to_excel({
          header: tHeader,
          data: formData,
          filename: '快捷资料上传数据'
        });
        this.downloadLoading = false;
      } catch (error) {
        console.error(error);
      }
    },
    // 导出功能
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
    getInt() {
      const para = this.$store.getters.iniPara;
      this.ArticleCount = para.ArticleCount === 1;
    },
    async SelectMyCatalogAuthorizationUser(value) {
      try {
        this.val.pageIndex = value == '搜索' ? 1 : this.val.pageIndex;
        this.tableloading = true;
        const { data } = await SelectMyCatalogAuthorizationUser(this.val);
        this.tableData = data.DataList;
        this.getJBXXTableData();
        this.val.total = data.Total;
      } catch (error) {
      }
      this.tableloading = false;
    },
    getJBXXTableData() {
      this.spanOneArr = [];
      this.spanTwoArr = [];
      let concatOne = 0;
      let concatTwo = 0;
      this.tableData.map((item, index) => {
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
      if (columnIndex === 1 || columnIndex === 2) {
        const _row = this.spanOneArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return [_row, _col];
      } else if (columnIndex === 3) {
        const _row = this.spanTwoArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return [_row, _col];
      }
    },
    searchCatalog() {
    },
    async addArtical(row, text) {
      this.listQuery.Title = '';
      this.listQuery.GroupID = 0;
      this.listQuery.CatalogID = '';
      this.listQuery.Content = ' ';

      this.listQuery.VersionNumber = '';
      this.fileList = [];
      this.listQuery.File_list = [];
      if (text === '上传资料') {
        this.dialogTitle = '上传资料';
        this.listQuery.CatalogID = row.CatalogID;
      }
      this.CatalogCode = row.catalogCode;
      this.$nextTick(() => {
        this.$refs.tinymceRef.setContent(this.listQuery.Content);
        this.$refs.userTree.setDeptorUser([]);
      });
      this.dialogVisible = true;
    },
    handleSizeChange(val) {
      this.val.pageSize = val;
      this.SelectMyCatalogAuthorizationUser();
    },
    handleCurrentChange(val) {
      this.val.pageIndex = val;
      this.SelectMyCatalogAuthorizationUser();
    },
    InsertArticle(listQuerys) {
      this.$refs[listQuerys].validate(async v => {
        if (v) {
          if (this.listQuery.GroupID === 0) {
            this.$message.success('请填写资料分类');
            return;
          }
          this.uploadEnd = true;
          this.listQuery.Content = this.listQuery.Content = this.$refs.tinymceRef.Submit();
          try {
            const { msg } = await InsertArticle(this.listQuery);
            this.$message.success(msg);
            this.fileList = [];
            this.dialogVisible = false;
            this.tableData = [];
          } catch (error) {
            console.log(error);
          }
          await this.SelectMyCatalogAuthorizationUser();
          this.uploadEnd = false;
          this.currentEdit = -1;// 将修改input框隐藏
        }
      });
    },
    getSelectAllArticleGroupValue(value) {
      this.listQuery.GroupID = value;
    },
    handleChange(file) {
      try {
        this.uploadEnd = true;
        if (file.hasOwnProperty('response')) {
          this.uploadEnd = false;
        }
      } catch (error) {
        this.uploadEnd = false;
      }
    },

    handleSuccess(response, file) {
      if (response.hasOwnProperty('data')) {
        this.listQuery.File_list.push({
          FileName: file.name,
          FileUrl: response.data[0].Content
        });
        this.uploadEnd = false;
      } else {
        this.fileList = [];
        this.$message.error(file.name + '上传失败');
      }
    },
    handleRemove(file) {
      this.listQuery.File_list.splice(
        this.listQuery.File_list.indexOf(file.response.data[0].Content),
        1
      );
      this.listQuery.File_list.splice(
        this.listQuery.File_list.indexOf(file.response.data[0].Title),
        1
      );
    },
    opened() {
      this.fileList = [];
    },
    cancel() {
      this.$nextTick(() => {
        this.$refs.tinymceRef.deactivated(); /* 销毁编辑器 */
      });
    },
    history(row) {
      this.dialogDetails = true;
      this.historyData = row;
    },
    getSelectDeptorUser(val) {
      this.listQuery.AllowUserID = val.join(',');
    },
    elCheckbox(val) {
      this.val.Type = val ? '1' : '';
      this.SelectMyCatalogAuthorizationUser();
    },
    openNetworkDisk() {
      this.dialogNetworkDisk = true;
    },
    async SelectMeanFile() {
      const { data } = await SelectMeanFile({
        MeanID: this.MeanID
      });
      this.listQuery.File_list.push(...data);
      this.dialogNetworkDisk = false;
    },
    async select(val) {
      this.MeanID = val[0].MeanID;
    }
  }
};
</script>
<style lang="scss">
.article_Table {
  .el-header,
  .el-main,
  .el-footer {
    padding: 0;
    margin: 0;
  }

  .el-header {
    height: 30px !important;
  }

  .fromDetails {
    .el-form-item__label {
      width: 120px !important;
    }

    .el-input {
      width: 60%;
    }
  }

  .el-loading-spinner {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    -webkit-animation: typing 1s linear infinite alternate;
    -moz-animation: Typing 1s linear infinite alternate;
    animation: typing 1s linear infinite alternate;
    margin: 0px auto; /* Not necessary- its only for layouting*/
    position: relative;
    left: -40px;
  }

  @-webkit-keyframes typing {
    0% {
      background-color: rgba(247, 111, 73, 1);
      box-shadow: 40px 0px 0px 0px rgba(247, 111, 73, 0.2),
      80px 0px 0px 0px rgba(247, 111, 73, 0.2);
    }
    25% {
      background-color: rgba(247, 111, 73, 0.4);
      box-shadow: 40px 0px 0px 0px rgba(247, 111, 73, 2),
      80px 0px 0px 0px rgba(247, 111, 73, 0.2);
    }
    75% {
      background-color: rgba(247, 111, 73, 0.4);
      box-shadow: 40px 0px 0px 0px rgba(247, 111, 73, 0.2),
      80px 0px 0px 0px rgba(247, 111, 73, 1);
    }
  }

  @-moz-keyframes typing {
    0% {
      background-color: rgba(247, 111, 73, 1);
      box-shadow: 40px 0px 0px 0px rgba(247, 111, 73, 0.2),
      80px 0px 0px 0px rgba(247, 111, 73, 0.2);
    }
    25% {
      background-color: rgba(247, 111, 73, 0.4);
      box-shadow: 40px 0px 0px 0px rgba(247, 111, 73, 2),
      80px 0px 0px 0px rgba(247, 111, 73, 0.2);
    }
    75% {
      background-color: rgba(247, 111, 73, 0.4);
      box-shadow: 40px 0px 0px 0px rgba(247, 111, 73, 0.2),
      80px 0px 0px 0px rgba(247, 111, 73, 1);
    }
  }
  @keyframes typing {
    0% {
      background-color: rgba(247, 111, 73, 1);
      box-shadow: 40px 0px 0px 0px rgba(247, 111, 73, 0.2),
      80px 0px 0px 0px rgba(247, 111, 73, 0.2);
    }
    25% {
      background-color: rgba(247, 111, 73, 0.4);
      box-shadow: 40px 0px 0px 0px rgba(247, 111, 73, 2),
      80px 0px 0px 0px rgba(247, 111, 73, 0.2);
    }
    75% {
      background-color: rgba(0, 184, 220, 0.4);
      box-shadow: 40px 0px 0px 0px rgba(249, 54, 0, 0.2),
      80px 0px 0px 0px rgb(2, 243, 130);
    }
  }

  .el-loading-spinner .circular {
    display: none; //隐藏之前element-ui默认的loading动画
  }
}
</style>
