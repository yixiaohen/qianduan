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
              >录制题库
              </el-button>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="openTestClassify"
              >自定义试题分类
              </el-button>
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="listQuery.topicTitle"
                clearable
                placeholder="试题内容"
              />
            </el-form-item>
            <el-form-item>
              <el-select
                v-model="listQuery.topicType"
                clearable
                placeholder="试题类型"
              >
                <el-option
                  v-for="item in topicTypes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-select
                v-model="listQuery.topicGenreName"
                clearable
                placeholder="试题分类"
              >
                <el-option
                  v-for="item in topicGenre"
                  :key="item.topicGenreID"
                  :label="item.topicGenreName"
                  :value="item.topicGenreName"
                />
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                @click="clickSelectTopic('listQuery')"
              >搜索
              </el-button>
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                @click="ExportItemClick"
              >导出当前试题
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
        <el-table-column prop="topicTitle" label="试题内容"/>
        <el-table-column
          prop="topicGenreName"
          width="100"
          align="center"
          label="试题分类"
        />
        <el-table-column prop="topicAnswer" label="试题答案"/>
        <el-table-column
          prop="topicType"
          label="试题类型"
          width="100"
          align="center"
        />
        <el-table-column
          prop="topicFraction"
          label="试题分数"
          width="100"
          align="center"
        />
        <el-table-column label="操作" align="center" fixed="right" width="100">
          <template slot-scope="{ row }">
            <el-button
              size="mini"
              circle
              type="primary"
              icon="el-icon-edit"
              @click="UpdateTopic(row)"
            />
            <el-button
              size="mini"
              circle
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
      <!--试题分类对话框-->
      <el-dialog
        title="自定义分类"
        :visible.sync="testClassifyDialogVisible"
        width="40%"
      >
        <div>
          <el-button
            type="primary"
            size="mini"
            @click="testClassAddClick()"
          >
            新增
          </el-button>
        </div>

        <el-table
          :data="topicGenre"
          border
          size="mini"
        >
          <el-table-column
            label="资料标题"
          >
            <template slot-scope="{row, $index }">
              <el-input
                v-if="currentEdit === $index"
                v-model="row.topicGenreName"
                size="mini"
              />
              <span
                v-else
                style="cursor: pointer !important"
              >{{ row.topicGenreName }}</span>

            </template>
          </el-table-column>

          <el-table-column
            width="190px"
            align="center"
            label="操作"
          >
            <template slot-scope="{ row, $index }">

              <el-button
                v-if="currentEdit === $index"
                type="text"
                size="small"
                @click="testClassFinishEditClick(row.topicGenreID,row.topicGenreName)"
              >完成
              </el-button>
              <span
                v-else
                style="cursor: pointer !important; color: #3e84e9"
                @click="testClassEditClick($index)"
              >修改</span>
              <span> / </span>

              <span
                style="cursor: pointer !important; color: #3e84e9"
                @click="testClassDelClick(row.topicGenreID,row.topicGenreName)"
              >删除</span>
            </template>
          </el-table-column>

        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="testClassifyDialogVisible = false">取 消</el-button>
          <el-button type="primary" size="small" @click="testClassifyDialogConfirm">确 定</el-button>
        </span>


      </el-dialog>
    </el-card>

    <el-dialog
      custom-class="modalShow"
      :title="ModalTitle"
      :visible.sync="modalShow"
      :close-on-click-modal="false"
    >
      <el-alert
        v-if="ModalTitle === '录制题目'"
        banner
      >提示：切换题目类型会清空上一题目类型的内容，请谨慎切换
      </el-alert>
      <el-tabs v-model="tabsName" type="card" @tab-click="tabsChange">
        <el-tab-pane v-if="tabsNames.name1" label="单选题" name="name1">
          <el-card
            shadow="never"
            :style="{ height: '460px', overflow: 'auto' }"
          >
            <el-form
              ref="_TopicFormData"
              size="mini"
              :model="TopicFormData"
              :rules="ruleValidate"
            >
              <el-form-item label="分类" prop="topicGenreID">
                <el-select v-model="TopicFormData.topicGenreID" placeholder="请选择">
                  <el-option
                    v-for="item in topicGenre"
                    :key="item.topicGenreID"
                    :label="item.topicGenreName"
                    :value="item.topicGenreID"
                  />
                </el-select>

              </el-form-item>


              <el-form-item label="题目" prop="topicTitle">
                <el-input
                  v-model="TopicFormData.topicTitle"
                  type="textarea"
                  placeholder="单选题"
                  :autosize="{ minRows: 2, maxRows: 5 }"
                />
              </el-form-item>
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item label="答案" prop="topicAnswer">
                    <el-select
                      v-model="TopicFormData.topicAnswer"
                      style="width: 100%"
                      clearable
                    >
                      <el-option
                        v-for="item in formItems"
                        :key="item.id"
                        :value="item.topicOptions"
                        :label="item.topicOptions"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="分数" prop="topicFraction">
                    <el-input v-model="TopicFormData.topicFraction"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item
                v-for="item in formItems"
                :key="item.id"
                label="选项"
              >
                <el-input
                  v-model="item.topicValue"
                  class="text-input-center span"
                >
                  <div slot="prepend">
                    <el-input v-model="item.topicOptions" style="width: 60px"/>
                  </div>
                  <el-button
                    slot="append"
                    icon="el-icon-delete"
                    @click="delFormItems(item.id, 'formItems')"
                  />
                </el-input>
              </el-form-item>
            </el-form>
          </el-card>
          <div class="footer">
            <el-button
              size="mini"
              @click="addFormItems('formItems')"
            >添加
            </el-button>
            <el-button
              type="primary"
              size="mini"
              :disabled="submitStatus"
              @click="InsertTopic('单选题', '_TopicFormData')"
            >提交
            </el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane v-if="tabsNames.name2" label="多选题" name="name2">
          <el-card
            shadow="never"
            :style="{ height: '460px', overflow: 'auto' }"
          >
            <el-form
              ref="_multipleFormItems"
              size="mini"
              :model="TopicFormData"
              :rules="ruleValidate"
            >
              <el-form-item label="分类" prop="topicGenreName">
                <el-select v-model="TopicFormData.topicGenreID" placeholder="请选择">
                  <el-option
                    v-for="item in topicGenre"
                    :key="item.topicGenreID"
                    :label="item.topicGenreName"
                    :value="item.topicGenreID"
                  />
                </el-select>

              </el-form-item>
              <el-form-item label="题目" prop="topicTitle">
                <el-input
                  v-model="TopicFormData.topicTitle"
                  type="textarea"
                  placeholder="多选题"
                  :autosize="{ minRows: 2, maxRows: 5 }"
                />
              </el-form-item>

              <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item label="答案" prop="topicAnswers">
                    <el-select
                      v-model="TopicFormData.topicAnswer"
                      multiple
                      style="width: 100%"
                    >
                      <el-option
                        v-for="item in multipleFormItems"
                        :key="item.id"
                        :value="item.topicOptions"
                        :label="item.topicOptions"
                      />
                    </el-select>
                    <!-- {{ TopicFormData.topicAnswer }} -->
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="分数" prop="topicFraction">
                    <el-input v-model="TopicFormData.topicFraction"/>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-form-item
                v-for="item in multipleFormItems"
                :key="item.id"
                label="选项"
              >
                <el-input v-model="item.topicValue" class="text-input-center">
                  <span slot="prepend" class="prepend">
                    <el-input
                      v-model="item.topicOptions"
                      type="text"
                      style="width: 60px"
                      size="small"
                    />
                  </span>
                  <el-button
                    slot="append"
                    icon="el-icon-delete"
                    @click="delFormItems(item.id, 'multipleFormItems')"
                  />
                </el-input>
              </el-form-item>
            </el-form>
          </el-card>
          <div class="footer">
            <el-button
              size="mini"
              @click="addFormItems('multipleFormItems')"
            >添加
            </el-button>
            <el-button
              type="primary"
              size="mini"
              :disabled="submitStatus"
              @click="InsertTopic('多选题', '_multipleFormItems')"
            >提交
            </el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane v-if="tabsNames.name3" label="判断题" name="name3">
          <el-card
            shadow="never"
            :style="{ height: '460px', overflow: 'auto' }"
          >
            <el-form
              ref="TrueOrFalse"
              :model="TopicFormData"
              size="mini"
              :rules="ruleValidate"
            >
              <el-form-item label="分类" prop="topicGenreName">
                <el-select v-model="TopicFormData.topicGenreID" placeholder="请选择">
                  <el-option
                    v-for="item in topicGenre"
                    :key="item.topicGenreID"
                    :label="item.topicGenreName"
                    :value="item.topicGenreID"
                  />
                </el-select>

              </el-form-item>
              <el-form-item label="题目" prop="topicTitle">
                <el-input
                  v-model="TopicFormData.topicTitle"
                  type="textarea"
                  placeholder="判断题"
                  :autosize="{ minRows: 2, maxRows: 5 }"
                />
              </el-form-item>

              <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item label="答案" prop="topicAnswer">
                    <el-select
                      v-model="TopicFormData.topicAnswer"
                      style="width: 100%"
                      clearable
                    >
                      <el-option
                        v-for="item in TrueOrFalses"
                        :key="item.id"
                        :value="item.topicOptions"
                        :label="item.topicOptions"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="分数" prop="topicFraction">
                    <el-input v-model="TopicFormData.topicFraction"/>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-form-item v-for="item in TrueOrFalses" :key="item.id">
                <el-input v-model="item.topicValue" class="text-input-center">
                  <span slot="prepend" class="prepend">
                    <el-input
                      v-model="item.topicOptions"
                      type="text"
                      style="width: 60px"
                      size="small"
                    />
                  </span>
                </el-input>
              </el-form-item>
            </el-form>
          </el-card>
          <div class="footer">
            <el-button
              type="primary"
              size="mini"
              :disabled="submitStatus"
              @click="InsertTopic('判断题', 'TrueOrFalse')"
            >提交
            </el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane v-if="tabsNames.name4" label="填空题" name="name4">
          <el-card
            shadow="never"
            :style="{ height: '460px', overflow: 'auto' }"
          >
            <el-form
              ref="FillInTheBlanks"
              size="mini"
              :model="TopicFormData"
              :rules="ruleValidate"
            >
              <el-form-item label="分类" prop="topicGenreName">
                <el-select v-model="TopicFormData.topicGenreID" placeholder="请选择">
                  <el-option
                    v-for="item in topicGenre"
                    :key="item.topicGenreID"
                    :label="item.topicGenreName"
                    :value="item.topicGenreID"
                  />
                </el-select>

              </el-form-item>
              <el-form-item label="题目" prop="topicTitle">
                <el-input
                  v-model="TopicFormData.topicTitle"
                  type="textarea"
                  placeholder="填空题"
                  :autosize="{ minRows: 2, maxRows: 5 }"
                />
              </el-form-item>

              <el-form-item label="分数" prop="topicFraction">
                <el-input v-model="TopicFormData.topicFraction"/>
              </el-form-item>

              <el-form-item label="答案" prop="topicAnswer">
                <el-input v-model="TopicFormData.topicAnswer" clearable/>
              </el-form-item>
            </el-form>
          </el-card>
          <div class="footer">
            <el-button
              size="mini"
              type="primary"
              :disabled="submitStatus"
              @click="InsertTopic('填空题', 'FillInTheBlanks')"
            >提交
            </el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane v-if="tabsNames.name5" label="简答题" name="name5">
          <el-card
            shadow="never"
            :style="{ height: '460px', overflow: 'auto' }"
          >
            <el-form
              ref="ShortAnsweRQuestions"
              size="mini"
              :model="TopicFormData"
              :rules="ruleValidate"
            >
              <el-form-item label="分类" prop="topicGenreName">
                <el-select v-model="TopicFormData.topicGenreID" placeholder="请选择">
                  <el-option
                    v-for="item in topicGenre"
                    :key="item.topicGenreID"
                    :label="item.topicGenreName"
                    :value="item.topicGenreID"
                  />
                </el-select>

              </el-form-item>
              <el-form-item label="题目" prop="topicTitle">
                <el-input
                  v-model="TopicFormData.topicTitle"
                  type="textarea"
                  placeholder="简答题"
                  :autosize="{ minRows: 2, maxRows: 5 }"
                />
              </el-form-item>

              <el-form-item label="分数" prop="topicFraction">
                <el-input v-model="TopicFormData.topicFraction"/>
              </el-form-item>

              <el-form-item label="参考答案" prop="topicAnswer">
                <el-input
                  v-model="TopicFormData.topicAnswer"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 5 }"
                  clearable
                />
              </el-form-item>
            </el-form>
          </el-card>
          <div class="footer">
            <el-button
              size="mini"
              type="primary"
              :disabled="submitStatus"
              @click="InsertTopic('简答题', 'ShortAnsweRQuestions')"
            >提交
            </el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <!--新增分类弹窗-->
    <el-dialog
      title="提示"
      :visible.sync="addTestClassifyDialogVisible"
      width="30%"
    >
      <el-input
        v-model="addTestClassifyInput"
        placeholder="请输入要新增的分类名"
      />
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="addTestClassifyDialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="addTestClassify">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
// 分别是...新增或者修改分类,删除分类接口,导出试题接口
import {
  DeleteTopic,
  DeleteTopicGenre,
  ExportTopic,
  InsertTopic,
  InsertUpdateTopicGenre,
  SelectTopic,
  SelectTopicDetailByTopicID,
  SelectTopicGenre,
  UpdateTopic
} from '@/api/KS_Topic';
import { uuid } from '@/utils';

