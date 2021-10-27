<template>
  <div>
    <div class="pg">
      <el-form
        :inline="true"
        size="mini"
      />

      <div
        v-if="device === 'desktop'"
        class="main"
      >
        <split-pane
          :default-percent="20"
          :min-percent="10"
          split="vertical"
        >
          <template slot="paneL">
            <div class="content_left">
              <div>
                <el-alert
                  :closable="false"
                  title="指标"
                  type="success"
                  style="font-weight: bolder;"
                />
              </div>
              <IndexNavTree
                ref="standardCatalog"
                :key="key"
                @nodeClickCatalog="nodeClickCatalog"
              />
            </div>
          </template>
          <template slot="paneR">
            <div class="content_right">
              <div class="middle">
                <div class="middleHead">
                  <el-alert
                    :closable="false"
                    :title="'指标名称：'+nodeValue.name"
                    type="success"
                    style="font-weight: bolder;"
                  />
                </div>
                <div class="targetVis">
                  <div>目标值1：
                    <el-tag>{{ settingTarget.Number1 }}</el-tag>
                  </div>
                  <div>目标值2：
                    <el-tag>{{ settingTarget.Number2 }}</el-tag>
                  </div>
                  <div>目标值3：
                    <el-tag>{{ settingTarget.Number3 }}</el-tag>
                  </div>
                  <div>
                    <el-button icon="el-icon-search" size="mini" type="success" @click="openAddTargetDia()">设置目标值
                    </el-button>
                  </div>
                </div>
                <div class="TMContainer">
                  <el-row>
                    <el-col :span="8">
                      <td><span>年份：</span></td>
                      <td>
                        <el-date-picker
                          v-model="indexYear"
                          placeholder="选择年"
                          size="mini"
                          style="width: 80%;"
                          type="year"
                          format="yyyy"
                          value-format="yyyy"
                          @change="changeTYear"
                        />
                      </td>
                    </el-col>
                    <el-col :span="8">
                      <td><span>数值:</span></td>
                      <td>
                        <el-select v-model="downloadValue" size="mini" @change="changeTNum">
                          <el-option
                            label="数值1"
                            :value="1"
                          />
                          <el-option
                            label="数值2"
                            :value="2"
                          />
                          <el-option
                            label="数值3"
                            :value="3"
                          />

                        </el-select>
                      </td>
                    </el-col>
                    <el-col :span="8"/>
                  </el-row>
                  <el-row v-for="item1 in targetData">
                    <el-col :span="2" align="center">月/季度</el-col>
                    <el-col v-for="(x,y) in item1" :span="1" align="center">
                      <span>{{ y }}</span>
                    </el-col>
                  </el-row>
                  <el-row v-for="item2 in targetData">
                    <el-col v-show="isShowTH" :span="2" align="center">数量</el-col>
                    <el-col v-for="(x,y) in item2" :span="1" align="center">
                      <span v-if="x<targetNum" style="color: red">{{ x }}</span>
                      <span v-else>{{ x }}</span>
                    </el-col>

                  </el-row>

                  <el-row>
                    <el-col :span="8">
                      <td><span>图标展示</span></td>
                    </el-col>
                    <el-col :span="16">
                      <td><span>统计类别：</span></td>
                      <td>
                        <el-select
                          v-model="dateType"
                          placeholder="请选择"
                          style="width:150px"
                          size="mini"
                          @change="chaneType"
                        >
                          <el-option
                            v-for="item in [{ value: '月度' }, { value: '季度' }]"
                            :key="item.value"
                            :label="item.value"
                            :value="item.value"
                          />
                        </el-select>
                      </td>
                    </el-col>
                    <!--                    <el-col :span="8">-->
                    <!--                      <td><span>数值:</span></td>-->
                    <!--                      <td>-->
                    <!--                        <el-select v-model="downloadValue" size="mini" @change="changeTNum">-->
                    <!--                          <el-option-->
                    <!--                            label="数值1"-->
                    <!--                            value="1"-->
                    <!--                          />-->
                    <!--                          <el-option-->
                    <!--                            label="数值2"-->
                    <!--                            value="2"-->
                    <!--                          />-->
                    <!--                          <el-option-->
                    <!--                            label="数值3"-->
                    <!--                            value="3"-->
                    <!--                          />-->

                    <!--                        </el-select>-->
                    <!--                      </td>-->
                    <!--                    </el-col>-->
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-card>
                        <div ref="zhuXingTu" class="zhuXingTu"/>
                      </el-card>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </div>
          </template>
        </split-pane>

        <el-dialog
          :title="targetTitle"
          :visible.sync="isShowTargetDia"
          width="30%"
        >
          <el-form ref="targetRef" :model="settingTarget" label-width="120px" status-icon>
            <el-form-item
              label="数值1目标值"
              prop="Number1"
              :rules="[
                { type: 'number', message: '必须为数字值'}
              ]"
            >
              <el-input
                v-model.number="settingTarget.Number1"
                style="width:30%"
                size="small"
                autosize
                clearable
              />
            </el-form-item>


            <el-form-item
              label="数值2目标值"
              prop="Number2"
              :rules="[
                { type: 'number', message: '必须为数字值'}
              ]"
            >
              <el-input
                v-model.number="settingTarget.Number2"
                style="width:30%"
                size="small"
                autosize
                clearable
              />
            </el-form-item>
            <el-form-item
              label="数值3目标值"
              prop="Number3"
              :rules="[
                { type: 'number', message: '必须为数字值'}
              ]"
            >
              <el-input
                v-model.number="settingTarget.Number3"
                style="width:30%"
                size="small"
                autosize
                clearable
              />
            </el-form-item>
          </el-form>
          <!--      添加目标值确认按钮-->
          <div v-if="targetTitle==='添加目标值'" slot="footer" class="dialog-footer">
            <el-button size="mini" @click="isShowTargetDia = false">取 消</el-button>
            <el-button
              type="primary"
              size="mini"
              :loading="settingTargetLoading"
              @click="addTarget"
            >新增
            </el-button>
          </div>
          <!--                更新设置目标值确认按钮-->
          <div v-else slot="footer" class="dialog-footer">
            <el-button size="mini" @click="isShowTargetDia = false">取 消</el-button>
            <el-button
              type="primary"
              size="mini"
              :loading="settingTargetLoading"
              @click="updateTarget"
            >更新
            </el-button>
          </div>
          <!--          <span slot="footer" class="dialog-footer">-->
          <!--            <el-button size="mini" @click="isShowTargetDia = false">取 消</el-button>-->
          <!--            <el-button type="primary" size="mini" @click="addTarget">确 定</el-button>-->
          <!--          </span>-->
        </el-dialog>

      </div>
    </div>
  </div>
