<template>
  <el-card
    style="margin: 10px;
      height: 87vh;
      overflow: auto;
"
  >
    <el-container class="selectProvision">
      <el-header>
        <div
          style="width: 100%;
          background-color:#f4f4f5;
          display: inline-block;
          height: 32px;
          line-height: 32px;"
        >
          <el-form
            label-position="left"
            inline
            class="demo-table-expand"
            size="mini"
          >
            <el-form-item>
              <el-input
                v-model="form.CatalogCode"
                placeholder="评审标准"
                clearable
                @keyup.enter.native="SelectEvaluationUser('搜索')"
              >
                <i
                  slot="prefix"
                  class="el-input__icon el-icon-search"
                />
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="SelectEvaluationUser('搜索')"
              >搜索
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-header>
      <el-main>
        <el-table
          v-loading="Loading"
          :data="tableData"
          style="width: 100%"
          size="small"
          border
          stripe
          highlight-current-row
          :header-cell-style="{'text-align':'center'}"
          :cell-style="{'text-align':'center'}"
          height="calc(100vh - 240px)"
          :row-key="getRowKeys"
          :expand-row-keys="!expands"
        >
          <el-table-column type="expand" label="展开">
            <template slot-scope="{ row }">
              <div
                v-for="(item1, index1) in row.Children"
                :key="index1"
                class="trExpand"
              >
                <tr
                  v-for="(item2, index2) in item1.Children.length === 0
                    ? [item1.Children]
                    : item1.Children"
                  :key="index2"
                  class="trExpand"
                >
                  <td>
                  &nbsp;&nbsp;{{
                    item1.Children.length === 0
                      ? item1.SerialNo
                      : item2.SerialNo
                  }}:&nbsp;&nbsp;{{
                    item1.Children.length === 0
                      ? item1.CatalogName
                      : item2.CatalogName
                  }}
                  </td>
                  <td>
                    <p
                      v-for="(itemResort1, indexResort1) in item1.Resort"
                      :key="indexResort1"
                      :v-if="item1.Children.length == 0"
                    >
                      {{ itemResort1.ResortName }}
                    </p>
                    <p
                      v-for="(itemResort2, indexResort2) in item2.Resort"
                      :key="indexResort2"
                      :v-if="item1.Children.length != 0"
                    >
                      {{ itemResort2.ResortName }}
                    </p>
                  </td>
                  <td style="overflow: hidden; text-overflow: ellipsis">
                    <div
                      style="
                      width: 400px;
                      white-space: nowrap;
                      text-overflow: ellipsis;
                      overflow: hidden;
                    "
                      :title="
                        item1.Children.length === 0
                          ? item1.AuthorizationUserName
                          : item2.AuthorizationUserName
                      "
                    >
                      {{
                        item1.Children.length === 0
                          ? item1.AuthorizationUserName
                          : item2.AuthorizationUserName
                      }}
                    </div>
                  </td>
                  <td>
                    <el-link
                      v-for="(item1Article, index1Article) in item1.Article"
                      :key="index1Article"
                      type="primary"
                      :v-if="item1.Children.length === 0"
                      @click="SelectArticleByArticleID(item1Article)"
                    >
                      <i class="el-icon-view el-icon--right" />
                      {{ item1Article.Title }}
                    </el-link>
                    <el-link
                      v-for="(itemArticle, indexArticle) in item2.Article"
                      :key="indexArticle"
                      type="primary"
                      :v-if="item1.Children.length != 0"
                      @click="SelectArticleByArticleID(itemArticle)"
                    ><i class="el-icon-view el-icon--right" />{{
                      itemArticle.Title
                    }}
                    </el-link>
                  </td>
                </tr>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="CatalogCode"
            label="评审标准"
            width="69"
            :show-overflow-tooltip="cellOverflow"
          />
          <el-table-column
            prop="TypeName"
            label="章节"
            width="150"
            :show-overflow-tooltip="cellOverflow"
          />
          <el-table-column
            prop="IsPoint"
            label="核心条款"
            width="69"
            align="center"
          >
            <template slot-scope="{ row }">
              <el-tag
                size="mini"
                :type="row.IsPoint === 0 ? 'danger' : 'success'"
              >{{ row.IsPoint === 0 ? '否' : '是' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="CatalogName"
            label="标准内容"
            :show-overflow-tooltip="cellOverflow"
          >
            <template slot-scope="{ row }">
              <div v-html="row.CatalogName" />
            </template>
          </el-table-column>
          <el-table-column
            prop="GroupName"
            label="组别"
            align="center"
            :show-overflow-tooltip="cellOverflow"
          >
            <template slot-scope="{ row }">
              {{ row.UserName == '' ? row.GroupName : row.UserName }}
            </template>
          </el-table-column>
        </el-table>
        <el-dialog
          :title="'上传人:' + formInline.AuthorName"
          :visible.sync="dialogVisible"
          :width="device === 'desktop' ? '50%' : '90%'"
        >
          <filePreview :preview-data="previewData" />
          <el-form
            size="mini"
            :model="formInline"
            class="demo-form-inline"
          >
            <el-form-item label="">
              <p>上传时间:{{ formInline.CreatDate }}</p>
            </el-form-item>
            <el-form-item label="">
              <p v-html="formInline.Content" />
            </el-form-item>
          </el-form>
          <span
            slot="footer"
            class="dialog-footer"
          >
            <el-button
              size="mini"
              type="primary"
              @click="dialogVisible = false"
            >关闭</el-button>
          </span>
        </el-dialog>
      </el-main>
      <el-footer>
        <el-row>
          <el-col :span="1">
            <el-switch
              v-model="cellOverflow"
              style="margin: 6px 0px"
            />
          </el-col>
          <el-col :span="20">
            <el-pagination
              style="margin-top:10px"
              background
              :current-page="form.pageIndex"
              :page-sizes="[5, 15, 20, 30, 40, 50]"
              :page-size="form.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="form.Total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </el-col>
        </el-row>
      </el-footer>
    </el-container>
  </el-card>
</template>
<script>
import { CatalogSearch, SelectArticleByArticleID } from '@/api/catalog';
import { PreviewFile, SelectArticleDetail } from '@/api/Article';
import filePreview from '@/views/components/file/filePreview';
import { Preview } from '@/views/mixin/relace';
import { mapGetters } from 'vuex';

export default {
  components: { filePreview },
  data() {
    return {
      form: {
        CatalogCode: '',
        CatalogName: '',
        ManageName: '',
        ReviewName: '',
        Status: '',
        Step: 0,
        UserID: window.userInfo[0].UserID,
        VisitName: '',
        pageIndex: 1,
        pageSize: 5
      },
      tableData: [],
      tableEvaluationData: [],
      Loading: false,
      expands: [],
      dialogVisible: false,
      formInline: [],
      cellOverflow: false,
      previewData: []
    };
  },
  computed: {
    ...mapGetters(['device'])
  },
  created() {
    this.SelectEvaluationUser();
  },
  methods: {
    async SelectEvaluationUser(value) {
      try {
        this.form.pageIndex = value == '搜索' ? 1 : this.form.pageIndex;
        this.Loading = true;
        const { data } = await CatalogSearch(this.form);
        this.tableData = data.DataList;
        this.form.Total = data.Total;
        this.tableData.map(item => {
          this.expands.push(item.CatalogID);
        });
      } catch (error) {
      }
      this.Loading = false;
    },
    handleSizeChange(val) {
      this.form.pageSize = val;
      this.SelectEvaluationUser();
    },
    handleCurrentChange(val) {
      this.form.pageIndex = val;
      this.SelectEvaluationUser();
    },
    getRowKeys(row) {
      return row.CatalogID;
    },
    async SelectArticleByArticleID(row) {
      console.log(row);
      try {
        const { data } = await SelectArticleByArticleID({ ArticleID: row.ArticleID });
        const data2 = await SelectArticleDetail({
          ArticleID: row.ArticleID
        });
        this.formInline = data[0];
        this.previewData = [];

        this.previewData = [...Preview(this.formInline.Content), ...data2.data];
        this.dialogVisible = true;
      } catch (error) {
        console.log(error);
      }
    },
    async PreviewFile(title) {
      /* 文件预览 */
      const { data } = await PreviewFile({
        Title: title
      });
      this.$nextTick(() => {
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = data;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
      });
    }
  }
};
</script>
<style lang="scss">
.selectProvision {
  .el-header,
  .el-main,
  .el-footer {
    margin: 0px;
    padding: 0px;
  }

  .el-header {
    height: 30px !important;
  }

  .el-main {
    .trExpand {
      width: 100%;

      tr {
        td {
          width: 10%;
          height: 50px !important;
          color: black;
        }
      }
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
