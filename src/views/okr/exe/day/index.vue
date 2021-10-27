<template>
  <el-container class="day">
    <transition name="el-zoom-in-center">
      <el-aside v-show="aside">
        <div class="aside">
          <div class="calendar">
            <el-calendar
              v-model="calendarValue"
              data="yyyy-MM-dd"
            >
              <template
                slot="dateCell"
                slot-scope="{ data }"
              >
                <span :class="data.isSelected ? 'is-selected' : ''">
                  {{ data.day.split('-').slice(2)[0] }}
                  {{ data.isSelected ? '✔️' : '' }} </span><br>
              </template>
            </el-calendar>
          </div>
          <div class="user">
            <div>
              <div>
                <el-input
                  v-model="listQuery.UserName"
                  placeholder="搜索人员"
                  size="mini"
                  @keyup.enter.native="SelectUserReportInfo('搜索')"
                >
                  <i
                    slot="prefix"
                    class="el-input__icon el-icon-search"
                  />
                </el-input>
              </div>
            </div>
            <div style="margin-top: 3px">
              <ul
                v-infinite-scroll="load"
                class="infinite infinite-list"
                style="overflow: auto"
              >
                <li @click="select">
                  <el-row class="row_infinite">
                    <el-col :span="6">
                      <h2 class="infinite_name">公司</h2>
                    </el-col>
                    <el-col
                      :span="18"
                      style="height: 40px"
                    >
                      <el-row class="infinite_title">
                        <h3>日报提交情况</h3>
                      </el-row>
                      <el-row class="infinite_Details">
                        <p>{{ date }}</p>
                      </el-row>
                    </el-col>
                  </el-row>
                </li>
                <li
                  v-for="item in userTableData"
                  :key="item.UserID"
                  class="infinite-list-item"
                  @click="SelectDaily(item)"
                >
                  <el-row class="row_infinite">
                    <el-col :span="6">
                      <h2 class="infinite_name">{{ item.UserName }}</h2>
                    </el-col>
                    <el-col
                      :span="16"
                      style="height: 40px"
                    >
                      <el-row class="infinite_title">
                        <h3>
                          {{ item.UserName }}
                          <span
                            v-if="UserID === item.UserID"
                            class="infinite_Details"
                          >(我的)</span>
                        </h3>
                      </el-row>
                      <el-row class="infinite_Details IsCommit">
                        <p>{{ date }}</p>
                        <el-button
                          v-if="item.IsCommit"
                          size="mini"
                          type="success"
                          circle
                        />
                      </el-row>
                    </el-col>
                  </el-row>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </el-aside>
    </transition>
    <el-main>
      <div v-show="Statistics_my">
        <div style="display: flex">
          <div style="flex: 1">
            <el-form
              :inline="true"
              class="demo-form-inline"
            >
              <el-form-item>
                <el-button
                  size="mini"
                  type="text"
                  :icon="
                    aside == true
                      ? 'el-icon-d-arrow-left'
                      : 'el-icon-d-arrow-right'
                  "
                  @click="aside = !aside"
                />
              </el-form-item>
              <el-form-item>
                <span style="font-size: 20px">日报提交情况</span>
              </el-form-item>
            </el-form>
          </div>
          <div style="width: 250px">
            <el-form
              :inline="true"
              class="demo-form-inline"
            >
              <el-form-item>
                <default-dept @getDefaultDeptsValue="getDefaultDeptValues" />
              </el-form-item>
            </el-form>
          </div>
        </div>
        <el-table
          v-el-table-infinite-scroll="load1"
          :data="SubmittedTableData"
          style="width: 100%; margin-top: 10px"
          height="36vh"
          size="small"
          border
        >
          <el-table-column
            prop="UserName"
            label="已提交人员"
          />

          <el-table-column
            prop="DeptName"
            label="部门"
          />
        </el-table>
        <br>
        <el-table
          v-el-table-infinite-scroll="load2"
          :data="NotSubmittedTableData"
          style="width: 100%"
          height="36vh"
          size="small"
          border
        >
          <el-table-column
            prop="UserName"
            label="未提交人员"
          />

          <el-table-column
            prop="DeptName"
            label="部门"
          />
        </el-table>
        <el-form
          :inline="true"
          class="demo-form-inline"
        >
          <el-form-item>
            <span class="commit_1">{{ submittedCount }}</span>
          </el-form-item>
          <el-form-item>
            <span style="font-size: 18px">人已提交</span>
          </el-form-item>
          <el-form-item />
          <el-form-item>
            <span class="commit_2">{{ NotSubmittedCout }}</span>
          </el-form-item>
          <el-form-item>
            <span style="font-size: 18px">人未提交</span>
          </el-form-item>
        </el-form>
      </div>
      <div v-show="!Statistics_my">
        <div style="display: flex">
          <div style="flex: 1">
            <el-form
              :inline="true"
              class="demo-form-inline"
            >
              <el-form-item>
                <el-button
                  size="mini"
                  type="text"
                  :icon="
                    aside == true
                      ? 'el-icon-d-arrow-left'
                      : 'el-icon-d-arrow-right'
                  "
                  @click="aside = !aside"
                />
              </el-form-item>
              <el-form-item>
                <span style="font-size: 20px">{{ userName }}{{ date }}的日报</span>
              </el-form-item>
            </el-form>
          </div>
          <div style="width: 100px">
            <el-form
              :inline="true"
              class="demo-form-inline"
            >
              <el-form-item>
                <el-button
                  v-if="clickUserID === UserID"
                  type="primary"
                  size="mini"
                  class="pan-btn blue-btn"
                  @click="InsertDaily(1)"
                >提交
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div>
          <el-form class="demo-ruleForm">
            <el-form-item
              label="重点展示任务"
              prop="desc"
            >
              <el-table
                :data="taskArr"
                style="width: 100%; margin-top: 10px"
                border
                class="taskArr"
                size="mini"
              >
                <el-table-column
                  prop="Title"
                  label="任务标题"
                />
                <el-table-column
                  label="预计/实际进度"
                  align="center"
                >
                  <template slot-scope="{row}">

                    <el-input
                      v-model="row.ExpectedTarget"
                      size="mini"
                      placeholder="预计当前进度"
                      clearable
                      style="width:95px"
                    />
                    %
                    {{ row.ActualTarget || row.CompletedProgress }}%
                  </template>
                </el-table-column>
                <el-table-column
                  label="描述"
                  align="center"
                >
                  <template slot-scope="{row}">
                    <el-input
                      v-model="row.Daily_Describe"
                      size="mini"
                      placeholder="输入描述"
                      clearable
                    />
                  </template>
                </el-table-column>
              </el-table>
              <span>
                <el-link
                  type="primary"
                  class="el-icon-plus"
                  :underline="false"
                  @click="SelectResultPer()"
                >添加任务</el-link>
              </span>
            </el-form-item>
            <el-form-item
              label="心得分享"
              prop="desc"
            >
              <el-input
                v-model="InsertDailyData.ExperienceSharing"
                type="textarea"
              />
            </el-form-item>
            <el-form-item>
              <el-form
                :inline="true"
                class="demo-form-inline"
              >
                <el-form-item label="遇到的问题" />
                <el-form-item>
                  <el-link
                    type="primary"
                    class="el-icon-plus"
                    :underline="false"
                    @click="addIssue"
                  >添加问题
                  </el-link>
                </el-form-item>
              </el-form>
              <div
                v-for="(item, index) in problem"
                :key="index"
                style="display: flex"
              >
                <div style="flex: 1">
                  <el-input
                    v-model="problem[index]"
                    size="mini"
                  ><i slot="prefix">{{ index + 1 }}：</i></el-input>
                </div>
                <div>
                  <el-link
                    :underline="false"
                    type="primary"
                    icon="el-icon-delete"
                    @click="deleteIssue(index)"
                  />
                </div>
              </div>
            </el-form-item>
            <el-form-item label="明日计划">
              <el-input
                v-model="InsertDailyData.OtherMatters"
                type="OtherMatters"
              />
            </el-form-item>
            <el-form-item label="上传附件">
              <el-upload
                class="upload-demo"
                action="/api/RC_File/UploadFile"
                :on-success="handleSuccess"
                :file-list="fileList"
              >
                <el-button
                  size="mini"
                  type="primary"
                  class="el-icon-upload2"
                />
              </el-upload>
            </el-form-item>
            <el-form-item>
              <filePreview :preview-data="InsertDailyData.File_list" />
            </el-form-item>
            <el-form-item label="上传照片">
              <el-upload
                size="mini"
                action="/api/RC_File/UploadFile"
                list-type="picture-card"
                :on-success="
                  (response, file, fileList) =>
                    handleSuccessImg(response, file, fileList)
                "
                :before-remove="beforeImg"
              >
                <i class="el-icon-plus" />
              </el-upload>
            </el-form-item>
            <el-form-item label="已上传的图片">
              <span
                v-for="(itemImg, indexImg) in ImgArr"
                :key="indexImg"
              >
                <el-image
                  style="width: 100px; height: 100px"
                  :src="itemImg"
                  :preview-src-list="[itemImg]"
                />
                <span><i
                  style="cursor: pointer"
                  class="el-icon-delete"
                  @click="deleteImg(indexImg)"
                /></span>
              </span>
            </el-form-item>
            <el-form-item
              v-show="InsertDailyData.IsCommit === 0"
              prop="desc"
            >
              <el-button
                v-if="clickUserID === UserID"
                type="primary"
                size="mini"
                @click="InsertDaily(0)"
              >保存
              </el-button>
              <el-button
                v-if="clickUserID === UserID"
                type="danger"
                size="mini"
                @click="InsertDailyData = []"
              >放弃
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <el-drawer
        :visible.sync="drawer"
        :direction="device === 'mobile' ? 'btt' : 'rtl'"
        :with-header="false"
      >
        <el-row
          type="flex"
          justify="space-between"
          align-items="center"
          style="margin: 0.3rem 0"
        >
          <el-col :span="22">
            <h1>选择任务</h1>
          </el-col>
          <el-col :span="2">
            <el-button
              icon="el-icon-close"
              size="small"
              circle
              @click="drawer = false"
            />
          </el-col>
        </el-row>
        <el-row style="height: calc(100vh - 150px); overflow-y: auto">
          <el-row
            v-for="(item, index) in TaskViewArr"
            :key="index"
          >
            <el-row
              type="flex"
              justify="space-between"
              style="background: rgb(202, 219, 245)"
            >
              <el-col :span="15">
                <h2>关键成果：{{ item.ResultName }}OKR系统开发</h2>
              </el-col>
              <el-col :span="5">
                <h3>{{ item.Task_list ? item.Task_list.length : 0 }}个任务</h3>
              </el-col>
            </el-row>
            <el-row
              v-for="(item2, index2) in item.Task_list"
              :key="index2"
              type="flex"
              align-items="center"
              justify="flex-start"
              class="task"
              style="cursor: pointer"
            >
              <el-col :span="2">
                <el-checkbox
                  v-model="item2.Ischecked"
                  @change="(val) => checkbox(item2, index2)"
                />
              </el-col>
              <el-col style="border-left: 3px solid rgb(110, 182, 253)">
                <el-row>
                  <p>任务:{{ item2.Title }}</p>
                </el-row>
                <el-row style="color: rgb(163, 166, 170)">截止日期:{{
                  item2.EndDate ? item2.EndDate.replace('T', '') : ''
                }}
                </el-row>
                <el-row
                  type="flex"
                  justify="space-between"
                >
                  <el-col :span="15">
                    <p>
                      <span style="color: white; background: rgb(42, 184, 136)">状态</span>
                      ：{{ item2.State }}
                    </p>
                  </el-col>
                  <el-col :span="5">进度：{{ item2.CompletedProgress }}%</el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-row>
        </el-row>
      </el-drawer>
    </el-main>
  </el-container>
