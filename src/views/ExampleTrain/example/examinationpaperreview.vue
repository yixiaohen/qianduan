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
              <el-input
                v-model="listQuery.taskName"
                clearable
                placeholder="任务名称"
              />
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="listQuery.paperTitle"
                clearable
                placeholder="试卷主题"
              />
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="listQuery.deptName"
                clearable
                placeholder="科室"
              />
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="listQuery.userName"
                clearable
                placeholder="考生"
              />
            </el-form-item>
            <el-form-item>
              <el-select
                v-model="listQuery.State"
                style="width: 120px"
                clearable
                placeholder="是否补考"
              >
                <el-option
                  v-for="item in RetakeStates"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="clickSelectAnswerPaper()"
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
        />
        <el-table-column
          prop="paperTitle"
          label="试卷主题"
        />
        <el-table-column
          prop="ReviewUserName"
          label="阅卷者"
          width="100"
          align="center"
        />
        <el-table-column
          prop="ReplyGrade"
          label="试卷得分"
          width="100"
          align="center"
        />
        <el-table-column
          prop="UserName"
          label="考生姓名"
          width="100"
          align="center"
        />
        <el-table-column
          prop="DeptName"
          label="所属科室"
          width="200"
          align="center"
        />
        <el-table-column
          prop="ReplyTime"
          label="答题时间"
          width="160"
          align="center"
        >
          <template slot-scope="{ row }">{{
            row.ReplyTime.replace("T", " ")
          }}</template>
        </el-table-column>
        <!-- <el-table-column
          prop="State"
          label="是否补考"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.RetakeState === 0?'否':"是" }}</span>
          </template>
        </el-table-column>-->
        <el-table-column
          label="操作"
          align="center"
          fixed="right"
          width="100"
        >
          <template slot-scope="scope">
            <el-button
              v-if="!scope.row.ReviewUser"
              size="mini"
              @click="DetailById(scope.row)"
            >阅卷</el-button>
            <el-button
              v-else
              size="mini"
              @click="DetailById(scope.row)"
            >查看</el-button>
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
      fullscreen
    >
      <el-card shadow="never">
        <div
          slot="header"
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <div>
            <h4>试卷主题：{{ taskName }}</h4>
            <h4 v-if="ReviewUserName">试卷得分：{{ ReplyGrade }}分</h4>
          </div>
        </div>
        <el-card
          shadow="never"
          :style="{ height: 'calc(100vh - 200px)', overflow: 'auto' }"
        >
          <el-card
            v-for="(item, index) in selectTopicSelection"
            :key="item.topicID"
            shadow="never"
            style="margin: 6px 0"
          >
            <h5>{{ index + 1 + "、" + item.TopicList[0].topicTitle }}</h5>

            <el-card
              v-if="['单选题', '判断题'].includes(item.TopicList[0].topicType)"
              shadow="never"
            >
              <el-radio-group
                v-model="item.Reply"
                disabled
              >
                <el-radio
                  v-for="it in item.TopicList[0].topic_Contents"
                  :key="it.ID"
                  :label="it.topicOptions"
                >{{ it.topicOptions }}:{{ it.topicValue }}</el-radio>
              </el-radio-group>
            </el-card>

            <el-card
              v-if="item.TopicList[0].topicType === '多选题'"
              shadow="never"
            >
              <el-checkbox-group
                v-model="item.Reply"
                disabled
              >
                <el-checkbox
                  v-for="it in item.TopicList[0].topic_Contents"
                  :key="it.ID"
                  :label="it.topicOptions"
                >{{ it.topicOptions }}:{{ it.topicValue }}</el-checkbox>
              </el-checkbox-group>
            </el-card>

            <el-card
              v-if="['填空题', '简答题'].includes(item.TopicList[0].topicType)"
              shadow="never"
            >
              <el-input
                v-model="item.Reply"
                type="textarea"
                disabled
                :autosize="{ minRows: 2, maxRows: 5 }"
              />
            </el-card>

            <el-card
              shadow="never"
              style="margin: 2px 0"
            >
              <li>类型：{{ item.TopicList[0].topicType }}</li>
              <li>正确答案：{{ item.TopicAnswer }}</li>
              <li>考生答案：{{ item.Reply }}</li>
              <li>分数: {{ item.TopicList[0].topicFraction }}分</li>
              <li v-if="['简答题'].includes(item.TopicList[0].topicType)">
                最终分数:
                <el-input-number
                  v-model="item.AnswerGrade"
                  :disabled="!!ReviewUserName"
                  size="mini"
                  :max="item.TopicList[0].topicFraction"
                  :min="0"
                  :step="0.1"
                />
              </li>
              <li v-if="['填空题'].includes(item.TopicList[0].topicType)">
                最终分数:
                <el-input-number
                  v-model="item.AnswerGrade"
                  :disabled="!!ReviewUserName"
                  size="mini"
                  :max="item.TopicList[0].topicFraction"
                  :min="0"
                  :step="0.1"
                />
              </li>
              <li v-else>最终分数: {{ item.AnswerGrade }}分</li>
            </el-card>
          </el-card>
        </el-card>
      </el-card>
      <div slot="footer">
        <el-button
          v-if="!ReviewUserName"
          size="mini"
          type="primary"
          @click="UpdateTotalScore()"
        >提交阅卷</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
