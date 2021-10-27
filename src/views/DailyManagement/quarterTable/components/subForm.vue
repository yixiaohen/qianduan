<template>
  <el-container>
    <el-main>
      <div>
        <div>
          <el-collapse v-model="activeName" accordion>
            <el-collapse-item title="1、院内科室自查表" name="1">
              <el-table
                v-loading="listLoading"
                :data="formLabelAlign.tableDatas.table1"
                stripe
                style="width: 100%"
                size="mini"
                max-height="300px"
              >
                <el-table-column label="1、院内科室自查表" align="center">
                  <el-table-column
                    label="检查时间"
                    align="center"
                    min-width="180"
                  >
                    <template slot-scope="{ row }">
                      <el-date-picker
                        v-model="row.CheckTime"
                        type="date"
                        placeholder="选择日期"
                        format="yyyy 年 MM 月 dd 日"
                        size="mini"
                        style="width: 155px"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="year"
                    label="患者姓名"
                    align="center"
                    min-width="100"
                  >
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.PatientName"
                        placeholder="患者姓名"
                        size="mini"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="住院号"
                    align="center"
                    min-width="100"
                  >
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.HospitalNumber"
                        placeholder="住院号"
                        size="mini"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="会诊单是否规范"
                    align="center"
                    min-width="130"
                  >
                    <template slot-scope="{ row }">
                      <el-radio v-model="row.ConsultationForm" label="是">
                        是
                      </el-radio>
                      <el-radio
                        v-model="row.ConsultationForm"
                        label="否"
                      >否</el-radio>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="quarter"
                    label="被邀科室"
                    align="center"
                    min-width="110"
                  >
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.InvitedDepartment"
                        placeholder="被邀科室"
                        size="mini"
                        type="textarea"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="quarter"
                    label="会诊人员资质是否符合"
                    align="center"
                    min-width="145"
                  >
                    <template slot-scope="{ row }">
                      <el-radio
                        v-model="row.Qualification"
                        label="是"
                      >是</el-radio>
                      <el-radio
                        v-model="row.Qualification"
                        label="否"
                      >否</el-radio>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="quarter"
                    label="会诊有无超时"
                    align="center"
                    min-width="110"
                  >
                    <template slot-scope="{ row }">
                      <el-radio v-model="row.TimeOut" label="有">有</el-radio>
                      <el-radio v-model="row.TimeOut" label="无">无</el-radio>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="quarter"
                    label="病程记录是否规范"
                    align="center"
                    min-width="120"
                  >
                    <template slot-scope="{ row }">
                      <el-radio
                        v-model="row.CourseRecord"
                        label="是"
                      >是</el-radio>
                      <el-radio
                        v-model="row.CourseRecord"
                        label="否"
                      >否</el-radio>
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column
                  prop="quarter"
                  label="院内会诊科室自查持续改进记录表"
                  align="center"
                >
                  <el-table-column
                    label="科室自查人员"
                    align="center"
                    min-width="100"
                  >
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.DeptSelfUser"
                        placeholder="科室自查人员"
                        size="mini"
                        type="textarea"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="year"
                    label="监管部门"
                    align="center"
                    min-width="100"
                  >
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.SupervisionDept"
                        placeholder="监管部门"
                        type="textarea"
                        size="mini"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="存在问题"
                    align="center"
                    min-width="100"
                  >
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.Problem"
                        placeholder="存在问题"
                        type="textarea"
                        size="mini"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="科室持续改进记录"
                    align="center"
                    min-width="150"
                  >
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.ImprovementRecord"
                        placeholder="科室持续改进记录"
                        type="textarea"
                        size="mini"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="quarter"
                    label="改进监督者"
                    align="center"
                    min-width="110"
                  >
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.SupervisorUser"
                        placeholder="改进监督者"
                        type="textarea"
                        size="mini"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="效果反馈及日期"
                    align="center"
                    min-width="120"
                  >
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.Feedback"
                        placeholder="改进监督者"
                        type="textarea"
                        size="mini"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column align="center" width="40">
                    <template slot-scope="{ $index }">
                      <i
                        class="el-icon-delete"
                        style="cursor: pointer"
                        @click="deleteTableData(1, $index)"
                      /></template>
                  </el-table-column>
                </el-table-column>
              </el-table>
              <div>
                <el-button
                  type="text"
                  icon="el-icon-plus"
                  @click="addTableData(1)"
                >
                  添加一行
                </el-button>
              </div>
            </el-collapse-item>
            <el-collapse-item title="2、MDT讨论病例自查表" name="2">
              <el-table
                v-loading="listLoading"
                :data="formLabelAlign.tableDatas.table2"
                stripe
                style="width: 100%"
                size="mini"
                max-height="300px"
              >
                <el-table-column label="MDT讨论病例自查表" align="center">
                  <el-table-column
                    label="检查时间"
                    align="center"
                    min-width="180"
                  >
                    <template slot-scope="{ row }">
                      <el-date-picker
                        v-model="row.CheckTime"
                        type="date"
                        placeholder="检查时间"
                        format="yyyy 年 MM 月 dd 日"
                        size="mini"
                        style="width: 155px"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="year"
                    label="患者姓名"
                    align="center"
                    min-width="100"
                  >
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.PatientName"
                        placeholder="患者姓名"
                        size="mini"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="住院号"
                    align="center"
                    min-width="100"
                  >
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.HospitalNumber"
                        placeholder="住院号"
                        size="mini"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column label="诊断" align="center" min-width="100">
                    <template slot-scope="{ row }">
                      <el-input
                        v-model="row.Diagnosis"
                        placeholder="诊断"
                        clearable
                        size="mini"
                        type="textarea"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="quarter"
                    label="随访"
                    align="center"
                    min-width="130"
                  >
                    <template slot-scope="{ row }">
                      <el-radio v-model="row.FollowUp" label="是">是</el-radio>
                      <el-radio v-model="row.FollowUp" label="否">否</el-radio>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="根据讨论结果诊疗"
                    align="center"
                    min-width="130"
                  >
                    <template slot-scope="{ row }">
                      <el-radio
                        v-model="row.DiagnosisTreatment"
                        label="是"
                      >是</el-radio>
                      <el-radio
                        v-model="row.DiagnosisTreatment"
                        label="否"
                      >否</el-radio>``
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="疗效评价"
                    align="center"
                    min-width="120"
                  >
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.EfficacyEvaluation"
                        placeholder="疗效评价"
                        type="textarea"
                        size="mini"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="检查者"
                    align="center"
                    min-width="120"
                  >
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.CheckUser"
                        placeholder="检查者"
                        type="textarea"
                        size="mini"
                      />
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column
                  label="MDT讨论病例自查持续改进记录表"
                  align="center"
                >
                  <el-table-column
                    label="科室自查人员"
                    align="center"
                    min-width="100"
                  >
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.DeptSelfUser"
                        placeholder="科室自查人员"
                        size="mini"
                        type="textarea"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="存在问题"
                    align="center"
                    min-width="100"
                  >
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.Problem"
                        placeholder="存在问题"
                        type="textarea"
                        size="mini"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="科室持续改进记录"
                    align="center"
                    min-width="120"
                  >
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.ImprovementRecord"
                        placeholder="科室持续改进记录"
                        type="textarea"
                        size="mini"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="quarter"
                    label="改进监督者"
                    align="center"
                    min-width="120"
                  >
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.SupervisorUser"
                        placeholder="改进监督者"
                        type="textarea"
                        size="mini"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="效果反馈及日期"
                    align="center"
                    min-width="120"
                  >
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.Feedback"
                        placeholder="效果反馈及日期"
                        type="textarea"
                        size="mini"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column align="center" width="40">
                    <template slot-scope="{ $index }">
                      <i
                        class="el-icon-delete"
                        style="cursor: pointer"
                        @click="deleteTableData(2, $index)"
                      /></template>
                  </el-table-column>
                </el-table-column>
              </el-table>
              <div>
                <el-button
                  type="text"
                  icon="el-icon-plus"
                  @click="addTableData(2)"
                >
                  添加一行
                </el-button>
              </div>
            </el-collapse-item>
            <el-collapse-item title="3、科室药品管理相关指标自查表" name="3">
              <el-form
                label-position="top"
                label-width="150px"
                :model="formLabelAlign.tableDatas.table3"
                size="mini"
              >
                <el-form-item label="出院人次">
                  <el-input
                    v-model="formLabelAlign.tableDatas.table3.DischargedNum"
                    style="width: 200px"
                  />
                </el-form-item>
                <el-form-item label="使用抗菌药物人次">
                  <el-input
                    v-model="formLabelAlign.tableDatas.table3.AntibacterialNum"
                    style="width: 200px"
                  />
                </el-form-item>
                <el-form-item label="抗菌药物使用比例">
                  <el-input
                    v-model="
                      formLabelAlign.tableDatas.table3.AntibacterialProportion
                    "
                    style="width: 200px"
                  />
                </el-form-item>

                <el-form-item label="是否达标" style="width: 200px">
                  <el-radio
                    v-model="formLabelAlign.tableDatas.table3.UpStandard"
                    label="是"
                  >是</el-radio>
                  <el-radio
                    v-model="formLabelAlign.tableDatas.table3.UpStandard"
                    label="否"
                  >否</el-radio>
                </el-form-item>
              </el-form>
            </el-collapse-item>
            <el-collapse-item
              title="4、（外科）重大疑难手术审批自查表"
              name="4"
            >
              <el-table
                v-loading="listLoading"
                :data="formLabelAlign.tableDatas.table4"
                stripe
                style="width: 100%"
                size="mini"
                max-height="300px"
              >
                <el-table-column
                  label="（外科）重大疑难手术审批自查表"
                  align="center"
                >
                  <el-table-column label="住院号" align="center">
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.HospitalNumber"
                        placeholder="住院号"
                        size="mini"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column label="手术名称" align="center">
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.SurgeryName"
                        placeholder="手术名称"
                        type="textarea"
                        size="mini"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column label="有无审批" align="center">
                    <template slot-scope="{ row }">
                      <el-radio v-model="row.Approve" label="有">有</el-radio>
                      <el-radio v-model="row.Approve" label="无">无</el-radio>
                    </template>
                  </el-table-column>
                  <el-table-column label="备注" align="center">
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.Remark"
                        placeholder="备注"
                        type="textarea"
                        size="mini"
                      />
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column
                  label="重大疑难手术审批自查持续改进记录表"
                  align="center"
                >
                  <el-table-column
                    label="检查时间"
                    align="center"
                    min-width="100"
                  >
                    <template slot-scope="{ row }">
                      <el-date-picker
                        v-model="row.CheckTime"
                        type="date"
                        placeholder="选择日期"
                        format="yyyy 年 MM 月 dd 日"
                        size="mini"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column label="科室自查人员" align="center">
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.DeptSelfUser"
                        placeholder="科室自查人员"
                        type="textarea"
                        size="mini"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column label="存在问题" align="center">
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.Problem"
                        placeholder="存在问题"
                        type="textarea"
                        size="mini"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column label="科室持续改进记录" align="center">
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.ImprovementRecord"
                        placeholder="科室持续改进记录"
                        type="textarea"
                        size="mini"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="quarter"
                    label="改进监督者"
                    align="center"
                  >
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.SupervisorUser"
                        placeholder="改进监督者"
                        type="textarea"
                        size="mini"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="quarter"
                    label="效果反馈及日期"
                    align="center"
                  >
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.Feedback"
                        placeholder="效果反馈及日期"
                        type="textarea"
                        size="mini"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column align="center" width="40">
                    <template slot-scope="{ $index }">
                      <i
                        class="el-icon-delete"
                        style="cursor: pointer"
                        @click="deleteTableData(4, $index)"
                      /></template>
                  </el-table-column>
                </el-table-column>
              </el-table>
              <div>
                <el-button
                  type="text"
                  icon="el-icon-plus"
                  @click="addTableData(4)"
                >
                  添加一行
                </el-button>
              </div>
            </el-collapse-item>
            <el-collapse-item title="5、科室危急值制度执行情况自查表" name="5">
              <div
                v-for="(item5, index5) in formLabelAlign.tableDatas.table5"
                :key="index5"
              >
                <div class="table_item_header">
                  <div>
                    <p>科室危急值制度执行情况自查表{{ index5 + 1 }}</p>
                  </div>
                  <div>
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      circle
                      size="mini"
                      @click="deleteTableData(5, index5)"
                    />
                  </div>
                </div>

                <el-form
                  :inline="true"
                  class="demo-form-inline"
                  label-position="top"
                  size="mini"
                >
                  <el-form-item label="检查时间">
                    <el-date-picker
                      v-model="item5.CriticalValueCheckTime"
                      type="date"
                      placeholder="选择日期"
                      format="yyyy 年 MM 月 dd 日"
                      size="mini"
                      style="width: 180px"
                    />
                  </el-form-item>
                  <el-form-item label="督察人">
                    <el-input
                      v-model.trim="item5.CheckUser"
                      placeholder="督察人"
                      clearable
                      size="mini"
                    />
                  </el-form-item>
                  <el-form-item label="报告科室">
                    <el-input
                      v-model.trim="item5.ReportDept"
                      placeholder="报告科室"
                      clearable
                      size="mini"
                    />
                  </el-form-item>
                  <el-form-item label="接到报告时间">
                    <el-date-picker
                      v-model="item5.ReportDate"
                      type="date"
                      placeholder="接到报告时间"
                      format="yyyy 年 MM 月 dd 日"
                      size="mini"
                      style="width: 180px"
                    />
                  </el-form-item>
                  <el-form-item label="患者姓名">
                    <el-input
                      v-model.trim="item5.PatientName"
                      placeholder="患者姓名"
                      clearable
                      size="mini"
                    />
                  </el-form-item>
                  <el-form-item label="住院号">
                    <el-input
                      v-model.trim="item5.HospitalNumber"
                      placeholder="住院号"
                      clearable
                      size="mini"
                    />
                  </el-form-item>
                  <el-form-item label="处置医师">
                    <el-input
                      v-model.trim="item5.DisposalPhysician"
                      placeholder="处置医师"
                      clearable
                      size="mini"
                    />
                  </el-form-item>
                  <el-form-item label="危急值项目及内容">
                    <el-input
                      v-model.trim="item5.CriticalValue"
                      placeholder="危急值项目及内容"
                      clearable
                      size="mini"
                    />
                  </el-form-item>

                  <el-form-item label="OA危急值登记本是否登记:">
                    <el-radio v-model="item5.Register" label="有">有</el-radio>
                    <el-radio v-model="item5.Register" label="无">无</el-radio>
                    <el-radio
                      v-model="item5.isYes"
                      label="不适用"
                    >不适用</el-radio>
                  </el-form-item>
                  <el-form-item label="登记项目完善:">
                    <el-radio v-model="item5.Perfect" label="有">有</el-radio>
                    <el-radio v-model="item5.Perfect" label="无">无</el-radio>
                    <el-radio
                      v-model="item5.Perfect"
                      label="不适用"
                    >不适用</el-radio>
                  </el-form-item>
                  <el-form-item label="20分钟内处置:">
                    <el-radio v-model="item5.Dispose" label="有">有</el-radio>
                    <el-radio v-model="item5.Dispose" label="无">无</el-radio>
                  </el-form-item>
                  <el-form-item label="处置正确合理:">
                    <el-radio
                      v-model="item5.ReasonableDisposal"
                      label="有"
                    >有</el-radio>
                    <el-radio
                      v-model="item5.ReasonableDisposal"
                      label="无"
                    >无</el-radio>
                  </el-form-item>
                  <el-form-item label="按要求及时记录:">
                    <el-radio
                      v-model="item5.TimelyRecord"
                      label="有"
                    >有</el-radio>
                    <el-radio
                      v-model="item5.TimelyRecord"
                      label="无"
                    >无</el-radio>
                  </el-form-item>
                </el-form>
                <el-table
                  v-loading="listLoading"
                  :data="[item5]"
                  stripe
                  style="width: 100%"
                  size="mini"
                >
                  <el-table-column
                    label="科室危急值制度执行情况自查持续改进记录表"
                    align="center"
                  >
                    <el-table-column
                      label="检查时间"
                      align="center"
                      width="180"
                    >
                      <el-date-picker
                        v-model="item5.CheckTime"
                        type="date"
                        placeholder="检查时间"
                        format="yyyy 年 MM 月 dd 日"
                        size="mini"
                        style="width: 154px"
                      />
                    </el-table-column>
                    <el-table-column
                      label="科室自查人员"
                      align="center"
                      width="200"
                    >
                      <el-input
                        v-model.trim="item5.DeptSelfUser"
                        placeholder="患者姓名"
                        clearable
                        size="mini"
                      />
                    </el-table-column>
                    <el-table-column
                      label="存在问题"
                      align="center"
                      min-width="200"
                    >
                      <el-input
                        v-model.trim="item5.Problem"
                        placeholder="存在问题"
                        clearable
                        size="mini"
                        type="textarea"
                      />
                    </el-table-column>
                    <el-table-column
                      label="科室持续改进记录"
                      align="center"
                      min-width="200"
                    >
                      <el-input
                        v-model.trim="item5.ImprovementRecord"
                        placeholder="科室持续改进记录"
                        type="textarea"
                        size="mini"
                      />
                    </el-table-column>
                    <el-table-column
                      label="改进监督者"
                      align="center"
                      min-width="200"
                    >
                      <el-input
                        v-model.trim="item5.SupervisorUser"
                        placeholder="改进监督者"
                        type="textarea"
                        size="mini"
                      />
                    </el-table-column>
                    <el-table-column
                      label="效果反馈及日期"
                      align="center"
                      min-width="200"
                    >
                      <el-input
                        v-model.trim="item5.Feedback"
                        placeholder="效果反馈及日期"
                        type="textarea"
                        size="mini"
                      />
                    </el-table-column>
                  </el-table-column>
                </el-table>
                <el-divider />
              </div>
              <div>
                <el-button
                  type="text"
                  icon="el-icon-plus"
                  @click="addTableData(5)"
                >
                  添加一行
                </el-button>
              </div>
            </el-collapse-item>
            <el-collapse-item
              title="6、科室医务人员技术权限执行情况自查表"
              name="6"
            >
              <el-table
                v-loading="listLoading"
                :data="formLabelAlign.tableDatas.table6"
                stripe
                style="width: 100%"
                size="mini"
              >
                <el-table-column label="住院号" align="center">
                  <template slot-scope="{ row }">
                    <el-input
                      v-model.trim="row.HospitalNumber"
                      placeholder="住院号"
                      maxlength="100"
                      show-word-limit
                      clearable
                      size="mini"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="患者姓名" align="center">
                  <template slot-scope="{ row }">
                    <el-input
                      v-model.trim="row.PatientName"
                      placeholder="患者姓名"
                      maxlength="100"
                      show-word-limit
                      clearable
                      size="mini"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  label="手术级别/高危诊疗操作/新技术新项目"
                  align="center"
                >
                  <template slot-scope="{ row }">
                    <el-input
                      v-model.trim="row.SurgicalGrade"
                      placeholder="手术级别/高危诊疗操作/新技术新项目"
                      clearable
                      size="mini"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="手术主刀/操作者" align="center">
                  <template slot-scope="{ row }">
                    <el-input
                      v-model.trim="row.SurgicalOperator"
                      placeholder="手术主刀/操作者"
                      clearable
                      size="mini"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="是否符合权限" align="center">
                  <template slot-scope="{ row }">
                    <el-radio v-model="row.Authority" label="是">是</el-radio>
                    <el-radio v-model="row.Authority" label="否">否</el-radio>
                  </template>
                </el-table-column>
                <el-table-column
                  width="100"
                  align="center"
                ><template slot-scope="{ $index }">
                  <i
                    class="el-icon-delete"
                    style="cursor: pointer"
                    @click="deleteTableData(6, $index)"
                  /></template>
                </el-table-column>
              </el-table>
              <div>
                <el-button
                  type="text"
                  icon="el-icon-plus"
                  @click="addTableData(6)"
                >
                  添加一行
                </el-button>
              </div>
            </el-collapse-item>
            <el-collapse-item title="7、科室抗菌药物预防应用自查表" name="7">
              <div
                v-for="(item7, index7) in formLabelAlign.tableDatas.table7"
                :key="index7"
              >
                <div class="table_item_header">
                  <div>
                    <p>科室抗菌药物预防应用自查表{{ index7 + 1 }}</p>
                  </div>
                  <div>
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      circle
                      size="mini"
                      @click="deleteTableData(7, index7)"
                    />
                  </div>
                </div>
                <el-form
                  :inline="true"
                  class="demo-form-inline"
                  label-width="100px"
                  size="mini"
                >
                  <el-form-item label="住院号">
                    <el-input
                      v-model.trim="item7.HospitalNumber"
                      placeholder="住院号"
                      clearable
                      size="mini"
                      style="width: 150px"
                    />
                  </el-form-item>
                  <el-form-item label="主刀医生">
                    <el-input
                      v-model.trim="item7.DisposalPhysician"
                      placeholder="主刀医生"
                      clearable
                      size="mini"
                      style="width: 150px"
                    />
                  </el-form-item>
                  <el-form-item label="切口类型">
                    <el-input
                      v-model.trim="item7.IncisionType"
                      placeholder="切口类型"
                      clearable
                      size="mini"
                      style="width: 150px"
                    />
                  </el-form-item>

                  <el-form-item label="有无预防使用抗菌药物">
                    <el-radio
                      v-model="item7.Prevention"
                      label="有"
                    >有</el-radio>
                    <el-radio
                      v-model="item7.Prevention"
                      label="无"
                    >无</el-radio>
                  </el-form-item>
                  <el-form-item label="药物名称">
                    <el-input
                      v-model.trim="item7.DrugName"
                      placeholder="药物名称"
                      clearable
                      size="mini"
                      style="width: 150px"
                    />
                  </el-form-item>
                  <el-form-item label="预防使用时">
                    <el-date-picker
                      v-model="item7.UseDate"
                      type="date"
                      placeholder="预防使用时"
                      format="yyyy 年 MM 月 dd 日"
                      size="mini"
                      style="width: 150px"
                    />
                  </el-form-item>
                  <el-form-item label="手术开始时间">
                    <el-date-picker
                      v-model="item7.SurgicalStartDate"
                      type="date"
                      placeholder="手术开始时间"
                      format="yyyy 年 MM 月 dd 日"
                      size="mini"
                      style="width: 150px"
                    />
                  </el-form-item>
                  <el-form-item label="有无使用指征">
                    <el-radio
                      v-model="item7.Indication"
                      label="有"
                    >有</el-radio>
                    <el-radio
                      v-model="item7.Indication"
                      label="无"
                    >无</el-radio>
                  </el-form-item>
                  <el-form-item label="预防用药选择是否正确">
                    <el-radio v-model="item7.Choose" label="是">是</el-radio>
                    <el-radio v-model="item7.Choose" label="否">否</el-radio>
                  </el-form-item>
                  <el-form-item label="预防用药时机是否正确">
                    <el-radio
                      v-model="item7.Opportunity"
                      label="是"
                    >是</el-radio>
                    <el-radio
                      v-model="item7.Opportunity"
                      label="否"
                    >否</el-radio>
                  </el-form-item>
                </el-form>
                <el-table
                  v-loading="listLoading"
                  :data="[item7]"
                  stripe
                  style="width: 100%"
                  size="mini"
                >
                  <el-table-column
                    label="科室抗菌药物预防应用自查持续改进记录表"
                    align="center"
                    min-width="100"
                  >
                    <el-table-column
                      label="检查时间"
                      align="center"
                      min-width="100"
                    >
                      <template>
                        <el-date-picker
                          v-model="item7.CheckTime"
                          type="date"
                          placeholder="选择日期"
                          format="yyyy 年 MM 月 dd 日"
                          size="mini"
                        />
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="科室自查人员"
                      align="center"
                      min-width="100"
                    >
                      <template>
                        <el-input
                          v-model.trim="item7.DeptSelfUser"
                          placeholder="科室自查人员"
                          clearable
                          size="mini"
                        />
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="存在问题"
                      align="center"
                      min-width="100"
                    >
                      <template>
                        <el-input
                          v-model.trim="item7.Problem"
                          placeholder="存在问题"
                          clearable
                          size="mini"
                        />
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="科室持续改进记录"
                      align="center"
                      min-width="100"
                    >
                      <template>
                        <el-input
                          v-model.trim="item7.ImprovementRecord"
                          placeholder="科室持续改进记录"
                          clearable
                          size="mini"
                        />
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="改进监督者"
                      align="center"
                      min-width="100"
                    >
                      <template>
                        <el-input
                          v-model.trim="item7.SupervisorUser"
                          placeholder="改进监督者"
                          clearable
                          size="mini"
                        />
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="效果反馈及日期"
                      align="center"
                      min-width="100"
                    >
                      <template>
                        <el-input
                          v-model.trim="item7.Feedback"
                          placeholder="效果反馈及日期"
                          clearable
                          size="mini"
                        />
                      </template>
                    </el-table-column>
                  </el-table-column>
                </el-table>
                <el-divider />
              </div>
              <div>
                <el-button
                  type="text"
                  icon="el-icon-plus"
                  @click="addTableData(7)"
                >
                  添加一行
                </el-button>
              </div>
            </el-collapse-item>
            <el-collapse-item title="8、国家基本药物使用自查表" name="8">
              <el-table
                v-loading="listLoading"
                :data="formLabelAlign.tableDatas.table8"
                stripe
                style="width: 100%"
                size="mini"
              >
                <el-table-column label="国家基本药物使用自查表" align="center">
                  <el-table-column
                    label="基本药物金额比例（科室目标)"
                    align="center"
                  >
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.TargetMoneyProportion"
                        placeholder="基本药物金额比例（科室目标)"
                        size="mini"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column label="国家基本药物使用金额" align="center">
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.BasicMoney"
                        placeholder="国家基本药物使用金额"
                        size="mini"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column label="药品使用总金额" align="center">
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.TotalMoney"
                        placeholder="药品使用总金额"
                        size="mini"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column label="基本药物金额比例" align="center">
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.MoneyProportion"
                        placeholder="基本药物金额比例"
                        size="mini"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="quarter"
                    label="是否达标"
                    align="center"
                  >
                    <template slot-scope="{ row }">
                      <el-radio
                        v-model="row.UpStandard"
                        label="是"
                      >是</el-radio>
                      <el-radio
                        v-model="row.UpStandard"
                        label="否"
                      >否</el-radio>
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column
                  label="国家基本药物使用自查持续改进记录表"
                  align="center"
                >
                  <el-table-column
                    label="检查时间"
                    align="center"
                    min-width="160"
                  >
                    <template slot-scope="{ row }">
                      <el-date-picker
                        v-model="row.CheckTime"
                        type="date"
                        placeholder="检查时间"
                        format="yyyy 年 MM 月 dd 日"
                        size="mini"
                        style="width: 160px"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="year"
                    label="科室自查人员"
                    align="center"
                  >
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.DeptSelfUser"
                        placeholder="科室自查人员"
                        size="mini"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column prop="year" label="存在问题" align="center">
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.Problem"
                        placeholder="存在问题"
                        size="mini"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="year"
                    label="科室持续改进记录"
                    align="center"
                  >
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.ImprovementRecord"
                        placeholder="科室持续改进记录"
                        size="mini"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="year"
                    label="改进监督者"
                    align="center"
                  >
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.SupervisorUser"
                        placeholder="改进监督者"
                        size="mini"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="year"
                    label="效果反馈及日期"
                    align="center"
                  >
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.Feedback"
                        placeholder="效果反馈及日期"
                        size="mini"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    width="40"
                    align="center"
                  ><template slot-scope="{ $index }">
                    <i
                      class="el-icon-delete"
                      style="cursor: pointer"
                      @click="deleteTableData(8, $index)"
                    /></template>
                  </el-table-column>
                </el-table-column>
              </el-table>
              <div>
                <el-button
                  type="text"
                  icon="el-icon-plus"
                  @click="addTableData(8)"
                >
                  添加一行
                </el-button>
              </div>
            </el-collapse-item>
            <el-collapse-item title="9、诊疗指南与技术操作规范自查表" name="9">
              <el-table
                v-loading="listLoading"
                :data="formLabelAlign.tableDatas.table9"
                stripe
                style="width: 100%"
                size="mini"
              >
                <el-table-column
                  label="诊疗指南与技术操作规范自查表"
                  align="center"
                >
                  <el-table-column label="病历号" align="center" width="100px">
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.MedicalRecordNumber"
                        placeholder="病历号"
                        size="mini"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="检查结果"
                    align="center"
                    width="100px"
                  >
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.CheckResult"
                        placeholder="检查结果"
                        size="mini"
                        type="textarea"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="具体问题"
                    align="center"
                    width="100px"
                  >
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.SpecificProblem"
                        placeholder="具体问题"
                        width="120px"
                        size="mini"
                        type="textarea"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="诊疗指南是否及时更新"
                    align="center"
                    width="145px"
                  >
                    <template slot-scope="{ row }">
                      <el-radio v-model="row.Renew" label="是">是</el-radio>
                      <el-radio v-model="row.Renew" label="否">否</el-radio>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="科室内是否组织诊疗指南与技术操作规范的培训"
                    align="center"
                    width="275px"
                  >
                    <template slot-scope="{ row }">
                      <el-radio
                        v-model="row.OrganizeTraining"
                        label="是"
                      >是</el-radio>
                      <el-radio
                        v-model="row.OrganizeTraining"
                        label="否"
                      >否</el-radio>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="科室内是否组织诊疗指南与技术操作规范的考核"
                    align="center"
                    width="275px"
                  >
                    <template slot-scope="{ row }">
                      <el-radio
                        v-model="row.Assessment"
                        label="是"
                      >是</el-radio>
                      <el-radio
                        v-model="row.Assessment"
                        label="否"
                      >否</el-radio>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="培训资料是否齐全（培训签到表，现场照片，培训课件，培训考核成绩等）"
                    align="center"
                    width="275px"
                  >
                    <template slot-scope="{ row }">
                      <el-radio
                        v-model="row.CompleteInformation"
                        label="是"
                      >是</el-radio>
                      <el-radio
                        v-model="row.CompleteInformation"
                        label="否"
                      >否</el-radio>
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column
                  label="诊疗指南与技术操作规范自查持续改进记录表"
                  align="center"
                >
                  <el-table-column
                    label="检查时间"
                    align="center"
                    width="175px"
                  >
                    <template slot-scope="{ row }">
                      <el-date-picker
                        v-model="row.CheckTime"
                        type="date"
                        placeholder="选择日期"
                        format="yyyy 年 MM 月 dd 日"
                        size="mini"
                        style="width: 155px"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="科室自查人员"
                    align="center"
                    width="100px"
                  >
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.DeptSelfUser"
                        placeholder="科室自查人员"
                        clearable
                        size="mini"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="存在问题"
                    align="center"
                    width="100px"
                  >
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.Problem"
                        placeholder="存在问题"
                        clearable
                        size="mini"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="科室持续改进记录"
                    align="center"
                    width="130px"
                  >
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.ImprovementRecord"
                        placeholder="科室持续改进记录"
                        clearable
                        size="mini"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="quarter"
                    label="改进监督者"
                    align="center"
                    width="120px"
                  >
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.SupervisorUser"
                        placeholder="改进监督者"
                        clearable
                        size="mini"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="quarter"
                    label="效果反馈及日期"
                    align="center"
                    width="120px"
                  >
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.Feedback"
                        placeholder="效果反馈及日期"
                        clearable
                        size="mini"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    width="40"
                    align="center"
                  ><template slot-scope="{ $index }">
                    <i
                      class="el-icon-delete"
                      style="cursor: pointer"
                      @click="deleteTableData(9, $index)"
                    /></template>
                  </el-table-column>
                </el-table-column>
              </el-table>
              <div>
                <el-button
                  type="text"
                  icon="el-icon-plus"
                  @click="addTableData(9)"
                >
                  添加一行
                </el-button>
              </div>
            </el-collapse-item>
            <el-collapse-item
              title="10、季度运行病历书写质控总结记录"
              name="10"
            >
              <el-table
                v-loading="listLoading"
                :data="formLabelAlign.tableDatas.table10"
                stripe
                style="width: 100%"
                size="mini"
              >
                <el-table-column label="本季度运行病历份数" align="center">
                  <template slot-scope="{ row }">
                    <el-input
                      v-model.trim="row.QuarterlyMedicalRecord"
                      placeholder="本季度运行病历份数"
                      size="mini"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="检查运行病历份数" align="center">
                  <template slot-scope="{ row }">
                    <el-input
                      v-model.trim="row.CheckMedicalRecord"
                      placeholder="检查运行病历份数"
                      size="mini"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="有问题的病历份数" align="center">
                  <template slot-scope="{ row }">
                    <el-input
                      v-model.trim="row.ProblemMedicalRecord"
                      placeholder="有问题的病历份数"
                      size="mini"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  label="季度运行病历书写质控总结存在问题归类"
                  align="center"
                >
                  <el-table-column label="项目填写不全" align="center">
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.Incomplete"
                        type="textarea"
                        placeholder="项目填写不全"
                        size="mini"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="记录时限不符合要求"
                    align="center"
                  ><template slot-scope="{ row }">
                    <el-input
                      v-model.trim="row.RecordTimeLimit"
                      type="textarea"
                      placeholder="记录时限不符合要求"
                      size="mini"
                    /> </template></el-table-column>
                  <el-table-column
                    label="医师或术者未及时签字"
                    align="center"
                  ><template slot-scope="{ row }">
                    <el-input
                      v-model.trim="row.UnsignedTime"
                      type="textarea"
                      placeholder="医师或术者未及时签字"
                      size="mini"
                    /> </template></el-table-column>
                  <el-table-column
                    label="病程记录不符合要求"
                    align="center"
                  ><template slot-scope="{ row }">
                    <el-input
                      v-model.trim="row.CourseRecordClaim"
                      type="textarea"
                      placeholder="病程记录不符合要求"
                      size="mini"
                    /> </template></el-table-column>
                  <el-table-column
                    label="其他质量缺陷"
                    align="center"
                  ><template slot-scope="{ row }">
                    <el-input
                      v-model.trim="row.OtherQuality"
                      type="textarea"
                      placeholder="其他质量缺陷"
                      size="mini"
                    /> </template></el-table-column>
                </el-table-column>
                <el-table-column label="根本原因分析" min-width="180px">
                  <template slot-scope="{ row }">
                    <el-checkbox-group v-model="row.CauseAnalysis">
                      <el-checkbox
                        label="1、医师未能准确把握各项病历书写的时效性要求,"
                      />
                      <el-checkbox label="2、三级查房制度未贯彻落实," />
                      <el-checkbox label="3、值班交接班制度未贯彻落实," />
                      <el-checkbox label="4、危急值管理制度未贯彻落实," />
                      <el-checkbox label="5、围手术期相关制度未贯彻落实," />
                      <el-checkbox label="6、医护记录不一致," />
                      <el-checkbox label="7、未履行充分告知义务," />
                      <el-checkbox label="8、急危重症抢救制度未贯彻落实," />
                      <el-checkbox label="9、其他原因," />
                    </el-checkbox-group>
                  </template>
                </el-table-column>
                <el-table-column
                  width="40"
                  align="center"
                ><template slot-scope="{ $index }">
                  <i
                    class="el-icon-delete"
                    style="cursor: pointer"
                    @click="deleteTableData(10, $index)"
                  /></template>
                </el-table-column>
              </el-table>
              <div>
                <el-button
                  type="text"
                  icon="el-icon-plus"
                  @click="addTableData(10)"
                >
                  添加一行
                </el-button>
              </div>
            </el-collapse-item>
            <el-collapse-item
              title="11、病历首页质量存在问题归类及归档率"
              name="11"
            >
              <el-table
                v-loading="listLoading"
                :data="formLabelAlign.tableDatas.table11"
                stripe
                style="width: 100%"
                size="mini"
              >
                <el-table-column
                  label="本季度病案首页份数"
                  align="center"
                  width="130"
                >
                  <template slot-scope="{ row }">
                    <el-input
                      v-model.trim="row.QuarterlyMedicalRecord"
                      placeholder="本季度病案首页份数"
                      size="mini"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  label="检查病案首页份数"
                  align="center"
                  width="120"
                >
                  <template slot-scope="{ row }">
                    <el-input
                      v-model.trim="row.CheckMedicalRecord"
                      placeholder="检查病案首页份数"
                      size="mini"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  label="有问题的病案首页份数"
                  align="center"
                  width="145"
                >
                  <template slot-scope="{ row }">
                    <el-input
                      v-model.trim="row.ProblemMedicalRecord"
                      placeholder="有问题的病案首页份数"
                      size="mini"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  label="病历首页质量存在问题归类"
                  align="center"
                >
                  <el-table-column
                    label="1、项目不完整"
                    align="center"
                    width="105"
                  >
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.ProjectIncomplete"
                        placeholder="项目不完整"
                        size="mini"
                        type="textarea"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="2、主要诊断不正确"
                    align="center"
                    width="125"
                  >
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.IncorrectDiagnosis"
                        placeholder="主要诊断不正确"
                        size="mini"
                        type="textarea"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="3、诊断完整性不全"
                    align="center"
                    width="125"
                  >
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.DiagnosticCompleteness"
                        placeholder="诊断完整性不全"
                        size="mini"
                        type="textarea"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="4、并发症及不良反应未填写"
                    align="center"
                    width="175"
                  >
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.ConcurrentAdverseReactions"
                        placeholder="并发症及不良反应未填写"
                        size="mini"
                        type="textarea"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="5、手术及操作记录不完整"
                    align="center"
                    width="160"
                  >
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.IncompleteRecord"
                        placeholder="手术及操作记录不完整"
                        size="mini"
                        type="textarea"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="6、未及时归档份数"
                    align="center"
                    width="125"
                    type="textarea"
                  >
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.NotArchived"
                        placeholder="6、未及时归档份数"
                        size="mini"
                      />
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column label="根本原因分析" min-width="190px">
                  <template slot-scope="{ row }">
                    <el-checkbox-group v-model="row.CauseAnalysis">
                      <el-checkbox label="1、填写不认真致漏项," />
                      <el-checkbox label="2、主要诊断选择不正确," />
                      <el-checkbox label="3、隐瞒或有意漏项," />
                      <el-checkbox label="4、书写不及时影响归档," />
                      <el-checkbox label="5、其他原因," />
                    </el-checkbox-group>
                  </template>
                </el-table-column>

                <el-table-column label="归档率" align="center">
                  <el-table-column label="3日归档率" align="center" width="80">
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.ArchivingRate"
                        placeholder="3日归档率"
                        size="mini"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column label="缺陷率" align="center" width="80">
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.DefectRate"
                        placeholder="缺陷率"
                        size="mini"
                      />
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column
                  label="归档率根本原因分析"
                  align="center"
                  width="160"
                >
                  <template slot-scope="{ row }">
                    <el-input
                      v-model.trim="row.ArchivingRateCauseAnalysis"
                      type="textarea"
                      placeholder="根本原因分析"
                      size="mini"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  label="科室医疗质量管理小组的意见或建议"
                  width="220"
                >
                  <template slot-scope="{ row }">
                    <el-input
                      v-model.trim="row.Suggest"
                      type="textarea"
                      placeholder="科室医疗质量管理小组的意见或建议"
                      size="mini"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  width="40"
                  align="center"
                ><template slot-scope="{ $index }">
                  <i
                    class="el-icon-delete"
                    style="cursor: pointer"
                    @click="deleteTableData(11, $index)"
                  /></template>
                </el-table-column>
              </el-table>
              <div>
                <el-button
                  type="text"
                  icon="el-icon-plus"
                  @click="addTableData(11)"
                >
                  添加一行
                </el-button>
              </div>
            </el-collapse-item>
            <el-collapse-item title="12、季度输血病历书写规范性自查" name="12">
              <el-table
                v-loading="listLoading"
                :data="formLabelAlign.tableDatas.table12"
                stripe
                style="width: 100%"
                size="mini"
              >
                <el-table-column label="病历号" align="center">
                  <template slot-scope="{ row }">
                    <el-input
                      v-model.trim="row.MedicalRecordNumber"
                      placeholder="住院号"
                      maxlength="100"
                      show-word-limit
                      clearable
                      size="mini"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="患者姓名" align="center">
                  <template slot-scope="{ row }">
                    <el-input
                      v-model.trim="row.PatientName"
                      placeholder="患者姓名"
                      maxlength="100"
                      show-word-limit
                      clearable
                      size="mini"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="季度输血病历自查存在问题归类">
                  <template slot-scope="{ row }">
                    <el-checkbox-group v-model="row.ProblemClassification">
                      <el-checkbox label="4.19.3.5.C.1," />
                      <el-checkbox label="4.19.3.5.C.2," />
                      <el-checkbox label="4.19.3.5.C.3," />
                      <el-checkbox label="4.19.3.5.C.4," />
                    </el-checkbox-group>
                  </template>
                </el-table-column>
                <el-table-column
                  label="诊断完整性"
                ><template slot-scope="{ row }">
                  <el-input
                    v-model.trim="row.DiagnosticCompleteness"
                    placeholder="诊断完整性"
                    clearable
                    size="mini"
                  /> </template></el-table-column>
                <el-table-column
                  prop="quarter"
                  label="有无不良反应"
                  align="center"
                >
                  <template slot-scope="{ row }">
                    <el-radio
                      v-model="row.AdverseReactions"
                      label="有"
                    >有</el-radio>
                    <el-radio
                      v-model="row.AdverseReactions"
                      label="无"
                    >无</el-radio>
                  </template>
                </el-table-column>
                <el-table-column prop="quarter" label="存在问题" align="center">
                  <template slot-scope="{ row }">
                    <el-radio v-model="row.IsProblem" label="有">有</el-radio>
                    <el-radio v-model="row.IsProblem" label="无">无</el-radio>
                  </template>
                </el-table-column>
                <el-table-column
                  label="若存在问题，具体内容"
                ><template slot-scope="{ row }">
                  <el-input
                    v-model.trim="row.Problem"
                    placeholder="若存在问题，具体内容"
                    clearable
                    size="mini"
                  /> </template></el-table-column>
                <el-table-column
                  label="根本原因分析"
                ><template slot-scope="{ row }">
                  <el-checkbox-group v-model="row.CauseAnalysis">
                    <el-checkbox label="1、输血记录规范掌握不全," />
                    <el-checkbox label="2、遗漏," />
                    <el-checkbox label="3、其他原因," />
                  </el-checkbox-group> </template></el-table-column>
                <el-table-column
                  label="科室质量与安全管理小组的意见或建议"
                ><template slot-scope="{ row }">
                  <el-input
                    v-model.trim="row.Suggest"
                    placeholder="科室质量与安全管理小组的意见或建议"
                    type="textarea"
                    clearable
                    size="mini"
                  /> </template></el-table-column>
                <el-table-column
                  width="100"
                  align="center"
                ><template slot-scope="{ $index }">
                  <i
                    class="el-icon-delete"
                    style="cursor: pointer"
                    @click="deleteTableData(12, $index)"
                  /></template>
                </el-table-column>
              </el-table>

              <div>
                <el-button
                  type="text"
                  icon="el-icon-plus"
                  @click="addTableData(12)"
                >
                  添加一行
                </el-button>
                <p>4.19.3.5.C.1：有临床用血医学文书管理制度，并严格执行。</p>
                <p>
                  4.19.3.5.C.2：输血治疗病程记录至少包括输血原因，不同输血方式的选择，输注成分、血型和数量，输注起止时间，输血过程观察情况，有无输血不良反应等内容。
                </p>
                <p>4.19.3.5.C.3：输血治疗后病程记录有输注效果评价的描述。</p>
                <p>
                  4.19.3.5.C.4：手术输血患者其手术记录、麻醉记录、护理记录和术后记录中输血量与发血量要一致。
                </p>
              </div>
            </el-collapse-item>
            <el-collapse-item title="13、季度合理用血情况自查记录" name="13">
              <el-table
                v-loading="listLoading"
                :data="formLabelAlign.tableDatas.table13.table13one"
                stripe
                style="width: 100%"
                size="mini"
              >
                <el-table-column label="病历号" align="center">
                  <template slot-scope="{ row }">
                    <el-input
                      v-model.trim="row.MedicalRecordNumber"
                      placeholder="住院号"
                      clearable
                      size="mini"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="患者姓名" align="center">
                  <template slot-scope="{ row }">
                    <el-input
                      v-model.trim="row.PatientName"
                      placeholder="患者姓名"
                      clearable
                      size="mini"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="不合理用血缺陷问题" align="center">
                  <template slot-scope="{ row }">
                    <el-input
                      v-model.trim="row.DefectProblem"
                      placeholder="不合理用血缺陷问题"
                      type="textarea"
                      clearable
                      size="mini"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="问题归类" align="center">
                  <template slot-scope="{ row }">
                    <el-input
                      v-model.trim="row.ProblemClassification"
                      placeholder="问题归类"
                      type="textarea"
                      clearable
                      size="mini"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="责任人" align="center">
                  <template slot-scope="{ row }">
                    <el-input
                      v-model.trim="row.Responsible"
                      placeholder="责任人"
                      clearable
                      size="mini"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="上传附件" align="center">
                  <template slot-scope="{ row }">
                    <el-upload
                      :multiple="true"
                      :show-file-list="true"
                      :on-success="
                        (response, file) => handleSuccess(response, file, row)
                      "
                      class="editor-slide-upload"
                      :file-list="fileList"
                      action="/api/RC_File/UploadFile"
                    >
                      <el-button
                        size="mini"
                        circle
                        class="iconfont al-icon-tijiao1"
                      />
                    </el-upload>
                  </template>
                </el-table-column>
                <el-table-column label="已传附件下载" min-width="120px">
                  <template slot-scope="{ row }">
                    <el-link
                      v-for="(itemFile, indexFile) in row.File_list"
                      :key="indexFile"
                      :href="itemFile.FileUrl"
                      target="_blank"
                    >{{ itemFile.FileName }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column
                  label="预览资料"
                  align="center"
                  prop="FileList_dto"
                  min-width="120px"
                >
                  <template slot-scope="{ row }">
                    <el-link
                      v-for="(PreviewItem, indexPreview) in row.File_list"
                      :key="indexPreview"
                      target="_blank"
                      @click="PreviewFile(PreviewItem.FileUrl)"
                    >{{ PreviewItem.FileName }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column
                  width="100"
                  align="center"
                ><template slot-scope="{ $index }">
                  <i
                    class="el-icon-delete"
                    style="cursor: pointer"
                    @click="deleteTableData(13, $index)"
                  /></template>
                </el-table-column>
              </el-table>
              <div>
                <el-button
                  type="text"
                  icon="el-icon-plus"
                  @click="addTableData(13)"
                >
                  添加一行
                </el-button>
              </div>
              <el-table
                v-loading="listLoading"
                :data="formLabelAlign.tableDatas.table13.table13two"
                stripe
                style="width: 100%"
                size="mini"
              >
                <el-table-column
                  label="季度输血质量管理评价分析记录"
                  align="center"
                >
                  <el-table-column label="输血方式" align="center">
                    <template slot-scope="{ row }">
                      <el-radio
                        v-model="row.BloodTransfusion"
                        label="自体"
                      >自体</el-radio>
                      <el-radio
                        v-model="row.BloodTransfusion"
                        label="异体"
                      >异体</el-radio>
                    </template>
                  </el-table-column>
                  <el-table-column label="输注成分">
                    <template slot-scope="{ row }">
                      <el-checkbox-group v-model="row.Infusion">
                        <el-checkbox label="1、全血," />
                        <el-checkbox label="2、血浆," />
                        <el-checkbox label="3、红细胞," />
                        <el-checkbox label="4、血小板," />
                        <el-checkbox label="5’其他," />
                      </el-checkbox-group>
                    </template>
                  </el-table-column>
                  <el-table-column label="有无不良反应" align="center">
                    <template slot-scope="{ row }">
                      <el-radio
                        v-model="row.AdverseReactions"
                        label="有"
                      >有</el-radio>
                      <el-radio
                        v-model="row.AdverseReactions"
                        label="无"
                      >无</el-radio>
                    </template>
                  </el-table-column>
                  <el-table-column label="不良反应情况" align="center">
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.AdverseReactionSituation"
                        placeholder="不良反应情况"
                        type="textarea"
                        size="mini"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column label="检查项目" min-width="240px">
                    <template slot-scope="{ row }">
                      <el-checkbox-group v-model="row.CheckItem">
                        <el-checkbox label="1、输血相关法规、制度的执行," />
                        <el-checkbox label="2、严格按输血适应症科学合理用血," />
                        <el-checkbox label="3、血液有效期内使用情况," />
                        <el-checkbox
                          label="4、落实临床用血申请、登记制度，履行用血报批手续,"
                        />
                        <el-checkbox
                          label="6、执行临床用血前评估和用血后效果评价制度,"
                        />

                        <el-checkbox
                          label="7、输血前向患者及家属告知输血目的和风险，并签署“输血治疗同意书,"
                        />
                        <el-checkbox label="8、血袋按规定保存、销毁★," />
                        <el-checkbox label="9、一次性输血耗材无害化处理★," />
                        <el-checkbox label="10、按规定流程领血★," />
                        <el-checkbox label="11、输血前、中、后全程监测患者★," />
                        <el-checkbox label="12、输血感染控制★," />
                        <el-checkbox label="13、输血不良反应的处理★," />
                        <el-checkbox label="14、其他原因," />
                      </el-checkbox-group>
                    </template>
                  </el-table-column>
                  <el-table-column label="存在问题归类" align="center">
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.ExistProblemClassification"
                        placeholder="存在问题归类"
                        type="textarea"
                        clearable
                        size="mini"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column label="根本原因分析" align="center">
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.CauseAnalysis"
                        placeholder="根本原因分析"
                        type="textarea"
                        clearable
                        size="mini"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="科室质量与安全管理小组的意见或建议"
                    align="center"
                  >
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.Suggest"
                        placeholder="科室质量与安全管理小组的意见或建议"
                        type="textarea"
                        clearable
                        size="mini"
                      />
                    </template>
                  </el-table-column>
                </el-table-column>
              </el-table>
            </el-collapse-item>
            <el-collapse-item
              title="14、季度对患者的出院指导与随访工作评价分析总结记录"
              name="14"
            >
              <el-table
                v-loading="listLoading"
                :data="[formLabelAlign.tableDatas.table14.table14one]"
                stripe
                style="width: 100%"
                size="mini"
              >
                <el-table-column
                  label="科室随访总例数"
                  align="center"
                  min-width="100"
                >
                  <template slot-scope="{ row }">
                    <el-input
                      v-model.trim="row.DeptFollowUp"
                      placeholder="科室随访总例数"
                      size="mini"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  label="电话随访例数"
                  align="center"
                  min-width="100"
                >
                  <template slot-scope="{ row }">
                    <el-input
                      v-model.trim="row.PhoneFollowUp"
                      placeholder="电话随访例数"
                      size="mini"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  label="门诊随访例数"
                  align="center"
                  min-width="100"
                >
                  <template slot-scope="{ row }">
                    <el-input
                      v-model.trim="row.OutpatientFollowUp"
                      placeholder="门诊随访例数"
                      size="mini"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  label="其他随访例数"
                  align="center"
                  min-width="100"
                >
                  <template slot-scope="{ row }">
                    <el-input
                      v-model.trim="row.OtherFollowUp"
                      placeholder="其他随访例数"
                      size="mini"
                    />
                  </template>
                </el-table-column>
              </el-table>
              <p>
                说明：《浙江省综合医院等级评审标准（2019年版）》
                <br>4.5.5.2要求：“医院对患者的出院指导与随访有明确的制度，对特定患者（根据临床或科研需要）采用多种形式的定期随访”。（注：此记录表对科室重点病种分析总结）
              </p>
              <el-table
                v-loading="listLoading"
                :data="formLabelAlign.tableDatas.table14.table14two"
                stripe
                style="width: 100%"
                size="mini"
              >
                <el-table-column label="重点疾病随访情况" align="center">
                  <el-table-column label="重点病种疾病名称" align="center">
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.DiseaseName"
                        placeholder="重点病种疾病名称"
                        size="mini"
                        type="textarea"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column label="出院病例总数" align="center">
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.DischargedCases"
                        size="mini"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column label="随访例数" align="center">
                    <template slot-scope="{ row }">
                      <el-input v-model.trim="row.FollowUpNum" size="mini" />
                    </template>
                  </el-table-column>
                  <el-table-column label="随访率" align="center">
                    <template slot-scope="{ row }">
                      <el-input v-model.trim="row.FollowRate" size="mini" />
                    </template>
                  </el-table-column>
                  <el-table-column label="存在问题" align="center">
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.Problem"
                        placeholder="存在问题"
                        size="mini"
                        type="textarea"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column label="改进措施" align="center">
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.ImprovementMeasures"
                        placeholder="改进措施"
                        size="mini"
                        type="textarea"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column label="效果追踪" align="center">
                    <template slot-scope="{ row }">
                      <el-input
                        v-model.trim="row.PerformanceTracking"
                        placeholder="效果追踪"
                        size="mini"
                        type="textarea"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column label="上传附件" align="center">
                    <template slot-scope="{ row }">
                      <el-upload
                        :multiple="true"
                        :show-file-list="true"
                        :on-success="
                          (response, file) => handleSuccess(response, file, row)
                        "
                        class="editor-slide-upload"
                        :file-list="fileList"
                        action="/api/RC_File/UploadFile"
                      >
                        <el-button
                          size="mini"
                          circle
                          class="iconfont al-icon-tijiao1"
                        />
                      </el-upload>
                    </template>
                  </el-table-column>
                  <el-table-column label="已传附件下载" min-width="120px">
                    <template slot-scope="{ row }">
                      <el-link
                        v-for="(itemFile, indexFile) in row.File_list"
                        :key="indexFile"
                        :href="itemFile.FileUrl"
                        target="_blank"
                      >{{ itemFile.FileName }}</el-link>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="预览资料"
                    align="center"
                    prop="FileList_dto"
                    min-width="120px"
                  >
                    <template slot-scope="{ row }">
                      <el-link
                        v-for="(PreviewItem, indexPreview) in row.File_list"
                        :key="indexPreview"
                        target="_blank"
                        @click="PreviewFile(PreviewItem.FileUrl)"
                      >{{ PreviewItem.FileName }}</el-link>
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column
                  width="40"
                  align="center"
                ><template slot-scope="{ $index }">
                  <i
                    class="el-icon-delete"
                    style="cursor: pointer"
                    @click="deleteTableData(14, $index)"
                  /></template>
                </el-table-column>
              </el-table>
              <div>
                <el-button
                  type="text"
                  icon="el-icon-plus"
                  @click="addTableData(14)"
                >
                  添加一行
                </el-button>
              </div>
            </el-collapse-item>
            <el-collapse-item
              title="15、季度住院时间超过30天患者评价分析总结记录"
              name="15"
            >
              <p>
                说明：《浙江省综合医院等级评审标准（2019年版）》
                4.5.5.2要求：“医院对患者的出院指导与随访有明确的制度，对特定患者（根据临床或科研需要）采用多种形式的定期随访”。（注：此记录表对科室重点病种分析总结）
              </p>
              <el-form
                label-position="right"
                label-width="140px"
                :model="formLabelAlign.tableDatas.table15"
                size="mini"
                :inline="true"
              >
                <el-form-item label="住院超过30天患者" :required="true">
                  <el-input
                    v-model="formLabelAlign.tableDatas.table15.PatientsNum"
                    style="width: 150px"
                  ><i
                    slot="suffix"
                    style="font-style: normal; margin-right: 10px"
                  >例</i></el-input>
                </el-form-item>
                <el-form-item label="预约检查时间过长" :required="true">
                  <el-input
                    v-model="
                      formLabelAlign.tableDatas.table15.ReservationTimeOut
                    "
                    style="width: 150px"
                  ><i
                    slot="suffix"
                    style="font-style: normal; margin-right: 10px"
                  >例</i></el-input>
                </el-form-item>
                <el-form-item label="等候院内会诊时间过长" :required="true">
                  <el-input
                    v-model="
                      formLabelAlign.tableDatas.table15.ConsultationTimeOut
                    "
                    style="width: 150px"
                  ><i
                    slot="suffix"
                    style="font-style: normal; margin-right: 10px"
                  >例</i></el-input>
                </el-form-item>
                <el-form-item label="等候检查结果时间过长" :required="true">
                  <el-input
                    v-model="formLabelAlign.tableDatas.table15.CheckTimeOut"
                    style="width: 150px"
                  ><i
                    slot="suffix"
                    style="font-style: normal; margin-right: 10px"
                  >例</i></el-input>
                </el-form-item>
                <el-form-item label="术前准备时间过长" :required="true">
                  <el-input
                    v-model="
                      formLabelAlign.tableDatas.table15.PreoperativeTimeOut
                    "
                    style="width: 150px"
                  ><i
                    slot="suffix"
                    style="font-style: normal; margin-right: 10px"
                  >例</i></el-input>
                </el-form-item>
                <el-form-item label="患者病情复杂" :required="true">
                  <el-input
                    v-model="
                      formLabelAlign.tableDatas.table15.ComplicatedCondition
                    "
                    style="width: 150px"
                  ><i
                    slot="suffix"
                    style="font-style: normal; margin-right: 10px"
                  >例</i></el-input>
                </el-form-item>
                <el-form-item label="有并发症" :required="true">
                  <el-input
                    v-model="formLabelAlign.tableDatas.table15.Complication"
                    style="width: 150px"
                  ><i
                    slot="suffix"
                    style="font-style: normal; margin-right: 10px"
                  >例</i></el-input>
                </el-form-item>
                <el-form-item label="存在医疗纠纷" :required="true">
                  <el-input
                    v-model="formLabelAlign.tableDatas.table15.MedicalDispute"
                    style="width: 150px"
                  ><i
                    slot="suffix"
                    style="font-style: normal; margin-right: 10px"
                  >例</i></el-input>
                </el-form-item>
                <el-form-item label="转科治疗" :required="true">
                  <el-input
                    v-model="
                      formLabelAlign.tableDatas.table15.TransferTreatment
                    "
                    style="width: 150px"
                  ><i
                    slot="suffix"
                    style="font-style: normal; margin-right: 10px"
                  >例</i></el-input>
                </el-form-item>
                <el-form-item label="术后联合化疗" :required="true">
                  <el-input
                    v-model="formLabelAlign.tableDatas.table15.Chemotherapy"
                    style="width: 150px"
                  ><i
                    slot="suffix"
                    style="font-style: normal; margin-right: 10px"
                  >例</i></el-input>
                </el-form-item>
                <el-form-item label="术前新辅助化疗" :required="true">
                  <el-input
                    v-model="
                      formLabelAlign.tableDatas.table15.PreoperativeChemotherapy
                    "
                    style="width: 150px"
                  ><i
                    slot="suffix"
                    style="font-style: normal; margin-right: 10px"
                  >例</i></el-input>
                </el-form-item>
                <el-form-item label="其他原因">
                  <el-input
                    v-model="formLabelAlign.tableDatas.table15.OtherReason"
                    style="width: 150px"
                    type="textarea"
                  />
                </el-form-item>
                <el-form-item label="根本原因分析">
                  <el-input
                    v-model="formLabelAlign.tableDatas.table15.CauseAnalysis"
                    style="width: 150px"
                    type="textarea"
                  />
                </el-form-item>
                <el-form-item label="改进措施及整改情况评价">
                  <el-input
                    v-model="
                      formLabelAlign.tableDatas.table15.ImprovementMeasures
                    "
                    style="width: 150px"
                    type="textarea"
                  />
                </el-form-item>
                <el-form-item label="上传附件">
                  <el-upload
                    :multiple="true"
                    :show-file-list="true"
                    :on-success="
                      (response, file) =>
                        handleSuccess(
                          response,
                          file,
                          formLabelAlign.tableDatas.table15
                        )
                    "
                    class="editor-slide-upload"
                    :file-list="fileList"
                    action="/api/RC_File/UploadFile"
                  >
                    <el-button
                      size="mini"
                      circle
                      class="iconfont al-icon-tijiao1"
                    />
                  </el-upload>
                </el-form-item>
              </el-form>
              <el-table
                v-loading="listLoading"
                :data="formLabelAlign.tableDatas.table15.File_list"
                stripe
                style="width: 100%"
              >
                <el-table-column label="已传附件下载" min-width="120px">
                  <template slot-scope="{ row }">
                    <el-link :href="row.FileUrl" target="_blank">{{
                      row.FileName
                    }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column
                  label="预览资料"
                  align="center"
                  prop="FileList_dto"
                  min-width="120px"
                >
                  <template slot-scope="{ row }">
                    <el-link
                      target="_blank"
                      @click="PreviewFile(row.FileUrl)"
                    >{{ row.FileName }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column
                  width="100"
                  align="center"
                ><template slot-scope="{ $index }">
                  <i
                    class="el-icon-delete"
                    style="cursor: pointer"
                    @click="deleteFile(15, $index)"
                  /></template>
                </el-table-column>
              </el-table>
            </el-collapse-item>
            <el-collapse-item
              title="16、（外科）季度非计划再次手术评价分析总结记录"
              name="16"
            >
              <el-table
                v-loading="listLoading"
                :data="[formLabelAlign.tableDatas.table16]"
                stripe
                style="width: 100%"
                size="mini"
              >
                <el-table-column
                  label="科室发生总数"
                  align="center"
                ><template>
                  <el-input
                    v-model.trim="formLabelAlign.tableDatas.table16.DeptTotal"
                    placeholder="科室发生总数"
                    clearable
                    size="mini"
                  /> </template></el-table-column>
                <el-table-column min-width="150px">
                  <template>
                    <el-checkbox-group
                      v-model="formLabelAlign.tableDatas.table16.CauseAnalysis"
                      label="根本原因分析"
                    >
                      <el-checkbox label="1、出血," />
                      <el-checkbox label="2、各类瘘," />
                      <el-checkbox label="3、切口裂开、感染," />
                      <el-checkbox label="4、引流管滑脱," />
                      <el-checkbox label="5、异物残留," />
                      <el-checkbox label="6、肠梗阻," />
                      <el-checkbox label="7、其他," />
                    </el-checkbox-group>
                  </template>
                </el-table-column>
                <el-table-column
                  label="改进措施"
                  align="center"
                ><template>
                  <el-input
                    v-model.trim="
                      formLabelAlign.tableDatas.table16.ImprovementMeasures
                    "
                    placeholder="改进措施"
                    clearable
                    type="textarea"
                    size="mini"
                  /> </template></el-table-column>
                <el-table-column
                  label="科室质量与安全管理小组总结"
                  align="center"
                ><template>
                  <el-input
                    v-model.trim="formLabelAlign.tableDatas.table16.Summary"
                    type="textarea"
                    placeholder="科室质量与安全管理小组总结"
                    clearable
                    size="mini"
                  /> </template></el-table-column>
                <el-table-column label="上传附件" align="center">
                  <template>
                    <el-upload
                      :multiple="true"
                      :show-file-list="true"
                      :on-success="
                        (response, file) =>
                          handleSuccess(
                            response,
                            file,
                            formLabelAlign.tableDatas.table16
                          )
                      "
                      class="editor-slide-upload"
                      :file-list="fileList"
                      action="/api/RC_File/UploadFile"
                    >
                      <el-button
                        size="mini"
                        circle
                        class="iconfont al-icon-tijiao1"
                      />
                    </el-upload>
                  </template>
                </el-table-column>
              </el-table>
              <el-table
                v-loading="listLoading"
                :data="formLabelAlign.tableDatas.table16.File_list"
                stripe
                style="width: 100%"
              >
                <el-table-column label="已传附件下载" min-width="120px">
                  <template slot-scope="{ row }">
                    <el-link :href="row.FileUrl" target="_blank">{{
                      row.FileName
                    }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column
                  label="预览资料"
                  align="center"
                  prop="FileList_dto"
                  min-width="120px"
                >
                  <template slot-scope="{ row }">
                    <el-link
                      target="_blank"
                      @click="PreviewFile(row.FileUrl)"
                    >{{ row.FileName }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column
                  width="100"
                  align="center"
                ><template slot-scope="{ $index }">
                  <i
                    class="el-icon-delete"
                    style="cursor: pointer"
                    @click="deleteFile(16, $index)"
                  /></template>
                </el-table-column>
              </el-table>
            </el-collapse-item>
            <el-collapse-item
              title="17、季度药事和药物使用质量管理评价分析记录"
              name="17"
            >
              <el-table
                v-loading="listLoading"
                :data="[formLabelAlign.tableDatas.table17]"
                stripe
                style="width: 100%"
                size="mini"
              >
                <el-table-column
                  label="检查项目"
                  min-width="260px"
                ><template slot-scope="{ row }">
                  <el-checkbox-group v-model="row.CheckItem">
                    <el-checkbox
                      label="1、执行“特殊管理药品”管理的有关规定（参见评审标准4.15.2.4),"
                    />
                    <el-checkbox
                      label="2、处方（用药医嘱）开具、抄录、审核、调配、核发、用药交代和监测等行为符合相关规定（参见评审标准4.15.3）,"
                    />
                    <el-checkbox
                      label="3、按《抗菌药物临床应用指导原则》合理用药★（参见评审标准4.15.5）,"
                    />
                    <el-checkbox
                      label="4、有药物安全性监测制度，监测用药效果，按规定报告药物严重不良反应，并记录在病历中★（参见评审标准4.15.6）,"
                    />
                    <el-checkbox label="5、其他原因," />
                  </el-checkbox-group>
                </template>
                </el-table-column>
                <el-table-column
                  label="其他检查项目内容"
                  align="center"
                ><template slot-scope="{ row }">
                  <el-input
                    v-model.trim="row.OtherCheckItem"
                    type="textarea"
                    placeholder="其他检查项目内容"
                    clearable
                    size="mini"
                  /> </template></el-table-column>
                <el-table-column
                  label="改进措施"
                  align="center"
                ><template slot-scope="{ row }">
                  <el-input
                    v-model.trim="row.ImprovementMeasures"
                    type="textarea"
                    placeholder="改进措施"
                    clearable
                    size="mini"
                  /> </template></el-table-column>
                <el-table-column
                  label="科室质量与安全管理小组总结"
                  align="center"
                ><template slot-scope="{ row }">
                  <el-input
                    v-model.trim="row.Summary"
                    type="textarea"
                    placeholder="科室质量与安全管理小组总结"
                    clearable
                    size="mini"
                  /> </template></el-table-column>
                <el-table-column
                  label="上传附件"
                  align="center"
                ><template>
                  <el-upload
                    :multiple="true"
                    :show-file-list="true"
                    :on-success="
                      (response, file) =>
                        handleSuccess(
                          response,
                          file,
                          formLabelAlign.tableDatas.table17
                        )
                    "
                    class="editor-slide-upload"
                    :file-list="fileList"
                    action="/api/RC_File/UploadFile"
                  >
                    <el-button
                      size="mini"
                      circle
                      class="iconfont al-icon-tijiao1"
                    />
                  </el-upload> </template></el-table-column>
              </el-table>
              <el-table
                v-loading="listLoading"
                :data="formLabelAlign.tableDatas.table17.File_list"
                stripe
                style="width: 100%"
              >
                <el-table-column label="已传附件下载" min-width="120px">
                  <template slot-scope="{ row }">
                    <el-link :href="row.FileUrl" target="_blank">{{
                      row.FileName
                    }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column
                  label="预览资料"
                  align="center"
                  prop="FileList_dto"
                  min-width="120px"
                >
                  <template slot-scope="{ row }">
                    <el-link
                      target="_blank"
                      @click="PreviewFile(row.FileUrl)"
                    >{{ row.FileName }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column
                  width="100"
                  align="center"
                ><template slot-scope="{ $index }">
                  <i
                    class="el-icon-delete"
                    style="cursor: pointer"
                    @click="deleteFile(17, $index)"
                  /></template>
                </el-table-column>
              </el-table>
            </el-collapse-item>
            <el-collapse-item
              title="18、季度患者合法权益科室自查总结分析记录"
              name="18"
            >
              <el-form label-position="top" size="mini">
                <el-form-item
                  label="1.医务人员能根据医患沟通的制度、流程，在实施手术、麻醉、高危诊疗操作、特殊检查、特殊治疗（如化疗、放疗）或使用血液制品、贵重药品、耗材前，用通俗易懂的方式和语言与患方进行沟通，并履行书面同意手续。"
                >
                  <el-checkbox-group
                    v-model="formLabelAlign.tableDatas.table18.Formalities"
                  >
                    <el-checkbox label="1.符合," />
                    <el-checkbox label="2.部分符合," />
                    <el-checkbox label="3.部分符合," />
                  </el-checkbox-group>
                  <p style="margin: 0; padding: 0">
                    说明：每个月需要抽两本病例进行检查
                  </p>
                </el-form-item>
                <el-form-item label="2.存在问题">
                  <el-input
                    v-model="formLabelAlign.tableDatas.table18.Problem"
                    placeholder="存在问题"
                    type="textarea"
                    clearable
                    size="mini"
                  />
                </el-form-item>
                <el-form-item label="3.整改措施">
                  <el-input
                    v-model="
                      formLabelAlign.tableDatas.table18.ImprovementMeasures
                    "
                    placeholder="整改措施"
                    type="textarea"
                    clearable
                    size="mini"
                  />
                </el-form-item>
                <el-form-item label="4.效果追踪">
                  <el-input
                    v-model="
                      formLabelAlign.tableDatas.table18.PerformanceTracking
                    "
                    placeholder="效果追踪"
                    type="textarea"
                    clearable
                    size="mini"
                  />
                </el-form-item>
                <el-form-item label="上传附件">
                  <el-upload
                    :multiple="true"
                    :show-file-list="true"
                    :on-success="
                      (response, file) =>
                        handleSuccess(
                          response,
                          file,
                          formLabelAlign.tableDatas.table18
                        )
                    "
                    class="editor-slide-upload"
                    :file-list="fileList"
                    action="/api/RC_File/UploadFile"
                  >
                    <el-button
                      size="mini"
                      circle
                      class="iconfont al-icon-tijiao1"
                    />
                  </el-upload>
                </el-form-item>
              </el-form>
              <el-table
                v-loading="listLoading"
                :data="formLabelAlign.tableDatas.table18.File_list"
                stripe
                style="width: 100%"
              >
                <el-table-column label="已传附件下载" min-width="120px">
                  <template slot-scope="{ row }">
                    <el-link :href="row.FileUrl" target="_blank">{{
                      row.FileName
                    }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column
                  label="预览资料"
                  align="center"
                  prop="FileList_dto"
                  min-width="120px"
                >
                  <template slot-scope="{ row }">
                    <el-link
                      target="_blank"
                      @click="PreviewFile(row.FileUrl)"
                    >{{ row.FileName }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column
                  width="100"
                  align="center"
                ><template slot-scope="{ $index }">
                  <i
                    class="el-icon-delete"
                    style="cursor: pointer"
                    @click="deleteFile(18, $index)"
                  /></template>
                </el-table-column>
              </el-table>
            </el-collapse-item>
            <el-collapse-item title="19、季度疼痛管理季度自查" name="19">
              <el-table
                v-loading="listLoading"
                :data="[formLabelAlign.tableDatas.table19]"
                stripe
                style="width: 100%"
                size="mini"
              >
                <el-table-column
                  label="1.根据“三阶梯止痛原则”，制定适宜的个体化诊疗方案。"
                >
                  <template slot-scope="{ row }">
                    <el-radio-group v-model="row.DiagnosisTreatment">
                      <el-radio label="符合">符合</el-radio>
                      <el-radio label="部分符合">部分符合</el-radio>
                      <el-radio label="不符合">不符合</el-radio>
                    </el-radio-group>
                  </template>
                </el-table-column>
                <el-table-column
                  label="2.科室对诊疗规范落实情况有自查、分析和评价。"
                >
                  <template slot-scope="{ row }">
                    <el-radio-group v-model="row.ImplementationStatus">
                      <el-radio label="符合">符合</el-radio>
                      <el-radio label="部分符合">部分符合</el-radio>
                      <el-radio label="不符合">不符合</el-radio>
                    </el-radio-group>
                  </template>
                </el-table-column>
                <el-table-column
                  label="3.有疼痛治疗风险防范与处置预案。包括：常见并发症、药物不良反应、高风险操作相关风险"
                >
                  <template slot-scope="{ row }">
                    <el-radio-group v-model="row.RiskPrevention">
                      <el-radio label="符合">符合</el-radio>
                      <el-radio label="部分符合">部分符合</el-radio>
                      <el-radio label="不符合">不符合</el-radio>
                    </el-radio-group>
                  </template>
                </el-table-column>
                <el-table-column label="存在问题" align="center">
                  <template slot-scope="{ row }">
                    <el-input
                      v-model.trim="row.Problem"
                      placeholder="存在问题"
                      type="textarea"
                      clearable
                      size="mini"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="整改措施" align="center">
                  <template slot-scope="{ row }">
                    <el-input
                      v-model.trim="row.ImprovementMeasures"
                      placeholder="整改措施"
                      type="textarea"
                      clearable
                      size="mini"
                    />
                  </template>
                </el-table-column>

                <el-table-column label="效果追踪" align="center">
                  <template slot-scope="{ row }">
                    <el-input
                      v-model.trim="row.PerformanceTracking"
                      placeholder="效果追踪"
                      type="textarea"
                      clearable
                      size="mini"
                    />
                  </template>
                </el-table-column>

                <el-table-column label="上传附件" align="center">
                  <template>
                    <el-upload
                      :multiple="true"
                      :show-file-list="true"
                      :on-success="
                        (response, file) =>
                          handleSuccess(
                            response,
                            file,
                            formLabelAlign.tableDatas.table19
                          )
                      "
                      class="editor-slide-upload"
                      :file-list="fileList"
                      action="/api/RC_File/UploadFile"
                    >
                      <el-button
                        size="mini"
                        circle
                        class="iconfont al-icon-tijiao1"
                      />
                    </el-upload>
                  </template>
                </el-table-column>
              </el-table>
              <p style="color: red">
                效果追踪：1.诊疗规范执行情况；2.规范治疗工作；3.治疗风险防范。
              </p>
              <p>说明：每个月需要抽两本病例进行检查</p>
              <el-table
                v-loading="listLoading"
                :data="formLabelAlign.tableDatas.table19.File_list"
                stripe
                style="width: 100%"
              >
                <el-table-column label="已传附件下载" min-width="120px">
                  <template slot-scope="{ row }">
                    <el-link :href="row.FileUrl" target="_blank">{{
                      row.FileName
                    }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column
                  label="预览资料"
                  align="center"
                  prop="FileList_dto"
                  min-width="120px"
                >
                  <template slot-scope="{ row }">
                    <el-link
                      target="_blank"
                      @click="PreviewFile(row.FileUrl)"
                    >{{ row.FileName }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column
                  width="100"
                  align="center"
                ><template slot-scope="{ $index }">
                  <i
                    class="el-icon-delete"
                    style="cursor: pointer"
                    @click="deleteFile(19, $index)"
                  /></template>
                </el-table-column>
              </el-table>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </el-main>
  </el-container>
</template>
<script>
import { InsertQuarterlyFormDetail } from '@/api/RC_QuarterlyForm';
import { PreviewFile } from '@/api/Article';

export default {
  props: {
    header: {
      /* 头部 */
      type: Object,
      default: () => {
        return {};
      }
    },
    tableDatas: {}
  },
  data() {
    return {
      formLabelAlign: {
        header: this.header,
        tableDatas: this.tableDatas
      },
      activeName: '1',
      listLoading: false,
      isControllerRow: {
        currentEdit: -1
      },
      checkList: [],
      checked: true,
      fileList: []
    };
  },
  mounted() {},
  methods: {
    increase() {
      this.formLabelAlign.tableDatas.table3.AntibacterialProportion += 10;
      if (this.formLabelAlign.tableDatas.table3.AntibacterialProportion > 100) {
        this.formLabelAlign.tableDatas.table3.AntibacterialProportion = 100;
      }
    },
    decrease() {
      this.formLabelAlign.tableDatas.table3.AntibacterialProportion -= 10;
      if (this.formLabelAlign.tableDatas.table3.AntibacterialProportion < 0) {
        this.formLabelAlign.tableDatas.table3.AntibacterialProportion = 0;
      }
    },
    addTableData(val) {
      const date = new Date();
      const year = date.getFullYear().toString();
      const month =
        date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1).toString()
          : (date.getMonth() + 1).toString();
      const today = year + '-' + month;
      if (val === 1) {
        this.formLabelAlign.tableDatas.table1.unshift({
          CheckTime: today,
          PatientName: '',
          HospitalNumber: '',
          ConsultationForm: '是',
          InvitedDepartment: '',
          Qualification: '是',
          TimeOut: '有',
          CourseRecord: '是',
          DeptSelfUser: '',
          SupervisionDept: '',
          Problem: '',
          ImprovementRecord: '',
          SupervisorUser: '',
          Feedback: today
        });
      } else if (val === 2) {
        this.formLabelAlign.tableDatas.table2.unshift({
          CheckTime: today,
          PatientName: '',
          HospitalNumber: '',
          Diagnosis: '',
          FollowUp: '是',
          DiagnosisTreatment: '是',
          EfficacyEvaluation: '',
          CheckUser: '',
          DeptSelfUser: '',
          Problem: '',
          ImprovementRecord: '',
          SupervisorUser: '',
          Feedback: ''
        });
      } else if (val === 4) {
        this.formLabelAlign.tableDatas.table4.unshift({
          CheckTime: today,
          HospitalNumber: '',
          SurgeryName: '',
          Approve: '有',
          Remark: '',
          DeptSelfUser: '',
          Problem: '',
          ImprovementRecord: '',
          SupervisorUser: '',
          Feedback: today
        });
      } else if (val === 5) {
        this.formLabelAlign.tableDatas.table5.unshift({
          CriticalValueCheckTime: today,
          CheckUser: '',
          ReportDept: '',
          ReportDate: '',
          PatientName: '',
          HospitalNumber: '',
          DisposalPhysician: '',
          CriticalValue: '',
          Register: '',
          Perfect: '',
          Dispose: '',
          ReasonableDisposal: '',
          TimelyRecord: '',
          CheckTime: '',
          DeptSelfUser: '',
          Problem: '',
          ImprovementRecord: '',
          SupervisorUse: '',
          Feedback: ''
        });
      } else if (val === 6) {
        this.formLabelAlign.tableDatas.table6.unshift({
          HospitalNumber: '',
          PatientName: '',
          SurgicalGrade: '',
          SurgicalOperator: '',
          Authority: ''
        });
      } else if (val === 7) {
        this.formLabelAlign.tableDatas.table7.unshift({
          HospitalNumber: '',
          DisposalPhysician: '',
          IncisionType: '',
          Prevention: '有',
          DrugName: '',
          UseDate: today,
          SurgicalStartDate: today,
          Indication: '有',
          Choose: '是',
          Opportunity: '是',
          CheckTime: today,
          DeptSelfUser: '',
          Problem: '',
          ImprovementRecord: '',
          SupervisorUser: '',
          Feedback: ''
        });
      } else if (val === 8) {
        this.formLabelAlign.tableDatas.table8.unshift({
          TargetMoneyProportion: '',
          BasicMoney: '',
          TotalMoney: '',
          MoneyProportion: '',
          UpStandard: '是',
          CheckTime: today,
          DeptSelfUser: '',
          Problem: '',
          ImprovementRecord: '',
          SupervisorUser: '',
          Feedback: today
        });
      } else if (val === 9) {
        this.formLabelAlign.tableDatas.table9.unshift({
          MedicalRecordNumber: '',
          CheckResult: '',
          SpecificProblem: '',
          Renew: '是',
          OrganizeTraining: '是',
          Assessment: '是',
          CompleteInformation: '是',
          CheckTime: today,
          DeptSelfUser: '',
          Problem: '',
          ImprovementRecord: '',
          SupervisorUser: '',
          Feedback: ''
        });
      } else if (val === 10) {
        this.formLabelAlign.tableDatas.table10.unshift({
          QuarterlyMedicalRecord: '',
          CheckMedicalRecord: '',
          ProblemMedicalRecord: '',
          Incomplete: '',
          RecordTimeLimit: '',
          Unsigned: '',
          CourseRecordClaim: '',
          OtherQuality: '',
          DeptSelfUser: '',
          CauseAnalysis: [],
          Suggest: ''
        });
      } else if (val === 10) {
        this.formLabelAlign.tableDatas.table10.unshift({
          QuarterlyMedicalRecord: '',
          CheckMedicalRecord: '',
          ProblemMedicalRecord: '',
          Incomplete: '',
          RecordTimeLimit: '',
          Unsigned: '',
          CourseRecordClaim: '',
          OtherQuality: '',
          DeptSelfUser: '',
          CauseAnalysis: [],
          Suggest: ''
        });
      } else if (val === 11) {
        this.formLabelAlign.tableDatas.table11.unshift({
          QuarterlyMedicalRecord: '',
          CheckMedicalRecord: '',
          ProblemMedicalRecord: '',
          ProjectIncomplete: '',
          IncorrectDiagnosis: '',
          DiagnosticCompleteness: '',
          ConcurrentAdverseReactions: '',
          IncompleteRecord: '',
          NotArchived: '',
          CauseAnalysis: [],
          ArchivingRate: '',
          DefectRate: ''
        });
      } else if (val === 12) {
        this.formLabelAlign.tableDatas.table12.unshift({
          MedicalRecordNumber: '',
          PatientName: '',
          ProblemClassification: [],
          DiagnosticCompleteness: '',
          AdverseReactions: '无',
          IsProblem: '无',
          Problem: '',
          CauseAnalysis: [],
          Suggest: ''
        });
      } else if (val === 13) {
        this.formLabelAlign.tableDatas.table13.table13one.unshift({
          MedicalRecordNumber: '',
          PatientName: '',
          DefectProblem: '',
          ProblemClassification: '',
          Responsible: ''
        });
      } else if (val === 14) {
        this.formLabelAlign.tableDatas.table14.table14two.unshift({
          DiseaseName: '',
          DischargedCases: '',
          FollowUpNum: '',
          FollowRate: '',
          Problem: '',
          ImprovementMeasures: '',
          PerformanceTracking: ''
        });
      }
    },
    deleteTableData(val, index) {
      switch (val) {
        case 1:
          this.formLabelAlign.tableDatas.table1.splice(index, 1);
          break;
        case 2:
          this.formLabelAlign.tableDatas.table2.splice(index, 1);
          break;
        case 3:
          this.formLabelAlign.tableDatas.table3.splice(index, 1);
          break;
        case 4:
          this.formLabelAlign.tableDatas.table4.splice(index, 1);
          break;
        case 5:
          this.formLabelAlign.tableDatas.table5.splice(index, 1);
          break;
        case 6:
          this.formLabelAlign.tableDatas.table6.splice(index, 1);
          break;
        case 7:
          this.formLabelAlign.tableDatas.table7.splice(index, 1);
          break;
        case 8:
          this.formLabelAlign.tableDatas.table8.splice(index, 1);
          break;
        case 9:
          this.formLabelAlign.tableDatas.table9.splice(index, 1);
          break;
        case 10:
          this.formLabelAlign.tableDatas.table10.splice(index, 1);
          break;
        case 11:
          this.formLabelAlign.tableDatas.table11.splice(index, 1);
          break;
        case 12:
          this.formLabelAlign.tableDatas.table12.splice(index, 1);
          break;
        case 13:
          this.formLabelAlign.tableDatas.table13.table13one.splice(index, 1);
          break;
        case 14:
          this.formLabelAlign.tableDatas.table14.table14two.splice(index, 1);
          break;
      }
    },
    handleCheckedCitiesChange(val) {},
    handleChange(file, fileList) {},
    async InsertQuarterlyFormDetail() {
      this.formLabelAlign.tableDatas.table10.map(item => {
        item.CauseAnalysis = item.CauseAnalysis.toString() || '';
      });
      this.formLabelAlign.tableDatas.table11.map(item => {
        item.CauseAnalysis = item.CauseAnalysis.toString() || '';
      });
      this.formLabelAlign.tableDatas.table12.map(item => {
        item.ProblemClassification =
          item.ProblemClassification.toString() || '';
        item.CauseAnalysis = item.CauseAnalysis.toString() || '';
      });
      this.formLabelAlign.tableDatas.table13.table13two.map(item => {
        item.Infusion = item.Infusion.toString() || '';
        item.CheckItem = item.CheckItem.toString() || '';
      });
      this.formLabelAlign.tableDatas.table16.CauseAnalysis =
        this.formLabelAlign.tableDatas.table16.CauseAnalysis.toString() || '';
      this.formLabelAlign.tableDatas.table17.CheckItem =
        this.formLabelAlign.tableDatas.table17.CheckItem.toString() || '';
      this.formLabelAlign.tableDatas.table18.Formalities =
        this.formLabelAlign.tableDatas.table18.Formalities.toString() || '';
      const { code } = await InsertQuarterlyFormDetail({
        QuarterlyFormID: this.formLabelAlign.header.QuarterlyFormID,
        list: this.formLabelAlign.tableDatas
      });
      code === 200
        ? this.$message.success('成功提交')
        : this.$message.error('提交失败');
      this.fileList = [];
      this.formLabelAlign.tableDatas.table10.map(item => {
        item.CauseAnalysis = item.CauseAnalysis.match(/[0-9]([\s\S]*?),/g);
      });
      this.formLabelAlign.tableDatas.table11.map(item => {
        item.CauseAnalysis = item.CauseAnalysis.match(/[0-9]([\s\S]*?),/g);
      });
      this.formLabelAlign.tableDatas.table12.map(item => {
        item.ProblemClassification = item.ProblemClassification.match(
          /[0-9]([\s\S]*?),/g
        );
        item.CauseAnalysis = item.CauseAnalysis.match(/[0-9]([\s\S]*?),/g);
      });
      this.formLabelAlign.tableDatas.table13.table13two.map(item => {
        item.Infusion = item.Infusion.match(/[0-9]([\s\S]*?),/g);
        item.CheckItem = item.CheckItem.match(/[0-9]([\s\S]*?),/g);
      });
      this.formLabelAlign.tableDatas.table16.CauseAnalysis = this.formLabelAlign.tableDatas.table16.CauseAnalysis.match(
        /[0-9]([\s\S]*?),/g
      );
      this.formLabelAlign.tableDatas.table17.CheckItem = this.formLabelAlign.tableDatas.table17.CheckItem.match(
        /[0-9]([\s\S]*?),/g
      );
      this.formLabelAlign.tableDatas.table18.Formalities = this.formLabelAlign.tableDatas.table18.Formalities.match(
        /[0-9]([\s\S]*?),/g
      );
    },
    handleSuccess(response, file, row) {
      if (response.code === 200) {
        const data = response.data[0];
        row.File_list.push({
          FileID: 0,
          CheckID: 0,
          FileName: data.FileName,
          FileUrl: data.FileUrl,
          OpenFileUrl: data.OpenFileUrl
        });
      } else {
        this.fileList = [];
        this.$message.error(file.name + '上传失败');
      }
    },
    async PreviewFile(val) {
      /* 资料预览 */
      val = val.replace(/\/Annex\/file\//, '');
      const { data } = await PreviewFile({ Title: val });
      this.$nextTick(() => {
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = data;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
      });
    },
    deleteFile(val, index) {
      switch (val) {
        case 15:
          this.formLabelAlign.tableDatas.table15.File_list.splice(index, 1);
          break;
        case 16:
          this.formLabelAlign.tableDatas.table15.File_list.splice(index, 1);
          break;
        case 17:
          this.formLabelAlign.tableDatas.table17.File_list.splice(index, 1);
          break;
        case 18:
          this.formLabelAlign.tableDatas.table18.File_list.splice(index, 1);
          break;
        case 19:
          this.formLabelAlign.tableDatas.table19.File_list.splice(index, 1);
          break;
      }
    }
  }
};
</script>

<style lang="scss">
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
.el-radio {
  margin-right: 2px;
  margin-left: 2px;
}
.table_item_header {
  display: flex;
  justify-content: space-between;
  p {
    border-bottom: 1px solid black;
  }
}
.el-form-item--mini .el-form-item__label {
  line-height: 15px !important;
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
</style>
