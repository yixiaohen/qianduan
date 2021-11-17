<template>
  <el-card class="box-card-view">
    <el-card shadow="never" class="box-card-center">
      <div slot="header">
        <div class="search-view">
          <el-form
            ref="listQuery"
            size="mini"
            :inline="true"
            :model="listQuery"
          >
            <el-form-item>
              <el-button
                type="primary"
                :disabled="modalShow"
                @click="openModel"
              >制作课件
              </el-button>
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="listQuery.coursewareName"
                placeholder="课件名称"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="clickSelectCourseWare('listQuery')"
              >搜索
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <el-table
        v-loading="listLoading"
        :data="tableData"
        height="calc(100vh - 216px)"
        border
        size="mini"
      >
        <el-table-column
          type="index"
          fixed="left"
          width="50"
          label="序号"
          align="center"
        />
        <el-table-column prop="coursewareName" label="课件标题" />
        <el-table-column
          prop="createDate"
          label="创建时间"
          width="160"
          align="center"
        >
          <template slot-scope="{ row }">
            {{ row.createDate.replace('T', ' ') }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="100">
          <template slot-scope="{ row }">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="UpdateCourseWare(row)"
            />
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="DeleteCourseWare(row)"
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
    </el-card>

    <el-dialog
      custom-class="modalShow"
      :visible.sync="modalShow"
      :close-on-click-modal="false"
      :title="modalTitle"
      width="600"
    >
      <el-form
        ref="CourseWareFormData"
        label-position="top"
        :model="CourseWareFormData"
        size="mini"
        :rules="ruleValidate"
      >
        <el-row type="flex" :gutter="16">
          <el-col :span="12">
            <el-form-item label="课件名称" prop="coursewareName">
              <el-input v-model="CourseWareFormData.coursewareName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上传附件">
              <el-upload
                multiple
                :file-list="fileList"
                action="/api/PX_CourseWare/UploadFile"
                :on-success="onSuccess"
              >
                <el-button icon="ios-cloud-upload-outline">上传附件</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-card shadow="never" :style="{ height: '410px', overflow: 'auto' }">
        <el-table border size="mini" :data="CourseWareFormData.File_content">
          <el-table-column
            type="index"
            fixed="left"
            width="50"
            label="序号"
            align="center"
          />
          <el-table-column prop="Title" label="附件名称" />
          <el-table-column label="操作" align="center" width="300">
            <template slot-scope="{ row,$index }">
              <el-tooltip v-if="currentIndex!==$index" effect="light" content="要求观看时长" placement="top">
                <el-tag>
                  <span>要求观看时长：{{ row.TargetTime || 300 }}秒</span>
                </el-tag>
              </el-tooltip>
              <el-input
                v-if="currentIndex===$index"
                v-model="row.TargetTime"
                placeholder="单位为秒"
                size="mini"
                style="width: 80px"
              />
              <el-button
                v-if="currentIndex!==$index"
                type="primary"
                size="mini"
                style="margin-right: 5px"
                @click="editTtimeSeries(row,$index)"
              >设置时长
              </el-button>
              <el-button
                v-if="currentIndex===$index"
                type="primary"
                size="mini"
                style="margin-right: 5px"
                @click="currentIndex=-1"
              >完成
              </el-button>

              <el-button
                v-if="currentIndex!==$index"
                type="success"
                size="mini"
                style="margin-right: 5px"
                @click="removeFileList(row,$index)"
              >移除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <div slot="footer">
        <el-button
          size="mini"
          style="margin-right: 5px"
          @click="onCancel()"
        >取消
        </el-button>
        <el-button
          :loading="InsertCourseWareLoading"
          size="mini"
          type="primary"
          style="margin-right: 5px"
          @click="InsertCourseWare()"
        >提交
        </el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
import {
  DeleteCourseWare,
  InsertCourseWare,
  SelectCourseWare,
  SelectCourseWareDetailByID,
  UpdateCourseWare
} from '@/api/PX_CourseWare';

export default {
  name: 'CourseWare',
  data() {
    return {
      timeSeries: 300, // 要求观看的该课件时长300秒
      currentIndex: -1, // 当前编辑的秒数条款下标
      InsertCourseWareLoading: false, // 制作课件确认提交按钮等待圈
      fileList: [],
      listLoading: true,
      modalTitle: '',
      listQuery: {
        pageIndex: 1,
        pageSize: 15,
        Title: '',
        coursewareName: ''
      },
      pagination: {
        pageIndex: 1,
        total: 0,
        pageSize: 15,
        pageSizes: [15, 20, 50, 100, 150, 200]
      },
      total: 0,
      modalShow: false,
      tableData: [],
      File_content: [],
      CourseWareFormData: {
        Id: 0,
        coursewareID: 0,
        coursewareName: '',
        createDate: new Date(),
        File_content: []
      },
      ruleValidate: {
        coursewareName: [
          {
            required: true,
            message: '请填写课件名称',
            trigger: 'blur'
          }
        ]
      }
    };
  },
  created() {
    this.SelectCourseWare();
  },
  methods: {
    editTtimeSeries(row, index) {
      this.currentIndex = index; // 保存当前编辑的下标
      if (!row.TargetTime) {
        row.TargetTime = 300;
      }
    },
    DeleteCourseWare(row) {
      const { coursewareID } = row;
      this.$confirm(`是否删除：${row.coursewareName}`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          try {
            const { msg } = await DeleteCourseWare({ coursewareID });
            this.$message({
              type: 'success',
              message: msg
            });
            this.SelectCourseWare();
          } catch (error) {
          }
        })
        .catch((e) => e);
    },
    removeFileList(row) {
      const { Title } = row;
      this.CourseWareFormData.File_content.forEach((item, index) => {
        if (Title === item.Title) {
          this.CourseWareFormData.File_content.splice(index, 1);
        }
      });
    },
    onSuccess(response, file, fileList) {

      const { data } = response;
      this.CourseWareFormData.File_content.push(data[0]);
      // 得到附件的数据后，遍历，修改里面的要求观看时长TargetTime使其为300秒
      this.CourseWareFormData.File_content.map((item) => {
        item.TargetTime = 300;
      });
    },
    async UpdateCourseWare(row) {
      try {
        const { data } = await SelectCourseWareDetailByID({
          coursewareID: row.coursewareID
        });
        this.CourseWareFormData = data;
        this.modalTitle = '编辑课件：' + row.coursewareName;
      } catch (error) {
      } finally {
        this.modalShow = true;
      }
    },
    async InsertCourseWare() {
      this.currentIndex = -1; // 重置当前编辑的下标
      this.fileList = []; // 清除文件列表
      this.$refs['CourseWareFormData'].validate(async(v) => {
        if (v) {
          this.InsertCourseWareLoading = true; // 开启提交按钮等待圈
          const form = this.CourseWareFormData;
          try {
            const { msg } =
              this.modalTitle === '新增课件'
                ? await InsertCourseWare(form)
                : await UpdateCourseWare(form);
            this.$message({
              type: 'success',
              message: msg
            });
            this.InsertCourseWareLoading = false; // 关闭提交按钮等待圈
            this.modalShow = false;

            this.SelectCourseWare();
          } catch (error) {
            this.InsertCourseWareLoading = false; // 关闭提交按钮等待圈
          }
        } else {
          this.InsertCourseWareLoading = false; // 关闭提交按钮等待圈
          this.$message({
            type: 'error',
            message: '你有必填项没填写'
          });
        }
      });
    },
    onCancel() {
      this.CourseWareFormData = {
        Id: 0,
        coursewareID: 0,
        coursewareName: '',
        createDate: new Date(),
        File_content: []
      };
      this.modalShow = false;
      this.currentIndex = -1; // 重置当前编辑的下标
      this.fileList = []; // 清除文件列表
    },
    openModel() {
      this.modalTitle = '新增课件';
      this.modalShow = true;
      this.InsertCourseWareLoading = false; // 关闭提交按钮等待圈
      this.restCourseWareFormData();
      this.fileList = []; // 清除文件列表
    },
    restCourseWareFormData() {
      this.CourseWareFormData = {
        Id: 0,
        coursewareID: 0,
        coursewareName: '',
        createDate: new Date(),
        File_content: []
      };
    },
    clickSelectCourseWare() {
      this.listQuery.pageIndex = 1;
      this.SelectCourseWare();
    },
    async SelectCourseWare() {
      try {
        this.listLoading = true;
        const { data } = await SelectCourseWare(this.listQuery);
        this.pagination.total = data.Total;
        this.tableData = data.DataList;
      } catch (error) {
        console.log(error);
      } finally {
        this.listLoading = false;
      }
    },
    handleCurrentChange(val) {
      this.listQuery.pageIndex = val;
      this.SelectCourseWare();
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.SelectCourseWare();
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../ExampleTrainStyles/index.scss";

.box-card-view {
  ::v-deep {
    .el-card__body {
      padding: 8px;
    }

    .modalShow {
      .footer {
        text-align: right;
        margin-top: 10px;
      }

      .footer button {
        margin: 0 5px;
      }

      .el-card__header {
        padding: 8px 20px;
        border-bottom: 1px solid #e6ebf5;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
      }
    }
  }
}
</style>
