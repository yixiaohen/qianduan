<template>
  <el-card
    style="width: 98%;margin: 10px;height: 87vh"
  >

    <div
      style="width: 100%;
      background-color:#f4f4f5;
      display: inline-block;
      height: 40px;
      line-height: 40px;"
    >
      <el-form
        v-show="!ManagementFrame"
        :inline="true"
        size="mini"
      >
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="addArtical()"
          >制度上传
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="mini"
            @click="selectType"
          >类别管理
          </el-button>
        </el-form-item>
        <el-divider direction="vertical" />
        <el-form-item>
          <el-input
            v-model.trim="searchCatalogData.instTitle"
            placeholder="请输入制度标题"
            clearable
            @keyup.enter.native="SelectinstHome('搜索')"
          />
        </el-form-item>
        <el-divider direction="vertical" />
        <el-form-item>
          <el-input
            v-model.trim="searchCatalogData.instContent"
            placeholder="制度内容"
            clearable
            @keyup.enter.native="SelectinstHome('搜索')"
          />
        </el-form-item>
        <el-divider direction="vertical" />
        <el-form-item>
          <el-input
            v-model.trim="searchCatalogData.instVesion"
            placeholder="制度版本"
            clearable
            @keyup.enter.native="SelectinstHome('搜索')"
          />
        </el-form-item>
        <el-divider direction="vertical" />
        <el-form-item>
          <el-cascader
            ref="addDia"
            v-model="searchCatalogData.instTypeID"
            size="mini"
            :options="tableTypeData"
            :show-all-levels="false"
            placeholder="制度类别"
            filterable
            clearable
            :props="{
              checkStrictly: true,
              expandTrigger: 'hover',
              children: 'children',
              label: 'instTypeName',
              value: 'instTypeID',
            }"
          >

            <template slot-scope="{ node, data }">
              <el-tooltip class="item" effect="dark" :content="data.instTypeName" placement="top">
                <span>{{ data.instTypeName }}</span>
              </el-tooltip>
            </template>
          </el-cascader>


          <!--          -->
          <!--          <el-select-->
          <!--            v-model="searchCatalogData.instTypeID"-->
          <!--            clearable-->
          <!--            filterable-->
          <!--            allow-create-->
          <!--            placeholder="制度类别"-->
          <!--            class="filter-item"-->
          <!--            style="width: 160px"-->
          <!--            @focus="selectDataType"-->
          <!--          >-->
          <!--            <el-option-->
          <!--              v-for="(itemsType, indexsType) in tableTypeData"-->
          <!--              :key="indexsType"-->
          <!--              :value="itemsType.instTypeID"-->
          <!--              :label="itemsType.instTypeName"-->
          <!--            />-->
          <!--          </el-select>-->
        </el-form-item>
        <el-divider direction="vertical" />
        <el-form-item prop="instID">
          <el-select
            v-model="searchCatalogData.instUpUser"
            clearable
            filterable
            allow-create
            placeholder="上传人"
            class="filter-item"
            style="width: 140px"
            @focus="SelectUpUserList"
          >
            <el-option
              v-for="(UpUserItems, UpUserIndex) in SelectUpUserListData"
              :key="UpUserIndex"
              :value="UpUserItems.instUpUser"
              :label="UpUserItems.instUpUserName"
            />
          </el-select>
        </el-form-item>
        <el-divider direction="vertical" />
        <el-form-item prop="DeptName">
          <el-select
            v-model="searchCatalogData.UpDeptList"
            clearable
            filterable
            allow-create
            placeholder="上传部门"
            class="filter-item"
            style="width: 140px"
            @focus="SelectUpDeptList"
          >
            <el-option
              v-for="(UpDeptItems, UpDeptIndex) in SelectUpDeptListData"
              :key="UpDeptIndex"
              :value="UpDeptItems.DeptID"
              :label="UpDeptItems.DeptName"
            />
          </el-select>
        </el-form-item>
        <el-divider direction="vertical" />
        <el-form-item>
          <el-select
            v-model="searchCatalogData.uploadState"
            placeholder="资料上传状态"
            clearable
            @change="SelectinstHome('搜索')"
            @keyup.enter.native="SelectinstHome('搜索')"
          >
            <el-option
              v-for="item in FileStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <!--          <el-input-->
          <!--            v-model.trim="searchCatalogData.instVesion"-->
          <!--            placeholder="上传状态"-->
          <!--            @keyup.enter.native="SelectinstHome('搜索')"-->
          <!--          />-->
        </el-form-item>
        <el-divider direction="vertical" />
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="SelectinstHome('搜索')"
          >搜索
          </el-button>
        </el-form-item>
        <el-divider direction="vertical" />
        <el-form-item>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="moreDel"
          >批量删除
          </el-button>
        </el-form-item>
      </el-form>
      <el-form
        v-show="ManagementFrame"
        :inline="true"
        size="mini"
      >
        <el-form-item>
          <el-button
            type="primary"
            plain
            icon="el-icon-refresh-left"
            size="mini"
            style="margin: 7px auto"
            @click="ManagementFrame1"
          >返回
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            style="margin: 7px auto"
            @click="append(0)"
          >新增
          </el-button>
          <el-button @click="collapseAll(tableDataPage)">全部折叠</el-button>
          <el-button @click="unFoldAll(tableDataPage)">全部展开</el-button>
          <el-input
            v-model="filterText1"
            size="mini"
            clearable
            placeholder="输入制度名称筛选"
            style="width: 150px"
          />
          <el-input
            v-model="filterText2"
            size="mini"
            clearable
            placeholder="输入部门科室筛选"
            style="width: 150px"
          />

        </el-form-item>
      </el-form>
    </div>


    <transition name="el-zoom-in-center">
      <div v-show="!ManagementFrame">
        <el-table
          ref="multipleTable"
          v-loading="deptPDCALoading"
          :data="tableDataPage"
          style="width: 100%;margin-top: 10px"
          height="calc(100vh - 280px)"
          border
          size="mini"
          stripe
          highlight-current-row
          @selection-change="handleSelectionChange"
          @row-click="handleRowClick"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            label="序号"
            type="index"
            width="50"
            align="center"
          />
          <el-table-column
            v-if="false"
            label="编号"
            prop="instID"
            align="center"
            width="49"
          />
          <el-table-column
            label="标题"
            prop="instTitle"
            min-width="200"
            align="center"
            :show-overflow-tooltip="cellOverflow"
          >
            <template slot-scope="{row}">
              <span>{{ row.instTitle }} </span>
