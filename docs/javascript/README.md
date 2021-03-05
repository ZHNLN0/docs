# JavaScript

## 防抖

```js
function debounce(fn, time) {
  let previous = 0, timer = null
  // 将debounce处理结构当作函数返回
  return function(...args) {
    // 获取当前事件，转换成时间戳，单位毫秒
    let now = +new Date()
    // 判断上次触发的时间和本次触发的时间差是否小于时间间隔
    if(now - previous < time) {
      // 如果小于，则本次触发设立一个新的定时器
      // 定时器结束后执行fn 
      if(timer) clearTimeout(timer)
      timer = setTimeout(() => {
        previous = now
        fn.apply(this, args)
      }, time)
    } else {
      // 第一次执行 或者时间间隔超出设定的时间间隔，执行 fn 
      previous = now
      fn.apply(this, args)
    }
  }
}
```

## 节流

```js
function throttle(fn, delay) {
  let timer = null
  return function(...args) {
    let context = this
    if(!timer) {
      timer = setTimeout(() => {
        fn.apply(context, args)
        timer = null
      }, delay)
    }
  }
}
```
## new 的实现

```js
function _new () {
  let target = {}
  let [constructor, ...args] = [...arguments]
  // 执行原型连接 target成为constructor 的实例
  target.__proto__ = constructor.prototype
  // 执行构造函数，将属性或者方法添加到我们创建的对象上
  let result = constructor.apply(target, args)
  if(result && (typeof(result) === 'object') || (typeof(result) === 'function')) {
    // 如果构造函数结构返回的是一个对象，那么返回这个对象
    return result
  }
  // 如果构造函数结构返回的不是一个对象，那么返回创建的新对象
  return target
}
```
