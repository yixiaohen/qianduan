import { getFirstLetterList } from './pinyin_getFirstLetterList';

export const sortS = {
  sortw(arrs) {
    // 判断字符串是否全是中文
    function isAllChinese(str) {
      return /^[\u4E00-\u9FA5]+$/.test(str);
    }

    // 判断字符是否为中文
    function isChinese(char) {
      return /^[\u4E00-\u9FA5]$/.test(char);
    }

    const arr = arrs;
    const ASCarr = arr.sort((a, b) => {
      // 数字排在字符串前面
      if (typeof a.CatalogCode === 'number' && typeof b.CatalogCode === 'string') {
        return -1;
      }

      if (typeof a.CatalogCode === 'string' && typeof b.CatalogCode === 'number') {
        return 1;
      }

      // 当存在非数字时
      if (isNaN(a.CatalogCode) || isNaN(b.CatalogCode)) {
        // 全汉字的排在非全汉字的后面
        if (isAllChinese(a.CatalogCode) && !isAllChinese(b.CatalogCode)) {
          return 1;
        }

        if (!isAllChinese(a.CatalogCode) && isAllChinese(b.CatalogCode)) {
          return -1;
        }

        // 存在非数字的数据时，都转为字符串进行比较
        a.CatalogCode = a.CatalogCode.toString();
        b.CatalogCode = b.CatalogCode.toString();

        let result = 0;

        // 依次比较两个字符串的各项字符
        for (let index = 0; index < ((a.CatalogCode.length - b.CatalogCode.length) ? b.CatalogCode.length : a.CatalogCode.length); index++) {
          // 汉字排在非汉字的后面
          if (!isChinese(a[index]) && isChinese(b[index])) {
            result = -1;
          }

          if (isChinese(a[index]) && !isChinese(b[index])) {
            result = 1;
          }

          // 若两个汉字进行比较，则比较他们的拼音首字母
          if (isChinese(a[index]) && isChinese(b[index])) {
            const pinyinA = getFirstLetterList(a[index]).toString();
            const pinyinB = getFirstLetterList(b[index]).toString();

            result = pinyinA.localeCompare(pinyinB, 'zh-Hans-CN', { sensitivity: 'accent' });
          }

          // 若已经比较出结果，则跳出循环，不再继续比较剩余字符
          if (result !== 0) {
            break;
          }
        }

        // 只要有一个无法转换为数字——转换为字符串进行比较——先按字符排序，然后按照数字排序
        return result || a.CatalogCode.toString().localeCompare(b.CatalogCode.toString(), 'zh-Hans-CN', { sensitivity: 'accent' });
      } else {
        // 都能转换为数字——转换为数字进行比较——从小到大排序
        return Number(a.CatalogCode) - Number(b.CatalogCode);
      }
    });
    console.log(ASCarr);
    return ASCarr;
  }
};
