<template>
  <el-container class="conferenceRoom">
    <el-header style="display:flex;align-items:center">
      <el-form
        :inline="true"
        class="demo-form-inline"
        size="mini"
      >
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="addRoom('新增')"
          >新增会议室
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="from.MeetingSite"
            placeholder="会议室名称"
            @keyup.enter.native="SelectMeetingSite('搜索')"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="from.MeetingUserName"
            placeholder="负责人"
            @keyup.enter.native="SelectMeetingSite('搜索')"
          />
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="from.IsNeedApply"
            placeholder="是否需要申请"
            clearable
            @change="changeSelect"
          >
            <el-option
              label="不需要"
              :value="0"
            />
            <el-option
              label="需要"
              :value="1"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="SelectMeetingSite"
          >搜索
          </el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main>
      <el-table
        :data="tableData"
        stripe
        size="small"
        border
        style="width: 100%;height:calc(100vh - 200px)"
      >
        <el-table-column
          prop="MeetingSite"
          label="会议室名称"
        />
        <el-table-column
          prop="MeetingUserName"
          label="负责人"
        />
        <el-table-column
          prop="IsNeedApply"
          label="会议申请管理"
          width="150"
          align="center"
        >
          <template slot-scope="{row}">
            <el-badge
              :value="row.IsNeedApply===0?0:row.UnAuditCount"
              class="item"
            >
              <el-button
                size="mini"
                @click="openApplyDialogVisible(row)"
              >待处理
              </el-button>
            </el-badge>
          </template>
        </el-table-column>
        <el-table-column
          prop="IsNeedApply"
          label="是否需要申请"
          width="100"
          align="center"
        >
          <template slot-scope="{row}">
            {{ row.IsNeedApply === 1 ? '需要' : '不需要' }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          fixed="right"
          width="150"
        >
          <template slot-scope="{ row }">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              circle
              @click="Update(row)"
            />
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              circle
              @click="Delete(row)"
            />
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        title="会议室编辑"
        :width="device === 'desktop' ? '40%' : '100%'"
        :close-on-click-modal="false"
        :visible.sync="dialogVisible"
      >
        <el-tabs
          v-model="activeName"
          style="height:50vh;overflow: auto;"
        >
          <el-tab-pane
            label="会议室"
            name="first"
          >
            <el-form
              ref="form"
              label-width="110px"
              size="small"
              :model="formInline"
              :rules="rules"
            >
              <el-form-item
                label="会议室名称："
                prop="MeetingSite"
              >
                <el-input v-model="formInline.MeetingSite" />
              </el-form-item>
              <el-form-item label="是否需要申请：">
                <el-radio
                  v-model="formInline.IsNeedApply"
                  :label="1"
                >是
                </el-radio>
                <el-radio
                  v-model="formInline.IsNeedApply"
                  :label="0"
                >否
                </el-radio>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane
            label="负责人"
            name="two"
          >
            <select-deptor-user
              ref="userTree"
              :multiple="false"
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
            @click="dialogVisible = false"
          >关闭
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="InsertMeetingSite"
          >确定
          </el-button>
        </div>
      </el-dialog>
      <el-dialog
        title="会议室申请管理"
        :width="device === 'desktop' ? '50%' : '100%'"
        :close-on-click-modal="false"
        :visible.sync="applyDialogVisible"
      >
        <el-table
          :data="tableDataApply"
          border
          size="small"
          style="width: 100%;height:50vh"
        >
          <el-table-column
            type="index"
            fixed="left"
            width="50"
            label="序号"
            align="center"
          />
          <el-table-column
            prop="MeetingName"
            label="会议名称"
          />
          <el-table-column
            prop="DeptName"
            label="会议科室"
          />
          <el-table-column
            prop="MeetingHost"
            label="主持人"
          />
          <el-table-column
            prop="MeetingStartDate"
            label="会议开始时间"
            width="140"
            align="center"
          >
            <template slot-scope="{row}">
              {{ row.MeetingStartDate ? row.MeetingStartDate.split('T').join(' ') : '' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="MeetingEndDate"
            label="会议结束时间"
            width="140"
            align="center"
          >
            <template slot-scope="{row}">
              {{ row.MeetingEndDate ? row.MeetingEndDate.split('T').join(' ') : '' }}
            </template>
          </el-table-column>
          <!--           <el-table-column
            prop="MeetingEndDate"
            label="审核意见"
            width="160"
            align="center"
          >
            <template slot-scope="{row}">
              {{ 234 }}
            </template>
          </el-table-column> -->
          <el-table-column
            label="操作"
            align="center"
            width="200"
          >
            <template slot-scope="{ row }">
              <el-radio-group
                v-model="row.AuditState"
                size="mini"
                @change="(val)=>change(val,row)"
              >
                <el-radio-button :label="1">通过</el-radio-button>
                <el-radio-button :label="2">退回</el-radio-button>
                <el-radio-button
                  :label="0"
                  :disabled="true"
                >未审核
                </el-radio-button>
              </el-radio-group>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-main>
    <el-footer>
      <el-row>
        <el-col :span="1">
          <el-switch
            v-model="cellOverflow"
            style="margin: 6px 0px"
          />
        </el-col>
        <el-col :span="20">
          <el-pagination
            background
            :current-page.sync="from.pageIndex"
            :page-size="from.pageSize"
            :page-sizes="[15,20,30,40,50,100]"
            :total="from.Total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-col>
      </el-row>
    </el-footer>
  </el-container>
</template>
<script>
import {
  DeleteMeetingSite,
  InsertMeetingSite,
  SelectMeetingSite,
  UpdateMeetingSite
} from '@/api/managementMeetings/MeetingSite';
import { SelectMeetingSiteAudit, UpdateMeetingSiteAudit } from '@/api/managementMeetings/MeetingSiteAudit';
import SelectDeptorUser from '@/views/components/SelectDeptorUser';
import { mapGetters } from 'vuex';

export default {
  components: {
    SelectDeptorUser
  },
  data() {
    return {
      formInline: {
        MeetingSite: '',
        IsNeedApply: 1,
        MeetingUserID: ''
      },
      from: {
        MeetingSite: '',
        IsNeedApply: null,
        MeetingUserName: '',
        pageIndex: 1,
        pageSize: 15,
        Total: 0
      },
      MeetingSiteID: 0,
      tableData: [],
      dialogVisible: false,
      activeName: 'first',
      status: '新增',
      cellOverflow: false,
      applyDialogVisible: false,
      IsNeedApply: false,
      tableDataApply: [],
      rules: {
        MeetingSite: [
          { required: true, message: '请输入会议室名称', trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    ...mapGetters(['device'])
  },
  created() {
    this.SelectMeetingSite();
  },
  methods: {
    async SelectMeetingSite(type) {
      this.from.pageIndex = type === '搜索' ? 1 : this.from.pageIndex;
      const { data } = await SelectMeetingSite(this.from);
      this.tableData = data.DataList;
      this.from.Total = data.Total;
    },
    changeSelect() {
      this.SelectMeetingSite();
    },
    async InsertMeetingSite() {
      const {
        code,
        msg
      } = this.status === '新增' ? await InsertMeetingSite(this.formInline) : await UpdateMeetingSite(this.formInline);
      code === 200 ? this.$message.success(msg) : this.$message.error(msg);
      this.SelectMeetingSite();
      this.dialogVisible = false;
    },
    addRoom(status) {
      Object.assign(this.$data.formInline, this.$options.data().formInline);
      this.status = status;
      this.$nextTick(() => {
        this.$refs.userTree.setDeptorUser([]);
      });
      this.dialogVisible = true;
    },
    getSelectDeptorUser(val) {
      this.formInline.MeetingUserID = val.toString();
    },
    Update(row) {
      this.formInline = row;
      this.status = '修改';
      const MeetingUserID = row.MeetingUserID ? row.MeetingUserID.split(',') : [];
      this.$nextTick(() => {
        this.$refs.userTree.setDeptorUser(MeetingUserID);
      });
      this.dialogVisible = true;
    },
    async Delete(row) {
      this.$confirm(`是否删除：${row.MeetingSite}`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          try {
            const { msg } = await DeleteMeetingSite({ MeetingSiteID: row.MeetingSiteID });
            this.$message.success(msg);
            this.SelectMeetingSite();
          } catch (error) {
            console.log(error);
          }
        })
        .catch((e) => e);
    },
    handleSizeChange(val) {
      this.from.pageSize = val;
      this.from.pageIndex = 1;
      this.SelectMeetingSite();
    },
    handleCurrentChange(val) {
      this.from.pageIndex = val;
      this.SelectMeetingSite();
    },
    async openApplyDialogVisible(row) {
      const { data } = await SelectMeetingSiteAudit(
        {
          pageIndex: 1,
          pageSize: 50,
          MeetingSiteID: row.MeetingSiteID
        }
      );
      this.tableDataApply = data.DataList;
      this.IsNeedApply = row.IsNeedApply === 1;
      this.applyDialogVisible = true;
    },
    async change(val, row) {
      const { code, msg } = await UpdateMeetingSiteAudit({
        MeetingSiteAuditID: row.MeetingSiteAuditID,
        MeetingID: row.MeetingID,
        AuditState: val,
        AuditOpinion: ''
      });
      code === 200 ? this.$message.success(msg) : this.$message.error(msg);
      this.openApplyDialogVisible(row);
      this.SelectMeetingSite('搜索');
    }
  }
};
</script>
<style lang="scss">
.conferenceRoom {
  .el-header,
  .el-main,
  .el-footer {
    margin: 0;
    padding: 0;
  }

  .el-header {
    height: 40px !important;
  }

  .el-badge__content.is-fixed {
    position: absolute;
    top: 18px !important;
  }
}
</style>
