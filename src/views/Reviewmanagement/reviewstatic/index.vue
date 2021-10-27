<template>
  <el-container class="reviewstatic">
    <el-header>
      <el-form :inline="true" class="demo-form-inline" size="mini">
        <el-form-item>
          <el-radio-group v-model="activeName" size="mini" @change="radioGroup">
            <el-radio-button
              v-if="checkEvaluateStatus === 1"
              label="等级ABCDE统计"
            >等级ABCDE统计（等级制）
            </el-radio-button>
            <el-radio-button
              v-else
              label="等级ABCDE统计"
            >等级ABCDE统计（分数制）
            </el-radio-button>
            <el-radio-button label="PDCA统计">PDCA统计</el-radio-button>
            <el-radio-button
              label="科室部门PDCA统计"
            >科室部门PDCA统计
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-select v-model="formData.value1" placeholder="批次">
            <el-option
              v-for="(itemFrom, indexFrom) in formData.valueArr"
              :key="indexFrom"
              :label="itemFrom.PeriodName"
              :value="itemFrom.PeriodID"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="formData.value2" placeholder="批次">
            <el-option
              v-for="(itemFrom, indexFrom) in formData.valueArr"
              :key="indexFrom"
              :label="itemFrom.PeriodName"
              :value="itemFrom.PeriodID"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <!--          :disabled="listLoading"-->
          <el-button
            :loading="downloadLoading"
            type="success"
            icon="el-icon-download"

            size="mini"
            @click="handleDownload"
          >导出(自评报告)
          </el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main>
      <transition name="el-zoom-in-center">
        <div
          v-show="activeName === '等级ABCDE统计'"
          style="display: flex; height: 100%; flex-direction: column;"
        >
          <div ref="echatsData" style="flex: 1;margin-top: 30px"/>
          <div>
            <el-table
              :data="Abcde"
              style="width: 100%; height: 250px !important"
              border
              size="mini"
              class="table_P"
            >
              <el-table-column
                label="自评人员审核"
                align="center"
                prop="GradeA"
              >
                <el-table-column
                  label="A级"
                  align="center"
                  prop="GradeA"
                  min-width="65"
                >
                  <template slot-scope="{ row }">
                    <p
                      style="cursor: pointer"
                      @click="getABCDdata('A', iniPara.menu_one)"
                    >
                      {{ row.Step1GradeA }}
                    </p>
                  </template>
                </el-table-column>
                <el-table-column
                  label="B级"
                  align="center"
                  prop="GradeA"
                  min-width="65"
                >
                  <template slot-scope="{ row }">
                    <p
                      style="cursor: pointer"
                      @click="getABCDdata('B', iniPara.menu_one)"
                    >
                      {{ row.Step1GradeB }}
                    </p>
                  </template>
                </el-table-column>
                <el-table-column
                  label="C级"
                  align="center"
                  prop="GradeA"
                  min-width="65"
                >
                  <template slot-scope="{ row }">
                    <p
                      style="cursor: pointer"
                      @click="getABCDdata('C', iniPara.menu_one)"
                    >
                      {{ row.Step1GradeC }}
                    </p>
                  </template>
                </el-table-column>
                <el-table-column
                  label="D级"
                  align="center"
                  prop="GradeA"
                  min-width="65"
                >
                  <template slot-scope="{ row }">
                    <p
                      style="cursor: pointer"
                      @click="getABCDdata('D', iniPara.menu_one)"
                    >
                      {{ row.Step1GradeD }}
                    </p>
                  </template>
                </el-table-column>
                <el-table-column
                  label="E级"
                  align="center"
                  prop="GradeA"
                  min-width="65"
                >
                  <template slot-scope="{ row }">
                    <p
                      style="cursor: pointer"
                      @click="getABCDdata('E', iniPara.menu_one)"
                    >
                      {{ row.Step1GradeE }}
                    </p>
                  </template>
                </el-table-column>
              </el-table-column>

              <el-table-column
                label="主管人员审核"
                align="center"
                prop="GradeA"
              >
                <el-table-column
                  label="A级"
                  prop="GradeB"
                  align="center"
                  min-width="65"
                >
                  <template slot-scope="{ row }">
                    <p
                      style="cursor: pointer"
                      @click="getABCDdata('A', iniPara.menu_two)"
                    >
                      {{ row.Step2GradeA }}
                    </p>
                  </template>
                </el-table-column>
                <el-table-column
                  label="B级"
                  prop="GradeB"
                  align="center"
                  min-width="65"
                >
                  <template slot-scope="{ row }">
                    <p
                      style="cursor: pointer"
                      @click="getABCDdata('B', iniPara.menu_two)"
                    >
                      {{ row.Step2GradeB }}
                    </p>
                  </template>
                </el-table-column>
                <el-table-column
                  label="C级"
                  prop="GradeB"
                  align="center"
                  min-width="65"
                >
                  <template slot-scope="{ row }">
                    <p
                      style="cursor: pointer"
                      @click="getABCDdata('C', iniPara.menu_two)"
                    >
                      {{ row.Step2GradeC }}
                    </p>
                  </template>
                </el-table-column>
                <el-table-column
                  label="D级"
                  prop="GradeB"
                  align="center"
                  min-width="65"
                >
                  <template slot-scope="{ row }">
                    <p
                      style="cursor: pointer"
                      @click="getABCDdata('D', iniPara.menu_two)"
                    >
                      {{ row.Step2GradeB }}
                    </p>
                  </template>
                </el-table-column>
                <el-table-column
                  label="E级"
                  prop="GradeB"
                  align="center"
                  min-width="65"
                >
                  <template slot-scope="{ row }">
                    <p
                      style="cursor: pointer"
                      @click="getABCDdata('E', iniPara.menu_two)"
                    >
                      {{ row.Step2GradeE }}
                    </p>
                  </template>
                </el-table-column>
              </el-table-column>

              <el-table-column
                label="监管人员审核"
                align="center"
                prop="GradeA"
              >
                <el-table-column
                  label="A级"
                  prop="GradeC"
                  align="center"
                  min-width="65"
                >
                  <template slot-scope="{ row }">
                    <p
                      style="cursor: pointer"
                      @click="getABCDdata('A', iniPara.menu_three)"
                    >
                      {{ row.Step3GradeA }}
                    </p>
                  </template>
                </el-table-column>
                <el-table-column
                  label="B级"
                  prop="GradeC"
                  align="center"
                  min-width="65"
                >
                  <template slot-scope="{ row }">
                    <p
                      style="cursor: pointer"
                      @click="getABCDdata('B', iniPara.menu_three)"
                    >
                      {{ row.Step3GradeB }}
                    </p>
                  </template>
                </el-table-column>
                <el-table-column label="C级" align="center" min-width="65">
                  <template slot-scope="{ row }">
                    <p
                      style="cursor: pointer"
                      @click="getABCDdata('C', iniPara.menu_three)"
                    >
                      {{ row.Step3GradeC }}
                    </p>
                  </template>
                </el-table-column>
                <el-table-column label="D级" align="center" min-width="65">
                  <template slot-scope="{ row }">
                    <p
                      style="cursor: pointer"
                      @click="getABCDdata('D', iniPara.menu_three)"
                    >
                      {{ row.Step3GradeD }}
                    </p>
                  </template>
                </el-table-column>
                <el-table-column label="E级" align="center" min-width="65">
                  <template slot-scope="{ row }">
                    <p
                      style="cursor: pointer"
                      @click="getABCDdata('E', iniPara.menu_three)"
                    >
                      {{ row.Step3GradeE }}
                    </p>
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </transition>
      <div
        v-if="activeName === 'PDCA统计'"
        style="display: flex; height: 100%; flex-direction: column"
      >
        <div style="display: flex; height: 100%; flex: 1">
          <div ref="echatsDataPDCA2" style="flex: 1"/>
          <div ref="echatsDataPDCA" style="flex: 1"/>
        </div>
        <div>
          <el-table
            :data="pdcaData1.pdcaListData"
            style="width: 100%; height: 180px !important"
            border
            size="mini"
            class="table_P"
          >
            <el-table-column label="PDCA等级" align="center">
              <template slot-scope="{ row }">
                {{
                  row.ItemName == '自评人员未审核'
                    ? 'P' + ' ( ' + row.ItemName + ' ) '
                    : row.ItemName == '自评人员自通过'
                      ? 'PD' + ' ( ' + row.ItemName + ' ) '
                      : row.ItemName == '主管人员通过'
                        ? 'PDC' + ' ( ' + row.ItemName + ' ) '
                        : 'PDCA' + ' ( ' + row.ItemName + ' ) '
                }}
              </template>
            </el-table-column>
            <el-table-column label="数量" align="center">
              <template slot-scope="{ row }">
                <p
                  style="cursor: pointer"
                  @click="
                    getPDCAdata(
                      row.ItemName == '自评人员未审核'
                        ? row.ItemName
                        : row.ItemName == '自评人员自通过'
                          ? row.ItemName
                          : row.ItemName == '主管人员通过'
                            ? row.ItemName
                            : row.ItemName
                    )
                  "
                >
                  {{ row.Count }}
                </p>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <transition name="el-zoom-in-center">
        <div
          v-if="activeName === '科室部门PDCA统计'"
          style="display: flex; height: 100%; width: 100%"
        >
          <div>
            <el-table
              v-loading="deptPDCALoading"
              border
              size="mini"
              style="width: 100%"
              :data="deptPDCATable"
              height="95%"
              stripe
            >
              <el-table-column
                type="index"
                label="序号"
                align="center"
                width="50"
              />
              <el-table-column prop="DeptName" label="部门名称" width="200"/>
              <el-table-column prop="P" label="P" align="center"/>
              <el-table-column prop="D" label="D" align="center"/>
              <el-table-column prop="C" label="C" align="center"/>
              <el-table-column prop="A" label="A" align="center"/>
            </el-table>
            <el-pagination
              :current-page.sync="deptPDCApagination.pageIndex"
              :page-sizes="[15, 20, 30, 40, 50]"
              :page-size="deptPDCApagination.pageSize"
              layout="sizes, prev, pager, next"
              :total="deptPDCApagination.total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
          <div ref="echatsData2" style="flex: 1"/>
        </div>
      </transition>
    </el-main>
  </el-container>
