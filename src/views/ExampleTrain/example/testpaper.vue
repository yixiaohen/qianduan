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
              <el-button
                type="primary"
                :disabled="modalShow"
                @click="openModel"
              >制作试卷
              </el-button>
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="listQuery.paperTitle"
                clearable
                placeholder="试卷标题"
              />
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="listQuery.Unwinder"
                clearable
                placeholder="出卷人"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="clickSelectPaper()"
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
        <el-table-column prop="paperTitle" label="试卷标题" />
        <el-table-column
          prop="paperGrade"
          label="试卷总分"
          width="100"
          align="center"
        />
        <el-table-column
          prop="GoodGrade"
          label="优秀分数"
          width="100"
          align="center"
        />
        <el-table-column
          prop="PassGrade"
          label="及格分数"
          width="100"
          align="center"
        />
        <el-table-column
          prop="Unwinder"
          label="出卷人"
          width="100"
          align="center"
        />
        <el-table-column
          prop="crateTime"
          label="创建时间"
          width="160"
          align="center"
        >
          <template slot-scope="{ row }">
            {{ row.crateTime.replace('T', ' ') }}
          </template>
        </el-table-column>
        <el-table-column
          prop="extime"
          label="考试时长"
          width="100"
          align="center"
        />
        <el-table-column
          prop="paperState"
          label="试卷状态"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag
              v-if="scope.row.paperState === 0"
              size="medium"
              type="warning"
            >未用
            </el-tag>
            <el-tag v-else size="medium" type="success">已用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="180">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="InsertTask(scope.row)"
            >发布任务
            </el-button>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="UpdatePaper(scope.row)"
            />
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="DeletePaper(scope.row)"
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
      <el-dialog
        custom-class="modalShow"
        :title="modalTitle"
        :visible.sync="modalShow"
        :close-on-click-modal="false"
        fullscreen
        @close="cancel()"
      >
        <el-card shadow="never">
          <div slot="header">
            <el-form
              ref="_TopicFormData"
              :model="PaperFormData"
              :rules="ruleValidate"
              size="mini"
            >
              <el-form-item label="考试主题" prop="paperTitle">
                <el-input v-model="PaperFormData.paperTitle" />
              </el-form-item>
              <el-row :gutter="10">
                <el-col :span="6">
                  <el-form-item label="总分" prop="paperGrade">
                    <el-input v-model="PaperFormData.paperGrade" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="及格分数" prop="PassGrade">
                    <el-input v-model="PaperFormData.PassGrade" />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="优秀分数" prop="GoodGrade">
                    <el-input v-model="PaperFormData.GoodGrade" />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="考试时长（分钟）" prop="extime">
                    <el-input v-model="PaperFormData.extime" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-card
                shadow="never"
                class="box-card-center"
                :style="{ height: 'calc(100vh - 281px)', overflow: 'auto' }"
              >
                <div slot="header">
                  <el-form
                    ref="TopicListQuery"
                    :model="TopicListQuery"
                    inline
                    size="mini"
                  >
                    <el-form-item>
                      <el-input
                        v-model="TopicListQuery.topicTitle"
                        type="text"
                        clearable
                        placeholder="试题内容"
                      />
                    </el-form-item>
                    <el-form-item>
                      <el-select
                        v-model="TopicListQuery.topicType"
                        clearable
                        :style="{ width: '100px' }"
                        placeholder="试题类型"
                      >
                        <el-option
                          v-for="item in topicTypes"
                          :key="item.value"
                          :value="item.value"
                          :label="item.label"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-select
                        v-model="TopicListQuery.topicGenreName"
                        clearable
                        :style="{ width: '100px' }"
                        placeholder="试题分类"
                      >
                        <el-option
                          v-for="item in topicGenre"
                          :value="item.topicGenreName"
                          :label="item.topicGenreName"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-button
                        type="primary"
                        @click="SelectTopic(TopicListQuery.topicGenreName)"
                      >搜索
                      </el-button>
                    </el-form-item>
                  </el-form>
                </div>
                <el-table
                  ref="selectionName"
                  :data="nameTableData"
                  border
                  size="mini"
                  height="calc(100vh - 346px)"
                  @select="onSelect"
                  @select-all="onSelectAll"
                  @selection-change="onSelectionChange"
                >
                  <el-table-column type="selection" width="55" align="center" />
                  <el-table-column
                    label="序号"
                    type="index"
                    width="60"
                    align="center"
                  />
                  <el-table-column label="试题内容" prop="topicTitle" />
                  <el-table-column
                    label="试题类型"
                    prop="topicType"
                    align="center"
                  />
                  <el-table-column
                    label="试题分类"
                    prop="topicGenreName"
                    align="center"
                  />
                  <el-table-column
                    label="分数"
                    prop="topicFraction"
                    align="center"
                  />
                </el-table>
              </el-card>
            </el-col>

            <el-col :span="16">
              <el-card
                shadow="never"
                :style="{ height: 'calc(100vh - 281px)', overflow: 'auto' }"
              >
                <div slot="title">试卷预览</div>
                <el-card v-if="selectTopicSelection.length" shadow="never">
                  <el-card
                    v-for="(item, index) in selectTopicSelection"
                    :key="item.topicID"
                    shadow="never"
                    style="margin: 6px 0"
                  >
                    <h5>{{ index + 1 + '、' + item.topicTitle }}</h5>

                    <el-card
                      v-if="['单选题', '判断题'].includes(item.topicType)"
                      shadow="never"
                    >
                      <el-radio-group>
                        <el-radio
                          v-for="it in item.topic_Contents"
                          :key="it.ID"
                          :label="it.topicOptions"
                        >
                          {{ it.topicOptions }}:{{ it.topicValue }}
                        </el-radio>
                      </el-radio-group>
                    </el-card>

                    <el-card v-if="item.topicType === '多选题'" shadow="never">
                      <el-checkbox-group v-model="s">
                        <el-checkbox
                          v-for="it in item.topic_Contents"
                          :key="it.ID"
                          :label="it.topicOptions"
                        >
                          {{ it.topicOptions }}:{{ it.topicValue }}
                        </el-checkbox>
                      </el-checkbox-group>
                    </el-card>

                    <el-card
                      v-if="['填空题', '简答题'].includes(item.topicType)"
                      shadow="never"
                    >
                      <el-input
                        type="textarea"
                        :autosize="{ minRows: 2, maxRows: 5 }"
                      />
                    </el-card>

                    <el-card shadow="never" style="margin: 2px 0">
                      <div>类型：{{ item.topicType }}</div>
                      <div>答案：{{ item.topicAnswer }}</div>
                      <div>分数: {{ item.topicFraction }}分</div>
                    </el-card>
                  </el-card>
                </el-card>
              </el-card>
            </el-col>
          </el-row>
        </el-card>
        <div class="footer">
          <el-button
            size="mini"
            @click="cancel('_TopicFormData')"
          >取消
          </el-button>
          <el-button
            size="mini"
            type="primary"
            @click="submit('_TopicFormData')"
          >提交
          </el-button>
        </div>
      </el-dialog>
    </el-card>

    <el-dialog
      :title="modalTitleR"
      width="600"
      custom-class="modalShow"
      :visible.sync="modalShowR"
      :close-on-click-modal="false"
      @close="cancel()"
    >
      <el-form
        ref="taskFormData"
        size="mini"
        :model="taskFormData"
        :rules="ruleValidate"
      >
        <el-form-item label="任务名称" prop="taskName">
          <el-input v-model="taskFormData.taskName" />
        </el-form-item>
        <el-row :gutter="20">
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
        >提交
        </el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
