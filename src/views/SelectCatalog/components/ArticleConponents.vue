<template>
  <div

    style="border: 1px solid rgb(223, 223, 223)"
  >

    <div
      style="
        text-align: center;
        color: rgb(0, 102, 204);
        font-weight: bold;
        border-bottom: 1px solid rgb(223, 223, 223);
      "
    >
      相关资料  <el-tag  type="success" v-if="title1!==''">
      {{ title1 }}
    </el-tag>
    </div>
    <div
      style="
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        border-bottom: 1px solid rgb(223, 223, 223);
        line-height: 25px;"
    >
      <span>总结：</span>
      <span
        v-for="(item1, index1) in value.Article.length ===0?0:value.Article"
        v-show="item1.AuthorName!==''"
        :key="index1"
        class="spanABC"
        @mouseenter="mouseenter(item1, index1)"
      >
        {{ item1.SerialNo }}</span>

    </div>
    <div style="font-size: 1vh">

      <p
        v-for="(itemTitle, indexTitle) in value.Article.length ===0?[]: value.Article[itemIndex].Article_list"
        :key="indexTitle"
        style="margin-left:10px"
      >

        <span v-if="ming1[indexTitle].Title!==''" >
          <el-link type="primary" @click="SelectArticleByArticleID(ming1[indexTitle].ArticleID)">
           ({{indexTitle+1}}) .{{ ming1[indexTitle].Title }}
          </el-link>
        </span>
        <!--      <p-->
        <!--        v-for=" (item,index) in ming1"-->
        <!--      >-->
        <!--        <el-link>-->

        <!--          {{ item.Title }}-->

        <!--        </el-link>-->
      </p>
    </div>
    <!--      indexTitle===numMing ?  ming1[numMing]:ming1[indexTitle]-->
    <!--      <p-->
    <!--        v-for="(ji,index) in value.Article.length ===0?[]:  ming1"-->
    <!--        :key="index"-->
    <!--      >-->
    <!--        <el-link type="primary" @click="SelectArticleByArticleID(ming2[index])">{{-->
    <!--            ji-->
    <!--          }}-->
    <!--        </el-link>-->
    <!--      </p>-->


    <el-dialog
      :title="'上传人:' + formInline.AuthorName"
      :visible.sync="dialogVisible"
      :width="device === 'desktop' ? '50%' : '90%'"
    >
      <div style="height: 50vh; overflow: auto">
        <filePreview2 :preview-data="previewData"/>
        <el-form size="mini" :model="formInline" class="demo-form-inline">
          <el-form-item label="">
            <p>上传时间:{{ formInline.CreatDate }}</p>
          </el-form-item>
          <el-form-item label="">
            <p v-html="formInline.Content"/>
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button
          size="mini"
          type="primary"
          @click="dialogVisible = false"
        >关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { SelectArticleByArticleID } from '@/api/catalog';
import { Preview } from '@/views/mixin/relace';
import { SelectArticleDetail } from '@/api/Article';
import filePreview2 from '@/views/components/file/filePreview2';
import { mapGetters } from 'vuex';

export default {
  name: 'ArticleConponents',
  components: { filePreview2 },
  // filters: {
  //   capitalize1(item1) {
  //     if (item1.AuthorName === null) {
  //       item1.SerialNo = '';
  //       return item1.AuthorName;
  //     }
  //     else{
  //       return '测试 ';
  //     }
  //   }
  // },
  props: {
    value: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      itemIndex: 0,
      previewData: [],
      formInline: {},
      dialogVisible: false,
      ming1: [{ Title: '', ArticleID: 0 }],
      ming2: [],
      tempjin: [],
      title1: ''
    };
  },

  computed: {
    ...mapGetters(['device'])
  },

  created() {
    this.jin();
  },

  methods: {

    mouseenter(item1, index1) {
      this.itemIndex = index1;
      this.title1 = item1.SerialNo;
      this.jin(this.itemIndex);
    },
    async SelectArticleByArticleID(row) {
      try {
        this.previewData = [];
        const { data } = await SelectArticleByArticleID({
          ArticleID: row
        });
        this.formInline = data[0];
        const data2 = await SelectArticleDetail({ ArticleID: row });
        this.previewData = [...Preview(data[0].Content), ...data2.data];
        // console.log('仔细',this.previewData);
        // console.log('仔细2',data2.data);

        this.dialogVisible = true;
      } catch (error) {
        console.log(error);
      }
    },


    jin(itemIndex = 0) {
      this.ming1 = [];
      this.ming2 = [];
      for (var i of this.value.Article[itemIndex].Article_list) {
        this.ming1.push({ Title: i.Title, ArticleID: i.ArticleID });
      }
      // 材料标题进行名称排序
      this.ming1.sort((a, b) => {
        var s = a.Title.toLowerCase();
        var t = b.Title.toLowerCase();
        if (s < t) return -1;
        if (s > t) return 1;
      });
    }
  }
};
</script>

<style lang="scss">
.spanABC {
  padding: 5px;
  height: 25px;
  background: #eee;
  border: 1px solid #999;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1px;
}

.spanABC:hover {
  background: #409EFF;
  cursor: pointer;
}
</style>
