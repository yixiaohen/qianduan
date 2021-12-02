<template>
  <el-card style="margin: 10px;width: 98%;height: 87vh;overflow: auto">

    <div
      style="width: 100%;
          background-color:#f4f4f5;
          display: inline-block;
          height: 32px;
          line-height: 32px;"
    >
      <el-form :inline="true" size="mini" class="demo-form-inline">
        <el-form-item>
          <el-input
            v-model="form.RC_ProjectName"
            placeholder="项目名称"
            @keyup.enter.native="SelectDistribution('搜索')"
          />
        </el-form-item>
        <el-divider direction="vertical" />
        <el-form-item>
          <el-input
            v-model="form.RC_TemplateName"
            placeholder="表单名称"
            @keyup.enter.native="SelectDistribution('搜索')"
          />
        </el-form-item>
        <el-divider direction="vertical" />
        <el-form-item>
          <el-input
            v-model="form.DistributionUserName"
            placeholder="自查人员"
            @keyup.enter.native="SelectDistribution('搜索')"
          />
        </el-form-item>
        <el-divider direction="vertical" />
        <el-form-item>
          <el-input
            v-model="form.CheckUserName"
            placeholder="审核人员"
            @keyup.enter.native="SelectDistribution('搜索')"
          />
        </el-form-item>
        <el-divider direction="vertical" />
        <el-form-item>
          <el-button
            type="primary"
            @click="SelectDistribution('搜索')"
          >搜索</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
      v-loading="listLoading"
      :data="tableData"
      border
      highlight-current-row
      :header-cell-style="{'text-align':'center'}"
      :cell-style="{'text-align':'center'}"
      size="mini"
      style="margin-top: 10px"
      height="calc(100vh - 240px)"
      stripe
    >
      <el-table-column
        align="center"
        prop="DistributionName"
        label="任务名称"
        :show-overflow-tooltip="cellOverflow"
      />
      <el-table-column
        align="center"
        prop="RC_TemplateName"
        label="表单名称"
        :show-overflow-tooltip="cellOverflow"
      />
      <el-table-column
        align="center"
        prop="DistributionUserName"
        label="自查人员"
        :show-overflow-tooltip="cellOverflow"
      />
      <el-table-column
        align="center"
        prop="RC_InspectionDepartmentName"
        label="自查科室"
        :show-overflow-tooltip="cellOverflow"
      >
        <template slot-scope="{ row }">
          <p v-for="(item, index) in row.UsetemplateList" :key="index">
            {{ item.RC_InspectionDepartmentName }}
          </p>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="RC_ProjectName"
        label="项目名称"
        :show-overflow-tooltip="cellOverflow"
        width="180"
      ><template slot-scope="{ row }">
        <p v-for="(item, index) in row.UsetemplateList" :key="index">
          {{ item.RC_ProjectName }}
        </p>
      </template>
      </el-table-column>
      <el-table-column
        label="状态"
        width="120"
        align="center"
        prop="StatusName"
      ><template slot-scope="{ row }">
        <p v-for="(item, index) in row.UsetemplateList" :key="index">
          {{ item.StatusName }}
        </p>
      </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="CheckUserName"
        label="审核人员"
        :show-overflow-tooltip="cellOverflow"
      />
      <el-table-column label="操作" fixed="right" align="center" width="120">
        <template slot-scope="{ row }">
          <el-button
            type="info"
            size="mini"
            icon="el-icon-edit"
            @click="SelectTemplateByID(row)"
          />
          <el-popconfirm
            style="margin-left: 3px"
            confirm-button-text="是"
            cancel-button-text="否"
            icon="el-icon-info"
            icon-color="green"
            title="确定再次分配该表单吗？适用于再次分配相同表单。"
            @confirm="againTemplate(row)"
          >
            <el-button
              slot="reference"
              type="success"
              icon="el-icon-connection"
              size="mini"
            />
          </el-popconfirm>

          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="DeleteDistribution(row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <el-col :span="1">
        <el-switch v-model="cellOverflow" style="margin: 6px 0px" />
      </el-col>
      <el-col :span="20">
        <el-pagination
          background
          style="margin-top: 10px"
          :current-page="form.pageIndex"
          :page-sizes="[15, 20, 30, 40, 50, 100]"
          :page-size="form.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="form.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-col>
    </el-row>

    <!-- 弹窗 -->
    <el-dialog
      :width="device === 'desktop' ? '50%' : '90%'"
      fullscreen
      title="表单修改"
      :close-on-click-modal="false"
      :visible.sync="dialogAllot"
    >
      <el-tabs v-model="activeName">
        <el-tab-pane label="基本信息" name="first">
          <div class="content">
            <el-card shadow="never" class="box-card">
              <div class="content-form">
                <el-form
                  ref="addFormData"
                  size="mini"
                  label-width="96px"
                  :model="addFormData"
                  :rules="rule"
                  label-position="right"
                >
                  <el-form-item label="任务名称" prop="DistributionName">
                    <el-input
                      v-model="addFormData.DistributionName"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="自查科室" prop="RC_InspectionDepartment">
                    <default-depts
                      :multiple="true"
                      w="100%"
                      :value="addFormData.RC_InspectionDepartment"
                      @getDefaultDeptsValue="getDefaultDeptValues"
                    />
                  </el-form-item>
                  <el-form-item
                    v-if="radioShow"
                    label="跳过主管审核"
                    prop="RC_ProjectName"
                  >
                    <el-radio
                      v-model="addFormData.IsJump"
                      :label="1"
                    >是</el-radio>
                    <el-radio
                      v-model="addFormData.IsJump"
                      :label="0"
                    >否</el-radio>
                  </el-form-item>
                  <el-form-item
                    v-if="radioShow && addFormData.IsJump == 0"
                    label="审核人"
                    prop="CheckUserID"
                  >
                    <el-select
                      v-if="addFormData.IsJump == 0"
                      v-model="optionsUserName"
                      filterable
                      placeholder="请选择"
                      @change="selectUserID"
                    >
                      <el-option
                        v-for="item in options"
                        :key="item.UserID"
                        :label="item.UserName"
                        :value="item.UserID"
                      >
                        <span style="float: left">{{ item.UserName }}</span>
                        <span
                          style="float: right; color: #8492a6; font-size: 13px"
                        >{{ item.UserCode }}</span>
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="表单名称" prop="RC_TemplateName">
                    <el-input v-model="addFormData.RC_TemplateName" disabled />
                  </el-form-item>
                </el-form>
              </div>
              <div class="content-table">
                <el-table
                  :data="TemplateTableData"
                  style="width: 100%"
                  height="calc(100vh - 380px)"
                  border
                  size="mini"
                >
                  <el-table-column
                    type="index"
                    label="序号"
                    width="60"
                    align="center"
                  />
                  <el-table-column
                    label="类别"
                    prop="Category"
                    min-width="100px"
                  />
                  <el-table-column
                    label="检查项目"
                    prop="ProjectContent"
                    min-width="100px"
                  />
                  <el-table-column label="检查内容" prop="Content" />
                  <el-table-column
                    label="满分"
                    width="80"
                    align="center"
                    prop="ScoreCriteria"
                  />
                  <el-table-column
                    label="得分"
                    width="100"
                    align="center"
                    prop="RC_Score"
                  />
                  <el-table-column label="扣分原因" prop="RC_DeductedPoints">
                    <template slot-scope="{ row }">
                      <p
                        v-for="(item, indexCheck) in row.Check"
                        :key="indexCheck"
                      >
                        {{ item.ErrorContent }}
                      </p>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="整改措施"
                    align="center"
                    prop="RC_RectificationMeasures"
                  />
                  <el-table-column
                    label="效果评价"
                    align="center"
                    prop="RC_Opinion"
                  />
                  <el-table-column
                    label="备注"
                    align="center"
                    prop="RC_DeductedPointsRemarks"
                  />
                </el-table>
              </div>
            </el-card>
          </div>
        </el-tab-pane>
        <el-tab-pane label="自查人员" name="second">
          <tree-filter
            ref="TreeID"
            :tree-data="TreeFilterData"
            @getSelect="getSelect"
          />
        </el-tab-pane>
      </el-tabs>

      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogAllot = false">取 消</el-button>
        <el-button
          :disabled="addFormData.Status >= 3 ? true : false"
          type="primary"
          size="small"
          @click="UpdateDistribution"
        >点击修改</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import { CopyDistribution, DeleteDistribution, SelectDistribution, UpdateDistribution } from '@/api/RC_Distribution';
