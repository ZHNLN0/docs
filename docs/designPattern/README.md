# JavaScript 数据结构

## 类的相关概念

  类的成员的相关概念说明

- 私有属性和私有方法不能被继承，不能被外部访问，包括不能通过类的自身访问，实例化的对象对其也是无感知的，但是可以通过向外暴露特权方法对其进行访问。（静态私有成员，静态私有方法则不向外暴露特权函数）
- 静态公有属性和静态公有方法能够被实例访问，但是并不是实例自身的属性或方法（通过原型链访问）
- 公有属性和公有方法能够被实例继承和使用
- 特权方法本质还是公有方法，向外暴露（通过闭包访问私有属性和私有方法）

## new 关键字的实现和说明

```js
  function _new () {
    let target = {}
    let [constructor, ...args] = [...arguments]
    // 执行原型连接 target成为constructor 的实例
    target.__proto__ = constructor.prototype
    // 执行构造函数，将属性或者方法添加到我们创建的对象上
    let result = constructor.apply(target, args)
    console.log(typeof result)
    if(result && (typeof(result) === 'object') || (typeof(result) === 'function')) {
      // 如果构造函数结构返回的是一个对象或者函数，那么返回构造函数的执行结果
      return result
    }
    // 如果构造函数结构返回的不是一个对象，那么返回创建的新对象
    return target
  }
```

## instanceof 关键字实现原理

```js
function _instanceof (A, B) {
  const BPrototype = B.prototype
  const A = A.__proto__
  while(true) {
    if (A === null) return false
    if (BPrototype === A) return true
    A = A.__proto__
  }
}
```

- JavaScript new 关键字的操作就是为一个新对象逐一赋值的，并将新对象的 __proto__ 连接到构造函数的原型对象 prototype
- 原则上构造函数是不会 return 任何值的，但是在 JavaScript 中构造函数本质上就是一个普通的函数，所以在使用 new 关键创建新的对象时，如果 return 的是引用数据类型，那么 new 创建的新的对象就是 return 的结果，否则正常执行构造函数逻辑。
- 构造函数未使用 new 创建实例时，一定要注意执行上下文，此时的执行上下文并不是创建的对线。

## 构造函数的安全模式

- 构造函数本质就是一个函数，但是在对 this 赋值的时候必须考虑 执行上线文的环境，避免 this 赋值是造成作用于的混乱。
- IIFE 构建闭包，生成私有成员
- 利用 ```js this instanceof ConstructorsFuncution``` 检查是否正确使用 new 关键字实例化构造函数

### 代码实现构造函数

使用构造函数实现一个类

```js
function Book (owner) { // 静态私有属性
  let author = 'zhangsan'
  // 私有方法
  function totalPage () {}
  // 公有属性
  this.owner = owner
  this.price 
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
Book.prototype.changColor = function () {}
```

## 类的继承

### 类式继承

```js
function GithubUser(username, password) {
  let _password = password 
  this.username = username 
  GithubUser.prototype.login = function () {
    console.log(this.username + '要登录Github，密码是' + _password)
  }
}
// 可动态传参版本
function JuejinUser(username, password) {
  this.articles = 3 // 文章数量
  JuejinUser.prototype = new GithubUser(username, password)
  JuejinUser.prototype.readArticle = function () {
    console.log('Read article')
  }
  // 手动原型链连接
  this.__proto__ = JuejinUser.prototype
}
```

- 类式继承利用了实例对象原型链的索引规则，将子类构造函数原型对象实例化为父类的实例，子类的实例也就能够通过原型链使用到父类的方法
- 类式继承仅能实现公有方法和公有属性，静态公有属性和静态公有方法无法继承
- 子类修改原本的原型对象使得子类的实例的 __proto__ 指向不在是子类现有的原型对象的，（可以手动原型链的连接）
- 当存在引用数据类型的 this. 赋值时，多个实例对象会共享父类属性

### 构造函数继承

```js
function GithubUser(username, password) {
  let _password = password 
  this.username = username 
  GithubUser.prototype.login = function () {
    console.log(this.username + '要登录Github，密码是' + _password)
  }
}

function JuejinUser(username, password) {
  GithubUser.call(this, username, password)
  this.articles = 3 // 文章数量
}
```

- 构造函数继承无法继承父类原型的方法

### 组合式继承

```js
function GithubUser(username, password) {
  let _password = password 
  this.username = username 
  GithubUser.prototype.login = function () {
    console.log(this.username + '要登录Github，密码是' + _password)
  }
}

function JuejinUser(username, password) {
  GithubUser.call(this, username, password)
  this.articles = 3 // 文章数量
}
JuejinUser.prototype = new GithubUser()
```

- 子类仍旧无法传递动态参数给父类
- 父类的构造函数被调用了两次

### 原型式继承

```js
function inheritObject (o) {
  function F () {}
  F.prototype = o
  return new F()
} 

JuejinUser.prototype = createObject(GithubUser)
```

- 没有解决类式继承的问题

### 寄生继承

```js
const juejinUserSample = {
  username: 'ulivz',
  password: 'xxx'
}

function JuejinUser(obj) {
  var o = Object.create(obj)
    o.prototype.readArticle = function () {
    console.log('Read article')
  }
  return o;
}
```

- 基于对象父类继承，每次实例化都先创建一个父类（值的创建，不是地址的引用），在子类中进行扩展
- 但是继承的是一个单例对象，应用场景较少
- 实例化的时候都不在需要 new 关键字了，本身就是一次函数的调用了

### 寄生组合继承

```js
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
```
