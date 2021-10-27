<template>
  <el-container class="week">
    <transition name="el-zoom-in-center">
      <el-aside v-show="asideShow">
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
          <div style=" margin-top: 3px">
            <ul
              v-infinite-scroll="load"
              class="infinite infinite-list"
              style="overflow: auto"
            >
              <li @click="selectStatic">
                <el-row class="row_infinite">
                  <el-col :span="6">
                    <h2 class="infinite_name">公司</h2>
                  </el-col>
                  <el-col
                    :span="18"
                    style="height: 40px"
                  >
                    <el-row class="infinite_title">
                      <h3>周报提交情况</h3>
                    </el-row>

                  </el-col>
                </el-row>
              </li>
              <li
                v-for="item in userTableData"
                :key="item.UserID"
                class="infinite-list-item"
                @click="SelectWeekly(item)"
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
      </el-aside>
    </transition>
    <el-main>
      <el-container>
        <el-header>
          <div class="header">
            <div class="dept">
              <default-dept @getDefaultDeptsValue="getDefaultDeptValues" />
            </div>
            <div class="date_picker">
              <el-date-picker
                v-model="dateWeek"
                type="week"
                :format="listQuery.WeekStartDate+'到'+listQuery.WeekEndDate+'第WW周'"
                placeholder="选择周"
                size="mini"
                :picker-options="{'firstDayOfWeek': 1}"
                @change="changeDate"
              />
            </div>
          </div>
        </el-header>
        <el-main>
          <div
            v-show="staticShow"
            class="main_static"
          >
            <el-table
              v-el-table-infinite-scroll="load1"
              :data="SubmittedTableData"
              style="width: 100%; margin-top: 10px;"
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
              style="width: 100%;"
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
          <div
            v-show="!staticShow"
            class="main_personal"
          >
            <div class="main_personal_header">
              <div style="flex:1;">
                <el-form
                  :inline="true"
                  class="demo-form-inline"
                >
                  <el-form-item>
                    <el-button
                      size="mini"
                      type="text"
                      :icon="asideShow == true ? 'el-icon-d-arrow-left' : 'el-icon-d-arrow-right'"
                      @click="asideShow = !asideShow"
                    />
                  </el-form-item>
                  <el-form-item>
                    <span style="font-size: 20px">{{ userName }}：{{
                      listQuery.WeekStartDate
                    }}---{{ listQuery.WeekEndDate }}的周报</span>
                  </el-form-item>
                  <el-form-item>
                    <span style="font-size: 20px;cursor:pointer">
                      <el-tag
                        v-if="UserID === clickUserID"
                        size="mini"
                        @click="addDaily"
                      >更新</el-tag>
                    </span>
                  </el-form-item>
                </el-form>
              </div>
              <div style="width:70px">
                <el-form
                  :inline="true"
                  class="demo-form-inline"
                >
                  <el-form-item>
                    <el-button
                      v-if="clickUserID===UserID"
                      type="primary"
                      size="mini"
                      class="pan-btn blue-btn"
                      @click="InsertWeekly(1)"
                    >提交
                    </el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <div>
              <div>
                <el-radio-group
                  v-model="activeName"
                  size="mini"
                >
                  <el-radio-button label="目标进展" />
                  <el-radio-button label="本周okr进度" />
                  <el-radio-button label="本周工作总结" />
                  <el-radio-button label="下周工作计划" />
                </el-radio-group>
              </div>
              <div>
                <el-collapse v-model="activeName">
                  <el-collapse-item
                    title="目标进展"
                    name="目标进展"
                  >
                    <el-table
                      :data="weekForm.ObjectProgress"
                      style="width: 100%"
                      border
                      size="mini"
                    >
                      <el-table-column
                        prop="ObjectName"
                        label="目标名称"
                      />
                      <el-table-column
                        prop="ObjectContent"
                        label="目标内容"
                        align="center"
                      />
                      <el-table-column
                        label="成果数量"
                        prop="ResultCount"
                        align="center"
                        width="70"
                      >
                        <template slot-scope="{ row }">{{
                          row.ResultCount || 0
                        }}
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="对齐数量"
                        prop="AlignCount"
                        align="center"
                        width="70"
                      >
                        <template slot-scope="{ row }">
                          {{ row.AlignCount || 0 }}
                        </template>
                      </el-table-column>

                    </el-table>
                  </el-collapse-item>
                  <el-collapse-item
                    title="本周okr进度"
                    name="本周okr进度"
                  >
                    <el-table
                      :data="weekForm.WeekSurvey"
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

                    </el-table>
                  </el-collapse-item>
                  <el-collapse-item
                    title="本周工作总结"
                    name="本周工作总结"
                  >
                    <el-form
                      class="demo-form-inline"
                      label-position="top"
                    >
                      <el-form-item label="重点展示任务">
                        <el-table
                          :data="weekForm.Summary.WeeklyTask_List"
                          style="width: 100%"
                          size="mini"
                          border
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
                                placeholder="当前进度"
                                clearable
                                style="width:80px"
                              />
                              %
                              {{ row.CompletedProgress }}%
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
                      </el-form-item>
                      <el-form-item label="其他事项">
                        <el-input
                          v-model="weekForm.Summary.OtherMatter"
                          type="textarea"
                        />
                      </el-form-item>
                      <el-form-item label="工作总结">
                        <el-input
                          v-model="weekForm.Summary.JobSummary"
                          type="textarea"
                        />
                      </el-form-item>
                      <el-form-item label="信心指数">
                        <el-rate
                          v-model="weekForm.Summary.Mood"
                          show-text
                        />
                      </el-form-item>
                      <el-form-item label="备注">
                        <el-input
                          v-model="weekForm.Summary.Remake"
                          type="textarea"
                        />
                      </el-form-item>
                      <el-form-item label="心得分享">
                        <el-input
                          v-model="weekForm.Summary.ExperienceSharing"
                          type="textarea"
                        />
                      </el-form-item>
                      <!-- <el-form-item label="问题&帮助">
                        <div
                          v-for="(item, index) in problem"
                          :key="index"
                          style="display:flex;"
                        >
                          <div style="flex:1">
                            <el-input
                              v-model="problem[index]"
                              size="mini"
                            ><i slot="prefix">{{ index+1 }}：</i></el-input>
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
                        <el-link
                          :underline="false"
                          type="primary"
                          icon="el-icon-plus"
                          @click="addIssue()"
                        >添加问题</el-link>
                      </el-form-item> -->

                      <el-form-item label="已上传的图片">
                        <span
                          v-for="(itemImg, indexImg) in ImgArr||[]"
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
                    </el-form>
                  </el-collapse-item>
                  <el-collapse-item
                    title="下周工作计划"
                    name="下周工作计划"
                  >
                    <el-form
                      class="demo-form-inline"
                      label-position="top"
                    >
                      <el-form-item label="重点任务">
                        <el-table
                          :data="weekForm.nextWeekPlan.WeeklyTask_List"
                          style="width: 100%"
                          size="mini"
                          border
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
                                placeholder="当前进度"
                                clearable
                                style="width:150px"
                              />
                              %
                              {{ row.CompletedProgress }}%
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

                      </el-form-item>
                      <el-form-item label="关注事项">
                        <div
                          v-for="(item, index) in matterArr"
                          :key="index"
                          style="display:flex;"
                        >
                          <div style="flex:1">
                            <el-input
                              v-model="matterArr[index]"
                              size="mini"
                            ><i slot="prefix">{{ index + 1 }}：</i></el-input>
                          </div>
                          <div>
                            <el-link
                              :underline="false"
                              type="primary"
                              icon="el-icon-delete"
                              @click="deleteMatter(index)"
                            />
                          </div>
                        </div>

                      </el-form-item>
                    </el-form>
                  </el-collapse-item>
                </el-collapse>
              </div>
            </div>
          </div>
          <el-dialog
            title="添加周报"
            :visible.sync="weekDialog"
            :width="device === 'mobile' ? '90%' : '60%'"
          >
            <div style="height:calc(100vh - 250px);overflow:auto">
              <div>
                <flow
                  :value="['本周工作总结','下周工作计划']"
                  @checked="checked"
                />
              </div>
              <div v-show="clickFlow === '本周工作总结'">
                <el-form
                  class="demo-form-inline"
                  label-position="top"
                >
                  <el-form-item label="重点展示任务">
                    <el-table
                      :data="weekForm.Summary.WeeklyTask_List"
                      style="width: 100%"
                      size="mini"
                      border
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
                            placeholder="当前进度"
                            clearable
                            style="width:80px"
                          />
                          %
                          {{ row.CompletedProgress }}%
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
                        @click="GetResultWeek()"
                      >添加任务</el-link>
                    </span>
                  </el-form-item>
                  <el-form-item label="其他事项">
                    <el-input
                      v-model="weekForm.Summary.OtherMatter"
                      type="textarea"
                    />
                  </el-form-item>
                  <el-form-item label="工作总结">
                    <el-input
                      v-model="weekForm.Summary.JobSummary"
                      type="textarea"
                    />
                  </el-form-item>
                  <el-form-item label="信心值">
                    <el-rate
                      v-model="weekForm.Summary.Mood"
                      show-text
                    />
                  </el-form-item>
                  <el-form-item label="备注">
                    <el-input
                      v-model="weekForm.Summary.Remake"
                      type="textarea"
                    />
                  </el-form-item>
                  <el-form-item label="心得分享">
                    <el-input
                      v-model="weekForm.Summary.ExperienceSharing"
                      type="textarea"
                    />
                  </el-form-item>
                  <!-- <el-form-item label="问题&帮助">
                    <div
                      v-for="(item, index) in problem"
                      :key="index"
                      style="display:flex;"
                    >
                      <div style="flex:1">
                        <el-input
                          v-model="problem[index]"
                          size="mini"
                        ><i slot="prefix">{{ index+1 }}：</i></el-input>
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
                    <el-link
                      :underline="false"
                      type="primary"
                      icon="el-icon-plus"
                      @click="addIssue()"
                    >添加问题</el-link>
                  </el-form-item> -->
                  <el-form-item label="上传照片">
                    <el-upload
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
                      v-for="(itemImg, indexImg) in ImgArr||[]"
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
                </el-form>
              </div>
              <div v-show="clickFlow === '下周工作计划'">
                <el-form
                  class="demo-form-inline"
                  label-position="top"
                >
                  <el-form-item label="重点任务">
                    <el-table
                      :data="weekForm.nextWeekPlan.WeeklyTask_List"
                      style="width: 100%"
                      size="mini"
                      border
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
                            placeholder="当前进度"
                            clearable
                            style="width:150px"
                          />
                          %
                          {{ row.CompletedProgress }}%
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
                        @click="GetResultWeek"
                      >添加任务</el-link>
                    </span>
                  </el-form-item>
                  <el-form-item label="关注事项">
                    <div
                      v-for="(item, index) in matterArr"
                      :key="index"
                      style="display:flex;"
                    >
                      <div style="flex:1">
                        <el-input
                          v-model="matterArr[index]"
                          size="mini"
                        ><i slot="prefix">{{ index + 1 }}：</i></el-input>
                      </div>
                      <div>
                        <el-link
                          :underline="false"
                          type="primary"
                          icon="el-icon-delete"
                          @click="deleteMatter(index)"
                        />
                      </div>
                    </div>
                    <el-link
                      :underline="false"
                      type="primary"
                      icon="el-icon-plus"
                      @click="addMatter()"
                    >添加事项
                    </el-link>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <span
              slot="footer"
              class="dialog-footer"
            >
              <el-button
                size="small"
                @click="weekDialog = false"
              >取 消</el-button>
              <el-button
                type="primary"
                size="small"
                @click="InsertWeekly(weekForm.IsCommit)"
              >确 定</el-button>
            </span>
          </el-dialog>
          <el-drawer
            :visible.sync="drawerWeek"
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
                  @click="drawerWeek = false"
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
                    <h3>{{ item.TaskWeek_list ? item.TaskWeek_list.length : 0 }}个任务</h3>
                  </el-col>
                </el-row>
                <el-row
                  v-for="(item2, index2) in item.TaskWeek_list"
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
                    <el-row style="color: rgb(163, 166, 170)">
                      截止日期:{{ item2.EndDate ? item2.EndDate.replace('T', '') : '' }}
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
    </el-main>
  </el-container>