<!--              <span v-if="row.instUpUser===nowUseID">-->
<!--                <el-tag-->
<!--                  type="success"-->
<!--                  size="mini"-->
<!--                >-->
<!--                  <span>{{ row.instUpUser === nowUseID ? '自建' : '' }}</span>-->
<!--                </el-tag>-->
<!--              </span>-->
              <span
                v-for="(instAuditUserItem, instAuditUserIndex) in row.AduitList"
                :key="instAuditUserIndex"
              >
                <span
                  v-if="row.instUpUser===nowUseID"
                  style="margin: 4px"
                >
                  <el-tag
                    :type="instAuditUserItem.instAuditState==='通过'?'success':instAuditUserItem.instAuditState==='退回'?'danger':'warning'"
                    size="mini"
                  ><span>{{ row.instUpUser === nowUseID ? '自建' : '' }}</span>
                  </el-tag>
                </span>
                <span
                  v-for="(instAuditUserItem, instAuditUserIndex) in row.AduitList"
                  v-show="instAuditUserItem.instAuditUser*1===nowUseID"
                  :key="instAuditUserIndex"
                  style="margin: 4px"
                >

                  <el-tag

                    :type="instAuditUserItem.instAuditState==='通过'?'success':instAuditUserItem.instAuditState==='退回'?'danger':'warning'"
                    size="mini"
                  > 审
                  </el-tag>
                </span>
              </span>
            </template>

          </el-table-column>
          <el-table-column
            label="最新版本号"
            prop="instVesion"
            align="center"
            min-width="100px"
            :show-overflow-tooltip="cellOverflow"
          />

          <el-table-column
            v-if="false"
            label="内容"
            prop="instContent"
            width="180"
            align="center"
            :show-overflow-tooltip="cellOverflow"
          />
          <el-table-column
            v-if="true"
            label="制度所属科室"
            prop="DeptName"
            min-width="100"
            align="center"
            :show-overflow-tooltip="cellOverflow"
          />

          <el-table-column
            label="类别"
            prop="instTypeName"
            width="100"
            align="center"
            :show-overflow-tooltip="cellOverflow"
          />
          <el-table-column
            label="上传人"
            prop="instUpUserName"
            width="200"
            align="center"
            :show-overflow-tooltip="cellOverflow"
          />
          <el-table-column
            v-if="false"
            label="上传ID"
            prop="instUpUser"
            width="180"
            align="center"
            :show-overflow-tooltip="cellOverflow"
          />
          <el-table-column
            label="上传时间"
            width="130"
            align="center"
            :show-overflow-tooltip="cellOverflow"
          >
            <template slot-scope="scope">
              <p>
                {{ scope.row.instUpTime }}
              </p>
            </template>
          </el-table-column>
          <el-table-column
            label="审核人"
            prop="AduitList"
            align="center"
            min-width="150px"
            :show-overflow-tooltip="cellOverflow"
          >
            <template slot-scope="scope">
              <p
                v-for="(instAuditUserItem, instAuditUserIndex) in scope.row
                  .AduitList"
                :key="instAuditUserIndex"
              >
                {{ instAuditUserItem.instUpUserName }}
              </p>
            </template>
          </el-table-column>
          <el-table-column
            v-if="false"
            label="审核人ID"
            prop="AduitList"
            width="180"
            align="center"
            :show-overflow-tooltip="cellOverflow"
          >
            <template
              slot-scope="scope"
              :show-overflow-tooltip="cellOverflow"
            >
              <p
                v-for="(instAuditUserIDItem, instAuditUserIDIndex) in scope
                  .row.AduitList"
                :key="instAuditUserIDIndex"
              >
                {{ instAuditUserIDItem.instAuditUserID }}
              </p>
            </template>
          </el-table-column>
          <el-table-column
            label="审核状态"
            width="70"
            align="center"
            :show-overflow-tooltip="cellOverflow"
          >
            <template slot-scope="scope">
              <p
                v-for="(instAuditStateItem, instAuditStateIndex) in scope.row
                  .AduitList"
                :key="instAuditStateIndex"
                :style="{
                  color:
                    instAuditStateItem.instAuditState == '通过'
                      ? 'green'
                      : instAuditStateItem.instAuditState == '退回'
                        ? 'red'
                        : 'black',
                  'font-weight': 'bold',
                }"
              >
                {{ instAuditStateItem.instAuditState }}
              </p>
            </template>
          </el-table-column>
          <el-table-column
            label="审核意见"
            width="70"
            align="center"
            :show-overflow-tooltip="cellOverflow"
          >
            <template slot-scope="scope">
              <p
                v-for="(instAuditStateItem, instAuditStateIndex) in scope.row
                  .AduitList"
                :key="instAuditStateIndex"
              >
                {{ instAuditStateItem.instAduitOpinion }}
              </p>
            </template>
          </el-table-column>
          <el-table-column
            label="审核时间"
            prop="AduitList"
            width="140"
            align="center"
            :show-overflow-tooltip="cellOverflow"
          >
            <template slot-scope="scope">
              <p
                v-for="(AuditTimeItem, AuditTimeIndex) in scope.row.AduitList"
                :key="AuditTimeIndex"
              >
                {{
                  AuditTimeItem.instAuditTime
                    ? AuditTimeItem.instAuditTime.replace(/T/g, '')
                    : ''
                }}
              </p>
            </template>
          </el-table-column>
          <el-table-column
            label="归档"
            align="center"
            fixed="right"
            width="60"
          >
            <template slot-scope="{ row }">
              <el-button
                size="mini"
                class="iconfont al-icon-guidang2"
                @click="Archive(row)"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            min-width="220"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                circle
                type="primary"
                icon="el-icon-view"
                @click="seeRow(scope.row)"
              />
              <el-button
                size="mini"
                circle
                type="info"
                icon="el-icon-edit"
                @click="addArtical(scope.row)"
              />
              <el-button
                size="mini"
                circle
                type="warning"
                icon="el-icon-user"
                @click="audit(scope.row)"
              />
              <el-button
                size="mini"
                circle
                type="info"
                icon="el-icon-top"
                @click="upRow(scope.row, scope.$index)"
              />
              <el-button
                size="mini"
                circle
                type="info"
                icon="el-icon-bottom"
                @click="downRow(scope.row, scope.$index)"
              />
              <el-button
                size="mini"
                circle
                type="danger"
                icon="el-icon-delete"
                @click="Deleteinst(scope.row)"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </transition>
    <div v-show="ManagementFrame">
      <div class="block">
        <el-tree
          ref="selectTree"
          v-loading="tableTypeDataLoading"
          :data="tableTypeData"
          :props="{
            children: 'children',
            label: 'instTypeName',
          }"
          node-key="instTypeID"
          accordion
          style="font-size: 14px;font-weight: bold"
          :default-expand-all="isExpand"
          :expand-on-click-node="false"
          :filter-node-method="filterNode"
          :default-expanded-keys="[defaultExpandedId]"
          @node-click="showEdit"
        >
          <div
            slot-scope="{ node, data }"
            style="display: inline-block"
            class="custom-tree-node"
          >
            <svg-icon v-if="data.children.length!==0" icon-class="file" />
            <svg-icon v-else icon-class="file_two" />
            <span> {{ data.instTypeName | filterInstTypeName }}</span>
            <span> ({{ data.DeptName }})</span>
            <el-input
              v-if="data.instTypeID == beforeId && inputText == ''"
              v-model="editorText"
              placeholder="修改"
              size="mini"
              style="width: 300px"
              clearable
              @keyup.enter.native="finishEditClick(data)"
            />
            <defaultDepts
              v-if="data.instTypeID == beforeId && inputText == ''"
              v-model="data.DeptID"
              :multiple="true"
              w="300px"
              type="mini"
              @getDefaultDeptsValue="getDefaultDeptsValue"
              @getDefaultDeptsDeptName="getDefaultDeptsName"
            />
            <el-button
              v-if="data.instTypeID == beforeId && inputText == ''"
              type="primary"
              size="mini"
              @click="finishEditClick(data)"
            >确定
            </el-button>
            <el-button
              v-if="data.instTypeID == beforeId && inputText == ''"
              type="primary"
              size="mini"
              @click="beforeId = ''"
            >放弃
            </el-button>

            <span>
              <el-button
                v-if="data.instTypeID===nowInstTypeID"
                type="text"
                size="mini"
                circle
                icon="el-icon-circle-plus-outline"
                @click="append(data)"
              />

              <el-button
                v-if="data.instTypeID===nowInstTypeID"
                type="text"
                size="mini"
                circle
                icon="el-icon-edit"
                @click="editorNode(data)"
              />
              <el-popconfirm
                v-if="data.instTypeID===nowInstTypeID"
                confirm-button-text="是"
                cancel-button-text="否"
                icon="el-icon-info"
                icon-color="red"
                title="确定删除吗？"
                @confirm="deleteType1(node, data)"
              >
                <el-button
                  slot="reference"
                  circle
                  icon="el-icon-delete"
                  type="text"
                  size="mini"
                />
              </el-popconfirm>
            </span>
            <el-form ref="form">
              <el-input
                v-if="data.instTypeID == inputText"
                v-model="addText"
                placeholder="请输入内容"
                size="mini"
                width="300px"
                clearable
                @keyup.enter.native="finishEditClick(data)"
              />
              <defaultDepts
                v-if="data.instTypeID == inputText"
                v-model="FindDepartmentID"
                :multiple="true"
                w="300px"
                type="mini"
                @getDefaultDeptsValue="getDefaultDeptsValue"
                @getDefaultDeptsDeptName="getDefaultDeptsName"
              />
              <el-button
                v-if="data.instTypeID == inputText"
                type="primary"
                size="mini"
                @click="finishEditClick(data)"
              >
                确定
              </el-button>
              <el-button
                v-if="data.instTypeID == inputText"
                type="primary"
                size="mini"
                @click="canceladd()"
              >
                取消
              </el-button>

              <el-button
                v-if="data.instTypeName == inputText"
                type="primary"
                size="mini"
                @click="giveUp(data, node)"
              >
                放弃
              </el-button>
            </el-form>
          </div>
        </el-tree>
      </div>
    </div>

    <!--制度上传 上传资料弹窗begin -->
    <el-dialog
      :title="dialogTitle"
      :close-on-click-modal="false"
      :visible.sync="dialogFormVisible"
      height="350px"
      :width="device === 'desktop' ? '33%' : '90%'"
    >
      <el-tabs v-model="activeName">
        <el-tab-pane
          label="基本资料"
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
                label="制度类别"
                prop="instID"
              >

                <el-cascader
                  v-model="listQuery.instID"
                  size="mini"
                  style="width: 250px"
                  :options="tableTypeData"
                  :show-all-levels="true"
                  placeholder="可在此框直接搜索"
                  filterable
                  clearable
                  :props="{
                    checkStrictly: true,
                    expandTrigger: 'hover',
                    children: 'children',
                    label: 'instTypeName',
                    value: 'instTypeID',
                  }"
                  @change="xx"
                >

                  <template slot-scope="{ node, data }">
                    <el-tooltip class="item" effect="dark" :content="data.instTypeName" placement="top">

                      <span v-if="dialogTitle==='制度上传'">{{ data.instTypeName }}</span>
                      <span v-else>{{ listQuery.instTypeName }}</span>
                    </el-tooltip>
                  </template>
                </el-cascader>


              </el-form-item>
              <el-form-item
                label="制度标题"
                prop="Title"
              >
                <el-input
                  v-model="listQuery.Title"
                  style="width: 250px"
                />
              </el-form-item>
              <el-form-item />
              <el-form-item
                label="版本号"
                prop="VersionNumber"
              >
                <el-input
                  v-model="listQuery.VersionNumber"
                  style="width: 250px"
                />
              </el-form-item>

            </div>
            <el-form-item label="附件上传">
              <el-upload
                :multiple="true"
                :show-file-list="true"
                :on-success="handleSuccess"
                class="editor-slide-upload"
                :file-list="fileList"
                action="/api/RC_File/UploadFile"
              >
                <el-button
                  size="mini"
                  type="primary"
                  :disabled="listQuery.GroupID === ''"
                >选择文件
                </el-button>
              </el-upload>
            </el-form-item>
            <el-table
              v-if="listQuery.File_dto.length > 0"
              :data="listQuery.File_dto"
              border
              height="200px"
            >
              <el-table-column
                prop="title"
                label="资料标题"
              >
                <template slot-scope="{row, $index }">
                  <el-input
                    v-if="currentEdit2 === $index"
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
                    v-if="currentEdit2 === $index"
                    type="text"
                    size="small"
                    @click="finishEditClick2(row.FileID,row.FileName)"
                  >完成
                  </el-button>
                  <span
                    v-else
                    style="cursor: pointer !important; color: #3e84e9"
                    @click="EditClick2($index)"
                  >修改</span>
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
                  <el-link
                    :href="row.FileUrl"
                    type="primary"
                    target="_blank"
                  >下载
                  </el-link>
                </template>
              </el-table-column>
              <el-table-column
                width="90px"
                align="center"
              >
                <template
                  v-if="scope.row.type != 'editor'"
                  slot-scope="scope"
                >
                  <i
                    class="el-icon-delete"
                    @click="deleteFile_dto(scope)"
                  />
                </template>
              </el-table-column>
            </el-table>
            <wangeditor
              v-if="listQuery.Content"
              ref="wangEditUpdate"
              @change="getContent"
            />

          </el-form>
        </el-tab-pane>
        <el-tab-pane
          label="指定审核人"
          name="second"
        >
          <tree-filter
            ref="TreeID"
            :tree-data="TreeFilterData"
            @getSelect="getSelect"
          />
        </el-tab-pane>
      </el-tabs>
      <div
        slot="footer"
        class="dialog-footer"
      >

        <el-button
          type="primary"
          size="small"
          :loading="uploadEnd"
          @click="upload()"
        >提交
        </el-button>
        <el-button
          size="small"
          @click="dialogForm"
        >关闭
        </el-button>
      </div>
    </el-dialog>
    <!-- 制度上传，修改 上传资料弹窗end -->
    <!--  制度详情历史 -->
    <el-dialog
      title="制度详情历史"
      class="TypeDetail"
      :visible.sync="dialogFormVisibleDetails"
      fullscreen
    >
      <el-row>
        <el-col :span="12">
          <el-form
            :inline="true"
            label-position="right"
            size="mini"
            class="demo-form-inline"
          >
            <el-form-item label="制度标题:">
              <el-input
                v-model="seeRowData.instTitle"
                size="mini"
                :disabled="true"
              />
            </el-form-item>
            <el-form-item label="制度类别:">
              <el-input
                v-model="seeRowData.instTypeName"
                size="mini"
                :disabled="true"
              />
            </el-form-item>
            <el-form-item label="日期:">
              <el-select
                v-model="instHistoryTime"
                placeholder="请选择时间"
                @change="HistoryTime"
              >
                <el-option
                  v-for="(itemTime1, indexTime1) in rowDataTime"
                  :key="indexTime1"
                  :label="itemTime1.instUpTime"
                  :value="itemTime1.instHistoryID"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="制度版本:">
              <el-input
                v-model="seeRowData.instVesion"
                size="mini"
                :disabled="true"
              />
            </el-form-item>
            <el-form-item label="上传人:">{{
              seeRowData.instUpUserName
            }}
            </el-form-item>
          </el-form>
          <el-table
            :data="seeRowData.FileList"
            border
            height="200px"
          >
            <el-table-column
              prop="FileName"
              label="资料标题"
            >
              <template slot-scope="{ row }">
                <span
                  style="cursor: pointer !important"
                  @click="PreviewFile(row.FileUrl)"
                >{{ row.FileName }}</span>
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
                <el-link
                  :href="row.FileUrl"
                  type="primary"
                  target="_blank"
                >下载
                </el-link>
              </template>
            </el-table-column>
            <el-table-column
              width="90px"
              align="center"
            >
              <template
                v-if="scope.row.type != 'editor'"
                slot-scope="scope"
              >
                <i
                  class="el-icon-delete"
                  @click="deleteFile_dto(scope)"
                />
              </template>
            </el-table-column>
          </el-table>
          <wangeditor1
            ref="wangEdit1"
            class="wangeditorDetail"
          />
        </el-col>
        <el-col :span="12">
          <el-form
            :inline="true"
            label-position="right"
            size="mini"
            class="demo-form-inline"
          >
            <el-form-item label="制度标题:">
              <el-input
                v-model="seeRowData2.instTitle"
                size="mini"
                :disabled="true"
              />
            </el-form-item>
            <el-form-item label="制度类别:">
              <el-input
                v-model="seeRowData2.instTypeName"
                size="mini"
                :disabled="true"
              />
            </el-form-item>
            <el-form-item label="日期:">
              <el-select
                v-model="instHistoryTime2"
                placeholder="请选择时间"
                @change="HistoryTime2"
              >
                <el-option
                  v-for="(itemTime2, indexTime1) in rowDataTime"
                  :key="indexTime1"
                  :label="itemTime2.instUpTime"
                  :value="itemTime2.instHistoryID"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="制度版本:">
              <el-input
                v-model="seeRowData2.instVesion"
                :disabled="true"
                size="mini"
              />
            </el-form-item>
            <el-form-item label="上传人:">{{
              seeRowData2.instUpUserName
            }}
            </el-form-item>
          </el-form>
          <el-table
            :data="seeRowData2.FileList"
            border
            height="200px"
          >
            <el-table-column
              prop="title"
              label="资料标题"
            >
              <template slot-scope="{ row }">
                <span
                  style="cursor: pointer !important"
                  @click="PreviewFile(row.FileUrl)"
                >{{ row.FileName }}</span>
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
                <el-link
                  :href="row.FileUrl"
                  type="primary"
                  target="_blank"
                >下载
                </el-link>
              </template>
            </el-table-column>
            <el-table-column
              width="90px"
              align="center"
            >
              <template
                v-if="scope.row.type != 'editor'"
                slot-scope="scope"
              >
                <i
                  class="el-icon-delete"
                  @click="deleteFile_dto(scope)"
                />
              </template>
            </el-table-column>
          </el-table>
          <wangeditor2
            ref="wangEdit2"
            class="wangeditorDetail"
          />
        </el-col>
      </el-row>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          size="small"
          @click="dialogFormVisibleDetails = false"
        >关闭</el-button>
      </span>
    </el-dialog>
    <!-- 查看详情弹窗end -->

    <!-- 审核begin -->
    <el-dialog
      title="制度审核"
      :visible.sync="auditData.audiDialogVisible"
      :width="device === 'desktop' ? '30%' : '95%'"
    >
      <el-form
        size="mini"
        :model="auditData"
        label-position="top"
      >
        <el-form-item>
          <el-input
            v-model="auditData.instAduitOpinion"
            size="mini"
            autocomplete="off"
            type="textarea"
            placeholder="请填写审核意见"
          />
        </el-form-item>
        <el-form-item
          label="评审结果"
          label-width="100px"
        >
          <el-select
            v-model="auditData.instAuditState"
            size="mini"
            placeholder="请选择通过或退回"
          >
            <el-option
              label="通过"
              value="通过"
            />
            <el-option
              label="退回"
              value="退回"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          size="small"
          @click="auditData.audiDialogVisible = false"
        >取 消
        </el-button>
        <el-button
          size="small"
          type="primary"
          @click="auditDialog"
        >确 定
        </el-button>
      </div>
    </el-dialog>
    <!-- 审核end -->
    <!-- 归档begin -->
    <el-dialog
      :title="titleArchive"
      :visible.sync="dialogVisibleArchive"
      :close-on-click-modal="false"
      :width="device === 'desktop' ? '40%' : '95%'"
      height="400px"
    >
      <el-row>
        <el-col
          :span="7"
          :xs="12"
          :sm="12"
        >
          <standardCatalog
            maxheight="500px"
            @nodeClickCatalog="nodeClickCatalog"
          />
        </el-col>
        <!-- <div style="width: 290px"> -->
        <el-col
          :span="8"
          :xs="12"
          :sm="12"
        >
          <articlegroup
            style="width: 140px"
            @getSelectAllArticleGroupValue="getSelectAllArticleGroupValue2"
          />
          <el-input
            v-model="catalogName"
            type="textarea"
            placeholder="条款要点"
            disabled
            :rows="12"
            style="margin-top: 5px"
          />
        </el-col>
      </el-row>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          size="mini"
          @click="dialogVisibleArchive = false"
        >取 消</el-button>
        <el-button
          type="primary"
          size="mini"
          :loading="uploadEnd"
          @click="InsertArticle"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 归档end -->

    <el-row>
      <el-col :span="2">
        <el-switch
          v-if="stateS===1"
          v-model="cellOverflow"
          style="margin: 6px 0px"
        />
      </el-col>
      <el-col :span="20">
        <!-- 分页 -->
        <el-pagination
          v-if="stateS===1"
          background
          style="margin-top: 10px"
          :current-page="pagination.pageIndex"
          :page-sizes="[15, 30, 50, 100,200,500]"
          :page-size="pagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-col>
    </el-row>

  </el-card>
