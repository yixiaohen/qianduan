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
                  type="success"
                  :closable="false"
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
                    title="指标数据"
                    type="success"
                    :closable="false"
                  />
                </div>
                <div class="DMContainer">
                  <el-row type="flex" justify="center">
                    <!--                    <el-col :span="7">-->
                    <!--                      <el-button-->
                    <!--                        size="mini"-->
                    <!--                        type="success"-->
                    <!--                        icon="el-icon-circle-plus"-->
                    <!--                        round-->
                    <!--                        plain-->
                    <!--                        @click="showConfig=true"-->
                    <!--                      >-->
                    <!--                        添加指标-->
                    <!--                      </el-button>-->
                    <!--                    </el-col>-->
                    <el-col :span="8">
                      <span>指标名称：{{ nodeValue.name }}</span>
                    </el-col>
                    <el-col :span="6">
                      <span>指标编码：{{ nodeValue.formulaObj }}</span>
                    </el-col>
                    <el-col :span="6">
                      <td><span>年份：</span></td>
                      <td>
                        <el-select
                          v-model="defaultSelect"
                          placeholder="请选择"
                          @change="searchYear"
                          size="mini"
                          clearable
                        >
                          <el-option
                            v-for="(item,index) in allYear"
                            :key="index"
                            :label="item.year"
                            :value="item.year"
                          >
                          </el-option>
                        </el-select>
                      </td>
                    </el-col>
                    <el-col :span="4">
                      <el-button :disabled="isUseAllot" type="success" size="mini" @click="openAllotIndex1()">指标分配
                      </el-button>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-table
                        :data="indexAllotData"
                        border
                        height="550"
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
                        />
                        <el-table-column
                          prop="Year"
                          label="年份"
                          width="100px"
                          align="center"
                          sortable

                        >

                        </el-table-column>
                        <el-table-column
                          prop="Months"
                          label="月份/季度"
                          align="center"

                          sortable
                        />
                        <el-table-column
                          prop="DeptName"
                          label="科室"
                          align="center"
                        />
                        <el-table-column
                          prop="Number1"
                          label="数值1"
                          align="center"
                        />
                        <el-table-column
                          prop="Number2"
                          label="数值2"
                          align="center"
                        />
                        <el-table-column
                          prop="Number3"
                          label="数值3"
                          align="center"
                        />
                        <el-table-column
                          prop="Cover"
                          label="是否覆盖"
                          align="center"

                        />
                        <!--                        <el-table-column-->
                        <!--                          prop="DataBasePort"-->
                        <!--                          label="修改者"-->
                        <!--                          align="center"-->
                        <!--                        />-->
                        <el-table-column
                          prop="AllocTime"
                          label="创建日期"
                          align="center"
                        >
                          <template slot-scope="{ row }">{{ row.AllocTime ? row.AllocTime.replace('T', ' ') : '' }}
                          </template>

                        </el-table-column>
                        <el-table-column
                          label="操作"
                          align="center"
                          width="120px"
                        >
                          <template slot-scope="{ row }">
                            <el-button type="text" size="small" @click="openAllotIndex2(row)">编辑</el-button>
                            <el-button type="text" size="small" @click="delIndexAllot(row)">删除</el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-col>
                  </el-row>

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
      <el-form ref="addDia" :model="indexAllot" :rules="rules" label-width="120px" status-icon>
        <el-form-item
          label="年份"
          prop="Year"
          size="medium"
        >
          <el-input
            v-model="indexAllot.Year"
            style="width:30vh"
            size="small"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="月份/季度"
          prop="Months"
          size="small"
        >
          <el-select v-model="indexAllot.Months" placeholder="请选择">
            <el-option
              v-for="(item,index) in MonthsValue"
              :key="index"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>

        </el-form-item>
        <el-form-item
          label="科室"
          prop="DeptIDs"
        >
          <defaultDepts
            v-model="indexAllot.DeptID"
            :multiple="isLotSelect"
            w="300px"
            @getDefaultDeptsValue="getDefaultDeptsValue"
          />
          <span>&nbsp;&nbsp;&nbsp;&nbsp;--</span>
          <el-tag type="info" size="mini">勾选多个科室即为批量分配,修改时只能勾选一个科室</el-tag>
        </el-form-item>
        <el-form-item
          label="数值1"
          prop="formulaObj"
        >
          <el-input
            v-model="indexAllot.Number1"
            style="width:30vh"
            size="small"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="数值2"
          prop="formulaObj"
        >
          <el-input
            v-model="indexAllot.Number2"
            style="width:30vh"
            size="small"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="数值3"
          prop="formulaObj"
        >
          <el-input
            v-model="indexAllot.Number3"
            style="width:30vh"
            size="small"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="是否覆盖"
          prop="Cover"
        >
          <el-select v-model="indexAllot.Cover" size="small" placeholder="请选择">
            <el-option
              v-for="item in [{value:'是'},{value:'否'}]"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="备注"
          prop="Remarks"
        >
          <el-input
            v-model="indexAllot.Remarks"
            style="width:30vh"
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
          @click="addIndexAllot()"
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
  InsertIndexAlloc,
  SelectIndexAlloc,
  SelectIndexYear,
  UpdateIndexAlloc
} from '@/api/indicator/I_IndexAlloc';

