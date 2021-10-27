<template>
  <div style="height: 100%; overflow: auto">
    <el-table
      :key="symbolKey"
      v-loading="loading"
      :data="targertTreeData"
      style="width: 100%"
      :row-key="getRowKeys"
      height="calc(40vh)"
      default-expand-all
      border
      :tree-props="{ children: 'Children', hasChildren: 'hasChilder' }"
      size="mini"
      @row-click="SelectResult"
    >
      <el-table-column label="目标" prop="ObjectName" />
      <el-table-column label="内容/备注" prop="ObjectContent" />
      <el-table-column
        label="权重比"
        prop="WeightRatio"
        width="80"
        align="center"
      >
        <template slot-scope="{ row }">
          <span
            v-if="
              !row.ResultName &&
                row.Children.length === 0 &&
                cyclerow.ObjectType != 2
            "
          >
            {{ row.WeightRatio }}
          </span></template>
      </el-table-column>
      <el-table-column
        label="信心指数"
        prop="Confidence"
        align="center"
        width="150"
      ><template slot-scope="{ row }">
        <el-rate
          v-model="row.Confidence"
          :colors="colors"
          disabled
          show-score
        /> </template></el-table-column>
      <el-table-column
        label="成果数量"
        prop="ResultCount"
        align="center"
        width="70"
      >
        <template slot-scope="{ row }">{{ row.ResultCount || 0 }}</template>
      </el-table-column>
      <el-table-column
        label="对齐数量"
        prop="AlignCount"
        align="center"
        width="70"
      ><template slot-scope="{ row }">{{
        row.AlignCount || 0
      }}</template></el-table-column>
      <el-table-column label="对齐目标" width="70" align="center">
        <template slot-scope="{ row }">
          <i
            v-if="
              !row.ResultName &&
                row.Children.length === 0 &&
                cyclerow.ObjectType != 2
            "
            class="el-icon-share"
            style="width: 2em; height: 2em"
            @click="alignTarget(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="添加子目标" width="95" align="center">
        <template slot-scope="{ row }">
          <el-button
            v-if="
              !row.ResultName && row.ResultCount === 0 && row.AlignCount === 0
            "
            type="text"
            icon="el-icon-plus"
            size="mini"
            @click="addDcope(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="添加成果" width="95" align="center">
        <template slot-scope="{ row }">
          <el-button
            v-if="!row.ResultName && row.Children.length === 0"
            type="text"
            icon="el-icon-plus"
            size="mini"
            @click="addResult(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="查看成果" width="70" align="center">
        <template slot-scope="{ row }">
          <i
            v-if="!row.ResultName && row.Children.length === 0"
            class="el-icon-view"
            @click="SelectResult(row)"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" width="120" fixed="right">
        <template slot-scope="{ row }">
          <el-button
            style="margin-left: 10px"
            icon="el-icon-edit"
            size="mini"
            type="primary"
            circle
            @click="EditObject(row)"
          />
          <el-popconfirm
            style="margin-right: 3px"
            confirm-button-text="是"
            cancel-button-text="否"
            icon="el-icon-info"
            icon-color="red"
            title="确定删除吗？"
            @confirm="DeleteObject(row)"
          >
            <el-button
              slot="reference"
              type="danger"
              icon="el-icon-delete"
              circle
              size="mini"
            />
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div style="display: flex">
      <el-button
        type="text"
        icon="el-icon-plus"
        size="mini"
        @click="addTarget()"
      >添加目标</el-button>
      <el-divider>当前目标：{{ ObjectText }}</el-divider>
    </div>
    <el-table
      v-loading="loading"
      :data="ResultTableData"
      style="width: 100%"
      :row-key="getRowKeysResult"
      :expand-row-keys="expands"
      height="calc(40vh)"
      border
      size="mini"
      @expand-change="expandChange"
    >
      <el-table-column type="expand">
        <template slot-scope="{ $index }">
          <el-table
            v-if="expandChangeIndex === $index && ResultTableData.length > 0"
            :data="taskTableData"
            border
            style="width: 100%; margin-left: 47px"
            size="mini"
          >
            <el-table-column prop="Title" label="任务名称" />
            <el-table-column prop="TaskDescribe" label="任务描述" />
            <el-table-column
              prop="Priority"
              label="优先级"
              align="center"
              width="90"
            />
            <el-table-column
              prop="address"
              label="状态"
              align="center"
              width="90"
            />
            <el-table-column
              prop="CompletedProgress"
              label="进度"
              align="center"
              width="120"
            >
              <template slot-scope="{ row }">
                <el-progress
                  :text-inside="true"
                  :stroke-width="18"
                  :percentage="row.CompletedProgress"
                  :color="customColorMethod"
                  status="success"
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="EndDate"
              label="截止时间"
              align="center"
              width="150"
            >
              <template slot-scope="{ row }">
                {{ row.EndDate ? row.EndDate.replace('T00:00:00', '') : '' }}
              </template>
            </el-table-column>
            <el-table-column
              prop="PlanHours"
              label="计划工时"
              align="center"
              width="150"
            />
            <el-table-column width="150">
              <template slot-scope="{ row }">
                <el-button
                  icon="el-icon-edit"
                  size="mini"
                  circle
                  type="primary"
                  @click="EditTask(row)"
                />
                <el-popconfirm
                  style="margin-left: 3px"
                  confirm-button-text="是"
                  cancel-button-text="否"
                  icon="el-icon-info"
                  icon-color="red"
                  title="确定删除吗？"
                  @confirm="DeleteTask(row)"
                >
                  <el-button
                    slot="reference"
                    type="danger"
                    icon="el-icon-delete"
                    circle
                    size="mini"
                  />
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="成果描述" prop="ResultName" />
      <el-table-column
        label="权重比"
        prop="WeightRatio"
        width="80"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>
            {{ row.WeightRatio }}
          </span></template>
      </el-table-column>
      <el-table-column
        label="信心指数"
        prop="Confidence"
        align="center"
        width="150"
      ><template slot-scope="{ row }">
        <el-rate
          v-model="row.Confidence"
          :colors="colors"
          disabled
          show-score
        /> </template></el-table-column>
      <el-table-column label="进度" width="120" align="center">
        <template slot-scope="{ row }">
          <el-progress
            :text-inside="true"
            :stroke-width="18"
            :percentage="row.Schedule"
            :color="customColorMethod"
            status="success"
          />
        </template>
      </el-table-column>
      <el-table-column label="添加任务" align="center" width="80">
        <template slot-scope="{ row }">
          <el-button
            type="success"
            icon="el-icon-plus"
            size="mini"
            circle
            @click="addTask(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="内容备注" prop="ResultName" />
      <el-table-column align="center" width="120" fixed="right">
        <template slot-scope="{ row }">
          <el-button
            style="margin-left: 10px"
            icon="el-icon-edit"
            size="mini"
            type="primary"
            circle
            @click="EditResult(row)"
          />
          <el-popconfirm
            style="margin-left: 3px"
            confirm-button-text="是"
            cancel-button-text="否"
            icon="el-icon-info"
            icon-color="red"
            title="确定删除吗？"
            @confirm="DeleteResult(row)"
          >
            <el-button
              slot="reference"
              type="danger"
              icon="el-icon-delete"
              circle
              size="mini"
            />
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 如果你觉得这个业务放到组件里不爽，你可以自己改 -->
    <el-dialog
      :title="addTargetDialogTitle"
      :visible.sync="addTargetDialog"
      :width="device === 'mobile' ? '90%' : '30%'"
    >
      <el-form label-position="top" label-width="100px" size="mini">
        <el-form-item label="目标名称">
          <el-input v-model="addTargetFrom.ObjectName" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="addTargetFrom.ObjectContent" type="textarea" />
        </el-form-item>
        <el-form-item label="权重比">
          <el-input
            v-model="addTargetFrom.WeightRatio"
            type="number"
            maxlength="3"
          ><i slot="suffix" style="margin-right: 10px">%</i></el-input>
        </el-form-item>
        <el-form-item label="信心">
          <el-rate v-model="addTargetFrom.Confidence" :colors="colors" />
        </el-form-item>
      </el-form>
      <span>
        <el-button
          size="small"
          @click="addTargetDialog = false"
        >取 消</el-button>
        <el-button
          type="primary"
          size="small"
          @click="InsertObject"
        >确 定</el-button>
      </span>
    </el-dialog>

    <el-drawer
      :visible.sync="alignDrawer"
      :before-close="handleClose"
      size="40%"
      direction="rtl"
      :with-header="false"
    >
      <div class="Drawer_">
        <div class="Drawer_Align">
          <p>目标对齐</p>
          <div
            v-for="(item, index) in CycleDataTree"
            :key="index"
            class="target"
          >
            <p>
              {{ item.CycleName }}({{
                item.ObjectType === 0
                  ? '个人级'
                  : item.ObjectType === 1
                    ? '团队/科室'
                    : '院级'
              }})
            </p>
            <targetAlign
              ref="targetAlign"
              :data-align-object="item.Object_list"
              :default-checked-keys="item.ParentIDArray"
              @CheckChange="CheckChange"
            />
          </div>
        </div>
        <div class="Drawer_footer">
          <el-button
            type="primary"
            size="small"
            @click="InsertAligning"
          >确认</el-button>
          <el-button
            type="danger"
            size="small"
            @click="alignDrawer = false"
          >取消</el-button>
        </div>
      </div>
    </el-drawer>
    <el-drawer
      :with-header="false"
      :visible.sync="drawerWork"
      size="50%"
      :direction="drawerWorkCtl.direction"
    >
      <span style="font-size: 18px; margin: 5px">
        成果：{{ drawerWorkCtl.title }}
      </span>
      <div
        :style="drawerWorkCtl.style"
        style="height: calc(100vh - 60px); overflow: auto"
      >
        <el-collapse v-model="activeNames">
          <el-collapse-item :title="taskDrawerTitle" name="添加任务">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span style="margin-right: 10px">任务时间:</span>
                <el-date-picker
                  v-model="dateTaskStartEnd"
                  type="daterange"
                  align="right"
                  size="mini"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="截止日期"
                  :picker-options="pickerOptions"
                />
                <span class="text" style="margin: 0px 10px">优先级</span>
                <el-input-number
                  v-model="addTaskFrom.Priority"
                  :min="1"
                  :max="10"
                  size="mini"
                  style="width: 90px"
                />
              </div>
              <el-tabs value="first">
                <el-tab-pane label="基本信息" name="first">
                  <el-row>
                    任务标题：
                    <el-input
                      v-model="addTaskFrom.Title"
                      :rows="2"
                      size="mini"
                      placeholder="请输入标题"
                    />
                  </el-row>
                  <el-row>
                    描述：
                    <el-input
                      v-model="addTaskFrom.TaskDescribe"
                      type="textarea"
                      :rows="2"
                      placeholder="请输入任务描述"
                    />
                  </el-row>
                  <el-row>
                    完成进度：
                    <div class="block">
                      <el-slider
                        v-model="addTaskFrom.CompletedProgress"
                        show-input
                        input-size="mini"
                        :marks="{ 50: '50%' }"
                      />
                    </div>
                  </el-row>
                  <div v-if="wordDrawerFm.link">
                    <el-row>
                      <el-col :span="1"><i class="el-icon-time" /></el-col>
                      <el-col :span="6">完成占比</el-col>
                      <el-col :span="17">
                        <el-input-number
                          v-model="addTaskFrom.Proportion"
                          controls-position="right"
                          :min="1"
                          size="mini"
                        />%
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="1"><i class="el-icon-time" /></el-col>
                      <el-col :span="6">计划工时</el-col>
                      <el-col :span="17">
                        <el-input-number
                          v-model="addTaskFrom.PlanHours"
                          controls-position="right"
                          :min="1"
                          size="mini"
                        />小时
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="1"><i class="el-icon-user" /></el-col>
                      <el-col
                        :span="6"
                      >参与人数：{{
                        addTaskFrom.Participant
                          ? addTaskFrom.Participant.split(',').length
                          : 0
                      }}</el-col>
                      <el-col :span="17">
                        <el-button
                          type="primary"
                          icon="el-icon-plus"
                          circle
                          size="mini"
                          style="padding: 1px !important"
                          @click="people('参与人', addTaskFrom.Participant)"
                        />
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="1"><i class="el-icon-s-check" /></el-col>
                      <el-col
                        :span="6"
                      >审批人数：
                        {{
                          addTaskFrom.AuditUser
                            ? addTaskFrom.AuditUser.split(',').length
                            : 0
                        }}
                      </el-col>
                      <el-col :span="17">
                        <el-button
                          type="primary"
                          icon="el-icon-plus"
                          circle
                          size="mini"
                          style="padding: 1px !important"
                          @click="people('审核人', addTaskFrom.AuditUser)"
                        />
                      </el-col>
                    </el-row>
                    <!-- <el-row>
                  <el-col :span="1"><i class="el-icon-view" /></el-col>
                  <el-col :span="6">可见范围</el-col>
                  <el-col :span="17">全公司</el-col>
                </el-row> -->
                  </div>
                </el-tab-pane>
                <el-tab-pane label="附件" name="second">
                  <el-upload
                    :multiple="true"
                    :show-file-list="true"
                    :on-success="handleSuccess"
                    class="editor-slide-upload"
                    :file-list="fileList"
                    action="/api/RC_File/UploadFile"
                  >
                    <el-button size="mini" type="primary">选择文件</el-button>
                  </el-upload>
                  <filePreview :preview-data="addTaskFrom.File_list" />
                </el-tab-pane>
              </el-tabs>
            </el-card>
          </el-collapse-item>
          <el-collapse-item title="其他事项" name="其他事项">
            <el-input
              v-model="addTaskFrom.Describes"
              type="textarea"
              :rows="2"
              placeholder="请输入"
            />
          </el-collapse-item>
        </el-collapse>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="drawerWork = false">取 消</el-button>
          <el-button
            type="primary"
            size="small"
            @click="
              taskDrawerTitle === '添加任务' ? InsertTask() : UpdateTask()
            "
          >提交</el-button>
        </div>
      </div>
    </el-drawer>
    <el-dialog
      :title="addResultDialogTitle"
      :visible.sync="addResultDialog"
      :width="device === 'mobile' ? '90%' : '30%'"
    >
      <el-form label-position="top" label-width="100px" size="mini">
        <el-form-item label="成果描述">
          <el-input v-model="addResultFrom.ResultName" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="addResultFrom.Remark" type="textarea" />
        </el-form-item>
        <el-form-item label="权重比">
          <el-input
            v-model="addResultFrom.WeightRatio"
            type="number"
            maxlength="3"
          ><i slot="suffix" style="margin-right: 10px">%</i></el-input>
        </el-form-item>
        <el-form-item label="信心">
          <el-rate v-model="addResultFrom.Confidence" :colors="colors" />
        </el-form-item>
        <el-form-item>
          <el-upload
            :multiple="true"
            :show-file-list="true"
            :on-success="handleSuccessResult"
            class="editor-slide-upload"
            :file-list="fileList"
            action="/api/RC_File/UploadFile"
          >
            <el-button size="mini" type="primary">选择文件</el-button>
          </el-upload>
          <filePreviewResult :preview-data="addResultFrom.File_list" />
        </el-form-item>
      </el-form>
      <span>
        <el-button
          size="small"
          @click="addResultDialog = false"
        >取 消</el-button>
        <el-button
          type="primary"
          size="small"
          @click="InsertResult"
        >确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="人员选择"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      :width="device === 'desktop' ? '55%' : '90%'"
    >
      <select-deptor-user
        ref="userTree"
        :value="`资料录入员分配`"
        @getSelectDeptorUser="getSelectDeptorUser"
      />
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          size="mini"
          @click="dialogVisible = false"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { DeleteObject, InsertObject, SelectObject, UpdateObject } from '@/api/okr/object';
