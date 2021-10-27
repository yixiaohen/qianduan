<template>
  <div>
    <div>
      <input
        id="files"
        ref="refFile"
        type="file"
        class="el-button el-button--primary el-button--mini"
        @change="fileLoad"
      >
      <input
        type="button"
        class="el-button el-button--success el-button--mini"
        value="提交上传"
        @click="uploadFile"
      >
    </div>
    <div class="box-card-view">
      <split-pane :min-percent="30" :default-percent="45" split="vertical">
        <template slot="paneL">
          <table>
            <tr>
              <td><span id="prompt" /></td>
            </tr>
            <tr valign="top">
              <td><p id="content" /></td>
            </tr>
          </table>
        </template>
        <template slot="paneR">
          <table>
            <tr>
              <td>试题必须保存为UTF8编码txt格式，标准格式如下</td>
            </tr>
            <tr valign="top">
              <td><img src="../../../assets/examImport.png"></td>
            </tr>
          </table>
        </template>
      </split-pane>
    </div>
  </div>
</template>

<script>
import splitPane from 'vue-splitpane';
import { InputTxt } from '@/api/KS_Topic';

function isPaper(s) {
  var type = ['单选题', '多选题', '判断题', '填空题', '简答题'];
  for (var i = 0; i < type.length; i++) {
    if (s.indexOf(type[i]) > 0) {
      return true;
    }
  }
  return false;
}

export default {
  components: { splitPane },
  methods: {
    fileLoad() {
      try {
        document.getElementById('prompt').innerText = '';
        document.getElementById('content').innerText = '';

        const f = this.$refs.refFile.files[0];
        var reader = new FileReader();
        // InputStreamReader aa= new InputStreamReader(new FileInputStream（f）,"UTF-8");
        reader.readAsText(f);
        reader.onload = function() {
          var a = this.result;
          document.getElementById('content').innerText = a;
          if (!isPaper(a)) {
            document.getElementById('prompt').innerText =
              '文件格式不对，需要另存为txt文本格式，并且编码选为UTF8，且至少包含有单选题,多选题,判断题,填空题,简答题类型之一';
          }
        };
      } catch (error) {
        console.log(error);
      }
    },
    uploadFile() {
      try {
        const f = this.$refs.refFile.files[0];
        var reader = new FileReader();
        // InputStreamReader aa= new InputStreamReader(new FileInputStream（f）,"UTF-8");
        reader.readAsText(f);
        reader.onload = async function() {
          var a = this.result;
          if (isPaper(a)) {
            a = a.replace(/\r/gi, '\n');
            const paper = {
              filename: f.name,
              condition: a,
              condition1: window.userInfo[0].UserID
            };
            try {
              const { msg } = await InputTxt(paper);
              document.getElementById('prompt').innerText = msg;
            } catch (e) {
              document.getElementById('prompt').innerText = e;
              console.log(e);
            }
          } else {
            document.getElementById('prompt').innerText =
              '文件格式不对，需要另存为txt文本格式，并且编码选为UTF8，且至少包含有单选题,多选题,判断题,填空题,简答题类型之一';
          }
        };
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../ExampleTrainStyles/index.scss';
</style>
