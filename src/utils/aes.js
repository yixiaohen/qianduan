/**
 * 对页面上输入的密码进行加密传输给后台进行验证，对返回的数据进行解密，在页面展示
 */
const CryptoJS = require('crypto-js'); // 引入AES源码js
export default {

  /** ************************************************************
    *字符串加密
    *   str：需要加密的字符串
    ****************************************************************/
  encrypt(str) {
    var KEY = '22pmj8da97161cb58f408f919871a1a4';// 32位
    var IV = '1234567890000000';// 16位
    var key = CryptoJS.enc.Utf8.parse(KEY);
    var iv = CryptoJS.enc.Utf8.parse(IV);
    var encrypted = '';
    var srcs = CryptoJS.enc.Utf8.parse(str);
    encrypted = CryptoJS.AES.encrypt(srcs, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.ciphertext.toString();
  },
  /** ************************************************************
    *字符串解密
    *   str：需要解密的字符串
    ****************************************************************/
  decrypt(str) {
    var KEY = '22pmj8da97161cb58f408f919871a1a4';// 32位
    var IV = '1234567890000000';// 16位
    var key = CryptoJS.enc.Utf8.parse(KEY);
    var iv = CryptoJS.enc.Utf8.parse(IV);
    var encryptedHexStr = CryptoJS.enc.Hex.parse(str);
    var srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    var decrypt = CryptoJS.AES.decrypt(srcs, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
  }

};
