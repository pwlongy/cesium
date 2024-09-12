import renders from './renders';

export async function readBuffer(file) {
  return new Promise((resolve, reject) => {
    // 使用 FileReader 对象读取文件
    const reader = new FileReader();
    // 文件加载完成后的回调函数
    reader.onload = (loadEvent) => resolve(loadEvent.target.result);
    reader.onerror = (e) => reject(e);
    // 读取文件并将其内容解读为二进制数据的 ArrayBuffer 对象
    reader.readAsArrayBuffer(file);
  });
}

export async function readDataURL(buffer) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = loadEvent => resolve(loadEvent.target.result);
    reader.onerror = e => reject(e);
    reader.readAsDataURL(new Blob([buffer]));
  });
}

export async function readText(buffer) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = loadEvent => resolve(loadEvent.target.result);
    reader.onerror = e => reject(e);
    reader.readAsText(new Blob([buffer]), 'utf-8');
  });
}

export function getExtend(name) {
  const dot = name.lastIndexOf('.')
  return name.substr(dot + 1);
}

export async function render(buffer, type, target) {
  console.log()
  const handler = renders[type];
  if (handler) {
    return handler(buffer, target);
  }
  return renders.error(buffer, target, type);
}
