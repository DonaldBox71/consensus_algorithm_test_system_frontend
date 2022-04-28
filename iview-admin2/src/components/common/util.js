import Vue from 'vue'
import CryptoJS from 'crypto-js'

export const showTitle = (item, vm) => {
  return vm.$config.useI18n ? vm.$t(item.name) : ((item.meta && item.meta.title) || item.name)
}

// export default {//EBC 加密
//   encrypt(word, keyStr){ 
//     keyStr = keyStr ? keyStr : 'abcdefgabcdefg12';
//     var key  = CryptoJS.enc.Utf8.parse(keyStr);//Latin1 w8m31+Yy/Nw6thPsMpO5fg==
//     var srcs = CryptoJS.enc.Utf8.parse(word);
//     var encrypted = CryptoJS.AES.encrypt(srcs, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
//     return encrypted.toString();
//   },
//   //解密
//   decrypt(word, keyStr){  
//     keyStr = keyStr ? keyStr : 'abcdefgabcdefg12';
//     var key  = CryptoJS.enc.Utf8.parse(keyStr);//Latin1 w8m31+Yy/Nw6thPsMpO5fg==
//     var decrypt = CryptoJS.AES.decrypt(word, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
//     return CryptoJS.enc.Utf8.stringify(decrypt).toString();
//   }

// }

export default {// CBC 加密
  encrypt(plaintText, keyStr, ivStr) {
    keyStr = keyStr ? keyStr : "beijing-ittc626*";
    ivStr = ivStr ? ivStr : "beijing-ittc626*";
    var key = CryptoJS.enc.Utf8.parse(keyStr);
    let iv = CryptoJS.enc.Utf8.parse(ivStr);
    var encryptedData = CryptoJS.AES.encrypt(plaintText, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    encryptedData = encryptedData.ciphertext.toString();
    // console.log("加密后-no-hex：" + encryptedData);
    return encryptedData
  
    },
    // 解密
     decrypt(word, keyStr, ivStr) {
      keyStr = keyStr ? keyStr : "beijing-ittc626*";
      ivStr = ivStr ? ivStr : "beijing-ittc626*";
      var key = CryptoJS.enc.Utf8.parse(keyStr);
      let iv = CryptoJS.enc.Utf8.parse(ivStr);
  
      var decrypt = CryptoJS.AES.decrypt(word, key, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
      return decrypt.toString(CryptoJS.enc.Utf8);
    }

 };


  