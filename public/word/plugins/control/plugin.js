/** Version: 5.7.0 (TBD)
 */
(function () {
    'use strict';

    var global = tinymce.util.Tools.resolve('tinymce.PluginManager');

    var global$1 = tinymce.util.Tools.resolve('tinymce.dom.DOMUtils');

    var DOM = global$1.DOM;
    var getAttrib = function (control, name) {
      if (control && control.hasAttribute(name)) {
        return control.getAttribute(name);
      } else {
        return '';
      }
    };
    var defaultData = function () {
      return {
        style: {
          width: '',
          height: ''
        },
        option: '',
        n: '',
        ln: '',
        dv: ''
      };
    };
    var read = function (control) {
      var css = DOM.styles.parse(getAttrib(control, 'style'));
      var w = css.width ? css.width : '';
      var h = css.height ? css.height : '';
      var n = getAttrib(control, 'n');
      var ln = getAttrib(control, 'ln');
      var dv = getAttrib(control, 'dv');
      if (control.tagName === 'SELECT') {
        return {
          style: {
            width: w,
            height: h
          },
          option: control.innerHTML.replace(/<\/option><option.*?>/g, ',').replace(/<option.*?>/g, '').replace('</option>', ''),
          n: n,
          ln: ln,
          dv: dv
        };
      } else if (control.tagName === 'TEXTAREA') {
        return {
          style: {
            width: w,
            height: h
          },
          option: control.innerHTML,
          n: n,
          ln: ln,
          dv: dv
        };
      } else if (control.tagName === 'INPUT') {
        return {
          style: {
            width: w,
            height: h
          },
          option: getAttrib(control, 'value'),
          n: n,
          ln: ln,
          dv: dv
        };
      }
    };
    var isSelect = function (elm) {
      return elm.nodeName === 'SELECT';
    };
    var isInput = function (elm) {
      return elm.nodeName === 'INPUT' && DOM.getAttrib(elm, 'type') === 'text';
    };
    var isTextarea = function (elm) {
      return elm.nodeName === 'TEXTAREA';
    };
    var isCheckbox = function (elm) {
      return elm.nodeName === 'INPUT' && DOM.getAttrib(elm, 'type') === 'checkbox';
    };
    var isRadio = function (elm) {
      return elm.nodeName === 'INPUT' && DOM.getAttrib(elm, 'type') === 'radio';
    };
    var isFile = function (elm) {
      return elm.nodeName === 'INPUT' && DOM.getAttrib(elm, 'type') === 'file';
    };

    var Global = typeof window !== 'undefined' ? window : Function('return this;')();

    var typeOf = function (x) {
      var t = typeof x;
      if (x === null) {
        return 'null';
      } else if (t === 'object' && (Array.prototype.isPrototypeOf(x) || x.constructor && x.constructor.name === 'Array')) {
        return 'array';
      } else if (t === 'object' && (String.prototype.isPrototypeOf(x) || x.constructor && x.constructor.name === 'String')) {
        return 'string';
      } else {
        return t;
      }
    };
    var isType = function (type) {
      return function (value) {
        return typeOf(value) === type;
      };
    };
    var isObject = isType('object');

    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var deep = function (old, nu) {
      var bothObjects = isObject(old) && isObject(nu);
      return bothObjects ? deepMerge(old, nu) : nu;
    };
    var baseMerge = function (merger) {
      return function () {
        var objects = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          objects[_i] = arguments[_i];
        }
        if (objects.length === 0) {
          throw new Error('Can\'t merge zero objects');
        }
        var ret = {};
        for (var j = 0; j < objects.length; j++) {
          var curObject = objects[j];
          for (var key in curObject) {
            if (hasOwnProperty.call(curObject, key)) {
              ret[key] = merger(ret[key], curObject[key]);
            }
          }
        }
        return ret;
      };
    };
    var deepMerge = baseMerge(deep);

    var global$2 = tinymce.util.Tools.resolve('tinymce.EditorManager');

    var ToolbarMode;
    (function (ToolbarMode) {
      ToolbarMode['default'] = 'wrap';
      ToolbarMode['floating'] = 'floating';
      ToolbarMode['sliding'] = 'sliding';
      ToolbarMode['scrolling'] = 'scrolling';
    }(ToolbarMode || (ToolbarMode = {})));
    var ToolbarLocation;
    (function (ToolbarLocation) {
      ToolbarLocation['auto'] = 'auto';
      ToolbarLocation['top'] = 'top';
      ToolbarLocation['bottom'] = 'bottom';
    }(ToolbarLocation || (ToolbarLocation = {})));
    var getControlDlgGet = function (editor) {
      return editor.getParam('control_dlg_get');
    };
    var getControlDlgSet = function (editor) {
      return editor.getParam('control_dlg_set');
    };

    var global$3 = tinymce.util.Tools.resolve('tinymce.util.Promise');

    var getSelectedControl = function (editor) {
      var controlElm = editor.selection.getNode();
      if (controlElm && controlElm.nodeName !== 'SELECT' && controlElm.nodeName !== 'INPUT' && controlElm.nodeName !== 'TEXTAREA') {
        if (controlElm.children.length) {
          controlElm = controlElm.children[controlElm.children.length - 1];
        }
        if (controlElm.nodeName !== 'SELECT' && controlElm.nodeName !== 'INPUT' && controlElm.nodeName !== 'TEXTAREA') {
          return null;
        }
      }
      return controlElm;
    };
    var readControlDataFromSelection = function (editor) {
      var control = getSelectedControl(editor);
      editor.selection.control = control;
      return control ? read(control) : defaultData();
    };

    var collect = function (editor) {
      var controlList = new global$3(function (completer) {
        completer();
      });
      var control = readControlDataFromSelection(editor);
      return controlList.then(function () {
        return { control: control };
      });
    };

    var fromControlData = function (control) {
      return {
        style: {
          width: control.style.width,
          height: control.style.height
        },
        option: control.option,
        n: control.n,
        ln: control.ln,
        dv: { dv: control.dv }
      };
    };
    var makeDialog = function (helpers, editor) {
      return function (info) {
        var tabPanel;
        if (helpers.type === 'select') {
          tabPanel = {
            type: 'tabpanel',
            tabs: [{
                title: 'General',
                name: 'general',
                items: [
                  {
                    name: 'style',
                    type: 'sizeinput',
                    constrain: true
                  },
                  {
                    name: 'option',
                    type: 'input',
                    label: 'Option'
                  }
                ]
              }]
          };
        } else {
          tabPanel = {
            type: 'tabpanel',
            tabs: [{
                title: 'General',
                name: 'general',
                items: [
                  {
                    name: 'style',
                    type: 'sizeinput',
                    constrain: false
                  },
                  {
                    name: 'option',
                    type: 'input',
                    label: 'Value'
                  }
                ]
              }]
          };
        }
        var dlg = {
          title: helpers.type,
          size: 'normal',
          body: null,
          buttons: [
            {
              type: 'cancel',
              name: 'cancel',
              text: 'Cancel'
            },
            {
              type: 'submit',
              name: 'save',
              text: 'Save',
              primary: true
            }
          ],
          initialData: fromControlData(info.control),
          onSubmit: helpers.onSubmit(info),
          onChange: helpers.onChange()
        };
        var func = getControlDlgGet(editor);
        if (func !== undefined) {
          func(helpers.type, info.control.n, info.control.ln).then(function (re) {
            if (re.code === 200) {
              tabPanel.tabs.push({
                title: 'Db',
                name: 'db',
                items: []
              });
              tabPanel.tabs.push({
                title: 'Flow',
                name: 'flow',
                items: []
              });
              tabPanel.tabs.push({
                title: 'Formula',
                name: 'formula',
                items: []
              });
              tabPanel.tabs.push({
                title: 'SumTb',
                name: 'sumTb',
                items: []
              });
              tabPanel.tabs.push({
                title: 'Permission',
                name: 'permission',
                items: []
              });
              tabPanel.tabs[1].items = re.data[0];
              tabPanel.tabs[2].items = re.data[1];
              tabPanel.tabs[3].items = re.data[2];
              tabPanel.tabs[4].items = re.data[3];
              tabPanel.tabs[5].items = re.data[4];
              Global.console.log(re.data);
            }
            dlg.body = tabPanel;
            return dlg;
          }).then(editor.windowManager.open);
        } else {
          dlg.body = tabPanel;
          editor.windowManager.open(dlg);
        }
      };
    };
    var submitHandler = function (editor, type) {
      return function (info) {
        return function (api) {
          var data = deepMerge(fromControlData(info.control), api.getData());
          var control = editor.selection.control;
          var func = getControlDlgSet(editor);
          if (func !== undefined) {
            Global.console.log(data);
            func(type, data).then(function (re) {
              Global.console.log(re);
              if (re.code === 300) {
                api.close();
                return;
              }
              if (re.code !== 200) {
                Global.alert(re.msg);
                return;
              }
              control.setAttribute('n', re.data.n);
              control.setAttribute('ln', re.data.ln);
              api.close();
            });
          }
          if (control.style) {
            control.style.width = data.style.width;
            control.style.height = data.style.height;
          }
          if (control.tagName === 'SELECT') {
            if (data.option.trim() === '') {
              control.innerHTML = '';
            } else {
              control.innerHTML = '<option>' + data.option.replace(/,/g, '</option><option>') + '</option>';
            }
          } else if (control.tagName === 'TEXTAREA') {
            control.innerHTML = data.option;
          } else if (control.tagName === 'INPUT') {
            control.setAttribute('value', data.option);
          }
          control.setAttribute('dv', data.dv.dv);
          if (func === undefined) {
            api.close();
          }
        };
      };
    };
    var changeHandler = function () {
      return function () {
        return function (api) {
          var data = api.getData();
          Global.console.log(data);
          if ('lnk' in data) {
            if (data.lnk.vcLnkTb === 'tblStaff') {
              Global.console.log('yes');
            }
          }
        };
      };
    };
    var Dialog = function (editor, type) {
      var helpers = {
        type: type,
        onSubmit: submitHandler(editor, type),
        onChange: changeHandler()
      };
      var open = function () {
        collect(editor).then(makeDialog(helpers, editor));
      };
      return { open: open };
    };

    var insert = function (editor) {
      var select = function () {
        editor.insertContent(editor.dom.createHTML('select', { name: 'h' }));
      };
      var input = function () {
        editor.insertContent(editor.dom.createHTML('input', {
          name: 'h',
          type: 'text'
        }));
      };
      var textarea = function () {
        editor.insertContent('<textarea name="h"></textarea>');
      };
      var checkbox = function () {
        editor.insertContent(editor.dom.createHTML('input', {
          name: 'h',
          type: 'checkbox'
        }));
      };
      var radio = function () {
        editor.insertContent(editor.dom.createHTML('input', {
          name: 'h',
          type: 'radio'
        }));
      };
      var file = function () {
        editor.insertContent(editor.dom.createHTML('input', {
          name: 'h',
          type: 'file'
        }));
      };
      return {
        select: select,
        input: input,
        textarea: textarea,
        checkbox: checkbox,
        radio: radio,
        file: file
      };
    };
    var register = function (editor) {
      editor.ui.registry.addMenuButton('control', {
        icon: 'control',
        tooltip: 'Control',
        fetch: function (callback) {
          return callback('selectInsert inputInsert textareaInsert checkboxInsert radioInsert fileInsert');
        }
      });
      editor.ui.registry.addMenuItem('selectInsert', {
        icon: 'select',
        text: 'Select',
        onAction: insert(editor).select
      });
      editor.ui.registry.addMenuItem('select', {
        icon: 'select',
        text: 'Select',
        onAction: Dialog(editor, 'select').open
      });
      editor.ui.registry.addContextMenu('select', {
        update: function (element) {
          return isSelect(element) ? ['select'] : [];
        }
      });
      editor.ui.registry.addMenuItem('inputInsert', {
        icon: 'input',
        text: 'Input',
        onAction: insert(editor).input
      });
      editor.ui.registry.addMenuItem('input', {
        icon: 'input',
        text: 'Input',
        onAction: Dialog(editor, 'input').open
      });
      editor.ui.registry.addMenuItem('textareaInsert', {
        icon: 'textarea',
        text: 'Textarea',
        onAction: insert(editor).textarea
      });
      editor.ui.registry.addMenuItem('textarea', {
        icon: 'textarea',
        text: 'Textarea',
        onAction: Dialog(editor, 'textarea').open
      });
      editor.ui.registry.addContextMenu('textarea', {
        update: function (element) {
          return isTextarea(element) ? ['textarea'] : [];
        }
      });
      editor.ui.registry.addMenuItem('checkboxInsert', {
        icon: 'checkbox',
        text: 'Checkbox',
        onAction: insert(editor).checkbox
      });
      editor.ui.registry.addMenuItem('checkbox', {
        icon: 'checkbox',
        text: 'Checkbox',
        onAction: Dialog(editor, 'checkbox').open
      });
      editor.ui.registry.addMenuItem('radioInsert', {
        icon: 'radio',
        text: 'Radio',
        onAction: insert(editor).radio
      });
      editor.ui.registry.addMenuItem('radio', {
        icon: 'radio',
        text: 'Radio',
        onAction: Dialog(editor, 'radio').open
      });
      editor.ui.registry.addMenuItem('fileInsert', {
        icon: 'file',
        text: 'File',
        onAction: insert(editor).file
      });
      editor.ui.registry.addMenuItem('file', {
        icon: 'file',
        text: 'File',
        onAction: Dialog(editor, 'file').open
      });
      editor.ui.registry.addContextMenu('input', {
        update: function (element) {
          if (isInput(element)) {
            return ['input'];
          } else if (isCheckbox(element)) {
            return ['checkbox'];
          } else if (isRadio(element)) {
            return ['radio'];
          } else if (isFile(element)) {
            return ['file'];
          } else {
            return [];
          }
        }
      });
    };

    function Plugin () {
      global.add('control', function (editor) {
        register(editor);
      });
    }

    Plugin();

}());