export default {
  name: 'ExampleQuestionBank',
  data() {
    return {
      testClassifyDialogVisible: false, // 是否显示修改分类对话框
      addTestClassifyDialogVisible: false, // 是否显示新增分类对话框
      addTestClassifyInput: '', // 新增的分类名
      currentEdit: -1, // 判断点击分类修改按钮
      listLoading: true,
      visible: false,
      ModalTitle: '录制题目',
      listQuery: {
        pageIndex: 1,
        pageSize: 15,
        topicTitle: '',
        topicType: '',
        topicGenreID: '',
        topicGenreName: ''

      },
      pagination: {
        pageIndex: 1,
        total: 0,
        pageSize: 15,
        pageSizes: [15, 20, 50, 100, 150, 200]
      },
      modalShow: false,
      multiple: false,
      tabsName: 'name1',
      tabsNames: {
        name1: true,
        name2: true,
        name3: true,
        name4: true,
        name5: true
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
      formItems: [
        {
          id: uuid(),
          ID: 0,
          topicID: 0,
          topicOptions: '',
          topicValue: ''
        }
      ],
      multipleFormItems: [
        {
          id: uuid(),
          ID: 0,
          topicID: 0,
          topicOptions: '',
          topicValue: ''
        }
      ],
      TrueOrFalses: [
        {
          id: uuid(),
          ID: 0,
          topicID: 0,
          topicOptions: '',
          topicValue: ''
        },
        {
          id: uuid(),
          ID: 0,
          topicID: 0,
          topicOptions: '',
          topicValue: ''
        }
      ],
      columns: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '试题内容',
          key: 'topicTitle'
        },
        {
          title: '试题分类',
          key: 'topicGenreName'
        },
        {
          title: '试题答案',
          key: 'topicAnswer'
        },
        {
          title: '试题类型',
          align: 'center',
          key: 'topicType'
        },
        {
          title: '试题分数',
          align: 'center',
          key: 'topicFraction'
        },
        {
          title: '操作',
          slot: 'action',
          width: 140
        }
      ],
      tableData: [],
      TopicFormData: {
        topicID: 0,
        topicTitle: '',
        topicType: '',
        topicAnswer: [] || '' || 0,
        topicFraction: 0,
        topic_Contents: [],
        topicGenreID: null,
        topicGenreName: ''
      },
      submitStatus: false,
      ruleValidate: {
        topicTitle: [{ required: true, message: '请填写题目' }],
        topicFraction: [{ required: true, message: '请设置分数' }]

      },
      topicGenre: {}, // 题库分类数据
      nowTopicTitle: '', // 现在点击搜索按钮后得到试题类型input框里的内容
      nowTopicType: '', // 现在点击搜索按钮后得到内容input框的按钮里的内容
      nowTopicGenreName: '' // 现在点击搜索按钮后得到试题分类input框里的内容
    };
  },
  mounted() {
    this.SelectTopic();
  },
  methods: {
    async DeleteTopic(row) {
      const { topicID } = row;
      this.$confirm(`此操作将永久删除 ${row.topicTitle} , 是否继续?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          try {
            const { msg } = await DeleteTopic({ topicID });
            this.$message({
              type: 'success',
              message: msg
            });
            this.clickSelectTopic();
          } catch {
          } finally {
            this.listLoading = true;
          }
        })
        .catch((e) => e);
    },
    async UpdateTopic(row) {
      this.tabsNames = {
        name1: false,
        name2: false,
        name3: false,
        name4: false,
        name5: false
      };
      this.ModalTitle = '编辑题目:' + row.topicTitle;
      try {
        const { data } = await SelectTopicDetailByTopicID({
          topicID: row.topicID
        });
        const {
          topicType,
          topicTitle,
          topicAnswer,
          topicFraction,
          topicID,
          topic_Contents,
          topicGenreID,
          topicGenreName
        } = data;

        const TabPanelabels = [
          '单选题',
          '多选题',
          '判断题',
          '填空题',
          '简答题'
        ];
        const TabPaneNames = ['name1', 'name2', 'name3', 'name4', 'name5'];
        const typeIndex = TabPaneNames[TabPanelabels.indexOf(topicType)];
        this.tabsName = typeIndex;
        this.tabsNames[typeIndex] = true;
        this.modalShow = true;
        this.TopicFormData = {
          topicID,
          topicTitle,
          topicType,
          topicAnswer,
          topicFraction,
          topic_Contents,
          topicGenreID,
          topicGenreName
        };
        switch (topicType) {
          case '单选题':
            topic_Contents.map((item) => {
              item.id = uuid();
            });
            this.formItems = topic_Contents;
            break;
          case '多选题':
            topic_Contents.map((item) => {
              item.id = uuid();
            });
            this.TopicFormData.topicAnswer = this.TopicFormData.topicAnswer.split(
              ','
            );
            this.multipleFormItems = topic_Contents;
            break;
          case '判断题':
            topic_Contents.map((item) => {
              item.id = uuid();
            });
            this.TrueOrFalses = topic_Contents;
            break;
          default:
            break;
        }
      } catch (error) {
      }
    },
    InsertTopic(type, name) {
      this.$refs[name].validate(async(valid) => {
        if (valid) {
          const {
            TopicFormData: {
              topicTitle,
              topicAnswer,
              topicFraction,
              topicID,
              topic_Contents,
              topicGenreID,
              topicGenreName
            }
          } = this;
          const TabPanelabels = ['单选题', '多选题', '判断题'];
          const formData = {
            topicID: topicID || 0,
            topicTitle,
            topicType: type,
            topicAnswer: Array.isArray(topicAnswer)
              ? topicAnswer.sort().join('') /* 排序+字符 */
              : topicAnswer,
            topicFraction,
            topic_Contents: TabPanelabels.includes(type)
              ? this.SelectTopicType(type).map((item) => {
                return {
                  ID: item.ID || 0,
                  topicID: item.topicID || 0,
                  topicOptions: item.topicOptions,
                  topicValue: item.topicValue,
                  topicGenreID: item.topicGenreID,
                  topicGenreName: item.topicGenreName
                };
              })
              : [
                {
                  ID: (topic_Contents[0] && topic_Contents[0].ID) || 0,
                  topicID:
                    (topic_Contents[0] && topic_Contents[0].topicID) || 0,
                  topicOptions: topicAnswer,
                  topicValue: '',
                  topicGenreName: '',
                  topicGenreID: ''
                }
              ],
            topicGenreID,
            topicGenreName
          };
          try {
            this.submitStatus = true;
            const { msg } =
              this.ModalTitle === '录制题目'
                ? await InsertTopic(formData)
                : await UpdateTopic(formData);
            this.$message({
              type: 'info',
              message: msg
            });
            this.pagination.pageIndex = 1;
          } catch (error) {
            this.$message({
              type: 'info',
              message: error
            });
          } finally {
            this.submitStatus = false;
          }
          this.clickSelectTopic();
          this.restFormData(name);
          this.modalShow = false;
        } else {
          this.$message({
            type: 'info',
            message: '你有必填项没填写'
          });
        }
      });
    },
    SelectTopicType(name) {
      const { formItems, multipleFormItems, TrueOrFalses } = this;
      switch (name) {
        case '单选题':
          return formItems;

        case '多选题':
          return multipleFormItems;

        case '判断题':
          return TrueOrFalses;

        default:
          break;
      }
    },
    restFormData(name) {
      this.TopicFormData = {
        opicID: 0,
        topicTitle: '',
        topicType: '',
        topicAnswer: '',
        topicFraction: 0,
        topic_Contents: []
      };
      this.multipleFormItems = [
        {
          id: uuid(),
          topicID: 0,
          topicOptions: '',
          topicValue: ''
        }
      ];
      this.formItems = [
        {
          id: uuid(),
          topicID: 0,
          topicOptions: '',
          topicValue: ''
        }
      ];
      this.$refs[name] && this.$refs[name].resetFields();
    },
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

    async SelectTopic() {
      this.listLoading = true;
      try {
        const { data } = await SelectTopic(this.listQuery);
        this.tableData = data.DataList;
        this.pagination.total = data.Total;
        this.nowTopicTitle = this.listQuery.topicTitle; // 每次点击搜索后记录搜索内容
        this.nowTopicType = this.listQuery.topicType; // 每次点击搜索后记录搜索试题类型
        this.nowTopicGenreName = this.listQuery.topicGenreName; // 每次点击搜索后记录搜索试题分类id
        console.log(this.SelectTopicGenre());
      } catch (error) {
        console.log(error);
      } finally {
        this.listLoading = false;
      }
    },
    async clickSelectTopic() {
      this.listQuery.pageIndex = 1; // 将页面跳转到第一页
      this.pagination.pageIndex = 1; // 将当前蓝色选定的样式为第一页
      await this.SelectTopic();
    },

    // 导出当前试题
    async ExportItemClick() {
      const { data } = await ExportTopic({
        topicTitle: this.nowTopicTitle,
        topicType: this.nowTopicType,
        topicGenreName: this.nowTopicGenreName
      });
      console.log('数据是:' + data);
      this.$nextTick(() => {
        const link = document.createElement('a'); // 创建一个a标签
        link.style.display = 'none'; // 将标签样式重置为空
        link.href = data; // 将得到的url地址赋值给a标签的href
        link.target = '_blank'; // 在新的窗口打开链接
        document.body.appendChild(link); // 在dom中加载链接
        link.click(); // 点击链接
      });
    },
    // 打开试题分类对话框
    openTestClassify() {
      this.testClassifyDialogVisible = true;
      // this.$message.success('已打开!');
    },
    // 点击修改按钮后展开input框
    testClassEditClick(index) {
      this.currentEdit = index;
    },

    // 点击新增按钮后弹出窗口
    testClassAddClick() {
      this.addTestClassifyDialogVisible = true;
    },
    // 新增分类名
    async addTestClassify() {
      try {
        const { data } = await InsertUpdateTopicGenre({
          topicGenreID: 0,
          topicGenreName: this.addTestClassifyInput
        });
        this.$message.success('新增成功');
        await this.SelectTopicGenre(); // 新增之后更新一下分类列表
        this.addTestClassifyDialogVisible = false; // 将新增分类对话框关闭
        console.log(data);
      } catch (e) {
        console.log(e);
      }
    },
    // 点击完成按钮后向接口请求修改分类名
    async testClassFinishEditClick(topicGenreID, topicGenreName) {
      try {
        const { data } = await InsertUpdateTopicGenre({
          topicGenreID: topicGenreID,
          topicGenreName: topicGenreName
        });
        console.log(data);
        this.currentEdit = -1;
        // this.SelectTopicGenre();
        if (data === topicGenreID) {
          this.$message.success('成功修改');
        } else {
          this.$message.error('修改失败');
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 删除分类弹窗
    testClassDelClick(topicGenreID, topicGenreName) {
      this.$confirm('此操作将永久删除该"' + topicGenreName + '"分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          const { data } = await DeleteTopicGenre({
            topicGenreID: topicGenreID
          });
          if (data === 1) {
            this.$message.success('删除成功');
            await this.SelectTopicGenre();
          } else {
            this.$message.error('删除失败');
          }
        } catch (e) {
          console.log(e);
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // // 删除分类
    // async testClassDelClick(topicGenreID) {
    //
    // },
    // 点击确定按钮关闭input框和对话框
    testClassifyDialogConfirm() {
      this.testClassifyDialogVisible = false;
      this.currentEdit = -1;
    },
    handleCurrentChange(val) {
      this.listQuery.pageIndex = val;
      this.SelectTopic();
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.clickSelectTopic();
    },

    openModel() {
      this.tabsNames = {
        name1: true,
        name2: true,
        name3: true,
        name4: true,
        name5: true
      };
      this.tabsName = 'name1';
      this.ModalTitle = '录制题目';
      this.modalShow = true;
      console.log('点击录制题库');
    },
    cancel() {
      this.restFormData();
    },
    tabsChange({ name }) {
      // this.TopicFormData.topicAnswer = name === 'name2' ? [] : ''
      // // this.multiple = name === 'name2'
      this.restFormData();
    },
    addFormItems(formInfo) {
      this[formInfo].push({
        id: uuid(),
        ID: 0,
        topicID: 0,
        topicOptions: '',
        topicValue: ''
      });
    },
    delFormItems(id, formInfo) {
      this[formInfo].forEach((item, index) => {
        if (item.id === id) {
          this[formInfo].splice(index, 1);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../ExampleTrainStyles/index.scss";
</style>
