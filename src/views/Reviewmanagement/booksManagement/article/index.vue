<template>
  <div>
    <div class="pg">
      <el-form
        :inline="true"
        size="mini"
      >
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="addArtical()"
          >添加资料
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="UploadState"
            placeholder="资料上传状态"
            clearable
            @change="searchCatalog"
          >
            <el-option
              v-for="item in FileStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div
        v-if="device === 'mobile'"
        class="main"
      >
        <div style="height: 100%; overflow-y: auto">
          <div>
            <div>
              <el-alert
                title="评审标准目录"
                type="info"
                show-icon
                :closable="false"
              />
            </div>
            <standardCatalog
              ref="standardCatalog"
              :key="key"
              :uploadstate="UploadState"
              @nodeClickCatalog="nodeClickCatalog"
            />
          </div>
          <div>
            <div>
              <div>
                <el-alert
                  :title="'目录详细：' + (nodeValue.CatalogCode || 0)"
                  type="info"
                  show-icon
                  :closable="false"
                />
              </div>
              <div>{{ nodeValue.CatalogName }}</div>
            </div>
            <div>
              <div>
                <div>
                  <div class="middleHead">
                    <el-alert
                      title="考评办法"
                      type="info"
                      show-icon
                      :closable="false"
                    />
                  </div>
                  <div style="height: 100%">
                    <el-table
                      v-loading="midLoading"
                      :data="ResortName"
                      border
                      size="mini"
                      style="width: 100%"
                      highlight-current-row
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

                    </el-table>
                    <el-pagination
                      style="margin: 6px 0 0 0"
                      background
                      :current-page="midpagination.pageIndex"
                      :page-size="midpagination.pageSize"
                      :page-sizes="midpagination.pageSizes"
                      :total="midpagination.total"
                      layout="total, sizes, prev, pager, next, jumper"
                      @size-change="midPgSizeChange"
                      @current-change="midPgChange"
                    />
                  </div>
                </div>
              </div>
              <div>
                <div>
                  <div>
                    <div>
                      <el-form
                        :inline="true"
                        class="demo-form-inline"
                        size="mini"
                      >
                        <el-form-item> 资料列表</el-form-item>
                        <el-form-item>
                          <el-select
                            v-model="formCatalog.AuditStatus"
                            clearable
                            size="mini"
                            style="width: 140px"
                            placeholder="审核状态"
                            @keyup.enter.native="SelectArticle()"
                            @change="selectAuditStatus"
                          >
                            <el-option
                              label="全部"
                              value=""
                            />
                            <el-option
                              label="未审核"
                              value="0"
                            />
                            <el-option
                              label="通过"
                              value="1"
                            />
                            <el-option
                              label="退回"
                              value="2"
                            />
                            <el-option
                              label="退回已修改"
                              value="3"
                            />
                          </el-select>
                        </el-form-item>
                        <el-form-item>
                          <el-select
                            v-model="formCatalog.SortField"
                            clearable
                            size="mini"
                            style="width: 140px"
                            placeholder="按照字段排序"
                            @change="sortOrderField"
                          >
                            <el-option
                              v-for="(itemTH, indexTH) in materialDataTh"
                              :key="indexTH"
                              :label="itemTH.vcName"
                              :value="itemTH.vcItemID"
                            />
                          </el-select>
                        </el-form-item>
                        <el-form-item>
                          <el-tooltip
                            class="item"
                            effect="dark"
                            content="升序"
                            placement="top"
                          >
                            <el-button
                              icon="el-icon-arrow-up"
                              circle
                              @click="sortOrder('asc')"
                            />
                          </el-tooltip>
                          <el-tooltip
                            class="item"
                            effect="dark"
                            content="降序"
                            placement="bottom"
                          >
                            <el-button
                              icon="el-icon-arrow-down"
                              circle
                              @click="sortOrder('desc')"
                            />
                          </el-tooltip>
                        </el-form-item>
                      </el-form>
                    </div>
                  </div>
                  <div style="height: 100%">
                    <el-table
                      :data="tableData"
                      style="width: 100%"
                      border
                      size="mini"
                      highlight-current-row
                    >
                      <el-table-column
                        type="index"
                        label="序号"
                        width="50"
                        align="center"
                      />
                      <el-table-column
                        label="状态"
                        width="50"
                        align="center"
                      >
                        <template slot-scope="scope">
                          <el-button
                            circle
                            size="mini"
                            round
                            :type="
                              scope.row.AuditStatus === 0
                                ? 'info'
                                : scope.row.AuditStatus === 1
                                  ? 'success'
                                  : scope.row.AuditStatus === 2
                                    ? 'danger'
                                    : scope.row.AuditStatus ===4
                                      ?'primary':'warning'
                            "
                            @click="statusView(scope.row)"
                          />
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="Title"
                        label="标题"
                        show-overflow-tooltip
                      >
                        <template slot-scope="scope">
                          <div
                            style="cursor: pointer !important; color: #3e84e9"
                            @click="seeRow(scope.row)"
                          >
                            {{ scope.row.Title }}
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="CatalogCode"
                        label="条款"
                        width="120"
                        show-overflow-tooltip
                      />
                      <el-table-column
                        prop="VersionNumber"
                        label="版本号"
                        width="80"
                        show-overflow-tooltip
                      />
                      <el-table-column
                        prop="GroupName"
                        label="资料类别"
                        width="120"
                        align="center"
                        show-overflow-tooltip
                      />
                      <el-table-column
                        prop="AuthorName"
                        label="录入用户"
                        width="120"
                        align="center"
                        show-overflow-tooltip
                      />
                      <el-table-column
                        label="录入时间"
                        align="center"
                        width="140"
                        show-overflow-tooltip
                      >
                        <template slot-scope="scope">{{
                          scope.row.CreatDate.split('T').join(' ')
                        }}
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="操作"
                        fixed="right"
                        align="center"
                        width="200"
                      >
                        <template slot-scope="scope">
                          <el-tooltip
                            class="item"
                            effect="dark"
                            content="查看详情"
                            placement="top"
                          >
                            <el-button
                              size="mini"
                              circle
                              type="primary"
                              icon="el-icon-view"
                              @click="seeRow(scope.row)"
                            />
                          </el-tooltip>
                          <el-tooltip
                            class="item"
                            effect="dark"
                            content="修改"
                            placement="top"
                          >
                            <el-button
                              size="mini"
                              circle
                              type="info"
                              icon="el-icon-edit"
                              @click="editRow(scope.row)"
                            />
                          </el-tooltip>
                          <el-tooltip
                            class="item"
                            effect="dark"
                            content="删除"
                            placement="top"
                          >
                            <el-button
                              size="mini"
                              circle
                              type="danger"
                              icon="el-icon-delete"
                              @click="deleteRow(scope.row)"
                            />
                          </el-tooltip>
                          <el-tooltip
                            class="item"
                            effect="dark"
                            content="上移"
                            placement="top"
                          >
                            <el-button
                              size="mini"
                              circle
                              type="warning"
                              icon="el-icon-top"
                              @click="upRow(scope.row, '1')"
                            />
                          </el-tooltip>
                          <el-tooltip
                            class="item"
                            effect="dark"
                            content="下移"
                            placement="top"
                          >
                            <el-button
                              size="mini"
                              circle
                              type="warning"
                              icon="el-icon-bottom"
                              @click="downRow(scope.row, '2')"
                            />
                          </el-tooltip>
                        </template>
                      </el-table-column>
                    </el-table>
                    <el-pagination
                      style="margin: 6px 0 0 0"
                      :current-page.sync="pagination.pageIndex"
                      :page-size="pagination.pageSize"
                      :page-sizes="pagination.pageSizes"
                      :total="pagination.total"
                      layout="total, sizes, prev, pager, next, jumper"
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <el-dialog
          :title="dialogTitle + ' : ' + CatalogCode"
          :close-on-click-modal="false"
          :visible.sync="dialogFormVisible"
          width="100%"
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
                      ref="articlegroupRef"
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
                    :action="'/api/Article/UploadFile'"
                  >
                    <el-button
                      size="mini"
                      type="primary"
                      :disabled="uploadEnd"
                    >选择文件
                    </el-button>
                  </el-upload>
                </el-form-item>
              </el-form>
              <el-table
                :data="listQuery.File_list"
                border
                height="150px"
                size="mini"
                highlight-current-row
              >
                <el-table-column
                  prop="title"
                  label="资料标题"
                >
                  <template slot-scope="{ row }">
                    <span
                      style="cursor: pointer !important"
                      @click="PreviewFile(row.FileUrl)"
                    >{{ row.title || row.FileName }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  width="90px"
                  align="center"
                >
                  <template slot-scope="{ row }">
                    <el-link target="_blank" :href="'Annex/file/' + row.FileUrl.replace('%', '%25')">点击下载</el-link>
                  </template>
                </el-table-column>
                <el-table-column
                  width="90px"
                  align="center"
                >
                  <template slot-scope="{ row }">
                    <span
                      style="cursor: pointer !important; color: #3e84e9"
                      @click="PreviewFile(row.FileUrl)"
                    >点击预览</span>
                  </template>
                </el-table-column>
              </el-table>
              <tinymce ref="tinymceRef" />
            </el-tab-pane>
            <el-tab-pane
              label="指定可见人"
              name="second"
            >
              <h3 style="padding: 0px; margin: 0px; color: red">
                注意：不选则所有人可见。如有选择人员，则选择的人员可查看该资料。
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
              @click="cancel()"
            >关闭
            </el-button>
            <el-button
              type="primary"
              size="small"
              :loading="uploadEnd"
              @click="
                dialogTitle == '添加资料'
                  ? InsertArticle('listQuery')
                  : UpdateArticle('listQuery')
              "
            >提交
            </el-button>
          </div>
        </el-dialog>

        <el-dialog
          title="查看详情"
          :close-on-click-modal="false"
          :visible.sync="dialogFormVisibleView"
          width="100%"
        >
          <el-form
            ref="listQuery"
            :rules="rules"
            size="mini"
            :model="listQuery"
            label-width="80px"
          >
            <el-form-item label="资料标题">
              <el-input
                v-model="listQuery.Title"
                disabled
              />
            </el-form-item>
            <el-form-item label="版本号">
              <el-input
                v-model="listQuery.VersionNumber"
                disabled
              />
            </el-form-item>
          </el-form>
          <filePreview :preview-data="previewData" />
          <div
            class="htmlPane"
            v-html="listQuery.Content"
          />
          <div
            slot="footer"
            class="dialog-footer"
          >
            <el-button
              size="small"
              @click="dialogFormVisibleView = false"
            >知道了
            </el-button>
          </div>
        </el-dialog>

        <el-dialog
          :close-on-click-modal="false"
          title="查看审核"
          :visible.sync="dialogFormVisibleStatusView"
          width="100%"
        >
          <el-form
            size="mini"
            label-width="80px"
          >
            <el-form-item label="条款">
              <el-input
                v-model="nodeValue.CatalogName"
                placeholder="条款"
              >
                <template slot="prepend">{{ listQuery.CatalogID }}</template>
              </el-input>
            </el-form-item>
            <el-form-item label="资料标题">
              <el-input v-model="listQuery.Title" />
            </el-form-item>
            <div
              style="
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
              "
            >
              <el-form-item label="上传日期">
                <el-input v-model="seeStatusViewForm.AuditDate" />
              </el-form-item>
              <el-form-item label="上传人">
                <el-input v-model="seeStatusViewForm.AuditUserName" />
              </el-form-item>
              <el-form-item label="审核结果">
                <el-input v-model="AuditStatus" />
              </el-form-item>
            </div>
            <el-form-item label="意见">
              <el-input
                v-model="seeStatusViewForm.AuditContent"
                type="textarea"
              />
            </el-form-item>
          </el-form>
          <div
            slot="footer"
            class="dialog-footer"
          >
            <el-button
              size="mini"
              @click="dialogFormVisibleStatusView = false"
            >知道了
            </el-button>
          </div>
        </el-dialog>
      </div>
      <div
        v-if="device === 'desktop'"
        class="main"
      >
        <split-pane
          :min-percent="20"
          :default-percent="20"
          split="vertical"
        >
          <template slot="paneL">
            <div class="content_left">
              <div>
                <el-alert
                  title="评审标准目录"
                  type="info"
                  show-icon
                  :closable="false"
                />
              </div>
              <standardCatalog
                ref="standardCatalog"
                :key="key"
                :uploadstate="UploadState"
                @nodeClickCatalog="nodeClickCatalog"
              />
            </div>
          </template>
          <template slot="paneR">
            <div class="content_right">
              <split-pane
                :min-percent="5"
                :default-percent="10"
                split="horizontal"
              >
                <template slot="paneL">
                  <div>
                    <div>
                      <el-alert
                        :title="'目录详细：' + (nodeValue.CatalogCode || 0)"
                        type="info"
                        show-icon
                        :closable="false"
                      />
                    </div>
                    <div class="top">{{ nodeValue.CatalogName }}</div>
                  </div>
                </template>
                <template slot="paneR">
                  <split-pane
                    :min-percent="20"
                    :default-percent="40"
                    split="horizontal"
                  >
                    <!--                    :default-percent="middlePercent"-->
                    <template slot="paneL">
                      <div class="middle">
                        <div class="middleHead">
                          <el-alert
                            title="考评办法"
                            type="info"
                            show-icon
                            :closable="false"
                          />
                        </div>
                        <div class="middleBody">
                          <el-table
                            v-loading="midLoading"
                            class="middleBodyTb"
                            :data="ResortName"
                            border
                            size="mini"
                            style="width: 100%"
                            height="100%"
                            highlight-current-row
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
                          <el-pagination
                            style="margin: 6px 0 0 0"
                            background
                            :current-page="midpagination.pageIndex"
                            :page-size="midpagination.pageSize"
                            :page-sizes="midpagination.pageSizes"
                            :total="midpagination.total"
                            layout="total, sizes, prev, pager, next, jumper"
                            @size-change="midPgSizeChange"
                            @current-change="midPgChange"
                          />
                        </div>
                      </div>
                    </template>
                    <template slot="paneR">
                      <div class="bottom">
                        <div>
                          <el-form
                            :inline="true"
                            class="demo-form-inline"
                            size="mini"
                          >
                            <el-form-item> 资料列表</el-form-item>
                            <el-form-item>
                              <el-select
                                v-model="formCatalog.AuditStatus"
                                clearable
                                size="mini"
                                style="width: 140px"
                                placeholder="审核状态"
                                @keyup.enter.native="SelectArticle()"
                                @change="selectAuditStatus"
                              >
                                <el-option
                                  label="全部"
                                  value=""
                                />
                                <el-option
                                  label="未审核"
                                  value="0"
                                />
                                <el-option
                                  label="通过"
                                  value="1"
                                />
                                <el-option
                                  label="退回"
                                  value="2"
                                />
                                <el-option
                                  label="退回已修改"
                                  value="3"
                                />
                              </el-select>
                            </el-form-item>
                            <el-form-item>
                              <el-select
                                v-model="formCatalog.SortField"
                                clearable
                                size="mini"
                                style="width: 140px"
                                placeholder="按照字段排序"
                                @change="sortOrderField"
                              >
                                <el-option
                                  v-for="(itemTH, indexTH) in materialDataTh"
                                  :key="indexTH"
                                  :label="itemTH.vcName"
                                  :value="itemTH.vcItemID"
                                />
                              </el-select>
                            </el-form-item>
                            <el-form-item>
                              <el-tooltip
                                class="item"
                                effect="dark"
                                content="升序"
                                placement="top"
                              >
                                <el-button
                                  icon="el-icon-arrow-up"
                                  circle
                                  @click="sortOrder('asc')"
                                />
                              </el-tooltip>
                              <el-tooltip
                                class="item"
                                effect="dark"
                                content="降序"
                                placement="bottom"
                              >
                                <el-button
                                  icon="el-icon-arrow-down"
                                  circle
                                  @click="sortOrder('desc')"
                                />
                              </el-tooltip>
                            </el-form-item>
                          </el-form>
                        </div>
                        <div class="bottomBody">
                          <el-table
                            class="bottomBodyTb"
                            :data="tableData"
                            style="width: 100%"
                            height="100%"
                            border
                            size="mini"
                            highlight-current-row
                            v-loading="listLoading"
                          >
                            <el-table-column
                              type="index"
                              label="序号"
                              width="50"
                              align="center"
                            />
                            <el-table-column
                              label="状态"
                              width="50"
                              align="center"
                            >
                              <template slot-scope="scope">
                                <el-button
                                  size="mini"
                                  circle
                                  :type="
                                    scope.row.AuditStatus === 0
                                      ? 'info'
                                      : scope.row.AuditStatus === 1
                                        ? 'success'
                                        : scope.row.AuditStatus === 2
                                          ? 'danger'
                                          : scope.row.AuditStatus ===4
                                            ?'primary':'warning'
                                  "
                                  @click="statusView(scope.row)"
                                />
                                <!-- 通过后修改‘primary’ -->
                              </template>
                            </el-table-column>
                            <el-table-column
                              prop="Title"
                              label="标题"
                              show-overflow-tooltip
                            >
                              <template slot-scope="scope">
                                <div
                                  style="
                                    cursor: pointer !important;
                                    color: #3e84e9;
                                  "
                                  @click="seeRow(scope.row)"
                                >
                                  {{ scope.row.Title }}
                                </div>
                              </template>
                            </el-table-column>
                            <el-table-column
                              prop="CatalogCode"
                              label="条款"
                              width="120"
                              show-overflow-tooltip
                            />
                            <el-table-column
                              prop="VersionNumber"
                              label="版本号"
                              width="80"
                              show-overflow-tooltip
                            />
                            <el-table-column
                              prop="GroupName"
                              label="资料类别"
                              width="120"
                              align="center"
                              show-overflow-tooltip
                            />
                            <el-table-column
                              prop="AuthorName"
                              label="录入用户"
                              width="120"
                              align="center"
                              show-overflow-tooltip
                            />
                            <el-table-column
                              label="录入时间"
                              align="center"
                              width="140"
                              show-overflow-tooltip
                            >
                              <template slot-scope="scope">{{
                                scope.row.CreatDate.split('T').join(' ')
                              }}
                              </template>
                            </el-table-column>
                            <el-table-column
                              label="操作"
                              fixed="right"
                              align="center"
                              width="200"
                            >
                              <template
                                slot-scope="scope"
                                class="handle"
                              >
                                <el-tooltip
                                  class="item"
                                  effect="dark"
                                  content="查看详情"
                                  placement="top"
                                >
                                  <el-button
                                    size="mini"
                                    circle
                                    type="primary"
                                    icon="el-icon-view"
                                    @click="seeRow(scope.row)"
                                  />
                                </el-tooltip>
                                <el-tooltip
                                  class="item"
                                  effect="dark"
                                  content="修改"
                                  placement="top"
                                >
                                  <el-button
                                    size="mini"
                                    circle
                                    type="info"
                                    icon="el-icon-edit"
                                    @click="editRow(scope.row)"
                                  />
                                </el-tooltip>
                                <el-tooltip
                                  class="item"
                                  effect="dark"
                                  content="删除"
                                  placement="top"
                                >
                                  <el-button
                                    size="mini"
                                    circle
                                    type="danger"
                                    icon="el-icon-delete"
                                    @click="deleteRow(scope.row)"
                                  />
                                </el-tooltip>
                                <el-tooltip
                                  class="item"
                                  effect="dark"
                                  content="上移"
                                  placement="top"
                                >
                                  <el-button
                                    size="mini"
                                    circle
                                    type="warning"
                                    icon="el-icon-top"
                                    @click="upRow(scope.row, '1')"
                                  />
                                </el-tooltip>
                                <el-tooltip
                                  class="item"
                                  effect="dark"
                                  content="下移"
                                  placement="top"
                                >
                                  <el-button
                                    size="mini"
                                    circle
                                    type="warning"
                                    icon="el-icon-bottom"
                                    @click="downRow(scope.row, '2')"
                                  />
                                </el-tooltip>
                              </template>
                            </el-table-column>
                          </el-table>
                          <el-pagination
                            style="margin: 6px 0 0 0"
                            :current-page.sync="pagination.pageIndex"
                            :page-size="pagination.pageSize"
                            :page-sizes="pagination.pageSizes"
                            :total="pagination.total"
                            layout="total, sizes, prev, pager, next, jumper"
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                          />
                        </div>
                      </div>
                    </template>
                  </split-pane>
                </template>
              </split-pane>
            </div>
          </template>
        </split-pane>
        <!--        考评办法附件查看框-->
        <el-dialog
          title="提示"
          :visible.sync="kaoPinBanFa"
          width="50%"
        >
          <file-preview3
            ref="filePreview3"
            :preview-data="fileList"
            :delete-show-file="true"
          />
          <span slot="footer" class="dialog-footer">
            <el-button @click="kaoPinBanFa = false">取 消</el-button>
            <el-button type="primary" @click="kaoPinBanFa = false">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog
          :title="dialogTitle + ' : ' + CatalogCode"
          :close-on-click-modal="false"
          :visible.sync="dialogFormVisible"
          :width="device === 'desktop' ? '40%' : '100%'"
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
                      ref="articlegroupRef"
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
                    :action="'/api/Article/UploadFile'"
                    :disabled="uploadEnd"
                  >
                    <el-button
                      size="mini"
                      type="primary"
                      :disabled="uploadEnd"
                    >选择文件
                    </el-button>
                  </el-upload>
                </el-form-item>
              </el-form>
              <el-table
                :data="listQuery.File_list"
                border
                height="150px"
                size="mini"
                highlight-current-row
              >
                <el-table-column
                  prop="title"
                  label="资料标题"
                >
                  <template slot-scope="{row, $index }">
                    <el-input
                      v-if="currentEdit === $index"
                      v-model="row.FileName"
                      size="mini"
                    />
                    <span
                      v-else
                      style="cursor: pointer !important"
                      @click="PreviewFile(row.FileUrl)"
                    >{{ row.title || row.FileName }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  width="90px"
                  align="center"
                >
                  <template slot-scope="{ row, $index }">
                    <el-button
                      v-if="currentEdit === $index"
                      type="text"
                      size="small"
                      @click="finishEditClick(row.FileID,row.FileName)"
                    >完成
                    </el-button>
                    <span
                      v-else
                      style="cursor: pointer !important; color: #3e84e9"
                      @click="EditClick($index)"
                    >修改</span>
                  </template>
                </el-table-column>
                <el-table-column
                  width="90px"
                  align="center"
                >
                  <template slot-scope="{ row }">
                    <el-link target="_blank" :href="'Annex/file/' + row.FileUrl.replace('%', '%25')">点击下载</el-link>
                  </template>
                </el-table-column>
                <el-table-column
                  width="90px"
                  align="center"
                >
                  <template slot-scope="{ row }">
                    <span
                      style="cursor: pointer !important; color: #3e84e9"
                      @click="PreviewFile(row.FileUrl)"
                    >点击预览</span>
                  </template>
                </el-table-column>
                <el-table-column
                  width="90px"
                  align="center"
                >
                  <template slot-scope="{ row }">
                    <span
                      style="cursor: pointer !important; color: #3e84e9"
                      @click="deleteFile(row)"
                    >删除</span>
                  </template>
                </el-table-column>
              </el-table>
              <tinymce ref="tinymceRef" />
            </el-tab-pane>
            <el-tab-pane
              label="指定可见人"
              name="second"
            >
              <h3 style="padding: 0px; margin: 0px; color: red">
                注意：不选则所有人可见。如有选择人员，则选择的人员可查看该资料。
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
              @click="cancel()"
            >关闭
            </el-button>
            <el-button
              type="primary"
              size="small"
              :loading="uploadEnd"
              @click="
                dialogTitle === '添加资料'
                  ? InsertArticle('listQuery')
                  : UpdateArticle('listQuery')
              "
            >提交
            </el-button>
          </div>
        </el-dialog>
        <el-dialog
          title="查看详情"
          :close-on-click-modal="false"
          :visible.sync="dialogFormVisibleView"
          :width="device === 'desktop' ? '60%' : '100%'"
          top="2vh"
        >
          <el-form
            ref="listQuery"
            :rules="rules"
            size="mini"
            :model="listQuery"
            label-width="80px"
          >
            <el-form-item label="资料标题">
              <el-input
                v-model="listQuery.Title"
                disabled
              />
            </el-form-item>
            <el-form-item label="版本号">
              <el-input
                v-model="listQuery.VersionNumber"
                disabled
              />
            </el-form-item>
          </el-form>
          <filePreview2 :preview-data="previewData" />
          <div
            class="htmlPane"
            v-html="listQuery.Content"
          />
          <div
            slot="footer"
            class="dialog-footer"
          >
            <el-button
              size="small"
              @click="dialogFormVisibleView = false"
            >知道了
            </el-button>
          </div>
        </el-dialog>

        <el-dialog
          :close-on-click-modal="false"
          title="查看审核"
          :visible.sync="dialogFormVisibleStatusView"
          width="50%"
        >
          <el-form
            size="mini"
            label-width="80px"
          >
            <el-form-item label="条款">
              <el-input
                v-model="nodeValue.CatalogName"
                placeholder="条款"
              >
                <template slot="prepend">{{ listQuery.CatalogID }}</template>
              </el-input>
            </el-form-item>
            <el-form-item label="资料标题">
              <el-input v-model="listQuery.Title" />
            </el-form-item>
            <div
              style="
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
              "
            >
              <el-form-item label="上传日期">
                <el-input v-model="seeStatusViewForm.AuditDate" />
              </el-form-item>
              <el-form-item label="上传人">
                <el-input v-model="seeStatusViewForm.AuditUserName" />
              </el-form-item>
              <el-form-item label="审核结果">
                <el-input v-model="AuditStatus" />
              </el-form-item>
            </div>
            <el-form-item label="意见">
              <el-input
                v-model="seeStatusViewForm.AuditContent"
                type="textarea"
              />
            </el-form-item>
          </el-form>
          <div
            slot="footer"
            class="dialog-footer"
          >
            <el-button
              size="mini"
              @click="dialogFormVisibleStatusView = false"
            >知道了
            </el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import splitPane from 'vue-splitpane';
import standardCatalog from '@/views/components/standardCatalog';
import articlegroup from './components/articlegroup';
import SelectDeptorUser from '@/views/components/SelectDeptorUser';
import filePreview from '@/views/components/file/filePreview'; // 导入有修改功能的附件列表组件
import filePreview2 from '@/views/components/file/filePreview2'; // 导入无修改功能的附件列表组件
import { SelectResort, SelectResortFile } from '@/api/Resort';
import {
  ArticleMove,
  DeleteArticle,
  InsertArticle,
  PreviewFile,
  SelectArticle,
  SelectArticleAudit,
  SelectArticleDetail,
  UpdateArticle
} from '@/api/Article';
import { Preview } from '@/views/mixin/relace';
import tinymce from '@/components/tinymce';

import { SelectPenaltiesByCatalogID } from '@/api/Penalties';
import { mapGetters } from 'vuex';
import filePreview3 from '@/views/components/file/filePreview3'; // 导入没有修改删除功能的附件列表组件
export default {
  name: 'Article',
  components: {
    splitPane,
    standardCatalog,
    articlegroup,
    SelectDeptorUser,
    tinymce,
    filePreview,
    filePreview2,
    filePreview3
  },
  data() {
    return {
      kaoPinBanFa: false, // 考评办法对话框默认关闭
      middlePercent: 20,
      nodeValue: {},
      dialogTitle: '',
      dialogFormVisible: false,
      CatalogCode: '',
      dialogFormVisibleView: false,
      dialogFormVisibleStatusView: false,
      isClear: false,
      ResortName: [],
      fileList: [],
      tableData: [],
      PenaltiesData: [],
      formCatalog: {
        CatalogID: 0,
        CatalogCode: '',
        CatalogName: '',
        Count: null,
        IsCriterion: 0,
        pageIndex: 1,
        pageSize: 50,
        UserID: window.userInfo[0].UserID,
        DeptID: '',
        UploadState: '0',
        AuditStatus:
          this.$route.params.Type || '' /* 获取首页跳过来的时的参数 */,
        SortField: '' // 如果要设置默认字段,加上id名就可以了 如CatalogCode
      },
      midLoading: false,
      midpagination: {
        pageIndex: 1,
        total: 0,
        pageSize: 50,
        pageSizes: [15, 20, 50, 100, 150, 200]
      },
      UploadState: this.$route.params.value || '',
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
      listLoading: false,
      pagination: {
        pageIndex: 1,
        total: 0,
        pageSize: 50,
        pageSizes: [15, 20, 50, 100, 150, 200]
      },
      listQuery: {
        Title: '',
        GroupID: 0,
        CatalogID: '',
        Content: '1',
        VersionNumber: '',
        AuthorID: window.userInfo[0].UserID,
        AllowUserID: [],
        File_list: []
      },
      previewData: [],
      seeStatusViewForm: {
        AuditID: 0,
        ArticleID: 0,
        AuditUserId: 0,
        AuditDate: '',
        AuditStatus: 0,
        AuditContent: '',
        AuditRemark: '',
        AuditMaterial: '',
        AuditCondition: 0,
        AuditUserName: ''
      },
      ArticleGroupValue: null,
      uploadEnd: false,
      key: 0,
      rules: {
        Title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        GroupID: [{ required: true, message: '请选择资料', trigger: 'blur' }]
      },
      activeName: 'first',
      materialDataTh: [],
      addPreviewData: [],
      currentEdit: -1 // 判断是否显示input框
    };
  },
  created() {
    let h = window.innerHeight;
    if (h < 750) h = 750;
    this.middlePercent = ((h - 629) / (h - 183)) * 100;
    this.SelectArticle();
  },
  computed: {
    ...mapGetters(['device']),
    AuditStatus: function() {
      return this.seeStatusViewForm.AuditStatus === 0
        ? '未审核'
        : this.seeStatusViewForm.AuditStatus === 1
          ? '通过' : this.seeStatusViewForm.AuditStatus === 4 ? '通过后修改'
            : '退回';
    }
  },
  methods: {
    // 查看考评办法附件
    async seeUpload(x) {
      this.kaoPinBanFa = true; // 打卡考评办法对话框
      const { data } = await SelectResortFile({
        ResortID: x.ResortID
      });
      console.log(x);
      this.fileList = data;
    },
    async searchCatalog(val) {
      const loading = this.$loading({
        lock: true,
        text: '拼了命查找中，请您稍等！',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.$nextTick(async() => {
        this.key += 1;
        this.nodeValue.CatalogCode = 0;
        this.nodeValue.CatalogName = '';
        this.tableData = [];
        this.PenaltiesData = [];
        this.ResortName = [];
        await this.$refs.standardCatalog.loadNode();
        loading.close();
      });
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
        this.$message.error(file.name + '   上传失败');
        this.uploadEnd = false;
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
    cancel() {
      this.fileList = [];
      this.$nextTick(() => {
        this.$refs.tinymceRef.deactivated(); /* 销毁编辑器 */
      });
      this.dialogFormVisible = false;
      this.currentEdit = false;// 将修改编辑框隐藏
    },
    async statusView(row) {
      row = JSON.parse(JSON.stringify(row));
      this.listQuery = row;
      try {
        const { data } = await SelectArticleAudit({ ArticleID: row.ArticleID });
        if (data.length === 0) {
          this.$message({
            type: 'error',
            message: '没有数据!'
          });
          return;
        }
        this.seeStatusViewForm = data[0];
      } catch (error) {
        this.dialogFormVisibleStatusView = true;
      }
    },
    async seeRow(row) {
      this.previewData = [];
      this.listQuery = row;
      const { data } = await SelectArticleDetail({
        ArticleID: row.ArticleID
      });
      this.previewData = [...Preview(row.Content), ...data];
      console.log('闲杂',this.previewData);
      this.dialogFormVisibleView = true;
    },
    async downRow(row, MoveType) {
      try {
        const { msg } = await ArticleMove({
          ArticleID: row.ArticleID,
          MoveType: MoveType,
          CatalogID: row.CatalogID,
          Ordinal: row.Ordinal,
          UserID: window.userInfo[0].UserID
        });
        this.$message.success(msg);
        this.tableData = [];
        this.SelectArticle();
      } catch (error) {
        console.log(error);
      }
    },
    async upRow(row, MoveType) {
      try {
        const { msg } = await ArticleMove({
          ArticleID: row.ArticleID,
          MoveType: MoveType,
          CatalogID: row.CatalogID,
          Ordinal: row.Ordinal,
          UserID: window.userInfo[0].UserID,
          SortField: this.formCatalog.SortField
        });
        this.$message.success(msg);
        this.tableData = [];
        this.SelectArticle();
      } catch (error) {
        console.log(error);
      }
    },
    deleteRow(row) {
      if (
        row.AuthorID !== window.userInfo[0].UserID &&
        window.userInfo[0].RoleCode !== 'R0001'
      ) {
        this.$message.warning('您没有权限删除修改权限');
        return;
      }
      if (row.AuditStatus === 1 && window.userInfo[0].RoleCode !== 'R0001') {
        this.$message.warning(
          '已通过,无法删除,如需删除请联系系统管理员！'
        );
        return;
      }
      this.$confirm(`此操作将永久删除 ${row.Title} , 是否继续?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          try {
            const { msg } = await DeleteArticle({
              ArticleID: row.ArticleID
            });
            this.$message.success(msg);

            this.tableData = [];
            this.SelectArticle();
          } catch (error) {
            console.log(error);
          }
        })
        .catch(e => e);
      this.dialogFormVisible = false;
    },
    async UpdateArticle(listQuery) {
      this.$refs[listQuery].validate(async v => {
        if (v) {
          if (this.listQuery.GroupID === 0) {
            this.$message.warning('请填写资料分类');
            return;
          }
          this.listQuery.Content = this.$refs.tinymceRef.Submit();

          try {
            this.uploadEnd = true;
            const { msg } = await UpdateArticle(this.listQuery);
            this.$message.success(msg);
          } catch (error) {
            console.log(error);
          } finally {
            this.SelectArticle();
            this.uploadEnd = false;
            this.dialogFormVisible = false;
          }
        }
      });
    },
    opened() {
      this.fileList = [];
    },
    async editRow(row) {
      if (
        row.AuthorID !== window.userInfo[0].UserID &&
        window.userInfo[0].RoleCode !== 'R0001'
      ) {
        this.$message.warning('您没有权限修改权限');
        return;
      }

      /*       if (row.AuditStatus === 1 && window.userInfo[0].RoleCode != 'R0001') {
        this.$message.warning('审核已通过，您没有权限修改哦！');
        return;
      } */
      this.fileList = [];
      row = JSON.parse(JSON.stringify(row));
      row.AllowUserID = row.AllowUserID ? row.AllowUserID.split(',') : [];
      const { data } = await SelectArticleDetail({
        ArticleID: row.ArticleID
      });
      this.listQuery = row;
      this.listQuery.File_list = data;
      this.CatalogCode = row.CatalogCode;
      this.dialogTitle = '修改资料';
      this.$nextTick(() => {
        this.$refs.tinymceRef.setContent(row.Content);
        this.$refs.userTree.setDeptorUser(row.AllowUserID);
        this.$refs.articlegroupRef.select(row.GroupID);
      });
      this.dialogFormVisible = true;
    },
    async InsertArticle(listQuery) {
      this.$refs[listQuery].validate(async v => {
        if (v) {
          if (this.listQuery.GroupID === 0) {
            this.$message.warning('请填写资料分类');
            return;
          }
          this.listQuery.CatalogID = this.nodeValue.CatalogID;
          this.listQuery.Content = this.$refs.tinymceRef.Submit();
          try {
            this.uploadEnd = true;
            const { msg } = await InsertArticle(this.listQuery);
            this.$message.success(msg);
          } catch (error) {
            console.log(error);
          } finally {
            this.SelectArticle();
            this.dialogFormVisible = false;
            this.uploadEnd = false;
          }
        }
      });
    },
    deleteFile(row) {
      this.listQuery.File_list.map((item, index) => {
        if (item.FileID === row.FileID) {
          this.listQuery.File_list.splice(index, 1);
        }
      });
    },
    addArtical() {
      /* 数据重置到初始状态 */
      /* Object.assign(this.$data.listQuery, this.$options.data().listQuery); */
      this.listQuery = {
        Title: '',
        GroupID: 0,
        CatalogID: '',
        Content: '1',
        VersionNumber: '',
        AuthorID: window.userInfo[0].UserID,
        AllowUserID: [],
        File_list: []
      };
      this.fileList = [];
      if (this.formCatalog.IsCriterion === 1 || this.formCatalog.Count === 0) {
        this.dialogTitle = '添加资料';
        this.$nextTick(() => {
          this.$refs.tinymceRef.setContent('');
          this.$refs.articlegroupRef.clear();
        });
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs.userTree.setDeptorUser([]);
        });
      } else {
        this.$notify({
          title: '警告',
          type: 'warning',
          message: '请选择 要点和评审标准 添加资料！'
        });
      }
    },
    getSelectAllArticleGroupValue(value) {
      this.listQuery.GroupID = value;
    },
    async SelectArticle() {
      // 以下两个分别是考评办法和资料列表的等待圈
      this.midLoading = true;
      this.listLoading = true;
      try {
        this.formCatalog.UploadState = this.UploadState || '0';
        const { data } = await SelectArticle(this.formCatalog);
        this.tableData = data.DataList;
        // this.formCatalog.Sort = 'asc';
        this.pagination.total = data.Total;
        this.materialDataTh = data.th;
        this.formCatalog.pageIndex = 1;
        this.listLoading = false;
        this.midLoading = false;
      } catch (error) {
        console.log(error);
        this.listLoading = false;
      }
    },
    sortOrder(value) {
      this.formCatalog.pageIndex = 1;
      this.formCatalog.Sort = value;
      this.SelectArticle();
    },
    sortOrderField() {
      this.formCatalog.pageIndex = 1;
      this.SelectArticle();
    },
    async selectAuditStatus(val) {
      this.SelectArticle();
    },
    midPgChange(index) {
      this.midLoading = true;
      this.midpagination.pageIndex = index;
      this.SelectResort(this.nodeValue.CatalogID);
    },
    midPgSizeChange(page) {
      this.midLoading = true;
      this.midpagination.pageSize = page;
      this.SelectResort(this.nodeValue.CatalogID);
    },
    // 上传文件名修改
    EditClick(index) {
      this.currentEdit = index;
      // alert(index);
    },
    async finishEditClick(FileID, FileName) {
      try {
        this.currentEdit = -1;
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
    },
    handleCurrentChange(index) {
      this.listLoading = true;
      this.formCatalog.pageIndex = index;
      this.SelectArticle();
    },
    handleSizeChange(page) {
      this.listLoading = true;
      this.formCatalog.pageSize = page;
      this.SelectArticle();
    },
    async SelectResort(CatalogID = 0) {
      const val = {
        CatalogID: CatalogID,
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
    async SelectPenaltiesByCatalogID(CatalogID = 0) {
      const val = {
        PenaltiesID: CatalogID
      };
      try {
        const { data } = await SelectPenaltiesByCatalogID(val);
        this.PenaltiesData = data.DataList;
      } catch (error) {
        console.log(error);
      }
    },
    nodeClickCatalog(value) {
      this.midLoading = true;
      this.tableData = [];
      this.formCatalog.CatalogID = value.CatalogID;
      this.formCatalog.IsCriterion = value.IsCriterion;
      this.CatalogCode = value.CatalogCode;
      this.formCatalog.Count = value.Count;
      this.SelectResort(value.CatalogID);
      this.SelectPenaltiesByCatalogID(value.CatalogID);
      this.SelectArticle();
      this.nodeValue = value;
    },
    getSelectDeptorUser(val) {
      this.listQuery.AllowUserID = val.join(',');
    },
    getDefaultDeptValues(val) {
      this.formCatalog.DeptID = val;
      this.SelectArticle();
    }
  }
};
</script>
<style lang="scss">
.pg {
  margin: 4px;

  .main {
    height: calc(100vh - 96px);

    .content_left {
      display: flex;
      display: -webkit-flex;
      flex-direction: column;
      min-width: 170px;
      height: 100%;
      border: 1px solid whitesmoke;
    }

    .content_right {
      display: flex;
      display: -webkit-flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
      border: 1px solid whitesmoke;

      .top {
        font-size: 14px;
        min-height: 20px;
      }

      .middle {
        height: 100%;

        .middleHead {
          flex-basis: 20px;
        }

        .middleBody {
          height: calc(100% - 34px);
          overflow-y: hidden;

          .middleBodyTb {
            max-height: calc(100% - 37px);
          }
        }
      }

      .bottom {
        height: 100%;
        font-size: 14px;

        .bottomBody {
          height: calc(100% - 45px);
          overflow-y: hidden;

          .bottomBodyTb {
            max-height: calc(100% - 48px);
          }
        }
      }
    }
  }

  .htmlPane {
    height: calc(100vh - 390px);
    border: 2px solid whitesmoke;
    border-radius: 5px;
    padding: 5px;
    overflow-y: auto;
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
