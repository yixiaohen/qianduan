<template>
  <el-container>
    <el-aside width="350px" style="height: calc(100vh - 120px)">
      <Tree @nodeClick="nodeClick" />
    </el-aside>
    <el-main style="height: calc(100vh - 120px)">
      <el-form :inline="true" class="demo-form-inline" size="mini">
        <div v-if="CheckListVal.Type == 1">
          <el-form-item>
            <el-input
              v-model.trim="CheckListVal.DiseaseName"
              placeholder="疾病名称"
              clearable
              show-word-limit
              maxlength="200"
              @keyup.enter.native="SelectStandardList('搜索')"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model.trim="CheckListVal.DiagnosticMeans"
              placeholder="诊断手段"
              clearable
              show-word-limit
              maxlength="200"
              @keyup.enter.native="SelectStandardList('搜索')"
            /></el-form-item>
          <el-form-item>
            <el-input
              v-model.trim="CheckListVal.MainTreatment"
              placeholder="主要治疗手段"
              clearable
              show-word-limit
              maxlength="200"
              @keyup.enter.native="SelectStandardList('搜索')"
            /></el-form-item>
          <el-form-item>
            <el-select
              v-model="CheckListVal.StandardType"
              clearable
              placeholder="标准类型"
              @change="elSelect"
            >
              <el-option label="基本标准" value="1" />
              <el-option label="推荐标准" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="SelectStandardList('搜索')"
            >搜索</el-button>
          </el-form-item>
        </div>
        <div v-if="CheckListVal.Type == 2">
          <el-form-item>
            <el-input
              v-model.trim="CheckListVal.KeyTechnology"
              placeholder="关键技术"
              clearable
              show-word-limit
              maxlength="200"
              @keyup.enter.native="SelectStandardList('搜索')"
            /></el-form-item>
          <el-form-item>
            <el-input
              v-model.trim="CheckListVal.MainApplicationRange"
              placeholder="主要应用范围"
              clearable
              show-word-limit
              maxlength="200"
              @keyup.enter.native="SelectStandardList('搜索')"
            /></el-form-item>
          <el-form-item>
            <el-select
              v-model="CheckListVal.StandardType"
              clearable
              placeholder="标准类型"
              @change="elSelect"
            >
              <el-option label="基本标准" value="1" />
              <el-option label="推荐标准" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="SelectStandardList('搜索')"
            >搜索</el-button>
          </el-form-item>
        </div>
        <div v-if="CheckListVal.Type == 3">
          <el-form-item>
            <el-input
              v-model.trim="CheckListVal.AnesthesiaProject"
              placeholder="麻醉项目"
              clearable
              show-word-limit
              maxlength="200"
              @keyup.enter.native="SelectStandardList('搜索')"
            /></el-form-item>
          <el-form-item>
            <el-select
              v-model="CheckListVal.StandardType"
              clearable
              placeholder="标准类型"
              @change="elSelect"
            >
              <el-option label="基本标准" value="1" />
              <el-option label="推荐标准" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="SelectStandardList('搜索')"
            >搜索</el-button>
          </el-form-item>
        </div>
      </el-form>
      <transition name="el-zoom-in-center">
        <el-table
          v-loading="loading"
          :data="tableData"
          border
          style="width: 100%; height: calc(100vh - 200px)"
          size="mini"
          stripe
        >
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="49"
          />
          <el-table-column
            v-if="CheckListVal.Type == 1"
            prop="DiseaseName"
            :label="CheckListVal.lableTypeName"
            align="center"
          >
            <el-table-column prop="DiseaseName" label="疾病名称">
              <template slot-scope="{ row }">
                {{ row.DiseaseName }}
              </template></el-table-column>
            <el-table-column prop="DiagnosticMeans" label="诊断手段">
              <template slot-scope="{ row }">
                {{ row.DiagnosticMeans }}
              </template>
            </el-table-column>
            <el-table-column prop="MainTreatment" label="主要治疗手段">
              <template slot-scope="{ row }">
                {{ row.MainTreatment }}
              </template>
            </el-table-column>
          </el-table-column>

          <el-table-column
            v-if="CheckListVal.Type == 2"
            :label="CheckListVal.lableTypeName"
            align="center"
          >
            <el-table-column prop="KeyTechnology" label="关键技术">
              <template slot-scope="{ row }">
                {{ row.KeyTechnology }}
              </template>
            </el-table-column>
            <el-table-column prop="MainApplicationRange" label="主要应用范围">
              <template slot-scope="{ row }">
                {{ row.MainApplicationRange }}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column
            v-if="CheckListVal.Type == 3"
            :label="CheckListVal.lableTypeName"
            align="center"
          ><el-table-column prop="AnesthesiaProject" label="麻醉项目">
            <template slot-scope="{ row }">
              {{ row.AnesthesiaProject }}
            </template>
          </el-table-column></el-table-column>
          <el-table-column
            label="年均例数要求"
            prop="QuantityRequirement"
            align="center"
            width="100px"
          />
          <el-table-column label="实际例数" align="center" width="100px">
            <template slot-scope="{ row }">
              <el-button size="mini" type="text" @click="ClickRow(row)">{{
                row.ActualQuantity
              }}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            v-if="CheckListVal.StandardType == 2 || 1"
            label="标准类型"
            width="90px"
            align="center"
          ><template slot-scope="{ row }">
            <span>{{ row.StandardType == 1 ? "基本标准" : "推荐标准" }}</span>
          </template>
          </el-table-column>
          <el-table-column
            prop="StandardCode"
            label="编码"
            align="center"
            width="49"
          />
        </el-table>
      </transition>

      <el-pagination
        :current-page="CheckListVal.pageIndex"
        :page-sizes="[15, 20, 30, 40]"
        :page-size="CheckListVal.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="CheckListVal.Total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <el-dialog
        title="病例信息"
        :visible.sync="dialogVisible"
        :width="device === 'desktop' ? '40%' : '95%'"
      >
        <el-table
          :data="tableDataDialog"
          stripe
          style="width: 100%"
          height="500px"
          size="mini"
        >
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center"
          />
          <el-table-column prop="name" label="姓名" align="center" />
          <el-table-column prop="code" label="患者住院号" align="center" />
          <el-table-column prop="date" label="入院日期" /> </el-table></el-dialog>
    </el-main>
  </el-container>
