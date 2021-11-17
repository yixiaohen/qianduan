<template>
  <div>
    <div class="pg">
      <div
        class="main"
      >
        <split-pane
          :min-percent="10"
          :default-percent="20"
          split="vertical"
        >
          <template slot="paneL">
            <div class="content_left">
              <div>
                <el-alert
                  title="指标"
                  type="info"
                  :closable="false"
                />
                <el-button :disabled="isUseAllot" type="success" size="mini" @click="openAllotIndex1()">指标分配
                </el-button>
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
                    title="指标数据"
                    type="info"
                    :closable="false"
                  />
                </div>
                <div class="DMContainer">
                  <el-row type="flex" justify="center">
                    <el-col :span="5">
                      <span>指标名称：{{ nodeValue.name }}</span>
                    </el-col>
                    <el-col :span="4">
                      <span>指标编码：{{ nodeValue.formulaObj }}</span>
                    </el-col>

                    <el-col :span="5">
                      <span class="demonstration">查找:</span>
                      <el-radio-group
                        v-model="isYearOrMonth"
                        style="margin-top: -4px;margin-left: 4px"
                        size="mini"
                        @change="isYearOrMonthc"
                      >
                        <el-radio-button :label="1">按年份</el-radio-button>
                        <el-radio-button :label="2">按年月</el-radio-button>
                      </el-radio-group>
                    </el-col>
                    <el-col :span="11">
                      <el-date-picker
                        v-if="isYearOrMonth===1"
                        v-model="selectYear"
                        type="year"
                        size="mini"
                        style="width: 120px"
                        placeholder="选择年"
                        value-format="yyyy"
                        format="yyyy"
                      />
                      <span v-if="isYearOrMonth===1" class="demonstration">年</span>
                      <el-button v-if="isYearOrMonth===1" type="primary" size="mini" @click="searchYear">搜索</el-button>

                      <el-date-picker
                        v-if="isYearOrMonth===2"
                        v-model="selectYear"
                        type="year"
                        size="mini"
                        style="width: 120px"
                        placeholder="选择年"
                        value-format="yyyy"
                        format="yyyy"
                      />
                      <span v-if="isYearOrMonth===2" class="demonstration">年</span>
                      <el-date-picker
                        v-if="isYearOrMonth===2"
                        v-model="selectMonth"
                        type="month"
                        size="mini"
                        format="MM"
                        style="width: 120px"
                        value-format="MM"
                        placeholder="选择月"
                      />
                      <span v-if="isYearOrMonth===2" class="demonstration">月</span>
                      <el-button v-if="isYearOrMonth===2" type="primary" size="mini" @click="searchMonth">搜索</el-button>

                    </el-col>

                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-table
                        :data="indexAllotData"
                        border
                        stripe
                        height="calc(100vh - 300px)"
                        style="width: 100%"
                        size="small"
                        highlight-current-row
                        :default-sort="{prop: 'date', order: 'descending'}"
                      >
                        <el-table-column
                          type="index"
                          label="序号"
                          align="center"
                          width="50px"
                          :show-overflow-tooltip="cellOverflow"
                        />
                        <el-table-column
                          prop="dateTime"
                          label="周期"
                          width="160px"
                          align="center"
                          :show-overflow-tooltip="cellOverflow"
                        />
                        <el-table-column
                          prop="DeptName"
                          label="部门名称"
                          align="center"
                          :show-overflow-tooltip="cellOverflow"
                        />
                        <el-table-column
                          prop="number"
                          label="指标值"
                          align="center"
                          :show-overflow-tooltip="cellOverflow"
                        />
                        <el-table-column
                          prop="Remarks"
                          label="备注"
                          align="center"
                          :show-overflow-tooltip="cellOverflow"
                        />
                        <el-table-column
                          prop="LastMatchTime"
                          label="创建日期"
                          align="center"
                          :show-overflow-tooltip="cellOverflow"
                        >
                          <template slot-scope="{ row }">{{
                            row.LastMatchTime ? row.LastMatchTime.replace('T', ' ') : ''
                          }}
                          </template>

                        </el-table-column>
                        <el-table-column
                          label="操作"
                          align="center"
                          width="200px"
                          :show-overflow-tooltip="cellOverflow"
                        >
                          <template slot-scope="{ row }">
                            <el-button type="primary" size="mini" icon="el-icon-edit" @click="openAllotIndex2(row)">编辑
                            </el-button>
                            <el-button type="danger" size="mini" icon="el-icon-delete" @click="delIndexAllot(row)">删除
                            </el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-col>
                  </el-row>
                  <span>展开 </span>
                  <el-switch v-model="cellOverflow" style="margin: 6px 0" />
                  <span> 折叠</span>

                  <!--      分页-->
                  <div class="block">
                    <el-pagination
                      :page-sizes="pagination.pageSizes"
                      :page-size="pagination.pageSize"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="pagination.Total"
                      :current-page="listQuery.pageIndex"
                      @current-change="handleCurrentChange"
                      @size-change="handleSizeChange"
                    />
                  </div>

                </div>
              </div>
            </div>
          </template>
        </split-pane>

      </div>
    </div>
    <!--添加弹框-->
    <el-dialog :title="configIndexTitle" :visible.sync="showConfig">
      <el-form ref="addDia" :model="indexAllot" label-width="120px" status-icon>
        <el-form-item
          label="周期"
        >
          <el-select
            v-model="indexAllot.cycle_id"
            filterable
            clearable
            style="width: 240px"
            placeholder="请选择"
            size="mini">
            <el-option
              v-for="item in cycle"
              :key="item.Cycleid"
              :value="item.Cycleid"
              :label="
                item.Starway === 0 ? item.Type+' | '+'结束日期往前' +
                  ' | '+
                  item.Cycle +
                  ' | '+
                  item.Num : item.Starway === 10 ?item.Type+ ' | '+'当年' +
                  ' | '+
                  item.Cycle +
                  ' | '+
                  item.Num : item.Starway === 11 ?item.Type+ ' | '+'当季' +
                    ' | '+
                    item.Cycle +
                    ' | '+
                    item.Num : item.Starway === 12 ? item.Type+' | '+'当月' +
                      ' | '+
                      item.Cycle +
                      ' | '+
                      item.Num : item.Starway
              "
            >
              <span style="float: left">{{ item.Type }}</span>
              <span
                style="float: right; color: #8492a6; font-size: 13px"
              >{{
                item.Starway === 0 ? '结束日期往前' : item.Starway === 10 ? '当年' : item.Starway === 11 ? '当季' : item.Starway === 12 ? '当月' : item.Starway
              }}{{ ' | ' + item.Cycle + ' | ' + item.Num }}</span>            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="科室"
          prop="DeptIDs"
        >
          <defaultDepts
            ref="oneSelect"
            v-model="indexAllot.DeptID"
            :multiple="isLotSelect"
            style="width: 240px"
            @checkStrictly="checkStrictly"
            @getDefaultDeptsValue="getDefaultDeptsValue"
          />

          <span style="width:40%;word-wrap: break-word;font-size: 12px;line-height: 14px;background-color: #eeeeee">--勾选多个科室即为批量分配,修改时只能勾选一个科室
          </span>
        </el-form-item>

        <el-form-item
          label="指标值(数字)"
          prop="formulaObj"
        >
          <el-input
            v-model.number="indexAllot.Number2"
            style="width:30%"
            size="small"
            type="number"
            clearable
          />
        </el-form-item>

        <el-form-item
          label="备注"
          prop="Remarks"
        >
          <el-input
            v-model="indexAllot.Remarks"
            style="width:30%"
            size="small"
            clearable
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showConfig = false">取 消</el-button>
        <el-button
          type="primary"
          :loading="IndexSourceLoading"
          @click="addIndexAllot"
        >确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import splitPane from 'vue-splitpane';
