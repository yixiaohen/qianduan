<template>
  <div>
    <el-dialog
      custom-class="modalShow"
      :visible.sync="modalShow"
      center
      :close-on-click-modal="false"
      :title="'会议名称：'+MeetingRow.MeetingName"
      :width="device === 'desktop' ? '30%' : '90%'"
    >
      <el-form
        ref="form"
        label-position="left"
      >
        <el-form-item label="会议内容:">
          {{ MeetingRow.MeetingContent }}
        </el-form-item>
        <el-form-item label="会议科室:">
          {{ MeetingRow.DeptName }}
        </el-form-item>
        <el-form-item label="会议地点:">
          {{ MeetingRow.MeetingSite }}
        </el-form-item>
        <el-form-item label="会议开始时间:">
          {{ MeetingRow.MeetingStartDate }}
        </el-form-item>
        <el-form-item label="会议结束时间:">
          {{ MeetingRow.MeetingEndDate }}
        </el-form-item>
        <el-form-item label="已参与人数:">
          {{ MeetingRow.JoinNum }}
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          size="small"
          style="margin-right: 5px"
          @click="InsertMeetingDetail(0)"
        >不参加</el-button>
        <el-button
          size="small"
          type="primary"
          style="margin-right: 5px"
          @click="InsertMeetingDetail(1)"
        >参加</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
import { InsertMeetingDetail } from '@/api/managementMeetings/MeetingDetail';
import { GetMeetingList } from '@/api/managementMeetings/Meeting';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      MeetingRow: [],
      modalShow: true
    };
  },
  computed: {
    ...mapGetters(['device'])
  },
  created() {
    this.GetMeetingList();
  },
  methods: {
    async GetMeetingList() {
      const { data } = await GetMeetingList(
        {
          pageIndex: 1,
          pageSize: 20,
          MeetingName: '',
          MeetingDeptID: '',
          MeetingID: this.$route.query.id
        }
      );
      this.MeetingRow = data.DataList[0];
    },
    async InsertMeetingDetail(IsJoin) {
      const { msg, code } = await InsertMeetingDetail({
        MeetingID: parseInt(this.$route.query.id),
        IsJoin: IsJoin
      });
      code === 200 ? this.$message.success(msg) : this.$message.error(msg);
      code === 200 ? this.modalShow = false : '';
      this.$router.push('/managementMeetings/meetingMy');
    }
  }
};
</script>
