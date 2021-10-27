<template>
  <el-container class="committee">
    <el-header>
      <el-row>
        <el-col
          :span="4"
          :md="4"
          :lg="4"
          :xl="3"
          :xs="9"
        >
          <el-radio-group
            v-model="radio"
            size="small"
          >
            <el-radio-button label="委员会" />
            <el-radio-button label="会议明细" />
          </el-radio-group>
        </el-col>
        <el-col
          :span="20"
          :md="20"
          :lg="20"
          :xl="20"
          :xs="14"
        >
          <el-form
            :inline="true"
            size="mini"
          >
            <el-form-item v-if="radio == '委员会'">
              <el-button
                icon="el-icon-plus"
                size="mini"
                type="primary"
                @click="add"
              >工作职责
              </el-button>
            </el-form-item>
            <el-form-item v-if="radio != '委员会'">
              <el-button
                icon="el-icon-plus"
                size="mini"
                type="primary"
                @click="addMeting"
              >新增会议
              </el-button>
            </el-form-item>
            <el-form-item v-if="radio == '委员会'">
              <el-input
                v-model="pagination.CommitteeName"
                placeholder="委员会名称"
                clearable
                @keyup.enter.native="SelectCommittee('搜索')"
              ><i
                slot="prefix"
                class="el-input__icon el-icon-search"
              /></el-input>
            </el-form-item>
            <el-form-item v-if="radio != '委员会'">
              <el-input
                v-model="MeetingTableDataVal.MeetingName"
                placeholder="会议名称"
                clearable
                @keyup.enter.native="SelectMeeting('搜索')"
              ><i
                slot="prefix"
                class="el-input__icon el-icon-search"
              /></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="info"
                icon="el-icon-search"
                size="mini"
                @click="
                  radio == '委员会'
                    ? SelectCommittee('搜索')
                    : SelectMeeting('搜索')
                "
              >查询
              </el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <transition name="el-zoom-in-center">
        <el-table
          v-if="radio == '委员会'"
          v-loading="loading"
          element-loading-text="拼命加载中"
          :data="tableData"
          style="width: 100%"
          height="calc(100vh - 160px)"
          border
          size="mini"
          stripe
        >
          <el-table-column
            prop="CommitteeName"
            label="委员会名称"
            :show-overflow-tooltip="cellOverflow"
          />
          <el-table-column
            prop="Director"
            label="主任"
            :show-overflow-tooltip="cellOverflow"
          />
          <el-table-column
            prop="DeputyDirector"
            label="副主任"
            :show-overflow-tooltip="cellOverflow"
          />
          <el-table-column
            prop="Secretary"
            label="秘书"
            :show-overflow-tooltip="cellOverflow"
          />
          <el-table-column
            prop="CreateDate"
            label="成立时间"
            width="150"
            align="center"
          >
            <template slot-scope="{ row }">
              {{ row.CreateDate.split('T').join(' ') }}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="120"
          >
            <template slot-scope="{ row }">
              <el-button
                size="mini"
                circle
                icon="el-icon-view"
                @click="seeRow(row)"
              />
              <el-button
                size="mini"
                circle
                icon="el-icon-edit"
                @click="editor(row)"
              />
              <el-button
                size="mini"
                circle
                type="danger"
                icon="el-icon-delete"
                @click="DeleteCommittee(row)"
              />
            </template>
          </el-table-column>
        </el-table>
      </transition>
      <transition name="el-zoom-in-center">
        <el-table
          v-if="radio != '委员会'"
          v-loading="loading"
          element-loading-text="拼命加载中"
          :data="MeetingTableData"
          style="width: 100%"
          height="calc(100vh - 160px)"
          border
          size="mini"
          stripe
        >
          <el-table-column
            prop="MeetingName"
            label="会议名称"
            align="center"
          />
          <el-table-column
            prop="MeetingSite"
            label="会议地点"
            align="center"
          />
          <el-table-column
            prop="MeetintDate"
            label="会议时间"
            align="center"
          >
            <template slot-scope="{ row }">
              {{ parseTimes(row.MeetintDate) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="MeetingHost"
            label="主持人"
            align="center"
          />
          <el-table-column label="操作">
            <template slot-scope="{ row }">
              <el-button
                size="mini"
                circle
                icon="el-icon-view"
                @click="editorMeeting(row, '查看')"
              />
              <el-button
                size="mini"
                circle
                icon="el-icon-edit"
                @click="editorMeeting(row, '修改')"
              />
              <el-popconfirm
                confirm-button-text="是"
                cancel-button-text="否"
                icon="el-icon-info"
                icon-color="red"
                title="确定删除吗？"
                @confirm="DeleteMeeting(row)"
              >
                <el-button
                  slot="reference"
                  size="mini"
                  circle
                  type="danger"
                  icon="el-icon-delete"
                />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </transition>
      <!--添加修改工作职责begin -->
      <el-dialog
        :title="dialogTitle"
        :visible.sync="DialogVisible"
        :width="device === 'desktop' ? '60%' : '99%'"
        :top="device === 'desktop' ? '3%' : '0%'"
      >
        <el-tabs v-model="activeName">
          <el-tab-pane
            label="基本资料"
            name="first"
            style="height: 620px; overflow-y: auto"
          >
            <el-form
              ref="listQuery"
              :inline="true"
              label-width="92px"
              class="fromType"
              :model="listQuery"
              :rules="rules"
              size="mini"
            >
              <el-form-item
                label="委员会名称"
                prop="CommitteeName"
              >
                <el-input v-model="listQuery.CommitteeName" />
              </el-form-item>
              <el-form-item
                label="任期"
                prop="Term_of_Office"
              >
                <el-input v-model="listQuery.Term_of_Office" />
              </el-form-item>
              <el-form-item
                label="主任"
                prop="Director"
              >
                <el-input v-model="listQuery.Director" />
              </el-form-item>
              <el-form-item
                label="副主任"
                prop="DeputyDirector"
              >
                <el-input v-model="listQuery.DeputyDirector" />
              </el-form-item>
              <el-form-item
                label="秘书"
                prop="Secretary"
              >
                <el-input v-model="listQuery.Secretary" />
              </el-form-item>
              <el-form-item
                label="现任委员会成立时间"
                prop="SetUpdate"
                label-width="138px"
              >
                <el-date-picker
                  v-model="listQuery.SetUpdate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
            </el-form>
            <el-form
              size="mini"
              :model="listQuery"
              :rules="rules"
            >
              <el-form-item
                label="成员"
                prop="Member"
                :model="listQuery"
                :rules="rules"
              >
                <el-input
                  v-model="listQuery.Member"
                  type="textarea"
                />
              </el-form-item>
              <el-form-item
                v-if="Insert"
                label="附件上传"
                prop="Member"
              >
                <el-upload
                  :multiple="true"
                  :show-file-list="true"
                  :on-success="handleSuccess"
                  :before-upload="() => beforeUpload('成员')"
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
              <el-form-item label="工作制度">
                <el-input
                  v-model="listQuery.WorkSystem"
                  type="textarea"
                />
              </el-form-item>
              <el-form-item
                v-if="Insert"
                label="附件上传"
              >
                <el-upload
                  :multiple="true"
                  :show-file-list="true"
                  :on-success="handleSuccess"
                  :before-upload="() => beforeUpload('工作制度')"
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
              <el-form-item label="工作职责">
                <el-input
                  v-model="listQuery.WorkDuty"
                  type="textarea"
                />
              </el-form-item>
              <el-form-item
                v-if="Insert"
                label="附件上传"
              >
                <el-upload
                  :multiple="true"
                  :show-file-list="true"
                  :on-success="handleSuccess"
                  :before-upload="() => beforeUpload('工作职责')"
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
              <el-form-item label="工作计划">
                <el-input
                  v-model="listQuery.WorkPlan"
                  type="textarea"
                />
              </el-form-item>
              <el-form-item
                v-if="Insert"
                label="附件上传"
              >
                <el-upload
                  :multiple="true"
                  :show-file-list="true"
                  :on-success="handleSuccess"
                  :before-upload="() => beforeUpload('工作计划')"
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
              <el-form-item label="备注">
                <el-input
                  v-model="listQuery.Remake"
                  type="textarea"
                />
              </el-form-item>
            </el-form>
            <el-table
              :data="listQuery.Committee_File_List"
              border
              style="width: 100%"
              size="mini"
            >
              <el-table-column
                prop="FileName"
                label="文件名"
              >
                <template slot-scope="{ row }">
                  <el-link
                    :href="row.OpenFileUrl"
                    target="_blank"
                  >{{
                    row.FileName
                  }}
                  </el-link>
                </template>
              </el-table-column>
              <el-table-column
                prop="Type"
                label="文件类型"
              />
              <el-table-column
                prop="FileUrl"
                label="下载"
                width="100px"
                align="center"
              >
                <template slot-scope="{ row }">
                  <el-link
                    :href="row.FileUrl"
                    target="_blank"
                  >点击下载
                  </el-link>
                </template>
              </el-table-column>
              <el-table-column
                prop="OpenFileUrl"
                label="查看"
                width="50px"
              >
                <template slot-scope="{ row }">
                  <el-link
                    target="_blank"
                    @click="PreviewFile(row.FileUrl)"
                  >预览
                  </el-link>
                </template>
              </el-table-column>
              <el-table-column
                prop="OpenFileUrl"
                label="删除"
                width="50px"
                align="center"
              >
                <template slot-scope="{ $index }">
                  <span><i
                    style="cursor: pointer"
                    class="el-icon-delete"
                    @click="deleteCommitteeFile($index)"
                  /></span>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane
            v-if="!Insert"
            label="会议明细"
            name="third"
            style="height: 620px; overflow-y: auto"
          >
            <el-row
              v-for="(item, index) in listQuery.Meeting_List"
              :key="index"
            >
              <el-divider v-if="index != 0" />
              <el-form
                ref="rulesMeeting"
                size="mini"
                :inline="true"
                label-width="80px"
                :model="Meeting_List"
                :rules="rulesMeeting"
              >
                <el-form-item
                  label="会议名称"
                  prop="MeetingName"
                >
                  <el-input
                    v-model="item.MeetingName"
                    placeholder="会议名称"
                  />
                </el-form-item>
                <el-form-item
                  label="委员会"
                  prop="CommitteeID"
                >
                  <el-input
                    v-model="item.CommitteeID"
                    placeholder="委员会"
                  />
                </el-form-item>
                <el-form-item
                  label="科室"
                  prop="DeptName"
                >
                  <el-input
                    v-model="item.DeptName"
                    placeholder="科室"
                  />
                </el-form-item>
                <el-form-item
                  label="会议地点"
                  prop="MeetingSite"
                >
                  <el-input
                    v-model="item.MeetingSite"
                    placeholder="会议地点"
                  />
                </el-form-item>
                <el-form-item
                  label="会议时间"
                  prop="MeetintDate"
                >
                  <el-date-picker
                    v-model="item.MeetintDate"
                    type="date"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                  />
                </el-form-item>
                <el-form-item
                  label="主持人"
                  prop="MeetingHost"
                >
                  <el-input
                    v-model="item.MeetingHost"
                    type="textarea"
                  />
                </el-form-item>
                <el-form-item
                  label="记录人"
                  prop="RecordUser"
                >
                  <el-input
                    v-model="item.RecordUser"
                    type="textarea"
                  />
                </el-form-item>
                <el-form-item
                  label="参会委员"
                  prop="MeetingUser"
                >
                  <el-input
                    v-model="item.MeetingUser"
                    type="textarea"
                    placeholder="参会委员"
                  />
                </el-form-item>
                <el-form-item label="缺席者">
                  <el-input
                    v-model="item.AbsentUser"
                    type="textarea"
                    placeholder="缺席者"
                  />
                </el-form-item>
              </el-form>
              <el-form
                size="mini"
                label-position="top"
                class="demo-form-inline"
              >
                <!-- <el-form-item label="质量指标分析">
                  <el-input
                    type="textarea"
                    v-model="item.Analysis"
                    placeholder="质量指标分析（包括质量指标名称、未达目标值分析原因、未达目标值改善措施）"
                  />
                </el-form-item>
                <el-form-item label="业务报告">
                  <el-input
                    type="textarea"
                    v-model="item.BusinessReport"
                    placeholder="业务报告"
                  />
                </el-form-item>
                <el-form-item label="病例讨论">
                  <el-input
                    type="textarea"
                    v-model="item.ProportionToDiscuss"
                    placeholder="病例讨论"
                  />
                </el-form-item>
                <el-form-item label="医疗隐患、医疗安全不良事件总结分析">
                  <el-input
                    type="textarea"
                    v-model="item.SummaryAnalysis"
                    placeholder="医疗隐患、医疗安全不良事件总结分析（包括并发症、医疗纠纷事件分析）"
                  />
                </el-form-item>
                <el-form-item label="运行病历和归档病历情况讨论">
                  <el-input
                    type="textarea"
                    v-model="item.MedicalRecords"
                    placeholder="运行病历和归档病历情况讨论（包括出院病历三日归档率目标完成90%，科室病历检查平均分，甲乙丙级病例数等）"
                  />
                </el-form-item>
                <el-form-item label="科室内部事务">
                  <el-input
                    type="textarea"
                    v-model="item.InternalAffairs"
                    placeholder="科室内部事务"
                  />
                </el-form-item>
                <el-form-item label="院部精神传达">
                  <el-input
                    type="textarea"
                    v-model="item.Spirit"
                    placeholder="院部精神传达（包括会议、文件等）"
                  />
                </el-form-item>
                <el-form-item label="下次科室计划">
                  <el-input
                    type="textarea"
                    v-model="item.DeptPlan"
                    placeholder="下次科室计划（包括业务学习等）"
                  />
                </el-form-item>
                <el-form-item label="科室成员反馈意见">
                  <el-input
                    type="textarea"
                    v-model="item.Feedback"
                    placeholder="科室成员反馈意见"
                  />
                </el-form-item>
                <el-form-item label="其他">
                  <el-input
                    type="textarea"
                    v-model="item.Other"
                    placeholder="其他（包括科室业务发展方向、进修计划等）"
                  />
                </el-form-item>
                <el-form-item label="上次会议结果落实情况追踪">
                  <el-input
                    type="textarea"
                    v-model="item.AbsentUser"
                    placeholder="上次会议结果落实情况追踪"
                  />
                </el-form-item> -->

                <el-form-item label="会议内容及会议表决结果">
                  <el-input
                    v-model="Meeting_List.MeetingContent"
                    type="textarea"
                    placeholder="会议内容及会议表决结果"
                  />
                </el-form-item>
                <el-form-item label="已上传的图片">
                  <span
                    v-for="(itemImg, indexImg) in item.MeetingImg_List"
                    :key="indexImg"
                  >
                    <el-image
                      style="width: 100px; height: 100px"
                      :src="itemImg.ImgUrl"
                      :preview-src-list="[itemImg.ImgUrl]"
                    />
                    <span><i
                      style="cursor: pointer"
                      class="el-icon-delete"
                      @click="deleteImg(indexImg)"
                    /></span>
                  </span>
                </el-form-item>
              </el-form>
              <el-table
                :data="item.Meeting_File_List"
                border
                style="width: 100%"
                size="mini"
              >
                <el-table-column
                  prop="FileName"
                  label="文件名"
                >
                  <template slot-scope="{ row }">
                    <el-link
                      :href="row.OpenFileUrl"
                      target="_blank"
                    >{{
                      row.FileName
                    }}
                    </el-link>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="Type"
                  label="文件类型"
                />
                <el-table-column
                  prop="FileUrl"
                  label="下载"
                  width="100px"
                  align="center"
                >
                  <template slot-scope="{ row }">
                    <el-link
                      :href="row.FileUrl"
                      target="_blank"
                    >点击下载
                    </el-link>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="OpenFileUrl"
                  label="查看"
                  width="50px"
                >
                  <template slot-scope="{ row }">
                    <el-link
                      target="_blank"
                      @click="PreviewFile(row.FileUrl)"
                    >预览
                    </el-link>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="OpenFileUrl"
                  label="删除"
                  width="50px"
                  align="center"
                >
                  <template slot-scope="{ $index }">
                    <span><i
                      style="cursor: pointer"
                      class="el-icon-delete"
                      @click="deleteMeetingFile($index)"
                    /></span>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
          </el-tab-pane>
        </el-tabs>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            size="small"
            @click="DialogVisible = false"
          >关闭</el-button>
          <el-button
            v-if="Insert"
            type="primary"
            size="small"
            @click="
              dialogTitle === '新增' ? InsertCommittee() : UpdateCommittee()
            "
          >提交</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :title="dialogMeetingTitle"
        :visible.sync="meetingDialog"
        :width="device === 'desktop' ? '60%' : '99%'"
        :top="device === 'desktop' ? '5%' : '0%'"
        destroy-on-close
      >
        <div style="height: calc(100vh - 250px); overflow-y: auto">
          <el-form
            ref="rulesMeeting"
            size="mini"
            :inline="true"
            label-width="80px"
            :model="Meeting_List"
            :rules="rulesMeeting"
          >
            <el-form-item
              label="会议名称"
              prop="MeetingName"
            >
              <el-input
                v-model="Meeting_List.MeetingName"
                placeholder="会议名称"
              />
            </el-form-item>
            <el-form-item
              label="委员会"
              prop="CommitteeID"
            >
              <el-select
                v-model="Meeting_List.CommitteeID"
                clearable
                placeholder="请选择委员会"
              >
                <el-option
                  v-for="item in tableData"
                  :key="item.CommitteeID"
                  :label="item.CommitteeName"
                  :value="item.CommitteeID"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="科室"
              prop="DeptName"
            >
              <el-input
                v-model="Meeting_List.DeptName"
                placeholder="科室"
              />
            </el-form-item>
            <el-form-item
              label="会议地点"
              prop="MeetingSite"
            >
              <el-input
                v-model="Meeting_List.MeetingSite"
                placeholder="会议地点"
              />
            </el-form-item>
            <el-form-item
              label="会议时间"
              prop="MeetintDate"
            >
              <el-date-picker
                v-model="Meeting_List.MeetintDate"
                type="datetime"
                placeholder="选择日期时间"
              />
              <!-- <el-date-picker
                v-model="Meeting_List.MeetintDate"
                type="date"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              /> -->
            </el-form-item>
            <el-form-item
              label="主持人"
              prop="MeetingHost"
            >
              <el-input
                v-model="Meeting_List.MeetingHost"
                type="textarea"
              />
            </el-form-item>
            <el-form-item
              label="记录人"
              prop="RecordUser"
            >
              <el-input
                v-model="Meeting_List.RecordUser"
                type="textarea"
              />
            </el-form-item>
            <el-form-item
              label="参会委员"
              prop="MeetingUser"
            >
              <el-input
                v-model="Meeting_List.MeetingUser"
                type="textarea"
                placeholder="参会委员"
              />
            </el-form-item>
            <el-form-item label="缺席者">
              <el-input
                v-model="Meeting_List.AbsentUser"
                type="textarea"
                placeholder="缺席者"
              />
            </el-form-item>
          </el-form>
          <el-form
            size="mini"
            label-position="top"
            class="demo-form-inline"
          >
            <!-- <el-form-item label="质量指标分析">
              <el-input
                type="textarea"
                v-model="Meeting_List.Analysis"
                placeholder="质量指标分析（包括质量指标名称、未达目标值分析原因、未达目标值改善措施）"
              />
            </el-form-item>
            <el-form-item label="业务报告">
              <el-input
                type="textarea"
                v-model="Meeting_List.BusinessReport"
                placeholder="业务报告"
              />
            </el-form-item>
            <el-form-item label="病例讨论">
              <el-input
                type="textarea"
                v-model="Meeting_List.ProportionToDiscuss"
                placeholder="病例讨论"
              />
            </el-form-item>
            <el-form-item label="医疗隐患、医疗安全不良事件总结分析">
              <el-input
                type="textarea"
                v-model="Meeting_List.SummaryAnalysis"
                placeholder="医疗隐患、医疗安全不良事件总结分析（包括并发症、医疗纠纷事件分析）"
              />
            </el-form-item>
            <el-form-item label="运行病历和归档病历情况讨论">
              <el-input
                type="textarea"
                v-model="Meeting_List.MedicalRecords"
                placeholder="运行病历和归档病历情况讨论（包括出院病历三日归档率目标完成90%，科室病历检查平均分，甲乙丙级病例数等）"
              />
            </el-form-item>
            <el-form-item label="科室内部事务">
              <el-input
                type="textarea"
                v-model="Meeting_List.InternalAffairs"
                placeholder="科室内部事务"
              />
            </el-form-item>
            <el-form-item label="院部精神传达">
              <el-input
                type="textarea"
                v-model="Meeting_List.Spirit"
                placeholder="院部精神传达（包括会议、文件等）"
              />
            </el-form-item>
            <el-form-item label="下次科室计划">
              <el-input
                type="textarea"
                v-model="Meeting_List.DeptPlan"
                placeholder="下次科室计划（包括业务学习等）"
              />
            </el-form-item>
            <el-form-item label="科室成员反馈意见">
              <el-input
                type="textarea"
                v-model="Meeting_List.Feedback"
                placeholder="科室成员反馈意见"
              />
            </el-form-item>
            <el-form-item label="其他">
              <el-input
                type="textarea"
                v-model="Meeting_List.Other"
                placeholder="其他（包括科室业务发展方向、进修计划等）"
              />
            </el-form-item>
            <el-form-item label="上次会议结果落实情况追踪">
              <el-input
                type="textarea"
                v-model="Meeting_List.AbsentUser"
                placeholder="上次会议结果落实情况追踪"
              />
            </el-form-item>
            <el-form-item label="附件上传" v-if="Insert">
              <el-upload
                :multiple="true"
                :show-file-list="true"
                :on-success="(response, file) => handleSuccess(response, file)"
                :before-upload="() => beforeUpload('上次会议结果落实情况追踪')"
                class="editor-slide-upload"
                :file-list="fileList"
                action="/api/RC_File/UploadFile"
              >
                <el-button size="mini" type="primary">选择文件</el-button>
              </el-upload>
            </el-form-item> -->
            <el-form-item label="会议内容及会议表决结果">
              <el-input
                v-model="Meeting_List.MeetingContent"
                type="textarea"
                placeholder="会议内容及会议表决结果"
              />
            </el-form-item>
            <el-form-item label="附件上传">
              <el-upload
                :multiple="true"
                :show-file-list="true"
                :on-success="(response, file) => handleSuccess(response, file)"
                :before-upload="() => beforeUpload('会议内容及会议表决结果')"
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
                v-for="(itemImg, indexImg) in Meeting_List.MeetingImg_List"
                :key="indexImg"
              >
                <el-image
                  style="width: 100px; height: 100px"
                  :src="itemImg.ImgUrl"
                  :preview-src-list="[itemImg.ImgUrl]"
                />
                <span><i
                  style="cursor: pointer"
                  class="el-icon-delete"
                  @click="deleteImg(indexImg)"
                /></span>
              </span>
            </el-form-item>
          </el-form>
          <el-table
            :data="Meeting_List.Meeting_File_List"
            border
            style="width: 100%"
            size="mini"
            stripe
          >
            <el-table-column
              prop="FileName"
              label="文件名"
            >
              <template slot-scope="{ row }">
                <el-link
                  :href="row.OpenFileUrl"
                  target="_blank"
                >{{
                  row.FileName
                }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column
              prop="Type"
              label="文件类型"
            />
            <el-table-column
              prop="FileUrl"
              label="下载"
              width="100px"
              align="center"
            >
              <template slot-scope="{ row }">
                <el-link
                  :href="row.FileUrl"
                  target="_blank"
                >点击下载
                </el-link>
              </template>
            </el-table-column>
            <el-table-column
              prop="OpenFileUrl"
              label="查看"
              width="50px"
            >
              <template slot-scope="{ row }">
                <el-link
                  target="_blank"
                  @click="PreviewFile(row.FileUrl,row)"
                >预览
                </el-link>
              </template>
            </el-table-column>
            <el-table-column
              prop="OpenFileUrl"
              label="删除"
              width="50px"
              align="center"
            >
              <template slot-scope="{ $index }">
                <span><i
                  style="cursor: pointer"
                  class="el-icon-delete"
                  @click="deleteMeetingFile($index)"
                /></span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            size="small"
            @click="meetingDialog = false"
          >关闭</el-button>
          <el-button
            v-show="MeetingButtonShow"
            type="primary"
            size="small"
            @click="
              dialogMeetingTitle === '新增' ? InsertMeeting() : UpdateMeeting()
            "
          >提交</el-button>
        </span>
      </el-dialog>
    </el-main>
    <el-footer>
      <el-row>
        <el-col
          :xs="2"
          :sm="2"
          :md="1"
          :lg="1"
          :xl="1"
        >
          <el-switch
            v-model="cellOverflow"
            style="margin: 6px 0px"
          />
        </el-col>
        <el-col :span="20">
          <el-pagination
            v-if="radio == '委员会'"
            :current-page="pagination.pageIndex"
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size="pagination.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagination.Total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
          <el-pagination
            v-if="radio != '委员会'"
            :current-page="MeetingTableDataVal.pageIndex"
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size="MeetingTableDataVal.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="MeetingTableDataVal.Total"
            @size-change="handleSizeChange2"
            @current-change="handleCurrentChange2"
          />
        </el-col>
      </el-row>
    </el-footer>
  </el-container>
</template>
<script>
import { mapGetters } from 'vuex';
import { parseTime } from '@/utils/index';
import { PreviewFile } from '@/api/Article';
import {
  DeleteCommittee,
  DeleteMeeting,
  InsertCommittee,
  InsertMeeting,
  SelectCommittee,
  SelectCommitteeDetailByID,
  SelectMeeting,
  SelectMeetingDetailByID,
  UpdateCommittee,
  UpdateMeeting
} from '@/api/RC_Committee';

export default {
  data() {
    return {
      tableData: [],
      loading: false,
      cellOverflow: false,
      pagination: {
        pageIndex: 1,
        pageSize: 20,
        Total: 0,
        CommitteeName: ''
      },
      DialogVisible: false,
      activeName: 'first',
      listQuery: {
        CommitteeName: '',
        SetUpdate: '',
        Term_of_Office: '',
        Director: '',
        DeputyDirector: '',
        Member: '',
        Secretary: '',
        WorkSystem: '',
        WorkDuty: '',
        WorkPlan: '',
        Remake: '',
        CreateUserID: window.userInfo[0].UserID,
        Committee_File_List: [],
        Meeting_List: [
          {
            MeetingName: '',
            MeetintDate: '',
            MeetingUser: '',
            MeetingSite: '',
            LastMettingSituation: '',
            MeetingContent: '',
            MeetingImg_List: [],
            Meeting_File_List: [],
            noteTaker: '',
            AbsentUser: '',
            Analysis: '',
            BusinessReport: '',
            SummaryAnalysis: '',
            ProportionToDiscuss: '',
            MedicalRecords: '',
            InternalAffairs: '',
            Spirit: '',
            DeptPlan: '',
            Feedback: '',
            Other: ''
          }
        ]
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
      fileList: [],
      filetype: '',
      isClear: false,
      fileShow: true,
      Insert: true,
      dialogTitle: '新增',
      rules: {
        CommitteeName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        Term_of_Office: [
          { required: true, message: '请输入任期', trigger: 'blur' }
        ],
        Director: [{ required: true, message: '请输入主任', trigger: 'blur' }],
        DeputyDirector: [
          { required: true, message: '请输入副主任', trigger: 'blur' }
        ],
        Secretary: [{ required: true, message: '请输入秘书', trigger: 'blur' }],
        Member: [{ required: true, message: '请输入成员', trigger: 'blur' }],
        WorkSystem: [
          { required: true, message: '请输入制度', trigger: 'blur' }
        ],
        WorkDuty: [{ required: true, message: '请输入职责', trigger: 'blur' }],
        WorkPlan: [{ required: true, message: '请输入计划', trigger: 'blur' }]
      },
      rulesMeeting: {
        MeetingName: [
          { required: true, message: '请输入会议名称', trigger: 'blur' }
        ],
        CommitteeID: [
          { required: true, message: '请选择委员会', trigger: 'blur' }
        ],
        MeetingSite: [
          { required: true, message: '请填写会议地点', trigger: 'blur' }
        ],
        MeetintDate: [
          { required: true, message: '请选择会议时间', trigger: 'blur' }
        ],
        MeetingHost: [
          { required: true, message: '请填写主持人', trigger: 'blur' }
        ],
        RecordUser: [
          { required: true, message: '请填写记录人人', trigger: 'blur' }
        ],
        MeetingUser: [
          { required: true, message: '请填写参会委员', trigger: 'blur' }
        ],
        DeptName: [
          { required: true, message: '请填写科室名称', trigger: 'blur' }
        ]
      },
      meetingDialog: false,
      Meeting_List: {
        MeetingName: '',
        MeetintDate: '',
        MeetingUser: '',
        MeetingSite: '',
        LastMettingSituation: '',
        MeetingContent: '',
        MeetingImg_List: [],
        Meeting_File_List: [],
        noteTaker: '',
        AbsentUser: '',
        Analysis: '',
        BusinessReport: '',
        SummaryAnalysis: '',
        ProportionToDiscuss: '',
        MedicalRecords: '',
        InternalAffairs: '',
        Spirit: '',
        DeptPlan: '',
        Feedback: '',
        Other: ''
      },
      dialogMeetingTitle: '新增',
      radio: '委员会',
      MeetingTableData: [],
      MeetingTableDataVal: {
        pageIndex: 1,
        pageSize: 20
        /*    MeetingName: '',
        Total: 0*/
      },
      MeetingButtonShow: true
    };
  },
  created() {
    this.SelectCommittee();
    this.SelectMeeting();
  },
  computed: {
    ...mapGetters(['device', 'permission_routes'])
  },
  methods: {
    /* 工作职责Dialog */
    add() {
      this.dialogTitle = '新增';
      this.activeName = 'first';
      this.Insert = true;
      if (this.listQuery.CommitteeID) {
        /* 数据重置到初始状态 */
        Object.assign(this.$data.listQuery, this.$options.data().listQuery);
      }
      this.DialogVisible = true;
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.SelectCommittee();
    },
    handleCurrentChange(val) {
      this.pagination.pageIndex = val;
      this.SelectCommittee();
    },
    handleSizeChange2(val) {
      this.MeetingTableDataVal.pageSize = val;
      this.SelectMeeting();
    },
    handleCurrentChange2(val) {
      this.MeetingTableDataVal.pageIndex = val;
      this.SelectMeeting();
    },
    getSelectAllArticleGroupValue(value) {
      this.listQuery.GroupID = value;
    },
    handleSuccess(response, file) {
      if (response.code === 200) {
        if (
          this.filetype === '成员' ||
          this.filetype === '工作制度' ||
          this.filetype === '工作职责' ||
          this.filetype === '工作计划'
        ) {
          this.listQuery.Committee_File_List.push({
            FileName: file.name,
            FileUrl: response.data[0].FileUrl,
            OpenFileUrl: response.data[0].OpenFileUrl,
            Type: this.filetype
          });
        } else if (
          this.filetype === '上次会议结果落实情况追踪' ||
          this.filetype === '会议内容及会议表决结果'
        ) {
          this.Meeting_List.Meeting_File_List.push({
            FileName: file.name,
            FileUrl: response.data[0].FileUrl,
            OpenFileUrl: response.data[0].OpenFileUrl,
            Type: this.filetype
          });
        }
      } else {
        this.fileList = [];
        this.$message.error(file.name + '上传失败');
      }
    },
    handleSuccessImg(response, file) {
      if (response.code === 200) {
        this.Meeting_List.MeetingImg_List.push({
          ImgTitle: file.name,
          ImgUrl: response.data[0].FileUrl
        });
      } else {
        this.Meeting_List.MeetingImg_List = [];
        this.$message.error(file.name + '上传失败');
      }
    },
    getContent(value) {
      this.listQuery.Content = value;
    },
    getSelect(val) {
      this.listQuery.instAduitUser = val;
    },
    /* 判断属于哪个字段的文件 */
    beforeUpload(val) {
      this.filetype = val;
    },
    InsertCommittee() {
      this.$refs.listQuery.validate(async valid => {
        if (valid) {
          try {
            if (!this.listQuery.SetUpdate) {
              this.$message.warning('请填写时间！');
            }
            const { data, code } = await InsertCommittee(this.listQuery);
            if (code === 200) {
              this.SelectCommittee();
              this.$message.success('添加成功!');
              this.DialogVisible = false;
            }
          } catch (error) {
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    async SelectCommittee(value) {
      try {
        this.pagination.pageIndex =
          value == '搜索' ? 1 : this.pagination.pageIndex;
        const { data } = await SelectCommittee(this.pagination);
        this.tableData = data.DataList;
        this.pagination.Total = data.Total;
      } catch (error) {
      }
    },
    async seeRow(row) {
      try {
        const { data } = await SelectCommitteeDetailByID({
          CommitteeID: row.CommitteeID
        });
        this.listQuery = data;
        this.Insert = false;
        this.DialogVisible = true;
      } catch (error) {
      }
    },
    async editor(row) {
      try {
        this.dialogTitle = '修改';
        this.activeName = 'first';
        const { data } = await SelectCommitteeDetailByID({
          CommitteeID: row.CommitteeID
        });
        this.listQuery = data;
        this.Insert = true;
        this.DialogVisible = true;
      } catch (error) {
      }
    },
    async DeleteCommittee(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          DeleteCommittee({ CommitteeID: row.CommitteeID }).then(res => {
            if (res.code === 200) {
              this.$message.success('删除成功!');
              this.SelectCommittee();
            }
          });
        })
        .catch(() => {
        });
    },
    async UpdateCommittee() {
      this.$refs.listQuery.validate(async valid => {
        if (valid) {
          try {
            const { data, code } = await UpdateCommittee(this.listQuery);
            if (code === 200) {
              this.SelectCommittee();
              this.$message.success('修改成功!');
              this.DialogVisible = false;
            }
          } catch (error) {
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    addMeting() {
      this.meetingDialog = true;
      this.MeetingButtonShow = true;
      this.dialogMeetingTitle = '新增';
      if (this.Meeting_List.MeetingID) {
        /* 初始化数据 */
        Object.assign(
          this.$data.Meeting_List,
          this.$options.data().Meeting_List
        );
      }
    },
    async InsertMeeting() {
      this.$refs.rulesMeeting.validate(async valid => {
        if (valid) {
          try {
            const { code } = await InsertMeeting(this.Meeting_List);
            code === 200
              ? this.$message.success('新增成功!')
              : this.$message.warning('新增失败');
            this.$message.success('新增会议成功!');
            this.SelectMeeting();
            this.meetingDialog = false;
            /* 初始化数据 */
            Object.assign(
              this.$data.Meeting_List,
              this.$options.data().Meeting_List
            );
          } catch (error) {
          }
        } else {
          return false;
        }
      });
    },
    async DeleteMeeting(row) {
      try {
        const { code } = await DeleteMeeting({ MeetingID: row.MeetingID });
        code === 200
          ? this.$message.success('删除成功!')
          : this.$message.warning('删除失败');
        this.SelectMeeting();
      } catch (error) {
      }
    },
    async UpdateMeeting() {
      this.$refs.rulesMeeting.validate(async valid => {
        if (valid) {
          try {
            const { code } = await UpdateMeeting(this.Meeting_List);
            code === 200
              ? this.$message.success('更新成功!')
              : this.$message.warning('更新失败');
            this.SelectMeeting();
            this.meetingDialog = false;
          } catch (error) {
          }
        } else {
          return false;
        }
      });
    },
    async SelectMeeting(value) {
      try {
        // delete this.MeetingTableDataVal.MeetingName;
        // delete this.MeetingTableDataVal.Total;
        this.MeetingTableDataVal.pageIndex =
          value == '搜索' ? 1 : this.MeetingTableDataVal.pageIndex;
        const { data } = await SelectMeeting(this.MeetingTableDataVal);
        this.MeetingTableData = data.DataList;
        this.MeetingTableDataVal.Total = data.Total;
      } catch (error) {
      }
    },
    async editorMeeting(row, str) {
      this.MeetingButtonShow = str !== '查看';
      try {
        const { data } = await SelectMeetingDetailByID({
          MeetingID: row.MeetingID
        });
        this.meetingDialog = true;
        this.dialogMeetingTitle = '修改';
        this.Meeting_List = data;
      } catch (error) {
      }
    },
    deleteImg(index) {
      this.Meeting_List.MeetingImg_List.splice(index, 1);
    },
    deleteCommitteeFile(index) {
      this.listQuery.Committee_File_List.splice(index, 1);
    },
    deleteMeetingFile(index) {
      this.Meeting_List.Meeting_File_List.splice(index, 1);
    },
    beforeImg(file) {
      this.Meeting_List.MeetingImg_List.splice(
        this.Meeting_List.MeetingImg_List.findIndex(
          item => item.ImgTitle === file.name
        ),
        1
      );
    },
    // 格式化时间
    parseTimes(val) {
      return parseTime(val, '{y}-{m}-{d} {h}:{i}:{s}');
    },
    async PreviewFile(val,row) {
      /* 资料预览 */
      val = val.replace(/Annex\/file\/|\//g, '');
      console.log('dd',val);
      console.log('aa',row);
      const { data } = await PreviewFile({ Title: val });
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
.committee {
  .el-header,
  .el-footer {
    height: 30px !important;
    padding: 0px 0 0 0px;
  }

  .el-main {
    padding: 0 0px;

    .imgdelete {
    }
  }

  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 11rem;
  }

  .el-form-item {
    margin-bottom: 0px;
  }

  .el-textarea__inner {
    border-radius: 1px;
  }
}

.el-image-viewer__wrapper {
  z-index: 99999 !important;
}
</style>
