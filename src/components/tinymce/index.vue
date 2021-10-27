<template>
  <div>
    <input
      id="upload"
      ref="upload"
      type="file"
      accept="image/*"
      hidden
      @change="uploadChange"
    >
    <textarea id="word" />
  </div>
</template>
<script>
import { uploadFile } from '@/api/upload';

let uploadCallback = null;
export default {
  methods: {
    deactivated() {
      /* 销毁编辑器 */
      this.$nextTick(() => {
        tinymce.get('word').destroy();
      });
    },
    uploadChange() {
      var file = this.$refs.upload.files[0];
      if (file === undefined) return;

      var reader = new FileReader();
      if (this.$refs.upload.accept === 'image/*') {
        reader.onload = function() {
          var id = 'blobid' + new Date().getTime();
          var blobCache = tinymce.activeEditor.editorUpload.blobCache;
          var base64 = reader.result.split(',')[1];
          var blobInfo = blobCache.create(id, file, base64);
          blobCache.add(blobInfo);
          uploadCallback(blobInfo.blobUri(), { title: file.name });
          document.getElementById('upload').value = '';
        };

        reader.readAsDataURL(file);
      } else {
        reader.onload = async function() {
          const attachment = new FormData();
          attachment.append('file', new File([this.result], file.name));

          const re = await uploadFile(attachment);
          if (re.code == 200) { uploadCallback(re.data[0].FileUrl, { text: file.name }); } else alert(re.msg);

          document.getElementById('upload').value = '';
        };

        reader.readAsArrayBuffer(file);
      }
    },
    setContent(Content) {
      this.$nextTick(() => {
        const content = Content;
        tinymce.init({
          /* 创建编辑器 */
          selector: 'textarea#word',
          height: '45vh',
          menubar: false,
          language: 'zh_CN',
          extended_valid_elements:
            'input[name|type|value|size|style],textarea[name|rows|cols|style]',
          contextmenu: 'image imagetools select input textarea link table',
          plugins: [
            'advlist lists autolink link image imagetools pagebreak charmap emoticons print \
             searchreplace visualblocks fullscreen \
                 media table paste code wordcount control'
          ],
          toolbar:
            'post cancel | undo redo | table control image link insertfile | fontselect fontsizeselect formatselect | bold italic forecolor backcolor | \
             alignleft aligncenter alignright alignjustify | \
             removeformat | pagebreak charmap emoticons | print | fullscreen code',
          automatic_uploads: true,
          file_picker_types: 'image file',
          file_picker_callback: function(cb, value, meta) {
            if (meta.filetype == 'file') {
              uploadCallback = cb;
              document.getElementById('upload').accept = '*';
              document.getElementById('upload').click();
            } else if (meta.filetype == 'image') {
              uploadCallback = cb;
              document.getElementById('upload').accept = 'image/*';
              document.getElementById('upload').click();
            }
          },

          imagetools_toolbar:
            'rotateleft rotateright | flipv fliph | editimage imageoptions',

          setup: function(editor) {
            editor.on('init', e => {
              editor.setContent(content);
            });
          },
          content_style:
            'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        });
      });
    },
    Submit() {
      /* 获取内容 */
      const Content = tinymce.activeEditor.getContent();
      return Content;
    }
  }
};
</script>
