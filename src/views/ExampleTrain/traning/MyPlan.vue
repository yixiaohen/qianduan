<template>
  <el-card class="box-card-view">
    <el-card shadow="never" class="box-card-center">
      <div v-if="isSeeMovie">
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
                >搜索
                </el-button>
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
          <el-table-column prop="planName" label="培训名称"/>
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
          <el-table-column
            prop="planContent"
            label="培训内容"
            width="100"
            align="center"
          />
          <el-table-column
            prop="keynoteUser"
            label="主讲人"
            width="100"
            align="center"
          />
          <el-table-column
            prop="Site"
            label="培训地点"
            width="100"
            align="center"
          />

          <el-table-column prop="UserName" label="培训对象" width="300" align="center"/>
          <!-- <el-table-column prop="trainDate" label="培训时间" width="100" align="center" /> -->
          <el-table-column
            prop="applyState"
            label="报名状态"
            width="100"
            align="center"
          >
            <template slot-scope="{ row }">
              {{ row.applyState === 0 ? '未报名' : '已报名' }}
            </template>
          </el-table-column>
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
          <el-table-column label="操作" align="center" fixed="right" width="150">
            <template slot-scope="{ row }">
              <el-button
                :type="row.applyState === 0 ? 'primary' : 'warning'"
                size="mini"
                @click="UpdateApplyState(row)"
              >{{ row.applyState === 0 ? '报名' : '取消报名' }}
              </el-button>
              <el-button
                :disabled="row.applyState !== 1"
                size="mini"
                @click="SelectPlanDetailByPlanID(row)"
              >详情
              </el-button>
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
      </div>

      <div v-else>
        <el-alert :closable="false">
          <span>{{ videoTitle }}</span>

        </el-alert>

        <div>
          <el-button @click="backMyPlan">
            返回
          </el-button>
          <el-tag>已观看：{{ counter }}秒</el-tag>

        </div>

        <div
          style="
            text-align: center;
            margin-bottom: 20px;
            position: relative;"
        >
          <video
            v-if="isVideo"
            ref="videoId"
            width="1000px"
            height="600px"
            display="block"
            :src="videoUrl"
            controls="controls"
          />
          <div
            v-else
          >
            <iframe
              :src="videoUrl" width="90%"
              height="600px"
            ></iframe>
          </div>
        </div>
        <el-tag type="info">提示：如果显示不出来，有可能是不支持该格式</el-tag>
      </div>
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
        size="mini"
        :model="planFormData"
        :rules="ruleValidate"
        label-width="120px"
      >
        <el-row :gutter="8">
          <el-col :span="12">
            <el-form-item label="培训名称:">
              <span>{{ planFormData.planName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="完成状态:">
              <el-tag v-if="isFinish===0">已完成</el-tag>
              <el-tag v-else type="danger">未完成</el-tag>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="12">
            <el-form-item label="课件:">
              <el-select
                v-model="planFormData.coursewareId"
                multiple
                filterable
                remote
                style="width: 100%"
                :remote-method="remoteMethod"
                :loading="coursewareLoading"
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
            <el-form-item label="条款类型:">
              <span v-for="option in catalogSelecteds">
                {{
                  planFormData.CatalogID === option.CatalogID ? option.CatalogName : ''
                }} </span>

            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="要求观看总时长:">
              <el-tag type="success">{{ TargetTime }}秒</el-tag>
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="已观看总时长:">
              <el-tag>{{ UsingTime }}秒</el-tag>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="培训时间:">
              <span>{{ planFormData.trainDate ? planFormData.trainDate.replace('T', ' ') : '' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主讲人:">
              <span>{{ planFormData.keynoteUser }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="培训地点:">

              <span>{{ planFormData.Site }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务类型:">
              <span v-for="item in taskTypeList">
                {{
                  planFormData.trainType === item.value ? item.label : ''
                }} </span>
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
              <div>{{ names }}</div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card
              shadow="never"
              :style="{ height: '300px', overflow: 'auto' }"
            >
              <div slot="header">
                {{ !detail ? '已选中人员列表' : '点击附件列表学习课件' }}
              </div>
              <div v-if="!detail">{{ names }}</div>
              <div v-else>
                <el-table
                  border
                  size="small"
                  :data="fileListTable2"
                  @row-click="downloadFileList"
                >
                  <el-table-column label="课件名称" prop="Title">
                    <template slot-scope="{ row }">
                      <el-tag size="mini" style="margin-right: 16px">已观看{{ row.UsingTime || 0 }}秒</el-tag>
                      <el-tag type="success" size="mini">目标时间：{{ row.TargetTime }}秒</el-tag>
                      <i v-if="row.TargetTime*1<=row.UsingTime*1" class="el-icon-circle-check"/>
                      <i v-else class="el-icon-circle-close"/>
                      <br>
                      <el-tag type="info" size="mini"> {{ row.Title }}</el-tag>


                      <el-button type="primary" size="mini">学习

                      </el-button>


                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-form-item label="培训内容：">
          <span>{{ planFormData.planContent }}</span>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button
          size="mini"
          style="margin-right: 5px"
          @click="onCancel()"
        >关闭
        </el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
import { SelectPlanDetailByPlanID, UpdateTargetTimeByUserId } from '@/api/PX_Plan.js';

import { SelectCourseWare } from '@/api/PX_CourseWare';
import { SelectApply, SelectApplyByPlanID, UpdateApplyState } from '@/api/PX_Apply';

import { SelectCatalogAuthorizationUser } from '@/api/catalog';

export default {
  name: 'MyPlan',
  data() {
    return {
      isFinish: 0, // 是否观看课件状态完成,默认为0,完成，其他为不完成
      isVideo: false, // 课件是否video
      myVar: null, // 计时增加观看课件时间的计时器
      sendVar: null, // 计时发送观看课件时间的计时器
      courseId: null, // 当前观看的附件的id
      videoTitle: '', // 视频标题
      nowRow: null, // 点击详情，记录当前所点击条目的数据
      nowCoursewareID: null, // 现在点击的课件的id
      end: true, // 是否结束了,true结束
      videoUrl: '',
      isSeeMovie: true, // 是否在看视频课件
      TargetTime: 0, // 课件要求总观看时长
      UsingTime: 0, // 课件已总观看时长
      nowPlanId: 0, // 当前的培训计划id,用来发送里面观看课件时长要传的参数
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
      fileListTable2: [], // 学习课件列表
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
      catalogSelecteds: [],
      counter: 0
    };
  },
  async created() {
    await this.SelectPlan();
    await this.SelectCatalogAuthorizationUser();
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
    } catch (e) {
      console.log(e);
    }
  },
  mounted() {

  },
  beforeDestroy() {
    // 每次离开页面初始计时器
    clearInterval(this.myVar);
    clearInterval(this.sendVar);
    // 每次离开页面之后也发送一次观看时间
    this.UpdateTargetTimeByUserId();
  },
  methods: {
    // 观看课件点击返回按钮
    backMyPlan() {
      this.isSeeMovie = true;
      this.end = true;
      // 每次离开页面初始计时器
      clearInterval(this.myVar);
      clearInterval(this.sendVar);
      // 点击返回按钮之后也发送一次观看时间
      this.UpdateTargetTimeByUserId();
      // 发送之后就查询之前打开详情框的数据
      this.$nextTick(() => {
        // 查到详情框的数据再打开dialog对话框
        this.SelectPlanDetailByPlanID(this.nowRow);
        this.$nextTick(() => {
          this.modalShow = true;
        });
      });

    },
    // 每5秒调用接口，更新用户附件观看时长,使用异步的接口，不用返回值
    UpdateTargetTimeByUserId() {
      UpdateTargetTimeByUserId({
        FileId: this.courseId, // 附件id
        PlanId: this.nowPlanId, // 计划id
        CoursewareID: this.nowCoursewareID, // 课件id
        UsingTime: this.counter, // 观看总时长
        UserId: window.userInfo[0].UserID // 用户id
      });
    },
    // 跳转到观看课件页面，并计时
    downloadFileList(row) {
      console.log('see', row);
      // 每次点击课件进来先初始计时器和秒数
      clearInterval(this.myVar);
      clearInterval(this.sendVar);
      this.counter = row.UsingTime * 1; // 乘以1为了转为数字型
      // 设置计时观看课件时长计时器
      this.myVar = setInterval(() => {
        this.counter++;
      }, 1000);
      this.courseId = row.Id; // 附件id
      this.nowCoursewareID = row.coursewareID; // 课件id
      this.sendVar = setInterval(() => {
        // 每10秒调用接口，更新用户附件观看时长,发送的时间是到目前为止总已观看时长，使用异步的接口，不用返回值
        this.UpdateTargetTimeByUserId();
      }, 10000);
      this.isSeeMovie = false;
      this.modalShow = false;
      this.end = false;
      console.log(row);
      this.videoTitle = row.Title;

      // 去掉文件名后缀
      this.videoTitle = this.videoTitle.replace(/(.*\/)*([^.]+).*/ig, '$2');
      this.videoUrl = `/Annex/file/${row.Title}`;
      const example = /^.+(\.mp4)$/;
      if (example.test(row.Title)) {
        this.isVideo = true; // 是video
      } else {
        this.isVideo = false; // 不是video
      }

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
    async SelectPlanDetailByPlanID(row) {
      try {
        this.nowPlanId = row.planId; // 当前的计划id
        this.nowRow = row; // 当前的点击详情条目的数据
        const { data } = await SelectPlanDetailByPlanID({ planId: row.planId });
        this.names = row.UserName;
        this.planFormData = data;
        // 遍历显示学习课件
        // 遍历前确保存放的数组都为初始空
        this.fileListTable = [];
        this.fileListTable2 = [];
        // { planId, planName, UserName }
        data.courseware_Contents.map((item) => {
          this.fileListTable.push(item.File_content);
          // 下面是为了得到课件的id，在遍历层级中，对应的对象中，添加coursewareID字段，方便计时观看多久发送参数
          for (var i = 0; i++; i < this.fileListTable.length) {
            this.fileListTable[i]['coursewareID'] = item.coursewareID;
          }

        });
        this.fileListTable.map((item1) => {
          item1.map((item2) => {
            this.fileListTable2.push(item2);
          });
        });
        console.log(this.fileListTable2);
        // 得到课件所有目标总时长和已观看的总时长之前清空一遍
        this.UsingTime = 0;
        this.TargetTime = 0;
        this.isFinish=0; // 把判断是否完成状态设为初始状态
        // 得到课件所有目标总时长和已观看的总时长
        this.fileListTable2.map((item) => {
          this.UsingTime += item.UsingTime * 1; // 已观看总时长
          this.TargetTime += item.TargetTime * 1; // 规定总时长
          if (item.UsingTime * 1 < item.TargetTime * 1) { // 只要有一个课件时间不到达目标值，就加一，就是不完成
            this.isFinish = this.isFinish + 1;
          }
        });
        console.log(this.TargetTime);
        console.log(this.UsingTime);
        this.planFormData.coursewareId = this.planFormData.coursewareId
          .split(',')
          .map((item) => parseInt(item));
        this.modalTitle = '详情：' + row.planName;
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
      } catch (error) {
      }
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
<style lang="scss">
@import "../ExampleTrainStyles/index.scss";
// 导出等待条样式
@import "src/styles/loading.scss";
// 观看课件完毕按钮
.el-icon-circle-check {
  color: green;
}

.el-icon-circle-close {
  color: red;
}

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
