//  此文件中的数据全部挂载到全局
export const getuuid = () => {
  if (window.crypto && window.crypto.getRandomValues) {
    // 使用crypto API生成随机数
    const array:Uint8Array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    // 将随机数转换为十六进制字符串
    const uuid = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    return uuid;
  } else {
    console.error('Crypto API not available. Unable to generate UUID.');
    return null;
  }
}

export default{
  getuuid
}
