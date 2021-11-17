<template>
  <div class="Search">
    <div
      class="content"
      style="
         {
          height: calc(100vh - 30px);
        }
      "
    >
      <div class="content_left">
        <el-card shadow="never">
          <div slot="header">
            <el-alert
              title="部门列表"
              type="info"
              show-icon
              :closable="false"
            />
          </div>
          <div
            class="Tree"
            style="
               {
                height: calc(100vh - 50px);
              }
            "
          >
            <el-tree
              :props="defaultProps"
              :load="loadNode"
              lazy
              node-key="DeptID"
              @node-click="handleNodeClick"
            >
              <span
                slot-scope="{ node, data }"
                class="custom-tree-node"
              >
                <span>
                  <i
                    v-if="data.Count > 0"
                    class="el-icon-folder-opened"
                  />
                  <i
                    v-else
                    class="iconfont al-icon-bumen5"
                  />
                  {{ node.label }}
                </span>
              </span>
            </el-tree>
          </div>
        </el-card>
      </div>
      <div class="content_right">
        <el-card
          shadow="never"
          style="
             {
              height: calc(100vh - 240px);
            }
          "
        >
          <div
            slot="header"
            class="search"
          >
            <el-form
              :inline="true"
              :model="categoryData"
              size="mini"
            >
              <el-form-item>
                <el-cascader
                  placeholder="评审条款（精确查询）"
                  :options="MyCatalogTreeData"
                  filterable
                  :props="{
                    checkStrictly: true,
                    label: 'CatalogCode',
                    value: 'CatalogID',
                    children: 'Children',
                  }"
                  clearable
                  @change="changeCatalogID"
                />
              </el-form-item>
              <el-form-item>
                <el-cascader
                  :props="articleProps"
                  :options="articleOptions"
                  style="width: 180px"
                  placeholder="资料类别"
                  :show-all-levels="false"
                  clearable
                  @change="changeGroupID"
                />
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model="categoryData.Title"
                  placeholder="标题"
                  style="width: 180px"
                  clearable
                />
              </el-form-item>
              <el-form-item>
                <el-select
                  v-model="categoryData.AuditStatus"
                  style="width: 180px"
                  clearable
                  placeholder="材料审核状态"
                >
                  <el-option
                    v-for="item in resStatus"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-select
                  v-model="categoryData.CheckStatus"
                  style="width: 180px"
                  clearable
                  placeholder="条款审核状态"
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
                  v-model="categoryData.LastRank"
                  style="width: 180px"
                  clearable
                  placeholder="自评结果"
                >
                  <el-option
                    v-for="item in selfsData"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model="categoryData.CatalogGroupName"
                  placeholder="请输入组别名称"
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  type="info"
                  icon="el-icon-search"
                  size="mini"
                  :loading="listLoading"
                  @click="clickSelectCategory"
                >搜索
                </el-button>
              </el-form-item>
            </el-form>
          </div>
          <div
            class="table"
            style="
               {
                height: calc(100vh - 222px);
              }
            "
          >
            <el-table
              v-loading="listLoading"
              height="calc(100vh - 230px)"
              :data="tableData"
              style="width: 100%"
              border
              size="mini"
              stripe
            >
              <el-table-column
                type="index"
                label="序号"
                width="60"
                align="center"
              />
              <el-table-column
                prop="title"
                label="标题"
                min-width="180"
                align="center"
              >
                <template slot-scope="{ row }">
                <el-link
              type="primary"
                  @click="see(row)"
                >{{row.title}}
                </el-link>
              </template>

              </el-table-column>


              <el-table-column
                prop="catalogCode"
                label="条款"
                align="center"
              />
              <el-table-column
                prop="CatalogGroupName"
                label="组别"
                align="center"
              />
              <el-table-column
                prop="groupName"
                label="资料类别"
                align="center"
              />
              <el-table-column
                prop="authorName"
                label="录入用户"
                align="center"
              />
              <el-table-column
                prop="creationDate"
                label="录入时间"
                align="center"
              >
                <template slot-scope="{ row }">
                  {{ row.creationDate.replace('T', ' ') }}
                </template>
              </el-table-column>
              <el-table-column
                label="材料审核状态"
                prop="STATUS"
                align="center"
              >
                <template slot-scope="{ row }">
                  {{
                    row.STATUS == 1
                      ? '通过'
                      : row.STATUS == 2
                        ? '退回'
                        : '未审核'
                  }}
                </template>
              </el-table-column>
              <el-table-column
                prop="checkStatus"
                label="条款审核状态"
                align="center"
              />
              <el-table-column
                prop="deptName"
                label="评审部门"
                align="center"
              />
              <el-table-column
                prop="lastRank"
                label="评审结果"
                align="center"
              />
            </el-table>
          </div>
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
        </el-card>
      </div>
    </div>
    <el-dialog
      :title="'标题：' + Title"
      width="500px"
      :close-on-click-modal="false"
      :visible.sync="dialogFormVisible"
    >
      <filePreview :preview-data="previewData"/>
      <el-card>
        <div v-html="content"/>
      </el-card>
    </el-dialog>
  </div>