import IndexNavTree from '@/views/indicator/components/IndexNavTree';
import defaultDepts from '@/views/components/defaultDepts';
import {
  DeleteIndexAlloc,
  InsertBatchIndexAlloc,
  SelectIndexAlloc,
  UpdateIndexAlloc
} from '@/api/indicator/I_IndexAlloc';
import { SelectiCycle } from '@/api/indicatorSet/I_Cycle';

export default {
  components: {
    IndexNavTree,
    splitPane,
    defaultDepts
  },
  data() {
    return {
      checkStrictly: false, // 为false,选择科室时勾选父级不全选子级叶子
      cellOverflow: false, // 折叠表格
      isYearOrMonth: 1, // 按照年份还是年月查找数据
      cycle: [
        {
          Cycle: '',
          Cycleid: '', // 周期id
          Num: '', // 数值
          Starway: '',
          Type: '' // 类型
        }
      ], // 周期
      listQuery: { // 分页数据
        pageIndex: 1,
        pageSize: 10
      },
      pagination: { // 分页数据
        pageIndex: 1,
        pageSize: 10,
        pageSizes: [5, 10, 30, 50, 100, 200],
        Total: null
      },
      isLotSelect: true, // 科室是否多选，默认添加指标分配是多选，修改时只能单选
      nowIndexAlloc: {}, // 当前编辑点击的指标分配数据
      nowIndexAllocID: 0, // 现在编辑的指标分配id
      allYear: [], // 一开始全部年份
      selectYear: '', // 选中的年份
      selectMonth: '', // 选中的月份
      indexAllot: { // 新增的指标分配数据
        IndexAllocID: 0, // 该条数据的id
        index_id: 0, // 指标di
        DeptID: -1, // -1代表全院，代表没选科室部门
        cycle_id: null, // 周期id
        Number2: null, // 指标值
        AllocUserID: window.userInfo[0].UserID, // 分配人id
        Remarks: '' // 备注
        // AllocTime: "2021-10-14T07:51:52.880Z",
        // DeptIDs: 0// 批量增加
      },

      indexAllotData: [], // 指标分配数据列表
      isUseAllot: true, // 是否禁用指标分配按钮，true为可以使用
      key: 0,
      treeLoading: false, // 指标导航树等待圈
      treeData: [], // 指标导航树数据
      treeDataO: [], // 旧的指标导航树数据
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
      configIndexTitle: '新增指标分配', // 添加和编辑指标的对话框的标题值
      rules: { // 对话框检验规则
        formulaObj: [
          { type: 'number', message: '必须为数字值' }
        ]
      },

      dynamicValidateForm: { // 添加和编辑指标对话框数据
        index_id: 0, // 指标索引id
        name: '', // 指标名称
        formula: '', // 指标公式
        formulaObj: '', // 公式编译目标码
        iattribute: '', // 指标属性
        idefinition: '' // 指标定义
      },
      showConfig: false, // 默认添加指标分配弹窗为隐藏
      IndexSourceLoading: false, // 添加指标确定按钮等待进度圈默认为关闭
      listLoading: false,
      nodeValue: '',
      currentEdit: -1 // 判断是否显示input框
    };
  },
  created() {

  },
  mounted() {
    this.SelectiCycle();
  },
  methods: {
    isYearOrMonthc(x) {
      this.selectYear = '';
      this.selectMonth = '';
    },
    // 获取指标中要选择的周期数据
    async SelectiCycle() {
      this.cycle = [];
      try {
        const { data, code } = await SelectiCycle();
        if (code === 200) {
          this.cycle = data;
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 数据源列表分页当前页
    handleCurrentChange(index) {
      this.listQuery.pageIndex = index;
      this.SelectIndexAlloc();
    },
    // 数据源列表分页跳转页
    handleSizeChange(page) {
      this.listQuery.pageSize = page;
      this.SelectIndexAlloc();
    },
    // // 获取年份搜索年的数据
    // async SelectIndexYear(val) {
    //   const { data } = await SelectIndexYear({ index_id: val });
    //   this.allYear = data;
    // },
    // 按年份搜索指标分配
    searchYear(year) {
      // console.log(year);
      // this.selectYear = year; // 传过来的参数赋值给当前选中的年份
      // this.selectMonth = ''; // 清空搜索月份的选项
      this.listQuery.pageIndex = 1; // 重置页码为1
      this.SelectIndexAlloc(); // 刷新列表
    },
    // 按月份搜索指标分配
    searchMonth(Month) {
      // console.log(Month);
      // this.selectMonth = Month.slice(5, 8);
      // this.selectYear = Month.slice(0, 4);
      // // this.selectMonth = Month;
      // // this.selectMonth = Month; // 传过来的参数赋值给当前选中的年份
      // // this.selectYear = ''; // 清空搜索年份的选项
      this.listQuery.pageIndex = 1; // 重置页码为1
      this.SelectIndexAlloc(); // 刷新列表
    },
    // 获取选中的科室id数组
    getDefaultDeptsValue(value) {
      this.indexAllot.DeptID = value || 0;
    },
    // 根据指标id查询指标分配列表
    async SelectIndexAlloc() {
      try {
        const { data, code } = await SelectIndexAlloc(
          {
            index_id: this.nodeValue.index_id,
            year: this.selectYear,
            month: this.selectMonth,
            userID: window.userInfo[0].UserID,
            pageIndex: this.listQuery.pageIndex,
            pageSize: this.listQuery.pageSize
          });
        if (code === 200) {
          this.indexAllotData = data.DataList; // 赋值放在指标列表数组中
          this.indexAllotData.map((item) => {
            if (item.DeptName === null) {
              item.DeptName = '全院';
            }
          });
          this.pagination.Total = data.Total; // 将分页的总条目获取
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 获取点击指标树节点值
    nodeClickCatalog(value) {
      // 每次点击不同的指标，就把当前记录有所有年份的数据清除再重新赋值
      this.allYear = [];
      this.listQuery.pageIndex = 1; // 重置页码为1
      this.selectYear = ''; // 选中的年份重置为全部
      this.selectMonth = ''; // 选中的月份重置为全部
      this.nodeValue = value; // 保存所点击的指标数据，包括了标识id=>index_id
      if (this.nodeValue.Count === 0) { // 用来判断是否为最后一层，只有最后一层才显示指标分配按钮
        this.isUseAllot = false; // 显示
        this.SelectIndexAlloc();
      } else {
        this.isUseAllot = true;
        this.SelectIndexAlloc();
      }
    },
    // 点击打开指标分配框进行添加
    openAllotIndex1() {
      this.showConfig = true; // 点击打开指标分配框
      this.configIndexTitle = '新增指标分配'; //  新增指标的对话框的标题值
      this.isLotSelect = true; // 新增指标分配时，科室选择为多选
    },
    // 点击打开指标分配框进行修改
    openAllotIndex2(row) {
      console.log(row);
      this.showConfig = true; // 点击打开指标分配框
      this.configIndexTitle = '修改指标分配'; //  编辑指标的对话框的标题值
      this.isLotSelect = false; // 修改指标分配时，科室选择为单选
      this.indexAllot.IndexAllocID = row.IndexAllocID; // 将当前点击的指标分配id保存
      // 将当前点击的指标分配数据
      this.nodeValue.index_id = row.index_id;
      this.indexAllot.DeptID = row.DeptID;
      this.indexAllot.Year = row.Year;
      this.indexAllot.Months = row.Months;
      this.indexAllot.Number2 = row.Number2;
      this.indexAllot.Remarks = row.Remarks;
      this.indexAllot.Cover = row.Cover;
      this.indexAllot.cycle_id = row.cycle_id;
    },
    // 指标分配处理事件
    async addIndexAllot() {
      this.indexAllot.index_id = this.nodeValue.index_id;

      if (!this.indexAllot.Number2) {
        this.indexAllot.Number2 = 0;
      }


      if (this.indexAllot.DeptID.length > 1) { // 批量增加
        try {
          this.IndexSourceLoading = true; // 开启按钮等待
          this.indexAllot.DeptID = this.indexAllot.DeptID.toString();
          // delete this.indexAllot.DeptID; // 删除单个值的
          console.log('提交后2', this.indexAllot);

          const { code } = await InsertBatchIndexAlloc(this.indexAllot);
          if (code === 200) {
            await this.SelectIndexAlloc();
            this.$message.success('批量分配成功');
            this.showConfig = false; // 关闭弹框
            this.IndexSourceLoading = false; // 关闭按钮等待
          }
        } catch (e) {
          console.log(e);
          this.IndexSourceLoading = false; // 关闭按钮等待
        }
      } else { // 单个增加
        try {
          console.log('单个', this.indexAllot.DeptID);
          this.IndexSourceLoading = true; // 开启按钮等待
          this.indexAllot.DeptID = this.indexAllot.DeptID.toString();

          // 修改单个指标
          if (this.configIndexTitle === '修改指标分配') {
            const { code } = await UpdateIndexAlloc(this.indexAllot);
            if (code === 200) {
              await this.SelectIndexAlloc();// 刷新指标列表
              this.$message.success('修改指标分配成功');
              this.showConfig = false; // 关闭弹框
              this.IndexSourceLoading = false; // 关闭按钮等待
            }
          } else { // 新增单个指标分配
            this.IndexSourceLoading = true; // 开启按钮等待
            const { code } = await InsertBatchIndexAlloc(this.indexAllot);
            if (code === 200) {
              await this.SelectIndexAlloc(); // 刷新指标列表
              this.$message.success('分配成功');
              this.showConfig = false; // 关闭弹框
              this.IndexSourceLoading = false; // 关闭按钮等待
            }
          }
        } catch (e) {
          console.log(e);
          this.IndexSourceLoading = false; // 关闭按钮等待
        }
      }
    },
    // 删除指标分配
    async delIndexAllot(row) {
      this.$confirm('此操作将永久删除该指标分配, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(async() => {
        const { code } = await DeleteIndexAlloc({ IndexAllocID: row.IndexAllocID });
        if (code === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          await this.SelectIndexAlloc(); // 刷新列表
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
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

.DMContainer {
  font-size: 1vh;
  font-weight: bolder;

  .el-row:nth-child(1) {
    margin-top: 10px;
    margin-left: 20px;
    margin-right: 20px;

    .el-col {
      height: 60px;
      background-color: #f4f4f5;
      line-height: 60px;
      text-align: left;
      padding-left: 20px;
      // 实现文字溢出隐藏加省略号
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap
    }
  }

  .el-row:nth-child(2) {
    margin-top: 20px;
    margin-left: 20px;
    margin-right: 20px;

    .el-col {
      background-color: #f4f4f5;
      text-align: center;
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


  .el-loading-spinner .circular {
    display: none; //隐藏之前element-ui默认的loading动画
  }
}
</style>
