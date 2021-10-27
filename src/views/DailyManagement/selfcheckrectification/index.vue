<template>
  <div class="SelfCheckRectification">
    <el-card>
      <div
        slot="header"
        class="clearfix"
      >
        <el-form
          :inline="true"
          :model="listQuery"
          size="mini"
        >
          <el-form-item>
            <el-input
              v-model="listQuery.RC_ProjectName"
              placeholder="项目名称"
              style="width: 180px"
              size="mini"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="listQuery.RC_InspectionDepartment"
              clearable
              placeholder="自查科室"
            >
              <el-option
                v-for="item in InspectionDepartments"
                :key="item.DeptID"
                :label="item.DeptName"
                :value="item.DeptID"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              :loading="listLoading"
              type="info"
              icon="el-icon-search"
              size="mini"
              @click="clickSelectOpinions"
            >搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="content">
        <el-table
          v-loading="listLoading"
          :data="tableData"
          style="width: 100%"
          border
          size="mini"
          height="calc(100vh - 180px)"
          @cell-click="cellClick"
        >
          <el-table-column
            label="序号"
            type="index"
            width="60"
            align="center"
          />
          <el-table-column
            label="项目名称"
            prop="RC_ProjectName"
            min-width="300"
          />
          <el-table-column
            label="自查科室"
            width="160"
            align="center"
            prop="RC_InspectionDepartmentName"
          />
          <el-table-column
            label="总分"
            prop="Score"
            width="80"
            align="center"
          />
          <el-table-column
            label="检查时间"
            width="140"
            align="center"
            prop="RC_InspectionTimeStat"
          >
            <template slot-scope="scope">
              {{ scope.row.RC_InspectionTimeStat.split("T").join(" ") }}
            </template>
          </el-table-column>
          <el-table-column
            label="存在问题"
            prop="RC_DeductedPoints"
            width="200"
          />
          <el-table-column
            label="整改措施"
            min-width="200"
            prop="RC_RectificationMeasures"
          >
            <template slot-scope="scope">
              <el-input
                v-if="scope.row.edit"
                v-model="scope.row.RC_RectificationMeasures"
                size="mini"
                type="textarea"
                autosize
                @blur="loseFcous(scope.$index, scope.row)"
              />
              <span v-else>{{ scope.row.RC_RectificationMeasures }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="效果评价"
            min-width="200"
            prop="RC_Opinion"
          >
            <template slot-scope="scope">
              <el-input
                v-if="scope.row.edit1"
                v-model="scope.row.RC_Opinion"
                size="mini"
                type="textarea"
                autosize
                @blur="loseFcous1(scope.$index, scope.row)"
              />
              <span v-else>{{ scope.row.RC_Opinion }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            fixed="right"
            width="160"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="SetOpnions2(scope.row)"
              >整改</el-button>
              <el-button
                size="mini"
                @click="SetOpnions(scope.row)"
              >保存</el-button>
              <el-button
                size="mini"
                @click="Archive(scope.row)"
              >归档</el-button>
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
    </el-card>

    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
    >
      <el-card shadow="never">
        <div style="display: flex">
          <div style="width: 60%">
            <standardCatalog
              maxheight="500px"
              @nodeClickCatalog="nodeClickCatalog"
            />
          </div>
          <div style="width: 40%">
            <articlegroup
              style="width: 140px"
              @getSelectAllArticleGroupValue="getSelectAllArticleGroupValue"
            />
            <el-input
              v-model="catalogName"
              type="textarea"
              placeholder="条款要点"
              disabled
              :rows="12"
              style="margin-top: 5px"
            />
          </div>
        </div>
      </el-card>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          size="mini"
          @click="cancel"
        >取 消</el-button>
        <el-button
          type="primary"
          size="mini"
          @click="InsertArticle"
        >确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="整改"
      :close-on-click-modal="false"
      :visible.sync="RC_RectificationMeasuresDialog"
      height="500px"
      :width="device === 'desktop' ? '70%' : '90%'"
      @close="RC_RectificationMeasuresDialog = false"
    >
      <el-table
        v-loading="Templateloading"
        :data="TemplateTableData"
        style="width: 100%"
        border
        height="500px"
        size="mini"
        :span-method="objectSpanMethod"
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
        <el-table-column
          label="检查内容"
          prop="Content"
        />
        <el-table-column
          label="总分"
          width="80"
          align="center"
          prop="ScoreCriteria"
        >
          <!-- <template slot-scope="scope">
                  <span>{{ scope.row.Grade.reduce((a, b) => a + b, 0) }}</span>
                </template> -->
        </el-table-column>
        <el-table-column
          label="得分"
          width="100"
          align="center"
          prop="RC_Score"
        >
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.RC_Score"
              type="Number"
              size="mini"
            />
          </template>
        </el-table-column>
        <el-table-column
          width="300"
          label="扣分原因"
          prop="RC_DeductedPoints"
          align="center"
        >
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.RC_DeductedPoints"
              multiple
              collapse-tags
              size="mini"
              placeholder="请选择扣分原因"
              clearable
              :style="{ width: '100%' }"
              @change="DeductedPoints(scope.row.RC_DeductedPoints, scope.row)"
            >
              <el-option
                v-for="(item, indexCheck) in scope.row.Check"
                :key="indexCheck"
                :label="item.ErrorContent"
                :value="item.ErrorContent"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          label="整改措施"
          align="center"
          prop="RC_RectificationMeasures"
        >
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.RC_RectificationMeasures"
              size="mini"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="效果评价"
          align="center"
          prop="RC_Opinion"
        >
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.RC_Opinion"
              size="mini"
            />
          </template>
        </el-table-column>

        <el-table-column
          label="备注"
          align="center"
          prop="RC_DeductedPointsRemarks"
        >
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.RC_DeductedPointsRemarks"
              size="mini"
              clearable
            />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import standardCatalog from '@/views/components/standardCatalog';
import articlegroup from '@/views/components/articlegroup';
import { SelectOpinions, SelectUseDept, SelectUseTempDetail, SetOpnions } from '@/api/RC_Template';
import tableHeight from '@/views/mixin/tableHeight';
import { InsertArticle } from '@/api/Article';
import { parseTime } from '@/utils/index';
import { mapGetters } from 'vuex';

export default {
  name: 'SelfCheckRectification',
  components: { standardCatalog, articlegroup },
  mixins: [tableHeight],
  data() {
    return {
      listLoading: true,
      dialogVisible: false,
      title: '',
      tableData: [],
      InspectionDepartments: [],
      catalogName: '',
      formData: {},
      ErrorList_dto: [],
      submitData: {
        Title: '',
        GroupID: 0,
        CatalogID: 0,
        Content: '',
        AuthorID: window.userInfo[0].UserID
      },
      listQuery: {
        RC_ManagementLevel: '科室自查',
        RC_InspectionDepartment: '',
        RC_FunctionalDepartment: '',
        RC_ProjectName: '',
        pageIndex: 1,
        pageSize: 20
      },
      pagination: {
        pageIndex: 1,
        total: 0,
        pageSize: 20,
        pageSizes: [20, 50, 100, 150, 200]
      },
      RC_RectificationMeasuresDialog: false,
      TemplateTableData: [],
      Templateloading: false
    };
  },
  computed: {
    ...mapGetters(['device'])
  },
  mounted() {
    this.SelectOpinions();
    this.SelectUseDept();
  },
  methods: {
    async InsertArticle() {
      if (
        (this.formData.IsCriterion == 1 || this.formData.Count == 0) &&
        this.submitData.GroupID != 0
      ) {
        const formData = this.formData;
        let newContent = '';
        this.ErrorList_dto.forEach((item) => {
          newContent += `<tr align="left">
                <td>${item.Content}</td>
                <td>${item.ScoreCriteria}</td>
                <td>${item.RC_Score}</td>
                <td>${item.RC_DeductedPoints.split('$').join('\n')}</td>
                <td>${item.RC_DeductedPointsRemarks}</td>
            </tr>`;
        });
        this.submitData.Content = `<table border="1px solid #666666" style="border-collapse: collapse; " width='100%' align="center">
            <tr align = "center" >
                <th>项目名称</th>
                <th>自查科室</th>
                <th>总分</th>
                <th>检查时间</th>
                <th>存在问题</th>
                <th>整改措施</th>
                <th>效果评价</th>
                <th>归档人</th>
			      </tr>
            <tr align="left">
                <td>${formData.RC_ProjectName}</td>
                <td>${formData.RC_InspectionDepartmentName}</td>
                <td>${formData.Score}</td>
                <td>${formData.RC_InspectionTimeStat}</td>
                <td>${formData.RC_DeductedPoints}</td>
                <td>${formData.RC_RectificationMeasures}</td>
                <td>${formData.RC_Opinion}</td>
                <td>${window.userInfo[0].UserName}</td>
            </tr>
          </table>
          <br>
          <table border="1px solid #666666" style="border-collapse: collapse; " width='100%' align="center">
            <tr align = "center" >
                <th>检查内容</th>
                <th>默认分值（分）</th>
                <th>最终得分（分）</th>
                <th>扣分原因</th>
                <th>扣分原因备注</th>
            </tr>
            ${newContent}
          </table>`;
        try {
          const { msg } = await InsertArticle(this.submitData);
          this.$message({
            type: 'success',
            message: msg
          });
        } catch { }
        this.cancel();
      } else {
        this.$notify({
          title: '警告',
          type: 'warning',
          message: '请选择 资料类别和子集评审标准！'
        });
      }
    },
    getSelectAllArticleGroupValue(v) {
      this.submitData.GroupID = v;
    },
    nodeClickCatalog(v) {
      this.catalogName = v.CatalogName;
      this.submitData.CatalogID = v.CatalogID;
      this.formData.IsCriterion = v.IsCriterion;
      this.formData.Count = v.Count;
    },
    async Archive(row) {
      row = JSON.parse(JSON.stringify(row));
      if (!row.RC_RectificationMeasures || !row.RC_Opinion) {
        this.$message('整改措施和效果评价必须填写');
        return;
      }
      try {
        const { data } = await SelectUseTempDetail({
          TemplateID: row.RC_TemplateID,
          RC_ProjectName: row.RC_ProjectName
        });
        this.ErrorList_dto = data;
      } catch { }
      this.title = row.RC_ProjectName;
      this.submitData.Title = row.RC_ProjectName;
      this.dialogVisible = true;
      this.formData = row;
    },
    cancel() {
      this.dialogVisible = false;
      this.title = '';
      this.catalogName = '';
    },
    async SetOpnions(row) {
      row = JSON.parse(JSON.stringify(row));
      if (!row.RC_RectificationMeasures && !row.RC_Opinion) {
        this.$message('整改措施或效果评价至少填写一个');
        return;
      }
      const dataForm = {
        RC_RectificationMeasures: row.RC_RectificationMeasures,
        RC_Opinion: row.RC_Opinion,
        RC_CreateTime: parseTime(Date.now()),
        RC_CreateUser: window.userInfo[0].UserID,
        GUID: row.GUID
      };
      try {
        const { msg } = await SetOpnions(dataForm);
        this.$message({
          type: 'success',
          message: msg
        });
      } catch { }
    },
    async SetOpnions2(row) {
      this.RC_RectificationMeasuresDialog = true;
      this.Templateloading = true;
      try {
        const { data } = await SelectUseTempDetail({
          TemplateID: row.RC_TemplateID,
          RC_ProjectName: row.RC_ProjectName
        });
        this.TemplateTableData = data.map((item) => {
          return {
            CheckID: item.CheckID,
            Content: item.Content,
            ProjectContent: item.ProjectContent,
            ProjectContentRemark: item.ProjectContentRemark,
            Category: item.Category,
            RC_ProjectName: item.RC_ProjectName,
            RC_Score: item.RC_Score,
            ScoreCriteria: item.ScoreCriteria,
            RC_DeductedPoints: item.RC_DeductedPoints.split('$'),
            RC_DeductedPointsRemarks: item.RC_DeductedPointsRemarks,
            Grade: item.ErrorList_dto.map((item) => {
              return item.Grade;
            }),
            Check: item.ErrorList_dto.map((item) => {
              return { ErrorContent: item.ErrorContent, Grade: item.Grade };
            }),
            RC_RectificationMeasures: item.RC_RectificationMeasures,
            RC_Opinion: item.RC_Opinion
          };
        });
        this.getJBXXTableData();
      } catch { }
      this.Templateloading = false;
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
    async SelectOpinions() {
      try {
        const { data } = await SelectOpinions(this.listQuery);
        data.DataList.map((item) => {
          this.$set(item, 'edit', false);
          this.$set(item, 'edit1', false);
          item.RC_DeductedPoints = [
            ...new Set(item.RC_DeductedPoints.split('$'))
          ].join(' ');
        });
        this.tableData = data.DataList;
        this.pagination.total = data.Total;
      } catch {
      } finally {
        this.listLoading = false;
      }
    },
    loseFcous(index, row) {
      row.edit = false;
    },
    loseFcous1(index, row) {
      row.edit1 = false;
    },
    cellClick(row, column, cell, event) {
      switch (column.label) {
        case '整改措施':
          row.edit = true;
          this.$nextTick(() => {
            document.querySelector('textarea').focus();
          });
          break;

        case '效果评价':
          row.edit1 = true;
          this.$nextTick(() => {
            document.querySelector('textarea').focus();
          });
          break;

        default:
          row.edit = false;
          row.edit1 = false;
          break;
      }
    },
    handleCurrentChange(index) {
      this.listLoading = true;
      this.listQuery.pageIndex = index;
      this.SelectOpinions();
    },
    handleSizeChange(page) {
      this.listLoading = true;
      this.listQuery.pageSize = page;
      this.clickSelectOpinions();
    },
    async clickSelectOpinions() {
      this.listLoading = true;
      this.listQuery.pageIndex = 1;
      this.pagination.pageIndex = 1;
      this.SelectOpinions();
    },
    async SelectUseDept() {
      try {
        const { data } = await SelectUseDept({
          Type: '自查科室',
          RC_ManagementLevel: '科室自查'
        });
        data.map((v) => {
          for (const key in v) {
            if (v[key] === null) {
              delete v[key];
            }
          }
        });
        const newArr = [];
        for (const j in data) {
          for (const prop in data[j]) {
            if (prop !== '' || data[j][prop] !== '') {
              newArr.push(data[j]);
            }
          }
        }
        this.InspectionDepartments = [...new Set(newArr)];
      } catch { }
    }
  }
};
</script>
<style lang="scss">
.SelfCheckRectification {
  margin: 4px;
  .el-card__body {
    padding: 6px;
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