</template>

<script>
import { SelectUserReportInfo } from '@/api/okr/public';
import { parseTime } from '@/utils/index';
import { InsertDaily, SelectDaily } from '@/api/okr/daily';
import defaultDept from '@/views/components/defaultDept';
import elTableInfiniteScroll from 'el-table-infinite-scroll';
import { mapGetters } from 'vuex';
/* import { SelectTaskView } from '@/api/okr/task'; */
import { SelectResultPer } from '@/api/okr/Result';
import filePreview from '@/views/components/file/filePreview';

export default {
  components: { defaultDept, filePreview },
  directives: {
    'el-table-infinite-scroll': elTableInfiniteScroll
  },
  data() {
    return {
      calendarValue: '',
      date: '',
      aside: true,
      Statistics_my: true,
      listQuery: {
        Dailydate: '',
        Type: 1,
        UserName: '',
        pageIndex: 1,
        pageSize: 15,
        UserID: window.userInfo[0].UserID
      },
      listQuery1: {
        Dailydate: '',
        Type: 1,
        UserName: '',
        CommitState: '已提交',
        Dept: 0,
        pageIndex: 1,
        pageSize: 15
      },
      listQuery2: {
        Dailydate: '',
        Type: 1,
        UserName: '',
        CommitState: '未提交',
        pageIndex: 1,
        pageSize: 20
      },
      userTableData: [],
      SubmittedTableData: [],
      NotSubmittedTableData: [],
      DailyTableData: [],
      tableData: [],
      UserID: window.userInfo[0].UserID,
      clickUserID: 0,
      userName: '',
      haveDaily: true,
      taskData: [
        {
          id: '',
          title: '',
          achievement: '',
          description: ''
        }
      ],
      InsertDailyData: {
        DailyID: 0,
        DailyTask_list: [],
        OtherMatters: '',
        ExperienceSharing: '',
        Environment: '',
        Img: '',
        File_list: [],
        IsCommit: 0,
        UserID: window.userInfo[0].UserID,
        Dailydate: ''
      },
      ImgArr: [],
      problem: [],
      fileList: [],
      submittedCount: 0,
      NotSubmittedCout: 0,
      taskArr: [],
      TaskViewArr: [],
      drawer: false
    };
  },
  computed: {
    ...mapGetters(['device'])
  },
  watch: {
    calendarValue(newVlaue, item) {
      this.date = parseTime(newVlaue, '{y}-{m}-{d}');
      this.SelectUserReportInfo();
      this.SelectUserReportInfoSubmitted();
      this.SelectUserReportInfoNotSubmitted();
      this.SelectDaily({
        UserID: window.userInfo[0].UserID,
        Dailydate: this.date
      });
    },
    'listQuery.UserName': {
      deep: true,
      handler(newVal, oldVal) {
        this.debounce(this.SelectUserReportInfo, 500);
      }
    }
  },
  created() {
    this.SelectUserReportInfo();
    this.parseTimes();
  },
  mounted() {
    this.SelectUserReportInfoSubmitted();
    this.SelectUserReportInfoNotSubmitted();
  },
  methods: {
    // 防抖
    debounce(fn, wait) {
      if (this.timer !== null) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(fn, wait);
    },
    async SelectUserReportInfo() {
      this.listQuery.CommitStat = '';
      this.listQuery.pageIndex = 1;
      const { data } = await SelectUserReportInfo(this.listQuery);
      this.userTableData = data.DataList;
      this.listQuery.Total = data.Total;
    },
    async SelectUserReportInfoSubmitted() {
      this.listQuery1.pageIndex = 1;
      const { data } = await SelectUserReportInfo(this.listQuery1);
      this.SubmittedTableData = data.DataList;
      this.submittedCount = data.Total;
    },
    async SelectUserReportInfoNotSubmitted() {
      this.listQuery2.pageIndex = 1;
      const { data } = await SelectUserReportInfo(this.listQuery2);
      this.NotSubmittedTableData = data.DataList;
      this.NotSubmittedCout = data.Total;
    },
    async load() {
      if (
        this.listQuery.Total / this.listQuery.pageSize >
        this.listQuery.pageIndex
      ) {
        this.listQuery.pageIndex++;
        const { data } = await SelectUserReportInfo(this.listQuery);
        this.userTableData = this.userTableData.concat(data.DataList);
      }
    },
    async load1() {
      if (
        this.submittedCount / this.listQuery1.pageSize >
        this.listQuery1.pageIndex
      ) {
        this.listQuery1.pageIndex++;
        const { data } = await SelectUserReportInfo(this.listQuery1);
        this.SubmittedTableData = this.SubmittedTableData.concat(data.DataList);
      }
    },
    async load2() {
      if (
        this.NotSubmittedCout / this.listQuery2.pageSize >
        this.listQuery2.pageIndex
      ) {
        this.listQuery2.pageIndex++;
        const { data } = await SelectUserReportInfo(this.listQuery2);
        this.NotSubmittedTableData = this.NotSubmittedTableData.concat(
          data.DataList
        );
      }
    },
    parseTimes(value, type) {
      this.date = parseTime(new Date(), '{y}-{m}-{d}');
      this.listQuery.Dailydate = parseTime(new Date(), '{y}-{m}-{d}');
      this.listQuery1.Dailydate = parseTime(new Date(), '{y}-{m}-{d}');
      this.listQuery2.Dailydate = parseTime(new Date(), '{y}-{m}-{d}');
    },
    async select() {
      this.Statistics_my = true;
    },
    async SelectDaily(row) {
      this.Statistics_my = false;
      this.fileList = [];
      this.InsertDailyData.File_list = [];
      const { data } = await SelectDaily({
        UserID: row.UserID,
        Dailydate: this.date
      });
      /* const data2 = await SelectTaskView({
        state: '',
        priority: '',
        Type: 1,
        pageIndex: 1,
        pageSize: 100,
        UserID: window.userInfo[0].UserID
      }); */
      this.taskArr = data.DailyTask_list;
      this.DailyTableData = [];
      this.clickUserID = row.UserID;
      this.InsertDailyData = data;
      this.problem = data.Environment ? data.Environment.split('$') : [];
      this.ImgArr = this.InsertDailyData.Img ? this.InsertDailyData.Img.split('$') : [];
      this.userName = row.UserName;
      this.InsertDailyData.Daily_Name = row.UserName;
      this.InsertDailyData.File_list = data.File_list ? data.File_list : [];
    },

    async InsertDaily(IsCommit) {
      if (this.InsertDailyData.IsCommit === 1) {
        this.$confirm('您已提交过, 是否更新?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async() => {
            this.InsertDailyData.IsCommit = IsCommit;
            this.InsertDailyData.Environment = '';
            this.InsertDailyData.Environment = this.problem.join('$');
            this.InsertDailyData.Img = this.ImgArr.join('$');
            this.InsertDailyData.Dailydate = this.date;
            const { code, msg } = await InsertDaily(this.InsertDailyData);
            code === 200
              ? this.$message.success(msg)
              : this.$message.error(msg);
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        this.InsertDailyData.IsCommit = IsCommit;
        this.InsertDailyData.Environment = '';
        this.InsertDailyData.Environment = this.problem.join('$');
        this.InsertDailyData.Img = this.ImgArr.join('$');
        this.InsertDailyData.UserID = window.userInfo[0].UserID;
        this.InsertDailyData.Dailydate = this.date;
        const { code, msg } = await InsertDaily(this.InsertDailyData);
        code === 200 ? this.$message.success(msg) : this.$message.error(msg);
      }
    },
    addIssue() {
      this.problem.push('');
    },
    deleteIssue(index) {
      this.problem.splice(index, 1);
    },
    handleSuccess(response, file) {
      if (response.code === 200) {
        const data = response.data[0];
        this.InsertDailyData.File_list.push({
          FileID: 0,
          CheckID: 0,
          FileName: file.name,
          FileUrl: data.FileUrl.replace(/href=|'|"|Annex\/file\/|target="_blank"|rel="noopener"|>/g, ''),
          OpenFileUrl: data.OpenFileUrl
        });
      } else {
        this.$message.error(file.name + '上传失败');
      }
    },
    handleSuccessImg(response, file, fileList) {
      if (response.code === 200) {
        this.ImgArr.push(response.data[0].FileUrl);
      } else {
        this.ImgArr = [];
        this.$message.error(file.name + '上传失败');
      }
    },
    beforeImg(file) {
      console.log(file.response.data[0].FileUrl);
      this.ImgArr.splice(
        this.ImgArr.findIndex(item => item === file.response.data[0].FileUrl),
        1
      );
    },
    deleteImg(index) {
      this.ImgArr.splice(index, 1);
    },
    handleRemove() {
    },
    getDefaultDeptValues(val) {
      this.listQuery.DeptID = val;
      this.listQuery1.DeptID = val;
      this.listQuery2.DeptID = val;
      this.SelectUserReportInfoSubmitted();
      this.SelectUserReportInfoNotSubmitted();
      this.SelectUserReportInfo();
    },
    checkbox(item) {
      if (item.Ischecked) {
        this.taskArr.push({ ...item, ExpectedTarget: 0, Daily_Describe: '' });
      } else {
        this.taskArr.map((e, index) => {
          if (e.TaskID === item.TaskID) {
            this.taskArr.splice(index, 1);
          }
        });
      }
    },
    async SelectResultPer() {
      const { data } = await SelectResultPer({
        Dailydate: this.date,
        CreateUserID: window.userInfo[0].UserID
      });
      this.TaskViewArr = data;
      this.TaskViewArr.map(item => {
        item.Task_list.map(item2 => {
          this.taskArr.map(item3 => {
            if (item3.TaskID === item2.TaskID) {
              item2.Ischecked = true;
            }
          });
        });
      });
      this.drawer = true;
    }
  }
};
</script>

<style lang="scss">
.day {
  .el-aside,
  .el-main {
    margin: 0;
    padding: 0;
    height: calc(100vh - 120px) !important;
  }

  .el-aside {
    width: 23rem !important;

    .el-calendar-table .el-calendar-day {
      height: 30px;
    }

    .aside {
      display: flex;
      flex-direction: column; /* 垂直显示 */
      .is-selected {
        color: #1989fa;
      }

      .el-calendar__body {
        padding: 1px 0;
      }

      .user {
        flex: 1;
        display: flex;
        flex-direction: column; /* 垂直显示 */
        .select {
          display: flex;
          justify-content: space-between;
        }

        .row_infinite:hover {
          background: rgb(243, 244, 246);
          cursor: pointer;
        }

        .infinite {
          height: 50vh;
          overflow: auto;
          margin: 0 0 0 5px;
          padding: 0px;
        }

        li {
          list-style: none;
        }

        .infinite_name {
          height: 40px;
          background: rgb(68, 148, 173);
          border-radius: 5px;
          margin-right: 5px;
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

        .IsCommit {
          display: flex;

          p {
            flex: 1;
          }

          .el-button {
            widows: 10px;
            margin-top: 10px;
          }
        }
      }
    }
  }

  .el-main {
    margin-left: 10px;
    height: 88vh !important;

    .commit_1 {
      font-weight: bold;
      font-size: 25px;
    }

    .commit_2 {
      color: rgb(242, 127, 153);
      font-weight: bold;
      font-size: 25px;
    }

    .el-form-item {
      margin-bottom: 0px;
    }
  }

  .taskArr {
    /* .el-input__inner {
      border: 0px !important;
    } */
  }

  .el-checkbox {
    margin: 5rem auto;
  }

  .task {
    label {
      margin: 1.5rem 0.5rem;
    }

    div {
      margin: 0.3rem;

      p {
        font-size: 1rem;
        margin: 0px;
      }
    }
  }

  .task:hover {
    background: rgb(245, 247, 250);
  }
}
</style>
