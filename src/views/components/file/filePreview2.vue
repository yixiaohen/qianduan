<template>
  <!-- 文件预览及下载 -->
  <div>
    <el-table
      v-if="previewData.length > 0"
      :data="previewData"
      border
      height="400px"
      size="medium"
    >
      <el-table-column
        prop="title"
        label="资料标题"
      >
        <template slot-scope="{row, $index }">
          <el-input
            v-if="currentEdit === $index"
            v-model="row.FileName"
            size="mini"
          />
          <span
            v-else
            style="cursor: pointer !important"
            @click="PreviewFile(row.FileUrl)"
          >{{ row.title || row.FileName }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column-->
      <!--        width="90px"-->
      <!--        align="center"-->
      <!--      >-->
      <!--        <template slot-scope="{ row, $index }">-->
      <!--          <el-button-->
      <!--            v-if="currentEdit === $index"-->
      <!--            type="text"-->
      <!--            size="small"-->
      <!--            @click="finishEditClick(row.FileID,row.FileName)"-->
      <!--          >完成-->
      <!--          </el-button>-->
      <!--          <span-->
      <!--            v-else-->
      <!--            style="cursor: pointer !important; color: #3e84e9"-->
      <!--            @click="EditClick($index)"-->
      <!--          >修改</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column
        width="90px"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-link target="_blank" :href="'Annex/file/' + row.FileUrl.replace('%', '%25')">点击下载</el-link>
        </template>
      </el-table-column>
      <el-table-column
        width="90px"
        align="center"
      >
        <template slot-scope="{ row }">
          <span
            style="cursor: pointer !important; color: #3e84e9"
            @click="PreviewFile(row.FileUrl)"
          >点击预览</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="deleteShowFile"
        width="90px"
        align="center"
      >
        <template slot-scope="{ row }">
          <span
            style="cursor: pointer !important; color: #3e84e9"
            @click="deleteFile(row)"
          >删除</span>
        </template>
      </el-table-column>
    </el-table>
    <p v-if="previewData.length === 0">暂无新上传资料数据</p>
  </div>
</template>
<script>
import { PreviewFile } from '@/api/Article';

export default {
  props: {
    previewData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    deleteShowFile: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentEdit: -1 // 判断是否显示input框
    };
  },
  methods: {
    // 上传文件名修改
    EditClick(index) {
      this.currentEdit = index;
      // alert(index);
    },
    async finishEditClick(FileID, FileName) {
      try {
        // const { data } = await UpdateArticleFile({
        //   FileID: FileID,
        //   FileName: FileName
        // }
        // );
        // this.$message.success('修改成功');
        // console.log(data);
        this.currentEdit = -1;// 将修改input框隐藏
      } catch (error) {
        console.log(error);
      }
    },
    async PreviewFile(title) {
      // 由于已经加了/Annex/file，所以，如果有的就去掉/Annex/file
      var res = title.search('/Annex/file');
      if (res !== -1) {
        title = title.replace(/Annex\/file\/|\//g, '');
      }
      /* 文件预览 */
      console.log('title', title);
      try {
        // title = title.replace(/Annex\/file\/|\//g, '');
        const { data } = await PreviewFile({
          Title: title
        });
        this.$nextTick(() => {
          const link = document.createElement('a');
          link.style.display = 'none';
          link.href = data;
          link.target = '_blank';

          document.body.appendChild(link);
          link.click();
        });
      } catch (error) {
        console.log(error);
      }
    },
    deleteFile(row) {
      this.previewData.map((item, index) => {
        if (item.FileID === row.FileID) {
          this.previewData.splice(index, 1);
        }
      });
    },
    getFileData() {
    }
  }
};
</script>