</template>
<script>
import { GetAlgoPieCharts, SelectPDCAGradeCount } from '@/api/reviewstatic';
import { SelectDeptPDCACount, SelectPDCACount } from '@/api/notice';
import echarts from 'echarts';
import { SelectPeriod } from '@/api/period';
import { SelectZP } from '@/api/catalog';
import { GetCatalogCfgInfo } from '@/api/SMS';

export default {
  data() {
    return {
      checkEvaluateStatus: 1, // 考评配置状态，1为等级制，2为分数制
      TemplateList: '',
      activeName: '等级ABCDE统计',
      pdcaData1: {
        pdcaListData: []
      },
      deptPDCALoading: false,
      deptPDCATable: [],
      deptPDCApagination: {
        pageIndex: 1,
        total: 0,
        pageSize: 20
      },
      formData: {
        valueArr: [],
        value1: '',
        value2: ''
      },
      Abcde: [],
      downloadLoading: false,
      listLoading: false,
      iniPara: ''
    };
  },
  created() {
    this.chaKan();
    this.SelectPDCAGradeCount();
    this.SelectPeriod();

  },
  mounted() {
  },
  methods: {
    // 获取评审考评类型，等级还是分数制
    async chaKan() {
      const { data } = await GetCatalogCfgInfo({});
      this.checkEvaluateStatus = data[0].CurrentStatus;
    },
    async radioGroup(val) {
      if (val === '科室部门PDCA统计') {
        this.SelectDeptPDCACount();
      } else if (val === 'PDCA统计') {
        this.echatsDataPDCA();
      }
    },
    async SelectPDCAGradeCount() {
      try {
        this.deptPDCALoading = true;
        if (this.checkEvaluateStatus === 2) { // 等级制用此接口获取数据
          const { data } = await SelectPDCAGradeCount();
          this.Abcde = [data];
        } else { // 分数制用此接口获取数据
          const { data } = await GetAlgoPieCharts();
          this.Abcde = [data];
        }
        const para = this.$store.getters.iniPara;
        this.iniPara = para;
        const scoreChart = echarts.init(this.$refs.echatsData, 'light');
        this.option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            }
          },
          toolbox: {
            feature: {
              dataView: { show: true, readOnly: false },
              magicType: { show: true, type: ['line', 'bar'] },
              restore: { show: true },
              saveAsImage: { show: true }
            }
          },
          legend: {
            data: ['A', 'B', 'C', 'D', 'E']
          },
          xAxis: [
            {
              type: 'category',
              data: ['自评人员审核', '主管人员审核', '监管人员审核'],
              axisPointer: {
                type: 'shadow'
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '数量',
              axisLabel: {
                formatter: '{value}'
              }
            },
            {
              type: 'value',
              name: '数量',
              axisLabel: {
                formatter: '{value}'
              }
            }
          ],
          series: [
            {
              name: 'A',
              type: 'bar',
              data: [this.Abcde[0].Step1GradeA, this.Abcde[0].Step2GradeA, this.Abcde[0].Step3GradeA]
            },
            {
              name: 'B',
              type: 'bar',
              data: [this.Abcde[0].Step1GradeB, this.Abcde[0].Step2GradeB, this.Abcde[0].Step3GradeB]
            },
            {
              name: 'C',
              type: 'bar',
              data: [this.Abcde[0].Step1GradeC, this.Abcde[0].Step2GradeC, this.Abcde[0].Step3GradeC]
            },
            {
              name: 'D',
              type: 'bar',
              data: [this.Abcde[0].Step1GradeD, this.Abcde[0].Step2GradeD, this.Abcde[0].Step3GradeD]
            },
            {
              name: 'E',
              type: 'bar',
              data: [this.Abcde[0].Step1GradeE, this.Abcde[0].Step2GradeE, this.Abcde[0].Step3GradeE]
            }
          ]
        };
        scoreChart.setOption(this.option);
      } catch (error) {
        console.log(error);
      }
      this.deptPDCALoading = true;
    },
    async SelectDeptPDCACount() {
      this.deptPDCALoading = true;
      try {
        const { data } = await SelectDeptPDCACount(
          this.deptPDCApagination,
          'light'
        );
        this.deptPDCApagination.total = data.Total;
        this.deptPDCATable = data.DataList;
        const echatsData2 = echarts.init(this.$refs.echatsData2);
        const PDCAdataP = [];
        const PDCAdataD = [];
        const PDCAdataC = [];
        const PDCAdataA = [];
        const DeptName = this.deptPDCATable.map((item, index) => {
          PDCAdataP.push(item.P);
          PDCAdataD.push(item.D);
          PDCAdataC.push(item.C);
          PDCAdataA.push(item.A);
          return item.DeptName;
        });
        this.option2 = {
          title: {},
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: ['P', 'D', 'C', 'A']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
          },
          yAxis: {
            type: 'category',
            data: DeptName
          },
          series: [
            {
              name: 'P',
              type: 'bar',
              data: PDCAdataP
            },
            {
              name: 'D',
              type: 'bar',
              data: PDCAdataD
            },
            {
              name: 'C',
              type: 'bar',
              data: PDCAdataC
            },
            {
              name: 'A',
              type: 'bar',
              data: PDCAdataA
            }
          ]
        };
        echatsData2.setOption(this.option2, true);
      } catch (error) {
        console.log(error);
      }
      this.deptPDCALoading = false;
    },
    handleSizeChange(val) {
      this.deptPDCApagination.pageSize = val;
      this.deptPDCApagination.pageIndex = 1;
      this.SelectDeptPDCACount();
    },
    handleCurrentChange(val) {
      this.deptPDCApagination.pageIndex = val;
      this.SelectDeptPDCACount();
    },
    async SelectPeriod() {
      const val = {
        condition: '',
        pageIndex: 1,
        pageSize: 100
      };
      try {
        const { data } = await SelectPeriod(val);
        this.formData.valueArr = data.DataList;
      } catch (error) {
        console.log(error);
      }
    },
    async handleDownload() {
      if (!this.formData.value1 || !this.formData.value2) {
        this.$message.warning('请选择批次');
        return;
      } else if (this.formData.value1 === this.formData.value2) {
        this.$message.warning('批次不能一样');
        return;
      }
      this.downloadLoading = true;
      const listQuery = {
        condition: this.formData.value1,
        condition1: this.formData.value2
      };
      try {
        const excel = await import('@/vendor/Export2Excel');
        const tHeader = [
          '条款代码',
          '首次自评结果',
          '存在的问题',
          '末次自评结果',
          '采取的改进措施'
        ];
        const filterVal = [
          'CatalogCode',
          'Grade',
          'Matter',
          'Grade1',
          'solution'
        ];
        const { data } = await SelectZP(listQuery);
        const formData = this.formatJson(filterVal, data);
        excel.export_json_to_excel({
          header: tHeader,
          data: formData,
          filename: '自评报告'
        });
        this.downloadLoading = false;
      } catch (error) {
        console.error(error);
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(
          j =>
            (v[j] =
              v[j] == null
                ? null
                : String(v[j]).replace(/<br\s*\/?>/gi, '\r\n'))
        )
      );
    },
    async echatsDataPDCA() {
      const { data } = await SelectPDCACount();
      this.pdcaData1.pdcaListData = data;
      const echatsPDCA = echarts.init(this.$refs.echatsDataPDCA, 'light');
      const echatsPDCA2 = echarts.init(this.$refs.echatsDataPDCA2, 'light');
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['PDCA', 'PDC', 'PD', 'P'],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '数量',
            type: 'bar',
            barWidth: '60%',
            data: [data[0].Count, data[1].Count, data[2].Count, data[3].Count]
          }
        ]
      };
      const option2 = {
        title: {
          text: 'PDCA统计',
          subtext: '',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '数量',
            type: 'pie',
            radius: '50%',
            data: [
              { value: data[0].Count, name: 'P' },
              { value: data[1].Count, name: 'PD' },
              { value: data[2].Count, name: 'PDC' },
              { value: data[3].Count, name: 'PDCA' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      echatsPDCA.setOption(option, true);
      echatsPDCA2.setOption(option2, true);
    },
    getABCDdata(Grade, type) {
      if (type === this.iniPara.menu_one) {
        this.$router.push({
          name: 'EvaluationOne',
          params: { Grade: Grade }
        });
      } else if (type === this.iniPara.menu_two) {
        this.$router.push({
          name: 'EvaluationTwo',
          params: { Grade: Grade }
        });
      } else if (type === this.iniPara.menu_three) {
        this.$router.push({
          name: 'EvaluationThree',
          params: { Grade: Grade }
        });
      }
    },
    getPDCAdata(ItemName) {
      if (ItemName === '自评人员未审核') {
        this.$router.push({
          name: 'EvaluationOne',
          params: { CurrentStatus: '0' }
        });
      } else if (ItemName === '自评人员自通过') {
        this.$router.push({
          name: 'EvaluationOne',
          params: { CurrentStatus: '1' }
        });
      } else if (ItemName === '主管人员通过') {
        this.$router.push({
          name: 'EvaluationTwo',
          params: { CurrentStatus: '1' }
        });
      } else if (ItemName === '主管人员通过') {
        this.$router.push({
          name: 'EvaluationTwo',
          params: { CurrentStatus: '2' }
        });
      }
    }
  }
};
</script>

<style lang="scss">
.reviewstatic {
  .el-header,
  .el-main {
    margin: 0;
    padding: 0;
  }

  .el-header {
    height: 35px !important;
  }

  .el-main {
    height: calc(100vh - 160px);
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
