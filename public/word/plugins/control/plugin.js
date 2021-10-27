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
        option: ''
      };
    };
    var read = function (control) {
      var css = DOM.styles.parse(getAttrib(control, 'style'));
      var w = css.width ? css.width : '';
      var h = css.height ? css.height : '';
      if (control.tagName === 'SELECT') {
        return {
          style: {
            width: w,
            height: h
          },
          option: control.innerHTML.replace(/<\/option><option>/g, ',').replace('<option>', '').replace('</option>', '')
        };
      } else if (control.tagName === 'TEXTAREA') {
        return {
          style: {
            width: w,
            height: h
          },
          option: control.innerHTML
        };
      } else if (control.tagName === 'INPUT') {
        return {
          style: {
            width: w,
            height: h
          },
          option: getAttrib(control, 'value')
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

    var global$2 = tinymce.util.Tools.resolve('tinymce.util.Promise');

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
      var controlList = new global$2(function (completer) {
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
        option: control.option
      };
    };
    var makeDialogBody = function (info, type) {
      if (type === 'select') {
        var tabPanel = {
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
        return tabPanel;
      } else {
        var tabPanel = {
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
        return tabPanel;
      }
    };
    var makeDialog = function (helpers) {
      return function (info) {
        return {
          title: helpers.type,
          size: 'normal',
          body: makeDialogBody(info, helpers.type),
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
          onSubmit: helpers.onSubmit(info)
        };
      };
    };
    var submitHandler = function (editor) {
      return function (info) {
        return function (api) {
          var data = deepMerge(fromControlData(info.control), api.getData());
          var control = editor.selection.control;
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
          api.close();
        };
      };
    };
    var Dialog = function (editor, type) {
      var helpers = {
        type: type,
        onSubmit: submitHandler(editor)
      };
      var open = function () {
        collect(editor).then(makeDialog(helpers)).then(editor.windowManager.open);
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
      return {
        select: select,
        input: input,
        textarea: textarea,
        checkbox: checkbox,
        radio: radio
      };
    };
    var register = function (editor) {
      editor.ui.registry.addMenuButton('control', {
        icon: 'control',
        tooltip: 'Control',
        fetch: function (callback) {
          return callback('selectInsert inputInsert textareaInsert checkboxInsert radioInsert');
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
      editor.ui.registry.addContextMenu('input', {
        update: function (element) {
          if (isInput(element)) {
            return ['input'];
          } else if (isCheckbox(element)) {
            return ['checkbox'];
          } else if (isRadio(element)) {
            return ['radio'];
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
