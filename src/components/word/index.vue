<template>
  <el-row>
    <textarea id="word" />
  </el-row>
</template>
<script>
/* 编辑器wold */
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    heights: {
      type: String,
      default: '50vh'
    }
  },
  created() {
    this.creadeWord();
  },
  methods: {
    creadeWord() {
      this.$nextTick(() => {
        tinymce.init({
          selector: 'textarea#word',
          height: this.heights,
          menubar: false,
          language: 'zh_CN',
          contextmenu: 'image imagetools select input textarea table',
          plugins: [
            'advlist lists autolink link image imagetools pagebreak charmap emoticons print \
             searchreplace visualblocks fullscreen \
             media table paste code wordcount control'
          ],
          toolbar:
            'post cancel | undo redo | table control image link insertfile | fontselect fontsizeselect formatselect | bold italic forecolor backcolor | \
             alignleft aligncenter alignright alignjustify | \
             removeformat | pagebreak charmap emoticons | print | fullscreen code',
          content_style:
            'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        });
        setTimeout(() => {
          /* 首次打开时的内容 */
          tinymce.activeEditor.setContent(this.value);
        }, 500);
      });
    },
    /* 默认值 */
    setContent(value) {
      setTimeout(() => {
        tinymce.activeEditor.setContent(value);
      }, 500);
    },
    /* 获取编辑框里的内容 */
    getContent() {
      return tinymce.activeEditor.getContent();
    },
    /* 清空编辑器 */
    clearContent() {
      setTimeout(() => {
        tinymce.activeEditor.setContent('');
      }, 500);
    }
  }
};
</script>