import { SelectAnswerPaper, SelectAnswerPaperDetailById, UpdateTotalScore } from '@/api/KS_AnswerPaper';

export default {
  name: 'ExampleExaminationPaperreview',
  data() {
    return {
      listLoading: true,
      listQuery: {
        pageIndex: 1,
        pageSize: 15,
        userName: '',
        deptName: '',
        taskName: '',
        paperTitle: '',
        State: ''
      },
      modalShow: false,
      pagination: {
        pageIndex: 1,
        total: 0,
        pageSize: 15,
        pageSizes: [15, 20, 50, 100, 150, 200]
      },
      RetakeStates: [
        {
          label: '是',
          value: 1
        },
        {
          label: '否',
          value: 0
        }
      ],
      Total: 0,
      tableData: [],
      selectTopicSelection: [],
      row: null,
      ReviewUserName: null,
      taskName: null,
      ReplyGrade: 0
    };
  },
  created() {
    this.SelectAnswerPaper();
  },
  methods: {
    async UpdateTotalScore() {
      const { AnswerPaperID, RetakeState, paperID } = this.row;
      const form = {
        AnswerPaperID,
        RetakeState,
        paperID,
        ReviewUser: window.userInfo[0].UserID,
        ks_detailcontent: this.selectTopicSelection
      };
      try {
        const { msg } = await UpdateTotalScore(form);
        this.$message({
          type: 'success',
          message: msg
        });
        this.SelectAnswerPaper();
      } catch (error) {
        console.log(error);
      } finally {
        this.modalShow = false;
      }
    },
    async DetailById(row) {
      try {
        const { data } = await SelectAnswerPaperDetailById({
          AnswerPaperID: row.AnswerPaperID,
          RetakeState: row.RetakeState
        });
        this.taskName = row.taskName;
        this.row = row;
        this.ReplyGrade = row.ReplyGrade;
        this.ReviewUserName = row.ReviewUserName;
        this.selectTopicSelection = data.ks_detailcontent;
        this.selectTopicSelection.map((item) => {
          if (item.TopicList[0].topicType === '多选题') {
            item.Reply = item.Reply.split(',').join('');
          }
          // if (item.TopicList[0].topicType === "填空题") {

          //   item.AnswerGrade = item.TopicList[0].topicFraction;
          // }
        });
        this.selectTopicSelection[0].TopicAnswer = this.selectTopicSelection[0].TopicAnswer.split(
          ','
        ).join('');
      } catch (error) {
        console.log(error);
      } finally {
        this.modalShow = true;
      }
    },
    async SelectAnswerPaper() {
      this.listLoading = true;

      try {
        const { data } = await SelectAnswerPaper(this.listQuery);
        this.pagination.total = data.Total;
        this.tableData = data.DataList;
      } catch (error) {
        console.log(error);
      } finally {
        this.listLoading = false;
      }
    },
    async clickSelectAnswerPaper() {
      this.listQuery.pageIndex = 1;
      this.SelectAnswerPaper();
    },
    handleCurrentChange(val) {
      this.listQuery.pageIndex = val;
      this.SelectAnswerPaper();
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.clickSelectAnswerPaper();
    }
  }
};
</script>
<style lang="scss" scoped>
@import '../ExampleTrainStyles/index.scss';
</style>