</template>
<script>
import wangeditor from '@/components/Editor/index'; /* 富文本编辑器 */
import wangeditor1 from '@/components/Editor/index'; /* 富文本编辑器 */
import wangeditor2 from '@/components/Editor/index'; /* 富文本编辑器 */
import treeFilter from '@/views/components/treeFilter';
import { Preview } from '@/views/mixin/relace';
import { mapGetters } from 'vuex';
import { InsertArticle, PreviewFile } from '@/api/Article';
import {
  Deleteinst,
  DeleteinstType,
  Insertinst,
  InsertinstType,
  instAudit,
  instMove,
  SelectDeptorUser,
  Selectinst,
  SelectInstHistory,
  SelectinstType,
  SelectUpDeptList,
  SelectUpUserList,
  UPdateinst,
  UpdateinstAduitUser,
  UpdateinstType
} from '@/api/institution';
import standardCatalog from '@/views/components/standardCatalog2';
import articlegroup from '@/views/components/articlegroup';
import defaultDepts from '@/views/components/defaultDepts';

export default {
  name: 'Institution',
  components: {
    wangeditor,
    treeFilter,
    wangeditor1,
    wangeditor2,
    standardCatalog,
    articlegroup,
    defaultDepts
  },
  filters: {
    // 对树节点过长进行过滤
    filterInstTypeName(instTypeName) {
      let newInstTypeName;
      const instTypeNameLength = instTypeName.length;
      if (instTypeNameLength > 50) {
        newInstTypeName = instTypeName.substr(0, 50) + '...';
      } else {
        newInstTypeName = instTypeName;
      }
      return newInstTypeName;
    }
  },
  data() {
    return {
      tableTypeDataLoading: false, // 制度类别树等待圈
      filterText1: '', // 过滤字制度
      filterText2: '', // 过滤字部门科室
      isExpand: true, // 是否默认展开，是
      nowUseID: window.userInfo[0].UserID, // 当前人员id，用于识别自建表单
      nowTopicID: [], // 现在所选择的批量删除制度id数据集
      nowInstTypeID: null, // 现在所点击的树形控件节点id
      nowFileList: [], // 现在附件的内容
      FileStatus: [
        {
          label: '资料上传状态(全部)',
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
      instUpUserName: '',
      instAuditTime: '',
      stateS: 1,
      SelectUpUserListData: [],
      SelectUpDeptListData: [],
      deptPDCALoading: false,
      searchCatalogData: {
        instTitle: '',
        instContent: '',
        instVesion: '',
        uploadState: '',
        instTypeID: '',
        instUpUser: '',
        instUpUserData: '',
        UpDeptList: ''
      },
      /* 制度类别管理begin */
      currentEdit: -1,
      ass: '',
      tableTypeTitle: [
        {
          title: '制度类别',
          prop: 'instTypeName'
        },
        {
          title: '编号',
          prop: 'instTypeID',
          disabled: true
        }
      ],
      insetName: '', // 拷贝当前行的typeName
      tableTypeData: [], // 管理类型数据
      serialNumber: '', // 编号 查询输入框
      ManagementFrame: false, // 控制制度类别管理框
      /*  制度类别管理 end */
      // 上传文件资料IP
      IP: `/api/inst/UploadFile`,
      nodeValue: {},
      dialogTitle: '',
      dialogFormVisible: false,
      dialogFormVisibleView: false,
      dialogFormVisibleStatusView: false,
      isClear: false,
      ResortName: [],
      // 首页加载的数据
      tableDataPage: [],
      tableData: [],
      // 详情弹窗数据
      seeRowData: [],
      seeRowData2: [],
      rowData: [],
      rowDataTime: [],
      instHistoryTime: '',
      instHistoryTime2: '',
      pagination: {
        total: 0,
        pageSize: 15,
        pageSizes: [10, 20, 30, 40, 50, 60],
        pageIndex: 1 // 当前页
      },
      // 制度资料上传begin
      TreeFilterData: {
        label: 'label',
        children: 'children',
        key: 'UserID' /* 要获取的值 */,
        treeData: []
      },
      uploadBoolean: '',
      fileListUpload: [],
      getFileUploadList: [],
      activeName: 'first',
      fileList: [],
      listQuery: {
        instAuditUserID: [],
        Title: '',
        instID: '', // 下拉选中的值制度类别id
        instID2: '', // 制度id
        VersionNumber: '',
        instAduitUser: '', // 审核人
        GroupID: 0,
        Content: '  ',
        AuthorID: window.userInfo[0].UserID,
        instUpUser: '', // 上传人ID
        File_dto: [],
        UserID: window.userInfo[0].UserID,
        NoRecord: false,
        instTypeName: ''
      },
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
      uploadEnd: false,
      rules: {
        Title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        GroupID: [{ required: true, message: '请选择资料', trigger: 'blur' }],
        instID: [
          { required: true, message: '请选择制度类别', trigger: 'blur' }
        ],
        VersionNumber: [
          { required: true, message: '请选择制度制度版本', trigger: 'blur' }
        ],
        instContent: [
          { required: true, message: '请输入制度内容', trigger: 'blur' }
        ]
      },
      // 制度资料上传end
      rowObject: '',
      // end
      // 详情页begin
      dialogFormVisibleDetails: false,
      // 详情页end
      // 审核数据
      auditData: {
        audiDialogVisible: false,
        instID: '',
        instAuditUser: '',
        instAuditState: '',
        instAduitOpinion: ''
      },
      cellOverflow: false,
      /* 归档 */
      dialogVisibleArchive: false,
      submitData: {
        Title: '',
        GroupID: 0,
        CatalogID: 0,
        Content: '',
        File_list: [],
        AuthorID: window.userInfo[0].UserID
      },
      formData: {},
      titleArchive: '',
      catalogName: '',
      listQueryContrast: '',
      instAduitUserNoRecord: '' /* 记录编辑是否修改了审核人,修改前 */,
      instAduitUserNoRecord2: '' /* 修改后 */,
      treeInstType: [
        {
          children: [
            {
              children: [],
              name: '123'
            }
          ],
          name: '123'
        },
        {
          children: [],
          name: '123'
        }
      ],
      defaultExpandedId: 0,
      inputText: '',
      addText: '',
      FindDepartmentID: 0,
      FindDepartmentName: '',
      editorText: '',
      beforeId: -1,
      currentEdit2: -1 // 判断是否显示input框
    };
  },
  computed: {
    ...mapGetters(['device'])
  },
  watch: {
    // 监听过滤筛选的制度类别
    filterText1(val) {
      this.$refs.selectTree.filter(val);
    },
    // 监听过滤筛选的科室部门
    filterText2(val) {
      this.$refs.selectTree.filter(val);
    }
  },
  created() {
    this.getTreeData();
    this.selectDataType();
  },
  mounted() {
    this.SelectinstHome();
  },
  methods: {
    xx(val) {
      console.log(val);
    },
    // 对树节点进行筛选过滤操作
    filterNode(value, data) {
      console.log('value', value);
      console.log('data', data);
      // 如果不输入，不操作
      if (!value) return true;
      // 如果筛选制度名称
      if (this.filterText1) {
        return data.instTypeName.indexOf(value) !== -1;
      }
      // 如果筛选科室部门
      if (this.filterText2) {
        return data.DeptName.indexOf(value) !== -1;
      }
    },
    // 获取当前点击树形控件的节点id
    showEdit(node) {
      this.nowInstTypeID = node.instTypeID;
    },

    /* 制度类别树形控件展开折叠开始 */

    // 设置全部展开和折叠。state参数为bool值
    setAllExpand(state) {
      var nodes = this.$refs.selectTree.store.nodesMap;
      for (var i in nodes) {
        nodes[i].expanded = state;
      }
    },
    // 全部展开
    unFoldAll(data) {
      this.setAllExpand(true);
    },
    // 全部折叠
    collapseAll(data) {
      this.setAllExpand(false);
    },
    /* 制度类别树形控件展开折叠结束 */

    // 获取选中的制度id
    handleSelectionChange(val) {
      console.log('选中了', val);
      this.nowTopicID = [];
      val.map((item) => {
        this.nowTopicID.push(item.instID);
      });
      this.nowTopicID = this.nowTopicID.toString();
    },
    // 点击行触发，选中或不选中复选框
    handleRowClick(row, column, event) {
      this.$refs.multipleTable.toggleRowSelection(row);
    },
    // 确定批量删除
    moreDel() {
      this.$confirm('确定批量删除所选制度, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(async() => {
        if (this.nowTopicID.length === 0) {
          this.$message.warning('请至少勾选一条制度');
        } else {
          const { code, msg } = await Deleteinst({ instIds: this.nowTopicID });
          if (code === 200) {
            this.$message({
              type: 'success',
              message: msg
            });
            this.listLoading = false; // 关闭表格加载条
            await this.SelectinstHome(); // 刷新列表
          }
        }
      }).catch(() => {
        this.isShowMoreDel = false; // 取消勾选框，隐藏确定删除、取消按钮
        this.listLoading = false; // 关闭表格加载条
      });
    },
    // 返回按钮
    ManagementFrame1() {
      this.stateS = 1; // 现在显示制度加科室
      this.selectDataType();
      this.ManagementFrame = false;
    },
    // 类别管理这中，取消增加隐藏
    canceladd() {
      this.inputText = '';
    },
    // 获取科室id
    getDefaultDeptsValue(value) {
      this.FindDepartmentID = value.toString() || '';
    },
    // 获取科室名字
    getDefaultDeptsName(value) {
      this.FindDepartmentName = value || '';
    },
    // 上传文件名修改
    EditClick2(index) {
      this.currentEdit2 = index;
      // alert(index);
    },
    async finishEditClick2(FileID, FileName) {
      try {
        this.currentEdit2 = -1;
      } catch (error) {
        console.log(error);
      }
    },



    async upRow(row, index) {
      /* 上移 */
      if (row.instID < 2) {
        this.$message.warning('当前制度id不可向上移动');
        return;
      }
      const val = {
        instID: row.instID,
        Ordinal: row.Ordinal,
        MoveType: 1,
        Type: 0
      };
      try {
        const data = await instMove(val);
        if (data.code === 200) {
          this.SelectinstHome();
        } else {
          this.$message.warning('上移失败');
        }
      } catch (e) {
        console.log(e);
      }
    },
    async downRow(row, index) {
      const val = {
        instID: row.instID,
        Ordinal: row.Ordinal,
        MoveType: 2,
        Type: 0
      };
      try {
        const data = await instMove(val);
        if (data.code === 200) {
          this.SelectinstHome();
        } else {
          this.$message.warning('下移失败');
        }
      } catch (error) {
      }
    },
    // 对话框关闭事件
    dialogForm() {
      this.dialogFormVisible = false;
      this.currentEdit2 = -1; // 将input框关闭
    },
    async upload() {
      this.currentEdit2 = -1; // 将input框关闭
      if (this.instAduitUserNoRecord2.length === 0) {
        this.$message.warning('还没选择审核人');
        return;
      }
      let obj = {
        instTitle: this.listQuery.Title,
        instTypeID: this.listQuery.instID[this.listQuery.instID.length - 1],
        instVesion: this.listQuery.VersionNumber,
        instUpUser: this.listQuery.AuthorID,
        instContent: this.listQuery.Content,
        instAuditUser:
          typeof this.instAduitUserNoRecord2 === 'string'
            ? this.instAduitUserNoRecord2
            : this.instAduitUserNoRecord2.join(',')
      };
      if (this.uploadBoolean) {
        if (
          this.listQuery.Title == '' ||
          this.listQuery.instID == '' ||
          this.listQuery.VersionNumber == ''
        ) {
          this.$message.warning('请填写必填选项');
          return;
        }
        if (this.fileListUpload.length == undefined) {
          this.$message.warning('请上传文件');
          return;
        }
        this.instAduitUserNoRecord2 =
          typeof this.instAduitUserNoRecord2 === 'string'
            ? this.instAduitUserNoRecord2.split(',')
            : this.instAduitUserNoRecord2;
        if (this.instAduitUserNoRecord2.length === 0) {
          this.$message.warning('请选择指定的审核人');
          return;
        }
        if (this.instAduitUserNoRecord2 === '') {
          this.$message.warning('请选择审核人！');
          return;
        }

        obj = {
          instTitle: this.listQuery.Title,
          instTypeID: this.listQuery.instID[this.listQuery.instID.length - 1],
          instVesion: this.listQuery.VersionNumber,
          instUpUser: this.listQuery.AuthorID,
          instContent: this.listQuery.Content,
          File_dto: this.listQuery.File_dto,
          instAuditUser:
            typeof this.instAduitUserNoRecord2 === 'string'
              ? this.instAduitUserNoRecord2
              : this.instAduitUserNoRecord2.join(',')
        };
        try {
          this.uploadEnd = true; // 等待圈开启
          const data3 = await Insertinst(obj); // 增加制度
          if (data3.code === 200) {
            this.$message.success({ message: '制度新增成功', showClose: true });
            const val2 = {
              instID: data3.data,
              instAuditUser: this.listQuery.instAduitUser,
              UserID: obj.instUpUser
            };
            const data2 = await UpdateinstAduitUser(val2); // 更新审核人
            if (data2.code === 200) {
              this.$message.success('审核人分配完成');
            }
            this.SelectinstHome();
            this.uploadEnd = false; // 等待圈关闭
          }
        } catch (error) {
          this.uploadEnd = false; // 等待圈关闭
        }
        this.dialogFormVisible = false;
        this.fileList = [];
      } else {
        if (
          JSON.stringify(this.listQuery) == this.listQueryContrast &&
          this.instAduitUserNoRecord == this.instAduitUserNoRecord2
        ) {
          this.dialogFormVisible = false;
          this.listQuery.NoRecord = false;
          return;
        }
        if (
          JSON.stringify(this.listQuery) == this.listQueryContrast &&
          this.instAduitUserNoRecord != this.instAduitUserNoRecord2
        ) {
          this.listQuery.NoRecord = true;
        }
        try {
          this.uploadEnd = true; // 等待圈开启
          const File_dto = [];
          this.listQuery.File_dto.map(item => {
            if (item.type != 'editor') {
              return File_dto.push(item);
            }
          });
          obj = {
            instTitle: this.listQuery.Title,
            instTypeID: this.listQuery.instID[this.listQuery.instID.length - 1],
            instVesion: this.listQuery.VersionNumber,
            instUpUser: this.listQuery.AuthorID,
            instContent: this.listQuery.Content,
            File_dto: File_dto,
            instID: this.listQuery.instID2,
            instAuditUser:
              typeof this.instAduitUserNoRecord2 === 'string'
                ? this.instAduitUserNoRecord2
                : this.instAduitUserNoRecord2.join(','),
            NoRecord: this.listQuery
              .NoRecord /* true只改审核人，后端不计入历史记录 */
          };
          const data1 = await UPdateinst(obj);
          if (data1.code === 200) {
            this.$message.success('修改完成');
            this.SelectinstHome();
            this.listQuery.NoRecord = false;
            this.uploadEnd = false; // 等待圈关闭
          }
        } catch (error) {
          console.log(error);
          this.uploadEnd = false; // 等待圈关闭
        }
        this.dialogFormVisible = false;
        this.fileList = [];
      }
    },
    handleSuccess(response, file) {
      if (response.code === 200) {
        this.listQuery.File_dto.push({
          FileName: file.name,
          FileUrl: response.data[0].FileUrl,
          type: '新传文件'
        });
      } else {
        this.fileList = [];
        this.$message.error(file.name + '上传失败');
      }
    },
    async getTreeData() {
      try {
        const data = await SelectDeptorUser();
        this.TreeFilterData.treeData = data.data;
      } catch (error) {
        console.log(error);
      }
    },
    // 资料上传类型选择
    async selectDataType() {
      try {
        const data = await SelectinstType({ Type: 0 });
        if (data.code === 200) {
          this.tableTypeData = data.data;
        } else {
          this.tableTypeData = '';
        }
      } catch (error) {
        console.log(error);
      }
    },

    // 制度资料上传类型选择end
    // 制度管理首页查询
    async SelectinstHome(value) {
      this.deptPDCALoading = true;
      this.pagination.pageIndex =
        value == '搜索' ? 1 : this.pagination.pageIndex;
      const val = {
        instTitle: this.searchCatalogData.instTitle,
        instContent: this.searchCatalogData.instContent,
        instTypeName: this.$refs.addDia.inputValue || '',
        instUpUser: this.searchCatalogData.instUpUser || 0,
        instVesion: this.searchCatalogData.instVesion,
        uploadState: this.searchCatalogData.uploadState || '',
        pageSize: this.pagination.pageSize,
        pageIndex: this.pagination.pageIndex,
        instUpDept: this.searchCatalogData.UpDeptList || 0,
        Type: 0
      };
      try {
        const { data } = await Selectinst(val);
        this.pagination.total = data.Total;
        this.tableDataPage = data.DataList;
      } catch (error) {
        console.log(error);
      }
      this.deptPDCALoading = false;
    },
    /* 部门查询 */
    async SelectUpDeptList() {
      try {
        const data = await SelectUpDeptList();
        this.SelectUpDeptListData = data.data;
      } catch (error) {
      }
    },
    // 制度类型查询
    async selectType() {
      this.stateS = 2; // 调为制度前面不加科室
      this.ManagementFrame = true;
      this.tableTypeDataLoading = true; // 开启制度类别树加载条
      try {
        const { data } = await SelectinstType();
        this.tableTypeData = data;
        this.tableTypeDataLoading = false; // 关闭制度类别树加载条
      } catch (error) {
        this.tableTypeDataLoading = false; // 关闭制度类别树加载条
        console.log(error);
      }
    },
    // 修改制度类别
    EditClick(scope) {
      this.currentEdit = scope.$index;
    },
    // 制度类别 修改完成
    async finishEditClick(data) {
      if (data.instTypeID !== 0 && !this.inputText) {
        if (!this.editorText) {
          this.$message('制度类型不能为空');
          return;
        }
        const Updateinst = await UpdateinstType({
          instTypeID: data.instTypeID,
          instTypeName: this.editorText,
          Type: 0,
          DeptID: this.FindDepartmentID
        });
        Updateinst.code == 200
          ? this.$message.success('更新成功')
          : this.$message.error(Updateinst.msg);
        this.beforeId = -1;
        this.isExpand = true;
      } else {
        if (!this.addText) {
          this.$message('制度类型不能为空');
          return;
        }
        const Insertinst = await InsertinstType({
          instTypeName: this.addText,
          ParentID: this.inputText ? this.inputText : 0,
          Type: 0,
          DeptID: this.FindDepartmentID
        });
        Insertinst.code == 200
          ? this.$message.success('新增成功')
          : this.$message.error(Insertinst.msg);
        this.beforeId = -1;
        this.inputText = '';
      }
      this.selectDataType();
    },
    editorNode(data) {
      this.beforeId = data.instTypeID;
      this.editorText = data.instTypeName;
    },
    append(data) {
      if (data === 0) {
        this.tableTypeData.push({
          ParentID: 0,
          Type: 0,
          children: [],
          instTypeID: 0,
          instTypeName: ''
        });
        this.inputText = '';

        this.collapseAll(this.tableDataPage); // 全部折叠
      } else {
        this.inputText = data.instTypeID;
        this.addText = '';
      }
    },
    // 增加一组制度类
    insetTypeData() {
      if (this.tableTypeData.find(obj => obj.instTypeID == '（自动生成）')) {
        this.$message.warning('一次只能添加一行');
        return;
      }
      this.tableTypeData.unshift({
        instTypeID: '（自动生成）',
        instTypeName: ''
      });
      // 编辑当前行
      this.currentEdit = 0;
    },
    // 删除制度指定的类别
    async deleteType1(node, data) {
      try {
        const val = await DeleteinstType({
          instTypeID: data.instTypeID
        });
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.instTypeID === data.instTypeID);
        val.code === 200 ? children.splice(index, 1) : '';
        this.$message.success(val.msg);
      } catch (error) {
        console.log(error);
      }
    },
    async giveUp(data, node) {
      if (data.instTypeID === 0) {
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.instTypeID === data.instTypeID);
        children.splice(index, 1);
      }
    },
    getContent(value) {
      this.listQuery.Content = value;
    },
    cancel() {
      this.dialogFormVisible = false;
    },
    async seeRow(row) {
      const { data } = await SelectInstHistory({
        instID: row.instID
      });

      this.rowData = data;
      this.rowDataTime = data.map(item => {
        return {
          instUpTime:
            item.instUpTime == null
              ? '未知时间'
              : item.instUpTime == ''
                ? '未知时间'
                : item.instUpTime.split('T').join(' ') + ' (版本：' + item.instVesion + ')',
          instHistoryID: item.instHistoryID
        };
      });
      this.$nextTick(() => {
        this.instHistoryTime = this.rowDataTime[0].instHistoryID;
        this.instHistoryTime2 =
          this.rowDataTime[1] == undefined
            ? ''
            : this.rowDataTime[1].instHistoryID;
      });
      this.seeRowData = this.rowData[0];

      this.seeRowData.FileList = [
        ...this.seeRowData.FileList,
        ...Preview(this.seeRowData.instContent, 'editor')
      ];
      this.seeRowData2 =
        this.rowData[1] == undefined ? this.rowData[0] : this.rowData[1];
      this.seeRowData2.FileList = [
        ...this.seeRowData2.FileList,
        ...Preview(this.seeRowData2.instContent, 'editor')
      ];
      this.dialogFormVisibleDetails = true;
      this.$nextTick(() => {
        this.$refs.wangEdit1.setContent(this.seeRowData.instContent);
        this.$refs.wangEdit2.setContent(this.seeRowData2.instContent);
      });
    },
    async PreviewFile(url) {
      try {
        /* 文件预览 */
        var loading = this.$loading({
          lock: true,
          text: '文件格式转换中，请稍后......',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        const { data } = await PreviewFile({
          Title: url.replace(/Annex\/file\/|\//g, '')
        });
        loading.close();
        this.$nextTick(() => {
          const link = document.createElement('a');
          link.style.display = 'none';
          link.href = data;
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
        });
      } catch (e) {
        console.log(e);
        loading.close();
      }
    },
    setarr(array) {
      // 保存新数组
      const newArr = [];
      Array.prototype.isExist = function(value, key) {
        for (let i = 0, len = this.length; i < len; i++) {
          // 若存在，则返回对应的索引
          if (this[i][key] === value) {
            return i;
          }
        }
        // 否则返回 -1
        return -1;
      };
      array.forEach(item => {
        // 保存判断结果
        const res = newArr.isExist(item.FileUrl, 'FileUrl');
        // 若不存在新数组中，则直接追加进新数组
        if (res == -1) {
          newArr.push(item);
        } else {
          // 若存在,则将除id外的字段追加进新数组中
          for (var key in newArr[res]) {
            // if (key == "id") continue;
            if (newArr[res][key] == item[key]) continue;

            newArr[res][key] += item[key];
          }
        }
      });
      return newArr;
    },
    HistoryTime(val) {
      try {
        Object.assign(this.$data.seeRowData, this.$options.data().seeRowData);
        this.seeRowData = this.rowData.find(item => item.instHistoryID == val);
        this.seeRowData.FileList.push(
          ...Preview(this.seeRowData.instContent, 'editor')
        );
        this.seeRowData.FileList = this.setarr(this.seeRowData.FileList);
        this.$refs.wangEdit1.setContent(this.seeRowData.instContent);
      } catch (error) {
        console.log(error);
      }
    },
    async HistoryTime2(val) {
      try {
        Object.assign(this.$data.seeRowData2, this.$options.data().seeRowData2);
        this.seeRowData2 = this.rowData.find(item => item.instHistoryID == val);
        this.seeRowData2.FileList.push(
          ...Preview(this.seeRowData2.instContent, 'editor')
        );
        this.seeRowData2.FileList = this.setarr(this.seeRowData2.FileList);
        this.$refs.wangEdit2.setContent(this.seeRowData2.instContent);
      } catch (error) {
        console.log(error);
      }
    },
    audit(row) {
      if (window.userInfo[0].RoleName == '系统管理员') {
        this.auditData.audiDialogVisible = true;
        this.auditData.instAuditUser = window.userInfo[0].UserID;
        this.auditData.instID = row.instID;
      } else {
        const instAuditUserID = row.AduitList.map((item, index) => {
          if (item.instAuditUser == window.userInfo[0].UserID) {
            return item.instAuditUser;
          }
        });
        if (!instAuditUserID[0]) {
          this.$message.warning('您没有权限审核该制度');
          return;
        }
        this.auditData.audiDialogVisible = true;
        this.auditData.instAuditUser = window.userInfo[0].UserID;
        this.auditData.instID = row.instID;
      }
    },
    async auditDialog() {
      const data = {
        instID: this.auditData.instID,
        instAuditUser: window.userInfo[0].UserID,
        instAuditState: this.auditData.instAuditState,
        instAduitOpinion: this.auditData.instAduitOpinion
      };
      if (data.instAuditState.length == 0) {
        this.$message.warning('请选择审核结果');
        return;
      }
      try {
        const val = await instAudit(data);
        if (val.code == 200) {
          this.$message.success('审核成功');
          this.auditData.audiDialogVisible = false;
          this.SelectinstHome();
          return;
        }
        this.$message.error(val.msg);
      } catch (error) {
      }
      this.auditData.audiDialogVisible = false;
    },
    Deleteinst(row) {
      if (
        window.userInfo[0].RoleCode != 'R0001' &&
        row.instUpUser != window.userInfo[0].UserID
      ) {
        this.$message.info('只有该制度的上传人和管理员才能删除哦！');
        return;
      }

      this.$confirm('此操作将永久删除该制度, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          Deleteinst({ instIds: row.instID })
            .then(res => {
              if (res.code === 200) {
                this.SelectinstHome();
                this.$message.success('删除成功!');
              }
            })
            .catch(error => {
              this.$message.info('删除失败');
            });
        })
        .catch(() => {
        });
    },

    async ClickUPdateinst() {
      const query = this.rowObject;
      const data = {
        instID: query.instID,
        instTitle: query.instTitle,
        instContent: query.instContent,
        instVesion: query.instVesion,
        instUpUser: query.instUpUser,
        instTypeID: query.instTypeID
      };
      try {
        const val = await UPdateinst(data);
        if (val.code === 200) {
          this.$message.success('修改成功');
        } else {
          this.$message('修改失败');
        }
      } catch (error) {
      }
    },
    // 制度修改end
    addArtical(row) {
      if (!row) {
        /* 数据重置到初始状态 */
        Object.assign(this.$data.listQuery, this.$options.data().listQuery);
        this.uploadBoolean = true;
        this.dialogTitle = '制度上传';
        this.dialogFormVisible = true;

        this.$nextTick(() => {
          this.$refs.TreeID.setDeptorUser([]);
          this.$refs.wangEditUpdate.setContent(' ');
        });
      } else {
        this.uploadBoolean = false;
        if (
          window.userInfo[0].RoleCode != 'R0001' &&
          row.instUpUser != window.userInfo[0].UserID &&
          row.instUpUser != '0'
        ) {
          this.$message.warning('您没有权限修改该制度');
          return;
        }
        // while (row.children.length!==0) {
        //   this.tableTypeData.map((item)=>{
        //     let arry1 = [];
        //     if (row.instTypeName===item.instTypeName){
        //       arry1
        //       break;
        //     }
        //
        //   });
        // }
        this.listQuery.Title = row.instTitle;
        this.listQuery.VersionNumber = row.instVesion;
        this.listQuery.instID = [row.instTypeID];
        this.listQuery.instID2 = row.instID; // 制度ID
        this.listQuery.instTypeName = row.instTypeName;
        this.listQuery.Content = row.instContent == '' ? '' : row.instContent;
        this.listQuery.instAuditUserID = row.AduitList.map(item => {
          return item.instAuditUser;
        });
        this.listQuery.instUpUser = row.instUpUser;
        this.listQuery.instUpUserName = row.instUpUserName;
        this.dialogTitle = '制度修改';


        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs.TreeID.setDeptorUser(this.listQuery.instAuditUserID);
          this.listQuery.Content = this.listQuery.Content
            ? this.listQuery.Content
            : ' ';
          this.$refs.wangEditUpdate.setContent(this.listQuery.Content);
        });
        this.listQueryContrast = JSON.stringify(this.listQuery);
        this.listQuery = JSON.parse(JSON.stringify(this.listQuery));
        this.instAduitUserNoRecord = this.listQuery.instAuditUserID;
        this.instAduitUserNoRecord2 = this.listQuery.instAuditUserID;
        /* 材料预览 */
        /* 初始化数组数据 */
        Object.assign(
          this.$data.listQuery.File_dto,
          this.$options.data().listQuery.File_dto
        );
        this.listQuery.File_dto = [
          ...row.FileList,
          ...Preview(this.listQuery.Content, 'editor')
        ];
      }
    },




    deleteFile_dto(scope) {
      this.listQuery.File_dto.splice(scope.$index, 1);
    },
    getSelectAllArticleGroupValue(value) {
      this.listQuery.GroupID = value;
    },
    async handleCurrentChange(value) {
      this.pagination.pageIndex = value;
      this.SelectinstHome();
    },
    async handleSizeChange(value) {
      this.pagination.pageSize = value;
      this.SelectinstHome();
    },
    async SelectUpUserList() {
      try {
        const data = await SelectUpUserList();
        this.SelectUpUserListData = data.data;
      } catch (error) {
      }
    },
    getSelect(val) {
      this.listQuery.instAduitUser = val;
      this.instAduitUserNoRecord2 = val;
    },

    /* 归档bigin */
    Archive(row) {
      // 下面这个转化是由于归档材料后，他的附件url有/Annex/file，而上传评审资料那里，也加了/Annex/file，所以在归档前去掉/Annex/file
      row.FileList.map((item) => {
        item.FileUrl = item.FileUrl.replace(/Annex\/file\/|\//g, '');
      });
      try {
        this.titleArchive = row.instTitle;
        this.submitData.Title = row.instTitle;
        this.submitData.File_list = row.FileList;
        this.dialogVisibleArchive = true;
        this.formData = row;
      } catch (error) {
        console.log(error);
      }
    },
    nodeClickCatalog(v) {
      this.catalogName = v.CatalogName;
      this.submitData.CatalogID = v.CatalogID;
      this.formData.IsCriterion = v.IsCriterion;
      this.formData.Count = v.Count;
    },
    getSelectAllArticleGroupValue2(v) {
      this.submitData.GroupID = v;
    },
    async InsertArticle() {
      this.uploadEnd = true; // 等待圈开启
      if (
        (this.formData.IsCriterion == 1 || this.formData.Count == 0) &&
        this.submitData.GroupID != 0
      ) {
        const formData = this.formData;
        formData.AduitList.map(item => {
          this.instUpUserName = item.instUpUserName;
          this.instAuditTime = item.instAuditTime;
        });
        console.log(this.formData);
        this.submitData.Content = `<table border="1px solid #666666" style="border-collapse: collapse; " width="100%" align="center">
            <tr align = "center" >
                <th>制度标题</th>
                <th>制度类别</th>
                <th>上传人</th>
                <th>上传时间</th>
                <th>审核人</th>
                <th>审核时间</th>
			      </tr>
            <tr align="center">
                <td>${formData.instTitle || ''}</td>
                <td>${formData.instTypeName || ''}</td>
                <td>${formData.instUpUserName || ''}</td>
                <td>${formData.instUpTime || ''}</td>
                <td>${this.instUpUserName || ''}</td>
                <td>${this.instAuditTime} || ''}</td>
            </tr>
          </table>`;
        try {
          const { msg } = await InsertArticle(this.submitData);
          this.$message.success(msg);
          this.dialogVisibleArchive = false;
          this.uploadEnd = false; // 等待圈关闭
        } catch (error) {
          console.log(error);
        }
        this.cancel();
      } else {
        this.uploadEnd = false; // 等待圈关闭
        this.$notify({
          title: '警告',
          type: 'warning',
          message: '请选择 资料类别和子集评审标准！'
        });
      }
    }
  }
};
</script>
<style lang="scss">
@import "src/styles/loading.scss";