import { mapGetters } from 'vuex';
import defaultDepts from '@/views/components/defaultDepts';
import { SelectTemplateByID } from '@/api/RC_Template';
import treeFilter from '@/views/components/treeFilter';
import { SelectDeptorUser } from '@/api/institution';
import { SelectZGUser } from '@/api/user';

export default {
  components: { treeFilter, defaultDepts },
  data() {
    return {
      nowDistributionUserID: '',
      form: {
        RC_ProjectName: '',
        RC_TemplateName: '',
        DistributionUserName: '',
        CheckUserName: '',
        pageSize: 15,
        pageIndex: 1,
        total: 0
      },
      listLoading: false,
      tableData: [],
      useTemplateDialogTitle: '修改项目',
      dialogAllot: false,
      addFormData: {
        RC_ProjectName: '',
        RC_TemplateName: '',
        RC_TemplateID: 0,
        RC_InspectionDepartmentID: 0,
        RC_ManagementLevel: '科室自查',
        RC_InspectionDepartment: 0,
        RC_InspectionTimeStat: '',
        RC_Inspector: '',
        RC_InspectorOther: '',
        RC_Filler: window.userInfo[0].UserID,
        RC_Remarks: '',
        Rc_checkcontent: [],
        RC_AllAuditOpinion: '',
        CheckUserID: 0,
        Status: '',
        IsJump: 0,
        ID: 0,
        DistributionUserID: ''
      },
      optionsUserName: '',
      options: [],
      optionsVal: {
        pageIndex: 1,
        pageSize: 0,
        total: 0,
        UserName: ''
      },
      TemplateTableData: [],
      innerDisabled: false,
      activeName: 'first',
      radioShow: false /* 是否隐藏单选 */,
      TreeFilterData: {
        label: 'Name',
        children: 'children',
        key: 'UserID' /* 要获取的值 */,
        treeData: []
      },
      rule: {
        RC_InspectionDepartment: [
          { required: true, message: '请选择科室', trigger: 'blur' }
        ],
        RC_ProjectName: [
          { required: true, message: '请输入项目名称', trigger: 'blur' }
        ],
        CheckUserID: [
          { required: true, message: '请选择审核人', trigger: 'blur' }
        ]
      },
      cellOverflow: false
    };
  },
  created() {
    this.SelectDistribution();
    this.getTreeData();
    this.SelectZGUser();
    this.permission_routes.map((item, index) => {
      /* 判断是否拥着regulatoryrectification菜单 */
      if (item.path === '/dailymanagement') {
        item.children.map((item2, index2) => {
          if (item2.path === 'regulatoryrectification') {
            this.radioShow = true;
          }
        });
      }
    });
  },
  computed: {
    ...mapGetters(['device', 'permission_routes'])
  },
  methods: {
    focus() {
      this.addFormData.RC_InspectionDepartmentID = 0;
    },
    async SelectDistribution(value) {
      this.listLoading = true;
      try {
        this.form.pageIndex = value === '搜索' ? 1 : this.form.pageIndex;
        const { data } = await SelectDistribution(this.form);
        this.tableData = data.DataList;
        this.form.total = data.Total;
      } catch (error) {
        console.log(error);
      }
      this.listLoading = false;
    },
    handleSizeChange(val) {
      this.form.pageSize = val;
      this.SelectDistribution();
    },
    handleCurrentChange(val) {
      this.form.pageIndex = val;
      this.SelectDistribution();
    },
    async UpdateDistribution() {
      this.addFormData.Rc_checkcontent = this.TemplateTableData.map(item => {
        return {
          RC_DeductedPoints:
            item.RC_DeductedPoints == ''
              ? ''
              : item.RC_DeductedPoints.join('$'),
          RC_Score: item.RC_Score,
          RC_DeductedPointsRemarks: item.RC_DeductedPointsRemarks,
          CheckID: item.CheckID,
          RC_RectificationMeasures: item.RC_RectificationMeasures,
          RC_Opinion: item.RC_Opinion,
          FileList_dto: item.FileList_dto
        };
      });
      this.addFormData.RC_InspectionDepartment = this.addFormData.RC_InspectionDepartment.toString();
      if (!this.addFormData.DistributionName) {
        this.$message.warning('请填写项目名称');
        return;
      }
      if (!this.addFormData.DistributionUserID) {
        this.addFormData.DistributionUserID = this.addFormData.DistributionUserID2;
        if (!this.addFormData.DistributionUserID) {
          this.$message.warning('请至少选择一位自查人员');
          return;
        }
      }

      try {
        this.addFormData.DistributionUserID = this.nowDistributionUserID;
        this.addFormData.DistributionUserID2 = this.nowDistributionUserID;
        const { code } = await UpdateDistribution(this.addFormData);
        if (code === 200) {
          this.$message.success('修改成功');
          this.SelectDistribution();
          this.dialogAllot = false;
        }
      } catch (error) { console.log(error); }
    },
    // 编辑表单
    async SelectTemplateByID(row) {
      this.innerDisabled = true;
      row = JSON.parse(JSON.stringify(row));
      this.useTemplateDialogTitle = '编辑项目：' + row.RC_ProjectName;
      this.dialogAllot = true;
      this.RC_InspectionDepartmentID = parseInt(row.RC_InspectionDepartmentID);
      this.optionsUserName = row.CheckUserName;
      const RC_InspectionDepartment = row.UsetemplateList.map((item, index) => {
        return parseInt(item.RC_InspectionDepartment);
      });

      this.addFormData = {
        ID: row.ID,
        GUID: row.GUID,
        DistributionName: row.DistributionName,
        RC_TemplateName: row.RC_TemplateName,
        RC_TemplateID: row.RC_TemplateID,
        TemplateID: row.TemplateID,
        RC_InspectionDepartmentID: parseInt(row.RC_InspectionDepartmentID),
        RC_InspectionDepartmentName: row.RC_InspectionDepartmentName,
        RC_ManagementLevel: '科室自查',
        RC_InspectionTimeStat: row.RC_InspectionTimeStat,
        RC_Inspector: row.RC_InspectorName,
        RC_InspectorOther: row.RC_InspectorOtherName,
        RC_Filler: window.userInfo[0].UserID,
        RC_Remarks: row.RC_Remarks,
        Rc_checkcontent: [],
        Status: row.Status,
        RC_AllAuditOpinion: row.RC_AllAuditOpinion,
        UserID: window.userInfo[0].UserID,
        DistributionID: row.DistributionID,
        DistributionUserID2: row.DistributionUserID /* 用来存放默认选中 */,
        IsJump: row.IsJump,
        CheckUserID: row.CheckUserID,
        RC_InspectionDepartment: RC_InspectionDepartment
      };
      this.$nextTick(() => {
        this.$refs.TreeID.setDeptorUser(row.DistributionUserID.split(','));
      });
      try {
        const { data } = await SelectTemplateByID({
          TemplateID: row.TemplateID
        });
        this.TemplateTableData = this.dataFiltter(data.DataList);
        this.getJBXXTableData();
      } catch (error) {
        console.log(error);
      }
    },
    // 再分配一次选中表单
    async againTemplate(row) {
      try {
        const { code } = await CopyDistribution({
          distributionId: row.DistributionID
        });
        if (code === 200) {
          this.$message.success('再次分配此表单成功');
          await this.SelectDistribution(); // 刷新表格
        }
      } catch (e) {
        console.log(e);
      }

    },
    dataFiltter(arr) {
      const map = {};
      const result = [];
      for (var i = 0; i < arr.length; i++) {
        var item = arr[i];
        if (!map[item.Content]) {
          result.push({
            Content: item.Content,
            RC_ErrorID: [item.ErrorID],
            ErrorContent: [item.ErrorContent],
            Grade: [item.Grade],
            Check: [
              {
                ErrorContent: item.ErrorContent,
                Grade: item.Grade
              }
            ],
            CheckID: item.CheckID,
            RC_Score: item.ScoreCriteria,
            ScoreCriteria: item.ScoreCriteria,
            Type: item.Type,
            id: Number(
              Math.random()
                .toString()
                .substr(3, 3) + Date.now()
            ).toString(36),
            RC_DeductedPointsRemarks: item.ProjectContentRemark,
            Category: item.Category,
            ProjectContent: item.ProjectContent,
            FileList_dto: [],
            ErrorIDArray: [],
            RC_DeductedPoints: [item.ErrorContent]
          });
          map[item.Content] = item;
        } else {
          for (var j = 0; j < result.length; j++) {
            var dj = result[j];
            if (dj.Content === item.Content) {
              dj.RC_ErrorID.push(item.ErrorID);
              dj.ErrorContent.push(item.ErrorContent);
              dj.Grade.push(item.Grade);
              dj.Check.push({
                ErrorContent: item.ErrorContent,
                Grade: item.Grade
              });
              dj.RC_Score = item.ScoreCriteria;
              dj.RC_DeductedPointsRemarks = item.ProjectContentRemark;
              dj.FileList_dto = [];
              dj.ErrorIDArray = [];
              dj.RC_DeductedPoints.push(item.ErrorContent);
              break;
            }
          }
        }
      }
      return result;
    },
    resetForm() {
      this.$refs.addFormData.resetFields();
    },
    cancle() {
      this.resetForm();
      this.innerDisabled = false;
      this.TemplateTableData = [];
      this.addFormData.RC_TemplateName = '';
      this.dialogAllot = false;
    },
    getDefaultDeptValues(v) {
      this.addFormData.RC_InspectionDepartment = v.join();
    },
    getJBXXTableData() {
      this.spanOneArr = [];
      this.spanTwoArr = [];
      let concatOne = 0;
      let concatTwo = 0;
      this.TemplateTableData.map((item, index) => {
        if (index === 0) {
          this.spanOneArr.push(1);
          this.spanTwoArr.push(1);
        } else {
          if (item.Category === this.TemplateTableData[index - 1].Category) {
            // 第一列需合并相同内容的判断条件
            this.spanOneArr[concatOne] += 1;
            this.spanOneArr.push(0);
          } else {
            this.spanOneArr.push(1);
            concatOne = index;
          }
          if (
            item.ProjectContent ===
            this.TemplateTableData[index - 1].ProjectContent
          ) {
            // 第二列和第1列需合并相同内容的判断条件
            this.spanTwoArr[concatTwo] += 1;
            this.spanTwoArr.push(0);
          } else {
            this.spanTwoArr.push(1);
            concatTwo = index;
          }
        }
      });
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        const _row = this.spanOneArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return [_row, _col];
      } else if (columnIndex === 2) {
        const _row = this.spanTwoArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return [_row, _col];
      }
    },
    submitTemplate() {
      this.$refs.addFormData.validate(async v => {
        if (v) {
          this.addFormData.Rc_checkcontent = this.TemplateTableData.map(
            item => {
              return {
                RC_DeductedPoints:
                  item.RC_DeductedPoints == ''
                    ? ''
                    : item.RC_DeductedPoints.join('$'),
                RC_Score: item.RC_Score,
                RC_DeductedPointsRemarks: item.RC_DeductedPointsRemarks,
                CheckID: item.CheckID,
                RC_RectificationMeasures: item.RC_RectificationMeasures,
                RC_Opinion: item.RC_Opinion
              };
            }
          );
          if (this.useTemplateDialogTitle !== '制作项目') {
            this.addFormData.RC_InspectionDepartment =
              this.addFormData.RC_InspectionDepartment ||
              this.RC_InspectionDepartmentID;
            delete this.addFormData.RC_InspectionDepartmentID;
            delete this.addFormData.RC_InspectionDepartmentName;
          }
          const fromData = this.addFormData;
          delete fromData.RC_TemplateName;
          const { msg } =
            this.useTemplateDialogTitle === '制作项目'
              ? await InsertUseTemp(fromData)
              : await UpdateUseTempDetail(fromData);
          this.$message({
            type: 'success',
            message: msg
          });
          this.cancle();
        } else {
          return false;
        }
        this.SelectDistribution();
        this.cancle();
      });
    },
    innerDialog() {
      this.$refs.templatelist.open();
    },
    async getTreeData() {
      try {
        const data = await SelectDeptorUser();
        this.TreeFilterData.treeData = data.data;
      } catch (error) { console.log(error); }
    },
    getSelect(val) {
      this.addFormData.DistributionUserID = val;

      this.nowDistributionUserID = val; // 此时的选择人员的id
    },

    DeleteDistribution(row) {
      if (row.Status > 1) {
        this.$message.warning('表单已使用，无法删除！');
        return;
      }
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      })
        .then(() => {
          DeleteDistribution({
            DistributionID: row.DistributionID,
            GUID: row.GUID
          })
            .then(res => {
              if (res.code === 200) {
                this.$message.success('删除成功!');
                this.SelectDistribution();
              }
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(() => {});
    },
    DeductedPoints(value, row) {
      /* 计算得分 */
      let sum = 0;
      value.map((item, index) => {
        row.Check.map((item2, index2) => {
          if (item == item2.ErrorContent) {
            sum += item2.Grade;
          }
        });
      });
      row.RC_Score = row.ScoreCriteria - sum;
    },
    async SelectZGUser() {
      this.optionsVal.UserName = this.optionsUserName;
      const { data } = await SelectZGUser(this.optionsVal);
      this.options = data.DataList;
      this.optionsVal.total = data.Total;
    },
    remoteMethod(val) {
      this.optionsUserName = val;
      this.SelectZGUser();
      this.optionsUserName = '';
    },
    selectUserID(val) {
      this.addFormData.CheckUserID = val;
    },
    optionsValSizeChange(val) {
      this.optionsVal.pageSize = val;
      this.SelectZGUser();
    },
    optionsValCurrentChange(val) {
      this.optionsVal.pageIndex = val;
      this.SelectZGUser();
    },
    search(val) {
      console.log(val);
    }
  }
};
</script>
<style lang="scss">

</style>
