<template>
  <el-container class="task">
    <el-header>
      <el-row
        type="flex"
        justify="space-between"
      >
        <el-col :span="10">
          <el-radio-group
            v-model="isCollapse"
            size="mini"
          >
            <el-radio-button :label="false">看板视图</el-radio-button>
            <el-radio-button :label="true">表格视图</el-radio-button>
          </el-radio-group>
        </el-col>
        <el-col
          :xs="5"
          :sm="6"
          :md="4"
          :lg="3"
          :xl="2"
        >
          <el-form
            :inline="true"
            class="demo-form-inline"
            size="small"
          >
            <!-- <el-form-item>
              <el-button
                style="padding: 3px 0"
                type="text"
              ><i class="iconfont al-icon-caogaoxiang" />草稿箱</el-button>
            </el-form-item>
            <el-form-item>
              <el-button
                style="padding: 3px 0"
                type="text"
                icon="el-icon-delete"
              >回收站</el-button>
            </el-form-item> -->
            <el-form-item>
              <el-button
                icon="el-icon-plus"
                type="primary"
                size="mini"
                class="pan-btn blue-btn"
                @click="onSubmit"
              >创建任务</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-main>
        <el-row v-show="isCollapse == false">
          <el-row>
            <el-col :span="24">
              <el-tabs
                v-model="activeName"
                @tab-click="handleClick"
              >
                <el-tab-pane
                  label="我负责的"
                  name="1"
                />
                <el-tab-pane
                  label="我审核的"
                  name="2"
                />
                <el-tab-pane
                  label="我参与的"
                  name="3"
                />
                <el-tab-pane
                  label="已逾期"
                  name="4"
                />
                <el-tab-pane
                  label="已完成"
                  name="5"
                />
              </el-tabs>
            </el-col>
          </el-row>
          <div style="height:75vh;overflow:auto;display:flex;flex-wrap:wrap">
            <el-card
              v-for="taskItem in tableData"
              :key="taskItem.TaskID"
              class="box-card"
              style="width: 20vw;height:26vh; margin: 3px"
            >
              <div
                slot="header"
                class="clearfix"
              >
                <el-row>
                  <el-col :span="22">
                    <h2
                      style="text-overflow: -o-ellipsis-lastline;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 2;
						line-clamp: 2;
						-webkit-box-orient: vertical;"
                    >
                      {{ taskItem.Title }}</h2>
                  </el-col>
                  <el-col
                    :span="2"
                    style="display:flex;align-items:center;"
                  >
                    <h2>
                      <el-button
                        style="float: right; padding: 3px 0"
                        type="text"
                        icon="el-icon-edit"
                        @click="editTask(taskItem)"
                      />
                    </h2>

                  </el-col>
                </el-row>

              </div>
              <el-row
                type="flex"
                align-items="center"
                justify="flex-start"
                class="task"
                style="cursor: pointer"
              >
                <el-col>
                  <el-row style="color: rgb(163, 166, 170)">截止日期:{{ taskItem.EndDate }}</el-row>
                  <el-row
                    type="flex"
                    justify="space-between"
                  >
                    <el-col :span="15">
                      <p>
                        <span style="color: white; background: rgb(42, 184, 136)">状态</span>
                        ：{{ taskItem.State }}
                      </p>
                    </el-col>
                    <el-col
                      :span="9"
                      style="text-align:right"
                    >进度：{{ taskItem.CompletedProgress }}%</el-col>
                  </el-row>
                </el-col>
              </el-row>
              <el-row
                style="text-overflow: -o-ellipsis-lastline;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 4; //行数需设置
						line-clamp: 4;
						-webkit-box-orient: vertical;"
              >
                描述：{{ taskItem.Describes }}
              </el-row>
            </el-card>
          </div>
          <el-row
            type="flex"
            style="flex-wrap:wrap;overflow: auto;"
            class="box-card_"
          />
        </el-row>

        <el-row v-show="isCollapse == true">
          <el-row>
            <el-table
              :data="tableData"
              style="width: 100%"
              border
              size="mini"
            >
              <el-table-column
                prop="Title"
                label="任务名称"
                min-width="180"
              />
              <el-table-column
                prop="State"
                label="状态"
                width="100"
                align="center"
              />
              <el-table-column
                label="进度"
                align="center"
                max-width="100"
              >
                <template slot-scope="{row}">
                  <el-progress
                    :percentage="row.CompletedProgress"
                    :color="customColors"
                  />
                </template>
              </el-table-column>
              <el-table-column
                label="截止日期"
                width="150"
                align="center"
              >
                <template slot-scope="{row}">
                  {{ row.EndDate }}
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                width="100"
                align="center"
              >
                <template slot-scope="{row}">
                  <el-button
                    icon="el-icon-edit"
                    circle
                    size="mini"
                    @click="editTask(row)"
                  />
                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </el-row>

        <el-dialog
          title="创建任务"
          :visible.sync="dialogTask"
          :width="device === 'desktop' ? '60%' : '99%'"
          @resize="resize"
        >
          <span
            slot="footer"
            class="dialog-footer"
          >
            <el-button
              size="small"
              @click="dialogTask = false"
            >取 消</el-button>
            <el-button
              type="primary"
              size="small"
              @click="dialogTask = false"
            >确 定</el-button>
          </span>
        </el-dialog>
        <el-drawer
          :with-header="false"
          :visible.sync="drawerWork"
          :size="drawerWorkCtl.size"
          :direction="drawerWorkCtl.direction"
        >
          <div class="todayTask">
            <span style="font-size: 18px; margin: 5px">{{
              drawerWorkCtl.title
            }}</span>
            <div style="flex: 1;">
              <el-collapse v-model="taskactiveNames">
                <el-collapse-item
                  title="重点任务"
                  name="1"
                >
                  <el-card class="box-card">
                    <div
                      slot="header"
                      class="clearfix"
                    >
                      <span>任务时间</span>
                      <el-date-picker
                        v-model="startEnddate"
                        type="daterange"
                        align="right"
                        size="mini"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="截止日期"
                        :picker-options="pickerOptions"
                      />
                      <span class="text">优先级</span>
                      <el-input-number
                        v-model="wordDrawerFm.Priority"
                        :min="1"
                        :max="10"
                        size="mini"
                        style="width: 90px"
                      />
                    </div>
                    <el-tabs value="first">
                      <el-tab-pane
                        label="基本信息"
                        name="first"
                      >
                        <el-row>
                          任务标题：
                          <el-input
                            v-model="wordDrawerFm.Title"
                            :rows="2"
                            size="mini"
                            placeholder="请输入标题"
                          />
                        </el-row>
                        <el-row>
                          描述：
                          <el-input
                            v-model="wordDrawerFm.Describes"
                            type="textarea"
                            :rows="2"
                            placeholder="请输入任务描述"
                          />
                        </el-row>
                        <el-row>
                          完成进度：
                          <div class="block">
                            <el-slider
                              v-model="wordDrawerFm.CompletedProgress"
                              show-input
                              input-size="mini"
                              :marks="{50:'50%'}"
                            />
                          </div>
                        </el-row>
                      </el-tab-pane>
                      <el-tab-pane
                        label="附件"
                        name="second"
                      >
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
                          >选择文件</el-button>
                        </el-upload>
                        <filePreview :preview-data="wordDrawerFm.File_list" />
                      </el-tab-pane>
                    </el-tabs>
                    <el-checkbox
                      v-model="wordDrawerFm.link"
                      style="margin-top: 15px"
                    >该任务关联成果</el-checkbox>
                    <div>
                      <el-row>
                        <el-col :span="1" />
                        <el-col :span="23">
                          <el-tag
                            v-if="wordDrawerFm.ObjectTypeName"
                            effect="plain"
                            size="mini"
                          >{{ wordDrawerFm.ObjectTypeName }}</el-tag>
                          {{ wordDrawerFm.ResultName }}
                          <el-button
                            type="text"
                            icon="el-icon-edit"
                            size="mini"
                            style="padding: 1px !important"
                            @click="kr"
                          >选择成果</el-button>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="1"><i class="el-icon-time" /></el-col>
                        <el-col :span="6">完成占比</el-col>
                        <el-col :span="17">
                          <el-input-number
                            v-model="wordDrawerFm.Proportion"
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
                            v-model="wordDrawerFm.PlanHours"
                            controls-position="right"
                            :min="1"
                            size="mini"
                          />小时
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="1"><i class="el-icon-user" /></el-col>
                        <el-col :span="6">参与人数：{{ wordDrawerFm.Participant?wordDrawerFm.Participant.split(',').length:0 }}</el-col>
                        <el-col :span="17">
                          <el-button
                            v-if="activeName<2"
                            type="primary"
                            icon="el-icon-plus"
                            circle
                            size="mini"
                            style="padding: 1px !important"
                            @click="people('参与人',wordDrawerFm.Participant)"
                          />
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="1"><i class="el-icon-s-check" /></el-col>
                        <el-col :span="6">审批人数：
                          {{ wordDrawerFm.AuditUser?wordDrawerFm.AuditUser.split(',').length:0 }}
                        </el-col>
                        <el-col :span="17">
                          <el-button
                            v-if="activeName<2"
                            type="primary"
                            icon="el-icon-plus"
                            circle
                            size="mini"
                            style="padding: 1px !important"
                            @click="people('审核人',wordDrawerFm.AuditUser)"
                          />
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="1"><i class="el-icon-view" /></el-col>
                        <el-col :span="6">可见范围</el-col>
                        <el-col :span="17">全公司</el-col>
                      </el-row>
                    </div>
                  </el-card>
                </el-collapse-item>
                <el-collapse-item
                  title="其他事项"
                  name="2"
                >
                  <el-input
                    v-model="wordDrawerFm.other"
                    type="textarea"
                    :rows="2"
                    placeholder="请输入"
                  />
                </el-collapse-item>
              </el-collapse>
            </div>

            <el-button
              type="success"
              round
              size="mini"
              @click="InsertTask"
            >提交</el-button>

          </div>
        </el-drawer>
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
          <span
            slot="footer"
            class="dialog-footer"
          >
            <el-button
              size="mini"
              @click="dialogVisible = false"
            >取 消</el-button>
            <el-button
              type="primary"
              size="mini"
              @click="dialogVisible = false"
            >确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog
          title="关联成果"
          :visible.sync="dialogKR"
          :width="device === 'mobile' ? '90%' : '50%'"
        >
          <div style="height:60vh;overflow:auto">
            <taskAlign @handleSelectionChange="handleSelectionChange" />
          </div>
          <span
            slot="footer"
            class="dialog-footer"
          >
            <el-button
              size="mini"
              @click="dialogKR = false"
            >取 消</el-button>
            <el-button
              type="primary"
              size="mini"
              @click="dialogKR = false"
            >确 定</el-button>
          </span>
        </el-dialog>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import { mapGetters } from 'vuex';