</template>
<script>
import splitPane from 'vue-splitpane';
import { mapGetters } from 'vuex';
import echarts from 'echarts';
import IndexNavTree from '@/views/indicator/components/IndexNavTree';
import { SelectIValue1 } from '@/api/indicator/I_TargetValue';
import { InsertObjValue, SelectObjValue, UpdateObjValue } from '@/api/indicator/I_ObjValue';

export default {
  components: {
    splitPane,
    IndexNavTree
  },
  data() {
    return {
      dateType: '月度', // 改变统计视图的值
      targetNum: 0, // 要对比的目标值数
      targetTitle: '添加目标值', // 添加目标值对话框标题
      isShowTargetDia: false, // 是否显示添加或修改目标值对话框，默认隐藏
      settingTarget: { // 添加或者更新目标值提交的数据
        index_id: 0,
        Number1: 0,
        Number2: 0,
        Number3: 0,
        Userid: window.userInfo[0].Userid
      },
      settingTargetLoading: false, // 设置目标值管理确认后按钮提交等待圈关闭
      T1: true, // 默认展示数值1
      T2: false,
      T3: false,
      targetDataMon: [], // 表月份或季度
      Number1: [],
      Number2: [],
      Number3: [],
      number: 'Number1',
      isShowTH: false, // 是否显示表头
      treeLoading: false, // 指标导航树等待圈
      treeData: [], // 指标导航树数据
      defaultProps: {
        children: 'children',
        label: 'name'
      }, // 指标导航树叶子标识
      isExpandAll: true, // 是否展开指标导航树
      defaultKey: 0, // 指标导航树选中节点id
      treeCurrentEdit: -1, // 当前选择指标导航树所在节点
      nowNode: '', // 现在所点击的指标导航树节点
      GuidelinesData: [], // 指标描述数据
      parameterData: [], // 指标中的参数数据
      targetData: [], // 对应指标的目标值数据
      indexNum: [{ // 指标数值
        name: '实际床位',
        number: '1',
        fourthQuarter: '44',
        thirdQuarter: '33',
        secondQuarter: '22',
        firstQuarter: '11',
        December: '12',
        November: '11',
        October: '10',
        September: '9',
        August: '8',
        July: '7',
        June: '6',
        May: '5',
        April: '4',
        March: '3',
        February: '2',
        January: '1'
      }],
      downloadValue: 1,
      indexYear: '2021', // 指标年份
      kaoPinBanFa: false, // 考评办法对话框默认关闭
      middlePercent: 20,
      nodeValue: {
        name: ''
      },
      dialogTitle: '',
      dialogFormVisible: false,
      CatalogCode: '',
      dialogFormVisibleView: false,
      dialogFormVisibleStatusView: false,
      isClear: false,
      ResortName: [],
      fileList: [],
      tableData: [],
      PenaltiesData: [],
      formCatalog: {
        CatalogID: 0,
        CatalogCode: '',
        CatalogName: '',
        Count: null,
        IsCriterion: 0,
        pageIndex: 1,
        pageSize: 50,
        UserID: window.userInfo[0].UserID,
        DeptID: '',
        UploadState: '0',
        AuditStatus:
          this.$route.params.Type || '' /* 获取首页跳过来的时的参数 */,
        SortField: '' // 如果要设置默认字段,加上id名就可以了 如CatalogCode
      },
      midLoading: false,
      midpagination: {
        pageIndex: 1,
        total: 0,
        pageSize: 50,
        pageSizes: [15, 20, 50, 100, 150, 200]
      },
      UploadState: this.$route.params.value || '',
      FileStatus: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '已上传资料',
          value: '1'
        },
        {
          label: '未上传资料',
          value: '2'
        }
      ],
      listLoading: false,
      pagination: {
        pageIndex: 1,
        total: 0,
        pageSize: 50,
        pageSizes: [15, 20, 50, 100, 150, 200]
      },
      listQuery: {
        Title: '',
        GroupID: 0,
        CatalogID: '',
        Content: '1',
        VersionNumber: '',
        AuthorID: window.userInfo[0].UserID,
        AllowUserID: [],
        File_list: []
      },
      previewData: [],
      seeStatusViewForm: {
        AuditID: 0,
        ArticleID: 0,
        AuditUserId: 0,
        AuditDate: '',
        AuditStatus: 0,
        AuditContent: '',
        AuditRemark: '',
        AuditMaterial: '',
        AuditCondition: 0,
        AuditUserName: ''
      },
      ArticleGroupValue: null,
      uploadEnd: false,
      key: 0,
      rules: {
        Title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        GroupID: [{ required: true, message: '请选择资料', trigger: 'blur' }]
      },
      activeName: 'first',
      materialDataTh: [],
      addPreviewData: [],
      currentEdit: -1 // 判断是否显示input框
    };
  },
  created() {
    let h = window.innerHeight;
    if (h < 750) h = 750;
    this.middlePercent = ((h - 629) / (h - 183)) * 100;
    // this.SelectArticle();
    // this.SelectIndex();
    // this.zhuXingTu(); // 初始化柱形图
  },
  mounted() {
    // this.zhuXingTu(); // 初始化柱形图
  },
  computed: {
    ...mapGetters(['device'])
  },
  methods: {
    // 查询指标，获取指标导航树数据,// 单击指标导航树
    async nodeClickCatalog(value) {
      this.isShowTH = false; // 只要点击节点，先隐藏表头
      console.log(value);
      this.nodeValue = value;
      await this.SelectObjValue(); // 查询指定目标值
      await this.SelectIValue(); // 查询对应指标的目标值数据
    },
    // 查询对应指标的目标值数据
    async SelectIValue() {
      // 因为要根据downloadValue，1,2，3，的值传相应的参数Number1，Number2，Number3
      if (this.downloadValue === 1) {
        this.targetNum = this.settingTarget.Number1;
        this.number = 'Number1';
      }
      if (this.downloadValue === 2) {
        this.targetNum = this.settingTarget.Number2;
        this.number = 'Number2';
      }
      if (this.downloadValue === 3) {
        this.targetNum = this.settingTarget.Number3;
        this.number = 'Number3';
      }
      this.targetData = [];
      this.isShowTH = false; // 开始查询的时候先恢复初始，不显示表

      const { data } = await SelectIValue1({
        index_id: this.nodeValue.index_id,
        year: this.indexYear || 2021,
        number: this.number,
        num: this.downloadValue
      });
      this.targetData = data;
      if (this.targetData.length > 0) {
        this.isShowTH = true; // 如果表有数据，就显示表头
      }
      this.zhuXingTu();
      // if (this.targetDataMon.length === 0) {
      //   this.targetData.map((item) => {
      //     this.targetDataMon.push(item.Months);
      //     this.Number1.push(item.Number1);
      //     this.Number2.push(item.Number2);
      //     this.Number3.push(item.Number3);
      //   });
      // }

      console.log('目标值数据', this.targetData);
    },
    // 打开添加目标值对话框
    openAddTargetDia() {
      this.isShowTargetDia = true; // 打开目标值对话框
    },
    // 查询指定目标值
    async SelectObjValue() {
      try {
        const { data, code } = await SelectObjValue({
          index_id: this.nodeValue.index_id
        });
        if (code === 200) {
          if (data.length === 0) { // 为0 代表还没设置目标值
            this.settingTarget.Number1 = 0; // 获取另外节点中的目标值之前，重置
            this.settingTarget.Number2 = 0;
            this.settingTarget.Number3 = 0;
            this.targetTitle = '添加目标值'; // 这时候改变设置目标值对话框标题
          } else { // 其他代表已经设置目标值
            this.settingTarget = data[0]; // 将获取的数据存放在settingTarget对象中
            this.targetTitle = '修改目标值'; // 这时候改变设置目标值对话框标题
          }
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 添加目标值
    async addTarget() {
      this.settingTargetLoading = true; // 设置目标值管理确认后按钮提交等待圈开启
      try {
        const { code } = await InsertObjValue( // 之所以加|| 0是为了如果清楚了input框中的数值，没有数值就导致出错
          {
            index_id: this.nodeValue.index_id,
            Number1: this.settingTarget.Number1 || 0,
            Number2: this.settingTarget.Number2 || 0,
            Number3: this.settingTarget.Number3 || 0
          }
        );
        if (code === 200) {
          this.$message.success('设置成功');
          this.settingTargetLoading = false; // 设置目标值管理确认后按钮提交等待圈关闭
          this.isShowTargetDia = false; // 关闭新增目标值对话框
          this.SelectObjValue(); // 查询指定目标值，刷新
        }
      } catch (e) {
        this.settingTargetLoading = false; // 设置目标值管理确认后按钮提交等待圈关闭
        console.log(e);
      }
    },
    // 更新目标值
    async updateTarget() {
      this.settingTargetLoading = true; // 设置目标值管理确认后按钮提交等待圈开启
      try {
        const { code } = await UpdateObjValue( // 之所以加|| 0是为了如果清楚了input框中的数值，没有数值就导致出错
          {
            index_id: this.nodeValue.index_id,
            Number1: this.settingTarget.Number1 || 0,
            Number2: this.settingTarget.Number2 || 0,
            Number3: this.settingTarget.Number3 || 0
          }
        );
        if (code === 200) {
          this.$message.success('更新成功');
          this.settingTargetLoading = false; // 设置目标值管理确认后按钮提交等待圈关闭
          this.isShowTargetDia = false; // 关闭更新目标值对话框
          await this.SelectObjValue(); // 查询指定目标值，刷新
        }
      } catch (e) {
        this.settingTargetLoading = false; // 设置目标值管理确认后按钮提交等待圈关闭
        console.log(e);
      }
    },
    // 改变表数据,通过选择数值
    changeTNum(val) { // 选择要显示的数值
      this.SelectIValue();
    },
    // 改变表数据,通过选择年份
    changeTYear(val) {
      this.SelectIValue();
    },
    // 改变统计视图
    chaneType(val) {
      this.dateType = val;
      this.SelectIValue();
    },
    zhuXingTu() {
      var chartDom = this.$refs.zhuXingTu;
      var myChart = echarts.init(chartDom);
      const data1 = this.targetData[0];
      const data2 = [];
      let data22 = [];
      const data3 = [];
      let data33 = [];
      var i;
      console.log('data1', data1);
      for (i in data1) {
        data2.push(i);
        data3.push(data1[i]);
      }
      if (this.dateType === '月度') { // 展示12个月
        data22 = data2.slice(0, 12);
        data33 = data3.slice(0, 12);
      } else { // 展示季度
        data22 = data2.slice(12, 16);
        data33 = data3.slice(12, 16);
      }
      var option;
      option = {
        xAxis: {
          show: true, // 是否显示 x 轴
          type: 'category',
          data: data22
        },
        yAxis: {
          type: 'value'
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        series: [
          {
            barWidth: 40, // 柱形图宽度
            markLine: { // 预警线
              symbol: 'none',
              data: [
                {
                  silent: false, // 鼠标悬停事件  true没有，false有
                  lineStyle: { // 警戒线的样式  ，虚实  颜色
                    type: 'solid',
                    color: '#FA3934'
                  },
                  label: {
                    position: 'end',
                    formatter: '目标值' + this.targetNum,
                    fontSize: '12'
                  },
                  yAxis: this.targetNum // 警戒线的标注值，可以有多个yAxis,多条警示线   或者采用   {type : 'average', name: '平均值'}，type值有  max  min  average，分为最大，最小，平均值
                }
              ]
            },
            data: data33,
            type: 'bar',
            itemStyle: { // 上方显示数值
              normal: {
                color: '#13ce66',
                label: {
                  show: true, // 开启显示
                  position: 'top', // 在上方显示
                  textStyle: { // 数值样式
                    color: 'black',
                    fontSize: 12
                  }
                }
              }
            }
          }
        ]
      };
      option && myChart.setOption(option);
    }
  }
};
</script>
<style lang="scss" scoped>
.zhuXingTu {
  height: 450px;
}

.targetVis {
  display: flex;
  width: 50%;
  height: 20px;
  line-height: 40px;
  margin-left: 20px;
  justify-content: space-between;

  .div {
    display: flex;
  }
}

.lineTree {
  height: 76vh;
  overflow: auto;
  margin-top: 2px;
  border-top: 1px solid #c0bebe;
  border-bottom: 1px dotted #c0bebe;

  .el-tree-node__content {
    border-bottom: 1px solid rgb(235, 235, 235);
  }
}

.TMContainer {
  font-size: 1vh;
  font-weight: bolder;

  .el-row:nth-child(1), .el-row:nth-child(4) {

    margin-top: 20px;
    margin-left: 20px;
    margin-right: 20px;

    .el-col {
      height: 40px;
      //border: 1px solid #13ce66;
      background-color: #e7faf0;
      line-height: 40px;
      text-align: center;
      padding-left: 5%;


      .td {
        padding-right: 0;
      }

      .el-input {
      }
    }
  }

  .el-row:nth-child(2), .el-row:nth-child(3) {

    margin-left: 20px;
    margin-right: 20px;

    .el-col {
      height: 40px;
      line-height: 40px;
      border: 1px solid #eee;

    }
  }

  .el-row:nth-child(2) {
    margin-top: 10px;
  }

  .el-row:nth-child(2), .el-row:nth-child(4) {
    margin-left: 20px;
    margin-right: 20px;
  }

  .el-row:nth-child(5) {
    margin-top: 20px;
    margin-left: 20px;
    margin-right: 20px;

    .zhuXingTu {
      margin-left: 10px;
      height: 420px;
    }
  }
}

.pg {
  margin: 4px;

  .main {
    height: calc(100vh - 96px);

    .content_left {
      display: flex;
      display: -webkit-flex;
      flex-direction: column;
      min-width: 170px;
      height: 100%;
      border: 1px solid whitesmoke;
    }

    .content_right {
      display: flex;
      display: -webkit-flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
      border: 1px solid whitesmoke;

      .top {
        font-size: 14px;
        min-height: 20px;
      }

      .middle {
        height: 100%;

        .middleHead {
          flex-basis: 20px;
        }

        .middleBody {
          height: calc(100% - 34px);
          overflow-y: hidden;

          .middleBodyTb {
            max-height: calc(100% - 37px);
          }
        }
      }

      .bottom {
        height: 100%;
        font-size: 14px;

        .bottomBody {
          height: calc(100% - 45px);
          overflow-y: hidden;

          .bottomBodyTb {
            max-height: calc(100% - 48px);
          }
        }
      }
    }
  }

  .htmlPane {
    height: calc(100vh - 390px);
    border: 2px solid whitesmoke;
    border-radius: 5px;
    padding: 5px;
    overflow-y: auto;
  }

  .el-card__header {
    padding: 2px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;

    .el-form-item {
      margin: 5px 0;
      margin-left: 10px;
    }
  }

}
</style>
