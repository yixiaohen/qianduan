<template>
  <div>
    <div class="AdverseEvents_EventTypes">
      <div
        v-if="device === 'mobile'"
        class="main mainMobile"
        style="overflow: auto"
      >
        <div>
          <div slot="header">
            <el-form label-position="left" :inline="true" size="mini">
              <el-form-item>
                <el-button
                  type="success"
                  icon="el-icon-plus"
                  size="mini"
                  @click="eventDialogFunc('事件添加')"
                >添加事件
                </el-button>
              </el-form-item>
              <el-form-item>
                <span>{{ event }}</span>
              </el-form-item>
            </el-form>
          </div>
          <el-table
            border
            :data="eventTableData"
            size="mini"
            style="height: 200px; overflow: auto"
            @row-click="SelectEventTypeByEventID"
          >
            <el-table-column label="事件类型" prop="EventName" />
            <el-table-column label="操作" align="center">
              <template slot-scope="{ row }">
                <el-link
                  icon="el-icon-edit"
                  class="item"
                  @click.stop="eventDialogFunc('编辑', row)"
                >编辑
                </el-link>
                <el-link
                  icon="el-icon-delete"
                  class="item"
                  @click="DeleteEvent(row, 1)"
                >删除
                </el-link>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div>
          <div>
            <el-form label-position="left" :inline="true" size="mini">
              <el-form-item>
                <el-button
                  type="success"
                  icon="el-icon-plus"
                  size="mini"
                  @click="addEventType('新增类别')"
                >新增类别
                </el-button>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  icon="el-icon-delete"
                  size="mini"
                  @click="batchDelete"
                >批量移除事件类别
                </el-button>
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model="eventTypesListQuery.EventTypeName"
                  placeholder="查询事件类别"
                  size="mini"
                  style="widht: 200px"
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  :loading="listLoading"
                  size="mini"
                  @click="clickSelevtEventType"
                />
              </el-form-item>

              <el-form-item>
                <span>{{ eventType }}</span>
              </el-form-item>
            </el-form>
          </div>

          <div>
            <el-table
              v-loading="listLoading"
              class="middleBodyTb"
              :data="eventTypesTableData"
              style="width: 100%; height: 200px; overflow: auto"
              border
              size="mini"
              @selection-change="handleSelectionChange"
              @row-click="getDetails"
            >
              <el-table-column type="index" label="序号" align="center" />
              <el-table-column prop="EventTypeName" label="事件类别" />
              <el-table-column prop="EventName" label="所属事件" />
              <el-table-column label="操作" width="95" align="center">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    circle
                    type="primary"
                    icon="el-icon-edit"
                    @click="handleEdit(scope.row)"
                  />

                  <el-button
                    size="mini"
                    circle
                    type="danger"
                    icon="el-icon-delete"
                    @click="DeleteEventType(scope.row)"
                  />
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
        <div>
          <div>
            <el-form
              class="SelectProblem"
              label-position="left"
              :inline="true"
              size="mini"
            >
              <el-form-item>
                <el-button
                  type="success"
                  icon="el-icon-plus"
                  size="mini"
                  @click="addProblem()"
                >新增问题
                </el-button>
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model="selectProblemName"
                  placeholder="查询所有问题"
                  size="mini"
                  style="widht: 200px"
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  :loading="listLoading"
                  size="mini"
                  @click="SelectProblem"
                />
              </el-form-item>
            </el-form>
          </div>
          <div>
            <el-table
              class="bottomBodyTb"
              :data="SelectProblemData"
              style="width: 100%; height: 200px; overflow: auto"
              border
              size="mini"
            >
              <el-table-column
                type="index"
                label="序号"
                width="50"
                align="center"
              />
              <el-table-column
                label="问题名称"
                prop="ProblemName"
                align="center"
              />
              <el-table-column
                label="问题类型"
                prop="Type"
                align="center"
                width="80"
              >
                <template slot-scope="scope">
                  <span>
                    {{
                      scope.row.Type == 1
                        ? '单选'
                        : scope.row.Type == 2
                          ? '多选'
                          : '填空'
                    }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                label="选项内容"
                prop="OptionList"
                align="center"
              >
                <template slot-scope="scope">
                  <p
                    v-for="(OptionListItem, OptionListIndex) in scope.row
                      .OptionList"
                    :key="OptionListIndex"
                  >
                    {{ OptionListItem.OptionContent }}
                  </p>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="95" align="center">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    circle
                    type="primary"
                    icon="el-icon-edit"
                    @click="editRow(scope.row)"
                  />

                  <el-button
                    size="mini"
                    circle
                    type="danger"
                    icon="el-icon-delete"
                    @click="deleteRow(scope.row)"
                  />
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              :current-page.sync="pagination2.pageIndex"
              :page-size="pagination2.pageSize"
              :page-sizes="pagination2.pageSizes"
              :total="pagination2.total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange2"
              @current-change="handleCurrentChange2"
            />
          </div>
        </div>
      </div>
      <div v-if="device === 'desktop'" class="main">
        <split-pane :min-percent="20" :default-percent="20" split="vertical">
          <template slot="paneL">
            <div class="content_left">
              <div slot="header">
                <el-form label-position="left" :inline="true" size="mini">
                  <el-form-item>
                    <el-button
                      type="success"
                      icon="el-icon-plus"
                      size="mini"
                      @click="eventDialogFunc('事件添加')"
                    >添加事件
                    </el-button>
                  </el-form-item>
                  <el-form-item>
                    <span>{{ event }}</span>
                  </el-form-item>
                </el-form>
              </div>
              <el-table
                border
                :data="eventTableData"
                size="mini"
                @row-click="SelectEventTypeByEventID"
              >
                <el-table-column label="事件类型" prop="EventName" />
                <el-table-column fixed="right" label="操作" align="center">
                  <template slot-scope="{ row }">
                    <el-link
                      icon="el-icon-edit"
                      class="item"
                      @click.stop="eventDialogFunc('编辑', row)"
                    >编辑
                    </el-link>
                    <el-link
                      icon="el-icon-delete"
                      class="item"
                      @click="DeleteEvent(row, 1)"
                    >删除
                    </el-link>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
          <template slot="paneR">
            <div class="content_right">
              <split-pane
                :min-percent="20"
                :default-percent="40"
                split="horizontal"
              >
                <template slot="paneL">
                  <div class="middle">
                    <div>
                      <el-form label-position="left" :inline="true" size="mini">
                        <el-form-item>
                          <el-button
                            type="success"
                            icon="el-icon-plus"
                            size="mini"
                            @click="addEventType('新增类别')"
                          >新增类别
                          </el-button>
                        </el-form-item>
                        <el-form-item>
                          <el-button
                            type="primary"
                            icon="el-icon-delete"
                            size="mini"
                            @click="batchDelete"
                          >批量移除事件类别
                          </el-button>
                        </el-form-item>
                        <el-form-item>
                          <el-input
                            v-model="eventTypesListQuery.EventTypeName"
                            placeholder="查询事件类别"
                            size="mini"
                            style="widht: 200px"
                          />
                        </el-form-item>
                        <el-form-item>
                          <el-button
                            type="primary"
                            icon="el-icon-search"
                            :loading="listLoading"
                            size="mini"
                            @click="clickSelevtEventType"
                          />
                        </el-form-item>

                        <el-form-item>
                          <span>{{ eventType }}</span>
                        </el-form-item>
                      </el-form>
                    </div>

                    <div class="middleBody">
                      <el-table
                        v-loading="listLoading"
                        class="middleBodyTb"
                        :data="eventTypesTableData"
                        style="width: 100%"
                        height="100%"
                        border
                        size="mini"
                        @selection-change="handleSelectionChange"
                        @row-click="getDetails"
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
                          prop="EventTypeName"
                          label="事件类别"
                          width="220"
                        />
                        <el-table-column prop="EventName" label="所属事件" />
                        <el-table-column label="操作" width="95" align="center">
                          <template slot-scope="scope">
                            <el-button
                              size="mini"
                              circle
                              type="primary"
                              icon="el-icon-edit"
                              @click="handleEdit(scope.row)"
                            />

                            <el-button
                              size="mini"
                              circle
                              type="danger"
                              icon="el-icon-delete"
                              @click="DeleteEventType(scope.row)"
                            />
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
                <template slot="paneR">
                  <div class="bottom">
                    <div>
                      <el-form label-position="left" :inline="true" size="mini">
                        <el-form-item>
                          <el-button
                            type="success"
                            icon="el-icon-plus"
                            size="mini"
                            @click="addProblem()"
                          >新增问题
                          </el-button>
                        </el-form-item>
                        <el-form-item>
                          <el-input
                            v-model="selectProblemName"
                            placeholder="查询所有问题"
                            size="mini"
                            style="widht: 200px"
                          />
                        </el-form-item>
                        <el-form-item>
                          <el-button
                            type="primary"
                            icon="el-icon-search"
                            :loading="listLoading"
                            size="mini"
                            @click="SelectProblem"
                          />
                        </el-form-item>
                      </el-form>
                    </div>
                    <div class="bottomBody">
                      <el-table
                        class="bottomBodyTb"
                        :data="SelectProblemData"
                        style="width: 100%"
                        height="100%"
                        border
                        size="mini"
                      >
                        <el-table-column
                          type="index"
                          label="序号"
                          width="50"
                          align="center"
                        />
                        <el-table-column
                          label="问题名称"
                          prop="ProblemName"
                          align="center"
                        />
                        <el-table-column
                          label="问题类型"
                          prop="Type"
                          align="center"
                          width="80"
                        >
                          <template slot-scope="scope">
                            <span>
                              {{
                                scope.row.Type == 1
                                  ? '单选'
                                  : scope.row.Type == 2
                                    ? '多选'
                                    : '填空'
                              }}
                            </span>
                          </template>
                        </el-table-column>
                        <el-table-column
                          label="选项内容"
                          prop="OptionList"
                          align="center"
                        >
                          <template slot-scope="scope">
                            <p
                              v-for="(OptionListItem, OptionListIndex) in scope
                                .row.OptionList"
                              :key="OptionListIndex"
                            >
                              {{ OptionListItem.OptionContent }}
                            </p>
                          </template>
                        </el-table-column>
                        <el-table-column
                          fixed="right"
                          label="操作"
                          width="95"
                          align="center"
                        >
                          <template slot-scope="scope">
                            <el-button
                              size="mini"
                              circle
                              type="primary"
                              icon="el-icon-edit"
                              @click="editRow(scope.row)"
                            />

                            <el-button
                              size="mini"
                              circle
                              type="danger"
                              icon="el-icon-delete"
                              @click="deleteRow(scope.row)"
                            />
                          </template>
                        </el-table-column>
                      </el-table>
                      <el-pagination
                        :current-page.sync="pagination2.pageIndex"
                        :page-size="pagination2.pageSize"
                        :page-sizes="pagination2.pageSizes"
                        :total="pagination2.total"
                        layout="total, sizes, prev, pager, next, jumper"
                        @size-change="handleSizeChange2"
                        @current-change="handleCurrentChange2"
                      />
                    </div>
                  </div>
                </template>
              </split-pane>
            </div>
          </template>
        </split-pane>
      </div>
    </div>
    <el-dialog
      :title="eventName"
      :visible.sync="eventDialogVisible"
      :close-on-click-modal="false"
      :width="device === 'desktop' ? '30%' : '90%'"
    >
      <el-form
        ref="eventFormData"
        size="mini"
        :model="eventFormData"
        :rules="rules"
      >
        <el-form-item label="事件名称" prop="EventName">
          <el-input v-model="eventFormData.EventName" />
        </el-form-item>
        <el-form-item label="事件描述" prop="Description">
          <el-input v-model="eventFormData.Description" type="textarea" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="restEventFormData">取 消</el-button>
        <el-button
          size="mini"
          type="primary"
          :disabled="disabled"
          @click="InsertOrUpdateEvent(0)"
        >确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="eventTypeName"
      :visible.sync="eventTypeDialogVisible"
      :close-on-click-modal="false"
      :width="device === 'desktop' ? '30%' : '90%'"
    >
      <el-form
        ref="eventTypeFormData"
        :rules="rules"
        :model="eventTypeFormData"
        size="mini"
        label-position="top"
      >
        <el-form-item label="事件类别" style="200px" prop="EventTypeName">
          <el-input
            v-model="eventTypeFormData.EventTypeName"
            placeholder="事件类别名称"
          />
        </el-form-item>
        <el-form-item label="分配到事件">
          <el-select
            v-model="EventSelect.EventName"
            clearable
            filterable
            placeholder="请选择"
            popper-class="selectJob"
            @change="selectEventID"
          >
            <el-option
              v-for="item in EventSelect.options"
              :key="item.value"
              v-loading="EventLoading"
              :label="item.EventName"
              :value="item.EventID"
            />
            <div>
              <el-pagination
                :current-page.sync="EventSelect.pageIndex"
                :page-size="EventSelect.pageSize"
                :page-sizes="[5, 10, 15, 20]"
                :total="EventSelect.total"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="EventSelectSizeChange"
                @current-change="EventSelectCurrentChange"
              />
            </div>
          </el-select>
        </el-form-item>
        <el-form-item label="默认分流部门" style="200px">
          <defaultDepts
            ref="dept2"
            :multiple="false"
            :value="EventSelect.EventDept"
            @getDefaultDeptsValue="getDefaultDeptValues"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          size="mini"
          @click="eventTypeDialogVisible = false"
        >取 消
        </el-button>
        <el-button
          type="primary"
          size="mini"
          :disabled="disabled"
          @click="InsertEventType(0)"
        >确 定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="ProblemName"
      :visible.sync="ProblemDialogVisible"
      :close-on-click-modal="false"
      :width="device === 'desktop' ? '30%' : '90%'"
    >
      <el-form
        ref="ProblemData"
        :rules="rules2"
        :model="ProblemData"
        size="mini"
        label-position="top"
        style="height: 450px; overflow: auto"
      >
        <el-form-item label="问题名称" prop="ProblemName" widht="200px">
          <el-input v-model="ProblemData.ProblemName" widht="200px" />
        </el-form-item>
        <el-form-item label="问题类别" prop="types" widht="200px">
          <el-select
            v-model="ProblemData.types"
            placeholder="请选择问题类别"
            @change="ProblemDataChange"
          >
            <el-option label="单选" value="1" />
            <el-option label="多选" value="2" />
            <el-option label="填空" value="3" />
          </el-select>
        </el-form-item>

        <el-form-item label="事件类别" prop="SelevtEventType" widht="200px">
          <el-select
            v-model="ProblemData.EventTypeNames"
            clearable
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请选择"
            popper-class="selectJob"
            @focus="SelevtEventTypeOption(1)"
          >
            <el-option
              v-for="(
                EventTypeItem, SelevtEventTypeIndex
              ) in ProblemData.SelevtEventType"
              :key="SelevtEventTypeIndex"
              v-loading="EventTypelLstLoading"
              :label="EventTypeItem.EventTypeName"
              :value="EventTypeItem.EventTypeID"
            />
            <div>
              <el-pagination
                background
                :current-page.sync="ProblemData.pageIndex"
                :page-size="ProblemData.pageSize"
                :page-sizes="[5, 10, 15, 20]"
                :total="ProblemData.total"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="EventTypeSelectSizeChange"
                @current-change="EventTypeSelectCurrentChange"
              />
            </div>
          </el-select>
        </el-form-item>
        <el-form-item
          v-for="item in formItems"
          :key="item.id"
          label="选项内容"
          widht="200px"
        >
          <el-input
            v-model="item.OptionContent"
            class="text-input-center span"
            widht="200px"
          >
            <el-button
              slot="append"
              icon="el-icon-delete"
              @click="delFormItems(item.id, 'formItems')"
            />
            -->
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="mini"
          @click="addFormItems('formItems')"
        >添加选项</el-button>
        <el-button
          size="mini"
          @click="
            ProblemDialogVisible = false
            disabled = false
          "
        >取 消</el-button>
        <el-button
          size="mini"
          type="primary"
          :disabled="disabled"
          @click="InsertOrUpdatetProblem(1)"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import splitPane from 'vue-splitpane';
