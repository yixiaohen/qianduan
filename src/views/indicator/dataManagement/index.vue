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
                <!--                <el-button :disabled="isUseAllot" type="success" size="mini" @click="openAllotIndex1()">指标分配-->
                <el-button :disabled="nodeValue===''" type="success" size="mini" @click="openAllotIndex1()">指标分配
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
                <div class="DMContainer">
                  <div
                    style="width: 100%;
                    background-color:#f4f4f5;
                    display: inline-block;
                    height: 32px;
                    line-height: 32px;"
                  >
                    <span>指标名称：{{ nodeValue.name }}</span>
                    <el-divider direction="vertical"/>

                    <span>指标编码：{{ nodeValue.formulaObj }}</span>

                    <el-divider direction="vertical"/>
                    <el-radio-group
                      v-model="isYearOrMonth"
                      style="margin-top: -4px;margin-left: 4px"
                      size="mini"
                      @change="isYearOrMonthc"
                    >
                      <el-radio-button :label="1">按年份</el-radio-button>
                      <el-radio-button :label="2">按年月</el-radio-button>
                    </el-radio-group>

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
                    <el-button v-if="isYearOrMonth===1" type="primary" size="mini" @click="searchYear">查找</el-button>

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
                    <el-button v-if="isYearOrMonth===2" type="primary" size="mini" @click="searchMonth">查找</el-button>
                    <el-divider direction="vertical"/>

                    <el-input
                      v-model="searchDet"
                      style="width:150px"
                      size="mini"
                      placeholder="部门名称"
                    />
                    <el-button
                      type="primary"
                      size="mini"
                      @click="searchContent"
                    >
                      搜索
                    </el-button>

                  </div>
                  <el-row>
                    <el-col :span="24">
                      <el-table
                        v-loading="tableDataLoading"
                        :data="indexAllotData"
                        border
                        stripe
                        height="calc(100vh - 240px)"
                        style="width: 100%;margin-top: 20px"
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
                          prop="cycName"
                          label="周期名称"
                          align="center"
                          :show-overflow-tooltip="cellOverflow"
                        />
                        <el-table-column
                          prop="dateTime"
                          label="周期"
                          sortable
                          width="180px"
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
                          prop="paraName"
                          label="参数名称"
                          align="center"
                          :show-overflow-tooltip="cellOverflow"
                        />
                        <el-table-column
                          prop="number"
                          label="指标值"
                          align="center"
                          width="120px"
                          :show-overflow-tooltip="cellOverflow"
                        >
                          <template slot-scope="{ row }">
                            <el-tag
                              v-if="row.number!==null"
                            type="primary"
                            >
                              {{row.number}}
                            </el-tag>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="Remarks"
                          label="备注"
                          align="center"
                          :show-overflow-tooltip="cellOverflow"
                        />
                        <el-table-column
                          prop="LastMatchTime"
                          label="创建日期"
                          sortable
                          width="190px"
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
                          width="150px"
                          fixed="right"
                          :show-overflow-tooltip="cellOverflow"
                        >
                          <template slot-scope="{ row }">
                            <el-button type="info" size="mini" icon="el-icon-edit" @click="openAllotIndex2(row)">
                            </el-button>
                            <el-button type="danger" size="mini" icon="el-icon-delete" @click="delIndexAllot(row)">
                            </el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-col>
                  </el-row>
                  <!--      分页-->
                  <div class="block">
                    <el-switch v-model="cellOverflow"/>

                    <el-pagination
                      style="margin: 6px 0 0 0"
                      :page-sizes="pagination.pageSizes"
                      :page-size="pagination.pageSize"
                      background
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
      <el-form ref="addDia" :model="indexAllot" label-width="150px" status-icon>
        <el-form-item
          label="周期"
        >
          <el-select
            v-model="indexAllot.cycle_id"
            filterable
            clearable
            style="width: 60%"
            placeholder="请选择"
            size="mini"
          >
            <el-option
              v-for="item2 in cycle"
              :key="item2.Cycleid"
              :value="item2.Cycleid"
              :label="
                            item2.Starway === 0 ? item2.Type+' | '+'结束日期往前' +
                              ' | '+
                              item2.Cycle +
                              ' | '+
                              item2.Num : item2.Starway === 10 ?item2.Type+ ' | '+'今年' +
                              ' | '+
                              item2.Cycle +
                              ' | '+
                              item2.Num : item2.Starway === 11 ?item2.Type+ ' | '+'当季' +
                                ' | '+
                                item2.Cycle +
                                ' | '+
                                item2.Num : item2.Starway === 12 ? item2.Type+' | '+'当月' +
                                  ' | '+
                                  item2.Cycle +
                                  ' | '+
                                  item2.Num : item2.Starway === 20 ? item2.Type+' | '+'去年' +
                                    ' | '+
                                    item2.Cycle +
                                    ' | '+
                                    item2.Num : item2.Starway
                          "
            >
              <span style="float: left">{{ item2.Type }}</span>
              <span
                style="float: right; color: #8492a6; font-size: 13px"
              >{{
                  item2.Starway === 0 ? '结束日期往前' : item2.Starway === 10 ? '今年' : item2.Starway === 11 ? '当季' : item2.Starway === 12 ? '当月' : item2.Starway === 20 ? '去年' : item2.Starway
               }}{{ ' | ' + item2.Cycle + ' | ' + item2.Num }}</span></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="nodeValue.para===1"
          label="指标参数"
        >
          <el-select
            v-model="para_id"
            :multiple="configIndexTitle==='新增指标分配'"
            style="width: 60%"
            clearable
            filterable
            size="mini"
          >
            <el-option
              v-for="item in paramData"
              :value="item.para_id"
              :label="item.name"
            />
          </el-select>
          <span
            v-if="configIndexTitle==='新增指标分配'"
            style="width:40%;word-wrap: break-word;font-size: 12px;line-height: 14px;background-color: #eeeeee"
          >--勾选多个参数可批量分配
          </span>
          <span
            v-else style="width:40%;word-wrap: break-word;font-size: 12px;line-height: 14px;background-color: #eeeeee"
          >--修改时只能选择一个参数
          </span>
        </el-form-item>
        <el-form-item
          v-if="nodeValue.type===1"
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

          <span
            v-if="configIndexTitle==='新增指标分配'"
            style="width:40%;word-wrap: break-word;font-size: 12px;line-height: 14px;background-color: #eeeeee"
          >--勾选多个科室即为批量分配
          </span>
          <span
            v-else style="width:40%;word-wrap: break-word;font-size: 12px;line-height: 14px;background-color: #eeeeee"
          >--修改时只能勾选一个科室
          </span>
        </el-form-item>

        <el-form-item
          v-if="configIndexTitle!=='新增指标分配'"
          label="修正的指标值"
          prop="number2"
        >
          <el-input
            v-model.number="indexAllot.Number2"
            style="width: 60%"
            size="small"
            type="number"
            clearable
          />
        </el-form-item>

        <el-form-item
          label="预警上限值"
          prop="number_max"
        >
          <el-input
            v-model.number="indexAllot.number_max"
            style="width: 60%"
            size="small"
            type="number"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="预警下限值"
          prop="number_min"
        >
          <el-input
            v-model.number="indexAllot.number_min"
            style="width: 60%"
            size="small"
            type="number"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="目标期望值"
          prop="number_target"
        >
          <el-input
            v-model.number="indexAllot.number_target"
            style="width: 60%"
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
            style="width: 60%"
            size="small"
            type="textarea"
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
  GetI_Index_Params,
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
      tableDataLoading: false, // 表格数据加载等待条开关
      indexAllotDataLoading: false, // 导航树数据加载等待条开关
      searchDet: '', // 搜索部门名称
      paramData: [], // 参数数据
      para_id: null, // 参数选项id
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
        Params: '',
        DeptID: -1, // -1代表全院，代表没选科室部门
        cycle_id: null, // 周期id
        Number2: null, // 指标值
        AllocUserID: window.userInfo[0].UserID, // 分配人id
        Remarks: '', // 备注
        number_max: '', // 预警上限值
        number_min: '', // 预警下限值
        number_target: '' // 目标期望值
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
    // 搜索功能
    searchContent() {
      alert('测试搜索' + this.searchDet);
    },
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

    // 按年份搜索指标分配
    searchYear(year) {
      this.listQuery.pageIndex = 1; // 重置页码为1
      this.SelectIndexAlloc(); // 刷新列表
    },
    // 按月份搜索指标分配
    searchMonth(Month) {
      if (this.selectMonth !== '' && this.selectYear === '') {
        alert('按年月查找年份不能为空');
        this.selectMonth = ''; // 错误之后重置已选的月份
      } else if (this.selectMonth === '' && this.selectYear !== '') {
        alert('按年月查找月份不能为空');
        this.selectYear = ''; //
      } else {
        this.listQuery.pageIndex = 1; // 重置页码为1
        this.SelectIndexAlloc(); // 刷新列表
      }
    },
    // 获取选中的科室id数组
    getDefaultDeptsValue(value) {
      this.indexAllot.DeptID = value || 0;
    },
    // 根据指标id查询指标分配列表
    async SelectIndexAlloc() {
      try {
        this.tableDataLoading = true; // 表格加载条开
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
        this.tableDataLoading = false; // 表格加载条关
      } catch (e) {
        this.tableDataLoading = false; // 表格加载条关
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
    // 获取指标参数
    async GetI_Index_Params() {
      try {
        const { data, code } = await GetI_Index_Params({
          indexId: this.nodeValue.index_id
        });
        if (code === 200) {
          this.paramData = data;
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 点击打开指标分配框进行添加
    openAllotIndex1() {
      this.showConfig = true; // 点击打开指标分配框
      this.configIndexTitle = '新增指标分配'; //  新增指标的对话框的标题值
      this.isLotSelect = true; // 新增指标分配时，科室选择为多选
      this.para_id = ''; // 清除已选参数
      this.indexAllot.Params = ''; // 清除已选参数
      this.indexAllot.cycle_id = ''; // 清除已选周期
      this.indexAllot.DeptID = ''; // 清除已选科室
      this.GetI_Index_Params(); // 打开指标分配对话框获取参数数据
    },
    // 点击打开指标分配框进行修改
    openAllotIndex2(row) {
      console.log(row);
      this.showConfig = true; // 点击打开指标分配框
      this.configIndexTitle = '修改指标分配'; //  编辑指标的对话框的标题值
      this.isLotSelect = false; // 修改指标分配时，科室选择为单选
      this.indexAllot.IndexAllocID = row.IndexAllocID; // 将当前点击的指标分配id保存
      // 将当前点击的指标分配数据
      this.indexAllot.Number2 = row.Number2;
      this.indexAllot.number_max = row.number_max;
      this.indexAllot.number_min = row.number_min;
      this.indexAllot.number_target = row.number_target;
      this.indexAllot.Remarks = row.index_id;
      this.nodeValue.index_id = row.index_id;
      this.para_id = row.para_id;
      this.indexAllot.DeptID = row.DeptID;
      this.indexAllot.Year = row.Year;
      this.indexAllot.Months = row.Months;
      this.indexAllot.Number2 = row.Number2;
      this.indexAllot.Remarks = row.Remarks;
      this.indexAllot.Cover = row.Cover;
      this.indexAllot.cycle_id = row.cycle_id;
      this.GetI_Index_Params(); // 打开指标分配对话框获取参数数据
    },
    // 指标分配处理事件
    async addIndexAllot() {
      this.indexAllot.index_id = this.nodeValue.index_id;
      this.indexAllot.Params = this.para_id.toString();

      // 修正的指标值
      if (!this.indexAllot.Number2) {
        this.indexAllot.Number2 = null;
      }
      // 预警上限值
      if (!this.indexAllot.number_max) {
        this.indexAllot.number_max = '';
      }
      // 预警下限值
      if (!this.indexAllot.number_min) {
        this.indexAllot.number_min = '';
      }
      // 期望目标值
      if (!this.indexAllot.number_target) {
        this.indexAllot.number_target = '';
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
            this.para_id = null; // 参数清空
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
              this.para_id = null; // 参数清空
              this.showConfig = false; // 关闭弹框
              this.IndexSourceLoading = false; // 关闭按钮等待
            }
          } else { // 新增单个指标分配
            this.IndexSourceLoading = true; // 开启按钮等待
            const { code } = await InsertBatchIndexAlloc(this.indexAllot);
            if (code === 200) {
              await this.SelectIndexAlloc(); // 刷新指标列表
              this.para_id = null; // 参数清空
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
<style lang="scss">
@import "src/styles/loading.scss";
.block {
  display: inline-block;
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

.DMContainer {
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
