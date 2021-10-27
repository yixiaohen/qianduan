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
              <el-input v-model="listQuery.paperTitle" placeholder="试卷标题" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="listQuery.taskName" placeholder="任务名称" />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="SelectUserPaper('listQuery')"
              >搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div shadow="never" :style="{ height: '750px', overflow: 'auto' }">
        <el-card
          v-for="(item, index) in userPaperList"
          :key="index"
          shadow="never"
          :style="{ margin: '8px 0' }"
        >
          <div slot="header" class="font-style">
            <div>任务名称： {{ item.taskName }}</div>
            <div>试卷标题： {{ item.paperTitle }}</div>
          </div>
          <div class="font-style">
            <div>考试开始时间：{{ item.starDate.replace("T", " ") }}</div>
            <div>考试结束时间：{{ item.endDate.replace("T", " ") }}</div>
            <div>考试时长：{{ item.extime || 0 }}分钟</div>
            <div>
              考试状态：{{
                item.State === 0
                  ? "未考"
                  : item.State === 1
                    ? "已考"
                    : item.State === 2
                      ? "过时未考"
                      : "未开始"
              }}
            </div>
          </div>
          <el-button
            size="mini"
            :disabled="item.State !== 0"
            @click="openModel(item)"
          >开始考试</el-button>
        </el-card>
      </div>
    </el-card>

    <el-dialog
      custom-class="modalShow"
      :visible.sync="modalShow"
      fullscreen
      :show-fullscreen="false"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
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
          <span>
            <li>考生：{{ paperInfo.Unwinder }}</li>
            <li>
              考试剩余时间：
              <span style="color: red; font-weight: bold">{{ extime }}</span>
            </li>
          </span>
          <h3>{{ paperInfo.paperTitle }}</h3>
          <span>
            <el-button
              size="mini"
              type="primary"
              @click="submit()"
            >交卷</el-button>
          </span>
        </div>
        <div :style="{ height: 'calc(100vh - 130px)', overflow: 'auto' }">
          <el-card
            v-for="(item, index) in selectTopicSelection"
            :key="index"
            shadow="never"
            style="margin: 6px 0"
          >
            <h5>{{ item.topicTitle }}</h5>

            <div
              v-if="['单选题', '判断题'].includes(item.topicType)"
              shadow="never"
            >
              <el-radio-group v-model="item.Reply">
                <el-radio
                  v-for="it in item.topic_Contents"
                  :key="it.ID"
                  style="
                    width: 100%;
                    text-overflow: ellipsis;
                    white-space: normal;
                  "
                  :label="it.topicOptions"
                >
                  {{ it.topicOptions }}:
                  {{ it.topicValue }}
                </el-radio>
              </el-radio-group>
            </div>

            <div v-if="item.topicType === '多选题'" shadow="never">
              <el-checkbox-group v-model="item.Reply">
                <el-checkbox
                  v-for="it in item.topic_Contents"
                  :key="it.ID"
                  :label="it.topicOptions"
                  style="
                    width: 100%;
                    text-overflow: ellipsis;
                    white-space: normal;
                  "
                >
                  {{ it.topicOptions }}:{{ it.topicValue }}
                </el-checkbox>
              </el-checkbox-group>
            </div>

            <div
              v-if="['填空题', '简答题'].includes(item.topicType)"
              shadow="never"
            >
              <el-input
                v-model="item.Reply"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 5 }"
              />
            </div>

            <br>
            <div shadow="never" style="margin: 2px 0">
              <div>类型：{{ item.topicType }}</div>
              <div>分数: {{ item.topicFraction }}分</div>
            </div>
          </el-card>
        </div>
      </el-card>
    </el-dialog>
  </el-card>
</template>
<script>
import { InsertAnswerPaper, SelectUserPaper, SelectUserPaperBytaskID } from '@/api/KS_AnswerPaper';

import { SelectPaperDetailById } from '@/api/KS_Paper';

