// 它是一个无界面、轻量级的后台脚本（对应 background.js），独立于 popup、网页标签页运行；
// 它没有 DOM 访问权限（不能用 document / window），也不能操作页面元素；
// 它是事件驱动的：只有触发特定事件（如扩展安装、消息接收、定时器）时才会激活，闲置一段时间（约 30 秒）后会自动休眠，事件触发时又会唤醒；
export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });
});
