<template>
  <el-card class="box-card-view">
    <el-card
      shadow="never"
      class="box-card-center"
    >
      <div slot="header">
        <div class="search-view">
          <el-form
            ref="listQuery"
            :inline="true"
            :model="listQuery"
            size="mini"
          >
            <el-form-item>
              <el-button
                type="primary"
                :disabled="modalShow"
                @click="openModel"
              >发布培训
              </el-button>
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="listQuery.planName"
                clearable
                placeholder="培训名称"
              />
            </el-form-item>
            <el-form-item>
              <el-select
                v-model="listQuery.trainType"
                placeholder="培训类型"
              >
                <el-option
                  v-for="item in trainType"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="clickSelectPlan('listQuery')"
              >搜索
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <el-table
        v-loading="listLoading"
        :data="tableData"
        height="calc(100vh - 230px)"
        border
        tooltip-effect="light"
        size="mini"
      >
        <el-table-column
          type="index"
          width="50"
          label="序号"
          align="center"
        />
        <el-table-column
          prop="planName"
          label="培训名称"
          width="200"
        />
        <el-table-column
          prop="trainType"
          label="培训类型"
          width="100"
          align="center"
        >
          <template slot-scope="{ row }">
            <el-tag
              v-if="row.trainType === 0"
              color="warning"
            >线上
            </el-tag>
            <el-tag
              v-else
              color="success"
            >线下
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="UserName"
          label="培训对象"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <el-popover placement="top-start" title="培训对象" width="90%" trigger="hover">
              <div>{{ scope.row.UserName }}</div>
              <span slot="reference">{{ scope.row.UserName }}</span>
            </el-popover>
          </template>

        </el-table-column>
        <!-- <el-table-column prop="trainDate" label="培训时间" width="100" align="center" /> -->
        <!-- <el-table-column
          prop="applyState"
          label="报名状态"
          width="100"
          align="center"
        >
          <template slot-scope="{ row }">
            {{ row.applyState === 0 ? "未报名" : "已报名" }}
          </template>
        </el-table-column> -->
        <el-table-column
          prop="trainDate"
          label="培训时间"
          width="160"
          align="center"
        >
          <template slot-scope="{ row }">
            {{ row.trainDate.replace('T', ' ') }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="150"
        >
          <template slot-scope="{ row }">
            <el-button
              type="primary"
              size="mini"
              @click="publishTopic(row)"
            >发布
            </el-button>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="UpdateTopic(row)"
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
      width="600"
    >
      <el-form
        ref="planFormData"
        label-position="top"
        size="mini"
        :model="planFormData"
        :rules="ruleValidate"
      >
        <el-form-item
          label="培训名称"
          prop="planName"
        >
          <el-input
            v-model="planFormData.planName"
            placeholder="培训名称"
            :disabled="detail"
          />
        </el-form-item>
        <el-row :gutter="8">
          <el-col :span="12">
            <el-form-item
              label="选择课件"
              prop="coursewareId"
            >
              <el-select
                v-model="planFormData.coursewareId"
                collapse-tags
                multiple
                filterable
                remote
                style="width: 100%"
                :remote-method="remoteMethod"
                :loading="coursewareLoading"
                :disabled="detail"
              >
                <el-option
                  v-for="option in coursewares"
                  :key="option.coursewareID"
                  :value="option.coursewareID"
                  :label="option.coursewareName"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="条款类型"
              prop="CatalogID"
            >
              <el-select
                v-model="planFormData.CatalogID"
                style="width: 100%"
                :disabled="detail"
              >
                <el-option
                  v-for="option in catalogSelecteds"
                  :key="option.CatalogID"
                  :value="option.CatalogID"
                  :label="option.CatalogName"
                >
                  <span style="float: left">{{ option.CatalogName }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ option.SerialNo }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item
              label="培训时间"
              prop="trainDate"
            >
              <el-date-picker
                v-model="planFormData.trainDate"
                :disabled="detail"
                type="datetime"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm"
                style="width: 100%"
                placeholder="培训时间"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="主讲人"
              prop="keynoteUser"
            >
              <el-input
                v-model="planFormData.keynoteUser"
                style="width: 100%"
                placeholder="主讲人"
                :disabled="detail"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="培训地点"
              prop="Site"
            >
              <el-input
                v-model="planFormData.Site"
                style="width: 100%"
                placeholder="培训地点"
                :disabled="detail"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="任务类型"
              prop="trainType"
            >
              <el-select
                v-model="planFormData.trainType"
                style="width: 100%"
                placeholder="任务类型"
                :disabled="detail"
              >
                <el-option
                  v-for="item in taskTypeList"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row
          type="flex"
          :gutter="16"
        >
          <el-col :span="12">
            <el-card
              shadow="never"
              :style="{ height: '300px', overflow: 'auto' }"
            >
              <div slot="header">培训人员列表</div>
              <div style="padding-left: 10px">
                <el-row>
                  <el-col :span="12"><span>选择全院人员</span></el-col>
                  <el-col :span="12">
                    <el-radio-group v-model="isAllNum" size="small" @change="changNum">
                      <el-radio label="是"/>
                      <el-radio label="否"/>
                    </el-radio-group>
                  </el-col>
                </el-row>

              </div>
              <select-deptor-user
                v-show="isAllNum==='否'"
                ref="usersTree"
                :height="290"
                @getSelectDeptorUser="getSelectDeptorUser"
              />
              <!-- <div>{{ names }}</div> -->
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card
              shadow="never"
              :style="{ height: '300px', overflow: 'auto' }"
            >
              <div slot="header">
                {{ !detail ? '已选中人员列表' : '附件列表点击下载' }}
              </div>
              <div v-if="!detail">{{ names }}</div>
              <div v-else>
                <el-table
                  border
                  size="small"
                  :data="fileListTable"
                  @row-click="downloadFileList"
                >
                  <el-table-column
                    label="附件名称"
                    prop="Title"
                  />
                </el-table>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-form-item
          label="培训内容"
          prop="planContent"
        >
          <el-input
            v-model="planFormData.planContent"
            type="textarea"
            placeholder="培训内容"
            :disabled="detail"
          />
        </el-form-item>
      </el-form>

      <div class="footer">
        <el-button
          size="mini"
          style="margin-right: 5px"
          @click="onCancel()"
        >取消
        </el-button>
        <el-button
          :loading="InsertPlanLoading"
          size="mini"
          type="primary"
          style="margin-right: 5px"
          @click="InsertPlan()"
        >提交
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      custom-class="modalShow"
      :visible.sync="publishShow"
      :close-on-click-modal="false"
      :title="publishTitle"
      width="500"
    >
      <el-row
        :gutter="10"
        style="padding: 10px"
      >
        <el-col :span="12">
          <p>
            <el-tag>培训报名二维码</el-tag>
          </p>
          <qrCode :text="publishText1"/>
          <p>可以右键保存二维码图片，转发该图片到公司群供报名人员扫码报名</p>
        </el-col>
        <el-col :span="12">
          <p>
            <el-tag>培训出勤签到二维码</el-tag>
          </p>
          <qrCode :text="publishText2"/>
          <p>可以右键保存二维码图片并打印该二维码，供参加培训人员现场签到</p>
        </el-col>
      </el-row>
      <div class="footer">
        <el-button
          size="mini"
          type="primary"
          @click="publishShow = false"
        >关闭
        </el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
import { DeletePlan, InsertPlan, SelectPlanDetailByPlanID, UpdatePlan } from '@/api/PX_Plan.js';

import { SelectCourseWare } from '@/api/PX_CourseWare';
import { SelectPlan } from '@/api/PX_Plan';

import { SelectCatalogAuthorizationUser } from '@/api/catalog';

import SelectDeptorUser from '@/views/components/SelectDeptorUser';

import qrCode from '@/views/components/qrCode';

export default {
  name: 'TraningPlan',
  components: { SelectDeptorUser, qrCode },
  data() {
    return {
      isAllNum: '否', // 是否选择全院的人，默认否，自己选
      InsertPlanLoading: false, // 提交按钮的等待圈开关
      publishShow: false,
      publishTitle: '',
      publishText1: '',
      publishText2: '',
      listLoading: true,
      detail: false,
      listQuery: {
        pageIndex: 1,
        pageSize: 15,
        planName: '',
        trainType: '',
        Uid: window.userInfo[0].UserID
      },
      pagination: {
        pageIndex: 1,
        total: 0,
        pageSize: 15,
        pageSizes: [15, 20, 50, 100, 150, 200]
      },
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
      modalTitle: '新增培训计划',
      tableData: [],
      fileListTable: [],
      planFormData: {
        planId: 0,
        coursewareId: '',
        CatalogID: null,
        planName: '',
        planContent: '',
        trainDate: '',
        trainType: 0,
        CreateDate: new Date(),
        Site: '',
        keynoteUser: '',
        Uids: ''
      },
      ruleValidate: {
        planName: [{ required: true, message: '请填写培训名称' }],
        planContent: [{ required: true, message: '请填写培训内容' }],
        trainDate: [{ required: true, message: '请设置培训时间' }],
        Site: [{ required: true, message: '请填写培训地点' }],
        trainType: [{ required: true, message: '请选择培训类型' }],
        keynoteUser: [{ required: true, message: '请填写主讲人' }],
        CatalogID: [{ required: true, message: '请选择条款' }]
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
      coursewares: [],
      coursewareLoading: false,
      usersTree: [],
      names: '',
      catalogSelecteds: []
    };
  },
  async created() {
    this.SelectPlan();
    this.SelectCatalogAuthorizationUser();
    const listQuery = {
      pageIndex: 1,
      pageSize: 100,
      Title: '',
      coursewareName: ''
    };
    try {
      const { data } = await SelectCourseWare(listQuery);
      this.coursewares = data.DataList;
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    // 切换是否选择全院人员按钮
    changNum(x) {
      if (this.isAllNum === '是') {
        this.names = '全院人员';
      } else {
        this.names = null;
        // this.$nextTick(() => {
        //   this.getSelectDeptorUser();
        //
        // });
      }
      console.log(x);
    },
    downloadFileList(row) {
      window.open(`/Annex/file/${row.Title}`);
    },
    getSelectDeptorUser(value, NodesItem) {
      console.log(value);
      console.log(NodesItem);
      this.usersTree = value;
      if (this.usersTree.length === 0) {
        this.names = null;
      } else {
        this.names =
          (NodesItem || []).map((item) => item.Name).join(',') || this.names;
      }
    },
    DeleteTopic(row) {
      const { planId, planName } = row;
      this.$confirm(`是否删除：${planName}`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          try {
            const { msg } = await DeletePlan({ planId });
            this.$message({
              type: 'success',
              message: msg
            });
            this.SelectPlan();
          } catch (error) {
            console.log(error);
          }
        })
        .catch((e) => e);
    },
    async UpdateTopic({ planId, planName, UserName }) {
      try {
        const { data } = await SelectPlanDetailByPlanID({ planId });
        this.planFormData = data;
        // 点击编辑按钮，如果不是选了全院（Uids=-1），就展示选择人员组件
        if (this.planFormData.Uids !== '-1') {
          this.isAllNum = '否';
          this.modalShow = true;
        } else {
          this.isAllNum = '是';
          this.modalShow = true;
        }
        console.log('this.planFormData', this.planFormData);
        this.planFormData.coursewareId = this.planFormData.coursewareId
          .split(',')
          .map((item) => parseInt(item));
        this.names = UserName;
        this.planFormData.trainDate = data.trainDate.replace('T', ' ');
        this.modalTitle = '编辑：' + planName;

        this.$nextTick(() => {

          const userids = [
            ...new Set(data.Uids.split(',').map((item) => parseInt(item)))
          ];
          this.$refs.usersTree.setDeptorUser(userids);
          this.usersTree = userids;
          // 如果选择全院人员，就传参-1
          if (this.isAllNum === '是') {
            this.usersTree = '-1';
          }
        });
      } catch (error) {
        console.log(error);
      }
    },
    InsertPlan() {
      this.$refs['planFormData'].validate(async(v) => {
        if (v) {
          this.InsertPlanLoading = true; // 开启等待圈
          const form = this.planFormData;
          // 如果选择全院人员，就传参-1
          if (this.isAllNum === '是') {
            form.Uids = '-1';
          } else {
            this.$refs.usersTree.setDeptorUser(this.usersTree);
            form.Uids = this.usersTree.join(',');
          }
          form.coursewareId = form.coursewareId.join(',');
          try {
            const { msg } =
              this.modalTitle === '新增培训计划'
                ? await InsertPlan(form)
                : await UpdatePlan(form);
            this.$message({
              type: 'success',
              message: msg
            });

            this.SelectPlan();
            this.InsertPlanLoading = false; // 关闭等待圈
          } catch (error) {
            this.InsertPlanLoading = false; // 关闭等待圈
            console.log(error);
          } finally {
            this.InsertPlanLoading = false; // 关闭等待圈
            this.modalShow = false;
          }
        } else {
          this.InsertPlanLoading = false; // 关闭等待圈
          this.$message({
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
      this.restPlanFormData();
    },
    openModel() {
      this.modalTitle = '新增培训计划';
      this.restPlanFormData();
      this.modalShow = true;
    },
    restPlanFormData() {
      this.planFormData = {
        planId: 0,
        coursewareId: '',
        CatalogID: null,
        planName: '',
        planContent: '',
        trainDate: '',
        trainType: 0,
        CreateDate: new Date(),
        Site: '',
        keynoteUser: '',
        Uids: ''
      };
      this.names = '';
    },
    async SelectPlanDetailByPlanID({ planId, planName, UserName }) {
      try {
        const { data } = await SelectPlanDetailByPlanID({ planId });
        this.names = UserName;
        this.planFormData = data;
        this.fileListTable = data.courseware_Contents[0].File_content;
        this.planFormData.coursewareId = this.planFormData.coursewareId
          .split(',')
          .map((item) => parseInt(item));
        this.modalTitle = '详情：' + planName;
      } catch (error) {
        console.log(error);
      } finally {
        this.detail = true;
        this.modalShow = true;
      }
    },
    async UpdateApplyState(row) {
      const state = row.applyState === 0 ? '报名' : '取消报名';
      this.$confirm(`是否${state}：${row.planName}`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const form = {
            planID: row.planId,
            applyState: row.applyState === 0 ? 1 : 0,
            UserID: window.userInfo[0].UserID
          };
          try {
            const { msg } = await UpdateApplyState(form);
            this.$message.success(msg);
            this.SelectPlan();
          } catch (error) {
            console.log(error);
          }
        })
        .catch((e) => {
          const state = row.applyState === 1 ? '报名' : '取消报名';
          this.$message.success(state);
        });
    },
    async remoteMethod(query) {
      if (query !== '') {
        try {
          const listQuery = {
            pageIndex: 1,
            pageSize: 1500,
            Title: '',
            coursewareName: query
          };
          this.coursewareLoading = true;
          const { data } = await SelectCourseWare(listQuery);
          this.coursewares = data.DataList;
        } catch (error) {
          this.coursewares = [];
        } finally {
          this.coursewareLoading = false;
        }
      } else {
        this.coursewares = [];
      }
    },
    clickSelectPlan() {
      this.listQuery.pageIndex = 1;
      this.SelectPlan();
    },
    async SelectCatalogAuthorizationUser() {
      try {
        const { data } = await SelectCatalogAuthorizationUser({
          CatalogID: 0,
          UserID: window.userInfo[0].UserID
        });
        this.catalogSelecteds = data;
      } catch (error) {
        console.log(error);
      }
    },
    async SelectPlan() {
      try {
        this.listLoading = true;
        const { data } = await SelectPlan(this.listQuery);
        this.pagination.total = data.Total;
        this.tableData = data.DataList;
      } catch (error) {
        console.log(error);
      } finally {
        this.listLoading = false;
      }
    },
    handleCurrentChange(val) {
      this.listQuery.pageIndex = val;
      this.SelectPlan();
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.SelectPlan();
    },
    publishTopic({ planId, planName }) {
      console.log('window.location.host', window.location.host);
      this.publishTitle = '发布：' + planName;
      this.publishText1 = `http://${window.location.host}?trainplanId=${planId}&op=apply`;
      this.publishText2 = `http://${window.location.host}?trainplanId=${planId}&op=sign`;
      this.publishShow = true;
    }
  }
};
</script>
<style lang="scss">
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
