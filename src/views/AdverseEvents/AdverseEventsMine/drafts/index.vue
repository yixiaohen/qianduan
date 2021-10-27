<template>
  <div class="drafts">
    <div slot="header" class="clearfix">
      <el-form label-position="left" :inline="true" size="mini">
        <!-- 批量操作1 -->
        <el-form-item>
          <el-button
            size="mini"
            class="delete_button"
            @click="deleteDrafts"
          >删除草稿
          </el-button>
        </el-form-item>
        <el-form-item>
          <!--          通用事件按钮-->
          <el-button
            size="mini"
            type="success"
            @click="edChangeL(tongyong=0)"
          >通用事件
          </el-button>
          <!--          医疗器械(不良)事件按钮-->
          <el-button
            size="mini"
            type="success"
            @click="edChangeL(qixie=1)"
          >医疗器械(不良)事件（特定）
          </el-button>
          <!--          护理安全(不良)事件按钮-->
          <el-button
            size="mini"
            type="success"
            @click="edChangeL(huli=2)"
          >护理安全(不良)事件（特定）
          </el-button>
          <!--          医疗安全(不良)事件按钮-->
          <el-button
            size="mini"
            type="success"
            @click="edChangeL(yiliao=3)"
          >医疗安全(不良)事件（特定）
          </el-button>
          <!--          药品安全(不良)事件按钮-->
          <el-button
            size="mini"
            type="success"
            @click="edChangeL(yaopin=4)"
          >药品安全(不良)事件（特定）
          </el-button>
        </el-form-item>
        <el-form-item widht="60">
          <el-select v-model="value" placeholder="标记为" @change="mark(1)">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="temNameL===0" class="main">
      <el-table
        :data="tableData"
        style="width: 100%"
        size="mini"
        @selection-change="handleSelectionChange"
        @row-click="getDetails"
      >
        <el-table-column type="selection" align="center" />
        <el-table-column width="20">
          <template slot-scope="{ row }">
            <i class="el-icon-document" @click="edit(row)" />
          </template>
        </el-table-column>
        <el-table-column
          prop="VictimName"
          label="患者姓名"
          width="95"
          align="center"
        />
        <el-table-column
          prop="Sex"
          label="性别"
          width="50"
          align="center"
        />
        <el-table-column
          prop="Age"
          label="年龄"
          width="50"
          align="center"
        />
        <el-table-column
          prop="Weight"
          label="体重(KG)"
          width="80"
          align="center"
        />
        <el-table-column
          prop="Phone"
          label="联系电话"
          width="100"
          align="center"
        />
        <el-table-column
          prop="TreatmentType"
          label="就趁形式"
          width="100"
          align="center"
        />
        <el-table-column
          prop="TreatmentDate"
          label="就趁日期"
          width="150"
          align="center"
        >
          <template slot-scope="{ row }">{{
            row.TreatmentDate ? row.TreatmentDate.replace('T', ' ') : ''
          }}
          </template>
        </el-table-column>
        <el-table-column
          prop="VictimType"
          label="受损害者类型"
          align="center"
        />
        <el-table-column
          prop="Severity"
          label="严重度"
          width="70"
          align="center"
        />
        <el-table-column
          prop="ClinicNumber"
          label="门诊号"
          width="95"
          align="center"
        />
        <el-table-column
          prop="Status"
          label="状态"
          align="center"
          width="80"
        />
        <el-table-column
          label="标记"
          align="center"
        >
          <template slot-scope="scope">
            <!-- 单行操作2 -->
            <i
              v-if="scope.row.IsDraft == 0"
              class="el-icon-star-off"
              @click="mark(2, scope.row.mark)"
            />
            <i
              v-if="scope.row.IsDraft == 1"
              class="el-icon-star-on"
              @click="mark(2, scope.row.mark)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">

            <el-button
              icon="el-icon-edit"
              circle
              type="primary"
              size="mini"
              @click="edit(scope.row)"
            />
            <el-button
              icon="el-icon-delete"
              circle
              type="danger"
              size="mini"
              @click="deleteRow(scope.row)"
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
    </div>
    <!--医疗器械模板列表数据-->
    <div v-else-if="temNameL===1" class="main">
      <div class="middle">
        <div class="middleBody">
          <el-table
            border
            height="80%"
            size="mini"
            :data="reportData"
            style="width: 100%"
            stripe
            :header-cell-style="{'text-align':'center'}"
            :cell-style="{'text-align':'center'}"
          >
            <el-table-column
              type="index"
              width="50"
              label="序号"
              align="center"
            />
            <el-table-column
              prop="ReportDate"
              label="报告日期"
              width="180"
            >
              <template slot-scope="{ row }">{{
                row.ReportDate
                  ? row.ReportDate.replace('T', ' ') : ''
              }}
              </template>
            </el-table-column>
            <el-table-column
              prop="PatientName"
              label="患者姓名"
              width="180"
            />
            <el-table-column
              prop="EventMain"
              label="事件主要表现"
            />

            <el-table-column
              prop="EventResult"
              label="事件后果"
            />
            <el-table-column
              prop="EventStatement"
              label="事件陈述"
            />

            <el-table-column
              prop="Operator"
              label="操作人"
            />
            <el-table-column
              prop="EventReason"
              label="事件发生原因"
            />
            <el-table-column
              prop="Treatment"
              label="事件处理情况"
            />
            <el-table-column
              prop="EventRSate"
              label="事件报告状态"
            />


            <el-table-column
              prop="ReportUser"
              label="报告人"
            />
            <el-table-column
              prop="Status"
              label="审核状态"
            />
            <el-table-column label="操作" align="center" width="150px">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  circle
                  type="primary"
                  icon="el-icon-edit"
                  @click="edit(scope.row)"
                />

                <el-button
                  size="mini"
                  circle
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteRow(scope.row)"
                />
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            style="margin: 6px 0 0 0"
            background
            :current-page.sync="listQueryYiLiao.pageIndex"
            :page-size="listQueryYiLiao.pageSize"
            :page-sizes="listQueryYiLiao.pageSizes"
            :total="listQueryYiLiao.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
    <!--护理模板列表数据-->
    <div v-else-if="temNameL===2" class="main">
      <div class="middle">
        <div class="middleBody">
          <el-table
            height="80%"
            border
            size="mini"
            :data="reportData"
            style="width: 100%;"
            stripe
            :header-cell-style="{'text-align':'center'}"
            :cell-style="{'text-align':'center'}"
          >
            <el-table-column
              type="index"
              width="50"
              label="序号"
              align="center"
            />
            <el-table-column
              prop="ReportDate"
              label="报告日期"
              width="180"
            >
              <template slot-scope="{ row }">{{
                row.ReportDate
                  ? row.ReportDate.replace('T', ' ')
                  : ''
              }}
              </template>
            </el-table-column>
            <el-table-column
              prop="PatientName"
              label="患者姓名"
            />

            <el-table-column
              prop="Age"
              width="50%"
              label="年龄"
            />
            <el-table-column
              prop="Sex"
              width="50%"
              label="性别"
            />
            <el-table-column
              prop="Diagnosis"
              label="诊断"
            />

            <el-table-column
              prop="Process"
              label="护理事件经过及处理后果"
            />

            <el-table-column
              prop="CauseAnalysis"
              label="原因分析"
            />

            <el-table-column
              prop="Measures"
              label="整改措施"
            />

            <el-table-column
              prop="Opinions"
              label="部门意见"
            />
            <el-table-column
              prop="ReportUser"
              label="报告护士"
            />
            <el-table-column
              prop="Status"
              label="审核状态"
            />
            <el-table-column label="操作" align="center" width="150px">
              <template slot-scope="scope">

                <el-button
                  size="mini"
                  circle
                  type="primary"
                  icon="el-icon-edit"
                  @click="edit(scope.row)"
                />

                <el-button
                  size="mini"
                  circle
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteRow(scope.row)"
                />
              </template>
            </el-table-column>

          </el-table>
          <el-pagination
            style="margin: 6px 0 0 0"
            background
            :current-page.sync="listQueryHuLi.pageIndex"
            :page-size="listQueryHuLi.pageSize"
            :page-sizes="listQueryHuLi.pageSizes"
            :total="listQueryHuLi.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
    <!--医疗安全模板列表数据-->
    <div v-else-if="temNameL===3" class="main">
      <div class="middle">
        <div class="middleBody">
          <el-table
            border
            height="80%"
            size="mini"
            :data="reportData"
            style="width: 100%"
            stripe
            :header-cell-style="{'text-align':'center'}"
            :cell-style="{'text-align':'center'}"
          >
            <el-table-column
              type="index"
              width="50"
              label="序号"
              align="center"
            />
            <el-table-column
              prop="ReportDate"
              label="报告日期"
              width="180"
            >
              <template slot-scope="{ row }">{{
                row.ReportDate
                  ? row.ReportDate.replace('T', ' ')
                  : ''
              }}
              </template>
            </el-table-column>
            <el-table-column
              prop="PatientName"
              label="患者姓名"
              width="180"
            />
            <el-table-column
              prop="Place"
              label="事情发生场所"
            />
            <el-table-column
              prop="EventMain"
              label="事件主要表现"
            />

            <el-table-column
              prop="EventResult"
              label="事件后果"
            />
            <el-table-column
              prop="EventStatement"
              label="事件陈述"
            />

            <el-table-column
              prop="EventReason"
              label="事件发生原因"
            />
            <el-table-column
              prop="Treatment"
              label="事件处理情况"
            />
            <el-table-column
              prop="EventRSate"
              label="事件报告状态"
            />


            <el-table-column
              prop="ReportUser"
              label="报告人"
            />
            <el-table-column
              prop="Status"
              label="审核状态"
            />
            <el-table-column label="操作" align="center" width="150px">
              <template slot-scope="scope">

                <el-button
                  size="mini"
                  circle
                  type="primary"
                  icon="el-icon-edit"
                  @click="edit(scope.row)"
                />
                <el-button
                  size="mini"
                  circle
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteRow(scope.row)"
                />
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            style="margin: 6px 0 0 0"
            background
            :current-page.sync="listQueryYiLiao.pageIndex"
            :page-size="listQueryYiLiao.pageSize"
            :page-sizes="listQueryYiLiao.pageSizes"
            :total="listQueryYiLiao.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
    <!--药品安全模板列表数据-->
    <div v-else-if="temNameL===4" class="main">
      <div class="middle">
        <div class="middleBody">
          <el-table
            height="80%"
            border
            size="mini"
            :data="reportData"
            style="width: 100%"
            stripe
            :header-cell-style="{'text-align':'center'}"
            :cell-style="{'text-align':'center'}"
          >
            <el-table-column
              type="index"
              width="50"
              label="序号"
              align="center"
            />
            <el-table-column
              prop="ReportDate"
              label="报告日期"
            >
              <template slot-scope="{ row }">{{
                row.ReportDate
                  ? row.ReportDate.replace('T', ' ')
                  : ''
              }}
              </template>
            </el-table-column>
            <el-table-column
              prop="PatientName"
              label="患者姓名"
            />

            <el-table-column
              prop="Sex"
              label="性别"
              width="50%"
            />

            <el-table-column
              prop="Age"
              label="年龄"
              width="50%"
            />

            <el-table-column
              prop=" Degree"
              label="严重程度"
            />
            <el-table-column
              prop="Sickness"
              label="原患疾病"
            />
            <el-table-column
              prop="Influence"
              label="对原患疾病的影响"
            />
            <el-table-column
              prop="ReactionName"
              label="不良反应/事件名称"
            />

            <el-table-column
              prop="ReactionResult"
              label="不良反应/事件的结果"
            />


            <!--                <el-table-column-->
            <!--                  prop="Influence"-->
            <!--                  label="对原患疾病的影响"-->
            <!--                >-->
            <!--                </el-table-column>-->

            <el-table-column
              prop="ReportUser"
              label="报告人"
            />
            <el-table-column
              prop="Status"
              label="审核状态"
            />

            <el-table-column label="操作" align="center" width="150px">
              <template slot-scope="scope">

                <el-button
                  size="mini"
                  circle
                  type="primary"
                  icon="el-icon-edit"
                  @click="edit(scope.row)"
                />

                <el-button
                  size="mini"
                  circle
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteRow(scope.row)"
                />
              </template>
            </el-table-column>


          </el-table>
          <el-pagination
            style="margin: 6px 0 0 0"
            background
            :current-page.sync="listQueryYaoPin.pageIndex"
            :page-size="listQueryYaoPin.pageSize"
            :page-sizes="listQueryYaoPin.pageSizes"
            :total="listQueryYaoPin.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  DeleteReport,
  DeleteReport1,
  DeleteReportList,
  SelectReport,
  SelectReportAnQuan,
  SelectReportHuli,
  SelectReportqixie,
  SelectReportYaoPin
} from '@/api/AE_Event';

