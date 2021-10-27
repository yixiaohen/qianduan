<template>
  <el-card class="box-card-view">
    <el-card shadow="never" class="box-card-center">
      <div slot="header">
        <el-form ref="listQuery" :inline="true" :model="listQuery" size="mini">
          <el-form-item>
            <el-button
              type="primary"
              :disabled="modalShow"
              @click="openModel"
            >发布会议</el-button>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="listQuery.MeetingName"
              clearable
              placeholder="会议名称"
            />
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="dataArr"
              type="datetimerange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['12:00:00']"
              value-format="yyyy-MM-dd HH:mm:ss"
              @change="datePickerChange"
            />
          </el-form-item>
          <el-form-item>
            <default-depts
              w="100%"
              :value="listQuery.MeetingDeptID"
              @getDefaultDeptsValue="getDefaultDeptValues2"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="GetMeetingList('搜索')"
            >搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        v-loading="listLoading"
        :data="tableData"
        height="calc(100vh - 216px)"
        border
        size="mini"
      >
        <el-table-column
          type="index"
          fixed="left"
          width="50"
          label="序号"
          align="center"
        />
        <el-table-column prop="MeetingName" label="会议名称" />
        <el-table-column prop="MeetingSite" label="会议地点" />
        <el-table-column prop="DeptName" label="会议科室" />
        <el-table-column prop="MeetingHost" label="主持人" />
        <el-table-column prop="UserNames" label="已参加人员" />
        <el-table-column
          prop="MeetingStartDate"
          label="会议开始时间"
          width="160"
          align="center"
        />
        <el-table-column
          prop="MeetingEndDate"
          label="会议结束时间"
          width="160"
          align="center"
        />
        <el-table-column label="操作" align="center" fixed="right" width="150">
          <template slot-scope="{ row }">
            <el-button
              type="primary"
              size="mini"
              @click="publishTopic(row)"
            >发布</el-button>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="edit(row)"
            />
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="DeleteTopic(row)"
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

    <el-dialog
      custom-class="modalShow"
      :visible.sync="modalShow"
      :close-on-click-modal="false"
      :title="modalTitle"
      :width="device === 'desktop' ? '50%' : '90%'"
    >
      <el-form
        ref="planFormData"
        label-position="top"
        size="mini"
        :model="planFormData"
        :rules="ruleValidate"
        style="height: 70vh; overflow: auto"
      >
        <el-form-item label="会议名称" prop="MeetingName">
          <el-input
            v-model="planFormData.MeetingName"
            placeholder="会议名称"
            :disabled="detail"
          />
        </el-form-item>
        <el-row :gutter="8">
          <el-col :span="6">
            <el-form-item label="会议科室" prop="CatalogID">
              <default-depts
                w="100%"
                :value="MeetingDeptIDarr"
                @getDefaultDeptsValue="getDefaultDeptValues"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="主讲人" prop="MeetingHost">
              <el-input
                v-model="planFormData.MeetingHost"
                style="width: 100%"
                placeholder="主持人"
                :disabled="detail"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="会议地点" prop="MeetingSiteID">
              <el-select
                v-model="planFormData.MeetingSiteID"
                style="width: 100%"
                placeholder="会议地点"
                :disabled="detail"
              >
                <el-option
                  v-for="item in conferenceRoom"
                  :key="item.MeetingSiteID"
                  :value="item.MeetingSiteID"
                  :label="item.MeetingSite"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="会议时间" prop="trainDate">
              <el-date-picker
                v-model="planFormData.trainDate"
                type="datetimerange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['9:00:00']"
                value-format="yyyy-MM-dd HH:mm:ss"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="上传附件" prop="trainType">
              <el-upload
                :multiple="true"
                :show-file-list="true"
                :on-success="handleSuccess"
                class="editor-slide-upload"
                :file-list="fileList"
                action="/api/RC_File/UploadFile"
              >
                <el-button size="mini" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <filePreview :preview-data="planFormData.MeetingFileList" />
          </el-col>
        </el-row>
        <el-form-item label="会议内容" prop="MeetingContent">
          <el-input
            v-model="planFormData.MeetingContent"
            type="textarea"
            placeholder="会议内容"
            :disabled="detail"
          />
        </el-form-item>
        <el-row type="flex" :gutter="16">
          <el-col :span="24">
            <el-card shadow="never" :style="{ height: '300px' }">
              <div slot="header">会议参与人员</div>
              <select-deptor-user
                ref="usersTree"
                :height="290"
                @getSelectDeptorUser="getSelectDeptorUser"
              />
            </el-card>
          </el-col>
        </el-row>
      </el-form>

      <div class="footer">
        <el-button
          size="mini"
          style="margin-right: 5px"
          @click="onCancel()"
        >取消</el-button>
        <el-button
          size="mini"
          type="primary"
          style="margin-right: 5px"
          @click="InsertMeeting()"
        >提交</el-button>
      </div>
    </el-dialog>
    <el-dialog
      custom-class="modalShow"
      :visible.sync="publishShow"
      :close-on-click-modal="false"
      :title="publishTitle"
      :width="device === 'desktop' ? '30%' : '90%'"
    >
      <el-row :gutter="10" style="padding: 10px">
        <el-col :span="12">
          <p>
            <el-tag>会议签到二维码</el-tag>
          </p>
          <qrCode :text="publishText1" />
          <p>可以右键保存二维码图片，转发该图片到公司群供报名人员扫码报名</p>
        </el-col>
      </el-row>
      <div class="footer">
        <el-button
          size="mini"
          type="primary"
          @click="publishShow = false"
        >关闭</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