.block {
  height: calc(100vh - 200px);
  overflow: auto;
}

.el-cascader-menu {
  width: 250px;
}

.insitution {
  .el-header,
  .el-footer {
    margin: 0px;
    padding: 0px;
    height: 35px !important;
  }

  .el-main {
    height: calc(100vh - 170px);
    margin: 0px;
    padding: 0px;

    .tree-line {

      .el-tree-node {

        position: relative;
        padding-left: 16px; // 缩进量
      }

      .el-tree-node__children {
        overflow-x: scroll;
        padding-left: 16px; // 缩进量
      }

      // 竖线
      .el-tree-node::before {
        content: '';
        height: 100%;
        width: 1px;
        position: absolute;
        left: -3px;
        top: -26px;
        border-width: 1px;
        border-left: 1px dashed #52627c;
      }

      // 当前层最后一个节点的竖线高度固定
      .el-tree-node:last-child::before {
        height: 38px; // 可以自己调节到合适数值
      }

      // 横线
      .el-tree-node::after {
        content: '';
        width: 24px;
        height: 20px;
        position: absolute;
        left: -3px;
        top: 12px;
        border-width: 1px;
        border-top: 1px dashed #52627c;
      }

      // 去掉最顶层的虚线，放最下面样式才不会被上面的覆盖了
      & > .el-tree-node::after {
        border-top: none;
      }

      & > .el-tree-node::before {
        border-left: none;
      }

      // 展开关闭的icon
      .el-tree-node__expand-icon {
        font-size: 16px;
        // 叶子节点（无子节点）
        &.is-leaf {
          color: transparent;
          // display: none; // 也可以去掉
        }
      }
    }

    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: start;
      font-size: 14px;
      padding-right: 8px;
    }
  }
}
</style>
