<template>
  <el-card class="box-card-view">
    <el-card shadow="never" class="box-card-center">
      <div slot="header">
        <div class="search-view">
          <el-form
            ref="listQuery"
            :inline="true"
            :model="listQuery"
            size="mini"
          >
            <el-form-item>
              <el-input
                v-model="listQuery.keynoteUser"
                clearable
                placeholder="主讲人"
              />
            </el-form-item>
            <el-form-item>
              <el-select v-model="listQuery.applyState" placeholder="培训类型">
                <el-option
                  v-for="item in applyState"
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
              >搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
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
        <el-table-column prop="planName" label="培训名称" />
        <el-table-column
          prop="trainType"
          label="培训类型"
          width="100"
          align="center"
        >
          <template slot-scope="{ row }">
            <el-tag v-if="row.trainType === 0" color="warning">线上</el-tag>
            <el-tag v-else color="success">线下</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="UserName" label="培训对象" width="300" />
        <!-- <el-table-column prop="trainDate" label="培训时间" width="100" align="center" /> -->
        <el-table-column
          prop="applyState"
          label="报名状态"
          width="100"
          align="center"
        >
          <template slot-scope="{ row }">
            {{ row.applyState === 0 ? "未报名" : "已报名" }}
          </template>
        </el-table-column>
        <el-table-column
          prop="trainDate"
          label="培训时间"
          width="160"
          align="center"
        >
          <template slot-scope="{ row }">
            {{ row.trainDate.replace("T", " ") }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="150">
          <template slot-scope="{ row }">
            <el-button
              :type="row.applyState === 0 ? 'primary' : 'warning'"
              size="mini"
              @click="UpdateApplyState(row)"
            >{{ row.applyState === 0 ? "报名" : "取消报名" }}</el-button>
            <el-button
              :disabled="row.applyState !== 1"
              size="mini"
              @click="SelectPlanDetailByPlanID(row)"
            >详情</el-button>
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
        <el-form-item label="培训名称" prop="planName">
          <el-input
            v-model="planFormData.planName"
            placeholder="培训名称"
            :disabled="detail"
          />
        </el-form-item>
        <el-row :gutter="8">
          <el-col :span="12">
            <el-form-item label="选择课件" prop="coursewareId">
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
            <el-form-item label="条款类型" prop="CatalogID">
              <el-select
                v-model="planFormData.CatalogID"
                style="width: 100%"
                :disabled="detail"
              >
                <el-option
                  v-for="option in catalogSelecteds"
                  :key="option.CatalogID"
                  :value="option.CatalogID"
                  :label="option.SerialNo"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="培训时间" prop="trainDate">
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
            <el-form-item label="主讲人" prop="keynoteUser">
              <el-input
                v-model="planFormData.keynoteUser"
                style="width: 100%"
                placeholder="主讲人"
                :disabled="detail"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="培训地点" prop="Site">
              <el-input
                v-model="planFormData.Site"
                style="width: 100%"
                placeholder="培训地点"
                :disabled="detail"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="任务类型" prop="trainType">
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
        <el-row type="flex" :gutter="16">
          <el-col :span="12">
            <el-card
              shadow="never"
              :style="{ height: '300px', overflow: 'auto' }"
            >
              <div slot="header">培训人员列表</div>
              <!-- <select-deptor-user
                ref="usersTree"
                @getSelectDeptorUser="getSelectDeptorUser"
              /> -->
              <div>{{ names }}</div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card
              shadow="never"
              :style="{ height: '300px', overflow: 'auto' }"
            >
              <div slot="header">
                {{ !detail ? "已选中人员列表" : "附件列表点击下载" }}
              </div>
              <div v-if="!detail">{{ names }}</div>
              <div v-else>
                <el-table
                  border
                  size="small"
                  :data="fileListTable"
                  @row-click="downloadFileList"
                >
                  <el-table-column label="附件名称" prop="Title" />
                </el-table>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-form-item label="培训内容" prop="planContent">
          <el-input
            v-model="planFormData.planContent"
            type="textarea"
            placeholder="培训内容"
            :disabled="detail"
          />
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button
          size="mini"
          style="margin-right: 5px"
          @click="onCancel()"
        >取消</el-button>
        <el-button
          size="mini"
          type="primary"
          style="margin-right: 5px"
          @click="InsertPlan()"
        >提交</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
import { SelectPlanDetailByPlanID } from '@/api/PX_Plan.js';

import { SelectCourseWare } from '@/api/PX_CourseWare';
import { SelectApply, SelectApplyByPlanID, UpdateApplyState } from '@/api/PX_Apply';

import { SelectCatalogAuthorizationUser } from '@/api/catalog';

export default {
  name: 'MyPlan',
  data() {
    return {
      listLoading: true,
      detail: false,
      listQuery: {
        pageIndex: 1,
        pageSize: 15,
        keynoteUser: '',
        applyState: '',
        Uid: window.userInfo[0].UserID
      },
      pagination: {
        pageIndex: 1,
        total: 0,
        pageSize: 15,
        pageSizes: [15, 20, 50, 100, 150, 200]
      },
      applyState: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '未报名',
          value: 0
        },
        {
          label: '已报名',
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
        CatalogID: 0,
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
      planID: '',
      coursewareName: ''
    };
    try {
      const { data } = await SelectCourseWare(listQuery);
      this.coursewares = data.DataList;
    } catch (error) {}
  },
  methods: {
    downloadFileList(row) {
      window.open(`/Annex/file/${row.Title}`);
    },
    getSelectDeptorUser(value, NodesItem) {
      this.usersTree = value;
      this.names =
        (NodesItem || []).map((item) => item.Name).join(',') || this.names;
    },
    onCancel() {
      this.detail = false;
      this.modalShow = false;
      this.names = '';
      this.restPlanFormData();
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
        this.detail = true;
      } catch (error) {
      } finally {
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
          const { msg } = await UpdateApplyState(form);
          this.$message({
            type: 'success',
            message: msg
          });
          this.SelectPlan();
        })
        .catch((e) => {
          const state = row.applyState === 1 ? '报名' : '取消报名';
          this.$message({
            type: 'success',
            message: state
          });
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
      } catch (error) {}
    },
    async SelectPlan() {
      try {
        this.listLoading = true;
        if (this.$route.query.id) {
          this.listQuery.planID = this.$route.query.id;
          const { data } = await SelectApplyByPlanID(this.listQuery);
          this.tableData = data;
          this.pagination.total = 1;
        } else {
          const { data } = await SelectApply(this.listQuery);
          this.tableData = data.DataList;
          this.pagination.total = data.Total;
        }
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
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../ExampleTrainStyles/index.scss";
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