import { DeletePaper, InsertPaper, InsertTask, SelectPaper, SelectPaperDetailById, UpdateUser } from '@/api/KS_Paper';

import { SelectAllTopicDetail, SelectTopicGenre } from '@/api/KS_Topic';
import SelectDeptorUser from '@/views/components/SelectDeptorUser';

export default {
  name: 'ExampleTestPaper',
  components: { SelectDeptorUser },
  data() {
    return {
      modalShow: false,
      modalTitle: '制作试卷',
      modalShowR: false,
      modalTitleR: '发布考试',
      listLoading: true,
      listQuery: {
        UserID: window.userInfo[0].UserID,
        pageIndex: 1,
        pageSize: 15,
        Unwinder: '',
        paperTitle: ''
      },
      TopicListQuery: {
        pageIndex: 1,
        pageSize: 500,
        topicTitle: '',
        topicType: '',
        topicGenreName: ''
        // topicGenreID: 0
      },
      pagination: {
        pageIndex: 1,
        total: 0,
        pageSize: 15,
        pageSizes: [15, 20, 50, 100, 150, 200]
      },
      value1: 1,
      total: 0,
      usersTreeProps: {
        children: 'children',
        label: 'Name'
      },
      departmentData: [],
      department: [],
      tableData: [],
      PaperFormData: {
        CreateUserID: window.userInfo[0].UserID,
        paperID: 0,
        paperTitle: '',
        Unwinder: window.userInfo[0].UserName,
        crateTime: new Date(),
        paperGrade: 0,
        PassGrade: 0,
        GoodGrade: 0,
        paperState: 0,
        extime: 0,
        topicIDs: [],
        topicList: []
      },
      ruleValidate: {
        paperTitle: [{ required: true, message: '请填写考试主题' }],
        PassGrade: [{ required: true, message: '请填写及格分数' }],
        GoodGrade: [{ required: true, message: '请填写优秀分数' }],
        extime: [{ required: true, message: '请设置考试时长' }],
        taskName: [{ required: true, message: '请填写任务名称' }],
        starDate: [{ required: true, message: '请选择开始时间' }],
        endDate: [{ required: true, message: '请选择结束时间' }],
        taskType: [{ required: true, message: '请设置任务类型' }]
      },
      topicTypes: [
        {
          value: '单选题',
          label: '单选题'
        },
        {
          value: '多选题',
          label: '多选题'
        },
        {
          value: '填空题',
          label: '填空题'
        },
        {
          value: '判断题',
          label: '判断题'
        },
        {
          value: '简答题',
          label: '简答题'
        }
      ],
      nameTableData: [{
        topicGenreName: ''
      }],
      topicIDs: [],
      selectTopicSelection: [],
      taskFormData: {
        taskID: 0,
        taskName: '',
        paperID: 0,
        starDate: '',
        endDate: '',
        createDate: new Date(),
        DeptIDs: '',
        Uids: '',
        taskType: 0,
        extime: ''
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
      deptsTree: [],
      usersTree: [],
      s: [],
      names: '',
      row: null,
      topicGenre: {} // 题库分类数据
    };
  },
  created() {
    this.SelectPaper();
    this.SelectTopic();
    this.SelectTopicGenre();
  },
  methods: {
    // 加载分类列表
    async SelectTopicGenre() {
      try {
        const { data } = await SelectTopicGenre();
        this.topicGenre = data.DataList;
        console.log(this.topicGenre);
      } catch (error) {
        console.log(error);
      }
    },
    getSelectDeptorUser(value, NodesItem) {
      this.usersTree = value;
      this.names =
        (NodesItem || []).map((item) => item.Name).join(',') || this.names;
    },
    onChangeDateS(r) {
      this.taskFormData.starDate = r;
    },
    onChangeDateE(r) {
      this.taskFormData.endDate = r;
    },
    restFormData(name) {
      this.taskFormData = {
        taskID: 0,
        taskName: '',
        paperID: 0,
        starDate: '',
        endDate: '',
        createDate: new Date(),
        DeptIDs: '',
        Uids: '',
        taskType: 0
      };
      this.PaperFormData = {
        CreateUserID: window.userInfo[0].UserID,
        paperID: 0,
        paperTitle: '',
        Unwinder: window.userInfo[0].UserName,
        crateTime: new Date(),
        paperGrade: 0,
        PassGrade: 0,
        GoodGrade: 0,
        paperState: 0,
        extime: 0,
        topicIDs: [],
        topicList: []
      };
      this.names = '';
      this.usersTree = [];
      this.selectTopicSelection = [];
      this.SelectTopic();
      this.$refs['_TopicFormData'] &&
      this.$refs['_TopicFormData'].resetFields();
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
            if (this.taskFormData.extime <= 0) {
              this.$message.warning('考试时长低于0,请重新设置再发布');
              return;
            }
            debugger;
            const usersTree = this.usersTree;
            const form = this.taskFormData;
            form.Uids = usersTree.join(',');
            const { msg } = await InsertTask(form);
            this.$message({
              type: 'info',
              message: msg
            });
            this.modalShowR = false;
          } catch (error) {
            this.$message({
              type: 'info',
              message: error
            });
          } finally {
            this.SelectPaper();
          }
        } else {
          this.$message({
            type: 'info',
            message: '你有必填项目没写'
          });
        }
      });
    },
    InsertTask(row) {
      this.modalTitleR = `发布试卷：${row.paperTitle}`;
      this.taskFormData.paperID = row.paperID;
      this.taskFormData.extime = row.extime;
      this.row = row;
      this.modalShowR = true;
    },
    renderContent(h, { root, node, data }) {
      return h('span', [h('span', [h('span', data.Name)])]);
    },
    async DeletePaper(row) {
      const { paperID } = row;
      this.$confirm(`此操作将永久删除 ${row.paperTitle} , 是否继续?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          try {
            const { msg } = await DeletePaper({ paperID });
            this.$message({
              type: 'success',
              message: msg
            });
            this.clickSelectPaper();
          } catch (error) {
          }
        })
        .catch((e) => e);
    },
    async UpdatePaper(row) {
      try {
        const { data } = await SelectPaperDetailById({ PaperID: row.paperID });
        this.PaperFormData = data;
        this.selectTopicSelection = data.topicList;
        this.SelectTopic();
        this.topicIDs = data.topicIDs;
        this.modalTitle = '编辑试卷：' + row.paperTitle;
      } catch (error) {
      } finally {
        this.modalShow = true;
      }
    },
    async onSelectCancel(selection, row) {
      this.selectTopicSelection.forEach((item, index) => {
        if (item.topicID === row.topicID) {
          this.selectTopicSelection.splice(index, 1);
        }
      });
    },
    onSelectAllCancel() {
      this.selectTopicSelection = [];
    },
    onSelectAll(selection) {
      this.selectTopicSelection = selection;
    },
    onSelect(selection, row) {
      this.selectTopicSelection = selection;
    },
    onSelectionChange(selection) {
      const topicIDs = [];
      const topicFraction = [];
      selection.forEach((item) => {
        topicIDs.push(item.topicID);
        topicFraction.push(item.topicFraction);
      });
      this.PaperFormData.paperGrade = topicFraction.reduce((a, b) => a + b, 0);
      this.PaperFormData.topicIDs = topicIDs;
      this.PaperFormData.topicList = selection;
    },
    submit(name) {
      this.$refs[name].validate(async(valid) => {
        if (valid) {
          try {
            const formData = this.PaperFormData;
            const { msg } =
              this.modalTitle === '制作试卷'
                ? await InsertPaper(formData)
                : await UpdateUser(formData);
            this.$message({
              type: 'info',
              message: msg
            });
            this.modalShow = false;
          } catch (error) {
            this.$message({
              type: 'info',
              message: error
            });
          }
          this.SelectPaper();
        } else {
          this.$Message.error('你有必填项没填写');
          this.modalLoading = false;
        }
      });
    },
    cancel() {
      this.modalShow = false;
      this.restFormData();
    },
    openModel() {
      this.modalTitle = '制作试卷';
      this.modalShow = true;
    },
    async SelectPaper() {
      try {
        this.listLoading = true;
        const { data } = await SelectPaper(this.listQuery);
        this.pagination.total = data.Total;
        this.tableData = data.DataList;
      } catch (error) {
        console.log(error);
      } finally {
        this.listLoading = false;
      }
    },
    async clickSelectPaper() {
      this.listQuery.pageIndex = 1;
      this.SelectPaper();
    },
    handleCurrentChange(val) {
      this.listQuery.pageIndex = val;
      this.SelectPaper();
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.clickSelectPaper();
    },
    async SelectTopic(topicGenreName) {
      try {
        const { data } = await SelectAllTopicDetail(this.TopicListQuery);
        // const topicIDs = this.PaperFormData.topicIDs
        this.nameTableData = data;
        this.TopicListQuery.topicGenreName = topicGenreName;
        console.log('现在是' + data[0].topicGenreID);
        console.log('名字' + this.TopicListQuery.topicGenreName);
      } catch (error) {
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../ExampleTrainStyles/index.scss";
</style>
