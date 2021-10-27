import request from '@/utils/request';

// 通用版
export function GetIni() {
  return request({
    url: '../config.json',
    method: 'get'
  });
}

// 在外网无法读取配置文件的时候，直接将配置文件写入程序代码的版本：
// export function GetIni() {
//   return Promise.resolve({
//     "code": 200,
//     "para": {
//       "title": "智慧医院综合质量监管平台",
//       "refDocInner": "192.168.62.202:8081",
//       "refDocOuter": "",
//       "pwd": "111111",
//       "pwd2": "111111",
//       "refDoc": "国标参考资料",
//       "menu_one": "自评人员审核",
//       "menu_two": "主管人员审核",
//       "menu_three": "专业组监管人员审核",
//       "menu": false,
//       "rule": 1,
//       "search": 1,
//       "refer": 2,
//       "ArticleCount": 1,
//       "defaultPassword": "12345678",
//       "Resort": false,
//       "//": "注释，Resort：评审查阅考评办法是否显示,false显示，true不显示"
//     }
//   });
// }