import { mapGetters } from 'vuex';
import targetAlign from '@/views/components/okr/targetAlign.vue';
import { InsertAligning, SelectAlignObject } from '@/api/okr/aligning';
import { parseTime } from '@/utils/index';
import filePreview from '@/views/components/file/filePreview';
import filePreviewResult from '@/views/components/file/filePreview';
import { DeleteTask, InsertTask, SelectTask, SelectTaskByID, UpdateTask } from '@/api/okr/task';
import { DeleteResult, InsertResult, SelectResult, UpdateResult } from '@/api/okr/Result';
import SelectDeptorUser from '@/views/components/SelectDeptorUser';
import { SelectFile } from '@/api/okr/file';

export default {
  components: {
    targetAlign,
    SelectDeptorUser,
    filePreview,
    filePreviewResult
  },
  props: {
    targertTreeData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    rowObjectID: {
      type: Object,
      default: () => {
        return {};
      }
    },
    cyclerow: {
      /* 当前周期 */
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      CycleDataTree: [],
      tableData: [],
      value2: null,
      colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
      editIndex: -1,
      addTargetDialog: false,
      addTargetFrom: {
        CycleID: 0,
        ObjectName: '',
        ObjectContent: '',
        Scope: 0,
        UserScope: '',
        ParentID: 0,
        ObjectID: 0,
        WeightRatio: '',
        Confidence: ''
      },
      addTargetDialogTitle: '新增目标',
      symbolKey: '', // 不同的key
      addResultDialog: false,
      addResultDialogTitle: '新增成果',
      addResultFrom: {
        ObjectName: '',
        CycleID: 0,
        ResultID: 0,
        ResultName: '',
        Schedule: 0,
        WeightRatio: '',
        ValueType: 0,
        StartValue: '',
        ObjectValue: '',
        Confidence: 0,
        Remark: '',
        Scope: 0,
        UserScope: '',
        ObjectID: 0,
        Task_list: []
      },
      clickUserID: '',
      ObjectText: '',
      ResultTableData: [],
      loading: false,
      customColors: [
        { color: '#f56c6c', percentage: 20 },
        { color: '#e6a23c', percentage: 40 },
        { color: '#5cb87a', percentage: 60 },
        { color: '#1989fa', percentage: 80 },
        { color: '#6f7ad3', percentage: 100 }
      ],
      taskTableData: [],
      addTaskFrom: {
        TaskID: 0,
        ResultID: 0,
        Title: '',
        TaskDescribe: '',
        CompletedProgress: 50,
        StartDate: '',
        EndDate: '',
        Proportion: 0,
        Describes: '',
        Priority: 0,
        PlanHours: 0,
        Participant: '',
        AuditUser: '',
        IsDraft: 0,
        Scope: 0,
        UserScope: '',
        CreateUserID: window.userInfo[0].UserID,
        link: true,
        ResultName: '',
        ObjectTypeName: '',
        File_list: []
      },
      fileList: [],
      dateTaskStartEnd: [],
      alignDrawer: false,
      expands: [],
      expandChangeIndex: -1,
      drawerWork: false,
      drawerWorkCtl: { title: '', direction: 'rtl', size: '30%', style: '' },
      wordDrawerFm: {
        dt: new Date(),
        priority: 1,
        desc: '',
        other: '',
        link: true,
        TaskID: 0,
        ResultID: 0,
        ResultName: '',
        ObjectTypeName: '',
        Title: '',
        TaskDescribe: '',
        CompletedProgress: 50,
        StartDate: '',
        EndDate: '',
        Proportion: 0,
        Describes: '',
        Priority: 0,
        PlanHours: 0,
        Participant: '',
        AuditUser: '',
        IsDraft: 0,
        Scope: 0,
        UserScope: '',
        CreateUserID: window.userInfo[0].UserID,
        File_list: []
      },
      ResultID: -1 /* 当前展开id */,
      activeNames: ['添加任务', '其他事项'],
      taskDrawerTitle: '添加任务',
      dialogVisible: false,
      getSelectDeptorUsertype: '',
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      },
      targetAlignObjectIDArr: [],
      objRow: {}
    };
  },
  computed: {
    ...mapGetters(['device'])
  },
  methods: {
    getRowKeys(row) {
      return row.ObjectID || row.ResultID || 0;
    },
    getRowKeysResult(row) {
      return row.ResultID || 0;
    },
    async addDcope(row) {
      this.addTargetDialog = true;
      this.addTargetDialogTitle = '新增目标';
      /* 数据重置到初始状态 */
      Object.assign(
        this.$data.addTargetFrom,
        this.$options.data().addTargetFrom
      );
      this.addTargetFrom.CycleID = row.CycleID;
      this.addTargetFrom.ParentID = row.ObjectID;
    },
    async InsertObject() {
      try {
        this.loading = true;
        const { code, msg } =
          this.addTargetDialogTitle === '新增目标'
            ? await InsertObject(this.addTargetFrom)
            : await UpdateObject(this.addTargetFrom);
        code === 200 ? this.$message.success(msg) : this.$message.error(msg);
        if (code === 200) {
          const { data } = await SelectObject({
            CycleID: this.addTargetFrom.CycleID
          });
          this.targertTreeData = data;
        }
        this.addTargetDialog = false;
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
    EditObject(row) {
      this.addTargetDialog = true;
      this.addTargetDialogTitle = '修改目标';
      this.addTargetFrom = row;
    },
    async DeleteObject(row) {
      const { code, msg } = await DeleteObject({ ObjectID: row.ObjectID });
      code === 200 ? this.$message.success(msg) : this.$message.error(msg);
      const { data } = await SelectObject({ CycleID: row.CycleID });
      this.targertTreeData = data;
    },
    addResult(row) {
      /* 数据重置到初始状态 */
      Object.assign(
        this.$data.addResultFrom,
        this.$options.data().addResultFrom
      );
      this.addResultDialogTitle = '新增成果';
      this.addResultFrom.ObjectID = row.ObjectID;
      this.addResultFrom.CycleID = row.CycleID;
      this.addResultFrom.ObjectName = row.ObjectName;
      this.addResultDialog = true;
    },
    async InsertResult() {
      const { code, msg } =
        this.addResultDialogTitle === '新增成果'
          ? await InsertResult(this.addResultFrom)
          : await UpdateResult(this.addResultFrom);
      code === 200 ? this.$message.success(msg) : this.$message.error(msg);
      this.ObjectText = this.addResultFrom.ObjectName;
      this.addResultDialog = false;
      if (code === 200) {
        const { data } = await SelectObject({
          CycleID: this.addResultFrom.CycleID
        });
        this.targertTreeData = data;
      }
      this.ObjectText = this.addResultFrom.ObjectName;
      this.SelectResult(this.addResultFrom.ObjectID);
    },
    async EditResult(row) {
      const { data } = await SelectFile({
        ForeignKeyID: row.ResultID,
        FileSource: 'o_result'
      });
      this.addResultDialogTitle = '修改成果';
      row.File_list = data.DataList;
      this.addResultFrom = row;
      this.addResultDialog = true;
    },
    async SelectResult(row) {
      try {
        this.loading = true;
        const { data } = await SelectResult({
          ObjectID: row.ObjectID || row
        });
        this.ResultTableData = data;
        this.ObjectText = row.ObjectName || this.ObjectText;
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
    addTarget() {
      if (!this.cyclerow.CycleID) {
        this.$message.warning('请您选择周期！');
        return;
      }
      this.addTargetDialogTitle = '新增目标';
      /* 数据重置到初始状态 */
      Object.assign(
        this.$data.addTargetFrom,
        this.$options.data().addTargetFrom
      );
      this.addTargetFrom.CycleID = this.cyclerow.CycleID;
      this.addTargetDialog = true;
    },
    async DeleteResult(row) {
      const { code, msg } = await DeleteResult({ ResultID: row.ResultID });
      code === 200 ? this.$message.success(msg) : this.$message.error(msg);
      this.SelectResult(row.ObjectID);
      const { data } = await SelectObject({
        CycleID: this.addResultFrom.CycleID
      });
      this.targertTreeData = data;
    },
    customColorMethod(percentage) {
      if (percentage < 30) {
        return '#909399';
      } else if (percentage < 70) {
        return '#e6a23c';
      } else {
        return '#67c23a';
      }
    },
    async addTask(row) {
      if (this.taskDrawerTitle === '修改任务') {
        Object.assign(this.$data.addTaskFrom, this.$options.data().addTaskFrom);
      }
      this.taskDrawerTitle = '添加任务';
      this.addTaskFrom.ResultID = row.ResultID;
      this.drawerWorkCtl.title = row.ResultName;
      this.drawerWork = true;
    },
    async expandChange(row, expandedRows, expanded) {
      if (expandedRows.length !== 0) {
        const { data } = await SelectTask({ ResultID: row.ResultID });
        this.ResultID = row.ResultID;
        this.taskTableData = data.DataList;
        this.ResultTableData.map((item, index) => {
          if (row.ResultID === item.ResultID) {
            this.expandChangeIndex = index;
            this.drawerWorkCtl.title = row.ResultName;
          }
        });
      }
      if (expandedRows.length) {
        this.expands = [];
        if (row) {
          this.expands.push(row.ResultID);
        }
      } else {
        this.expands = [];
      }
    },
    async InsertTask() {
      this.addTaskFrom.StartDate =
        this.dateTaskStartEnd === []
          ? ''
          : parseTime(this.dateTaskStartEnd[0], '{y}-{m}-{d}');
      this.addTaskFrom.EndDate =
        this.dateTaskStartEnd === []
          ? ''
          : parseTime(this.dateTaskStartEnd[1], '{y}-{m}-{d}');
      const { code, msg } = await InsertTask(this.addTaskFrom);
      code === 200 ? this.$message.success(msg) : this.$message.error(msg);
      const { data } = await SelectTask({ ResultID: this.ResultID });
      this.taskTableData = data.DataList;
      this.drawerWork = false;
    },
    async UpdateTask() {
      this.addTaskFrom.StartDate =
        this.dateTaskStartEnd === []
          ? ''
          : parseTime(this.dateTaskStartEnd[0], '{y}-{m}-{d}');
      this.addTaskFrom.EndDate =
        this.dateTaskStartEnd === []
          ? ''
          : parseTime(this.dateTaskStartEnd[1], '{y}-{m}-{d}');
      const { code, msg } = await UpdateTask(this.addTaskFrom);
      code === 200 ? this.$message.success(msg) : this.$message.error(msg);
      const { data } = await SelectTask({ ResultID: this.ResultID });
      this.taskTableData = data.DataList;
      this.drawerWork = false;
    },
    async DeleteTask(row) {
      const { msg, code } = await DeleteTask({
        TaskID: row.TaskID
      });
      code === 200 ? this.$message.success(msg) : this.$message.error(msg);
      const { data } = await SelectTask({ ResultID: this.ResultID });
      this.taskTableData = data.DataList;
      this.drawerWork = false;
    },
    async EditTask(row) {
      const { data } = await SelectTaskByID({
        TaskID: row.TaskID
      });
      this.drawerWorkCtl.title;
      this.addTaskFrom = data[0];
      this.taskDrawerTitle = '修改任务';
      this.dateTaskStartEnd = [];
      this.dateTaskStartEnd.push(row.StartDate);
      this.dateTaskStartEnd.push(row.EndDate);
      this.drawerWork = true;
    },
    alignTarget(objRow) {
      this.alignDrawer = true;
      this.objRow = objRow;
      const cyclerow = this.cyclerow;
      this.SelectAlignObject(objRow, cyclerow);
    },
    async SelectAlignObject(row, cyclerow) {
      const { data } = await SelectAlignObject({
        StartDate: cyclerow.StartDate.replace('T00:00:00', ''),
        EndDate: cyclerow.EndDate
          ? cyclerow.EndDate.replace('T00:00:00', '')
          : '',
        ObjectID: row.ObjectID,
        ObjectType: cyclerow.ObjectType
      });
      this.CycleDataTree = data;
      this.targetAlignObjectIDArr = [];
      this.CycleDataTree.map((item, index) => {
        this.targetAlignObjectIDArr.push(...item.ParentIDArray);
      });
    },
    async CheckChange(val) {
      if (val.checked) {
        this.targetAlignObjectIDArr.push(val.data.ObjectID);
      } else {
        this.targetAlignObjectIDArr.map((item, index) => {
          if (item === val.data.ObjectID) {
            this.targetAlignObjectIDArr.splice(index, 1);
          }
        });
      }
    },
    handleNodeClick() {},
    handleClose() {
      this.alignDrawer = false;
    },
    async InsertAligning() {
      const { code, msg } = await InsertAligning({
        ObjectID: this.objRow.ObjectID,
        ParentIDArray: Array.from(new Set(this.targetAlignObjectIDArr))
      });
      code === 200 ? this.$message.success(msg) : this.$message.error(msg);
      const { data } = await SelectObject({
        CycleID: this.objRow.CycleID
      });
      this.targertTreeData = data;
      this.alignDrawer = false;
    },
    getSelectDeptorUser(value) {
      if (this.getSelectDeptorUsertype === '参与人') {
        value = Array.from(new Set(value));
        this.addTaskFrom.Participant = value.join(',');
      } else {
        value = Array.from(new Set(value));
        this.addTaskFrom.AuditUser = value.join(',');
      }
    },
    people(type, UserID = []) {
      this.getSelectDeptorUsertype = type;
      this.dialogVisible = true;
      if (type === '参与人') {
        this.$nextTick(() => {
          this.$refs.userTree.setDeptorUser([]);
          Array.from(new Set(UserID.split(',')));
          this.$refs.userTree.setDeptorUser(
            Array.from(new Set(UserID.split(',')))
          );
        });
      } else if (type === '审核人') {
        this.$refs.userTree.setDeptorUser([]);
        Array.from(new Set(UserID.split(',')));
        this.$refs.userTree.setDeptorUser(
          Array.from(new Set(UserID.split(',')))
        );
      }
    },
    handleSuccessResult(response, file) {
      if (response.code === 200) {
        const data = response.data[0];
        this.addResultFrom.File_list.push({
          FileID: 0,
          CheckID: 0,
          FileName: file.name,
          FileUrl: data.FileUrl.replace(/href=|'|"|Annex\/file/g, ''),
          OpenFileUrl: data.OpenFileUrl
        });
      } else {
        this.fileList = [];
        this.$message.error(file.name + '上传失败');
      }
    },
    handleSuccess(response, file) {
      if (response.code === 200) {
        const data = response.data[0];
        this.addTaskFrom.File_list.push({
          FileID: 0,
          CheckID: 0,
          FileName: file.name,
          FileUrl: data.FileUrl.replace(/href=|'|"|Annex\/file/g, ''),
          OpenFileUrl: data.OpenFileUrl
        });
      } else {
        this.fileList = [];
        this.$message.error(file.name + '上传失败');
      }
    }
  }
};
</script>

<style lang="scss">
.targetTree {
  height: 200px;
  overflow-y: auto;
}
.Drawer_ {
  display: flex;
  flex-flow: column; //垂直排列
  justify-content: space-between; //上下两端对齐
  height: 100vh;
  .Drawer_Align {
    height: calc(100vh - 100px);
    p {
      font-size: 25px !important;
      text-align: center;
    }
    .target {
      margin: 0px 10px;
      padding: 0px 10px;
      p {
        font-size: 20px !important;
        text-align: left;
      }
    }
  }
  .Drawer_footer {
    display: flex;
    justify-content: flex-end;
    margin: 10px;
  }
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  font-size: 14px;
  padding-right: 8px;
  .label {
    min-width: 200px;
  }
  .edit {
    flex: 1;
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
  .box-card_ {
    height: 80vh !important;
    overflow: auto;
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
  .el-table__expanded-cell {
    padding: 0px 0px 0 47px;
    background: white;
  }
}
</style>
