<template>
  <el-card class="box-card-view AdverseEvents_Report">

    <div slot="header" class="clearfix">
      <el-select
        v-model="event"
        size="mini"
        placeholder="请选择"
        :disabled="seeControl"
        @change="doSelectEvent"
        @focus="dianji"
      >
        <el-option
          v-for="(item, index) in eventOptions"
          :key="index"
          :label="item.EventName"
          :value="item.EventID"
        />
      </el-select>

      <el-button
        size="mini"
        type="success"
        :disabled="seeControl"

        @click="edChangeS(qixie=1)"
      >医疗器械(不良)事件（特定）
      </el-button>
      <el-button
        size="mini"
        type="success"
        :disabled="seeControl"
        @click="edChangeS(huli=2)"
      >护理安全(不良)事件（特定）
      </el-button>

      <el-button
        size="mini"
        type="success"
        :disabled="seeControl"
        @click="edChangeS(yiliao=3)"
      >医疗安全(不良)事件（特定）
      </el-button>

      <el-button
        size="mini"
        type="success"
        :disabled="seeControl"
        @click="edChangeS(yaopin=4)"
      >药品安全(不良)事件（特定）
      </el-button>

      <el-button
        size="mini"
        type="primary"
        :disabled="seeControl"
        @click="doSubmit"
      >{{ submitType }}
      </el-button>
      <el-button
        v-if="seeControl3"
        size="mini"
        type="primary"
        :disabled="seeControl"
        @click="edChange"
      >存为草稿
      </el-button>
      <el-button
        v-if="seeControl4"
        size="mini"
        type="primary"
        @click="submitChange"
      >提交报告
      </el-button>
      <el-button
        v-if="seeControl2"
        size="mini"
        type="primary"
        @click="exportEvent"
      >
        导出Excel
      </el-button>

      <el-button
        v-if="seeControl5"
        size="mini"
        type="primary"
        @click="exportWord"
      >
        导出Word
      </el-button>
      <el-button
        v-if="seeControl2"
        size="mini"
        type="primary"
        @click="back"
      >
        返回
      </el-button>


    </div>
    <div v-if="temName===0">
      <el-form label-position="top" size="mini" :rules="rules">
        <div v-loading="listLoading" class="main">
          <el-collapse v-model="activeNames" class="collapse" accordion>
            <el-collapse-item class="collapse-item" title="受损害者资料" name="1">
              <el-row>
                <el-col :span="9">
                  <el-form-item label="提交审核的科室部门">
                    <defaultDepts
                      v-model="formData.FindDepartmentID"
                      :disabled="seeControl"
                      :multiple="false"
                      w="300px"
                      @getDefaultDeptsValue="getDefaultDeptsValue"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row type="flex" :gutter="20">
                <el-col :span="9">
                  <el-form-item label="受损害者类型">
                    <el-input
                      v-model="formData.VictimType"
                      :disabled="seeControl"
                      placeholder=""
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="9">
                  <el-form-item label="医保卡号">
                    <el-input
                      v-model="formData.ClinicNumber"
                      :disabled="seeControl"
                      placeholder=""
                    >
                      <el-button slot="append" icon="el-icon-search" @click="searchClinicNumber(tongyongshijian=0)" />
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row type="flex" :gutter="20">
                <el-col :span="9">
                  <el-form-item label="患者姓名">
                    <el-input
                      v-model="formData.VictimName"
                      :disabled="seeControl"
                      placeholder=""
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="9">
                  <el-form-item label="患者性别">
                    <el-select
                      v-model="formData.Sex"
                      :disabled="seeControl"
                      placeholder="请选择"
                      style="width: 100%"
                      filterable
                      allow-create
                    >
                      <el-option
                        v-for="item in [{ value: '男' }, { value: '女' }]"
                        :key="item.value"
                        :label="item.value"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row type="flex" :gutter="20">
                <!--                <el-col :span="9">-->
                <!--                  <el-form-item label="出生日期">-->
                <!--                    <el-date-picker-->
                <!--                      v-model="formData.Birthday"-->
                <!--                      :disabled="seeControl"-->
                <!--                      type="date"-->
                <!--                      format="yyyy-MM-dd"-->
                <!--                      value-format="yyyy-MM-dd"-->
                <!--                      style="width: 100%"-->
                <!--                      placeholder="选择日期"-->
                <!--                    />-->
                <!--                  </el-form-item>-->
                <!--                </el-col>-->
                <el-col :span="9">
                  <el-form-item label="年龄">
                    <el-input
                      v-model.number="formData.Age"
                      :disabled="seeControl"
                      placeholder=""
                      @keyup.native="checkInt"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="9">
                  <el-form-item label="体重（KG）">
                    <el-input
                      v-model.number="formData.Weight"
                      :disabled="seeControl"
                      placeholder=""
                      @keyup.native="checkInt"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row type="flex" :gutter="20">
                <el-col :span="9">
                  <el-form-item
                    label="联系电话"
                  >
                    <el-input
                      v-model.number="formData.Phone"
                      :disabled="seeControl"
                      placeholder=""
                      @keyup.native="checkInt"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="9">
                  <el-form-item label="就诊形式">
                    <el-input
                      v-model="formData.TreatmentType"
                      :disabled="seeControl"
                      placeholder=""
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row type="flex" :gutter="20">
                <el-col :span="9">
                  <el-form-item label="就诊日期">
                    <el-date-picker
                      v-model="formData.TreatmentDate"
                      :disabled="seeControl"
                      style="width: 100%"
                      type="date"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      placeholder="选择日期"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="9">
                  <el-form-item label="民族">
                    <el-input
                      v-model="formData.Nation"
                      :disabled="seeControl"
                      placeholder=""
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row type="flex" :gutter="20">
                <el-col :span="9">
                  <el-form-item label="病人所在科室">
                    <el-input
                      v-model="formData.VictimDepartment"
                      :disabled="seeControl"
                      placeholder=""
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="9">
                  <el-form-item label="病人流水号">
                    <el-input
                      v-model="formData.SerialNumber"
                      :disabled="seeControl"
                      placeholder=""
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-collapse-item>
            <el-collapse-item class="collapse-item" title="事件资料" name="2">
              <el-row type="flex" :gutter="20">
                <el-col :span="9">
                  <el-form-item label="发现人">
                    <el-input
                      v-model="formData.FindName"
                      :disabled="seeControl"
                      placeholder=""
                    />
                  </el-form-item>
                </el-col>

              </el-row>
              <el-row type="flex" :gutter="20">
                <el-col :span="9">
                  <el-form-item label="不良事件级别">
                    <el-select
                      v-model="formData.Level"
                      :disabled="seeControl"
                      placeholder="请选择"
                      style="width: 100%"
                      filterable
                      allow-create
                    >
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="9">
                  <el-form-item label="伤害严重程度">
                    <el-input
                      v-model="formData.Severity"
                      :disabled="seeControl"
                      placeholder=""
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row type="flex" :gutter="20">
                <el-col :span="18">
                  <el-form-item label="事件过程">
                    <el-input
                      v-model="formData.Process"
                      :disabled="seeControl"
                      type="textarea"
                      :rows="2"
                      placeholder=""
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-collapse-item>
            <el-collapse-item class="collapse-item" title="事件基本类型" name="3">
              <el-row type="flex" :gutter="20">
                <el-col :span="9">
                  <el-form-item label="事件类别">
                    <el-select
                      v-model="formData.EventTypeID"
                      :disabled="seeControl"
                      placeholder="请选择"
                      style="width: 100%"
                      @change="eventTypeChange()"
                    >
                      <el-option
                        v-for="item in eventTypeOptions"
                        :key="item.EventTypeID"
                        :label="item.EventTypeName"
                        :value="item.EventTypeID"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <div v-html="problems" />
            </el-collapse-item>
            <el-collapse-item class="collapse-item" title="附件管理" name="4">
              <el-upload
                :disabled="seeControl"
                action="/api/AE_Report/UploadFile"
                multiple
                :file-list="fileList"
                :on-success="uploadSuccess"
                :on-change="uploadChange"
              >
                <el-button :disabled="seeControl" size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">可以上传多个文件</div>
              </el-upload>
              <el-table :data="formData.File_List">
                <el-table-column label="文件名">
                  <template slot-scope="{ row }">
                    <el-link type="primary" :href="row.FileUrl" target="_blank">{{
                      row.FileName
                    }}
                    </el-link>
                  </template>
                </el-table-column>
                <el-table-column label="查看">
                  <template slot-scope="{ row }">
                    <el-link
                      type="primary"
                      :href="row.OpenFileUrl"
                      target="_blank"
                    >打开
                    </el-link>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button
                      :disabled="seeControl"
                      size="mini"
                      circle
                      type="danger"
                      icon="el-icon-delete"
                      @click="deleteFile(scope.$index)"
                    />
                  </template>
                </el-table-column>
              </el-table>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-form>
    </div>
    <!-- 医疗器械不良事件报告表表格位置-->
    <div v-if="temName===1" style="border: 0.2vh solid #4a9de7" class="main">

      <div style="width:100%;font-size: 4vh;text-align: center;margin-top: 2vh;margin-bottom: 4vh">医疗器械(不良)事件报告表
      </div>
      <!--    表头位置开始-->
      <div class="tableHeaderKy">
        <div>
          <span>医保卡号：</span>
          <el-input
            v-model="yiLiaoQiXie.CaNumber"
            :disabled="seeControl"
            placeholder="请输入卡号"
          />
          <el-button size="mini" icon="el-icon-search" @click="searchClinicNumber(yiliaoqixie=1)" />
        </div>
      </div>

      <div class="tableHeaderKy">

        <div>
          <span>报告日期：</span>
          <div>
            <el-date-picker
              v-model="yiLiaoQiXie.ReportDate"
              :disabled="seeControl"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 100%;font-size: 1.8vh;padding-top: 2vh;padding-bottom: 2vh"
              placeholder="选择日期"
            />
          </div>
        </div>
        <div style="height: 10px">
          <span>提交审核的科室部门：</span>
          <defaultDepts
            v-model="yiLiaoQiXie.FindDepartmentID"
            :disabled="seeControl"
            :multiple="false"
            w="20vh"
            @getDefaultDeptsValue="getDefaultDeptsValue3"
          />
        </div>
      </div>
      <div class="tableHeaderKy">

        <div>报告来源：
          <el-radio v-model="yiLiaoQiXie.ReportSource" :disabled="seeControl" label="生产企业">生产企业</el-radio>
          <el-radio v-model="yiLiaoQiXie.ReportSource" :disabled="seeControl" label="经营企业">经营企业</el-radio>
          <el-radio v-model="yiLiaoQiXie.ReportSource" :disabled="seeControl" label="使用企业">使用企业</el-radio>
        </div>
        <div>单位名称：
          <el-input v-model="yiLiaoQiXie.ReportUnit" :disabled="seeControl" />
        </div>

      </div>
      <div class="tableHeaderKy">

        <div>联系地址：
          <el-input v-model="yiLiaoQiXie.Address" :disabled="seeControl" />
        </div>
        <div>邮编：
          <el-input v-model="yiLiaoQiXie.Zipcode" :disabled="seeControl" />
        </div>
        <div>联系电话：
          <el-input v-model="yiLiaoQiXie.Tele" :disabled="seeControl">></el-input>
        </div>
        <div>编码：
          <el-input v-model.number="yiLiaoQiXie.Code" :disabled="seeControl">></el-input>
        </div>
      </div>
      <!--    表头位置结束-->
      <!--    表格开始-->
      <table
        class="table"
        style="
          width: 90%;
          height:100%;
          margin-left: 6vh;
          font-size:1.8vh;"
        border
        cellspacing="0"
        cellpadding="0"
      >
        <!--      第1行-->
        <tr align="center">
          <td colspan="6"><span>A.患者资料</span></td>
        </tr>
        <!--      第2行-->
        <tr align="center">
          <td><span>1.患者姓名</span></td>
          <td>
            <el-input
              v-model="yiLiaoQiXie.PatientName"
              type="textarea"
              style="padding: 0;margin: 0;display:block;width:100%;height:100%;"
              :disabled="seeControl"
            >>
            </el-input>
          </td>

          <td><span>2.年龄</span></td>
          <td>
            <el-input v-model.number="yiLiaoQiXie.Age" type="textarea" :disabled="seeControl" />
          </td>

          <td><span>3.性别</span></td>
          <td>
            <el-select
              v-model="yiLiaoQiXie.Sex"
              :disabled="seeControl"
              placeholder="请选择"
              style="width: 100%"
              filterable
              allow-create
            >
              <el-option
                v-for="item in [{ value: '男' }, { value: '女' }]"
                :key="item.value"
                :label="item.value"
                :value="item.value"
              />
            </el-select>
          </td>


        </tr>
        <!--      第3行-->
        <tr align="center">
          <td><span>4.预期治疗疾病或作用</span></td>
          <td colspan="5">
            <el-input v-model="yiLiaoQiXie.Diseffect" type="textarea" :disabled="seeControl" />
          </td>
        </tr>

        <!--      第4行-->
        <tr align="center">
          <td colspan="6"><span>B．不良事件情况  </span></td>
        </tr>

        <!--      第5行-->
        <tr align="center">
          <td><span>5．事件主要表现</span></td>
          <td colspan="6">
            <el-input v-model="yiLiaoQiXie.EventMain" type="textarea" :disabled="seeControl" />
          </td>
        </tr>

        <!--      第6行-->
        <tr align="center">
          <td><span>6．事件发生日期</span></td>
          <td colspan="6">
            <el-date-picker
              v-model="yiLiaoQiXie.EventDate"
              :disabled="seeControl"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 100%;font-size: 1.8vh;padding-top: 2vh;padding-bottom: 2vh"
              placeholder="选择日期"
            />
          </td>
        </tr>

        <!--      第7行-->
        <tr align="center">
          <td><span>7. 医疗器械实际使用场所</span></td>
          <td colspan="5">
            <el-radio v-model="yiLiaoQiXie.ActualPlace" :disabled="seeControl" label="医院">医院</el-radio>
            <el-radio v-model="yiLiaoQiXie.ActualPlace" :disabled="seeControl" label="诊所">诊所</el-radio>
            <el-radio v-model="yiLiaoQiXie.ActualPlace" :disabled="seeControl" label="家庭">家庭</el-radio>
            <el-radio v-model="yiLiaoQiXie.ActualPlace" :disabled="seeControl" label="其他">其他（在陈述中说明）</el-radio>
          </td>
        </tr>

        <!--      第8行-->
        <tr align="center">
          <td rowspan="2"><span>8.事件后果</span></td>
          <td colspan="5">
            <el-radio v-model="yiLiaoQiXie.EventResult" :disabled="seeControl" label="死亡">死亡</el-radio>
            <el-radio v-model="yiLiaoQiXie.EventResult" :disabled="seeControl" label="威胁生命">威胁生命</el-radio>
            <el-radio v-model="yiLiaoQiXie.EventResult" :disabled="seeControl" label="机体功能结构永久损伤">机体功能结构永久损伤</el-radio>
            <el-radio v-model="yiLiaoQiXie.EventResult" :disabled="seeControl" label="外科治疗避免上述永久损伤">需要内、外科治疗避免上述永久损伤
            </el-radio>
            <el-radio v-model="yiLiaoQiXie.EventResult" :disabled="seeControl" label="其它">其它（在事件陈述中说明）</el-radio>
          </td>
        </tr>
        <!--      第9行-->
        <tr align="center">
          <td><span>  若死亡则填死亡时间</span></td>
          <td colspan="4">
            <el-date-picker
              v-model="yiLiaoQiXie.DeadDate"
              :disabled="seeControl"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 100%;font-size: 1.8vh;padding-top: 2vh;padding-bottom: 2vh"
              placeholder="选择日期"
            />
          </td>
        </tr>

        <!--      第10行-->
        <tr align="center">
          <td>
            <span>9.事件陈述：</span></td>
          <td colspan="6">
            <el-input
              v-model="yiLiaoQiXie.EventStatement"
              :disabled="seeControl"
              type="textarea"
              placeholder="至少包括器械使用时间、使用目的、使用依据、使用情况、出现的不良事件情况、对受害者影响、采取的治疗措施、器械联合使用情况"
            />
          </td>
        </tr>

        <!--      第11行-->
        <tr align="center">
          <td colspan="6"><span>C．医疗器械情况</span></td>
        </tr>
        <!--      第12行-->
        <tr align="center">
          <td><span>10．医疗器械分类名称</span></td>
          <td colspan="5">
            <el-input v-model="yiLiaoQiXie.MDCName" type="textarea" :disabled="seeControl" />
          </td>
        </tr>
        <!--      第13行-->
        <tr align="center">
          <td><span>11．商品名称</span></td>
          <td colspan="5">
            <el-input v-model="yiLiaoQiXie.TradeName" type="textarea" :disabled="seeControl" />
          </td>
        </tr>

        <!--      第14行-->
        <tr align="center">
          <td><span>12．注册证号</span></td>
          <td colspan="5">
            <el-input v-model="yiLiaoQiXie.CertificateNo" type="textarea" :disabled="seeControl" />
          </td>
        </tr>

        <!--      第15行-->
        <tr align="center">
          <td><span>13．生产企业名称</span></td>
          <td>
            <el-input v-model="yiLiaoQiXie.ManufactName" type="textarea" :disabled="seeControl" />
          </td>

          <td><span>生产企业地址</span></td>
          <td>
            <el-input v-model="yiLiaoQiXie.ManufactAdress" type="textarea" :disabled="seeControl" />
          </td>

          <td><span>企业联系电话</span></td>
          <td>
            <el-input v-model.number="yiLiaoQiXie.ManufactCall" type="textarea" :disabled="seeControl" />
          </td>
        </tr>

        <!--      第16行-->
        <tr align="center">
          <td><span>14．型号规格</span></td>
          <td>
            <el-input v-model="yiLiaoQiXie.PSpecification" type="textarea" :disabled="seeControl" />
          </td>

          <td><span>产品编号</span></td>
          <td>
            <el-input v-model="yiLiaoQiXie.PNumber" type="textarea" :disabled="seeControl" />
          </td>

          <td><span>产品批号</span></td>
          <td>
            <el-input v-model="yiLiaoQiXie.PBNumber" type="textarea" :disabled="seeControl" />
          </td>
        </tr>

        <!--      第17行-->
        <tr align="center">
          <td>15.操作人</td>
          <td colspan="5">
            <el-radio v-model="yiLiaoQiXie.Operator" :disabled="seeControl" label="专业人员">专业人员</el-radio>
            <el-radio v-model="yiLiaoQiXie.Operator" :disabled="seeControl" label="非专业人员">非专业人员</el-radio>
            <el-radio v-model="yiLiaoQiXie.Operator" :disabled="seeControl" label="患者">患者</el-radio>
            <el-radio v-model="yiLiaoQiXie.Operator" :disabled="seeControl" label="其他">其他</el-radio>
          </td>
        </tr>

        <!--      第18行-->
        <tr align="center">
          <td>16.有效期至</td>
          <td colspan="5">
            <el-date-picker
              v-model="yiLiaoQiXie.ValidDate"
              :disabled="seeControl"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 100%;font-size: 1.8vh;"
              placeholder="选择日期"
            />
          </td>
        </tr>

        <!--      第19行-->
        <tr align="center">
          <td>17.停用日期</td>
          <td colspan="5">
            <el-date-picker
              v-model="yiLiaoQiXie.StopDate"
              :disabled="seeControl"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 100%;font-size: 1.8vh;"
              placeholder="选择日期"
            />
          </td>
        </tr>

        <!--      第20行-->
        <tr align="center">
          <td>18.置入日期（若植入）</td>
          <td colspan="5">
            <el-date-picker
              v-model="yiLiaoQiXie.ImplantationDate"
              :disabled="seeControl"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 100%;font-size: 1.8vh;"
              placeholder="选择日期"
            />
          </td>
        </tr>

        <!--      第21行-->
        <tr align="center">
          <td>19.事件发生原因分析</td>
          <td colspan="5">
            <el-input v-model="yiLiaoQiXie.EventReason" :disabled="seeControl" type="textarea" />
          </td>
        </tr>

        <!--      第22行-->
        <tr align="center">
          <td>20.事件处理情况</td>
          <td colspan="5">
            <el-input v-model="yiLiaoQiXie.Treatment" :disabled="seeControl" type="textarea" />
          </td>
        </tr>

        <!--      第23行-->
        <tr align="center">
          <td>21.事件报告状态</td>
          <td colspan="5">
            <el-radio v-model="yiLiaoQiXie.EventRSate" :disabled="seeControl" label="已通知医院">已通知医院</el-radio>
            <el-radio v-model="yiLiaoQiXie.EventRSate" :disabled="seeControl" label="已通知企业">已通知企业</el-radio>
            <el-radio v-model="yiLiaoQiXie.EventRSate" :disabled="seeControl" label="已通知药监分局">已通知药监分局</el-radio>
          </td>
        </tr>

        <!--      第24行-->
        <tr align="center">
          <td colspan="6">D. 不良事件评价</td>
        </tr>

        <!--      第25行-->
        <tr align="center">
          <td>省级监测机构意见陈述</td>
          <td colspan="5">
            <el-input v-model="yiLiaoQiXie.ProValua" :disabled="seeControl" type="textarea" />
          </td>
        </tr>

        <!--      第26行-->
        <tr align="center">
          <td>国家监测机构意见陈述</td>
          <td colspan="5">
            <el-input v-model="yiLiaoQiXie.ConValua" :disabled="seeControl" type="textarea" />
          </td>
        </tr>

      </table>

      <div class="tableHeaderKy" style="justify-content: center!important;">

        <div>报告人：
          <el-radio v-model="yiLiaoQiXie.ReportTitle" :disabled="seeControl" label="医师">医师</el-radio>
          <el-radio v-model="yiLiaoQiXie.ReportTitle" :disabled="seeControl" label="技师">技师</el-radio>
          <el-radio v-model="yiLiaoQiXie.ReportTitle" :disabled="seeControl" label="护士">护士</el-radio>
          <el-radio v-model="yiLiaoQiXie.ReportTitle" :disabled="seeControl" label="其他">其他</el-radio>
        </div>
        <div>报告人签名：
          <el-input v-model.trim="yiLiaoQiXie.ReportUser" :disabled="seeControl" />
        </div>

      </div>

      <!--      附件上传-->
      <div>
        附件上传
        <el-upload
          :disabled="seeControl"
          action="/api/AE_Report/UploadFile"
          multiple
          :file-list="fileList1"
          :on-success="uploadSuccess1"
          :on-change="uploadChange"
        >
          <el-button :disabled="seeControl" size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">可以上传多个文件</div>
        </el-upload>
        <el-table :data="yiLiaoQiXie.File_List">
          <el-table-column label="文件名">
            <template slot-scope="{ row }">
              <el-link type="primary" :href="row.FileUrl" target="_blank">{{
                row.FileName
              }}
              </el-link>
            </template>
          </el-table-column>

          <el-table-column label="查看">
            <template slot-scope="{ row }">
              <el-link
                type="primary"
                :href="row.OpenFileUrl"
                target="_blank"
              >打开
              </el-link>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                :disabled="seeControl"
                size="mini"
                circle
                type="danger"
                icon="el-icon-delete"
                @click="deleteFile(scope.$index)"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>

    </div>
    <!--    表格结束-->
    <!-- 护理不良事件报告表表格位置-->
    <div v-else-if="temName===2" style="border:0.2vh solid #4a9de7;margin-bottom: 2vh" class="main">
      <div style="width:100%;font-size: 4vh;text-align: center;margin-top: 2vh;margin-bottom: 4vh">护理安全(不良)事件报告表</div>
      <div class="tableHeaderKy">
        <div>
          <span>医保卡号：</span>
          <el-input
            v-model="HuLi.CaNumber"
            :disabled="seeControl"
            placeholder="请输入卡号"
          />
          <el-button size="mini" icon="el-icon-search" @click="searchClinicNumber(huli=2)" />
        </div>


          <div class="div1"><span>提交审核的科室部门：</span>
          <defaultDepts
            v-model="HuLi.FindDepartmentID"
            :disabled="seeControl"
            :multiple="false"
            w="300px"
            @getDefaultDeptsValue="getDefaultDeptsValue2"
          />
          </div>

      </div>
      <table
        class="table"
        style="
         width:90%;
        height:78%;
        font-size:1.8vh;
        margin-left: 6vh;
        margin-bottom: 2vh"
        border
        cellspacing="0"
        cellpadding="0"
      >
        <!--      <caption style="font-size:1.8vh;font-weight:bold;"></caption>-->
        <tr align="center">
          <td>
            <div class="div1">事件类型</div>
          </td>
          <td>
            <el-input v-model="HuLi.EventCategory" type="textarea" :disabled="seeControl" />
          </td>
          <td>
            <div class="div1">发生日期及时间点</div>
          </td>
          <td>
            <el-date-picker
              v-model="HuLi.OccurDate"
              :disabled="seeControl"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 100%;font-size: 1.8vh;height: 100%;padding: 0"
              placeholder="选择日期"
            />
          </td>
          <td>
            <div class="div1">班次</div>
          </td>
          <td colspan="4">
            <el-input v-model="HuLi.Shift" type="textarea" :disabled="seeControl" />
          </td>
        </tr>

        <tr align="center">
          <td rowspan="2">
            <div class="div1">患者资料</div>
          </td>


          <td>
            <div class="div1">姓名</div>
          </td>
          <td>
            <el-input
              v-model="HuLi.PatientName"
              type="textarea"
              :disabled="seeControl"
              placeholder=""
            />
          </td>
          <td>
            <div class="div1">年龄</div>
          </td>
          <td>
            <el-input
              v-model="HuLi.Age"
              type="textarea"
              :disabled="seeControl"
              placeholder=""
            />
          </td>
          <td>
            <div class="div1">性别</div>
          </td>
          <td>
            <el-select
              v-model="HuLi.Sex"
              :disabled="seeControl"
              placeholder="请选择"
              style="width: 100%"
              filterable
              allow-create
            >
              <el-option
                v-for="item in [{ value: '男' }, { value: '女' }]"
                :key="item.value"
                :label="item.value"
                :value="item.value"
              />
            </el-select>
          </td>
          <td>
            <div class="div1">住院号</div>
          </td>
          <td>
            <el-input
              v-model="HuLi.InpatientNumber"
              type="textarea"
              :disabled="seeControl"
              placeholder=""
            />
          </td>
        </tr>


        <tr align="center">


          <td>
            <div class="div1">所在床号</div>
          </td>
          <td>
            <el-input
              v-model="HuLi.BedNumber"
              type="textarea"
              :disabled="seeControl"
              placeholder=""
            />
          </td>
          <td>
            <div class="div1">诊断</div>
          </td>
          <td colspan="5">
            <el-input
              v-model="HuLi.Diagnosis"
              type="textarea"
              :disabled="seeControl"
              placeholder=""
            />
          </td>

        </tr>


        <tr align="center">
          <td>
            <div class="div1">事件经过、处理过程及后果</div>
          </td>
          <td colspan="8">
            <el-input
              v-model="HuLi.Process"
              :disabled="seeControl"
              type="textarea"
              :rows="2"
              placeholder=""
            />
          </td>
        </tr>

        <tr align="center">
          <td>
            <div class="div1">原因分析</div>
          </td>
          <td colspan="8">
            <el-input v-model="HuLi.CauseAnalysis" :disabled="seeControl" type="textarea" />
          </td>
        </tr>

        <tr align="center">
          <td>
            <div class="div1">整改措施</div>
          </td>
          <td colspan="8">
            <el-input v-model="HuLi.Measures" :disabled="seeControl" type="textarea" />
          </td>
        </tr>

        <tr align="center">
          <td>
            <div>报告护士</div>
          </td>
          <td>
            <el-input v-model.trim="HuLi.ReportUser" type="textarea" :disabled="seeControl" />
          </td>
          <td>
            <div class="myInput">护士长</div>
          </td>
          <td>
            <el-input v-model="HuLi.HeadNurse" type="textarea" :disabled="seeControl" />
          </td>

          <td>
            <div>报告日期</div>
          </td>
          <td colspan="4">
            <el-date-picker
              v-model="HuLi.ReportDate"
              :disabled="seeControl"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 100%"
              placeholder="选择日期"
            />
          </td>

        </tr>
        <tr align="center">
          <td>
            <div>部门意见</div>
          </td>
          <td colspan="8">
            <el-input v-model="HuLi.Opinions" :disabled="seeControl" type="textarea" />
          </td>
        </tr>
        <tr align="center">
          <td>
            <div class="myInput">部门签名</div>
          </td>
          <td>
            <el-input v-model="HuLi.Sign" type="textarea" :disabled="seeControl" />
          </td>
          <td>
            <div class="myInput">签字日期</div>
          </td>
          <td colspan="8">
            <el-date-picker
              v-model="HuLi.ReportDate2"
              :disabled="seeControl"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 100%"
              placeholder="选择日期"
            />
          </td>
        </tr>


      </table>

      <!--      附件上传-->
      <div>
        附件上传
        <el-upload
          :disabled="seeControl"
          action="/api/AE_Report/UploadFile"
          multiple
          :file-list="fileList2"
          :on-success="uploadSuccess2"
          :on-change="uploadChange"
        >
          <el-button :disabled="seeControl" size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">可以上传多个文件</div>
        </el-upload>
        <el-table :data="HuLi.File_List">
          <el-table-column label="文件名">
            <template slot-scope="{ row }">
              <el-link type="primary" :href="row.FileUrl" target="_blank">{{
                row.FileName
              }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column label="查看">
            <template slot-scope="{ row }">
              <el-link
                type="primary"
                :href="row.OpenFileUrl"
                target="_blank"
              >打开
              </el-link>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                :disabled="seeControl"
                size="mini"
                circle
                type="danger"
                icon="el-icon-delete"
                @click="deleteFile(scope.$index)"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>

    </div>
    <!--    表格结束-->

    <!-- 医疗安全（不良）事件报告表表格位置-->
    <div v-else-if="temName===3" style="border: 0.2vh solid #4a9de7;margin-bottom: 2vh;" class="main">
      <div style="width:100%;font-size: 4vh;text-align: center;margin-top: 2vh;margin-bottom: 4vh">医疗安全(不良)事件报告表
      </div>
      <div class="tableHeaderKy">
        <div>
          <span>医保卡号：</span>
          <el-input
            v-model="yiLiaoAnQuan.CaNumber"
            :disabled="seeControl"
            placeholder="请输入卡号"
          />
          <el-button size="mini" icon="el-icon-search" @click="searchClinicNumber(yiliaoanquan=3)" />
        </div>
        <div><span> 提交审核的科室部门：</span>
          <defaultDepts
            v-model="yiLiaoAnQuan.FindDepartmentID"
            :disabled="seeControl"
            :multiple="false"
            w="300px"
            @getDefaultDeptsValue="getDefaultDeptsValue4"
          />
        </div>
      </div>
      <!--    表头位置开始-->
      <div class="tableHeaderKy">
        <div>
          <span>报告日期：</span>
          <div>
            <el-date-picker
              v-model="yiLiaoAnQuan.ReportDate"
              :disabled="seeControl"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 100%;font-size: 1.8vh;"
              placeholder="选择日期"
            />
          </div>
        </div>
        <div>
          <span>事件发生日期：</span>
          <div>
            <el-date-picker
              v-model="yiLiaoAnQuan.EventDate"
              :disabled="seeControl"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 100%;font-size: 1.8vh;padding-top: 2vh;padding-bottom: 2vh"
              placeholder="选择日期"
            />
          </div>
        </div>
      </div><!--    表头位置结束-->
      <!--   表格开始-->
      <table
        class="table"
        style="
        width:80%;
        height:100%;
        font-size:1.8vh;
        margin-left: 12vh;
"
        border
        cellspacing="0"
        cellpadding="0"
      >
        <!--      第1行-->
        <tr align="center" style="width: auto">
          <td><span>A.患者资料（姓名）</span></td>
          <td colspan="5">
            <el-input v-model="yiLiaoAnQuan.PatientName" type="textarea" :disabled="seeControl" />
          </td>
        </tr>
        <!--      第2行-->
        <tr align="center">
          <td><span>1.性别</span></td>
          <td>
            <el-select
              v-model="yiLiaoAnQuan.Sex"
              :disabled="seeControl"
              placeholder="请选择"
              style="width: 100%"
              filterable
              allow-create
            >
              <el-option
                v-for="item in [{ value: '男' }, { value: '女' }]"
                :key="item.value"
                :label="item.value"
                :value="item.value"
              />
            </el-select>
          </td>

          <td><span>2.年龄</span></td>
          <td>
            <el-input v-model.number="yiLiaoAnQuan.Age" type="textarea" :disabled="seeControl" />
          </td>

          <td><span>3.职别</span></td>
          <td>
            <el-input v-model.trim="yiLiaoAnQuan.Position" type="textarea" :disabled="seeControl" />
          </td>
        </tr>
        <!--      第4行-->
        <tr align="center">
          <td><span>4.诊疗时间</span></td>
          <td>
            <div>
              <el-date-picker
                v-model="yiLiaoAnQuan.TreatDate"
                :disabled="seeControl"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%;font-size: 1.8vh;"
                placeholder="选择日期"
              />
            </div>
          </td>

          <td><span>5.临床诊断</span></td>
          <td colspan="3">
            <el-input v-model="yiLiaoAnQuan.Diagnosis" :disabled="seeControl" type="textarea" />
          </td>
        </tr>
        <!--      第5行-->
        <tr align="center">
          <td><span>6.在场相关人员或相关科室</span></td>
          <td colspan="5">
            <el-input v-model="yiLiaoAnQuan.Diagnostic" :disabled="seeControl" type="textarea" />
          </td>
        </tr>

        <!--      第6行-->
        <tr align="center">
          <td colspan="6"><span>B.不良事件情况 *</span></td>
        </tr>
        <!--      第7行-->
        <tr align="center">
          <td><span>7.事件发生场所</span></td>
          <td colspan="5">
            <el-radio v-model="yiLiaoAnQuan.Place" :disabled="seeControl" label="急诊" />
            <el-radio v-model="yiLiaoAnQuan.Place" :disabled="seeControl" label="门诊" />
            <el-radio v-model="yiLiaoAnQuan.Place" :disabled="seeControl" label="住院部" />
            <el-radio v-model="yiLiaoAnQuan.Place" :disabled="seeControl" label="医技部门" />
            <el-radio v-model="yiLiaoAnQuan.Place" :disabled="seeControl" label="手术室" />
            <el-radio v-model="yiLiaoAnQuan.Place" :disabled="seeControl" label="行政后勤部门" />
            <el-radio v-model="yiLiaoAnQuan.Place" :disabled="seeControl" label="其他" />
            <!--                <el-radio v-model="yiLiaoAnQuan.Place" label="医技部门"></el-radio>-->
          </td>
        </tr>
        <!--      第8行-->
        <tr align="center">
          <td><span>8.不良后果</span></td>
          <td colspan="2">
            <el-radio v-model="yiLiaoAnQuan.Result" :disabled="seeControl" label="无" />
            <el-radio v-model="yiLiaoAnQuan.Result" :disabled="seeControl" label="有" />
          </td>
          <td><span>如果有不良后果，具体详情</span></td>
          <td colspan="2">
            <el-input v-model="yiLiaoAnQuan.Resulthave" :disabled="seeControl" type="textarea" />
          </td>
        </tr>

        <!--      第9行-->
        <tr align="center">
          <td><span>事情经过</span></td>
          <td colspan="5">
            <el-input v-model="yiLiaoAnQuan.Process" :disabled="seeControl" type="textarea" />
          </td>
        </tr>

        <!--      第9行-->
        <tr align="center">
          <td colspan="6"><span>C．不良事件类别 * </span></td>
        </tr>

        <!--      第10行-->
        <tr align="left">
          <td colspan="6" style="font-size: 1.8vh">
            <el-radio
              v-model="yiLiaoAnQuan.EventCategory"
              :disabled="seeControl"
              label="1.信息传递错误事件：医师、护理、医技判定意见错误、医嘱错误（口头及书面）、其它传递方式错误"
            />
            <el-radio
              v-model="yiLiaoAnQuan.EventCategory"
              :disabled="seeControl"
              label="2.治疗错误事件：患者、部位、器材、剂量等选择错误；不认真查对事件"
            />
            <el-radio
              v-model="yiLiaoAnQuan.EventCategory"
              :disabled="seeControl"
              label="3.方法/技术错误事件：遗忘、未治疗、延期、时间或程序错误、不必要的治疗、灭菌/消毒错误、体位错误等"
            />
            <el-radio
              v-model="yiLiaoAnQuan.EventCategory"
              :disabled="seeControl"
              label="4.药物调剂分发错误事件：医嘱、处方、给药、调剂等不良事件"
            />
            <el-radio
              v-model="yiLiaoAnQuan.EventCategory"
              :disabled="seeControl"
              label="5.输血事件：医嘱、备血、传送及输血不当引起的不良事件"
            />
            <el-radio
              v-model="yiLiaoAnQuan.EventCategory"
              :disabled="seeControl"
              label="6.设备器械使用事件：设备故障或使用不当导致的不良事件"
            />
            <el-radio
              v-model="yiLiaoAnQuan.EventCategory"
              :disabled="seeControl"
              label="7.医疗技术检查事件：检查人员无资质、标本丢失或弄错标本、试剂管理、医疗信息沟通错误；迟报、漏报、错报结果等"
            />
            <el-radio
              v-model="yiLiaoAnQuan.EventCategory"
              :disabled="seeControl"
              label="8.基础护理事件：如摔倒、坠床、误吸、误咽、未按医嘱执行禁食/禁水、无约束固定、烧烫伤事件等"
            />
            <el-radio
              v-model="yiLiaoAnQuan.EventCategory"
              :disabled="seeControl"
              label="9.营养与饮食事件： 如饮食类别错误、未按医嘱用餐或禁食等"
            />
            <el-radio
              v-model="yiLiaoAnQuan.EventCategory"
              :disabled="seeControl"
              label="10.物品运送事件：如延迟、遗忘、丢失、破损、未按急需急送、品种规格错误等"
            />
            <el-radio
              v-model="yiLiaoAnQuan.EventCategory"
              :disabled="seeControl"
              label="11.放射安全事件：如放射线泄露、放射性物品丢失、未行防护、误照射等"
            />
            <el-radio
              v-model="yiLiaoAnQuan.EventCategory"
              :disabled="seeControl"
              label="12.诊疗记录事件：包括诊疗记录丢失、未按要求记录、记录内容失实或涂改、无资质人员书写记录等"
            />
            <el-radio
              v-model="yiLiaoAnQuan.EventCategory"
              :disabled="seeControl"
              label="13.知情同意事件：如知情告知不准确、未行知情告知、未告知先签字同意、告知与书面记录不一致、未行签字同意等"
            />
            <el-radio
              v-model="yiLiaoAnQuan.EventCategory"
              :disabled="seeControl"
              label="14.非预期事件：非预期重返ICU或延长住院时间"
            />
            <el-radio
              v-model="yiLiaoAnQuan.EventCategory"
              :disabled="seeControl"
              label="15.医护安全事件：包括针刺、锐器刺伤、接触化疗药、传染病等导致损害的不良事件"
            />
            <el-radio
              v-model="yiLiaoAnQuan.EventCategory"
              :disabled="seeControl"
              label="16.不作为事件：医疗护理工作中已发现问题，但未及时处理及汇报，导致的不良后果加重等事件"
            />

            <el-radio
              v-model="yiLiaoAnQuan.EventCategory"
              :disabled="seeControl"
              label="17. 导管操作事件：静点滴漏/渗、导管脱落/断裂/堵塞、连接错误等"
            />
            <el-radio v-model="yiLiaoAnQuan.EventCategory" :disabled="seeControl" label="18.其它事件：非上列之异常事件" />
          </td>

          <!--          <td colspan="3">-->
          <!--   -->
          <!--          </td>-->
        </tr>

        <!--      第11行-->
        <tr align="center">
          <td colspan="6"><span>D.不良事件的等级 *</span></td>
        </tr>
        <!--      第12行-->
        <tr align="center">
          <td colspan="6">
            <el-radio v-model="yiLiaoAnQuan.EventDegree" :disabled="seeControl" label="Ⅰ级事件" />
            <el-radio v-model="yiLiaoAnQuan.EventDegree" :disabled="seeControl" label="Ⅱ级事件" />
            <el-radio v-model="yiLiaoAnQuan.EventDegree" :disabled="seeControl" label="Ⅲ级事件" />
            <el-radio v-model="yiLiaoAnQuan.EventDegree" :disabled="seeControl" label="Ⅳ级事件" />
          </td>
        </tr>
        <!--      第13行-->
        <tr align="center">
          <td colspan="6"><span>E．事件发生后及时处理与分析 *</span></td>
        </tr>

        <!--      第14行-->
        <tr align="center">
          <td colspan="2"><span>导致事件的可能原因</span></td>
          <td colspan="4">
            <el-input v-model="yiLiaoAnQuan.Causes" :disabled="seeControl" type="textarea" />
          </td>

        </tr>
        <tr align="center">
          <td colspan="2"><span>事件处理情况（提供补救措施或改善建议）</span></td>
          <td colspan="4">
            <el-input v-model="yiLiaoAnQuan.Handle" :disabled="seeControl" type="textarea" />
          </td>
        </tr>
        <!--      第15行-->
        <tr align="center">
          <td colspan="6"><span>F. 不良事件评价（主管部门填写）</span></td>
        </tr>

        <!--      第16行-->
        <tr align="center">
          <td colspan="6">
            <el-input v-model="yiLiaoAnQuan.Evaluate" :disabled="seeControl" type="textarea" />
          </td>
        </tr>

        <!--      第17行-->
        <tr align="center">
          <td colspan="6"><span>G．持续改进措施（主管部门或医疗质量管理委员会填写）</span></td>
        </tr>

        <!--      第18行-->
        <tr align="center">
          <td colspan="6">
            <el-input v-model="yiLiaoAnQuan.Measures" :disabled="seeControl" type="textarea" />
          </td>
        </tr>

        <!--      第19行-->
        <tr align="center">
          <td colspan="6"><span>H．选择性填写项目 （Ⅰ、Ⅱ级事件必填 ﹡，Ⅲ、Ⅳ级事件建议填写）</span></td>
        </tr>

        <!--      第20行-->
        <tr align="center">
          <td colspan="2"><span>报告人</span></td>
          <td colspan="4">
            <el-radio v-model="yiLiaoAnQuan.ReportUser" :disabled="seeControl" label="医师" />
            <el-radio v-model="yiLiaoAnQuan.ReportUser" :disabled="seeControl" label="技师" />
            <el-radio v-model="yiLiaoAnQuan.ReportUser" :disabled="seeControl" label="护理人员" />
            <el-radio v-model="yiLiaoAnQuan.ReportUser" :disabled="seeControl" label="其他" />
          </td>
        </tr>

        <!--      第21行-->
        <tr align="center">
          <td colspan="2"><span>当事人的类别</span></td>
          <td colspan="4">
            <el-radio v-model="yiLiaoAnQuan.Classification" :disabled="seeControl" label="本院" />
            <el-radio v-model="yiLiaoAnQuan.Classification" :disabled="seeControl" label="进修生" />
            <el-radio v-model="yiLiaoAnQuan.Classification" :disabled="seeControl" label="研究生" />
            <el-radio v-model="yiLiaoAnQuan.Classification" :disabled="seeControl" label="学生" />
            <el-radio v-model="yiLiaoAnQuan.Classification" :disabled="seeControl" label="不详" />
          </td>
        </tr>
        <!--      第22行-->
        <tr align="center">
          <td colspan="2"><span>职称</span></td>
          <td colspan="4">
            <el-radio v-model="yiLiaoAnQuan.Level" :disabled="seeControl" label="高级" />
            <el-radio v-model="yiLiaoAnQuan.Level" :disabled="seeControl" label="中级" />
            <el-radio v-model="yiLiaoAnQuan.Level" :disabled="seeControl" label="初级" />
            <el-radio v-model="yiLiaoAnQuan.Level" :disabled="seeControl" label="士级" />
          </td>
        </tr>
      </table>

      <!--      第23行-->
      <div class="tableHeader">
        <div><span> 报告人签名：</span></div>
        <div>
          <el-input v-model.trim="yiLiaoAnQuan.Sign" :disabled="seeControl" />
        </div>




        <div><span> 科室：</span></div>
        <div>
          <el-input v-model="yiLiaoAnQuan.InpatientDept" :disabled="seeControl" />
        </div>

        <div><span> 联系号码：</span></div>
        <div>
          <el-input v-model.number="yiLiaoAnQuan.Cal" :disabled="seeControl" />
        </div>

      </div>


      <!--      附件上传-->
      <div>
        附件上传
        <el-upload
          :disabled="seeControl"
          action="/api/AE_Report/UploadFile"
          multiple
          :file-list="fileList3"
          :on-success="uploadSuccess3"
          :on-change="uploadChange"
        >
          <el-button :disabled="seeControl" size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">可以上传多个文件</div>
        </el-upload>
        <el-table :data="yiLiaoAnQuan.File_List">
          <el-table-column label="文件名">
            <template slot-scope="{ row }">
              <el-link type="primary" :href="row.FileUrl" target="_blank">{{
                row.FileName
              }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column label="查看">
            <template slot-scope="{ row }">
              <el-link
                type="primary"
                :href="row.OpenFileUrl"
                target="_blank"
              >打开
              </el-link>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                :disabled="seeControl"
                size="mini"
                circle
                type="danger"
                icon="el-icon-delete"
                @click="deleteFile(scope.$index)"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div style="margin-top: 2vh;padding-left: 4vh">
        <div>
          <el-tag type="info">1、不良事件定义（medical adverse event）是指在临床诊疗活动中以及医院运行过程中， 任何可能影响病人的诊疗结果、
          </el-tag>
        </div>

        <div>
          <el-tag type="info"> 增加病人的痛苦和负担并可能引发医疗纠纷或医疗事故，以及影响医疗工作的正常运行和医务人员人身安全的因素和事件。不良事件包括可预防的和不可预防的两种。
          </el-tag>
        </div>

        <div>
          <el-tag type="info">2、报告范围：凡在医院内发生的或在院外转运病人时发生的不良事件均属主动报告的范围。</el-tag>
        </div>
        <div>
          <el-tag type="info"> 3、Ⅰ级事件（警告事件）：非预期的死亡，或是非疾病自然进展过程中造成永久性功能丧失。</el-tag>
        </div>
        <div>
          <el-tag type="info"> 4、Ⅱ级事件（不良后果事件）：在疾病医疗过程中是因诊疗活动而非疾病本身造成的病人机体与功能损害。</el-tag>
        </div>
        <div>
          <el-tag type="info">5、Ⅲ级事件（未造成后果事件）：虽然发生的错误事实，但未给病人机体与功能造成任何损害，或有轻微后果而不需任何处理可完全康复。</el-tag>
        </div>
        <div>
          <el-tag type="info"> 6、Ⅳ级事件（隐患事件）：由于及时发现错误，但未形成事实。</el-tag>
        </div>
        <div>
          <el-tag type="info"> 7、﹡为必填项。</el-tag>
        </div>
      </div>
    </div>
    <!--    表格结束-->

    <!-- 药品不良反应事件报告表表格位置-->
    <div v-else-if="temName===4" style="border: 0.2vh solid #4a9de7;margin-bottom: 2vh" class="main">
      <div style="width:100%;font-size: 4vh;text-align: center;margin-top: 2vh;margin-bottom: 4vh">药品安全(不良)事件报告表
      </div>
      <!--表头位置-->
      <div class="tableHeaderKy">
        <div>
          <span>医保卡号：</span>
          <el-input
            v-model="yaoPin.CaNumber"
            :disabled="seeControl"
            placeholder="请输入卡号"
          />
          <el-button size="mini" icon="el-icon-search" @click="searchClinicNumber(yaopin=4)" />
        </div>
      </div>
      <div class="tableHeaderKy">
        <div><span>提交审核的科室部门：</span>
          <defaultDepts
            v-model="yaoPin.FindDepartmentID"
            :disabled="seeControl"
            :multiple="false"
            w="300px"
            @getDefaultDeptsValue="getDefaultDeptsValue5"
          />


        </div>
        <span>报告来源：</span>
        <el-radio v-model="yaoPin.ReportSourse" :disabled="seeControl" label="医疗卫生机构" />
        <el-radio v-model="yaoPin.ReportSourse" :disabled="seeControl" label="生产企业经营企业" />
        <el-radio v-model="yaoPin.ReportSourse" :disabled="seeControl" label="个人" />

        <!--          <el-input :disabled="seeControl" v-model="yaoPin.Dept"/>-->
      </div>
      <div class="tableHeaderKy">
        <div>
          <span>严重程度：</span>
          <el-radio v-model="yaoPin.Degree" :disabled="seeControl" label="新的" />
          <el-radio v-model="yaoPin.Degree" :disabled="seeControl" label="严重" />
          <el-radio v-model="yaoPin.Degree" :disabled="seeControl" label="一般" />
        </div>

        <div style="margin-left: 10%">
          <span> 编码:</span>

          <el-input v-model="yaoPin.Code" :disabled="seeControl" />
        </div>
      </div>
      <div class="tableHeaderKy">
        <div>
          <span> 单位名称:</span>
          <el-input v-model="yaoPin.UnitName" :disabled="seeControl" />
        </div>


        <div>电话：
          <el-input v-model="yaoPin.Tel" :disabled="seeControl" />
        </div>

        <div>
          <span>报告日期：</span>
          <el-date-picker
            v-model="yaoPin.ReportDate"
            :disabled="seeControl"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 80%;

"
            placeholder="选择日期"
          />
        </div>


      </div>
      <!--表格位置-->
      <table
        class="table"
        style="
            width: 90%;
            height:100%;
            align:center;
            font-size:1.8vh;
            margin-left: 6vh;
            margin-bottom: 2vh;
"
        border
        cellspacing="0"
        cellpadding="0"
      >
        <tr align="center">
          <td>
            <span>患者姓名</span>
          </td>
          <td>
            <el-input v-model="yaoPin.PatientName" type="textarea" :disabled="seeControl" />
          </td>

          <td>
            <span>性别</span>
          </td>
          <td>
            <el-select
              v-model="yaoPin.Sex"
              :disabled="seeControl"
              placeholder="请选择"
              style="width: 100%"
              filterable
              allow-create
            >
              <el-option
                v-for="item in [{ value: '男' }, { value: '女' }]"
                :key="item.value"
                :label="item.value"
                :value="item.value"
              />
            </el-select>

          </td>

          <td>
            <span>年龄</span>
          </td>
          <td>
            <el-input v-model="yaoPin.Age" type="textarea" :disabled="seeControl" />

          </td>

          <td>
            <span>民族</span>
          </td>
          <td>
            <el-input v-model="yaoPin.Nation" type="textarea" :disabled="seeControl" />
          </td>

          <td>
            <span>体重(kg)</span>
          </td>
          <td>
            <el-input v-model="yaoPin.Weight" type="textarea" :disabled="seeControl" />
          </td>

          <td>
            <span>联系方式</span>
          </td>
          <td>
            <el-input v-model.number="yaoPin.ContactTel" type="textarea" :disabled="seeControl" />
          </td>
        </tr>

        <tr align="center">
          <td>
            <span>家族药品不良反应/事件</span>
          </td>
          <td colspan="5">
            <el-radio v-model="yaoPin.FReaction" :disabled="seeControl" label="有" />
            <el-radio v-model="yaoPin.FReaction" :disabled="seeControl" label="无" />
            <el-radio v-model="yaoPin.FReaction" :disabled="seeControl" label="不详" />
          </td>

          <td colspan="2">
            <span>既往药品不良反应/事件情况</span>
          </td>
          <td colspan="5">
            <el-radio v-model="yaoPin.BReaction" :disabled="seeControl" label="有" />
            <el-radio v-model="yaoPin.BReaction" :disabled="seeControl" label="无" />
            <el-radio v-model="yaoPin.BReaction" :disabled="seeControl" label="不详" />
          </td>

        </tr>

        <tr align="center">
          <td>
            <span>不良反应/事件名称</span>
          </td>
          <td colspan="2">
            <el-input v-model="yaoPin.ReactionName" :disabled="seeControl" type="textarea" />
          </td>

          <td>
            <span>不良反应/事件发生时间</span>
          </td>
          <td colspan="3">
            <el-date-picker
              v-model="yaoPin.ReactionDate"
              :disabled="seeControl"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 100%"
              placeholder="选择日期"
            />
          </td>

          <td colspan="2">
            <span>病历号/门诊号（企业填写医院名称）</span>
          </td>
          <td colspan="3">
            <el-input v-model="yaoPin.MedicalNumber" type="textarea" :disabled="seeControl" />
          </td>

        </tr>

        <tr align="center">
          <td colspan="4"><span>不良反应/事件过程描述（包括症状、体征、临床检验等）及处理情况</span></td>
          <td colspan="8">
            <el-input v-model="yaoPin.ReactionDescribe" :disabled="seeControl" type="textarea" />
          </td>
        </tr>

        <tr align="center">
          <td colspan="2"><span>商品名称</span></td>
          <td colspan="2"><span>通用名称（含剂型，监测期内品种用*注明）</span></td>
          <td colspan="2"><span>生产厂家</span></td>
          <td><span>批号</span></td>
          <td><span>用法用量</span></td>
          <td colspan="2"><span>用药起止时间</span></td>
          <td colspan="2"><span>用药原因</span></td>
        </tr>

        <!--      怀疑药品开始-->
        <!--怀疑药品第一行-->
        <tr align="center">
          <td rowspan="1"><span>怀疑药品</span></td>
          <td colspan="1">
            <el-input v-for="item in yaoPin.DoubtMedical" v-model="item.TradeName" type="textarea" />
          </td>
          <td colspan="2">
            <el-input v-for="item in yaoPin.DoubtMedical" v-model="item.CommonName" type="textarea" />
          </td>
          <td colspan="2">
            <el-input v-for="item in yaoPin.DoubtMedical" v-model="item.ManufactName" type="textarea" />
          </td>
          <td colspan="1">
            <el-input v-for="item in yaoPin.DoubtMedical" v-model="item.PBNumber" type="textarea" />
          </td>
          <td colspan="1">
            <el-input v-for="item in yaoPin.DoubtMedical" v-model="item.UseConsumption" type="textarea" />
          </td>
          <td colspan="1">
            <el-date-picker
              v-for="item in yaoPin.DoubtMedical"
              v-model="item.MedicalSDate"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 22vh;font-size:1.3vh"
              placeholder="选择日期"
            />
          </td>
          <td colspan="1">
            <el-date-picker
              v-for="item in yaoPin.DoubtMedical"
              v-model="item.MedicalEDate"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 22vh;font-size:1.3vh"
              placeholder="选择日期"
            />
          </td>
          <td colspan="2">
            <el-input v-for="item in yaoPin.DoubtMedical" v-model="item.MedicalReason" type="textarea" />
          </td>
        </tr>
        <!--怀疑药品第二行-->
        <!--                <tr align="center">-->
        <!--                  <td colspan="1">-->
        <!--                    <el-input v-model="yaoPin.DoubtMedical[1].TradeName"/>-->
        <!--                  </td>-->
        <!--                  <td colspan="2">-->
        <!--                    <el-input v-model="yaoPin.DoubtMedical[1].CommonName"/>-->
        <!--                  </td>-->
        <!--                  <td colspan="2">-->
        <!--                    <el-input v-model="yaoPin.DoubtMedical[1].ManufactName"/>-->
        <!--                  </td>-->
        <!--                  <td colspan="1">-->
        <!--                    <el-input v-model="yaoPin.DoubtMedical[1].PBNumber"/>-->
        <!--                  </td>-->
        <!--                  <td colspan="1">-->
        <!--                    <el-input v-model="yaoPin.DoubtMedical[1].UseConsumption"/>-->
        <!--                  </td>-->
        <!--                  <td colspan="1">-->
        <!--                    <el-date-picker-->
        <!--                      v-model="yaoPin.DoubtMedical[1].MedicalDate"-->
        <!--                      type="datetime"-->
        <!--                      format="yyyy-MM-dd HH:mm:ss"-->
        <!--                      value-format="yyyy-MM-dd HH:mm:ss"-->
        <!--                      style="width: 22vh;font-size:1.3vh"-->
        <!--                      placeholder="选择日期"-->
        <!--                    />-->
        <!--                  </td>-->
        <!--                  <td colspan="1">-->
        <!--                    <el-date-picker-->
        <!--                      v-model="yaoPin.DoubtMedical[1].MedicalDate"-->
        <!--                      type="datetime"-->
        <!--                      format="yyyy-MM-dd HH:mm:ss"-->
        <!--                      value-format="yyyy-MM-dd HH:mm:ss"-->
        <!--                      style="width: 22vh;font-size:1.3vh"-->
        <!--                      placeholder="选择日期"-->
        <!--                    />-->
        <!--                  </td>-->
        <!--                  <td colspan="2">-->
        <!--                    <el-input v-model="yaoPin.DoubtMedical[1].MedicalReason" type="textarea"/>-->
        <!--                  </td>-->
        <!--                </tr>-->
        <!--                &lt;!&ndash;怀疑药品第三行&ndash;&gt;-->
        <!--                <tr align="center">-->
        <!--                  <td colspan="1">-->
        <!--                    <el-input v-model="yaoPin.DoubtMedical[2].TradeName"/>-->
        <!--                  </td>-->
        <!--                  <td colspan="2">-->
        <!--                    <el-input v-model="yaoPin.DoubtMedical[2].CommonName"/>-->
        <!--                  </td>-->
        <!--                  <td colspan="2">-->
        <!--                    <el-input v-model="yaoPin.DoubtMedical[2].ManufactName"/>-->
        <!--                  </td>-->
        <!--                  <td colspan="1">-->
        <!--                    <el-input v-model="yaoPin.DoubtMedical[2].PBNumber"/>-->
        <!--                  </td>-->
        <!--                  <td colspan="1">-->
        <!--                    <el-input v-model="yaoPin.DoubtMedical[2].UseConsumption"/>-->
        <!--                  </td>-->
        <!--                  <td colspan="1">-->
        <!--                    <el-date-picker-->
        <!--                      v-model="yaoPin.DoubtMedical[2].MedicalDate"-->
        <!--                      type="datetime"-->
        <!--                      format="yyyy-MM-dd HH:mm:ss"-->
        <!--                      value-format="yyyy-MM-dd HH:mm:ss"-->
        <!--                      style="width: 22vh;font-size:1.3vh"-->
        <!--                      placeholder="选择日期"-->
        <!--                    />-->
        <!--                  </td>-->
        <!--                  <td colspan="1">-->
        <!--                    <el-date-picker-->
        <!--                      v-model="yaoPin.DoubtMedical[2].MedicalDate"-->
        <!--                      type="datetime"-->
        <!--                      format="yyyy-MM-dd HH:mm:ss"-->
        <!--                      value-format="yyyy-MM-dd HH:mm:ss"-->
        <!--                      style="width:22vh;font-size:1.3vh"-->
        <!--                      placeholder="选择日期"-->
        <!--                    />-->
        <!--                  </td>-->
        <!--                  <td colspan="2">-->
        <!--                    <el-input v-model="yaoPin.DoubtMedical[2].MedicalReason" type="textarea"/>-->
        <!--                  </td>-->
        <!--                </tr>-->
        <!--              怀疑药品结束-->

        <!--              并用药品开始-->
        <!--合并药品第一行-->
        <tr align="center">
          <td rowspan="1"><span>并用药品</span></td>
          <td colspan="1">
            <el-input v-for="item2 in yaoPin.BlendingMedical" v-model="item2.TradeName" type="textarea" />
          </td>
          <td colspan="2">
            <el-input v-for="item2 in yaoPin.BlendingMedical" v-model="item2.CommonName" type="textarea" />
          </td>
          <td colspan="2">
            <el-input v-for="item2 in yaoPin.BlendingMedical" v-model="item2.ManufactName" type="textarea" />
          </td>
          <td colspan="1">
            <el-input v-for="item2 in yaoPin.BlendingMedical" v-model="item2.PBNumber" type="textarea" />
          </td>
          <td colspan="1">
            <el-input v-for="item2 in yaoPin.BlendingMedical" v-model="item2.UseConsumption" type="textarea" />
          </td>
          <td colspan="1">
            <el-date-picker
              v-for="item2 in yaoPin.BlendingMedical"
              v-model="item2.MedicalSDate"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width:22vh;font-size:1.3vh"
              placeholder="选择日期"
            />
          </td>
          <td colspan="1">
            <el-date-picker
              v-for="item2 in yaoPin.BlendingMedical"
              v-model="item2.MedicalEDate"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 22vh;font-size:1.3vh"
              placeholder="选择日期"
            />
          </td>
          <td colspan="2">
            <el-input v-for="item2 in yaoPin.BlendingMedical" v-model="item2.MedicalReason" type="textarea" />
          </td>
        </tr>
        <!--合并药品第二行-->
        <!--                <tr align="center">-->
        <!--                  <td colspan="1">-->
        <!--                    <el-input v-model="yaoPin.BlendingMedical[1].TradeName"/>-->
        <!--                  </td>-->
        <!--                  <td colspan="2">-->
        <!--                    <el-input v-model="yaoPin.BlendingMedical[1].CommonName"/>-->
        <!--                  </td>-->
        <!--                  <td colspan="2">-->
        <!--                    <el-input v-model="yaoPin.BlendingMedical[1].ManufactName"/>-->
        <!--                  </td>-->
        <!--                  <td colspan="1">-->
        <!--                    <el-input v-model="yaoPin.BlendingMedical[1].PBNumber"/>-->
        <!--                  </td>-->
        <!--                  <td colspan="1">-->
        <!--                    <el-input v-model="yaoPin.BlendingMedical[1].UseConsumption"/>-->
        <!--                  </td>-->
        <!--                  <td colspan="1">-->
        <!--                    <el-date-picker-->
        <!--                      v-model="yaoPin.BlendingMedical[1].MedicalDate"-->
        <!--                      type="datetime"-->
        <!--                      format="yyyy-MM-dd HH:mm:ss"-->
        <!--                      value-format="yyyy-MM-dd HH:mm:ss"-->
        <!--                      style="width: 22vh;font-size:1.3vh"-->
        <!--                      placeholder="选择日期"-->
        <!--                    />-->
        <!--                  </td>-->
        <!--                  <td colspan="1">-->
        <!--                    <el-date-picker-->
        <!--                      v-model="yaoPin.BlendingMedical[1].MedicalDate"-->
        <!--                      type="datetime"-->
        <!--                      format="yyyy-MM-dd HH:mm:ss"-->
        <!--                      value-format="yyyy-MM-dd HH:mm:ss"-->
        <!--                      style="width: 22vh;font-size:1.3vh"-->
        <!--                      placeholder="选择日期"-->
        <!--                    />-->
        <!--                  </td>-->
        <!--                  <td colspan="2">-->
        <!--                    <el-input v-model="yaoPin.BlendingMedical[1].MedicalReason" type="textarea"/>-->
        <!--                  </td>-->
        <!--                </tr>-->
        <!--                &lt;!&ndash;合并药品第三行&ndash;&gt;-->
        <!--                <tr align="center">-->
        <!--                  <td colspan="1">-->
        <!--                    <el-input v-model="yaoPin.BlendingMedical[2].TradeName"/>-->
        <!--                  </td>-->
        <!--                  <td colspan="2">-->
        <!--                    <el-input v-model="yaoPin.BlendingMedical[2].CommonName"/>-->
        <!--                  </td>-->
        <!--                  <td colspan="2">-->
        <!--                    <el-input v-model="yaoPin.BlendingMedical[2].ManufactName"/>-->
        <!--                  </td>-->
        <!--                  <td colspan="1">-->
        <!--                    <el-input v-model="yaoPin.BlendingMedical[2].PBNumber"/>-->
        <!--                  </td>-->
        <!--                  <td colspan="1">-->
        <!--                    <el-input v-model="yaoPin.BlendingMedical[2].UseConsumption"/>-->
        <!--                  </td>-->
        <!--                  <td colspan="1">-->
        <!--                    <el-date-picker-->
        <!--                      v-model="yaoPin.BlendingMedical[2].MedicalDate"-->
        <!--                      type="datetime"-->
        <!--                      format="yyyy-MM-dd HH:mm:ss"-->
        <!--                      value-format="yyyy-MM-dd HH:mm:ss"-->
        <!--                      style="width: 22vh;font-size:1.3vh"-->
        <!--                      placeholder="选择日期"-->
        <!--                    />-->
        <!--                  </td>-->
        <!--                  <td colspan="1">-->
        <!--                    <el-date-picker-->
        <!--                      v-model="yaoPin.BlendingMedical[2].MedicalDate"-->
        <!--                      type="datetime"-->
        <!--                      format="yyyy-MM-dd HH:mm:ss"-->
        <!--                      value-format="yyyy-MM-dd HH:mm:ss"-->
        <!--                      style="width: 22vh;font-size:1.3vh"-->
        <!--                      placeholder="选择日期"-->
        <!--                    />-->
        <!--                  </td>-->
        <!--                  <td colspan="2">-->
        <!--                    <el-input v-model="yaoPin.BlendingMedical[2].MedicalReason" type="textarea"/>-->
        <!--                  </td>-->
        <!--                </tr>-->
        <!--      并用药品结束-->
        <!--      不良反应/事件的结果开始-->
        <tr align="center">
          <td><span>不良反应/事件的结果</span></td>
          <td colspan="3">
            <el-radio v-model="yaoPin.ReactionResult" :disabled="seeControl" label="治愈" />
            <el-radio v-model="yaoPin.ReactionResult" :disabled="seeControl" label="好转" />
            <el-radio v-model="yaoPin.ReactionResult" :disabled="seeControl" label="有后遗症" />
          </td>

          <td><span>表现</span></td>
          <td colspan=" 2 ">
            <el-input v-model="yaoPin.ReshInfo" :disabled="seeControl" type="textarea" />
          </td>
          <td colspan="2">
            <el-radio v-model="yaoPin.ReactionResult" :disabled="seeControl" label="死亡" />
            <span>直接死因</span>
          </td>
          <td colspan="1">
            <el-input v-model="yaoPin.DeathReason" :disabled="seeControl" type="textarea" />
          </td>

          <td><span>死亡时间</span></td>
          <td>
            <el-date-picker
              v-model="yaoPin.DeathDate"
              :disabled="seeControl"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 25vh"
              placeholder="选择日期"
            />
          </td>
        </tr>
        <!--      不良反应/事件的结果结束-->
        <!--      原患疾病开始-->
        <tr align="center">
          <td><span>原患疾病</span></td>
          <td colspan="11">
            <el-input v-model="yaoPin.Sickness" type="textarea" :disabled="seeControl" />
          </td>
        </tr>
        <!--      原患疾病结束-->
        <!--      对原患疾病的影响开始-->
        <tr align="center">
          <td><span>对原患疾病的影响</span></td>
          <td colspan="6">
            <el-radio v-model="yaoPin.Influence" :disabled="seeControl" label="不明显" />
            <el-radio v-model="yaoPin.Influence" :disabled="seeControl" label="病程延长" />
            <el-radio v-model="yaoPin.Influence" :disabled="seeControl" label="病情加重" />
            <el-radio v-model="yaoPin.Influence" :disabled="seeControl" label="导致后遗症" />
          </td>

          <td>
            <span>表现</span>
          </td>
          <td colspan="2">
            <el-input v-model="yaoPin.ShowSick" :disabled="seeControl" type="textarea" />
          </td>

          <td colspan="2">
            <el-radio v-model="yaoPin.Influence" :disabled="seeControl" label="导致死亡" />
          </td>
        </tr>
        <!--      对原患疾病的影响结束-->
        <!--      国内外有无类似不良反应（包括文献报道开始）-->
        <tr align="center">
          <td colspan="4"><span>国内有无类似不良反应（包括文献报道）</span></td>
          <td colspan="3">
            <el-radio v-model="yaoPin.InternalReaction" :disabled="seeControl" label="有" />
            <el-radio v-model="yaoPin.InternalReaction" :disabled="seeControl" label="无" />
            <el-radio v-model="yaoPin.InternalReaction" :disabled="seeControl" label="不详" />
          </td>

          <td colspan="2"><span>国外有无类似不良反应（包括文献报道）</span></td>
          <td colspan="3">
            <el-radio v-model="yaoPin.OverseasReaction" :disabled="seeControl" label="有" />
            <el-radio v-model="yaoPin.OverseasReaction" :disabled="seeControl" label="无" />
            <el-radio v-model="yaoPin.OverseasReaction" :disabled="seeControl" label="不详" />
          </td>
        </tr>
        <!--      国内外有无类似不良反应（包括文献报道结束）-->
        <!--      关联性评价开始-->
        <tr align="center">
          <td rowspan="4"><span>关联性评价</span></td>

          <td><span>报告人</span></td>
          <td colspan="8">
            <el-radio v-model="yaoPin.ManEv" :disabled="seeControl" label="肯定" />
            <el-radio v-model="yaoPin.ManEv" :disabled="seeControl" label="很可能" />
            <el-radio v-model="yaoPin.ManEv" :disabled="seeControl" label="可能" />
            <el-radio v-model="yaoPin.ManEv" :disabled="seeControl" label="可能无关" />
            <el-radio v-model="yaoPin.ManEv" :disabled="seeControl" label="待评价" />
            <el-radio v-model="yaoPin.ManEv" :disabled="seeControl" label="无法评价" />
          </td>

          <td><span>签名</span></td>
          <td>
            <el-input v-model="yaoPin.ManSign" type="textarea" :disabled="seeControl" />
          </td>

        </tr>

        <tr align="center">
          <td><span>报告单位</span></td>
          <td colspan="8">
            <el-radio v-model="yaoPin.CompanyEv" :disabled="seeControl" label="肯定" />
            <el-radio v-model="yaoPin.CompanyEv" :disabled="seeControl" label="很可能" />
            <el-radio v-model="yaoPin.CompanyEv" :disabled="seeControl" label="可能" />
            <el-radio v-model="yaoPin.CompanyEv" :disabled="seeControl" label="可能无关" />
            <el-radio v-model="yaoPin.CompanyEv" :disabled="seeControl" label="待评价" />
            <el-radio v-model="yaoPin.CompanyEv" :disabled="seeControl" label="无法评价" />
          </td>

          <td><span>签名</span></td>
          <td>
            <el-input v-model="yaoPin.CompanySign" type="textarea" :disabled="seeControl" />
          </td>

        </tr>

        <tr align="center">
          <td><span>省级药品不良反应监测机构</span></td>
          <td colspan="8">
            <el-radio v-model="yaoPin.ProValuaEv" :disabled="seeControl" label="肯定" />
            <el-radio v-model="yaoPin.ProValuaEv" :disabled="seeControl" label="很可能" />
            <el-radio v-model="yaoPin.ProValuaEv" :disabled="seeControl" label="可能" />
            <el-radio v-model="yaoPin.ProValuaEv" :disabled="seeControl" label="可能无关" />
            <el-radio v-model="yaoPin.ProValuaEv" :disabled="seeControl" label="待评价" />
            <el-radio v-model="yaoPin.ProValuaEv" :disabled="seeControl" label="无法评价" />
          </td>

          <td><span>签名</span></td>
          <td>
            <el-input v-model="yaoPin.ProValuaSign" type="textarea" :disabled="seeControl" />
          </td>

        </tr>

        <tr align="center">
          <td><span>国家药品不良反应监测中心</span></td>
          <td colspan="8">
            <el-radio v-model="yaoPin.ConValuaEv" :disabled="seeControl" label="肯定" />
            <el-radio v-model="yaoPin.ConValuaEv" :disabled="seeControl" label="很可能" />
            <el-radio v-model="yaoPin.ConValuaEv" :disabled="seeControl" label="可能" />
            <el-radio v-model="yaoPin.ConValuaEv" :disabled="seeControl" label="可能无关" />
            <el-radio v-model="yaoPin.ConValuaEv" :disabled="seeControl" label="待评价" />
            <el-radio v-model="yaoPin.ConValuaEv" :disabled="seeControl" label="无法评价" />
          </td>

          <td><span>签名</span></td>
          <td>
            <el-input v-model="yaoPin.ConValuaSign" type="textarea" :disabled="seeControl" />
          </td>

        </tr>
        <!--      关联性评价结束-->
        <!--        不良反应/事件分析-->
        <tr align="center">
          <td colspan="12">
            <div><span>◇不良反应/事件分析</span></div>
          </td>
        </tr>

        <tr align="left">
          <td colspan="6">
            <div><span>1.用药与不良反应/事件的出现有无合理的时间关系？</span></div>
          </td>
          <td colspan="6">
            <el-radio v-model="yaoPin.ReasonTime" :disabled="seeControl" label="有" />
            <el-radio v-model="yaoPin.ReasonTime" :disabled="seeControl" label="无" />
          </td>
        </tr>

        <tr align="left">
          <td colspan="6">
            <div><span>2.反应是否符合该药已知的不良反应类型？</span></div>
          </td>
          <td colspan="6">
            <el-radio v-model="yaoPin.ReasonType" :disabled="seeControl" label="是" />
            <el-radio v-model="yaoPin.ReasonType" :disabled="seeControl" label="否" />
            <el-radio v-model="yaoPin.ReasonType" :disabled="seeControl" label="不明" />
          </td>
        </tr>

        <tr align="left">
          <td colspan="6">
            <div><span>3.停药或减量后，反应/事件是否消失或减轻？</span></div>
          </td>
          <td colspan="6">
            <el-radio v-model="yaoPin.Ease" :disabled="seeControl" label="是" />
            <el-radio v-model="yaoPin.Ease" :disabled="seeControl" label="否" />
            <el-radio v-model="yaoPin.Ease" :disabled="seeControl" label="不明" />
            <el-radio v-model="yaoPin.Ease" :disabled="seeControl" label="未停药或未减量" />
          </td>
        </tr>

        <tr align="left">
          <td colspan="6">
            <div><span>4.再次使用可疑药品后是否再次出现同样反应/事件？</span></div>
          </td>
          <td colspan="6">
            <el-radio v-model="yaoPin.DoubtReact" :disabled="seeControl" label="是" />
            <el-radio v-model="yaoPin.DoubtReact" :disabled="seeControl" label="否" />
            <el-radio v-model="yaoPin.DoubtReact" :disabled="seeControl" label="不明" />
            <el-radio v-model="yaoPin.DoubtReact" :disabled="seeControl" label="未再使用" />
          </td>
        </tr>

        <tr align="left">
          <td colspan="6">
            <div><span>5.反应/事件是否可用并用药的作用、患者病情的进展、其他治疗的影响来解释？</span></div>
          </td>
          <td colspan="6">
            <el-radio v-model="yaoPin.BlendingReact" :disabled="seeControl" label="是" />
            <el-radio v-model="yaoPin.BlendingReact" :disabled="seeControl" label="否" />
            <el-radio v-model="yaoPin.BlendingReact" :disabled="seeControl" label="不明" />
          </td>
        </tr>

        <tr align="center">
          <td colspan="12">
            <div><span>◇严重药品不良反应/事件是指有下列情形之一者</span></div>
          </td>
        </tr>

        <tr align="center">
          <td colspan="12">
            <el-radio v-model="yaoPin.Serious" :disabled="seeControl" label="1.引起死亡" />
            <el-radio v-model="yaoPin.Serious" :disabled="seeControl" label="2.致畸、致癌、致出生缺陷" />
            <el-radio v-model="yaoPin.Serious" :disabled="seeControl" label="3.对生命有危险并能够导致人体永久的或显著的伤残" />
            <el-radio v-model="yaoPin.Serious" :disabled="seeControl" label="4.对器官功能产生永久损伤" />
            <el-radio v-model="yaoPin.Serious" :disabled="seeControl" label="5.导致住院或住院时间延长" />
          </td>
        </tr>


      </table>
      <!--      表尾开始-->
      <div class="tableHeader">

        <div>
          报告人职业（医疗机构）:
          <el-radio  v-model="yaoPin.ProfessionInst" :disabled="seeControl" label="医生" />
          <el-radio v-model="yaoPin.ProfessionInst" :disabled="seeControl" label="药师" />
          <el-radio v-model="yaoPin.ProfessionInst" :disabled="seeControl" label="护士" />
          <el-radio v-model="yaoPin.ProfessionInst" :disabled="seeControl" label="其他" />
        </div>

        <div>
       报告人职务职称（企业）
          <el-input v-model="yaoPin.ProfessionEnter" :disabled="seeControl" />
        </div>

        <div>
          报告人签名：
          <el-input  v-model.trim="yaoPin.ReportSign" :disabled="seeControl" />
        </div>

      </div>


      <!--      附件上传-->
      <div>
        附件上传
        <el-upload
          :disabled="seeControl"
          action="/api/AE_Report/UploadFile"
          multiple
          :file-list="fileList4"
          :on-success="uploadSuccess4"
          :on-change="uploadChange"
        >
          <el-button :disabled="seeControl" size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">可以上传多个文件</div>
        </el-upload>
        <el-table :data="yaoPin.File_List">
          <el-table-column label="文件名">
            <template slot-scope="{ row }">
              <el-link type="primary" :href="row.FileUrl" target="_blank">{{
                row.FileName
              }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column label="查看">
            <template slot-scope="{ row }">
              <el-link
                type="primary"
                :href="row.OpenFileUrl"
                target="_blank"
              >打开
              </el-link>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                :disabled="seeControl"
                size="mini"
                circle
                type="danger"
                icon="el-icon-delete"
                @click="deleteFile(scope.$index)"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div style="display: flex">
        <div style="margin-left: 10vh">
          <div>
            <el-tag type="info">
              ◇编码规则：
            </el-tag>
          </div>
          <div>
            <el-tag type="info">省(自治区、直辖市) 市（地区） 县（区） 单位 年代 流水号</el-tag>
          </div>
          <div>
            <el-tag type="info">□□ □□ □□ □□□□ □□□□ □□□□□</el-tag>
          </div>
          <div>
            <el-tag type="info">注：省（自治区、直辖市）、市（地区）、县（区）编码按中华人民共和国行政区划代码填写。</el-tag>
          </div>
          <div>
            <el-tag type="info"> 单位编码第一位如下填写：医疗机构1、军队医院2、计生机构3、生产企业4、经营企业5。</el-tag>
          </div>
          <div>
            <el-tag type="info">个人报告单位编码一栏填写6000</el-tag>
          </div>
          <div>
            <el-tag type="info">◇ 注：通用名称一栏，首次获准进口5年内的进口品种用*注明</el-tag>
          </div>

        </div>
        <div style="margin-left: 10vh">
          <div>
            <el-tag type="info">
              国家药品不良反应监测中心
            </el-tag>
          </div>
          <div>
            <el-tag type="info">通信地址：北京市崇文区法华南里11号楼二层</el-tag>
          </div>
          <div>
            <el-tag type="info">邮 编：100061</el-tag>
          </div>
          <div>
            <el-tag type="info">电 话：（010）67164979</el-tag>
          </div>
          <div>
            <el-tag type="info">传 真：（010）67184951</el-tag>
          </div>
          <div>
            <el-tag type="info">E – mail ：report@adr.gov.cn</el-tag>
          </div>

          <!--      表尾结束-->
        </div>
        <div style="margin-left: 10vh">
          <div style="width: 25vh">
            <td><el-input v-model="yaoPin.Monitor" :disabled="seeControl" size="mini" style="width: 20vh;height: 2vh" />
            </td>
            <td><el-tag type="info"  style="width: 150px">
              药品不良反应监测中心
            </el-tag></td>
          </div>
          <div style="width: 25vh">
            <el-tag type="info"  style="width: 70px">通信地址：
              <el-input
                v-model="yaoPin.MailAddress"
                :disabled="seeControl"
                size="mini"
                style="width: 30vh;height: 2vh"
              />
            </el-tag>
          </div>
          <div style="width: 25vh">
            <el-tag type="info"  style="width: 50px">邮 编：
              <el-input
                v-model="yaoPin.PostalCode"
                :disabled="seeControl"
                size="mini"
                style="width: 33.5vh;height: 2vh"
              />
            </el-tag>
          </div>
          <div>
            <el-tag type="info"  style="width: 50px">电 话：
              <el-input v-model="yaoPin.Phone" :disabled="seeControl" size="mini" style="width: 33.5vh;height: 2vh" />
            </el-tag>
          </div>
          <div>
            <el-tag type="info" style="width: 50px">传 真：
              <el-input v-model="yaoPin.Fax" :disabled="seeControl" size="mini" style="width: 33.5vh;height: 2vh" />
            </el-tag>
          </div>
          <div>
            <el-tag type="info" style="width:70px">E – mail ：
              <el-input v-model="yaoPin.EMail" :disabled="seeControl" size="mini" style="width: 30vh;height: 2vh" />
            </el-tag>
          </div>

          <!--      表尾结束-->
        </div>

      </div>

    </div>
    <!--    表格结束-->

    <div class="dialog">
      <el-dialog :visible.sync="dialogVisible2" width="30%">
        <el-progress
          :text-inside="true"
          :stroke-width="24"
          :percentage="percentage"
          status="success"
        />
      </el-dialog>
    </div>

  </el-card>
</template>
<script>
import defaultDepts from '@/views/components/defaultDepts';
import { mapGetters } from 'vuex';
import {
  InsertOrUpdateAnQuan,
  InsertOrUpdateReport,
  InsertOrUpdateReportHuli,
  InsertOrUpdateReportqixie,
  InsertOrUpdateYaoPin,
  SelectData,
  SelectEventList,
  SelectEventTypeByEventID,
  SelectMedical,
  SelectProblemByEventTypeID,
  SelectReportByID,
  SelectReportByID1,
  SelectReportFile
} from '@/api/AE_Event';
import { exportDocx } from '@/vendor/ExportWord';

export default {
  name: 'AdverseEventsReport',
  components: { defaultDepts },
  data() {
    return {
      x: 1,
      seeControl: false,
      seeControl2: false,
      seeControl3: true,
      seeControl4: false,
      seeControl5: true,
      yiLiaoQiXie: { // 医疗器械模板插入数据字段
        CaNumber: '',
        type: 1,
        ReportDate: '', // 报告日期
        EventReportID: 0, // 插入数据时 状态为 0
        DepartmentName: '', // 事件所发生科室
        ReportSource: '', // 报告来源
        ReportUnit: '', // 单位名称
        Address: '', // 联系地址
        Tele: '', // 联系电话
        Zipcode: '', // 邮编
        Code: '', // 编码
        PatientName: '', // 患者姓名
        // BirthDate: '', // 出生日期
        Age: '', // 年龄
        Sex: '', // 性别
        Diseffect: '', // 预期治疗疾病或作用
        EventMain: '', // 事件主要表现
        EventDate: '', // 事件发生日期
        ActualPlace: '', // 医疗器械实际使用场所
        EventResult: '', // 事件后果
        DeadDate: '', // 死亡时间
        EventStatement: '', // 事件陈述
        MDCName: '', // 医疗器械分类名称
        TradeName: '', // 商品名称
        CertificateNo: '', // 注册证号
        ManufactNam: '', // 生产企业名称
        ManufactAdress: '', // 生产企业地址
        ManufactCall: '', // 企业联系电话
        PSpecification: '', // 型号规格
        PNumber: '', // 产品编号
        PBNumber: '', // 产品批号
        Operator: '', // 操作人
        ValidDate: '', // 有效期至
        StopDate: '', // 停用日期
        ImplantationDate: '', // 植入日期
        EventReason: '', // 事件发生原因分析
        Treatment: '', //
        EventRSate: '', // 事件报告状态
        ProValua: '', // 省级监测机构意见陈述
        ConValua: '', // 国家监测机构意见陈述
        ReportTitle: '', // 报告人
        ReportUser: window.userInfo[0].UserName, // 报告人签名
        CreateUserID: window.userInfo[0].UserID,
        IsDraft: 0, // 草稿 1是0否
        FindDepartmentID: 0, // 发现科室
        File_List: [
          // {
          //   FileID: 0,
          //   EventReportID: 0,
          //   FileName: 'string',
          //   FileUrl: 'string',
          //   OpenFileUrl: 'string',
          //   Type: 0
          // }
        ] // 附件
      },
      HuLi: { // 护理模板插入数据字段
        CaNumber: '', // 医保卡号
        type: 2,
        EventReportID: 0, // 插入数据时 状态为 0
        EventCategory: '', // 事件类别
        OccurDate: '', // 发生日期及时间点
        Shift: '', // 班次
        FindDepartmentID: 0, // 所在科室号
        DepartmentName: '', // 所在科室
        PatientName: '', // 患者姓名
        Sex: '', // 性别
        // BirthDate: '', // 出生日期
        Age: '', // 年龄
        BedNumber: '', // 床号
        InpatientNumber: '', // 住院号
        Diagnosis: '', // 诊断
        Process: '', // 护理事件经过、处理过程及后果
        CauseAnalysis: '', // 原因分析
        Measures: '', // 整改措施
        ReportUser: window.userInfo[0].UserName, // 报告人
        HeadNurse: '', // 护士长
        ReportDate: '', // 报告日期
        Opinions: '', // 护理部意见
        Sign: '', // 签名
        ReportDate2: '', // 护理部报告日期
        IsDraft: 0, // 草稿 1是0否
        CreateUserID: window.userInfo[0].UserID,
        PageIndex: 1,
        PageSize: 10,
        File_List: [
          // {
          //   FileID: 0,
          //   EventReportID: 0,
          //   FileName: 'string',
          //   FileUrl: 'string',
          //   OpenFileUrl: 'string',
          //   Type: 1
          // }
        ] // 附件
      },
      yiLiaoAnQuan: { // 医疗安全数据插入字段
        CaNumber: '', // 医保卡号
        type: 3,
        EventReportID: 0, // 插入数据时 状态为 0
        ReportDate: '', // 报告日期
        EventDate: '', // 事件发生日期
        PatientName: '', // 患者姓名
        Sex: '', // 性别
        // BirthDate: '', // 出生日期
        Age: '', // 年龄
        Position: '', // 职别
        TreatDate: '', // 诊疗时间
        Diagnosis: '', // 临床诊断
        Diagnostic: '', // 在场相关人员或相关科室
        Place: '', // 事件发生场所
        Result: '', // 不良后果
        Resulthave: '', // 不良后果具体详情
        Process: '', // 事情经过
        EventCategory: '', // 不良事件类别
        EventDegree: '', // 不良事件的等级
        Causes: '', // 导致事件的可能原因
        Handle: '', // 事件处理情况
        Evaluate: '', // 不良事件评价
        Measures: '', // 持续改进措施
        ReportTitle: '', //  报告人类别
        Classification: '', // 当事人的类别
        Level: '', // 职称
        ReportUser: '', // 报告人
        Sign: window.userInfo[0].UserName, // 报告人签名
        FindDepartmentID: 0, // 科室号
        DepartmentName: '', // 科室
        FindDepartmentName: '',
        InpatientDept: '', // 住院部
        Cal: '', // 联系号码
        IsDraft: 0, // 草稿 1是0否
        Status: '', // 状态
        // CreateDate: '', // 创建日期
        CreateUserID: window.userInfo[0].UserID,
        PageIndex: 1,
        PageSize: 3,
        File_List: [
          // {
          //   FileID: 0,
          //   EventReportID: 0,
          //   FileName: 'string',
          //   FileUrl: 'string',
          //   OpenFileUrl: 'string',
          //   Type: 0
          // }
        ]
      },
      yaoPin: { // 药品模板插入数据字段
        CaNumber: '', // 医保卡号
        type: 4,
        EventReportID: 0,
        Degree: '', // 严重程度 1为新的，2为严重，3为一般
        // Degrees: ['新的□', '严重□', '一般□'],
        ReportSourse: '', // 来源 1为医疗卫生机构，2为生产企业经营企业，3为个人
        Code: null, // 编码
        UnitName: '', // 单位名称
        Dept: '', // 部门
        DepartmentName: '',
        Tel: '', // 电话
        ReportDate: '', // 报告日期
        PatientName: '', // 患者姓名
        Sex: '', // 性别
        Age: null, // 年龄
        BirthDate: '', // 出生日期
        Nation: '', // 民族
        Weight: 0, // 体重
        ContactTel: '', // 联系方式
        FReaction: '', // 家族药品不良反应/事件 1有2无3不详
        BReaction: '', // 既往药品不良反应/事件情况 1有2无3不详
        ReactionName: '', // 不良反应/事件名称
        ReactionDate: '', // 不良反应/事件发生时间
        MedicalNumber: '', // 病历号/门诊号
        ReactionDescribe: '', // 不良反应/事件过程描述
        ReactionResult: '', // 不良反应/事件的结果 1治愈2好转3后遗症
        ReshInfo: '', // 表现
        Death: '', // 是否死亡
        DeathReason: '', // 死亡死因
        DeathDate: '',
        Sickness: '',
        Influence: '', // 对原患疾病的影响
        ShowSick: '', // 表现
        CauseDeath: '', // 导致死亡
        InternalReaction: '', // 有无报道1
        OverseasReaction: '', // 有无报道1
        ManEv: '', // 报告人评价
        CompanyEv: '', // 报告单位评价
        ProValuaEv: '', // 省级药品不良反应监测机构
        ConValuaEv: '', // 国家药品不良反应监测中心
        ManSign: '', // 报告人签名
        CompanySign: '', // 报告人单位签名
        ProValuaSign: '', // 省级药品不良反应监测机构签名
        ConValuaSign: '', // 国家药品不良反应监测中心签名
        ProfessionInst: '', // 报告人职业（医疗机构）
        ProfessionEnter: '', // 报告人职务职称（企业）
        ReportSign: window.userInfo[0].UserName, // 报告人签名：
        ReportUser: window.userInfo[0].UserName,
        ReasonTime: '',
        ReasonType: '',
        Ease: '',
        DoubtReact: '',
        BlendingReact: '',
        Serious: '',
        Monitor: '',
        MailAddress: '',
        PostalCode: '',
        Phone: '',
        Fax: '',
        EMail: '',
        IsDraft: 0,
        FindDepartmentID: 0,
        CreateUserID: window.userInfo[0].UserID,
        File_List: [],
        DoubtMedical: [ // 怀疑药品
          {
            DDID: 0,
            EventReportID: 0,
            YaoPinType: 0,
            TradeName: '',
            CommonName: '',
            ManufactName: '',
            PBNumber: '',
            UseConsumption: '',
            MedicalSDate: '',
            MedicalEDate: '',
            MedicalReason: ''
          }
        ],
        BlendingMedical: [
          {
            DDID: 0,
            EventReportID: 0,
            YaoPinType: 1,
            TradeName: '',
            CommonName: '',
            ManufactName: '',
            PBNumber: '',
            UseConsumption: '',
            MedicalSDate: '',
            MedicalEDate: '',
            MedicalReason: ''
          }
        ] // 合并药品
      },
      DoubtMedical: [ // 怀疑药品
        {
          DDID: 0,
          EventReportID: 0,
          YaoPinType: 0,
          TradeName: '',
          CommonName: '',
          ManufactName: '',
          PBNumber: '',
          UseConsumption: '',
          MedicalSDate: '',
          MedicalEDate: '',
          MedicalReason: ''
        }
      ],
      BlendingMedical: [
        {
          DDID: 0,
          EventReportID: 0,
          YaoPinType: 1,
          TradeName: '',
          CommonName: '',
          ManufactName: '',
          PBNumber: '',
          UseConsumption: '',
          MedicalSDate: '',
          MedicalEDate: '',
          MedicalReason: ''
        }
      ], // 合并药品
      exportData2: [], // 通用事件导出暂存数据
      exportData3: [], // 医疗器械事件导出暂存数据
      exportData4: [], // 护理事件导出暂存数据
      exportData5: [], // 医疗安全事件导出暂存数据
      exportData6: [], //  药品安全事件导出暂存数据

      listLoading: false,
      title: '',
      submitType: '提交新报告',
      disabled: false,
      changed: false,
      dialogVisible: true,
      dialogVisible2: false,
      percentage: 0,
      percentageIndex: 2,
      event: '',
      eventOptions: [],
      eventTypeOptions: [],
      problems: '',
      activeNames: ['1'],
      rules: {},
      options: [],
      fileList: [],
      fileList1: [],
      fileList2: [],
      fileList3: [],
      fileList4: [],
      uploadEnd: false,
      formData: {
        EventID: 0,
        EventReportID: 0 /* 上报ID */,
        EventTypeID: 0/* 事件类别ID */,
        VictimType: '',
        ClinicNumber: '',
        VictimName: '',
        Sex: '',
        Status: '待审核',
        Birthday: '',
        Weight: null,
        Phone: '',
        TreatmentType: '',
        TreatmentDate: '',
        Nation: '',
        VictimDepartmentID: 0,
        VictimDepartment: '',
        SerialNumber: '',
        FindName: '',
        FindDepartmentID: 0,
        FindDepartment: '',
        Process: '',
        Level: '',
        Severity: '',
        CreateUserID: window.userInfo[0].UserID /* 创建人 */,
        File_List: [
          /*           {
            FileName: "",
            FileUrl: "",
            OpenFileUrl: ""
          }*/
        ],
        ReportDetailList: [
          /*           {
            ReportDetailID: 0,   上报详情ID
            ProblemID: 0,        问题ID
            Content: ""          问题回答
          }
 */
        ],
        IsDraft: 0
      },
      temName: 0,
      nowEventReportID: '',
      text1: '保存',
      EventReportIDfujian: 0
    };
  },
  computed: {
    ...mapGetters(['device'])
  },
  created() {
    this.dialogVisible = !this.$route.params.id;
    if (this.dialogVisible) {
      this.getEvent();
      this.SelectEventTypeByEventID(this.event);
    } else {
      if (this.$route.params.name) {
        // 从AdverseEventsHome过来
        this.submitType = '提交新报告';
        this.title = this.$route.params.name;
        this.event = this.$route.params.id;
        this.SelectEventTypeByEventID(this.event);
        this.getEvent();
      } else {
        // 从AdverseEventsMine过来

        this.submitType = '修改保存报告';
        if (this.$route.params.biaoshi === 1) { // 如果是已报事件编辑，跳到相应模板
          this.temName = this.$route.params.temName;
          this.EventReportIDfujian = this.$route.params.id;
        } else if (this.$route.params.biaoshi === 2) { // 如果草稿编辑，跳到相应模板
          this.temName = this.$route.params.draftsType;
          this.seeControl3 = false; // 现将存为草稿按钮隐藏
          this.seeControl4 = true; // 将正式提交按钮显示
        } else if (this.$route.params.biaoshi === 3) { // 如果是已处理查看详情，将input设为不可编辑
          this.temName = this.$route.params.processedType;
          this.seeControl = true;
          this.seeControl2 = true; // 导出Excel按钮显示
          // 如果是通用事件就没有word导出项
          if (this.temName === 0) {
            this.seeControl5 = false;
          } else {
            this.seeControl5 = true;
          }
        } else if (this.$route.params.biaoshi === 4) { // 如果是回退查看详情，将input设为可编辑
          this.temName = this.$route.params.sendBackType;
          this.seeControl = false;
          this.seeControl2 = true; // 导出Excel按钮显示
          // 如果是通用事件就没有word导出项
          if (this.temName === 0) {
            this.seeControl5 = false;
          } else {
            this.seeControl5 = true;
          }
        } else if (this.$route.params.biaoshi === 5) { // 如果是待处理查看详情，将input设为可编辑
          this.temName = this.$route.params.pendingType;
          this.seeControl = false;
          this.seeControl2 = true; // 导出Excel按钮显示
          // 如果是通用事件就没有word导出项
          if (this.temName === 0) {
            this.seeControl5 = false;
          } else {
            this.seeControl5 = true;
          }
        } else if (this.$route.params.biaoshi === 6) { // 如果是已报事件查看详情，将input设为不可编辑
          this.temName = this.$route.params.uploadedType;
          this.seeControl = true;
          this.seeControl2 = true; // 导出Excel按钮显示
          // 如果是通用事件就没有word导出项
          if (this.temName === 0) {
            this.seeControl5 = false;
          } else {
            this.seeControl5 = true;
          }
        } else {
          this.EventReportIDfujian = 0;
        }
        this.getEvent();
        this.SelectReportByID();
      }
    }
  },
  // 组件内导航钩子，处理未保存退出的情况
  beforeRouteLeave: function(to, from, next) {
    if (this.changed) {
      this.$confirm('您还未提交，是否提交?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.doSubmit();
          // 选择确定
          next();
        })
        .catch(e => {
          next();
        });
    } else {
      next();
    }
  },

  methods: {
    // 使得点击通用事件那个下拉选择框能跳到相应模板
    dianji() {
      this.temName = 0;
    },
    // 验证
    // 将获取的值进行替换去除非数字和点号
    checkInt() {
      this.formData.Phone = this.formData.Phone.replace(/[^\.\d]/g, '').replace('.', ''); // 电话
      this.formData.Weight = this.formData.Weight.replace(/[^\.\d]/g, '').replace('.', ''); // 体重
    },
    // 导出事件excel
    async exportEvent() {
      this.downloadLoading = true;
      try {
        if (this.temName === 0) {
          const excel = await import('@/vendor/Export2Excel');
          const tHeader = [
            '事件名称',
            '事件类别',
            '受损害者类型',
            '医保卡号',
            '患者姓名',
            '患者性别',
            '出生日期',
            '体重（kg）',
            '联系电话',
            '就诊形式',
            '就诊日期',
            '民族',
            '病人所在科室',
            '病人流水号',
            '发现人',
            '事件所发生的科室',
            '不良事件级别',
            '伤害严重程度',
            '事件过程'
          ];
          const filterVal = [
            'EventName',
            'EventTypeName',
            'VictimType',
            'ClinicNumber',
            'VictimName',
            'Sex',
            'Birthday',
            'Weight',
            'Phone',
            'TreatmentType',
            'TreatmentDate',
            'Nation',
            'VictimDepartment',
            'SerialNumber',
            'FindName',
            'FindDepartment',
            'Level: ',
            'Severity',
            'Process'
          ];
          const { data } = await SelectReportByID({
            EventReportID: this.$route.params.id
          });
          this.exportData2.push(data);
          // const data1 = await SelectEventTypeByEventID({
          //   EventID: this.$route.params.id
          // });
          // console.log(data1);
          const formData1 = this.formatJson(filterVal, this.exportData2); // 第二个参数必须为数组

          excel.export_json_to_excel({
            header: tHeader,
            data: formData1,
            filename: '文件名'
          });
        } else if (this.temName === 1) {
          const excel = await import('@/vendor/Export2Excel');
          const tHeader = [
            '报告日期',
            '报告来源',
            '单位名称',
            '联系地址',
            '联系电话',
            '邮编',
            '编码',
            '患者姓名',
            '年龄',
            '性别',
            '预期治疗疾病或作用',
            '事件主要表现',
            '事件发生日期',
            '实际使用场所',
            '事件后果',
            '死亡时间',
            '事件陈述',
            '医疗器械分类名称',
            '商品名称',
            '注册证号',
            '生产企业名称',
            '生产企业地址',
            '企业联系电话',
            '型号规格',
            '产品编号',
            '产品批号',
            '操作人',
            '有效期至',
            '停用日期',
            '置入日期',
            '事件发生原因分析',
            '事件处理情况',
            '事件报告状态',
            '省级检测机构意见陈述',
            '国家检测机构意见陈述',
            '报告人职位',
            '报告人'
          ];
          const filterVal = [
            'ReportDate',
            'ReportSource',
            'ReportUnit',
            'Address',
            'Tele',
            'Zipcode',
            'Code',
            'PatientName',
            'Age',
            'Sex',
            'Diseffect',
            'EventMain',
            'EventDate',
            'ActualPlace',
            'EventResult',
            'DeadDate',
            'EventStatement',
            'MDCName',
            'TradeName',
            'CertificateNo',
            'ManufactNam',
            'ManufactAdress',
            'ManufactCall',
            'PSpecification',
            'PNumber',
            'PBNumber',
            'Operator',
            'ValidDate',
            'StopDate',
            'ImplantationDate',
            'EventReason',
            'Treatment',
            'EventRSate',
            'ProValua',
            'ConValua',
            'ReportTitle',
            'ReportUser'
          ];
          const { data } = await SelectReportByID1({ // 查询数据
            EventReportID: this.$route.params.id, type: 1
          });
          this.exportData3.push(data[0]);
          console.log(this.exportData3);
          // const data1 = await SelectEventTypeByEventID({
          //   EventID: this.$route.params.id
          // });
          // console.log(data1);
          const formData2 = this.formatJson(filterVal, this.exportData3); // 第二个参数必须为数组

          excel.export_json_to_excel({
            header: tHeader,
            data: formData2,
            filename: '文件名'
          });
        } else if (this.temName === 2) {
          const excel = await import('@/vendor/Export2Excel');
          const tHeader = [
            '医保卡号',
            '事件类别',
            '发生日期及时间点',
            '班次',
            '患者姓名',
            '患者性别',
            '年龄',
            '床号',
            '住院号',
            '诊断',
            '护理事件经过、处理过程及后果',
            '原因分析',
            '整改措施',
            '报告人',
            '护士长',
            '报告日期',
            '部门意见',
            '签名',
            '部门报告日期'
          ];
          const filterVal = [
            'CaNumber',
            'EventCategory',
            'OccurDate',
            'Shift',
            'PatientName',
            'Sex',
            'Age',
            'BedNumber',
            'Diagnosis',
            'Process',
            'CauseAnalysis',
            'Measures',
            'ReportUser',
            'HeadNurse',
            'ReportDate',
            'Opinions',
            'Sign: ',
            'ReportDate2'
          ];
          const { data } = await SelectReportByID1({
            EventReportID: this.$route.params.id, type: 2
          });
          this.exportData4.push(data[0]);
          // const data1 = await SelectEventTypeByEventID({
          //   EventID: this.$route.params.id
          // });
          // console.log(data1);
          const formData3 = this.formatJson(filterVal, this.exportData4); // 第二个参数必须为数组

          excel.export_json_to_excel({
            header: tHeader,
            data: formData3,
            filename: '文件名'
          });
        } else if (this.temName === 3) {
          const excel = await import('@/vendor/Export2Excel');
          const tHeader = [
            '医保卡号',
            '报告日期',
            '事件发日期',
            '患者姓名',
            '患者性别',
            '年龄',
            '职别',
            '诊疗时间',
            '临床诊断',
            '在场相关人员或科室',
            '事件发生场所',
            '不良后果',
            '不良后果具体详情',
            '事件经过',
            '不良事件类别',
            '不良事件等级',
            '导致事件的可能原因',
            '事件处理情况',
            '不良事件评价',
            '持续改进措施',
            '报告人类别',
            '当事人的类别',
            '职称',
            '报告人签字',
            '科室',
            '住院部',
            '联系号码'
          ];
          const filterVal = [
            'CaNumber',
            'ReportDate',
            'EventDate',
            'PatientName',
            'Sex',
            'Age',
            'Position',
            'TreatDate',
            'Diagnosis',
            'Diagnostic',
            'Place',
            'Result',
            'Resulthave',
            'Process',
            'EventCategory',
            'EventDegree: ',
            'Causes',
            'Handle',
            'Evaluate',
            'Measures',
            'ReportTitle',
            'Classification',
            'Level',
            'Sign',
            'FindDepartmentID',
            'InpatientDept: ',
            'Cal'
          ];
          const { data } = await SelectReportByID1({
            EventReportID: this.$route.params.id, type: 3
          });
          this.exportData5.push(data[0]);
          // const data1 = await SelectEventTypeByEventID({
          //   EventID: this.$route.params.id
          // });
          // console.log(data1);
          const formData4 = this.formatJson(filterVal, this.exportData5); // 第二个参数必须为数组

          excel.export_json_to_excel({
            header: tHeader,
            data: formData4,
            filename: '文件名'
          });
        } else if (this.temName === 4) {
          const excel = await import('@/vendor/Export2Excel');
          const tHeader = [
            '医保卡号',
            '严重程度',
            '来源',
            '编码',
            '单位名称',
            '部门',
            '电话',
            '报告日期',
            '患者姓名',
            '性别',
            '出生日期',
            '民族',
            '体重',
            '联系方式',
            '家族药品不良反应/事件',
            '既往药品不良反应/事件情况',
            '不良反应/事件名称',
            '不良反应/事件发生时间',
            '病历号/门诊号',
            '不良反应/事件过程描述',
            '不良反应/事件的结果',
            '表现',
            '是否死亡',
            '死亡死因',
            '死亡时间',
            '原患疾病',
            '对原患疾病的影响',
            '对原患疾病的影响表现',
            '导致死亡',
            '国内有无类似不良反应（包括文献报道）',
            '国外有无类似不良反应（包括文献报道）',
            '报告人评价',
            '报告单位评价',
            '省级药品不良反应监测机构评价',
            '国家药品不良反应监测中心评价',
            '报告人签名',
            '报告人单位签名',
            '省级药品不良反应监测机构签名',
            '国家药品不良反应监测中心签名',
            '报告人职业（医疗机构）',
            '报告人职务职称（企业）',
            '报告人签名',
            '用药与不良反应/事件的出现有无合理的时间关系？',
            '反应是否符合该药已知的不良反应类型？',
            '停药或减量后，反应/事件是否消失或减轻？',
            '再次使用可疑药品后是否再次出现同样反应/事件？',
            '反应/事件是否可用并用药的作用、患者病情的进展、其他治疗的影响来解释？',
            '严重药品不良反应/事件是指有下列情形之一者',
            '省级药品不良反应监测机构签名',
            '国家药品不良反应监测中心签名',
            '报告人职业（医疗机构）',
            '报告人职务职称（企业）',
            '报告人签名'

          ];
          const filterVal = [
            'CaNumber',
            'Degree',
            'ReportSourse',
            'Code',
            'UnitName',
            'Dept',
            'Tel',
            'ReportDate',
            'PatientName',
            'Sex',
            'BirthDate',
            'Nation',
            'Weight',
            'ContactTel',
            'FReaction',
            'BReaction',
            'ReactionName',
            'ReactionDate',
            'MedicalNumber',
            'ReactionDescribe',
            'ReactionResult',
            'ReshInfo',
            'Death',
            'DeathReason',
            'DeathDate',
            'Sickness',
            'Influence',
            'ShowSick',
            'CauseDeath',
            'InternalReaction',
            'OverseasReaction',
            'ManEv',
            'CompanyEv',
            'ProValuaEv',
            'ConValuaEv: ',
            'ManSign',
            'CompanySign',
            'ProValuaSign',
            'ConValuaSign',
            'ProfessionInst',
            'ProfessionEnter',
            'ReasonTime',
            'ReasonType',
            'Ease',
            'DoubtReact',
            'BlendingReact',
            'Serious',
            'ManSign',
            'ProfessionInst',
            'ProfessionEnter',
            'ReportSign'
          ];
          const { data } = await SelectReportByID1({
            EventReportID: this.$route.params.id, type: 4
          });
          this.exportData6.push(data[0]);
          // const data1 = await SelectEventTypeByEventID({
          //   EventID: this.$route.params.id
          // });
          // console.log(data1);
          const formData5 = this.formatJson(filterVal, this.exportData6); // 第二个参数必须为数组

          excel.export_json_to_excel({
            header: tHeader,
            data: formData5,
            filename: '文件名'
          });
        }
      } catch (error) {
        console.error(error);
      }
      this.downloadLoading = false;
    },
    // 导出事件Word
    exportWord() {
      // 通用事件导出
      if (this.temName === 0) {
        const data = this.formData;
        exportDocx('./word/general.docx', data, `通用事件.docx`);
        this.$message.success('已开始下载');
      } else if (this.temName === 1) { // 医疗器械不良事件导出
        const data = this.yiLiaoQiXie;
        exportDocx('./word/yiLiaoQiXie.docx', data, `医疗器械（不良）事件.docx`);
        this.$message.success('已开始下载');
      } else if (this.temName === 2) { // 护理安全不良事件导出
        const data = this.HuLi;
        exportDocx('./word/huli.docx', data, `护理安全（不良）事件.docx`);
        this.$message.success('已开始下载');
      } else if (this.temName === 3) { // 医疗安全不良事件导出
        const data = this.yiLiaoAnQuan;
        exportDocx('./word/yiLiaoAnQuan.docx', data, `医疗安全（不良）事件.docx`);
        this.$message.success('已开始下载');
      } else if (this.temName === 4) { // 药品安全不良事件导出
        const data = this.yaoPin;
        exportDocx('./word/yaoPin.docx', data, `药品安全（不良）事件.docx`);
        this.$message.success('已开始下载');
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    // 搜索医保卡号
    async searchClinicNumber(type) {
      if (this.formData.ClinicNumber === '') {
        this.formData.ClinicNumber = 0;
      }
      try {
        if (type === 0) {
          const { data, code } = await SelectData({
            JZKH: this.formData.ClinicNumber
          });
          if (code === 200) {
            this.$message.success('查询成功');
            this.formData.ClinicNumber = data[0].JZKH; // 医保卡号
            this.formData.VictimName = data[0].PAT_NAME; // 患者姓名；
            this.formData.Sex = data[0].XB; // 性别
            this.formData.Birthday = data[0].CS_RQ; // 出生日期
            this.formData.Nation = data[0].MZ_MC; // 民族
            this.formData.VictimDepartment = data[0].BM_MC; // 病人所在科室
          } else {
            this.$message.error('暂无此人记录');
          }
        } else if (type === 1) {
          const { data, code } = await SelectData({
            JZKH: this.yiLiaoQiXie.CaNumber
          });
          if (code === 200) { // 医疗器械
            this.$message.success('查询成功');
            this.yiLiaoQiXie.ClinicNumber = data[0].JZKH; // 医保卡号
            this.yiLiaoQiXie.PatientName = data[0].PAT_NAME; // 患者姓名；
            this.yiLiaoQiXie.Sex = data[0].XB; // 性别
            // this.yiLiaoQiXie.Birthday = data.CS_RQ; // 出生日期
            // this.yiLiaoQiXie.Nation = data.JZ_RQ; // 民族
          } else {
            this.$message.error('暂无此人记录');
          }
        } else if (type === 2) { // 护理
          const { data, code } = await SelectData({
            JZKH: this.HuLi.ClinicNumber
          });
          if (code === 200) {
            this.$message.success('查询成功');
            this.HuLi.ClinicNumber = data[0].JZKH; // 医保卡号
            this.HuLi.PatientName = data[0].PAT_NAME; // 患者姓名；
            this.HuLi.Sex = data[0].XB; // 性别
            // this.HuLi.Birthday = data.CS_RQ; // 出生日期
            // this.HuLi.Nation = data.JZ_RQ; // 民族
          } else {
            this.$message.error('暂无此人记录');
          }
        } else if (type === 3) { // 医疗安全
          const { data, code } = await SelectData({
            JZKH: this.yiLiaoAnQuan.ClinicNumber
          });
          if (code === 200) {
            this.$message.success('查询成功');
            this.yiLiaoAnQuan.ClinicNumber = data[0].JZKH; // 医保卡号
            this.yiLiaoAnQuan.PatientName = data[0].PAT_NAME; // 患者姓名；
            this.yiLiaoAnQuan.Sex = data[0].XB; // 性别
            // this.yiLiaoAnQuan.Birthday = data.CS_RQ; // 出生日期
            // this.yiLiaoAnQuan.Nation = data.JZ_RQ; // 民族
          } else {
            this.$message.error('暂无此人记录');
          }
        } else if (type === 4) { // 药品安全
          const { data, code } = await SelectData({
            JZKH: this.yaoPin.ClinicNumber
          });
          if (code === 200) {
            this.$message.success('查询成功');
            this.yaoPin.ClinicNumber = data[0].JZKH; // 医保卡号
            this.yaoPin.PatientName = data[0].PAT_NAME; // 患者姓名；
            this.yaoPin.Sex = data[0].XB; // 性别
            // this.yaoPin.Birthday = data.CS_RQ; // 出生日期
            // this.yaoPin.Nation = data.JZ_RQ; // 民族
          } else {
            this.$message.error('暂无此人记录');
          }
        }
      } catch (e) {
        this.$message.error('查询出现问题');
        console.log(e);
      }
    },

    back() {
      if (this.$route.params.x === 1) { // 如果标识为1证明是已报事件查看详情点进来的，点击返回按钮就跳回原来的类别表
        this.$router.push(
          {
            path: '/adverseevents/adverse_events_mine/uploaded',
            query: { temNameUpload: this.temName }
          });
      }
      if (this.$route.params.x === 2) { // 如果标识为2证明是已处理报告查看详情点进来的，点击返回按钮就跳回原来的类别表
        this.$router.push(
          {
            path: '/adverseevents/adverse_events_mine/processed',
            query: { temNameProcessed: this.temName }
          });
      }
      if (this.$route.params.x === 3) { // 如果标识为3证明是被退回报告查看详情点进来的，点击返回按钮就跳回原来的类别表
        this.$router.push(
          {
            path: '/adverseevents/adverse_events_mine/send_back',
            query: { temNameSend_back: this.temName }
          });
      }
      if (this.$route.params.x === 4) { // 如果标识为4证明是待处理报告查看详情点进来的，点击返回按钮就跳回原来的类别表
        this.$router.push(
          {
            path: '/adverseevents/adverse_events_mine/pending',
            query: { temNamePending: this.temName }
          });
      }
    },
    edChangeS(val) {
      if (val === 1) {
        this.temName = 1;
      }
      if (val === 2) {
        this.temName = 2;
      }
      if (val === 3) {
        this.temName = 3;
      }
      if (val === 4) {
        this.temName = 4;
      }
    },
    // 保存草稿
    edChange(val) {
      if (this.temName === 0) {
        this.formData.IsDraft = 1;
        this.changed = false;
        this.doSubmit();
      } else if (this.temName === 1) {
        this.yiLiaoQiXie.IsDraft = 1;
        this.changed = false;
        this.doSubmit();
      } else if (this.temName === 2) {
        this.HuLi.IsDraft = 1;
        this.changed = false;
        this.doSubmit();
      } else if (this.temName === 3) {
        this.yiLiaoAnQuan.IsDraft = 1;
        this.changed = false;
        this.doSubmit();
      } else if (this.temName === 4) {
        this.yaoPin.IsDraft = 1;
        this.changed = false;
        this.doSubmit();
      }
    },

    // 正式提交
    submitChange(val) {
      if (this.temName === 0) {
        this.formData.IsDraft = 0;
        this.changed = false;
        this.doSubmit();
      } else if (this.temName === 1) {
        this.yiLiaoQiXie.IsDraft = 0;
        this.changed = false;
        this.doSubmit();
      } else if (this.temName === 2) {
        this.HuLi.IsDraft = 0;
        this.changed = false;
        this.doSubmit();
      } else if (this.temName === 3) {
        this.yiLiaoAnQuan.IsDraft = 0;
        this.changed = false;
        this.doSubmit();
      } else if (this.temName === 4) {
        this.yaoPin.IsDraft = 0;
        this.changed = false;
        this.doSubmit();
      }
    },
    handleClose(done) {
      this.title = '无类型';
      if (this.title) {
        done();
      } else {
        this.$message({ type: 'error', message: '必须选择一个事件类型' });
      }
    },
    uploadChange(file, fileList) {
      this.uploadEnd = true;
      fileList.forEach(item => {
        if (item.response && item.response.code === 200) {
          this.uploadEnd = false;
        } else {
          this.uploadEnd = true;
        }
      });
    },
    uploadSuccess(response, file) { // 上传附件
      if (response.hasOwnProperty('data')) {
        this.formData.File_List.push({
          FileName: response.data[0].FileName,
          FileUrl: response.data[0].FileUrl,
          OpenFileUrl: response.data[0].OpenFileUrl,
          type: this.temName
        });
      } else {
        this.fileList = [];
        this.$message({
          type: 'error',
          message: file.name + '   上传失败'
        });
      }
    },

    uploadSuccess1(response, file) { // 上传附件
      if (response.hasOwnProperty('data')) {
        this.yiLiaoQiXie.File_List.push({
          EventReportID: this.EventReportIDfujian,
          FileName: response.data[0].FileName,
          FileUrl: response.data[0].FileUrl,
          OpenFileUrl: response.data[0].OpenFileUrl,
          type: this.temName
        });
      } else {
        this.fileList1 = [];
        this.$message({
          type: 'error',
          message: file.name + '   上传失败'
        });
      }
    },

    uploadSuccess2(response, file) { // 上传附件
      if (response.hasOwnProperty('data')) {
        this.HuLi.File_List.push({
          EventReportID: this.EventReportIDfujian,
          FileName: response.data[0].FileName,
          FileUrl: response.data[0].FileUrl,
          OpenFileUrl: response.data[0].OpenFileUrl,
          type: this.temName
        });
      } else {
        this.fileList2 = [];
        this.$message({
          type: 'error',
          message: file.name + '   上传失败'
        });
      }
    },
    uploadSuccess3(response, file) { // 上传附件
      if (response.hasOwnProperty('data')) {
        this.yiLiaoAnQuan.File_List.push({
          EventReportID: this.EventReportIDfujian,
          FileName: response.data[0].FileName,
          FileUrl: response.data[0].FileUrl,
          OpenFileUrl: response.data[0].OpenFileUrl,
          type: this.temName
        });
      } else {
        this.fileList3 = [];
        this.$message({
          type: 'error',
          message: file.name + '   上传失败'
        });
      }
    },

    uploadSuccess4(response, file) { // 上传附件
      if (response.hasOwnProperty('data')) {
        this.yaoPin.File_List.push({
          EventReportID: this.EventReportIDfujian,
          FileName: response.data[0].FileName,
          FileUrl: response.data[0].FileUrl,
          OpenFileUrl: response.data[0].OpenFileUrl,
          type: this.temName
        });
      } else {
        this.fileList4 = [];
        this.$message({
          type: 'error',
          message: file.name + '   上传失败'
        });
      }
    },

    deleteFile(index) {
      if (this.temName === 0) {
        this.formData.File_List.splice(index, 1);
      } else if (this.temName === 1) {
        this.yiLiaoQiXie.File_List.splice(index, 1);
      } else if (this.temName === 2) {
        this.HuLi.File_List.splice(index, 1);
      } else if (this.temName === 3) {
        this.yiLiaoAnQuan.File_List.splice(index, 1);
      } else if (this.temName === 4) {
        this.yaoPin.File_List.splice(index, 1);
      }
    },
    getDefaultDeptsValue(value) {
      this.formData.FindDepartmentID = value || 0;
    },
    // 护理模板科室
    getDefaultDeptsValue2(value) {
      this.HuLi.FindDepartmentID = value || 0;
    },
    // 医疗器械模板科室
    getDefaultDeptsValue3(value) {
      this.yiLiaoQiXie.FindDepartmentID = value || 0;
    },

    // 医疗安全模板科室
    getDefaultDeptsValue4(value) {
      this.yiLiaoAnQuan.FindDepartmentID = value || 0;
    },

    // 医疗安全模板科室
    getDefaultDeptsValue5(value) {
      this.yaoPin.FindDepartmentID = value || 0;
    },

    async getEvent() {
      try {
        this.eventOptions = [];
        const { data } = await SelectEventList({
          intercept: 2
        });
        this.eventOptions = data;
        this.eventOptions.push({
          EventID: 0,
          EventName: '无类型'
        });
        if (!this.event) this.event = data[0].EventID;
      } catch (error) {
      }
    },
    async SelectEventTypeByEventID(id) {
      this.listLoading = true;
      try {
        const { data } = await SelectEventTypeByEventID({ EventID: id });
        this.eventTypeOptions = data;
        this.formData.EventTypeID = null;
        if (!this.formData.EventTypeID) {
          this.formData.EventTypeID = data[0].EventTypeID;
          this.eventTypeChange(data[0].EventTypeID);
        }
      } catch (error) {
      }
      this.listLoading = false;
    },
    doSelectEvent() {
      let objs = {};
      objs = this.eventOptions.find((item) => {
        return item.EventID === this.event;
      });
      console.log(objs.EventName);
      this.changed = true;
      this.temName = 0;
      try {
        this.eventOptions.map(item => {
          if (item.EventID == this.event) {
            this.title = item.EventName;
          }
        });
        if (!this.title) {
          this.title = '无类型';
        }
        if (this.title) this.dialogVisible = false;
        this.SelectEventTypeByEventID(this.event);
      } catch {
      }
    },
    async eventTypeChange(val) {
      try {
        const { data } = await SelectProblemByEventTypeID({ EventTypeID: val });
        this.getProblemHTML(data);
      } catch (error) {
      }
    },
    getProblemHTML(data) {
      let s = '';
      data.forEach(item => {
        if (item.Type == 1) {
          s += `<span>${item.ProblemName}</span><br><select name="problem" id="${item.ProblemID}" style="width:320px">`;
          item.OptionList.forEach(
            val =>
              (s += `<option value="${val.OptionID}">${val.OptionContent}</option>`)
          );
          s += '</select><br>';
        } else if (item.Type == 2) {
          s += `<span>${item.ProblemName}</span><br>`;
          item.OptionList.forEach(
            val =>
              (s += `<input name="problem" id="${item.ProblemID}" type="checkbox" value="${val.OptionID}">${val.OptionContent}<br>`)
          );
          s += '<br>';
        } else if (item.Type == 3) {
          s += `<span>${item.ProblemName}</span><br><textarea name="problem" id="${item.ProblemID}"></textarea><br>`;
        }
        this.problems = s;
      });
    },
    async doSubmit() {
      this.disabled = true;
      this.dialogVisible2 = true;
      this.formData.ReportDetailList = [];
      let obj = '';
      let objValue = [];
      document.getElementsByName('problem').forEach(item => {
        if (item.type == 'select-one' || item.type == 'textarea') {
          this.formData.ReportDetailList.push({
            ProblemID: item.id,
            ContentList: [item.value]
          });
        } else if (item.type == 'checkbox') {
          if (item.checked) {
            if (obj != item.id) {
              if (obj != '') {
                this.formData.ReportDetailList.push({
                  ProblemID: obj,
                  ContentList: objValue
                });
              }
              obj = item.id;
              objValue = [];
            }
            objValue.push(item.value);
          }
        }
      });
      if (objValue.length) {
        this.formData.ReportDetailList.push({
          ProblemID: obj,
          ContentList: objValue
        });
      }
      const interval = setInterval(() => {
        if (this.percentage >= 100) {
          clearInterval(interval);
          this.$message.success('提交成功');
          this.dialogVisible2 = false;
          this.percentage = 0;
          return;
        } else {
          this.percentage += this.percentageIndex;
        }
      }, 60);
      try {
        if (this.temName === 0) {
          // alert(this.formData.File_List);
          if (this.nowEventReportID) { // 这是更新修改时用的，如果nowEventReportID不为空表示它有值从修改的页面传过来了
            this.formData.EventReportID = this.nowEventReportID; // 这时我们修改插入的数据条id，实现更新功能
            this.formData.Status = '待审核';

            this.text1 = '修改'; // 修改提示信息为修改
          }
          this.formData.EventID = this.event;
          if (this.formData.EventTypeID === null) {
            this.formData.EventTypeID = 0;
          }
          const { code, msg } = await InsertOrUpdateReport(this.formData);
          console.log(this.formData.File_List);
          if (code === 200) {
            this.changed = false; //  跳转限制提示取消
            if (this.formData.IsDraft === 1) {
              this.$message.success('保存草稿“通用事件报告表”成功');
              this.$nextTick(() => {
                this.$router.push(
                  '/adverseevents/adverse_events_mine/drafts');
              });
            } else {
              this.$message.success(this.text1 + '通用事件事件报告表成功');
              this.$nextTick(() => {
                this.$router.push(
                  '/adverseevents/adverse_events_mine/uploaded');
              });
            }
          } else {
            this.$message.error('因某些原因导致新增失败');
          }
        } else if (this.temName === 1) { // 插入医疗器械模板报告
          if (this.nowEventReportID) { // 这是更新修改时用的，如果nowEventReportID不为空表示它有值从修改的页面传过来了
            this.yiLiaoQiXie.EventReportID = this.nowEventReportID; // 这时我们修改插入的数据条id，实现更新功能

            this.text1 = '修改'; // 修改提示信息为修改
          }

          const { code } = await InsertOrUpdateReportqixie(this.yiLiaoQiXie);// 医疗器械模板插入数据
          if (code === 200) {
            this.changed = false; //  跳转限制提示取消
            if (this.yiLiaoQiXie.IsDraft === 1) {
              this.$message.success('保存草稿“医疗器械安全(不良)事件报告表”成功');
              this.$nextTick(() => {
                this.$router.push(
                  '/adverseevents/adverse_events_mine/drafts');
              });
            } else {
              this.$message.success(this.text1 + '医疗器械安全(不良)事件报告表成功');
              this.$nextTick(() => {
                this.$router.push(
                  '/adverseevents/adverse_events_mine/uploaded');
              });
            }
          } else {
            this.$message.error('因某些原因导致新增失败');
          }
        } else if (this.temName === 2) { // 插入护理不良事件模板报告
          if (this.nowEventReportID) { // 这是更新修改时用的，如果nowEventReportID不为空表示它有值从修改的页面传过来了
            this.HuLi.EventReportID = this.nowEventReportID; // 这时我们修改插入的数据条id，实现更新功能
            this.text1 = '修改'; // 修改提示信息为修改
          }

          const { code } = await InsertOrUpdateReportHuli(this.HuLi);// 医疗器械模板插入数据
          if (code === 200) {
            if (this.HuLi.IsDraft === 1) {
              this.$message.success('保存草稿“护理安全(不良)事件报告表”成功');
              this.$nextTick(() => {
                this.$router.push(
                  '/adverseevents/adverse_events_mine/drafts');
              });
            } else {
              this.$message.success(this.text1 + '护理安全(不良)事件报告表成功');
              this.$nextTick(() => {
                this.$router.push(
                  '/adverseevents/adverse_events_mine/uploaded');
              });
            }
          } else {
            this.$message.error('因某些原因导致新增失败');
          }
        } else if (this.temName === 3) {
          if (this.nowEventReportID) { // 这是更新修改时用的，如果nowEventReportID不为空表示它有值从修改的页面传过来了
            this.yiLiaoAnQuan.EventReportID = this.nowEventReportID; // 这时我们修改插入的数据条id，实现更新功能
            this.text1 = '修改'; // 修改提示信息为修改
          }

          const { code } = await InsertOrUpdateAnQuan(this.yiLiaoAnQuan);// 医疗安全模板插入数据
          if (code === 200) {
            if (this.yiLiaoAnQuan.IsDraft === 1) {
              this.$message.success('保存草稿“医疗安全(不良)事件报告表”成功');
              this.$nextTick(() => {
                this.$router.push(
                  '/adverseevents/adverse_events_mine/drafts');
              });
            } else {
              this.$message.success(this.text1 + '医疗安全(不良)事件报告表成功');
              this.$nextTick(() => {
                this.$router.push(
                  '/adverseevents/adverse_events_mine/uploaded');
              });
            }
          } else {
            this.$message.error('因某些原因导致新增失败');
          }
        } else if (this.temName === 4) { // 插入药品安全事件模板报告
          // this.yaoPin.DoubtMedical = [];
          // this.yaoPin.BlendingMedical = [];
          // this.yaoPin.DoubtMedical[0]=this.DoubtMedical;
          // this.yaoPin.BlendingMedical[0] = this.BlendingMedical;
          // this.yaoPin.DoubtMedical[0].DDID= this.DoubtMedical[0].DDID;
          // this.yaoPin.DoubtMedical[0].EventReportID = this.DoubtMedical[0].EventReportID;
          // this.yaoPin.DoubtMedical[0].YaoPinType = this.DoubtMedical[0].YaoPinType;
          // this.yaoPin.DoubtMedical[0].TradeName = this.DoubtMedical[0].TradeName;
          // this.yaoPin.DoubtMedical.CommonName = this.DoubtMedical.CommonName;
          // this.yaoPin.DoubtMedical.ManufactName = this.DoubtMedical.ManufactName;
          // this.yaoPin.DoubtMedical.PBNumber = this.DoubtMedical.PBNumber;
          // this.yaoPin.DoubtMedical.UseConsumption = this.DoubtMedical.UseConsumption;
          // this.yaoPin.DoubtMedical.MedicalSDate = this.DoubtMedical.MedicalSDate;
          // this.yaoPin.DoubtMedical.MedicalEDate = this.DoubtMedical.MedicalEDate;
          // this.yaoPin.DoubtMedical.MedicalReason = this.DoubtMedical.MedicalReason;


          // this.yaoPin.BlendingMedical.DDID = this.BlendingMedical.DDID;
          // this.yaoPin.BlendingMedical.EventReportID = this.BlendingMedical.EventReportID;
          // this.yaoPin.BlendingMedical.YaoPinType = this.BlendingMedical.YaoPinType;
          // this.yaoPin.BlendingMedical.TradeName = this.BlendingMedical.TradeName;
          // this.yaoPin.BlendingMedical.CommonName = this.BlendingMedical.CommonName;
          // this.yaoPin.BlendingMedical.ManufactName = this.BlendingMedical.ManufactName;
          // this.yaoPin.BlendingMedical.PBNumber = this.BlendingMedical.PBNumber;
          // this.yaoPin.BlendingMedical.UseConsumption = this.BlendingMedical.UseConsumption;
          // this.yaoPin.BlendingMedical.MedicalSDate = this.BlendingMedical.MedicalSDate;
          // this.yaoPin.BlendingMedical.MedicalEDate = this.BlendingMedical.MedicalEDate;
          // this.yaoPin.BlendingMedical.MedicalReason = this.BlendingMedical.MedicalReason;

          // this.yaoPin.ReportSign = this.yaoPin.ReportSign + ' ';
          if (this.nowEventReportID) { // 这是更新修改时用的，如果nowEventReportID不为空表示它有值从修改的页面传过来了
            this.yaoPin.EventReportID = this.nowEventReportID; // 这时我们修改插入的数据条id，实现更新功能

            this.text1 = '修改'; // 修改提示信息为修改
          }

          console.log(this.yaoPin.DoubtMedical);
          console.log(this.yaoPin.BlendingMedical);
          console.log(this.yaoPin);
          const { code } = await InsertOrUpdateYaoPin(this.yaoPin);// 药品安全模板插入数据
          console.log(this.yaoPin);
          if (code === 200) {
            if (this.yaoPin.IsDraft === 1) {
              this.$message.success('保存草稿“药品安全(不良)事件报告表”成功');
              this.$nextTick(() => {
                this.$router.push(
                  '/adverseevents/adverse_events_mine/drafts');
              });
            } else {
              this.$message.success(this.text1 + '药品安全(不良)事件报告表成功');
              this.$nextTick(() => {
                this.$router.push(
                  '/adverseevents/adverse_events_mine/uploaded');
              });
            }
          } else {
            this.$message.error('因某些原因导致新增失败');
          }
        }
      } catch (e) {
        clearInterval(interval);
        this.$message.error(e);
      }
      this.disabled = false;
    },
    async SelectReportByID() {
      this.listLoading = true;

      try {
        if (this.temName === 0) {
          const { data } = await SelectReportByID({
            EventReportID: this.$route.params.id
          });
          this.title = data.EventName;
          this.event = data.EventID;
          this.SelectEventTypeByEventID(this.event);

          this.formData.EventReportID = data.EventReportID;
          this.formData.EventTypeID = data.EventTypeID;
          this.formData.VictimType = data.VictimType;
          this.formData.ClinicNumber = data.ClinicNumber;
          this.formData.VictimName = data.VictimName;
          this.formData.Sex = data.Sex;
          this.formData.Birthday = data.Birthday;
          this.formData.Weight = data.Weight;
          this.formData.Phone = data.Phone;
          this.formData.TreatmentType = data.TreatmentType;
          this.formData.TreatmentDate = data.TreatmentDate;
          this.formData.Nation = data.Nation;
          this.formData.VictimDepartmentID = data.VictimDepartmentID;
          this.formData.VictimDepartment = data.VictimDepartment;
          this.formData.SerialNumber = data.SerialNumber;
          this.formData.FindName = data.FindName;
          this.formData.FindDepartmentID = data.FindDepartmentID;
          this.formData.FindDepartment = data.FindDepartment;
          this.formData.Process = data.Process;
          this.formData.Level = data.Level;
          this.formData.Severity = data.Severity;
          this.formData.File_List = data.File_List;

          this.getProblemAnswerHTML(data.ProblemList, data.ReportDetailList);
          console.log(this.formData.File_List);
          console.log(this.formData);
        } else if (this.temName === 1) {
          const { data } = await SelectReportByID1({
            EventReportID: this.$route.params.id, type: 1
          });
          this.yiLiaoQiXie = data[0];
          // 附件
          const data1 = await SelectReportFile({
            EventReportID: this.$route.params.id, type: 1
          });

          this.yiLiaoQiXie.File_List = data1.data;
          this.yiLiaoQiXie.ReportUser = this.yiLiaoQiXie.ReportUser + ' ';
          console.log(this.yiLiaoQiXie.File_List);
          console.log(this.yiLiaoQiXie);
        } else if (this.temName === 2) {
          const { data } = await SelectReportByID1({
            EventReportID: this.$route.params.id, type: 2
          });
          this.HuLi = data[0];

          // 附件
          const data1 = await SelectReportFile({
            EventReportID: this.$route.params.id, type: 2
          });
          this.HuLi.File_List = data1.data;
          this.HuLi.ReportUser = this.HuLi.ReportUser + ' ';
        } else if (this.temName === 3) {
          const { data } = await SelectReportByID1({
            EventReportID: this.$route.params.id, type: 3
          });
          this.yiLiaoAnQuan = data[0];

          // 附件
          const data1 = await SelectReportFile({
            EventReportID: this.$route.params.id, type: 3
          });
          this.yiLiaoAnQuan.File_List = data1.data;
          this.yiLiaoAnQuan.Sign = this.yiLiaoAnQuan.Sign + ' ';
        } else if (this.temName === 4) {
          const { data } = await SelectReportByID1({
            EventReportID: this.$route.params.id, type: 4
          });
          this.yaoPin = data[0];

          const data1 = await SelectMedical({ EventReportID: this.$route.params.id, type: 0 });
          this.DoubtMedical = data1.data;
          this.yaoPin.DoubtMedical = data1.data;
          console.log(this.DoubtMedical);

          const data2 = await SelectMedical({ EventReportID: this.$route.params.id, type: 1 });
          this.BlendingMedical = data2.data;
          this.yaoPin.BlendingMedical = data2.data;
          console.log(data2.data);
          console.log(this.yaoPin);
          // 附件
          const data3 = await SelectReportFile({
            EventReportID: this.$route.params.id, type: 4
          });
          this.yaoPin.File_List = data3.data;
          this.yaoPin.ReportSign = this.yaoPin.ReportSign + ' ';
        }
      } catch (error) {
      } finally {
        this.listLoading = false;
      }
    },
    getProblemAnswerHTML(data, answer) {
      let s = '';
      data.forEach(item => {
        if (item.Type == 1) {
          s += `<span>${item.ProblemName}</span><br><select name="problem" id="${item.ProblemID}" style="width:320px">`;
          item.OptionList.forEach(val => {
            s += `<option value="${val.OptionID}"`;
            answer.forEach(obj => {
              if (
                item.ProblemID == obj.ProblemID &&
                val.OptionID == obj.Content
              ) {
                s += 'selected';
              }
            });
            s += `>${val.OptionContent}</option>`;
          });
          s += '</select><br>';
        } else if (item.Type == 2) {
          // checkbox
          s += `<span>${item.ProblemName}</span><br>`;
          item.OptionList.forEach(val => {
            s += `<input name="problem" id="${item.ProblemID}" type=checkbox value="${val.OptionID}"`;
            answer.forEach(obj => {
              if (
                item.ProblemID == obj.ProblemID &&
                val.OptionID == obj.Content
              ) {
                s += 'checked';
              }
            });
            s += `>${val.OptionContent}<br>`;
          });
          s += '<br>';
        } else if (item.Type == 3) {
          s += `<span>${item.ProblemName}</span><br><textarea name="problem" id="${item.ProblemID}">`;
          answer.forEach(obj => {
            if (item.ProblemID == obj.ProblemID && obj.Content) {
              s += obj.Content;
            }
          });
          s += `</textarea><br>`;
        }
        this.problems = s;
      });
    }
  }
};
</script>
<style lang="scss">

html, body, table, tr, td, input, el-input {
  padding: 0;
  margin:0;
}


.tableHeaderKy {
  width: 80%;
  display: flex;
  justify-content: inherit;
  align-items: center;
  height: 25px;
  line-height:25px;
  margin-left: 10%;
  font-size: 16px;
  margin-top: 1vh;
  margin-bottom: 1vh;
  //text-align: center;
}

.tableHeaderKy div {
  display: flex;
  //position: inherit;
  justify-content: inherit;
  align-items: center;
  width: 50%;
  height: 4vh;
  //text-align: center;
  //margin-left: 7%;
}

.tableHeaderKy div .el-input__inner {
  height: 2vh;
  width: 100%;
  font-size: 1.8vh;
  margin-left: 1vh;
}

//表格上方头部

.tableHeader {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height:20px;
  margin-top:4px;
  margin-bottom: 4px;

}

.tableHeader div {
  display: flex;
  //position: inherit;
  justify-content: center;
  align-items: center;
  //width: 10%;

  height: 100%;


  //text-align: center;
  margin-left: 2%;


}

.tableHeader div .el-input__inner {
  height: 2vh;
  width: 25vh;
  font-size: 1.8vh;
}


.AdverseEvents_Report {
  margin: 4px;
  overflow: hidden;
  height: calc(100vh - 96px);

  .el-card__body {
    padding: 5px;
  }

  .main {
    widows: 100%;
    height: calc(100vh - 165px);
    overflow: auto;
  }

  .dialog {
    margin-top: 50% !important;
    width: 30%;

    .el-dialog .el-dialog__header {
      padding: 0px !important;
      background-color: #d4e9fc00 !important;
    }

    .el-dialog {
      width: 20% !important;
      top: 20% !important;
      background: #fff0 !important;
      box-shadow: 0 1px 3px rgb(0 0 0 / 0%) !important;
    }
  }
}
</style>

/* height: calc(100vh - 165px);这是兼顾手机，如果电脑height: calc(100vh -
150px)即可 */