</template>
<script>
import { SelectDept } from '@/api/user';
import { SelectMyCatalogTree } from '@/api/catalog';
import { PreviewFile, SelectAllArticleGroup, SelectArticleDetail } from '@/api/Article';
import { SelectCategory } from '@/api/category';
import filePreview from '@/views/components/file/filePreview';
import { Preview } from '@/views/mixin/relace';

export default {
  name: 'Search',
  components: {
    filePreview
  },
  data() {
    return {
      listLoading: true,
      dialogFormVisible: false,
      content: '',
      Title: '',
      tableData: [],
      catalogData: [],
      articleOptions: [],
      previewData: [],

      selfsData: [
        {
          label: 'A',
          value: 'A'
        },
        {
          label: 'B',
          value: 'B'
        },
        {
          label: 'C',
          value: 'C'
        },
        {
          label: 'D',
          value: 'D'
        },
        {
          label: 'E',
          value: 'E'
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
          label: ''
        },
        {
          value: 3,
          label: ''
        },
        {
          value: 4,
          label: ''
        },
        {
          value: 5,
          label: ''
        },
        {
          value: 6,
          label: ''
        }
      ],
      resStatus: [
        {
          value: 0,
          label: '未审核'
        },
        {
          value: 1,
          label: '通过'
        },
        {
          value: 2,
          label: '退回'
        },
        {
          value: 3,
          label: '退回已修改'
        },
        {
          value: -1,
          label: '全部'
        }
      ], // 材料审核状态分类搜索框内容
      MyCatalogTreeData: [],
      defaultProps: {
        value: 'DeptID',
        label: 'DeptName',
        children: 'Children',
        isLeaf: function(data, node) {
          return data.Count === 0;
        }
      },
      articleProps: {
        value: 'GroupID',
        label: 'GroupName',
        children: 'Children',
        checkStrictly: true
      },
      formDept: {
        ParentID: 0,
        DeptCode: '',
        DeptName: '',
        DeptDescription: '',
        DeptParentName: ''
      },
      pagination: {
        pageIndex: 1,
        total: 0,
        pageSize: 15,
        pageSizes: [15, 20, 50, 100, 150, 200]
      },
      categoryData: {
        pageSize: 15,
        pageIndex: 1,
        CatalogID: '',
        GroupID: 0,
        DeptID: 0,
        Title: '',
        CheckStatus: '',
        LastRank: '',
        CatalogCode: '',
        AuditStatus: -1, // 资料审核状态-1为全部
        UserID: window.userInfo[0].UserID
      }
    };
  },
  created() {
    this.getIni();
    this.loadNode();
    this.SelectAllArticleGroup();
    this.SelectCategory();

  },

  methods: {
    async getIni() {
      const para = this.$store.getters.iniPara;
      this.ReviewStatus[2].label = para.menu_one + '通过';
      this.ReviewStatus[3].label = para.menu_two + '通过';
      this.ReviewStatus[4].label = para.menu_two + '退回';
      this.ReviewStatus[5].label = para.menu_three + '通过';
      this.ReviewStatus[6].label = para.menu_three + '退回';
    },
    async see(row) {
      this.previewData = [];
      const { data } = await SelectArticleDetail({
        ArticleID: row.id
      });
      this.previewData = [...Preview(row.content), ...data];
      this.dialogFormVisible = true;
      this.content = row.content;
      this.Title = row.title;
    },
    async PreviewFile(url) {
      /* 文件预览 */
      const { data } = await PreviewFile({
        Title: url.replace(/Annex\/file\/|\//g, '')
      });
      this.$nextTick(() => {
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = data;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
      });
    },
    changeGroupID(value) {
      this.categoryData.GroupID = value[value.length - 1];
    },
    changeCatalogID(value) {
      this.categoryData.CatalogID = value[value.length - 1];
    },
    handleNodeClick({ DeptID }) {
      this.categoryData.DeptID = DeptID;
      this.listLoading = true;
      this.SelectCategory();
    },
    async loadNode(node, resolve) {
      if (node && node.level === 0) {
        try {
          const { data } = await SelectDept(this.formDept);
          resolve && resolve(data);
        } catch {
        }
      } else {
        try {
          const { data } = await SelectDept({
            DeptID: node && node.data.DeptID
          });
          resolve && resolve(data);
        } catch {
        }
      }
    },
    async SelectAllArticleGroup() {
      try {
        const { data } = await SelectAllArticleGroup();
        this.articleOptions = data;
        this.$nextTick(() => {
          this.SelectMyCatalogTree();
        });
      } catch (e) {
        console.log(e);
      }
    },
    async SelectCategory() {
      try {
        const { data } = await SelectCategory(this.categoryData);
        this.tableData = data.DataList;
        this.pagination.total = data.Total;
      } catch {
      }
      this.listLoading = false;
    },
    async clickSelectCategory() {
      if (this.categoryData.AuditStatus===''){
        this.categoryData.AuditStatus = -1;
      }
      this.categoryData.CatalogCode = this.categoryData.CatalogCode.replace(
        /\./g,
        '.0'
      );
      this.listLoading = true;
      this.categoryData.pageIndex = 1;
      this.pagination.pageIndex = 1;
      this.SelectCategory();
    },
    handleCurrentChange(index) {
      this.listLoading = true;
      this.categoryData.pageIndex = index;
      this.SelectCategory();
    },
    handleSizeChange(page) {
      this.listLoading = true;
      this.categoryData.pageSize = page;
      this.clickSelectCategory();
    },
    async SelectMyCatalogTree() {
      try {
        const { data } = await SelectMyCatalogTree({
          UserID: window.userInfo[0].UserID
        });
        this.MyCatalogTreeData = data;
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>
<style scoped>
/* .Search >>> .el-card__body {
  padding: 6px;
}
.Search >>> .el-card__header {
  padding: 4px;
} */
</style>

<style lang="scss">
.Search {
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

  margin: 4px;
  // overflow-y: auto;
  .el-card__header {
    padding: 4px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;

    .el-form-item {
      margin: 3px 0;
      margin-left: 10px;
    }
  }

  .content {
    height: 840px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .content_left {
      width: 16%;
      min-width: 170px;
      height: 100%;
      // border: 1px solid whitesmoke;

      .Tree {
        height: 780px;
        overflow-y: auto;
      }
    }

    .content_right {
      width: 84%;
      height: 100%;
      // border: 1px solid whitesmoke;
    }
  }

  .el-card__body {
    padding: 6px;
  }
}
</style>
