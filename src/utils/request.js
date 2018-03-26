/**
 * 常规Ajax请求
 * 需要IE7+
 * 需要Promise支持
 */
const XHR = {
  get(url) {
      return new Promise((resolve, reject) => {
          const req = new XMLHttpRequest();
          req.open('GET', url, true);
          req.setRequestHeader('Cache-Control', 'no-cache')
          req.send(null);
          req.onload = () => resolve(req.responseText);
          req.onerror = err => console.log('Fetch Error : %S', err);
      });
  },
  post(url, data) {
      return new Promise((resolve, reject) => {
          const req = new XMLHttpRequest();
          req.open("POST", url, true);
          //POST方式需要自己设置http的请求头
          //req.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=UTF-8");//普通表单方式
          req.setRequestHeader("Content-Type","application/json;charset=UTF-8");//json
        //   req.setRequestHeader("Content-Type","text/plain;charset=UTF-8"); // 纯文本
          req.setRequestHeader('Cache-Control', 'no-cache')
          req.send(JSON.stringify(data));
          req.onload = () => resolve(req.responseText);
          req.onerror = err => console.log('Fetch Error : %S', err);
      });
  }
};

export default XHR;