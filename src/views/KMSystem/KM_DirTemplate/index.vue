<template>
  <div>
    <input
      id="upload"
      ref="upload"
      type="file"
      accept="image/*"
      hidden
      @change="uploadChange"
    >
    <div
      v-if="device === 'mobile'"
      class="box-card-view"
    >
      <div style="height: 100%; overflow-y: auto">
        <div style="display: flex; justify-content: space-between">
          <el-link
            icon="el-icon-plus"
            @click="openDialog('添加')"
          >添加
          </el-link>
          <el-link
            icon="el-icon-back"
            @click="clearNodeSelected()"
          >返回根目录
          </el-link>
          <span>{{ dirTitleSpan || '根目录' }}</span>
        </div>
        <el-tree
          ref="dirTree"
          class="lineTree"
          :data="treeData"
          :props="defaultProps"
          node-key="DirectoryID"
          highlight-current
          default-expand-all
          @node-click="handleNodeClick"
        >
          <span
            slot-scope="{ node, data }"
            class="custom-tree-node"
          >
            <span>{{ node.label }}</span>
            <span class="border-left">
              <el-link
                class="custom-tree-node-link"
                icon="el-icon-plus"
                @click="
                  openDialog(
                    '添加',
                    data.DirectoryID,
                    data.ParentID,
                    data.DirectoryName
                  )
                "
              />
              <el-link
                icon="el-icon-edit"
                class="custom-tree-node-link"
                @click="
                  openDialog(
                    '编辑',
                    data.DirectoryID,
                    data.ParentID,
                    data.DirectoryName
                  )
                "
              />
              <el-popconfirm
                class="custom-tree-node-link"
                :title="'确定删除：' + data.DirectoryName"
                @onConfirm="DeleteDirectory(data.DirectoryID)"
              >
                <el-link
                  slot="reference"
                  icon="el-icon-delete"
                />
              </el-popconfirm>
            </span>
          </span>
        </el-tree>
        <el-card
          shadow="never"
          class="right-box-card"
        >
          <div
            slot="header"
            class="text flex"
          >
            <div class="search-view">
              <el-input
                v-model="listQuery.CheckListName"
                placeholder="查检单名称"
                size="mini"
              >
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="clickSelectCheckList"
                />
              </el-input>
            </div>
            <div class="action-view">
              <el-link
                icon="el-icon-plus"
                class="item"
                @click="addTemplate"
              >添加查检单
              </el-link>
            </div>
          </div>
          <el-table
            v-loading="listLoading"
            :data="tableData"
            height="calc(100vh - 216px)"
            border
            size="mini"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              fixed="left"
              width="55"
              align="center"
            />
            <el-table-column
              type="index"
              width="50"
              label="序号"
              align="center"
            />
            <el-table-column
              prop="CheckListName"
              label="查检单名称"
              width="220"
            />
            <el-table-column
              prop="CreateDate"
              align="center"
              label="创建时间"
              width="180"
            >
              <template slot-scope="{ row }">
                {{ row.CreateDate.replace('T', ' ') }}
              </template>
            </el-table-column>
            <el-table-column
              prop="DirectoryName"
              label="所属目录"
            />
            <el-table-column
              fixed="right"
              label="操作"
              width="100"
              align="center"
            >
              <template slot-scope="{ row }">
                <el-button
                  size="mini"
                  circle
                  type="primary"
                  icon="el-icon-edit"
                  @click="editTemplate(row)"
                />
                <el-button
                  size="mini"
                  circle
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeTemplate(row)"
                />
              </template>
            </el-table-column>
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
        </el-card>
      </div>

      <el-dialog
        :title="templateDialogTitle"
        :close-on-click-modal="false"
        :visible.sync="templateDialog"
        width="100%"
      >
        <el-form
          ref="checkListForm"
          :rules="rules"
          size="mini"
          :model="checkListForm"
        >
          <el-form-item
            prop="CheckListName"
            label="查检单名称"
          >
            <el-input
              v-model="checkListForm.CheckListName"
              placeholder="查检单名称"
            />
          </el-form-item>

          <el-tag
            :hit="tagPane"
            @click="tagPane = true"
          >基本内容
          </el-tag>
          <el-tag
            :hit="!tagPane"
            @click="tagPane = false"
          >目录分配
          </el-tag>
          <div v-show="tagPane">
            <textarea id="word" />
          </div>
          <div v-show="!tagPane">
            <el-tree
              ref="dirTree"
              class="lineTree"
              :data="treeData"
              :props="defaultProps"
              node-key="DirectoryID"
              highlight-current
              show-checkbox
              check-strictly
              default-expand-all
            />
          </div>
        </el-form>

        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            size="mini"
            @click="CheckListCancel"
          >取 消</el-button>
          <el-button
            type="primary"
            size="mini"
            @click="InsertCheckList"
          >确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
        :title="dirTitle"
        :close-on-click-modal="false"
        :visible.sync="dirVisible"
        width="90%"
        @close="dirCancel"
      >
        <el-form
          ref="dirForm"
          :rules="rules"
          size="mini"
          :model="dirForm"
        >
          <el-form-item prop="DirectoryName">
            <el-input
              v-model="dirForm.DirectoryName"
              placeholder="目录名称"
            />
          </el-form-item>
        </el-form>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            size="mini"
            @click="dirCancel"
          >取 消</el-button>
          <el-button
            type="primary"
            size="mini"
            @click="InsertDirectory"
          >确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <div
      v-if="device === 'desktop'"
      class="box-card-view"
    >
      <split-pane
        :min-percent="20"
        :default-percent="20"
        split="vertical"
      >
        <template slot="paneL">
          <div class="letf-box-card">
            <div style="display: flex; justify-content: space-between">
              <el-link
                icon="el-icon-plus"
                @click="openDialog('添加')"
              >添加
              </el-link>
              <el-link
                icon="el-icon-back"
                @click="clearNodeSelected()"
              >返回根目录
              </el-link>
              <span>{{ dirTitleSpan || '根目录' }}</span>
            </div>
            <el-tree
              ref="dirTree"
              class="lineTree"
              :data="treeData"
              :props="defaultProps"
              node-key="DirectoryID"
              highlight-current
              default-expand-all
              @node-click="handleNodeClick"
            >
              <span
                slot-scope="{ node, data }"
                class="custom-tree-node"
              >
                <span>{{ node.label }}</span>
                <span class="border-left">
                  <el-link
                    class="custom-tree-node-link"
                    icon="el-icon-plus"
                    @click="
                      openDialog(
                        '添加',
                        data.DirectoryID,
                        data.ParentID,
                        data.DirectoryName
                      )
                    "
                  />
                  <el-link
                    icon="el-icon-edit"
                    class="custom-tree-node-link"
                    @click="
                      openDialog(
                        '编辑',
                        data.DirectoryID,
                        data.ParentID,
                        data.DirectoryName
                      )
                    "
                  />
                  <el-popconfirm
                    class="custom-tree-node-link"
                    :title="'确定删除：' + data.DirectoryName"
                    @onConfirm="DeleteDirectory(data.DirectoryID)"
                  >
                    <el-link
                      slot="reference"
                      icon="el-icon-delete"
                    />
                  </el-popconfirm>
                </span>
              </span>
            </el-tree>
          </div>
        </template>
        <template slot="paneR">
          <el-card
            shadow="never"
            class="right-box-card"
          >
            <div
              slot="header"
              class="text flex"
            >
              <div class="search-view">
                <el-input
                  v-model="listQuery.CheckListName"
                  placeholder="查检单名称"
                  size="mini"
                >
                  <el-button
                    slot="append"
                    icon="el-icon-search"
                    @click="clickSelectCheckList"
                  />
                </el-input>
              </div>
              <div class="action-view">
                <el-link
                  icon="el-icon-plus"
                  class="item"
                  @click="addTemplate"
                >添加查检单
                </el-link>
              </div>
            </div>
            <el-table
              v-loading="listLoading"
              :data="tableData"
              height="calc(100vh - 216px)"
              border
              size="mini"
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                type="selection"
                fixed="left"
                width="55"
                align="center"
              />
              <el-table-column
                type="index"
                width="50"
                label="序号"
                align="center"
              />
              <el-table-column
                prop="CheckListName"
                label="查检单名称"
                width="220"
              />
              <el-table-column
                prop="CreateDate"
                align="center"
                label="创建时间"
                width="180"
              >
                <template slot-scope="{ row }">
                  {{ row.CreateDate.replace('T', ' ') }}
                </template>
              </el-table-column>
              <el-table-column
                prop="DirectoryName"
                label="所属目录"
              />
              <el-table-column
                fixed="right"
                label="操作"
                width="130"
                align="center"
              >
                <template slot-scope="{ row }">
                  <el-button
                    size="mini"
                    circle
                    type="primary"
                    icon="el-icon-edit"
                    @click="editTemplate(row)"
                  />
                  <el-button
                    size="mini"
                    circle
                    type="danger"
                    icon="el-icon-delete"
                    @click="removeTemplate(row)"
                  />
                </template>
              </el-table-column>
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
          </el-card>
        </template>
      </split-pane>

      <el-dialog
        :title="templateDialogTitle"
        :close-on-click-modal="false"
        :visible.sync="templateDialog"
        width="50%"
        @close="templateDialogClose"
      >
        <el-form
          ref="checkListForm"
          :rules="rules"
          size="mini"
          :model="checkListForm"
        >
          <el-form-item
            prop="CheckListName"
            label="查检单名称"
          >
            <el-input
              v-model="checkListForm.CheckListName"
              placeholder="查检单名称"
            />
          </el-form-item>

          <el-tag
            :hit="tagPane"
            @click="tagPane = true"
          >基本内容
          </el-tag>
          <el-tag
            :hit="!tagPane"
            @click="tagPane = false"
          >目录分配
          </el-tag>
          <div v-show="tagPane">
            <!--  <Editor ref="Editor" /> -->
            <textarea id="word" />
          </div>
          <div v-show="!tagPane">
            <el-tree
              ref="dirTree"
              class="lineTree"
              :data="treeData"
              :props="defaultProps"
              node-key="DirectoryID"
              highlight-current
              show-checkbox
              check-strictly
              default-expand-all
            />
          </div>
        </el-form>

        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            size="mini"
            @click="CheckListCancel"
          >取 消</el-button>
          <el-button
            type="primary"
            size="mini"
            @click="InsertCheckList"
          >确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
        :title="dirTitle"
        :close-on-click-modal="false"
        :visible.sync="dirVisible"
        width="300px"
        @close="dirCancel"
      >
        <el-form
          ref="dirForm"
          :rules="rules"
          size="mini"
          :model="dirForm"
        >
          <el-form-item prop="DirectoryName">
            <el-input
              v-model="dirForm.DirectoryName"
              placeholder="目录名称"
            />
          </el-form-item>
        </el-form>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            size="mini"
            @click="dirCancel"
          >取 消</el-button>
          <el-button
            type="primary"
            size="mini"
            @click="InsertDirectory"
          >确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import splitPane from 'vue-splitpane';
