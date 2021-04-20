function _new () {
  let target = {}
  let [constructor, ...args] = [...arguments]
  // 执行原型连接 target成为constructor 的实例
  target.__proto__ = constructor.prototype
  // 执行构造函数，将属性或者方法添加到我们创建的对象上
  let result = constructor.apply(target, args)
  console.log(typeof result)
  if(result && (typeof(result) === 'object') || (typeof(result) === 'function')) {
    // 如果构造函数结构返回的是一个对象，那么返回这个对象
    return result
  }
  // 如果构造函数结构返回的不是一个对象，那么返回创建的新对象
  return target
}


function Book (owner) {  // 静态私有属性
  let author = 'zhangsan'
  // 私有方法
  function totalPage () {}
  // 公有属性
  this.owner = owner
  // 公有方法
  this.read = function () {}
  // 特权方法
  this.getAuthor = function () {
    return author
  }
  // 构造器 （属于特权函数）
  this.setAuthor = function (name) {
    author = name
  }
}
// 静态公有属性
Book.prototype.wordColor = 'black'
// 静态公有方法
Book.prototype.changColor = function (color) {
  Book.prototype.wordColor = color
}

function GithubUser(username, password) {
  let _password = password 
  this.username = username 
  GithubUser.prototype.login = function () {
    console.log(this.username + '要登录Github，密码是' + _password)
  }
}

function JuejinUser(username, password) {
  this.articles = 3 // 文章数量
  JuejinUser.prototype = new GithubUser(username, password)
  JuejinUser.prototype.readArticle = function () {
    console.log('Read article')
  }
  this.__proto__ = JuejinUser.prototype
}

function createObject(o) {
  // 创建临时类
  function f() {
      
  }
  // 修改类的原型为o, 于是f的实例都将继承o上的方法
  f.prototype = o
  return new f()
}


// 寄生式继承 仅能继承 对象父类

const ParentObject = { name: 'zhang' }

function ChildClass () {
  // 创建寄生对象
  const o = Object.create(ParentObject)
  // 扩展对象
  o.func = function() {}
  return o
}

// 寄生组合式继承

function inheritsProperty (child, parent) {
  // 创建父类寄生对象
  const p = Object.create(parent.prototype)
  // 重写被污染的子类的constructor
  // 因为 Object.assign 会丢失 child.prototype.constructor 这是一个不可被枚举的属性
  console.log(Reflect.getOwnPropertyDescriptor(child.prototype, 'constructor'))
  p.constructor = child
  // 将父类原型和子类原型合并，并赋值给子类的原型
  // 注意 Object.assign 只能作用到可被枚举的对象
  child.prototype = Object.assign(p, child.prototype)
}

function Animale (common) {
  this.common = common
}
Animale.prototype.getCommon = function () {
  console.log(this.common)
}
function Dog (common, name) {
  Animale.call(this, common)
  this.name = name
}

inheritsProperty(Dog, Animale)

const ww = new Dog('4跳腿', 'wangwang')
ww.getCommon()

console.log(ww.constructor)