import { SelectMyTask, SelectTaskByID, UpdateTask } from '@/api/okr/task';
import SelectDeptorUser from '@/views/components/SelectDeptorUser';
import { parseTime } from '@/utils/index';
import taskAlign from '@/views/components/okr/taskAlign';
import filePreview from '@/views/components/file/filePreview';

export default {
  components: {
    SelectDeptorUser,
    taskAlign,
    filePreview
  },
  data() {
    return {
      isCollapse: false,
      count: 0,
      aside: true,
      activeName: '1',
      options: [
        {
          value: '公司',
          label: '公司'
        },
        {
          value: '个人',
          label: '个人'
        }
      ],
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }
      ],
      value: '',
      checked: true,
      dialogTask: false,
      customColors: [
        { color: '#f56c6c', percentage: 20 },
        { color: '#e6a23c', percentage: 40 },
        { color: '#5cb87a', percentage: 60 },
        { color: '#1989fa', percentage: 80 },
        { color: '#6f7ad3', percentage: 100 }
      ],
      drawerWork: false,
      drawerWorkCtl: { title: '', direction: 'ltr', size: '35%', style: '' },
      taskactiveNames: ['1', '2'],
      startEnddate: [],
      wordDrawerFm: {
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
      dialogVisible: false,
      state: '新增',
      getSelectDeptorUsertype: '',
      fileList: [],
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
      dialogKR: false
    };
  },
  computed: {
    ...mapGetters(['device'])
  },
  watch: {
    startEnddate(newValue) {
      this.wordDrawerFm.StartDate = newValue === [] ? '' : parseTime(newValue[0], '{y}-{m}-{d}');
      this.wordDrawerFm.EndDate = newValue === [] ? '' : parseTime(newValue[0], '{y}-{m}-{d}');
    }
  },
  created() {
    this.SelectMyTask();
  },
  methods: {
    async SelectMyTask(type) {
      const { data } = await SelectMyTask({
        UserID: window.userInfo[0].UserID,
        Type: type || 1
      });
      this.tableData = data.DataList;
    },
    load() {
      this.count += 2;
    },
    handleClick(tab) {
      // console.log('activeName', this.activeName)
      this.SelectMyTask(tab.name);
    },
    onSubmit() {
      this.startEnddate = [];
      this.state = '新增';
      Object.assign(
        this.$data.wordDrawerFm,
        this.$options.data().wordDrawerFm
      );
      this.drawerWork = true;
    },
    resize(val) {

    },
    async editTask(itemTask) {
      const { data } = await SelectTaskByID({
        TaskID: itemTask.TaskID
      });
      this.wordDrawerFm = data[0];
      this.startEnddate = [];
      this.state = '修改';
      itemTask.StartDate ? this.startEnddate.push(itemTask.StartDate) : '';
      itemTask.StartDate ? this.startEnddate.push(itemTask.EndDate) : '';
      this.drawerWork = true;
    },
    kr() {
      this.dialogKR = true;
    },
    async InsertTask() {
      const { code, msg } = this.state === '新增' ? await InsertTask(this.wordDrawerFm)
        : await UpdateTask(this.wordDrawerFm);
      code === 200 ? this.$message.success(msg) : this.$message.error(msg);
      this.drawerWork = false;
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
    getSelectDeptorUser(value) {
      if (this.getSelectDeptorUsertype === '参与人') {
        value = Array.from(new Set(value));
        this.wordDrawerFm.Participant = value.join(',');
      } else {
        value = Array.from(new Set(value));
        this.wordDrawerFm.AuditUser = value.join(',');
      }
    },
    people(type, UserID = []) {
      this.getSelectDeptorUsertype = type;
      this.dialogVisible = true;
      if (type === '参与人') {
        this.$nextTick(() => {
          this.$refs.userTree.setDeptorUser([]);
          Array.from(new Set(UserID.split(',')));
          this.$refs.userTree.setDeptorUser(Array.from(new Set(UserID.split(','))));
        });
      } else if (type === '审核人') {
        this.$refs.userTree.setDeptorUser([]);
        Array.from(new Set(UserID.split(',')));
        this.$refs.userTree.setDeptorUser(Array.from(new Set(UserID.split(','))));
      }
    },
    handleSelectionChange(val) {
      this.wordDrawerFm.ObjectTypeName = val.ObjectType;
      this.wordDrawerFm.ResultName = val.row.ResultName;
      this.wordDrawerFm.ResultID = val.row.ResultID;
    },
    handleSuccess(response, file) {
      if (response.code === 200) {
        const data = response.data[0];
        this.wordDrawerFm.File_list.push({
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
.task {
  ul {
    padding: 0px;
    margin: 0px;
    li {
      list-style: none;
    }
  }
  .el-header {
    height: 35px !important;
    padding: 2px 0 0 0px;
  }
  .el-aside {
    padding: 2px 0 0 0px;
    //background: rgb(237, 241, 244);
    border: 1px solid rgb(225, 225, 225);
  }
  .el-main {
    padding: 0 0px;
    // background: rgb(237, 241, 244);
    height: 95vh !important;
  }
  .el-radio-button:first-child .el-radio-button__inner,
  .el-radio-button:last-child .el-radio-button__inner {
    border-radius: 2px;
  }
  .infinite-list {
    height: calc(100vh - 180px);
  }
  .row_infinite:hover {
    background: rgb(243, 244, 246);
    cursor: pointer;
  }
  .infinite_name {
    height: 40px;
    background: rgb(68, 148, 173);
    text-align: center;
    line-height: 36px;
    color: white;
  }

  .infinite_title {
    height: 30px;
  }
  .infinite_Details {
    height: 10px;
    color: rgb(161, 164, 168);
  }
  .el-tabs__nav {
    height: 34px;
  }
  .el-tabs__item.is-active {
    color: black;
    font-weight: bold;
  }
  .el-tabs__active-bar {
    background: black;
  }
  ::-webkit-scrollbar-thumb {
    background-color: rgb(237, 241, 244);
  }
  .todayTask {
    display: flex;
    overflow: auto;
    flex-direction: column;
    margin: 0px 10px;
    height: 100vh;
    .drawer_header {
      height: 50px;
    }
    .task {
      flex: 1;
    }
    .el-button {
      margin-bottom: 20px;
    }
  }
}
</style>