export default {
  components: {
    IndexNavTree,
    splitPane,
    defaultDepts
  },
  data() {
    return {
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
      defaultSelect: '全部', // 默认选中值
      allYear: [], // 一开始全部年份
      selectYear: '', // 选中的年份
      indexAllot: { // 新增的指标分配数据
        IndexAllocID: 0,
        index_id: 0,
        DeptID: 0,
        Year: '',
        Months: '',
        Number1: 0,
        Number2: 0,
        Number3: 0,
        AllocUserID: window.userInfo[0].UserID, // 分配人id
        // AllocTime: "2021-10-14T07:51:52.880Z",
        Remarks: '', // 备注
        Cover: '', // 是否覆盖
        DeptIDs: 0// 批量增加
      },
      MonthsValue: [ // 供Months选择的值
        '01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
        '11', '12', '1季度', '2季度', '3季度', '4季度'
      ],
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
        name: [
          //   { required: true, message: '请输入指标名称', trigger: 'blur' }
          // ],
          // formulaObj: [
          //   { required: true, message: '请输入公式编译目标码', trigger: 'blur' }
          // ],
          // iattribute: [
          //   { required: true, message: '请输入指标属性', trigger: 'blur' }
          // ],
          // idefinition: [
          //   { required: true, message: '请输入指标定义', trigger: 'blur' }
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
      pickerOptions: { // 时间选择器的快捷选项
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      listLoading: false,
      nodeValue: '',
      currentEdit: -1 // 判断是否显示input框
    };
  },
  methods: {
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
    // 获取年份搜索年的数据
    async SelectIndexYear(val) {
      const { data } = await SelectIndexYear({ index_id: val });
      this.allYear = data;
    },
    // 按年份搜索指标分配
    searchYear(year) {
      console.log(year);
      this.selectYear = year; // 传过来的参数赋值给当前选中的年份
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
            userID: window.userInfo[0].UserID,
            pageIndex: this.listQuery.pageIndex,
            pageSize: this.listQuery.pageSize
          });
        if (code === 200) {
          this.indexAllotData = data.DataList; // 赋值放在指标列表数组中
          console.log('测试', data);
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
      this.SelectIndexYear(value.index_id);
      this.defaultSelect = '全部'; // 初始值的年份重置为全部
      this.selectYear = '全部'; // 选中的年份重置为全部
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
      this.showConfig = true; // 点击打开指标分配框
      this.configIndexTitle = '修改指标分配'; //  编辑指标的对话框的标题值
      this.isLotSelect = false; // 修改指标分配时，科室选择为单选
      this.indexAllot.IndexAllocID = row.IndexAllocID; // 将当前点击的指标分配id保存
      // 将当前点击的指标分配数据
      this.nodeValue.index_id = row.index_id;
      this.indexAllot.DeptID = row.DeptID;
      this.indexAllot.Year = row.Year;
      this.indexAllot.Months = row.Months;
      this.indexAllot.Number1 = row.Number1;
      this.indexAllot.Number2 = row.Number2;
      this.indexAllot.Number3 = row.Number3;
      this.indexAllot.Remarks = row.Remarks;
      this.indexAllot.Cover = row.Cover;
    },
    // 指标分配处理事件
    async addIndexAllot() {
      this.indexAllot.index_id = this.nodeValue.index_id;
      if (this.indexAllot.DeptID.length > 1) { // 批量增加
        try {
          this.indexAllot.DeptIDs = this.indexAllot.DeptID.toString();
          delete this.indexAllot.DeptID; // 删除单个值的
          console.log('提交后2', this.indexAllot);
          const { code } = await InsertBatchIndexAlloc(this.indexAllot);
          if (code === 200) {
            await this.SelectIndexAlloc();
            this.$message.success('批量分配成功');
            this.showConfig = false; // 关闭弹框
          }
        } catch (e) {
          console.log(e);
        }
      } else { // 单个增加
        try {
          this.indexAllot.DeptID = this.indexAllot.DeptID.toString();
          delete this.indexAllot.DeptIDs;
          if (this.configIndexTitle === '修改指标分配') {
            const { code } = await UpdateIndexAlloc(this.indexAllot);
            if (code === 200) {
              await this.SelectIndexAlloc();// 刷新指标列表
              this.$message.success('修改指标分配成功');
              this.showConfig = false; // 关闭弹框
            }
          } else { // 新增指标分配
            const { code } = await InsertIndexAlloc(this.indexAllot);
            if (code === 200) {
              await this.SelectIndexAlloc(); // 刷新指标列表
              this.$message.success('分配成功');
              this.showConfig = false; // 关闭弹框
            }
          }
        } catch (e) {
          console.log(e);
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
    margin-top: 20px;
    margin-left: 20px;
    margin-right: 20px;

    .el-col {
      height: 80px;
      background-color: #e7faf0;
      line-height: 80px;
      text-align: left;
      padding-left: 20px;
    }
  }

  .el-row:nth-child(2) {
    margin-top: 20px;
    margin-left: 20px;
    margin-right: 20px;

    .el-col {
      background-color: #e7faf0;
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

  .el-loading-spinner {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    -webkit-animation: typing 1s linear infinite alternate;
    -moz-animation: Typing 1s linear infinite alternate;
    animation: typing 1s linear infinite alternate;
    margin: 0px auto; /* Not necessary- its only for layouting*/
    position: relative;
    left: -40px;
  }

  @-webkit-keyframes typing {
    0% {
      background-color: rgba(247, 111, 73, 1);
      box-shadow: 40px 0px 0px 0px rgba(247, 111, 73, 0.2),
      80px 0px 0px 0px rgba(247, 111, 73, 0.2);
    }
    25% {
      background-color: rgba(247, 111, 73, 0.4);
      box-shadow: 40px 0px 0px 0px rgba(247, 111, 73, 2),
      80px 0px 0px 0px rgba(247, 111, 73, 0.2);
    }
    75% {
      background-color: rgba(247, 111, 73, 0.4);
      box-shadow: 40px 0px 0px 0px rgba(247, 111, 73, 0.2),
      80px 0px 0px 0px rgba(247, 111, 73, 1);
    }
  }

  @-moz-keyframes typing {
    0% {
      background-color: rgba(247, 111, 73, 1);
      box-shadow: 40px 0px 0px 0px rgba(247, 111, 73, 0.2),
      80px 0px 0px 0px rgba(247, 111, 73, 0.2);
    }
    25% {
      background-color: rgba(247, 111, 73, 0.4);
      box-shadow: 40px 0px 0px 0px rgba(247, 111, 73, 2),
      80px 0px 0px 0px rgba(247, 111, 73, 0.2);
    }
    75% {
      background-color: rgba(247, 111, 73, 0.4);
      box-shadow: 40px 0px 0px 0px rgba(247, 111, 73, 0.2),
      80px 0px 0px 0px rgba(247, 111, 73, 1);
    }
  }
  @keyframes typing {
    0% {
      background-color: rgba(247, 111, 73, 1);
      box-shadow: 40px 0px 0px 0px rgba(247, 111, 73, 0.2),
      80px 0px 0px 0px rgba(247, 111, 73, 0.2);
    }
    25% {
      background-color: rgba(247, 111, 73, 0.4);
      box-shadow: 40px 0px 0px 0px rgba(247, 111, 73, 2),
      80px 0px 0px 0px rgba(247, 111, 73, 0.2);
    }
    75% {
      background-color: rgba(0, 184, 220, 0.4);
      box-shadow: 40px 0px 0px 0px rgba(249, 54, 0, 0.2),
      80px 0px 0px 0px rgb(2, 243, 130);
    }
  }

  .el-loading-spinner .circular {
    display: none; //隐藏之前element-ui默认的loading动画
  }
}
</style>