</template>
<script>
import { mapGetters } from 'vuex';
import Tree from './components/tree';
import { SelectStandardList } from '@/api/TechnicalStandard/StandardDisplay';

export default {
  components: {
    Tree
  },
  data() {
    return {
      tableData: [],
      CheckListVal: {
        pageIndex: 1,
        pageSize: 15,
        Total: 0,
        DirectoryID: 0,
        Type: '',
        lableTypeName: '',
        DiseaseName: '',
        DiagnosticMeans: '',
        KeyTechnology: '',
        MainApplicationRange: '',
        AnesthesiaProject: '',
        StandardType: ''
      },
      loading: false,
      dialogVisible: false,
      tableDataDialog: [],
      num: ''
    };
  },
  computed: {
    ...mapGetters(['device'])
  },
  created() {},
  methods: {
    handleSizeChange(val) {
      this.CheckListVal.pageIndex = 1;
      this.CheckListVal.pageSize = val;
      this.SelectStandardList();
    },
    handleCurrentChange(val) {
      this.CheckListVal.pageIndex = val;
      this.SelectStandardList();
    },
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const newChild = { id: '123', name: this.addText, children: [] };
          val.children.push(newChild);
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    select() {},
    async nodeClick(val) {
      try {
        if (!val.Type) {
          return;
        }
        this.loading = true;
        this.CheckListVal.DirectoryID = val.DirectoryID;
        this.CheckListVal.Type = val.Type;
        this.CheckListVal.lableTypeName = val.DirectoryName;
        const { data } = await SelectStandardList(this.CheckListVal);
        this.tableData = data.DataList;

        this.CheckListVal.Total = data.Total;
      } catch (error) {
        console.log(error);
      }
      setTimeout(() => {
        this.loading = false;
      }, 300);
    },
    async SelectStandardList(val) {
      try {
        this.loading = true;
        this.CheckListVal.pageIndex =
          val == '搜索' ? 1 : this.CheckListVal.pageIndex;
        const { data } = await SelectStandardList(this.CheckListVal);
        this.tableData = data.DataList;
        this.CheckListVal.Total = data.Total;
      } catch (error) {
        console.log(error);
      }
      setTimeout(() => {
        this.loading = false;
      }, 300);
    },
    elSelect(val) {
      this.CheckListVal.pageIndex = 1;
      this.SelectStandardList();
    },
    ClickRow(row) {
      this.dialogVisible = true;
      this.tableDataDialog = [];
      const arrName = ['张一', '张一', '张二', '李四', '张三', '李五', '张四'];
      for (let i = 0; i < row.ActualQuantity; i++) {
        this.tableDataDialog.push({
          code: Math.floor(Math.random() * (1 - 1000) + 1000),
          name: arrName[Math.floor(Math.random() * (1 - 6) + 6)],
          date:
            '2021-' +
            Math.floor(Math.random() * (1 - 12) + 12) +
            '-' +
            Math.floor(Math.random() * (1 - 30) + 30)
        });
      }
    }
  }
};
</script>

<style lang="scss">
@import "./style/index.scss";
</style>
