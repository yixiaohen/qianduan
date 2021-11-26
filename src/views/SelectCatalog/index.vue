<template>
  <div id="selectCatalog" class="selectCatalog">
    <el-backtop target=".selectCatalog"/>
    <Headers ref="Headers" @SelectContent="SelectContent"/>
    <!--    @changeCatalogID2="changeCatalogID2"-->
    <mainHeader ref="mainHeader" @changeCatalogID="changeCatalogID" @changeShowHeader="changeShowHeader"/>
    <mains ref="catalogID" :dialog-visible="dialogVisible" @changeShow="changeShow"/>
    <div class="dialog">
      <el-dialog :visible.sync="dialogVisible" width="30%">
        <el-progress
          :text-inside="true"
          :stroke-width="24"
          :percentage="percentage"
        />
      </el-dialog>
    </div>
  </div>
</template>
<script>
import Headers from './components/Header.vue';
import mainHeader from './components/mainHeader.vue';
import mains from './components/main.vue';

export default {
  name: 'Indexs',
  components: {
    Headers,
    mainHeader,
    mains
  },
  data() {
    return {
      dialogVisible: false,
      percentage: 0,
      percentageIndex: 2,
      test: 'tests',
      tableData: [],
      catalogID: 0,
      catalogID2: '',
      Content: '' // 要搜索的内容
    };
  },
  methods: {
    // 获取输入框传过来的内容，进行当前章节搜索
    SelectContent(val) {
      this.Content = val;
      this.changeCatalogID(this.catalogID);
      this.$nextTick(() => {
        this.Content = '';
      });

    },
    changeShowHeader(para) { // 从mainHeader让等待条开启
      this.dialogVisible = para;
    },
    changeShow(para) { // 从mains让等待条开启
      this.dialogVisible = para;
    },

    async changeCatalogID(val) {
      this.catalogID = val;
      this.$nextTick(() => {
        const interval = setInterval(() => {
          if (this.percentage >= 100) {
            clearInterval(interval);
            // this.$message.success('加载成功');
            this.dialogVisible = false;
            this.percentage = 0;
          } else {
            this.percentage += this.percentageIndex;
          }
        }, 60);
        this.$refs.catalogID.GetcatalogSecond(val, this.Content);
      });
    }
    // async changeCatalogID2(val) {
    //   console.log('执行了');
    //   this.$nextTick(() => {
    //     this.$refs.catalogID.GetcatalogSecond(this.catalogID);
    //   });
    // }

  }
};
</script>
<style lang="scss">
.selectCatalog {
  height: 90vh;
  overflow: auto;
}

.dialog {
  margin-top: 50% !important;
  width: 30%;

  .el-dialog .el-dialog__header {
    padding: 0 !important;
    background-color: #ffffff !important;
    opacity: 0 !important;
  }

  .el-dialog {
    width: 20% !important;
    top: 20% !important;
    background: #fff0 !important;
    box-shadow: 0 1px 3px rgb(0 0 0 / 0%) !important;
  }
}
</style>
