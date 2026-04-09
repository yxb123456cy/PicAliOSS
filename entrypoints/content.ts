// content script 是运行在网页上下文（DOM）中的 JavaScript 脚本;
// 由浏览器扩展注入，能访问网页的 DOM 结构，但和网页自身的脚本、扩展的后台脚本（background）有严格的隔离。
// 核心特点：
// 1.能读写当前网页的 DOM，修改样式、文本、节点等；
// 2.不能访问网页自身的全局变量 / 函数（如网页里定义的 window.xxx）；
// 3.不能直接访问扩展的 chrome.api 全部方法（仅能访问 chrome.runtime、chrome.storage 等少数 API）；
// 4.可通过 chrome.runtime.sendMessage 与扩展的后台脚本通信。
export default defineContentScript({
  matches: ['*://*.google.com/*'],
  main() {
    console.log('Hello content.');
  },
});
