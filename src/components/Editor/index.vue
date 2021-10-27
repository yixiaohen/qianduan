<template>
  <div ref="wangeditor" style="text-align: left; height: 100%" class="style" />
</template>

<script>
import E from 'wangeditor';

export default {
  name: 'EditorComponent',
  // model: {
  //   prop: 'value',
  //   event: 'change'
  // },
  props: {
    value: {
      type: String,
      default: ''
    },
    isClear: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      editor: null
    };
  },
  watch: {
    clear(val) {
      if (val) {
        this.editor.txt.clear();
      }
    }
    // value(v, h) {
    //   this.editor.txt.html(v)
    // }
  },
  mounted() {
    this.editor = new E(this.$refs.wangeditor);
    this.editor.customConfig.pasteFilterStyle = false;
    this.editor.customConfig.uploadImgShowBase64 = true;
    this.editor.customConfig.onchange = v => {
      this.$emit('change', v);
    };
    this.editor.create();
  },
  methods: {
    setContent(content) {
      try {
        content = content || ' ';
        this.editor.txt.html(content);
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>
<style>
.w-e-toolbar {
  flex-wrap: wrap;
}
/* .w-e-text-container {
  position: relative;
  top: 0px;
  bottom: 0px;
  left: 0px;
} */
</style>
