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
              <el-input v-model="listQuery.paperTitle" placeholder="任务名称" />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="clickSelectTask('listQuery')"
              >搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <el-table
        v-loading="listLoading"
        :data="tableData"
        height="calc(100vh - 218px)"
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
        <el-table-column
          prop="taskName"
          label="任务名称"
          width="150"
          show-overflow-tooltip
        />
        <el-table-column
          prop="paperTitle"
          label="试卷名称"
          show-overflow-tooltip
        />
        <el-table-column prop="UserName" label="考试者" show-overflow-tooltip />
        <el-table-column
          prop="starDate"
          label="开始时间"
          width="90"
          align="center"
        >
          <template slot-scope="{ row }">
            {{ row.starDate.substr(0, 10) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="endDate"
          label="结束时间"
          width="90"
          align="center"
        >
          <template slot-scope="{ row }">
            {{ row.endDate.substr(0, 10) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="taskType"
          label="任务类型"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag
              v-if="scope.row.taskType === 0"
              size="medium"
              type="success"
            >正式考试</el-tag>
            <el-tag v-else size="medium" type="warning">补考</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="250">
          <template slot-scope="{ row }">
            <el-button
              type="primary"
              size="mini"
              @click="publishTask(row)"
            >发布</el-button>
            <el-button size="mini" @click="RetakeTask(row)">补考</el-button>
            <el-button size="mini" @click="UpdateTask(row)">修改</el-button>
            <el-button size="mini" @click="DeleteTasks(row)">删除</el-button>
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
      :title="modalTitleR"
      width="600"
      custom-class="modalShow"
      :visible.sync="modalShowR"
      :close-on-click-modal="false"
    >
      <el-form
        ref="taskFormData"
        :model="taskFormData"
        :rules="ruleValidate"
        size="mini"
      >
        <el-form-item label="任务名称" prop="taskName">
          <el-input v-model="taskFormData.taskName" />
        </el-form-item>

        <el-row :gutter="20" type="flex">
          <el-col :span="12">
            <el-form-item label="开始时间" prop="starDate">
              <el-date-picker
                v-model="taskFormData.starDate"
                type="datetime"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm"
                placeholder="选择开始时间"
                @change="onChangeDateS"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="结束时间" prop="endDate">
              <el-date-picker
                v-model="taskFormData.endDate"
                type="datetime"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm"
                placeholder="选择结束时间"
                @change="onChangeDateE"
              />
            </el-form-item>
          </el-col>

          <!-- <el-col :span="8">
            <el-form-item label="任务类型" prop="taskType">
              <el-select v-model="taskFormData.taskType">
                <el-option
                  v-for="item in taskTypeList"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                />
              </el-select>
            </el-form-item>
          </el-col> -->
        </el-row>

        <el-row type="flex" :gutter="16">
          <el-col :span="12">
            <el-card shadow="never" :style="{ height: '410px' }">
              <div slot="title">人员列表</div>
              <select-deptor-user
                ref="userTree"
                :height="400"
                @getSelectDeptorUser="getSelectDeptorUser"
              />
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card
              shadow="never"
              :style="{ height: '410px', overflow: 'auto' }"
            >
              <div slot="title">已选中人员列表</div>
              <div>{{ names }}</div>
            </el-card>
          </el-col>
        </el-row>
      </el-form>
      <div class="footer">
        <el-button size="mini" @click="modalShowR = false">取消</el-button>
        <el-button
          size="mini"
          type="primary"
          @click="submitR()"
        >提交</el-button>
      </div>
    </el-dialog>
    <el-dialog
      width="300px"
      custom-class="modalShow"
      :visible.sync="publishShow"
      :close-on-click-modal="false"
      :title="publishTitle"
    >
      <p style="padding: 10px">
        <el-tag>参加考试二维码</el-tag>
      </p>
      <p style="padding: 10px">
        <qrCode :text="publishText" />
      </p>
      <p>参加考试的考生均可扫码本二维码，登录后即可打开本任务的试卷</p>
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
import qrCode from '@/views/components/qrCode';
import { DeleteTask, InsertRetakeTask, SelectTask, UpdateTask } from '@/api/KS_Paper';

import SelectDeptorUser from '@/views/components/SelectDeptorUser';

export default {
  name: 'ExampleRelease',
  components: { SelectDeptorUser, qrCode },
  data() {
    return {
      publishShow: false,
      publishTitle: '',
      publishText: '',
      modalShowR: false,
      modalTitleR: '编辑考试任务',
      listLoading: false,
      total: 0,
      listQuery: {
        pageIndex: 1,
        pageSize: 15,
        taskName: '',
        DeptID: 0,
        Uid: window.userInfo[0].UserID
      },
      tableData: [],
      usersTreeProps: {
        children: 'children',
        label: 'Name'
      },
      pagination: {
        pageIndex: 1,
        total: 0,
        pageSize: 15,
        pageSizes: [15, 20, 50, 100, 150, 200]
      },
      ruleValidate: {
        taskName: [{ required: true, message: '请填写任务名称' }],
        starDate: [{ required: true, message: '请选择开始时间' }],
        endDate: [{ required: true, message: '请选择结束时间' }],
        taskType: [{ required: true, message: '请设置任务类型' }]
      },
      taskFormData: {
        taskID: 0,
        taskName: '',
        paperID: 0,
        starDate: '',
        endDate: '',
        createDate: new Date(),
        DeptIDs: '',
        Uids: window.userInfo[0].UserID
      },
      taskTypeList: [
        {
          label: '正式考试',
          value: 0
        },
        {
          label: '补考',
          value: 1
        }
      ],
      checkStrictly: false,
      deptsTree: [],
      usersTree: [],
      names: '',
      row: null
    };
  },
  created() {
    this.SelectTask();
  },
  methods: {
    getSelectDeptorUser(value, NodesItem) {
      this.usersTree = value;
      this.names =
        (NodesItem || []).map((item) => item.Name).join(',') || this.names;
    },
    publishTask({ taskID, taskName }) {
      this.publishTitle = '发布：' + taskName;
      this.publishText = `http://${window.location.host}?examtaskId=${taskID}`;
      this.publishShow = true;
    },
    RetakeTask(row) {
      const {
        taskID,
        taskName,
        starDate,
        endDate,
        Uids,
        UserName,
        paperID,
        parentID
      } = row;
      this.taskFormData = {
        taskID,
        taskName,
        starDate: starDate.replace('T', ' '),
        endDate: endDate.replace('T', ' '),
        Uids,
        paperID,
        parentID: row.taskType ? parentID : taskID
      };
      this.row = row;
      this.names = UserName;
      this.modalTitleR = '发布补考任务:' + taskName;
      this.modalShowR = true;
      this.$nextTick(() => {
        const userids = [
          ...new Set(
            this.taskFormData.Uids.split(',').map((item) => parseInt(item))
          )
        ];
        this.$refs.userTree.setDeptorUser(userids);
        this.usersTree = userids;
      });
    },
    submitR() {
      this.$refs['taskFormData'].validate(async(v) => {
        if (v) {
          try {
            const starDate = Date.parse(new Date(this.taskFormData.starDate));
            const endDate = Date.parse(new Date(this.taskFormData.endDate));
            const extime = this.row.extime * 60000;
            if (endDate < starDate + extime) {
              this.$Message.info(
                '请设置考试结束时间大于等于开始时间加试卷时长'
              );
              return;
            }
            const usersTree = this.usersTree;
            const form = this.taskFormData;
            form.Uids = usersTree.join(',');
            const { msg } = this.modalTitleR.includes('编辑')
              ? await UpdateTask(form)
              : await InsertRetakeTask(form);
            // const { msg } = await UpdateTask(form)
            this.$message({
              type: 'info',
              message: msg
            });
            this.modalShowR = false;
          } catch (error) {
            this.$message({
              type: 'error',
              message: error
            });
          } finally {
            this.SelectTask();
          }
        } else {
          this.$message({
            type: 'info',
            message: '你有必填项没填写'
          });
        }
      });
    },
    UpdateTask(row) {
      const {
        taskID,
        taskName,
        starDate,
        endDate,
        Uids,
        UserName,
        paperID,
        parentID
      } = row;
      this.taskFormData = {
        taskID,
        taskName,
        starDate: starDate.replace('T', ' '),
        endDate: endDate.replace('T', ' '),
        Uids,
        paperID,
        parentID
      };

      this.row = row;
      this.names = UserName;
      this.modalTitleR = '编辑考试任务:' + taskName;
      this.modalShowR = true;
      this.$nextTick(() => {
        const userids = [
          ...new Set(
            this.taskFormData.Uids.split(',').map((item) => parseInt(item))
          )
        ];
        this.$refs.userTree.setDeptorUser(userids);
        this.usersTree = userids;
      });
    },
    onChangeDateS(r) {
      this.taskFormData.starDate = r;
    },
    onChangeDateE(r) {
      this.taskFormData.endDate = r;
    },
    async SelectTask() {
      this.listLoading = true;
      try {
        const { data } = await SelectTask(this.listQuery);
        this.pagination.total = data.Total;
        this.tableData = data.DataList;
      } catch (error) {
        console.log(error);
      } finally {
        this.listLoading = false;
      }
    },
    async clickSelectTask() {
      this.listQuery.pageIndex = 1;
      this.SelectTask();
    },
    handleCurrentChange(val) {
      this.listQuery.pageIndex = val;
      this.SelectTask();
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.clickSelectTask();
    },
    DeleteTasks(row) {
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DeleteTask({
          taskID: row.taskID
        }).then((res) => {
          this.$message.success(res.msg);
          this.SelectTask();
        });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../ExampleTrainStyles/index.scss";
</style>