import { SelectMeetingSite } from '@/api/managementMeetings/MeetingSite';
import SelectDeptorUser from '@/views/components/SelectDeptorUser';

import qrCode from '@/views/components/qrCode';
import { DeMeeting, GetMeetingList, InsertMeeting, SelectMeetingFile } from '@/api/managementMeetings/Meeting';
import { mapGetters } from 'vuex';
import defaultDepts from '@/views/components/defaultDept';
import filePreview from '@/views/components/file/filePreview';

export default {
  name: 'TraningPlan',
  components: { SelectDeptorUser, qrCode, filePreview, defaultDepts },
  data() {
    return {
      publishShow: false,
      publishTitle: '',
      publishText1: '',
      listLoading: true,
      detail: false,
      listQuery: {
        pageIndex: 1,
        pageSize: 15,
        MeetingName: '',
        MeetingDeptID: '',
        StartDate: '',
        EndDate: ''
      },
      pagination: {
        pageIndex: 1,
        total: 0,
        pageSize: 15,
        pageSizes: [15, 20, 50, 100, 150, 200]
      },
      dataArr: [],
      trainType: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '线上',
          value: 0
        },
        {
          label: '线下',
          value: 1
        }
      ],
      total: 0,
      modalShow: false,
      modalTitle: '新增会议计划',
      tableData: [],
      fileListTable: [],
      planFormData: {
        MeetingID: 0, // 会议ID
        MeetingName: '',
        MeetingDeptID: 0, // 会议科室
        trainDate: [],
        MeetingStartDate: '', // 会议开始时间
        MeetingEndDate: '', // 会议结束时间
        MeetingHost: '', // 主持人
        MeetingUser: '', // 参加人员
        MeetingSiteID: '', // 会议室ID
        MeetingContent: '', // 会议内容
        MeetingFileList: [],
        // 添加会议室审核
        MeetingSiteAuditList: []
      },
      ruleValidate: {
        MeetingName: [{ required: true, message: '请填写会议名称' }],
        MeetingContent: [{ required: true, message: '请填写会议内容' }],
        MeetingStartDate: [{ required: true, message: '请设置会议时间' }],
        MeetingDeptID: [{ required: true, message: '请填写会议地点' }],
        MeetingHost: [{ required: true, message: '请填写主讲人' }]
      },
      taskTypeList: [
        {
          label: '线上',
          value: 0
        },
        {
          label: '线下',
          value: 1
        }
      ],
      coursewareLoading: false,
      usersTree: [],
      names: '',
      fileList: [],
      MeetingDeptIDArr: [],
      conferenceRoom: '',
      MeetingDeptIDarr: []
    };
  },
  computed: {
    ...mapGetters(['device'])
  },
  created() {
    this.GetMeetingList();
    this.SelectMeetingSite();
  },
  methods: {
    downloadFileList(row) {
      window.open(`/Annex/file/${row.Title}`);
    },
    getSelectDeptorUser(value, NodesItem) {
      this.usersTree = value;
      this.planFormData.MeetingUser = value.join(',');
      this.names =
        (NodesItem || []).map(item => item.Name).join(',') || this.names;
    },
    DeleteTopic(row) {
      this.$confirm(`是否删除：${row.MeetingName}`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          try {
            const { msg } = await DeMeeting({ MeetingID: row.MeetingID });
            this.$message.success(msg);
            this.GetMeetingList();
          } catch (error) {
            console.log(error);
          }
        })
        .catch(e => e);
    },
    InsertMeeting() {
      this.$refs['planFormData'].validate(async v => {
        if (v) {
          if (
            !this.planFormData.MeetingSiteID ||
            this.planFormData.trainDate.length === 0
          ) {
            this.$message.error('请填写会议地点或者时间');
            return;
          }
          try {
            this.planFormData.MeetingStartDate = this.planFormData.trainDate[0];
            this.planFormData.MeetingEndDate = this.planFormData.trainDate[1];
            const { msg } = await InsertMeeting(this.planFormData);
            this.$message.success(msg);
            this.GetMeetingList();
          } catch (error) {
            console.log(error);
          } finally {
            this.modalShow = false;
          }
        } else {
          this.$message.error({
            type: 'error',
            message: '你有必填项没填写'
          });
        }
      });
    },
    onCancel() {
      this.detail = false;
      this.modalShow = false;
      this.names = '';
      Object.assign(this.$data.planFormData, this.$options.data().planFormData);
    },
    openModel() {
      this.modalTitle = '新增会议计划';
      Object.assign(this.$data.planFormData, this.$options.data().planFormData);
      this.modalShow = true;
    },
    async UpdateApplyState(row) {
      const state = row.applyState === 0 ? '报名' : '取消报名';
      this.$confirm(`是否${state}：${row.planName}`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          try {
            const { msg } = await UpdateApplyState({
              planID: row.planId,
              applyState: row.applyState === 0 ? 1 : 0,
              UserID: window.userInfo[0].UserID
            });
            this.$message.success(msg);
          } catch (error) {
            console.log(error);
          }
        })
        .catch(e => {
          const state = row.applyState === 1 ? '报名' : '取消报名';
          this.$message.success(state);
        });
    },
    async GetMeetingList() {
      const { data } = await GetMeetingList(this.listQuery);
      this.tableData = data.DataList;
      this.listLoading = false;
    },
    handleCurrentChange(val) {
      this.listQuery.pageIndex = val;
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
    },
    publishTopic(row) {
      if (row.MSTATE !== 1) {
        this.$message.warning('会议室审核中，通过后才能发布哦！');
        return;
      }
      this.publishTitle = '发布：' + row.MeetingName;
      this.publishText1 = `http://${window.location.host}?trainplanId=${row.MeetingID}&op=meetings`;
      this.publishShow = true;
    },
    handleSuccess(response, file, scope) {
      if (response.code === 200) {
        const data = response.data[0];
        this.planFormData.MeetingFileList.push({
          MeetingID: 0,
          FileName: file.name,
          FileUrl: data.FileUrl,
          OpenFileUrl: data.OpenFileUrl
        });
      } else {
        this.fileList = [];
        this.$message.error(file.name + '上传失败');
      }
    },
    getDefaultDeptValues(v) {
      this.planFormData.MeetingDeptID = parseInt(v);
    },
    getDefaultDeptValues2(v) {
      this.listQuery.MeetingDeptID = v;
      this.GetMeetingList();
    },
    async SelectMeetingSite() {
      const { data } = await SelectMeetingSite({
        MeetingSite: '',
        IsNeedApply: null,
        MeetingUserName: '',
        pageIndex: 1,
        pageSize: 1000
      });
      this.conferenceRoom = data.DataList;
    },
    async edit(row) {
      const { data } = await SelectMeetingFile({
        MeetingID: row.MeetingID
      });
      /*   row.MeetingDeptID = [row.MeetingDeptID]; */
      this.MeetingDeptIDarr = [];
      this.MeetingDeptIDarr = this.MeetingDeptIDarr.push(row.MeetingDeptID);
      this.planFormData = {
        ...row,
        trainDate: [row.MeetingStartDate.replace(/T/g, ' '), row.MeetingEndDate.replace(/T/g, ' ')],
        MeetingFileList: data
      };
      this.$nextTick(() => {
        this.$refs.usersTree.setDeptorUser(row.MeetingUser.split(','));
      });
      this.modalShow = true;
    },
    radioChange(val) {},
    datePickerChange(val) {
      this.listQuery.StartDate = val ? val[0] : '';
      this.listQuery.EndDate = val ? val[1] : '';
      this.GetMeetingList();
    }
  }
};
</script>
<style lang="scss" scoped>
@import '../ExampleTrainStyles/index.scss';
.box-card-view {
  ::v-deep {
    .el-card__body {
      padding: 8px;
    }
    .modalShow {
      .footer {
        text-align: right;
        margin-top: 10px;
      }
      .footer button {
        margin: 0 5px;
      }
      .el-card__header {
        padding: 8px 20px;
        border-bottom: 1px solid #e6ebf5;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
      }
    }
  }
}
</style>
