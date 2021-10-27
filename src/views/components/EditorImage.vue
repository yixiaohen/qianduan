<template>
  <div class="upload-container">
    <el-button
      icon="el-icon-upload"
      :disabled="disabled"
      size="mini"
      @click=" dialogVisible=true"
    >
      上传附件
    </el-button>
    <el-dialog
      title="附件上传"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      append-to-body
    >
      <el-upload
        :multiple="true"
        :file-list="fileList"
        :show-file-list="true"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
        class="editor-slide-upload"
        :action="IP"
      >
        <el-button
          size="small"
          type="primary"
        >
          选择需要上传的文件
        </el-button>
      </el-upload>
      <!-- <el-button size="mini" @click="dialogVisible = false">
        取消
      </el-button> -->
      <!-- <el-button size="mini" type="primary" @click="handleSubmit">
        确定
      </el-button> -->
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'EditorSlideUpload',
  props: {
    color: {
      type: String,
      default: '#1890ff'
    },
    buttondisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false,
      disabled: this.buttondisabled,
      IP: '/api/Article/UploadFile',
      listObj: {},
      fileList: []
    };
  },
  methods: {
    checkAllSuccess() {
      return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess);
    },
    handleSubmit() {
      const arr = Object.keys(this.listObj).map(v => this.listObj[v]);
      if (!this.checkAllSuccess()) {
        this.$message('请等待所有文件成功上传。 如果出现网络问题，请刷新页面，然后重新上传！');
        return;
      }
      this.$emit('successCBK', arr);
      this.listObj = {};
      this.fileList = [];
      this.dialogVisible = false;
    },
    handleSuccess(response, file) {
      this.$emit('successCBK', response);
    },
    handleRemove(file) {
      const uid = file.uid;
      const objKeyArr = Object.keys(this.listObj);
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          delete this.listObj[objKeyArr[i]];
          return;
        }
      }
    },
    beforeUpload(file) {
      const _self = this;
      const _URL = window.URL || window.webkitURL;
      const fileName = file.uid;
      this.listObj[fileName] = {};
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = _URL.createObjectURL(file);
        img.onload = function() {
          _self.listObj[fileName] = { hasSuccess: false, uid: file.uid, width: this.width, height: this.height };
        };
        resolve(true);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.editor-slide-upload {
  margin-bottom: 20px;
  ::v-deep .el-upload--picture-card {
    width: 100%;
  }
}
</style>