</template>
<script>
import { SelectUserReportInfo } from '@/api/okr/public';
import { InsertWeekly, SelectWeekly } from '@/api/okr/week';
import { GetResultWeek } from '@/api/okr/Result';
import defaultDept from '@/views/components/defaultDept';
import elTableInfiniteScroll from 'el-table-infinite-scroll';
import dayjs from 'dayjs';
import flow from '@/views/components/okr/flow';
import { mapGetters } from 'vuex';

export default {
  components: { defaultDept, flow },
  directives: {
    'el-table-infinite-scroll': elTableInfiniteScroll
  },
  data() {
    return {
      listQuery: {
        WeekStartDate: null,
        WeekEndDate: null,
        Type: 2,
        UserName: '',
        DeptID: '',
        pageIndex: 1,
        pageSize: 15,
        UserID: window.userInfo[0].UserID
      },
      listQuery1: {
        WeekStartDate: null,
        WeekEndDate: null,
        Type: 2,
        UserName: '',
        CommitState: '已提交',
        DeptID: '',
        pageIndex: 1,
        pageSize: 15
      },
      listQuery2: {
        WeekStartDate: null,
        WeekEndDate: null,
        Type: 2,
        UserName: '',
        CommitState: '未提交',
        DeptID: '',
        pageIndex: 1,
        pageSize: 15
      },
      submittedCount: 0,
      NotSubmittedCout: 0,
      UserID: window.userInfo[0].UserID,
      userTableData: [],
      startDate: null,
      endDate: null,
      dateWeek: '',
      asideShow: true,
      staticShow: true,
      SubmittedTableData: [],
      NotSubmittedTableData: [],
      userName: '',
      weekForm: {
        WeeklyID: 0,
        UserID: window.userInfo[0].UserID,
        IsCommit: 1,
        WeekStartDate: '',
        WeekEndDate: '',
        Year: '',
        Summary: {
          OtherMatter: '',
          JobSummary: '',
          Mood: 0,
          MoodLabel: '',
          Remake: '',
          ExperienceSharing: '',
          Img: '',
          Environment: '',
          WeeklyTask_List: []
        },
        nextWeekPlan: {
          Concerns: '',
          WeeklyTask_List: []
        },
        ObjectProgress: [],
        WeekSurvey: []

      },
      ImgArr: [],
      matterArr: [],
      problem: [''],
      iconClasses: ['icon-rate-face-1', 'icon-rate-face-2', 'icon-rate-face-3'],
      activeName: '目标进展',
      overviewWeek: '本周创建',
      weekDialog: false,
      clickFlow: '本周工作总结',
      clickUserID: window.userInfo[0].UserID,
      drawerWeek: false,
      TaskViewArr: [],
      customColors: [
        { color: '#f56c6c', percentage: 20 },
        { color: '#e6a23c', percentage: 40 },
        { color: '#5cb87a', percentage: 60 },
        { color: '#1989fa', percentage: 80 },
        { color: '#6f7ad3', percentage: 100 }
      ]

    };
  },
  computed: {
    ...mapGetters(['device'])
  },
  watch: {
    'listQuery.UserName': {
      deep: true,
      handler(newVal, oldVal) {
        this.debounce(this.SelectUserReportInfo, 500);
      }
    }
  },
  created() {
    this.dateWeek = new Date();
    const day = this.dateWeek.getDay() || 7;

    this.listQuery.WeekStartDate =
      this.listQuery1.WeekStartDate =
        this.listQuery2.WeekStartDate = this.splitDate(
          new Date(this.dateWeek.getFullYear(),
            this.dateWeek.getMonth(),
            this.dateWeek.getDate() + 1 - day));
    this.listQuery.WeekEndDate =
      this.listQuery1.WeekEndDate =
        this.listQuery2.WeekEndDate =
          this.splitDate(dayjs(this.listQuery.WeekStartDate).add(6, 'day').$d);
    this.SelectUserReportInfo();
    this.SelectUserReportInfoSubmitted();
    this.SelectUserReportInfoNotSubmitted();
  },
  methods: {
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
    // 防抖
    debounce(fn, wait) {
      if (this.timer !== null) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(fn, wait);
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
        this.NotSubmittedTableData = this.NotSubmittedTableData.concat(data.DataList);
      }
    },
    async select() {

    },
    async changeDate(val) {
      this.listQuery.WeekStartDate =
        this.listQuery1.WeekStartDate =
          this.listQuery2.WeekStartDate =
            this.splitDate(dayjs(val).subtract(1, 'day').$d);
      this.listQuery.WeekEndDate =
        this.listQuery1.WeekEndDate =
          this.listQuery2.WeekEndDate =
            this.splitDate(dayjs(this.listQuery.WeekStartDate).add(6, 'day').$d);
      this.SelectUserReportInfo();
      this.SelectUserReportInfoSubmitted();
      this.SelectUserReportInfoNotSubmitted();
      const { data } = await SelectWeekly({
        WeekStartDate: this.listQuery.WeekStartDate,
        WeekEndDate: this.listQuery.WeekEndDate,
        UserID: this.clickUserID,
        Type: 2
      });
      this.weekForm = data;
      this.ImgArr = data.Summary.Img ? data.Summary.Img.split('$') : [];
      this.problem = data.Summary.Environment ? data.Summary.Environment.split('$') : [];
      this.matterArr = data.nextWeekPlan.Concerns ? data.nextWeekPlan.Concerns.split('$') : [];
    },
    splitDate(date) {
      return dayjs(date).format('YYYY-MM-DD');
    },
    getDefaultDeptValues(val) {
      this.listQuery.DeptID = val;
      this.listQuery1.DeptID = val;
      this.listQuery2.DeptID = val;
      this.SelectUserReportInfo();
      this.SelectUserReportInfoSubmitted();
      this.SelectUserReportInfoNotSubmitted();
    },
    selectStatic() {
      this.staticShow = true;
      this.SelectUserReportInfoSubmitted();
      this.SelectUserReportInfoNotSubmitted();
    },
    async addDaily() {
      Object.assign(
        this.$data.weekForm,
        this.$options.data().weekForm
      );
      this.weekDialog = true;
      const { data } = await SelectWeekly({
        WeekStartDate: this.listQuery.WeekStartDate,
        WeekEndDate: this.listQuery.WeekEndDate,
        UserID: this.clickUserID,
        Type: 2
      });
      this.weekForm = data;
      this.ImgArr = data.Summary.Img ? data.Summary.Img.split('$') : [];
      this.problem = data.Summary.Environment ? data.Summary.Environment.split('$') : [];
      this.matterArr = data.nextWeekPlan.Concerns ? data.nextWeekPlan.Concerns.split('$') : [];
    },
    async checked(val) {
      this.clickFlow = val.title;
      let WeekStartDate = this.listQuery.WeekStartDate;
      let WeekEndDate = this.listQuery.WeekEndDate;
      if (val.title === '下周工作计划') {
        const WeekDate = this.splitDate(dayjs(new Date()).subtract(1, 'day').$d);
        WeekStartDate = this.splitDate(dayjs(WeekDate).add(7, 'day').$d);
        WeekEndDate = this.splitDate(dayjs(WeekDate).add(13, 'day').$d);
      }
      const { data } = await GetResultWeek({
        WeekStartDate: WeekStartDate,
        WeekEndDate: WeekEndDate,
        CreateUserID: window.userInfo[0].UserID,
        TaskType: val.title === '下周工作计划' ? 2 : 1
      });
      if (val.title === '本周工作总结') {
        this.weekForm.Summary.WeeklyTask_List.map(item => {
          data.map(item2 => {
            item2.TaskWeek_list.map(item3 => {
              if (item3.TaskID === item.TaskID) {
                item3.Ischecked = true;
              }
            });
          });
        });
        this.TaskViewArr = data;
      } else {
        this.weekForm.nextWeekPlan.WeeklyTask_List.map(item => {
          data.map(item2 => {
            item2.TaskWeek_list.map(item3 => {
              if (item3.TaskID === item.TaskID) {
                item3.Ischecked = true;
              }
            });
          });
        });
        this.TaskViewArr = data;
      }
    },
    deleteIssue(index) {
      this.problem.splice(index, 1);
    },
    addIssue() {
      this.problem.push('');
    },
    addMatter() {
      this.matterArr.push('');
    },
    deleteMatter() {
      this.matterArr.push('');
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
      this.ImgArr.splice(
        this.ImgArr.findIndex(
          item => item === file.response.data[0].FileUrl
        ),
        1
      );
    },
    async InsertWeekly(val = 0) {
      this.weekForm.Summary.Environment = this.problem.join('$');
      this.weekForm.Summary.Img = this.ImgArr.join('$');
      this.weekForm.nextWeekPlan.Concerns = this.matterArr.join('$');
      this.weekForm.UserID = window.userInfo[0].UserID;
      this.weekForm.IsCommit = val;
      const { code, msg } = await InsertWeekly({
        ...this.weekForm,
        WeekStartDate: this.listQuery.WeekStartDate,
        WeekEndDate: this.listQuery.WeekEndDate
      });
      code === 200 ? this.$message.success(msg) : this.$message.error(msg);
      this.SelectWeekly();
      this.weekDialog = false;
    },
    async SelectWeekly(item) {
      this.staticShow = false;
      this.userName = item.UserName || window.userInfo[0].UserName;
      this.clickUserID = item.UserID || window.userInfo[0].UserID;
      const { data } = await SelectWeekly({
        WeekStartDate: this.listQuery.WeekStartDate,
        WeekEndDate: this.listQuery.WeekEndDate,
        UserID: item.UserID || window.userInfo[0].UserID,
        Type: 2
      });
      this.weekForm = data;
      this.ImgArr = data.Summary.Img ? data.Summary.Img.split('$') : [];
      this.problem = data.Summary.Environment ? data.Summary.Environment.split('$') : [];
      this.matterArr = data.nextWeekPlan.Concerns ? data.nextWeekPlan.Concerns.split('$') : [];
      const data2 = await GetResultWeek({
        WeekStartDate: this.listQuery.WeekStartDate,
        WeekEndDate: this.listQuery.WeekEndDate,
        CreateUserID: window.userInfo[0].UserID,
        TaskType: 1 /* 1本周，2下周 */
      });
      this.TaskViewArr = data2.data;
    },
    async GetResultWeek() {
      this.drawerWeek = true;
    },
    checkbox(item) {
      if (item.Ischecked) {
        this.clickFlow === '下周工作计划' ? this.weekForm.nextWeekPlan.WeeklyTask_List.push({
          ...item,
          ExpectedTarget: 0,
          Daily_Describe: ''
        }) : this.weekForm.Summary.WeeklyTask_List.push({ ...item, ExpectedTarget: 0, Daily_Describe: '' });
      } else {
        this.weekForm.Summary.WeeklyTask_List.map((e, index) => {
          if (e.TaskID === item.TaskID) {
            this.clickFlow === '下周工作计划' ? this.weekForm.nextWeekPlan.WeeklyTask_List.splice(index, 1) : this.weekForm.Summary.WeeklyTask_List.splice(index, 1);
          }
        });
      }
    }
  }
};
</script>
<style lang="scss">
.week {
  .el-aside,
  .el-main {
    margin: 5px 0 0 0;
    padding: 0;
  }

  .el-aside {
    height: calc(100vh - 100px);
    width: 250px !important;

    .user {
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
        height: calc(100vh - 150px);
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
        overflow: hidden;
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

  .el-main {
    height: 100vh !important;

    .el-header {
      height: 20px !important;

      .el-input--mini .el-input__inner {
        height: 28px;
        line-height: 28px;
        width: 250px;
      }

      .header {
        display: flex;

        .date_picker {
          width: 240px;
        }

        .dept {
          flex: 1;
        }
      }
    }

    .el-main {
      margin: 0 0 0 20px;
      height: 95vh !important;

      .main_static {
        height: 90vh;
      }

      .main_personal {
        .main_personal_header {
          display: flex;
          margin-top: 3px;

          .el-form-item {
            margin-bottom: 0px;
          }
        }
      }

      .commit_1 {
        font-weight: bold;
        font-size: 25px;
      }

      .commit_2 {
        color: rgb(242, 127, 153);
        font-weight: bold;
        font-size: 25px;
      }
    }
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
}
</style>