import {
  DeleteCheckList,
  DeleteDirectory,
  insertCheckList,
  InsertDirectory,
  SelectCheckList,
  SelectDirectorys,
  UpdateCheckList,
  UpdateDirectory
} from '@/api/KmApi';
import { mapGetters } from 'vuex';
import { uploadFile } from '@/api/upload';
import Editor from '@/components/Editor';

let uploadCallback = null;

export default {
  name: 'KMDirTemplate',
  components: { splitPane, Editor },
  data() {
    return {
      tagPane: true,
      listLoading: false,
      templateDialog: false,
      dirVisible: false,
      dirTitle: '',
      templateDialogTitle: '',
      dirTitleSpan: null,
      listQuery: {
        CheckListID: 0,
        CheckListName: '',
        CreateUserID: window.userInfo[0].UserID,
        DirectoryID: 0,
        pageIndex: 1,
        pageSize: 15
      },
      treeData: [],
      defaultProps: {
        children: 'Children',
        label: 'DirectoryName'
      },
      dirForm: {
        DirectoryID: 0,
        DirectoryName: '',
        ParentID: 0,
        CreateUserID: window.userInfo[0].UserID
      },
      checkListForm: {
        CheckListID: 0,
        CheckListName: '',
        CheckListContent: '',
        DirectoryIDs: '',
        CreateUserID: window.userInfo[0].UserID
      },
      rules: {
        DirectoryName: [
          { required: true, message: '请输入目录名', trigger: 'blur' }
        ],
        CheckListName: [
          { required: true, message: '请输入查检单名称', trigger: 'blur' }
        ]
      },
      tableData: [],
      assignCheckLis: null,
      pagination: {
        pageIndex: 1,
        total: 0,
        pageSize: 15,
        pageSizes: [15, 20, 50, 100, 150, 200]
      }
    };
  },
  computed: {
    ...mapGetters(['device'])
  },
  created() {
    this.SelectDirectorys();
    this.SelectCheckList();
  },
  deactivated() {
    tinymce.get('word').destroy();
  },
  methods: {
    handleSelectionChange(selection) {
      this.assignCheckLis = selection;
    },
    removeTemplate(row) {
      this.$confirm(
        `此操作将永久删除 ${row.CheckListName} , 是否继续?`,
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(async() => {
          try {
            const { msg } = await DeleteCheckList({
              CheckListID: row.CheckListID
            });
            this.$message({
              type: 'success',
              message: msg
            });
          } catch {
          } finally {
            this.listLoading = true;
            this.SelectCheckList();
          }
        })
        .catch(e => e);
    },
    addTemplate() {
      this.tagPane = true;
      this.templateDialogTitle = '添加查检单';
      this.checkListForm = {
        CheckListID: 0,
        CheckListName: '',
        CheckListContent: '',
        DirectoryIDs: '',
        CreateUserID: window.userInfo[0].UserID
      };
      this.templateDialog = true;
      this.$nextTick(() => {
        tinymce.init({
          selector: 'textarea#word',
          height: '50vh',
          menubar: false,
          language: 'zh_CN',
          extended_valid_elements:
            'input[name|type|value|size|style],textarea[name|rows|cols|style]',
          contextmenu: 'image imagetools select input textarea link table',
          plugins: [
            'advlist lists autolink link image imagetools pagebreak charmap emoticons print \
searchreplace visualblocks fullscreen \
media table paste code wordcount control'
          ],
          toolbar:
            'post cancel | undo redo | table control image link insertfile | fontselect fontsizeselect formatselect | bold italic forecolor backcolor | \
alignleft aligncenter alignright alignjustify | \
removeformat | pagebreak charmap emoticons | print | fullscreen code',
          automatic_uploads: true,
          file_picker_types: 'image file',
          file_picker_callback: function(cb, value, meta) {
            if (meta.filetype == 'file') {
              uploadCallback = cb;
              document.getElementById('upload').accept = '*';
              document.getElementById('upload').click();
            } else if (meta.filetype == 'image') {
              uploadCallback = cb;
              document.getElementById('upload').accept = 'image/*';
              document.getElementById('upload').click();
            }
          },

          imagetools_toolbar:
            'rotateleft rotateright | flipv fliph | editimage imageoptions',

          setup: function(editor) {
            editor.on('init', e => {
              editor.setContent('');
            });
          },

          content_style:
            'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        });
      });
    },
    editTemplate({
      CheckListID,
      CheckListName,
      CheckListContent,
      DirectoryID
    }) {
      this.checkListForm = {
        CheckListID,
        CheckListName,
        CheckListContent,
        DirectoryIDs: DirectoryID,
        CreateUserID: window.userInfo[0].UserID
      };
      this.templateDialogTitle = '编辑查检单：' + CheckListName;
      if (DirectoryID != null) {
        this.$refs.dirTree.setCheckedKeys(DirectoryID.split(','));
      }
      this.templateDialog = true;
      this.$nextTick(() => {
        this.$refs.Editor.setContent(this.checkListForm.CheckListContent);
      });
      this.$nextTick(() => {
        const content = this.checkListForm.CheckListContent;
        tinymce.init({
          selector: 'textarea#word',
          height: '50vh',
          menubar: false,
          language: 'zh_CN',
          extended_valid_elements:
            'input[name|type|value|size|style],textarea[name|rows|cols|style]',
          contextmenu: 'image imagetools select input textarea link table',
          plugins: [
            'advlist lists autolink link image imagetools pagebreak charmap emoticons print \
searchreplace visualblocks fullscreen \
media table paste code wordcount control'
          ],
          toolbar:
            'post cancel | undo redo | table control image link insertfile | fontselect fontsizeselect formatselect | bold italic forecolor backcolor | \
alignleft aligncenter alignright alignjustify | \
removeformat | pagebreak charmap emoticons | print | fullscreen code',
          automatic_uploads: true,
          file_picker_types: 'image file',
          file_picker_callback: function(cb, value, meta) {
            if (meta.filetype == 'file') {
              uploadCallback = cb;
              document.getElementById('upload').accept = '*';
              document.getElementById('upload').click();
            } else if (meta.filetype == 'image') {
              uploadCallback = cb;
              document.getElementById('upload').accept = 'image/*';
              document.getElementById('upload').click();
            }
          },

          imagetools_toolbar:
            'rotateleft rotateright | flipv fliph | editimage imageoptions',

          setup: function(editor) {
            editor.on('init', e => {
              editor.setContent(content);
            });
          },

          content_style:
            'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        });
      });
    },
    uploadChange() {
      var file = this.$refs.upload.files[0];
      if (file === undefined) return;
      var reader = new FileReader();
      if (this.$refs.upload.accept === 'image/*') {
        reader.onload = function() {
          var id = 'blobid' + new Date().getTime();
          var blobCache = tinymce.activeEditor.editorUpload.blobCache;
          var base64 = reader.result.split(',')[1];
          var blobInfo = blobCache.create(id, file, base64);
          blobCache.add(blobInfo);

          uploadCallback(blobInfo.blobUri(), { title: file.name });
          document.getElementById('upload').value = '';
        };

        reader.readAsDataURL(file);
      } else {
        reader.onload = async function() {
          const attachment = new FormData();
          attachment.append('file', new File([this.result], file.name));

          const re = await uploadFile(attachment);
          if (re.code == 200) {
            uploadCallback(re.data[0].FileUrl, { text: file.name });
          } else {
            alert(re.msg);
          }

          document.getElementById('upload').value = '';
        };

        reader.readAsArrayBuffer(file);
      }
    },
    InsertCheckList() {
      this.$refs.checkListForm.validate(async v => {
        if (v) {
          this.checkListForm.DirectoryIDs = this.$refs.dirTree
            .getCheckedKeys()
            .join(',');
          this.checkListForm.CheckListContent = tinymce.activeEditor.getContent();
          const formData = this.checkListForm;
          try {
            const { msg, code } =
              this.templateDialogTitle === '添加查检单'
                ? await insertCheckList(formData)
                : await UpdateCheckList(formData);
            code === 200
              ? this.$message.success(msg)
              : this.$message.error(msg);
          } catch {
          } finally {
            this.templateDialog = false;
            this.SelectCheckList();
          }
        } else {
          return false;
        }
      });
    },
    CheckListCancel() {
      this.templateDialog = false;
    },
    templateDialogClose() {
      tinymce.get('word').destroy();
    },
    async DeleteDirectory(DirectoryID) {
      try {
        const { msg } = await DeleteDirectory({ DirectoryID });
        this.$message({
          type: 'info',
          message: msg
        });
      } catch {
      } finally {
        this.SelectDirectorys();
      }
    },
    openDialog(type, DirectoryID = 0, ParentID = 0, DirectoryName = '') {
      this.dirTitle = type;
      this.dirForm.ParentID = DirectoryID;
      this.dirForm.DirectoryID = DirectoryID;
      if (type === '编辑') {
        this.dirForm.DirectoryName = DirectoryName;
        this.dirTitle = '编辑目录:' + DirectoryName;
        this.dirForm.ParentID = ParentID;
      } else {
        this.dirForm.DirectoryName = '';
      }
      this.dirVisible = true;
    },
    dirCancel() {
      this.dirVisible = false;
    },
    async InsertDirectory() {
      this.$refs.dirForm.validate(async v => {
        if (v) {
          const dirForm = this.dirForm;
          try {
            const { msg } =
              this.dirTitle === '添加'
                ? await InsertDirectory(dirForm)
                : await UpdateDirectory(dirForm);
            this.$message({
              type: 'info',
              message: msg
            });
          } catch {
          } finally {
            this.dirVisible = false;
            this.SelectDirectorys();
          }
        } else {
          return false;
        }
      });
    },
    clearNodeSelected() {
      this.dirTitleSpan = null;
      this.dirForm.DirectoryID = 0;
      this.listQuery.DirectoryID = 0;
      this.SelectCheckList();
    },
    handleNodeClick(node) {
      this.dirTitleSpan = node.DirectoryName;
      this.dirForm.DirectoryID = node.DirectoryID;
      this.listQuery.DirectoryID = node.DirectoryID;
      this.SelectCheckList();
    },
    async SelectDirectorys() {
      try {
        const { data } = await SelectDirectorys();
        this.treeData = data;
      } catch {
      }
    },
    async SelectCheckList() {
      this.listLoading = true;
      let listQuery = {};
      if (this.dirForm.DirectoryID) {
        listQuery = { ...this.listQuery };
      } else {
        listQuery = {
          CheckListName: this.listQuery.CheckListName,
          pageIndex: this.listQuery.pageIndex,
          pageSize: this.listQuery.pageSize,
          CreateUserID: window.userInfo[0].UserID
        };
      }
      try {
        const { data } = await SelectCheckList(listQuery);
        this.tableData = data.DataList;
        this.pagination.total = data.Total;
      } catch {
      } finally {
        this.listLoading = false;
      }
    },
    async clickSelectCheckList() {
      this.pagination.pageIndex = 1;
      // this.dirForm.DirectoryID = 0
      // this.$refs.dirTree.setCheckedKeys([])
      this.SelectCheckList();
    },
    handleCurrentChange(index) {
      this.listQuery.pageIndex = index;
      this.SelectCheckList();
    },
    handleSizeChange(page) {
      this.listQuery.pageSize = page;
      this.clickSelectCheckList();
    }
  }
};
</script>
<style lang="scss">
@import '../KS_Styles/index.scss';

.lineTree {
  height: 50vh;
  overflow: auto;

  .el-tree-node__content {
    border-bottom: 1px solid rgb(235, 235, 235);
  }
}
</style>
