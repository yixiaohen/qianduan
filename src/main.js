import Vue from 'vue';

import 'normalize.css/normalize.css'; // A modern alternative to CSS resets
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/styles/index.scss'; // global css
import App from './App';
import store from './store';
import router from './router';

import '@/icons'; // icon
import '@/permission'; // permission control
import '@/utils/directive';
import '@/assets/alicon/iconfont.css';
import 'default-passive-events';
import CKEditor from 'ckeditor4-vue';
/* default-passive-events解决报错elelemt ui警告
element-ui.common.js?5c96:10126 [Violation] Added
non-passive event listener to a scroll-blocking 'mousewheel'
event. Consider marking event handler as 'passive' to make
the page more responsive. See https://www.chromestatus.com/feature/5745543795965952Î */

// //引用富文本编辑器
// import VueQuillEditor from 'vue-quill-editor'
// //引入富文本css
// // require styles
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'
// //富文本编辑器添加实例
// Vue.use(VueQuillEditor)

Vue.use(ElementUI);
// CKEditor.component.props.editorUrl.default  = require('../public/ckeditor')
Vue.use(CKEditor);
// 默认全部使用el-dialog时点击外部不会关闭对话框，防止误触
ElementUI.Dialog.props.closeOnClickModal.default = false;
Vue.config.productionTip = false;
// 注册一个原型，用来发送通知通信
export const eventBus = new Vue();
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