export default {
  name: 'ExampleExaminterFace',
  data() {
    return {
      listQuery: {
        paperTitle: '',
        taskName: '',
        Uid: window.userInfo[0].UserID
      },
      modalShow: false,
      userPaperList: [],
      selectTopicSelection: [],
      paperInfo: {},
      exampleFormData: {
        AnswerPaperID: 0,
        UserID: window.userInfo[0].UserID,
        ReplyTime: '',
        ReviewTime: '',
        ReviewUser: 0,
        ReplyGrade: 0,
        paperID: 0,
        PassState: 0,
        GoodState: 0,
        TaskID: 0,
        RetakeReplyTime: '',
        RetakeReviewTime: '',
        RetakeState: 0,
        ReTaskID: 0,
        RetakeUser: 0,
        ks_detailcontent: []
      },
      row: {},
      timer: null,
      extime: ''
    };
  },
  created() {
    this.SelectUserPaper();
  },
  destroyed() {
    clearInterval(this.timer);
  },
  methods: {
    openModel(row) {
      this.$confirm(
        `<div>
          <h4>请阅读以下考试规章制度:</h4>
         <p>1.禁止切换窗口，都会被检测到</p>
          <p>2.请注意考试时间</p>
          <p>3.不要刷新页面，否则考试作废</p>
        </div>`,
        `${row.taskName}`,
        {
          customClass: 'exam',
          dangerouslyUseHTMLString: true,
          distinguishCancelAndClose: true,
          confirmButtonText: '确认',
          cancelButtonText: '放弃'
        }
      )
        .then(async() => {
          try {
            const { data } = await SelectPaperDetailById({
              paperID: row.paperID
            });
            data.topicList.map(item => {
              item.Reply = item.topicType === '多选题' ? [] : '';
            });
            this.selectTopicSelection = data.topicList;
            this.paperInfo = data;
            this.timerComputed(data.extime);
            this.row = row;
          } catch {
          } finally {
            this.modalShow = true;
          }
        })
        .catch(action => {
          this.$message({
            type: 'info',
            message: '你已取消考试'
          });
        });
    },
    timerComputed(minute) {
      let second = Number.isNaN(minute * 60) ? 0 : minute * 60;
      this.timer = setInterval(() => {
        if (second <= 1) {
          this.InsertAnswerPaper();
          clearInterval(this.timer);
        }
        second--;
        this.extime = [
          parseInt(second / 60 / 60),
          parseInt((second / 60) % 60),
          parseInt(second % 60)
        ]
          .join(':')
          .replace(/\b(\d)\b/g, '0$1');
      }, 1000);
    },
    async InsertAnswerPaper() {
      clearInterval(this.timer);
      const { taskID, paperID } = this.row;
      const form = {
        UserID: window.userInfo[0].UserID,
        paperID,
        TaskID: taskID,
        ks_detailcontent: this.selectTopicSelection.map(item => {
          return {
            Reply: Array.isArray(item.Reply)
              ? /* item.Reply.join('') */
              (item.Reply = item.Reply.sort().join(''))
              : item.Reply.split(',').join('') || '未填写',
            TopicID: item.topicID
          };
        })
      };
      try {
        const data = await InsertAnswerPaper(form);
        if (data.code == 200) {
          this.SelectUserPaper();
        }
      } catch {}
      this.modalShow = false;
    },
    submit() {
      this.$confirm(`请再三检查后交卷`, `你确定要交卷了吗？`)
        .then(() => {
          this.InsertAnswerPaper();
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '耐心检查'
          });
        });
    },
    handleSubmit() {
      this.SelectUserPaper();
    },
    async SelectUserPaper() {
      if (this.$route.query.id) {
        try {
          const { data } = await SelectUserPaperBytaskID({
            taskID: this.$route.query.id,
            Uid: window.userInfo[0].UserID
          });
          this.userPaperList = data;
        } catch {}
      } else {
        try {
          const { data } = await SelectUserPaper(this.listQuery);
          this.userPaperList = data;
        } catch {}
      }
    }
  }
};
</script>
<style lang="scss">
@import "../ExampleTrainStyles/index.scss";
.exam {
  width: 320px;
}
</style>