export default {
  name: 'Drafts',

  data() {
    return {
      temNameL: 0,
      reportData: [], // 固定模板数据
      listQueryYiLiao: {
        pageIndex: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100, 150, 200],
        Total: 0,
        IsDraft: 1,
        CreateUserID: window.userInfo[0].UserID,
        Status: ''
        // type: 1 // 1表示查询医疗器械模板
      },
      listQueryHuLi: {
        pageIndex: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100, 150, 200],
        Total: 0,
        IsDraft: 1,
        CreateUserID: window.userInfo[0].UserID,
        Status: ''
        // type: 2 // 2表示查询护理不良模板
      },
      listQueryYiLiaoAnQuan: {
        pageIndex: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100, 150, 200],
        Total: 0,
        IsDraft: 1,
        EventReportID: 0,
        CreateUserID: window.userInfo[0].UserID,
        Status: ''
        // type: 3 // 3表示查询医疗安全模板
      },
      listQueryYaoPin: {
        pageIndex: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100, 150, 200],
        Total: 0,
        IsDraft: 1,
        CreateUserID: window.userInfo[0].UserID,
        Status: ''
        // type: 4 // 3表示查询医疗安全模板
      },
      typeNum: 0,
      tableData: [],
      options: [
        {
          value: '1',
          label: '星标草稿'
        },
        {
          value: '2',
          label: '取消星标'
        }
      ],
      value: '',
      selectionList: [],
      listQuery: {
        CreateUserID: window.userInfo[0].UserID,
        pageIndex: 1,
        pageSize: 10,
        EventName: '',
        IsDraft: 1
      },
      pagination: {
        pageIndex: 1,
        total: 0,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100, 150, 200]
      },
      valS: -1,
      submitData: {}
    };
  },
  created() {
    this.SelectReport();
    // this.SelectReportqixie();
    // this.SelectReportHuli();
    // this.SelectReportAnQuan();
    // this.SelectReportYaoPin();
  },
  methods: {
    edChangeL(val) {
      if (val === 0) {
        // 以下是为了防止连续多次点击造成的错
        if (this.valS === val) {
          this.valS = val;
        } else {
          this.activities = [];
          this.SelectReport();
          this.temNameL = 0;
          this.valS = val;
        }
      } else if (val === 1) {
        // 以下是为了防止连续多次点击造成的错
        if (this.valS === val) {
          this.valS = val;
        } else {
          this.activities = [];
          this.SelectReportqixie();
          this.temNameL = 1;
          this.valS = val;
        }
      } else if (val === 2) {
        // 以下是为了防止连续多次点击造成的错
        if (this.valS === val) {
          this.valS = val;
        } else {
          this.activities = [];
          this.SelectReportHuli();
          this.temNameL = 2;
          this.valS = val;
        }
      } else if (val === 3) {
        // 以下是为了防止连续多次点击造成的错
        if (this.valS === val) {
          this.valS = val;
        } else {
          this.activities = [];
          this.SelectReportAnQuan();
          this.temNameL = 3;
          this.valS = val;
        }
      } else if (val === 4) {
        // 以下是为了防止连续多次点击造成的错
        if (this.valS === val) {
          this.valS = val;
        } else {
          this.activities = [];
          this.SelectReportYaoPin();
          this.temNameL = 4;
          this.valS = val;
        }
      }
    },

    async SelectReport() {
      this.listLoading = true;
      try {
        const { data } = await SelectReport(this.listQuery);
        this.pagination.total = data.Total;
        this.tableData = data.DataList;
      } catch (error) {
        this.$message({ type: 'error', message: error });
      } finally {
        this.listLoading = false;
      }
    },
    async SelectReportqixie() {
      this.listLoading = true;
      try {
        this.typeNum = 1; // 此时可以用1表示当前显示的是医疗器械安全表
        const { data } = await SelectReportqixie(this.listQueryYiLiao);
        this.listQueryYiLiao.total = data.Total;
        this.reportData = data.DataList;
        this.temNameL = 1;
      } catch (error) {
        this.$message({ type: 'error', message: error });
      } finally {
        this.listLoading = false;
      }
    },
    async SelectReportHuli() {
      this.listLoading = true;
      try {
        this.typeNum = 2; // 此时可以用2表示当前显示的是护理安全表
        const { data } = await SelectReportHuli(this.listQueryHuLi);
        this.listQueryHuLi.total = data.Total;
        this.reportData = data.DataList;
        this.temNameL = 2;
      } catch (error) {
        this.$message({ type: 'error', message: error });
      } finally {
        this.listLoading = false;
      }
    },
    async SelectReportAnQuan() {
      this.listLoading = true;
      try {
        this.typeNum = 3;
        const { data } = await SelectReportAnQuan(this.listQueryYiLiaoAnQuan);
        this.listQueryYiLiaoAnQuan.Total = data.Total;
        this.reportData = data.DataList;
        this.temNamel = 3;
      } catch (error) {
        this.$message({ type: 'error', message: error });
      } finally {
        this.listLoading = false;
      }
    },
    async SelectReportYaoPin() {
      this.listLoading = true;
      try {
        this.typeNum = 4; // 此时可以用4表示当前显示的是药品安全表
        const { data } = await SelectReportYaoPin(this.listQueryYaoPin);
        this.listQueryYaoPin.total = data.Total;
        this.reportData = data.DataList;
        this.temNameL = 4;
      } catch (error) {
        this.$message({ type: 'error', message: error });
      } finally {
        this.listLoading = false;
      }
    },

    // 每页条数,加上通用事件一共五钟情况，0为通用事件分页
    handleSizeChange(page) {
      if (this.temNameL === 0) {
        this.listQuery.pageSize = page;
      } else if (this.temNameL === 1) {
        this.listQueryYiLiao.pageSize = page;
      } else if (this.temNameL === 2) {
        this.listQueryHuLi.pageSize = page;
      } else if (this.temNameL === 3) {
        this.listQueryYiLiaoAnQuan.pageSize = page;
      } else if (this.temNameL === 4) {
        this.listQueryYaoPin.pageSize = page;
      }
      this.clickSelectReport(this.temNameL);
    },

    // 当前页
    handleCurrentChange(index) {
      if (this.temNameL === 0) {
        this.listQuery.pageIndex = index;
        this.SelectReport();
      } else if (this.temNameL === 1) {
        this.listQueryYiLiao.index = index;
        this.SelectReportqixie();
      } else if (this.temNameL === 2) {
        this.listQueryHuLi.pageIndex = index;
        this.SelectReportHuli();
      } else if (this.temNameL === 3) {
        this.listQueryYiLiaoAnQuan.pageIndex = index;
        this.SelectReportAnQuan();
      } else if (this.temNameL === 4) {
        this.listQueryYaoPin.pageIndex = index;
        this.SelectReportYaoPin();
      }
    },

    // 改变分页视图
    clickSelectReport(temNameL) {
      this.pagination.pageIndex = 1;
      this.listQuery.pageIndex = 1;
      if (temNameL === 0) {
        this.SelectReport();
      } else if (temNameL === 1) {
        this.SelectReportqixie();
      } else if (temNameL === 2) {
        this.SelectReportHuli();
      } else if (temNameL === 3) {
        this.SelectReportAnQuan();
      } else if (temNameL === 4) {
        this.SelectReportYaoPin();
      }
    },


    async deleteDrafts() {
      if (this.selectionList.length == 0) {
        this.$message.warning('请至少选中一条草稿');
        return;
      }
      this.$confirm('此操作将永久删除该不良事件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          DeleteReportList({ EventReportIDArray: this.selectionList }).then(
            (data) => {
              if (data.code === 200) {
                this.$message.success('删除成功!');
                this.SelectReport();
              }
            }
          );
        })
        .catch(() => {
        });
    },
    mark(val, val2) {
      if (val === 1) {
        if (this.selectionList.length == 0) {
          this.$message.warning('请至少选中一条草稿');
          this.value = '';
          return;
        }
      } else if (val === 2) {
        console.log(val2);
      }
    },
    // handleSizeChange(val) {
    //   console.log(`每页 ${val} 条`);
    // },
    // handleCurrentChange(val) {
    //   console.log(`当前页: ${val}`);
    // },
    handleSelectionChange(row) {
      this.selectionList = [];
      row.map((item) => {
        this.selectionList.push(item.EventReportID);
      });
    },
    getDetails(row) {
      console.log(row);
    },
    async deleteRow(row) {
      const id = row.EventReportID;
      this.$confirm('此操作将永久删除该不良事件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 删除通用事件条目
          if (this.temNameL === 0) {
            DeleteReport({ EventReportID: id }).then((data) => {
              if (data.code === 200) {
                this.$message.success('删除成功!');
                this.SelectReport();
              }
            });
          }

          // 删除医疗器械事件条目
          else if (this.temNameL === 1) {
            this.temNameL === 1;
            DeleteReport1({ EventReportID: id, type: 1 }).then((data) => {
              if (data.code === 200) {
                this.$message.success('删除成功!');
                this.SelectReportqixie();
              }
            });
          }
          // 删除护理安全事件条目
          else if (this.temNameL === 2) {
            this.temNameL === 2;
            DeleteReport1({ EventReportID: id, type: 2 }).then((data) => {
              if (data.code === 200) {
                this.$message.success('删除成功!');
                this.SelectReportHuli();
              }
            });
          }
          // 删除医疗安全事件条目
          else if (this.temNameL === 3) {
            this.temNameL === 3;
            DeleteReport1({ EventReportID: id, type: 3 }).then((data) => {
              if (data.code === 200) {
                this.$message.success('删除成功!');
                this.SelectReportAnQuan();
              }
            });
          }
          // 删除药品安全事件条目
          else if (this.temNameL === 4) {
            this.temNameL === 4;
            DeleteReport1({ EventReportID: id, type: 4 }).then((data) => {
              if (data.code === 200) {
                this.$message.success('删除成功!');
                this.SelectReportYaoPin();
              }
            });
          }
        })
        .catch(() => {
        });
    },
    edit(row) {
      this.$router.push({
        name: 'AdverseEventsReport',
        params: {
          id: row.EventReportID,
          draftsType: this.temNameL,
          biaoshi: 2
        }
      });
    }
  }
};
</script>

<style lang="scss" >
.drafts {
  .el-table th,
  .el-table td {
    padding: 5px 0px !important;
  }

  .el-table {
    overflow: auto;
    height: calc(100vh - 200px) !important;
  }

  .clearfix {
    display: flex;
    align-items: center;
    background: #c1d9f3;

    .delete_button {
      margin-left: 15px;
    }

    .el-input {
      width: 50%;
      color: black;
    }

    button {
      border-radius: 4px;
      border-color: #888;
    }

    .el-form-item--mini.el-form-item,
    .el-form-item--small.el-form-item:nth-child(1) {
      margin: 7px 0px !important;
    }
  }

  .main {
    .el-icon-star-off,
    .el-icon-star-on,
    .el-icon-document {
      cursor: pointer;
    }
  }
}
</style>