import { uuid } from '@/utils';
import defaultDepts from '@/views/components/defaultDepts';
import { mapGetters } from 'vuex';
import {
  DeleteEvent,
  DeleteEventTypes,
  DeleteProblem,
  InsertEventType,
  InsertOrUpdateEvent,
  InsertOrUpdateProblem,
  SelectEvent,
  SelectEventTypeByEventID,
  SelectProblem,
  SelectProblemByEventTypeID,
  SelevtEventType
} from '@/api/AE_Event';

export default {
  name: 'AdverseEventsEventTypes',
  components: { splitPane, defaultDepts },
  data() {
    return {
      EventTypelLstLoading: false,
      EventLoading: false,
      event: '',
      eventType: '',
      disabled: false,
      listLoading: false,
      eventDialogVisible: false,
      eventTypeDialogVisible: false,
      ProblemDialogVisible: false,
      eventName: '',
      eventTypeName: '',
      eventListQuery: {
        pageIndex: 1,
        pageSize: 100,
        EventName: ''
      },
      eventTableData: [],
      eventFormData: {
        EventID: 0,
        EventName: '',
        Description: '',
        CreateUserID: window.userInfo[0].UserID
      },
      eventTypeFormData: {
        EventTypeID: 0,
        EventTypeName: '',
        EventID: 0,
        EventDept: ''
      },
      EventID: 0,
      rules: {
        EventName: [
          { required: true, message: '请填写事件名称', trigger: 'blur' }
        ],
        Description: [
          { required: true, message: '请填写事件描述', trigger: 'blur' }
        ],
        EventTypeName: [
          {
            required: true,
            message: '请填写事件类型',
            trigger: 'EventTypeName'
          }
        ]
      },
      rules2: {
        ProblemName: [
          { required: true, message: '请填问题名称', trigger: 'blur' }
        ],
        types: [{ required: true, message: '请填写问题类型', trigger: 'blur' }],
        OptionContent: [
          {
            required: true,
            message: '请填写选项内容',
            trigger: 'blur'
          }
        ]
      },
      rules3: {
        ProblemName: [
          { required: true, message: '请填问题名称', trigger: 'blur' }
        ],
        types: [{ required: true, message: '请填写问题类型', trigger: 'blur' }],
        OptionContent: [
          {
            required: true,
            message: '请填写选项内容',
            trigger: 'blur'
          }
        ]
      },
      eventTypesTableData: [],
      eventTypesListQuery: {
        EventTypeID: 0,
        EventTypeName: '',
        EventID: 0,
        pageSize: 15,
        pageIndex: 1
      },
      pagination: {
        pageIndex: 1,
        total: 0,
        pageSize: 15,
        pageSizes: [15, 20, 50, 100, 150, 200]
      },
      pagination2: {
        pageIndex: 1,
        total: 0,
        pageSize: 5,
        pageSizes: [5, 10, 15, 20, 50, 100, 150, 200],
        ProblemName: '',
        Type: ''
      },
      SelectProblemData: [],
      EventSelect: {
        value: '',
        options: '',
        pageIndex: 1,
        pageSize: 20,
        total: 20,
        EventName: '',
        ProblemID: 0,
        EventDept: ''
      },
      EventTypeIDarr: [],
      middlePercent: 40,
      ProblemData: {
        EventTypeNames: '',
        ProblemName: '',
        types: '',
        OptionContent: '',
        ProblemID: '',
        SelevtEventType: '',
        pageIndex: 1,
        pageSize: 5,
        total: 0
      },
      ProblemData2: {
        EventTypeName: '',
        ProblemName: '',
        types: '',
        OptionContent: '',

        SelevtEventType: '',
        pageIndex: 1,
        pageSize: 5,
        total: 0
      },
      ProblemName: '修改',
      formItems: [
        {
          id: uuid(),
          ID: 0,
          OptionContent: '',
          OptionID: 0,
          ProblemID: 0
        }
      ],
      selectProblemName: '',
      dept_value: ''
    };
  },
  computed: {
    ...mapGetters(['device'])
  },
  created() {
    this.SelectEvent();
    this.SelevtEventType();
    this.SelectEventDialog();
  },
  mounted() {
    this.SelectProblem();
  },
  methods: {
    handleSelectionChange(val) {
      this.EventTypeIDarr = val.map((item, index) => {
        return item.EventTypeID;
      });
    },
    InsertEventType() {
      if (!this.EventSelect.EventName) {
        this.$message.warning('请您选择事件!');
        return;
      }
      this.$refs.eventTypeFormData.validate(async valid => {
        if (valid) {
          const eventTypeFormData = {
            ...this.eventTypeFormData,
            EventID: this.EventID
          };
          this.disabled = true;
          try {
            const { msg } = await InsertEventType(eventTypeFormData);
            this.$message.success(msg);
            this.clickSelevtEventType();
            this.restEventFormData();
          } catch (error) {
          } finally {
            this.disabled = false;
          }

          this.disabled = false;
        } else {
          return false;
        }
      });
    },
    addEventType(eventTypeName) {
      // this.SelectEventDialog();
      this.eventTypeFormData.EventTypeName = '';
      this.EventSelect.EventName = '';
      this.eventTypeName = eventTypeName;
      this.eventTypeDialogVisible = true;
    },
    DeleteEvent(row) {
      this.$confirm(`此操作将永久删除 ${row.EventName} , 是否继续?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          try {
            const { msg } = await DeleteEvent({
              EventID: row.EventID
            });
            this.$message.success(msg);
            this.SelectEvent();
          } catch (error) {
          }
        })
        .catch(e => e);
    },
    DeleteEventType(row) {
      this.$confirm(`此操作将永久删除, 是否继续?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          this.EventTypeIDarr.push(row.EventTypeID);
          this.DeleteEventTypes();
          this.EventTypeIDarr = [];
        })
        .catch(e => console.log(e));
    },
    batchDelete() {
      if (this.EventTypeIDarr.length < 1) {
        this.$message.warning('请勾选要删除的类别');
        return;
      }
      this.$confirm(`此操作将永久删除, 是否继续?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          this.DeleteEventTypes();
        })
        .catch(e => console.log(e));
    },
    async DeleteEventTypes() {
      const val = {
        EventTypeIDArray: this.EventTypeIDarr
      };
      try {
        const data = await DeleteEventTypes(val);
        this.$message.success(data.msg);
        this.SelevtEventType();
      } catch (error) {
      }
    },
    eventDialogFunc(eventName, row) {
      this.eventName = eventName;
      this.eventFormData.EventID = 0;
      this.EventID = 0;
      if (eventName === '编辑') {
        this.eventName = eventName + ':' + row.EventName;
        this.eventFormData = { ...row, EventID: row.EventID };
      }
      this.eventDialogVisible = true;
    },
    restEventFormData() {
      this.eventFormData = {
        EventID: 0,
        EventName: '',
        Description: '',
        CreateUserID: window.userInfo[0].UserID
      };
      this.eventTypeFormData = {
        EventTypeID: 0,
        EventTypeName: '',
        EventID: 0
      };
      this.eventDialogVisible = false;
      this.eventTypeDialogVisible = false;
    },
    InsertOrUpdateEvent(type = 0) {
      this.$refs.eventFormData.validate(async valid => {
        if (valid) {
          this.disabled = true;
          const eventFormData = { ...this.eventFormData };
          try {
            const { msg } = await InsertOrUpdateEvent(eventFormData);
            this.$message.success(msg);
            this.SelectEvent();
            this.restEventFormData();
          } catch (error) {
            this.disabled = false;
          }
        } else {
          return false;
        }
      });
    },
    async SelectEvent() {
      try {
        const { data } = await SelectEvent(this.eventListQuery);
        this.eventTableData = data.DataList;
        this.EventSelect.total = data.Total;
        this.EventSelect.options = data.DataList;
      } catch (error) {
        console.log(error);
      } finally {
        this.listLoading = false;
      }
    },
    async SelevtEventType() {
      try {
        this.listLoading = true;
        const { data } = await SelevtEventType(this.eventTypesListQuery);
        this.eventTypesTableData = data.DataList;
        this.pagination.total = data.Total;
      } catch (error) {
        console.log(error);
      } finally {
        this.listLoading = false;
      }
    },
    async clickSelevtEventType() {
      this.pagination.pageIndex = 1;
      this.SelevtEventType();
    },
    handleCurrentChange(index) {
      this.eventTypesListQuery.pageIndex = index;
      this.SelevtEventType();
    },
    handleSizeChange(page) {
      this.eventTypesListQuery.pageSize = page;
      this.clickSelevtEventType();
    },

    handleCurrentChange2(index) {
      this.pagination2.pageIndex = index;
      this.SelectProblem();
    },
    handleSizeChange2(page) {
      this.pagination2.pageSize = page;
      this.SelectProblem();
    },

    async SelectEventDialog() {
      const EventSelect = {
        pageIndex: this.EventSelect.pageIndex,
        pageSize: this.EventSelect.pageSize
      };
      this.EventLoading = true;
      try {
        const data = await SelectEvent(EventSelect);
        this.EventSelect.total = data.data.Total;
        this.EventSelect.options = data.data.DataList;
      } catch (error) {
      } finally {
        this.EventLoading = false;
      }
    },
    selectEventID(val) {
      this.EventID = val;
    },
    EventSelectSizeChange(val) {
      this.EventSelect.pageSize = val;
      this.SelectEventDialog();
    },

    EventSelectCurrentChange(val) {
      this.EventSelect.pageIndex = val;
      this.SelectEventDialog();
    },
    handleEdit(row) {
      // this.SelectEvent();
      this.SelevtEventTypeOption();
      this.eventTypeName = '修改事件类别';
      this.eventTypeDialogVisible = true;
      this.eventTypeFormData.EventTypeName = row.EventTypeName;
      this.eventTypeFormData.EventTypeID = row.EventTypeID;
      this.EventSelect.EventName = row.EventID;
      this.EventSelect.EventTypeID = row.EventTypeID;
      this.EventSelect.EventDept = row.EventDept;
      this.ProblemData.EventTypeNames = row.EventTypeIDArray;
    },
    async SelectProblem() {
      const val = {
        pageIndex: this.pagination2.pageIndex,
        pageSize: this.pagination2.pageSize,
        ProblemName: this.selectProblemName
      };
      try {
        const data = await SelectProblem(val);
        this.SelectProblemData = data.data.DataList;
        this.pagination2.total = data.data.Total;
      } catch (error) {
      }
    },
    addProblem() {
      this.formItems = [
        {
          id: uuid(),
          ID: 0,
          OptionContent: '',
          OptionID: 0,
          ProblemID: 0
        }
      ];
      this.ProblemData.ProblemName = '';
      this.ProblemData.types = '';
      this.ProblemData.ProblemID = 0;
      this.EventSelect.EventName = '';
      this.EventSelect.EventTypeID = '';
      this.ProblemName = '新增问题';
      this.ProblemData.EventTypeNames = [];
      this.ProblemDialogVisible = true;
    },

    editRow(row) {
      this.SelevtEventTypeOption(1);
      this.ProblemData.ProblemName = row.ProblemName;
      this.ProblemData.ProblemID = row.ProblemID;
      this.formItems = row.OptionList;
      this.ProblemData.types = row.Type;
      this.ProblemData.EventTypeNames;
      this.ProblemData.EventTypeNames = [];
      this.ProblemData.EventTypeNames = row.EventTypeIDArray;
      this.ProblemDialogVisible = true;
    },
    deleteRow(row) {
      this.$confirm(`此操作将永久删除, 是否继续?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const ProblemID = row.ProblemID;
          try {
            const { msg } = await DeleteProblem({ ProblemID });
            this.$message.success(msg);
            this.SelectProblem();
          } catch (error) {
          }
        })
        .catch(e => console.log(e));
    },
    async InsertOrUpdatetProblem() {
      if (this.ProblemData.types != 3) {
        if (!this.formItems[0].OptionContent) {
          this.$message.error('请至少填写一个选项');
          return;
        }
      }
      const val = {
        ProblemID: this.ProblemData.ProblemID,
        ProblemName: this.ProblemData.ProblemName,
        Type: this.ProblemData.types,
        OptionList: [...this.formItems],
        EventTypeIDArray: this.ProblemData.EventTypeNames
      };
      try {
        this.disabled = true;
        const { msg } = await InsertOrUpdateProblem(val);
        this.$message.success(msg);
        this.SelectProblem();
        this.ProblemDialogVisible = false;
      } catch {
      } finally {
        this.disabled = false;
      }
    },
    SelevtEventTypeID() {
    },
    addFormItems(formInfo) {
      this[formInfo].push({
        id: uuid(),
        ID: 0,
        OptionContent: '',
        OptionID: 0,
        ProblemID: 0
      });
    },
    delFormItems(id, formInfo) {
      this[formInfo].forEach((item, index) => {
        if (item.id === id) {
          this[formInfo].splice(index, 1);
        }
      });
    },
    async getDetails(row) {
      this.eventType = row.EventTypeName;
      const val = {
        pageIndex: this.pagination2.pageIndex,
        pageSize: this.pagination2.pageSize,
        EventTypeID: row.EventTypeID
      };
      try {
        const data = await SelectProblemByEventTypeID(val);
        this.SelectProblemData = data.data;
      } catch (error) {
      }

      // this.pagination2.total = data.data;
    },
    eventTableDataRowClick(row) {
      this.eventName = row.EventName;
      this.EventID = row.EventID;
    },
    async SelectEventTypeByEventID(row) {
      this.event = row.EventName;
      const EventID = row.EventID;
      try {
        const data = await SelectEventTypeByEventID({ EventID });
        this.eventTypesTableData = data.data;
      } catch (error) {
      }

      // this.pagination.total = data.Total;
    },
    async SelevtEventTypeOption(val) {
      // if (typeof this.ProblemData.EventTypeNames == "object") {
      //   this.ProblemData.EventTypeNames = "";
      // }
      if (val === 1) {
        const val2 = {
          pageIndex: this.ProblemData.pageIndex,
          pageSize: this.ProblemData.pageSize,
          EventTypeName: ''
        };
        this.EventTypelLstLoading = true;
        try {
          const data = await SelevtEventType(val2);
          this.ProblemData.SelevtEventType = data.data.DataList;
          this.ProblemData.total = data.data.Total;
        } catch (error) {
          this.EventTypelLstLoading = false;
        }
      } else if (val === 2) {
        const val2 = {
          pageIndex: this.ProblemData2.pageIndex,
          pageSize: this.ProblemData2.pageSize,
          EventTypeName: this.ProblemData2.EventTypeName
        };
        try {
          const data = await SelevtEventType(val2);
          this.ProblemData2.SelevtEventType = data.data.DataList;
          this.ProblemData2.total = data.data.Total;
        } catch (error) {
        }
      }
    },
    EventTypeSelectSizeChange(val) {
      this.ProblemData.pageSize = val;
    },
    EventTypeSelectCurrentChange(val) {
      this.ProblemData.pageIndex = val;
    },
    ProblemDataChange(val) {
      if (val == 3) {
        this.formItems = [];
      } else {
        this.formItems = [
          {
            id: uuid(),
            ID: 0,
            OptionContent: '',
            OptionID: 0,
            ProblemID: 0
          }
        ];
      }
    },
    /* 默认分流部门 */
    getDefaultDeptValues(value) {
      this.eventTypeFormData.EventDept = value;
    }
  }
};
</script>
<style lang="scss">
.AdverseEvents_EventTypes {
  margin: 4px;

  .mainMobile {
    .el-table-filter {
      max-height: 300px;
      overflow: auto !important;
    }

    .SelectProblem {
      .el-button--mini {
        padding: 7px 10px;
      }
    }
  }

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
          height: calc(100% - 30px);
          overflow-y: hidden;

          .bottomBodyTb {
            max-height: calc(100% - 30px);
          }
        }
      }
    }
  }

  .htmlPane {
    height: 400px;
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
}
</style>
